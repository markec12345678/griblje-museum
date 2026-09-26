/**
 * ATLAS 1825 — PASS 8 testi (issue #42 §23 QUALITY GATE + §24 outputi, val 70).
 *
 * Načelo: coverage report je determinističen izvod registrov + KG v1.4
 * (piše ga build-coverage-report.py; ročno urejanje prepovedano).
 * §23 zahteva 18 kategorij × šeststatusna shema
 * TOTAL / VERIFIED / PARTIAL / CONFLICT / UNKNOWN / NOT_FOUND — vsota
 * statusov = total (I1). §24 zahteva 14 obveznih outputov — vse datoteke
 * morajo obstajati na disku (I2). Noben procent (I3). NOT_FOUND ≠ dokaz
 * neobstoja (I5, issue #42 §3/§7).
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  coverageCategory,
  coverageOutputs,
  coverageOverview,
  unknownsBreakdown,
  validCategoryIds,
} from "@/lib/atlas-coverage";
import kg from "@/data/knowledge-graph-1825.json";

type CoverageFile = {
  val: number;
  pass: string;
  issue: number;
  deterministic: boolean;
  provenance: { built_from: string[]; kg_sha256: string; runtime_copy: string };
  invariants_enforced: string[];
  quality_gate: {
    category_id: string;
    title: string;
    total: number;
    VERIFIED: number;
    PARTIAL: number;
    CONFLICT: number;
    UNKNOWN: number;
    NOT_FOUND: number;
    native: Record<string, unknown>;
    mapping_rule: string;
    evidence: string[];
    note?: string;
    not_found_note?: string;
  }[];
  outputs_manifest: {
    count: number;
    outputs: { name: string; file: string; status: string; derived_from: string[] }[];
  };
};

const REPO = process.cwd();
const ARTEFACT_DIR = join(REPO, "research-griblje", "atlas-1825");

function loadReport(): CoverageFile {
  return JSON.parse(
    readFileSync(join(ARTEFACT_DIR, "coverage-report-1825.json"), "utf-8")
  ) as CoverageFile;
}

const rep = loadReport();

/* ------------------------------ §23 struktura ------------------------------ */

describe("quality_gate — §23 struktura", () => {
  test("točno 18 kategorij (§23 seznam)", () => {
    expect(rep.quality_gate.length).toBe(18);
  });

  test("vse kategorije imajo izrecen mapping_rule + evidence pointers (I4)", () => {
    for (const c of rep.quality_gate) {
      expect(c.mapping_rule.length).toBeGreaterThan(10);
      expect(c.evidence.length).toBeGreaterThan(0);
    }
  });

  test("I1: vsota šestih statusov == total za vsako kategorijo", () => {
    for (const c of rep.quality_gate) {
      const sum = c.VERIFIED + c.PARTIAL + c.CONFLICT + c.UNKNOWN + c.NOT_FOUND;
      expect(sum).toBe(c.total);
    }
  });

  test("I3: noben procent — umetna popolnost prepovedana", () => {
    const raw = readFileSync(join(ARTEFACT_DIR, "coverage-report-1825.json"), "utf-8");
    expect(raw.includes('"%"')).toBe(false);
    expect(/"coverage_percent"|"percent"/.test(raw)).toBe(false);
  });

  test("I5: vsaka kategorija z NOT_FOUND > 0 nosi opombo '≠ dokaz neobstoja'", () => {
    for (const c of rep.quality_gate) {
      if (c.NOT_FOUND > 0) {
        expect(c.not_found_note).toBeDefined();
        expect(c.not_found_note).toContain("dokaz neobstoja");
      }
    }
  });

  test("invarianti I1–I5 so dokumentirani v reportu", () => {
    expect(rep.invariants_enforced.length).toBe(5);
    expect(rep.invariants_enforced[0]).toContain("I1");
    expect(rep.invariants_enforced[4]).toContain("I5");
  });

  test("provenanca kaže na KG v1.7 (val 75 — PZ Konskripcija delno prepisana) in runtime kopijo", () => {
    expect(rep.provenance.kg_sha256.startsWith("b150db193957e173")).toBe(true);
    expect(rep.provenance.runtime_copy).toBe("src/data/atlas-coverage-report-1825.json");
    expect(rep.provenance.built_from.length).toBe(14);
  });
});

