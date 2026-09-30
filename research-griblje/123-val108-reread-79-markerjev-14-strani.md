# 123 — 108. val: ISSUE #42 §4/§14 + #43 — RE-READ 79 FRESH MARKERJEV, RAZŠIRJENO NA POLN PREGLED 14 STRANI (p95–137) — ODKRITJE SISTEMSKEGA P1 OFF-BY-ONE + COL-SPLIT SPOJEV (instrument val 61/88, 0 VLM klicev)

**Datum:** 2026-09-29 · **Obseg:** re-read 79 FRESH review markerjev (56 digit-split + 14 col-split val 107 + 7+2 val 98) razširjen na **poln pregled 14 strani** (p95, 98, 105, 107, 113, 114, 120, 128, 129, 130, 133, 135, 136, 137; ~280 vrstic) · **metoda:** agentov vid (1:1 val 88 — pagebands ×2.4, sheets ×3, ×6/×9/×12 celice, hišno/no_blatt identifikacija, QA proti p1/p2/tile trojcu) · **0 VLM klicev, 0 spletnega iskanja**

---

## 1. ODKRITJE (najpomembnejši finding vala)

Kontrola p98 (listi B + ×9 celice + pikseljska preverba) je pokazala, da **P1 (val 82) od r5 naprej SISTEMSKO bere off-by-one**: vrednosti so v viru pisane **NIZKO v celici** (tik nad spodnjo mejo), P1 pa jih je pripisal **vrstici NAD mejo** → REG r_j nosi vrednost fizične r_(j+1). Dokazi: hišno/no_blatt identifikacija (hiše v REG so pravilne!), Fürtrag kot posebna vrstica (REG r19 = 11|835 je Fürtrag, ne hiša 27), direktni vid r10/r11 (1188 = hiša 25, 558 = hiša 26). Poleg tega col-split spoji (p105 r3: 9|902 → "1922"; p105 r16/r17/r19: 1|60 → 1160, 1|149 → 1149, 1|264 → 1126; p107 r3: 1|206/1206...) in posamezne halucinacije (p95 r0 "2379", r5 "242"; p114 r1 "7207").

## 2. METODA

- `make-pagebands-v108.py` (59 pasovnih slik, cela širina, L-črte + oznake vrstic) — sistematično branje po straneh
- `make-sheets-v108.py` (79 listov, cilj ±1 vrstica, x 620–1005 ×3) + `make-sheetsB-v108.py` (celoširinski, owner identifikacija ×2) + `make-target-crops-v108.py` (strip ×8 + tile ×4)
- identifikacija ciljne vrstice **prek owner kolone** (hiša + ime — neodvisno od številk, ker so hiše v REG pravilne); QA: vsak glas preverjen proti p1/p2/tile_diag; dvomi ×9/×12; **nič ugibanja — dvomi zapisani v note**
- ladder tipi per page razrešeni (p95/105/107/120 tip "lad[0]=spodnja meja r0" vs p98/113/114/128/129/130/133/136/137 tip "zgornja meja") — pikseljsko/visualno potrjeno

## 3. VGRADNJA (`build-register-v108.py`)

- **200 vrstic prebranih na 14 straneh: 52 soglasij (REG ✓, samo markerji) + 148 POPRAVKOV** s snimkami `jaethe_pre_v108`/`klafter_pre_v108` + `jk_review := v108-re-read`
- [gestrichen rot] markerji v anmerkung za rdeče prečrtane vrednosti (p105 celotna stran + posamezne)
- v88 (139 vrstic) **nedotaknjeno**; p1–55 + p143 nedotaknjeno; fail-fast: changes file guard
- primeri popravkov: p95 r0 2379→1919 (halucinacija), r3 1723→1122, r5 242→782, r6 1141→1146; p98 r5–r19 (sistemski off-by-one, 15 vrstic); p105 r3 j=2|k=865, r16 1160→1|60, r17 1149|→1|149, r19 1126→1|264; p113 r1 1021→421, r17 1247|→1|247; p114 r1 7207→961, r7 516|→6|526, r19 600|→18|239; p120 r0 7344|→1|293, r4 1253|→9|80, r15 1|1234→1|1364; p128 r4 1001|→100, r7 419|→1119, r17 082|→843; p129 r16 490|→272, r17 199|→149, r20 83→85; p133 r10 "1.499/1.517"→100, r11 1.175|→1|499; p135 r13 1114|→114, r20 1879|→8|473; p136 r4 1699|→920, r17 1008|→1|80; p137 r3 459|→786, r10 220|→1590, r17 1970→100, r18 1857→1|226

## 4. KASKADA (register → pass3 → KG → story → timeline → coverage)

- **PS parcele 779 → 735** (F-PV-05 na izvoru; None 92→76, UNKNOWN 249→221, njiva 294→295, gozd 15→14; mapping EXACT 427 / TERM-UNCLEAR 221 / EXACT-MIXED 11 / None 76)
- **KG v2.4 (8f803952)**: PARCEL 2.770 / HAS_PARCEL 3.072 / vozlišča 3.612 / vezi 3.776 / claims 622 / invariante 0 + **nov finding KG-F13 (RESOLVED-V108)** — dokumentira odkritje in obseg
- story/timeline (I6: PUA 2035 / PS 735 / raba 438+221 ✓)/coverage (PASS 8, §24 14/14) — runtime kopije src/data (4, ena izhodna resnica)
- **F11**: 9 kršitev monotonosti (nespremenjeno), veznost p54=52→p58=56 OK, 3-glas REVIEW 52 strani, aritmetika 0/79/9, sidra 3/7 — REVIEW raven (NR-14)
- c4-metrika: K9 jaethe_plain_100_1599 p56–143 120→49 (vsotno NEUTRALNA); K10 gt1599 70→60, jk_format 7→6

## 5. ŠTEVCI + POŠTENOST

- +0 zapisov / +0 virov / +0 identitet — **114/652/528/69 nespremenjeno**; ATLAS §22 pogodba spoštovana (kg_sha256 spremenjen → kaskada); veriga #100 §8 neizmenjana
- per-parcelne trditve ostajajo **PROVISIONAL** (F-PV-04/NR-14); noben popravek ne dvigne evidence statusa
- ostanki: p142-t-kultur2 (trdo 429, resumable); poln re-read p1–55 + p143 (ništa markerjev, vseeno lasten val); F11/F-PV-03 odprta

## 6. TESTI + ARTIFAKTI

- +18 varovalk (`tests/val108-re-read-79.test.ts`) + izrecen prehod pinov v ~30 testnih datotekah (register 1.755 v86, v108-re-read 148, parcele 779→735, KG 2.770/3.072/3.612/3.776, sha 23a2ae50→b3c038c1→8f803952, R-03795→R-03776, K9 120→49, K10 70→60/7→6, PARTIAL 1454→1410, NONE 2127→2111)
- **960 testov: 949 pass / 11 skip / 0 fail**; tsc čist
- artefakti: band-v108/ (targets, slots, rowcrops/sheets/sheetsB/pagebands indeksi, reading-v108, register-v108-changes, ink-v108); skripte build-targets/align-slots/make-rowcrops/make-sheets/make-sheetsB/make-target-crops/make-pagebands/build-inkscan/build-register-v108
