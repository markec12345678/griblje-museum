import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Pot do SQLite datoteke, odporna na različna okolja:
 * 1. eksplicitna DATABASE_URL (razvoj, .zscripts) ima vedno prednost;
 * 2. sicer poiščemo db/custom.db glede na cwd (lokalni next dev/start);
 * 3. nato glede na /var/task (korenska mapa strežniške funkcije na Vercelu,
 *    kamur Next razdeli datoteke iz outputFileTracingIncludes);
 * 4. nazadnje privzamemo cwd — baza se ustvari ob prvem zapisu (seed).
 *
 * Datoteko db/custom.db v paket funkcije vključuje outputFileTracingIncludes
 * v next.config.ts (Next je sam po sledenju uvozov ne zazna, ker jo odpre
 * šele Prisma-in pogonski program ob zagonu).
 */
function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL

  const candidates = [process.cwd(), '/var/task']
  for (const base of candidates) {
    const file = path.join(base, 'db', 'custom.db')
    try {
      if (fs.existsSync(file)) return `file:${file}`
    } catch {
      /* nadaljuj z naslednjim kandidatom */
    }
  }
  return `file:${path.join(process.cwd(), 'db', 'custom.db')}`
}

process.env.DATABASE_URL = resolveDatabaseUrl()

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Podrobno logiranje poizvedb samo izven produkcije; v produkciji
    // puščamo samo napake.
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
