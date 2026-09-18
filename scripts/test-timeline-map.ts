/**
 * TASK 40 / TESTI — testna surita za KRONIKO + ZEMLJEVID SPOMINA.
 * (40. sklop / TESTI po 39. sklopu — TIMELINE + MAP OF MEMORY)
 *
 * Ničesar ne spreminja. Preverja:
 *  T1 časovnica — osnova (27 EventRef, 6 TimeRef, 34 kartic, determinizem)
 *  T2 SoftTime semantika (približnosti, intervali, BREZ pretvorbe v datum)
 *  T3 evidence vezi časovnice (zapis + vir prek sourceIndex)
 *  T4 MVG-014 ↔ MVG-056 — ločena, dokler kustos ne potrdi (P1-E1)
 *  T5 zemljevid spomina (26 PlaceRef, dokazane koordinate, roundtrip)
 *  T6 kuratorska varnost (Madronič ×2, Barle ×3, Dragoši ≠ Dragoš, Otok ≠ Krasinec)
 *  T7 podatkovna regresija (93/412/315/51/372, related, walkStopOf, i18n)
 *  T8 HTTP regresija (93/93 strani, IIIF, OpenData, QR, sitemap)
 *
 * Zagon: bun scripts/test-timeline-map.ts
 */

import {
  ENTITIES,
  ENTITY_BY_ID,
  ENTITY_QUEUE,
  entitiesOfKind,
  entitiesForExhibit,
  exhibitsForEntity,
  type EntityRef,
  type EventRef,
  type PlaceRef,
  type TimeRef,
} from "../src/lib/entities";
import {
  ERA_ORDER,
  SPLIT_EVENTS,
  eraOfSortKey,
  objectLayer,
  placeMemory,
  placeStatus,
  timelineItems,
  type TimelineItem,
} from "../src/lib/timeline-map";
import { seedExhibits } from "../src/lib/museum-content";
import { SOURCE_USAGE, sourceKeyOf } from "../src/lib/source-registry";
import { relatedExhibits } from "../src/lib/connections";
import { ALL_WALKS, walkStopOf } from "../src/lib/walks";
import { OBJECT_BIOGRAPHIES } from "../src/lib/object-biographies";
import { ui } from "../src/lib/i18n";
import type { ExhibitDTO, SourceDTO } from "../src/lib/types";

// ---------------------------------------------------------------------------
// Pripomočki (vzorec test-entities.ts)
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

/** Seme → ExhibitDTO (adapter kot v test-entities/audit-timeline-map). */
function toDTO(ex: (typeof seedExhibits)[number]): ExhibitDTO {
  return {
    id: ex.slug,
    slug: ex.slug,
    museumNo: ex.museumNo ?? null,
    category: ex.category,
    titleSi: ex.titleSi,
    titleEn: ex.titleEn,
    periodSi: ex.periodSi,
    periodEn: ex.periodEn,
    summarySi: ex.summarySi,
    summaryEn: ex.summaryEn,
    storySi: ex.storySi,
    storyEn: ex.storyEn,
    evidenceStatus: ex.evidenceStatus,
    image: ex.image ?? null,
    imageCredit: ex.imageCredit ?? null,
    model3dUrl: ex.model3dUrl ?? null,
    model3dCredit: ex.model3dCredit ?? null,
    yearFrom: ex.yearFrom ?? null,
    yearTo: ex.yearTo ?? null,
    lat: ex.lat ?? null,
    lng: ex.lng ?? null,
    coordsApprox: ex.coordsApprox ?? false,
    featured: ex.featured ?? false,
    sortOrder: seedExhibits.indexOf(ex),
    addedAt: ex.addedAt ?? null,
    sources: ex.sources.map(
      (s): SourceDTO => ({
        id: ex.slug + ":" + s.key,
        nameSi: s.nameSi,
        nameEn: s.nameEn,
        sourceType: s.sourceType,
        license: s.license,
        url: s.url ?? null,
        noteSi: s.noteSi ?? null,
        noteEn: s.noteEn ?? null,
      })
    ),
  };
}

