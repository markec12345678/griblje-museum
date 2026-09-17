# 07 — Benchmark UI/UX najboljših spletnih muzejev (oktober 2026)

**Naloga:** analiziraj najboljše muzeje na spletu, primerjaj z našim Digitalnim vaškim muzejem Griblje, izboljšaj.

**Metodologija:** direktni prenosi domačih strani (curl, oktober 2026) za Google Arts & Culture, Rijksmuseum, Louvre, Van Gogh Museum, Tate, Natural History Museum in Kamra.si (Europeana, Met, MoMA, British Museum, Smithsonian, muzeji.si, DEDI so blokirali avtomatiziran dostop — Cloudflare/Vercel checkpoint — zato so ocenjeni po dokumentiranim vzorcem in javnim virom). Dodatno: pregled lastne kode (vsi pogledi, knjižnice, sledilniki).

---

## 1. Muzej po muzeju — kaj deluje in zakaj

### Google Arts & Culture (artsandculture.google.com)
- **»What do you want to explore?«** — vstop po interesu (Art / Museums / Games / Places), ne po organizacijski strukturi muzeja.
- **»Today's fun«** — dnevna interaktivna izkušnja (npr. »Make Music with Viola«) — vsak dan razlog za vrnitev.
- **»Your time machine«** — doba kot brskalna dimenzija.
- **»Artwork of the day«** — dnevni zapis (ritual).
- **Pocket Galleries** — kurirane »virtualne sobe« (Street View / AR).
- **Brskanje po barvah** (Blue / Green / Orange / Pink) — vizualen, ne-knjižničen vstop v zbirko.
- **Nearby** — lokacijski vstop; **Favorites** — osebna zbirka brez računa.
- Gigapikselski zoom, eksperimenti (Art Palette, X Degrees of Separation).

### Rijksmuseum (rijksmuseum.nl)
- Hero s jasnim CTA: »Visit the highlights. Book your ticket today.« — ena primarna akcija, ne pet.
- Okvir »We vertellen het verhaal van 800 jaar Nederlandse geschiedenis« — **zbirka kot zgodba**, ne kot seznam predmetov.
- **Rijksstudio** — uporabnik iz 800.000+ del sestavlja lastne zbirke, prenose visokolöčljivih slik; shranjevanje z enim klikom med brskanjem.
- **Art Explorer** (prenova zbirke 2024, Q42/Fabrique) — vodnik po razpoloženju/inspiraciji, ločen od iskanja.
- **Visitor stories** — zgodb obiskovalcev kar na strani zbirke.
- Zbirka: Discover / Art works / Visitor stories — trije načini istega prostora.

### Louvre (louvre.fr)
- »Welcome to the Louvre« — topel, gostiteljski ton.
- **Highlights** vrteča izpostava osamelcev.
- **»Louvre +«** — video/dokumentarna serija (restavracije, za kuliso) — muzej kot medijska hiša.
- **»Studio: GET DRAWING!«** — ustvarjalni prostor za otroke.
- **»Delve into the Louvre«** — tematski ponori.
- Online ture 360° (Petite Galerie, Stari Egipt).

