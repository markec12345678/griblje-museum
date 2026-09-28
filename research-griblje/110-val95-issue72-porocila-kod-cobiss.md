# 110 — 95. val: ISSUE #72 — vsebinska poročila raziskovalnih kod (2012–2014 + 21-0141): šest doslej nezapisanih primarnih poročil odkritih in bibliografsko potrjenih prek COBISS.SI + Memento 2026 dobil ISBN in knjižnično lokacijo

**Datum:** 2026-09-28 · **Naročilo:** »odlicno nadaljuj« (kontinuiteta seje)
**Vir:** issue #72 (protokol »brez podvajanja«) + katalog COBISS.SI (legacy zapisi `plus-legacy.cobiss.net`, prenešeni in prebrani v tem valu) + ZRC IZA bibliografije 2019–2023 (izseki prenešeni) + ised.gov.si eDEDIŠČINA (javni API, preizkušen)
**Obseg:** muzejska vsebinska plast — **+7 virov (6 × MVG-083, 1 × MVG-003) / +1 dopolnilo opombe na MVG-083 (tiran-2021-klepec-krasinec) / nov odstavek zgodbe MVG-083 (sl+en) / dopolnilo zgodbe MVG-003 (sl+en) / +0 zapisov / +0 KG / +0 UI** · ATLAS 1825 pogodba §22 NEIZMENJANA

---

## 1. Kontekst in izbira obsega

Worklogova »naslednja« po valu 94: **»1. Signatura listine 1468 21/9 v DOZA (MOM — zahteva brskalniški dostop izven peskovnika) 2. Polno besedilo Kresne pesmi 1888 (dLib seja-vezan) 3. Vsebinska poročila raziskovalnih kod (2012–2014 + 21-0141). 4. Memento 2026.«**

Prvi dve nalogi ostajata pošteno odloženi (obe zahtevata sejo/prijo, ki ju peskovnik nima). Izbrana naloga #3: **vsebinska poročila raziskovalnih kod** — torej najti primarna strokovna poročila raziskav EŠD 10094, ki jih muzej poznava samo iz zbornikov *Arheologija v letu* (vpisi izvedbe, ne vsebine). Naloga #4 (Memento 2026) se je v istem valu nepričakovano delno rešila kot stranski zadek iste sistemske poti.

## 2. Nova pot (kako je val vire našel)

