# 60 · VAL 46 — TASK 98: SI PANU + ŠOLSKI IN ŽUPNIJSKI ARHIVSKI ZEMLJEVID

*Digitalni vaški muzej Griblje · 98. sklop · 46. val raziskave · 2026-09-23*
*Načelo: najprej KAJ OBSTAJA (fond → enota → leta → digitalizacija → dostop → relevantnost), šele nato branje. NALOGA = INVENTURA, NE VSEBINSKO BRANJE · LESS BUT PROVABLE · 0 novih muzejskih virov / 0 entitet / 0 dejstev / 0 UI*

---

## A. Research question

Katere **arhivske poti** (REPOZITORIJ → FOND → SERIJA → ARHIVSKA ENOTA → digitalni dostop) obstajajo za tri visokovredna zgodovinska vprašanja vasi — in katera enota je **vredna branja v naslednjem sklopu**:

1. **ŠOLA** (ustanovitev 1889, 2 oddelka — Leksikon 1937 = korooboracija MVG-026, ni primarni vir): ustanovitev, poslopje, učitelji, šolska kronika.
2. **GOSTILNA / HIŠA** (dokazi pred/okoli 1898 — MVG-109 verižna verjetnost): gostilna, lastnik, hišna številka, hišno ime, koncesija.
3. **ŽUPNIJA / GOSPODINJSTVA**: sakralno-upravna pot prek župnije, pod katero Griblje spada, ter hišne/družinske knjige.

Terminološka pravila (dosledno): kataloški zadetek ≠ zgodovinski dokaz; FOND ≠ SERIJA ≠ ARHIVSKA ENOTA ≠ DIGITALNA DATOTEKA ≠ STRAN; sekundarna publikacija (Leksikon 1937, Domoljub 1898) ostaja sekundarna, dokler primarni vir ni odprt in povezan (SOURCE → CLAIM → ENOTA/STRAN → RELEVANCE).

Ključno naročilo: **SI AS 176/N83 in SI AS 177–182 NE ponavljamo** (vali 41–45); izvidov teh valov se uporablja kot sidro.

---

## B. Repositories searched

| # | Repozitorij | Identiteta | Kanal | Status |
|---|---|---|---|---|
| 1 | **VAČ — Virtualna arhivska čitalnica** (`vac.sjas.gov.si/vac`) | Vzajemna podatkovna zbirka slovenskih javnih arhivov: ARS + vseh 6 regionalnih arhivov | Poljsko iskanje (fieldSearch: Naslov PE, Vsebina PE, Signatura PE) + tektonika (`archivePlanSearchAjax`) — brskalnik + curl; preizkušeno v valih 41/42/45 | IZČERPANO za ciljna vprašanja |
| 2 | **Zgodovinski arhiv Ljubljana (ZAL), Enota za Dolenjsko in Belo krajino Novo mesto** — bivši **Pokrajinski arhiv Novo mesto (SI PANU)**; grad Grm, Skaličkega 1, Novo mesto; enota ustanovljena 1973; zal-lj.si | Reorganizacija: PANU je danes del ZAL (potrjeno: zal-lj.si, culture.si, EHRI, Kamra) | Tektonika ZAL NM (vozlišče [1073287]): A000, A500, A530, A570, D000, D100, D120, G000, G100, G500 (G110/G580) — sprehodi do serije/enote | IZČERPANO za A000/D000/G000 |
| 3 | **Nadškofijski arhiv Ljubljana (NŠAL)**, Krekov trg 1, Ljubljana | Hrani matrike Nadškofije Ljubljana in Škofije Novo mesto (Bela krajina do 2006 v NŠAL-prostoru matrik) | **Matricula Online** (`data.matricula-online.eu`, fond Nadškofijski arhiv Ljubljana = 268 bandomov) + uradni **Popis digitaliziranih družinskih knjig (status animarum)** (Krampač, januar 2026, PDF) | IZČERPANO za Podzemelj |
| 4 | Pokrajinski arhiv Maribor (PAM) | prek VAČ (kaznilniški dosjeji) | poljsko iskanje | ciljno |
| 5 | Spletni dokumentarni kanali | zal-lj.si, nadskofija-ljubljana.si, data.matricula-online.eu, Wikipedija, Kamra, culture.si, radio-odeon.com, moja-dolenjska.si | SDK web_search (s01–s13) + page_reader + curl | kontekst |

Opomba o identiteti repozitorija (naročilo »SI PANU«): klicni znak fondov je v VAČ **`SI_ZAL_ČRN`** (UE Črnomelj) / `SI_ZAL_MET` (UE Metlika) / `SI_ZAL_NME` (Enota Novo mesto) — vse pod Zgodovinskim arhivom Ljubljana. Vseh fondov bivšega PANU ni mogoče ločiti po stari signaturi PANU; enumeracija je zato narejena po **tektoniki ZAL NM** + poljskem iskanju po celotnem VAČ (vsi arhivi).

---

## C. School archival route — POT DO ŠOLE

### C.1 Strukturno spoznanje: Griblje NIMA lastnega šolskega fonda

Celotna tektonika **SI_ZAL NM-D120 Splošne osnovne šole (1856–2005)** [1211572] je enumerirana (~59 fondov, `ajax-zalnm-D120-p0.json`): med njimi **ni fonda »Osnovna šola Griblje«**. Gribeljska šola je bila po 1963/64 podružnica (OŠ Mirana Jarca → od 1989 OŠ Loka), prej pa samostojna — a je v javnem katalogu nima fonda; njeno gradivo je **razlito po fondih matičnih šol, okrajnih organov in ZRSŠ**. Iskanje »šolska kronika Griblje« (Naslov PE, vsi arhivi) = **0 zadetkov** — kronika, ki jo muzej postavlja v Slovenski šolski muzej (MVG-026), **ni javno katalogizirana v VAČ** (šolski muzej ne izpostavlja zbirke v VAČ).

### C.2 Direktni šolski zadetki (DIRECT)

