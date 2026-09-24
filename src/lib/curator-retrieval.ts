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
 * Griblje/Gribljah) — obseg zbirke in entitetne plasti ne potrebuje vektorjev
 * niti grafske baze (navodilo: NO BLIND RAG, NO GRAPH DATABASE).
 */

import { seedExhibits, type SeedExhibit } from "@/lib/museum-content";
import {
  ENTITIES,
  ENTITY_BY_ID,
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
  AIEvidenceRelation,
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
    // TASK 42 §10: SL »Ali je …?« vprašanja so imela samo HR oznako »ali« —
    // dodane enključno slovenske besede (kot/dogodek/sta) razrešijo smer.
    "kot", "dogodek", "dogodki", "dogodkov", "sta", "kdo je", "kaj je",
  ]),
  hr: new Set([
    "sto", "tko", "gdje", "kada", "zasto", "koji", "koja", "koje", "kao", "li",
    "su", "nisu", "bio", "nesto", "netko", "ovaj", "ovdje", "tamo",
    "jos", "opet", "znamo", "znas", "reci", "molim", "vec",
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
    // TASK 42 §10: »Was geschah Ende März 1945?« — brez teh besed se
    // »was« izenači z EN in nemško vprašanje dobi slovenski odgovor.
    "geschah", "geschehen", "geschecht", "ende", "wurde", "wurden",
    "seit", "jahr", "jahre", "jahres", "dorfes", "erzahlte",
  ]),
  it: new Set([
    "cosa", "chi", "dove", "quando", "perche", "quale", "quali",
    "di", "il", "lo", "la", "le", "gli", "un", "una", "sono", "stato",
    "stata", "racconta", "raccontami", "per", "favore", "grazie", "ma",
    "qui", "questa", "questo", "curatore",
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

/** Priponske končnice sklanjatve/množine: ena beseda se ZAČNE z drugo in
 *  ostanek je ena od znanih končnic (zvon → zvona/zvonovi, kraj → kraje,
 *  Griblje → Gribljah prek ≥ 6 znakov). Ostanek, ki NI končnica, je DRUGO
 *  geslo — to je bila luža TASK 42.1 §2: »svetlobe« ~ »svet« (svetloba ≠
 *  svet, skupna predpona 4 znakov), »francije« ~ »franc« (Francija ≠ Franc),
 *  »zemlja« ~ »zemljevidi« (5 znakov brez predponske oblike). */
const INFLECTION_TAILS = new Set([
  // slovensko/HR sklanjatve (enični/množinski končnici brez −ija/-ij)
  "a", "e", "i", "o", "u", "m", "ov", "ova", "ove", "ovi", "ovih",
  "ev", "eva", "eve", "evi", "evih", "em", "om", "im", "ih",
  "ah", "am", "ami", "ja", "je", "ji", "jo", "ju",
  "ga", "ge", "gi", "gu", "ema", "ama", "tih",
  // angleške množine/besedne oblike
  "s", "es",
]);

/**
 * Ujemanje žetona vprašanja z žetonom entitete/zapisa: enako, predponsko
 * (Griblje ~ Gribljah, ≥ 6 znakov), predponska oblika s PRIPONSKO končnico
 * (zvon ~ zvona, zvon ~ zvonovi) ali enakovredno deblo (kolpa ~ kolpi).
 * Splošne besede so predhodno odstranjene s seznamom STOPWORDS.
 */
function tokenMatches(qt: string, et: string): boolean {
  if (qt === et) return true;
  const p = commonPrefixLen(qt, et);
  // Dolga skupna predpona je sama po sebi dovolj (Griblje/Gribljah, kolpa/kolpini …).
  if (p >= 6) return true;
  // Krajša beseda se ZAČNE z daljšo + ostanek je znana končnica sklanjatve
  // (zvon/zvona, kraj/kraju). Ostanek, ki ni končnica (svet→svet-lobe,
  // franc→franc-ije, bozo→bozo-n), je drugo geslo in NE ustreza.
  if (p >= 4 && (qt.startsWith(et) || et.startsWith(qt))) {
    const longer = qt.length > et.length ? qt : et;
    const tail = longer.slice(p);
    if (tail.length <= 4 && INFLECTION_TAILS.has(tail)) return true;
  }
  // Slovenske sklanjatve s spremembo končnega samoglasnika (kolpa/kolpi,
  // zvona/zvon): odstranimo po en končni samoglasnik in primerjamo debla.
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

/** Muzejske številke v vprašanju (MVG-014 / »mvg 14«) — TASK 42 §5:
 *  agresivna vprašanja po MVG številkah morajo razrešiti PRAVE zapise
 *  (prej so bila zavrnjena, ker žetoni »mvg/014« ne zadetkajo naslovov). */
export function mvgNumbersIn(normalized: string): number[] {
  const out: number[] = [];
  for (const m of normalized.matchAll(/\bmvg\s?(\d{1,3})\b/g)) {
    const n = Number(m[1]);
    if (!out.includes(n)) out.push(n);
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

/** Interni ID registra v besedilu vrzeli → berljiva oznaka entitete
 *  (kontekst/model/uporabnik NE vidita ID-jev — TASK 42 §14/§17). */
function museumReadable(text: string, layer: "sl" | "en"): string {
  return text.replace(/\b(person|place|event|time):[a-z0-9-]+\b/g, (id) => {
    const ref = ENTITY_BY_ID.get(id);
    if (!ref) return id;
    return layer === "sl" ? ref.labelSi : ref.labelEn;
  });
}

/** Higiena opombe registra za identiteto v kontekstu (TASK 43, enaka
 *  higiena kot pri besedilu kuratorske vrste — TASK 42 §14/§17): interni
 *  ID-ji se nadomestijo z berljivimi oznakami, interne kode kuratorske
 *  vrste (P0–P4, P1-E4 …) pa se umaknejo — opomba je muzejska VSEBINA,
 *  njena interna navigacija pa modela ne zanima (in ne sme priti vanj).
 *  Primer: »Rojstno leto ni zapisano (P3-E4).« → »Rojstno leto ni
 *  zapisano.« — podatek ostane, interna koda odpade. */
function identityNoteReadable(note: string, layer: "sl" | "en"): string {
  let text = museumReadable(note, layer);
  // oklepajna omemba kode odpade CELO (»(P3-E4)«, »(P1-E4, …)«)
  text = text.replace(/\(\s*P[0-4](?:-[Ee][0-9]+)?[^)]*\)/g, "");
  // gole kode (zavarovalno, tudi brez oklepaja)
  text = text.replace(/\bP[0-4](?:-[Ee][0-9]+)?\b/g, "");
  return text
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();
}

type ExhibitHit = { exhibit: SeedExhibit; score: number };

/** Ali KATERI KOLI vsebinski žeton vprašanja ujema katero koli muzejsko
 *  besedo (oznake/aliasi entitet registra + naslovi/povzetki vseh zapisov)?
 *  TASK 42.1 §2: letnica sama ne dokazuje relevantnosti — če NOBENA beseda
 *  vprašanja ni muzejska (»papež leta 1500«, »hitrost svetlobe«), zadetki
 *  po letnici niso sidrani; varneje je zavrniti (»ni dovolj dokumentiranih
 *  podatkov«) kot prikazati navidezno relevanten zapis. Če vprašanje sploh
 *  nima vsebinskih žetonov (»Kaj se je zgodilo leta 1942?«), je letnica
 *  edina sled in USTREZNA. */
function vocabularyAnchorExists(questionTokens: string[]): boolean {
  if (questionTokens.length === 0) return true;
  for (const entity of ENTITIES) {
    for (const etok of entityTokens(entity)) {
      for (const qt of questionTokens) {
        if (tokenMatches(qt, etok)) return true;
      }
    }
  }
  for (const exhibit of seedExhibits) {
    for (const key of [exhibit.titleSi, exhibit.titleEn, exhibit.summarySi, exhibit.summaryEn]) {
      if (!key) continue;
      for (const tt of tokensOf(normalizeQuestion(key))) {
        for (const qt of questionTokens) {
          if (tokenMatches(qt, tt)) return true;
        }
      }
    }
  }
  return false;
}

function matchExhibits(
  questionTokens: string[],
  years: number[],
  layer: "sl" | "en",
  excludeSlugs: ReadonlySet<string>,
  mvgNumbers: number[] = [],
  /** Letni zadetki štejejo samo, kadar ima vprašanje besedilno sidro
   *  (vidno zgornje) ali sploh nič vsebinskih žetonov. */
  yearPoints = true,
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
    if (yearPoints) {
      for (const y of years) {
        const from = exhibit.yearFrom ?? Number.NaN;
        const to = exhibit.yearTo ?? Number.NaN;
        // Konec intervala ali zaprt interval, ki leto nosi; odprti interval
        // (→ danes) se NE razteza čez vsa leta — samo končna točka.
        if (from === y || to === y || (from < y && to > y)) score += 4;
      }
    }
    // Muzejska številka (MVG-014) — najmočnejša razrešitev zapisa.
    if (exhibit.museumNo && mvgNumbers.includes(Number(exhibit.museumNo.slice(4)))) {
      score += 9;
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
 * LASTNA IDENTITETA ENTITETE (TASK 43 — identity context hardening)
 *
 * Korenski vzrok FAIL #23 (»Kdo je bil Ivan Barle?« → Konradova biografija):
 * AIEntityContext je nosil le oznako + zapise, v katerih je entiteta
 * omenjena — trditve teh zapisov pa govorijo o NJIHOVIH subjektih. Ivanova
 * ENTITETA je nosila Konradov zapis; njegova LASTNA registrirana identiteta
 * (EntityRef.note + SoftTime) pa modela NI nikoli dosegla.
 *
 * Popravek je DETERMINISTIČEN in IZKLJUČNO iz obstoječega registra:
 *  - identity   — SoftTime (plast konteksta) + kuratorska opomba registra;
 *  - isTarget   — entiteta je predmet vprašanja (žetoni oznake/aliasa);
 *  - distinctFrom — druge registrirane OSEBE z deljenim žetonom imena
 *                   (priimkom) — LOČENI vnosi (trije Barle, Zupaniči …);
 *  - relation   — zapis je O entiteti (slug/naslov) ali jo le OMINJA.
 * NIKAKRŠNO novo zgodovinsko dejstvo se ne dodaja: uporabljen je SAMO
 * podatek, ki v registru ŽE obstaja (enako priporočilo Field Validation).
 * Ni NLI, ni drugega LLM, ni embeddingov — samo preoblikovanje obstoječih
 * podatkov v jasno ločene plasti: LASTNA IDENTITETA / OMENBE V ZAPISIH.
 * ------------------------------------------------------------------------- */

/** Vse izpričane oblike imena entitete (oznaki SL/EN + aliasi), normalizirane. */
function entityKeys(entity: EntityRef): string[] {
  return [entity.labelSi, entity.labelEn, ...(entity.aliases ?? [])]
    .map((k) => normalizeQuestion(k))
    .filter((k) => k.length > 0);
}

/** Ujemanje žetona vprašanja z žetonom entitete v smeri NAPREJ (TASK 43,
 *  samo za isTarget): vprašanje lahko nosi le OBLIKO osnovne besede —
 *  enake dolžine (kolpa/kolpi) ali daljšo (Griblje/Gribljah, zvon/zvona),
 *  nikoli KRAJŠO. »Dragoš« v vprašanju zato NE cilja na kraj »Dragoši«
 *  (drugega imena, druga entiteta), »Kolpi« pa pravilno cilja na Kolpo. */
function tokenMatchesForward(qt: string, et: string): boolean {
  if (qt === et) return true;
  if (qt.length < et.length) return false;
  return tokenMatches(qt, et);
}

/** Je entiteta PREDMET vprašanja? Cela oznaka/alias kot podniz vprašanja
 *  ali VSI žetoni oznake/aliasa prisotni v vprašanju (sklanjatveno
 *  ujemanje V NAPREJ — glej tokenMatchesForward). Deterministično — brez
 *  modela. Več entitet je lahko hkrati predmet (»Ali sta Ivan in Konrad
 *  Barle ista oseba?«). */
function entityIsTarget(
  entity: EntityRef,
  normalizedQuestion: string,
  questionTokens: string[],
): boolean {
  for (const key of entityKeys(entity)) {
    if (key.length >= 5 && normalizedQuestion.includes(key)) return true;
    const keyTokens = tokensOf(key);
    if (
      keyTokens.length > 0 &&
      keyTokens.every((kt) => questionTokens.some((qt) => tokenMatchesForward(qt, kt)))
    ) {
      return true;
    }
  }
  return false;
}

/** Lastna identiteta entitete IZ REGISTRA: mehki čas (v plasti konteksta) +
 *  kuratorska opomba (EntityRef.note), očiščena internih referenc (ID-ji,
 *  kode vrste). Sestavljeno deterministično; če registra ne nosi nobenega
 *  od obeh, polje odpade (NIČ izmišljanja). */
function identityOf(entity: EntityRef, layer: "sl" | "en"): string | undefined {
  const time = entity.type === "place" ? undefined : entity.time;
  const timeLabel = time ? (layer === "sl" ? time.labelSi : time.labelEn) : null;
  const note = entity.note ? identityNoteReadable(entity.note, layer) : null;
  if (timeLabel && note) return `${timeLabel} — ${note}`;
  return timeLabel ?? note ?? undefined;
}

/** Žetoni imena v priimkovnem položaju (vsi razen prvega; enobesedna
 *  oznaka pa svoj edini žeton) — osnova za iskanje priimkovnih sorodnikov
 *  v registru. Dolžina ≥ 4, da kratka splošna beseda ne povezuje oseb. */
function nameTailTokens(entity: EntityRef): string[] {
  const out = new Set<string>();
  for (const key of entityKeys(entity)) {
    const toks = tokensOf(key);
    if (toks.length === 0) continue;
    for (const t of toks.length === 1 ? toks : toks.slice(1)) {
      if (t.length >= 4) out.add(t);
    }
  }
  return [...out];
}

const DISTINCT_FROM_MAX = 5;

/** Druge registrirane OSEBE z deljenim žetonom imena (priimkovni sorodniki
 *  iz registra) — LOČENI vnosi, nikoli ista oseba. Navedene z lastnimi
 *  letnicami, kadar so v registru zapisane. Osebe brez take veze (npr.
 *  Jože Dular — Janez Dular NI v registru) polja nimajo. */
function distinctPersonsOf(entity: EntityRef, layer: "sl" | "en"): string[] | undefined {
  if (entity.type !== "person") return undefined;
  const myTokens = nameTailTokens(entity);
  if (myTokens.length === 0) return undefined;
  const out: string[] = [];
  for (const other of ENTITIES) {
    if (other.id === entity.id || other.type !== "person") continue;
    const otherTokens = nameTailTokens(other);
    const shares = otherTokens.some((t) =>
      myTokens.some((m) => tokenMatches(m, t) || tokenMatches(t, m)),
    );
    if (!shares) continue;
    const label = layer === "sl" ? other.labelSi : other.labelEn;
    const time = other.time;
    out.push(time ? `${label} (${layer === "sl" ? time.labelSi : time.labelEn})` : label);
    if (out.length >= DISTINCT_FROM_MAX) break;
  }
  return out.length > 0 ? out : undefined;
}

/** Ali je zapis O entiteti: slug zapisa je enak slug-delu ID-ja entitete
 *  (person:konrad-barle → zapis konrad-barle) ALI cela oznaka/alias
 *  entiteta je podniz NASLOVA zapisa (naslovi lastnih zapisov nosijo ime
 *  subjekta). Sicer je entiteta v zapisu le OMENJENA — zapis ostane v
 *  kontekstu kot povezan dokaz, a z jasno označeno vlogo (TASK 43 §7:
 *  omemba NE sme postati biografija, dokaz se NE odstrani). */
function exhibitIsAboutEntity(
  exhibit: SeedExhibit,
  entity: EntityRef,
  layer: "sl" | "en",
): boolean {
  if (exhibit.slug === entity.id.split(":")[1]) return true;
  const title = normalizeQuestion(layer === "sl" ? exhibit.titleSi : exhibit.titleEn);
  if (!title) return false;
  for (const key of entityKeys(entity)) {
    if (key.length >= 5 && title.includes(key)) return true;
  }
  return false;
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
  /** Odnos zapisa do entitete konteksta (TASK 43); brez vrednosti pri
   *  samostojnih zapisih brez entitetne veze. */
  relation?: AIEvidenceRelation,
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
    ...(relation ? { relation } : {}),
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
  const mvgNumbers = mvgNumbersIn(normalized);
  const intent = intentOf(normalized);
  // Besedilno sidro (TASK 42.1 §2): letnica brez ene same muzejske besede
  // v vprašanju ne dokazuje relevantnosti — zadetki po letnici takrat ne
  // štejejo (varneje zavrniti kot prikazati navidezno relevanten zapis).
  // Samo številski žetoni (leta: »leta 1942«) so domena LETNE plasti in
  // se kot sidro NE štejejo — »Kaj se je zgodilo leta 1942?« ima pravico
  // do klica; »Kdo je bil papež leta 1500?« pa nima (papež ni muzejska
  // beseda, letnica sama pa ne dokazuje relevantnosti).
  const contentTokens = questionTokens.filter((t) => !/^\d+$/.test(t));
  const vocabAnchored =
    mvgNumbers.length > 0 ||
    contentTokens.length === 0 ||
    vocabularyAnchorExists(contentTokens);

  // --- 1. razrešitev entitet ---------------------------------------------
  const entityHits = matchEntities(questionTokens, normalized, years);

  // --- 2. razrešitev zapisov (zapisi prek entitet ne podvajajo) -----------
  const entitySlugs = new Set<string>();
  for (const hit of entityHits.slice(0, MAX_ENTITIES)) {
    for (const ev of hit.entity.evidence) entitySlugs.add(ev.slug);
  }
  const exhibitHits = matchExhibits(questionTokens, years, layer, entitySlugs, mvgNumbers, vocabAnchored);

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
      // Besedilo vrzeli v MUZEJSKO berljivi obliki: interni ID-ji registra
      // (person:…, place:…, TASK 42 §14/§17) se nadomestijo z oznakami.
      text: museumReadable(layer === "sl" ? item.questionSi : item.questionEn, layer),
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
      const about = exhibitIsAboutEntity(exhibit, entity, layer);
      items.push(
        ...evidenceItemsOf(exhibit, layer, ev.sourceIndex, about ? "about-this-entity" : "mentioned-in-record"),
      );
    }
    return {
      id: entity.id,
      type: entity.type,
      label: layer === "sl" ? entity.labelSi : entity.labelEn,
      // TASK 43: lastna identiteta iz registra + predmet vprašanja +
      // priimkovno ločeni vnosi — vse deterministično, vse že v registru.
      identity: identityOf(entity, layer),
      isTarget: entityIsTarget(entity, normalized, questionTokens),
      distinctFrom: distinctPersonsOf(entity, layer),
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

  const nearest = matchExhibits(questionTokens, years, layer, new Set(), mvgNumbers, vocabAnchored)
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
