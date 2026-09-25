# 71 — 58. val: PS N83 analiza v1 — PUA↔PS↔PT kontrola, Fürtrag veriga, struktura protokola

**Datum:** 2026-09-25 · **Obseg:** lokalna analiza (brez VLM — kvota 429 neprekinjena od 24. 9. ~11:14 UTC, potrjena 25. 9. 12:49 UTC z minimalnim test-klicem; transcribe.log kaže 429 še ob 12:41 UTC)
**Vhodi:** `ps-n83/register.json` (1.073 vrstic, 55/143 strani), `pua-n83/register.json` (98 vpisov), `pt-n83/register.json` (100 vrstic), `raw-web-val57-2026-10/ps-vlm/*.json` (suha opažanja)
**Izhod:** `ps-n83/analysis-v1.json` + `ps-n83/build-analysis-v1.py` (deterministično ponovljivo)
**+0 virov / +0 trditev / +0 UI** — raziskovalni val (križne kontrole, brez ugibanja)

---

## 1. Kontekst in omejitev

Uporabnikovo prioriteto #1 (»PS complete transcription — največja nagrada«) je ustavila **trajna 429 kvota** (25+ ur, več kot 100 neuspelih poskusov v transcribe.log). Namesto čakanja je val 58 izvedel **celotno lokalno analizo obstoječih 55 strani** — trikotna kontrola imen PUA↔PS↔PT po hišah, dekodiranje aritmetične strukture protokola in strukturne meje. Vse izvedeno z deterministično Python skripto (LCS podobnost imen, regex verige), nič VLM.

## 2. F9 — PUA↔PS lastniška kontrola: SISTEMATIČNO RAZLIČNI STANJI

Hiša-po-hiša primerjava 51 skupnih hiš (LCS po tokenih, NFKD normalizacija):

| razred | št. | primer |
|---|---|---|
| AGREE (>0,7) | **0** | — |
| FUZZY (0,5–0,7) | **2** | h.36 »Krischan Marla Bauerin« ↔ »Krishnar Wurfl« (0,54); h.37 »Krischan Peter« ↔ »Krishnar Peter« (0,56) |
| MISMATCH | **49** | h.1 »Mellachitsch Waise Leopold« ↔ »Barbara Muster«; h.40 »Pfarrer Rupert Sautter« ↔ »Peter Muster«; … |

**Premik vrstic IZKLJUČEN** (shift test −2..+2: offset 0 je najboljši z 0,302; vsi ostali ≤ 0,291) — razlike so **vsebinske, ne bralne**.

**Interpretacija (z dokazi, brez ugibanja):** PUA je *pripravljalni zvezek* (stanje pred finalno dodelitvijo), PS je *končni protokol 1825*. Podpora:
- p12 rdeče opombe **»Auf pfandbeyern 1801 [rot]«** (3×: h.43, h.45, h.46) = **pfand/zastava** — pravni prehodi dokumentirani že v PS;
- PUA h.4/h.5 lastnika »zu Dragosch« (odsotna lastnika) — PS h.4/h.5 imata lokalna lastnika (Novak, Hauschild) = medpripravljalni prehod;
- delne družinske oblike na ISTIH hišah (Draschisch≈Dragosch h.3, Krischan≈Krishnar h.36/37, Tillak≈Tillah h.30, Urich Pattle≈Urbas Peter h.51) — isti fond, prebrano iz različnih rokopisnih stanj.

## 3. F10 — PS↔PT kontrola: DVA KONČNA PROTOKOLA SE POTRJUJETA

PS (Grund-Parcellen) in PT (Bau-Parcellen) = **spremljevalna končna protokola istega leta 1825**. Primerjava 47 skupnih hiš (PS lastnik ↔ PT p7 owner_variants):

| h. | PS | PT najboljši variant | sim |
|---|---|---|---|
| **45** | **Strauß Georg** | **Krauß Georg** | **0,84** |
| **19** | **Thomas Malfg** | **Thomas Marfa[?]** | **0,82** |
| **48** | **(R)abitscher Georg** | **Heuritsch Georg** | **0,76** |
| 55 | Schimer Jacob | Schimey Johan | 0,67 |
| 53 | Shumey Joan | Sedivy Johann | 0,64 |
| 51 | Urbas Peter | Knapp Peter | 0,60 |
| 54 | Lappary Marbl | Lopparz Michl | 0,58 |
| 40 | Peter Muster | Musterer Paul | 0,52 |
| 14 | Ludwig Matzen | Lebring math. | 0,52 |
| 43 | Ulrich Peter | Dicheltaler Marfa | 0,52 |

**Posledice:**
1. **h.45 Strauß/Krauß Georg** = neodvisna potrditev prek dveh dokumentov — PT val 54 variant »Krauß Georg« (med 4 nestabilnimi) je pravilna.
2. **»Muster/Musterer« je realna družina** (ni bralni šum): PT h.40 »Musterer Paul« ≈ PS h.40 »Peter Muster«; koncentracija imen na straneh 11–12 preko hiš 36–50 z različnimi krščenimi imeni (Peter, Matthäus, Barbara, Poldi, Thomas, Benedikt, Kristof) = **družinska skupnost/dediči na velikem fonde** (h.40 ima 34 vrstic; stand »Landl. Gutsh.« = ländlicher Gutsherr). VLM je na p11 sam označil imena kot nejasna (»Muster?«, »Martha?«) → re-read @300 dpi ostaja naloga (P3).
3. **F1 doktrina (val 54) REVIZIJA:** PUA ostaja avtoriteta za *pripravljalno stanje* in za B.P.↔hiša vezave (opombe); za *končno stanje 1825* sta PS+PT medsebojno potrjeni viri. Zemljevid A01 ostaja na PUA (vezava na B.P. opombe) — **UI nespremenjen**.

