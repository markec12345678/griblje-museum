"use client";
import type { Lang } from "@/lib/i18n";

/**
 * Muzejska razglednica (vzorec: Useum e-Cards, SFMOMA Send Me,
 * MoMA Postcard). Brez poštne podrštnje ali računov — sporočilo živi v
 * deljni povezavi, natisniti pa se da kot prava zložena razglednica.
 */

export const POSTCARD_MESSAGE_MAX = 200;
export const POSTCARD_SENDER_MAX = 40;

export type GreetingId = "pozdrav" | "vseNajboljse" | "mislimNate" | "hvala" | "praznik";

export const POSTCARD_GREETINGS: {
  id: GreetingId;
  si: string;
  en: string;
}[] = [
  { id: "pozdrav", si: "Lep pozdrav iz Griblj", en: "Greetings from Griblje" },
  { id: "vseNajboljse", si: "Vse najboljše!", en: "All the best!" },
  { id: "mislimNate", si: "Mislim nate.", en: "Thinking of you." },
  { id: "hvala", si: "Hvala!", en: "Thank you!" },
  { id: "praznik", si: "Vesel praznik!", en: "Happy holidays!" },
];

export function getGreeting(id: string | null): {
  id: GreetingId;
  si: string;
  en: string;
} {
  return POSTCARD_GREETINGS.find((g) => g.id === id) ?? POSTCARD_GREETINGS[0];
}

export type PostcardData = {
  slug: string;
  greeting: GreetingId;
  message: string;
  sender: string;
};

/** Deljiva povezava ?postcard=<slug>&msg=…&od=…&pz=… */
export function postcardUrl(data: PostcardData): string {
  const params = new URLSearchParams();
  params.set("postcard", data.slug);
  if (data.message.trim()) params.set("msg", data.message.trim());
  if (data.sender.trim()) params.set("od", data.sender.trim());
  if (data.greeting !== "pozdrav") params.set("pz", data.greeting);
  return `${window.location.origin}/?${params.toString()}`;
}

/** Preberi podatke razglednice iz URL-parametrov (sprejemni pogled). */
export function parsePostcardParams(
  params: URLSearchParams
): PostcardData | null {
  const slug = params.get("postcard");
  if (!slug) return null;
  const message = (params.get("msg") ?? "").slice(0, POSTCARD_MESSAGE_MAX);
  const sender = (params.get("od") ?? "").slice(0, POSTCARD_SENDER_MAX);
  const greeting = getGreeting(params.get("pz")).id;
  return { slug, greeting, message, sender };
}

/** Kratek citat kraja in datuma za žig na hrbtni strani. */
export function postmarkDate(lang: Lang): string {
  const now = new Date();
  const locale = lang === "sl" ? "sl-SI" : lang === "hr" ? "hr-HR" : "en-GB";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
}
