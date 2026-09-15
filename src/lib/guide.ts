/**
 * Pogovor z zbirko — strežniški umetni vodnik muzeja.
 *
 * Načelo (po vzoru uzidanih AI vodnikov vodilnih muzejev, npr. DMA Angelica
 * in museum-GPT): model odgovarja IZKLJUČNO iz kuriranih zapisov zbirke
 * (»dosje«), ki ga strežnik sestavi iz iste baze, ki živi za ostalim muzejem.
 * Kar ni v dosjeju, vodnik odkrito prizna — muzej ne izmišljuje zgodovine.
 *
 * Verige odgovorov se NE shranjujejo: zgodovino pošlje brskalnik z vsako
 * zahtevo nazaj, strežnik pa ne hrani ničesar razen omejitvenih števcev.
 */

import { db } from "@/lib/db";
import { getZAI } from "@/lib/zai";
import { GUIDE_LIMITS } from "@/lib/guide-limits";
import { getBiography } from "@/lib/object-biographies";
import { getMinuteStory } from "@/lib/minute-stories";
import { hfChatComplete, isHfChatConfigured } from "@/lib/hf-llm";
import {
  openRouterChatComplete,
  isOpenRouterChatConfigured,
} from "@/lib/openrouter-llm";

export type GuideLang = "sl" | "en";

/* ZAČASNA DIAGNOSTIKA (odstraniti po razrešitvi) — sled napak ponudnikov. */
export const providerErrorTrail: string[] = [];

export type GuideMessage = { role: "user" | "assistant"; content: string };

export type GuideCite = { slug: string; titleSi: string; titleEn: string };

/* --- Omejitve (v samostojnem modulu guide-limits.ts, da jih lahko
 * uvozi tudi odjemalec brez strežniških odvisnosti.) ------------------ */

/* --- Omejitev hitrosti (drseče okno, ločeno od prispevkov) ------------- */

type Bucket = { hits: number[] };
const RATE_BUCKETS = new Map<string, Bucket>();
/** 12 vprašanj na 10 minut na IP (na primerek strežnika). */
const RATE_LIMIT = { count: 12, windowMs: 10 * 60 * 1000 } as const;

export function guideRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = RATE_BUCKETS.get(ip) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < RATE_LIMIT.windowMs);
  if (bucket.hits.length >= RATE_LIMIT.count) {
    RATE_BUCKETS.set(ip, bucket);
    return true;
  }
  bucket.hits.push(now);
  RATE_BUCKETS.set(ip, bucket);
  return false;
}

/** IP iz glav zahteve (x-forwarded-for na proxy-ju, sicer "local"). */
export function guideClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "local";
}

/* --- Dosje zbirke ------------------------------------------------------ */

type DossierExhibit = {
  slug: string;
  category: string;
  evidenceStatus: string;
  titleSi: string;
  titleEn: string;
  periodSi: string;
  periodEn: string;
  summarySi: string;
  summaryEn: string;
  storySi: string;
  storyEn: string;
  yearFrom: number | null;
  yearTo: number | null;
  sources: { nameSi: string; nameEn: string; sourceType: string; license: string }[];
};

/** Zgodbo v dosje vodniku damo do 3000 znakov — vodnik sme vedeti več
 *  kot etiketa, a manj kot celotno monografijo (varčevanje z žetoni). */
const STORY_MAX_CHARS = 3000;
const BIO_MAX_CHARS = 900;
const MINUTE_MAX_CHARS = 700;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + " …";
}

