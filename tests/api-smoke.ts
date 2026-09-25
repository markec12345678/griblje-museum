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

/* --- izid ------------------------------------------------------------------ */

const failed = checks.filter((c) => !c.pass);
for (const c of checks) {
  console.log(`${c.pass ? "✓" : "✗"} ${c.name}${c.pass || !c.detail ? "" : ` — ${c.detail}`}`);
}
console.log(`\n${checks.length - failed.length}/${checks.length} preverb uspešnih (${BASE})`);
if (failed.length > 0) process.exit(1);
