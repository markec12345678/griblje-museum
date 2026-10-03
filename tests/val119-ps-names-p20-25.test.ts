import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const REPO = join(import.meta.dir, "..");

function readJSON(rel: string): unknown {
  return JSON.parse(readFileSync(join(REPO, rel), "utf8"));
}
function sha256(rel: string): string {
  return createHash("sha256").update(readFileSync(join(REPO, rel))).digest("hex");
}

type Reg = Record<string, unknown>[];
const REG = readJSON("research-griblje/ps-n83/register.json") as Reg;
const CH = readJSON(
  "research-griblje/ps-n83/band-v113/register-v119-changes.json",
) as { val: string; stats: Record<string, number>; changes: unknown[] };

function rowsOn(page: number): Reg {
  return REG.filter((r) => r.page === page);
}

describe("val 119 del 1 — gardele vhodov", () => {
  test("register: 2875 vrstic; changes 99 = 47 owner + 14 haus + 28 anmerkung + 4 ditto + 6 page_obs", () => {
    expect(REG.length).toBe(2875);
    expect(CH.val).toBe("119-del1");
    expect(CH.stats.owner_fixes).toBe(47);
    expect(CH.stats.haus_fixes).toBe(14);
    expect(CH.stats.anmerkung_adds).toBe(28);
    expect(CH.stats.ditto_clears).toBe(4);
    expect(CH.stats.open_discrepancies).toBe(28);
    expect(CH.stats.rows_covered).toBe(120);
    expect(CH.changes.length).toBe(99);
  });

  test("reading_pass plasti: v119-names 731 (del 1+2a+2b+2c+2d-x2+2d-x3+2e); v113 0; v114 0; v118-names 60; v115-insert 0; v86 1795", () => {
    const n = (p: string) => REG.filter((r) => r.reading_pass === p).length;
    expect(n("v119-names")).toBe(731); // del 1 (120) + 2a (120) + 2b (122) + 2c (123) + 2d-x2 (60) + 2d-x3 (64) + 2e (p50-p55 = 122)
    expect(n("v113-ps-reread")).toBe(0);
    expect(n("v114-ps-reread")).toBe(0); // 184 − 62 − 2 (2d-x3) − 122 (2e: p50-p55 = zadnje v114 vrstice)
    expect(n("v118-names")).toBe(60);
    expect(n("v115-insert")).toBe(0); // val 119 del 2d-x3: p49-r2 (v115, F2 fill 'Heide Marko.' h3) prebrana -> v119-names
    expect(n("v86-colonial-tiles")).toBe(1795);
  });

  test("0 VLM klicev v vseh 6 readingih", () => {
    for (let pg = 20; pg <= 25; pg++) {
      const rd = readJSON(`research-griblje/ps-n83/band-v113/reading-v119/p${pg}.json`) as {
        meta: { vlm_calls: number; register_rows: number };
        names_audit: Record<string, unknown>;
      };
      expect(rd.meta.vlm_calls).toBe(0);
      expect(Object.keys(rd.names_audit).length).toBe(rd.meta.register_rows);
    }
  });
});

describe("val 119 del 1 — p20 (Jerey/Gorgy/Thomas Johan)", () => {
  test("v57 'Kristan Jerey' izginil; Christan Gorgy ×3 h63; haus snimke", () => {
    const p20 = rowsOn(20);
    expect(p20.some((r) => String(r.owner_original).includes("Jerey"))).toBe(false);
    expect(p20.filter((r) => r.owner_original === "Christan Gorgy").length).toBe(3);
    expect(p20.every((r) => "owner_original_pre_v119" in r || "haus_no_pre_v119" in r || r.reading_pass === "v119-names")).toBe(true);
    const r0 = p20[0];
    expect(r0.owner_original).toBe("Christan Gorgy");
    expect(r0.owner_original_pre_v119).toBe("Kristan Jerey");
  });

  test("r1 = Thomas Johan h55 (ditto ovržen); r19 = Husitsch Maria[?]", () => {
    const p20 = rowsOn(20);
    expect(p20[1].owner_original).toBe("Thomas Johan");
    expect(p20[1].haus_no).toBe("55");
    expect(p20[1].haus_no_pre_v119).toBe("63");
    expect(p20[1].owner_was_ditto).toBe(false);
    expect(String(p20[19].owner_original)).toBe("Husitsch Maria[?]");
    expect(p20[19].owner_original_pre_v119).toBe("Hannß Mache");
  });

  test("odprta razhajanja p20 zabeležena (Gulden[?], Julian[?], Juran[?])", () => {
    const s = JSON.stringify(rowsOn(20));
    expect(s).toContain("razhajanje odprto");
    expect(s).toContain("Gulden[?]");
    expect(s).toContain("Juran[?]");
  });
});

