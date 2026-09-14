import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/iiif — IIIF Presentation API 3.0.
 *
 * Zbirka (Collection) z enim Manifestom na eksponat — interoperabilna
 * oblika odprtih podatkov po evropskem standardu IIIF, ki ga uporabljajo
 * Europeana, DigitaltMuseum in vodilni muzeji.
 *
 *   GET /api/iiif                  → Collection (celotna zbirka, 20 manifestov)
 *   GET /api/iiif?manifest=<slug>  → posamezen Manifest s Canvasom in sliko
 *
 * Licenca vsebine: CC BY-SA 4.0 (enako kot /api/opendata).
 */

const IIIF_CONTEXT = ["https://iiif.io/api/presentation/3/context.json"];
const RIGHTS = "http://creativecommons.org/licenses/by-sa/4.0/";

/** Dejanske dimenzije avtentičnih fotografij v /public/images/authentic. */
const IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/images/authentic/hero-griblje.jpg": { width: 1600, height: 800 },
  "/images/authentic/griblje-vas.jpg": { width: 1600, height: 1071 },
  "/images/authentic/sveti-vid.jpg": { width: 1048, height: 1600 },
  "/images/authentic/bojanci-1908.jpg": { width: 729, height: 426 },
  "/images/authentic/sokcev-dvor.jpg": { width: 1600, height: 1200 },
  "/images/authentic/kolpa.jpg": { width: 1600, height: 1200 },
  "/images/authentic/malenca.jpg": { width: 1600, height: 1200 },
  "/images/authentic/mlin-pobrezje.jpg": { width: 1600, height: 1075 },
  "/images/authentic/niko-zupanic.jpg": { width: 426, height: 612 },
  "/images/authentic/snos-crnomelj.jpg": { width: 1600, height: 1200 },
  "/images/authentic/otok-letalisce.jpg": { width: 1600, height: 1054 },
  "/images/authentic/evakuacija.jpg": { width: 1600, height: 1072 },
  "/images/authentic/meja.jpg": { width: 1600, height: 1063 },
  "/images/authentic/ribnik.jpg": { width: 1600, height: 1067 },
  "/images/authentic/stara-hisa.jpg": { width: 1600, height: 1520 },
  "/images/authentic/ravnace.jpg": { width: 1600, height: 1200 },
  "/images/authentic/jurjevanje.jpg": { width: 1236, height: 903 },
  "/images/authentic/pogaca.jpg": { width: 1600, height: 1063 },
  "/images/authentic/predenje.jpg": { width: 682, height: 1070 },
  "/images/authentic/storklja.jpg": { width: 1600, height: 1067 },
  "/images/authentic/breze.jpg": { width: 1600, height: 997 },
};

const FALLBACK_DIMENSIONS = { width: 1600, height: 1067 };

const EVIDENCE_LABELS: Record<string, { sl: string; en: string }> = {
  DOCUMENTED: { sl: "dokumentirano", en: "documented" },
  CORROBORATED: { sl: "preverjeno", en: "corroborated" },
  TESTIMONY: { sl: "pričevanje", en: "testimony" },
  TRADITION: { sl: "tradicija", en: "tradition" },
  UNVERIFIED: { sl: "nepreverjeno", en: "unverified" },
  TO_COLLECT: { sl: "v zbiranju", en: "to collect" },
};

type LangMap = Record<string, string[]>;
type ExhibitRow = Awaited<ReturnType<typeof db.exhibit.findMany>>[number];

/** IIIF language map — vrednosti so vedno POLJA nizov. */
function langMap(sl?: string | null, en?: string | null): LangMap {
  const map: LangMap = {};
  if (sl) map.sl = [sl];
  if (en) map.en = [en];
  return map;
}

function imageDimensions(image: string) {
  return IMAGE_DIMENSIONS[image] ?? FALLBACK_DIMENSIONS;
}

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

const requiredStatement = {
  label: { en: ["Rights"] } satisfies LangMap,
  value: {
    en: ["Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)"],
  } satisfies LangMap,
};

const provider = [
  {
    id: "https://github.com/markec12345678/griblje-museum",
    type: "Agent",
    label: { sl: ["Muzej vasi Griblje"], en: ["Griblje Village Museum"] } satisfies LangMap,
  },
];

