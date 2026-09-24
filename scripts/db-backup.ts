/**
 * VARNOSTNA KOPIJA BAZE (issue #27, točka T — P0).
 *
 * Ustvari potrjeno kopijo SQLite baze:
 *   bun run db:backup
 *
 * Kopija dobLastError mapa backups/backup-<ČAS>/, poleg pa manifest.json
 * z velikostjo, SHA-256 povzetkom in git HEAD — brez checksuma kopija ni
 * dokazljiva (nagate kopije med zapisom so lahko poškodovane).
 *
 * KO baza preide na PostgreSQL (issue #27/A1), se ta skripta nadomesti z
 * pg_dump v dokazanih postopkih (docs/BACKUP-RESTORE.md) — izhodni obliki
 * manifestov sta enakovredni, da prehod ostane sledljiv.
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

export {};

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const DB_FILE = path.join(REPO_ROOT, "db", "custom.db");
const BACKUP_ROOT = path.join(REPO_ROOT, "backups");
const KEEP = 10; // število ohranjenih zadnjih kopij

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

/* --- izvedba -------------------------------------------------------------- */

if (!fs.existsSync(DB_FILE)) {
  console.error(`✗ Baza ne obstaja: ${DB_FILE}`);
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const targetDir = path.join(BACKUP_ROOT, `backup-${stamp}`);
const targetFile = path.join(targetDir, "custom.db");

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(DB_FILE, targetFile);

const originalSize = fs.statSync(DB_FILE).size;
const copiedSize = fs.statSync(targetFile).size;
if (originalSize !== copiedSize) {
  console.error(`✗ Kopija ni popolna (${copiedSize} ≠ ${originalSize} bajtov) — NE uporabljaj.`);
  process.exit(1);
}

const manifest = {
  createdAt: new Date().toISOString(),
  source: path.relative(REPO_ROOT, DB_FILE),
  file: path.relative(REPO_ROOT, targetFile),
  bytes: copiedSize,
  sha256: sha256(targetFile),
  gitHead: gitHead(),
  note: "Nagata kopija SQLite; preverjena velikost + SHA-256 (issue #27/T).",
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

console.log(`✓ Kopija: ${manifest.file}`);
console.log(`  ${manifest.bytes} bajtov · SHA-256 ${manifest.sha256.slice(0, 16)}…`);
console.log(`  git HEAD: ${manifest.gitHead ?? "(ni gita)"}`);
console.log(`  Obnovitev: docs/BACKUP-RESTORE.md`);
