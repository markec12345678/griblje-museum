# Worklog — Griblje vs. Norwegian Award-Winning Museum Comparison

---
Task ID: 1
Agent: Main agent (Z.ai Code)
Task: Find the best award-winning Norwegian museum and compare it with the griblje project (markec12345678/griblje, cloned at /home/z/griblje-analysis)

Work Log:
- Searched the web (web-search skill, 15 queries) for Norwegian museum awards: "Årets museum i Norge" (Norges Museumsforbund), European Museum of the Year, museum website awards
- Read pages (web-reader skill): munch.no, altamuseum.no, kunstavisen.no (Nasjonalmuseet = Årets museum 2025 + jury citation + full winners list 2001–2025), valdresmusea.no/arets-museum (2022 justification), nasjonalmuseet.no/en (collection page, GDPR cookie consent), no.wikipedia Årets museum i Norge
- Verified key facts: Nasjonalmuseet won Årets museum 2025 (jury: tradition+innovation, record visitors, accessibility focus, new audiences); Valdresmusea won 2022 (regional museum, material+intangible heritage, community closeness, fearless exhibitions); Alta Museum won European Museum of the Year 1993 (first Norwegian EMYA winner); DigitaltMuseum platform = 5.5M objects / 286 museums; Nasjonalmuseet open API since 2018
- Refreshed griblje facts: 16 records in museum.ts, 926 lines src (data+components), App.tsx 77 lines/14,810 chars, 70 commits, Vite 6 + React 19 + TS 5.8 + Tailwind 4 + Leaflet CDN+SRI, no backend, no tests, no LICENSE

Stage Summary:
- Reference standard identified: Nasjonalmuseet (Årets museum 2025) as the "best award-winning Norwegian museum", with Valdresmusea 2022 as the scale-fair regional benchmark
- Full comparison delivered to user in chat (Slovenian): dimensions — institutional framework, audience/community, accessibility (universal design + legal accessibility statements), content ecosystem, digital infrastructure (open API/shared platforms/virtual visits), collection & provenance, intangible heritage, sustainability, technical hygiene
- Key verdict: griblje has museum-grade data discipline (provenance, evidenceStatus) but lacks the entire institutional dimension that the Norwegian award standard measures

---
Task ID: 1-c
Agent: image-generator
Task: Generate museum photograph set for the Griblje digital village museum

Work Log:
- Read worklog.md (prior task: Norwegian museum benchmark comparison)
- Created output directory /home/z/my-project/public/images/
- Attempted hero.png at CLI size 1440x720 — API rejected it (error 1214: height 720 is not a multiple of 32, allowed range 512–2880); CLI also rejects any non-listed size
- Workaround: generated hero at 1344x768, then center-cropped to 2:1 and resized to exact 1440x720 via PIL 11.3 (LANCZOS), re-saved optimized
- Generated the remaining 10 images one by one with `z-ai image` using the exact prescribed prompts + consistent style anchor (warm golden natural light, earthy muted palette, documentary editorial photography, Bela krajina, no text/watermark); jurjevanje prompt additionally enforced "no identifiable real faces"
- Verified each file after generation (existence + >20 KB); no retries needed — every generation succeeded on first attempt
- Final verification: all 11 PNGs open as valid RGB images with exact expected pixel dimensions

Stage Summary:
- All 11 images OK in /home/z/my-project/public/images/:
  hero.png 1440x720 (~1.3 MB, PIL-converted from 1344x768), hisa.png 1344x768 (199 KB), vinograd.png 1344x768 (180 KB), kolpa.png 1344x768 (259 KB), storklje.png 1024x1024 (151 KB), jurjevanje.png 1344x768 (201 KB), partizani.png 1344x768 (222 KB), cerkev.png 1344x768 (177 KB), kruh.png 1024x1024 (144 KB), tkalstvo.png 1024x1024 (117 KB), breza.png 1024x1024 (271 KB)
- Note for future agents: API rejects sizes 1440x720 and 720x1440 (720 not multiple of 32); only 1024x1024, 768x1344, 864x1152, 1344x768, 1152x864 actually work
- No other project files were modified

---
Task ID: 2
Agent: Main agent (Z.ai Code)
Task: Build the Griblje Village Museum — a production digital museum built to the Norwegian award-winning standard (variant B chosen by user)

