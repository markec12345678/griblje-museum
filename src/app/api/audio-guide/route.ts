import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMinuteStory } from "@/lib/minute-stories";
import { synthesizeSpeech, type SynthResult } from "@/lib/tts";
import { MAX_CHARS, prepareForTts, splitIntoChunks } from "@/lib/audio-chunks";
import { clientIpOf, rateLimited } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
// Sinteza TTS lahko traja več kot privzetih 10 s (hladen klic ~20 s) —
// na Vercelu potrebujemo višjo mejo trajanja funkcije.
export const maxDuration = 60;

/**
 * GET /api/audio-guide?slug=<exhibit>&lang=sl|en&chunk=<i>
 *
 * Avdio vodnik muzeja — sinteza govora (TTS) po zgledu vodilnih muzejskih
 * aplikacij (British Museum, Art Institute of Chicago). Vsak posnetek je
 * izrecno označen kot sintetiziran — nikoli kot avtentično pričevanje.
 *
 * Omejitve TTS: sinteza je omejena po dolžini besedila na zahtevo →
 * besedilo delimo na odseke (MAX_CHARS, z varnostno rezervo). Čiste funkcije
 * deljenja besedila so v src/lib/audio-chunks.ts (preverljive brez strežnika).
 */

type Lang = "sl" | "en";

/* Ponudniki govora: veriga ElevenLabs → z-ai (src/lib/tts.ts), samo
 * strežniška stran. Ključi živijo v env (ELEVENLABS_API_KEY, ZAI_CONFIG).
 * Očistitev besedila in deljenje na odseke: src/lib/audio-chunks.ts. */

/* Pomnilniški predpomnilnik: slug|lang → odseki besedila + posnetki.
 * Posnetki so veliki, zato meja velja po SKUPNIH BAJTIH (in ne le po
 * številu vnosov); ob presegu izločamo najstarejše vnose (vrstni red
 * vložitve). Sintezo v teku si hkratne enake zahteve delijo (in-flight
 * dedup) — hladen posnetek se sintetizira samo enkrat. */
type CacheEntry = { chunks: string[]; audio: (SynthResult | undefined)[] };
const audioCache = new Map<string, CacheEntry>();
const CACHE_MAX_BYTES = 64 * 1024 * 1024; // 64 MB skupaj
const CACHE_MAX_ENTRIES = 40;
let cachedBytes = 0;

/* Sinteze, ki trenutno tečejo: "slug|lang|chunk" → obljuba. */
const inflight = new Map<string, Promise<SynthResult>>();

function cacheKey(slug: string, lang: Lang, minute: boolean) {
  return `${slug}|${lang}${minute ? "|minute" : ""}`;
}

function evictIfNeeded(excludeKey?: string) {
  while (
    (cachedBytes > CACHE_MAX_BYTES || audioCache.size > CACHE_MAX_ENTRIES) &&
    audioCache.size > 1
  ) {
    const oldest = audioCache.keys().next().value;
    if (oldest === undefined || oldest === excludeKey) break;
    const entry = audioCache.get(oldest);
    if (entry) {
      for (const buf of entry.audio) cachedBytes -= buf?.buffer.length ?? 0;
    }
    audioCache.delete(oldest);
  }
}

function storeAudio(
  key: string,
  entry: CacheEntry,
  chunk: number,
  audio: SynthResult
) {
  if (entry.audio[chunk]) return;
  entry.audio[chunk] = audio;
  // Štejemo samo bajte, ki so res v predpomnilniku (vnos je medtem
  // lahko bil izločen).
  if (audioCache.get(key) === entry) {
    cachedBytes += audio.buffer.length;
    evictIfNeeded(key);
  }
}

/* prepareForTts in splitIntoChunks živita v src/lib/audio-chunks.ts —
 * uvoženi zgoraj (preverljivi brez strežnika, tests/audio-chunks.test.ts). */

/** Sestavi pripoved vodnika: naslov, obdobje, povzetek, zgodba. */
function buildNarration(
  exhibit: {
    titleSi: string;
    titleEn: string;
    periodSi: string;
    periodEn: string;
    summarySi: string;
    summaryEn: string;
    storySi: string;
    storyEn: string;
    slug: string;
  },
  lang: Lang
): string {
  const title = lang === "sl" ? exhibit.titleSi : exhibit.titleEn;
  const period = lang === "sl" ? exhibit.periodSi : exhibit.periodEn;
  const summary = lang === "sl" ? exhibit.summarySi : exhibit.summaryEn;
  const story = lang === "sl" ? exhibit.storySi : exhibit.storyEn;

  const intro =
    lang === "sl"
      ? `Muzej vasi Griblje. Avdio vodnik, zapis ${exhibit.slug}.`
      : `Griblje Village Museum. Audio guide, record ${exhibit.slug}.`;

  return prepareForTts(`${intro} ${title}. ${period}. ${summary} ${story}`);
}

