# Val 64 — ISSUE #43 §2/§6: EVIDENCE EXPLORER API (+ KG v1.1, KG-F02)

**Datum**: 2026-09-25 · **Tip**: infrastrukturni val (VLM 429 6.× potrjen ~16:25 UTC)
**Issue**: #43 §2 (Evidence Explorer) + §6 (MAP→ENTITY→CLAIMS→SOURCES→ORIGINAL EVIDENCE) + §10 (completeness) · **Metoda**: brez VLM

---

## 1. Kaj je zgrajeno

### `GET /api/atlas/evidence` — trije načini

1. **Pregled grafa** (brez parametrov, §10): `stats{nodes,edges,claims}` + `coverage` (7 kategorij, brez umetnega procenta) + `research_gaps` (8) + `story_atoms` (4) + `findings` (KG-F01/F02)
2. **Dokazna veriga enega objekta** (`?node=…`, §2 »Zakaj to vemo?«): node → edges (in/out) → claims (subject/object) → neighbors → sources → **original_evidence** (vac_details_url do dokumenta) + research_gaps. Vzorcevni parametri: `?node=H-040` / `?house=40` / `?bp=90` / `TP-001` / `SRC-PS` / `EVT-001`
3. **Iskanje** (`?q=…&type=…`): brskanje po node-ih (osebe/hiše/parcele/toponimi)

**Princip**: API vrne SAMO strukturo iz grafa — nič ne ugiba. Neobstoječi node = `404 node_not_found`. UNKNOWN / NOT FOUND / CONFLICT ostanejo ločeni (§5).

### `src/lib/atlas-evidence.ts` — čista resolver plast
O(1) indeksi (node/edges/claims/gaps), `evidenceFor()`, `overview()`, `searchNodes()`, `resolveNodeParam()`. Graf: `src/data/knowledge-graph-1825.json` — **piše ga build-knowledge-graph.py** (druga kopija atlas-1825 izhoda; ročno urejanje prepovedano — ena izhodna resnica, nič drifta).

## 2. KG-F02 — popravek SRC kataloga (§12: popravi samo dokazljivo, z navedbo vira)

Evidence Explorer je vsilil revizijo kataloga virov: **KG v1 je imel NAPAČNE VAC uodid-e**
(227668/227670/227671 sem ugotovil iz manifest datotek — v resnici A02/A03/A04!).
Popravljeno po eksplicitni tabeli v `56-val42-kataster-n83-complete-research.md`:

| vir | uodid (pravilno) | v1 (napaka) |
|---|---|---|
| PUA | **373417** | ~~227670~~ (A03) |
| PS | **373415** | ~~227671~~ (A04) |
| PT | **373416** | ~~227668~~ (A02) |
| PR/PG/PV/PZ | 373414 / 373413 / 373418 / 373419 | (brez) |
| A01–A05 | 227666 / 227668 / 227670 / 227671 / 227673 | (samo k.o. 227663) |

Vsak SOURCE node zdaj nosi `uodid` + `docid` + `vac_details_url` → §6 pot do originalnega dokumenta je za vsak klik zaključena. TOPONYM nodes so poleg tega dobili `label` (primarna forma) — brskanje po imenih zdaj deluje.

## 3. Live verifikacija (enako CI: next dev + api-smoke)

`SMOKE_BASE_URL=http://localhost:3001 bun tests/api-smoke.ts` → **51/51 preverbov** (47 obstoječih + 4 novi za atlas evidence):
- pregled: `stats.nodes.HOUSE === 167` + research_gaps array
- house 40: 2 OWNER_DOCUMENTED claim-a (SRC-PS + SRC-PUA), vsi original_evidence URL-ji na vac.sjas.gov.si
- neobstoječi node: `404 node_not_found`

Rok primere: `?node=house 40` → `{node: HOUSE:H-040, claims: [PUA Sautter, PS Muster], conflicts: 3, original_evidence: [details?id=373417, details?id=373415, details?id=373416]}`

## 4. QA

- `tests/atlas-evidence-api.test.ts` — **10 testov / 366 expect**: varni vzorci ID-jev (house 999 = null!), h.40 dual claims + KG-F02 URL, BP:090 KG-F01 obe povezavi + gap, BP:015 NOT_FOUND + gap, pfand veriga EVT-001→h.43/45/46, TP-029 residence + UNKNOWN ohranjen, SRC-PT uodid/docid, overview §10, search, §11 invarianti čez 6 node-ov
- KG test posodobljen na v1.1 + KG-F02 varovalke (PT uodid 373416, PUA 373417)
- **Suite: 248/248 · tsc čist · lint čist · api-smoke 51/51**

## 5. Skladnost z Definition of Done (#43)

Točka 4 (»Evidence Explorer lahko pokaže Zakaj to vemo?«) je v podatkovno-API sloju **IZPOLNJENA**: katerikoli node → claims → sources → vac_details_url. UI sloj (klik na zemljevidu) sledi pri map data modelu (PASS 5).

## 6. Naslednje

1. **Val 65**: PASS 4 — A01 building coverage (§7) → MAP_OBJECT nodes (iz obstoječih rasterjev + PT gattung + VLM transkripcij val 42, brez novih VLM klicev)
2. Ob VLM kvoti: PS p56–p143 → deterministična obnova registrov + KG (avtomatsko tudi src/data kopija) + PT p7 re-read (KG-F01/RG-008)
3. PASS 5: map data model + zemljevidni sloji nad KG
4. Izven peskovnika: šolski list [4118864], SA Podzemelj, SI AS 749, Zucchelli
