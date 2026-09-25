# 73 — 60. val: ATLAS 1825 PASS 3 v1 — Parcelni register (§4) + Negative-result register (§13)

**Datum:** 2026-09-25 · **Način:** čisto lokalni val (VLM kvota 429 neprekinjena — test 13:37 UTC)
**Izhodi (`research-griblje/atlas-1825/`):** `parcel-register-1825.json` + `negative-result-register-1825.json` + `build-pass3.py` (deterministično)
**+0 virov / +0 trditev / +0 UI** — podatkovni sloj po vrstnem redu VIRI→PODATKI→CLAIMS→ENTITETE

---

## 1. PARCEL REGISTER 1825 (§4) — v1

### PUA: 2.035 distinct parcelnih referenc (iz 2.645 vpisov, 98 hiš)

- **parcel_id** = `PUA-{sekcija}-{številka}`; sekcije I (787), II (937), III (222), IV (483), V (142) + nejasne variante (III/IV, II.N, H.IV, D.V, IX V …) → `section_ambiguous: true` (nič normalizirano brez dokaza)
- **417 parcel so-referenciranih z >1 hišo** — npr. **I/22 v 6 hišah** (22, 24, 34, 47, 64, 66), I/20 v 4 hišah. Interpretacija: **so-vlasništvo/skupne parcele = značilnost franciscejskega katastra, NE konflikt** — ohranjeno kot `co_referenced: true` s popolnim seznamom hiš
- raba zemljišča: PUA je NE vsebuje → `land_use_category: null` (nikoli ugibanje)
- B.P.-opomba ujeta kot parcelna številka (»B P. 17«, p3) → `parcel_number_is_bp_annotation: true`, original ohranjen

### PS: 432 parcelnih kandidatov (55/143 strani, partial)

- `parcel_id` = `PS-p{stran}-j{številka}` — **ločeno od PUA** (`cross_ref_to_pua: UNKNOWN`, F14 namespace vprašanje odprto)
- **Raba zemljišča (§4 kategorije) — samo EXACT leksikalno mapiranje:**

| kategorija | št. | termini (EXACT) |
|---|---|---|
| njiva | 230 | Acker |
| travnik | 60 | Wiese, Wiesen |
| gozd | 13 | Wald, Wald., Schindel. Wald, Lohholz |
| vrt | 10 | Gartn, Garten, Grund(/)Garten |
| pašnik | 9 | Hutweide, Hütung |
| drugo | 4 | mešanice (Wiese und Acker …) |
| **UNKNOWN** | **106** | **Ried/Riedl/Riden, Lehngut, Lohde, Läuige, Lobing, Stroh, Rohr … — original ohranjen, mapping=TERM-UNCLEAR** |

- jaethe >3000 (2 primera) → `flag` (možna zmes stolpcev, val 58) — ohranjena, ne izključena

## 2. NEGATIVE-RESULT REGISTER 1825 (§13) — 11 dokumentiranih negativnih rezultatov

| ID | iskano | rezultat | naslednji vir |
|---|---|---|---|
| NR-01 | B.P./Zoll sklici v PS Anmerkung (s.1–55) | 0 | PS s.56–143 |
| NR-02 | PS jaethe ↔ PUA parcela ujemanja | na naključni ravni | PS 143/143 + glava @300dpi |
| NR-03/04 | OCR sloji PS/PUA | prazen / ne obstaja | VLM branje edina pot |
| NR-05 | hiše 73–78 v vseh virih | ne obstajajo (PS vrzel) | **PS s.56–143 odločilno** |
| NR-06 | Waldweide kot lastniški vpis | ni (samo raba) | — |
| NR-07 | foliacija PS | neusklajena (listi ≠ strani) | fizični zvok (izven peskovnika) |
| NR-08 | B.P. 222 anomalija | izven obsega BP 1–100 | okoliški KG (izven peskovnika) |
| NR-09 | Leksikon 1937 vpisna stran | TO_COLLECT (dLib blokada) | ročni zajem |
| NR-10 | Zucchelli web-search koroboracija | 429 | ko se kvota resetira |
| NR-11 | PUA↔PS AGREE ≥0.7 | 0 — **strukturno (F9)** | PS 143/143 |

Vsak vnos: kaj iskano / vir+strani / rezultat / zakaj ni bilo mogoče potrditi / naslednji vir — točno po §13.

## 3. Skladnost s pravili

- »Nikoli ne ugibaj rabe zemljišča« → samo EXACT leksikon, 34 % PS terminov ostaja UNKNOWN z originalom
- »Ne predpostavi, da je A01 celoten svet« / ne-združevanje → PUA in PS parcelna prostora ločena do dokaza
- So-referenca ≠ konflikt (417 parcel) — dokumentirana značilnost katastra, ne umetno razrešena

## 4. Naslednje

- **PS 143/143** → parcelni register se deterministično obnovi (obojestrana pokritost + Rosetta test NR-02 + hiše 70–78)
- PASS 3 owner/person del že pokrit (val 59); nadgradnja z stand/wohnort ob polni PS
- Re-readi @300dpi (P2-E15) še vedno najmočnejša poluga za konflikte
