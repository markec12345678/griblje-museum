"use client";

import { useLang, pick, type Lang } from "@/lib/i18n";
import type { ExhibitDTO, MuseumEventDTO, StoryDTO } from "@/lib/types";

/**
 * Pomočnik za jezikovno odbranje polj zapisov (titleSi/titleEn …).
 * Ena točka resnice za vsa imena polj v dvojezični zbirki.
 */

/** Naslov entitete za PRIKAZ (person/place/event/time): EN registr nosi
 *  prozni člen (»the Kolpa«) za vstavljanje v stavke — kot naslov ga
 *  odstranimo in veliko začnemo (»Kolpa«). Registr se NE spremeni. */
export function entityTitle(
  lang: Lang,
  e: { labelSi: string; labelEn: string }
): string {
  const label = pick(lang, e.labelSi, e.labelEn);
  if (lang === "en") {
    const m = label.match(/^the (.+)$/);
    if (m) return m[1].charAt(0).toUpperCase() + m[1].slice(1);
  }
  return label;
}

export function useExhibitStrings() {
  const { lang } = useLang();
  return {
    title: (ex: ExhibitDTO) => pick(lang, ex.titleSi, ex.titleEn),
    period: (ex: ExhibitDTO) => pick(lang, ex.periodSi, ex.periodEn),
    summary: (ex: ExhibitDTO) => pick(lang, ex.summarySi, ex.summaryEn),
    story: (ex: ExhibitDTO) => pick(lang, ex.storySi, ex.storyEn),
    sourceName: (s: { nameSi: string; nameEn: string }) => pick(lang, s.nameSi, s.nameEn),
    sourceNote: (s: { noteSi: string | null; noteEn: string | null }) =>
      pick(lang, s.noteSi, s.noteEn),
    eventTitle: (ev: MuseumEventDTO) => pick(lang, ev.titleSi, ev.titleEn),
    eventDesc: (ev: MuseumEventDTO) => pick(lang, ev.descriptionSi, ev.descriptionEn),
    eventLocation: (ev: MuseumEventDTO) => pick(lang, ev.locationSi, ev.locationEn),
    storyTitle: (st: StoryDTO) => pick(lang, st.titleSi, st.titleEn),
    storyText: (st: StoryDTO) => pick(lang, st.textSi, st.textEn),
    storyAttribution: (st: StoryDTO) => pick(lang, st.attributionSi, st.attributionEn),
    /** Oznaka entitete (person/place/event/time) — isti dvojezični vzorec. */
    entityLabel: (e: { labelSi: string; labelEn: string }) => entityTitle(lang, e),
    /** Mehki čas entitete, kot je zapisan (praznjen niz, če ni). */
    entityTime: (t?: { labelSi: string; labelEn: string }) =>
      t ? pick(lang, t.labelSi, t.labelEn) : "",
  };
}
