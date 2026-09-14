import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Robots — celotno spletišče je javno, tudi odprti podatkovni API
 * (načelo odprtosti po vzoru DigitaltMuseum / Nasjonalmuseet).
 *
 * Domena: en izvor resnice `src/lib/site.ts` (env NEXT_PUBLIC_SITE_URL
 * z današnjo produkcijsko domeno kot privzeto; ob nakupu prave domene
 * jo nastavite v okolju).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: SITE_URL + "/sitemap.xml",
  };
}
