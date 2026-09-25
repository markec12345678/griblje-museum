# Val 69 — ATLAS 1825 PASS 7: STORY ENGINE v1 (issue #42 §16–§18 + §22)

**Datum:** 2026-09-26 · **Branch:** `feat/val69-story-engine` (stacked na `feat/val68-story-graph`) · **Stanje ob startu:** main @ d989fc6 (val 67), val 68 lokalno commitan (7c631d0, čaka na žeton za push)

---

## 1. Kaj je bila naloga (§25 PASS 7)

Issue #42 §16: »Ko je podatkovna osnova dovolj zanesljiva, naredi sloj, ki iz
zemljevida generira zgodovinske zgodbe. Ne piši ene fiksne zgodbe.« — klik na
hišo → podatki 1825 → **»Zgodba te hiše«** kot časovna pripoved iz dokazov.
§18: zgodba celotne vasi. §17: vsaka zgodba ločuje 🟢 DOKAZANO ·
🟡 VERJETNO/NEPOPOLNO · 🔴 KONFLIKTNO · ⚪ NEZNANO; »AI ne sme zapolnjevati
praznin z domišljijo.« §19: »AI mora zgodbo sestaviti iz strukturiranih
claims + sources, ne iz prostega modelskega spomina.«

## 2. Arhitekturna odločitev: v1 = 100 % deterministično, BREZ LLM

Story Engine v1 je čista deterministična plast (`src/lib/atlas-story-engine.ts`)
nad KG v1.4 + story grafom (val 68). Zgodba je **sestavek**, ne generiranje:
vsak poved je vezan na izvorni claim/source ID. To je neposredna izvedba §17/§19
— LLM sloj (če bo kdaj) lahko sede SAMO na ta struktuirani izhod in pod istim
story_engine_contract (§22), brez možnosti izmišljevanja.

### Zgodba entitete (§16 »Zgodba te hiše«)

`generateEntityStory(ref)` — ref sprejme enake okrajšave kot story-graph API
(`HOUSE:H-040`, `H-040`, `HOUSE 40`, `BP:094`, `94`, `TP-001`, `MO:MO-A01-002`).
Za hiše §16 sekcije: **Hiša 1825** (številka + BP vezave z final_status iz
reconciliacije) → **Lastništvo 1825** (OWNER_DOCUMENTED + OWNER_VARIANT_DOCUMENTED
claims, osebe razrešene na PER-xxxx, vir + stran na povedi) → **Parcele in raba
zemljišča** (HAS_PARCEL, capped na 12 z izrecnim preostankom; parcele z
dokumentirano rabo na vrhu — dokazano najprej) → **Na katastrskem listu** (MO prek
CORRESPONDS_TO_BP z raster px) → **Povezane osebe** → **Dokumentirani dogodki**
(samo če obstajajo — §17 »kasnejša zgodovina samo če obstaja vir«) →
**Konflikti (§14: ostajajo vidni)** → **Kaj še ne vemo (§17)** (RG vrzeli + izrecno
neznanje). Za BP/PERSON/PARCEL/TOPONYM/EVENT/MO/SOURCE: splošne sekcije
(trditve claim-first + relacije s SLO narrativnimi znaki iz PASS 6 + konflikti + neznanje).

### Zgodba vasi (§18 »Zgodba Gribelj 1825«)

`generateVillageStory()` — 10 sekcij po §18: 1. pokrajina in kraj ·
2. katastrski listi (vseh 5, uodid + število objektov) · 3. hiše (167 z
razpadom po dokaznem stanju: CONFLICT 49 / UNKNOWN_SEMANTICS 73 /
SINGLE_SOURCE 32 / PARTIAL 13) · 4. lastniki in osebe (488: owner(pua) 98 /
owner(ps) 163 / owner_variant(pt) 227) · 5. parcele (2467: PUA 2035, PS 432) ·
6. raba zemljišča · 7. toponimi/poti/voda (37; ločene poti/voda = izrecna
negativna ugotovitev §13) · 8. povezave (622 trditev / 3569 relacij po tipu) ·
9. pomembni objekti (34 MAP_OBJECT, cerkev sv. Vid, BP glife pokritost) ·
10. neznanke (8 RG, BP brez lokacije, konfliktne trditve).

