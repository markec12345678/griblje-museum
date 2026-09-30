# 127 — Val 112: poln re-read PS — p3 imenski pass + p4–p16 vrednostni audit + F-PV-07 premestitve (p5/p7/p12)

**Datum:** 2026-09-30 · **Issue:** #42 §4/§14 · **Obseg:** PS N83 str. 3 (imenski pass, odložen v val 111) + str. 4–16 (poln vrednostni audit) + F-PV-07 prestavitve na p5/p7/p12 · **Metoda:** agentov direktni vid (instrument val 61/88/108/111): banded izrezki s programskimi mejami vrstic + stacked ultra-zoomi ×8 vrednostne kolone (`zoom-values-v112.py`, 3 skladovne slike na stran, 169 izrezkov `crops-v112/`) · **0 VLM klicev** (429 dnevna kvota) · vgradnja: `build-register-v112.py` (fail-fast: gardele 2871/139/1755 + changes-guard)

---

## 1. Kontekst in prevzem

Val 111 je vgradil območja p3 + dokazal F-PV-07 (območja p1–55 piše v desnem podstolpcu Quad. Klafter; val 57 jih je vnesel v `jaethe`) in odložil imenski pass p3. Val 112 zapre tri sloje re-reada pasu p3–p16:

1. **p3 imenski pass** — lastniki + hišne številke (odloženo v val 111 zaradi x-odmika imenskih izrezkov);
2. **F-PV-07 premestitve** na straneh, ki jih je val 112 prebral v celoti (p5/p7/p12);
3. **vrednostni audit** p4 + p6 + p8–p16 (števke + halucinacije val 57).

Metoda brez VLM: kalibracija kolon po p11/p05 (rimska I lista, Uebersetzung/Ried števec 1–21), nato per-page branje v `band-v112/reading-v112/p03–p16.json` (meta: val 112, method "0 VLM").

## 2. Trije sloji vgradnje (270 sprememb, popoln audit v `register-v112-changes.json`)

### 2.1 p3 imenski pass (33 owner/wohnort fills skupaj)

- **19 lastnikov** z eksplicitnim dvomom `[?]` na vseh (npr. r1 'Krbitschan Mahs[?]', r2–r6 'Kirschan …[?]', r7–r8 'Fillah Mäda[?]', r19 'Gemeinde' brez dvoma) — nič ugibanja brez oznake (§4);
- **19 `haus_no`** (r0 prečrtana in r16 fantomski pas brez); r1 dobi tudi `wohnort` 'Gruble' + anmerkung o nepreberljivem stanu;
- **r16 fantomski pas**: anmerkung "[fantomski pas: vrstica brez lastnega para; vsebuje 214+1-602 števec 17]";
- **r19 `capital_kr` 27 → 22** (kapitalni niz — zadnja števka 2; snimka `capital_kr_pre_v112`);
- kapitalni nizi "1−1348" (r10), "1−602" (r16), "22" (r19) = neražčlenjeni fl|kr|pf formati — dekodiranje ostaja odloženo (register v57 vrednosti ostajajo).

### 2.2 F-PV-07 premestitve p5/p7/p12 — 59× `jaethe → klafter`

Vrednost ostane, polje se zamenja (snimke `jaethe_pre_v112` na vseh 59):

| stran | premestitev | posebnosti |
|---|---|---|
| p5 | 20× | + 8 vrednostnih popravkov: 682→**683**, 642→**242**, 272→**222**, 858→**458**, 771→**171**, 170→**110**, 563→**565**, 461→**464**; Fürtrag 6\|1459 prečrtan → rdeče 3\|906; 10 anmerkung (dvojna 913+543[?], 6× prečrtana rdeče, 2× odprta razhajanja r9 248[?] vs 2245 / r15 625[?] vs 1350) |
| p7 | 20× | r20 fantom-Fürtrag vrstica: owner 'Strauß Georg' brisan (vrstica brez kultur/vrednosti); Fürtrag 2\|687 prečrtan → rdeče 1140; 11 prečrtanih vrednosti + r19 trojna oznaka/svinčev 1147 |
| p12 | 19× | r16 `klafter` '-' nadomeščen z vrednostjo; 5 prečrtanih vrednosti + dvomni r4/r8 + rep-strani pomik-dilema r16–r19 |

### 2.3 Vrednostni audit p4 + p6 + p8–p16 — 93 popravkov

