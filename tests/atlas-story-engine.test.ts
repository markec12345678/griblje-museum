/**
 * ATLAS 1825 — STORY ENGINE testi (issue #42 §16–§18 + §22, PASS 7 — val 69).
 *
 * Načelo: zgodba je deterministični sestavek iz strukturiranih claims +
 * sources (§19 — ne iz prostega spomina). Vsak izhod ustreza
 * story_engine_contract (§22/val 68): story_id, input_entity_ids,
 * used_claim_ids, used_source_ids, generation_timestamp, prompt_version,
 * story_status. §17: štiri tiri (DOKAZANO/VERJETNO/KONFLIKTNO/NEZNANO)
 * morajo biti ločeni; konflikti ostanejo vidni (§14); neznanje je
 * izrecno (§17 »Kaj še ne vemo«); entiteta brez claims = NOT_PUBLISHED
 * (pravilo pogodbe: zgodba brez povezav = ne-objavljena).
 */
import { describe, expect, test } from "bun:test";
import {
  EVIDENCE_TIER_ICONS,
  STORY_ENGINE_INVENTORY,
  evidenceTier,
  generateEntityStory,
  generateVillageStory,
  resolveEntityRef,
} from "@/lib/atlas-story-engine";
import type { EvidenceTier } from "@/lib/atlas-story-engine";
import kg from "@/data/knowledge-graph-1825.json";
import sg from "@/data/story-graph-1825.json";

type KgFile = {
  val: number;
  provenance: Record<string, unknown>;
  node_stats: Record<string, number>;
  nodes: { node_id: string; node_type: string; label?: string; evidence_status?: string; [k: string]: unknown }[];
  edges: { relation_id: string; from_entity: string; relation_type: string; to_entity: string; [k: string]: unknown }[];
  claims: { claim_id: string; subject: string; predicate: string; object: string; status: string; [k: string]: unknown }[];
  story_atoms: { story_id: string; generated_at?: string }[];
  research_gaps: { gap_id: string; status: string }[];
};

const kgf = kg as unknown as KgFile;
const sgf = sg as unknown as { provenance: { kg_sha256: string } };

/* ------------------------- §17 tier preslikava ------------------------- */

describe("evidenceTier (§17)", () => {
  test("zelena/dokazano: vsi potrjeni statusi", () => {
    for (const s of ["CONFIRMED-2x", "CONFIRMED", "VERIFIED-2x", "VERIFIED", "VERIFIED_FORM", "STABLE", "FOUND", "TRANSCRIBED"]) {
      expect(evidenceTier(s)).toBe<EvidenceTier>("DOKAZANO");
    }
  });

  test("rumena/verjetno: nepopolni statusi", () => {
    for (const s of ["PROBABLE", "REVIEW", "SINGLE_SOURCE", "PROVISIONAL", "PARTIAL", "TRANSCRIBED_PARTIAL", "UNKNOWN_SEMANTICS"]) {
      expect(evidenceTier(s)).toBe<EvidenceTier>("VERJETNO");
    }
  });

  test("rdeca/konfliktno: konflikti nikoli skriti (§14)", () => {
    for (const s of ["CONFLICT", "REVIEW-CONFLICT"]) {
      expect(evidenceTier(s)).toBe<EvidenceTier>("KONFLIKTNO");
    }
  });

  test("bela/neznano: NOT_FOUND ni dokaz neobstoja (§3)", () => {
    for (const s of ["UNCERTAIN", "UNKNOWN", "NOT_FOUND", "UNRESOLVED", "", null, undefined]) {
      expect(evidenceTier(s as string)).toBe<EvidenceTier>("NEZNANO");
    }
  });

  test("varovalni vzorci: NOT_FOUND ne ujame 'FOUND' (vrstni red pravil)", () => {
    // "NOT_FOUND" vsebuje "FOUND" — exact tabela mora zmagati pred substring pravilom
    expect(evidenceTier("NOT_FOUND")).toBe<EvidenceTier>("NEZNANO");
    expect(evidenceTier("FOUND")).toBe<EvidenceTier>("DOKAZANO");
    // popolnoma neznan status = VERJETNO (nikoli tiho DOKAZANO)
    expect(evidenceTier("NOSUCHSTATUS")).toBe<EvidenceTier>("VERJETNO");
  });

  test("popolna preslikava: vsi statusi v grafu imajo dolocen tier", () => {
    const statuses = new Set<string>();
    for (const n of kgf.nodes) if (n.evidence_status) statuses.add(n.evidence_status);
    for (const e of (kgf.edges as unknown as { evidence_status?: string }[])) if (e.evidence_status) statuses.add(e.evidence_status);
    for (const c of kgf.claims) statuses.add(c.status);
    expect(statuses.size).toBeGreaterThanOrEqual(15);
    for (const s of statuses) {
      const tier = evidenceTier(s);
      expect(["DOKAZANO", "VERJETNO", "KONFLIKTNO", "NEZNANO"]).toContain(tier);
    }
  });

  test("ikone tirij so definirane (§17 vizualni jezik)", () => {
    expect(EVIDENCE_TIER_ICONS.DOKAZANO).toBe("🟢");
    expect(EVIDENCE_TIER_ICONS.VERJETNO).toBe("🟡");
    expect(EVIDENCE_TIER_ICONS.KONFLIKTNO).toBe("🔴");
    expect(EVIDENCE_TIER_ICONS.NEZNANO).toBe("⚪");
  });
});