| Enota | Fond | Serija | VAC id | Leta | Vsebina (popis) | Digital | Dostop | Klas. |
|---|---|---|---|---|---|---|---|---|
| **Šolski list s prilogami: Državna osnovna šola Griblje** | SI_ZAL_ČRN/0001 Okrajno glavarstvo Črnomelj (1861–1943) [1209325] | /001 šolski listi (1861–1943) | **4118864** | **1929–1941** | »Šolski list s prilogo: **opis kraja, poročilo**«; TE 4, ovoj 12; slovenščina+srbohrvaščina | **DA — »Kopije: digitalizirano«** | javno dostopno, dovoljenje ni potrebno (nedostopnost prenehala 31.12.1941) | **DIRECT, P1 ★** |
| **Osnovna šola Črnomelj, podružnica Griblje** | SI_ZAL_NME/0234 Zavod RS za šolstvo, Območna enota Novo mesto (1961–1997) | /003 Pregledi in nadzori pedagoškega dela (1965–1995) | **747512** | **1970–1982** | poročila o pregledu pouka in šole 1970–72, hospitacijska poročila 1974–75, pedagoški nadzor 1982; 1 ovoj | NE (»Vsebuje datoteke: NE«) | javno dostopno | DIRECT, P2 (kontinuiteta) |
| Okrajni šolski svet Črnomelj: **proračun (1888)** | SI_ZAL_ČRN/0049 Osnovna šola Sinji Vrh (1870–1964) | /004 Gradivo Krajevnega šolskega sveta Sinji Vrh (1870–1942) | 4477365 | 1888 | proračun okrajnega šolskega sveta | NE | javno dostopno | DIRECT-kontekst, **P1** (doba ustanovitve) |
| Okrajni šolski svet Črnomelj: **spisi (1892)** | isto | isto | 4477372 | 1892 | spisi | NE | javno dostopno | DIRECT-kontekst, **P1** |
| Okrajni šolski svet Črnomelj: **zapisnik o oddaji del za čiščenje šolskih prostorov (1898)** | isto | isto | 4477396 | 1898 | zapisnik | NE | javno dostopno | DIRECT-kontekst, P2 |
| Okrajni šolski svet Črnomelj: računi (1900) | isto | isto | 4477401 | 1900 | računi | NE | javno dostopno | P2 |

Opomba: serija /004 vsebuje 80 enot (`ajax-sinjivrh-p0.json`), večinoma Krajevni šolski svet **Sinji Vrh**; štiri enote nosijo naslov »Okrajni šolski svet Črnomelj« (misfil/dopolnilo — organ, ki je upravljal ljudske šole okraja Črnomelj, torej tudi gribeljsko šolo, v dobi ustanovitve). Fond »Okrajni šolski svet Črnomelj« kot samostojen **ne obstaja** v javnem katalogu.

### C.3 Matični šolski fondi (P1 za ustanovitev 1889)

| Fond | Signatura | Leta | Ključne serije za Griblje | Komentar |
|---|---|---|---|---|
| **Osnovna šola Podzemelj** | SI_ZAL_MET/0030 [1209437] | **1872–2000** | /001 **Šolske kronike (1873–1922)** [3864805] — pokriva ustanovitev 1889!; /005 Katalogi učencev (1872–1943) [3864837]; /013 Finančne zadeve (1898–1965) | Pred 1889 so gribeljski otroci hodili v Podzemelj (muzej: N. Županič 1884–87); kronika 1873–1922 je najbližja katalogizirana enota dogodku 1889 |
| Osnovna šola Mirana Jarca Črnomelj | SI_ZAL_ČRN/0041 [1209365] | 1861–2008 | /009 Šolske kronike (1919–2001); /002 Matični listi učencev roj. 1924–27, 1934–36 (1931–43) [3946584×, vsebina omenja Griblje]; /004 častne bukve (1861–1881); /007 zapisniki (1889–2003) | matična šola gribeljske podružnice 1963–89; matični listi vsebujejo gribeljske učence |
| Osnovna šola Loka Črnomelj | SI_ZAL_ČRN/0087 [3164575] | 1889–2015 | /010 Šolske kronike (1889–2012) [4791865] | matična šola podružnice od 1989 |

### C.4 Administrativni organi šolstva (pot do ustanovitve)

- **Okrajno glavarstvo Črnomelj** SI_ZAL_ČRN/0001 (1861–1943): le 3 serije (šolski listi /001 — 35 enot, vsi »šolski listi s prilogami« akcije ~1929, ena na šolo: Adlešiči, Bojanci, Božakovo, Čeplje, Črnomelj, … **Griblje 00012** … Podzemelj 00018 …; gozdarske zadeve /002; šolske zadeve /003 1937–41).
- **ZAL NM-A530 Okrajna glavarstva, okrajni uradi, srezi 1849–1945** [1210621]: le 4 fondi (Črnomelj, Novo mesto, Žužemberk, Trebnje). **Okrajni svet Črnomelj fond ne obstaja** v javnem katalogu ZAL NM.
- **ZRSŠ Območna enota Novo mesto** SI_ZAL_NME/0234 (1961–1997): pregledi/nadzori po šolah — podružnica Griblje 096 (susedi: Adlešiči 095, Tribuče 097).
- Iskanje »šolski svet Črnomelj« (Naslov PE): 4 zadetki — vsi v /004 Sinji Vrh (C.2). »Šolski kurat«: v javnem popisu ni lastnega fonda.

---

## D. Parish/household route — ŽUPNIJSKA POT

### D.1 Strukturno spoznanje: Griblje NIMA župnije — podružnica je Podzemelja

- Cerkev sv. Vida, Griblje = **podružnična cerkev Župnije Podzemelj** (dekanija Črnomelj, Škofija Novo mesto); predhodnica prvič omenjena **1526** (hkrati prva omemba vasi); baročna podoba 18. st.; RKD št. 2122. (Wikipedija; matricula; 500-letnica obeležena junija 2026 — radio-odeon.com, moja-dolenjska.si; muzej petstoletnico že pozna.)
- **Matricula Online, fond Nadškofijski arhiv Ljubljana [268 bandomov], župnija Podzemelj**: Zavetnik sv. Martin; **Podružnice: 1. sv. Anton Puščavnik Krasinec, 2. sv. Helena Zemelj, 3. sv. Vid GRIBLJE, 4. Žalostna Mati Božja Klošter, 5. Devica Marija rožnega venca Dobravice**; Historično matično območje izrecno vključuje **Griblje** (skupaj z Boginja vas, Boršt, Cerkvišče, Dobravice, Dragoši, Geršiči, Gradac, Grm, Kapljišče, Klošter, Krasinec, Krivoglavice, Mlake, Otok, Pavičiči pri Zastavi, Podzemelj, Prilozje, Primostek, Škrilje, Vranoviči, Zemelj).

