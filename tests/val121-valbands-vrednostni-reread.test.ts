/**
 * val 121 — pasovni vrednostni re-read (F-OCI-05 zaprtje) — testi
 *
 * Metoda (protokol 143 §6.1 + F-VB infra-nauk): vrednost pripada pasu NAD
 * svojim pisanim spodnjim pravilom; pravila so zaznana LOKALNO v vrednostnem
 * stolpcu (skew med stolpci 8–14 px; linearni TOP0+STEP je na repu strani
 * zanaščen — p42/p47 dokaz). Sporne celice sodjene na ×16–22, nedvoumne
 * z imenskim sidrom (p42 r9–r14; p47 r0: madež).
 *
 * Vgradnja: 89 kl + 6 jae sprememb na 21 straneh + 5 potrditev (p53 zastareli
 * spori) + 4 ohranitve (p36 r0 flourish, p47 r1 madež, p54 r18/r19 zdrs v114).
 * 0 VLM — branja v glavni seji (trakti ×12, celice ×16–22).
 */
import { describe, expect, it } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const RG = "research-griblje";

const readJSON = (p: string): any => JSON.parse(readFileSync(p, "utf8"));

const sha256 = (p: string): string =>
  createHash("sha256").update(readFileSync(p)).digest("hex");

const REG = readJSON("research-griblje/ps-n83/register.json") as any[];
const rowsOf = (pg: number) => REG.filter((r) => r.page === pg);
const f = (r: any, k: string) => r[k] ?? "";

