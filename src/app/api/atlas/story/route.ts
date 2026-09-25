import { NextResponse } from "next/server";
import { correlationIdOf } from "@/lib/obs";
import { generateEntityStory, generateVillageStory, resolveEntityRef } from "@/lib/atlas-story-engine";

export const dynamic = "force-dynamic";

/**
 * GET /api/atlas/story — STORY ENGINE (issue #42 §16–§18 + §22, PASS 7).
 *
 * Deterministični sestavljevalnik evidence-first zgodb iz strukturiranih
 * claims + sources (§19: ne iz prostega modelskega spomina; §17: AI ne sme
 * zapolnjevati praznin z domišljijo).
 *
 *   ?entity=HOUSE:H-040 — zgodba entitete (§16 »Zgodba te hiše«);
 *                         sprejme tudi H-040 / "HOUSE 40" / BP:094 / 94 / TP-001 / MO:MO-A01-002
 *   ?scope=village      — zgodba celotne vasi (§18 »Zgodba Gribelj 1825«)
 *
 * Vsak odgovor ustreza story_engine_contract (§22): story_id,
 * input_entity_ids, used_claim_ids, used_source_ids, generation_timestamp,
 * prompt_version, story_status + content_hash + kg_sha256.
 * Pravilo: zgodba brez dokaznih povezav = NOT_PUBLISHED.
 */
export async function GET(request: Request) {
  const correlationId = correlationIdOf(request);
  const url = new URL(request.url);
  const headers = {
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "x-correlation-id": correlationId,
  };

  const scope = url.searchParams.get("scope");
  const entity = url.searchParams.get("entity");

  if (scope && scope !== "village") {
    return NextResponse.json(
      {
        ok: false,
        error: "unknown_scope",
        message: `Neznan scope '${scope}'. Možnosti: village (ali uporabi ?entity=...).`,
      },
      { status: 400, headers }
    );
  }

  if (!scope && !entity) {
    return NextResponse.json(
      {
        ok: false,
        error: "missing_param",
        message:
          "Manjka parameter: ?entity=HOUSE:H-040 (zgodba entitete, §16) ali ?scope=village (zgodba vasi, §18).",
      },
      { status: 400, headers }
    );
  }

  try {
    if (scope === "village") {
      return NextResponse.json(generateVillageStory(), { headers });
    }

    const id = resolveEntityRef(entity!);
    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: "node_not_found",
          message: `Entiteta '${entity}' ne obstaja v grafu ATLAS 1825.`,
        },
        { status: 404, headers }
      );
    }
    const story = generateEntityStory(id);
    if (!story) {
      return NextResponse.json(
        { ok: false, error: "node_not_found", message: `Entiteta '${entity}' ni razrešljiva.` },
        { status: 404, headers }
      );
    }
    return NextResponse.json(story, { headers });
  } catch (error) {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        scope: "atlas-story",
        level: "error",
        msg: "story engine napaka",
        meta: { correlationId, entity: entity ?? scope },
      })
    );
    return NextResponse.json({ ok: false, error: "internal_error", correlationId }, { status: 500, headers });
  }
}
