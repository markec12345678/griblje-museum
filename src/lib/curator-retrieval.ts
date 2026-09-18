/**
 * RAZREŠITEV VPRAŠANJA → MUZEJSKI KONTEKST (retrieval plast AI kustosa).
 * (41. sklop / TASK 41)
 *
 * TA PLAST NE UPORABLJA MODELA. Vse je deterministično iskanje po
 * obstoječih podatkih:
 *
 *   vprašanje → žetoni + letnice → ENTITETE (registr) + ZAPISI (seme)
 *             → odprta kuratorska vprašanja (ENTITY_QUEUE)
 *             → AIContext (meja sveta modela)
 *
 * Načela:
 *  - NOVA ENTITETA IZ VPRAŠANJA NE OBSTAJA: »Barle« razrešimo na VSE
 *    entitete s tem žetonom (trije Barle), nikoli na eno; oseba, ki je
 *    ni v registru (npr. Peter Madronič — P0-E1), dobi ODPRTO VPRAŠANJE
 *    in zapisa, ne pa izmišljene entitete.
 *  - MEJA KONTEKSTA = MEJA SVETA: kar razrešitev ne izbere, model ne vidi.
 *  - ČE NI ZADOVOLJIVEGA DOKAZA: ni klica modela — deterministični odgovor
 *    answerable:false / insufficient_evidence (+ pošteni najbližji zapisi).
 *  - NEGOTOVOST SE PRENAŠA: SoftTime oznake gredo v kontekst BESEDNO,
 *    približnost samo, kadar je ZAPISANA (EventPrecision iz timeline-map).
 *
 * Iskanje je predponsko po žetonih (za slovenske oblike: zvon/zvona,
 * Griblje/Gribljah) — 93 zapisov in 92 entitet ne potrebuje vektorjev
 * niti grafske baze (navodilo: NO BLIND RAG, NO GRAPH DATABASE).
 */

import { seedExhibits, type SeedExhibit } from "@/lib/museum-content";
import {
  ENTITIES,
  ENTITY_QUEUE,
  entitiesOfKind,
  type EntityKind,
  type EntityQueueItem,
  type EntityRef,
} from "@/lib/entities";
import { sourceKeyOf, SOURCE_USAGE } from "@/lib/source-registry";
import { EVENT_PRECISION, ERA_ORDER, eraOfSortKey } from "@/lib/timeline-map";
import type {
  AICollectionContext,
  AIEvidenceItem,
  AIEntityContext,
  AIQuestionNote,
  AITimeContext,
  AIContext,
  AIProvidedExhibit,
  CuratorLang,
  CuratorQueryType,
} from "@/lib/curator-types";

/* ---------------------------------------------------------------------------
 * JEZIK VPRAŠANJA — deterministično razpoznavanje (brez modela).
 * Kustos odgovarja v jeziku VPRAŠANJA (navodilo TASK 41: »Če uporabnik
 * vpraša slovensko → slovensko. Če vpraša angleško → angleško.«).
 * Zaznavanje po označevalnih besedah (vprašalniki, členi, pomožniki);
 * negotovno (0 zadetkov ali izenačeno) → null → jezik vmesnika.
 * Zasebnost: deluje samo na besedilu vprašanja, nič drugega.
 * ------------------------------------------------------------------------- */

/** Besede, ki so skupne več jezikom, NE razločujejo (izpuščene). */
const LANG_SHARED = new Set([
  "kako", "je", "se", "na", "ni", "bi", "koliko", "hvala", "iz", "do",
  "ta", "to", "te", "ti", "kustos", "bila", "bili", "museo", "muzej",
]);

/** Značilne (razločevalne) besede vsakega jezika — vprašalniki, členi,
 *  pomožniki. Zadetek šteje samo, če beseda NI v skupnem naboru. */
