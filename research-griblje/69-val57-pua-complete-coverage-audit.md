# 68 · Val 57 — PUA COMPLETE COVERAGE AUDIT (issue #42 PASS 1)

**Datum:** 25. 9. 2026 · **Sprožilec:** uporabnikov task »PUA COMPLETE COVERAGE AUDIT« (9 točk) + issue #42 (ATLAS 1825, PASS 1: »Najprej podatki«)
**Vir:** SI AS 176/N/N83/s/PUA — »Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde GRÜBLE« (1825), VAČ docid 41782, 49 digitaliziranih strani
**Vprašanje, na katru task odgovarja:** *»Ali imamo za Atlas 1825 res celoten PUA material in smo ga sistematično pregledali?«*
**Diskiplina:** ne spreminjaj muzejske UI · ne ustvarjaj novih zgodovinskih trditev brez primarnega dokaza · ne popravljaj nejasnega zapisa z ugibanjem · »ni najdeno« ≠ »ne obstaja«.

---

## §0 · Povzetek (en odstavek)

Vseh **49/49 strani PUA je lokalno prisotnih, veljavnih in sistematično prebranih** (3 prehoda val 51 + PDF-native re-branja vseh prej okrnjenih/problemnih strani val 56/57). Audit je odkril in **zapolnil 4 manjkajoče vpise** (51, 52 na p26; 85, 86 na p42 — starejši skeni so bili odrezani, PDF-native strani so vsebine), **razrešil hišni blok p6** (no.7 = h.43, no.8 = h.63 — starejši »70/66« so napačna branja pri 667 px), **potrdil letnico zaključka 10. Jänner 1825** (3:1) ter **dvignil vezavo BP 90 ↔ h.43 na dvojno virno soglasje** (PUA no.7 + PT bp90, oboje digit-by-digit). Končni register: **98 vpisov, 54 hišnih številk, 2.645 parcelnih referenc**. Material in pregledanost: **POPOLNA**; preostale 5 nerešenih reading-točk je dokumentiranih in ne blokirajo izvlečka Atlas 1825 (glej §9).

---

## §1 · INVENTORY — tabela po straneh

**Vir PDF:** `N083PUA.pdf` (6,9 MB, PDF 1.4, producer *LuraDocument PDF v2.16*), **49 strani** (pymupdf potrditev). **OCR/text layer: NE OBSTAJA** (`get_text()` = 0 znakov na vseh preverjenih straneh; tudi `pdf-raw-text` VAČ endpointa vrača prazno — dokumentirano že val 56).
**Lokalne datoteke:** 49 primarnih JPEG predogledov (val 47, ~665×1029 px) + 5 reševalnih variant (`p26-salv`, `p27/p29/p40-recovered`, `p42-salv`) = 54 datotek v `research-griblje/raw-web-val48-2026-10/n83-pua-pages/`.
**Nativna ločljivost:** PDF-vgrajeni rastrji ~1.313–1.400 × 2.140–2.151 px (≈ 2,1× predogledov); pasovni izrezi 300 dpi (~2.776×4.284) za p4/p5/p6/p7/p18/p26/p30/p39/p42/p47/p49 (val 56).
**Številčenje datotek:** file order = VAČ manifest order (1:1 z PDF stranimi). Natisnjena foliacija ni bila sistematično transkribirana; posamezni najdeni odtisi (p26: »VI« desno zgoraj; p49: listni signal) so dokumentirani, ne usklajeni — glej §8.

