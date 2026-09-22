# 36 — 22. VAL: SL.WIKISOURCE CELOTNOTEKSTOVNO ISKANJE — DRUGA LITERARNA DELA Z GRIBLJAMI + BIBLIOGRAFSKI DOKAZ 1914/68

*71. sklop · 2026-09-22 · naročilo: „odlicno nadaljuj raziskuj“*

## Naročilo in cilj

Nadaljevanje raziskave „kaj se nimamo“ po zaključenem 21. valu (Vaš kanal, MVG-106/107/108). Cilj 22. vala: novi kanali, ki jih zbirka še ni prečkala — arhivske knjižnične API-je (Internet Archive, Google Books, OpenLibrary, NUK, SURS pxweb, Mapire, BHL, RTV arhiv, Kamra) — z izrecnim ciljem poiskati 4 knjige TO_COLLECT iz 20. vala (Muršič–Hudelja 2009, Iglič–Kralj-Iglič 2006, Vončina 1941, leksikon 1997) ter Weissovo poglavje z „das dorff Griblach“ (TO_COLLECT iz 21. vala).

## Metoda: topologija dostopnosti, nato celotnotekstovna API-ja

1. **Merjenje dostopnosti 24 kandidatov** (curl, HTTP koda, UA): odprti **api.rtvslo.si/ava/getSearch2**, **kamra.si** (WordPress), **sl.wikisource.org/w/api.php**, **www.slovenska-biografija.si (SBL)**, **tiles.mapire.eu**, **openstreetmap**, **api.wikimedia**; blokirani/odstavljni: archive.org (timeout 90 s), openlibrary/NUKAT/dLib/geopedia/kataster.gov.si/egp.gov.si/BHL (000), Europeana (401 brez ključa / 403 web), HathiTrust (403), **Google Books API 429 kvota**, **SURS pxweb 503**, Mapire tiles = enotna prazna PNG (catch-all, plačljivi API), 4D/365 RTV = JS-aplikacija.
2. **sl.Wikisource action API** = celotnotekstovno iskanje `list=search` po vseh transkribiranih slovenskih besedilih: poizvedbe Griblje / Griblach / Grüble / Briglach.
3. **SBL iskanje** (`/iskanje/?q=`) po osebah rojenih v Gribljih.
4. **Kamra WP iskanje** (`?s=Griblje`) + preber 5 zadetkov.
5. **RTV 365 arhiv**: iz JS (search.js) izluščen API `api.rtvslo.si/ava/getSearch2?client_id=…&q=` — poizvedbe Griblje/gribeljski/Gribelj.
6. **Commons API** za sken knjige „Novo življenje“ + **stransko renderiranje PDF** (thumb URL z `pageN-1280px`) — obvod 99 MB prenosa.
7. **JINA reader na dLib** (URN stran) — dLib strežniki sicer peskovniško nedostopni (stream/PDF prenos = timeout), ampak JINA vrneta metapodatke + URL-je PDF/TXT.

## PRELOM 1 — MVG-109 „Bridke izkušnje“ (1898): druga literarna dela z Gribljami

Do danes je zbirka poznala **eno** književno delo z Gribljami: Kostanjevčevo „Novo življenje“ (MVG-091). Celotnotekstovno iskanje po sl.Wikisource (poizvedba „Griblje“, 2 zadetka) je odkrilo **povest „Bridke izkušnje“**, objavljeno **pod psevdonimom Pivčan** v ljubljanskem poljudnem časopisu **Domoljub, letn. 28, 1898, št. 14–17 in 19–21** (7 dLib URNov: VMHV8D26, NTBTE8XR, DF9FXOUJ, WFWJGHBH, B9S5HH4Z, E2998DOJ, JYAMM6P5), javna domena, 100 % pregledano na Wikiviru.

**Gribeljska epizoda pripovedi:**
- pot: „Dospevši onkraj Postojne zavijejo … na Ribnico … Nato vozijo čez Kočevje, Koprivnik in dospejo proti večeru do vasi Griblje. **Bili so na meji.**“ — zgodovinsko prava cesta iz Kočevske čez Koprivnik;
- gostilna: „Tu v Gribljah imam prijatelja Grozdiča … **Najpremožnejši je v vasi, in gostilna slovi daleč na okoli. Z vinom trguje po vsem Hrvaškem in Slavoniji.** V Daruvaru se vedno oglasi pri nas.“ + „veliko lepo hišo z veho nad vratmi“;
- Romi ob Kolpi: ciganka „zavije navzdol proti Kolpi. Tu je ob obrežju na zeleni trati sedela okoli ognja tolpa ljudij“ — ena od najzgodnejših omemb taborjenja Romov ob Kolpi pri Gribljih v slovenskem leposlovju (besedilo pisano s stereotipi svojega časa — zapis to izrecno poimenuje);
- književna disciplina (isti vzorec kot MVG-091): knjiga dokumentirana, dogajališče resnično, osebe literarne; Grozdičev priimek v gribeljskih virih ni; Pivčan = psevdonim brez znane identitete (**TO_COLLECT**), kot tudi datum prve tiskane gostilne v Gribljih.

