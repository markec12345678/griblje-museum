import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { generateVillageStory } from "../src/lib/atlas-story-engine";
import kgRaw from "../src/data/knowledge-graph-1825.json";

/**
 * Val 77 — PZ N83 "Katastral-Schätzungs-Elaborat" (Konskripcija) [373419]
 * PASS 2: odločilni re-read Endresultata p67 + §8 (p6) z aritmetičnimi vrati.
 *
 * 71 strani; PREHOD 1 struktura (v75) + PREHOD 2 ključna branja (v75) +
 * PREHOD 3 odločilni re-read celic (v77). Testi NE zaupajo builderju:
 * vrata I1–I6 so preverjena neodvisno v TS iz surovih celic.
 * PZ je dokumentni agregat — NIKOLI per-parcelne trditve (§4).
 */

const REPO = join(import.meta.dir, "..");

type PzFinding = { id: string; title: string; status: string; detail: string };

type PzRow = {
  no: number;
  kultur: string;
  classe: string;
  joch: number;
  klafter: number;
  crossed?: Record<string, string[]>;
  reading_status?: string;
  note?: string;
};

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
  paragraf8_p6: {
    einzeln_rows: { kultur: string; joch: number; klafter: number; note?: string }[];
    unbenutzt_rows: { kultur: string; joch: number | null; klafter: number | null; status?: string }[];
    total_gemeinde: { joch: number; klafter: number; crossed: string[] };
    zusammen_column_semantics: { status: string };
  };
  revision_1830_zusammen: {
    rows: { kultur: string; joch: number; klafter: number; reading_status: string }[];
    subtotal_cultivirte: { joch: number; klafter: number; reading_status: string };
    unbenutzt_red: {
      bauarea: { joch: number; klafter: number; reading_status: string };
      unbenutzbar_voda: { joch: number; klafter: number; reading_status: string };
    };
    total_flaeche: { joch: number; klafter: number; reading_status: string };
    sum_check: { subtotal_plus_unbenutzt_qklft: number; total_written_qklft: number; delta_qklft: number; delta_pct: number; closes: boolean; status: string };
  };
  endresultat_p67: {
    title: string;
    revision_pattern: string;
    rows: PzRow[];
    summa: { joch: number; klafter: number; crossed: Record<string, string[]> };
    sum_check: {
      rows_computed_joch: number;
      rows_computed_klafter: number;
      rows_computed_total_qklft: number;
      summa_written_qklft: number;
      delta_qklft: number;
      delta_display: string;
      closes: boolean;
      klafter_column_closes: boolean;
      status: string;
      note: string;
    };
  };
  rektifikacija_beschreibung: {
    title: string;
    source_pages: number[];
    passes: number;
    structure: { klasse: string; page: number; clases_opisane?: string[]; content: string }[];
    muster_parcel_citations: {
      page: number; klasse: string; parcel_no: number; parcel_no_alt: number[];
      joch: number; klafter: number; owner: string; reading_status: string;
      pua_1825_match: boolean; ps_1825_match: boolean; note: string;
    }[];
    renumbering: { finding: string; interpretation: string; status: string };
    protocol_p40: { dates: Record<string, string | number>; jury: string; commission: string; addendum: string };
    post_1830_protocols: Record<string, string>;
    conclusion: { f_pz_04_path: string; remaining_paths: string[]; f_pz_04_status: string };
    reading_honesty: string;
  };
  reinertrag_p43_47: {
    title: string;
    source_pages: number[];
    method: { name: string; bands: string; readers: string; calls: string; admission_rule: string; resolution: string };
    structure_correction_vs_val75: string[];
    acker_wirthschafts_kurse: {
      system: string;
      classen: Record<
        string,
        {
          page: number; heading: string; kurse: string; duengung: string;
          natural_ertrag_pro_joch: { item: number | null; produkt: string; wert: number | string; enota: string; note?: string }[];
          crossed?: string;
        }
      >;
    };
    wiesen_kg_wg_hw: {
      page: number;
      wiesen: { heading: string; classe_I: string; classe_II: string };
      kleine_gaerten: { heading: string; note: string };
      weingaerten: { heading: string; yield: string; cross_check: string };
      hutweiden: { heading: string; yield: string };
    };
    huthweiden_holznutzung: { page: number; heading: string; prosa: string; actum: string; signatures: string; cross_impact: string };
    reading_honesty: string;
  };
  shares_1830: {
    shares: { kultur: string; joch: number; klafter: number; qklft: number; pct_of_total: number; basis: string }[];
    sum_qklft: number;
    total_qklft: number;
    sum_closes: boolean;
    honesty: string;
  };
  weingaerten: {
    einzelne_classe: { joch: number; klafter: number };
    mustergrund_parcel_no: string;
  };
  method: {
    rejected_reads: string;
    [key: string]: unknown;
  };
  structure_map: { page: number; content: string }[];
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

