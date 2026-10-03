# 147 — Val 124: F-V123-01 REŠEN — P7 DVOJNI ANCHOR (ime+vrednost) + 7 DISPUTE razrešitev — 0 VLM

**Datum:** 2026-10-03 · **Issue:** #42 §4/§14 · **Obseg:** prva točka protokola 146 §8 — »F-V123-01: p7 dvojni-anchor re-read« + preostalih 7 DISPUTE iz val 123 · **Status:** **vgradnja** — p7 strukturni popravek (21 → 22 vrstic; 7 popravkov + 3 re-sidranja + 2 novi vrstici + ertrag re-sidro + fantom premik), 7 DISPUTE razrešenih (4 FIX + 3 POTRJENE) + 1 bonus FIX (p11 r15) + 1 potrditev (p11 r17); register **2875 → 2876**; KG vsebinsko identična (timestamp-only sha prehod **fc23ab10 → ee3ac862**); 0 VLM klicev.

---

## 1. Kontekst in metoda

- **Obseg:** p7 (21 vrstic v123) + 7 dispute vrstic (p10 r18, p11 r3/r15/r17/r20/r21, p12 r17, p13 r17, p14 r0).
- **Metoda = dvojni anchor ime+vrednost (val 119 del 2d-x3, protokol 140):**
  1. **geometrija:** desna stran ima **21 tiskanih pravil (158..932) = 20 pasov + 1 VSTAVLJENA ozka vrstica 585–603**; leva stran ima 20 pravil (202..935) + **stisnjeno vrstico 587–603 brez lastnega pravila**;
  2. **vrednosti pišejo ČEZ pasovo zgornje pravilo** (top-anchor) — dodelitev po večini črnila (ink centroid);
  3. **imenska/hišna/kultur plast = v57 bralec jebral po vrsticah 1:1 (brez preskoka)**, vrednostni sloj pa s **PRESKOKOM udarjene 54 pri vrstici 5 (Nro 85)** — od tod zamik vrednosti za eno vrstico od r4 naprej;
  4. **digitcmp** primerjave oblik števk iz iste strani (metoda val 121).
- **Orodja:** `val124-anchor/anchor7.py` (pravila + ink centroid) + `build-register-v124.py` (GUARD deklarirano-staro ≟ register) + celicni zoomi ×12–24; crops regenerabilni (`.gitignore`).
- **0 VLM klicev** — vsa branja agentski vid v glavni seji.

## 2. KLJUČNA NAJDBA (F-V123-01 REŠEN)

**v57/v82 bralec je PRESKOKIL udarjeno 54 (vrstica 5, Nro 85, Lappary Marbl) in nato vrednosti bral eno vrstico nizko do konca strani.** Vstavljena vrstica (Nro 92, hiša 56, stisnjena na levi 587–603, tiskano pravilo 585–603 na desni) je svojo vrednost **54 (ud.)** dala registrski vrstici r10 (Schimez Hanl), katere prava vrednost je **56**. Šest odstopanj iz v123 (19/49, 103/138, 36/56, 224/321?, 945/262, 297/397) = kombinacija zamika + števkovih variant. Rep 187/58/110 = vrstice 19/20/21 (Nro 99, 100, EXTRA brez Nro) — 1:1 po zamiku. **Identiteta (imena/wohnort/kultur) ostaja 1:1 — v57 jebral brez preskoka; premakne se SAMO vrednostni sloj + 1 nova vrstica + fantom.**

## 3. Vgradnja p7 (`build-register-v124.py`, GUARD)