**Vgradnja:** MVG-109 bridke-izkusnje-1898 (kraj, DOCUMENTED, yearFrom/To 1898, koordinata ≈ jedro vasi coordsApprox, brez slike — vzorec MVG-108; sken strani TO_COLLECT) z 3 viri (Wikivir celotno besedilo / dLib skeni / Wikipedija Domoljub (časnik): Ljubljana 1888–1944, do 1906 dvakrat mesečno). **Postaja sprehoda** „Kruh, platno in vino“ (za vino-in-crnina — vino, ki teče iz vasi na trg).

**Dopolnitev MVG-091:** summary SL/EN „Edina doslej znana …“ → „**Prva od doslej znanih dveh** …“ (popravek trditve, ki jo nov zapis ovrže).

## PRELOM 2 — Bibliografski dokaz: „Novo življenje“ = 68. zvezek, 1914 (Wikivir metapodatki zmotni)

Wikivirova stran „Novo življenje (Josip Kostanjevec)“ nosi metapodatke **„69. zvezek, 1915, str. 3–34“** — v nasprotju z muzejskim zapisom MVG-091 („68. zvezek, 1914“) in sl.Wikipedijo (Novo življenje, 1914). **Preverba po primarnem viru:** Commons ima celoten dLib sken (File:Josip Kostanjevec - Novo življenje.pdf, 99 MB, javna last) → **render stran 5** (thumb API brez prenosa celotnega PDF) kaže naslovno stran z izrecnim zapisom:

> Slovenske VEČERNICE za pouk in kratek čas. / Izdala in založila Družba sv. Mohorja v Celovcu. / **68. zvezek.** / **1914.** / Natisnila tiskarna Družbe sv. Mohorja v Celovcu.

**Muzej ima prav; Wikivirovi metapodatki so zmotni** (verjetno prepis sosednjega zvezka). Vgradnja: noteSi/noteEn vira `commons-novo-zivljenje-pdf` dopolnjena z dokazom. SBL (oseba sbi293950) potrjuje avtorja: Josip Kostanjevec, pisatelj in učitelj, ★ 19. 2. 1864 Vipava, † 20. 5. 1934 Maribor → **nov vir sbl-kostanjevec** za MVG-091.

## PRELOM 3 — SBL: natančna osebna stran + ničelni izmer rojstev

- SBL iskanje „Griblje“: **točno ena oseba rojena v Gribljih** — Niko Županič (★ 1. 12. 1876 Griblje, † 11. 9. 1961 Ljubljana; politik, etnolog, antropolog). Ničelni izmer za vse ostale — zbirka to potrjuje.
- obstoječi vir `sbl-zupanic` je imel **korenski URL** `https://www.slovenska-biografija.si/` → **prebrisan na natančno osebno stran** `/oseba/sbi915246/` (vzorec popravkov 21. vala).
- **Učinek na register virov (source-registry, pravilo A1):** identiteta korenine `url:slovenska-biografija.si` izgine (−1 identiteta); natančna stran `url:slovenska-biografija.si/oseba/sbi915246` postane **pravično deljen vir** med zapisa niko-zupanic **in** katarina-zupanic (oba citirata isti SBL članek o Niku Županiču) → deljenih 60 → **61**. Končni števci: identitet **429** (426 + 3 viri MVG-109 + 1 sbl-kostanjevec − 1 korenina), vrstic virov **541**.

## FALSIFIKACIJE / NIČELNI IZMERI (vse dokumentirano)

