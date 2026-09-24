import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isReadOnlyDatabase, readOnlyResponse } from "@/lib/readonly-db";
import {
  cleanText,
  looksSuspicious,
  memorySchema,
  LIMITS,
} from "@/lib/contributions";
import { clientIpOf, rateLimited } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * GET /api/memories?exhibit=<slug> — objavljeni spomini skupnosti ob enem
 * predmetu (novejši najprej). Brez parametra vrne skupne števce
 * ({ total, exhibits } — zadnji prispevki čez celo zbirko).
 *
 * Vzorec: DigitaltMuseum — skupnostne pripombe ob predmetih;
 * Tenement Museum "Your Story, Our Story".
 *
 * CORS: `*` — enoten odprt muzejski API.
 */
export async function GET(request: Request) {
  try {
    const slug = new URL(request.url).searchParams.get("exhibit");

    if (slug) {
      const exhibit = await db.exhibit.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (!exhibit) {
        return NextResponse.json({ error: "Neznan predmet" }, { status: 404 });
      }

      const memories = await db.objectMemory.findMany({
        where: { exhibitId: exhibit.id, status: "published" },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true,
          author: true,
          place: true,
          memory: true,
          lang: true,
          createdAt: true,
        },
      });

      return NextResponse.json(
        {
          count: memories.length,
          memories: memories.map((m) => ({
            id: m.id,
            author: m.author,
            place: m.place,
            memory: m.memory,
            lang: m.lang,
            createdAt: m.createdAt.toISOString(),
          })),
        },
        {
          headers: {
            "Cache-Control": "public, max-age=30",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Brez parametra: skupni števci po vsej zbirki (za ploščice v pogledu).
    const total = await db.objectMemory.count({ where: { status: "published" } });
    const byExhibit = await db.objectMemory.groupBy({
      by: ["exhibitId"],
      where: { status: "published" },
      _count: { _all: true },
    });
    const exhibitIds = byExhibit.map((g) => g.exhibitId);
    const exhibits = exhibitIds.length
      ? await db.exhibit.findMany({
          where: { id: { in: exhibitIds } },
          select: { id: true, slug: true },
        })
      : [];
    const slugById = new Map(exhibits.map((e) => [e.id, e.slug]));

    return NextResponse.json(
      {
        total,
        exhibits: byExhibit
          .map((g) => ({
            slug: slugById.get(g.exhibitId) ?? "",
            count: g._count._all,
          }))
          .filter((e) => e.slug !== ""),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("API /api/memories GET error:", error);
    return NextResponse.json({ error: "Napaka pri branju spominov" }, { status: 500 });
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
 * POST /api/memories — nov spomin ob predmetu.
 *
 * Enaka samodejna moderacija kot spominska knjiga:
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
        { error: "Preveč prispevkov v kratkem času — poskusite znova kasneje." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Neveljavno telo zahteve" }, { status: 400 });
    }

    const parsed = memorySchema.safeParse(body);
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

    const exhibit = await db.exhibit.findUnique({
      where: { slug: parsed.data.exhibitSlug },
      select: { id: true },
    });
    if (!exhibit) {
      return NextResponse.json({ error: "Neznan predmet" }, { status: 404 });
    }

    const author = cleanText(parsed.data.author, LIMITS.name);
    const memory = cleanText(parsed.data.memory, LIMITS.memory);
    if (author.length < 2 || memory.length < 20) {
      return NextResponse.json({ error: "Besedilo je prekratko." }, { status: 400 });
    }

    const status =
      looksSuspicious(memory) || looksSuspicious(author) ? "pending" : "published";

    await db.objectMemory.create({
      data: {
        exhibitId: exhibit.id,
        author,
        place: parsed.data.place,
        memory,
        lang: parsed.data.lang,
        status,
      },
    });

    return NextResponse.json({ ok: true, status }, { status: 201 });
  } catch (error) {
    console.error("API /api/memories POST error:", error);
    // Strežniške funkcije z bralnim datotečnim sistemom (npr. Vercel) —
    // bazo lahko beremo, ne pa tudi zapisujemo. Povemo pošteno.
    if (isReadOnlyDatabase(error)) {
      const ro = readOnlyResponse();
      return NextResponse.json(ro.body, { status: ro.status });
    }
    return NextResponse.json({ error: "Napaka pri shranjevanju spomina" }, { status: 500 });
  }
}
