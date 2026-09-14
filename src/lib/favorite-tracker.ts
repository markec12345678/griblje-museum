"use client";

import * as React from "react";

/**
 * Moja zbirka — osebna zbirka shranjenih zapisov obiskovalca.
 * Vzorec: Rijksmuseum Rijksstudio, Louvre »Mes favoris« in
 * Nasjonalmuseet »My Collection« — brez računa, stanje živi v
 * localStorage (mvg-favorites) in se sinhronizira med komponentami
 * prek dogodka "museum:favorites-changed" ter med zavihki prek
 * dogodka "storage".
 */

const STORAGE_KEY = "mvg-favorites";

/** Ime CustomEvent-a, ki se sproži ob spremembi zbirke. */
export const FAVORITES_CHANGED_EVENT = "museum:favorites-changed";

function readStored(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((s): s is string => typeof s === "string"));
  } catch {
    return new Set();
  }
}

function writeStored(favorites: Set<string>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  } catch {
    // localStorage (npr. zasebni način) ni na voljo — spremembo vseeno objavimo
  }
}

/** Vrne množico slugov zapisov v osebni zbirki. */
export function getFavorites(): Set<string> {
  return readStored();
}

/** Doda zapis v osebno zbirko; vrne true, če je bila spremenjena. */
export function addFavorite(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const favorites = readStored();
  if (favorites.has(slug)) return false;
  favorites.add(slug);
  writeStored(favorites);
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: slug }));
  return true;
}

/** Odstrani zapis iz osebne zbirke; vrne true, če je bila spremenjena. */
export function removeFavorite(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const favorites = readStored();
  if (!favorites.delete(slug)) return false;
  writeStored(favorites);
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: slug }));
  return true;
}

/** Preklopi zapis v/iz osebne zbirke; vrne true, če je zapis zdaj shranjen. */
export function toggleFavorite(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const favorites = readStored();
  if (favorites.has(slug)) {
    favorites.delete(slug);
    writeStored(favorites);
    window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: slug }));
    return false;
  }
  favorites.add(slug);
  writeStored(favorites);
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: slug }));
  return true;
}

/** Počisti osebno zbirko. */
export function clearFavorites(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nič hudega
  }
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
}

/**
 * React hook: množica shranjenih zapisov (slugov).
 * SSR-varen: prvi render prazna množica, napolni se v useEffect —
 * brez hidratacijskih razlik.
 */
export function useFavorites(): {
  favorites: Set<string>;
  favoritesCount: number;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => boolean;
  clearFavorites: () => void;
} {
  const [favorites, setFavorites] = React.useState<Set<string>>(() => new Set<string>());

  React.useEffect(() => {
    setFavorites(readStored());
    const onChange = () => setFavorites(readStored());
    window.addEventListener(FAVORITES_CHANGED_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return {
    favorites,
    favoritesCount: favorites.size,
    isFavorite: (slug: string) => favorites.has(slug),
    toggleFavorite,
    clearFavorites,
  };
}
