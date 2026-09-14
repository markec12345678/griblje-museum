import { z } from "zod";
import { CONTRIBUTION_LIMITS } from "./contribution-limits";

export const LIMITS = CONTRIBUTION_LIMITS;

/**
 * Skupna infrastruktura za prispevke obiskovalcev
 * (spominska knjiga + spomini ob predmetu).
 *
 * Vzorec: DigitaltMuseum (Norveška/Švedska) omogoča skupnosti pripombe in
 * spomine ob predmetih; Tenement Museum "Your Story, Our Story" zbira
 * družinske zgodbe obiskovalcev. Za vaški muzej brez računov in moderatorjev
 * v službi 24/7 uporabljamo pošteno samodejno moderacijo:
 *
 *  1. Honeypot — skrito polje `website`; če ga robot izpolni, prispevek
 *     tiho zavržemo (odgovor je videti uspešen).
 *  2. Čisto besedilo — striptamo kontrolne znake, skrčimo presledke;
 *     vrnjenega besedila nikoli ne prevajamo v HTML (React samo-escape).
 *  3. Hevristika — povezave, e-pošta ali oglati oklepaji prestavijo
 *     prispevek v status `held` (objavi ga kustos po pregledu).
 *  4. Omejitev hitrosti — drseče okno v pomnilniku (na primeru strežnika;
 *     na strežniški platformi velja na primerek, kar je za demo dovolj).
 *
 * Za trajno objavo pregledanih prispevkov jih kustos prenese v
 * `prisma/seed.ts` (vzorec "git kot CMS") — tako vsebina preživi namestitev.
 */

// --- Omejitve besedila -------------------------------------------------

// (LIMITS so v samostojnem modulu contribution-limits.ts, da jih lahko
// uvozi tudi odjemalec brez zodja.)

// --- Hišna čiščenja ----------------------------------------------------

/** Stripta kontrolne znake, skrči presledke, obreže. */
export function cleanText(input: string, maxLength: number): string {
  return input
    // kontrolni znaki razen običajnega preloma
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    // skrči vse presledke (razen prelomov vrstic) na enega
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

/** Vsebuje znake, ki zahtevajo kurotorski pregled (povezave, e-pošta, oznake)? */
export function looksSuspicious(text: string): boolean {
  return (
    /https?:\/\//i.test(text) ||
    /\bwww\./i.test(text) ||
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text) ||
    /<\/?[a-z][^>\n]*>/i.test(text) ||
    /\[[a-z]+\]/i.test(text)
  );
}

// --- Omejitev hitrosti (drseče okno) ------------------------------------

type Bucket = { hits: number[] };

const RATE_BUCKETS = new Map<string, Bucket>();
/** 5 prispevkov na 10 minut na IP (na primerek strežnika). */
const RATE_LIMIT = { count: 5, windowMs: 10 * 60 * 1000 } as const;

export function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = RATE_BUCKETS.get(ip) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < RATE_LIMIT.windowMs);
  if (bucket.hits.length >= RATE_LIMIT.count) {
    RATE_BUCKETS.set(ip, bucket);
    return true;
  }
  bucket.hits.push(now);
  RATE_BUCKETS.set(ip, bucket);
  return false;
}

/** IP iz glav zahteve (x-forwarded-for na proxy-ju, sicer "local"). */
export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "local";
}

// --- Sheme (zod) --------------------------------------------------------

const nameSchema = z.string().min(2).max(LIMITS.name);
const placeSchema = z
  .string()
  .max(LIMITS.place)
  .optional()
  .transform((v) => (v && v.trim() ? cleanText(v, LIMITS.place) : null));
const langSchema = z.enum(["sl", "en"]).default("sl");
/** Honeypot — neprazna vrednost pomeni robota; shema sprejme vse, odloči pot. */
const honeypotSchema = z.string().optional().default("");

export const guestbookSchema = z.object({
  name: nameSchema,
  place: placeSchema,
  message: z.string().min(10).max(LIMITS.message),
  lang: langSchema,
  website: honeypotSchema,
});

export const memorySchema = z.object({
  exhibitSlug: z.string().min(1).max(120),
  author: nameSchema,
  place: placeSchema,
  memory: z.string().min(20).max(LIMITS.memory),
  lang: langSchema,
  website: honeypotSchema,
});

export type GuestbookInput = z.infer<typeof guestbookSchema>;
export type MemoryInput = z.infer<typeof memorySchema>;
