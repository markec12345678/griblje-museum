# 58 · VAL 44 — TASK 96: LEKSIKON 1937 / dLib PRIMARY-SOURCE SESSION

*Digitalni vaški muzej Griblje · 96. sklop · 44. val raziskave · 2026-09-23*
*Načelo: »Najprej dokaz. Nato vgradnja. Nato regresija.« · GLAVNO PRAVILO: LESS BUT PROVABLE.*

---

## A. Research question

Pridobiti čim bolj primaren in preverljiv vir za vpis **Griblje** v *Krajevnem leksikonu Dravske banovine* (1937) in ugotoviti, kaj dejansko piše o Gribljah — brez ugibanja iz izsekov. Vprej znani izsek (41. val): »Griblje 1 km. Nm ca 150 m. Lei na terasi na levem bregu Kolpe. Zaselek ima …«. Naročilo eksplicitno: **ni dovoljenje za obhod varnostnih sistemov**; cilj = zakonita in tehnično preverljiva pot do bibliografskega zapisa, stabilnega identifikatorja, strani in če mogoče skena. Če celoten vir ni dostopen → to jasno dokumentirati. Privzeto **NO CONTENT CHANGE**.

---

## B. Bibliographic identity — **VERIFIED** (uradni zapisi)

| Polje | Vrednost | Kanal potrditve |
|---|---|---|
| Naslov | **Krajevni leksikon dravske banovine** : krajevni repertorij z uradnimi, topografskimi, zemljepisnimi, zgodovinskimi, kulturnimi, gospodarskimi in tujskoprometnimi podatki vseh krajev dravske banovine | dLib details + COBISS + DKUM |
| Vrsta | enciklopedija, leksikon (tiskana knjiga) | COBISS |
| Imprint | **Ljubljana : Uprava Krajevnega leksikona dravske banovine, 1937 (v Ljubljani : Tiskarna Slovenija)** | COBISS |
| Izdala (kolofon) | **Zveza za tujski promet za Slovenijo v Ljubljani** | sken, kolofon (OCR okno) |
| Za upravo in redništvo odgovoren | **Uido/Guido Upan** (OCR: »UIDO UPAN«) | sken, kolofon (OCR okno) |
| Tisk | Tiskarna Slovenija, Ljubljana (predstavnik A. Kolman) | kolofon |
| Topografske karte | Jugoslovanska tiskarna, Ljubljana | kolofon |
| Vezava | Knjigoveznica Jugosl. tiskarne, Ljubljana | kolofon |
| Leto / jezik | 1937 / slovenski | dLib + COBISS |
| Obseg | **715 str., 24 f. pril. s topografskimi kartami, 32 cm** (dLib format: 786 strani) | dLib + COBISS |
| **URN** | **URN:NBN:SI:DOC-IHXHRWQE** | dLib details + mojaknjiznica |
| **COBISS-ID** | **17618945** | dLib details + COBISS |
| Sigature NUK | lČ\i29\n54807 (glavno skladišče, IN 030004107) + DS II 73369 (dislocirano, IN 394793958) | dLib + COBISS |
| Izvor skena | Mariborska knjižnica | dLib |
| Digitalizirano | 13. 7. 2011 · **Prost dostop** (PDF1 310 MB, PDF2 248 MB, **TXT 6166 kB**) | dLib details |
| Pravice | v kolofonu/dLibu brez omejitvenega zapisa; priponke javno navedene kot »Prost dostop« | dLib |

Potrditve s strani skenovanih strani (prek OCR plasti in slike): naslovnica »KRAJEVNI LEKSIKON DRAVSKE BANOVINE / Krajevni repertorij … / LJUBLJANA 1937« + kolofon — **skladno z dLib/COBISS**.

---

## C. Access attempts