### D.2 Matrike župnije Podzemelj (Matricula — digitalizirane, javno dostopne)

| Vrsta | Volumen (Matricula id) | Leta |
|---|---|---|
| Krstne | 01723–01729, 01730, 01731, **04104** (1871–85), **04105** (1886–1919) | 1669–1919 |
| Mrliške | 01732 (1725–68), 01733 (1728–1803, Nemški viteški red), 01734 (1771–1828), 01735 (1829–56), **04106** (1857–85), **04894** (1886–1924) | 1725–1924 |
| Poročne | 04795 (1669–79), 01736 (1723–1770), 01737 (1771–1827), 01738 (1828–73), **04455** (1873–1922) | 1669–1922 |

Dostop: brezplačno online; pravilo NŠAL — **na spletu niso dostopne knjige z podatki mlajšimi od 100 let** (zadnja leta volumenov 04105/04455/04894 delno prizadeta). Za gostilno-1898 relevantne okna: **krstne 1886–1919, mrliške 1886–1924, poročne 1873–1922** — in zgodovinska globina do 1669.

### D.3 Status animarum / družinske knjige — KLJUČNI NAJD (popis NŠAL, januar 2026)

Uradni »Popis digitaliziranih družinskih knjig (status animarum), dostopnih uporabnikom v čitalnici NŠAL« (Tone Krampač, Ljubljana, januar 2026; PDF prenešen: `nsal-sa-popis.pdf`) — **ŽUPNIJA PODZEMELJ** (zavetnik sv. Martin):

| Št. | Obdobje | Vasi (izvleček iz popisa) | Griblje? |
|---|---|---|---|
| 1 | **1800–1850** | **Griblje**, Dragoši, Krasinec, Cerkvišče, Dobravice, Primostek, Otok, Grm, Podzemelj, Zemelj, Škrilje, Kapljišče, Mlake, Boginja vas, Boršt, Prilozje, Gradac, Klošter, Vranoviči, Pavičiči pri Zastavi | **DA** |
| 2 | **1850–1890 I.** | **Griblje**, Dragoši, Gradac, Klošter, Vranoviči, Okljuka, Zastava | **DA** |
| 3 | 1850–1890 II. | Krasinec, Cerkvišče, Škrilje, Kapljišče, Mlake, Boginja vas, Boršt, Prilozje, Podzemelj, Zemelj, Otok, Grm, Primostek, Geršiči, Dobravice, Krivoglavice | ne |

→ **Podzemeljski SA 1850–1890 (knjiga I) je arhivska enota, ki gospodinjstva Griblje pokriva prav v oknu pred 1898** — digitalizirana, dostopna **samo v čitalnici NŠAL** (ne online). = **P1★ za gostilno/hišo.**
Kontekst: SA Adlešiči (4 knjige, 1754–1871, vasi Purga/Adlešiči/…) — NEIGHBOURING P4.

### D.4 Ostala župnijska gradiva (mapa, brez kataloških enot)

- Župnijska kronika Podzemelj: v javnem katalogu NI (NŠAL/župnija — TO_COLLECT, P2).
- Kanonične vizitacije (Podzemelj): hranjenje v NŠAL — v javnem popisu NI razvidno (TO_COLLECT, P2).
- Hišne številke / številčne registre: posebnih enot v VAČ za Podzemelj/Griblje ni; hišne številke nosijo urbarski/odvezni/volilni spisi (razdelki E, F).
- Pisovska korespondenca duhovnikov: ni javno katalogizirana (P3).

---

## E. Tavern/house route — POT DO GOSTILNE / HIŠE (pred/okoli 1898)

### E.1 Gospostvo Krupa, Pobrežje in Pusti Gradac — SI AS 749 (1587–1901) ★ glavni arhivski odkriti vala

Gradivo gosposke uprave, pod katero je spadalo gribeljsko območje. Tektonika [24687]:

| Serija | Naziv | Leta | Enote z Gribljem |
|---|---|---|---|
| SI AS 749/1 | Knjige gospostev Pobrežje in Krupa ter graščine Pusti Gradac | 1656–1899 | /1/2 Urbar gospostva Pobrežje 1711–15, /1/3 Urbar 1718–22 (P2) |
| SI AS 749/2 | Normalije (patenti, zakoni, uredbe) | 1714–1849 | kontekst |
| **SI AS 749/3** | **Dominicalia** (upravljanje pridvorne posesti in gospodarskih obratov) | 1587–1901 | **/3/8 Zemljiška odveza (1851–1853)** — 17 enot |
| SI AS 749/4 | Rusticalia (upravljanje podložniške posesti) | 1656–1848 | /4/3 Registri izterjav urbarialnih dajatev pri gospostvu Krupa (1804–1847) [5024638] — P2 |

**Enote zemljiške odveze z Gribljem (P1 za hišo/lastništvo ~1851–53):**
- **SI AS 749/3/8/12** [4971617] — *Izpisek zemljiških parcel iz katastrskih davčnih vpisnikov za davčne občine Vinji Vrh, Kot, **Griblje**, Kaltersberg, Loka, Petrova vas in Krasinec v gospostvih Krupa in Pobrežje za namene zemljiške odveze* (19. st.) — javno dostopno, ni digitalizirano. → parcele + lastniki gribeljskih hiš ~1851 (isti arhivski tvorec kot franciscejski PZ/PT iz vala 42 — nadaljevanje v času!)
- SI AS 749/3/8/13 in /14 [4971618, 4971723] — *Dokazilo o vseh lastnikih zemljišč in njihovih vzdrževanih osebah, ki so zavezani plačevati denarne in naturalne dajatve* (1851) — seznam lastnikov (Krupa/Pobrežje).
- P2: /3/8/1 korespondenca (1853); /3/8/2–4 glavni izkazi razdeljene odškodnine (1853); /3/8/15 zakupniki dominikalnih gozdov Pobrežje (1853).

