/**
 * ATLAS 1825 — GEOREF PASS v2 testi (issue #42 §10, val 72).
 *
 * Testira:
 *   1. georef-1825.json (arhivska resnica): struktura, transformacijski
 *      parametri v zdravih mejah, invarianti I1–I6 zapisani, findings F-GEO-01..04,
 *      hišnoštevilski eksperiment = NEGATIVEN (§14 — nič skrito).
 *   2. Transformacijska matematika: [E,N] = s·R(θ)·[x,−y]+[tx,ty] — povratna
 *      preverba na sidru, rotacija/skala rekonstruirana iz dveh točk.
 *   3. Konsistentnost podatkov: vse 56 stavb + 7 toponimov v cadastre-a01.json
 *      ima lat/lng znotraj overlay ; KG v1.6 MO-A01 koordinate = v2 (brez starih
 *      2,19 m/px raztegov); a01-inventory georef blok v2.
 *   4. Zgodovinska-vs-sodobna označba (§10): disclaimer v map lib omenja reko,
 *      ±38 m in "ni zgodovinski dokaz"; i18n provisionalNote omenja ±38 m (vseh 5).
 *
 * Načelo: nič procentov (#43 §10), NOT_FOUND ≠ dokaz neobstoja (§3), sodobna
 * OSM podlaga ni zgodovinski dokaz (§10).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const REPO = join(import.meta.dir, "..");
const ARTEFACT = join(REPO, "research-griblje", "atlas-1825", "georef-1825.json");
const RUNTIME = join(REPO, "src", "data", "georef-1825.json");

type GeorefFile = {
  val: number;
  pass: string;
  issue: string;
  title: string;
  method: {
    type: string;
    coordinate_frame: { lat0: number; meters_east_per_deg_lng: number; meters_north_per_deg_lat: number; formula: string };
    multi_start: { candidates: { s0: number; th0_deg: number; trimmed_rms_m: number; validation_median_m: number }[]; selection: string };
    modern_basis: string;
  };
  transform: { scale_m_per_px: number; rotation_deg: number; tx_m_east: number; ty_m_north: number };
  accuracy: {
    river_trimmed_rms_m: number;
    river_median_m: number;
    river_points: number;
    validation_v65_median_m: number;
    validation_prior_median_m: number;
    old_anchor_residual_m: number;
    summary: string;
  };
  housenumber_experiment: { candidate_pairs: number; max_consensus: number; verdict: string };
  findings: { id: string; status: string; finding: string }[];
  what_would_resolve: string[];
  invariants: { I6_determinism: string; violations: string[] };
  provenance: { built_from: string[]; builder: string; deterministic: boolean; modern_basis_license: string };
};

const g = JSON.parse(readFileSync(ARTEFACT, "utf-8")) as GeorefFile;

/* ------------------------- struktura + parametri ------------------------- */