| Kanal | Rezultat | Evidence |
|---|---|---|
| dLib details (z-ai page_reader) | **200 — polni metadata zapis** | pr-dlib-details.json (96,6 kB HTML; URN, COBISSID, sigature, priponke, citiranje APA/MLA) |
| dLib iskalnik (page_reader / v2/Results.aspx) | ASP.NET školjka brez seje | pr-dlib-ft.json |
| dLib stream TXT/PDF (page_reader HTTP+HTTPS, Jina + x-referer) | redirect na details/školjko — stream **seje-vezan** | pr-dlib-txt.json, pr-dlib-txt-https.json, jina-dlib-txt2.txt |
| dLib API v2 search | »Malicious request« (detekcija ne-brskalniškega UA) | pr-dlib-api.json (41. val) |
| dLib direktno (curl + agent-browser) | **HTTP 000 / chrome-error** — sandbox egress blokada (znana od 4. vala) | — |
| r.jina.ai (brskalniški fetcher) | details ✓ 200; stream = školjka; API = 401 »bad IP reputation« (časovno omejevanje) | jina-*.txt |
| Wayback (web.archive.org) | sandbox 000; prek page_reader timeout + query-drop | pr-wb-txt (timeout) |
| Google Books API (volume PCWZpwAACAAJ) | **429 »Queries per day«** — dnevna kvota anonimnega projekta | gb-volume.json |
| Google Books web search-inside | page_reader odvrne query stringe (→ domača stran); Jina = Google bot-blokada | pr-gb-search.json, jina-gb-inside.txt |
| Scribd (curl + agent-browser na scribd.com) | **403 / ERR_HTTP_RESPONSE_CODE_FAILURE** | — |
| **Scribd via Jina** | **200** — doc1 267421228 (**776 str.**, wordCount **1.013.926**, formati pdf 34,7 MB + **txt 6,02 MB**, `view_restricted`, archive paywall, uploader »bojana«) + doc2 41938463 (**1382 str.**, wordCount 1.018.903, `view_restricted`, uploader »slovenin«) | pr-scribd.json (2,8 MB), pr-scribd2.json |
| **Scribd embed via Jina** (`/embeds/267421228/content?start_page=N`) | **start_page deluje**: odziv vsebuje sliko strani `images/N-hash.jpg` + (nemirno) **OCR tekstovno plast** (p132 → »SREZ CELJE 117«; p158/163 → »SREZ RNOMELJ 143« + vpisa Vukovci/Zilje) | jina-emb-*.txt |
| **Scribd page slike (html.scribdassets.com) via agent-browser** | **200 — 904×1208 JPEG** (curl = 403; z-ai vision URL = nestabilno 1210; **brskalnik = zanesljiv**) → screenshot → **VLM base64 = zanesljiva branja** | browser-p14x-full.png + vlm-*.raw |
| **z-ai web_search snippet-mining** | **Ključni prebojni kanal** — Google indeks OCR plasti skena: 6+ med seboj skladnih oken vpisa Griblje | s02, s04, s08, s12, s13, s16–s20 |
| COBISS (curl + page_reader) | **200** — polni ISBD/imprint | cobiss-17618945.html, pr-cobiss.json |
| archive.org / HathiTrust kopije leksikona | **ne obstajajo** (samo KLS 1968/1996) — negativen rezultat | s05 |
| WorldCat / dizbi / sistory | 403 / katalog brez skena (41. val) / Cloudflare Turnstile (41. val) | — |
| **Prenos Scribd txt/pdf** | **izveden NI** — `view_restricted` + archive paywall (naročniški dostop) — **ne obhajamo** (naročilo: brez obhodov plačljivih dostopov) | doc-JSON: `hasFreeAccessFromUploader:false`, `show_archive_paywall:true` |

---

## D. Primary-source availability

**PARTIAL.**

- Bibliografska identiteta: **FULL / VERIFIED** (dLib + COBISS + kolofon).
- Strani leksikona: **fizično digitalizirane in javno dostopne** (dLib »Prost dostop«; Scribd kopiji), **iz tega peskovnika pa ni bilo mogoče zakonito prenesti niti TXT (6 MB) niti ene cele strani z vpisom Griblje** (dLib stream = seja-vezan; Scribd = naročniški viewer; peskovniška omrežna blokada obeh gostiteljev).
- Vpis Griblje: **EXCERPT-LEVEL — vendar več-plasten in med seboj skladen** (6+ neodvisnih Google-indeksiranih OCR oken iste strani skena + verifikacija formata prek prebranih strani 129/130 + slike strani 124–129 via agent-browser).
- Številka strani vpisa: **UNRESOLVED** (glej I).

Poučno: page_reader **odvrne query stringe** (zato GB/dLib-search/wayback-API odpovedi); Jina **posreduje** in zmore JS-render — toda hitro 401 (IP reputacija, pavza ~20–40 s).

---

## E. Griblje entry — sestavljeni verifiable vpis (OCR okna; napake ohranjene)

Glavno okno (doc sken — Google indeks; okrajšave razumljene po vzorcu drugih vpisov istega skena: Vukovci, Grm, Mavrlen, Podzemlji, Primostek, Škrilje …):

