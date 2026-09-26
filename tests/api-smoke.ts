/**
 * DIMNI TESTI API-JEV (issue #4) — zadenejo živi strežnik (next dev ali
 * produkcijo) in preverjajo javno pogodbo muzejskega API-ja:
 *
 *   1. oblika odgovorov + število zapisov = vir podatkov (seme zbirke),
 *   2. CORS glava prisotna na vseh odprtih poteh,
 *   3. iskanje neobčutljivo na diakritike (q=crnomelj najde »Črnomelj«),
 *   4. iskivost trajne muzejske številke (MVG-001),
 *   5. IIIF regresija: Canvas.items[0].type === "AnnotationPage" (PR #1),
 *   6. meja javno/interno: /api/opendata vrača SAMO dovoljena polja (#27/I),
 *   7. poštene napake: manjkajoč/neobstoječ slug → 400/404 (brez TTS klica).
 *
 * Uporaba:
 *   SMOKE_BASE_URL=http://localhost:3001 bun tests/api-smoke.ts
 *   (privzeto http://localhost:3000; drugi argument lahko nadomesti env)
 *
 * Izid: izhod 0 = vse zeleno, izhod 1 = napake, izhod 2 = strežnik dosegljiv ni.
 */

/* Skripta uporablja top-level await — mora biti ES modul. */
export {};

type Check = { name: string; pass: boolean; detail?: string };

const checks: Check[] = [];
function ok(name: string, pass: boolean, detail?: string): void {
  checks.push({ name, pass, detail });
}

function failExit(code: number, message: string): never {
  console.error(`✗ ${message}`);
  process.exit(code);
}

const BASE = (process.env.SMOKE_BASE_URL ?? process.argv[2] ?? "http://localhost:3000").replace(
  /\/$/,
  ""
);

/* --- 0. dostopnost strežnika -------------------------------------------- */

// SMOKE_TIMEOUT_MS: hladni zagon Neon računa traja ~30 s in prenos zbirke
// čez počasno povezavo več — privzeto 8 s (lokalni PG container), za zunanje
// baze nastavi višje: SMOKE_TIMEOUT_MS=60000.
const REACHABLE_TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS ?? 8000);

async function reachable(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/api/exhibits`, { signal: AbortSignal.timeout(REACHABLE_TIMEOUT_MS) });
    return res.status < 500;
  } catch {
    return false;
  }
}

if (!(await reachable())) {
  failExit(
    2,
    `Strežnik na ${BASE} ni dosegljiv. Zaženite 'bun run dev' in ponovite: ` +
      `SMOKE_BASE_URL=http://localhost:3000 bun tests/api-smoke.ts`
  );
}

/* --- pomožniki ----------------------------------------------------------- */

async function getJson(path: string): Promise<{ status: number; cors: string | null; body: any }> {
  const res = await fetch(`${BASE}${path}`);
  const cors = res.headers.get("access-control-allow-origin");
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* telo ni JSON — testi to javijo sami */
  }
  return { status: res.status, cors, body };
}

/* --- 1. /api/exhibits — zbirka ustreza viru podatkov ---------------------- */

const { status: exStatus, cors: exCors, body: exBody } = await getJson("/api/exhibits");
ok("exhibits: status 200", exStatus === 200, `status=${exStatus}`);
ok("exhibits: CORS glava prisotna", exCors === "*", `access-control-allow-origin=${exCors}`);

const seed = (await import("../src/lib/museum-content")).seedExhibits;
ok(
  "exhibits: število zapisov = vir podatkov (seme)",
  exBody?.count === seed.length && exBody?.exhibits?.length === seed.length,
  `API=${exBody?.count}, seme=${seed.length}`
);
ok("exhibits: vsi zapisi imajo slug in trajno številko", (exBody?.exhibits ?? []).every((e: any) => typeof e.slug === "string" && typeof e.museumNo === "string"));
const museumNos = (exBody?.exhibits ?? []).map((e: any) => e.museumNo);
ok("exhibits: trajne številke so edinstvene", new Set(museumNos).size === museumNos.length);

/* --- 2. /api/events + /api/stories --------------------------------------- */

const ev = await getJson("/api/events");
ok("events: status 200 + vsaj 1 dogodek + CORS", ev.status === 200 && ev.body?.count >= 1 && ev.cors === "*");
const st = await getJson("/api/stories");
ok("stories: status 200 + vsaj 1 zgodba + CORS", st.status === 200 && st.body?.count >= 1 && st.cors === "*");

/* --- 3. iskanje: diakritike + muzejska številka --------------------------- */

const qPlain = await getJson("/api/search?q=crnomelj");
ok("search crnomelj: status 200", qPlain.status === 200);
ok(
  "search crnomelj: najde zadetke (total ≥ 1)",
  qPlain.body?.counts?.total >= 1,
  `total=${qPlain.body?.counts?.total}`
);
const foundC = (qPlain.body?.results?.exhibits ?? []).some((h: any) =>
  (h.title?.sl ?? "").includes("Črnomelj")
);
ok("search crnomelj: zadetek z naslovom »Črnomelj«", foundC);

const qDiac = await getJson("/api/search?q=%C4%8Drnomelj");
ok(
  "search črnomelj: enako število zapisov kot brez diakritik",
  qDiac.body?.counts?.exhibits === qPlain.body?.counts?.exhibits,
  `črnomelj=${qDiac.body?.counts?.exhibits}, crnomelj=${qPlain.body?.counts?.exhibits}`
);

