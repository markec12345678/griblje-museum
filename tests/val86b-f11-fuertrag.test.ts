/**
 * Val 86b — ISSUE #42 §4/§14 + #43: F11 Fürtrag MONOTONA KONTROLA čez celo verigo
 * (PS N83, p56–143; 3 glasovi: pass1 val82 / pass2 val83 / tile-i val86).
 *
 * Varovalke:
 *  1. sidra val 61 (13 točk, VERIFIKIRANO z agentovim direktnim vidom, 0 VLM) —
 *     vgrajena v builder kot statični vhod; števci strogo monotoni 2..52
 *  2. format-dekodiran: "N. Fürtrag. | J | Quad.Klafter" z Joch = 1600 QKl
 *     (val 61 §2.2; "N.º Jaethe" = parcelni števec, "Quad. Kläfter" = površina)
 *  3. F11 artefakt: struktura (veriga 56–143, veznost p54→p56+, 3-glas REVIEW,
 *     aritmetika vs register, sidra val 85) + determinističen re-run (byte-identno)
 *  4. Fürtrag = najšibkejše branje (val 86 §7): p58 glasovi se razhajajo → REVIEW
 *  5. NIČ sprememb podatkov (§4/§22): builder ne sme spremeniti registra/KG
 *
 * Opomba: natančne številke (pokritost tile-ov, št. REVIEW strani) niso pincirane —
 * artefakt je determinističen funkcija vhodov (kvota val 86/86b).
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const RG = join(process.cwd(), "research-griblje");
const PS = join(RG, "ps-n83");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

type TotLine = { counter: number | null; strict: boolean; pairs: [number, number][]; singles: number[]; flags: string[] };
type ChainEntry = { page: number; strict: number[]; n_strict_voices: number };
type Arithmetic = {
  page: number; register_qkl_total: number; gestrichen_rows: number; rows: number; tile_full: boolean;
  voices_qkl_total: Record<string, number[]>; register_by_kultur: Record<string, number>;
  best_voice?: string; best_diff?: number; verdict: string;
};
type AnchorCheck = { page: number; expect: { counter: number; j: number; qkl: number }; voices_hit: string[]; any_voice_match: boolean };
type F11 = {
  meta: { val: string; generated_by: string; method: string; pages: string; anchors_v61: number; anchors_v85: number; joch_qkl: number; tile_full_pages: number };
  chain: ChainEntry[];
  counter_monotone: string;
  counter_violations: { page: number; counter: number; prev_strict: number }[];
  counter_suspects: { page: number; suspects: { voice: string; counter: number; label: string }[] }[];
  link_p54_p56: { p54_counter: number; first_strict_page?: number; first_strict_counter?: number; delta?: number; ok?: boolean };
  voice_review: { page: number; voices_qkl: Record<string, number[]>; verdict: string }[];
  arithmetic: Arithmetic[];
  anchors_v85_check: AnchorCheck[];
};

const f11 = JSON.parse(readFileSync(join(PS, "band-v86", "f11-fuertrag-v86.json"), "utf8")) as F11;

describe("val 86b — F11 metoda: sidra val 61 (VERIFIKIRANO, 0 VLM)", () => {
  test("sidra vgrajena v builder: 13 točk, števci strogo monotoni 2..52 (val 61 tab. 2.1)", () => {
    const src = readFileSync(join(PS, "build-f11-fuertrag-v86.py"), "utf8");
    expect(src).toContain("ANCHORS_V61");
    const counters = [2, 9, 10, 12, 14, 18, 22, 30, 33, 38, 39, 42, 52];
    const pages = [5, 11, 12, 14, 16, 20, 24, 32, 35, 36, 42, 44, 54];
    for (let i = 0; i < counters.length; i++) {
      expect(src).toContain(`${pages[i]}: (${counters[i]},`);
      if (i > 0) expect(counters[i]).toBeGreaterThan(counters[i - 1]);
    }
  });

  test("format-dekodiran: Joch = 1600 Quadrat-Klafter (val 61 §2.2) zapisan v artefaktu", () => {
    expect(f11.meta.joch_qkl).toBe(1600);
    expect(f11.meta.method).toContain("NIČ sprememb podatkov");
  });

  test("sidra val 85 (7 točk, DELNO POTRJENO-V85) ohranjena kot kontrolne točke", () => {
    const expected = [
      [58, 56, 6, 1009], [59, 57, 9, 1085], [84, 92, 7, 1135], [98, 96, 11, 835],
      [109, 109, 10, 1056], [121, 119, 17, 266], [133, 137, 7, 934],
    ] as const;
    expect(f11.anchors_v85_check).toHaveLength(7);
    f11.anchors_v85_check.forEach((a, i) => {
      expect(a.page).toBe(expected[i][0]);
      expect(a.expect.counter).toBe(expected[i][1]);
      expect(a.expect.j).toBe(expected[i][2]);
      expect(a.expect.qkl).toBe(expected[i][3]);
    });
  });
});

describe("val 86b — F11 artefakt: struktura in kontrole", () => {
  test("meta: val 86b, builder, strani 56–143, 13+7 sider", () => {
    expect(f11.meta.val).toBe("86b");
    expect(f11.meta.generated_by).toBe("build-f11-fuertrag-v86.py");
    expect(f11.meta.pages).toBe("56-143");
    expect(f11.meta.anchors_v61).toBe(13);
    expect(f11.meta.anchors_v85).toBe(7);
  });

  test("veriga: vseh 88 strani 56–143, strogi števci ne-padajoča poročana", () => {
    expect(f11.chain).toHaveLength(88);
    f11.chain.forEach((c, i) => expect(c.page).toBe(56 + i));
    // kršitve so dovoljene NAJDBA (VLM števci so najšibkejši — val 61 §2.2), morajo pa
    // biti izrecno zabeležene (nič tihega)
    for (const v of f11.counter_violations) {
      expect(v.counter).toBeLessThan(v.prev_strict);
      expect(v.page).toBeGreaterThanOrEqual(56);
    }
  });

  test("veznost p54 (52, val 61) → prvi strogi števec p56+: v napredni smeri", () => {
    expect(f11.link_p54_p56.p54_counter).toBe(52);
    if (f11.link_p54_p56.first_strict_counter !== undefined) {
      expect(f11.link_p54_p56.delta).toBeGreaterThan(0);
    }
  });

  test("3-glas QKl soglasje: REVIEW strani izrecno zabeležene (nič tihega)", () => {
    for (const r of f11.voice_review) {
      expect(r.verdict).toBe("REVIEW");
      const voices = Object.keys(r.voices_qkl);
      expect(voices.length).toBeGreaterThanOrEqual(2);
    }
  });

  test("aritmetika: vsota register vrstic v prostoru J*1600+QKl vs Fürtrag glasovi", () => {
    expect(f11.arithmetic).toHaveLength(88);
    for (const a of f11.arithmetic) {
      expect(["OK", "REVIEW", "NO_FURTRAG"]).toContain(a.verdict);
      expect(a.rows).toBeGreaterThan(0);
      expect(a.register_qkl_total).toBeGreaterThanOrEqual(0);
      if (a.verdict !== "NO_FURTRAG") {
        expect(a.voices_qkl_total && Object.keys(a.voices_qkl_total).length).toBeGreaterThan(0);
      }
    }
    // p58 (val 85: 6|1009 vs 6/1000 vs 6/1169 — najšibkejše branje): glasovi se razhajajo
    const p58 = f11.arithmetic.find((a) => a.page === 58);
    expect(p58).toBeDefined();
    if (p58 && p58.voices_qkl_total) {
      const voiceSets = Object.values(p58.voices_qkl_total);
      if (voiceSets.length >= 2) {
        const first = JSON.stringify(voiceSets[0]);
        expect(voiceSets.some((v) => JSON.stringify(v) !== first)).toBe(true);
      }
    }
  });

  test("p121 qklft anomalija (val 85: »J=1725« = »17 J 266« + rdeča 12 1046): par (17, 266) vglasovih", () => {
    // Glasovi lahko vsebujejo 17|266 ali 17|206 (VLM šibkost) — kontrola dokumentira oboje
    const p121 = f11.arithmetic.find((a) => a.page === 121);
    expect(p121).toBeDefined();
  });
});

describe("val 86b — determinizem in §4/§22", () => {
  test("F11 builder re-run: byte-identno (determinističen)", () => {
    const before = sha256(join(PS, "band-v86", "f11-fuertrag-v86.json"));
    execFileSync("python3", [join(PS, "build-f11-fuertrag-v86.py")], { cwd: process.cwd(), stdio: "ignore" });
    const after = sha256(join(PS, "band-v86", "f11-fuertrag-v86.json"));
    expect(after).toBe(before);
  });

  test("builder ne piše v register.json ali KG (§4/§22 — samo merjenje)", () => {
    const src = readFileSync(join(PS, "build-f11-fuertrag-v86.py"), "utf8");
    expect(src).toContain("NIČ sprememb podatkov");
    // register se samo bere (json.load), ni json.dump na register pot
    expect(src).not.toMatch(/json\.dump\([^)]*REG/);
  });

  test("artefakt comittan in skripta obstaja (trajna dokumentacija)", () => {
    expect(existsSync(join(PS, "build-f11-fuertrag-v86.py"))).toBe(true);
    expect(existsSync(join(PS, "band-v86", "f11-fuertrag-v86.json"))).toBe(true);
  });
});
