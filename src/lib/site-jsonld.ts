/**
 * Schema.org JSON-LD graditelji — skupne entitete muzeja.
 *
 * En izvor resnice za identitete, ki jih uporabljajo domača stran in
 * objektne strani /exponat/[slug] (vzorec vdelanega strukturiranega
 * podatka: Rijksmuseum, Tate, DigitaltMuseum). Stabilni @id-ji omogočajo
 * navzkrižno sklicevanje entitet z vseh strani muzeja.
 */

import { SITE_URL } from "@/lib/site";
import { seedExhibits } from "@/lib/museum-content";

const MUSEUM_ID = `${SITE_URL}/#museum`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const COLLECTION_ID = `${SITE_URL}/#zbirka`;

/** Muzej kot organizacija (isti podatki kot blok v /api/opendata). */
export function museumJsonLd() {
  return {
    "@type": "Museum",
    "@id": MUSEUM_ID,
    name: "Muzej vasi Griblje",
    alternateName: "Griblje Village Museum",
    description:
      "Digitalni muzej vasi Griblje v Beli krajini — zbirka, zgodbe, zemljevid in odprti podatki. / A digital village museum for Griblje, Slovenia.",
    url: SITE_URL + "/",
    identifier: "mvg-2026",
    areaServed: { "@type": "Village", name: "Griblje" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Griblje",
      addressRegion: "Bela krajina",
      addressCountry: "SI",
    },
    geo: { "@type": "GeoCoordinates", latitude: 45.57246, longitude: 15.29257 },
    sameAs: [
      "https://www.wikidata.org/wiki/Q2531566",
      "https://commons.wikimedia.org/wiki/Category:Griblje",
    ],
  };
}

/** Spletišče muzeja (za iskalnike: SearchAction izpustimo — iskanje je
 *  odjemalsko (Ctrl+K) in nima lastnega URL-ja). */
export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Muzej vasi Griblje",
    alternateName: "Griblje Village Museum",
    url: SITE_URL + "/",
    inLanguage: ["sl", "en"],
    publisher: { "@id": MUSEUM_ID },
  };
}

/** Zbirka: domača stran muzeja JE zbirka (enostranska aplikacija),
 *  zato tu stoji tudi ItemList vseh muzejskih zapisov — vsak predmet
 *  je iz strani spletišča strojno dosegljiv kot samostojen zapis.
 *  Primarni jezik zbirke je slovenščina (Text v schema.org). */
export function collectionJsonLd() {
  return {
    "@type": "CollectionPage",
    "@id": COLLECTION_ID,
    name: "Zbirka Muzeja vasi Griblje",
    alternateName: "The collection of the Griblje Village Museum",
    url: SITE_URL + "/",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": MUSEUM_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: seedExhibits.length,
      itemListElement: seedExhibits.map((ex, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/exponat/${ex.slug}`,
        name: ex.titleSi,
      })),
    },
  };
}

/** Celoten graf za domačo stran: muzej + spletišče + zbirka. */
export function siteGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [museumJsonLd(), websiteJsonLd(), collectionJsonLd()],
  };
}

export { MUSEUM_ID, WEBSITE_ID, COLLECTION_ID };
