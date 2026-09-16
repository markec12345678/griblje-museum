import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isReadOnlyDatabase } from "@/lib/readonly-db";

export const dynamic = "force-dynamic";

/**
 * Statistika obiska muzeja — priprava na razpisna poročila (zahteva 1.18
 * razpisne dokumentacije MGTŠ: „spremljanje in vrednotenje doseganja ciljev
 * in kazalnikov“; Interreg: kazalniki projekta).
 *
 * Načelo zasebnosti: števci so ZBIRNI po (dan, vrsta, jezik, ključ) — brez
 * piškotkov, brez IP-naslovov, brez identifikatorjev naprav. „Obisk“ se
 * šteje enkrat na sejo brskalnika (guard v sessionStorage na odjemalcu),
 * zato števec meri seje, ne ljudi — pošteno javno enako kot stopnice muzeja.
 *
 * POST /api/stats  { kind, key?, lang }  → poveča števec (fire-and-forget)
 * GET  /api/stats  → javni povzetek (obiski, odprtja zapisov, jeziki)
 */

const KINDS = ["visit", "open", "walk", "guide", "audio", "ar", "download"] as const;

const statSchema = z.object({
  kind: z.enum(KINDS),
  key: z.string().max(120).optional(),
  lang: z.enum(["sl", "en", "hr"]).default("sl"),
});

/** Lokalni dan strežnika (Europe/Ljubljana) kot YYYY-MM-DD. */
function localDay(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Ljubljana",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = statSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const { kind, key, lang } = parsed.data;
    const day = localDay();

    await db.statDay.upsert({
      where: { day_kind_lang_key: { day, kind, lang, key: key ?? "" } },
      create: { day, kind, lang, key: key ?? "", count: 1 },
      update: { count: { increment: 1 } },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Bralna namestitev (Vercel/Lambda): števci se tu ne zbirajo — odgovorimo
    // pošteno, da odjemalec lahko pokaže opombo (enak vzorec kot guestbook).
    if (isReadOnlyDatabase(error)) {
      return NextResponse.json({ ok: false, readOnly: true });
    }
    console.error("API /api/stats POST error:", error);
    // Statistika nikoli ne sme pokvariti obiska — tiho neuspeh.
    return NextResponse.json({ ok: false });
  }
}

export async function GET() {
  try {
    const rows = await db.statDay.findMany();

    const today = localDay();
    const month = today.slice(0, 7); // YYYY-MM

    let visitsTotal = 0;
    let visitsToday = 0;
    let visitsMonth = 0;
    const langTotals: Record<string, number> = {};
    const openTotals: Record<string, number> = {};
    let guideTotal = 0;
    let audioTotal = 0;
    let arTotal = 0;
    let downloadTotal = 0;

    for (const r of rows) {
      const n = r.count;
      switch (r.kind) {
        case "visit":
          visitsTotal += n;
          if (r.day === today) visitsToday += n;
          if (r.day.startsWith(month)) visitsMonth += n;
          langTotals[r.lang] = (langTotals[r.lang] ?? 0) + n;
          break;
        case "open":
          openTotals[r.key] = (openTotals[r.key] ?? 0) + n;
          break;
        case "guide":
          guideTotal += n;
          break;
        case "audio":
          audioTotal += n;
          break;
        case "ar":
          arTotal += n;
          break;
        case "download":
          downloadTotal += n;
          break;
      }
    }

    const topExhibits = Object.entries(openTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([slug, opens]) => ({ slug, opens }));

    return NextResponse.json(
      {
        visits: { total: visitsTotal, today: visitsToday, month: visitsMonth },
        byLang: langTotals,
        guideAsks: guideTotal,
        audioPlays: audioTotal,
        arOpens: arTotal,
        imageDownloads: downloadTotal,
        topExhibits,
        collectedSince: rows.length > 0 ? rows.map((r) => r.day).sort()[0] : null,
        note: "Zbirni anonimni števci (seje brskalnika, brez piškotkov in IP-jev).",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300",
        },
      }
    );
  } catch (error) {
    console.error("API /api/stats GET error:", error);
    return NextResponse.json({ error: "Napaka pri branju statistike" }, { status: 500 });
  }
}
