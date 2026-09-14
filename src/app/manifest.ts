import type { MetadataRoute } from "next";

/**
 * Spletni manifest (PWA) — »muzej v žepu«.
 * Vzorec: multimedijski vodnik Van Goghovega muzeja in pametni vodnik
 * Metropolitana, ki delujeta brez povezave: namestitev na domači
 * zaslon, samostojen zagon in predpomnjena vsebina (glej public/sw.js).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muzej vasi Griblje — Griblje Village Museum",
    short_name: "Muzej Griblje",
    description:
      "Dvojezični digitalni muzej resnične vasi ob Kolpi — zbirka, sprehodi, avdio vodnik in odprti podatki. / A bilingual digital museum of a real village on the Kolpa.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f3e9",
    theme_color: "#185b37",
    lang: "sl",
    categories: ["education"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
