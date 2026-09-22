# 27. val (76. sklop) — Uradna ARSO klimatologija (Metlika 1100 mm), popravka najsušnosti, dokumentirane vrzeli repozitorijev in jam

**Datum:** 2026-09-22 · **Naročilo:** »odlicno nadaljuj« (27. val; nadaljevanje po valih 21–26)

---

## Povzetek

Sedmi sklenjeni val raziskave po izven-peskovniški vrsti z **enim vgrajenim dokazom in dvema popravkoma trditev**: (1) **uradna klimatološka povprečja ARSO 1981–2010 za postajo Metlika** (najbližja postaja, ~10 km od vasi) — **1100 mm padavin na leto**, 127 dni z ≥0,1 mm in 26 dni z najvišjo temperaturo >30 °C — z zrcalnimi tabelami za Kočevje (1448), Bilje (1365), Ljubljano (1362) in Mursko Soboto (798); (2) **popravek napihnjene trditve** »padavin je v Gribljih in okolici celo najmanj v Sloveniji« (MVG-016) in nedoločene trditve »z najmanj padavin na kvadratni meter« (MVG-001) — obe zamenjani z niansirano, uradno podprto formulacijo (Bela krajina izrazito sušnejša od osrednje/zahodne Slovenije; najmanj pa prejema severovzhod). Dokumentirane vrzeli: **akademska repozitorija (RUL/DKUM/CORE/agregator) izven peskovnika** (F5 TSPD + JS + Cloudflare + challenge), **Kataster jam = Angular aplikacija DZRJL brez javnega iskalnega API** (Jelenja/Vodena jama ostajata na pisnem viru MVG-040), **SURS PX-Web podnebje danes 302-loop** (deloval v valu 26). Ničelni izmeri: jknm.si (JK Novo mesto) brez člankov o Beli krajini.

## Metoda

Kanali izven-peskovniške vrste po valih 24–26 (ARSO klima ni bila še poskušana; akademska repozitorija NIKOLI):

1. **ARSO meteo**: `meteo.arso.gov.si` dosegljiv iz peskovnika (404/200 = host živ, različno od www.arso.gov.si = 403). Pregledni PDF *Podnebne razmere v Sloveniji 1971–2000* (28 strani, 1,14 MB) brez podatkov po postajah → `/met/sl/climate/tables/normals_81_10` → **imagemap s 57 postajami**, URL-vzorec `/uploads/probase/www/climate/table/sl/by_location/<postaja>/climate-normals_81-10_<Postaja>.pdf`.
2. **Prenos 5 tabel** (Metlika, Kočevje, Murska Sobota, Bilje, Ljubljana) + izvleček vrstice »povprečna višina padavin (mm)*« (pypdf; vrednosti na strani 1, vrstica 48 — * homogenizirane vrednosti, obdobje 1981–2010).
3. **Akademska repozitorija** (nov kanal, NIKOLI prej poskušan — val 19 »repozitorij« = GitHub obnova): RUL `Iskanje.php` = JS lupina, `cgi/search` 404, `/api/*` 404, **page_reader = F5 TrafficShield (TSPD) loader**; DKUM = Joomla ovojnica + JS, `server/api/discover` 404; CORE.ac.uk 403 Cloudflare (tudi prek -L); agregator statisticneanalize.com = challenge page; web_search degradiran (vrne samo domene).
4. **Kataster jam** (retry vala 4): katasterjam.si brez www ne reši DNS; **www.katasterjam.si = 200 (69 kB)** — Angular aplikacija DZRJL (»the largest web cave registry in the world«; publications, excursions, comments); main.js + scripts.js brez API poti (samo social links) — javno iskanje brez JS aplikacije ni mogoče; jknm.si (JK Novo mesto, 859 kB) = taboriščne novice brez člankov o Beli krajini; web_search »Jelenja jama Griblje« = degradirano.
5. **SURS PX-Web podnebje po postajah** (replikacija vala 26): `/api/v1/sl/Data/?query=padavine` danes **302-loop** na HTML SPA (tudi z refererjem, piškotki in -L) — kanal spremenjen od vala 26; opuščeno (normale ARSO pokrijejo dokazno potrebo).

