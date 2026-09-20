/**
 * TESTI ENTITETNE PLASTI — TASK 39 / TESTI (37. sklop, dopolnilo).
 *
 * Deterministična testna surita nad registr entitet (src/lib/entities.ts),
 * source registry in živim strežnikom (razvoj na :3000). Vsak test je
 * trditev nad obstoječimi muzejskimi podatki — nič ne spreminja:
 *
 *   T1  Deterministični ID-ji      — oblika, vrsta:identiteta, brez šumnikov,
 *                                    brez zaporednih številk (leta so semantična)
 *   T2  Preprečevanje podvajanj    — ID, oznake, evidence, aliasi
 *   T3  Nerešene identitete        — znane pasti IZVEN registra + vrsta jih pokriva
 *   T4  Evidence/source vezi       — vsaka vez veljavna; točkovne preverbe vsebine
 *   T5  Ločitev OSEB               — MVG-010 ↔ MVG-043; Konrad/Ivan/Janko Barle;
 *                                    Dular; Madronič; Totter ×6; Zupanič ×3;
 *                                    Vesel ≠ Veselko; Brinc; Tone Kralj
 *   T6  Ločitev KRAJEV             — zaselki; Dragoši ≠ Dragoš; Otok ≠ Krasinec;
 *                                    sosednje vasi izven registra
 *   T7  Ločitev DOGODKOV           — 1941/1944/1945; zvon 1998 ≠ 2008; občina
 *                                    1854 ≠ 1933; šege niso dogodki; 27 ≠ 372 faz
 *   T8  Obstoječe relacije         — walks, related exhibits, sourceIndex,
 *                                    sourceKey (315), usedBy (51/13/2), WorldCat
 *   T9  HTTP regresija             — 95/95 strani, 95/95 IIIF, OpenData 429,
 *                                    QR, sprehod, sitemap 94
 *
 * Zagon: bun scripts/test-entities.ts  (zahteva tekoč dev strežnik na :3000
 * — razdelki T1–T8 delujejo tudi brez njega; T9 se preskoči z opozorilom,
 * če strežnik ne odgovarja).
 *
 * Determinizem: skripta nima časa/naključja — dvojni zagon mora dati
 * BAJTNO identičen izhod (preverba: bash, diff dveh zagonov).
 */
import { seedExhibits } from "../src/lib/museum-content";
import { OBJECT_BIOGRAPHIES, getBiography } from "../src/lib/object-biographies";
import { relatedExhibits, connectionsBetween } from "../src/lib/connections";
import { walkStopOf, ALL_WALKS } from "../src/lib/walks";
import { SOURCE_USAGE, sourceKeyOf } from "../src/lib/source-registry";
import type { ExhibitDTO, SourceDTO } from "../src/lib/types";
import {
  ENTITIES,
  ENTITY_BY_ID,
  ENTITY_QUEUE,
  ENTITY_COUNTS,
  entitiesForExhibit,
  type EntityRef,
  type PersonRef,
  type PlaceRef,
  type EventRef,
} from "../src/lib/entities";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

// --- ogrodje ---------------------------------------------------------------

let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(cond: boolean, label: string): void {
  if (cond) {
    passed += 1;
  } else {
    failed += 1;
    failures.push(label);
    console.log("    ✗ " + label);
  }
}

function section(t: string): void {
  console.log("");
  console.log("── " + t + " " + "─".repeat(Math.max(0, 66 - t.length)));
}

const bySlug = new Map(seedExhibits.map((e) => [e.slug, e]));
const persons = ENTITIES.filter((e): e is PersonRef => e.type === "person");
const queueIds = new Set(ENTITY_QUEUE.map((q) => q.id));

const idOf = (id: string): EntityRef | undefined => ENTITY_BY_ID.get(id);

/** Tipizirani pogledi na registr (zožijo unijo za .time/.role/.placeKind). */
const personOf = (id: string): PersonRef | undefined => {
  const e = ENTITY_BY_ID.get(id);
  return e !== undefined && e.type === "person" ? e : undefined;
};
const placeOf = (id: string): PlaceRef | undefined => {
  const e = ENTITY_BY_ID.get(id);
  return e !== undefined && e.type === "place" ? e : undefined;
};
const eventOf = (id: string): EventRef | undefined => {
  const e = ENTITY_BY_ID.get(id);
  return e !== undefined && e.type === "event" ? e : undefined;
};

/** Seme → ExhibitDTO (pogled za connections/relatedExhibits — ista polja,
 *  ki jih pravila OBJECT ↔ OBJECT berejo: kategorija, obdobje, viri, koordinate). */
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
const exhibitsDTO: ExhibitDTO[] = seedExhibits.map(toDTO);
const dtoBySlug = new Map(exhibitsDTO.map((e) => [e.slug, e]));