const qMvg = await getJson("/api/search?q=MVG-001");
const mvgHit = (qMvg.body?.results?.exhibits ?? []).some((h: any) => h.museumNo === "MVG-001");
ok("search MVG-001: trajna številka najde pravi predmet", qMvg.status === 200 && mvgHit);

/* --- 4. /api/opendata — oblika + meja javno/interno ----------------------- */

const od = await getJson("/api/opendata");
ok("opendata: status 200 + CORS", od.status === 200 && od.cors === "*");
ok(
  "opendata: counts.exhibits = vir podatkov",
  od.body?.counts?.exhibits === seed.length,
  `API=${od.body?.counts?.exhibits}, seme=${seed.length}`
);
ok("opendata: licenca CC BY-SA 4.0", od.body?.museum?.license === "CC BY-SA 4.0");
ok(
  "opendata: vsak zapis ima vsaj 1 vir",
  (od.body?.data?.exhibits ?? []).every((e: any) => (e.sources ?? []).length >= 1)
);
ok(
  "opendata: vsak vir ima sourceKey in licenco",
  (od.body?.data?.exhibits ?? []).every((e: any) =>
    (e.sources ?? []).every((s: any) => typeof s.sourceKey === "string" && typeof s.license === "string")
  )
);

/* Meja javno/interno (issue #27, točka I): dovoljeni polji sta iz domene
 * problema — če bo kdo kasneje dodal interno polje (raziskovalna opomba,
 * moderacija, pravice evidence …), bo ta test to ujel. */
const OPEN_DATA_ALLOWED = new Set([
  "slug",
  "museumNo",
  "canonicalUrl",
  "sameAs",
  "category",
  "title",
  "period",
  "summary",
  "story",
  "evidenceStatus",
  "image",
  "location",
  "sources",
]);
const leaked: string[] = [];
for (const e of od.body?.data?.exhibits ?? []) {
  for (const key of Object.keys(e)) if (!OPEN_DATA_ALLOWED.has(key)) leaked.push(`${e.slug}:${key}`);
}
ok("opendata: brez notranjih polj (meja javno/interno)", leaked.length === 0, leaked.slice(0, 5).join(", "));

/* --- 5. /api/iiif — Collection + regresija Canvas.items (PR #1) ----------- */

const iiif = await getJson("/api/iiif");
ok("iiif: status 200 + CORS", iiif.status === 200 && iiif.cors === "*");
ok(
  "iiif: kontekst Presentation 3.0",
  JSON.stringify(iiif.body?.["@context"] ?? "").includes("iiif.io/api/presentation/3")
);
ok("iiif: type Collection", iiif.body?.type === "Collection");
ok(
  "iiif: število manifestov = vir podatkov",
  iiif.body?.items?.length === seed.length,
  `API=${iiif.body?.items?.length}, seme=${seed.length}`
);

const firstRef = iiif.body?.items?.[0];
ok("iiif: prvi vnos je Manifest", firstRef?.type === "Manifest");
if (firstRef?.id) {
  const mf = await getJson(new URL(firstRef.id, BASE).pathname + new URL(firstRef.id, BASE).search);
  ok("iiif manifest: status 200", mf.status === 200);
  // Regresija PR #1: Canvas.items je POLJE AnnotationPage — torej
  // manifest.items[0] = Canvas, canvas.items[0].type = "AnnotationPage".
  const canvas = mf.body?.items?.[0];
  ok(
    "iiif manifest: Canvas.items[0].type === AnnotationPage (regresija PR #1)",
    canvas?.type === "Canvas" && canvas?.items?.[0]?.type === "AnnotationPage",
    `canvas=${canvas?.type}, items[0]=${canvas?.items?.[0]?.type}`
  );
  // Slika v anotaciji je JPEG (2. del popravka PR #1).
  const annotationBody = canvas?.items?.[0]?.items?.[0]?.body;
  ok(
    "iiif manifest: slika image/jpeg",
    annotationBody?.format === "image/jpeg" || firstRef?.thumbnail?.[0]?.format === "image/jpeg",
    `format=${annotationBody?.format ?? firstRef?.thumbnail?.[0]?.format}`
  );
}

/* --- 5b. /api/assets — javni register vsebin (#27/B) ---------------------- */

const assets = await getJson("/api/assets");
ok("assets: status 200 + CORS", assets.status === 200 && assets.cors === "*");
ok("assets: oblika { count, assets[] }", Array.isArray(assets.body?.assets) && typeof assets.body?.count === "number");
ok(
  "assets: vsak javni zapis ima checksum in licenco (#27/B)",
  (assets.body?.assets ?? []).every(
    (a: any) => typeof a.sha256 === "string" && a.sha256.length === 64 && typeof a.license === "string"
  )
);
ok(
  "assets: notranji ključi ne puščajo (storageKey, exhibitId) (#27/I)",
  (assets.body?.assets ?? []).every((a: any) => !("storageKey" in a) && !("exhibitId" in a))
);

/* --- 5c. meja javno/interno (#27/I) — regresijske preverbe ---------------- */

// Notranja polja, ki se v javnem API-ju ne smejo pojaviti nikoli:
const INTERNAL_KEYS = [
  "permissionEvidence",
  "rightsVerifiedAt",
  "permissionToPublish",
  "permissionToModify",
  "commercialUse",
  "researcherNote",
  "researcherNotes",
  "moderatedBy",
  "moderatedAt",
  "moderationNote",
  "previousStatus",
  "reportCount",
  "deletedAt",
];

