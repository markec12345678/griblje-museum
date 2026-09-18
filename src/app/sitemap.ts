import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { seedExhibits } from "@/lib/museum-content";

/**
 * Sitemap — odprtost spletišča za iskalnike.
 *
 * Koren "/" je živi muzej (enostranska aplikacija), vsak muzejski zapis
 * pa ima od 29. sklopa naprej svojo strežniško renderirano stran
 * /exponat/[slug] — zato je vsak predmet zbirke samostojno najdljiv
 * muzejski zapis (vzorec: Rijksmuseum Collection Online, DigitaltMuseum).
 *
 * Domena: en izvor resnice `src/lib/site.ts` (env NEXT_PUBLIC_SITE_URL
 * z današnjo produkcijsko domeno kot privzeto; ob nakupu prave domene
 * jo nastavite v okolju).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const objects: MetadataRoute.Sitemap = seedExhibits.map((ex) => ({
    url: `${SITE_URL}/exponat/${ex.slug}`,
    lastModified: ex.addedAt ? new Date(ex.addedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
    // Jezikovni različici zapisa: slovenščina (kanonična) in angleščina
    // (?lang=en) — iskalnik prek xhtml:link razume obe.
    alternates: {
      languages: {
        sl: `${SITE_URL}/exponat/${ex.slug}`,
        en: `${SITE_URL}/exponat/${ex.slug}?lang=en`,
      },
    },
  }));

  return [
    {
      url: SITE_URL + "/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...objects,
  ];
}
