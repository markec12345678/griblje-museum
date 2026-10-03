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
  "research-griblje/ps-n83/band-v113/register-v119-del2b-changes.json",
) as { val: string; stats: Record<string, unknown>; changes: unknown[] };

const f = (r: Record<string, unknown>, k: string) => String(r[k] ?? "");
function rowsOn(page: number): Reg {
  return REG.filter((r) => r.page === page);
}

describe("val 119 del 2b — gardele vhodov", () => {
  test("register: 2875 vrstic; changes 141 = 107 owner + 19 haus + 2 anmerkung + 7 ditto + 6 page_obs", () => {
    expect(REG.length).toBe(2876);
    expect(CH.val).toBe("119-del2b");
    expect(CH.stats.owner_fixes).toBe(107);
    expect(CH.stats.haus_fixes).toBe(19);
    expect(CH.stats.anmerkung_adds).toBe(2);
    expect(CH.stats.ditto_clears).toBe(7);
    expect(CH.stats.open_discrepancies).toBe(2);
    expect(CH.stats.rows_covered).toBe(122);
    expect(CH.stats.pages_covered).toEqual(["p32", "p33", "p34", "p35", "p36", "p37"]);
    expect(CH.changes.length).toBe(141);
  });

  test("reading_pass plasti: v119-names 731 (po del 2d-x2+2d-x3+2e); v114 0 (PS p25-p55 pokrite @2e); v118 60; v115 0 (p49 r2 F2 fill @2d-x3); v86 1795; ditto 208", () => {
    const n = (p: string) => REG.filter((r) => r.reading_pass === p).length;
    expect(n("v119-names")).toBe(731);
    expect(n("v114-ps-reread")).toBe(0);
    expect(n("v118-names")).toBe(60);
    expect(n("v115-insert")).toBe(0);
    expect(n("v86-colonial-tiles")).toBe(1795);
    expect(REG.filter((r) => r.owner_was_ditto === true).length).toBe(208);
  });

  test("0 VLM klicev v vseh 6 readingih (p32-p37); register_rows = 20/21/21/20/20/20", () => {
    const expected: Record<number, number> = { 32: 20, 33: 21, 34: 21, 35: 20, 36: 20, 37: 20 };
    for (const [pgS, rowsE] of Object.entries(expected)) {
      const rd = readJSON(
        `research-griblje/ps-n83/band-v113/reading-v119/p${pgS}.json`,
      ) as { meta: { vlm_calls: number; register_rows: number }; names_audit: Record<string, unknown> };
      expect(rd.meta.vlm_calls).toBe(0);
      expect(rd.meta.register_rows).toBe(rowsE);
      expect(Object.keys(rd.names_audit).length).toBe(rowsE);
    }
  });

  test("TRANSCRIBED = 0; review_status nedotaknjen; 55 odprtih razhajanj (del 1: 28 + 2a: 5 + 2b: 2 + 2c: 2 + 2d-x2: 18)", () => {
    expect(REG.every((r) => r.review_status !== "TRANSCRIBED")).toBe(true);
    const withOpen = REG.filter((r) =>
      String(r.anmerkung).includes("[v119 imenski pass: razhajanje odprto"),
    ).length;
    expect(withOpen).toBe(55);
  });
});

