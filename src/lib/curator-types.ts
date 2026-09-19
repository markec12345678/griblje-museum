/**
 * POGODBA O PODATKIH (DATA CONTRACT) — AI KUSTOS MUZEJA GRIBLJE.
 * (41. sklop / TASK 41 — EVIDENCE-GROUNDED AI CURATOR)
 *
 * AI KUSTOS NI SPLOŠNI CHATBOT. Je JEZIKOVNI VMESNIK nad obstoječim
 * dokaznim muzealnim korpusom. Model ne sme sam dodajati zgodovinskih
 * dejstev — LLM je ZADNJA plast sinteze, nikoli vir:
 *
 *     UPORABNIKOVO VPRAŠANJE
 *       → NAMEN / RAZREŠITEV ENTITET (retrieval, BREZ modela)
 *       → MUZEJSKI PODATKI (seme) → ENTITETNI REGISTR → ZAPIS
 *       → DOKAZ (evidence) → VIR (sourceKey)
 *       → LLM SINTEZA (samo A / B / C — glej spodaj)
 *       → ODGOVOR + NAVEDKI + NEGOTOVOST
 *
 * KAJ SME PRITI V PROMPT (ta pogodba, spodnji tipi):
 *  - AIEvidenceItem   — trditev zapisa (povzetek), status zanesljivosti,
 *                       vir s sourceKey/sourceIndex/sourceName/sourceUrl,
 *                       obdobje KOT JE ZAPISANO, odnos do entitete
 *                       (about-this-entity / mentioned-in-record);
 *  - AIEntityContext  — obstoječa entiteta registra (id, vrsta, oznaka,
 *                       lastna identiteta iz registra, predmet vprašanja,
 *                       sorodne ločene osebe, zapisi, dokazi) — NIKOLI
 *                       entiteta iz uporabnikovega vprašanja;
 *  - AITimeContext    — mehki čas, OHRANJEN besedno (≈, intervali, unresolved);
 *  - AIQuestionNote   — odprta kuratorska vprašanja (ENTITY_QUEUE) in
 *                       poštena opomba omejitve, kadar je odločilna.
 *
 * KAJ NE SME PRITI V PROMPT (notranje stanje, ne vsebina):
 *  - celotni zgodb (story) — povzetek je trditev, zgodba ostaja na zapisu;
 *  - 372 biografskih faz predmetov (niso trditve tega sloja);
 *  - koordinat, poti slik, notranjih ID-jev baze, sortOrder, IP naslovov,
 *    stanja predpomnilnika, omejitvenih števcev;
 *  - zapisov, ki jih razrešitev entitet ni izbrala (ZAPRTA DOKAZNA SVET,
 *    ne celoten dosje — meja konteksta je meja sveta modela).
 *
 * ABSOLUTNO PRAVILO — model sme napisati samo:
 *   A  kar je neposredno dokazano v posredovanem muzejskem kontekstu;
 *   B  kar je legitimna sinteza več PODANIH dokazov;
 *   C  da podatka ni (»Tega v trenutni muzejski zbirki nimamo dovolj
 *      dokumentiranega.«).
 * Zunaj konteksta (lastno predznanje, Wikipedia, splet, spomin) je
 * ZAPRTA VRATA — korpus je CLOSED WORLD.
 *
 * IDENTITETA VIROV: samo obstoječi sourceKey iz source-registry.ts;
 * »sourceKey = generated« NE obstaja. Vsaka dejanska trditev ima verigo
 * trditev → zapis ([[slug]]) → vir (sourceKey).
 *
 * NEGOTOVOST SE OHRANJA: »konec marca 1945« NI 25. 3. 1945; »1880–1914«
 * NI 1900; unresolved ostane unresolved. Osebe/dogodki se NIKOLI ne
 * združujejo (trije Barle; MVG-014 ↔ MVG-056 sta dva zapisa z odprtim
 * kuratorskim vprašanjem P1-E1; dva Petra Madroniča nima entitete).
 *
 * LASTNA IDENTITETA PRED OMEMBAMI (TASK 43): identiteta entitete je njen
 * REGISTRSKI podatek (identity); zapis, ki entiteto le omenja
 * (relation: mentioned-in-record), dokazuje OMEMBO in subjekt SVOJEGA
 * zapisa — ne biografije omenjene osebe. Priimkovne sorodnike iz
 * distinctFrom sme model imenovati kot LOČENE osebe, ne kot isto osebo.
 *
 * VBRIZGIVANJE (injection): muzejski podatki so PODATKI, ne navodila.
 * Vsebina virov z navodili (»Ignore previous instructions …«) ostane
 * vsebina. Tudi uporabnik ne more prisiliti modela v izmišljanje vira,
 * datuma, združitev ali potrditev unresolved podatka.
 *
 * TA DATOTEKA JE EDINA MEJA MED MUZEJEM IN MODELOM. Vse, kar gre v
 * prompt, gre skozi te tipe; vse, kar pride ven, gre skozi preverbo
 * navedkov (curator-provider.ts — verifyAnswer).
 */

