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
  "research-griblje/ps-n83/band-v113/register-v119-del2d-changes.json",
) as { val: string; stats: Record<string, unknown>; changes: unknown[] };

const f = (r: Record<string, unknown>, k: string) => String(r[k] ?? "");
function rowsOn(page: number): Reg {
  return REG.filter((r) => r.page === page);
}

describe("val 119 del 2d-x2 — gardele vhodov (p44–p46 vgradnja; p47–p49 nadgrajeni v del 2d-x3, protokol 140)", () => {
  test("register: 2875 vrstic; changes 71 = 47 owner + 3 haus + 18 anmerkung + 3 page_obs", () => {
    expect(REG.length).toBe(2876);
    expect(CH.val).toBe("119-del2d");
    expect(CH.stats.owner_fixes).toBe(47);
    expect(CH.stats.haus_fixes).toBe(3);
    expect(CH.stats.anmerkung_adds).toBe(18);
    expect(CH.stats.open_discrepancies).toBe(18);
    expect(CH.stats.rows_covered).toBe(60);
    expect(CH.stats.pages_covered).toEqual(["p44", "p45", "p46"]);
    expect(CH.changes.length).toBe(71);
  });

  test("reading_pass plasti: v119-names 731 (609 + 122 po del 2e); v114 0 (PS p25-p55 pokrite @2e); v118 60; v115 0; v86 1795; ditto 208", () => {
    const n = (p: string) => REG.filter((r) => r.reading_pass === p).length;
    expect(n("v119-names")).toBe(731); // 545 + 2d-x3 (64) + 2e (p50-p55 = 122)
    expect(n("v114-ps-reread")).toBe(0); // 184 − 64 (2d-x3) − 122 (2e: p50-p55 = zadnje v114 vrstice)
    expect(n("v118-names")).toBe(60);
    expect(n("v115-insert")).toBe(0); // p49-r2 F2 fill -> v119-names (del 2d-x3)
    expect(n("v86-colonial-tiles")).toBe(1795);
    expect(REG.filter((r) => r.owner_was_ditto === true).length).toBe(208);
  });

  test("0 VLM klicev v vseh 6 readingih (p44-p49); p47-p49 nadgrajeni iz DRAFT v celovito branje (del 2d-x3, protokol 140)", () => {
    for (let pg = 44; pg <= 49; pg++) {
      const rd = readJSON(
        `research-griblje/ps-n83/band-v113/reading-v119d/p${pg}.json`,
      ) as {
        meta: { vlm_calls: number; register_rows: number; status?: string; del?: string };
        names_audit: Record<string, unknown>;
      };
      expect(rd.meta.vlm_calls).toBe(0);
      expect(rd.meta.register_rows).toBe(rowsOn(pg).length);
      expect(Object.keys(rd.names_audit).length).toBe(rowsOn(pg).length);
      if (pg >= 47) {
        expect(String(rd.meta.status)).toContain("celovito branje ime+vrednost (x3)");
        expect(rd.meta.del).toBe("2d-x3");
      } else {
        expect(rd.meta.status).toBeUndefined();
      }
    }
  });

  test("parzelle-sidr ključne vrstice: p44-r10 Schimek Micha h49 (del 2c 4-glyf cross-val); p44-r12 Ulrich Miho h68; p45-r5/r14 Heide Marko h3 + Novak Michael h10; p46-r13/r14 Tillach h61; p46 Krischan h62/h63", () => {
    const p44 = rowsOn(44);
    expect(f(p44[10], "owner_original")).toBe("Schimek Micha.[?]");
    expect(f(p44[10], "haus_no")).toBe("1 / 49");
    expect(f(p44[12], "owner_original")).toBe("Ulrich Miho.");
    expect(f(p44[12], "haus_no")).toBe("1 / 68");
    expect(f(p44[17], "owner_original")).toBe("Novak Martlin.");
    expect(f(p44[17], "haus_no")).toBe("1 / 14");
    const p45 = rowsOn(45);
    expect(f(p45[5], "owner_original")).toBe("Heide Marko.");
    expect(f(p45[5], "haus_no")).toBe("3");
    expect(f(p45[14], "owner_original")).toBe("Novak Michael.");
    const p46 = rowsOn(46);
    expect(f(p46[13], "owner_original")).toBe("Tillach Miko.[?]");
    expect(f(p46[13], "haus_no")).toBe("11 / 61");
    expect(f(p46[1], "owner_original")).toBe("Peodvin Grany.");
    expect(f(p46[15], "owner_original")).toBe("Krischan Grany.[?]");
  });

  test("snimke pre_v119 + anmerkung add-only: 18 odprtih razhajanj p44–p46 (skupaj 99 po del 2e: +28)", () => {
    const snaps = REG.filter((r) => "owner_original_pre_v119" in r);
    expect(snaps.length).toBeGreaterThanOrEqual(47);
    const withOpen = REG.filter((r) =>
      f(r, "anmerkung").includes("razhajanje odprto"),
    ).length;
    expect(withOpen).toBe(99); // 37 (del 1+2a+2b+2c) + 18 (2d-x2) + 16 (2d-x3) + 28 (2e)
  });
});

describe("val 119 del 2d-x2 — kaskada (izrecna)", () => {
  test("KG sha 1e49de43 raznesen (745a9cdd -> b660c0d1 @2d-x2; -> 62d8cfea @2d-x3: 2 RESIDENCE relacije TP-029 prevezane; -> 1e49de43 @2e: timestamp-only); 3269/3477/2427/2773 identično", () => {
    const kg = sha256("src/data/knowledge-graph-1825.json").slice(0, 8);
    expect(kg).toBe("1e49de43");
    const sg = readJSON("src/data/story-graph-1825.json") as {
      entities: unknown[];
      relations: unknown[];
    };
    expect(sg.entities.length).toBe(3765);
    expect(sg.relations.length).toBe(3473);
  });

  test("pass3: PS vir nespremenjen; K5 dito 208; K9 69 nespremenjen", () => {
    const parcels = REG.filter((r) => f(r, "source") === "SI AS 176/N/N83/s/PS");
    expect(parcels.length).toBe(2876); // celoten register = PS vir (392 parcel + rabovna plast)
    const metrika = readJSON(
      "research-griblje/ps-n83/band-v86/c4-metrika-v90.json",
    ) as { k5_ditto?: number; k9?: number };
    expect(REG.filter((r) => r.owner_was_ditto === true).length).toBe(208);
  });

  test("runtime kopije držijo isti KG sha 1e49de43 (ena izhodna resnica)", () => {
    const a = sha256("src/data/knowledge-graph-1825.json");
    const b = sha256("research-griblje/atlas-1825/knowledge-graph-1825.json");
    expect(a).toBe(b);
    const c = sha256("src/data/story-graph-1825.json");
    const d = sha256("research-griblje/atlas-1825/story-graph-1825.json");
    expect(c).toBe(d);
  });
});
