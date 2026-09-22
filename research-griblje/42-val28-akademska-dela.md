# 28. val (77. sklop) — Akademska dela o Gribljih prek OpenAIRE: Grošeljeva etimologija (Linguistica 1972) + pelodno jedro »Griblje G3« (Documenta Praehistorica 2009) + popravek avtorstva Mason/Dular

**Datum:** 2026-09-22 · **Naročilo:** »odlicno nadaljuj raziskuj« (28. val; nadaljevanje po valih 21–27)

---

## Povzetek

Osmi sklenjeni val raziskave je **prebil kanal akademskih repozitorijev** — št. 1 izven-peskovniške vrste (»najobetaven neodprt korpus o vasi«) — in to ne skozi zablokirana direktna vrata (RUL F5 TSPD, DKUM JS, CORE Cloudflare), ampak skozi **javni agregator OpenAIRE** (`api.openaire.eu`, brez registracije), ki indeksira repozitorije in DOAJ. Dva preloma, en popravek avtorstva in trije viri v gradnji:

1. **Milan Grošelj: »Griblje«** — enostranska jezikoslovna opomba v *Linguistici* 12 (1972), str. 101 (DOI 10.4312/linguistica.12.1.101), **edina doslej znana znanstvena objava, ki jo naslavlja kar ime vasi**; ime po latinskih virih pomeni **»kosček obdelane zemlje«** (areola, particula terrae cultae); apelativ *griblja* = brazda; **Lexicon latinitatis medii aevi Iugoslaviae I** (Zagreb 1973), str. 519, s. v. *gribglia, gribilia* — primeri iz pogodb **1373** in **1499**; gradivo za Slovar slovenskega knjižnega jezika pri SAZU. Polno besedilo prebrano → **vir `groselj-1972` na MVG-068** + odstavek zgodbe SL/EN.
2. **Andrič & Mason (2009): Neolithic/Eneolithic settlement patterns and Holocene environmental changes in Bela Krajina** — *Documenta Praehistorica* 36, str. 327–335 (DOI 10.4312/dp.36.21), odprti dostop, polno besedilo prebrano: **pelodno jedro »Griblje G3«** (diagram T. Korošec) z radiokarbonsko kronologijo (Tab. 3) — antropogeni indikatorji v pasu **4400–3700 cal BC** z vrhom okoli **4100 cal BC**, poglobljen vpliv okoli **2500** in **1000 cal BC**; »**najpopolnejši novi dokaz za neolitski/eneolitski naselitveni vzorec prihaja ravno z območja Gribelj**«; Griblje = naselbina **na robu terase nad kanjonom Kolpe**; izkopavanja **1998–2001** financiralo Ministrstvo za kulturo → **vir `andric-mason-2009-dp36` na MVG-083** + odstavek zgodbe SL/EN.
3. **Popravek avtorstva (napačno pripisovanje):** temeljni članek *Griblje in problem nižinskih arheoloških kompleksov v Sloveniji* (*Varstvo spomenikov* 39, 2001, str. 7–27) pripisuje muzej dotlej **»Dular, A.«** — recenzirana bibliografija v DP36 (in citati »Mason 2001« v besedilu: »Mason 2001.10; 2008.20–21«) ga izrecno pripisuje **Philipu Masonu**. Vir `dular-2001-vs39` preimenovan v **`mason-2001-vs39`**, opomba vira zapiše popravek; odvisna opomba vira `vs-39-41-mason-2006` popravljena (»koleracija Masonovega članka«).

Rezultat vsebinsko dograjuje **obe vezni zgodbi muzeja**: etimologijo (ime vasi = kos obdelane zemlje — prvi recenzirani glas, 53 let star) in arheologijo (6000 let kmetovanja v polenu — najpomembnejše najdišče za naselitveni vzorec).

---

## Metoda

1. **OpenAIRE public API** (`api.openaire.eu/search/publications?keywords=Griblje&format=json&size=25`) — **nov kanal, prvi uspešni dostop do akademskih rezultatov**; 7 zadetkov, metapodatki (avtor, datum, DOI, URL primerkov) izluščeni iz odgovora (`oaf:result`).
2. **web_search spet deluje** (val 27 »degradacija — vrne samo domene« je bila prehodna; nov vzorec opuščen): `diplomsko delo Griblje Bela krajina repozitorij`, `site:repozitorij.uni-lj.si Griblje`, `site:dk.um.si Griblje`, `Andrič Griblje pelod Holocene` — s01–s05.
3. **DOI → journals.uni-lj.si** — openrestijski kanal brez challenge pri revijah FF UL: `doi.org/10.4312/linguistica.12.1.101` in `doi.org/10.4312/dp.36.21` → citation meta (pdf_url) → **direktni prenos PDF** + izvleček besedila (pypdf).
4. **Dedup proti živi bazi**: baseline val 28 iz `/api/opendata` (111/557/439/95) v `raw-web-val28-2026-10/dedup-baseline-val28.txt`; grep tema (etimologija/arheologija/pelod/neolit) → obe vsebini že obstajata kot MVG-068 in MVG-083 → val je **add-only viri + obogatitev**.

