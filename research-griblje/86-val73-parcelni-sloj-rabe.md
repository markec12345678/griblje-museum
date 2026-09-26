# 86 — Val 73: PARCELNI SLOJ RABE v1 (ISSUE #42 §19)

**Datum:** 2026-09-26 · **Baza:** main @ 1306de3 (val 72) · **Branch:** `feat/val73-parcel-layer`
**Naročilo:** worklog val 72 → naslednji korak: »parcelni sloj rabe §19 (PS 432 parcel)«

---

## 1. Kaj je bil problem

EXPLORE 1825 (val 71) je izpolnil §19 za hiše/objekte/osebe/toponime, ampak **raba zemljišč
ni imela svojega sloja** — v UI je bil filter rabe **onemogočen fieldset** z opombo
»parcelni sloj (2467 parcel) še ni na zemljevidu — raba je dokumentirana v zgodbi hiše«.
KG je že imel vse 2467 PARCEL vozlišč (val 60/63), raba pa je bila dokumentirana le za
PS parcele (val 60, F-SE-01 val 69) — manjkal je dostop do tega znanja na nivoju sloja.

## 2. Arhitektura (vse deterministično, nič ugibanja)

- **`src/lib/atlas-map.ts`**: nova `parcelFeatures()` — PARCEL sloj nad KG:
  `node_id, origin (PUA|PS), section, parcel_number, land_use_category,
  land_use_original, co_referenced, house_refs (obratni indeks HAS_PARCEL, 2865 vezav),
  evidence_status, source_ids, evidence_url`. **BREZ px/lat/lng** — parcela nikoli
  ne nosi koordinat (§9: meje niso dokazane, 0/2467).
- **`GET /api/atlas/map`**: `?layer=parcels` + `layers.parcels` v `layer=all` +
  novi števci `parcels / parcels_with_land_use (326) / parcels_land_use_unknown (106) /
  parcels_no_land_use_record (2035)`.
- **`src/lib/atlas-explore.ts`** (čista logika, testirljivo brez DOM):
  `LandUseBucket` (njiva/travnik/gozd/vrt/pašnik/drugo/**UNKNOWN**/**NONE** — dve
  ločeni »nezanki«), `landUseBucketOf` (varovalka: neznana kategorija NIKOLI tiho
  »drugo«), `parcelTier` (zrcalno TIER_EXACT), `parcelLabel`, `parcelMatchesQuery`,
  `parcelVisible` (način + raba), `parcelLandUseCounts`, `sortParcelsForBrowse`
  (dokazana raba najprej → sekcija I–V → številka → node_id), `parcelExploreCounts`.
- **`cadastre-map-view.tsx`**: onemogočen fieldset → **živ parcelni sloj**:
  preklopni seznam **Hiše & objekti | Parcele**, čipi filtra rabe s števci
  (Vse rabe 2467 · Njiva 230 · Travnik 60 · Gozd 13 · Vrt 10 · Pašnik 9 · Drugo 4 ·
  Neznana raba 106 · Brez zapisa 2035), lenar sloja šele ob izbiri Parcele
  (`?layer=parcels` — nič teže v prvem naboru), vrstice registrov z raba, originalnim
  terminom (»Ried« …) in povezavami na hiše, klik → zgodba parcele.

## 3. Poštenost (§4/§9/§14/§17/§22)

- **Dve nezanki ločeni**: `UNKNOWN` = PS termin ni nedvoumen (Ried, Lehngut …,
  original ohranjen in prikazan); `NONE` = PUA rabe sploh ne zapisuje. Nikoli
  zliti v en »neznano«.
- **Brez geometrije**: parcele niso risane na zemljevid; opomba v panelu
  (i18n × 5) pojasni, da je sloj register s povezavami na hiše, ne risba (§9).
- **Dokazni tir**: PUA `TRANSCRIBED` → 🟢 DOKAZANO (polni register 98/98);
  PS `TRANSCRIBED_PARTIAL` → 🟡 VERJETNO (55/143 strani). »Samo dokazano« čipi
  ločita 2035 / 432 pravilno.
