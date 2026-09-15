# Muzej vasi Griblje / Griblje Village Museum

Digitalni muzej vasi **Griblje** (Bela krajina, Slovenija) — zbirka, zgodbe, zemljevid,
dogodki in odprti podatki. Zgrajen po vzoru standardov nagrajenih norveških muzejev
(Nasionalmuseet — *Årets museum 2025*, Valdresmusea — *Årets museum 2022*).

A digital village museum for **Griblje** (Bela krajina, Slovenia) — collection, stories,
map, events and open data. Built to the standard of award-winning Norwegian museums
(Nasjonalmuseet — *Museum of the Year 2025*, Valdresmusea — *Museum of the Year 2022*).

---

## Zakaj / Why

Vas Griblje (prva omemba **1526**, ~3,45 km², občina Črnomelj) ima bogato neprenosceno
dediščino — od jurjevanja in vinarstva ob Kolpi do partizanske zgodovine in evakuacije
z letališča Krasinec (marec 1945, največja vojna evakuacija na tem delu Evrope).
Ta projekt dokazuje, da lahko majhna vas digitalno doseže muzejski standard:
dvojezična vsebina, dostopnost, javna izjava o dostopnosti, odprti podatki,
raziskovalna disciplína z izrecnimi statusi dokazilosti.

## Vsebina z globino / Content depth

Zbirka sledi referenčnemu standardu globine, izpeljanemu po praksah Rijksmuseuma
(Collection Online), London Transport Museum (baza znanja AI vodnika iz kuratorskih
virov), Smithsoniana (rudarjenje metapodatkov) in DigitaltMuseum (gostota povezav
kraj → ljudje → dogodki → predmeti):

| Plast zapisa | Standard | Stanje |
|---|---|---|
| Etiketa (povzetek) | ~30–50 besed, SLO+EN | ✅ 22/22 |
| Zgodba | 250–400 besed, SLO+EN | ✅ 22/22 (povprečno 276) |
| Življenje predmeta | 4–6 faz časovnice | ✅ 22/22 |
| Viri | 4–6 preverljivih virov na zapis | ✅ 90 skupaj (povprečno 4,1) |
| Zanesljivost | izrecni status dokazilosti | ✅ 22/22 |

Program poglabljanja poteka v sklopih (PR #16: prvih 6 zapisov na standard;
PR #17: preostalih 14 + dosje AI vodnika do 3000 znakov na zapis; PR #19:
nova zapisa manjkajočih tem — Anton Filak, prvak v oranju, in izseljenstvo —
z avtentičnima slikama iz Wikimedije Commons; PR #21: pripovedi v človeških
glasih — dve obstoječi zgodbi prepisani na ~300 besed, dve novi pripovedi
(*Mlinščina — vaška borza in telefon*, *Žensko leto — od lana do platna*),
razdekel Zgodbe pa tako na 6 zapisov na standardu globine).

## Funkcije / Features

- 🖼️ **Zbirka** — 22 zapisov z dokazilnimi statusi (preverjeno / avtentično gradivo /
  muzejska postavitev), filtri, iskanje, dialog z viri in citatom
- 🚶 **Muzejski sprehodi** — štirje kurirani tematski sprehodi skozi celotno zbirko
  (po vzoru vodenih ogledov Norsk Folkemuseum): vsaka postaja odpre zapis s kuratorsko
  opombo, napredkom in navigacijo; zaključeni sprehodi se shranijo lokalno; deljiva
  globoka povezava `/?walk=<id>&stop=<n>`
- 🎓 **Za šole in učitelje** — šolska ponudba po norveškem modelu *skoletjeneste*:
  tri pripravljene dejavnosti (uganka, voden sprehod, delo z viri) in natisljiv
  delovni list za A4
- 🧾 **Citiranje** — oblikovan citat zapisa z datumom dostopa in gumbom
  »Kopiraj citat« (vzorec DigitaltMuseum *Siter dette objektet*)
- 🗺️ **Zemljevid** — Leaflet + OSM, 11 točk (preverjene koordinate + približne, ločene
  vizualno in z oznako »približno«)
- 📖 **Zgodbe** — štiri pripovedi v človeških glasih (~300 besed, SLO+EN:
zračni most marca 1945, reka meja, mlinščina kot vaška borza, žensko leto
od lana do platna) s plastmi odkritih vrzeli namesto izmišljenih oseb, kuratorska
načela in odprti razpis za pričevanja skupnosti
- 📅 **Dogodki** — program z notranjimi in zunanjimi dogodki
- 🔎 **Enotno iskanje** — paletno okno (Ctrl+K ali `/`) po zapisih, zgodbah in
  dogodkih, neobčutljivo na diakritike — po vzoru DigitaltMuseum
