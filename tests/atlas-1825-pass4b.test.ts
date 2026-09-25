/**
 * Val 66 — ISSUE #42 §7 PASS 4b: A02–A05 building inventory v1
 * Varovalke: identiteta listov (II–V + O.IX.24x), cerkev sv. Vid na A02,
 * nič dupliranja vasi A01↔A02, negativna lista A03/A04, F-A05-04 dve branji,
 * mejne točke N°1–9, KG integracija (DEPICTED_ON + CORRESPONDS_TO_BP claim-first).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE = resolve(import.meta.dir, "..", "research-griblje", "atlas-1825");
const inv = JSON.parse(
  readFileSync(resolve(BASE, "pass4b", "a02-a05-building-inventory-1825.json"), "utf8")
);
const kg = JSON.parse(readFileSync(resolve(BASE, "knowledge-graph-1825.json"), "utf8"));

describe("a02-a05-building-inventory v1 [val 66 PASS 4b]", () => {
  test("struktura + števila (varovalke)", () => {
    expect(inv.val).toBe(66);
    expect(inv.pass).toBe("4b");
    expect(inv.counts.objects_v66).toBe(10);
    expect(inv.counts.by_sheet).toEqual({ A02: 8, A03: 0, A04: 0, A05: 2 });
    expect(inv.counts.with_bp_glyph).toBe(3);
    expect(inv.counts.negative_findings).toBe(5);
    expect(inv.counts.boundary_points).toBe(9);
    expect(inv.counts.toponym_observations).toBe(21);
    expect(inv.objects.every((o: { px: number[] }) => Array.isArray(o.px) && o.px.length === 2)).toBe(true);
  });

  test("identiteta listov: II–V + O.IX.24ci/dg/cg/ch + napis družine na vseh 4 + A01", () => {
    const expected: Record<string, { numeral: string; code: string }> = {
      A02: { numeral: "II", code: "O.IX.24ci" },
      A03: { numeral: "III", code: "O.IX.24dg" },
      A04: { numeral: "IV", code: "O.IX.24cg" },
      A05: { numeral: "V", code: "O.IX.24ch" },
    };
    for (const [sheet, exp] of Object.entries(expected)) {
      const sh = inv.sheets[sheet];
      expect(sh.section_numeral).toBe(exp.numeral);
      expect(sh.series_code).toBe(exp.code);
      expect(sh.title_inscription).toContain("Reambullirungs");
      expect(sh.vac_details_url).toContain(`id=${sh.uodid}`);
    }
    // F-A05-01: WEIDENDORF (ne WAUENDORF) — popravek val 42 zapisan, ne izbrisan
    expect(inv.sheets.A05.boundaries["W/S"]).toContain("WEIDENDORF");
    expect(inv.sheets.A05.boundaries["W/S"]).toContain("F-A05-01");
  });

  test("F-A02-02: cerkev sv. Vid = MO-A02-001, tier CLEAR, tip church, px ±15", () => {
    const church = inv.objects.find((o: { object_id: string }) => o.object_id === "MO-A02-001");
    expect(church).toBeTruthy();
    expect(church.building_type).toBe("church");
    expect(church.glyph_tier).toBe("CLEAR");
    expect(church.position_precision_px).toBe(15);
    expect(church.px).toEqual([1975, 570]);
    expect(church.notes).toContain("F-A02-02");
    expect(church.source_crops).toContain("R-A02-church");
    // križ + labela + annotacija (dve branji ohranjeni)
    expect(church.footprint_note).toContain("KRIŽEM");
    expect(inv.sheets.A02.annotation_2x_val66).toContain("keine Ortschaft");
    expect(inv.sheets.A02.annotation_val42).toContain("Obrigkeit");
    expect(inv.sheets.A02.annotation_status).toContain("UNRESOLVED");
  });

  test("F-A02-03: BP kandidati 12/20/22 — REVIEW, brez merge v matrico, vtisi @3x NISO podatki", () => {
    const bps = inv.objects.filter((o: { bp_glyph: string | null }) => o.bp_glyph);
    expect(bps.map((o: { bp_glyph: string }) => o.bp_glyph).sort()).toEqual(["12", "20", "22"]);
    for (const o of bps) {
      expect(o.bp_cross_status).toContain("REVIEW");
      expect(o.bp_cross_status).toContain("merge prepovedan");
      expect(["CLEAR", "PROBABLE"]).toContain(o.glyph_tier);
      expect(o.sheet).toBe("A02");
      // R2 super-zoom vir za vsako
      expect(o.source_crops.some((c: string) => c.startsWith("R2-"))).toBe(true);
    }
    // 12 = edini CLEAR @6x
    const twelve = bps.find((o: { bp_glyph: string }) => o.bp_glyph === "12");
    expect(twelve.glyph_tier).toBe("CLEAR");
    // corroboration: vtisi ostajajo vtisi
    expect(inv.village_a02_corroboration.decision).toBe(
      "CORROBORATION_ONLY — A02 vas NI duplirana v MAP_OBJECT; samo 3 @6x berljive glife = novi objekti"
    );
    expect(inv.village_a02_corroboration.glyph_impressions_3x[0]).toContain("NISO podatki");
    // ni dupliranja: noben MO-A0x objekt nima bp_glyph iz A01 nabora lociranih (24-100 jasni)
    const a01 = JSON.parse(
      readFileSync(resolve(BASE, "a01-building-inventory-1825.json"), "utf8")
    );
    const a01Bps = new Set(
      a01.objects.filter((o: { bp: string | null }) => o.bp).map((o: { bp: string }) => o.bp)
    );
    for (const o of bps) expect(a01Bps.has(o.bp_glyph)).toBe(false);
  });

  test("georef: A02–A05 objekti brez izmišljenih koordinat (lat/lng = null, UNKNOWN)", () => {
    for (const o of inv.objects) {
      expect(o.lat).toBeNull();
      expect(o.lng).toBeNull();
      expect(o.georef_status).toContain("UNKNOWN");
      expect(typeof o.position_precision_px).toBe("number");
    }
  });

  test("negativni rezultati: A03/A04 = 0 stavb; val 42 potrjen/popavljen z kontrolami", () => {
    expect(inv.counts.buildings_a03_a04).toBe(0);
    const nfIds = inv.negative_findings.map((n: { id: string }) => n.id);
    expect(nfIds).toContain("NF-A03-01");
    expect(nfIds).toContain("NF-A04-01");
    expect(nfIds).toContain("NF-A05-01");
    expect(nfIds).toContain("NF-A02-01");
    const nf04 = inv.negative_findings.find((n: { id: string }) => n.id === "NF-A04-01");
    expect(nf04.finding).toContain("ZAVRJENA");
    const nf05 = inv.negative_findings.find((n: { id: string }) => n.id === "NF-A05-01");
    expect(nf05.finding).toContain("vinogradniški trakovi");
  });

  test("F-A05-04: 'Schimshu Dravi N°8' (val 66) vs 'Schumsthl Traverne' (val 42) — obe branji, signal oslabljen", () => {
    const f = inv.findings.find((x: { id: string }) => x.id === "F-A05-04");
    expect(f).toBeTruthy();
    expect(f.finding).toContain("Schimshu Dravi N°8");
    expect(f.finding).toContain("Schumsthl Traverne");
    expect(f.finding).toContain("OSLABI");
    expect(f.status).toContain("UNRESOLVED");
    const pt = inv.boundary_points.find((b: { point: string }) => b.point === "N°8");
    expect(pt.reading).toBe("Schimshu Dravi N°8");
    expect(pt.reading_variants.some((v: string) => v.includes("Traverne"))).toBe(true);
    expect(pt.status).toContain("UNRESOLVED");
  });

  test("F-A05-03: mejne točke N°1–9 prek listov = verjetno PR točke; vsaj 3 VERIFIED_FORM", () => {
    const pts = inv.boundary_points;
    expect(pts.length).toBe(9);
    expect(pts.map((b: { point: string }) => b.point)).toEqual([
      "N°1", "N:2", "N:3", "N:4|N:2", "N:5|N:3", "N:6", "N°8", "N°9", "N°3?",
    ]);
    expect(pts.filter((b: { status: string }) => b.status === "VERIFIED_FORM").length).toBeGreaterThanOrEqual(3);
    expect(pts.find((b: { point: string }) => b.point === "N°1")!.reading).toContain("Pri Pistami Pelach");
    expect(pts.find((b: { point: string }) => b.point === "N:3")!.reading).toContain("Na Lubetschen Berdu");
  });

  test("toponym opazovanja: 21, Pod Schuatinikom V66, Schumshi Damm koren z A05", () => {
    expect(inv.toponym_observations.length).toBe(21);
    const sch = inv.toponym_observations.find((t: { reading: string }) => t.reading === "Pod Schuatinikom");
    expect(sch.status).toContain("VERIFIED_FORM-V66");
    const damm = inv.toponym_observations.find((t: { reading: string }) => t.reading === "Schumshi Damm");
    expect(damm.status).toContain("F-A05-04 kontekst");
  });

  test("MO-A05-001: vinogradniški klaster (ne naselje) — grupni zapis, koče neberljive", () => {
    const cl = inv.objects.find((o: { object_id: string }) => o.object_id === "MO-A05-001");
    expect(cl.building_type).toBe("vineyard_district_group");
    expect(cl.footprint_note).toContain("8–15");
    expect(cl.glyph_tier).toBe("REVIEW");
    expect(cl.notes).toContain("F-A05-02");
    expect(cl.position_precision_px).toBe(60);
  });
});

describe("KG v1.3 integracija PASS 4b [val 66]", () => {
  test("10 novih MAP_OBJECT z DEPICTED_ON na prave SRC (claim-first za BP kandidate)", () => {
    const mo25 = kg.nodes.filter((n: { node_id: string }) =>
      ["MO:MO-A02-", "MO:MO-A05-"].some((p) => n.node_id.startsWith(p))
    );
    expect(mo25.length).toBe(10);
    const depicted = kg.edges.filter(
      (e: { relation_type: string; from_entity: string }) =>
        e.relation_type === "DEPICTED_ON" && e.from_entity.startsWith("MO:MO-A02-")
    );
    expect(depicted.every((e: { to_entity: string }) => e.to_entity === "SRC-A02")).toBe(true);
    expect(depicted.length).toBe(8);
  });

  test("cerkev: MO:MO-A02-001 → DEPICTED_ON SRC-A02; BP kandidati → CORRESPONDS_TO_BP z REVIEW claimi", () => {
    const churchEdge = kg.edges.find(
      (e: { from_entity: string; to_entity: string; relation_type: string }) =>
        e.from_entity === "MO:MO-A02-001" && e.to_entity === "SRC-A02" && e.relation_type === "DEPICTED_ON"
    );
    expect(churchEdge).toBeTruthy();
    const bpEdges = kg.edges.filter(
      (e: { relation_type: string; from_entity: string }) =>
        e.relation_type === "CORRESPONDS_TO_BP" && e.from_entity.startsWith("MO:MO-A02-")
    );
    expect(bpEdges.map((e: { to_entity: string }) => e.to_entity).sort()).toEqual([
      "BP:012", "BP:020", "BP:022",
    ]);
    for (const e of bpEdges) {
      expect(e.evidence_status).toBe("REVIEW");
      expect(e.source_ids).toEqual(["SRC-A02"]);
    }
    // claim-first: vsak edge ima claim z nizko zaupanje + merge-prepovedan note
    const claims = kg.claims.filter(
      (c: { subject: string; predicate: string }) =>
        c.predicate === "CORRESPONDS_TO_BP" && c.subject.startsWith("MO:MO-A02-")
    );
    expect(claims.length).toBe(3);
    for (const c of claims) {
      expect(c.status).toBe("REVIEW");
      expect(c.confidence).toBe("low");
      expect(c.notes).toContain("merge v BP matrico prepovedan");
      expect(c.source_ref.source).toBe("SRC-A02");
    }
  });

  test("dokazna veriga §6 za cerkev: MO → SRC-A02 → vac_details_url id=227668", () => {
    const src = kg.nodes.find((n: { node_id: string }) => n.node_id === "SRC-A02");
    expect(src.vac_details_url).toBe("https://vac.sjas.gov.si/vac/search/details?id=227668");
    const edge = kg.edges.find(
      (e: { from_entity: string; relation_type: string }) =>
        e.from_entity === "MO:MO-A02-001" && e.relation_type === "DEPICTED_ON"
    );
    expect(edge.source_ids).toContain("SRC-A02");
    expect(edge.evidence_status).toBe("PROVISIONAL"); // CLEAR → PROVISIONAL (isti nivo kot A01)
  });

  test("§11 invariante čez nove objekte: brez claims brez source, brez edges brez evidence", () => {
    const newMo = kg.claims.filter(
      (c: { subject: string }) => c.subject.startsWith("MO:MO-A02-") || c.subject.startsWith("MO:MO-A05-")
    );
    for (const c of newMo) expect(c.source_ref).toBeTruthy();
    const newEdges = kg.edges.filter(
      (e: { from_entity: string }) =>
        e.from_entity.startsWith("MO:MO-A02-") || e.from_entity.startsWith("MO:MO-A05-")
    );
    for (const e of newEdges) {
      expect(e.evidence_status).toBeTruthy();
      expect(e.source_ids.length).toBeGreaterThan(0);
    }
    expect(kg.invariant_violations).toEqual([]);
  });
});
