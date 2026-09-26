# Val 75 — PZ N83: Katastral-Schätzungs-Elaborat (Konskripcija) [373419] — PREHOD 1 + ključna branja

**VAČ**: uodid 373419 · docid 41784 · 71 strani · PDF 13.154.552 B · `research-griblje/pz-n83/`
**Naročilo** (worklog val 74 → naslednje): *»PZ Konskripcija 1830 [373419] — javno dostopen, razreši F-PV-02 + prebivalstvo 1830 (§20 time slider prvi korak)«*

---

## 1. Prelom: dostop do VAČ

curl (vse verzije) je zavračan približno 0,5 s po Client/Server hello — **nepopolna TLS veriga strežnika** (python: `certificate verify failed — unable to get local issuer certificate`). Python `urllib` z unverified SSL context deluje. Prenos: streaming 13,2 MB v 43 s.

> Ponovno uporaben vzorec: `urllib.request.urlopen(req, context=ssl._create_unverified_context())` — curl za VAČ v tem peskovniku ni uporaben.

## 2. Vir

> **CATASTRAL-SCHÄTZUNGS-ELABORAT der Gemeinde Grüble** · Land Krain, Kreis Neustadtl, Steuerbezirk Krupp (Krupa), **Schätzungsdistrict N° 83** · 71 strani, brez besedilne plasti (čisti skeni 1.117–2.857 px)

Datiranje: §3 = *»Auf den Conscriptioins-Revisions-Resultaten vom Jahre **1830**«* (p2); protokoli 9. 3. / 5. 4. / 28. 4. 1830[?] (p32/40/41); Nachtrag 5./27. marec 1829[?] (p70–71). Delovna oznaka **»Konskripcija 1830«** (po val 42/74); dokument obsega 1828/29–1830.

## 3. PREHOD 1 — struktura (71/71 strani)

8 kontaktnih plošč (9 strani/pl.) → strukturni zemljevid vseh 71 strani (v builderju `structure_map`):

| strani | vsebina |
|---|---|
| 1 | Naslovnica elaborata |
| 2 | §2 Gränzen (meje) + §3 **Bevölkerung** (1830) |
| 3 | §1 Einleitung/Topographie + skupna površina |
| 4 | §4 **Viehstand** (živina) |
| 5–11 | Feld-Culturen, Wege, §8 tabela, §9–§11, Schätzung des Landesortes |
| 12–19 | Acker/Wiesen klase + Natural-Ertrag tabele |
| 19–24 | Kleine/Größere Gärten, §7 Weingärten, Hutweiden, Weide und Waldnutzen |
| 25–30 | Kulturdienstreibung-Elaborat + Zusammenstellung (ležeča tabela) |
| 31–41 | **PROTOCOL + Rektifikations-Protokoll 1830** (žirija, podpisi, pečati) |
| 42 | Einwands-Protokoll (ugovori) |
| 43–47 | Reinertragstabellen per class (parcelne številke) |
| 48–49 | Communications-Protokoll (rožnat papir) |
| 50–61 | Verantwortlichung des Cultural-Ausweises (zelen papir) — Darstellung des Rein Ertrages |
| 62–65 | Zusammenstellung B (Renta/Capitalwerth) + A (Cultur-Aufwand) |
| 66–67 | **SPECIFISCHER AUSWEIS — Endresultate** (glavna ležeča tabela) |
| 68–71 | Protokoll + Nachtrag 1829 |

## 4. PREHOD 2 — ključna branja (2 neodvisna prehoda, dokazni izrezki `z-*.jpeg`)

### 4a. Prebivalstvo 1830 (§3, p2) — ARITMETIČNA VRATA I1

> *»Auf den Conscriptioins-Revisions-Resultaten vom Jahre 1830 und fällt die ganze Bevölkerung dieser Gemeinde an: an Männlichen **222** ‖ an Weiblichen **219** ‖ Zusammen **441 Seelen**, sonst(?) in **70 Häusern** … und **102 Familien** oder Hofesgesessene«*

