/**
 * IIIF Presentation API 3.0 — čisti graditelji (brez I/O).
 *
 * Izvlečeno iz src/app/api/iiif/route.ts (61. sklop), da so teste
 * preverljivi brez zaganjanja strežnika. Route ostaja tanek: samo
 * GET + db + NextResponse.
 *
 *   buildCollection(...)     → Collection (celotna zbirka)
 *   buildManifestReference   → skrajšani vnos v Collection.items
 *   buildFullManifest(...)   → Manifest s Canvasom + sliko
 *                              + anotacijami življenjepisa (supplementing)
 *
 * Licenca vsebine: CC BY-SA 4.0 (enako kot /api/opendata).
 */

import { imageDimensions } from "@/lib/image-dimensions";
import { OBJECT_BIOGRAPHIES } from "@/lib/object-biographies";

export const IIIF_CONTEXT = ["https://iiif.io/api/presentation/3/context.json"];

export const IIIF_RIGHTS = "http://creativecommons.org/licenses/by-sa/4.0/";

export const IIIF_EVIDENCE_LABELS: Record<string, { sl: string; en: string }> = {
  DOCUMENTED: { sl: "dokumentirano", en: "documented" },
  CORROBORATED: { sl: "preverjeno", en: "corroborated" },
  TESTIMONY: { sl: "pričevanje", en: "testimony" },
  TRADITION: { sl: "tradicija", en: "tradition" },
  UNVERIFIED: { sl: "nepreverjeno", en: "unverified" },
  TO_COLLECT: { sl: "v zbiranju", en: "to collect" },
};

/** Življenjepisi po slugu — za IIIF anotacije faz na platnu (61. sklop).
 *  Vzorec: Rijksmuseumove spletne razstave poganjajo IIIF anotacije;
 *  tu anotiramo POT PREDMETA (življenjepis) na platno zapisa. */
const BIOGRAPHY_BY_SLUG = new Map(OBJECT_BIOGRAPHIES.map((b) => [b.slug, b]));

const STAGE_LABELS: Record<string, { sl: string; en: string }> = {
  nastanek: { sl: "nastanek", en: "creation" },
  zivljenje: { sl: "uporaba", en: "use" },
  prica: { sl: "pričevanje", en: "testimony" },
  raziskava: { sl: "raziskava", en: "research" },
  digitalizacija: { sl: "digitalizacija", en: "digitisation" },
  danes: { sl: "danes", en: "today" },
};

/** Strukturni tipi (Prisma vrstice in seme jih obe zadostita). */
export type IiifSourceRow = {
  nameSi: string | null;
  nameEn: string | null;
  license: string | null;
  url: string | null;
};

export type IiifExhibitRow = {
  slug: string;
  titleSi: string | null;
  titleEn: string | null;
  summarySi: string | null;
  summaryEn: string | null;
  museumNo: string | null;
  category: string | null;
  periodSi: string | null;
  periodEn: string | null;
  evidenceStatus: string | null;
  image: string | null;
  sources?: IiifSourceRow[];
};

/** Zapis z naloženimi viri (za polni Manifest). */
export type IiifExhibitWithSources = IiifExhibitRow & {
  sources: IiifSourceRow[];
};

export type LangMap = Record<string, string[]>;

/** IIIF language map — vrednosti so vedno POLJA nizov. */
export function langMap(sl?: string | null, en?: string | null): LangMap {
  const map: LangMap = {};
  if (sl) map.sl = [sl];
  if (en) map.en = [en];
  return map;
}

export const iiifRequiredStatement = {
  label: { en: ["Rights"] } satisfies LangMap,
  value: {
    en: ["Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)"],
  } satisfies LangMap,
};

export const iiifProvider = [
  {
    id: "https://github.com/markec12345678/griblje-museum",
    type: "Agent",
    label: { sl: ["Muzej vasi Griblje"], en: ["Griblje Village Museum"] } satisfies LangMap,
  },
];

