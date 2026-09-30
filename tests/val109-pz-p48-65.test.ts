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
    i7_checks: { sec: string; classe: string; status: string; anschlag_closes: boolean; rein_closes: boolean }[];
  };
  zusammenstellung_ab_p62_65: {
    source_pages: number[];
    p62_naslovnica: { status: string; text: string };
    p64_naslovnica: { status: string; text: string };
    p63_zusammenstellung_b: { rows: string; status: string };
    p65_zusammenstellung_a: { rows_direct: { no: number; kultur: string; status: string }[]; status: string };
  };
  findings: { id: string; status: string; detail: string }[];
  invariants_enforced: string[];
  invariant_violations: unknown[];
};

const ver = pz.verantwortlichung_p50_61;
const zus = pz.zusammenstellung_ab_p62_65;

describe("val 109 — PZ p48–65 2. prehod (PREHOD 8) [124-val109]", () => {
  test("meta: val 109 / PASS 8 / issue 42 / deterministično", () => {
    expect(pz.val).toBe(109);
    expect(pz.pass).toContain("PASS 8");
    expect(pz.pass).toContain("BREZ VLM");
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

  test("protokoli p48/49: 5. April 1830, podpisi REVIEW, brez per-parcelnih tabel", () => {
    const p = pz.protokolle_p48_49;
    expect(p.datum).toBe("5. April 1830");
    expect(p.prisotni.status).toContain("REVIEW");
    expect(p.prisotni.list).toContain("Kappas");
    expect(p.vsebina.some((v) => v.includes("per-parcelnih tabel NI"))).toBe(true);
    expect(p.reading_honesty).toContain("BREZ VLM glasov");
  });

  test("iskrenost: TRANSCRIBED=0 v novih sekcijah — vse vrednosti glas-1 raven (REVIEW/odtis)", () => {
    const blob = JSON.stringify([pz.protokolle_p48_49, ver, zus]);
    expect((blob.match(/"status": "TRANSCRIBED"/g) ?? []).length).toBe(0);
    // p61 = prazna predloga (brez VLM — nič za prebrati):
    expect(ver.p61_empty_template.page).toBe(61);
    expect(ver.p61_empty_template.status).toContain("brez VLM");
    // honesty zapisi izrecno omenjajo odložene glasove:
    expect(ver.reading_honesty).toContain("BREZ VLM glasov");
    expect(ver.reading_honesty).toContain("resumable");
  });

  test("model I7: 11 vrstic i7_checks; p57/p59 EXACT; kontrola NE vrata", () => {
    expect(ver.i7_checks).toHaveLength(11);
    const exact = ver.i7_checks.filter((c) => c.status === "I7-EXACT");
    expect(exact.length).toBe(7); // §1 II.te, §2 I.te, §3, §4, §5, §6, §7/Weide
    // vsi EXACT zapirajo obe aritmetiki:
    for (const c of exact) {
      expect(c.anschlag_closes).toBe(true);
      expect(c.rein_closes).toBe(true);
    }
    // p57 Weingärten EXACT (24 × 70 %):
    const p57 = ver.i7_checks.find((c) => c.sec === "§5")!;
    expect(p57.status).toBe("I7-EXACT");
    // p54 Wiesen II se NE zapira z modelom (iskreno):
    const p54 = ver.i7_checks.find((c) => c.sec === "§2" && c.classe === "II.te")!;
    expect(p54.status).toContain("model ne zapira");
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

  test("Zus A/B: p62/p64 naslovnici tiskani; p63 ODLOŽENO-VLM; p65 3 direktne vrstice", () => {
    expect(zus.source_pages).toEqual([62, 63, 64, 65]);
    expect(zus.p62_naslovnica.status).toContain("TRANSCRIBED-direktni odtis");
    expect(zus.p62_naslovnica.text).toContain("Zusammenstellung über die jährliche Rente");
    expect(zus.p64_naslovnica.text).toContain("Zusammenstellung des gesammten Cultur-Aufwandes");
    // p63: vrstice čakajo VLM glasove (val 77 glas sam NE zadosten):
    expect(zus.p63_zusammenstellung_b.status).toContain("ODLOŽENO-VLM");
    expect(zus.p63_zusammenstellung_b.rows).toContain("ODLOŽENO OB KVOTI");
    // p65: struktura + 3 direktne vrstice (Acker I kolizija iskreno REVIEW):
    expect(zus.p65_zusammenstellung_a.rows_direct).toHaveLength(3);
    expect(zus.p65_zusammenstellung_a.rows_direct[0].status).toBe("REVIEW");
    expect(zus.p65_zusammenstellung_a.status).toContain("DELNO REŠENO");
    // F-PZ-19 PARTIAL z izrecno odložitvijo:
    const f19 = pz.findings.find((f) => f.id === "F-PZ-19")!;
    expect(f19.status).toBe("PARTIAL");
    expect(f19.detail).toContain("ob kvoti");
    expect(f19.detail).toContain("p142-t-kultur2");
  });

  test("surovine: manifest 45 izrezkov, 0 VLM glasov (iskreno stanje vala), direktni odtis zapisan", () => {
    const dir = join(root, "research-griblje/raw-web-val109-2026-09");
    const manifest = JSON.parse(readFileSync(join(dir, "manifest-v109.json"), "utf8")) as {
      crops: { cell: string }[];
    };
    expect(manifest.crops).toHaveLength(45);
    // vlm-v109/ je prazen (git ne komitira praznih direktorijev) → obravnavaj manjkajočega:
    const vlmDir = join(dir, "vlm-v109");
    const done = existsSync(vlmDir)
      ? readdirSync(vlmDir).filter((f) => f.endsWith(".json"))
      : [];
    expect(done).toHaveLength(0); // brez VLM glasov — 429 dnevna kvota
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