const LANG_MARKERS: Record<CuratorLang, Set<string>> = {
  sl: new Set([
    "kaj", "kdo", "kje", "kdaj", "zakaj", "kateri", "katera", "katere",
    "vemo", "ves", "povej", "povejte", "prosim", "ampak", "vendar",
    "ker", "tukaj", "tam", "ze", "spet", "znova", "bil", "sem",
    "vam", "nam", "pri", "ob",
  ]),
  hr: new Set([
    "sto", "tko", "gdje", "kada", "zasto", "koji", "koja", "koje",
    "su", "nisu", "bio", "nesto", "netko", "ovaj", "ovdje", "tamo",
    "jos", "opet", "znamo", "znas", "reci", "molim", "vec", "ali",
  ]),
  en: new Set([
    "what", "who", "where", "when", "why", "which", "whose",
    "the", "and", "were", "is", "are", "did", "does", "done", "doing",
    "tell", "about", "know", "known", "don", "doesn", "didn",
    "please", "thanks", "but", "because", "there", "here", "this",
    "that", "these", "those", "curator", "was",
  ]),
  de: new Set([
    "was", "wer", "wo", "wann", "warum", "welche", "welcher", "wessen",
    "der", "die", "das", "und", "ist", "sind", "war", "waren", "hat",
    "habe", "haben", "erzahl", "erzahle", "bitte", "danke", "aber",
    "denn", "dort", "hier", "diese", "dieser", "kurator",
  ]),
  it: new Set([
    "cosa", "chi", "dove", "quando", "perche", "quale", "quali",
    "di", "il", "lo", "la", "le", "gli", "un", "una", "sono", "stato",
    "stata", "racconta", "raccontami", "per", "favore", "grazie", "ma",
    "li", "qui", "questa", "questo", "curatore",
  ]),
};

/** Preprost poskus: vrni jezik vprašanja, če je enolično zaznan; sicer null.
 *  Prva beseda vprašanja (vprašalnik) nosi dvojno težo — razrešuje
 *  prekrivanja, npr. »Was geschah …« (DE) proti »Who was …« (EN). */
export function detectQuestionLang(question: string): CuratorLang | null {
  const words = normalizeQuestion(question).split(" ").filter(Boolean);
  const scores: Record<CuratorLang, number> = { sl: 0, en: 0, hr: 0, de: 0, it: 0 };
  for (let i = 0; i < words.length; i++) {
    const w = words[i]!;
    if (LANG_SHARED.has(w)) continue;
    const weight = i === 0 ? 2 : 1;
    for (const [lang, markers] of Object.entries(LANG_MARKERS)) {
      if (markers.has(w)) scores[lang as CuratorLang] += weight;
    }
  }
  let best: CuratorLang | null = null;
  let bestScore = 0;
  let tie = false;
  for (const [lang, score] of Object.entries(scores)) {
    if (score > bestScore) {
      best = lang as CuratorLang;
      bestScore = score;
      tie = false;
    } else if (score === bestScore && score > 0) {
      tie = true;
    }
  }
  return bestScore >= 1 && !tie ? best : null;
}

/* ---------------------------------------------------------------------------
 * Normalizacija vprašanja (ista logika kot predpomnilnik vodnika)
 * ------------------------------------------------------------------------- */

const QUESTION_MAX_CHARS = 300;

/** mala črka, brez diakritike (č→c), ločila v presledke. */
export function normalizeQuestion(question: string): string {
  return question
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, QUESTION_MAX_CHARS);
}

/** Pogoste besede, ki same po sebi nikoli ne razrešijo entitete. */
const STOPWORDS = new Set([
  // slovenščina / hrvaščina
  "kaj", "kdo", "kako", "kje", "kdaj", "koliko", "zakaj", "katere", "kateri",
  "je", "niso", "bil", "bila", "bili", "bilo", "se", "si", "so",
  "ni", "vse", "za", "od", "pri", "ob", "po", "nad", "iz", "ali", "ne",
  "danes", "takrat", "tam", "tukaj", "letnica", "letom", "casu",
  "vas", "vasi", "kraj", "kraju", "reka", "reki", "cerkev", "cerkvi",
  "predmet", "predmeti", "zbirka", "zbirke", "muzej", "muzeju", "muzejski",
  "zgodovina", "zgodovini", "dogajalo", "dogodil", "zgodilo", "vemo",
  "pripoveduje", "predstavlja", "ustanovil", "ustanovitev", "vodic",
  // angleščina
  "what", "who", "how", "where", "when", "why", "which", "was", "were", "did",
  "the", "and", "for", "from", "with", "that", "this", "there", "here", "about",
  "tell", "tells", "says", "said", "any", "all", "one", "two", "village",
  "museum", "collection", "record", "records", "exhibit", "exhibits",
  "history", "related", "connected", "happened", "happening", "know", "known",
  // nemščina
  "der", "die", "das", "wer", "wie", "wo", "wann", "warum", "und", "mit",
  "von", "fur", "uber", "ein", "eine", "dorf", "sammlung",
  // pogosti glagoli/polnilnice (vseh jezikov) + časovne funkcije
  "ima", "imajo", "sta", "ste", "smo", "gre", "lahko", "tudi", "potem",
  "torej", "ampak", "vendar", "saj", "zelo", "prvi", "drugi", "hvala",
  "prosim", "povej", "povejte", "leta", "leto", "letu", "okoli", "tisti",
  "has", "have", "are", "can", "hat", "sind", "auch", "sehr", "neue",
  "sono", "molto", "anche", "quanti", "quante",
  // italijanščina
  "chi", "come", "dove", "quando", "perche", "cosa", "con", "del", "della",
  "nel", "una", "villaggio", "museo", "collezione", "storia",
]);