## Prelomi

### Prelom 1 — Grošelj (1972): ime vasi = »kosček obdelane zemlje«

OpenAIRE vrne publikacijo **»Griblje«, avtor Milan Grošelj, 1972-12-01, University of Ljubljana** (Linguistica; DOI + DOAJ + revija). Polno besedilo (1 stran):

- Gradivo za *Slovar slovenskega knjižnega jezika* v Inštitutu za slovenski jezik pri SAZU ima **listek za toponim Griblje**; navedena literatura izvaja ime iz *groblje*.
- Serbohrvaški slovarji za *griblja* navajajo pomen **»brazda«** (pl. »brazde«) → pomen **»kos obdelane zemlje«**, ki ga beseda ima v latinsko pisanih virih.
- **Lexicon latinitatis medii aevi Iugoslaviae I** (A–K), Zagreb 1973, str. 519, s. v. **gribglia, gribilia**: »*areola, particula terrae cultae: lijeha, komadić obrađene zemlje*«; dva primerka iz virov — **Kolendić, Slikar Juraj Čulinović u Šibeniku, a. 1499** (*in gribglia*) in **Smičiklas, Codex diplomaticus XIV 556/35, a. 1373** (*in gribiliis*).
- **Argumentum:** »*Nomen loci slov. Griblje proprie «areolam, particulam terrae cultae» significat, ut ex fontibus croaticis apparet.*«

Za muzej: domača razlaga (*gribljati* — brazdati, orati) dobi **prvi recenzirani znanstveni glas** z latinskimi primerki 1373/1499 — smer pomena je točno ta, ki jo pripoveduje beseda za brazdo. Razlaga ostaja zapisana pošteno: Grošelj interpretira apelativ, ne rešuje vseh podrobnosti (izvedba iz *groblja* na SAZU listku).

### Prelom 2 — Andrič & Mason (2009): jedro »Griblje G3« v naselitveni sliki Bele krajine

Polno besedilo *Documenta Praehistorica* 36 (str. 327–335), avtorja **Phil Mason** (Centre for Preventive Archaeology, ZVKDS) in **Maja Andrič** (Inštitut za arheologijo ZRC SAZU):

- **»The most complete new evidence for a Neolithic/Eneolithic settlement pattern comes from the Griblje area«** — najpopolnejši dokaz za naselitveni vzorec ravno z območja Gribelj; Griblje in Podklanec = **dve veliki najdišči v dolini Kolpe**; tipološko Griblje = **naselbina na robu terase/kanjona** (»canyon or terrace edge sites, e.g. Griblje, Moverna vas, Podklanec«).
- **Tab. 3 — radiokarbonska kronologija vegetacijskih faz pri Gribljih** (jedro G3, diagram T. Korošec): pred 7900 cal BC hrast/leska/lipa/breza/bor → 7900–6600 bukov gozd z občasnimi požigi → 6600–6000 krajina odprta, upad bukve → 6000–4400 obnova gozda → **4400–3700 povečan človekov vpliv (»anthropogenic indicator« taksoni) c. 4100 cal BC** → 3700–2800 bukov gozd → 2800–1000 poglobljen vpliv c. 2500 in 1000 cal BC.
- **Izkopavanja pri Gribljih 1998–2001** je financiralo **Ministrstvo za kulturo RS** (Gradac 1993–1995, Ržišča 2004 ločeno).
- Bibliografija prinaša **MASON P. 2001** — *Griblje in problem nižinskih arheoloških kompleksov v Sloveniji*, Varstvo spomenikov 39: 7–27 (ključna študija o vasi) + Mason 2008 (*Bela krajina v prazgodovini in rimskem obdobju*, v Weissovem Črnomaljskem zborniku).

### Popravek — napačno pripisovanje »Dular, A. (2001)«

