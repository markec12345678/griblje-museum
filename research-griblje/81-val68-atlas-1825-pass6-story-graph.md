# 81. val — ATLAS 1825 PASS 6: Story Graph v1 (issue #42 §21) + KG v1.4

**Datum:** 2026-09-26 (val 68) · **Issue:** #42 §21 (PASS 6) + #43 §3/§7/§8/§11 · **Tip:** podatkovno-API val (+0 virov/+0 trditev zgodbe/+0 UI)

---

## 1. Kaj je bil cilj

Issue #42 §21 (PASS 6): *Iz objektov naredi graf povezav OSEBA ↔ HIŠA ↔ PARCELA ↔ BP ↔
TOPONIM ↔ DOGODEK ↔ VIR. Vsaka povezava mora imeti relation type, source, confidence,
date/period. To bo osnova za avtomatsko zgodbonizacijo.* Obvezni output #24/13:
`story-graph-1825`. Issue #43 §7/§8 (Story Provenance + Story Atoms) in §11 (invarianti)
sta kontrakta, ki jih graf mora spoštovati.

## 2. Ključna ugotovitev: KG-F07 (claim-first vrzel, ujeta z invarianto)

PASS 6 invariant *»story atom brez claim/source povezav = napaka«* (§43 §11) je ob prvem
zagonu builderja **odbil build** — in s tem ujel pravo kršitev claim-first arhitekture
(§43 §3) v KG v1.3:

- relacija `IS_GEMEINDE_OF` (TP-001 → TP-003, »tiskane naslovnice vseh registrov
  poimenujejo isto Gemeindo«) je bila **brez claima** — edina od 10 vrst relacij;
- story atom **SA-004** (»Gemeinde Grüble / k.o. N83«) je imel 7 virov, a **prazno
  claim_ids** — zgodba brez dokazne verige v claim plast.

**Rešitev (KG v1.4, val 68):** `build-knowledge-graph.py` ustvari claim **C-00622**
(subject TP-001, predicate IS_GEMEINDE_OF, object TP-003, source SRC-A01, status
VERIFIED_FORM, period 1824/1827) in veže relacijo + SA-004 nanj. Claim je dodan **kot
zadnji v vrsti**, zato se noben prejšnji ID ne premakne (C-001–C-00621 stabilni —
preverjeno: C-00621 = EVT-001 AFFECTS_HOUSE HOUSE:H-046). Nič prepisano, §12 spoštovan.

## 3. Story Graph v1 — projekcija, ne novo sklepanje

`research-griblje/atlas-1825/build-story-graph.py` (determinističen, idempotenten):

- **1:1 projekcija KG v1.4**: 3.309 entitet (PARCEL 2.467 · PERSON 488 · HOUSE 167 ·
  BP 100 · TOPONYM 37 · MAP_OBJECT 34 · SOURCE 13 · EVENT 3) in 3.569 relacij
  (HAS_PARCEL 2.865 · OWNER_OF 254 · OWNER_VARIANT_OF 224 · BP_BOUND_TO_HOUSE 119 ·
  DOCUMENTED_IN 38 · DEPICTED_ON 34 · CORRESPONDS_TO_BP 21 · RESIDENCE_DOCUMENTED_AT 10 ·
  AFFECTS_HOUSE 3 · IS_GEMEINDE_OF 1);
- **§21 obvezna polja** na vsaki relaciji: relation_type + narrative_label (SLO bralni
  znak) + source_ids + confidence + date_period (prazno → izrecno `UNKNOWN`, nikoli tiho);
- **degree** vsake entitete (osnova za centralnost v Story Engine);
- **story atomi (4)** skopirani iz KG (ena izhodna resnica) — vsak z story_id, entities,
  claim_ids, source_ids, confidence, evidence_status, generated_at, generator (§43 §8);
- **story_engine_contract**: pričakovana shema izhoda engine-a (§42 §16/§22, §43 §7) —
  shema, NE podatki: story_id, input_entity_ids, used_claim_ids, used_source_ids,
  generation_timestamp, prompt_version, story_status;
- **provenance**: `kg_sha256` (d2416428a5d7…) — reproducibilnost §22: če se KG spremeni,
  je story-graf vidno zastarel in se regenerira;
