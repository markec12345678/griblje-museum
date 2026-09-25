/**
 * ATLAS 1825 — Evidence Explorer resolver (issue #43 §2/§6).
 *
 * Čista, deterministična plast nad knowledge-graph-1825.json (piše
 * research-griblje/atlas-1825/build-knowledge-graph.py — ročno urejanje
 * prepovedano). Nič ne ugiba: vrne samo to, kar je v grafu.
 *
 * §6 pot: MAP OBJECT → HOUSE/PARCEL/TOPONYM → ENTITY → CLAIMS → SOURCES →
 * ORIGINAL EVIDENCE (vac_details_url iz SOURCE nodes).
 */
import kgRaw from "@/data/knowledge-graph-1825.json";

export type AtlasNode = {
  node_id: string;
  node_type: string;
  [key: string]: unknown;
};

export type AtlasEdge = {
  relation_id: string;
  from_entity: string;
  relation_type: string;
  to_entity: string;
  date_period: string;
  source_ids: string[];
  evidence_status: string;
  confidence: string;
  notes?: string;
  conflict_refs?: string[];
  claim_ids?: string[];
};

export type AtlasClaim = {
  claim_id: string;
  subject: string;
  predicate: string;
  object: string;
  source_ref: { source: string; page?: number | null; pages?: number[] };
  status: string;
  period?: string;
  confidence?: string;
  notes?: string;
};

export type ResearchGap = {
  gap_id: string;
  missing_relation: string;
  searched_sources: string[];
  current_result: string;
  next_source: string;
  status: string;
  tied_to?: string;
};

const kg = kgRaw as unknown as {
  title: string;
  val: number;
  findings: { finding_id: string; statement: string; status: string }[];
  node_stats: Record<string, number>;
  edge_stats: Record<string, number>;
  edge_evidence_stats: Record<string, number>;
  claim_stats: Record<string, number>;
  coverage: unknown;
  nodes: AtlasNode[];
  edges: AtlasEdge[];
  claims: AtlasClaim[];
  story_atoms: unknown[];
  research_gaps: ResearchGap[];
};

/** node_id → node (O(1) index, zgrajen enkrat na proces) */
const nodeIndex = new Map<string, AtlasNode>(kg.nodes.map((n) => [n.node_id, n]));
const edgesByEntity = new Map<string, { out: AtlasEdge[]; in: AtlasEdge[] }>();
for (const e of kg.edges) {
  const a = edgesByEntity.get(e.from_entity) ?? { out: [], in: [] };
  a.out.push(e);
  edgesByEntity.set(e.from_entity, a);
  const b = edgesByEntity.get(e.to_entity) ?? { out: [], in: [] };
  b.in.push(e);
  edgesByEntity.set(e.to_entity, b);
}
const claimsByEntity = new Map<string, { asSubject: AtlasClaim[]; asObject: AtlasClaim[] }>();
for (const c of kg.claims) {
  const s = claimsByEntity.get(c.subject) ?? { asSubject: [], asObject: [] };
  s.asSubject.push(c);
  claimsByEntity.set(c.subject, s);
  const o = claimsByEntity.get(c.object) ?? { asSubject: [], asObject: [] };
  o.asObject.push(c);
  claimsByEntity.set(c.object, o);
}
const gapsByEntity = new Map<string, ResearchGap[]>();
for (const g of kg.research_gaps) {
  // gap missing_relation veže entiteto, če vsebuje njen človeški ključ:
  //   "BP 15 → HOUSE ?" → BP:015 · "HOUSE 6 → OWNER ..." → HOUSE:H-006
  const bpMatch = g.missing_relation.match(/^BP (\d+)/);
  if (bpMatch) {
    const id = `BP:${bpMatch[1].padStart(3, "0")}`;
    if (nodeIndex.has(id)) {
      const arr = gapsByEntity.get(id) ?? [];
      arr.push(g);
      gapsByEntity.set(id, arr);
    }
    continue;
  }
  const houseMatch = g.missing_relation.match(/^HOUSE (\d+)/);
  if (houseMatch) {
    const id = `HOUSE:H-${houseMatch[1].padStart(3, "0")}`;
    if (nodeIndex.has(id)) {
      const arr = gapsByEntity.get(id) ?? [];
      arr.push(g);
      gapsByEntity.set(id, arr);
    }
  }
}

