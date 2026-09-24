import { describe, expect, test } from "bun:test";
import {
  guideCacheClear,
  guideCacheGet,
  guideCacheKey,
  guideCacheSet,
  guideCacheSize,
  normalizeGuideQuestion,
} from "../src/lib/guide-cache";

/* --- AI predpomnilnik (issue #27/K + #27/S: stale cache invalidated) ------- */

const CITES = [
  { slug: "mvg-001", titleSi: "Testni zapis", titleEn: "Test exhibit", snippet: "…" },
];

describe("guide-cache — ključi", () => {
  test("normalizacija: diakritika, velike črke, ločila", () => {
    expect(normalizeGuideQuestion("Kdo je bil Niko Županič?")).toBe(
      normalizeGuideQuestion("kdo je bil niko zupanic"),
    );
  });

  test("prekratka vprašanja ne gredo v predpomnilnik", () => {
    expect(guideCacheKey("sl", "a?")).toBeNull();
    expect(guideCacheKey("sl", "kje")).toBeNull();
    expect(guideCacheKey("sl", "Kje so Griblje?")).not.toBeNull();
  });

  test("isti ključ za isto vprašanje v istem jeziku, različen za drugega", () => {
    const sl = guideCacheKey("sl", "Kje so Griblje?");
    const en = guideCacheKey("en", "Kje so Griblje?");
    expect(sl).not.toBeNull();
    expect(sl).not.toBe(en);
  });
});

describe("guide-cache — zastarel odgovor po objavi (#27/K)", () => {
  test("set → get vrne odgovor z citati; clear ga iztrebi", () => {
    guideCacheClear("test-priprava");
    const key = guideCacheKey("sl", "Kdaj je bila šola ustanovljena?");
    expect(key).not.toBeNull();

    guideCacheSet(key as string, "Leta 1889, dva oddelka.", CITES);
    expect(guideCacheSize()).toBeGreaterThan(0);

    const hit = guideCacheGet(key as string);
    expect(hit).not.toBeNull();
    expect(hit?.answer).toContain("1889");
    expect(hit?.cites).toHaveLength(1);

    // Objava nove verzije → guideCacheClear v transitions API-ju:
    const cleared = guideCacheClear("published mvg-001");
    expect(cleared).toBeGreaterThan(0);
    expect(guideCacheGet(key as string)).toBeNull();
    expect(guideCacheSize()).toBe(0);
  });

  test("clear ob praznem predpomnilniku ne javlja poškodbe", () => {
    guideCacheClear("test-prazno");
    const again = guideCacheClear("test-prazno");
    expect(again).toBe(0);
  });

  test("prevalede istega ključa nadomesti vnos (brez podvojitve)", () => {
    guideCacheClear("test-prevalede");
    const key = guideCacheKey("sl", "Koliko zapisov ima zbirka?");
    guideCacheSet(key as string, "Prvi odgovor", CITES);
    guideCacheSet(key as string, "Drugi, novejši odgovor", CITES);
    expect(guideCacheSize()).toBe(1);
    expect(guideCacheGet(key as string)?.answer).toContain("novejši");
    guideCacheClear("test-konec");
  });
});