describe("val 119 del 1 — p21 (Jelen -> Johan velika najdba)", () => {
  test("v57 'Jelen' izginil iz imen; Johan ×7 (vključno s p20-r1); ditto r1/r2/r4 ovrženi", () => {
    const p21 = rowsOn(21);
    expect(p21.some((r) => String(r.owner_original).includes("Jelen"))).toBe(false);
    expect(p21.filter((r) => String(r.owner_original).endsWith("Johan")).length).toBe(7);
    expect(p21[1].owner_was_ditto).toBe(false);
    expect(p21[2].owner_was_ditto).toBe(false);
    expect(p21[4].owner_was_ditto).toBe(false);
    expect(p21[4].owner_original).toBe("Peter Malfg");
    expect(String(p21[4].owner_original_pre_v119)).toBe("Peter Grang");
  });

  test("haus 3↔5 popravki: r10 31->51, r11 30->50", () => {
    const p21 = rowsOn(21);
    expect(p21[10].haus_no).toBe("51");
    expect(p21[10].haus_no_pre_v119).toBe("31");
    expect(p21[11].haus_no).toBe("50");
    expect(p21[11].haus_no_pre_v119).toBe("30");
  });
});

describe("val 119 del 1 — p22 (Pustig Marjare fabriakcija)", () => {
  test("'Pustig Marjare' izginil; Peter Malfg ×3 h50 (Malfg hiša s p21); Lapajner Mike ×2", () => {
    const p22 = rowsOn(22);
    expect(p22.some((r) => String(r.owner_original).includes("Pustig Marjare"))).toBe(false);
    expect(p22.filter((r) => r.owner_original === "Peter Malfg" && r.haus_no === "50").length).toBe(3);
    expect(p22.filter((r) => r.owner_original === "Lapajner Mike").length).toBe(2);
    expect(p22[3].owner_original_pre_v119).toBe("Pustig Marjare");
  });
});

describe("val 119 del 1 — p23/p24 (Schlomnitz + Habschider Georg)", () => {
  test("p23: Schlomnitz Georg pattern-fill razbit (Johan/Peter); Strauß Gorgy h15 (del 2 cross-val fix)", () => {
    const p23 = rowsOn(23);
    expect(p23.filter((r) => r.owner_original === "Schlomnitz Georg").length).toBe(0);
    expect(p23.filter((r) => r.owner_original === "Schlomnitz Johan").length).toBe(3);
    expect(p23[4].owner_original).toBe("Strauß Gorgy"); // val 119 del 2: x16 p23-r4 ≡ p28-r9 (isti h15) — "Krause" brez t-prečke ostaja za h45
  });

  test("p24: Kreutler/Schuster/Sagmeister izginili; Habschider Georg ×4 h48; Kruescher Peter h36", () => {
    const p24 = rowsOn(24);
    const names = p24.map((r) => String(r.owner_original));
    expect(names.some((n) => n.includes("Kreutler") || n.includes("Schuster"))).toBe(false);
    expect(p24.filter((r) => r.owner_original === "Habschider Georg" && r.haus_no === "48").length).toBe(5);
    expect(p24[6].owner_original).toBe("Sagmeister Michl"); // r6 = odprto razhajanje (v57 ohranjeno + anmerkung)
    expect(p24[11].owner_original).toBe("Kruescher Peter");
    expect(p24[11].haus_no).toBe("36");
    expect(p24[11].haus_no_pre_v119).toBe("56");
  });
});