/* ------------------------- §23 številčne resnice ------------------------- */

describe("quality_gate — številčne resnice iz registrov", () => {
  const byId = (id: string) => {
    const c = rep.quality_gate.find((x) => x.category_id === id);
    expect(c).toBeDefined();
    return c!;
  };

  test("PUA vnosi: 98 (45 VERIFIED-2x / 25 REVIEW / 28 REVIEW-CONFLICT)", () => {
    const c = byId("pua_entries");
    expect(c.total).toBe(98);
    expect(c.VERIFIED).toBe(45);
    expect(c.PARTIAL).toBe(25);
    expect(c.CONFLICT).toBe(28);
  });

  test("hiše: 167 (49 CONFLICT / 45 PARTIAL / 73 UNKNOWN)", () => {
    const c = byId("houses");
    expect(c.total).toBe(167);
    expect(c.CONFLICT).toBe(49);
    expect(c.PARTIAL).toBe(45); // PARTIAL 13 + SINGLE_SOURCE 32
    expect(c.UNKNOWN).toBe(73);
    expect(c.VERIFIED).toBe(0);
  });

  test("PT vrstice + BP 1–100: 100 (40 STABLE / 9 REVIEW / 51 REVIEW-CONFLICT)", () => {
    for (const id of ["pt_rows", "bp_1_100"]) {
      const c = byId(id);
      expect(c.total).toBe(100);
      expect(c.VERIFIED).toBe(40);
      expect(c.PARTIAL).toBe(9);
      expect(c.CONFLICT).toBe(51);
    }
  });

  test("BP↔hiša: FOUND 2 / UNCERTAIN 39 / CONFLICT 54 / NOT_FOUND 5 (val 59 sodba)", () => {
    const c = byId("bp_house_binding");
    expect(c.VERIFIED).toBe(2);
    expect(c.PARTIAL).toBe(39);
    expect(c.CONFLICT).toBe(54);
    expect(c.NOT_FOUND).toBe(5);
  });

  test("BP↔A01: 9 VERIFIED (CLEAR glife), A02 kandidati brez sidra = UNKNOWN, 37 NOT_FOUND", () => {
    const c = byId("bp_a01_binding");
    expect(c.VERIFIED).toBe(9);
    expect(c.CONFLICT).toBe(30); // prior val57 CONFLICT
    expect(c.UNKNOWN).toBe(6); // 3 CANDIDATE (42/87/88) + 3 A02 kandidati (12/20/22)
    expect(c.NOT_FOUND).toBe(37);
    const native = c.native as { located_unique_total: number; located_a02_candidates_unique: number };
    expect(native.located_unique_total).toBe(63); // 17 v65 unikat + 43 prior + 3 A02
    expect(native.located_a02_candidates_unique).toBe(3);
  });

  test("parcele: 2467 = PUA 2035 (907 VER / 675 PART / 453 CONF) + PS 432 PARTIAL", () => {
    const c = byId("parcels");
    expect(c.total).toBe(2467);
    expect(c.VERIFIED).toBe(907);
    expect(c.PARTIAL).toBe(1107); // PUA REVIEW 675 + PS 432
    expect(c.CONFLICT).toBe(453);
  });

  test("parcelna geometrija: 0 dokumentiranih meja (nič 'lepih' parcel, §9)", () => {
    const c = byId("parcel_geometry");
    expect(c.total).toBe(2467);
    expect(c.NOT_FOUND).toBe(2467);
    expect(c.VERIFIED).toBe(0);
  });

  test("osebe = lastniki: 488, 161 possible_duplicates NI združenih (§5)", () => {
    for (const id of ["owners", "persons"]) {
      const c = byId(id);
      expect(c.total).toBe(488);
      expect(c.VERIFIED).toBe(140); // VERIFIED-2x 45 + STABLE 95
      expect(c.CONFLICT).toBe(150);
    }
    const note = byId("persons").note ?? "";
    expect(note).toContain("en register");
  });

  test("A01 stavbe: 67 = 24 v65 (9 CLEAR) + 43 prior-only", () => {
    const c = byId("a01_buildings");
    expect(c.total).toBe(67);
    expect(c.VERIFIED).toBe(9);
    expect(c.PARTIAL).toBe(48); // PROBABLE 5 + prior 43
    expect(c.UNKNOWN).toBe(10); // CANDIDATE 4 + UNRESOLVED 2 + UNIDENTIFIED 2 + UNREADABLE 1 + (1 objekt brez BP glife tier UNIDENTIFIED)
    const native = c.native as { objects_v65: number; prior_only_bp: number; red_glyphs_catalog: number };
    expect(native.objects_v65).toBe(24);
    expect(native.prior_only_bp).toBe(43);
    expect(native.red_glyphs_catalog).toBe(8);
  });

  test("katastrski listi: 5/5 inventariziranih; A01 georef v2 + A03/A04 negativni = VERIFIED", () => {
    const c = byId("cadastral_sheets");
    expect(c.total).toBe(5);
    expect(c.VERIFIED).toBe(3);
    expect(c.PARTIAL).toBe(2);
  });

  test("toponimi: 37 (11 VERIFIED_FORM / 26 PROVISIONAL)", () => {
    const c = byId("toponyms");
    expect(c.total).toBe(37);
    expect(c.VERIFIED).toBe(11);
    expect(c.PARTIAL).toBe(26);
  });

  test("viri: 13 SOURCE nodes (10 VERIFIED, 3 PARTIAL — PR/PG brez prepisa; PZ delni prepis val 75; PV prepisan val 74)", () => {
    const c = byId("sources");
    expect(c.total).toBe(13);
    expect(c.VERIFIED).toBe(10);
    expect(c.PARTIAL).toBe(3);
  });

  test("konflikti: 113 (108 OPEN vidnih, 1 RESOLVED)", () => {
    const c = byId("unresolved_conflicts");
    expect(c.total).toBe(113);
    expect(c.CONFLICT).toBe(108);
    expect(c.VERIFIED).toBe(1);
  });

  test("negativni rezultati: 13, vsi dokumentirani", () => {
    const c = byId("negative_results");
    expect(c.total).toBe(13);
    expect(c.VERIFIED).toBe(13);
  });

  test("georeferenca: A01 VERIFIED (GEOREF v2 ±38 m, val 72), A02–A05 UNKNOWN", () => {
    const c = byId("georeferencing");
    expect(c.total).toBe(5);
    expect(c.PARTIAL).toBe(0);
    expect(c.UNKNOWN).toBe(4);
    expect(c.VERIFIED).toBe(1);
  });

  test("neznanke: prečni agregat vsakega vira natanko 1×", () => {
    const c = byId("unknowns");
    const agg = (c.native as { aggregate: { count: number }[] }).aggregate;
    expect(agg.reduce((s, a) => s + a.count, 0)).toBe(c.total);
  });
});

