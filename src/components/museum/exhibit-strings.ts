"use client";

import { useLang, pick } from "@/lib/i18n";
import type { ExhibitDTO, MuseumEventDTO, StoryDTO } from "@/lib/types";

/**
 * Pomočnik za jezikovno odbranje polj zapisov (titleSi/titleEn …).
 * Ena točka resnice za vsa imena polj v dvojezični zbirki.
 */
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
  };
}
