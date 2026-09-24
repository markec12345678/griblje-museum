import { MuseumApp } from "@/components/museum/museum-app";
import { siteGraphJsonLd } from "@/lib/site-jsonld";

/**
 * Domača stran — živi muzej.
 *
 * Aplikacija je odjemalska (enostranska), zato sem strežniško vdela
 * strukturirane podatke o muzeju, spletišču in zbirki: Muzej (organizacija),
 * WebSite in CollectionPage z ItemList vseh zapisov zbirke — vsak s trajnim
 * naslovom /exponat/[slug] (vzorec vdelanega JSON-LD: Rijksmuseum, Tate).
 * Aplikacije ne dotika; njena vsebina in navigacija ostajata nespremenjeni.
 */
export default function Home() {
  const jsonLd = siteGraphJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        // Zapora </script> v vsebini: < pobegnjen kot \u003c.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <MuseumApp />
    </>
  );
}