function tokensOf(normalized: string): string[] {
  return normalized.split(" ").filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

/** Dolžina skupnega začetka dveh besed (za predponsko ujemanje oblik). */
function commonPrefixLen(a: string, b: string): number {
  let n = 0;
  while (n < a.length && n < b.length && a[n] === b[n]) n++;
  return n;
}

/**
 * Ujemanje žetona vprašanja z žetonom entitete: enako, ali predponsko
 * (zvon ~ zvona, griblje ~ gribljah, barle = barle). Splošne besede so
 * predhodno odstranjene s seznamom STOPWORDS.
 */
function tokenMatches(qt: string, et: string): boolean {
  if (qt === et) return true;
  const p = commonPrefixLen(qt, et);
  if (p >= 4 && (qt.startsWith(et) || et.startsWith(qt) || p >= 5)) return true;
  // Slovenske sklanjatve s spremembo končnega samoglasnika (kolpa/kolpi):
  // odstranimo po en končni samoglasnik in primerjamo debla.
  const stem = (w: string) => w.replace(/[aeiou]$/, "");
  const qs = stem(qt);
  const es = stem(et);
  return qs.length >= 3 && qs === es;
}

/** Letnice v vprašanju (1400–2099). */
export function yearsIn(question: string): number[] {
  const out: number[] = [];
  for (const m of question.matchAll(/\b(1[4-9]\d{2}|20[0-9]{2})\b/g)) {
    const y = Number(m[1]);
    if (!out.includes(y)) out.push(y);
  }
  return out;
}

/* ---------------------------------------------------------------------------
 * Razrešitev entitet
 * ------------------------------------------------------------------------- */

type EntityHit = { entity: EntityRef; score: number };

function entityTokens(entity: EntityRef): string[] {
  const keys = [entity.labelSi, entity.labelEn, ...(entity.aliases ?? [])];
  const out = new Set<string>();
  for (const key of keys) {
    for (const tok of tokensOf(normalizeQuestion(key))) out.add(tok);
  }
  return [...out];
}

function matchEntities(
  questionTokens: string[],
  normalizedQuestion: string,
  years: number[],
): EntityHit[] {
  const hits: EntityHit[] = [];
  for (const entity of ENTITIES) {
    let score = 0;
    // Cela (večbesedna) oznaka ali alias kot podniz — najmočnejši zadetek.
    for (const key of [entity.labelSi, entity.labelEn, ...(entity.aliases ?? [])]) {
      const norm = normalizeQuestion(key);
      if (norm.length >= 6 && normalizedQuestion.includes(norm)) {
        score += norm.length >= 10 ? 6 : 4;
      }
    }
    // Žetonsko/predponsko ujemanje (oblike: zvon/zvona, Griblje/Gribljah).
    const et = entityTokens(entity);
    for (const etok of et) {
      for (const qt of questionTokens) {
        if (tokenMatches(qt, etok)) {
          score += etok.length >= 6 ? 3 : 2;
          break;
        }
      }
    }
    // Letnica nasproti sortKey časovne veze entitete (dogodki/časi).
    const sortKey = entity.type === "place" ? undefined : entity.time?.sortKey;
    if (sortKey !== undefined && years.includes(sortKey)) score += 4;
    if (score > 0) hits.push({ entity, score });
  }
  // Stabilna vrstnost: padajoča ocena, nato vrstni red registra (ID).
  hits.sort((a, b) => b.score - a.score || a.entity.id.localeCompare(b.entity.id));
  return hits;
}

/* ---------------------------------------------------------------------------
 * Razrešitev zapisov (besedilno iskanje po naslovu + povzetku, letnice)
 * ------------------------------------------------------------------------- */

type ExhibitHit = { exhibit: SeedExhibit; score: number };

function matchExhibits(
  questionTokens: string[],
  years: number[],
  layer: "sl" | "en",
  excludeSlugs: ReadonlySet<string>,
): ExhibitHit[] {
  const hits: ExhibitHit[] = [];
  for (const exhibit of seedExhibits) {
    if (excludeSlugs.has(exhibit.slug)) continue;
    const title = layer === "sl" ? exhibit.titleSi : exhibit.titleEn;
    const summary = layer === "sl" ? exhibit.summarySi : exhibit.summaryEn;
    const titleTokens = new Set(tokensOf(normalizeQuestion(title)));
    const summaryTokens = new Set(tokensOf(normalizeQuestion(summary)));
    let score = 0;
    for (const qt of questionTokens) {
      if ([...titleTokens].some((tt) => tokenMatches(qt, tt))) score += 3;
      else if ([...summaryTokens].some((st) => tokenMatches(qt, st))) score += 1;
    }
    for (const y of years) {
      const from = exhibit.yearFrom ?? Number.NaN;
      const to = exhibit.yearTo ?? Number.NaN;
      // Konec intervala ali zaprt interval, ki leto nosi; odprti interval
      // (→ danes) se NE razteza čez vsa leta — samo končna točka.
      if (from === y || to === y || (from < y && to > y)) score += 4;
    }
    if (score >= 3) hits.push({ exhibit, score });
  }
  hits.sort((a, b) => b.score - a.score || a.exhibit.slug.localeCompare(b.exhibit.slug));
  return hits;
}

/* ---------------------------------------------------------------------------
 * Namen (intent) — ZBIRKA / VIR / VEZ
 * ------------------------------------------------------------------------- */

const SOURCE_WORDS = new Set([
  "virov", "viri", "odkod", "od", "kod", "dokaz", "dokazi", "dokazovanje", "dokumentiran",
  "sources", "source", "evidence", "proof", "woher", "quellen", "quelle",
  "fonti", "fonte", "provjera", "dokaza", "znanje", "kakovemo",
]);
const RELATION_WORDS = new Set([
  "povezan", "povezani", "povezuje", "povezava", "povezanost", "veze",
  "related", "connects", "connection", "linked", "zusammenhang", "verbunden",
  "legame", "collegamento",
]);
const COLLECTION_WORDS = new Set([
  "pripoveduje", "predstavlja", "celotna", "celoten", "tells", "showcase",
  "overall", "erzahlt", "racconta", "kolekcija", "prica", "zbirki",
]);

/** Vzorci »KAJ ŠE NE VEMO« — po frazah; pozorno ozki, da NE ujamejo
 *  navadnih vprašanj (»Kaj se je zgodilo 1945?« ni vrzel). */
const GAP_PHRASES = [
  // slovenščina
  "ne vemo", "ne vem", "ni dokumentirano", "dovolj dokumentirano", "ni znan",
  "neznano", "manjka", "manjkajo", "ni razreseno", "odprta vprasanja",
  "niso dokumentirani", "ni dokumentiran", "se ne ve", "ne ve",
  // angleščina
  "we don t know", "don t know", "not documented", "undocumented", "unknown",
  "is missing", "are missing", "what we don t", "yet documented", "we lack",
  // nemščina
  "nicht wissen", "wir nicht", "nicht dokumentiert", "unbekannt",
  "was fehlt", "noch nicht", "wir nicht wissen",
  // italijanščina
  "non sappiamo", "non documentato", "sconosciuto", "cosa non",
  // hrvaščina
  "ne znamo", "nije dokumentirano", "nepoznato", "sto ne znamo",
];

function intentOf(normalizedQuestion: string): "collection" | "source" | "relation" | "gaps" | null {
  if (GAP_PHRASES.some((p) => normalizedQuestion.includes(p))) return "gaps";
  const words = new Set(normalizedQuestion.split(" "));
  if ([...SOURCE_WORDS].some((w) => words.has(w))) return "source";
  if ([...RELATION_WORDS].some((w) => words.has(w))) return "relation";
  if ([...COLLECTION_WORDS].some((w) => words.has(w))) return "collection";
  return null;
}

/* ---------------------------------------------------------------------------
 * Dokazni predmeti iz zapisa (AIEvidenceItem) — trditev + vir
 * ------------------------------------------------------------------------- */

const CLAIM_MAX_CHARS = 700;
const SOURCES_PER_EXHIBIT = 6;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + " …";
}

