# 141 — Val 119 del 2e: celoviti re-read PS p50–p55 z DVOJNIM SIDROM (ime + vrednost skupaj); NOVO F-NA-03 (p54 register rep zamaknjen +1 → polni rebuild) + F-FÜRTRAG pasovi (p50/p51/p52/p53/p54/p55); vgradnja 122 vrstic (79 imen + 36 hiš + 89 vrednosti + 100 anmerkung) — PS p25–p55 POKRITE (v114 → 0)

**Datum:** 2026-10-02 · **Issue:** #42 §4/§14 · **Obseg:** PS N83 str. 50–55 — celoviti pass del 2e (nadaljevanje protokola 140 §6) · **Status:** p50–p55 VGRADNJENE (register + kaskada + testi) · **Metoda:** agentov direktni vid glavne seje (0 VLM klicev); **DVOJNI SIDR** (protokol 140) = parzelle-stevilka (941–1060) + vrednostni pas hkrati na vsaki vrstici; izrezki: kan3e (samonaznane vrstice, X150–620), valseg (vrednostni segmenti), zoom/zoom2 (celični), skripti `detect-grid-v119e.py` + `make-kan3-v119e.py` + `make-valseg-v119e.py` + `make-zoom-v119e.py` + `make-zoom2-v119e.py`

## 1. Struktura p50–p55 (122 vrstic = 21+20+20+20+21+20)

| str. | parcele | posebnosti |
|---|---|---|
| p50 | 941–960 | **Übertrag ni zapisan**; Fürtrag pas (r20) = **F-FÜRTRAG**: kultur črnilo "48 Fürtrag", **jae 4 \| kl 386** (nesen na naslednji list); v114 "Pavstgl Lorenz" h5 = **fantom** → izpraznjen; vrednosti v **JOCH koloni** (Acker/Wald/Hutweide del), klafter prazen |
| p51 | 961–980 | **Übertrag** (kl 1263, nad r0) + **Fürtrag 5\|547** (prečrtan rdeče+črnilo, pod r19) — NE register vrstice; 963/964/965/968/969/970/971 **preklicane** (rdeče); vrednosti v **KLAFTER koloni** (Wiese/Ladwiese del); popravki r0 89→82, r3 74→72, r5 124→121, r8 25→28, r10 207→101 (+jae 1), r11 959→**259**, r13 453→433, r15 280→220, r18 820→**520** |
| p52 | 981–1000 | Fürtrag **jae 6 \| kl 1217** (pod r19); 992 preklicana + rdeča margin-opomba "Rosenberg bay J 1846"; rdeči kljukasti verifikacijski znaki v Classe koloni; popravki r1 182→152, r5 339→379, r16 1205→**1305**; cfl 1097@r9 (v114 109\|5 razdeljeno); kl 4@r0 (majhen glif, dvom 4/6); capital 1001@r17 potrjen ✓; **v114 'Insgesamt:' @r19 = misread vrstice 1000** → kultur počiščen |
| p53 | 1001–1020 | Fürtrag **jae 9 \| kl 1027, prečrtan** (pod r19); 1009/1013/1015/1017/1018/1019/1020 preklicane (rdeče); rdeče anmerkung "Post facult…" večkrat; svinčeni pomožni zapiski v ertrag/capital coni (r18/r19) preskočeni; popravki r4 1194→**1191**, r13 51→**31**, r14 349→**319** (preklicana), r16 66→**68** (preklicana); ertrag **3-568@r3** (v114: ekr 568 + cl 3 razprseno), **1-1377@r7** (v114 r6 = zamik); jae 1@r12 (preklicana) |
| p54 | 1021–1040 | **NOVO F-NA-03** (§2) — polni rebuild repa; Fürtrag (r20) = 8\|1165 **prečrtan črnilo** + **rdeče prepisano 7\|943**; ~1704 svinčeni zapisek v C.kr; ertrag **5-843@r13** (v114 razprseno efl 5), **10-66@r4** (v114 ekr 10 + cfl 6) |
| p55 | 1041–1060 | Fürtrag **jae 7 \| kl 1067, prečrtan črnilo** + rdeči popravki ~449? (pod r19); 1045/1046/1047/1051/1060 preklicani; rdeča margin-opomba "Luidolf bay J 1846"; popravki r0 29→**39**, r2 870→**517**, r6 739→**139** (preklicana), r9 765→763, r10 231→**831** (preklicana), r12 102→**703**, r14 769→**961**, r18 18→**48**; ertrag **1-600@r5** (dvom 1-1600), **—239@r7** (dvom), **1-463@r10** (v114 je dal r9 capital) |

## 2. NOVO F-NA-03 (p54): register rep r14–r19 zamaknjen +1 → polni rebuild

v114 register rep na p54 je nosil **dvojni fantomski zamik**: dup vrednost 145, fantoma 716/425, r20 pa je nosil **P1040 (283|1263)**. Re-sidranje po parzelle-stevilkah (1021–1040) + vrednostnem pasu:

- **r14 (1035) = jae 1 | kl 996** (v114 kl prazno + ertrag/capital smet)
- **r15 (1036) = 113**, **r16 (1037) = 969**, **r17 (1038) = 74**, **r18 (1039) = 908**
- **r19 (1040) = kl 283 + cfl 1265** (v114 cfl 1263 @r20 = zamaknjena)
- **r20 = Fürtrag pas**: 8|1165 prečrtan + rdeče 7|943; v114 "Karl Mioß" h15 + 283|1263 = zamaknjena plast P1040 → izpraznjeno, **snimljeno** (`*_pre_v119`), anmerkung F-FÜRTRAG (F-NA-03)

