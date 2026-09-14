import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