| Vrsta | Podrobnost |
|---|---|
| **7 vrednostnih popravkov** (r4–r10) | r4 241→**54** (preskočena udarjena 54, Nro 85), r5 19→**241** (v82 4→1 varianta), r6 31→**49**, r7 169→**31**, r8 103→**169**, r9 36→**138** (v82 5→3), r10 54→**56** (54 = vstavljene vrstice vrednost) |
| **Vstavljena vrstica Nro 92** (r11) | stisnjena med 91 in 93 (leva brez pravila, desna 585–603); kl **54 ud.**; hiša **56** (prej 26 — 2↔5 varianta po knjigi); ime v57 »(K)hanzl Valen« ohranjeno z oklepaji (nečitljiva stisnjena pisava → F-V124-01); rp **v124-dvojni-anchor** |
| **3 re-sidranja repa** | r14 224→**321** (zoom ×18: 3-2-1 ud.; isti celici, zdaj pravilno sidrana), r16 945→**262** (945 = nemogoč variant; 2/3 dvoumna — 262 po soglasju z v123 oljnim zaporedjem), r17 297→**397** (2→3 varianta) |
| **EXTRA vrstica** (r20) | IZVEN Nro sekvence: **ditto-Strauß** (brez lastnega imena), kl **110 ud.**; hiša neberljiva (F-V124-01); v112 »r19 trojna oznaka« (110 + 7\|373 + 1\|1147) se nanaša na ta pas + Fürtrag; rp v124-dvojni-anchor |
| **Fantom-Fürtrag** | premaknjen r20→**r21** (anmerkung »fantomski rep« + Furtrag 2\|687→rdeče 1140 + podstolpec 7\|373 + 1\|1147) |
| **ertrag_kr re-sidro** | »1 -381« premaknjen r3→**r4** (rdeča kapitalna opomba stoji ob vrstici 5 / Nro 85 — v123 page_obs »p7 b4 1-381«) |
| **Nro 91/92/93/94 rdeče prečrtani** | kontekst prodaje 1814 (»v. 1814 gekauft an Schimeczkhanl«) — vrstice ostajajo podatkovne |

Vsi vrednostni popravki imajo `klafter_pre_v124` (15 snimk); anmerkung add-only `[v124: ∅|staro -> ∅|novo dvojni-anchor F-V123-01 …]` / `[v124 NOVA VRSTICA (F-V123-01) …]`. **p7 zdaj 22 vrstic = 20 podatkovnih (Nro 81–100) + EXTRA + fantom.**

## 4. 7 DISPUTE val 123 — RAZREŠENI (celicni zoomi ×12–24 + digitcmp)

| Disput | Sodba | Dokaz |
|---|---|---|
| **p10 r18** 1038/1088 | **POTRJENA** (1038) | tretja številka = 3 (odprt zgornji lok; cf. r5 1148 = zaprti lok 8) |
| **p11 r3** 79/89–99 | **FIX 79 → 99** | prva številka ima zaprto zanko + rep = 9 (7 brez zanke — cf. r17 čista 78; 8 brez repe — cf. r8 280) |
| **p11 r20/r21** 211/185 | **POTRJENA obe** | 211 v svojem pasu (top-anchor pravilo 938); 185 (udarjeno + svinenik) v pasu r21 — v123 »neujemljiv par« razpadel s pravilno pasovo atribucijo; Fürtrag 2\|798 → rdeče 81 ločeno |
| **p12 r17** 82/53–426 | **FIX 82 → 53** | 5 = raven vrh (cf. 650), 3 = dve skodeli; »426« = artefakt detekcije; »— 20« v E. coni = ločen zapis |
| **p13 r17** 112/182 | **FIX 112 → 182** | srednja številka = 8 (dvojna zanka), ne 1 |
| **p14 r0** 687/157–187 | **FIX 687 → 187** | prva = 1 (vertikala brez spodnje zanke, ≠ 6); srednja = 8 (okrogel vrh, ≠ 5 raven); zadnja = 7 |

**Bonus najdbi (izven disput):** p11 r15 382→**582** (raven vrh = 5 — nova najdba pri pasovnem re-readu p11) + p11 r17 **78 potrjena** (7 brez zanke, zoom ×18 — nizko-ločljivostni »98« ovržen).

## 5. Odpri flagi (iskrenost — nič siljeno)

