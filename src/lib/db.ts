import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Povezava z bazo (Neon PostgreSQL, issue #27/A1).
 *
 * - DATABASE_URL = pooled endpoint (PgBouncer) — aplikacijski runtime
 *   (lokalni dev, Vercel serverless funkcije).
 * - DIRECT_URL = direkt endpoint — izključno za `prisma migrate` (shadow DB
 *   ne sme iti skozi pooler); nastavljen v .env / Vercel environment.
 *
 * Če DATABASE_URL manjka, napaka pade zgodaj in jasno — tiho ustvarjanje
 * prazne datoteke (stari SQLite vzorec) ni več mogoče niti zaželeno.
 */
function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL ni nastavljen. Za lokalni razvoj kopiraj vzorec iz ' +
        'docs/DEPLOYMENT.md v .env (Neon PostgreSQL, sslmode=require).'
    )
  }
  return url
}

process.env.DATABASE_URL = requireDatabaseUrl()

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Podrobno logiranje poizvedb samo izven produkcije; v produkciji
    // puščamo samo napake.
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
