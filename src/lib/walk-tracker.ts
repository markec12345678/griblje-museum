"use client";

import * as React from "react";

/**
 * Zaključeni muzejski sprehodi — lokalno stanje obiskovalca.
 * Vzorec iz visit-trackerja: localStorage (mvg-walks) +
 * dogavad "museum:walks-changed" za sinhronizacijo komponent.
 */

const STORAGE_KEY = "mvg-walks";

export const WALKS_CHANGED_EVENT = "museum:walks-changed";

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

/** Vrne množico identifikatorjev zaključenih sprehodov. */
export function getCompletedWalks(): Set<string> {
  return readStored();
}

/** Zabeleži zaključek sprehoda in persistira v localStorage. */
export function markWalkCompleted(walkId: string): void {
  if (typeof window === "undefined") return;
  if (typeof walkId !== "string" || !walkId) return;
  const completed = readStored();
  if (completed.has(walkId)) return;
  completed.add(walkId);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)));
  } catch {
    // localStorage (npr. zasebni način) ni na voljo — spremembo vseeno objavimo
  }
  window.dispatchEvent(new CustomEvent(WALKS_CHANGED_EVENT, { detail: walkId }));
}

/**
 * React hook: množica zaključenih sprehodov.
 * SSR-varen: prvi render prazna množica, napolni se v useEffect.
 */
export function useCompletedWalks(): Set<string> {
  const [completed, setCompleted] = React.useState<Set<string>>(
    () => new Set<string>()
  );

  React.useEffect(() => {
    setCompleted(readStored());
    const onChange = () => setCompleted(readStored());
    window.addEventListener(WALKS_CHANGED_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(WALKS_CHANGED_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return completed;
}
