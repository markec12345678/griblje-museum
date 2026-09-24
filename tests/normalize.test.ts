/**
 * ENOTNI TESTI — normalizacija nizov (issue #4).
 *
 * Iskanje in filter zbirke si pravilo delita (src/lib/normalize.ts):
 * NFD razstavi diakritike, kombinirajoče oznake izginejo, lowercasamo.
 * Tablica primerov: č/ž/š → c/z/s, tudi velike črke in tuje diakritike.
 *
 * Zagon: bun test tests/normalize.test.ts
 */
import { describe, expect, test } from "bun:test";
import { normalize } from "../src/lib/normalize";

describe("normalize — iskanje neobčutljivo na diakritike", () => {
  test("slovenske diakritike č/ž/š → c/z/s", () => {
    expect(normalize("črnomelj")).toBe("crnomelj");
    expect(normalize("županič")).toBe("zupanic");
    expect(normalize("šopek")).toBe("sopek");
    expect(normalize("GRIBLJE")).toBe("griblje");
    expect(normalize("ŠČŽĆ")).toBe("sczc");
    // Đ (D s črtico, U+0110) se v NFD NE razstavi — črtica ni kombinirajoča
    // diakritika; dokumentirano vedenje, ne napaka.
    expect(normalize("Đ")).toBe("đ");
  });

  test("velike in male črke so enakovredne", () => {
    expect(normalize("Črnomelj")).toBe(normalize("čRNOMELJ"));
    expect(normalize("MVG-001")).toBe("mvg-001");
  });

  test("tuje diakritike se prav tako razstavijo", () => {
    expect(normalize("École")).toBe("ecole");
    expect(normalize("Grüble")).toBe("gruble");
    expect(normalize("Köln")).toBe("koln");
  });

  test("nedia k ritični nizi ostanejo nespremenjeni", () => {
    expect(normalize("kolpa")).toBe("kolpa");
    expect(normalize("Podzemelj 1850")).toBe("podzemelj 1850");
  });

  test("robni presledki so odrezani", () => {
    expect(normalize("  griblje  ")).toBe("griblje");
  });

  test("iskanje brez diakritik najde dia kritični zapis (uporabniški scenarij)", () => {
    // q=crnomelj mora najti »Črnomelj« — obe strani gresta skozi isto
    // normalizacijo, zato se morata ujemati.
    expect(normalize("crnomelj")).toBe(normalize("Črnomelj"));
    expect(normalize("zupanic")).toBe(normalize("Županič"));
  });
});
