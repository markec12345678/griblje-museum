# 83 — Val 70: ATLAS 1825 PASS 8 — FINAL COVERAGE REPORT (issue #42 §23/§24)

**Datum:** 2026-09-26 · **Branch:** `feat/val70-coverage-report` · **Tip:** podatkovni sloj + API (+0 virov / +0 trditve / +0 UI)

---

## 1. Naročilo in cilj

Issue #42, PASS 8 = »Final verification + coverage report«:
- **§23 QUALITY GATE** — finalni coverage report z 18 kategorijami; za vsako
  **TOTAL / VERIFIED / PARTIAL / CONFLICT / UNKNOWN / NOT FOUND**.
- **§24 OBVEZNI OUTPUTI** — 14 imenovanih artefaktov (`house-register-1825` …
  `story-engine-spec-1825`).

Pravila, ki jih ta val NE krši: nič ugibanja, nič umetnih procentov (issue #43
§10), NOT_FOUND ≠ dokaz neobstoja (§3/§7), merge brez dokaza prepovedan (§5),
konflikti ostanejo vidni (§14).

## 2. Zasnova

**Nič novega raziskovanja** — PASS 8 je *verifikacijski* val: builder
`research-griblje/atlas-1825/build-coverage-report.py` bere 14 obstoječih
artefaktov (PUA/PS/PT registri, house/parcel/person/bp-reconciliation, A01 +
pass4b inventarja, toponim/conflict/negative registri, KG v1.4, story graf) in
izračuna šeststatusno shemo **po izrecnih mapping pravilih** (vsaka kategorija
nosa `mapping_rule` + `evidence` kazalce).

### Invarianti (fail-fast — kršitev = izhod NE zapisan, exit 2)

