# Muzej vasi Griblje — javni API / Public API

> Odprti podatki po vzoru [Rijksmuseum Collection Online](https://data.rijksmuseum.nl) in
> [Smithsonian Open Access](https://www.si.edu/openaccess/devtools).
> Licence: podatki **CC BY-SA 4.0**, slike pa z izrecnim virom vsake slike (vir je del zapisa).
> Za razliko od Smithsonian (CC0) namenoma **ohranjamo avtorstvo** vaščanov in virov — zato CC BY-SA.
> Brez ključa, brez registracije. Hitrostne omejitve: AI poti **12 zahtev / 10 min / IP** (24 h predpomnilnik).

**Osnovni URL:** `https://griblje-museum.vercel.app` (lokalno: `http://localhost:3000`)

| | |
|---|---|
| Format | JSON (UTF-8) · IIIF Presentation 3.0 · JSON-LD (OpenData) |
| CORS | odprt za GET |
| Status podatkov | 113 zapisov (MVG-001–113) · 588 virov · 95 entitet · 372 faz življenjepisov — *posnetek ob 98. sklopu (2026-09-23); živo stanje vrača [`/api/opendata`](#) → `counts`* |
| Verzija | 2026.09 (sledi sklopom v README) |

---

## Seznam poti (13)

| Pot | Metoda | Namen |
|---|---|---|
| `/api/exhibits` | GET | zbirka zapisa (filter po kategoriji) |
| `/api/search` | GET | polnotekstovno iskanje |
| `/api/events` | GET | dogodki vasi |
| `/api/stories` | GET | zgodbe |
| `/api/guestbook` | GET · POST | knjiga gostov |
| `/api/memories` | GET · POST | spomini (po zapisu) |
| `/api/stats` | GET · POST | statistika obiska |
| `/api/iiif` | GET | IIIF Presentation 3.0 manifest |
| `/api/opendata` | GET | celoten dump + JSON-LD (CC BY-SA 4.0) |
| `/api/guide` | POST | AI vodnik po zapisu |
| `/api/audio-guide` | GET | TTS avdio vodnik |
| `/api/curator` | POST | AI kurator (retrieval + verifikacija) |
| `/api/plan-visit` | POST | AI planiranje obiska (osebni načrt) |

---

## Podrobnosti in primeri

### 1) `GET /api/exhibits` — zbirka
| Param | Vrsta | Opomba |
|---|---|---|
| `category` | string | filter po kategoriji (npr. `osebe`, `dogodki`, `pristnosti`) |

```bash
curl -s https://griblje-museum.vercel.app/api/exhibits | jq '.exhibits | length'
# 101
curl -s "https://griblje-museum.vercel.app/api/exhibits?category=osebe" | jq '.exhibits[0].id'
# "mvg-001"
```

### 2) `GET /api/search?q=…` — iskanje
```bash
curl -s "https://griblje-museum.vercel.app/api/search?q=jurjevo" | jq '.results | length'
```
Iskanje zajema povzetke, zgodbe in entitete (SL+EN).

### 3) `GET /api/events` · 4) `GET /api/stories`
Brez parametrov; vračata dogodke / zgodbe z dvojezičnimi polji (`…Si` / `…En`).

### 5) `GET·POST /api/guestbook` — knjiga gostov
- GET: zadnji vpisi.
- POST JSON `{ "name": "…", "message": "…", "lang": "sl" }` → vnos po hevristični moderaciji (brez administracije; zlonamerno se zavrže).

```bash
curl -s -X POST https://griblje-museum.vercel.app/api/guestbook \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana","message":"Krasna zbirka!","lang":"sl"}'
```

### 6) `GET·POST /api/memories?exhibit=…` — spomini
- GET `?exhibit=mvg-084`: spomini vezani na zapis.
- POST JSON `{ "exhibit": "mvg-084", "author": "…", "text": "…" }`.

### 7) `GET·POST /api/stats` — statistika
GET vrača števca ogledov; POST poveča (idempotentno po seji brskalnika).

### 8) `GET /api/iiif?manifest=…` — IIIF Presentation 3.0
```bash
curl -s "https://griblje-museum.vercel.app/api/iiif?manifest=mvg-001" \
  | jq '.type, (.items | length)'
# "Manifest", 1
```
Manifest vsebuje `items → AnnotationPage → AnnotationPage.items (Annotation)` po IIIF 3.0.

**Anotacije življenjepisa (61. sklop):** poleg `painting` anotacije (slika) Canvas nosi
`annotations → AnnotationPage` z motivacijo `supplementing` — **ena anotacija na fazo
življenjepisa predmeta** (vzorec: Rijksmuseumove razstave na anotacijah). Vsaka anotacija
ima dvojezično telo (`TextualBody` sl + en) in oznako `letnica · faza · status dokazilnosti`.
Zapisi brez življenjepisa Canvas.annotations ne pošiljajo.
```bash
curl -s "https://griblje-museum.vercel.app/api/iiif?manifest=izseljenstvo" \
  | jq '.items[0].annotations[0].items | length'
# 5  ← 5 faz življenjepisa kot anotacije
```

### 9) `GET /api/opendata` — odprti podatki (CC BY-SA 4.0)
Celoten dump zbirke + muzejski metapodatek + JSON-LD kontekst + Wikidata `sameAs`.
```bash
curl -s https://griblje-museum.vercel.app/api/opendata | jq '.counts'
# { "exhibits": 101, "sources": 482, "events": 9, "stories": 6 }
```
Navedba: »Muzej vasi Griblje (2026), CC BY-SA 4.0, <https://griblje-museum.vercel.app>«.

### 10) `POST /api/guide` — AI vodnik
```bash
curl -s -X POST https://griblje-museum.vercel.app/api/guide \
  -H 'Content-Type: application/json' \
  -d '{"question":"Kdo je Zeleni Jurij v Gribljah?","lang":"sl"}'
```
Odgovor temelji izključno na zbirki (retrieval) z verifikacijo trditev.

### 11) `GET /api/audio-guide?slug=…&lang=sl&minute=…&chunk=…` — TTS
Vrača avdio dele vodnika (omejitve za hitrost kot pri AI potih).

### 12) `POST /api/curator` — AI kurator
```bash
curl -s -X POST https://griblje-museum.vercel.app/api/curator \
  -H 'Content-Type: application/json' \
  -d '{"question":"Kaj vemo o španski gripa v Gribljah?","lang":"sl"}'
```
Struktura odgovora: **KAJ VEMO → KAKO VEMO → VIRI → OPOMBA** z gumbi `[MVG-###]`;
vsaka trditev preverjena proti zbirki; statusi dokazilosti izrecno navedeni.

### 13) `POST /api/plan-visit` — AI planiranje obiska (63. sklop)
Osebni kurirani načrt po zbirki: obiskovalec poda čas, interese in spremljevalce;
**izbor postaj je determinističen** nad zbirko (točkovanje + pestrost + kronologija),
AI pa personalizira samo pripoved — postaje ne more spremeniti (dokazni vzorec kuratorja).
```bash
curl -s -X POST https://griblje-museum.vercel.app/api/plan-visit \
  -H 'Content-Type: application/json' \
  -d '{"lang":"sl","minutes":30,"interests":["kolpa","narava"],"withKids":false}' \
  | jq '{intro, totalMinutes, synthesized, stops: (.stops | length)}'
```

| Param | Vrsta | Opomba |
|---|---|---|
| `lang` | `sl\|en\|hr\|de\|it` | jezik pripovedi |
| `minutes` | `15\|30\|60\|90` | časovni proračun (≈ 5 min/postajo, min 3, max 14) |
| `interests` | kategorije[] | `kraj\|kolpa\|vojna\|narava\|gospodarstvo\|sege` (prazno = vse teme) |
| `withKids` | boolean | prilagodi izbor mlajšim obiskovalcem |

Odgovor: `{ intro, totalMinutes, tip, synthesized, stops[] }` — vsaka postaja nosi
`slug · museumNo · naslovi sl/en · obdobje · kategorija · evidenceStatus · minutes · why ·
walkId` (sprehod, ki vsebuje postajo). Zastavica `synthesized: false` pomeni odkrito,
da AI pripovedi ni bilo in načrt nosi deterministične povzetke — načrt nikoli ne odpove.

---

## Hitrostne omejitve in predpomnilnik
- AI poti (`guide`, `audio-guide`, `curator`, `plan-visit`): **12 zahtev / 10 minut / IP**; odgovori predpomnjeni **24 h**.
- Ostale poti: brez omejitev (veljajo ravni uporabe Vercel).
- Pošteno rabo pričakujemo po duhu licence CC BY-SA 4.0 — navedite vir.

## Integracija
- IIIF manifesti so porabljivi v Mirador/Universal Viewer.
- JSON-LD + `sitemap.xml` + PWA + Wikidata `sameAs` omogočajo povezovanje (LOD).
- Za rudarjenje metapodatkov glej `/api/opendata` (analogno Smithsonian odprtemu arhivu, a v majhnem obsegu).