- 🔗 **Globoke povezave** — vsak zapis ima deljiv URL `/?exhibit=<slug>`, pogledi
  `#zbirka`, `#zgodbe` … (isti format, ki ga objavljata IIIF in iskalni API)
- 🌍 **SLO/EN** — popolna dvojezičnost z vztrajnostjo izbire
- ♿ **Dostopnost** — izjava o dostopnosti po vzoru norveških muzejev (*universell utforming*),
  tipkovna navigacija, `prefers-reduced-motion`, semantični HTML; lastna **dostopnostna
  plošča** v glavi (večja pisava, močnejši kontrast, pisava za disleksijo Atkinson
  Hyperlegible, mirni gibi, podčrtane povezave) — brez zunanjih prekrivnih gradnikov,
  po priporočilu AAM; nastavitve se shranijo v brskalnik in se sinhronizirajo med zavihki
- 🔓 **Odprti podatki** — `/api/opendata`: manifest, celoten dump, schema.org JSON-LD,
  licenca **CC BY-SA 4.0**, CORS glava — po vzoru odprtega API Nasjonalmuseeta (2018)
- 🏛️ **Muzejska iskrenost** — vsak zapis nosi stopnjo zanesljivosti, fotografije so
  avtentične in pripisane; kadar posnetek ni z Gribelj samega, je to izrecno navedeno
- ❤️ **Moja zbirka** — shranjevanje zapisov brez računa (localStorage), vzorec
  Rijksstudio (Rijksmuseum)
- 🔍 **Približevalni ogled** — deep zoom nad fotografijami (OpenSeadragon), po vzoru
  gigapikselnih posnetkov Rijksmuseuma in Google Arts & Culture
- 🌅 **Danes v muzeju** — deterministični dnevni zapis (object of the day, vzorec
  British Museum / Met); načrt obiska po vzoru Louvra in Met
- ⚖️ **Primerjalnik** — do tri zapise drug ob drugem na eni strani (vzorec Comparator,
  Rijksmuseum 2024), deljiva povezava `/?compare=<slug>,<slug>`
- 🧭 **Moj sprehod** — osebna pot skozi muzej z razvrščanjem postaj (vzorec obiskovalnih
  poti Louvra), `/?walk=moj-sprehod`
- 🧒 **Mali raziskovalci** — družinski sprehod z uganko za 6–12 let (vzorec družinskega
  vodnika Van Goghovega muzeja in Petite Galerie Louvra)
- 📴 **Muzej v žepu** — PWA: namestitev na telefon in ogled brez povezave (service
  worker predpomnilnik; vzorec offline vodnika Van Goghovega muzeja)
- 🚪 **Tematska središča** — šest kuriranih vstopnih točk v zbirko (vzorec tematskih
  strani nove zbirke Rijksmuseuma), deljiva povezava `/?tema=<kategorija>`
- ✨ **Vodnik po razpoloženju** — tri vprašanja, deterministični osebni izbor z
  razlogi (vzorec Art Explorer, Rijksmuseum 2024), deljiva povezava `/?mood=<odg>`
- 🕸️ **Poveži zbirko** — povezani zapisi v vsakem zapisu + pot med dvema zapisoma z
  utemeljenimi skoki (vzorec x Degrees of Separation, Google Arts & Culture),
  `/?path=<slugA>,<slugB>`
- ⏱️ **Muzej v minuti** — enominutne zgodbe za vseh 20 zapisov s TTS in prepisom
  (vzorec One Minute Wonders, Brighton & Hove Museums); dnevni izbor treh zgodb
- 🍂 **Sezonska polica** — kurirani izbor zbirke po letnem času, samodejna rotacija
  glede na datum obiskovalca (vzorec »object of the month«, Saffron Walden Museum)