function leaks(body: any, path: string): string | null {
  const stack: Array<{ obj: any; path: string }> = [{ obj: body, path }];
  while (stack.length) {
    const { obj, path: p } = stack.pop()!;
    if (!obj || typeof obj !== "object") continue;
    if (Array.isArray(obj)) {
      stack.push(...obj.map((o, i) => ({ obj: o, path: `${p}[${i}]` })));
      continue;
    }
    for (const key of INTERNAL_KEYS) {
      if (key in obj) return `${p}.${key}`;
    }
    stack.push(...Object.entries(obj).map(([k, v]) => ({ obj: v, path: `${p}.${k}` })));
  }
  return null;
}

const exhLeak = await getJson("/api/exhibits");
ok("exhibits: status 200", exhLeak.status === 200, `status=${exhLeak.status}`);
{
  const leak = leaks(exhLeak.body, "exhibits");
  ok("exhibits: brez notranjih polj pravic/moderacije/raziskave (#27/I)", !leak, leak ?? "");
}

const arLeak = await getJson("/api/archive-records");
ok("archive-records: status 200", arLeak.status === 200, `status=${arLeak.status}`);
{
  const leak = leaks(arLeak.body, "archive-records");
  ok("archive-records: researcherNotes ne puščajo (#27/E+I)", !leak, leak ?? "");
}

const gbLeak = await getJson("/api/guestbook");
{
  const leak = leaks(gbLeak.body, "guestbook");
  ok("guestbook: brez metapodatkov moderacije (#27/G+I)", !leak, leak ?? "");
}

// Uredniški API-ji brez žetona NISO dostopni (401) ali NISO nastavljeni (503):
const verNoTok = await getJson("/api/versions?slug=griblje-vas");
ok("versions brez žetona: 401/503 (ne 200)", verNoTok.status === 401 || verNoTok.status === 503, `status=${verNoTok.status}`);
const modNoTok = await getJson("/api/moderation?status=pending");
ok("moderation brez žetona: 401/503 (ne 200)", modNoTok.status === 401 || modNoTok.status === 503, `status=${modNoTok.status}`);

// Javne trditve: samo objavljene, brez notranjih polj:
const claimsPub = await getJson("/api/claims?slug=griblje-vas");
ok("claims: status 200 + oblika { count, claims[] }", claimsPub.status === 200 && Array.isArray(claimsPub.body?.claims));
{
  const leak = leaks(claimsPub.body, "claims");
  ok("claims: brez researcherNote/workflow polj (#27/D+I)", !leak, leak ?? "");
  const unpublished = (claimsPub.body?.claims ?? []).some(
    (c: any) => "status" in c && c.status !== "PUBLISHED"
  );
  ok("claims: servisira samo PUBLISHED trditve", !unpublished);
}

/* --- 5d. /api/health — zdravstveno stanje (#27/V+U) ----------------------- */

const health = await getJson("/api/health");
ok("health: status 200 + ok:true", health.status === 200 && health.body?.ok === true, `status=${health.status}`);
ok(
  "health: baza povezana + živi števci zbirke (#27/U)",
  health.body?.database?.connected === true && typeof health.body?.counts?.exhibits === "number"
);
ok(
  "health: konfiguracija samo kot zastavice (brez razkritja vrednosti)",
  typeof health.body?.config?.editorialApi === "boolean" &&
    typeof health.body?.config?.moderationApi === "boolean"
);
ok("health: correlation ID prisoten", typeof health.body?.correlationId === "string");

/* --- 6. poštene napake (brez stranskih učinkov / TTS klicev) -------------- */

const agMissing = await getJson("/api/audio-guide");
ok("audio-guide brez slug: 400", agMissing.status === 400, `status=${agMissing.status}`);
// Jezik je obvezen parameter (sintezni ponudnik potrebuje glas) — brez njega
// sledi 400 še pred branjem baze; z neobstoječim zapisom pa 404 brez TTS klica.
const agLang = await getJson("/api/audio-guide?slug=griblje-vas");
ok("audio-guide brez jezika: 400", agLang.status === 400, `status=${agLang.status}`);
const agMissing2 = await getJson("/api/audio-guide?slug=ta-zapis-ne-obstaja&lang=sl");
ok("audio-guide z neobstoječim slugom: 404", agMissing2.status === 404, `status=${agMissing2.status}`);

/* --- 5e. /api/atlas/evidence — Evidence Explorer (issue #43 §2/§6) -------- */

const atlasOverview = await getJson("/api/atlas/evidence");
ok(
  "atlas evidence: pregled grafa — stats + coverage + research gaps (#43 §10)",
  atlasOverview.status === 200 &&
    atlasOverview.body?.ok === true &&
    atlasOverview.body?.stats?.nodes?.HOUSE === 167 &&
    Array.isArray(atlasOverview.body?.research_gaps),
  `status=${atlasOverview.status}`
);

