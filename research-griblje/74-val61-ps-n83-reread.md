# 74. val — PS N83 re-read 2026-10: verifikirana Fürtrag veriga (13 točk, 0 kršitev), imenske variante p11/p12, no_blatt semantika

**Datum:** 2026-10 (val 61) · **Vir:** SI AS 176/N/N83/s/PS (1825) · **Metoda:** agentov direktni vid (2 prehoda, izrezki 3×–7× LANCZOS) — brez enega VLM klica

---

## 1. Kontekst

VLM kvota 429 neprekinjeno 26+ ur (test v tem valu potrjen tretjič). Val 58 je opredelil
re-read tarče: p11/p12 (imena), p36/p42 (Fürtrag števci), p14 (glava), p44/45/48/51 (no_blatt).
Ker je VLM blokiran, je ta val izvedel re-read z NOVIM instrumentom: **glavni agent bere
izrezke strani direktno** (orodje za branje slik), po protokolu 2 neodvisna prehoda,
s 7× zoomi za odločanje o posameznih števkah. Vsak preizkus VLM/kvote je bil izveden
ločeno in na koncu tudi za web-search (tudi 429 — isti gate; NR-10 ostaja TO_COLLECT).

Izrezki: `research-griblje/ps-n83/make-reread-crops.py` → `ps-n83/reread-crops/`
(regenerabilni, gitignored).

---

## 2. F11 NADGRADJENO — Fürtrag veriga VERIFIKIRANA

### 2.1 Verifikirana veriga (2 prehoda agenta; VLM v57 vrednosti v oklepaju)

| stran | števec | vrednost (J\|QKl) | prečrtano | rdeča 2. vrstica |
|---|---|---|---|---|
| p5 | 2 (2 ✓) | **6\|1459** (VLM: 14357) | da | 3\|906 |
| p11 | **9** (VLM: ni prebral — "Summa") | **2\|798** (VLM: 2/792) | da | "81" (nepopolna) |
| p12 | 10 (10 ✓) | **4\|7986** (4 7986 ✓) | da | 2\|1551 |
| p14 | **12** (VLM: "Summa Jaethen"!) | **6\|1088** (VLM: 6/10808) | da | 6\|77 |
| p16 | 14 (14 ✓) | 5\|811 ✓ | ne | — |
| p20 | **18** (VLM: 19) | **6\|1183** (VLM: 1188) | ne | — |
| p24 | 22 (22 ✓) | **8\|1310** (VLM: 1240) | da | 1\|919 |
| p32 | **30** (VLM: 26) | **6\|1244** (VLM: 1944) | da | 3\|265 |
| p35 | **33** (VLM: 39!) | **2\|798** (VLM: 768) | ne | — |
| p36 | **38** (VLM: 36) | **2\|1578** (VLM: 8790!) | da | 3\|349 |
| p42 | **39** (VLM: 20!) | **7\|365** (VLM: 362) | da | 1\|815 |
| p44 | 42 (42 ✓) | 6\|255 (VLM izpustil) → **4\|1030** | da | 4\|1030 |
| p54 | 52 (52 ✓) | 8\|1165 (✓) | da | 7\|943 (VLM: 9948) |

**Števci:** 2, 9, 10, 12, 14, 18, 22, 30, 33, 38, 39, 42, 52 — **strogo monotona, 0 kršitev.**

### 2.2 Kaj se je spremenilo proti val 58

- **v1 "kršitvi" verige (p36=36, p42=20) = VLM napaki branja.** V resnici 38. in 39. Fürtrag.
  VLM je števca p35 (33) in p42 (39) celo zamenjal med seboj.
- **3 Nove točke:** p11=9 (VLM je vrstico prebral kot "Summa" brez števca), p14=12
  (VLM oznako "12. Fürtrag." prebral kot "Summa Jaethen"), p35=33 (VLM 39).
- **Format dekodiran:** vrstica = `N. Fürtrag. | [Joch] | [Quad. Klafter]`. Tiskana oznaka je
  VEDNO "Fürtrag." — vse VLM oznake (Färberg, Futterg, Firstag, Grundst., Stück, Flächen,
  Summa) so napačne.
