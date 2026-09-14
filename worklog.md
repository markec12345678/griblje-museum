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
