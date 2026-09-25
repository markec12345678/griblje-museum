import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Val 65 — ISSUE #42 §7 PASS 4: A01 BUILDING INVENTORY v1
 * 2-prehodno agentovo branje lista A01 (brez VLM) + deterministični join-i.
 * Varovalke: številke, glifne veze, px_prior ohranjen, "ni identificirano ≠ ni obstajalo",
 * PUA parcelni preverek, KG integracija (MAP_OBJECT / DEPICTED_ON / CORRESPONDS_TO_BP).
 */

const REPO = join(import.meta.dir, "..");
const inv = JSON.parse(
  readFileSync(join(REPO, "research-griblje/atlas-1825/a01-building-inventory-1825.json"), "utf-8"),
);
const kg = JSON.parse(
  readFileSync(join(REPO, "src/data/knowledge-graph-1825.json"), "utf-8"),
);

const RASTER_W = 2826;
const RASTER_H = 2273;

describe("val65 — a01-building-inventory-1825 (PASS 4, §7)", () => {
  test("številke: 24 objektov v65 / 18 z BP glifo / 43 prior-only / 8 rdečih glif", () => {
    expect(inv.val).toBe(65);
    expect(inv.pass).toBe(4);
    expect(inv.objects.length).toBe(24);
    expect(inv.objects.filter((o: { bp: string | null }) => o.bp).length).toBe(18);
    expect(inv.prior_only_bp.length).toBe(43);
    expect(inv.glyph_catalog_red_layer.length).toBe(8);
    expect(inv.counts.objects_v65).toBe(24);
    expect(inv.counts.not_located_1_100).toBe(40);
  });

  test("vsak objekt ima px znotraj rasterja + vsaj en virski izrezek + georef PROVIZORIČNO", () => {
    for (const o of inv.objects) {
      expect(o.px[0]).toBeGreaterThanOrEqual(0);
      expect(o.px[0]).toBeLessThanOrEqual(RASTER_W);
      expect(o.px[1]).toBeGreaterThanOrEqual(0);
      expect(o.px[1]).toBeLessThanOrEqual(RASTER_H);
      expect(Array.isArray(o.source_crops)).toBe(true);
      expect(o.source_crops.length).toBeGreaterThan(0);
      expect(o.georef_status).toContain("PROVIZORIČNO");
      expect(typeof o.lat).toBe("number");
      expect(typeof o.lng).toBe("number");
      expect(o.glyph_tier).not.toBe("UNKNOWN");
      expect(o.notes.length).toBeGreaterThan(0);
    }
  });

  test("BP 94: CLEAR glifa, POSITION_DISAGREE vs prior, px_prior OHRANJEN (nikoli prepisan)", () => {
    const o94 = inv.objects.find((o: { bp: string | null }) => o.bp === "94");
    expect(o94).toBeTruthy();
    expect(o94.glyph_tier).toBe("CLEAR");
    expect(o94.px).toEqual([2176, 1402]);
    expect(o94.px_prior).toEqual([2070, 1372]);
    expect(o94.verdict_vs_prior).toBe("POSITION_DISAGREE");
    expect(o94.px_prior_delta[0]).toBe(106);
    expect(o94.px_prior_delta[1]).toBe(30);
    // hišna veza iz hišnega registra (val 57: najmočnejša vez)
    expect(o94.related_houses.length).toBeGreaterThan(0);
    const h40 = o94.related_houses.find((r: { house_no: string }) => r.house_no === "40");
    expect(h40).toBeTruthy();
    expect(h40.status).toBe("VERIFIED-2x");
  });

  test("F-A01-03 novi BP glifi: 24 je edini CLEAR iz obsega 1–29; 91 CLEAR; 87/88 CANDIDATE", () => {
    const o24 = inv.objects.find((o: { bp: string | null }) => o.bp === "24");
    expect(o24.glyph_tier).toBe("CLEAR");
    expect(o24.verdict_vs_prior).toBe("NEW");
    const lowBps = inv.objects
      .filter((o: { bp: string | null }) => o.bp && Number(o.bp) < 30)
      .map((o: { bp: string }) => o.bp);
    expect(lowBps).toEqual(["24"]);
    const o91 = inv.objects.find((o: { bp: string | null }) => o.bp === "91");
    expect(o91.glyph_tier).toBe("CLEAR");
    expect(o91.verdict_vs_prior).toBe("NEW");
    for (const bp of ["87", "88"]) {
      const o = inv.objects.find((x: { bp: string | null }) => x.bp === bp);
      expect(o.glyph_tier).toBe("CANDIDATE");
      expect(o.verdict_vs_prior).toBe("NEW");
    }
  });

  test("§7: 'ni identificirano' ≠ 'ni obstajalo' — UNIDENTIFIED Žolant + 40 NOT_LOCATED z razlagó", () => {
    const zohlant = inv.objects.find(
      (o: { building_type: string; notes: string }) =>
        o.building_type === "complex_unidentified" && o.notes.includes("Žolant"),
    );
    expect(zohlant).toBeTruthy();
    expect(zohlant.glyph_tier).toBe("UNIDENTIFIED");
    expect(zohlant.bp).toBeNull();
    expect(zohlant.px).toEqual([1995, 2144]);
    expect(inv.bp_coverage.NOT_LOCATED.length).toBe(40);
    expect(inv.bp_coverage.not_located_meaning).toContain("NI dokaz, da objekt ni obstajal");
    // 96/97 potrjeno brez glife (R-t-96-97), ne izpodbito
    expect(inv.bp_coverage.NOT_LOCATED).toContain("96");
    expect(inv.bp_coverage.NOT_LOCATED).toContain("97");
  });

  test("F-A01-02 PUA parcelni preverek: glifa 94 ima PUA sec I zadetek (house_refs 47), 1459 = cesta sec II", () => {
    const o94 = inv.objects.find((o: { bp: string | null }) => o.bp === "94");
    expect(o94.pua_parcel_cross.length).toBeGreaterThan(0);
    expect(o94.pua_parcel_cross[0].section).toBe("I");
    expect(o94.pua_parcel_cross[0].houses).toContain("47");
    const road = inv.glyph_catalog_red_layer.find((g: { glyph: string }) => g.glyph === "1459");
    expect(road).toBeTruthy();
    expect(road.kind).toBe("road_parcel");
    expect(road.pua_parcel_cross[0].section).toBe("II");
  });

  test("najdbe F-A01-01..06 prisotne; negative findings 4 (brez cerkve/gostilne, rob lista, drevesa)", () => {
    const ids = inv.findings.map((f: { id: string }) => f.id);
    expect(ids).toEqual(["F-A01-01", "F-A01-02", "F-A01-03", "F-A01-04", "F-A01-05", "F-A01-06"]);
    expect(inv.negative_findings.length).toBe(4);
    expect(inv.negative_findings[0].finding).toContain("cerkev");
  });

  test("dvomljive vrednosti ostajo dvomljive: {34|61|51} UNRESOLVED brez BP, 93 PROBABLE", () => {
    const unresolved = inv.objects.find(
      (o: { glyph_tier: string; px: number[] }) => o.glyph_tier === "UNRESOLVED" && o.px[0] === 1936,
    );
    expect(unresolved).toBeTruthy();
    expect(unresolved.bp).toBeNull();
    expect(unresolved.notes).toContain("34|61|51");
    const o93 = inv.objects.find((o: { bp: string | null }) => o.bp === "93");
    expect(o93.glyph_tier).toBe("PROBABLE");
    expect(o93.notes).toContain("3|8");
  });
});