| PUA page | lokalna datoteka | PDF valid | nativna ločljivost | OCR layer | pregledano | opombe |
|---|---|---|---|---|---|---|
| 1–2 | p01/p02.jpg | ✅ (EOF + PIL) | ~947×658 / ~1.313×2.140 | ❌ | ✅ 3× (val 51) | naslovna bloka, 0 vpisov |
| 3–25 | p03–p25.jpg | ✅ | ~1.366–1.390×2.142 | ❌ | ✅ 3× (val 51) | blok 1: vpisi 1–50, 2 vpisa/stran (p11/p15 po 4 bralne vrstice — dup. št. 20, 70/71) |
| **26** | p26.jpg (+ p26-salv) | ⚠️ predogled odrezan · **PDF ✅** | 1.391×2.145 | ❌ | ✅ **native val 57** | **NOVO: vpisa 51 (h.27) + 52 (h.29)** — 667px verzija je imela samo naslovni blok |
| 27, 29, 40 | p27/p29/p40.jpg + recovered | ⚠️ originali nepopolni (EOF) · recovered ✅ | ~1.390×2.142 | ❌ | ✅ po recovered verzijah (val 51) | številčenje bloka 2 nestabilno (§5) |
| 28, 30–39, 41 | p28, p30–p41.jpg | ✅ | ~1.390×2.142 | ❌ | ✅ 3× (val 51); p30/p39 + 300 dpi (val 56) | p30 no.59 »19. Pp.« znak-po-znak potrijeno (val 56) |
| **42** | p42.jpg (+ p42-salv) | ⚠️ predogled odrezan · **PDF ✅ ampak vir sam odrezan na dnu** | 1.400×2.151 | ❌ | ✅ **native val 57** | **NOVO: vpisa 85 (h.60) + 86 (h.71)**; 86 brez parcel — rez je v digitalizatu (§8) |
| 43–46 | p43–p46.jpg | ✅ | ~1.390×2.142 | ❌ | ✅ 3× (val 51) | p44 no.90: »Uebersprungene Parzellen Nummer« (§5) |
| 47 | p47.jpg | ✅ | 1.384×2.145 | ❌ | ✅ 4× (val 51 pass3 + val 56 native 2× + val 57 digit-by-digit) | no.95 Zollamt h.70 + »B. P. 98.« — 4× potrjeno |
| 48 | p48.jpg | ✅ | ~1.390×2.142 | ❌ | ✅ 3× (val 51) | no.96 Wiese in der Gemeinde + zaključni seznami po sekcijah |
| 49 | p49.jpg | ✅ | 1.339×2.145 | ❌ | ✅ 4× (val 51 + val 56 + val 57 native + closing-zoom) | no.97 Zucchelli, parcela 2700, zaključna formula + 2 podpisa + Zeugen |

*(Strojna različica: `raw-web-val57-2026-10/pua-inventory.json`)*

---

## §2 · PAGE-BY-PAGE COVERAGE

Načelo: vsaka stran = potencialna dokazna stran; nič ni odstranjeno samo zato, ker OCR ne vsebuje »Griblje« (OCR sloja sploh ni — branje je bilo izključno vizualno/VLM).

| stran(i) | vsebinska kategorija | dokazne ugotovitve |
|---|---|---|
| 1 | naslovna stran | »Alphabetisches Verzeichniß Der Grund-Eigenthümer der Gemeinde GRÜBLE« |
| 2 | tiskana glava tabele | struktura stolpcev (Nro., sekcija, Haus Nro., ime/Stand, parcele, Anmerkung) |
| 3–25 | blok 1 vpisov 1–50 | 2 vpisa/stran; p11 duplikat št. 20 (Baron Gradac III 748+777 vs Barbara »des Grädlers« h.6); p16 anomalia 70/71 (položaj nakazuje 30/31 — Kurrent 3↔7, NI preštevilčeno, dokumentirano); p21 no.40/41 Widhann Georg h.65/66 z opombama B.P. 46. 48. / 49. 50. |
| 26 | **vpisa 51 + 52 (nativno)** | 51: h.27, »Malleßthak[?] Han…«, 39 parcel I–IV, opomba D. P. 40. · 52: h.29, »Milleg Hanu[?]…«, 22 parcel I–II, opomba D. J. 24 34 · h.27 = nova hišna št.; h.29 = kolizija z no.78 (Schimcz Maria, p47) — dokumentirano, ne rešeno |
| 27–29 | blok 2 (nestabilen) | vpisi so prebrani, številke ne: p27 »51[?]/52[?]« (recovered branje »393/394« očitno napačno), p28 »35/36«, p29 »37/38« — z nativnim p26 (51+52) je aritmetična veriga zaprta: p27=53/54, p28=55/56, p29=57/58, p30=59 ✓ (hipoteza, NE uveljavljena v podatkih) |
| 30–39 | blok 2 rep + blok 3 | p30 59/60, p31 61/62 … p39 78/79 z opombama B.P. 95. 97. / 76. 79. 81/82. 93/84. |
| 40–41 | prehod | p40 80/81 (recovered), p41 82/83/84 |
| 42 | **vpisa 85 + 86 (nativno)** | 85: h.60, Schelko Georg[?], 25 parcel I–V, opomba B. T. 50, 51, 55. · 86: h.71, Stauger Matho[?], **parcele fizično odrezane v viru** · h.71 = nova hišna št. |
| 43–46 | rep registra 87–94 | p44 no.90: »Uebersprungene Parzellen Nummer I: 20, 161, 310, 472, 483, 682, 692, 696, 720, 882, 89? II: 637« — izrecni seznam izpuščenih parcelnih številk (§5) |
| 47 | institucionalni vpis | no.95 k.k. Zollamt, sekcija III, **h.70**, parcela 747, opomba »B. P. 98.« v nadaljevalni vrstici (4 neodvisne potrditve) |
| 48 | občinski vpis + seznami | no.96 »Wiese in der Gemeinde Grübln« + zaključni parcelni seznami po sekcijah (VI–X oznake) |
| 49 | zaključek | no.97 »Philipp De Giannuto[?] Zucchelli«, parcela 2700; »Ich Amtl[ich] bestätige am 10. **Jänner 1825**« (leto 3:1); podpisa Mumppen[?] + v Hillmayer[?]; »Zeugen:« |