- **p4**: 6 popravkov (1224→**1204**, 525→**825**, 76→**16**, 190→**194**, 483→**468**, 410→**412**) + 10 `haus_no` (cirkularne halucinacije val 57 — npr. r17 '1|66 jasno, v57 6 = napačen par') + 13 imen (vse `[?]`) + 8 kultur Acker→Lhaid[?]; 5 vrednosti "brez vira" ostanejo (944/293/194/46/473) z anmerkung;
- **p6**: marginalni zapisi Ertrag/Capital premesteni r19 → r20 ('1  1106' + '477'; val57 jih je pripisal r19 kot 1|1109|1477); r11 capital_fl **104** in r15 **934** (pisano v Cap.fl koloni); Fürtrag črno 4|85 (R) → rdeče 2|585;
- **p8**: 11 popravkov + r14 PRAZNA celica (val57 397 brez vira) + r19 strukturna opamba (normalni vnos Wald 364 R prečrtan, Klobetisher Gregor; Fürtrag 3|1941 (R) → 1|454 (R) → 682; vrstica 364 NI v registru — dodajanje odloženo, kaskada);
- **p9**: 4 popravki (668/1439/454/971); Fürtrag črno 6|471 (R) → rdeče 6|265; r16 jae 1 legitimen (N.o Joche);
- **p10**: 13 popravkov + **r0 NORMALIZACIJA '10.92' → '1092'** (edini j|k-format na p1–55; formatni popravek, dvom "mogoče 10|92 J|QK" v anmerkung readings) + svinčnik '3|49[?]' r19; Fürtrag 4|803 (R) → 1|408 (R) → 1|209;
- **p11**: 7 popravkov + **r22 FANTOMSKA vrstica** (na strani ne obstaja; 22 vnosnih + Fürtrag '9 Furtrag 2|798' (R) + rdeče '81[?]') + svinčniki r18 ('2|777[?]?') / r21 (zadnja števka 1/4); sistemski kultur dvom r0–r8 — kultur pass odložen (val 113);
- **p13**: 2 popravka (273/34) — najčistejša stran; **p14**: 13 popravkov (r17 **1000→290** največji posamezen!) + Fürtrag črno 6|1008 (R) → rdeče 6|77; **p15**: 12 popravkov + r12 jae 1/kla prazno potrjeno + Fürtrag '7[?]|1288' format neujemljiv z vsoto; **p16**: 6 popravkov (r14 **1852→482**) + Fürtrag 5|811.

Vse spremembe nosijo snimke `<field>_pre_v112`; vse strani dobijo `page_observations_v112`; vsa pokrita vrstica dobi `reading_pass := 'v112-ps-reread'` (**265** vrstic; p3 obdrži `v111-ps-reread`).

## 3. Kaskada (izrecna, testno vodena)

Premestitve p5/p7/p12 pomenijo, da teh 59 vrednosti NI parcelne številke (so Quad. Klafter območja) → izpadejo iz numerične jaethe-projekcije:

| veličina | val 108/111 | val 112 |
|---|---|---|
| PS parcele | 735 | **676** (−59 = 20+20+19) |
| raba: z rabo / UNKNOWN | 438 / 221 | **391 / 209** (None ostaja 76) |
| mapping EXACT / TERM-UNCLEAR | 427 / 221 | **380 / 209** |
| KG vozlišča / vezi | 3.612 / 3.776 | **3.553 / 3.717** |
| KG PARCEL / HAS_PARCEL | 2.770 / 3.072 | **2.711 / 3.013** |
| KG sha256 | 9f856d28… | **e574df03…** |
| coverage parcele | 2.770 (907 VER/1.410 PART/453 CONF) | **2.711 (907/1.351/453)** |
| K9 konfunda p1–55: jae 100–1599 / gt1599 / jk_format | 323 / 29 / 1 | **275 / 25 / 0** (normalizacija p10 r0) |

Kaskadni builderji posodobljeni izrecno: `build-timeline-1825-1830.py` (I6 zatiči (2035, 676) + (391, 209) + opomba), coverage/story-graph/pass3/KG/c4-metrika-v90 regenerirani; runtime kopije `src/data/` pišejo builderji.

## 4. Iskrenost (§4)

- **0 VLM klicev**; vse brane z agentovim vi-om iz determinističnih izrezkov;
- **TRANSCRIBED = 0 vsiljenih** — vsa imena z `[?]`, vsa prečrtanja kot anmerkung, nič ne dvignjeno (PS parcele ostajajo `TRANSCRIBED_PROVISIONAL`);
- **odprte dileme ostajajo odprte**: p5 r9 (248[?] vs 2245), p5 r15 (625[?] vs 1350), p4 haus 35/41 (stran namiguje 41/44 oz. 44/65 — potreben obisk), p4 5 vrednosti brez vira, p11 kultur dvomi r0–r8, kapitalni nizi p3, vsotna kontrola Fürtrag p3 (iz val 111) še neodločena;
- fantomske vrstice (p7 r20, p11 r22, p3 r16) izrecno označene, NI dodajanja/brisanja vrstic v registru (kaskada odložena).

## 5. Testi + dokumentacija

- **+28 varovalk** (`tests/val112-ps-p4-16-reread.test.ts`): gardele (2871/139/1755), changes audit (270/59/93/33/25/8/10/29), 14 reading JSON z meta 0-VLM, p3 imenski pass (19+19, dvomi `[?]`, r19 capital 22, r16 fantom), F-PV-07 (59 premestitev + snimke + popravki p5/p7/p12), vrednostni audit (p4/p6/p8/p10/p11/p14/p16 ključni primeri + sledljivost snimk), kaskada (PS 676, KG 2711/3013/3553/3717, §22 sha, timeline I6), iskrenost (0 VLM, odprte dileme, prečrtanja, v111 nedotaknjen);
- pini prejšnjih valov posodobljeni izrecno z zgodovino (val 108 → val 112) v 12 testnih datotekah;
- **1033 testov: 1022 pass / 11 skip / 0 fail** · tsc čist · eslint čist;
- docs: research-griblje/127 + KAZALO 127 + README 166. sklop; .gitignore +crops-v112 (219 MB, regenerabilno iz `zoom-values-v112.py`).

## 6. Naslednje

- val 113: poln re-read p17–55 (F-PV-07 prestavitve + audit) + imenski pass po straneh + kultur pass p11 r0–r8;
- VLM glasovi ob kvoti (45 izrezkov PZ → mikroprehod 8b + p142-t-kultur2 + 3. PT glas bp 98 + areal/lastnik p7);
- poln re-read p143; F-PV-03/F-PV-04; Dular 1972 + BM Metlika (izven peskovnika); register 26-0326 + 26-0379 (okt./nov. 2026).
