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
import { imageDimensions } from "@/lib/image-dimensions";

const RIGHTS = "http://creativecommons.org/licenses/by-sa/4.0/";

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
/** Vrstica vira, kot jo vrača Prisma (isti podatkovni model kot /api/exhibits
 *  in /api/opendata — brez novega modela, brez spremembe semantike). */
type SourceRow = Awaited<ReturnType<typeof db.source.findMany>>[number];
type ExhibitWithSources = ExhibitRow & { sources: SourceRow[] };

/** IIIF language map — vrednosti so vedno POLJA nizov. */
function langMap(sl?: string | null, en?: string | null): LangMap {
  const map: LangMap = {};
  if (sl) map.sl = [sl];
  if (en) map.en = [en];
  return map;
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
  const pairs: { label: LangMap; value: LangMap }[] = [
    {
      label: { sl: ["Muzejska številka"], en: ["Museum number"] } satisfies LangMap,
      value: langMap(exhibit.museumNo ?? "—", exhibit.museumNo ?? "—"),
    },
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
  return pairs;
}

/** Domače strani zapisa: kanonična muzejska stran + interaktivni ogled. */
function buildHomepage(origin: string, exhibit: ExhibitRow): {
  id: string;
  type: "Text";
  format: string;
  label: LangMap;
}[] {
  return [
    {
      id: `${origin}/exponat/${exhibit.slug}`,
      type: "Text",
      format: "text/html",
      label: langMap("Muzejski zapis o predmetu", "Museum record page"),
    },
    {
      id: `${origin}/?exhibit=${exhibit.slug}`,
      type: "Text",
      format: "text/html",
      label: langMap("Ogled eksponata v muzeju", "View the exhibit in the museum"),
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
    homepage: buildHomepage(origin, exhibit),
    seeAlso: [
      { id: `${origin}/api/exhibits`, type: "Dataset", format: "application/json" },
    ],
    metadata: buildMetadata(exhibit),
  };
}

/** Viri zapisa kot IIIF metadata pari — ime, licenca, URL (§12 TASK 37).
 *  Vrstni red je enak registermu VIRI na muzejski strani zapisa, zato
 *  manifest predstavlja ISTI vir kot muzejska stran in odprti podatki. */
function buildSourceMetadata(exhibit: ExhibitWithSources) {
  return exhibit.sources.map((s, i) => {
    const line = (name: string) =>
      `${name} — ${s.license}${s.url ? ` — ${s.url}` : ""}`;
    return {
      label: {
        sl: [`Vir ${i + 1}`],
        en: [`Source ${i + 1}`],
      } satisfies LangMap,
      value: langMap(line(s.nameSi), line(s.nameEn)),
    };
  });
}

/** Polni Manifest z vsaj enim Canvasom (IIIF Presentation 3.0). */
function buildFullManifest(origin: string, exhibit: ExhibitWithSources) {
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
    homepage: buildHomepage(origin, exhibit),
    seeAlso: [
      { id: `${origin}/api/exhibits`, type: "Dataset", format: "application/json" },
      { id: `${origin}/api/opendata`, type: "Dataset", format: "application/json" },
    ],
    metadata: [...buildMetadata(exhibit), ...buildSourceMetadata(exhibit)],
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
