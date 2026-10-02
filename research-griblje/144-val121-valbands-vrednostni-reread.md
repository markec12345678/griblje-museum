# 144 — Val 121: PASOVNI VREDNOSTNI RE-READ PS p3–p55 (F-OCI-05 zaprtje) — 89 kl + 6 jae vgradnj, 0 VLM

**Datum:** 2026-10-06 · **Issue:** #42 §4/§14 (+ #72 vrsta) · **Obseg:** celoviti vrednostni re-read jae/kl stolpcev na vseh straneh z odprtimi razhajanji + sistematski sweep (21 strani, 1077 vrstic, ~20 vrednostnih celic na stran) — rešitev točke F-OCI-05 protokola 143 (»pasovni vrednostni re-read z bottom-rule anchoringom«) · **Status:** **vgradnja** — register.json + c4 + KG + story/timeline/coverage regenerirani; 0 VLM klicev.

---

## 1. Metoda (F-VB infra-nauk val 121)

**Bottom-rule anchoring:** vrednost pripada pasu NAD svojim pisanim spodnjim pravilom — atribucija je vidna, ne računana (protokol 143 §6.1). Dve kritični infra-lekciji, obe odkriti in dokumentirani med valom:

1. **TOP0 mora biti dno glave** (cona [146, 184]); brez omejitve iskanje zaklene ENO VRSTICO PRENIZKO (p17: r0 bottom = 201, ne 157 = pravilo glave; p43: prvo podatkovno pravilo 176 nezaznano).
2. **PER-VRSTIČNI SNAP je NEVAREN** (textne vrstice v X 370–600 so privlačnik); pini so comitane — linearni graf iz verificiranega top0 je pravilen.
3. **SKEW MED STOLPCI 8–14 px** (fotografirana knjiga): pravila v imenskem stolpcu (X 370–600) NISČA na enaki y kot pravila v kl stolpcu (X 795–872). Atribucija se dela z LOKALNIMI pravili stolpca — in pri najhujših primerih (p42 rep, p47) z **IMENSKIM SIDROM** (ime v isti pasu kot vrednost).

**Orodja:** `make-valbands-v121.py` (pasovi X 150–1150 ×4 + vrednostni trakti X 690–1150 ×6 + celicni zoom + kal), `adj-v121.py` (robustno pravilno-fitanje: maksimizacija zadetkov črte c+s·k na zaznana pravila ± 6.5 px, snap), `strip-v121.py` (4-vrstični trakti ×12 s pravili), `make-digitcmp-v121.py` (mikro-primerjave števk). Kalibracija vsake strani: 2–4 jasne (nerazpravljene) celice morajo brati register vrednost.

## 2. Pokritost in rezultat

- **23 strani** (p5, p17–p24, p28, p29, p31, p32, p34, p36, p37, p42, p43, p44, p47, p51, p52, p53, p54), ~620 vrednostnih celic prebranih; 21 strani z vgradnjo.
- **91 popravkov** (89 kl + 4 jae set + 2 jae clear — dve vrstici z obema poljema), **5 potrditev** (p53: zastareli spori, vrednosti del 2e že pravilne), **4 ohranitve** (p36 r0 flourish 9/7; p47 r1 madež; p54 r18/r19 v114 zdrs atribucije).
- **26 NOVA** napak = niso jih flaggala nobena predhodna razhajanja (sweep jih je našel: p17 r13 794, p18 r0/r7/r8/r10, p19 r0/r18, p20 ×8, p22 r7, p23 r2/r3, p24 r5, p42 r15, p43 r17).
- **K9 p1–55** (c4 v90): both_filled 52→**56**, jaethe_empty 961→**959**, klafter_empty 85→**84**, jaethe_plain_le99 62→**65**, klafter_plain_le99 179→**177**, gt1599 vsota 15→**10** (velike napacne vrednosti popravljene: 2245→245, 9116→474, 1874→1313, 1498→1098, 1164→7144 NOVA…).
- **KG b3e9797e**: vsebinsko IDENTIČNA (0 vozlišč/vezí/claim difov — samo generated_at + provenance register sha); K5 207 (bloki 2607), 2875 vrstic, TRANSCRIBED=0.

## 3. Ključne najdbe (F-VB-01..08)

