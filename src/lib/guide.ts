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

export type GuideLang = "sl" | "en";

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
  sources: { nameSi: string; sourceType: string; license: string }[];
};

const STORY_MAX_CHARS = 700;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + " …";
}

function formatDossier(exhibits: DossierExhibit[]): string {
  return exhibits
    .map((e) => {
      const sources = e.sources
        .map((s) => `${s.nameSi} [${s.sourceType}, ${s.license}]`)
        .join("; ");
      const years =
        e.yearFrom !== null
          ? `leta: ${e.yearFrom}${e.yearTo !== null ? "–" + e.yearTo : " →"}\n`
          : "";
      return [
        `### ${e.slug}`,
        `kategorija: ${e.category} | zanesljivost: ${e.evidenceStatus}`,
        years +
          `Naslov (SL): ${e.titleSi} | Naslov (EN): ${e.titleEn}`,
        `Obdobje (SL): ${e.periodSi} | Obdobje (EN): ${e.periodEn}`,
        `Povzetek (SL): ${e.summarySi}`,
        `Povzetek (EN): ${e.summaryEn}`,
        `Zgodba (SL): ${truncate(e.storySi, STORY_MAX_CHARS)}`,
        `Zgodba (EN): ${truncate(e.storyEn, STORY_MAX_CHARS)}`,
        `Viri: ${sources || "—"}`,
      ].join("\n");
    })
    .join("\n\n");
}

let dossierPromise: Promise<{ text: string; exhibits: DossierExhibit[] }> | null =
  null;

/** Dosje sestavi enkrat na primerek strežnika (zbirka je v read-only bazi). */
async function getDossier() {
  if (!dossierPromise) {
    dossierPromise = (async () => {
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
            select: { nameSi: true, sourceType: true, license: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      });
      const exhibits = rows as DossierExhibit[];
      return { text: formatDossier(exhibits), exhibits };
    })();
  }
  return dossierPromise;
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
7. Pogovor se ne shranjuje; ne sprašuj po osebnih podatkih.`
      : `You are a courteous digital guide of the Griblje Village Museum (Bela krajina, Slovenia). Answer in ENGLISH.

YOU ARE GROUNDED STRICTLY IN THE DOSSIER BELOW — it is the museum's entire knowledge:
1. Answer only from the dossier. If the answer is not in the dossier, admit it plainly: "That is not (yet) in the museum's collection." and suggest the closest record by topic.
2. NEVER invent dates, names, numbers or quotes from villagers.
3. Respect each record's evidence status (DOCUMENTED, TRADITION, UNVERIFIED …) and mention it when it matters for the answer.
4. Whenever you mention a specific record, cite it at the end of your answer as [[slug]] (only real slugs from the dossier, 1–3 citations, each in double square brackets). If several records are mentioned, list them all. If none, add nothing.
5. Answers are short and warm (up to ~120 words), like a guide standing beside the picture — no headings, no markdown ornaments, no lists unless explicitly asked.
6. For testimonies and villagers' memories, direct visitors to the memory book (#knjiga) — the museum deliberately invents no quotes.
7. The conversation is not stored; never ask for personal data.`;

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
  const { text, exhibits } = await getDossier();
  const zai = await getZAI();

  // Zgodovino skrajšamo na zadnjih GUIDE_LIMITS.history sporočil —
  // starejša vprašanja ne nosijo več konteksta, dosje pa vedno ostane.
  const trimmed = history.slice(-GUIDE_LIMITS.history);

  const messages: { role: "assistant" | "user"; content: string }[] = [
    { role: "assistant", content: systemPrompt(lang, text) },
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
