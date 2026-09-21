/**
 * AI PLANIRANJE OBISKA — osebni kurirani načrt po zbirki.
 * (63. sklop / VRZEL #4 iz benchmarka svetovnih digitalnih muzejev)
 *
 * Vzorec sledi dokazni arhitekturi AI kustosa (41. sklop): model je
 * ZADNJA plast sinteze, nikoli vir. Izbira postaj je DETERMINISTIČNA
 * (brez modela), model samo personalizira pripoved nad podanimi
 * postajami in NE SME dodati, odstraniti ali prestaviti postaje:
 *
 *     PROFIL OBISKOVALCA (čas, interesi, otroci)
 *       → DETERMINISTIČNA IZBIRA POSTAJ (točkovanje + pestrost, BREZ modela)
 *       → POSTAJE (naslov, številka, obdobje, povzetek, status dokazilosti)
 *       → LLM SINTEZA (samo personalizacija: intro + »zakaj ta postaja« + nasvet)
 *       → PREVERBA (whys = točno N, dolžine; sicer 1 ponovitev → fallback)
 *
 * ZAPRT SVET: model vidi SAMO povzetke podanih postaj. Ne sme izmišljati
 * datumov, imen, števil ali virov. Če model ni dosegljiv ali dvakrat ne
 * vrne preverljivega JSON-a, načrt ostane POPOLNOMOČEN z deterministično
 * pripovedjo (synthesized: false) — načrt nikoli ne odpove, ker so
 * postaje že prave. Poštenost: zastavica synthesized v UI izrecno pove,
 * kdaj AI pripovedi ni bilo.
 *
 * Zasebnost: profila NE shranjujemo; edino anonimni predpomnilnik
 * pogostih načrtov (24 h, max 120) — enako načelo kot kustos in vodnik.
 */

import { seedExhibits } from "@/lib/museum-content";
import { WALKS } from "@/lib/walks";
import type { ExhibitCategory, EvidenceStatus } from "@/lib/types";
import { chainedCompletion } from "@/lib/curator-provider";

export type PlanLang = "sl" | "en" | "hr" | "de" | "it";

/** Dovoljeni časovni okviri načrta ( Minutes ). */
export type PlanMinutes = 15 | 30 | 60 | 90;

export type PlanInput = {
  lang: PlanLang;
  minutes: PlanMinutes;
  /** Prazno = vse teme (obiskovalec ne izbere nič). */
  interests: ExhibitCategory[];
  withKids: boolean;
};

/** Ena postaja načrta — nosi vse za prikaz in za globoko povezavo. */
export type PlanStop = {
  slug: string;
  museumNo: string | null;
  titleSi: string;
  titleEn: string;
  periodSi: string;
  periodEn: string;
  category: ExhibitCategory;
  evidenceStatus: EvidenceStatus;
  /** Časovni proračun postaje (min). */
  minutes: number;
  /** Personalizirani razlog (LLM) ali deterministični povzetek (fallback). */
  why: string;
  /** Sprehod, ki vsebuje to postajo (prvi zadetek), za CTA »poglej v sprehodu«. */
  walkId: string | null;
  walkTitleSi: string | null;
  walkTitleEn: string | null;
};

export type VisitPlan = {
  /** Uvodna pripoved načrta (jezik zahteve). */
  intro: string;
  /** Realen skupni proračun: postaje × 5 min (≈ zahtevanemu). */
  totalMinutes: number;
  /** Praktični nasvet (npr. podaljšanje s sprehodom), lahko null. */
  tip: string | null;
  /** true = pripoved sintetiziral model; false = deterministični fallback. */
  synthesized: boolean;
  stops: PlanStop[];
};

/* --- Časovni proračun ----------------------------------------------------- */

/** Minut na postajo v digitalnem muzeju (branje + pripoved + prehod). */
export const STOP_MINUTES = 5;
/** Zgornja meja postaj (kuratorij, ne količina; 90 min → 14 postaj ≈ 70 min). */
const MAX_STOPS = 14;
const MIN_STOPS = 3;

export function stopBudget(minutes: PlanMinutes): number {
  return Math.min(MAX_STOPS, Math.max(MIN_STOPS, Math.floor(minutes / STOP_MINUTES)));
}

/* --- Deterministična izbira postaj (BREZ modela) -------------------------- */

type Scored = { slug: string; score: number; category: ExhibitCategory };