const atlasH40 = await getJson("/api/atlas/evidence?node=house%2040");
const h40Owners = (atlasH40.body?.claims ?? []).filter(
  (c: any) => c.predicate === "OWNER_DOCUMENTED"
);
ok(
  "atlas evidence: house 40 — dokazna veriga z 2 OWNER_DOCUMENTED claim-oma (PUA+PS, #43 §2)",
  atlasH40.status === 200 &&
    atlasH40.body?.node?.house_no_1825 === "40" &&
    h40Owners.length === 2 &&
    h40Owners.map((c: any) => c.source_ref?.source).sort().join(",") === "SRC-PS,SRC-PUA",
  `status=${atlasH40.status} owners=${h40Owners.length}`
);
ok(
  "atlas evidence: house 40 — original evidence URL (pot do dokumenta, #43 §6)",
  (atlasH40.body?.original_evidence ?? []).every(
    (s: any) => typeof s.vac_details_url === "string" && s.vac_details_url.startsWith("https://vac.sjas.gov.si/")
  )
);

const atlasMissing = await getJson("/api/atlas/evidence?node=house%20999");
ok("atlas evidence: neobstoječi node = 404 node_not_found (brez ugibanja)", atlasMissing.status === 404 && atlasMissing.body?.error === "node_not_found", `status=${atlasMissing.status}`);

/* --- 5f. /api/atlas/evidence — MAP_OBJECT veriga (val 65, #42 §7) ---------- */
const atlasMO94 = await getJson("/api/atlas/evidence?node=" + encodeURIComponent("MO:MO-A01-002"));
const mo94BpEdge = (atlasMO94.body?.edges ?? []).find(
  (e: any) => e.relation_type === "CORRESPONDS_TO_BP"
);
ok(
  "atlas evidence: MAP_OBJECT (BP 94) — glifna plast z CORRESPONDS_TO_BP + DEPICTED_ON SRC-A01 (val 65)",
  atlasMO94.status === 200 &&
    atlasMO94.body?.node?.node_type === "MAP_OBJECT" &&
    atlasMO94.body?.node?.bp === "94" &&
    mo94BpEdge?.to_entity === "BP:094" &&
    (atlasMO94.body?.edges ?? []).some((e: any) => e.relation_type === "DEPICTED_ON" && e.to_entity === "SRC-A01"),
  `status=${atlasMO94.status} bp=${atlasMO94.body?.node?.bp}`
);
const atlasSearchMO = await getJson("/api/atlas/evidence?q=complex_unidentified&type=MAP_OBJECT");
ok(
  "atlas evidence: search MAP_OBJECT — neoznačena Žolant stavba po building_type (UNIDENTIFIED ≠ ne-obstoj)",
  atlasSearchMO.status === 200 &&
    atlasSearchMO.body?.results?.length === 1 &&
    atlasSearchMO.body?.results?.[0]?.node_type === "MAP_OBJECT" &&
    String(atlasSearchMO.body?.results?.[0]?.node_id).startsWith("MO:MO-A01-"),
  `status=${atlasSearchMO.status} hits=${atlasSearchMO.body?.results?.length}`
);

/* --- 5g. /api/atlas/evidence — PASS 4b (val 66, #42 §7) --------------------- */
const atlasChurch = await getJson("/api/atlas/evidence?node=MO:MO-A02-001");
const churchEdge = (atlasChurch.body?.edges ?? []).find(
  (e: any) => e.relation_type === "DEPICTED_ON"
);
ok(
  "atlas evidence: MO-A02-001 CERKEV sv. Vid — DEPICTED_ON → SRC-A02 z vac_details_url (val 66)",
  atlasChurch.status === 200 &&
    atlasChurch.body?.node?.node_type === "MAP_OBJECT" &&
    atlasChurch.body?.node?.building_type === "church" &&
    churchEdge?.to_entity === "SRC-A02" &&
    atlasChurch.body?.sources?.some?.((s: any) => String(s?.vac_details_url).includes("id=227668")),
  `status=${atlasChurch.status} type=${atlasChurch.body?.node?.building_type}`
);
const atlasBp12 = await getJson("/api/atlas/evidence?node=MO:MO-A02-002");
const bp12Claim = (atlasBp12.body?.claims ?? []).find(
  (c: any) => c.predicate === "CORRESPONDS_TO_BP"
);
ok(
  "atlas evidence: MO-A02-002 glifa '12.' — CORRESPONDS_TO_BP BP:012 REVIEW, merge prepovedan (val 66)",
  atlasBp12.status === 200 &&
    atlasBp12.body?.node?.bp_glyph === "12" &&
    (atlasBp12.body?.edges ?? []).some((e: any) => e.relation_type === "CORRESPONDS_TO_BP" && e.to_entity === "BP:012") &&
    bp12Claim?.status === "REVIEW",
  `status=${atlasBp12.status} claim=${bp12Claim?.status}`
);

