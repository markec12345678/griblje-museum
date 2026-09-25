# 80 · Val 67 — ATLAS 1825 §15 PASS 5: MAP DATA MODEL v1 (podatkovni zemljevid)

**Issue:** #42 §15 (+ §9/§10/§11/§12 varovalke) · **PR:** feat/val67-map-data-model · **Datum:** 25. 9. 2026
**Način:** čisto lokalni val (0 VLM klicev, 0 web klicev) — nadgradja podatkovno-API + UI sloja nad KG v1.3.

## Kaj je PASS 5 (#42)

> »Zemljevid mora postati **podatkovni zemljevid**, ne samo vizualizacija.«
> Minimalni objekti: House, Parcel, Person, Place/Toponym, Event, Source.
> **Vsak objekt mora biti klikljiv in sledljiv do vira.**

Do vala 66 je UI zemljevida (`cadastre-map-view.tsx`) bral statični `cadastre-a01.json` (val 52) — ločen vir od znanstveno vzdrževanega Knowledge Grapha. Val 67 mapira KG v enoten podatkovni sloj in ga spravi na zemljevid.

## Podatkovni sloj — `src/lib/atlas-map.ts` (čista plast, deterministična)

### Sloji (#42 §15)

| sloj | vir v KG | vsebina | koordinate |
|---|---|---|---|
| `map_objects` | 34 MAP_OBJECT (val 65: 24 A01, val 66: 8 A02 + 2 A05) | node_id, sheet, building_type, bp_glyph (normalizacija `bp`/`bp_glyph`), glyph_tier, px, georef_status, evidence_status | A01: px + lat/lng (PROVIZORIČNO, 1 sidro) · A02–A05: **px brez lat/lng** |
| `houses` | 167 HOUSE ← BP_BOUND_TO_HOUSE ← BP ← CORRESPONDS_TO_BP ← MO-A01 | node_id, house_no_1825, bp_refs (vsi statusi, nič skritega), located, position{via_bp, map_object} | samo locirane; **NOT_LOCATED = ničelna pozicija** |
| `toponyms` | 37 TOPONYM (val 62) | node_id, label, type, historical_only, modern_mapping, evidence_status | brez (modern_mapping UNKNOWN) |
| `sheets` | SRC-A01…A05 (§11) | vac_details_url, št. objektov po listu, georef_status | — |

### Reševanje položaja hiše — strogo po dokazni verigi

Hiša je locirana **izključno** če verigi `HOUSE ← BP_BOUND_TO_HOUSE ← BP ← CORRESPONDS_TO_BP ← MAP_OBJECT(A01)` veruje graf. Preferenca med kandidati je determinističen **rang statusa veze** (val 57 matrica): CONFIRMED(-2x) > VERIFIED(-2x) > PROBABLE > REVIEW > SINGLE_SOURCE > UNCERTAIN > CONFLICT, izenačene → nižji BP. Pozicija = lokacija glife BP-ja; konfliktne veze ostanejo vidne v `bp_refs` (nič ne skrito, §14).

### Varovalke (nič ne ugiba)

- **KG-F05 varovalka**: A02–A05 glife (BP 12/20/22) NE locirajo hiš — brez sidra A01↔A02 bi bila lat/lng izmišljotina (test to zagotavlja).
- **§9 parcele**: 2.467 PARCEL vozlišč NIMA geometrije — test zahteva `geometry/coordinates/px/lat === undefined` na vseh; »lepih« parcel ne rišemo.
- **§10 disclaimer**: vsak odgovor nosi »Georeferenca je PROVIZORIČNA … OSM NI zgodovinski dokaz«.
- **DoD veriga**: vsak feature nosi `evidence_url` → `/api/atlas/evidence?node=…` (val 64) → `vac_details_url` (originalni dokument).

## API — `GET /api/atlas/map`

- `?layer=all` (privzeto: meta + counts + sheets + vse plasti) · `map_objects` · `houses` · `toponyms` · `sheets`
- `?sheet=A01..A05` filter; neznana plast/list → **400** `unknown_layer`/`unknown_sheet` (poštene napake)
- ista konvencija kot evidence API: `no-store`, CORS `*`, `x-correlation-id`, `force-dynamic`

## UI — `cadastre-map-view.tsx` (list A01)

- sloji KG na avtentičnem listu (CRS.Simple, px prostor): **kartografski objekti** (črtani zeleni marker z glifo, popup: node_id, tier, tip, georef opozorilo, »Dokazna veriga ↗«) + **hiše prek BP** (polni olivni marker s h. št., popup: evidence_status, vse BP veze s statusi, veriga)
- stikali slojev (privzeto: objekti ON, hiše OFF — proti neredu) + števci v stranskem panelu + opomba o A02–A05 objektih (brez koordinat, samo registry)
- i18n: novi ključi `kataster.kg*` v SLO in EN; obstoječi val 52 sloj ostaja nespremenjen (zdaj dva neodvisna sloja: arhivski izlušek + KG glifna plast)
- loading/error stanja (»Podatkovni sloji se nalagajo …« / »trenutno niso na voljo«)

## QA

- `tests/atlas-map.test.ts` — **19 novih testov** (listi §11 z vac URL-i, 24/8/2/0/0 štetja, A01 px+lat vs A02–A05 px-only, cerkev building_type=church brez lat, bp_glyph normalizacija, H-040 veriga via BP 94 CONFIRMED, not-located brez pozicije, CONFLICT veza ne skrije glife, 37 toponimov historical_only, KG-F05 varovalka BP 12, parcele brez geometrije na vseh 2.467, evidence_url encode)
- `tests/api-smoke.ts` — **+5 preverb** (layer=all štetja + disclaimer, H-040 locirana, A02–A05 brez koordinat + BP 12 varovalka, sheets 5 × vac URL, 400 neznana plast) → **60/60** na živem strežniku
- **suite 294/294** · tsc čist · lint čist
- +0 virov / +0 trditev / +0 novih MAP_OBJECT — val je sloj nad obstoječim KG v1.3 (3.309 nodes / 3.569 edges / 621 claims)

## Meja vala (kaj PASS 5 v1 ŠE ni)

- georeferenca ostaja PROVIZORIČNA (1 sidro; §10 več kontrolnih točk = ločen nalog)
- Story Engine (§16–§22) ni dotaknjen — »najprej podatki, potem zemljevid, šele nato zgodbe«
- pogled »Danes« (OSM) ostaja brez KG slojev v1 (preprečeno mešanje provizoričnih georef z OSM mito); parcelni poligoni, Person/Event sloji sledijo v v2 ob novih virih (PS p56–143, PT p7 @300dpi)

## Naslednje

1. ob VLM/arhivski kvoti: PS p56–143 + PT p7 re-read @300dpi (KG-F01/F04) + PR re-read (mejne točke F-A05-03)
2. višji dpi A02 glife + sidro A01↔A02 (potem smemo 12/20/22 mergati in locirati)
3. PASS 6 entity/relation graph (story-graph §21) · PASS 7 story engine · PASS 8 coverage report