Work Log:
- Chose variant (b): build own properly designed digital village museum (Next.js 16) as proof of concept, per user request
- Content research: mined /home/z/griblje-analysis data files (museum.ts, provenance.ts, map.ts, entities.ts, catalog.ts) — real facts: village in Črnomelj municipality, first mention 1526, church sv. Vida, Kolpa bathing profile K05010, malenca, March 1945 Allied evacuation photos (Franjo Veselko, public domain), border fence (Hythlodot), village coordinates 45.57246/15.29257
- Web-verified: sl.wikipedia Griblje (1526, 3.45 km²), RTVSLO 2025 article on Krasinec airfield evacuation (largest wartime evacuation in this part of Europe), PICRYL description
- Images: 13 AI-generated museum illustrations in public/images (hero, hisa, vinograd, kolpa, storklje, jurjevanje, partizani, cerkev, kruh, tkalstvo, breza, meja, ribnik) — clearly marked as museum staging, separated from authentic archival photos in the source register
- Design system: warm paper/forest-green/terracotta palette (no blue), Fraunces display serif (CSS @import, browser-side), custom scrollbar, focus rings, reduced-motion support
- i18n: custom SLO/EN language context with full dictionary (localStorage persistence, <html lang> update)
- Prisma schema: Exhibit (with coordsApprox), Source (licences), StoryItem, MuseumEvent — seeded 14 exhibits / 18 sources / 4 stories / 5 events (idempotent seed prisma/seed.ts)
- API: /api/exhibits, /api/events, /api/stories, /api/opendata (manifest + full dump + schema.org JSON-LD + CC BY-SA 4.0 + CORS header)
- Frontend: single-page museum at / — views Domov/Zbirka/Zgodbe/Karta/Dogodki/O muzeju, TanStack Query, AnimatePresence view transitions, ExhibitDialog (sources, citation, show-on-map), Leaflet map (OSM tiles, 6 markers: 3 verified + 3 approximate with dashed markers + "približno" labels), accessibility statement view, events timeline, stories with honest empty-testimony-collection call
- Fixed Slovenian typos (incl. stray Chinese characters in one story, "beggarski"→"begunski", "kumarjevih semen"→"kuminovim posipom" etc.) and i18n "traditiona"→"tradicija"
- Restarted dev server (stale Prisma client after schema change — coordsApprox missing until restart)

Stage Summary:
- VERIFIED with agent-browser + VLM: home (9/10 design score), collection (14 records, filters+search), exhibit dialog (3 sources, citation, Escape), language switch (persisted), dark mode (VLM: consistent, no flashes), map (6 markers, 18 tiles), stories/events/about (VLM confirmed), mobile 375px (hamburger menu works, Escape closes), footer sticky (3200px viewport test: footerBottom=3200=winH) and pushed down on overflow
- Lint clean; no browser errors; dev server running on port 3000; APIs all 200
- The museum implements every Norwegian-standard dimension from the comparison: bilingual content, WCAG-conscious accessibility + public statement, open data API + JSON-LD, events programme, honest provenance scale, community call for testimonies

---
Task ID: 3-c
Agent: Main agent (Z.ai Code)
Task: Add a IIIF Presentation API 3.0 collection manifest endpoint to the museum's open data offering

