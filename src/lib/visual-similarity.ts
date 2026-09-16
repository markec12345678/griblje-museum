import fingerprints from "@/lib/visual-fingerprints.json";
import type { ExhibitDTO } from "@/lib/types";

/**
 * Vizualna podobnost med zapisi — majhna muzejska različica vzorca
 * »Search visually« (Rijksmuseum).
 *
 * Rijksmuseum podobnost računa z ML modelom na milijonu slik; pri 69
 * zapisih ene vasi zadoščata dve razložljivi merili, ki ju lahko
 * brskalnik primerja v mikrosekundah:
 *   • zgradba slike — povprečni hash 8×8 (Hammingova razdalja),
 *   • barvitost — povprečne barve devetih polj slike.
 * Podobnost = 60 % zgradba + 40 % barve. Priporočilo je iskreno:
 * ne trdimo, da sta si sliki vsebinsko sorodni — le da sta si
 * vizualno blizu (npr. dve črno-beli dokumentarni fotografiji,
 * dve panoramski pokrajini ob reki).
 */

type Fingerprint = { a: string; c: number[]; w: number; h: number };
const FPS = fingerprints as Record<string, Fingerprint>;

/** Hammingova razdalja med dvema 64-bitnima zapisih. */
function hamming(a: string, b: string): number {
  let d = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) d++;
  }
  return d;
}

/** Podobnost zgradbe 0–1 (1 = isti vzorec svetlega in temnega). */
function structureSimilarity(a: Fingerprint, b: Fingerprint): number {
  return 1 - hamming(a.a, b.a) / 64;
}

/**
 * Podobnost barv 0–1 (1 = podobna povprečna barva na istih poljih).
 * Razdalja je normalizirana maksimalno možno evklidsko razdaljo
 * med dvema barvama (441,7 ≈ √(3·255²)).
 */
function colorSimilarity(a: Fingerprint, b: Fingerprint): number {
  let sq = 0;
  for (let i = 0; i < Math.min(a.c.length, b.c.length); i++) {
    sq += (a.c[i] - b.c[i]) ** 2;
  }
  const maxSq = 27 * (255 ** 2); // 27 komponent × maksimalna razlika
  return 1 - Math.sqrt(sq) / Math.sqrt(maxSq);
}

/** Skupna vizualna podobnost dveh prstnih odtisov (0–1). */
function overall(a: Fingerprint, b: Fingerprint): number {
  return 0.6 * structureSimilarity(a, b) + 0.4 * colorSimilarity(a, b);
}

export type VisualMatch = {
  exhibit: ExhibitDTO;
  /** Vizualna podobnost 0–1 (za prikaz razvrščanja, ne kot %. */
  score: number;
};

/** Najmanjša podobnost, da par sploh predlagamo. */
const MIN_SCORE = 0.62;

/**
 * Vizualno najbolj podobni zapisi danemu zapisu.
 * Vrne jih največ `count`, razvrščene po podobnosti.
 */
export function visuallySimilarExhibits(
  exhibit: ExhibitDTO,
  allExhibits: ExhibitDTO[],
  count = 3
): VisualMatch[] {
  const base = FPS[exhibit.slug];
  if (!base) return [];

  const scored: VisualMatch[] = [];
  for (const other of allExhibits) {
    if (other.slug === exhibit.slug) continue;
    const fp = FPS[other.slug];
    if (!fp) continue;
    const score = overall(base, fp);
    if (score >= MIN_SCORE) scored.push({ exhibit: other, score });
  }

  scored.sort((x, y) => y.score - x.score);
  return scored.slice(0, count);
}

/** Ali ima zapis izračunan vizualni prstni odtis. */
export function hasVisualFingerprint(slug: string): boolean {
  return slug in FPS;
}
