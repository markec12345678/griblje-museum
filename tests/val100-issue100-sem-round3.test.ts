/**
 * Val 100 — ISSUE #100, runda 3: poznejši viri za hišo št. 73.
 *
 * Kaj ta datoteka varuje:
 *  1. F0000212 OBJEKTNÁ DOKUMENTACIJA (issue #100 §1): polja Avtor/Datum na javni
 *     strani SEM prazna (NOT_PUBLIC); izvirni posnetek 1200×782 ohranjen kot artefakt
 *     (sha256 v summary); hišna številka na posnetku NI vidljiva (vizualna kontrola) —
 *     identiteta 73 ne more priti s fotografije.
 *  2. FOND-STRUKTURA SEM: 18 javnih zbirk; fond Županič–Vurnik 1930/31 NI med njimi
 *     (NOT_PUBLIC); Drašiči = F0000022 »Teren 22« Fanči Šarf 1965 (250 posnetkov,
 *     0 Gribelj); ključna beseda Etnologi = 202 predmetov, F0000212 edini gribeljski;
 *     lokacija Griblje = 5 predmetov (trditev MVG-010 ostaja natanko resnična).
 *  3. NOVA FOTOGRAFIJA F0003143 (Vahtar, 1928) — 6. poznana SEM fotografija povezana
 *     z vasjo; oznaka »Bela krajina« (ni na lokacijski strani Griblje).
 *  4. 2 COBISS-VIRA: Muršič–Hudelja 2009 (251673088) + Iglič–Kralj-Iglič 2006
 *     (230068736) — bibliografija VERIFIED, vsebina TO_COLLECT.
 *  5. VGRADNJA: 3 novi viri izključno na MVG-010 (nikjer drugje — no-duplication);
 *     dopolnjen opis sem-f0000212; odstavek zgodbe sl+en; izrecen prehod števcev
 *     114/625/502/68.
 *  6. POŠTENOST VERIGE: F0000212 = št. 73 ostaja INFERRED (nič ne dvignjeno);
 *     ATLAS §22 ne-tikanja (spremembe samo museum-content.ts + docs + val100/).
 *
 * Protokol issue #100: prazna polja = odprta raziskovalna naloga, ne dovoljenje za sklepanje.
 */
import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { seedExhibits } from "../src/lib/museum-content";
import { SOURCE_USAGE } from "../src/lib/source-registry";

const RG = join(process.cwd(), "research-griblje");
const V100 = join(RG, "val100");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

type Sum = {
  val: string;
  issue: string;
  title: string;
  deterministic: true;
  method: { vlm_calls: number; web_search_calls: number };
  sem_f0000212_object_page: {
    avtor: string;
    datum: string;
    status_public_page: string;
    avtor_datum_status: string;
    digitalna_slika: {
      izvirna_prenašena: string;
      sha256_orig: string;
      vizualna_kontrola_1200x782: string;
    };
  };
  sem_fond_struktura: {
    zbirke_fotografij_online: number;
    fond_zupanic_vurnik_1930_online: false;
    fond_zupanic_vurnik_status: string;
    terenske_fotografije_lokacije: number;
    terenske_fotografije_bela_krajina: false;
    drasici_fond: {
      fond: string;
      avtor_potrjen_na_vrstici: string;
      items_online: number;
      griblje_omembe: number;
    };
    kljucna_beseda_etnologi: { items: number; gribljski_objekti: string[] };
    lokacija_griblje: string[];
    lokacija_griblje_count: number;
  };
  nova_sem_fotografija: {
    id: string;
    avtor: string;
    datum: string;
    lokacija: string;
    status: string;
    sha256_slika: string;
  };
  bibliografija_nova: { key: string; cobiss: string; isbn: string; status: string }[];
  blokade_peskovnika: Record<string, string>;
  veriga_s8_po_rundi_3: Record<string, string>;
};

const SUMMARY = JSON.parse(
  readFileSync(join(V100, "issue100-round3-summary.json"), "utf8"),
) as Sum;

const zupanic = seedExhibits.find((e) => e.museumNo === "MVG-010")!;
const src = (key: string) => zupanic.sources?.find((s) => s.key === key);
const allCites = (key: string) =>
  seedExhibits.filter((e) => e.sources?.some((s) => s.key === key)).map((e) => e.museumNo);

