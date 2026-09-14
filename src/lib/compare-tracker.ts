"use client";

import * as React from "react";

/**
 * Primerjalnik — začasna izbira do treh zapisov za primerjavo.
 * Vzorec: Comparator nove zbirke Rijksmuseuma (Collection Online 2024),
 * kjer obiskovalec predmeta postavi drug ob drugega in na eni strani
 * prebere razlike. Brez računa: izbira živi v localStorage (mvg-compare),
 * sinhronizirana med komponentami (CustomEvent) in zavihki (storage).
 */

const STORAGE_KEY = "mvg-compare";

/** Največje število zapisov v primerjalniku. */
export const COMPARE_LIMIT = 3;

/** Ime CustomEvent-a, ki se sproži ob spremembi izbire. */
export const COMPARE_CHANGED_EVENT = "museum:compare-changed";

function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string").slice(0, COMPARE_LIMIT);
  } catch {
    return [];
  }
}

function writeStored(selection: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection.slice(0, COMPARE_LIMIT)));
  } catch {
    // localStorage (npr. zasebni način) ni na voljo — spremembo vseeno objavimo
  }
}

function publish(): void {
  window.dispatchEvent(new CustomEvent(COMPARE_CHANGED_EVENT));
}

/** Vrne trenutno izbiro (urejen seznam slugov, največ tri). */
export function getCompareSelection(): string[] {
  return readStored();
}

/**
 * Doda zapis v izbiro. Če je zapis že izbran, se ne zgodi nič;
 * če je izbira polna, najstarejši zapis odpade (vrstni red po prihodu).
 * Vrne true, če se je izbira spremenila.
 */
export function addToCompare(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const selection = readStored();
  if (selection.includes(slug)) return false;
  const next = [...selection, slug];
  if (next.length > COMPARE_LIMIT) next.shift();
  writeStored(next);
  publish();
  return true;
}

/** Odstrani zapis iz izbire; vrne true, če se je spremenila. */
export function removeFromCompare(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const selection = readStored();
  const next = selection.filter((s) => s !== slug);
  if (next.length === selection.length) return false;
  writeStored(next);
  publish();
  return true;
}

/** Preklopi zapis v/iz izbire; vrne true, če je zapis zdaj izbran. */
export function toggleCompare(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const selection = readStored();
  if (selection.includes(slug)) {
    writeStored(selection.filter((s) => s !== slug));
    publish();
    return false;
  }
  const next = [...selection, slug];
  if (next.length > COMPARE_LIMIT) next.shift();
  writeStored(next);
  publish();
  return true;
}

/** Počisti izbiro. */
export function clearCompare(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nič hudega
  }
  publish();
}

/**
 * React hook: urejena izbira za primerjavo.
 * SSR-varen: prvi render prazna izbira, napolni se v useEffect.
 */
export function useCompareSelection(): {
  selection: string[];
  count: number;
  isSelected: (slug: string) => boolean;
  toggleCompare: (slug: string) => boolean;
  remove: (slug: string) => boolean;
  clear: () => void;
} {
  const [selection, setSelection] = React.useState<string[]>([]);

  React.useEffect(() => {
    setSelection(readStored());
    const onChange = () => setSelection(readStored());
    window.addEventListener(COMPARE_CHANGED_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(COMPARE_CHANGED_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return {
    selection,
    count: selection.length,
    isSelected: (slug: string) => selection.includes(slug),
    toggleCompare,
    remove: removeFromCompare,
    clear: clearCompare,
  };
}