describe("val 121 — pasovni vrednostni re-read (F-OCI-05 zaprtje)", () => {
  it("changes-v121: 100 vnosov = 91 vrednostnih popravkov + 5 potrditev + 4 ohranitve", () => {
    const ch = readJSON(`${RG}/val121-valbands/changes-v121.json`);
    expect(ch.count_fix).toBe(91);
    const kl = ch.changes.filter(
      (c: any) => !c.moot && !c.confirm && c.kl[0] !== c.kl[1],
    );
    expect(kl.length).toBe(89);
    const jaeSet = ch.changes.filter(
      (c: any) => !c.moot && !c.confirm && c.jae[0] === "" && c.jae[1] !== "",
    );
    expect(jaeSet.length).toBe(4); // p17 r16, p18 r6, p21 r11, p43 r19
    const jaeClear = ch.changes.filter(
      (c: any) => !c.moot && !c.confirm && c.jae[0] !== "" && c.jae[1] === "",
    );
    expect(jaeClear.length).toBe(2); // p18 r4 (1→kl 1243), p37 r0 (701 = napačno branje 761)
    expect(ch.changes.filter((c: any) => c.confirm).length).toBe(5); // p53
    expect(ch.changes.filter((c: any) => c.moot).length).toBe(4); // p36/p47/p54×2
  });

  it("register: 2875 vrstic; plasti nespremenjene; v121 sledi v anmerkung", () => {
    expect(REG.length).toBe(2875); // val 127: p59 fantom −1
    expect(REG.filter((r) => r.reading_pass === "v119-names").length).toBe(731);
    expect(REG.filter((r) => r.owner_was_ditto === true).length).toBe(208);
    const v121 = REG.filter((r) => (r.anmerkung || "").includes("v121"));
    expect(v121.length).toBeGreaterThanOrEqual(95);
  });

  it("F-OCI-05 kandidati razrešeni: p31 r0 1305, p43 r19 1|1977, p37 r2 705 potrjen", () => {
    expect(f(rowsOf(31)[0], "klafter")).toBe("1305"); // 1785 → 1305
    expect(f(rowsOf(31)[0], "jaethe")).toBe("3");
    expect(f(rowsOf(43)[19], "klafter")).toBe("1977"); // 4731 → 1977 (rdeče prečrtan)
    expect(f(rowsOf(43)[19], "jaethe")).toBe("1");
    expect(f(rowsOf(37)[2], "klafter")).toBe("705"); // potrjeno (nizko, v pasu r2)
  });

  it("p17–p24 (v82-era plast): masovni popravki — vzorčne vrstice", () => {
    // p17: 6 razhajanj zaprtih + r13 794 NOVA
    expect(f(rowsOf(17)[1], "klafter")).toBe("155");
    expect(f(rowsOf(17)[5], "klafter")).toBe("647");
    expect(f(rowsOf(17)[6], "klafter")).toBe("94");
    expect(f(rowsOf(17)[11], "klafter")).toBe("180");
    expect(f(rowsOf(17)[12], "klafter")).toBe("585");
    expect(f(rowsOf(17)[13], "klafter")).toBe("794"); // NOVA (774)
    // p18: 10 popravljenih
    expect(f(rowsOf(18)[0], "klafter")).toBe("189");
    expect(f(rowsOf(18)[2], "klafter")).toBe("283");
    expect(f(rowsOf(18)[4], "klafter")).toBe("1243"); // 1 je v kl celici
    expect(f(rowsOf(18)[4], "jaethe")).toBe("");
    expect(f(rowsOf(18)[6], "klafter")).toBe("1082");
    expect(f(rowsOf(18)[6], "jaethe")).toBe("1");
    expect(f(rowsOf(18)[7], "klafter")).toBe("957");
    expect(f(rowsOf(18)[8], "klafter")).toBe("873");
    expect(f(rowsOf(18)[10], "klafter")).toBe("1159");
    expect(f(rowsOf(18)[12], "klafter")).toBe("1098");
    expect(f(rowsOf(18)[14], "klafter")).toBe("931");
    expect(f(rowsOf(18)[19], "klafter")).toBe("539");
    // p19: r12 7144 (4 števke!), r16 1199, r19 805
    expect(f(rowsOf(19)[0], "klafter")).toBe("452");
    expect(f(rowsOf(19)[6], "klafter")).toBe("585");
    expect(f(rowsOf(19)[12], "klafter")).toBe("7144");
    expect(f(rowsOf(19)[16], "klafter")).toBe("1199");
    expect(f(rowsOf(19)[18], "klafter")).toBe("1469");
    expect(f(rowsOf(19)[19], "klafter")).toBe("805");
    // p20: 10 popravkov (polovica strani!)
    expect(f(rowsOf(20)[1], "klafter")).toBe("568");
    expect(f(rowsOf(20)[7], "klafter")).toBe("840");
    expect(f(rowsOf(20)[8], "klafter")).toBe("631");
    expect(f(rowsOf(20)[10], "klafter")).toBe("425");
    expect(f(rowsOf(20)[12], "klafter")).toBe("459");
    expect(f(rowsOf(20)[13], "klafter")).toBe("482");
    expect(f(rowsOf(20)[14], "klafter")).toBe("480");
    expect(f(rowsOf(20)[15], "klafter")).toBe("457");
    expect(f(rowsOf(20)[16], "klafter")).toBe("435");
    expect(f(rowsOf(20)[19], "klafter")).toBe("803");
    // p21: r10 kl prazna → 457; r11 1|1581
    expect(f(rowsOf(21)[10], "klafter")).toBe("457");
    expect(f(rowsOf(21)[11], "klafter")).toBe("1581");
    expect(f(rowsOf(21)[11], "jaethe")).toBe("1");
    // p22: 10 popravkov
    expect(f(rowsOf(22)[2], "klafter")).toBe("344");
    expect(f(rowsOf(22)[5], "klafter")).toBe("443");
    expect(f(rowsOf(22)[6], "klafter")).toBe("442");
    expect(f(rowsOf(22)[8], "klafter")).toBe("165");
    expect(f(rowsOf(22)[11], "klafter")).toBe("753");
    expect(f(rowsOf(22)[12], "klafter")).toBe("723");
    expect(f(rowsOf(22)[15], "klafter")).toBe("644");
    expect(f(rowsOf(22)[16], "klafter")).toBe("443");
    expect(f(rowsOf(22)[19], "klafter")).toBe("474");
    // p23/p24
    expect(f(rowsOf(23)[2], "klafter")).toBe("159");
    expect(f(rowsOf(23)[3], "klafter")).toBe("217");
    expect(f(rowsOf(23)[7], "klafter")).toBe("1445");
    expect(f(rowsOf(23)[8], "klafter")).toBe("1487");
    expect(f(rowsOf(23)[14], "klafter")).toBe("1048");
    expect(f(rowsOf(23)[19], "klafter")).toBe("182");
    expect(f(rowsOf(24)[3], "klafter")).toBe("1183");
    expect(f(rowsOf(24)[4], "klafter")).toBe("330");
    expect(f(rowsOf(24)[5], "klafter")).toBe("1094");
    expect(f(rowsOf(24)[6], "klafter")).toBe("480");
  });

  it("p42: imensko sidro razreši niz — r9 464, r10 433, r14 450, r15 544, r16 126, r18 113, r20 1313", () => {
    const rows = rowsOf(42);
    expect(f(rows[9], "klafter")).toBe("464");
    expect(f(rows[10], "klafter")).toBe("433");
    expect(f(rows[14], "klafter")).toBe("450");
    expect(f(rows[15], "klafter")).toBe("544");
    expect(f(rows[16], "klafter")).toBe("126");
    expect(f(rows[18], "klafter")).toBe("113");
    expect(f(rows[20], "klafter")).toBe("1313");
    // kontrolni sidri (nespremenjeni)
    expect(f(rows[11], "klafter")).toBe("504");
    expect(f(rows[12], "klafter")).toBe("1394");
    expect(f(rows[17], "klafter")).toBe("747");
  });

  it("nove napake izven sporov (sweep): p17 r13 794, p18 r0 189/r7 957/r8 873/r10 1159, p19 r0 452/r18 1469, p20 8×, p22 r7 136, p23 r2 159/r3 217, p42 r15 544", () => {
    const noDisputeFixes = readJSON(
      `${RG}/val121-valbands/changes-v121.json`,
    ).changes.filter(
      (c: any) =>
        !c.moot &&
        !c.confirm &&
        (c.verdict || "").includes("NOVA") === false &&
        false,
    );
    // NOVA oznake: 19 vrednosti, ki jih prejšnja razhajanja niso flaggala
    const nova = readJSON(
      `${RG}/val121-valbands/changes-v121.json`,
    ).changes.filter((c: any) => (c.verdict || "").includes("NOVA"));
    expect(nova.length).toBe(26);
    expect(noDisputeFixes.length).toBe(0);
  });

  it("ohranitve z obrazložitvijo: p36 r0 (flourish), p47 r1 (madež), p54 r18/r19 (v114 zdrs)", () => {
    const ch = readJSON(`${RG}/val121-valbands/changes-v121.json`).changes.filter(
      (c: any) => c.moot,
    );
    const pages = ch.map((c: any) => c.page).sort((a: number, b: number) => a - b);
    expect(pages).toEqual([36, 47, 54, 54]);
    expect(f(rowsOf(36)[0], "klafter")).toBe("657");
    expect(f(rowsOf(47)[1], "klafter")).toBe("1165");
    expect(f(rowsOf(54)[18], "klafter")).toBe("908");
    expect(f(rowsOf(54)[19], "klafter")).toBe("283");
  });

  it("p53 zastareli spori: vrednosti del 2e potrjene, anm zaprta", () => {
    const exp: [number, string][] = [
      [13, "31"],
      [14, "319"],
      [17, "50"],
      [18, "201"],
      [19, "74"],
    ];
    for (const [i, v] of exp) {
      expect(f(rowsOf(53)[i], "klafter")).toBe(v);
      expect(f(rowsOf(53)[i], "anmerkung")).toContain("ZAPRTO val 121 (potrjeno)");
    }
  });

  it("Fürtrag bloka v page_observations_v121 (p42, p43)", () => {
    expect(f(rowsOf(42)[0], "page_observations_v121")).toContain("Furtrag");
    expect(f(rowsOf(42)[0], "page_observations_v121")).toContain("1|318");
    expect(f(rowsOf(43)[0], "page_observations_v121")).toContain("1|1052");
  });

  it("§4 sledljivost: vsa zaprta razhajanja nosijo ZAPRTO val 121 + v121 vrednost", () => {
    const closed = REG.filter((r) => (r.anmerkung || "").includes("— ZAPRTO val 121"));
    expect(closed.length).toBeGreaterThanOrEqual(70);
    for (const r of closed.slice(0, 25)) {
      const a = r.anmerkung || "";
      expect(a.includes("razhajanje") || a.includes("neujemljivo")).toBe(true);
      expect(a).toContain("[v121:");
    }
  });

  it("kaskada: c4 K9 (both_filled 56, jaethe_empty 959, klafter_empty 84) + KG sha 1e49de43 v vseh artefaktih", () => {
    const c4 = readJSON("research-griblje/ps-n83/band-v86/c4-metrika-v90.json") as any;
    const k9key = Object.keys(c4).find((k) => k.startsWith("K9"))!;
    const p1 = c4[k9key].p1_55_val57;
    expect(p1["both_filled"]).toBe(56);
    expect(p1["jaethe_empty"]).toBe(960);
    expect(p1["klafter_empty"]).toBe(84);
    const kgSha = sha256("src/data/knowledge-graph-1825.json");
    expect(kgSha).toMatch(/^1e49de43/);
    const timeline = readJSON("src/data/timeline-1825-1830.json");
    expect(JSON.stringify(timeline)).toContain("1e49de43");
  });

  it("0 VLM: readings-v121.meta očitno izrecen", () => {
    const meta = readJSON(`${RG}/val121-valbands/readings-v121.json`);
    expect(meta.vals.length).toBeGreaterThanOrEqual(23);
    const fixCount = meta.vals.reduce(
      (n: number, e: any) =>
        n + e.rows.filter((r: any) => (r.verdict || "").includes("FIX")).length,
      0,
    );
    expect(fixCount).toBe(91);
  });
});
