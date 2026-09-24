import { describe, expect, test } from "bun:test";
import { checkFixity, sha256Of, type FixityEntry, type ContentReader } from "../src/lib/fixity";

// Testna vsebina z znanim checksumom (izračunan ob zagonu):
const CONTENT_A = Buffer.from("vsebina preserviranega masterja A");
const HASH_A = sha256Of(CONTENT_A);

const entries: FixityEntry[] = [
  { id: "asset-1", storageKey: "assets/a1/master.jpg", sha256: HASH_A },
  { id: "asset-2", storageKey: "assets/a2/master.jpg", sha256: sha256Of(Buffer.from("druga vsebina")) },
  { id: "asset-3", storageKey: "assets/a3/master.jpg", sha256: "0".repeat(64) },
];

/** Hranilnik v pomnilniku: a1 zdrav, a2 POŠKODOVAN (spremenjena vsebina), a3 MANJKA. */
const reader: ContentReader = (key) => {
  if (key.startsWith("assets/a1/")) return CONTENT_A;
  if (key.startsWith("assets/a2/")) return Buffer.from("spremenjena-vsebina");
  return null;
};

describe("fixity preverba (#27/N)", () => {
  test("VERIFIED — checksum ujema", () => {
    const s = checkFixity([entries[0]], reader);
    expect(s.results[0].status).toBe("VERIFIED");
    expect(s.verified).toBe(1);
  });

  test("CORRUPTED — datoteka obstaja, checksum ne ujema (poškodba)", () => {
    const s = checkFixity([entries[1]], reader);
    expect(s.results[0].status).toBe("CORRUPTED");
    expect(s.results[0].detail).toContain("dejansko");
  });

  test("MISSING — vsebina ni dosegljiva na hranilniku", () => {
    const s = checkFixity([entries[2]], reader);
    expect(s.results[0].status).toBe("MISSING");
  });

  test("povzetek šteje vse tri razrede", () => {
    const s = checkFixity(entries, reader);
    expect(s.total).toBe(3);
    expect(s.verified).toBe(1);
    expect(s.corrupted).toBe(1);
    expect(s.missing).toBe(1);
  });

  test("prazen register → nič napak, nič lažnih alarmov", () => {
    const s = checkFixity([], reader);
    expect(s.total).toBe(0);
    expect(s.verified + s.corrupted + s.missing).toBe(0);
  });

  test("checksum neodvisen od velikosti hex zapisa v bazi (lowercase normalizacija)", () => {
    const upper: FixityEntry[] = [
      { id: "asset-up", storageKey: "assets/a1/master.jpg", sha256: HASH_A.toUpperCase() },
    ];
    const s = checkFixity(upper, reader);
    expect(s.results[0].status).toBe("VERIFIED");
  });
});
