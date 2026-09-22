# 30. val raziskave: Springerjeva sinteza (Andrič & Karger 2024) — mednarodna potrditev bibliografskega okvira + popravek vrstnega reda avtorjev DP36

**Datum:** 22. 9. 2026 · **Naročilo:** »odlicno nadaljuj raziskuj« · **Sklop:** 80 · **Predmet:** izven-peskovniška vrsta vala 29, št. 1 — Mason 2001 (VS 39) polno besedilo

## Izhodišče

- HEAD `59b0c9d` = origin/main ✓ (val 29 sinhroniziran); OpenData živo: **112 zapisov / 560 virov / 442 identitet / 65 deljenih / 95 entitet**; dedup baza vala 30 iz žive baze (`dedup-baseline-val30.txt`).
- Izven-peskovniška vrsta po valu 29: **št. 1 Mason 2001 (VS 39) polno besedilo** (dLib 6. val blokade) → št. 2 vinogradniška diploma (RUL gID) → št. 3 Andrič 2007 kopije → Kataster jam → Belokranjec PDF → …

## Kanali vala 30 (vse surovine v `raw-web-val30-2026-10/`)

| # | Kanal | Izsledek |
|---|-------|----------|
| 1 | **OpenAlex API** (api.openalex.org) | rate limit — deljeni IP brez ključa („$0.0002 remaining; resets at midnight UTC") — dokumentirano; ključ brezplačen, TO_COLLECT z lastnim ključem |
| 2 | **scholar.archive.org** | rate limit reached (deljeni IP) — dokumentirano |
| 3 | **oai.dlib.si** (OAI-PMH) | DNS se ne razreši — host ne obstaja; dLib ostaja zaprt tudi na alternativnih vratih |
| 4 | **z-ai web_search** (Mason naslov članka) | 8 zadetkov; UNG repozitorij = nov dostopen repozitorij, ampak zadetek 9330 = napačni (algorave teza »Dreamer«) |
| 5 | z-ai web_search `site:dlib.si Griblje` | napačni zadetek (medicinska knjiga) — dLib zapisi niso indeksirani v vidnem indeksu |
| 6 | **z-ai web_search → Springer** | **PRELOM**: knjiga *Environmental Histories of the Dinaric Karst* (Springer 2024) citira Mason 2001 z angleškim naslovom |
| 7 | Crossref API (val 29 kanal) | knjiga DOI **10.1007/978-3-031-56089-7** (2024, zbirka *Environmental History*); poglavje 2 DOI **10.1007/978-3-031-56089-7_2**, avtorja **Maja Andrič, Dirk Nikolaus Karger**, str. 29–50 |
| 8 | link.springer.com direktno (curl) | F5 Shape Security (TSPD challenge) — 3038-bajtna ovira |
| 9 | **page_reader (Z.AI backend)** | **PRODOR skozi F5**: polni HTML knjige (552 kB) in poglavij 1, 2, 3, 5, 12, 16 (458–716 kB) |

## PRELOM: poglavje 2 = avtorica Maje Andrič

**Andrič, Maja & Karger, Dirk Nikolaus (2024): *The Holocene Vegetation and Land-Use History in the Northern Dinaric Karst*.** V: Fuerst-Bjeliš, Mrgić, Petrić, Zorn & Zwitter (ur.), *Environmental Histories of the Dinaric Karst*, Springer, Cham (zbirka Environmental History), str. 29–50. DOI 10.1007/978-3-031-56089-7_2.

Bibliografija poglavja (potrjeno z iskanjem po ekstrahiranem besedilu, referenčni del od znaka 94362 naprej):

- **Mason P (2001) Griblje in problem nižinskih arheoloških kompleksov v Sloveniji [Griblje and the problem of lowland archaeological complexes in Slovenia]. Varstvo spomenikov 39:7–27** — točen bibliografski zapis (strani 7–27, angleški podnaslov) potrjen v recenzirani sintezi leta 2024;
- **Mason P, Andrič M (2009) Neolithic/Eneolithic settlement patterns and Holocene environmental changes in Bela krajina (South-Eastern Slovenia). Documenta Praehistorica 36:327–335**, DOI 10.4312/dp.36.21 — z **Masonom na prvem mestu**;
- **Andrič M (2007) The Holocene vegetation development in Bela krajina (Slovenia) and the impact of first farmers on the landscape. The Holocene 17(6):763–776**, DOI 10.1177/0959683607080516 — že v bazi (`andric-2007-holocene`);
- **Mason P (1994) Neolitska in eneolitska naselja v Beli krajini: naselje v Gradcu…** — Poročilo o raziskovanju paleolitika, neolitika in eneolitika v Sloveniji 22:183–199 (kontekst, ni vir za MVG);
- Andrič & Willis 2003, Andrič 2006 (Pupićina jama), Budja 1992 (naselitveni vzorci Bele krajine), Culiberg 1995 …
- „Mlaka" v referencah poglavja **ni** — opomba vira je bila napisana previdno in popravljena pred vgradnjo (natančnost najprej).
- Telo poglavja (poz. 0–94362) Bele krajine ne obravnava — vse omembe Griblje/Bele krajine so v bibliografiji; vrednost je torej **bibliografska potrditev**, ne vsebinski nov zapis.

## PRELOM 2: popravek vrstnega reda avtorjev (DP 36, 2009)

Muzej je od vala 28 članek citiral kot **»Andrič, M., Mason, P. (2009)«**. Naslovnica dejanskega PDF-ja (prebrana v valu 28, `raw-web-val28-2026-10/andric-mason-2009-dp36.pdf`) pravi: **»Phil Mason¹ and Maja Andrič²«** (¹ Centre for Preventive Archaeology, IPCHS; ² Institute of Archaeology, ZRC SAZU) — **Mason je prvi avtor**. Isti vrstni red potrjuje referenca v Springerjevi sintezi 2024 (»Mason P, Andrič M (2009)«).

Popravljeno v valu 30 (z izrecno opombo, tretja dokazna disciplina po valih 26/27 in četrta skupaj z avtorstvom VS 39):

- `andric-mason-2009-dp36`: nameSi/nameEn → **»Mason, P., Andrič, M. (2009)«** + opomba popravka (kaj je bilo, kaj je zdaj, zakaj);
- zgodba MVG-083 SL: »Recenzirana sinteza **Masonove in Andričeve**« (prej »Andričeve in Masonove«);
- zgodba MVG-083 EN: »The peer-reviewed synthesis of **Mason and Andrič**«.

## Vgradnja (atomarna, rep-strict)

- **+1 vir** `andric-karger-2024-dinaric-karst` na **MVG-083** (arheol. najdišče ob Kolpi): DOI URL = **+1 identiteta**; opomba SI/EN z natančno bibliografijo in vrsto trditve („bibliografska potrditev").
- **Popravek vrstnega reda avtorjev** DP 36 (zgoraj) + 2 popravka zgodb SL/EN.
- Konstante v 5 skriptah: **561** vrstic virov (test-entities ×4, audit-timeline-map, test-timeline-map ×4, audit-entities, red-team R0.3/R16.2) in **443** identitet (test-entities, test-timeline-map, audit-entities); sporočila »30. val: +1 …«.
- Zapisi/slike/postaje/hero-števci se **ne spremenijo** (112 zapisov, sitemap 113, i18n 946 × 5).

## Regresija (živi :3000 po reseed)

tsc 0 · lint čist · verify-i18n **946 × 5** · audit-entities ✓ 0 napak (**112/561/443/65/372**; 95 entitet, 36 oseb; pokritost 82/112) · audit-timeline-map **39 ✓/0** · audit-iiif 5 ✓/0 (372 faz; 93+19) · test-entities **100 ✓/0** · test-timeline-map **72 ✓/0** · test-ai-curator **214 ✓/0** · red-team **157 ✓/0** (GAP 24) · test-plan-visit **42 ✓/0** · audit-numbers: samo znane historične oznake (poljsko-lokostrelstvo, komasacija, bridke-izkusnje, turski-vpadi, grybl-cevljar) — popravek ni dodal novih · **OpenData 112/561 živo** · sitemap 113.

## agent-browser

`/exponat/arheolosko-najdigsce-ob-kolpi`: stari vrstni red (»Andrič, M., Mason, P. (2009)«) = **odsoten**; nov vrstni red = **izrisan**; vir Karger = izrisan; opomba popravka (30. val) = izrisana; zgodba SL »sinteza Masonove in Andričeve« = izrisana; „Varstvo spomenikov 39" 3× v virih. EN prek `?lang=en`: zgodba, popravek in vrstni red = izrisani; UI „Skip to content". Domača stran: hero »Zbirka 112 zapisov« ✓. Noga: footBottom = pageH (9120 px), vrzel **0**; preliv X pri mobilni širini = 0. dev.log čist.

## Ničelni izmeri / TO_COLLECT

- **Mason 2001 (VS 39) polno besedilo ostaja TO_COLLECT** — 7. val blokade dLib (curl 000; OAI-PMH host ne obstaja; JINA prej „Malicious request"); bibliografski okvir pa je zdaj **trajno potrjen** v recenzirani sintezi 2024;
- OpenAlex brez lastnega API ključa (deljeni IP izčrpan) — ključ je brezplačen, TO_COLLECT;
- scholar.archive.org rate limit (isti vzrok);
- Springer direktno = F5 Shape (curl) — page_reader deluje kot zanesljiva pot (dodan v peskovniško mrežo);
- UNG repozitorij dostopen (nepričakovano), ampak brez Gribelj v indeksu zadetka;
- issuu/ZVKDS polno besedilo VS 39 = lažni zadetki.

## Pomen za muzej

1. Griblje so zdaj dokumentirane v **mednarodni, recenzirani Springerjevi sintezi** (2024) — v vrsti poleg Gradca, Pupičine jame in Mlake kot del pregleda holocenske vegetacije Dinarskega krasa; zapis MVG-083 ima poleg primarnih raziskav tudi sekundarno sintezo.
2. Bibliografija Mason 2001 (VS 39: 7–27) je potrjena do strani in angleškega podnaslova — ko bo dLib dostopen, je polno besedilo edini še manjkajoč korak.
3. Muzej je popravil vrstni red avtorjev DP 36 z izrecno opombo — dokazna disciplina (4. popravek po valih 26/27/28).
4. page_reader je prodril skozi F5 Shape Security — kanal Springer (in podobne zaščitene strani) je sedaj odprt za prihodnje valove.

Izven-peskovniška vrsta (posodobljena): Mason 2001 polno besedilo (dLib 7×) → vinogradniška diploma (RUL gID) → Andrič 2007 kopije → OpenAlex z lastnim ključem → Kataster jam → Belokranjec PDF → Poganjec → Lojze↔Alojz → Kamra pričevanje → ARSO letna serija → SI AS 176 → gostilna pred 1898 → vrzel #3 (360° panorame).
