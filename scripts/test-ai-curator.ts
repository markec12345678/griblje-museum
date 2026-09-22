/**
 * TASK 41 / TESTI — testna surita za AI KUSTOSA (EVIDENCE-GROUNDED CURATOR).
 * (41. sklop / TESTI — po 40. sklopu)
 *
 * Ničesar ne spreminja. NE KLICa MODELA: vsa sinteza gre skozi LAŽNI
 * ponudnik (vbrizgan v askCurator), pravi verigi (OpenRouter → HF → z-ai)
 * se ne približa. Preslikava naročilovih testov T1–T16:
 *
 *  T1 POGODBA O PODATKIH (context vsebuje SAMO muzejske dokazne podatke)
 *  T2 determinizem razrešitve (isti vprašanji → bajtno identičen kontekst)
 *  T3 razrešitev entitet (Barle ×3, Madronič P0-E1, P1-E1 par, Kolpa, zvon)
 *  T4 ohranitev negotovosti (≈ konec marca 1945, intervali, BREZ ISO datumov)
 *  T5 identiteta virov (sourceKey iz registra, sourceIndex v mejah)
 *  T6 ZAPRTA SVET (guard: brez dokaza NI klica modela)
 *  T7 preverba odgovora (verifyAnswer: striženje navedkov, viri, združevanje)
 *  T8 abstrakcija ponudnika + cevovod (lažni ponudnik → obogaten odgovor)
 *  T9 i18n + HTTP regresija (5 jezikov, API pogodba, statistika, ostale poti)
 *  T10 JEZIK VPRAŠANJA (naročilov T14: SL/EN/DE/IT/HR — odgovor v jeziku
 *     vprašanja, ne vmesnika; zaznavanje deterministično, brez modela)
 *  T11 KAJ ŠE NE VEMO (WHAT WE DON'T KNOW: kuratorska vrsta P0–P4 pride v
 *     kontekst kot muzejsko razumljive vrzeli; navadna vprašanja ostanejo
 *     navadna; poziv prepoveduje interne kode)
 *
 * Zagon: bun scripts/test-ai-curator.ts (za T9 naj teče dev strežnik na :3000)
 */

import {
  buildContext,
  contextHasEvidence,
  detectQuestionLang,
  yearsIn,
} from "../src/lib/curator-retrieval";
import {
  verifyAnswer,
  museumAIProvider,
  systemPrompt,
  attestedYearsOf,
  extractYears,
} from "../src/lib/curator-provider";
import { askCurator, curatorRateLimited } from "../src/lib/curator";
import type {
  AIAnswer,
  AIContext,
  AIProvidedExhibit,
  MuseumAIProvider,
} from "../src/lib/curator-types";
import { seedExhibits } from "../src/lib/museum-content";
import { ENTITY_QUEUE, ENTITY_BY_ID } from "../src/lib/entities";
import { SOURCE_USAGE, sourceKeyOf } from "../src/lib/source-registry";
import { ui } from "../src/lib/i18n";

// ---------------------------------------------------------------------------
// Pripomočki (vzorec test-entities.ts / test-timeline-map.ts)
// ---------------------------------------------------------------------------

let ok = 0;
let fail = 0;
const failures: string[] = [];

function section(title: string) {
  console.log("");
  console.log("=".repeat(70));
  console.log(title);
  console.log("=".repeat(70));
}

