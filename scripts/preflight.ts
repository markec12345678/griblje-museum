/**
 * PREDPRAVNIŠKA PREVERBA NAMESTITVE (issue #27, točka U — deployment safety).
 *
 *   bun run preflight
 *
 * Preveri vse, kar namestitev potrebuje, PREDEN aplikacija pride v promet:
 *   1. baza obstaja, je berljiva in vsebuje pričakovane tabele,
 *   2. živo število zapisov (izpis = primerek za dokumentacijo — #27/Q),
 *   3. prisma odjemalec je generiran,
 *   4. okoljske spremenljivke (trdo napake → izhod 1, opozorila → izhod 0).
 *
 * Skripta ne popravlja ničesar — samo poroča. V CI jo pokliče smoke job
 * posredno (strežnik sam ne zažene, če baza ne obstaja).
 */

import fs from "node:fs";
import path from "node:path";

export {};

const REPO_ROOT = path.resolve(import.meta.dir, "..");

let hardFailures = 0;
let warnings = 0;

function ok(name: string, detail?: string): void {
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name: string, detail?: string): void {
  hardFailures += 1;
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
}
function warn(name: string, detail?: string): void {
  warnings += 1;
  console.warn(`▲ ${name}${detail ? ` — ${detail}` : ""}`);
}

/* --- 1. baza --------------------------------------------------------------- */

// Neon PostgreSQL (issue #27/A1): povezava prek DATABASE_URL/DIRECT_URL.
// .env razčlenjava iz repo korena, da preflight deluje brez next-load.
function readEnvValue(key: string): string | undefined {
  const fromProcess = process.env[key];
  if (fromProcess) return fromProcess;
  try {
    const envFile = fs.readFileSync(path.join(REPO_ROOT, ".env"), "utf8");
    const m = envFile.match(new RegExp(`^${key}="?([^"\\n]+)"?`, "m"));
    return m?.[1];
  } catch {
    return undefined;
  }
}

const databaseUrl = readEnvValue("DATABASE_URL");
const directUrl = readEnvValue("DIRECT_URL") ?? databaseUrl;
if (!databaseUrl) {
  fail("DATABASE_URL ni nastavljen", "postavi .env (Neon PostgreSQL, docs/DEPLOYMENT.md)");
} else {
  const host = databaseUrl.replace(/:\/\/[^:]+:[^@]+@/, "://***:***@");
  ok("DATABASE_URL", host);
}

/* --- 2. prisma odjemalec ---------------------------------------------------- */

const prismaClient = path.join(REPO_ROOT, "node_modules", ".prisma", "client");
if (fs.existsSync(prismaClient)) {
  ok("Prisma odjemalec generiran");
} else {
  fail("Prisma odjemalec manjka", "zaženi bun run db:generate");
}

/* --- 3. številke iz žive baze ----------------------------------------------- */

if (databaseUrl && fs.existsSync(prismaClient)) {
  try {
    process.env.DATABASE_URL = directUrl as string;
    const { db } = await import("../src/lib/db");
    const [ex, src, ev, st] = await Promise.all([
      db.exhibit.count(),
      db.source.count(),
      db.museumEvent.count(),
      db.storyItem.count(),
    ]);
    if (ex === 0) {
      fail("Zbirka je prazna", "zaženi bun run db:seed ali migriraj podatke (scripts/migrate-data-sqlite-to-postgres.ts)");
    } else {
      ok("Živo stanje zbirke", `${ex} zapisov · ${src} virov · ${ev} dogodkov · ${st} zgodb`);
    }
    await db.$disconnect();
  } catch (error) {
    fail("Branje baze ni uspelo", error instanceof Error ? error.message : String(error));
  }
}

/* --- 4. okolje --------------------------------------------------------------- */

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  warn("NEXT_PUBLIC_SITE_URL ni nastavljen", "sitemap/robots uporabita privzeto domeno iz src/lib/site.ts");
} else {
  ok("NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL);
}

if (!process.env.ZAI_CONFIG && !process.env.ELEVENLABS_API_KEY) {
  warn("TTS/AI ključi niso nastavljeni", "avdio vodnik in AI kustos vrneta 503; ostalo deluje");
} else {
  ok("TTS/AI ključi prisotni");
}

const provider = fs.readFileSync(path.join(REPO_ROOT, "prisma", "schema.prisma"), "utf8").match(/provider\s*=\s*"(\w+)"/)?.[1];
const migrationsDir = path.join(REPO_ROOT, "prisma", "migrations");
if (provider !== "postgresql") {
  fail("Shema ni PostgreSQL", `provider=${provider} — issue #27/A1 zahteva postgresql`);
} else {
  ok("Shema", "postgresql");
}
if (fs.existsSync(migrationsDir) && fs.readdirSync(migrationsDir).some((d) => d !== "migration_lock.toml")) {
  ok("Prisma migracije", path.relative(REPO_ROOT, migrationsDir));
} else {
  warn("Ni prisma migracij", "produkcija naj uporablja `prisma migrate deploy` (docs/DEPLOYMENT.md)");
}

/* --- izid ---------------------------------------------------------------------- */

if (hardFailures > 0) {
  console.error(`\nPREFLIGHT NI ŠEL SKOZI: ${hardFailures} trdih napak, ${warnings} opozoril.`);
  process.exit(1);
}
console.log(`\nPREFLIGHT OK${warnings ? ` (${warnings} opozoril)` : ""}.`);
