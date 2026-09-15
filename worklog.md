# Worklog

---
Task ID: 1
Agent: Main agent (Z.ai Code)
Task: gh repo clone markec12345678/griblje-museum — temeljita analiza (nadaljevanje: profesionalni popravki z GitHub žetonom uporabnika)

Work Log:
- Kloniral `markec12345678/griblje-museum` v `/home/z/griblje-museum` (118 MB, 12 commitov, veja main)
- Izvedel temeljito analizo (Explore podagent + lastna branja): arhitektura, API rute, lib, komponente, seed, konfiguracija
- Analiza odkrila: kršitev IIIF 3.0 (dvojno gnezdenje Canvas.items), format png za JPEG, neomejen pomnilniški predpomnilnik avdia (40 × več-MB WAV), nova instanca ZAI.create() na vsako sintezo, nedosleden CORS, filter zbirke občutljiv na diakritike, napačna README trditev o samodejnem seedu, ignoreBuildErrors:true je skrival 5 realnih tipovnih napak, ~700 datotek ostankov predloge (skills/ itd.)
- Preveril uporabnikov GitHub žeton (login markec12345678, scope repo, push dovoljenje)
- Ustvaril vejo `fix/quality-pass` in izvedel popravke v 7 commitih:
  1. čiščenje predloge (skills/, examples/, tests/, download/, /api hello-world + ESLint ignori)
  2. IIIF: Canvas.items kot polje AnnotationPage, image/jpeg, komentar 20 manifestov
  3. avdio vodnik: en odjemalec ZAI, predpomnilnik 64 MB po bajtih + 40 vnosov, in-flight dedup, tipovni popravki
  4. CORS * na exhibits/events/stories + src/lib/normalize.ts (skupna normalizacija za iskanje + filter zbirke)
  5. vmesnik: i18n sinhronizacija med zavihki (storage), dinamično leto noge, Separator className
  6. strežnik: ignoreBuildErrors:false + reactStrictMode:true, Prisma log samo izven produkcije
  7. dokumentacija: db:seed + prisma.seed v package.json, resničen README, ime paketa griblje-museum
- Verifikacija: `bunx tsc --noEmit` 0 napak (prej 5 v aplikaciji), `bun run lint` 0 opozoril, živi testi na next dev :3001 — IIIF manifest/collection struktura, CORS na vseh 6 poteh, iskanje "crnomelj"/"zupanic", TTS (22,5 s hladno → 0,02 s iz predpomnilnika, veljaven WAV 24 kHz), osnovna stran 200
- Potiskal vejo (žeton v enkratnem http.extraHeader, brez persist v .git/config), odprl PR #1 in issue #2/#3/#4

Stage Summary:
- PR: https://github.com/markec12345678/griblje-museum/pull/1 (7 commitov, odprt, NE spojen — odločitev lastnika)
- Issue #2 placeholder domene, #3 neuporabljene odvisnosti, #4 dimni testi
- Repo se skrči za ~polovico v delovni kopiji; aplikacijska koda nedotaknjena funkcionalno, boljša kakovost
- Varnost: uporabniški PAT je bil objavljen v klepetu — priporočena takojšnja rotacija/preklic
- Testni strežnik klona (:3001) ustavljen; /home/z/my-project ni bil dotaknjen

---
Task ID: 2-a
Agent: research subagent (general-purpose)
Task: Research world's best museums' digital features for griblje-museum

Work Log:
- Prebral /home/z/my-project/worklog.md (kontekst naloge 1: klon v /home/z/griblje-museum, PR #1, obstoječe funkcije)
- Pregledal obstoječo kodo, da predlogi ne podvajajo funkcij: README.md (funkcije), prisma/schema.prisma (Exhibit: category/kraj–kolpa–vojna–narava–gospodarstvo–sege, yearFrom/To, evidenceStatus, sources), src/lib/types.ts, walks.ts (Walk/WalkStop), storage ključi mvg-visited / mvg-walks / mvg-lang, deep-link logika v museum-app.tsx
- Izvedel 16 spletnih iskanj (z-ai web_search) in 6 branj strani (z-ai page_reader) po digitalnih izkušnjah: Louvre, British Museum, Rijksmuseum, Met, MoMA, Van Gogh Museum, Smithsonian, Google Arts & Culture, DigitaltMuseum, Nasjonalmuseet
- Ključni viri: rijksmuseum.nl/en/about-collection-online (novec Collection Online 2024: Collections z videospotom, Comparator, My Gallery of Honour, Art Explorer, LOD), rijksmuseum.nl Night Watch 717-gigapiksna fotografija, artsandculture.google.com/project/gigapixels (Zoom Views, 1845 predmetov), louvre.fr/en/online-tours (tematski virtualni ogledi, Petite Galerie), britishmuseum.org (Collection Online s filtri, Audio app s tipkovnico po številki, Object trails), metmuseum.org (Open Access API 470k+, pametni avdio vodnik), moma.org (brezplačni tečaji na Coursera + 4-tedenski e-poštni tečaj Modern Art & You), vangoghmuseum.nl (multimedijski vodnik, 11 jezikov, družinska različica 6–12 let, ogledi v nizozemskem znakovnem jeziku), si.edu/openaccess (5,1M CC0 + 3d.si.edu + Transcription Center), dok.digitaltmuseum.org (4–5M predmetov, 286 muzejev, priljubljene oznake, Siter dette objektet), museumnext.com (Nasjonalmuseet My Collection 2023 — »online visitors as curators« prek odprtega API; beta semantic search)
- Izpeljal 10 predlaganih funkcij s prioriteto, prirejenih našemu skladu (Next.js 16 SPA, localStorage, TTS, IIIF/opendata, dvojezičnost, aria-live/reduced-motion), z ocenami S/M/L in konkretiziranimi komponentami/ključi; zavestno izločil podvajanja (TTS po zapisu = BM tipkovnica, sprehodi = BM Object trails/Louvre trails, iskanje/filtri/citat/odprti podatki že obstoajo; računi izključeni po zasnovi)

Stage Summary:
- Prioritetni seznam 10 funkcij »po najboljših muzejih«: 1) Moja zbirka / My Collection (Rijksstudio/Louvre Mes favoris/Nasjonalmuseet My Collection; mvg-collections, srček v exhibit-dialog, M) → 2) Povečava do piksla / Deep-zoom (GAC gigapiksli + Rijksmuseum 717-GPx; zoom/pan v exhibit-dialog, S) → 3) Današnji eksponat / Object of the Day (deterministična rotacija po datumu, S) → 4) Sestavi svoj sprehod / Build your own walk (Louvre visitor trails + Rijks Collections; ponovna uporaba walk-ui.tsx/walk-tracker, M) → 5) Primerjalnik / Comparator (Rijksmuseum Comparator; 2–3 zapisi z ločenim zumom, ?compare=, M) → 6) Otroški način / Kids mode (Van Gogh družinski vodnik 6–12 + Petite Galerie; storyKidSi/En + mvg-kids, M) → 7) Razišči po temah / Theme hubs (Rijks samodejno generirane tematske strani + DigitaltMuseum oznake; S/M) → 8) Vodnik po razpoloženju / Mood guide — Art Explorer lite (Rijks Art Explorer; deterministično točkovanje, izbirno /api/recommend, M) → 9) Muzej v žepu / Offline PWA (Van Gogh offline vodnik + Met pametni vodik; SW predpomnilnik + manifest, M) → 10) Moja galerija / My Gallery of Honour (Rijks My Gallery of Honour + GAC Pocket Gallery; CSS-3D soba na P1 podatkih, L, aspirativno)
- Zgornje gradnijo na obstoječi arhitekturi (storage vzorec mvg-*, deep povezave ?exhibit/?walk, IIIF, TTS), brez računov in brez težkega zaledja; spoštujejo aria-live, prefers-reduced-motion in dvojezičnost

---
Task ID: 3-6
Agent: Main agent (Z.ai Code)
Task: Vercel žeton — preveri deploy, popravi in nadaljuj razvoj po najboljših muzejih sveta

Work Log:
- Preveril Vercel žeton (ekipa robertpezdirc12-designs-projects, projekt griblje-museum prj_hSWh05Dt1zNyzuiIqB3onUIVfd7E, GitHub povezava, prod veja main)
- Diagnoza: (1) ssoProtection=all_except_custom_domains — celo produkcija je preusmerjala na vercel.com/sso-api (brez custom domene stran ni bila javna); (2) DATABASE_URL ni nastavljen → vsi APIji 500; (3) .z-ai-config manjka za TTS
- Zlil PR #1 (kvalitetni pregled) v main
- Veja fix/vercel-deploy: db.ts sam poišče bazo (cwd → /var/task → privzeto), outputFileTracingIncludes za db/custom.db na vseh 7 API poteh, binaryTargets rhel-openssl-3.0.x, postinstall+build zagneta prisma generate, audio-guide maxDuration=60 + ZAI_CONFIG env podpora, README razdelek o namestitvi; PR #5, zlil
- Odstranil ssoProtection (PATCH null — preview_only ni bila veljavna vrednost); preusmeritev je takoj izginila
- Lokalna produkcijska simulacija: bun run build + standalone strežnik brez DATABASE_URL na :3002 → exhibits=20, iskanje, IIIF, homepage 200; db/custom.db potrjen v .next/standalone
- Produkcijski deployment READY; preverba: exhibits=20 (z viri), search=5 zadetkov, IIIF AnnotationPage+image/jpeg, events=5, stories=4, opendata, CORS=*
- Podagent (Task 2-a) raziskal digitalne izkušnje 10 vodilnih muzejev → prednostni seznam funkcij
- Veja feat/world-class-features: (1) Moja zbirka — favorite-tracker.ts (mvg-favorites), my-museum-view.tsx, srce v exhibit-dialog, navigacija; (2) DeepZoom (OpenSeadragon 6, dinamični uvoz, lastiti gumbi, fullscreen); (3) Danes v muzeju — deterministični dnevni izbor (Fibonacci hash dneva); (4) Načrt obiska (kdaj/kako/koliko časa + OSM); (5) SEO/OG metadataBase + slika + twitter card, sitemap/robots prek NEXT_PUBLIC_SITE_URL; PR #6, zlil
- Nastavil NEXT_PUBLIC_SITE_URL na Vercelu (production+preview)
- Verifikacija: tsc 0 napak, lint 0 opozoril, agent-browser lokalno (:3001) in na produkciji — shranjevanje/odstranjevanje/prazno stanje, deep zoom (canvas, gumbi), dnevni zapis, načrt obiska, EN preklop, mobilni 375px; brez konzolnih napak
- Komentiral issue #2 (domene delno rešene)

Stage Summary:
- Produkcija: https://griblje-museum-robertpezdirc12-designs-projects.vercel.app — javna, delujoča, z novimi funkcijami
- PR #1 (kvaliteta), #5 (Vercel namestitev), #6 (funkcije po vzoru muzejev) — vsi spojeni v main
- 4 nove funkcije: Moja zbirka (Rijksstudio), deep zoom (Rijksmuseum/GAC), dnevni zapis (BM/Met), načrt obiska (Louvre/Met) + SEO/OG
- TTS na Vercelu zahteva ZAI_CONFIG env (dokumentirano v README) — brez njega ostali del deluje, avdio vrne 500
- Varnost: Vercel žeton objavljen v klepetu — priporočena rotacija; GitHub PAT prav tako (prejšnje sporočilo)
- Naslednji kandidati: primerjalnik, sestavi svoj sprehod, otroški način, PWA

---
Task ID: 7
Agent: Main agent (Z.ai Code)
Task: Nadaljevanje razvoja po najboljših muzejih sveta — 2. sklop funkcij (nadaljevanje naloge 3-6)

