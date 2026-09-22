# 20. val raziskave — vas v svetovnih biodiverzitetnih bazah (GBIF/iNaturalist/Birda) + popis LOD in bibliografije
*69. sklop · 22. 9. 2026*

## Kontekst

Zahtevek: »raziskuj o Gribljeh povsod, kaj se nimamo« (nadaljevanje 19. vala z novim GitHub žetonom). Val 20 je iskal **vrzeli v kategorijah podatkov, ki jih muzej še ni nikoli popisal**:

1. **odprti biodiverzitetni API-ji** (GBIF, iNaturalist, Birda) — pojavitvene (occurrence) baze,
2. **povezani odprti podatki** (Wikidata SPARQL, OpenStreetMap/Overpass),
3. **sl.Wikipedija** (celoten članek + bibliografija),
4. **COBISS/WorldCat/dLib** (bibliografska potrditev literature iz wiki bibliografije).

## PRELOM — MVG-105 biodiverzitetne-baze (narava, DOCUMENTED, 4 vira)

**Metoda:** GBIF occurrence iskanje z ogradnim poligonom okoli vasi (api.gbif.org, HTTP 200) + iNaturalist API (radius 3 km, HTTP 200) + identifikacija nabora prek GBIF dataset API.

- **GBIF: 11 opazovanj v 2 km od jedra vasi (45,576/15,283).**
  - **6 ptic z novega leta 2025** z lokalitete **»Poganjec«** (nabor Birda — Global Observation Dataset, 6ff8b3b0; taksonomija IOC; opazovalec anonimiziran s ključem; licence CC BY 4.0): **2× krogličasta lunja (Circus cyaneus**, zapisa 5277910285 + 5279974550**)**, 2× trstni strnad (Emberiza schoeniclus), konopka (Linaria cannabina), rdečka (Erithacus rubecula). Krogličasta lunja je ujeda, ki na belokranjskih poljih **prezimuje** — novoletni obisk nad vaškimi travniki (0,7 km južno od jedra) je danes svetovno dokumentiran.
  - **5 zapisov 15. 3. 2026 s polj severno od vasi** (~400 m; zrcaljeno iz iNaturalista, opazovalec Balder Dyekjær, CC BY 4.0): medonosna čebela (Apis mellifera), Tropinota hirta, poljska vijolica (Viola arvensis), perzijska jetičnica (Veronica persica), Stellaria media — vsak zapis s točnim časom in koordinato.
- **iNaturalist: 317 opazovanj v 3 km** (stanje 22. 9. 2026); prvih 100 zadetkov = **77 unikatnih taksonov**, razpon julij–september 2026; poletje 2026 = entomološka kampanja (mravlje Lasius niger, Formica pratensis, F. cunicularia, Tetramorium caespitum …). iNaturalist svoja opazovanja zrcali v GBIF (nabor 50c9509d).
- **Slika:** samec krogličaste lunje — Peter von Bagh, Wikimedia Commons, **CC0** (1600×1117 → sharp 1360×949); uporabljena kot slika vrste (izrecno: »slika vrste, ne posnetka z vasi«).
- **Postaja sprehoda:** »Iz Gribelj v svet« (ob TULV in pajku) — pokritost zapisov ohranjena 105/105.
- **Muzej išče:** domačinsko potrditev toponima **Poganjec** (lokaliteta v bazi; muzej je neugibal — ne entiteta) + lokalne opazovalce narave (ptice/metulji/rastline z oklica → isto bazo → ta muzej).

## FALSIFIKACIJE IN DOKAZNA DISCIPLINA

1. **Rogač (Lucanus cervus) IZPUŠČEN iz zapisa** — GBIF 6469766316 = iNat 385453091 (research grade!), ampak: iNat place_guess **»Mošanci, Hrvatska« je napačen reverse-geocode** (koordinata 45,564/15,316 leži ~2,9 km JV od vasi, v Sloveniji — pri Kanižarici), GBIF ga interpretira kot Hrvaško, licenca na iNat ni definira. Koordinata je verjetno prava, vendar si zapis ne more privoščiti vrste z napačno državo v bazi — dokazna disciplina. (Če bodoča publikacija potrdi rogača ob Kolpi, dobi svoj zapis.)
2. **Orchidea Neotinea tridentata** (45,571/15,233) = **3,9 km zahodno** — izven obeh radijev zapisa (2 km/3 km); ni vgrajena.
3. **Poganjec ni entiteta** — navedba lokalitete ostane v opombi vira; entiteta se ustvari šele ob domačinski potrditvi.
4. **Overpass OSM: 0 poimenovanih elementov z »Griblje« v 2,5 km** — OSM toponime vasi nima (ničelni izmer dokumentiran; vas v toponimskem smislu živi v urbarjih in v spominu, ne (še) v OSM).
5. **Wikidata SPARQL (P131 = Q2531566): 0 objektov** — noben Wikidata predmet ne trdi, da se nahaja v Gribljih (cerkev sv. Vida ima predlogo RKD s št. 2122, ampak sam predmet (če obstaja) ne nosi P131). Vas je reprezentativnostna praznina LOD — muzej z lastnim JSON-LD torej resnosledno izpolnjuje vrzel.

