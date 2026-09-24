import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { askCurator, curatorClientIp, curatorRateLimited } from "@/lib/curator";
import { claimsForSlugs } from "@/lib/curator-claims";
import { correlationIdOf } from "@/lib/obs";

export const dynamic = "force-dynamic";
// Sinteza modela lahko traja več kot privzetih 10 s — enako kot vodnik.
export const maxDuration = 60;

/**
 * POST /api/curator — AI kustos (dokazno zasnovan, closed world).
 *
 * Zahtevek: { lang: "sl" | "en" | "hr" | "de" | "it", question: string }.
 * Zgodovina pogovora NE obstaja — kustos je enovprašanjenski inženir
 * dokaza (razlikuje se od večturnega vodnika /api/guide).
 *
 * Odgovor: { answerable, reason, queryType, kajVemo, kakoVemo, viri,
 * opomba, entities, suggestions, cached } — vsak vir v odgovoru je
 * preverjen proti semenu zbirke; navedki [[slug]] v besedilu obstajajo.
 *
 * Zasebnost: pogovorov ne shranjujemo; edino anonimni predpomnilnik
 * pogostih vprašanj (24 h) — enako kot vodnik.
 */

const QUESTION_MAX_CHARS = 500;

const bodySchema = z.object({
  lang: z.enum(["sl", "en", "hr", "de", "it"]),
  question: z.string().min(3).max(QUESTION_MAX_CHARS),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid-request" }, { status: 400 });
    }

    const { lang, question } = parsed.data;

    if (curatorRateLimited(curatorClientIp(req))) {
      return NextResponse.json({ error: "rate-limited" }, { status: 429 });
    }

    const result = await askCurator(lang, question);

    // Issue #27/K — veriga dokaza: objavljene trditve zapisov v odgovoru,
    // vsaka z vidnim evidence statusom in oznako, ali sme AI trditev
    // predstaviti kot dejstvo (TESTIMONY/TRADITION/TO_COLLECT nikoli tiho).
    const claims = await claimsForSlugs(result.viri.map((v) => v.slug));

    return NextResponse.json(
      { ...result, ...(claims.length > 0 ? { claims } : {}) },
      {
        headers: {
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
          "x-correlation-id": correlationIdOf(req),
        },
      }
    );
  } catch (error) {
    console.error("API /api/curator error:", error);
    const message = error instanceof Error ? error.message : String(error);
    if (/dnevna kvota presežena/.test(message)) {
      return NextResponse.json({ error: "quota-exhausted" }, { status: 429 });
    }
    if (/429|rate|too many/i.test(message)) {
      return NextResponse.json({ error: "rate-limited" }, { status: 429 });
    }
    const unavailable =
      /z-ai|config|apiKey|baseUrl|ZAI/i.test(message) ||
      message === "Model je vrnil prazen odgovor";
    if (unavailable) {
      return NextResponse.json({ error: "curator-unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "curator-failed" }, { status: 500 });
  }
}

/** Preverjanje izvora za odprti muzejski API (enako kot ostale poti). */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  );
}
