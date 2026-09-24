/**
 * OBNOVA IN VALIDACIJA VARNOSTNE KOPIJE (issue #27, T — runbook del #2).
 *
 *   1. ustvari prazno ciljno bazo in vanjo preseli shemo:
 *        DATABASE_URL=<cilj> DIRECT_URL=<cilj> bunx prisma migrate deploy
 *   2. vrni odvod in primerjaj števce:
 *        RESTORE_URL=<cilj> bun scripts/restore-verify.ts backups/backup-<ČAS>
 *      (brez argumenta vzame najnovejši direktorij iz backups)
 *
 * Skripta v odvod (snapshot.json) vrne vse tabele in preveri, da števci po
 * tabelah in vsotah črk (museumNo brez duplikatov) ustrezajo manifestu.
 * Izhod 0 = obnova dokazano popolna, 1 = odstopanje.
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

export {};

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const arg = process.argv[2];

function resolveEnv(key: string): string {
  const fromProcess = process.env[key];
  if (fromProcess) return fromProcess;
  const envFile = fs.readFileSync(path.join(REPO_ROOT, ".env"), "utf8");
  const m = envFile.match(new RegExp(`^${key}="?([^"\n]+)"?`, "m"));
  if (!m) throw new Error(`${key} ni nastavljen (ne v env, ne v .env)`);
  return m[1];
}

/* --- 1. backup direktorij -------------------------------------------------- */

const backupDir = arg
  ? path.resolve(REPO_ROOT, arg)
  : fs
      .readdirSync(path.join(REPO_ROOT, "backups"))
      .filter((d) => d.startsWith("backup-"))
      .sort()
      .map((d) => path.join(REPO_ROOT, "backups", d))
      .at(-1);
if (!backupDir || !fs.existsSync(backupDir)) {
  console.error("✗ Ni direktorija varnostne kopije (backups/backup-*).");
  process.exit(1);
}

const snapshotFile = path.join(backupDir, "snapshot.json");
const manifest = JSON.parse(fs.readFileSync(path.join(backupDir, "manifest.json"), "utf8"));
const snapshotBytes = fs.statSync(snapshotFile).size;
const snapshotHash = createHash("sha256").update(fs.readFileSync(snapshotFile)).digest("hex");

if (snapshotBytes !== manifest.bytes || snapshotHash !== manifest.sha256) {
  console.error(`✗ Odtis odvoda se NE ujema z manifestom (${snapshotHash.slice(0, 16)}…) — kopija je okvarjena.`);
  process.exit(1);
}
console.log(`✓ Odtis odvoda ustreza manifestu: ${path.relative(REPO_ROOT, snapshotFile)}`);

const snapshot = JSON.parse(fs.readFileSync(snapshotFile, "utf8"));

/* --- 2. obnova v ciljno bazo ---------------------------------------------- */

const restoreUrl = resolveEnv("RESTORE_URL");
const pg = new Client({ connectionString: restoreUrl, ssl: { rejectUnauthorized: false } });
await pg.connect();
console.log(`▲ Cilj obnove: ${restoreUrl.replace(/:[^:@/]+@/, ":***@")}`);

const ORDER = ["Exhibit", "Source", "StoryItem", "MuseumEvent", "GuestbookEntry", "ObjectMemory", "StatDay"];
await pg.query(`TRUNCATE TABLE ${ORDER.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE;`);

for (const table of ORDER) {
  const rows: Record<string, unknown>[] = snapshot.tables[table] ?? [];
  if (rows.length === 0) continue;
  const cols = Object.keys(rows[0]);
  const colList = cols.map((c) => `"${c}"`).join(", ");
  const chunkSize = 500;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const values: unknown[] = [];
    const tuples = chunk.map((row, rowIdx) => {
      const ph = cols.map((c, cIdx) => {
        const v = row[c];
        values.push(v !== null && typeof v === "object" ? JSON.stringify(v) : v);
        return `$${rowIdx * cols.length + cIdx + 1}`;
      });
      return `(${ph.join(", ")})`;
    });
    await pg.query(`INSERT INTO "${table}" (${colList}) VALUES ${tuples.join(", ")}`, values);
  }
  console.log(`  ✓ ${table}: ${rows.length} vrstic vrnjenih`);
}

/* --- 3. validacija števcev ------------------------------------------------- */

let mismatch = 0;
for (const table of ORDER) {
  const expected = Number(manifest.counts[table] ?? 0);
  const got = await pg.query(`SELECT COUNT(*)::int AS n FROM "${table}"`);
  const n = got.rows[0].n as number;
  const mark = n === expected ? "✓" : "✗";
  if (n !== expected) mismatch += 1;
  console.log(`  ${mark} ${table}: ${n} (pričakovano ${expected})`);
}

const ids = await pg.query<{ n: number }>(
  `SELECT COUNT(*)::int AS n FROM (SELECT "museumNo" FROM "Exhibit" WHERE "museumNo" IS NOT NULL GROUP BY "museumNo" HAVING COUNT(*) > 1) d`
);
if (ids.rows[0].n !== 0) {
  console.error("✗ Podvojeni museumNo po obnovi!");
  mismatch += 1;
} else {
  console.log("  ✓ museumNo brez duplikatov.");
}

await pg.end();

if (mismatch > 0) {
  console.error(`\nOBNOVA NI POPOLNA: ${mismatch} odstopanj.`);
  process.exit(1);
}
console.log("\n✓ OBNOVA VALIDIRANA — vsi števci se ujemajo z manifestom.");