/* ------------------------------ §24 manifest ------------------------------ */

describe("outputs_manifest — §24 obvezni outputi 1–14", () => {
  test("točno 14 outputov", () => {
    expect(rep.outputs_manifest.count).toBe(14);
    expect(rep.outputs_manifest.outputs.length).toBe(14);
  });

  test("I2: vsaka datoteka obstaja na disku", () => {
    for (const o of rep.outputs_manifest.outputs) {
      expect(existsSync(join(REPO, o.file))).toBe(true);
    }
  });

  test("vsak output ima derived_from (izpeljiva resnica)", () => {
    for (const o of rep.outputs_manifest.outputs) {
      expect(o.derived_from.length).toBeGreaterThan(0);
    }
  });

  test("izpeljani artefakti tega vala obstajajo in so deterministični", () => {
    for (const f of [
      "a01-coverage-1825.json",
      "cadastral-sheet-coverage-1825.json",
      "source-coverage-1825.json",
      "atlas-map-data-model-1825.json",
      "story-engine-spec-1825.json",
    ]) {
      const p = join(ARTEFACT_DIR, f);
      expect(existsSync(p)).toBe(true);
      const d = JSON.parse(readFileSync(p, "utf-8"));
      expect(d.deterministic).toBe(true);
      // pv-land-use-1825.json (val 74) + pz-konskripcija-1830.json (val 75) + izpeljani artefakti nosijo svoj val
      expect([72, 74, 75]).toContain(d.val);
    }
  });

  test("story-engine-spec nosi §17 tiri + §22 pogodbo + determinizem (brez LLM)", () => {
    const spec = JSON.parse(
      readFileSync(join(ARTEFACT_DIR, "story-engine-spec-1825.json"), "utf-8")
    );
    expect(spec.architecture).toContain("BREZ LLM");
    expect(spec.contract_issue_22.some((s: string) => s.startsWith("story_id"))).toBe(true);
    expect(spec.contract_issue_22.some((s: string) => s.startsWith("content_hash"))).toBe(true);
    expect(Object.keys(spec.tier_mapping_issue_17).length).toBe(4);
  });

  test("a01-coverage matrica pokrije 100 BP z not_found opombo", () => {
    const cov = JSON.parse(readFileSync(join(ARTEFACT_DIR, "a01-coverage-1825.json"), "utf-8"));
    expect(Object.keys(cov.matrix).length).toBe(63);
    expect(cov.bp_total).toBe(100);
    expect(cov.not_found_note).toContain("dokaz");
  });
});

