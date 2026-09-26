/**
 * ATLAS 1825 — STORY GRAPH testi (issue #42 §21, PASS 6 — val 68).
 *
 * Načelo: story graf je 1:1 projekcija KG (nič novih trditev). Vsaka
 * relacija ima §21 obvezna polja (relation type + source + confidence +
 * date/period); story atomi imajo claim/source povezave (§43 §8/§11);
 * UNKNOWN/NOT FOUND/CONFLICT ostanejo ločeni; konci relacij obstajajo.
 */
import { describe, expect, test } from "bun:test";
import {
  STORY_ENTITY_TYPES,
  resolvedStoryAtoms,
  searchStoryEntities,
  storyEntities,
  storyGraphOverview,
  storyNeighborhood,
  storyRelations,
  resolveStoryEntityParam,
} from "@/lib/atlas-story-graph";
import sg from "@/data/story-graph-1825.json";
import kg from "@/data/knowledge-graph-1825.json";

type StoryGraphFile = {
  val: number;
  provenance: { kg_sha256: string; kg_val: number; deterministic: boolean; built_from: string };
  stats: {
    entities: number;
    relations: number;
    entities_by_type: Record<string, number>;
    relations_by_type: Record<string, number>;
    story_atoms: number;
  };
  entities: { node_id: string; node_type: string; label: string; degree: number; evidence_status: string }[];
  relations: {
    relation_id: string;
    relation_type: string;
    from_entity: string;
    to_entity: string;
    date_period: string;
    source_ids: string[];
    confidence: string;
    evidence_status: string;
    claim_ids: string[];
  }[];
  story_atoms: { story_id: string; entities: string[]; claim_ids: string[]; source_ids: string[] }[];
};
const graph = sg as unknown as StoryGraphFile;
const kgFile = kg as unknown as {
  nodes: { node_id: string; node_type: string }[];
  claims: { claim_id: string }[];
  edges: { relation_id: string }[];
};

describe("story-graph: projekcija KG (nič novih trditev)", () => {
  test("1:1 vsako vozlišče story vrste ima entiteto, vsaka KG veza med njima relacijo", () => {
    const storyTypes = new Set<string>(STORY_ENTITY_TYPES);
    const expectedNodes = kgFile.nodes.filter((n) => storyTypes.has(n.node_type)).length;
    // vsi story entiteti so KG vozlišča prave vrste
    expect(graph.entities.length).toBe(expectedNodes);
    expect(graph.stats.entities).toBe(expectedNodes);
    // KG veze, kjer sta oba konca story vrste
    const ids = new Set(graph.entities.map((e) => e.node_id));
    const expectedRels = kgFile.edges.filter(
      (e) => ids.has((e as unknown as { from_entity: string }).from_entity) && ids.has((e as unknown as { to_entity: string }).to_entity)
    ).length;
    expect(graph.relations.length).toBe(expectedRels);
    expect(graph.stats.relations).toBe(expectedRels);
  });

  test("provenance: kg_sha256 + kg_val + deterministično + built_from = KG", () => {
    expect(graph.provenance.deterministic).toBe(true);
    expect(graph.provenance.built_from).toBe("knowledge-graph-1825.json");
    expect(graph.provenance.kg_val).toBe(77); // KG v1.8 (val 77: PZ PASS 2 — re-read p67/§8, vrata I4–I6)
    expect(graph.provenance.kg_sha256).toMatch(/^[a-f0-9]{64}$/);
  });

  test("entitete po vrsti ujemajo KG (3.309 skupaj)", () => {
    const by = graph.stats.entities_by_type;
    expect(by["PARCEL"]).toBe(2467);
    expect(by["PERSON"]).toBe(488);
    expect(by["HOUSE"]).toBe(167);
    expect(by["BP"]).toBe(100);
    expect(by["TOPONYM"]).toBe(37);
    expect(by["MAP_OBJECT"]).toBe(34);
    expect(by["SOURCE"]).toBe(13);
    expect(by["EVENT"]).toBe(3);
  });
});

