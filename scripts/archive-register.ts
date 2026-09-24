/**
 * Arhivski register (issue #27/E + M) — upsert strukturiranih arhivskih
 * metapodatkov in pošteno vođenje researchStatus.
 *
 * Uporaba:
 *   bun scripts/archive-register.ts seed-priority        # vpiše P1★ M1–M4 iz archive-priority-records.json
 *   bun scripts/archive-register.ts list [institucija]   # izpiše registrirane enote
 *   bun scripts/archive-register.ts set-status --institution "…" --signature "…" \
 *        --status VIEWED --page-ref "str. 129" --notes "…"
 *
 * Pravilo #27/M: enota, ki ni prebrana, ostane NOT_VIEWED — trditve na
 * take enote ne morejo postati DOCUMENTED (evidence gate v src/lib/claims.ts).
 * researchStatus spreminjamo IZKLJUČNO z dejanskim branjem enote.
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const HERE = dirname(fileURLToPath(import.meta.url));

// .env iz repozitorija ima prednost pred morebitnim okoljem gostitelja
// (peskovnik lahko globalno izvozi DATABASE_URL drugega projekta).
try {
  const envFile = readFileSync(join(HERE, "..", ".env"), "utf8");
  const direct = envFile.match(/^DIRECT_URL="?([^"\n]+)"?/m)?.[1];
  const pooled = envFile.match(/^DATABASE_URL="?([^"\n]+)"?/m)?.[1];
  if (pooled) process.env.DATABASE_URL = pooled;
  if (direct) process.env.DIRECT_URL = direct;
} catch {
  // .env ne obstaja — uporabimo okolje (produkcija/CI z nastavljenimi vars)
}

const db = new PrismaClient();

const VALID_STATUS = ["NOT_VIEWED", "VIEWED_PARTIALLY", "VIEWED", "TRANSCRIBED"] as const;
type ResearchStatus = (typeof VALID_STATUS)[number];

function parseArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function seedPriority() {
  const file = join(HERE, "archive-priority-records.json");
  const records: Array<Record<string, unknown>> = JSON.parse(readFileSync(file, "utf8"));

  let created = 0;
  let updated = 0;
  for (const r of records) {
    const institution = String(r.institution);
    const signature = String(r.signature);
    const existing = await db.archiveRecord.findUnique({
      where: { institution_signature: { institution, signature } },
    });
    await db.archiveRecord.upsert({
      where: { institution_signature: { institution, signature } },
      create: r as never,
      update: r as never,
    });
    if (existing) updated++;
    else created++;
    console.log(`  ✓ ${signature} (${existing ? "posodobljen" : "nov"})`);
  }
  console.log(`P1★ M1–M4: ${created} novih, ${updated} posodobljenih (skupaj ${records.length}).`);
}

async function list(institution?: string) {
  const records = await db.archiveRecord.findMany({
    where: institution ? { institution: { contains: institution } } : undefined,
    orderBy: [{ institution: "asc" }, { signature: "asc" }],
  });
  if (!records.length) {
    console.log("Register je prazen — zaženite `seed-priority`.");
    return;
  }
  for (const r of records) {
    console.log(
      `  [${r.researchStatus.padEnd(17)}] ${r.signature} — ${r.fonds}` +
        (r.unit ? ` — ${r.unit}` : "") +
        ` (${r.institution})`
    );
  }
  console.log(`\n${records.length} enot. NOT_VIEWED = najdeno, ne prebrano (#27/M).`);
}

async function setStatus() {
  const institution = parseArg("--institution");
  const signature = parseArg("--signature");
  const status = parseArg("--status") as ResearchStatus | undefined;
  const pageRef = parseArg("--page-ref");
  const notes = parseArg("--notes");

  if (!institution || !signature || !status) {
    console.error(
      "Uporaba: set-status --institution \"…\" --signature \"…\" --status VIEWED [--page-ref \"…\"] [--notes \"…\"]"
    );
    process.exit(1);
  }
  if (!VALID_STATUS.includes(status)) {
    console.error(`Neznan status: ${status} (dovoljeno: ${VALID_STATUS.join(", ")})`);
    process.exit(1);
  }

  const existing = await db.archiveRecord.findUnique({
    where: { institution_signature: { institution, signature } },
  });
  if (!existing) {
    console.error(`Enota ne obstaja: ${signature} @ ${institution}`);
    process.exit(1);
  }

  const updated = await db.archiveRecord.update({
    where: { institution_signature: { institution, signature } },
    data: {
      researchStatus: status,
      ...(pageRef !== undefined ? { pageRef } : {}),
      ...(notes !== undefined ? { researcherNotes: notes } : {}),
    },
  });
  console.log(`✓ ${updated.signature} → ${updated.researchStatus}`);
  console.log("  Opomba: status sme na TRANSCRIBED/VIEWED samo po dejanskem branju (#27/M).");
}

async function main() {
  const cmd = process.argv[2];
  try {
    if (cmd === "seed-priority") await seedPriority();
    else if (cmd === "list") await list(process.argv[3]);
    else if (cmd === "set-status") await setStatus();
    else {
      console.error(
        "Uporaba: archive-register.ts <seed-priority | list [institucija] | set-status …>"
      );
      process.exit(1);
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