describe("val100 · issue #100 runda 3 · F0000212 objektna dokumentacija", () => {
  test("summary je val 100 / issue 100 / determinističen / 0 VLM / 0 spleta", () => {
    expect(SUMMARY.val).toBe("100");
    expect(SUMMARY.issue).toBe("100");
    expect(SUMMARY.deterministic).toBe(true);
    expect(SUMMARY.method.vlm_calls).toBe(0);
    expect(SUMMARY.method.web_search_calls).toBe(0);
  });

  test("javni zapis SEM: Avtor in Datum PRAZNA — NOT_PUBLIC", () => {
    const p = SUMMARY.sem_f0000212_object_page;
    expect(p.avtor).toContain("prazno");
    expect(p.datum).toContain("prazno");
    expect(p.status_public_page).toBe("VERIFIED");
    expect(p.avtor_datum_status).toContain("NOT_PUBLIC");
  });

  test("izvirni posnetek 1200×782 ohranjen — sha256 artefakta se ujema s summary", () => {
    const d = SUMMARY.sem_f0000212_object_page.digitalna_slika;
    expect(d.izvirna_prenašena).toContain("1200x782");
    expect(sha256(join(V100, "f0000212-orig.jpg"))).toBe(d.sha256_orig);
  });

  test("vizualna kontrola: hišna številka NI vidljiva na posnetku", () => {
    const v = SUMMARY.sem_f0000212_object_page.digitalna_slika.vizualna_kontrola_1200x782;
    expect(v).toContain("HIŠNA ŠTEVILKA NA POSNETKU NI VIDLJIVA");
  });
});

describe("val100 · fond-struktura SEM (runda 1 točka: po avtorju/fondu/terenu)", () => {
  test("18 javnih zbirk; fond Županič–Vurnik 1930/31 NI med njimi (NOT_PUBLIC)", () => {
    const f = SUMMARY.sem_fond_struktura;
    expect(f.zbirke_fotografij_online).toBe(18);
    expect(f.fond_zupanic_vurnik_1930_online).toBe(false);
    expect(f.fond_zupanic_vurnik_status).toContain("NOT_PUBLIC");
  });

  test("Terenske fotografije: 32 lokacij, brez Bele krajine", () => {
    const f = SUMMARY.sem_fond_struktura;
    expect(f.terenske_fotografije_lokacije).toBe(32);
    expect(f.terenske_fotografije_bela_krajina).toBe(false);
  });

  test("Drašiči fond = F0000022 Teren 22, Fanči Šarf, 1965; 250 posnetkov, 0 Gribelj", () => {
    const d = SUMMARY.sem_fond_struktura.drasici_fond;
    expect(d.fond).toContain("F0000022");
    expect(d.fond).toContain("Teren 22");
    expect(d.avtor_potrjen_na_vrstici).toBe("Fanči Šarf");
    expect(d.items_online).toBe(250);
    expect(d.griblje_omembe).toBe(0);
  });

  test("Etnologi = 202 predmetov; F0000212 edini gribeljski", () => {
    const k = SUMMARY.sem_fond_struktura.kljucna_beseda_etnologi;
    expect(k.items).toBe(202);
    expect(k.gribljski_objekti).toEqual(["F0000212 (edini gribeljski)"]);
  });

  test("lokacija Griblje = natanko 5 predmetov (trditev MVG-010 ostaja resnična)", () => {
    const f = SUMMARY.sem_fond_struktura;
    expect(f.lokacija_griblje_count).toBe(5);
    expect(f.lokacija_griblje).toEqual([
      "F0000182",
      "F0000183",
      "F0000212",
      "F0000838",
      "F0001407",
    ]);
  });
});

describe("val100 · nova SEM fotografija F0003143 (Vahtar, 1928)", () => {
  test("identiteta: Vahtar, 1.1.1928, lokacija Bela krajina, VERIFIED", () => {
    const p = SUMMARY.nova_sem_fotografija;
    expect(p.id).toBe("F0003143");
    expect(p.avtor).toBe("Drago Vahtar (isti fotograf kot F0001407 »Hiša, Griblje«, 1928)");
    expect(p.datum).toBe("1.1.1928");
    expect(p.lokacija).toContain("Bela krajina");
    expect(p.status).toBe("VERIFIED (stran + slika 1200x833 ohranjena)");
  });

  test("slika F0003143 ohranjena — sha256 artefakta se ujema", () => {
    expect(sha256(join(V100, "f0003143.jpg"))).toBe(SUMMARY.nova_sem_fotografija.sha256_slika);
  });
});

describe("val100 · 2 nova COBISS vira (bibliografija VERIFIED, vsebina TO_COLLECT)", () => {
  test("Muršič–Hudelja 2009: COBISS 251673088, ISBN, status", () => {
    const b = SUMMARY.bibliografija_nova.find((x) => x.key === "mursic-hudelja-2009")!;
    expect(b.cobiss).toBe("COBISS.SI-ID 251673088");
    expect(b.isbn).toBe("978-961-237-367-2");
    expect(b.status).toContain("VERIFIED");
    expect(b.status).toContain("TO_COLLECT");
  });

  test("Iglič–Kralj-Iglič 2006: COBISS 230068736, ISBN, status", () => {
    const b = SUMMARY.bibliografija_nova.find((x) => x.key === "iglic-kralj-iglic-2006")!;
    expect(b.cobiss).toBe("COBISS.SI-ID 230068736");
    expect(b.isbn).toContain("961-237-177-6");
    expect(b.status).toContain("VERIFIED");
  });

  test("obe knjigi sta registrirani kot vira zapisu MVG-010", () => {
    expect(src("mursic-hudelja-2009")).toBeTruthy();
    expect(src("iglic-kralj-iglic-2006")).toBeTruthy();
    expect(allCites("mursic-hudelja-2009")).toEqual(["MVG-010"]);
    expect(allCites("iglic-kralj-iglic-2006")).toEqual(["MVG-010"]);
  });
});

