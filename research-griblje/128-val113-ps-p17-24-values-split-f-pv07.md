# Val 113 — PS p17–p24 vrednostni re-read + F-PV-07-SPLIT + kultur pass p11

**Issue #42 §4/§14 · veja `feat/val113-issue72-ps-p17-55-reread` · 0 VLM klicev (429 kvota)**

## Metoda

Agentov direktni vid (val 61/88/108/111/112 vzorec), dve novosti:

1. **z3 skladovni izrezki z IZMERJENIMI horizontalnimi pravili** (`make-z3-v113.py`,
   `detect_rules` prag 178–210 + fallback kalibrirana mreža). Prejšnja kalibracija
   Y0=158/STEP=38.65 odmika ±5 px; ker pisar piše NIZKO (vrednost prečka mejo), je
   to v sredini strani povzročalo off-by-one atribucijo (p17 g1: r11/r12/r13 zamenjane).
   z3 band rN = [rule_N, rule_N+1] → atribucija = pas = vrstica, brehška.
2. **F-PV-07-SPLIT najdba**: pisar piše standardno notacijo "N Joch | Q Klafter" —
   val 57 je pare ZLIL v en niz:
   - p17 r15 `1|400` → jae `1400`
   - p18 r4 `1|243` → jae `1912`, r16 `1|122` → jae `622`, r17 `1|130` → jae `620`
   - p21 r9 `3|1248` → jae `"3 1268"`
   Vgradnja: jae=Joch, kla=Klafter + anmerkung marker `[F-PV-07-SPLIT val 113`;
   **pass3 novo izključitveno pravilo** (analog v88/F-PV-05): Joch števec NI parcelna številka.

## Vgradnja (build-register-v113.py; fail-fast 2871/139/1755/265 + changes guard)

| stran | premestitve | SPLIT | popravki | odprta razhajanja | opombe |
|---|---|---|---|---|---|
| p17 | 18 | r15 (1\|400), r19 jae=1 | 650→690, 189→129, 526→556, 833→553 | 6 | FUR 6\|795 |
| p18 | 14 | r4, r11, r15, r16, r17 | 937→927, 873→473, 529→539 | 9 | FUR 10\|275; r9 Hoffnung brez vrednosti |
| p21 | 18 | r9 (3\|1248), r10 jae=1 | 273→573, 464→484, 839→859, 1306→1302[?], 948→448 | 2 | FUR 13\|1108 |
| p22 | 20 | — | 208→308, 668→665, 524→824, 589→889, 852→352 | 9 | FUR 6\|444 + rdeča revizija 320[?] |
| p23 | 19 | r14 jae=1 | 217→317, 1087→1081, 1162→1163, 470→770, 705→715 | 4 | FUR 10\|172 (R) → 7\|1143 |
| p24 | 0 (v57 že pravilen stolpec) | r8, r15 markerja | 756→736, 677→577, 908→905, 680→630, 546→544, 488→428, 243→343 + ocistka jae `.` | 4 | 8× prečrtano rdeče; FUR 8\|710 (R) → 1\|919 (R) |

Skupaj: **194 sprememb** (89 premestitev + 9 splitov + 16 popravkov + 63 opomb dodanih);
`reading_pass := v113-ps-reread` (120 vrstic). Snimke `*_pre_v113`.

**p11 kultur pass (odložen iz val 112)**: halucinacija val 57 DOKAZANA — dejanski zapisi se
ponavljajo ("Lhugar und Boll[?]" 5× + 2 ditto; "Rosig[?]/Ruked[?]" 2×), val 57 pa je zapisal
4 različne generične terme (Liegend. Baul./Wiese/Hutweide/Schindel. Wald/Wald). Direktna
korekcija odložena (§4: TRANSCRIBED=0) — anmerkung add-only, končno besedilo val 114.

**p19/p20 — POMIK VRSTIC (F2-analog)**: p19 ima 7 sidrnih ujemanj z +1 zamikom
(440=r1, 1|1301=r2, 637=r5, 1|182=r10, 205=r13, 192=r14, 1169=r18); p20 delni pomik v
spodnji polovici. **Vgradnja izrecno ODLOŽENA val 114** (strukturni re-read s persko
poravnavo) — samo page_observations_v113.

**Obseg**: izrežki + z3 + baseline pripravljeni za vseh 39 strani p17–p55; vgrajeno p17–p24.
p25–p55 čaka val 114 (instrumenti regenerabilni: `make-crops-v113.py`, `make-z3-v113.py`).

## Kaskada (izrecna, testno vodena)

- pass3: PS parcele **676 → 577** (−99: 5 strani jaethe izpadov + 11 SPLIT izključitev);
  land use: njiva 258→198, gozd 14→11, pašnik 15→14, vrt 14→9, travnik 77→47, EXACT 380→281
- KG: PARCEL 2711→2612, HAS_PARCEL 3013→2914, vozlišča 3553→3454, vezi 3717→3618, sha `5ae52bd8`
- timeline I6: PUA 2035 / PS 577 / raba 292+209; coverage PARTIAL 1351→1252; c4 K9 275→192, gt1599 25→22
- api-smoke: map 2612 (292/209/2111), story-graph 3.454/3.618

## Testi

+22 varovalk (`tests/val113-ps-p17-55-reread.test.ts`); pini prehodov val 108→113 v 14
testnih datotekah; **1055 testov: 1044 pass / 11 skip / 0 fail**; tsc čist; eslint čist.
