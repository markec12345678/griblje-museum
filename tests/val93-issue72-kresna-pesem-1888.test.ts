/**
 * Val 93 — ISSUE #72, točka 26: »Kresna pesem« (1888) — ljudsko izročilo,
 * LASTEN zapis (MVG-114), ne arheologija (ne gre na MVG-083).
 *
 * Ozadje: kuratorski zapis v issue #72 (točka 26) z bibliografijo, preverjeno
 * na dLib.si: »Kresna pesem; Pevana v Gribljah, tri četrt ure od Podzemlja pri
 * Metliki«, Dom in svet, letnik 1, št. 6, 1888, založnik Katoliško tiskovno
 * društvo, izvor NUK, opomba uredništva (Fr.Lampe), URN:NBN:SI:doc-ZP4FER74,
 * COBISS.SI-ID 31722241. Status bibliografije: VERIFIED; vsebina polnega
 * besedila TO_COLLECT (dLib stream seja-vezan — vzorec Leksikon 1937).
 *
 * Varovalke:
 *  1. MVG-114 obstaja (lasten zapis) — naslov, perioda, leto 1888, kategorija
 *     sege, DOCUMENTED; koordinata ≈ jedro vasi (coordsApprox), brez slike
 *     (vzorec MVG-109).
 *  2. Viri: dlib-kresna-pesem-1888 (URN + COBISS + signatura + Fr.Lampe +
 *     VERIFIED/TO_COLLECT), wikisource-dom-in-svet (kontekst revije),
 *     odeon-totter-kres = deljen vir z MVG-065 (kontekst povezave, REVIEW).
 *  3. Poštenost: naslov »Pevana v Gribljah« dokazuje peto-v-Gribljah 1888,
 *     NE nastanka v Gribljih; avtorstvo anonimno; povezava z Matičkovim
 *     zapisom (MVG-065) = REVIEW, hipoteza — ne dejstvo.
 *  4. +1 zapis (113 → 114) — izrecen, testno voden prehod števca (i18n ×5);
 *     +0 KG / +0 ATLAS (§22): novi viri citirani izključno na MVG-114.
 *  5. Pokritost sprehodov ostaja 1:1 (nova postaja za kresna-pesem-1888).
 */
import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { seedExhibits, type SeedExhibit } from "../src/lib/museum-content";
import { SOURCE_USAGE, sourceKeyOf } from "../src/lib/source-registry";
import { WALKS } from "../src/lib/walks";

const I18N = readFileSync(new URL("../src/lib/i18n.tsx", import.meta.url), "utf-8");

function bySlug(slug: string): SeedExhibit {
  const ex = seedExhibits.find((e) => e.slug === slug);
  if (!ex) throw new Error(`zapis ${slug} ne obstaja`);
  return ex;
}

function byMuseumNo(no: string): SeedExhibit {
  const ex = seedExhibits.find((e) => e.museumNo === no);
  if (!ex) throw new Error(`zapis ${no} ne obstaja`);
  return ex;
}

