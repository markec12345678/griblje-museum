import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/assets — javni register digitalnih vsebin (issue #27/B).
 *
 * Servisirani so IZKLJUČNO zapisi z accessLevel = "PUBLIC" (#27/I meja
 * javno/interno) in statusom != LOST. Notranji ključi ne puščajo:
 * - storageKey (ključ objekta v hranilniku) je notranja pot,
 * - exhibitId se zamenja s slugom zapisa,
 * - ID verig derivacij/zamenjav se izpišejo kot javni id-ji zapisov.
 *
 * Filtri: ?kind=fotografija|sken|pdf|audio|video|glb|usdz|iiif-derivative|thumbnail
 *         ?exhibit=<slug>       ?limit=1..100 (privzeto 50)
 *
 * CORS: `*` — enoten odprt muzejski API.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kind = searchParams.get("kind");
    const exhibit = searchParams.get("exhibit");
    const limitRaw = Number(searchParams.get("limit") ?? 50);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(1, Math.trunc(limitRaw)), 100) : 50;

    const assets = await db.digitalAsset.findMany({
      where: {
        accessLevel: "PUBLIC",
        NOT: { preservationStatus: "LOST" },
        ...(kind ? { kind } : {}),
        ...(exhibit ? { exhibit: { is: { slug: exhibit } } } : {}),
      },
      include: { exhibit: { select: { slug: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const payload = assets.map((a) => ({
      id: a.id,
      kind: a.kind,
      mime: a.mime,
      originalFilename: a.originalFilename,
      bytes: a.bytes,
      width: a.width,
      height: a.height,
      sha256: a.sha256,
      creator: a.creator,
      copyrightHolder: a.copyrightHolder,
      license: a.license,
      licenseUrl: a.licenseUrl,
      attribution: a.attribution,
      preservationStatus: a.preservationStatus,
      exhibitSlug: a.exhibit?.slug ?? null,
      derivedFromId: a.derivedFromId,
      replacedById: a.replacedById,
      createdAt: a.createdAt.toISOString(),
    }));

    return NextResponse.json(
      { count: payload.length, assets: payload },
      {
        headers: {
          "Cache-Control": "public, max-age=60",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("API /api/assets error:", error);
    return NextResponse.json({ error: "Napaka pri branju registra vsebin" }, { status: 500 });
  }
}

/** CORS preflight za odprte odjemalce (isti vzorec kot ostale odprte poti). */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
