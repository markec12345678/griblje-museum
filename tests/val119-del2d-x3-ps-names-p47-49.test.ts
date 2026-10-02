/**
 * Val 119 del 2d-x3 — CELOVITI RE-READ PS p47–p49 z DVOJNIM SIDROM (ime+vrednost skupaj) — ISSUE #42 §4/§14.
 *
 * Rešitev F-NA-01 (protokol 139 §2): parzelle-stevilka + vrednostni pas (klafter na spodnjem
 * pravilu pasu) kot DVOJNI sidr; programsko detektirana pasova pravila (X760-885).
 *
 * Rezultati:
 *   p47: vrednostna plast 1:1 ✓ (stevkni popravki r2 283→253, r12 438→436); imenska plast po x2
 *        auditu (F-NA-01 swap/shift od r5 — sidrani popravki)
 *   p48: NOVO F-NA-02 — vrednostna plast zamaknjena +1 IN v napačni koloni (v114 'jaethe' =
 *        pravzaprav klafter) → polni rebuild: vse jae pociscene, klafter ← pas
 *   p49: F-NA-01 REŠEN — 22 pasov: 921–929, polpas 929½ (F5, prečrtan, kl 97, brez imena),
 *        930–940, Fürtrag pas (F6, jae 7 | kl 1073); v114 vrednosti od r10 = +1 zamik + misreada
 *        381/376 → polni rebuild; ertrag plast enako zamaknjena (926=1-1367, 936=1-853)
 *
 * Vgradnja: build-register-v119-del2d-x3.py (fail-fast guardi; dvojni tek prepovedan);
 * 64 vrstic na reading_pass 'v119-names'; kaskada izrecna (c4/KG/story/timeline/coverage).
 * Iskrenost §4: 0 VLM; TRANSCRIBED = 0; snimke *_pre_v119 add-only.
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
  "research-griblje/ps-n83/band-v113/register-v119-del2d-x3-changes.json",
) as { val: string; stats: Record<string, unknown>; changes: { type: string }[] };

const f = (r: Record<string, unknown>, k: string) => String(r[k] ?? "");
function rowsOn(page: number): Reg {
  return REG.filter((r) => r.page === page);
}

describe("val 119 del 2d-x3 — gardele vhodov (p47–p49 vgradnja, dvojni sidr)", () => {
  test("register: 2875 vrstic; changes 206 = 57 owner + 44 haus + 71 value + 25 anmerkung + 3 halfrow + 2 fuertrag + 3 page_obs + 1 bookkeeping", () => {
    expect(REG.length).toBe(2875);
    expect(CH.val).toBe("119-del2d-x3");
    expect(CH.stats.owner_changes).toBe(59);
    expect(CH.stats.haus_changes).toBe(46);
    expect(CH.stats.value_changes).toBe(72);
    expect(CH.stats.anmerkung_adds).toBe(25);
    expect(CH.stats.open_discrepancies).toBe(16);
    expect(CH.stats.rows_covered).toBe(64);
    expect(CH.stats.pages_covered).toEqual(["p47", "p48", "p49"]);
    const t = (k: string) => CH.changes.filter((c) => c.type === k).length;
    expect(t("v119_owner_fix")).toBe(57);
    expect(t("v119_haus_fix")).toBe(44);
    expect(t("v119_value_fix")).toBe(71);
    expect(t("anmerkung_add")).toBe(25);
    expect(t("v119_x3_halfrow_clear")).toBe(3); // F5: owner+haus+klafter
    expect(t("v119_x3_fuertrag_clear")).toBe(2); // F6: owner+haus
    expect(t("page_observations_v119")).toBe(3);
    expect(t("x2_bookkeeping_note")).toBe(1);
    expect(CH.changes.length).toBe(206);
  });

  test("reading_pass plasti: v119-names 731 (609 + 122 po del 2e); v114 0 (122 − 122 @2e: PS p25-p55 pokrite); v115 0; v118 60; v86 1795; ditto 207", () => {
    const n = (p: string) => REG.filter((r) => r.reading_pass === p).length;
    expect(n("v119-names")).toBe(731);
    expect(n("v114-ps-reread")).toBe(0);
    expect(n("v115-insert")).toBe(0);
    expect(n("v118-names")).toBe(60);
    expect(n("v86-colonial-tiles")).toBe(1795);
    expect(REG.filter((r) => r.owner_was_ditto === true).length).toBe(207);
    expect(REG.every((r) => r.review_status !== "TRANSCRIBED")).toBe(true);
  });

  test("readings x3: 0 VLM; register_rows 21/21/22; status 'celovito branje ime+vrednost (x3)'; values_audit poln", () => {
    for (const [pg, rows] of [
      [47, 21],
      [48, 21],
      [49, 22],
    ] as [number, number][]) {
      const rd = readJSON(
        `research-griblje/ps-n83/band-v113/reading-v119d/p${pg}.json`,
      ) as {
        meta: { vlm_calls: number; register_rows: number; status: string; del: string };
        names_audit: Record<string, unknown>;
        values_audit: Record<string, unknown>;
      };
      expect(rd.meta.vlm_calls).toBe(0);
      expect(rd.meta.del).toBe("2d-x3");
      expect(rd.meta.register_rows).toBe(rows);
      expect(rowsOn(pg).length).toBe(rows);
      expect(Object.keys(rd.names_audit).length).toBe(rows);
      expect(Object.keys(rd.values_audit).length).toBe(rows);
      expect(rd.meta.status).toContain("celovito branje ime+vrednost (x3)");
    }
  });

  test("p47: vrednostna plast 1:1 ✓ — stevkni popravki r2 283→253, r12 438→436; imenske sidrske popravke (Krischan trio, Stabelz h2, Schim- h1)", () => {
    const p47 = rowsOn(47);
    expect(f(p47[2], "klafter")).toBe("253");
    expect(f(p47[2], "klafter_pre_v119")).toBe("283");
    expect(f(p47[2], "owner_original")).toBe("Krischan Matthe.");
    expect(f(p47[2], "haus_no")).toBe("69");
    expect(f(p47[12], "klafter")).toBe("436");
    expect(f(p47[12], "klafter_pre_v119")).toBe("438");
    expect(f(p47[12], "owner_original")).toBe("Schimitbek Matthe.[?]");
    expect(f(p47[12], "haus_no")).toBe("1");
    // F-NA-01 imenski swap/shift od r5 — sidrani popravki
    expect(f(p47[5], "owner_original")).toBe("Stabelz Soan.[?]");
    expect(f(p47[5], "haus_no")).toBe("2");
    expect(f(p47[6], "owner_original")).toBe("Krischan Matthe.");
    expect(f(p47[6], "haus_no")).toBe("69");
    expect(f(p47[7], "owner_original")).toBe("Schimitlbeck Matthe.[?]");
    expect(f(p47[7], "haus_no")).toBe("1");
    // r20 (901): v114 'Christan Bräutig' brez glyfne podlage — precedens p34-r20/p40-r12, razhajanje odprto
    expect(f(p47[20], "owner_original")).toBe("Christan Bräutig");
    expect(f(p47[20], "anmerkung")).toContain("razhajanje odprto");
  });

  test("p48: NOVO F-NA-02 — vrednostna plast zamaknjena +1 in v napačni koloni (v114 jae = klafter) → vseh 21 jae pociscenih; klafter ← pas", () => {
    const p48 = rowsOn(48);
    expect(p48.every((r) => f(r, "jaethe") === "")).toBe(true);
    expect(p48.filter((r) => f(r, "jaethe_pre_v119") !== "").length).toBe(21);
    // dokaz zamika +1: stare v114 'jaethe' = x3 klafter za eno vrstico višje
    expect(f(p48[1], "klafter")).toBe("12"); // prava 912-vrstica (v115 'jaethe 12' @r2 = snimka)
    expect(f(p48[2], "klafter")).toBe("733");
    expect(f(p48[12], "klafter")).toBe("1492"); // stevkni popravek (v114 1490)
    expect(f(p48[15], "klafter")).toBe("155"); // stevkni popravek (v114 185)
    expect(f(p48[17], "klafter")).toBe("159"); // stevkni popravek (v114 189)
    expect(f(p48[19], "klafter")).toBe("280");
    // 901 (r20): polja prazna; stray 5|58 v pasu 921 = opuščen poskus (prava 921 = p49-r0)
    expect(f(p48[20], "klafter")).toBe("");
    expect(f(p48[20], "anmerkung")).toContain("opuščen poskus");
    expect(f(p48[20], "ertrag_fl")).toBe("");
    // 881 (r0): visoko '1534' = opuščen prvi poskus; v114 jae 1904 = misread
    expect(f(p48[0], "klafter")).toBe("219");
    expect(f(p48[0], "anmerkung")).toContain("opuščen prvi poskus");
    // vgrajena v115 vrstica r2 zdaj prebrana (x3 names audit)
    expect(f(p48[2], "owner_original")).toBe("Krischan Matthe.");
    expect(f(p48[2], "reading_pass")).toBe("v119-names");
  });

  test("p49: F-NA-01 REŠEN — 22 pasov; r9 = polpas 929½ (F5), r21 = Fürtrag (F6); v114 vrednosti od r10 +1 zamik → rebuild", () => {
    const p49 = rowsOn(49);
    expect(p49.length).toBe(22);
    // poravnana cona r0–r8: vrednosti identične, samo stevkni popravek r8 381→241 (x20)
    expect(f(p49[8], "klafter")).toBe("241");
    expect(f(p49[8], "klafter_pre_v119")).toBe("381");
    // F5: r9 = polpas 929½ — vsa polja prazna, v114 vsebina (Pessing Georg h11, kl 281) snimljena
    expect(f(p49[9], "owner_original")).toBe("");
    expect(f(p49[9], "haus_no")).toBe("");
    expect(f(p49[9], "klafter")).toBe("");
    expect(f(p49[9], "owner_original_pre_v119")).toBe("Pessing Georg");
    expect(f(p49[9], "klafter_pre_v119")).toBe("281");
    expect(f(p49[9], "anmerkung")).toContain("F5");
    expect(f(p49[9], "anmerkung")).toContain("929½");
    // re-sidrana cona r10–r20 = 930–940
    const kls = ["92", "821", "56", "295", "975", "556", "316", "606", "658", "398", ""];
    kls.forEach((k, i) => expect(f(p49[10 + i], "klafter")).toBe(k));
    // snimke = v114 (zamaknjena) vrednosti: r17=376 (misread+zamik), r18=606 (937-ova), r19=658 (938-ova), r20=398 (939-ova)
    expect(f(p49[17], "klafter_pre_v119")).toBe("376");
    expect(f(p49[18], "klafter_pre_v119")).toBe("606");
    expect(f(p49[19], "klafter_pre_v119")).toBe("658");
    expect(f(p49[20], "klafter_pre_v119")).toBe("398");
    // F6: r21 = Fürtrag pas — brez parcele/imena; jae 7 | kl 1073 dokumentirano v anmerkung
    expect(f(p49[21], "owner_original")).toBe("");
    expect(f(p49[21], "haus_no")).toBe("");
    expect(f(p49[21], "owner_original_pre_v119")).toBe("Ploner Franzigen");
    expect(f(p49[21], "anmerkung")).toContain("F6");
    expect(f(p49[21], "anmerkung")).toContain("1073");
    // F2 fill: v115 preklicana 923 = 'Heide Marko.' h3 (forma ×5)
    expect(f(p49[2], "owner_original")).toBe("Heide Marko.");
    expect(f(p49[2], "haus_no")).toBe("3");
    expect(f(p49[2], "jaethe")).toBe("2");
    expect(f(p49[2], "klafter")).toBe("973");
  });

  test("p49 ertrag plast: enako +1 zamaknjena — 926=1-1367, 936=1-853; 927/937 pocisceni (v114 1.264/1.883)", () => {
    const p49 = rowsOn(49);
    expect(f(p49[1], "ertrag_fl")).toBe("3");
    expect(f(p49[1], "ertrag_kr")).toBe("364");
    expect(f(p49[5], "ertrag_fl")).toBe("1");
    expect(f(p49[5], "ertrag_kr")).toBe("1367");
    expect(f(p49[6], "ertrag_fl")).toBe("");
    expect(f(p49[6], "ertrag_kr")).toBe("");
    expect(f(p49[16], "ertrag_fl")).toBe("1");
    expect(f(p49[16], "ertrag_kr")).toBe("853");
    expect(f(p49[17], "ertrag_fl")).toBe("");
    expect(f(p49[17], "ertrag_kr")).toBe("");
    expect(f(p49[17], "ertrag_fl_pre_v119")).toBe("1");
    expect(f(p49[17], "ertrag_kr_pre_v119")).toBe("883");
  });

  test("p49 meta: mapping_x3 + structural_findings_x3 dokumentirata F5/F6 in pozicijsko poravnavo", () => {
    const rd = readJSON(
      "research-griblje/ps-n83/band-v113/reading-v119d/p49.json",
    ) as { meta: Record<string, unknown> };
    const mapping = rd.meta.mapping_x3 as Record<string, string>;
    expect(mapping.register_row).toContain("r9=929½");
    expect(mapping.register_row).toContain("r21=Fürtrag");
    expect(mapping.audit_glitch).toContain("+2");
    expect(String(rd.meta.structural_findings_x3)).toContain("F5");
    expect(String(rd.meta.structural_findings_x3)).toContain("F6");
    expect(String(rd.meta.values_note)).toContain("F-NA-01 REŠEN");
  });

  test("snimke *_pre_v119 add-only; razhajanja 99 (55 + 16 + 28 @2e)", () => {
    expect(REG.filter((r) => "owner_original_pre_v119" in r).length).toBe(530);
    expect(REG.filter((r) => "jaethe_pre_v119" in r).length).toBe(26); // 21 (p48 F-NA-02) + 5 @2e
    expect(REG.filter((r) => "klafter_pre_v119" in r).length).toBe(72); // 35 + 37 @2e
    const withOpen = REG.filter((r) => f(r, "anmerkung").includes("razhajanje odprto")).length;
    expect(withOpen).toBe(99);
  });
});

describe("val 119 del 2d-x3 — kaskada (izrecna)", () => {
  test("KG sha b3e9797e (b3e9797e @2e -> val 119 del 3 PUA↔PS sync: osebna plast 488→981; RESIDENCE TP-029 zdaj 4 per-name osebe: R-03425..R-03428); 3762/3471/2427/2773", () => {
    expect(sha256("src/data/knowledge-graph-1825.json")).toMatch(/^b3e9797e/);
    expect(sha256("research-griblje/atlas-1825/knowledge-graph-1825.json")).toMatch(
      /^b3e9797e/,
    );
    const kg = readJSON("research-griblje/atlas-1825/knowledge-graph-1825.json") as {
      nodes: unknown[];
      edges: { relation_id: string; from_entity: string; relation_type?: string; to_entity?: string }[];
      node_stats: Record<string, number>;
      edge_stats: Record<string, number>;
      invariant_violations: unknown[];
    };
    expect(kg.nodes.length).toBe(3762);
    expect(kg.edges.length).toBe(3471);
    expect(kg.node_stats.PARCEL).toBe(2427);
    expect(kg.edge_stats.HAS_PARCEL).toBe(2773);
    expect(kg.invariant_violations).toEqual([]);
    // val 119 del 3: wohnort Zagorje vrstice se sedaj vežejo na per-name osebe iz tiste (page,haus) —
    // Lubreschibek Maathe. / Heide Marko. / Krischan Matthe. / Weidner Mathä. (v119 imena; prej 2 hišni osebi PER-0177/PER-0235)
    const zag = kg.edges.filter((e) => e.relation_type === "RESIDENCE_DOCUMENTED_AT" && e.to_entity === "TP-029");
    expect(zag.length).toBe(4);
    expect(zag.map((e) => e.from_entity).sort()).toEqual(["PER-0345", "PER-0347", "PER-0348", "PER-0402"]);
  });

  test("c4-metrika regenerirana: register sha sledi; K5 dito 207 (bloki 2608); K9 p1-55 jaethe_100_1599 69→53, gt1599 16→15", () => {
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
    expect(c4.meta.K5_input_reliability).toContain("bloki = 2607"); // 2608 − 1 @2e
    const loose = c4 as unknown as Record<string, Record<string, Record<string, number>>>;
    const k9key = Object.keys(loose).find((k) => k.startsWith("K9"));
    expect(k9key).toBeDefined();
    const p1 = loose[k9key!].p1_55_val57;
    expect(p1["jaethe_plain_100_1599"]).toBe(52);
    expect(p1["jaethe_plain_gt1599"]).toBe(1); // p48 1904 = misread opuščenega poskusa 1534
    expect(p1["jaethe_empty"]).toBe(959); // 961 @2e − 3 @val121 (p17 r16, p18 r6, p21 r11, p43 r19 set; p18 r4 clear)
    expect(p1["klafter_empty"]).toBe(84); // 87 − 2 @2e
    expect(REG.filter((r) => r.owner_was_ditto === true).length).toBe(207);
  });

  test("story-graph/timeline/coverage kaskada: 3269/3477; timeline kg_sha256 = KG sha (ena izhodna resnica)", () => {
    const sg = readJSON("src/data/story-graph-1825.json") as {
      entities: unknown[];
      relations: unknown[];
      stats?: { entities?: number; relations?: number };
    };
    expect(sg.entities.length).toBe(3762);
    expect(sg.relations.length).toBe(3471);
    const kgSha = sha256("src/data/knowledge-graph-1825.json");
    const tl = readJSON("src/data/timeline-1825-1830.json") as {
      provenance?: { kg_sha256?: string };
    };
    expect(tl.provenance?.kg_sha256).toBe(kgSha);
    const a = sha256("src/data/story-graph-1825.json");
    const b = sha256("research-griblje/atlas-1825/story-graph-1825.json");
    expect(a).toBe(b);
  });
});
