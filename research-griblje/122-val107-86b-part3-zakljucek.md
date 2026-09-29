# 122 — 107. val: ISSUE #42 §4/§14 + #43 — 86b DEL 3 (ZAKLJUČEK): PS N83 KOLONSKI TILE-i p110–120 + p122–141 (31 NOVIH STRANI, +646 VRSTIC → 1.755) + VGRADNJA 1:1 PRAVIL VAL 86/98 + KASKADA KG v2.3

**Datum:** 2026-09-29 · **Obseg:** preostalih 250 tile-ov 3. glasu (p110–142) prebranih v resumable koščkih prek `tile-read-v98.mts` — **249/696 prebranih skupaj (99,9 %)**; edini manjkajoči tile = `p142-t-kultur2` (trdo 429, resumable za naslednji val); **fail-fast page pravilo**: p142 (1 tile manjka) ostaja `v82-native-pass1`, nikoli delna arbitraža
**Vgradnja:** `build-register-v107.py` (nov, determinističen, fail-fast; pravila 1:1 `build-register-v86b.py`): **+646 vrstic `v86-colonial-tiles` na p110–120 + p122–141 (1.109 → 1.755 od 2.871)** · **PS parcele 898 → 779** (F-PV-05 korekcije premaknejo vrednosti iz Jaethe v Kläfter; None 104 → 92) — izrecen, testno voden prehod · **KG v2.3 (23a2ae50) + KG-F12** · kaskada story/timeline (I6 PS 779, raba 438+249)/coverage · **+0 zapisov / +0 virov / +0 identitet muzejske zbirke — 114/652/528/69 nespremenjeno** · 14 novih varovalk (tests/val107)

---

## 1. Kontekst

Val 98 (86b del 2) je pokril p95–109 (55/87 strani) in za sabo pustil ~250 tile-ov na p110–142 (resumable, »trdo 429«). Valovi 99–106 so te tile-e pustili ob strani (kvota/429 stena, AI-neodvisni vali). Ta val je izvedel **86b del 3**: branje preostalih tile-ov v koščkih + vgradnja + polna kaskada. To je **zadnji večji sklop 2. prehoda kolonskih tile-ov** — po tej vgradnji je vir resnice za jaethe/klafter (F-PV-05) na 86 od 87 strani p56–142 (p143 = rdeči povzetek, precedens val 85 faza R; p142 = 1 tile čaka).

## 2. Metoda

