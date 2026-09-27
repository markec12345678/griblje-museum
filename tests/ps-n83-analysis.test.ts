/**
 * Val 61 — PS N83 analiza v2 (re-read 2026-10: verifikirana Fürtrag veriga, imenske variante, no_blatt)
 * Varovalke: 13-točkovna strogo monotona veriga; popravki p12 (Strauß/Schimerz); variant branja ohranjene;
 *            F9-F16 sodbe. Vir: research-griblje/ps-n83/analysis-v2.json (+ reread-2026-10/*)
 * Val 82 — DOKONČANJE transkripcije p56–143: analysis-v3 varovalke (F-PV-02/03, F15, reading honesty)
 */
import { describe, it, expect } from "bun:test";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const RG = join(import.meta.dir, "..", "research-griblje");
const analysis = JSON.parse(
  readFileSync(join(RG, "ps-n83", "analysis-v2.json"), "utf8"),
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
  C_furtrag_chain: {
    chain: { page: number; counter: number; value: string; crossed: boolean; red_line: string | null; source: string }[];
    vlm_v57_chain_for_audit: { page: number; label: string; counter: number }[];
    counters: number[];
    strictly_monotone: boolean;
    format_decoded: { line: string };
  };
  D_structure: {
    compound_haus_no: { first_page: number; count_rows: number };
    pfand_notes: { page: number; haus_no: string }[];
    jaethe_format_classes: Record<string, number>;
  };
  findings: Record<string, string>;
};

const totalsReread = JSON.parse(
  readFileSync(join(RG, "ps-n83", "reread-2026-10", "totals-reread.json"), "utf8"),
) as {
  verified_chain: { page: number; counter: number; value: string }[];
  format_decoded: Record<string, string>;
};

const nameVariants = JSON.parse(
  readFileSync(join(RG, "ps-n83", "reread-2026-10", "name-variants-p11-p12.json"), "utf8"),
) as {
  high_confidence_corrections: { page: number; haus_no: string; register_v57: string; agent_reread: string; decision: string }[];
  family_cluster_status: { v61_status: string; ui_impact: string };
  structural_findings: string[];
};

const psRegister = JSON.parse(readFileSync(join(RG, "ps-n83", "register.json"), "utf8")) as {
  page: number;
  haus_no: string;
  owner_original: string;
  owner_original_v57?: string;
  name_review?: string;
  reading_pass?: string;
}[];

const psPages = JSON.parse(readFileSync(join(RG, "ps-n83", "page-records.json"), "utf8")) as {
  page: number;
  status: string;
  reading_pass?: string;
}[];

const analysisV3 = JSON.parse(readFileSync(join(RG, "ps-n83", "analysis-v3.json"), "utf8")) as {
  val: string;
  inputs: { ps_rows_total: number; ps_rows_p1_55: number; ps_rows_p56_143: number; pages_read: number; pages_read_before: number; errors: number; qa_flags: number };
  findings: {
    "F-PV-02": { status: string; wald_rows_p1_55: number; wald_rows_p56_143: number; wald_rows_total: number };
    "F-PV-03": { status: string; reb_rows_old: number; reb_rows_new: number; reb_rows: { page: number; kultur: string }[] };
    "F15": { status: string; f15_pages_new: number[]; no_blatt_gt1000_rows: number };
    "F11": { status: string; totals_p56_143_count: number };
  };
  method: { reading_honesty: string };
};