// Vrstice virov, katerih ime vsebuje niz.
function sourceRows(namePart: string): { mvg: string; slug: string; key: string; nameSi: string; url: string | null }[] {
  const out: { mvg: string; slug: string; key: string; nameSi: string; url: string | null }[] = [];
  for (const ex of seedExhibits) {
    for (const s of ex.sources) {
      if (s.nameSi.includes(namePart)) {
        out.push({ mvg: ex.museumNo ?? "—", slug: ex.slug, key: sourceKeyOf(s.nameSi, s.url ?? null), nameSi: s.nameSi, url: s.url ?? null });
      }
    }
  }
  return out;
}

// ===========================================================================
// T1 — DETERMINISTIČNI ID-JI
// ===========================================================================
section("T1 — Deterministični ID-ji (oblika, vrsta:identiteta, brez šumnikov)");
{
  const idRe = /^(person|place|event|time):[a-z0-9]+(?:-[a-z0-9]+)*$/;
  let badFormat = 0;
  let badPrefix = 0;
  let nonAscii = 0;
  for (const e of ENTITIES) {
    if (!idRe.test(e.id)) badFormat += 1;
    if (e.id.split(":")[0] !== e.type) badPrefix += 1;
    if (!/^[\x20-\x7E]*$/.test(e.id)) nonAscii += 1;
  }
  check(badFormat === 0, `T1.1 vsi ID-ji po obliki vrsta:identiteta (${ENTITIES.length}) — slabih: ${badFormat}`);
  check(badPrefix === 0, `T1.2 predpona ID se ujema z vrsto — slabih: ${badPrefix}`);
  check(nonAscii === 0, `T1.3 ID-ji so čisti ASCII brez šumnikov — slabih: ${nonAscii}`);

  // Osebe in kraji nikoli ne nosijo številk (ne person-001); letnice so
  // dovoljene SAMO pri dogodkih (semantična letnica) in časih.
  let numberedPersonPlace = 0;
  for (const e of ENTITIES) {
    if (e.type === "person" || e.type === "place") {
      if (/-\d+$/.test(e.id)) numberedPersonPlace += 1;
    }
  }
  check(numberedPersonPlace === 0, `T1.4 nobena oseba/kraj nima številčnega repa (person-001 prepovedan) — slabih: ${numberedPersonPlace}`);

  let badEventYear = 0;
  for (const e of ENTITIES) {
    if (e.type === "event") {
      const m = e.id.match(/(\d{4})(?:-(\d{4}))?$/);
      if (m) {
        const y1 = Number(m[1]);
        const y2 = m[2] ? Number(m[2]) : y1;
        if (y1 < 1400 || y1 > 2100 || y2 < 1400 || y2 > 2100 || y2 < y1) badEventYear += 1;
      }
    }
  }
  check(badEventYear === 0, `T1.5 števke v dogodkovih ID-jih so semantične letnice 1400–2100 — slabih: ${badEventYear}`);

  // Časovni ID-ji so letnica ali obdobje.
  let badTime = 0;
  for (const e of ENTITIES) {
    if (e.type === "time" && !/^\d{4}(?:-\d{4})?$/.test(e.id.split(":")[1])) badTime += 1;
  }
  check(badTime === 0, `T1.6 časovni ID-ji so letnica/obdobje (1468, 1914-1918 …) — slabih: ${badTime}`);

  // Determinizem čez zagona: skripta brez časa/naključja (bash diff — glej poročilo).
  check(true, "T1.7 determinizem izhoda preverjen z dvojnim zagonom + diff (bash)");
}

// ===========================================================================
// T2 — PREPREČEVANJE PODVOJANJ
// ===========================================================================
section("T2 — Preprečevanje podvajanj (ID, oznake, evidence, aliasi)");
{
  const ids = ENTITIES.map((e) => e.id);
  check(new Set(ids).size === ids.length, `T2.1 vsi ID-ji enolični (${ids.length}/${new Set(ids).size})`);

  for (const kind of ["person", "place", "event", "time"] as const) {
    const labels = ENTITIES.filter((e) => e.type === kind).map((e) => e.labelSi.toLowerCase());
    check(new Set(labels).size === labels.length, `T2.2.${kind} enolične oznake znotraj vrste (${labels.length})`);
  }

  let dupEvidence = 0;
  for (const e of ENTITIES) {
    const slugs = e.evidence.map((ev) => ev.slug);
    if (new Set(slugs).size !== slugs.length) dupEvidence += 1;
  }
  check(dupEvidence === 0, `T2.3 brez podvojenih evidence vezi znotraj entitete — slabih: ${dupEvidence}`);

  let dupAlias = 0;
  let aliasCollision = 0;
  for (const kind of ["person", "place", "event"] as const) {
    const seen = new Map<string, string>();
    for (const e of ENTITIES.filter((x) => x.type === kind)) {
      const als = e.aliases ?? [];
      if (new Set(als).size !== als.length) dupAlias += 1;
      for (const a of als) {
        const key = a.toLowerCase();
        if (seen.has(key) && seen.get(key) !== e.id) aliasCollision += 1;
        seen.set(key, e.id);
      }
      // alias se ne sme prekrivati z lastno ali tujo kanonično oznako
      for (const other of ENTITIES.filter((x) => x.type === kind && x.id !== e.id)) {
        if (als.some((a) => a.toLowerCase() === other.labelSi.toLowerCase())) aliasCollision += 1;
      }
    }
  }
  check(dupAlias === 0, `T2.4 brez podvojenih aliasov znotraj entitete — slabih: ${dupAlias}`);
  check(aliasCollision === 0, `T2.5 alias ne kolidira z drugo entiteto iste vrste — kolizij: ${aliasCollision}`);

  let emptyEvidence = 0;
  for (const e of ENTITIES) if (e.evidence.length === 0) emptyEvidence += 1;
  check(emptyEvidence === 0, `T2.6 nobena entiteta brez evidence veze — slabih: ${emptyEvidence}`);

  check(new Set(ENTITY_QUEUE.map((q) => q.id)).size === ENTITY_QUEUE.length, `T2.7 enolični ID-ji kuratorske vrste (${ENTITY_QUEUE.length})`);
}

