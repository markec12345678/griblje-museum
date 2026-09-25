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
 *
 * Zavrnjeno pa je padanje ob *importu* modula: med Next.js buildom
 * ("Collecting page data") se moduli API rut zgolj naložijo in ocenijo,
 * zato bi strog vogal pri evalvaciji zahteval bazo že med buildom —
 * to je na Vercelu (kjer se build izvede brez povezave na bazo)
 * neupravičeno in je od 24. 9. 2026 kar 9 zaporednih produkcijskih
 * deploymentov porušilo (BUILD_UTILS_SPAWN_1). Zato je odjemalec LENOBEN:
 * modul je varno uvozljiv med buildom, `requireDatabaseUrl()` pa ostane
 * ob prvi dejanski uporabi baze — takrat pada z istim jasnim sporočilom.
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

function createDb(): PrismaClient {
  return new PrismaClient({
    datasources: { db: { url: requireDatabaseUrl() } },
    // Podrobno logiranje poizvedb samo izven produkcije; v produkciji
    // puščamo samo napake.
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error'],
  })
}

function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createDb()
  }
  return globalForPrisma.prisma
}

export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getDb()
    const value = Reflect.get(client as object, prop, client)
    // Metode vežemo na pravega odjemalca, da `this` nikoli ni proxy.
    return typeof value === 'function' ? value.bind(client) : value
  },
})