describe("val93 — MVG-114 kresna-pesem-1888 (lasten zapis)", () => {
  const ex = byMuseumNo("MVG-114");

  test("MVG-114 obstaja kot lasten zapis (slug, kategorija sege, DOCUMENTED)", () => {
    expect(ex.slug).toBe("kresna-pesem-1888");
    expect(ex.category).toBe("sege");
    expect(ex.evidenceStatus).toBe("DOCUMENTED");
    expect(ex.addedAt).toBe("2026-09-28");
    expect(ex.featured).toBe(false);
  });

  test("leto 1888; koordinata ≈ jedro vasi z coordsApprox; brez slike (vzorec MVG-109)", () => {
    expect(ex.yearFrom).toBe(1888);
    expect(ex.yearTo).toBe(1888);
    expect(ex.coordsApprox).toBe(true);
    expect(ex.image).toBeFalsy();
  });

  test("naslov/perioda nosita 1888 + Dom in svet + lokalizacijo iz naslova vira", () => {
    expect(ex.titleSi).toContain("Kresna pesem (1888)");
    expect(ex.titleSi).toContain("Gribljah");
    expect(ex.titleEn).toContain("The Bonfire Song (1888)");
    expect(ex.periodSi).toContain("20. junij 1888");
    expect(ex.periodSi).toContain("Dom in svet");
    expect(ex.periodSi).toContain("letnik 1, številka 6");
    expect(ex.periodEn).toContain("20 June 1888");
    expect(ex.summarySi).toContain("Pevana v Gribljah");
  });

  test("vsi trije viri so citirani, vsak z imenom in opombo v obeh jezikih", () => {
    const keys = ex.sources.map((s) => s.key);
    expect(keys).toEqual([
      "dlib-kresna-pesem-1888",
      "wikisource-dom-in-svet",
      "odeon-totter-kres",
    ]);
    for (const s of ex.sources) {
      expect(s.nameSi.trim()).not.toBe("");
      expect(s.nameEn.trim()).not.toBe("");
      expect((s.noteSi ?? "").trim()).not.toBe("");
      expect((s.noteEn ?? "").trim()).not.toBe("");
    }
  });

  test("dLib vir nosi celotno preverjeno bibliografijo + statusa VERIFIED/TO_COLLECT", () => {
    const s = ex.sources.find((x) => x.key === "dlib-kresna-pesem-1888")!;
    expect(s.url).toBe("https://dlib.si/?URN=URN:NBN:SI:doc-ZP4FER74");
    for (const frag of [
      "URN:NBN:SI:doc-ZP4FER74",
      "COBISS.SI-ID 31722241",
      "letnik 1, številka 6",
      "Katoliško tiskovno društvo",
      "Anonimno, Janko",
      "Fr.Lampe",
      "Č 79/II 33565",
      "VERIFIED",
      "TO_COLLECT",
      "seja-vezan",
    ]) {
      expect(s.noteSi).toContain(frag);
    }
    expect(s.noteEn).toContain("URN:NBN:SI:doc-ZP4FER74");
    expect(s.noteEn).toContain("COBISS.SI-ID 31722241");
    expect(s.noteEn).toContain("VERIFIED");
    expect(s.noteEn).toContain("TO_COLLECT");
  });

  test("Wikivir vir: literarni mesečnik 1888–1944 (kontekst prvega letnika)", () => {
    const s = ex.sources.find((x) => x.key === "wikisource-dom-in-svet")!;
    expect(s.url).toBe("https://sl.wikisource.org/wiki/Dom_in_svet");
    expect(s.noteSi).toContain("1888 in 1944");
    expect(s.noteSi).toContain("VERIFIED");
  });

  test("poštenost: pesem je dokumentirana kot pevana v Gribljih — NE kot nastala v Gribljih", () => {
    expect(ex.storySi).toContain("ne dokazuje, da je nastala v Gribljih");
    expect(ex.storyEn).toContain("it does not prove that it was created in Griblje");
    expect(ex.storySi).toContain("objavljena kot pesem, pevana v Gribljih");
    // avtorstvo ostaja anonimno — brez pripisovanja
    expect(ex.storySi).toContain("avtorstvo je anonimno");
  });

  test("povezava z Matičkovim zapisom (MVG-065) je izrecno REVIEW, ne dejstvo", () => {
    expect(ex.storySi).toContain("REVIEW");
    expect(ex.storySi).toContain("hipoteza, ne dejstvo");
    expect(ex.storySi).toContain("MVG-065");
    expect(ex.storyEn).toContain("REVIEW");
    expect(ex.storyEn).toContain("a hypothesis, not a fact");
    const ctx = ex.sources.find((x) => x.key === "odeon-totter-kres")!;
    expect(ctx.noteSi).toContain("status povezave REVIEW");
    expect(ctx.noteSi).toContain("ni dokazana");
  });

  test("polno besedilo = TO_COLLECT z izrecnim razlogom (seja-vezan, vzorec Leksikon 1937)", () => {
    expect(ex.storySi).toContain("TO_COLLECT");
    expect(ex.storySi).toContain("seja-vezan");
    expect(ex.storySi).toContain("Leksikonu 1937");
    expect(ex.storyEn).toContain("session-bound");
  });

  test("brez podvajanja: MVG-065 ostaja nespremenjen vir odeon-totter-kres; zgodbi sta ločeni", () => {
    const kres = byMuseumNo("MVG-065");
    expect(kres.slug).toBe("kresovanje");
    expect(kres.sources.some((s) => s.key === "odeon-totter-kres")).toBe(true);
    expect(ex.storySi).not.toBe(kres.storySi);
    // MVG-114 ne prevzame MVG-065-ove trditve o ohranitvi le v Adlešiški fari
    expect(ex.storySi).not.toContain("Adlešiška fara");
  });
});

