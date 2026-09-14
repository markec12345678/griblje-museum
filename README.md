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

## Funkcije / Features

- 🖼️ **Zbirka** — 20 razstav z dokazilnimi statusi (preverjeno / avtentično gradivo /
  muzejska postavitev), filtri, iskanje, dialog z viri in citatom
- 🗺️ **Zemljevid** — Leaflet + OSM, 11 točk (preverjene koordinate + približne, ločene
  vizualno in z oznako »približno«)
- 📖 **Zgodbe** — pripovedi z iskrenim pozivom za pričevanja skupnosti
- 📅 **Dogodki** — program z notranjimi in zunanjimi dogodki
- 🔎 **Enotno iskanje** — paletno okno (Ctrl+K ali `/`) po zapisih, zgodbah in
  dogodkih, neobčutljivo na diakritike — po vzoru DigitaltMuseum
- 🔗 **Globoke povezave** — vsak zapis ima deljiv URL `/?exhibit=<slug>`, pogledi
  `#zbirka`, `#zgodbe` … (isti format, ki ga objavljata IIIF in iskalni API)
- 🌍 **SLO/EN** — popolna dvojezičnost z vztrajnostjo izbire
- ♿ **Dostopnost** — izjava o dostopnosti po vzoru norveških muzejev (*universell utforming*),
  tipkovna navigacija, `prefers-reduced-motion`, semantični HTML
- 🔓 **Odprti podatki** — `/api/opendata`: manifest, celoten dump, schema.org JSON-LD,
  licenca **CC BY-SA 4.0**, CORS glava — po vzoru odprtega API Nasjonalmuseeta (2018)
- 🏛️ **Muzejska iskrenost** — vsak zapis nosi stopnjo zanesljivosti, fotografije so
  avtentične in pripisane; kadar posnetek ni z Gribelj samega, je to izrecno navedeno

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
bun run dev            # razvojna storitev na :3000
```

Seed (20 razstav, 56 virov, 4 zgodbe, 5 dogodkov) se zažene samodejno ob prvem
zagonu (`prisma/seed.ts`, idempotentno).

### API

| Pot | Opis |
|---|---|
| `GET /api/exhibits` | zbirka z viri |
| `GET /api/events` | program dogodkov |
| `GET /api/stories` | zgodbe |
| `GET /api/opendata` | manifest + full dump + JSON-LD (CC BY-SA 4.0, CORS) |
| `GET /api/iiif` | IIIF Presentation 3.0 manifest zbirke |
| `GET /api/search?q=` | enotno iskanje po razstavah, zgodbah in dogodkih (neobčutljivo na diakritike) |

## Licence / Licenses

- **Koda**: MIT (glej `LICENSE`)
- **Vsebina zbirke (opisi, zgodbe, metapodatki)**: CC BY-SA 4.0
- **Slike**: avtentične fotografije z Wikimedie Commons in javnodomenski arhivski
  posnetki (Franjo Veselko marec 1945, procesija 1908, Fran Vesel 1920, Slovenski
  etnografski muzej) — vsaka z navedbo avtorja in licence na zapisu in v registru virov

## Struktura / Structure

```
prisma/schema.prisma      # Exhibit, Source, StoryItem, MuseumEvent
prisma/seed.ts            # idempotentni seed z dejstvi iz javnih virov
src/app/page.tsx          # enostranska aplikacija muzeja
src/components/museum/    # pogleji: Domov, Zbirka, Zgodbe, Karta, Dogodki, O muzeju
src/lib/i18n.tsx          # SLO/EN slovar
src/app/api/              # REST + odprti podatki
public/images/authentic/  # avtentične fotografije (Wikimedia Commons / javna last)
```

## Izjava o standardu / Standard statement

Projekt implementira dimenzije, ki jih meri norveška nagrada *Årets museum*:
dvojezična vsebina, univerzalna zasnova dostopnosti, javna izjava o dostopnosti,
odprti podatki in API, program dogodkov, povezanost s skupnostjo, iskrena
dokumentacija provenience ter ločevanje avtentičnega gradiva od interpretacij.
