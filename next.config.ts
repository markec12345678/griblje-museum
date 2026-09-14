import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // SQLite baza (db/custom.db) se odpre šele ob zagonu — sledenje uvozov
  // je ne vključi v paket strežniške funkcije, zato jo izrecno priložimo
  // vsem API potem (nabor datotek za Vercel / standalone).
  outputFileTracingIncludes: {
    "/api/exhibits": ["./db/custom.db"],
    "/api/events": ["./db/custom.db"],
    "/api/stories": ["./db/custom.db"],
    "/api/search": ["./db/custom.db"],
    "/api/opendata": ["./db/custom.db"],
    "/api/iiif": ["./db/custom.db"],
    "/api/audio-guide": ["./db/custom.db"],
  },
  // Tipovne napake se ne smejo tiho pretakati v produkcijo
  // (`bunx tsc --noEmit` je čist; ob novih napakah build odpove).
  typescript: {
    ignoreBuildErrors: false,
  },
  // Strogi način razkriva neželene učinke (dvojni klici učinkov) —
  // koda mu je pisana naklonjeno (čisti updaterji, varovanja runId).
  reactStrictMode: true,
};

export default nextConfig;
