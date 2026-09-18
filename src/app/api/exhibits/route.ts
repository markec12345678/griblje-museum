import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { ExhibitDTO, SourceDTO, ExhibitCategory, EvidenceStatus, SourceType } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/exhibits — cela digitalna zbirka z viri.
 * ?category=kolpa  — filtriranje po tematskem sklopu (opcijsko)
 *
 * CORS: `*` — enako kot search/opendata/iiif (enoten odprt muzejski API).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const exhibits = await db.exhibit.findMany({
      where: category ? { category } : undefined,
      include: { sources: { orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    });

    const payload: ExhibitDTO[] = exhibits.map((ex) => ({
      id: ex.id,
      slug: ex.slug,
      museumNo: ex.museumNo,
      category: ex.category as ExhibitCategory,
      titleSi: ex.titleSi,
      titleEn: ex.titleEn,
      periodSi: ex.periodSi,
      periodEn: ex.periodEn,
      summarySi: ex.summarySi,
      summaryEn: ex.summaryEn,
      storySi: ex.storySi,
      storyEn: ex.storyEn,
      evidenceStatus: ex.evidenceStatus as EvidenceStatus,
      image: ex.image,
      imageCredit: ex.imageCredit,
      model3dUrl: ex.model3dUrl,
      model3dCredit: ex.model3dCredit,
      yearFrom: ex.yearFrom,
      yearTo: ex.yearTo,
      lat: ex.lat,
      lng: ex.lng,
      coordsApprox: ex.coordsApprox,
      featured: ex.featured,
      sortOrder: ex.sortOrder,
      addedAt: ex.addedAt ? ex.addedAt.toISOString() : null,
      sources: ex.sources.map<SourceDTO>((s) => ({
        id: s.id,
        nameSi: s.nameSi,
        nameEn: s.nameEn,
        sourceType: s.sourceType as SourceType,
        license: s.license,
        url: s.url,
        noteSi: s.noteSi,
        noteEn: s.noteEn,
      })),
    }));

    return NextResponse.json(
      { count: payload.length, exhibits: payload },
      {
        headers: {
          "Cache-Control": "public, max-age=60",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("API /api/exhibits error:", error);
    return NextResponse.json({ error: "Napaka pri branju zbirke" }, { status: 500 });
  }
}
