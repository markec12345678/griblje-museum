# 133 — Val 118: imenski pass PS p17–p19 (pilot) — v57 imenska kolona sistemsko pokvarjena: 51 imenskih + 23 haus popravkov, 7 ditto ovrženih

**Datum:** 2026-10-01 · **Issue:** #42 §4/§14 · **Obseg:** PS N83 str. 17–19 — pilotni imenski pass (owner_original + haus_no); p20–p55 = val 119 po uveljavljenem protokolu · **Metoda:** agentov direktni vid (0 VLM klicev): vrstično sidrani imenski skladi `nz-pXX-g0..2` (X 280–610, Y-grid VY0=158/VSTEP=38.65 — isti merjeni grid kot z3 vrednosti val 113/114, x6 LANCZOS+Contrast1.25+Sharpness1.6, 117 izrezkov `crops-v118/`) + enovrstične diagnostične povečave x12–x24 (`make-rowzoom-v118.py`, +6 px "pisar piše nizko") + programska detekcija horizontalnih pravil + **dominikalna 2↔3 kalibracija** (dominikalna št. 281–340 = znana sekvencа, kalibrira pisarjeve 2/3/5/6 glyfe v haus koloni) + PUA abecedni register kot neodvisen presek

## 1. VELIKA NAJDBA: v57 imenska kolona p17–p19 je sistemsko pokvarjena

Val 118 je bil načrtovan kot rutinski imenski pass (verifikacija v57 owner_original). Namesto tega je odkril, da je v57 imenska plast na teh straneh **kvalitativno pokvarjena** — ne posamezne napake, ampak vzorci, ki na straneh ne obstajajo:

| stran | v57 vzorec | pravo stanje (črnilo) | popravki |
|---|---|---|---|
| p17 | "Christan **Würgl**" ×8, "**Häusler** Mache" ×3 | "Christan **Malfg**" ×5, "Christan **Gorgy**" ×1, "**Husitsch Maria**" ×2, "Christan Mache" | 12 imen + 6 haus |
| p18 | "**Wendelin/Christof/Villibald/Vilter** Muth/Mutho/Wulfj/Wulffj/Puhon" (20/20), "**Hoffnung**" | "Christan Mache/Gorgy/Malfg/Piber" + "Fitsch Malfg/Piber" + "Husitsch Maria" + "**Hof-Besizungen[?]**" | **20/20 imen** + 13 haus |
| p19 | "**Heinrich** Wurff/Piberl/Mache" ×16, "**Hansel Munde**" ×3 | "Christan Malfg/Matho[?]/Piber/Gorgy" + "Husitsch Maria[?]" ×3 + "Georg Gorgy" | 19/20 imen + 4 haus |

Dokaz, da gre za v57 napako in ne za drugačen vir: vrednostna in haus koloni p18 SE ujemajo s stranjo (val 113 je vrednosti potrdila — r0 "1|89" sede v ISTO vrstico kot "62 \| Christan Mache"), imenska kolona pa nosi nabor, ki **ne obstaja nikjer v 2875 vrsticah registra** ("Wendelin" samo p18, "Puhon" samo p18, "Hoffnung" samo p18, "Würgl" samo p17, "Häusler" samo p17). Izjema, ki potrjuje pravilo: p19 r10 "Georg Gorgy" = edina v57-usklajena vrstica (x12 potrjena) — v57 plast je mešanica posamičnih pravilnih branj in page-level pattern-fill.

**Novi priimki (vsi z večkratno x14–x24 dokazo):**
- **Malfg** (M-a-l-f-g: f s prečko + g-spuščanje) — ista črkovna oblika, ki jo je v57 NA p21 prebral kot "Malfg" (13 vrstic) in PUA kot "**Malfa**"; v57 je istobesedno črnilo na p17/p18/p19bral kot "Würgl"/"Muth" — masovna primerjava 11 instanc (p17 r2/r8/r13, p18 r2/r4/r7/r14/r15/r18, p19 r0, p21 r0) = enotna oblika;
- **Gorgy** (G + o + r + g-spuščanje + y-rep) — znan v57 priimek s p19 r10; v57 ga je na p18/p20bral kot "Groyz";
- **Husitsch Maria** — h.44 lastnica; potrjena z neodvisnim PUA vnosom "h.44: Husitsch Maria Bauersleute zu Grübln" (dva dokumenta); v57 "Häusler Mache" — obe besedi zgrešeni;
- **Matho[?]** (p19 r5 — M-beseda BREZ g-spuščanja, o-končnica; PUA ima "Matho" kot samostojen priimek) — ločen od Malfg; dvom izrecno označen;
- **Hof-Besizungen[?]** (p18 r9) — ne-osebni zapis (dominikalni posest) namesto v57 "Hoffnung"; vrednost celica prazna = konsistentno;
- **Thomas** (p20 g0 pilotni pogled — polna obravnava val 119).

## 2. Haus kolona: 2↔3 šum + dominikalna kalibracija

v57 haus_no nosi sistemski 2↔3 šum v OBEH smereh (p17 r2: v57 36, črnilo 26; p18 r2: v57 26, črnilo 36). Rešitev: **dominikalna kalibracija** — kolona "Bestimmung des Betriebes" nosi znano sekvenco 281–360 (nad p17–p20), tako da je pisarjeva "3"-glyfa na vsaki strani neodvisno znana; primerjava haus-glyf z dominikalnimi glyfami v istem izrezu razreši vsak 2/3 dvom (dokaz: p18 r7 — dominikalni "308" + haus "36" v enem izrezu, ista 3-glyfa). 23 haus popravkov: p17 (14→62, 36→26, 36→35, 66→36, 68→44, 14→44), p18 (63→62, 26→36 ×4, 27→37 ×4, 62→63, 24→34 ×2), p19 (36→26, 62→63, 61→41, 26→36). p19 r10: 61→**41** (4-glyfa = kot "44" v r9/r18; dvom 4/6 izrecen v anmerkung).