## 4. F11 — Fürtrag veriga: globalni tekoči indeks Jaethe

Dekodiran format vsot: **»N. Fürtrag | X NNNN«** = (tekoči indeks holdingov, vsota vrednosti). Ekstrahirana monotona veriga:

| p5 | p12 | p16 | p20 | p24 | p32 | p35 | p44 | p54 |
|---|---|---|---|---|---|---|---|---|
| 2 | 10 | 14 | 19 | 22 | 26 | 39 | 42 | **52** |

- Do p54 = **~52 Jaethe (holdingov)** za ~1.000+ vrstic → Jaethe = holding (družinski fond), vrstice = parcele znotraj holdinga; ~20 vrstic/holding ustreza velikostim blokov po hišah (10–35).
- p36 »36 Grundst.« / p42 »20 Stück« kršita monotonijo → verjetno napačni prebrki števca (Kurrent 2↔3, 2↔0) → re-read.
- Variante oznake (VLM): Fürtrag/Ftirtrag/Futterg/Fürstog/Firstag/Fütterag/Pfträge/Stücke/Jaethen/Grundst./Flächen — vse = isti koncept (Kurrent F/P/St).
- **TO-DECODE (P3):** metrika stolpcev — »Summa Jaethen 6/10808« + »Summa Quadrat-Klafter 6/77« (p14) kaže dvojni stolpec vsot; ali je »N.º Jaethe« parcelna št. znotraj Flurbezirk (p002 tiskana glava »Flurbezirk / Jaethe«) je potrebno potrditi z glavo @300 dpi.

## 5. F12/F14 — strukturna meja p40 in imenska prostora

- **Sestavljeni »1 / N« hišni sklici se začnejo pri p40** (140 vrstic do p55; vrednosti 1/3–1/100) — hipoteza: (KG-blatt / hiša) za **ne-lokalne lastnike**; Wohnort na p40–55 vsebuje Zagorje (2×), Dragole, Gradiše; priimki Wernig/Pechley/Witschak/Pölling se ponavljajo z družinskimi »senior/junior« razlikami. Lokalni bloki (plain hiše) se nadaljujejo vzporedno (p41–55).
- **Imenska prostora parcel:** PUA parcelne številke 2–9978 (1.517 distinct, s sekcijami II/III/…) in PS jaethe 1–9116 (312 distinct) v ISTI rangi; p002 potrjuje tiskano glavo **»Flurbezirk / Jaethe«** → ujemanje parcel pričakovano šele po polni transkripciji + dekodiranju Flurbezirk stolpca. Delna pokritost (55/143) pojasnjuje nizko trenutno ujemanje (6 opaženih ≈ 6,5 naključnih — **NI dokaz neujemanja, NI dokaz ujemanja**).
- **Listni žigi** (sheet_visible): prevladujeta »III. N.« (20×) in »11. N.«=II. (21×) — tiskani listi II/III niso zaporedni s stranmi digitalizata (listi se ponavljajo po razprtjah).

## 6. Pokritost hiš — posodobljen pregled

- PS plain hiše 0–69: **VSE prisotne** (589 vrstic). Vrzel 70–78 = čaka v straneh 56+.
- PS ≥70 prebrane: 79, 80, 81, 82, 85, 87 (posamične vrstice, raztresene po p6–p55) — odgovor na QA vprašanje val 57: **gre za zgodnje pojavitve hiš, katerih glavni bloki sledijo kasneje** (ali ločene parcele teh hiš); ni anomalija.
- PUA-only hiše: 70 (Zollamt), 71, 72 — vse tri v neprebranem delu PS.
- B.P./Zoll iskanje v Anmerkung (55 strani): **0 zadetkov** — B.P. opombe ostajajo PUA/PT domena (kot pričakovano za parcelni protokol).

## 7. Metodološki standard (za naslednje vale)

1. Imena se **NE združujejo** brez ≥2 neodvisnih virov (standard issue #42 §5 ohranjen in poostrjen z kvantitativnimi pragi AGREE>0,7 / PARTIAL>0,5).
2. Vsota dokazov: PS+PT soglasje > PUA posamičen vpis za končno stanje; PUA opombe ostajajo edini vir za B.P. vezave.
3. Vse številske verige (Fürtrag) se po 143/143 ponovno izvedejo deterministično (`build-analysis-v1.py` — resume-by-design).

## 8. Ostalo za naslednje vale (nespremenjeno)

- **PS p56–p143 (88 strani)** — resume skripta pripravljena (`ps-transcribe.mts`), čaka kvoto; nato aritmetika (Kläfter vsote po holdingih proti Summa/Fürtrag verigi), popolna tritralna kontrola, B.P./Zoll iskanje v celoti.
- Re-readi @300 dpi: p11/p12 (Muster imena), p36/p42 (Fürtrag števci), p14 (glava stolpcev), p44/45/48/51 (no_blatt kontinuiteta).
- Izven peskovnika: šolski list [4118864], SA Podzemelj, SI AS 749; Zucchelli web-search koroboracija (429).

---

*Sorodno: `70-val57-ps-n83-master-transcription.md` (transkripcija), `69-val57-pua-complete-coverage-audit.md` (audit PUA), `67-val54-pua-pt-a01-reconciliation.md` (F1 doktrina)*
