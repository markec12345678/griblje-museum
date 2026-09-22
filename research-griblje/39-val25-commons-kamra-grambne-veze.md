# 39 — 25. VAL: WIKIMEDIA KATEGORIJA GRIBLJE (11 VIROV!), KAMRA PRIČEVANJA IZ GRIBELJ, PLOŠČA NIKU ŽUPANIČU 1973, LISTINA 1468 NA MALENCI + KATASTRSKA VRZEL SI AS 176

*74. sklop · 2026-09-22 · naročilo: „odlicno nadaljuj raziskuj griblje“*

## Naročilo in cilj

Uporabnik: **»odlicno nadaljuj raziskuj griblje«** — nadaljevanje 25. vala raziskave po izven-peskovniški vrsti. Izhodišče: val 24 (dok. 38) je zaključen in sinhroniziran (HEAD 5033293 = origin/main; Vercel 111/550 = lokalno). Val 25 je iskal **nove kanale**, ki jih prejšnji vali niso pretresli do konca.

## Baza za dedup

`raw-web-val25-2026-10/dedup-baseline.txt` — 111 zapisov (MVG-001–111), 550 virov, 436 identitet, 62 deljenih, 95 entitet (oseb 36); sitemap 112; i18n 946 × 5. Generirana živo iz `/api/opendata`.

## Novi kanali v 25. valu

1. **Wikidata struktura Q2531566** (direktni API, Special:EntityData) — 15 trditev; ključna: **P373 = kategorija Commons „Griblje“ obstaja** (val 21 je po iskanju zabeležil „Commons 0 zadetkov“ — iskanje ni našlo, kategorija pa je bila ves čas zgoraj). Ostalo: P1082 prebivalstvo 334, P131 Črnomelj (Q3482211), P2044 153,4 m, P2046 3,4 km², P625 45.575447/15.28…, GeoNames 3199569, Who's on First 1192982071.
2. **Commons kategorija API** (`list=categorymembers` + `imageinfo` + `extmetadata`) — popoln izpis vseh datotek z avtorjem, datumom, licenco, opisom (lokalno shranjeno: `commons-cat-griblje.json`, `commons-info.json`, `commons-info2.json`).
3. **Kamra portal** (kamra.si — WordPress; GET `?s=Griblje` in `?s=Gribelj`) — direktno dosegljiv (curl 200, ~150 kB/stran); mnogoelementne strani („mm-elementi“) s polnimi metapodatki (avtorji, licence, digitalizacija).
4. **Radio Odeon brez iskanja** — direktni curl na članke deluje (HTTP 200, ~79 kB), Cloudflare „Just a moment…“ ostaja samo na `/iskanje/` (in na `/site/assets/...pdf` za Belokranjec 415 openresty). JINA (r.jina.ai) na PDF vrne samo „One moment, please…“ (278 B).
5. **CKAN podatki.gov.si API** (`/api/3/action/package_search`) — deluje (405 kB odziv; JSON vsebuje vejice na koncu → popraviti z `re.sub(r',\s*([\]}])', r'\1', raw)`).

## PRELOM 1 — Wikimedia kategorija Griblje: 11 virov (najdeni v 25. valu)