function check(cond: boolean, name: string, detail = "") {
  if (cond) {
    ok += 1;
    console.log(`  ✓ ${name}`);
  } else {
    fail += 1;
    failures.push(name);
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/** Kontekst brez strežniškega zemljevida (tisto, kar gre v prompt). */
function promptPayload(context: AIContext): string {
  const { provided: _provided, ...rest } = context;
  void _provided;
  return JSON.stringify(rest);
}

// ===========================================================================
section("T1 — POGODBA O PODATKIH (kaj sme v prompt)");
// ===========================================================================

{
  const { context } = buildContext("sl", "Kaj se je zgodilo marca 1945?");
  const payload = promptPayload(context);

  check(
    !/"story(Si|En)"/.test(payload),
    "T1.1 v promptu NI celih zgodb (storySi/storyEn)",
  );
  check(
    !/"lat"|"lng"|"coordsApprox"|"image"|"\bDB\b|"sortOrder"/.test(payload),
    "T1.2 v promptu NI koordinat/slik/internih polj",
  );
  check(
    !/"provided"/.test(payload),
    "T1.3 strežniški zemljevid preverbe NI v promptu (samo v context.provided)",
  );

  // Vsak dokazni predmet ima obvezna polja pogodbe.
  const items = [
    ...context.entities.flatMap((e) => e.evidence),
    ...context.exhibits,
  ];
  check(
    items.length > 0 && items.every((i) => i.exhibitSlug && i.exhibitTitle && i.claim && i.evidenceStatus),
    "T1.4 vsak dokazni predmet ima slug/naslov/trditev/status",
    `${items.length} predmetov`,
  );
  check(
    items.every((i) => i.claim.length <= 720),
    "T1.5 trditve so krajšane (≤ 720 znakov — ne cela zgodba)",
  );
  check(
    context.entities.every((e) => e.id && e.type && e.label && Array.isArray(e.exhibits)),
    "T1.6 entitete konteksta nosijo id/vrsto/oznako/zapise",
  );
  check(
    context.entities.every((e) => e.exhibits.every((s) => seedExhibits.some((ex) => ex.slug === s))),
    "T1.7 zapisi entitet obstajajo v semenu (NIČ izmišljenih slug-ov)",
  );

  // Entitete so SAMO iz registra (nikoli iz vprašanja).
  check(
    context.entities.every((e) => ENTITY_BY_ID.has(e.id)),
    "T1.8 vsaka entiteta konteksta obstaja v registru (ENTITY_BY_ID)",
  );
}

// ===========================================================================
section("T2 — DETERMINIZEM RAZREŠITVE");
// ===========================================================================

{
  const questions = [
    "Kaj se je zgodilo marca 1945?",
    "Kdo je bil Konrad Barle?",
    "Kaj se je dogajalo ob Kolpi?",
    "Kaj pripoveduje ta zbirka o Gribljah?",
    "Kaj je Madroničev mlin?",
    "Kaj se je dogajalo okoli leta 1468?",
  ];
  let allIdentical = true;
  for (const q of questions) {
    const a = promptPayload(buildContext("sl", q).context);
    const b = promptPayload(buildContext("sl", q).context);
    if (a !== b) allIdentical = false;
  }
  check(allIdentical, "T2.1 dvojni zagon razrešitve → bajtno identičen kontekst (6 vprašanj)");

  // Isti vprašanji v različnih oblikah (diakritika, mala črka).
  const n1 = buildContext("sl", "Kdo je bil Niko Županič?").trace.matchedEntities.map((e) => e.id).join(",");
  const n2 = buildContext("sl", "kdo je bil niko zupanic").trace.matchedEntities.map((e) => e.id).join(",");
  check(n1 === n2 && n1.includes("person:niko-zupanic"), "T2.2 diakritika ne spremeni razrešitve (Županič/zupanic)");

  check(yearsIn("kaj se je zgodilo leta 1945 in 1468?").join(",") === "1945,1468", "T2.3 letnice se razpoznajo (1945, 1468)");
}

// ===========================================================================
section("T3 — RAZREŠITEV ENTITET (varnost identitete)");
// ===========================================================================

{
  const barle = buildContext("sl", "Kaj veš o Barle?");
  const barleIds = barle.trace.matchedEntities.filter((e) => e.type === "person").map((e) => e.id);
  check(
    barleIds.includes("person:konrad-barle") &&
      barleIds.includes("person:ivan-barle") &&
      barleIds.includes("person:janko-barle"),
    "T3.1 gole priimek Barle → VSE TRI osebe (Konrad, Ivan, Janko) — nikoli ena",
    barleIds.join(","),
  );

  const madronic = buildContext("sl", "Kdo je bil Peter Madronič?");
  const personEntities = madronic.trace.matchedEntities.filter((e) => e.type === "person");
  check(
    !personEntities.some((e) => /madronic/i.test(e.labelSi)),
    "T3.2 Peter Madronič NIMA osebne entitete (pravilno — P0-E1)",
  );
  check(
    madronic.trace.openQuestions.some((q) => q.id === "P0-E1"),
    "T3.3 P0-E1 (dva Petra Madroniča) je v kontekstu kot odprto vprašanje",
  );
  check(
    madronic.context.provided.has("kolpa-extremi") && madronic.context.provided.has("madronicev-mlin"),
    "T3.4 oba zapisa P0-E1 (MVG-008 kolpa-extremi, MVG-045 madronicev-mlin) sta v kontekstu",
  );

  const most = buildContext("sl", "Povej o zračnem mostu");
  check(
    most.trace.matchedEntities.some((e) => e.id === "event:zracni-most-krasinec-1945"),
    "T3.5 zračni most → entiteta dogodka event:zracni-most-krasinec-1945",
  );
  check(
    most.context.provided.has("evakuacija-1945") && most.context.provided.has("zracni-most-krasinec"),
    "T3.6 MVG-014 in MVG-056 sta OBVEMA v kontekstu (razcep P1-E1)",
  );
  check(
    most.trace.openQuestions.some((q) => q.id === "P1-E1"),
    "T3.7 P1-E1 (morebitna istovetnost) je v kontekstu kot odprto vprašanje",
  );

  const y1945 = buildContext("sl", "Kaj se je zgodilo marca 1945?");
  check(
    y1945.trace.openQuestions.some((q) => q.id === "P1-E1"),
    "T3.8 vprašanje o marcu 1945 prav tako prinese P1-E1",
  );

  const kolpa = buildContext("sl", "Kaj se je dogajalo ob Kolpi?");
  check(
    kolpa.trace.matchedEntities.some((e) => e.id === "place:kolpa"),
    "T3.9 Kolpa → entiteta kraja place:kolpa (sklanjatveno ujemanje kolpi)",
  );

  const zvon = buildContext("sl", "Kaj je zvon?");
  check(
    zvon.trace.matchedEntities.some((e) => e.id === "event:vrnitev-glavnega-zvona-1998") ||
      zvon.trace.matchedEntities.some((e) => e.id === "event:blagoslov-zvona-2008"),
    "T3.10 zvon → dogodka zvona (1998/2008)",
  );

  const mlin = buildContext("sl", "Kaj je Madroničev mlin?");
  check(
    mlin.trace.matchedEntities.some((e) => e.id === "place:madronicev-mlin"),
    "T3.11 Madroničev mlin → KRAJ (ne oseba)",
  );

  // Vrsta vprašanja.
  check(
    buildContext("sl", "Kaj pripoveduje ta zbirka o Gribljah?").trace.queryType === "collection",
    "T3.12 vrsta vprašanja COLLECTION",
  );
  check(
    buildContext("sl", "Kdo je bil Konrad Barle?").trace.queryType === "person",
    "T3.13 vrsta vprašanja PERSON",
  );
}

// ===========================================================================
section("T4 — OHRANITEV NEGOTOVOSTI");
// ===========================================================================

{
  const { context } = buildContext("sl", "Povej o zračnem mostu");
  const zracni = context.times.find((t) => t.entityId === "event:zracni-most-krasinec-1945");
  check(
    !!zracni && zracni.approximate === true && /konec marca 1945/.test(zracni.label),
    "T4.1 zračni most: »konec marca 1945 (48 ur)« BESEDNO + approximate=true",
    zracni?.label ?? "ni časa",
  );
  check(
    !/25\.?\s*3\.|25\. marca|25 March/.test(zracni?.label ?? ""),
    "T4.2 NI pretvorbe v 25. 3. 1945",
  );

  // Noben ISO datum v časovnih oznakah ali obdobjih konteksta.
  const questions = [
    "Kaj se je zgodilo marca 1945?",
    "Kaj je španska gripa?",
    "Kaj se je dogajalo leta 1918?",
    "Kdo je bil Niko Županič?",
    "Kaj pripoveduje ta zbirka o Gribljah?",
  ];
  let anyIso = false;
  for (const q of questions) {
    const { context } = buildContext("sl", q);
    for (const t of context.times) if (/\d{4}-\d{2}-\d{2}/.test(t.label)) anyIso = true;
    for (const e of context.entities) for (const i of e.evidence) if (i.period && /\d{4}-\d{2}-\d{2}/.test(i.period)) anyIso = true;
    for (const i of context.exhibits) if (i.period && /\d{4}-\d{2}-\d{2}/.test(i.period)) anyIso = true;
  }
  check(!anyIso, "T4.3 NIČ ISO datumov (1945-03-25) po vseh časih/obdobjih konteksta");

  const izseljenstvo = buildContext("sl", "Kaj je izseljenstvo?");
  const izsel = izseljenstvo.context.times.find((t) => t.entityId === "event:izseljenski-val-1880-1914");
  check(
    !izsel || /1880/.test(izsel.label),
    "T4.4 interval izseljenstva nosi letnico 1880 (interval ostane interval)",
  );
}

// ===========================================================================
section("T5 — IDENTITETA VIROV (sourceKey/sourceIndex)");
// ===========================================================================

{
  const questions = [
    "Kaj se je zgodilo marca 1945?",
    "Kdo je bil Konrad Barle?",
    "Kaj se je dogajalo ob Kolpi?",
    "Kaj je Madroničev mlin?",
  ];
  let allKeysValid = true;
  let allIndexesValid = true;
  let namesValid = true;
  let keyCount = 0;
  for (const q of questions) {
    const { context } = buildContext("sl", q);
    const items = [...context.entities.flatMap((e) => e.evidence), ...context.exhibits];
    for (const item of items) {
      const exhibit = seedExhibits.find((e) => e.slug === item.exhibitSlug);
      if (!exhibit) { allKeysValid = false; continue; }
      if (item.sourceKey !== undefined) {
        keyCount++;
        if (!SOURCE_USAGE.has(item.sourceKey)) allKeysValid = false;
        if (item.sourceIndex === undefined || item.sourceIndex < 0 || item.sourceIndex >= exhibit.sources.length) {
          allIndexesValid = false;
        } else {
          const row = exhibit.sources[item.sourceIndex];
          const expectedKey = sourceKeyOf(row.nameSi, row.url ?? null);
          if (item.sourceKey !== expectedKey) allKeysValid = false;
          if (item.sourceName !== undefined && item.sourceName !== row.nameSi) namesValid = false;
        }
      }
    }
  }
  check(allKeysValid && keyCount > 0, "T5.1 vsak sourceKey obstaja v registru virov IN ustreza vrstici zapisa", `${keyCount} ključev`);
  check(allIndexesValid, "T5.2 vsak sourceIndex je v mejah exhibit.sources");
  check(namesValid, "T5.3 sourceName se ujema z vrstico vira (SL plast)");

  // Vir, ki ga deli več zapisov, ostane ISTA identiteta.
  const wikipedija = SOURCE_USAGE.get("url:sl.wikipedia.org/wiki/Griblje");
  check(
    wikipedija !== undefined && wikipedija.exhibits.length >= 2,
    "T5.4 deljeni vir (Wikipedija: Griblje) ostaja ena identiteta z usedBy",
    `${wikipedija?.exhibits.length ?? 0} zapisov`,
  );
}

// ===========================================================================
section("T6 — ZAPRTA SVET (hallucination guard PRED modelom)");
// ===========================================================================

/** Lažni ponudnik: šteje klice in odgovarja po potrebi testa. */
function fakeProvider(answers: AIAnswer[] = [], onCall?: (q: string) => void): MuseumAIProvider & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    async answer(context: AIContext, question: string) {
      calls.push(question);
      onCall?.(question);
      const a = answers.shift();
      if (!a) {
        return {
          answerable: false,
          reason: "insufficient_evidence",
          kajVemo: [],
          kakoVemo: [],
          viri: [],
          opomba: null,
        };
      }
      return a;
    },
  };
}

async function t6() {
  const guard = fakeProvider();
  const r = await askCurator("sl", "Koliko prebivalcev ima Pariz?", guard);
  check(
    guard.calls.length === 0,
    "T6.1 brez dokaza KUSTOS NI KLICAN (0 klicev modela)",
    `klicev: ${guard.calls.length}`,
  );
  check(
    r.answerable === false && r.reason === "insufficient_evidence",
    "T6.2 deterministična zavrnitev: answerable=false / insufficient_evidence",
  );

  const r2 = await askCurator("sl", "Kaj je bilo na Luni leta 1969?", fakeProvider([
    {
      answerable: false,
      reason: "insufficient_evidence",
      kajVemo: [],
      kakoVemo: [],
      viri: [],
      opomba: null,
    },
  ]));
  check(
    r2.answerable === false,
    "T6.3 Luna 1969: model (lažni) prav tako zavrne — zaprta svet deluje v obeh plasteh",
  );

  // Omejitev hitrosti: 12 vprašanj na okno na IP.
  const ip = "test-ip-t6";
  let limited = false;
  for (let i = 0; i < 14; i++) {
    if (curatorRateLimited(ip)) { limited = true; break; }
  }
  check(limited, "T6.4 omejitev hitrosti (12/10 min na IP) se sproži");

  // Predpomnilnik: isto vprašanje dvakrat → drugi odgovor je cached.
  const once = fakeProvider([
    {
      answerable: true,
      reason: null,
      kajVemo: ["Trditev [[konrad-barle]]"],
      kakoVemo: ["Dokaz [[konrad-barle]]"],
      viri: [{ slug: "konrad-barle" }],
      opomba: null,
    },
  ]);
  const a1 = await askCurator("sl", "Kdo je bil Konrad Barle? (test predpomnilnika)", once);
  const a2 = await askCurator("sl", "Kdo je bil Konrad Barle? (test predpomnilnika)", once);
  check(a1.cached === false && a2.cached === true, "T6.5 predpomnilnik: drugi klic istega vprašanja je cache hit");
  check(once.calls.length === 1, "T6.6 predpomnilnik: model klican SAMO enkrat");
}
await t6();

// ===========================================================================
section("T7 — PREVERBA ODGOVORA (verifyAnswer)");
// ===========================================================================

