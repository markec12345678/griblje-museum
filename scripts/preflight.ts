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

const dbFile = path.join(REPO_ROOT, "db", "custom.db");
if (!fs.existsSync(dbFile)) {
  fail("Baza ne obstaja", "zaženi bun run db:seed (ali postavi db/custom.db)");
} else {
  try {
    fs.accessSync(dbFile, fs.constants.R_OK);
    ok("Baza berljiva", path.relative(REPO_ROOT, dbFile));
  } catch {
    fail("Baza ni berljiva", path.relative(REPO_ROOT, dbFile));
  }
}

/* --- 2. prisma odjemalec ---------------------------------------------------- */

const prismaClient = path.join(REPO_ROOT, "node_modules", ".prisma", "client");
if (fs.existsSync(prismaClient)) {
  ok("Prisma odjemalec generiran");
} else {
  fail("Prisma odjemalec manjka", "zaženi bun run db:generate");
}

/* --- 3. številke iz žive baze ----------------------------------------------- */

if (fs.existsSync(dbFile) && fs.existsSync(prismaClient)) {
  try {
    // Eksplicitna pot do repozitorjske baze — skripta mora meriti TO bazo,
    // ne naključne baze iz okoljske spremenljivke peskovnika.
    process.env.DATABASE_URL = `file:${dbFile}`;
    const { db } = await import("../src/lib/db");
    const [ex, src, ev, st] = await Promise.all([
      db.exhibit.count(),
      db.source.count(),
      db.museumEvent.count(),
      db.storyItem.count(),
    ]);
    if (ex === 0) {
      fail("Zbirka je prazna", "zaženi bun run db:seed");
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
if (provider === "sqlite") {
  warn("Baza je SQLite", "issue #27/A1: produkcija naj preide na PostgreSQL + migrations (docs/DEPLOYMENT.md)");
}

/* --- izid ---------------------------------------------------------------------- */

if (hardFailures > 0) {
  console.error(`\nPREFLIGHT NI ŠEL SKOZI: ${hardFailures} trdih napak, ${warnings} opozoril.`);
  process.exit(1);
}
console.log(`\nPREFLIGHT OK${warnings ? ` (${warnings} opozoril)` : ""}.`);
