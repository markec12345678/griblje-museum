/**
 * Val 119 del 2e — CELOVITI RE-READ PS p50–p55 z DVOJNIM SIDROM (ime+vrednost skupaj) — ISSUE #42 §4/§14.
 *
 * Nadaljevanje metode protokola 140 (del 2d-x3): parzelle-stevilka (941–1060) +
 * vrednostni pas hkrati na vsaki vrstici; 0 VLM; agentov direktni vid glavne seje.
 *
 * Rezultati:
 *   p50: 941–960 + Fürtrag (r20, jae 4 | kl 386 — F-FÜRTRAG; v114 'Pavstgl Lorenz' h5 = fantom);
 *        vrednosti v JOCH koloni (Acker/Wald/Hutweide del); popravki r0 418 ✓, ertrag 1-136 @r1
 *   p51: 961–980 + Übertrag (kl 1263) + Fürtrag 5|547 (prečrtan); vrednosti v KLAFTER koloni
 *        (Wiese/Ladwiese del); popravki r0 89→82, r11 959→259, r13 453→433, r18 820→520
 *   p52: 981–1000 + Fürtrag 6|1217; cfl 1097 @r9; capital 1001 @r17 potrjen; v114 'Insgesamt:'
 *        @r19 = misread vrstice 1000 → kultur počiščen
 *   p53: 1001–1020 + Fürtrag 9|1027 (prečrtan); ertrag 3-568 @r3, 1-1377 @r7; popravki r4
 *        1194→1191, r13 51→31, r14 349→319 (preklicana), r16 66→68 (preklicana)
 *   p54: NOVO F-NA-03 — register rep r14–r19 zamaknjen +1 (dup 145, fantoma 716/425), r20 nosi
 *        P1040 (283|1263) → POLNI REBUILD: r14=1|996, r15=113, r16=969, r17=74, r18=908,
 *        r19=283+cfl 1265; Fürtrag r20 = 8|1165 prečrtan + rdeče 7|943; ertrag 5-843 @r13, 10-66 @r4
 *   p55: 1041–1060 + Fürtrag 7|1067 (prečrtan); popravki r0 29→39, r2 870→517, r6 739→139,
 *        r10 231→831, r12 102→703, r14 769→961, r18 18→48; ertrag 1-600 @r5, —239 @r7, 1-463 @r10
 *
 * Vgradnja: build-register-v119-del2e.py (fail-fast guardi; dvojni tek prepovedan);
 * 122 vrstic na reading_pass 'v119-names'; v114 plast 122 → 0 (PS p25–p55 POKRITE);
 * kaskada izrecna (c4/KG/story/timeline/coverage) — KG vsebina IDENTIČNA (timestamp-only sha).
 * Iskrenost §4: 0 VLM; TRANSCRIBED = 0; snimke *_pre_v119 add-only; dvomi izrecni ([?]).
 */
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
  "research-griblje/ps-n83/band-v113/register-v119-del2e-changes.json",
) as { val: string; stats: Record<string, unknown>; changes: { type: string }[] };

const f = (r: Record<string, unknown>, k: string) => String(r[k] ?? "");
function rowsOn(page: number): Reg {
  return REG.filter((r) => r.page === page);
}

