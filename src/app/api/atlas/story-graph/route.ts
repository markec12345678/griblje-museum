import { NextResponse } from "next/server";
import { correlationIdOf } from "@/lib/obs";
import {
  STORY_ENTITY_TYPES,
  resolvedStoryAtoms,
  searchStoryEntities,
  storyEntities,
  storyGraphOverview,
  storyNeighborhood,
  storyRelations,
  resolveStoryEntityParam,
} from "@/lib/atlas-story-graph";

export const dynamic = "force-dynamic";

const ENTITY_TYPES = new Set<string>(STORY_ENTITY_TYPES);
const RELATION_TYPES = new Set([
  "OWNER_OF",
  "OWNER_VARIANT_OF",
  "HAS_PARCEL",
  "BP_BOUND_TO_HOUSE",
  "DOCUMENTED_IN",
  "DEPICTED_ON",
  "CORRESPONDS_TO_BP",
  "RESIDENCE_DOCUMENTED_AT",
  "AFFECTS_HOUSE",
  "IS_GEMEINDE_OF",
]);

function numParam(url: URL, name: string, def: number, max: number): number {
  const raw = Number(url.searchParams.get(name));
  if (!Number.isFinite(raw) || raw <= 0) return def;
  return Math.min(Math.floor(raw), max);
}

/**
 * GET /api/atlas/story-graph — pripovedni graf (issue #42 §21, PASS 6).
 *
 * Pregled (privzeto): stats + story atomi + uporaba.
 *   ?node=HOUSE:H-040&depth=1|2 — sosednost entitete (vhod za Story Engine, §16)
 *   ?type=PERSON&limit=200      — entitete po vrsti
 *   ?relation=OWNER_OF&limit=200 — relacije po tipu (§21: type+source+confidence+period)
 *   ?q=Sautter&type=PERSON      — iskanje entitet
 *   ?atoms=1                    — story atomi z razrešenimi claims (§22)
 *
 * Nič ne ugiba: vrne samo to, kar je v story-graph-1825.json (projekcija KG v1.4).
 */
export async function GET(request: Request) {
  const correlationId = correlationIdOf(request);
  const url = new URL(request.url);
  const headers = {
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "x-correlation-id": correlationId,
  };

  const node = url.searchParams.get("node");
  const type = url.searchParams.get("type") ?? undefined;
  const relation = url.searchParams.get("relation") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  const atoms = url.searchParams.get("atoms");
  const depthRaw = Number(url.searchParams.get("depth") ?? 1);

  if (type && !ENTITY_TYPES.has(type)) {
    return NextResponse.json(
      {
        ok: false,
        error: "unknown_entity_type",
        message: `Neznana vrsta entitete '${type}'. Možnosti: ${STORY_ENTITY_TYPES.join(", ")}.`,
      },
      { status: 400, headers }
    );
  }
  if (relation && !RELATION_TYPES.has(relation)) {
    return NextResponse.json(
      {
        ok: false,
        error: "unknown_relation_type",
        message: `Neznana vrsta relacije '${relation}'. Možnosti: ${[...RELATION_TYPES].join(", ")}.`,
      },
      { status: 400, headers }
    );
  }
  if (url.searchParams.get("depth") && ![1, 2].includes(depthRaw)) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_depth",
        message: "depth je lahko 1 ali 2 (višje bi vleklo tisoče parcel — glej HAS_PARCEL 2.865).",
      },
      { status: 400, headers }
    );
  }

  try {
    /* Sosednost — osnovni vhod za Story Engine (§16: map → entity → story). */
    if (node !== null) {
      const id = resolveStoryEntityParam(node);
      if (!id) {
        return NextResponse.json(
          { ok: false, error: "node_not_found", message: `Entiteta '${node}' ne obstaja v story grafu.` },
          { status: 404, headers }
        );
      }
      const nb = storyNeighborhood(id, depthRaw === 2 ? 2 : 1);
      return NextResponse.json({ ...nb!, ok: true }, { headers });
    }

    if (atoms) {
      const resolved = resolvedStoryAtoms();
      return NextResponse.json({ ok: true, count: resolved.length, story_atoms: resolved }, { headers });
    }

    if (q) {
      const hits = searchStoryEntities(q, type, numParam(url, "limit", 20, 200));
      return NextResponse.json({ ok: true, query: q, type: type ?? null, count: hits.length, hits }, { headers });
    }

    if (relation) {
      const limit = numParam(url, "limit", 200, 5000);
      const rels = storyRelations(relation, limit);
      return NextResponse.json(
        { ok: true, relation_type: relation, count: rels.length, truncated: rels.length >= limit, relations: rels },
        { headers }
      );
    }

    if (type) {
      const limit = numParam(url, "limit", 200, 5000);
      const ents = storyEntities(type, limit);
      return NextResponse.json(
        { ok: true, entity_type: type, count: ents.length, truncated: ents.length >= limit, entities: ents },
        { headers }
      );
    }

    return NextResponse.json(storyGraphOverview(), { headers });
  } catch (error) {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        scope: "atlas-story-graph",
        level: "error",
        msg: "story graph napaka",
        meta: { correlationId },
      })
    );
    return NextResponse.json({ ok: false, error: "internal_error", correlationId }, { status: 500, headers });
  }
}
