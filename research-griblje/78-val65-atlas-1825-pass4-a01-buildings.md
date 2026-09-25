# 78. val — ATLAS 1825 PASS 4: A01 BUILDING INVENTORY v1 (issue #42 §7)

**Datum:** 25. 9. 2026 · **Način:** lokalni deterministični val (VLM kvota 429 7.× potrjena — nič klicev) · **Instrument:** nov instrument vala 61 (agent bere izrezke direktno, protokol 2 neodvisnih prehodov) prvič uporabljen na KARTOGRAFSKEM viru

## Naročilo

Nadaljevanje po val 64 (user: "odlicno nadaljuj"). Naslednji val po worklogu: **PASS 4 = issue #42 §7 A01 building coverage** → MAP_OBJECT vozlišča v KG (brez novih VLM klicev).

## Kaj je bilo narejeno

### 1. Instrument: deterministični izrezki lista A01

- `research-griblje/a01/make-a01-crops.py` — vir `raw-web-val42-2026-10/n083a-pages/a01.jpg` (2826×2273 JPEG, val 42)
- **PREHOD A**: mreža 6 ploščic 3× po vaškem jedru (x 1700–2450, y 1200–2273)
- **PREHOD B**: 4 kvadranti 2.5× (premiščena drugačna razdelitev — ni sidrana na A) + zunanji objekti (sever, zahod, "Pod Grüblani" simbol, naslovni blok) + kontekst 1.6×
- **R**: 12 ciljanih 4× izrezkov za nasprotujoča si branja; **R2**: 12 super-zoom 6× izrezkov za dvomljive glife
- crops gitignored, regenerabilni; 40 izrezkov skupaj

### 2. Registriran inventar: `atlas-1825/a01-building-inventory-1825.json` (build-pass4.py)

**24 objektov v65** (glifna pozicija = nova referenčna plast) + **56 prior-only** (val 52–56 izlušek, ohranjen) + **8 rdečih glif** (parcelna plast):

- **18 objektov z BP glifo**: 24, 42(2× kandidat), 52, 55, 56, 71, 79, 82, 86, 87, 88, 89, 91, 93, 94, 98, 100 — po plasteh zaupanja: **8 CLEAR** (24, 56, 71, 82, 86, 89, 91, 94, 98), **5 PROBABLE** (52, 55, 79, 93, 100), **4 CANDIDATE** (42a, 42b, 87, 88), **1 UNREADABLE**, 2 UNRESOLVED (brez BP: {34|61|51}, {72|73|78|79})
- **6 objektov brez glife** — vključno z **največjo zidano stavbo na celem listu (Žolant, ~1995,2144) = NEoznačena** — "ni identificirano" ≠ "ni obstajalo" (§7); + točkovni simbol ob "Pod Grüblani" (tip UNRESOLVED: kapelica/deszkak/vodnjak?)
- **BP pokritost 1–100**: 18 LOCATED_V65 + 43 LOCATED_PRIOR_ONLY (nepotrjeno, ne izpodbito) + **39 NOT_LOCATED** z izrecno razlago (drobne gospodarske stavbe / glife pod ločljivostjo — NI dokaz neobstojа)
- vsak objekt: px + lat/lng (isti provizorni georef kot prior: 1 sidro, ±200–500 m), building_type (dwelling/outbuilding/unclassified/complex_unidentified), footprint opomba, related_houses iz hišnega registra, val57 matrica, **PUA parcelni preverek**, verdict_vs_prior + px_prior + delta, source_crops

### 3. KG v1.2: MAP_OBJECT plast živa (RG-001 → PARTIAL)

- **+24 MAP_OBJECT vozlišč** (`MO:MO-A01-001…024`), **+24 DEPICTED_ON → SRC-A01**, **+18 CORRESPONDS_TO_BP → BP:xxx** (claim-first: vsak z claimom C-xxxxx, source SRC-A01 + crops + raster_px; hišne veze NISO duplirane — tečejo prek obstoječih BP_BOUND_TO_HOUSE)
- **veriga §6 deluje end-to-end**: `MO:MO-A01-002 (BP 94) → BP:094 → HOUSE:H-040` → vac_details_url
- **KG-F03 (RESOLVED-V65)**: px pozicije val 52–56 so sistematično odmaknjene od glif (delta 28–224 px = 60–490 m @2,19 m/px); glife pri prior pozicijah niso berljive @4–6× → v65 glifna plast = nova referenca; **px_prior ohranjen vsakemu objektu (nič prepisano)**
- **KG-F04 (OPEN)**: ključni prostori — temne glife na stavbah (BP, PT "Protocoll der **Bau Parcellen**") obstajajo hkrati kot PUA sec I/II parcelne številke z house_refs, ki so **holdingi** (glifa 94: PUA house_refs [47] vs PT p7 hiša 40) — "Nro. in der Mappe" = številka stavbne parcele; house_refs ≠ hišna številka. Rešitev: re-read PT p7 @300dpi (ob kvoti)
- counts: **3.299 nodes / 3.556 edges / 618 claims / 8 gaps / 4 story atoms / 0 invariant-kršitev**