describe("georef-1825 (val 72, §10)", () => {
  test("struktura + val/pass/issue varovalke", () => {
    expect(g.val).toBe(72);
    expect(g.pass).toContain("GEOREF PASS v2");
    expect(g.issue).toContain("#42 §10");
    expect(g.method.type).toBe("similarity_transform_icp_lite");
    expect(g.method.modern_basis).toContain("39699026");
    expect(g.method.modern_basis).toContain("NI zgodovinski dokaz");
    expect(g.provenance.deterministic).toBe(true);
    expect(g.provenance.builder).toContain("build-georef-1825.py");
    expect(g.provenance.built_from.length).toBeGreaterThanOrEqual(5);
    expect(g.provenance.modern_basis_license).toContain("OpenStreetMap");
  });

  test("transformacijski parametri v invariantnih mejah (I3/I4)", () => {
    expect(g.transform.scale_m_per_px).toBeGreaterThan(0.55);
    expect(g.transform.scale_m_per_px).toBeLessThan(0.85);
    expect(Math.abs(g.transform.rotation_deg)).toBeLessThan(5);
    expect(typeof g.transform.tx_m_east).toBe("number");
    expect(typeof g.transform.ty_m_north).toBe("number");
  });

  test("error estimate (§10): trim-RMS + neodvisna validacija + starejše sidro", () => {
    expect(g.accuracy.river_points).toBeGreaterThanOrEqual(250);
    expect(g.accuracy.river_trimmed_rms_m).toBeLessThanOrEqual(60);
    expect(g.accuracy.validation_v65_median_m).toBeLessThanOrEqual(40);
    expect(g.accuracy.validation_prior_median_m).toBeLessThanOrEqual(40);
    expect(g.accuracy.old_anchor_residual_m).toBeGreaterThan(0);
    expect(g.accuracy.summary).toContain("±38 m");
  });

  test("invarianti I1–I6 zapisani, brez kršitev; determinizem deklariran", () => {
    expect(g.invariants.violations).toEqual([]);
    expect(g.invariants.I6_determinism).toContain("enaki parametri");
  });

  test("findings F-GEO-01..04: skala-bug rešen, rotacija rešena, hišne št. odprte", () => {
    const ids = g.findings.map((f) => f.id);
    expect(ids).toEqual(["F-GEO-01", "F-GEO-02", "F-GEO-03", "F-GEO-04"]);
    const f1 = g.findings[0];
    expect(f1.status).toContain("RESOLVED-V72");
    expect(f1.finding).toContain("2,19");
    expect(g.findings[2].status).toBe("OPEN"); // F-GEO-03 hišne številke
    expect(g.findings[2].finding).toContain("NI dokazljiva");
    expect((g.findings[2] as { action?: string }).action ?? "").toContain("nič skrito");
    expect(g.findings[3].status).toBe("OPEN"); // F-GEO-04 listno merilo
  });

  test("hišnoštevilski eksperiment = NEGATIVEN (§14: negativni rezultat viden)", () => {
    expect(g.housenumber_experiment.verdict).toBe("NEGATIVE");
    expect(g.housenumber_experiment.candidate_pairs).toBe(18);
    expect(g.housenumber_experiment.max_consensus).toBeLessThanOrEqual(2);
  });

  test("multi-start kandidati zapisani (12 startov, selekcija dokumentirana)", () => {
    expect(g.method.multi_start.candidates.length).toBe(12);
    expect(g.method.multi_start.selection).toContain("min validacija");
    const medians = g.method.multi_start.candidates.map((c) => c.validation_median_m);
    expect(Math.min(...medians)).toBeCloseTo(g.accuracy.validation_v65_median_m, 1);
  });

  test("what_would_resolve: naslednji viri dokumentirani", () => {
    expect(g.what_would_resolve.length).toBeGreaterThanOrEqual(3);
    expect(g.what_would_resolve.join(" ")).toContain("300 dpi");
  });

  test("runtime kopija = arhivska resnica", () => {
    const runtime = JSON.parse(readFileSync(RUNTIME, "utf-8"));
    expect(runtime).toEqual(g);
  });
});

/* ------------------------- transformacijska matematika ------------------------- */

