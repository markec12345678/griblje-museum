import type { MetadataRoute } from "next";

/**
 * Sitemap — osnovna odprtost spletišča za iskalnike.
 * Muzej je enostranska aplikacija, zato je objavljen koren "/"
 * skupaj z odprtimi podatkovnimi končnimi točkami.
 *
 * Domena: env NEXT_PUBLIC_SITE_URL (Vercel) z dnanesnjo produkcijsko
 * domeno kot privzetom; ob nakupu prave domene jo nastavite v okolju.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://griblje-museum-robertpezdirc12-designs-projects.vercel.app";
  return [
    {
      url: base + "/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