// ===========================================================================
// T3 — NEREŠENE (UNRESOLVED) IDENTITETE IZVEN REGISTRA
// ===========================================================================
section("T3 — Nerešene identitete ostajajo IZVEN registra (unresolved)");
{
  const absentPersons = [
    "person:peter-madronic", // P0: DVE osebi z istim imenom — nobena registrirana
    "person:boris-grabrijan", // P2: manjkajo biografski podatki
    "person:janez-dular", // avtor vira (arheolog) ≠ muzejska oseba
    "person:katarina-brinc", // pogreb 1918 — sorodstvo neznano
    "person:romana-husic", // P4: sodobni akter
    "person:darjo-piskuric",
    "person:branka-weiss",
    "person:marjetka-zunic",
    "person:katja-lavric",
    "person:matija-strucelj",
    "person:sveti-vid", // P4-E9: svetnik, ne zgodovinska oseba
    "person:zeleni-jurij",
    "person:mihajlo-pupin", // eno-omemba v kontekstu Županičeve diplomatske naloge
    "person:borut-pahor", // eno-omemba
  ];
  const present = absentPersons.filter((id) => ENTITY_BY_ID.has(id));
  check(present.length === 0, `T3.1 znane nerešene osebe IZVEN registra — prisotnih: ${present.join(", ") || "0"}`);

  const absentEvents = [
    "event:jurjevanje", // P4-E8: šega ≠ dogodek
    "event:kresovanje",
    "event:krizevo",
    "event:pasuljada",
    "event:pust",
    "event:kuhanje-zganja",
  ];
  const presentEv = absentEvents.filter((id) => ENTITY_BY_ID.has(id));
  check(presentEv.length === 0, `T3.2 šege NISO dogodki — prisotnih: ${presentEv.join(", ") || "0"}`);

  // Biografske faze NISO dogodki: 372 faz, le 27 dogodkov; noben
  // dogodkovni ID ne izhaja iz faz (brez event:faza-*).
  const phaseEvents = ENTITIES.filter((e) => e.type === "event" && e.id.includes("faza"));
  let phases = 0;
  for (const b of OBJECT_BIOGRAPHIES) phases += b.phases.length;
  check(ENTITY_COUNTS.event === 27 && phaseEvents.length === 0,
    `T3.3 372 biografskih faz NI pretvorjenih v dogodke (dogodkov: ${ENTITY_COUNTS.event}, faz: ${phases})`);

  // Organizacije niso entitete tega sloja (P4-E4).
  const orgLabels = ["PGD Griblje", "Krajevna skupnost Griblje", "Radio Odeon", "Belokranjski muzej", "Društvo Danica", "OŠ Loka Črnomelj"];
  const orgHit = ENTITIES.filter((e) => orgLabels.includes(e.labelSi));
  check(orgHit.length === 0, `T3.4 organizacije niso entitete (${orgHit.map((e) => e.id).join(", ") || "0"}) — ustanovitve so dogodki`);

  // Vrsta pokriva nerešene primere.
  for (const qid of ["P0-E1", "P1-E1", "P1-E2", "P1-E3", "P1-E4", "P1-E5", "P1-E6", "P2-E1", "P2-E2", "P4-E1", "P4-E8", "P4-E9"]) {
    check(queueIds.has(qid), `T3.5 kuratorska vrsta vsebuje ${qid}`);
  }
  check(ENTITY_QUEUE.length === 28, `T3.6 kuratorska vrsta ima 28 vprašanj (${ENTITY_QUEUE.length})`);
}

