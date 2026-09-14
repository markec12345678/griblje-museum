"use client";

import * as React from "react";

/**
 * Moj sprehod — osebna, urejena pot obiskovalca skozi zbirko.
 * Vzorec: obiskovalne poti Louvra (visitor trails) in »Collections«
 * Rijksmuseuma, kjer si obiskovalec sestavi lastno pot po predmetih.
 * Brez računa: postaje živijo v localStorage (mvg-my-walk), urejene po
 * vrstnem redu, ki ga določi uporabnik; sinhronizacija prek CustomEvent
 * in dogodka storage (enak vzorec kot mvg-favorites).
 */

const STORAGE_KEY = "mvg-my-walk";

/** Identifikator osebnega sprehoda (enak id-ju v walks.ts). */
export const MY_WALK_ID = "moj-sprehod";

/** Ime CustomEvent-a, ki se sproži ob spremembi poti. */
export const MY_WALK_CHANGED_EVENT = "museum:my-walk-changed";

function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string");
  } catch {
    return [];
  }
}

function writeStored(slugs: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // localStorage ni na voljo — spremembo vseeno objavimo
  }
}

function publish(): void {
  window.dispatchEvent(new CustomEvent(MY_WALK_CHANGED_EVENT));
}

/** Vrne urejen seznam slugov postaj osebnega sprehoda. */
export function getMyWalkSlugs(): string[] {
  return readStored();
}

/** Doda zapis na konec poti (če že stoji na njej, se ne zgodi nič). */
export function addToMyWalk(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const slugs = readStored();
  if (slugs.includes(slug)) return false;
  writeStored([...slugs, slug]);
  publish();
  return true;
}

/** Odstrani postajo s poti. */
export function removeFromMyWalk(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const slugs = readStored();
  const next = slugs.filter((s) => s !== slug);
  if (next.length === slugs.length) return false;
  writeStored(next);
  publish();
  return true;
}

/** Premakne postajo za mesto višje (dir = -1) ali nižje (dir = +1). */
export function moveMyWalkStop(slug: string, dir: -1 | 1): boolean {
  if (typeof window === "undefined") return false;
  const slugs = readStored();
  const index = slugs.indexOf(slug);
  const target = index + dir;
  if (index < 0 || target < 0 || target >= slugs.length) return false;
  const next = [...slugs];
  [next[index], next[target]] = [next[target], next[index]];
  writeStored(next);
  publish();
  return true;
}

/** Počisti osebni sprehod. */
export function clearMyWalk(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nič hudega
  }
  publish();
}

/**
 * React hook: urejena pot skozi zbirko.
 * SSR-varen: prvi render prazna pot, napolni se v useEffect.
 */
export function useMyWalk(): {
  slugs: string[];
  count: number;
  isOnWalk: (slug: string) => boolean;
  add: (slug: string) => boolean;
  remove: (slug: string) => boolean;
  move: (slug: string, dir: -1 | 1) => boolean;
  clear: () => void;
} {
  const [slugs, setSlugs] = React.useState<string[]>([]);

  React.useEffect(() => {
    setSlugs(readStored());
    const onChange = () => setSlugs(readStored());
    window.addEventListener(MY_WALK_CHANGED_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(MY_WALK_CHANGED_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return {
    slugs,
    count: slugs.length,
    isOnWalk: (slug: string) => slugs.includes(slug),
    add: addToMyWalk,
    remove: removeFromMyWalk,
    move: moveMyWalkStop,
    clear: clearMyWalk,
  };
}