function evidenceItemsOf(
  exhibit: SeedExhibit,
  layer: "sl" | "en",
  /** Omejitev na dokazno vez (sourceIndex entitete), če je zapisana. */
  onlySourceIndex?: number,
): AIEvidenceItem[] {
  const title = layer === "sl" ? exhibit.titleSi : exhibit.titleEn;
  const claim = truncate(layer === "sl" ? exhibit.summarySi : exhibit.summaryEn, CLAIM_MAX_CHARS);
  const period = layer === "sl" ? exhibit.periodSi : exhibit.periodEn;
  const rows =
    onlySourceIndex !== undefined
      ? exhibit.sources.slice(onlySourceIndex, onlySourceIndex + 1)
      : exhibit.sources.slice(0, SOURCES_PER_EXHIBIT);
  return rows.map((s) => ({
    exhibitSlug: exhibit.slug,
    exhibitTitle: title,
    claim,
    evidenceStatus: exhibit.evidenceStatus,
    period,
    sourceKey: sourceKeyOf(s.nameSi, s.url ?? null),
    sourceIndex: exhibit.sources.indexOf(s),
    sourceName: layer === "sl" ? s.nameSi : s.nameEn,
    sourceUrl: s.url ?? undefined,
    sourceType: s.sourceType,
    license: s.license,
  }));
}

