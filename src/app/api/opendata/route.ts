import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { WIKIDATA_SAMEAS, wikidataUrlFor } from "@/lib/wikidata";
import { sourceKeyOf } from "@/lib/source-registry";

export const dynamic = "force-dynamic";

/**
 * GET /api/opendata — celotna zbirka kot odprti podatki (CC BY-SA 4.0).
 *
 * Načelo odprtosti po vzoru vodilnih evropskih muzejev
 * (Nasjonalmuseet — odprti API od 2018): zbirka pripada javnosti.
 */
export async function GET() {
  try {
    const [exhibits, events, stories] = await Promise.all([
      db.exhibit.findMany({
        include: { sources: { orderBy: { sortOrder: "asc" } } },
        orderBy: { sortOrder: "asc" },
      }),
      db.museumEvent.findMany({ orderBy: { startsAt: "asc" } }),
      db.storyItem.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    const sourceCount = await db.source.count();

    const now = new Date().toISOString();

    /* Registracija virov (SOURCE AUTHORITY): identiteta vsake vrstice vira
     * (isti dokument = isti sourceKey) + seznam zapisov, ki vir citirajo
     * (usedBy) — SOURCE → EXHIBITS referenčna povezava v odprtih podatkih.
     * Izpeljano iz vrstic, ki jih izvozi taendpoint — brez sprememb podatkov. */
    const sourceUsage = new Map<string, string[]>();
    for (const ex of exhibits) {
      for (const s of ex.sources) {
        const key = sourceKeyOf(s.nameSi, s.url);
        const arr = sourceUsage.get(key) ?? [];
        if (!arr.includes(ex.museumNo ?? ex.slug)) arr.push(ex.museumNo ?? ex.slug);
        sourceUsage.set(key, arr);
      }
    }

    const jsonld = {
      "@context": "https://schema.org",
      "@type": "Museum",
      name: "Muzej vasi Griblje",
      alternateName: "Griblje Village Museum",
      description:
        "Digitalni muzej vasi Griblje v Beli krajini — zbirka, zgodbe, zemljevid in odprti podatki.",
      url: "/",
      areaServed: { "@type": "Village", name: "Griblje" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Griblje",
        addressRegion: "Bela krajina",
        addressCountry: "SI",
      },
      geo: { "@type": "GeoCoordinates", latitude: 45.57246, longitude: 15.29257 },
      identifier: "mvg-2026",
      sameAs: [
        "https://www.wikidata.org/wiki/Q2531566",
        "https://commons.wikimedia.org/wiki/Category:Griblje",
      ],
    };

    const manifest = {
      museum: {
        id: "muzej-vasi-griblje",
        nameSi: "Muzej vasi Griblje",
        nameEn: "Griblje Village Museum",
        slug: "mvg",
        established: "2026",
        language: ["sl", "en"],
        license: "CC BY-SA 4.0",
        homepage: "/",
      },
      generatedAt: now,
      counts: {
        exhibits: exhibits.length,
        sources: sourceCount,
        events: events.length,
        stories: stories.length,
      },
      endpoints: {
        exhibits: "/api/exhibits",
        events: "/api/events",
        stories: "/api/stories",
        search: "/api/search?q=<poizvedba>",
        opendata: "/api/opendata",
        iiif: "/api/iiif",
      },
      evidenceScale: [
        { code: "DOCUMENTED", labelSi: "dokumentirano", labelEn: "documented" },
        { code: "CORROBORATED", labelSi: "preverjeno", labelEn: "corroborated" },
        { code: "TESTIMONY", labelSi: "pričevanje", labelEn: "testimony" },
        { code: "TRADITION", labelSi: "tradicija", labelEn: "tradition" },
        { code: "UNVERIFIED", labelSi: "nepreverjeno", labelEn: "unverified" },
        { code: "TO_COLLECT", labelSi: "v zbiranju", labelEn: "to collect" },
      ],
      linkedOpenData: {
        noteSi:
          "Trajne povezave (sameAs) na Wikidate — vzorec trajnih identifikatorjev, kakršne uporabljajo vodilni odprti muzeji (DigitaltMuseum).",
        noteEn:
          "Persistent links (sameAs) to Wikidata — the pattern of persistent identifiers used by leading open museums (DigitaltMuseum).",
        providers: ["https://www.wikidata.org"],
        exhibitsLinked: Object.keys(WIKIDATA_SAMEAS).length,
      },
      jsonld,
      data: {
        exhibits: exhibits.map((ex) => ({
          slug: ex.slug,
          museumNo: ex.museumNo,
          canonicalUrl: `${SITE_URL}/exponat/${ex.slug}`,
          sameAs: wikidataUrlFor(ex.slug),
          category: ex.category,
          title: { sl: ex.titleSi, en: ex.titleEn },
          period: { sl: ex.periodSi, en: ex.periodEn },
          summary: { sl: ex.summarySi, en: ex.summaryEn },
          story: { sl: ex.storySi, en: ex.storyEn },
          evidenceStatus: ex.evidenceStatus,
          image: ex.image,
          location:
            ex.lat != null && ex.lng != null
              ? { latitude: ex.lat, longitude: ex.lng, note: "verified" }
              : null,
          sources: ex.sources.map((s) => ({
            sourceKey: sourceKeyOf(s.nameSi, s.url),
            name: { sl: s.nameSi, en: s.nameEn },
            type: s.sourceType,
            license: s.license,
            url: s.url,
            usedBy: sourceUsage.get(sourceKeyOf(s.nameSi, s.url)) ?? [
              ex.museumNo ?? ex.slug,
            ],
          })),
        })),
        stories: stories.map((st) => ({
          kind: st.kind,
          title: { sl: st.titleSi, en: st.titleEn },
          text: { sl: st.textSi, en: st.textEn },
          attribution: { sl: st.attributionSi, en: st.attributionEn },
          evidenceStatus: st.evidenceStatus,
        })),
        events: events.map((ev) => ({
          title: { sl: ev.titleSi, en: ev.titleEn },
          description: { sl: ev.descriptionSi, en: ev.descriptionEn },
          startsAt: ev.startsAt.toISOString(),
          location: { sl: ev.locationSi, en: ev.locationEn },
          type: ev.eventType,
          isExternal: ev.isExternal,
          externalUrl: ev.externalUrl,
        })),
      },
    };

    return NextResponse.json(manifest, {
      headers: {
        "Cache-Control": "public, max-age=300",
        "Content-License": "CC BY-SA 4.0",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("API /api/opendata error:", error);
    return NextResponse.json({ error: "Napaka pri gradnji odprtih podatkov" }, { status: 500 });
  }
}
