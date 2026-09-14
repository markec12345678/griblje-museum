import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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
      jsonld,
      data: {
        exhibits: exhibits.map((ex) => ({
          slug: ex.slug,
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
            name: { sl: s.nameSi, en: s.nameEn },
            type: s.sourceType,
            license: s.license,
            url: s.url,
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