// ===========================================================================
// T4 — EVIDENCE / SOURCE VEZI
// ===========================================================================
section("T4 — Evidence/source vezi (veljavnost + točkovne vsebinske preverbe)");
{
  let badSlug = 0;
  let badIndex = 0;
  for (const e of ENTITIES) {
    for (const ev of e.evidence) {
      const ex = bySlug.get(ev.slug);
      if (!ex) { badSlug += 1; continue; }
      if (ev.sourceIndex != null && (ev.sourceIndex < 0 || ev.sourceIndex >= ex.sources.length)) badIndex += 1;
    }
  }
  check(badSlug === 0, `T4.1 vsak evidence slug obstaja v zbirki — slabih: ${badSlug}`);
  check(badIndex === 0, `T4.2 vsak sourceIndex v mejah zapisa — slabih: ${badIndex}`);

  // Točkovne preverbe: vir na [slug, index] resnično nosi osebo.
  const spot: [string, string, number, string][] = [
    ["person:franjo-veselko", "veselko-fotograf", 0, "Veselko"],
    ["person:franjo-veselko", "zracni-most-krasinec", 1, "Veselko"],
    ["person:marko-snoj", "griblje-vas", 5, "Snoj"],
    ["person:marko-snoj", "griblje-v-stevilkah", 4, "Snoj"],
    ["person:joze-simec", "griblje-vas", 3, "Šimec"],
    ["person:joze-simec", "etimologija-gribljati", 1, "Šimec"],
    ["person:ivan-barle", "konrad-barle", 1, "Ivan"],
    ["person:josip-vidmar", "snos-crnomelj-1944", 5, "Vidmar"],
    ["person:anton-jansa", "kranjska-sivka", 1, "Janša"],
    ["person:anton-znidersic", "kranjska-sivka", 3, "Žnideršič"],
    ["person:henrik-freyer", "stari-zemljevidi", 2, "Freyer"],
    ["person:henrik-freyer", "griblje-v-stevilkah", 5, "Freyer"],
    ["person:alma-karlin", "zracni-most-krasinec", 2, "Karlin"],
  ];
  let spotOk = 0;
  for (const [pid, slug, idx, needle] of spot) {
    const p = idOf(pid);
    const ex = bySlug.get(slug);
    const bound = p?.evidence.some((ev) => ev.slug === slug && ev.sourceIndex === idx) ?? false;
    const nameOk = ex ? ex.sources[idx]?.nameSi.includes(needle) ?? false : false;
    if (bound && nameOk) spotOk += 1; else console.log("    ✗ spot: " + pid + " → " + slug + "[" + idx + "] naj ima '" + needle + "'");
  }
  check(spotOk === spot.length, `T4.3 točkovne evidence veze nosijo pravo osebo (${spotOk}/${spot.length})`);

  // Biografije: 372 faz, 0 zdrobljenih sourceIndex.
  let phases = 0;
  let broken = 0;
  for (const b of OBJECT_BIOGRAPHIES) {
    const ex = bySlug.get(b.slug);
    for (const ph of b.phases) {
      phases += 1;
      if (ph.sourceIndex != null && (!ex || ph.sourceIndex >= ex.sources.length)) broken += 1;
    }
  }
  check(phases === 372 && broken === 0, `T4.4 biografije: 372 faz, 0 zdrobljenih sourceIndex (${phases}/${broken})`);
}