- **Branja:** resumable instrument `tile-read-v98.mts` (nedotaknjen — test varovalka referencira izvorno datoteko); kos za kosom (~9 min okvir), 2 delavca, pace 500 ms; identični promti/pravila kot val 86/98 (3. glas, kolonski tile-i z glavo).
- **Kvota:** značilna dinamika tega vala — kapljanje (mešanica OK in 429 zadržkov), skupno ~12 kosov v ~100 min; 249. tile zadnji uspešen ~19:00 UTC, nato trda 429 stena na zadnjem tile-u `p142-t-kultur2` (7 poskusov + 2 ločena poskusna klica — vse 429). Pokritost **695/696 (99,86 %)**.
- **Reparacija 2 ERROR datotek:** `p113-t-kultur0` in `p126-t-kultur0` — VLM je vrnil veljaven JSON z **literanimi novimi vrsticami znotraj stringov** (namesto `\n` escape), kar `JSON.parse` zavrne (»Unterminated string«). Popravek **determinističen, brez novih VLM klicev**: čistilnik `.raw` (odstranitev ``` ograj) + stanjski stroj, ki ubeži literale `\n`/`\r`/`\t` znotraj JSON stringov → obe datoteki reparerani in validirani (`p113` = 4 vrstice, `p126` = 5 vrstic; surovini `.raw` ohranjeni nespremenjeni).
- **Fail-fast page pravilo (1:1 val 86/98):** stran gre v jk vgradnjo SAMO z vsemi 4 kultur pasovi. p142 ima name tile-e (4/4), ampak **1 kultur tile manjka** → `merge_tiles('p142','kultur')` = [] → stran ostaja `v82-native-pass1` (40 vrstic), owner variante se na njej NE pišejo (nije PART1, nije new_page). Nič delne arbitraže, nič ugibanja.
- **Surovine:** `raw-web-val86-2026-10/vlm-v86/` — 695 parov `*.json` + `*.raw`; log `tile-read-v86.log` (gitignored, vzorec valov 86/98).

## 3. Rezultat vgradnje (tally dela 3, `band-v86/register-v107-changes.json`)

| pravilo | vrstic | pomen |
|---|---|---|
| `v86-tiles-jk` | **117** | p1=p2=jaethe (števke enake) + stran kvalificirana → klafter := vrednost |
| `v86-tiles-arbitrated` | **36** | razkol stolpcev p1↔p2 → page-glas (K) odloči |
| `v86-pass2-split` | **1** | p2 ima izraziti J|K par, vrednost se ujema z p1 jaethe |
| `v86-explicit-jk-kept` | 116 | izrecno N\|K — ohranjeno + marker |
| `v86-kept-k-k` | 201 | oba prehoda že Kläther |
| `v86-review-pass-digit-split` | **56** | NOVI part-1-stil markerji na p110–141 (čaka re-read vzorec val 88) |
| `v86-review-col-split` | **14** | razkol brez klafter številke |
| `v86-no-value` | 59 | brez številskih vrednosti |
| `v86-page-not-qualified` | **30** | **p141** (44 vrstic, minus 14 v drugih pravilih z lastnim markerjem) — only_j ≥ 10 % → jk vrednosti NEDOTAKNJENE (v86-page-not-qualified ne piše jk_review; brez ugibanja) |
| `alignment_short` | 16 | vrstica brez tile para (nestabilna poravnava — diagnostika) |
| owner_variant | **552** | owner_tile_v86 (skupaj 153 + 910 + 552 = **1.615**) |
| kultur_variant | **506** | kultur_tile_v86 (skupaj 637 + 259 + 506 = **1.402**) |
| digit_mismatch | **98** | flag v auditu (vrednost ostane 2-glasna) |

- **Strani p110–140**: kvalificirane (only_j < 10 %) → polna jk logika + `reading_pass := v86-colonial-tiles`.
- **Stran p141**: NE kvalificirana (only_j ≥ 10 %) → vrstice dobijo `reading_pass`, ampak **brez jk popravkov in brez snimk** (samo owner/kultur variante, ki so vrednostno neodvisne od jk).
- **Stanje registra:** 1.755 × `v86-colonial-tiles` (808 del 1 + 301 del 2 + 646 del 3) · 43 × `v82-native-pass1` (**p142** 40 + p143 3) · 1.073 brez markera (p1–55 + p143) · snimke `*_pass1_v82` na **727** popavljenih vrsticah (573 + 154) · FRESH review markerji: **56 digit-split + 14 col-split** (skupaj 70 fresh; vseh 139 v88 part-1 promoviranih, nespremenjeno).
- **v88 = vir resnice:** 137 RESOLVED + 2 UNRESOLVED vrednostno NESPREMENJENI (guard v builderju + test).
- **p1–55 + p143:** guard byte-identno (varovalka).

## 4. PS parcele: 898 → 779 (izrecen, testno voden prehod)

F-PV-05 mehanika (vzorec valov 89/98): kjer tile 3. glas pokaže, da je pisar pisal **enotne vrednosti v Quad. Kläfter**, se vrednost preseli iz Jaethe (delovanja kot parcelna številka) v Kläfter (površina) — vrstica preneha biti parcelni kandidat.

- `build-pass3.py` re-run: **779 parcel** (930 → 898 → 779) · land use: njiva 294, travnik 84, UNKNOWN 249, vrt 16, pašnik 16, gozd 15, drugo 11, dvorišče 1, vinograd 1, None 92 (brez kultur zapisa; 136 → 104 → 92).
- Mapping confidence: EXACT 427, TERM-UNCLEAR 249, EXACT-MIXED 11, None 92.
- **Timeline I6:** PUA 2035 / PS 779 / raba 438+249 ✓ (pin posodobljen, testno voden).
- **§4 poštenost:** PS parcelni statusi ostajajo `TRANSCRIBED_PROVISIONAL` (F-PV-04/NR-14 pasovni re-read še čaka); noben popravek ne dvigne evidence statusa (varovalka).

## 5. Kaskada (pravilni vrstni red: register → pass3 → KG → story → timeline → coverage)

- **KG v2.3 (sha 23a2ae50…)**: vozlišča 3.656 (PARCEL 2.814 = PUA 2.035 + PS 779), vezi 3.795 (HAS_PARCEL 3.091), claims 622, invariante 0 · **nov finding KG-F12 (RESOLVED-V107)**: meritve dela 3 + poštena omejitev (p142-t-kultur2 čaka ob kvoti) · SRC-PS coverage opomba posodobljena (86/87 strani, 1.755 vrstic, variante 1.615/1.402).
- **story-graph**: projekcija KG, 0 invariant-kršitev, story_id kaskada po §22 pogodbi (kg_sha256 spremenjen → zgodba označena kot spremenjena).
- **timeline-1825-1830**: I6 pribit (779 / 438+249), note val 98+107, I1/I2 nespremenjeni ✓.
- **coverage report (PASS 8)**: parcels 2.814 = 907 VER / 1.454 PART / 453 CONF; §24 manifest 14/14; preostanek posodobljen (p142 1 tile).
- **runtime kopije** (`src/data/`): 4 datoteke pišejo builderji — ena izhodna resnica (varovalka sha ujemanja).
- **F11 (Fürtrag) regeneriran**: stroga veriga **9 kršitev monotonosti** (5 → 9; novi v86 sumniki na p110–141), veznost p54=52 → p58=56 (delta 4 OK, nespremenjena), **3-glas QKl REVIEW: 41 → 52 strani**, aritmetika **0 OK / 79 REVIEW / 9 brez** (76/12 → 79/9), sidra val 85: **3/7 (nespremenjeno)**. F11 ostaja **REVIEW raven** (NR-14); absolutne per-parcelne površine ostajajo PROVISIONAL.
- **analysis-v6**: tiles_read 446 → 695 (vlm_calls), 0 napak; jk številke v analizni datoteki štejejo le audita v86+v86b (301 popravkov / 130 arbitraž) — del 3 ima svoj audit `register-v107-changes.json` (val 107).
- **c4-metrika (val 90) deterministično regenerirana**: K7 reprodukcija 0/79/9 natančna + 0 neskladij vsot; K8 12/13 value + 1/13 red (nespremenjeno); **K9 p56–143 jaethe_plain_100_1599: 214 → 120** (mehanski premik z F-PV-05 korekcijami — vzorec val 88 §4; vsotno NEUTRALNA); K10 nespremenjen.

## 6. UI / muzejska zbirka

- **+0 zapisov / +0 virov / +0 identitet / deljenih 69 — 114/652/528/69 NESPREMENJENO** (tehnični val, nič nove muzejske vsebine).
- ATLAS §22 pogodba spoštovana (kg_sha256 spremenjen = podatek spremenjen = kaskada regenerirana); veriga #100 §8 NEIZMENJANA.
- UI sloj bere runtime kopije (`src/data/`) — brez posegov; /api/opendata števci muzejske zbirke nespremenjeni.

## 7. Testi

- **+14 varovalk** (`tests/val107-issue42-86b-part3.test.ts`): fail-fast marker, pokritost 31 strani + 646 vrstic, p141 honest (page-not-qualified brez markerjev), tally dela 3, snimke na vseh 154 popravkih, v88 zaščita, variante 552/506 (skupaj 1.615/1.402), p142 fail-fast (v82 ostaja), edini manjkajoči tile izrecno poimenovan, prehod števcev 779/92 + kategorije, KG v2.3 + KG-F12, kaskada sha 23a2ae50 + runtime kopije, §4 poštenost (PROVISIONAL ostaja).
- **Izrecen prehod pinov v 20 testnih datotekah** (vzorec valov 89/98): register 1.109 → 1.755 + v82 689 → 43, parcele 898 → 779 + land use, KG 3.775/3.859/2.933/3.155 → 3.656/3.795/2.814/3.091, variante 896/1.063 → 1.402/1.615, F11 (kršitve 5 → 9, REVIEW 41 → 52, aritmetika 76/12 → 79/9), c4 K9 214 → 120 + gt1599 69 → 70, coverage/parcele/kaskade, R-03859 → R-03795, KG-F12 v findings seznamih, story-engine H-040 »10 od 124« → »9 od 123« + §18.6 461 → 438 / 2472 → 2376, api-smoke.
- **Celotna testa: 960 testov — 949 pass / 11 skip / 0 fail** · `bunx tsc --noEmit` čist · eslint čist (testi v ignore listi — konvencija repo).

## 8. Poštenost

- **p142-t-kultur2 ostaja neprebran** (trdo 429) — zapisano izrecno; fail-fast page pravilo p142 drži v82-native-pass1 (40 vrstic), noben delni glas ni uporabljen; resumable za naslednji val (en kos, ~1 min ob kvoti).
- **p141 NE kvalificirana** — only_j ≥ 10 % na strani z mešanimi zapisi; jk vrednosti nedotaknjene, brez snimk, brez markerjev (pravilo samo šteje); owner/kultur variante so vrednostno neodvisne od jk in zato varne.
- **Reparacija 2 ERROR datotek je deterministična** (stanjski stroj nad `.raw`); surovini ohranjeni nespremenjeni; nič ni ponovno vprašanega VLM-ja, nič ugibanja pri vsebini.
- digit_mismatch 98 = diagnostika (per-row tile poravnava je ±1 nestabilna, p56 dokazano) — vrednosti ostajajo 2-glasne, nič tiho popravljenega.
- VLM napake ostanejo v surovinah (surovina = dokaz); 429 dinamika kosov zabeležena v logu (gitignored, vzorec valov 86/98).

## 9. Naslednje

1. **p142-t-kultur2** (1 tile, resumable — ob kvoti; nato p142 v jk vgradnjo po istih pravilih + F-PV-05 re-run) → **2. prehod kolonskih tile-ov 87/87 ZAPRT**.
2. **Re-read 70 FRESH markerjev** (56 digit-split + 14 col-split; vzorec val 88 — crop re-read z x4 zoomom).
3. **F-PV-03** (p121 r0 brez ugibanja) + **F-PV-04 pasovni re-read** (NR-14) — per-parcelne trditve še čakajo.
4. PZ p48–65 2. prehod; PT p7 @300dpi; PR Grenz-Beschreibung (F-PZ-05 + F-A05-03).
5. Dular 1972 vsebina + BM Metlika (izven peskovnika); register: 26-0326 (oddano v pregled) + 26-0379 (napredita okt./nov. 2026).