**222 + 219 = 441 — EXACT ✓** (vrata I1 fail-fast). → **F-PZ-02 RESOLVED**: prvi podatkovni korak za §20 (1825 → **1830** → …). Dokaz: `pz-n83/z-bevoelkerung.jpeg`.

### 4b. Živina 1830 (§4, p4)

**124 Ochsen · 20 [Kühe|Rosse REVIEW] · 30 Jungvieh · 150 Schafe gesamt · 30 [Lämmer REVIEW]** — števci jasni v obeh prehodih, oznake vrst delno dvoumne → **F-PZ-03 PARTIAL** (nič se ne ugiba, §4). Doplaša F-PV-05 (kraška pašniška struktura). Dokaz: `pz-n83/z-viehstand.jpeg`.

### 4c. Skupna površina (§1, p3) — VRATA I2 + prečna validacija z PV

> črno (prečrtano): **1235 Joch 1516 Klafter** → rdeči popravek: **1220 Joch 1493 Klafter**

| vir | vrednost | QKlft |
|---|---|---|
| PZ §1 rdeči popravek | 1220 J 1493 K | 1.953.493 |
| PV (val 74) | 1221 J 1573 K | 1.955.173 |
| **Δ** | | **1.680 QKlft = 0,086 %** |

**Dva neodvisna dokumenta se ujemata na <0,1 %** → **F-PZ-01 RESOLVED** (vzrok rezidualnega Δ: UNKNOWN — zaokroževanje vs. ponovna meritev). Vrata I2 fail-fast (≥1 % = napačno branje). Dokaz: `pz-n83/z-area-digits.jpeg`.

### 4d. Endresultat (p67 Specifischer Ausweis)

| N° | kultura | classe | Joch | □Klafter |
|---|---|---|---|---|
| 1 | Aecher | I | 80 | 842 |
| 1 | Aecher | II | 334 | 120 |
| 2 | Wiesen | I | 15 | 1594 |
| 2 | Wiesen | II | 39 | 818 |
| 3 | Kleine Gärten | C | 3 | 615 |
| 4 | Größere Gärten | C | – | 105 |
| 5 | **Weingärten** | C | **7** | **42** |
| 6 | Hutweiden | C | 118 | 702 |
| 7 | **Weiden mit Holznutzen** | C | **558** | **846** |
| 8 | Baucarea[?] | – | 1 | 1499 |
| — | **Summa** | – | **1132** | **495** |

- **Aecher I+II = 414 J 962 K** — aritmetično skladen s §8 črnimi vrednostmi (p6) ✓ (2. prehod je popravil 234→**334**)
- **F-PZ-04 OPEN**: vsota vrstic 1–8 = 1159 J 783 K = 1.855.183 QKlft ≠ zapisana Summa 1132 J 495 K = 1.811.695 QKlft (Δ 43.488 QKlft ≈ 27,8 Joch). **Nič se ne vsiljuje (§4)**; rešitvene poti: p30 Zusammenstellung, p63/p65 ležeče tabele, 3. prehod Summe.
- **F-PZ-06 RESOLVED**: Weingärten §7 (p21): *»Einzige Classe — Flächenraum von 7 Joch 42 Klafter«*, Mustergrund parcela N°2494[?] (260 Klf[?]); rdeča revizija 6 J 1059 K. Joch 7 = PV Wein-Gärten 7 J ✓.

### 4e. GOZD — F-PV-02 razrešena na ravni kategorij (F-PZ-08 RESOLVED)

PZ Endresultat ima **»Weiden mit Holznutzen« 558 J 846 K ≈ 3,224 km²** kot lastno kategorijo; ločenih »Waldungen« NI.