describe("val100 · vgradnja v museum-content (no-duplication)", () => {
  test("vir sem-f0003143 obstaja, citiran izključno na MVG-010, s pravimi metapodatki", () => {
    const s = src("sem-f0003143")!;
    expect(s).toBeTruthy();
    expect(allCites("sem-f0003143")).toEqual(["MVG-010"]);
    expect(s.nameSi).toContain("F0003143");
    expect(s.nameSi).toContain("Drago Vahtar");
    expect(s.noteSi).toContain("Bela krajina");
    expect(s.noteSi).toContain("šesta poznana SEM fotografija");
    expect(s.noteEn).toContain("sixth known SEM photograph");
  });

  test("dopolnjen opis sem-f0000212: avtor/datum NOT_PUBLIC + posnetek + vizualna kontrola", () => {
    const s = src("sem-f0000212")!;
    expect(s.noteSi).toContain("prazna (NOT_PUBLIC");
    expect(s.noteSi).toContain("1200×782");
    expect(s.noteSi).toContain("hišna številka na posnetku ni vidljiva");
    expect(s.noteEn).toContain("'Author' and 'Date' fields are empty");
    expect(s.noteEn).toContain("no house number visible");
  });

  test("zgodba MVG-010 (sl+en) nosi rundino 3: prazna polja, fond 1930 NOT_PUBLIC, F0003143, knjigi", () => {
    expect(zupanic.storySi).toContain("polja »Avtor« in »Datum« na SEM strani F0000212 sta prazna");
    expect(zupanic.storySi).toContain("Fond Županič–Vurnik 1930/31");
    expect(zupanic.storySi).toContain("F0003143");
    expect(zupanic.storySi).toContain("Muršič–Hudelja 2009");
    expect(zupanic.storySi).toContain("Iglič–Kralj-Iglič 2006");
    expect(zupanic.storyEn).toContain("'Author' and 'Date' fields on the SEM page for F0000212 are empty");
    expect(zupanic.storyEn).toContain("Županič–Vurnik fond of 1930/31");
    expect(zupanic.storyEn).toContain("F0003143");
  });

  test("izrecen prehod števcev: 114 zapisov / 625 virov / 502 identitet / 68 deljenih", () => {
    const virov = seedExhibits.reduce((a, e) => a + (e.sources?.length ?? 0), 0);
    const deljenih = [...SOURCE_USAGE.values()].filter((u) => u.exhibits.length > 1).length;
    expect(seedExhibits.length).toBe(114);
    expect(virov).toBe(625);
    expect(SOURCE_USAGE.size).toBe(502);
    expect(deljenih).toBe(68);
  });
});

describe("val100 · poštenost verige + ATLAS ne-tikanja", () => {
  test("F0000212 = št. 73 ostaja INFERRED — nič ne dvignjeno brez enotnega vira", () => {
    const v = SUMMARY.veriga_s8_po_rundi_3;
    expect(v["identiteta_F0000212 = st_73"]).toContain("INFERRED");
    expect(v["identiteta_F0000212 = st_73"]).toContain("nespremenjeno");
    expect(v["hisa_73_v_1825"]).toBe("NOT_FOUND (nespremenjeno)");
    expect(v["hisna_st_73_miko_kupil_1873"]).toContain("VERIFIED");
    expect(v["originalna_fotografija_F0000212"]).toContain("VERIFIED");
  });

  test("artefakti val100 obstajajo na disku (SEM struktura + COBISS + Wikipedia + Kamra)", () => {
    for (const f of [
      "sem-f0000212.html",
      "sem-f0003143.html",
      "sem-f22-114.html",
      "sem-zbirke-fotografij.html",
      "sem-terenske.html",
      "sem-kljucna-etnologi.html",
      "sem-griblje-r3.html",
      "sem-drasici.html",
      "cobiss-bib-251673088.html",
      "cobiss-bib-230068736.html",
      "wiki-zupanic.html",
      "wiki-griblje.html",
      "kamra-search-griblje.html",
      "issue100-round3-summary.json",
    ]) {
      expect(() => readFileSync(join(V100, f))).not.toThrow();
    }
  });

  test("blokade peskovnika izrecno dokumentirane (eZKN → izven peskovnika)", () => {
    expect(SUMMARY.blokade_peskovnika.ezkn_gov_si).toContain("000");
    expect(SUMMARY.blokade_peskovnika.ezkn_gov_si).toContain("NEIZVEDLJIVO");
    expect(SUMMARY.blokade_peskovnika["zemljiski_knjin vpisi"]).toContain("NOT_PUBLIC");
  });
});
