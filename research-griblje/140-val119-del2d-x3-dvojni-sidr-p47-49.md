# 140 — Val 119 del 2d-x3: celoviti re-read PS p47–p49 z DVOJNIM SIDROM (ime + vrednost skupaj); F-NA-01 REŠEN; NOVI F-NA-02 (p48 vrednostna plast) + F5 (polpas 929½) + F6 (Fürtrag pas); vgradnja 64 vrstic (59 imen + 46 hiš + 72 vrednosti + 25 anmerkung)

**Datum:** 2026-10-02 · **Issue:** #42 §4/§14 · **Obseg:** PS N83 str. 47–49 — celoviti pass del 2d-x3 (rešitev protokola 139 §2) · **Status:** p47–p49 VGRADNJENE (register + kaskada + testi) — F-NA-01 zaprt · **Metoda:** agentov direktni vid glavne seje (0 VLM klicev); **DVOJNI SIDR** = parzelle-stevilka (imenska plast) + vrednostni pas (klafter, sedi na spodnjem pravilu pasu) hkrati na vsaki vrstici; pasova pravila programsko detektirana (X760-885) → 22 pasova na p49; izrezki: duo x3 (vseh 21+21+22), 21 pasovih izrezkov, parzelle-celicni zoomi x8, vrednostni zoomi x20 (929, 929½, 930, 931, 938, 939, Fürtrag)

## 1. F-NA-01 REŠEN (p49): 22 pasov, pozicijsko mapiranje

Programska detekcija pravil (X760-885) je na p49 našla **22 pasov**, ne 21: b0..b8 = 921..929, **b9 = polpas 929½** ([516,535]), b10..b20 = 930..940, **b21 = Fürtrag pas** ([932,970]). Register r_k = pas k pozicijsko:

- **r0..r8 (921–929):** poravnana cona — v114 vrednosti identične (samo stevkni popravek r8: klafter 381 → **241**, x20 jasen 2-4-1); imena po x2 auditu (Dragasch Jure. ×2, Heide Marko. = F2 fill, Deleshitzkh, Lubreschitskh ×2, Peodvin ×2, Hunure-dvomi ostajajo razhajanja)
- **r9 = polpas 929½ (NOVO F5):** parzella "929½" prečrtana + rdeči znaki, klafter 97 prečrtan, brez imena (930-ovo ime zapisano čez oba polpasna prostora); NI realna vrstica → polja izpraznjena, v114 vsebina (Pessing Georg h11, kl 281 = zamaknjena) snimljena v `*_pre_v119`
- **r10..r20 = 930..940 (zamaknjena cona):** v114 vrednosti od r10 = **+1 zamik** (v114 r_k = pas k−1) + 2 misreada (r8 381→241; v114 r17 376). Pravi pasovi: 930=92, 931=821, 932=56, 933=295, 934=975 ✓, 935=556 ✓, 936=316 ✓, 937=606 ✓, **938=658 (x20; x2 '633' = misread)**, **939=398 (x20; x2 '345' = misread)**, 940 = PRAZNO ✓. Imena: x2 audit seen apliciran (Hunure Mathl./Melli. h10, Kourtzly Marolin, Novak Martlin ×3, Tallafschily/Jne ×2, Lubreschiby, Abram[?] Amroyan[?])
- **r21 = Fürtrag pas (NOVO F6):** "Fürtrag" v kultur koloni + **jae 7 + klafter 1073** (nesen seštevek na naslednji list); brez parcele in imena → polja izpraznjena, v114 "Ploner Franzigen" h14 (fantom, protokol 138) snimljen. F1 dopolnjen: "941" = Fürtrag pas (ime prazno ✓, vrednosti 7|1073)
- **Ertrag plast enako zamaknjena:** 922 = 3-364 ✓ poravnano; **926 = 1-1367** (x14; v114 1.264 @927 = brez podlage); **936 = 1-853** (x9; v114 1.883 = misread 5/8 + zamik); 927/937 pociscena

## 2. NOVO F-NA-02 (p48): vrednostna plast zamaknjena +1 IN v napačni koloni

v114 "jaethe" kolona na p48 je bila pravzaprav **klafter** (vsota vrstic p48 je 0 joche — vseh 21 jaethe celic je bilo napak): polni rebuild — vseh 21 jae → prazno (snimljeni), klafter ← pas: 881=219 (+ visoko "1534" = opuščen prvi poskus; v114 "jae 1904" = njegov misread), 902=12, 903=733 (v115 vstavek), 904=10, 905=439, 906=533 + ertrag 2-296, 907=16, 908=29, 909=941, 910=621, 911=591, 912=565, 913=**1492** (v114 1490), 914=1269, 915=678, 916=**155** (v114 185), 917=153, 918=**159** (v114 189), 919=163, 920=280 + ertrag 2-714, 921 = stray 5|58 brez imena (opuščen poskus; prava 921 = p49-r0) → polja prazna. K9 KONFUNDA posodobljen: jaethe_100_1599 69 → **53**.