/** Kategorije, prijazne mlajšim obiskovalcem (družinski načrt). */
const KID_FRIENDLY: Partial<Record<ExhibitCategory, number>> = {
  narava: 2,
  sege: 2,
  kolpa: 1,
  gospodarstvo: 1,
};

/** Status dokazilosti nosi točke — najbolj dokumentirano gre naprej. */
function evidenceScore(status: EvidenceStatus): number {
  switch (status) {
    case "DOCUMENTED":
      return 2;
    case "CORROBORATED":
      return 1;
    case "TESTIMONY":
    case "TRADITION":
      return 0.5;
    default:
      return 0;
  }
}

/**
 * Deterministično točkovanje vseh zapisov zbirke. Interesi +3 (prazno = +1
 * vsem), izpostavljenost +2, dokazilost po statusu, prijaznost otrokom po
 * kategoriji (vojna −3: resna vsebina ostaja dosegljiva prek interesa),
 * slika +0.5 (vizualno sidro). Vrne razvrščen seznam (točke ↓, nato
 * kuratorski vrstni red).
 */
export function scoreExhibits(input: PlanInput): Scored[] {
  const hasInterests = input.interests.length > 0;
  const scored = seedExhibits.map((ex) => {
    let score = 0;
    if (hasInterests) {
      if (input.interests.includes(ex.category)) score += 3;
    } else {
      score += 1;
    }
    if (ex.featured) score += 2;
    score += evidenceScore(ex.evidenceStatus);
    if (input.withKids) {
      score += KID_FRIENDLY[ex.category] ?? 0;
      if (ex.category === "vojna") score -= 3;
    }
    if (ex.image) score += 0.5;
    return { slug: ex.slug, score, category: ex.category };
  });
  const order = new Map(seedExhibits.map((e, i) => [e.slug, i]));
  scored.sort((a, b) => b.score - a.score || (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
  return scored;
}

/**
 * Izbira N postaj s PESTROSTJO: brez izbranih interesov kategorija ne sme
 * zapolniti več kot ~tretjine načrta (min. 2 postaje), pri izbranih
 * interesih uporabnik vodi (brez omejitve). Vrne sluge v kuratorskih
 * točkah (razvrščanje v pripoved se zgodi kasneje, po kronologiji).
 */
export function selectStops(input: PlanInput): string[] {
  const budget = stopBudget(input.minutes);
  const scored = scoreExhibits(input);
  const cap =
    input.interests.length > 0
      ? budget // uporabnik vodi — omejitve pestrosti ni
      : Math.max(2, Math.ceil(budget / 3));
  const perCategory = new Map<ExhibitCategory, number>();
  const picked: string[] = [];
  for (const s of scored) {
    if (picked.length >= budget) break;
    const used = perCategory.get(s.category) ?? 0;
    if (used >= cap) continue;
    perCategory.set(s.category, used + 1);
    picked.push(s.slug);
  }
  // Zavarovalna mreža: če je omejitev pestrosti zmanjkala kandidatov,
  // dopolni iz neizbranih po točkah (korpus je velik, to ne pride do izraza).
  if (picked.length < budget) {
    const chosen = new Set(picked);
    for (const s of scored) {
      if (picked.length >= budget) break;
      if (!chosen.has(s.slug)) picked.push(s.slug);
    }
  }
  return picked;
}

/** Kronološka urejenost pripovedi (od arheologije do danes; brez letnice na konec). */
function chronological(slugs: string[]): string[] {
  const bySlug = new Map(seedExhibits.map((e) => [e.slug, e]));
  return [...slugs].sort((a, b) => {
    const ya = bySlug.get(a)?.yearFrom ?? null;
    const yb = bySlug.get(b)?.yearFrom ?? null;
    if (ya === null && yb === null) return 0;
    if (ya === null) return 1;
    if (yb === null) return -1;
    return ya - yb;
  });
}

function walkOf(slug: string): { id: string; titleSi: string; titleEn: string } | null {
  for (const w of WALKS) {
    if (w.stops.some((s) => s.exhibitSlug === slug)) {
      return { id: w.id, titleSi: w.titleSi, titleEn: w.titleEn };
    }
  }
  return null;
}

/* --- Deterministični fallback pripovedi (brez modela) ---------------------- */

const INTRO_FALLBACK: Record<"sl" | "en", (n: number, m: number) => string> = {
  sl: (n, m) =>
    `Vaš osebni načrt obiska: ${n} dokumentiranih postaj v približno ${m} minutah, sestavljen po vaših interesih — od najstarejših sledi vasi do danes.`,
  en: (n, m) =>
    `Your personal visit plan: ${n} documented stops in about ${m} minutes, arranged by your interests — from the village's oldest traces to today.`,
};

/** Prvi stavek povzetka (fallback razlog postaje). */
export function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]+[.!?]/);
  const out = (m ? m[0] : text).trim();
  return out.length > 200 ? `${out.slice(0, 197).trimEnd()}…` : out;
}

