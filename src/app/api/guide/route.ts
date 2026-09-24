import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  askGuide,
  guideProviderTrail,
  type GuideMessage,
} from "@/lib/guide";
import { clientIpOf, rateLimited } from "@/lib/rate-limit";
import { GUIDE_LIMITS } from "@/lib/guide-limits";
import { openRouterQuotaOf } from "@/lib/openrouter-llm";

export const dynamic = "force-dynamic";
// Odgovor modela lahko traja več kot privzetih 10 s — enako kot TTS.
export const maxDuration = 60;

/**
 * POST /api/guide — pogovor z zbirko (uzidani AI vodnik).
 *
 * Zahtevek: { lang: "sl" | "en", messages: [{ role, content }, …] },
 * kjer je zadnje sporočilo uporabnikovo. Zgodovina živi v brskalniku;
 * strežnik ne shranjuje pogovora — samo omejitvene števce na IP.
 *
 * Odgovor: { answer, cites: [{ slug, titleSi, titleEn }] } — navedki so
 * preverjeni proti pravim slug-om zbirke, prikazano besedilo pa je očiščeno
 * oznak [[slug]].
 */

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(GUIDE_LIMITS.message),
});

const bodySchema = z.object({
  lang: z.enum(["sl", "en", "hr", "de", "it"]),
  messages: z.array(messageSchema).min(1).max(GUIDE_LIMITS.history),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid-request" },
        { status: 400 }
      );
    }

    const { lang, messages } = parsed.data;
    // Zadnje sporočilo mora biti vprašanje obiskovalca.
    if (messages[messages.length - 1]?.role !== "user") {
      return NextResponse.json({ error: "invalid-request" }, { status: 400 });
    }

    if (rateLimited("guide", clientIpOf(req))) {
      return NextResponse.json({ error: "rate-limited" }, { status: 429 });
    }

    const history: GuideMessage[] = messages;
    const { answer, cites, cached } = await askGuide(lang, history);

    return NextResponse.json(
      { answer, cites },
      {
        headers: {
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
          "X-Guide-Providers": guideProviderTrail(),
          // Operativni vpogled: je odgovor prišel iz predpomnilnika?
          "X-Guide-Cache": cached ? "hit" : "miss",
        },
      }
    );
  } catch (error) {
    console.error("API /api/guide error:", error);
    const message = error instanceof Error ? error.message : String(error);
    // Operativni vpogled (ASCII, obiskovalcu neviden): kateri ponudniki so
    // se poskusili, preden je pogovor padel.
    const providerHeader = { "X-Guide-Providers": guideProviderTrail() };
    // Dnevna kvota brezplačnega pogovora — iskreno „poskusite jutri",
    // ne zavajajoče „strežnik ni nastavljen". Priložimo tudi točno uro
    // ponastavitve, če jo je ponudnik povedal (X-RateLimit-Reset).
    if (/dnevna kvota presežena/.test(message)) {
      const quota = openRouterQuotaOf(error);
      return NextResponse.json(
        { error: "quota-exhausted", resetAt: quota?.resetAt ?? null },
        { status: 429, headers: providerHeader }
      );
    }
    // Prehodna omejitev zgornjega API-ja — javimo kot 429 (počasi).
    if (/429|rate|too many/i.test(message)) {
      return NextResponse.json(
        { error: "rate-limited" },
        { status: 429, headers: providerHeader }
      );
    }
    // Ustrezna oblika za manjkajočo konfiguracijo ZAI_CONFIG na strežniški
    // platformi (Vercel) — muzej je odkrit, ne tiho pokvarjen (vzorec 503).
    const unavailable =
      /z-ai|config|apiKey|baseUrl|ZAI/i.test(message) ||
      message === "Model je vrnil prazen odgovor";
    if (unavailable) {
      return NextResponse.json(
        { error: "guide-unavailable" },
        { status: 503, headers: providerHeader }
      );
    }
    return NextResponse.json(
      { error: "guide-failed" },
      { status: 500, headers: providerHeader }
    );
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
    }
  );
}