/** Metapodatki eksponata kot IIIF metadata pari (label/value → language map). */
export function buildMetadata(exhibit: IiifExhibitRow) {
  const evidence = IIIF_EVIDENCE_LABELS[exhibit.evidenceStatus ?? ""];
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
export function buildHomepage(origin: string, exhibit: IiifExhibitRow): {
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
export function buildManifestReference(origin: string, exhibit: IiifExhibitRow) {
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
export function buildSourceMetadata(exhibit: IiifExhibitWithSources) {
  return exhibit.sources.map((s, i) => {
    const line = (name: string) =>
      `${name} — ${s.license}${s.url ? ` — ${s.url}` : ""}`;
    return {
      label: {
        sl: [`Vir ${i + 1}`],
        en: [`Source ${i + 1}`],
      } satisfies LangMap,
      value: langMap(line(s.nameSi ?? s.nameEn ?? ""), line(s.nameEn ?? s.nameSi ?? "")),
    };
  });
}

/** Anotacije življenjepisa (IIIF 3.0 `supplementing`) — ena anotacija na fazo,
 *  dvojezično telo (TextualBody sl+en), oznaka z letnico, fazo in statusom.
 *  Vrne null za zapise brez življenjepisa (Canvas ostane čist). */
export function buildBiographyAnnotations(
  manifestId: string,
  slug: string,
  canvasId: string
) {
  const bio = BIOGRAPHY_BY_SLUG.get(slug);
  if (!bio || bio.phases.length === 0) return null;
  const pageId = `${manifestId}&page=bio`;
  return {
    id: pageId,
    type: "AnnotationPage" as const,
    label: langMap("Življenje predmeta — faze", "Object biography — phases"),
    items: bio.phases.map((phase, i) => {
      const stage = STAGE_LABELS[phase.stage];
      const evidence = IIIF_EVIDENCE_LABELS[phase.evidenceStatus];
      const labelSl = `${phase.yearLabelSi} · ${stage?.sl ?? phase.stage} · ${evidence?.sl ?? phase.evidenceStatus}`;
      const labelEn = `${phase.yearLabelEn} · ${stage?.en ?? phase.stage} · ${evidence?.en ?? phase.evidenceStatus}`;
      return {
        id: `${manifestId}&anno=bio-${i}`,
        type: "Annotation" as const,
        motivation: "supplementing" as const,
        label: langMap(labelSl, labelEn),
        body: [
          {
            type: "TextualBody" as const,
            value: phase.textSi,
            format: "text/plain",
            language: "sl",
          },
          {
            type: "TextualBody" as const,
            value: phase.textEn,
            format: "text/plain",
            language: "en",
          },
        ],
        target: canvasId,
      };
    }),
  };
}

/** Polni Manifest z vsaj enim Canvasom (IIIF Presentation 3.0). */
export function buildFullManifest(origin: string, exhibit: IiifExhibitWithSources) {
  const manifestId = `${origin}/api/iiif?manifest=${exhibit.slug}`;
  const image = exhibit.image ?? "/images/authentic/hero-griblje.jpg";
  const { width, height } = imageDimensions(image);
  const canvasId = `${manifestId}&canvas=0`;
  const pageId = `${manifestId}&page=0`;

  // Življenjepis kot IIIF anotacije (supplementing) na istem platnu.
  const bioPage = buildBiographyAnnotations(manifestId, exhibit.slug, canvasId);

  return {
    "@context": IIIF_CONTEXT,
    id: manifestId,
    type: "Manifest",
    label: langMap(exhibit.titleSi, exhibit.titleEn),
    summary: langMap(exhibit.summarySi, exhibit.summaryEn),
    requiredStatement: iiifRequiredStatement,
    rights: IIIF_RIGHTS,
    provider: iiifProvider,
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
        // Anotacije (ne-slikalne) živijo v Canvas.annotations po IIIF 3.0 —
        // dopolnjujejo platno z življenjepisom predmeta (faze po virih).
        ...(bioPage ? { annotations: [bioPage] } : {}),
      },
    ],
  };
}