/* --- 5h. /api/atlas/map — PASS 5 podatkovni zemljevid (val 67, #42 §15) ------ */
const atlasMap = await getJson("/api/atlas/map");
ok(
  "atlas map: layer=all — 34 MAP_OBJECT (24 A01 + 10 drugi listi), GEOREF v2 disclaimer (val 72)",
  atlasMap.status === 200 &&
    atlasMap.body?.counts?.map_objects === 34 &&
    atlasMap.body?.counts?.map_objects_a01 === 24 &&
    atlasMap.body?.counts?.map_objects_other_sheets === 10 &&
    String(atlasMap.body?.disclaimer).includes("GEOREF v2") &&
    String(atlasMap.body?.disclaimer).includes("±38 m"),
  `status=${atlasMap.status} objects=${atlasMap.body?.counts?.map_objects}`
);
const h40 = (atlasMap.body?.layers?.houses ?? []).find(
  (h: any) => h.node_id === "HOUSE:H-040"
);
ok(
  "atlas map: hiša 40 locirana prek BP 94 → MO-A01-002, GEOREF v2 (val 72)",
  atlasMap.status === 200 &&
    h40?.located === true &&
    h40?.position?.via_bp === 94 &&
    h40?.position?.map_object === "MO:MO-A01-002" &&
    typeof h40?.position?.lat === "number" &&
    String(h40?.position?.georef_status).includes("GEOREF v2"),
  `located=${h40?.located} via=${h40?.position?.via_bp}`
);
ok(
  "atlas map: A02–A05 brez koordinat + KG-F05 varovalka (hiša BP 12 ni locirana)",
  (atlasMap.body?.layers?.map_objects ?? [])
    .filter((m: any) => m.sheet !== "A01")
    .every((m: any) => m.lat === null && m.lng === null) &&
    (atlasMap.body?.layers?.houses ?? [])
      .filter((h: any) => h.bp_refs?.some?.((r: any) => r.bp === 12))
      .every((h: any) => h.located === false),
  "A02/A05 lat=null; BP12 not-located"
);
const atlasMapSheets = await getJson("/api/atlas/map?layer=sheets");
ok(
  "atlas map: sheets — 5 listov A01–A05 z vac_details_url (§11)",
  atlasMapSheets.status === 200 &&
    atlasMapSheets.body?.count === 5 &&
    atlasMapSheets.body?.sheets?.every?.((s: any) => String(s?.vac_details_url).includes("vac.sjas.gov.si")),
  `count=${atlasMapSheets.body?.count}`
);
const atlasMapBad = await getJson("/api/atlas/map?layer=neznana");
ok(
  "atlas map: neznana plast → 400 unknown_layer (poštene napake)",
  atlasMapBad.status === 400 && atlasMapBad.body?.error === "unknown_layer",
  `status=${atlasMapBad.status}`
);

/* --- 5i. /api/atlas/story-graph — PASS 6 pripovedni graf (val 68, #42 §21) --- */
const sgOverview = await getJson("/api/atlas/story-graph");
ok(
  "atlas story-graph: pregled — 3.309 entitet + 4 atomi + pogodba Story Engine (#42 §21/§22)",
  sgOverview.status === 200 &&
    sgOverview.body?.ok === true &&
    sgOverview.body?.stats?.entities === 3309 &&
    sgOverview.body?.stats?.relations === 3569 &&
    sgOverview.body?.stats?.story_atoms === 4 &&
    Array.isArray(sgOverview.body?.story_engine_contract?.required_fields),
  `status=${sgOverview.status} entities=${sgOverview.body?.stats?.entities}`
);

const sgH40 = await getJson("/api/atlas/story-graph?node=" + encodeURIComponent("HOUSE:H-040"));
ok(
  "atlas story-graph: sosednost hiše 40 — lastniki + BP + atom SA-002 (vhod Story Engine §16)",
  sgH40.status === 200 &&
    sgH40.body?.focus?.node_id === "HOUSE:H-040" &&
    (sgH40.body?.entities ?? []).some((e: any) => e.node_type === "PERSON") &&
    (sgH40.body?.relations ?? []).some((r: any) => r.relation_type === "OWNER_OF") &&
    (sgH40.body?.story_atoms ?? []).some((a: any) => a.story_id === "SA-002"),
  `status=${sgH40.status} entities=${sgH40.body?.entities?.length}`
);

const sgDepth2 = await getJson("/api/atlas/story-graph?node=BP%20094&depth=2");
ok(
  "atlas story-graph: BP 94 depth 2 — parcele pridejo v sosednost (HAS_PARCEL)",
  sgDepth2.status === 200 &&
    (sgDepth2.body?.relations ?? []).some((r: any) => r.relation_type === "HAS_PARCEL") &&
    (sgDepth2.body?.entities ?? []).some((e: any) => e.node_type === "PARCEL"),
  `status=${sgDepth2.status} entities=${sgDepth2.body?.entities?.length}`
);

const sgPersons = await getJson("/api/atlas/story-graph?type=PERSON&limit=5000");
ok(
  "atlas story-graph: 488 oseb (projekcija KG, nič novih trditev)",
  sgPersons.status === 200 && sgPersons.body?.count === 488,
  `count=${sgPersons.body?.count}`
);

const sgGemeinde = await getJson("/api/atlas/story-graph?relation=IS_GEMEINDE_OF");
ok(
  "atlas story-graph: IS_GEMEINDE_OF z claimom C-00622 (KG-F07 claim-first fix)",
  sgGemeinde.status === 200 &&
    sgGemeinde.body?.count === 1 &&
    sgGemeinde.body?.relations?.[0]?.from_entity === "TP-001" &&
    JSON.stringify(sgGemeinde.body?.relations?.[0]?.claim_ids) === '["C-00622"]' &&
    typeof sgGemeinde.body?.relations?.[0]?.date_period === "string" &&
    sgGemeinde.body?.relations?.[0]?.source_ids?.length >= 3,
  `status=${sgGemeinde.status}`
);

const sgAtoms = await getJson("/api/atlas/story-graph?atoms=1");
ok(
  "atlas story-graph: atomi z razrešenimi claims — SA-004 provenance_complete (§22)",
  sgAtoms.status === 200 &&
    sgAtoms.body?.count === 4 &&
    (sgAtoms.body?.story_atoms ?? []).every((a: any) => a.provenance_complete === true) &&
    (sgAtoms.body?.story_atoms ?? []).some((a: any) => a.story_id === "SA-004" && JSON.stringify(a.claim_ids) === '["C-00622"]'),
  `status=${sgAtoms.status}`
);