### E.2 Volilni spisi — SI AS 16 Deželno predsedstvo za Kranjsko (1791–1918) ★

Enote »Volilni spisi, kmečka kurija« (serija I), katerih vsebina (Vsebina PE) izrecno omenja Griblje — **imena gribeljskih domačinov/posestnikov** po volitvah kranjskega deželnega zbora:

| Enota | Leta |
|---|---|
| SI AS 16/I/37 | 1861 |
| SI AS 16/I/38, /39 | 1867 |
| SI AS 16/I/40 | 1870 |
| SI AS 16/I/41 | 1871 |
| SI AS 16/I/42 | 1877 |
| SI AS 16/I/43 | 1883 |
| **SI AS 16/I/44** | **1889** |
| SI AS 16/I/45 | 1895 |
| SI AS 16/I/46 | 1901–1908 |

Vse javno dostopne, ni digitalizacije. = imenska sidra hiš/lastnikov med 1861 in 1908 (vključno z letom ustanovitve šole in letom literarne gostilne 1898±).

### E.3 Koncesijsko/obrtne poti — NEGATIVNO na nivoju javnega kataloga

- Vzorec zapisa obstaja drugje (SI AS 134 Občina Logatec, SI AS 137 Občina Radovljica: *»gostilniška koncesija«*, *»načrt in dovoljenje za gostilno«*, *»Seznami gostiln v srezu«* — ~50 zadetkov iskanja »gostiln«; kategorija dokazano arhivsko živa).
- Za okraj Črnomelj pa: **fond Okrajno glavarstvo Črnomelj ima le 3 serije** (brez koncesij/obrtne table); **Občina Griblje fond ne obstaja** v javnem katalogu (»občina Griblje« = 1 zadetek, 1952 katastrski načrt); A570 Občine do 1947 v ZAL NM vsebuje le Metlika-mesto/-okolica za Belo krajino; G000 Gospodarstvo: cehi le Metlika (usnjarsko-čevljarski 1851–1909) + Novo mesto; gostinstvo/koncesije Belokrajncev = 0.
- Zato: **koncesijska pot za Griblje je v javnem katalogu ZAPRTA** (razlog: fondi občin/okrajnih organov Črnomelj niso ohranjeni/izročeni v javno dostopnem arhivskem prostoru — enako kot izpadi reambulancе pri SI AS 181, val 45; razlog UNRESOLVED/TO_COLLECT).
- **NE pomeni**: gostilna ni obstajala. Pomeni: katalogizirana koncesijska enota za Griblje ne obstaja.

### E.4 Osebno-upravni stranski zadetki (obvezno dokumentirani, občutljivo)

- **SI_PAM/0682/002/07407** [2202025] — *STRAUSS MARTIN, hišna številka kaznjenca: 150 — kaznilnica Ljubljana, občina: Griblje, okrajno glavarstvo / sresko načelstvo: Črnomelj: dosje iz Mariborske kaznilnice* (cca. 1884–cca. 1945) — javno dostopno v VAČ. Klasifikacija: **CONTEXTUAL P4** (osebni dosje; nosi hišno številko in občino — NE dokaz gostilne; PII-historično, raziskovalno, brez vgradnje). Sistem: isto serijo PAM/0682/002 tvorijo dosjeji tudi za občino Podzemelj (PALČIČ ANTON hiš. št. 381 [05257], JURAJEVČIČ IVAN hiš. št. 415 [02695]) — serija = potencialen indeks hišnih številk gribeljskih domačinov v dobi 1884–1945 (P4).
- SI AS 74 Kraljevska banska uprava Dravske banovine, Oddelek za socialno politiko in narodno zdravje (1929–1941) — *Statistika izseljencev, Črnomelj* 1937/1939/1940 (6 enot: 74/I/7/2/237, 434, 451, 493; 74/I/7/4/1, 11) — Griblje v vsebini; P3 (demografija, ne gostilna).
- SI_ZAL_MET/0002/036 Občina Metlika-mesto: spisi za leto 1904 (Griblje v vsebini) — P3.
- SI_ZAL_NME/0003/008/00006 Okrajno glavarstvo Novo mesto: gozdne posesti in prekrški (1797–1944) — Griblje v vsebini; P4.
- SI_ZAL_MET/0017 Hranilnica in posojilnica Podzemelj (1908–1948) — P3 kontekst (vaško financiranje).
- SI AS 1100/II/231 — Poročilo o najdbi rimskega nagrobnika v kraju Podzemelj (1813–1915) — P4 (kontekst rimskih najdb; sam toponim Rim v k.o. Griblje ostaja TO_COLLECT po valu 45).

---

## F. Exact archival hierarchy — dokazni spust (nivoji ne sesedajo)