/** Prepozni vzorci ID-jev za priročne parametre (?house=40, ?bp=90, ?toponym=TP-001) */
export function resolveNodeParam(raw: string): string | null {
  const q = raw.trim();
  if (!q) return null;
  if (nodeIndex.has(q)) return q;
  const house = q.match(/^(?:house|h)[- ]?(\d+)$/i);
  if (house) {
    const id = `HOUSE:H-${house[1].padStart(3, "0")}`;
    return nodeIndex.has(id) ? id : null;
  }
  const bp = q.match(/^(?:bp)[- ]?(\d+)$/i);
  if (bp) {
    const id = `BP:${bp[1].padStart(3, "0")}`;
    return nodeIndex.has(id) ? id : null;
  }
  return null;
}

export function nodeExists(nodeId: string): boolean {
  return nodeIndex.has(nodeId);
}

export type EvidenceResult = {
  node: AtlasNode;
  edges: (AtlasEdge & { direction: "out" | "in" })[];
  claims: (AtlasClaim & { role: "subject" | "object" })[];
  neighbors: { node_id: string; node_type: string; relation_type: string; direction: "out" | "in" }[];
  sources: AtlasNode[];
  research_gaps: ResearchGap[];
  original_evidence: { source_id: string; label: string; vac_details_url: string | null; docid: number | null }[];
};

/** §2 "Zakaj to vemo?" — celotna veriga za en node. */
export function evidenceFor(nodeId: string): EvidenceResult {
  const node = nodeIndex.get(nodeId)!;
  const ee = edgesByEntity.get(nodeId) ?? { out: [], in: [] };
  const edges = [
    ...ee.out.map((e) => ({ direction: "out" as const, ...e })),
    ...ee.in.map((e) => ({ direction: "in" as const, ...e })),
  ];
  const cc = claimsByEntity.get(nodeId) ?? { asSubject: [], asObject: [] };
  const claims = [
    ...cc.asSubject.map((c) => ({ ...c, role: "subject" as const })),
    ...cc.asObject.map((c) => ({ ...c, role: "object" as const })),
  ];
  const neighborIds = new Map<string, { node_id: string; node_type: string; relation_type: string; direction: "out" | "in" }>();
  for (const e of edges) {
    const other = e.direction === "out" ? e.to_entity : e.from_entity;
    const otherNode = nodeIndex.get(other);
    if (otherNode && other !== nodeId) {
      neighborIds.set(other, { node_id: other, node_type: otherNode.node_type, relation_type: e.relation_type, direction: e.direction });
    }
  }
  const sourceIds = new Set<string>();
  for (const e of edges) for (const s of e.source_ids) sourceIds.add(s);
  for (const c of claims) sourceIds.add(c.source_ref.source);
  if (node.node_type === "SOURCE") sourceIds.add(nodeId);
  const sources = [...sourceIds].map((id) => nodeIndex.get(id)).filter((n): n is AtlasNode => Boolean(n));
  const original_evidence = sources.map((s) => ({
    source_id: s.node_id,
    label: (s.label as string) ?? s.node_id,
    vac_details_url: (s.vac_details_url as string | undefined) ?? null,
    docid: (s.docid as number | undefined) ?? null,
  }));
  return {
    node,
    edges,
    claims,
    neighbors: [...neighborIds.values()],
    sources,
    research_gaps: gapsByEntity.get(nodeId) ?? [],
    original_evidence,
  };
}

/** §10 completeness — brez umetnega procenta. */
export function overview() {
  return {
    title: kg.title,
    val: kg.val,
    stats: {
      nodes: kg.node_stats,
      edges: kg.edge_stats,
      edge_evidence: kg.edge_evidence_stats,
      claims: kg.claim_stats,
    },
    coverage: kg.coverage,
    research_gaps: kg.research_gaps,
    story_atoms: kg.story_atoms,
    findings: kg.findings,
  };
}

/** Poišči node-e po tipu + prostem iskanju imena (za brskanje). */
export function searchNodes(query: string, type?: string, limit = 20) {
  const q = query.trim().toLowerCase();
  const out: { node_id: string; node_type: string; label: string }[] = [];
  for (const n of kg.nodes) {
    if (type && n.node_type !== type) continue;
    if (!q) continue;
    const haystack = JSON.stringify(n).toLowerCase();
    if (haystack.includes(q)) {
      out.push({
        node_id: n.node_id,
        node_type: n.node_type,
        label: (n.name_original as string) ?? (n.label as string) ?? (n.house_no_1825 as string) ?? n.node_id,
      });
      if (out.length >= limit) break;
    }
  }
  return out;
}