function formatDossier(lang: GuideLang, exhibits: DossierExhibit[]): string {
  const sl = lang === "sl";
  return exhibits
    .map((e) => {
      const bio = getBiography(e.slug);
      const minute = getMinuteStory(e.slug);
      const sources = e.sources
        .map((s) => `${sl ? s.nameSi : s.nameEn} [${s.sourceType}, ${s.license}]`)
        .join("; ");
      const years =
        e.yearFrom !== null
          ? `leta: ${e.yearFrom}${e.yearTo !== null ? "–" + e.yearTo : " →"}\n`
          : "";
      const bioLine = bio
        ? bio.phases
            .map(
              (p) =>
                `${p[sl ? "yearLabelSi" : "yearLabelEn"]}: ${truncate(
                  p[sl ? "textSi" : "textEn"],
                  220,
                )}`,
            )
            .join(" → ")
        : null;
      return [
        `### ${e.slug}`,
        `kategorija: ${e.category} | zanesljivost: ${e.evidenceStatus}`,
        years +
          `Naslov (${sl ? "SL" : "EN"}): ${sl ? e.titleSi : e.titleEn}`,
        `Obdobje (${sl ? "SL" : "EN"}): ${sl ? e.periodSi : e.periodEn}`,
        `Povzetek (${sl ? "SL" : "EN"}): ${sl ? e.summarySi : e.summaryEn}`,
        `Zgodba (${sl ? "SL" : "EN"}): ${truncate(
          sl ? e.storySi : e.storyEn,
          STORY_MAX_CHARS,
        )}`,
        bioLine ? `Življenjepis predmeta: ${truncate(bioLine, BIO_MAX_CHARS)}` : "",
        minute
          ? `Enominutna zgodba (${sl ? "SL" : "EN"}): ${truncate(
              sl ? minute.textSi : minute.textEn,
              MINUTE_MAX_CHARS,
            )}`
          : "",
        `Viri: ${sources || "—"}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

const dossierPromises: Partial<
  Record<GuideLang, Promise<{ text: string; exhibits: DossierExhibit[] }>>
> = {};

/** Dosje sestavimo enkrat na jezik na primerek strežnika (zbirka je v
 *  read-only bazi): vodnik odgovarja v enem jeziku, torej dobi samo slovenske
 *  ali samo angleške plasti — globina brez dvojne porabe žetonov. */
async function getDossier(lang: GuideLang) {
  if (!dossierPromises[lang]) {
    dossierPromises[lang] = (async () => {
      const rows = await db.exhibit.findMany({
        orderBy: { sortOrder: "asc" },
        select: {
          slug: true,
          category: true,
          evidenceStatus: true,
          titleSi: true,
          titleEn: true,
          periodSi: true,
          periodEn: true,
          summarySi: true,
          summaryEn: true,
          storySi: true,
          storyEn: true,
          yearFrom: true,
          yearTo: true,
          sources: {
            select: {
              nameSi: true,
              nameEn: true,
              sourceType: true,
              license: true,
            },
            orderBy: { sortOrder: "asc" },
          },
        },
      });
      const exhibits = rows as DossierExhibit[];
      return { text: formatDossier(lang, exhibits), exhibits };
    })();
  }
  return dossierPromises[lang]!;
}

/* --- Sistemsko sporočilo ----------------------------------------------- */

function systemPrompt(lang: GuideLang, dossier: string): string {
  const rules =
    lang === "sl"
      ? `Si vljuden digitalni vodnik Muzeja vasi Griblje (Bela krajina, Slovenija). Odgovarjaš SLOVENSKO.

NADZOROVA IZKLJUČNO DOSJE SPODAJ — to je celotno znanje muzeja:
1. Odgovarjaj samo iz dosjeja. Če odgovora ni v dosjeju, odkrito priznaj: »Tega (še) ni v zbirki muzeja.« in predlagaj najbližji zapis po temi.
2. NIKOLI ne izmišljuj datumov, imen, števil ali navedkov domačinov.
3. Upoštevaj stopnjo zanesljivosti zapisa (DOCUMENTED = dokumentirano, TRADITION = izročilo, UNVERIFIED = nezanesljivo …) in jo omeni, kadar je odločilna za odgovor.
4. Kadar koli omenjaš določen zapis, se na koncu odgovora sklici nanj v obliki [[slug]] (samo pravi slug-i iz dosjeja, 1–3 sklice, vsak v svoji dvojni oglati oklepaji). Če se sklicuješ na več zapisov, našteji vse. Če se ne sklicuješ na nobenega, ne dodaj ničesar.
5. Odgovori so kratki in topli (do ~120 besed), kot vodnik, ki stoji ob sliki — brez naslovov, brez markdown okrasjev, brez seznamov, razen če vprašanje izrecno prosi za seznam.
6. Za pričevanja in spomine domačinov usmerjaj obiskovalca v spominsko knjigo (#knjiga) — muzej namenoma ne izmišljuje izjav.
7. Pogovor se ne shranjuje; ne sprašuj po osebnih podatkih.
8. Piši v živi, domači slovenščini — kot človek, ki mu je ta vas resnično doma. Nikoli se ne preklopi v angleščino (niti posameznih besed, razen lastnih imen krajev in oseb) in nikoli ne zveni kot surov računalniški prevod: brez okornih uradniških fraz, brez robotskih uvodov kot „Kot umetna inteligenca …“.`
      : `You are a courteous digital guide of the Griblje Village Museum (Bela krajina, Slovenia). Answer in ENGLISH.

YOU ARE GROUNDED STRICTLY IN THE DOSSIER BELOW — it is the museum's entire knowledge:
1. Answer only from the dossier. If the answer is not in the dossier, admit it plainly: "That is not (yet) in the museum's collection." and suggest the closest record by topic.
2. NEVER invent dates, names, numbers or quotes from villagers.
3. Respect each record's evidence status (DOCUMENTED, TRADITION, UNVERIFIED …) and mention it when it matters for the answer.
4. Whenever you mention a specific record, cite it at the end of your answer as [[slug]] (only real slugs from the dossier, 1–3 citations, each in double square brackets). If several records are mentioned, list them all. If none, add nothing.
5. Answers are short and warm (up to ~120 words), like a guide standing beside the picture — no headings, no markdown ornaments, no lists unless explicitly asked.
6. For testimonies and villagers' memories, direct visitors to the memory book (#knjiga) — the museum deliberately invents no quotes.
7. The conversation is not stored; never ask for personal data.
8. Write in living, natural English — a human voice of someone whose home village this is, never machine-like and never drifting into another language.`;

  return `${rules}

--- DOSJE ZBIRKE (edini vir resnice) ---
${dossier}
--- KONEC DOSJEJA ---`;
}

/* --- Razčlenjevanje navedkov ------------------------------------------ */

const CITE_RE = /\[\[([a-z0-9-]+)\]\]/g;

export function parseCites(
  raw: string,
  exhibits: DossierExhibit[]
): { answer: string; cites: GuideCite[] } {
  const bySlug = new Map(exhibits.map((e) => [e.slug, e]));
  const cites: GuideCite[] = [];
  let answer = raw;

  for (const match of raw.matchAll(CITE_RE)) {
    const slug = match[1];
    const ex = bySlug.get(slug);
    if (ex && !cites.some((c) => c.slug === slug)) {
      cites.push({ slug, titleSi: ex.titleSi, titleEn: ex.titleEn });
    }
  }
  // Odstrani vse označbe (tudi neveljavne slug-e) iz prikazanega besedila.
  answer = answer.replace(CITE_RE, "").replace(/[ \t]+\n/g, "\n").trimEnd();

  return { answer, cites };
}

/* --- Klic modela ------------------------------------------------------- */

export async function askGuide(
  lang: GuideLang,
  history: GuideMessage[]
): Promise<{ answer: string; cites: GuideCite[] }> {
  const { text, exhibits } = await getDossier(lang);
  const zai = await getZAI();

  // Zgodovino skrajšamo na zadnjih GUIDE_LIMITS.history sporočil —
  // starejša vprašanja ne nosijo več konteksta, dosje pa vedno ostane.
  const trimmed = history.slice(-GUIDE_LIMITS.history);
  const system = systemPrompt(lang, text);

  // Ponudniška veriga (prvi z veljavnim ključem zmore): OpenRouter
  // (brezplačni katalog, ključ sk-or-v1-…) → HuggingFace (hf_…) → z-ai SDK.
  // OpenAI-kompatibilni ponudniki (OpenRouter, HF) uporabljajo standardne
  // vloge („system“), z-ai pa sprejema sistemski poziv kot prvo sporočilo
  // vloge „assistant“.
  providerErrorTrail.length = 0;
  if (isOpenRouterChatConfigured()) {
    try {
      const raw = await openRouterChatComplete(
        [
          { role: "system", content: system },
          ...trimmed,
        ],
        // 800 žetonov: odgovor ~120 besed + navedki [[slug]] na koncu —
        // pri 500 se je zgodbno bogati odgovor rezal sredi stavka.
        { maxTokens: 800 },
      );
      return parseCites(raw, exhibits);
    } catch (error) {
      // Dnevna meja brezplačne veje (~50 zahtev) ali zaseden ponudnik —
      // pademo na naslednjo postajo verige in razlog zabeležimo.
      providerErrorTrail.push(
        "OpenRouter: " + (error instanceof Error ? error.message : String(error)),
      );
      console.warn(
        "Vodnik: OpenRouter ni uspel, nadaljevanje po verigi:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  if (isHfChatConfigured()) {
    try {
      const raw = await hfChatComplete([
        { role: "system", content: system },
        ...trimmed,
      ]);
      return parseCites(raw, exhibits);
    } catch (error) {
      // HF kredit lahko občasno zmanjka ali je žeton napačen — takrat
      // pademo na obstoječi z-ai kanal in razlog zabeležimo v dnevnik.
      console.warn(
        "Vodnik: HuggingFace ni uspel, preklop na z-ai:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  const messages: { role: "assistant" | "user"; content: string }[] = [
    { role: "assistant", content: system },
    ...trimmed.map((m) => ({ role: m.role, content: m.content })),
  ];

  // Ena ponovitev za prehodno omejitev zgornjega API-ja (429) —
  // kratka pavza, da val zahtev na isti račun mine.
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    try {
      const completion = await zai.chat.completions.create({
        messages,
        thinking: { type: "disabled" },
      });

      const raw = completion.choices[0]?.message?.content;
      if (!raw || !raw.trim()) {
        throw new Error("Model je vrnil prazen odgovor");
      }

      return parseCites(raw, exhibits);
    } catch (error) {
      lastError = error;
      const msg = error instanceof Error ? error.message : String(error);
      // Prehodna omejitev — poskusi še enkrat; vse ostalo takoj navzgor.
      if (!/429|rate|too many/i.test(msg)) throw error;
    }
  }
  throw lastError;
}
