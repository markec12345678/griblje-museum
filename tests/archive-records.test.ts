import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";

/**
 * Validacija prioritiznih arhivskih zapisov (issue #27/E + M) — podatkovna
 * datoteka mora biti popolna in poštena: NOT_VIEWED pomeni »najdeno, ne
 * prebrano« in ne sme biti zamenjan z VIEWED brez dejanskega branja.
 */

const HERE = dirname(import.meta.dir);

type PriorityRecord = {
  institution: string;
  signature: string;
  fonds: string;
  researchStatus: string;
  accessLevel?: string;
  digitized?: boolean;
};

const records: PriorityRecord[] = JSON.parse(
  readFileSync(join(HERE, "scripts/archive-priority-records.json"), "utf8")
);

describe("archive-priority-records.json (#27/M1–M4)", () => {
  test("vsebuje vsaj 5 prioritnih P1★ enot", () => {
    expect(records.length).toBeGreaterThanOrEqual(5);
  });

  test("vsak zapis ima ustanovo, fond in signaturo", () => {
    for (const r of records) {
      expect(r.institution.length).toBeGreaterThan(1);
      expect(r.fonds.length).toBeGreaterThan(1);
      expect(r.signature.length).toBeGreaterThan(1);
    }
  });

  test("vsak zapis je pošteno NOT_VIEWED (najdeno, ne prebrano)", () => {
    for (const r of records) {
      expect(r.researchStatus).toBe("NOT_VIEWED");
    }
  });

  test("M1–M4 pokritost: šola, SA popis, kataster, volilni spisi", () => {
    const signatures = records.map((r) => r.signature);
    expect(signatures).toContain("SI_ZAL_ČRN/0001/001/00012"); // M1: šolski list 1929–41
    expect(signatures.some((s) => s.startsWith("NŠAL SA PODZEMELJ"))).toBe(true); // M2: status animarum
    expect(signatures).toContain("SI AS 749/3/8/12"); // M3: katastrski izpisek
    expect(signatures.some((s) => s.startsWith("SI AS 16/"))).toBe(true); // M4: volilni spisi
  });
});