### 4. API + QA

- Evidence API samodejno vidi v1.2 (piše builder runtime kopijo); **api-smoke +2 preverka = 53/53** (MO:MO-A01-002 dokazna veriga + search MAP_OBJECT po building_type)
- `tests/atlas-1825-a01-buildings.test.ts` — **10 testov** (številke, px znotraj rasterja + virski izrezek vsak objekt, BP 94 varovalke z delta 106/30, novi BP glifi 24/91/87/88, UNIDENTIFIED Žolant + NOT_LOCATED semantika, PUA preverek 94→[47] in 1459 sec II cesta, F-A01-01..06 + 4 negativne najdbe, dvomljivosti ostajajo: {34|61|51} brez BP, 93 "3|8"; KG integracija: 24/24/18, veriga do H-040, RG-001 PARTIAL, coverage map_objects 67)
- posodobljena pričakovanja: KG test (v1.2, 4 findings, MAP_OBJECT 24 + RG-001 PARTIAL), evidence API test (v1.2 + KG-F03/F04)
- **suite 259/259 · tsc čist · lint čist · api-smoke 53/53 (živi :3001)**

## Najdbe (F-A01-01…06 + NF-A01-01…04)

| ID | Vsebina | Status |
|----|---------|--------|
| F-A01-01 | prior px (val 52–56) sistematično odmaknjeni od glif (60–490 m); v65 glifna plast nadomesti, px_prior ohranjen | RESOLVED-V65 |
| F-A01-02 | BP številke = številke stavbnih parcel; PUA house_refs = holdingi, ne hišne številke — dva ključna prostora | OPEN → PT p7 re-read |
| F-A01-03 | novi BP glifi: **24 CLEAR** (edini iz 1–29!), **91 CLEAR**, 87+88 CANDIDATE — 56 → 60 pozicij | RESOLVED-V65 |
| F-A01-04 | Žolant: največja zidana stavba lista NEoznačena; nizke rdeče številke 20–60 = njive | OPEN → višji dpi / PZ |
| F-A01-05 | rdeče 4-mestne glife = ceste kot parcele (**1459** PUA sec II, houses 28/66) | RESOLVED-V65 |
| F-A01-06 | kandidat "27|21" (1861,2020): nizka številka v vasi — semantika nejasna | OPEN → višji dpi |
| NF-A01-01 | ni simbolov cerkve/kapelice/gostilne/križa (2 prehoda + val 42 soglasje) | negativna |
| NF-A01-02 | "stavba" na severnem robu = rob lista + trikotnik njive (preprečen lažen vnos) | negativna |
| NF-A01-03 | "grozd stavb" na jugozahodu = drevesa + rdeče njive | negativna |
| NF-A01-04 | Žolant: brez dodatnih označenih stavb @4× | negativna |

## Rdeča plast (glyph_catalog)

103, 107, 165 (vrtovi), **159|169** (prizidki pri 94 — @6× "169", PUA houses 24/28/32/42), **1459** (cesta!, PUA sec II), "926|" (njiva V — UNRESOLVED), 65 (ob cestišču). PUA preverek 8/8.

## Methodološke opombe

- **Barva plasteba glif (temna vs rdeča) je prebrana iz JPEG @4–6×** — temna/rdečkasta ločitev je predbitna; v registru je zapisana kot `glyph_layer` z izrecno opombo, ne kot interpretacijska trditev. F-A01-02 ključni prostori ostanejo OPEN dokler PT p7 re-read ne razreši.
- Vsaka dvomljiva vrednost je ostala dvomljiva ({34|61|51} se je celo sestavilo iz treh različnih branj med prehodi — zapisano kot EN objekt z UNRESOLVED, ne trije BP-ji).
- Pozicije = glife (ne centroidi stavb); konvencija dokumentirana v `method.position_convention`.

## Žetoni/kvote

- VLM 429 (7.×) — val je brez VLM klicev po instrumentu vala 61
- web-search/blob ni bil potreben; ves material lokalni (raster val 42)

## Naslednje

1. **Ob kvoti**: PS p56–143 (aplikacija tudi API vir) + PT p7 re-read @300dpi (KG-F01 + KG-F04 + KG-F01/RG-008)
2. **PASS 4b**: A02–A05 isti 2-prehodni protokol (zunanji objekti, Traverne A05)
3. **PASS 5**: map data model (§15) — zemljevid kot podatkovni sloj (UIEvidence Explorer)
4. izven peskovnika: šolski list / SA Podzemelj / SI AS 749 / Zucchelli NR-10
