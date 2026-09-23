# 37. val spletnega popisa Gribelj — 89. sklop

**Datum:** 2026-09-23 · **Naročilo:** »odlicno nadaljuj« (nadaljevanje raziskovalne verige po 36. valu / 88. sklopu)
**Cilj:** nadaljevanje izven-peskovniške vrste po 36. valu: S2 citacije Mason 2001 → Kamra pričevanja → dLib → RTV → nova kanala

---

## Povzetek

Sedemintrideseti val je **rešil vrhnji element izven-peskovniške vrste** (citacije Mason 2001 prek Semantic Scholarja so **nemogoče — zapis ne obstaja**, kar je trajen odgovor namesto vsakoletne kvote) in **odprl uradni kanal Občine Črnomelj kot nov vir dokazov**: iskalnik crnomelj.si (POST `/sl/iskalnik/`) enumerira ~10 uradnih novic o Gribljih, od katerih je **en nov vgradljiv** — **urejene dostopne poti do vstopno-izstopnih mest ob Kolpi (26. 6. 2024), s kopališčem Griblje kot prvim na seznamu 13 lokacij**. Zaslužita omembo tudi dve stranski novosti: Kamra je ob prelomu na nov URL Nikove plošče omogočila **popravek kanoničnega URL-ja** (stari = 301), RTV Slovenija pa je s četrtim poskusom dokončno dokumentirana kot prazna lupina (iskalni rezultati = client-side AJAX, ki ga peskovniška orodja ne dosegajo).

**Vgradnja:** +1 vir (`obcina-kolpa-vstopna-mesta-2024`) na **MVG-006 kolpa-reka**, zgodba +1 stavek SL/EN, popravek URL-ja `kamra-plosca` na MVG-010.
**Stanje po valu:** **113 zapisov (MVG-001–113), 572 virov, 453 identitet, 67 deljenih, 95 entitet; sitemap 114; i18n 946 × 5.**

---

## Poleno 1 — S2 references-endpoint zaobide iskalno kvoto; Mason 2001 NIMA zapisa (REŠITEV VRSTNEGA REDU)

Iskalni endpoint S2 je 429 tudi v tem valu (s01; 6. poskus skupaj — deljeni IP izčrpan, lastni ključ ostaja TO_COLLECT). **Nov premik:** referenčni endpoint `/graph/v1/paper/DOI:10.4312/dp.36.21/references?limit=100` = HTTP 200 (s02) — **endpoint reference deluje nemoteno, tako kot paper endpoint**.

- DP 36 ima v S2 indeksiranih **samo 14 referenc** — med njimi tri Masonove vnose *Varstva spomenikov* (Mali Nerajec 2006, Črnomelj–Čardak 2006, Dragatuš 2006), **vsi brez corpusId in brez externalIds**.
- **Mason 2001 (VS 39, 7–27) med referencami ni** — S2 lokalne regionalne revije ne indeksira do identifikatorjev.
- **Sklep: enumeracija citatov Masona 2001 prek S2 je trajno nemogoča** (brez corpusId ni citations-endpointa). Vrsta se rešuje kot *odgovorjena*, ne kot *odložena*: znani citirajoči (Andrič 2007; DP 36; Springer 2024; AV 71.14; Mason 2006/2007/2008a) so v muzej prišli po drugih kanalih, potencialno nove citacije pa ostajajo na OpenAlex z lastnim ključem (registracija).

## Poleno 2 — Kamra: iskalna stran deluje, WP REST ne; 100 % dedup + popravek kanoničnega URL-ja

