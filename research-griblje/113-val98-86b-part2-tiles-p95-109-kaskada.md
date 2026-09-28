# 113 — 98. val: 86b DEL 2 — PS N83 KOLONSKI TILE-i p95–109 + VGRADNJA PO PRAVILIH VAL 86 + KASKADA KG v2.2

**Datum:** 2026-09-28 · **Obseg:** PS N83 (SI AS 176/N/N83/s/PS) — tile 3. glas razširjen s 40 na **55/87 strani** (p56–94+121 val 86 + **p95–109 val 98**) + vgradnja + celotna §22 kaskada
**Nadaljevanje:** val 86b (research-griblje/101) `Naslednje` #1 — »`bun tile-read-v86.mts ALL` → preostalih ~479 tile-ov → vgradnja po pravilih val 86 (avtomatsko razširi 808 → ~1.798) → §22 kaskada → F11 artefakt regeneriran« · val 88 §6 #2
**Vgradnja:** register.json 808 → **1.109** vrstic z `reading_pass v86-colonial-tiles` (+301 na p95–109) · owner_tile_v86 variante **+910** (skupaj 1.063) · kultur_tile_v86 **+259** (skupaj 896) · **PS parcele 930 → 898** (izrecen, testno voden prehod) · **KG v2.2** (sha `2b16acad…`) · **+0 virov / +0 zapisov / +0 identitet muzejske zbirke — 114/622/499/68 nespremenjeno**

---

## 1. Kontekst

Val 86 je s kolonskimi tile-i (kompozit z glavo stolpcev, F-PV-06) pokril p56–94 + p121 (40 strani, 808 vrstic); preostanek (~476 tile-ov: p63–94 name + p95–142 kultur+name) je bil odložen na VLM kvoto (429 zadržki). Ta val izvede načrtovani **86b del 2**: spravilo preostalih tile-ov, kolikor kvota dovoli, in vgradnjo po **1:1 pravilih val 86** (page-level F-PV-05, snimke, review oznake).

## 2. Metoda

- **Branja:** obstoječi resumable instrument `tile-read-v86.mts` (identični promti/pravila, nedotaknjen — test varovalka referencira izvorno datoteko) + **`tile-read-v98.mts`** (val 98 ovijanje: isti izhod `vlm-v86/<cell>-T.json` + `.raw`, isti prompti 1:1 kopirana, samo seznam obdelave = manjkajoči tile-i brez 1 s spanja za obstoječe — peskovniško okno ~10 min/ukaz zahteva čiste koščke).
- **Kvota:** 222 tile-ov prebranih v koščkih (19:37–20:42 UTC); po 20:42 trdna 429 stena (urna kvota — vzorec val 86 »146 zadržkov«) — mirovanje + enodelavni način (V98_WORKERS=1, pace 8–15 s) nista sprostila omejitve. **Pokritost = 446/696 (64 %); preostalih 250 tile-ov je vseh na p110–142** (resumable, vzorec val 86 »kvota, obnovljivo«).
- **Vgradnja: `build-register-v86b.py`** (novo, deterministično, fail-fast):
  - pravila **1:1 `build-register-v86.py`**: page-level F-PV-05 (page_qualifies = only_j < 10 %), tile arbitra KOLONO, števke = 2-glasne, digit_mismatch = diagnostika, kultur/owner = variant fields, snimke `jaethe/klafter_pass1_v82` samo ob prvi korekciji;
  - **strani p95–109** (vse 4 kultur tile-i, NOVE): polna jk logika + `reading_pass := v86-colonial-tiles` + owner/kultur variante;
  - **part-1 strani (p56–94 + p121): jk logika NE poganja znova** (re-apply bi podvajal korekcije in digit_mismatch audit) — samo owner_tile_v86 variante z NOVIMI name tile-i (p63–94); p56–62 idempotentno (isti tile-i → isti izid, obstoječe variante ohranjene);
  - **v88 = vir resnice**: vrstice z `v88_status`/UNRESOLVED se pri jk ne dotikajo (varovalka v builderju + test);
  - **p1–55 + p143**: guard nedotaknjeno;
  - fail-fast: dvojni tek prepovedan (changes file obstaja → exit); guard pokritost = strani z vsemi 4 kultur pasovi.

## 3. Rezultat vgradnje (tally dela 2)

