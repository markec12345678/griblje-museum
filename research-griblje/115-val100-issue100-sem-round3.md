# 115. val (100) — ISSUE #100, runda 3: poznejši viri za hišo št. 73 — SEM fototeka po fondih, popolna dokumentacija F0000212, nova fotografija F0003143, dva COBISS-vira

**Val:** 100 · **Issue:** #100 (PRVI REFERENČNI OBJEKT GRIBLJE — F0000212 → HIŠNA ŠT. → KATASTER → PARCELA → 3D → AR) · **Datum:** 29. 9. 2026
**Metoda:** 0 VLM klicev, 0 spletnega iskanja (kvota 429 — vzorec vals 98/99); direktni dostop na dosegljive portale (SEM 200, Wikipedia 200, Kamra 200, COBISS legacy 200) + artefakti s sha256
**Pravilo ne-podvajanja:** MVG-010 že citira F0000212/838 + pet-predmetno enumeracijo lokacijske strani — ta val doda SAMO: prazna polja avtor/datum, izvirni posnetek + sha256, F0003143 (še necitirana), 2 COBISS vira, fond-strukturo pot (NOT_PUBLIC).

---

## 1. Kontekst — naslednji korak po rundi 2

Runda 2 (val 99) je dokazala: hiša št. 73 v 1825 virih NE obstaja (polna pokritost) → veriga mora teči po poznejših virih: **2. franciscejska izmera (~1867–69)/eZKN, ZK vpisi, SEM fototeka fond Županič–Vurnik 1930, občinski zapisi**. Runda 1 (komentar lastnika) je izrecno zahtevala: »iskati po avtorju/fondu/terenu in ne samo po filtru Lokacija = Griblje«.

Ta val izvaja tretjo rundino točko (SEM fototeka po fondu) v celoti, kolikor je mogoče iz peskovnika.

## 2. Omejitve peskovnika (deterministično dokumentirane)

| Portal | Status | Pomen za verigo |
|---|---|---|
| etno-muzej.si (SEM) | **200** | celotna runda 3 |
| sl.wikipedia.org | **200** | bibliografija + re-check |
| kamra.si | **200** | iskanje (2 zadetka, oba že citirana) |
| plus-legacy.cobiss.net | **200** | 2 nova viri |
| ezkn.gov.si, egp.gu.gov.si, eprostorunki.gov.si, gis.gov.si | **000** | **2. franciscejska izmera/eZKN — NEIZVEDLJIVO v peskovniku → izven njega** |
| dlib.si | **000** | (vzorec val 98) |
| researchgate.net | **403** | članek Promitzer (URL ohranjen iz runde 1) |
| kataster.fgg.uni-lj.si | **000** | — |

Zemljiškoknjižni vpisi k. apl. Griblje: NOT_PUBLIC (samo na kraju samem) — izven peskovnika.

## 3. F0000212 — popolna objektna dokumentacija (issue #100 §1)

Javna stran objekta (`/sl/digitalne-zbirke/zbirka-starih-fotografij/f0000212`) re-fetched in shranjena:

| Polje | Vrednost |
|---|---|
| Zbirka | Zbirka starih fotografij |
| **Avtor** | **(prazno — javni zapis ne navaja)** |
| Klasifikacija | Hiša / Praznična noša in noša ob posebnih priložnostih / Etnologi |
| Lokacija | Griblje |
| **Datum** | **(prazno — javni zapis ne navaja)** |
| Pravice | SEM (dokumentarno: miha.spicek@etno-muzej.si; filmsko: nadja.valentincic@etno-muzej.si) |

- **Status javne strani: VERIFIED; avtor/datum: NOT_PUBLIC** — to je pošten podatek za verigo §8: kdaj je bil posnetek narejen in komu je pripadal, lahko potrdi samo muzejska dokumentacija.
- **Izvirni digitalizirani posnetek prenešen: 1200×782 JPEG** (brez stilske transformacije; javna predstavitev 737×480) — ohranjen kot arhivski artefakt z sha256.
- **Vizualna kontrola posnetka (1200×782):** dvonadstropna apneničeno bela hiša s krito streho, zgornja lesena galerija (gank), moški na klopci ob levem vogalu, druga oseba na sveže razžaganih hlodih, vozna pot desno z manjšo hišo, dve visoki topoli, gospodarsko poslopje levo. **Hišna številka na posnetku NI vidljiva** → identiteta št. 73 ne more priti s fotografije, samo iz pisanih virov.
- EN verzija strani: 404 (objekt ni preveden).

## 4. SEM fototeka po fondih — izčrpna preskanjava (runda 1 točka: »po avtorju/fondu/terenu«)

