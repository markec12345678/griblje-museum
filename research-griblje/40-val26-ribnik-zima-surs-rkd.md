# 26. val (75. sklop) — Zimska fotografija ribnika, uradna SURS serija 2008–2026, RKD enota 2122

**Datum:** 2026-09-22 · **Naročilo:** »odlicno nadaljuj raziskuj griblje« (26. val; nadaljevanje po valih 21–25)

---

## Povzetek

Šesti sklenjeni val raziskave po izven-peskovniški vrsti: **trije vgrajeni dokazi** — (1) zimska podoba ribnika (Commons *Cabin under the Sun*, 26. 1. 2019) z računalniško analizo slike in potrditvijo, da je ista datoteka že glavna slika zapisa o Turističnem društvu; (2) **celotna uradna letna serija prebivalstva naselja Griblje 2008–2026** iz SURS PX-Web API (naselje 017044: 361 → vrh 363 (2012) → dno 328 (2024) → 329 (2026)); (3) **uradni opis enote nepremične kulturne dediščine EŠD 2122** (cerkev sv. Vida) prek GIS kulturne dediščine na Geohubu. Dokumentirana vrzeli: dLib nedostopen **pet valov zapored**, istovetnost Lojze↔Alojz Štrucelj ostaja nedokazana (pisrs/tax-fin-lex potrjujeta Alojza na Griblje 6, ne pa imenske povezave). Ničelni izmeri: gostilna-vlakno že pokrito (MVG-109: 1898 najzgodnejša omemba v tisku), Wikipedia slike Vavpotiča/Gasparija že v MVG-010.

## Metoda

Nadaljevanje po izven-peskovniški vrsti (prioritete iz vala 24/25: Cabin under the Sun, SURS, RKD, Štrucelj, dLib, gostilna, Belokranjec PDF):

1. **Commons API z lastnim User-Agent** (brez UA = Wikimedia Error 429; z UA = 200): `imageinfo` + `extmetadata` za vse datoteke kategorije Griblje, vključno z GPS.
2. **z-ai vision (VLM)** — računalniška analiza prenesene slike (live.staticflickr.com 1024 px) za določitev vsebine.
3. **SURS PX-Web API v treh korakih**: GET `/api/v1/sl/Data/?query=` (najdba tabele 05C5003S) → GET `.px` (metadata: spremenljivki OBČINA/NASELJE, LETO, MERITVE) → POST s kodo **017044** (izpisana iz 6.253 vrednosti).
4. **page_reader** (z-ai funkcija) za sl. Wikipedijo — curl/Wikimedia REST = 429 (ocena IP rep.) — za članka *Griblje* in *Cerkev sv. Vida, Griblje*.
5. **web_search** za Štrucelja, gostilno, RKD.
6. dLib: ponoven poskus (curl timeout) — **5. val zapored** brez dostopa.

## Prelomi

### Prelom 1 — Cabin under the Sun: identiteta + vsebina + poletje/zima par

- **Datoteka:** `File:Cabin under the Sun (46105681335).jpg` — Flickr ID 46105681335 v naslovu (oEmbed: avtor **Uros_N** = Uroš Novina, flic.kr/p/2dfcELg), **26. 1. 2019 15:46**, CC BY 2.0, 7.850 × 4.509 px.
- **Kategorije na Commons:** *Griblje* + *Frozen bodies of water in Slovenia* — ribnik pod ledom.
- **GPS na datoteki: 45,576035 N / 15,285286 V** — primerjava: `Pond at Griblje (44612474114)` (julij 2018, isti fotograf) = **45,576088 N / 15,285211 V** — razlika **~7 metrov**: ista lokacija.
- **VLM analiza** (glm-5v-turbo): majhna lesena kočica/stoji na kolih sredi zamrznjene gladine, zrcalni led z odsevom sonca in kočice, debela snežna odeja, trstje, elektro vodi v ozadju; **riba (»pond«), ne reka**; zima.
- **DEDUP POVPRAŠEVANJE (štetje na podatke):** rep-strict kontrola je zavrnila prvo vgradnjo — datoteka je **že vir `commons-hisica` MVG-069 (td-griblje)** in njegova glavna slika (val ~15). Namesto nove identitete: **ist URL kot deljeni vir tudi na MVG-016** (poletje/zima par je dokaz o ribniku, ne o društvu) + nadgradnja opombe na MVG-069 (vsebina, datum, koordinati, par).
- Zgodba MVG-016 dopolnjena (SL/EN): led kot dokument, kočica na kolih, koordinati, dve strani vaškega koledarja.

### Prelom 2 — SURS: celotna uradna serija naselja 2008–2026

- Tabela **05C5003S** *Prebivalstvo po spolu in po starosti, občine in naselja, Slovenija, letno* ( že vir MVG-030 — zdaj z dejanskimi podatki).
- **Naselje 017044 Griblje** (koda iz metadata): skupaj po letih —
  2008: 361 · 2009: 352 · 2010: 347 · 2011: 356 · **2012: 363 (vrh)** · 2013: 354 · 2014: 351 · 2015: 350 · 2016: 344 · 2017: 348 · 2018: 340 · 2019: 337 · 2020: 334 · 2021: 350 · 2022: 340 · 2023: 334 · **2024: 328 (dno)** · 2025: 337 · **2026: 329**.
