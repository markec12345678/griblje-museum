"use client";

import * as React from "react";

/**
 * Moji detajli — izrezi slik, ki si jih obiskovalec izbral sam.
 *
 * Vzorec: Rijksmuseum Rijksstudio »Collect a detail« — obiskovalec
 * velikega muzeja lahko iz vsakega dela izreže svoj priljubljeni
 * detajl in ga obesi v lastno galerijo. Tudi ta muzej vasi omogoča
 * enako dejanje: detajl je izrez slike zapisa (x, y, širina, višina
 * v ulomkih slike), shranjen v brskalniku (mvg-details) — brez
 * računa, brez strežnika. Podatki se ne pošiljajo nikamor; skupna
 * raba je mogoča prek globokih povezav na zapis (detajl vedno
 * vsebuje povezavo nazaj na svoj vir).
 */

const STORAGE_KEY = "mvg-details";

/** Ime CustomEvent-a, ki se sproži ob spremembi zbirke detajlov. */
export const DETAILS_CHANGED_EVENT = "museum:details-changed";

export interface SavedDetail {
  /** Enolični ključ (`${slug}-${x}-${y}-${w}-${h}`, zaokroženo). */
  id: string;
  /** Slug zapisa, iz katerega je detajl izrezan. */
  slug: string;
  /** Levi zgornji kot izreza — ulomek širine slike (0–1). */
  x: number;
  /** Levi zgornji kot izreza — ulomek višine slike (0–1). */
  y: number;
  /** Širina izreza — ulomek širine slike (0–1). */
  w: number;
  /** Višina izreza — ulomek višine slike (0–1). */
  h: number;
  /** ISO datum shranitve. */
  createdAt: string;
}

function isValidDetail(v: unknown): v is SavedDetail {
  if (typeof v !== "object" || v === null) return false;
  const d = v as Record<string, unknown>;
  return (
    typeof d.id === "string" &&
    typeof d.slug === "string" &&
    typeof d.x === "number" &&
    typeof d.y === "number" &&
    typeof d.w === "number" &&
    typeof d.h === "number" &&
    d.x >= 0 && d.y >= 0 && d.w > 0 && d.h > 0 &&
    d.x + d.w <= 1.0001 && d.y + d.h <= 1.0001 &&
    typeof d.createdAt === "string"
  );
}

function readStored(): SavedDetail[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidDetail);
  } catch {
    return [];
  }
}

function writeStored(details: SavedDetail[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
  } catch {
    // localStorage (npr. zasebni način) ni na voljo — spremembo vseeno objavimo
  }
}

/** Vrne vse shranjene detajle (najnovejši najprej). */
export function getDetails(): SavedDetail[] {
  return readStored();
}

/** Zgradi enolični ključ detajla iz koordinat. */
export function detailId(slug: string, x: number, y: number, w: number, h: number): string {
  const f = (n: number) => Math.round(n * 1000).toString(36);
  return `${slug}-${f(x)}-${f(y)}-${f(w)}-${f(h)}`;
}

/** Doda detajl v zbirko; vrne true, če je bila spremenjena. */
export function addDetail(detail: Omit<SavedDetail, "id" | "createdAt"> & { id?: string }): boolean {
  if (typeof window === "undefined") return false;
  const details = readStored();
  const id = detail.id ?? detailId(detail.slug, detail.x, detail.y, detail.w, detail.h);
  if (details.some((d) => d.id === id)) return false;
  details.unshift({ ...detail, id, createdAt: new Date().toISOString() });
  writeStored(details);
  window.dispatchEvent(new CustomEvent(DETAILS_CHANGED_EVENT, { detail: id }));
  return true;
}

/** Odstrani detajl iz zbirke; vrne true, če je bila spremenjena. */
export function removeDetail(id: string): boolean {
  if (typeof window === "undefined") return false;
  const details = readStored();
  const next = details.filter((d) => d.id !== id);
  if (next.length === details.length) return false;
  writeStored(next);
  window.dispatchEvent(new CustomEvent(DETAILS_CHANGED_EVENT, { detail: id }));
  return true;
}

/**
 * React hook: vsi shranjeni detajli.
 * SSR-varen: prvi render prazen seznam, napolni se v useEffect.
 */
export function useDetails(): {
  details: SavedDetail[];
  detailsCount: number;
  removeDetail: (id: string) => void;
} {
  const [details, setDetails] = React.useState<SavedDetail[]>([]);

  React.useEffect(() => {
    setDetails(readStored());
    const onChange = () => setDetails(readStored());
    window.addEventListener(DETAILS_CHANGED_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(DETAILS_CHANGED_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return {
    details,
    detailsCount: details.length,
    removeDetail,
  };
}

/**
 * CSS za prikaz izreza detajla kot »okno v sliko«: klasična tehnika
 * background-size/background-position, ki iz celotne slike pokaže
 * samo izbrani pravokotnik brez rezanja robov (znotraj ovoja z
 * razmerjem izreza). Vrne style za ovoj (aspectRatio) in za ploščo
 * (backgroundSize/backgroundPosition).
 */
export function detailCropStyle(detail: Pick<SavedDetail, "x" | "y" | "w" | "h">, naturalWidth: number, naturalHeight: number): {
  frameStyle: React.CSSProperties;
  paneStyle: React.CSSProperties;
} {
  const { x, y, w, h } = detail;
  const safeW = Math.min(Math.max(w, 0.02), 1);
  const safeH = Math.min(Math.max(h, 0.02), 1);
  const safeX = Math.min(Math.max(x, 0), 1 - safeW);
  const safeY = Math.min(Math.max(y, 0), 1 - safeH);
  return {
    frameStyle: {
      aspectRatio: `${(safeW * naturalWidth) / (safeH * naturalHeight)}`,
    },
    paneStyle: {
      backgroundSize: `${100 / safeW}% ${100 / safeH}%`,
      backgroundPositionX: safeW >= 1 ? "left" : `${(safeX / (1 - safeW)) * 100}%`,
      backgroundPositionY: safeH >= 1 ? "top" : `${(safeY / (1 - safeH)) * 100}%`,
    },
  };
}
