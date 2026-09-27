# Val 84 — ISSUE #43 §1/§12 + #42 §22: KG v1.9 REBUILD — SRC-PS VOZLIŠČE PO VAL 82/83 + KASKADA STORY_ID

Deterministični infrastrukturni val (brez VLM, brez web, brez novih trditev). Izpolnjuje
worklog Task 44 »Naslednje« #3: KG vozlišče SRC-PS (»PARTIAL 55/143«) se posodobi na
dejansko stanje po val 82/83, kaskada kg_sha256 (§22 pogodba) regenerira story-graf,
timeline in coverage report. **Nič zgodovinskih podatkov ni spremenjeno** (issue #43 §12).

## 1. Kaj se je spremenilo (in kaj NE)

### KG v1.9 (`build-knowledge-graph.py` → `knowledge-graph-1825.json`)

- `val`: 77 → **84** · `title`: v1.8 → **v1.9**
- **SRC-PS vozlišče**: `PARTIAL 55/143 (val 57/61)` →
  `TRANSCRIBED 143/143 (2.871 vrstic: p1–55 val 57/61 + p56–143 val 82); p56–143 neodvisno
  re-brano 2× (val 83): struktura 1798≈1797, numerika ≥ 92 %, imena/kultur/absolutne površine
  PROVISIONAL (F-PV-04, NR-14) → pasovni/zoom re-read s kolonskimi sidri čaka`
- **KG-F10** (nova, val 84, RESOLVED-V84): dokumentira zgornjo spremembo + §22 kaskado.
- **NESPREMENJENO (študijsko potrjeno z diff proti snapshotu val 81):**
  nodes **3.309** (SOURCE 13 / HOUSE 167 / PERSON 488 / PARCEL 2.467 / BP 100 / TOPONYM 37 /
  EVENT 3 / MAP_OBJECT 34) · edges **3.569** (po tipih identično) · claims **622**
  (REVIEW 270 / VERIFIED 69 / CONFLICT 128 / SINGLE_SOURCE 111 / UNCERTAIN 40 / VERIFIED_FORM 4) ·
  research gaps **8** · story atomi **4** (SA-001..004, claim/source povezave ohranjene) ·
  ID-ji R-00001..R-03569 / C-00001..C-00622 zadržani · konflikt h.40 (PUA Sautter / PS Muster)
  ostane viden. Nov kg_sha256: **`526482d22a00…`** (bil `20ec8a0a…`).

## 2. Kaskada story_id (§22: kg_sha256 spremenjen → podatek spremenjen → zgodba označena)

| artefakt | sprememba |
|---|---|
| `story-graph-1825.json` (arhiv + runtime) | `kg_val` 77→84, `kg_sha256` → `526482d2…`, `regenerable` osvežen; entitete/relacije/atomov **identno** |
| `timeline-1825-1830.json` (arhiv + runtime) | `kg_sha256` → `526482d2…`; točke/metrike **identno** (2 DOCUMENTED / 6 AWAITING); vrata I1/I2/I6 ✓; osveženi 2 zastareli F-PZ-09 opombi (PS pokritost zdaj 143/143 — vrednosti NIČ spremenjene) |
| `coverage-report-1825.json` (arhiv + runtime) | `val` 81→**84**, `kg_sha256` → `526482d2…`; `negative_results` total **13→14** (NR-14, VERIFIED kot dokumentacija); ostale 17 kategorij **identno** |
| `source-coverage-1825.json` | val 83→**84**; naslov/derived_from → KG v1.9; **val-83 SRC-PS opomba + transcription.PS (2.871/143/2) VZORČNO PRENESENA v `build-coverage-report.py`** (prej sta obstajali DVE izhodni resnici — tveganje regresije ob re-runu); `next_reads` brez izvedenega »KG v1.9 rebuild« vnosa |

## 3. Poišči-in-popravi: latentni I3 kršitvi (cover age builder od val 81 ni bil ponovno zagnan)

1. **NR-14 brez `status`**: builder uporablja `n.get("status") or n.get("result")` kot ključ
   native mape → dolgi `result` NR-14 (s procenti) je postan ključ kategorije → **I3 (brez
   procentov v izhodu) padel**. Rešitev: NR-14 dobi `"status": "PARTIAL"` (pošteno: delo
   delno doseženo); `result` ostane NEOKRNJEN kot vrednost (varovalka v testih).
2. **SRC-PS opomba v quality_gate**: I3 preverja tudi vrednosti; val-81 vzorec je, da kategorialne
   note nosijo merjene podatke brez `%`-znaka, natančne vrednosti pa `transcription`/`source-coverage`
   sekcija (ni I3-preverjena). Opomba preformulirana z izrecno razliko: *»vrednosti so merjeno
   soglasje po poljih, ne umetni procent popolnosti«* — duh invarianta (issue #43 §10) dokumentiran,
   ne obgrajen.

## 4. Testi (varovalke)

- **NOVO `tests/val84-kg-v19-srcps.test.ts`** (10 testov / 63 expect): KG v1.9 + KG-F10;
  SRC-PS vozlišče nosi vse dejstva (143/143, 2.871 vrstic, val 82, val 83, PROVISIONAL, NR-14)
  in stara oznaka »PARTIAL 55/143« ne sme več živeti; števci/ID-ji stabilni; h.40 konflikt viden;
  §11 atomi; **kaskada**: story/timeline/coverage kg_sha256 == sha256 izhodnega KG (arhiv == runtime);
  NR-14 status PARTIAL z neokrnjenim resultom; source-coverage val 84 z val-83 dejstvi.
- Osveženi pin-i (KG v1.8/val 77 → v1.9/val 84, nov sha, negativi 13→14, artefakt val-i):
  atlas-1825-knowledge-graph, atlas-evidence-api, atlas-georef, atlas-1825-a01-buildings,
  atlas-story-graph, atlas-1825-coverage, pv-land-use, pz-konskripcija, ps-n83-analysis.

## 5. QA

- **547 pass / 11 skip / 0 fail** (558 testov, 37 datotek) · tsc čist · lint čist ·
  verify-i18n **1074 × 5** zeleno (UI nič spremenjeno — čista podatkovna plast)
- API vrata: evidence/map/story/timeline/coverage branijo REGENERIRANE runtime kopije —
  strukture pogodb nespremenjene (shema ista); dimni testi + Vercel preview v CI

## 6. Naslednje

1. **PS p56–143 pasovni/zoom re-read s kolonskimi sidri** (vzorec val 80/81) — imena, kultur,
   jaethe/klafter, Fürtrag veriga (NR-14/F-PV-04) → takrat šele SRC-PS per-parcelno 2×
2. PZ p48–65 2. prehod (protokoli + Zusammenstellung A/B — p65 REVIEW)
3. PT p7 @300dpi (KG-F01/F04); PR Grenz-Beschreibung (F-PZ-05)
4. izven peskovnika: zunanji Rektifikacijski/Komunikacijski protokol (F-PZ-04 Δ 3 J), šolski
   list / SA Podzemelj / SI AS 749 / Zucchelli
