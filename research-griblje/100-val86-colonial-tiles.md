# 100 — 86. val: PS N83 KOLONSKI TILE-i (kompozitni, z glavo stolpcev) — 2. prehod p56–142 + VGRADNJA F-PV-05 (J→K)

**Datum:** 2026-09-27 · **Obseg:** PS N83 (SI AS 176/N/N83/s/PS) — p56–142 po shemi val 85; dejansko pokritost **p56–94 + p121 (40 strani, 808 vrstic)** — kvota 429, obnovljivo
**Nadaljevanje:** val 85 `next_reads` #1 (»val 86 — kolonski tile-i«) / val 82 §8 #1 — rešitev NR-14/F-PV-04/F-PV-05
**+0 virov / +0 KG vozlišč / +0 UI** — vgradnja = register 2. prehod (snimke + review oznake) + §22 kaskada (KG v2.0, ID-ji stabilni)

---

## 1. Kontekst

Val 85 je merjeno dokazal: (a) horizontalni pasovi so na pokrajinskih PS dvojstraneh strukturno nestabilni, (b) kolonski trakovi stabilni in rešujejo dodelitev Jaethe↔Kläfter, (c) **F-PV-05**: pass1/pass2 vpisujeta enotne vrednosti sistemsko v JAETHE, pisar pa jih piše v **Quad. Kläfter** — torej sta obe soglasji val 83 soglasji na skupno napačni dodelitvi. Val 86 izvede načrtovano iteracijo: **kolonski tile-i** (stolpčna skupina × pasovna višina) in **vgradi korekcijo na izvor** (register.json) po disciplini val 61 (snimke + review oznake, nič tihega prepisovanja).

## 2. Metoda

- **Kompozitni tile-i** (`make-tiles-v86.mts`): stolpčna skupina name ≈0,27–0,46·W (haus/name/stand/wohnort) in kultur ≈0,53–0,73·W (kultur/jaethe/klafter) × pasovna višina h=328 (y-mreža VERBATIM val 80/81/85) @nativno + x2 lanczos3; VLM bere **x2** (656 px visok — pod pragom API downscale-a, ki je pokvaril glife na x2.5 trakovih vala 85).
- **GLAVA STOLPCEV na vsakem tile-u** (novost val 86): pasovi 1–3 brez glave IZGUBIJO sidro stolpcev — pilot je brez glave na p121 dal **9× only_j (napačno)**; z glavo **0×**. Glava = izrez [top_rule, top_rule+110] (prvo horizontalno pravilo v [30,120] po strani, fallback 50 — izrecno označen; pas 0 glavo že vsebuje). ×2 tile = 590×876 px.
- **x-sidra**: `detectRules` VERBATIM `make-bands-v85.mts` + **GUARD 8/8** proti comittanemu `crops-manifest-v85.json` (dokaz, da je prenos algoritma identičen); fail-fast na vsakem odstopanju.
- **Neodvisnost** (vzorec val 80/83/85): prompt vsebuje NIČ iz pass1/pass2/trakov; pravila row_cut/[angeschnitten]/[gestrichen]/[rot]/[?]/ditto ~; dodatno: »enotna vrednost samo v Kläther je POGOSTA — ne premikaj je« (formulacija izmerjenega F-PV-05 pravila pisarja, ki jo bralec vidi tudi v glavi) + »NE prenašaj vrednosti sosednjih stolpcev (Classe/Ertrag) v Flächen« (pilot: ertrag '7—' je uhajal kot klafter).
- **Kvota**: 201 prebranih tile-ov (comittani artefakti) / 0 trajnih napak; 429 zadržkov 146 (lokalni log, gitignored — isti vzorec kot val 85). Pokritost torej **delna**: kultur 4/4 pasovi na p56–94 + p121 (806 vrstic + p95–98 delno izločene). **Varnostno pravilo**: stran gre v vgradnjo SAMO z vsemi 4 pasovi (delna pokritost = premik indeksov = napačna arbitraža vrstic). Obnovitev: `bun tile-read-v86.mts ALL` (resumable, skip obstoječih).

