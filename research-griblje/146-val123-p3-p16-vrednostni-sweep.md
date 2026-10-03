# 146 — Val 123: P3–P16 VREDNOSTNI SWEEP (jae+kl; pasovna metoda val 121; F-V123-01 strukturni disput p7) — 0 VLM

**Datum:** 2026-10-06 · **Issue:** #42 §4/§14 · **Obseg:** prva točka protokola 145 §6 — »p3–p16 vrednostni sweep (brez flagov, nizka prioriteta — v82-era brez re-reada)« · **Status:** **vgradnja** — 27 FIX + 7 DISPUTE (odprta razhajanja) + F-V123-01 (p7 strukturni disput, 0 popravkov) + 13 strani opazb; KG vsebinsko identična (timestamp-only sha prehod 8345868a → fc23ab10); 0 VLM klicev.

---

## 1. Kontekst in metoda

- **Obseg:** p3, p4, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16 (p5 je vgrajen val 121) = **267 vrstic**; vrednostni stolpca jae+kl (classe/ertrag so prazni čez register; capital_fl le 2–2 zapisi).
- **Metoda = val 121 (protokol 144 §6.1):** bottom-rule anchoring — vrednost pripada pasu nad svojim pisanim spodnjim pravilom; grid = `snap_grid` (linearni TOP0+STEP 38.85, pravila lokalno zaznana v coni X 370–600); cal poročilo: vse 14 strani OK (mean_off ≤ 5.5 px, brez NEEDS-CAL; p3–p16 brez pinov — comitane konstante pričnejo pri p17).
- **Orodja:** `make-valbands-v121.py` (vseg/bands/zz) + nov `val123-sweep/celltool.py` (tight celični izrezki ×10–15 z rdečo oznako r{r} + register vrednostjo, import snap_grid iz v121 skripte). Crops regenerabilni (`.gitignore` `crops/`).
- **Kalibracija:** jasne celice morajo brati register — p3 (116/325/307/203/729/99/758/409/663/184/214/274/62/96 ✓), p9 (366/88/108/668/1439/195/116/660/827/175/570/180/454/1219+jae1/622/351/971 ✓), p10 (1092/166/247/429/501/1148/228/221/467/49/313/24/49/394/29/24/289/202/262 ✓), p16 (20/20 ✓) …
- **0 VLM klicev** — vsa branja v glavni seji (agentski vid), sodbe eno-dvoumnih zamenjav prek primerjav z znanimi števkami iste strani (metoda val 121 digitcmp).

## 2. Vgradnja — 27 FIX (`build-register-v123.py`, GUARD deklarirano-staro ≟ register)

| Stran | FIX | Primer sodbe |
|---|---|---|
| p3 (2) | r3 769→**762**, r8 488→**485** | 2 = zanka+val base (prim. 62/r19); 9 pri 409/729 ima descender; 5 = flat top (prim. 325) |
| p4 (4) | r8 944→**946**, r9 293→**205**, r10 194→**198**, r11 46→**42** | vse štiri zapirajo val 112 opambe »vrednost X brez vidnega vira« — vir so rdeče udarjene vrednosti, zdaj prebrane; r15 473 potrjena (soglasje z udarcem) |
| p6 (6) | r7 403→**408**, r8 203→**205**, r10 136→**126**, r11 190→**180**, r13 794→**798**, r17 110→**170** | 8 = dvojna zanka (ne 3/4); 5 = flat top (ne 3); 2 = zanka+val (ne 3); 7 = vodoravni top (identična oblika r18 170) |
| p8 (4) | r2 42→**62**, r3 348→**365**, r9 464→**451**, r10 461→**460** | 6 = zanka+vrat (ne 4); 0 = majhna oval (ne 1) |
| p9 (2) | r11 258→**358**, r13 228→**234** | 3 = dve skodeli (ne 2) |
| p12 (5) | r0 297→**294**, r2 494→**490**, r4 376→**364**, r8 374→**314**, r13 260→**360** | sistematična v82 zamenjava 4/7/0 na eni strani |
| p13 (3) | r1 404→**401**, r5 275→**215**, r14 1005→**405** | r14: tri številke 4-0-5 (h-oblika 4) — v82 je vpeljal vodilni 1 iz vratu 4 |
| p15 (1) | r0 658→**656** | olje »1\|656« s podstolpcem »1« (F-PV-07 cona); 6 = odprt top, ne 8 |

Vsi FIX imajo `klafter_pre_v123` + anmerkung `[v123: ∅|staro -> ∅|novo sweep p3-p16]`.

## 3. DISPUTE — odprta razhajanja (brez popravkov, anmerkung + ta protokol)

- **p10 r18:** 1038 vs 1088[?] (tretja številka 3/8 dvoumna pod rdečim udarcem).
- **p11 r3:** 79 vs 89/99[?] (prva številka ima zanko — ni 7).
- **p11 r20/r21:** 211 vs 185 (udarjeno) / 185 vs prazna celica — registrski r20/r21 par je na strani neujemljiv (185 stoji v pasu r20; r21 prazna); r22 fantom že val 112.
- **p12 r17:** 82 vs 53/426[?] (eksponiranje dvoumno med trakom in zoomom; cona vsebuje tudi »— 20« v E. coni).
- **p13 r17:** 112 vs 182[?] (srednja številka 1/8 dvoumna).
- **p14 r0:** 687 vs 157/187[?] (prva številka 1/6 dvoumna).

