/**
 * Val 58 — PS N83 analiza v1 (tritralna kontrola PUA↔PS↔PT, Fürtrag veriga, struktura)
 * Varovalke: analiza mora ostati deterministično ponovljiva; ključne sodbe F9–F14.
 * Vir: research-griblje/ps-n83/analysis-v1.json (+ register.json)
 */
import { describe, it, expect } from "bun:test";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const RG = join(import.meta.dir, "..", "research-griblje");
const analysis = JSON.parse(
  readFileSync(join(RG, "ps-n83", "analysis-v1.json"), "utf8"),
) as {
  val: string;
  inputs: { ps_rows: number; ps_pages_read: number };
  A_pua_vs_ps: {
    shared_houses: number;
    agree: number;
    fuzzy: number;
    mismatch: number;
    shift_test_avg_sim: Record<string, number>;
    fuzzy_cases: { house: number; sim: number }[];
  };
  B_ps_vs_pt: {
    shared_houses: number;
    agree_strong: number;
    partial: number;
    rows_over_05: { house: number; pt_best: string; sim: number }[];
  };
  C_furtrag_chain: { chain: { page: number; counter: number }[] };
  D_structure: {
    compound_haus_no: { first_page: number; count_rows: number };
    pfand_notes: { page: number; haus_no: string }[];
    jaethe_format_classes: Record<string, number>;
  };
  findings: Record<string, string>;
};

describe("val 58 — PS N83 analysis v1", () => {
  it("obstaja in je val 58", () => {
    expect(analysis.val).toBe("58");
  });

  it("vhod: PS register 1.073 vrstic / 55 strani (partial pred kvoto)", () => {
    expect(analysis.inputs.ps_rows).toBe(1073);
    expect(analysis.inputs.ps_pages_read).toBe(55);
  });

  describe("F9 — PUA<->PS lastniška kontrola (različni stanji)", () => {
    it("51 skupnih hiš; 0 AGREE / 2 FUZZY / 49 MISMATCH", () => {
      expect(analysis.A_pua_vs_ps.shared_houses).toBe(51);
      expect(analysis.A_pua_vs_ps.agree).toBe(0);
      expect(analysis.A_pua_vs_ps.fuzzy).toBe(2);
      expect(analysis.A_pua_vs_ps.mismatch).toBe(49);
    });

    it("premik vrstic izključen: offset 0 je najboljša podobnost", () => {
      const s = analysis.A_pua_vs_ps.shift_test_avg_sim;
      expect(s["+0"]).toBeGreaterThan(s["-1"]);
      expect(s["+0"]).toBeGreaterThan(s["+1"]);
      expect(s["+0"]).toBeGreaterThan(s["-2"]);
      expect(s["+0"]).toBeGreaterThan(s["+2"]);
    });

    it("FUZZY primera sta h.36 in h.37 (Krischan/Krishnar)", () => {
      const houses = analysis.A_pua_vs_ps.fuzzy_cases.map((c) => c.house).sort();
      expect(houses).toEqual([36, 37]);
    });
  });

  describe("F10 — PS<->PT kontrola (končna protokola se potrjujeta)", () => {
    it("47 skupnih hiš; 3 močna + 7 delnih ujemanj", () => {
      expect(analysis.B_ps_vs_pt.shared_houses).toBe(47);
      expect(analysis.B_ps_vs_pt.agree_strong).toBe(3);
      expect(analysis.B_ps_vs_pt.partial).toBe(7);
    });

    it("h.45 = Strauß↔Krauß Georg (potrditev val 54 variante)", () => {
      const h45 = analysis.B_ps_vs_pt.rows_over_05.find((r) => r.house === 45);
      expect(h45).toBeDefined();
      expect(h45!.pt_best).toContain("Krauß Georg");
      expect(h45!.sim).toBeGreaterThan(0.8);
    });

    it("h.19 Thomas soglasje > 0.8", () => {
      const h19 = analysis.B_ps_vs_pt.rows_over_05.find((r) => r.house === 19);
      expect(h19).toBeDefined();
      expect(h19!.sim).toBeGreaterThan(0.8);
    });
  });

  describe("F11 — Fürtrag veriga (tekoči indeks Jaethe)", () => {
    it("monotona veriga 9 števcev: p5=2 ... p54=52", () => {
      const c = analysis.C_furtrag_chain.chain;
      expect(c.length).toBe(9);
      expect(c[0].page).toBe(5);
      expect(c[0].counter).toBe(2);
      expect(c[c.length - 1].page).toBe(54);
      expect(c[c.length - 1].counter).toBe(52);
      for (let i = 1; i < c.length; i++) {
        expect(c[i].counter).toBeGreaterThan(c[i - 1].counter);
        expect(c[i].page).toBeGreaterThan(c[i - 1].page);
      }
    });
  });

  describe("F12 — strukturna meja p40 (ne-lokalni lastniki)", () => {
    it("sestavljeni '1 / N' sklici se začnejo pri p40 (140 vrstic)", () => {
      expect(analysis.D_structure.compound_haus_no.first_page).toBe(40);
      expect(analysis.D_structure.compound_haus_no.count_rows).toBe(140);
    });

    it("pfand opombe na p12 (3×, h.43/45/46)", () => {
      expect(analysis.D_structure.pfand_notes.length).toBe(3);
      for (const n of analysis.D_structure.pfand_notes) expect(n.page).toBe(12);
      const hs = analysis.D_structure.pfand_notes.map((n) => n.haus_no).sort();
      expect(hs).toEqual(["43", "45", "46"]);
    });
  });

  it("najdbe F9–F14 prisotne", () => {
    for (const k of ["F9", "F10", "F11", "F12", "F13", "F14"]) {
      expect(analysis.findings[k]).toBeDefined();
      expect(analysis.findings[k].length).toBeGreaterThan(20);
    }
  });

  it("deterministična skripta in dokument obstajata", () => {
    expect(existsSync(join(RG, "ps-n83", "build-analysis-v1.py"))).toBe(true);
    expect(existsSync(join(RG, "71-val58-ps-n83-analysis-v1.md"))).toBe(true);
  });
});