describe("val 61 — PS N83 analysis v2 (re-read 2026-10)", () => {
  it("obstaja in je val 61", () => {
    expect(analysis.val).toBe("61");
  });

  it("vhod: PS register 1.073 vrstic / 55 strani (nespremenjeno obseg)", () => {
    expect(analysis.inputs.ps_rows).toBe(1073);
    expect(analysis.inputs.ps_pages_read).toBe(55);
  });

  describe("F9 — PUA<->PS lastniška kontrola (nespremenjena od v1)", () => {
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
  });

  describe("F10/F10b — PS<->PT kontrola + imenske variante", () => {
    it("47 skupnih hiš; 4 močna (h38 nova po korekciji) + 7 delnih", () => {
      expect(analysis.B_ps_vs_pt.shared_houses).toBe(47);
      expect(analysis.B_ps_vs_pt.agree_strong).toBe(4);
      expect(analysis.B_ps_vs_pt.partial).toBe(7);
    });

    it("h.45 = Strauß↔Krauß Georg (>0.8) in h.38 = Schimerz↔Schim[?]er (nova potrditev)", () => {
      const h45 = analysis.B_ps_vs_pt.rows_over_05.find((r) => r.house === 45);
      expect(h45).toBeDefined();
      expect(h45!.pt_best).toContain("Krauß Georg");
      expect(h45!.sim).toBeGreaterThan(0.8);
      const h38 = analysis.B_ps_vs_pt.rows_over_05.find((r) => r.house === 38);
      expect(h38).toBeDefined();
      expect(h38!.pt_best).toContain("Schim");
      expect(h38!.sim).toBeGreaterThan(0.7);
    });

    it("3 visoko-zanesljive korekcije dokumentirane (h45 Strauß, h38/h39 Schimerz)", () => {
      expect(nameVariants.high_confidence_corrections.length).toBe(3);
      const h45c = nameVariants.high_confidence_corrections.find((c) => c.haus_no === "45");
      expect(h45c!.agent_reread).toBe("Strauß Georg");
    });

    it("korekcije dejansko v registru, originali ohranjeni (owner_original_v57)", () => {
      const patched = psRegister.filter((r) => r.name_review === "reread-2026-10-corrected");
      expect(patched.length).toBe(3);
      for (const r of patched) {
        expect(r.owner_original_v57).toBeDefined();
        expect(r.owner_original_v57).not.toBe(r.owner_original);
      }
      const h45 = patched.find((r) => r.haus_no === "45");
      expect(h45!.owner_original).toBe("Strauß Georg");
      expect(h45!.owner_original_v57).toBe("Hansp[?] Gnoy");
    });

    it("družinski sklad h.36-50 = NAME_UNCERTAIN (ni gotovosti v UI)", () => {
      expect(nameVariants.family_cluster_status.v61_status).toContain("DOWNGRADED");
      expect(nameVariants.family_cluster_status.v61_status).toContain("PRIIMEK NI DOLOCEN");
      expect(nameVariants.family_cluster_status.ui_impact).toContain("NAME_UNCERTAIN");
    });
  });

  describe("F11 — Fürtrag veriga VERIFIKIRANA (13 točk, 0 kršitev)", () => {
    it("strogo monotona veriga 13 števcev: 2,9,10,12,14,18,22,30,33,38,39,42,52", () => {
      expect(analysis.C_furtrag_chain.counters).toEqual([2, 9, 10, 12, 14, 18, 22, 30, 33, 38, 39, 42, 52]);
      expect(analysis.C_furtrag_chain.strictly_monotone).toBe(true);
      const c = analysis.C_furtrag_chain.chain;
      expect(c.length).toBe(13);
      expect(c[0].page).toBe(5);
      expect(c[c.length - 1].page).toBe(54);
      for (let i = 1; i < c.length; i++) {
        expect(c[i].counter).toBeGreaterThan(c[i - 1].counter);
        expect(c[i].page).toBeGreaterThan(c[i - 1].page);
      }
      for (const p of c) expect(p.source).toContain("reread-2026-10");
    });

    it("v1 'kršitvi' p36/p42 razrešeni kot VLM napaki (38. in 39. Fürtrag)", () => {
      const c = analysis.C_furtrag_chain.chain;
      expect(c.find((p) => p.page === 36)!.counter).toBe(38);
      expect(c.find((p) => p.page === 42)!.counter).toBe(39);
      // VLM audit veriga ohranjena za revizijo: '36 Grundst.'/'20 Stück' se nista ujemala z
      // F-regexom (zato je v1 veriga imela 9 točk); popravljene v1 vrednosti vidne v audit verigi
      const vlm = analysis.C_furtrag_chain.vlm_v57_chain_for_audit;
      expect(vlm.find((p) => p.page === 36)).toBeUndefined();
      expect(vlm.find((p) => p.page === 42)).toBeUndefined();
      expect(vlm.length).toBe(9);
      expect(vlm.find((p) => p.page === 35)!.counter).toBe(39); // v1 napaka (v resnici 33)
      expect(vlm.find((p) => p.page === 32)!.counter).toBe(26); // v1 napaka (v resnici 30)
      expect(vlm.find((p) => p.page === 20)!.counter).toBe(19); // v1 napaka (v resnici 18)
    });

    it("nova točka p11=9 (VLM je števca sploh ni prebral) in p14=12", () => {
      const c = analysis.C_furtrag_chain.chain;
      expect(c.find((p) => p.page === 11)!.counter).toBe(9);
      expect(c.find((p) => p.page === 14)!.counter).toBe(12);
    });

    it("format dekodiran: 'N. Fürtrag. | Joch | Quad-Klafter' (vsota tekoče strani)", () => {
      expect(analysis.C_furtrag_chain.format_decoded.line).toContain("Fürtrag");
      expect(analysis.C_furtrag_chain.format_decoded.line).toContain("Klafter");
      const rereadChain = totalsReread.verified_chain;
      const p5 = rereadChain.find((p) => p.page === 5)!;
      expect(p5.value).toBe("6|1459"); // ne VLM '14357'
      const p14 = rereadChain.find((p) => p.page === 14)!;
      expect(p14.value).toBe("6|1088"); // ne VLM '10808'
    });
  });

  describe("F12 — struktura (nespremenjeno)", () => {
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

  it("najdbe F9-F16 prisotne", () => {
    for (const k of ["F9", "F10", "F10b", "F11", "F12", "F13", "F14", "F15", "F16"]) {
      expect(analysis.findings[k]).toBeDefined();
      expect(analysis.findings[k].length).toBeGreaterThan(20);
    }
  });

  it("strukturalne najdbe S1-S4 (no_blatt, vrstice p11)", () => {
    expect(nameVariants.structural_findings.length).toBe(4);
  });

  it("deterministična skripta in dokument obstajajo (v1 arhiv + v2 živ)", () => {
    expect(existsSync(join(RG, "ps-n83", "build-analysis-v1.py"))).toBe(true);
    expect(existsSync(join(RG, "ps-n83", "build-analysis-v2.py"))).toBe(true);
    expect(existsSync(join(RG, "ps-n83", "patch-register-reread.py"))).toBe(true);
    expect(existsSync(join(RG, "ps-n83", "reread-2026-10", "totals-reread.json"))).toBe(true);
    expect(existsSync(join(RG, "ps-n83", "reread-2026-10", "name-variants-p11-p12.json"))).toBe(true);
    expect(existsSync(join(RG, "71-val58-ps-n83-analysis-v1.md"))).toBe(true);
  });
});

describe("val 82 — PS N83 transkripcija DOKONČANA (p56–143, analysis-v3)", () => {
  it("obstaja in je val 82", () => {
    expect(analysisV3.val).toBe("82");
  });

  it("vhod: register 2.871 vrstic (1.073 p1–55 nespremenjeno + 1.798 p56–143), 143/143 strani, 0 napak", () => {
    expect(analysisV3.inputs.ps_rows_total).toBe(2871);
    expect(analysisV3.inputs.ps_rows_p1_55).toBe(1073);
    expect(analysisV3.inputs.ps_rows_p56_143).toBe(1798);
    expect(analysisV3.inputs.pages_read).toBe(143);
    expect(analysisV3.inputs.pages_read_before).toBe(55);
    expect(analysisV3.inputs.errors).toBe(0);
  });

  it("varovalka: p1–55 vrstice v registru NESPREMENJENE (števec + re-read korekcije 38/39/45)", () => {
    const old = psRegister.filter((r) => r.page <= 55);
    expect(old.length).toBe(1073);
    const patched = psRegister.filter((r) => r.name_review === "reread-2026-10-corrected");
    expect(patched.map((r) => r.haus_no).sort()).toEqual(["38", "39", "45"]);
  });

  it("varovalka: nove vrstice p56–143 nosijo reading_pass v82-native-pass1 (PROVISIONAL po §4)", () => {
    const fresh = psRegister.filter((r) => r.page > 55);
    expect(fresh.length).toBe(1798);
    expect(fresh.every((r) => r.reading_pass === "v82-native-pass1")).toBe(true);
    expect(analysisV3.method.reading_honesty).toContain("PROVISIONAL");
    expect(analysisV3.method.reading_honesty).toContain("KG v1.8");
  });

  it("varovalka: page-records 143/143 READ, p56–143 z reading_pass", () => {
    expect(psPages.length).toBe(143);
    expect(psPages.filter((p) => p.status === "READ").length).toBe(143);
    expect(psPages.filter((p) => p.page > 55).every((p) => p.reading_pass === "v82-native-pass1")).toBe(true);
  });

  it("F-PV-03: falsifikabilna napoved val 74 POTRJENA kvalitativno — Reb na p98/101/111/121/124", () => {
    const f = analysisV3.findings["F-PV-03"];
    expect(f.status).toContain("KVALITATIVNO-POTRJENO");
    expect(f.reb_rows_new).toBe(14);
    expect(f.reb_rows_old).toBe(5);
    const pages = [...new Set(f.reb_rows.map((r) => r.page))].sort((a, b) => a - b);
    expect(pages).toEqual([98, 101, 111, 121, 124]);
  });

  it("F-PV-02: Wald napetost razširjena (142 vrstic), status ostaja OPEN", () => {
    const f = analysisV3.findings["F-PV-02"];
    expect(f.status).toContain("OPEN");
    expect(f.wald_rows_p1_55).toBe(88);
    expect(f.wald_rows_p56_143).toBe(54);
    expect(f.wald_rows_total).toBe(142);
  });

  it("F15 generalizirana: rimske številke + Uebersetzung zaporedja ostajajo REVIEW (brez tihh popravkov)", () => {
    const f = analysisV3.findings["F15"];
    expect(f.f15_pages_new).toEqual([96, 100]);
    expect(f.no_blatt_gt1000_rows).toBe(379);
  });

  it("F11: Fürtrag/totals material izluščen (123 vnosov), NISO preverjeni", () => {
    const f = analysisV3.findings["F11"];
    expect(f.totals_p56_143_count).toBe(123);
    expect(f.status).toContain("neverificirana");
  });

  it("deterministična skripta val 82 obstajajo", () => {
    expect(existsSync(join(RG, "ps-n83", "build-register-v82.py"))).toBe(true);
    expect(existsSync(join(RG, "ps-n83", "build-analysis-v3.py"))).toBe(true);
    expect(existsSync(join(RG, "raw-web-val82-2026-10", "ps-transcribe-v82.mts"))).toBe(true);
  });
});