const sgSearch = await getJson("/api/atlas/story-graph?q=Sautter");
ok(
  "atlas story-graph: iskanje oseb — Sautter najden (PUA lastnik hiše 40)",
  sgSearch.status === 200 && sgSearch.body?.count >= 1 && sgSearch.body?.hits?.[0]?.evidence_url?.includes("/api/atlas/evidence"),
  `count=${sgSearch.body?.count}`
);

const sgBadType = await getJson("/api/atlas/story-graph?type=VOZEL");
ok(
  "atlas story-graph: neznana vrsta entitete → 400 (poštene napake)",
  sgBadType.status === 400 && sgBadType.body?.error === "unknown_entity_type",
  `status=${sgBadType.status}`
);
const sgNotFound = await getJson("/api/atlas/story-graph?node=H-999");
ok(
  "atlas story-graph: neobstoječa entiteta → 404 node_not_found",
  sgNotFound.status === 404 && sgNotFound.body?.error === "node_not_found",
  `status=${sgNotFound.status}`
);
const sgBadDepth = await getJson("/api/atlas/story-graph?node=BP:094&depth=5");
ok(
  "atlas story-graph: depth 5 → 400 invalid_depth (zaščita pred parcelno eksplozijo)",
  sgBadDepth.status === 400 && sgBadDepth.body?.error === "invalid_depth",
  `status=${sgBadDepth.status}`
);

/* --- ATLAS STORY ENGINE (issue #42 §16–§18, PASS 7, val 69) ---------------- */

const seH40 = await getJson("/api/atlas/story?entity=HOUSE:H-040");
ok(
  "atlas story: zgodba hiše 40 — contract EVIDENCED + tiri ločeni (§16/§17/§22)",
  seH40.status === 200 &&
    seH40.body?.contract?.story_status === "EVIDENCED" &&
    seH40.body?.contract?.story_id?.startsWith("SE-") &&
    (seH40.body?.contract?.used_claim_ids ?? []).includes("C-00083") &&
    (seH40.body?.contract?.used_claim_ids ?? []).includes("C-00154") &&
    seH40.body?.tier_breakdown?.KONFLIKTNO > 0 &&
    seH40.body?.tier_breakdown?.NEZNANO > 0,
  `status=${seH40.status} story_id=${seH40.body?.contract?.story_id}`
);

const seSections = await getJson("/api/atlas/story?entity=H-040");
ok(
  "atlas story: hiša 40 — §16 sekcije (lastništvo/parcele/kataster/konflikti/neznanje)",
  seSections.status === 200 &&
    (seSections.body?.sections ?? []).some((s: any) => s.title === "Lastništvo 1825") &&
    (seSections.body?.sections ?? []).some((s: any) => s.title === "Parcele in raba zemljišča") &&
    (seSections.body?.sections ?? []).some((s: any) => s.title.startsWith("Na katastrskem listu")) &&
    (seSections.body?.sections ?? []).some((s: any) => s.title.includes("Konflikti")) &&
    (seSections.body?.sections ?? []).some((s: any) => s.title.includes("Kaj še ne vemo")),
  `status=${seSections.status} sections=${seSections.body?.sections?.length}`
);

const seDeterminism = await getJson("/api/atlas/story?entity=HOUSE:H-040");
ok(
  "atlas story: determinizem — isti story_id + content_hash (§22 reproducibilnost)",
  seDeterminism.status === 200 &&
    seDeterminism.body?.contract?.story_id === seH40.body?.contract?.story_id &&
    seDeterminism.body?.contract?.content_hash === seH40.body?.contract?.content_hash &&
    seDeterminism.body?.contract?.kg_sha256 === seH40.body?.contract?.kg_sha256,
  `hash=${seDeterminism.body?.contract?.content_hash?.slice(0, 12)}`
);

const seVillage = await getJson("/api/atlas/story?scope=village");
ok(
  "atlas story: zgodba vasi (§18) — 10 sekcij + EVIDENCED + C-00622 + raba ločena",
  seVillage.status === 200 &&
    seVillage.body?.sections?.length === 10 &&
    seVillage.body?.contract?.story_status === "EVIDENCED" &&
    (seVillage.body?.contract?.used_claim_ids ?? []).includes("C-00622") &&
    (seVillage.body?.sections ?? []).some((s: any) => s.title.includes("Raba zemljišča") && s.items.length >= 2),
  `status=${seVillage.status} sections=${seVillage.body?.sections?.length}`
);

const seNotPublished = await getJson(
  `/api/atlas/story?entity=${encodeURIComponent("PARCEL:PUA-G-B P. 17")}`
);
ok(
  "atlas story: entiteta brez claims in relacij → NOT_PUBLISHED (pravilo pogodbe)",
  seNotPublished.status === 200 &&
    seNotPublished.body?.contract?.story_status === "NOT_PUBLISHED" &&
    seNotPublished.body?.contract?.used_claim_ids?.length === 0 &&
    typeof seNotPublished.body?.contract?.prompt_version === "string",
  `status=${seNotPublished.status} story_status=${seNotPublished.body?.contract?.story_status}`
);

