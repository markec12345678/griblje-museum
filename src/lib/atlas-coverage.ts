/**
 * ATLAS 1825 — Coverage Report (issue #42 §23 QUALITY GATE + §24 outputi).
 *
 * Čista, deterministična plast nad coverage-report-1825.json (piše
 * research-griblje/atlas-1825/build-coverage-report.py — ročno urejanje
 * prepovedano). Nič ne ugiba: vrne samo izračunano šeststatusno shemo
 * TOTAL / VERIFIED / PARTIAL / CONFLICT / UNKNOWN / NOT_FOUND po kategorijah
 * + manifest §24 obveznih outputov 1–14. NIČ umetnih procentov (issue #43 §10).
 */
import reportRaw from "@/data/atlas-coverage-report-1825.json";

export type CoverageCategory = {
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
};

export type CoverageOutput = {
  name: string;
  file: string;
  status: string;
  derived_from: string[];
  note?: string;
};

export type CoverageReport = {
  val: number;
  pass: string;
  issue: number;
  title: string;
  spec: string;
  deterministic: boolean;
  regenerable: string;
  provenance: {
    built_from: string[];
    kg_sha256: string;
    runtime_copy: string;
    note: string;
  };
  invariants_enforced: string[];
  quality_gate: CoverageCategory[];
  outputs_manifest: { spec: string; count: number; outputs: CoverageOutput[] };
  definition_of_done_status: Record<string, unknown>;
};

const report = reportRaw as unknown as CoverageReport;

/** category_id → kategorija (O(1) indeks) */
const categoryIndex = new Map<string, CoverageCategory>(
  report.quality_gate.map((c) => [c.category_id, c])
);

export function coverageOverview() {
  const totals = report.quality_gate.reduce(
    (acc, c) => {
      acc.entities_total += c.total;
      acc.VERIFIED += c.VERIFIED;
      acc.PARTIAL += c.PARTIAL;
      acc.CONFLICT += c.CONFLICT;
      acc.UNKNOWN += c.UNKNOWN;
      acc.NOT_FOUND += c.NOT_FOUND;
      return acc;
    },
    { entities_total: 0, VERIFIED: 0, PARTIAL: 0, CONFLICT: 0, UNKNOWN: 0, NOT_FOUND: 0 }
  );
  return {
    title: report.title,
    spec: report.spec,
    val: report.val,
    pass: report.pass,
    issue: report.issue,
    deterministic: report.deterministic,
    regenerable: report.regenerable,
    provenance: report.provenance,
    invariants_enforced: report.invariants_enforced,
    summary: {
      categories: report.quality_gate.length,
      outputs: report.outputs_manifest.count,
      outputs_spec: report.outputs_manifest.spec,
      ...totals,
      /* brez umetnega skupnega procenta — issue #43 §10 */
      note: "vsota prek kategorij ne pomeni 'popolnost' — vsaka kategorija ima lastno šeststatusno resnico; glej ?category=<id> za mapping_rule",
    },
    quality_gate: report.quality_gate,
    outputs_manifest: report.outputs_manifest,
    definition_of_done_status: report.definition_of_done_status,
  };
}

/** Posamezna kategorija §23 (ali null, če ne obstaja) */
export function coverageCategory(id: string): CoverageCategory | null {
  return categoryIndex.get(id.trim().toLowerCase()) ?? null;
}

/** Seznam veljavnih category_id (za napake 400) */
export function validCategoryIds(): string[] {
  return [...categoryIndex.keys()];
}

/** §24 manifest (obvezni outputi 1–14) */
export function coverageOutputs() {
  return report.outputs_manifest;
}

/** Prečne nezanke (kategorija `unknowns`) z razčlenitvijo po mestu izvora */
export function unknownsBreakdown(): {
  aggregate: { item: string; count: number; category: string }[];
  rule: string;
  total: number;
} | null {
  const c = categoryIndex.get("unknowns");
  if (!c) return null;
  const agg = (c.native as { aggregate?: { item: string; count: number; category: string }[] })
    .aggregate ?? [];
  return { aggregate: agg, rule: c.mapping_rule, total: c.total };
}
