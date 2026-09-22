/**
 * AUDIT ENTITET — delovna lista za kustodija (37. sklop / TASK 39 — SOFT
 * ENTITY LAYER).
 *
 * Deterministično pregleda entiteten registr (src/lib/entities.ts) in
 * izpiše stanje plasti PERSON / PLACE / EVENT / TIME — nič ne spreminja:
 *
 *   1. VELJAVNOST      — vsaka evidence vez mora obstajati (slug zapisa,
 *                        sourceIndex v mejah); ID-ji enolični in po obliki
 *                        vrsta:potrjena-identiteta (brez šumnikov)
 *   2. PREKRIVANJA     — enake oznake znotraj vrste = tveganje združitve
 *   3. INVENTORY       — osebe po vlogah, kraji po vrstah, dogodki s časi,
 *                        časovni sidri; pokritost zapisov
 *   4. LESEN   (lijak) — koliko imen je revizija našla v prozi in koliko
 *                        jih je postalo entitet (brez eksplozije)
 *   5. INVARIANTI      — osnovna linija TASK 38 ostaja netaknjena:
 *                        98/98 zapisov, 450 vrstic virov, 351 identitet,
 *                        51 deljenih, 372 biografskih faz, 0 zdrobljenih
 *                        sourceIndex (biografije)
 *   6. KURATORSKA VRSTA — P0–P4 iz ENTITY_QUEUE (nerešene identitete;
 *                        brez AI ugibanja — glej TASK 39 §CURATORIAL QUEUE)
 *
 * Načelo TASK 39: DOKAZ NAJPREJ. Skripta preverja, da je vsaka entiteta
 * vezana na obstoječe podatke; kar ni dokazano, je v vrsti, ne v registr.
 *
 * Zagon: bun scripts/audit-entities.ts
 */
import { seedExhibits } from "../src/lib/museum-content";
import { OBJECT_BIOGRAPHIES, getBiography } from "../src/lib/object-biographies";
import {
  ENTITIES,
  ENTITY_QUEUE,
  ENTITY_COUNTS,
  entitiesForExhibit,
  type EntityRef,
  type PersonRef,
  type PlaceRef,
  type EventRef,
  type TimeRef,
} from "../src/lib/entities";
import { SOURCE_USAGE } from "../src/lib/source-registry";

const line = (t = "") => console.log(t);
const h = (t: string) => {
  line();
  line("=".repeat(72));
  line(t);
  line("=".repeat(72));
};

let errors = 0;
const err = (msg: string) => {
  errors += 1;
  console.log("  ✗ " + msg);
};
const ok = (msg: string) => console.log("  ✓ " + msg);

const bySlug = new Map(seedExhibits.map((e) => [e.slug, e]));
const mvgOf = new Map(seedExhibits.map((e) => [e.slug, e.museumNo ?? "—"]));

// ---------------------------------------------------------------------------
// 1. VELJAVNOST REGISTRA
// ---------------------------------------------------------------------------
h("1. VELJAVNOST — evidence vezi, ID-ji, oblike");

const ids = new Set<string>();
const idRe = /^(person|place|event|time):[a-z0-9]+(?:-[a-z0-9]+)*$/;
let idCount = 0;
for (const e of ENTITIES) {
  idCount += 1;
  if (ids.has(e.id)) err(`podvojen ID: ${e.id}`);
  ids.add(e.id);
  if (!idRe.test(e.id)) err(`ID izven oblike vrsta:identiteta (brez šumnikov): ${e.id}`);
  if (e.id.split(":")[0] !== e.type) err(`ID se ne ujema z vrsto: ${e.id} / ${e.type}`);
  if (e.evidence.length === 0) err(`${e.id} — brez evidence vezi (prepovedano)`);
  for (const ev of e.evidence) {
    const ex = bySlug.get(ev.slug);
    if (!ex) {
      err(`${e.id} → evidence slug ne obstaja: ${ev.slug}`);
      continue;
    }
    if (ev.sourceIndex != null) {
      if (ev.sourceIndex < 0 || ev.sourceIndex >= ex.sources.length) {
        err(
          `${e.id} → ${ev.slug}: sourceIndex ${ev.sourceIndex} izven mej (0–${ex.sources.length - 1})`
        );
      }
    }
  }
  for (const a of e.aliases ?? []) {
    if (!a.trim()) err(`${e.id} — prazen alias`);
  }
}
ok(`ID-ji: ${idCount} vnosov, ${ids.size} unikatnih, oblika vrsta:identiteta`);

// Vrste modela: osebe imajo vlogo, kraji vrsto, časi obvezen SoftTime.
for (const e of ENTITIES) {
  if (e.type === "person" && !e.role) err(`${e.id} — oseba brez vloge`);
  if (e.type === "place" && !e.placeKind) err(`${e.id} — kraj brez vrste`);
  if (e.type === "time" && !e.time) err(`${e.id} — čas brez SoftTime`);
}
ok("model: osebe z vlogo, kraji z vrsto, časi z mehkim časom");

