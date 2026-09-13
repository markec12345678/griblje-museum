"use client";

import { useQuery } from "@tanstack/react-query";
import type { ExhibitDTO, MuseumEventDTO, StoryDTO } from "@/lib/types";

/**
 * Strežniško stanje muzeja — TanStack Query prek javnih API vmesnikov.
 * (Enak vzorec kot pri pravih muzejskih API-jih: cache + retry.)
 */

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.json() as Promise<T>;
}

export function useExhibits() {
  return useQuery<ExhibitDTO[]>({
    queryKey: ["museum", "exhibits"],
    queryFn: async () => {
      const data = await fetchJson<{ exhibits: ExhibitDTO[] }>("/api/exhibits");
      return data.exhibits;
    },
  });
}

export function useEvents() {
  return useQuery<MuseumEventDTO[]>({
    queryKey: ["museum", "events"],
    queryFn: async () => {
      const data = await fetchJson<{ events: MuseumEventDTO[] }>("/api/events");
      return data.events;
    },
  });
}

export function useStories() {
  return useQuery<StoryDTO[]>({
    queryKey: ["museum", "stories"],
    queryFn: async () => {
      const data = await fetchJson<{ stories: StoryDTO[] }>("/api/stories");
      return data.stories;
    },
  });
}
