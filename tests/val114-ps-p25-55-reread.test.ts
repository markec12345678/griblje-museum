/**
 * Val 114 — vrednostni re-read PS p25–p55 (+ strukturni re-read p19/p20 + p34 forenzika) — ISSUE #42 §4/§14.
 *
 * Metoda: agentov direktni vid (0 VLM klicev) — z3 skladovni izrezki + imensko-vrednostni
 * trakovi z ravilom + ciljani ×9–×14 zoomi + primerjalni trakovi števk.
 *
 * KLJUČNE NAJDBE:
 *  1. POMIK VRSTIC iz val 113 (p19 "7 sidrov +1", p20 "delni pomik r9–r11") OVRŽEN —
 *     z3 grid artifakt (mreza zamaknjena, ne stran). Direktni imensko-vrednostni trak:
 *     p19 11 sidrov + p20 5 sidrov na ISTIH indeksih.
 *  2. STRUKTURNI COLLAPSE: p40/p48/p49/p34 imajo 21 fizicnih vrstic, v57 20 — v57 je
 *     izpustil vrstico (p40 prazno p12 + preklicano p13; p48 "12"; p49 preklicano
 *     "2|973"; p34 ~"70" pred Fürtragom) in zamaknil prikaz. BREZ vstavljanja
 *     (2871 guard) — popravki preko mapiranja + page_observations_v114.
 *  3. F-PV-07 stolpci: p40/p41/p55 (19+19+19 premestitev jae→klf) + p28/p29/p30/p34/p37
 *     (page-level). F-PV-07-SPLIT razcepi: p40 r11 1|599, p41 r16 1|77, p47 r20 1|695,
 *     p55 r17 1|329 + markerji ze-obstojecih parov (25 skupaj).
 *  4. POPRAVEK: 111 vrednostnih popravkov (recu. v57 napake: 1↔7, 1↔4, 3↔5, 2↔3 …).
 *  5. Odprta razhajanja (44+): masovne rdeče revizije p42/p43/p51; v57 nepojasnjene
 *     vrednosti (p42 r10 1322, p52 r19 "10|7817", p19 r12 1164/r16 1329 …).
 *
 * KASKADA (izrecna, testno vodena): PS parcele 577 → 393 (−176: 163 premestitev +
 * 25 SPLIT markerjev); KG PARCEL 2612 → 2436, HAS_PARCEL 2914 → 2775, vozlišča 3454 →
 * 3278, vezi 3618 → 3479 (sha 376e2b27); timeline I6 PUA 2035 / PS 391 / raba 173+142;
 * coverage PARTIAL 1252 → 1076; c4 K9 jaethe_plain_100_1599 192 → 72, gt1599 22 → 16.
 *
 * Iskrenost (§4): TRANSCRIBED = 0 (0 VLM); vsa dvomna branja izrecno ODPRTA.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const ROOT = join(import.meta.dir, "..");
const REG = JSON.parse(readFileSync(join(ROOT, "research-griblje/ps-n83/register.json"), "utf8")) as Record<
  string,
  unknown
>[];
const CHANGES = JSON.parse(
  readFileSync(join(ROOT, "research-griblje/ps-n83/band-v113/register-v114-changes.json"), "utf8"),
) as { val: number; stats: Record<string, number>; changes: unknown[] };

const byPage = (pg: number) => REG.filter((r) => r["page"] === pg);
const f = (r: Record<string, unknown>, k: string) => String(r[k] ?? "");
const sha = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

describe("val 114 — gardele in infrastruktura", () => {
  test("register: 2875 vrstic (val 115: +4 vstavljene p34/p40/p48/p49), 139 v88, 1795 v86 (val 116: p142 +40), 265 v112, 80 v113 (val 118: p17/p18 -> v118-names) — nedotaknjeno", () => {
    expect(REG.length).toBe(2875);
    const v88 = REG.filter((r) => "v88_status" in r || r["jk_review"] === "v88-digit-split-UNRESOLVED");
    expect(v88.length).toBe(139);
    expect(REG.filter((r) => r["reading_pass"] === "v86-colonial-tiles").length).toBe(1795); // val 116: 1755 + 40 (p142)
    expect(REG.filter((r) => r["reading_pass"] === "v112-ps-reread").length).toBe(265);
    expect(REG.filter((r) => r["reading_pass"] === "v113-ps-reread").length).toBe(0);
  });

  test("changes audit: val 114, 417 sprememb (167 moves + 111 popravkov + 31 split markerjev + 124 opomb + 3 haus + 2 pocistki)", () => {
    expect(CHANGES.val).toBe(114);
    expect(CHANGES.changes.length).toBe(417);
    expect(CHANGES.stats.moves).toBe(167);
    expect(CHANGES.stats.value_fixes).toBe(111);
    expect(CHANGES.stats.split_markers).toBe(31);
    expect(CHANGES.stats.anmerkung_adds).toBe(124);
    expect(CHANGES.stats.haus_fixes).toBe(3);
    expect(CHANGES.stats.clears).toBe(2);
  });

  test("vseh 33 reading JSONov comittanih (p19, p20, p25–p55) z meta val 114 + 0 VLM", () => {
    const pages = [19, 20, ...Array.from({ length: 31 }, (_, i) => i + 25)];
    for (const p of pages) {
      const d = JSON.parse(
        readFileSync(join(ROOT, `research-griblje/ps-n83/band-v113/reading-v114/p${p}.json`), "utf8"),
      ) as { meta: { val: number; method: string } };
      expect(d.meta.val).toBe(114);
      expect(d.meta.method).toContain("agentov direktni vid");
    }
  });

  test("reading_pass v114-ps-reread: 0 vrstic (p25–p31 + p33–p39 + p41–p43 po delih val 119; p32–p55 po val 119 del 2b+2c+2d-x2+2d-x3+2e; p19 = 20 prevzetih v118-names, val 118)", () => {
    expect(REG.filter((r) => r["reading_pass"] === "v114-ps-reread").length).toBe(0); // val 119 del 2e: p50-p55 = zadnjih 122
  });
});

describe("val 114 — p19/p20: POMIK iz val 113 OVRŽEN", () => {
  test("p19: 11 sidrov 1:1 — page_observations_v114 korekcija v113 trditve", () => {
    const obs = f(byPage(19)[0], "page_observations_v114");
    expect(obs).toContain("OVRŽEN");
    expect(obs).toContain("11 sidrov");
    expect(obs).toContain("432=r0");
    expect(obs).toContain("1169=r18");
  });

  test("p19 vrednosti na svojih indeksih (sidri)", () => {
    const rows = byPage(19);
    expect(f(rows[0], "klafter")).toBe("452"); // val 121: 432 → 452 (srednja 5 z zastavico)
    expect(f(rows[1], "klafter")).toBe("440");
    expect(f(rows[5], "klafter")).toBe("637");
    expect(f(rows[15], "klafter")).toBe("776");
    expect(f(rows[18], "klafter")).toBe("1469"); // val 121: 1169 → 1469 (druga 4 s prečico)
  });

  test("p19 POPRAVEK: r3 582, r8 318, r17 234; split popavek r9 '1 639'", () => {
    const rows = byPage(19);
    expect(f(rows[3], "klafter")).toBe("582");
    expect(f(rows[8], "klafter")).toBe("318");
    expect(f(rows[17], "klafter")).toBe("234");
    expect(f(rows[9], "klafter")).toBe("1 639");
    expect(f(rows[3], "klafter_pre_v114")).toBe("392");
  });

  test("p19 razhajanja r6, r12, r16, r19 ZAPRTA v val 121 (vrednosti: 585, 7144, 1199, 805)", () => {
    for (const [i, v] of [[6, "585"], [12, "7144"], [16, "1199"], [19, "805"]] as const) {
      expect(f(byPage(19)[i], "anmerkung")).toContain("ZAPRTO val 121");
      expect(f(byPage(19)[i], "klafter")).toBe(v);
    }
    expect(f(byPage(19)[12], "anmerkung")).toMatch(/pre[cč]rt/);
  });

  test("p20: 5 sidrov 1:1 + POPRAVEK r2 336, r5 337 (potrditev v113 sidrov)", () => {
    const obs = f(byPage(20)[0], "page_observations_v114");
    expect(obs).toContain("OVRŽEN");
    expect(obs).toContain("535=r9");
    const rows = byPage(20);
    expect(f(rows[2], "klafter")).toBe("336");
    expect(f(rows[2], "klafter_pre_v114")).toBe("736");
    expect(f(rows[5], "klafter")).toBe("337");
    expect(f(rows[5], "klafter_pre_v114")).toBe("237");
    expect(f(rows[9], "klafter")).toBe("535");
    expect(f(rows[11], "klafter")).toBe("444");
  });
});

describe("val 114 — strukturna forenzika: izpuščene vrstice (brez vstavljanja)", () => {
  test("p40: 21 vrstic (v114 obs) — v57 izpustil prazno p12 + preklicano p13; val 115: +1 vstavljena p13 med r12 in r14 → 22 vrstic; p14–p20 zdaj r14–r20", () => {
    const obs = f(byPage(40)[0], "page_observations_v114");
    expect(obs).toContain("21 vrstic");
    expect(obs).toContain("721–740");
    expect(obs).toContain("VSTAVLJANJE");
    // mapirani popravki vgrajeni (indeksi val 115: +1 od r13 naprej)
    const rows = byPage(40);
    expect(f(rows[2], "klafter")).toBe("300"); // p2 aligned
    expect(f(rows[3], "klafter")).toBe("255"); // p3 (v57 355 -> 255)
    expect(f(rows[14], "klafter")).toBe("860"); // p14 (val 115: r13 = vstavljena vrstica)
    expect(f(rows[15], "klafter")).toBe("529"); // p15
  });

  test("p40: r12 počiščeno (celica prazna na strani), r11 SPLIT 1|599 + haus popravki; val 115: vstavljena r13 (Pechley Mich° 1|65)", () => {
    const rows = byPage(40);
    expect(f(rows[12], "jaethe")).toBe("");
    expect(f(rows[12], "anmerkung")).toContain("preklicana vrstica p13");
    expect(f(rows[11], "jaethe")).toBe("1");
    expect(f(rows[11], "klafter")).toBe("599");
    expect(f(rows[11], "anmerkung")).toContain("F-PV-07-SPLIT val 114");
    expect(f(rows[11], "haus_no")).toBe("1/21");
    // val 115 vstavljena vrstica na r13
    expect(f(rows[13], "owner_original")).toBe("Pöching Michl.[?]"); // val 119 del 2c: v115 vrstica prebrana (agentov vid)
    expect(f(rows[13], "jaethe")).toBe("1");
    expect(f(rows[13], "klafter")).toBe("65");
    expect(f(rows[13], "reading_pass")).toBe("v119-names");
    expect(f(rows[19], "haus_no")).toBe("1/64");
    expect(f(rows[20], "haus_no")).toBe("1/65");
  });

  test("p48: 21 vrstic (v114 obs) — v57 izpustil p2 ('12'); val 115: +1 vstavljena p2 na r2; val 119 del 2d-x3 F-NA-02: v114 jae kolona = klafter zamaknjena +1 → rebuild (klafter kolona)", () => {
    const obs = f(byPage(48)[0], "page_observations_v114");
    expect(obs).toContain('p2 (vrednost "12"');
    const rows = byPage(48);
    // x3: vstavljena vrstica r2 prebrana (v119-names); vrednostna plast popolnoma re-sidrana
    expect(f(rows[2], "jaethe")).toBe(""); // F-NA-02: vse p48 jae pociscene
    expect(f(rows[2], "klafter")).toBe("733");
    expect(f(rows[2], "reading_pass")).toBe("v119-names");
    // dokaz zamika +1: stare v114 'jaethe' vrednosti = x3 klafter za eno vrstico višje
    expect(f(rows[2], "jaethe_pre_v119")).toBe("12"); // prava 912-vrstica = r1
    expect(f(rows[1], "klafter")).toBe("12");
    expect(f(rows[3], "klafter")).toBe("10");
    expect(f(rows[4], "klafter")).toBe("439");
    expect(f(rows[13], "klafter")).toBe("1269");
    expect(f(rows[14], "klafter")).toBe("678");
    expect(f(rows[15], "klafter")).toBe("155"); // x3 stevkni popravek (v114 185)
    expect(f(rows[17], "klafter")).toBe("159"); // x3 stevkni popravek (v114 189)
    // sidri pod mapiranjem
    expect(f(rows[5], "klafter")).toBe("533");
    expect(f(rows[12], "klafter")).toBe("1492"); // x3 stevkni popravek (v114 1490)
    expect(f(rows[19], "klafter")).toBe("280");
    expect(f(rows[20], "klafter")).toBe(""); // 901: visoko '1534' = opuščen poskus (anm), klafter ← 219 @ r0
  });

  test("p49: 21 vrstic (v114 obs) — v57 izpustil preklicano p2 ('2|973'); val 115: +1 vstavljena p2 na r2; val 119 del 2d-x3 F-NA-01: v114 vrednosti od r10 zamaknjene +1 → rebuild (poravnana cona r0–r8 identična)", () => {
    const obs = f(byPage(49)[0], "page_observations_v114");
    expect(obs).toContain("PREČRTANO vrstico p2");
    const rows = byPage(49);
    // x3: vstavljena vrstica r2 = F2 fill ('Heide Marko.' h3, v119-names)
    expect(f(rows[2], "jaethe")).toBe("2");
    expect(f(rows[2], "klafter")).toBe("973");
    expect(f(rows[2], "reading_pass")).toBe("v119-names");
    // poravnana cona (r0–r8) — vrednosti identične
    expect(f(rows[4], "klafter")).toBe("591");
    expect(f(rows[6], "klafter")).toBe("1553");
    expect(f(rows[7], "klafter")).toBe("412");
    expect(f(rows[5], "klafter")).toBe("1415"); // sidro
    // F-NA-01 rešen: 22 pasov; r9 = polpas 929½ (F5, prazno), r19 = 939 (398; v114 @r20 = zamik)
    expect(f(rows[9], "klafter")).toBe(""); // F5 polpas 929½
    expect(f(rows[8], "klafter")).toBe("241"); // x20 popravek (v114 '381' @r8)
    expect(f(rows[19], "klafter")).toBe("398"); // 939 (v114 @r20)
    expect(f(rows[20], "klafter")).toBe(""); // 940 prazen
    expect(f(rows[21], "klafter")).toBe(""); // r21 = Fürtrag pas (F6)
  });

  test("p34: pomik r15–r19 OVRŽEN + 21. vrstica (~70) dokumentirana", () => {
    const obs = f(byPage(34)[0], "page_observations_v114");
    expect(obs).toContain("OVRŽEN");
    expect(obs).toContain("21. vrstico");
    const rows = byPage(34);
    expect(f(rows[15], "klafter")).toBe("185");
    expect(f(rows[17], "klafter")).toBe("87");
    expect(f(rows[18], "anmerkung")).toContain("1038 vs 1088");
  });
});

describe("val 114 — F-PV-07 premestitve + SPLIT razcepi", () => {
  test("p40/p41/p55: vse vrednosti v QK koloni (jae počisčene razen Joch stevcev)", () => {
    for (const p of [40, 41, 55]) {
      const rows = byPage(p);
      for (const r of rows) {
        const jae = f(r, "jaethe");
        if (jae === "") continue;
        // preostali jae = Joch stavec (split notacije) z markerjem
        expect(f(r, "anmerkung")).toContain("F-PV-07-SPLIT");
      }
    }
  });

  test("p41: 19 premestitev + r16 SPLIT 1|77 + POPRAVEK r5 1774", () => {
    const rows = byPage(41);
    expect(f(rows[0], "jaethe")).toBe("");
    expect(f(rows[0], "klafter")).toBe("532");
    expect(f(rows[0], "jaethe_pre_v114")).toBe("522"); // v57 jae vrednost (POPRAVEK 522->532 + move)
    expect(f(rows[5], "klafter")).toBe("1774");
    expect(f(rows[7], "klafter")).toBe("28");
    expect(f(rows[16], "jaethe")).toBe("1");
    expect(f(rows[16], "klafter")).toBe("77");
    expect(f(rows[16], "anmerkung")).toContain("F-PV-07-SPLIT val 114");
  });

  test("p55: 19 premestitev + r17 SPLIT 1|329; r0 kl 29→39 (val 119 del 2e re-read)", () => {
    const rows = byPage(55);
    expect(f(rows[0], "jaethe")).toBe("");
    expect(f(rows[0], "klafter")).toBe("39"); // val 119 del 2e: 29 → 39 (x20)
    expect(f(rows[0], "klafter_pre_v119")).toBe("29"); // snimka v114
    expect(f(rows[17], "jaethe")).toBe("1");
    expect(f(rows[17], "klafter")).toBe("329");
    expect(f(rows[17], "anmerkung")).toContain("F-PV-07-SPLIT val 114");
  });

  test("p47 r20 SPLIT 1|695 (popavek 692->695)", () => {
    const rows = byPage(47);
    expect(f(rows[20], "jaethe")).toBe("1");
    expect(f(rows[20], "klafter")).toBe("695");
    expect(f(rows[20], "anmerkung")).toContain("F-PV-07-SPLIT val 114");
  });

  test("SPLIT markerji ze-obstojecih parov: 25 vrstic z 'F-PV-07-SPLIT val 114'", () => {
    expect(REG.filter((r) => f(r, "anmerkung").includes("F-PV-07-SPLIT val 114")).length).toBe(31);
    // vzorci
    expect(f(byPage(28)[4], "jaethe")).toBe("3");
    expect(f(byPage(36)[0], "jaethe")).toBe("1");
    expect(f(byPage(53)[6], "jaethe")).toBe("1");
  });
});

describe("val 114 — POPRAVEK vrednosti (v57 sistemske napake)", () => {
  test("p39: r0 tekač počiščen + 774 + ertrag 1535; r1 744, r2 703, r11 449, r14 489", () => {
    const rows = byPage(39);
    expect(f(rows[0], "jaethe")).toBe("");
    expect(f(rows[0], "klafter")).toBe("774");
    expect(f(rows[0], "ertrag_fl")).toBe("1535");
    expect(f(rows[0], "anmerkung")).toContain("761+774");
    expect(f(rows[1], "klafter")).toBe("744");
    expect(f(rows[2], "klafter")).toBe("703");
    expect(f(rows[11], "klafter")).toBe("449");
    expect(f(rows[14], "klafter")).toBe("489");
  });

  test("p42: r1 410, r12 1394; r15 644→544 (val 121: prva 5 brez ascenderja) + masovne prečrte", () => {
    const rows = byPage(42);
    expect(f(rows[1], "klafter")).toBe("410");
    expect(f(rows[12], "klafter")).toBe("1394");
    expect(f(rows[15], "klafter")).toBe("544"); // val 121
    for (const i of [5, 6, 7, 8, 11, 17, 19]) {
      expect(f(rows[i], "anmerkung")).toMatch(/pre[cč]rt|precrz/);
    }
  });

  test("p44: r6 148, r14 247, r15 733, r16 150, r19 168", () => {
    const rows = byPage(44);
    expect(f(rows[6], "klafter")).toBe("148");
    expect(f(rows[14], "klafter")).toBe("247");
    expect(f(rows[15], "klafter")).toBe("733");
    expect(f(rows[16], "klafter")).toBe("150");
    expect(f(rows[19], "klafter")).toBe("168");
  });

  test("p45 r10 443; p46 r0-r3 139/189/192/170, r8 362, r13 487, r15 381; p47 r6 229, r13 364, r17 543", () => {
    expect(f(byPage(45)[10], "jaethe")).toBe("443");
    const r46 = byPage(46);
    expect(f(r46[0], "jaethe")).toBe("139");
    expect(f(r46[1], "jaethe")).toBe("189");
    expect(f(r46[2], "jaethe")).toBe("192");
    expect(f(r46[3], "jaethe")).toBe("170");
    expect(f(r46[8], "jaethe")).toBe("362");
    expect(f(r46[13], "jaethe")).toBe("487");
    expect(f(r46[15], "jaethe")).toBe("381");
    const r47 = byPage(47);
    expect(f(r47[6], "klafter")).toBe("229");
    expect(f(r47[13], "klafter")).toBe("364");
    expect(f(r47[17], "klafter")).toBe("543");
  });

  test("p50: r1 816, r4 353, r8 269, r13 104, r15 131, r18 528; r20 = Fürtrag pas (val 119 del 2e: jae 4 | kl 386, fantom-ime počiščen)", () => {
    const rows = byPage(50);
    expect(f(rows[1], "jaethe")).toBe("816");
    expect(f(rows[4], "jaethe")).toBe("353");
    expect(f(rows[8], "jaethe")).toBe("269");
    expect(f(rows[13], "jaethe")).toBe("104");
    expect(f(rows[15], "jaethe")).toBe("131");
    expect(f(rows[18], "jaethe")).toBe("528");
    expect(f(rows[20], "jaethe")).toBe("4"); // val 119 del 2e F-FÜRTRAG: pas nosi jae 4 | kl 386
    expect(f(rows[20], "klafter")).toBe("386");
    expect(f(rows[20], "owner_original")).toBe("");
    expect(f(rows[20], "anmerkung")).toContain("fantom");
  });

  test("p52: r16 1205→1305 (val 119 del 2e re-read, snimka), r18 589, r19 '10|7817' -> 245", () => {
    const rows = byPage(52);
    expect(f(rows[16], "klafter")).toBe("1305"); // val 119 del 2e: 1205 → 1305 (x20)
    expect(f(rows[16], "klafter_pre_v119")).toBe("1205"); // snimka v114
    expect(f(rows[18], "klafter")).toBe("589");
    expect(f(rows[19], "jaethe")).toBe("");
    expect(f(rows[19], "klafter")).toBe("245");
    expect(f(rows[19], "anmerkung")).toContain("nepojasnjena napaka");
  });
});

describe("val 114 — iskrenost §4: odprta razhajanja + prečrtanja", () => {
  test("≥ 40 anmerkungov z 'odprto' (razhajanja) na pokritih straneh", () => {
    const cov = [19, 20, ...Array.from({ length: 31 }, (_, i) => i + 25)];
    const n = REG.filter(
      (r) => cov.includes(Number(r["page"])) && f(r, "anmerkung").includes("odprto"),
    ).length;
    expect(n).toBeGreaterThanOrEqual(40);
  });

  test("≥ 30 anmerkungov s prečrtanji (rdeče/rožnato) — nič ne dvignjeno, samo označeno", () => {
    const cov = [19, 20, ...Array.from({ length: 31 }, (_, i) => i + 25)];
    const n = REG.filter(
      (r) => cov.includes(Number(r["page"])) && /(pre[cč]rt|precrz|precrt)/.test(f(r, "anmerkung")),
    ).length;
    expect(n).toBeGreaterThanOrEqual(30);
  });

  test("vzorca: p42 r10 (1322 vs 433), p51 r2 (236 vs 288), p44 r7 (476 vs 970)", () => {
    expect(f(byPage(42)[10], "anmerkung")).toContain("1322 vs 433");
    expect(f(byPage(51)[2], "anmerkung")).toContain("236 vs 288");
    expect(f(byPage(44)[7], "anmerkung")).toContain("476 vs 970");
  });

  test("TRANSCRIBED = 0: statusi evidence se NISO spremenili (§4)", () => {
    const n_transcribed = REG.filter((r) => f(r, "evidence_status") === "TRANSCRIBED").length;
    expect(n_transcribed).toBe(0);
  });
});

describe("val 114 — kaskada (izrecna)", () => {
  const ATLAS = join(ROOT, "research-griblje/atlas-1825");
  const pr = JSON.parse(readFileSync(join(ATLAS, "parcel-register-1825.json"), "utf8")) as {
    ps_parcels_total: number;
    ps_land_use_coverage: Record<string, number>;
    ps_land_use_mapping_confidence: Record<string, number>;
  };
  const kg = JSON.parse(readFileSync(join(ATLAS, "knowledge-graph-1825.json"), "utf8")) as {
    node_stats: Record<string, number>;
    edge_stats: Record<string, number>;
    nodes: unknown[];
    edges: unknown[];
    claims: unknown[];
    invariant_violations: unknown[];
  };

  test("pass3: PS parcele 577 → 393 (F-PV-07 p25–p55 + p28–p37 + SPLIT markerji)", () => {
    const s = readFileSync(join(ATLAS, "build-pass3.py"), "utf8");
    expect(s).toContain("F-PV-07-SPLIT val 114");
    expect(pr.ps_parcels_total).toBe(392); // val 115: 391 → 392 (vstavljena vrstica p48 "12")
    expect(pr.ps_land_use_coverage["njiva"]).toBe(105);
    expect(pr.ps_land_use_coverage["UNKNOWN"]).toBe(142);
    expect(pr.ps_land_use_coverage["null"]).toBe(77); // val 115: 76 → 77
    expect(pr.ps_land_use_mapping_confidence["EXACT"]).toBe(166);
    expect(pr.ps_land_use_mapping_confidence["TERM-UNCLEAR"]).toBe(142);
    expect(pr.ps_land_use_mapping_confidence["EXACT-MIXED"]).toBe(7);
  });

  test("KG: PARCEL 2436, HAS_PARCEL 2775, vozlišča 3278, vezi 3479, claims 622", () => {
    expect(kg.node_stats.PARCEL).toBe(2427); // val 115: 2426 → 2427
    expect(kg.edge_stats.HAS_PARCEL).toBe(2773); // val 115: nespremenjeno (nova parcela brez haus_no)
    expect(kg.nodes.length).toBe(3762); // val 115: 3268 → 3269
    expect(kg.edges.length).toBe(3471); // val 115: nespremenjeno
    expect(kg.claims.length).toBe(614);
    expect(kg.invariant_violations).toEqual([]);
  });

  test("kaskadni artefakti držijo isti KG sha b3e9797e… (pogodba §22; val 119 del 2e — timestamp-only, vsebina identična)", () => {
    const kgSha = sha(join(ATLAS, "knowledge-graph-1825.json"));
    expect(kgSha).toMatch(/^b3e9797e/);
    for (const p of [
      "research-griblje/atlas-1825/story-graph-1825.json",
      "research-griblje/atlas-1825/timeline-1825-1830.json",
      "research-griblje/atlas-1825/coverage-report-1825.json",
    ]) {
      const j = JSON.parse(readFileSync(join(ROOT, p), "utf8")) as { provenance?: { kg_sha256?: string } };
      if (j.provenance?.kg_sha256 !== undefined) expect(j.provenance.kg_sha256, p).toBe(kgSha);
      else expect(sha(join(ROOT, p)), p).toBe(kgSha);
    }
  });

  test("timeline I6 zatiči: PUA 2035 / PS 392 / raba 173+142 (val 115)", () => {
    const tl = JSON.parse(readFileSync(join(ROOT, "src/data/timeline-1825-1830.json"), "utf8")) as {
      points: { year: number; metrics: { metric_id: string; value: number }[] }[];
    };
    const m = (id: string, y: number) =>
      tl.points.find((p) => p.year === y)?.metrics.find((x) => x.metric_id === id)?.value;
    expect(m("parcels_pua", 1825)).toBe(2035);
    expect(m("parcels_ps", 1825)).toBe(392); // val 115: 391 → 392
    expect(m("parcels_with_land_use", 1825)).toBe(173);
  });

  test("coverage: PARTIAL 1067 (PUA 675 + PS 392, val 115)", () => {
    const c = JSON.parse(readFileSync(join(ROOT, "src/data/atlas-coverage-report-1825.json"), "utf8")) as {
      quality_gate: { PARTIAL: number }[];
    };
    expect((c.quality_gate ?? []).some((g) => g.PARTIAL === 1067)).toBe(true);
  });
});
