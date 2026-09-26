import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { generateVillageStory } from "../src/lib/atlas-story-engine";
import kgRaw from "../src/data/knowledge-graph-1825.json";

/**
 * Val 75+77 — PZ N83 "Katastral-Schätzungs-Elaborat" (Konskripcija) [373419]
 * (issue #42 §4/§14 + §20 prvi podatkovni korak).
 *
 * 71 strani; PREHOD 1 struktura + PREHOD 2 ključna branja (2 prehoda);
 * PREHOD 3 (val 77): Summa kontrola p67 + §8 rdeči stolpec (2 prehoda).
 * Testi NE zaupajo builderju: aritmetična vrata I1 (prebivalstvo) in I2
 * (površina PZ↔PV) ter §8 veriga (subtotal+Bauarea+voda vs Total) so
 * preverjena neodvisno v TS iz surovih celic.
 * PZ je dokumentni agregat — NIKOLI per-parcelne trditve (§4).
 */

const REPO = join(import.meta.dir, "..");

type PzFinding = { id: string; title: string; status: string; detail: string };

type PzDoc = {
  val: number;
  pass: string;
  issue: number;
  title: string;
  provenance: {
    uodid: number;
    docid: number;
    pages: number;
    vac_details_url: string;
    title_page: string;
    dating: Record<string, unknown>;
  };
  bevoelkerung_1830: {
    maenner: number;
    weiber: number;
    zusammen_seelen: number;
    haeuser: number;
    familien: number;
    source_page: number;
    reading_status: string;
    passes: number;
  };
  viehstand_1830: {
    rows: { count: number; species_read: string; species_status: string }[];
    reading_status: string;
    passes: number;
  };
  area_total: {
    black_superseded: { joch: number; klafter: number };
    red_corrected: { joch: number; klafter: number };
    red_corrected_qklft: number;
    pv_comparison: { joch: number; klafter: number; qklft: number };
    delta_qklft: number;
    delta_pct: number;
  };
  endresultat_p67: {
    title: string;
    rows: {
      no: number;
      kultur: string;
      classe: string;
      joch: number;
      klafter: number;
      crossed?: string[];
    }[];
    summa: { joch: number; klafter: number };
    sum_check: {
      rows_computed_joch: number;
      rows_computed_klafter: number;
      rows_computed_total_qklft: number;
      summa_written_qklft: number;
      delta_qklft: number;
      closes: boolean;
      status: string;
    };
  };
  weingaerten: {
    einzelne_classe: { joch: number; klafter: number };
    mustergrund_parcel_no: string;
  };
  structure_map: { page: number; content: string }[];
  revision_1830_p6: {
    rows: { kultur: string; joch: number; klafter: number; reading_status: string }[];
    unbenutzt: {
      bauarea: { joch: number; klafter: number; reading_status: string };
      wasser_fliessende_gruende: { joch: number; klafter: number; reading_status: string };
    };
    subtotal_cultivirte: { joch: number; klafter: number; reading_status: string };
    total_flaeche: { joch: number; klafter: number; reading_status: string };
    sum_check: {
      subtotal_plus_unbenutzt_qklft: number;
      total_written_qklft: number;
      delta_qklft: number;
      delta_pct: number;
      closes: boolean;
      status: string;
    };
  };
  findings: PzFinding[];
  invariants_enforced: string[];
  invariant_violations: unknown[];
  deterministic: boolean;
};

const KLFT = 1600;
const pz: PzDoc = JSON.parse(
  readFileSync(join(REPO, "research-griblje", "atlas-1825", "pz-konskripcija-1830.json"), "utf-8")
);

const kg = kgRaw as unknown as {
  val: number;
  title: string;
  nodes: { node_id: string; node_type: string; label: string; coverage?: string }[];
  findings: { finding_id: string; val: number; status: string }[];
};

