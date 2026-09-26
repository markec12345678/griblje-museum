import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import {
  axisPosition,
  timelineAxis,
  timelineOverview,
  timelinePoint,
  timelinePoints,
} from "../src/lib/atlas-timeline";
import kgRaw from "../src/data/knowledge-graph-1825.json";

/**
 * Val 76 — ATLAS 1825 §20 TIME SLIDER (časovne točke vasi).
 *
 * Testi NE zaupajo builderju build-timeline-1825-1830.py: aritmetična vrata
 * I1 (prebivalstvo) in I2 (površina PZ↔PV) ter zatiči I6 (KG parcele) so
 * preverjena NEODVISNO v TS iz surovih virov. Pogodba §20: točka brez vira
 * = AWAITING_SOURCE brez metrik; nič interpolacij med točkami (§4).
 */

const REPO = join(import.meta.dir, "..");

type TimelineMetric = {
  metric_id: string;
  value: number;
  unit: string;
  display: string;
  source_id: string;
  evidence: string;
  reading_status: string;
  note?: string;
};

type TimelinePointT = {
  year: number;
  status: string;
  label: string;
  kind: string;
  source_ids: string[];
  metrics: TimelineMetric[];
  absent_metrics: { metric_id: string; reason: string }[];
  expected_basis?: string;
  note?: string | null;
};

type TimelineDocT = {
  val: number;
  pass: string;
  issue: number;
  deterministic: boolean;
  title: string;
  contract: { statuses: Record<string, string>; rules: string[] };
  provenance: { built_from: string[]; kg_sha256: string; runtime_copy: string };
  invariants_enforced: string[];
  summary: {
    points_total: number;
    documented: number;
    awaiting_source: number;
    years: number[];
    expected_census_years: number[];
  };
  points: TimelinePointT[];
};

const tl = JSON.parse(
  readFileSync(join(REPO, "src/data/timeline-1825-1830.json"), "utf-8")
) as TimelineDocT;

const archiveRaw = readFileSync(
  join(REPO, "research-griblje/atlas-1825/timeline-1825-1830.json")
);
const runtimeRaw = readFileSync(join(REPO, "src/data/timeline-1825-1830.json"));

const pz = JSON.parse(
  readFileSync(
    join(REPO, "research-griblje", "atlas-1825", "pz-konskripcija-1830.json"),
    "utf-8"
  )
) as unknown as {
  bevoelkerung_1830: {
    maenner: number;
    weiber: number;
    zusammen_seelen: number;
    haeuser: number;
    familien: number;
  };
  viehstand_1830: {
    rows: { count: number; species_read: string; species_status: string }[];
  };
  area_total: { red_corrected_qklft: number; delta_pct: number };
  weingaerten: { einzelne_classe: { joch: number; klafter: number } };
};

const pv = JSON.parse(
  readFileSync(
    join(REPO, "research-griblje", "atlas-1825", "pv-land-use-1825.json"),
    "utf-8"
  )
) as unknown as {
  totals: {
    grand_quadrat_klafter: number;
    grand_written: { joch: number; klafter: number };
  };
  table1_kulturen: { key: string; joch: number; klafter: number; quadrat_klafter: number }[];
};

const kg = kgRaw as unknown as {
  nodes: { node_id: string; node_type: string; origin?: string; land_use_category?: string | null }[];
};

function pointOf(year: number): TimelinePointT {
  const p = tl.points.find((x) => x.year === year);
  if (!p) throw new Error(`točka ${year} manjka`);
  return p;
}

function metricOf(year: number, metric_id: string): TimelineMetric {
  const m = pointOf(year).metrics.find((x) => x.metric_id === metric_id);
  if (!m) throw new Error(`metrika ${metric_id} (${year}) manjka`);
  return m;
}

