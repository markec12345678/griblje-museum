import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isReadOnlyDatabase, readOnlyResponse } from "@/lib/readonly-db";
import {
  cleanText,
  guestbookSchema,
  looksSuspicious,
  LIMITS,
} from "@/lib/contributions";
import { clientIpOf, rateLimited } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * GET /api/guestbook — objavljeni vpisi v spominsko knjigo (novejši najprej)
 * + števci (vpisi, kraji) za animirano statistiko pogleda.
 *
 * CORS: `*` — enoten odprt muzejski API (enako kot exhibits/search/iiif …).
 */
export async function GET() {
  try {
    const entries = await db.guestbookEntry.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        name: true,
        place: true,
        message: true,
        lang: true,
        createdAt: true,
      },
    });

    const places = new Set(
      entries.map((e) => (e.place ?? "").trim().toLowerCase()).filter(Boolean)
    );

    return NextResponse.json(
      {
        count: entries.length,
        places: places.size,
        entries: entries.map((e) => ({
          id: e.id,
          name: e.name,
          place: e.place,
          message: e.message,
          lang: e.lang,
          createdAt: e.createdAt.toISOString(),
        })),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("API /api/guestbook GET error:", error);
    return NextResponse.json({ error: "Napaka pri branju knjige" }, { status: 500 });
  }
}

/** Preverjanje izvora za prispevke iz brskalnika (CORS z metodami). */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

/**
 * POST /api/guestbook — nov vpis v spominsko knjigo.
 *
 * Samodejna moderacija (glej src/lib/contributions.ts):
 *  - honeypot `website` → tiho zavržemo (lažni uspeh za robota)
 *  - povezave/e-pošta/oznake → status `pending` (čaka na kurotorski pregled)
 *  - čisto besedilo → takoj objavljeno
 * Omejitev: 5 prispevkov / 10 min na IP na primerek strežnika.
 */
export async function POST(request: Request) {
  try {
    const ip = clientIpOf(request);
    if (rateLimited("contributions", ip)) {
      return NextResponse.json(
        { error: "Preveč vpisov v kratkem času — poskusite znova kasneje." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Neveljavno telo zahteve" }, { status: 400 });
    }

    const parsed = guestbookSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first ? `${first.path.join(".")}: ${first.message}` : "Neveljavni podatki" },
        { status: 400 }
      );
    }

    // Honeypot: robot je izpolnil skrito polje — pretvarjamo uspeh.
    if (parsed.data.website) {
      return NextResponse.json({ ok: true, status: "published" }, { status: 201 });
    }

    const name = cleanText(parsed.data.name, LIMITS.name);
    const message = cleanText(parsed.data.message, LIMITS.message);
    if (name.length < 2 || message.length < 10) {
      return NextResponse.json({ error: "Besedilo je prekratko." }, { status: 400 });
    }

    const status = looksSuspicious(message) || looksSuspicious(name) ? "pending" : "published";

    await db.guestbookEntry.create({
      data: {
        name,
        place: parsed.data.place,
        message,
        lang: parsed.data.lang,
        status,
      },
    });

    // 201 tudi za `pending` — prispevek je sprejet, objava pa odvisna od pregleda.
    return NextResponse.json({ ok: true, status }, { status: 201 });
  } catch (error) {
    console.error("API /api/guestbook POST error:", error);
    // Strežniške funkcije z bralnim datotečnim sistemom (npr. Vercel) —
    // bazo lahko beremo, ne pa tudi zapisujemo. Povemo pošteno.
    if (isReadOnlyDatabase(error)) {
      const ro = readOnlyResponse();
      return NextResponse.json(ro.body, { status: ro.status });
    }
    return NextResponse.json({ error: "Napaka pri shranjevanju vpisa" }, { status: 500 });
  }
}
