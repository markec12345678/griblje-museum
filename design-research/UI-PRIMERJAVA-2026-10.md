# Primerjalna analiza: Muzej vasi Griblje vs. najboljši digitalni muzeji sveta

**Datum:** 16. 9. 2026 (2. krog, po tipografskem benchmarku iz naloge 40)
**Metoda:** agent-browser (pravi Chromium) na živih straneh — DOM, gumbi, navigacija, tok interakcij; zajeti zasloni v `design-research/screenshots/`.

## Analizirani muzeji (danes)

| Muzej | Strani | Dostop | Poudarek analize |
|---|---|---|---|
| **Rijksmuseum** (NL) | collection + Night Watch (objekt) | ✅ | zbirka, objekt, Rijksstudio |
| **Louvre** (FR) | domov + online tours | ✅ | vstop, virtualni ogledi |
| **Google Arts & Culture** | domov + zgodba (People and Parks) | ✅ | storytelling, igre, zoom |
| Met, MoMA, British Museum, Smithsonian, DigitaltMuseum, Europeana | — | ⛔ Cloudflare/Vercel zaščita (podatkovni IP) | uporabljeni podatki naloge 40 (MoMA, Van Gogh, Nasjonalmuseet) |
| **Muzej vasi Griblje** | domov + zbirka + objekt (dakota) | ✅ | vse razsežnice spodaj |

---

## 1. VSTOP IN PRVI VTIS (hero, navigacija)

