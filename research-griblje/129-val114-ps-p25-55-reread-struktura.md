# 129 — VAL 114: POLN RE-READ PS p25–p55 + STRUKTURNA FORENZIKA (p19/p20/p34/p40/p48/p49) — ISSUE #42 §4/§14

**Metoda:** agentov direktni vid, **0 VLM klicev** (429 dnevna kvota; ista metoda kot vali 111/112/113).
Instrumenti: z3 skladovni izrezki (make-z3-v113.py) + **imensko-vrednostni trakovi z ravilom**
(nova tehnika tega vala — imena + vrednosti v istem pogledu z Y-ravilom za varno vrstično
pripis) + ciljani ×8–×14 zoomi + primerjalni trakovi števk (Kurrent 2/3/8/9 ločevanje).

## KLJUČNA STRUKTURNA NAJDBA: POMIK VRSTIC iz val 113 OVRŽEN

Val 113 je s z3 skladom na p19 zaznal "POMIK VRSTIC (F2-analog): 7 sidrov z +1 zamikom" in
vgradnjo odložil. Val 114 je s **imensko-vrednostnim trakom** dokazal, da gre za **z3 grid
artifakt**: mreža se je začela eno vrstico prenizko ("register r0=432 ni viden v bandih"),
ne da bi bila stran dejansko zamaknjena.

- **p19: 11 sidrov na ISTIH indeksih** (432=r0, 440=r1, 1|1301=r2, 808=r4, 637=r5, 1|182=r10,
  716=r11, 205=r13, 192=r14, 776=r15, 1169=r18) + FUR 10|517 ✓.
- **p20: 5 sidrov 1:1** (703=r0, 950=r6, 535=r9, 444=r11, FUR 6|1183) — "delni pomik r9–r11" ovržen.
- **p34: 5 sidrov 1:1** (285=r14, 185=r15, 397=r16, 87=r17, 273=r19) — POMIK r15–r19 ovržen.

**Vgradnja:** page_observations_v114 na vseh treh straneh izrecno korigira v113 trditev;
register vrednosti niso premikane (samo številčni popravki).

## DRUGA STRUKTURNA NAJDBA: IZPUŠČENE VRSTICE (collapse) — p40/p48/p49/p34

Nasprotno od pomika: te strani imajo **21 fizicnih vrstic, v57 jih je zabeležil 20** —
v57 je eno vrstico IZPUSTIL in vse naslednje zamaknil:

- **p40**: izpuščena PRAZNA vrstica p12 (Wunderling) + preklicana p13 ("1|65", tekač 734
  rdeče prečrtan, v57 je njegovo vrednost zlil v r12 kot "4 - 65"). Dokaz: Nro kolona
  (20/22/66/65/65) + vrednosti 768/976/38/1280 natanko na p14–p20 pod mapiranjem r13–r19 = p14–p20.
- **p48**: izpuščena vrstica p2 (vrednost **"12"**, lastno ime ~"Schmipa[?]", NI prazna!).
  Dokaz: 10 natanko ujemanj pod mapiranjem +1 (439, 533, 16, 941, 621, 565, 1490, 153, 163, 280).
- **p49**: izpuščena PREČRTANA vrstica p2 ("2|973", kultur Acker). Dokaz: 14 natanko ujemanj.
- **p34**: izpuščena 21. vrstica pred Fürtragom (~"70", ime ~"Hurich/Lohingr Mich.[?]"). V57 je
  imel 20 vrstic; vrednosti r15–r19 so VIDNE na svojih indeksih (proti p34-POMIK trditvi).

**Odločitev (konservativna):** BREZ vstavljanja novih vrstic (register ostane 2871 —
guard); popravki so vgrajeni preko izrecnega mapiranja (vsak popravek nosi opombo
"preko mapiranja rN=p(N+1)"); vstavljanje je izrecno odprta strukturna odločitev za
poseben val (potreben register-shema poseg + prenovljenih 2871-guard).

## F-PV-07 PREMESTITVE + F-PV-07-SPLIT

- **165 premestitev jae→klf**: p40 (21×), p41 (20×), p55 (19×) + page-level p28/p29/p30/p34/p37.
- **SPLIT razcepi**: p40 r11 (1|599), p41 r16 (1|77), p47 r20 (1|**695**, popavek 692), p55 r17 (1|329).
- **31 markerjev** '[F-PV-07-SPLIT val 114: ...]' — vključno 26 ze-obstojecih Joch|Klafter
  parov brez markerja (p25 r12, p26 r10, p27 r0, p28 r4/r5/r6/r12/r13, p31 r0, p32 r13,
  p33 r16/r20, p36 r0/r19, p40 r4/r13, p47 r0, p49 r0/r2, p51 r9/r10, p52 r1, p53 r2/r3/r6,
  p54 r5/r15) — pass3 novo izključuje tudi marker 'val 114'.

## VREDNOSTNI POPRAVKI (111) — v57 sistemske napake

Ponavljajoče v57 zamenjave: **1↔7** (p46 r0–r3: 739/789/792/770 → 139/189/192/170; p50 r1
876→816, r15 751→131; p48 r3 70→10; p19 r8 378→318), **1↔4** (p19 r7 496→196; p44 r16
186→150), **3↔5** (p41 r3 439→459, r5 1576→1774; p49 r3 391→591; p19 r9 659→639),
**2↔3** (p47 r6 239→229; p48 r7 39→29; p20 r5 237→337, r2 736→336), **3↔8/6↔8** (p44 r6
116→148; p46 r13 468→487, r15 339→381; p48 r13 1059→1269, r14 610→678, r15 165→185, r17
159→189). Posebni: p39 r0 (v57 "201|1774" = tekač levega stolpca + zlitje dveh zloženih
vrednosti **761+774**; ertrag_fl **1535 = 761+774 natanko** — močan skupni dokaz),
p50 r20 (fantom: FUR Joch "4" kot vrstica), p52 r19 (v57 "10|7817" → stran jasno **245**;
izvor v57 napake nepojasnljen).