```
VAC (vzajemna zbirka)                       [1000001]
├─ ARS — Arhiv Republike Slovenije          [1]
│  ├─ SI AS 16   Deželno predsedstvo za Kranjsko (1791–1918)          FOND
│  │  └─ I Volilni spisi  ─ /37…/46 kmečka kurija (1861–1908)         SERIJA/ENOTE — Griblje v vsebini
│  └─ SI AS 749  Gospostva Krupa, Pobrežje in Pusti Gradac (1587–1901) FOND [24687]
│     ├─ /1 Knjige gospostev (1656–1899) → urbarji Pobrežje 1711+      SERIJA
│     ├─ /3 Dominicalia (1587–1901)                                     SERIJA [893643]
│     │  └─ /3/8 Zemljiška odveza (1851–1853)                          PODSERIJA [4602842]
│     │     └─ /3/8/12 Izpisek parcel … davčna občina GRIBLJE          ENOTA [4971617]
│     └─ /4 Rusticalia (1656–1848) → /4/3 registri dajatev 1804–47      SERIJA [5024638]
├─ ZAL — Zgodovinski arhiv Ljubljana        [1066884]
│  └─ Enota za Dolenjsko in Belo krajino Novo mesto [1073287]   (= bivši SI PANU)
│     ├─ A000 UPRAVA [1073333] → A530 Okrajna glavarstva [1210621]
│     │  └─ SI_ZAL_ČRN/0001 Okrajno glavarstvo Črnomelj (1861–1943)    FOND [1209325]
│     │     ├─ /001 šolski listi (1861–1943) — 35 enot                 SERIJA [4097346]
│     │     │  └─ /001/00012 Šolski list s prilogami: Državna osnovna
│     │     │     šola Griblje (1929–1941)                             ENOTA [4118864] — DIGITALIZIRANO
│     │     ├─ /002 gozdarske zadeve (1861–1941)                       SERIJA
│     │     └─ /003 šolske zadeve (1937–1941)                          SERIJA
│     ├─ A570 Občine do 1947 [1210629] → za Belo krajino le Metlika-mesto/-okolica
│     │  (Občina Griblje — FOND NE OBSTAJA v javnem katalogu)
│     ├─ D000 VZGOJA IN IZOBRAŽEVANJE [1073391] → D100 [1211552] → D120 [1211572]
│     │  ├─ SI_ZAL_MET/0030 OŠ Podzemelj (1872–2000)                   FOND [1209437]
│     │  │  ├─ /001 Šolske kronike (1873–1973): vol. 1873–1922         ENOTA [3864805] ★ pokriva 1889
│     │  │  ├─ /005 Katalogi učencev (1872–1943)                       SERIJA [3864837]
│     │  │  └─ … 14 serij (+ 6 samostojnih enot)
│     │  ├─ SI_ZAL_ČRN/0049 OŠ Sinji Vrh (1870–1964) → /004 Gradivo KŠS
│     │  │  (1870–1942; 80 enot) → 4 enote »Okrajni šolski svet Črnomelj«
│     │  │  (1888, 1892, 1898, 1900)                                   ENOTE [4477365, 4477372, 4477396, 4477401]
│     │  ├─ SI_ZAL_ČRN/0041 OŠ Mirana Jarca Črnomelj (1861–2008)       FOND [1209365] — 22 serij
│     │  ├─ SI_ZAL_ČRN/0087 OŠ Loka Črnomelj (1889–2015)               FOND [3164575] — 21+ serij
│     │  └─ SI_ZAL_NME/0234 ZRSŠ, Območna enota Novo mesto (1961–1997) FOND
│     │     └─ /003 Pregledi in nadzori (1965–1995) → /096 podružnica Griblje (1970–1982)  ENOTA [747512]
│     └─ G000 GOSPODARSTVO [1073397] → G110 cehi / G580 drugo — za Belo krajino nič gostinskega
├─ PAM — Pokrajinski arhiv Maribor [SI_PAM]
│  └─ SI_PAM/0682/002 Mariborska kaznilnica — dosjeji (cca. 1884–1945)
│     └─ /07407 STRAUSS MARTIN, občina Griblje, hiš. št. 150           ENOTA [2202025] — P4
└─ NŠAL — Nadškofijski arhiv Ljubljana (Matricula Online, 268 bandomov)
   └─ Župnija Podzemelj (sv. Martin; podružnica: sv. Vid GRIBLJE)
      ├─ Matrike: krstne 1669–1919 (11 vol.), mrliške 1725–1924 (6), poročne 1669–1922 (5)
      │  (volumeni 04104/04105/04106/04894/04455 = okno 1871–1924)      DIGITALNO, ONLINE (100-let. pravilo)
      └─ Status animarum (popis NŠAL 2026): 1800–1850 (vsebuje Griblje);
         1850–1890 I. (vsebuje Griblje); 1850–1890 II. (brez)           DIGITALNO, ČITALNICA NŠAL ★ P1
```

Razlaga nivojev: vsaka vrstica s signaturo `…/000` = ENOTA; digitalizirana enota = ena arhivska enota z (trenutno) drugačnim dostopnim kanalom — NE več virov (isti standard kot val 45: SI AS 176 → N83 → N083PT → 8 strani = ena enota).

---

## G. Direct Griblje hits — MASTER TABLE

Iskanja: Naslov PE (Griblje, Grüble, občina/šola/kronika-Griblje, Podzemelj, Črnomelj, gostiln, šolski svet Črnomelj, Izpisek zemljiških parcel …) + Vsebina PE (Griblje) + tektonični spusti ZAL NM (A000/D120/G000) + SI AS 749 + Matricula/NŠAL popis. Število preiskanih vozlišč tektonike ZAL NM: A000(5)+A500(4)+A530(4)+A570(11)+D000(3)+D100(3)+D120(~59)+G000(6)+G100(2)+G500(6)+G110(2)+G580(1) fondskih/skupinskih vozlišč; SI AS 749: 4 serije + 17+ enot odveznega bloka; šolska serija 0049/004: 80 enot; šolski listi 0001/001: 35 enot.