- **Vrednost = vsota TEKOČE strani**, ne kumulativa (p11 2J798 < p5 6J1459 izključi kumulacijo).
  Anomalija: p12 "4\|7986" — edina QKl > 1599 (zadnja štefka negotova, alt 4\|798); aritmetična
  kontrola sešteka vrstic šele pri 143/143.
- **"Summa Jaethen 6/10808" in "Summa Quadrat-Klafter 6/77" iz v1 = neobstoječi entiteti** —
  to sta misreada vrstice "12. Fürtrag 6\|1088" + rdeče "6\|77" na p14. Vprašanje iz v1
  ("metrika stolpcev TO-DECODE") je delno razrešeno.
- **Rdeče druge vrstice** (9/13 strani) = predelani/vstavljeni seštevki — semantika ostaja
  TO-DECODE (popravek brez prečrtanih vrstic / prenos / kontrolni zapis); dobesedno zabeleženo.
- **Koraki števca:** večinoma +1/stran (p12→p14→p16 +2/2, p16→p20 +4/4, p20→p24 +4/4,
  p24→p32 +8/8, p44→p54 +10/10) = skladno s F11 interpretacijo "števec = tekoči indeks
  Jaethe (~52 holdingov)". Izjemi: p35→p36 **+5/1 stran** (zaključek dediščinskih malih
  holdingov) in p36→p42 **+1/6 strani** (ne-lokalna sekcija z velikimi sestavljenimi
  holdingi) — obe se skladata s F12 (meja p40).

Vir: `ps-n83/reread-2026-10/totals-reread.json` (vsak celica z VLM priorito + opombo).

---

## 3. F10b NOVO — imenske variante p11/p12 (trisodišna kontrola)

Trije neodvisni bralci istih vrstic: **PS-VLM v57** (polna stran), **agent 2026-10** (5× izrezki,
2 prehoda), **PT-VLM v53** (samostojen finalni protokol = tretje branje istih holdingov).

### 3.1 Visoko-zanesljive korekcije (3, uveljavljene v register.json z ohranjenim originalom)

| stran | hiša | v57 | → korekcija | potrditev |
|---|---|---|---|---|
| p12 | h45 | Hansp[?] Gnoy | **Strauß Georg** | glifi jasni @5× ×2 prehoda; p7 že prebran "Strauß Georg" (isti lastnik); PT h45 "Krauß Georg" |
| p12 | h38 | Thomas Gnoy | **Schimerz[?] Gnoy** | glifi se začnejo z "Š", ne "T"; PT h38 "Schim[?]er Georg" |
| p12 | h39 | Thomas Muster | **Schimerz[?] Marko[?]** | isti "Š" začetek; PT h39 "Schim[?]er Mache[?]" |

Učinek na F10: PS↔PT močna soglasja **3 → 4** (h19 Thomas 0.82, h45 Strauß/Krauß 0.84,
h48 0.76, **h38 Schimerz↔Schim 0.75 NOVO**).

### 3.2 Variante brez prepisa (nič prepisano brez dokaza)

- **Priimek dediščinskega sklada h.36-50 = NAME_UNCERTAIN:** kandidati
  Muster (VLM v57) / Mutza, Muško, Murško (agent) / Mache, Marfa, Musterer (PT v53).
  Kurrent "-er" zaključek ima zamah, ki ga je mogoče brati kot "-a/-o/-za"; "st" digraf kot "tlz".
- **Prvo ime "Peter"/"Poldi"/"Pešdir(g)"** — isti glifi, ki jih je VLM na p11 prebral "Peter",
  je na p12 prebral "Poldi" (notranja nekonsistentnost VLM); agent bere "Pešdir(g)".
- **"Christian" potrjen** za h36/h37 (agent + PT skladno; v57 je imel "Barthol"/"Fridrich").
- Vse 13 variantskih zapisov + 4 strukturne najdbe: `reread-2026-10/name-variants-p11-p12.json`.

### 3.3 Družinska interpretacija DOWNGRADED

v58: "'Muster/Musterer' = realna družina". v61: **družinski sklad h.36-50 je STRUKTURNO
dokazan** (recen priimek + recena imena Peter/Christian/Kristof/Schimerz/Georg/Martha), **a
PRIIMEK NI DOLOČEN**. Status v KG = `NAME_UNCERTAIN_CLUSTER`; v UI ni gotovih imen družine.
Določitev šele: re-read @višji dpi, PT h40 zoom, matrični dokazi (izven peskovnika).

