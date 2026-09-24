/**
 * VARNOSTNA KOPIJA BAZE (issue #27, točka T — P0; PostgreSQL/Neon, A1).
 *
 *   bun run db:backup
 *
 * Ustvari logični odvod vsebine baze: backups/backup-<ČAS>/snapshot.json
 * (vse tabele, vse vrstice, JSON) + manifest.json z velikostjo, SHA-256
 * povzetkom, git HEAD in živimi števci — brez checksuma kopija ni dokazljiva.
 *
 * Zakaj JSON in ne pg_dump: priložnostna pot brez zunanjih orodij (deluje v
 * peskovniku, CI in na Vercelu); operater pa v produkciji vedno lahko uporabi
 * kanonični pg_dump — postopki so enakovredni, glej docs/BACKUP-RESTORE.md.
 * Obnova: docs/BACKUP-RESTORE.md (migrate deploy + scripts/restore-verify.ts).
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

export {};

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const BACKUP_ROOT = path.join(REPO_ROOT, "backups");
const KEEP = 10; // število ohranjenih zadnjih kopij

process.env.DATABASE_URL =
  process.env.DIRECT_URL ??
  (() => {
    const envFile = fs.readFileSync(path.join(REPO_ROOT, ".env"), "utf8");
    return envFile.match(/^DIRECT_URL="?([^"\n]+)"?/m)?.[1] ?? process.env.DATABASE_URL;
  })();

const { db } = await import("../src/lib/db");

function sha256(file: string): string {
  const hash = createHash("sha256");
  hash.update(fs.readFileSync(file));
  return hash.digest("hex");
}

function gitHead(): string | null {
  try {
    return execSync("git rev-parse HEAD", { cwd: REPO_ROOT }).toString().trim();
  } catch {
    return null;
  }
}

/* --- odvod -------------------------------------------------------------- */

const TABLES = [
  ["Exhibit", () => db.exhibit.findMany()],
  ["Source", () => db.source.findMany()],
  ["StoryItem", () => db.storyItem.findMany()],
  ["MuseumEvent", () => db.museumEvent.findMany()],
  ["GuestbookEntry", () => db.guestbookEntry.findMany()],
  ["ObjectMemory", () => db.objectMemory.findMany()],
  ["StatDay", () => db.statDay.findMany()],
] as const;

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const targetDir = path.join(BACKUP_ROOT, `backup-${stamp}`);
fs.mkdirSync(targetDir, { recursive: true });
const snapshotFile = path.join(targetDir, "snapshot.json");

const counts: Record<string, number> = {};
const tables: Record<string, unknown[]> = {};
for (const [name, read] of TABLES) {
  const rows = await read();
  counts[name] = rows.length;
  tables[name] = rows;
  console.log(`  ✓ ${name}: ${rows.length} vrstic`);
}

fs.writeFileSync(snapshotFile, JSON.stringify({ createdAt: new Date().toISOString(), counts, tables }, null, 1));

const manifest = {
  createdAt: new Date().toISOString(),
  provider: "postgresql (Neon)",
  file: path.relative(REPO_ROOT, snapshotFile),
  bytes: fs.statSync(snapshotFile).size,
  sha256: sha256(snapshotFile),
  counts,
  gitHead: gitHead(),
  note: "Logični odvod PostgreSQL (JSON); SHA-256 + števci (issue #27/T, A1).",
};
fs.writeFileSync(path.join(targetDir, "manifest.json"), JSON.stringify(manifest, null, 2));

/* --- ohranjanje: izloči najstarejše kopije prek meje ----------------------- */

const dirs = fs
  .readdirSync(BACKUP_ROOT)
  .filter((d) => d.startsWith("backup-") && fs.statSync(path.join(BACKUP_ROOT, d)).isDirectory())
  .sort(); // imena so časovno urejena (ISO oblika)
for (const old of dirs.slice(0, Math.max(0, dirs.length - KEEP))) {
  fs.rmSync(path.join(BACKUP_ROOT, old), { recursive: true, force: true });
  console.log(`− izločena stara kopija: ${old}`);
}

console.log(`✓ Odvod: ${manifest.file}`);
console.log(`  ${manifest.bytes} bajtov · SHA-256 ${manifest.sha256.slice(0, 16)}…`);
console.log(`  števci: ${Object.values(counts).join("/")} · git HEAD ${manifest.gitHead ?? "(ni gita)"}`);
console.log(`  Obnova: docs/BACKUP-RESTORE.md`);

await db.$disconnect();