| FOND | ENOTA | SIGNATURA / ID | NAZIV | LETA | GRIBLJE | DIGITAL | DOSTOP | PRIORITETA |
|---|---|---|---|---|---|---|---|---|
| Okrajno glavarstvo Črnomelj (ZAL ČRN/0001) | /001/00012 | [4118864] | Šolski list s prilogami: Državna osnovna šola Griblje | 1929–1941 | **DIRECT — šola** | **DA** | javno | **P1 ★** |
| OŠ Podzemelj (ZAL MET/0030) | /001_00001 | [3864805] | Šolska kronika OŠ Podzemelj | 1873–1922 | **DIRECT-context** (pokriva ustanovitev 1889; Griblje = pred-1889 šolska filija) | NE | javno (čitalnica ZAL NM) | **P1 ★** |
| NŠAL Podzemelj | status animarum I. | popis NŠAL 2026 | Družinske knjige (SA) | 1850–1890 | **DIRECT — vasi vključno Griblje** | DA (čitalnica) | NŠAL čitalnica | **P1 ★** |
| Gospostva Krupa/Pobrežje (SI AS 749) | /3/8/12 | [4971617] | Izpisek parcel iz katastrskih davčnih vpisnikov — davčna občina Griblje | ~1851–53 | **DIRECT — hiše/parcela/lastnik** | NE | javno (čitalnica) | **P1 ★** |
| Gospostva (SI AS 749) | /3/8/13, /14 | [4971618, 4971723] | Dokazilo o vseh lastnikih zemljišč … | 1851 | DIRECT (Krupa/Pobrežje, med njimi Griblje) | NE | javno | **P1** |
| Deželno predsedstvo Kranjske (SI AS 16) | /I/37–/46 | 9 enot | Volilni spisi, kmečka kurija (Griblje v vsebini) | 1861–1908 | **DIRECT — imena domačinov** | NE | javno | **P1** (1889, 1895 okni) |
| NŠAL Podzemelj | matrike 04104/04105/04106/04894/04455 | Matricula | Krst/mrt/por | 1871–1924 | DIRECT (župnijsko območje vključno Griblje) | **DA online** | prosto (100-let. pravilo) | **P1** |
| ZRSŠ Območna enota NM (ZAL NME/0234) | /003/096 | [747512] | OŠ Črnomelj, podružnica Griblje | 1970–1982 | DIRECT — šola | NE | javno | P2 |
| OŠ Sinji Vrh (ZAL ČRN/0049) | /004/00007, /13, /37, /41 | 4 enote | Okrajni šolski svet Črnomelj: proračun/spisi/čiščenje/računi | 1888–1900 | DIRECT-kontekst (organ okraja) | NE | javno | P1/P2 (1892 spisi P1) |
| OŠ Mirana Jarca Črnomelj (ZAL ČRN/0041) | /002/00003 | — | Matični listi učencev roj. 1924–27, 1934–36 | 1931–1943 | DIRECT (gribeljski učenci v vsebini) | NE | javno | P2 |
| Mariborska kaznilnica (SI_PAM/0682) | /002/07407 | [2202025] | Dosje STRAUSS MARTIN, obč. Griblje, hiš. št. 150 | cca. 1884–1945 | CONTEXTUAL (osebni dosje) | NE | javno | P4 |
| SI AS 74 (Dravska banovina) | /I/7/2–4 | 6 enot | Statistika izseljencev Črnomelj | 1937–1940 | CONTEXTUAL | NE | javno | P3 |
| Občina Metlika-mesto (ZAL MET/0002) | /036 | — | Spisi za leto 1904 | 1904 | CONTEXTUAL | NE | javno | P3 |
| Hranilnica Podzemelj (ZAL MET/0017) | fond | — | Hranilnica in posojilnica Podzemelj | 1908–1948 | CONTEXTUAL | NE | javno | P3 |

Zadetki po klasifikaciji: **DIRECT = 8 vrst** (izpisanih kot vrstice P1/P2); **CONTEXTUAL = 4**; **NEIGHBOURING = SA Adlešiči, matrike susednih župnij (Metlika, Črnomelj, Adlešiči — vse v Matrici)**; **FALSE POSITIVE = 1** (grüble-vsebinski zadetek SI AS 307/II/4/2/75 — zaplemba časopisa, članek iz Idrije, 1876) + sistemski FP »podzemeljski« (jame/kleti) pri iskanju Podzemelj — izrecno ločeno.

---

## H. Contextual hits

| Zadetek | Klasifikacija | Vrednost |
|---|---|---|
| Matrike susednih župnij v Matrici (Adlešiči, Metlika, Črnomelj, Preloka, Dragatuš …) | NEIGHBOURING | P4 — primerjalni kontekst |
| SA Adlešiči (4 knjige, 1754–1871) — NŠAL | NEIGHBOURING | P4 |
| SI AS 1100/II/231 rimska najdba Podzemelj | NEIGHBOURING | P4 (Rim-toponim ostaja TO_COLLECT, val 45) |
| PAM/0682/002 dosjeji za občino Podzemelj (2) | NEIGHBOURING | P4 — serija kot potencialen hišno-številčni indeks |
| SI_ZAL_NME/0003/008/00006 gozdne posesti (Griblje v vsebini) | CONTEXTUAL | P4 |
| SI AS 1589 (OK KPS Črnomelj 1949–53), SI AS 1235 (ceste 1975), ZAL NME/0115 (zadruge 1954), ZAL MET/0047 (1956–57) | CONTEXTUAL (popisne omenbe Griblja) | P4 — po obdobju |
| K99 Grablje, SI AS 178 (val 45) | FALSE POSITIVE (zapuščina) | — |

---

## I. Digital availability

| Enota/vir | Digitalizirano | Kanal | Javno dostopno (online)? |
|---|---|---|---|
| Šolski list s prilogami: Državna osnovna šola Griblje (1929–41) [4118864] | **DA** (»Kopije …: digitalizirano«) | VAČ (dostop do kopije — preizkus pregledovalnika = NASLEDNJI KORAK branja) | pričakovano DA; popis: javno dostopno, nedostopnost prenehala |
| Matrike Podzemelj (11+6+5 volumnov) | **DA** | Matricula Online (data.matricula-online.eu → Fonds → Slovenia → Nadškofijski arhiv Ljubljana → Podzemelj) | **DA** — podatki mlajši od 100 let niso online |
| Status animarum Podzemelj (3 knjige) | **DA** | NŠAL — samo računalniki v čitalnici (izrecno v popisu) | NE (čitalnica NŠAL, Ljubljana) |
| Ostale ZAL NM / SI AS enote iz master table | NE (»Vsebuje datoteke: NE«) | čitalnici ZAL NM (Grad Grm; pon/sre 8–14, tor/pet 8–12) in ARS | NE (fizični ogled/naročilo) |
| Šolska kronika Griblje (Slovenski šolski muzej) | ni javno katalogizirano | šolski muzej (ZRSŠ), Ljubljana | TO_COLLECT (kontakt/obisk) |

---

## J. Access limitations