- Trend: **−9 % v devetnajstih letih**; 2020 (334, popis) in 2026 (329, letna) — vse dosedanje številke MVG-030 potrjene.
- Vgrajeno: opomba vira `surs-prebivalstvo` nadgrajena s celotno serijo + odstavek zgodbe SL/EN (»Uradna letna serija je zdaj zapisana celo …«).

### Prelom 3 — RKD enota 2122: uradni vpis cerkve sv. Vida

- sl. Wikipedija *Cerkev sv. Vida, Griblje* (skozi page_reader; curl = 429): podružnična cerkev **župnije Podzemelj**, dekanija Črnomelj, škofija Novo mesto; predhodnica prvič omenjena **1526** (Wikipedia trdi, da je to »hkrati prva omemba vasi Griblje« — muzej uredi: prva omemba vasi je 1468/1556 listina; 1526 je prva omemba **cerkve**); baročna podoba **18. stoletje**.
- **RKD evidenčna št. 2122** s sklicem na »Opis enote nepremične kulturne dediščine, evidenčna številka 2122« — **Geografski informacijski sistem kulturne dediščine (MK RS)**.
- Uradni deep-link iz članka: `https://geohub.gov.si/ghapp/giskd/?showLayers=MK_RNPD_3386&query=MK_RNPD_3386_3641%2CESD%2C2122` → **nov vir `gis-kd-2122` na MVG-002** (EŠD 2122 je že v zgodbi in viru wiki-griblje-en-vid; novost je uradna povezava na opis enote).

### Ne-dokazano / zavrnjeno (dokazna disciplina)

- **Lojze ↔ Alojz Štrucelj (MVG-051):** web_search »Lojze Štrucelj« — pisrs.si (UL: *Alojz Štrucelj, Griblje 6, Gradac parc.*), tax-fin-lex (isti naslov + parc. št.), Facebook/go2farms (kmetija Antona Štruclja, Griblje 6), Svet24 (22. 8. 2026: »80-letni Alojz Štrucelj iz Gribelj«) — **vse potrjuje Alojza, noben vir ne povezuje imenske oblike Lojze** (Kamra pričevanje iz vala 25 ostaja nevezano; igor-strucelj.si = terapevt, brez dokazane veze). Vir ostaja izven baze — kot odločeno v valu 25.
- **dLib:** timeout (5. val zapored) — sken Domoljuba, Krajevni leksikon 1937, ZC 42(4) 1988 ostajajo TO_COLLECT.
- **Datum prve gostilne:** dedup — MVG-109 že dokumentira 1898 (Domoljub) kot najzgodnejšo omembo gribeljske gostilne v tisku; MVG-052 gostilničar Štraus, MVG-010 Juret Županič (trgovina + gostilna). Prejšnje od 1898 = vprašanje za domačinske vire (TO_COLLECT ostaja, brez novih kanalov).
- **sl. Wikipedija članek Griblje:** zaselki (MVG-001/030/049 že), Vavpotič/Gaspari slike vasi (MVG-010 že), »najbolj suh kraj v Beli krajini« (MVG-016 že: »padavin … celo najmanj v Sloveniji«), popisni del članka ima {{cn}} — nič novega.
- **Belokranjec PDF (50,6 MB):** ni ponovno poskušano (val 24: openresty + flipbook brez besedilne plasti; edina pot = realni brskalnik z naloženim PDF — izven peskovnika).

## Vgradnja (atomarna ingest.py, rep-strict)

- **+2 vrstici virov:** `commons-cabin-winter` (MVG-016, deljena identiteta z MVG-069) in `gis-kd-2122` (MVG-002).
- **+1 nadgradnja opombe:** `commons-hisica` (MVG-069) — vsebina natančno določena (led, kočica, datum, koordinati, par).
- **+3 obogatitve zgodbe:** MVG-016 (poletje/zima par, SL+EN), MVG-030 (celotna serija, SL+EN).
- **+1 nadgradnja opombe:** `surs-prebivalstvo` (MVG-030) — celotna serija 2008–2026.
- **Konstante:** 554→556 vrstic virov, 437→438 identitet, 64→65 deljenih (audit-entities, test-entities, test-timeline-map, red-team R0.3+R16.2, audit-timeline-map).
- **rep-strict ulov pred pisanjem:** prva verzija je načrtovala nov vir na MVG-016 z novim URL-om — kontrola `Cabin_under_the_Sun == 0` je ugotovila, da datoteka že obstaja (MVG-069); vgradnja prilagojena na deljeno identiteto. Štetje na podatke deluje: registrska logika `sourceKeyOf` (normaliziran URL = identiteta) je bila preverjena pred odločitvijo.

## Regresija (živi :3000 po restartu + reseed)

