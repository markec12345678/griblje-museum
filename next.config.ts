import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Baza je Neon PostgreSQL (issue #27/A1) — povezava gre prek
  // DATABASE_URL (pooled) / DIRECT_URL (migracije); nobena datoteka baze
  // ni več del paketa strežniške funkcije.
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
