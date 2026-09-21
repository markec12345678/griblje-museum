import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  IIIF_CONTEXT,
  IIIF_RIGHTS,
  iiifProvider,
  iiifRequiredStatement,
  buildManifestReference,
  buildFullManifest,
  type LangMap,
} from "@/lib/iiif-manifest";

export const dynamic = "force-dynamic";

/**
 * GET /api/iiif — IIIF Presentation API 3.0.
 *
 * Zbirka (Collection) z enim Manifestom na eksponat — interoperabilna
 * oblika odprtih podatkov po evropskem standardu IIIF, ki ga uporabljajo
 * Europeana, DigitaltMuseum in vodilni muzeji.
 *
 *   GET /api/iiif                  → Collection (celotna zbirka)
 *   GET /api/iiif?manifest=<slug>  → posamezen Manifest s Canvasom, sliko
 *                                    in anotacijami življenjepisa (faze)
 *
 * Čisti graditelji so v src/lib/iiif-manifest.ts (preverljivi brez strežnika).
 * Licenca vsebine: CC BY-SA 4.0 (enako kot /api/opendata).
 */

function jsonResponse(body: unknown, status = 200) {
  return new NextResponse(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300",
    },
  });
}

type ExhibitRow = Awaited<ReturnType<typeof db.exhibit.findMany>>[number];
/** Vrstica vira, kot jo vrača Prisma (isti podatkovni model kot /api/exhibits
 *  in /api/opendata — brez novega modela, brez spremembe semantike). */
type SourceRow = Awaited<ReturnType<typeof db.source.findMany>>[number];
type ExhibitWithSources = ExhibitRow & { sources: SourceRow[] };

export async function GET(request: Request) {
  try {
    const { origin, searchParams } = new URL(request.url);
    const slug = searchParams.get("manifest");

    // Posamezen manifest (ni ovit v Collection) — z viri v metapodatkih.
    if (slug !== null) {
      const exhibit: ExhibitWithSources | null = await db.exhibit.findUnique({
        where: { slug },
        include: { sources: { orderBy: { sortOrder: "asc" } } },
      });
      if (!exhibit) {
        return jsonResponse(
          {
            error: "Manifest ni najden / Manifest not found",
            slug,
            hint: "Seznam vseh manifestov: /api/iiif",
          },
          404
        );
      }
      return jsonResponse(buildFullManifest(origin, exhibit));
    }

    // Collection — celotna zbirka.
    const exhibits = await db.exhibit.findMany({ orderBy: { sortOrder: "asc" } });

    const collection = {
      "@context": IIIF_CONTEXT,
      id: `${origin}/api/iiif`,
      type: "Collection",
      label: {
        sl: ["Muzej vasi Griblje — celotna zbirka"],
        en: ["Griblje Village Museum — the full collection"],
      } satisfies LangMap,
      summary: {
        sl: [
          "Celotna digitalna zbirka Muzeja vasi Griblje v interoperabilni obliki IIIF Presentation API 3.0 — eksponati, dvojezične oznake in slike. Podatki in metapodatki so na voljo pod licenco Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).",
        ],
        en: [
          "The full digital collection of the Griblje Village Museum in the interoperable IIIF Presentation API 3.0 form — exhibits, bilingual labels and images. Data and metadata are available under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) licence.",
        ],
      } satisfies LangMap,
      requiredStatement: iiifRequiredStatement,
      rights: IIIF_RIGHTS,
      provider: iiifProvider,
      homepage: [
        {
          id: origin,
          type: "Text",
          format: "text/html",
          label: {
            sl: ["Muzej vasi Griblje — domača stran"],
            en: ["Griblje Village Museum — homepage"],
          } satisfies LangMap,
        },
      ],
      seeAlso: [
        {
          id: `${origin}/api/opendata`,
          type: "Dataset",
          label: { en: ["Open data (JSON)"] } satisfies LangMap,
          format: "application/json",
          profile: "https://schema.org",
        },
      ],
      items: exhibits.map((exhibit) => buildManifestReference(origin, exhibit)),
    };

    return jsonResponse(collection);
  } catch (error) {
    console.error("API /api/iiif error:", error);
    return jsonResponse(
      { error: "Napaka pri gradnji IIIF manifesta / Failed to build IIIF manifest" },
      500
    );
  }
}