- `tsc --noEmit` = 0 · `bun run lint` = čist
- verify-i18n: **946 × 5**
- audit-entities: ✓ 0 napak (**111/556/438/65/372**; 95 entitet, 36 oseb)
- audit-timeline-map: 39 ✓/0 · audit-iiif: 5 ✓/0 (372 faz; 93 z življenjepisom, 18 brez)
- test-entities: **100 ✓/0** (T8.7 konstanta popravljena v drugem krogu — vzorec je zgrešil vrstico; poučno: dva ločena točkovna popravka istega števca v isti datoteki zahtevata dva ločena vzorca)
- test-timeline-map: 72 ✓/0 · test-ai-curator: 214 ✓/0
- red-team: **157 ✓/0** (GAP 24) — R16.2 konstanta pravtakrat zgrešena in popravljena
- test-plan-visit: 42 ✓/0
- OpenData živo: **111/556** · sitemap: 112
- **agent-browser:** domača stran hero »Zbirka 111 zapisov«; /exponat/ribnik — odstavek o ledu + Cabin vir izrisana; /exponat/sveti-vid — RKD 2122; /exponat/griblje-v-stevilkah — serija »vrh 363 leta 2012«; /exponat/td-griblje — nadgrajena opomba; preliv pri 390 px = 0 (scrollW = innerW); lepljiva noga: footer bottom = pageH (30.150 px), vrzel 0; dev.log 0 napak.

## Surovine (raw-web-val26-2026-10/)

commons-cabin.json (prvi poskus = Wikimedia Error), commons-cabin2.json (meta + GPS), commons-cat26.json (celotna kategorija), commons-cabin-search.json, commons-ponds.json (GPS treh ribniških datotek), cabin-1024.jpg (Flickr 1024 px), cabin-vlm.json (VLM analiza), flickr-cabin-oembed.json, pr-cerkev.json + pr-cerkev-content.html (sl.wiki cerkev, 236 kB), pr-griblje.json + pr-griblje-content.html + griblje-sl-wiki.txt (sl.wiki vas, 286 kB), pxweb-meta.json (05C5003S metadata), pxweb-griblje.json (serija 2008–2026, json-stat2), surs-griblje-2008-2026.txt (izpis), pxweb-griblje2.json (prvi poskus = »trenutno ni na voljo«), pxweb-tree.json (najdba tabele), s01-surs.json, s02-surs-app.json, s03-strucelj.json, s04-gostilna.json, s05-nkd.json, s06-strucelj2.json, s07-lojze.json, s08-svet24.json, pr-igor.json (igor-strucelj.si), wiki-cerkev-search.json, wiki-intitle.json, dlib-test (timeout), ingest.py

## Izven-peskovniška vrsta (posodobljena)

1. **Belokranjec 7-8/XXIX PDF** (50,6 MB) — »vsaka vas svoj pevski zbor, na primer Griblje« — celotno besedilo čaka na realni brskalnik.
2. **dLib** (5 valov blokade) — sken strani Domoljuba 1898, Krajevni leksikon Dravske banovine 1937, ZC 42(4) 1988 (nagrobnik učitelja Kambia).
3. **Poganjec domačinska potrditev** toponima (GBIF piniran, iNat places 0).
4. **Lojze↔Alojz Štrucelj** — potreben dokaz s strani domačinov ali tiska, ki poimenuje obe obliki.
5. **Kamra „Bile so velike družine“** — dokler identiteta ni potrjena, vir ne gre na MVG-051.
6. **ARSO padavine** — potrditev/razvrstitev »najbolj suh kraj v Beli krajini« (sedaj samo portal + {{cn}}).
7. **SI AS 176 Franciscejski kataster** (vac.sjas.gov.si HTTP 000).
8. **Datum prve gostilne** pred 1898 (domačinski viri).
9. **Benchmark vrzel #3** (360° panorame od vaščanov) — edina odprta strateška vrzel.

## Poučne epizode

- **rep-strict ujel lastno napako pred pisanjem:** dedup kontrola `Cabin_under_the_Sun == 0` je zavrnila vgradnjo, ker je datoteka že v bazi (MVG-069) — kontrola delovala kot namerava; vgradnja prilagojena (deljena identiteta + nadgradnja opombe) namesto podvajanja.
- **identiteta virov je normaliziran URL** (source-registry pravilo A1): isti Commons file na dveh zapisih = en vir, dve uporabi — »EN VIR — ENA IDENTITETA«.
- **PX-Web v treh korakih** (tree → metadata → query): koda naselja (017044) se izpiše iz 6.253 vrednosti metadata, ne ugane.
- **Wikimedia zahteva User-Agent** — brez njega = 429 error page (dva različna vzorca napake: HTML plošča pri imageinfo, JSON decode fail pri parse).
- **dva števca, dva vzorca:** R0.3 in R16.2 v istem red-team skriptu imata različno formulirane vrstice — en patch je pokril enega; regresija je ulovila drugega. T8.7 pravtakrat. (Poučno iz vala 19 se ponovi: konstante se popravljajo pri živem zagonu, ne pri branju.)
- **page_reader kot nadomestek za 429-ljivo Wikimedijo** — isti kanal, ki je v valu 24 prestal openresty, tukaj prestal Varnish rate-limit.
