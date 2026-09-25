/**
 * ATLAS 1825 — STORY GRAPH (issue #42 §21, PASS 6).
 *
 * Pripovedni graf OSEBA ↔ HIŠA ↔ PARCELA ↔ BP ↔ TOPONIM ↔ DOGODEK ↔ VIR
 * kot osnova za avtomatsko zgodbonizacijo (Story Engine = PASS 7).
 *
 * Čista, deterministična plast nad story-graph-1825.json (piše
 * research-griblje/atlas-1825/build-story-graph.py — ročno urejanje
 * prepovedano), ki je 1:1 projekcija knowledge-graph-1825.json (KG v1.4,
 * val 68 — +claim C-00622, KG-F07). Nič ne ugiba: vrne samo to, kar je v
 * grafu; sosednosti računa iz relacij, kapje so izrecne (truncated flag).
 *
 * §21: vsaka relacija ima relation type + source + confidence + date/period.
 * §22: story atomi nosijo story_id + entity/claim/source IDs = reproducibilnost.
 */
import sgRaw from "@/data/story-graph-1825.json";
import kgRaw from "@/data/knowledge-graph-1825.json";
import { evidenceUrl } from "@/lib/atlas-map";

export type StoryEntity = {
  node_id: string;
  node_type: string;
  type_label: string;
  label: string;
  evidence_status: string;
  source_ids: string[];
  degree: number;
  [key: string]: unknown;
};

export type StoryRelation = {
  relation_id: string;
  relation_type: string;
  narrative_label: string;
  from_entity: string;
  to_entity: string;
  date_period: string;
  source_ids: string[];
  confidence: string;
  evidence_status: string;
  claim_ids: string[];
  notes?: string;
  conflict_refs?: string[];
};

export type StoryAtom = {
  story_id: string;
  subject: string;
  period: string;
  statement: string;
  entities: string[];
  claim_ids: string[];
  source_ids: string[];
  confidence: string;
  evidence_status: string;
  generated_at: string;
  generator: string;
  provenance_note?: string;
};

const sg = sgRaw as unknown as {
  val: number;
  title: string;
  provenance: Record<string, unknown>;
  story_engine_contract: Record<string, unknown>;
  invariants_enforced: string[];
  stats: Record<string, unknown>;
  entities: StoryEntity[];
  relations: StoryRelation[];
  story_atoms: StoryAtom[];
  research_gaps: Record<string, unknown>[];
};

/** KG je potrebben za claims rezolucijo (story-graph ne duplicira trditev). */
const kg = kgRaw as unknown as {
  claims: {
    claim_id: string;
    subject: string;
    predicate: string;
    object: string;
    source_ref: { source: string; page?: number | null; pages?: number[] };
    status: string;
    period?: string;
    confidence?: string;
    notes?: string;
  }[];
};

/* ------------------------- O(1) indeksi ------------------------- */

const entityIndex = new Map<string, StoryEntity>(sg.entities.map((e) => [e.node_id, e]));

const relationsByEntity = new Map<string, StoryRelation[]>();
for (const r of sg.relations) {
  for (const id of [r.from_entity, r.to_entity]) {
    const arr = relationsByEntity.get(id) ?? [];
    arr.push(r);
    relationsByEntity.set(id, arr);
  }
}

const claimIndex = new Map<string, (typeof kg.claims)[number]>(
  kg.claims.map((c) => [c.claim_id, c])
);

/** Entitetne vrste pripovednega grafa (§21). */
export const STORY_ENTITY_TYPES = [
  "PERSON",
  "HOUSE",
  "PARCEL",
  "BP",
  "TOPONYM",
  "EVENT",
  "SOURCE",
  "MAP_OBJECT",
] as const;

