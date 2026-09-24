/**
 * Podatkovna migracija SQLite → Neon PostgreSQL (issue #27/A1, dopolnilo T).
 *
 * Branje: db/custom.db (stari SQLite vir, bun:sqlite — brez odvisnosti od
 *         Prisma odjemalca, ker je shema že preklopljena na postgresql).
 * Pisanje: DATABASE_URL / DIRECT_URL (PostgreSQL, prek pg).
 *
 * Postopek je idempotenten: ciljne tabele se pred vnosom TRUNCATE-ajo.
 * Vrstni red vnosa spoštuje tuje ključe (Exhibit pred Source/ObjectMemory).
 * Na koncu primerja števce po tabelah in pri odstopanju konča z napako.
 *
 * Zagon:  bun scripts/migrate-data-sqlite-to-postgres.ts [--sqlite <pot>]
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { Database } from "bun:sqlite";
import { Client } from "pg";

const args = process.argv.slice(2);
const sqliteArg = args.includes("--sqlite") ? args[args.indexOf("--sqlite") + 1] : undefined;
const SQLITE_PATH = sqliteArg ?? path.join(process.cwd(), "db", "custom.db");

const PG_URL =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  (() => {
    // .env razčlenjava (cli skripta ne obremenjuje next/next-load)
    const envFile = readFileSync(path.join(process.cwd(), ".env"), "utf8");
    const m = envFile.match(/^DIRECT_URL="?([^"\n]+)"?/m) ?? envFile.match(/^DATABASE_URL="?([^"\n]+)"?/m);
    if (!m) throw new Error("DIRECT_URL/DATABASE_URL ni najden (ne v env, ne v .env)");
    return m[1];
  })();

/** Modeli v vrstnem redu vnosa; ključ = tabela, vrednost = stolpci v vrstnem redu. */
const TABLES: Record<string, string[]> = {
  Exhibit: [
    "id", "slug", "museumNo", "category", "titleSi", "titleEn", "periodSi", "periodEn",
    "summarySi", "summaryEn", "storySi", "storyEn", "evidenceStatus", "image", "imageCredit",
    "model3dUrl", "model3dCredit", "yearFrom", "yearTo", "lat", "lng", "coordsApprox",
    "featured", "sortOrder", "addedAt", "createdAt", "updatedAt",
  ],
  Source: [
    "id", "exhibitId", "nameSi", "nameEn", "sourceType", "license", "url",
    "noteSi", "noteEn", "sortOrder",
  ],
  StoryItem: [
    "id", "kind", "titleSi", "titleEn", "textSi", "textEn",
    "attributionSi", "attributionEn", "evidenceStatus", "sortOrder",
  ],
  MuseumEvent: [
    "id", "titleSi", "titleEn", "descriptionSi", "descriptionEn",
    "startsAt", "locationSi", "locationEn", "eventType", "isExternal", "externalUrl",
  ],
  GuestbookEntry: ["id", "name", "place", "message", "lang", "status", "createdAt"],
  ObjectMemory: ["id", "exhibitId", "author", "place", "memory", "lang", "status", "createdAt"],
  StatDay: ["id", "day", "kind", "lang", "key", "count", "updatedAt"],
};

const INSERT_ORDER = ["Exhibit", "Source", "StoryItem", "MuseumEvent", "GuestbookEntry", "ObjectMemory", "StatDay"];

/** Vrednost iz SQLite → parametrizirana vrednost za pg. */
function toPg(value: unknown): unknown {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value;
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Date) return value.toISOString();
  // Bun sqlite vrne string; DateTime stolpce ISO nizov pusti — pg jih obvlada,
  // ampak za zanesljivost pretvorimo znane časovne stolpce posebej (spodaj).
  return value as string;
}

const DATETIME_COLS = new Set(["addedAt", "createdAt", "updatedAt", "startsAt"]);

async function main() {
  console.log(`▼ Vir (SQLite): ${SQLITE_PATH}`);
  console.log(`▲ Cilj (PostgreSQL): ${PG_URL.replace(/:[^:@/]+@/, ":***@")}`);

  const sqlite = new Database(SQLITE_PATH, { readonly: true });

  const pg = new Client({ connectionString: PG_URL, ssl: { rejectUnauthorized: false } });
  await pg.connect();

  // 1) Čiščenje cilja (idempotentnost)
  await pg.query(`TRUNCATE TABLE ${INSERT_ORDER.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE;`);

  // 2) Kopiranje po tabelah
  const report: Array<{ table: string; src: number; dst: number }> = [];
  for (const table of INSERT_ORDER) {
    const cols = TABLES[table];
    const colList = cols.map((c) => `"${c}"`).join(", ");
    const rows = sqlite.prepare(`SELECT ${colList} FROM "${table}"`).all() as Record<string, unknown>[];
    if (rows.length > 0) {
      const chunkSize = 500;
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        const values: unknown[] = [];
        const tuples = chunk.map((row, rowIdx) => {
          const placeholders = cols.map((c, cIdx) => {
            values.push(DATETIME_COLS.has(c) && row[c] ? new Date(row[c] as string) : toPg(row[c]));
            return `$${rowIdx * cols.length + cIdx + 1}`;
          });
          return `(${placeholders.join(", ")})`;
        });
        await pg.query(
          `INSERT INTO "${table}" (${colList}) VALUES ${tuples.join(", ")} ON CONFLICT DO NOTHING`,
          values
        );
      }
    }
    const dstRes = await pg.query<{ n: string }>(`SELECT COUNT(*)::text AS n FROM "${table}"`);
    report.push({ table, src: rows.length, dst: Number(dstRes.rows[0].n) });
    console.log(`  ✓ ${table}: ${rows.length} → ${dstRes.rows[0].n}`);
  }

  // 3) Validacija: števci in vzorčne vsebine
  const mismatch = report.filter((r) => r.src !== r.dst);
  if (mismatch.length > 0) {
    console.error("✗ Odstopanja števcev:", mismatch);
    process.exitCode = 1;
  } else {
    console.log("✓ Števci po tabelah se ujemajo.");
  }

  const spot = await pg.query<{ "museumNo": string }>(
    `SELECT "museumNo" FROM "Exhibit" ORDER BY "sortOrder" LIMIT 1`
  );
  const exhibits = await pg.query<{ n: string }>(
    `SELECT COUNT(*)::text AS n FROM "Exhibit" WHERE "museumNo" IS NOT NULL`
  );
  const sources = await pg.query<{ n: string }>(`SELECT COUNT(*)::text AS n FROM "Source"`);
  console.log(`  vzorec prvega zapisa: museumNo=${spot.rows[0]?.museumNo}`);
  console.log(`  zapisov z museumNo: ${exhibits.rows[0].n} · virov: ${sources.rows[0].n}`);

  const expectedExhibits = Number(exhibits.rows[0].n);
  if (expectedExhibits !== 113 || Number(sources.rows[0].n) !== 588) {
    console.error(`✗ Pričakovano 113 zapisov/588 virov, dobljeno ${exhibits.rows[0].n}/${sources.rows[0].n}`);
    process.exitCode = 1;
  } else {
    console.log("✓ Poševna preverba zbirke: 113 zapisov · 588 virov.");
  }

  await pg.end();
  sqlite.close();
  console.log(process.exitCode === 1 ? "✗ Migracija z napako." : "✓ Migracija zaključena.");
}

main().catch((err) => {
  console.error("✗ Napaka migracije:", err);
  process.exit(1);
});