- 🎄 **Adventni koledar** — od 1. do 24. decembra se vsak dan odklene ena vrata
  zbirke po lokalnem datumu (vzorec Glencairn Museum, Ashmolean #AshmoleanAdvent),
  deljiva povezava `/?advent=<dan>`
- ⏳ **Življenje predmeta** — provenance časovnica za vsak zapis: faze, viri in
  stopnje zanesljivosti, vrzeli izrecno prikazane (vzorec Art Tracks, Carnegie
  Museum of Art)
- 🖼️ **Moja galerija časti** — CSS-3D soba shranjenih zapisov brez WebGL (vzorec
  My Gallery of Honour, Rijksmuseum 2024 + Codrops 3D galerija), vlečenje,
  puščice in mirni način za občutljivost na gibanje
- 🎬 **Filmski ogled zbirke** — samodejni ogled osebne zbirke z učinkom Ken Burns
  in neobvezno TTS pripovedjo (vzorec samodejnih video ogledov zbirk Rijksmuseuma);
  soba in film delita deljivo povezavo `/?gallery=<slug>,<slug>`
- 🫁 **Počasno gledanje** — celozaslonsko vodeno razglabljanje enega zapisa v štirih
  mirnih fazah (dih, podrobnosti, čuti, osebni spomin) s pavzo, podaljševanjem in
  preskokom faze (WCAG 2.2.1); zasebni zapisek se shrani samo v brskalnik (vzorec
  MoMA Slow Looking, Tate, Slow Art Day), deljivo povabilo `/?slow=<slug>`
- 🧩 **Sestavi sliko** — muzejska sestavljanka iz slike vsakega zapisa (3×3, 4×4, 5×5);
  ploščice se izmenjujejo s klikom, dotikom ali tipkovnico, vsaka igra je rešljiva;
  števec potez, ura in najboljši časi se hranijo lokalno (vzorec ZMA Puzzler),
  deljiv izziv `/?puzzle=<slug>&kocke=<3|4|5>`
- 💌 **Pošlji razglednico** — muzejska e-razglednica: izbira zapisa, pozdrava in
  sporočila, obrat kartice s čistim CSS-3D ter žigom in znamko muzeja; sprejemnik
  odpre kartico prek povezave, natisne pa se lahko kot zložena A5 razglednica (vzorec
  Useum e-Cards, SFMOMA *Send Me*), deljiva povezava
  `/?postcard=<slug>&msg=…&od=…&pz=<pozdrav>`
- 📖 **Spominska knjiga** — digitalna dvojnica vaške spominske knjige: vpisi z
  imenom, krajom in sporočilom, števci vpisov in krajev, moderacija brez računov
  (honeypot, omejitev hitrosti, hevristika povezav → čaka na pregled) (vzorec
  DigitaltMuseum, Tenement Museum *Your Story, Our Story*), globoka povezava
  `#knjiga`
- 💬 **Spomini ob predmetu** — skupnostna znanja pod uradnim besedilom vsakega
  zapisa: obiskovalci (domačini, izseljenci, potomci) delijo osebne spomine,
  kurotorjev pregled pa je vgrajen v eno hevristiko (vzorec skupnostnih pripomb
  DigitaltMuseum); POST `/api/memories`
- 🎬 **Za kuliso** — kanal o muzejskem delu za prizoriščem: tura po depoju,
  restavriranje predilnega kolesa, snemanje pričevanj, postavitev adventne
  police — vodene pripovedi po korakih (vzorec Rijksmuseum *Operation Night
  Watch*, SMK), globoka povezava `#zaKuliso`
- 📊 **Zbirka v številkah** — razčlenitev zbirke po tematskih sklopih, obdobjih in
  zanesljivosti virov z animiranimi vrsticami in zanimivostmi (najstarejši zapis,
  % fotografinanih, % na karti) (vzorec vizualizacij zbirk Met/Tate) — v rubriki
  *O muzeju*
- 🤖 **Pogovor z zbirko** — uzidani AI vodnik: obiskovalec zastavlja vprašanja,
  model pa odgovarja IZKLJUČNO iz kuriranih zapisov (dosje iz iste baze — po
  jeziku, z zgodbami do 3000 znakov, življenjepisi predmetov in enominutnimi
  zgodbami);
  vsak odgovor se konča z navedki, ki so gumbi na prave zapise; odkrito
  »tega ni v zbirki« namesto izmišljevanja; predlagana vprašanja, bližnjica
  Ctrl/Cmd+G, deljiva povabilo `/?govor=1`; pogovor se ne shranjuje
  (vzorec Met Assistant, DMA Angelica, museum-GPT); POST `/api/guide`
  (z-ai-web-dev-sdk, strežniško; na Vercelu zahteva env `ZAI_CONFIG`)

## Tehnologija / Tech stack

| Plast | Tehnologija |
|---|---|
| Framework | **Next.js 16** (App Router) + TypeScript 5 |
| UI | Tailwind CSS 4, shadcn/ui, Framer Motion, Lucide |
| Podatki | Prisma ORM + SQLite, idempotentni seed |
| Stanje | TanStack Query (server), kontekst (i18n) |
| Zemljevid | Leaflet (OpenStreetMap ploščice) |
| Pisave | Fraunces (display) + sistemski niz |

## Zagon / Getting started

```bash
bun install
bun run db:push        # ustvari SQLite shemo
bun run db:seed        # napolni zbirko (idempotentno: 22 zapisov, 90 virov, 6 zgodb, 5 dogodkov, 6 vpisov, 10 spominov)
bun run dev            # razvojna storitev na :3000
```

V skladišču je že pre-seedana baza `db/custom.db`, zato aplikacija deluje tudi
brez zgornjih korakov; `db:push` + `db:seed` sta potrebna le po ponastavitvi
oz. na sveži bazi (`prisma/seed.ts` je idempotenten — vsak zagon zbirko
čisto prepiše iz istih virov).

### Namestitev na Vercel / Deploying to Vercel

Projekt deluje na Vercelu brez dodatnih nastavitev okolja:

- **`DATABASE_URL` ni potrebno nastavljati** — `src/lib/db.ts` sam poišče
  `db/custom.db` (pre-seedana baza je del skladišča; v paket strežniške
  funkcije jo vključuje `outputFileTracingIncludes` v `next.config.ts);
  Prisma odjemalec se zgenerira v `postinstall`.
- **Avdio vodnik (TTS)**: na Vercelu nastavite env spremenljivko `ZAI_CONFIG`
  z JSON vsebino `{"baseUrl": "...", "apiKey": "..."}` (enako kot datoteka
  `.z-ai-config` v razvoju; ključ nikoli ne zaide v skladišče). Brez nje
  ostali del muzeja deluje normalno, avdio vodnik vrne napako 500.
- **Deployment protection**: ekipa na Vercelu ima privzeto SSO zaščito
  *vseh* deploymentov (`all_except_custom_domains`) — produkcijski naslov
  brez custom domene potem preusmerja na prijavo. V nastavitvah projekta
  (Protection) izberite *Preview only*, da je produkcija javna.

### API

| Pot | Opis |
|---|---|
| `GET /api/exhibits` | zbirka z viri |
| `GET /api/events` | program dogodkov |
| `GET /api/stories` | zgodbe |
| `GET /api/opendata` | manifest + full dump + JSON-LD (CC BY-SA 4.0, CORS) |
| `GET /api/iiif` | IIIF Presentation 3.0 manifest zbirke |
| `GET /api/search?q=` | enotno iskanje po razstavah, zgodbah in dogodkih (neobčutljivo na diakritike) |
| `GET /api/guestbook` | objavljeni vpisi spominske knjige + števci (CORS `*`) |
| `POST /api/guestbook` | nov vpis — honeypot, hitrostna omejitev, samodejna moderacija |
| `GET /api/memories?exhibit=` | spomini skupnosti ob enem zapisu (CORS `*`) |
| `POST /api/memories` | nov spomin ob zapisu — enaka moderacija |
| `POST /api/guide` | pogovor z zbirko — uzidani AI vodnik (z-ai-web-dev-sdk; `ZAI_CONFIG` na Vercelu) |

### Trajnost skupnostnih prispevkov / Durability of community contributions

Vpisi in spomini se pišejo v SQLite bazo. Na samostojni namestitvi (`bun run
start`) so trajni. Na strežniških platformah (Vercel) je datotečni sistem
 Funkcije minljiv — za trajno objavo pregledane prispevke kurosor prenese v
 `src/lib/community-content.ts` + `bun run db:seed` (vzorec *git kot CMS*);
 hevristika moderacije (povezave/e-pošta → status `held`) je opisana v
 `src/lib/contributions.ts`.

## Licence / Licenses

- **Koda**: MIT (glej `LICENSE`)
- **Vsebina zbirke (opisi, zgodbe, metapodatki)**: CC BY-SA 4.0
- **Slike**: avtentične fotografije z Wikimedie Commons in javnodomenski arhivski
  posnetki (Franjo Veselko marec 1945, procesija 1908, Fran Vesel 1920, Slovenski
  etnografski muzej) — vsaka z navedbo avtorja in licence na zapisu in v registru virov

## Struktura / Structure

```
prisma/schema.prisma      # Exhibit, Source, StoryItem, MuseumEvent, GuestbookEntry, ObjectMemory
prisma/seed.ts            # idempotentni seed z dejstvi iz javnih virov
src/app/page.tsx          # enostranska aplikacija muzeja
src/components/museum/    # pogleji: Domov, Zbirka, Zgodbe, Karta, Dogodki, O muzeju, Knjiga, Za kuliso
src/lib/i18n.tsx          # SLO/EN slovar
src/lib/contributions.ts  # moderacija prispevkov (honeypot, hitrost, hevristika)
src/lib/community-content.ts  # seme vpisov in spominov (git kot CMS)
src/lib/behind-scenes.ts  # zapisi Za kuliso
src/app/api/              # REST + odprti podatki
public/images/authentic/  # avtentične fotografije (Wikimedia Commons / javna last)
```

## Izjava o standardu / Standard statement

Projekt implementira dimenzije, ki jih meri norveška nagrada *Årets museum*:
dvojezična vsebina, univerzalna zasnova dostopnosti, javna izjava o dostopnosti,
odprti podatki in API, program dogodkov, povezanost s skupnostjo, iskrena
dokumentacija provenience ter ločevanje avtentičnega gradiva od interpretacij.
