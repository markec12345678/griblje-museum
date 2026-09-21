import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  buildVisitPlan,
  planCacheGet,
  planCacheKey,
  planCacheSet,
  planClientIp,
  planRateLimited,
} from "@/lib/plan-visit";

export const dynamic = "force-dynamic";
// Sinteza pripovedi lahko traja več kot privzetih 10 s — enako kot kustos.
export const maxDuration = 60;

/**
 * POST /api/plan-visit — AI planiranje obiska (vrzel #4 iz benchmarka).
 *
 * Zahtevek: { lang, minutes: 15|30|60|90, interests: kategorije[], withKids }.
 * Izbira postaj je DETERMINISTIČNA (brez modela); model samo personalizira
 * pripoved nad podanimi postajami in ne more spremeniti njihovega izbora.
 *
 * Odgovor: { intro, totalMinutes, tip, synthesized, stops[] } — postaje so
 * vedno prave (slug zbirke); synthesized=false pomeni odkrito, da AI
 * pripovedi ni bilo in načrt nosi deterministične povzetke.
 *
 * Zasebnost: profila NE shranjujemo; edino anonimni predpomnilnik pogostih
 * načrtov (24 h, max 120) — enako načelo kot kustos in vodnik.
 */

const bodySchema = z.object({
  lang: z.enum(["sl", "en", "hr", "de", "it"]),
  minutes: z.union([z.literal(15), z.literal(30), z.literal(60), z.literal(90)]),
  interests: z
    .array(z.enum(["kraj", "kolpa", "vojna", "narava", "gospodarstvo", "sege"]))
    .max(6)
    .default([]),
  withKids: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid-request" }, { status: 400 });
    }

    if (planRateLimited(planClientIp(req))) {
      return NextResponse.json({ error: "rate-limited" }, { status: 429 });
    }

    const input = parsed.data;
    const key = planCacheKey(input);
    const cached = planCacheGet(key);
    if (cached) {
      return NextResponse.json(
        { ...cached, cached: true },
        {
          headers: {
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    const plan = await buildVisitPlan(input);
    planCacheSet(key, plan);

    return NextResponse.json(plan, {
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("API /api/plan-visit error:", error);
    const message = error instanceof Error ? error.message : String(error);
    if (/dnevna kvota presežena/.test(message)) {
      return NextResponse.json({ error: "quota-exhausted" }, { status: 429 });
    }
    return NextResponse.json({ error: "plan-failed" }, { status: 500 });
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
