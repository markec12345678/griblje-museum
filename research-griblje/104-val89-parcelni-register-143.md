# 104 — 89. val: PS PARCELNI REGISTER 143/143 PROJEKCIJA — 432 → 930 parcel; NR sloji vgrajeni v builder; KG v2.1 kaskada v pravilnem vrstnem redu

**Datum:** 2026-09-28 · **Obseg:** ATLAS 1825 §4/§13/§22 — `build-pass3.py` (val 60) posodobljen in prvič varno re-zagnan nad polnim registrom 2.871 vrstic
**Nadaljevanje:** val 88 poročilo §5 (izrečen predlog vala 89) + pouk o destruktivnem re-runu zastarelih builderjev
**Vgradnja:** parcel-register-1825.json (PS 432 → **930**), negative-result-register-1825.json (NR-12/13/14 vgrajeni + 4 val89 re-checki) · **KG v2.1** (PARCEL 2.465 → 2.965 vozlišč) → story → timeline → coverage (pravilni vrstni red KG zadnji pri kaskadi po registru — tokrat obratno kot pri valu 88 poskusu) · **izrecen, testno voden prehod števcev** (24 testnih datotek osveženih, nič tiho)

---

## 1. Kontekst

Val 88 je rešil 139 digit-split vrstic in izrecno NE zagnal kaskade do parcelnega registra: poskusni re-run `build-pass3.py` (val 60) bi sicer pravilno projekciral 432 → 930 parcel, ampak bi **hkrati izgubil** NR-12/13/14 (v negative-result register so bili vgrajeni ročno v valih 62/83, ne v builderju) in (prek `build-pass4.py`) a01 georef v2 (val 72). Vse tri datoteke so bile obnovljene, nauk pa dokumentiran: **re-run builderja je dovoljen šele po vgradnji poznejših slojev v builder**. Val 89 izvede točno ta postopek, kot ga predlaga poročilo vala 88 §5.

## 2. Spremembe v `build-pass3.py` (logika ekstrakcije 1:1 val 60 — samo sloji)

- **Provenanca PS:** `1.073 vrstic / 55-143 strani (val 57)` → `2.871 vrstic / str. 3-143 (val 57→61→82/83→88; 139 digit-split vrstic z v88 vrednostmi)`.
- **Source labela PS parcel:** `PS N83 (PARTIAL 55/143)` → `PS N83 (143/143)` (na vseh 930 zapisih).
- **NR-12/13/14 VGRAJENI v builder** (prej ročno v artefakt = vzrok izgube ob re-runu): besedila val 62/83 ohranjena verbatim; nov val 89 dodaja **žive re-checke** (izračunano iz polnega registra, deterministično):
  - **NR-01** (B.P./Zollamt v PS Anmerkung): re-check nad 2.871 vrsticami → **0 zadetkov** → *POTRJENO pri 143/143*.
  - **NR-02** (Rosetta PS↔PUA): re-check → **356 številčno skupnih vrednosti** (od 504 unikatnih PS jaethe × 1.517 unikatnih PUA števil); *OSTAJA NEPOTRJENO* — številka sama ne nese sekcije (F14 Flurbezirk ne-dekodiran); ocena pričakovanja po naključju je nestabilna glede na izbrani številski prostor, zato se ne navaja.
  - **NR-05** (hiše 70–78): re-check → **razčlenjeno**: 72 → p65 (2), 74 → p65/69/122 (4), 76 → p115 (1) **sedaj dokumentirane**; 70/71/73/75/77/78 → 0 vrstic v celotnem PS → *DELO OSVEŽENO* (negativ zožen; 72/74/76 so bile izven izpita vala 60, ki je testiral 73–78).
  - **NR-12** (imenski Flurbezirki): re-check → 79 neštevilskih jaethe zapisov, **0 s črkovnimi imeni** (vse mehanske oblike: `17½`, `ganz`, `N/N` …) → *POTRJENO pri 143/143*.
- **Fail-fast varovalke** (2.871 vrstic; 139 v88 vrstic = 137 statusov P1/P2/T3 + 2 UNRESOLVED z `v88_note`; 14 negativov) — re-run brez poznejših slojev je sedaj nemogoč po konstrukciji.
- **v88 pravilo dokumentirano v method.rules:** digit-split vrstice s prazno jaethe in klafter vrednostjo **NISO parcele** (F-PV-05 page-level: pisar piše Kläfter) — zato 137 v88 rešenih vrstic ne poveča števca parcel; 9 eksplicitnih j|k vrstic pa vstopi prek čiste jaethe številke (1–2 mesto).
- **Izhod:** `val: "89"`, pass 3, title v2.

## 3. Rezultat projekcije — PS parcele 432 → 930 (napoved vala 88 točna)