## ODPRTA RAZHANJANJA (§4 — TRANSCRIBED=0, nič ne vsiljeno)

Najpomembnejša (vse z anmerkung, register ohrani v57 vrednost ali zapiše dvom [?]):
- **p42** — masovna rdeča revizija (r5–r20 prečrtani razen r12/r13): 6 neskladnih
  (r9 447 vs 464, r10 1322 vs 433 — 4-mestno vs 3-mestno!, r14 1270 vs 450, r16 476 vs
  126, r18 483 vs 113, r20 1874 vs 1313).
- **p43** — 8 neskladnih na rdeče prečrtanih vrsticah (r8 273 vs 313, r9 98 vs 32, r10 156
  vs 462, r11 729 vs 229, r13 398 vs 309, r14 242 vs 542, r16 718 vs 316, r19 "4731" vs
  1|1977[?]); FUR 7|862 prečrtan + rdeča revizija 1|1052.
- **p44** r7 (476 vs 970), r18 (1152 vs 1155); **p51** r2 (236 vs 288), r3 (74 vs 52), r9
  (1146 vs 1186); **p55** r2/r10/r14/r18; **p19** r6 (316 vs 585), r12 (1164 vs 744,
  prečrtano), r16 (1329 vs 779), r19 (832 vs 802).
- Skupaj **~44 odprtih razhjanj** — kandidati za prihodnji pass z višjo ločljivostjo /
  multispektralnim slikanjem (izven peskovnika).

## FURTRAG

p39 4|1009 · p40 6|255 prečrtano + rdeča 4|1030 · p41 6|1190 prečrtano + rdeča 4|754 (prečrtana) + rdeča 4|898 ·
p42 7|365 prečrtano + rdeča 1|818 · p43 9|1027[?] prečrtano + rdeča 7|960 · p44 6|255 prečrtano + rdeča 4|1030 +
pripis 1|32?[?] · p45 6|1190 prečrtano + 4|754 (prečrtana) + 4|898 · p47 prazna (črtkana vrstica) ·
p48 5|58[?] · p49 7|1075 · p50 FUR 4|386 (v57 fantom r20) · p51 5|847[?] prečrtano + rdeča 1|1054[?] ·
p52 6|1217 · p53 9|1027[?] prečrtano + rdeča 7|960 · p54 8|1165 prečrtano + rdeča 7|943 · p55 7|1067[?] prečrtano + rdeča 7|979.

## KASKADA (izrecna, testno vodena)

- pass3: PS parcele **577 → 391** (−186: 167 premestitev + 31 SPLIT markerjev); land use:
  njiva 109→105, travnik 40→38, gozd 3, pašnik 12, vrt 6, drugo 7, EXACT 168, UNKNOWN 142,
  None 76; EXACT-MIXED 7.
- KG: PARCEL 2428 → **2426**, HAS_PARCEL 2773, vozlišča 3270 → **3268**, vezi 3477, sha **376e2b27**.
- timeline I6: PUA 2035 / **PS 391** / raba **173+142**; coverage PARTIAL 1252 → **1066**.
- c4 K9: jaethe_plain_100_1599 192 → **69**, p1 gt1599 22 → **16** (vsotno NEUTRALNA premestitev v klf).

## VKUP (build-register-v114.py, fail-fast 2871/139/1755/265/120 + changes guard)

**417 sprememb** = 167 premestitev + 111 vrednostnih popravkov + 31 split markerjev +
124 opombe (odprta razhajanja, prečrtanja, struktura) + 3 haus popravki (p40 Nro
31→21, 69→64, 68→65) + 2 počistki. reading_pass **v114-ps-reread** (667 vrstic =
p19, p20, p25–p55). Vse s snimkami `*_pre_v114`.

## TESTI

- +34 varovalk (tests/val114-ps-p25-55-reread.test.ts): gardele, POMIK-ovržen sidri,
  strukturna forenzika 4 strani, SPLIT razcepi + markerji, POPRAVEK vzorci, odprta
  razhajanja, §4 TRANSCRIBED=0, kaskada (pass3/KG/sha/timeline/coverage).
- Pini prehodov 108→114 v 19 testnih datotekah (val84/85/86/88/90/98/107/112/113,
  atlas-kg/pass3/coverage/explore/map/timeline/story-engine/story-graph, pv-land-use).
- **1089 testov: 1078 pass / 11 skip / 0 fail**; tsc čist; eslint čist.

## ISKRENOST (§4)

- TRANSCRIBED = 0 (0 VLM); nič ne dvignjeno; evidence statusi nespremenjeni.
- 44 odprtih razhjanj izrecno zapisanih; vstavljanje 4 izpuščenih vrstic ostaja ODPRTA
  strukturna odločitev (bi spremenila 2871 kontrakt); p37 r0 (register "701|774" vs pas
  "761 in 774") ostaja neujemljivo — odprto.
- p19/p20/p34 POMIK iz v113: korekcija dokumentirana v page_observations_v114 (v113
  page_observations ostanejo v registru kot zgodovina — nikoli prepisane).