1. **NŠAL čitalnica** — SA dostopna le tam (digitalizirana zbirka se »sproti dopolnjuje«, ni online); uporabo ureja Pravilnik o uporabi gradiva škofijskih arhivov (2017); matični vpisi od 1835 dalje — vpogled le za študijske namene po predhodni prošnji (za posamezne podatke ob navzočnosti osebja).
2. **100-letno pravilo** — online matrike z podatki < 100 let niso dostopne (zadnji letniki volumenov 04105, 04455, 04894).
3. **Peskovniške tehnične meje** (znane iz valov 44/45, nespremenjene): data.matricula-online.eu = 302-obhod prek page_reader (uspešno); VAČ fieldSearch zahteva brskalniško sejo (curl-seja ne ohrani searchId — rezultati so vezani na HTTP-sejo; rešeno prek agent-browser).
4. **VAČ „Vsebuje datoteke: NE"** pri večini enot — digitalna kopija (kjer je) ni eksponirana kot datoteka v iskalniku; šolski list [4118864] nosi znak digitaliziranosti v polju Kopije — način dostopa do rastrov TO_COLLECT (mogoče le po prijavi/v čitalnici).
5. Brez obhodov avtorizacij/WAF/CAPTCHA — vse po javnih poteh.

---

## K. P1 research candidates — konkretno branje (naslednji sklop)

1. **SI_ZAL_ČRN/0001/001/00012 — Šolski list s prilogami: Državna osnovna šola Griblje (1929–1941)** [4118864] — digitaliziran, javno dostopen; priloga »opis kraja« je tipično nosilec podatkov o šoli (šolska stavba, učitelji, oddelki) in pogosto tudi o gostilni/kraških hišah. = **ENOTA ZA NASLEDNJI CONTENT-EXTRACTION SKLOP.**
2. **NŠAL — Status animarum Podzemelj 1850–1890 I.** (vas Griblje izrecno) — hiše, gospodinjstva, hišni gospodarji tik pred 1898; čitalnica NŠAL (izven-peskovniška vrsta).
3. **SI_ZAL_MET/0030/001_00001 — Šolska kronika OŠ Podzemelj 1873–1922** — ustanovitev gribeljske šole 1889 iz perspektive matične šole; čitalnica ZAL NM.
4. **SI AS 749/3/8/12 (+ /13, /14)** — parcele/lastniki davčne občine Griblje 1851–53; neposredno nadaljevanje franciscejskega operata N83 (vali 42–43) za lastništvo hiš.
5. **SI AS 16/I/44 (1889) in /45 (1895)** — volilni spisi kmečke kurije: imenska lista gribeljskih posestnikov okrog 1889/1898.
6. **Matricula Podzemelj 04104/04105, 04106/04894, 04455** (1871–1924) — online takoj: krs/mrt/por vpisi gribeljskih družin (gostilničar-hipoteza testirati prek poklicnih pripomb v matrikah — NE predvideti rezultat).

## L. P2/P3/P4 candidates

- **P2**: Okrajni šolski svet Črnomelj — spisi 1892 [4477372]; proračun 1888 [4477365]; ZRSŠ podružnica Griblje 1970–82 [747512] (kontinuiteta šole); SI AS 749/1/2–3 urbarji Pobrežje 1711–22; SI AS 749/4/3 registri dajatev 1804–47; OŠ Mirana Jarca /009 kronike (1919–2001) in /002 matični listi (gribeljski učenci 1931–43); OŠ Loka /010 kronike (1889–2012); župnijska kronika/vizitacije Podzemelj (TO_COLLECT v NŠAL/župniji).
- **P3**: SI AS 74 izseljenci 1937–40; ZAL MET/0017 hranilnica Podzemelj 1908–48; ZAL MET/0002/036 spisi Metlika-mesto 1904; ZAL ČRN/0001/003 šolske zadeve 1937–41.
- **P4**: PAM/0682/002 dosjeji (Griblje/Podzemelj — hišne številke); SI AS 1100/II/231 rimska najdba Podzemelj; gozdne enote; popisne omenje Griblja po 1945 (SI AS 1589, ZAL NME/0115, MET/0047, SI AS 1235); SA Adlešiči.

---

## M. Already researched / duplicate protection

- **SI AS 176 / N83 Griblje** — 12 enot — ALREADY RESEARCHED (vali 41–43, docs 55–57); v tem valu samo kot sistemsko sidro (179 zadetek »Griblje, k.o.« [227663] = ista enota; ne odpiramo).
- **SI AS 177–182** — enumerirani v valu 45 (doc 59) — ne ponavljamo; »Operacija Griblje« SI AS 1086/9304 (1996) in »Katastrska občina Griblje, katastrski načrt (katastrski okraj Črnomelj)« SI AS 1138/I/1204 (1952) [prek iskanja Griblje najdeni] = **moderna katastrska izpeljanka** — dokumentirana kot zadetka, NI vsebinsko obravnavana (izven obdobja; P4 arhivsko-tehnični kontekst).
- Leksikon 1937 (doc 58) — ne ponavljamo; Domoljub 1898 (MVG-109) — ne ponavljamo; šolska kronika/Slovenski šolski muzej = obstoječ muzejski podatek MVG-026, v tem valu samo kot kanal dokumentiran.
- Duplikatna zaščita: vsi važnejši zadetki tega vala imajo surovine v `raw-web-val46-2026-10/` (ajax-*.json 21 datotek, vac-* HTML, pr-*.json 8, nsal-sa-popis.pdf, s01–s13.json, nsal-sa.html, zal-iskanje.html, vac-home.html, vac-fieldsearch.html, vac-js.txt, browser-vac-gostiln-hits.png).

## N. Negative results (kje smo iskali in kaj NI najdeno)