/** Mehki čas entitete — BESEDNO, z zastavico približnosti iz klasifikacije. */
function timeContextOf(entity: EntityRef, layer: "sl" | "en"): AITimeContext | null {
  const time = entity.type === "place" ? undefined : entity.time;
  if (!time) return null;
  const label = layer === "sl" ? time.labelSi : time.labelEn;
  const precision = EVENT_PRECISION[entity.id];
  const approximate =
    precision === "approximate" ||
    /≈|okoli|približ|pribliz|konec|okrog|around|approximately|late |early |circa|~/.test(label);
  return {
    label,
    approximate,
    sortKey: time.sortKey,
    entityId: entity.id,
  };
}

/* ---------------------------------------------------------------------------
 * Omejitve konteksta — meja sveta modela
 * ------------------------------------------------------------------------- */

const MAX_ENTITIES = 6;
const MAX_ENTITY_EVIDENCE = 5;
const MAX_STANDALONE_EXHIBITS = 6;
const MAX_OPEN_QUESTIONS = 4;
/** Za vprašanja »KAJ ŠE NE VEMO«: cela kuratorska vrsta je vsebina. */
const MAX_OPEN_QUESTIONS_GAPS = 12;

/* ---------------------------------------------------------------------------
 * GLAVNA FUNKCIJA: vprašanje → AIContext (+ sled za prikaz in zavrnitev)
 * ------------------------------------------------------------------------- */

export type RetrievalTrace = {
  queryType: CuratorQueryType;
  matchedEntities: EntityRef[];
  matchedExhibitSlugs: string[];
  years: number[];
  openQuestions: EntityQueueItem[];
  /** Zadetki besedilnega iskanja — pošteni predlogi ob zavrnitvi. */
  nearest: { slug: string; score: number }[];
};