## 3. Ditto-zastavice: 7 ovrženih

v57 je označil p17 r3/r5 + p18 r1–r5 kot owner_was_ditto — črnilo pa na vseh 7 vrsticah piše polno ime izrecno (zoomi x12–x16). Zastavice pobrisane (snimke owner_was_ditto_pre_v118) → c4 K5 vhod: dito 233→**226**/2875 (7,9 %), bloki 2590.

## 4. Kaskada (izrecna, testno vodena)

| veličina | val 117 | val 118 |
|---|---|---|
| register | 2875 vrstic | **2875** (vstavljanj ni) |
| reading_pass plasti | v113 120 / v114 667 | v113 **80** (p17/p18 → v118), v114 **647** (p19 → v118), **v118-names 60** |
| pass3: PS parcele / land-use | 392 / 105-38-3-12-6-7+142 | **392 / identično** (vrednostna projekcija) |
| KG vozlišča / vezi / PARCEL / HAS_PARCEL | 3269 / 3477 / 2427 / 2773 | **identično** (osebni sloj = pass2 artefakt `house-register-1825.json` — sinhronizacija oseb z registrom ostaja odprta točka, izven peskovnika F-PV-03/F-PV-04) |
| KG sha256 | 2790d893… | **69038f63…** (vsebinska sprememba: owner/haus nizi v pass3-projektiranih parcelah) |
| story-graph / timeline I6 / coverage | 3269+3477 / 2035+392+173+142 / PARTIAL 1067 | **identično** (sha raznesen) |
| c4: K9 p1–55 / K5 dito | 69 / 233 | **69 / 226** (vrednostne metrike nespremenjene) |

Kaskadni builderji pognani izrecno: `build-pass3.py` → `build-knowledge-graph.py` → `build-story-graph.py` → `build-timeline-1825-1830.py` → `build-coverage-report.py` → `build-c4-metrika-v90.py` → `build-analysis-v5/v6.py` (byte-identna, p56–143) + runtime kopije `src/data/`.

## 5. Iskrenost (§4)

- **0 VLM klicev** — vsa branja z agentovim vidom iz determinističnih izrezkov;
- **TRANSCRIBED = 0 vsiljenih** — nič ne dvignjeno; review_status nespremenjen;
- **izrecni dvomi ostajajo v imenih**: "Husitsch Maria**[?]**" (2. beseda Mache[?]/Maria — PUA sicer potrjuje Marijo, a črnilo p19 r2/r9/r18 ni povsem jasno), "Christan Matho**[?]**", "Hof-Besizungen**[?]**", haus 41 (4/6);
- **normalizacija "Christan" ohranjena** — pisar piše "Christian" z i-piko (x12 jasno), a v57 izbira je konsistentna normalizacija istega črnila; ni množičnega prečrkovanja (obs);
- **"Piber/Piberl"**: v57 je na p19 bral "Piberl" — ista črkovna oblika kot "Piber" p17/p18 (brez vidnega -l); enotno "Piber" + anmerkung;
- **obseg**: p20–p55 (731 vrstic) še ne obravnavano — p20 pilotni pogled kaže ISTI vzorec ("Kristan Jerey" namesto G-org, "Thomas Matz", haus 55/36/27/23 dvomi) → val 119;
- stand/wohnort kolone (Dominil/Gribl + dittoti) ostajajo prazne v registru — izven obsega tega vala.

## 6. Testi + dokumentacija

- **+24 varovalk** (`tests/val118-ps-names-p17-19.test.ts`): gardele (2875, 0 VLM, changes 90 = 51+23+7+6), plasti (v118 60 / v113 80 / v114 647 / v86 1795 / v115 4), p17 (Würgl/Häusler izginila, Husitsch Maria, haus snimke, ditto), p18 (20/20 fabriciranih popravljenih, 2↔3 kalibracija, ditto ×5), p19 (Heinrich izginil, r10 Georg Gorgy + haus 41, Matho/Malfg ločena), iskrenost (dvomi [?], PUA anmerkung, obs, obseg pilot), kaskada (KG 3269/3477, sha 69038f63, pass3 392/105/142/38, K5 226, I6);
- pini prehoda 117→118 z zgodovino: KG sha 2790d893→69038f63 v 9 testnih datotekah + src/data; K5 233→226 (val90); plasti 120→80 (val113/114/115) in 667→647 (val114/115);
- **1170 testov: 1155 pass / 11 skip / 0 fail** · tsc čist · eslint čist;
- docs: research-griblje/133 + KAZALO 133 + README 170. sklop; .gitignore +crops-v118 (525 MB, regenerabilno iz `make-crops-v118.py` + `make-rowzoom-v118.py`).

## 7. Naslednje

1. **val 119: imenski pass p20–p55** po uveljavljenem protokolu (731 vrstic; pričakovano podoben vzorec napak — p20 pilot kaže "Kristan Jerey" namesto G-org družine + "Thomas");
2. PUA↔PS osebna sinhronizacija (house-register/pass2 artefakt vs. popravljen register) — F-PV-03/F-PV-04 okvir;
3. p20–p55 haus 2↔3 kalibracija vključno z dominikalnimi sekvencami 341–460;
4. PZ p65 polne vrstice + p63 r6–r12 ob višji ločljivosti (izven peskovnika);
5. register 26-0326 + 26-0379 (okt./nov. 2026).
