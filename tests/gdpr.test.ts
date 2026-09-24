import { describe, expect, test } from "bun:test";
import {
  RETENTION,
  retentionCutoffs,
  isPastRetention,
  anonymizedName,
  ANONYMOUS_NAME,
} from "../src/lib/gdpr";

// --- Retencijska pravila (#27/H) ---------------------------------------------

describe("GDPR retention", () => {
  test("pravila: rejected 30 dni, deleted 30 dni, hidden pregled 365 dni", () => {
    expect(RETENTION.rejectedDays).toBe(30);
    expect(RETENTION.softDeletedDays).toBe(30);
    expect(RETENTION.hiddenReviewDays).toBe(365);
  });

  test("meje so izračunane nazaj od podanega trenutka", () => {
    const now = new Date("2026-09-24T12:00:00Z");
    const c = retentionCutoffs(now);
    expect(c.rejectedBefore.toISOString()).toBe("2026-08-25T12:00:00.000Z");
    expect(c.deletedBefore.toISOString()).toBe("2026-08-25T12:00:00.000Z");
    expect(c.hiddenReviewBefore.toISOString()).toBe("2025-09-24T12:00:00.000Z");
  });

  test("rejected starejši od 30 dni → fizicni izbris", () => {
    const now = new Date("2026-09-24T12:00:00Z");
    expect(
      isPastRetention("rejected", new Date("2026-08-01T00:00:00Z"), null, now)
    ).toBe(true);
    expect(
      isPastRetention("rejected", new Date("2026-09-01T00:00:00Z"), null, now)
    ).toBe(false);
  });

  test("deleted (mehko) šteje od deletedAt, ne od createdAt", () => {
    const now = new Date("2026-09-24T12:00:00Z");
    // Ustvarjen dolgo nazaj, mehko izbrisan sveže → še nič.
    expect(
      isPastRetention(
        "deleted",
        new Date("2020-01-01T00:00:00Z"),
        new Date("2026-09-20T00:00:00Z"),
        now
      )
    ).toBe(false);
    // Mehko izbrisan 31 dni nazaj → fizicni izbris.
    expect(
      isPastRetention(
        "deleted",
        new Date("2020-01-01T00:00:00Z"),
        new Date("2026-08-20T00:00:00Z"),
        now
      )
    ).toBe(true);
  });

  test("published/pending/hidden nimajo samodejne retencije", () => {
    const now = new Date("2026-09-24T12:00:00Z");
    const old = new Date("1990-01-01T00:00:00Z");
    expect(isPastRetention("published", old, null, now)).toBe(false);
    expect(isPastRetention("pending", old, null, now)).toBe(false);
    expect(isPastRetention("hidden", old, null, now)).toBe(false);
  });
});

// --- Anonimizacija (čl. 17) ---------------------------------------------------

describe("GDPR anonymization", () => {
  test("anonimizirano ime je stabilno in ne-osebno", () => {
    expect(anonymizedName()).toBe(ANONYMOUS_NAME);
    expect(ANONYMOUS_NAME).toBe("Izbrisan uporabnik");
  });
});