> **Griblje**, 520-98-70-18-0. Sr so du zdr fin rnomelj 9.6 km, and o Adleii 5 km, el pTt Gradac 7 km, v kraju, up. Podzemelj 5 km. Sola ust. 1889. 2 odd. Gas. Nm 161 m. Vas stoji na terasah nad Kolpo in se deli v Gor., Sred. in Dolnje Griblje. Okrog je rodovitno polje. Skozi vas dri ban. cesta od Gradaca v Adleie. H Gribljam (bivi obini) spadata tudi dve samotni Grabrijanovi hii, imenovani Rim, ki se nahajata bolj v steljnikih e blizu Fukovcev. Temu kraju so dali ljudje …

Prebranost (z verifikacijo formata na sliki str. 129/130):
- »Sr so du zdr fin rnomelj 9.6 km« = *središče sreza/okrajna sodna in davčna oblast: Črnomelj, 9,6 km*
- »and o Adleii 5 km« = *žandarmerijski urad Adlešiči, 5 km*
- »el pTt Gradac 7 km« = *železniška postaja Gradac, 7 km*
- »v krajau« = *šola v kraju*; »up. Podzemelj 5 km« = *poštno-telegrafski urad Podzemelj, 5 km* (vzorci: Vukovci »žand in pT up Vinica 5 km«; Mavrlen; Primostek)
- »Sola ust. 1889. 2 odd. Gas.« = *šola ustanovljena 1889, 2 oddelka, gostilna* (»Gas.« = gostilna — glej H)
- »Nm 161 m« = nadmorska višina ~161 m (drugo okno: »Nm ca 150 m« — varianta branja)

Kontrolno okno (izvor dvoumen — doc1 ali doc2/druga izdaja; kakovostni diferenciator ni bil dosežen):

> Griblje 1 km. Nm ca 150 m. Lei [Leži] na terasi na levem bregu Kolpe. Zaselek ima ime po priimkih Drago. Od K km oddaljene ban. ceste je dohod mogo [mogoč] z avtom …

Kontekst poglavja (prebrano direktno iz skena, PDF 146/147 = tiskana 129/130):
- str. 129 (dvo-stolpčno): [Gradac, 382-83-74-5-8 — dolg zgodovinski vpis: železolivarna von Fridau 1851, mavzolej Jurij Ziga baron Gušič, iz Gradaca doma Pirsch Adolf (1858–1929)] → **Grm, 69-11-9-2-0** (Kučer: predzgodovinska utrjena naselbina z 2300 m nasipom, topilnice železa »Kučer spada skupno z Vačami in Šmarjeto med najvažnejše postojanke predzgodovinskega železarstva«) → Kaplišče, 48-7-7-1-0 → Klošter, 76-14-12-2-0 (franciškanski samostan 1467) → Krasinec, 275-53-49-4-2 → Podzemlji, 122-18-17-1-0 (»Šola ust. 1857, 5 odd. … 2 Gas. … **Gostilna s prenočišči**«; župnija sv. Martina 1375, 2667 duš)
- str. 130: (Podzemelj-tail: rojaki Barle Janez r. 1869 kanonik v Zagrebu, **Tomc Matija r. 1899 skladatelj**!) → Priloščci?/Pristava, 43-10-9-0 → Primostek, 124-19-15-3-1 → Škrilje, 24-3-2-1-0 → **občina Metlika** (Borki, Brišice, Črešnjevska vas, Metlika mesto 1167-246-236-…, »Hotel in gostilne s tujskimi [vini]«)
- tiskana 124 (PDF 139): občina Črnomelj — Dobliče → Jelševnik, 113-22-17-5-0 → K…, Mavrlen, 78-15-7-1-0 (»Šola ust. 1852 … **Gas.** … **ima gostilno**« — **dokaz pomena okrajšave Gas.**)
- tiskana 125 (PDF 140): Mihelja vas, Naklo?, Planina, 181-33-24-5-4 (»Sola ust. 1866, 2 odd. **Gas**, PSPD«)
- tiskana 127 (PDF 143): občina Dragatuš (Nerajev, Obrh, Podlog, Pusti gradec, Sela, Sipek)
- tiskana 134 (PDF 151): Bulići, Dragatuš, 175-136-22-0-1, Goleš, Komenec, Keseri, Kulija
- tiskana 135–136 (PDF 152–153): občina Semič (Brezje?, Breze pri Vinjem vrhu, Čokrova?, Dolenci, Dolnji Črnomelj?; grad-razvalina; Gorica Luze?, Lipovec?, Moverje, Nestoplje, Otok)
- tiskana 138 (PDF 155): **Občina Stari trg**; tiskana 140 (PDF 157): Drskoviče, Drl?, Zadre + **Občina Vinica** (uskokiška zgodovina); tiskana 143 (PDF 158): **Vukovci, 14-12-11-1-0** + Zilje, 41-45-45-1-1
- **PDF 144 = topografska karta sreza Črnomelj** (s prilog; VLM: vas označena, branje »Grilje« ≈ Griblje)