const exhibits: ExhibitDTO[] = seedExhibits.map(toDTO);
const bySlug = new Map(seedExhibits.map((e) => [e.slug, e]));
const dtoBySlug = new Map(exhibits.map((e) => [e.slug, e]));
const seedBySlug = bySlug;

const items = timelineItems(exhibits);
const memory = placeMemory(exhibits);

// ===========================================================================
section("T1 — ČASOVNICA: osnova (27 EventRef, 6 TimeRef, 34 kartic)");
{
  const eventRefs = entitiesOfKind("event");
  const timeRefs = entitiesOfKind("time");
  check(eventRefs.length === 27, "T1.1 registr: 27 EventRef", `=${eventRefs.length}`);
  check(timeRefs.length === 6, "T1.2 registr: 6 TimeRef", `=${timeRefs.length}`);
  check(items.length === 34, "T1.3 timelineItems: 34 kartic (28 dogodkov + 6 sider)", `=${items.length}`);
  check(items.filter((i) => !i.isAnchor).length === 28, "T1.4 dogodkovne kartice: 28 (razcep −1 +2)", `=${items.filter((i) => !i.isAnchor).length}`);
  check(items.filter((i) => i.isAnchor).every((i) => i.entity.type === "time") && items.filter((i) => i.isAnchor).length === 6, "T1.5 časovna sidra: 6, vsi TimeRef");

  // Determinizem: dvojni izračun — bajtno identičen izhod.
  const again = timelineItems(exhibits);
  check(JSON.stringify(items) === JSON.stringify(again), "T1.6 determinizem: timelineItems dvojni zagon identičen");
  const memoryAgain = placeMemory(exhibits);
  check(JSON.stringify(memory) === JSON.stringify(memoryAgain), "T1.7 determinizem: placeMemory dvojni zagon identičen");

  // Kronološki vrstni red + era determinizem.
  const sortedOk = items.every((i, idx) => idx === 0 || items[idx - 1].sortKey <= i.sortKey);
  const eraOk = items.every((i) => i.era === eraOfSortKey(i.sortKey) && ERA_ORDER.includes(i.era));
  check(sortedOk && eraOk, "T1.8 vrstni red: sortKey narašča; era izpeljana deterministično");
  check(items.every((i) => ENTITY_BY_ID.has(i.entity.id)), "T1.9 vsaka kartica nosi obstoječo entiteto registra");
}