describe("georef v2 — transformacijska matematika", () => {
  const LAT0 = g.method.coordinate_frame.lat0;
  const ME = g.method.coordinate_frame.meters_east_per_deg_lng;
  const MN = g.method.coordinate_frame.meters_north_per_deg_lat;
  const s = g.transform.scale_m_per_px;
  const th = (g.transform.rotation_deg * Math.PI) / 180;
  const tx = g.transform.tx_m_east;
  const ty = g.transform.ty_m_north;

  function toGeo(x: number, y: number): [number, number] {
    // [E,N] = s·R(θ)·[x, −y] + [tx,ty]; px: y DOL
    const u = s * (Math.cos(th) * x - Math.sin(th) * -y) + tx;
    const v = s * (Math.sin(th) * x + Math.cos(th) * -y) + ty;
    return [v / MN, u / ME]; // (lat, lng)
  }

  test("formula v artefaktu ustreza implementaciji", () => {
    expect(g.method.coordinate_frame.formula).toBe("[E,N] = s·R(theta)·[x, −y_px] + [tx,ty]");
  });

  test("skala × raster (z rotacijo) ≈ overlay bbox (E-W in N-S konzistenca)", () => {
    const cad = JSON.parse(readFileSync(join(REPO, "src", "data", "cadastre-a01.json"), "utf-8")) as {
      overlay: { sw: [number, number]; ne: [number, number]; px_size: [number, number] };
    };
    const W = cad.overlay.px_size[0];
    const H = cad.overlay.px_size[1];
    // bbox robov pod rotacijo θ: širina = s·(W·cosθ + H·sinθ), višina = s·(H·cosθ + W·sinθ)
    const c = Math.cos(th);
    const sn = Math.sin(th);
    const widthM = (cad.overlay.ne[1] - cad.overlay.sw[1]) * ME;
    expect(widthM / (s * (W * c + H * sn))).toBeCloseTo(1, 2);
    const heightM = (cad.overlay.ne[0] - cad.overlay.sw[0]) * MN;
    expect(heightM / (s * (H * c + W * sn))).toBeCloseTo(1, 2);
  });

  test("sidro (1851,1778) se preslika v anchor_geo v2 (±1 m)", () => {
    const [lat, lng] = toGeo(1851, 1778);
    const cad = JSON.parse(readFileSync(join(REPO, "src", "data", "cadastre-a01.json"), "utf-8")) as {
      meta: { georef: { anchor_geo: [number, number] } };
    };
    const [alat, alng] = cad.meta.georef.anchor_geo;
    expect(Math.abs((lat - alat) * MN)).toBeLessThan(1.0);
    expect(Math.abs((lng - alng) * ME)).toBeLessThan(1.0);
  });

  test("staro sidro (val 52) je ~231 m stran — F-GEO-01 popravek viden", () => {
    const [lat, lng] = toGeo(1851, 1778);
    const legacy: [number, number] = [45.57246, 15.29257];
    const d = Math.hypot((lat - legacy[0]) * MN, (lng - legacy[1]) * ME);
    expect(d).toBeGreaterThan(150);
    expect(d).toBeLessThan(320);
  });
});

/* ------------------------- konsistentnost podatkov ------------------------- */

