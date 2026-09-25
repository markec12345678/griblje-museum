# 72 — 59. val: ATLAS 1825 PASS 2 — House + BP reconciliation (issue #42 §2/§3/§5/§14)

**Datum:** 2026-09-25 · **Način:** čisto lokalni val (VLM kvota 429 od 24. 9. ~11:14 UTC, potrjena še 25. 9. 13:19 UTC)
**Vhodi:** PUA register (98 vpisov), PT register (100 vrstic) + reconciliation.json, PS register (1.073 vrstic / 55/143 strani), BP↔house matrica (val 57), A01 cadastre (56 stavb), analysis-v1.json (val 58)
**Izhodi (`research-griblje/atlas-1825/`):**
1. `house-register-1825.json` — §2
2. `bp-house-reconciliation-1825.json` — §3
3. `conflict-register-1825.json` — §14
4. `person-owner-register-1825.json` — §5
+ `build-pass2.py` (deterministično, ponovljivo ob PS 143/143)
**+0 virov / +0 trditev / +0 UI** — podatkovna sloja, ne zgodb (vrstni red VIRI→PODATKI→CLAIMS→ENTITETE)

---

## 1. Kaj je PASS 2 (po uporabnikovi fazizaciji #42)

> PASS 1 (val 57) = audit stanja · **PASS 2 (ta val) = House + BP reconciliation** · PASS 3 = parcel + owner/person register · PASS 4 = A01 + listi + georeferenca · PASS 5 = map data model · PASS 6 = entity/relation graph · PASS 7 = story engine · PASS 8 = coverage report

## 2. HOUSE REGISTER 1825 (§2) — 167 hišnih zapisov

Združitev vseh 4 virov po hišni številki; **house_no ≠ BP ≠ parcela ostajajo ločeni modeli** (bp_refs samo kot referenca z statusom).

### Pokritost evidence_status (strog izvod iz virov)

| status | št. | pomen |
|---|---|---|
| CONFLICT | 49 | PUA in PS imata različna lastnika (F9 različni stanji) — obe trditvi ohranjeni |
| PARTIAL | 13 | delno podobna imena (0,5–0,7) ali ≥2 vira brez PUA+PS parice |
| SINGLE_SOURCE | 32 | samo en vir (npr. h.70 Zollamt = samo PUA; PS blok čaka p56+) |
| UNKNOWN_SEMANTICS | 73 | sestavljeni »1 / N« sklici (F12 TO-DECODE) |
| **AGREE** | **0** | dosledno z val 58: PUA↔PS ≥0,7 soglasij ni |

**Primeri:** h.40 = CONFLICT (PUA »Pfarrer Rupert Sautter« vs PS »Peter Muster«, sim 0,43, CH konflikt) · h.45 = PARTIAL (PS »Strauß Georg« + PT »Krauß Georg« variant; PUA brez vpisa) · h.70 = SINGLE_SOURCE z opombo · hiše **73–78 ne obstajajo v nobenem viru** (in so tudi zato ne zapisane — ni ugibanja).

## 3. BP↔HOUSE RECONCILIATION 1825 (§3) — 100 BP

Matrica v jeziku #42 (FOUND/UNCERTAIN/CONFLICT/NOT_FOUND), val 57 sodbe ohranjene (nič prepisano):

| atlas_status | št. | iz val 57 |
|---|---|---|
| FOUND | 2 | CONFIRMED (bp 90, 94) |
| UNCERTAIN | 39 | PROBABLE (33) + UNRESOLVED (6) |
| CONFLICT | 54 | CONFLICT |
| NOT_FOUND | 5 | NOT_FOUND (PT vrzel 15–20 …) |

Vsak CONFLICT BP ima CB konflikt ID v centralnem registru.

## 4. CONFLICT REGISTER 1825 (§14) — 113 konfliktov

| tip | št. | izvor |
|---|---|---|
| `bp_house_binding` (CB-xxx) | 54 | val 57 matrica, vsi CONFLICT BP |
| `owner_state_pua_vs_ps` (CH-xxx-xx) | 51 | val 58 F9 — 49 MISMATCH + 2 FUZZY per hiša |
| `named_finding` (CF-F1…F8) | 8 | reconciliation.json headline_findings z statusi |

**Statusi CF najdb:** F8 = RESOLVED (bp 94→h.40 VERIFIED-2x) · F3, F7 = PARTIALLY_RESOLVED (val 56/57 prelomi; hišni deli ostajajo) · F4, F5, F6 = OPEN (čakajo polne ločljivosti) · F1, F2 = DOCUMENTED (metodologija).
**Vsak konflikt ima `what_would_resolve`** (pot do rešitve) — nič ni zaprto brez poti. Nič konflikta ni skrito z mergeom.

## 5. PERSON/OWNER REGISTER 1825 (§5) — 488 oseb, 0 združitev

- Tipi: `owner(pua)` 98 · `owner(ps)` 89 · `owner_variant(pt)` 301 (nestabilni prebrki, uporabni le s PS korooboracijo — val 58 F10)
- **161 possible_duplicate** — SAMO flag z razlogom (identno normalizirano ime v N zapisih/hish/virih), `merge_decision: NOT_MERGED`
- Opomba §5 ohranjena: »oseba omenjena v zbirki ≠ dokazana kot lastnik 1825«
- Normalizacija (NFKD, brez ne-črk, lowercase) je pomožna — nikoli avtoriteta

## 6. Skladnost z uporabnikovim »KLJUČNO RAZUMEVANJE« (09:01, #42)

| pravilo | izvedba |
|---|---|
| ločeni sloji raziskava/podatki/pripoved | registeri = čisti podatkovni sloj; UI/PR ničesar ne spreminja |
| nič ugibanja | vsak status izveden iz virov z izrecno logiko (v `method.evidence_status_logic`) |
| UNKNOWN/CONFLICT ohranjeni | 73 UNKNOWN_SEMANTICS + 113 konfliktov živih v registru |
| hiša ≠ BP ≠ parcela | ločeni modeli, bp_refs s statusom |
| obe trditvi, ne prepiši | PUA in PS lastnika hranjena vzporedno (CONFLICT hiše) |
| vsak podatek s virom | `provenance` blok + per-vpis source/page |

## 7. Mini coverage report (§23, izsek za PASS 2)

| kategorija | TOTAL | FOUND/AGREE | PARTIAL | CONFLICT | UNKNOWN/NOT_FOUND |
|---|---|---|---|---|---|
| hiše (gruble, registrirane) | 94 | 0 AGREE | 13 | 49 | 32 SINGLE_SOURCE |
| hiše (external refs) | 73 | — | — | — | 73 UNKNOWN_SEMANTICS |
| BP 1–100 | 100 | 2 | 39 | 54 | 5 |
| konflikti | 113 | 1 RESOLVED | 2 PARTIALLY_RESOLVED | 108 OPEN/DOCUMENTED | — |
| osebe | 488 | — | 161 flag | — | 0 merged |

## 8. Naslednje (vrstni red #42)

- **PASS 3** (parcel + owner person register v polni obliki) — parcelni del čaka PS 143/143 (kvota); person del se nadgradi iz tega vala
- **PS p56–p143** — resume skripta pripravljena; ob 143/143 se vsi štirje registri deterministično obnovijo (`build-pass2.py`) in pokritost naraste (hiše 70–78, Zollamt blok, sestavljeni sklici)
- Re-readi @300dpi (P2-E15) še vedno najmočnejša poluga za CB konflikte