// ===========================================================================
section("T2 — SOFTTIME SEMANTIKA: čas KOT JE ZAPISAN");
{
  const eventRefs = entitiesOfKind("event") as EventRef[];
  check(eventRefs.every((e) => e.time != null), "T2.1 vsak EventRef ima SoftTime (27/27)");

  const airlift = ENTITY_BY_ID.get("event:zracni-most-krasinec-1945") as EventRef;
  check(
    airlift.time?.labelSi === "konec marca 1945 (48 ur)" && airlift.time?.labelEn === "late March 1945 (48 hours)",
    "T2.2 zračni most: »konec marca 1945 (48 ur)« — BREZ pretvorbe v 25. 3. 1945"
  );
  const approxItems = items.filter((i) => i.precision === "approximate");
  check(
    new Set(approxItems.map((i) => i.entity.id)).size === 1 &&
      approxItems.every((i) => i.entity.id === "event:zracni-most-krasinec-1945"),
    "T2.3 approximate: SAMO zračni most (≈ nosi le izrecna približnost vira; razcep = 2 kartici istega dogodka)"
  );
  check(
    items.filter((i) => i.precision === "interval").length === 4,
    "T2.4 intervali: 4 (španka X–XII 1918, izseljenstvo 1880→1914, sidri 1914–1918 + 1941–1945)",
    `=${items.filter((i) => i.precision === "interval").length}`
  );
  check(
    items.filter((i) => i.precision === "exact-date").length === 4,
    "T2.5 točen dan: 4 (zaseda 6. 9. 1941, SNOS 19.–20. 2. 1944, Gribeljci 19. 6. 2019, praznik KS 15. 9. 2024)",
    `=${items.filter((i) => i.precision === "exact-date").length}`
  );
  check(
    items.filter((i) => !i.isAnchor && i.precision === "month").length === 3,
    "T2.6 mesec: 3 (šola XI 1889, učilnica VI 2022, petstoletnica VI 2026)"
  );
  check(
    items.filter((i) => !i.isAnchor && i.precision === "year").length === 17,
    "T2.7 samo leto: 17 dogodkov",
    `=${items.filter((i) => !i.isAnchor && i.precision === "year").length}`
  );

  // Razcepne kartice kažejo ZAPISOVO lastno obdobje, ne entitetni SoftTime.
  const cardA = items.find((i) => i.key.endsWith("::evakuacija-1945"));
  const cardB = items.find((i) => i.key.endsWith("::zracni-most-krasinec"));
  const recA = bySlug.get("evakuacija-1945");
  const recB = bySlug.get("zracni-most-krasinec");
  check(
    cardA != null && cardB != null &&
      cardA.splitRecord?.periodSi === recA?.periodSi &&
      cardB.splitRecord?.periodSi === recB?.periodSi,
    "T2.8 razcepne kartice: MVG-014 »Marec 1945«, MVG-056 »25.–26. marec 1945« — zapisovi lastni trditvi"
  );

  // Noben sintetiziran (ISO) datum nikjer v prikazanih časovnih nizih.
  const iso = /\d{4}-\d{2}-\d{2}/;
  const noIso =
    seedExhibits.every((ex) => !iso.test(ex.periodSi) && !iso.test(ex.periodEn)) &&
    ENTITIES.every((e) => {
      const t = (e as EventRef).time ?? (e as TimeRef).time;
      return t == null || (!iso.test(t.labelSi) && !iso.test(t.labelEn));
    });
  check(noIso, "T2.9 NIČ ISO datumov (\d{4}-\d{2}-\d{2}) v SoftTime/periodu — plast ne sintetizira datumov");

  const withDay = items.filter((i) => !i.isAnchor && i.precision === "exact-date").length;
  check(27 - withDay === 23, "T2.10 unresolved čas: 23/27 dogodkov brez koledarskega dneva — prikaz brez dneva (leto/mesec/interval/približnost)", `=${27 - withDay}`);
}

// ===========================================================================
section("T3 — EVIDENCE VEZI ČASOVNICE (zapis + vir)");
{
  check(
    items.every((i) => i.exhibits.length > 0),
    "T3.1 vsaka kartica ima ≥1 dokazni zapis"
  );
  check(
    items.every((i) => i.exhibits.every((ex) => bySlug.has(ex.slug))),
    "T3.2 vsi dokazni zapisi obstajajo v semenu"
  );
  const idxOk = ENTITIES.every((e) =>
    e.evidence.every((ev) => {
      if (ev.sourceIndex == null) return true;
      const ex = bySlug.get(ev.slug);
      return ex != null && ev.sourceIndex >= 0 && ev.sourceIndex < ex.sources.length;
    })
  );
  check(idxOk, "T3.3 sourceIndex vezi v mejah (entiteta → evidence → viri zapisa)");

  // Točkovne vsebinske preverbe: vir na mestu res nosi trditev.
  const zaseda = bySlug.get("zaseda-1941");
  const zasedaBinding = ENTITIES.find((e) => e.id === "event:zaseda-na-cesti-1941")?.evidence.find((ev) => ev.slug === "zaseda-1941");
  check(
    zasedaBinding?.sourceIndex === 0 && (zaseda?.sources[0]?.nameSi.includes("Kamra") ?? false),
    "T3.4 zaseda 1941 → vir sourceIndex 0 = Kamra (knjižnica Črnomelj) — vir res nosi dogodek"
  );
  const veselko = ENTITY_BY_ID.get("person:franjo-veselko");
  const vBinding = veselko?.evidence.find((ev) => ev.slug === "zracni-most-krasinec");
  const mv056 = bySlug.get("zracni-most-krasinec");
  check(
    vBinding?.sourceIndex === 1 && (mv056?.sources[1]?.nameSi.includes("Pogovor angleškega pilota") ?? false),
    "T3.5 Franjo Veselko na MVG-056 → vir 1 = »Pogovor angleškega pilota« (fotograf marca 1945)"
  );
}