- **Zbirke fotografij online: 18** (enumerirane v summary JSON): Terenske fotografije, Ameriške poroke, Karol Holynski, Individualne terenske raziskave kustosov SEM, Joža Kozak, Vekoslav Kramarič, Rado Kregar, Matija Murko, Peter Naglič, Veno Pilon, Slavko Smolej, Anton Šušteršič, Jernej Šušteršič, Tiskovni urad, Togo Album, Fran Vesel, Zbirka starih fotografij, Zbirka športnih fotografij Marka Račiča.
- **Fond Županič–Vurnik 1930/31 NI med njimi → oznaka NOT_PUBLIC.** Fototeka SEM šteje 70.000+ enot; javni izbor »Zbirke starih fotografij« ~843 posnetkov (runda 1) — raste z obdelavo fondov.
- **»Terenske fotografije« = 32 lokacij, brez Bele krajine.** Sosednji **Drašiči imajo fond F0000022 = »Teren 22«: avtor Fanči Šarf, teren 4–10. 10. 1965** (avtor + datum potrjena na vrstici F0000022/114 — »Vogal lesene hiše … Drašiči 24, lastnik Jurij Simonič, Čurili pri Metliki«); 250 posnetkov online, **0 omemb Gribelj** v opisih. Fond 1930 je torej starejši od javno objavljenih terenskih fondov (ki se začnejo s številčenjem »Teren N« 1960-ih).
- **Ključna beseda »Etnologi«: 202 predmetov** (ena stran, brez paginacije) — F0000212 je **edini gribeljski**; drugi stari fotografiji: F0033963 (portret Borisa Orla). Ostale lokacije na ključni besedi: Vitanje (102), Dekani (42), Šentvid pri Stični (32), Kobarid (24) …
- **Lokacijska stran Griblje = 5 predmetov (potrjeno):** F0000182, F0000183, F0000212, F0000838, F0001407. Širše: Krasinec 2, Črnomelj 13, Bela krajina 24, Podzemelj 3.
- Matija Murko (250 predmetov): 0 opisov z Belo krajino/Griblji (njegova BK materiala ni v javnem izboru).

## 5. NOVA SEM fotografija — F0003143

Preiskava lokacijske strani »Bela krajina« (24 predmetov) je odkrila **F0003143** — šesto poznano SEM fotografijo povezano z vasjo (še necitirana v repozitoriju):

- **Opis SEM:** »Dr. Županičeve sorodnice na dan Sv. Ilije v vasi čez Kolpo na hrvatski strani nasproti Gribljam, Bela krajina«
- **Avtor: Drago Vahtar** (isti fotograf kot F0001407 »Hiša, Griblje«) · **Datum: 1.1.1928**
- Klasifikacija: Praznična noša in noša ob posebnih priložnostih; lokacija označena »Bela krajina« — zato ni na lokacijski strani Griblje (ta ostaja pet-predmetna — zgornja trditev MVG-010 ostaja natanko resnična)
- Slika 1200×833 prenešena (sha256 v summary)
- **Status: VERIFIED** (stran + slika)

## 6. Bibliografija — 2 nova COBISS vira z zalogami

| Vir | Založba | ISBN | COBISS.SI-ID | Zaloge |
|---|---|---|---|---|
| **Muršič, Rajko & Hudelja, Mihaela (ur.): Niko Zupanič, njegovo delo, čas in prostor — spominski zbornik ob 130. obletnici rojstva dr. Nika Zupaniča. 2009** | Znanstvena založba Filozofske fakultete, Ljubljana | 978-961-237-367-2 | **251673088** | FFLJ (6 izv., 1 v čitalnico), MKL (5), Goriška knjižnica |
| **Županič, Niko: Izbrana dela iz historične etnologije in antropologije (ob 130. obletnici avtorjevega rojstva). Ur. Aleš Iglič, Veronika Kralj-Iglič. 2006** | Filozofska fakulteta, Oddelek za etnologijo in kulturno antropologijo, Ljubljana | 961-237-177-6 / 978-961-237-177-7 | **230068736** | FFLJ (3 izv. + 1 čitalnica), SAZU (2), ODKLJ, FERLJ, MKL |

