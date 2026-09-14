import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { StoryDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/stories — zgodbe: dokumentirane, načela, razpisi. CORS: `*`. */
export async function GET() {
  try {
    const stories = await db.storyItem.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const payload: StoryDTO[] = stories.map((st) => ({
      id: st.id,
      kind: st.kind as StoryDTO["kind"],
      titleSi: st.titleSi,
      titleEn: st.titleEn,
      textSi: st.textSi,
      textEn: st.textEn,
      attributionSi: st.attributionSi,
      attributionEn: st.attributionEn,
      evidenceStatus: st.evidenceStatus as StoryDTO["evidenceStatus"],
      sortOrder: st.sortOrder,
    }));

    return NextResponse.json(
      { count: payload.length, stories: payload },
      {
        headers: {
          "Cache-Control": "public, max-age=60",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("API /api/stories error:", error);
    return NextResponse.json({ error: "Napaka pri branju zgodb" }, { status: 500 });
  }
}
