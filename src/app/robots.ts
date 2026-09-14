import type { MetadataRoute } from "next";

/**
 * Robots — celotno spletišče je javno, tudi odprti podatkovni API
 * (načelo odprtosti po vzoru DigitaltMuseum / Nasjonalmuseet).
 *
 * Domena: env NEXT_PUBLIC_SITE_URL (Vercel) z današnjo produkcijsko
 * domeno kot privzeto; ob nakupu prave domene jo nastavite v okolju.
 */
export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://griblje-museum-robertpezdirc12-designs-projects.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: base + "/sitemap.xml",
  };
}
