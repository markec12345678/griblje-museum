import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { MuseumEventDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/events — program muzeja (kronološko). CORS: `*` (enoten odprt API). */
export async function GET() {
  try {
    const events = await db.museumEvent.findMany({
      orderBy: { startsAt: "asc" },
    });

    const payload: MuseumEventDTO[] = events.map((ev) => ({
      id: ev.id,
      titleSi: ev.titleSi,
      titleEn: ev.titleEn,
      descriptionSi: ev.descriptionSi,
      descriptionEn: ev.descriptionEn,
      startsAt: ev.startsAt.toISOString(),
      locationSi: ev.locationSi,
      locationEn: ev.locationEn,
      eventType: ev.eventType as MuseumEventDTO["eventType"],
      isExternal: ev.isExternal,
      externalUrl: ev.externalUrl,
    }));

    return NextResponse.json(
      { count: payload.length, events: payload },
      {
        headers: {
          "Cache-Control": "public, max-age=60",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("API /api/events error:", error);
    return NextResponse.json({ error: "Napaka pri branju dogodkov" }, { status: 500 });
  }
}