/** Metapodatki eksponata kot IIIF metadata pari (label/value → language map). */
function buildMetadata(exhibit: ExhibitRow) {
  const evidence = EVIDENCE_LABELS[exhibit.evidenceStatus];
  return [
    {
      label: { sl: ["Kategorija"], en: ["Category"] } satisfies LangMap,
      value: langMap(exhibit.category, exhibit.category),
    },
    {
      label: { sl: ["Obdobje"], en: ["Period"] } satisfies LangMap,
      value: langMap(exhibit.periodSi, exhibit.periodEn),
    },
    {
      label: { sl: ["Zanesljivost"], en: ["Evidence status"] } satisfies LangMap,
      value: evidence
        ? langMap(evidence.sl, evidence.en)
        : langMap(exhibit.evidenceStatus, exhibit.evidenceStatus),
    },
    {
      label: { sl: ["Znak"], en: ["Slug"] } satisfies LangMap,
      value: langMap(exhibit.slug, exhibit.slug),
    },
  ];
}

/** Manifest v zbirki (skrajšani vnos v Collection.items). */
function buildManifestReference(origin: string, exhibit: ExhibitRow) {
  const image = exhibit.image ?? "/images/authentic/hero-griblje.jpg";
  return {
    id: `${origin}/api/iiif?manifest=${exhibit.slug}`,
    type: "Manifest",
    label: langMap(exhibit.titleSi, exhibit.titleEn),
    summary: langMap(exhibit.summarySi, exhibit.summaryEn),
    thumbnail: [{ id: `${origin}${image}`, type: "Image", format: "image/jpeg" }],
    homepage: [
      {
        id: `${origin}/?exhibit=${exhibit.slug}`,
        type: "Text",
        format: "text/html",
        label: langMap("Ogled eksponata v muzeju", "View the exhibit in the museum"),
      },
    ],
    seeAlso: [{ id: `${origin}/api/exhibits`, type: "Dataset", format: "application/json" }],
    metadata: buildMetadata(exhibit),
  };
}

/** Polni Manifest z vsaj enim Canvasom (IIIF Presentation 3.0). */
function buildFullManifest(origin: string, exhibit: ExhibitRow) {
  const manifestId = `${origin}/api/iiif?manifest=${exhibit.slug}`;
  const image = exhibit.image ?? "/images/authentic/hero-griblje.jpg";
  const { width, height } = imageDimensions(image);
  const canvasId = `${manifestId}&canvas=0`;
  const pageId = `${manifestId}&page=0`;

  return {
    "@context": IIIF_CONTEXT,
    id: manifestId,
    type: "Manifest",
    label: langMap(exhibit.titleSi, exhibit.titleEn),
    summary: langMap(exhibit.summarySi, exhibit.summaryEn),
    requiredStatement,
    rights: RIGHTS,
    provider,
    thumbnail: [{ id: `${origin}${image}`, type: "Image", format: "image/jpeg" }],
    homepage: [
      {
        id: `${origin}/?exhibit=${exhibit.slug}`,
        type: "Text",
        format: "text/html",
        label: langMap("Ogled eksponata v muzeju", "View the exhibit in the museum"),
      },
    ],
    seeAlso: [{ id: `${origin}/api/exhibits`, type: "Dataset", format: "application/json" }],
    metadata: buildMetadata(exhibit),
    items: [
      {
        id: canvasId,
        type: "Canvas",
        label: langMap(exhibit.titleSi, exhibit.titleEn),
        height,
        width,
        // Canvas.items je v IIIF 3.0 POLJE AnnotationPage (ne polje polj).
        items: [
          {
            id: pageId,
            type: "AnnotationPage",
            items: [
              {
                id: `${pageId}&anno=0`,
                type: "Annotation",
                motivation: "painting",
                body: {
                  id: `${origin}${image}`,
                  type: "Image",
                  format: "image/jpeg",
                  width,
                  height,
                },
                target: canvasId,
              },
            ],
          },
        ],
      },
    ],
  };
}

export async function GET(request: Request) {
  try {
    const { origin, searchParams } = new URL(request.url);
    const slug = searchParams.get("manifest");

    // Posamezen manifest (ni ovit v Collection).
    if (slug !== null) {
      const exhibit: ExhibitRow | null = await db.exhibit.findUnique({
        where: { slug },
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
      requiredStatement,
      rights: RIGHTS,
      provider,
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
