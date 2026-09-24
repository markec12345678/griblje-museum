/**
 * Fixity preverba preservacije (issue #27/N) — kot ozadnje opravilo
 * (issue #27/W): Job z idempotencyKey `checksum-verify-<dan>`.
 *
 *   bun scripts/fixity-check.ts             # preverba + poročilo + Job evidenca
 *   bun scripts/fixity-check.ts --dry-run   # brez Job zapisa
 *   bun scripts/fixity-check.ts --flag      # MISSING/CORRUPTED → preservationStatus DEGRADED
 *
 * Hranilnik: storageKey je pot relativna na koren repozitorija
 * (dogovor `assets/<sha256>/<ime>`; na produkcijskih hranilnikih S3/R2 se
 * bralnik zamenja z SDK klicem — vmesnik ContentReader je enak).
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { checkFixity, type ContentReader } from "../src/lib/fixity";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");

// .env iz repozitorija ima prednost pred okoljem gostitelja (peskovnik).
try {
  const envFile = readFileSync(join(REPO_ROOT, ".env"), "utf8");
  const direct = envFile.match(/^DIRECT_URL="?([^"\n]+)"?/m)?.[1];
  const pooled = envFile.match(/^DATABASE_URL="?([^"\n]+)"?/m)?.[1];
  if (pooled) process.env.DATABASE_URL = pooled;
  if (direct) process.env.DIRECT_URL = direct;
} catch {
  // .env ne obstaja — uporabimo okolje (produkcija/CI)
}

const db = new PrismaClient();
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const flag = args.includes("--flag");

/** Lokalni hranilnik: repozitorni koren + storageKey. */
const localReader: ContentReader = (storageKey) => {
  const filePath = join(REPO_ROOT, storageKey);
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath);
};

async function main() {
  const now = new Date();
  const idempotencyKey = `checksum-verify-${now.toISOString().slice(0, 10)}`;

  const assets = await db.digitalAsset.findMany({
    select: { id: true, storageKey: true, sha256: true },
  });

  const summary = checkFixity(
    assets.map((a) => ({ ...a })),
    localReader
  );

  for (const r of summary.results) {
    const mark =
      r.status === "VERIFIED" ? "✓" : r.status === "CORRUPTED" ? "✗" : "⚠";
    console.log(`${mark} [${r.status}] ${r.storageKey}${r.detail ? ` — ${r.detail}` : ""}`);
  }
  console.log(
    `\nPreservacija: ${summary.verified} VERIFIED, ${summary.corrupted} CORRUPTED, ${summary.missing} MISSING (skupaj ${summary.total}).`
  );

  // --flag: poškodovane/manjkajoče označi DEGRADED (evidenca ostane v Jobu).
  if (flag && !dryRun) {
    const degraded = summary.results.filter((r) => r.status !== "VERIFIED");
    for (const r of degraded) {
      await db.digitalAsset.update({
        where: { id: r.id },
        data: { preservationStatus: "DEGRADED" },
      });
      console.log(`  → DEGRADED: ${r.storageKey}`);
    }
    if (degraded.length === 0) console.log("  Nič za označitev — vsebina nedotaknjena.");
  }

  if (!dryRun) {
    const existing = await db.job.findUnique({ where: { idempotencyKey } });
    if (existing?.status === "SUCCEEDED") {
      console.log(`Fixity za danes je že uspešno zabeležena (Job ${existing.id}).`);
      return;
    }
    const payload = {
      total: summary.total,
      verified: summary.verified,
      corrupted: summary.corrupted,
      missing: summary.missing,
      degradedFlagged: flag ? summary.corrupted + summary.missing : 0,
    };
    if (existing) {
      await db.job.update({
        where: { idempotencyKey },
        data: { status: "SUCCEEDED", completedAt: new Date(), attempts: { increment: 1 }, payload },
      });
    } else {
      await db.job.create({
        data: {
          type: "checksum-verify",
          status: "SUCCEEDED",
          idempotencyKey,
          correlationId: `fixity-${now.toISOString().slice(0, 10)}`,
          startedAt: now,
          completedAt: new Date(),
          payload,
        },
      });
    }
    console.log(`Job evidenca: ${idempotencyKey} ✓`);

    // Evidenca manjkajočih/poškodovanih NI tiha: neuspeh = izhod 1 (CI opozorilo).
    if (summary.corrupted + summary.missing > 0) process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