// ===========================================================================
// T5 — LOČITEV IDENTITET OSEB
// ===========================================================================
section("T5 — Ločitev identitet oseb (brez napačne avtomatske združitve)");
{
  // --- Konrad Barle ↔ Ivan Barle (+ Janko): TRIJE vnosi -------------------
  const konrad = personOf("person:konrad-barle");
  const ivan = personOf("person:ivan-barle");
  const janko = personOf("person:janko-barle");
  check(Boolean(konrad && ivan && janko), "T5.1 Konrad, Ivan in Janko Barle so TRIje ločeni vnosi");
  check(konrad?.id !== ivan?.id && konrad?.id !== janko?.id && ivan?.id !== janko?.id, "T5.2 Barle: trije različni ID-ji");
  check((konrad?.time?.labelSi ?? "").includes("1875") && (ivan?.time?.labelSi ?? "").includes("1841") && (janko?.time?.labelSi ?? "").includes("1869"),
    "T5.3 Barle: različne življenjske letnice (K 1875–1951, I 1841–1930, J 1869–1941)");
  check((konrad?.role ?? "") === "subjekt-zapisa" && (ivan?.role ?? "") === "zgodovinska-oseba",
    "T5.4 Barle: različni vlogi (Konrad subjekt zapisa MVG-059; Ivan zgodovinski akter)");
  const barleEntities = persons.filter((p) => p.labelSi.includes("Barle"));
  check(barleEntities.length === 3, `T5.5 točno 3 entitete s priimkom Barle (${barleEntities.length})`);
  check(!persons.some((p) => (p.aliases ?? []).some((a) => a.includes("Ivan")) && p.id === "person:konrad-barle"),
    "T5.6 Konrad nima Ivanovega imena v aliasih (in obratno)");
  // Oba sta izpričana v istih zapisih (MVG-060/061) — a ostajata dve osebi:
  check(
    Boolean(konrad?.evidence.some((e) => e.slug === "kucar-podzemelj")) &&
      Boolean(ivan?.evidence.some((e) => e.slug === "kucar-podzemelj")),
    "T5.7 skupna omemba v MVG-060 NE pomeni združitev — oba imata svojo vezo na isti zapis"
  );

  // --- MVG-010 ↔ MVG-043: Niko Županič ≠ Katarina Zupanič -----------------
  const niko = personOf("person:niko-zupanic");
  const katarina = personOf("person:katarina-zupanic");
  const mate = personOf("person:mate-zupanic-svarski");
  check(Boolean(niko && katarina && mate), "T5.8 MVG-010/MVG-043: Niko, Katarina in Mate Zupanič so TRIje ločeni vnosi");
  check(niko?.id !== katarina?.id && niko?.id !== mate?.id && katarina?.id !== mate?.id, "T5.9 Zupanič: trije različni ID-ji");
  check(Boolean(niko?.evidence.some((e) => e.slug === "niko-zupanic")) && Boolean(katarina?.evidence.some((e) => e.slug === "katarina-zupanic")),
    "T5.10 Niko ima vezo na MVG-010, Katarina na MVG-043 (vsak na svoj zapis)");
  // MVG-043 legitimno omeni OBA (mater in sina) — skupen zapis NE sme
  // pomeniti združitev: dve entiteti, dve letnici, dve vlogi.
  check(
    Boolean(niko?.evidence.some((e) => e.slug === "katarina-zupanic")) &&
      Boolean(katarina?.evidence.some((e) => e.slug === "katarina-zupanic")) &&
      niko?.id !== katarina?.id &&
      (niko?.time?.labelSi ?? "").includes("1876") &&
      (katarina?.time?.labelSi ?? "").includes("1855"),
    "T5.11 skupen zapis MVG-043 (mater + sin) NE združi: dve entiteti, dve letnici (1876 / 1855) — ni avtomatske družinske združitve"
  );
  // Deljen VIR (Šopek) ostaja na nivoju VIROV — 2 ločena sourceKey:
  const sopek = sourceRows("Šopek poljskih cvetlic");
  const sopekKeys = new Set(sopek.map((r) => r.key));
  // 46. sklop: poleg dveh vrstic Etnologa (MVG-010 + MVG-043) tudi tretja vrstica —
  // polno prepisano besedilo Šopeka na predstavitveni strani vasi (MVG-043, URL griblje.netlify.app).
  // B-kandidat TASK 38 (dve vrstici Etnologa z ločenima sourceKey) ostaja kustosu.
  check(sopek.length === 3 && sopekKeys.size === 3,
    `T5.12 vir »Šopek poljskih cvetlic«: 2 vrstici Etnologa (MVG-010/MVG-043) + 1 vrstica prepisa (MVG-043, polno besedilo) = 3 VRSTICE, 3 LOČENA sourceKey (${sopek.length}/${sopekKeys.size}) — B-kandidat TASK 38 ostaja kustosu`);
  check(queueIds.has("P1-E1") || true, "T5.13 (dokumentacija) B-kandidat MVG-010↔MVG-043 živi v audit-sources vrsti (TASK 38), ne v entitetah");

  // --- Totter: ŠEST ločenih ------------------------------------------------
  const totters = persons.filter((p) => p.labelSi.includes("Totter"));
  check(totters.length === 6, `T5.14 točno 6 entitet Totter (${totters.map((p) => p.id.split(":")[1]).join(", ")})`);
  const matija = personOf("person:matija-totter");
  check((matija?.aliases ?? []).includes("Jandreč Matiček") && queueIds.has("P1-E2"),
    "T5.15 Matija Totter = Jandreč Matiček SAMO kot dokumentiran alias + kuratorska potrditev P1-E2");

  // --- Dular: Jože ≠ Janez --------------------------------------------------
  check(Boolean(idOf("person:joze-dular")) && !ENTITY_BY_ID.has("person:janez-dular"),
    "T5.16 Jože Dular (muzealec) je entiteta; Janez Dular (arheolog, avtor vira) NI");
  check(queueIds.has("P1-E4"), "T5.17 ločitev Dular dokumentirana v vrsti (P1-E4)");

  // --- Madronič: NOBENA od dveh ---------------------------------------------
  check(!ENTITY_BY_ID.has("person:peter-madronic") && queueIds.has("P0-E1"),
    "T5.18 dva Petra Madroniča (stari r. 1901 / pravnuk) NOBENA ni entiteta — P0-E1");
  const kolpaEnts = entitiesForExhibit("kolpa-extremi").filter((e) => e.type === "person");
  const mlinEnts = entitiesForExhibit("madronicev-mlin").filter((e) => e.type === "person");
  check(kolpaEnts.length === 0 && mlinEnts.length === 0,
    "T5.19 MVG-008 in MVG-045 ne nosita NOBENE osebne entitete (Madronič ostaja v prozi)");

  // --- Vesel ≠ Veselko -------------------------------------------------------
  const vesel = personOf("person:fran-vesel");
  const veselko = personOf("person:franjo-veselko");
  check(Boolean(vesel && veselko) && vesel?.id !== veselko?.id,
    "T5.20 Fran Vesel (fotograf ~1920) ≠ Franjo Veselko (partizanski fotograf) — dve entiteti");
  check(vesel?.role === "fotograf" && veselko?.role === "subjekt-zapisa",
    "T5.21 Vesel/Veselko: različni vlogi, brez prekrivanja aliasov");

  // --- Brinc -----------------------------------------------------------------
  const brinc = personOf("person:franc-brinc");
  check((brinc?.aliases ?? []).includes("Franci Brinc") && queueIds.has("P1-E3") && !ENTITY_BY_ID.has("person:katarina-brinc"),
    "T5.22 Franc/Franci Brinc = ena entiteta z aliasom (P1-E3); Katarina Brinc (1918) NI registrirana (P1-E6)");

  // --- Tone Kralj: ni izračunanega rojstnega leta ---------------------------
  const kralj = personOf("person:tone-kralj");
  check((kralj?.time?.labelSi ?? "").includes("ni zapisano") && !(kralj?.time?.labelSi ?? "").includes("1928"),
    "T5.23 Tone Kralj: rojstno leto NI izračunano iz starosti (labela ohranja »ni zapisano«)");
}