**Pokritost:** 49/49 strani registriranih · 47/49 z bralnim statusom READ · p26/p42 z nativnim branjem (val 57) · 45 strani z vpisi, 4 strani brez vpisov (1, 2 naslovnici; p48 delno seznami; p49 zaključek).

---

## §3 · EXTRACT STRUCTURED EVIDENCE

**Register:** `research-griblje/pua-n83/register.json` — **98 vpisov** (94 + 4 novih val 57), vsak z: page, entry_no, section, house_no, owner_original, status_original, residence_original, parcels[] (parcel_section + parcel_number), annotation_original, transcription_confidence, review_status, uncertain_words, reading_provenance, notes (zgodovina branj val 48 → 51 → 57).

| kakovost | vpisov | delež |
|---|---|---|
| VERIFIED-2x (2× soglasje, high, brez [?]) | 45 | 45,9 % |
| REVIEW-CONFLICT (prehodi se razlikujejo) | 28 | 28,6 % |
| REVIEW (medium ali [?] besede) | 25 | 25,5 % |

**Številke:** 54 različnih hišnih številk (0–72 z vrzelmi; 0 = institucije: Commenda, Gemeinde) · 6 vpisov brez hišne št. · **2.645 parcelnih referenc** (2.559 + 86 novih) · 44 opomb (B.P./D.P./D.R./D.J./B.T./R.P./L.P. …).

**Štirje novi vpisi (val 57, nativna ločljivost, 1× branje → REVIEW):**

| nro | stran | h. | lastnik (kot prebrano) | parcel | opomba |
|---|---|---|---|---|---|
| 51 | p26 | **27** | Malleßthak[?] Han Bauw[?] Han Güßla[?] | 39 (I×21, II×5, III×3, III/IV×2, IV×8) | D. P. 40. |
| 52 | p26 | **29** | Milleg Hanu[?] Bauw[?] Han Grübla[?] | 22 (I×16, II×6) | D. J. 24 34 |
| 85 | p42 | **60** | Schelko Georg Bauersleibgäbler[?] | 25 (I×9, II×2, III×8, V×6) | B. T. 50, 51, 55. |
| 86 | p42 | **71** | Stauger Matho Bauersleibgäbler[?] | **— (rez v viru)** | — |

**Pravila, ki jih register vsiljuje (QA testi 16/16):** vsak vpis ima provenanco branj; vsaka [?] beseda označena; REVIEW ni nikoli brez obrazložitve; nič ni ugibano (številke 53–58 ostajajo hipoteza v opombah; 86 brez izmišljenih parcel).

---

## §4 · BP ↔ HOUSE CONTROL (popoln seznam BP 1–100)

**Viri matrice:** PT N83 (100 vrstic: 40 STABLE / 51 REVIEW-CONFLICT / 9 REVIEW — val 53) · PUA B.P. opombe (13 številčnih + Zollamtova nadaljevalna vrstica) · A01 zemljevid (11 lastniških vezav, val 54) · val 57 tarčna branja (digit-by-digit) · PS N83 (križni kontrola hišnih števil lastnikov — §7).

**Končni statusi (strožja logika: CONFIRMED zahteva soglasje ≥2 neodvisnih virov, ne samo obstoj reference):**