## Prelomi

### Prelom 1 — ARSO klimatološka povprečja 1981–2010, postaja Metlika

- **Uradna tabela** (homogenizirane vrednosti): `https://meteo.arso.gov.si/uploads/probase/www/climate/table/sl/by_location/metlika/climate-normals_81-10_Metlika.pdf`.
- **Metlika: 1100 mm padavin na leto** (vsota 1981–2010; meseci 57–119 mm), 127 dni z vsaj 0,1 mm, 108 dni z vsaj 1 mm, 37 dni z ≥10 mm; **26 dni z najvišjo temperaturo >30 °C** (največ med primerjalnimi postajami — podpora »najtoplejšemu delu Slovenije«); absolutni maksimum 40,5 °C (avgust).
- **Zrcalne tabele istega obdobja:** Kočevje 1448 mm · Bilje 1365 · Ljubljana 1362 · **Murska Sobota 798** (najsušnejša med primerjalnimi — Prekmurje/Podravje).
- **Sklep:** Bela krajina (Metlika) je **izrazito sušnejša od osrednje in zahodne Slovenije** (od petine do četrtine manj), ampak **nima najmanj padavin v Sloveniji** — tisto ima severovzhod. Pregledni ARSO dokument 1971–2000 potrdi smer: »… osrednje Slovenije in nekoliko bolj suho v severovzhodni Sloveniji«.

### Popravek 1 — MVG-016 (ribnik): »celo najmanj v Sloveniji«

- Dotlej: »padavin je v Gribljih in okolici **celo najmanj v Sloveniji**« (prevzeto po Wikipediji z {{cn}}). ARSO to **ovrže v superlativu**.
- Nov odstavek (SL+EN): »padavin je v Gribljih in okolici **med najmanj v Sloveniji** — metliška klimatološka postaja, kakih deset kilometrov od vasi, odmeri v povprečju le 1100 milimetrov na leto (ARSO, 1981–2010), od petine do četrtine manj kot Ljubljana (1362) in Kočevje (1448); manj jih ima le severovzhod države (Murska Sobota 798)«.
- **+1 vir `arso-metlika-normals`** (spletni-vir, javna informacija ARSO; URL = normalizirana identiteta → +1 identiteta) z opombo, ki nosi celo primerjalno tabelo.

### Popravek 2 — MVG-001 (vas): »z najmanj padavin na kvadratni meter na leto«

- Dotlej: »Griblje z okolico so celo najbolj suh kot Bele krajine, z najmanj padavin na kvadratni meter na leto« (omejitev na Belo krajino je bila prikrita, superlativ pa državni).
- Nov odstavek (SL+EN): »Griblje z okolico so **najbolj suh kotiček Bele krajine** — metliška klimatološka postaja odmeri le 1100 milimetrov padavin na leto (ARSO, 1981–2010), **med najmanj v Sloveniji**«; hkrati popravljen zlom slovnične oblike (»suh kot« → »suh kotiček«, usklajeno z EN »driest corner«).
- *Dokazna disciplina:* »najbolj suh kotiček Bele krajine« ostaja TRADITION (v vasi ni postaje; trditev podpirata le lega in kraški opis) — muzej jo tako tudi piše; ARSO normala Metlike je zanjo najmočnejši razpoložljiv pokazatelj.

### Vrzel — akademska repozitorija (nov kanal, izven peskovnika)

- **RUL** (repozitorij.uni-lj.si): F5 TrafficShield — page_reader dobi samo `window["loaderConfig"] = "/TSPD/?type=20"`; `cgi/search` in `/api/*` = 404; iskanje je JS-only.
- **DKUM** (dk.um.si): Joomla ovojnica, JS iskanje; DSpace REST `server/api/discover/search/objects` = 404 (ni DSpace).
- **CORE.ac.uk**: 403 Cloudflare (tudi prek -L). **statisticneanalize.com** (agregator): challenge page.
- Zaključek: kanal ni zaprt, ampak **izven peskovnika** (kot Belokranjec PDF) — seznam vrste se razširi.

