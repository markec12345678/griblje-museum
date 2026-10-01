# Val 116 — VLM glasovi ob kvoti + p142 zaključek 2. prehoda

**Datum:** 1. 10. 2026 · **Issue:** #42 §4/§14 (+ #72 vrsta) · **Metoda:** VLM glasovi (kvota PROSTA — prvič od vala 107) + integracija p142 po pravilih 1:1 val 86

---

## 1. Prelom: kvota prosta

Po valih 107–115 (trdo 429) je sonda (mini slika, `z-ai vision`) uspešno odgovorila — **kvota VLM je prosta**. Izvedena je čakalna vrsta "VLM glasovi ob kvoti" (napovedana v valih 109–115): zajeti VSI resumable glasovi, integrirati tisto, kar ima popolna pravila (p142); preostale integracije izrecno odložene z komitiranimi glasovi.

## 2. Zajeti glasovi (52 = 45 + 1 + 6)

| vir | instrument | glasov | ključne vsebine |
|---|---|---|---|
| **PZ p48–65** (val 109 resumable) | `read-v109.mts` (kosovsko, 3 teki) | **45/45** → `vlm-v109/` | 8 tabel §1–§8 (p50–p60), proza/begr po straneh, p63 3 pasovi + glava, p65 4 pasovi + desni zoom, protokoli p48/49 polovici |
| **p142-t-kultur2** | `regen-missing-crop-v99.mts` + `tile-read-v98.mts` | **1** → `vlm-v86/` (696/696 tile-ov) | 10 vrstic kultur+Kläfter (šumen Kurrent — obravnavan konservativno po v86 pravilih) |
| **PT p7 3. glasovi** | `read-pt7-v116.mts` (novo) | **6** → `vlm-v116/` | bp 96 Nro **"38"** ✓, bp 97 Nro **"39"** ✓, bp 98 Nro **"70"**; areals 1–5 (4× prečrtano rdeče), labels (crop nesemantčen — izrecno zabeleženo) |

**Ključna najdba (PT bp 98 / Zollamt):** VLM vidi v Nro celici zapisano **"70"** — v110 nativno branje je trdilo "PRAZNO (Nro stolpec neostevilčen za 98)". To je **razkol glasov** (nativno-prazno vs VLM-70), izrecno zabeležen; vezava Zollamt↔bp 98↔h.70 počiva na PUA no. 95 + A01 no. 7 (v110, trojno podprta) — **review_status ostaja REVIEW** (nič ne dvignjeno; glas je artefakt, ne dvig).

## 3. p142 zaključek 2. prehoda (`build-register-v116-p142.py`, pravila 1:1 val 86)

p142 je od vala 86 ostala `v82-native-pass1` (fail-fast nivoja strani: 1 manjkajoči tile = stran ni kvalificirana). Z 8/8 pasovi se kvalificira:

- **40 vrstic** → `reading_pass: v86-colonial-tiles` (**1795** skupaj; `v82-native-pass1` ostaja **3** = p143)
- **0 vrednostnih popravkov** — p1/p2 sistemski razkol (frakcije 'ganz/1/4/1/2/1/8' v jaethe) → **25 × `v86-review-col-split`** markerjev (REVIEW ostaja, nič tiho popravljeno); page kvalifikacija drži (only_j 0 %), a p1/p2 se ne ujemata → NIČ korekcij po pravilih
- **34 × `kultur_tile_v86` + 37 × `owner_tile_v86`** variant polj (NIKOLI prepis pas1)
- changes audit: `band-v86/register-v116-p142-changes.json` (val 116, changes 0, digit_mismatch 0)
- **pass3 NEIZMENJAN** (frakcije niso parcele — PS parcele 392, None 77); **KG vsebina identična** (samo `generated_at` → sha **ca0aeb58 → 2790d893**, standardni §22 prehod; story-graph/timeline/coverage regenerirani)

## 4. Poštenost (§4)

- **TRANSCRIBED = 0** novih vrednosti (p142 brez popravkov; glasovi so artefakti)
- PZ mikroprehod 8b (§ vrednosti iz REVIEW, p63 vrstice, 7 dilem) = **val 117** — glasovi komitirani, pravila admission ("soglasje ≥ 2 → TRANSCRIBED; kolizija → REVIEW; model I7 dvigne") ostajajo
- PT p7 re-adjudikacija areal/lastnik (poln stolpec, 20 vrstic) = **val 117/118** — zajetih 5 vrstic osnove (4 prečrtane rdeče)
- PT bp 96/97/98: glasovi potrjujeta Nro 38/39; status ostaja REVIEW (owner imena niso rešena — Nro glas ne dviguje)

## 5. Testi + infrastruktura

- **+11 varovalk** (`tests/val116-vlm-voices-p142.test.ts`): p142 (1795/3, 0 popravkov, 25 review, 34+37 variante, changes audit), artefakti (45 PZ, 696/696 tile-ov, 6 PT z vsebinami 38/39/70), pass3 neizmenjan, KG identična vsebina
- pini posodobljeni: 1755→**1795** (6 datotek), v82 43→**3** (2), variante 1402/1615→**1436/1652** (3), tile-i 695→**696** (3), v86-review-col-split 0→**25** (1), val109 glasovi 0→**45** (1), KG sha ca0aeb58→**2790d893** (9 datotek)
- **infrastruktura: `node_modules` symlink** na peskovniški SDK namestitev — razreši tudi vse lokalne modulne napake testov (`next/server`, `@prisma/client`, `zod`, `react/jsx-dev-runtime`): **1115 testov: 1104 pass / 11 skip / 0 fail** (prej 7 fail + 7 errors = okoljski) · tsc/lint lokalno zdaj pognljiva
- artefakti: `vlm-v109/` (45 JSON + raw), `vlm-v116/` (6 + `read-pt7-v116.mts`), `vlm-v86/p142-t-kultur2-T.{json,raw}`, `crops-v86/p142-t-kultur2-{nat,x2}.png` (gitignored, regenerabilno)

## 6. Naslednje

**val 117 — mikroprehod 8b**: PZ integracija 45 glasov (§ vrednosti iz REVIEW po admission pravilih + model I7; p63 16 vrstic vs v77 struktura; 7 dilem; protokoli p48/49 imena) + PT p7 re-adjudikacija (novo crop set areal stolpec 20 vrstic + 3. glasovi imen) → nato imenski pass p25–p55 (agentov vid), poln re-read p143, F-PV-03/F-PV-04, register 26-0326 + 26-0379.
