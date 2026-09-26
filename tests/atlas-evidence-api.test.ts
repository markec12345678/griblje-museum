/**
 * Val 64 — Evidence Explorer resolver (issue #43 §2/§6) — enotni testi.
 * Vrne SAMO strukturo iz grafa; §11 invarianti: nič brez source, UNKNOWN/CONFLICT ločeni.
 */
import { describe, expect, test } from "bun:test";
import { evidenceFor, nodeExists, overview, resolveNodeParam, searchNodes } from "@/lib/atlas-evidence";

describe("atlas-evidence resolver [val 64]", () => {
  test("resolveNodeParam: varni vzorci + neobstoječi = null", () => {
    expect(resolveNodeParam("HOUSE:H-040")).toBe("HOUSE:H-040");
    expect(resolveNodeParam("house 40")).toBe("HOUSE:H-040");
    expect(resolveNodeParam("h-40")).toBe("HOUSE:H-040");
    expect(resolveNodeParam("bp 90")).toBe("BP:090");
    expect(resolveNodeParam("BP-090")).toBe("BP:090");
    expect(resolveNodeParam("TP-001")).toBe("TP-001");
    expect(resolveNodeParam("EVT-001")).toBe("EVT-001");
    expect(resolveNodeParam("SRC-PS")).toBe("SRC-PS");
    expect(resolveNodeParam("house 999")).toBeNull(); // hiša 999 ne obstaja (ni ugibanja)
    expect(resolveNodeParam("bp 999")).toBeNull();
    expect(resolveNodeParam("")).toBeNull();
    expect(resolveNodeParam("drgacljk")).toBeNull();
  });

  test("house 40 = dva OWNER claim-a (PUA + PS), CONFLICT viden — §2/§4", () => {
    const ev = evidenceFor("HOUSE:H-040");
    expect(ev.node.node_type).toBe("HOUSE");
    expect(ev.node.house_no_1825).toBe("40");
    const ownerClaims = ev.claims.filter((c) => c.predicate === "OWNER_DOCUMENTED");
    expect(ownerClaims.length).toBe(2);
    expect(ownerClaims.map((c) => c.source_ref.source).sort()).toEqual(["SRC-PS", "SRC-PUA"]);
    // obe trditvi živita (Sautter + Muster) — §4 conflict transparency
    const notes = ownerClaims.map((c) => c.notes ?? "").join(" | ");
    expect(notes).toContain("Sautter");
    expect(notes).toContain("Muster");
    // §6: pot do originalnega dokaza
    expect(ev.original_evidence.length).toBeGreaterThan(0);
    expect(ev.original_evidence.every((s) => s.vac_details_url?.startsWith("https://vac.sjas.gov.si/"))).toBe(true);
    // KG-F02: PS = uodid 373415 (popravljen katalog)
    const ps = ev.original_evidence.find((s) => s.source_id === "SRC-PS")!;
    expect(ps.vac_details_url).toContain("id=373415");
  });

  test("BP:090 = obe povezavi živita (KG-F01): H-043 FOUND + H-044 REVIEW + research gap", () => {
    const ev = evidenceFor("BP:090");
    const out = ev.edges.filter((e) => e.direction === "out" && e.relation_type === "BP_BOUND_TO_HOUSE");
    expect(out.length).toBe(2);
    const statuses = out.map((e) => e.evidence_status).sort();
    expect(statuses).toEqual(["FOUND", "REVIEW"]);
    expect(out.find((e) => e.evidence_status === "REVIEW")!.notes).toContain("KG-F01");
    expect(ev.research_gaps.length).toBe(1);
    expect(ev.research_gaps[0].missing_relation).toContain("KG-F01");
  });

  test("BP:015 (NOT_FOUND) → node obstaja, brez BP vezav, z research gap-om — §5/§9", () => {
    expect(nodeExists("BP:015")).toBe(true);
    const ev = evidenceFor("BP:015");
    expect(ev.node.evidence_status).toBe("NOT_FOUND");
    const bpEdges = ev.edges.filter((e) => e.relation_type === "BP_BOUND_TO_HOUSE");
    expect(bpEdges.length).toBe(0);
    expect(ev.research_gaps.length).toBe(1);
    expect(ev.research_gaps[0].current_result).toContain("NOT_FOUND");
    expect(ev.research_gaps[0].next_source.length).toBeGreaterThan(0);
  });

  test("pfand veriga: EVT-001 → 3 hiše + claims z [rot] source p12", () => {
    const ev = evidenceFor("EVT-001");
    const aff = ev.edges.filter((e) => e.direction === "out" && e.relation_type === "AFFECTS_HOUSE");
    expect(aff.length).toBe(3);
    expect(ev.node.statement).toContain("pfandbeyern 1801");
    const h43 = evidenceFor("HOUSE:H-043");
    const evtClaims = h43.claims.filter((c) => c.subject === "EVT-001");
    expect(evtClaims.length).toBe(1);
    expect(evtClaims[0].source_ref.source).toBe("SRC-PS");
    expect(evtClaims[0].source_ref.page).toBe(12);
  });

  test("TOPONYM TP-029 (Zagorje) → RESIDENCE povezave + DOCUMENTED_IN", () => {
    const ev = evidenceFor("TP-029");
    const inRes = ev.edges.filter((e) => e.relation_type === "RESIDENCE_DOCUMENTED_AT" && e.direction === "in");
    expect(inRes.length).toBeGreaterThan(0);
    expect(ev.node.modern_mapping).toBe("UNKNOWN"); // §5: UNKNOWN ostaja UNKNOWN
  });

  test("SOURCE node: SRC-PT nosi vac_details_url = §6 original evidence", () => {
    const ev = evidenceFor("SRC-PT");
    expect(ev.node.node_type).toBe("SOURCE");
    expect(ev.node.vac_details_url).toBe("https://vac.sjas.gov.si/vac/search/details?id=373416");
    expect(ev.node.uodid).toBe(373416);
    expect(ev.node.docid).toBe(41781);
  });

  test("overview (§10): brez umetnega procenta, vse ključne strukture", () => {
    const ov = overview();
    expect(ov.title).toBe("knowledge-graph-1825 v1.7");
    expect(ov.stats.nodes.HOUSE).toBe(167);
    expect(ov.stats.nodes.PERSON).toBe(488);
    expect(ov.stats.edges.OWNER_OF).toBe(254);
    expect(ov.stats.claims.CONFLICT).toBe(128);
    expect(ov.research_gaps.length).toBe(8);
    expect(ov.findings.map((f) => f.finding_id)).toEqual(["KG-F01", "KG-F02", "KG-F03", "KG-F04", "KG-F05", "KG-F06", "KG-F07", "KG-F08", "KG-F09"]);
    expect(JSON.stringify(ov.coverage)).toContain("brez umetnega skupnega procenta");
  });

  test("searchNodes: q=Muster najde osebo, type filter spoštovan", () => {
    const hits = searchNodes("Muster", "PERSON");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((h) => h.node_type === "PERSON")).toBe(true);
    const all = searchNodes("Zagorje");
    expect(all.some((h) => h.node_type === "TOPONYM")).toBe(true);
  });

  test("§11: vsak claim v verigi ima source_ref; vsak edge evidence_status", () => {
    for (const nodeId of ["HOUSE:H-040", "BP:090", "BP:015", "EVT-001", "TP-001", "PER-0001"]) {
      const ev = evidenceFor(nodeId);
      for (const c of ev.claims) {
        expect(c.source_ref).toBeTruthy();
        expect(c.source_ref.source).toBeTruthy();
      }
      for (const e of ev.edges) {
        expect(e.evidence_status).toBeTruthy();
        expect(e.source_ids.length).toBeGreaterThan(0);
      }
    }
  });
});
