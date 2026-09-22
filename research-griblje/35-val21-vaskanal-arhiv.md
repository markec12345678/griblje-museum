# 21. val raziskave — Vaš kanal: arhiv (Joomla) + WP REST — trije novi zapisi, popravki datumov, refutacija 17. vala
*70. sklop · 22. 9. 2026*

## Kontekst

Zahtevek: »nadaljuj kjer si ostal« (nadaljevanje 20. vala — »raziskuj o Gribljeh povsod, kaj se nimamo«). Val 21 je pognal nove kanale:

1. **Gottscheer/nemški korpus** (»Griblach« 1468 — en.Wiki potrditev pričevanja),
2. **Wikimedia Commons** (celotnotekstovno iskanje »Griblje«),
3. **turki.splet.arnes.si** (turški vpadi — akademski projekt),
4. **slovenski mediji** (delo/večer/dnevnik/STA/RTV/uho.si),
5. **YouTube/Flickr/Instagram** (prosti viri slik),
6. **Vaš kanal** — **WP REST API** (vaskanal.com) + **arhiv.vaskanal.com** (Joomla 2008–2019),
7. **Janez Weiss / Neumarkt–Möttling–Metlika 2018** (Metlika 16. stoletja).

## METODOLOŠKI PRELOMI

- **JINA spet živ** (HTTP 200 po valih 401) — nestabilen: izmenično 200/403 (Cloudflare na academii)/401 (rate-limit); z zamiki ~50–75 s deluje.
- **WP REST API vaskanal.com = brezsejni kanal** (`/wp-json/wp/v2/posts?search=Griblje&per_page=20` prek JINA → 143 kB JSON; vsa polja: datum, naslov, vsebina, YouTube ID-ji). **9 postov** o Gribljeh (2021–2026).
- **arhiv.vaskanal.com (Joomla) skozi JINA** — iskalna stran (`option=com_search&searchword=griblje`) vrne **20 člankov z datumovi**: Joomla iskalna stran prikaže datum objave ob vsakem zadetku — **vseh 18 prebranih datumov delavsko usklajenih** (Ponedeljek 5. 8. 2019 ✓, Torek 30. 5. 2017 ✓ …). Datum na strani članka je v nasprotju pokvarjen (prikazuje današnji datum) — zato iskalna stran.
- **Wayback CDX API = peskovniško mrtev** (val 19 potrditev); **YouTube watch = omet soglasja**, ampak **oEmbed** deluje (naslov + kanal: baY6UuBX_dY »Žičnata ograja v vodi«, Vaš Kanal ✓).

## TRIJE NOVI ZAPISI

### MVG-106 — poljsko-lokostrelstvo (sege, DOCUMENTED)
- **Državno prvenstvo v poljskem lokostrelstvu na gribeljskih poljih** — Lokostrelsko društvo Krasinec v sodelovanju z Lokostrelsko zvezo Slovenije, **»že četrto leto zapored«** (poročilo 11. 1. 2016 o prvenstvu »minulo soboto« = 9. 1.; izpeljava začetkov: 2013).
- Vaš kanal članek 23460 + **video KfMyGn9TI7o** (oEmbed potrjen).
- Muzej išče: rezultate, imena lokostrelcev, fotografije terena; ali prvenstvo še živi.

### MVG-107 — komasacija-agromelioracije (gospodarstvo, DOCUMENTED)
- **26. 7. 2013:** občina Črnomelj na razpisu ministrstva pridobi **»dobrih 650 tisoč evrov«** za komasaciji **Griblje–Cerkvišče** in Dragatuško polje (članek 18379).
- **21. 9. 2015:** podpis pogodbe za agromelioracije (članek 21950) — **»skupno skoraj 500 hektarjev … belokranjska Panonska nižina«**.
- Video qVK-qmUWfmg. Muzej išče: komasacijski načrt, meje območja, fotografije del.

