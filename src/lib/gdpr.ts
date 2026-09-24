/**
 * GDPR / življenjski cikel uporabniških podatkov (issue #27/H).
 *
 * Zbiramo SAMO: ime/vzdevek, (opcijsko) kraj, besedilo prispevka, jezik,
 * čas vpisa. Ne zbiramo: e-pošte, IP-jev (samo v pomnilniku za omejitev
 * hitrosti — nikoli v bazi), piškotkov, identifikatorjev naprav.
 *
 * Politika retencije (izvršena s scripts/gdpr-retention.ts):
 *   - rejected (zavrnjeni prispevki): 30 dni, nato FIZIČNI izbris;
 *   - deleted (mehko izbrisani): 30 dni, nato FIZIČNI izbris;
 *   - hidden (skriti): 365 dni do pregleda moderatorja (poročanje,
 *     ne samodejni izbris);
 *   - pending: brez roka (obseg majhen, čaka na kurotorski pregled).
 *
 * Anonimizacija (pravica do izbrisa, člen 17): ime → »Izbrisan
 * uporabnik«, kraj → null. Besedilo prispevka ostane (javno dobro —
 * muzejski vir), če uporabnik ne zahteva popolnega izbrisa.
 */

export const RETENTION = {
  /** Zavrnjeni prispevki: fizicni izbris po 30 dneh. */
  rejectedDays: 30,
  /** Mehko izbrisani: fizicni izbris po 30 dneh. */
  softDeletedDays: 30,
  /** Skriti: pregled moderatorja po 365 dneh. */
  hiddenReviewDays: 365,
} as const;

export const ANONYMOUS_NAME = "Izbrisan uporabnik";

export type RetentionCutoffs = {
  /** Starejši od tega datuma zavrnjeni → fizicni izbris. */
  rejectedBefore: Date;
  /** Starejši od tega datuma mehko izbrisani → fizicni izbris. */
  deletedBefore: Date;
  /** Starejši od tega datuma skriti → pregled (poročanje). */
  hiddenReviewBefore: Date;
};

/** Izračun mej retencije za podani trenutni čas (testabilno). */
export function retentionCutoffs(now: Date = new Date()): RetentionCutoffs {
  const ms = (days: number) => days * 24 * 60 * 60 * 1000;
  return {
    rejectedBefore: new Date(now.getTime() - ms(RETENTION.rejectedDays)),
    deletedBefore: new Date(now.getTime() - ms(RETENTION.softDeletedDays)),
    hiddenReviewBefore: new Date(now.getTime() - ms(RETENTION.hiddenReviewDays)),
  };
}

/** Anonimizirano ime (za prikaz po izbrisu uporabniških podatkov). */
export function anonymizedName(): string {
  return ANONYMOUS_NAME;
}

/** Ali je prispevek zaradi retencije star za fizicni izbris? */
export function isPastRetention(
  status: string,
  createdAt: Date,
  deletedAt: Date | null,
  now: Date = new Date()
): boolean {
  const c = retentionCutoffs(now);
  if (status === "rejected") return createdAt < c.rejectedBefore;
  if (status === "deleted") return (deletedAt ?? createdAt) < c.deletedBefore;
  return false;
}