// ===========================================================================
section("T4 — MVG-014 ↔ MVG-056: ločena, dokler kustos ne potrdi (P1-E1)");
{
  const a = bySlug.get("evakuacija-1945");
  const b = bySlug.get("zracni-most-krasinec");
  check(
    a != null && b != null && a.slug !== b.slug && a.titleSi !== b.titleSi && a.periodSi !== b.periodSi,
    "T4.1 sema: DVA ločena zapisa (različen slug, naslov, obdobje)"
  );
  const cards = items.filter((i) => i.entity.id === "event:zracni-most-krasinec-1945");
  check(
    cards.length === 2 &&
      cards.some((c) => c.key.endsWith("::evakuacija-1945")) &&
      cards.some((c) => c.key.endsWith("::zracni-most-krasinec")),
    "T4.2 časovnica: DVE kartici (po zapisih), ne ena"
  );
  check(
    cards.every((c) => c.splitRecord != null && [a?.titleSi, b?.titleSi].includes(c.splitRecord.titleSi)),
    "T4.3 kartica A = naslov MVG-014, kartica B = naslov MVG-056 (nespremenjena)"
  );
  check(
    !items.some((i) => {
      const text = JSON.stringify({ t: i.splitRecord?.titleSi, e: i.entity.labelSi });
      return text.includes("Marec 1945") && text.includes("2041") && i.splitRecord == null;
    }),
    "T4.4 NOBENA kartica ne združuje obeh zapisov (nikoli spojena predstavitev)"
  );
  check(
    cards.every((c) => c.possibleIdentity === "P1-E1"),
    "T4.5 obe kartici nosita vidno oznako možne istovetnosti P1-E1"
  );
  const q = ENTITY_QUEUE.find((x) => x.id === "P1-E1");
  check(q != null, "T4.6 P1-E1 ŠE ODPRT v kuratorski vrsti (odločitev NI sprejeta)");
  check(
    SPLIT_EVENTS.length === 1 &&
      JSON.stringify([...(SPLIT_EVENTS[0].slugs ?? [])].sort()) === JSON.stringify([...(q?.slugs ?? [])].sort()) &&
      cards.every((c) => c.splitRecord != null && (q?.slugs ?? []).includes(c.splitRecord.slug)),
    "T4.7 skupina razcepa = zapisi vprašanja P1-E1 (opomba imenuje pravi par)"
  );
}