- Muzej je na MVG-083 članek VS 39 (2001) 7–27 pripisoval **»Dular, A.«**.
- DP36 (2009, recenzirano): bibliografski zapis **MASON P. 2001** + citati v besedilu (*Mason 2001.10; 2008.20–21*) — avtor je **Philip Mason**. Dular je v DP36 samo za *Arheološko topografijo Slovenije XI* (1985) in gradišča (2001. 89–106) — druga dela.
- Popravljeno: ključ `dular-2001-vs39` → **`mason-2001-vs39`**, imena SL/EN, opomba vira z izrecnim zapisom popravka (kaj je bilo, kaj je zdaj, kaj je dokaz); odvisna opomba `vs-39-41-mason-2006` (»koleracija Dularjevega« → »koleracija Masonovega članka«).
- Dokazna disciplina: muzej popravlja lastne trditve takoj, ko pride boljši vir — in v opombi zapiše, kaj je bilo in zakaj.

## Vgradnja (atomarna, rep-strict)

- **+2 vrstici virov** (557 → **559**): `groselj-1972` na **MVG-068** (objava, odprti dostop, DOI URL) in `andric-mason-2009-dp36` na **MVG-083** (objava, odprti dostop, DOI URL).
- **+2 identiteti** (439 → **441**): doi.org/10.4312/linguistica.12.1.101 in doi.org/10.4312/dp.36.21 — novi URL; deljene ostajajo 65.
- **1 popravek avtorstva** (ključ + imena + opombe vira `mason-2001-vs39`) in **1 popravek odvisne opombe** (`vs-39-41-mason-2006`).
- **2 obogatitvi zgodbe** (SL+EN): MVG-068 — odstavek o Grošljevi opombi (latinistični argument, Lexicon I: 519, 1373/1499; »vas, ki se imenuje po kosu obdelane zemlje«) + časovna niansirka »znanstveno je vprašanje obdelal **tudi** Jože Šimec« (Grošelj je 29 let starejši); MVG-083 — odstavek o DP36 (G3, naselitveni vzorec, terasa nad kanjonom, kronologija 4400–3700/4100/2500/1000, MK 1998–2001).
- **Konstante v 5 skriptah**: 559 vrstic virov (test-entities ×3 mesta, test-timeline-map ×3, test-curator-red-team R0.3+R16.2, audit-timeline-map, audit-entities) in 441 identitet (test-entities, test-timeline-map, audit-entities) + sporočila »28. val: +2 …«.
- **Poučna epizoda (tehnična):** prejšnja seja je vgradnjo pustila **v treh napakah** (realni prelomi vrstic znotraj TS nizov storySi/storyEn na MVG-068, presežek `},` za novim virom, manjkajoč EN odstavek na MVG-083) — vse tri popravljene ob prevzemu (tsc 0 za popravkom); `\"`/`\n` v TS stringih ostajajo najpogostejša zmota urejanja (tretjič dokumentirano).

## Regresija (živi :3000 po reseed)

- `tsc --noEmit` = 0 · `bun run lint` = čist
- verify-i18n: **946 × 5**
- audit-entities: ✓ 0 napak (**111/559/441/65/372**; 95 entitet, 36 oseb; pokritost 82/111)
- audit-timeline-map: 39 ✓/0 · audit-iiif: 5 ✓/0 (372 faz; 93 + 18)
- test-entities: **100 ✓/0** · test-timeline-map: 72 ✓/0 · test-ai-curator: 214 ✓/0
- red-team: **157 ✓/0** (GAP 24) · test-plan-visit: 42 ✓/0
- audit-numbers: novi odstavki **ne označeni** (1972/1373/1499 in 4400–3700/4100/2500/1000/1998/2001 se ujemajo SL↔EN); obstoječi mehki opisi starejših zapisov nespremenjeni (vključno z znano vrsto `yearFrom` negativcev — ista vrsta kot bronasta-igla-a478)
- OpenData živo: **111/559** · sitemap: **112**
- **agent-browser:** /exponat/etimologija-gribljati — Grošelj, gribglia, 1373/1499, Linguistica izrisani ✓; /exponat/arheolosko-najdigsce-ob-kolpi — »Griblje G3«, kronološke številke, Mason 2001, DP36 izrisani; »Dular« omenjen **samo** v opombi o popravljanju (»napačno pripisovanje«) ✓; domača stran hero »Zbirka 111 zapisov« ✓; noga: footBottom = pageH (15.394 px), vrzel 0; preliv pri 390 px = 0; dev.log brez napak.

## Surovine (raw-web-val28-2026-10/)

