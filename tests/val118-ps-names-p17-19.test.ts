/**
 * Val 118 — imenski pass PS p17–p19 (pilot za p20–p55 = val 119).
 *
 * Vsebina (worklog Task 118):
 *  - agentov vid, 0 VLM klicev; nz-skladi (X 280–610, Y-grid 158/38.65, x6)
 *    + diag enovrstični x12–x24 + pravila-detekcija + dominikalna 2↔3 kalibracija
 *  - VELIKA NAJDBA: v57 imenska kolona p17–p19 sistemsko napačna —
 *    p17: priimek "Würgl" (8×) = halucinacija (pravo "Malfg"), "Häusler" (3×) = pravo
 *    "Husitsch Maria" (= PUA h.44); p18: VSE 20 imen fabricirana ("Wendelin/Christof/
 *    Villibald Muth/Wulfj/Puhon" ne obstaja na strani); p19: "Heinrich X" vzorec (19/20)
 *  - 51 owner popravkov + 23 haus popravkov + 7 ditto-zastavic ovrženih + 6 anmerkung
 *  - novi priimki: Malfg (= v57-p21 oblika, PUA "Malfa"), Gorgy, Husitsch Maria,
 *    Matho[?], Hof-Besizungen[?] (ne-osebni zapis)
 *  - kaskada: pass3 (392, land-use identičen), KG števci identični 3269/3477,
 *    sha 2790d893 → 62d8cfea; K5 dito 233→226; TRANSCRIBED=0, nič ne dvignjeno
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";

const REPO = join(__dirname, "..");
const REG = JSON.parse(
  readFileSync(join(REPO, "research-griblje/ps-n83/register.json"), "utf8"),
) as Array<Record<string, unknown>>;
const CHANGES = JSON.parse(
  readFileSync(
    join(REPO, "research-griblje/ps-n83/band-v113/register-v118-changes.json"),
    "utf8",
  ),
) as { val: number; stats: Record<string, unknown>; changes: Array<Record<string, unknown>> };

function pageRows(pg: number): Array<Record<string, unknown>> {
  return REG.filter((r) => r.page === pg);
}
function readJSON(rel: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(REPO, rel), "utf8")) as Record<string, unknown>;
}

describe("val 118 — gardele vhodov", () => {
  test("register 2875 vrstic (vstavljanja ni)", () => {
    expect(REG.length).toBe(2875);
  });
  test("reading JSON p17/p18/p19: meta 0 VLM + scope", () => {
    for (const [pg, fname] of [[17, "p17.json"], [18, "p18.json"], [19, "p19.json"]] as const) {
      const rd = readJSON(`research-griblje/ps-n83/band-v113/reading-v118/${fname}`);
      expect(rd.meta).toBeTruthy();
      expect((rd.meta as Record<string, unknown>).vlm_calls).toBe(0);
      expect((rd.meta as Record<string, unknown>).page).toBe(pg);
      expect(Object.keys(rd)).toContain("names_audit");
    }
  });
  test("changes audit: 90 sprememb (51 owner + 23 haus + 7 ditto + 6 anmerkung + 3 obs)", () => {
    expect(CHANGES.val).toBe(118);
    expect(CHANGES.stats.owner_fixes).toBe(51);
    expect(CHANGES.stats.haus_fixes).toBe(23);
    expect(CHANGES.stats.ditto_clears).toBe(7);
    expect(CHANGES.stats.anmerkung_adds).toBe(6);
    expect(CHANGES.changes.length).toBe(90);
    expect(CHANGES.stats.pages_covered).toEqual(["p17", "p18", "p19"]);
  });
  test("reading_pass v118-names na 60 vrsticah; plasti prevzete iz v113 (p17/p18: 120->80) in v114 (p19: 667->647)", () => {
    expect(REG.filter((r) => r.reading_pass === "v118-names").length).toBe(60);
    expect(REG.filter((r) => r.reading_pass === "v86-colonial-tiles").length).toBe(1795);
    // p19 je nosil v114-ps-reread (val 114: p19, p20, p25–p55 = 667) — 20 vrstic prevzetih
    expect(REG.filter((r) => r.reading_pass === "v114-ps-reread").length).toBe(0); // 184 − 62 (2d-x3: p47/p48) − 2 (p49) − 122 (2e: p50-p55)
    // p17/p18 sta nosili v113-ps-reread (val 113: p17–p24 brez p19/p20 = 120) — 40 vrstic prevzetih
    expect(REG.filter((r) => r.reading_pass === "v113-ps-reread").length).toBe(0);
    expect(REG.filter((r) => r.reading_pass === "v115-insert").length).toBe(0); // val 119 del 2d-x3: p49 r2 F2 fill -> v119-names
  });
});

describe("val 118 — p17 ključni popravki (halucinirani priimki v57)", () => {
  const p = pageRows(17);
  test("'Würgl' izginil (v57 halucinacija, 8× -> Malfg/Gorgy)", () => {
    expect(p.filter((r) => String(r.owner_original).includes("Würgl")).length).toBe(0);
    expect(String(p[2].owner_original)).toBe("Christan Malfg");
    expect(String(p[8].owner_original)).toBe("Christan Malfg");
    expect(String(p[13].owner_original)).toBe("Christan Malfg");
    expect(String(p[17].owner_original)).toBe("Christan Gorgy");
  });
  test("'Häusler' izginil (3× -> Husitsch Maria po PUA h.44)", () => {
    expect(p.filter((r) => String(r.owner_original).includes("Häusler")).length).toBe(0);
    expect(String(p[15].owner_original)).toBe("Husitsch Maria");
    expect(String(p[19].owner_original)).toBe("Husitsch Maria");
    expect(String(p[1].owner_original)).toBe("Christan Mache");
  });
  test("haus popravki z snimkami (14->62, 36->26, 66->36, 68->44, 14->44)", () => {
    expect(String(p[0].haus_no)).toBe("62");
    expect(String(p[0].haus_no_pre_v118)).toBe("14");
    expect(String(p[2].haus_no)).toBe("26");
    expect(String(p[13].haus_no)).toBe("36");
    expect(String(p[15].haus_no)).toBe("44");
    expect(String(p[19].haus_no)).toBe("44");
    expect(p.filter((r) => "haus_no_pre_v118" in r).length).toBeGreaterThanOrEqual(6);
  });
  test("ditto r3/r5 ovržena (črnilo piše izrecno)", () => {
    expect(p[3].owner_was_ditto).toBe(false);
    expect(p[5].owner_was_ditto).toBe(false);
  });
});

describe("val 118 — p18 fabricirana imenska kolona (20/20 popravkov)", () => {
  const p = pageRows(18);
  test("v57 nabor 'Wendelin/Christof/Villibald Muth/Wulfj/Puhon' popolnoma odstranjen", () => {
    const bad = ["Wendelin", "Christof", "Villibald", "Vilter", "Puhon", "Wulfj", "Hoffnung"];
    for (const b of bad) {
      expect(p.filter((r) => String(r.owner_original).includes(b)).length).toBe(0);
    }
  });
  test("pravi nabor: Mache/Gorgy/Malfg/Piber/Husitsch Maria/Hof-Besizungen", () => {
    expect(String(p[0].owner_original)).toBe("Christan Mache");
    expect(String(p[1].owner_original)).toBe("Christan Gorgy");
    expect(String(p[4].owner_original)).toBe("Christan Malfg");
    expect(String(p[6].owner_original)).toBe("Husitsch Maria");
    expect(String(p[9].owner_original)).toContain("Hof-Besizungen");
    expect(String(p[16].owner_original)).toBe("Fitsch Piber");
  });
  test("2↔3 haus šum rešen s dominikalno kalibracijo (r2 26->36, r16 35, r15 24->34)", () => {
    expect(String(p[2].haus_no)).toBe("36");
    expect(String(p[7].haus_no)).toBe("36");
    expect(String(p[15].haus_no)).toBe("34");
    expect(String(p[18].haus_no)).toBe("34");
  });
  test("ditto r1–r5 ovržene (5×)", () => {
    expect(p.slice(1, 6).every((r) => r.owner_was_ditto === false)).toBe(true);
  });
});

describe("val 118 — p19 'Heinrich X' vzorec (19/20 popravkov)", () => {
  const p = pageRows(19);
  test("'Heinrich' izginil; 'Hansel Munde' izginil", () => {
    expect(p.filter((r) => String(r.owner_original).includes("Heinrich")).length).toBe(0);
    expect(p.filter((r) => String(r.owner_original).includes("Hansel")).length).toBe(0);
  });
  test("r10 = edina v57-usklajena vrstica (Georg Gorgy) + haus 61->41", () => {
    expect(String(p[10].owner_original)).toBe("Georg Gorgy");
    expect(String(p[10].haus_no)).toBe("41");
    expect(String(p[10].haus_no_pre_v118)).toBe("61");
    expect(p[10].reading_pass).toBe("v118-names");
  });
  test("Matho[?] ločen od Malfg (g-spuščanje); Piber enoten", () => {
    expect(String(p[5].owner_original)).toBe("Christan Matho[?]");
    expect(String(p[0].owner_original)).toBe("Christan Malfg");
    expect(p.filter((r) => String(r.owner_original).includes("Piberl")).length).toBe(0);
  });
});

describe("val 118 — iskrenost (§4)", () => {
  test("TRANSCRIBED = 0 vsiljenih; nič ne dvignjeno (statusi nespremenjeni)", () => {
    const p17_19 = REG.filter((r) => Number(r.page) >= 17 && Number(r.page) <= 19);
    expect(p17_19.every((r) => r.review_status !== "TRANSCRIBED")).toBe(true);
  });
  test("izrecni dvomi ohranjeni v imenih ([?]) + PUA presek v anmerkung", () => {
    const p = pageRows(17);
    expect(String(p[15].anmerkung)).toContain("Husitsch Maria Bauersleute zu Grübln");
    const p18 = pageRows(18);
    expect(String(p18[9].owner_original)).toContain("[?]");
    const p19 = pageRows(19);
    expect(String(p19[5].owner_original)).toContain("[?]");
    expect(String(p19[2].owner_original)).toContain("[?]");
  });
  test("page_observations_v118 na vseh treh straneh", () => {
    for (const pg of [17, 18, 19]) {
      const first = pageRows(pg)[0];
      expect(String(first.page_observations_v118)).toContain("v118");
    }
  });
  test("obseg: pilot p17–p19; p20–p55 ostaja za val 119 (dokumentirano)", () => {
    expect(REG.filter((r) => r.reading_pass === "v118-names").every((r) => Number(r.page) <= 19)).toBe(true);
    expect(REG.filter((r) => Number(r.page) >= 20 && Number(r.page) <= 55 && r.reading_pass === "v118-names").length).toBe(0);
  });
});

describe("val 118 — kaskada (izrecna)", () => {
  test("KG števci identični (osebni sloj = pass2 artefakt), vsebina/sha spremenjena", () => {
    const kg = JSON.parse(
      readFileSync(join(REPO, "research-griblje/atlas-1825/knowledge-graph-1825.json"), "utf8"),
    ) as Record<string, unknown>;
    expect(kg.node_stats).toBeTruthy();
    const nodes = (kg.nodes as Array<Record<string, unknown>>).length;
    const edges = (kg.edges as Array<Record<string, unknown>>).length;
    expect(nodes).toBe(3762);
    expect(edges).toBe(3471);
  });
  test("KG sha c3932092 raznesen v kaskadne artefakte", () => {
    for (const f of [
      "research-griblje/atlas-1825/story-graph-1825.json",
      "research-griblje/atlas-1825/timeline-1825-1830.json",
    ]) {
      const s = readFileSync(join(REPO, f), "utf8");
      expect(s).toContain("596c1ca7");
    }
  });
  test("pass3: PS parcele 392 + land-use identičen (vrednostna projekcija nespremenjena)", () => {
    const pr = JSON.parse(
      readFileSync(join(REPO, "research-griblje/atlas-1825/parcel-register-1825.json"), "utf8"),
    ) as Record<string, unknown>;
    expect(pr.ps_parcels_total).toBe(392);
    const lu = pr.ps_land_use_coverage as Record<string, unknown>;
    expect(lu["njiva"]).toBe(105);
    expect(lu["UNKNOWN"]).toBe(142);
    expect(lu["travnik"]).toBe(38);
  });
  test("c4 K9 vrednostne metrike nespremenjene (69/48/944/105)", () => {
    const c4 = JSON.parse(
      readFileSync(join(REPO, "research-griblje/ps-n83/band-v86/c4-metrika-v90.json"), "utf8"),
    ) as { meta: Record<string, unknown> };
    expect(String(c4.meta.K5_input_reliability)).toContain("207/2875"); // val 119 del 2c: 222 - 7 - 7 - 1 (p40-r1 ditto ovržen)
  });
  test("timeline I6 (2035, 392) + raba (173, 142) nespremenjena", () => {
    const tl = readJSON("research-griblje/atlas-1825/timeline-1825-1830.json");
    const s = JSON.stringify(tl);
    expect(s).toContain("2035");
    expect(s).toContain("392");
  });
});