async function synthesize(text: string, lang: Lang): Promise<SynthResult> {
  return synthesizeSpeech(text, lang);
}

/* --- Omejitev hitrosti SINTEZE (samo hladni klici) -------------------- */

/* Varčevanje z mesečnim kreditom ElevenLabs: omejimo število dejanskih
 * sintez na IP (predvajanje iz predpomnilnika ni omejeno — ogreto
 * posnetko lahko posluša neomejeno obiskovalcev). Kvota "tts" živi v
 * skupnem modulu src/lib/rate-limit.ts (issue #27/J). */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const langParam = searchParams.get("lang");
    const chunkParam = Number(searchParams.get("chunk") ?? "0");
    // minute=1 — enominutna zgodba (Muzej v minuti) namesto celotnega vodnika.
    const minute = searchParams.get("minute") === "1";

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    // Hrvaščina (Interreg SI-HR): sprejmemo jo kot jezik vmesnika, vendar
    // vsebina in glas ostaneata slovenska — medsebojna razumljivost ob Kolpi.
    // Nemščina in italijanščina: vsebina in glas sta angleška (lingua franca).
    if (
      langParam !== "sl" &&
      langParam !== "en" &&
      langParam !== "hr" &&
      langParam !== "de" &&
      langParam !== "it"
    ) {
      return NextResponse.json({ error: "Invalid lang" }, { status: 400 });
    }
    const lang: Lang =
      langParam === "hr" ? "sl" : langParam === "de" || langParam === "it" ? "en" : langParam;

    const exhibit = await db.exhibit.findUnique({ where: { slug } });
    if (!exhibit) {
      return NextResponse.json({ error: "Exhibit not found" }, { status: 404 });
    }

    const key = cacheKey(slug, lang, minute);
    let entry = audioCache.get(key);
    if (!entry) {
      const narration = minute
        ? (() => {
            const story = getMinuteStory(slug);
            const text = story
              ? lang === "sl"
                ? story.textSi
                : story.textEn
              : lang === "sl"
                ? exhibit.summarySi
                : exhibit.summaryEn;
            return prepareForTts(text);
          })()
        : buildNarration(exhibit, lang);
      entry = {
        chunks: splitIntoChunks(narration),
        audio: [],
      };
      audioCache.set(key, entry);
      evictIfNeeded(key);
    }

    const chunk =
      Number.isFinite(chunkParam) && chunkParam >= 0
        ? Math.min(chunkParam, entry.chunks.length - 1)
        : 0;

    let audio = entry.audio[chunk];
    if (!audio) {
      // Varčevanje s kreditom TTS: omejimo samo DEJANSKE sinteze na IP
      // (ogret posnetek iz predpomnilnika ni omejen).
      if (rateLimited("tts", clientIpOf(req))) {
        return NextResponse.json({ error: "rate-limited" }, { status: 429 });
      }
      // Hkratne enake zahteve delijo obljubo — brez dvojne sinteze.
      const inflightKey = `${key}|${chunk}`;
      let pending = inflight.get(inflightKey);
      if (!pending) {
        pending = synthesize(entry.chunks[chunk], lang)
          .then((buffer) => {
            storeAudio(key, entry, chunk, buffer);
            return buffer;
          })
          .finally(() => {
            inflight.delete(inflightKey);
          });
        inflight.set(inflightKey, pending);
      }
      audio = await pending;
    }

    return new NextResponse(new Uint8Array(audio.buffer), {
      status: 200,
      headers: {
        "Content-Type": audio.contentType,
        "Content-Length": String(audio.buffer.length),
        "X-Total-Chunks": String(entry.chunks.length),
        "X-Chunk": String(chunk),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Audio guide error:", error);
    // Oba ponudnika sta padla (kvota/ključ) — vodnik odkrito pove, da
    // posnetka ni, odjemalec pa lahko uporabi glas naprave.
    return NextResponse.json({ error: "tts-unavailable" }, { status: 503 });
  }
}
