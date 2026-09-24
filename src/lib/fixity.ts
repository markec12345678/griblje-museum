/**
 * Digitalna preservacija — fixity preverba (issue #27/N).
 *
 * Veriga: Original → Checksum → Master → Derivat → Metapodatki → Pravice
 * → IIIF/javna predstavitev. IIIF je presentation sloj, NE nadomestilo za
 * preservacijo — preservacija temelji na SHA-256 checksumu masterja.
 *
 * Periodična preverba: vsak DigitalAsset ima ob vpisu izračunan SHA-256
 * (scripts/asset-register.ts). Ta modul ponovno izračuna checksum vsebine
 * na hranilniku in primerja:
 *   - VERIFIED  — checksum ujema (vsebina nedotaknjena);
 *   - CORRUPTED — datoteka obstaja, checksum NE ujema (poškodba!);
 *   - MISSING   — datoteka ni dosegljiva na hranilniku (manjkajoča).
 *
 * Evidenca manjkajočih/poškodovanih assetov je obvezen izdelek preverbe —
 * scripts/fixity-check.ts jo zapiše v Job.payload (issue #27/W).
 */

import { createHash } from "node:crypto";

export type FixityStatus = "VERIFIED" | "CORRUPTED" | "MISSING";

export type FixityEntry = {
  id: string;
  storageKey: string;
  sha256: string;
};

export type FixityResult = {
  id: string;
  storageKey: string;
  status: FixityStatus;
  /** Dejanski checksum (ko je datoteka dosegljiva). */
  actualSha256?: string;
  detail?: string;
};

export type FixitySummary = {
  total: number;
  verified: number;
  corrupted: number;
  missing: number;
  results: FixityResult[];
};

/** Vrne vsebino ali null, če datoteka ni dosegljiva. */
export type ContentReader = (storageKey: string) => Buffer | null;

export function sha256Of(content: Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

/** Preveri fixity nad seznamom assetov s podanim bralnikom hranilnika. */
export function checkFixity(entries: FixityEntry[], read: ContentReader): FixitySummary {
  const results: FixityResult[] = [];

  for (const entry of entries) {
    const content = read(entry.storageKey);
    if (content === null) {
      results.push({
        id: entry.id,
        storageKey: entry.storageKey,
        status: "MISSING",
        detail: "vsebina ni dosegljiva na hranilniku",
      });
      continue;
    }
    const actual = sha256Of(content);
    if (actual === entry.sha256.toLowerCase()) {
      results.push({ id: entry.id, storageKey: entry.storageKey, status: "VERIFIED", actualSha256: actual });
    } else {
      results.push({
        id: entry.id,
        storageKey: entry.storageKey,
        status: "CORRUPTED",
        actualSha256: actual,
        detail: `pričakovano ${entry.sha256}, dejansko ${actual}`,
      });
    }
  }

  return {
    total: results.length,
    verified: results.filter((r) => r.status === "VERIFIED").length,
    corrupted: results.filter((r) => r.status === "CORRUPTED").length,
    missing: results.filter((r) => r.status === "MISSING").length,
    results,
  };
}