Imena re-sidrana: r14 "Poiding Wolfgo" → **Stallpschibek Nikolaus[?] h13** (stara vsebina = zamaknjena plast), r19 "Karl Wurmer" → **Onal Maido[?] h15**, r13 razhajanje (~"Pessing Malfa[?] h50" vs v114 "Poiding Maja").

## 3. Imenska plast (cross-val potrditve)

- **Stallpschibek-glyf trio** (p50-r0 "Stallpschibek Matthe[?] h1/7" vs v114 "Schiffelbichl Barthol. Lorenz"; p54-r14) — pattern-fill para s p44
- **Novak Martin** (p50-r1 h1/4; ditto ovržen), **Schimey Michael** (p50-r9 h1/19 — cross-val h-niz Schimek), **Heide Marko h3** (p55-r7 — forma ×7: p44 ×5 + p49-r2 + p55-r7)
- dvomi izrecni: Stratzl Johan[?] (p51-r0, v114 "Muckel fman"), Urick Jakim[?] (p51-r19, ~Ulrich Jakob?, h1/51 NOVO), Onal Maido[?] (p54-r19), Stallpschibek Nikolaus[?] (p54-r14)
- **razhajanja ostajajo izrecna** (v114 ohranjeno): p54-r13 (~"Pessing Malfa[?]" vs "Poiding Maja"), p55-r0 (~"Omal Humen[?]" vs "Andreas Krumpe") … skupaj **28 novih** (vseh 99; vsa anmerkung, 0 tihih popravk)

## 4. Vgradnja + kaskada

- `ps-n83/build-register-v119-del2e.py` (guardi: 2875 + 139 v88 + 1795 v86 + 0 v115 + 60 v118 + 609 v119 + 122 v114 + 207 ditto; dvojni tek prepovedan; vrednostni asserti po vseh 122 vrsticah) → **316 sprememb: 79 owner-fix + 36 haus-fix + 67 value-fix + 23 value-clear + 100 anmerkung + 5 fürtrag-clear + 6 page_obs** (statistika: 81 owner + 38 haus + 89 vrednosti + 100 anmerkung)
- **Plasti: v119-names 609 → 731; v114 122 → 0** (PS p25–p55 POKRITE — konec v114 plast!) · v115 0, v118 60, v86 1795, ditto 207 nespremenjeni; TRANSCRIBED = 0
- Kaskada (izrecna): c4-metrika (register sha fb439f80; **K5 bloki 2608 → 2607**; **K9**: both_filled 48→**52**, jaethe_empty 965→**961**, klafter_empty 87→**85**, jaethe_plain_le99 58→62, klafter_plain_le99 177→179, **jaethe_plain_100_1599 53 nestanjeno**) + KG (**sha 62d8cfea → c3932092, vsebina IDENTIČNA — timestamp-only**: builder bere iz ps-registra samo `wohnort`, ki del 2e ni dotaknil; PARCEL 2427 / HAS_PARCEL 2773 / 3269 / 3477 identično; R-03433/R-03434 ostajata) + story-graph + timeline (kg_sha256) + coverage (vsebinsko identičen, PARTIAL 1067)
- Testi: nov `tests/val119-del2e-ps-names-p50-55.test.ts` (14) + pini posodobljeni v 16 testnih datotekah (plasti 731/0 ×6, KG sha ×12, K9 ×3, snimke/razhajanja ×3, val114 vsebinski re-sidrani p50-r20/p52-r16/p55-r0) · **1282 testi: 1271 pass / 11 skip / 0 fail**; lint čist

## 5. Iskrenost (§4)

- **0 VLM klicev** — vsa branja z agentovim vidom glavne seje iz programsko generiranih izrezkov (regenerabilno).
- **dvomi ostajajo izrecni**: [?] v imenih; 28 novih odprtih razhajanj (skupaj 99) — vsa z anmerkung, brez tihih popravk.
- **F-NA-03 / F-FÜRTRAG polja izpraznjena s snimkami** (`*_pre_v119`) + anmerkung — ni tihega brisanja.
- **Fürtrag pasovi NISO register vrstice** (razen p50/p54, kjer so pozicijsko v pasu register repa) — vrednosti dokumentirane v page_observations + anmerkung; niso vgrajene v vrednostno plast (razen p50 jae 4|kl 386, kjer je pas = register vrstica r20).
- **KG timestamp-only** = pričakovano: del 2e spreminja owner/haus/vrednosti, KG osebni sloj pa je pass2 PUA artefakt (F-PV-03/04) — sinhronizacija je naslednji korak.

## 6. Naslednje

1. **PUA↔PS sinhronizacija (F-PV-03/04)** → register 26-0326 + 26-0379;
2. VLM-subagent 2. oči kontrola vzorca (NR-14) po zaključku PS imenskega passa;
3. PS p1–16 imenska zadrižava je bila del 1–2a (v119-names); PS p32+ zdaj pokrito — preostale rešitve: F3 medstranska poravnava + p50-p55 2. oči.
