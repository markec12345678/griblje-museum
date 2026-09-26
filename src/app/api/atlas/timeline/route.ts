import { NextResponse } from "next/server";
import { correlationIdOf } from "@/lib/obs";
import {
  timelineAxis,
  timelineOverview,
  timelinePoint,
} from "@/lib/atlas-timeline";

export const dynamic = "force-dynamic";

/**
 * GET /api/atlas/timeline — §20 TIME SLIDER (issue #42, val 76).
 *
 * Brez parametrov: polni pregled — časovne točke vasi (1825 referenčna +
 * 1830 prvi dokumentiran korak + pričakovane letnice), s pogodbo (statusi,
 * pravila) in invariantami.
 *
 * Z `?year=<leto>` — posamezna točka (npr. ?year=1830). Neštevilčno leto →
 * 400, neznana letnica → 404 (poštena napaka, nič ugibanja).
 *
 * Z `?axis=1` — samo os (leto + status, brez metrik) za drsnik.
 *
 * Železno pravilo (§4): točka brez vpisanega vira = AWAITING_SOURCE in ne
 * nosi metrik; metriki se nikoli ne interpolirajo med točkami.
 */
export async function GET(request: Request) {
  const correlationId = correlationIdOf(request);
  const url = new URL(request.url);
  const yearParam = url.searchParams.get("year");
  const axisParam = url.searchParams.get("axis");
  const headers = {
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "x-correlation-id": correlationId,
  };

  try {
    /* --- posamezna točka §20 --- */
    if (yearParam !== null) {
      if (!/^\d{3,4}$/.test(yearParam)) {
        return NextResponse.json(
          {
            ok: false,
            error: "invalid_year",
            message: `Leto mora biti celo število (3–4 števke), prejeto: '${yearParam}'.`,
          },
          { status: 400, headers }
        );
      }
      const point = timelinePoint(Number(yearParam));
      if (!point) {
        return NextResponse.json(
          {
            ok: false,
            error: "unknown_year",
            message: `Časovna točka ${yearParam} ne obstaja. Veljavne: ${timelineAxis()
              .map((a) => a.year)
              .join(", ")}.`,
          },
          { status: 404, headers }
        );
      }
      return NextResponse.json({ ok: true, point }, { headers });
    }

    /* --- samo os (drsnik) --- */
    if (axisParam !== null) {
      return NextResponse.json(
        { ok: true, axis: timelineAxis() },
        { headers }
      );
    }

    /* --- polni pregled --- */
    return NextResponse.json({ ok: true, ...timelineOverview() }, { headers });
  } catch (error) {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        scope: "atlas-timeline",
        level: "error",
        msg: "timeline napaka",
        meta: { correlationId },
      })
    );
    return NextResponse.json(
      { ok: false, error: "internal_error", correlationId },
      { status: 500, headers }
    );
  }
}
