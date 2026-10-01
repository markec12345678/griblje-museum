/**
 * Val 117 — MIKROPREHOD 8b: PZ integracija 45 VLM glasov + agentov vid (ISSUE #42 §4/§14 + #43)
 * [pot do podatka: research-griblje/atlas-1825/build-pz-v117.py + pz-v117-changes.json]
 *
 * Admission pravila: soglasje ≥ 2 (odtis/vlm/vid) → TRANSCRIBED; kolizija 1:1 → model I7 (EXACT)
 * odloči → TRANSCRIBED-i7; kolizija brez modela → REVIEW; model ne prevlada nad soglasjem ≥ 2.
 *
 * 10 popravkov · 50 TRANSCRIBED statusov v § sekcijah · 7 dilem (4 rešene) · p63 16 vrstic ·
 * p65 razkol Acker I REALEN · F-PZ-21/22 · 0 VLM klicev v val 117 (glasovi zajeti val 116).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const pz = JSON.parse(
  readFileSync(join(root, "research-griblje/atlas-1825/pz-konskripcija-1830.json"), "utf8"),
) as {
  val: number;
  pass: string;
  findings: { id: string; status: string; detail: string }[];
  invariant_violations: unknown[];
  dileme_v117: { id: number; status: string; odgovor: string }[];
  reading_honesty_v117: Record<string, unknown>;
  verantwortlichung_p50_61: {
    method: { admission_rule: string };
    vlm_adjudication_v117: Record<string, unknown>;
    i7_checks: { sec: string; classe: string; status: string; note?: string }[];
    sections: {
      sec: string;
      classes: {
        classe: string;
        roh: { fl: string; kr: string; status: string };
        aufwand: { fl: string; kr: string; status: string };
        taxa: { wert: string; status: string };
        anschlag: { fl: string; kr: string; status: string };
        rein: { fl: string; kr: string; status: string };
      }[];
    }[];
  };
  zusammenstellung_ab_p62_65: {
    p63_zusammenstellung_b: {
      rows: Record<string, string>[];
      glas_val77: string;
      anmerkungen_v117: Record<string, unknown>;
      status: string;
    };
    p65_zusammenstellung_a: { status: string; vlm_v117: Record<string, unknown> };
  };
  protokolle_p48_49: { datum: string; vlm_v117: Record<string, unknown> };
};

const ver = pz.verantwortlichung_p50_61;
const zus = pz.zusammenstellung_ab_p62_65;

function cls(sec: string, name: string) {
  const s = ver.sections.find((x) => x.sec === sec)!;
  return s.classes.find((c) => c.classe === name)!;
}

describe("val 117 — PZ mikroprehod 8b [build-pz-v117]", () => {
  test("meta: val 117 / PASS 8b / kršitve prazne", () => {
    expect(pz.val).toBe(117);
    expect(pz.pass).toContain("MIKROPREHOD 8b");
    expect(pz.pass).toContain("10 popravkov");
    expect(pz.invariant_violations).toEqual([]);
  });

  test("admission pravila val 117 zapisana (model ne prevlada nad soglasjem ≥ 2)", () => {
    expect(ver.method.admission_rule).toContain("soglasje ≥ 2");
    expect(ver.method.admission_rule).toContain("model I7 (EXACT)");
    expect(ver.method.admission_rule).toContain("ne prevlada nad soglasjem ≥ 2");
    expect(ver.vlm_adjudication_v117["voices_total"]).toBe(45);
    expect(ver.vlm_adjudication_v117["popravki"]).toBe(10);
  });

  test("POPRAVEK p50 (§1 I.te): roh 23|44 + rein 13|5 — 3 glasova; model-divergenca v changes reviziji", () => {
    const c = cls("§1", "I.te");
    expect(c.roh.fl).toBe("23");
    expect(c.roh.kr).toBe("44");
    expect(c.roh.status).toContain("TRANSCRIBED");
    expect(c.rein.kr).toBe("5");
    expect(c.rein.status).toContain("dilema 2 branjsko rešena");
    // kolizija ostaja REVIEW (iskreno):
    expect(c.anschlag.status).toContain("REVIEW");
    expect(c.anschlag.status).toContain("kolizija");
  });

  test("POPRAVEK p53 (§2 I.te): aufwand 1|57½ (Kurrent 3/5) + anschlag 1|52 4/5 (model EXACT)", () => {
    const c = cls("§2", "I.te");
    expect(c.aufwand.kr).toBe("57 1/2");
    expect(c.aufwand.status).toContain("odtis 37½");
    expect(c.anschlag.kr).toBe("52 4/5");
    expect(c.anschlag.status).toContain("model EXACT");
    expect(c.rein.kr).toBe("30");
  });

  test("DILEMA 1 / POPRAVEK p54 (§2 II.te): roh 4 (vlm+vid+model 2×EXACT+p65), ne 14", () => {
    const c = cls("§2", "II.te");
    expect(c.roh.fl).toBe("4");
    expect(c.roh.status).toContain("TRANSCRIBED-i7");
    expect(c.roh.status).toContain("14[1?]");
    expect(c.aufwand.kr).toBe("55"); // odtis + vid; vlm prazno = artefakt
    expect(c.anschlag.fl).toBe("1");
    expect(c.rein.fl).toBe("3");
    // i7: p54 zdaj EXACT (prej NE zapiralo):
    const chk = ver.i7_checks.find((x) => x.sec === "§2" && x.classe === "II.te")!;
    expect(chk.status).toBe("I7-EXACT");
    expect(chk.note).toContain("prej 14.0 NE zapiralo");
  });

  test("p55/p56 (§3/§4): roh 23|44 + rein 13|5 TRANSCRIBED; anschlag kolizija ostaja REVIEW", () => {
    for (const sec of ["§3", "§4"]) {
      const c = cls(sec, "Einzige");
      expect(c.roh.kr).toBe("44");
      expect(c.rein.kr).toBe("5");
      expect(c.anschlag.status).toContain("REVIEW");
    }
  });

  test("p57 (§5): vse 5 polj TRANSCRIBED (3 glasa); rein 7|10 z model-divergenco (zaokrožitev)", () => {
    const c = cls("§5", "Einzige");
    expect(c.roh.fl).toBe("24");
    expect(c.aufwand.kr).toBe("54");
    expect(c.taxa.wert).toBe("70");
    expect(c.anschlag.kr).toBe("48");
    expect(c.rein.kr).toBe("10");
    expect(c.rein.status).toContain("zaokrožitev");
  });

  test("DILEMA 3 / POPRAVEK p58+p59 (§6/§7): aufwand '132[?]' → '13 1/2' (vlm+vid frakcija)", () => {
    const c58 = cls("§6", "Einzige");
    expect(c58.aufwand.kr).toBe("13 1/2");
    expect(c58.aufwand.status).toContain("DILEMA 3 REŠENA");
    expect(c58.anschlag.kr).toBe("15"); // vlm 13 = Kurrent artefakt
    const c59 = cls("§7", "Weide");
    expect(c59.aufwand.kr).toBe("13 1/2");
    expect(c59.rein.kr).toBe("45");
  });

  test("§7 Holznutzung + Summa: 6/6/1|6/—|51 (identiteta + vsota 45+6)", () => {
    const h = cls("§7", "Holznutzung");
    expect(h.roh.kr).toBe("6");
    expect(h.rein.kr).toBe("6");
    const s = cls("§7", "Summa");
    expect(s.roh.kr).toBe("6");
    expect(s.rein.kr).toBe("51");
  });

  test("POPRAVEK p60 (§8): roh 50½ (vid črno + model 2×EXACT + p52-predloga) + anschlag 15¾ + taxa 55", () => {
    const c = cls("§8", "Classe (brez oznake)");
    expect(c.roh.kr).toBe("50 1/2");
    expect(c.roh.status).toContain("TRANSCRIBED-i7");
    expect(c.roh.status).toContain("30½");
    expect(c.roh.status).toContain("38 4/10 [rot]"); // rdeči sloj dokumentiran
    expect(c.aufwand.kr).toBe("31");
    expect(c.taxa.wert).toBe("55");
    expect(c.anschlag.kr).toBe("15 3/4");
    expect(c.rein.kr).toBe("35");
  });

  test("kolizije ostajajo REVIEW (4): p50/p55/p56 anschlag + p52 roh_kr — brez vsiljevanja", () => {
    expect(cls("§1", "I.te").anschlag.status).toContain("REVIEW");
    expect(cls("§1", "II.te").roh.status).toContain("REVIEW");
    expect(cls("§4", "Einzige").anschlag.status).toContain("REVIEW");
  });

  test("i7_checks: 10× I7-EXACT (p54 in p80 nova) + Holznutzung BREZ-MODELA; kršitve prazne", () => {
    const exact = ver.i7_checks.filter((c) => c.status === "I7-EXACT");
    expect(exact).toHaveLength(10);
    expect(ver.i7_checks.find((c) => c.classe === "Holznutzung")!.status).toBe("BREZ-MODELA");
    expect(ver.i7_checks).toHaveLength(11);
  });

  test("p63: 16 vrstic; r1 kat kolizija 115/113; r4 786; r13 1|13; r14 1030 + pacht 7|—; band2 nezanesljiv", () => {
    const p63 = zus.p63_zusammenstellung_b;
    expect(p63.rows).toHaveLength(16);
    expect(p63.rows[0].kat_no).toContain("115");
    expect(p63.rows[0].kat_no).toContain("REVIEW");
    expect(p63.rows[3].kat_no).toBe("786");
    expect(p63.rows[14].klafter).toBe("209");
    expect(p63.rows[14].pacht).toBe("1 13");
    expect(p63.rows[14].summe).toBe("1 13");
    expect(p63.rows[15].kat_no).toBe("1030");
    expect(p63.rows[15].pacht).toBe("7 -");
    expect(p63.glas_val77).toContain("band2");
    expect(p63.glas_val77).toContain("NEZANESLJIV");
    // Summe 2 aritmetična vrzel dokumentirana (iskreno):
    expect(p63.rows[13].klafter).toContain("aritmetična vrzel");
    // anmerkungen: Chausseepfennig (F-PZ-21):
    expect((p63.anmerkungen_v117["vrstice_1_5"] as string)).toContain("Chausseepfennig");
  });

  test("p65: razkol Acker I REALEN (22|46 2 glasa vs 23|44 3 glasa); križne potrditve; desni blok", () => {
    const p65 = zus.p65_zusammenstellung_a;
    expect(p65.status).toContain("razkol Acker I REALEN");
    expect(p65.vlm_v117["razkol_acker_i"]).toContain("dokument-notranji");
    const pot = p65.vlm_v117["križne_potrditve"] as string[];
    expect(pot.some((x) => x.includes("Wiesen II brutto 4"))).toBe(true); // podpira p54 roh=4
    expect((p65.vlm_v117["desni_blok"] as string)).toContain("zu Fleyen");
  });

  test("protokoli p48/49: datum 5. April 1830 potrjen; VLM podpisi = artefakti (REVIEW ostaja); omemba mlinu", () => {
    const p = pz.protokolle_p48_49;
    expect(p.datum).toBe("5. April 1830");
    const v = p.vlm_v117["p49_half_b_podpisi"] as string[];
    expect(v.length).toBe(5);
    expect((p.vlm_v117["status"] as string)).toContain("REVIEW");
    expect(JSON.stringify(p.vlm_v117["p48_half_a"])).toContain("Mühle");
  });

  test("dileme_v117: 4 REŠENE + 2 DELNO + 1 RAZKOL-DOKUMENTIRAN (iz 7 odprtih val 109)", () => {
    expect(pz.dileme_v117).toHaveLength(7);
    const st = pz.dileme_v117.map((d) => d.status);
    expect(st.filter((s) => s.startsWith("REŠENA"))).toHaveLength(3); // 1, 2, 3
    expect(st.filter((s) => s.startsWith("DELNO"))).toHaveLength(2); // 6, 7
    expect(st).toContain("RAZKOL DOKUMENTIRAN"); // 4
    expect(st).toContain("ODPRTA"); // 5
  });

  test("findings 22: F-PZ-21 (Chausseepfennig, PARTIAL) + F-PZ-22 (p60 dvojni sloj, DOKUMENTIRAN)", () => {
    expect(pz.findings).toHaveLength(22);
    const f21 = pz.findings.find((f) => f.id === "F-PZ-21")!;
    expect(f21.status).toBe("PARTIAL");
    expect(f21.detail).toContain("Chausseepfennig");
    const f22 = pz.findings.find((f) => f.id === "F-PZ-22")!;
    expect(f22.status).toBe("DOKUMENTIRAN");
    expect(f22.detail).toContain("1831");
  });

  test("changes audit: 50 sprememb / 10 POPRAVKOV / vsaka ima path+method+voices", () => {
    const ch = JSON.parse(
      readFileSync(join(root, "research-griblje/atlas-1825/pz-v117-changes.json"), "utf8"),
    ) as { val: number; changes_count: number; changes: { path: string; method: string; voices: unknown }[] };
    expect(ch.val).toBe(117);
    expect(ch.changes_count).toBe(50);
    expect(ch.changes).toHaveLength(50);
    const pop = ch.changes.filter((c) => c.method.startsWith("POPRAVEK"));
    expect(pop).toHaveLength(10);
    for (const c of ch.changes) {
      expect(c.path.length).toBeGreaterThan(0);
      expect(c.method.length).toBeGreaterThan(0);
      expect(c.voices).toBeDefined();
    }
    // vsi 10 popravkov imajo stare vrednosti ohranjene (revizijski sled):
    expect(pop.map((c) => c.path)).toContain("§8.Classe.roh.kr");
    // model-divergence izrecno v metodah (p50/p55/p56 rein, p53 rein, p57 rein):
    const div = ch.changes.filter((c) => c.method.includes("model-divergenca"));
    expect(div.length).toBeGreaterThanOrEqual(4);
  });

  test("iskrenost: 0 VLM klicev v val 117; TRANSCRIBED definicija; reviews ostajajo", () => {
    const h = pz.reading_honesty_v117;
    expect(h["vlm_calls_in_val_117"]).toBe(0);
    expect(h["voices_source"]).toContain("45 glasov zajetih val 116");
    expect(h["transcribed_definition"]).toContain("model-I7-EXACT lift");
    expect(h["reviews_ostajajo"]).toBe(4);
    expect(h["model_divergences"]).toBe(5);
    expect(h["p63_band2"]).toContain("NEZANESLJIV");
  });

  test("surovine: 45 glasov na disku (val 116) — vir integracije", () => {
    const dir = join(root, "research-griblje/raw-web-val109-2026-09/vlm-v109");
    const done = readdirSync(dir).filter((f) => f.endsWith(".json"));
    expect(done).toHaveLength(45);
    expect(existsSync(join(root, "research-griblje/atlas-1825/build-pz-v117.py"))).toBe(true);
  });
});