Work Log:
- Osvežil kontekst: worklog (naloge 1, 2-a, 3-6), stanje git (main 6f81e12, vsi PR spojeni), Vercel API (produkcija READY, exhibits=20) — Vercel je bil že popravljen v prejšnji sezi
- Ustvaril vejo feat/museum-experience-2 iz main
- Implementiral 4 funkcije po seznamu kandidatov raziskave (naloga 2-a):
  1. Primerjalnik (Rijksmuseum Comparator): src/lib/compare-tracker.ts (mvg-compare, max 3, FIFO, CustomEvent+storage sinhronizacija), compare-tray.tsx (lebdeči pladenj), compare-dialog.tsx (stolpci z enakimi vrsticami), gumb v exhibit-dialog, globoka povezava ?compare=slug1,slug2
  2. Moj sprehod (Louvre visitor trails + Rijks Collections): my-walk-tracker.ts (mvg-my-walk, urejen seznam), walks.ts buildMyWalk + FAMILY_WALK + ALL_WALKS, my-walk-section.tsx (razvrščanje postaj, deljenje), zagon kot vodeni ogled, ?walk=moj-sprehod&stop=n
  3. Mali raziskovalci (Van Gogh family guide 6–12 + Petite Galerie): kids-view.tsx (družinski sprehod s 6 postajami-vprašanji SLO/EN, uganka s samodejnim pomikom — dogodek museum:scroll-to-quiz, delovni list, zbiralec), nov pogled zaOtroke v VIEW_ORDER (mobilni meni + noga + #zaOtroke; namizna navigacija ga namenoma izpušča kot pri vzorih)
  4. Muzej v žepu (PWA): app/manifest.ts (barve iz oklch: #185b37/#f7f3e9), public/sw.js (cache-first statika+avdio, network-first API/navigacije, trim 80), pwa-register.tsx (samo produkcija + offline banner), ikone generirane (image-generation skill 1024 → sharp 512/192/maskable/apple-touch), metadata.icons
- i18n: +4 razdelki (compare, myWalk, kids, offline) v SLO in EN (~70 ključev), nav.zaOtroke
- Diagnoza lokalnega testiranja: korenarska spremenljivka DATABASE_URL kaže na my-project bazo → dev strežnik z eksplicitno potjo; baza repozitorija nedotaknjena (20 zapisov)
- Popravka med preverbo: relative na sličici pladnja (opozorilo next/image), večkratno odpošiljanje dogodka scroll-to-quiz (AnimatePresence zakasnitev)
- Verifikacija (agent-browser, :3001 + produkcija): gumbi v zapisu (SLO+EN), pladenj z onemogočenim stanjem pri 1, dialog z 2 stolpcema, ?compare= samodejno odpre, FIFO zamenjava, osebni sprehod (razvrščanje, zagon, ?walk=moj-sprehod), družinski sprehod (postaja 2/6 z otroško opombo), pomik na uganko, mobilni meni 375 px z Za otroke, noga; tsc 0 napak, lint 0 opozoril, konzola čista
- Odstranil po pomoti ustvarjeno datoteko 3001 (log EADDRINUSE) pred push
- PR #7 ustvarjen in spojen (merge 64e2db3); Vercel produkcija BUILDING → READY
- Produkcija verificirana: domov 200, manifest/sw/ikone 200, exhibits=20; brskalnik na produkciji: #zaOtroke, ?compare= (dialog se odpre, URL se ohrani), SW registriran; OFFLINE test: stran se naloži brez povezave, /api/exhibits iz predpomnilnika vrne 20 zapisov

Stage Summary:
- Produkcija: https://griblje-museum-robertpezdirc12-designs-projects.vercel.app — z 2. sklopom funkcij (PR #7)
- 4 nove funkcije: primerjalnik, moj sprehod, otroška pot, PWA offline — vse verificirane na produkciji, offline API potrjen
- Offline banner (navigator.onLine) z agent-browser emulatorjem ni bil preverljiv (emulacija ne spremeni onLine) — mehanizem je standarden (online/offline dogodka)
- Ostali kandidati raziskave: primerjalnik ✓, sestavi svoj sprehod ✓, otroški način ✓, PWA ✓; še odprti: mood guide, theme hubs, My Gallery of Honour (aspirativno)
- Naslednji koraki lastnika: rotacija obeh žetonov (objavljena v klepetu), ZAI_CONFIG env za TTS na produkciji, issue #2 (domene) in #3 (neuporabljene odvisnosti)

---
Task ID: 8
Agent: Main agent (Z.ai Code)
Task: Nadaljevanje razvoja po najboljših muzejih sveta — 3. sklop: raziskava + tematska središča, vodnik po razpoloženju, poveži zbirko, muzej v minuti

Work Log:
- Osvežil kontekst: worklog (naloge 1, 2-a, 3-6, 7), git (main 64e2db3, PR #1–#7 spojeni), Vercel API (produkcija READY, exhibits=20) — stanje stabilno
- Podagent (raziskava, 34 iskanj + 15 branj strani + živi ogled rijksmuseum.nl in Pocket Gallery): poglobitev 3 preostalih kandidatov (theme hubs / Art Explorer / Gallery of Honour) + 5 svežih idej (x Degrees of Separation, One Minute Wonders, video zbirke, življenje predmeta, adventni koledar); priporočil sklop 3: theme hubs + mood guide + povezave + muzej v minuti; Gallery of Honour ostaja za sklop 4
- Veja feat/museum-experience-3 iz main; 8 novih datotek + 10 spremenjenih (2632 vrstic):
  1. Tematska središča: src/lib/theme-hubs.ts (6 kuriranih hubov z uvodi SLO/EN, sorodne teme z razlogi) + theme-hub-view.tsx (landing s 6 ploščicami + hub: zapisi teme z obiskanimi prvi, sprehodi, sorodne teme s trojno sličico); vstopi: ploščice v #zbirka, gumb »Poglej temo« v zapisu, noga, mobilni meni; globoka povezava ?tema=
  2. Vodnik po razpoloženju: src/lib/mood-guide.ts (3 vprašanja, 9 žetonov, deterministično točkovanje nad kategorijami/ključnimi besedami/dolžino zgodbe, razlogi na zapis, EN prireditve ključnih besed) + mood-guide-view.tsx (potek z napredkom, izbor z razlogi, srce/primerjalnik, deljenje, pomnjenje mvg-mood, nasvet glede na čas); vstopi: gumb v heroju, kartica na landing tem; globoka povezava ?mood=
  3. Poveži zbirko: src/lib/connections.ts (povezave: ista tema/prekrivajoče obdobje/isti vir/bližina ≤3 km/kuratorska vez tem iz THEME_HUBS z utežjo 1; relatedExhibits + Dijkstra findConnectionPath z ceno 1/utež) + connect-dialog.tsx (izbira A/B, veriga kartic z razlogi skokov, deljenje) + trak »Povezani zapisi« v exhibit-dialog; analiza grafa odkrila odrezan sege-otok → kuratorska vez tem ga pošteno poveže (cel graf povezan); globoka povezava ?path=
  4. Muzej v minuti: src/lib/minute-stories.ts (20 ročno napisanih enominutnih zgodb SLO/EN iz istih javnih virov) + minute-stories.tsx (dnevni izbor 3 zgodb na domači strani, predvajalnik, prepis) + AudioGuide variant=minute (preklop »Cel vodnik / V eni minuti« v zapisu) + API &minute=1 z ločenim predpomnilniškim ključem (minute 3,5 MB vs full 4,2 MB)
- Muzej-app: nova pogleda tema/razpolozenje (VIEW_ORDER za veljavnost hash-a; namizna navigacija izpuščena kot pri zaOtroke, mobilni meni vključuje Teme), globoke povezave ?tema/?mood/?path, URL-sinhronizacija
- i18n: +4 razdelki (themes, mood, connect, minute) v SLO in EN (~90 ključev)
- Popravki med preverbo: ?mood= ni nastavil pogleda (setView("razpolozenje")), kuratorska vez tem za povezanost grafa, EN prireditve ključnih besed razlogov
- Diagnostika peskovnika: procesi ozadja se ubijejo med klici Bash (setsid/nohup ne pomagata; agent-browser daemon preživi) → strežnik zagnan znotraj posameznega klica; DATABASE_URL kaže na bazo my-project → eksplicitna pot do db/custom.db repozitorija
- Verifikacija (tsc 0 napak, lint 0 opozoril, agent-browser lokalno + produkcija): vodnik (vprašanja → izbor 5/8 zapisov z razlogi SLO+EN), ?mood= samodejno odpre izbor, ?tema=kolpa hub z uvodom/sprehodi/sorodnimi temami, ?path= pot Niko Županič → ribnik (blizu drug drugega) → jurjevanje (kuratorska vez), povezani zapisi v dialogu, preklop in predvajanje minutnega posnetka (Ustavi predvajanje + omrežni dnevnik minute=1), ploščice tem v #zbirka, mobilni meni 375 px (Teme da, Po razpoloženju ne), EN popoln
- README: dokumentirane vse funkcije od PR #6 naprej (prejšnji sklopi niso bile v seznamu)
- PR #8 ustvarjen in spojen (merge 703da3f); Vercel predogled READY → produkcija READY (dpl_6qwRCybFCxuVMPXGvQbYxJ2iQXSY)
- Produkcija verificirana: MUZEJ V MINUTI na domači strani, celoten potek vodnika, ?tema=vojna, ?path=sveti-vid,jurjevanje (pot prek ribnika), posnetek zaslona središča teme; brez napak strani

Stage Summary:
- Produkcija: https://griblje-museum-robertpezdirc12-designs-projects.vercel.app — s 3. sklopom funkcij (PR #8, 703da3f)
- 4 nove funkcije po vzoru vodilnih muzejev: tematska središča (Rijksmuseum node strani), vodnik po razpoloženju (Art Explorer, determinističen in razložljiv), poveži zbirko (x Degrees of Separation z utemeljenimi skoki), muzej v minuti (One Minute Wonders, 20 zgodb)
- Graf zbirke zdaj povezan (kuratorska vez tem kot najšibkejša, pošteno označena povezava); vse globoke povezave deljive (?tema=, ?mood=, ?path=)
- Znana meja: TTS na Vercelu vrne 500 brez ZAI_CONFIG env (dokumentirano v README) — vključno z minutnimi zgodbami; lokalno deluje
- Ostalo za sklop 4 (aspirativno): My Gallery of Honour (CSS-3D soba iz mvg-favorites, ?gallery=), video posnetek osebne zbirke (Ken Burns), življenje predmeta (provenance časovnica), sezonska polica
- Naslednji koraki lastnika: rotacija obeh žetonov, ZAI_CONFIG env, issue #2 (domene) in #3 (neuporabljene odvisnosti)

---
Task ID: 10
Agent: Main agent (Z.ai Code)
Task: Nadaljevanje razvoja po najboljših muzejih sveta — 4. sklop: sezonska polica z adventnim koledarjem, življenje predmeta, galerija časti (CSS-3D), filmski ogled (Ken Burns)

Work Log:
- Osvežil kontekst: worklog (naloge 1–8), git (main 703da3f), Vercel (produkcija READY na 703da3f)
- Podagent raziskave (Task 10-a, 26 iskanj + 14 branj): potrdil izvedljivost CSS-3D sobe brez WebGL (Codrops 3D Image Gallery Room), vzorce Art Tracks (Carnegie) za provenance, Ken Burns parametre (kirupa/Intuiface) in adventne koledarje (Glencairn, Ashmolean #AshmoleanAdvent); priporočil vrstni red po vrednost/strošek
- Veja feat/museum-experience-4 iz main; 6 novih datotek + 6 spremenjenih (~2600 vrstic):
  1. Sezonska polica: src/lib/seasonal-shelf.ts (4 sezone z meteorološkimi mejami, kurirani nabori, whySi/En, deterministična razpršitev leto+sezona) + seasonal-shelf.tsx (4 izbori na domači strani, oznaka »menjava: vsako leto«)
  2. Adventni koledar: advent-calendar.tsx (24 vrat, odklepanje po lokalnem datumu, zaklena vrata s tooltipom »čez N dni«, hover naslovi) + globoka povezava ?advent=<dan> (odklenjena → odpere zapis; prihodnja → #advent scroll + poudarek); december-only prikaz
  3. Življenje predmeta: src/lib/object-biographies.ts (20 ročno napisanih časovnic, 3–6 faz: nastanek/življenje/pričevanje/raziskava/digitalizacija/danes, sourceIndex → viri iz zapisa, vrzeli poštene — sveti-vid TO_COLLECT) + object-biography.tsx (zložljiva vertikalna časovnica v exhibit-dialog, EvidenceBadge + črtkane povezave za negotove faze, zunanjepovezave virov)
  4. Moja galerija časti: personal-gallery.tsx — SOBA (CSS-3D obroč: perspective 1100px, preserve-3d, transform rotateY(i*step) translateZ(radius), leseni okvirji s pasom, tla, vlečenje + puščice + števec, tablica osrednjega dela, max 12 obešenih) in FILM (Ken Burns: 4 izmenične variante pan/zoom, 6 s na posnetek, podnapsi, segmentni napredek s skoki, neobvezna TTS pripoved minute=1 z nadzorom pavze, zaključni zaslon); mirni način (raven trak) za prefers-reduced-motion + ročni preklop; prazno stanje z vabilom; ?gallery=<slugs> deljivo + »Shrani kot svojo«
  - museum-app: stanje galerije (?gallery=), advent (?advent=), URL-sinhronizacija; home-view: SeasonalShelf + AdventCalendar (december); my-museum-view: gumba »Moja galerija časti« + »Film«; exhibit-dialog: ObjectBiotype po zgodbi
- i18n: +5 razdelkov (season, advent, biography, gallery ~50 ključev) v SLO in EN
- Diagnoza med razvojem (pomembno za prihodnje agente):
  - framer-motion NI apliciral rotateY na elementu s transformStyle: preserve-3d (inline ostal »none«) → obroč vodi čisti CSS transform + transition (cubic-bezier), dragging stanje izklopi prehod med vlečenjem
  - nativno vlečenje slik (HTML5 drag) po pointerdown na <img> POGOLITNE pointermove dogodke (zveni kot pointercancel@0) → draggable={false} na slikah + preventDefault samo za cilje img; klik gumba ostane nedotaknjen
  - Radix Dialog brez DialogDescription opozori → sr-only opis dodan
- Verifikacija (tsc 0 napak, eslint 0 opozoril, agent-browser :3011 + produkcija): sezonska polica (Jesen, 4 izbori, SLO+EN), biografija (griblje-vas 5 faz z 2 viroma; sveti-vid vrzel; niko-zupanic 6 faz z 5 viri), soba (3D transformi, naslednji/puščice/vlečenje 40°→90° snap, klik osrednjega odpre zapis, mirni način, mobilni 375 px), film (samodejni premik 6 s, skok po segmentih, zaključni zaslon, TTS omrežni dnevnik minute=1, utišaj), advent (patch dec 5: 24 vrat, 5 odklenjenih, vrata 5 odprejo Šokčev dvor, zaklenjena ne odprejo nič), ?gallery= samodejno odpre, URL-sinhronizacija in čiščenje ob zaprtju, VLM ocena sobe 8/10, konzola brez napak
- PR #9 ustvarjen in spojen (squash ec0c83f); Vercel produkcija BUILDING → READY (dpl_D9oGPtkWeYCKqS7HvY9YsKwTSpvz)
- Produkcija verificirana: domov 200 + sezonska polica, biografija (6 faz Županič), ?gallery=5 sluhov (soba 1/5, shrani-gumb), film 1/5→2/5 (6 s ura deluje), TTS napaka na produkciji (manjka ZAI_CONFIG) NE zadrži ogleda (graceful), utišaj deluje, 0 napak strani

Stage Summary:
- Produkcija: https://griblje-museum-robertpezdirc12-designs-projects.vercel.app — s 4. sklopom funkcij (PR #9, ec0c83f)
- 4 nove funkcije po vzoru vodilnih muzejev: sezonska polica (object of the month), adventni koledar (Glencairn/Ashmolean), življenje predmeta (Art Tracks provenance), galerija časti + filmski ogled (Rijksmuseum My Gallery of Honour + Ken Burns)
- Skupaj na muzeju zdaj: 24 funkcij po vzorcu svetovnih muzejev (4 sklopi)
- Tehnični odkritji za znova uporabo: framer-motion + preserve-3d ne deluje (uporabi čisti CSS transform); nativni img drag poje pointermove (draggable={false})
- Znana meja: TTS na Vercelu še vedno 500 brez ZAI_CONFIG (dokumentirano v README) — filmski ogled deluje tudi brez zvoka
- Naslednji koraki lastnika: rotacija obeh žetonov, ZAI_CONFIG env, issue #2 (domene), issue #3 (neuporabljene odvisnosti)
- Morebitni sklop 5 (ideje iz raziskave): deljena galerija kot darilo (obstoječe ?gallery= + »shrani kot svojo« ✓ že implementirano), povezane biografije (»kje je bil predmet leta 1945« prek connections.ts), adventna vrata z govorjeno vinjeto, #GribljeAdvent hashtag

---
Task ID: 11-a
Agent: Research subagent (museum features, set 5)
Task: Research set-5 candidates (accessibility mode, slow looking, jigsaw puzzle, user-curated mini exhibition, digital postcards, other ideas) against world museum digital practice — research only, no code

Work Log:
- Prebral worklog.md (4 sklopi, 24 funkcij: osebna zbirka, deep zoom, objekt dneva, načrt obiska, sprehodi, primerjalnik, osebni sprehod, otroška pot, PWA, kviz/gamifikacija, časovnica, tematska središča, vodnik po razpoloženju, graf povezav, muzej v minuti, sezonska polica, adventni koledar, biografije predmetov, galerija časti CSS-3D, Ken Burns film) — preverjal prekrivanja kandidatov
- ~44 spletnih iskanj (z-ai web_search) + ~24 branj strani (page_reader), delno v več krogih (ocena 429 → zamiki):
  - Počasno gledanje: moma.org revija "Slow Looking" serija (npr. Suzanne Jackson; "Step closer and trace a single X with your gaze"); Smithsonian NMAA "Try Slow Looking with 9 Guided Activities" (mar 2025: obiskovalci <30 s/del; začetek 3–5 min, do 15–20; aktivnosti Colors/Shapes/Lines 1 min, Looking 5×2, See-Think-Wonder, Step Inside, Sketch, Making Comparisons, Treasure Cabinet); Tate "A guide to slow looking" (povprečje 8 s; priporočajo 10 min, "set a quiet timer or count breaths"; vstopne teme: tekstura/barva/oblika/simboli/zgodba/perspektiva; veliki tisk za slabovidne); Harvard Art Museums "Slowing Down for Art" (Slow Art Day: 5 del × 10 min + razprava; esej "The Power of Patience" — Jennifer Roberts); slowartday.com; thinkingmuseum.com (Claire Bown: vodene seje 10–60 min)
  - Dostopnost: AAM "10 Best Practices of Accessible Museum Websites" (Sina Bahram 2021: kontrast 4,5:1 majhno/3:1 veliko besedilo, alt-besedila, naslovi, naslovi videa + IZRECNO opozorilo pred dostopnostnimi overlayji); Cuberis serija o muzejski dostopnosti (WCAG AA dejanski standard; vgrajeni gibi za velikost pisave/kontrast so v redu kot dodatek); Tate large-print vodniki; Louvre/British Museum izjave o dostopnosti; Atkinson Hyperlegible (Braille Institute, Google Fonts); Easy Read standard (easyreadstandard.org: ena misel na vrstico); MDN prefers-contrast (Baseline widely available) + forced-colors; kritike overlayjev (Scope, Brickfield, accessibility.works)
  - Sestavljanke: Zanesville Museum of Art "ZMA Puzzler" — DNEVNA spletna sestavljanka iz zbirke malega muzeja (prek JigsawExplorer; tudi objave na IG/X) → najboljši majhno-muzejski precedens; JigsawExplorer (custom puzzle + embed widget + daily jigsaw); NGA Washington "Artle" (dnevna ugankarska igra — vračanje obiskovalcev); CSS-Tricks "Pure CSS Puzzle Game" (hover-trik — nedostopno za dotik/tipkovnico); fizične sestavljanke v muzejskih trgovinah (NG London, Rijksmuseum)
  - Kuratorstvo: Rijksmuseum Collection Online (CODART, dec 2024: osebne zbirke iz 800k slik, primerjava, lastni videospot, 360° Gallery of Honour, Kunstverkenner AI; naslednik Rijksstudia 2012); Google Arts & Culture uporabniške galerije/Pocket Gallery Editor; Cleveland ArtLens; šolski programi pisanja etiket (NC Art Museum, AAM)
  - Razglednice/darila: Useum e-Cards (razglednica iz 80k umetnin — NGA/Getty/Met/Rijksmuseum/Louvre vsebina; slika + sporočilo); SFMOMA "Send Me" SMS (služba ukinjena — "sunset"); MoMA Postcard (poštna umetnost); Museum in a Box (NFC razglednice z zvokom)
  - Ostalo: Color Our Collections (NYAM kampanja, 100+ muzejev — barvilne strani iz zbirk); kiosk vzorci (Fully Kiosk, Edge kiosk, touchwall); zvok/krajoloki zvoka (AAM immersive sound) — avto-play tveganja; digitalna knjiga gostov (brez dobre rešitve brez računov/moderacije); nočni/svečni način (Met le kot socialna vsebina); W3C WCAG 2.2.1 Timing Adjustable (izklop/prilagoditev ≥10×/podaljšanje z opozorilom 20 s)
- Vsakega kandidata preveril proti obstoječim 24 funkcijam (npr. mini-razstava se prekriva z Moja zbirka + Galerija časti + film; "on this day" z objektom dneva)

Stage Summary:
- Verdikti: 1) Dostopnostni način BUILD (najvišja vrednost; LASTEN panel, nikoli tretje-osebni overlay); 2) Počasno gledanje BUILD; 3) Sestavljanka BUILD (brez zunanjega embeda); 4) Mini-razstava SKIP kot samostojna funkcija (močno prekrivanje z Moja zbirka/Galerija časti/osebnim sprehodom — naslov+etikete+A4 poster pozneje zložiti v obstoječo osebno galerijo); 5) Digitalna razglednica BUILD (deljiva URL povezava namesto e-pošte, brez zaledja); 6) Ostalo: barvilne strani (možna dopolnitev, zahteva vnaprej generirane črtne risbe), kiosk ?kiosk=1 (poceni, uporabno za fizično sobo), on-this-day/nočni način/krajoliki zvoka/knjiga gostov SKIP
- Priporočeni sklop 5 (točno 4, po vrstnem redu): 1. Dostopnost (html-class preklopi: veliko besedilo, visok kontrast, pisnica za disleksijo Atkinson Hyperlegible, zmanjšano gibanje, podčrtane povezave; localStorage mvg-a11y; privzeto iz prefers-contrast/prefers-reduced-motion; shadcn Popover panel; sinhronizacija med zavihki) → 2. Počasno gledanje (celozaslonsko, 4 časovne faze z dvojezičnimi pozivi, pavza/preskok iz WCAG 2.2.1, neobvezna TTS pripoved, ?slow=slug, brez zooma pri reduced-motion) → 3. Sestavi sliko (mreža 3×3/4×4/5×5, klik-tap zamenjava kosov [tipkovnica+dotik], neobvezen vlečenje z draggable={false}, števec navzgor namesto časovnega pritiska, najboljši časi v localStorage, praznuješčni zaključek + deljenje) → 4. Pošlji razglednico (izbira zapisa + sporočilo; ?postcard=slug&txt=<URL-varno>&od=; prednja/zadnja stran s čistim CSS 3D flipom [NE framer-motion preserve-3d]; tisk A6 @media print; opozorilo o zasebnosti — sporočilo je v URL)
- Ključne pasti dokumentirane: nativni img drag poje pointermove (draggable={false}); CSS hover-sestavljanke niso dostopne; @media print z mm enotami + print-color-adjust: exact + page-break-inside: avoid; a11y preklopi hidracijsko varno (useEffect + matchMedia, ne med SSR); časovniki: pavza/izklop/podaljšanje, zamik zaradi visibilitychange, interval na podlagi Date.now; tretje-osebni dostopnostni overlayji pravno in etično sporni (AAM/Feingold)
---
Task ID: 11
Agent: Main agent (Z.ai Code)
Task: Nadaljevanje razvoja po najboljših muzejih sveta — 5. sklop: dostopnostna plošča, počasno gledanje, sestavljanka, muzejska razglednica