export function resolveStoryEntityParam(raw: string): string | null {
  const q = raw.trim();
  if (!q) return null;
  if (entityIndex.has(q)) return q;
  // priročne okrajšave: H-040 / HOUSE 40 / TP-001 / BP 90 / PER-0001 / MO-A01-002
  const up = q.toUpperCase();
  const house = up.match(/^(?:HOUSE:?)?\s*H-(\d+)$/) ?? up.match(/^HOUSE\s+(\d+)$/);
  if (house) {
    const id = `HOUSE:H-${house[1].padStart(3, "0")}`;
    if (entityIndex.has(id)) return id;
  }
  const bp = up.match(/^(?:BP:?)?\s*(\d{1,3})$/);
  if (bp) {
    const id = `BP:${bp[1].padStart(3, "0")}`;
    if (entityIndex.has(id)) return id;
  }
  const candidates = [
    up.replace(/\s+/g, ""),
    up.startsWith("MO:") ? up.slice(3) : `MO:${up}`,
  ];
  for (const c of candidates) {
    if (entityIndex.has(c)) return c;
  }
  return null;
}

/* --------------------- pregled (overview) --------------------- */

export function storyGraphOverview() {
  const atoms = sg.story_atoms.map((a) => ({
    story_id: a.story_id,
    subject: a.subject,
    period: a.period,
    statement: a.statement,
    evidence_status: a.evidence_status,
    confidence: a.confidence,
    entities_count: a.entities.length,
    claims_count: a.claim_ids.length,
    sources_count: a.source_ids.length,
  }));
  return {
    ok: true,
    val: sg.val,
    model: "atlas-1825 story graph v1 (issue #42 §21, PASS 6)",
    provenance: sg.provenance,
    story_engine_contract: sg.story_engine_contract,
    invariants_enforced: sg.invariants_enforced,
    stats: sg.stats,
    story_atoms: atoms,
    entity_types: STORY_ENTITY_TYPES,
    usage: {
      neighborhood: "/api/atlas/story-graph?node=HOUSE:H-040&depth=1 — sosednost entitete (§6 pot)",
      entities: "/api/atlas/story-graph?type=PERSON — entitete po vrsti",
      relations: "/api/atlas/story-graph?relation=OWNER_OF — relacije po tipu",
      search: "/api/atlas/story-graph?q=Sautter — iskanje entitet",
      atoms: "/api/atlas/story-graph?atoms=1 — story atomi z razrešenimi claims",
    },
  };
}

/* ------------------------- entitete ------------------------- */

export function storyEntities(type?: string, limit = 200): StoryEntity[] {
  const out = type ? sg.entities.filter((e) => e.node_type === type) : sg.entities;
  return out.slice(0, Math.max(1, limit));
}

/* ------------------------- relacije ------------------------- */

export function storyRelations(relationType?: string, limit = 200): StoryRelation[] {
  const out = relationType
    ? sg.relations.filter((r) => r.relation_type === relationType)
    : sg.relations;
  return out.slice(0, Math.max(1, limit));
}

/* ------------------------- sosednost ------------------------- */

export type StoryNeighborhood = {
  ok: true;
  focus: StoryEntity;
  depth: 1 | 2;
  truncated: boolean;
  entities: StoryEntity[];
  relations: StoryRelation[];
  story_atoms: StoryAtom[];
  evidence_url: string;
};

/** Najvišja meja sosednosti — zaščita pred parcelno eksplozijo (HAS_PARCEL 2.865). */
const MAX_NEIGHBORHOOD = 1000;