### Van Gogh Museum (vangoghmuseum.nl)
- Hero: **»Discover the Life and Work of Vincent van Gogh«** — življenjepisni okvir, ne »dobrodošli v stavbi«.
- Masterpieces vrstica; **nove raziskave** (»New Research Into Van Gogh's 'Vincent' Signature«) — sveža vsebina kot redna rubrika.
- »Explore further:« — tematski povzetek na dnu.
- NL | EN stikalo vidno v glavi.

### Tate (tate.org.uk)
- **»DON'T MISS«** — nujnost/aktualnost na vrhu.
- **»Explore online: Discover Art / Search the collection / Stories / Tate Kids«** — ekspliciten sklop spletnih vstopov (ne le fizični obisk!).
- **»Try searching for ...«** — predlagana iskanja.
- Tate Kids — polna otroška podstran z lastnim tonom.
- Members/Shop/Prints — jasna monetizacija (za nas neaktualno).

### Natural History Museum (nhm.ac.uk)
- **»Come curious, leave inspired«** — čustveno obljuba v naslovu.
- **Družbeni dokaz:** »Welcome to the UK's most popular museum«.
- »Don't miss these« — kurirani osamelci; »Make the most of your visit« — praktični nasveti.
- Newsletter kopija z osebnostjo: »Your inbox just got wilder«.

### Met / Smithsonian / MoMA / British Museum (po dokumentiranim vzorcem)
- **Met:** Heilbrunn Timeline of Art History — eseji × doba × regija, zlati standard časovne navigacije; Open Access API; Met 360°.
- **Smithsonian:** Open Access (CC0, 4,5 M zapisov), enotno iskanje čez vse muzeje.
- **MoMA:** oznake občinstva in časa branja; otroke usmerjena »Destination Modern Art«.
- **British Museum:** Collection online z 4 M+ predmeti, fasetno iskanje; mladinski sklop.

### Kamra.si (Slovenija)
- **Nastavitve dostopnosti** (barvna tema, pisava, velikost) na prvi strani — standard, ki ga veliki muzeji pogosto skrijejo.
- Zgodbe kot kartice po regijskih zbirkah; skromen, vsebinsko močan portal.

---

## 2. Primerjava z našim muzejem (stanje: 85 zapisov, 369 virov)

| Vzorec velikih muzejev | Griblje danes | Vrzel |
|---|---|---|
| GA&C »What do you want to explore?« hitri vstop po interesu | stats-vrstica (institucionalna) + razpršene povezave | **DA — vstop po razpoloženju/interusu ni na domači strani** |
| Rijksstudio: shranjevanje z enim klikom med brskanjem | srček le v pogovornem oknu zapisa | **DA — na karticah v zbirki manjka srček** |
| GA&C brskanje po barvah | vizualna podobnost le v podrobnosti zapisa (»podobni zapisi«) | **DA — barvni vstop v zbirko ne obstaja** |
| »Nadaljevanje« / nedavno ogledano (standard vsebinskih spletišč) | obiskano = le kljukica na kartici | **DA — ni »nadaljujte z raziskovanjem«** |
| Tate »Try searching for ...« + zadnja iskanja | prazno stanje brez predlogov; dialog brez zgodovine | **DA** |
| Mobilni tab-bar (app-like navigacija) | hamburger meni | **DELNO — odprt meni je dober, a pot do Zbirke/Karte zahteva 2 tap** |
| Nazaj na vrh na dolgih straneh (Louvre/Tate) | nič | **DA** |
| Dnevni zapis | Zapis dneva ✓ in Zapis meseca ✓ | ne |
| Vodnik po razpoloženju (Rijks Art Explorer) | ✓ vodnik po razpoloženju (3 vprašanja) | ne |
| Osebna zbirka brez računa | ✓ Moja zbirka (localStorage) | ne |
| Vizualno iskanje | ✓ podobni zapisi (aHash + barve) | ne |
| Otroška pot | ✓ Mali raziskovalci + igre + uganke | ne |
| Za kuliso (Louvre+) | ✓ za kuliso | ne |
| Glasovi skupnosti (visitor stories) | ✓ spominska knjiga + spomini + Glasovi vasi | ne |
| Dostopnostna plošča (Kamra/AAM) | ✓ lastna plošča (pisava, kontrast, gibanje) | ne |
| Večjezičnost | ✓ SLO/HRV/EN | ne |
| Odprti podatki (Smithsonian) | ✓ /api/opendata | ne |
| Dokumentiranost virov | ✓ stopnje dokazov (edinstveno, boljše od velikih) | ne |
| PWA / namestitev | ✓ | ne |
| Zemljevid, časovnica, sprehodi | ✓ | ne |
| AI vodnik | ✓ | ne |

**Sklep:** vsebinsko in funkcionalno smo že na ravni velikih hiš (mnogo vzorcev je implementiranih). Vrzeli so v **vstopnih točkah in mikro-priročnosti**: hitri vstop po interesu, enoklik shranjevanje, barvno brskanje, nadaljevanje ogleda, predlogi iskanja, mobilna vrstica, nazaj na vrh.

---

## 3. Načrt izboljšav (implementacija)

1. **P1 — Domov: »Kako želite raziskovati?«** (GA&C What do you want to explore?) — 6 kartic takoj pod statistiko: Po razpoloženju, Po temi, Skozi čas, Po zemljevidu, Za otroke, V eni minuti.
2. **P2 — Domov: »Nadaljujte z raziskovanjem«** — zadnje odkriti zapisi iz sledilnika obiskov (max 4).
3. **P3 — Zbirka: srček na karticah** — shranjevanje v Mojo zbirko z enim klikom (Rijksstudio).
4. **P4 — Zbirka: »Razišči po barvi«** — 8 barvnih vzorcev izlukanega prstnega odtisa zbrike; klik filtrira vizualno najbližje zapise (GA&C Blue/Green/Pink).
5. **P5 — Iskanje: zadnja iskanja + predlogi** (Tate Try searching for) — zgodovina v localStorage, predlagani pojmi; tudi v praznem stanju zbirke.
6. **P6 — Mobilna spodnja vrstica** — Domov/Zbirka/Karta/Iskanje/Moj muzej s safe-area; odprta vsebina dobi spodnji odmik.
7. **P7 — Nazaj na vrh** — lebdeči gumb po drsanju.

Vse vzorce povežemo z virom vzorca v komentarjih kode (dosledno z obstoječo prakso projekta).