## 3. Ključna odkritja metode — **F-PV-06: glava = obvezen sidro stolpcev**

Brez glave tile-i dodelijo enotno vrednost PRVI vidni številski koloni (napačno Jaethe); z glavo (izpisani natisnjeni podnaslovi »N.º Jaethe. | Quad. Kläfter.«) dodelitev sledi resnici. Potrjeno na p121 (Fürtrag »17|266« + x4 zoom: enotne vrednosti sedijo v Kläther — v skladu s trakovi val 85: p121 strip only_k=16/both=4, tile z glavo only_j=0). **Pouk za vse prihodnje izrezke brez glave: glava je del sheme, ne opcija.**

## 4. Poravnava in omejitve (pošteno)

- Per-row poravnava tile↔pass vrstic je **±1 nestabilna** (p56 dokazano: tile r7 = p1 r6 — odvečna vrstica na začetku strani). Zato:
  - **kolonska korekcija = PAGE-LEVEL dejstvo** (only_j delež < 10 % po strani — vseh 40 strani kvalificira, aggregate only_j = **0,0 %**);
  - per-row tile vrednosti = **diagnostika** (digit_mismatch flag v auditu, 248 primerov), **NIKOLI vir vrednosti**;
  - števke = 2-glasne (pass1+pass2 pri soglasju); kultur/owner tile različice = **variant fields** (637/153), ne prepisi.

## 5. Vgradnja v register.json (build-register-v86.py, fail-fast proti dvojnemu teku)

| pravilo | vrstic | pomen |
|---|---|---|
| `v86-tiles-jk` | **287** | p1=p2=jaethe (števke enake) + stran kvalificirana → klafter := vrednost, jaethe := '' |
| `v86-tiles-arbitrated` | **43** | razkol stolpcev p1↔p2 → page-glas (K) odloči, števke iz strani z glasom |
| `v86-pass2-split` / `v86-pass1-split` | **3** | p1 stisnil N\|K v jaethe, drugi prehod vidi izrecno oba in se števke potrdita (npr. p121 r12: p1 »810« vs p2 »1\|810«) → prevzeta razdelitev |
| `v86-kept-k-k` | 257 | oba prehoda že Kläther — brez spremembe |
| `v86-explicit-jk-kept` | 77 | izrecno N\|K — ohranjeno + marker |
| `v86-review-pass-digit-split` | **139** | stolpec j, števke med prehodoma različne → marker, brez spremembe (odprt seznam za ročni re-read) |
| `page_no_tiles` | 987 | p95–142 brez 4/4 pokritosti → ostaja `v82-native-pass1` |

- Skupaj **333 korekcij vrednosti**, vsaka s snimko `jaethe_pass1_v82`/`klafter_pass1_v82` + `jk_review`; `reading_pass: v86-colonial-tiles` na 808 vrstic (p56–94 + p121).
- **p1–55 + p143 (rdeči povzetek) NESPREMENJENI** (testno varovano). p58 r0 primer: pass1 jaethe=338 → **klafter=338** (slika: Acker 338 v Kläther) ✓.
- Celoten audit: `ps-n83/band-v86/register-v86-changes.json` (581 vnosov z glasovi p1/p2/tile).

## 6. §22 kaskada (KG v2.0, ID-ji stabilni)