export function storyNeighborhood(nodeId: string, depth: 1 | 2 = 1): StoryNeighborhood | null {
  const focus = entityIndex.get(nodeId);
  if (!focus) return null;

  const ids = new Set<string>([nodeId]);
  let truncated = false;
  const frontier = [nodeId];
  for (let d = 0; d < depth; d++) {
    const next: string[] = [];
    for (const id of frontier) {
      for (const rel of relationsByEntity.get(id) ?? []) {
        for (const nb of [rel.from_entity, rel.to_entity]) {
          if (nb === id) continue;
          if (ids.has(nb)) continue;
          if (ids.size >= MAX_NEIGHBORHOOD) {
            truncated = true;
            break;
          }
          ids.add(nb);
          next.push(nb);
        }
      }
    }
    frontier.length = 0;
    frontier.push(...next);
  }

  const entities = [...ids].map((id) => entityIndex.get(id)!).filter(Boolean);
  const relations = sg.relations.filter(
    (r) => ids.has(r.from_entity) && ids.has(r.to_entity)
  );
  const atoms = sg.story_atoms.filter((a) => a.entities.some((e) => ids.has(e)));

  return {
    ok: true,
    focus,
    depth,
    truncated,
    entities,
    relations,
    story_atoms: atoms,
    evidence_url: evidenceUrl(nodeId),
  };
}

/* ------------------------- iskanje ------------------------- */

export function searchStoryEntities(query: string, type?: string, limit = 20) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: { node_id: string; node_type: string; label: string; type_label: string; evidence_status: string; degree: number; evidence_url: string }[] = [];
  for (const e of sg.entities) {
    if (type && e.node_type !== type) continue;
    const hay = [
      e.label,
      (e.name_original as string | undefined) ?? "",
      e.node_id,
    ]
      .join(" ")
      .toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        node_id: e.node_id,
        node_type: e.node_type,
        label: e.label,
        type_label: e.type_label,
        evidence_status: e.evidence_status,
        degree: e.degree,
        evidence_url: evidenceUrl(e.node_id),
      });
      if (hits.length >= limit) break;
    }
  }
  return hits;
}

/* --------------------- story atomi (§22) --------------------- */

export type ResolvedStoryAtom = StoryAtom & {
  resolved_entities: { node_id: string; label: string; node_type: string }[];
  resolved_claims: {
    claim_id: string;
    subject: string;
    predicate: string;
    object: string;
    source: string;
    status: string;
  }[];
  provenance_complete: boolean;
};

/** Story atomi z razrešenimi entitetami in claims (»iz katerih dokazov je zgodba?«). */
export function resolvedStoryAtoms(): ResolvedStoryAtom[] {
  return sg.story_atoms.map((a) => {
    const resolved_entities = a.entities
      .map((id) => {
        const e = entityIndex.get(id) ?? kgNodeFallback(id);
        return e ? { node_id: e.node_id, label: e.label, node_type: e.node_type } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    const resolved_claims = a.claim_ids
      .map((cid) => {
        const c = claimIndex.get(cid);
        if (!c) return null;
        return {
          claim_id: c.claim_id,
          subject: c.subject,
          predicate: c.predicate,
          object: c.object,
          source: c.source_ref?.source ?? "UNKNOWN",
          status: c.status,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    return {
      ...a,
      resolved_entities,
      resolved_claims,
      provenance_complete:
        resolved_entities.length === a.entities.length &&
        resolved_claims.length === a.claim_ids.length &&
        a.source_ids.length > 0,
    };
  });
}

/** Zgodbe se lahko nanašajo na KG entitete, ki NISO story-vrste (robni primer). */
function kgNodeFallback(id: string): { node_id: string; label: string; node_type: string } | null {
  const kgNodes = (kgRaw as unknown as { nodes: { node_id: string; node_type: string; label?: string; name_original?: string; house_no_1825?: string }[] }).nodes;
  const n = kgNodes.find((x) => x.node_id === id);
  if (!n) return null;
  const label =
    n.label ??
    n.name_original ??
    (n.house_no_1825 !== undefined ? `Hiša št. ${n.house_no_1825}` : n.node_id);
  return { node_id: n.node_id, label, node_type: n.node_type };
}

/* ------------------- skupni podatkovni izvoz ------------------- */

export function storyGraphData() {
  return {
    ok: true,
    val: sg.val,
    model: "atlas-1825 story graph v1 (issue #42 §21, PASS 6)",
    provenance: sg.provenance,
    stats: sg.stats,
    entities: sg.entities,
    relations: sg.relations,
    story_atoms: sg.story_atoms,
  };
}