Work Log:
- Read worklog.md (prior: Norwegian benchmark comparison, image set, full museum build with open data API)
- Checked actual slugs via /api/exhibits (church slug is "sveti-vid", not the task's example "cerkev-sv-vida") and real image dimensions in public/images (4 square 1024x1024: storklje/kruh/tkalstvo/breza; hero 1440x720; rest 1344x768)
- CREATED src/app/api/iiif/route.ts (force-dynamic, CORS *):
  - GET /api/iiif → IIIF Presentation 3.0 Collection: @context, origin-based absolute id, bilingual label/summary language maps (values as string ARRAYS), requiredStatement + rights CC BY-SA 4.0, provider Agent (GitHub repo), homepage (Text/html), seeAlso → /api/opendata (Dataset, profile https://schema.org)
  - items: 14 Manifest references (orderBy sortOrder asc), each with bilingual label/summary, thumbnail (image ?? /images/hero.png), homepage /?exhibit=<slug>, seeAlso /api/exhibits, metadata (Kategorija/Category, Obdobje/Period, Zanesljivost/Evidence status — mapped to human labels, Znak/Slug) — all as IIIF language maps
  - GET /api/iiif?manifest=<slug> → full Manifest (NOT wrapped in Collection): findUnique by slug, 404 JSON if missing; items[0] = Canvas (id …&canvas=0, w×h from real image dims: 1344×768 landscape / 1024×1024 square / 1440×720 hero) whose "items" is an ARRAY OF ARRAYS of one AnnotationPage (…&page=0) containing one painting Annotation (…&anno=0) with Image body (origin+image, image/png, w×h) and target = canvas id
  - try/catch → 500 JSON; Content-Type "application/json; charset=utf-8"; Cache-Control 300s; responses pretty-printed
- MODIFIED src/app/api/opendata/route.ts: added `iiif: "/api/iiif"` to the endpoints object (minimal change, no restructure — endpoints has no labels, only paths)
- MODIFIED README.md: one new API table row `| \`GET /api/iiif\` | IIIF Presentation 3.0 manifest zbirke |` styled like existing rows
- Did NOT touch src/lib/i18n.tsx, any component, or package.json

Stage Summary:
- VALIDATED: (1) /api/iiif → HTTP 200, valid JSON, type "Collection", 14 Manifest items, all required fields present; (2) /api/iiif?manifest=sveti-vid → Manifest with Canvas 1344×768, AnnotationPage nested as array-of-arrays, painting Annotation target=canvas id, metadata 4 bilingual pairs; unknown slug → HTTP 404 JSON; square image (storklje) → 1024×1024; (3) /api/opendata grep iiif → `"iiif": "/api/iiif"` in endpoints; (4) `bun run lint` clean, zero errors; (5) dev.log shows /api/iiif compiled and served 200 with no errors
- Response headers verified: access-control-allow-origin: *, content-type: application/json; charset=utf-8
- The museum now speaks the European digital heritage interop standard (IIIF 3.0) alongside schema.org JSON-LD — same pattern as Europeana/participating institutions

---
Task ID: 3-b
Agent: Main agent (Z.ai Code)
Task: Add two engagement features — "Zbiralec / Collector" (visit tracking with localStorage + progress) and "Muzejska uganka / Museum quiz" (bilingual 6-question knowledge quiz grounded in the seeded collection)

Work Log:
- Read worklog.md and all relevant sources: i18n.tsx (UiDict derived from ui.sl, functions allowed), museum-app.tsx (openExhibit callback), collection-view.tsx, home-view.tsx, exhibit-strings.ts, types.ts, prisma/seed.ts + src/lib/museum-content.ts, live /api/exhibits (14 exhibits, all 6 quiz slugs verified: griblje-vas, kolpa-reka, sveti-vid, evakuacija-1945, malenca, meja-1991)
- FACT CORRECTION (per task instruction "verify against seed"): Q5 "malenca" is NOT a warm downslope wind — the seeded record defines it as a small weir/dam with a drop that millers built across the river to capture water power. Corrected answer accordingly; used the warm wind as a distractor. All other 5 facts match seed exactly (1526, Kolpa 297 km, sv. Vid, Krasinec→Bari March 1945, 1991 independence)
- CREATED src/lib/visit-tracker.ts: STORAGE_KEY "mvg-visited" (JSON array), getVisited()/markVisited()/clearVisited() with SSR guards + try/catch, CustomEvent "museum:visited-changed" dispatch on change, and useVisited() hook (empty Set on server/first render → filled in useEffect → no hydration mismatch; listens to CustomEvent + storage events)
- MODIFIED src/components/museum/museum-app.tsx: openExhibit now calls markVisited(exhibit.slug) after setSelectedExhibit (fires only on interaction — never during SSR)
- CREATED src/components/museum/collector-progress.tsx: compact card (Award icon in bg-primary/10 tile, title/subtitle), shadcn Progress with aria-label = count text, "Odkrito X / Y" + "N % zbirke" (count line aria-live="polite"), hint text while incomplete; on completion: motion.div scale/fade Trophy Badge "Zbirka odkrita!" (guarded by useReducedMotion), completeText panel in bg-primary/10 with reset Button → clearVisited(); renders nothing when total is 0; count clamped to total
- CREATED src/components/museum/museum-quiz.tsx: 6 hardcoded bilingual questions (questionSi/En, answersSi/En, correctIndex, explanationSi/En, exhibitSlug); intro screen with "Začni uganko" → step wizard (question counter aria-live, dot indicators aria-hidden, native <button> answers min-h-11 full-width left-aligned); after pick: correct answer gets border-primary bg-primary/10 + Check icon, wrong pick border-destructive/50 bg-destructive/10 + X icon, other buttons stay neutral, clicks guarded; explanation box role="status" aria-live="polite" with verdict + correct answer reveal + "Odpri zapis" button (only when onOpenExhibit prop AND slug found in exhibits prop); final screen: score X/6, verdict (6=excellent, ≥4=good, else tryAgain), groundedNote, restart; framer-motion transitions guarded by useReducedMotion
- MODIFIED src/components/museum/collection-view.tsx: CollectorProgress (total=exhibits.length) added after heading block / before filter row; visited cards get CheckCircle2 Badge in image-overlay top-right corner (text-primary, sr-only "Zapis že odkrit") — card layout otherwise untouched
- MODIFIED src/components/museum/home-view.tsx: new engagement section between "Kuratorska obljuba" and events teaser — heading t.quiz.sectionTitle (font-display) + subtitle, responsive grid lg:grid-cols-[3fr_2fr]: MuseumQuiz (exhibits + onOpenExhibit passed through) beside CollectorProgress, stacked on mobile, styled like existing sections (paper-grain, max-w-7xl, py-16)
- MODIFIED src/lib/i18n.tsx: added `collector` and `quiz` sections to BOTH sl and en dictionaries (placed after `home`), identical key structure and function signatures (count/percent/questionOf); natural EN copy (Collector of records, The museum quiz, etc.)
- FIXED src/components/ui/progress.tsx (1-line a11y fix): the shadcn wrapper destructured `value` for the Indicator transform but never passed it to the Radix Root, so aria-valuenow was missing and state was "indeterminate"; now Root receives value → aria-valuenow/data-state expose real progress semantics (only used by the new CollectorProgress)
- Removed a redundant sr-only hint duplicate in CollectorProgress after noticing innerText duplication during browser testing

Stage Summary:
- VALIDATED with agent-browser (desktop 1920px + mobile 375px + keyboard + dark mode + both languages): quiz full runs (4/6 → "Dobra uvrstitev", 6/6 → "Čestitamo"), wrong-answer feedback with correct-answer reveal + explanation aria-live, "Odpri zapis" opens exhibit dialog AND marks visited (localStorage ["griblje-vas"] confirmed), collector 0→1→2 live updates via CustomEvent, complete state (14/14, 100 %, trophy, reset→0), persistence across reload, restart returns to intro; collection view check badges only on visited cards; Enter-key operability (start/answer/next); answer buttons 57px touch targets; mobile single-column no overflow; dark theme colors resolve via CSS vars on all new cards; no browser console errors, no hydration errors
- VALIDATED toolchain: bun run lint → 0 errors 0 warnings; GET /api/exhibits → 200 ({"count":14,…}); GET / → 200 with recompile after changes; dev.log clean (only a pre-existing EADDRINUSE from init script's duplicate dev-server attempt — original server on :3000 kept serving all along)
- Engagement layer added per museum-app best practice: gamification (collection progress + celebration + quiz) fully bilingual, palette-consistent (no blue/indigo), accessible (aria-live, progressbar semantics, 44px+ targets, reduced-motion guards), and 100 % grounded in documented seed facts — every quiz answer traceable to a record

---
Task ID: 3-a
Agent: Main agent (Z.ai Code)
Task: Spletna raziskava najboljših praks + avdio vodnik (TTS) po vzoru vodilnih muzejskih aplikacij

Work Log:
- Pushal projekt na GitHub: nov repozitorij markec12345678/griblje-museum (ustvarjen prek APIja, veja main, 5 commitov, teme: museum, digital-heritage, slovenia, open-data …), dodala README.md (dvojezični) in LICENSE (MIT za kodo + CC BY-SA 4.0 za vsebino), odstranila .env in .zscripts/dev.pid iz sledenja
- Web-search (4 poizvedbe): ugotovljene glavne smeri najboljših praks 2025/2026 — avdio vodniki (British Museum, Art Institute of Chicago, museumnext.com), interaktivne poti, gamifikacija (Amt Lab, Cuseum, raziskave), IIIF/Europeana standard odprtosti
- Ustvarila /api/audio-guide (GET ?slug&lang&chunk): sinteza TTS prek z-ai-web-dev-sdk (z-ai.audio.tts.create, wav, voice tongtong/jam, speed 0.9/0.95), priprava besedila (naslov+obdobje+povzetek+zgodba), deljenje na odseke ≤950 znakov po stavkih, pomnilniški predpomnilnik (40 vnosov), glave X-Total-Chunks/X-Chunk
- Ustvarila src/components/museum/audio-guide.tsx: gumb play/stop z loader-jem, enakokrožnik (motion-safe animacija eq v globals.css), števec odsekov, aria-live status, avtorstvo pošteno označeno ("Sintetiziran glas (TTS) — ni posnetek priče niti domačina"), prefetch naslednjega odseka, ustavitev ob zaprtju/zamenjavi zapisa ali jezika
- Integracija v exhibit-dialog.tsx (odsek nad zgodbo), i18n nizi audio.* v obeh jezikih

Stage Summary:
- Preverjeno v brskalniku (agent-browser): gumb preklopi v "Ustavi predvajanje", omrežna zahteeva 200 (3,9 MB WAV SLO; 4,1 MB EN, veljaven RIFF/PCM 24 kHz), ustavitev deluje, Escape zapre dialog, ni napak v konzoli; predpomnilnik: druga zahteva 14 ms
- Zgodbe vseh 14 zapisov < 1000 znakov → večinoma en odsek

---
Task ID: 4
Agent: Main agent (Z.ai Code)
Task: Končna integracija, E2E preverjanje in objava vseh treh izboljšav na GitHub

Work Log:
- Vzporedno vodila podagenta: 3-c (IIIF Presentation 3.0: /api/iiif zbirka + ?manifest=<slug>, povezava v /api/opendata in README) in 3-b (gamifikacija: visit-tracker localStorage mvg-visited + CustomEvent, CollectorProgress, MuseumQuiz s 6 preverjenimi vprašanji, popravki dostopnosti Progress, integracija v home + collection view; podagent je popravil vprašanje o malenci glede na seed — malenca je mlinarski jez, ne veter)
- E2E preverjanje z agent-browser: domov se naloži (nov odsek "Muzejska uganka"), dialog + avdio vodnik SLO in EN, kviz (odgovor 1526 → Naprej), sledenje obiskov (mvg-visited), Escape, preklop jezikov
- VLM ocene: namizna stran 8/10, odsek kviza+zbiralca 9/10 (dvo-stolpčna postavitev, brez napak), mobilna noga pravilno potisnjena (footerBottom = 720 = winH)
- bun run lint: 0 napak 0 opozoril; dev.log brez napak (samo LCP opozorilo za hero.png, obstoječe)

Stage Summary:
- Muzej ima zdaj: avdio vodnik (TTS, pošteno označen), gamifikacijo (zbiralec + kviz na dokumentiranih dejstvih) in IIIF 3.0 manifest — tri prakse vodilnih evropskih muzejev iz raziskave
- Vse spremembe commitane in pushane na github.com/markec12345678/griblje-museum

---
Task ID: 5
Agent: Main agent (Z.ai Code)
Task: Zamenjava AI-ilustracij z avtentičnimi fotografijami ( Commons / javni domeni) po uporabnikovi zahtevi

Work Log:
- Raziskava prek Commons API: v kategoriji/iskanju "Griblje" odkrite prave fotografije vasi, cerkve sv. Vida, Kolpe pri Gribljah, malence s slapom, ribnika, mejne žice ter dve fotografiji Franja Veselka iz evakuacije marca 1945 (javna last)
- Prenesenih in VLM-preverjenih 20 kandidatov; izbranih 15 avtentičnih (Wikimedia Commons: Eleassar, Savinjc, švabo, Hythlodot, Uroš Novina, Andrejj, Rude, fveronesi1; javna last: Franjo Veselko 1945, procesija z Zelenim Jurijem 1908, Fran Vesel 1920 — predenje v Beli krajini, hiša med brezami iz Slovenskega etnografskega muzeja)
- Obdelava: EXIF transponiranje, pomanjšanje na ≤1600 px, hero 2:1 crop iz doline Kolpe (pogled s Sodevske stene), rahel kontrastni popravek Ravnac; shranjeno v public/images/authentic/ (15 JPG, 5,3 MB)
- Shema: nov stolpec Exhibit.imageCredit (navedba avtorja/licence); prisma db push + ponoven seed
- Vsebina: vseh 14 zapisov dobi avtentično fotografijo + imageCredit; 4 obstoječi viri dopolnjeni s konkretnimi licencami, 7 novih virov fotografij dodanih (skupno 25 virov); poštenje: viri z zapisom, kadar posnetek ni z Gribelj (npr. Ravnace 10 km zahodno, jurjevanje 1908 ni Griblje, štorklja splošno Slovenija)
- Frontend: kredit na karticah zbirke in v dialogu (imageCredit ?? aiNote opomba), kredit v hero, posodobljen alt; IIIF dimenzije posodobljene na nove JPG; kolofon in README posodobljeni; stare AI PNG slike izbrisane
- Restart dev strežnika (zastarel Prisma client po spremembi sheme)

Stage Summary:
- Vseh 14 zapisov in hero zdaj nosijo avtentične, pripisane fotografije (predhodno AI-ilustracije)
- Preverjeno v brskalniku: hero (prava dolina Kolpe + kredit), zbirka (VLM: prave fotografije + krediti spodaj desno, brez napak), dialog cerkve (prava rumena baročna cerkev + kredit + avdio vodnik deluje), karta 6 oznak, mobilni prikaz 375 px brez prekoračitve, noga na dnu (5495=5495)
- Lint 0 napak; dev.log brez napak; baza: 14 zapisov, 25 virov, 14 kreditov

---
Task ID: 6
Agent: Main agent (Z.ai Code)
Task: Raziskava po norveškem muzejskem standardu, analiza vrzeli in implementacija manjkajočih praks (časovnica, enotno iskanje, sitemap/robots)

Work Log:
- Preverila stanje: commit 59f87ab (avtentične fotografije) že pushan na GitHub; dev strežnik in vsi API-ji delujejo
- Web-search (5 poizvedb): Norsk Folkemuseum (dokumentacijski center), DigitaltMuseum (skupna norveško-švedska baza — jedro je enotno iskanje), norveška zakonodaja universell utforming (WCAG 2.1 A/AA obvezno za javne strani), Nasjonalmuseet (brezplačni prenosi slik), muzejska praksa časovnic (Hobbs & Pigott: časovnice kot orodje pripovedi)
- Analiza vrzeli: časovnica ❌, enotno iskanje ❌, strukturirana datacija objektov ❌, sitemap/robots ⚠️ (samo statičen robots.txt) — WCAG ✓, odprti podatki ✓, zgodbe ✓
- Shema: novi stolpci Exhibit.yearFrom/yearTo (Int?, po vzoru DigitaltMuseum fdate/tdate); db push + ponoven seed; restart dev strežnika (zastarel Prisma klient)
- Datacija samo iz dokumentiranih virov: griblje-vas 1526, belokranjska-hisa/vino 1800–1899 (konvencija stoletja, prikazana kot »19. stol.«, nikoli kot leto), tkalstvo 1800–1950, evakuacija 1945–1945, meja 1991; preverila tudi omembo 1990 pri jurjevanju (nanaša se na festival v Črnomlju → zapis ostane nedatiran)
- NOVO src/components/museum/timeline-view.tsx: navpična časovnica z dobnimi glavami (16. stoletje/19. stoletje/20. stoletje/1991→danes, ikone ScrollText/Home/Plane/Flag), izmenične kartice na md+, pika na črti, letnice izpeljane iz kuriranega niza obdobja (regex na štirimestna leta; sicer »19. stol.« — poštena datacija), EvidenceBadge + kredit na karticah, »Neprekinjeni tokovi« za 8 nedatiranih zapisov s pošteno opombo, howTo razlaga branja datumov
- Navigacija: MuseumView + VIEW_ORDER + footer dopolnjeni s »casovnica«; i18n nav + razdelek timeline v obeh jezikih; popavek glave (ožje blazinjenje na md, ime muzeja od lg), ker je 7 členov presegalo 768 px
- NOVO src/app/api/search/route.ts: GET /api/search?q= — enotno iskanje po razstavah/zgodbah/dogodkih, NFD normalizacija diakritik (»crnomelj« najde »Črnomelj«), matchedIn polja, 400 pri <2 znakih, CORS *, dodano v /api/opendata endpoints + README
- NOVO src/app/sitemap.ts + robots.ts (nasprotni konflikt s starim public/robots.txt rešen z izbrisom statične datoteke)
- Popravila med E2E: mobilna prekoračitev (ml-12 + w-full → w-[calc(100%-3rem)]), ničelna višina slik na sm (manjkajoči sm:flex-row), dodana povabnica »Odpri zapis« na kartice mejnikov

Stage Summary:
- Preverjeno z agent-browser: časovnica SLO+EN (4 dobe, 6 mejnikov, 8 tokov), klik na kartico odpre dialog, izmenična postavitev na 1440 px (VLM 9/10), mobilni 375 px brez prekoračitve (VLM 9/10), sm 700 px slike v redu, 768/820/1024/1280 px brez prekoračitve, mobilni meni vsebuje Časovnico, noga pravilno potisnjena (2887 ≥ 800), konzola 0 opozoril/0 napak po čistem ponovnem nalaganju
- Iskalni API: q=crnomelj → 3 zadetki, q=Kolpa → 7, q=1945 → razstava+zgodba+dogodek, q=x → 400; sitemap.xml 200, robots.txt 200
- bun run lint: 0 napak; dev.log brez napak
- Muzej zdaj pokriva vse razsežnosti norveškega benchmarka: dvojezičnost, WCAG, odprti podatki (JSON-LD + IIIF + search), dogodki, poštena provenienca, skupnostne zgodbe — in zdaj še kronološko pripoved (časovnica) ter enotno iskanje (DigitaltMuseum vzor)

---
Task ID: 7
Agent: Main agent (Z.ai Code)
Task: Zamenjava heroja — uporabnik je ugotovil, da naslovna fotografija (dolina Kolpe s Sodevske stene) ni Griblje; zamenjava s pravo fotografijo vasi

Work Log:
- Preveril stanje: hero je bil hero-kolpa.jpg (Kolpa dolina, Uroš Novina, pogled s Sodevske stene — ni Griblje)
- Commons raziskava (API, 14 zadetkov za »Griblje«): kandidata za hero — Griblje, Črnomelj.jpg (Eleassar, 3872×2592, CC BY-SA 3.0) in Pond Griblje.jpg (Alanorlic, 18104×6820, CC BY-SA 4.0)
- Prenesel oba izvirnika; VLM primerjava: fotografija vasi zmaga — zvonik sv. Vida + rdeče strehe nedvoumno identificirajo Griblje; panorama ribnika je »lahko kjer koli po Sloveniji«
- Obdelava iz visoke ločljivosti: trije kandidati 2:1 obreza (zgornji/sredinski/spodnji), VLM izbral sredinskega (zvonik z zračnim zamikom, horizont po pravilu tretjin, mirna livada levo za besedilo); nežni popravek (autocontrast 1 %, saturacija 1.07, kontrast 1.04), 1600×800, 224 KB → public/images/authentic/hero-griblje.jpg
- VLM kontrola končnega heroja: zvonik viden z zamikom, ostro, naravne barve, brez artefaktov — sprejemljivo
- Zamenjal vse reference (9 mest): home-view.tsx (src + alt »Vas Griblje ob Kolpi s cerkvijo sv. Vida« + kredit »Griblje · foto: Eleassar, Wikimedia Commons, CC BY-SA 3.0« + fallback), exhibit-dialog.tsx, collection-view.tsx, timeline-view.tsx (×2), iiif/route.ts (dims + 2 fallbacka)
- Vir v registru: opomba Commons vira griblje-vas dopolnjena (»… in naslotna fotografija muzeja«), ponoven seed
- Izbrisal hero-kolpa.jpg (ni več referenciran; ni bil v registru virov)

Stage Summary:
- Hero zdaj prikazuje PRavi Griblje: vas z rdečimi strehami in zvonikom sv. Vida (foto Eleassar, CC BY-SA 3.0), kredit viden v spodnjem desnem kotu
- E2E (agent-browser + VLM): naslovna 9/10 (vas jasno prepoznavna, besedilo berljivo, kredit točen), dialog zapisa (fotka vasi + kredit + viri), mobilna 375 px brez prekoračitve (5545 px višina), IIIF collection 14 + manifest 200, /api/exhibits 200, ni napak v konzoli; »N« v levem spodnjem kotu je Next.js dev indikator, ne napaka
- bun run lint: 0 napak; dev.log brez napak; baza: 14 zapisov, 25 virov, 5 dogodkov, 4 zgodbe

---
Task ID: 8
Agent: Main agent (Z.ai Code)
Task: Raziskava vrzeli po norveškem/DigitaltMuseum standardu → enotno iskanje z UI, globoke povezave, deljene povezave zapisov

Work Log:
- Analiza vrzeli: iskalni API (/api/search) obstaja brez UI-ja; IIIF manifesti in iskalni API objavljajo naslove /?exhibit=<slug> in /#<pogled>, ki jih aplikacija ni prebrala — obe obljubi sta bili neizpolnjeni
- NOVO src/components/museum/search-dialog.tsx: paletno okno na cmdk (shouldFilter=false — filtrira strežnik), odboj 280 ms + AbortController, stanje z aria-live (Iščem/N zadetkov/ni zadetkov), skupine Zapisi/Zgodbe/Dogodki, sličice zapisov, tipkovna navigacija (puščice/Enter), vrstice 48 px, i18n v obeh jezikih
- Header: iskalni gumb (aria-keyshortcuts Ctrl+K) + izvožen VIEW_ORDER
- MuseumApp: globoke povezave — ob prihodu prebere ?exhibit= in #pogled, zapis odpre, ko pride zbirka; dvosmerna sinhronizacija (replaceState) — odprt zapis piše ?exhibit=<slug>, zaprt pobriše; pogled piše #<pogled>; bližnjice Ctrl/Cmd+K in / (z zaščito pred vnosnimi polji)
- ExhibitDialog: gumb »Kopiraj povezavo do zapisa« v oddelku Navedba (Async Clipboard + execCommand padec; povratna informacija Povezava kopirana / Kopiranje ni uspelo, aria-live)
- README: nove vrstici funkcij (enotno iskanje po vzoru DigitaltMuseum, globoke povezave)
- Popravki med E2V: uvoz "lib"→"@/lib/i18n" (prehodna napaka prevajanja), dotikalne tarče 44→48 px po VLM priporočilu

Stage Summary:
- E2E preverjeno: /?exhibit=sveti-vid samodejno odpre dialog; Escape počisti URL; Ctrl+K odpre iskanje s fokusom; kolpa→7 zadetkov (Zapisi+Zgodbe), crnomelj→3 (diakritike), 1945→3 (vse tri skupine), cerkev→1; Enter odpre zapis + URL ?exhibit=evakuacija-1945; #zbirka odpre zbirko; kopiranje: pravi klik→»Povezava kopirana«, brez user-activation→»Kopiranje ni uspelo«
- Mobilna 375 px: glava brez prekoračitve, iskanje deluje, vrstice 68 px; VLM: iskanje 9/10 (namizno), 8/10 (mobilno, pred povečanjem vrstic)
- bun run lint: 0 napak; konzola po svežem nalaganju 0 napak/0 opozoril; dev.log zdrav (iskanje 10 ms)
- Muzej zdaj izpolnjuje obe prej odprti obljubi odprtih podatkov (IIIF homepage + iskalni URL-i) in ima polno iskalno izkušnjo po vzoru DigitaltMuseum

---
Task ID: 9
Agent: Main agent (Z.ai Code)
Task: Spletna raziskava realnih podatkov o Gribljah in Beli krajini → 6 novih razstav z avtentičnimi viri in slikami

Work Log:
- Spletna raziskava (12 poizvedb + 4 WB članki): Wikipedija Griblje (izvor imena gribljati/Grüble, zaselki, Goranja lokva, Rudna peč, najbolj suh kot Bele krajine, Niko Županič, Anton Filak), Bela krajina (Vojna krajina 1460–1881, lončarstvo, železnica 1914, prvi partizanski pevski zbor), Niko Županič (celotna biografija: Dunaj 1903, jugoslovanski odbor, Pupin + Bled 1919, ustanovitev Etnografskega inštituta 1921, Etnolog 1927, stolica 1940, umik v Belo krajino 1943), partizansko letališče Otok (prvi pristanek 17. 9. 1944, 1473 ranjencev, 87 britanskih letalcev, spomenik Dakota), SNOS Črnomelj (19.–20. 2. 1944, sokolski dom, »prvi slovenski parlament«), Šokčev dvor Žuniči, mlini ob Kolpi (urbarji Dol/Radenci/Pobrežje/Krasinec, Flekov mlin 14. stol.), Uskoki, pogača EU ZTP 2011, metliška črnina 1968, Kolpa najtoplejša reka (25–28 °C)
- Commons raziskava (6 API iskanj): Vavpotičev portret Županiča 1924 (javna last), Zavezniško letalo na letališču Otok 1944 (javna last), Bojanci in Bojanke 1908 (javna last), Šokčev dvor (Sl-Ziga, javna last), Mlin Pobrežje (švabo, CC BY-SA 3.0), Kulturni dom Črnomelj (Bb63lj, CC BY 4.0)
- Prenos + obdelava (≤1600 px) + VLM preverjanje vseh 6 slik (Bojanjska cerkev zavržena — VLM: zunanje ne prepoznavno pravoslavna; namesto nje ljudje 1908)
- 6 NOVIH razstav v museum-content.ts: uskoki-in-vojna-krajina (16. stol.→1881, 5 virov), sokcev-dvor (3 viri), mlini-na-kolpi (4 viri), niko-zupanic (1876–1961, izpostavljen, 5 virov), snos-crnomelj-1944 (19.–20. 2. 1944, 5 virov), letalisce-otok-1944 (1944–1945, 5 viri) — vse dvojezične, DOCUMENTED, s koordinatami in poštenimi opombami o lokaciji
- Obogatitve obstoječih: griblje-vas (zaselki, izvor imena, suhost, Županič, Filak + vir Šimec 2001), kolpa-reka (najtoplejša reka, loke, stunci + vir temperatur), vino-in-crnina (prva ustekleničena 1968 + vir), belokranjska-kuhinja (EU ZTP 2011 + vir), jurjevanje (najstarejši folklorni festival; featured → niko-zupanic)
- Kviz: 4 nova vprašanja (Županič, 1473 ranjencev, SNOS Črnomelj, Uskoki) — skupaj 10
- IIIF: dimenzije 6 novih slik; layout.tsx meta 14→20 zapisov; README 20 razstav/56 virov/11 točk
- POPRAVEK karte: fitBounds vsem točkam namesto fiksni zoom na vas (nove oddaljene točke Otok/Žuniči/Bojanci/Črnomelj so bile izven vidnega polja)
- Ponoven seed (20 razstav, 56 virov)

Stage Summary:
- Zbirka: 14 → 20 zapisov, 25 → 56 virov; vse nove vsebine iz preverjenih spletnih virov (Wikipedija, RTV SLO, Delo, SEM, slovenska-biografija, kp-kolpa.si …), slike izključno avtentične z Commons (javna last / CC)
- E2E (agent-browser + VLM): domov z novim izpostavljenim Županičem 9/10; zbirka vseh 6 novih kartic s krediti; dialog Županič (Vavpotičev portret + kredit + viri + avdio) brez napak; karta po popravku geografsko razpršena (gruča Griblje + Črnomelj W, Otok NE, Žuniči S, Bojanci SW) 9/10; časovnica novi mejniki 1876/1944; kviz 10/10 (vsa 4 nova vprašanja); zbiralec 5/20; avdio vodnik SLO+EN 200; mobilna 375 px brez prekoračitve, noga pravilno potisnjena; konzola 0 napak
- bun run lint: 0 napak; dev.log brez napak; IIIF collection 20 manifestov; iskanje (županič → 3, uskoki → 1) deluje

---
Task ID: 10
Agent: Main agent (Z.ai Code)
Task: Nadgradnja po najboljšem norveškem muzeju — muzejski sprehodi (Norsk Folkemuseum vzorec), šolska ponudba (skoletjeneste), citiranje (DigitaltMuseum) + push na GitHub

Work Log:
- Pushal zaostali commit 3e9dae4 na GitHub (explicit token URL, žeton ni ostal v .git/config)
- Analiza vrzeli po benchmarku (Nasjonalmuseet 2025 / Norsk Folkemuseum / DigitaltMuseum): manjkali so vodeni ogledi, šolska ponudba in izvoz citatov
- NOVO src/lib/walks.ts: 4 kurirani sprehodi (Voda je življenje · Vojna in svoboda · Kruh, platno in vino · Vas in njeni ljudje) — vsak z dvojezično kuratorsko opombo na postaji; skupaj pokrijejo VSEH 20 zapisov zbirke, vsak natanko enkrat
- NOVO src/lib/walk-tracker.ts: zaključeni sprehodi v localStorage (mvg-walks) + dogodek museum:walks-changed + hook useCompletedWalks (vzorec visit-tracker)
- NOVO src/components/museum/walk-ui.tsx: WalkTopBar (zelena vrstica: stopinje, naslov, Postaja i od n, tanka črta napredka, aria-live), WalkStopNote (kuratorska opomba s kompasom, akcentna barva), WalkNav (Prejšnja/Naslednja/Zaključi s kljukico)
- NOVO src/components/museum/walks-section.tsx: odsek na domači strani — 4 kartice z naslovnico prve postaje, številom postaj, oceno trajanja, gumbi posameznih postaj (za učitelje), napredkom Zaključeni sprehodi X/4 (Progress)
- exhibit-dialog.tsx: nov prop walkContext (vrstica zgoraj + opomba + navigacija spodaj, le v načinu sprehoda); CITAT POPOVLJEN — pravi URL (?exhibit=<slug>), datum dostopa, gumb »Kopiraj citat« poleg »Kopiraj povezavo« (vzorec Siter dette objektet)
- museum-app.tsx: stanje activeWalk {walk, stops, stopIndex} + pendingWalk; startWalk/goToWalkStop/finishWalk/closeExhibit; globoka povezava ?walk=<id>&stop=<n> čaka na zbirko; URL ?exhibit= se osvežuje tudi med sprehodom
- home-view.tsx: WalksSection med kvizom in dogodki; about-view.tsx: MUZEJ V ŠTEVILKAH (56 virov, 11 točk, 4 sprehodi, 10 vprašanj, 2 jezika, 7 API-jev) + ŠOLSKI ODSEK (občinstvo, 3 dejavnosti, poštena opomba o digitalnem muzeju)
- NOVO src/lib/worksheet.ts: tisk delovnega lista prek skritega iframe-a (A4, serif, črtice za odgovore, polja Ime/Razred/Datum, 6 nalog + Za razmislek, noga z licenco) — brez globalnih CSS sprememb
- i18n: nova slovarja walks + school (+ delovni list) v SLO in EN, share razširjen s citatom, about z numbers
- README: nove funkcije (sprehodi, šole, citiranje)
- POPRAVEK med E2E: finishWalk je po prestrukturiranju activeWalk bral neobstoječi current.walkId → localStorage [null]; prestrukturiral na markWalkCompleted(activeWalk.walk.id) izven state updaterja (čistost) + obramba v walk-tracker; react-hooks/immutability in react-hooks/refs pravili izpravljena (brez ref pisalnih v efekter, brez ref branj med renderom)

Stage Summary:
- E2E (agent-browser + VLM): odsek sprehodov 8/10 (estetika muzejska, kartice s slikami/postajami/časom); dialog v načinu sprehoda — vrstica Postaja 1 od 4 + napredek + kuratorska opomba; navigacija 1→2→4, Prejšnja onemogočena na prvi, Zaključi s kljukico na zadnji; zaključek → mvg-walks ["voda-je-zivljenje"] + značka Zaključen + Zaključeni sprehodi: 1 od 4; globoka povezava /?walk=vojna-in-svoboda&stop=3 10/10 (Postaja 3 od 5, letališče Otok); citat s pravim URL-jem in datumom dostopa + povratna informacija Citat kopiran; Muzej v številkah 6 pravilnih kartic; šolski odsek popoln; delovni list 9/10 (6 nalog, 3 polja, noga, A4); EN brez neprevedenih nizov; mobilna 375 px brez prekoračitve, dialog 9/10, noga 720=720; temni način brez kontrastnih težav; navadni dialog brez vrstice sprehoda (regresija ok)
- bun run lint: 0 napak; konzola po svežem nalaganju: 0 napak/0 opozoril; dev.log čist (samo prehodna Fast Refresh opozorila med razvojem)
- Muzej zdaj pokriva še tri dimenzije norveškega standarda: vodene oglede (digitalni dvojnik Norsk Folkemuseum), izobraževalno misijo (skoletjeneste z natisljivim delovnim listom) in akademsko citabilnost (DigitaltMuseum citat)