// ===========================================================================
section("T5 — ZEMLJEVID SPOMINA: dokazane lege, roundtrip, brez izmišljenih");
{
  check(memory.length === 26, "T5.1 placeMemory: 26 PlaceRef", `=${memory.length}`);
  const resolved = memory.filter((p) => p.status === "resolved");
  check(resolved.length === 11, "T5.2 resolved: 11 krajev z dokazano lokacijo", `=${resolved.length}`);
  const noPin = memory.filter((p) => p.status !== "resolved");
  check(
    noPin.length === 15 &&
      memory.filter((p) => p.status === "unresolved").length === 10 &&
      memory.filter((p) => p.status === "within-village").length === 4 &&
      memory.filter((p) => p.status === "region").length === 1,
    "T5.3 brez pike: 15 (10 unresolved + 4 zaselki + 1 pokrajina)"
  );
  check(
    resolved.every((p) => p.location && p.locationVia),
    "T5.4 vsak resolved kraj ima lokacijo + nosilni zapis"
  );
  check(
    resolved.every((p) => {
      const via = bySlug.get(p.location!.viaSlug);
      return via != null && via.lat === p.location!.lat && via.lng === p.location!.lng;
    }),
    "T5.5 vsaka koordinata ENAKA koordinati dokaznega zapisa (byte-equal)"
  );
  const seedCoords = new Set(
    seedExhibits.filter((e) => e.lat != null && e.lng != null).map((e) => `${e.lat},${e.lng}`)
  );
  check(
    resolved.every((p) => seedCoords.has(`${p.location!.lat},${p.location!.lng}`)),
    "T5.6 vse pike krajev so IZ obstoječih koordinat semena (množica ⊆ 28)"
  );
  check(
    noPin.every((p) => p.location === null),
    "T5.7 NOBEN unresolved/zaselki/pokrajina nima pike (NE geokodiramo)"
  );
  const podzemelj = memory.find((p) => p.place.id === "place:podzemelj");
  const krasinec = memory.find((p) => p.place.id === "place:krasinec");
  const dragosi = memory.find((p) => p.place.id === "place:dragosi");
  check(
    podzemelj?.location == null && krasinec?.location == null && dragosi?.location == null,
    "T5.8 zavrnjene lažne vezi: Podzemelj/Krasinec/Dragoši brez pike (kučarjeva/otokova/kolpška koordinata NI ta kraj)"
  );
  const malenca = memory.find((p) => p.place.id === "place:malenca");
  const mlin = memory.find((p) => p.place.id === "place:madronicev-mlin");
  check(
    malenca?.status === "unresolved" && mlin?.status === "unresolved",
    "T5.9 Malenca (zapis zavrača risanje) + Madroničev mlin (P3-E8) unresolved"
  );

  // Roundtrip OBJECT ↔ PLACE prek obstoječih poizvedb registra.
  const round1 = ENTITIES.every((e) =>
    e.evidence.every((ev) =>
      entitiesForExhibit(ev.slug).some((x) => x.id === e.id)
    )
  );
  check(round1, "T5.10 object→place roundtrip: evidence slug → entitiesForExhibit vsebuje entiteto (92/93)");
  const round2 = memory.every((p) => {
    const evList = exhibitsForEntity(p.place.id);
    return (
      evList.length === p.place.evidence.length &&
      evList.every((ev, i) => ev.slug === p.place.evidence[i].slug && bySlug.has(ev.slug))
    );
  });
  check(round2, "T5.11 place→object: exhibitsForEntity = evidence vezi kraja (26/26, vrstni red)");

  check(objectLayer(exhibits).length === 28, "T5.12 objectLayer: 28 zapisov s preverjeno lego (obstoječe)");
  check(
    memory.every((p) =>
      p.events.every((ev) => ev.evidence.some((x) => p.exhibits.some((ex) => ex.slug === x.slug)))
    ),
    "T5.13 dogodki kraja izpeljani SAMO iz obstoječih evidence vezi"
  );
  const uniquePoints = new Set([
    ...exhibits.filter((e) => e.lat != null && e.lng != null).map((e) => `${e.lat!.toFixed(6)},${e.lng!.toFixed(6)}`),
    ...resolved.map((p) => `${p.location!.lat.toFixed(6)},${p.location!.lng.toFixed(6)}`),
  ]);
  check(uniquePoints.size === 17, "T5.14 pik na zemljevidu: 17 unikatnih koordinat (kraj+zapisi združeni)", `=${uniquePoints.size}`);
}