describe("val 76+77 — timeline §20: schema + pogodba", () => {
  test("I5: letnice strogo naraščajoče in unikatne", () => {
    const years = tl.points.map((p) => p.year);
    const sorted = [...years].sort((a, b) => a - b);
    expect(years).toEqual(sorted);
    expect(new Set(years).size).toBe(years.length);
  });

  test("I4: statusi samo DOCUMENTED | AWAITING_SOURCE", () => {
    for (const p of tl.points) {
      expect(["DOCUMENTED", "AWAITING_SOURCE"]).toContain(p.status);
    }
  });

  test("I4: AWAITING_SOURCE točke imajo 0 metrik in 0 virov, nosijo expected_basis", () => {
    const awaiting = tl.points.filter((p) => p.status === "AWAITING_SOURCE");
    expect(awaiting.length).toBeGreaterThan(0);
    for (const p of awaiting) {
      expect(p.metrics).toHaveLength(0);
      expect(p.source_ids).toHaveLength(0);
      expect(typeof p.expected_basis).toBe("string");
      expect(p.expected_basis!.length).toBeGreaterThan(10);
    }
  });

  test("I4: DOCUMENTED točke imajo vsaj eno metriko", () => {
    const documented = tl.points.filter((p) => p.status === "DOCUMENTED");
    for (const p of documented) expect(p.metrics.length).toBeGreaterThan(0);
  });

  test("pogodba: pravilo brez interpolacij + AWAITING_SOURCE pravilo sta izpisana", () => {
    const rules = tl.contract.rules.join(" ");
    expect(rules).toContain("NIKOLI ne interpolirajo");
    expect(rules).toContain("AWAITING_SOURCE");
    expect(tl.contract.statuses.DOCUMENTED.length).toBeGreaterThan(0);
    expect(tl.contract.statuses.AWAITING_SOURCE.length).toBeGreaterThan(0);
  });

  test("povzetek: 8 točk — 2 dokumentirani (1825 + 1830), 6 pričakovanih", () => {
    expect(tl.summary.points_total).toBe(8);
    expect(tl.summary.documented).toBe(2);
    expect(tl.summary.awaiting_source).toBe(6);
    expect(tl.summary.years).toEqual([1825, 1830, 1857, 1869, 1880, 1890, 1900, 1910]);
    expect(tl.summary.expected_census_years).toEqual([
      1857, 1869, 1880, 1890, 1900, 1910,
    ]);
  });

  test("val + determinizem + nič ročnega urejanja", () => {
    expect(tl.val).toBe(77);
    expect(tl.issue).toBe(42);
    expect(tl.deterministic).toBe(true);
    expect(tl.invariants_enforced.length).toBeGreaterThanOrEqual(6);
  });
});

describe("val 76+77 — vrata I1/I2 neodvisno iz surovih virov", () => {
  test("I1: prebivalstvo 1830 = 222 M + 219 Ž = 441 (aritmetika iz PZ)", () => {
    expect(pz.bevoelkerung_1830.maenner + pz.bevoelkerung_1830.weiber).toBe(
      pz.bevoelkerung_1830.zusammen_seelen
    );
    expect(pz.bevoelkerung_1830.zusammen_seelen).toBe(441);
    expect(metricOf(1830, "population_total").value).toBe(441);
    expect(metricOf(1830, "population_men").value).toBe(222);
    expect(metricOf(1830, "population_women").value).toBe(219);
  });

  test("hiše 70 + družine 102 v točki 1830 = surovi PZ", () => {
    expect(pz.bevoelkerung_1830.haeuser).toBe(70);
    expect(pz.bevoelkerung_1830.familien).toBe(102);
    expect(metricOf(1830, "houses").value).toBe(70);
    expect(metricOf(1830, "families").value).toBe(102);
  });

  test("živina 1830 = surovi PZ, REVIEW vrsti ohranjeni", () => {
    expect(metricOf(1830, "livestock_ochsen").value).toBe(124);
    expect(metricOf(1830, "livestock_schafe").value).toBe(150);
    const kuehe = metricOf(1830, "livestock_kuehe_rosse");
    const laemmer = metricOf(1830, "livestock_laemmer");
    expect(kuehe.value).toBe(20);
    expect(kuehe.reading_status).toBe("REVIEW");
    expect(laemmer.value).toBe(30);
    expect(laemmer.reading_status).toBe("REVIEW");
    // surovi PZ mora imeti enake statusa (nikoli tiho dokazano)
    const rawKuehe = pz.viehstand_1830.rows.find((r) => r.species_read === "Kühe | Rosse");
    const rawLaemmer = pz.viehstand_1830.rows.find((r) => r.species_read === "Lämmer[?]");
    expect(rawKuehe?.species_status).toBe("REVIEW");
    expect(rawLaemmer?.species_status).toBe("REVIEW");
    expect(metricOf(1830, "livestock_schafe").value).toBe(
      pz.viehstand_1830.rows.find((r) => r.species_read === "Schafe gesamt")!.count
    );
  });

  test("I2: površina PZ ↔ PV prečno validirana (Δ < 1 %, dokumentirano 0,086 %)", () => {
    const delta =
      Math.abs(pz.area_total.red_corrected_qklft - pv.totals.grand_quadrat_klafter) /
      pv.totals.grand_quadrat_klafter;
    expect(delta).toBeLessThan(0.01);
    expect(Math.round(delta * 10000) / 100).toBeCloseTo(0.09, 1);
    expect(metricOf(1830, "commune_area").value).toBe(pz.area_total.red_corrected_qklft);
    expect(metricOf(1825, "commune_area").value).toBe(pv.totals.grand_quadrat_klafter);
  });

  test("vinogradi: 1825 (PV 7 J 665 K) in 1830 (PZ 7 J 42 K = 11.242 QKlft) ločeni, obe z virom", () => {
    const wein1825 = pv.table1_kulturen.find((r) => r.key === "wein_garten")!;
    expect(metricOf(1825, "vineyard_area").value).toBe(wein1825.quadrat_klafter);
    expect(wein1825.joch).toBe(7);
    const wein1830 = metricOf(1830, "vineyard_area");
    expect(wein1830.value).toBe(pz.weingaerten.einzelne_classe.joch * 1600 + pz.weingaerten.einzelne_classe.klafter);
    expect(pz.weingaerten.einzelne_classe.joch).toBe(7); // Joch ujemanje
    expect(pz.weingaerten.einzelne_classe.klafter).toBe(42);
  });
});

