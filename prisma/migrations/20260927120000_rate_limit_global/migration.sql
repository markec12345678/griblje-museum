-- Skupna kvota hitrosti (opt-in globalni način rate-limita, RATE_LIMIT_STORE=postgres).
-- Ena vrstica = en zabeležen zadetek drsečeokenske kvote; vzdrževalno brisanje
-- počisti vrstice starejše od najdaljšega okna (src/lib/rate-limit.ts).

-- CreateTable
CREATE TABLE "RateLimitHit" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "hitAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitHit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE INDEX "RateLimitHit_scope_bucket_hitAt_idx" ON "RateLimitHit"("scope", "bucket", "hitAt");
CREATE INDEX "RateLimitHit_hitAt_idx" ON "RateLimitHit"("hitAt");