### Vrzel — jame Jelenja/Vodena (MVG-040, pisni vir)

- **www.katasterjam.si = Angular aplikacija DZRJL** brez javnega iskalnega API v statičnem HTML/bundle (main.js: samo social links; chunk-i nosijo UI); iskanje zahteva JS aplikacijo (in pri nekaterih delih prijavo).
- jknm.si (Jamarski klub Novo mesto — najbližji klub, raziskuje Dolenjsko/Belo krajino): taboriščne novice o Kaninu 2026, brez člankov o Beli krajini; iskanje JS-only.
- web_search »Jelenja jama Griblje« = degradiran (vrne samo domene, med njimi katasterjam.si in jknm.si — potrditev, da so to pravi kanali, ampak nič o jamah).
- **Stanje:** jami ostajata na pisnem viru MVG-040 (TESTIMONY); kataster ostaja kanal za realni brskalnik.

### Ničelni izmeri / opuščeno

- **SURS PX-Web podnebje po postajah** (letna serija padavin Metlike): 302-loop na SPA danes (v valu 26 delovalo) — opuščeno, normale ARSO pokrijejo potrebo; kanal za ponovni poskus v prihodnjem valu.
- **dLib:** ni ponovno poskušano (6. val blokade bi bil brez nove metode); skeni ostajajo TO_COLLECT.
- **web_search degradacija:** večina poizvedb v tem valu vrnila samo seznam domen brez naslovov/snimkov (nov vzorec — dokumentiran; direktni API-ji so bili zato glavna metoda).

## Vgradnja (atomarna, rep-strict)

- **+1 vrstica virov** (556 → **557**): `arso-metlika-normals` na MVG-016 (spletni-vir; URL = nova identiteta → **+1 identiteta**, 438 → **439**; deljene ostajajo **65**).
- **2 popravka zgodbe** (SL+EN): MVG-016 (ARSO odstavek z normalo in primerjavo) in MVG-001 (kotiček + 1100 mm + »med najmanj«).
- **Konstante:** 557 vrstic virov (test-entities ×4, test-timeline-map ×4, test-curator-red-team R0.3+R16.2, audit-timeline-map, audit-entities), 439 identitet (test-entities, test-timeline-map, audit-entities); audit-entities sporočilo posodobljeno na »27. val: +1«.
- **eslint.config.mjs:** `research-griblje/**` dodan med ignores (prvi .js surovini v raw mapah — katasterjam bundle — sta sicer ulovila 2 error; konfiguracija zdaj pokriva raziskovalne surovine kot `research/**`).
- Nastopajoči zapisi: **MVG-016 (ribnik)** — odstavek + vir; **MVG-001 (vas)** — odstavek.

## Regresija (živi :3000 po restartu + reseed)

- `tsc --noEmit` = 0 · `bun run lint` = čist (s popravljenim ignores)
- verify-i18n: **946 × 5**
- audit-entities: ✓ 0 napak (**111/557/439/65/372**; 95 entitet, 36 oseb; pokritost 82/111)
- audit-timeline-map: 39 ✓/0 · audit-iiif: 5 ✓/0 (372 faz; 93 z življenjepisom, 18 brez)
- test-entities: **100 ✓/0** · test-timeline-map: 72 ✓/0 · test-ai-curator: 214 ✓/0
- red-team: **157 ✓/0** (GAP 24) · test-plan-visit: 42 ✓/0
- audit-numbers: zapisa ribnik/griblje-vas **ne označena** (številke SL↔EN se ujemajo: 1100↔1,100; 1362↔1,362; 1448↔1,448; 798↔798); obstoječe opombe starejših zapisov nespremenjene
- OpenData živo: **111/557** · sitemap: 112
- **agent-browser:** domača stran hero »Zbirka 111 zapisov« ✓; /exponat/ribnik — ARSO odstavek + vir `arso-metlika-normals` z opombo izrisana ✓; /exponat/griblje-vas — »metliška klimatološka postaja odmeri le 1100 milimetrov« ✓; preliv pri 390 px = 0 (scrollW = innerW); lepljiva noga: footer bottom = pageH (6.770 px), vrzel 0; dev.log 0 napak.

