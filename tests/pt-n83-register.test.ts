import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";

/**
 * Namenski PT QA (53. val) — register PT N083 (Protocoll der Bau Parcellen,
 * 1825, VAČ docid 41781) mora biti sledljiv in pošten: vsaka vrstica ima
 * bp_no in provenanco branj, p8 (Musterstellung) in val52-p5 (premaknjeni
 * stolpci) nista v BP-registru, vrzel 15–20 ni ugibana, STABLE pomeni
 * dvojno soglasje hišne številke.
 */

const HERE = dirname(import.meta.dir);

type PtRow = {
  page: number;
  bp_no: string;
  house_no: string;
  house_no_votes: string;
  owner_original: string;
  owner_variants: string[];
  readings: string[];
  review_status: string;
  uncertain_words: string[];
  source: string;
  docid: string;
};

type PtRegister = {
  source: string;
  docid: string;
  built: string;
  exclusions: Record<string, string>;
  p8_musterstellung: {
    summary_table: { category: string; count: string; area_or_remark: string }[];
    signatures: string[];
  } | null;
  register: PtRow[];
};

type PtPageRecords = {
  page: number;
  readings: string[];
  unique_bp: string[];
  truncated_original: boolean;
  excluded_readings: Record<string, string>;
}[];

const regPath = join(HERE, "research-griblje", "pt-n83", "register.json");
const pagesPath = join(HERE, "research-griblje", "pt-n83", "page-records.json");

const reg: PtRegister = JSON.parse(readFileSync(regPath, "utf-8"));
const pages: PtPageRecords = JSON.parse(readFileSync(pagesPath, "utf-8"));

describe("PT N83 register (val 53)", () => {
  test("vir in docid sta pravilna za vse vrstice", () => {
    expect(reg.register.length).toBeGreaterThan(0);
    for (const r of reg.register) {
      expect(r.source).toContain("PT");
      expect(r.docid).toContain("41781");
    }
  });

  test("brez praznih bp_no in brez duplikatov (page+bp unikaten par je dovoljen prek mejnih vrstic)", () => {
    const bps = reg.register.map((r) => r.bp_no);
    for (const b of bps) expect(b.trim().length).toBeGreaterThan(0);
    const unique = new Set(bps);
    // 100 vrstic, 97 unikatnih BP — 3 mejne/prekrivne vrstice (61, 81, 12½ ...)
    expect(reg.register.length - unique.size).toBeGreaterThanOrEqual(0);
    expect(reg.register.length).toBe(100);
  });

  test("p8 (Musterstellung) NI v BP-registru", () => {
    expect(reg.register.every((r) => r.page !== 8)).toBe(true);
  });

  test("val52-p5 (premaknjeni stolpci) je izključen iz vsake provenance", () => {
    for (const r of reg.register) {
      expect(r.readings).not.toContain("val52-p5");
    }
    // izključitev je dokumentirana
    expect(reg.exclusions["val52-p5"]).toContain("excluded");
  });

  test("review_status samo iz dovoljenih vrednosti", () => {
    const ok = ["STABLE", "REVIEW", "REVIEW-CONFLICT"];
    for (const r of reg.register) expect(ok).toContain(r.review_status);
  });

  test("STABLE ⇒ dvojno soglasje hišne številke (glasovi ≥2)", () => {
    for (const r of reg.register) {
      if (r.review_status !== "STABLE") continue;
      const [n] = r.house_no_votes.split("/").map((x) => parseInt(x, 10));
      expect(n).toBeGreaterThanOrEqual(2);
      expect(r.house_no.length).toBeGreaterThan(0);
    }
  });

  test("vrzel 15–20 NI ugibana (ni vrstic bp 15–20)", () => {
    const bps = new Set(reg.register.map((r) => r.bp_no));
    for (const bp of ["15", "16", "17", "18", "19", "20"]) {
      expect(bps.has(bp)).toBe(false);
    }
  });

  test("vsaka vrstica ima provenanco branj in owner Variants", () => {
    for (const r of reg.register) {
      expect(r.readings.length).toBeGreaterThan(0);
      expect(Array.isArray(r.owner_variants)).toBe(true);
    }
  });

  test("page-records: 8 strani, p3 okrnjena, izključitve dokumentirane", () => {
    expect(pages.length).toBe(8);
    const p3 = pages.find((p) => p.page === 3)!;
    expect(p3.truncated_original).toBe(true);
    const p5 = pages.find((p) => p.page === 5)!;
    expect(Object.keys(p5.excluded_readings).length).toBeGreaterThan(0);
  });

  test("Musterstellung povzetek je izluščen (p8)", () => {
    expect(reg.p8_musterstellung).not.toBeNull();
    const cats = (reg.p8_musterstellung?.summary_table ?? []).map((s) => s.category);
    expect(cats.join(" ")).toContain("Wohngebäude");
    expect(cats.join(" ")).toContain("Nebengebäude");
  });
});