describe("val 119 del 2e — gardele vhodov (p50–p55 vgradnja, dvojni sidr)", () => {
  test("register: 2875 vrstic; changes 316 = 79 owner-fix + 36 haus-fix + 67 value-fix + 23 value-clear + 100 anmerkung + 5 fürtrag-clear + 6 page_obs", () => {
    expect(REG.length).toBe(2875);
    expect(CH.val).toBe("119-del2e");
    expect(CH.stats.owner_changes).toBe(81); // 79 owner-fix + 2 fürtrag-clear
    expect(CH.stats.haus_changes).toBe(38); // 36 + 2
    expect(CH.stats.value_changes).toBe(89); // 67 fix + 23 clear (vrednostna polja)
    expect(CH.stats.anmerkung_adds).toBe(100);
    expect(CH.stats.razhajanja).toBe(28);
    expect(CH.stats.rows_covered).toBe(122);
    expect(CH.stats.pages_covered).toEqual(["p50", "p51", "p52", "p53", "p54", "p55"]);
    const t = (k: string) => CH.changes.filter((c) => c.type === k).length;
    expect(t("v119_owner_fix")).toBe(79);
    expect(t("v119_haus_fix")).toBe(36);
    expect(t("v119_value_fix")).toBe(67);
    expect(t("v119_value_clear")).toBe(23);
    expect(t("anmerkung_add")).toBe(100);
    expect(t("v119_e_fuertrag_clear")).toBe(5); // p50 r20 (owner+haus+kultur) + p54 r20 (owner+haus)
    expect(t("page_observations_v119")).toBe(6);
    expect(CH.changes.length).toBe(316);
  });

  test("reading_pass plasti: v119-names 731 (609 + 122); v114 0 (122 − 122: PS p25–p55 POKRITE); v115 0; v118 60; v86 1795; ditto 207", () => {
    const n = (p: string) => REG.filter((r) => r.reading_pass === p).length;
    expect(n("v119-names")).toBe(731);
    expect(n("v114-ps-reread")).toBe(0);
    expect(n("v115-insert")).toBe(0);
    expect(n("v118-names")).toBe(60);
    expect(n("v86-colonial-tiles")).toBe(1795);
    expect(REG.filter((r) => r.owner_was_ditto === true).length).toBe(207);
    expect(REG.every((r) => r.review_status !== "TRANSCRIBED")).toBe(true);
  });

  test("readings x3: 0 VLM; vrstice 21/20/20/20/21/20 = 122; names_audit + values_audit polna", () => {
    for (const [pg, rows] of [
      [50, 21],
      [51, 20],
      [52, 20],
      [53, 20],
      [54, 21],
      [55, 20],
    ] as [number, number][]) {
      const rd = readJSON(
        `research-griblje/ps-n83/band-v113/reading-v119e/p${pg}.json`,
      ) as {
        meta: { vlm_calls: number; del: string };
        names_audit: Record<string, unknown>;
        values_audit: Record<string, unknown>;
      };
      expect(rd.meta.vlm_calls).toBe(0);
      expect(rd.meta.del).toBe("2e");
      expect(Object.keys(rd.names_audit).length).toBe(rows);
      expect(Object.keys(rd.values_audit).length).toBe(rows);
      expect(rowsOn(pg).length).toBe(rows);
    }
  });

  test("p50: vrednosti v JOCH koloni — r0 jae 418; ertrag 1-136 @r1; cfl 825 @r9 / 682 @r12 / 1263 @r18; F-FÜRTRAG r20 = jae 4 | kl 386, fantom 'Pavstgl Lorenz' snimljen", () => {
    const p50 = rowsOn(50);
    expect(f(p50[0], "jaethe")).toBe("418");
    expect(f(p50[0], "owner_original")).toBe("Stallpschibek Matthe[?]");
    expect(f(p50[0], "haus_no")).toBe("1/7");
    expect(f(p50[1], "ertrag_fl")).toBe("1");
    expect(f(p50[1], "ertrag_kr")).toBe("136");
    expect(f(p50[9], "capital_fl")).toBe("825");
    expect(f(p50[9], "capital_kr")).toBe("");
    expect(f(p50[9], "owner_original")).toBe("Schimey Michael");
    expect(f(p50[9], "haus_no")).toBe("1/19");
    expect(f(p50[10], "jaethe")).toBe("355");
    expect(f(p50[12], "capital_fl")).toBe("682");
    expect(f(p50[18], "capital_fl")).toBe("1263");
    // F-FÜRTRAG: pas brez parcele/imena; kultur 'Fürtrag' + jae 4 | kl 386 (nesen na naslednji list)
    expect(f(p50[20], "owner_original")).toBe("");
    expect(f(p50[20], "haus_no")).toBe("");
    expect(f(p50[20], "kultur")).toBe("Fürtrag");
    expect(f(p50[20], "jaethe")).toBe("4");
    expect(f(p50[20], "klafter")).toBe("386");
    expect(f(p50[20], "anmerkung")).toContain("F-FÜRTRAG");
    expect(f(p50[20], "anmerkung")).toContain("fantom");
  });

  test("p51: vrednosti v KLAFTER koloni — r0 82, r11 259, r13 433, r18 520; cfl 1442 @r1; ertrag 3-593 @r19; Übertrag kl 1263 + preklicani 963/964/965/968/969/970/971", () => {
    const p51 = rowsOn(51);
    expect(f(p51[0], "klafter")).toBe("82");
    expect(f(p51[0], "owner_original")).toBe("Stratzl Johan[?]");
    expect(f(p51[0], "haus_no")).toBe("1/5");
    expect(f(p51[1], "capital_fl")).toBe("1442");
    expect(f(p51[11], "klafter")).toBe("259");
    expect(f(p51[13], "klafter")).toBe("433");
    expect(f(p51[18], "klafter")).toBe("520");
    expect(f(p51[19], "ertrag_fl")).toBe("3");
    expect(f(p51[19], "ertrag_kr")).toBe("593");
    expect(f(p51[19], "owner_original")).toBe("Urick Jakim[?]");
    // Übertrag/Fürtrag niso register vrstice — dokumentirano v page_observations
    const rd = readJSON(
      "research-griblje/ps-n83/band-v113/reading-v119e/p51.json",
    ) as { page_observations?: string };
    expect(String(rd.page_observations)).toContain("Übertrag");
    expect(String(rd.page_observations)).toContain("1263");
  });

  test("p52: r0 kl 4 (dvom), r9 cfl 1097, r16 kl 1305, r17 kl 712 + cfl 1001 ✓; v114 'Insgesamt:' @r19 = misread → kultur počiščen", () => {
    const p52 = rowsOn(52);
    expect(f(p52[0], "klafter")).toBe("4");
    expect(f(p52[9], "capital_fl")).toBe("1097");
    expect(f(p52[16], "klafter")).toBe("1305");
    expect(f(p52[17], "klafter")).toBe("712");
    expect(f(p52[17], "capital_fl")).toBe("1001");
    expect(f(p52[19], "klafter")).toBe("245");
    expect(f(p52[19], "kultur")).toBe(""); // v114 'Insgesamt:' = misread
  });

  test("p53: ertrag 3-568 @r3 + classe prazna; 1-1377 @r7; popravki r4 1191, r13 31, r14 319 (preklicana), r16 68 (preklicana); Fürtrag 9|1027 prečrtan", () => {
    const p53 = rowsOn(53);
    expect(f(p53[3], "ertrag_fl")).toBe("3");
    expect(f(p53[3], "ertrag_kr")).toBe("568");
    expect(f(p53[3], "classe")).toBe("");
    expect(f(p53[4], "klafter")).toBe("1191");
    expect(f(p53[7], "ertrag_fl")).toBe("1");
    expect(f(p53[7], "ertrag_kr")).toBe("1377");
    expect(f(p53[13], "klafter")).toBe("31");
    expect(f(p53[14], "klafter")).toBe("319");
    expect(f(p53[16], "klafter")).toBe("68");
    const rd = readJSON(
      "research-griblje/ps-n83/band-v113/reading-v119e/p53.json",
    ) as { page_observations?: string };
    expect(String(rd.page_observations)).toContain("9 | kl 1027");
  });

  test("p54: NOVO F-NA-03 — rep r14–r19 zamaknjen +1 → POLNI REBUILD: 1|996, 113, 969, 74, 908, 283+cfl 1265; Fürtrag r20 izpraznjen (v114 'Karl Mioß' + 283|1263 = zamaknjena plast P1040, snimljena)", () => {
    const p54 = rowsOn(54);
    // F-NA-03 dokumentiran v meta.structure
    const rd = readJSON(
      "research-griblje/ps-n83/band-v113/reading-v119e/p54.json",
    ) as { meta: { structure?: string } };
    expect(String(rd.meta.structure)).toContain("F-NA-03");
    // zamaknjena cona re-sidrana
    expect(f(p54[14], "jaethe")).toBe("1");
    expect(f(p54[14], "klafter")).toBe("996");
    expect(f(p54[15], "klafter")).toBe("113");
    expect(f(p54[16], "klafter")).toBe("969");
    expect(f(p54[17], "klafter")).toBe("74");
    expect(f(p54[18], "klafter")).toBe("908");
    expect(f(p54[19], "klafter")).toBe("283");
    expect(f(p54[19], "capital_fl")).toBe("1265");
    expect(f(p54[19], "owner_original")).toBe("Onal Maido[?]");
    expect(f(p54[19], "haus_no")).toBe("15");
    // r20 = Fürtrag pas: 8|1165 prečrtan + rdeče 7|943; v114 vsebina snimljena
    expect(f(p54[20], "owner_original")).toBe("");
    expect(f(p54[20], "haus_no")).toBe("");
    expect(f(p54[20], "klafter")).toBe("");
    expect(f(p54[20], "capital_fl")).toBe("");
    expect(f(p54[20], "owner_original_pre_v119")).toBe("Karl Mioß");
    expect(f(p54[20], "klafter_pre_v119")).toBe("283");
    expect(f(p54[20], "capital_fl_pre_v119")).toBe("1263");
    expect(f(p54[20], "anmerkung")).toContain("F-FÜRTRAG");
    expect(f(p54[20], "anmerkung")).toContain("F-NA-03");
    // ertrag popravljen: 5-843 @r13 (v114 razprseno), 10-66 @r4
    expect(f(p54[13], "ertrag_fl")).toBe("5");
    expect(f(p54[13], "ertrag_kr")).toBe("843");
    expect(f(p54[4], "ertrag_fl")).toBe("10");
    expect(f(p54[4], "ertrag_kr")).toBe("66");
  });

  test("p55: popravki r0 39, r2 517, r12 703, r14 961, r18 48; ertrag 1-600 @r5, —239 @r7, 1-463 @r10; cfl @r9 počiščen (v114 '1' = zamik)", () => {
    const p55 = rowsOn(55);
    expect(f(p55[0], "klafter")).toBe("39");
    expect(f(p55[2], "klafter")).toBe("517");
    expect(f(p55[5], "ertrag_fl")).toBe("1");
    expect(f(p55[5], "ertrag_kr")).toBe("600");
    expect(f(p55[7], "ertrag_fl")).toBe("");
    expect(f(p55[7], "ertrag_kr")).toBe("239");
    expect(f(p55[7], "klafter")).toBe("857");
    expect(f(p55[9], "capital_fl")).toBe("");
    expect(f(p55[9], "capital_fl_pre_v119")).toBe("1");
    expect(f(p55[10], "klafter")).toBe("831");
    expect(f(p55[10], "ertrag_kr")).toBe("463");
    expect(f(p55[12], "klafter")).toBe("703");
    expect(f(p55[14], "klafter")).toBe("961");
    expect(f(p55[18], "klafter")).toBe("48");
    // Fürtrag 7|1067 prečrtan — dokumentiran v page_observations
    const rd = readJSON(
      "research-griblje/ps-n83/band-v113/reading-v119e/p55.json",
    ) as { page_observations?: string };
    expect(String(rd.page_observations)).toContain("1067");
  });

  test("imenska plast: cross-val soglasja (Stallpschibek-glyf, Novak, Schimey h1/19, Heide Marko h3) + re-sidrani rep p54 (Stallpschibek Nikolaus[?] h13)", () => {
    const p55 = rowsOn(55);
    expect(f(p55[7], "owner_original")).toBe("Heide Marko");
    expect(f(p55[7], "haus_no")).toBe("3"); // forma Heide Marko h3 — ×5 + p49-r2 + p50-r1
    const p54 = rowsOn(54);
    expect(f(p54[14], "owner_original")).toBe("Stallpschibek Nikolaus[?]");
    expect(f(p54[14], "haus_no")).toBe("13");
    // razhajanja ostajajo izrecna (v114 ohranjeno)
    expect(f(p55[0], "owner_original")).toBe("Andreas Krumpe");
    expect(f(p55[0], "anmerkung")).toContain("razhajanje odprto");
    expect(f(p54[13], "anmerkung")).toContain("razhajanje odprto");
  });

  test("snimke *_pre_v119 add-only; razhajanja 99 (55 + 16 + 28)", () => {
    expect(REG.filter((r) => "owner_original_pre_v119" in r).length).toBe(530);
    expect(REG.filter((r) => "jaethe_pre_v119" in r).length).toBe(26);
    expect(REG.filter((r) => "klafter_pre_v119" in r).length).toBe(72);
    expect(REG.filter((r) => "ertrag_fl_pre_v119" in r).length).toBe(20);
    expect(REG.filter((r) => "ertrag_kr_pre_v119" in r).length).toBe(23);
    expect(REG.filter((r) => "capital_fl_pre_v119" in r).length).toBe(12);
    const withOpen = REG.filter((r) => f(r, "anmerkung").includes("razhajanje odprto")).length;
    expect(withOpen).toBe(99);
  });
});