### MVG-108 — odkupne-cene-covid (gospodarstvo, **TESTIMONY** — drugi tak status v zbirki)
- **24. 2. 2021:** Vaš kanal »Kmete skrbijo nizke odkupne cene« (dateline NOVO MESTO, GRIBLJE) — **»Stanje je porazno, nam je potrdil kmet iz Gribelj v Beli krajini«**; odkupne cene ne pokrijejo niti stroškov pridelave.
- **Video PENuY63B2Bs** (glas, obraz, kmetija); pričevalec **anonimen** — muzej ne ugiba (status TESTIMONY, ne DOCUMENTED).
- Muzej išče: pričevalca (prepoznavo), fotografije kmetij med epidemijo.

## ADD-ONLY VIRI (+6) IN REFUTACIJA 17. VALA

- **MVG-097 + vk-kanalizacija-2017** (30. 5. 2017): »hiše v Dolnjih Gribljah dobile možnost priključka na fekalno kanalizacijo, ki so jo začeli graditi **pred več kot desetimi leti**« (usklajeno s ČN 2008); video swBrHQ8_Svc. **REFUTACIJA:** 17. val je falsificiral članek »Namenu predali kanalizacijo« kot Krška vas/Volavče — **neposredna pridobitev članka 26203 dokazuje, da je o Gribljih**. Googlov agregiran datum (8. 2. 2017) je pripadal sosednjemu članku »Antonova nedelja« — ponovna poučna epizoda agregiranih odrezkov (isti vzorec kot »Namenu predali« v 17. valu).
- **MVG-022 + vk-oraci-2012** (7. 8. 2012): »štirinajst belokranjskih oračev, med njimi ena ženska« — kontekst tekmovalnega oranja; Filak izrecno NE naveden (točnost).
- **MVG-015 + vk-ograja-voda-2016** (9. 8. 2016): »Žičnata ograja v vodi« — videodokument ograje 2015/16 v poplavni vodi; video baY6UuBX_dY (oEmbed ✓).
- **MVG-026 + 2 videa:** muzejska učilnica (7. 6. 2022, iMetbKigZFc — drugi poročevalec ob DL) + **22. posvet Društva učiteljev podružničnih šol Slovenije v Gribljeh** (22. 4. 2024, 3MmQDP1a054) — državni posvet v vaški šoli.
- **MVG-041 + vk-pasuljada-2018** (28. 8. 2018): »že 14 let« ≈ začetek 2004 — usklajeno z okvirom zapisa (16. izvedba 2019); isto poletje tudi »Komisija izbrala vegetarijanski pasulj« (6. 8. 2018 — v opombi vira).

## POPRAVKI VIROV Z NATANČNIMI DATUMI (arhivska iskalna stran)

| Vir | Prej | Zdaj | Vir datuma |
|---|---|---|---|
| vas-kanal-zbul-2012 | ~2012 | **8. 8. 2012** | arhiv #19 |
| ro-pastirski-2020 / vk-pastirski-2020 | ~2020 | **11. 7. 2017** (TV-poročilo) | arhiv #8 |
| vaskanal-kolesa-2017 | 11. 7. 2017 | **8. 8. 2017** | arhiv #7 |

- **Datumska zamenjava kolesa↔pastirski:** 61. sklop je kolesarskemu srečanju pripisal 11. 7. 2017 — to je datum pastirskega praznika; kolesa so 8. 8. 2017. Oba datuma delavsko usklajena (Torek ✓).
- URL vira kolesa podtet na natančen članek (27019), ne več na domačo stran arhiva.

## FALSIFIKACIJE, DEDUP IN NIČELNI IZMERI

