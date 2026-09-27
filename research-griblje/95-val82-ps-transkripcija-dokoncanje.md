# 95 — 82. val: PS N83 transkripcija DOKONČANA — p56–143 (1.798 vrstic), F-PV-03 kvalitativno potrjena, F-PV-02 razširjena, F15 generalizirana

**Datum:** 2026-09-27 · **Obseg:** PS N83 (SI AS 176/N/N83/s/PS, VAČ docid 41780 / uodid 373415) — strani 56–143
**Nadaljevanje:** val 81 `next_reads` točka 1 — *»PS p56–143 vrstični prepis (F-PV-03 vinogradi; raba po parcelah)«*; resume pripravljenega `ps-transcribe-v82.mts` (val 58/61: »čaka kvoto«)
**+0 virov / +0 trditev / +0 KG v1.8 / +0 UI** — raziskovalni val (transkripcija + sodbe; per-parcelne trditve ostajajo NIČ po §4)

---

## 1. Kontekst

Val 57 je prebral PS p1–55 (1.073 vrstice); p56–143 (88 strani) je od takrat ostalo neprepisano — val 58 je celotno analizo izvedel lokalno (429 kvota), val 61 pa je dodal re-read verig in pripravil resume skripta. Skripta `raw-web-val82-2026-10/ps-transcribe-v82.mts` (prompt **VERBATIM iz val 57**, spremenjen samo obseg + izhodna mapa) je bila pripravljena; ta val jo izvede do konca.

## 2. Metoda — enojni VLM prehod @nativno (pošteno označen)

- **Vhod:** `raw-web-val56-2026-10/n083ps-pages/p056–p143.jpg` (VAČ nativni skeni ~1.200×1.020 px)
- **Izvedba:** p056–p095 (40 strani) iz parallelne seje 09:53–10:03 UTC · p096–p143 (48 strani + p096 test) 10:08–10:48 UTC — **89 VLM klicev, 0 trajnih napak, 1 retry (p121 try 2)**
- **Izhodi:** `raw-web-val82-2026-10/ps-vlm/pNNN.json` (89 datotek + transcribe-v82.log)
- **Poštenost:** enojni VLM prehod → **vse nove vrstice = PROVISIONAL** (`reading_pass: "v82-native-pass1"`) — §4: brez neodvisnega 2. branja ni per-parcelnih trditev; agregati = kvalitativni. KG v1.8 / story_id / timeline / deleži **NESPREMENJENI** (§22).
- **Neodvisna kakovostna kontrola (avtorski odtis):** direkten Read p100 @nativno — imena se skladata (Brünig klastер, 15+ vrstic); **Kultur stolpec = dvovrstični opisi, VLM SKRAJŠA** (»Ackerland und Wieswachs mit Baumbestand« → »Ackerland«); **no_blatt »111« = rimska III** (F15); številke @nativno neodločljive brez zooma → kvantitativna uskladitev čaka re-read.

## 3. Vgradnja — register 2.871 vrstic / 143 strani

`ps-n83/build-register-v82.py` (determinističen, fail-fast guardi: 1.073 vrstic / max p55 / 143 page-records / 88 NOT_READ):

| | p1–55 (val 57/61, nespremenjeno) | p56–143 (val 82, novo) | skupaj |
|---|---|---|---|
| vrstice | 1.073 | **1.798** | **2.871** |
| strani READ | 55 | **88** | **143/143** |
| reading_pass | — (v57 + re-read korekcije 38/39/45) | v82-native-pass1 | — |
| vrstice s haus_no | — | 1.643 (172 distinct hiš) | — |

- page-records.json: 143 vnosov, vsi READ; p56–143 z `reading_pass`
- `build-qa-v82.json`: **0 napak, 19 QA flagov** — no_blatt vrzeli (p62/65/66/101/102/104 …) + **F15: no_blatt=111 na sheetu »III.« (p96, p100)** — vse dokumentirane, NIČ tiho popravljenih

## 4. Sodbe (analysis-v3.json, `build-analysis-v3.py`)

### F-PV-03 — KVALITATIVNO-POTRJENO-V82 (napoved val 74 izpolnjena)
Falsifikabilna napoved: »PS p56–143 MORAJO vsebovati vinogradne parcele« — **POTRJENO**:

| stran | št. | oblika | primer |
|---|---|---|---|
| p98 | 8 | sestavljeni kulturni bloki »Acker, Wiese, Reb, Hofraithen« | h.24/25/26/27/29/33/92 |
| p101 | 2 | čista »Reben« | h.26, h.28 |
| p111 | 1 | »Reb« | h.5 |
| p121 | 1 | »Reben Laumen« + [rot] »alte« | h.10 |
| p124 | 2 | »Reb« | h.3, h.63 |