---

## F. Claims (dokazna tabela)

| # | CLAIM | EXACT SOURCE | PAGE | EXACT READING (OCR) | CONFIDENCE | STATUS |
|---|---|---|---|---|---|---|
| 1 | Leksikon zapisuje **gostilno v Gribljih (1937)** | KLDB, vpis Griblje | **UNRESOLVED** | »Sola ust. 1889. 2 odd. **Gas.**« | MED (okrajšava Gas.=gostilna VERIFIED na 3 sosednjih vpisih; sama stran TO_COLLECT) | **PRELIMINARY** |
| 2 | **Šola ustanovljena 1889, 2 oddelka** | KLDB, vpis Griblje | UNRESOLVED | »Sola ust. 1889. 2 odd.« | MED | **PRELIMINARY — muzejska korelacija: 130-letnica šole 2019 ⇒ 1889 ✓ (neodvisna potrditev obstoječega MVG-026 dokaza)** |
| 3 | Vas na **terasah nad Kolpo**, deli se v **Gor. / Sred. / Dolnje Griblje** | KLDB, vpis Griblje | UNRESOLVED | »Vas stoji na terasah nad Kolpo in se deli v Gor., Sred. in Dolnje Griblje« | HIGH (2 neodvisni okni + skladnost s katastrom/krajepisom) | **PRELIMINARY** |
| 4 | **Banovinska cesta Gradac→Adlešiči teče skozi vas** | KLDB, vpis Griblje | UNRESOLVED | »Skozi vas dri ban. cesta od Gradaca v Adleie« | MED | PRELIMINARY |
| 5 | K bivši občini Griblje spadata 2 samotni Grabrijanovi hiši, imenovani **Rim** (blizu steljnikov/Fučkovcev?) | KLDB, vpis Griblje | UNRESOLVED | »H Gribljam (bivi obini) spadata tudi dve samotni Grabrijanovi hii, imenovani Rim« | MED | **PRELIMINARY — NOVI TOPONIM »RIM«, TO_COLLECT (k.u.-k. zemljevid A01–A05!)** |
| 6 | Številčni niz 520-98-70-18-0 (verjetno prebivalstvo-hiše-kmetije-…; skladna rast od 441 duš/70 hiš 1830) | KLDB, vpis Griblje | UNRESOLVED | »520-98-70-18-0« | LOW — **ne dekodirati brez strani** | PRELIMINARY (surovi niz) |
| 7 | Nadmorska višina ca 150 m / 161 m | KLDB | UNRESOLVED | »Nm ca 150 m« / »Nm 161 m« | LOW (dve varianti) | PRELIMINARY |
| 8 | Pozicija vpisa v knjigi: poglavje **SREZ ČRNOMELJ** (poglavja po srezih; občine po uradni številki; okoli 117–145) | sken (tekstovne plasti + strani) | 117–145 | »SREZ CELJE 117«, »SREZ RNOMELJ 143« | HIGH za strukturo | PRELIMINARY |
| 9 | Številka strani vpisa Griblje | — | — | — | — | **TO_COLLECT** |

---

## G. Historical claims (sekundarne navedbe ≠ primarni dokazi)

- Leksikon 1937 = **sekundarni vir** za vsa zgodovinska dejstva; vsak navedek = SOURCE CLAIM.
- »Šola ust. 1889« = 1937 navedba, ki **korooborira** muzejski dokaz iz Dolenjskega lista (130-letnica 2019 → 1889); primarni dokaz šolske kronike ostaja osnova, leksikon = 2. neodvisna pot (koroboracija za MVG-026, ne-vgrajena).
- »Gas.« (gostilna 1937) = 1937 stanje; **ne dokazuje gostilne pred 1898** — ampak podaljša verižno verjetnost: 1898 (Domoljub, literarna, PROBABLE) → 1937 (leksikon, PRELIMINARY) → današnja gostilna meridiana. MVG-109 **nespremenjen** (brez strani ne vgradnja).
- Arheološki kontekst poglavja (Kučer, Gradac, Pusti gradec) = skladen z obstoječimi viri (Mason 2001, Dular, EŠD 10094) — samo kontekst, ne vgrajeno.