| status | bp | opomba |
|---|---|---|
| **CONFIRMED (2)** | **90, 94** | 90: PUA no.7 h.43 (digit-by-digit + opomba B.P.90. pod no.7) + PT bp90 h.43 (digit-by-digit val 57) — dvignjeno iz REVIEW-CONFLICT · 94: PT STABLE + A01 VERIFIED-2x (3 neodvisni viri, val 54) |
| PROBABLE (33) | 3, 4, 5, 6, 9, 10, 17, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 42, 43, 45, 55, 58, 62, 63, 64, 65, 66, 67, 74, 77, 83, 100 | PT STABLE (2× branje se strinja), brez neodvisnega drugega vira ali A01 REVIEW |
| **CONFLICT (54)** | 8, 11, 12, 13, 22, 30, 33, 35–41, 44, 46–54, 56, 57, 59–61, 68–73, 75, 76, 78–82, 84–89, 91–93, 95–99 | 48× PT REVIEW-CONFLICT (nestabilna branja) + **6 novih PUA↔PT nesoglasij na STABLE vrsticah: 11 (PT h.9 vs PUA h.8), 22 (h.10 vs h.3), 46 (h.63 vs h.65), 48 (h.63 vs h.65), 76 (h.51 vs h.28), 84 (h.45 vs h.28)** |
| UNRESOLVED (6) | 1, 2, 7, 14, 61, 82 | PT 1× branje (REVIEW) |
| NOT_FOUND (5) | 15, 16, 18, 19, 20 | **PT vrzel 15–20** (že dokumentirana val 53: p3 koca pri 14, p4 začne pri 21); v PUA za 15–20 obstajata le D.P. reference (no.73 »D. P. 15.16.18«) — D.P. ≠ B.P. rubrika |

**Posebni primer — BP 98 ↔ Zollamt (uporabnikovo izrecno vprašanje):**

| kanal | branje | status |
|---|---|---|
| PUA no.95 (p47) | **h.70** — digit-by-digit 4×: »7 sharp cross-stroke, 0 oval« (val 51 pass3, val 56 native 2×, val 57) | ✅ stabilno |
| PUA no.95 opomba | **»B. P. 98.«** v nadaljevalni vrstici vpisa — 3× (val 56 native 2× + val 57) | ✅ stabilno |
| PT bp 98 lastnik | **»A. Zöllamt/Zöllner«** — stabilno prek vseh kampanj | ✅ stabilno |
| PT bp 98 hišna št. | val 52 »h.20« · val 53 »h.39« (1/2) · val 57 »h.50« (»5 distinctive top curve and bottom loop, 0 oval — does not resemble 2, 3, 9«) | ❌ **NEREŠLJIVO iz obstoječih skenov** |
| PS N83 (nov vir) | iskanje »Zoll« po 143 straneh — glej §7 | (spodaj) |

**Zaključek za BP 98:** PUA stran je primarna in 4× potrjena (h.70); PT hišni stolpec je dokazljivo nestabilen (20/39/50). Dodatni primarni dokaz je bil iskan v PS (nov vir) — rezultat v §7. **Nič ni bilo rešeno z verjetnostjo.**

*(Strojna različica: `raw-web-val57-2026-10/bp-house-matrix.json` — vseh 100 vrstic z viri in opombami.)*

---

## §5 · CONTINUATION CHECK

Preverjeni vsi tipi nadaljevanj; najdene 4 vrste + 2 anomaliji:

