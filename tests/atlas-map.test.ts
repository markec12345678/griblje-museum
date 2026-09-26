/**
 * ATLAS 1825 — MAP DATA MODEL testi (issue #42 §15, PASS 5 — val 67).
 *
 * Načelo: nič ne ugiba. Koordinate samo kjer jih graf že ima (A01
 * PROVIZORIČNO); A02–A05 brez koordinat; parcele brez geometrije;
 * hiša brez dokazane BP↔MO veze = NOT_LOCATED.
 */
import { describe, expect, test } from "bun:test";
import {
  evidenceUrl,
  houseFeatures,
  mapData,
  mapObjectFeatures,
  mapSheets,
  toponymFeatures,
} from "@/lib/atlas-map";
import kg from "@/data/knowledge-graph-1825.json";

type KgNode = { node_id: string; node_type: string; [k: string]: unknown };
const nodes = (kg as unknown as { nodes: KgNode[] }).nodes;

describe("atlas-map: listi (§11 coverage matrix)", () => {
  test("vseh 5 listov A01–A05 z SRC-A0x in vac_details_url", () => {
    const sheets = mapSheets();
    expect(sheets.map((s) => s.sheet)).toEqual(["A01", "A02", "A03", "A04", "A05"]);
    for (const s of sheets) {
      expect(s.source_id).toBe(`SRC-${s.sheet}`);
      expect(s.vac_details_url).toContain("vac.sjas.gov.si");
      expect(s.evidence_url).toContain(encodeURIComponent(s.source_id));
    }
  });

  test("A01 nosi 24 objektov (val 65), A02: 8, A05: 2, A03+A04: 0 (negativni rezultat)", () => {
    const by = Object.fromEntries(mapSheets().map((s) => [s.sheet, s.map_objects]));
    expect(by["A01"]).toBe(24);
    expect(by["A02"]).toBe(8);
    expect(by["A05"]).toBe(2);
    expect(by["A03"]).toBe(0);
    expect(by["A04"]).toBe(0);
  });

  test("georef: A01 GEOREF v2 (val 72 — reka Kolpa), A02–A05 UNKNOWN (KG-F05 — brez sidra)", () => {
    const sheets = mapSheets();
    expect(sheets[0].georef_status).toContain("GEOREF v2");
    for (const s of sheets.slice(1)) {
      expect(s.georef_status).toContain("UNKNOWN");
    }
  });
});

describe("atlas-map: MAP_OBJECT sloj", () => {
  test("34 objektov skupaj = 24 A01 + 8 A02 + 2 A05", () => {
    const all = mapObjectFeatures();
    expect(all.length).toBe(34);
    expect(all.filter((m) => m.sheet === "A01").length).toBe(24);
    expect(all.filter((m) => m.sheet === "A02").length).toBe(8);
    expect(all.filter((m) => m.sheet === "A05").length).toBe(2);
  });

  test("A01 objekti imajo px + lat/lng (GEOREF v2); A02–A05 imajo px brez lat/lng", () => {
    for (const m of mapObjectFeatures("A01")) {
      expect(m.px).not.toBeNull();
      expect(m.lat).not.toBeNull();
      expect(m.lng).not.toBeNull();
      expect(m.georef_status).toContain("GEOREF v2");
    }
    for (const sheet of ["A02", "A05"]) {
      for (const m of mapObjectFeatures(sheet)) {
        expect(m.px).not.toBeNull();
        expect(m.lat).toBeNull();
        expect(m.lng).toBeNull();
        expect(m.georef_status).toContain("UNKNOWN");
      }
    }
  });

  test("vsak objekt ima evidence_url z node_id (sledljivost do vira, §15)", () => {
    for (const m of mapObjectFeatures()) {
      expect(m.evidence_url).toBe(`/api/atlas/evidence?node=${encodeURIComponent(m.node_id)}`);
      expect(m.node_id.startsWith("MO:MO-")).toBe(true);
    }
  });

  test("cerkev sv. Vid: MO:MO-A02-001 building_type=church, brez koordinat (F-A02-02)", () => {
    const church = mapObjectFeatures("A02").find((m) => m.node_id === "MO:MO-A02-001");
    expect(church).toBeDefined();
    expect(church!.building_type).toBe("church");
    expect(church!.lat).toBeNull();
  });

  test("bp_glyph normalizacija: A01 (polje bp) in A02 (polje bp_glyph) enako izpostavljena", () => {
    const m94 = mapObjectFeatures("A01").find((m) => m.node_id === "MO:MO-A01-002");
    expect(m94!.bp_glyph).toBe("94");
    const m12 = mapObjectFeatures("A02").find((m) => m.node_id === "MO:MO-A02-002");
    expect(m12!.bp_glyph).toBe("12");
  });
});