## 4. F-V123-01 — p7 strukturni disput (DOCUMENTED, izven dosega vala)

Programska detekcija olja v klafter stolpcu (X 800–905) pokaže **22 oljnih pozicij + Fürtrag** za 21 registrskih vrstic. Zaporedje (top-aligned na pravilih): 774, 187, 283, 160, **[54 DODATNO, udarjeno]**, 241, 49, 31, 169, 138, 56, 54(ud.), 52(ud.), 44, 321?(ud.), 315(ud.), 262(ud.), 397(ud.), 187(ud.), 58(ud.), 110(ud.), 7\|373(ud., podstolpec) + Fürtrag 2\|687→rdeče 1140. Register: 774, 187, 283, 160, 241, 19, 31, 169, 103, 36, 54, 52, 44, 224, 315, 945, 297, 187, 58, 110, fantom. **14/20 zaporednih ujemanj**; 6 odstopanj (19/49, 103/138, 36/56, 224/321?, 945/262, 297/397). Hipoteza: v82 bralec je preskokil dodatni 54 in sredino pripsal eno pasove zgodaj; rep (187/58/110) pa je 1:1 — popravek zahteva **dvojni anchor (ime+vrednost) na celotni strani** (metoda val 119 del 2d-x3), lasten val. V v123: 0 popravkov na p7, 6 stranskih disput anmerkung + page_obs.

## 5. Opazbe (page_obs, add-only) — kapitalni nizi + Fürtrag + podstolpec

- **Kapitalni nizi v E./K. coni** (neražčlenjeni, dekodiranje odloženo — precedens val 111): p4 r5 »845«, p4 r13 »234«, p6 r11 »1-104«, p7 b4 »1-381«, p7 b20 »1\|1147«, p8 r19 »2\|659«, p9 r5 »1-477«, p10 r2 »135«, p10 r15 »511«, p12 r9 »1209«, p13 r14 »1093«, p14 r2 »135«, p14 r15 »511«, p15 r16 »906«, p15 r18 »— 65«+»546«, p16 r18 »748«; p10 r19 svinenik refine »3\|49½« (val 112 »3\|49[?]«).
- **Fürtrag vrstice (črno prečrtano → rdeča korekcija):** p6 4\|88→2\|585, p9 6\|471, p10 4\|803, p11 2\|798→81, p12 4\|296?, p13 4\|451, p14 6\|449?, p15 7\|1288, p16 5\|811; p4 Eintrag 4\|927+1336; p7/p8 že val 112.
- **Podstolpec »1« (F-PV-07 cona):** p15 r0, p16 r11; p7 b20 podstolpec »7«+»373«.

## 6. Kaskada (izrecna)

register (27 FIX) → **c4 v90**: K9 p1–55 **56/959/84 nespremenjen** (samo vrednost→vrednost; gt1599 vsota 10 nespremenjena) → **KG**: vsebinsko identična (3764 vozlišč / 3473 vezi / 614 trditev / 11 vrzeli — builder ne bere klafter vrednosti; sha prehod **8345868a → fc23ab10**, timestamp+provenance) → story (3764/3473/4) → timeline (8 točk; I1 441 ✓ I2 0,086 % ✓ I6 ✓) → coverage (PASS 8; §24 14/14) → runtime src/data sinhronizirana. **Osebna plast NESPREMENJENA** (F-SYNC-04); kvalitetna plast register = vrednostni sloj p3–p16.

## 7. Iskrenost (§4)

- **0 VLM klicev**; vsa branja agentski vid prek programsko generiranih izrezkov (regenerabilnih).
- **27 FIX = eno-dvoumne sodbe** z ekslicitnimi primerjavami oblik števk iz iste strani; **7 DISPUTE + F-V123-01 ostajajo odprti** — nič ni bilo siljeno.
- p5 (val 121), p17+ (vali 119–121) niso bili dotaknjeni; osebna plast nespremenjena; reading_pass oznake (v111/v112) ostajajo — v123 vgrajuje samo vrednostni sloj.
- p8 r19 (Fürtrag vrednosti 3\|1941 kot register vrstica) ostaja val 112 odložena odločitev (»dodajanje odloženo (kaskada)«) — v123 je dodal samo opazbo »2\|659«.
- Testi: +12 varovalk (tests/val123) + izrecen prehod KG sha pina v 18 testnih datotekah + val 111 p3 test posodobljen (r3 762 odločitev, vsota 6906, v123 override mapa v 1:1 testu). 1341 testov: 1330 pass / 11 skip / 0 fail; lint čist.
- Docs: protokol 146 + KAZALO 146 + README 183. sklop.

## 8. Naslednje

1. **F-V123-01**: p7 dvojni-anchor re-read (ime+vrednost, celicni zoomi ×16) — odločitev o 6 odstopanjih + dodatnem 54 + r20/r21 coni;
2. preostali 6 DISPUTE iz §3 (celicni zoomi ×16 z imenskim sidrom);
3. NR-14 črkovalna sodba + p56–143 osebni re-read (reši RG-009/010/011 in PROVISIONAL lastnike h72/74/76);
4. register 26-0326/26-0379 ob javnih poročilih eArheologija;
5. F-H122-01: deterministična disambiguacija 13 podvojenih H-1-* ID-jev.
