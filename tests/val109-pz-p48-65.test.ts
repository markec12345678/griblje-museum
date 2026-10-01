/**
 * Val 109 — PZ p48–65 2. prehod (ISSUE #42 §4/§14 + #43) [pot do podatka: 124-val109]
 *
 * PREHOD 8: protokoli (p48/49) + Veranschlagung/Darstellung §1–§8 (p50–61) +
 * Zusammenstellung A/B (p62–65). Strukturna korekcija F-PZ-18 (monotono §1–§8),
 * aritmetični model I7 (EXACT na p57/p59), p61 prazna predloga.
 *
 * ISKRENOST: val 109 zaključen BREZ VLM glasov — 429 kvota (dnevni značaj) izčrpna
 * z val 107/108 branj; 45 izrezkov (manifest-v109.json) ostane resumable ob kvoti
 * (vzorec p142-t-kultur2). Vse vrednosti = glas #1 (direktni odtis) raven — REVIEW.
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
  issue: number;
  deterministic: boolean;
  method: { passes?: string[]; rejected_reads?: string };
  protokolle_p48_49: {
    datum: string;
    prisotni: { status: string; list: string };
    vsebina: string[];
    reading_honesty: string;
  };
  verantwortlichung_p50_61: {
    source_pages: number[];
    structure_correction_vs_val75: string[];
    table_schema: string;
    arithmetic_model: { id: string; rule: string; status: string };
    sections: { sec: string; name: string; page_i?: number; page_ii?: number; begr_page?: number; classes: { classe: string; page: number; roh: { status: string } }[] }[];
    p61_empty_template: { page: number; status: string };
    reading_honesty: string;
    i7_checks: { sec: string; classe: string; status: string; note?: string; anschlag_closes: boolean; rein_closes: boolean }[];
  };
  zusammenstellung_ab_p62_65: {
    source_pages: number[];
    p62_naslovnica: { status: string; text: string };
    p64_naslovnica: { status: string; text: string };
    p63_zusammenstellung_b: {
      rows: { no: string; kat_no: string; klafter: string; classe: string; status: string; voices?: Record<string, string> }[];
      rows_val109_placeholder?: string;
      status: string;
    };
    p65_zusammenstellung_a: { rows_direct: { no: number; kultur: string; status: string }[]; status: string; vlm_v117?: { razkol_acker_i: string } };
  };
  dileme_v117?: { id: number; vprasanje: string; odgovor: string; status: string }[];
  findings: { id: string; status: string; detail: string }[];
  invariants_enforced: string[];
  invariant_violations: unknown[];
};

const ver = pz.verantwortlichung_p50_61;
const zus = pz.zusammenstellung_ab_p62_65;

describe("val 109 — PZ p48–65 2. prehod (PREHOD 8) [124-val109]", () => {
  test("meta: val 117 (mikroprehod 8b) / PASS 8b / issue 42 / deterministično — prehod iz val 109", () => {
    expect(pz.val).toBe(117);
    expect(pz.pass).toContain("PASS 8b");
    expect(pz.pass).toContain("MIKROPREHOD 8b");
    expect(pz.pass).toContain("45 VLM glasov");
    expect(pz.issue).toBe(42);
    expect(pz.deterministic).toBe(true);
  });

  test("metoda: PREHOD 8 dokumentiran z izrecno neizvedenimi VLM glasovi (429)", () => {
    const prehodi = (pz.method.passes ?? []).join(" ");
    expect(prehodi).toContain("PREHOD 8");
    expect(prehodi).toContain("NE IZVEDENI");
    expect(prehodi).toContain("429");
    expect(prehodi).toContain("resumable");
  });

  test("F-PZ-18: strukturna korekcija p50–61 — 12 popravkov, monotono §1–§8", () => {
    const f18 = pz.findings.find((f) => f.id === "F-PZ-18")!;
    expect(f18.status).toBe("RESOLVED");
    expect(ver.structure_correction_vs_val75).toHaveLength(12);
    const joined = ver.structure_correction_vs_val75.join(" ");
    // val 75 hipoteze, vse korigirane:
    expect(joined).toContain("NE 'VERANTWORTLICHUNG'");
    expect(joined).toContain("NE 'Campus nach Rektifizierung");
    expect(joined).toContain("NE '§5 Kleine Gärten'");
    expect(joined).toContain("prazna tiskana predloga");
    // sekcije monotono §1..§8 z vir resnice strani:
    expect(ver.sections.map((s) => s.sec)).toEqual([
      "§1", "§2", "§3", "§4", "§5", "§6", "§7", "§8",
    ]);
    expect(ver.sections.map((s) => s.name)).toEqual([
      "Ackerland", "Wiesenland", "Kleine Gärten", "Größere Gärten",
      "Weingärten", "Weiden", "Weiden mit Holznutzung", "Bau-Area",
    ]);
    const s1 = ver.sections[0];
    expect(s1.page_i).toBe(50);
    expect(s1.page_ii).toBe(52);
    expect(s1.begr_page).toBe(51);
  });

  test("protokoli p48/49: 5. April 1830 (potrjen val 117), podpisi REVIEW, brez per-parcelnih tabel", () => {
    const p = pz.protokolle_p48_49;
    expect(p.datum).toBe("5. April 1830");
    expect(p.prisotni.status).toContain("REVIEW");
    expect(p.prisotni.list).toContain("Kappas");
    expect(p.vsebina.some((v) => v.includes("per-parcelnih tabel NI"))).toBe(true);
    // val 117: datum potrjen z 2. glasom VLM; podpisna imena kolizija odtis-vs-vlm → REVIEW
    expect(p.reading_honesty).toContain("potrjen");
    expect(p.reading_honesty).toContain("TRANSCRIBED imen NI");
  });

  test("iskrenost (prehod val 117): TRANSCRIBED dvigi dokumentirani, p61 prazna, honesty opisuje admission pravila", () => {
    const blob = JSON.stringify([pz.protokolle_p48_49, ver, zus]);
    // val 117: 58 statusov na TRANSCRIBED ravni (50 § + 8 p63/p65/protokoli) — vsi z metodo (glasovi/model)
    const transcribed = (blob.match(/"status":"TRANSCRIBED/g) ?? []).length;
    expect(transcribed).toBeGreaterThanOrEqual(50);
    expect(transcribed).toBeLessThanOrEqual(70);
    // p61 = prazna predloga (brez VLM — nič za prebrati):
    expect(ver.p61_empty_template.page).toBe(61);
    expect(ver.p61_empty_template.status).toContain("brez VLM");
    // honesty zapisi opisujejo admission pravila val 117:
    expect(ver.reading_honesty).toContain("model-EXACT lift");
    expect(ver.reading_honesty).toContain("nič ne vsiljeno");
  });

  test("model I7: 11 vrstic i7_checks; val 117: 10 EXACT (p54 in p60 zdaj zapirata); kontrola NE vrata", () => {
    expect(ver.i7_checks).toHaveLength(11);
    const exact = ver.i7_checks.filter((c) => c.status === "I7-EXACT");
    expect(exact.length).toBe(10); // val 117: §1 I/II, §2 I/II, §3–§6, §7/Weide, §8 (prej 7 — p54 in p60 nova)
    // vsi EXACT zapirajo obe aritmetiki:
    for (const c of exact) {
      expect(c.anschlag_closes).toBe(true);
      expect(c.rein_closes).toBe(true);
    }
    // p54 Wiesen II ZDAJ zapira z roh=4 (val 117 — prej 14.0 ne zapiralo):
    const p54 = ver.i7_checks.find((c) => c.sec === "§2" && c.classe === "II.te")!;
    expect(p54.status).toBe("I7-EXACT");
    expect(p54.note).toContain("2×EXACT");
    // §7 Holznutzung brez modela (—|6 brez taxa):
    const holz = ver.i7_checks.find((c) => c.classe === "Holznutzung")!;
    expect(holz.status).toBe("BREZ-MODELA");
    expect(ver.arithmetic_model.id).toBe("I7");
    expect(ver.arithmetic_model.status).toContain("EXACT");
  });

  test("invarianta I7: 7 zapisanih, kršitve prazne", () => {
    expect(pz.invariants_enforced).toHaveLength(7);
    expect(pz.invariants_enforced[6]).toContain("I7");
    expect(pz.invariants_enforced[6]).toContain("NE vrata");
    expect(pz.invariant_violations).toEqual([]);
  });

  test("Zus A/B (prehod val 117): p62/p64 naslovnici; p63 16 vrstic integriranih; p65 razkol REALEN", () => {
    expect(zus.source_pages).toEqual([62, 63, 64, 65]);
    expect(zus.p62_naslovnica.status).toContain("TRANSCRIBED-direktni odtis");
    expect(zus.p62_naslovnica.text).toContain("Zusammenstellung über die jährliche Rente");
    expect(zus.p64_naslovnica.text).toContain("Zusammenstellung des gesammten Cultur-Aufwandes");
    // p63 val 117: 16 strukturiranih vrstic (8× TRANSCRIBED, 8× REVIEW — band2 nezanesljiv):
    const p63 = zus.p63_zusammenstellung_b;
    expect(p63.rows).toHaveLength(16);
    expect(p63.status).toContain("DELNO REŠENO (val 117)");
    expect(p63.rows_val109_placeholder).toContain("ODLOŽENO OB KVOTI");
    expect(p63.rows.filter((r) => r.status.startsWith("TRANSCRIBED"))).toHaveLength(5); // r2/r3/r4/r5/r13
    expect(p63.rows.filter((r) => r.status.startsWith("REVIEW"))).toHaveLength(8); // r6–r12 + Summe 2 (band2 nezanesljiv)
    expect(p63.rows.filter((r) => !r.status.startsWith("TRANSCRIBED") && !r.status.startsWith("REVIEW"))).toHaveLength(3); // r1 (kat kolizija) + Summe 1 + r14 (mešani)
    // p65: struktura + 3 direktne vrstice + razkol Acker I REALEN:
    expect(zus.p65_zusammenstellung_a.rows_direct).toHaveLength(3);
    expect(zus.p65_zusammenstellung_a.status).toContain("razkol Acker I REALEN");
    expect(zus.p65_zusammenstellung_a.vlm_v117?.razkol_acker_i).toContain("2 glasa");
    // F-PZ-19 PARTIAL (iskreno — polne vrstice p65 še ne):
    const f19 = pz.findings.find((f) => f.id === "F-PZ-19")!;
    expect(f19.status).toBe("PARTIAL");
  });

  test("surovine: manifest 45 izrezkov, 45 VLM glasov (val 116: kvota prosta — zajeti vsi; integracija = mikroprehod 8b, val 117), direktni odtis zapisan", () => {
    const dir = join(root, "research-griblje/raw-web-val109-2026-09");
    const manifest = JSON.parse(readFileSync(join(dir, "manifest-v109.json"), "utf8")) as {
      crops: { cell: string }[];
    };
    expect(manifest.crops).toHaveLength(45);
    // val 116: vseh 45 glasov zajetih (read-v109.mts ob prosti kvoti); integracija v PZ = val 117
    const vlmDir = join(dir, "vlm-v109");
    const done = existsSync(vlmDir)
      ? readdirSync(vlmDir).filter((f) => f.endsWith(".json"))
      : [];
    expect(done).toHaveLength(45); // val 116: 45/45 glasov (prej 0 — 429 kvota)
    expect(existsSync(join(dir, "direct-reads-v109.md"))).toBe(true);
    const direct = readFileSync(join(dir, "direct-reads-v109.md"), "utf8");
    expect(direct).toContain("glas #1");
    expect(direct).toContain("I7");
    expect(direct).toContain("Odpri dileme");
  });

  test("rejected_reads: p63 celostranski val 77 ohranjen kot glas, NE kot vir resnice", () => {
    const rej = pz.method.rejected_reads ?? "";
    expect(rej).toContain("p63");
    expect(rej).toContain("NE kot vir resnice");
  });
});