describe("val 119 del 2b — p32 (Pöching/Schimer/Brulla/Strauß/Hladnikhar)", () => {
  test("v57 pattern-fill izrinjen: Paulin/Peter Gregor/Šimunc/Valentin Marko/Lovrenc Gregor/Gregor greg. izginili", () => {
    const p32 = rowsOn(32);
    const owners = p32.map((r) => f(r, "owner_original"));
    expect(owners.some((o) => o.includes("Paulin"))).toBe(false);
    expect(owners.some((o) => o.includes("Peter"))).toBe(false);
    expect(owners.some((o) => o.includes("Šimunc"))).toBe(false);
    expect(owners.some((o) => o.includes("Valentin"))).toBe(false);
    expect(owners.some((o) => o.includes("Lovrenc"))).toBe(false);
    expect(owners.some((o) => o === "Gregor greg.")).toBe(false);
  });

  test("nove vsebine: Pöching ×7, Schimer ×3, Brulla ×2, Strauß ×2, Hladnikhar ×5", () => {
    const p32 = rowsOn(32);
    const owners = p32.map((r) => f(r, "owner_original"));
    expect(owners.filter((o) => o.startsWith("Pöching")).length).toBe(7);
    expect(owners.filter((o) => o.startsWith("Schimer")).length).toBe(3);
    expect(owners.filter((o) => o.startsWith("Brulla")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Strauß")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Hladnikhar")).length).toBe(5);
  });

  test("5 haus POPRAVEK s snimkami: 42->43, 12->42 ×2, 40->43, 46->45", () => {
    const p32 = rowsOn(32);
    expect(f(p32[2], "haus_no")).toBe("43");
    expect(f(p32[2], "haus_no_pre_v119")).toBe("42");
    expect(f(p32[3], "haus_no")).toBe("42");
    expect(f(p32[3], "haus_no_pre_v119")).toBe("12");
    expect(f(p32[7], "haus_no")).toBe("43");
    expect(f(p32[7], "haus_no_pre_v119")).toBe("40");
    expect(f(p32[8], "haus_no")).toBe("42");
    expect(f(p32[8], "haus_no_pre_v119")).toBe("12");
    expect(f(p32[13], "haus_no")).toBe("45");
    expect(f(p32[13], "haus_no_pre_v119")).toBe("46");
  });

  test("r0 razhajanje odprto: 'Nava Marlin[?]' zabeleženo, v57 'Matjaž Marnel' ohranjeno", () => {
    const p32 = rowsOn(32);
    expect(f(p32[0], "owner_original")).toBe("Matjaž Marnel");
    expect(f(p32[0], "anmerkung")).toContain("razhajanje odprto");
    expect(f(p32[0], "anmerkung")).toContain("Nava Marlin[?]");
  });

  test("h45 = Strauß Georgy pair (r13+r15) — skladno z del 2a h15 cross-val", () => {
    const p32 = rowsOn(32);
    expect(f(p32[13], "owner_original")).toBe("Strauß Georgy.[?]");
    expect(f(p32[15], "owner_original")).toBe("Strauß Georgy.[?]");
  });
});

describe("val 119 del 2b — p33 (Pöching črnilo + 2 ditto ovrženih)", () => {
  test("v57 'Pölling' ×5 izrinjen s 'Pöching.' (ch jasno); Hirzog/Rudolf/Prunkl/Widhalden izginili", () => {
    const p33 = rowsOn(33);
    const owners = p33.map((r) => f(r, "owner_original"));
    expect(owners.some((o) => o.includes("Pölling"))).toBe(false);
    expect(owners.some((o) => o.includes("Hirzog"))).toBe(false);
    expect(owners.some((o) => o.includes("Rudolf"))).toBe(false);
    expect(owners.some((o) => o.includes("Prunkl"))).toBe(false);
    expect(owners.some((o) => o.includes("Widhalden"))).toBe(false);
    expect(owners.filter((o) => o.startsWith("Pöching")).length).toBe(6);
  });

  test("2 ditto ovržena (r3 Hladnikhar, r5 Stüllach) — črnilo polna imena; snimke", () => {
    const p33 = rowsOn(33);
    expect(p33[3].owner_was_ditto).toBe(false);
    expect(p33[3].owner_was_ditto_pre_v119).toBe(true);
    expect(f(p33[3], "owner_original")).toBe("Hladnikhar[?] Georg.");
    expect(p33[5].owner_was_ditto).toBe(false);
    expect(p33[5].owner_was_ditto_pre_v119).toBe(true);
    expect(f(p33[5], "owner_original")).toBe("Stüllach.[?] Michel.");
  });

  test("h43 Brulla Maria (r0) + h113 Brulla Maria (r20); h39 Schimer Mache presek", () => {
    const p33 = rowsOn(33);
    expect(f(p33[0], "owner_original")).toBe("Brulla Maria.");
    expect(f(p33[20], "owner_original")).toBe("Brulla Maria.[?]");
    expect(f(p33[8], "owner_original")).toBe("Schimer Mache[?]");
  });
});

