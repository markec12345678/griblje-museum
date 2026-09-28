/**
 * Val 90 — ISSUE #42 §4/§14 + #43: C4 ARITMETIKA — deterministična izčrpna preverba
 * konvencij ("metrika stolpcev TO-DECODE") na sidrih val 61 + p56–143.
 *
 * Varovalke:
 *  1. artefakt band-v86/c4-metrika-v90.json: meta (val, verdict, K5 zanesljivost,
 *     sha-ji vhodov) — 0 VLM / 0 spleta / 0 kvote
 *  2. K1–K4 = 0/13 (ovržbe konvencij pincirane; mešani predznaki razlik)
 *  3. K6 = 0 (rdeči popravki niso vsote strani)
 *  4. K7 = reprodukcija C4 val 86b: 0 OK / 76 REVIEW / 12 brez + 0 neskladij vsot
 *  5. K8 = 12/13 value + 1/13 red (p44 rdeča kot anchor v f11 builderju — dokumentirano)
 *  6. K9 = konfunda F-PV-05 pincirana (323/242 atribucija; 29/69 gt1599; 1/7 jk)
 *  7. K10 = 3998 na [p11, p35]; p56 glas p1 == p5 anchor (11059)
 *  8. determinizem: builder re-run byte-identno
 *  9. §4 negativna varovalka: builder ne sme spremeniti register.json / f11 artefakta
 *
 * Opomba: številke so funkcija comittanih vhodov (register + val 61 reread + f11);
 * sprememba kateregakoli vhoda mora biti izrecen val — zato pincirane.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const PS = join(process.cwd(), "research-griblje", "ps-n83");
const ART = join(PS, "band-v86", "c4-metrika-v90.json");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

type Konv = {
  page: number; anchor_value: string; anchor_qkl: number | null; crossed: boolean; red_line: string;
  rows: number; K1_page_sum_excl: number; K1_match: boolean | null;
  K2_page_sum_incl: number; K2_match: boolean | null;
  K3_n_hits: number; K4_n_hits: number; K5_n_hits: number;
  K6_red: { red_qkl: number | null; match_excl: boolean; match_incl: boolean } | null;
  K6_match: boolean;
};
type Art = {
  meta: {
    val: string; generated_by: string; method: string;
    inputs: Record<string, string>;
    anchors: number; joch_qkl: number;
    verdict_counts: Record<string, number>;
    K5_input_reliability: string; verdict: string;
  };
  konvencije_sidra: Konv[];
  K7_c4_reprodukcija: { pages: number; OK: number; REVIEW: number; NO_FURTRAG: number; register_sum_mismatches: number[] };
  K8_vnosi_sidrov: { page: number; counter: number; anchor_qkl: number; chain_qkl: number | null; red_qkl: number | null; anchor_equals_chain: boolean; anchor_equals_red: boolean }[];
  "K9_konfunda_F-PV-05": { p1_55_val57: Record<string, number>; p56_143_v82_plus_sloji: Record<string, number> };
  K10_opazovalni_register: { anchor_value_duplicates: Record<string, number[]>; p56_voice_p1_equals_p5_anchor: boolean | null };
};

const art = JSON.parse(readFileSync(ART, "utf8")) as Art;

describe("val 90 — meta + disciplina §4", () => {
  test("artefakt obstaja in je val 90 z 13 sidri ter Joch = 1600 QKl", () => {
    expect(existsSync(ART)).toBe(true);
    expect(art.meta.val).toBe("90");
    expect(art.meta.anchors).toBe(13);
    expect(art.meta.joch_qkl).toBe(1600);
    expect(art.meta.verdict).toContain("NEPOTRJENA");
    expect(art.meta.verdict).toContain("TO-DECODE");
  });

  test("vhodi so comittani artefakti (sha256 zabeleženi; register 2.871 vrstic = val 89 stanje)", () => {
    expect(Object.keys(art.meta.inputs).sort()).toEqual(
      ["f11-fuertrag-v86.json", "register.json", "totals-reread.json"]
    );
    for (const [name, sha] of Object.entries(art.meta.inputs)) {
      expect(sha).toMatch(/^[0-9a-f]{64}$/);
      const rel = name === "totals-reread.json" ? join("reread-2026-10", name)
        : name === "f11-fuertrag-v86.json" ? join("band-v86", name)
        : name; // register.json
      expect(existsSync(join(PS, rel))).toBe(true);
      expect(sha256(join(PS, rel))).toBe(sha); // vhod se od comitta ni spremenil
    }
  });

  test("K5 izrecno označen kot NEDEDOKAZLJIVO (dito 233/2.871 = 8,1 %; bloki ~1,1 vrstic)", () => {
    expect(art.meta.K5_input_reliability).toContain("NEZANESLJIV VHOD");
    expect(art.meta.K5_input_reliability).toContain("NEDEDOKAZLJIVO");
    expect(art.meta.K5_input_reliability).toContain("233/2871");
  });
});

describe("val 90 — ovržbe konvencij (K1–K4, K6)", () => {
  const konv = art.konvencije_sidra;
  const pages = konv.map((k) => k.page);

  test("13 sidra = val 61 verified_chain strani", () => {
    expect(pages).toEqual([5, 11, 12, 14, 16, 20, 24, 32, 35, 36, 42, 44, 54]);
  });

  test("K1 vsota strani (gestr. izklj.) = 0/13; razlike z mešanimi predznaki", () => {
    expect(art.meta.verdict_counts["K1_page_sum_excl"]).toBe(0);
    for (const k of konv) {
      expect(k.K1_match).toBe(false);
      const d = k.K1_page_sum_excl - (k.anchor_qkl ?? 0);
      expect(d).not.toBe(0);
    }
    const signs = konv.map((k) => Math.sign(k.K1_page_sum_excl - (k.anchor_qkl ?? 0)));
    expect(new Set(signs).size).toBe(2); // + in − — mešani predznaki
  });

  test("K2 vsota strani (gestr. vklj.) = 0/13", () => {
    expect(art.meta.verdict_counts["K2_page_sum_incl"]).toBe(0);
    for (const k of konv) expect(k.K2_match).toBe(false);
  });

  test("K3 zvezni odseki = 0/13 (niti en natani odsek na nobeni strani)", () => {
    expect(art.meta.verdict_counts["K3_any_segment"]).toBe(0);
    for (const k of konv) expect(k.K3_n_hits).toBe(0);
  });

  test("K4 priponske sekcije čez strani = 0/13 (do 160 vrstic nazaj)", () => {
    expect(art.meta.verdict_counts["K4_any_suffix"]).toBe(0);
    for (const k of konv) expect(k.K4_n_hits).toBe(0);
  });

  test("K6 rdeči popravki = 0 ujemi (semantika rdečih ostaja TO-DECODE)", () => {
    expect(art.meta.verdict_counts["K6_red_match"]).toBe(0);
    const withRed = konv.filter((k) => k.K6_red && k.K6_red.red_qkl !== null);
    expect(withRed.length).toBe(9); // rdeča na 9/13 strani v J|K formatu (p11 '81' = brez formata)
    for (const k of withRed) {
      expect(k.K6_red!.match_excl).toBe(false);
      expect(k.K6_red!.match_incl).toBe(false);
    }
    // K6 na preostalih 6 sidrih: brez rdeče vrednosti v J|K formatu (p11 '81' = brez formata)
    for (const k of konv.filter((k) => !k.K6_red || k.K6_red.red_qkl === null)) {
      expect(k.K6_match).toBe(false);
    }
  });
});

describe("val 90 — reprodukcija in usklajenost (K7, K8)", () => {
  test("K7 = C4 val 86b natanko: 0 OK / 76 REVIEW / 12 brez; 0 neskladij vsot vrstic", () => {
    const k7 = art.K7_c4_reprodukcija;
    expect(k7.pages).toBe(88);
    expect(k7.OK).toBe(0);
    expect(k7.REVIEW).toBe(76);
    expect(k7.NO_FURTRAG).toBe(12);
    expect(k7.register_sum_mismatches).toEqual([]);
  });

  test("K8 = 12/13 value + 1/13 red; p44 je edini anchor == rdeča (dokumentirana mešana politika)", () => {
    expect(art.meta.verdict_counts["K8_anchor_equals_chain"]).toBe(12);
    expect(art.meta.verdict_counts["K8_anchor_equals_red"]).toBe(1);
    const p44 = art.K8_vnosi_sidrov.find((k) => k.page === 44);
    expect(p44).toBeDefined();
    expect(p44!.anchor_equals_chain).toBe(false);
    expect(p44!.anchor_equals_red).toBe(true);
    const others = art.K8_vnosi_sidrov.filter((k) => k.page !== 44);
    for (const k of others) {
      expect(k.anchor_equals_chain).toBe(true);
      expect(k.anchor_equals_red).toBe(false);
    }
  });
});

describe("val 90 — konfunda F-PV-05 (K9) + opazovalni register (K10)", () => {
  test("K9 pin: atribucija 100–1599 v jaethe = 323 (p1–55) / 214 (p56–143; val 90: 242 → val 98: 214, mehanski premik z 101 F-PV-05 korekcijo na p95–109 — vzorec val 88 §4) — vsotno NEUTRALNA", () => {
    expect(art["K9_konfunda_F-PV-05"].p1_55_val57["jaethe_plain_100_1599"]).toBe(323);
    expect(art["K9_konfunda_F-PV-05"].p56_143_v82_plus_sloji["jaethe_plain_100_1599"]).toBe(214);
  });

  test("K9 pin: vsotno-relevantni razredi majhni (gt1599 29/69; jk_format 1/7)", () => {
    const p1 = art["K9_konfunda_F-PV-05"].p1_55_val57;
    const p2 = art["K9_konfunda_F-PV-05"].p56_143_v82_plus_sloji;
    expect((p1["jaethe_plain_gt1599"] ?? 0) + (p1["klafter_plain_gt1599"] ?? 0)).toBe(29);
    expect((p2["jaethe_plain_gt1599"] ?? 0) + (p2["klafter_plain_gt1599"] ?? 0)).toBe(69);
    expect(p1["any_jk_format"]).toBe(1);
    expect(p2["any_jk_format"]).toBe(7);
  });

  test("K10: anchor 3998 (2|798) na dveh straneh [11, 35]; p56 glas p1 == p5 anchor", () => {
    expect(art.K10_opazovalni_register.anchor_value_duplicates["3998"]).toEqual([11, 35]);
    expect(art.K10_opazovalni_register.p56_voice_p1_equals_p5_anchor).toBe(true);
  });
});

describe("val 90 — determinizem + §4 negativna varovalka", () => {
  test("builder re-run: byte-identno + register.json in f11 artefakt NESPREMENJENA", () => {
    const beforeArt = sha256(ART);
    const beforeReg = sha256(join(PS, "register.json"));
    const beforeF11 = sha256(join(PS, "band-v86", "f11-fuertrag-v86.json"));
    execFileSync("python3", [join(PS, "build-c4-metrika-v90.py")], { cwd: process.cwd(), stdio: "ignore" });
    expect(sha256(ART)).toBe(beforeArt);
    expect(sha256(join(PS, "register.json"))).toBe(beforeReg);
    expect(sha256(join(PS, "band-v86", "f11-fuertrag-v86.json"))).toBe(beforeF11);
  });
});
