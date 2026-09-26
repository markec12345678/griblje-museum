import { NextResponse } from "next/server";
import { correlationIdOf } from "@/lib/obs";
import georefRaw from "@/data/georef-1825.json";

export const dynamic = "force-dynamic";

/**
 * GET /api/atlas/georef — GEOREF PASS v2 (issue #42 §10, val 72).
 *
 * Odprti podatki o transformaciji zgodovinske geometrije A01 (1824/27):
 *   - metoda: robustna similariteta (skala + rotacija + prevod) po reki Kolpi
 *     (351 sledenih točk, ICP-lite, trimirana 75 % MSE) — determinističen
 *     builder build-georef-1825.py;
 *   - sodobna podlaga: OSM centerline Kupa/Kolpa (way 39699026) — NI zgodovinski
 *     dokaz (§10), uporabljena izključno za poravnavo + validacijo;
 *   - error estimate: trim-RMS 38,2 m; neodvisna validacija na stavbah
 *     (v65 mediana 16,6 m, prior 20,3 m);
 *   - findings F-GEO-01..04 + hišnoštevilski eksperiment (NEGATIVEN, §14).
 *
 * `?transform=1` — samo transformacijski parametri (programska uporaba:
 * px (x, y_dol) → WGS84 po formuli [E,N] = s·R(θ)·[x, −y] + [tx,ty]).
 *
 * Vir resnice: research-griblje/atlas-1825/georef-1825.json (piše builder;
 * ročno urejanje prepovedano). A02–A05 ostajajo UNKNOWN (brez sidra).
 */
export async function GET(request: Request) {
  const correlationId = correlationIdOf(request);
  const url = new URL(request.url);
  const transformOnly = url.searchParams.get("transform");
  const headers = {
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "x-correlation-id": correlationId,
  };

  try {
    const g = georefRaw as Record<string, unknown>;
    if (transformOnly !== null) {
      const t = g.transform as Record<string, number>;
      const frame = (g.method as Record<string, unknown>).coordinate_frame as Record<string, number>;
      return NextResponse.json(
        {
          ok: true,
          val: g.val,
          transform: t,
          coordinate_frame: frame,
          accuracy_summary: (g.accuracy as Record<string, unknown>).summary,
          disclaimer:
            "Zgodovinska geometrija (A01, 1824/27) po v2 transformaciji; sodobna OSM podlaga ni zgodovinski dokaz (§10). A02–A05: UNKNOWN.",
        },
        { headers }
      );
    }
    return NextResponse.json({ ok: true, georef: g }, { headers });
  } catch (error) {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        scope: "atlas-georef",
        level: "error",
        msg: "georef napaka",
        meta: { correlationId },
      })
    );
    return NextResponse.json({ ok: false, error: "internal_error", correlationId }, { status: 500, headers });
  }
}