- **WP REST search** (`/wp-json/wp/v2/search?search=Griblje&per_page=20`) = **prazen niz** — gnezdišče: Kamra je Elementor stran, vsebina mm-elementov živi v metapodatkih, ki jih REST-iskanje (`post`/`page`) ne indeksira (s03: `/wp-json/wp/v2/types` — brez tipa `mm-elementi`).
- **HTML iskalna stran `?s=Griblje` = deluje** (s04): trije mm-elementi za Griblje — **100 % dedup**: spomenik padlim (EŠD 19326) in spomenik napadu na italijanske mejne policiste (EŠD 19324) sta že zapisa; **plošča Nika Županiča** je že vir `kamra-plosca`.
- **STRANSKI PRLOR: stari URL vira `kamra-plosca` (`...rodil-univ-profesor/`) = HTTP 301 → kanonični `...rodil-univ-profesor-dr-niko-zupanic-zupanic/`** → URL v semenu posodobljen + opomba vala 37 (SL/EN).
- Stran 2 iskanja = 404 (vsi zadetki na eni strani); `?s=Gribljach` = brez novih zadetkov. Korpus Kamre za Griblje je **enumeracijsko izčrpan**.

## Poleno 3 — RTV Slovenija: 4. poskus = dokončna praznina

- Direkten iskalnik `/iskalnik?q=Griblje` = 200 (205 kB), toda **28 × Griblj vse v navigaciji/lupini** — rezultati so client-side AJAX (s05).
- **r.jina.ai** (renderira JS) = 200, 31 kB — **školska lupina brez rezultatov** (s06).
- Filtrirani URL `?type=3&…&group=1` = prav tako lupina (1 navidezni zadetek).
- **Sklep: RTV ostaja dokumentirana praznina** — rezultati zahtevajo brskalniško sejo z JS-jem; kanal zapišemo kot *znana vrzel s potjo (headless sejo)*.

## Poleno 4 — Nova kanala: crnomelj.si = DELUJOČ (POST iskalnik); dedi.ijs.si = mrtev

- **crnomelj.si = NOV KANAL** (uradni kanal občine; ni WordPress — REST 404): iskalna forma je **POST `/sl/iskalnik/`** s parametroma `search-field` + `_submit_check=1` (s07) — deluje tudi prek curl.
- Zadetki za Griblje (~10): 500-letnica cerkve 23. 6. 2026 (že vir MVG-cerkev), KS Griblje stran (že vir), asfalt 190 m 21. 8. 2025 (že v zgodbi MVG-097 — 100 % dedup), **vstopno-izstopna mesta Kolpe 26. 6. 2024 (NOVO)**, namera KO 1544-Griblje nepremičnina 2689/10 (upravno, ne-vgrajeno), odločba o ukinitvi javnega dobra parcela 5375 (upravno), košarkarski turnir trojk 10. 7. 2026 (obrobni dogodek), četrtošolci 5. 3. 2026 (obrobno).
- **dedi.ijs.si (DEDI)** = HTTP 000 (domena ne odgovarja) — dokumentirana praznina.
- **sistory.si** = Cloudflare »Just a moment« (403/verification) — dokumentirana blokada (SEL »Griblje« ostaja TO_COLLECT).
- **Radio Odeon** (članka »Svečano odkritje spominske plošče v Gribljah«, »Donatorstvo PŠ Griblje«): 403 direktno, page_reader Cloudflare, JINA Cloudflare — **3 kanali blokade**; Odeon je sicer že miniran (franc-brinc ima 4 odeon-vire). Kandidat **»Donatorstvo PŠ Griblje« (23. 10. 2020, katalogizirano v COBISS, ISSN 2536-328X, [1] str.)** = TO_COLLECT: brez besedila ne vemo, kaj donacija pomeni — naslov sam ne nosi dejstva.
- **Wikipedijin seznam »Registrirana nepremična kulturna dediščina Občine Črnomelj« = ne obstaja** (API: missing; JINA: 404) — navedba iskalnika je bila lažna. EŠD številke (2122, 19324, 19326, 10094/G3) ostajajo iz primarnih navedb.

## VGRADNJA (add-only)

1. **MVG-006 kolpa-reka**: +1 vir `obcina-kolpa-vstopna-mesta-2024` (spletni-vir, javna informacija; dela AGM Starešinič konec maja 2024, investicija 5.233,8 € iz občinskega proračuna; 13 lokacij, Griblje prva) + **zgodba +1 stavek SL/EN** (»Urejen dostop je od junija 2024 tudi uradno stanje…«).
2. **MVG-010 niko-zupanic**: vir `kamra-plosca` URL → kanonični + opombe SL/EN o 301.
3. **Konstante**: 571→572 (10 mest v 5 skriptah), 452→453 (3 skripte); sporočila auditov na »37. val«.