### story_engine_contract (§22) — vsak izhod

`story_id` (SE-XXXXXXXXXX = sha256(scope:key|kg_sha256|story-engine-v1)) ·
`input_entity_ids` · `used_claim_ids` · `used_source_ids` ·
`generation_timestamp` (= čas gradnje podatkov: max generated_at story atomov —
determinističen) · `prompt_version` (»deterministic-atlas-story-engine-v1 — brez
LLM«) · `story_status` · `content_hash` (sha256 kanonične vsebine) ·
`kg_sha256` + `data_val` (podatkovna verzija). **Sprememba podatkov ⇒
sprememba story_id in content_hash** — točno §22 zahteva.

**Pravilo pogodbe (val 68): »zgodba brez povezav = NE-OBJAVLJENA«:**
`EVIDENCED` (claims ≥ 1 in sources ≥ 1) / `PARTIAL_EVIDENCE` / `NOT_PUBLISHED`
(ni claims in ni sources). V grafu je 170 popolnoma nedotaknjenih parcel =
čisti NOT_PUBLISHED primer (testirano).

### §17 tier preslikava — popolna in varovala

`evidenceTier(status)`: natančna tabela (CONFIRMED-2x/VERIFIED-2x/VERIFIED/
VERIFIED_FORM/STABLE/FOUND/TRANSCRIBED → 🟢; PROBABLE/REVIEW/SINGLE_SOURCE/
PROVISIONAL/PARTIAL/TRANSCRIBED_PARTIAL/UNKNOWN_SEMANTICS → 🟡;
CONFLICT/REVIEW-CONFLICT → 🔴; UNCERTAIN/UNKNOWN/NOT_FOUND/UNRESOLVED → ⚪)
→ varovalni vzorci (CONFLICT prej kot FOUND!; **neznan status je NIKOLI tiho
DOKAZANO** → 🟡). Test dokazuje popolnost: vsi 15+ statusov v grafu imajo tier.

## 3. Ugotovitve vala 69

- **F-SE-01 (novo, dokumentirano v poročilu — KG findings niso spreminjani):**
  raba zemljišča JE delno dokumentirana — 432 PS-parcel (val 61) ima
  `land_use_category`: njiva 230 · travnik 60 · gozd 13 · vrt 10 · pašnik 9 ·
  drugo 4 · UNKNOWN 106; 2035 PUA-parcel čaka na PV prepis [373418].
  zgodba vasi to loči: 🟢 dokumentirano (razpad po kategorijah) + ⚪
  ni prepisano. Hiša 40: 9/121 parcel z rabo (8 njiva + 1 UNKNOWN).
- **F-SE-02:** PS parcele nosijo `TRANSCRIBED_PARTIAL` (cross_ref_to_pua
  UNKNOWN — F14) → 🟡, ne 🟢: raba je prepisana, vezava pa nerazrešena. Tier
  sistem to pravilno loči brez ročnih izjem.
- **F-SE-03:** hiša 40 (najbogatejša entiteta): 13 claims / 5 virov / 7 sekcij /
  51 povedi (7 🟢 / 28 🟡 / 14 🔴 / 2 ⚪) — konflikti (PUA Sautter vs PS Muster)
  ostanejo vidni, neznanje izrecno.
- **F-SE-04 (izrus):** A01 MAP_OBJECT-i nosijo `sheet: null` (samo A02/A05 ga
  imajo) — list se izpelje iz node_id predpone (`MO-A01-*` → A01). Deterministično,
  dokumentirano v kodi.

## 4. API (nov endpoint, enake konvencije kot ostali atlas API-ji)

