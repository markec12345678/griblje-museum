# Val 117 — MIKROPREHOD 8b: PZ integracija 45 glasov + PT p7 re-adjudikacija areal

**Datum:** 1. 10. 2026 · **Issue:** #42 §4/§14 (+ #43) · **Metoda:** PZ — 45 VLM glasov (val 116) + direktni odtis (val 109) + **agentov vid** (3. glas, glavna seja) + model I7 kontrola · PT p7 — native sken (2727×2117) + **izmerjena horizontalna pravila** + agentov vid + 9 novih VLM glasov · **0 VLM klicev za PZ** (glasovi zajeti val 116)

---

## 1. Del A — PZ mikroprehod 8b (`build-pz-v117.py`)

Admission pravila (razširjena iz val 116): **soglasje ≥ 2 (odtis/vlm/vid) → TRANSCRIBED; kolizija 1:1 → model I7 (EXACT) odloči → TRANSCRIBED-i7; kolizija brez modela → REVIEW; model ne prevlada nad soglasjem ≥ 2** (samo divergenca-note).

### 1a. 10 popravkov (vse z revizijskim sledom v `pz-v117-changes.json`)

| stran | polje | staro → novo | dokaz |
|---|---|---|---|
| p50 §1 I | roh kr | 40 1/10[?] → **44** | odtis-proza + vlm-proza + **vid** (model 10\|40.8 ✓) |
| p50 §1 I | rein kr | 3[5?] → **5** | odtis 5[3?] + vlm + vid (3 glasa; **model 3.2 divergenca dokumentirana**) |
| p53 §2 I | aufwand kr | 37½ → **57½** | vlm-tabela + vlm-proza + vid (odtis 37 = Kurrent 3/5) |
| p54 §2 II | roh fl | 14[11?] → **4** | **DILEMA 1 REŠENA**: vlm + vid + model 2×EXACT (4×0.25=1\|—; Rein 3\|—) + p65 Zus A Wiesen II brutto 4 |
| p55/p56 §3/§4 | rein kr | 3[5?] → **5** | 4 glasa (isti vzorec kot p50) |
| p58 §6 | aufwand kr | 132[?] → **13 1/2** | **DILEMA 3 REŠENA**: vlm + vid — frakcija vidno zapisana |
| p59 §7 | aufwand kr | 132[?] → **13 1/2** | vid + sestrska p58 (vlm+vid) |
| p60 §8 | roh kr | 30 1/2 → **50 1/2** | **vid črno pisavo** + model 2×EXACT (Anschlag 9\|15.776 ≈ 15¾ + Rein 7\|34.75 ≈ 7\|35) + p52-predloga identika; odtis 30½ + vlm 80½ = Kurrent 5 artefakti; rdeči sloj "38 4/10 [rot]" dokumentiran |
| p60 §8 | anschlag kr | 15[?] → **15 3/4** | vid + vlm-proza + model EXACT |

### 1b. Dvigi, kolizije, divergences

- **50 statusov na TRANSCRIBED ravni** v § sekcijah (iz 0 TRANSCRIBED / 58 REVIEW); i7_checks: **10× I7-EXACT** (p54 in p60 zdaj zapirata — prej 7×).
- **4 kolizije ostajajo REVIEW**: p50/p55/p56 anschlag frakcija (⅔/¾/⅘), p52 roh_kr (½ vs ¼, 2:2).
- **5 model-divergenc izrecno dokumentiranih** (rein_kr 5 vs model 3.2 ×3; p53 rein 30 vs 31.2; p57 rein 10 vs 12 = pisarjevska zaokrožitev) — glasovi prevladajo, nič ne vsiljeno.
- **Dilema 7 (del)**: datum p60 = **"Neustadtl am 18ten Jenner 1831"** (odtis + vid — jasno); podpis ostaja REVIEW (Scheram[?] vs vlm Scherak[?]).

### 1c. p63 (Zus B) — 16 vrstic integriranih

- 2. glas (VLM band*) + **vid (zoom prerezi)** vs glas val 77 (PROVISIONAL) — polje-po-polju.
- **5 vrstic TRANSCRIBED** (r2, r3, r4, r5, r13); **r1 kat_no kolizija** (v77 115 / vlm 113 / vid 113[5?]) → REVIEW; **r14 kat = 1030** (vlm+vid; v77 1020 = Kurrent 3/2), pacht **7|—** (v77 "1" = Kurrent 7/1), klafter 594 ✓; r13 pacht/summe **1|13** (v77 12 artefakt).
- **band2 (r6–r12) NEZANESLJIV** (stolpci zamaknjeni) → vrstice ostajajo REVIEW na v77 ravni; vsota klafter = 3159 ≠ 3252/3253 (Summe 2) — **aritmetična vrzel 93/94 dokumentirana**.
- **F-PZ-21 (PARTIAL)**: anmerkungen = **"Chausseepfennig auf Kosten A/c 2 …"** (r1–5) + "Chausseepfennig pro …" (Summe) — cestninski pfennig kot breme najemnikov [REVIEW prepis, vid].

### 1d. p65 (Zus A) — razkol Acker I REALEN

- p65 brutto Acker I = **22|46** (odtis 22|463[?] + vlm = 2 glasa) vs §1 roh = **23|44** (3 glasa) — **dokument-notranji razkol, ni berljivska napaka**; F-PZ-20 ostaja PARTIAL. Dilema 4: RAZKOL DOKUMENTIRAN; dilema 5 (Rein Acker I) ostaja ODPRTA.
- Križne potrditve: Acker II 16|50 ✓, **Wiesen II brutto 4** (podpira p54 roh=4), Gr.G rein 13|5 ✓. Desni blok = anmerkening s parcelami (96, 185 "zu Fleyen", 202, 301, 232 "Chr. Horvat A.", 292, 35 + podpisa Jungwirth/Oberhammer) [artefakti].