Skupaj **14 novih Reb vrstic** (+5 v p1–55, ki jih je val 58 štel v anmerkah). **KVANTITATIVNA uskladitev s PV (7 J 665 K ≈ 0,61 %) NI izvedljiva** iz enojnega prehoda: jaethe/klafter razporeditve nezanesljive (p121 J=»1725« brez K; sestavljeni bloki per owner, ne per parcela) → čaka neodvisen re-read. Status v `pv-land-use-1825.json`: `DOKAZ-ZA-RE-READ` → `KVALITATIVNO-POTRJENO-V82` (izjava z dokazi; per-parcelne trditve NIČ).

### F-PV-02 — OPEN (razširjena evidencia)
Wald raba: **88 vrstic p1–55 + 54 vrstic p56–143 = 142** (regex `\bwald`, kultur polje). PV ostaja Wälder = 0 → napetost dokument-vs-dokument **ostaja OPEN**; kvantitativna razlaga (Weidewald/Ödungen kontekst) čaka re-read. Nič tiho razrešeno.

### F15 — GENERALIZIRANA
»Nro. des Blattes« semantika nezanesljiva čez celoten PS: rimske številke → števke (III → 111; p96/p100), Uebersetzung zaporedja → no_blatt (**379 vrstic z no_blatt > 1000**, npr. 971–999, 1290–1292, 2007+). Vse vrednosti hranjene KOT PREBRANE (REVIEW).

### F11 — veriga material podaljšan, neverificiran
Summa/Fürtrag vsote iz p56–143: **123 vnosov** izluščenih v page-records (npr. p100 »28 curig 16|49« + rdeča »13|673«). Monotona kontrola proti 13-točkovni verigi val 61 **NI izvedena** (enojni prehod) — surov material za re-read.

## 5. Kultura agregati (kvalitativni)

p56–143 top: Acker 433 · ? 371 · Wiese 207 · Ackerland 77 · Hutweide 61 · Lößig 61 · Wald 49 (prvi token; regex skupaj 54) · Gartn 46 · Wey 38 · Lipiza 21 … — dvovrstični kultur opisi so SKRAJŠANI (odtis p100) → **deleži NE primerljivi s PV brez re-reada**.

## 6. Surovine in artefakti

- `raw-web-val82-2026-10/` — ps-transcribe-v82.mts (prompt verbatim val 57) + ps-vlm/ (89 JSON + log)
- `ps-n83/build-register-v82.py` → register.json (2.871) + page-records.json (143) + build-qa-v82.json
- `ps-n83/build-analysis-v3.py` → analysis-v3.json (F-PV-02/03, F15, F11; v1/v2 arhivirana)
- `atlas-1825/build-pv-1825.py` → pv-land-use-1825.json (findings F-PV-02 dopolnjena, F-PV-03 status; **aritmetična vrata I1–I4 pri regeneraciji ZELENA — velika 1221 J 1573 K nespremenjena**)

## 7. QA

- **519/519 testov** (509 + 10 novih val-82 varovalk v `tests/ps-n83-analysis.test.ts`: števci registra, reading_pass PROVISIONAL, page-records 143, F-PV-03 strani 98/101/111/121/124, F-PV-02 88+54=142, F15 379, F11 123, p1–55 nespremenjeno vključno s korekcijami 38/39/45, skripte obstajajo)
- tsc čist · lint čist · verify-i18n 1074×5 zeleno
- api-smoke: **DB-odvisni preverbi v tem peskovniku NE izvedljivi** (globalni `DATABASE_URL` = `file:` URL peskovniškega scaffolda, ne Neon — /api/health 503; ni lokalnega Postgresa) — **blokada okolja, ne kode**; ročno verificirano: atlas coverage/evidence/story/map/georef/timeline = 200, coverage `val: 81` (runtime artefakti NESPREMENJENI — §22). Polni smoke teče v CI na PR z lastnim PostgreSQL 17.
- e2e: ni potrebno (ni UI sprememb; src/data/ nespremenjen)

## 8. Naslednje

1. **PS p56–143 neodvisen re-read (2. prehod)** — kvantitativne agregate (Reb vsote vs PV 7 J 665 K, Wald, Fürtrag veriga 123 točk) iz PROVISIONAL dvigniti na soglasje ≥ 2 (§4); takrat šele KG SRC-PS coverage posodobitev (§22)
2. PZ p48–65 2. prehod (protokoli + Zusammenstellung A/B — p65 REVIEW)
3. PT p7 @300dpi (KG-F01/F04); PR Grenz-Beschreibung (F-PZ-05)
4. izven peskovnika: zunanji Rektifikacijski protokol (F-PZ-04 Δ 3 J), šolski list / SA Podzemelj / SI AS 749 / Zucchelli