## sl.WIKIPEDIJA — članek Griblje (viral je rate-limit; prečen z zamiki)

Celoten wikitext prenesen (api.php?action=parse). Ugotovitve:

- **Infopolje:** prebivalstvo **329 (2026, SURS)**, površina 3,45 km², nadmorska 153,4 m, pošta 8332 Gradac — skladno z MVG-030.
- **Zaselki:** Dolnje Griblje, Brinsko selo, 'Srednje Griblje, Gornje Griblje — pokrito z MVG-049 (zasek Brinsko selo = val 9).
- **Omemba 1526** v infopolju + cerkveni članek trdi, da je 1526 »hkrati prva omemba vasi« — **neskladje z muzejsko 1468 (Griblach)** je v muzeju že dokumentirano kot vir (Wikipedia EN: »prva omemba 1526, sedanja stavba 18. stoletja, EŠD 2122«); muzejska zgodba ostaja na urbarju, neskladje je izrecno zapisano.
- **RKD/EŠD 2122** (cerkev sv. Vida) — že v muzeju kot del vira.
- **Etimologija:** gribljati (brazdati, orati); »v urbarjih je Grüble, ne Groble« — pokrito z MVG-068 (+ Šimec 2001 že vir).
- **Gorania lokva = glina za opeko** + **Rudna peč (železova prst)** — pokrito z MVG-050 (zapis že povezuje oba toponima in opeko).
- **»Najbolj suh kraj v Beli krajini«** — trditev z oznako {{cn}} (brez vira) — **TO_COLLECT** (potencialen naravoslovni dopravek MVG-001/030, če najdemo ARSO/leksikonski vir).
- **Županič je ohranil najstarejše slike vasi (Vavpotič, Gaspari)** — že vir muzeja (Wikipedija, val prej).
- **Bibliografija članka → dedup:** Šimec 2001 (DL 11. 1. 2001, str. 17) = že vir; Bezek-Jakše »S plugom bi lahko doktoriral« (DL št. 42/2000, o Antonu Filaku) = dodal k TO_COLLECT za MVG-022 (contexto peskovniško nedostopen — v arhivu DL ni preverljiv URL); Valvasor 1689 ✓; Katarina Zupanič Šopek ✓; Muršič–Hudelja 2009, Iglič–Kralj-Iglič 2006, leksikon 1997, Vončina 1941 → spodaj.

## BIBLIOGRAFIJA — štiri knjige iz wiki bibliografije: TO_COLLECT (vgradnja zavrnjena)

| Del | Ugotovljena referenca | Zakaj ni vgrajeno |
|---|---|---|
| Muršič, Hudelja (ur.): Niko Zupanič, njegovo delo, čas in prostor — spominski zbornik ob 130. obletnici rojstva (FF UL 2009) | na dLibu (iskalnik potrjuje); COBISS namiguje URN:NBN:SI:doc-BB80XBP6 | dLib DC/JSON = timeout (blokada potrjena 3×), COBISS+ = DNS ne reši, JINA = 401; URN je namig, ne potrjen zapis |
| Iglič, Kralj-Iglič: Niko Županič — izbrana dela iz historične etnologije in antropologije (2006) | WorldCat **oclc/449214364** | WorldCat = 403 Cloudflare (»Just a moment…«) — URL citiran v tem dokumentu, v muzej šele ob potrditvi |
| Vončina, Drago (ur.): Domoznanska snov Bele krajine (Črnomelj 1941) | omenjena v Odeonovem članku o Josipu Doltarju (22. 3. 2023, »sem našla zapis Marije Kočevar…«) + kmj.si | Odeon članek ne voli najti (iskalni arhiv ga ne vrača); gribeljski kontekst knjige brez tela ne citiren |
| Priročni krajevni leksikon (za BK; Roman Šimec), MK 1997 | wiki bibliografija | nejasna bibliografska identiteta (iskalnik vrača le splošni Priročni krajevni leksikon Slovenije 1996/2005) |

Vsi štirje ostajajo v **izven-peskovniški vrsti** (po valu 18: Belokranjec PDF → Vaš kanal → Kropej 2012 → Chapman 2018 → knjige 2009/2006/1941/1997 → pogača/Županič/mlekomat/1874).

## NAPAKA IZ PREJŠNJEGA VALA — najdena in popravljena

**Stalna neskladja števca i18n:** hero podnaslovi v EN/HR/DE/IT so po valih 16–19 ostali na **101** (val 19 je popravil le SL hero + 20 ostalih nizov; 4 hero nizi so ušli):
- EN »One hundred and one records…«, HR »Sto jedan zapis…«, DE »Hundertundein Eintrag…«, IT »Cento una schede…«
- **Popravljeni na 105** (kot vsi ostali števci vala 20: skupaj 25 nizov — hero 5, vodič 5, sprehodi 5, vizualno iskanje 5, koledar 5; EN vizualno iskanje »one hundred and four« → »one hundred and five«).
- Tudi globinska tabela README (Etiketa/Zgodba/Življenje/Zanesljivost) je ostala na 101 — popravljena na 105.