import type { EntityKind } from "@/lib/entities";

/** Jeziki odgovarjanja kustosa (enako kot vodnik: 5 jezikov vmesnika). */
export type CuratorLang = "sl" | "en" | "hr" | "de" | "it";

/** Vrste vprašanj, ki jih kustos minimno podpira (navodilo TASK 41). */
export type CuratorQueryType =
  | "object" // Kaj je ta predmet?
  | "person" // Kdo je bil Konrad Barle?
  | "place" // Kaj se je dogajalo ob Kolpi?
  | "event" // Kaj se je zgodilo leta 1945?
  | "time" // Kaj se je dogajalo okoli leta 1468?
  | "relation" // Kako je ta predmet povezan z Gribljami?
  | "source" // Od kod to vemo?
  | "collection"; // Kaj pripoveduje ta zbirka?

/** Zunanji razlog, ko kustos ne more odgovoriti (deterministično, brez modela). */
export type CuratorRefusalReason =
  | "insufficient_evidence" // korpus ne nosi dovolj dokaza za vprašanje
  | "synthesis-unavailable"; // model/ponudniki niso mogli dati preverljivega odgovora

/* ---------------------------------------------------------------------------
 * MINIMALNI OBJEKTI, KI SMEJO V KONTEKST MODELA (pogodba, vrstni red pomembnosti)
 * ------------------------------------------------------------------------- */

/** Odnos zapisa do entitete, katere kontekst nosi dokaz (TASK 43):
 *  - "about-this-entity" — zapis je O entiteti (naslov nosi njeno ime ali
 *    slug zapisa je enak slug-delu ID-ja entitete — npr. zapis konrad-barle
 *    za person:konrad-barle);
 *  - "mentioned-in-record" — entiteta je v zapisu O DRUGEM subjektu le
 *    OMENJENA (npr. Ivan Barle, omenjen v Konradovem zapisu).
 *  Oznaka je deterministično izpeljana iz obstoječih podatkov (naslov/slug),
 *  ne iz nove kuratorske odločitve. Dokazi BREZ entitetne veze (prosto
 *  besedilno ujemanje po zapisih) oznake nosijo, kadar je veza znana. */
export type AIEvidenceRelation = "about-this-entity" | "mentioned-in-record";

/** En dokazni predmet: trditev zapisa + vir, ki jo nosi. */
export type AIEvidenceItem = {
  exhibitSlug: string;
  exhibitTitle: string;

  /** Trditev muzeja o tem zapisu (povzetek — ne cela zgodba). */
  claim: string;

  /** Odnos zapisa do entitete konteksta (glej AIEvidenceRelation); BREZ
   *  vrednosti pri samostojnih zapisih brez entitetne veze. */
  relation?: AIEvidenceRelation;

  /** DOCUMENTED / CORROBORATED / TESTIMONY / TRADITION / UNVERIFIED … */
  evidenceStatus: string;

  /** Obdobje KOT JE ZAPISANO (npr. »≈ konec marca 1945«, »1880–1914«). */
  period?: string;

  sourceKey?: string;
  sourceIndex?: number;

  sourceName?: string;
  sourceUrl?: string;
  sourceType?: string;
  license?: string;
};