- `build-knowledge-graph.py`: SRC-PS coverage dopolnjen z val 86 stanjem (2. prehod 40/87 strani; F-PV-05 vgrajena 287+43+3; p95–142 obnovljivo); title **v2.0**, val 86; **invariant violations: []**; entitete/veze/claimi/ID-ji **3.309/3.569/622/8/4 stabilni**; kg_sha256 526482d2 → **6fb6fae8**.
- Kaskada: story-graph (4 atomi) + timeline (8 točk; kg_sha256=6fb6fae8) + coverage report (PASS 8, I1–I6 ✓, §24 manifest 14/14) + source-coverage (SRC-PS note val 86; PS passes 3). Runtime kopije = atlas resnica (ena izhodna resnica, testno varovano).
- `build-analysis-v5.py` guard sproščen (sprejme v82+v86 stanja — merjenja val 85 so od registra neodvisna); analysis-v5.json byte-identen.
- **analysis-v6.json** (build-analysis-v6.py, re-run byte-identno): metoda, F-PV-05 vgradnja, F-PV-06, next_reads.

## 7. F11 (Fürtrag) — kandidati zbrani, monotona kontrola čaka

326 vnosov (tile_row kandidati brez kultur + večštevilčne vrednosti + pass totals) v `compare-tiles-v86.json → fuertrag`. Številke Fürtrag ostajajo najšibkejše branje vseh treh glasov (p58: 6/1009 vs 6/1000 vs 6/1169) — **REVIEW raven**, kontrola čeka celotno verigo (val 86b).

## 8. Surovine in artefakti

- `raw-web-val86-2026-10/` — make-tiles-v86.mts (kompoziti + guard), tile-read-v86.mts (resumable, 2 delavca, group filter), tiles-manifest-v86.json (COMMITTED, 696 tile-ov + guard_v85 + header_zones), tile-read-v86.log, vlm-v86/ 219 JSON+RAW; crops-v86/ regenerabilno — gitignored (precedens 56/61/85)
- `ps-n83/band-v86/` — compare-tiles-v86.json (3-glasna matrika + J/K distribucije + Fürtrag), register-v86-changes.json (audit)
- `ps-n83/` — build-compare-tiles-v86.py, build-register-v86.py (CI-varni, `__file__`), build-analysis-v6.py → analysis-v6.json
- register.json (808 × `v86-colonial-tiles`), KG v2.0 + kaskada (6fb6fae8)

## 9. QA

- **596 testov / 0 fail / 11 skip** — novi `tests/val86-colonial-tiles.test.ts` (19 varovalk: manifest+guard 8/8, glava, F-PV-06 pilot, vgradnja s snimkami, review markerji, variant fields, audit, §22 kaskada sha, analysis-v6 determinizem, Fürtrag); osveženi pini: val84/val85/atlas-*/pv/pz/georef/evidence/coverage (KG v2.0, 808+990 reading_pass, PS passes 3)
- tsc čist · lint čist · **api-smoke 101/101** (lokalno s PostgreSQL 18.4 @5433 — peskovniška omejitev brez roota premagana z embedded postgresom v /tmp, repo nespremenjen)
- **Brskalnik (agent-browser)**: domača stran ✓, register ✓, Kronika (34 kartic) ✓, Zemljevid → KATASTER → **ČAS 1825→1830 DOKUMENTIRANO** (SRC-PZ povezave) ✓, konzola čista, mobilni 390 px brez horizontalnega preliva, nosilec naravno potisnjen ✓
- verify-i18n: ni sprememb i18n ključev (1074×5 ostaja)

## 10. Naslednje

1. **val 86b**: `bun tile-read-v86.mts ALL` — preostalih ~470 tile-ov (p63–94 name + p95–142 kultur+name, kvota dovoli) → vgradnja po istem pravilu (avtomatsko razširi 808 → 1.798)
2. Fürtrag monotona kontrola (F11) čez celo verigo; ročni re-read 139 digit-split vrstic
3. PZ p48–65 2. prehod; PT p7 @300dpi (KG-F01/F04); PR Grenz-Beschreibung (F-PZ-05)
4. izven peskovnika: zunanji Rektifikacijski protokol (F-PZ-04 Δ 3 J), šolski list / SA Podzemelj / SI AS 749 / Zucchelli