1. **Commons full-text: 0 zadetkov »Griblje«** (totalhits 0, predlog »groblje«) — vas (razen slike lunje po taksonu) ni v Commons; dokumentirana praznina.
2. **turki.splet.arnes.si: 0 zadetkov** (Griblje/Griblach) — projekt o turških vpadih ne omenja vasi.
3. **Press (delo/večer/dnevnik/STA): 0** gribeljskih zadetkov; RTV arhivi/uho.si: 0 specifičnih.
4. **YouTube/Flickr/Instagram/booking:** turistična vsebina (kampiranje 2014, apartmaji, ribnik #goldenhour) — ni muzejskega ranga; navedeno kot pokazatelj, da so slikovni viri v vaški skupnosti (Facebook kopališče 2022).
5. **Dedup 100 %:** Brinc poklon 17. 4. 2026 (vk-brinc-poklon-2026 že vir); muzejska učilnica, 130-letnica šole (5. 8. 2019 — Vaš kanal), kolesa 2017, pasuljada, pastirski praznik, mrliška vežica 2013, poplave 2022, žbul — vsi že pokriti.
6. **Poganjec:** web_search 2 zadetka (bolha nepremičnine, erast.si »poganjalec«) — nobena toponimska potrditev → ostaja TO_COLLECT (muzejska prošnja v MVG-105 ostaja).
7. **Weiss 2018:** »Častite avstrijske hiše zvesti podložniki. Oris prebivalstva Metlike, mesta na meji cesarstva, med poznim srednjim vekom in moderno dobo« (v: **Neumarkt–Möttling–Metlika. Nastanek in razvoj mesta od konca 13. do začetka 19. stoletja**, ur. Janez Weiss, Metlika: Belokranjski muzej Metlika, 2018; poglavje ~str. 190–220, citat iz 10. vala: str. 197–198, 205, 209–210, 212) — **citira periodno dokumento z »das dorff Griblach, Wadann, Prubintz, Marnndol, Prelog«** (kontekst vpadi/november — 16. stoletje). academia.edu za Cloudflare tudi JINI → **TO_COLLECT prek knjige/NUK/Belokranjskega muzeja**. (Povezani viri: Weiss 2010 Kronika »Reformacija na Metliškem«; Weiss 2011 Arhivi »Gregor Vlahovič« — obe iz referenc Gospodje Črnomaljski 43677618.)
8. **en.Wikipedija Griblje:** nemško ime **Grüble** (že v MVG-001); pričevanja **Briglach 1490 + Griblah 1593** (sl.Wiki 20. val izrecno izpeljani zdaj); etimološke možnosti Snoj (grib/griba/griblja/griva) — vse že v MVG-001/etimologija-gribljati → dedup ✓.

## VGRADNJA

- **+3 zapisa:** MVG-106 (poljsko-lokostrelstvo), MVG-107 (komasacija-agromelioracije), MVG-108 (odkupne-cene-covid) — vsi addedAt 2026-09-22.
- **+10 virov:** 527 → **537** (4 novi zapisi + 6 add-only), identitet 416 → **426**, deljenih 60.
- **Postaje sprehodov:** lokostrelstvo → »Vas in njeni ljudje«; komasacija + odkupne cene → »Kruh, platno in vino« (pokritost **108/108**).
- **i18n:** 25 nizov števcev × 5 jezikov 105→108 (SL »Zbirka 108 zapisov«, EN »one hundred and eight records«, HR »Sto osam zapisa«, DE »Hundertacht Einträge«, IT »Cento otto schede«); ključev ostaja 946 × 5.

## REGRESIJA (živi :3000 po restartu)

tsc 0 · lint čist · verify-i18n 946×5 · audit-entities ✓ 0 napak (108/537/426/60/372) · audit-timeline-map 39 ✓/0 · audit-iiif 5 ✓/0 (372/372; 93 z življenjepisom, 15 brez) · test-entities 100 ✓/0 · test-timeline-map 72 ✓/0 · test-ai-curator 214 ✓/0 · red-team 157 ✓/0 (GAP 24) · test-plan-visit 42 ✓/0 · reseed → OpenData **108/537** živo · sitemap 109 · strani MVG-106/107/108 HTTP 200 z MVG števkami.

## Stanje po 21. valu

**108 zapisov (MVG-001–108), 537 virov, 426 identitet, 60 deljenih, 94 entitet; sitemap 109; i18n 946 × 5; 13 API poti.**

Surovine: `raw-web-val21-2026-10/` (dedup-baseline.txt, s01–s16 web_search, jina-vaskanal-rest.md, jina-arhiv-search.md, jina-lokostrelstvo/komasacija/agromelioracije2/kanalizacija.md, vaskanal-posts-content.txt, yt-ograja-oembed.json, bing-raw/ddg negativni).

## Izven-peskovniška vrsta (posodobljena)

Belokranjec PDF → Vaš kanal → Kropej 2012 → Chapman 2018 → knjige 2009/2006/1941/1997 → pogača/Županič/mlekomat/1874 → **Weiss 2018 (Griblach v periodni dokumenti) → Poganjec (toponimska potrditev)**.
