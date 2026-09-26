# Val 72 — ATLAS 1825 §10: GEOREF PASS v2 — reka Kolpa kot ravnalna črta

**Datum:** 2026-09-26 · **Issue:** [#42 §10](https://github.com/markec12345678/griblje-museum/issues/42) + #43 §10 · **Sklop:** 125 · **Testi:** 421/421 · **Smoke:** 90/90

> PASS 1–8 + UI zgodbe (val 71) ✓ · **ta val = §10 PRAVILNA GEOREFERENCA** (zadnji velik podatkovni blok iz Dela #42, izvedljiv v peskovniku) · ob kvoti ostajajo: PS p56–143 / PT p7 @300dpi / PR re-read / PV prepis

---

## 1. Povzetek

Georeferenca lista A01 (1824/27) je bila od val 52 **provizorična: 1 sidro + sever-navzgor + 2,19 m/px (±200–500 m)**. Ta val jo zamenja z **robustno similariteto (skala + rotacija + prevod), prilagodjeno po reki Kolpi** — z dvema kritičnima odkritjima:

- **F-GEO-01 (RESOLVED-V72):** stara skala je bila **~3,3× napačna**. Nota »320 Klafter = 277 px → 2,19 m/px« je bila merjena na **polni ločljivosti VAČ IIIF izvirnika**, delovni raster (2826×2273, javni `public/kataster/a01-1824.jpg`) pa je ~3,3× manjši od nje. Prava skala na delovnem rasterju je **0,7307 m/px**. Vse lat/lng iz val 52–71 so bile zato razpotegnjene od sidra — na robovih lista **do ±1–3 km** (coverage report val 70 je oceno »±200–500 m« preveč optimistično zapisal).
- **F-GEO-02 (RESOLVED-V72):** rotacija je empirično rešena: **0,88°** — list je skoraj sever-navzgor, torej je bila domneva val 52 smeri pravilna; napaka je bila samo skala (F-GEO-01).

Reka Kolpa je edini zunanji ravnalni features, ki ga list ponuja v celoti (teče po vsem vzhodnem robu, njen sodobni potek je natančno dokumentiran v OSM), hišne številke pa se izkažejo za **negativen** poskus vezave (§14 — dokumentirano, ne skrito).

## 2. Metoda (100 % deterministična, brez VLM)

`research-griblje/atlas-1825/build-georef-1825.py` (fail-fast, idempotenten):

1. **Ekstrakcija reke iz rastra** — »cool-mask« sledenje svetlega pasu Kolpe (`(R−B)<42 ∧ G≥R−8`), vrstice vsakih 6 px, okno ±60 px s kontinuiteto → **351 točk** (px, y_dol).
2. **Sodobna podlaga** — OSM centerline **Kupa/Kolpa, way 39699026** (Overpass posnetek 2026-09-26, `raw-web-val72-2026-10/`); izrazito označena kot **NI zgodovinski dokaz (§10)**, uporabljena izključno za poravnavo + validacijo (licenca ODbL).
3. **Fit** — [E,N] = s·R(θ)·[x, −y_px] + [tx,ty]; loss = trimirana (75 %) kvadratna razdalja do polilinije (ICP-lite: najbližja točka); **12 multi-startov** (s0 ∈ {0.60…0.75} × θ0 ∈ {−3°,0°,+3°}) z mejami (zaščita pred degeneriranim kolapsom s→0).
4. **Selekcija med kandidati** (reka sama ne ločuje: trimRMS ~36–43 m za zelo različne (s,θ)): vrata trimRMS ≤ 45 m **in** validacijska mediana ≤ 40 m; izbira = min validacija (tie-break min trimRMS). **Validacija je uporabljena samo za izbiro med kandidati, nikoli v loss-u.**
5. **Idempotenca** — sidro val 52 je **konstanta v builderju** (ne beremo ga iz datoteke, ki jo builder sam prepisuje; 2. zagon sicer da drugo rešitev — to je bilo v razvoju ujet in odpravljen). Determinizem I6: ponovljen fit z istimi starti mora dati identične parametre (tol. 1e-6).

## 3. Rezultat

| parameter | v1 (val 52–71) | **v2 (val 72)** |
|---|---|---|
| skala | 2,1909 m/px (napačno, F-GEO-01) | **0,7307 m/px** |
| rotacija | predpostavka 0° | **0,88° (empirično)** |
| kontrolne točke | 1 sidro | **reka 351 točk** + validacija na stavbah |
| error estimate | »±200–500 m« (v resnici ±1–3 km na robovih) | **trim-RMS ±38,2 m; reka mediana 41,3 m, p75 74,0 m** |
| validacija (neodvisna) | — | **v65 stavbe (24): mediana 16,6 m; prior (43): mediana 20,3 m** do najbližje sodobne stavbe (268 v 600 m) |
| staro sidro (1851,1778) | (45,57246, 15,29257) | pod v2: (45,57454, 15,29236) — 231 m premika |

Posodobljeni izhodi (vse deterministično iz builderja):

- `src/data/cadastre-a01.json` — meta.georef v2 + scale_note (F-GEO-01) + **56 stavb + 7 toponimov lat/lng** + overlay bbox **čez vse 4 robove** (rotacija sicer odstopi ~35 m).
- `a01-building-inventory-1825.json` — georef blok v2 + objects[].lat/lng/georef_status + prior lat/lng.
- **KG v1.5** (`build-knowledge-graph.py`) — MO-A01 koordinate + georef_status preko v2; **claims/edges/story atomi/ID-ji NESPREMENJENI**; + finding **KG-F08**. story_id se spremeni po §22 pogodbi (kg_sha256 `cbf32c2ede0f…`) — sprememba podatkov ⇒ sprememba ID, reproducibilnost deluje po predvideni poti.
- story-graph + coverage (val 72; georeferencing: **A01 VERIFIED** — §10 minimum izpolnjen: kontrolne točke ✓ transformacija ✓ primerjava s sodobnim zemljevidom ✓ dokumentiran error estimate ✓; A02–A05 še UNKNOWN) + 5 izpeljanih artefaktov §24.
- **`GET /api/atlas/georef`** (`?transform=1` za programsko uporabo) — odprti podatki o transformaciji + findings + pogodba.
- UI: opomba o georeferenci v vseh 5 jezikih — *»Zgodovinska geometrija ni sodobna podlaga (OSM)«* (označba §10); verify-i18n 1014 ključev × 5 zeleno.

## 4. Negativni rezultat: hišne številke (F-GEO-03, OPEN)

Vezava *hišna številka 1825 (PUA/PT) ↔ sodobna OSM hišna številka* je bila testirana kot potencialni vir kontrolnih točk: 99 sodobnih številk v jedru vasi (≤900 m), 18 kandidatskih parov prek BP↔hiša kandidatov val 57/59, RANSAC-lite s skala-priorom [0.55, 0.85]. **Max konsenz 2/18 = trivialno → NEGATIVE.** Številčevanje se je delno spremenilo ali pa so PT branja kandidatov napačna (93/100 vezav je še UNCERTAIN/CONFLICT). Resolucija: PT p7 re-read @300dpi (ob kvoti) + GURS stavbne parcele. **Nič skrito (§14)** — eksperiment je zapisan v `georef-1825.json.housenumber_experiment` + test varovalka.

F-GEO-04 (OPEN): listno merilo na raster ločljivosti ni berljivo (oznake razmazane) — neodvisna kontrola skale bo mogoča @300 dpi.

## 5. Invarianti + QA

- I1 river ≥ 250 · I2 trimRMS ≤ 60 m · I3 skala [0.55, 0.85] · I4 |rot| ≤ 5° · I5 validacija ≤ 40 m · I6 determinizem — kršitev = **izhod NE zapisan**.
- `tests/atlas-georef.test.ts` — **21 testov / 451 expect**: struktura, meje parametrov, transformacijska matematika (sidro roundtrip ±1 m; overlay bbox = f(s,θ,W,H); staro sidro ~231 m), konsistentnost vseh slojev (56+7+KG MO znotraj overlay; A02/A05 brez koordinat — KG-F05), coverage VERIFIED, §10 označba (disclaimer + i18n × 5), runtime = arhivska resnica.
- Suite **421/421** (400 + 21) · tsc čist · lint čist · verify-i18n 1014 × 5 · **api-smoke 90/90** (+2 georef).

## 6. Kaj ostaja

1. **A02 sidro** (cerkev sv. Vid — moderna pozicija znana; @300dpi glifa na A02) → georef A02–A05.
2. Listno merilo + robovi @300 dpi (F-GEO-04), GURS stavbne parcele (F-GEO-03).
3. Ob kvoti: PS p56–143, PT p7 @300dpi (rešuje tudi KG-F01/F04), PR re-read, PV prepis (raba §19 sloj).
4. Parcelne meje @višji dpi (§9) — samo dokazane, nič »lepih« parcel.
