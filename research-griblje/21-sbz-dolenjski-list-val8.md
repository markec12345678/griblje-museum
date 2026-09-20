# 21. SBZ + Dolenjski list + uradna KS — 8. raziskovalni val (2026-10)

**Naročilo:** »odlicno pushaj na github sinhroniziraj kode readme in pushaj na vercle in nadaljuj z raziskavo« — 8. val je bil pred to sejo v teku (surovine zbrane, ena zgodba delno obogatena); ta sklop ga zaključi: izvleček, dedup-preverba, vgradnja (add-only), regresija, sinhronizacija dokumentacije, push GitHub + Vercel.

## Surovine

`research-griblje/raw-web-val8-2026-10/` — 60 datotek: Radio Odeon (članki + iskanja + WP API poskus), Dolenjski list iskanja ×5 (`dl-Griblje`, `dl-Gribelj`, `dl-križevo+Griblje`, `dl-Savinšek+Griblje`, `dl-spominska+soba+Brinc`), Moja Dolenjska (članki ×4 + iskanja ×6), SIstory ×2, SBZ ×3, Družina ×4, Wikidata ×4, Google Books ×1, crnomelj.si ×5 (+ sitemap), znaci, ZVKDS.

## Prelomi vala

1. **Slovenski biografski leksikon (SBZ): Niko Županič** — najavtoritetnejši slovenski biografski vir, celoten življenjepis: rojen **1. 12. 1876 v Gribljah** kmetu in trgovcu **Miku (Nikolaju)** ter **Katarini r. Pezdirc**; osn. šola Podzemelj; meščanska + gimnazija Novo mesto **1888–97 (sošolec D. Ketteja in O. Župančiča)**; Dunaj (pravo → zgodovina, prazgodovina, arheologija, geografija); **1903 doktorat** *Die Ankunft der Slovenen im Süden*; **1904–5 München/Zürich/Basel** (Ranke, Schlaginhaufen, Kollmann); 1906 prefekt Terezijanske akademije; 1907 Beograd po vabilu Cvijića; 1908 kustos; 1914 Etnografski muzej; Niš, srbska vojska, vojna cenzura; **Niška deklaracija (dec. 1914)** — dosegel vključitev osvoboditve Slovencev; Rim 1914, Jsl odbor 1915, Pariz/London/ZDA; **1915 smrtna obsodba + tiralica**; **1919 pariška mirovna konferenca — predsednik etnografsko-geografske podsekcije**; psevdonima **K. Gersin** in **dr. Nikša Gribljanovič**; umrl **11. 9. 1961** Ljubljana. (SBZ je bil že naveden kot vir `sbl-zupanic` — podatki pa še niso bili izkoriščeni.)
2. **Uradna stran KS Griblje** (crnomelj.si, og:url potrjen): **svet KS — predsednica Romana Husič; člani Toni Brinc, Katja Jakofčič, Dario Piškurič, Boris Brodarič**; naselja KS: Cerkvišče + Griblje; na strani uradna objava o asfaltiranju (21. 8. 2025). Prva uradna potrditev sestave sveta KS v zbirki.
3. **Dolenjski list — drugi val enumeracije** (iskanja po »Griblje«, »Gribelj«, »križevo Griblje«): poleg 19 člankov iz vala 6 še ~20 novo-videlih kronik (glej »ne-vgrajeno«); prelomni trije: **»90 let Antona Kralja iz Gribelj — od kurirčka«** (21. 2. 2018), **»Ljudje ob Kolpi: Matija Totter«** (8. 2. 2025), **»Pastirski praznik — Na Starašiničevem pašniku«** (26. 5. 2009).
4. **Moja Dolenjska — križevo (30. 5. 2025)**: neodvisen drugi medij o križevem; ključna novost: **Matija Totter iz Gribelj = Barletov informator** za pastirske šege; adlešičska beseda **»mučki«** za postarana neužitna jajca; fotografije Boris Grabrijan.

## Vgrajeno (add-only; +6 virov: 450 → 456; identitet 351 → 354; deljenih 52 → 54)