describe("val 119 del 2b — p34 (Ponter[?] + Ring + 2 ditto + prazna v115 celica)", () => {
  test("'Piber' ×5 -> 'Ponter,[?]' z [?]; Eberl -> Ulrich; Muhldorfer -> Mulschitsch[?]", () => {
    const p34 = rowsOn(34);
    const owners = p34.map((r) => f(r, "owner_original"));
    expect(owners.some((o) => o.includes("Piber"))).toBe(false);
    expect(owners.some((o) => o.includes("Eberl"))).toBe(false);
    expect(owners.some((o) => o.includes("Muhldorfer"))).toBe(false);
    expect(f(p34[0], "owner_original")).toBe("Ponter, Mathl.[?]");
    expect(f(p34[8], "owner_original")).toBe("Ulrich Michel.[?]");
    expect(f(p34[10], "owner_original")).toBe("Mulschitsch Johann.[?]");
  });

  test("Ring ×4 (h28 Michl ×2, h26 Johann ×2); haus POPRAVEK r14 26->28 s snimko", () => {
    const p34 = rowsOn(34);
    expect(f(p34[12], "owner_original")).toBe("Ring Michl.");
    expect(f(p34[13], "owner_original")).toBe("Ring Johann.");
    expect(f(p34[14], "owner_original")).toBe("Ring Michl.");
    expect(f(p34[14], "haus_no")).toBe("28");
    expect(f(p34[14], "haus_no_pre_v119")).toBe("26");
    expect(f(p34[15], "owner_original")).toBe("Ring Johann.");
  });

  test("2 ditto ovržena (r1, r2); r5 Ravella soglasje; r20 v115 prazna celica = razhajanje odprto", () => {
    const p34 = rowsOn(34);
    expect(p34[1].owner_was_ditto).toBe(false);
    expect(p34[1].owner_was_ditto_pre_v119).toBe(true);
    expect(p34[2].owner_was_ditto).toBe(false);
    expect(f(p34[5], "owner_original")).toBe("Ravella, Michl");
    expect(f(p34[20], "owner_original")).toBe("Hurich/Lohingr Mich.[?]");
    expect(f(p34[20], "anmerkung")).toContain("razhajanje odprto");
    expect(f(p34[20], "anmerkung")).toContain("(prazno)");
    expect(f(p34[20], "reading_pass")).toBe("v119-names");
  });
});

describe("val 119 del 2b — p35 (Ulrich/Stüllach/Dappler/Ring/Krischan preseki)", () => {
  test("'Witsch' ×6 izrinjen; h32 'Ulrich Georg.' jasno ( popravi tudi p34 w2 dvom)", () => {
    const p35 = rowsOn(35);
    const owners = p35.map((r) => f(r, "owner_original"));
    expect(owners.some((o) => o.includes("Witsch"))).toBe(false);
    expect(f(p35[8], "owner_original")).toBe("Ulrich Georg.");
    expect(f(p35[9], "owner_original")).toBe("Ulrich Georg.");
    expect(f(rowsOn(34)[7], "owner_original")).toBe("Ulrich Georg.[?]");
    expect(f(rowsOn(34)[18], "owner_original")).toBe("Ulrich Georg.[?]");
  });

  test("h34 Stüllach ×2; h30 Dappler ×3; h26 Ring Johann ×2; h28 Ring Michl + Milo[?]", () => {
    const p35 = rowsOn(35);
    expect(f(p35[2], "owner_original")).toBe("Stüllach Mathl.[?]");
    expect(f(p35[3], "owner_original")).toBe("Stüllach Mathl.[?]");
    expect(f(p35[11], "owner_original")).toBe("Dappler Mathl.[?]");
    expect(f(p35[17], "owner_original")).toBe("Dappler Mathl.[?]");
    expect(f(p35[18], "owner_original")).toBe("Dappler Mathl.[?]");
    expect(f(p35[14], "owner_original")).toBe("Ring Johann.");
    expect(f(p35[15], "owner_original")).toBe("Ring Johann.");
    expect(f(p35[16], "owner_original")).toBe("Ring Michl.");
    expect(f(p35[19], "owner_original")).toBe("Ring Milo.[?]");
  });

  test("soglasja ohranjena: r4 Wier Grunigman, r6 Gemeinde, r12/r13 Malwischly", () => {
    const p35 = rowsOn(35);
    expect(f(p35[4], "owner_original")).toBe("Wier Grunigman");
    expect(f(p35[6], "owner_original")).toBe("Gemeinde");
    expect(f(p35[12], "owner_original")).toBe("Malwischly Johann");
    expect(f(p35[13], "owner_original")).toBe("Malwischly Johann");
  });
});

