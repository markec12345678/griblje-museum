# 93 — 80. val: VAČ topološka izčrpnost (F-PZ-17) + nativna re-digitation 7 variančnih celic

**Datum:** 26. 9. 2026 · **Issue:** #42 §4/§14 · **Metoda:** PREHOD 6 — 3 neodvisna branja na nativnih pikslih

---

## A — VAČ II. prikaz @300 dpi: NE OBSTAJA (F-PZ-17 RESOLVED)

Sistemska topološka preverba **vseh** VAČ (`vac.sjas.gov.si`) dostopnih poti za PZ [373419] / docid 41784
(pričakovana »zadnja peskovniška rešitvena pot« F-PZ-04):

| # | Pot | Rezultat |
|---|---|---|
| 1 | `util/pdfPageImage?uodid&docid&page` | FIKSNA 608×1024 predogleda — parametri `size/width/zoom/dpi/scale` ignorirani (200, bajtno isti odgovor) |
| 2 | session-vezani IIIF raster (`/vac/iiif/manifest?uodid&docid&seq`, Presentation 3 — metoda grafičnih listov val 42) | obstaja TUDI za PZ, ampak vsebuje **samo ovitek 100×50** (seq-agnostičen; `info.json` 404) |
| 3 | per-page OCR AnnotationList (`iiif/pdf-text?...&page=N`) | `resources: []` — sistemsko prazno (enako `pdf-raw-text`, val 56) |
| 4 | `iiif/pdf-manifest` canvasi | PDF **točke** (608×1024 pt), ne piksli |
| 5 | PDF vsebina (LuraDocument v2.16, 2006) | **1 rastri/stran, brez mask** — portret 1268×2135, ležeče ~2850×2380 → učinkovito **~150 dpi** |

**Sklep:** maksimum portala = PDF-native vgrajeni skeni (že v `pz-n83/native/` od val 75).
Vse pretekle @2x–@4x »večave« = interpolacija brez novih informacij.
Metodološki standard za prihodnje valove: **nativni piksli; večava SAMO za VLM berljivost, nikoli kot vir detajlov.**

## B — Nativna re-digitation: inter-bralčeva varianca PR#69 ↔ val 79 RAZREŠENA

Utemeljitev: zaprti PR #69 (neodvisno drugo branje Rektifikacije p35–40) je variiral od val 79 na **7/7 ključnih celic**
(Kurrent 0↔3 / 5↔9 / 0↔7) — to je bilo najmočnejše utemeljitev za re-digitation.

**Metoda:** FFT template-matching (numpy NCC) val-79 izrezkov na nativih → `anchors.json` (vizualno verificirani pasovi)
→ **3 neodvisna branja/celico**: (C) direkten odtis avtorja na nativnih x6–x8 številčnih izrezkih,
(A) VLM raw+norm (nativni piksli), (B) VLM x3 lanczos. 27/27 VLM klicev OK; surovinski izpisi `vlm/*.raw`.

### Odločilna miza

| Celica | val 79 | PR#69 | val 80 (direkten odtis + VLM) | Sklep |
|---|---|---|---|---|
| №30 (p35 Acker I) | 1 J 1382 | 1 J 1082 | **1 J 1082** (x6: čista zaprta »0«; VLM Bx3 1082) | **RESOLVED** — PR#69 pravilna |
| №594 (p36 Acker II) | 1 J 531 | 1 J 591 | **1 J 591** (bowl+rep = 9; VLM Araw 591) | **RESOLVED** — PR#69 pravilna |
| №1099 (p36 Acker III) | №1099 = 1 J 700 | №1004 = 1 J 1010 | **№1004 = 1 J 1010** (nativni izrezek jasno) | **RESOLVED** — tudi številka ovržena |
| №438\|738 (p37 Wiesen I) | 1 J 896 | – J 395/895 | **– J 895** (pomlaj jasno; 9 = bowl+descender) | **RESOLVED struktura** — val 79 ovržena na obeh |
| №2451 (p37 Wiesen II) | 1 J 1515 | – J 1515/1575 | **– J 1515** (pomlaj; 1515 jasno) | **RESOLVED** — kombinirano |
| №2491\|249/1 (p38) | 1 J 260 | – J 260 | **– J 260** (pomlaj potrjen) | **RESOLVED** — soglasje |
| №1288 nad 2875 (p39) | 1 J 882\|883 | 1 J 589/549 | 1 J 8?? — **poškodovana/prečrtana celica** + subscript »943[?]«; VLM kaos | **REVIEW** (pošteno) |

**Sistemsko odkritje:** pisar piše **POMLÁJ (–) za 0 Joch** pri površinah < 1 Joch — val 79 je sistemsko bral »1 J«
(3 Wiesen/Garten Muster-parcele). Vsi aritmetični/checks konsistentni (738: 895 < 1600 QKlft = 0 Joch; 2451: 1515 < 1600; 2491: 260 < 1600).

## C — §8 rdeči stolpec (F-PZ-15) — nativni re-read

- **Total 1220\|1493 potrjen 3×** (sidro §1 EXACT).
- **WmH joch 557 aritmetično POTRJEN**: subtotal 1150 = 419+45+2+0+6+121+557 EXACT (357 bi dalo 950≠1150); 1258 potrjen 3×.
- **Wiesen joch VARIANCA 41/45**: 3 glasova »41« (direkten odtis + VLM A×2), VLM Bx3 »44« — ampak aritmetika subtotala
  1150 EXACT za **45** (za 41 bi Aecher moral biti 423). Ni odločeno (§4: nič vsiljenega) — dokumentirano.

## D — Vpliv

- **F-PZ-04 (Δ 3 J = 4.800 QKlft): NENIČ vpliva** — Muster-parcele so vzorci kakovosti, ne seštevajo se v Endresultat.
  Vse peskovniške rešitvene poti **IZČRPANE** (F-PZ-14/16/17) → ostaja **samo zunanji Rektifikacijski/Komunikacijski protokol**.
- **F-PZ-12 (p43–47): band-metoda @nativno IZVEDLJIVA** — 8-pasovni test p43 čitljiv (glava »Ackerland mit 2 Klassen«,
  Wirthschaftskurs 1–6, »Düngung auf 1 Joch … 3 Fuder … 90 … 120 Stück«). Celotni prepis = naslednji val (~40 klicev).
- **KG v1.8 (20ec8a0a) / timeline / deleži F-PZ-13 / I1–I6 NESPREMENJENI** (disciplina §22).

## E — Surovine

`raw-web-val80-2026-10/`: `crops-v80/` (nativni pasovi raw/norm/x3 + številčni izrezki x6–x8),
`anchors.json`, `crops-manifest.json`, `vlm/` (27 JSON + 27 .raw), `redigitize-v80.mts`,
e2e posnetka `val80-home.png` + `val80-cas-1830.png`.

## F — Ostaja

1. PZ celotni vrstični prepis prek band-metode @nativno (F-PZ-12 izvedljiv; ~40 klicev);
2. PS p56–143 vrstični prepis ob VAČ kvoti (F-PV-03 vinogradi);
3. PT p7 @300 dpi (KG-F01/F04);
4. izven peskovnika: zunanji Rektifikacijski protokol (zadnja pot F-PZ-04), šolski list / SA Podzemelj / SI AS 749 / Zucchelli.