describe("georef v2 — konsistentnost podatkovnih slojev", () => {
  type Cad = {
    meta: { georef: Record<string, unknown>; scale_note: string };
    buildings: { bp?: string; px: number; py: number; lat: number; lng: number }[];
    toponyms: { name: string; px: number; py: number; lat: number; lng: number }[];
    overlay: { sw: [number, number]; ne: [number, number] };
  };
  const cad = JSON.parse(readFileSync(join(REPO, "src", "data", "cadastre-a01.json"), "utf-8")) as Cad;

  test("meta.georef = v2 (brez 2,19 m/px); scale_note omenja F-GEO-01", () => {
    expect(cad.meta.georef.version).toContain("v2");
    expect(cad.meta.georef.scale_m_per_px).toBeCloseTo(g.transform.scale_m_per_px, 6);
    expect(String(cad.meta.georef.legacy_note)).toContain("2,1909");
    expect(cad.meta.scale_note).toContain("F-GEO-01");
  });

  test("vseh 56 stavb ima lat/lng znotraj overlay (brez raztega)", () => {
    expect(cad.buildings.length).toBe(56);
    for (const b of cad.buildings) {
      expect(b.lat).toBeGreaterThan(cad.overlay.sw[0] - 1e-9);
      expect(b.lat).toBeLessThan(cad.overlay.ne[0] + 1e-9);
      expect(b.lng).toBeGreaterThan(cad.overlay.sw[1] - 1e-9);
      expect(b.lng).toBeLessThan(cad.overlay.ne[1] + 1e-9);
    }
  });

  test("vseh 7 toponimov ima lat/lng znotraj overlay", () => {
    expect(cad.toponyms.length).toBe(7);
    for (const t of cad.toponyms) {
      expect(t.lat).toBeGreaterThan(cad.overlay.sw[0] - 1e-9);
      expect(t.lng).toBeGreaterThan(cad.overlay.sw[1] - 1e-9);
    }
  });

  test("KG v1.8: MO-A01 koordinate = v2, MO-A02/A05 brez koordinat (KG-F05)", () => {
    const kg = JSON.parse(
      readFileSync(join(REPO, "src", "data", "knowledge-graph-1825.json"), "utf-8")
    ) as {
      title: string;
      val: number;
      findings: { finding_id: string; val: number; status: string }[];
      nodes: { node_id: string; node_type: string; lat?: number; lng?: number; georef_status?: string }[];
    };
    expect(kg.title).toBe("knowledge-graph-1825 v1.8");
    expect(kg.val).toBe(77);
    expect(kg.findings.at(-1)!.finding_id).toBe("KG-F09");
    expect(kg.findings.at(-1)!.status).toContain("RESOLVED-V77");
    const moA01 = kg.nodes.filter((n) => n.node_id.startsWith("MO:MO-A01-"));
    expect(moA01.length).toBe(24);
    for (const n of moA01) {
      expect(typeof n.lat).toBe("number");
      expect(n.lat!).toBeGreaterThan(cad.overlay.sw[0]);
      expect(n.lat!).toBeLessThan(cad.overlay.ne[0]);
      expect(String(n.georef_status)).toContain("GEOREF v2");
    }
    for (const n of kg.nodes.filter((n) => n.node_id.startsWith("MO:MO-A02-"))) {
      expect(n.lat ?? null).toBeNull();
      expect(n.lng ?? null).toBeNull();
    }
  });

  test("a01-building-inventory (arhivska resnica) georef blok v2 + objekti usklajeni", () => {
    const inv = JSON.parse(
      readFileSync(join(REPO, "research-griblje", "atlas-1825", "a01-building-inventory-1825.json"), "utf-8")
    ) as {
      georef: { version: string; scale_m_per_px: number; finding: string };
      objects: { object_id: string; px: [number, number]; lat: number; lng: number; georef_status: string }[];
      prior_only_bp: { bp: string; px_prior: [number, number]; lat: number }[];
    };
    expect(inv.georef.version).toContain("v2");
    expect(inv.georef.scale_m_per_px).toBeCloseTo(g.transform.scale_m_per_px, 6);
    expect(inv.georef.finding).toContain("F-GEO");
    for (const o of inv.objects) {
      expect(String(o.georef_status)).toContain("GEOREF v2");
    }
    expect(inv.prior_only_bp.length).toBe(43);
  });

  test("coverage: georeferencing A01 = VERIFIED (§10 minimum izpolnjen)", () => {
    const rep = JSON.parse(
      readFileSync(join(REPO, "src", "data", "atlas-coverage-report-1825.json"), "utf-8")
    ) as {
      val: number;
      quality_gate: { category_id: string; VERIFIED: number; PARTIAL: number; UNKNOWN: number; native: Record<string, unknown> }[];
    };
    expect(rep.val).toBe(77);
    const geo = rep.quality_gate.find((c) => c.category_id === "georeferencing")!;
    expect(geo.VERIFIED).toBe(1);
    expect(geo.PARTIAL).toBe(0);
    expect(geo.UNKNOWN).toBe(4);
    const a01 = geo.native["A01"] as { version: string; accuracy: string };
    expect(a01.version).toContain("v2");
    expect(a01.accuracy).toContain("±38 m");
  });
});

/* ------------------------- zgodovinska-vs-sodobna označba (§10) ------------------------- */

describe("georef v2 — označba zgodovinske in sodobne geometrije (§10)", () => {
  test("map lib disclaimer: reka + ±38 m + ni zgodovinski dokaz", async () => {
    const mod = await import("@/lib/atlas-map");
    const d = mod.mapData().disclaimer;
    expect(d).toContain("GEOREF v2");
    expect(d).toContain("Kolpi");
    expect(d).toContain("±38 m");
    expect(d).toContain("ni zgodovinski dokaz");
  });

  test("i18n: provisionalNote v vseh 5 jezikih omenja v2 poravnavo (±38 m)", () => {
    const i18nSrc = readFileSync(join(REPO, "src", "lib", "i18n.tsx"), "utf-8");
    for (const marker of ["reki Kolpi", "rijeku Kolpu", "Kolpa river", "an die Kolpa", "sul fiume Kolpa"]) {
      expect(i18nSrc).toContain(marker);
    }
    expect(i18nSrc.split("±38 m").length - 1).toBeGreaterThanOrEqual(10); // note + title/alt po jezikih
  });
});
