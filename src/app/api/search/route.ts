import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/search?q=<poizvedba> — enotno iskanje po celotni muzejski bazi
 * (razstave + zgodbe + dogodki), po vzoru DigitaltMuseum (digitaltmuseum.no),
 * skupne norveško-švedske muzejske baze, katere jedro je prav enotno iskanje.
 *
 * Iskanje je neobčutljivo na velike/male črke in diakritike (č→c, ž→z …),
 * tako da "crnomelj" najde tudi "Črnomelj". Odgovor vrača zadetke po tipih
 * s polji v obeh jezikih; pravilen je `Access-Control-Allow-Origin: *`.
 */

/** Normalizacija niza: NFD razstavi diakritike, odstranimo jih in lowercasamo. */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

type Indexed = { haystack: string; fields: string[] };

function buildIndex(entries: Array<[string, string]>): Indexed[] {
  return entries.map(([field, value]) => ({ haystack: normalize(value), fields: [field] }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = searchParams.get("q") ?? "";

    if (normalize(raw).length < 2) {
      return NextResponse.json(
        {
          error: "Poizvedba prekratka — vnesite vsaj 2 znaka / Query too short — enter at least 2 characters",
          query: raw,
        },
        { status: 400 }
      );
    }

    const needle = normalize(raw);

    const [exhibits, stories, events] = await Promise.all([
      db.exhibit.findMany({ orderBy: { sortOrder: "asc" } }),
      db.storyItem.findMany({ orderBy: { sortOrder: "asc" } }),
      db.museumEvent.findMany({ orderBy: { startsAt: "asc" } }),
    ]);

    // --- Razstave: naslov, obdobje, povzetek, zgodba, slug ---
    const exhibitHits = exhibits
      .map((ex) => {
        const index = buildIndex([
          ["titleSi", ex.titleSi],
          ["titleEn", ex.titleEn],
          ["periodSi", ex.periodSi],
          ["periodEn", ex.periodEn],
          ["summarySi", ex.summarySi],
          ["summaryEn", ex.summaryEn],
          ["storySi", ex.storySi],
          ["storyEn", ex.storyEn],
          ["slug", ex.slug],
        ]);
        const matchedIn = index
          .filter((entry) => entry.haystack.includes(needle))
          .flatMap((entry) => entry.fields);
        return { exhibit: ex, matchedIn };
      })
      .filter((hit) => hit.matchedIn.length > 0)
      .map(({ exhibit: ex, matchedIn }) => ({
        type: "exhibit",
        slug: ex.slug,
        title: { sl: ex.titleSi, en: ex.titleEn },
        period: { sl: ex.periodSi, en: ex.periodEn },
        summary: { sl: ex.summarySi, en: ex.summaryEn },
        evidenceStatus: ex.evidenceStatus,
        yearFrom: ex.yearFrom,
        yearTo: ex.yearTo,
        image: ex.image,
        url: `/?exhibit=${ex.slug}`,
        matchedIn,
      }));

    // --- Zgodbe: naslov, besedilo, pripis ---
    const storyHits = stories
      .map((st) => {
        const index = buildIndex([
          ["titleSi", st.titleSi],
          ["titleEn", st.titleEn],
          ["textSi", st.textSi],
          ["textEn", st.textEn],
          ["attributionSi", st.attributionSi ?? ""],
          ["attributionEn", st.attributionEn ?? ""],
        ]);
        const matchedIn = index
          .filter((entry) => entry.haystack.includes(needle))
          .flatMap((entry) => entry.fields);
        return { story: st, matchedIn };
      })
      .filter((hit) => hit.matchedIn.length > 0)
      .map(({ story: st, matchedIn }) => ({
        type: "story",
        kind: st.kind,
        title: { sl: st.titleSi, en: st.titleEn },
        evidenceStatus: st.evidenceStatus,
        url: "/#zgodbe",
        matchedIn,
      }));

    // --- Dogodki: naslov, opis, lokacija ---
    const eventHits = events
      .map((ev) => {
        const index = buildIndex([
          ["titleSi", ev.titleSi],
          ["titleEn", ev.titleEn],
          ["descriptionSi", ev.descriptionSi],
          ["descriptionEn", ev.descriptionEn],
          ["locationSi", ev.locationSi],
          ["locationEn", ev.locationEn],
        ]);
        const matchedIn = index
          .filter((entry) => entry.haystack.includes(needle))
          .flatMap((entry) => entry.fields);
        return { event: ev, matchedIn };
      })
      .filter((hit) => hit.matchedIn.length > 0)
      .map(({ event: ev, matchedIn }) => ({
        type: "event",
        title: { sl: ev.titleSi, en: ev.titleEn },
        startsAt: ev.startsAt.toISOString(),
        location: { sl: ev.locationSi, en: ev.locationEn },
        isExternal: ev.isExternal,
        externalUrl: ev.externalUrl,
        url: "/#dogodki",
        matchedIn,
      }));

    return NextResponse.json(
      {
        query: raw,
        normalized: needle,
        counts: {
          exhibits: exhibitHits.length,
          stories: storyHits.length,
          events: eventHits.length,
          total: exhibitHits.length + storyHits.length + eventHits.length,
        },
        results: {
          exhibits: exhibitHits,
          stories: storyHits,
          events: eventHits,
        },
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("API /api/search error:", error);
    return NextResponse.json({ error: "Napaka pri iskanju / Search failed" }, { status: 500 });
  }
}
