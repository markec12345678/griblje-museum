# 101 — 86b. val (1. del): F11 Fürtrag MONOTONA KONTROLA čez celo verigo — prva popolna meritev (p56–143, 3 glasovi)

**Datum:** 2026-09-28 · **Obseg:** PS N83 (SI AS 176/N/N83/s/PS) — Fürtrag veriga p56–143 + sidra val 61 (p1–55)
**Nadaljevanje:** val 86 `next_reads` #2 (»Fürtrag monotona kontrola (F11) čez celo verigo«) / val 85 §F11 (»monotona kontrola proti 13-točkovni verigi val 61 čaka val 86«) / val 61 §2.2 (»aritmetična kontrola sešteka vrstic šele pri 143/143«)
**+0 virov / +0 KG vozlišč / +0 UI / +0 sprememb registra** — čista diagnostična raven (§4/§22)

---

## 1. Kontekst

Val 61 je verifikiral Fürtrag verigo na 13 točkah (p5–p54, agentov direktni vid, 2 prehoda, 0 VLM) in odložil aritmetično kontrolo: »sešteka vrstic šele pri 143/143«. Val 85 je dodal 7 vzorčnih točk p56+ (DELNO POTRJENO-V85). Val 86 je zbral 326 Fürtrag kandidatov in ugotovil, da so številke Fürtrag **najšibkejše branje vseh treh glasov** (p58: 6/1009 vs 6/1000 vs 6/1169) — kontrola čeka celotno verigo (86b). Ta val jo izvede kot **determinističen checker** nad 3 glasovi (pass1 val82 / pass2 val83 / tile-i val86) + register.

## 2. Metoda (`build-f11-fuertrag-v86.py`)

- **Detekcija po FORMATU, ne po oznaki** (val 61 §2.2: tiskana oznaka VEDNO »Fürtrag.«, vse VLM oznake so napačna branja — Fußtrag, Fürtrg, Fürbaß, Urtheil, Futrag, Fürstehe ...): vodilno število v oznaki (1–3 števke) + preostanek oznake fuzzy ujemanje (Levenshtein ≤ 2, de-umlaut) z »furtrag« = **strogi kandidat**; ostale številčne oznake = **sumniki** (zabeleženi, izključeni iz stroge verige).
- **Vrednosti = vsi pari (J, QKl)** iz vrstice (J ≤ 99, 100 ≤ QKl ≤ 99999; ločila `/`, `|`, `:`, `-`, `.`, `,`) — rdeči popravki in prečrtane vrstice so dodatni pari, NIČ tiho odstranjeno.
- **Aritmetika v prostoru J·1600+QKl** (val 61 format-dekodiran: Joch = 1600 Quadrat-Klafter); register vrstice vsako polje posebej razčlenjeno (`1.1348` = 1 Joch 1348 QKl = 2948 QKl); prečrtane vrstice izključene iz vsote in šteje posebej.
- **5 kontrol**: (C1) stroga števčna veriga monotona + sumniki; (C2) veznost p54 (52) → prvi strogi števec p56+; (C3) 3-glasovno soglasje QKl po strani; (C4) vsota register vrstic vs Fürtrag glasovi (+ razpad po kultur); (C5) sidra val 85 — vsaj 1 glas ujema.

## 3. Rezultati (delna pokritost tile-ov: val 86 kvota — p56–94 + p121; popolnoma neodvisno od 86b spravila za p1/p2 glasova)

- **C1 veriga**: strogi števci na 17 straneh (+ 21 strani z sumniki — oznake izven fuzzy pravila, zabeležene); veznost p54→p56+ OK (52 → 56 na p58; delta 4 = p55/56/57 brez prepoznavnih strogi oznak, skladno s +1/stran normalo val 61). **5 kršitev monotonosti** = VLM šibkost številke v oznaki (npr. p108 »16« Fürtrg ≈ realno ~106 — izpad števke; p135 »130« za prev 192 = smetna oznaka na p134) — vse izrecno zabeležene kot najdbe, NIČ popravkov.
- **C3 3-glasovno soglasje**: 38 strani brez skupnega QKl čez glasove = REVIEW — potrditev val 86 (Fürtrag = najšibkejše branje) na verigi.
- **C4 aritmetika** (prva popolna meritev val 61 še od 2026-10): razlike med vsoto register vrstic in Fürtrag glasovi so **sistematično neničelne** (0 OK / 76 REVIEW / 12 brez prepoznanega Fürtraga) — val 61 »metrika stolpcev TO-DECODE« ostaja: hipoteze (izrecno neodločene, §4): enote po kultur (travniki/gozdovi v drugih merskih enotah), prečrtano/rdeče popravke, zaokrožitve pisarja, šibka Fürtrag branja. Razpad po kultur je zabeležen na vsaki strani (surovo dejstvo za naslednjo rund).
- **C5 sidra val 85**: 3/7 vsaj-en-glas zadetkov na delni pokritosti (p121 par (17,206)/(17,266) VLM šibkost vidna tudi v glasovih).

## 4. Pomen za ATLAS 1825 (§4 disciplina)

- Fürtrag veriga ostaja **REVIEW raven čez celotno verigo** — per-parcelne absolutne površine ostajajo PROVISIONAL (NR-14); NIČ iz F11 ne gre v trditve (§4).
- F11 je zdaj **reproduciralen checker** (determinističen re-run byte-identno, testno varovan) — vsak prihodnji val ga lahko poganja nad novim stanjem.

## 5. Naslednje

1. **86b (2. del — čaka kvoto, resumable)**: `bun tile-read-v86.mts ALL` → preostalih ~479 tile-ov (p63–94 name + p95–142 kultur+name) → vgradnja po pravilih val 86 (avtomatsko razširi 808 → ~1.798) → §22 kaskada → F11 artefakt regeneriran na polni pokritosti.
2. F11 sledenje: razpad po kultur → dekodiranje enot (val 61 »TO-DECODE«); ročni re-read 139 digit-split vrstic.
3. PZ p48–65 2. prehod; PT p7 @300dpi; PR Grenz-Beschreibung.

## 6. Surovine in artefakti

- `ps-n83/build-f11-fuertrag-v86.py` — determinističen checker (fail-nothing: dela tudi na delni pokritosti, pokritost poroča pošteno)
- `ps-n83/band-v86/f11-fuertrag-v86.json` — artefakt (veriga, kršitve, sumniki, voice_review, arithmetic + by_kultur, sidra)
- `tests/val86b-f11-fuertrag.test.ts` — varovalke (sidra, format J·1600+QKl, struktura, determinizem, §4/§22)