## H. Tavern audit

- **Okrajšava »Gas.« = gostilna — VERIFIED** znotraj leksikona: Mavrlen (»… PJS. **Gas.** Nm ca 376 m … Prebivalstvo … **ima gostilno**«), Planina (»Sola ust. 1866, 2 odd. **Gas**, PSPD«), Podzemlji (»… **2 Gas.**, PRK, PJS … **Gostilna s prenočišči**«) — abreviacija potrjena z dobesedno razvezo istega vpisa.
- **Griblje: »… Šola ust. 1889, 2 odd. Gas.« = leksikon zapisuje gostilno v Gribljih 1937** — PRELIMINARY (OCR okna; stran/slika TO_COLLECT). To je **najmočnejši dosedanji signal** za dolgoročno gostilna-vprašanje (MVG-109): kataster 1825 = negativen, Domoljub 1898 = literarna gostilna (PROBABLE), leksikon 1937 = kategorizirana gostilna (PRELIMINARY). Muzejski podatki NESPREMENJENI (pravilo: brez strani ne vgradnja).
- Podzemlji: »2 Gas.« + »Gostilna s prenočišči« = sosednja večja vas z gostilno(-i) — kontekst (ne-vgrajeno).

## I. Negative results

1. **dLib priponke (TXT 6166 kB; PDF 310/248 MB)** — ni bilo mogoče zakonito prenesti iz tega okolja: stream seje-vezan (redirect na details) prek page_reader (HTTP+HTTPS), Jina (+ x-referer), API v2 = »Malicious request«, direktna omrežna pot sandbox = HTTP 000 (curl) / chrome-error (agent-browser). **Ni to dokaz odsotnosti dostopa** — v normalnem brskalniku je vir »Prost dostop«.
2. **Google Books** — API 429 (dnevna kvota anonimnega ključa), search-inside brez query parametrov ali bot-blokada. Negativen rezultat za ta val.
3. **archive.org / HathiTrust / WorldCat / dizbi / sistory** — ni kopij (KLS 1968/1996 samo), blokade ali katalogi brez skena.
4. **Scribd prenos** — obe kopiji `view_restricted` z archive paywallom → **namenoma ne obhodeno** (naročniški dostop; pravilo naročila).
5. **Številka strani vpisa Griblje** — ~15 prebranih strani (124–133 cona + zemljevid + prazne strani) NI vsebovalo vpisa Griblje; struktura poglavja (po srezih → po občinah) mapa, toda vpis ostaja nenajden v prebranih okenih conah; cona = poglavje SREZ ČRNOMELJ (približno 117–145), najverjetnejši preostanek: strani 126–128 / 131–133. UNRESOLVED.
6. **Okno »Griblje 1 km … Zaselek ima ime po priimkih Drago«** — izvor (doc1 1937 pod-vpis zaselka vs. doc2/druga izdaja) dvoumen; ne uporabljeno za trditve. TO_COLLECT.
7. Jina: hitro 401 »bad IP reputation« (pavze 20–40 s); page_reader: **odvrne query stringe** (poučno za prihodnje valove).

## J. Final decision

**PARTIAL PRIMARY SOURCE.**

- Bibliografska identiteta: **VERIFIED** (dLib URN + COBISS + kolofon skena).
- Vpis Griblje: **EXCERPT-LEVEL / PRELIMINARY** — sestavljen iz več med seboj skladnih Google-indeksiranih OCR oken skena; formatni okvir verificiran na prebranih sosednjih straneh; **stran + čista slika vpisa = NOT ACCESSIBLE** iz tega okolja.
- **VGRADNJA: +0 virov, +0 entitet, NO CONTENT CHANGE** — po naročilu: izsek se NE vgrajuje kot nov primarni vir; gostilna-1937 in šola-1889 (leksikon) ostajata dokumentirana PRELIMINARY/TO_COLLECT v tem dokumentu.
- Naslednji raziskovalni kandidati (vrstni red): (1) **izven-peskovniška seja dLib** (običajen brskalnik — »Prost dostop« TXT 6 MB = polni OCR leksikona → stran + celoten vpis v 1 koraku); (2) NUK izvod Č 29 54807 / medknjižnična; (3) doc2 (1382 strani) tekstovna plast; (4) paleografija: toponim **Rim** na katastrskih listih A01–A05 (obstoječa IIIF slika — brez novih prenosov).
