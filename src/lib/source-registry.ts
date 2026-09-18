/**
 * SOURCE REGISTRY — deterministična identiteta virov zbirke.
 * (34. sklop / TASK 37 — SOURCE AUTHORITY)
 *
 * Načelo: EN VIR — ENA IDENTITETA. Isti dokument (isti normaliziran URL)
 * ali bajtno-isti citat tiska (brez URL) dobi isti ključ — neodvisno od
 * zapisa, ki ga citira. Zbirka tako razume, da je npr. »Wikipedija: Griblje«
 * en vir, ki stoji za trinajstimi zapisi, in ne trinajst navidezno ločenih
 * virov. Registracija je IZPELJANA iz semena (museum-content.ts) ob nalaganju
 * modula: brez sprememb podatkov, brez nove baze, brez nove plasti v shemi.
 *
 * Pravili identitete (dokazano — razred A):
 *   A1  isto normaliziran URL → isti dokument → isti ključ.
 *       Normalizacija: mala črka gostitelja, brez začetnega www., brez
 *       končnih poševnic, URI-dekodirana pot (URI-dekodiranje poti) —
 *       protokol se ne šteje (http/https ista vsebina).
 *   A2  bajtno-isto imeSi brez URL → isti citat → isti ključ.
 *
 * SE NE združuje (čaka kuratorsko odločitev — deli worklista kustodiju):
 *   B  skoraj-isti vir: ista stvar, različna citatna ali URL oblika
 *      (npr. isti članek, zapisan z dvema datumskima oblikama);
 *   C  podobno ime, a različen dokument (npr. dve različni datoteki Commons);
 *   D  neidentificirljivi umbrella-citati (»literatura o …« brez konkretnega
 *      dela) — jih ni mogoče registrirati, dokler kustodos ne navede dela.
 *
 * Ključi so namenoma berljivi (url:… / ime:…) in deterministični — ne
 * zaporedne številke (VIR-###), ki bi se ob vsaki vstavitvi v seme
 * premaknile. Delovna lista za kustodija: scripts/audit-sources.ts.
 */

import { seedExhibits } from "./museum-content";

/** Normaliziran URL — identiteta spletnega dokumenta (pravilo A1). */
export function canonicalUrl(url: string): string {
  try {
    const u = new URL(url);
    let path = u.pathname;
    try {
      path = decodeURIComponent(path);
    } catch {
      /* pot z neveljavnimi zaporedji ostane izvirna */
    }
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    return `${host}${path.replace(/\/+$/, "")}${u.search}`;
  } catch {
    return url.trim();
  }
}

/**
 * Identiteta vira: normaliziran URL, kjer obstaja (A1); sicer bajtno-isto
 * ime citata (A2). Vrača stabilen, berljiv ključ (»url:…« / »ime:…«).
 */
export function sourceKeyOf(nameSi: string, url: string | null): string {
  if (url && url.trim()) {
    return `url:${canonicalUrl(url)}`;
  }
  return `ime:${nameSi}`;
}

/** Zapis zbirke, ki citira vir (za prikaz SOURCE → EXHIBITS). */
export type SourceExhibitRef = {
  museumNo: string;
  slug: string;
  titleSi: string;
  titleEn: string;
};

/** Registrirani vir: kdo ga citira in katere oblike ima v podatkih. */
export type SourceUsage = {
  key: string;
  url: string | null;
  /** Zapisi, ki citirajo ta vir — v vrstnem redu zbirke (MVG). */
  exhibits: SourceExhibitRef[];
  /** Vse imenske oblike, licence in tipi, zapisani na tem viru
   *  (≥2 pomeni konflikt, ki čaka kuratorsko odločitev). */
  namesSi: string[];
  licenses: string[];
  sourceTypes: string[];
};

function buildUsage(): Map<string, SourceUsage> {
  const map = new Map<string, SourceUsage>();
  for (const ex of seedExhibits) {
    for (const s of ex.sources) {
      const key = sourceKeyOf(s.nameSi, s.url ?? null);
      let u = map.get(key);
      if (!u) {
        u = {
          key,
          url: s.url ?? null,
          exhibits: [],
          namesSi: [],
          licenses: [],
          sourceTypes: [],
        };
        map.set(key, u);
      }
      if (!u.exhibits.some((e) => e.slug === ex.slug)) {
        u.exhibits.push({
          museumNo: ex.museumNo ?? "—",
          slug: ex.slug,
          titleSi: ex.titleSi,
          titleEn: ex.titleEn,
        });
      }
      if (!u.namesSi.includes(s.nameSi)) u.namesSi.push(s.nameSi);
      if (!u.licenses.includes(s.license)) u.licenses.push(s.license);
      if (!u.sourceTypes.includes(s.sourceType)) u.sourceTypes.push(s.sourceType);
    }
  }
  return map;
}

/** Registracija vseh virov zbirke — enkrat izpeljana ob nalaganju modula. */
export const SOURCE_USAGE: ReadonlyMap<string, SourceUsage> = buildUsage();

/**
 * Zapisi, ki citirajo ISTI vir kot podana vrstica vira — razen podanega
 * zapisa. Pogon prikaza »Naveden tudi v zapisih« na objektni strani
 * (SOURCE → EXHIBITS referenčna povezava, ne kuratorski graf).
 */
export function usedByOthers(
  exhibitSlug: string,
  nameSi: string,
  url: string | null,
): SourceExhibitRef[] {
  const u = SOURCE_USAGE.get(sourceKeyOf(nameSi, url));
  if (!u) return [];
  return u.exhibits.filter((e) => e.slug !== exhibitSlug);
}
