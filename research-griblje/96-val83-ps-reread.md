# 96 — 83. val: PS N83 neodvisen re-read (2. prehod) p56–143 — soglasje matrika po poljih; struktura + numerična hrbtenica potrjeni, imena/kultur/površine ostajajo PROVISIONAL (F-PV-04, NR-14)

**Datum:** 2026-09-27 · **Obseg:** PS N83 (SI AS 176/N/N83/s/PS, VAČ docid 41780 / uodid 373415) — strani 56–143, 2. neodvisen prehod
**Nadaljevanje:** val 82 `next_reads` točka 1 — *»PS p56–143 neodvisen re-read (2. prehod — kvantitativni agregati, takrat šele SRC-PS coverage §22)«*
**+0 virov / +0 trditev / +0 KG v1.8 / +0 UI** — raziskovalni val (re-read + sodbe; register/page-records bit-po-bit, runtime src/data NESPREMENJEN)

---

## 1. Kontekst

Val 82 je zaključil vrstični prepis PS p56–143 (1.798 vrstic, `reading_pass: v82-native-pass1` = PROVISIONAL po §4); SRC-PS coverage posodobitev je bila po pogodbi §22 možna šele ob neodvisnem re-readu s soglasjem ≥ 2. Val 83 izvede ta 2. prehod in meri soglasje po poljih.

## 2. Metoda — celostranski nativni 2. prehod (88 klicev, 0 napak)

- **Izvedba:** `raw-web-val83-2026-10/ps-transcribe-v83.mts` (prompt **VERBATIM val 57/82** — neodvisnost: prompt ne vsebuje ničesar iz pass1; svež klic = neodvisen glas, vzorec val 80) — 88/88 strani p056–p143, **0 trajnih napak, 0 retry, 0×429**; surovine `raw-web-val83-2026-10/ps-vlm/` (88 JSON + transcribe-v83.log)
- **Primerjava:** `ps-n83/build-compare-v83.py` (determinističen, fail-fast guardi: register 2.871 / p56–143 v82-native-pass1 / 88+88 RAW brez ERROR) → `ps-n83/reread-v83/comparison.json`
- **v2 metodologija** (po 1. meritvi, dokumentirana): RAW ime ločeno od name_resolved (ditto razrešitev ojača varianco blokov) · kultur EXACT + first-token · numerika EXACT + NUMEQ (samo števke — format artefakti »+ 56« = »+56«) · QKlft sane parsanje (jaethe > 2 števk brez klafterja → klafter; znana pass1 anomalija p121 »J=1725«) · QUANT-CONFIRMED = haus_no ∧ jaethe ∧ klafter (numeq) ∧ kultur (first-token)

## 3. Rezultat — soglasje matrika (matched 1.779 parov; extras 19/18)

| polje | EXACT soglasje | NUMEQ | razred |
|---|---|---|---|
| classe | **95,84 %** | — | VISOKO |
| capital_kr | **96,35 %** | 96,35 % | VISOKO |
| capital_fl | **95,00 %** | 95,00 % | VISOKO |
| ertrag_fl | **95,11 %** | 95,11 % | VISOKO |
| ertrag_kr | **92,52 %** | 92,86 % | VISOKO |
| wohnort | **86,00 %** | — | SREDNJE-VISOKO |
| stand | **82,12 %** | — | SREDNJE-VISOKO |
| jaethe | 71,61 % | **71,89 %** | SREDNJE |
| klafter | 68,18 % | **68,41 %** | SREDNJE |
| haus_no | 69,48 % | — | SREDNJE |
| no_blatt | 49,02 % | — | NIZKO (F15) |
| kultur | 47,27 % | 39,07 % first-token | NIZKO |
| name_raw | 19,62 % | — | NIZKO |
| name_resolved | 15,63 % | — | NIZKO (ditto ojačanje) |

- **Struktura neodvisno reproducirana:** 1.798 vs 1.797 vrstic (23 strani ±1, skupaj extras 19/18; p141 44 vs 30)
- **full_agree (13 polj EXACT): 40 vrstic** · kolizije: **2.337 high / 5.053 medium / 15 format** — vse kot variant vrednosti v comparison.json (`pass2` vrednosti), **nič tiho popravljeno**
- **Kultur kategorije zamenjav** (top): acker ↔ wiese (27), jflur ↔ jäthn (16), acker ↔ gärten (16), schwingst ↔ schwingstätten (15), hutweide ↔ wiese (14)
- **Totals/Fürtrag:** soglasje label+value le **18/100** — celostranski prehod ne verifikira verige

