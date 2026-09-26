# 84 — Val 71: ZGODBA UI + EXPLORE 1825 (issue #42 §16/§19)

**Datum:** 2026-09-26 · **Branch:** `feat/val71-explore-ui` · **Baza:** main @ 59feb36 (val 70)

---

## 1. Naročilo in cilj

Po zaključku ATLAS 1825 podatkovnega sklopa (PASS 1–8, val 70) ostaja po Definition of
Done issue #42 še **UI val**: »Zgodba te hiše« klik-flux (§16) + način **EXPLORE 1825**
(§19 MAP STORY MODE). Naročilo uporabnika: »odlicno pushaj na githubb sinhroniziraj kode
readme in vercel render in nadaljuj« — push val 70 (+ sinhronizacija + deploy verifikacija)
in nadaljevanje z UI valom.

## 2. Arhitektura

Trije novi/razširjeni kos, ločeni po odgovornostih:

| Kos | Vloga |
|---|---|
| `src/lib/atlas-explore.ts` (NOVO) | Čista logika §19: tier preslikava, filtri vidnosti, reference entitet. Brez React/fetch — testirljivo brez DOM. |
| `src/components/museum/atlas-story.tsx` (NOVO) | UI dialog zgodbe: `useAtlasStory` hook + `AtlasStoryDialog` (entiteta/vas) + `StoryButton` (enoten klik-flux). |
| `src/components/museum/cadastre-map-view.tsx` (razširjen) | Tretji zavihek »EXPLORE 1825«, filtri v stranskem panelu, StoryButton v vseh popupih + vrsticah registra, dialog. |

### 2.1 Zakaj zrcalna tier preslikava (ne import story engine-a)?

`atlas-story-engine.ts` uvaža `knowledge-graph-1825.json` (2,4 MB) **na nivoju modula** —
client import bi vlekel celoten KG v brskalni bundle. Rešitev: `exploreTierOfStatus` v
`atlas-explore.ts` zrcali natančno tabelo `TIER_EXACT` + varovalne vzorce engine-a; **pariteta
je vzpostavljena s testom**, ki primerja obe preslikavi čez celoten alfabet statusov iz KG
(nodes + edges + claims) in ne bo molčal ob razhodu.

### 2.2 Semantika filtrov (§19)

- **Vse** — privzeti pogled (96 entitet na listu: 65 statinih BP + 24 objektov KG + 16 hiš prek BP; preseki).
- **Samo dokazano** — tier = DOKAZANO (VERIFIED/CONFIRMED/STABLE/FOUND/TRANSCRIBED; statini sloj: `VERIFIED-2x`).
- **Konflikti** — tier = KONFLIKTNO (CONFLICT v statusu; statini sloj: `REVIEW-CONFLICT`).
- **Neznano** — tier = NEZNANO (UNKNOWN/NOT_FOUND/UNRESOLVED/UNCERTAIN; statini sloj: brez lastnika).
- Besedilni filter: BP / hišna številka / lastnik / labela objekta / node_id.

Domenska omejitve, dokumentirane v UI:
- **Raba zemljišč** — parcelni sloj (2467 parcel) še ni na zemljevidu; kontrola je
  onemogočena s poštno opombo (raba je dokumentirana v zgodbi hiše, F-SE-01).
- **Toponimi statinih sloja** (Flurbezirki: na Feld, Stupar Stih …) NISO v §12 registru —
  točneje, to so dokumentirani **negativni rezultati NR-12** (»imenski Flurbezirki NOT
  FOUND p1–55«). Klik pokaže **pošteno 404** (`toponym:<ime>` ne obstaja v grafu) —
  negativni register je tako viden tudi v UI, ne zamolčan.

## 3. Klik-flux (§16) — poti do zgodbe

1. **Popup statinega BP markerja** → »Zgodba te hiše« → `BP:0xx` → story engine razreši
   verigo BP → hiša (domenska resnica: BP številka ≠ hišna številka; BP:040 vodi k H-029 —
   test to varuje z eksplicitno `not.toContain("HOUSE:H-040")`).
2. **Popup kartografskega objekta KG** → »Zgodba (iz dokazov)« → `MO:MO-A01-002`.
3. **Popup hiše prek BP (KG sloj)** → »Zgodba te hiše« → `HOUSE:H-xxx`.
4. **Popup toponima** → najprej `GET /api/atlas/evidence?q=<ime>&type=TOPONYM`, pri zadetku
   `TP-0xx`, sicer pošten 404 (glej 2.2).
