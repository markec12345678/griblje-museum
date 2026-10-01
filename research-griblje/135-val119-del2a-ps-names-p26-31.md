# 135 — Val 119 del 2a: imenski pass PS p26–p31 — v57 imenska plast grozno pokvarjena: 71 lastnik + 30 haus popravkov, 7 ditto ovrženih, STRUKTURNA najdba (shift za 1 vrstico na p31)

**Datum:** 2026-10-01 · **Issue:** #42 §4/§14 · **Obseg:** PS N83 str. 26–31 (120 vrstic) — nadaljevanje imenskega passa po protokolu 133 (del 1 = p20–p25, PR #123); p32–p55 = del 2b–2e · **Metoda:** agentov direktni vid glavne seje (0 VLM klicev): nz-skladi `nz-pXX-g0..2` + enovrstične diag povečave x12–x24 (`make-rowzoom-v119b.py` — nov: prost per-page Y-odmik dy, ker p27–p31 nosijo pravila +5..7px nizje od merjenega grida) + dve "tall" sliki na p31 (r2–r7, r10–r19 — celotne vrstice, x7) + programska detekcija pravil + R-glijf referenca (p27-r1 "Ring": velika skleda z notranjo zanko) + 2↔3 kalibracija (3 = dvokotljasta z zastavico, 2 = okrogla zgornja zanka + valovita baza) + hišni medstranski preseki + PUA presek + registarski presek

## 1. Povzetek: v57 imenska plast p26–p31 = page-level pattern-fill (kakor p18/p28 pilot)

| stran | v57 vzorec | pravo stanje (črnilo) | popravki |
|---|---|---|---|
| p26 | "Kristan Jerey-napaka ni tu", a: "Wurzel", "Pirn Michael" h214, "Stangl" ×3 | "Brulla Michl[?]", "Ring Michael" h24, "Pobezy"/"Pavlicz[?]" | 6 ime + 6 haus |
| p27 | "Widmann Michael", "Hauschild", "Kreuker Michael", "Leue Michael", odpadka r2/r6 | "Brünig[?] Mathä[?]", "Haischan[?]", "Kreuker Mäthel[?]", "Ring Michl"; r2/r6 = fragmenti | 5 ime + 5 haus + 2 razhajanja |
| p28 | **"Wernig" ×5, "Stadtpfarrkirche[?]" ×7, "Müllig Samuel", "Blaschke", "Novakl", "Pavlic" ×2** | **"Ring" ×5 (h23–h25 preseki), "Jakobschitsch Mathä/Nicolaus" ×7 (PUA h.9 "Jakoffitschek"), "Müllag Johann", "Strauß Georg" ×2, "Blakutscher[?]", "Novach[?]"** | 17 ime + 3 haus + 2 razhajanja |
| p29 | **"Preinig" ×9, "Stuker Michl" ×4, "Müller Daniel" (r12), "Matschitsch Johani"** | **"Ring" ×9 (grozda h23–h28), "Stuker Mathl[?]" ×4, "Müller Johann"** | 15 ime + 2 haus |
| p30 | **"Andreas Muffel", "Zachter/Bulter/Andres Mäthel", "Brung" ×4, "Pring Michl", "König Michael", "Nillig Bannl"** | **"Stuker Mathl[?]" ×6 (h30), "Ring Johann/Mito/Mathä/Michael", "Müller Johann"** | 13 ime + 4 haus |
| p31 | **"Prinz" ×6, "Wurzen" ×3, "Puchey" ×3, "Schelle Janns" ×2, "Hoch Balth", "Wächter", "Pucher"** | **"Ring Mathä/Michl/Mito", "Puchey" ×2, "Müller Hannes" ×2, "Schelle Jank[?]" ×2, "Hoch Georg/Mito[?]", "Pichler[?]" ×2 + fragment r19** | 12 ime + 11 haus + 1 razhajanje |

**Skupaj: 71 lastnik + 30 haus POPRAVEK + 7 ditto ovrženih + 5 odprtih razhajanj + 1 cross-val fix (p23-r4) = 121 sprememb na 121 vrsticah (120 p26–p31 + p23-r4).** TRANSCRIBED = 0, nič ne dvignjeno.

## 2. Ključne najdbe

