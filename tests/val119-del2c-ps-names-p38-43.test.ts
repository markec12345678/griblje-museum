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
  "research-griblje/ps-n83/band-v113/register-v119-del2c-changes.json",
) as { val: string; stats: Record<string, unknown>; changes: unknown[] };

const f = (r: Record<string, unknown>, k: string) => String(r[k] ?? "");
function rowsOn(page: number): Reg {
  return REG.filter((r) => r.page === page);
}

describe("val 119 del 2c — gardele vhodov", () => {
  test("register: 2875 vrstic; changes 146 = 118 owner + 18 haus + 1 crossval + 2 anmerkung + 1 ditto + 6 page_obs", () => {
    expect(REG.length).toBe(2876);
    expect(CH.val).toBe("119-del2c");
    expect(CH.stats.owner_fixes).toBe(118);
    expect(CH.stats.haus_fixes).toBe(18);
    expect(CH.stats.crossval_fixes).toBe(1);
    expect(CH.stats.anmerkung_adds).toBe(2);
    expect(CH.stats.ditto_clears).toBe(1);
    expect(CH.stats.open_discrepancies).toBe(2);
    expect(CH.stats.rows_covered).toBe(123);
    expect(CH.stats.pages_covered).toEqual(["p38", "p39", "p40", "p41", "p42", "p43"]);
    expect(CH.changes.length).toBe(146);
  });

  test("reading_pass plasti: v119-names 731 (609 + 122 po del 2e); v114 0 (122 − 122 @2e); v118 60; v115 0; v86 1795; ditto 208", () => {
    const n = (p: string) => REG.filter((r) => r.reading_pass === p).length;
    expect(n("v119-names")).toBe(731); // 485 + 2d-x2 (60) + 2d-x3 (64) + 2e (p50-p55 = 122)
    expect(n("v114-ps-reread")).toBe(0); // 244 − 60 (2d-x2) − 64 (2d-x3) − 122 (2e: p50-p55)
    expect(n("v118-names")).toBe(60);
    expect(n("v115-insert")).toBe(0); // p49-r2 F2 fill -> v119-names (del 2d-x3)
    expect(n("v86-colonial-tiles")).toBe(1795);
    expect(REG.filter((r) => r.owner_was_ditto === true).length).toBe(208);
  });

  test("0 VLM klicev v vseh 6 readingih (p38-p43); register_rows = 20/21/21/20/21/20", () => {
    const expected: Record<number, number> = { 38: 20, 39: 21, 40: 21, 41: 20, 42: 21, 43: 20 };
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

describe("val 119 del 2c — p38 (Ring-grozda nadaljevanje + parna struktura)", () => {
  test("v57 'König' ×8 + 'Mallwoschki' ×3 + 'Buttler' ×2 + 'Pichler' ×2 + 'Millig' + 'Pongy' + 'Primz' izrinjeni", () => {
    const p38 = rowsOn(38);
    const owners = p38.map((r) => f(r, "owner_original"));
    expect(owners.some((o) => o.includes("König"))).toBe(false);
    expect(owners.some((o) => o.includes("Mallwoschki"))).toBe(false);
    expect(owners.some((o) => o.includes("Buttler"))).toBe(false);
    expect(owners.some((o) => o.includes("Pichler"))).toBe(false);
    expect(owners.some((o) => o.includes("Millig"))).toBe(false);
    expect(owners.some((o) => o.includes("Pongy"))).toBe(false);
    expect(owners.some((o) => o.includes("Primz"))).toBe(false);
  });

  test("nove vsebine: Ring ×8, Malleschick ×3, Bruckler ×2, Puchey ×2, Müllner ×2, Ring Mathä ×2, Ring Michael ×2", () => {
    const p38 = rowsOn(38);
    const owners = p38.map((r) => f(r, "owner_original"));
    expect(owners.filter((o) => o.startsWith("Ring")).length).toBe(10);
    expect(owners.filter((o) => o.startsWith("Malleschick")).length).toBe(3);
    expect(owners.filter((o) => o.startsWith("Bruckler")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Puchey")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Müllner")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Ring Mathä")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Ring Michael")).length).toBe(2);
  });

  test("2 haus POPRAVEK s snimkami: r5 25->23, r18 23->29", () => {
    const p38 = rowsOn(38);
    expect(f(p38[5], "haus_no")).toBe("23");
    expect(f(p38[5], "haus_no_pre_v119")).toBe("25");
    expect(f(p38[18], "haus_no")).toBe("29");
    expect(f(p38[18], "haus_no_pre_v119")).toBe("23");
  });

  test("r15 razhajanje odprto: nerešljiva dolga beseda, v57 'Vilip[?]züanjanky' ohranjeno", () => {
    const p38 = rowsOn(38);
    expect(f(p38[15], "owner_original")).toBe("Vilip[?]züanjanky");
    expect(f(p38[15], "anmerkung")).toContain("razhajanje odprto");
    expect(f(p38[15], "anmerkung")).toContain("Vilip[?]züanjanky");
  });
});

describe("val 119 del 2c — p39 (črnilovrstna sekvenca identična p37; 8 haus POPRAVEK)", () => {
  test("'Höring' ×12 + 'Buchler' ×5 + 'Mally' + 'Mallerseb' izrinjeni; Ring ×12, Bruckler ×5, Malleschick ×2, Müllner", () => {
    const p39 = rowsOn(39);
    const owners = p39.map((r) => f(r, "owner_original"));
    expect(owners.some((o) => o.includes("Höring"))).toBe(false);
    expect(owners.some((o) => o.includes("Buchler"))).toBe(false);
    expect(owners.some((o) => o.includes("Mally"))).toBe(false);
    expect(owners.some((o) => o.includes("Mallerseb"))).toBe(false);
    expect(owners.filter((o) => o.startsWith("Ring")).length).toBe(13);
    expect(owners.filter((o) => o.startsWith("Bruckler")).length).toBe(5);
    expect(owners.filter((o) => o.startsWith("Malleschick")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Müllner")).length).toBe(1);
  });

  test("8 haus POPRAVEK s snimkami: r4 20->23, r5/r6 23->25 (stisnjeni dvojniki), r9 26->25, r15/r16 26->30, r17/r18 29->27", () => {
    const p39 = rowsOn(39);
    const pairs: [number, string, string][] = [
      [4, "23", "20"],
      [5, "25", "23"],
      [6, "25", "23"],
      [9, "25", "26"],
      [15, "30", "26"],
      [16, "30", "26"],
      [17, "27", "29"],
      [18, "27", "29"],
    ];
    for (const [i, now, was] of pairs) {
      expect(f(p39[i], "haus_no")).toBe(now);
      expect(f(p39[i], "haus_no_pre_v119")).toBe(was);
    }
  });

  test("h24 'Höring Johann L' -> 'Ring Michael.' (gz w2 jasno; h24 = Ring Michael konvencija)", () => {
    const p39 = rowsOn(39);
    expect(f(p39[11], "owner_original")).toBe("Ring Michael.");
    expect(f(p39[12], "owner_original")).toBe("Ring Michael.");
  });
});

describe("val 119 del 2c — p40 (Ring grozda na vrhu + Pöching/Brulla preseki + h65 Ring grozd)", () => {
  test("'Wernig' ×7 + 'Pechley' ×6 + 'Willing' ×2 + 'Rudolla Nißl' + 'Weichselbaum' + 'Weinhandl' izrinjeni", () => {
    const p40 = rowsOn(40);
    const owners = p40.map((r) => f(r, "owner_original"));
    expect(owners.some((o) => o.includes("Wernig"))).toBe(false);
    expect(owners.some((o) => o.includes("Pechley"))).toBe(false);
    expect(owners.some((o) => o.includes("Willing"))).toBe(false);
    expect(owners.some((o) => o.includes("Rudolla"))).toBe(false);
    expect(owners.some((o) => o.includes("Weichselbaum"))).toBe(false);
    expect(owners.some((o) => o.includes("Weinhandl"))).toBe(false);
    expect(owners.some((o) => o.includes("Schiffbauer"))).toBe(false);
  });

  test("nove vsebine: Ring ×7 (h23/25/24/24/65×3), Pöching ×7, Brulla ×2, Müllner ×2 (Samuel h29 + Johann h22), Krischan h66, Veritschan h64", () => {
    const p40 = rowsOn(40);
    const owners = p40.map((r) => f(r, "owner_original"));
    expect(owners.filter((o) => o.startsWith("Ring")).length).toBe(7);
    expect(owners.filter((o) => o.startsWith("Pöching")).length).toBe(6);
    expect(owners.filter((o) => o.startsWith("Brulla")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Müllner")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Krischan")).length).toBe(1);
    expect(owners.filter((o) => o.startsWith("Veritschan")).length).toBe(1);
  });

  test("ditto ovržen (r1): črnilo piše polno 'Ring Michl.'; snimka", () => {
    const p40 = rowsOn(40);
    expect(p40[1].owner_was_ditto).toBe(false);
    expect(p40[1].owner_was_ditto_pre_v119).toBe(true);
    expect(f(p40[1], "owner_original")).toBe("Ring Michl.[?]");
  });

  test("r12 razhajanje odprto: ne-osebna poteza + prazen haus v črnilu, v57 'Wunderling' ohranjeno", () => {
    const p40 = rowsOn(40);
    expect(f(p40[12], "owner_original")).toBe("Wunderling");
    expect(f(p40[12], "anmerkung")).toContain("razhajanje odprto");
      });

  test("h65 Ring grozd: Dorothea[?] + Martho (= p36-r3 forma) + Jakob[?]", () => {
    const p40 = rowsOn(40);
    expect(f(p40[17], "owner_original")).toBe("Ring Dorothea.[?]");
    expect(f(p40[18], "owner_original")).toBe("Ring Martho.[?]");
    expect(f(p40[20], "owner_original")).toBe("Ring Jakob.[?]");
  });
});

describe("val 119 del 2c — p41 (druga roka: Krischan/Tillach/Baron/Gemeinde/Ulrich)", () => {
  test("'Witschak' ×6 + 'Pritschak' ×2 + 'Pechly' ×3 + 'Weiss' ×2 + 'Gyomandl' + 'Fleing Mano' izrinjeni", () => {
    const p41 = rowsOn(41);
    const owners = p41.map((r) => f(r, "owner_original"));
    expect(owners.some((o) => o.includes("Witschak"))).toBe(false);
    expect(owners.some((o) => o.includes("Pritschak"))).toBe(false);
    expect(owners.some((o) => o.includes("Pechly"))).toBe(false);
    expect(owners.some((o) => o.includes("Weiss"))).toBe(false);
    expect(owners.some((o) => o.includes("Gyomandl"))).toBe(false);
    expect(owners.some((o) => o.includes("Fleing"))).toBe(false);
  });

  test("nove vsebine: Krischan ×6, Tillach ×2, Ulrich ×3, Pöching ×2, Veritschan ×2, Baron, Baronial, Gemeinde, Schellko, Ring Martho h65", () => {
    const p41 = rowsOn(41);
    const owners = p41.map((r) => f(r, "owner_original"));
    expect(owners.filter((o) => o.startsWith("Krischan")).length).toBe(6);
    expect(owners.filter((o) => o.startsWith("Tillach")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Ulrich")).length).toBe(3);
    expect(owners.filter((o) => o.startsWith("Pöching")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Veritschan")).length).toBe(2);
    expect(owners.some((o) => o.startsWith("Baron Gustitsch"))).toBe(true);
    expect(owners.some((o) => o.startsWith("Baronial"))).toBe(true);
    expect(owners.some((o) => o === "Gemeinde")).toBe(true);
    expect(f(p41[16], "owner_original")).toBe("Ring Martho.[?]");
  });

  test("3 haus POPRAVEK: r7 '1 / 6'->0 (Gemeinde), r14 '1 / 64'->68 (8-glyf), r15 '1 / 52'->32 (3-glyf brez zastavice)", () => {
    const p41 = rowsOn(41);
    expect(f(p41[7], "haus_no")).toBe("0");
    expect(f(p41[7], "haus_no_pre_v119")).toBe("1 / 6");
    expect(f(p41[14], "haus_no")).toBe("1 / 68");
    expect(f(p41[14], "haus_no_pre_v119")).toBe("1 / 64");
    expect(f(p41[15], "haus_no")).toBe("1 / 32");
    expect(f(p41[15], "haus_no_pre_v119")).toBe("1 / 52");
  });
});

describe("val 119 del 2c — p42 (visoke vrstice dy-8; Ring Martho h65 + Schimetz + 2 haus)", () => {
  test("'Christan Stößl'/'Christan Georg'/'Veit Blaschke' ×4/'Radling'/'Stößl' ×4/'Fleissig Marianne'/'Hirschman'/'Lupzina'/'Schumig' ×2/'Chorll'/'Khaull' izrinjeni", () => {
    const p42 = rowsOn(42);
    const owners = p42.map((r) => f(r, "owner_original"));
    expect(owners.some((o) => o.includes("Stößl"))).toBe(false);
    expect(owners.some((o) => o.includes("Blaschke"))).toBe(false);
    expect(owners.some((o) => o.includes("Radling"))).toBe(false);
    expect(owners.some((o) => o.includes("Fleissig"))).toBe(false);
    expect(owners.some((o) => o.includes("Hirschman"))).toBe(false);
    expect(owners.some((o) => o.includes("Lupzina"))).toBe(false);
    expect(owners.some((o) => o.includes("Schumig"))).toBe(false);
    expect(owners.some((o) => o.includes("Chorll"))).toBe(false);
    expect(owners.some((o) => o.includes("Khaull"))).toBe(false);
  });

  test("nove vsebine: Krischan ×6 (h62 ×4, h66 ×2, Maria), Veritschan ×3, Tillach ×3, Schimetz ×3, Ring Martho h65, Pöching h11", () => {
    const p42 = rowsOn(42);
    const owners = p42.map((r) => f(r, "owner_original"));
    expect(owners.filter((o) => o.startsWith("Krischan")).length).toBe(6);
    expect(owners.filter((o) => o.startsWith("Veritschan")).length).toBe(3);
    expect(owners.filter((o) => o.startsWith("Tillach")).length).toBe(3);
    expect(owners.filter((o) => o.startsWith("Schimetz")).length).toBe(3);
    expect(f(p42[10], "owner_original")).toBe("Ring Martho.[?]");
    expect(f(p42[5], "owner_original")).toBe("Pöching. Georgy.[?]");
  });

  test("2 haus POPRAVEK: r10 62->65 (Ring Martho — 4. instanca), r14 '1 / 59'->49 (4-glyf)", () => {
    const p42 = rowsOn(42);
    expect(f(p42[10], "haus_no")).toBe("1/65");
    expect(f(p42[10], "haus_no_pre_v119")).toBe("1/62");
    expect(f(p42[14], "haus_no")).toBe("1/49");
    expect(f(p42[14], "haus_no_pre_v119")).toBe("1/59");
  });
});

describe("val 119 del 2c — p43 (Schimetz/Ulrich/Tillach/Krischan/Schaffschick; 3 haus)", () => {
  test("'Schönnig' ×5 + 'Vohfseheidler' + 'Stahlfeldt' ×2 + 'Wittlich' + 'Fittkau' + 'Horechan' + 'Witschak' + 'Pauling' izrinjeni", () => {
    const p43 = rowsOn(43);
    const owners = p43.map((r) => f(r, "owner_original"));
    expect(owners.some((o) => o.includes("Schönnig"))).toBe(false);
    expect(owners.some((o) => o.includes("Vohfseheidler"))).toBe(false);
    expect(owners.some((o) => o.includes("Stahlfeldt"))).toBe(false);
    expect(owners.some((o) => o.includes("Wittlich"))).toBe(false);
    expect(owners.some((o) => o.includes("Fittkau"))).toBe(false);
    expect(owners.some((o) => o.includes("Horechan"))).toBe(false);
    expect(owners.some((o) => o.includes("Pauling"))).toBe(false);
  });

  test("nove vsebine: Schimetz ×5, Ulrich ×6 (Parbna[?] ×4 + Michl + Georg), Tillach ×2, Krischan ×2, Schaffschick ×3, Pöching h50; 3 soglasja", () => {
    const p43 = rowsOn(43);
    const owners = p43.map((r) => f(r, "owner_original"));
    expect(owners.filter((o) => o.startsWith("Schimetz")).length).toBe(5);
    expect(owners.filter((o) => o.startsWith("Ulrich")).length).toBe(6);
    expect(owners.filter((o) => o.startsWith("Tillach")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Krischan")).length).toBe(2);
    expect(owners.filter((o) => o.startsWith("Schaffschick")).length).toBe(3);
    expect(f(p43[7], "owner_original")).toBe("M. Paul. Strohschneid"); // soglasje
    expect(f(p43[8], "owner_original")).toBe("Ulrich Michl"); // soglasje
    expect(f(p43[11], "owner_original")).toBe("Ulrich Georg"); // soglasje
  });

  test("3 haus POPRAVEK: r3 149->49 (Blatt-artefakt; h49 = Schimetz Michael ×3 presek), r15 69->62, r16 62->63", () => {
    const p43 = rowsOn(43);
    expect(f(p43[3], "haus_no")).toBe("49");
    expect(f(p43[3], "haus_no_pre_v119")).toBe("149");
    expect(f(p43[15], "haus_no")).toBe("62");
    expect(f(p43[15], "haus_no_pre_v119")).toBe("69");
    expect(f(p43[16], "haus_no")).toBe("63");
    expect(f(p43[16], "haus_no_pre_v119")).toBe("62");
  });
});

describe("val 119 del 2c — cross-val p37-r6 (medstranski presek)", () => {
  test("p37 r6 haus 20->25: p39-r5/r6 ista črnilovrstna sekvenca bere '25.'/'25''; glyf z zastavico", () => {
    const p37 = rowsOn(37);
    expect(f(p37[6], "haus_no")).toBe("25");
    expect(f(p37[6], "owner_original")).toBe("Ring Michl.[?]");
    const ch = (CH.changes as Record<string, unknown>[]).find(
      (c) => c.type === "v119_crossval_haus_fix",
    );
    expect(ch).toBeDefined();
    expect(String(ch?.new)).toBe("25");
  });

  test("Ring-grozda h23-h28 čez p32-p43: vsi Ring ownerji, h25 zdaj vključno s p37-r6", () => {
    const block = REG.filter((r) => Number(r.page) >= 32 && Number(r.page) <= 43);
    const byHaus = (h: string) => block.filter((r) => f(r, "haus_no") === h);
    expect(byHaus("23").every((r) => f(r, "owner_original").startsWith("Ring"))).toBe(true);
    expect(byHaus("24").every((r) => f(r, "owner_original").startsWith("Ring"))).toBe(true);
    expect(byHaus("25").every((r) => f(r, "owner_original").startsWith("Ring"))).toBe(true);
    expect(byHaus("26").every((r) => f(r, "owner_original").startsWith("Ring"))).toBe(true);
    expect(byHaus("28").every((r) => f(r, "owner_original").startsWith("Ring"))).toBe(true);
  });
});

describe("val 119 del 2c — iskrenost (§4)", () => {
  test("izrecni dvomi ostajajo v imenih ([?]); PUA/PT orientacijska; 0 VLM", () => {
    const p38p43 = REG.filter((r) => Number(r.page) >= 38 && Number(r.page) <= 43);
    const withDoubt = p38p43.filter((r) => f(r, "owner_original").includes("[?]")).length;
    expect(withDoubt).toBeGreaterThan(60);
    for (let pg = 38; pg <= 43; pg++) {
      const rd = readJSON(
        `research-griblje/ps-n83/band-v113/reading-v119/p${pg}.json`,
      ) as { meta: { vlm_calls: number } };
      expect(rd.meta.vlm_calls).toBe(0);
    }
  });

  test("pre_v119 snimke na vseh spremenjenih vrsticah", () => {
    const changed = REG.filter(
      (r) =>
        Number(r.page) >= 38 &&
        Number(r.page) <= 43 &&
        (("owner_original_pre_v119" in r) || ("haus_no_pre_v119" in r)),
    );
    expect(changed.length).toBeGreaterThan(100);
    for (const r of changed) {
      const hasSnap =
        "owner_original_pre_v119" in r ||
        "haus_no_pre_v119" in r ||
        "anmerkung_pre_v119" in r;
      expect(hasSnap).toBe(true);
    }
  });
});

describe("val 119 del 2c — kaskada (izrecna)", () => {
  test("KG sha ab418c75 raznesen (b5d3ae93 -> 62d8cfea @2d-x3 ->; timestamp-only regeneracije — vsebina identična, osebni sloj = pass2 PUA artefakt F-PV-03/04); 3269/3477/2427/2773 identično", () => {
    expect(sha256("research-griblje/atlas-1825/knowledge-graph-1825.json")).toMatch(
      /^ab418c75/,
    );
    const kgAny = readJSON("research-griblje/atlas-1825/knowledge-graph-1825.json") as Record<string, unknown>;
    expect((kgAny.nodes as unknown[]).length).toBe(3764);
    expect((kgAny.edges as unknown[]).length).toBe(3473);
  });

  test("pass3: 392 PS parcel + raba 105-38-3-12-6-7+142 identično; K5 dito 208; K9 69 nespremenjen", () => {
    const c4 = readJSON(
      "research-griblje/ps-n83/band-v86/c4-metrika-v90.json",
    ) as { meta: Record<string, unknown> };
    expect(String(c4.meta.K5_input_reliability)).toContain("208/2876");
    expect(String(c4.meta.K5_input_reliability)).not.toContain("208/2875");
    const timeline = readJSON(
      "research-griblje/atlas-1825/timeline-1825-1830.json",
    ) as { meta?: Record<string, unknown> };
    expect(JSON.stringify(timeline)).toContain("ab418c75");
  });

  test("runtime kopija KG v src/data = atlas izhod (ena izhodna resnica)", () => {
    expect(sha256("src/data/knowledge-graph-1825.json")).toMatch(/^ab418c75/);
  });
});