describe("val 119 del 2b — p36 (Ring grozda + Müllner + 2 haus POPRAVEK + 3 ditto)", () => {
  test("'Wernig' ×6 izrinjen s Ring: h24 Michael ×3, h26 Johann, h25 Mito, h23 Mathä", () => {
    const p36 = rowsOn(36);
    const owners = p36.map((r) => f(r, "owner_original"));
    expect(owners.some((o) => o.includes("Wernig"))).toBe(false);
    expect(f(p36[2], "owner_original")).toBe("Ring Michael.");
    expect(f(p36[10], "owner_original")).toBe("Ring Michael.");
    expect(f(p36[14], "owner_original")).toBe("Ring Michael.");
    expect(f(p36[13], "owner_original")).toBe("Ring Johann.");
    expect(f(p36[15], "owner_original")).toBe("Ring Mito.[?]");
    expect(f(p36[16], "owner_original")).toBe("Ring Mathä.[?]");
  });

  test("2 haus POPRAVEK: r8 36->35 (Tillach/Killach hiša) + r17 64->67 (Puchey)", () => {
    const p36 = rowsOn(36);
    expect(f(p36[8], "haus_no")).toBe("35");
    expect(f(p36[8], "haus_no_pre_v119")).toBe("36");
    expect(f(p36[8], "owner_original")).toBe("Tillach Peter.[?]");
    expect(f(p36[17], "haus_no")).toBe("67");
    expect(f(p36[17], "haus_no_pre_v119")).toBe("64");
    expect(f(p36[17], "owner_original")).toBe("Puchey Georg.");
  });

  test("3 ditto ovržena (r1, r5, r7); Müllner h29 soglasja ohranjena", () => {
    const p36 = rowsOn(36);
    expect(p36[1].owner_was_ditto).toBe(false);
    expect(p36[5].owner_was_ditto).toBe(false);
    expect(p36[7].owner_was_ditto).toBe(false);
    expect(f(p36[0], "owner_original")).toBe("Müllner Samuel");
    expect(f(p36[12], "owner_original")).toBe("Müllner Samuel");
    expect(f(p36[9], "owner_original")).toBe("Müllner Johann");
  });
});

describe("val 119 del 2b — p37 (Ring popolna + 11 haus POPRAVEK)", () => {
  test("'Piringer uibio' ×8 + 'Bruckner' ×5 izrinjeni; Ring ×12, Bruckler[?] ×5, Müllner, Mallwitsch/Malwischly", () => {
    const p37 = rowsOn(37);
    const owners = p37.map((r) => f(r, "owner_original"));
    expect(owners.some((o) => o.includes("Piringer"))).toBe(false);
    expect(owners.some((o) => o.includes("Bruckner"))).toBe(false);
    expect(owners.filter((o) => o.startsWith("Ring")).length).toBe(12);
    expect(owners.filter((o) => o.startsWith("Bruckler")).length).toBe(5);
    expect(f(p37[1], "owner_original")).toBe("Müllner Samuel.");
    expect(f(p37[17], "owner_original")).toBe("Mallwitsch Johann"); // soglasje (forma-dvom) — r18 nosi POPRAVEK 'Malwischly Johann.[?]'
  });

  test("11 haus POPRAVEK s snimkami (v57 swap r4/r5 + 9 popravkov) — parna struktura črnila", () => {
    const p37 = rowsOn(37);
    const pairs: [number, string, string][] = [
      [4, "23", "25"],
      [5, "25", "23"],
      [8, "30", "26"],
      [9, "25", "28"],
      [10, "28", "24"],
      [12, "24", "28"],
      [14, "28", "26"],
      [15, "30", "28"],
      [16, "30", "29"],
      [18, "27", "28"],
      [19, "28", "26"],
    ];
    for (const [i, now, was] of pairs) {
      expect(f(p37[i], "haus_no")).toBe(now);
      expect(f(p37[i], "haus_no_pre_v119")).toBe(was);
    }
  });

  test("Ring-grozda h23-h28 čez p32-p37: h23 Mathä, h24 Michael, h25 Mito/Michl, h26 Johann, h27 Malw(itsch/ischly) + Mulschitsch (p34), h28 Michl ×7", () => {
    const block = REG.filter((r) => Number(r.page) >= 32 && Number(r.page) <= 37);
    const byHaus = (h: string) => block.filter((r) => f(r, "haus_no") === h);
    expect(byHaus("23").every((r) => f(r, "owner_original").startsWith("Ring"))).toBe(true);
    expect(byHaus("24").every((r) => f(r, "owner_original").startsWith("Ring"))).toBe(true);
    expect(byHaus("25").every((r) => f(r, "owner_original").startsWith("Ring"))).toBe(true);
    expect(byHaus("26").every((r) => f(r, "owner_original").startsWith("Ring"))).toBe(true);
    // h27: p35 ×2 'Malwischly Johann' + p37 'Mallwitsch Johann' (soglasje) + 'Malwischly Johann.[?]'; p34 = 'Mulschitsch Johann.[?]' (ločen presek)
    expect(
      byHaus("27").every((r) => {
        const o = f(r, "owner_original");
        return o.startsWith("Mal") || o.startsWith("Mulsch");
      }),
    ).toBe(true);
    expect(byHaus("28").every((r) => f(r, "owner_original").startsWith("Ring"))).toBe(true);
  });
});