describe("atlas-map: HOUSE sloj (reševanje položaja prek BP)", () => {
  test("hiša 40: locirana prek BP 94 → MO:MO-A01-002 (veriga val 64/65, GEOREF v2)", () => {
    const h40 = houseFeatures().find((h) => h.node_id === "HOUSE:H-040");
    expect(h40).toBeDefined();
    expect(h40!.house_no_1825).toBe("40");
    expect(h40!.located).toBe(true);
    expect(h40!.position).not.toBeNull();
    expect(h40!.position!.via_bp).toBe(94);
    expect(h40!.position!.map_object).toBe("MO:MO-A01-002");
    expect(h40!.position!.georef_status).toContain("GEOREF v2");
    const ref94 = h40!.bp_refs.find((r) => r.bp === 94);
    expect(ref94!.final_status).toBe("CONFIRMED");
  });

  test("nič ne ugiba: not-located hiše nimajo pozicije", () => {
    for (const h of houseFeatures()) {
      if (!h.located) {
        expect(h.position).toBeNull();
      } else {
        expect(h.position!.lat).not.toBeNull();
        expect(h.position!.lng).not.toBeNull();
      }
    }
  });

  test("CONFLICT veza ne skrije lokacije BP glife (pozicija = glifa, veza ločeno)", () => {
    /* H-040 ima tudi CONFLICT bp_refs (91/95) — brez MO; CONFIRMED 94 nosi pozicijo.
     * H-ha z mešanimi statusi mora ostati locirana, evidence_status pa se ne spremeni. */
    const h40 = houseFeatures().find((h) => h.node_id === "HOUSE:H-040")!;
    expect(h40.evidence_status).toBe("CONFLICT");
    expect(h40.located).toBe(true);
  });

  test("locirane hiše ≤ hiš z BP ref-i; vsaka locirana ima via_bp + map_object", () => {
    const houses = houseFeatures();
    const withBp = houses.filter((h) => h.bp_refs.length > 0).length;
    const located = houses.filter((h) => h.located);
    expect(located.length).toBeGreaterThan(0);
    expect(located.length).toBeLessThanOrEqual(withBp);
    for (const h of located) {
      expect(h.position!.map_object).toContain("MO-A01");
    }
  });

  test("evidence_url za vsako hišo (klikljivo do vira)", () => {
    for (const h of houseFeatures()) {
      expect(h.evidence_url).toBe(`/api/atlas/evidence?node=${encodeURIComponent(h.node_id)}`);
    }
  });
});

describe("atlas-map: TOPONYM sloj (§12 register)", () => {
  test("37 toponimov, vsi historical_only z UNKNOWN modern_mapping", () => {
    const tp = toponymFeatures();
    expect(tp.length).toBe(37);
    expect(tp.every((t) => t.historical_only === true)).toBe(true);
    expect(tp.every((t) => t.modern_mapping === "UNKNOWN")).toBe(true);
  });

  test("TP-001 = GRÜBLE self_gemeinde, VERIFIED_FORM", () => {
    const tp1 = toponymFeatures().find((t) => t.node_id === "TP-001")!;
    expect(tp1.label).toBe("GRÜBLE");
    expect(tp1.type).toBe("self_gemeinde");
    expect(tp1.evidence_status).toBe("VERIFIED_FORM");
  });
});

describe("atlas-map: skupni mapData()", () => {
  test("counts usklajeni z sloji; disclaimer omenja §10 in OSM", () => {
    const d = mapData();
    expect(d.ok).toBe(true);
    expect(d.counts.map_objects).toBe(34);
    expect(d.counts.houses_total).toBe(d.layers.houses.length);
    expect(d.counts.houses_located + d.counts.houses_not_located).toBe(d.counts.houses_total);
    expect(d.counts.toponyms).toBe(37);
    expect(d.disclaimer).toContain("GEOREF v2");
    expect(d.disclaimer).toContain("ni zgodovinski dokaz");
  });

  test("parcele nimajo geometrije (§9): v grafu NE obstaja parcel poligon", () => {
    const parcels = nodes.filter((n: KgNode) => n.node_type === "PARCEL");
    expect(parcels.length).toBe(2467);
    for (const p of parcels) {
      expect(p.geometry).toBeUndefined();
      expect(p.coordinates).toBeUndefined();
      expect(p.px).toBeUndefined();
      expect(p.lat).toBeUndefined();
    }
  });

  test("KG-F05 varovalka: A02/A05 bp glife ne locirajo hiš (brez sidra A01↔A02)", () => {
    /* BP 12/20/22 imajo A02 MO (CORRESPONDS_TO_BP), a brez lat/lng →
     * hiša vezana na te BP SME ostati not-located na koordinatnem sloju. */
    const houses = houseFeatures();
    const bp12 = houses.find((h) => h.bp_refs.some((r) => r.bp === 12));
    if (bp12) {
      const mo12 = bp12.bp_refs.find((r) => r.bp === 12)!.map_object;
      if (mo12) expect(mo12).toContain("MO-A02");
      expect(bp12.located).toBe(false);
      expect(bp12.position).toBeNull();
    }
  });
});

describe("atlas-map: evidenceUrl", () => {
  test("encode posebnih znakov (presledek v 'house 40')", () => {
    expect(evidenceUrl("MO:MO-A02-001")).toBe("/api/atlas/evidence?node=MO%3AMO-A02-001");
  });
});