| ID | invarianta |
|---|---|
| I1 | vsota šestih statusov == total za vsako kategorijo |
| I2 | manifest pokrije točno §24 outpute 1–14; vsaka datoteka obstaja na disku |
| I3 | noben procent — umetna popolnost prepovedana (issue #43 §10) |
| I4 | vsaka kategorija ima mapping_rule + evidence pointers |
| I5 | NOT_FOUND ≠ dokaz neobstoja (opomba na vsaki kategoriji z NOT_FOUND > 0) |

## 3. §23 QUALITY GATE — 18 kategorij (izračunano, ne ocenjeno)

| kategorija | total | VERIFIED | PARTIAL | CONFLICT | UNKNOWN | NOT_FOUND |
|---|---:|---:|---:|---:|---:|---:|
| pua_entries | 98 | 45 | 25 | 28 | 0 | 0 |
| houses | 167 | 0 | 45 | 49 | 73 | 0 |
| pt_rows | 100 | 40 | 9 | 51 | 0 | 0 |
| bp_1_100 | 100 | 40 | 9 | 51 | 0 | 0 |
| bp_house_binding | 100 | 2 | 39 | 54 | 0 | 5 |
| bp_a01_binding | 100 | 9 | 18 | 30 | 6 | 37 |
| parcels | 2467 | 907 | 1107 | 453 | 0 | 0 |
| parcel_geometry | 2467 | 0 | 0 | 0 | 0 | **2467** |
| owners | 488 | 140 | 198 | 150 | 0 | 0 |
| persons | 488 | 140 | 198 | 150 | 0 | 0 |
| a01_buildings | 67 | 9 | 48 | 0 | 10 | 0 |
| cadastral_sheets | 5 | 2 | 3 | 0 | 0 | 0 |
| toponyms | 37 | 11 | 26 | 0 | 0 | 0 |
| sources | 13 | 9 | 4 | 0 | 0 | 0 |
| unresolved_conflicts | 113 | 1 | 4 | 108 | 0 | 0 |
| negative_results | 13 | 13 | 0 | 0 | 0 | 0 |
| georeferencing | 5 | 0 | 1 | 0 | 4 | 0 |
| unknowns (agregat) | 3322 | — | — | — | 3322 | — |

Ključna mapping pravila (dokumentirana na vsaki kategoriji):
- hiše: SINGLE_SOURCE → PARTIAL (en vir brez korooboracije); UNKNOWN_SEMANTICS → UNKNOWN
- PT/BP vrstice: STABLE → VERIFIED; REVIEW-CONFLICT → CONFLICT
- BP↔A01: v65 glifa CLEAR → VERIFIED; prior-only val57 CONFLICT → CONFLICT;
  A02 kandidati 12/20/22 (bp_cross REVIEW, **brez sidra A01↔A02**) → UNKNOWN,
  merge prepovedan (F-A02-03, KG-F05)
- parcele: PUA VERIFIED-2x → VERIFIED; PS vse SINGLE_SOURCE → PARTIAL
- osebe: VERIFIED-2x/STABLE → VERIFIED; 161 possible_duplicates ostaja NOT_MERGED (§5)
- konflikti: OPEN → CONFLICT (ostajajo vidni §14); RESOLVED → VERIFIED
- georeferenca: A01 PARTIAL (PROVIZORIČNO ±200–500 m); A02–A05 UNKNOWN (brez sidra)

## 4. §24 OBVEZNI OUTPUTI — manifest 14/14 EXISTS

| # | output | datoteka | status |
|---|---|---|---|
| 1 | house-register-1825 | research-griblje/atlas-1825/house-register-1825.json | EXISTS |
| 2 | parcel-register-1825 | …/parcel-register-1825.json | EXISTS |
| 3 | person-owner-register-1825 | …/person-owner-register-1825.json | EXISTS |
| 4 | bp-house-reconciliation-1825 | …/bp-house-reconciliation-1825.json | EXISTS |
| 5 | a01-coverage-1825 | …/a01-coverage-1825.json | **NEW (izpeljan)** |
| 6 | cadastral-sheet-coverage-1825 | …/cadastral-sheet-coverage-1825.json | **NEW (izpeljan)** |
| 7 | toponym-register-1825 | …/toponym-register-1825.json | EXISTS |
| 8 | source-coverage-1825 | …/source-coverage-1825.json | **NEW (izpeljan)** |
| 9 | conflict-register-1825 | …/conflict-register-1825.json | EXISTS |
| 10 | negative-result-register-1825 | …/negative-result-register-1825.json | EXISTS |
| 11 | atlas-map-data-model-1825 | …/atlas-map-data-model-1825.json | **NEW (izpeljan)** |
| 12 | atlas-1825-coverage-report | …/coverage-report-1825.json | **NEW (ta artefakt)** |
| 13 | story-graph-1825 | …/story-graph-1825.json | EXISTS |
| 14 | story-engine-spec-1825 | …/story-engine-spec-1825.json | **NEW (izpeljan)** |

Izpeljani artefakti vsebujejo SAMO podatke iz obstoječih virov:
- **a01-coverage-1825** — matrica BP↔A01/A02 za vseh 100 BP (63 lociranih:
  9 VERIFIED CLEAR glife, 18 PARTIAL, 30 CONFLICT, 6 UNKNOWN, 37 NOT_FOUND) +
  merge-guard F-A02-03.
- **cadastral-sheet-coverage-1825** — A01–A05: uodidi, sekcije, število objektov,
  negativni listi A03/A04, georef stanje, KG-F05 napis »Siche die
  Reambullirungs Beimappe«, ostanki ekstrakcije.
- **source-coverage-1825** — 13 SOURCE nodes z uodid/docid/pages + prepisna
  pokritost (PUA 49 str./98 vrstic/2 prehoda; PS 143/1073/2; PT 8/100/2) +
  popravljen uodid-katalog (KG-F02) + next_reads.
- **atlas-map-data-model-1825** — §15 minima entitet, node/edge statistika
  KG v1.4, sloji val 67, binding pravila, geometrija: NE izrisana.
- **story-engine-spec-1825** — §17 tier preslikava (4 tiri), §22 pogodba
  (story_id … content_hash), deterministična arhitektura BREZ LLM, api
  površine, pravilo NOT_PUBLISHED, ugotovitve F-SE-01/02/04.

Runtime kopija: `src/data/atlas-coverage-report-1825.json` (ena izhodna resnica,
piše builder).

## 5. API — GET /api/atlas/coverage

- brez parametrov → polni pregled: summary (18/14 + vsote **brez skupnega
  procenta**, z izrecno opombo), quality_gate (18 kategorij), outputs_manifest,
  invarianti, provenanca (kg_sha256 = d2416428a5d7977c), definition_of_done_status
- `?category=<id>` → posamezna kategorija (mapping_rule + native razčlenitev);
  neznana → 404 `unknown_category` s seznamom veljavnih
- `?outputs=1` → §24 manifest
- `?unknowns=1` → prečne nezanke po mestu izvora (9 vrst, vsota = total)
- konvencije: no-store + CORS + x-correlation-id; napake poštene (400/404/500)

Lib plast: `src/lib/atlas-coverage.ts` (O(1) indeks kategorij; tipi
CoverageCategory/CoverageOutput/CoverageReport).

## 6. QA

- `tests/atlas-1825-coverage.test.ts` — **37 testov / 233 expect**:
  - §23 struktura: 18 kategorij, I1 vsota=total, I3 nič procentov, I4
    mapping_rule/evidence, I5 opomba na NOT_FOUND kategorijah, invarianti
    dokumentirani, provenanca (kg_sha256, 14 built_from)
  - številčne resnice: PUA 98/45/25/28, hiše 167/49/45/73, PT+BP 100/40/9/51,
    BP↔hiša 2/39/54/5, BP↔A01 9/18/30/6/37 + 63 lociranih, parcele
    2467/907/1107/453, geometrija 0/2467, osebe 488/140/150 + opomba
    »en register«, A01 67 (9/48/10 + red glyphs 8), listi 5 (2 VER negativni),
    toponimi 37/11/26, viri 13/9/4, konflikti 113/108 OPEN, negativni 13,
    georef 1 PARTIAL + 4 UNKNOWN, nezanke agregat
  - §24: 14 outputov EXISTS (fs preverba!), izpeljani artefakti deterministični,
    story-engine-spec (BREZ LLM + story_id/content_hash), a01 matrica 63 BP
  - runtime kopija = arhivska resnica (kg_sha256 istovetna)
  - lib: overview/kategorije/outputs/unknowns + 404 poti
  - uskladjenost: node_stats KG = kategorije; kg_sha256 = KG provenanca
- **Suite: 382/382** (+37) · tsc čist · lint čist
- **api-smoke: 84/84** (+6) na živem :3000 — pregled 18/14, hiše 167,
  bp_a01_binding 9 VER + 37 NF z opombo, manifest EXISTS ×14, nezanke agregat,
  404 unknown_category

## 7. Popravki med razvojem (vsi ujeti z invariantami/testi)

- mapping ključi parcel (»PUA/REVIEW« brez pravila) — invarianta I4 je odbila
  prvi zagon; popravljeno na predpone ključe
- toponim status »PROVISIONAL_MULTI — first word UNRESOLVED« brez pravila —
  dodano izrecno pravilo (→ PARTIAL)
- neznani SOURCE node SRC-SIAS176 (fond SI AS 176) — dodan (VERIFIED: popisana
  sestava)
- A02 kandidati: komentar je trdil »12 CLEAR → PARTIAL«, podatki pa kažejo
  bp_cross_status = REVIEW za vse tri → konservativno UNKNOWN (besedilo
  mapping_rule usklajeno s podatki)
- test: `toContain` nad array preverja natančen element (story_id …) →
  `some(startsWith)`; I5 zahteva kanonični stavek »dokaz neobstoja« tudi v
  opombah po meri → builder usklajen

## 8. Definition of Done (issue #42) — stanje po PASS 8

| zahteva | stanje |
|---|---|
| klik na hišo → kje/številka/lastnik/parcele/raba/BP/vir/osebe/dokazano/konfliktno/neznano | **podatkovno-API izpolnjeno** (val 63–69: /evidence + /story; veriga do vac_details_url) |
| zgodba vasi | **podatkovno izpolnjeno** (/story?scope=village) |
| UI »Zgodba te hiše« + EXPLORE 1825 (§19) | sledi (UI val) |
| PASS 8 coverage report | **TA VAL** ✓ |

## 9. Naslednje

1. push + PR + merge val 70 + poročilo na #42 (žeton uporabnika)
2. UI zgodbe: »Zgodba te hiše« klik-flux + §19 EXPLORE 1825 na zemljevidu
3. ob kvoti: PS p56–143 re-read, PT p7 @300dpi (KG-F01/F04), PR re-read
   (mejne točke), PV prepis (F-SE-01: raba 2035 parcel)
4. georef PASS: kontrolne točke + error estimate (§10); parcelne meje @višji dpi (§9)
5. arhivsko vprašanje KG-F05 (izmera-vs-reambulacija, SI AS)