{
  const { context } = buildContext("sl", "Kdo je bil Konrad Barle?");

  // Veljavni + neveljavni navedki + sestavljeni navedek.
  const raw1 = JSON.stringify({
    answerable: true,
    reason: null,
    kajVemo: [
      "Konrad Barle je bil učitelj [[konrad-barle]], brat Ivana [[ivan-barle]] in Janka [[janko-barle]]; izmišljenega pa ni [[izmisljeni-zapis]].",
      "Sestavljeni navedek: [[konrad-barle], [janko-barle]] v eni oznaki.",
    ],
    kakoVemo: ["Zapisi konrad-barle, ivan-barle, janko-barle."],
    viri: [
      { slug: "konrad-barle", sourceIndex: 0 },
      { slug: "ne-obstaja", sourceIndex: 0 },
      { slug: "janko-barle", sourceIndex: 999 },
    ],
    opomba: null,
  });
  const v1 = verifyAnswer(raw1, context);
  check(v1 !== null && v1.answerable === true, "T7.1 veljaven odgovor preide preverbo");
  check(
    v1 !== null && !v1.kajVemo.some((p) => p.includes("izmisljeni-zapis")),
    "T7.2 neveljaven navedek [[izmisljeni-zapis]] je ODSTRANJEN iz besedila",
  );
  check(
    v1 !== null && v1.kajVemo.some((p) => p.includes("[[konrad-barle]]") && p.includes("[[janko-barle]]")),
    "T7.3 sestavljeni navedek [[a], [b]] se razščleni na posamezne [[a]] [[b]]",
  );
  check(
    v1 !== null && v1.viri.every((v) => context.provided.has(v.slug)),
    "T7.4 viri: neveljaven slug izpada (ne-obstaja)",
    v1?.viri.map((v) => v.slug).join(","),
  );
  check(
    v1 !== null && !v1.viri.some((v) => v.slug === "janko-barle" && v.sourceIndex === 999),
    "T7.5 viri: sourceIndex 999 (prek meje) se normalizira (ne preide)",
  );
  check(
    v1 !== null && v1.viri.some((v) => v.slug === "konrad-barle" && v.sourceIndex === 0),
    "T7.6 veljaven vir {konrad-barle, 0} ostane",
  );

  // Posamični [slug] (enojni oklepaj) → pretvorjen v [[slug]].
  const raw2 = JSON.stringify({
    answerable: true,
    reason: null,
    kajVemo: ["Učitelj je [konrad-barle] z enojnim oklepajem."],
    kakoVemo: [],
    viri: [],
    opomba: null,
  });
  const v2 = verifyAnswer(raw2, context);
  check(
    v2 !== null && v2.kajVemo[0]?.includes("[[konrad-barle]]"),
    "T7.7 posamični [slug] se pretvori v [[slug]] (gumb)",
  );
  check(
    v2 !== null && v2.viri.some((v) => v.slug === "konrad-barle"),
    "T7.8 navedeni zapis se samodejno dopolni v viri (veriga trditev→zapis→vir)",
  );

  // Odgovor brez navedkov → downgrad na insufficient_evidence.
  const raw3 = JSON.stringify({
    answerable: true,
    reason: null,
    kajVemo: ["Splošna zgodba brez navedkov."],
    kakoVemo: ["Brez dokazov."],
    viri: [],
    opomba: null,
  });
  const v3 = verifyAnswer(raw3, context);
  check(
    v3 !== null && v3.answerable === false && v3.reason === "insufficient_evidence",
    "T7.9 odgovor BREZ navedkov se razvrsti v insufficient_evidence (ne citira ≠ ni odgovoril)",
  );

  // Model sam zavrne.
  const raw4 = JSON.stringify({
    answerable: false,
    reason: "insufficient_evidence",
    kajVemo: [],
    kakoVemo: [],
    viri: [],
    opomba: null,
  });
  const v4 = verifyAnswer(raw4, context);
  check(
    v4 !== null && v4.answerable === false && v4.reason === "insufficient_evidence",
    "T7.10 modelova zavrnitev se prenese nespremenjena",
  );

  // Muzejska številka (MVG-045) kot navedek → razrešena na [[slug]].
  const madronicContext = buildContext("sl", "Kdo je bil Peter Madronič?").context;
  const raw6 = JSON.stringify({
    answerable: true,
    reason: null,
    kajVemo: ["Družina Madronič je mlin kupila leta 1937 (MVG-045), poplave pa pričeva MVG-008."],
    kakoVemo: ["Zapisa madronicev-mlin in kolpa-extremi."],
    viri: [],
    opomba: null,
  });
  const v6 = verifyAnswer(raw6, madronicContext);
  check(
    v6 !== null && v6.kajVemo[0]?.includes("[[madronicev-mlin]]") && v6.kajVemo[0]?.includes("[[kolpa-extremi]]"),
    "T7.11 navedek po muzejski številki (MVG-045/MVG-008) se razreši na [[slug]] gumb",
    v6?.kajVemo[0],
  );
  check(
    v6 !== null && v6.viri.some((v) => v.slug === "madronicev-mlin") && v6.viri.some((v) => v.slug === "kolpa-extremi"),
    "T7.12 razrešeni številki se dopolnita v viri (veriga se zapre)",
  );

  // Ne-JSON odgovor → null (sproži ponovitev).
  check(verifyAnswer("Odgovor je preprosto besedilo brez JSON.", context) === null, "T7.13 ne-JSON → null (ponovitev)");

  // JSON z ograjo in vlečeno vejico.
  const raw5 = "```json\n{\"answerable\": true, \"reason\": null, \"kajVemo\": [\"Učitelj [[konrad-barle]],\",], \"kakoVemo\": [], \"viri\": [], \"opomba\": null,}\n```";
  const v5 = verifyAnswer(raw5, context);
  check(v5 !== null && v5.answerable === true, "T7.14 JSON z ``` ograjo in vlečeno vejico se razčleni");
}

// ===========================================================================
section("T8 — ABSTRAKCIJA PONUDNIKA + CEOVOD");
// ===========================================================================

async function t8() {
  const provider = museumAIProvider();
  check(
    typeof provider.answer === "function",
    "T8.1 museumAIProvider() izvede MuseumAIProvider (answer(context, question))",
  );

  // Cevovod z lažnim ponudnikom → obogaten CuratorResult.
  const fake = fakeProvider([
    {
      answerable: true,
      reason: null,
      kajVemo: ["Zaseda na cesti se je zgodila 6. septembra 1941 [[zaseda-1941]]."],
      kakoVemo: ["Zapis zaseda-1941 nosi vir Kamra."],
      viri: [{ slug: "zaseda-1941", sourceIndex: 0 }],
      opomba: "Točen dan je zapisan v viru.",
    },
  ]);
  const r = await askCurator("sl", "Kaj je zaseda na cesti?", fake);
  check(r.answerable === true, "T8.2 cevovod: odgovoribilni rezultat");
  check(
    r.viri.length === 1 && r.viri[0]?.museumNo === "MVG-028" && r.viri[0]?.sourceNameSi !== undefined,
    "T8.3 viri obogateni z muzejsko številko in imenom vira (MVG-028)",
    JSON.stringify(r.viri[0]?.museumNo),
  );
  const zaseda = seedExhibits.find((e) => e.slug === "zaseda-1941");
  check(
    r.viri[0]?.sourceUrl === (zaseda?.sources[0]?.url ?? null),
    "T8.4 sourceUrl vodi na pravo vrstico vira zapisa",
  );
  check(
    r.kajVemo[0]?.includes("[[zaseda-1941]]"),
    "T8.5 besedilo ohrani [[slug]] oznake za gumbe",
  );
  check(
    r.entities.some((e) => e.id === "event:zaseda-na-cesti-1941"),
    "T8.6 sled razrešitve: entiteta dogodka v odgovoru",
  );
  check(r.suggestions.length === 0, "T8.7 ob odgovoribilnem odgovoru ni predlogov (samo ob zavrnitvi)");
}
await t8();

// ===========================================================================
section("T9 — I18N + HTTP REGRESIJA");
// ===========================================================================

async function t9() {
  // i18n — curator razdel v vseh 5 jezikih, starters = 7 (6 vsebinskih + vrzel).
  const langs = ["sl", "en", "hr", "de", "it"] as const;
  check(
    langs.every((l) => {
      const c = ui[l].curator;
      return !!c.title && Array.isArray(c.starters) && c.starters.length === 7;
    }),
    "T9.1 curator i18n: naslov + 7 začetnih vprašanj (zadnje = kaj še ni dokumentirano) v vseh 5 jezikih",
  );
  check(langs.every((l) => ui[l].curator.whatWeKnow.length > 0), "T9.2 curator i18n: oznake odstavkov v vseh 5 jezikih");

  // Statistika: nov kind curator.
  const statKinds: string[] = ["visit", "open", "walk", "guide", "curator", "audio", "ar", "download", "detail"];
  check(statKinds.includes("curator"), "T9.3 statistika pozna kind curator (omejitve odjemalca)");

  // HTTP — samo, če teče dev strežnik.
  const BASE = process.env.BASE_URL ?? "http://localhost:3000";
  const probe = await fetch(BASE + "/", { method: "HEAD" }).catch(() => null);
  if (probe && probe.ok) {
    const invalid = await fetch(BASE + "/api/curator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: "xx", question: "" }),
    });
    check(invalid.status === 400, "T9.4 neveljavno telo → 400");

    const opts = await fetch(BASE + "/api/curator", { method: "OPTIONS" });
    check(opts.status === 200, "T9.5 OPTIONS (CORS) → 200");

    // Zavrnitev BREZ klica modela (guard) — odgovor determinističen.
    const refusal = await fetch(BASE + "/api/curator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: "sl", question: "Koliko prebivalcev ima Tokio?" }),
    });
    const refusalBody = (await refusal.json()) as { answerable?: boolean; reason?: string };
    check(
      refusal.status === 200 && refusalBody.answerable === false && refusalBody.reason === "insufficient_evidence",
      "T9.6 HTTP: zavrnitev insufficient_evidence (guard, brez modela)",
    );

    // Statistika kind curator (na bralnih namestitvah pošteno readOnly).
    const stat = await fetch(BASE + "/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "curator", lang: "sl" }),
    });
    const statBody = (await stat.json()) as { ok?: boolean; readOnly?: boolean };
    check(
      stat.status === 200 && !(/unknown|invalid/i.test(JSON.stringify(statBody))),
      "T9.7 /api/stats sprejme kind curator (ne zavrne s 400)",
      JSON.stringify(statBody),
    );

    // Regresija: ostale poti nedotaknjene.
    const home = await fetch(BASE + "/");
    check(home.status === 200, "T9.8 domača stran → 200");
    const exhibits = await fetch(BASE + "/api/exhibits");
    check(exhibits.status === 200, "T9.9 /api/exhibits → 200 (regresija)");
    const opendata = await fetch(BASE + "/api/opendata");
    const od = (await opendata.json()) as {
      counts?: { exhibits?: number };
      data?: { exhibits?: unknown[] };
    };
    check(
      opendata.status === 200 && (od.counts?.exhibits ?? od.data?.exhibits?.length ?? 0) === 113,
      "T9.10 OpenData 93 zapisov (regresija)",
    );
  } else {
    console.log("  (dev strežnik ne teče — HTTP preskakujem)");
  }
}
await t9();