---

## 4. F15 NOVO — "Nro. des Blattes" = raven LISTA, ne vrstice

Re-read p44 je pokazal: stolpec 1 vsebuje rimski "II" + ditto znake za vseh 20 vrstic;
register v57 je to prebral kot "11" × 20. Torej:

- **"Nro. des Blattes" = številka lista** (I, II, ... zapisana na prvi vrstici, ditto spodaj) —
  NE zaporedna številka vrstice.
- Stolpci z zaporedji 821–840 (p44, **dve razhajajoči kopiji** z rdečimi popravki na 828/839) =
  **"Nro. der Uebersetzung"** — sklici vrstic na čistopis.
- Register v57 no_blatt vrednosti so **semantično nezanesljive na vseh 55 straneh**
  ("11"=rimski II; 1..23 na p11 = ditto tolmačeno kot številčenje; p45/48/51 = kaos mešanih
  vrednosti). Razreši vprašanje "no_blatt kontinuiteta" iz v58: problem ni v viru, ampak v
  tolmačenju stolpca.

## 5. F16 NOVO — struktura vrstic p11

Register v57 ima 23 vrstic za p11, na strani je ~22 vidnih. Register nb4 h=1 "Barbara Muster"
nima jasne identifikacije na strani; h-stolpec vrstic 2–6 = UNCERTAIN med register
(40,41,1,39,39) in agent (39,30,38,39). Hipoteza: VLM je h=1 vzel iz Geistliche/Dominical
stolpca. Hišne veze p11 vrstic 2–6 = **PROVISIONAL** do polnega re-reada.

---

## 6. Skladnost z metodologijo (issue #42, uporabnikov komentar 09:01)

| pravilo | izvedba v61 |
|---|---|
| VIRI→DOKAZI→PODATKI | re-read = 3. branje VIRA; vsaka sprememba z dokazom (izrezki + zoom + vzporednica) |
| nič ugibanja | 3 korekcije samo z 2-prehodnim + vzporednim dokazom; 13 variantskih zapisov NEprepisanih |
| UNKNOWN/UNCERTAIN/CONFLICT ohranjeni | priimki sklada = NAME_UNCERTAIN; p12 7986 = anomalija zabeležena; rdeče vrstice TO-DECODE; VLM veriga ohranjena v "vlm_v57_chain_for_audit" |
| ločeni sloji | reread dokazi v ps-n83/reread-2026-10/, popravki z provenanco v register.json, analiza v analysis-v2.json, UI nič |
| Story Engine iz istega grafa | F10b: ime družine NE sme v zgodbe kot gotovost |

## 7. Artefakti

- `ps-n83/make-reread-crops.py` — deterministični izrezki (regenerabilni)
- `ps-n83/reread-2026-10/totals-reread.json` — verifikirana veriga 13 točk (VLM prioriteti ohranjeni)
- `ps-n83/reread-2026-10/name-variants-p11-p12.json` — trisodišna imenska kontrola
- `ps-n83/patch-register-reread.py` — 3 korekcije z ohranjenim originalom (idempotentno)
- `ps-n83/build-analysis-v2.py` → `analysis-v2.json` — F9–F16; v1 arhiviran
- `tests/ps-n83-analysis.test.ts` — 18 testov / 122 expect (varovalke: 13-točkovna monotona
  veriga, korekcije v registru z originali, NAME_UNCERTAIN, v1 napake v audit verigi)
- Suite: **209/209**, tsc čist, lint čist. +0 virov / +0 trditev / +0 UI.

## 8. Naslednje

1. **Ob kvoti:** PS p56–p143 (88 strani, resume skripta) → deterministična obnova vseh registrov
   (build-pass2/build-pass3) → aritmetika holdingov proti 13-točkovni verigi → rešitev p12 7986.
2. **Re-readi z novim instrumentom** (agent direktni vid): po potrebi nadaljnje strani; p11
   vrstice 2–6 hišne veze @višji dpi.
3. **Izven peskovnika:** Zucchelli (NR-10 — web-search zdaj tudi 429), šolski list [4118864],
   SA Podzemelj, SI AS 749.
4. Šele nato PASS 4/5 (A01 coverage, map data model) na očiščenih podatkih.
