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

  it("varovalka: p1–55 vrstice v registru NESPREMENJENE od val 82 (števec + re-read korekcije 38/39/45; val 111–114 popravki + val 115: +4 vstavljene vrstice)", () => {
    const old = psRegister.filter((r) => r.page <= 55);
    expect(old.length).toBe(1077); // val 115: 1073 + 4 vstavljene (p34/p40/p48/p49)
    const patched = psRegister.filter((r) => r.name_review === "reread-2026-10-corrected");
    expect(patched.map((r) => r.haus_no).sort()).toEqual(["38", "39", "45"]);
  });

  it("varovalka: p56–143 = 1.755 vrstic v86-colonial-tiles (val 86 + 98 + 107 2. prehod) + 43 v82-native-pass1 (PROVISIONAL)", () => {
    const fresh = psRegister.filter((r) => r.page > 55);
    expect(fresh.length).toBe(1798);
    const v86 = fresh.filter((r) => r.reading_pass === "v86-colonial-tiles");
    const v82 = fresh.filter((r) => r.reading_pass === "v82-native-pass1");
    expect(v86.length).toBe(1795); // p56–142 (kolonski tile-i, 4/4 pasovi; val 86: 808 + val 98: 301 + val 107: 646 + val 116: 40 p142)
    expect(v82.length).toBe(3); // p143 (rdeči povzetek) — val 116: p142 prešlo v v86
    expect(v86.every((r) => r.page >= 56 && r.page <= 142)).toBe(true);
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

const analysisV4 = JSON.parse(
  readFileSync(join(RG, "ps-n83", "analysis-v4.json"), "utf8"),
) as {
  val: string;
  inputs: {
    pages_reread: number;
    rows_pass1: number;
    rows_pass2: number;
    rowcount_mismatch_pages: number;
    full_agree_rows: number;
    partial_rows: number;
    conflicts_high: number;
    conflicts_medium: number;
    conflicts_format: number;
    totals_pairs: number;
    totals_agree: number;
    field_agreement: Record<string, { exact_pct: number | null; numeq_pct: number | null; total: number }>;
    kultur_first_token_agree_pct: number;
    kultur_swap_top: { pair: string; count: number }[];
  };
  findings: {
    "F-PV-03": { status: string; reb_rows_pass1: number; reb_pass2_reproduced: number; reb_pass2_rows: number; reb_qklft_pass1_pure: number; reb_qklft_pass2_pure: number; reb_qklft_pv_target: number };
    "F-PV-02": { status: string; wald_rows_pass1_p56_143: number; wald_rows_pass2: number };
    "F15": { status: string; no_blatt_exact_pct: number; no_blatt_gt1000_pass1: number; no_blatt_gt1000_pass2: number };
    "F11": { status: string; totals_pairs: number; totals_agree: number };
    "F-PV-04": { status: string; strong_fields: Record<string, number>; weak_fields: Record<string, number> };
  };
  next_reads: string[];
};

const comparisonV83 = JSON.parse(
  readFileSync(join(RG, "ps-n83", "reread-v83", "comparison.json"), "utf8"),
) as {
  meta: { val: string; honesty: string };
  global: {
    rows1_total: number;
    rows2_total: number;
    rowcount_mismatch_pages: number;
    extra_rows_pass1: number;
    extra_rows_pass2: number;
    full_agree_rows: number;
    partial_rows: number;
    quant_confirmed_rows: number;
    conflicts_high: number;
    conflicts_medium: number;
    conflicts_format: number;
    field_agreement: Record<string, { exact_pct: number | null; numeq_pct: number | null; total: number }>;
    totals_pairs: number;
    totals_agree: number;
  };
  reb: { pass1_rows: number; pass1_reproduced_by_pass2: number; qklft_pass1_pure: number; qklft_pass2_pure: number; qklft_pv_target: number };
  pages: { page: number; rows1: number; rows2: number; full_agree: number; quant_confirmed: number }[];
  conflicts: { page: number; row_idx: number; field: string; severity: string; pass1: string; pass2: string }[];
};

describe("val 83 — PS N83 neodvisen re-read p56–143 (2. prehod, analysis-v4)", () => {
  it("obstaja in je val 83", () => {
    expect(analysisV4.val).toBe("83");
    expect(comparisonV83.meta.val).toBe("83");
  });

  it("88/88 strani prebranih 2×, surovine brez ERROR (guard konsistenca)", () => {
    expect(analysisV4.inputs.pages_reread).toBe(88);
    expect(comparisonV83.pages.length).toBe(88);
    for (let pg = 56; pg <= 143; pg++) {
      const d = JSON.parse(
        readFileSync(join(RG, "raw-web-val83-2026-10", "ps-vlm", `p${String(pg).padStart(3, "0")}.json`), "utf8"),
      ) as { ERROR?: string; rows: unknown[] };
      expect(d.ERROR).toBeUndefined();
      expect(Array.isArray(d.rows)).toBe(true);
    }
  });

  it("struktura neodvisno reproducirana: 1798 vs 1797 vrstic, 23 strani ±1", () => {
    expect(comparisonV83.global.rows1_total).toBe(1798);
    expect(comparisonV83.global.rows2_total).toBe(1797);
    expect(comparisonV83.global.rowcount_mismatch_pages).toBe(23);
    // full_agree + partial pokrije vsak matched par (Σ min(n1,n2) = 1779; extras dokumentirani)
    const matched = comparisonV83.pages.reduce((s, p) => s + Math.min(p.rows1, p.rows2), 0);
    expect(comparisonV83.global.full_agree_rows + comparisonV83.global.partial_rows).toBe(matched);
    expect(comparisonV83.global.extra_rows_pass1).toBe(19);
    expect(comparisonV83.global.extra_rows_pass2).toBe(18);
  });

  it("soglasje matrika: numerična hrbtenica ≥ 92 % (classe/ertrag/capital), imena 19,6 %, kultur 47,3 %", () => {
    const fa = comparisonV83.global.field_agreement;
    expect(fa["classe"].exact_pct).toBeGreaterThanOrEqual(95);
    expect(fa["ertrag_fl"].exact_pct).toBeGreaterThanOrEqual(95);
    expect(fa["ertrag_kr"].exact_pct).toBeGreaterThanOrEqual(92);
    expect(fa["capital_fl"].exact_pct).toBeGreaterThanOrEqual(95);
    expect(fa["capital_kr"].exact_pct).toBeGreaterThanOrEqual(96);
    expect(fa["name_raw"].exact_pct).toBeLessThan(25);
    expect(fa["kultur"].exact_pct).toBeLessThan(50);
    expect(fa["no_blatt"].exact_pct).toBeLessThan(55);
    expect(fa["jaethe"].numeq_pct).toBeGreaterThan(70);
    expect(fa["klafter"].numeq_pct).toBeGreaterThan(68);
  });

  it("kategorije zamenjav kultur dokumentirane (Wiese↔Hutweide, Acker↔Wald) — nič tiho popravljeno", () => {
    const pairs = analysisV4.inputs.kultur_swap_top.map((s) => s.pair);
    expect(pairs.some((p) => p.includes("wiese") && p.includes("hutweide"))).toBe(true);
    expect(pairs.some((p) => p.includes("acker") && p.includes("wiese"))).toBe(true);
    expect(comparisonV83.meta.honesty).toContain("NIČ tiho popravljenih");
  });

  it("F-PV-03: re-read NI dvignil na 2× — pass2 skrajša omembe 14→6, kvantitativa neizvedljiva", () => {
    const f = analysisV4.findings["F-PV-03"];
    expect(f.status).toContain("KVALITATIVNO-POTRJENO-V82");
    expect(f.reb_rows_pass1).toBe(14);
    expect(f.reb_pass2_rows).toBe(6);
    expect(f.reb_qklft_pv_target).toBe(11865);
    expect(f.reb_qklft_pass1_pure).toBe(6304);
    expect(f.status).toContain("NI dvignil");
  });

  it("F-PV-02: Wald raba reproducirana 54=54 (obstoj 2× dokumentiran), status OPEN", () => {
    const f = analysisV4.findings["F-PV-02"];
    expect(f.wald_rows_pass1_p56_143).toBe(54);
    expect(f.wald_rows_pass2).toBe(54);
    expect(f.status).toContain("OPEN");
  });

  it("F15: no_blatt semantika nezanesljiva v OBEH prehodih (pass2: 445 vrstic > 1000)", () => {
    const f = analysisV4.findings["F15"];
    expect(f.no_blatt_gt1000_pass1).toBe(379);
    expect(f.no_blatt_gt1000_pass2).toBe(445);
    expect(f.no_blatt_exact_pct).toBeLessThan(55);
    expect(f.status).toContain("REVIEW");
  });

  it("F11: Fürtrag veriga ŠIBKO reproducirana celostransko (18/100), ostaja surova", () => {
    const f = analysisV4.findings["F11"];
    expect(f.totals_pairs).toBe(100);
    expect(f.totals_agree).toBe(18);
    expect(f.status).toContain("ŠIBKO");
  });

  it("F-PV-04 (nova): metodični meji celostranskega re-reada dokumentirana", () => {
    const f = analysisV4.findings["F-PV-04"];
    expect(f.status).toContain("NR-14");
    expect(f.strong_fields["classe"]).toBeGreaterThanOrEqual(95);
    expect(f.weak_fields["name_raw"]).toBeLessThan(25);
  });

  it("NR-14 v negativnem registru (negatives_total 14)", () => {
    const nr = JSON.parse(
      readFileSync(join(RG, "atlas-1825", "negative-result-register-1825.json"), "utf8"),
    ) as { negatives_total: number; negatives: { neg_id: string; next_source: string }[] };
    expect(nr.negatives_total).toBe(14);
    const nr14 = nr.negatives.find((n) => n.neg_id === "NR-14");
    expect(nr14).toBeDefined();
    expect(nr14!.next_source).toContain("pasovni/zoom");
  });

  it("varovalka: p1–55 BIT-PO-BIT v82 (val 86 se neže dotika); page-records 143/143 READ", () => {
    const old = psRegister.filter((r) => r.page <= 55);
    expect(old.every((r) => r.reading_pass !== "v86-colonial-tiles")).toBe(true);
    expect(old.every((r) => !("jaethe_pass1_v82" in r) && !("jk_review" in r))).toBe(true);
    expect(psPages.filter((p) => p.status === "READ").length).toBe(143);
  });

  it("source-coverage: val 108 (regeneriran ob KG v2.4) + SRC-PS opomba z re-read + tile rezultatom (§22)", () => {
    const sc = JSON.parse(
      readFileSync(join(RG, "atlas-1825", "source-coverage-1825.json"), "utf8"),
    ) as { val: number; sources: { source_id: string; note: string }[]; transcription: { PS: { rows: number; passes: number } } };
    expect(sc.val).toBe(108); // val 108 regeneracija (re-read 14 strani)
    expect(sc.transcription.PS.rows).toBe(2875); // val 115: 2871 + 4 vstavljene
    expect(sc.transcription.PS.passes).toBe(3);
    const ps = sc.sources.find((s) => s.source_id === "SRC-PS")!;
    expect(ps.note).toContain("val 83");
    expect(ps.note).toContain("nič tiho popravljeno");
  });

  it("next_reads: pasovni/zoom re-read na 1. mestu (NR-14 rešitvena pot)", () => {
    expect(analysisV4.next_reads[0]).toContain("PASOVNI/ZOOM");
  });

  it("deterministična skripta val 83 obstajajo", () => {
    expect(existsSync(join(RG, "raw-web-val83-2026-10", "ps-transcribe-v83.mts"))).toBe(true);
    expect(existsSync(join(RG, "ps-n83", "build-compare-v83.py"))).toBe(true);
    expect(existsSync(join(RG, "ps-n83", "build-analysis-v4.py"))).toBe(true);
    expect(existsSync(join(RG, "ps-n83", "build-coverage-v83.py"))).toBe(true);
  });
});