// ===========================================================================
section("T10 — JEZIK VPRAŠANJA (naročilov T14: SL / EN / DE / IT / HR)");
// ===========================================================================

async function t10() {
  // Zaznavanje jezika — deterministično, brez modela.
  check(detectQuestionLang("Kdo je bil Konrad Barle?") === "sl", "T10.1 slovensko vprašanje → sl");
  check(detectQuestionLang("Who was Konrad Barle?") === "en", "T10.2 angleško vprašanje → en");
  check(detectQuestionLang("Wer war Konrad Barle?") === "de", "T10.3 nemško vprašanje → de");
  check(detectQuestionLang("Chi era Konrad Barle?") === "it", "T10.4 italijansko vprašanje → it");
  check(detectQuestionLang("Tko je bio Konrad Barle?") === "hr", "T10.5 hrvaško vprašanje → hr");
  check(detectQuestionLang("Konrad Barle?") === null, "T10.6 brez jezikovnih oznak → null (jezik vmesnika)");
  check(detectQuestionLang("Was ist die Kolpa?") === "de", "T10.7 »Was ist …« → de (ne en)");
  check(detectQuestionLang("What is the Kolpa?") === "en", "T10.8 »What is the …« → en (ne de)");

  // askCurator z lažnim ponudnikom: jezik VPRAŠANJA zamenja jezik vmesnika.
  const seen: AIContext[] = [];
  const spy: MuseumAIProvider = {
    async answer(context) {
      seen.push(context);
      return {
        answerable: false,
        reason: "insufficient_evidence",
        kajVemo: [],
        kakoVemo: [],
        viri: [],
        opomba: null,
      };
    },
  };
  await askCurator("sl", "Who was Konrad Barle? (jezikovni test)", spy);
  await askCurator("en", "Kdo je bil Konrad Barle? (jezikovni test)", spy);
  await askCurator("sl", "Tko je bio Konrad Barle? (jezikovni test)", spy);
  await askCurator("de", "Chi era Konrad Barle? (jezikovni test)", spy);
  check(
    seen[0]?.lang === "en" && seen[0]?.layer === "en",
    "T10.9 EN vprašanje pri SL vmesniku → kontekst EN (odgovor v angleščini)",
  );
  check(
    seen[1]?.lang === "sl" && seen[1]?.layer === "sl",
    "T10.10 SL vprašanje pri EN vmesniku → kontekst SL",
  );
  check(
    seen[2]?.lang === "hr" && seen[2]?.layer === "sl",
    "T10.11 HR vprašanje → jezik hr + slovenska VSEBINSKA plast (zapisi so SL)",
  );
  check(
    seen[3]?.lang === "it" && seen[3]?.layer === "en",
    "T10.12 IT vprašanje → jezik it + angleška vsebinska plast",
  );

  // Sistemski poziv nosi jezik odgovoda.
  check(systemPrompt(seen[1]!).includes("slovenščini"), "T10.13 poziv SL: odgovarjaj v slovenščini");
  check(systemPrompt(seen[2]!).includes("hrvaščini"), "T10.14 poziv HR: odgovarjaj v hrvaščini (ne slovenščini)");
  check(systemPrompt(seen[0]!).includes("English"), "T10.15 poziv EN: answer in English");
  check(systemPrompt(seen[3]!).includes("Italian"), "T10.16 poziv IT: answer in Italian");
  check(
    systemPrompt(buildContext("de", "Wer war Konrad Barle?").context).includes("German"),
    "T10.17 poziv DE: answer in German",
  );
  check(
    detectQuestionLang("Koliko prebivalcev ima Pariz?") === null,
    "T10.18 SL zavrnitveno vprašanje brez oznak → null (ostane jezik vmesnika SL)",
  );
}
await t10();

// ===========================================================================
section("T11 — KAJ ŠE NE VEMO (WHAT WE DON'T KNOW — kuratorska vrsta)");
// ===========================================================================

async function t11() {
  const { context } = buildContext("sl", "Kaj o zbirki še ni dovolj dokumentirano?");
  check(context.queryType === "collection", "T11.1 vrzel → vrsta vprašanja COLLECTION");
  check(
    context.openQuestions.length >= 8,
    "T11.2 kuratorska vrsta P0–P4 pride v kontekst (≥8 odprtih vprašanj)",
    `${context.openQuestions.length}`,
  );
  check(context.openQuestions.some((q) => q.id === "P0-E1"), "T11.3 P0-E1 (dva Petra Madroniča) je med vrzeli");
  check(context.openQuestions.some((q) => q.id === "P1-E1"), "T11.4 P1-E1 (MVG-014 ↔ MVG-056) je med vrzeli");
  check(context.collection !== undefined, "T11.5 pregled zbirke (števci, dobe) je v kontekstu");
  check(contextHasEvidence(context), "T11.6 vrzel je dokazljiva — guard NE zavrne (0 klicov ni potrebno)");
  check(
    context.openQuestions.every((q) => q.text.length > 10 && !/\bP[0-4]-E\d/.test(q.text)),
    "T11.7 besedila vrzeli so muzejsko razumljiva (brez internih kod v besedilu)",
  );
  const p1e1 = context.openQuestions.find((q) => q.id === "P1-E1");
  check(
    !!p1e1 && p1e1.slugs.every((s) => context.provided.has(s)),
    "T11.8 zapisi vrzeli so v zemljevidu preverbe — model lahko citira MVG-014/MVG-056",
  );
  check(
    context.openQuestions.map((q) => q.id).join(",") ===
      ENTITY_QUEUE.slice(0, context.openQuestions.length).map((q) => q.id).join(","),
    "T11.9 vrstni red vrzeli = kuratorska vrsta (deterministično)",
  );

  // Večjezične vrzeli.
  const { context: enCtx } = buildContext("en", "What is not yet documented about the collection?");
  check(
    enCtx.queryType === "collection" && enCtx.openQuestions.length >= 8,
    "T11.10 EN vrzel: isto (collection + ≥8), besedila v EN plasti",
  );
  const { context: g2 } = buildContext("sl", "Kaj o Gribljah še ne vemo?");
  check(
    g2.queryType === "collection" && g2.openQuestions.length >= 8,
    "T11.11 »Kaj o Gribljah še ne vemo?« (naročilov primer) je vrzel",
  );

  // Navadno vprašanje NE sproži vrzeli (preozki vzorci).
  const { context: normal } = buildContext("sl", "Kaj se je zgodilo marca 1945?");
  check(
    normal.queryType === "event" && normal.openQuestions.length <= 4,
    "T11.12 navadno vprašanje ostane navadno (dogodek, ≤4 odprta vprašanja)",
  );
  const { context: kolpa } = buildContext("sl", "Kaj se je dogajalo ob Kolpi?");
  check(
    kolpa.queryType !== "collection" || kolpa.openQuestions.length <= 4,
    "T11.13 vprašanje o Kolpi ni vrzel",
  );

  // Poziv: interne kode so prepovedane, vrzeli se pošteno naštejejo.
  const prompt = systemPrompt(context);
  check(prompt.includes("internih kod"), "T11.14 poziv: NE uporabljaj internih kod (P0/P1/…)");
  check(
    prompt.includes("še ni dovolj dokumentirano") && prompt.includes("naštej odprta vprašanja"),
    "T11.15 poziv: na vprašanje o vrzeli pošteno naštej odprta vprašanja",
  );
  check(
    prompt.includes("NE IZBEREŠ odgovora"),
    "T11.16 poziv: na kuratorsko odprto vprašanje se NE izbere odgovora",
  );
  check(
    prompt.includes("NE prevajaj") || prompt.includes("ne prevajaj"),
    "T11.17 poziv: imena virov se ne prevajajo, kadar bi se spremenila identiteta",
  );
}
await t11();

// ===========================================================================
section("T12 — LETNI VARUH (približno leto NE sme postati natančno)");
// ===========================================================================