- **MVG-043 niko-zupanic +1 vir + zgodbeni odstavek (SL/EN) + entiteta:** nov vir `dl-zupanic-svarski` (DL 2. 12. 2016, »po domače Švarski — svetovljan iz Gribelj!«; iskalni arhiv, polni tekst TO_COLLECT); zgodba dopolnjena z SBZ podatki (starši Miha/Katarina r. Pezdirc; gimnazija z Ketteom in O. Župančičem; München/Zürich/Basel 1904–5; smrt 11. 9. 1961) in DL naslovom; **entiteta `person:niko-zupanic`: alias »Dr. Nikša Gribljanovič«, čas 1. 12. 1876 – 11. 9. 1961, note dopolnjen** (SBZ + vir sbl-zupanic).
- **MVG-087 krizevo-pastirski-dan +2 vira + 2 zgodbeni odstavka (SL/EN):** `md-krizevo-2025` (Moja Dolenjska 30. 5. 2025 — neodvisna potrditev: Barle študent-zapisovalec, Totter informator, »mučki«) in `dl-pastirski-2009` (DL 26. 5. 2009 — dokumentirana izvedba na Starašiničevem pašniku pri Gribljih); zgodba: »med šegami, zapisanimi v 1890-tih, in križevim 2026 teče en sam, neprekinjen koledar«.
- **MVG-057 matija-totter +1 vir + 2 zgodbi odstavka (SL/EN):** `dl-totter-2025` (DL 8. 2. 2025, serija Ljudje ob Kolpi); zgodba: vloga pričevalca — križevo informator za Barleta; »Matiček v zbirki živi dvojno — kot zapisovalec in kot vir zapisovalcev«.
- **MVG-093 tone-kralj-98 +1 vir + 2 zgodbi odstavka (SL/EN):** `dl-kralj-90-2018` (DL 21. 2. 2018); zgodba: »od kurirčka« — najzgodnejši dokumentiran poklicni podatek o Kralju (kurir med vojno); 90. rojstni dan februarja 2018 → 98. januarja 2026 (skladno; letnice se NE računajo iz starosti — pravilo P3-E3).
- **MVG-073 praznik-ks-2024 +1 vir:** `crnomelj-ks-griblje-svet` — uradna stran občine: svet KS 2025 (Husič, T. Brinc, Jakofčič, Piškurič, Brodarič), naselja, asfalt 21. 8. 2025.
- **MVG-073 zgodbi SL/EN obogatene (zaključek delne vgradnje iz predprejšnje seje):** program praznika 15. 9. 2024 po Odeonu — nagovor predsednice KS Romane Husič (zahvala bivšim predsednikom, načrti), obeležje Jakoba Savinška (zapis zaseda-1941), zahvalni nagovori (PGD Dario Piškurič, ŠD Rok Pezdirc, podružnica Branka Weiss), župan Andrej Kavšek, povezoval Niko Štrucelj, Nina Novak (kitara/petje) ob prebiranju Brinčevih spominov; vir `odeon-ks-praznik` že prisoten — vgradnja zdaj vsebinsko zaključena.

## Dedup odločitve (že pokrito — namenoma NI vgrajeno)

- **Odeon »Krajevna skupnost Griblje je praznovala«** (17. 9. 2024; avtor KS Griblje, foto Jani Pavlin) — vir `odeon-ks-praznik` že v MVG-073; izvleček članka uporabljen zgolj za obogatitev zgodbe (dokazno konsistentno: vsi novi podatki so iz tega članka).
- **Odeon »Križevo — star pastirski praznik«** (31. 5. 2019, Grabrijan/KP Kolpa) — vir `odeon-krizevo-2019` že v MVG-087 (val 7); duplikat potrjen.
- **DL »PGD Griblje pred stoletnico« + »Rojak jim je dal zagon«** (13. 5. 2026) — vsebina že dobesedno v MVG-027 (toča, Brinc 35.000/30.000 €, 140 članov/18 operativnih, poveljnik Štrucelj, kombi, stoletnica 2027).
- **DL 21. Pasuljada** (31. 8. 2026) — že vgrajena (val 6; dobesedni citati »preprost kot pasulj«, Torpedovci, komisija).
- **MD asfalt (26. 8. 2025)** — vir `mojadolenjska-asfalt-2025` že v MVG-097 (190 m/35.000 €; občina asfalt + KS podlaga — točno potrjeno).
- DL muzejska učilnica / 91 let Brinca / OŠ Loka 130 let / Štrucelj 80 let / Pet stoletij vere — val 6.

## Zajeto, ne-vgrajeno (nizka muzejska vrednost ali vir ne imenuje gribeljskega akterja)