const seMissing = await getJson("/api/atlas/story");
ok(
  "atlas story: brez parametra → 400 missing_param (poštene napake)",
  seMissing.status === 400 && seMissing.body?.error === "missing_param",
  `status=${seMissing.status}`
);
const seBadScope = await getJson("/api/atlas/story?scope=nekaj");
ok(
  "atlas story: neznan scope → 400 unknown_scope",
  seBadScope.status === 400 && seBadScope.body?.error === "unknown_scope",
  `status=${seBadScope.status}`
);
const seNotFound = await getJson("/api/atlas/story?entity=HOUSE:H-999");
ok(
  "atlas story: neobstoječa entiteta → 404 node_not_found",
  seNotFound.status === 404 && seNotFound.body?.error === "node_not_found",
  `status=${seNotFound.status}`
);

/* --- 5i. /api/atlas/coverage — PASS 8 Quality Gate (val 70, #42 §23/§24) --- */

const covOverview = await getJson("/api/atlas/coverage");
const covHouses = (covOverview.body?.quality_gate ?? []).find(
  (c: any) => c.category_id === "houses"
);
ok(
  "atlas coverage: pregled — 18 kategorij §23 + 14 outputov §24 (val 70)",
  covOverview.status === 200 &&
    covOverview.body?.ok === true &&
    covOverview.body?.summary?.categories === 18 &&
    covOverview.body?.summary?.outputs === 14 &&
    Array.isArray(covOverview.body?.invariants_enforced),
  `status=${covOverview.status} categories=${covOverview.body?.summary?.categories}`
);
ok(
  "atlas coverage: hiše 167 (49 CONFLICT / 73 UNKNOWN — brez procentov, #43 §10)",
  covOverview.status === 200 &&
    covHouses?.total === 167 &&
    covHouses?.CONFLICT === 49 &&
    covHouses?.UNKNOWN === 73 &&
    typeof covHouses?.mapping_rule === "string",
  `status=${covOverview.status} houses=${covHouses?.total}`
);
const covCat = await getJson("/api/atlas/coverage?category=bp_a01_binding");
ok(
  "atlas coverage: kategorija bp_a01_binding — 9 VERIFIED (CLEAR glife) + 37 NOT_FOUND z opombo",
  covCat.status === 200 &&
    covCat.body?.category?.VERIFIED === 9 &&
    covCat.body?.category?.NOT_FOUND === 37 &&
    (covCat.body?.category?.not_found_note ?? "").includes("dokaz neobstoja"),
  `status=${covCat.status} VER=${covCat.body?.category?.VERIFIED} NF=${covCat.body?.category?.NOT_FOUND}`
);
const covOutputs = await getJson("/api/atlas/coverage?outputs=1");
ok(
  "atlas coverage: §24 manifest — 14 obveznih outputov EXISTS na disku",
  covOutputs.status === 200 &&
    covOutputs.body?.count === 14 &&
    (covOutputs.body?.outputs ?? []).every((o: any) => o.status === "EXISTS"),
  `status=${covOutputs.status} count=${covOutputs.body?.count}`
);
const covUnknowns = await getJson("/api/atlas/coverage?unknowns=1");
ok(
  "atlas coverage: prečne nezanke — agregat po mestu izvora (geometry 2467 + duplikati 161 …)",
  covUnknowns.status === 200 &&
    covUnknowns.body?.aggregate?.length === 9 &&
    covUnknowns.body?.total > 3000,
  `status=${covUnknowns.status} total=${covUnknowns.body?.total}`
);
const covBadCat = await getJson("/api/atlas/coverage?category=neobstaja");
ok(
  "atlas coverage: neznana kategorija → 404 unknown_category",
  covBadCat.status === 404 && covBadCat.body?.error === "unknown_category",
  `status=${covBadCat.status}`
);

/* --- 5n. EXPLORE 1825 UI klici (val 71, issue #42 §16/§19) ------------------ */

const stMO = await getJson("/api/atlas/story?entity=" + encodeURIComponent("MO:MO-A01-002"));
ok(
  "atlas story UI: klik na kartografski objekt — MO:MO-A01-002 → EVIDENCED + pogodba §22",
  stMO.status === 200 &&
    stMO.body?.ok === true &&
    stMO.body?.focus?.node_id === "MO:MO-A01-002" &&
    stMO.body?.contract?.story_status === "EVIDENCED" &&
    typeof stMO.body?.contract?.content_hash === "string" &&
    stMO.body?.contract?.content_hash.length >= 8 &&
    Array.isArray(stMO.body?.sections),
  `status=${stMO.status} status_st=${stMO.body?.contract?.story_status}`
);

const stVillage = await getJson("/api/atlas/story?scope=village");
ok(
  "atlas story UI: 'Povej mi zgodbo tega kraja' — village → 10 sekcij + razporeditev tiri (§18)",
  stVillage.status === 200 &&
    stVillage.body?.ok === true &&
    stVillage.body?.scope === "village" &&
    stVillage.body?.sections?.length === 10 &&
    typeof stVillage.body?.tier_breakdown === "object",
  `status=${stVillage.status} sekcije=${stVillage.body?.sections?.length}`
);