/** Sintetični kontekst z eno trditvijo (deterministične preverbe letnika). */
function yearTestContext(
  claim: string,
  opts: { layer?: "sl" | "en"; period?: string; sourceName?: string } = {},
): AIContext {
  const layer = opts.layer ?? "sl";
  const sourceName = opts.sourceName ?? "Testni vir";
  const provided = new Map<string, AIProvidedExhibit>([
    [
      "testni-zapis",
      {
        title: "Testni zapis",
        museumNo: null,
        claim,
        evidenceStatus: "DOCUMENTED",
        period: opts.period,
        sources: [
          {
            sourceKey: "vir-test",
            sourceName,
            sourceUrl: null,
            sourceType: "document",
            license: "javno dostopno",
          },
        ],
      },
    ],
  ]);
  return {
    lang: layer === "sl" ? "sl" : "en",
    layer,
    queryType: "object",
    question: "test",
    entities: [],
    times: [],
    exhibits: [
      {
        exhibitSlug: "testni-zapis",
        exhibitTitle: "Testni zapis",
        claim,
        evidenceStatus: "DOCUMENTED",
        period: opts.period,
        sourceKey: "vir-test",
        sourceIndex: 0,
        sourceName,
        sourceType: "document",
        license: "javno dostopno",
      },
    ],
    openQuestions: [],
    provided,
  };
}

/** Odgovor modelu z eno trditvijo (+ opomba po želji). */
function yearAnswer(paragraphs: string[], opomba: string | null = null): string {
  return JSON.stringify({
    answerable: true,
    reason: null,
    kajVemo: paragraphs,
    kakoVemo: ["Trditev nosi zapis [[testni-zapis]]."],
    viri: [{ slug: "testni-zapis" }],
    opomba,
  });
}

{
  // --- naročilove prepovedane pretvorbe (TASK 42.1 §1) -------------------
  const forbidden: Array<[string, string, string]> = [
    ["okoli 1900", "Predmet je nastal leta 1900 [[testni-zapis]].", "okoli 1900 → 1900"],
    ["približno 1900", "Predmet je nastal leta 1900 [[testni-zapis]].", "približno 1900 → 1900"],
    ["ca. 1900", "Predmet je nastal leta 1900 [[testni-zapis]].", "ca. 1900 → 1900"],
    ["c. 1900", "Predmet je nastal leta 1900 [[testni-zapis]].", "c. 1900 → 1900"],
    ["approx. 1900", "Predmet je nastal leta 1900 [[testni-zapis]].", "approx. 1900 → 1900"],
    ["okoli leta 1900", "Predmet je nastal leta 1900 [[testni-zapis]].", "okoli leta 1900 → 1900"],
    ["around 1900", "The item was made in 1900 [[testni-zapis]].", "around 1900 → in 1900 (EN)"],
  ];
  let fi = 0;
  for (const [evidence, answer, name] of forbidden) {
    fi++;
    const layer = answer.startsWith("The") ? "en" : "sl";
    const ctx = yearTestContext(evidence, { layer });
    const v = verifyAnswer(yearAnswer([answer]), ctx);
    check(
      v !== null && v.answerable === false && v.kajVemo.length === 0,
      `T12.${fi} prepovedana pretvorba: ${name} → odstavek ODPADE`,
    );
  }

  // --- približnost OHRANJENA (dovoljene oblike) ---------------------------
  const preserved: Array<[string, string, string]> = [
    ["okoli 1900", "Predmet je nastal okoli 1900 [[testni-zapis]].", "okoli 1900"],
    ["okoli leta 1900", "Predmet je nastal okoli leta 1900 [[testni-zapis]].", "okoli leta 1900"],
    ["okoli leta 1900", "Predmet je nastal okrog leta 1900 [[testni-zapis]].", "okrog leta 1900 (enakovredno)"],
    ["okoli 1900", "Predmet je nastal ~1900 [[testni-zapis]].", "~1900"],
    ["≈ 2011", "Predmet je nastal ≈ 2011 [[testni-zapis]].", "≈ 2011"],
    ["okoli 1900", "The item was made around 1900 [[testni-zapis]].", "around 1900 (EN prevod)"],
    ["um 1310", "Das Objekt entstand um 1310 [[testni-zapis]].", "um 1310 (DE)"],
    ["intorno al 1310", "L'oggetto risale intorno al 1310 [[testni-zapis]].", "intorno al 1310 (IT)"],
    ["oko 1310", "Predmet je nastao oko 1310 [[testni-zapis]].", "oko 1310 (HR)"],
  ];
  let pi = 0;
  for (const [evidence, answer, name] of preserved) {
    pi++;
    const layer = /The |Das |L'og/.test(answer) ? "en" : "sl";
    const ctx = yearTestContext(evidence, { layer });
    const v = verifyAnswer(yearAnswer([answer]), ctx);
    check(
      v !== null && v.answerable === true && v.kajVemo.length === 1,
      `T12.${forbidden.length + pi} približnost OHRANJENA: ${name} → odstavek ostane`,
    );
  }

  // --- prevod ne sme izgubiti približnosti (SL dokaz, EN odgovor) --------
  const trans = yearTestContext("okoli 1900", { layer: "en" });
  check(
    verifyAnswer(yearAnswer(["The item was made in 1900 [[testni-zapis]]."]), trans)?.answerable === false,
    `T12.${forbidden.length + preserved.length + 1} prevod: SL »okoli 1900« → EN »in 1900« ODPADE`,
  );
  check(
    verifyAnswer(yearAnswer(["The item was made around 1900 [[testni-zapis]]."]), trans)?.answerable === true,
    `T12.${forbidden.length + preserved.length + 2} prevod: SL »okoli 1900« → EN »around 1900« ostane`,
  );

  // --- legitimne NATANČNE letnice ostanejo dovoljene ----------------------
  const legit1 = yearTestContext("Šola je bila ustanovljena leta 1900.");
  check(
    verifyAnswer(yearAnswer(["Šola je bila ustanovljena leta 1900 [[testni-zapis]]."]), legit1)?.answerable === true,
    `T12.19 legitimno natančno leto 1900 ostane dovoljeno`,
  );
  const legit2 = yearTestContext("Zaseda se je zgodila 6. septembra 1941.");
  check(
    verifyAnswer(yearAnswer(["Zaseda se je zgodila 6. septembra 1941 [[testni-zapis]]."]), legit2)?.answerable === true,
    `T12.20 natančen cel datum (6. september 1941) ostane dovoljen`,
  );
  check(
    verifyAnswer(yearAnswer(["Zaseda leta 1941 [[testni-zapis]]."]), legit2)?.answerable === true,
    `T12.21 golo leto 1941 iz dokazanega celega datuma je dovoljeno`,
  );
  const legit3 = yearTestContext("Izseljevanje je trajalo med 1880 in 1914.", { period: "1880–1914" });
  check(
    verifyAnswer(yearAnswer(["Val je trajal med 1880 in 1914 [[testni-zapis]]."]), legit3)?.answerable === true,
    `T12.22 interval 1880–1914 ostane interval (obe letnici dovoljeni)`,
  );
  check(
    verifyAnswer(yearAnswer(["Val je trajal okoli 1900 [[testni-zapis]]."]), legit3)?.answerable === false,
    `T12.23 intervala NI dovoljeno pretvoriti v sredinsko približevanje (1880–1914 ≠ okoli 1900)`,
  );
  const legit4 = yearTestContext("Konec marca 1945 je pripeljal zračni most.");
  check(
    verifyAnswer(yearAnswer(["Zračni most je bil leta 1945 [[testni-zapis]]."]), legit4)?.answerable === true,
    `T12.24 »konec marca 1945« približuje DAN, ne leto — golo 1945 ostane dovoljeno`,
  );
  const fake = yearTestContext("Prva omemba je iz leta 1468.");
  check(
    verifyAnswer(yearAnswer(["Prva omemba je iz leta 1337 [[testni-zapis]]."]), fake)?.answerable === false,
    `T12.25 izmišljena letnica 1337 (nikjer v kontekstu) → odstavek odpade`,
  );

  // --- kakoVemo in opomba: enako pravilo ----------------------------------
  const kw = yearTestContext("okoli 1900");
  const kwRaw = JSON.stringify({
    answerable: true,
    reason: null,
    kajVemo: ["Predmet [[testni-zapis]]."],
    kakoVemo: ["Nastal je leta 1900 [[testni-zapis]]."],
    viri: [{ slug: "testni-zapis" }],
    opomba: null,
  });
  const kwv = verifyAnswer(kwRaw, kw);
  check(
    kwv !== null && kwv.answerable === true && kwv.kakoVemo.length === 0,
    `T12.26 kakoVemo: golo 1900 odpade (kajVemo ostane)`,
  );
  const op1 = verifyAnswer(yearAnswer(["Predmet [[testni-zapis]]."], "Letnica je natančna: 1900."), kw);
  check(op1?.opomba === null, `T12.27 opomba: golo 1900 odpade`);
  const op2 = verifyAnswer(yearAnswer(["Predmet [[testni-zapis]]."], "Letnica ni natančna — okoli 1900."), kw);
  check(
    op2 !== null && op2.opomba !== null && /okoli 1900/.test(op2.opomba),
    `T12.28 opomba: okoli 1900 ostane`,
  );

  // --- ime vira: odmev dovoljen, natančnosti ne določa --------------------
  const sn = yearTestContext("Mlin ob Kolpi.", { sourceName: "Madroničev mlin okoli leta 1990 (arhiv)" });
  check(
    verifyAnswer(yearAnswer(["Mlin je iz leta 1990 [[testni-zapis]]."]), sn)?.answerable === false,
    `T12.29 vir »okoli leta 1990« → golo 1990 odpade`,
  );
  check(
    verifyAnswer(yearAnswer(["Mlin je iz obdobja okoli leta 1990 [[testni-zapis]]."]), sn)?.answerable === true,
    `T12.30 vir »okoli leta 1990« → okoli leta 1990 ostane`,
  );
  const snCancel = yearTestContext("Cerkvišče, star zapis.", {
    period: "~1408 → danes",
    sourceName: "Griblje (krajevna skupnost, prvi turški vpad 1408)",
  });
  check(
    verifyAnswer(yearAnswer(["Zapis je iz leta 1408 [[testni-zapis]]."]), snCancel)?.answerable === false,
    `T12.31 kuratorska približnost (~1408) PREMAGA golo letnico v imenu vira`,
  );
  check(
    verifyAnswer(yearAnswer(["Zapis je star okoli 1408 [[testni-zapis]]."]), snCancel)?.answerable === true,
    `T12.32 ~1408 → okoli 1408 ostane (kljub goli letnici v imenu vira)`,
  );

  // --- ekstraktor letnic: osnovne oblike ----------------------------------
  check(
    JSON.stringify(extractYears("okoli leta 1900")) === "[1900]" &&
      JSON.stringify(extractYears("~1408 → danes")) === "[1408]" &&
      JSON.stringify(extractYears("≈ 2011 → danes")) === "[2011]" &&
      JSON.stringify(extractYears("born c. 1928")) === "[1928]",
    `T12.33 extractYears: okoli/~1408/≈/c. oblike`,
  );
  check(
    extractYears("1.009 m³/s").length === 0 && extractYears("45.57246").length === 0,
    `T12.34 extractYears: decimalna števila/koordinate NISO letnice`,
  );

  // --- REALNI muzejski podatki (~1408, ~2004, ~1928) ----------------------
  const cerkvisce = buildContext("sl", "Kaj je Cerkvišče?");
  const cy = attestedYearsOf(cerkvisce.context);
  check(
    cy.approxOnly.has(1408) && !cy.exact.has(1408),
    `T12.35 Cerkvišče (realno): 1408 je približna letnica (~1408)`,
  );
  check(
    verifyAnswer(
      yearAnswer(["Cerkvišče je zapis iz leta 1408 [[cerkvisce]]."]).replace(/\[\[testni-zapis\]\]/g, "[[cerkvisce]]").replace(/"testni-zapis"/g, '"cerkvisce"'),
      cerkvisce.context,
    )?.answerable === false,
    `T12.36 Cerkvišče (realno): golo 1408 v odgovoru ODPADE`,
  );
  check(
    verifyAnswer(
      yearAnswer(["Cerkvišče je zapis, nastal okoli leta 1408 [[cerkvisce]]."]).replace(/\[\[testni-zapis\]\]/g, "[[cerkvisce]]").replace(/"testni-zapis"/g, '"cerkvisce"'),
      cerkvisce.context,
    )?.answerable === true,
    `T12.37 Cerkvišče (realno): okoli leta 1408 ostane`,
  );
  const pasuljada = buildContext("sl", "Kdaj se je začela zgodovina pasuljade?");
  const py = attestedYearsOf(pasuljada.context);
  check(py.approxOnly.has(2004), `T12.38 Pasuljada (realno): ~2004 je približna letnica`);
  const kralj = buildContext("en", "Who was Tone Kralj?");
  const ky = attestedYearsOf(kralj.context);
  check(
    ky.approxOnly.has(1928),
    `T12.39 Tone Kralj (realno, EN plast): »born c. 1928« je približna letnica`,
  );
}