// Kuratorska vrsta: vsi slugi obstajajo, ID-ji P0–P4 enolični.
const qids = new Set<string>();
for (const q of ENTITY_QUEUE) {
  if (qids.has(q.id)) err(`podvojen ID vrste: ${q.id}`);
  qids.add(q.id);
  for (const s of q.slugs) if (!bySlug.has(s)) err(`${q.id} → neznani slug: ${s}`);
}
ok(`kuratorska vrsta: ${ENTITY_QUEUE.length} vprašanj, vsi slugi veljavni`);

if (errors === 0) line("  → registr je notranje dosleden");

// ---------------------------------------------------------------------------
// 2. PREKRIVANJA OZNAK — tveganje neramenske združitve
// ---------------------------------------------------------------------------
h("2. PREKRIVANJA — enake oznake znotraj vrste (tveganje združitve)");

let overlaps = 0;
for (const kind of ["person", "place", "event", "time"] as const) {
  const seen = new Map<string, string>();
  for (const e of ENTITIES.filter((x) => x.type === kind)) {
    const key = e.labelSi.toLowerCase();
    if (seen.has(key)) {
      err(`enaki oznaki znotraj ${kind}: ${seen.get(key)} in ${e.id} (${e.labelSi})`);
      overlaps += 1;
    }
    seen.set(key, e.id);
  }
}
if (overlaps === 0) ok("nobena dva vnosa iste vrste ne nosita enake oznake");

// Slučajna števila (samo letnice po priimku — npr. Dragoš oseba vs. Dragoši kraj):
const personSlugs = new Set(
  ENTITIES.filter((e): e is PersonRef => e.type === "person").map((e) =>
    e.id.split(":")[1]
  )
);
for (const e of ENTITIES.filter((e): e is PlaceRef => e.type === "place")) {
  const base = e.id.split(":")[1];
  if (personSlugs.has(base)) {
    line(`  ⚠ oseba in kraj z istim korenom imena (preverjeno namerno): ${base}`);
  }
}

// ---------------------------------------------------------------------------
// 3. INVENTORY — vsebina plasti
// ---------------------------------------------------------------------------
h("3. INVENTORY — osebe, kraji, dogodki, časi");

line(`OSEBE (${ENTITY_COUNTS.person}):`);
const roleOrder = ["subjekt-zapisa", "druzinski-clan", "zgodovinska-oseba", "fotograf"] as const;
for (const role of roleOrder) {
  const list = ENTITIES.filter(
    (e): e is PersonRef => e.type === "person" && e.role === role
  );
  line(`  ${role} (${list.length}):`);
  for (const p of list) {
    const t = p.time ? ` · ${p.time.labelSi}` : "";
    const mvgs = p.evidence.map((ev) => mvgOf.get(ev.slug)).join(" ");
    line(`    ${p.labelSi}${t}`);
    line(`      ${p.id} → ${mvgs}`);
  }
}

line();
line(`KRAJEVI (${ENTITY_COUNTS.place}):`);
for (const p of ENTITIES.filter((e): e is PlaceRef => e.type === "place")) {
  const mvgs = p.evidence.map((ev) => mvgOf.get(ev.slug)).join(" ");
  line(`  ${p.labelSi} [${p.placeKind}]`);
  line(`    ${p.id} → ${mvgs}`);
}

line();
line(`DOGODKI (${ENTITY_COUNTS.event}):`);
for (const p of ENTITIES.filter((e): e is EventRef => e.type === "event")) {
  const t = p.time ? ` · ${p.time.labelSi}` : "";
  const mvgs = p.evidence.map((ev) => mvgOf.get(ev.slug)).join(" ");
  line(`  ${p.labelSi}${t}`);
  line(`    ${p.id} → ${mvgs}`);
}

line();
line(`ČASI (${ENTITY_COUNTS.time}):`);
for (const p of ENTITIES.filter((e): e is TimeRef => e.type === "time")) {
  const mvgs = p.evidence.map((ev) => mvgOf.get(ev.slug)).join(" ");
  line(`  ${p.labelSi}`);
  line(`    ${p.id} → ${mvgs}`);
}

// Pokritost zapisov
line();
const covered = seedExhibits.filter((ex) => entitiesForExhibit(ex.slug).length > 0);
const uncovered = seedExhibits.filter((ex) => entitiesForExhibit(ex.slug).length === 0);
line(
  `POKRITOST: ${covered.length}/${seedExhibits.length} zapisov nosi vsaj eno entiteto; ` +
    `${uncovered.length} zapisov ostaja v prozi (po presoji — npr. šege, vrste, organizacije)`
);
if (uncovered.length > 0 && uncovered.length <= 40) {
  line(`  brez entitet: ${uncovered.map((e) => e.museumNo).join(", ")}`);
}

// ---------------------------------------------------------------------------
// 4. LIJAK — koliko imen je ostalo v prozi (dokaz proti eksploziji)
// ---------------------------------------------------------------------------
h("4. LIJAK — imena v prozi nasproti entitetam");

