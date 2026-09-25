import { NextResponse } from "next/server";
import { correlationIdOf } from "@/lib/obs";
import { evidenceFor, nodeExists, overview, resolveNodeParam, searchNodes } from "@/lib/atlas-evidence";

export const dynamic = "force-dynamic";

/**
 * GET /api/atlas/evidence — Evidence Explorer (issue #43 §2/§6).
 *
 * Brez parametrov: pregled grafa (§10 completeness — brez umetnega procenta):
 *   { ok, title, stats{nodes,edges,claims}, coverage, research_gaps, story_atoms, findings }
 *
 * Z `?node=<id>` — celotna dokazna veriga za en objekt (§2 "Zakaj to vemo?"):
 *   node → edges → claims → sources → original_evidence (vac_details_url)
 *   + neighbors + research_gaps. Varni vzorci: H-040, house 40, bp 90, TP-001,
 *   SRC-PS, EVT-001 (map→entity vstopne točke).
 *
 * Z `?q=<niz>&type=<tip>` — iskanje po node-ih (brskanje).
 *
 * Nič ne ugiba: vrne samo strukturo iz knowledge-graph-1825.json
 * (deterministično gradjenega iz registrov; ročno urejanje prepovedano).
 * UNKNOWN / NOT FOUND / CONFLICT ostanejo ločeni (#43 §5).
 */
export async function GET(request: Request) {
  const correlationId = correlationIdOf(request);
  const url = new URL(request.url);
  const nodeParam = url.searchParams.get("node");
  const houseParam = url.searchParams.get("house");
  const bpParam = url.searchParams.get("bp");
  const q = url.searchParams.get("q");
  const type = url.searchParams.get("type") ?? undefined;
  const headers = {
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "x-correlation-id": correlationId,
  };

  try {
    /* --- iskanje --- */
    if (q !== null) {
      const results = searchNodes(q, type);
      return NextResponse.json({ ok: true, query: q, type: type ?? null, count: results.length, results }, { headers });
    }

    /* --- dokazna veriga enega node-a (§2/§6) --- */
    const rawParam =
      nodeParam ?? (houseParam !== null ? `house ${houseParam}` : bpParam !== null ? `bp ${bpParam}` : null);
    if (rawParam !== null) {
      const nodeId = resolveNodeParam(rawParam);
      if (!nodeId || !nodeExists(nodeId)) {
        return NextResponse.json(
          {
            ok: false,
            error: "node_not_found",
            message: `Node '${rawParam}' ne obstaja v knowledge-graph-1825. Preveri /api/atlas/evidence?q= ali pregled.`,
          },
          { status: 404, headers }
        );
      }
      const ev = evidenceFor(nodeId);
      return NextResponse.json(
        {
          ok: true,
          ...ev,
          counts: {
            edges: ev.edges.length,
            claims: ev.claims.length,
            conflicts: ev.claims.filter((c) => c.status === "CONFLICT").length,
            sources: ev.sources.length,
            research_gaps: ev.research_gaps.length,
          },
        },
        { headers }
      );
    }

    /* --- pregled grafa (§10) --- */
    return NextResponse.json({ ok: true, ...overview() }, { headers });
  } catch (error) {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        scope: "atlas-evidence",
        level: "error",
        msg: "evidence explorer napaka",
        meta: { correlationId },
      })
    );
    return NextResponse.json({ ok: false, error: "internal_error", correlationId }, { status: 500, headers });
  }
}
