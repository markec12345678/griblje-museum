import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { generateEntityStory, generateVillageStory } from "../src/lib/atlas-story-engine";
import kgRaw from "../src/data/knowledge-graph-1825.json";

/**
 * Val 74 — PV N83 "Izkaz rabe zemljišč" [373418] (issue #42 §4/§14).
 *
 * Uradni AGREGAT površin po kulturah za k.o. Grüble, 10. Jänner 1825.
 * Testi NE zaupajo builderju: aritmetična vrata I1–I3 so preverjena
 * neodvisno v TS iz surovih celic + pisanih vsot (2 prehoda + vrata).
 * PV je agregat — NIKOLI raba posamezne parcele (§4).
 */

const REPO = join(import.meta.dir, "..");

type PvRow = {
  key: string;
  original: string;
  sl: string;
  joch: number;
  klafter: number;
  quadrat_klafter: number;
  m2: number;
  share_pct: number;
  transcribed: boolean;
};

type PvDoc = {
  val: number;
  title: string;
  provenance: {
    uodid: number;
    docid: number;
    pages: number;
    header: Record<string, string>;
    date_written: string;
    cross_check_date: string;
  };
  totals: {
    table1_written: { joch: number; klafter: number };
    table2_written: { joch: number; klafter: number };
    grand_written: { joch: number; klafter: number };
    grand_quadrat_klafter: number;
    grand_m2: number;
    grand_km2: number;
    conversion: { klafter_m: number; qklft_m2: number; joch_m2: number };
  };
  method?: { rules: string[] };
  table1_kulturen: PvRow[];
  table2_sonder: PvRow[];
  findings: { id: string; status: string; statement: string }[];
  deterministic: boolean;
};

const KLFT = 1600;
const pv: PvDoc = JSON.parse(
  readFileSync(join(REPO, "research-griblje", "atlas-1825", "pv-land-use-1825.json"), "utf-8")
);

/** Vrata: iz celic izračunana (J, K) — Kurrent-normalizacija z carry 1600. */
function close(rows: PvRow[]): [number, number] {
  const j = rows.reduce((a, r) => a + r.joch, 0);
  const k = rows.reduce((a, r) => a + r.klafter, 0);
  return [j + Math.floor(k / KLFT), k % KLFT];
}

describe("PV 1825: aritmetična vrata (neodvisno od builderja)", () => {
  test("I1: vsota kulturen = pisana 1148 J 539 K", () => {
    const [j, k] = close(pv.table1_kulturen);
    expect(j).toBe(pv.totals.table1_written.joch);
    expect(k).toBe(pv.totals.table1_written.klafter);
    expect([j, k]).toEqual([1148, 539]);
  });

  test("I2: vsota posebnih = pisana 73 J 1034 K", () => {
    const [j, k] = close(pv.table2_sonder);
    expect(j).toBe(pv.totals.table2_written.joch);
    expect(k).toBe(pv.totals.table2_written.klafter);
    expect([j, k]).toEqual([73, 1034]);
  });

  test("I3: velika vsota = pisana 1221 J 1573 K = I + II", () => {
    const [j1, k1] = close(pv.table1_kulturen);
    const [j2, k2] = close(pv.table2_sonder);
    const k = k1 + k2;
    const grand: [number, number] = [j1 + j2 + Math.floor(k / KLFT), k % KLFT];
    expect(grand).toEqual([
      pv.totals.grand_written.joch,
      pv.totals.grand_written.klafter,
    ]);
    expect(grand).toEqual([1221, 1573]);
  });

  test("I4: m² pretvorba + deleži = 100 %; skupaj 7,032 km²", () => {
    const totalQ = 1221 * KLFT + 1573;
    expect(pv.totals.grand_quadrat_klafter).toBe(totalQ);
    const m2 = totalQ * pv.totals.conversion.qklft_m2;
    expect(Math.abs(m2 - pv.totals.grand_m2)).toBeLessThan(1);
    expect(pv.totals.grand_km2).toBe(7.032);
    const shareSum = [...pv.table1_kulturen, ...pv.table2_sonder].reduce((a, r) => a + r.share_pct, 0);
    expect(Math.abs(shareSum - 100)).toBeLessThan(0.05);
  });

  test("struktura 1825: Weiden 52 % > Aecher 34 % > Wiesen 6 % (kraška pašniška vas)", () => {
    const by = (key: string) => [...pv.table1_kulturen, ...pv.table2_sonder].find((r) => r.key === key)!;
    expect(by("weiden").share_pct).toBeGreaterThan(51);
    expect(by("aecher").share_pct).toBeGreaterThan(33);
    expect(by("wiesen").share_pct).toBeGreaterThan(6);
    expect(by("weiden").share_pct).toBeGreaterThan(by("aecher").share_pct);
  });
});