1. web_search za poročilo 21-0141 (Tiran, Husič, Grahek — Klepec–Krasinec, COBISS.SI-ID 66817539) → zadetek na **bib.cobiss.net** (SICRIS bibliografija avtorice) in iza2.zrc-sazu.si (bibliografija IZA 2021, izsek 23 str. prenešen; vnos #83 potrdi bibliografijo, brez povezave; vnos #82 (Panorama, Ptuj) ima povezavo `ised.gov.si/api/javna/neavtoriziran/arheo/prvo_porocilo/files/28759/download` = odkritje državnega API-ja).
2. **ised.gov.si API preizkušen**: prenos poročila 26740 (2014, Ig — nadzorni vzorec, ni Griblje) deluje brez prijave; enako 28759 (28,9 MB, Ptuj 20-0142 — pokazal, da ID-jev ni mogoče ugibati; oseki niso prenešeni dalje). eDEDIŠČINA javni portal (`/public-app/`) = SSO prijava (SICAS); Angular bundle analiza: modul `arheo` = le poklicne vloge (eSDE), javnega iskanja po poročilih NI. Konfiguracijski endpoint `/api/common/neavtoriziran/environment/nastavitevSeznam` javno dostopen (potrditev arhitekture).
3. ZVKDS site search: 0 zadetkov za Griblje. arheologija.si: brez poročil. ZRC IZA bibliografije 2019/2020/2022/2023: brez Griblje-vnosov.
4. **PRELOM — plus-legacy.cobiss.net deluje** (novi plus.cobiss.net = »Oh noes!« blokada): `bib/66817539` vrne polni zapis; **iskanje po predmetni oznaki `su=Griblje` (paginirano do izčrpanja) = 10 unikatnih zapisov**, med njimi 6 doslej muzeju nezapisanih strokovnih poročil + Memento 2026 + pedološka karta + zbornik šole + Gribeljski žbul (žega — ni vgrajen).

## 3. Rezultati (vsak zapis prebran, bibliografija potrjena)

| # | vir (COBISS.SI-ID) | leto | izdajatelj | zaloga | teme po katalogu |
|---|---|---|---|---|---|
| 1 | 26805805 — Čaval, S., Mason, P.: kanalizacija G 6, ekstenzivni pregled | 2004 | Zavod za varstvo naravne in kulturne dediščine, Novo mesto | SAZU (ni za izposojo) | Griblje, arheološka najdišča, **antika**, Bela krajina |
| 2 | 512475179 — Žerjal, T., Pintér, I., Mason, P.: parcela 15/3 (Štrucelj), predhodne raziskave | 2010 | ZVKDS, Center za preventivno arheologijo (elaborat, študija) | ZVKDS RESCLJ, čitalnica 1 | arheološke raziskave, najdišča, Griblje |
| 3 | 512737835 — Gutman, M.: **EŠD 10094 — poročilo naravoslovnih preiskav** | 2012 | ZVKDS, Restavratorski center | RESCLJ, čitalnica 2 | najdbe, **kovinski predmeti**, naravoslovne preiskave |
| 4 | 512698923 — Udovč, K.: Starašinič, parcela 251 k. o. Krasinec | 2012 | ZVKDS CPA | RESCLJ, čitalnica 1 | arheološke raziskave, Griblje |
| 5 | 121330947 — Černe, M.: Brodarič, parcela 67/3, predhodna raziskava | 2022 | ZVKDS, Center za konservatorstvo + CPA | RESCLJ, čitalnica 1 | raziskave, najdišča, najdbe, **grobišča, plano grobišče** |
| 6 | 161615619 — Udovč, K., Černe, M., Kramberger, B.: Brodarič 67/3, **izvedene** raziskave | 2023 | ZVKDS, Center za konservatorstvo + CPA | RESCLJ, čitalnica 1 | arheološke raziskave, najdišča, najdbe |

**Brez podvajanja — kako se šest poročil vezuje na obstoječe zapise:**
- (1) G 6 = **nov kanal** — muzej citira samo G 1/G 4 (VS 42, 2005) in pregled 1999–2001 (VS 39–41); G 6 je leto starejši od G 1/G 4.
- (2) 15/3 = **primarno poročilo** za raziskavo, ki jo muzej pozna po povzetku VS 48 (2011, Nadbath/Žorž; ~4.900 najdb) — primarno poročilo je 2010, avtorja Žerjal/Pintér/Mason; **avtorska nabora se razlikujeta, muzej obeh ne združuje**.
- (3) Gutman 2012 = **prvo konkretno vsebinsko poročilo o EŠD 10094 v muzeju** — iz okna 2012, začetka zapora 2012–2014, ki ga issue #72 išče; tema »kovinski predmeti« = katalogizacijska oznaka.
- (4) Starašinič = **nova lokacija** na robu registrske enote (k. o. Krasinec, parcela 251); katalog zapis vezuje na Griblje.
- (5)+(6) Brodarič 67/3 = **nova parcela + par stopenj** (2022 predhodna → 2023 izvedene); (6) je **četrta raziskava 2023** poleg kod 23-0070/23-0168/23-0261 — v zborniku *Arheologija v letu 2023* NE navajena (koda raziskave iz naslova ni razvidna — TO_COLLECT).

**Dopolnilo vira 21-0141 (66817539, Klepec–Krasinec):** vrsta gradiva *elaborat, študija*; uradna predmetna označitev: gomile, naselja, prazgodovinske arheološke ostaline, plana grobišča (teme poročila, **ne najdbe**); zaloga: **»nobena knjižnica v sistemu COBISS.SI nima izvoda tega gradiva«**; poti do vsebine: eDEDIŠČINA (ised.gov.si — javni API deluje, ID zahteva eSDE prijavo) + ZVKDS CPA.

**Memento 2026 (281712899, issue #72 točka 8):** knjiga; izdajatelj **Prostovoljno gasilsko društvo Griblje**, 2026; **ISBN 978-961-07-3422-2**; teme Griblje/Cerkev/Zgodovina; zaloga: **Slovenski šolski muzej, Ljubljana (SSMULJ), v čitalnico 1 izvod** = prva znana javno dostopna knjižnična lokacija izvoda; izvodi pri PGD/KS TO_COLLECT; vsebina (kazalo, prispevki dr. Weissa in drugih) ostaja TO_COLLECT.

## 4. Pošteni negativni rezultati (dokumentirano, brez ugibanja)

- plus.cobiss.net (nov vmesnik): »Oh noes!« blokada; bibli.cobiss.net (SICRIS): HTTP 500 na direktnih poteh.
- ised.gov.si: javni API prenosa deluje, a **iskanja po vsebini ni** (vsi kandidatski endpointi = generična napaka); javni portal = SSO; ID-ji se ne izumljajo (v muzejskih opombah ni nobenega številčnega ID-ja datoteke).
- ZVKDS spletno iskanje: 0 zadetkov; ZRC IZA 2021 izsek: vnos #83 (Klepec–Krasinec) **brez** ised povezave.
- COBISS zapis 66817539: brez bibliografskih povezav do vsebine (samo citatno identiteto).
- Vsebine vseh sedmih dokumentov ostajajo nepregledane (REVIEW/TO_COLLECT) — katalog opisuje teme, ne najdb; **muzej ne trdi nobene najdbe iz teh poročil**.

## 5. Vgradnja

1. **MVG-083**: 6 novih virov `zvkds-caval-mason-2004-kanal-g6`, `zvkds-zerjal-2010-strucelj`, `zvkds-gutman-2012-naravoslovne`, `zvkds-udovc-2012-starasinic`, `zvkds-cerne-2022-brodaric`, `zvkds-udovc-2023-brodaric` (objave; URL = legacy COBISS zapis; opombe sl+en: bibliografija, zaloga, predmetne označitve s protokolom »tema ≠ najdba«, statusi) + nov odstavek zgodbe (sl+en).
2. **MVG-083 — dopolnilo opombe `tiran-2021-klepec-krasinec`**: COBISS identiteta + označitev + zaloga + poti (ised/eSDE, ZVKDS CPA) — URL vira nespremenjen (ZRC IZA).
3. **MVG-003**: nov vir `cobiss-memento-2026` + dopolnilo zgodbe (sl+en) o bibliografski identiteti in čitalnici SŠM.

## 6. Številke (izrecen prehod, ne tih)

- **+0 zapisov** — 114 · **+7 virov (609 → 616)** · **+7 identitet (488 → 495)** · **deljenih ostaja 68** · **+0 KG / +0 ATLAS (§22)** — novi viri izključno eno-zapisni: 6 × MVG-083, 1 × MVG-003 (pin v testu).
- readme-sync zeleno (Stanje zbirke + /api/opendata 114/616).
- tsc čist · lint čist · val94 številčna varovalka 609/488 → >= z opombo o zakonitem prehodu (vzorec val93→val91).

## 7. Varovalke (tests/val95-issue72-porocila-kod.test.ts — 19)

1. šest novih virov obstaja na MVG-083; 2. G 6 (antika = oznaka teme); 3. Štrucelj 2010 (predhaja VS 48, različna avtorja); 4. Gutman 2012 (prvo vsebinsko poročilo EŠD 10094); 5. Starašinič (brez interpretacije lokacije); 6. Brodarič 2022 (plano grobišče = tema); 7. Brodarič 2023 (četrta raziskava, v zborniku NE); 8.–9. dopolnilo 21-0141 (označitev + zaloga + ised pot); 10. REVIEW/CONTENT NOT FOUND ostajata; 11.–12. Memento 2026 (ISBN/PGD/SSMULJ + zgodba); 13.–15. zgodba MVG-083 sl+en z izrecno poštenostjo; 16. prehod števcev 114/616/495/68; 17. eno-zapisnost novih virov; 18. pošten negativ (ne ugibati najdb, brez izumljenih ised ID-jev); 19. varovalke sl+en simetrija.

## 8. Naslednje (po prioritetah issue-ja #72)

1. **ID-ji prvih poročil v eDEDIŠČINI** (21-0130, 21-0141, 21-0432, 23-0070, 23-0168, 23-0261 …) — zahteva eSDE prijavo (izven peskovnika) → REVIEW dvigi vsebin.
2. **Vsebine šestih novih poročil** — zaloga ZVKDS RESCLJ čitalnica (Poljanska cesta) + SAZU (G 6) → branja → dvigi REVIEW.
3. **Memento 2026 vsebina** — izvod v čitalnici SŠM Ljubljana ali pri PGD/KS Griblje → kazalo poglavij, primerjava z obstoječimi zapisi.
4. Signatura DOZA/1468 (MOM); polno besedilo Kresne pesmi (dLib seja).