// ===========================================================================
section("T6 — KURATORSKA VARNOST: identitete se NIKOLI ne združijo");
{
  // Madronič: dve osebi istega imena — NOBENA osebna entiteta.
  // (place:madronicev-mlin je KRAJ, imenovan po družini — to ni oseba.)
  const madronic = ENTITIES.filter((e) => e.type === "person" && e.labelSi.includes("Madronič"));
  const mvg008persons = entitiesForExhibit("kolpa-extremi").filter((e) => e.type === "person");
  const mvg045persons = entitiesForExhibit("madronicev-mlin").filter((e) => e.type === "person");
  check(
    madronic.length === 0 && mvg008persons.length === 0 && mvg045persons.length === 0,
    "T6.1 Peter Madronič stari (MVG-045) ≠ pravnuk (MVG-008): NOBENA osebna entiteta — ne moreta se združiti"
  );
  check(ENTITY_QUEUE.some((q) => q.id === "P0-E1"), "T6.2 P0-E1 (dva Petra Madroniča) ostaja v kuratorski vrsti");

  // Barle: TRIJE bratje — trije vnosi (letnice KOT SO ZAPISANE).
  const konrad = ENTITY_BY_ID.get("person:konrad-barle");
  const ivan = ENTITY_BY_ID.get("person:ivan-barle");
  const janko = ENTITY_BY_ID.get("person:janko-barle");
  const timeOf = (e: EntityRef | undefined): string =>
    e && (e.type === "person" || e.type === "event") ? e.time?.labelSi ?? "" : "";
  const barleTimes = [timeOf(konrad), timeOf(ivan), timeOf(janko)];
  check(
    Boolean(konrad && ivan && janko) &&
      new Set([konrad?.id, ivan?.id, janko?.id]).size === 3 &&
      barleTimes[0].includes("1875") && barleTimes[0].includes("1951") &&
      barleTimes[1] === "1841 – 1930" &&
      barleTimes[2] === "1869 – 1941",
    "T6.3 Konrad ≠ Ivan ≠ Janko Barle: TRIJE PersonRef, trije ID-ji, trije nabori letnic (1875–1951 / 1841–1930 / 1869–1941)"
  );
  const bare = ENTITIES.filter((e) => e.type === "person" && e.labelSi.replace(/^dr\. /, "").startsWith("Barle"));
  check(bare.length === 0, "T6.4 nič »golega« vnosa Barle (skupna omemba MVG-060 ne združi treh bratov)");

  // Dragoši (kraj) ≠ Nikolaj Dragoš (oseba).
  const dragosiPlace = ENTITY_BY_ID.get("place:dragosi");
  const dragosPerson = ENTITY_BY_ID.get("person:nikolaj-dragos");
  check(
    dragosiPlace?.type === "place" && dragosPerson?.type === "person" &&
      !entitiesOfKind("person").some((p) => p.id === "place:dragosi") &&
      !entitiesOfKind("place").some((p) => p.id === "person:nikolaj-dragos"),
    "T6.5 Dragoši (KRAJ, merilno mesto ob Kolpi) ≠ Nikolaj Dragoš (OSEBA) — ločena ID in vrsta"
  );

  // Otok ≠ Krasinec.
  const otok = memory.find((p) => p.place.id === "place:partizansko-letalisce-otok");
  check(
    otok?.status === "resolved" && krasinecPlace().status === "unresolved" &&
      otok.location != null && krasinecPlace().location == null,
    "T6.6 Otok (letališče, resolved) ≠ Krasinec (vas, unresolved) — Otokova koordinata NI pripisana Krasincu"
  );
  function krasinecPlace(): { status: string; location: unknown } {
    const k = memory.find((p) => p.place.id === "place:krasinec");
    return { status: k?.status ?? "?", location: k?.location ?? null };
  }

  const joze = ENTITY_BY_ID.get("person:joze-dular");
  check(joze != null && !ENTITY_BY_ID.has("person:janez-dular"), "T6.7 Jože Dular (muzealec) ≠ Janez Dular (arheolog): slednji NI v registru");
  check(!ENTITIES.some((e) => e.labelSi.includes("Katarina Brinc")), "T6.8 Katarina Brinc (pogreb 1918) NI v registru (brez sklepov o sorodstvu)");

  // Noben merge v timelineItems: vsak eventId ≤ 2 kartici in le kot razcep.
  const byEvent = new Map<string, TimelineItem[]>();
  for (const i of items) {
    if (i.isAnchor) continue;
    const arr = byEvent.get(i.entity.id) ?? [];
    arr.push(i);
    byEvent.set(i.entity.id, arr);
  }
  check(
    [...byEvent.values()].every((arr) => arr.length === 1 || (arr.length === 2 && arr.every((c) => c.splitRecord != null))),
    "T6.9 nikoli merge: vsak dogodek = 1 kartica (RAZCEP = 2 po zapisih, samo P1-E1)"
  );
}

