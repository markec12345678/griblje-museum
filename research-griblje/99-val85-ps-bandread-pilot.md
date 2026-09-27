# 99 — 85. val: PS N83 PASOVNI/ZOOM re-read s kolonskimi sidri — PILOT (vzorec val 80/81)

**Datum:** 2026-09-27 · **Obseg:** PS N83 (SI AS 176/N/N83/s/PS, VAČ docid 41780 / uodid 373415) — vzorec 8 strani iz p56–143
**Nadaljevanje:** val 84 `next_reads` #1 / val 82 §8 #1 — *»PS p56–143 neodvisen re-read (2. prehod)«* — pilot rešitvene poti za NR-14/F-PV-04
**+0 virov / +0 trditev / +0 KG (v1.9, sha 526482d2) / +0 UI** — metodološki pilot (meritve + sodbe; per-parcelne trditve ostajajo NIČ po §4)

---

## 1. Kontekst

PS p56–143 je prepisan v enojnem nativnem prehodu (val 82, `v82-native-pass1`) in neodvisno re-bran 2× (val 83: struktura ≈, numerika ≥ 92 %), vendar ostajajo **imena, kultur, jaethe/klafter in Fürtrag PROVISIONAL** (F-PV-04/NR-14): celostranski nativni skeni (~1274×1024) imajo glife pretesne za zanesljivo razlikovanje stolpcev *N.º Jaethe* vs *Quad. Kläfter* in dvovrstičnih kultur opisov. Val 80/81 je na PZ dokazal, da **pasovni/zoom izrezki s kolonskimi sidri** rešijo točno ta problem — odprto vprašanje vala 85: ali shema prenese na **pokrajinske** PS strani (dvostranski tisk, prepog blizu W/2)?

## 2. Metoda — pilot na determinističnem vzorcu

- **Vzorec (iz comittanega `reread-v83/comparison.json`, nič ročnega):** kvantili `full_agree/rows1` po straneh (0/25/50/75/100) + p98 (F-PV-03 Reb) + p121 (QKlft anomalija »J=1725«) + p59 (najslabše ime soglasje pass1↔pass2) = **[58, 59, 84, 98, 109, 121, 133, 143]**
- **Faza A — horizontalni pasovi** (shema VERBATIM val 80/81): 4 pasovi/stran (h=328, korak=298, 30 px preklop), različica `norm` (nativni piksli + normalizacija kontrasta) = **32 VLM klicev**; prompt brez NIČesar iz pass1/pass2 (neodvisen 3. bralec) + band pravila (row_cut, [angeschnitten], [rot], [?], ditto `~`)
- **Faza R — kolonski trakovi**: 2 trakova/stran (name: hiša+ime+stand+wohnort ≈ 0,27–0,46·W; kultur: kultur+jaethe+klafter ≈ 0,53–0,73·W), celotna višina, **x2.5 lanczos**, x0/x1 = **izmerjena vertikalna pravila** (profi temnosti → detekcija pravil, toleranca ±4 % W, fail-fast) = **14 klicev** (p143 izpuščen — rdeči povzetek brez vrstic)
- **Avtorski odtis (neodvisen 1. bralec):** 32 pasov PRED fazo A + 14 trakov PRED fazo R (`author-notes.json`) — fokus na šibka polja val 83; nejasno = `[?]`, prazno = nič
- **Skupaj 46 VLM klicev, 0 trajnih napak, 0 × 429** (log: `raw-web-val85-2026-10/bandread-v85.log`)

## 3. Verdikt pilota (merjeno, nič ugibanja)

### 3a. Horizontalni pasovi — NESTABILNO, za PS tabele zavrgljeni

| mera | vrednost |
|---|---|
| vrstice pass1 / pass2 (vzorec, 8 strani) | 144 / 144 |
| vrstice iz zlityh pasov (`rows_band_merged`) | **172** |
| strani z popolno sekvenčno poravnavo | **0 / 8** |
| no_blatt ujemenja (zip) | 6 / 143 |