- Oba zapisa prebrana z legacy COBISS (`plus-legacy.cobiss.net/cobiss/si/sl/bib/…` — vzorec val 95), strani shranjene.
- **Status: VERIFIED bibliografija / TO_COLLECT vsebina.** Spominski zbornik 2009 je konkreten kandidat za študije o domačiji in rojstni hiši (identitetna veriga #100).
- Vir iz kataloga članka Wikipedije o Gribljah (bibliografija), ki je sicer v repozitoriju neuporabljen.

## 7. Wikipedia + Kamra (re-check, brez dvigov)

- **Wikipedia (Niko Županič):** rojstvo 1. 12. 1876 Griblje; oče Nikolaj (Miko) Zupanič, kmet in trgovec — **hišna številka NI omenjena**. Članek vas Griblje: bibliografija (Iglič–Kralj-Iglič 2006, Muršič–Hudelja 2009, Sv. Vid spominska knjiga 2008, Priročni krajevni leksikon 1997); omemba, da je Županič ohranil najstarejše slike vasi (Vavpotič, Gaspari) — že dokumentirano.
- **Kamra (iskanje »Griblje«):** 2 relevantna zadetka — plošča + spomenik; **oba že citirana** v repozitoriju. 0 novih fotografij.

## 8. Veriga #100 §8 po rundi 3

| Člen | Status po rundi 2 | Status po rundi 3 | Dokaz/runda 3 |
|---|---|---|---|
| Originalna fotografija F0000212 | VERIFIED | **VERIFIED (+ slikovni artefakt 1200×782 + exact metadata)** | val100 artefakti + sha256 |
| Avtor / datum fotografije | — | **NOT_PUBLIC** (javna strani prazna; dokumentacija SEM = pot) | objektna stran |
| Hišna številka na fotografiji | — | **ni vidljiva (vizualna kontrola)** | posnetek 1200×782 |
| Identiteta F0000212 = št. 73 | INFERRED | **INFERRED (nespremenjeno — nič ne dvignjeno)** | enoten izrekovalni vir še manjka |
| Hiša 73 v 1825 | NOT_FOUND | NOT_FOUND (nespremenjeno) | val 99 |
| Hiša 73 (Miko ~1873) | VERIFIED | VERIFIED (nespremenjeno) | Šopek (val 99) |
| Zgodovinska parcela | TO_COLLECT | TO_COLLECT (**eZKN/2. izmera = blokada peskovnika → izven njega**) | 000 statusi |
| Današnja parcela / koordinata | TO_COLLECT | TO_COLLECT (nespremenjeno) | — |
| 3D / AR | TO_COLLECT | TO_COLLECT (runda 1 pravilo) | — |

**Nove poti (iz summary `next_steps`):**
1. **SEM dokumentacija (miha.spicek@etno-muzej.si):** avtor/datum F0000212 + fond Županič–Vurnik 1930 (hišna imena 1930/31 = potencialni enoten izrekovalni vir identitete!)
2. **Muršič–Hudelja 2009** vsebina (FFLJ čitalnica / MKL)
3. **2. franciscejska izmera / eZKN izven peskovnika** — hiša 73 → stavbni odtis + parcela
4. **ZK vpisi** k. apl. Griblje (izven peskovnika) — prenos 73 na Mika ~1873
5. 86b del 3 (p110–142) ob VLM kvoti; re-read 7+2 fresh markerjev; PZ p48–65; PT p7; PR Grenz-Beschreibung

## 9. Vgradnja (brez podvajanja)

- **+3 vira, izključno na MVG-010** (zapis »Niko Županič«): `sem-f0003143`, `mursic-hudelja-2009`, `iglic-kralj-iglic-2006`
- **Dopolnjen opis vira `sem-f0000212`** (istega zapisa): avtor/datum NOT_PUBLIC + posnetek 1200×782 ohranjen + vizualna kontrola (hišna številka ni vidljiva)
- **Nov odstavek zgodbe sl+en** na MVG-010 (runda 3: javni zapis skromen; fond-struktura; F0003143; 2 knjigi)
- **Izrecen prehod števca: +0 zapisov (114) / +3 viri (622 → 625) / +3 identiteti (499 → 502) / deljenih ostaja 68** — readme-sync zeleno
- **ATLAS §22 NEIZMENJAN** (viri izključno eno-zapisni na MVG-010; KG/story/timeline/coverage/analysis ne dotaknjeni)

## 10. Artefakti val 100 (`research-griblje/val100/`)

- `issue100-round3-summary.json` — celotna runda: ugotovitve + sha256 vseh artefaktov + veriga §8 + next_steps
- SEM objektne strani: `sem-f0000212.html` (+EN 404 posnetek), `sem-f0000838.html`, `sem-f0003143.html`, `sem-f22-114.html`
- SEM struktura: `sem-zbirke-fotografij.html` (18), `sem-terenske.html` (32), `sem-kljucna-etnologi.html` (202), `sem-griblje-r3.html` (5), `sem-lok-bk.html` (24), `sem-lok-krasinec.html`, `sem-lok-*`, `sem-drasici.html` (250), `sem-murko.html` (250), `sem-fototeka.html`, `sem-search-vurnik.html` (pošten negativ: GCSE JS-only)
- Slike: `f0000212-orig.jpg` (1200×782), `f0000212.jpg` (737×480), `f0003143.jpg` (1200×833)
- COBISS: `cobiss-bib-251673088.html`, `cobiss-bib-230068736.html`, `cobiss-mursic.html`, `cobiss-iglic2.html`
- Wikipedia: `wiki-zupanic.html`, `wiki-griblje.html` · Kamra: `kamra-search-griblje.html`

## 11. Kaj ta val NE dela

- Ne dviguje identitete F0000212 = št. 73 (ni enotnega izrekovalnega vira — pravila #100)
- Ne prepisuje val 99 artefaktov (historijski posnetki ostajajo)
- Ne posega v ATLAS (§22): register/KG/story/timeline/coverage/analysis nespremenjeni
- Ne poskuša obhajati blokad (eZKN/dlib/RG) — le-te so dokumentirane kot omejitve peskovnika z izrecnimi naslednjimi koraki izven njega