- **invarianti (build-time, 0 kršitev)**: §21 polja na vseh relacijah · konca relacij
  obstajata · atomi imajo claims+sources · atom entitete obstajajo · claim_ids obstajajo.
  Kršitev = build NE zapiše izhoda (fail-fast, kot v KG builderju).

## 4. API: `GET /api/atlas/story-graph`

| Klic | Vrni |
|---|---|
| (privzeto) | pregled: stats + story atomi + pogodba engine + uporaba |
| `?node=HOUSE:H-040&depth=1\|2` | sosednost: fokus + entitete + relacije + atomi + `truncated` + evidence_url (vhod Story Engine, §16 pot map→entity→story) |
| `?type=PERSON&limit=` | entitete po vrsti (488 oseb …) |
| `?relation=OWNER_OF&limit=` | relacije po tipu |
| `?q=Sautter&type=PERSON` | iskanje po label/name_original/node_id |
| `?atoms=1` | atomi z **razrešenimi** entitetami in claims (`resolved_entities`, `resolved_claims`, `provenance_complete`) |
| poštene napake | 400 `unknown_entity_type` / `unknown_relation_type` / `invalid_depth` (1\|2 — zaščita pred parcelno eksplozijo), 404 `node_not_found` |

Sosednost je capped na 1.000 entitet z izrecnim `truncated` flagom (BP v depth 2 vleče
svoje parcele — nikoli tiho odrezano). Resolver sprejme okrajšave: `H-040`, `HOUSE 40`,
`BP 90`, `90`, `TP-001`, `PER-0001`, `MO:MO-A01-002`.

## 5. QA

- `tests/atlas-story-graph.test.ts` — **20 testov / 25.721 expect**: 1:1 projekcija KG
  (vozlišča in veze številčno dokazana) · §21 polja na vseh 3.569 relacijah · referenčna
  integriteta koncov · claim 1:1 obrnjeno pokritje · degree konsistentnost · SA-004/C-00622
  (KG-F07) · resolved atoms `provenance_complete` · sosednost H-040 (PERSON+OWNER_OF+SA-002)
  · depth 2 > depth 1 · cap 1.000 · `null` za neobstoječe · resolver okrajšave · pogodba §22.
- Posodobljeni KG/evidence/a01 testi na v1.4 (title, findings +KG-F07, 621→622, val 68).
- **Suite 314/314** (+20) · **api-smoke 70/70** (+10) na živem :3000 · tsc čist · lint čist.
- Živa preverba: overview stats 3.309/3.569/4 · sosednost hiše 40 · IS_GEMEINDE_OF z
  C-00622 · atomi provenance_complete · 400/404 — vse zeleno.

## 6. Meje (nič pretiravanja)

- Story graf NE uvja novih trditev, NE skalpa povezav po imenski podobnosti in NE
  locira ničesar — to je bralni/pripovedni pogled na obstoječo KG dokazno plast.
- Story Engine (PASS 7, §16) **še ni** implementiran — v1 dostavi grafovsko osnovo +
  pogodbo (§22/§43 §7). Zgodbe ostajajo 4 ročno dokumentirani atomi s polno provenanco.
- KG-F01 (bp 90 PT vs PUA napetost) in KG-F04 (PUA house_refs = holdingi) ostajata OPEN
  do re-readov (PS p56–143, PT p7 @300dpi) — story graf ju le viden-ohranja.

## 7. Datoteke

- `research-griblje/atlas-1825/build-story-graph.py` (NOVO, builder)
- `research-griblje/atlas-1825/story-graph-1825.json` + `src/data/story-graph-1825.json` (NOVO, runtime kopija)
- `research-griblje/atlas-1825/build-knowledge-graph.py` (KG v1.4: +C-00622, +KG-F07, val 68)
- `src/data/knowledge-graph-1825.json` (regeneriran)
- `src/lib/atlas-story-graph.ts` + `src/app/api/atlas/story-graph/route.ts` (NOVO)
- `tests/atlas-story-graph.test.ts` (NOVO) + posodobljeni 3 testni datoteke + `tests/api-smoke.ts` (+10)
