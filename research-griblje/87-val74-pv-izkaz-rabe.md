# 87 — Val 74: PV N83 — IZKAZ RABE ZEMLJIŠČ [373418] — PREPIS Z ARITMETIČNIMI VRATI

**Datum:** 2026-09-26 · **Baza:** main @ e9a36b1 (val 73) · **Branch:** `feat/val74-pv-land-use`
**Naročilo:** worklog val 73 → naslednji korak: »ob kvoti re-readi … PV (Ausweis über die
Benützungsart [373418] — naslednji vir za rabo 2035 parcel)«

---

## 1. PRELOM: PV je javno dostopen na VAČ

Val 47 je ugotovil, da šolski list [4118864] NI izpostavljen (brez uodid/docid). **PV
[373418] pa JE:** `file?uodid=373418&id=41783` — celoten dokument prenešen
(`tifyPdfDownload`, 485 kB, 1 stran) + nativni sken **2139×1435** (pymupdf, metoda
val 56). Prvič v zgodovini projekta je vir rabe zemljišč javno prebran.

## 2. Vir: AUSWEIS über die Benützungsart des Bodens für die Gemeinde Grüble

- **Provinz Illyrien · Kreis Neustadtl · District Krupa · Gemeinde Grüble** (+ zapis "4")
- **Datirano: "am 10ten Jänner 18[25]"** — ISTI DAN kot PUA p49 zaključek ("um 10. Januar
  1825", val 51/56) → končni protokoli in izkaz rabe so nastali v istem uradnem dejanju
- žig "III. O.", svinčnik "93", parafirano; kraj izdaje (začetnica M/G, kurent) = UNCERTAIN,
  ni interpretirano

## 3. Transkripcija (2 neodvisna prehoda + aritmetična vrata)

Tabela I — kulture (Joch | Quad-Klafter):

| kultura | J | K | m² | delež |
|---|---|---|---|---|
| Gemüse-Gärten (zelenjavni vrtovi) | 2 | 133 | 12.000 | 0,17 % |
| Wein-Gärten (vinogradi) | 7 | 665 | 42.673 | 0,61 % |
| Wiesen (travniki) | 76 | 1480 | 442.635 | 6,30 % |
| Wiesen mit Obstgärten | 12 | 328 | 70.237 | 1,00 % |
| **Weiden (pašniki)** | **636** | **263** | **3.661.968** | **52,06 %** |
| **Äcker (njive)** | **413** | **870** | **2.379.913** | **33,84 %** |
| ostale 9 kategorij (Obst/Zier/Hopfen/Sümpfe/…) | 0 | 0 | 0 | 0 |
| **Ganz-Aren (vsota I)** | **1148** | **539** | | |

Tabela II — posebno: **Ödungen 1|476 · Flüsse oder Bäche 21|142 · Weg-Parzellen 46|1127 ·
Bau-Parzellen 4|889** (ostale 10 kategorij 0) → **vsota II = 73|1034**.

**Area der ganzen Gemeinde: 1221 J 1573 K = 1.956.373 QKlft = 7.032.073 m² ≈ 7,032 km²**
(1 Joch = 1600 QKlft; 1 QKlft = 3,59665 m²).

**Aritmetična vrata (I1–I4, fail-fast)** — odločala so dvomljive kurrentske števke,
vsaka odločitev dokumentirana:
- Gemüse Klft **133** (ne 193) — sicer se vsota I ne zapre
- Wein Joch **7** (ne 5) — sicer se vsota I ne zapre
- Weg Klft **1127**, Bau Klft **889** — sicer se vsota II ne zapre
- velika vsota **1221** (ne 1225) — sicer se I+II ne zapre

Vsa tri nivoja so se zaprla **NATANČNO** (do enega Klafterja).

## 4. Najdbe

- **F-PV-01 (RESOLVED-V74):** prepis z aritmetičnimi vrati na vseh treh nivojih.
- **F-PV-02 (OPEN, §14):** **napetost gozd** — PV poroča Wälder = 0, PS (delni 55/143) pa
  13 parcel z rabo "Wald". NI tiho razrešeno (možnosti: Weidewald pod Weiden; majhne
  površine pod Ödungen; PS kontekst). Resolucija = PS p56–143 + PZ (Konskripcija 1830,
  71 strani, prav tako javno dostopna — naslednji val?).
- **F-PV-03 (dokaz za re-read, falsifikabilno):** vinogradi 7 J 665 K ≈ 4,27 ha — v
  prepisanih PS p1–55 NI ENE vinogradne parcele → **PS p56–143 MORAJO vsebovati
  Weingarten** (napoved; ko jo re-read ovrgne, je transkripcija napaka — čista §14 disciplina).
- **F-PV-04 (nova trda številka):** Bau-Parzellen 4 J 889 K ≈ **26.216 m²** uradni agregat
  stavbnih parcel k.o. Grüble (§15: brez geometrije, ampak uradna vsota obstaja).
- **F-PV-05 (struktura):** pašniki 52,06 % površine (≈ 3,66 km²) + njive 33,84 % — kraška
  pašniška struktura, skladna s PUA so-referenciranimi skupnimi parcelami (val 60: 417).

## 5. Vgradnja (deterministično, regenerabilno)

- **`research-griblje/atlas-1825/build-pv-1825.py`** → **`pv-land-use-1825.json`**
  (invarianti I1–I4 fail-fast; pretvorbe + deleži; findings; pravilo: PV = agregat,
  NIKOLI raba posamezne parcele §4)
- **KG v1.6** (val 74): SRC-PV `coverage: "TRANSCRIBED 1/1 (val 74, aritmetična vrata
  I1–I4)"`; ID-ji/claims/edges/koordinate NESPREMENJENI (3.309/3.569/622) → kg_sha256
  `809ef581…` → story_id se spremeni po §22 pogodbi (pričakovano, kot val 72)
- **coverage** (PASS 8 rebuild): viri **10 VERIFIED / 3 PARTIAL** (PR/PG/PZ); transcription
  blok +PV; next_reads posodobljeni (PS p56–143 z napovedjo vinogradov F-PV-03; PZ za F-PV-02)
- **story engine** (3 besedila): "PV je naslednji vir za prepis" → **"PV prepisan (val 74):
  uradne agregatne površine (njive 413 J 870 K, pašniki 636 J 263 K …; skupaj 1221 J 1573 K),
  ne pa raba posamezne parcele"** — zgodba hiše + zgodba vasi §18
- raw: `research-griblje/pv-n83/` (N083PV.pdf + PV-p1-native.jpeg + izrezki 2×–8×)

## 6. QA

- **testi:** nov `tests/pv-land-use.test.ts` (13 testov: vrata I1–I4 preverjena NEODVISNO
  v TS iz surovih celic, struktura 1825, provenanca, F-PV-02 OPEN, F-PV-03 falsifikabilna
  napoved, F-PV-04, KG v1.6 stabilnost, zgodba vasi/hiše z novim besedilom) + posodobljeni
  (KG v1.5→v1.6, val 72→74, viri 9/4→10/3, "NI še dokumentirana po parceli") → **453/453**
- **api-smoke** +2 → **95/95** (zgodba vasi z 1221 J 1573 K brez stale besedila; coverage
  viri 10/3 s SRC-PV VERIFIED)
- **tsc / lint / verify-i18n** čisti (1032 × 5, brez novih ključev — vsebina je SL-only story tekst)
- **agent-browser e2e:** zgodba vasi dialog ✓ (agregat viden, stale tekst odsoten), 0 konzolnih napak

## 7. Naprej

1. **PS p56–143 re-read** (88 strani; per-parcelna raba; F-PV-03 napoved vinogradov)
2. **PZ — Konskripcija 1830 [373419, 71 strani]** — prav tako javno dostopen (preverjeno
   v val 74)! Razreši F-PV-02 (gozd) + prebivalstvo 1830 = prvi časovni korak §20
3. ob kvoti PT p7 @300dpi (F-GEO-03) · izven peskovnika šolski list/SA Podzemelj/SI AS 749