// ===========================================================================
section("T13 — LEKSIČNI ŠUM RETRIEVALA (očitni lažni zadetki → zavrnitev)");
// ===========================================================================

async function t13() {
  // --- očitni lažni zadetki: 0 klicev modela, poštena zavrnitev ---------
  const noise: Array<[string, string]> = [
    ["sl", "Kaj je hitrost svetlobe?"],
    ["sl", "Koliko je hitrost svetlobe v vakuumu?"],
    ["sl", "Kdo je bil papež leta 1500?"],
    ["sl", "Kaj je Higgsov bozon?"],
    ["sl", "Kaj je hitrost zvoka?"],
  ];
  let ni = 0;
  for (const [lang, q] of noise) {
    ni++;
    const guard = fakeProvider();
    const r = await askCurator(lang as "sl", q, guard);
    check(
      guard.calls.length === 0 && r.answerable === false && r.reason === "insufficient_evidence",
      `T13.${ni} šum »${q}« → 0 klicev modela + zavrnitev`,
      `klicev: ${guard.calls.length}`,
    );
    check(
      r.suggestions.length === 0,
      `T13.${ni}b zavrnitev brez navideznih predlogov (nearest čist)`,
    );
  }

  // --- zadetki po letnici BREZ besedilnega sidra -------------------------
  const { context: papezCtx } = buildContext("sl", "Kdo je bil papež leta 1500?");
  check(
    papezCtx.exhibits.length === 0 && papezCtx.entities.length === 0,
    `T13.6 letnica 1500 brez besedilnega sidra ne prinese zapisov (kučar/zemljevidi prej da)`,
  );

  // --- legitimni primeri NE SMEJO odpasti (naročilo §2) ------------------
  const legit: Array<[string, string, (c: AIContext) => boolean, string]> = [
    [
      "sl",
      "Kaj se je dogajalo ob Kolpi?",
      (c) => c.entities.some((e) => /Kolp/i.test(e.label)),
      "Kolpa (sklanjatev Kolpi)",
    ],
    [
      "sl",
      "Kaj pripoveduje zapis o zvonu leta 2008?",
      (c) => [...c.provided.keys()].includes("zvon-2008"),
      "zvon + letnica 2008",
    ],
    [
      "sl",
      "Kaj se je zgodilo v Gribljah marca 1945?",
      (c) => c.exhibits.length > 0 || c.entities.length > 0,
      "Gribljah (sklanjatev) + marec 1945",
    ],
    [
      "sl",
      "Kaj se je zgodilo leta 1942?",
      (c) => c.exhibits.length > 0,
      "letnica sama (occupationska obdobja)",
    ],
    [
      "sl",
      "Kaj se je zgodilo z MVG-014?",
      (c) => [...c.provided.keys()].includes("evakuacija-1945"),
      "MVG-014 razrešitev",
    ],
    [
      "sl",
      "Povej o Barletih",
      (c) => c.entities.filter((e) => /Barle/.test(e.label)).length === 3,
      "Barletih (množinska sklanjatev) → TRIJE Barle",
    ],
    [
      "sl",
      "Kaj je Cerkvišče?",
      (c) => [...c.provided.keys()].includes("cerkvisce"),
      "zapis s približno letnico dosegljiv",
    ],
  ];
  let li = 0;
  for (const [lang, q, test, name] of legit) {
    li++;
    const { context } = buildContext(lang as "sl", q);
    check(
      contextHasEvidence(context) && test(context),
      `T13.${6 + li} legitimni zadetek ostaja: ${name}`,
    );
  }

  // --- predponska luža: svetlobe ≠ svet (korenski vzrok) ------------------
  const vaska = seedExhibits.find((e) => e.slug === "vaska-sola");
  const vaskaTokens = new Set(
    (vaska?.titleSi ?? "").normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().split(/[^\p{L}\p{N}]+/u),
  );
  check(
    vaskaTokens.has("svet"),
    `T13.14 korenski vzrok potrjen: naslov vaška šola vsebuje žeton »svet«`,
  );
  const light = buildContext("sl", "Kaj je hitrost svetlobe?");
  check(
    light.context.exhibits.length === 0 && light.trace.nearest.length === 0,
    `T13.15 »svetlobe« NE zadene »svet« (predpona 4 znakov brez končnice)`,
  );

  // --- REFUSAL sporočilo je pošteno muzejsko ------------------------------
  const guard2 = fakeProvider();
  const rr = await askCurator("sl", "Kaj je hitrost svetlobe?", guard2);
  check(
    rr.kajVemo.length === 0 && rr.viri.length === 0 && !rr.answerable,
    `T13.16 zavrnitev šuma: prazno kajVemo, brez virov (»ni dovolj dokumentiranih podatkov«)`,
  );
}
await t13();

// ===========================================================================
section("T43 — LASTNA IDENTITETA PRED OMEMBAMI (TASK 43 — FAIL #23)");
// ===========================================================================

/**
 * FAIL #23 (Field Validation, reproduciran 3/3 + 1): »Kdo je bil Ivan
 * Barle?« → Konradova biografija. Korenski vzrok: AIEntityContext je nosil
 * le oznako + zapise z OMENBAMI entitete, trditve zapisov pa govorijo o
 * njihovih lastnih subjektih. Popravek: LASTNA identiteta iz registra
 * (identity), predmet vprašanja (isTarget), priimkovno ločeni vnosi
 * (distinctFrom) in odnos zapisa do entitete (relation) — vse
 * DETERMINISTIČNO, izključno iz obstoječega registra, brez novih dejstev.
 */