- **F-V124-01 (p7 imenska/hišna plast):** v57 imenske napačne brale (r5 »Schimeczkhanl« knjiga »Schimz Mihual«; r13 »Peders Marbl« knjiga »Pödigz …«); hišna odstopanja (r1 63/53, r2 20/54, r5 65/49, r10 35/55, r13 80/48, r14 48/45, r15 45/47, r19 48/45); vstavljena vrstica ime nečitljivo; EXTRA hiša neberljiva — **ločen val (NR-14 + hišna plast), NIČ popravkov v v124**.
- **kultur_p7:** dvovrstični »Lehngut Hfl.« nizi čez pravila NISO bili re-sidrani v v124 — ločen prehod; obstoječi v112 zapisi ostajajo.
- **262 r14:** prva številka 2/3 dvoumna — sprejeta po soglasju z v123 oljnim zaporedjem (dokumentirano v readings).

## 6. Kaskada (izrecna)

register (16 sprememb: 12 klafter + 1 ertrag_kr + 2 NEW_ROW + 1 anmerkung; 2875→2876) → **c4 v90**: K9 p1–55 **jaethe_empty 959→960** (+1 vstavljena: jae prazno, kl 54), **klafter_plain_le99 177→178**, both_filled **56** nespremenjen, klafter_empty 84; **K5 dito 207→208/2876** (EXTRA vrstica je ditto; bloki 2607) → **KG vsebinsko IDENTIČNA** (3764/3473/2427/2775 — builder ne bere vrednostnega sloja niti števila vrstic; sha **fc23ab10 → ee3ac862**, timestamp-only) → story (3764/3473/4) → timeline (8 točk; I1/I2/I6 ✓) → coverage (PASS 8; §24 14/14) → **source-coverage rows 2876** (builder prehod: build-coverage-report.py 2875→2876) → **analysis-v5/v6 regenerirani** (varovalki v builderjih 2875→2876; deterministična byte-identna re-runa ✓) → runtime src/data sinhronizirana. **Osebna plast NESPREMENJENA** (F-SYNC-04); imenska/hišna plast p7 NESPREMENJENA (F-V124-01).

## 7. Iskrenost (§4)

- **0 VLM klicev**; vsa branja agentski vid na programsko generiranih izrezkih (regenerabilnih, crops/ v .gitignore).
- **Vse spremembe z GUARD-om** (deklarirano staro ≟ register) + snimke `klafter_pre_v124`; disputni anmerkungi v123 ostajajo (zgodovinski vir) + v124 sodbe add-only.
- **Disputa sledi VREDNOSTI, ne vrstici:** v123 disput anmerkungi za stare r13/r15/r16 (224/945/297) so ob ponovnem sidranju premaknjeni na pravilne fizikalne linije (r14/r16/r17) — dokumentirano v testu.
- **Nedvoumno ostaja odprto:** 262 prva številka, EXTRA hiša, imenska plast (F-V124-01) — nič siljeno.
- Testi: **+17 varovalk (tests/val124)** + izrecen prehod pinov: 2875→2876 (rovnatež 19 datotek), sha fc23ab10→ee3ac862 (kaskadne), K9 959→960 + 177→178, K5 207→208, ditto 207→208, v112 265→264, p1–55 1077→1078, val 88 `gi115`→`gi124` preslikava (+1 @93), val 112 indeksna preslikava za changes @≥93; **1358 testov: 1347 pass / 11 skip / 0 fail**; lint + tsc čisti.
- Neskrbljiv duplikat `src/data/coverage-report-1825.json` izbrisan (neReferenciran, vsebinsko identičen atlas kopiji).
- Docs: protokol 147 + KAZALO 147 + README 184. sklop.

## 8. Naslednje

1. **F-V124-01**: p7 imenska/hišna plast (v57 napačne brale + nečitljiva vstavljena vrstica + EXTRA hiša) — ločen val z NR-14 metodo;
2. kultur re-sidro p7 (dvovrstični nizi) — majhen ločen prehod;
3. **NR-14 črkovalna sodba + p56–143 osebni re-read** (reši RG-009/010/011 in PROVISIONAL lastnike h72/74/76);
4. register 26-0326/26-0379 ob javnih poročilih eArheologija;
5. F-H122-01: deterministična disambiguacija 13 podvojenih H-1-* ID-jev.