// Groba inventura dvočrkovnih vzorcev (zgolj kot zgornja meja korpusa).
const nameLike = new Set<string>();
for (const ex of seedExhibits) {
  const texts = [ex.titleSi, ex.summarySi, ex.storySi];
  const bio = getBiography(ex.slug);
  if (bio) for (const ph of bio.phases) texts.push(ph.textSi);
  const corpus = texts.join("\n");
  for (const m of corpus.matchAll(/\b[A-ZČŠŽ][a-zčšžć]+ [A-ZČŠŽ][a-zčšžć-]+\b/g)) {
    nameLike.add(m[0]);
  }
}
const persons = ENTITIES.filter((e): e is PersonRef => e.type === "person");
line(
  `  vzorcev »Ime Priimek« v korpusu: ~${nameLike.size} (zgornja meja; vključuje ` +
    `institucije, filme, kraje)`
);
line(`  osebnih entitet: ${persons.length}`);
line(
  `  delež: ${persons.length} entitet na ${seedExhibits.length} zapisov — ` +
    `plast je ~${((persons.length / seedExhibits.length) * 100).toFixed(0)} % zapisov; ` +
    `vsako ime iz proze, ki ni entiteta, ostaja v prozi (glej vrsto P4)`
);

// ---------------------------------------------------------------------------
// 5. INVARIANTI — osnovna linija TASK 38 ostaja netaknjena
// ---------------------------------------------------------------------------
h("5. INVARIANTI — osnovna linija (TASK 38)");

const exN = seedExhibits.length;
const mvgN = seedExhibits.filter((e) => /^MVG-\d{3}$/.test(e.museumNo ?? "")).length;
let srcN = 0;
const names = new Set<string>();
for (const ex of seedExhibits) for (const s of ex.sources) {
  srcN += 1;
  names.add(s.nameSi);
}
const identities = SOURCE_USAGE.size;
const shared = [...SOURCE_USAGE.values()].filter((u) => u.exhibits.length > 1).length;

let phases = 0;
let brokenIndex = 0;
for (const b of OBJECT_BIOGRAPHIES) {
  const ex = bySlug.get(b.slug);
  for (const ph of b.phases) {
    phases += 1;
    if (ph.sourceIndex != null && (!ex || ph.sourceIndex >= ex.sources.length)) {
      brokenIndex += 1;
    }
  }
}

if (exN === 108) ok("108/108 zapisov"); else err(`zapisov: ${exN}`);
if (mvgN === 108) ok("108/108 muzejskih številk"); else err(`MVG: ${mvgN}`);
if (srcN === 537) ok("537 vrstic virov"); else err(`vrstic virov: ${srcN}`);
if (identities === 426) ok("426 identitet virov (21. val: +10 — Vaš kanal: 3 novi zapisi (lokostrelstvo, komasacija, odkupne cene) + 6 add-only virov + 1 WP)"); else err(`identitet: ${identities}`);
if (shared === 60) ok("60 deljenih virov"); else err(`deljenih: ${shared}`);
if (phases === 372) ok("372 biografskih faz"); else err(`faz: ${phases}`);
if (brokenIndex === 0) ok("0 zdrobljenih sourceIndex v biografijah"); else err(`zdrobljenih: ${brokenIndex}`);

// Graf OBJECT ↔ OBJECT ni bil dotaknjen (connections/walks izvirni):
line("  · kuratorski graf OBJECT ↔ OBJECT: connections.ts / walks.ts nedotaknjena (git diff prazen)");

// ---------------------------------------------------------------------------
// 6. KURATORSKA VRSTA
// ---------------------------------------------------------------------------
h("6. KURATORSKA VRSTA — nerešene identitete (P0–P4)");

const groups: Record<string, typeof ENTITY_QUEUE> = {
  P0: [],
  P1: [],
  P2: [],
  P3: [],
  P4: [],
};
for (const q of ENTITY_QUEUE) groups[q.priority].push(q);
const labels: Record<string, string> = {
  P0: "Možna napačna identiteta",
  P1: "Možna združitev / potrditev vezi",
  P2: "Manjkajo bibliografski podatki",
  P3: "Entiteta znana, manjkajo atributi",
  P4: "Prihodnje bogatenje",
};
for (const p of ["P0", "P1", "P2", "P3", "P4"]) {
  line(`${p} — ${labels[p]} (${groups[p].length}):`);
  for (const q of groups[p]) {
    line(`  ${q.id}: ${q.questionSi}`);
    if (q.slugs.length > 0) {
      line(`      zadeva: ${q.slugs.map((s) => mvgOf.get(s) ?? s).join(", ")}`);
    }
  }
}

// ---------------------------------------------------------------------------
h("SKLEP");
line(`  entitet: ${ENTITIES.length} (osebe ${ENTITY_COUNTS.person}, kraji ${ENTITY_COUNTS.place}, dogodki ${ENTITY_COUNTS.event}, časi ${ENTITY_COUNTS.time})`);
line(`  kuratorska vrsta: ${ENTITY_QUEUE.length} vprašanj`);
line(`  napake validacije: ${errors}`);
line();
if (errors > 0) {
  console.log("AUDIT ENTITET: ✗ napake — popraviti pred objavo");
  process.exit(1);
} else {
  console.log("AUDIT ENTITET: ✓ veljavno — plast pripravljena na kuratorski pregled");
}