| Kanal | Izid |
|---|---|
| Internet Archive advancedsearch | timeout 90 s (peskovniška blokada) — Valvasor „Ehre deß Hertzogthums Crain“ full-text ostaja TO_COLLECT |
| Google Books API | 429 kvota (anonimni projekt) — knjige 2009/2006/1941/1997 še TO_COLLECT |
| RTV 365 arhiv (api.rtvslo.si/ava/getSearch2) | 0 pravih zadetkov: „Griblje“ = samo fuzzy „grablje“ (rake), „gribeljski“ = 0, „Gribelj“ = „Grabežljivost“ |
| Kamra ?s=Griblje | 5 zadetkov — vse **že v zbirki** (dedup 100 %: spomenik padlim + zaseda 1941 z EŠD 19324 + plošča Županiču + zbirka spominskih obeležij; vodovod Dobliče 1955/56 z vejo Griblje–Krasinec = kontekst, ne nov zapis) |
| sl.Wikisource „Griblach“/„Briglach“ | 0 zadetkov; „Grüble“: Dalmatinov Psalter (nepovezana oblika) + **Reiseerinnerungen aus Krain — FALSIFIKACIJA**: „bei dem Dorfe Grüble, nicht fern von St. Bartholomä“ = vas pri Krškem (Sveti Jernej ob Savi), NE Bela krajina |
| OpenLibrary, NUKAT, dLib direkt, Geopedia, kataster.gov.si, egp.gov.si, BHL | 000 (blokada); Europeana 401/403; HathiTrust 403; SURS pxweb 503 |
| Mapire tiles | enotna prazna 256×256 PNG za vsak URL (catch-all; 2. vojaški izmer ostaja TO_COLLECT) |
| dLib binary stream (PDF/TXT/thumbnail) | timeout — samo JINA HTML prehoda; sken strani z omembo TO_COLLECT |

## Poučne epizode

1. **Python `\n` v trojih nizih = realna nova vrstica v TS literaru** („Unterminated string constant“ 46×-vrstica); rešitev: zgodbe kot ločene spremenljivke + programski `esc()` v `\\n`.
2. **Regex popravek prek več zapisov je nevaren**: ne-žejni `(.*?)` čez `storyEn: … evidenceStatus: … lat: 45.5728` je požrl vse od prvega zapisa do MVG-109 (celotna plast v enem nizu) — rešitev: `git checkout` + vgradnja iz nič s popravljeno skripto (atomarna, z odštevanjem virov/zapisov pred pisanjem).
3. **URL preberrba vira ima registrski učinek**: koreninska domena → osebna stran je premaknila identiteto in ustvarila 61. deljeni vir — audit-entities konstante (429/61) so bile prilagojene razlagi, ne podatkom.
4. **Commons PDF stranski render** (`…pdf/pageN-1280px-….jpg`) = prenos 1 strani 99 MB skena brez prenosu celote — novo orodje za bibliografske dokaze.
5. **RTV API je bil skrit v JS**: `data-client-id` v HTML + `getSearch2` v search.js — dve poizvedbi namesto JS-bralne strani.

## Regresija (živi :3000 po restartu + reseed)

- tsc 0 · lint čist · verify-i18n 946 × 5
- audit-entities ✓ 0 napak (**109/541/429/61/372**)
- audit-timeline-map 39 ✓/0 · audit-iiif 5 ✓/0 (**372 faz; 93 z življenjepisom, 16 brez**)
- test-entities 100 ✓/0 · test-timeline-map 72 ✓/0 · test-ai-curator 214 ✓/0 · red-team 157 ✓/0 (GAP 24) · test-plan-visit 42 ✓/0
- reseed → OpenData **109/541** živo · sitemap **110** · strani /, /exponat/bridke-izkusnje-1898, /exponat/novo-zivljenje-1914 HTTP 200; IIIF collection + 109/109 manifestov ✓; hero „Zbirka 109 zapisov“ v i18n (5 jezikov); 390 px brez preliva (vzorec zapisa brez slike kot MVG-108); 0 runtime napak v dev.log (stare napake = preklicana faza, obnovljeno iz HEAD)

## Stanje

**109 zapisov (MVG-001–109), 541 virov, 429 identitet, 61 deljenih, 94 entitet; sitemap 110; i18n 946 × 5; 13 API poti.**

- „Kaj se nimamo“ → nova plast: **gribeljska književnost ima dve deli** (1914 + 1898) — zbirka zdaj dokumentira, da je vas vstopila v slovenski tisk že fin-de-siècle, prek poljudnega časopisa z dosegom „od Trsta do Prekmurja“
- bibliografska točnost kot jedro muzeja: muzejski podatek (1914/68) dokazan s primarnim skenom proti zmotnim metapodatkom referenčnega mesta
- izven-peskovniška vrsta (posodobljena): Belokranjec PDF → Vaš kanal → Kropej 2012 → Chapman 2018 → knjige 2009/2006/1941/1997 → Weiss 2018 → Poganjec → **identiteta Pivčana** → **sken strani Domoljuba z omembo** → Valvasor full-text (IA) → 2. vojaški izmer (Mapire)
- vrzel #3 (360° panorame) ostaja edina odprta benchmark vrzel — TO_COLLECT

Surovine: `raw-web-val22-2026-10/` (dedup-baseline, sbl-*, kamra-*, ws-*, commons-*, jina-dlib-domoljub.md, nz-page*.jpg, rtv-getsearch.json, ingest-museum.py, ingest-counters.py)