## Surovine (raw-web-val27-2026-10/)

arso-podnebje-71-00.pdf (pregled 1971–2000, 28 str) + arso-podnebje.txt, arso-climate-main.html, arso-tables.html, arso-normals-81-10.html (imagemap 57 postaj), arso-climate-normals_81-10_{Metlika,Kocevje,Murska-Sobota,Bilje,Ljubljana}.pdf, arso-norm-dir.html, ul-repo-griblje.html, um-repo-griblje.html, ul-cgi-search.html, core-search.html, dkum-*.html/json, statan-griblje.html, pr-rul.json (F5 TSPD), katasterjam-www.html, kj-main.js, kj-scripts.js, jknm-home.html, jknm-search.html, pxw-*.json (302-loop), s01–s04 web_search, probe datoteke.

## Izven-peskovniška vrsta (posodobljena)

1. **Akademska repozitorija** (NOVO): RUL (F5 TSPD + JS), DKUM (JS), CORE (Cloudflare), agregator (challenge) — diplomska/magistrska/doktorska dela o Gribljih NIKOLI prebrana; prvi resni kanal za etnogeografske/agrafne študije vasi.
2. **Kataster jam / DZRJL** (www.katasterjam.si) — Angular aplikacija; Jelenja/Vodena jama (MVG-040) čakata potrditev.
3. **Belokranjec 7-8/XXIX PDF** (50,6 MB) — celotno besedilo čaka na realni brskalnik.
4. **dLib** (5 valov blokade) — sken Domoljuba 1898, Krajevni leksikon 1937, ZC 42(4) 1988.
5. **Poganjec domačinska potrditev** toponima (GBIF piniran, iNat places 0).
6. **Lojze↔Alojz Štrucelj** — potreben dokaz, ki poimenuje obe obliki.
7. **Kamra „Bile so velike družine“** — dokler identiteta ni potrjena, vir ne gre na MVG-051.
8. **ARSO letna serija padavin Metlike (PX-Web)** — 302-loop danes; normale 81–10 že vgradnjene (ta val); serija = dopolnilna.
9. **SI AS 176 Franciscejski kataster** (vac.sjas.gov.si HTTP 000).
10. **Datum prve gostilne** pred 1898 (domačinski viri).
11. **Benchmark vrzel #3** (360° panorame od vaščanov) — edina odprta strateška vrzel.

## Poučne epizode

- **Superlativi iz Wikipedije so pogodba, ne resnica:** {{cn}} trditev »najmanj padavin v Sloveniji« je zdržala v bazi skozi 15 valov, dokler uradna tabela ni pokazala nianso (sušna regija ✓, državni superlativ ✗). Muzej popravlja lastne trditve takoj, ko pride boljši vir — in natančno pove, kaj je bilo.
- **host dosegljiv ≠ pot napačna:** meteo.arso.gov.si je vrnil 404 na dveh ugibanih poteh, 200 na tretji; www.arso.gov.si pa 403 — vsi trije vzorci so dokumentirani, ker se naslednji val vrne na iste strežnike.
- **pypdf vrstica 48:** vrednosti padavin so bile na strani 1 pod tabelo temperature — vzorec »poišči sekcijo, izpiši 16 vrstic« je odkril vrstico 48; ročno branje repr()-ja je hitrejše od pametnih regexov.
- **302 na API, ki je delal val prej:** pxweb.stat.si se obnaša drugače med sejama — kanal se dokumentira in opusti v enem koraku, brez vrtinčenja.
- **eslint ignores:** prvi .js surovini v raw mapah sta pokazali, da `research-griblje/**` ni bil pokrit — popravljeno v konfiguraciji (isti razred kot `research/**`), ne z izbrisanimi dokazi.
