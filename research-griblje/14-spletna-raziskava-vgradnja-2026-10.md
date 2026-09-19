# Spletna raziskava Gribelj — najdbe in vgradnja (46. sklop)
*Zadatak: iskanje po spletu + vgradnja NAJDB, ki jih zbirka še NIMA (stroga kontrola duplikatov) · oktober 2026*

## Metoda
- 10 spletnih iskanj (osnove, sveže novice, EŠD/dediščina, meja, KS, Kučar, Radio Odeon, šola, poplave, hrvaški sosedje) — surovi rezultati v `raw-web-2026-10/`.
- Pridobitev strani: **griblje.netlify.app** (predstavitvena stran vasi s polnim prepisom Šopeka poljskih cvetlic), **eheritage.si** (register nepremične kulturne dediščine), **hr.wikipedia.org/wiki/Velika_Paka**, Radio Odeon, OŠ Loka, občina Črnomelj.
- Posamezne preverbe: Wikipedija SL (Griblje, Podzemelj), hr. hr-web (Velika Paka = občina Žakanje, Karlovška županija; sosed Ertić).

## ZAVRNJENO kot duplikat (že v zbirki)
| Najdba na spletu | Že pokrito |
|---|---|
| površina 3,45 km², 153,4 m, pošta 8332 Gradac | MVG-030 Griblje v številkah |
| 337 prebivalcev (2025, netlify) | statistična vrsta MVG-030: 334 (2020) / 329 (2026) — netlify ne navaja vira |
| italijanska obmejna postojanka v Gribljah | MVG-028 zaseda 1941 (postojanka + EŠD 19324) |
| KS predsednica Romana Husič | MVG-003 petstoletnica + MVG-072 praznik KS 2024 |
| DKZ ustanovljeno 1996 | MVG-089 + MVG-082 (registrirano 1996) |
| biografija Nika Županiča | MVG-010 (celotna življenjska pot) |
| Šopek poljskih cvetlic — osnovni podatki | MVG-043 (r. Pezdirc, 1855–1923, Etnolog 1937/9) |
| Kamp Podzemelj, kopališče, čolnarjenje | MVG-053 kopališče + MVG-006 Kolpa |
| turistične nastanitve (River Kolpa apartment …) | drobni poslovni podatki — ni muzejske vrednosti brez vira |

## ZAVRNJENO kot neoverljivo (nasprotuje dokumentiranemu)
- **»Leta 1477: prva omemba cerkve sv. Vida«** (netlify časovnica) — nasprotuje dokumentiranemu **1526** (urbar; EŠD 2122; MVG-002/MVG-003). Netlify stran je notranje nestanovitna (isto trdi 1526 drugje).
- **»1890: gradnja neogotskega zvonika; slikar Blaznik«** (netlify) — brez navajanega vira; muzej išče potrditev (MVG-002 ostaja: sedanja stavba 18. st.).

## VGRAJENO (add-only)

### 1. MVG-043 — Katarina Zupanič: polno besedilo Šopeka
Vir: polni prepis na predstavitveni strani vasi (nov vir `sopek-uvod-polno-besedilo`; opomba obstoječega vira Etnolog posodobljena). Novo v zgodbo:
- Katarinin lasten opis vasi: »velika vas ob Kolpi, ki šteje 110 domov«; ozemlje belokranjskih **Poljcev**; dotik ozemlja **Privršcev v adlešički župniji**.
- Spomin na **1524**: listine naj bi za Griblje povedale, da po turškem napadu istega leta **»ni ostal niti eden plug«**.
- **Prišverki** (domača imena rodbin = izvori po opustošenju):
  - Šimec (vulgo Judbinjak) — iz **Udbine**
  - Pezdirec (vulgo Loparec) — iz **Lopara v Primorju**
  - Starešinič (vulgo Švarščan) — iz **Švarče pri Karlovcu**
  - Brinci — iz **Brinja v Liki**
  - Krbavci iz Cerkvišč — iz **Krbave**
  - Mušiči iz Podzemlja (vulgo Gomirec) — iz **Gomirja**
- Vsebina zbirke: **60 pesmi** (ljubezenske, svatovske, pivske, božičnice), **161 pregovorov in izrekov**, **64 zapisov vraž, šeg in navad**, drobni **belokranjski slovar**.
- Zbiranje so nagovorili sin + profesorji novomeške gimnazije: Josip Šturm, pater Lacko Hrovat, Rajko Perušek, Ivan Vrhovec; zvezek najden v zapuščini.

### 2. MVG-004 — Uskoki in Vojna krajina: prišverki kot sled Vojne krajine v Gribljah
Odstavek vezuje uskoško/vojnokrajiško naselitev na gribeljska domača imena (kratka različica prišverkov, povezava na zapis katarina-zupanic).

### 3. MVG-015 — Meja ob Kolpi: hrvaška sosedja nasproti
**Velika Paka in Ertić** (občina Žakanje, Karlovška županija) — najbližji sosedji čez reko; vir hr.wikipedije Velika Paka.

### 4. MVG-060 — Kučar: EŠD 11118
Uradni register nepremične kulturne dediščine: železnodobno gradišče z gomilnimi grobišči (sv. Helena, Brodaričeva loza, Steljniki) in planimi grobišči — **EŠD 11118**; vir eHeritage. (eheritage.si identiteta po pravilu A1 združena z obstoječim virom MVG-083 → 317 identitet / 52 deljenih.)

### 5. Izrazoslovje — 6 novih pojmov iz Šopeka
**pir** (svatba), **debeljača** (koruza), **zdenec** (studenec), **plahta** (rjuha za pokriti posteljo), **bohó** (klic volom, da se ustavijo), **Krajnc se smeje** (vremenski pregovor: Mirna gora in Gorjanci žarijo od zahajočega sonca → lepo jutri). Vsak vezan na MVG-043 + tematske zapise. `GLOSSARY_LETTERS` dopolnjena z **B** in **D** (UI preskoči prazne črke — varno).

## Regresija (vse zeleno)
- test-entities **100 ✓ / 0 ✗** (T5.12 posodobljen: 2→3 vrstice »Šopek« — tretja je nov prepisni vir)
- test-timeline-map **72 ✓ / 0 ✗** (T7.2 415 vrstic; T7.3 317 identitet; T7.4 52 deljenih; T8 OpenData 415/415; HTTP proti živemu strežniku)
- audit-entities **✓ 0 napak**, audit-timeline-map **39 ✓ / 0 ✗**, audit-sources ✓ (informacije), audit-semantics ✓ (2 informativni opombi), verify-i18n **930 × 5**, tsc **0**, eslint **0**
- db reseeda (idempotentno) → OpenData 93/415
