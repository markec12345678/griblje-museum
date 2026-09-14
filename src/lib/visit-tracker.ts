"use client";

import * as React from "react";

/**
 * Zbiralec zapisov — sledenje odkritih zapisov obiskovalca.
 * Stanje se shrani v localStorage (mvg-visited) in se sinhronizira
 * med komponentami prek dogodka "museum:visited-changed".
 */

const STORAGE_KEY = "mvg-visited";

/** Ime CustomEvent-a, ki se sproži ob spremembi obiska. */
export const VISITED_CHANGED_EVENT = "museum:visited-changed";

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

/** Vrne množico slugov zapisov, ki jih je obiskovalec odprl. */
export function getVisited(): Set<string> {
  return readStored();
}

/** Zabeleži obisk zapisa (slug) in persistira v localStorage. */
export function markVisited(slug: string): void {
  if (typeof window === "undefined") return;
  const visited = readStored();
  if (visited.has(slug)) return;
  visited.add(slug);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(visited)));
  } catch {
    // localStorage (npr. zasebni način) ni na voljo — spremembo vseeno objavimo
  }
  window.dispatchEvent(new CustomEvent(VISITED_CHANGED_EVENT, { detail: slug }));
}

/** Počisti zapis obiska (začni znova). */
export function clearVisited(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // enako kot zgoraj — nič hudega
  }
  window.dispatchEvent(new CustomEvent(VISITED_CHANGED_EVENT));
}

/**
 * React hook: množica odkritih zapisov, števec in možnost počiščenja.
 * SSR-varen: prvi render (strežnik + hidracija) prazna množica,
 * napolni se v useEffect — brez hidratacijskih razlik.
 */
export function useVisited(): {
  visited: Set<string>;
  visitedCount: number;
  clearVisited: () => void;
} {
  const [visited, setVisited] = React.useState<Set<string>>(() => new Set<string>());

  React.useEffect(() => {
    setVisited(readStored());
    const onChange = () => setVisited(readStored());
    window.addEventListener(VISITED_CHANGED_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(VISITED_CHANGED_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return { visited, visitedCount: visited.size, clearVisited };
}