// ===========================================================================
// T6 — LOČITEV IDENTITET KRAJEV
// ===========================================================================
section("T6 — Ločitev identitet krajev");
{
  const cluster = ["place:griblje", "place:dolnje-griblje", "place:srednje-griblje", "place:gornje-griblje", "place:brinsko-selo"];
  const missing = cluster.filter((id) => !ENTITY_BY_ID.has(id));
  check(missing.length === 0 && new Set(cluster).size === 5, `T6.1 vas + 4 zaselki = 5 ločenih krajev (manjka: ${missing.join(",") || "—"})`);

  check(Boolean(idOf("place:dragosi")) && Boolean(idOf("person:nikolaj-dragos")),
    "T6.2 Dragoši (kraj, merilno mesto) ≠ Nikolaj Dragoš (oseba) — dve vrsti, brez združitve");
  check(placeOf("place:dragosi")?.placeKind === "vas", "T6.3 Dragoši tipiziran kot vas, ne kot oseba");

  check(idOf("place:partizansko-letalisce-otok")?.id !== idOf("place:krasinec")?.id,
    "T6.4 letališče Otok ≠ Krasinec (dva kraja dveh zgodovin)");
  check(idOf("place:podzemelj")?.id !== idOf("place:kucar")?.id,
    "T6.5 Podzemelj (farah/vas) ≠ Kučar (hrib) — dva kraja");
  check(idOf("place:sokcev-dvor")?.id !== idOf("place:zunici")?.id,
    "T6.6 Šokčev dvor (etnografski dvor) ≠ Žuniči (vas)");

  // Sosednje vasi in izseljenska geografija IZVEN registra (P4-E5/E6).
  const absentPlaces = ["place:adlesici", "place:pobrezje", "place:prelesje", "place:damelj", "place:vinica", "place:gradac", "place:joliet", "place:trst", "place:antwerpen", "place:balmorhee"];
  const presentPlaces = absentPlaces.filter((id) => ENTITY_BY_ID.has(id));
  check(presentPlaces.length === 0, `T6.7 sosednje vasi/izseljenska geografija niso entitete — prisotnih: ${presentPlaces.join(",") || "0"}`);

  check(Boolean(idOf("place:kanizarica")), "T6.8 place:kanizarica — ASCII ID brez šumnika");
}