const evToponym = await getJson(
  "/api/atlas/evidence?q=" + encodeURIComponent("Zagorje") + "&type=TOPONYM"
);
ok(
  "atlas evidence UI: klik na toponim — iskanje razreši TOPONYM node (npr. TP-029 Zagorje)",
  evToponym.status === 200 &&
    evToponym.body?.ok === true &&
    evToponym.body?.count >= 1 &&
    (evToponym.body?.results ?? []).every(
      (r: any) => typeof r.node_id === "string" && r.node_id.startsWith("TP-")
    ),
  `status=${evToponym.status} count=${evToponym.body?.count}`
);

const stMissing = await getJson("/api/atlas/story?entity=toponym:NeobstojeciToponim");
ok(
  "atlas story UI: nerešljiva referenta → 404 node_not_found (poštena napaka, ne izmišljotina)",
  stMissing.status === 404 && stMissing.body?.error === "node_not_found",
  `status=${stMissing.status}`
);


/* --- 5m. /api/atlas/georef — GEOREF PASS v2 (val 72, #42 §10) --------------- */
const georefT = await getJson("/api/atlas/georef?transform=1");
ok(
  "atlas georef: transform=1 — skala 0,73 m/px + rotacija 0,88° + koordinatni okvir (§10)",
  georefT.status === 200 &&
    georefT.body?.ok === true &&
    Math.abs(georefT.body?.transform?.scale_m_per_px - 0.730675) < 1e-5 &&
    Math.abs(georefT.body?.transform?.rotation_deg - 0.8772) < 1e-3 &&
    typeof georefT.body?.coordinate_frame?.lat0 === "number" &&
    String(georefT.body?.disclaimer).includes("ni zgodovinski dokaz"),
  `status=${georefT.status} scale=${georefT.body?.transform?.scale_m_per_px}`
);
const georefFull = await getJson("/api/atlas/georef");
const gf = georefFull.body?.georef;
ok(
  "atlas georef: polni artefakt — findings F-GEO-01..04 + NEGATIVEN hišnoštevilski eksperiment + validacija 16,6 m",
  georefFull.status === 200 &&
    gf?.val === 72 &&
    gf?.findings?.length === 4 &&
    gf?.findings?.[0]?.id === "F-GEO-01" &&
    String(gf?.findings?.[0]?.status).includes("RESOLVED-V72") &&
    gf?.housenumber_experiment?.verdict === "NEGATIVE" &&
    Math.abs(gf?.accuracy?.validation_v65_median_m - 16.6) < 0.05,
  `status=${georefFull.status} findings=${gf?.findings?.length}`
);

/* --- 5o. /api/atlas/map?layer=parcels — parcelni sloj rabe (val 73, #42 §19) --- */
const mapAll73 = await getJson("/api/atlas/map");
ok(
  "atlas map: counts.parcels = 2467 z razčlenjeno rabo (326 dokumentiranih / 106 neznanih / 2035 brez zapisa)",
  mapAll73.status === 200 &&
    mapAll73.body?.counts?.parcels === 2467 &&
    mapAll73.body?.counts?.parcels_with_land_use === 326 &&
    mapAll73.body?.counts?.parcels_land_use_unknown === 106 &&
    mapAll73.body?.counts?.parcels_no_land_use_record === 2035 &&
    Array.isArray(mapAll73.body?.layers?.parcels) &&
    mapAll73.body?.layers?.parcels?.length === 2467,
  `status=${mapAll73.status} parcels=${mapAll73.body?.counts?.parcels}`
);
const parcels73 = await getJson("/api/atlas/map?layer=parcels");
const p73f = parcels73.body?.features?.[0];
const p201 = (parcels73.body?.features ?? []).find(
  (f: { node_id?: string }) => f.node_id === "PARCEL:PUA-II-201"
);
ok(
  "atlas map parcels: register brez geometrije (§9) + obratni indeks HAS_PARCEL + sledljivost",
  parcels73.status === 200 &&
    parcels73.body?.count === 2467 &&
    typeof p73f?.node_id === "string" &&
    p73f?.node_id?.startsWith("PARCEL:") === true &&
    p73f !== undefined && !("px" in p73f) && !("lat" in p73f) && !("lng" in p73f) &&
    p201?.house_refs?.includes("HOUSE:H-001") === true &&
    p201?.co_referenced === true &&
    typeof p201?.evidence_url === "string" &&
    p201?.evidence_url?.includes("evidence?node=") === true &&
    p201?.evidence_url?.includes("PUA-II-201") === true,
  `status=${parcels73.status} count=${parcels73.body?.count}`
);
const storyParc73 = await getJson("/api/atlas/story?entity=PARCEL:PUA-II-201");
ok(
  "atlas story parcela: PARTIAL_EVIDENCE + obrnjena oznaka 'pripada hiši' (§17 smera branja)",
  storyParc73.status === 200 &&
    storyParc73.body?.contract?.story_status === "PARTIAL_EVIDENCE" &&
    storyParc73.body?.contract?.used_source_ids?.includes("SRC-PUA") === true &&
    JSON.stringify(storyParc73.body?.sections ?? []).includes("pripada hiši"),
  `status=${storyParc73.status} story=${storyParc73.body?.contract?.story_id}`
);

/* --- izid ------------------------------------------------------------------ */

const failed = checks.filter((c) => !c.pass);
for (const c of checks) {
  console.log(`${c.pass ? "✓" : "✗"} ${c.name}${c.pass || !c.detail ? "" : ` — ${c.detail}`}`);
}
console.log(`\n${checks.length - failed.length}/${checks.length} preverb uspešnih (${BASE})`);
if (failed.length > 0) process.exit(1);