| vir | gozdna kategorija |
|---|---|
| PV 1825 (forma) | **Wälder = 0** (formalna kategorija) |
| PS (prepis p1–55) | 64 vrstic 'Wald' + 19 'Wald.' + Lohholz … (per-parcelni izrazi) |
| PZ 1828/30 | **Weiden mit Holznutzen 558 J 846 K** (ločenih Waldungen ni) |

→ **razlaga napetosti**: gozd v Gribljih 1825–30 je **gozdno-pašniška (silvopastoralna) raba** — lesna paša, ne zaprt gozd. Per-parcelni PS izrazi ostajajo nespremenjeni (§5); celotna preverba čaka PS p56–143. Hkrati **F-PZ-09 RESOLVED**: ps-n83/register.json vrstice pokrivajo **Samo p3–55** (1073 vrstic) — p56–143 je bil val 61 strukturno prebran, ne prečrtan po vrsticah; F-PV-03 (vinogradi v PS p56–143) ostaja OPEN.

### 4f. Meje (§2, p2) — F-PZ-05 REVIEW

severno Kreising[?] · vzhodno **Kolpa** + Adelschitz[?] · južno Weidendorf[?] · zahodno Tröbusche[?] + Kreising[?] — topokonimi REVIEW (razrešitev: PR Grenz-Beschreibung re-read). »Weidendorf« kryža F-A05-01 (val 66).

### 4g. Protokoli 1830 (p31–41) — F-PZ-07 TO_VERIFY

Žirija (podpisi): Georg Juritschnik[?] · Georg Madronitsch[?] · Georg Brodnik[?] · Georg Pintar[?] · Georg Puschner[?] … + pečati. **Osebna identitetna dela NI izvedena** — nič KG PERSON vozlišč brez identitetne preverbe (§5).

## 5. Vgradnja

- **`build-pz-1825.py`** → `pz-konskripcija-1830.json` — fail-fast I1 (222+219=441) · I2 (PZ↔PV < 1 %) · I3 (Endresultat struktura); Summa kontrola = najdba, NI invarianta
- **KG v1.7**: SRC-PZ `coverage: TRANSCRIBED_PARTIAL (val 75)` + **KG-F09**; nodes/edges/claims/ID-ji NESPREMENJENI (3.309/3.569/622); kg_sha256 b150db19… → story_id spremembe po §22 pogodbi
- **coverage rebuild (val 75)**: transcription +PZ (delni); viri 10 VERIFIED / 3 PARTIAL (nespremenjeno); SRC-PZ/PS/PR/PG/KO opombe v API-ju (`note` per vir); next_reads posodobljeni; PS pokritost popravljen besedilno (F-PZ-09)
- **story engine**: zgodba vasi §18.1 + prebivalstvo 1830 item (TRANSCRIBED, SRC-PZ); §18.6 + PZ item (Weiden mit Holznutzen, F-PV-02); §18.10 next-viri besedilo

## 6. QA

- **tests/pz-konskripcija.test.ts** — 13 testov/115 expect: I1/I2/I3 neodvisno v TS, F-PZ-04 OPEN varovalka, živina statusi, struktura 71/71, KG v1.7, zgodba vasi (10 sekcij + PZ items)
- celotna svežina: **466/466** (453 + 13) · api-smoke **97/97** (+2 PZ) · tsc čist · lint čist · verify-i18n 1032 × 5

## 7. Naprej

1. **§20 TIME SLIDER arhitektura** (val 76?): podatkovni model časovnih točk (1825 referenčna + 1830 prvi korak) + API + UI, pošteno: točke brez virov = izrecno AWAITING_SOURCE
2. PZ celotni vrstični prepis (66 strani brez strukturnega branja) + Summa kontrola (F-PZ-04)
3. PS p56–143 vrstični prepis (F-PV-03 vinogradi) — ob VAČ kvoti
4. PT p7 @300dpi (F-GEO-03) · izven peskovnika: šolski list / SA Podzemelj / SI AS 749 / Zucchelli