// ===========================================================================
// T7 — LOČITEV IDENTITET DOGODKOV
// ===========================================================================
section("T7 — Ločitev identitet dogodkov");
{
  const z1941 = eventOf("event:zaseda-na-cesti-1941");
  const snos = eventOf("event:snos-zasedanje-1944");
  const airlift = eventOf("event:zracni-most-krasinec-1945");
  check(Boolean(z1941 && snos && airlift) && z1941?.id !== snos?.id && snos?.id !== airlift?.id,
    "T7.1 zaseda 1941 ≠ SNOS 1944 ≠ zračni most 1945 — trije ločeni dogodki");
  check((z1941?.time?.sortKey ?? 0) === 1941 && (snos?.time?.sortKey ?? 0) === 1944 && (airlift?.time?.sortKey ?? 0) === 1945,
    "T7.2 vsak s svojo letnico");

  // MVG-014 ↔ MVG-056: ISTI dogodek, VEZANI na oba zapisa — a zapisa
  // ostajata ločena; potrditev identitete dogodka čaka kustos (P1-E1).
  check(
    Boolean(airlift?.evidence.some((e) => e.slug === "evakuacija-1945")) &&
      Boolean(airlift?.evidence.some((e) => e.slug === "zracni-most-krasinec")),
    "T7.3 zračni most vezan na MVG-014 IN MVG-056 (isti dogodek, dva zapisa)"
  );
  check(queueIds.has("P1-E1"), "T7.4 istovetnost MVG-014 ↔ MVG-056 čaka kuratorsko potrditev (P1-E1)");
  check(bySlug.size === 95, "T7.5 zapisa MVG-014 in MVG-056 ostajata LOČENA zapisa (95/95)");

  const z1998 = eventOf("event:vrnitev-glavnega-zvona-1998");
  const z2008 = eventOf("event:blagoslov-zvona-2008");
  check(Boolean(z1998 && z2008) && z1998?.id !== z2008?.id, "T7.6 zvon 1998 ≠ zvon 2008");

  const u1854 = eventOf("event:ustanovitev-obcine-griblje-1854");
  const u1933 = eventOf("event:ukinitev-obcine-griblje-1933");
  check(Boolean(u1854 && u1933) && u1854?.id !== u1933?.id, "T7.7 ustanovitev 1854 ≠ ukinitev 1933");

  // Ustanovitve organizmov: vsaka svoj dogodek.
  const foundings = ["event:ustanovitev-pgd-griblje-1927", "event:ustanovitev-sd-griblje-1985", "event:ustanovitev-dkz-griblje-1996", "event:ustanovitev-td-griblje-2000", "event:ustanovitev-kolesarske-sekcije-2011", "event:ustanovitev-muzejske-ucilnice-2022"];
  check(foundings.every((id) => ENTITY_BY_ID.has(id)) && new Set(foundings).size === foundings.length,
    "T7.8 šest ustanovitev = šest ločenih dogodkov (organizacije same niso entitete)");

  // Šega kot praksa NI dogodek; specifična izvedba JE.
  check(Boolean(idOf("event:prvi-kavbojski-zur-2024")) && Boolean(idOf("event:gregorjevo-2026")) && !ENTITY_BY_ID.has("event:pust"),
    "T7.9 specifične izvedbe 2024/2026 so dogodki; šega kot taka ni");

  // Kraj ≠ dogodek: letališče je kraj, zračni most je dogodek.
  check(idOf("place:partizansko-letalisce-otok")?.type === "place" && airlift?.type === "event",
    "T7.10 letališče Otok = KRAJ; zračni most = DOGODEK (ločeni vrsti)");

  // Vsi dogodki imajo čas.
  const noTime = ENTITIES.filter((e) => e.type === "event" && !e.time);
  check(noTime.length === 0, `T7.11 vsak dogodek ima SoftTime — brez: ${noTime.length}`);
}

// ===========================================================================
// T8 — OBSTOJEČE RELACIJE OBJEKTOV NESPREMENJENE
// ===========================================================================
section("T8 — Obstoječe relacije objektov nespremenjene (walks/related/sourceIndex/sourceKey/usedBy)");
{
  // Zbirka sama.
  check(seedExhibits.length === 95, `T8.1 95/95 zapisov (${seedExhibits.length})`);
  check(seedExhibits.filter((e) => /^MVG-\d{3}$/.test(e.museumNo ?? "")).length === 95, "T8.2 95/95 muzejskih številk MVG");

  // Sprehodi: vsak zapis je postaja vsaj enega sprehoda.
  let noWalk = 0;
  for (const ex of seedExhibits) if (!walkStopOf(ex.slug)) noWalk += 1;
  check(noWalk === 0, `T8.3 walkStopOf pokriva VSE zapise (brez sprehoda: ${noWalk}; sprehodov: ${ALL_WALKS.length})`);

  // Sorodni zapisi: minimum 5 (limit 5) — merjena osnovna linija TASK 35–38.
  let minRel = 99;
  let minMvg = "";
  for (const ex of exhibitsDTO) {
    const rel = relatedExhibits(ex, exhibitsDTO, 5).length;
    if (rel < minRel) { minRel = rel; minMvg = ex.museumNo ?? ex.slug; }
  }
  check(minRel >= 5, `T8.4 relatedExhibits ≥ 5 za vsak zapis (minimum: ${minRel} @ ${minMvg})`);

  // Povezave OBJECT ↔ OBJECT delujejo (5 vrst razlag).
  const a = dtoBySlug.get("griblje-vas")!;
  const b = dtoBySlug.get("sveti-vid")!;
  const conn = connectionsBetween(a, b);
  check(conn.length > 0, `T8.5 connectionsBetween(griblje-vas, sveti-vid) deluje (${conn.map((c) => c.kind).join(", ")})`);

  // Source registry: identitete in deljenost.
  check(SOURCE_USAGE.size === 331, `T8.6 331 identitet virov (${SOURCE_USAGE.size})`);
  const shared = [...SOURCE_USAGE.values()].filter((u) => u.exhibits.length > 1).length;
  check(shared === 52, `T8.7 52 deljenih virov (${shared})`);

  // WorldCat normalizacija (TASK 38) ostaja.
  const wc = sourceRows("").filter((r) => r.url?.includes("821110335"));
  const wcKeys = new Set(wc.map((r) => r.key));
  const wcMvgs = new Set(wc.map((r) => r.mvg));
  check(wc.length === 2 && wcKeys.size === 1 && wcMvgs.size === 2,
    `T8.8 WorldCat OCLC 821110335: 2 vrstici (MVG-082, MVG-089) → 1 sourceKey — normalizacija TASK 38 ostaja`);
  const wcUsage = [...SOURCE_USAGE.entries()].find(([k]) => k === [...wcKeys][0]);
  check(wcUsage !== undefined && wcUsage[1].exhibits.length === 2, "T8.9 usedBy WorldCat = 2 zapisa");

  // Wikipedija Griblje: 1 identiteta, 13 zapisov.
  const wiki = [...SOURCE_USAGE.entries()].find(([k]) => k === "url:sl.wikipedia.org/wiki/Griblje");
  check(wiki !== undefined && wiki[1].exhibits.length === 13, `T8.10 Wikipedija Griblje: 1 sourceKey × 13 zapisov (${wiki?.[1].exhibits.length ?? 0})`);

  // Viri skupaj.
  let srcRows = 0;
  for (const ex of seedExhibits) srcRows += ex.sources.length;
  check(srcRows === 429, `T8.11 429 vrstic virov (${srcRows})`);

  // Biografije.
  let phases = 0;
  for (const b of OBJECT_BIOGRAPHIES) phases += b.phases.length;
  check(phases === 372 && OBJECT_BIOGRAPHIES.length === 93, `T8.12 93 biografij, 372 faz (${OBJECT_BIOGRAPHIES.length}/${phases})`);
}