describe("val 76+77 — vrata I3/I6: sledljivost + KG zatiči", () => {
  test("I3: vsaka metrika ima veljaven KG SOURCE, evidence in znan reading_status", () => {
    const sourceIds = new Set(
      kg.nodes.filter((n) => n.node_type === "SOURCE").map((n) => n.node_id)
    );
    for (const p of tl.points) {
      for (const m of p.metrics) {
        expect(sourceIds.has(m.source_id)).toBe(true);
        expect(m.evidence.length).toBeGreaterThan(3);
        expect(["TRANSCRIBED", "REVIEW"]).toContain(m.reading_status);
        expect(m.display.length).toBeGreaterThan(0);
      }
    }
  });

  test("I6: KG zatiči PUA 2035 / PS 432 / raba 326+106 = vrednosti metrik", () => {
    const parcels = kg.nodes.filter((n) => n.node_type === "PARCEL");
    const pua = parcels.filter((n) => n.origin === "PUA").length;
    const ps = parcels.filter((n) => n.origin === "PS").length;
    const psUse = parcels.filter(
      (n) => n.origin === "PS" && n.land_use_category !== null && n.land_use_category !== "UNKNOWN"
    ).length;
    expect(pua).toBe(2035);
    expect(ps).toBe(432);
    expect(psUse).toBe(326);
    expect(metricOf(1825, "parcels_pua").value).toBe(pua);
    expect(metricOf(1825, "parcels_ps").value).toBe(ps);
    expect(metricOf(1825, "parcels_with_land_use").value).toBe(psUse);
  });

  test("1825: prebivalstvo/hiše/družine so IZRECNO absent (ni tihih presledkov)", () => {
    const absent = pointOf(1825).absent_metrics.map((a) => a.metric_id);
    expect(absent).toContain("population_total");
    expect(absent).toContain("houses");
    expect(absent).toContain("families");
    expect(pointOf(1825).metrics.find((m) => m.metric_id === "population_total")).toBeUndefined();
  });

  test("1830: delež pašnikov izrecno absent (F-PZ-04 EXPLAINED-V77 — REVIEW števke, nič vsiljeno)", () => {
    const absent = pointOf(1830).absent_metrics.map((a) => a.metric_id);
    expect(absent).toContain("pasture_share");
    const reason = pointOf(1830).absent_metrics.find(
      (a) => a.metric_id === "pasture_share"
    )?.reason;
    expect(reason).toContain("EXPLAINED-V77");
    expect(reason).toContain("§8");
    expect(pointOf(1830).metrics.find((m) => m.metric_id === "pasture_share")).toBeUndefined();
  });

  test("runtime kopija == arhivska datoteka (bajtno identični)", () => {
    expect(runtimeRaw.equals(archiveRaw)).toBe(true);
  });

  test("kg_sha256 v provenanci == sha256 KG datoteke", () => {
    const sha = createHash("sha256")
      .update(readFileSync(join(REPO, "src/data/knowledge-graph-1825.json")))
      .digest("hex");
    expect(tl.provenance.kg_sha256).toBe(sha);
  });
});

describe("val 76+77 — čista plast (src/lib/atlas-timeline.ts)", () => {
  test("timelinePoint: 1830 najdena, neznana letnica null, neštevilčno null", () => {
    expect(timelinePoint(1830)?.status).toBe("DOCUMENTED");
    expect(timelinePoint(1824)).toBeNull();
    expect(timelinePoint(Number("abc"))).toBeNull();
  });

  test("timelineAxis: 8 vhodov, sorted, samo leto+status", () => {
    const axis = timelineAxis();
    expect(axis).toHaveLength(8);
    expect(axis[0]).toEqual({ year: 1825, status: "DOCUMENTED" });
    expect(axis[7].year).toBe(1910);
  });

  test("timelinePoints + overview skladni z dokumentom", () => {
    expect(timelinePoints()).toHaveLength(tl.points.length);
    const ov = timelineOverview();
    expect(ov.val).toBe(77);
    expect(ov.summary.documented).toBe(2);
    expect(ov.points).toHaveLength(8);
  });

  test("axisPosition: znotraj 0–100, naraščajoča po letnicah, meje zavarovane", () => {
    const a = axisPosition(1825, 1825, 1910);
    const b = axisPosition(1830, 1825, 1910);
    const c = axisPosition(1910, 1825, 1910);
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
    for (const v of [a, b, c]) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
    expect(axisPosition(1900, 1900, 1900)).toBe(50); // degenerirana os
  });
});