- **PS parcele: 930** (napoved poročila val 88 §5: 930 — zadeta na enoto; razčlen v 3.1: 924 čistoštevkovnih raw + 6 strnjenih z presledkom).
- **Land use pokritost (930):** njiva 297 · travnik 97 · UNKNOWN 333 · vrt 16 · pašnik 22 · gozd 16 · drugo 11 · **None (brez kultur zapisa) 136** · **dvorišče 1** · **vinograd 1**.
- **Mapiranje:** EXACT 450 · TERM-UNCLEAR 333 · EXACT-MIXED 11 · None 136.
- **Flag >3000 (val 58 F14):** 4 parcele (flag, ne izključitev).
- **Skupaj register:** PUA 2.035 + PS 930 = **2.965** parcel.

### 3.1 Razčlen množice jaethe (2.871 vrstic — točno izračunano)

| oblika | vrstic | v register? |
|---|---|---|
| čiste števke 1–4 mest (raw, brez presledkov) | 924 | **DA** |
| števkovne z notranjim presledkom, ki se strnijo v ≤ 4 mesta (`1 837` → `1837`, `2 422`, `7 797`, `1 939`, `1 838`, `1 355`) | 6 | **DA** (pravilo val 60: `replace(" ", "")`; `jaethe_original` ohranjen) |
| ostale ne-prazne ne-števkovne (`3 1268` → 5 mest = zavrnjeno, `N/N`, `N½`, `N¼`, `ganz`, `-`, `+`, `.` …) | 73 | NE (ni čista parcelna številka) |
| prazno (vključno 128 v88 rešenih, kjer je vrednost v KLAFTER — F-PV-05) | 1.868 | NE |

924 + 6 = **930**; 930 + 73 + 1.868 = 2.871 ✓. Od 930 jih **4 nosi flag >3000** (val 58 F14: možna zmes stolpcev — flag, ne izključitev). Vsak zapis v registru nosi `jaethe_original` (nespremenjen) + `parcel_number` (izpeljan) — nič tiho normalizirano.

## 4. KG v2.1 kaskada (pravilni vrstni red: pass3 → KG → story → timeline → coverage)

- **KG:** PARCEL vozlišča 2.465 → **2.965** (PUA 2.035 nespremenjena + PS 930); HAS_PARCEL 2.865 → **3.187**; vozlišča skupaj 3.309 → **3.807**; vezi 3.569 → **3.891**; claims 622, research gaps 8, story atoms 4 — nespremenjeni; **invariantne kršitve: 0**.
- **PS parcelni vozliščni status:** `TRANSCRIBED_PARTIAL` → **`TRANSCRIBED_PROVISIONAL`** (nov status, val 89): pokritost prepisa je 143/143 (nič »partial« več), per-parcelna branja pa ostajajo **PROVISIONAL** (F-PV-04, NR-14) do pasovnega re-reada. Vozlišče nosi izrecno opombo. UI tir (§17): `TRANSCRIBED_PROVISIONAL` → **VERJETNO** (pariteta ohranjena — PS parcele se NE dvignejo na DOKAZANO); legačni `TRANSCRIBED_PARTIAL` ostane v obeh TIER_EXACT tabelah (VERJETNO) za stare artefakte.
- **SRC-PS coverage opomba** (od vala 84) je že nosila »TRANSCRIBED 143/143« — nespremenjena; v2.1 issue zapis dopolnjen.
- **Story-graph:** projekcija KG (nič novih trditev); histogram statusov zdaj nosi 930 `TRANSCRIBED_PROVISIONAL`; kg_sha256 = **b4f5011c…**.
- **Timeline:** metrike 1825 točke posodobljene izrecno: `parcels_ps` 432 → **930** (opomba: projekcija 143/143, v88 pravilo, F14 odprt), `parcels_with_land_use` 326 → **461** (provenanca: njiva 297, travnik 97, pašnik 22, vrt 16, gozd 16, drugo 11, dvorišče 1, vinograd 1; 136 brez kultur zapisa izven obeh števcev), neznanka 106 → **333**; I6 zatiči posodobljeni; I1–I6 čiste.
- **Coverage report:** parcels 2.465 → **2.965** (907 VER / 675 PART PUA + 930 PART PS / 453 CONF); parcel_geometry 2.965 × NOT_FOUND; unknowns agregat: »PS parcele cross_ref UNKNOWN (F14)« 432 → **930** (zdaj iz register-ja, ne trdo kodirano); »preostanek« besedilo posodobljeno; source-coverage val 89 (vsebina PS bloka nespremenjena od vala 86); quality gate val 89; **§24 manifest 14/14, I1–I5 čiste**.
- **MAP data model** (izpeljan v coverage builderju): PARCEL 2.965, HAS_PARCEL 3.187 — avtomatsko usklajen.

## 5. UI sloj — dve novi EXACT kategoriji dobita lastno vedro

Projekcija je na plano prinesla **1× dvorišče (Hofraithe)** in **1× vinograd (Reb/Weingarten)** — leksikalno nedvoumni kategoriji, ki jih UI vokabular (val 73) ni poznal. Po §4 (nikoli ne ugibaj) in testu »UI ločljivost«:
- `LandUseBucket` + `LAND_USE_ORDER`: + `dvorišče`, `vinograd` (8 → **10** vedier);
- `parcelLandUseCounts` init + i18n oznake **v vseh 5 jezikih** (sl: Dvorišče/Vinograd · en: Farmyard/Vineyard · hr: Dvorište/Vinograd · de: Hofraum/Weingarten · it: Cortile/Vigneto);
- `filterUseNote` ×5 osvežena: **143/143 strani (val 89)** + novi termini v enumeraciji (prej 55/143);
- verify-i18n: **1076 ključev × 5** zeleno.