describe("val 119 del 2b — iskrenost (§4)", () => {
  test("izrecni dvomi ostajajo v imenih ([?]); PUA/PT orientacijska; 0 VLM", () => {
    const p32p37 = REG.filter((r) => Number(r.page) >= 32 && Number(r.page) <= 37);
    const withDoubt = p32p37.filter((r) => f(r, "owner_original").includes("[?]")).length;
    expect(withDoubt).toBeGreaterThan(40);
    for (let pg = 32; pg <= 37; pg++) {
      const rd = readJSON(
        `research-griblje/ps-n83/band-v113/reading-v119/p${pg}.json`,
      ) as { meta: { vlm_calls: number } };
      expect(rd.meta.vlm_calls).toBe(0);
    }
  });

  test("pre_v119 snimke na vseh spremenjenih vrsticah", () => {
    const changed = REG.filter(
      (r) =>
        Number(r.page) >= 32 &&
        Number(r.page) <= 37 &&
        (("owner_original_pre_v119" in r) || ("haus_no_pre_v119" in r)),
    );
    expect(changed.length).toBeGreaterThan(90);
    for (const r of changed) {
      const hasSnap =
        "owner_original_pre_v119" in r ||
        "haus_no_pre_v119" in r ||
        "anmerkung_pre_v119" in r;
      expect(hasSnap).toBe(true);
    }
  });
});

describe("val 119 del 2b — kaskada (izrecna)", () => {
  test("KG sha 1e49de43 raznesen (4bb6a974 -> 62d8cfea @2d-x3 ->); PARCEL 2427 / HAS_PARCEL 2773 / 3269 / 3477 identično", () => {
    expect(sha256("research-griblje/atlas-1825/knowledge-graph-1825.json")).toMatch(
      /^1e49de43/,
    );
    const kg = readJSON("research-griblje/atlas-1825/knowledge-graph-1825.json") as {
      stats?: Record<string, number>;
      meta?: Record<string, unknown>;
    };
    const kgAny = kg as unknown as Record<string, unknown>;
    const nodes = (kgAny.nodes as unknown[]).length;
    const edges = (kgAny.edges as unknown[]).length;
    expect(nodes).toBe(3765);
    expect(edges).toBe(3473);
  });

  test("pass3: 392 PS parcel + raba 105-38-3-12-6-7+142 identično; K5 dito 208; K9 69 nespremenjen", () => {
    const c4 = readJSON(
      "research-griblje/ps-n83/band-v86/c4-metrika-v90.json",
    ) as { meta: Record<string, unknown> };
    expect(String(c4.meta.K5_input_reliability)).toContain("208/2876");
    expect(String(c4.meta.K5_input_reliability)).not.toContain("215/2875");
    const timeline = readJSON(
      "research-griblje/atlas-1825/timeline-1825-1830.json",
    ) as { meta?: Record<string, unknown> };
    expect(JSON.stringify(timeline)).toContain("1e49de43");
  });

  test("runtime kopija KG v src/data = atlas izhod (ena izhodna resnica)", () => {
    expect(sha256("src/data/knowledge-graph-1825.json")).toMatch(/^1e49de43/);
  });
});