1. **Fond »Osnovna šola Griblje«** — ne obstaja v javni tektoniki ZAL NM (D120 popolnoma enumeriran) in ni tudi v nobenem zadetku poljskega iskanja. NI dokaz, da šolskega gradiva ni — pomeni: gradivo je razlito po matičnih šolah/okrajnih organih/ZRSŠ ali nepopisano.
2. **»šolska kronika Griblje« (Naslov PE, vsi arhivi) = 0** — gribeljska šolska kronika (muzej jo postavlja v Slovenski šolski muzej) ni javno katalogizirana v VAČ.
3. **Fond »Občina Griblje«** — ne obstaja (»občina Griblje« v Naslovu PE = 1 zadetek: katastrski načrt 1952). A570 (Občine do 1947) ZAL NM: za Belo krajino le Metlika-mesto/-okolica. Podobno **ni fonda »Okrajni svet Črnomelj«** (A530 = le 4 fondi, med njimi okrajno glavarstvo).
4. **Koncesijske/obrtne enote za okraj Črnomelj** = 0 (vzorci obstajajo za Logatec/Radovljico itd.; za Belo krajino v javnem katalogu nič) → koncesijska arhivska pot do gostilne-pre-1898 za Griblje = **zaprtá na nivoju javnega kataloga** (razlog ni znan: ni ohranjeno/ni izročeno/ni popisano — UNRESOLVED/TO_COLLECT).
5. **»Grüble« v Naslovu PE = 0** (vsi arhivi); v Vsebini PE = 1 zadetek, in sicer FALSE POSITIVE (SI AS 307/II/4/2/75, časopisna zaplemba, članek »Iz Idrije« 1876).
6. **Okrajni šolski svet Črnomelj** nima lastnega fonda — 4 enote so vgradili/dopolnili v fond OŠ Sinji Vrh (/004).
7. Župnija »sv. Vida Griblje« kot samostojna **ne obstaja** (podružnica Podzemelja) — naročilni izraz naročila je bil korektan kot cilj, ne kot arhivska tvorka; celotna župnijska pot je preusmerjena prek Podzemelja.
8. Cehi/gostinstvo ZAL NM G110/G580 — za Belo krajino nič (usnjarsko-čevljarski ceh Metlika in Narodni dom NM edini najdeni).
9. NŠAL SA za Griblje online NI dostopna (samo čitalnica) — digitalizacija ≠ online dostop.

## O. Next research queue — konkretni naslednji koraki

1. **P1 — NASLEDNJI SKLOP (content extraction, ločen task):** odpreti in prebrati **SI_ZAL_ČRN/0001/001/00012** (šolski list + priloga »opis kraja«, 1929+) — preizkusiti VAČ-pregledovalnik digitalne kopije ([4118864] »Kopije: digitalizirano«); vsebina → le PREVERJENO v muzej (šele z verigo SOURCE → CLAIM → STRAN → RELEVANCE).
2. **P1 — izven-peskovniška vrsta:** NŠAL čitalnica (Krekov trg 1, Ljubljana): SA Podzemelj 1850–1890 I. (Griblje) — hišni seznam; po pravilniku 2017 prošnja za vpogled.
3. **P1 — čitalnica ZAL NM (Grad Grm, Novo mesto):** kronika OŠ Podzemelj 1873–1922 [3864805] + SI AS 749/3/8/12 [4971617] (naročilo po pošti/dopisni listi).
4. **P1 — takojšnja online branja:** Matricula Podzemelj 04104/04105/04106/04894/04455 — indeksiranje gribeljskih vpisov 1871–1924 (brez prenosa osebnih podatkov v muzej — samo dokumentiranje obstoja/vrste podatkov, dokler ni veriga RELEVANCE).
5. **P2 — SI AS 16/I/44 + /45** (1889/1895 volilni spisi) — čitalnica ARS; imenski spusti za hiše/gospodarje.
6. **P2 — vprašanje ZAL NM referentu:** ali fond OŠ Griblje obstaja kot nepopisano gradivo (»neurejeno«) ali je razlito; analogno za Občino Griblje in Okrajni svet Črnomelj (ist vzorec izpada kot reambulanca N83, val 45 — razlog UNRESOLVED).
7. **P3 — Slovenski šolski muzej:** potrditev hrambe gribeljske šolske kronike (muzejski podatek MVG-026) — javno neobjavljena zbirka, TO_COLLECT.

Terminologija (§16 zaščita): vse enote v tem dokumentu so **kataloški zadetki/popisne enote = research metadata**, ne še muzejski dokazi. Primarni zgodovinski vir postane šele odprta enota z verigo SOURCE → CLAIM → ENOTA/STRAN → RELEVANCE. Leksikon 1937 in Domoljub 1898 ostajata sekundarni publikaciji/publication claims (historical_primary_evidence NO).

---

## Regresija (raziskovalni val — NO CONTENT CHANGE)

- Pričakovano: git diff = samo raziskovalni dokumenti + surovine + indeksi/worklog; **113 zapisov / 588 virov / 469 identitet / 67 deljenih / 95 entitet nespremenjeno; i18n 946 × 5; OpenData 113/588; sitemap 114; 13 API poti; DB brez drifta**.
- Dokazi: `research-griblje/raw-web-val46-2026-10/` (21 × ajax-*.json tektonike; vac-fsfind-*.html/vac-aj-*.json iz iskanj; details-*/brskalniški zapisi; pr-*.json page_reader (zal, wiki, matricula ×4, nsal); nsal-sa.html + nsal-sa-popis.pdf (1,25 MB, Krampač 2026); s01–s13 SDK-web-search; zal-iskanje.html; vac-home/fieldsearch/vac-js; browser-vac-gostiln-hits.png).

## Zaklep vala

**TASK 98 = ŠOLSKI IN ŽUPNIJSKI ARHIVSKI ZEMLJEVID ZAKLJUČEN (javni katalogi izčrpani za ciljna vprašanja).** Trije ključni rezultati: (1) **najdena je direktata digitalizirana enota za gribeljsko šolo** — šolski list z opisom kraja 1929–41 [4118864] — plus kronika matične šole, ki pokriva ustanovitev 1889 [3864805]; (2) **župnijska/hišna pot je preusmerjena prek Podzemlja** (Griblje = podružnica in del matičnega območja; matrike online v Matrici; SA 1850–1890 I. z Gribljem v čitalnici NŠAL) — to je najsilnejši odgovor na »gostilno/hišo pred 1898«; (3) **koncesijska/občinska pot za Griblje je v javnem katalogu zaprta** (fondi ne obstajajo) — negativno ugotovitve so izrecno ločene od »ne obstaja«. Vgradnja: +0 vsega (inventura po naročilu).