1. **Ring-grozda h23–h28** (p27–p31): h23 = Ring Mathä (p27-r15, p28-r19, p30-r16/r17, p31-r3/r4), h24 = Ring Michael (p26-r18, p27-r9, p28-r1/r18, p29-r10, p30-r19, p31-r7/r8), h25 = Ring Mito (p27-r10/r14/r18, p28-r2/r17, p29-r2/r11/r19, p30-r3, p31-r9/r10), h26 = Ring Johann (p27-r1/r5, p29-r1/r17/r18, p30-r2/r8/r9), h28 = Ring Mito/Georg (p29-r7/r19, p30-r3). v57 jih je raztreseno imenovala "Wernig/Prinz/Wurzen/Brung/Pring/König/Preinig" — vsi fabriirani.
2. **Jakobschitsch hiša h8/h9/h13** (p28): vseh 7 "Stadtpfarrkirche[?]" vrstic = osebna imena "Jak?fschitsch Mathä" (×5) / "Nicolaus" (×2) + 2 fragmenta; PUA h.9 "Jakoffitschek" = neodvisen presek. Institucija "Stadtpfarrkirche" NE obstaja v črnilu.
3. **Strauß vs Krause (h15/h45)**: p28-r9/r11 "Strauß Georg" (S + t-prečka + ff = ß); x16 primerjava p23-r4 ≡ p28-r9 (isti h15) → **cross-val fix: p23-r4 "Krause Gorgy" → "Strauß Gorgy"** (del 1 napaka); p23-r14/r18 h45 "Krause" ostaja (brez t-prečke).
4. **STRUKTURNA najdba p31 — v57 prepis shifted za 1 vrstico od r3 naprej**: register r_N (N≥3) nosi vsebino črnila r_{N-1} (dokaz: haus-sekvenca 1:1); v57 r3 "Puchey Georg DITTO" = fantomska vrstica, črnilo r19 = fragment brez vpisa. Vse 7 v57 ditto-zastavic ovrženih (črnilo povsod polna imena).
5. **Matheus-kratica**: "Mathl[?]/Mäthel[?]" (p27-r4 Kreuker, p29-r4/r9/r13/r14 + p30-r0/r4/r5/r12/r13 Stuker, p31-r18) — v57 "Michl/Michael/Samuel/Mäthel/Andres" zgrešeni.
6. **Müller hiša h29**: p29-r0 Daniel, p29-r12 + p30-r18 Johann (v57 "Daniel"/"Nillig Bannl"), p31-r5/r6 Hannes — Johann = Hannes.
7. **2↔3 šum v deseticah**: p27 r15/r19 33→23, p30 r10/r11 87→27, p26 r6/r9/r17 38→28/36→26/35→25; plus zamenjave p26-r18 214→24, p29-r14 00→30, p30-r14 68→67, p31 (shift).

## 3. Kaskada (izrecna, testno vodena)

| veličina | val 119 del 1 | val 119 del 2a |
|---|---|---|
| register | 2875 | **2875** (vstavljanj ni) |
| plasti | v114 607 / v118 60 / v119 120 | v114 **487** / v118 60 / v119 **240** |
| pass3 PS parcele / raba | 392 / 173+142 | **392 / identično** |
| KG vozlišča / vezi / PARCEL / HAS_PARCEL | 3269 / 3477 / 2427 / 2773 | **identično** |
| KG sha256 | 0b478847 | **4bb6a974** (owner/haus nizi) |
| K5 ditto | 222 | **215** (7 ovrženih, p31) |
| K9 p1–55 | 69 | **69** (vrednostne metrike nespremenjene) |

## 4. Iskrenost (§4)

- **0 VLM klicev** — vsa branja z agentovim vidom glavne seje iz determinističnih izrezkov;
- **izrecni dvomi ostajajo v imenih**: "Michelkorn Peter[?]", "Brünig[?] Mathä[?]", "Haischan[?]", "Kreuker Mäthel[?]", "Stuker Mathl[?]" (×5), "Blakutscher Georg[?]", "Novach Martinl[?]", "Jakobschitsch …[?]" (×7), "Brulla Michl[?]", "Pavlicz Georg[?]", "Ring Mito[?]" (p31 ×3), "Schelle Jank[?]" (×2), "Hoch Mito[?]", "Pichler[?]" (×2);
- **5 odprtih razhajanj** (anmerkung, v57 ohranjeno): p27-r2 "Hantspa?ig an[?]", p27-r6 "M?assga?ungan[?]", p28-r5 "Jakobschitschkri?gelaung[?]", p28-r13 "Jakobschitschkühelaung[?]", p31-r19 "R?b?ang P?ening[?]" — vsi fragmenti brez haus-vpisa;
- **p23-r4 cross-val fix izrecno označen** (owner_original_pre_v119d2 + anmerkung) — popravek dela 1, ne nove plasti;
- **p31 strukturni shift**: popravek pomeni, da so v57 vrednosti (jae/kla) na p31 r3–r19 vezane na PRAVE vrstice (vrednostna kolona ni bila shiftana — samo imenska/haus prepis je zdrsel); vrednosti ostajajo nedotaknjene, sprememba = samo owner/haus;
- **PUA presek** je orientacijski (druga dokumentarna plast) — nosilec dokaza je vedno črnilo + medstranski presek hiš.

## 5. Testi + infrastruktura

- pini posodobljeni: KG sha 0b478847→4bb6a974 (11 testnih datotek), K5 222→215 (×3), v114 607→487 (×4), v119 120→240, odprta razhajanja 28→33, p23-r4 "Krause Gorgy"→"Strauß Gorgy";
- **1187 testov: 1176 pass / 11 skip / 0 fail**;
- novi vhodi: `band-v113/reading-v119/p26..p31.json` (meta + names_audit, vlm_calls=0), `build-register-v119-del2.py` (fail-fast, guard 120 v119-names iz dela 1), `make-rowzoom-v119b.py` (per-page dy), audit `register-v119-del2-changes.json` (121 sprememb s snimkami);
- diag izrezki: gitignored, regenerabilni (`make-rowzoom-v118.py` / `make-rowzoom-v119b.py`).

## 6. Naslednje

1. **val 119 del 2b: imenski pass p32–p37** (riziko-tabele sub-agentov pripravljene: p33/p34 = 21 vrstic, ditto-zemljevid, PUA presek);
2. del 2c: p38–p43 (p28-stadtpfarrkirche-tip sumi: "König"×8/"Höring"×9 pattern-fill; p40 r2 tekač; p42 11 rdečih revizij);
3. del 2d: p44–p49 (126 diag zoomov že pripravljenih; p47 "Christan Mäthel"×10 sum);
4. del 2e: p50–p55;
5. nato: pass p5/p7/p11-kultur ostanek + PUA↔PS sinhronizacija (F-PV-03/04).
