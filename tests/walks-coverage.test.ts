/**
 * ENOTNI TESTI — pokritost tematskih sprehodov (issue #4 + #27/Q).
 *
 * Invarianta iz src/lib/walks.ts: vsak zapis zbirke je na točno ENEM
 * tematskem sprehodu (družinski sprehod je podmnožica). Prej je bila to
 * komentarja s trdo zapisano številko — zdaj je preverljiva trditev, ki
 * ostane točna tudi po uredniških dopolnitvah zbirke.
 *
 * Zagon: bun test tests/walks-coverage.test.ts
 */
import { describe, expect, test } from "bun:test";
import { seedExhibits } from "../src/lib/museum-content";
import { WALKS, walkStopOf } from "../src/lib/walks";

describe("pokritost tematskih sprehodov", () => {
  test("vsak zapis zbirke ima postajo na natanko enem tematskem sprehodu", () => {
    const withoutStop: string[] = [];
    for (const exhibit of seedExhibits) {
      const stop = walkStopOf(exhibit.slug);
      if (!stop) withoutStop.push(exhibit.slug);
    }
    expect(withoutStop).toEqual([]);
  });

  test("noben zapis ni na več kot enem tematskem sprehodu", () => {
    const seen = new Map<string, number>();
    for (const walk of WALKS) {
      for (const stop of walk.stops) {
        seen.set(stop.exhibitSlug, (seen.get(stop.exhibitSlug) ?? 0) + 1);
      }
    }
    const duplicates = [...seen.entries()].filter(([, n]) => n > 1).map(([slug]) => slug);
    expect(duplicates).toEqual([]);
  });

  test("število postaj na tematskih sprehodih = število zapisov zbirke", () => {
    const stopCount = WALKS.reduce((sum, walk) => sum + walk.stops.length, 0);
    expect(stopCount).toBe(seedExhibits.length);
  });
});
