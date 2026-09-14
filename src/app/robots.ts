import type { MetadataRoute } from "next";

/**
 * Robots — celotno spletišče je javno, tudi odprti podatkovni API
 * (načelo odprtosti po vzoru DigitaltMuseum / Nasjonalmuseet).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://muzej-griblje.example/sitemap.xml",
  };
}