**Rijksmuseum:** 9 jezikov, ogromna navigacija (Visit / What's on / Collection / Stories / Support / Giftshop + Research, Families, Education …). Zbirka se odpre z "Discover" ploščicami (Vermeer, Judith Leyster …) — urejanje po kuratorjih.
**Louvre:** 4 jeziki (EN/FR/ES/中文), črno ozadje, pilaste CTA, "Online tours" kot lastna rubrika; "Another Louvre" (zgodbe o muzeju samega).
**G&A&C:** brez klasičnega naviga — uredniške ploščice (Rio, keramika, pesem …), vrstica "Explore / Play / Nearby / Favorites / The Lab". Igrivost je del identitete.
**Griblje:** hero s sliko vasi + 4 CTA, med njimi **"Ne vem, kje začeti"** (izbira po razpoloženju) in **"Vprašaj vodnika"** (AI). 9 rubrik + 3 jeziki (SLO/HRV/EN).

**PRESOJA:** Vrhunski muzeji imajo več jezikov (Rijks 9, Louvre 4) in več uredniških vhodov. Mi imamo edinstvena vhoda, ki ju nihče od analitiranih nima: izbira po razpoloženju in AI vodnik na prvi strani. **Za muzej vasi: mi vodimo v dostopnosti odločitve; oni v številu jezikov.**

## 2. BRSKANJE ZBIRKE

**Rijksmuseum:** iskanje čez zbirko + knjižnico + zgodbe obiskovalcev v enem polju; "Art Explorer"; filtri po obdobju/slikarju/vrsti; masonry z naravnimi razmerji.
**G&A&C:** brez klasičnega iskanja po zbirkah na domov — poudarek na uredniških poteh.
**Griblje:** iskalno polje "Išči po zbirki …" + 6 tematskih filtrov s števci (Kraji 29, Kolpa 4, Vojna in meja 9, Narava 7, Delo in obrt 6, Šege in tradicija 12) + "Novo v zbirki" + lenimo nalaganje + znak zanesljivosti na kartici + fotografski kredit na vsaki kartici.

**PRESOJA:** Rijks vodi v globini filtrov (obdobje, tehnikа, galerija). Mi vodimo v **transparentnosti na kartici** (kredit + zanesljivost + obdobje že pred odprtjem) — pri Rijksu se metadata pokažejo šele na strani predmeta. **Izenačeno z različnim poudarkom.**

## 3. STRAN/PREDAVANJE PREDMETA (objekt)

**Rijksmuseum (Night Watch):** "Get started with this artwork" (voden uvod), "Collect entire artwork" + **"Collect a detail"** (uporabnik izreže svoj priljubljeni detajl v zbirko), **"Search visually"** (podobnost iz modela), "Compare", "Gallery of Honour", **"Download image"** (odprta licenca), "Next story", povezana odprta podatkovna polja (material, tehnika, osebe) — vsako je povezava.
**G&A&C:** gigapikselni zoom, stories s poglavji.
**Griblje:** oder s sliko v naravnem razmerju, **deep zoom (OpenSeadragon, do 5×)**, zoom/3D, Primerjaj, Na moj sprehod, Shrani v mojo zbirko, Počasno gledanje, Sestavi sliko (sestavljanka), Pošlji razglednico, Avdio vodnik (celi + "V eni minuti"), Življenje predmeta (biografija s postajami), Deli spomin, Poglej temo, Kopiraj citat, Kopiraj povezavo, viri z URL-ji, povezani zapisi z razlogom sorodnosti.

**PRESOJA:** **To je naša najmočnejša kategorija.** Noben od analitiranih muzejev nima toliko dejanj na enem predmetu (Rijks ima 8–10, mi 15+). Rijks nas premaga v treh: "Collect a detail" (izrez detajla), "Search visually" (podobnost) in "Download image" (eksplicitni gumb za prenos). **Prenos slike implementiramo takoj (spodaj); izrez detajla in podobnost sta na seznamu prihodnjih.**

## 4. STORYTELLING

**G&A&C:** zgodbe s poglavji, "Explore connections", partnerji po svetu, "Play"/"The Lab" (igre z AI — umetnostna paleta, stopnje ločitve …).
**Louvre:** online tours (VR Mona Lisa, prostori), "Visitor trails" (fizični sprehodi).
**Griblje:** Muzejski sprehodi (5+1, pokrivajo vseh 67 zapisov, kuratorske opombe na postajah), Ena minuta, ena zgodba (z avdiom + prepisom), Glasovi vasi (citati), današnji zapis (rotacija), Kuratorska obljuba, Za kuliso (documented research process).

**PRESOJA:** G&A&C vodi v obsegu (milijoni vsebin) in igrah. Louvre v VR. Mi vodimo v **vklopu lokalnih glasov** (citati domačinov, skupnostni spomini) in **pokritosti zbirke s sprehodi** (67/67) — pri nobenem svetovnem muzeju vsak predmet ni del katerega od vodenih sprehodov. **Oni: obseg. Mi: globina in lokalni glas.**

## 5. ZAUPANJE IN ZNANOST

**Rijksmuseum:** odprti podatki (linked data na strani predmeta), raziskovalna rubrika.
**G&A&C / Louvre:** brez razvidnih virov na ravni predmeta.
**Griblje:** stopnje zanesljivosti (dokumentirano / preverjeno / corroborated) z razlago na vsakem zapisu, viri z URL in licenco na vsakem zapisu, krediti fotografij, "Za kuliso" (kako raziskujemo), izjava o dostopnosti.

**PRESOJA:** **MI VODIMO.** Per-claim zanesljivost s tremi stopnjami in razlago je standard, ki ga v tej obliki nima noben od analitiranih velikih muzejev — to je muzeološka novost, ki jo lahko prinese majhen muzej.

## 6. ANGAŽIRANOST IN OSEBNA RABIT

**Rijksmuseum:** Rijksstudio — osebne zbirke, "Hang artworks" (obesi umetnine v lastno galerijo), collect a detail.
**G&A&C:** Favorites, Nearby, Play.
**Griblje:** Moja zbirka (priljubljeni), Moj sprehod (sestavi lastno pot), Primerjaj (pladenj), Muzejska uganka (dnevna), sestavljanke, razglednice, Spomini (skupnostni prispevki z omejitvami), zbirateljski napredek.

**PRESOJA:** Rijks vodi v orodjih za ustvarjanje iz vsebine (hang, detail). Mi vodimo v **družbeni plasti** (spomini domačinov) in dnevni igri. **Približno izenačeno — z različno filozofijo: oni orodja za ustvarjalce, mi za skupnost.**

## 7. DOSTOPNOST IN JEZIKI

**Rijksmuseum:** 9 jezikov (vključno 日本語, 中文, Русский …), lastna stran Accessibility.
**Louvre:** 4 jeziki.
**Griblje:** SLO/HRV/EN (HR zaradi čezmejne Kolpe!), Atkinson Hyperlegible pisava, način za mirne gibe, podčrtane povezave, skip-link, aria-live na kopiranjih, semantični naslovi.

**PRESOJA:** V velikih muzejih je na voljo več jezikov, a redko manjšinskega. HR je za čezmejno vas edina prava izbira. V a11y podrobnostih smo na ravni velikih (Hyperlegible je redkost celo med njimi). **Jeziki: oni. A11y: izenačeno ali mi.**

## 8. TEHNIKA

**Veliki:** ogromni CDN, A/B testiranje, gigapiksli, VR, aplikacije.
**Griblje:** PWA (namestljiv), IIIF manifest, odprti API (`/api/exhibits` …), opendata manifest, deep zoom z dinamičnim uvozom, delno delovanje brez povezave, deljenje brez strežnika.

**PRESOJA:** **Za muzej te velikosti neprimerljivo** — IIIF + odprti API ima med analitiranimi le Rijks in Met. Gigapiksle/VR resno omogoča le G&A&C/Louvre.

---

## Matrika zmagovalcev (povzetek)

| Razsežnica | Vodja | Razlog |
|---|---|---|
| Jeziki (število) | Rijksmuseum | 9 jezikov |
| Filtri zbirke | Rijksmuseum | obdobje/tehnika/galerija |
| Orodja za ustvarjalce | Rijksmuseum | collect a detail, hang |
| Podobnostno iskanje | Rijksmuseum | search visually |
| Prenos slik | Rijksmuseum | download image (open access) |
| Obseg storytellinga | G&A&C | milijoni vsebin, igre, The Lab |
| Zoom (gigapikseli) | G&A&C | gigapikselske slike |
| VR | Louvre | Mona Lisa VR, online tours |
| **Dejanja na predmetu** | **Griblje** | 15+ dejanj (razglednica, sestavljanke, počasno gledanje …) |
| **Transparentnost virov** | **Griblje** | zanesljivost na nivoju trditve |
| **Skupnost** | **Griblje** | spomini, glasovi vasi |
| **AI vodnik** | **Griblje** | nihče od analitiranih ga nima |
| **Avdio na vsaki zgodbi** | **Griblje** | TTS + prepis povsod |
| **Pokritost sprehodov** | **Griblje** | 67/67 zapisov |
| **Čezmejni jeziki (SLO/HR)** | **Griblje** | lokalno smiselno |
| **IIIF + odprti API (majhen muzej)** | **Griblje** | le še Rijks/Met med velikimi |

**Skupna ocena:** Vrhunski muzeji so boljši v **merilu** (jeziki, vsebine, gigapiksli, VR, orodja Rijksstudia). Mi smo boljši v **globini na predmet, transparentnosti in skupnosti**. Za muzej vasi z 0 € proračuna je ta izmenjava točno pravilna strategija: kjer veliki ne morejo (lokalni glas, per-claim zanesljivost, skupnost), tam vodimo mi.

## Implementirano po tej analizi (danes)

1. **"Prenesi sliko" (CC) v zapisu** — vzorec Rijksmuseum "Download image": gumb prenese sliko zapisa skupaj z besedilom licence/kredita; pojasnilo, da so vse slike proste za rabo (CC ali javna last). *(prej: prenos možen le z desnim klikom, brez vidne licence)*

## Prihodnje (seznam po vrednosti)

1. **Collect a detail** (izrez detajla v Mojo zbirko) — Rijksstudio vzorec; srednje zahtevno.
2. **Search visually / podobnost** — potreben ML model; poveži s povezanimi zapisi kot "lite" različico.
3. **Dodatni jeziki** (DE/IT za turiste) — odvisno od sredstev za prevod.
4. **Gigapikseli/VR** — presega kvaliteto naših fotografij; alternative: nova digitalizacija.
5. **Igre (hub)** — uganka + sestavljanke povezati v "Igre muzeja" vhod (zdaj raztresene).

---

# 2. KROG RAZISKAVE (17. 9. 2026): kako so narejeni in kaj imajo

**Povod:** nadaljevanje analize (»raziskuj najboljše digitalne muzeje, kako so narejeni, kaj imajo in kaj se lahko naredimo«). Z-ai iskanje spet deluje; agent-browser znova poizkusil vse prej blokirane strani.

## Novo dostopni muzeji (2. krog)

| Muzej | Strani | Dostop | Poudarek |
|---|---|---|---|
| **Tate** (GB) | /art (Discover Art) + stran dela (Lady of Shalott) | ✅ NOVO | zbirka, sorodnost, slovar |
| **National Gallery** (GB) | domov + stran slike (Arnolfini) | ✅ NOVO | objekt, zoom, provenienca |
| **MoMA** (US) | domov | ✅ delno (globlje strani ⛔ Cloudflare) | vstop |
| **The Met** (US) | collectionapi.metmuseum.org (REST, brez ključa) | ✅ NOVO (API prek curl) | odprti podatki CC0 |
| Smithsonian, Europeana, Prado, DigitaltMuseum, British Museum | — | ⛔ Cloudflare (preverjeno znova) | — |

## Kako so narejeni — tehnika pod pokrovom

- **The Met:** popolnoma odprt REST API (JSON, brez ključa): ~470.000 objektov, CC0 slike + metapodatki; zastavici `isHighlight` in `isPublicDomain` na vsakem objektu. Preizkušeno: `collectionapi.metmuseum.org/public/collection/v1/objects/436535` → 200 z vsemi polji.
- **Tate:** metapodatki zbirke objavljeni na GitHubu (github.com/tategallery/collection); projekt Archives & Access — odprti podatki kot javna dobrina.
- **Europeana:** agregator ~4.000 institucij; Metis agregacijski model + IIIF delovna skupina (iiif.io); institucije se povežejo prek nacionalnih agregatorjev.
- **Smithsonian:** Open Access — milijoni zapisov CC0 + API (api.si.edu) — Cloudflare pred človeškimi obiski, odprt za strojno rabo.
- **National Gallery:** stran slike = IIIF-style zoom viewer (tipkovnica + zoom gumbi), zavihki Details/Provenance/Exhibition history/Bibliography/Frame, zavihek »Audio description«, Insights (video) + »Imaginarium« (interaktivne izkušnje s sliko).
- **Tate (UX):** »You might like« na strani dela (sorodna dela, najprej isti ustvarjalec), »License this image«, »Art by theme« (Migracije, Ženske in umetnost …), **»Art terms« — slovar pojmov** (Cubism, Modernism …), umetniki z letnicami življenja, prijava na e-novice.

## Kaj imajo — nova merila iz 2. kroga

1. **Sorodnost na strani predmeta** (Tate »You might like«): kartice podobnih del z razlogom.
2. **Slovar pojmov** (Tate »Art terms«): pojmovnik, ki vzgaja bralca zbirke.
3. **Provenienca/audio opis kot zavihka** (NG London): zgodovina lastništva in opis za slepe kot enakovredna vsebina.
4. **Zoom viewer na vsaki sliki** (NG London; Rijks gigapikseli): približevanje s tipkovnico.
5. **Odprti podatki kot javna storitev** (Met CC0 API, Tate GitHub, Smithsonian): API dokumentiran za razvijalce.
6. **E-novice** (Tate, NG): zadrževanje obiskovalca.
7. **Označevanje občinstva dogodkov** (MoMA: Families/Films/Talks; NG: »For everyone«/»For Members«).

## Presoja: kdo je boljši in kje

- **Merilo sorodnosti:** Tate zmaga po mehki logiki (isti ustvarjalec → druga dela); Rijks po modelu (»Search visually«). **Mi zdaj pokrivamo obe različici** na majhen, razložljiv način: »Povezani zapisi« (vsebinska sorodnost z razlogom — tema/obdobje/vir/bližina) in »Podobne slike« (vizualna sorodnost — zgradba + barve, iskreno pojasnjeno). Noben muzej ne ponudi obeh z razlago.
- **Merilo pojmovnika:** Tate edini s slovarjem. Za vaški muzej bi bil »Izrazoslovje« (urbar, pod, kres, žganje, pisanice …) naravna dopolnitev — vezana na zapise, ne izmišljena. (Čaka na vsebinski sklop.)
- **Merilo objekta:** NG London najbolj formalen (provenienca, bibliografija, okvir!). Naš »Življenje predmeta« (življenjepis v fazah z viri) + »Spomini ob predmetu« (glasovi) je za vaški kontekst enakovreden in bolj človeški.
- **Merilo odprtosti:** Met/Tate/Smithsonian objavijo API; **mi imamo API + IIIF manifeste že od prej** — prednost malega: vse je lokalno in sledljivo.
- **Ostaja njihovo:** gigapikseli, VR (Louvre), merilo jezikov (Rijks 9), e-novice (zahtevajo hrambo e-pošte — zaenkrat izpuščeno zavestno, ker ne hranimo osebnih podatkov).

## Kaj smo naredili po 2. krogu (danes)

1. **»Podobne slike« v vsakem zapisu** — iskrena majhnomuzejska različica »Search visually«: povprečni hash 8×8 (zgradba) + barvni podpis 3×3, primerjava v brskalniku, 3 zadetki z razlago, zakaj so si slike podobne (brez ML, brez strežnika; prstni odtisi 69 slik v 14 kB JSON). Preizkus: cerkev sv. Vida → petstoletnica 2026 (ista stavba, 1.00) ✓
2. **»Igre muzeja« — hub vseh igralnih dejanj** (5. točka 1. kroga, vzorec Play/The Lab): nova rubrika v navigaciji; uganka kar v hubu, sestavljanke/počasno gledanje/razglednice/detajl/poveži s karticami in skupnim izbirnikom zapisa z iskanjem; dostop tudi z domače strani (gumb ob uganki), iz »Za otroke« in iz noge. SLO/EN/HR.
3. **Raziskava dostopnosti** zapisana (zgornje tabele) — novi vzorci Tate/NG/Met dokumentirani za prihodnje sklope.

## Prihodnje (posodobljen seznam po vrednosti)

1. **Izrazoslovje / slovar pojmov** (vzorec Tate »Art terms«) — povezan na zapise; vsebinsko delo.
2. **Dodatni jeziki** (DE/IT za turiste) — odvisno od prevodnih zmožnosti.
3. **Namig z občinstvom pri dogodkih** (MoMA vzorec: »za družine«, »za vse«) — majhna sprememnba koledarja.
4. **Večje slike / nova digitalizacija** — za enakovreden zoom velikih.
5. **Gigapikseli/VR** — presega trenutni proračun; spremljamo.