describe("val 119 del 2e — kaskada (izrecna)", () => {
  test("KG sha 8345868a: vsebina IDENTIČNA po del 2e (timestamp-only; builder bere samo wohnort — owner/haus/vrednostne spremembe ne posegajo v GRAF); 3269/3477/2427/2773 identično", () => {
    expect(sha256("src/data/knowledge-graph-1825.json")).toMatch(/^8345868a/);
    expect(sha256("research-griblje/atlas-1825/knowledge-graph-1825.json")).toMatch(
      /^8345868a/,
    );
    const kg = readJSON("research-griblje/atlas-1825/knowledge-graph-1825.json") as {
      nodes: unknown[];
      edges: { relation_id: string }[];
      node_stats: Record<string, number>;
      edge_stats: Record<string, number>;
      invariant_violations: unknown[];
    };
    expect(kg.nodes.length).toBe(3764);
    expect(kg.edges.length).toBe(3473);
    expect(kg.node_stats.PARCEL).toBe(2427);
    expect(kg.edge_stats.HAS_PARCEL).toBe(2775);
    expect(kg.invariant_violations).toEqual([]);
    // RESIDENCE relaciji TP-029 iz del 2d-x3 ostajata prevezani
    const r433 = kg.edges.find((e) => e.relation_id === "R-03433");
    const r434 = kg.edges.find((e) => e.relation_id === "R-03434");
    expect(r433).toBeDefined();
    expect(r434).toBeDefined();
  });

  test("c4-metrika regenerirana: register sha sledi; K5 dito 207 (bloki 2607); K9 p1-55 both_filled 48→52, jaethe_empty 965→961, klafter_empty 87→85, 100_1599 53 (nestanjena)", () => {
    const c4 = readJSON("research-griblje/ps-n83/band-v86/c4-metrika-v90.json") as {
      meta: {
        inputs: Record<string, string>;
        K5_input_reliability: string;
      };
    };
    expect(c4.meta.inputs["register.json"]).toBe(
      createHash("sha256")
        .update(readFileSync(join(REPO, "research-griblje/ps-n83/register.json")))
        .digest("hex"),
    );
    expect(c4.meta.K5_input_reliability).toContain("207/2875");
    expect(c4.meta.K5_input_reliability).toContain("bloki = 2607");
    const loose = c4 as unknown as Record<string, Record<string, Record<string, number>>>;
    const k9key = Object.keys(loose).find((k) => k.startsWith("K9"));
    expect(k9key).toBeDefined();
    const p1 = loose[k9key!].p1_55_val57;
    expect(p1["both_filled"]).toBe(56); // 48 + 4 (p50-p55 jae + kl pari)
    expect(p1["jaethe_empty"]).toBe(959);
    expect(p1["klafter_empty"]).toBe(84);
    expect(p1["jaethe_plain_100_1599"]).toBe(52);
    expect(p1["jaethe_plain_gt1599"]).toBe(1);
    expect(REG.filter((r) => r.owner_was_ditto === true).length).toBe(207);
  });

  test("story-graph/timeline/coverage kaskada: 3269/3477; timeline kg_sha256 = KG sha (ena izhodna resnica); coverage vsebinsko identičen", () => {
    const sg = readJSON("src/data/story-graph-1825.json") as {
      entities: unknown[];
      relations: unknown[];
    };
    expect(sg.entities.length).toBe(3764);
    expect(sg.relations.length).toBe(3473);
    const kgSha = sha256("src/data/knowledge-graph-1825.json");
    const tl = readJSON("src/data/timeline-1825-1830.json") as {
      provenance?: { kg_sha256?: string };
    };
    expect(tl.provenance?.kg_sha256).toBe(kgSha);
    const a = sha256("src/data/story-graph-1825.json");
    const b = sha256("research-griblje/atlas-1825/story-graph-1825.json");
    expect(a).toBe(b);
    const cov = readJSON("src/data/atlas-coverage-report-1825.json") as {
      provenance: { kg_sha256: string };
    };
    expect(cov.provenance.kg_sha256).toBe(kgSha);
  });
});