describe("val65 — KG v1.2 MAP_OBJECT integracija", () => {
  test("A01: 24 MAP_OBJECT vozlišč, vsi A01 DEPICTED_ON → SRC-A01, 18 A01 CORRESPONDS_TO_BP z claimi (val 66: skupaj 34 MO)", () => {
    const mo = kg.nodes.filter((n: { node_type: string }) => n.node_type === "MAP_OBJECT");
    expect(mo.length).toBe(34); // val 66: +8 A02 +2 A05
    const depA01 = kg.edges.filter(
      (e: { relation_type: string; from_entity: string }) =>
        e.relation_type === "DEPICTED_ON" && e.from_entity.startsWith("MO:MO-A01-"),
    );
    expect(depA01.length).toBe(24);
    for (const e of depA01) {
      expect(e.to_entity).toBe("SRC-A01");
      expect(e.evidence_status).toBeTruthy();
    }
    const cbpA01 = kg.edges.filter(
      (e: { relation_type: string; from_entity: string }) =>
        e.relation_type === "CORRESPONDS_TO_BP" && e.from_entity.startsWith("MO:MO-A01-"),
    );
    expect(cbpA01.length).toBe(18); // val 66: +3 A02 kandidati (12/20/22) = 21 skupaj
    for (const e of cbpA01) {
      expect(e.to_entity).toMatch(/^BP:\d{3}$/);
      expect(e.claim_ids.length).toBe(1);
    }
  });

  test("veriga MO → BP → HOUSE: MO za 94 → BP:094 → HOUSE:H-040 (§6 pot)", () => {
    const mo94 = kg.nodes.find(
      (n: { node_type: string; bp: string | null }) => n.node_type === "MAP_OBJECT" && n.bp === "94",
    );
    expect(mo94).toBeTruthy();
    const e2bp = kg.edges.find(
      (e: { relation_type: string; from_entity: string }) =>
        e.relation_type === "CORRESPONDS_TO_BP" && e.from_entity === mo94.node_id,
    );
    expect(e2bp.to_entity).toBe("BP:094");
    const e2house = kg.edges.find(
      (e: { relation_type: string; from_entity: string }) =>
        e.relation_type === "BP_BOUND_TO_HOUSE" && e.from_entity === "BP:094",
    );
    expect(e2house).toBeTruthy();
    expect(e2house.to_entity).toBe("HOUSE:H-040");
  });

  test("RG-001 RESOLVED-V66 (val 66: A02–A05 inventarizirani) + KG-F03/KG-F04 v grafa; 0 invariant violations", () => {
    const rg1 = kg.research_gaps.find((g: { gap_id: string }) => g.gap_id === "RG-001");
    expect(rg1.status).toBe("RESOLVED-V66");
    expect(rg1.current_result).toContain("vseh 5 listov");
    const fids = kg.findings.map((f: { finding_id: string }) => f.finding_id);
    expect(fids).toContain("KG-F03");
    expect(fids).toContain("KG-F04");
    expect(kg.invariant_violations).toEqual([]);
    expect(kg.val).toBe(66);
    const moCat = kg.coverage.categories.find(
      (c: { category: string }) => c.category === "map_objects_a01",
    );
    expect(moCat.total).toBe(67);
    expect(moCat.breakdown.located_v65_glyph).toBe(18);
  });
});
