"use client";

import type { Lang } from "@/lib/i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ContributionResult,
  ExhibitDTO,
  GuestbookDTO,
  MuseumEventDTO,
  ObjectMemoriesDTO,
  StoryDTO,
} from "@/lib/types";

/**
 * Strežniško stanje muzeja — TanStack Query prek javnih API vmesnikov.
 * (Enak vzorec kot pri pravih muzejskih API-jih: cache + retry.)
 */

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    ...init,
  });
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

// --- Sodelovanje skupnosti ----------------------------------------------

/** Objavljeni vpisi spominske knjige + števca. */
export function useGuestbook() {
  return useQuery<GuestbookDTO>({
    queryKey: ["museum", "guestbook"],
    queryFn: () =>
      fetchJson<GuestbookDTO>("/api/guestbook", { cache: "no-store" }),
  });
}

/** Objavljeni spomini skupnosti ob enem predmetu. */
export function useObjectMemories(exhibitSlug: string | null) {
  return useQuery<ObjectMemoriesDTO>({
    queryKey: ["museum", "memories", exhibitSlug],
    queryFn: () =>
      fetchJson<ObjectMemoriesDTO>(
        `/api/memories?exhibit=${encodeURIComponent(exhibitSlug ?? "")}`,
        { cache: "no-store" }
      ),
    enabled: exhibitSlug !== null,
  });
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => null)) as
    | (T & { error?: string })
    | null;
  if (!response.ok || !data) {
    throw new Error(data?.error ?? `${url}: ${response.status}`);
  }
  return data;
}

export type GuestbookForm = {
  name: string;
  place?: string;
  message: string;
  lang: Lang;
  website?: string;
};

/** Vpis v spominsko knjigo — po uspehu osveži seznam. */
export function useGuestbookSubmit() {
  const queryClient = useQueryClient();
  return useMutation<ContributionResult, Error, GuestbookForm>({
    mutationFn: (form) => postJson<ContributionResult>("/api/guestbook", form),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["museum", "guestbook"] });
    },
  });
}

export type MemoryForm = {
  exhibitSlug: string;
  author: string;
  place?: string;
  memory: string;
  lang: Lang;
  website?: string;
};

/** Spomin ob predmetu — po uspehu osveži seznam za ta predmet. */
export function useMemorySubmit(exhibitSlug: string) {
  const queryClient = useQueryClient();
  return useMutation<ContributionResult, Error, MemoryForm>({
    mutationFn: (form) => postJson<ContributionResult>("/api/memories", form),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["museum", "memories", exhibitSlug],
      });
    },
  });
}