/** Kontekst obstoječe entitete registra (nikoli nove, iz vprašanja). */
export type AIEntityContext = {
  id: string;
  type: EntityKind;
  label: string;

  /** LASTNA IDENTITETA entitete IZ REGISTRA (TASK 43): mehki čas (v plasti
   *  konteksta) + kuratorska opomba registra (EntityRef.note), kot sta
   *  ZAPISANA. Nič ni pridobljeno izven registra — polje je sestavljeno
   *  deterministično, da ga model vidi kot identiteto OSEBE/KRAJA, ne pa
   *  le kot seznam zapisov, v katerih je entiteta omenjena. */
  identity?: string;

  /** true, kadar je entiteta PREDMET vprašanja (vsak žeton oznake/aliasa
   *  se v vprašanju pojavi, ali cela oznaka je podniz vprašanja) —
 *  deterministično, BREZ modela. Več entitet je lahko hkrati predmet
 *  (»Ali sta Ivan in Konrad Barle ista oseba?«). */
  isTarget?: boolean;

  /** Druge registrirane OSEBE, ki si z entiteto delijo žeton imena
 *  (priimek) — LOČENI vnosi registra, nikoli ista oseba (trije Barle,
 *  Zupaniči, Totterji). Osebe BREZ take veze polja nimajo. */
  distinctFrom?: string[];

  /** Zapisi, v katerih je entiteta izpričana (samo iz evidence vezi). */
  exhibits: string[];

  evidence: AIEvidenceItem[];
};

/** Mehki čas — besedilo, ki se NE pretvarja v datum. */
export type AITimeContext = {
  /** Kot je zapisano (npr. »konec marca 1945 (48 ur)«, »1. december 1876 – 1961«). */
  label: string;
  /** true samo, kadar je približnost ZAPISANA v samem viru. */
  approximate: boolean;
  /** Urejenostni ključ (ni za prikaz, ne za izpis modelu). */
  sortKey?: number;
  /** Entiteta, ki nosi ta čas (sledljivost, ni vsebina). */
  entityId?: string;
};

/** Odprto kuratorsko vprašanje ali poštena opomba, ki omejuje odgovor. */
export type AIQuestionNote = {
  id: string;
  priority: string;
  /** Besedilo vprašanja v plasti konteksta (SL ali EN). */
  text: string;
  /** Zapisi, ki jih vprašanje zadeva. */
  slugs: string[];
};

/** Pregled zbirke za vprašanja tipa COLLECTION (samo števci in naslovi). */
export type AICollectionContext = {
  exhibitCount: number;
  sourceRowCount: number;
  sourceIdentityCount: number;
  entityCounts: Record<EntityKind, number>;
  /** Naslovi poudarjenih zapisov (featured) — vstopne točke zbirke. */
  featuredTitles: string[];
  /** Obdobja kronike z številom dogodkov ( obstoječa eraOfSortKey ). */
  eras: { era: string; events: number }[];
};

/** KONTEKST — celotni muzealski svet, ki ga model v tem odgovoru vidi. */
export type AIContext = {
  lang: CuratorLang;
  /** Vsebinska plast konteksta: sl/hr dobijo slovenske, ostali angleške. */
  layer: "sl" | "en";
  queryType: CuratorQueryType;
  question: string;

  entities: AIEntityContext[];
  times: AITimeContext[];
  /** Zapis, ki se je ujemil po besedilu, a ne nosi entitete (OBJECT). */
  exhibits: AIEvidenceItem[];
  openQuestions: AIQuestionNote[];
  collection?: AICollectionContext;

  /** Zemljevid slug → razširjen podatek zapisa za PREVERBO navedkov
   *  (server-side; ne gre v prompt kot besedilo — samo za verifyAnswer). */
  readonly provided: ReadonlyMap<string, AIProvidedExhibit>;
};