## 4. Sodbe

- **F-PV-03 (vinogradi):** status ostaja **KVALITATIVNO-POTRJENO-V82 — re-read NI dvignil na 2×**. Pass2 celostransko še agresivneje SKRAJŠA kultur stolpec (p98: »Acker, Wiese, Reb, Hofraithen« → »Acker«): Reb omembe 14 → 6, reproduciranih 0/14 v QUANT-CONFIRMED preseku. **Kvantitativna uskladitev s PV (7 J 665 K = 11.865 QKlft) NI IZVEDLJIVA** na celostranski ravni: stolpčna dodelitev Jaethe↔Klafter variira med prehodi (p98 r2: K=952 ↔ J=352!) + števk varianca (5↔3, 0↔7, 1494↔1444). Sane vsote (samo pokazatelj): pass1 pure 6.304 QKlft vs pass2 pure 216 QKlft — razlika Dokumentira nestabilnost, NE resnice.
- **F-PV-02 (Wald napetost):** pass2 neodvisno reproducira **Wald rabo 54 = 54 vrstic** — obstoj Wald rabe v PS 1825 je 2× dokumentiran; napetost proti PV (Wälder = 0) ostaja OPEN.
- **F15 (no_blatt):** soglasje 49 %; pass2 neodvisno najde **445 vrstic > 1000** (vs 379 v pass1) — semantika (rimske III → 111, Uebersetzung zaporedja) nezanesljiva v OBEH prehodih; REVIEW.
- **F11 (Fürtrag veriga p56–143):** verifikacija ŠIBKO (18/100) — ostaja surova; pot = pasovni re-read.
- **F-PV-04 (NOVA):** metodični meji celostranskega re-reada — zadošča za strukturo + numerično hrbtenico, NE za imena/kultur/površine. Negativni rezultat **NR-14** v negative-result-register-1825.json (13 → 14).

## 5. Vgradnja (research plast; §22)

- `ps-n83/reread-v83/comparison.json` — polna primerjava (matrika, kolizije, totals chain, quant-confirmed, reb detail)
- `ps-n83/analysis-v4.json` — sodbe (F-PV-02/03/04, F11, F15) + next_reads
- `atlas-1825/source-coverage-1825.json` — val 83: SRC-PS note + transcription.PS (2.871 vrstic / 143 strani / 2 prehoda z re-read rezultatom) + next_reads (pasovni re-read na 1. mestu)
- `atlas-1825/negative-result-register-1825.json` — **NR-14** (negatives_total 14)
- **NESPREMENJENO (§22):** register.json / page-records.json (bit-po-bit, varovalka v testih), KG v1.8 (20ec8a0a), story_id, timeline, deleži, runtime src/data, i18n, I1–I6
- KG vozlišče SRC-PS (opomba »PARTIAL 55/143«) se posodobi z **KG v1.9 rebuildom** (ločen val — kaskada kg_sha256 → story_id po §22)

## 6. QA

- testi: +15 val-83 varovalk (ps-n83-analysis.test.ts: soglasje matrika, struktura, F-PV-02/03/04, F11, F15, NR-14, coverage §22, bit-po-bit, skripte) + pine (coverage artefakti [72,74,81,83]; negatives_total 14) → **534/534** (9 skip)
- tsc čist · lint čist · verify-i18n **1074×5** zeleno
- api-smoke/e2e: NI obremenjeni — runtime podatkovna plast NESPREMENJENA (pogodba §22, vzorec val 82); Vercel/Render ostajata na pogodbenem stanju val 81

## 7. Naslednje

1. **PS p56–143 PASOVNI/ZOOM re-read s kolonskimi sidri** (vzorec val 80/81) — imena, kultur kategorije, jaethe/klafter stolpčna dodelitev, Fürtrag veriga (rešitvena pot NR-14/F-PV-04)
2. PZ p48–65 2. prehod (protokoli + Zusammenstellung A/B — p65 REVIEW)
3. KG v1.9 rebuild: SRC-PS vozlišče + kaskada story_id (§22)
4. PT p7 @300dpi (KG-F01/F04); PR Grenz-Beschreibung (F-PZ-05)
5. izven peskovnika: zunanji Rektifikacijski/Komunikacijski protokol (F-PZ-04 Δ 3 J), šolski list / SA Podzemelj / SI AS 749 / Zucchelli
