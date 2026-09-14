"use client";

/**
 * Sestavi sliko — muzejska sestavljanka iz slike zapisa (vzorec: ZMA
 * Puzzler, Rijksmuseumjeve sestavljanke). Mehanika je izmenjava dveh
 * ploščic s klikom/dotikom (dosegljivo tudi s tipkovnico); razvrstitev
 * je vedno rešljiva, saj so dovoljene samo izmenjave.
 */

import type { ExhibitDTO } from "@/lib/types";

export type PuzzleSize = 3 | 4 | 5;

export const PUZZLE_SIZES: { size: PuzzleSize; labelSi: string; labelEn: string }[] = [
  { size: 3, labelSi: "3 × 3 · lahko", labelEn: "3 × 3 · easy" },
  { size: 4, labelSi: "4 × 4 · srednje", labelEn: "4 × 4 · medium" },
  { size: 5, labelSi: "5 × 5 · zahtevno", labelEn: "5 × 5 · hard" },
];

/** Zgoščevalnik za ponovljivo mešanje glede na zapis in velikost. */
function hashString(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Zamešani ploščici — Fisher–Yates podvigov nad zaporedjem 0..n²−1.
 * Zagotovimo, da začetni položaj ni rešen in da vsaj dve tretjini
 * ploščic nista na svojem mestu.
 */
export function shuffledTiles(
  size: PuzzleSize,
  seed: string
): number[] {
  const total = size * size;
  const tiles = Array.from({ length: total }, (_, i) => i);
  const rng = mulberry32(hashString(`${seed}:${size}`));
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  const inPlace = tiles.filter((tile, i) => tile === i).length;
  if (inPlace > Math.floor(total / 3)) {
    // Preveč ploščic je že pravih — zamenjamo prvo in zadnjo.
    [tiles[0], tiles[total - 1]] = [tiles[total - 1], tiles[0]];
  }
  if (tiles.every((tile, i) => tile === i) && total > 1) {
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  }
  return tiles;
}

/** Sveža slika za novo igro istega zapisa (vsaka igra je drugačna). */
export function freshSeed(slug: string): string {
  return `${slug}:${Date.now()}:${Math.floor(Math.random() * 1e6)}`;
}

export function isSolved(tiles: number[]): boolean {
  return tiles.every((tile, i) => tile === i);
}

export function puzzleKey(slug: string, size: PuzzleSize): string {
  return `${slug}:${size}`;
}

// --- Najboljši časi (lokalno, brez računa) -----------------------------

const BEST_KEY = "mvg-puzzle-best";

type BestTimes = Record<string, { seconds: number; moves: number }>;

function readBest(): BestTimes {
  try {
    const raw = window.localStorage.getItem(BEST_KEY);
    return raw ? (JSON.parse(raw) as BestTimes) : {};
  } catch {
    return {};
  }
}

export function getBestTime(
  slug: string,
  size: PuzzleSize
): { seconds: number; moves: number } | null {
  const entry = readBest()[puzzleKey(slug, size)];
  return entry && typeof entry.seconds === "number" ? entry : null;
}

export function saveBestTime(
  slug: string,
  size: PuzzleSize,
  seconds: number,
  moves: number
): boolean {
  try {
    const best = readBest();
    const key = puzzleKey(slug, size);
    const prev = best[key];
    if (!prev || seconds < prev.seconds) {
      best[key] = { seconds, moves };
      window.localStorage.setItem(BEST_KEY, JSON.stringify(best));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function countSolvedPuzzles(): number {
  return Object.keys(readBest()).length;
}

/** Deljiva globoka povezava ?puzzle=<slug>. */
export function puzzleShareUrl(slug: string, size: PuzzleSize): string {
  return `${window.location.origin}/?puzzle=${slug}&kocke=${size}`;
}

/** Razmerje stranic slike zapisa (nalaga se ob zagonu sestavljanke). */
export function loadImageAspect(
  exhibit: ExhibitDTO
): Promise<number | null> {
  const src = exhibit.image ?? "/images/authentic/hero-griblje.jpg";
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve(img.naturalWidth / img.naturalHeight);
      } else {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