describe("story-graph: §21 invarianti relacij", () => {
  test("vsaka relacija ima relation type + source + confidence + date/period", () => {
    for (const r of graph.relations) {
      expect(r.relation_type).toBeTruthy();
      expect(r.source_ids.length).toBeGreaterThan(0);
      expect(r.confidence).not.toBe("UNKNOWN");
      expect(r.date_period).toBeTruthy();
    }
  });

  test("konci relacij obstajajo kot entitete (referenčna integriteta)", () => {
    const ids = new Set(graph.entities.map((e) => e.node_id));
    for (const r of graph.relations) {
      expect(ids.has(r.from_entity)).toBe(true);
      expect(ids.has(r.to_entity)).toBe(true);
    }
  });

  test("claim_ids relacij obstajajo v KG in so obrnjeno pokrite (1:1)", () => {
    const claimIds = new Set(kgFile.claims.map((c) => c.claim_id));
    const used = new Set<string>();
    for (const r of graph.relations) {
      for (const cid of r.claim_ids) {
        expect(claimIds.has(cid)).toBe(true);
        used.add(cid);
      }
    }
    // vsak KG claim je uporabljen na natanko eni relaciji (claim-first 1:1)
    expect(used.size).toBe(kgFile.claims.length);
  });

  test("relacije po tipu: HAS_PARCEL 2.865, OWNER_OF 254, BP_BOUND_TO_HOUSE 119 …", () => {
    const by = graph.stats.relations_by_type;
    expect(by["HAS_PARCEL"]).toBe(2865);
    expect(by["OWNER_OF"]).toBe(254);
    expect(by["OWNER_VARIANT_OF"]).toBe(224);
    expect(by["BP_BOUND_TO_HOUSE"]).toBe(119);
    expect(by["CORRESPONDS_TO_BP"]).toBe(21);
    expect(by["IS_GEMEINDE_OF"]).toBe(1);
  });

  test("degree vsake entitete = število relacij, ki se jih dotikajo", () => {
    const deg = new Map<string, number>();
    for (const r of graph.relations) {
      deg.set(r.from_entity, (deg.get(r.from_entity) ?? 0) + 1);
      deg.set(r.to_entity, (deg.get(r.to_entity) ?? 0) + 1);
    }
    for (const e of graph.entities) {
      expect(e.degree).toBe(deg.get(e.node_id) ?? 0);
    }
  });
});

describe("story-graph: story atomi (§43 §8/§11, §22)", () => {
  test("4 atomi, vsak z entities + claims + sources (zgodba brez povezav = napaka)", () => {
    expect(graph.story_atoms.length).toBe(4);
    for (const a of graph.story_atoms) {
      expect(a.entities.length).toBeGreaterThan(0);
      expect(a.claim_ids.length).toBeGreaterThan(0);
      expect(a.source_ids.length).toBeGreaterThan(0);
    }
  });

  test("SA-004 (KG-F07) ima povezan claim C-00622 (IS_GEMEINDE_OF TP-001→TP-003)", () => {
    const sa4 = graph.story_atoms.find((a) => a.story_id === "SA-004")!;
    expect(sa4.claim_ids).toEqual(["C-00622"]);
    const rel = graph.relations.find((r) => r.relation_type === "IS_GEMEINDE_OF")!;
    expect(rel.claim_ids).toEqual(["C-00622"]);
    expect(rel.from_entity).toBe("TP-001");
    expect(rel.to_entity).toBe("TP-003");
  });

  test("resolved atoms: vse entitete in claims se razrešijo, provenance_complete = true", () => {
    const atoms = resolvedStoryAtoms();
    expect(atoms.length).toBe(4);
    for (const a of atoms) {
      expect(a.provenance_complete).toBe(true);
      expect(a.resolved_entities.length).toBe(a.entities.length);
      expect(a.resolved_claims.length).toBe(a.claim_ids.length);
      for (const c of a.resolved_claims) {
        expect(c.claim_id).toBeTruthy();
        expect(c.source).not.toBe("UNKNOWN");
      }
    }
  });
});

