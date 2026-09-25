# Val 63 — ISSUE #43 §1/§3/§8/§9: KNOWLEDGE GRAPH v1

**Datum**: 2026-09-25 · **Tip**: lokalni deterministični val (VLM 429 5.× potrjen ~15:55 UTC)
**Issue**: #43 §1 (KG) + §3 (claim-first) + §7 (story provenance arhitektura) + §8 (story atoms) + §9 (research gaps) + §10 (completeness) + §11 (invarianti) · **Metoda**: brez VLM

---

## 1. Kaj je zgrajeno

`atlas-1825/knowledge-graph-1825.json` (deterministično: `atlas-1825/build-knowledge-graph.py`) —
povezovalni sloj, ki iz registrov val 59/60/62 gradi evidence-first graf:

### Nodes: 3.275
| tip | št. | izvor |
|---|---|---|
| PERSON | 488 | person-owner-register (161 possible_duplicate, **0 mergeov**) |
| HOUSE | 167 | house-register |
| PARCEL | 2.467 | parcel-register (PUA 2.035 + PS 432) |
| BP | 100 | bp-house-reconciliation |
| TOPONYM | 37 | toponym-register (val 62) |
| SOURCE | 13 | katalog dokumentov (SI AS 176: PUA/PS/PT/PR/PG/PV/PZ/A01–A05/fond) |
| EVENT | 3 | pfand 1801 · definicija meje 1825/26 (PR) · zaključek PUA 10. 1. 1825 |
| MAP_OBJECT | **0** | tip definiran, instanc ne — §7 A01 inventory = research gap RG-001 |

### Edges: 3.514 — vsaka z relation_id, from/to, period, source_ids, evidence_status, confidence
| relacija | št. | opomba |
|---|---|---|
| HAS_PARCEL | 2.865 | HOUSE → PARCEL; so-referenced parcele note-ane |
| OWNER_OF | 254 | PERSON → HOUSE; **ločeni periodi: PUA = pripravljalno stanje, PS = 1825 končni (F9)** |
| OWNER_VARIANT_OF | 224 | PT variante (nestabilna imena F1/F10) — status REVIEW, confidence low |
| BP_BOUND_TO_HOUSE | 119 | BP → HOUSE (PT + PUA kandidati) |
| DOCUMENTED_IN | 38 | TOPONYM/EVENT → SOURCE |
| RESIDENCE_DOCUMENTED_AT | 10 | PERSON → TOPONYM (samo field-level: Zogwitsche, Schönboden, Waidhofen, Gräving, Höchsthal, Zagorje, Gradiše, Dragole) |
| AFFECTS_HOUSE | 3 | EVT-001 pfand 1801 → h.43/45/46 |
| IS_GEMEINDE_OF | 1 | TP-001 → TP-003 (k.o. N83) |

### Claims: 600 (§3 claim-first)
`{claim_id, subject, predicate, object, source_ref, status, period, confidence}` —
statusi: 249 REVIEW / 128 CONFLICT / 111 SINGLE_SOURCE / 69 VERIFIED / 40 UNCERTAIN / 3 VERIFIED_FORM.
**Nič ne skrito**: h.40 ima OBA claim-a (PUA Sautter + PS Muster) → CONFLICT viden.

### Story atoms: 4 (§8 + §7 Story Provenance)
SA-001 pfand 1801 · SA-002 h.40 dva lastniška stanja (CONFLICT) · SA-003 BP vezavi (94↔h.40 najmočnejša) · SA-004 Gemeinde Grüble. Vsak: story_id, entities, claim_ids, source_ids, generated_at, generator.

### Research gaps: 8 (§9)
RG-001 MAP_OBJECT inventory · RG-002..006 BP 15/16/18/19/20 NOT_FOUND · RG-007 join miss (F16 p11) · RG-008 **KG-F01**

## 2. KG-F01 — nova najdba (§12: ne tiho popravlaj)

**bp 90 register-internal napetost**: `bp-house-reconciliation` nosi `pt_houses: ["44"]`
(starejša PT register plast, val 41–53 branja), ampak njegov note + PUA ref dokumentirata
h.43 (val 57 digit-by-digit, CONFIRMED-2x, PUA no.7 opomba »B.P. 90.«).
**Obravnava**: obe povezavi živita — BP:090→H-043 (FOUND, PUA) + BP:090→H-044 (REVIEW, PT) —
research gap RG-008 zahteva PT p7 re-read @300dpi (2-prehodni protokol val 61).
Pri tem je bilo odkrito in popravljeno tudi **tiho izpuščanje vseh PUA-ref BP kandidatov**
v prvi različici builderja (tuple bug): BP vezave 95 → 119 povezav.

## 3. Invarianti (§11) — enforce-ane v builderju + testih

- claim brez source = build napaka (assert) — 600/600 ima source_ref
- edge brez evidence_status/source = build napaka — 3.514/3.514 ima
- osebe: merge_decision NOT_MERGED ohranjen — 0 mergeov, 161 possible_duplicate z razlogi
- referenčna integriteta: vse edge/claim referenče na obstoječe node id-je (test)
- NOT_FOUND BP → research gaps (5), nikoli »absent«
- UNKNOWN/UNCERTAIN nič nadgrajeno brez novega vira

## 4. Completeness view (§10) — brez umetnega procenta

7 kategorij z dejanskim stanjem: houses 167 (0 AGREE/13 PARTIAL/49 CONFLICT/32 SINGLE_SOURCE/73 UNKNOWN_SEMANTICS) · BP 100 (FOUND 2/UNCERTAIN 39/CONFLICT 54/NOT_FOUND 5) · parcels 2.467 (geometry NOT AVAILABLE) · persons 488 (merged 0) · toponyms 37 (modern_mapping UNKNOWN 37) · events 3 · map_objects 0 (PENDING PASS 4).

## 5. QA

`tests/atlas-1825-knowledge-graph.test.ts` — **17 testov / ~35.800 expect** (struktura, referenčna
integriteta, vse invariante, F9 periodi, h.40 dual claim, pfand, BP + KG-F01, story atoms,
toponimi, residence, MAP_OBJECT gap, coverage). **Suite: 238/238 · tsc čist · lint čist.**

## 6. Skladnost z Definition of Done (#43)

1. enoten KG model ✓ · 2. tipi medsebojno povezljivi (node id prostor skupen) ✓ · 3. vsaka povezava z source ✓ · 4. Evidence Explorer: grafični sloj pripravljen (»Zakaj to vemo?« = claims + source_refs za katerikoli node) — UI kasneje · 5. UNKNOWN/NOT FOUND/CONFLICT ločeni ✓ · 6. konflikti niso skriti (dual claims) ✓ · 7. story atoms z claim/source povezavami ✓ · 8. Story Provenance arhitektura ✓ · 9. research gaps strukturirani ✓ · 10. testi za evidence-first pravila ✓ · 11. podatki #42 niso izgubljeni (builder bere izključno registre, nič ne spremeni) ✓

## 7. Naslednje

1. **Val 64**: Evidence Explorer podatkovni API (GET /api/atlas/evidence?node=H-040 → node + claims + edges + sources + conflicts) — priprava na UI »Zakaj to vemo?« (#43 §2/§6)
2. Ob VLM kvoti: PS p56–p143 → deterministična obnova VSEH registrov + KG; PT p7 re-read (KG-F01)
3. PASS 4: A01 building coverage (§7) → MAP_OBJECT nodes
4. Izven peskovnika: šolski list [4118864], SA Podzemelj, SI AS 749, Zucchelli