| pravilo | vrstic | pomen |
|---|---|---|
| `v86-tiles-jk` | **14** | p1=p2=jaethe (števke enake) + stran kvalificirana → klafter := vrednost |
| `v86-tiles-arbitrated` | **87** | razkol stolpcev p1↔p2 → page-glas (K) odloči |
| `v86-explicit-jk-kept` | 52 | izrecno N\|K — ohranjeno + marker |
| `v86-kept-k-k` | 136 | oba prehoda že Kläther |
| `v86-review-pass-digit-split` | **7** | NOVI part-1-stil markerji na p95–109 (čaka re-read vzorec val 88) |
| `v86-review-col-split` | 2 | razkol brez klafter številke na strani z glasom |
| `v86-no-value` | 2 | brez številskih vrednosti |
| `alignment_short` | 1 | vrstica brez tile para |
| owner_variant | **910** | owner_tile_v86 (p63–109: novi name tile-i) |
| kultur_variant | **259** | kultur_tile_v86 |
| digit_mismatch | 12 | flag v auditu (vrednost ostane 2-glasna) |

- **Skupno stanje registra:** 1.109 × `v86-colonial-tiles` (808 del 1 + 301 del 2) · 689 × `v82-native-pass1` (p110–142 + p143) · 1.073 brez markera (p1–55 + p143) · snimke na **573** popavljenih vrsticah (333 + 139 v88 + 101) · FRESH review markerji: 7 digit-split + 2 col-split (vseh 139 part-1 promoviranih v val 88, nespremenjeno).
- **only_j agregat preko vseh 55 pokritih strani: 0,1 %** (F-PV-06 glava dela).
- **p110–142:** ~250 tile-ov čaka ob kvoti — `bun tile-read-v98.mts` (ali original `tile-read-v86.mts ALL`) + vgradnja po istih pravilih.

## 4. F11 (Fürtrag) — regeneriran na širši pokritosti

`build-f11-fuertrag-v86.py` re-run: **stroga veriga 5 kršitev monotonosti (NESPREMENJENE)** · veznost p54=52 → p58=56 (delta 4 OK) · **3-glas QKl REVIEW: 38 → 41 strani** (+3 nove strani z REVIEW) · **aritmetika 0 OK / 76 REVIEW / 12 brez Fürtraga (NESPREMENJENA)** · sidra val 85: 3/7 (nespremenjeno) · Fürtrag vnosov 326 → **396**. F11 ostaja **REVIEW raven** (NR-14); absolutne per-parcelne površine ostajajo PROVISIONAL.

## 5. Kaskada (pravilni vrstni red: register → pass3 → KG → story → timeline → coverage)

- **`build-pass3.py` (val 89 builder) re-run:** PS parcele **930 → 898** (F-PV-05 korekcije premaknejo vrednosti iz Jaethe v Quad. Kläfter → prazna jaethe ni parcela; 32 vrstic izpade iz registra parcel, vse brez kultur zapisa: None 136 → 104); land use kategorije NESPREMENJENE (njiva 297, travnik 97, UNKNOWN 333, vrt 16, pašnik 22, gozd 16, drugo 11, dvorišče 1, vinograd 1); 4 flag >3000 (F14) nespremenjene; NR re-checki živo izračunani (negatives 14); val tagi → 98.
- **KG v2.2** (`build-knowledge-graph.py`): SRC-PS coverage nota (del 2 stanje) + **KG-F11** (nova najdba, RESOLVED-V98, status omenja odprto p110–142/F-PV-04/F11 REVIEW/F-PV-03) · PARCEL 2.965 → **2.933**, HAS_PARCEL 3.187 → **3.155**, vozlišča 3.807 → **3.775**, vezi 3.891 → **3.859**; claims 622, research gaps 8, story atoms 4, **invariantne kršitve: 0**; sha `b4f5011c…` → **`2b16acad…`**.
- **story-graph:** projekcija (nič novih trditev); histogram statusov 898 `TRANSCRIBED_PROVISIONAL`.
- **timeline:** `parcels_ps` 930 → **898** (opomba: projekcija 143/143 + val 98 korekcije), I6 zatiči PUA 2035/PS 898/raba 461+333; I1–I6 čiste.
- **coverage report:** parcels 2.933 = 907 VER / 1.573 PART (675 PUA + 898 PS) / 453 CONF; F14 unknowns 930 → 898 (iz registra); SRC-PS nota + PS prehodi blok + next_reads + preostanek posodobljeni; source-coverage val 98; §24 manifest 14/14, I1–I5 čiste.
- **analysis-v6** (`build-analysis-v6.py` posodobljen): val 98, vlm 446 / 0 napak, združeni tally obeh delov (jk popravki 301, arbitraže 130, marker review 148, marker explicit 129, digit_mismatch 260), only_j 0,1 %; re-run byte-identno.