- **F-VB-01 (FIXED):** F-OCI-05 kandidati razrešeni — p31 r0 **1305** (ne 1785), p43 r19 **1|1977** rdeče prečrtan + Fürtrag blok (7|862 prečrtan → rdeča 1|1052), p37 r2 **705** potrjen (nizko, v pasu r2).
- **F-VB-02 (FIXED):** v82-era plast (p17–p24) = sistemska napaka vrednostne kolone — p20 je imela **10/20 napačnih kl vrednosti** (50 %!), p18 10, p22 10. Vzorec: Kurrent glifi 5/6/8/9 med seboj zamenjani + split notacija napačno razdeljena (p18 r4: "1|243" = vodilna 1 V kl celici → 1243).
- **F-VB-03 (DOCUMENTED):** v113 kandidati v ~60 % sporov potrjeni (p44 970, p51 288/52/1186, p52 392, p53 …), v ~25 % NOVA vrednost (p22 442/753/644, p23 1445/1487, p24 1094), v ~15 % register ohranjen (p2 854, 690 …). Oba prejšnja branja sta lahko hkrati napačni.
- **F-VB-04 (DOCUMENTED):** **stari spori so lahko že zastareli** — p53 (del 2e jih je vgradil, anm ostala "odprta"): zaprta z "potrjeno" brez vgradnje. Pomeni: anm "— odprto" ni vedno znak aktualne napake.
- **F-VB-05 (DOCUMENTED):** **madež/flourish = nerešljivo** — p47 r1 zadnja števka pod madežem (1165 ohranjena), p36 r0 flourish 9/7 (657 ohranjena); izrecno dokumentirano kot ohranitve z dvomom, ne tiho zaprtje.
- **F-VB-06 (DOCUMENTED):** **Fürtrag bloki** — p42: črno prečrtan ~7|365 + rdeča končna 1|318 (pod r20, brez register vrstice); p43: 1|1977 (r19) + 7|862 prečrtana + rdeča 1|1052; page_observations_v121.
- **F-VB-07 (INFRA):** p42/p47 dokaz, da linearna mreža na repu strani zdrsne (detektirana pravila 828/867/905 z razmaki 33–42 px) — pri takšnih straneh ime+pravilo skupaj, ne top0+STEP.
- **F-VB-08 (CONFIRMED):** p37 r2 705 (F-OCI-05 tretji kandidat) potrjen — nizko pisanje je stil, ne napaka.

## 4. Iskrenost (§4)

- **0 VLM klicev**; branja z agentovim vidom glavne seje (metoda val 118–121).
- Kalibracijska slepota: razhajanja-anm (kandidati v113/v114) so bila vidna pri sodbi — izrecno dokumentirano; kompenzacija: sodba je padla na glifih ×16–22 (ne na kandidatih), 26 NOVA napak pa je bilo najdenih NČEZ flagane spore (sweep ne glede na anm).
- Vsi dvomi izrecni: p36 r0 (9/7), p47 r1 (madež), p28 r12 (561 pri ~85 % zaupanju, rdeča črta), p29 r19 (649 vs 64½ — znak zgoraj), p42 Fürtrag (~7|365, rdeča 1|318).
- Predpomnilniška napaka med sejo: prva vgradnja je za p5/p53 uporabila napačne vrstične indekse (r19 namesto r9; r3/r4/r7/r8 namesto r13/r14/r17/r18) — **zaznano z GUARDOM** (deklarirano staro ≟ register), register povrnjen iz git, popravljeno in ponovno vgrajeno; sporno stanje ni bilo nikoli committano.

## 5. Kaskada (izrecna)

c4-metrika v90 (K9 zgoraj) → KG rebuild (3762/3471/614; vsebina identična) → story (3762/3471/4) → timeline (8 točk; I1 441 ✓ I2 ✓ I6 ✓) → coverage (PASS 8, §24 manifest 14/14) → runtime src/data kopije sinhronizirane. **KG sha 596c1ca7 → b3e9797e** (samo generated_at + provenance). Register sha fb439f80 → novi (vgradnja). Pini posodobljeni v 19 testnih datotekah; +12 varovalk (tests/val121-valbands-vrednostni-reread.test.ts).

## 6. Naslednje

1. hiša 70–78 (PROVISIONAL h72/74/76) — ločena odločitev;
2. p3–p16 vrednostni sweep (brez flagov, nizka priorinteta — v82-era brez re-reada);
3. register 26-0326/26-0379 ob javnih poročilih eArheologija;
4. črkovalna sodba imenskih variant (celicni zoomi) — NR-14 ostaja za imena.