/** Podatek zapisa, ki ga preverba navedkov potrebuje strežniško
 *  (v kontekst modela kot JSON gre le razumljiva oblika, ne ta tip). */
export type AIProvidedExhibit = {
  title: string;
  museumNo: string | null;
  claim: string;
  evidenceStatus: string;
  period?: string;
  sources: ReadonlyArray<{
    sourceKey: string;
    sourceName: string;
    sourceUrl: string | null;
    sourceType: string;
    license: string;
  }>;
};

/* ---------------------------------------------------------------------------
 * ODGOVOR MODELU — preverljiva oblika (kaj vemo / kako vemo / viri / opomba)
 * ------------------------------------------------------------------------- */

/** Vir, ki ga model navaja — PREVERJEN proti kontekstu (slug + vir obstajata). */
export type AICitation = {
  slug: string;
  /** Indeks vira v zapisu (exhibit.sources), če ga je model navedel. */
  sourceIndex?: number;
};

/** Surov (a preverjen) odgovor modelu po pogodbi. */
export type AIAnswer = {
  answerable: boolean;
  reason: CuratorRefusalReason | null;

  /** Kaj vemo — odstavki z oznakami [[slug]] (preverjeni navedki). */
  kajVemo: string[];
  /** Kako vemo — dokazna veriga (kateri zapisi/viri nosijo trditve). */
  kakoVemo: string[];
  /** Viri — samo preverjene {slug, sourceIndex} kombinacije. */
  viri: AICitation[];
  /** Opomba: približnost / odprto vprašanje / ni dovolj dokumentirano. */
  opomba: string | null;
};

/* ---------------------------------------------------------------------------
 * ABSTRAKCIJA PONUDNIKA — muzej se NE zaklene na enega ponudnika
 * (navodilo TASK 41: uporabi obstoječo arhitekturo — veriga OpenRouter →
 * HuggingFace → z-ai SDK iz vodnika, zdaj izpostavljena kot vmesnik)
 * ------------------------------------------------------------------------- */

export interface MuseumAIProvider {
  /** Sintetizira odgovor IZKLJUČNO iz konteksta; vrne PREVERLJIV AIAnswer. */
  answer(context: AIContext, question: string): Promise<AIAnswer>;
}

/** Ponudniška veriga za operativni vpogled (glava X-Curator-Providers). */
export type CuratorProviderTrail = string[];

/* ---------------------------------------------------------------------------
 * DTO ODGOVORA API-JU (obogaten, prikazu prirejen — ne gre nazaj v model)
 * ------------------------------------------------------------------------- */

/** Prikazni vir: zapis + vrstica vira + povezava. */
export type CuratorSourceView = {
  slug: string;
  museumNo: string | null;
  titleSi: string;
  titleEn: string;
  sourceIndex: number | null;
  sourceKey: string | null;
  sourceNameSi: string;
  sourceNameEn: string;
  sourceUrl: string | null;
};

export type CuratorEntityView = {
  id: string;
  type: EntityKind;
  labelSi: string;
  labelEn: string;
};

export type CuratorResult = {
  answerable: boolean;
  reason: CuratorRefusalReason | null;
  queryType: CuratorQueryType | null;

  /** Odstavki z [[slug]] oznakami (striženi po preverbi). */
  kajVemo: string[];
  kakoVemo: string[];
  viri: CuratorSourceView[];
  opomba: string | null;

  /** Razrešene entitete (sledljivost odgovora — prikaz v vrstici sledi). */
  entities: CuratorEntityView[];

  /** Najbližji zapisi po temi, kadar dokaza ni (pošteni predlogi). */
  suggestions: { slug: string; museumNo: string | null; titleSi: string; titleEn: string }[];

  cached: boolean;
};