`GET /api/atlas/story`
- `?entity=HOUSE:H-040` → zgodba entitete (§16)
- `?scope=village` → zgodba vasi (§18)
- poštene napake: brez parametra → 400 `missing_param` · neznan scope → 400
  `unknown_scope` · neznana entiteta → 404 `node_not_found`
- CORS + no-store + x-correlation-id (enako kot story-graph/evidence/map)

## 5. QA

- `tests/atlas-story-engine.test.ts` — 31 testov / 157 expect:
  - §17: tier preslikava (zelena/rumena/rdeča/bela) + **NOT_FOUND nikoli ne
    ujame substring pravila za FOUND** + popolnost nad vsemi statusi grafa + ikone
  - §22: contract polja, story_id oblika, determinizem (dva klica → deep-equal,
    isti story_id + content_hash), kg_sha256 usklajen z story-grafom
  - §16: hiša 40 — lastništvo (C-00083 PUA Sautter + C-00154 PS Muster,
    osebi PER-0059/PER-0157), BP 94 DOKAZANO z C-00609 + 91/95 KONFLIKTNO,
    MO-A01-002 prek BP 94, 121 parcel capped + raba 9 od 121, »Kaj še ne vemo«
  - pogodba: nedotaknjena parcela → NOT_PUBLISHED (nič izmišljenega, vse items
    brez claim/source) · neznan node → null
  - §18: vasi — 10 sekcij, številke iz grafa (167/488/2467/34/5), raba ločena
    (326 dokumentiranih z njiva/travnik/… + 2141 ni prepisano), neznanke
    (8 RG + NOT_FOUND BP + konflikti), EVIDENCED s C-00622, determinizem
- Celoten suite: **345/345** (bil 314) · tsc čist · lint čist
- api-smoke: **78/78** (bil 70; +8: story H-40 EVIDENCED + tiri, §16 sekcije,
  determinizem čez HTTP, vas 10 sekcij + C-00622, NOT_PUBLISHED, 400/400/404)
  — živ na :3000

## 6. Varnostne popravke med razvojem

- stray znaki v komentarju (urejeno)
- bind claim lookup: odstranjen napačni pogoj `TIER_EXACT[c.status] === undefined`
- SOURCE nodes nimajo evidence_status (13× None) → listi v §18.2 uporabijo
  VERIFIED_FORM (kataloški dejstvi z vac_details_url)
- `moSheet()`: A01 iz node_id predpone (F-SE-04)
- hišna številka item nosi vire (SRC-PUA + SRC-PS = register hiš)
- osebe: tier iz osebinega evidence_statusa, ne hardcode

## 7. Merljiv rezultat PASS 7

| kazalnik | vrednost |
|---|---|
| nov API endpoint | 1 (`/api/atlas/story`) |
| zgodba entitete | katerikoli od 3.309 node-ov (HOUSE bogata §16 struktura) |
| zgodba vasi | 10 sekcij, 24 povedi |
| tier preslikava | 15+ statusov → 4 tiri, popolna, testirana |
| story_id / content_hash | deterministična iz kg_sha256 (§22) |
| testi | 345/345 (+31) |
| api-smoke | 78/78 (+8) |
| +0 virov / +0 trditev / +0 UI | ✓ (samo bralna plast nad KG) |

## 8. Git + naslednje

- Branch `feat/val69-story-engine` (stacked na val 68); commit lokalno —
  **push čaka na GitHub žeton** (vzorec val 66: uporabnik priskrbi → PR → CI →
  merge → poročilo #42).
- Naslednje (po vrstnem redu): 1) push val 68 + 69 + poročili #42 (žeton);
  2) PASS 8 coverage report (§23/§24 — `atlas-1825-coverage-report` + 14
  obveznih outputov) = zaključek ATLAS 1825 sklopa; 3) UI zgodbe (»Zgodba te
  hiše« klik-flux + §19 EXPLORE 1825 nał zemljevidu); 4) ob kvoti PS p56–143 /
  PT p7 @300dpi / PR re-read / PV prepis (F-SE-01).