### 1e. Protokoli p48/49 + F-PZ-22

- Datum **5. April 1830** potrjen (2. glas); VLM podpisne variante ("Hanns Geynfrg …") = artefakti — kolizija z odtisom (Kappas[?]/Müller[?]/Konšlak[?]/Krainz[?]) → **REVIEW ostaja**; novo besedilno: **omemba mlinu** ("Eine Mühle mit einem Anfluge und einem Wohnhaus") — konsistentno s PR/A01/PUA dokazi.
- **F-PZ-22 (DOKUMENTIRAN)**: p60 dvojni sloj — rdeča revalorizacija ("38 4/10 [rot]", "revaluiert") + datum 1831.

**Findings 20 → 22. Iskrenost: TRANSCRIBED = "tako je zapisano" (≥2 glasa ali izrecen -i7 model lift); 0 VLM klicev v val 117 za PZ.**

## 2. Del B — PT p7 re-adjudikacija areal (`build-register-v117-pt.py`)

### 2a. KLJUČNA NAJDBA — F2-analog za areale: +1 POMIK

Register areal stolpec p7 (val 41/52/53, 1308×1016) je **sistemsko +1 zamaknjen za vrstice 6–18**: register bp n = nativno bp n−1 — **13/13 parov programsko potrjenih** (76, 26, 28, 91, 192, 88, 168, 239, 12, 181, 91, 90, 8). Val 110 je rešil pomik za hišne številke (F2); val 117 zaključi analog za areale. Vrstice 2–5 posamezno zmešane; staro "44" (bp84) = artefakt brez vira na p7.

### 2b. Vgradnja (merjena pravila + vid + 9 VLM glasov)

- Izmerjena pravila: 20 vrstic (379–2013) + vsotna (2013–2111); bande `pt7v117-areal-band1..4.png` (10×) + `pt7v117-owner-band1..4.png` (3×); `read-pt7-v117.mts` → `vlm-v117-pt7/` (9 glasov).
- **17 popravkov areal_original** (bp82–98): 52, 292, 21, 76, 26, 28, 91, 192, 88, 168, 239, 12, 181, 91, 90, 8, **102** (Zollamt bp98 — potrjen z vidom črno + vlm + val 110 diagnostiko "register bp99 areal 102 = nativni bp98").
- **bp81 kolizija → REVIEW**: vid 14[?] / vlm 44 [rot] / nizko-loč. 11 (celica rdeče prečrtana).
- Fantoma bp99/100 potrjena prazna; **vsotna areal = večslojni zapis → REVIEW** (vid 1|77?+rdeče 62? / vlm 7 7/62; aritmetika nativnih klafter = 1701 = 1 joch 101 — se ne zaključi; vrzel dokumentirana).
- Rdeča revizija (prečrtani areali): **bp 81, 82, 85, 90–97** (skladno z val 110 red_crossings).
- **F1 politika: lastniška imena NESPREMENJENA** — VLM 3. glasovi ("Strauß Georg" garbled) = artefakti v `areal_v117`/v117_native; hišne številke iz val 110 nespremenjene (h.70 Zollamt ✓).
- `reconciliation.json` + val117 sekcija; `open_for_full_res`: "PT p7 rep" → RESOLVED-V110 → **REŠENO-delno-v117**; `page-records.json` p7 v117_areal blok (merjena pravila + nativna sekvenca).

**Kaskada: NI potrebna** — PT areali ne hranijo PS/PUA/KG (PZ = SRC; PT ločen dokument; KG sha nespremenjen 2790d893).

## 3. Testi + dokumentacija

- **+31 varovalk**: `tests/val117-pz-mikroprehod8b.test.ts` (20: admission pravila, 10 popravkov, p54 model-EXACT, p63 16 vrstic + band2 nezanesljiv + vrzel, p65 razkol REALEN, dileme 7, changes audit 50/10, F-PZ-21/22, iskrenost) + `tests/val117-pt7-areal-readjudikacija.test.ts` (11: nativna sekvenca 20 vrednosti, pomik 13/13, kolizija bp81, bp98=102, prečrtanja, F1 imena, changes 21 vnosov, page-records, 9 glasov).
- Pini prehoda 116→117: `tests/pz-konskripcija.test.ts` (val 117, findings 22), `tests/val109-pz-p48-65.test.ts` (PASS 8b, i7 10× EXACT, p63 16 vrstic, honesty), `tests/val110-pt7-pr-grenzen.test.ts` (open_for_full_res v117).
- **1146 testov: 1135 pass / 11 skip / 0 fail** · tsc čist (preobstoječe peskovniške Prisma napake izključene) · lint čist.
- artefakti: `atlas-1825/build-pz-v117.py` + `pz-v117-changes.json` (50 sprememb), `pt-n83/build-register-v117-pt.py` + `register-v117-changes.json` (21 vnosov), `raw-web-val110-2026-09/vlm-v117-pt7/` (9 glasov, komitirano) + `read-pt7-v117.mts`; band izrezki `pt7v117-*.png` (22 MB) gitignored — regenerabilno iz native-p07 + merjenih pravil (recept: detekcija temnin v stolpcu 160–1400; crop x1236–1404 @10×).

## 4. Naslednje

- imenski pass p25–p55 (agentov vid); poln re-read p143; F-PV-03/F-PV-04; PZ p65 polne vrstice + p63 r6–r12 ob višji ločljivosti (izven peskovnika); register eArheologija 26-0326 + 26-0379.