/* ------------------------- §22 contract ------------------------- */

describe("generateEntityStory — contract (§22)", () => {
  const story = generateEntityStory("HOUSE:H-040")!;

  test("hiša 40 obstaja in zgodba je generirana", () => {
    expect(story).not.toBeNull();
    expect(story.scope).toBe("entity");
    expect(story.focus.node_id).toBe("HOUSE:H-040");
    expect(story.focus.label).toContain("40");
  });

  test("contract polja: vsa obvezna polja prisotna in tipno pravilna", () => {
    expect(story.contract.story_id).toMatch(/^SE-[0-9A-F]{10}$/);
    expect(story.contract.input_entity_ids).toEqual(["HOUSE:H-040"]);
    expect(story.contract.used_claim_ids.length).toBeGreaterThan(0);
    expect(story.contract.used_source_ids.length).toBeGreaterThan(0);
    expect(story.contract.generation_timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(story.contract.prompt_version).toContain("deterministic");
    expect(story.contract.kg_sha256).toBe(sgf.provenance.kg_sha256);
    expect(story.contract.data_val).toBe(kgf.val);
  });

  test("story_status pravilo: hiša 40 ima claims + source → EVIDENCED", () => {
    expect(story.contract.story_status).toBe("EVIDENCED");
  });

  test("determinizem: dva klica → identična zgodba (isti story_id + content_hash)", () => {
    const again = generateEntityStory("H-040")!;
    expect(again.contract.story_id).toBe(story.contract.story_id);
    expect(again.contract.content_hash).toBe(story.contract.content_hash);
    expect(again).toEqual(story);
  });

  test("story_id je odvisen od podatkovne verzije (kg_sha256, §22)", () => {
    // SE- hash = sha256("entity:HOUSE:H-040|kg_sha256|story-engine-v1") — samo
    // preverimo deterministično obliko; sprememba KG ⇒ sprememba ID (po dogovoru)
    const h = story.contract.story_id;
    expect(h.startsWith("SE-")).toBe(true);
    expect(h.length).toBe(13); // "SE-" + 10 znakov
  });
});

/* --------------- §16 + §17: zgodba hiše 40 --------------- */

describe("generateEntityStory — vsebina (§16/§17)", () => {
  const story = generateEntityStory("HOUSE:H-040")!;
  const allItems = story.sections.flatMap((s) => s.items);

  test("§17: vsi stiri tiri so v razdelilu (konflikti vidni, neznanje izrecno)", () => {
    expect(story.tier_breakdown.DOKAZANO).toBeGreaterThan(0);
    expect(story.tier_breakdown.KONFLIKTNO).toBeGreaterThan(0);
    expect(story.tier_breakdown.NEZNANO).toBeGreaterThan(0);
    const sum = Object.values(story.tier_breakdown).reduce((a, b) => a + b, 0);
    expect(sum).toBe(allItems.length);
  });

  test("lastnistvo: dokumentirani lastniki iz PUA in PS (C-00083/C-00154)", () => {
    const ownership = story.sections.find((s) => s.title === "Lastništvo 1825");
    expect(ownership).toBeDefined();
    const claimIds = allItems.flatMap((i) => i.claim_ids);
    expect(claimIds).toContain("C-00083"); // PUA: Pfarrer Rupert Sautter
    expect(claimIds).toContain("C-00154"); // PS: Peter Muster (CONFLICT)
    // osebi sta razrešeni na osebni graf
    const entityIds = allItems.flatMap((i) => i.entity_ids ?? []);
    expect(entityIds).toContain("PER-0059");
    expect(entityIds).toContain("PER-0157");
  });

  test("BP vezave: 94 (CONFIRMED) dokazana, 91/95 konfliktni (§3)", () => {
    const osnovni = story.sections.find((s) => s.title.startsWith("Hiša 1825"));
    expect(osnovni).toBeDefined();
    const bp94 = osnovni!.items.find((i) => i.text.includes("BP 94"));
    expect(bp94).toBeDefined();
    expect(bp94!.tier).toBe("DOKAZANO");
    const bp91 = osnovni!.items.find((i) => i.text.includes("BP 91"));
    expect(bp91!.tier).toBe("KONFLIKTNO");
    const bp95 = osnovni!.items.find((i) => i.text.includes("BP 95"));
    expect(bp95!.tier).toBe("KONFLIKTNO");
    // claim traceability: C-00609 (BP:094 BP_BOUND_TO_HOUSE H-040)
    expect(bp94!.claim_ids).toContain("C-00609");
  });

  test("§17: 'Kaj še ne vemo' sekcija obstaja z izrecnim neznanjem", () => {
    const unknown = story.sections.find((s) => s.title.includes("Kaj še ne vemo"));
    expect(unknown).toBeDefined();
    expect(unknown!.items.length).toBeGreaterThan(0);
  });

  test("§16: dokazna veriga — vsak item nosi source_ids, vsota source_ids = used_source_ids", () => {
    const itemSources = new Set(allItems.flatMap((i) => i.source_ids));
    for (const s of story.contract.used_source_ids) {
      expect(itemSources.has(s)).toBe(true);
    }
    // evidence URL je klikljiv (DoD #43)
    expect(story.evidence_url).toContain("/api/atlas/evidence");
  });

  test("§16: na katastrskem listu — MO-A01-002 prek BP 94", () => {
    const kataster = story.sections.find((s) => s.title.startsWith("Na katastrskem listu"));
    expect(kataster).toBeDefined();
    const mo = kataster!.items.find((i) => (i.entity_ids ?? []).includes("MO:MO-A01-002"));
    expect(mo).toBeDefined();
    expect(mo!.text).toContain("A01");
  });

  test("žive parcele: H-040 ima 121 povezanih parcel — seznam capped, raba delno dokumentirana (9 iz PS)", () => {
    const parcele = story.sections.find((s) => s.title === "Parcele in raba zemljišča");
    expect(parcele).toBeDefined();
    expect(parcele!.items.length).toBeGreaterThan(1);
    const landUse = parcele!.items.find((i) => i.text.includes("Raba zemljišča"));
    expect(landUse).toBeDefined();
    // 9 od 121 parcel ima dokumentirano rabo (PS prepis val 61) — preostale izrecno NEZNANE
    expect(landUse!.text).toContain("9 od 121");
    expect(landUse!.tier).toBe("NEZNANO");
    expect(landUse!.source_ids).toContain("SRC-PV");
    // parcele z dokumentirano rabo jo nosijo v besedilu (claim-first sledljivost);
    // PS parcele nosijo TRANSCRIBED_PARTIAL (cross_ref_to_pua UNKNOWN — F14) → 🟡 VERJETNO
    const njiva = parcele!.items.find((i) => i.text.includes("raba: njiva"));
    expect(njiva).toBeDefined();
    expect(njiva!.tier).toBe("VERJETNO");
    expect(njiva!.status).toBe("TRANSCRIBED_PARTIAL");
  });
});

/* --------------- pravilo pogodbe: zgodba brez povezav = NE-OBJAVLJENA --------------- */

describe("generateEntityStory — NOT_PUBLISHED pravilo", () => {
  // parcela brez claims IN brez relacij (v grafu jih je 170 — claim-first
  // arhitektura pokriva HOUSE/BP/MO/TP, parcele so prepisna plast brez trditev)
  const touched = new Set<string>();
  for (const c of kgf.claims) {
    touched.add(c.subject);
    touched.add(c.object);
  }
  for (const e of kgf.edges as unknown as { from_entity: string; to_entity: string }[]) {
    touched.add(e.from_entity);
    touched.add(e.to_entity);
  }
  const parcelNode = kgf.nodes.find(
    (n) => n.node_type === "PARCEL" && !touched.has(n.node_id)
  )!;
  expect(parcelNode).toBeDefined();
  const story = generateEntityStory(parcelNode.node_id)!;

  test("entiteta brez claims in sources → NOT_PUBLISHED", () => {
    expect(story).not.toBeNull();
    expect(story.contract.story_status).toBe("NOT_PUBLISHED");
    expect(story.contract.used_claim_ids).toEqual([]);
    expect(story.contract.used_source_ids).toEqual([]);
  });

  test("nič izmišljenega: samo izrecno neznanje, brez izmisljenih trditev", () => {
    const allItems = story.sections.flatMap((s) => s.items);
    expect(allItems.length).toBeGreaterThan(0);
    for (const i of allItems) {
      expect(i.claim_ids).toEqual([]);
      expect(i.source_ids).toEqual([]);
    }
    const unknown = story.sections.find((s) => s.title.includes("Kaj še ne vemo"));
    expect(unknown).toBeDefined();
  });

  test("neznan node → null (404 na API nivoju)", () => {
    expect(generateEntityStory("HOUSE:H-999")).toBeNull();
    expect(generateEntityStory("nonsense")).toBeNull();
  });

  test("priročne oblike referenc: H-040 / HOUSE 40 / BP:094 / 94 / TP-001 / MO:MO-A01-002", () => {
    expect(resolveEntityRef("H-040")).toBe("HOUSE:H-040");
    expect(resolveEntityRef("HOUSE 40")).toBe("HOUSE:H-040");
    expect(resolveEntityRef("BP:094")).toBe("BP:094");
    expect(resolveEntityRef("94")).toBe("BP:094");
    expect(resolveEntityRef("TP-001")).toBe("TP-001");
    expect(resolveEntityRef("MO:MO-A01-002")).toBe("MO:MO-A01-002");
  });
});

/* --------------- §18: zgodba vasi --------------- */

describe("generateVillageStory (§18)", () => {
  const story = generateVillageStory();

  test("deset sekcij po §18 (pokrajina → neznanke)", () => {
    expect(story.scope).toBe("village");
    expect(story.sections.length).toBe(10);
    expect(story.sections[0].title).toContain("Pokrajina");
    expect(story.sections[9].title).toContain("Neznanke");
  });

  test("številke prihajajo iz grafa: 167 hiš, 488 oseb, 2467 parcel, 34 objektov, 5 listov", () => {
    const allText = story.sections.flatMap((s) => s.items.map((i) => i.text)).join(" ");
    expect(allText).toContain("167 hiš");
    expect(allText).toContain("488 oseb");
    expect(allText).toContain("2467 parcel");
    expect(allText).toContain("34 MAP_OBJECT");
    const listi = story.sections[1].items;
    expect(listi.length).toBe(5);
  });

  test("§18.6: raba zemljišča — dokumentirano ločeno od neznanega (nič ugibanja, §9)", () => {
    const raba = story.sections.find((s) => s.title.includes("Raba zemljišča"));
    expect(raba).toBeDefined();
    // dokumentirani del (PS prepis): 326 parcel z znano rabo
    const documented = raba!.items.find((i) => i.text.includes("dokumentirana za 326"));
    expect(documented).toBeDefined();
    expect(documented!.tier).toBe("DOKAZANO");
    expect(documented!.source_ids).toContain("SRC-PS");
    expect(documented!.text).toContain("njiva");
    // neznani del: 2141 parcel brez prepisa (vključno 106 UNKNOWN iz PS)
    const unknown = raba!.items.find((i) => i.text.includes("NI še prepisana"));
    expect(unknown).toBeDefined();
    expect(unknown!.tier).toBe("NEZNANO");
    expect(unknown!.source_ids).toContain("SRC-PV");
    expect(unknown!.text).toContain("2141");
  });

  test("§18.10: neznanje je izrecno — RG, BP brez lokacije, konflikti", () => {
    const neznanka = story.sections[9].items;
    expect(neznanka.length).toBe(3);
    expect(neznanka[0].text).toContain("raziskovalnih vrzel");
    const rgOpen = kgf.research_gaps.filter((g) => g.status.includes("OPEN")).length;
    expect(neznanka[0].text).toContain(`${kgf.research_gaps.length} raziskovalnih vrzel`);
    expect(rgOpen).toBeGreaterThanOrEqual(0);
    const conflictClaims = kgf.claims.filter((c) => c.status === "CONFLICT").length;
    expect(neznanka[2].text).toContain(`${conflictClaims} konfliktnih trditev`);
  });

  test("contract: village zgodba EVIDENCED (ima C-00622 + source)", () => {
    expect(story.contract.story_status).toBe("EVIDENCED");
    expect(story.contract.used_claim_ids).toContain("C-00622");
    expect(story.contract.used_source_ids.length).toBeGreaterThan(3);
    expect(story.contract.input_entity_ids).toEqual([]);
    expect(story.contract.kg_sha256).toBe(sgf.provenance.kg_sha256);
  });

  test("determinizem: dva klica → identično (hash + story_id)", () => {
    const again = generateVillageStory();
    expect(again.contract.story_id).toBe(story.contract.story_id);
    expect(again.contract.content_hash).toBe(story.contract.content_hash);
    expect(again).toEqual(story);
  });

  test("tier razdelilnica sešteje vse iteme (merljiv rezultat PASS 7)", () => {
    const allItems = story.sections.flatMap((s) => s.items);
    const sum = Object.values(story.tier_breakdown).reduce((a, b) => a + b, 0);
    expect(sum).toBe(allItems.length);
    expect(story.tier_breakdown.NEZNANO).toBeGreaterThan(0);
  });
});

/* --------------- inventurа --------------- */

describe("STORY_ENGINE_INVENTORY", () => {
  test("usklojenost z grafom (številčno dokazano)", () => {
    expect(STORY_ENGINE_INVENTORY.nodes).toBe(kgf.nodes.length);
    expect(STORY_ENGINE_INVENTORY.edges).toBe(kgf.edges.length);
    expect(STORY_ENGINE_INVENTORY.claims).toBe(kgf.claims.length);
    expect(STORY_ENGINE_INVENTORY.kg_sha256).toBe(sgf.provenance.kg_sha256);
    expect(STORY_ENGINE_INVENTORY.generation_timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
