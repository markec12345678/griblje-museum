import { NextResponse } from "next/server";
import { correlationIdOf } from "@/lib/obs";
import {
  coverageCategory,
  coverageOutputs,
  coverageOverview,
  unknownsBreakdown,
  validCategoryIds,
} from "@/lib/atlas-coverage";

export const dynamic = "force-dynamic";

/**
 * GET /api/atlas/coverage — PASS 8 Quality Gate (issue #42 §23/§24).
 *
 * Brez parametrov: polni pregled — 18 kategorij × šeststatusna shema
 *   (TOTAL / VERIFIED / PARTIAL / CONFLICT / UNKNOWN / NOT_FOUND),
 *   manifest §24 obveznih outputov 1–14, invarianti, provenanca.
 *   Brez umetnih procentov (issue #43 §10).
 *
 * Z `?category=<id>` — posamezna kategorija z mapping_rule + native razčlenitvijo
 *   (npr. ?category=houses, bp_a01_binding, parcel_geometry).
 *
 * Z `?outputs=1` — samo §24 manifest (14 obveznih outputov).
 *
 * Z `?unknowns=1` — prečne nezanke po mestu izvora (kategorija `unknowns`).
 *
 * Nič ne ugiba: vrne samo to, kar je izračunal deterministični builder
 * build-coverage-report.py iz registrov + KG v1.4.
 */
export async function GET(request: Request) {
  const correlationId = correlationIdOf(request);
  const url = new URL(request.url);
  const categoryParam = url.searchParams.get("category");
  const outputsParam = url.searchParams.get("outputs");
  const unknownsParam = url.searchParams.get("unknowns");
  const headers = {
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "x-correlation-id": correlationId,
  };

  try {
    /* --- posamezna kategorija §23 --- */
    if (categoryParam !== null) {
      const cat = coverageCategory(categoryParam);
      if (!cat) {
        return NextResponse.json(
          {
            ok: false,
            error: "unknown_category",
            message: `Kategorija '${categoryParam}' ne obstaja v coverage reportu. Veljavne: ${validCategoryIds().join(", ")}`,
          },
          { status: 404, headers }
        );
      }
      return NextResponse.json({ ok: true, category: cat }, { headers });
    }

    /* --- §24 manifest --- */
    if (outputsParam !== null) {
      return NextResponse.json({ ok: true, ...coverageOutputs() }, { headers });
    }

    /* --- prečne nezanke --- */
    if (unknownsParam !== null) {
      const unk = unknownsBreakdown();
      if (!unk) {
        return NextResponse.json(
          { ok: false, error: "unknowns_block_missing" },
          { status: 404, headers }
        );
      }
      return NextResponse.json({ ok: true, ...unk }, { headers });
    }

    /* --- polni pregled (§23) --- */
    return NextResponse.json({ ok: true, ...coverageOverview() }, { headers });
  } catch (error) {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        scope: "atlas-coverage",
        level: "error",
        msg: "coverage report napaka",
        meta: { correlationId },
      })
    );
    return NextResponse.json({ ok: false, error: "internal_error", correlationId }, { status: 500, headers });
  }
}