- **MD požar (31. 3. 2025):** počitniška hiša na območju Gribelj — ostrešje → celoten objekt; vzrok preiskuje PP Črnomelj. Članek **ne imenuje** PGD Griblje → po pravilu »dokaz najprej« NI vgrajen v MVG-027.
- **MD odpadki (19. 8. 2019):** odpadki 30 m od ceste Griblje–Črnomelj, jasla za koruzo, druga stran odcepa za Cerkvišče; kontekst prehodov čez Kolpo; vir: Jože Križan, Facebook — FB-pričevanje, ni muzejskega zapisa.
- **DL Rally Griblje (9. 7. 2026):** ~60 ljubiteljev starodobnih koles iz Slovenije in Hrvaške, starinska oblačila, žganci; predzgodovina: DL »Starodobniki na belokranjskih cestah« (7. 7. 2012); Torpedovci (kolesarska sekcia) že omenjeni v MVG-0xx pasuljada + krizevo 2026. **Kandidat za samostojen zapis** — polni tekst TO_COLLECT.
- **DL 140 let od prenehanja železarne Gradac** (13. 8. 2022; 1856–1882) — kontekst za Rudno peč/železovo prst pri Gribljih; TO_COLLECT polni tekst.
- DL kronika male vasi (kandidati za prihodnji sklop »Kronika«): 67 let poroke Ane in Matije Jakofčič (27. 11. 2013), drobnica 17. ogled (5. 6. 2011), oranja Filaka (SP 2011: 10. mesto; 2012 »Najboljši so zaorali v Gribljah«; »Po prvi tekmi Filak šesti«), gasilci mokra vaja na Kolpi (21. 10. 2008), sršeni (12. 9. 2018), ušli trije biki (23. 9. 2022), avto gorel (29. 6. 2020), prireditev ob materinskem dnevu (30. 3. 2014), Inu srebro (23. 8. 2011), spanje v podružnični šoli (2011 + 2012), rokovnjaška poroka (12. 4. 2010), »Iz Gribelj nič več v Kolpo« (5. 9. 2008), brata Brodarič (29. 8. 2017 — Boris Brodarič = član sveta KS), DL tranzit (11. 7. 2025 — odločitev iz vala 6 ostaja).
- Odeon t-* slugi (Cloudflare): vabilo na pastirski praznik, muzejska učilnica, gribeljci po svetu, kavbojski žur, 130 let šole ×4, križevo — TO_COLLECT z naslednjim odprtim oknom.
- Odeon WP API (`/wp-json/wp/v2/search?search=Griblje`) — Cloudflare challenge; iskalna stran brez SSR zadetkov (JS-iskalnik).
- SIstory (Cloudflare ×2), Družina (iskalnik brez zadetkov za Griblje/Gribelj), znaci.org (404), ZVKDS (404), Google Books (`gb-griblje.json` brez zadetkov o Gribljah), Wikidata (wd-entity/qlever — meta, brez nove Griblje vsebine).

## Blokade vala

- Radio Odeon: Cloudflare na t-* člankih in WP API (arhivirani članki 2019/2024 pridobljeni prej — živi dostop izrazitega okna).
- SIstory: Cloudflare; Družina: prazni rezultati (vsebina pred 1990 ne indeksirana).
- page_reader/web_search kvote: uporabljene gospodarno (glavnina vala iz predhodne seje).

## Regresija (vse zeleno)

- tsc 0 napak; eslint čist; verify-i18n **930 × 5** jezikov ✓
- test-entities **100 ✓ / 0**; test-timeline-map **72 ✓ / 0**; test-ai-curator **214 ✓ / 0**; red-team **157 ✓ / 0** (GAP 24); audit-entities ✓ (0 napak); audit-timeline-map **39 ✓ / 0**
- reseeda z izrecnim `DATABASE_URL=file:/home/z/griblje-museum/db/custom.db` → OpenData **98 / 456** živo potrjeno; sitemap **99** URL-jev (dinamičen)
- konstante usklajene: 450→**456** (R0.3, R16.2, T7.2, T8.11, T9.3, T9.4, T8.3, T8.4, audit), 351→**354** (T7.3, T8.6, audit), 52→**54** (T7.4, T8.7, audit); vir 443 v komentarju T9 → 456

## Stanje zbirke po 8. valu

**98 zapisov (MVG-001–098), 456 virov, 354 identitet virov, 92 entitet** (alias dopolnjen). Produkcija: GitHub main + Vercel (auto-deploy po pushu).

## TO_COLLECT za naslednji val (9.)

1. DL polni teksti (plačljivi ali arhivski): Kralj kurirček 2018, Totter 2025, Zupanič Švarski 2016, pastirski praznik 2009, Rally 2026
2. Odeon t-* članki ob odprtem oknu (Cloudflare): vabilo pastirski praznik, gribeljci po svetu, 130 let šole
3. Rezultati arheoloških raziskav razsvetljave (MVG-097, TO_COLLECT od vala 7)
4. SEM: fotografija rojstne hiše Nika Županiča (1. 1. 1920) — preverba proti MVG-010/017
5. Rally Griblje 2026 — kandidat za nov zapis (Torpedovci)