describe("val 75+77 — PZ dokumentna resnica [373419]", () => {
  test("meta: uodid 373419 / docid 41784 / 71 strani / val 77 / PASS 2", () => {
    expect(pz.val).toBe(77);
    expect(pz.pass).toContain("PASS 2");
    expect(pz.provenance.uodid).toBe(373419);
    expect(pz.provenance.docid).toBe(41784);
    expect(pz.provenance.pages).toBe(71);
    expect(pz.deterministic).toBe(true);
  });

  test("I1 prebivalstvo: 222 M + 219 Ž = 441 (aritmetična vrata, neodvisno v TS)", () => {
    const b = pz.bevoelkerung_1830;
    expect(b.maenner).toBe(222);
    expect(b.weiber).toBe(219);
    expect(b.maenner + b.weiber).toBe(b.zusammen_seelen);
    expect(b.zusammen_seelen).toBe(441);
    expect(b.haeuser).toBe(70);
    expect(b.familien).toBe(102);
    expect(b.passes).toBe(2);
    expect(b.source_page).toBe(2);
  });

  test("I2 površina: PZ rdeči popravek ↔ PV < 1 % (neodvisno izračunano)", () => {
    const a = pz.area_total;
    const pzRed = a.red_corrected.joch * KLFT + a.red_corrected.klafter;
    const pv = a.pv_comparison.joch * KLFT + a.pv_comparison.klafter;
    expect(a.red_corrected.joch).toBe(1220);
    expect(a.red_corrected.klafter).toBe(1493);
    expect(a.black_superseded.joch).toBe(1235); // prečrtano — ohranjeno (§5)
    expect(a.black_superseded.klafter).toBe(1516);
    expect(pv).toBe(1955173); // PV val 74: 1221 J 1573 K
    expect(pzRed).toBe(1953493);
    expect(Math.abs(pv - pzRed)).toBe(1680);
    const pct = (Math.abs(pv - pzRed) / pv) * 100;
    expect(pct).toBeLessThan(1.0);
    expect(a.delta_pct).toBeCloseTo(0.0859, 2);
  });

  test("I3 Endresultat p67: struktura 10 vrstic, površine ≥ 0, classe veljavni", () => {
    const e = pz.endresultat_p67;
    expect(e.rows).toHaveLength(10);
    const valid = new Set(["I", "II", "C", "–"]);
    for (const r of e.rows) {
      expect(r.joch).toBeGreaterThanOrEqual(0);
      expect(r.klafter).toBeGreaterThanOrEqual(0);
      expect(valid.has(r.classe)).toBe(true);
    }
  });

  test("Endresultat: Weingärten 7 J 42 K = PV Joch števec + §7; Weiden mit Holznutzen 558 J 558 K (val 77 popravek)", () => {
    const rows = pz.endresultat_p67.rows;
    const wein = rows.find((r) => r.kultur === "Weingärten");
    expect(wein).toBeDefined();
    expect(wein!.joch).toBe(7);
    expect(wein!.klafter).toBe(42);
    const holz = rows.find((r) => r.kultur === "Weiden mit Holznutzen");
    expect(holz).toBeDefined();
    expect(holz!.joch).toBe(558);
    expect(holz!.klafter).toBe(558); // val 77: aktiven 558 nad prečrtanim 846 (val 75: 846 napačno kot aktiven)
    expect(holz!.crossed).toContain("846");
    const bauarea = rows.find((r) => r.kultur.startsWith("Baucarea"));
    expect(bauarea!.klafter).toBe(1199); // val 77: aktiven 1199 nad prečrtanim 1144 (val 75: 1499[?] napačno)
    expect(bauarea!.crossed).toContain("1144");
    // Aecher I + II = 414 J 962 K (§8 črne vrednosti)
    const aI = rows.find((r) => r.kultur === "Aecher" && r.classe === "I");
    const aII = rows.find((r) => r.kultur === "Aecher" && r.classe === "II");
    expect(aI!.joch + aII!.joch).toBe(414);
    expect(aI!.klafter + aII!.klafter).toBe(962);
  });

  test("F-PZ-04 EXPLAINED-V77: Summa = stale — vrata neodvisno izračunana (Δ 42.900) in dokumentirana", () => {
    const e = pz.endresultat_p67;
    const rowsJ = e.rows.reduce((s, r) => s + r.joch, 0);
    const rowsK = e.rows.reduce((s, r) => s + r.klafter, 0);
    const rowsTotal = rowsJ * KLFT + rowsK;
    const summa = e.summa.joch * KLFT + e.summa.klafter;
    expect(summa).toBe(1811695); // 1132 J 495 K
    expect(rowsJ).toBe(1155);
    expect(rowsK).toBe(6595);
    expect(rowsTotal).toBe(1854595); // val 77 popravek (val 75: 1855183 z napačnimi aktivnimi)
    expect(rowsTotal - summa).toBe(42900);
    expect(e.sum_check.closes).toBe(false);
    expect(e.sum_check.delta_qklft).toBe(42900);
    const f = pz.findings.find((x) => x.id === "F-PZ-04");
    expect(f).toBeDefined();
    expect(f!.status).toBe("EXPLAINED-V77");
    expect(f!.detail).toContain("zastala");
    expect(f!.detail).toContain("§8 rdeči stolpec");
  });

  test("§8 revizija 1830 (rdeči stolpec): sidro Total = §1 EXACT, veriga Δ 707, Weingärten TRANSCRIBED", () => {
    const rev = pz.revision_1830_p6;
    expect(rev.rows).toHaveLength(7);
    // SIDRO: Total Fläche = §1 rdeči popravek EXACT (neodvisno preverjeno)
    expect(rev.total_flaeche.joch).toBe(1220);
    expect(rev.total_flaeche.klafter).toBe(1493);
    expect(rev.total_flaeche.joch * KLFT + rev.total_flaeche.klafter).toBe(
      pz.area_total.red_corrected_qklft
    );
    expect(rev.total_flaeche.reading_status).toBe("SOLID");
    // veriga: subtotal + Bauarea + voda vs Total (Δ 707 QKlft = 0,036 %)
    const s = rev.subtotal_cultivirte;
    const bau = rev.unbenutzt.bauarea;
    const w = rev.unbenutzt.wasser_fliessende_gruende;
    const chain = s.joch * KLFT + s.klafter + (bau.joch * KLFT + bau.klafter) + (w.joch * KLFT + w.klafter);
    expect(chain).toBe(1954200);
    expect(rev.sum_check.total_written_qklft).toBe(1953493);
    expect(rev.sum_check.delta_qklft).toBe(707);
    expect(rev.sum_check.delta_pct).toBeLessThan(0.1);
    expect(rev.sum_check.closes).toBe(false);
    expect(rev.sum_check.status).toBe("OPEN-MICRO");
    // Weingärten 6 J 1059 K = edina TRANSCRIBED vrstica (križno p21 = F-PZ-06)
    const wein = rev.rows.find((r) => r.kultur === "Weingärten");
    expect(wein!.joch).toBe(6);
    expect(wein!.klafter).toBe(1059);
    expect(wein!.reading_status).toBe("TRANSCRIBED");
    expect(wein!.joch * KLFT + wein!.klafter).toBe(10659);
    // ostale vrstice REVIEW — deleži se ne objavljajo (§14)
    const reviewRows = rev.rows.filter((r) => r.reading_status === "REVIEW");
    expect(reviewRows.length).toBe(6);
    // Bauarea križno = p67 Posten 8 aktiven 1199
    expect(bau.klafter).toBe(1199);
    expect(bau.reading_status).toBe("TRANSCRIBED");
  });

  test("živina 1830: števci 124/20/30/150/30, vrste z iskrenimi statusi", () => {
    const v = pz.viehstand_1830;
    expect(v.rows.map((r) => r.count)).toEqual([124, 20, 30, 150, 30]);
    expect(v.rows[0].species_status).toBe("TRANSCRIBED"); // Ochsen
    expect(v.rows[1].species_status).toBe("REVIEW"); // Kühe | Rosse
    expect(v.rows[4].species_status).toBe("REVIEW"); // Lämmer[?]
    expect(v.reading_status).toBe("PARTIAL");
  });

  test("Weingärten §7: Mustergrund dokumentiran, rdeča revizija REVIEW", () => {
    const w = pz.weingaerten;
    expect(w.einzelne_classe).toEqual({ joch: 7, klafter: 42 });
    expect(w.mustergrund_parcel_no).toContain("[?]");
  });

  test("struktura: 71/71 strani zmapiranih, ključni odstavki prisotni", () => {
    expect(pz.structure_map).toHaveLength(71);
    const pages = pz.structure_map.map((s) => s.page);
    expect(pages[0]).toBe(1);
    expect(pages[70]).toBe(71);
    const joined = pz.structure_map.map((s) => s.content).join(" ");
    expect(joined).toContain("Bevölkerung");
    expect(joined).toContain("Viehstand");
    expect(joined).toContain("Weingärten");
    expect(joined).toContain("SPECIFISCHER AUSWEIS");
  });

  test("najdbe: F-PZ-01/02/06/08 RESOLVED, F-PZ-04 EXPLAINED-V77, brez tihega reševanja", () => {
    const byId = new Map(pz.findings.map((f) => [f.id, f]));
    expect(byId.get("F-PZ-01")!.status).toBe("RESOLVED");
    expect(byId.get("F-PZ-02")!.status).toBe("RESOLVED");
    expect(byId.get("F-PZ-06")!.status).toBe("RESOLVED");
    expect(byId.get("F-PZ-08")!.status).toBe("RESOLVED");
    expect(byId.get("F-PZ-03")!.status).toBe("PARTIAL");
    expect(byId.get("F-PZ-05")!.status).toBe("REVIEW");
    expect(byId.get("F-PZ-07")!.status).toBe("TO_VERIFY");
    expect(byId.get("F-PZ-09")!.status).toBe("RESOLVED");
    // vsaka najdba ima detail
    for (const f of pz.findings) expect(f.detail.length).toBeGreaterThan(30);
  });

  test("builder invarianti zapisani, kršitve prazne", () => {
    expect(pz.invariants_enforced.length).toBe(3);
    expect(pz.invariant_violations).toEqual([]);
  });
});

