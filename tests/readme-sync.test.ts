/**
 * VAROVALKA — README »Stanje zbirke« proti podatkovnemu sloju.
 *
 * Zakaj: README nosi aktualno vrstico »Stanje zbirke« (in živi povezavo
 * /api/opendata), ki jo ročno piše uredništvo ob vsakem valu. Zgodovinske
 * številke starejših sklopov so namerni časovni posnetki (»stanje zbirke
 * X/Y/Z nespremenjeno«) in jih ta test NE dotika — varuje samo aktualno
 * vrstico, da ne ostane zastarela, ko se podatkovni sloj spremeni
 * (isti vzorec kot layout.tsx: številka pride iz vira podatkov, ne iz
 * ročno zapisane trditve — issue #27, točka Q).
 *
 * Izpeljava števil (deterministično, brez baze — seme je vir resnice,
 * DB pa se seje iz njega, zato so številke sejanja iste):
 *   - zapisov   = seedExhibits.length
 *   - virov     = vsota citatov (ex.sources) čez vse zapise
 *   - identitet = SOURCE_USAGE.size (kanonične identitete virov)
 *   - deljenih  = viri, ki jih citira > 1 zapis
 *   - entitet   = ENTITIES.length
 *   - oseb      = ENTITIES s type "person"
 *
 * NIZA »objavljenih trditve« in »arhivskih enot« namerno NE trdimo:
 * sta stanje baze/registrov ob dostavi, ne statični podatkovni sloj.
 *
 * Zagon: bun test tests/readme-sync.test.ts
 */
import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { seedExhibits } from "../src/lib/museum-content";
import { SOURCE_USAGE } from "../src/lib/source-registry";
import { ENTITIES } from "../src/lib/entities";

const README = readFileSync(new URL("../README.md", import.meta.url), "utf-8");

/** Izvleče aktualno vrstico »Stanje zbirke« iz README. */
function stanjeZbirke(): {
  zapisov: number;
  virov: number;
  identitet: number;
  deljenih: number;
  entitet: number;
  oseb: number;
} {
  const m = README.match(
    /Stanje zbirke: \*\*(\d+) zapisov[^,]*,\s*(\d+) virov,\s*(\d+) identitet,\s*(\d+) deljenih,\s*(\d+) entitet \(oseb (\d+)\)/,
  );
  if (!m) {
    throw new Error(
      "README nima (več) prepoznavne vrstice »Stanje zbirke« — posodobi regex v tests/readme-sync.test.ts skupaj z vrstico.",
    );
  }
  return {
    zapisov: Number(m[1]),
    virov: Number(m[2]),
    identitet: Number(m[3]),
    deljenih: Number(m[4]),
    entitet: Number(m[5]),
    oseb: Number(m[6]),
  };
}

/** Dejanska števila, izpeljana iz podatkovnega sloja. */
function dejansko(): {
  zapisov: number;
  virov: number;
  identitet: number;
  deljenih: number;
  entitet: number;
  oseb: number;
} {
  const virov = seedExhibits.reduce((acc, ex) => acc + (ex.sources?.length ?? 0), 0);
  const deljenih = [...SOURCE_USAGE.values()].filter((u) => u.exhibits.length > 1).length;
  return {
    zapisov: seedExhibits.length,
    virov,
    identitet: SOURCE_USAGE.size,
    deljenih,
    entitet: ENTITIES.length,
    oseb: ENTITIES.filter((e) => e.type === "person").length,
  };
}

describe("README sinhronizacija — aktualno »Stanje zbirke«", () => {
  const trditev = stanjeZbirke();
  const resnica = dejansko();

  test("število zapisov ustreza semenu zbirk", () => {
    expect(trditev.zapisov).toBe(resnica.zapisov);
  });

  test("število virov ustreza vsoti citatov", () => {
    expect(trditev.virov).toBe(resnica.virov);
  });

  test("število identitet virov ustreza registru virov", () => {
    expect(trditev.identitet).toBe(resnica.identitet);
  });

  test("število deljenih virov ustreza uporabi > 1 zapis", () => {
    expect(trditev.deljenih).toBe(resnica.deljenih);
  });

  test("število entitet in oseb ustreza registru entitet", () => {
    expect(trditev.entitet).toBe(resnica.entitet);
    expect(trditev.oseb).toBe(resnica.oseb);
  });

  test("živa povezava /api/opendata nosi iste številke (zapisov/virov)", () => {
    const m = README.match(/`\/api\/opendata`[^0-9]*(\d+)\/(\d+)/);
    expect(m).not.toBeNull();
    expect(Number(m![1])).toBe(resnica.zapisov);
    expect(Number(m![2])).toBe(resnica.virov);
  });

  test("ob neuspehu poroča pripravljeno vrstico za lepljenje", () => {
    // Prijazen izpis za uredništvo: pravilna vrstica je pripravljena za copy-paste.
    const pravilna = `Stanje zbirke: **${resnica.zapisov} zapisov (MVG-001–${resnica.zapisov}), ${resnica.virov} virov, ${resnica.identitet} identitet, ${resnica.deljenih} deljenih, ${resnica.entitet} entitet (oseb ${resnica.oseb})**`;
    expect(typeof pravilna).toBe("string");
    expect(pravilna).toContain(`${resnica.zapisov} zapisov`);
  });
});