describe("val 81 — PZ PASS 7 dokumentna resnica [373419]", () => {
  test("meta: uodid 373419 / docid 41784 / 71 strani / val 81 PASS 7", () => {
    expect(pz.val).toBe(81);
    expect(pz.pass).toContain("PASS 7");
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

  test("val 77 korekcije: Summa 1152|495, GG 405, Bauarea 1199, WmH Klf 558 (nad 846)", () => {
    const e = pz.endresultat_p67;
    expect(e.summa.joch).toBe(1152); // val 75 je bral 1132 (Kurrent 3↔5)
    expect(e.summa.klafter).toBe(495);
    expect(e.summa.crossed.klafter).toHaveLength(1); // prečrtana 474[?]|481[?]
    const gg = e.rows.find((r) => r.kultur === "Größere Gärten");
    expect(gg!.klafter).toBe(405); // val 75 je bral 105
    const bau = e.rows.find((r) => r.kultur === "Bauarea");
    expect(bau!.joch).toBe(1);
    expect(bau!.klafter).toBe(1199); // val 75 je bral 1499
    expect(bau!.crossed!.klafter).toEqual(["1144"]);
    const holz = e.rows.find((r) => r.kultur === "Weiden mit Holznutzen");
    expect(holz!.joch).toBe(558);
    expect(holz!.klafter).toBe(558); // revizija: trenutna NAD prečrtano 846
    expect(holz!.crossed!.klafter).toEqual(["846"]);
    const hw = e.rows.find((r) => r.kultur === "Hutweiden");
    expect(hw!.klafter).toBe(702);
    expect(hw!.crossed!.klafter).toEqual(["402[?]"]);
    // revizijski vzorec dokumentiran
    expect(e.revision_pattern).toContain("NAD prečrtano");
  });

  test("I4 §8 vrata: 6 kultur EXACT (neodvisno v TS iz surovih vrstic)", () => {
    const rows = pz.endresultat_p67.rows;
    const p8 = pz.paragraf8_p6;
    const sum = (kultur: string, klass?: string) => {
      const sel = rows.filter((r) => r.kultur === kultur && (klass === undefined || r.classe === klass));
      const j = sel.reduce((s, r) => s + r.joch, 0);
      const k = sel.reduce((s, r) => s + r.klafter, 0);
      return j * KLFT + k;
    };
    const p8q = (kultur: string) => {
      const row = p8.einzeln_rows.find((r) => r.kultur.startsWith(kultur))!;
      return row.joch * KLFT + row.klafter;
    };
    expect(sum("Aecher")).toBe(414 * KLFT + 962);
    expect(p8q("Aecher")).toBe(414 * KLFT + 962);
    expect(sum("Kleine Gärten")).toBe(p8q("Kleine Gärten"));
    expect(sum("Größere Gärten")).toBe(p8q("Größere Gärten"));
    expect(sum("Weingärten")).toBe(p8q("Weingärten"));
    expect(sum("Hutweiden")).toBe(p8q("Huthweiden"));
    // Bauarea: p67 vrstica 8 == §8 unbenutzt_rows[0]
    const p8bau = p8.unbenutzt_rows[0];
    expect(bauQ()).toBe(p8bau.joch! * KLFT + p8bau.klafter!);
    function bauQ() {
      const b = rows.find((r) => r.kultur === "Bauarea")!;
      return b.joch * KLFT + b.klafter;
    }
  });

  test("I5 Wiesen vrata: I+II = 45 J 812 K; Wiesen I = 5 J izpeljano (GATED)", () => {
    const rows = pz.endresultat_p67.rows;
    const wI = rows.find((r) => r.kultur === "Wiesen" && r.classe === "I")!;
    const wII = rows.find((r) => r.kultur === "Wiesen" && r.classe === "II")!;
    expect(wI.joch).toBe(5); // izpeljano: 45 − 39 − 1 J (2412 K)
    expect(wI.reading_status).toBe("GATED (I5)");
    expect(wI.klafter).toBe(1594);
    expect(wII.joch).toBe(39);
    expect(wII.klafter).toBe(818);
    // neodvisno: 5+39 = 44 J + (1594+818 = 2412 K = 1 J 812 K) = 45 J 812 K
    const totalQ = (wI.joch + wII.joch) * KLFT + wI.klafter + wII.klafter;
    expect(totalQ).toBe(45 * KLFT + 812);
    // val 75 alternativa (15 J) je aritmetično nemogoča glede na §8 45|812
    expect((15 + 39) * KLFT + wI.klafter + wII.klafter).not.toBe(45 * KLFT + 812);
  });

  test("I6 Total vrata: vrstice 1–8 + unbenützbar (izpeljano 71|998) = 1220 J 1493 K", () => {
    const rows = pz.endresultat_p67.rows;
    const rowsJ = rows.reduce((s, r) => s + r.joch, 0);
    const rowsK = rows.reduce((s, r) => s + r.klafter, 0);
    const rowsTotal = rowsJ * KLFT + rowsK;
    expect(rowsJ).toBe(1145);
    expect(rowsK).toBe(6895);
    expect(rowsTotal).toBe(1838895);
    const total = pz.paragraf8_p6.total_gemeinde;
    expect(total.joch).toBe(1220);
    expect(total.klafter).toBe(1493);
    const totalQ = total.joch * KLFT + total.klafter;
    const implied = totalQ - rowsTotal;
    expect(implied).toBe(71 * KLFT + 998); // unbenützbar izpeljano (F-PZ-10 REVIEW)
    expect(total.crossed).toEqual(["1217[?]", "1444[?]"]);
  });

  test("F-PZ-04 OPEN: Summa 3 J nad vsoto vrstic — Klf stolpec se zapira, nič vsiljeno", () => {
    const e = pz.endresultat_p67;
    const rowsJ = e.rows.reduce((s, r) => s + r.joch, 0);
    const rowsK = e.rows.reduce((s, r) => s + r.klafter, 0);
    const rowsTotal = rowsJ * KLFT + rowsK;
    const summa = e.summa.joch * KLFT + e.summa.klafter;
    expect(summa).toBe(1843695); // 1152 J 495 K (val 77)
    expect(rowsTotal).toBe(1838895); // 1145 J 6895 K
    expect(summa - rowsTotal).toBe(4800); // Δ = 3 Joch EXACT
    expect(e.sum_check.closes).toBe(false);
    expect(e.sum_check.status).toBe("OPEN");
    expect(e.sum_check.delta_qklft).toBe(rowsTotal - summa);
    expect(e.sum_check.klafter_column_closes).toBe(true); // 495 = 495
    expect(e.sum_check.delta_display).toContain("3 J");
    const f = pz.findings.find((x) => x.id === "F-PZ-04");
    expect(f).toBeDefined();
    expect(f!.status).toBe("OPEN");
    expect(f!.detail).toContain("1152");
  });

  test("deleži 1830: vsota == Total EXACT, pogodbena poštenost (UI absent)", () => {
    const s = pz.shares_1830;
    expect(s.sum_closes).toBe(true);
    expect(s.sum_qklft).toBe(s.total_qklft);
    expect(s.total_qklft).toBe(1953493);
    const njive = s.shares.find((x) => x.kultur.startsWith("Aecher"))!;
    const holz = s.shares.find((x) => x.kultur.startsWith("Weiden mit Holznutzen"))!;
    expect(njive.pct_of_total).toBeCloseTo(33.96, 1);
    expect(holz.pct_of_total).toBeCloseTo(45.73, 1);
    // pogodba: UI pasture_share ostaja absent dokler F-PZ-04 OPEN
    expect(s.honesty).toContain("pasture_share");
    expect(s.honesty).toContain("absent");
  });

  test("§8 p6: Wiesen 45|812 (val 75 korekcija '55'), Zusammen stolpec REVIEW", () => {
    const p8 = pz.paragraf8_p6;
    const wiesen = p8.einzeln_rows.find((r) => r.kultur === "Wiesen")!;
    expect(wiesen.joch).toBe(45);
    expect(wiesen.klafter).toBe(812);
    expect(wiesen.note).toContain("val 77");
    const unbenutzbar = p8.unbenutzt_rows.find((r) => r.status === "REVIEW")!;
    expect(unbenutzbar.joch).toBeNull(); // več-vrednostna celica — nič vsiljeno
    expect(p8.zusammen_column_semantics.status).toBe("STRUCTURED-V78");
  });

  test("§8 rdeči stolpec 'Zusammen' (F-PZ-15): 7 vrstic REVIEW/TRANSCRIBED, sidro Total = §1 EXACT, veriga Δ 707", () => {
    const rev = pz.revision_1830_zusammen;
    expect(rev.rows).toHaveLength(7);
    // edina TRANSCRIBED vrstica = Weingärten 6 J 1059 K (križno §7 p21 = F-PZ-06)
    const wg = rev.rows.find((r) => r.kultur === "Weingaerten");
    expect(wg!.joch).toBe(6);
    expect(wg!.klafter).toBe(1059);
    expect(wg!.reading_status).toBe("TRANSCRIBED");
    expect(wg!.joch * KLFT + wg!.klafter).toBe(10659);
    // ostale vrstice REVIEW — deleži se NE izpeljejo iz rdečega stolpca (§14)
    expect(rev.rows.filter((r) => r.reading_status === "REVIEW")).toHaveLength(6);
    // sidro: Total = §1 rdeči popravek EXACT
    expect(rev.total_flaeche.joch * KLFT + rev.total_flaeche.klafter).toBe(1953493);
    expect(rev.total_flaeche.reading_status).toBe("SOLID");
    // veriga: subtotal + Bauarea + voda = 1.954.200 (Δ 707 = 0,036 % — OPEN-MICRO)
    const chain =
      rev.subtotal_cultivirte.joch * KLFT + rev.subtotal_cultivirte.klafter +
      rev.unbenutzt_red.bauarea.joch * KLFT + rev.unbenutzt_red.bauarea.klafter +
      rev.unbenutzt_red.unbenutzbar_voda.joch * KLFT + rev.unbenutzt_red.unbenutzbar_voda.klafter;
    expect(chain).toBe(1954200);
    expect(rev.sum_check.delta_qklft).toBe(707);
    expect(rev.sum_check.delta_pct).toBeLessThan(0.1);
    expect(rev.sum_check.status).toBe("OPEN-MICRO");
    expect(rev.sum_check.closes).toBe(false);
    // Bauarea križno = p67 Posten 8 (F-PZ-11)
    expect(rev.unbenutzt_red.bauarea.klafter).toBe(1199);
    expect(rev.unbenutzt_red.bauarea.reading_status).toBe("TRANSCRIBED");
  });

  test("F-PZ-14/15: rešitvene poti ovržene (RESOLVED) + rdeči stolpec REVIEW — brez tihega reševanja", () => {
    const byId = new Map(pz.findings.map((f) => [f.id, f]));
    expect(byId.get("F-PZ-14")!.status).toBe("RESOLVED");
    expect(byId.get("F-PZ-14")!.detail).toContain("p30");
    expect(byId.get("F-PZ-15")!.status).toBe("REVIEW");
    expect(byId.get("F-PZ-15")!.detail).toContain("URADNI deleži 1830 ostajajo iz F-PZ-13");
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

  test("najdbe: 17; nove F-PZ-10..17 z iskrenimi statusi", () => {
    const byId = new Map(pz.findings.map((f) => [f.id, f]));
    expect(pz.findings).toHaveLength(17);
    expect(byId.get("F-PZ-01")!.status).toBe("RESOLVED");
    expect(byId.get("F-PZ-02")!.status).toBe("RESOLVED");
    expect(byId.get("F-PZ-06")!.status).toBe("RESOLVED");
    expect(byId.get("F-PZ-08")!.status).toBe("RESOLVED");
    expect(byId.get("F-PZ-09")!.status).toBe("RESOLVED");
    expect(byId.get("F-PZ-11")!.status).toBe("RESOLVED");
    expect(byId.get("F-PZ-13")!.status).toBe("RESOLVED");
    expect(byId.get("F-PZ-03")!.status).toBe("PARTIAL");
    expect(byId.get("F-PZ-05")!.status).toBe("REVIEW");
    expect(byId.get("F-PZ-10")!.status).toBe("REVIEW");
    expect(byId.get("F-PZ-07")!.status).toBe("TO_VERIFY");
    expect(byId.get("F-PZ-04")!.status).toBe("OPEN");
    expect(byId.get("F-PZ-12")!.status).toBe("RESOLVED"); // val 81: band-transkripcija p43–47 izvedena
    expect(byId.get("F-PZ-16")!.status).toBe("RESOLVED"); // val 79: Rektifikacija opisna
    // vsaka najdba ima detail
    for (const f of pz.findings) expect(f.detail.length).toBeGreaterThan(30);
  });

  test("builder invarianti: 6 zapisanih (I1–I6), kršitve prazne", () => {
    expect(pz.invariants_enforced).toHaveLength(6);
    expect(pz.invariants_enforced.join(" ")).toContain("I4");
    expect(pz.invariants_enforced.join(" ")).toContain("I6");
    expect(pz.invariant_violations).toEqual([]);
  });

  test("zavrnjena branja dokumentirana (F-PZ-12 — nič tihega; val 81: nadomeščeno z band-metodo)", () => {
    const m = pz.method;
    expect(m.rejected_reads).toContain("p43–47");
    expect(m.rejected_reads).toContain("ZAVRJEN");
    expect(m.rejected_reads).toContain("band-metodo val 81");
  });
});

describe("val 77/86 — KG v2.0 + zgodba vasi", () => {
  test("KG v2.1: SRC-PZ TRANSCRIBED_PARTIAL (val 77) + KG-F09 val 77 + KG-F10 val 84; števci stabilni", () => {
    expect(kg.val).toBe(98);
    expect(kg.title).toContain("v2.2");
    const srcPz = kg.nodes.find((n) => n.node_id === "SRC-PZ");
    expect(srcPz).toBeDefined();
    expect(srcPz!.coverage).toContain("TRANSCRIBED_PARTIAL");
    expect(srcPz!.coverage).toContain("val 77");
    expect(kg.findings.some((f) => f.finding_id === "KG-F09" && f.val === 77)).toBe(true);
  });

  test("zgodba vasi: prebivalstvo 1830 + PZ Weiden mit Holznutzen (558 K) vidna; 10 sekcij", () => {
    const story = generateVillageStory();
    expect(story.ok).toBe(true);
    expect(story.sections).toHaveLength(10);
    const texts = story.sections.flatMap((s) => s.items.map((i) => i.text)).join("\n");
    expect(texts).toContain("441 duš = 222 moških + 219 žensk");
    expect(texts).toContain("Weiden mit Holznutzen");
    expect(texts).toContain("F-PV-02");
    expect(texts).toContain("558 J 558 K"); // val 77 re-read
    expect(texts).not.toContain("558 J 846 K"); // stara vrednost odstranjena
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

describe("val 79 — Rektifikacija p35–42 OPISNO-KVALITATIVNA (F-PZ-16)", () => {
  test("sekcija obstaja, struktura: 5 razredov, 7 Muster-parcel, vse REVIEW", () => {
    const rk = pz.rektifikacija_beschreibung as {
      title: string;
      source_pages: number[];
      passes: number;
      structure: { klasse: string; page: number }[];
      muster_parcel_citations: {
        page: number; klasse: string; parcel_no: number; parcel_no_alt: number[];
        joch: number; klafter: number; owner: string; reading_status: string;
        pua_1825_match: boolean; ps_1825_match: boolean; note: string;
      }[];
      protocol_p40: { dates: Record<string, string | number> };
      conclusion: { f_pz_04_path: string; remaining_paths: string[]; f_pz_04_status: string };
      reading_honesty: string;
    };
    expect(rk).toBeDefined();
    expect(rk.passes).toBe(3);
    expect(rk.source_pages).toEqual([35, 36, 37, 38, 39, 40, 41, 42]);
    expect(rk.structure).toHaveLength(5);
    // val 80: 6/7 TRANSCRIBED (+1 TRANSCRIBED-STRUCTURE), samo 1288 REVIEW; joch 0/1 po pomlaju
    expect(rk.muster_parcel_citations).toHaveLength(7);
    const seenPages = new Set(rk.muster_parcel_citations.map((m) => m.page));
    expect(seenPages).toEqual(new Set([35, 36, 37, 38, 39]));
    for (const m of rk.muster_parcel_citations) {
      expect(["REVIEW", "TRANSCRIBED", "TRANSCRIBED-STRUCTURE"]).toContain(m.reading_status);
      expect([0, 1]).toContain(m.joch);
      expect(m.owner.length).toBeGreaterThan(2);
      expect(m.note.length).toBeGreaterThan(20);
    }
    // val 80 odločilna branja: 1004 popravi 1099; 738 popravi 438
    const nos = rk.muster_parcel_citations.map((m) => m.parcel_no);
    expect(nos).toEqual([30, 594, 1004, 738, 2451, 2491, 1288]);
    // alternativa ostaja dokumentirana pri 738/2491/1288
    const withAlt = rk.muster_parcel_citations.filter((m) => m.parcel_no_alt.length > 0);
    expect(withAlt.map((m) => m.parcel_no)).toEqual([738, 2491, 1288]);
    // val 80: vrednosti iz odločilne mize (nativna re-digitation)
    const byNo = new Map(rk.muster_parcel_citations.map((m) => [m.parcel_no, m]));
    expect(byNo.get(30)!.klafter).toBe(1082);   // val 79: 1382 (ovrženo)
    expect(byNo.get(594)!.klafter).toBe(591);   // val 79: 531
    expect(byNo.get(1004)!.klafter).toBe(1010); // val 79: №1099 = 700
    expect(byNo.get(738)!.joch).toBe(0);        // pomlaj
    expect(byNo.get(738)!.klafter).toBe(895);   // val 79: 896
    expect(byNo.get(2451)!.joch).toBe(0);
    expect(byNo.get(2451)!.klafter).toBe(1515); // PR#69: 1575 ovrženo
    expect(byNo.get(2491)!.joch).toBe(0);
    expect(byNo.get(2491)!.klafter).toBe(260);
    expect(byNo.get(1288)!.reading_status).toBe("REVIEW"); // poškodovana celica
  });

  test("križna kontrola: 4/7 Muster-parcel ne obstaja v 1825 PUA/PS registru (renumbering)", () => {
    const rk = pz.rektifikacija_beschreibung as {
      muster_parcel_citations: { parcel_no: number; pua_1825_match: boolean | string; ps_1825_match: boolean }[];
      renumbering: { finding: string; status: string };
    };
    // neodvisna kontrola v TS (val 80): 30 PUA+PS; 594 PUA; 1004 token-only (string); 738 PUA+PS; 2451/2491/1288 noben
    const byNo2 = new Map(rk.muster_parcel_citations.map((m) => [m.parcel_no, m]));
    expect(byNo2.get(30)!.pua_1825_match).toBe(true);
    expect(byNo2.get(30)!.ps_1825_match).toBe(true);
    expect(byNo2.get(594)!.pua_1825_match).toBe(true);
    expect(byNo2.get(1004)!.pua_1825_match).toBe("token-hits-only");
    expect(byNo2.get(738)!.pua_1825_match).toBe(true);
    expect(byNo2.get(738)!.ps_1825_match).toBe(true);
    expect(byNo2.get(2451)!.pua_1825_match).toBe(false);
    expect(byNo2.get(2451)!.ps_1825_match).toBe(false);
    expect(byNo2.get(2491)!.pua_1825_match).toBe(false);
    expect(byNo2.get(1288)!.pua_1825_match).toBe(false);
    const noMatch = rk.muster_parcel_citations.filter(
      (m) => m.pua_1825_match === false && m.ps_1825_match === false
    );
    expect(noMatch).toHaveLength(3);
    expect(rk.renumbering.status).toBe("REVIEW");
    expect(rk.renumbering.finding).toContain("4/7");
  });

  test("sklep: rešitvena pot F-PZ-04 per-parcelna ZAPRETA; F-PZ-16 RESOLVED", () => {
    const rk = pz.rektifikacija_beschreibung as {
      conclusion: { f_pz_04_path: string; remaining_paths: string[]; f_pz_04_status: string };
      reading_honesty: string;
      post_1830_protocols: Record<string, string>;
    };
    expect(rk.conclusion.f_pz_04_path).toContain("ZAPRETA");
    expect(rk.conclusion.f_pz_04_status).toContain("OPEN");
    expect(rk.conclusion.remaining_paths).toHaveLength(2);
    expect(rk.conclusion.remaining_paths[0]).toContain("izven peskovnika");
    // val 80 F-PZ-17: VAČ II @300 dpi OVRŽEN (ne obstaja)
    expect(rk.conclusion.remaining_paths[1]).toContain("300 dpi");
    expect(rk.conclusion.remaining_paths[1]).toContain("OVRŽEN");
    // iskrenost branja (val 80): pomlaj + halucinacije dokumentirane (nič tihega §4)
    expect(rk.reading_honesty).toContain("pomlaja");
    expect(rk.reading_honesty).toContain("halucinacije");
    expect(rk.reading_honesty).toContain("REVIEW");
    // 1832 protokoli dokumentirani
    expect(rk.post_1830_protocols["p42"]).toContain("Einvernehmungs-Protocoll");
    expect(rk.post_1830_protocols["p42"]).toContain("1832");
    // F-PZ-16 povezan s sklepo sekcije
    const f16 = pz.findings.find((f) => f.id === "F-PZ-16")!;
    expect(f16.status).toBe("RESOLVED");
    expect(f16.detail).toContain("Muster");
    expect(f16.detail).toContain("ZAPRETA");
  });

  test("protokol p40: datumi 9./29. april 1830 — val-75 ugib 5./28. OVRŽEN", () => {
    const rk = pz.rektifikacija_beschreibung as {
      protocol_p40: { dates: Record<string, string | number>; addendum: string };
    };
    const d = rk.protocol_p40.dates;
    expect(d.year).toBe(1830);
    expect(String(d.day1)).toContain("9");
    expect(String(d.day2)).toContain("29");
    expect(String(d.month)).toContain("REVIEW");
    expect(String(d.previous_guess_val75)).toContain("OVRŽENO");
    expect(rk.protocol_p40.addendum).toContain("vierte Nachtag");
  });

  test("structure_map: p35–42 + p48 nosijo val 79 popravke", () => {
    const joined = pz.structure_map.map((s) => s.content).join(" ");
    expect(joined).toContain("NE per-parcelne korekcije (val 79/80)");
    expect(joined).toContain("Muster № 30 = 1 J 1082");
    expect(joined).toContain("Einvernehmungs-Protocoll 6. dec. 1832");
    expect(joined).not.toContain("EINWANDS-PROTOKOLL");
    const p40 = pz.structure_map.find((s) => s.page === 40)!.content;
    expect(p40).toContain("9. / 29. april 1830");
    expect(p40).toContain("ovrženo");
  });

  test("F-PZ-04 ostaja OPEN z ožjim obsegom: poti v PZ izčrpane (val 78+79)", () => {
    const f04 = pz.findings.find((f) => f.id === "F-PZ-04")!;
    expect(f04.status).toBe("OPEN");
    expect(f04.detail).toContain("ZAPRETA (val 79, F-PZ-16");
    expect(f04.detail).toContain("izven peskovnika");
    // Summa kontrola neodvisno v TS: Δ 3 J = 4.800 QKlft
    const e = pz.endresultat_p67;
    const rows = e.rows.reduce((acc, r) => acc + r.joch * KLFT + r.klafter, 0);
    const summa = e.summa.joch * KLFT + e.summa.klafter;
    expect(summa - rows).toBe(4800);
    expect(e.sum_check.status).toBe("OPEN");
    expect(e.sum_check.note).toContain("val 79 F-PZ-16");
  });

  test("prehod 5+6+7 v metodi; coverage val 81 (neodvisna datoteka)", () => {
    expect((pz.method.passes as string[]).some((p) => p.startsWith("PREHOD 5 (val 79)"))).toBe(true);
    expect((pz.method.passes as string[]).some((p) => p.startsWith("PREHOD 6 (val 80)"))).toBe(true);
    expect((pz.method.passes as string[]).some((p) => p.startsWith("PREHOD 7 (val 81)"))).toBe(true);
    const rep = JSON.parse(
      readFileSync(join(REPO, "src", "data", "atlas-coverage-report-1825.json"), "utf-8")
    ) as { val: number; quality_gate: { category_id: string; native: Record<string, unknown> }[] };
    expect(rep.val).toBe(98); // coverage report regeneriran ob KG v2.2 (val 98, 86b del 2)
  });

  test("val 80 — nativna re-digitation: odločilna miza 6/7 + val80_redigitation sekcija", () => {
    const rk = pz.rektifikacija_beschreibung as unknown as {
      val80_redigitation: {
        method: string; adjudication: string; vac_topology: string; f_pz_04_impact: string;
      };
    };
    expect(rk.val80_redigitation).toBeDefined();
    expect(rk.val80_redigitation.method).toContain("FFT");
    expect(rk.val80_redigitation.method).toContain("3 neodvisna branja");
    expect(rk.val80_redigitation.adjudication).toContain("6/7 REŠENIH");
    expect(rk.val80_redigitation.adjudication).toContain("1004 1010");
    expect(rk.val80_redigitation.adjudication).toContain("sistemsko bral '1 J'");
    expect(rk.val80_redigitation.f_pz_04_impact).toContain("NENIČ");
    expect(rk.val80_redigitation.vac_topology).toContain("NE OBSTAJA");
  });

  test("val 80 — F-PZ-17 RESOLVED: VAČ II @300 dpi ne obstaja; PDF-native maksimum", () => {
    const f17 = pz.findings.find((f) => f.id === "F-PZ-17")!;
    expect(f17).toBeDefined();
    expect(f17.status).toBe("RESOLVED");
    expect(f17.title).toContain("NE OBSTAJA");
    expect(f17.detail).toContain("pdfPageImage");
    expect(f17.detail).toContain("608px");
    expect(f17.detail).toContain("~150 dpi");
    expect(f17.detail).toContain("IZČRPANE");
    // findings 17 (F-PZ-01..17)
    expect(pz.findings).toHaveLength(17);
    // F-PZ-04: vse tri poti dokumentirane
    const f04 = pz.findings.find((f) => f.id === "F-PZ-04")!;
    expect(f04.detail).toContain("F-PZ-17");
  });

  test("val 80 — §8 rdeči stolpec: WmH 557 aritmetično, Wiesen 41/45 varianca dokumentirana", () => {
    const zus = pz.revision_1830_zusammen as {
      rows: { kultur: string; joch: number; note?: string }[];
      subtotal_cultivirte: { joch: number };
    };
    const wmh = zus.rows.find((r) => r.kultur === "Huthweiden mit Holznutzen")!;
    expect(wmh.note ?? "").toContain("POTRJEN");
    expect(wmh.note ?? "").toContain("1150");
    const wiesen = zus.rows.find((r) => r.kultur === "Wiesen")!;
    expect(wiesen.note ?? "").toContain("VARIANCA 41/45");
    // neodvisna aritmetika v TS: 419+45+2+0+6+121+557 = 1150 EXACT
    const sum = zus.rows.reduce((a, r) => a + r.joch, 0);
    expect(sum).toBe(zus.subtotal_cultivirte.joch); // 1150
  });

  test("val 81 — F-PZ-12 RESOLVED: band-transkripcija p43–47 @nativno", () => {
    const f12 = pz.findings.find((f) => f.id === "F-PZ-12")!;
    expect(f12).toBeDefined();
    expect(f12.status).toBe("RESOLVED");
    expect(f12.detail).toContain("band-metoda");
    expect(f12.detail).toContain("54 VLM klicev");
    expect(f12.detail).toContain("IIIte Classe");
    expect(f12.detail).toContain("NE 'IIa 2 parcele'");
    expect(f12.detail).toContain("Vpliv na I1–I6/KG/deleže: NIČ (§22)");
  });

  test("val 81 — reinertrag_p43_47: struktura korigirana + Ertrag koeficienti (soglasje ≥ 2)", () => {
    const re = pz.reinertrag_p43_47 as unknown as {
      method: { readers: string; calls: string; admission_rule: string };
      structure_correction_vs_val75: string[];
      acker_wirthschafts_kurse: {
        classen: Record<
          string,
          { page: number; natural_ertrag_pro_joch: { item: number | null; produkt: string; wert: number | string }[] }
        >;
      };
      wiesen_kg_wg_hw: { wiesen: { classe_I: string; classe_II: string }; weingaerten: { cross_check: string }; hutweiden: { yield: string } };
      huthweiden_holznutzung: { heading: string; cross_impact: string };
    };
    // metoda: 3 glasovi + pravilo soglasja
    expect(re.method.readers).toContain("direkten odtis avtorja (40 pasov, PRED VLM)");
    expect(re.method.calls).toContain("54 VLM klicev");
    expect(re.method.admission_rule).toContain("soglasje ≥ 2 neodvisna branja");
    // struktura 43–47 korigirana vs val 75 (5 popravkov)
    expect(re.structure_correction_vs_val75).toHaveLength(5);
    expect(re.structure_correction_vs_val75.join(" ")).toContain("NE 'IIa. Classe (2 parcele N°96/311)'");
    expect(re.structure_correction_vs_val75.join(" ")).toContain("Wiesen mit 2 Classen");
    // p43 Ertrag: item1=26, item2=12 (kolizija 12-vs-72), item3=50, item7=80
    const cI = re.acker_wirthschafts_kurse.classen["I"].natural_ertrag_pro_joch;
    expect(cI.find((x) => x.item === 1)!.wert).toBe(26);
    expect(cI.find((x) => x.item === 2)!.wert).toBe(12);
    expect(cI.find((x) => x.item === 3)!.wert).toBe(50);
    expect(cI.find((x) => x.item === 7)!.wert).toBe(80);
    expect(cI).toHaveLength(11); // 9 kursov + 2 nenumberirana Kartoffel-Gärten
    // p44 razponi: 18–20 / 65–70
    const cII = re.acker_wirthschafts_kurse.classen["II"].natural_ertrag_pro_joch;
    expect(cII.find((x) => x.item === 1)!.wert).toBe("18–20");
    expect(cII.find((x) => x.item === 7)!.wert).toBe("65–70");
    // p45: item1=15, item7=60, cel list prečrtan
    const cIII = re.acker_wirthschafts_kurse.classen["III"].natural_ertrag_pro_joch;
    expect(cIII.find((x) => x.item === 1)!.wert).toBe(15);
    expect(cIII.find((x) => x.item === 7)!.wert).toBe(60);
    expect(re.acker_wirthschafts_kurse.classen["III"].page).toBe(45);
    // p46: Wiesen I = 14, II = 8 3/8; WG križna kontrola s p30; HW 2 3/8
    expect(re.wiesen_kg_wg_hw.wiesen.classe_I).toContain("zusammen 14");
    expect(re.wiesen_kg_wg_hw.wiesen.classe_II).toContain("8 3/8");
    expect(re.wiesen_kg_wg_hw.weingaerten.cross_check).toContain("Weingärten 12 Eimer");
    expect(re.wiesen_kg_wg_hw.hutweiden.yield).toContain("2 3/8");
    // p47: naslov prečrtan; nič vpliva na §8
    expect(re.huthweiden_holznutzung.heading).toContain("Nutznießung und Niederwald");
    expect(re.huthweiden_holznutzung.cross_impact).toContain("NE vpliva");
  });

  test("val 81 — structure_map p43–47 korigirana (val 75 hipoteze ovržene)", () => {
    const p45 = pz.structure_map.find((s) => s.page === 45)!.content;
    expect(p45).toContain("IIIte Classe");
    expect(p45).toContain("CEL LIST X PREČRTAN");
    expect(p45).toContain("NE 'IIa + parcele 96/311'");
    const p46 = pz.structure_map.find((s) => s.page === 46)!.content;
    expect(p46).toContain("Wiesen mit 2 Classen");
    expect(p46).toContain("8 3/8");
    const p47 = pz.structure_map.find((s) => s.page === 47)!.content;
    expect(p47).toContain("Nutznießung und Niederwald");
    expect(p47).toContain("X PREČRTAN");
    // p43 glava: 'Ackerland mit 2 Classen' z gestrichen/supra oznako
    const p43 = pz.structure_map.find((s) => s.page === 43)!.content;
    expect(p43).toContain("Wirthschafts Kurse");
    expect(p43).toContain("Düngung auf 1 Joch");
  });
});