describe("val93 — izrecen prehod števcev (ne tih)", () => {
  test("+1 zapis: 113 → 114 (MVG-114 je zadnji)", () => {
    expect(seedExhibits.length).toBe(114);
    expect(byMuseumNo("MVG-114")).toBeDefined();
    const nums = seedExhibits
      .map((e) => e.museumNo)
      .filter((n): n is string => !!n)
      .map((n) => Number(n.replace("MVG-", "")));
    expect(Math.max(...nums)).toBe(114);
    expect(nums.length).toBe(114);
  });

  test("i18n ×5: hero + walks coverNote nosita 114 (brez zastarelih 113)", () => {
    expect(I18N).toContain("Zbirka 114 zapisov");
    expect(I18N).toContain("One hundred and fourteen records");
    expect(I18N).toContain("Sto četrnaest zapisa");
    expect(I18N).toContain("Hundertvierzehn Einträge");
    expect(I18N).toContain("Cento quattordici schede");
    expect(I18N).toContain("Sprehodi skupaj pokrivajo vseh 114 zapisov zbirke.");
    expect(I18N).toContain("Together the walks cover all 114 records of the collection.");
    // varovalka proti zastaranju: števec 113 ne sme ostati nikjer v i18n
    expect(I18N.match(/\b113\b/)).toBeNull();
  });

  test("+0 KG / +0 ATLAS (§22): novi viri citirani izključno na MVG-114", () => {
    const novi = new Set<string>([
      "dlib-kresna-pesem-1888",
      "wikisource-dom-in-svet",
    ]);
    for (const [k, u] of SOURCE_USAGE) {
      if (novi.has(k)) {
        expect(u.exhibits.length).toBe(1);
        expect(u.exhibits.every((e) => e.slug === "kresna-pesem-1888")).toBe(true);
      }
    }
  });

  test("deljeni vir: odeon-totter-kres — MVG-114 se pridruži obstoječim citatom (deljenih ostaja 68)", () => {
    const kres065 = byMuseumNo("MVG-065");
    const src065 = kres065.sources.find((s) => s.key === "odeon-totter-kres")!;
    const key = sourceKeyOf(src065.nameSi, src065.url ?? null);
    const u = SOURCE_USAGE.get(key);
    expect(u).toBeDefined();
    const slugs = u!.exhibits.map((e) => e.slug).sort();
    // vir je že pred valom 93 bil deljen (ciril-totter, kresovanje, matija-totter)
    expect(slugs).toContain("kresovanje");
    expect(slugs).toContain("kresna-pesem-1888");
    expect(slugs.length).toBe(4);
  });

  test("pokritost sprehodov 1:1: kresna-pesem-1888 ima postajo (v sprehodu vas-in-njeni-ljudje, za kresovanjem)", () => {
    const hits: { walk: string; index: number }[] = [];
    for (const w of WALKS) {
      const i = w.stops.findIndex((s) => s.exhibitSlug === "kresna-pesem-1888");
      if (i >= 0) hits.push({ walk: w.id, index: i });
    }
    expect(hits.length).toBe(1);
    const w = WALKS.find((x) => x.id === hits[0].walk)!;
    expect(w.id).toBe("vas-in-njeni-ljudje");
    expect(w.stops[hits[0].index - 1]?.exhibitSlug).toBe("kresovanje");
    for (const s of w.stops) {
      expect(s.noteSi.trim()).not.toBe("");
      expect(s.noteEn.trim()).not.toBe("");
    }
    const stop = w.stops[hits[0].index];
    expect(stop.noteSi).toContain("1888");
  });
});