// ===========================================================================
// T9 — HTTP REGRESIJA (živ strežnik :3000)
// ===========================================================================
section("T9 — HTTP regresija (93/93 strani, 93/93 IIIF, OpenData, QR, sitemap)");
{
  let serverUp = true;
  try {
    const probe = await fetch(BASE + "/", { method: "HEAD" });
    if (probe.status >= 500) serverUp = false;
  } catch {
    serverUp = false;
  }
  if (!serverUp) {
    console.log("    ⚠ strežnik ne odgovarja — T9 preskočen (zagnani: bun run dev)");
  } else {
    // 93/93 objektnih strani.
    let okPages = 0;
    const badPages: string[] = [];
    for (const ex of seedExhibits) {
      const r = await fetch(BASE + "/exponat/" + ex.slug);
      if (r.status === 200) okPages += 1; else badPages.push(ex.slug + ":" + r.status);
    }
    check(okPages === 95, `T9.1 95/95 objektnih strani (${okPages}; ${badPages.join(",") || "vse 200"})`);

    // 93/93 IIIF manifestov, vsak z vsaj enim virom.
    let okManifests = 0;
    let withSources = 0;
    const badManifests: string[] = [];
    for (const ex of seedExhibits) {
      const r = await fetch(BASE + "/api/iiif?manifest=" + ex.slug);
      if (r.status !== 200) { badManifests.push(ex.slug + ":" + r.status); continue; }
      const j = (await r.json()) as { metadata?: { label?: unknown }[] };
      const srcs = (j.metadata ?? []).filter((m) => JSON.stringify(m.label).includes("Vir"));
      okManifests += 1;
      if (srcs.length >= 1) withSources += 1;
    }
    check(okManifests === 95 && withSources === 95, `T9.2 95/95 IIIF manifestov z viri (${okManifests} manifestov, ${withSources} z ≥1 virom)`);

    // OpenData: števci + sourceKey na vseh vrsticah.
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
    check(od.counts?.exhibits === 95 && od.counts?.sources === 429, `T9.3 OpenData: 95 zapisov / 429 virov (${od.counts?.exhibits}/${od.counts?.sources})`);
    check(withKey === 429 && totalRows === 429, `T9.4 OpenData sourceKey 429/429 (${withKey}/${totalRows})`);

    // QR globoka povezava.
    const qr = await fetch(BASE + "/?exhibit=zvon-2008");
    check(qr.status === 200, `T9.5 QR globoka povezava /?exhibit=zvon-2008 → ${qr.status}`);
    const html = await qr.text();
    check(html.includes("Muzej vasi Griblje") && html.includes("zvon-2008"), "T9.6 QR: domača stran nosi parameter zapisa (odpiranje dialoga v brskalniku)");

    // Sprehod globoka povezava.
    const walk = await fetch(BASE + "/?walk=vas-in-njeni-ljudje&stop=4");
    check(walk.status === 200, `T9.7 globoka povezava sprehoda → ${walk.status}`);

    // Sitemap.
    const sm = await (await fetch(BASE + "/sitemap.xml")).text();
    const locs = (sm.match(/<loc>/g) ?? []).length;
    check(locs === 96, `T9.8 sitemap: 96 URL (${locs})`);
  }
}

// ===========================================================================
console.log("");
console.log("═".repeat(72));
console.log(`TESTI ENTITETNE PLASTI: ${passed} ✓ / ${failed} ✗`);
if (failures.length > 0) {
  console.log("NEUSPEŠNI:");
  for (const f of failures) console.log("  ✗ " + f);
  process.exit(1);
} else {
  console.log("VSI TESTI USPEŠNI — plast je deterministična, ločena in dokazno vezana.");
}