Work Log:
- Osvežil kontekst: worklog (naloge 1–10-a), git (main 703da3f → PR #9 spojen ec0c83f), Vercel API (produkcija READY, griblje-museum.vercel.app domov 200, vse API poti 200)
- Podagent raziskave (Task 11-a, 44 iskanj + 24 branj): verdikti BUILD/SKIP za 6 kandidatov; priporočil 5. sklop: dostopnostna plošča (AAM: lastna, brez zunanjih overlayjev), počasno gledanje (MoMA/Tate/Slow Art Day), sestavljanka (ZMA Puzzler, klik-izmenjava za miško+dotik+tipkovnico), razglednica (Useum e-Cards/SFMOMA Send Me); SKIP: curator-for-a-day (prekrivanje z 5 obstoječimi osebnimi orodji), on-this-day, nočni način, soundscape, guestbook
- Veja feat/museum-experience-5 iz main; 6 novih datotek + 9 spremenjenih (~2100 vrstic):
  1. Dostopnostna plošča: src/lib/a11y.tsx (A11yProvider: 5 stikal, privzeto iz prefers-contrast/prefers-reduced-motion, localStorage mvg-a11y, storage-sinhronizacija, razredi na <html> v useEffect — hidracijsko varno) + a11y-toggles.tsx (skupen seznam za namizni popover in mobilni meni, aria-live napovedi) + header.tsx (Accessibility gumb s Popover na md+, stikala v mobilnem meniju) + providers.tsx (MotionConfig reducedMotion="always" ko so mirni gibi) + globals.css (a11y-large 112,5 %, a11y-contrast prepis oklch spremenljivk svetla+temna, a11y-dyslexic Atkinson Hyperlegible + razmiki, a11y-calm izklop animacij, a11y-links podčrtave)
  2. Počasno gledanje: src/lib/slow-looking.ts (3 prednastavitve 2/4/8 min ×4 faze [40,60,90,60] s; 4 faze z dvojezičnimi pozivi: prihod/dih, iskanje podrobnosti [6 determinističnih nalog], stopite v notri [čutne zamisli po 6 kategorijah], osebna vez [4 razmisleki]; zapiski mvg-slow-notes) + slow-looking.tsx (celozaslonski dialog: intro s 3 prednastavitvami, faza s krožnim SVG odštevalnikom, pavza/+30 s/preskok, samodejna pavza ob visibilitychange, ura iz razlik Date.now (ne interval števec), aria-live, počasni zoom slike .slow-zoom 60 s izklopljen v mirnem načinu, zaključek s skupnim časom + zasebnim zapiskom + deljivim povabilom ?slow=)
  3. Sestavljanka: src/lib/puzzle.ts (3/4/5 velikosti, mulberry32+Fisher-Yates zamešan [največ 1/3 ploščic na mestu, nikoli rešeno], mvg-puzzle-best, razmerje slike iz naturalWidth/Height) + puzzle-dialog.tsx (mreža gumbov z background-position %, klik-dva-ploščici-izmenjava [miška+dotik+tipkovnica, aria-labeli vrstica/stolpec/diagnoza], ločevanje z inset box-shadow [gap bi raztegnil rezine], številke-namig, poteze+ura od prve poteze, rešitev: banner+deljiv izziv+najboljši čas; restart, velikostni stikala, predloga)
  4. Razglednica: src/lib/postcard.ts (5 pozdravov, 200/40 znakov, ?postcard=&msg=&od=&pz=, žig z datumom) + postcard-dialog.tsx (sestavitev: pozdrav-žetoni+sporočilo+pošiljatelj+zasebnost; kartica: prednja stran s sliko+znamka muzeja, hrbtna s sporočilom+žigom+naslozniki, obrat v ČISTEM CSS-3D [izkušnja 4. sklopa: framer ne aplicira rotateY na preserve-3d]; tisk: portal ob telesu s prednjo+hrbtno polovico, vstavljen <style> @page A5 landscape, @media print skrije vse razen .postcard-print-root)
  - exhibit-dialog: vrstica izkušenj (Počasno gledanje/Sestavi sliko/Pošlji razglednico z ikonami Wind/Puzzle/Mail); museum-app: stanja + globoke povezave (?slow=, ?puzzle=&kocke=, ?postcard= s pending rešitvami) + URL-sinhronizacija
  - i18n: +4 razdelki (a11yPanel, slow, puzzle, postcard) v SLO in EN (~110 ključev); README: 4 novi vnoski + razširjen vnos dostopnosti
- Popravki med razvojem: a11y.ts → a11y.tsx (JSX v datoteki .ts); slovenščina v slow-looking (vozduh→zrak, ostinite→ostanite, umirjajo …, odstranjen pomankljivi ZWNJ v "vdihi"); neuporabljena eslint-disable direktiva
- Diagnoza peskovnika: skripta dev ima hardcoded -p 3000 → bunx next dev -p 3011; Turbopack je serviral STARI CSS iz predpomnilnika .next → rm -rf .next; strežnik umre med klici Bash → vsak klic znova zažene strežnik (agent-browser daemon in localStorage preživita)
- Verifikacija lokalno (tsc 0 napak, eslint 0 opozoril, agent-browser :3011, namizno+mobilno 375 px, SLO+EN): a11y (vseh 5 razredov, 18 px, Atkinson na <p>, bela podlaga lab(100), podčrtane povezave, persistenca mvg-a11y, ponastavitev, EN + stikala v mobilnem meniju), počasno gledanje (intro 3 prednastavitve, faza 1 Prihod odštevalnik 0:18, +30 s → 0:47, preskok ×4 → zaključek, zapisek v mvg-slow-notes, ?slow= sinhronizacija in čiščenje), sestavljanka (9 ploščic, zamenjave, namig, REŠITEV 3×3 v 5 potezah po ciklični razgradnji permutacije, mvg-puzzle-best {seconds:3,moves:5}, ?puzzle= URL), razglednica (sestavitev→obrat rotateY(180deg), sprejem prek ?postcard= s sporočilom/pošiljateljem/žigom, PDF tisk 702 kB, portal .postcard-print-root), 0 napak strani
- PR #10 ustvarjen in spojen (squash 7914eb4); Vercel predogled READY → produkcija READY
- Produkcija verificirana (griblje-museum.vercel.app): a11y plošča (5 stikal, a11y-large, 18 px, ponastavitev), ?slow=niko-zupanic (intro → Prihod s časom), ?puzzle=griblje-vas&kocke=3 (9 ploščic, zamenjava), ?postcard=sveti-vid&msg=…&od=Tine&pz=hvala (sprejeta kartica, obrat, hrbtna stran s sporočilom), 0 napak strani

Stage Summary:
- Produkcija: https://griblje-museum.vercel.app — s 5. sklopom funkcij (PR #10, 7914eb4)
- 4 nove funkcije po vzoru vodilnih muzejev: dostopnostna plošča (AAM/Smithsonian), počasno gledanje (MoMA/Tate/Slow Art Day), sestavljanka (ZMA Puzzler), muzejska razglednica (Useum/SFMOMA) — skupaj 28 funkcij (5 sklopov)
- Čustveni lok obiskovalca je zdaj popoln: dostop za vse → poglobljeno gledanje → igra → darilo
- Tehnični odkritji za znova uporabo: Turbopack servira stari CSS, če .next ni pobrisan; @page je treba vstaviti dinamično (style tag v portalu), da ne pokvari A4 delovnih listov
- Znana meja: TTS na Vercelu vrne 500 brez ZAI_CONFIG env (dokumentirano v README) — počasno gledanje je zasnovano brez zvoka, zato ni prizadeto
- Naslednji koraki lastnika: rotacija obeh žetonov, ZAI_CONFIG env, issue #2 (domene) in #3 (neuporabljene odvisnosti)
- Morebitni sklop 6 (ideje iz raziskave): kiosk način (?kiosk=1 za fizično sobo, ~0,5 dneva), barvanke (Color Our Collections — zahteva line-art datoteke), kuratorjeve tiskane plošče za razred (nadaljevanje galerije časti)

---
Task ID: 12
Agent: Main agent (Z.ai Code)
Task: Nadaljevanje razvoja po najboljših muzejih sveta — 6. sklop: »Muzej, ki posluša« (sodelovanje skupnosti)

Work Log:
- Osvežil kontekst: worklog (naloge 1–11), git (main na 7914eb4, PR #1–#10 vsi spojeni), GitHub API z novim žetonom uporabnika, Vercel API (vse objave READY; griblje-museum.vercel.app domov 200)
- Raziskava (podagent, 16 spletnih iskanj + 7 živih branj Rijksmuseum/GAC/Nasjonalmuseet/Tenement/dok.digitaltmuseum): 12 kandidatov razvrščenih po vrednost/napor; priporočilo #1+#2 skupaj (skupna infrastruktura prispevkov)
- Veja feat/museum-experience-6; 10 novih datotek + 12 spremenjenih (~2600 vrstic):
  1. Prisma: GuestbookEntry + ObjectMemory (status published/held, indeksi [status,createdAt] in [exhibitId,status], Exhibit.memories relacija s Cascade); db:push + seed posodobljen (6 ilustrativnih vpisov knjige + 10 spominov, relativni datumi daysAgo)
  2. src/lib/contributions.ts (zod shemi, cleanText striptanje kontrolnih znakov, looksSuspicious hevristika URL/e-pošta/HTML/[bbcode], drseče okno 5/10 min na IP, honeypot website) + contribution-limits.ts (omejitve ločeno, da odjemalec ne vleče zodja)
  3. API: /api/guestbook + /api/memories (GET + POST + OPTIONS, CORS *, Cache-Control max-age=30); next.config outputFileTracingIncludes += obe poti
  4. Spominska knjiga (guestbook-view.tsx): števca iz API-ja, obrazec z živim števcem znakov, zid vpisov s papirnatimi lističi in rezanim kotičkom; #knjiga v namizni/mobilni navigaciji in nogi
  5. Spomini ob predmetu (object-memories.tsx): odsek v dialogu zapisa za ObjectBiography — seznam + zložljiv obrazec, aria-live povratne informacije
  6. Za kuliso (behind-scenes.ts + behind-scenes-view.tsx): 4 objave × 3–4 koraki (depot/bolnišnica predmetov/pricevanja/advent), scrollytelling whileInView, #zaKuliso (mobilni meni + domov + noga, namensko izven namizne vrstice)
  7. Zbirka v številkah (collection-stats.tsx): po kategorijah/zanesljivosti (animirane vrstice, role=meter), po obdobjih (6 rezin), zanimivosti (najstarejši/najnovejši/%); v AboutView pod števci
  8. Domov: odsek »Glasovi vasi« (zadnji 3 vpisi + vabila knjiga/za kuliso); i18n +4 razdelki (~170 ključev SLO/EN); README (4 funkcije, API tabela, trajnost prispevkov)
- Popravki med razvojem: podvojitev imena stats → collectionStats ( obstoječi home stats); t.categories (ne collection.categories); tkalstvo.jpg ne obstaja → predenje.jpg; slovenščina (gluhiim→gluhim, iskljiv→"je moč iskati", hlaili→hlajili, tonevali, Zimsko suho→Zimska suša, Vreno→Vreteno …)
- Odkritje in popravek: GET max-age=30 → brskalnikov HTTP predpomnilnik zakrije svež seznam po objavi ( invalidate → stale odgovor) → no-store na useGuestbook/useObjectMemories
- Odkritje in popravev #2: shell ima globalni DATABASE_URL=file:/home/z/my-project/db/custom.db → db:push/seed sta šla IZVEN repa; posodobil še repo db/custom.db (drugi commit) — sicer bi Vercel dobil bazo brez novih tabel
- Odkritje in popravek #3: na Vercelu (Lambda) je /var/task BRALNO — GET 200, POST 500 → fix/community-readonly-honesty (PR #12): isReadOnlyDatabase (SQLITE_READONLY/EROFS/EACCES/EPERM) → 503 z dvojezičnim sporočilom »muzej je v načinu za ogled«; lokalno preizkušeno s chmod 444 (GET 200/POST 503/obnovitev OK)
- Verifikacija lokalno (tsc 0, eslint 0, agent-browser :3000, SLO+EN, namizno+375 px): vpis v knjigo → objavljeno + osvežen seznam 7; spomin ob predmetu → števec 2 + nov zapis na vrhu; za kuliso → 4 objave + zapis s 3 koraki, vse slike; O muzeju → statistika (20/56/11/5, 6 vrstic kategorij, obdobja, zanimivosti); moderacijske veje API (published/held/honeypot-quiet/400/429); VLM pregled zaslonskega posnetka: čisto, noga na dnu
- PR #11 ustvarjen in spojen (squash ce2955b); PR #12 spojen (bralna namestitev); Vercel: produkcija READY (erb2cd001 → main)
- Produkcija verificirana (griblje-museum.vercel.app): domov z odsekom Glasovi vasi (3 vpisi), #knjiga (6 vpisov), ?exhibit=storklje (spomin prikazan), O muzeju (Zbirka v številkah, 6 vrstic), #zaKuliso (4 objave, 0 pokvarjenih slik), POST → jasen 503, CORS glava *

Stage Summary:
- Produkcija: https://griblje-museum.vercel.app — s 6. sklopom (PR #11 + #12)
- 4 nove funkcije po vzoru vodilnih muzejev: spominska knjiga (DigitaltMuseum/Tenement), spomini ob predmetu (skupnostna znanja), za kuliso (Rijksmuseum Night Watch), zbirka v številkah (Met/Tate) — skupaj 32 funkcij (6 sklopov); aplikacija ima zdaj 47 muzejskih komponent, 9 API poti
- Zgodovina #knjiga/#zaKuliso delujeta kot globoke povezave; navigacija: knjiga dodana namizni vrstici, zaKuliso po vzorcu tema/zaOtroke (mobilni meni + domov + noga)
- Tehnična odkritja za znova uporabo: (1) HTTP predpomnilnik GET zakrije invalidacijo po POST → no-store na skupnostnih poizvedbah; (2) globalni DATABASE_URL v peskovniku lahko silently preusmeri prisma db:push izven repa — vedno preveri, katera datoteka se je spremenila; (3) SQLite zapis na Vercelu ni mogoč (bralni /var/task) — pošten 503 z dvojezičnim sporočilom namesto tihe 500; (4) hash sprememba URL ne sproži view spremembe (brano samo ob mount) — za preklop pogleda v testih vedno klikni navigacijski gumb
- Omejitve (dokumentirane v README): prispevki na Vercelu minljivi → trajna objava = prenos v community-content.ts + seed (git kot CMS)
- Odprti issue ostajajo: #2 (placeholder domene), #3 (~20 neuporabljenih odvisnosti), #4 (dimni testi)
- Možni sklop 7 iz raziskave (razvrščeno): spletna mikro-razstava (šablon + 1. razstava), učiteljski kotiček (3 učne ure), kuratorska plošča/razstava obiskovalca (permalink + share-kartica), obarvanke (Color Our Collections), prepiši spomine (transkripcija), pogovor z zbirko (AI vodnik prek z-ai-web-dev-sdk, strežniško)

---
Task ID: 13
Agent: Main agent (Z.ai Code)
Task: Tehnični dolgovi — issue #2 (placeholder domene) in issue #3 (neuporabljene odvisnosti)

Work Log:
- Osvežen kontekst: worklog (naloge 1–12), git (main 36fcc3c), GitHub API z novim žetonom (ghp_Rfpn…), Vercel API (produkcija READY na 36fcc3c; griblje-museum.vercel.app domov 200)
- Stanje od povzetka boljše od pričakovanega: PR #1–#12 vsi spojeni, 32 funkcij v 6 sklopih
- Issue #2 (veja fix/issue-2-channels, PR #13, squash e0c30de):
  - nova skupna konstanta SITE_URL v src/lib/site.ts (env NEXT_PUBLIC_SITE_URL, privzeto produkcijska domena) — uporabljena v sitemap.ts, robots.ts, layout.tsx (metadataBase) in about-view.tsx (primer curl); sitemap/robots sta bila na produkciji že pravilna (prejšnji popravek), zdaj imajo vsa mesta en izvor
  - zgodbe: gumb »Prijavi pričevanje« ne odpira več neveljavnega mailto (ne-ASCII lokalni del pričevanja@ + domena brez TLD); zdaj vodi v spominsko knjigo (#knjiga) — delujoči kanal; dodan ključ stories.callVia (SLO+EN) s pošteno opombo, da bo e-poštni naslov objavljen po ureditvi nabiralnice
- Issue #3 (veja chore/issue-3-unused-deps, PR #14, squash 50cb64a):
  - transivitna analiza uvozov: muzejska koda uporablja 15 ui komponent; preverjene tudi notranje odvisnosti (command→dialog) in hooki (use-toast→toaster, use-mobile→sidebar)
  - izbrisanih 33 neuporabljenih ui komponent + use-toast.ts + use-mobile.ts
  - package.json −40 paketov (dnd-kit, mdxeditor, next-auth, next-intl, zustand, recharts, react-hook-form, react-markdown, react-syntax-highlighter, uuid, date-fns, vaul, input-otp, embla, react-day-picker, react-resizable-panels, @reactuses/core, @tanstack/react-table, sonner, 19 radix primitivov)
  - globals.css: sidebar žetoni odstranjeni; chart-* ostanejo (uporablja evidence-badge)
  - bun install −40; tsc 0; eslint 0
- Verifikacija (agent-browser, :3000): Zgodbe → Prijavi pričevanje → #knjiga »Spominska knjiga«; O muzeju → pre kaže pravi produkcijski URL; 0 napak strani; 0 konzolnih napak; vsi API 200 (home, exhibits, search, iiif, guestbook, sitemap, robots)
- Issue #2 in #3 ročno zaprta s komentarji (GitHub ne prepozna slovenskega »Zapira« kot closing keyword)
- Odkritje: strežnik umre med klici Bash → preverjanja združena v ene seje; hash URL sprememba ne preklopi pogleda → vedno klik navigacijskega gumba; find text ne najde gumbov z ikono → find role button --name

Stage Summary:
- main na 50cb64a; odprta samo še issue #4 (dimni testi); 29 odvisnosti namesto 69
- Produkcija čaka na novi Vercel deployment po PR #13/#14

---
Task ID: 14
Agent: Main agent (Z.ai Code)
Task: Sklop 7 — »Pogovor z zbirko«: uzidani AI muzejski vodnik

Work Log:
- Raziskava: spletno iskanje cel čas na 429 (zgornja storitev) → zasnova po dosedanjih raziskavah nalog 5–12 in znanih vzorcih (Met Assistant, DMA Angelica, museum-GPT, V&A ask-a-curator): uzidanost, odkrito »ne vem«, navedki kot povezave na zapise, zasebnost brez računa
- Veja feat/museum-experience-7; 6 novih + 8 spremenjenih datotek:
  1. src/lib/zai.ts: skupni ZAI odjemalec izvlečen iz audio-guide (env ZAI_CONFIG)
  2. src/lib/guide.ts: dosje 20 zapisov iz Prisma baze (naslovi/obdobja/povzetki/zgodbe ≤700 zn/viri/zanesljivost), dvojezičen strog sistemski poziv, parseCites (preverba [[slug]] proti pravi bazi), drseče okno 12/10 min na IP, 1 ponovitev pri 429 (3 s)
  3. POST /api/guide: zod (≤8 sporočil × 400 zn, zadnje = uporabnik), maxDuration 60, CORS *, no-store; zgornji 429 → 429, napake konfiguracije → 503 (vzorec readonly-honesty)
  4. src/lib/guide-limits.ts: odjemalcu-varen modul omejitev (vzorec contribution-limits)
  5. guide-dialog.tsx: dialog (AI značka, odkritna opomba, predlagana vprašanja, typing indikator z mirnimi gestami, navedki-gumbovi → odpiranje zapisa, Enter/Shift+Enter, brisanje, aria-live, abort ob zaprtju) + GuideTeaser za domačo stran
  6. Vstopi: glava (Ctrl/Cmd+G, skrito <sm), mobilni meni, hero CTA, teaser med sprehodi in skupnostjo, globoka povezava ?govor=1; i18n ~40 ključev SLO/EN; README + API tabela + next.config tracing
- Popravki med razvojem: GUIDE_LIMITS ločen iz guide.ts (odjemalec ne sme vleči prisme); preslikava zgornjega 429 v naš 429; počistenje napake ob ponovnem odprtju dialoga; zastareli »14 zapisov« v junaku → 20; število API-jev (10) v O muzeju
- E2E z mock odgovorom (zgornja storitev na 429 — enako prizadene TTS!): Ctrl+G, predlagano vprašanje, odgovor + navedki, klik navedka → zapis letalisce-otok-1944 + URL ?exhibit=, EN popoln, vnos tipkovnica, brisanje, mobilna 375 px brez prekoračitve; tsc 0, eslint 0
- Produkcija po PR #13/#14 preverjena: vsi API 200, robots z pravo domeno, opendata števci 20/56/5/4, zgodbe CTA → #knjiga na produkciji, 0 napak
- PR #15 ustvarjen (ni spojen — čaka živi preizkus LLM po okni storitve)

Stage Summary:
- PR #15: 33. funkcija muzeja — pogovor z zbirko; 10 odprtih API poti
- Zasnova uzidanosti: dosje kot edini vir resnice, navedki preverjeni proti bazi, muzej ne izmišljuje zgodovine (skladno z etosom iskrenosti)
- Odkritje: strežnik peskovnika umre tudi MED dolgim ukazom (spanje) → vsa preverjanja strežnika v eni seji, brez dolgih spanj
- Odkritje: z-ai storitev ima globalno omejitev na račun (klepet + TTS + iskanje hkrati 429, >2 h) — živa preverba LLM odložena; UI preverjena z mockom identične oblike

---
Task ID: 15
Agent: Main agent (Z.ai Code)
Task: Spojitev in produkcijska verifikacija sklopa 7 + zaključek seje

Work Log:
- PR #15 spojen (squash b2e4a3b); Vercel produkcija READY na b2e4a3b
- Produkcija verificirana (griblje-museum.vercel.app): domov 200; /api/guide brez ZAI_CONFIG → odkrit 503 guide-unavailable (dokumentirano, enako kot TTS); prazno telo → 400; Ctrl+G odpre dialog z vsemi nizi; hero CTA »Vprašaj vodnika« + teaser prisotna; glava: Pogovor z zbirko (Ctrl+G) med gumbi; mobilni meni vsebuje vnos; 375 px brez prekoračitve; 0 napak strani
- Živi preizkus LLM: 20+ poskusov v 3 urah (lokalno + CLI) — zgornja storitev z-ai ves čas 429 (klepet + TTS + spletno iskanje skupaj) → živi odgovor ni bil mogoč; UI pot preverjena z mockom identične oblike; preizkus ponoviti, ko kvota poteče
- Stanje skladišča: main b2e4a3b; odprta samo še issue #4 (dimni testi — lastnik); PR #1–#15 vsi spojeni

Stage Summary:
- Produkcija: 33 funkcij (7 sklopov), 10 API poti, 69 → 29 odvisnosti, 15 shadcn komponent
- Muzej vasi Griblje ima zdaj: zbirko, sprehode, šole, igre, dostopnostno ploščo, skupnost (knjiga + spomini + za kuliso), statistiko in uzidanega AI vodnika
- Priporočila lastniku: (1) nastaviti ZAI_CONFIG env na Vercelu (odpre TTS + vodnika), (2) živi preizkus vodnika po okni kvote, (3) issue #4 po želji, (4) rotacija žetonov (GitHub + Vercel)

---
Task ID: 16-c
Agent: research-subagent
Task: Analiza standardov globine vsebine iz raziskovalnega korpusa

Work Log:
- Podana pot korpusa /home/z/my-project/research/13a NE obstaja; korpus (146 datotek) lociran na /tmp/my-project/research/13a (+ varnostna kopija /tmp/research-backup/13a) — preverjeno tudi z iskanjem po obeh git repozitorijih (korpus ni v zgodovini)
- Prebral worklog.md (naloge 1–15: 33 funkcij, 7 sklopov; zapis = povzetek + zgodba ≤700 zn + viri + evidenceStatus; ObjectBiography 3–6 faz; 56 virov na 20 zapisov ≈ 2,8/zapis)
- Celoten korpus pretvoril v golo besedilo (/tmp/13a_text, 140 datotek: p*.json = shranjene strani, s*.json = rezultati iskanja, *.html/*.txt = strani in clanki) — s pandoc + python regex, nato ciljno grep/iskanje
- Globje prebral ključne vire: rijks_pr_collection_online.html, rijks_about_collection_online.html, mn_inside-the-infinite-rijksmuseum (p32), p02_q42.json (Q42 Heritage and AI), p31_tanp.json (The Art Newspaper), p06_mn_conv.json (London Transport Museum AI Digital Poster), gac_smithsonian_women.html, p10_msk.json, p20_vvchat.json, p05_gaile/p07_ncs, s48_smg, s54_nhm2, s05_digitaltmuseum, s04_nasjonal, sitemapi (rijks_sitemap1.xml: provenance research sekcije)
- Preveril interpretativne standarde: Serrell/Falk/Dierking v korpusu NISO zastopani (samo oznaka "Beverly Serrell" na blogu Orselli p21) — 50–60-besedna etiketa in večplastno načelo sem utemeljil s strokovnim znanjem, kar naloga izrecno dovoljuje
- Sintetiziral referenčni standard globine za digitalni muzej Griblje (4 plasti: etiketa 50–60 besed → zgodba 250–400 besed → življenje predmeta 4–6 faz → povezave/viri) in ga poročal brez sprememb kode

Stage Summary:
- Korpus je iz raziskave AI vodnikov, zato globino potrjuje s 4 vzorci: (1) Rijksmuseum Collection Online — 800.000 del + 500.000 knjig + 800 m arhivov + raziskave Operation Night Watch v ENI integracijski plasti, "zoom-out" (predmet→oseba→tema→zgodba), samodejne node strani, AI le kot inspiracija, zanesljivo jedro iz Linked Data; (2) London Transport Museum — baza znanja AI vodnika iz 5 vrst kuratorskih virov (zbirka, zgodovina postaj, razstava, etiketa, spletne zgodbe), "LLM za jezik, ne za znanje"; (3) Smithsonian/NHM — globina = rudarjenje metapodatkov (16,9M zapisov; 4,93M digitaliziranih → 1.407 objav); (4) DigitaltMuseum — kraj → ljudje → dogodki → predmeti, "Siter dette objektet"
- Referenčni minimalni standard za 1 zapis Griblje: etiketa 50–60 besed + zgodba 250–400 besed + časovnica 4–6 faz (vrzeli pošteno) + 4–6 virov (cilj vs. današnjih ~2,8) + 2–4 povezave + evidenceStatus; SLO+EN za prvi plasti
- Odkritje za nadaljevanje: korpus živi v /tmp (minljiv!) — priporočam prenos v repozitorij ali trajno lokacijo

---
Task ID: 16
Agent: Main agent (Z.ai Code)
Task: Raziskava globine vsebine + prvi sklop poglabljanja (uporabnikovo vprašanje: "kje manjka globina, kaj misliš?")

Work Log:
- Peskovnik je bil ponastavljen (izgubljena lokalna koda) → obnovitev: remote + git reset --hard origin/main (b2e4a3b), bun install, worklog združen iz varnostne kopije (naloge 13–15), dev strežnik zagnan; research/13a korpus (146 datotek) je preživel
- Kvantitativni audit globine: 20 zapisov povprečno 112 besed zgodbe (vse < 220), 2,8 virov/zapis, 9/20 z ≤2 viroma; pripovedi 4 × ~80 besed, 0 oseb; edini imenovani človek: Niko Županič
- Raziskovalni podagent (16-c) je iz korpusa izluščil standard globine: etiketa 50–60 besed → zgodba 250–400 besed → življenjepis 4–6 faz → 4–6 virov; globina krajšega muzeja = gostota povezav kraj → ljudje → dogodki → predmeti (DigitaltMuseum); z-ai spletno iskanje ves čas 429 (računska kvota)
- Mnenje uporabniku: širina svetovni razred (33 funkcij), vsebina nivoja etiket; prednost poglabljanje obstoječih pred novimi temami; manjkajoči sklopi: ljudje/šola/izseljenstvo/ženske/vsakdan 20. stol.
- Implementacija 1 — dosje AI vodnika (src/lib/guide.ts): STORY_MAX_CHARS 700 → 2000, dosje PO JEZIKU (nosilci zmanjšani za polovico, boljša uziditev), vključena življenjepisa predmetov (OBJECT_BIOGRAPHIES) in enominutne zgodbe; getDossier(lang) s predpomnilnikom po jeziku
- Implementacija 2 — 6 najtanjših zapisov poglobljenih (259–293 besed, SLO+EN): ribnik (kraška voda, božični krap, drsanje), meja-1991 (plasti meje: deželna → upravna → republiška → državna → schengenska), sveti-vid (štirinajst pomočnikov, zvoni kot ura vasi, pokopališče kot arhiv rodbin), malenca (vodna tehnika, kopališče), storklje (selitvena pot čez Bosporex, Natura 2000, DOPPS popisi), tkalstvo (celoten krog lana, ženska zgodovina, šiviljstvo)
- 12 novih preverljivih virov (56 → 68): Wikipedija (Bela krajina, Kolpa, sveti Vid, bela štorklja, lan, Slovenia–Croatia border), Commons kategorija Griblje, Evropska komisija Schengen, DOPPS ptice.si, SEM etno-muzej.si, Radio Odeon (malenca), Krajinski park Kolpa (ribnik)
- Popravki okolja po ponastavitvi: tsconfig + eslint izločata skills/examples/mini-services (nove predloge peskovnika), sicer 26 tujih lint napak
- Ponovno sejanje baze (bun run prisma/seed.ts); zapisi z ≤2 viri: 9 → 3; povprečje 112 → 171 besed
- Verifikacija: tsc 0; eslint 0; agent-browser — dialog ribnika izriše vseh 6 odstavkov nove zgodbe + 3 vire; tkalstvo (programsko urejan) izriše pravilno; Ctrl+G odpre vodnikov dialog; POST /api/guide → odkrit 429 (zgornja kvota, dosje se sestane brez napak); mobilni 375 px brez prekoračitve; 0 napak strani/konzole
- Odkritje: kitajski script je vpisal prave prelome vrstic namesto \n → popravljen escape; regex [^"]+ se ustavi ob ubeženem narekovaju (\") — pri programskih zamenjavah JS nizov uporabljaj poznejši zaključek

Stage Summary:
- Prvi sklop programa poglabljanja: 6 zapisov na standard, dosje vodnika 3× globlejši (po jeziku), viri 56 → 68
- Standard zapisa (iz raziskave): etiketa → zgodba 250–400 besed → življenjepis → 4–6 virov; uresničeno pri 6 najtanjših
- Naslednji koraki poglabljanja: (1) preostalih 14 zapisov na standard, (2) novi zapisi manjkajočih sklopov (šola, izseljenstvo, oranje/Filak, ženske, vsakdan 20. stol.), (3) prepis pripovedi iz meta-uradnih v človeške, (4) živi preizkus vodnika po okni kvote

---
Task ID: 18
Agent: Main agent (Z.ai Code)
Task: Sinhronizacija README + 3. sklop poglabljanja — manjkajoči ljudje (Filak, izseljenstvo)

Work Log:
- GitHub/README sinhronizacija po PR #17: README PR #18 (squash 55b5c40) — nov razdelek »Vsebina z globino« s tabelo standarda, db:seed 81 virov, dosje 3000 znakov; Vercel READY
- 3. sklop po mnenju iz naloge 16 (manjkajoči sklopi: ljudje, izseljenstvo): novi zapisi anton-filak in izseljenstvo
- Sliki poiskani prek Wikimedia Commons API (neodvisno od z-ai kvote): Oranje s konjsko vprego (Fran Vesel, javna last) + Emigranten in de Montevideostraat (Eugeen Van Mieghem, 1899, javna last — izseljenci pred pisarnami Red Star Line v Antwerpnu, prav ta pot slovenskega izseljstva); licenci in avtorja preverjena v extmetadata, preneseni v public/images/authentic/
- Vsi novi viri preverjeni s HTTP HEAD (200): sl Wikipedija Griblje/Ameriški Slovenci, en Wikipedija Slovene diaspora/Red Star Line, worldploughing.org (redstarline.org ne obstaja → zamenjan za Wikipedijo)
- anton-filak (gospodarstvo, CORROBORATED, 4 viri): oranje kot vrhunec kmečkega znanja (jerina, brazda kot ugled), svetovna prvenstva od 1953 (klasično/reverzibilno, točkovanje), 8 Filakovih udeležb po javnem viru, leta/uvrstitve = odkrita vrzel TO_COLLECT; zgodba 302 besede SLO / 318 EN
- izseljenstvo (kraj, TRADITION, 5 virov): vali 1880→danes (ZDA prek Trsta/Antwerpna, Argentina, Avstralija, zimski delavci), mandati in hiše, Županič kot most; imena rodov TO_COLLECT; zgodba 281 besed SLO / 302 EN
- Biografiji (4 + 5 faz s TO_COLLECT zaključki) + enominutni zgodbi vstavljeni v object-biographies.ts / minute-stories.ts
- Vstavljanje prek skriptov (insert-exhibits.ts/insert-bio-minute.ts) — napaka: podpičje namesto vejice v objektnem literalu; slovenski popravki (zorjugo→orjejo po zorjah, roken→rok, posnetka→fotografija)
- Reseed + verifikacija: tsc 0, eslint 0; API 22 zapisov / 90 virov; IIIF 22 canvasov; iskanje najde oba; dialogi: zgodba, 4/5 virov, biografija 4 postaje; sliki se naložita; mobilni 375 px brez prekoračitve; produkcija READY (f391de8): 22/90, obe sliki 200, izseljenstvo dialog na produkciji (Red Star Line, mandati, 5 virov)
- Živi preizkus vodnika: z-ai še vedno 429 (računska kvota, >4 h) — lokalni /api/guide pravilno vrne 429 rate-limited
- PR #19 spojen (squash f391de8); README tabela globine 22/22, 90 virov, PR #19 dodan v program

Stage Summary:
- Zbirka: 22 zapisov (odprt 3. sklop »manjkajoči ljudje«), 90 virov (povprečno 4,1), povprečna zgodba 276 besed
- Produkcija: https://griblje-museum.vercel.app na f391de8; PR #16–#19 vsi spojeni
- Ključna odločitev: novi zapisi samo z avtentičnimi, licenčno preverjenimi slikami (Commons API) in s plastmi TO_COLLECT namesto domnev — muzejska iskrenost
- Ostalo od programa poglabljanja: (1) prepis 4 pripovedi v človeške glase, (2) živi preizkus vodnika po okni z-ai kvote, (3) morebitni novi zapisi (šola, ženske) po novih virih

---
Task ID: 19
Agent: Main agent (Z.ai Code)
Task: 4. sklop poglabljanja — pripovedi v človeških glasih + higiena skladišča

Work Log:
- Stanje ob nadaljevanju: PR #16–#20 spojeni (main 0898247; 22 zapisov, 90 virov, povprečno 276 besed); odkrit in odstranjen nesrečen lokalni commit 83a6b03 (1075 datotek predloge skills/ s UUID-sporočilom — NE bil potisnjen; git reset na origin/main, delovno kopija ohranjena)
- Higiena: /skills/ dodan v .gitignore (vrstica /skills/.zscripts/dev.pid je bila neveljavna vzorca — tako je git add . lahko ujel celotno predlogo)
- Kvota z-ai ob preveritvi ŠE VEDNO 429 (klepet prek SDK takoj zavrnjen) — živi preizkus vodnika ostaja odložen
- 4. sklop programa poglabljanja (razdelek Zgodbe, prej 2 pripovedi × ~90 besed):
  1. „Zadnji poleti marca 1945" prepisana v človeški glas (319 besed SLO / 383 EN): prizor poljane, zračni most od Otoka septembra 1944 (1.473 ranjencev, 87 letalcev), zadnji vzleti s Krasinca, dve fotografiji posneti prav pri Gribljah (prva: Franjo Veselko 1905–1977, javna last), Dakota + Vranov let danes; iskren poziv za imena
  2. „Reka, ki ločuje in spaja" prepisana (256/305): skupni mlin/malenca/poroke čez reko, 1991 spremenila se teža črte, 2015 ograja (Hythlodot), 2023 schengen; „najstarejša meja tu ni kamen. Je voda."
  3. NOVA „Mlinščina — vaška borza in telefon" (296/351, DOCUMENTED): vrsta vozov kot kronika leta, žimaln, mirovník/tekač, mlinščina kot plačilo + zaupanje, urbarji (Dol, Radenci, Pobrežje, Krasinec), arheologija Lahinje 14. stol., malenca kot zaključek
  4. NOVA „Žensko leto — od lana do platna" (300/352, TRADITION): dva koledarja vasi, lan od setve do predenja, platno kot denar/dota, prehod v šiviljstvo; fotografija Frana Vesela 1920 kot dokument; poziv za statve in imena gazdaric
- Vsa dejstva pripovedi izvirajo iz že dokumentiranih zapisov zbirke (letališče, meja, mlini, tkalstvo) — brez izmišljenih imen; NACELO in RAZPIS ostajata institucionalna
- Reseed (db/custom.db): 6 zgodb v bazi (4 ZGODBA + NACELO + RAZPIS), vse pripovedi 256–383 besed
- Okoljske težave in rešitve: zastareli SQLite ročaj po reseedu → restart dev; API cache max-age=60; peskovnik ubija strežnik med dolgimi spanji/med klici → zagon z (setsid nohup bun run dev >> dev.log 2>&1 < /dev/null &) vztraja čez klice; „exec: next: not found" v čistem bash kontekstu (next ni na PATH)
- Verifikacija: tsc 0; eslint 0; /api/stories = 6 zapisov; agent-browser: Zgodbe izrišejo vseh 6 naslovov, kartica Mlinščine s polnim besedilom + oznako „dokumentirano", EN preklop pravilen (exchange and telephone), mobilna 375 px brez prekoračitve, 0 napak strani, konzola čista (samo DevTools info + HMR)
- README: razdelek Zgodbe prepisan (štiri pripovedi v človeških glasih), program poglabljanja + PR #21, db:seed 6 zgodb

Stage Summary:
- Razdekel Zgodbe na standard globine: 4 pripovedi × 256–383 besed (SLO+EN) namesto 2 × ~90; ženska zgodovina Bele krajine sedaj ima svojo pripoved
- Higiena skladišča: /skills/ trajno ignoriran, nesrečen commit odstranjen pred pushem
- Ostalo programa: (1) živi preizkus vodnika po okni z-ai kvote, (2) morebitni novi zapisi (šola) po novih virih, (3) production deploy PR #21

---
Task ID: 20
Agent: Main agent (Z.ai Code)
Task: 5. sklop poglabljanja — nov zapis „Vaška šola" (manjkajoča tema šolstva)

Work Log:
- Nadaljevanje po PR #21: zadnja manjkajoča tema iz analize naloge 16 je šolstvo; kvota z-ai ob preveritvi še vedno 429 (živi preizkus vodnika še odložen)
- Iskanje slike po Wikimediji Commons (API): več poizkusov (šola Bela krajina, vaška šola, ljudska šola, razred) → dva kandidata: žanrska slika „Vaška šola (19. st.)" (Narodni muzej Slovenije, javna last, 274×375 px — premajhna za glavno sliko) in fotografija stavbe partizanske gimnazije v Črnomlju (4608×3456, CC BY 4.0, avtor Bb63lj, 2024 — danes glasbena šola)
- Odločitev: glavna slika = stavba v Črnomlju (krajevno avtentična priča partizanske gimnazije; opomba na zapisu izrecno povede, da stavba ni v Gribljah), žanrska slika NMS pa kot primerjalni vir
- Prenos slike: prvi poskus zavrnjen (robot policy — zahteva opisljiv User-Agent); prenos z UA „GribljeMuseum/1.0 (URL; contact)" uspešen (7,7 MB) → pomanjšanje na 1600×1200, 385 KB (PIL)
- Vsi novi viri preverjeni z HTTP HEAD (200): de.wikipedia Reichsvolksschulgesetz, sl.wikipedia Črnomelj, nms.si, obe datoteki Commons; sl.wikipedia „Zgodovina šolstva na Slovenskem" (404) in en.wikipedia „Education in Austria-Hungary" (404) zavržena
- Nov zapis vaska-sola (kraj, TRADITION, 5 virov): 1869 Reichsvolksschulgesetz (obvezno šolstvo 6–14), vsakdan vaške šole (tablica/kreda/abecednik, prazne klopi ob žetvi), branje kot vaška pošta (mandati iz Amerike), poti iz šole (Županič, Filak — povezave na obstoječe zapise), partizanska gimnazija v Črnomlju po italijanski kapitulaciji 1943, iskren poziv za razredne fotografije; zgodba 300 besed SLO / 343 EN
- Biografija 5 faz (do 1869 TRADITION → 1869 zakon DOCUMENTED → 1870–1914 vsakdan s sliko NMS DOCUMENTED → 1943–1945 gimnazija DOCUMENTED → po 1945 TO_COLLECT) + enominutna zgodba
- Popravek zastarelega hero besedila v i18n: „Dvajset zapisov" → „Triindvajset zapisi" / „Twenty records" → „Twenty-three records" ( odkrito pri verifikaciji; hero je zaostal za dvema sklopoma)
- Reseed: 23 zapisov, 95 virov (90 + 5)
- Verifikacija: tsc 0; eslint 0; /api/exhibits 23/95; IIIF 23 canvasov; iskanje „tablica" → vaska-sola (matchedIn storySi); slika 200 (385 KB); agent-browser: dialog ?exhibit=vaska-sola izriše naslov, zakon, gimnazijo, Filaka, Županiča, biografijo, NMS med viri, sliko (768×576), odkrite vrzeli („še išče"); EN preklop (izveden pred odprtjem dialoga — stikalo v glavi med odprtim dialogom ni dosegljivo, obstoječe vedenje): title/gimnazija/Filak/slate ✓; mobilna 375 px brez prekoračitve; 0 napak strani/konzole
- README: tabela globine 23/23 + 95 virov + povprečno 278 besed, PR #22 v programu, Zbirka 23 zapisov, Muzej v minuti 23, db:seed 23/95, razdelek licenc dopolnjen (Van Mieghem, NMS, CC BY 4.0 avtorji Bb63lj/Hythlodot/švabo)

Stage Summary:
- Zbirka: 23 zapisov / 95 virov; vseh 6 tematskih sklopov pokritih, manjkajoča tema šolstva zaprta s častnimi vrzeli namesto domnev
- Odkritje: hero števci so ročni v i18n — ob vsakem novem zapisu jih je treba uskladiti (prihodnje serije: preveri „Dvajset/Twenty" vzorce)
- Odkritje: upload.wikimedia.org zavrže splošne bota podobne UA — vedno opisni UA z kontaktom
- Ostalo programa: (1) živi preizkus vodnika po okni z-ai kvote, (2) PR #22 + produkcija, (3) morebitni novi zapisi (vsakdan 20. stol.) po novih virih

---
Task ID: 21
Agent: Main agent (Z.ai Code)
Task: HuggingFace Inference Providers kot alternativni (brezplačni) ponudnik za AI vodnika — odgovor na uporabnikovo vprašanje o HF API ključu in naravni slovenščini

Work Log:
- Uporabnik vprašal, ali lahko priskrbi svoj HuggingFace API ključ, da vodnik uporablja brezplačne modele in govori naravno slovensko (ne robotsko/angleško) — odgovor: da; pripravljena vsa koda, ključ še čaka
- Nov modul src/lib/hf-llm.ts: OpenAI-kompatibilen odjemalec za router.huggingface.co/v1; veriga nadomestnih modelov (Llama 3.3 70B → Qwen 2.5 72B → Mistral NeMo → Llama 3.1 8B, izrecna izbira prek HF_MODEL); lepljivi model (zadnji uspešni gre prvi); skupni časovni proračun 50 s (pot ima maxDuration 60); razvrščanje napak: 401/403 takoj navzgor (slab žeton), 404/429/503 → naslednji model
- src/lib/guide.ts askGuide prestrukturiran: če je nastavljen HF_API_KEY/HUGGINGFACE_API_KEY, najprej HF (sistemski poziv v standardni vlogi „system"), ob neuspehu console.warn + obstoječa z-ai pot (429 retry) kot rezerva; brez ključa obnašanje popolnoma nespremenjeno
- Sistemski poziv okrepil z novim pravilom 8 (SL+EN): živa, domača slovenščina kot človek-krajevan, nikoli preklop v angleščino, brez robotskih uvodov („Kot umetna inteligenca …") in brez prevodniških fraz
- Ustvarjen .env.local s komentarji in praznim HF_API_KEY (datoteka .env* je v .gitignore — ključ nikoli v git; .gitignore preverjen vrstica 34)
- Verifikacija: tsc --noEmit 0 napak; eslint 0 napak; POST /api/guide brez ključa → 429 rate-limited (z-ai kvota še vedno izčrpana, iskrena napaka kot prej); dev.log brez novih napak, spremenjena pot guide.ts se normalno izvede
- Naslednji korak, ko uporabnik prilepi žeton: vstaviti v .env.local, preizkusiti /api/guide (pričakovano: slovenski odgovor + navedki [[slug]]), nastaviti env var na Vercelu prek API (projectId prj_hSWh05Dt1zNyzuiIqB3onUIVfd7E) + redeploy, živi preizkus na produkciji

Stage Summary:
- Ponudniška arhitektura vodnika je zdaj dvojna: HF (brezplačni, uporabnikov žeton) → z-ai (kvotirani) — odpravlja odvisnost od z-ai kvote
- Ključ varno vložen: strežnik-only env (HF_API_KEY ali HUGGINGFACE_API_KEY), brskalnik nikoli ne vidi žetona
- Slovenščina podvojeno zagotovljena: veriga najmočnejših večjezikovnih odprtih modelov + novo pravilo 8 o naravnem, ne-robotskem, izključno slovenskem glasu
- Ostalo programa: PR #22 + produkcija, issue #3 (neuporabljene odvisnosti), vstavljanje žetona po prispetju

---
Task ID: 22
Agent: Main agent (Z.ai Code)
Task: Govor (TTS) po vzoru pogovora — veriga ponudnikov ElevenLabs → z-ai → glas naprave; odgovor na uporabnikovo vprašanje „kaj predlagaš za govor" + novi GitHub žeton

Work Log:
- Uporabnik priskrbel NOVI GitHub žeton (ghp_c7Q…, prejšnji zamenjan) — preverjen: GET /user = markec12345678, dostop do repa 200; HF žeton za pogovor še vedno čaka (razložena razlika: GitHub ≠ HuggingFace)
- Nov modul src/lib/tts.ts: sinteza govora z verigo ElevenLabs (ELEVENLABS_API_KEY, model eleven_multilingual_v2, privzeti glas Antoni, mp3_44100_128, timeout 40 s) → z-ai (obstoječa pot tongtong/jam wav); neuspeh ElevenLabs se zabeleži in padne na z-ai
- Pot /api/audio-guide: uporabi synthesizeSpeech; Content-Type dinamičen (mp3/wav); nova omejitev SAMO hladnih sintez na IP (30/5 min — predvajanje iz predpomnilnika neomejeno, varčevanje z mesečnim kreditom); ob padcu obeh ponudnikov odkrit 503 {error:"tts-unavailable"} namesto globoke 500
- Nov modul src/lib/browser-speech.ts: brskalniška rezerva (Web Speech API) — čakanje na asinhrono nalaganje glasov (voiceschanged, timeout 1,5 s), izbor najboljšega slovenskega/angleškega glava (prednost krajevnih: Vesna/Lado/Čeda/Google), deljenje besedila na odseke ≤ 200 znakov (obrada znanega Chrome poreza ~15 s), ročica {cancel, pause, resume}
- Vsi trije predvajalniki dobili rezervo: AudioGuide (celoten vodnik + minute), MinutePlayer (Muzej v minuti), FilmView (Moja galerija — vključno s pavzo/nadaljevanjem govora); ob napaki strežnika samodejno prebere pripoved z glasom naprave in iskreno obvesti (nov i18n ključ t.audio.deviceVoice SL+EN)
- .env.local razširjen z ELEVENLABS_API_KEY + ELEVENLABS_VOICE_SL/EN navodili (gitignore .env* preverjen — ključi nikoli v skladišče)
- README: razdelek „Namestitev na Vercel" preoblikovan v „Umetna inteligenca (pogovor + govor)" — celotna veriga HF → ElevenLabs → ZAI → glas naprave dokumentirana
- Verifikacija: tsc 0 napak; eslint 0 napak; GET /api/audio-guide (z-ai 429) → 503 tts-unavailable v 252 ms; agent-browser: klik „Poslušaj · 1 min" → 503 → rezerva se sproži → brezglavi brskalnik nima glasov (voices: 0) → poštena napaka brez sesutja; enako v dialogu zapisa („Poslušaj avdio vodnik"); 0 napak konzole/strani
- Priporočilo uporabniku za govor: (1) takoj — glas naprave (že vgrajen, neomejen, 0 €), (2) najboljša kakovost — ElevenLabs brezplačni račun (~10 min/mes, brez kartice), (3) ob veliki rabi — Google Cloud TTS (1 M znakov/mes) ali Azure (0,5 M), a zahtevata kartico

Stage Summary:
- Avdio vodnik ima trojno varnost: ElevenLabs (dokumentarna slovenščina) → z-ai (kvota) → glas naprave obiskovalca (Web Speech API) — muzej govori tudi z izčrpanimi vsemi kvotami in brez ključev
- Kvota ElevenLabs se varčuje trojno: pomnilniški predpomnilnik + brskalniški predpomnilnik (max-age=86400) + omejitev hladnih sintez na IP
- Objavljeno: PR #23 squash merged → main = a7c27e7 (HF pogovor + veriga govora + README); žeton v git remote zamenjan na novi; Vercel produkcija READY: domača 200, 23 zapisov/95 virov, /api/audio-guide odkrit 503, agent-browser preizkus rezerve na produkciji brez sesutij
- Ostalo programa: vstavitev HF_API_KEY + ELEVENLABS_API_KEY (uporabnik) → živi preizkus pogovora in govora, issue #3 (neuporabljene odvisnosti)

---
Task ID: 24
Agent: Main agent (Z.ai Code)
Task: Analiza stanja proti norveškemu DigitaltMuseum standardu + iskanje novih podatkov o Gribljah (uporabnik: „analiziraj kje smo po nagrajenem norveškem muzeju kaj nam manjka in isci podatke se o gribljah kaj se nisi nasel")

Work Log:
- Kontekst: research/13a korpus ni preživel ponastavitve peskovnika → standard rekonstruiran iz dnevnikov (naloga 16: etiketa 50–60 b → zgodba 250–400 b → biografija 4–6 faz → 4–6 virov; globina = gostota povezav kraj→ljudje→dogodki→predmeti)
- z-ai iskanje še vedno 429 → raziskava s curl + agent-browser po domačih virih (Wikipedia SL/EN, Wikidata, Kamra, Commons API); Bing/DDG/Mojeek blokirajo avtomatizirane poizvedbe
- Audit zbirke: 23 zapisov / 95 virov / 6 sklopov; popis vseh 95 virov (duplikatov Griblje-specifičnih ni — večina virov je tematsko regionalna, ne vaška)
- NAJDBA 1 (Kamra, Knjižnica Črnomelj — zbirka „Spominska obeležja v občini Črnomelj", 2018): spomenik padlim partizanom in žrtvam NOB vasi Griblje — 11 padlih v boju + 2 žrtvi fašističnega nasilja = 13 vaščanov; odkril Krajevni odbor Zveze borcev Griblje 10. 9. 1961; stoji pred podružnično šolo OŠ Loka; EŠD 19326 (URL preverjen 200)
- NAJDBA 2 (Kamra, ista zbirka): napad na italijanske mejne policiste — 6. 9. 1941 (sredi italijanske okupacije) štirje borci belokranjske partizanske skupine iz taborišča na Židovcu na cesti Črnomelj–Griblje iz zasede napadli patruljo, ki je iz Črnomlja peljala hrano in strelivo za POSTOJANKO v Gribljah; 2 ubita + 1 od 3 ranjenih naknadno umrl; spominski kamen postavljen 24. 7. 1960, načrt kipar JAKOB SAVINŠEK; EŠD 19324 (URL 200) — to je najstarejša dokumentirana vojna zgodba Gribelj: prvi odpor že 1941, naša vojna zgodba se je začela šele 1944!
- NAJDBA 3 (EN Wikipedia, viri: Snoj 2009 + Ministrstvo za kulturo): prvi pisni omembi vasi starejši od naših — Griblach 1468, Briglach 1490, Griblah 1593; nemško Grüble (Leksikon občin 1906); ETIMOLOGIJA po Snoju (Etimološki slovar slovenskih zemljepisnih imen, 2009, str. 153): izvor negotov — grib (goba, Boletus), griba (gruda), sorodno SH griblja (brazda), griva (travnata strmina) → naše trenutno izročilo „gribljati = brazdati" je le ena od teorij, zapis griblje-vas potrebuje znanstveno dopolnitev
- NAJDBA 4 (EN Wikipedia): cerkev sv. Vida pripada ŽUPNIJI PODZEMELJ (ne Vinica/Dragatuš — matične knjige Gribelj so tam → nova tema „arhiv rodbin"); sedanja stavba iz 18. stol.; EŠD 2122; naselbina na LEVEM bregu Kolpe
- NAJDBA 5 (Wikipedia SL infobox + Wikidata Q2531566): PREBIVALSTVO — 329 (SURS letno, 2026), 334 na popisu 2020 (172 M + 162 Ž); površina 3,45 km²; nadm. višina 153,4 m; poštna št. 8332 Gradac; statistična regija Jugovzhodna Slovenija; Wikidata item ima GeoNames ID 3199569 → viri za nov zapis „Prebivalstvo"
- NAJDBA 6 (Wikipedia SL, telo članka): mikro-zgodovina vasi, ki je nimamo — zaselki DOLNJE Griblje, BRINSKO SELO, SREDNJE Griblje, GORNJE Griblje; brezov gozd izkrčen po 1848 z vprežno živino; GORANJA LOKVA (kal, glina za opeko); RUDNA PEČ (železova prst v plasteh); „Griblje so najbolj suh kraj v Beli krajini, z najmanj padavin na m² na leto"; loki (poplavni travniki), studenci ob Kolpi, erozija bregov po prekinitvi slapov z jezovi
- NAJDBA 7 (Wikipedia SL, bibliografija — nove knjižne reference): Iglič & Kralj-Iglič, „Niko Županič — izbrana dela" (2006); Muršič & Hudelja, „Niko Županič — njegovo delo, čas in prostor" (FF UL, 2009); Zupanič-Kralj, „Niko Županič in njegov boj za identiteto Slovencev" (Rast, 2007); Katarina Zupanič, „Šopek poljskih cvetlic iz Gribelj" (Županičev zbornik, 1939); Bezek-Jakše, „S plugom bi lahko doktoriral" (DL 42/2000 — PRVI tiskani vir o Filaku, doslej samo worldploughing); „Sv. Vid Griblje — blagoslovitev in posvetitev zvona, spominska knjiga" (Griblje 2008); Vončina, „Domoznanska snov Bele krajine" (Črnomelj 1941 — domoznanski rokopis); Valvasor, Die Ehre des Hertzogthums Crain (1689); Priročni krajevni leksikon (MK, 1997)
- NAJDBA 8 (Commons kategorija Griblje — 10 datotek): 3 še neuporabljene — „Cabin under the Sun" (Uroš Novina, CC BY 2.0, 2019, 7850×4509 — zimskaDRVSC kabina ob zamrznjenem ribniku), „Pond Griblje" (Alanorlic, CC BY-SA 4.0, aerofoto 18104×6820!), „Bela krajina Kolpa" (Andrejj, CC BY-SA 3.0, 2005); Gasparijevih/Vavpotičevih slik vasi na Commonsu ni (so v Županičevi zapuščini/SEM → TO_COLLECT)
- Analiza vrzeli po DigitaltMuseum: (1) ni zapisa o registrirani kulturni dediščini vasi — 3 enote EŠD (2122, 19324, 19326) niso nikjer; (2) ni demografskega zapisa (prebivalstvo skozi čas — norveški standard ima strukturirane statistike); (3) ni authority/persistent-ID povezav (Wikidata sameAs — Norvežani uporabljajo UPI/freg); (4) ni kartografskega pogleda zbirke (kartsøk) — koordinate v bazi so, zemljevida ni; (5) zgodovinske fotografije vasi manjkajo (samo 1944/45 in sodobne; Gaspari/Vavpotič TO_COLLECT); (6) obdobje 1941–1943 (italijanska okupacija, postojanka v vasi) povsem manjka — vojna zgodovina se začne šele 1944; (7) etimologija enostranska (Snoj manjka); (8) župnijska pripadnost (arhiv rodbin) neznana v zbirki
- Preverjanje virov: Kamra (3 člene + zbirko) 200, Wikidata Q2531566 200, EN Wikipedia 200, slovenska-biografija.si 200; pxweb.stat.si s peskovnika počasen/503 → SURS podatek preverjen posredno (Wikipedia citira 05C5003S)
- Ker uporabnik ni naročil implementacije: najdbe + analiza dostavljene kot poročilo; predlog 6. sklopa „Pričevalci v kamnu" (spomenika 19324/19326 + 1941 zgodba + prebivalstvo + etimologija po Snoju + župnija Podzemelj + zimski/aerofoto sliki) čaka na potrditev

Stage Summary:
- Iskanje je obrodilo 8 sklopov novih, preverljivih podatkov — najpomembnejši: dva registrirana spominska obeležji (EŠD 19324 + 19326) z zgodbo 1941 (postojanka italijanske mejne policije v vasi, zaseda 6. 9. 1941, načrt Jakoba Savinška), prva omemba vasi 1468 (ne 1526!), Snojeva etimologija, župnija Podzemelj, prebivalstvo 329/334, 3 nove proste fotografije
- Analiza: po norveškem DigitaltMuseum standardu muzeju manjka 8 vrzeli — 3 vsebinske (1941–43, dediščina EŠD, demografija), 2 strukturni (Wikidata sameAs, zemljevid zbirke), 2 vsebinsko-dokumentacijski (etimologija, župnija/arhiv rodbin), 1 vizualna (zgodovinske fotografije)
- Predlog naslednjega sklopa: „Pričevalci v kamnu" (novi zapisi spomenik-padlim + napad-1941, dopolnitve griblje-vas/sveti-vid/vaska-sola, nov zapis prebivalstvo, sliki Cabin under the Sun + Pond Griblje) + tehnični (Wikidata sameAs v JSON-LD, zemljevid zbirke brez API ključa)
- Ostalo programa: ključa HF + ElevenLabs (uporabnik), issue #3, živi preizkus vodnika

---
Task ID: 25
Agent: Main agent (Z.ai Code)
Task: 6. sklop poglabljanja „Pričevalci v kamnu" — izvedba po analizi naloge 24 (uporabnik: „odlicno nadaljjuj")

Work Log:
- Slike (Commons, opisni UA): Parada karabinjerov v Ljubljani 1941 (javna last, 2145×1389 → 1600 px) za zaseda-1941; partizansko obeležje Trebenče (Doremo, CC BY-SA 3.0, → 1400 px) za spomenik-padlim; aerofotografija Pond Griblje (Alanorlic, CC BY-SA 4.0, 18104×6820 → 2000 px) za griblje-v-stevilkah — vse z izrecnimi opombami o ilustrativni naravi, kjer posnetek ni z Gribelj
- 3 novi zapisi v museum-content.ts: (1) zaseda-1941 (vojna, DOCUMENTED, 289 besed) — april 1941 priključitev Ljubljanski pokrajini, postojanka mejne policije v vasi, zaseda 6. 9. 1941 (štirje borci z Židovca, 2+1 mrtvi patrulje), spominski kamen Jakoba Savinška 24. 7. 1960, EŠD 19324; (2) spomenik-padlim (vojna, DOCUMENTED, 259 besed) — 13 žrtev (11 padlih + 2 žrtvi fašizma), odkritje 10. 9. 1961, pred šolo OŠ Loka, EŠD 19326; (3) griblje-v-stevilkah (kraj, DOCUMENTED, 314 besed) — Griblach 1468 → 329 prebivalcev, Snoj, 3,45 km², popis 2020 (334; 172 M + 162 Ž)
- Dopolnitve obstoječih: griblje-vas (perioda 1468 → danes, prvi odstavek preuranjen: Griblach 1468/Briglach 1490/Griblah 1593/Grüble, Snojeve štiri poti etimologije, studenci/loki/Goranja lokva/Rudna peč/brezov gozd 1848, demografska omemba; +2 vira); sveti-vid (nazadnje gradbeni podatki dokumentirani: 1526 listina, 18. stoletje, župnija Podzemelj z matičnimi knjigami, EŠD 2122, zvon 2008; status CORROBORATED → DOCUMENTED; +2 vira); vaska-sola (spomenik pred OŠ Loka + povezava; +1 vir)
- Biografije (4/4/5 faz) + enominutne zgodbe za vseh 3 nove zapise; griblje-vas enominutna zgodba preuranjena (1468, 329)
- Uskladitev števcev in datumov po kodi: hero „Šestindvajset zapisi"/„Twenty-six records"; kicker in timeline „od 1468"/„since 1468"; časovnica era s16 → „15.–17. stoletje"; subtitle „Pet in pol stoletja"; worksheet, theme-hubs, walks (3 mesta), mood-guide ključne besede +1468; muzejska uganka: pravilen odgovor 1468 z razlago razlike 1526 (cerkev)
- Norveški standard — trajni identifikatorji: nov src/lib/wikidata.ts (Q2531566 naselje → griblje-vas + griblje-v-stevilkah, Q18515927 cerkev sv. Vida → sveti-vid, Q211046 Kolpa/Kupa → kolpa-reka); /api/opendata: sameAs po zapisu v dumpu, sameAs muzeja v JSON-LD, razdelek linkedOpenData
- Zemljevid: ugotovitev, da Leaflet/OSM karta (pogled „karta") ŽE OBSTOJA (naloga 24 to ni vedela) — novi zapisi z koordinatami jo samo obogatijo: 11 → 14 točk (+ središče vasi)
- Reseed (bun run prisma/seed.ts) — poanta iz prejšnjih sklopov: po reseedu OBAVEZNO ponovni zagon dev strežnika, sicer strežnik na stalem datotečnem ročaju streže stare podatke (tokrat: baza 26, API 23 → restart → 26)
- Verifikacija: tsc 0 napak; eslint 0 napak; API 26 zapisov/113 virov/14 geolociranih; IIIF 26 canvasov; opendata sameAs (3 zapisi) + linkedOpenData.exhibitsLinked=4; agent-browser: dialog zaseda-1941 (naslov, zgodba, EŠD 19324, viri Kamra/Commons/Ljubljanska pokrajina, citat CC BY-SA), spomenik-padlim (trinajst imen, Trebenče opomba, odkrita vrzel), griblje-v-stevilkah SL+EN (Snoj, Boletus, 334/172/162, 3,45 km²); hero „Šestindvajset zapisi … od 1468"; zemljevid 15 markerjev; slike 200; mobilna 375 px brez prekoračitve; 0 novih napak (hidratacijska opozorila so znana, obstoječa)
- README: tabela globine 26/26 + 113 virov + povprečno 286 besed; PR #24 v program poglabljanja; Zbirka 26; Muzej v minuti 26; db:seed 26/113; zemljevid 14 točk; odprti podatki + sameAs Wikidata

Stage Summary:
- Zbirka: 26 zapisov / 113 virov / povprečno 286 besed; vojna zgodovina vasi se začenja 1941 (ne več 1944); registrirana dediščina EŠD 2122/19324/19326 je v zbirki; demografija + etimologija + župnija dokumentirani; trajni Wikidata sameAs po norveškem vzoru
- Odkritje: Leaflet karta je obstajala že prej (vrzel #4 iz analize 24 je bila napačna) — analize je treba preveriti proti kodi, ne samo proti spominu
- Odkritje: po reseedu DEV strežnik potrebuje restart (stale SQLite ročaj) — dodano v proces
- Ostalo programa: PR #24 + produkcija, ključa HF + ElevenLabs (uporabnik), issue #3, živi preizkus vodnika po okni kvote

---
Task ID: 26
Agent: Main agent (Z.ai Code)
Task: ElevenLabs žeton (nastavitev + preverba + priporočilo glasu) in issue #3 (čiščenje odvisnosti) po ponastavitvi peskovnika

Work Log:
- Peskovnik PONASTAVLJEN (samo Initial commit brez remote): projekt obnovljen iz GitHub — remote z žetonom ghp_c7Q…, fetch main, reset --hard; main = e8457d6 (PR #24, 26 zapisov / 113 virov), bun install 464 paketov, .env rekreiran (DATABASE_URL), dev strežnik :3000
- Uporabnik priskrbel ELEVENLABS_API_KEY (sk_3c7a…): API preverba — ključ je VELJAVEN (prepoznan), a BREZ dovoljenj: user_read ✗, voices_read ✗, text_to_speech ✗ (401 missing_permissions) → ključ je bil ustvarjen brez TTS pravic, obstoječemu ključu pravic ni mogoče dodati — potreben NOV ključ (navodila uporabniku: Profile → API Keys → Create Key → označiti vsaj „Text to Speech“)
- Kljuv ključ vseeno vpisan v .env.local (dokumentacija + preizkus verige): veriga deluje po zasnovi — ElevenLabs 401 (opozorilo v dnevniku) → z-ai 429 → odkrit 503 tts-unavailable v 0,6 s, brez sesutij
- Priporočilo glasu (uporabnik: „najdražjega ali najboljšega brezplačnega“): model eleven_multilingual_v2 (najvišja kakovost, nativna slovenščina; flash v2_5 cenejši a slabši) + glas Antoni (ErXwobaYiN019PkySvjV, topli dokumentarni moški glas) — OBA ŽE v kodi; zamenjava glasu možna brez kode prek env ELEVENLABS_VOICE_SL/EN
- Issue #3 revizija: večina (~20 paketov + ~37 shadcn komponent) že odstranjena v prejšnjih PR-jih; vseh 15 preostalih komponent v uporabi; vsi preostali paketi imajo živ uvoz (openseadragon prek dinamičnega uvoza v deep-zoom, sharp za next/image, 9× radix prek komponent)
- Izvedeno čiščenje zadnjega ostanka: tailwind.config.ts (predloga TW3 — v TW4 brez @config direktive se NE naloži; vse preslikave že pokriva @theme inline) + tailwindcss-animate (njegov edini uvoz); animacije ostajajo iz tw-animate-css (dokazano v dist CSS: animate-in/out, fade, zoom, slide)
- Nauk iz poskusa `bun update`: povzročil neskladje react 19.2.3 vs react-dom 19.3.0 → Turbopack panic „Internal Server Error“; popravljeno z obnovo bun.lock iz git (različice usklajene: react=react-dom=19.3.0, next 16.3.5) — posodabljanje prek celotnega lockfila je preveč agresivno, ciljane spremembe so varnejše
- Preostale ranljivosti bun audit (27: 20 high) so IZKLJUČNO v razvojnih verigah (eslint, prisma CLI, minimatch/picomatch) — nikoli v produkcijskem standalone paketu
- Verifikacija čiščenja: tsc 0; eslint 0; agent-browser: domača stran, iskalni dialog Ctrl+K (komande + sugestije), dialog zapisa Griblje — vas ob Kolpi (naslov, avdio vodnik, viri, povezani zapisi) — vse deluje; 0 novih napak
- Zaplet z git (strop je pristal na main namesto na vejo): veja premaknjena z git branch -f, main povrnjen, sila potisk veje; PR #25 ustvarjen in squash združen → main = ede92a3
- Vercel: env ELEVENLABS_API_KEY ustvarjen (production/preview/development, encrypted) + nova produkcijska namestitev sprožena (dpl_3nYfno…) — veriga je oborožena, ob zamenjavi ključa samo zamenjava vrednosti

Stage Summary:
- Issue #3 ZAPRT (PR #25): −1 paket, −295 vrstic, mrtva TW3 konfiguracija odstranjena; produkcijska površina čistejša
- ElevenLabs: ključ veljaven a brez text_to_speech dovoljenja — uporabnik mora ustvariti nov ključ z TTS pravico (navodila dostavljena); do takrat veljajo obstoječe rezerve (z-ai → glas naprave), preverjene lokalno in pripravljene na produkciji
- Glas/model po priporočilu: eleven_multilingual_v2 + Antoni (že v kodi, zamenjava brez kode prek env)
- Ostalo programa: zamenjava ElevenLabs ključa (uporabnik) → živi preizkus govora na produkciji; HF_API_KEY še čaka

---
Task ID: 27
Agent: Main agent (Z.ai Code)
Task: Novi ElevenLabs žeton — preverba pravic, zagon govora lokalno + na produkciji (uporabnik: „preveri ce ima sedaj vse pravice kaj potrebujes in nadaljuj")

Work Log:
- Uporabnik priskrbel NOVI ELEVENLABS_API_KEY (sk_8945…): preverba pravic — text_to_speech ✅ (kritično), voices_read ✅ (21 prednastavljenih glasov), user_read ✗ (ni potreben — samo za branje naročnine/kvote)
- Zanimivost: Antoni (ErXwobaYiN019PkySvjV) NI na seznamu /v1/voices (novejši skupini prednastavljenih), a njegov ID deluje nespremenjeno — test sinteze slovenščine: HTTP 200, 115 KB MP3 v 1,9 s
- .env.local posodobljen z novim ključem (star sk_3c7a… zamenjan)
- Lokalni preizkusi skozi /api/audio-guide: minute SL 561 KB (4,3 s) / cel vodnik 1 MB v 2 odseka (7,3 s) / minute EN 554 KB (4,0 s); glave pravilne (audio/mpeg, x-total-chunks, cache-control 24 h)
- agent-browser lokalno: dialog zapisa → „Poslušaj avdio vodnik" → gumb „Ustavi predvajanje" (predvajanje teče), oba odseka 200, 0 napak v konzoli
- Vercel: obstoječa env spremenljivka ELEVENLABS_API_KEY (id odKwBtBppYZXKTHL) PATCH-ana z novo vrednostjo (production/preview/development, encrypted) + nova produkcijska namestitev dpl_9Y8nt… → READY
- Produkcijski preizkusi: domača 200; audio-guide minute SL 546 KB MP3 (7,2 s, hladna sinteza); minute EN 595 KB; drug zapis (zaseda-1941) 662 KB — VSI 200 z veljavnim MP3
- agent-browser NA PRODUKCIJI: dialog zapisa Griblje — vas ob Kolpi → predvajanje avdio vodnika → gumb „Ustavi predvajanje", chunk 0+1 200, 0 napak strani
- Rezultat: MUZEV GOVORI z glasom Antoni (eleven_multilingual_v2) — veriga ElevenLabs → z-ai → glas naprave je popolnoma oborožena; z-ai rezerva ostaja nevidna v ozadju

Stage Summary:
- Avdio vodnik deluje končno v vsem obsegu: lokalno + produkcija, SL + EN, minute + cel vodnik, več zapisov — sinteza 4–8 s (hladna), predvajanje iz predpomnilnika trenutek
- Ključ: text_to_speech + voices_read zadostujeta; user_read ni potreben; glas/model po priporočilu ostajata Antoni + eleven_multilingual_v2 (zamenjava brez kode prek env)
- Varčevanje s kreditom aktivno trojno: strežniški predpomnilnik 64 MB + brskalniški 24 h + omejitev hladnih sintez 30/5 min na IP
- Ostalo programa: HF_API_KEY za POGOVOR vodnika še čaka (z-ai 429) — edina še odprta AI zmožnost

---
Task ID: 28
Agent: Main agent (Z.ai Code)
Task: OpenRouter žeton — preverba brezplačne veje, izbira modela, vgradnja pogovora vodnika + odprava produkcijske blokade (uporabnik: „openrouter bick picle ali mimo 2.5 delujeta free testiraj ce ti to odgovarja")

Work Log:
- Preverba ključa (sk-or-v1-…): veljaven, free tier, 446 modelov, 23 brezplačnih (:free)
- Ugotovitev o uporabnikovih modelih: xiaomi/mimo-v2.5 in mimo-v2.5-pro OBSTAJATA a sta PLAČANA ($0.14–0.87/1M žetonov) — brez kredita na free tieru neuporabljiva; imena „bick picle" med 446 modeli ni (verjetno govorna zatrditev)
- Test slovenščine 12+ brezplačnih modelov: ZMAGOVALEC inclusionai/ling-3.0-flash-vl:free (živa slovenščina, pravilni podatki, 1,7 s); rezerve ling-sante, laguna-s-2.1; izločeni nex-n2.5 (pušča razmišljanje poangleško + napačna občina), nemotron-3.5 (pušča „thinking process"), glm-5.2/gemma-4/nemotron-super (429/400/502), dots-3-note (napačna občina — le zadnja rezerva), lfm-2.5 (prazno)
- Globoji preizkus z dosjeom: naravni vodniški odgovor + navedek [[griblje-vas]] + 4,2 s
- Nov modul src/lib/openrouter-llm.ts (zgled hf-llm.ts): veriga 4 free modelov, lepljivi model, klasifikacija napak (401/403 navzgor; 402/429/5xx naslednji), HTTP-Referer + X-Title atribucija
- NAJDEBA iz testov: ling-3.0 prek ponudnika Novita je RAZMIŠLJAJÓČ model — brez izklopa notranje razmišljanje poangleško poje celoten proračun žetonov: ~50 % odgovorov REZANIH sredi stavka, nekateri content: null (finish: length). Rešitev: reasoning: {enabled: false} → 5/5 zaključenih odgovorov + navedki, ~3× hitreje; obramba v globino: finish_reason=length = prestop na naslednji model
- guide.ts: veriga sedaj OpenRouter → HuggingFace → z-ai; max_tokens 800 (pri 500 se odgovor rezal pred navedki); zastareli števec „20 kuriranih zapisov" → 26 (SL+EN, i18n)
- PR #26 (squash) → main = 7519067; lokalna verifikacija: tsc/eslint 0; 5/5 zaključenih odgovorov (1065–1517 znakov, 4–5 navedkov, 6,5–10 s); agent-browser: pogovor o Županiču — živa slovenščina, čip navedka odpre zapis
- PRODUKCIJSKA BLOKADA (vodnik je vračal 503 guide-unavailable v 1 s): tri diagnostične namestitve so razkrile KOREN — askGuide() je z-ai odjemalec ustvaril ŽE NA ZAČETKU; na Vercelu .z-ai-config ni → konstrukcija vrgla napako ŠE PRED OpenRouter postajo (lokalno konfig obstaja → vse delovalo). Popravek: getZAI() lenobno, globoko v rezervni veji (ea53c53)
- Nauk o diagnostiki: HTTP glave ne prenašajo č/š/ž (ByteString) — glava s slovensko sledjo napak je povzročila prazen 500; sled v telo/dnevnik
- Nauk o namestitvah: Vercel build log (v2/events) potrjuje kloniranje pravega SHA; ref=SHA namesto veje odpravlja vejitveno negotovost; „sourceless: true" povezava pomeni, da moraš preverjati, ne zaupati
- Izkoristek kvote: intenzivni testi so porabili DNEVNO mejo free modelov (50/dan, x-ratelimit-remaining: 0, ponastavitev 1789516800000 = polnoč UTC); računovska 429 „free-models-per-day" se zdaj obravnava takoj navzgor (jalovo prestopanje po :free verigi bi žrlo čas)
- Iskrena kvotna UX (0b1e0d7): kvota + padel tudi z-ai → obiskovalec vidi „Današnja meja brezplačnega vodnika je že dosežena — prosim, poskusite jutri." (429 quota-exhausted, SL+EN), ne zavajajočega „strežnik ni nastavljen"; trajna operativna glava X-Guide-Providers (ASCII) — dokaz, kdo se je poskusil
- Vercel: OPENROUTER_API_KEY ustvarjen (production/preview/development, encrypted); 6 namestitev danes; PRODUKCIJA PREVERJENA: x-guide-providers: openrouter,zai (pot izvedena!), 429 quota-exhausted, UI izpiše kvotno sporočilo; ob ponastavitvi (polnoč UTC) ali nakupu 10 USD kredita (→ 1000 zahtev/dan) vodnik samodejno zaživi
- README: meje free veje + pot nadgradnje (10 USD → 1000/dan)

Stage Summary:
- Pogovor vodnika ima novo prvo postajo: OpenRouter free (ling-3.0-flash-vl — najboljša živa slovenščina med 23 preizkušenimi), ki dela ZDAJ (lokalno dokazano), HF pa ostaja druga postaja za prihodnji žeton
- Odprt in popravljen skriti produkcijski hrošč: nedejavna lenobna inicializacija z-ai je od 1. dne preprečevala VSEM ponudnikom (tudi staremu HF), da bi se na Vercelu sploh poskusili — vodnik zdaj tam res deluje
- Dnevna meja 50/dan je practical omejitev: enkratni 10 USD nakup kredita na openrouter.ai (enkrat za vselej) dvigne na 1000/dan — priporočilo uporabniku; kvota se sicer ponastavi vsako polnoč UTC
- Ostalo programa: HF_API_KEY (uporabnik, neobvezno — OpenRouter pokriva), morebitni kredit na OpenRouter, živi produkcijski preizkus pogovora po ponastavitvi kvote

---
Task ID: 29
Agent: Main agent (Z.ai Code)
Task: Raziskava novih virov o Gribljah + razvoj: jubilejno leto 2026 v zbirki, funkcija »novo v zbirki« (uporabnik: „odlicno nadaljuj raziskuj razvijaj")

Work Log:
- Stanje: dev :3000 teče, main = 50f63cf (dnevnik 28); OpenRouter kvota ob preverbi izčrpana (0/50, reset 00:00 UTC) — a pozneje v seji se je kljub temu odzval (vodnik odgovoril!) → kvota očitno razpoložljiva vsaj deloma; živi test na produkciji po namestitvi uspešen
- SPLETNA RAZISKAVA (web_search + page_reader + Wikipedijin/Commons API, ~18 poizvedb):
  - Odkritje #1: LETO 2026 = JUBILEJNO LETO GRIBELJ — 500 let od prve pisne omembe cerkve sv. Vida (1526); slovesnost 21. 6. 2026 ob Vidovskem žegnjanju (maša msgr. Andrej Glavan, somaševal župnik Peter Miroslavič, zbor Podzemelj, učenci šole)
  - Odkritje #2: dve publikaciji ob jubileju — knjižica „Cerkev sv. Vida v Gribljah – Memento ob 500 letnici prve omembe v pisnih virih" (pobuda Romana Husič, strokovno delo dr. Janeza Weiss, oblikovanje Mojca Črnič mlajša, čtivo Alojzija Štruclja) + soizdajatelja PGD Griblje 1927 in Mestna muzejska zbirka Črnomelj
  - Odkritje #3: obnova cerkve zaključena in blagoslovljena (avgust 2026, gradbeni odbor pod predsedstvom Antona Filaka!); novo parkirišče + mrliška vežica (občina 600 m² ~18.000 EUR + donacija rojaka dr. Franca Brinca)
  - Odkritje #4: ZVON 1998 — zaobljuba Antona Filaka ob rojstvu sina → akcija z donacijami vaščanov in izseljencev iz Avstralije/Amerike → 700-kilogramski zvon Feralit + obnova fasade/strehe/stopnišča/elektrifikacije, blagoslov nadškofa Alojzija Šuštarja (»cela vas je dihala kot ena duša")
  - Odkritje #5: mežnarska družina Šimec (Jože + Ivana, 1978–1998, ročno zvonjenje 3× dnevno, lipe okoli cerkve; danes mežnarica Ana Križan); predsednik PGD Darjot Piškurič pomagal organizirati jubilej
  - Odkritje #6: PGD Griblje ustanovljeno 1927 (uradna FB stran + poslovni imenik; naslov doma Griblje 35B) — 100-letnica 2027!
  - Odkritje #7: 150-letnica rojstva Nika Županiča 1. 12. 2026 (drugi jubilej istega leta); Županič po SL Wikipediji ohranil najstarejše slike vasi (Vavpotič + Maksim Gaspari)
  - Odkritje #8: sosednji Butoraj praznoval isto leto svojo cerkev sv. Marka (prva omemba prav tako 1526, popis cerkvenih dragocenosti župnika Ivana Helda)
  - Odkritje #9: kopališče Griblje ob Kolpi z živim merilnikom temperature (reka-kolpa.si); razrešitev protislovja prve omembe vasi: 1468 Griblach (jezikoslovna literatura/EN Wiki) ≠ 1526 (napaka v SL Wiki članku o cerkvi) — naša EN različica je imela napačnih 1526, popravljeno
  - Viri s polnimi URL: crnomelj.si novice (23. 6. 2026), moja-dolenjska.si (26. 6. 2026 — ugibana povezava zadela!, najboljši prerez slovesnosti), slovenskenovice.delo.si (13. 8. 2026 — obnova + zvon 1998 + Šimeci), sl.wikipedia Cerkev sv. Vida, Q18515927, instagram objava občine, reka-kolpa.si
- ANALIZA VRZELI DigitaltMuseum: časovnico, karto, AI-vodnik, i18n že imamo; relevantna preostala vrzel = izpostavljanje novih pridobitev (»New content 7/30 dni«) → izvedeno kot kurirani addedAt + znak + filter
- RAZVOJ — VSEBINA: NOV zapis petstoletnica-2026 (kraj, DOCUMENTED, featured, slika cerkve, 5 virov, lat/lng, dodan za sveti-vid) + NOV zapis pgd-griblje-1927 (kraj, CORROBORATED, brez svobodne fotografije → hero-povratna + iskren zapis o vrzeli, 4 viri, dodan za vaško šolo) = 28 zapisov
- Posodobitve zapisov: sveti-vid (zgodba zvona 1998 + jubilej 2026; +2 vira), niko-zupanic (Gaspari + 150-letnica; +2 vira), anton-filak (zaobljuba 1998 + gradbeni odbor; +1 vir), griblje-vas (EN popravek 1468; ime vira), kolpa-reka (kopališče Griblje; +1 vir)
- Biografije predmetov: sveti-vid prenovljena (1526 → 18. stol. → 1914–18 → 1998 → 2008 → 2026) + novi petstoletnica-2026 (5 faz) + pgd-griblje-1927 (4 faze) = 28; nov dogodek: 150 let od rojstva Županiča (1. 12. 2026, muzej odpira spominski zapis)
- RAZVOJ — FUNKCIJA: Prisma addedAt DateTime? + seed + ExhibitDTO + /api/exhibits (kurirano, preživi reseede — DB default ne bi); collection-view: znak „Novo" na karticah (60-dnevno okno, Sparkles, flex z obiskanim znakom) + čip filter „Novo v zbirki" (aria-pressed, samo če obstajajo novi) + reset; i18n: newOnly/newBadge/newBadgeSr SL+EN, vodnik 26→28 zapisov; Wikidata sameAs: petstoletnica-2026 → Q18515927
- Nauk: dev strežnik po spremembi API kode streže staro pot (route modul) — po vsaki spremembe serializacije + resedu RESTART (pravilo iz naloge 26 potrjeno)
- VERIFIKACIJA: tsc 0, eslint 0; agent-browser: zbirka (2 novi kartici z znakom Novo + čip), filter „Novo v zbirki" → samo 2 zapisa + Počisti, dialog petstoletnica (Glavan/Memento/Weiss/Brinc/Piškuri v besedilu, 5 virov), časovnica (mejnik 2026 po popravku oznake obdobja; PGD v 20. stol.), dogodki (150 let Županič), EN vmesnik (1468 Griblach popravljen, „New to the collection"), mobilni 390px vse deluje, 0 napak
- AVDIO: /api/audio-guide?slug=petstoletnica-2026 → 1,23 MB MP3 v 8,8 s (hladna sinteza, ElevenLabs)
- VODNIK: /api/guide na vprašanje o letu 2026 → popoln slovenski odgovor O NOVEM ZAPISU z navedkoma [[petstoletnica-2026]] + [[niko-zupanic]] (x-guide-providers: openrouter,zai) — nova vsebina samodejno vstopila v dosje
- Git: veja + squash PR → main; Vercel namestitev + produkcijska preverba (spodaj)

Stage Summary:
- Zbirka: 28 zapisov / 128 virov (+2 zapisa, +15 virov) — jubilejno leto 2026 dokumentirano v vsem obsegu (slovesnost, publikacije, obnova, donator, zvoni, mežnarji, gasilci, Županič 150)
- Nova funkcija po vzoru DigitaltMuseum: kurirani »novo v zbirki« (znak + filter, 60 dni, preživi reseede)
- Popravljeni jezikiovni/časovni nedoslednosti (EN 1468, ime vira, obdobje jubileja)
- Vodnik dokazano odgovarja o novi vsebini z navedki; kvota OpenRouter deluje (vsaj delno) že med sejo
- Ostalo programa: produkcijska namestitev + preverba; morebitni nakup 10 USD kredita za 1000 zahtev/dan ostaja priporočilo

---
Task ID: 29-dopolnitev
Agent: Main agent (Z.ai Code)
Task: Objava in produkcijska preverba naloge 29

Work Log:
- Git: objava na main (4c98e0d) + Vercel namestitev dpl_4Noxzx3w9eAonSdoAzzwFR2hGwPY → READY (~40 s); repoId 1369300114 (gitSource ga zahteva)
- Produkcija https://griblje-museum.vercel.app: domača 200 (0,8 s); /api/exhibits = 28 zapisov, addedAt na obeh novih, petstoletnica ima 5 virov
- Brskalnik na produkciji: zbirka kaže obe novi kartici z znakom „Novo", čip „Novo v zbirki" deluje → filtriranje pokaže „2 zapisa" + Počisti filtre; 0 napak v konzoli
- Avdio vodnik na produkciji: petstoletnica-2026 → 1,25 MB MP3 v 15 s (hladna sinteza, ElevenLabs)
- Vodnik na produkciji: veriga se izvede (x-guide-providers: openrouter,zai), a danes je dnevna kvota free modelov znova izčrpana (moji testni klici) → iskreno kvotno sporočilo; LOKALNO je v istem dnevu vodnik že odgovoril na vprašanje o letu 2026 s popolnim slovenskim odgovorom in navedkoma [[petstoletnica-2026]] + [[niko-zupanic]] — nova vsebina dokazano vstopi v dosje vodnika

Stage Summary:
- Jubilejno leto 2026 je ŽIVO na produkciji: 28 zapisov / 128 virov, znak in filter »novo v zbirki«, avdio vodnik govori novi zapis, vodnik pozna novo vsebino (ko kvota dovoljuje)
- Kvota OpenRouter free (50/dan) se ponastavi ob 00:00 UTC; priporočilo uporabniku ostaja: enkratni nakup 10 USD kredita → 1000 zahtev/dan

---
Task ID: 30
Agent: Main agent (Z.ai Code)
Task: Vodnik pod pritiskom kvote: predpomnilnik odgovorov, ločevanje dnevnih/minutnih 429, točna ura obnove + razrešitev vprašanja o modelih mimo-2.5/bick-picle (uporabnik: „odlično nadaljuj")

Work Log:
- PREIZKUS KLJUČA OPENROUTER (uporabnikovo vprašanje iz te seje): ključ veljaven (free tier, brez limita kredita); dnevna kvota :free modelov (50/dan) je bila OB 17:43 UTC ŽE izčrpana (X-RateLimit-Remaining: 0, reset 00:00 UTC = 02:00 po ljubljanskem) — porabil nekdo drug (produkcija/lastnik), moji klici zavrnjeni; /key kaže usage_daily 0, ker ta šteje KREDIT, ne število brezplačnih zahtev
- ODGOVOR NA „mimo 2.5": xiaomi/mimo-v2.5 in mimo-v2.5-pro OBSTAJATA na OpenRouterju, a sta PLAČLIVA ($0,14/$0,28 oz. $0,435/$0,87 na M žetonov). Preizkus na brezplačnem računu: z izklopljenim reasoningom odgovori v dobri slovenščini (vendar brez dosjeja izmišlja: PGD „1928" namesto 1927), račun pa ima le ~0,0001 USD startnega kredita (429/402 „can only afford N tokens") → NEPrimno za brezplačno vejo; primerljivo bi postalo šele z nakupom 10 USD (~4500 vodnikovih odgovorov)
- ODGOVOR NA „bick picle": v celotnem katalogu (ID-ji in imena, ~400 modelov) NI zadetka za mimo-»pickle«/»bick« — najverjetneje zmotno zapomnjeno ime; obstoječa veriga ling-3.0 ostaja
- RAZREŠITEV SKRITI ZA 429: stara koda je napako „free-models-per-MINUTE" (20/min, prehodna) enačila z DNEVNO izčrpanostjo → popravljeno: samo „free-models-per-day" je usodna; minutna meja gre po verigi naprej (prej bi lažno ubila pogovor za ves dan)
- NOVA MODUL guide-cache.ts: LRU predpomnilnik za PRAVA vprašanja pogovora (brez zgodovine) — normalizacija (male črke, brez diakritike č→c, ločila v presledke), ključ jezik:normalizirano, 24 h TTL, max 120 vnosov; večturni pogovori se NE predpomnijo (odvisni od poteka)
- guide.ts: askGuide preurejena (hitra pot pred dosjejem — zadetek ne dotakne niti baze), ponudniška veriga izvlečena v askProviders(), odgovor se shrani za naslednjega obiskovalca; glava modula pošteno opisuje izjemo o predpomnjenju
- POT /api/guide: nova glava X-Guide-Cache (hit|miss) + resetAt (ISO) v odgovoru quota-exhausted; openrouter-llm.ts: WeakMap priloži resetAt napaki (X-RateLimit-Reset iz telesa — PODSTATEN HROŠČ: metadata je pod error.metadata.headers, ne na korenu; popravljeno po živem testu)
- UI guide-dialog.tsx + i18n (SL+EN): quotaReset „Prosti pogovor se obnovi ob {time}." (ura v coni in jeziku brskalnika), zasebnostna opomba pošteno povedana o anonimnem dnevno-dolgem predpomnilniku najpogostejših vprašanj
- ZAHAJRITI z-ai na produkcijo: .z-ai-config ne obstaja kot datoteka (SDK deluje le znotraj peskovnika), žetona ni mogoče prenesti → produkcija ostaja OpenRouter(+HF)+predpomnilnik; Vercel žeton iz seje je neveljaven (invalidToken) → namestitev prek git push (samodejno)
- VERIFIKACIJA: tsc 0 napak, eslint 0; restart dev po pravilu; curl zaporedje: 1. vprašanje miss (openrouter 429 → zai odgovori 3,3 s, dnevnik kaže „obnovitev ob 2026-09-16T00:00:00.000Z") → isto vprašanje HIT v 22 ms (providers=cache) → „kje ležijo Griblje" (velike/male, diakritika) HIT (isti ključ) → „kje lezi griblje" (druga beseda!) pravilno miss → večturni pogovor pravilno mimo predpomnilnika; neposreden preizkus modula: openRouterQuotaOf vrne resetAt, Ljubljana 02:00
- Brskalnik (agent-browser): dialog odprt prek Ctrl+G gumba, klik starterja „Kako je vas živela ob Kolpi?" → živ slovenski odgovor o mlinih/malenci/Kolpi z 2 navedkoma (gumba odpreta zapisa), zasebnostna opomba z besedilom o predpomnilniku, 0 napak v konzoli

Stage Summary:
- Zmogljivost vodnika na dan izčrpane kvote: prva vprašanja si delijo odgovore (22 ms namesto 3 s in 0 porabljenih zahtev) — učinek raste s številom obiskovalcev, predpomnilnik pa streže TUDI ko je kvota pri 0
- Minutna 429 ne ubija več pogovora za ves dan; dnevna pa obiskovalcu pove točno uro obnove (v njegovi coni)
- mimo-2.5: plačljiv, neustrezen brez kredita; „bick picle" ne obstaja — obstoječa izbira modelov ostaja
- Priporočilo uporabniku ostaja: enkratni nakup 10 USD na OpenRouter → 1000 brezplačnih zahtev/dan (≈20× več)

---
Task ID: 31
Agent: Main agent (Z.ai Code)
Task: Temeljita raziskava vsega o Gribljah (uporabnik: „odlično raziskuj se o gribljah vse kaj najdes temeljito")

Work Log:
- RAZISKAVA (~20 spletnih iskanj + Wikipedijini API-ji REST/query + preizkus branj strani): Wikipedija Griblje (cel članek — večina že vgrajena v griblje-vas iz naloge 27/29), Wikipedija Bela krajina (celoten izvleček), Wikipedija Črni močeril (REST summary), Wikipedija Turški vpadi (potrjitev 1408 prek iskanj), zaveza.si (memoar o 2. sv. v.), td-damelj.si (404), majaarchitect (turški vpadi), KP Kolpa (osebna izkaznica, uredba 85/06)
- KLJUČNO ODKRITJE #1 — LOGLINE VRZEL: Zagonsko vprašanje vodnika je vprašalo po LONČARSTVU Bele krajine, zbirka pa ga nima — in upravičeno! Preverjeno: lončarstvo/suha roba je Ribnica/Kočevsko, Bela krajina pa je znana po LANENEM PLATNU (Wikipedija Bela krajina) in čebelarstvu. Vprašanje je vsebovalo napačno predpostavko → popravljeno na „lanenem platnu in vinu" (SL+EN), ker imamo tkalstvo + vino-in-crnina; vodnik zdaj odgovori z navedki [[tkalstvo]] (preizkušeno!)
- KLJUČNO ODKRITJE #2 — ČRNI MOČERIL (Proteus anguinus parkelj): podvrsta človeške ribice, ki živi SAMO v kraških vodah okolice Črnomlja (<100 km²); temno pigmentirana in Z NORMALNO RAZVITIMI OČMI (7 virov: Wikipedija, RTV, 24ur, belakrajina.si, ckff.si, pms-lj.si, vzajemnost) — nasprotje slepi beli sorodnici iz Postojne; odkrita 18. oktobra 1986 ob črpalnem preizkusu izvira Dobličice (raziskovalci Inštituta za raziskovanje krasa; Radio Odeon 2016), opisana: zoolog Boris Sket, vzdevek parkelj = hudiček (črno telo + živo rdeče škrge ≈ miklavževski parklji); izvir Jelševniščice v Jelševniku = edino vidno najdišče na svetu; ogrožena (RTV 2020)
- KLJUČNO ODKRITJE #3 — PRVI TURŠKI VPAD NA SLOVENSKO OZEMLJE: 9. oktober 1408, prav v Beli krajini (iz Bosne, ropanje okolice Metlike); edini poročevalec Valvasor 1689 — potrjeno z Wikipedijo Turški vpadi + 3 dodatnimi viri → vstavljeno kot prolog zapisa uskoki-in-vojna-krajina (SL+EN) + nov vir
- KLJUČNO ODKRITJE #4 — ŠTORKLJE 1993: prve bele štorklje so se v Beli krajini naselile šele leta 1993, VERJETNO KOT POSLEDICA VOJNE NA HRVAŠKEM; ~11 gnezdečih parov ob Kolpi (Zemelj, Krasinec, Otok, Boršt, Cerkvišče, Prolozje) in Lahinji (Dragatuš) → obogatitev zapisa storklje (SL+EN) + nov vir
- KLJUČNO ODKRITJE #5 — KRAJINSKI PARK KOLPA: pravna podlaga = Uredba o Krajinskem parku Kolpa (Uradni list RS, št. 85/06, s spremembami; kp-kolpa.si osebna izkaznica) → obogatitev zapisa bele-breze (SL+EN) + nov vir; Natura 2000, steljniki
- ODKRITJE #6 — ŽUPANIČEV ZBORNIK 1939: Katarina Zupanič, „Šopek poljskih cvetlic iz Gribelj v Beli Krajini" (Ljubljana 1939; seznam virov Wikipedije Griblje) → nov vir v zapisu niko-zupanic (objava, brez URL — poštena navedba tiska)
- ZAVRŽENE SLEDI (razlog): mimo-2.5/bick-picle (naloga 30), lončarstvo za BK (neustrezno), grad Gradac (regionalen, ne gribeljski), zaveza.si kot vir (politiziran memoarski vir brez novih overjenih dejstev o sami vasi), čebelarstvo (samo regionalna trditev, brez gribeljskega vira)
- NOV ZAPIS crni-moceril (narava, DOCUMENTED, yearFrom 1986, addedAt 2026-09-16 → znak „Novo"): naslov SL+EN, celotna zgodba v muzejskem glasu (suhi svet nad vasjo + črna žival pod njim = isti kraški sistem; Sket/parkelj/miklavževski parklji; Jelševnik; poštena opomba o manjkajoči svobodni fotografiji), 6 virov (Wikipedija ×2, ZRSVN, RTV, Radio Odeon, CKFF), sameAs Wikidata Q12807022; življenjepis predmeta 4 faze (do 1986 TRADITION → 18. 10. 1986 odkritje → 1986→1990 opis → danes ogroženost); NOV dogodek: „40 let odkritja črnega močerila — naravoslovna ura ob izviru" (25. 10. 2026, Jelševnik, VODENJE)
- Posodobitve števcev: i18n vodnikov podnaslov 28→29 zapisov (SL+EN)
- Nauk: python heredoc požre ubežne narekovaje (\" → ") — biografija je lomila TS, dokler nisem popravil ročno; MultiEdit NI atomski — neuspešen poskus lahko pusti delno aplicirane ureditve (preveriti stanje po vsaki napaki!)
- Slika močerila: Wikimedia Commons ostal rate-limited (403) celo sejo — zapis stoji pošteno brez fotografije (isti vzorec kot pgd-griblje-1927); priložnost za naslednjo sejo
- VERIFIKACIJA: tsc 0, eslint 0 (po popravku), reseed + restart dev (pravilo naloge 26); /api/exhibits = 29 zapisov (crni-moceril z addedAt + 6 viri), /api/events = 7 dogodkov (novi: 40 let odkritja); agent-browser: kartica z znakom „Novo" + „Nedavno dodano", filter „Novo v zbirki" → „3 zapisi", dialog (celotna zgodba, 6 virov, harmonika „Življenje predmeta — 4 postaje" z vsemi fazami), časovnica 18 mejnikov z 1986, dogodki (#dogodki: naslov + lokacija Jelševnik), vodnik: podnaslov 29, nov starter, odgovor o močerilu s pravimi dejstvi + [[crni-moceril]], odgovor o lanenem platnu + [[tkalstvo]] (z-ai, ker je OpenRouter kvota še izčrpana — reset 00:00 UTC), EN vmesnik („The black olm", „New to the collection"), mobilni 390 px, noga statična, 0 napak v konzoli

Stage Summary:
- Zbirka: 29 zapisov / 135 virov (+1 zapis, +7 virov) — črni močeril kot prvi naravoslovni endemit zbirke; 3 zapisi trenutno nosijo znak „novo"
- Popravljen semantični hrošč: zagonsko vprašanje vodnika ni več vodilo v slepo ulico (lončarstvo ne obstaja v zbirki/regiji → laneno platno, ki ga zbirka ima)
- Novo kronološko dejstvo: 9. 10. 1408 kot prvi turški vpad na slovensko ozemlju — Bela krajina kot prizorišče „prvega dne" 500-letne vojne z Osmani
- Štorklje: kolonizacija 1993 kot posledica vojne čez Kolpe — most med naravo in sodobno zgodovino regije
- Ostalo programa: produkcija (push + Vercel + preverba); fotografija močerila, ko Commons sprosti omejitev

---
Task ID: 32
Agent: Main agent (Z.ai Code)
Task: Nadaljevanje temeljite raziskave Gribelj (uporabnik: „odlično nadaljuj") — najdba žive vasi + objava naloge 31

Work Log:
- PREVERJENA PRODUKCIJA NALOGE 31: commit 78789f7 je bil že pushan; griblje-museum.vercel.app vrača 29 zapisov s crni-moceril — naloga 31 je bila objavljena ob koncu prejšnje seje
- PONOVNI POSKUS SLIKE MOČERILA: Wikimedia Commons API sedaj dostopen (prej 403) — najdeni in preneseni P anguinus parkelj-head.jpg (300×196, CC BY-SA 3.0, Arne Hodalič) + Spring in Jelševnik (960×470, CC BY 2.0, Uroš Novina; neuporabljena, izbrisana); zapis crni-moceril DOBIL sliko + imageCredit + nov vir commons-moceril-foto; „opomba o manjkajoči fotografiji" v zgodbi PREPISANA (zdaj: dolgo brez fotografije, danes nosi Hodaličevo) — viri 6→7
- VRZEL CELOVITOSTI SPREHOODOV (kritična najdba): 9 zapisov (anton-filak, crni-moceril, griblje-v-stevilkah, izseljenstvo, petstoletnica-2026, pgd-griblje-1927, spomenik-padlim, vaska-sola, zaseda-1941) ni bilo v NOBENEM sprehodu, komentar walks.ts pa je trdil popolno pokritost; POPRAVLJENO: voda-je-zivljenje +crni-moceril (5), vojna-in-svoboda +zaseda-1941 +spomenik-padlim (7), NOVI sprehod „Iz Gribelj v svet" (vaska-sola → pgd → anton-filak → izseljenstvo → kolesa-torpedo → griblje-v-stevilkah, 6), vas-in-njeni-ljudje +petstoletnica-2026 (7); kruh-platno-vino nespremenjen (5); pokritost 30/30, vsak zapis natanko enkrat; i18n: „Štirje kurirani sprehodi"→„Pet kuriranih", „štiri postaje"→„pet postaj" (SL+EN, 6 nizov)
- RAZISKAVA (~10 novih iskanj + 8 prebranih strani): OŠ Loka Črnomelj — Podružnica Griblje (21 učencev 2023/24, učitelji po imenih: Weiss, Kočevar, Štajdohar, Štefanič, Filak; 3. 9. 2026: 4 prvošolci, dobrodošlica + torta); svet24 „Rally Griblje" (9. 7. 2026): SEKCIJA TORPEDO — kolesarska sekcija TD Griblje, 15 let delovanja, ~30 članov, predsednik Jože Pezdirc-Makc, 94-letni Janez Totar, kolesa 70-80 let brez prestav, rally ~60 kolesarjev iz 8 društev SLO+HR, potovanja (Beltinci podarili kolo, Juršinci, Šentjur, Maribor, Škofja Loka, Stara Gora, Varaždin, Koprivnica), letno na Semiško ohcet (blagoslov kolesarjev — potrjeno na zgodovinska-mesta.si), Country Roses, predsednica TD Mateja Pezdirc; radio-odeon 2025 (65 kolesarjev/7 društev), arhiv vaskanal 2017 (kopališče — najzgodnejša omemba); cerkev sv. Vida: podružnica Župnije Podzemelj, regist. KD št. 2122 (že v zapisu), baročna podoba 18. st. (že v zapisu); Butoraj sv. Marko 1526 — dvojna 500-letnica (že v zapisu, naloga 29 je bila temeljita); Commons: Torpedo bicycle.JPG (3819×2865, CC BY-SA 4.0, Brbbl — slika zapisa) + Torpedo-Fahrraeder oglas 1908 (javna last — vir za starost znamke)
- NOVI ZAPIS kolesa-torpedo (30. zapis!): kategorija kraj, DOCUMENTED, yearFrom 2011, addedAt 2026-09-16 → znak „Novo"; naslov SL+EN, 4-odstavna zgodba (časovni stroj na pedala / rally in potovanja / Totar + Pezdirc + Country Roses / muzejski okvir s pošteno opombo o sliki), 7 virov (svet24, odeon 2025, vaskanal 2017, zgodovinska-mesta, facebook, Commons ×2), koordinate vasi; POSTAJA v sprehodu „Iz Griblje v svet"; števci 29→30 po vsej kodi (i18n vodnik podnaslov + coverNote SL/EN, walks.ts komentar)
- OBogatitev vaska-sola: nov odstavek o živi šoli (Podružnična šola Griblje OŠ Loka Črnomelj, 21 učencev 2023/24 v dveh kombiniranih oddelkih z imeni učiteljev, 4 prvošolci septembra 2026 — „Iz tablic v svet, in spet nazaj"); +2 vira (os-loka arnes stran, članek prvi šolski dan); viri 6→8
- ZASTAREL META OPIS (najdba v produkciji): layout.tsx description je rekel „20 zapisov" → popravljen na „30 zapisov" (SL del); komentarji v theme-hubs/connections/theme-hub-view usklajeni (20→30)
- Nauk seje: dev strežnik v peskovniku občasno umre MED ukazi (ubijanje procesne skupine) — zanesljivo je (re)zaganjanje + verifikacija v ENEM Bash ukazu; svet24 URL-ji za radio-odeon vrnejo 403 (citirano pošteno po naslovu)
- VERIFIKACIJA: tsc 0, eslint 0; reseed + restart; /api/exhibits = 30 zapisov; celovitost sprehodov 30/30 enkrat; agent-browser: filter „Novo v zbirki" (4 zapisi, Torpedo kartica s sliko + kreditom Brbbl), dialog Torpedo (celotna zgodba, 7 virov, citat), sprehodi (5 kartic, novi „Iz Griblje v svet" s 6 postajami, coverNote „vseh 30 zapisov"), vodnik (podnaslov 30, odgovor o Totarju/Torpedu iz novega zapisa s citatom), močeril dialog (Hodaličeva slika + prepisana opomba), mobilni 390 px (noga brez vrzeli), 0 napak v konzoli
- PRODUKCIJA: commit 67ced28 (30. zapis + slika močerila + sprehodi + šola) in 8a999b8 (meta opis 30); griblje-museum.vercel.app preverjen: 30 zapisov, kolesa-torpedo z 7 viri, močeril s sliko, obe novi sliki HTTP 200, meta opis „30 zapisov"

Stage Summary:
- Zbirka: 30 zapisov (+1 zapis, +8 virov) — kolesarska sekcija Torpedo kot prva zgodba o ŽIVI skupnosti vasi (TD Griblje, 94-letni kolesar, rally z osmimi društvi)
- Celovitost sprehodov obnovljena: 5 tematskih poti, 30 postaj, vsak zapis natanko enkrat (prej 9 zapisov brez postaje)
- Črni močeril: prva fotografija v zbirki (Arne Hodalič, CC BY-SA 3.0) — opomba o manjkajoči sliki pošteno prepisana v zgodbo o najdbi
- Šola: prvi zapis z imeni trenutnih učiteljev in živim šolskim letom 2026/27
- Ostalo programa: fotografija sekcije Torpedo (Commons nima — vabljen kot priča); ekokmetija Griblje 11a (sled je bila napačna — camping je v Škriljah)