## 6. Testi — izrecen prehod števcev (§22: ne tih)

- **Novo v pass3 testu:** 930 zapisov, land-use pokritost (njiva 297 / UNKNOWN 333 / None 136 / EXACT 450 / TERM-UNCLEAR 333 / EXACT-MIXED 11), vse PS parcele nosijo `PS N83 (143/143)`, NR-12/13/14 vgrajeni (test na builder title), 4 val89 re-checki deterministični, NR-13/14 brez re-checka.
- **Osveženi zatiči (24 datotek):** atlas-1825-pass3, atlas-1825-coverage, atlas-timeline (I6: 930 / 461+333), atlas-1825-knowledge-graph, atlas-story-graph (3.807 / HAS_PARCEL 3.187 / kg_val 89), atlas-story-engine (»2965 parcel«; H-040 »10 od 124«; njiva status `TRANSCRIBED_PROVISIONAL`; §18.6: 461 dokumentiranih / 2504 brez), atlas-explore (features 2.965; vedra; §17 pariteta z novim statusom; i18n 10 oznak), atlas-map, atlas-evidence-api, atlas-georef, pz-konskripcija, pv-land-use, val84 (števci 3.807/3.891; R-03891; kaskada kg_val 89), val85 (sha b4f5011c), val86 (KG v2.1 3.807/3.891; coverage val 89), val88 (KG v2.1; register 930/val 89 — z ohranjeno zgodovinsko opombo o v86 stanju), api-smoke (map counts 2965 = 461 + 333 + 2171; layers 2.965; story overview 3.807/3.891; unknowns geometry 2.965).
- Zgodovinske opombe v testih (»pri valu 84 je bilo 84«, »val 88 je bil KG puščal na v86«) ostanejo — prehod je sledljiv.

## 7. Poštenost in ne-spremembe

- **a01 georef v2 (val 72) NESPREMENJEN** — pass4/build-pass4.py ta val NE poganja; georef sloj je pred re-runom posnet in po kaskadi primerjan (brez razlike).
- **PUA plast nespremenjena** (2.035 / 417 so-referenc).
- **Per-parcelne vezave PS ostajajo PROVISIONAL** (F-PV-04, NR-14) — projekcija širi REGISTER, ne dviguje gotovosti branj.
- **F14 namespace (PS↔PUA) ostaja odprt** — cross_ref_to_pua UNKNOWN na vseh 930.
- **86b 2. del / F-PV-03 / PT p7 @300dpi** — nedotaknjeni (roadmap ostaja).

## 8. Naslednje (next_reads)

1. **86b 2. del** — spravilo preostalih ~479 tile-ov (p63–94 name + p95–142 kultur+name) ob VLM kvoti; nato polna vgradnja val 86 (~1.798 vrstic) — v88 vrednosti ostajajo vir resnice za 139 digit-split vrstic; nov re-run kaskade (tokrat že standardna pot: build-register → F11 → KG → story → timeline → coverage).
2. **F-PV-03** (p121 QKlft anomalija) — še odprta; gi 2384 je njen del.
3. **Flurbezirk glava @300 dpi** (F14) — ključ do Rosette NR-02; sedaj ima statistika 143/143 osnovo.
4. PZ p48–65 2. prehod → PT p7 @300dpi → PR Grenz-Beschreibung (roadmap val 85).
5. ISSUE #72 — raziskovalne sledi (EŠD 11081, raziskovalne kode 2012–2021, rimska sinteza Mason 2001 …) čakajo vgradnjo po evidence-first logiki (ločen val).

## 9. Artefakti

- `atlas-1825/build-pass3.py` — v2 (val 89): sloji + re-checki + varovalke
- `atlas-1825/parcel-register-1825.json` — 2.965 parcel (PS 930 @ 143/143)
- `atlas-1825/negative-result-register-1825.json` — 14 negativov (NR-12/13/14 vgrajeni; NR-01/02/05/12 z val89 re-checki)
- `atlas-1825/knowledge-graph-1825.json` v2.1 (b4f5011c…) + `story-graph-1825.json` + `timeline-1825-1830.json` + `coverage-report-1825.json` + `source-coverage-1825.json` + `atlas-map-data-model-1825.json`
- `src/data/` zrcala — vse regenerirane s builderji (ena izhodna resnica)
- `src/lib/atlas-explore.ts`, `src/lib/atlas-story-engine.ts`, `src/components/museum/cadastre-map-view.tsx`, `src/lib/i18n.tsx` — UI sloj (vedra + tiri + oznake ×5)
- Testi: +3 nova varovalka v pass3 testu (vgrajeni NR, re-checki, 143/143 labela), skupno **631 testov — 620 pass / 11 skip / 0 fail**