- **Zgodba parcele** (§16): genericSections + claims/relacije; **POŠTEN NEZGOD
  IZPRAVLJEN — smera branja**: relacija HAS_PARCEL na fokus-parceli je prej
  brala »ima parcelo: Hiša št. 16« (zavajajoče); zdaj **»pripada hiši: Hiša št. 16«**
  (ekspliciten REVERSE_LABELS mehanizem v engine, §17). Headline: »Zgodba entitete:
  parcela PS 1« (berljiva oznaka, ne surovi node_id).
- Pogodba §22 nespremenjena: PARTIAL_EVIDENCE + story_id + content_hash.

## 4. Najdbe razvoja (kot pri vsakem valu — kar zbole, to uradno)

- **F-PS-DUP (podatek, ne bug):** isti `parcel_id` iz PS se pojavi v več vrsticah
  registra — npr. **PS-p005-j484: Breugl Georg (h.18) IN Urich Peter (h.21)** =
  dva lastnika referencirata isto parcelo (znak so-referenciranja, kot pri PUA).
  KG v1.5 to zrcali z 2 vozliščema istega ID-ja (432 vrstic, 412 unikatnih PS id).
  **UI pouček:** `key={node_id}` bi bil podvojen ključ → React reconciliacija
  seznama se pokvari (state pravi 2 vrstici, DOM pusti 22!) — ključi so zdaj
  `${node_id}-${idx}`, vrstice ostanejo ločene kot vir zahteva (§5 nič združevanja).
- **F-GRID-73:** na 390 px je seznam parcel (nowrap vrstice z dolgimi seznami hiš)
  razširil grid stolpec do horizontalnega preliva — standardni `min-w-0` na
  grid/panel/ul + `overflow-x-hidden` (preliv 0/0 po popravku).
- Lenar sloja (fetch šele ob izbiri Parcele) — /api/atlas/map prvi nabor ostane lahen.

## 5. QA

- **testi:** tests/atlas-explore.test.ts +19 (vedra rabe + varovalka, tirji,
  oznake, filtri, števci čez KG = registrske resnice val 60 (njiva 230 … NONE 2035),
  deterministični vrstni red, **parcela NIKOLI ne nosi koordinat**, obratni indeks
  HAS_PARCEL, zgodba parcele z obrnjeno oznako, berljivi headline, i18n × 5) →
  **440/440** (+19)
- **api-smoke:** +3 (counts.parcels = 2467 z razčlenjeno rabo; `?layer=parcels`
  brez geometrije + obratni indeks + sledljivost; zgodba PARCEL:PUA-II-201
  PARTIAL_EVIDENCE + »pripada hiši«) → **93/93**
- **tsc / lint / verify-i18n** čisti; i18n **1032 ključev × 5** (+18: preklop,
  čipi rab, poštene opombe, zgodba parcele, nalaganje/napaka)
- **agent-browser e2e:** Parcele seznam ✓, čipi z pravimi števci ✓, poizvedba
  »913« → 2 vrstici (PS 913 + III/1913) ✓, Samo dokazano → 2035 ✓, Neznana raba →
  106 ✓, zgodba parcele (parcela PS 1 + pripada hiši + pogodba) ✓, mobilno 390 px
  (brez preliva, celoten flux) ✓, konzola 0 napak ✓, sticky footer ✓

## 6. Izpeljani izhodi

- `/api/atlas/map?layer=parcels` (2467 značilk, deterministično)
- nič novih virov / nič novih trditev / nič sprememb KG — **sloj je projekcija
  obstoječih dokazov** (+0/+0/+0)

## 7. Preostalo iz §19 in naprej

- ~~klikne parcelo~~ ✓ · ~~filtrira rabo zemljišč~~ ✓ · filtrira osebe (osebe
  ostanejo prek evidence API-ja — UI sloj oseb še odprt) · časovni drsnik §20
- naslednje (worklog): ob kvoti re-readi PS p56–143 / PT p7 @300dpi / PR / PV
  (PV = Ausweis über die Benützungsart — naslednji vir za rabo 2035 parcel!)
- izven peskovnika: šolski list / SA Podzemelj / SI AS 749 / Zucchelli