## KANALI — popis dostopnosti iz peskovnika (20. val)

| Kanal | Status | Opomba |
|---|---|---|
| api.gbif.org | **HTTP 200 — odprt** | occurrence search (bbox), occurrence/:id, dataset/:id — nov ključni kanal |
| api.inaturalist.org | **HTTP 200 — odprt** | observations (lat/lng/radius), observations/:id |
| commons.wikimedia.org API | 200, ampak rate-limit brez zamika | brskalni UA + sleep 8–10 s |
| upload.wikimedia.org | 200 z brskalnim UA | default UA = HTML napaka |
| overpass-api.de | 200 (z UA) | **0 poimenovanih Griblje elementov** |
| query.wikidata.org | 200 (drugi poskus; prvi = 502) | **0 objektov P131=Q2531566** |
| sl.wikipedia.org/w/api.php | 200 (rate-limit po hitrem zaporedju; prežen z zamiki 10–20 s) | parse=wikitext deluje |
| search.worldcat.org | 403 Cloudflare | mrtvica (kot val 19) |
| www.dlib.si | timeout (tudi -4) | blokada 3× potrjena |
| plus.cobiss.si | DNS ne reši; www.cobiss.si 200, a stari IZUM skript = 404 | bibliografija ostaja zaprta |
| z-ai web_search | deluje | 6 poizvedb vala (knjige, Poganjec, dLib URN) |

## VGRADNJA — 20. val (sklop 69)

| Kaj | Kje | Viri |
|---|---|---|
| MVG-105 biodiverzitetne-baze (narava, DOCUMENTED) | museum-content.ts | gbif-circus-cyaneus-2025, gbif-tropinota-2026, inaturalist-griblje, gbif-dataset-birda |
| postaja sprehoda »Iz Gribelj v svet« | walks.ts | — |
| slika kroglicasta-lunja.jpg (CC0, 1360×949) | public/images/authentic + image-dimensions.ts | Commons, Peter von Bagh |
| števec 104→105 v 25 nizih × 5 jezikov | i18n.tsx | + 4 popravljene 101-hero sledi |
| konstante 527/416/105/106 | audit-entities, audit-timeline-map, test-entities, test-timeline-map, test-ai-curator, test-curator-red-team, README | T7.9 92 s časom; R12.4 izpeljan iz konteksta |

## Regresija (živi :3000 po restartu)

tsc 0 · lint čist · verify-i18n 946×5 · audit-entities ✓ 0 napak (105/527/416/60/372) · audit-timeline-map 39 ✓/0 · audit-iiif 5 ✓/0 (372/372; 93 z življenjepisom, 12 brez) · test-entities 100 ✓/0 · test-timeline-map 72 ✓/0 · test-ai-curator 214 ✓/0 · red-team 157 ✓/0 (GAP 24) · test-plan-visit 42 ✓/0 · reseed → OpenData **105/527** živo · sitemap 106.

**Brskalnik (agent-browser):** domov »Zbirka 105 zapisov«; EN hero »One hundred and five records«; stran /exponat/biodiverzitetne-baze = naslov, povzetek, zgodba, slika (200, 146 kB), viri z opombami; mobilni 390 px brez preliva; 0 napak konzole.

## Poučne epizode

1. **MultiEdit NI atomaren** (spet!) — prvi kolu je apliciral 1/25 nizov in odjavil napako na 2. nizu; rešitev: programska zamenjava z bun (natančni nizi) + preverba `grep -c`.
2. **SourceType je zaprt enum** — nov »podatkovna baza« ni veljaven; vgrajeno kot obstoječi »spletni-vir« (razlika ostane v opombi vira) — razširitev enuma bi zahtevala dotik v shemo brez potrebe.
3. **R12.4 red-team testa je ujel PRAVI učinek novega zapisa**: retrieval okno (provided) se premakne, ko pride nov zapis z močnimi besedami — citati, sestavljeni v testu, niso več v oknu. Popravek ohrani namen preverbe: odgovor se sestavi IZ dejanske evidence konteksta (izpeljani citati), ne iz trdo kodiranih slugov.
4. **iNat reverse-geocode lahko zgreši državo** — baza je dokumentacija, ne resnica; kjer baza govori proti zemljevidu, zapis molči (rogač izpuščen).

## Stanje po 20. valu

**105 zapisov (MVG-001–105), 527 virov, 416 identitet, 60 deljenih, 94 entitet; sitemap 106; i18n 946 × 5; 13 API poti.**

Surovine: `raw-web-val20-2026-10/` (gbif-bbox.json, inat-*.json, commons-*.json, wiki-*.json, osm-griblje.json, wikidata-p131.json, w01–w06, gbif-api-*.json, harrier-original.jpg).
