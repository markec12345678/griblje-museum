/**
 * GDPR retencija (issue #27/H) — izvrševanje pravil retencije.
 *
 *   bun scripts/gdpr-retention.ts            # izvrši retencijo (Job evidenco zapiše)
 *   bun scripts/gdpr-retention.ts --dry-run  # samo poročilo, brez izbrisa
 *   bun scripts/gdpr-retention.ts --anonymize-guestbook <id>
 *   bun scripts/gdpr-retention.ts --anonymize-memory <id>
 *
 * Pravila (src/lib/gdpr.ts):
 *   - rejected  ≥ 30 dni → fizicni izbris;
 *   - deleted   ≥ 30 dni → fizicni izbris (mehki izbris pomeče);
 *   - hidden    ≥ 365 dni → POROČILO za moderatorja (ne samodejni izbris).
 *
 * Zabeleži se Job (type=retention, idempotencyKey=retention-<dan>) —
 * ponovni zagon istega dne ne podvoji dela (issue #27/W).
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { retentionCutoffs, RETENTION, ANONYMOUS_NAME } from "../src/lib/gdpr";

const HERE = dirname(fileURLToPath(import.meta.url));

// .env iz repozitorija ima prednost pred okoljem gostitelja (peskovnik).
try {
  const envFile = readFileSync(join(HERE, "..", ".env"), "utf8");
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
const anonGuestbook = args.includes("--anonymize-guestbook") ? args[args.indexOf("--anonymize-guestbook") + 1] : null;
const anonMemory = args.includes("--anonymize-memory") ? args[args.indexOf("--anonymize-memory") + 1] : null;

async function anonymize() {
  if (anonGuestbook) {
    const e = await db.guestbookEntry.update({
      where: { id: anonGuestbook },
      data: { name: ANONYMOUS_NAME, place: null },
    });
    console.log(`✓ spominska knjiga ${e.id}: ime anonimizirano, kraj odstranjen (GDPR čl. 17)`);
  }
  if (anonMemory) {
    const m = await db.objectMemory.update({
      where: { id: anonMemory },
      data: { author: ANONYMOUS_NAME, place: null },
    });
    console.log(`✓ spomin ${m.id}: avtor anonimiziran, kraj odstranjen (GDPR čl. 17)`);
  }
}

async function retention() {
  const now = new Date();
  const c = retentionCutoffs(now);
  const day = now.toISOString().slice(0, 10);
  const idempotencyKey = `retention-${day}`;

  // Idempotenca: isti dan = isti job (issue #27/W).
  const existing = await db.job.findUnique({ where: { idempotencyKey } });
  if (existing && existing.status === "SUCCEEDED" && !dryRun) {
    console.log(`Retencija za ${day} je že izvršena (Job ${existing.id}) — brez ponovitve.`);
    return;
  }

  const job = dryRun
    ? null
    : await (async () =>
        existing
          ? db.job.update({
              where: { idempotencyKey },
              data: { status: "RUNNING", attempts: { increment: 1 }, startedAt: now, error: null },
            })
          : db.job.create({
              data: {
                type: "retention",
                status: "RUNNING",
                idempotencyKey,
                startedAt: now,
                correlationId: `retention-${day}`,
              },
            }))();

  try {
    // --- rejected → fizicni izbris -------------------------------------
    const oldRejectedGb = await db.guestbookEntry.findMany({
      where: { status: "rejected", createdAt: { lt: c.rejectedBefore } },
      select: { id: true },
    });
    const oldRejectedMem = await db.objectMemory.findMany({
      where: { status: "rejected", createdAt: { lt: c.rejectedBefore } },
      select: { id: true },
    });
    if (!dryRun) {
      await db.guestbookEntry.deleteMany({
        where: { id: { in: oldRejectedGb.map((e) => e.id) } },
      });
      await db.objectMemory.deleteMany({
        where: { id: { in: oldRejectedMem.map((e) => e.id) } },
      });
    }
    console.log(`rejected ≥ ${RETENTION.rejectedDays} dni: ${oldRejectedGb.length} knjiga + ${oldRejectedMem.length} spominov → fizicno izbrisani${dryRun ? " (DRY RUN — nič izbrisano)" : ""}`);

    // --- deleted (mehko) → fizicni izbris -------------------------------
    const oldDeletedGb = await db.guestbookEntry.findMany({
      where: { status: "deleted", deletedAt: { lt: c.deletedBefore } },
      select: { id: true },
    });
    const oldDeletedMem = await db.objectMemory.findMany({
      where: { status: "deleted", deletedAt: { lt: c.deletedBefore } },
      select: { id: true },
    });
    if (!dryRun) {
      await db.guestbookEntry.deleteMany({
        where: { id: { in: oldDeletedGb.map((e) => e.id) } },
      });
      await db.objectMemory.deleteMany({
        where: { id: { in: oldDeletedMem.map((e) => e.id) } },
      });
    }
    console.log(`deleted ≥ ${RETENTION.softDeletedDays} dni: ${oldDeletedGb.length} knjiga + ${oldDeletedMem.length} spominov → fizicno izbrisani${dryRun ? " (DRY RUN)" : ""}`);

    // --- hidden ≥ 365 dni → poročilo za moderatorja ---------------------
    const oldHiddenGb = await db.guestbookEntry.count({
      where: { status: "hidden", moderatedAt: { lt: c.hiddenReviewBefore } },
    });
    const oldHiddenMem = await db.objectMemory.count({
      where: { status: "hidden", moderatedAt: { lt: c.hiddenReviewBefore } },
    });
    if (oldHiddenGb + oldHiddenMem > 0) {
      console.log(`⚠ SKRITO ≥ 365 dni: ${oldHiddenGb} knjiga + ${oldHiddenMem} spominov — potreben moderatorski pregled (odobri ali trajno izbriši).`);
    }

    if (!dryRun && job) {
      await db.job.update({
        where: { id: job.id },
        data: {
          status: "SUCCEEDED",
          completedAt: new Date(),
          payload: {
            rejectedPurged: oldRejectedGb.length + oldRejectedMem.length,
            deletedPurged: oldDeletedGb.length + oldDeletedMem.length,
            hiddenReviewNeeded: oldHiddenGb + oldHiddenMem,
          },
        },
      });
    }
  } catch (error) {
    if (!dryRun && job) {
      await db.job.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          error: String(error).slice(0, 2000),
        },
      });
    }
    throw error;
  }
}

async function main() {
  try {
    if (anonGuestbook || anonMemory) await anonymize();
    else await retention();
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