## 6. C4 metrika (val 90 artefakt) — deterministična regeneracija

`c4-metrika-v90.json` je regeneriran ob novem registru (builder determinističen; **vzorec val 88 §4**: statistika se mehansko premakne, verdikti NESPREMENJENI): K9 atribucija 100–1599 v jaethe na p56–143 **242 → 214** (mehanski premik z 101 korekcijo dela 2); K1–K6 ovržbe, K7 reprodukcija (0/76/12), K8, K10 — nespremenjeni; vhodni sha256 v meta posodobljeni.

## 7. §4/§22 disciplina

- **Per-parcelne trditve ostajajo PROVISIONAL** — v86b popravki NE dvignejo evidence statusov (test varovalka: vseh 898 PS parcelnih vozlišč ostaja `TRANSCRIBED_PROVISIONAL`).
- KG sprememba je izrecna in testno vodena (prehod števcev 930 → 898; KG-F11); nič tiho.
- v88 (139 vrstic) vrednostno NESPREMENJENO — vir resnice; 2 UNRESOLVED ostajata odprta.
- Muzejska zbirka (MVG) NIČ sprememb: **114 zapisov / 622 virov / 499 identitet / 68 deljenih** nespremenjeno.

## 8. QA

- **+13 varovalk** (`tests/val98-issue42-86b-part2.test.ts`: fail-fast marker, pokritost dela 2 = točno p95–109/301 vrstic, page-level kvalifikacija vseh 15 strani, snimke+glasovi na vsaki korekciji, v88 nedotaknjeno, owner variante 910 + idempotenca p56–62, p1–55/p143 guard, resumable 446/696 + 0 napak + preostanek vseh ≥ p110, prehod števcev 898/104, KG v2.2 + KG-F11 vsebina, kaskada sha, §4 PROVISIONAL ne-dvignjen).
- **Posodobljeni pini** (izrecen testno voden prehod števcev, vzorec val 89): val86 (55 strani, 1.109/689, 573 snimk, 896/1.063 variant, 7+2 fresh markerji, audit trail dela 2), val84/85/88/89/82/83/65/76/77/79/90, atlas knowledge-graph/explore/map/story-graph/story-engine/evidence/georef/coverage/timeline/pass3/pv/pz.
- **754 testov: 743 pass / 11 skip / 0 fail** · `bunx tsc --noEmit` čist · eslint src čist (celoten lint OOM v peskovniku — vzorec val 95).
- **Pouk seje:** peskovniško okno ubija ozadnje procese med klici → dolga VLM spravila tečejo v foreground koščkih z resumable wrapperjem (tile-read-v98.mts); urna kvota (~200–220 VLM klicev) diktira delitev dela med vals — vzorec val 86 ponovljen.

## 9. Naslednje

1. **86b zaključek:** ~250 tile-ov p110–142 (`bun tile-read-v98.mts` ob kvoti) → vgradnja po pravilih val 86/98 → F11 na POLNI pokritosti → kaskada.
2. Ročni re-read 7+2 FRESH digit-split/col-split vrstic (vzorec val 88, direktno branje, 0 VLM).
3. PZ p48–65 2. prehod; PT p7 @300dpi (KG-F01/F04); PR Grenz-Beschreibung (F-PZ-05).
4. Izven peskovnika: zunanji Rektifikacijski protokol (F-PZ-04 Δ 3 J); eSDE/RESCLJ vsebine poročil (issue #72).

## 10. Surovine in artefakti

- `raw-web-val86-2026-10/` — tile-read-v98.mts (nov ovijalec, resumable, samo manjkajoči), vlm-v86/ 446/696, tile-read-v86.log
- `ps-n83/` — build-register-v86b.py (nov vgradni builder, fail-fast), band-v86/register-v86b-changes.json (audit dela 2), band-v86/compare-tiles-v86.json (regeneriran na 55 straneh), band-v86/f11-fuertrag-v86.json (regeneriran), analysis-v6.json (val 98 stanje), band-v86/c4-metrika-v90.json (deterministično regeneriran)
- `atlas-1825/` — parcel-register-1825.json (898, val 98), negative-result-register (regeneriran), knowledge-graph-1825.json (v2.2, 2b16acad), story-graph/timeline/coverage/source-coverage/map-model/story-engine-spec (kaskada), a01-coverage
- `src/data/` — runtime kopije kaskade (ena izhodna resnica, testno varovano)