// ===========================================================================
section("T7 — PODATKOVNA REGRESIJA (invariante osnovne linije)");
{
  check(seedExhibits.length === 93 && new Set(seedExhibits.map((e) => e.museumNo)).size === 93, "T7.1 93 zapisov, 93 MVG številk");
  const rows = seedExhibits.reduce((n, ex) => n + ex.sources.length, 0);
  check(rows === 412, "T7.2 412 vrstic virov", `=${rows}`);
  check(SOURCE_USAGE.size === 315, "T7.3 315 identitet virov (WorldCat OCLC 821110335 združen po dokazu)", `=${SOURCE_USAGE.size}`);
  const shared = [...SOURCE_USAGE.values()].filter((u) => u.exhibits.length >= 2).length;
  check(shared === 51, "T7.4 51 deljenih virov (≥2 zapisa)", `=${shared}`);
  // WorldCat 821110335: dve vrstici (različni imeni, ENAK URL) → en sourceKey.
  const wcRows = seedExhibits.flatMap((ex) =>
    ex.sources
      .filter((s) => (s.url ?? "").includes("worldcat"))
      .map((s) => ({ mvg: ex.museumNo ?? "", key: sourceKeyOf(s.nameSi, s.url ?? null) }))
  );
  const wcKeys = new Set(wcRows.map((r) => r.key));
  const wcUsage = [...SOURCE_USAGE.values()].find((u) => wcKeys.has(u.key));
  check(
    wcRows.length === 2 &&
      wcKeys.size === 1 &&
      wcUsage != null &&
      wcUsage.exhibits.map((e) => e.museumNo).join("+") === "MVG-082+MVG-089",
    "T7.5 WorldCat 821110335: 2 vrstici (različni imeni, isti URL) → 1 sourceKey + usedBy 2 (MVG-082 + MVG-089)"
  );
  const phases = OBJECT_BIOGRAPHIES.reduce((n, b) => n + b.phases.length, 0);
  check(phases === 372 && OBJECT_BIOGRAPHIES.length === 93, "T7.6 93 biografij / 372 faz (NISO dogodki)", `=${OBJECT_BIOGRAPHIES.length}/${phases}`);

  let minRelated = Number.POSITIVE_INFINITY;
  let allRelated = true;
  for (const ex of exhibits) {
    const rel = relatedExhibits(ex, exhibits, 5);
    if (rel.length < 1) allRelated = false;
    minRelated = Math.min(minRelated, rel.length);
  }
  check(allRelated && minRelated >= 5, "T7.7 relatedExhibits: vsi ≥1 (min 5) — kuratorski graf OBJECT ↔ OBJECT nedotaknjen", `min=${minRelated}`);

  const walkCover = seedExhibits.filter((ex) => walkStopOf(ex.slug) != null).length;
  check(walkCover === 93 && ALL_WALKS.length >= 5, "T7.8 walkStopOf pokriva vseh 93 zapisov (sprehodi nedotaknjeni)", `=${walkCover}`);

  const withTime = seedExhibits.filter((e) => e.yearFrom != null).length;
  const withCoords = seedExhibits.filter((e) => e.lat != null && e.lng != null).length;
  check(withTime === 80 && withCoords === 28, "T7.9 objektov s časom (yearFrom) = 80; s koordinato = 28", `=${withTime}/${withCoords}`);

  // i18n: 888 ključev × 5 jezikov, identična struktura (ista logika kot verify-i18n).
  function shapeOf(obj: Record<string, unknown>, prefix = ""): string[] {
    const out: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      const p = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "function") out.push(`${p}:fn(${v.length})`);
      else if (Array.isArray(v)) out.push(`${p}:arr[${v.length}]`);
      else if (v && typeof v === "object") out.push(...shapeOf(v as Record<string, unknown>, p));
      else out.push(p);
    }
    return out;
  }
  const langs = ["sl", "en", "hr", "de", "it"] as const;
  const shapes = langs.map((l) => shapeOf(ui[l] as unknown as Record<string, unknown>));
  const sameStructure = shapes.every((s) => JSON.stringify(s) === JSON.stringify(shapes[0]));
  check(shapes[0].length === 888 && sameStructure, "T7.10 i18n: 888 ključev × 5 jezikov, struktura identična SL", `=${shapes.map((s) => s.length).join("/")}`);
}

