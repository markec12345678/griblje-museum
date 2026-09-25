import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";

/**
 * Namenski PUA QA (issue #35 §16) — register PUA N83 (1825) mora biti
 * sledljiv in pošten: vsak vpis ima pageRef 1–49, nobeno negotovo branje
 * ni označeno kot verificirano, okrnjeni strani (p26/p42) ne prispevata
 * vpisov, vir je vedno naveden.
 */

const HERE = dirname(import.meta.dir);

type PuaParcel = { parcel_section: string; parcel_number: string };

type PuaEntry = {
  source: string;
  document_id: string;
  page: number;
  entry_no: string;
  section: string;
  house_no: string;
  owner_original: string;
  status_original: string;
  residence_original: string;
  parcels: PuaParcel[];
  annotation_original: string;
  transcription_confidence: string;
  review_status: string;
  uncertain_words: string[];
  reading_provenance: string;
  notes: string;
};

type PageRecord = {
  page: number;
  version: string;
  status: string;
  readable: boolean;
  readable_body?: boolean;
  pass1_entries: number;
  pass2_verification: boolean;
  pass3_targeted: boolean;
};

const register: PuaEntry[] = JSON.parse(
  readFileSync(join(HERE, "research-griblje/pua-n83/register.json"), "utf8")
);

const pageRecords: PageRecord[] = JSON.parse(
  readFileSync(join(HERE, "research-griblje/pua-n83/page-records.json"), "utf8")
);

const VERIFIED = new Set(["VERIFIED-2x", "VERIFIED-2x-ADDED"]);
const REVIEW_PREFIX = "REVIEW";