1. **Opombe v nadaljevalni vrstici vpisa** (ključna vrsta): »B. P. 98.« pod vpisom no.95 (p47) — lega nativno potrjena val 56/57; »B. P. 90.« pod parcelnim seznamom no.7 (p6) — lega potrjena val 57 midband (»centered below the parcel list of entry No. 7«); desni Anmerkung-stolpec p6-top je PRAZEN — opombe so znotraj bloka vpisa, ne v stolpcu (metodološka lekcija za prihodnja branja).
2. **Nadaljevanje parcelnih seznamov čez vrstice/sekcije** (no.51: I–IV v 4 vrsticah; no.16/17 dolgi seznami) — vsi ulovljeni v register.parcels.
3. **Izrecni skokovni seznam:** p44 no.90 »Uebersprungene Parzellen Nummer I: 20, 161, 310, 472, 483, 682, 692, 696, 720, 882, 89? II: 637« — registrska potrditev, da so posamezne parcelne številke namenoma preskočene (pomembno za Parcel Register 1825, issue #42 §4).
4. **Zaključna formula + podpisi** (p49): »Ich Amtl[ich] bestätige am 10. Jänner 1825« + Mumppen[?] + v Hillmayer[?] + Zeugen — dokumentna celovitost potrjena.
5. **Anomalija bloka 2 (p27–p29):** številčenje 53–58 je aritmetično zaprto (52 na p26 → 59 na p30), ampak številke na straneh so prebrane kot 51[?]/52[?], 35/36, 37/38 — Kurrent 3↔5↔7 nestabilnost; NI preštevilčeno (prepoved ugibanja), hipoteza v opombah.
6. **Anomalija p16:** vpisa prebrana kot 70/71, položaj v knjigi (med 29 in 32) nakazuje 30/31 — ostaja nepreštevilčeno, dokumentirano.

**PT-side nadaljevanja (kontrola):** bp 55 se v PT p5 pojavi 2× z nadpisano oznako »55¹« = Abtheilung (delitev) — nov val 57 zaznamek; PT bp 98 vrstica ima Gattung »Abtheilung« (areal 8) — BP 98 ima torej vsaj 2 vrstici v PT (delitvi), kar dodatno razlaga nestabilnost hišnega stolpca.

---

## §6 · THREE-CHANNEL VERIFICATION

| kanal | stanje |
|---|---|
| **1 · originalni raster/PDF** | PRIMARNI dokaz. PUA: 49/49 PDF strani z nativnimi rastrji ~1.390×2.142; 11 strani dodatno kot 300-dpi pasovni izrezi. Vsa ključna branja val 57 = digit-by-digit z opisi oblik števk pri nativni/300-dpi ločljivosti. |
| **2 · PDF OCR/text layer** | **NE OBSTAJA** (0 znakov na vseh straneh; LuraDocument v2.16; VAČ pdf-raw-text prazen). Kanal 2 = metodološko nedostopen — to je lastnost vira, ne preskočeni korak. |
| **3 · neodvisno VLM branje** | IZVEDENO za vse ključne točke: p6 blok (top + midband + bot = 3 branja), p47 (4×), p49 (4×: native + closing-zoom + val 51 2×), p26/p42 (nativno 1×, REVIEW), PT p5-top/bot, PT p7-top/bot + bp89-91 pas. Zaznamovana omejitev: p5-bot pri polovični resoluciji pasu ni prebral hišnih števk (50–60) — metodo je treba izvajati vedno pri polni 300 dpi (lekcija, dokumentirana). |

**Ključne three-channel sodbe:**

| podatek | kanal 1 (raster) | kanal 3 (VLM×N) | sodba |
|---|---|---|---|
| PUA no.7 h. | h.43 (val 56 native + val 57 top, oblike: 4 open-top+crossbar, 3 flat-top) | 3 branja h.43 vs 2 stara h.70 @667px | **43** (70 = Kurrent 4↔7, 3↔0) |
| PUA no.8 h. | h.63 (val 57 midband + bot: »6 loop, 3 two curves«) | 3 vs 2 stara h.66 | **63** (3↔6) |
| PUA p49 leto | closing-zoom digit-by-digit: 1825 (»5 = sharp top bar, open bowl; lacks closed loop of 6«) | 3× 1825 : 1× 1826 | **1825** |
| PUA p49 ime | »Philipp De **Giannuto**[?] Zucchelli« (letter-by-letter) | 1× Giannuto : 2× Giammo | REVIEW — ni rešeno z ugibanjem |
| PT p5 46/47/48 | 63 / 65 / 62 z opisi oblik (3: flat-top, 5: sharp angle, 2: wavy-top) | 3 kampanje konsistentne | PT stranska resnica; konflikt s PUA opombo ostaja (§4) |
| PT p7 bp90 | h.43 (digit-by-digit: »not 44, 51, 28«) | + PUA no.7 h.43 | **CONFIRMED-2x** |

---

## §7 · CROSS-SOURCE CONTROL (PUA ↔ PT ↔ PS ↔ A01–A05) + CONFLICT REGISTER

**Načelo:** viri se ne prisiljujejo v skladnost; vsa neskladja ostanejo v konfliktnem registru.

### 7.1 · PUA ↔ PT (protokol Bau-Parcellen)
- **Struktura:** PT daje bp→hiša (100 vrstic), PUA daje lastnik→B.P. opombe. Presek: 33 bps z obema viroma od tega **6 nesoglasij na sicer STABLE PT vrsticah** (11, 22, 46, 48, 76, 84 — glej §4) — to so NOVI konflikti, ki jih je audit odkril, ker prejšnja logika ni primerjala vsebine opomb s PT hišami.
- **Imena lastnikov:** PT imena ostajajo NEZANESLJIVA (F1, val 54); PUA ostaja lastniška avtoriteta.

### 7.2 · PUA ↔ A01–A05 (zemljevidi)
- 11 lastniških vezav A01 (val 54 revizija) — nobena ni bila ogrožena s popravki val 57 (no.7/no.8 hišne številke ne vplivajo na vezane bp: bp 90 nima lastniške vezave v A01; preverjeno).
- bp 98 = Zollamt vezava ostaje VERIFIED-2x (val 56); hišna vezava ostaja konfliktna (§4).

### 7.3 · PUA ↔ PS (Protocoll der Grund-Parcellen — NOVI VIR, val 57)
PS N83 (143 strani razprtij, do 20 vrst/sheet) = **parcelni register z lastniškim blokom** (Haus Nro. + Vor- und Zuname + Stand + Wohnort) in parcelnim blokom (KulturGattung, Flächen Inhalt = N.º Jaethe + Quad. Kläfter, Classe, Reiner jähr. Ertrag fl/Kr, Capital Werth fl/Kr, Anmerkung). **Transkripcija val 57: PARTIAL 55/143 strani (1.073 vrstice) — preostanek blokiran z VLM kvoto (429), resume-pripravljen; dok. `70-val57-ps-n83-master-transcription.md`.** Križne kontrole na delnem materialu:
- **(a) hišne številke:** **51/54 PUA hiš že pokritih v PS** (h.70 Zollamt, h.71 Stauger, h.72 = verjetno v preostalih straneh — NIKOLI »absent«); PS dodatno kaže številke >72 (79, 80, 81, 82, 85, 87) = QA vprašanje (bralni šum ali dodatna številčenja — tarčni re-read pri 300 dpi).
- **(b) imena na isti hiši:** h.60 PS »Schellko Joseph[?]« ≈ PUA no.85 »Schelko Georg« (val 57 nov vpis) = **3. vir potrdi družino na h.60**; h.30 Tillak/Tillah = isto ime družine; h.26/h.43/h.65 = različna imena (lastnik ↔ naslednik/najemnik — hipoteze, NI združevanje oseb, issue #42 §5).
- **(c) BP 98/Zollamt:** iskanje »Zoll« po 55 prebranih straneh = 0 zadetkov; konflikt K1 ostaja odprt do popolne transkripcije.

### 7.4 · CONFLICT REGISTER (glavne odprte postavke po val 57)

| # | postavka | vir A | vir B | status | kaj bi razrešilo |
|---|---|---|---|---|---|
| K1 | **BP 98 ↔ hiša** | PUA: h.70 (4×) | PT: h.20/39/50 (3 kampanje) | CONFLICT | PS »Zoll« vrstica; novi sken PT p7 (fizični arhiv) |
| K2 | BP 46/48 ↔ hiša | PUA opomba no.40: h.65 (B.P. 46. 48.) | PT p5: h.63 / h.62 (3 kampanje konsistentne) | CONFLICT | novi sken PUA p21 opombe @300dpi; fizični arhiv |
| K3 | BP 11/22/76/84 | PUA opombe (h.8/h.3/h.28/h.28) | PT STABLE (h.9/h.10/h.51/h.45) | CONFLICT (novo odkrito) | interpretacija B.P. opomb (delitve? so-posedž?) — novi skeni |
| K4 | PUA številčenje 53–58 | prebrano: 51[?]/52[?]/35/36/37/38 | aritmetika: 53–58 | HYPOTHESIS (ne uveljavljeno) | novi skeni p27–p29 |
| K5 | PUA p16 št. 70/71 | prebrano 70/71 | položaj nakazuje 30/31 | HYPOTHESIS | novi sken p16 |
| K6 | no.52 h.29 | p26 branje h.29 | no.78 (p47) že h.29 | CONFLICT (so-posedž ali napaka) | nativni zoom p26 št.; fizični arhiv |
| K7 | Zucchelli ime | val 51 2×: »De Giammo« | val 57: »De Giannuto« | REVIEW | web-search koroboracija (429 pri val 57 — TO_COLLECT); fizični arhiv |
| K8 | vpis 86 parcele | register: prazno | p42 rez v digitalizatu | LOST-IN-SOURCE | nov sken fizičnega lista (SA) |

---

## §8 · NEGATIVE RESULT

**Kategorije, ki jih v PUA (pregledanem materialu) NI bilo najdenih:**
1. **Gemeinschaftliche Waldweide** kot lastniški vpis (val 51 §4 vprašanje) — p47/p48 je z opravičenimi branjmi NI; no.96 = »Wiese in der Gemeinde« (občinska njiva/travnik). »Ni najdeno« = v pregledanem materialu ni najdeno, ne »ne obstaja«.
2. **Parcelni seznam vpisa 86** — fizično odrezan v digitalizatu p42 (tudi PDF-native); ni obnovljiv iz obstoječega skena.
3. **Natisnjena foliacija** ni sistematično berljiva/skladna (p26 »VI«) — foliacija vs file-order usklajevanje ostaja odprto (nizka prioriteta: file-order = manifest order je stabilen).
4. **B.P. 222** (p16 no.71 opomba) — izven obsega BP 1–100; verjetno napačno branje (»2 22«?), ostaja kot prebrano z [?] statusom v opombi.
5. **Hišne številke na PT p5-bot (bp 49–60)** v val 57 pasovnem branju niso prebrane (polovična resolucija) — PT val 53 branja ostajajo edini vir za te vrstice (dokumentirana omejitev te kampanje, ne vira).

**Kaj je nedostopno (izven PUA):** PV/PZ registerjev niso digitalizirani (val 53 inventar); šolski list [4118864], SA Podzemelj, SI AS 749/3/8/12 izpisek parcel 1851 in matrike Podzemelj zahtevajo prijavo = izven peskovnika (nespremenjeno); web-search koroboracija Zucchellija je bila val 57 blokirana s 429 (TO_COLLECT).

**Manjkajoči deli PUA:** brez. 49/49 strani PDF + 49/49 predogledov + 11× 300-dpi pasov + 5 reševalnih verzij = material popoln glede na digitalizat SA.

---

## §9 · FINAL COMPLETENESS VERDICT

> ## **PUA COMPLETE — sufficient for Atlas extraction**
>
> z izrecnimi pogoji pomena: COMPLETE pomeni (1) **material**: vseh 49 strani digitalizata prisotnih, veljavnih in večkratno branljivih (vključno z nativnimi re-branji vseh prej okrnjenih strani) ter (2) **pregledanost**: vsaka stran obravnavana kot dokazna (§2), vsi vpisi strukturirani (§3: 98), vsi B.P. stiki kontrolirani (§4), vsa nadaljevanja preverjena (§5).
>
> COMPLETE **NE pomeni**, da so vsi readingi končni: 25 REVIEW + 28 REVIEW-CONFLICT vpisov in konflikti K1–K7 ostajajo odkrito dokumentirani (§7.4) in se razrešujejo SAMO z novimi primarnimi dokazi — nikoli z verjetnostjo. Ena podatkovna vrzel (vpis 86 parcele) je izgubljena v samem digitalizatu (K8) in ne blokira izvlečka Atlas 1825.

**Zmogljivost audita (merljivo):** +4 vpisa (94→98) · +86 parcelnih referenc (2.559→2.645) · +2 hišni številki (h.27, h.71) · 2 hišni številki popravljena z obliko-utemeljenimi branjmi (no.7: 70→43, no.8: 66→63) · 1 vezava dvignjena v CONFIRMED-2x (BP 90 ↔ h.43) · 1 datum razrešen (10. Jänner 1825, 3:1) · 6 novih PUA↔PT konfliktov odkritih (K3) · 1 nova metodološka pravila (opombe znotraj vpisnega bloka; pasovna branja vedno @300dpi) · 16/16 PUA QA testov posodobljenih in zelenih.

---

*Dokumentacija: `pua-n83/register.json` (98 vpisov) · `pua-n83/page-records.json` · `raw-web-val57-2026-10/` (pua-inventory.json, bp-house-matrix.json, reads/*.json — 15 tarčnih branj, ps-vlm/ — PS transkripcija) · `pt-n83/reconciliation.json` §val57 · testi `tests/pua-n83-register.test.ts`.*
