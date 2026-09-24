/**
 * ENOTNI TESTI — deljenje besedila TTS avdio vodnika (issue #4).
 *
 * Pokritje:
 *  1. odseki ≤ MAX_CHARS (nikoli prek omejitve ponudnika),
 *  2. brez praznih odsekov (samo presledki → zavrnjeni),
 *  3. vsebina se ohrani (ponovno združevanje = izvorno besedilo),
 *  4. trdi rez zelo dolgega stavka po besedah (brez izgube besed),
 *  5. čiščenje besedila za izgovorjavo (misle, navedki, pomiki).
 *
 * Zagon: bun test tests/audio-chunks.test.ts
 */
import { describe, expect, test } from "bun:test";
import { MAX_CHARS, prepareForTts, splitIntoChunks } from "../src/lib/audio-chunks";

/** Združi odseke in poravna presledke — primerljivo z izvornikom. */
function rejoined(chunks: string[]): string {
  return chunks.join(" ").replace(/\s+/g, " ").trim();
}

describe("splitIntoChunks", () => {
  test("kratko besedilo ostane en odsek, nespremenjeno", () => {
    const text = "Vas Griblje leži nad Kolpo.";
    expect(splitIntoChunks(text)).toEqual([text]);
  });

  test("besedilo natanko MAX_CHARS je en odsek", () => {
    const text = "a".repeat(MAX_CHARS);
    expect(splitIntoChunks(text)).toHaveLength(1);
    expect(splitIntoChunks(text)[0]).toHaveLength(MAX_CHARS);
  });

  test("dolgo besedilo: vsi odseki ≤ MAX_CHARS in brez praznih", () => {
    const sentence =
      "Griblje so vas v Beli krajini, ki jo pisni viri prvič omenjajo leta 1468 kot Griblach. ";
    const text = sentence.repeat(60); // ~4200 znakov → več odsekov
    const chunks = splitIntoChunks(text);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(MAX_CHARS);
      expect(chunk.trim()).not.toBe("");
    }
  });

  test("dolgo besedilo: vsebina se ohrani (monotonost deljenja)", () => {
    const words = ["Griblje", "Kolpa", "župnija", "Podzemelj", "cerkev", "sveti", "Vid"];
    const text = Array.from({ length: 900 }, (_, i) => words[i % words.length]).join(" ");
    const chunks = splitIntoChunks(text);
    // Vsaka beseda ohrani vrstni red: počiščeno ponovno združevanje = izvornik.
    expect(rejoined(chunks)).toBe(text.replace(/\s+/g, " ").trim());
  });

  test("zelo dolg stavek brez ločil se trdo reže po besedah", () => {
    const text = Array.from({ length: 400 }, (_, i) => `beseda${i}`).join(" ");
    const chunks = splitIntoChunks(text);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(MAX_CHARS);
      expect(chunk.trim()).not.toBe("");
    }
    // Brez izgube besed in brez spremembe vrstnega reda.
    const original = text.split(/\s+/);
    const kept = chunks.flatMap((c) => c.split(/\s+/));
    expect(kept).toEqual(original);
  });

  test("mejni primer: MAX_CHARS + 1 znak → dva odseka, oba ≤ meje", () => {
    const text = `${"a".repeat(MAX_CHARS - 1)} b`;
    const chunks = splitIntoChunks(text);
    expect(chunks.length).toBe(2);
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(MAX_CHARS);
  });

  test("deljenje poteka po stavkih, ne na sredini povedi", () => {
    const s1 = `${"a".repeat(400)}. `;
    const s2 = `${"b".repeat(400)}. `;
    const s3 = `${"c".repeat(400)}.`;
    const chunks = splitIntoChunks(s1 + s2 + s3);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      // Vsak odsek se konča z zaključenim stavkom (pika) ali celim stavkom
      // pred naslednjim — ključno: noben odsek se ne konča sredi besede
      // (stavek je ~400 znakov, daleč pod mejo za trdi rez).
      expect(
        chunk.endsWith("aa.") || chunk.endsWith("bb.") || chunk.endsWith("cc.")
      ).toBe(true);
    }
  });

  test("prilagojena meja (max parameter) se spoštuje", () => {
    const text = "Prva poved. Druga poved. Tretja poved. Četrta poved.";
    const chunks = splitIntoChunks(text, 20);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(20);
  });
});

describe("prepareForTts", () => {
  test("misle postanejo pavze (vejice), navedki izginejo", () => {
    expect(prepareForTts("«Griblje» — vas")).toBe("Griblje , vas");
  });

  test("odstavki postanejo povedi, večkratni pomiki izginejo", () => {
    expect(prepareForTts("Prva vrstica\n\nDruga vrstica\n  tretja")).toBe(
      "Prva vrstica. Druga vrstica tretja"
    );
  });

  test("vozrki (\\r) se nadomestijo, robovi so čisti", () => {
    expect(prepareForTts("  eno\r\n dva  ")).toBe("eno dva");
  });
});