/* --- LLM sinteza (ZADNJA plast) + preverba --------------------------------- */

const SYNTHESIS_SYSTEM = `Si kurator muzeja vasi Griblje (Bela krajina, Slovenija). Sestavljaš OSEBNI načrt obiska po dokumentirani zbirki.

Dobil boš profil obiskovalca in KONČEN, UREJEN seznam postaj (naslov, muzejska številka, obdobje, kategorija, povzetek, status dokazilosti).

ABSOLUTNA PRAVILA:
1. Postaj NE SMEŠ dodajati, odstranjevati, prestavljati ali zamenjevati — seznam je končen.
2. Za vsako postajo napiši TOČNO EN stavek (največ 25 besed), zakaj je v TEM načrtu, glede na profil obiskovalca. Uporabi SAMO podatke iz podanih povzetkov; NE izmišljuj datumov, imen, številk ali virov.
3. "intro": največ 2 stavka, osebno in pozdravljajoče, v jeziku obiskovalca.
4. "tip": največ EN stavek praktičnega nasveta. Muzej ima tudi vodene sprehode, avdio vodnik, zemljevid vasi in otroško pot — o njih smeš povedati, če profil to nakazuje. NE izmišljuj ur, cen, sezona.
5. Odgovori SAMO z JSON: {"intro":"...","whys":["..."],"tip":"..."} — "whys" ima TOČNO toliko elementov, kolikor je postaj, v natanko istem vrstnem redu.`;

type Synthesis = { intro: string; whys: string[]; tip: string | null };

/** Preverba sinteze: whys mora biti točno N nepraznih, kratkih nizov. */
export function verifySynthesis(
  raw: string,
  stopCount: number,
): Synthesis | null {
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  const body = text.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1");
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const obj = parsed as Record<string, unknown>;
  const intro = typeof obj.intro === "string" ? obj.intro.trim() : "";
  const tip = typeof obj.tip === "string" ? obj.tip.trim() : "";
  if (!intro || intro.length > 600) return null;
  if (!Array.isArray(obj.whys) || obj.whys.length < stopCount) return null;
  const whys = obj.whys
    .slice(0, stopCount)
    .map((w) => (typeof w === "string" ? w.trim() : ""));
  if (whys.some((w) => !w || w.length > 400)) return null;
  return { intro, whys, tip: tip ? tip.slice(0, 300) : null };
}

/** Profil obiskovalca v jezikovni plasti (sl/hr → slovensko, ostali → angleško). */
function profileText(input: PlanInput): string {
  const layer: "sl" | "en" = input.lang === "sl" || input.lang === "hr" ? "sl" : "en";
  const answerLang: Record<PlanLang, string> = {
    sl: "slovenščina (Slovenian)",
    en: "English",
    hr: "hrvaščina (Croatian)",
    de: "Deutsch (German)",
    it: "italiano (Italian)",
  };
  if (layer === "sl") {
    const teme = input.interests.length
      ? input.interests.join(", ")
      : "vse teme zbirke";
    return `Profil obiskovalca: ${input.minutes} minut časa;${input.withKids ? " prihaja z OTROKI;" : ""} zanimanje: ${teme}. Pripoveduj v jeziku: ${answerLang[input.lang]}.`;
  }
  return `Visitor profile: ${input.minutes} minutes of time;${input.withKids ? " arriving with CHILDREN;" : ""} interests: ${
    input.interests.length ? input.interests.join(", ") : "all topics"
  }. Write in language: ${answerLang[input.lang]}.`;
}

