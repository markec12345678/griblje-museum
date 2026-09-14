/**
 * Javni naslov muzeja — eno samo mesto resnice za vse, kar gradi URL-e:
 * sitemap, robots, metapodatki, primeri odprtega API-ja.
 *
 * Env NEXT_PUBLIC_SITE_URL se nastavi na Vercelu ob nakupu prave domene
 * (npr. https://muzej-griblje.si); privzeto je današnja produkcijska domena.
 * Nikjer v kodi ne sme ostati placeholder domene (glej issue #2).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://griblje-museum-robertpezdirc12-designs-projects.vercel.app";