/* ------------------------------ runtime kopija ------------------------------ */

describe("runtime kopija (src/data) = arhivska resnica", () => {
  test("src/data/atlas-coverage-report-1825.json obstaja in je istovetna", () => {
    const runtimePath = join(REPO, "src", "data", "atlas-coverage-report-1825.json");
    expect(existsSync(runtimePath)).toBe(true);
    const runtime = JSON.parse(readFileSync(runtimePath, "utf-8")) as CoverageFile;
    expect(runtime.provenance.kg_sha256).toBe(rep.provenance.kg_sha256);
    expect(runtime.quality_gate.length).toBe(18);
    expect(runtime.outputs_manifest.count).toBe(14);
  });
});

/* --------------------------------- lib/API --------------------------------- */

describe("lib/atlas-coverage (API plast)", () => {
  test("overview: 18 kategorij, 14 outputov, vsote konsistentne", () => {
    const o = coverageOverview();
    expect(o.quality_gate.length).toBe(18);
    expect(o.summary.categories).toBe(18);
    expect(o.summary.outputs).toBe(14);
    expect(o.summary.entities_total).toBe(
      rep.quality_gate.reduce((s, c) => s + c.total, 0)
    );
    expect(o.summary.VERIFIED).toBe(
      rep.quality_gate.reduce((s, c) => s + c.VERIFIED, 0)
    );
  });

  test("kategorija: houses (detail + mapping_rule)", () => {
    const c = coverageCategory("houses");
    expect(c).not.toBeNull();
    expect(c!.total).toBe(167);
    expect(c!.mapping_rule).toContain("SINGLE_SOURCE");
  });

  test("kategorija: veljavnost brez velikih/malih črk, neznan = null", () => {
    expect(coverageCategory("HOUSES")).not.toBeNull();
    expect(coverageCategory("neobstaja")).toBeNull();
    expect(validCategoryIds().length).toBe(18);
  });

  test("outputs: §24 manifest s 14 zapisi", () => {
    const m = coverageOutputs();
    expect(m.count).toBe(14);
    expect(m.outputs.map((o) => o.name)).toContain("coverage-report-1825");
  });

  test("unknowns: agregat z rule + total", () => {
    const u = unknownsBreakdown();
    expect(u).not.toBeNull();
    expect(u!.aggregate.length).toBe(9);
    expect(u!.total).toBe(
      u!.aggregate.reduce((s, a) => s + a.count, 0)
    );
  });
});

/* ----------------------- uskladjenost z KG v1.4 ----------------------- */

describe("uskladjenost z KG v1.4", () => {
  test("node_stats sovpadajo s kategorijami (hiše/osebe/parcele/toponimi/BP)", () => {
    const kgf = kg as unknown as { node_stats: Record<string, number>; provenance: { kg_sha256?: string } };
    expect(kgf.node_stats.HOUSE).toBe(167);
    expect(kgf.node_stats.PERSON).toBe(488);
    expect(kgf.node_stats.PARCEL).toBe(2467);
    expect(kgf.node_stats.BP).toBe(100);
    expect(kgf.node_stats.TOPONYM).toBe(37);
    expect(kgf.node_stats.SOURCE).toBe(13);
  });

  test("kg_sha256 v coverage reportu = sha256 v KG provenanci", () => {
    const kgf = kg as unknown as { provenance: { kg_sha256?: string } };
    if (kgf.provenance?.kg_sha256) {
      expect(rep.provenance.kg_sha256).toBe(kgf.provenance.kg_sha256);
    }
  });
});