## Regresija (živi :3000 po reseed + restart dev)

tsc 0 · lint čist · verify-i18n **946 × 5** · audit-entities ✓ 0 napak (**113/572/453/67/375**; 95 entitet, 36 oseb) · audit-timeline-map **39 ✓/0** · test-entities **100 ✓/0** · test-timeline-map **72 ✓/0** · test-ai-curator **214 ✓/0** · red-team **157 ✓/0** · test-plan-visit **42 ✓/0** · OpenData **113/572** živo · sitemap 114.

**agent-browser:** `/exponat/kolpa-reka` — SL stavek »Urejen dostop je od junija 2024« ✓, EN stavek po preklopu ✓, vir z zneskom 5.233,8 izrisan ✓; noga footBottom = pageH (4459,75 vs 4460 — vrzel 0,25 px) ✓; domača hero 113 ✓; preliv 0 pri 390 px ✓; konzola čista ✓.

---

## Izven-peskovniška vrsta (posodobljena)

1. ~~S2 search-kvota (Mason 2001 CorpusId → citacije)~~ → **REŠENO: Mason 2001 nima S2 zapisa** (referenčni endpoint DP 36; vsi VS-39-odmevi brez corpusId)
2. **OpenAlex z lastnim ključem** (registracija — citacije Masona 2001)
3. **dLib Mason 2001 VS 39** (str. 7–27; 9. val blokad — pot: seja/headless)
4. **Kamra pričevanje** → delno rešeno: korpus za Griblje izčrpan (100 % dedup); »pričevanja« v ožjem smislu (Kamra pripovedi) ne obstajajo za Griblje
5. **ARSO letna serija** (vsakoletna poprečja postaje Metlika)
6. vinogradniška diploma (RUL gID) · Kataster jam · Belokranjec PDF (3. poraz) · Poganjec · Lojze↔Alojz · SI AS 176 · gostilna pred 1898 · vrzel #3 (360°) · Mason 2001 seja dLib · Andrič 2007 polno besedilo
7. **NOVO: Odeon »Donatorstvo PŠ Griblje« (23. 10. 2020)** — kandidat za prvo dokumentirano Brincovo donacijo šoli; COBISS katalogizacija (ISSN 2536-328X); branje zahteva živo sejo (3-kratna WAF blokada)
8. **NOVO: RTV headless sejo** (JS-rezultati iskalnika — 4. dokumentirani prazen poskus)
9. **NOVO: crnomelj.si — kanal odprt, izčrpan za vgradljivo** (vstopna mesta 2024 vgrajena; ostalo = upravno/obrobno); novi novice občine spremljaj ob naslednjih valovih

## Surovine

`raw-web-val37-2026-10/` — s01-s2-search-mason.json (429), s02-s2-dp36-references.json (14 referenc), s03 kamra-types.json, s04 kamra-search.html + 3 × mm-elementi HTML, s05 rtv-home.html, s06 jina-rtv.md + jina-wiki-esd.md, s07 crnomelj-home/iskalnik.html + 3 novice HTML, pr-odeon.json, pr-cobiss.json, pr-odeon-donatorstvo.json, jina-odeon-donatorstvo.md (Cloudflare), s03–s07 web_search izpisi.

## Poučne epizode

1. **MultiEdit ni atomaren v praksi**: pri neuspelem paketu so se prejšnji editi vseeno zapisali (vir + URL), odvisni edit (noteSi2: undefined — napaka roke) pa je ostal. Nauk: po vsakem paketu grep-verifikacija stanja, ne zaupanje sporočilu o napaki.
2. **Natančnost prevzema**: starejša zgodba ima »pri Gribljah«, ne »pri Gribljih« — medizbiranje besedila iz pomnilnika namesto iz datoteke je dvakrat zaustavilo vgradnjo. Nauk: old_str vedno izvleči programsko.
3. **Identiteta ≠ števec**: popravek URL-ja spremeni vrednost identitete, ne števca (nauk 33. vala potrjen tudi tokrat).