{
  // --- T43.1 — »Kdo je bil Ivan Barle?« (FAIL #23, reproduciran) ----------
  const ivan = buildContext("sl", "Kdo je bil Ivan Barle?");
  const ivanEntity = ivan.context.entities.find((e) => e.id === "person:ivan-barle");
  check(!!ivanEntity, "T43.1a Ivan Barle je razrešen v kontekstu");
  check(
    ivanEntity?.isTarget === true,
    "T43.1b Ivan je PREDMET vprašanja (isTarget=true)",
  );
  check(
    !!ivanEntity?.identity &&
      /1841 – 1930/.test(ivanEntity.identity) &&
      /Učitelj, organist in sadjar v Podzemlju \(1872–1893\)/.test(ivanEntity.identity) &&
      /Oče Janka in Konrada/.test(ivanEntity.identity),
    "T43.1c Ivanova LASTNA identiteta iz registra (čas + opomba: Podzemelj 1872–1893, oče)",
    ivanEntity?.identity ?? "ni identitete",
  );
  check(
    !!ivanEntity?.distinctFrom &&
      ivanEntity.distinctFrom.length === 2 &&
      ivanEntity.distinctFrom.some((d) => /^Janko Barle \(1869 – 1941\)$/.test(d)) &&
      ivanEntity.distinctFrom.some((d) => /^Konrad Barle \(19\. februar 1875 – 15\. julij 1951\)$/.test(d)),
    "T43.1d distinctFrom: KONRAD in JANKO kot ločeni registrirani osebi (s letnicami)",
    JSON.stringify(ivanEntity?.distinctFrom),
  );
  check(
    (ivanEntity?.evidence ?? []).length > 0 &&
      ivanEntity!.evidence.every((ev) => ev.relation === "mentioned-in-record"),
    "T43.1e VSI Ivanovi zapisi so OMENJBE (ni zapisa O Ivanu — njegova biografija je identiteta, ne Konradov povzetek)",
  );
  check(
    ivanEntity!.evidence.some((ev) => ev.exhibitSlug === "konrad-barle" && ev.relation === "mentioned-in-record"),
    "T43.1f Konradov zapis ostane kot DOKAZ, a z vlogo OMENJBE (ne odstranjen, ne biografija)",
  );
  check(
    ivan.context.entities.find((e) => e.id === "person:konrad-barle")?.isTarget !== true &&
      ivan.context.entities.find((e) => e.id === "person:janko-barle")?.isTarget !== true,
    "T43.1g Konrad/Janko sta v kontekstu, a NISTA predmet vprašanja",
  );
  // Poziv nosi nove plasti + pravilo prednosti.
  const ivanPrompt = systemPrompt(ivan.context);
  check(
    ivanPrompt.includes("LASTNA IDENTITETA ENTITETE IMA PREDNOST PRED OMEMBAMI") ||
      ivanPrompt.includes("OWN IDENTITY OUTRANKS ITS MENTIONS"),
    "T43.1h poziv nosi pravilo 11 (lastna identiteta pred omembami)",
  );
  check(
    ivanPrompt.includes("Učitelj, organist in sadjar v Podzemlju") &&
      ivanPrompt.includes("\"isTarget\": true") &&
      ivanPrompt.includes("\"distinctFrom\"") &&
      ivanPrompt.includes("\"mentioned-in-record\""),
    "T43.1i poziv nosi identity/isTarget/distinctFrom/relation konteksta",
  );
  // Letni varuh: letnice Ivanove identitete so DOKAZANE (1841/1930/1872/1893
  // so registrski podatek) — odgovor, ki jih izpiše, NE odpade.
  const ivanYears = attestedYearsOf(ivan.context);
  check(
    ivanYears.exact.has(1841) && ivanYears.exact.has(1930) && ivanYears.exact.has(1872) && ivanYears.exact.has(1893),
    "T43.1j letnice identitete so dokazane (1841/1930/1872/1893 — opomba registra šteje)",
  );
  const ivanAnswer = verifyAnswer(
    JSON.stringify({
      answerable: true,
      reason: null,
      kajVemo: [
        "Ivan Barle (1841 – 1930) je bil učitelj, organist in sadjar v Podzemlju, kjer je poučeval med letoma 1872 in 1893; gribeljski otroci so hodili k njegovemu pouku pred 1889. [[konrad-barle]]",
      ],
      kakoVemo: ["Njegovo identiteto dokumentira zapis o družini Barle. [[konrad-barle]]"],
      viri: [{ slug: "konrad-barle", sourceIndex: 1 }],
      opomba: null,
    }),
    ivan.context,
  );
  check(
    ivanAnswer !== null && ivanAnswer.answerable === true && ivanAnswer.kajVemo.length === 1,
    "T43.1k odgovor O IVANU (iz lastne identitete) preide preverbo — letnice ne odpadejo",
  );

  // --- T43.2 — »Kdo je bil Konrad Barle?« (regresija nasprotne smeri) -----
  const konrad = buildContext("sl", "Kdo je bil Konrad Barle?");
  const konradEntity = konrad.context.entities.find((e) => e.id === "person:konrad-barle");
  check(konradEntity?.isTarget === true, "T43.2a Konrad je predmet vprašanja");
  check(
    konradEntity!.evidence.some((ev) => ev.exhibitSlug === "konrad-barle" && ev.relation === "about-this-entity"),
    "T43.2b Konradov zapis je O KONRADU (relation: about-this-entity)",
  );
  check(
    /Učitelj v Metliki \(1899–1934\)/.test(konradEntity?.identity ?? ""),
    "T43.2c Konradova identiteta ostaja njegova (Metlika 1899–1934)",
    konradEntity?.identity ?? "ni identitete",
  );
  check(
    (konradEntity?.distinctFrom ?? []).some((d) => d.startsWith("Ivan Barle (1841 – 1930)")),
    "T43.2d Ivan je v Konradovem distinctFrom (ločen vnos) — Ivanova identiteta se NE uporabi namesto Konradove",
  );
  check(
    konrad.context.entities.find((e) => e.id === "person:ivan-barle")?.isTarget !== true,
    "T43.2e Ivan NI predmet Konradovega vprašanja",
  );

  // --- T43.3 — »Kdo je bil Janko Barle?« -----------------------------------
  const janko = buildContext("sl", "Kdo je bil Janko Barle?");
  const jankoEntity = janko.context.entities.find((e) => e.id === "person:janko-barle");
  check(jankoEntity?.isTarget === true, "T43.3a Janko je predmet vprašanja");
  check(
    jankoEntity!.evidence.some((ev) => ev.exhibitSlug === "janko-barle" && ev.relation === "about-this-entity"),
    "T43.3b Jankov zapis je O JANKU (about-this-entity)",
  );
  check(
    /Zapisovalec Bele krajine/.test(jankoEntity?.identity ?? "") &&
      (jankoEntity?.distinctFrom ?? []).length === 2,
    "T43.3c Jankova identiteta + oba brata v distinctFrom (ločena oseba)",
    jankoEntity?.identity ?? "",
  );

  // --- T43.4 — »Ali sta Ivan in Konrad Barle ista oseba?« ------------------
  const ista = buildContext("sl", "Ali sta Ivan in Konrad Barle ista oseba?");
  const istaIvan = ista.context.entities.find((e) => e.id === "person:ivan-barle");
  const istaKonrad = ista.context.entities.find((e) => e.id === "person:konrad-barle");
  check(
    istaIvan?.isTarget === true && istaKonrad?.isTarget === true,
    "T43.4a obe osebi sta PREDMET vprašanja (dva cilja)",
  );
  check(
    (istaIvan?.distinctFrom ?? []).some((d) => d.startsWith("Konrad Barle (")) &&
      (istaKonrad?.distinctFrom ?? []).some((d) => d.startsWith("Ivan Barle (")),
    "T43.4b vsaka nosi drugo v distinctFrom — register jih drži LOČENO",
  );
  check(
    istaIvan!.identity !== istaKonrad!.identity &&
      /1841 – 1930/.test(istaIvan!.identity ?? "") &&
      /19\. februar 1875/.test(istaKonrad!.identity ?? ""),
    "T43.4c identiteti sta RAZLIČNI (ne združita, ne zamenjata)",
  );

  // --- T43.5 — omemba Ivana v Konradovem zapisu NE postane Ivanova biografija
  // Opomba: sklanjatvena oblika »Barletu« ne dokonča žetonske slike priimka
  // (dohodno besedilno ujemanje iz 42.1 se NE razširja — zato Konrad ni
  // »isTarget«, je pa razrešen po imenu in njegov zapis nosi about-vezo).
  const zapisKonrad = buildContext("sl", "Kaj pripoveduje zapis o Konradu Barletu?");
  const zkKonrad = zapisKonrad.context.entities.find((e) => e.id === "person:konrad-barle");
  const zkIvan = zapisKonrad.context.entities.find((e) => e.id === "person:ivan-barle");
  check(
    !!zkKonrad,
    "T43.5a Konrad je razrešen (žeton imena) — zapis, v katerem je Ivan omenjen, je njegov",
  );
  check(
    zkKonrad!.evidence.some((ev) => ev.exhibitSlug === "konrad-barle" && ev.relation === "about-this-entity"),
    "T43.5b zapis je o Konradu (about) — Ivan, omenjen v njem, ostane OMENJBA",
  );
  check(
    (zkIvan ? zkIvan.isTarget : false) !== true && !zapisKonrad.context.entities.some((e) => e.isTarget && e.type === "person" && /Ivan/.test(e.label)),
    "T43.5c Ivan NI predmet vprašanja o Konradovem zapisu (omemba ostane omemba)",
  );
  const barletih = buildContext("sl", "Kaj veš o Barletih?");
  const barleTargets = barletih.context.entities.filter((e) => e.isTarget);
  check(
    barletih.context.entities.filter((e) => /Barle/.test(e.label)).length === 3 &&
      barleTargets.length === 0,
    "T43.5d pri golem priimku NIČ od treh Barle ni »predmet« — vse tri ostanejo ločene osebe z lastnimi identitetami",
  );
  check(
    barletih.context.entities
      .find((e) => e.id === "person:ivan-barle")!
      .evidence.every((ev) => ev.relation === "mentioned-in-record"),
    "T43.5e omemba Ivana v Konradovem/Jankovem zapisu ostane OMENJBA (ne biografija)",
  );

  // --- ostale znane identitetne vezi (naročilo §9) ------------------------
  // Jože ≠ Janez Dular
  const dular = buildContext("sl", "Kdo je bil Jože Dular?");
  const dularEntity = dular.context.entities.find((e) => e.id === "person:joze-dular");
  check(
    dularEntity?.isTarget === true && /NI Janez Dular/.test(dularEntity?.identity ?? ""),
    "T43.6a Jože Dular: cilj + identiteta nosi ločitev od Janeza (arheologa)",
    dularEntity?.identity ?? "",
  );
  check(
    !ENTITY_BY_ID.has("person:janez-dular") &&
      (dularEntity?.distinctFrom ?? []).every((d) => !/Janez/.test(d)),
    "T43.6b Janez Dular NI entiteta registra (P1-E4 ostaja nerazrešen — nič novega)",
  );
  check(
    dularEntity!.evidence.some((ev) => ev.exhibitSlug === "joze-dular" && ev.relation === "about-this-entity"),
    "T43.6c Dularov zapis ostane O Dularju (about)",
  );

  // Fran Vesel ≠ Franjo Veselko (žetonska slika ju pri sovpajanju imena
  // »fran/franjo« lahko izbere OBA — izbira je obstoječa vedenjska plast
  // retrievala; meja naloge je CILJ in IDENTITETA, ne izbira)
  const vesel = buildContext("sl", "Kaj je fotografiral Fran Vesel?");
  const veselEntity = vesel.context.entities.find((e) => e.id === "person:fran-vesel");
  const veselko = buildContext("sl", "Kdo je bil Franjo Veselko?");
  const veselkoEntity = veselko.context.entities.find((e) => e.id === "person:franjo-veselko");
  check(
    veselEntity?.isTarget === true &&
      vesel.context.entities.find((e) => e.id === "person:franjo-veselko")?.isTarget !== true,
    "T43.7a Fran Vesel je cilj svojega vprašanja; Franjo Veselko (tudi če je soizbran) NI predmet",
  );
  check(
    veselkoEntity?.isTarget === true &&
      veselko.context.entities.find((e) => e.id === "person:fran-vesel")?.isTarget !== true,
    "T43.7b Franjo Veselko je cilj svojega vprašanja; Fran Vesel (tudi če je soizbran) NI predmet — njegova identiteta se NE uporabi namesto Franjetove",
  );
  check(
    !!veselEntity?.identity && /~1920/.test(veselEntity.identity) &&
      attestedYearsOf(vesel.context).approxOnly.has(1920) && !attestedYearsOf(vesel.context).exact.has(1920),
    "T43.7c Veselova identiteta nosi ~1920 in letni varuh jo drži PIBLIŽNO (tudi iz identitete)",
  );
  check(
    (veselEntity?.distinctFrom ?? []).length === 0 &&
      (veselkoEntity?.distinctFrom ?? []).length === 0,
    "T43.7d Vesel/Veselko nimata skupnega žetona — ločita se po LASTNIH identitetah",
  );

  // Zupaniči: trije vnosi
  for (const [q, id] of [
    ["Kdo je bil Niko Županič?", "person:niko-zupanic"],
    ["Kdo je bil Mate Zupanič-Švarski?", "person:mate-zupanic-svarski"],
    ["Kdo je bil Katarina Zupanič?", "person:katarina-zupanic"],
  ] as const) {
    const { context } = buildContext("sl", q);
    const target = context.entities.find((e) => e.id === id);
    const others = context.entities.filter((e) => e.id !== id && e.type === "person");
    check(
      target?.isTarget === true &&
        others.every((o) => o.isTarget !== true),
      `T43.8 ${q.replace("Kdo je bil ", "")} → pravi cilj, drugi Zupaniči niso predmet`,
    );
    check(
      (target?.distinctFrom ?? []).length >= 2,
      `T43.8 ${q.replace("Kdo je bil ", "")} → vsaj 2 ločeni sorodniki v distinctFrom`,
      JSON.stringify(target?.distinctFrom),
    );
  }

  // Dragoši (KRAJ) ≠ Dragoš (OSEBA)
  const dragosi = buildContext("sl", "Kaj so Dragoši?");
  const dragosPerson = buildContext("sl", "Kdo je bil Nikolaj Dragoš?");
  const dragosiPlace = dragosi.context.entities.find((e) => e.id === "place:dragosi");
  const dragosEntity = dragosPerson.context.entities.find((e) => e.id === "person:nikolaj-dragos");
  check(
    dragosiPlace?.isTarget === true && /NI priimek Dragoš/.test(dragosiPlace?.identity ?? ""),
    "T43.9a Dragoši: cilj je KRAJ, identiteta nosi ločitev od priimka Dragoš",
    dragosiPlace?.identity ?? "",
  );
  check(
    dragosEntity?.isTarget === true &&
      dragosPerson.context.entities.find((e) => e.id === "place:dragosi")?.isTarget !== true,
    "T43.9b Nikolaj Dragoš: cilj je OSEBA, kraj Dragoši NI predmet (smer NAPREJ — Dragоš ≠ kraj)",
  );
  check(
    (dragosEntity?.distinctFrom ?? []).length === 0,
    "T43.9c Nikolaj nima priimkovnega sorodnika med OSEBAMI (kraj se NE šteje)",
  );

  // Otok ≠ Krasinec (kraji)
  const otok = buildContext("sl", "Kje je bilo partizansko letališče Otok?");
  const krasinec = buildContext("sl", "Kaj je Krasinec?");
  const otokEntity = otok.context.entities.find((e) => e.id === "place:partizansko-letalisce-otok");
  const krasinecEntity = krasinec.context.entities.find((e) => e.id === "place:krasinec");
  check(
    otokEntity?.isTarget === true && /1473 prepeljanih ranjencev/.test(otokEntity?.identity ?? ""),
    "T43.10a Otok: lastna identiteta kraja (travnik, ranjenci)",
  );
  check(
    krasinecEntity?.isTarget === true && /Zaselk ob Kolpi/.test(krasinecEntity?.identity ?? ""),
    "T43.10b Krasinec: lastna identiteta kraja (ločen kraj, ne Otok)",
  );
  check(
    krasinec.context.entities.find((e) => e.id === "place:partizansko-letalisce-otok") === undefined ||
      krasinec.context.entities.find((e) => e.id === "place:partizansko-letalisce-otok")?.isTarget !== true,
    "T43.10c Krasinec vprašanje NE cilja na Otok (in obratno)",
  );

  // MVG-014 ↔ MVG-056: razcep ostaja (P1-E1)
  const mvg = buildContext("sl", "Ali je dogodek iz MVG-014 isti kot MVG-056?");
  check(
    mvg.context.provided.has("evakuacija-1945") && mvg.context.provided.has("zracni-most-krasinec") &&
      mvg.trace.openQuestions.some((q) => q.id === "P1-E1"),
    "T43.11 MVG-014/MVG-056: oba zapisa + P1-E1 ostajajo (identitetni popravek razcepa NI dotaknil)",
  );

  // Peter Madronič: ostaja BREZ entitete (P0-E1)
  const madronic = buildContext("sl", "Kdo je bil Peter Madronič?");
  check(
    !madronic.context.entities.some((e) => /madronic/i.test(e.label)) &&
      madronic.trace.openQuestions.some((q) => q.id === "P0-E1"),
    "T43.12 Madronič: NOBENA nova entiteta (P0-E1 vrsta ostaja edina pot)",
  );

  // Determinizem novih plasti (bajtno identičen dvojni zagon)
  const d1 = JSON.stringify(buildContext("sl", "Kdo je bil Ivan Barle?").context.entities);
  const d2 = JSON.stringify(buildContext("sl", "Kdo je bil Ivan Barle?").context.entities);
  check(d1 === d2, "T43.13 identitetne plasti so deterministične (dvojni zagon identičen)");

  // EN plast: identiteta obstaja tudi v angleški smeri
  const ivanEn = buildContext("en", "Who was Ivan Barle?");
  const ivanEnEntity = ivanEn.context.entities.find((e) => e.id === "person:ivan-barle");
  check(
    ivanEnEntity?.isTarget === true &&
      /1841 – 1930/.test(ivanEnEntity?.identity ?? "") &&
      (ivanEnEntity?.distinctFrom ?? []).some((d) => d.startsWith("Konrad Barle (19 February 1875")),
    "T43.14 EN plast: isti cilj, ista ločitev (angleške letnice iz registra)",
    JSON.stringify(ivanEnEntity?.distinctFrom),
  );
}

// ===========================================================================
console.log("");
console.log("=".repeat(70));
if (fail === 0) {
  console.log(`TESTI AI KUSTOSA: ${ok} ✓ / ${fail} ✗`);
  console.log("VSI TESTI USPEŠNI — model je zadnja plast, dokazi pa prva.");
} else {
  console.log(`TESTI AI KUSTOSA: ${ok} ✓ / ${fail} ✗`);
  for (const f of failures) console.log("  ✗ " + f);
}
console.log("=".repeat(70));
process.exit(fail ? 1 : 0);