5. **Vrstica registra v stranskem panelu** (EXPLORE način) → story + flyTo.
6. **»Povej mi zgodbo tega kraja.«** → `?scope=village` (§18, 10 sekcij).

## 4. Dialog zgodbe

- Glava: eyebrow, label entitete, node_id + evidence_status.
- NOT_PUBLISHED → izrecen blok (pogodba §22: zgodba brez claims + sources ni objavljena).
- Sicer: headline, razporeditev tirev (DOKAZANO/VERJETNO/KONFLIKTNO/NEZNANO z števci),
  sekcije (naslov + elementi: tier ikona, besedilo, status, source_ids čipi),
  pogodba §22 (story_id, content_hash, prompt_version, kg_sha256, števec claims/sources),
  povezava »Dokazna veriga ↗«.
- Mobilno: bottom-sheet (rounded top), max 92 vh, brez preliva pri 390 px.
- Dostopnost: `role="dialog"`, `aria-modal`, aria-labeli, zapiralni gumb z labelo,
  `aria-pressed` na načinskih gumbih, `fieldset disabled` za onemogočeno rabo.

## 5. Popravljen regres val 67 (najden ob delu)

`verify-i18n` na main @ 59feb36 je bil **RDEČ**: val 67 je KG ključe katastra
(`kgLayers … kgError`, 9 ključev) dodal samo v SL in EN — HR/DE/IT so manjkali.
V val 71 dopolnjeni (prevodi) + vstavljen nov `atlasStory` blok (33 ključev) v vseh
5 jezikih → **verify-i18n zeleno: 1014 ključev × 5, struktura identična SL**.

Pouček: `bun run scripts/verify-i18n.ts` ni del `bun run lint`/CI — ob vgradnji novih
UI ključev obvezen ročni zagon (dodano v poročilni običaj).

## 6. QA

- **Testi**: `tests/atlas-explore.test.ts` — 18 testov / 421 expect: tier preslikava
  statinih sloja, **pariteta z engine-om čez vse statuse KG**, varovalni vzorci (neznani
  status nikoli tiho DOKAZANO), filtri vseh 4 načinov, besedilni filter, `bpNodeRef`
  podajanje, BP:040 → H-029 domenska varovalka, i18n struktura ×5 + prisotnost `{n}`,
  `{visible}`, `{total}` placeholderjev. → **suite 400/400** (382 + 18).
- **tsc** čist · **lint** čist · **verify-i18n** 1014 × 5 (po popravku regres).
- **api-smoke**: +4 preverba UI klicev → **88/88** na živem :3000:
  story MO:MO-A01-002 (EVIDENCED + pogodba) · village (10 sekcij + tier_breakdown) ·
  evidence search TOPONYM (Zagorje → TP-*) · nerešljiva referenta → 404 node_not_found.
- **Agent-browser (end-to-end)**: EXPLORE zavihek ✓ · vaski filter »Samo dokazano« = 4/96,
  »Vse« = 96/96 ✓ · zgodba vasi (dialog + tire + sekcije) ✓ · klik vrstice → BP:030
  (3 KONFLIKTNO vidni + pogodba) ✓ · popup BP 94 → zgodba (CORRESPONDS_TO_BP + VERIFIED
  vez na hišo 40) ✓ · toponim Stupar Stih → poštena 404 (NR-12) ✓ · mobilno 390 px:
  zavihki, bottom-sheet dialog, brez preliva ✓ · 0 napak v konzoli ✓ · sticky footer ✓.

## 7. Nič ni spremenjeno v podatkih

+0 virov / +0 trditev / +0 MAP_OBJECT / KG v1.4 nespremenjen (3.309 / 3.569 / 622).
UI je izključno bralni sloj nad obstoječimi API-ji (story, evidence, map, coverage).

## 8. Naslednje

1. **Georef PASS (§10)** — izboljšava sidra A01 (dodatne kontrolne točke, rotacija).
2. **Parcelni sloj (raba zemljišč)** — §19 filter rabe; zahteva pošten prikaz 2467
   parcel brez geometrije (samo seznam/BP vezave, ne risanja meja).
3. Ob kvoti: PS p56–143, PT p7 @300dpi (KG-F01/F04), PR re-read (mejne točke), PV prepis (F-SE-01).
4. Izven peskovnika: šolski list, SA Podzemelj, SI AS 749, Zucchelli, KG-F05 arhivsko vprašanje.
