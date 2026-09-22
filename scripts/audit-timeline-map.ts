/**
 * TASK 40 — VALIDACIJA ČASOVNICE + ZEMLJEVIDA SPOMINA.
 *
 * Preverja podatkovno invarianto naročila:
 *   Every Timeline item → existing EventRef/TimeRef
 *   Every EventRef → evidence
 *   Every Map memory item → existing PlaceRef ali preverjena lega zapisa
 *   Noben nov zgodovinski claim brez vira.
 *
 * Ničesar ne spreminja. Zagon: bun scripts/audit-timeline-map.ts
 */

import {
  ENTITIES,
  ENTITY_QUEUE,
  entitiesOfKind,
  entitiesForExhibit,
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
} from "../src/lib/timeline-map";
import { seedExhibits } from "../src/lib/museum-content";
import type { ExhibitDTO, SourceDTO } from "../src/lib/types";

/** Seme → ExhibitDTO (adapter kot v test-entities.ts — ista polja, ki jih
 *  vezna plast bere: slug, koordinate, viri, obdobje). */
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

let ok = 0;
let fail = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) {
    ok++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const bySlug = new Map(exhibits.map((e) => [e.slug, e]));

console.log("=".repeat(72));
console.log("1) REGISTR NEDOTAKNJEN (invarianta TASK 39)");
console.log("=".repeat(72));
const persons = entitiesOfKind("person").length;
const places = entitiesOfKind("place").length;
const events = entitiesOfKind("event").length;
const times = entitiesOfKind("time").length;
check("94 entitet", ENTITIES.length === 94, `=${ENTITIES.length}`);
check("35 oseb / 26 krajev / 27 dogodkov / 6 časov", persons === 35 && places === 26 && events === 27 && times === 6);
check("kuratorska vrsta 28 vprašanj", ENTITY_QUEUE.length === 28);
check("105 zapisov", exhibits.length === 105);

console.log("=".repeat(72));
console.log("2) ČASOVNICA — gradniki in sledljivost");
console.log("=".repeat(72));
const items = timelineItems(exhibits);
// 27 + 6 sider − 1 spojen dogodek + 2 razcepljeni kartici = 34
check("34 kartic (27 dogodkov + 6 sider − 1 razcep + 2 kartici)", items.length === 34, `=${items.length}`);
check("vsaka kartica nosi obstoječo entiteto registra", items.every((i) => ENTITIES.some((e) => e.id === i.entity.id)));
check("vsaka kartica ima ≥1 dokazni zapis", items.every((i) => i.exhibits.length > 0 || i.splitRecord != null));
check("dokazni zapisi obstajajo v semenu", items.every((i) => i.exhibits.every((ex) => bySlug.has(ex.slug))));

const anchors = items.filter((i) => i.isAnchor);
check("6 časovnih sider na niti", anchors.length === 6 && anchors.every((i) => i.entity.type === "time"));
const eraOk = items.every((i) => i.era === eraOfSortKey(i.sortKey) && ERA_ORDER.includes(i.era));
check("era izpeljana deterministično iz sortKey", eraOk);
const sortedOk = items.every((i, idx) => idx === 0 || items[idx - 1].sortKey <= i.sortKey);
check("karte urejene kronološko", sortedOk);

// Negotovost: SoftTime oznaka se NE pretvori — preveri, da izvirne
// besedane približnosti ostanejo približnosti (≈ je samo predpona UI).
const airlift = items.filter((i) => i.entity.id === "event:zracni-most-krasinec-1945");
const airliftEntity = ENTITIES.find((e) => e.id === "event:zracni-most-krasinec-1945") as EventRef;
check("zračni most: SoftTime ostaja »konec marca 1945« (brez pretvorbe v datum)", airliftEntity.time?.labelSi.startsWith("konec marca 1945") === true);
check("natančnost »approximate« samo za zračni most", items.filter((i) => i.precision === "approximate").every((i) => i.entity.id === "event:zracni-most-krasinec-1945"));
check("intervali ohranjeni (1918, 1880–1914, sidra 1914–1918/1941–1945)", items.filter((i) => i.precision === "interval").length === 4);

console.log("=".repeat(72));
console.log("3) P1-E1 — MVG-014 ↔ MVG-056 (razcep, ne spojitev)");
console.log("=".repeat(72));
check("razcep registriran samo za P1-E1", SPLIT_EVENTS.length === 1 && SPLIT_EVENTS[0].queueId === "P1-E1");
check("dve kartici razcepa (po zapisih)", airlift.length === 2, `=${airlift.length}`);
const splitA = airlift.find((i) => i.splitRecord?.slug === "evakuacija-1945");
const splitB = airlift.find((i) => i.splitRecord?.slug === "zracni-most-krasinec");
check("kartica A = MVG-014 evakuacija-1945", splitA != null);
check("kartica B = MVG-056 zracni-most-krasinec", splitB != null);
check("obe kartici nosita oznako možne istovetnosti", airlift.every((i) => i.possibleIdentity === "P1-E1"));
check("v kuratorski vrsti P1-E1 še odprt", ENTITY_QUEUE.some((q) => q.id === "P1-E1"));
check(
  "skupina razcepa = zapisi vprašanja P1-E1 (opomba imenuje prav par)",
  airlift.every((i) => {
    if (!i.splitGroup || !i.splitRecord) return false;
    const q = ENTITY_QUEUE.find((qq) => qq.id === "P1-E1");
    return (
      JSON.stringify([...i.splitGroup.slugs].sort()) === JSON.stringify([...(q?.slugs ?? [])].sort()) &&
      i.splitGroup.slugs.includes(i.splitRecord.slug)
    );
  })
);

console.log("=".repeat(72));
console.log("4) ZEMLJEVID SPOMINA — dokazane lege, brez geokodiranja");
console.log("=".repeat(72));
const memory = placeMemory(exhibits);
check("26 krajev spomina", memory.length === 26);
const resolved = memory.filter((p) => p.status === "resolved");
const unresolved = memory.filter((p) => p.status === "unresolved");
const within = memory.filter((p) => p.status === "within-village");
const region = memory.filter((p) => p.status === "region");
check("11 dokazanih + 10 brez + 4 zaselki + 1 pokrajina", resolved.length === 11 && unresolved.length === 10 && within.length === 4 && region.length === 1, `=${resolved.length}/${unresolved.length}/${within.length}/${region.length}`);
check("vsak resolved kraj ima lokacijo + nosilni zapis", resolved.every((p) => p.location && p.locationVia));
check("resolved: koordinata prihaja IZ zapisa (ista vrednost)", resolved.every((p) => {
  const via = bySlug.get(p.location!.viaSlug);
  return via != null && via.lat === p.location!.lat && via.lng === p.location!.lng;
}));
check("NOBEN unresolved/zaselki/pokrajina nima pike (ne geokodiramo)", [...unresolved, ...within, ...region].every((p) => p.location === null));
check("malenca brez pike (zapis sam zavrača risanje)", placeStatus(ENTITIES.find((e) => e.id === "place:malenca") as PlaceRef) === "unresolved");
check("Madroničev mlin brez pike (P3-E8)", placeStatus(ENTITIES.find((e) => e.id === "place:madronicev-mlin") as PlaceRef) === "unresolved");
check("Podzemelj brez pike (kučarjeva koordinata ni vas)", placeStatus(ENTITIES.find((e) => e.id === "place:podzemelj") as PlaceRef) === "unresolved");
check("Krasinec brez pike (otokova koordinata ni Krasinec)", placeStatus(ENTITIES.find((e) => e.id === "place:krasinec") as PlaceRef) === "unresolved");

console.log("=".repeat(72));
console.log("5) SPOMIN KRAJA — veze v registru");
console.log("=".repeat(72));
check("vsak kraj ima ≥1 dokazni zapis", memory.every((p) => p.exhibits.length > 0));
check("dogodki kraja izpeljani iz obstoječih vezi", memory.every((p) =>
  p.events.every((ev) => ev.evidence.some((e) => p.exhibits.some((ex) => ex.slug === e.slug)))
));
const kolpa = memory.find((p) => p.place.id === "place:kolpa")!;
check("Kolpa: lega točna (45.5688, 15.2988) prek MVG-006", kolpa.location?.lat === 45.5688 && kolpa.location?.lng === 15.2988 && kolpa.location.approx === false);
const griblje = memory.find((p) => p.place.id === "place:griblje")!;
check("Griblje: središče vasi prek MVG-001", griblje.location?.lat === 45.57246 && griblje.location?.lng === 15.29257);

console.log("=".repeat(72));
console.log("6) PLAST ZAPISOV — obstoječa koordinatna logika");
console.log("=".repeat(72));
const objects = objectLayer(exhibits);
check("33 zapisov s preverjeno lego (7. val: + MVG-097/098)", objects.length === 33);
check("vsak objekt ima lat/lng", objects.every((ex) => ex.lat != null && ex.lng != null));

console.log("=".repeat(72));
console.log("7) INTEGRITETA PODATKOVNEGA SEMENA (invariante TASK 38)");
console.log("=".repeat(72));
const sources = exhibits.reduce((n, ex) => n + ex.sources.length, 0);
check("527 vrstic virov", sources === 527, `=${sources}`);
const sourceIndexOk = exhibits.every((ex) =>
  ex.sources.every((_, i) => i >= 0) &&
  ENTITIES.every((e) => e.evidence.every((ev) => {
    if (ev.sourceIndex == null) return true;
    const ex = bySlug.get(ev.slug);
    return ex != null && ev.sourceIndex < ex.sources.length;
  }))
);
check("vsi sourceIndex vezi v mejah", sourceIndexOk);
const evidenceOk = ENTITIES.every((e) =>
  e.evidence.length > 0 && e.evidence.every((ev) => bySlug.has(ev.slug))
);
check("vsaka entiteta ima evidence na obstoječe zapise", evidenceOk);

console.log("=".repeat(72));
console.log(`REZULTAT: ${ok} ✓ / ${fail} ✗`);
console.log("=".repeat(72));
if (fail > 0) process.exit(1);
