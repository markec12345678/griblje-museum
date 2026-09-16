import { FAMILY_WALK } from "@/lib/walks";
import type { ExhibitDTO } from "@/lib/types";

/**
 * Oznake občinstva za karte zapisov.
 *
 * Vzorec: MoMA na kartah dogodkov in vsebin izpričuje, komu in koliko
 * časa je kaj namenjeno (»Families«, »Talks«, trajanja). Digitalni
 * muzej enako pošteno pove dve stvari ob vsakem zapisu:
 *
 *  1. Približen čas branja zgodbe — izpeljan iz števila besed
 *     kanonske (slovenske) zgodbe pri 180 besedah na minuto,
 *     torej izmerjeno, ne obljubljeno.
 *  2. »Za otroke« — samo za postaje družinskega sprehoda
 *     (Mali raziskovalci), ker je to edini kurirani seznam
 *     otrokom prijaznih vsebin. Brez domnev.
 */

/** Postaje družinskega sprehoda — en vir resnice s kurirstvom otroške poti. */
const KIDS_SLUGS: ReadonlySet<string> = new Set(
  FAMILY_WALK.stops.map((stop) => stop.exhibitSlug)
);

/** Je zapis postaja družinskega sprehoda (Mali raziskovalci)? */
export function isForKids(slug: string): boolean {
  return KIDS_SLUGS.has(slug);
}

/**
 * Hitrost branja muzejskega besedila: 150 besed na minuto — počasneje
 * kot splošno prozo (gosto, informativno besedilo z imeni in datumi),
 * po merilih berljivosti za muzejske napise.
 */
const WORDS_PER_MINUTE = 150;

/** Približen čas branja zgodbe zapisa, v celih minutah (najmanj 1). */
export function readingMinutes(exhibit: ExhibitDTO): number {
  const words = (exhibit.storySi ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
