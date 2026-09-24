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

/* --- 6. poštene napake (brez stranskih učinkov / TTS klicev) -------------- */

const agMissing = await getJson("/api/audio-guide");
ok("audio-guide brez slug: 400", agMissing.status === 400, `status=${agMissing.status}`);
// Jezik je obvezen parameter (sintezni ponudnik potrebuje glas) — brez njega
// sledi 400 še pred branjem baze; z neobstoječim zapisom pa 404 brez TTS klica.
const agLang = await getJson("/api/audio-guide?slug=griblje-vas");
ok("audio-guide brez jezika: 400", agLang.status === 400, `status=${agLang.status}`);
const agMissing2 = await getJson("/api/audio-guide?slug=ta-zapis-ne-obstaja&lang=sl");
ok("audio-guide z neobstoječim slugom: 404", agMissing2.status === 404, `status=${agMissing2.status}`);

/* --- izid ------------------------------------------------------------------ */

const failed = checks.filter((c) => !c.pass);
for (const c of checks) {
  console.log(`${c.pass ? "✓" : "✗"} ${c.name}${c.pass || !c.detail ? "" : ` — ${c.detail}`}`);
}
console.log(`\n${checks.length - failed.length}/${checks.length} preverb uspešnih (${BASE})`);
if (failed.length > 0) process.exit(1);
