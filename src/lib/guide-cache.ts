/**
 * Predpomnilnik odgovorov vodnika — za PRAVA vprašanja pogovora.
 *
 * Zakaj: brezplačna veja OpenRouterja znese le ~50 zahtev na dan za celemu
 * muzej, obiskovalci pa si zastavljajo presenetljivo podobna vprašanja
 * (»Kje so Griblje?«, »Kdo je bil Županič?« …). Enak prvi vprašanji zato
 * ne gresta več h modelu: odgovor se anonimno predpomni in naslednji
 * obiskovalec dobí odgovor takoj — tudi na dan, ko je kvota že izčrpana.
 *
 * Kaj se shranjuje: SAMO prvo sporočilo pogovora (brez zgodovine, brez
 * naslova IP, brez imena) skupaj z odgovorom — v pomnilniku primerka
 * strežnika, največ 24 ur, največ 120 vnosov (odstareli najprej ven).
 * Nadaljevalna vprašanja večturnega pogovora se NE predpomnijo, ker so
 * odvisna od poteka pogovora.
 *
 * Zasebnostna opomba v vmesniku je temu primerno poštena.
 */

import type { GuideCite, GuideLang } from "@/lib/guide";

/** Starost vnosa, po kateri se čisti (24 h). */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
/** Največje število predpomnjenih vprašanj (odstareli najprej ven). */
const CACHE_MAX = 120;
/** Ključi daljši od tega se ne predpomnijo (vprašanje je tako že ogromno). */
const KEY_MAX_CHARS = 200;

type CacheEntry = { at: number; answer: string; cites: GuideCite[] };

/* Vstavljanje v Map ohranja vrstni red — najstarejši vnos je prvi. */
const store = new Map<string, CacheEntry>();

/**
 * Normalizacija vprašanja v ključ: male črke, brez diakritike (č→c),
 * ločila v presledke, presledki strnjeni. »Kdo je bil Niko Županič?« in
 * »kdo je bil niko zupanic« tako pomenita isti ključ.
 */
export function normalizeGuideQuestion(question: string): string {
  return question
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, KEY_MAX_CHARS);
}

/** Ključ predpomnilnika za prvo vprašanje; null, če vprašanja ne predpomnimo. */
export function guideCacheKey(
  lang: GuideLang,
  firstQuestion: string,
): string | null {
  const normalized = normalizeGuideQuestion(firstQuestion);
  // Prekratka vprašanja (»a?«, »kje« …) ne gredo v predpomnilnik —
  // premalo določene vsebine, da bi bil zabetoniran odgovor smiseln.
  if (normalized.length < 4) return null;
  return `${lang}:${normalized}`;
}

/** Iskanje po predpomnilniku (ob zadetku vnos ohrani mladost — LRU). */
export function guideCacheGet(key: string): CacheEntry | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    store.delete(key);
    return null;
  }
  // Obnovi mesto v vrsti (Map vrstni red vstavljanja = starost).
  store.delete(key);
  store.set(key, hit);
  return hit;
}

/** Shranjevanje odgovora; čez kapaciteto najprej odpade najstarejši vnos. */
export function guideCacheSet(
  key: string,
  answer: string,
  cites: GuideCite[],
): void {
  if (store.has(key)) store.delete(key);
  if (store.size >= CACHE_MAX) {
    const oldest = store.keys().next().value;
    if (oldest !== undefined) store.delete(oldest);
  }
  store.set(key, { at: Date.now(), answer, cites });
}

/** Število predpomnjenih vprašanj (operativni vpogled v glavi odgovora). */
export function guideCacheSize(): number {
  return store.size;
}