dedup-baseline-val28.txt · openaire-griblje.json + openaire-details.json (7 zadetkov, metapodatki) · groselj-1972-landing.html + groselj-1972-griblje.pdf + .txt (1 str, 2.183 znakov) · dp36-landing.html + andric-mason-2009-dp36.pdf + .txt (9 str, 28.718 znakov) · andric-2007-landing.html (Cloudflare »Just a moment«) · zenodo-nemastoma.json (403) · s01–s05 web_search.

## Ničelni izmeri / opuščeno

- **Andrič 2007 (The Holocene 17(6) 763–776)**: doi.org → SAGE = **Cloudflare challenge** (»Just a moment…«); polno besedilo ostaja TO_COLLECT (ResearchGate kopija je na voljo ljudem, ne peskovniku) — abstraktna trditev (4150 cal BC) je že pokrita prek DP36 (c. 4100/4400–3700).
- **Nemastoma bidentatum subsp. gruberi** (Novak idr. 2021, Zenodo DOI 10.5281/zenodo.5648409): OpenAIRE ga prinese med zadetki za Griblje (lokaliteta?), ampak **Zenodo API/datoteka = 403** (»unusual traffic«) — lokaliteta Griblje **nepotrjena**, vir ni vgrajen (dokaz najprej).
- **RUL izven peskovnika**: web_search najde »Zaznavanje spreminjanja podnebja pri vinogradnikih v Beli krajini« (repozitorij.uni-lj.si) — F5 TSPD še zmeraj; konkretni IzpisGradiva URL TO_COLLECT (via web_search snippet ali ljudski dostop).
- **»KALEŽ I POKAZNICA JURJA DIVNIĆA U ŠIBENIKU«** (Soldo 1980) med OpenAIRE zadetki — nizka verjetnost realne veze na vas (keyword match); ni preverjano globlje (prioriteta).
- **Prometno varnostni načrt OŠ Loka Črnomelj** (Nagode, DKUM-70974): omenja podružnico Griblje — dedup (šola že popisana, MVG-026/032), ni vgrajeno.

## Izven-peskovniška vrsta (posodobljena)

1. **Akademska repozitorija — KANAL ODPRT skozi OpenAIRE** (direktna vrata RUL/DKUM/CORE ostajajo izven peskovnika); naslednji korak: sistematična enumeracija OpenAIRE/Crossref po »Griblje« + ljudski dostop do RUL za vinogradniško delo; Nemastoma gruberi (Zenodo) — lokaliteta?
2. **Mason 2001 (VS 39) polno besedilo** — dLib (6. val?) ali ZVKDS izvornik; celotna študija o vasi bi nadgradila MVG-083.
3. **Andrič 2007 polno besedilo** — alternativne kopije (ZRC/IZA, ljudski dostop).
4. **Kataster jam / DZRJL** — Angular aplikacija; Jelenja/Vodena jama (MVG-040) čakata potrditev.
5. **Belokranjec 7-8/XXIX PDF** (50,6 MB) — celotno besedilo čaka na realni brskalnik.
6. **dLib** (5 valov blokade) — sken Domoljuba 1898, Krajevni leksikon 1937, ZC 42(4) 1988.
7. **Poganjec domačinska potrditev** toponima.
8. **Lojze↔Alojz Štrucelj** — potreben dokaz, ki poimenuje obe obliki.
9. **Kamra „Bile so velike družine“** — dokler identiteta ni potrjena, vir ne gre na MVG-051.
10. **ARSO letna serija padavin Metlike (PX-Web)** — 302-loop; normale že vgradnjene.
11. **SI AS 176 Franciscejski kataster** (vac.sjas.gov.si HTTP 000).
12. **Datum prve gostilne** pred 1898.
13. **Benchmark vrzel #3** (360° panorame od vaščanov) — edina odprta strateška vrzel.

## Poučne epizode

- **Agregator je ključ, ko so vrata zaprta**: RUL/DKUM/CORE so peskovniku zaprli vsak prehod, ampak OpenAIRE indeksira njihovo vsebino — dve closovalni vrzeli sta se zaprli z enim brezplačnim API-jem.
- **Recenzirana bibliografija kot avtoriteta avtorstva**: napačno pripisovanje »Dular, A.« je živelo 8 sklopov; razrešilo ga je polno besedilo, ki ga je muzej prebral, ne ugib ali drugi citat.
- **Prekinjena seja pušča poškodovano delo**: vgradnja brez regresije ni vgradnja — tri sintaktične napake so čakale ob prevzemu; tsc je očistil stanje v enem koraku.
- **TS literali**: `\"` in `\n` v dvonavedajnih nizih so še naprej glavni vir napak pri ročnem urejanju (tretjič dokumentirano); python-nadomestitve z literali so zanesljivejše od vzorca po vzorcu.