describe("story-graph: lib — sosednost (vhod za Story Engine §16)", () => {
  test("HOUSE:H-040 depth 1: lastniki + BP 94 + atom SA-002/SA-003, evidence_url živ", () => {
    const nb = storyNeighborhood("HOUSE:H-040", 1)!;
    expect(nb.ok).toBe(true);
    expect(nb.focus.node_id).toBe("HOUSE:H-040");
    expect(nb.truncated).toBe(false);
    const types = new Set(nb.entities.map((e) => e.node_type));
    expect(types.has("PERSON")).toBe(true); // OWNER_OF iz hiše (prek BP)
    expect(types.has("BP")).toBe(true);
    const relTypes = new Set(nb.relations.map((r) => r.relation_type));
    expect(relTypes.has("OWNER_OF")).toBe(true);
    expect(nb.story_atoms.map((a) => a.story_id)).toContain("SA-002");
    expect(nb.evidence_url).toContain("/api/atlas/evidence");
    // vsaka relacija sosednosti se dotika fokusa ali vključenih vozlišč
    const ids = new Set(nb.entities.map((e) => e.node_id));
    for (const r of nb.relations) {
      expect(ids.has(r.from_entity)).toBe(true);
      expect(ids.has(r.to_entity)).toBe(true);
    }
  });

  test("depth 2 je večji od depth 1 (BP prinese svoje parcele)", () => {
    const d1 = storyNeighborhood("BP:094", 1)!;
    const d2 = storyNeighborhood("BP:094", 2)!;
    expect(d2.entities.length).toBeGreaterThan(d1.entities.length);
    expect(d2.relations.length).toBeGreaterThan(d1.relations.length);
  });

  test("sosednost velikih vozlišč je capped (MAX 1000, truncated flag)", () => {
    const nb = storyNeighborhood("TP-001", 2)!;
    expect(nb.entities.length).toBeLessThanOrEqual(1000);
    // TP-001 (IS_GEMEINDE_OF → TP-003) v depth 2 ne ekplodira; če bi,
    // mora biti truncated izrecno — nikoli tiho.
    if (nb.entities.length === 1000) expect(nb.truncated).toBe(true);
  });

  test("neobstoječa entiteta → null (404 na API)", () => {
    expect(storyNeighborhood("HOUSE:H-999")).toBeNull();
    expect(storyNeighborhood("NEZMAN")).toBeNull();
  });
});

describe("story-graph: lib — entitete, relacije, iskanje, resolver", () => {
  test("storyEntities po vrsti + limit", () => {
    expect(storyEntities("PERSON", 5000).length).toBe(488);
    expect(storyEntities("HOUSE").length).toBe(167); // manj kot limit → vse
    expect(storyEntities("PERSON").length).toBe(200); // default limit kapira
    expect(storyEntities("EVENT", 10).length).toBe(3);
  });

  test("storyRelations po tipu + limit", () => {
    expect(storyRelations("AFFECTS_HOUSE", 100).length).toBe(3);
    expect(storyRelations("OWNER_OF", 10).length).toBe(10);
  });

  test("iskanje: Sautter najde osebo; q=Grüble najde toponim TP-001", () => {
    const hits = searchStoryEntities("Sautter");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((h) => h.evidence_url.includes("/api/atlas/evidence"))).toBe(true);
    const tp = searchStoryEntities("grüble", "TOPONYM");
    expect(tp.some((h) => h.node_id === "TP-001")).toBe(true);
  });

  test("resolveStoryEntityParam: priročne okrajšave (H-040, BP 90, MO:MO-A01-002)", () => {
    expect(resolveStoryEntityParam("H-040")).toBe("HOUSE:H-040");
    expect(resolveStoryEntityParam("HOUSE 40")).toBe("HOUSE:H-040");
    expect(resolveStoryEntityParam("BP 90")).toBe("BP:090");
    expect(resolveStoryEntityParam("90")).toBe("BP:090");
    expect(resolveStoryEntityParam("MO:MO-A01-002")).toBe("MO:MO-A01-002");
    expect(resolveStoryEntityParam("TP-001")).toBe("TP-001");
    expect(resolveStoryEntityParam("PER-0001")).toBe("PER-0001");
    expect(resolveStoryEntityParam("NE-OBSTOJA")).toBeNull();
  });

  test("overview: stats + atoms + story_engine_contract (§22 shema)", () => {
    const ov = storyGraphOverview();
    expect(ov.ok).toBe(true);
    expect(ov.val).toBe(68);
    expect(ov.stats.entities).toBe(3309);
    expect(ov.stats.story_atoms).toBe(4);
    const contract = ov.story_engine_contract as { required_fields: string[] };
    for (const f of ["story_id", "input_entity_ids", "used_claim_ids", "used_source_ids", "generation_timestamp", "prompt_version", "story_status"]) {
      expect(contract.required_fields).toContain(f);
    }
  });
});