describe("val 77 — KG v1.8 + zgodba vasi", () => {
  test("KG v1.8: SRC-PZ z TRANSCRIBED_PARTIAL coverage (val 75+77) + KG-F09 val 77; števci stabilni", () => {
    expect(kg.val).toBe(77);
    expect(kg.title).toContain("v1.8");
    const srcPz = kg.nodes.find((n) => n.node_id === "SRC-PZ");
    expect(srcPz).toBeDefined();
    expect(srcPz!.coverage).toContain("TRANSCRIBED_PARTIAL");
    expect(srcPz!.coverage).toContain("val 75+77");
    expect(srcPz!.coverage).toContain("558 J 558 K");
    expect(kg.findings.some((f) => f.finding_id === "KG-F09" && f.val === 77)).toBe(true);
    const f09 = kg.findings.find((f) => f.finding_id === "KG-F09");
    expect(f09!.status).toContain("RESOLVED-V77");
  });

  test("zgodba vasi: prebivalstvo 1830 + PZ Weiden mit Holznutzen vidna; 10 sekcij", () => {
    const story = generateVillageStory();
    expect(story.ok).toBe(true);
    expect(story.sections).toHaveLength(10);
    const texts = story.sections.flatMap((s) => s.items.map((i) => i.text)).join("\n");
    expect(texts).toContain("441 duš = 222 moških + 219 žensk");
    expect(texts).toContain("Weiden mit Holznutzen");
    expect(texts).toContain("F-PV-02");
    const pzItems = story.sections
      .flatMap((s) => s.items)
      .filter((i) => i.source_ids.includes("SRC-PZ"));
    expect(pzItems.length).toBeGreaterThanOrEqual(2);
    // vsak PZ item ima pogodbeno sledljivost (§22)
    for (const i of pzItems) {
      expect(i.tier).toBeDefined();
    }
  });
});
