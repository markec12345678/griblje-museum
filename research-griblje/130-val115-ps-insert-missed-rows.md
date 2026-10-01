# Val 115 — PS: vstavljanje izpuščenih vrstic (p34/p40/p48/p49) — strukturni val

**Datum:** 30. 9. 2026 · **Issue:** #42 §4/§14 (+ #72 vrsta) · **Metoda:** deterministična vgradnja strukturne forenzike vala 114 (0 VLM klicev)

---

## 1. Kontekst in odločitev

Val 114 je strukturno forenziko **dokazal**, vgradnjo pa izrecno odložil: »VSTAVLJANJE = odprta
strukturna odločitev (bi spremenila 2871 kontrakt)«. Ta val to odločitev **izvede**: 4
dokazane izpuščene vrstice so vstavljene v register — **2871 → 2875 vrstic**. Stare plasti
(v57/v82/v83/v86/v88/v111–v114) ostajajo **nedotaknjene**; vstavljene vrstice nosijo novo
plast `v115-insert`; vrnjene (premaknjene) vrstice so **vsebinsko nespremenjene** (v114 je
vrednosti že poravnal preko mapiranja rN=p(N+1)).

## 2. Štiri vstavitve (po padajočem globalnem indeksu — indeksi stabilni med vstavitvami)

| # | gi (v2871) | stran | vsebina | dokaz (v114 forenzika) |
|---|-----------|-------|---------|------------------------|
| 1 | 932 | **p49** (r2) | preklicana **"2\|973"** (Joch\|Klafter notacija), kultur Acker | 14 natanko ujemanj vrednosti pod mapiranjem +1; cela vrednost prečrtana (pisarjeva revizija) |
| 2 | 912 | **p48** (r2) | **"12"** v Joch koloni (ni prečrtana), ime ~**Schmipa[?]** | 10 natanko ujemanj; edina vstavljena vrstica z numerično jaethe |
| 3 | 761 | **p40** (r13) | tekač **734**, Nro 21, **Pechley Mich°**, **1\|65** — celotna vrstica rdeče prečrtana | v57 jo je izpustil in vrednost zlil v r12 ("4 - 65"); Nro 20/22 + tekači 733/734 |
| 4 | 647 | **p34** (r20, pred Fürtragom) | **~70** v QK stolpcu, ime ~**Hurich/Lohingr Mich.[?]**, tekač nezabeležen | 21. fizična vrstica; vrednost ~70 = aproksimacija (nizko pisanje pri robu celice) |

Vse štiri vrstice: `source` SI AS 176/N/N83/s/PS, `document_id` VAČ docid 41780 (uodid 373415),
`reading_pass` **v115-insert**, anmerkung z izrecno vstavitveno opombo (dokaz + prečrtanja +
uncertaintye). Dvomna branja nosijo `[?]`/`~` markerje — **TRANSCRIBED = 0, nič ne dvignjeno**.

**F-PV-07-SPLIT val 115 marker** na vstavljenih vrsticah z vrednostjo v jae polju (p40 1|65,
p49 2|973): jae = Joch stavec / preklicana notacija, **ni parcelna številka** → izpad iz pass3
projekcije (analog pravilu val 113/114).

## 3. page_observations_v115 (nov sloj)

Na prvi vrstici vsake prizadete strani je zapisana izvedba odločitve: št. vrstic pred/po
(p34 20→21, p40 20→21, p48 20→21, p49 21→22), dokaz iz v114, register 2871→2875.
v114 opombe ostanejo kot zgodovina (nikoli prepisane).

## 4. Kaskada (izrecna, testno vodena)

- **pass3** (`build-pass3.py`): izključitveno pravilo razširjeno na marker `F-PV-07-SPLIT val 115`;
  **PS parcele 391 → 392** (+1 = `PS-p048-j12`, brez haus_no → brez HAS_PARCEL vezi); land use
  **None 76 → 77**; vse ostalo nespremenjeno (njiva 105, UNKNOWN 142, EXACT 166, EXACT-MIXED 7);
  guard 2871 → 2875; NR-01/NR-12 re-check naslovi "2.871 → 2.875 vrstic"; provenanca nosi val 115.
- **KG** (`build-knowledge-graph.py`): **PARCEL 2426 → 2427**, vozlišča **3268 → 3269**;
  vezi **3477** in HAS_PARCEL **2773 NESPREMENJENA** (nova parcela brez haus_no); claims 622,
  invariante čiste; file sha256 **376e2b27 → ca0aeb58**.