## 3. p47: vrednostna plast 1:1 ✓ + imenska plast po x2 auditu

- **Vrednostna plast 21/21 ujemanj z v114** — F-NA-01 na p47 zadeva SAMO imensko plast. Stevkni popravki: r2 (883) 283 → **253** (x14 flat-top 5), r12 (893) 438 → **436** (x20 ena zanka = 6). r0 = Joch|Klafter notacija (jae 97 + kl 993); r14 ertrag 9-793 ✓; r20 (901) celica PRAZNA ✓ (901 se nadaljuje na p48-r0)
- **Imenska plast:** F-NA-01 swap/shift od r5 — sidrani popravki (18 imen + 14 hiš): Krischan Matthe. h3/h69 trio ×10, Stabelz Soan./Swan. h2 ×4, Schimitlbeck/Schimitbek h1 ×3, Gemeinde. h0, Tallafschily Swan h6, Michely Soon; r20 (901) črnilo PRAZNO → v114 "Christan Bräutig" ohranjeno z razhajanjem (precedens p34-r20/p40-r12)

## 4. Vgradnja + kaskada

- `ps-n83/build-register-v119-del2d-x3.py` (guardi: 2875 + 139 v88 + 1795 v86 + 184 v114 + 2 v115 + 60 v118 + 545 v119 + 207 ditto; dvojni tek prepovedan; vrednostni asserti po vseh 64 vrsticah) → **206 sprememb: 59 owner + 46 haus + 72 vrednosti + 25 anmerkung** (zapisanih: 57 owner-fix + 44 haus-fix + 71 value-fix + 25 anm + F5 ×3 + F6 ×2 + 3 page_obs + 1 bookkeeping)
- **Plasti: v119-names 545 → 609; v114 184 → 122; v115 2 → 0** (zadnja v115 vrstica p49-r2 = F2 fill); v118 60, v86 1795, ditto 207 nespremenjeni; TRANSCRIBED = 0
- Kaskada (izrecna): c4-metrika (register sha 8be2735f; K5 bloki 2609 → 2608; K9 53/1/965/87) + KG (**sha b660c0d1 → 62d8cfea**; 2 RESIDENCE relaciji TP-029 prevezani na re-sidrane lastnike: R-03433 PER-0164→PER-0177, R-03434 PER-0100→PER-0235; PARCEL 2427 / HAS_PARCEL 2773 / 3269 / 3477 identično) + story-graph + timeline + coverage
- Testi: nov `tests/val119-del2d-x3-ps-names-p47-49.test.ts` (12) + pini posodobljeni v 13 testnih datotekah (sha ×14, plasti ×7, K9 ×3, vsebine p48/p49 ×3); **1256 testov: 1245 pass / 11 skip / 0 fail**

## 5. Iskrenost (§4)

- **0 VLM klicev** — vsa branja z agentovim vidom glavne seje iz programsko generiranih izrezkov (regenerabilno, /tmp).
- **dvomi ostajajo izrecni**: [?] v imenih (Stabelz Soan.[?], Schimitlbeck Matthe.[?], Hunure Mathl.[?], Abram[?] Amroyan[?] …); 16 novih odprtih razhajanj (skupaj 71) — vsa z anmerkung, brez tihih popravk.
- **F5/F6 polja so izpraznjena s snimkami** (`*_pre_v119`) + anmerkung — ni tihega brisanja; vsebina ostane rekonstruirana iz registra.
- **x2 knjigovodski zdrsi dokumentirani** (audit_glitch: names_audit old r11..r13 = register r13..r15, +2 lokalna napaka indeksiranja v x2 branju) — zato old-based fail-fast SAMO za vrednosti (čiste) in r0..r8 imena; za r10..r20 imena apliciran seen z anmerkung dokumentacijo.
- **medstranska poravnava (F3)** ostaja odprta za p50+; ta pass je rešil znotrajstransko poravnavo p47–p49.

## 6. Naslednje (del 2e / sinhronizacija)

1. **del 2e:** p50–p55 (parzelle-sidr 942+; pričakovano ~110 vrstic) — ista metoda (dvojni sidr + pasova detekcija);
2. nato PUA↔PS sinhronizacija (F-PV-03/04) → register 26-0326 + 26-0379;
3. VLM-subagent 2. oči kontrola vzorca (NR-14) po zaključku PS imenskega passa.