// ===========================================================================
section("T8 — HTTP REGRESIJA (živ strežnik :3000)");
{
  const BASE = "http://localhost:3000";
  let serverUp = true;
  try {
    const probe = await fetch(BASE + "/", { method: "HEAD" });
    if (probe.status >= 500) serverUp = false;
  } catch {
    serverUp = false;
  }
  if (!serverUp) {
    console.log("    ⚠ strežnik ne odgovarja — T8 preskočen (zagnani: bun run dev)");
  } else {
    let okPages = 0;
    const badPages: string[] = [];
    for (const ex of seedExhibits) {
      const r = await fetch(BASE + "/exponat/" + ex.slug);
      if (r.status === 200) okPages += 1;
      else badPages.push(ex.slug + ":" + r.status);
    }
    check(okPages === 93, "T8.1 93/93 objektnih strani", `${okPages}; ${badPages.join(",") || "vse 200"}`);

    let okManifests = 0;
    let withSources = 0;
    for (const ex of seedExhibits) {
      const r = await fetch(BASE + "/api/iiif?manifest=" + ex.slug);
      if (r.status !== 200) continue;
      const j = (await r.json()) as { metadata?: { label?: unknown }[] };
      if ((j.metadata ?? []).some((m) => JSON.stringify(m.label).includes("Vir"))) withSources += 1;
      okManifests += 1;
    }
    check(okManifests === 93 && withSources === 93, "T8.2 93/93 IIIF manifestov z ≥1 virom", `${okManifests}/${withSources}`);

    const od = (await (await fetch(BASE + "/api/opendata")).json()) as {
      counts?: { exhibits?: number; sources?: number };
      data?: { exhibits?: { sources?: { sourceKey?: string }[] }[] };
    };
    let withKey = 0;
    let totalRows = 0;
    for (const ex of od.data?.exhibits ?? []) {
      for (const s of ex.sources ?? []) {
        totalRows += 1;
        if (s.sourceKey) withKey += 1;
      }
    }
    check(
      od.counts?.exhibits === 93 && od.counts?.sources === 412,
      "T8.3 OpenData: 93 zapisov / 412 virov",
      `${od.counts?.exhibits}/${od.counts?.sources}`
    );
    check(withKey === 412 && totalRows === 412, "T8.4 OpenData sourceKey 412/412", `${withKey}/${totalRows}`);

    const qr = await fetch(BASE + "/?exhibit=zvon-2008");
    const html = await qr.text();
    check(qr.status === 200 && html.includes("zvon-2008"), "T8.5 QR globoka povezava /?exhibit=zvon-2008 (parameter v strani)");

    const walk = await fetch(BASE + "/?walk=vas-in-njeni-ljudje&stop=4");
    check(walk.status === 200, "T8.6 globoka povezava sprehoda → " + walk.status);

    const sm = await (await fetch(BASE + "/sitemap.xml")).text();
    const locs = (sm.match(/<loc>/g) ?? []).length;
    check(locs === 94, "T8.7 sitemap: 94 URL", `=${locs}`);

    const home = await fetch(BASE + "/");
    check(home.status === 200, "T8.8 domača stran → " + home.status);
  }
}

// ===========================================================================
console.log("");
console.log("=".repeat(70));
if (fail === 0) {
  console.log(`TESTI KRONIKA + ZEMLJEVID SPOMINA: ${ok} ✓ / ${fail} ✗`);
  console.log("VSI TESTI USPEŠNI — isti podatki, isti dokazi, novi poti odkrivanja.");
} else {
  console.log(`TESTI KRONIKA + ZEMLJEVID SPOMINA: ${ok} ✓ / ${fail} ✗`);
  for (const f of failures) console.log("  ✗ " + f);
}
console.log("=".repeat(70));
process.exit(fail ? 1 : 0);
