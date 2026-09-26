import { NextResponse } from "next/server";
import { correlationIdOf } from "@/lib/obs";
import {
  houseFeatures,
  mapData,
  mapObjectFeatures,
  mapSheets,
  parcelFeatures,
  toponymFeatures,
} from "@/lib/atlas-map";

export const dynamic = "force-dynamic";

const SHEETS = new Set(["A01", "A02", "A03", "A04", "A05"]);
const LAYERS = new Set(["all", "map_objects", "houses", "toponyms", "parcels", "sheets"]);

/**
 * GET /api/atlas/map — podatkovni zemljevid (issue #42 §15, PASS 5).
 *
 * ?layer=all (privzeto) | map_objects | houses | toponyms | parcels | sheets
 * ?sheet=A01..A05 — filter map_objects po katastrskem listu
 *
 * Vsak objekt nosi node_id + evidence_url (sledljivost do vira).
 * Nič ne ugiba: koordinate samo kjer jih graf že ima (A01 GEOREF v2, val 72);
 * parcele brez geometrije (§9) — register z rabo in vezmi na hiše (§19, val 73);
 * hiša brez dokazane BP↔MO veze = NOT_LOCATED.
 */
export async function GET(request: Request) {
  const correlationId = correlationIdOf(request);
  const url = new URL(request.url);
  const layer = url.searchParams.get("layer") ?? "all";
  const sheet = url.searchParams.get("sheet") ?? undefined;
  const headers = {
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "x-correlation-id": correlationId,
  };

  if (!LAYERS.has(layer)) {
    return NextResponse.json(
      {
        ok: false,
        error: "unknown_layer",
        message: `Neznana plast '${layer}'. Možnosti: ${[...LAYERS].join(", ")}.`,
      },
      { status: 400, headers }
    );
  }
  if (sheet && !SHEETS.has(sheet)) {
    return NextResponse.json(
      {
        ok: false,
        error: "unknown_sheet",
        message: `Neznan list '${sheet}'. Možnosti: ${[...SHEETS].join(", ")}.`,
      },
      { status: 400, headers }
    );
  }

  try {
    if (layer === "all") {
      return NextResponse.json(mapData(), { headers });
    }
    if (layer === "sheets") {
      const sheets = mapSheets();
      return NextResponse.json(
        { ok: true, layer: "sheets", count: sheets.length, sheets },
        { headers }
      );
    }
    const features =
      layer === "map_objects"
        ? mapObjectFeatures(sheet)
        : layer === "houses"
          ? houseFeatures()
          : layer === "parcels"
            ? parcelFeatures()
            : toponymFeatures();
    return NextResponse.json(
      { ok: true, layer, sheet: sheet ?? null, count: features.length, features },
      { headers }
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        scope: "atlas-map",
        level: "error",
        msg: "map data model napaka",
        meta: { correlationId },
      })
    );
    return NextResponse.json({ ok: false, error: "internal_error", correlationId }, { status: 500, headers });
  }
}