export function buildContext(
  lang: CuratorLang,
  question: string,
): { context: AIContext; trace: RetrievalTrace } {
  const layer: "sl" | "en" = lang === "sl" || lang === "hr" ? "sl" : "en";
  const normalized = normalizeQuestion(question);
  const questionTokens = tokensOf(normalized);
  const years = yearsIn(normalized);
  const intent = intentOf(normalized);

  // --- 1. razrešitev entitet ---------------------------------------------
  const entityHits = matchEntities(questionTokens, normalized, years);

  // --- 2. razrešitev zapisov (zapisi prek entitet ne podvajajo) -----------
  const entitySlugs = new Set<string>();
  for (const hit of entityHits.slice(0, MAX_ENTITIES)) {
    for (const ev of hit.entity.evidence) entitySlugs.add(ev.slug);
  }
  const exhibitHits = matchExhibits(questionTokens, years, layer, entitySlugs);

  // --- 3. odprta kuratorska vprašanja --------------------------------------
  //    (a) vprašanje KAJ ŠE NE VEMO: kuratorska vrsta P0–P4 JE odgovor —
  //        muzejsko razumljiva besedila ENTITY_QUEUE gredo v kontekst;
  //    (b) sicer: vsa, katerih zapisi so v kontekstu; posebej P0-E1
  //        (Peter Madronič), če se ime pojavi v vprašanju, entiteta pa
  //        (pravilno) ne obstaja.
  const isGaps = intent === "gaps";
  const contextSlugs = new Set<string>(entitySlugs);
  for (const hit of exhibitHits.slice(0, MAX_STANDALONE_EXHIBITS)) {
    contextSlugs.add(hit.exhibit.slug);
  }
  const openQuestions: AIQuestionNote[] = [];
  const queuedIds = new Set<string>();
  const queueLimit = isGaps ? MAX_OPEN_QUESTIONS_GAPS : MAX_OPEN_QUESTIONS;
  const queueFor = (item: EntityQueueItem) => {
    if (queuedIds.has(item.id) || openQuestions.length >= queueLimit) return;
    queuedIds.add(item.id);
    openQuestions.push({
      id: item.id,
      priority: item.priority,
      text: layer === "sl" ? item.questionSi : item.questionEn,
      slugs: item.slugs,
    });
  };
  if (isGaps) {
    for (const item of ENTITY_QUEUE) queueFor(item);
  } else {
    for (const item of ENTITY_QUEUE) {
      if (item.slugs.some((s) => contextSlugs.has(s))) queueFor(item);
    }
  }
  const p0madronic = ENTITY_QUEUE.find((q) => q.id === "P0-E1");
  if (
    p0madronic &&
    /madronic/.test(normalized) &&
    !entityHits.some((h) => h.entity.type === "person" && /madronic/.test(normalizeQuestion(h.entity.labelSi)))
  ) {
    queueFor(p0madronic);
    for (const s of p0madronic.slugs) contextSlugs.add(s);
  }

  // --- 4. vrsta vprašanja ---------------------------------------------------
  const selectedEntities = entityHits.slice(0, MAX_ENTITIES).map((h) => h.entity);
  const kinds = new Set<EntityKind>(selectedEntities.map((e) => e.type));
  let queryType: CuratorQueryType;
  if (isGaps) queryType = "collection"; // kaj še ne vemo = vprašanje o ZBIRKI
  else if (intent === "collection") queryType = "collection";
  else if (intent === "relation" && selectedEntities.length >= 2) queryType = "relation";
  else if (intent === "source") queryType = "source";
  else if (kinds.has("person") && !kinds.has("place") && !kinds.has("event")) queryType = "person";
  else if (kinds.has("place") && !kinds.has("event")) queryType = "place";
  else if (kinds.has("event")) queryType = "event";
  else if (kinds.has("time") || years.length > 0) queryType = "time";
  else if (exhibitHits.length > 0) queryType = "object";
  else queryType = "object";

  // --- 5. sestava konteksta --------------------------------------------------
  const entities: AIEntityContext[] = selectedEntities.map((entity) => {
    const evidenceRows = entity.evidence.slice(0, MAX_ENTITY_EVIDENCE);
    const items: AIEvidenceItem[] = [];
    for (const ev of evidenceRows) {
      const exhibit = seedExhibits.find((e) => e.slug === ev.slug);
      if (!exhibit) continue;
      items.push(...evidenceItemsOf(exhibit, layer, ev.sourceIndex));
    }
    return {
      id: entity.id,
      type: entity.type,
      label: layer === "sl" ? entity.labelSi : entity.labelEn,
      exhibits: evidenceRows.map((r) => r.slug),
      evidence: items,
    };
  });

  const times: AITimeContext[] = [];
  for (const entity of selectedEntities) {
    const tc = timeContextOf(entity, layer);
    if (tc) times.push(tc);
  }

  const exhibits: AIEvidenceItem[] = [];
  for (const hit of exhibitHits.slice(0, MAX_STANDALONE_EXHIBITS)) {
    exhibits.push(...evidenceItemsOf(hit.exhibit, layer));
  }

  // --- 6. zemljevid PREVERBE navedkov (strežniško, ne v prompt) --------------
  const provided = new Map<string, AIProvidedExhibit>();
  const addProvided = (exhibit: SeedExhibit) => {
    if (provided.has(exhibit.slug)) return;
    provided.set(exhibit.slug, {
      title: layer === "sl" ? exhibit.titleSi : exhibit.titleEn,
      museumNo: exhibit.museumNo ?? null,
      claim: truncate(layer === "sl" ? exhibit.summarySi : exhibit.summaryEn, CLAIM_MAX_CHARS),
      evidenceStatus: exhibit.evidenceStatus,
      period: layer === "sl" ? exhibit.periodSi : exhibit.periodEn,
      sources: exhibit.sources.map((s) => ({
        sourceKey: sourceKeyOf(s.nameSi, s.url ?? null),
        sourceName: s.nameSi,
        sourceUrl: s.url ?? null,
        sourceType: s.sourceType,
        license: s.license,
      })),
    });
  };
  for (const entity of selectedEntities) {
    for (const ev of entity.evidence.slice(0, MAX_ENTITY_EVIDENCE)) {
      const exhibit = seedExhibits.find((e) => e.slug === ev.slug);
      if (exhibit) addProvided(exhibit);
    }
  }
  for (const hit of exhibitHits.slice(0, MAX_STANDALONE_EXHIBITS)) addProvided(hit.exhibit);
  for (const item of openQuestions) {
    for (const s of item.slugs) {
      const exhibit = seedExhibits.find((e) => e.slug === s);
      if (exhibit) addProvided(exhibit);
    }
  }

  const context: AIContext = {
    lang,
    layer,
    queryType,
    question,
    entities,
    times,
    exhibits,
    openQuestions,
    collection:
      queryType === "collection" || isGaps ||
      (queryType === "source" && entities.length === 0 && exhibits.length === 0)
        ? buildCollectionContext(layer)
        : undefined,
    provided,
  };

  const nearest = matchExhibits(questionTokens, years, layer, new Set())
    .slice(0, 3)
    .map((h) => ({ slug: h.exhibit.slug, score: h.score }));

  return {
    context,
    trace: {
      queryType,
      matchedEntities: selectedEntities,
      matchedExhibitSlugs: [...provided.keys()],
      years,
      openQuestions: ENTITY_QUEUE.filter((q) => queuedIds.has(q.id)),
      nearest,
    },
  };
}

