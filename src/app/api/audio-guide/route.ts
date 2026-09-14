import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/audio-guide?slug=<exhibit>&lang=sl|en&chunk=<i>
 *
 * Avdio vodnik muzeja — sinteza govora (TTS) po zgledu vodilnih muzejskih
 * aplikacij (British Museum, Art Institute of Chicago). Vsak posnetek je
 * izrecno označen kot sintetiziran — nikoli kot avtentično pričevanje.
 *
 * Omejitve TTS: sinteza je omejena po dolžini besedila na zahtevo →
 * besedilo delimo na odseke (MAX_CHARS, z varnostno rezervo).
 */

type Lang = "sl" | "en";

const VOICE: Record<Lang, string> = { sl: "tongtong", en: "jam" };
const SPEED: Record<Lang, number> = { sl: 0.9, en: 0.95 };
const MAX_CHARS = 950; // varnostna rezerva pod omejitvijo TTS (1024 znakov)

/* ZAI SDK — en odjemalec, ustvarjen enkrat, samo strežniška stran. */
type ZAIClient = Awaited<
  ReturnType<(typeof import("z-ai-web-dev-sdk"))["default"]["create"]>
>;
let zaiPromise: Promise<ZAIClient> | null = null;
async function getZAI(): Promise<ZAIClient> {
  if (!zaiPromise) {
    zaiPromise = import("z-ai-web-dev-sdk").then((m) => m.default.create());
  }
  return zaiPromise;
}

/* Pomnilniški predpomnilnik: slug|lang → odseki besedila + WAV posnetki.
 * WAV posnetki so veliki, zato meja velja po SKUPNIH BAJTIH (in ne le po
 * številu vnosov); ob presegu izločamo najstarejše vnose (vrstni red
 * vložitve). Sintezo v teku si hkratne enake zahteve delijo (in-flight
 * dedup) — hladen posnetek se sintetizira samo enkrat. */
type CacheEntry = { chunks: string[]; audio: (Buffer | undefined)[] };
const audioCache = new Map<string, CacheEntry>();
const CACHE_MAX_BYTES = 64 * 1024 * 1024; // 64 MB skupaj
const CACHE_MAX_ENTRIES = 40;
let cachedBytes = 0;

/* Sinteze, ki trenutno tečejo: "slug|lang|chunk" → obljuba. */
const inflight = new Map<string, Promise<Buffer>>();

function cacheKey(slug: string, lang: Lang) {
  return `${slug}|${lang}`;
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
      for (const buf of entry.audio) cachedBytes -= buf?.length ?? 0;
    }
    audioCache.delete(oldest);
  }
}

function storeAudio(key: string, entry: CacheEntry, chunk: number, audio: Buffer) {
  if (entry.audio[chunk]) return;
  entry.audio[chunk] = audio;
  // Štejemo samo bajte, ki so res v predpomnilniku (vnos je medtem
  // lahko bil izločen).
  if (audioCache.get(key) === entry) {
    cachedBytes += audio.length;
    evictIfNeeded(key);
  }
}

/** Očisti besedilo za izgovorjavo (misle, pomišljaji, odvečni presledki). */
function prepareForTts(text: string): string {
  return text
    .replace(/\r/g, " ")
    .replace(/[—–]/g, ", ")
    .replace(/[«»„“”"]/g, "")
    .replace(/\s*\n\s*\n\s*/g, ". ")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Deli besedilo na odseke ≤ MAX_CHARS znakov po stavkih. */
function splitIntoChunks(text: string, max = MAX_CHARS): string[] {
  if (text.length <= max) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length <= max) {
      current += sentence;
    } else {
      if (current.trim()) chunks.push(current.trim());
      if (sentence.length > max) {
        /* Zelo dolg stavek → trdi rez po besedah. */
        let piece = "";
        for (const word of sentence.split(/\s+/)) {
          if ((piece + " " + word).trim().length > max) {
            if (piece.trim()) chunks.push(piece.trim());
            piece = word;
          } else {
            piece = `${piece} ${word}`.trim();
          }
        }
        current = piece;
      } else {
        current = sentence;
      }
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

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

async function synthesize(text: string, lang: Lang): Promise<Buffer> {
  const zai = await getZAI();
  const response = await zai.audio.tts.create({
    input: text,
    voice: VOICE[lang],
    speed: SPEED[lang],
    response_format: "wav",
    stream: false,
  });
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));
  if (buffer.length === 0) {
    throw new Error("TTS returned an empty buffer");
  }
  return buffer;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const langParam = searchParams.get("lang");
    const chunkParam = Number(searchParams.get("chunk") ?? "0");

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    if (langParam !== "sl" && langParam !== "en") {
      return NextResponse.json({ error: "Invalid lang" }, { status: 400 });
    }
    const lang: Lang = langParam;

    const exhibit = await db.exhibit.findUnique({ where: { slug } });
    if (!exhibit) {
      return NextResponse.json({ error: "Exhibit not found" }, { status: 404 });
    }

    const key = cacheKey(slug, lang);
    let entry = audioCache.get(key);
    if (!entry) {
      entry = {
        chunks: splitIntoChunks(buildNarration(exhibit, lang)),
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

    return new NextResponse(new Uint8Array(audio), {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(audio.length),
        "X-Total-Chunks": String(entry.chunks.length),
        "X-Chunk": String(chunk),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Audio guide error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "TTS failed" },
      { status: 500 }
    );
  }
}
