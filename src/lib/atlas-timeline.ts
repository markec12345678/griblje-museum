/**
 * ATLAS 1825 §20 — TIME SLIDER (val 76): časovne točke vasi Griblje.
 *
 * Čista, deterministična plast nad timeline-1825-1830.json (piše
 * research-griblje/atlas-1825/build-timeline-1825-1830.py — ročno urejanje
 * prepovedano). Nič ne ugiba:
 *   - točka brez vpisanega vira = AWAITING_SOURCE in NIMA metrik (§4);
 *   - metriki se NIKOLI ne interpolirajo med točkami — vsaka točka stoji
 *     samo na svojih virih;
 *   - manjkajoča metrika v dokumentirani točki = izrecen absent_metrics
 *     blok (ni tihih presledkov);
 *   - REVIEW branja ostanejo označena (nikoli tiho dokazana).
 */
import raw from "@/data/timeline-1825-1830.json";

export type TimelineMetric = {
  metric_id: string;
  value: number;
  unit: string;
  display: string;
  source_id: string;
  evidence: string;
  reading_status: "TRANSCRIBED" | "REVIEW";
  note?: string;
};

export type TimelineAbsentMetric = {
  metric_id: string;
  reason: string;
};

export type TimelinePoint = {
  year: number;
  status: "DOCUMENTED" | "AWAITING_SOURCE";
  label: string;
  kind: string;
  source_ids: string[];
  metrics: TimelineMetric[];
  absent_metrics: TimelineAbsentMetric[];
  expected_basis?: string;
  note?: string | null;
};

export type TimelineDoc = {
  val: number;
  pass: string;
  issue: number;
  deterministic: boolean;
  title: string;
  spec: string;
  contract: {
    statuses: Record<string, string>;
    rules: string[];
  };
  provenance: {
    built_from: string[];
    kg_sha256: string;
    runtime_copy: string;
    vac: Record<string, string | null>;
  };
  invariants_enforced: string[];
  summary: {
    points_total: number;
    documented: number;
    awaiting_source: number;
    years: number[];
    expected_census_years: number[];
    note: string;
  };
  points: TimelinePoint[];
};

export const TIMELINE_STATUSES = ["DOCUMENTED", "AWAITING_SOURCE"] as const;
export type TimelineStatus = (typeof TIMELINE_STATUSES)[number];

const doc = raw as unknown as TimelineDoc;

/** Vse časovne točke (naraščajoče, deterministično). */
export function timelinePoints(): TimelinePoint[] {
  return doc.points.slice();
}

/** Posamezna točka po letnici (ali null, če ne obstaja). */
export function timelinePoint(year: number): TimelinePoint | null {
  const y = Number(year);
  if (!Number.isInteger(y)) return null;
  return doc.points.find((p) => p.year === y) ?? null;
}

/** Os (leto + status) brez metrik — za drsnik. */
export type TimelineAxisEntry = { year: number; status: TimelineStatus };

export function timelineAxis(): TimelineAxisEntry[] {
  return doc.points.map((p) => ({
    year: p.year,
    status: p.status as TimelineStatus,
  }));
}

/** Povzetek dokumenta (za API odgovor). */
export function timelineOverview() {
  return {
    val: doc.val,
    pass: doc.pass,
    issue: doc.issue,
    title: doc.title,
    spec: doc.spec,
    deterministic: doc.deterministic,
    contract: doc.contract,
    invariants_enforced: doc.invariants_enforced,
    summary: doc.summary,
    provenance: doc.provenance,
    points: doc.points,
  };
}

/** Lega točke na osi 0–100 % (proporcionalno po letnici, odmik ±3 leta). */
export function axisPosition(year: number, minYear: number, maxYear: number): number {
  if (maxYear <= minYear) return 50;
  const pad = 3;
  const span = maxYear - minYear + pad * 2;
  const pct = ((year - minYear + pad) / span) * 100;
  return Math.min(96, Math.max(4, pct));
}
