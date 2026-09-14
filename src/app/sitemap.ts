import type { MetadataRoute } from "next";

/**
 * Sitemap — osnovna odprtost spletišča za iskalnike.
 * Muzej je enostranska aplikacija, zato je objavljen koren "/"
 * skupaj z odprtimi podatkovnimi končnimi točkami.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://muzej-griblje.example";
  return [
    {
      url: base + "/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