VLM **razbija vrstice na reznih robovih pasov** (rezana zgornja/spodnja polovica vrstice preživi kot samostojna »vrstica«; ditto oznake brez bločnega konteksta). Pasovni prompt val 80/81 je na PZ portretnih straneh deloval, na pokrajinskih PS dvojstraneh ne — struktura je v tej obliki neuporabna (`compare-v85.json`).

### 3b. Kolonski trakovi — STABILNO in J↔K REŠENO

| stran | trak (name/kultur) | rows1 |
|---|---|---|
| p58 | 21 / 21 | 19 |
| p59 | 20 / 20 | 21 |
| p84 | 20 / 20 | 21 |
| p98 | 20 / 20 | 20 |
| p109 | 20 / 20 | 20 |
| p121 | 20 / 20 | 20 |
| p133 | 16 / 16 | 20 (posebna sekcija — F15) |

±1–2 od realnega števila vrstic (p133 odstopanje = posebna sekcija brez osebnih imen, ne napaka metode); **stolpčna dodelitev Jaethe↔Klafter rešena z izmerjenimi sidri**; tretji glas (trak) na 140 poravnanih vrsticah: 475× podpira enega izmed pass-bralcev, 212× je prazen (ni trditve), 36× izbere p1/p2 (`tiebreak_3rd_voice`, `compare-strips-v85.json`). **Slabost:** x2.5 trak (550×2560) API downscale-ira → glife slabše kot na pasovih (imena/kultur na traku kvalitativno slabša od pasov).

### 3c. Naslednja iteracija

**KOLONSKI TILE-i (val 86):** stolpčna skupina (name; kultur+Flächen) × **pasovna višina h=328 @nativno + x2** — hibrid: strukturna stabilnost kolonskih trakov + glifna kvaliteta nativnih pasov; sidra že izmerjena (`crops-manifest-v85.json`, comittano).

## 4. Najdbe

### F-PV-05 — NOVA NAJDBA (val 85): sistemski pomik J→K v celostranskem prepisu

Na 140 poravnanih vrsticah vzorca z enotno numerično vrednostjo:

| mera | pass1 (v82) | pass2 (v83) | kolonski trak (v85) |
|---|---|---|---|
| enotna vrednost v **JAETHE** polju | 98/140 = 70,0 % | 111/140 = 79,3 % | **0/140 = 0,0 %** |
| samo **KLAFTER** | 19,3 % | 2,9 % | **85,0 %** |
| izrecno J **in** K | 13 | 6 | 21 |

Fizikalno (avtorski odtis pravila J|K na trakovih p058/p084/p098) so enotne vrednosti pisane v **stolpcu Quad. Kläfter** — oba celostranska prehoda (val 82/83) ju sistemsko vpisujeta v polje jaethe. **Soglasji val 83 (jaethe 71,9 %, klafter 68,4 %) sta soglasji na skupno napačni dodelitvi**, ne na resnici. »Sane« pravilo QKlft val 83 (p121) se generalizira: pisar piše samo Klafter, razen izrecnih »N J« vrst. Implikacija: register.json p56–143 jaethe/klafter so PROVISIONAL tudi po 2 prehodih — per-parcelna uporaba brez kolonske korekcije NEVELJAVNA (okrepa NR-14).

### F-PV-04 — REŠITVENA POT VALIDIRANA-V85 (pilot)

Kolonski tile-i, ne horizontalni pasovi: pasovi strukturno nestabilni (172 vs 144), trakovi stabilni (±1–2) in rešujejo J↔K; tile-i so naslednja iteracija.

### F-PV-03 — OPEN (pilot NI dvignil na 2×)

p98: pasovni VLM **tretjič** dokazano skrajša kultur (1/22 Reb/Weing omemb — prej val 82 odtis + val 80 PZ analogija); avtorski trak odtis kaže dvostropične opise z Weing na vseh ~20 vrstah `[?]`. Kvantitativna uskladitev s PV (7 J 665 K) čaka kolonske tile-e.

### F11 — DELNO POTRJENO-V85: Fürtrag veriga na vzorcu (pasovi + trakovi + avtor, soglasje ≥ 2 kjer obstaja)

