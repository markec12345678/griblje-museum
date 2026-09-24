import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { errorSnapshot, correlationIdOf } from "@/lib/obs";

export const dynamic = "force-dynamic";

/**
 * GET /api/health — zdravstveno stanje sistema (issue #27/V + U).
 *
 * Preverja: povezljivost baze, žive števce zbirke, konfigurirane žetone
 * (brez razkritja vrednosti), števce napak. 200 = zdrav, 503 = baza
 * dosegljiva ni. Varnostno: ne razkrija NOTRANJIH vrednosti, samo
 * boolean zastavice.
 */
export async function GET(request: Request) {
  const correlationId = correlationIdOf(request);
  const started = Date.now();

  try {
    await db.$queryRaw`SELECT 1`;
    const [exhibits, sources, assets, claims] = await Promise.all([
      db.exhibit.count(),
      db.source.count(),
      db.digitalAsset.count(),
      db.claim.count({ where: { status: "PUBLISHED" } }),
    ]);

    return NextResponse.json(
      {
        ok: true,
        database: { connected: true, provider: "postgresql" },
        counts: { exhibits, sources, assets, publishedClaims: claims },
        config: {
          editorialApi: Boolean(process.env.EDITORIAL_TOKEN),
          moderationApi: Boolean(process.env.MODERATION_TOKEN),
        },
        errors: errorSnapshot(),
        latencyMs: Date.now() - started,
        correlationId,
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
          "x-correlation-id": correlationId,
        },
      }
    );
  } catch (error) {
    const correlationId2 = correlationId;
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        scope: "health",
        level: "error",
        msg: "zdravstvena preverba baze ni uspela",
        meta: { correlationId: correlationId2 },
      })
    );
    return NextResponse.json(
      {
        ok: false,
        database: { connected: false, provider: "postgresql" },
        errors: errorSnapshot(),
        latencyMs: Date.now() - started,
        correlationId: correlationId2,
      },
      { status: 503, headers: { "Cache-Control": "no-store", "x-correlation-id": correlationId2 } }
    );
  }
}
