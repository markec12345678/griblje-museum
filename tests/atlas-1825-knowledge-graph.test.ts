/**
 * Val 63 — ISSUE #43 §1/§3/§8/§9/§11: Knowledge Graph v1
 * Invarianti (§11): claim brez source, edge brez evidence, merge konfliktov,
 * UNKNOWN→VERIFIED brez vira, NOT_FOUND → research gap (ne "absent").
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE = resolve(import.meta.dir, "..", "research-griblje", "atlas-1825");
const kg = JSON.parse(readFileSync(resolve(BASE, "knowledge-graph-1825.json"), "utf8"));

describe("knowledge-graph-1825 v1.5 [val 72]", () => {
  test("struktura + velikosti (varovalke)", () => {
    expect(kg.title).toBe("knowledge-graph-1825 v1.5");
    expect(kg.findings.map((f: { finding_id: string }) => f.finding_id)).toEqual([
      "KG-F01", "KG-F02", "KG-F03", "KG-F04", "KG-F05", "KG-F06", "KG-F07", "KG-F08",
    ]); // KG-F08 (val 72): GEOREF v2 — MO koordinate preko similaritete po reki Kolpi
    // KG-F02: popravljen SRC katalog — PT = uodid 373416 (ne 227668 = A02)
    const pt = kg.nodes.find((n: { node_id: string }) => n.node_id === "SRC-PT");
    expect(pt.uodid).toBe(373416);
    expect(pt.vac_details_url).toContain("id=373416");
    const pua = kg.nodes.find((n: { node_id: string }) => n.node_id === "SRC-PUA");
    expect(pua.uodid).toBe(373417);
    expect(kg.nodes.length).toBe(3309);
    expect(kg.edges.length).toBe(3569);
    expect(kg.claims.length).toBe(622);
    expect(kg.research_gaps.length).toBe(8);
    expect(kg.story_atoms.length).toBe(4);
    expect(kg.invariant_violations).toEqual([]);
  });

  test("node tipi: SOURCE 13 / HOUSE 167 / PERSON 488 / PARCEL 2467 / BP 100 / TOPONYM 37 / EVENT 3 / MAP_OBJECT 34 (val 66)", () => {
    expect(kg.node_stats).toEqual({
      SOURCE: 13,
      HOUSE: 167,
      PERSON: 488,
      PARCEL: 2467,
      BP: 100,
      TOPONYM: 37,
      EVENT: 3,
      MAP_OBJECT: 34,
    });
  });

  test("§11 INVARIANTA: vsak claim ima source_ref", () => {
    for (const c of kg.claims) {
      expect(c.claim_id).toMatch(/^C-\d{5}$/);
      expect(c.source_ref).toBeTruthy();
      expect(c.source_ref.source).toBeTruthy();
      expect(["VERIFIED", "REVIEW", "CONFLICT", "SINGLE_SOURCE", "UNCERTAIN", "VERIFIED_FORM"]).toContain(c.status);
    }
  });

  test("§11 INVARIANTA: vsaka povezava ima evidence_status + source_ids", () => {
    for (const e of kg.edges) {
      expect(e.relation_id).toMatch(/^R-\d{5}$/);
      expect(e.from_entity).toBeTruthy();
      expect(e.to_entity).toBeTruthy();
      expect(e.relation_type).toBeTruthy();
      expect(e.evidence_status).toBeTruthy();
      expect(Array.isArray(e.source_ids)).toBe(true);
      expect(e.source_ids.length).toBeGreaterThan(0);
    }
  });

  test("§11 INVARIANTA: osebe nikoli mergeane (possible_duplicate ohranja NOT_MERGED)", () => {
    const persons = kg.nodes.filter((n) => n.node_type === "PERSON");
    expect(persons.length).toBe(488);
    for (const p of persons) {
      expect(p.merge_decision == null || p.merge_decision === "NOT_MERGED").toBe(true);
    }
    const dupCount = persons.filter((p) => p.possible_duplicate).length;
    expect(dupCount).toBe(161);
  });

  test("referenčna integriteta: vse edge/claim referenče kažejo na obstoječe node id-je", () => {
    const ids = new Set(kg.nodes.map((n) => n.node_id));
    for (const e of kg.edges) {
      expect(ids.has(e.from_entity)).toBe(true);
      expect(ids.has(e.to_entity)).toBe(true);
    }
    for (const c of kg.claims) {
      expect(ids.has(c.subject)).toBe(true);
      expect(ids.has(c.object)).toBe(true);
    }
  });

  test("F9 ohranjen v grafu: PUA = pripravljalno, PS = končno 1825 (dva ločena OWNER claim seta)", () => {
    const puaOwners = kg.claims.filter(
      (c) => c.predicate === "OWNER_DOCUMENTED" && c.source_ref.source === "SRC-PUA"
    );
    const psOwners = kg.claims.filter(
      (c) => c.predicate === "OWNER_DOCUMENTED" && c.source_ref.source === "SRC-PS"
    );
    expect(puaOwners.length).toBeGreaterThan(80);
    expect(psOwners.length).toBeGreaterThan(80);
    expect(puaOwners.every((c) => c.period!.includes("pripravljalno"))).toBe(true);
    expect(psOwners.every((c) => c.period!.includes("1825"))).toBe(true);
  });

  test("h.40 CONFLICT: dva OWNER claim-a (PUA Sautter + PS Muster), oba živita", () => {
    const h40 = kg.claims.filter((c) => c.subject === "HOUSE:H-040" && c.predicate === "OWNER_DOCUMENTED");
    expect(h40.length).toBe(2);
    const notes = h40.map((c) => c.notes ?? "").join(" | ");
    expect(notes).toContain("Sautter");
    expect(notes).toContain("Muster");
  });

  test("pfand 1801: EVT-001 → 3 hiše (43/45/46) z [rot] dokazom iz PS p12", () => {
    const aff = kg.edges.filter((e) => e.relation_type === "AFFECTS_HOUSE");
    expect(aff.length).toBe(3);
    expect(aff.every((e) => e.from_entity === "EVT-001")).toBe(true);
    expect(aff.every((e) => e.source_ids.includes("SRC-PS"))).toBe(true);
    const evt = kg.nodes.find((n) => n.node_id === "EVT-001");
    expect(evt!.statement).toContain("pfandbeyern 1801");
  });

  test("BP vezave: 119 edge (PT + PUA candidates); FOUND = bp90→h.43 (PUA) + bp94→h.40", () => {
    const bpEdges = kg.edges.filter((e) => e.relation_type === "BP_BOUND_TO_HOUSE");
    expect(bpEdges.length).toBe(119);
    const found = bpEdges.filter((e) => e.evidence_status === "FOUND");
    expect(found.map((e) => `${e.from_entity}→${e.to_entity}`).sort()).toEqual([
      "BP:090→HOUSE:H-043",
      "BP:094→HOUSE:H-040",
    ]);
  });

  test("KG-F01: bp90 register-internal napetost ohranjena — PT edge h.44 REVIEW + research gap, ni tihe resolucije", () => {
    const bp90pt = kg.edges.find(
      (e) => e.from_entity === "BP:090" && e.to_entity === "HOUSE:H-044"
    )!;
    expect(bp90pt.evidence_status).toBe("REVIEW");
    expect(bp90pt.notes).toContain("KG-F01");
    const bp90pua = kg.edges.find(
      (e) => e.from_entity === "BP:090" && e.to_entity === "HOUSE:H-043"
    )!;
    expect(bp90pua.evidence_status).toBe("FOUND");
    expect(bp90pua.notes).toContain("no.7 (p6)");
    const gap = kg.research_gaps.find((g) => g.missing_relation.includes("KG-F01"));
    expect(gap).toBeTruthy();
    expect(gap!.next_source).toContain("PT p7 re-read");
  });

  test("§5/§9: BP NOT_FOUND → research gaps (5), nikoli 'absent'", () => {
    const bpGaps = kg.research_gaps.filter((g) => g.missing_relation.startsWith("BP ") && !g.missing_relation.includes("KG-F01"));
    expect(bpGaps.length).toBe(5);
    expect(bpGaps.every((g) => g.status === "OPEN" && g.next_source.length > 0)).toBe(true);
    const notFoundBps = kg.nodes.filter(
      (n) => n.node_type === "BP" && n.evidence_status === "NOT_FOUND"
    );
    expect(notFoundBps.length).toBe(5);
  });

  test("§8 story atoms: vsak ima claim_ids/source_ids/entities + provenanco", () => {
    for (const sa of kg.story_atoms) {
      expect(sa.story_id).toMatch(/^SA-\d{3}$/);
      expect(Array.isArray(sa.entities)).toBe(true);
      expect(Array.isArray(sa.claim_ids)).toBe(true);
      expect(sa.source_ids.length).toBeGreaterThan(0);
      expect(sa.generated_at).toBeTruthy();
      expect(sa.generator).toContain("deterministično");
      expect(sa.provenance_note).toContain("Story Provenance");
    }
    // SA-002 = konflikti atom z 2 claim-oma; SA-003 = BP vezavi (bp94+bp90)
    const sa2 = kg.story_atoms.find((s) => s.story_id === "SA-002")!;
    expect(sa2.evidence_status).toBe("CONFLICT");
    expect(sa2.claim_ids.length).toBe(2);
    const sa3 = kg.story_atoms.find((s) => s.story_id === "SA-003")!;
    expect(sa3.entities).toContain("BP:094");
    expect(sa3.source_ids).toContain("SRC-A01");
  });

  test("TOPONYM nodes: 37, modern_mapping UNKNOWN, TP-001 IS_GEMEINDE_OF TP-003", () => {
    const topos = kg.nodes.filter((n) => n.node_type === "TOPONYM");
    expect(topos.length).toBe(37);
    const e = kg.edges.find((x) => x.relation_type === "IS_GEMEINDE_OF");
    expect(e!.from_entity).toBe("TP-001");
    expect(e!.to_entity).toBe("TP-003");
  });

  test("RESIDENCE_DOCUMENTED_AT: 10 field-level povezav (PUA+PS) — nič ugibanih", () => {
    const res = kg.edges.filter((e) => e.relation_type === "RESIDENCE_DOCUMENTED_AT");
    expect(res.length).toBe(10);
    expect(res.every((e) => e.evidence_status === "VERIFIED_FORM")).toBe(true);
    const targets = new Set(res.map((e) => e.to_entity));
    expect(targets.has("TP-032")).toBe(true); // Zogwitsche
    expect(targets.has("TP-029")).toBe(true); // Zagorje
  });

  test("MAP_OBJECT (val 65+66): 34 instanc — A01 24 + A02 8 + A05 2; RG-001 RESOLVED-V66", () => {
    const mo = kg.nodes.filter((n) => n.node_type === "MAP_OBJECT");
    expect(mo.length).toBe(34);
    const byPrefix = {
      a01: mo.filter((n) => n.node_id.startsWith("MO:MO-A01-")).length,
      a02: mo.filter((n) => n.node_id.startsWith("MO:MO-A02-")).length,
      a05: mo.filter((n) => n.node_id.startsWith("MO:MO-A05-")).length,
    };
    expect(byPrefix).toEqual({ a01: 24, a02: 8, a05: 2 });
    for (const n of mo) {
      expect(Array.isArray(n.px)).toBe(true);
    }
    const rg1 = kg.research_gaps.find((g) => g.gap_id === "RG-001")!;
    expect(rg1.missing_relation).toContain("MAP_OBJECT");
    expect(rg1.status).toBe("RESOLVED-V66");
    expect(rg1.tied_to).toBe("issue #42 §7");
  });

  test("KG-F05/F06: družina listov + PASS 4b najdbe v grafu; SRC-A0x nosijo napis + sekcije", () => {
    const f05 = kg.findings.find((f: { finding_id: string }) => f.finding_id === "KG-F05")!;
    expect(f05.status).toBe("OPEN");
    expect(f05.statement).toContain("Siche die Reambullirungs Beimappe");
    const f06 = kg.findings.find((f: { finding_id: string }) => f.finding_id === "KG-F06")!;
    expect(f06.statement).toContain("Cerkev sv. Vid");
    const a02 = kg.nodes.find((n: { node_id: string }) => n.node_id === "SRC-A02");
    expect(a02.section_numeral).toBe("II");
    expect(a02.series_code).toBe("O.IX.24ci");
    expect(a02.title_inscription).toContain("Reambullirungs");
    expect(a02.family_vintage).toContain("UNRESOLVED");
    const a05 = kg.nodes.find((n: { node_id: string }) => n.node_id === "SRC-A05");
    expect(a05.section_numeral).toBe("V");
    expect(a05.series_code).toBe("O.IX.24ch");
  });

  test("coverage: 8 kategorij (map_objects_a02_a05 dodana; A03/A04 negativni)", () => {
    expect(kg.coverage.categories.length).toBe(8);
    const mo25 = kg.coverage.categories.find((c: { category: string }) => c.category === "map_objects_a02_a05")!;
    expect(mo25.total).toBe(10);
    expect(mo25.breakdown.A02).toBe(8);
    expect(mo25.breakdown.A05).toBe(2);
    expect(mo25.breakdown.bp_glyph_candidates).toBe(3);
    expect(mo25.breakdown.negative_sheets).toEqual(["A03", "A04"]);
  });

  test("coverage: brez umetnega procenta, kategorije z dejanskim stanjem", () => {
    expect(kg.coverage.note).toContain("brez umetnega skupnega procenta");
    const parcels = kg.coverage.categories.find((c: { category: string }) => c.category === "parcels")!;
    expect(parcels.total).toBe(2467);
    expect(parcels.breakdown.geometry).toBe("NOT AVAILABLE");
  });
});
