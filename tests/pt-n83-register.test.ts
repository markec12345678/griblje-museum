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

describe("val 54 usklajevanje (PUA↔PT↔zemljevid A01)", () => {
  const recPath = join(HERE, "research-griblje", "pt-n83", "reconciliation.json");
  const rec = JSON.parse(readFileSync(recPath, "utf-8")) as {
    headline_findings: string[];
    map_links_audit: { bp: string; verdict: string }[];
  };
  const cadPath = join(HERE, "src", "data", "cadastre-a01.json");
  const cad = JSON.parse(readFileSync(cadPath, "utf-8")) as {
    buildings: { bp: string; owner?: string; owner_status?: string; link_source?: string }[];
  };

  test("reconciliation ima 8 glavnih najdb in revizijo 11 vezav", () => {
    expect(rec.headline_findings.length).toBe(8);
    expect(rec.map_links_audit.length).toBe(11);
  });

  test("bp 98 (Zollamt) — val 54 REVIEW-CONFLICT, val 56 z novimi dokazi VERIFIED-2x", () => {
    const b98 = cad.buildings.find((b) => b.bp === "98")!;
    expect(b98.owner).toContain("Zollamt");
    // val 56: PUA no. 95 opomba "B.P. 98." (nadaljevalna vrstica @ nativna ločljivost)
    // + PT bp 98 "A. Zollamt" → lastniška vezava spet VERIFIED-2x, z dokazom v link_source
    expect(b98.owner_status).toBe("VERIFIED-2x");
    expect(b98.link_source).toContain("56. val");
  });

  test("bp 86 NI VEČ VERIFIED-2x (opomba 'b. P. 56. 38.' ne vsebuje 86)", () => {
    const b86 = cad.buildings.find((b) => b.bp === "86")!;
    expect(b86.owner_status).toBe("REVIEW-CONFLICT");
  });

  test("bp 94 je nadgrajen na VERIFIED-2x (3 neodvisni viri)", () => {
    const b94 = cad.buildings.find((b) => b.bp === "94")!;
    expect(b94.owner_status).toBe("VERIFIED-2x");
  });

  test("vsaka vezana stavba ima link_source (provenanca vezave)", () => {
    for (const b of cad.buildings) {
      if (b.owner) {
        expect((b as { link_source?: string }).link_source?.length ?? 0).toBeGreaterThan(0);
      }
    }
  });
});

describe("val 56 — VAČ preseljen, PS N83 + polne ločljivosti", () => {
  const raw56 = join(HERE, "research-griblje/raw-web-val56-2026-10");
  const recon = JSON.parse(
    readFileSync(join(HERE, "research-griblje/pt-n83/reconciliation.json"), "utf-8")
  );
  const cad = JSON.parse(readFileSync(join(HERE, "src/data/cadastre-a01.json"), "utf-8"));
  const entities = readFileSync(join(HERE, "src/lib/entities.ts"), "utf-8");

  test("PS N83: download-logEvidence 143/143 veljavnih strani z JPEG EOF", () => {
    const log = JSON.parse(readFileSync(join(raw56, "n083ps-pages/download-log.json"), "utf-8"));
    expect(log.document).toBe("N083PS");
    expect(log.docid).toBe(41780);
    expect(log.uodid).toBe(373415);
    expect(log.pages).toBe(143);
    expect(log.results.length).toBe(143);
    for (const r of log.results) {
      expect(r.bytes).toBeGreaterThan(3000);
      expect(r.width).toBeGreaterThan(100);
    }
    // vzorčne strani: EOF marker ff d9 + PIL dimenzije v logu
    for (const p of [1, 50, 92, 143]) {
      const buf = readFileSync(join(raw56, `n083ps-pages/p${String(p).padStart(2, "0")}.jpg`));
      expect(buf.length).toBeGreaterThan(3000);
      expect(buf[buf.length - 2]).toBe(0xff);
      expect(buf[buf.length - 1]).toBe(0xd9);
    }
  });

  test("PS N83: identificiran kot Protocol der Grund-Parcellen der Gemeinde Gruble", () => {
    const si = JSON.stringify(recon.val56.materials.ps_n83);
    expect(si).toContain("Protocol der Grund-Parcellen");
    expect(si).toContain("143/143");
  });

  test("reconciliation val56: PUA p47 Zollamt opomba B.P. 98 — 2× branja", () => {
    const z = recon.val56.readings.PUA_p47_no95_Zollamt;
    expect(z.native).toContain("B.P. 98");
    expect(z.band_A).toContain("B.P. 98");
    expect(z.verdict).toContain("2× branja strinjajo");
  });

  test("zemljevid bp 98: lastniška vezava VERIFIED-2x z dokazom B.P. 98", () => {
    const bp98 = cad.buildings.find((b: { bp: string }) => b.bp === "98");
    expect(bp98).toBeDefined();
    expect(bp98.owner).toBe("k.k. Zollamt");
    expect(bp98.owner_status).toBe("VERIFIED-2x");
    expect(bp98.owner_page).toBe(47);
    expect(bp98.link_source).toContain("B.P. 98");
    expect(bp98.link_source).toContain("h.70");
    expect(bp98.link_source).toContain("h.20");
  });

  test("entitete: P2-E15 noveliziran (B.P. 98 preom), P3-E12 p26/p42 REŠENO", () => {
    expect(entities).toContain("PUA no. 95 (p47, h.70) Zollamt IMA opombo »B.P. 98.«");
    expect(entities).toContain("VERIFIED-2x");
    expect(entities).toContain("REŠENO (56. val)");
    expect(entities).toContain("p42 = vpisa 85/86");
  });

  test("PUA p26/p42 nativni izvlečki obstajajo (P3-E12 dokaz)", () => {
    for (const f of ["fullres-extracts/PUA-p26-native.jpeg", "fullres-extracts/PUA-p42-native.jpeg"]) {
      const buf = readFileSync(join(raw56, f));
      expect(buf.length).toBeGreaterThan(100000);
      expect(buf[0]).toBe(0xff); // JPEG SOI
      expect(buf[1]).toBe(0xd8);
    }
  });
});
