import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Podrobno logiranje poizvedb samo izven produkcije; v produkciji
    // puščamo samo napake.
    log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error"],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db