describe("PV 1825: dokazna disciplina (§4/§14)", () => {
  test("provenanca: uodid 373418 / docid 41783, 1 stran, 10. Jänner 1825 + križni pregled z PUA p49", () => {
    expect(pv.provenance.uodid).toBe(373418);
    expect(pv.provenance.docid).toBe(41783);
    expect(pv.provenance.pages).toBe(1);
    expect(pv.provenance.header.provinz).toBe("Illyrien");
    expect(pv.provenance.header.kreis).toBe("Neustadtl");
    expect(pv.provenance.header.district).toBe("Krupa");
    expect(pv.provenance.header.gemeinde).toBe("Grüble");
    expect(pv.provenance.date_written).toContain("10ten Jänner");
    expect(pv.provenance.cross_check_date).toContain("10. Januar 1825");
  });

  test("agregat NI per-parcelna raba: builder to izrecno zapiše", () => {
    expect((pv.method?.rules ?? []).some((r) => r.includes("NIKOLI raba posamezne parcele"))).toBe(true);
    expect(pv.title).toContain("Ausweis über die Benützungsart");
  });

  test("F-PV-02 OPEN: gozdna napetost (PV Wälder 0 vs PS 13 Wald parcel) ostaja vidna", () => {
    const f = pv.findings.find((x) => x.id === "F-PV-02");
    expect(f).toBeDefined();
    expect(f!.status).toBe("OPEN");
    expect(f!.statement).toContain("13 parcel z rabo 'Wald'");
    const waelder = pv.table2_sonder.find((r) => r.key === "waelder")!;
    expect(waelder.joch).toBe(0);
    expect(waelder.transcribed).toBe(false);
  });

  test("F-PV-03: vinogradi 7 J 665 K = falsifikabilna napoved za PS p56–143", () => {
    const f = pv.findings.find((x) => x.id === "F-PV-03");
    expect(f).toBeDefined();
    const wein = pv.table1_kulturen.find((r) => r.key === "wein_garten")!;
    expect(wein.joch).toBe(7);
    expect(wein.klafter).toBe(665);
    expect(wein.m2).toBeGreaterThan(42000);
  });

  test("F-PV-04: Bau-Parzellen 4 J 889 K ≈ 26.216 m² (uradni agregat stavbnih parcel)", () => {
    const bau = pv.table2_sonder.find((r) => r.key === "bau_parzellen")!;
    expect(bau.joch).toBe(4);
    expect(bau.klafter).toBe(889);
    expect(bau.m2).toBeCloseTo((4 * 1600 + 889) * 3.59665, 0);
  });
});

describe("PV 1825: integracija v KG v1.7 + engine + coverage", () => {
  const kg = kgRaw as unknown as {
    val: number;
    title: string;
    nodes: { node_id: string; node_type: string; coverage?: string; uodid?: number }[];
  };

  test("KG v1.7 (val 75): SRC-PV = TRANSCRIBED 1/1; ID-ji/stanja stabilni", () => {
    expect(kg.val).toBe(75);
    expect(kg.title).toBe("knowledge-graph-1825 v1.7");
    const pvNode = kg.nodes.find((n) => n.node_id === "SRC-PV")!;
    expect(pvNode.coverage).toContain("TRANSCRIBED 1/1");
    expect(pvNode.coverage).toContain("val 74");
    expect(pvNode.uodid).toBe(373418);
    // stabilnost: nič novih/odstranjenih entitet
    const parcels = kg.nodes.filter((n) => n.node_type === "PARCEL");
    expect(parcels.length).toBe(2467);
  });

  test("zgodba vasi §18 omenja PV agregat (1221 J 1573 K) brez per-parcelnega ugibanja", () => {
    const story = generateVillageStory();
    const texts = story.sections.flatMap((s) => s.items.map((i) => i.text));
    expect(texts.some((t) => t.includes("1221 J 1573 K") && t.includes("val 74"))).toBe(true);
    expect(texts.some((t) => t.includes("čaka na prepis"))).toBe(false);
  });

  test("zgodba hiše H-040: 'brez zapisa po parceli' omenja PV val 74", () => {
    const story = generateEntityStory("HOUSE:H-040");
    const texts = story!.sections.flatMap((s) => s.items.map((i) => i.text));
    const raba = texts.find((t) => t.includes("brez zapisa po parceli") || t.includes("NI dokumentirana po parceli"));
    expect(raba).toBeDefined();
    expect(raba!).toContain("373418");
    expect(raba!).toContain("val 74");
  });
});
