# 37 — 23. VAL: SBL REŠI IDENTITETO PIVČANA — ANTON VADNAL (1876–1935), POPRAVEK LETNIKA, KANONIČNI dLib, NAPOLEONSKA DOBA

*72. sklop · 2026-09-22 · naročilo: „odlicno nadaljuj raziskuj"*

## Naročilo in cilj

Nadaljevanje po 22. valu, ki je zapisal MVG-109 (povest »Bridke izkušnje«, Domoljub 1898, psevdonim Pivčan) z izrecno vrzeljo: **»Kdo je bil Pivčan, muzej ne ve« — TO_COLLECT**. Cilj 23. vala: rešiti identiteto Pivčana, prečkati kanale, ki jih zbirka še ni (Radio Odeon, Valvasor/e-rara, Geopedia, Google Ngram, gottschee.net, intechopen), in popraviti vse, kar se ob tem pokaže.

## Metoda: iskalna mreža + naslednje povezave po dokazih

1. **Osnovna linija:** OpenData 109/541 → `dedup-baseline.txt` (109 eksponatov) v `raw-web-val23-2026-10/`.
2. **Iskalna mreža (z-ai web_search + curl + JINA):** Valvasor variantni zapisi (0), Gottscheer korpus (splošne strani), Pivčan psevdonim (0 direktno — **in se je izkazalo: ni treba**, kazalo je bilo na Wikisourcevu), Ngram API (prazno `[]`), Odeon (JS anti-bot), intechopen poglavje 86493 (76 kB, 0 × „Gribl"), gottschee.net (236 B = odpoved), e-rara (bot-check), Google Books (UI lupina + API 429), Geopedia (000), archive.org skozi JINO (343 B).
3. **Ključni obrat:** iskanje „Pivčan Domoljub 1898" ni dalo identitete, je pa pokazalo, da **sl.Wikisource ima stran Domoljub z letnim kazalom vseh zvezkov 1888–1944 (597 kB)** — in v kazalu letnika 1898 vrstico: **»Bridke izkušnje (Povest), napisal Pivčan [Anton Vadnal?], rubrika Listek, 21. 7.; 4. 8.; 17. 8.; 1. 9.; 6. 10.; 20. 10.; 3. 11. 1898«** — wikisourcec je identiteto predlagal z vprašajem in zapisal točne datume vseh sedmih zvezkov.

## PRELOM 1 — identiteta Pivčana: SBL sbi753104 = Anton Vadnal (1876–1935)

1. **SBL iskanje „Vadnal"** (slovenska-biografija.si, HTTP 200): vnosi Vadnal, Alojzij / Angela / **Anton** / Ivan / Katja → **sbi753104: Vadnal, Anton (1876–1935)**.
2. **Celoten vnos** (vnos France Koblar, SBL 13. zv., 1982): ★ **4. 4. 1876 Borovnica** (oče Anton, železniški sprevodnik; mati Margareta r. Vilhar), † **10. 2. 1935 Šentožbolt** pri Trojanah; poklici **pisatelj in duhovnik**; **psevdonimi izrecno izpisani: A. Komar, Komar Anton, Pivčan, Fronetov Fran**; osnovna šola Borovnica, 4. razred Postojna (1887/8); gimnazija Ljubljana 1888–96 (**sošolec Otona Župančiča**); študij zemljepisa in zgodovine na Dunaju 1896–1900 (Krekov „ligaš", akad. društvo Danica, urednik Zore 1897–1900); poučeval kranjsko gimnazijo 1900/1; bogoslovje 1903–6, posvečen 1905; **kaplan Višnja Gora 1906–10, Cerklje na Dolenjskem 1910–21, Krka 1921–24**, župni upravitelj nato župnik Šentožbolt od 1928; po 1929 **obsojen na zapor zaradi nastopa proti centralni diktaturi**, si je v zaporu nakopal smrtno bolezen.
3. **Izključitev konkurence:** SBL iskanje „Pivčan" = 3 zadetki (Domicelj Franc — rojen Pivka 1832, umrl 1855, ne more biti avtor 1898; **Vadnal Anton**; Grasselli-Prosenc Marjana — povezava na Pivko kot rojstni kraj). **Psevdonim Pivčan pripada izključno Vadnalu.** TO_COLLECT iz 22. vala je REŠEN; status identitete: DOCUMENTED (avtoritativni leksikonski vir), atribucija tega besedila: Wikisourcev predlog + SBL psevdonim + katoliški profil avtorja in časopisa = CORROBORATED z avtoriteto SBL.
4. **Skladnost z besedilom (potrjena dvakrat):** leta 1898 je bil Vadnal **dunajski študent zemljepisa in zgodovine, 22 let** — pripoved, ki potuje po deželnih cestah in vozi konje čez pol Kranjske; **sin železniškega sprevodnika** — zgodba, ki se začne na železniški postaji; 4. razred osnovne šole v **Postojni (1887/8)** — ista Postojna, od katere se odpravi povestni voz. Literarna čepljica (uganka, izrecno ne trditev): **v sami zgodbi nastopata „dva rojaka, Pivčana", drvarja, ki opozarjata pred rekrutacijo, eno poglavje nosi naslov „Na Pivki"** — ali si je avtor nadel ime po likih lastne zgodbe, ostaja odprto.

## PRELOM 2 — celotno besedilo na Wikisourcevu (obdelano=4) + kanonični dLib

1. **sl.Wikisource akcijski API** (`action=parse&page=Bridke izkušnje&prop=wikitext`): celotno besedilo **80.334 znakov, 9 poglavij** (Ločitev, Popotnik, Ponarejeni novci, Na Pivki, Vojak, Nepričakovani sestanek, Veselje, Žalost, Konec), **obdelano=4 (100 % pregledano)**, z viri — **7 dLib ID-jev z natančnimi stranmi**: VMHV8D26 s. 165–168, NTBTE8XR s. 177–179, DF9FXOUJ s. 183–185, WFWJGHBH s. 196–198, B9S5HH4Z s. 220–222, E2998DOJ s. 232–234, JYAMM6P5 s. 243–245.
2. **Kanonični metapodatki dLib** (JINA na details stran VMHV8D26): **Domoljub: slovenskemu ljudstvu v poduk in zabavo (Ljubljana), 21. 7. 1898, LETNIK 11, številka 14, založba M. Kolar**.

## FALSIFIKACIJA 22. VALA — letnik je 11, ne 28

Zapis MVG-109 je (napačno) navajal **„letn. 28" / „osemindvajseti letnik" / „volume twenty-eight"** (v periodi, povzetku, zgodbi, imenu in opombi vira). Wikisourcev zapis „11/14–17, 19–21" in dLibova details stran („letnik 11, številka 14") dokazujeta **letnik 11** — smiselno tudi kronološko: Domoljub izhaja od 1888, 1888+10 = **1898 = letnik 11**. Popravljeni vsi štirje nivoji (perioda SL/EN, povzetek SL/EN, zgodba SL/EN, vir nameSi/En + opombe). Vzorec napake: branje „28" iz nekega drugega polja ob ročnem prepisovanju — spet disciplina: vsak metapodatek iz primarnega prikaza, ne iz spomina.

## PRELOM 3 — zgodovinski kontekst zgodbe: napoleonske vojne

Celotno besedilo postavi povest v **napoleonske vojne**: „požunski mir" (Pressburg 1805), pričakovanja Francozov, **rekrutacija** („Zakotnik hodi okoli z biričem in lovci. Kdor more le gibati, mora ž njim"), bežanje vojske po Kranjski. To 22. valu ni bilo znano — zgodba ni „domoznanska črtica 1898", ampak **zgodovinska pripoved o napoleonski dobi**, ki jo je 22-letni študent napisal sto let po dogodkih. Poleg tega celotno besedilo potrjuje val 22 znak za znakom (pot Postojna→Ribnica→Kočevje→Koprivnik→Griblje, „Bili so na meji", Grozdič z vinom po Hrvaškem in Slavoniji **do Daruvarja** — 14 omemb!, ognjišče Romov „zavije navzdol proti Kolpi … tolpa ljudij") in dodaja: **Selanovičev sin iz Črnomlja prenoči v Gribljeh** (22 omemb — pomemben lik).

## VGRADNJA (atomarna skripta ingest.py, rep-strict + write na koncu)

- **+1 vir** na MVG-109: `sbl-anton-vadnal` (SBL sbi753104, licenca „navedi vir", URL osebne strani) → **viri 541 → 542, identitet 429 → 430** (pravilo A1: nov normaliziran URL), deljenih 61 (nespremenjeno).
- **Obogatena 2 obstoječa vira:** wikisource-bridke-izkusnje (letn. 11, datumi zvezkov, hipoteza „[Anton Vadnal?]", SBL potrditev) in domoljub-1898-dlib (natančne strani vseh 7 zvezkov, kanonični metapodatki, založba M. Kolar; „sken strani" ostaja TO_COLLECT).
- **Povzetek in zgodba (SL+EN):** identiteta razrešena (nov odstavek „Kdo je bil Pivčan, je zdaj znano…"), napoleonski kontekst dodan k odstavku o poti, zapora „Muzej išče" olajšana (identiteta ni več iskana; ostaja datum prve gostilne), letnik 28→11 na vseh mestih.
- **+1 entiteta** `person:anton-vadnal` (subjekt-zapisa, aliasi Pivčan/A. Komar/Anton Komar/Fronetov Fran/Anton Vadnjal, sortKey 1876, evidence bridke-izkusnje-1898 z sourceIndex 3 → nov vir) → **entitet 94 → 95 (oseb 35 → 36)**, pokritost zapisov 81/109 → 82/109 (MVG-109 izstopil iz seznama „brez entitet").

## POPRAVKI OBSTRANSKI (ulovljeni z brskalnikom, ne s testi)

1. **Podvojena postaja sprehoda (napaka 71. sklopa):** v `walks.ts` je imel sprehod „Kruh, platno in vino" postajo bridke-izkusnje-1898 **dvakrat zaporedoma** (identična bloka — ostanek rekonstrukcije 22. vala po git checkout). HTTP testi tega ne zaznajo; **React konzola z besedom „two children with the same key"** (my-walk-section/walks-section: `key={exhibit.slug}`). Odstranjen podvojeni blok.
2. **Preliv glave pri namiznih širinah (predval 23):** domača stran je pri 1280–1535 px imela **vodoravni preliv (scrollW 1409 > innerW 1280)** — namizna navigacija s 13 rubrikami (921 px) + znamka (108) + akcije (320) > vsebnik max-w-7xl (1216 z blazinami). Izmera elementov z agent-browserom; popravek v duhu obstoječe stopnjevalne zasnove: **nivo »menu«** (Izrazoslovje, Časovnica, O muzeju — nikoli v vrstici, vedno v hamburgerju), spomin/mojMuzej/igre lg→xl, **hamburger viden pri vseh širinah** (glava brez preliva pri 1536/1440/1280/1024/768/390 — izmerjeno 0 prelivov). Poučno: prejšnji vali so merili samo 390 px; namizne širine nihče ni izmeril.
3. **Konstante skript:** audit-entities (542/430), audit-timeline-map (95 entitet, 36 oseb, 542 virov), test-entities (T8.6 430, T8.11 542, T9.3/T9.4 542), test-timeline-map (T7.2/T7.3/T8.3/T8.4 542/430), test-curator-red-team (R0.3/R0.4/R16.2/R16.3 542/95).

## FALSIFIKACIJE IN NIČELNI IZMERI 23. VALA

- **Radio Odeon** (odeon.si/?s=Griblje): JS anti-bot izziv (wsidchk) — blokiran; domena ostaja TO_COLLECT prek arhiva (Odeonova vsebina o Gribljih že znana iz prejšnjih valov prek Dolenjskega lista in Moje Dolenjske).
- **Valvasor** („Griblach/Griebelach/Griblah"): web_search 0 ustreznih; **e-rara.ch** (ETH, Slava Kranjske 1689) = bot-check („Verifying your browser"); archive.org skozi JINO = 343 B. „das dorff Griblach" (Weiss 2018) ostaja TO_COLLECT prek knjige/NUK.
- **Google Ngram** (nemški korpus 1500–2019): `[]` — niti „Griblach" niti „Griblje" — dokumentirana praznina korpusa, ne dokaz odsotnosti.
- **Google Books API** 429 (peskovniška kvota, ne dokumentna), Geopedia 000, gottschee.net 236 B, intechopen 0 × „Gribl", dLib SPA iskanje = prazna lupina (podrobnostne strani pa delujejo skozi JINO — nov vzorec: **isakanje ne, details da**).

## REGRESIJA (živi :3000 po restartu + reseed)

tsc 0 · lint čist · verify-i18n 946×5 · audit-entities ✓ 0 napak (**109/542/430/61/372; entitet 95, oseb 36**) · audit-timeline-map **39 ✓/0** · audit-iiif 5 ✓/0 (372 faz; 93 z življenjepisom, 16 brez) · test-entities **100 ✓/0** · test-timeline-map **72 ✓/0** · test-ai-curator **214 ✓/0** · red-team **157 ✓/0** (GAP 24) · test-plan-visit **42 ✓/0** · reseed → OpenData **109/542** živo · sitemap **110** · IIIF collection 109/109 + manifest MVG-109 („?manifest=bridke-izkusnje-1898") · strani / + /exponat/bridke-izkusnje-1898 HTTP 200 · **agent-browser:** stran MVG-109 kaže letn. 11 + Anton Vadnal + 4 vire; domača stran hero „109"; **0 konzolnih napak po svežem nalaganju**; preliv 0 pri 1536/1440/1280/1024/768/390; hamburger z vsemi 16 rubrikami; footer mt-auto na dnu.

## Poučne epizode

1. **Rep-strict je trikrat rešil vgradnjo:** ubežani navedki `\"` v noteEn (0 zadetkov), preostali „letn. 28" v imenu vira (statična kontrola), napačen števec proxy (sourceType 543 namesto key-8-presledkov 541) — nič ni bilo zapisano, dokler niso vse kontrole štele.
2. **Konzolna napaka „duplicate key" kot test:** HTTP testi podvojene postaje sprehoda ne vidijo; brskalnik jo javi ob renderju. Brskalniška verifikacija ni luksuzija.
3. **max-w-7xl je strop, ne cilj:** pri izračunu glave sem štel z vsebnikom 1472 pri 1536 px — napačno, vsebnik je capped na 1280. Izmera, ne računanje.
4. **HMR ohranja konzolne napake:** po popravku so se stara opozorila še 2× pojavila (Fast Refresh s starim modulom); svež nalaganje = 0. Preskuševalec mora ločiti zgodovino konzole od trenutnega stanja.

## Stanje

**109 zapisov (MVG-001–109), 542 virov, 430 identitet, 61 deljenih, 95 entitet (oseb 36); sitemap 110; i18n 946 × 5; 13 API poti.**

## Surovine

`raw-web-val23-2026-10/`: dedup-baseline.txt (109), s01–s11 (valvasor, gottscheer, pivcan, ngram, odeon, intechopen, wiki-vadnal, vadnal-web, valvasor2), sbl-vadnal.html + sbl-anton-vadnal.html + sbl-pivcan-search.html, ws-bridke-api.json (celotno besedilo), jina-wikisource-domoljub.md (597 kB kazalo), jina-dlib-vmhv8d26.md (kanon), erara-griblach.html, gottschee-villages.html, jina-gbooks-griblach.md, ingest.py (33 urejanj / 7 datotek).

## Še vedno TO_COLLECT

- „das dorff Griblach" (Weiss 2018, Belokranjski muzej Metlika) — prek knjige/NUK
- Poganjec (toponim) — domačinska potrditev
- Sken strani Domoljuba z omembo (dLib stream)
- Datum prve tiskane gostilne v Gribljih (župnijska in hišna knjiga)
- Radio Odeon arhiv (blokada JS anti-bot)
- Vrzel #3 (benchmark): 360° panorame od vaščanov