describe("val 119 del 1 — p25 (Schimer + Habschider par)", () => {
  test("'Schime' -> 'Schimer' ×4 (PUA h.28 presek); Einsle/Michelbacher izginili", () => {
    const p25 = rowsOn(25);
    expect(p25.filter((r) => String(r.owner_original).startsWith("Schimer")).length).toBe(4);
    const names = p25.map((r) => String(r.owner_original));
    expect(names.some((n) => n.includes("Einsle") || n.includes("Michelbacher"))).toBe(false);
    expect(p25[17].owner_original).toBe("Habschider Marth");
    expect(p25[19].owner_original).toBe("Habschider Georg");
  });

  test("r13 haus 10->40; r15 haus 49->43 + razhajanje Prulla Miko[?]", () => {
    const p25 = rowsOn(25);
    expect(p25[13].haus_no).toBe("40");
    expect(p25[13].haus_no_pre_v119).toBe("10");
    expect(p25[15].haus_no).toBe("43");
    expect(JSON.stringify(p25[15])).toContain("Prulla Miko[?]");
  });
});

describe("val 119 del 1 — iskrenost (§4)", () => {
  test("TRANSCRIBED = 0; review_status nedotaknjen; 37 odprtih razhajanj z anmerkung (del 1: 28 + del 2a: 5 + del 2b: 2 + del 2c: 2)", () => {
    expect(REG.every((r) => r.review_status !== "TRANSCRIBED")).toBe(true);
    const withOpen = REG.filter((r) => String(r.anmerkung).includes("[v119 imenski pass: razhajanje odprto")).length;
    expect(withOpen).toBe(55); // del 1: 28 + 2a: 5 + 2b: 2 + 2c: 2 + 2d-x2: 18 (p44-p46)
  });

  test("normalizacija: 'Christian' črnilo -> 'Christan' register (val 118 precedens); 'Kristan' K-napaka popravljenja", () => {
    const p20 = rowsOn(20);
    expect(p20.some((r) => String(r.owner_original) === "Kristan Jerey")).toBe(false); // pattern-fill izrinjen; odprta razhajanja ohranjajo v57
    expect(p20.filter((r) => String(r.owner_original).startsWith("Christan")).length).toBe(8);
  });
});

describe("val 119 del 1 — kaskada (izrecna)", () => {
  test("KG sha fc23ab10 (62d8cfea @2d-x3 -> timestamp-only @2e kaskada; 2 RESIDENCE relacije TP-029 prevezane na re-sidrane lastnike ostajajo); PARCEL 2427 / HAS_PARCEL 2773 / 3269 / 3477 identično", () => {
    expect(sha256("research-griblje/atlas-1825/knowledge-graph-1825.json")).toMatch(/^fc23ab10/);
    const kg = readJSON("research-griblje/atlas-1825/knowledge-graph-1825.json") as {
      nodes: unknown[];
      edges: unknown[];
    };
    expect(kg.nodes.length).toBe(3764);
    expect(kg.edges.length).toBe(3473);
    const s = readFileSync(join(REPO, "src/data/story-graph-1825.json"), "utf8");
    expect(s.length).toBeGreaterThan(0);
  });

  test("pass3 392 parcel + raba 105/142 identično; K5 dito 207; K9 53 (val 119 del 2d-x3: p48 F-NA-02 — v114 jae = klafter v napačni koloni)", () => {
    const pr = readJSON("research-griblje/atlas-1825/parcel-register-1825.json") as Record<string, unknown>;
    expect(pr.ps_parcels_total).toBe(392);
    const c4 = readJSON("research-griblje/ps-n83/band-v86/c4-metrika-v90.json") as {
      meta: Record<string, unknown>;
    };
    expect(String(c4.meta.K5_input_reliability)).toContain("207/2875");
    const k9 = JSON.stringify(c4);
    expect(k9).toContain('"jaethe_plain_100_1599":52');
    expect(k9).toContain('"jaethe_empty":959'); // val 119 del 2e: 965 − 4 → val 121: 958
  });
});