async function synthesize(input: PlanInput, slugs: string[]): Promise<Synthesis | null> {
  const bySlug = new Map(seedExhibits.map((e) => [e.slug, e]));
  const lines = slugs.map((slug, i) => {
    const ex = bySlug.get(slug);
    if (!ex) return null;
    return [
      `POSTAJA ${i + 1}: ${ex.titleSi}`,
      `številka: ${ex.museumNo ?? "—"}`,
      `obdobje: ${ex.periodSi}`,
      `kategorija: ${ex.category}`,
      `status dokazilosti: ${ex.evidenceStatus}`,
      `povzetek: ${firstSentence(ex.summarySi)}`,
    ].join("\n");
  });
  const user = `${profileText(input)}\n\nPostaje (${slugs.length}):\n\n${lines
    .filter(Boolean)
    .join("\n\n")}\n\nSestavi načrt po pravilih.`;

  // Dva poskusa (enako kot kustos); vsak neuspešen → null (fallback).
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const trail: string[] = [];
      const raw = await chainedCompletion(SYNTHESIS_SYSTEM, user, trail);
      const verified = verifySynthesis(raw, slugs.length);
      if (verified) return verified;
    } catch {
      // Nadaljuj na 2. poskus / fallback.
    }
  }
  return null;
}

/* --- GLAVNA FUNKCIJA -------------------------------------------------------- */

/**
 * Zgradi osebni načrt obiska. `synthesizeFn` je privzetek prave sinteze;
 * parametriziran je za deterministične teste (vbrizgava/fallback), v
 * proizvodnji ga klicatelj ne podaja.
 */
export async function buildVisitPlan(
  input: PlanInput,
  synthesizeFn: typeof synthesize = synthesize,
): Promise<VisitPlan> {
  const budget = stopBudget(input.minutes);
  const slugs = chronological(selectStops(input));
  const bySlug = new Map(seedExhibits.map((e) => [e.slug, e]));
  const layer: "sl" | "en" = input.lang === "sl" || input.lang === "hr" ? "sl" : "en";

  const stops: PlanStop[] = slugs.flatMap((slug) => {
    const ex = bySlug.get(slug);
    if (!ex) return [];
    const w = walkOf(slug);
    return [
      {
        slug: ex.slug,
        museumNo: ex.museumNo ?? null,
        titleSi: ex.titleSi,
        titleEn: ex.titleEn,
        periodSi: ex.periodSi,
        periodEn: ex.periodEn,
        category: ex.category,
        evidenceStatus: ex.evidenceStatus,
        minutes: STOP_MINUTES,
        why: layer === "sl" ? firstSentence(ex.summarySi) : firstSentence(ex.summaryEn),
        walkId: w?.id ?? null,
        walkTitleSi: w?.titleSi ?? null,
        walkTitleEn: w?.titleEn ?? null,
      },
    ];
  });

  if (stops.length === 0) {
    throw new Error("Načrt brez postaj — zbirka je prazna");
  }

  const totalMinutes = stops.length * STOP_MINUTES;
  const fallback: VisitPlan = {
    intro: INTRO_FALLBACK[layer](stops.length, totalMinutes),
    totalMinutes,
    tip: null,
    synthesized: false,
    stops,
  };

  const synthesis = await synthesizeFn(input, stops.map((s) => s.slug));
  if (!synthesis) return fallback;
  return {
    intro: synthesis.intro,
    totalMinutes,
    tip: synthesis.tip,
    synthesized: true,
    stops: stops.map((s, i) => ({ ...s, why: synthesis.whys[i] ?? s.why })),
  };
}

/* --- Predpomnilnik (anonimno, 24 h, max 120) ------------------------------- */

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_MAX = 120;

type CacheEntry = { at: number; plan: VisitPlan };
const cache = new Map<string, CacheEntry>();

export function planCacheKey(input: PlanInput): string {
  return `${input.lang}|${input.minutes}|${input.interests.join(",")}|${input.withKids ? 1 : 0}`;
}

export function planCacheGet(key: string): VisitPlan | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  cache.delete(key);
  cache.set(key, hit);
  return hit.plan;
}

export function planCacheSet(key: string, plan: VisitPlan): void {
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { at: Date.now(), plan });
}

/* --- Omejitev hitrosti (drseče okno, ločena od kustosa/vodnika) ------------ */

type Bucket = { hits: number[] };
const RATE_BUCKETS = new Map<string, Bucket>();
/** 12 načrtov na 10 minut na IP (na primerek strežnika). */
const RATE_LIMIT = { count: 12, windowMs: 10 * 60 * 1000 } as const;

export function planRateLimited(ip: string): boolean {
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

export function planClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "local";
}