describe("pua-n83/register.json (issue #35 §7/§16)", () => {
  test("register obstaja in ima vsaj 90 vpisov (coverage 47/49 strani)", () => {
    expect(register.length).toBeGreaterThanOrEqual(90);
  });

  test("vsak vpis ima vir, docid in veljaven pageRef 1–49", () => {
    for (const e of register) {
      expect(e.source).toBe("SI AS 176/N/N83/s/PUA");
      expect(e.document_id).toBe("VAČ docid 41782");
      expect(Number.isInteger(e.page)).toBe(true);
      expect(e.page).toBeGreaterThanOrEqual(1);
      expect(e.page).toBeLessThanOrEqual(49);
    }
  });

  test("vsak vpis ima owner_original in reading_provenance", () => {
    for (const e of register) {
      expect(e.owner_original.length).toBeGreaterThan(0);
      expect(e.reading_provenance.length).toBeGreaterThan(0);
    }
  });

  test("parcele so strukturirane (ločene, ne zlepljene)", () => {
    for (const e of register) {
      for (const p of e.parcels) {
        expect(typeof p.parcel_section).toBe("string");
        expect(typeof p.parcel_number).toBe("string");
        expect(p.parcel_number.length).toBeGreaterThan(0);
        // parcelna številka ne sme vsebovati vejic/več števil naenkrat
        expect(p.parcel_number.includes(",")).toBe(false);
      }
    }
  });

  test("verificiran vpis (VERIFIED-2x) ima visoko zaupanje in brez neodločenih besed", () => {
    for (const e of register) {
      if (VERIFIED.has(e.review_status)) {
        expect(e.transcription_confidence).toBe("high");
        expect(e.uncertain_words.length).toBe(0);
      }
    }
  });

  test("noben REVIEW vpis ni brez obrazložitve (notes ali uncertain_words)", () => {
    for (const e of register) {
      if (e.review_status.startsWith(REVIEW_PREFIX)) {
        const explained =
          e.uncertain_words.length > 0 ||
          e.notes.length > 0 ||
          e.transcription_confidence !== "high";
        expect(explained).toBe(true);
      }
    }
  });

  test("vpisi z okrnjenih strani p26/p42 imajo izrecno NATIVNO provenanco val 57 (667px verzija ostaja zavrnjena)", () => {
    // val 51: p26/p42 TRUNCATED → 0 vpisov. val 56: PDF-native ekstrakcija
    // (1391×2145 / 1400×2151), val 57: branje — vpisa 51+52 (p26), 85+86 (p42).
    // Varovalka: vsak vpis s teh strani MORA imeti val 57 nativno provenanco,
    // nikoli branje iz starejše okrnjene 667px verzije (UNVERIFIED ni fact).
    const fromTruncated = register.filter((e) => e.page === 26 || e.page === 42);
    expect(fromTruncated.length).toBe(4);
    for (const e of fromTruncated) {
      expect(e.reading_provenance).toContain("val 57");
      expect(e.reading_provenance).toContain("native");
      expect(e.review_status).not.toBe("VERIFIED-2x"); // 1× branje
      expect(e.notes).toContain("VAL 57");
    }
  });

  test("podvojenih (page, entry_no) parov med VERIFIED vpisi ni", () => {
    const seen = new Map<string, number>();
    for (const e of register) {
      if (!VERIFIED.has(e.review_status)) continue;
      const key = `${e.page}#${e.entry_no}`;
      expect(seen.has(key)).toBe(false);
      seen.set(key, 1);
    }
  });

  test("vsak podvojen entry_no je označen kot REVIEW (konflikt dokumentiran)", () => {
    const counts = new Map<string, number>();
    for (const e of register) {
      const key = `${e.page}#${e.entry_no}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    for (const [key, n] of counts) {
      if (n > 1) {
        const rows = register.filter((e) => `${e.page}#${e.entry_no}` === key);
        // vsaka dup skupina mora imeti vsaj en REVIEW vpis (konflikt dokumentiran)
        const anyReview = rows.some((r) => r.review_status.startsWith(REVIEW_PREFIX));
        expect(anyReview).toBe(true);
      }
    }
  });

  test("hišne številke so veljavne (številka 1–99 ali prazna za institucije)", () => {
    for (const e of register) {
      if (e.house_no === "") continue;
      expect(/^\d{1,2}(\[\?])?$/.test(e.house_no)).toBe(true);
      const num = parseInt(e.house_no, 10);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(99);
    }
  });

  test("pokritost hiš in ključnih §4 vpisov", () => {
    const houses = new Set(
      register
        .filter((e) => /^\d+$/.test(e.house_no))
        .map((e) => parseInt(e.house_no, 10))
    );
    expect(houses.size).toBeGreaterThanOrEqual(45);

    // §4: Gradac z III 748/777 (p11 ima dva kandidatna branja za no=20)
    const p11no20 = register.filter((e) => e.page === 11 && e.entry_no === "20");
    expect(p11no20.length).toBeGreaterThanOrEqual(2);
    const gradac = p11no20.find((e) =>
      e.owner_original.toLowerCase().includes("grad")
    );
    expect(gradac).toBeDefined();
    const gradacParcels = gradac!.parcels
      .map((p) => p.parcel_number)
      .sort();
    expect(gradacParcels).toContain("748");
    expect(gradacParcels).toContain("777");

    // §4: h.46 = Lahodathar (val48 'Ribetitsch' revizija)
    const h46 = register.filter((e) => e.house_no === "46");
    expect(h46.length).toBeGreaterThan(0);
    expect(h46.some((e) => e.owner_original.includes("Lahodathar"))).toBe(
      true
    );
    expect(
      h46.some((e) => e.owner_original.includes("Ribetitsch"))
    ).toBe(false);

    // §4: Zollamt, St. Veith, Commenda, Zucchelli (Nro. 97)
    const allOwners = register.map((e) => e.owner_original.toLowerCase());
    expect(allOwners.some((o) => o.includes("zollamt"))).toBe(true);
    expect(allOwners.some((o) => o.includes("veith"))).toBe(true);
    expect(allOwners.some((o) => o.includes("commenda"))).toBe(true);
    const no97 = register.find((e) => e.page === 49 && e.entry_no === "97");
    expect(no97).toBeDefined();
    expect(no97!.owner_original.toLowerCase()).toContain("zucchelli");
  });

  test("noben vpis ne omenja ugibanj: uncertain besede so vedno z [?]", () => {
    for (const e of register) {
      for (const w of e.uncertain_words) {
        expect(w.includes("[?]") || w.includes("nečitljivo")).toBe(true);
      }
    }
  });
});

describe("pua-n83/page-records.json (issue #35 §1/§5/§6/§15)", () => {
  test("vseh 49 strani je registriranih", () => {
    expect(pageRecords.length).toBe(49);
    const pages = new Set(pageRecords.map((r) => r.page));
    for (let p = 1; p <= 49; p++) expect(pages.has(p)).toBe(true);
  });

  test("p26/p42: okrnjeni 667px status zamenjan z nativnim branjem (val 57) — zabeležen z nativnimi vpisi", () => {
    for (const p of [26, 42]) {
      const rec = pageRecords.find((r) => r.page === p);
      expect(rec).toBeDefined();
      expect(rec!.status).toBe("READ (native verzija, val 57)");
      expect(rec!.native_entries).toBe(2);
    }
  });

  test("p27/p29/p40 imajo recovered verzije in so prebrane", () => {
    for (const p of [27, 29, 40]) {
      const rec = pageRecords.find((r) => r.page === p);
      expect(rec).toBeDefined();
      expect(rec!.version).toContain("recovered");
      expect(rec!.pass2_verification).toBe(true);
    }
  });

  test("44 ali več strani ima verifikacijski prehod (2× branje)", () => {
    const verified = pageRecords.filter((r) => r.pass2_verification).length;
    expect(verified).toBeGreaterThanOrEqual(44);
  });
});