- **story-graph**: 3268/3477 → **3269/3477**. **timeline**: I6 PUA 2035 / **PS 392** / raba
  173+142 (guard posodobljen z izrecno val-115 opombo). **coverage**: PARTIAL **1066 → 1067**
  (PS SINGLE_SOURCE 390→391); source-coverage transcription.PS.rows 2871 → **2875**.
- **c4-metrika-v90** (re-run): K9 p1–55 — jaethe_plain_100_1599 **69 NESPREMENJENO**
  (12/1/2 ≤ 99); izrecno pincirane nove oblike: jaethe_plain_le99 59→**62** (+p40 1, +p48 12,
  +p49 2), klafter_plain_le99 172→**174** (+p34 ~70, +p40 65), klafter_plain_100_1599
  783→**784** (+p49 973), both_filled 46→**48**, jaethe_empty 943→**944**, klafter_empty
  104→**105**; p56–143 nespremenjeno; K5 dito niz zdaj "233/2875".
- **analysis-v5/v6** (re-run): byte-identno (agregirata p56–143; vstavitve so na p34–p49).
- **runtime kopije** (`src/data/`): knowledge-graph, story-graph, timeline, coverage — vse
  regenerirane s strani builderjev.

## 5. Testi

**+15 varovalk** (`tests/val115-ps-insert-missed-rows.test.ts`): gardele plasti (139/1755/265/
120/667 nedotaknjeno), changes audit (padajoči indeksi 932/912/761/647), števila vrstic po
straneh (21/21/21/22), page_observations_v115, vsebine vseh 4 vstavljenih vrstic s sidri v114,
iskrenost ([?]/~ markerji), kaskada (pass3 392 + izpada, KG edini nov node + sha, §22 sha
pogodba čez runtime kopije, timeline I6, coverage, story-graph, c4 K9 pini).

Pini prehodov 114→115 posodobljeni v **20 testnih datotekah**: pass3 (391→392, null 76→77),
KG (2426→2427, 3268→3269), story-graph, timeline (391→392), coverage (1066→1067, geometry
2426→2427), map/explore/pv-land-use (2426→2427, NONE 2111→2112), story-engine ("2427 parcel",
"2254"), api-smoke (3269/3477, 2427/173/142/2112), val82–val114 (register 2871→2875, gi→gi115
preslikava v v88 testih, KG sha ca0aeb58 v 6 datotekah, val90 K5 "233/2875").

**Lokalno:** 1007 testov — 1000 pass / 7 fail / 7 errors — 7 fail + 7 errors = **identična
predhodna baza** (peskovniški modulni errorji `next/server`, `@prisma/client`, `zod`,
`react/jsx-dev-runtime` — enako na čistem main; CI reši z polno namestitvijo). Neto novih
napak: **0**. `tsc`/`eslint` v peskovniku nedostopna (isti modulni vzrok); CI ju pognne.

## 6. Iskrenost (§4)

- **TRANSCRIBED = 0**; 0 VLM klicev — vstavitve so izvedba DOKAZANE strukturne forenzike
  vala 114 (sidra), ne novih branj.
- p34 vrednost **~70** je izrecno **aproksimacija** (nizko pisanje pri robu celice); ime
  ~Hurich/Lohingr Mich.[?] dvomljivo; tekač nezabeležen.
- p48 ime ~Schmipa[?] dvomljivo; vrednost "12" zanesljiva (ni prečrtana).
- p40 celotna vrstica **rdeče prečrtana** (pisarjeva revizija) — vstavljena kot strukturno
  dejstvo, ne kot aktivna parcela (marker izloči iz projekcije).
- p49 cela vrednost **preklicana** (pisarjeva revizija) — enako.
- Stare plasti in snimke (*_pre_v82/v86/v88/v108/v111–v114) NEZROTALJENE.

## 7. Naslednje

imenski pass p25–p55 → 44 odprtih razhjanj ob višji ločljivosti/multispektralno (izven
peskovnika) → VLM glasovi ob kvoti (45 izrezkov PZ → mikroprehod 8b + p142-t-kultur2 + 3. PT
glas bp 98 + areal/lastnik p7) → poln re-read p143 → F-PV-03/F-PV-04 → register 26-0326 +
26-0379 (okt./nov. 2026).
