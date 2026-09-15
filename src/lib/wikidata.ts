/**
 * Wikidata povezave zbirke — trajni identifikatorji zapisov.
 *
 * Vzorec: DigitaltMuseum (Norveška) vsak predmet povezuje s trajnim
 * identifikatorjem (UPI/freg), Rijksmuseum pa z objektnimi številkami —
 * odprti muzeji so na spletu povezljivi muzeji. Naša ploščad trajnosti
 * so Wikidatini QID-i: vsak zapis, ki ustreza preverjeni entiteti
 * Wikidatov, nosi svoj sameAs.
 *
 * Preslikke so ročno preverjene (Q2531566 = naselje Griblje,
 * Q18515927 = cerkev sv. Vida v Gribljah, Q211046 = reka Kolpa/Kupa).
 */

export const WIKIDATA_SAMEAS: Record<string, string> = {
  "griblje-vas": "Q2531566",
  "griblje-v-stevilkah": "Q2531566",
  "sveti-vid": "Q18515927",
  "kolpa-reka": "Q211046",
};

/** Celotni sameAs URL za zapis (null, če preslikka ne obstaja). */
export function wikidataUrlFor(slug: string): string | null {
  const qid = WIKIDATA_SAMEAS[slug];
  return qid ? `https://www.wikidata.org/wiki/${qid}` : null;
}