Val 21 je zapisal „Commons 0 zadetkov“ — **napaka iskalne metode, ne praznine**: kategorija [Category:Griblje](https://commons.wikimedia.org/wiki/Category:Griblje) ima **10 datotek + 1 podkategorijo (cerkev sv. Vida)**. Celotni izpis z metapodatki:

| Datoteka | Datum | Avtor | Licenca | Muzejski status |
|---|---|---|---|---|
| Pogovor angleškega pilota s partizani, Griblje pri Črnomlju, marec 1945 | 1945-03 | **Franjo Veselko** | **Public domain** | ŽE VIR MVG-014 + MVG-055 |
| Ranjeni partizani opazujejo pristajanje zavezniških letal, Griblje pri Črnomlju, marec 1945 | 1945-03 | **Franjo Veselko** | **Public domain** | ŽE VIR MVG-014 + MVG-055 |
| Griblje, Črnomelj — cerkev sv. Vida | — | — | — | ŽE VIR MVG-002 |
| Griblje, Črnomelj (panorama) | 2012-05-12 | Eleassar | CC BY-SA 3.0 | ŽE VIR MVG-001 |
| Bela krajina Kolpa | 2005-01 | Andrejj | CC BY-SA 3.0 | ŽE VIR MVG-001 |
| **Kolpa griblje** | 2002-05-15 | Savinjc | CC BY-SA 3.0 | **NOV VIR MVG-001** |
| Slap in malenca na Kolpi pri Gribljah | 2008-08-15 | švabo | CC BY 3.0 | ŽE VIR MVG-007 (`commons-malenca`) |
| **Pond Griblje** (panorama 18104 × 6820) | 2018-12-02 | Alanorlic | CC BY-SA 4.0 | **NOV VIR MVG-016** |
| Pond at Griblje | 2018-07-27 | Uroš Novina | CC BY 2.0 | ŽE VIR MVG-016 |
| Slovenian border fence in Griblje | 2016-03-28 | Hythlodot | CC BY-SA 4.0 | ŽE VIR MVG-015 |
| Cabin under the Sun | 2019-01-26 | Uroš Novina | CC BY 2.0 | TO_COLLECT (kaj točno prikazuje?) |

**Dve omeni vrednosti**: (1) obe Veselkovi fotografiji leta 1945 so na Commons **javna last** — najstarejši prosto dostopni avtentični fotografiji o dogodkih v vasi (muzej ju že hrani kot vira MVG-014 in MVG-055); (2) 6 od 10 datotek je bilo že v bazi — kategorija jih je prvič zbrala v eno pravilo.

## PRELOM 2 — dedup strefa: malenca ni nov zapis, listina 1468 pa je nova vez

Načrt „nov zapis MVG-112 malenca“ je **preklican s striktnim dedupom**: 
- **MVG-007 „Malenca na Kolpi“** že obstaja (kolpa, CORROBORATED) in **`commons-malenca` (Slap in malenca na Kolpi pri Gribljah.jpg, švabo) je že njen vir**;
- sprehod „Voda je življenje“ ima postaji `mlini-na-kolpi` (MVG-009) in `madronicev-mlin` (MVG-045) — mlinarska zgodba je v muzeju večvalna.

Zato se vsebina prenese kjer je prazna: **MVG-007 dobi vez na listino 1468** — darovnica Bernarda Katterja in žene Neže (Arnold regest 3971; Weiss 2018, str. 186) omenja med darovanimi posestmi **„mlin na Kolpi“** (lego mlina listina ne določa — to muzej izrecno napiše); vstavljen je deljeni vir `weiss-2018-castite` (isti dokument, ki stoji že za MVG-001/110/111) + en stavek v zgodbi SL/EN. Malenca tako dobi svoj najstarejši datum: 1468.

## PRELOM 3 — Kamra: pričevanja iz Gribelj + plošča Niku Županiču

Iskanje `?s=Gribelj` (domačinska varianta, ki je tudi Gottscheerjeva) je vrnilo serijo pričevanj Ljudske knjižnice Metlika (prireditve „Bilo je …“ v Gostišču Veselič, Podzemelj):

1. **„Bili so polni hlevi“** (23. 11. 2015, 18.00; avtor **Matjaž Rus**; objavil LJ Metlika 27. 11. 2015; CC BY-NC): **Ciril Totter iz Gribelj** in Peter Pezdirec (Mikulaš) s Krasinca sta obujala spomine, ko so bili hlevi še polni živine; popestril ga je glasbenik Marjan Končar; obiskovalci so se brezplačno vpisali v LJ Metlika. → **NOV VIR MVG-072** (Ciril Totter — maratonc na Jandrečetovi zemlji; doslej 2 vira, zdaj 3 — pričevanje o kmetovanju domačije).
2. **„Bile so velike družine“** (9. 11. 2015; avtorica Lidija Nemanič Baškovič): **Lojze Štrucelj iz Gribelj** in Ivan Bajuk z Radovice. → TO_COLLECT: potrditev istovetnosti Lojze ↔ **Alojz Štrucelj** (MVG-051, Dolenjski list „80 let“); brez potrditve vir ne gre na zapis.
3. **„Bilo je …“** (17. 1. 2014; avtor Matjaž Rus): **Anica Totter, vodja gribeljskih kmečkih žen**. → dedup: Anica Totter že v zgodbi MVG-089 (predsednica ob ustanovitvi 1996); fotografija potrjuje vodstveno vlogo še 2014 — vir ni potreben.
4. **Spominska plošča univ. profesorju dr. Niku Županiču** (mm-element; objavil Knjižnica Črnomelj; izvirno 08.05.2018; digitalizirano 11.06.2016; avtorja **Andrej Črnič, Daniela Žunič**; CC BY-NC; fotografija 2013): ploščo je **1973 dalo postaviti Belokranjsko muzejsko društvo; stoji na hiši, kjer je nekoč stala Zupaničeva rojstna hiša** (lokacija: Griblje). Biografski del (roj. 1. 12. 1876 v Gribljah, šola v Podzemlju, Dunaj, doktorat 1903, kustos Beograd 1908/1914, ustanovitelj Slovenskega etnografskega inštituta 1921, minister 1922, Etnolog 1927, profesor LJU 1940, † 1961) je z MVG-010 usklajen. → vir `kamra-plosca` v MVG-010 **nadgrajen** (natančen mm-element URL + polne opombe; identiteta se spremeni z gole domene na konkretno stran — število identitet se ne spremeni) + **obogatitev zgodbe** z navedbo plošče 1973.

Dedup ostalih Kamra zadetkov: spomenik padlim (MVG-026/029 ✓), spomenik napadu na italijanske mejne policiste + zbirka „Spominska obeležja v občini Črnomelj“ (MVG-028 ✓), belokranjska noša (MVG-079 ✓), Vodovod Dobliče (ni gribeljski).

## PRELOM 4 — Odeon: 100 % dedup (kanal je izčrpan)

Članka „Gribeljski žbul v novi preobleki: od mafinov do sladoleda“ (21. 9. 2026, Aleksander Riznič) in „Ljudje ob Kolpi: Lojze Zupanc“ (21. 9. 2026, Boris Grabrijan, foto dLib/Kamra):
- **Žbul članek**: vir MVG-082 ŽE OBSTOJA (`radio-odeon.com/novice/gribeljski-zbul-v-novi-preobleki-...`); vsi ključni fakti že v zgodbi (sortna lista „avtohtona tradicionalna sorta“, alias belokranjka, slamnata barva, podolgovate čebulice, „redko uhaja v cvet“, mafini/grisine/sladoled, pleteni venci, sodelovanje z LU Črnomelj). 100 % pokrito.
- **Zupanc članek**: 0 omemb Gribelj (učiteljeval v Štrekljevcu, Starih Apeh, Stari Cerkvi, Spodnjem Logu, Gradcu, Podzemlju, Črnomlju — ne v Gribljih) → ni zapis; opomba za vrstico pripovedi: njegova „Sto belokranjskih pripovedk“ (1965) kot moreben vir gribeljskih pripovedi TO_COLLECT.

## DOKUMENTIRANE VRZELI (nezidevni kanali, s kazalci)

1. **SI AS 176 Franciscejski kataster za Kranjsko** — dataset na podatki.gov.si (`digitalizirano-arhivsko-gradivo-starih-katastrov-si-as-176-si-as-177-...`): grafične karte po katastrskih občinah + spisovna evidenca (skica KO, opis meje, seznam obdelovalnih in stavbnih zemljišč, **abecedni seznam lastnikov zemljišč**) — točno to, kar zemljiška zgodba vasi potrebuje. Dostop prek VAC (`vac.sjas.gov.si/vac/search/details?id=23253…23259`, archivePlanSearch path …653582,2325N): **HTTP 000** (DNS reši 163.159.7.249, povezava zavrnjena); JINA 422 „Unexpected empty file“ (odstrani query parametre). Podobno zaslepljen: **dLib.si HTTP 000** (4. val zapored) — zbirka „Bela krajina skozi ljudsko pripoved“ (Kamra vnos povezuje na dLib ogledalnik; vodstvena stran prebrana, paginacije brez odprtih URL-jev) in skeni Domoljuba ostajajo TO_COLLECT.
2. **Belokranjec 7-8/XXIX PDF (50,6 MB)**: direktni curl 415 „Unsupported Media Type“ (openresty); JINA „One moment, please…“. Še vedno realni brskalnik.
3. **Commons „Cabin under the Sun“** (Uroš Novina, član kategorije Griblje): vsebina neznana — TO_COLLECT (pregledati sliko).

## Poučne epizode

- **Iskanje ni katalog**: val 21 je zapisal „Commons 0 zadetkov“, kategorija pa je obstajala — API kategorij (`list=categorymembers`) je medij, ki iskanja ne nadomešča.
- **Dva pokvarjena grepa = dve lažni novosti**: v tem valu sta sična tipkarska napaka v lupinskem grepu (nerešen narekovaj, prelom verižnega ukaza) dvakrat proizvedla sklep „mlin ni v bazi“; šele direktna poizvedba po `/api/opendata` je pokazala MVG-007 „Malenca na Kolpi“ z že vgrajenim virom `commons-malenca`. Nov zapis je bil preklican še pred vgradnjo — dedup grestnja deluje, če merja na podatke, ne na orodje.
- **Rate limiti**: Wikimedia 429 (hitra zaporedja curl klicev; pomaga `User-Agent` z kontaktom + zamiki 10–20 s), z-ai web_search 429 pri vzporednih klicih (zaporedoma z zamiki 10–20 s dela).
- **JINA odstrani query parametre** — iskanja po `/iskanje/?q=` so s tem orodjem nemogoča; ProcessWire/WordPress portali pa sprejmejo `?s=` prek direktnega curl.
- **Dedup grestenje**: 7 od 10 „novih“ Commons datotek je že v bazi (vali 15–24 so jih vgradili posamično) — kategorija jih je zdaj zbrala v eno pravilo.

## Vrsta za vgradnjo (končna, po dedupu)

- **+4 vrstice virov** (554 skupno): `commons-kolpa-griblje-2002` (MVG-001), `commons-pond-panorama-2018` (MVG-016), `weiss-2018-castite-malenca` (MVG-007, deljena identiteta), `kamra-totter-hlevi` (MVG-072).
- **1 nadgradnja vira**: `kamra-plosca` (MVG-010) — natančen URL + polne opombe.
- **2 obogatitvi zgodbe**: MVG-007 (listina 1468 „mlin na Kolpi“), MVG-010 (plošča 1973, BM društvo, na mestu rojstne hiše).
- **Napoved števcev in dve popravni epizodi vgrajenja**: (1) prvi vnos je po nesreči podvajal obstoječi blok `commons-panorama` v MVG-001 (555 vrstic) — fix-dup.py ga je odstranil (554); (2) napoved identitet/deljenih (439/62) je bila napačna: **`Kolpa_griblje.jpg` je že bil vir MVG-006 kolpa-reka in `Pond_Griblje.jpg` že vir MVG-050 goranja-lokva** — dodani vrstici torej ne ustvarita novih identitet, ampak obstoječi delita (+2 deljenih); z upgrajenim `kamra-plosca` (stara gole domena izumre, nova konkretna vstopi) je pravo stanje **437 identitet / 64 deljenih**. Konstante v skriptah so usklajene s pregledom opendata, ne z napovedjo.

## Stanje po valu 25 (vgrajeno)

- **111 zapisov (MVG-001–111, brez spremembe) / 554 virov / 437 identitet / 64 deljenih / 95 entitet; sitemap 112; i18n 946 × 5.**
- Regresija zelena: tsc 0, lint čist, verify-i18n 946 × 5, audit-entities 0 napak (111/554/437/64/372; 95 entitet, 36 oseb), audit-timeline-map 39 ✓/0, audit-iiif 5 ✓/0 (372 faz; 93 + 18), test-entities 100 ✓/0, test-timeline-map 72 ✓/0, test-ai-curator 214 ✓/0, red-team 157 ✓/0, test-plan-visit 42 ✓/0; OpenData 111/554 živo.
- Malenca ima od zdaj najstarejši datum zapisa: listina 1468 („mlin na Kolpi“, lega nedoločena — muzej izrecno napiše).
- Plošča Niku Županiču (1973, Belokranjsko muzejsko društvo, na hiši na mestu rojstne hiše) je zdaj del zapisa MVG-010 s točnim Kamra virom.