p58 = 56. Fürtrag 6 J 1009 (+rdeče 1306) · p59 = 57. F. 9 J 1085 (+rdeče 762) · p84 = 92. F. 7 J 1135 (→rdeče 636) · p98 = 96. F. 11 J 835 · p109 = 109. F. 10 J 1056 · p121 = **119. F. 17 J 266 (→rdeče 12 1046)** · p133 = 137. F. 7 J 934 (→rdeče 5 1311). Monotona kontrola proti 13-točkovni verigi val 61 čaka val 86.

**qklft_anomalija razrešena na ravni branja:** val 83 »J=1725« (p121) = dejansko »**17 J 266**« z rdečo korekturo »12 1046« — na traku vidno, sane pravilo potrjeno.

### F15 — REPRODUCIRANO-V85

p133 = posebna sekcija brez osebnih imen (kolonska branja: trak »Waldung«[?] vs avtor »Weg«[?] — vsebina REVIEW); no_blatt = Uebersetzung zaporedje 2661+; rimski oznaki IV/V v no_blatt.

## 5. Vgradnja — NIČ (pošteno)

- **register.json NESPREMENJEN** (2.871 vrstic, `reading_pass: v82-native-pass1`) — korekcija J→K in imena/kultur pride na izvor šele s kolonskim re-readom (val 86); per-parcelne trditve ostajajo **NIČ** (§4)
- **§22 kaskada NE-BEŽI**: KG v1.9 (sha 526482d2) / story-graph / timeline / coverage report NESPREMENJENI — to je metodološki val, ki **določa pravilno rešitveno pot** in preprečuje, da bi se 2 soglasja na napačni dodelitvi povznesla v trditve

## 6. Surovine in artefakti

- `raw-web-val85-2026-10/` — make-bands-v85.mts (pasovi + merjenje kolonskih sider), make-zooms-v85.mts (kolonski trakovi x2.5), bandread-v85.mts (VLM fazi A/R), crops-manifest-v85.json (pasovi + **izmerjena sidra**), zoom-manifest-v85.json, author-notes.json (avtorski odtis), vlm/ 46 JSON + 46 RAW; crops-v85/ (88 MB) regenerabilno — gitignored
- `ps-n83/build-compare-v85.py` → `band-v85/compare-v85.json` (pasovi: 3-glasovna poravnava)
- `ps-n83/build-compare-strips-v85.py` → `band-v85/compare-strips-v85.json` (trakovi: tretji glas)
- `ps-n83/build-analysis-v5.py` → `analysis-v5.json` (determinističen, fail-fast guardi; re-run byte-identno: sha256 5c37484d…)

## 7. QA

- testi: **547 pass / 11 skip / 0 fail** — od tega novi `tests/val85-bandread-pilot.test.ts` (varovalke: verdikti pasovi/trakovi, F-PV-05 meritve, F11 veriga + qklft anomalija, F-PV-04 status, determinističen vzorec, artefakti + gitignore, §22 nespremenjenost KG/register)
- tsc čist · lint čist · verify-i18n 1074×5 zeleno
- api-smoke: ni potreben (ni sprememb v src/; runtime artefakti NESPREMENJENI — §22)

## 8. Naslednje

1. **val 86 — KOLONSKI TILE-i p56–143:** stolpčna skupina (name; kultur+Flächen) × pasovna višina h=328 @nativno+x2, sidra iz `crops-manifest-v85.json`; vgradnja J→K korekcije (F-PV-05) + imena/kultur s soglasjem ≥ 2 → takrat šele register p56–143 2. prehod + KG SRC-PS posodobitev (§22 kaskada)
2. Fürtrag monotona kontrola (F11) po val 86
3. PZ p48–65 2. prehod (protokoli + Zusammenstellung A/B — p65 REVIEW)
4. PT p7 @300dpi (KG-F01/F04); PR Grenz-Beschreibung (F-PZ-05)
5. izven peskovnika: zunanji Rektifikacijski protokol (F-PZ-04 Δ 3 J), šolski list / SA Podzemelj / SI AS 749 / Zucchelli
