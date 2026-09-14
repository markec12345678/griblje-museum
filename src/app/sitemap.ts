import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap — osnovna odprtost spletišča za iskalnike.
 * Muzej je enostranska aplikacija, zato je objavljen koren "/"
 * skupaj z odprtimi podatkovnimi končnimi točkami.
 *
 * Domena: en izvor resnice `src/lib/site.ts` (env NEXT_PUBLIC_SITE_URL
 * z današnjo produkcijsko domeno kot privzeto; ob nakupu prave domene
 * jo nastavite v okolju).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL + "/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