/* ---------------------------------------------------------------------------
 * Pregled zbirke (COLLECTION) — števci + naslovi, nikoli vsebina
 * ------------------------------------------------------------------------- */

function buildCollectionContext(layer: "sl" | "en"): AICollectionContext {
  const featured = seedExhibits.filter((e) => e.featured);
  const events = ENTITIES.filter(
    (e): e is Extract<EntityRef, { type: "event" }> => e.type === "event",
  );
  const eraMap = new Map<string, number>();
  for (const ev of events) {
    const key = ev.time?.sortKey;
    if (key === undefined) continue;
    const era = eraOfSortKey(key);
    eraMap.set(era, (eraMap.get(era) ?? 0) + 1);
  }
  return {
    exhibitCount: seedExhibits.length,
    sourceRowCount: seedExhibits.reduce((n, e) => n + e.sources.length, 0),
    sourceIdentityCount: SOURCE_USAGE.size,
    entityCounts: {
      person: entitiesOfKind("person").length,
      place: entitiesOfKind("place").length,
      event: events.length,
      time: entitiesOfKind("time").length,
    },
    featuredTitles: featured.slice(0, 8).map((e) => (layer === "sl" ? e.titleSi : e.titleEn)),
    eras: ERA_ORDER.map((era) => ({ era, events: eraMap.get(era) ?? 0 })),
  };
}

/* ---------------------------------------------------------------------------
 * PREVERBA ZADOVOLJIVEGA DOKAZA (hallucination guard, PRED klicem modela)
 * ------------------------------------------------------------------------- */

/** true, kadar kontekst nosi vsaj en dokazni predmet s trditvijo
 *  (ali pa je vprašanje tipa ZBIRKA — pregled je vedno dokazljiv). */
export function contextHasEvidence(context: AIContext): boolean {
  if (context.entities.some((e) => e.evidence.length > 0)) return true;
  if (context.exhibits.length > 0) return true;
  if (context.queryType === "collection") return true;
  return false;
}
