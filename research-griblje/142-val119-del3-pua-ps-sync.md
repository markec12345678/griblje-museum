# 142 — Val 119 del 3: PUA↔PS OSEBNA SINHRONIZACIJA (F-PV-03/04 okvir) + register eArheologija živa preverba

**Datum:** 2026-10-04 · **Issue:** #42 §4/§14 · **Obseg:** osebna plast ATLAS 1825 (person-owner-register + house-register + conflict-register + KG) na v119 stanje; živa preverba registra eArheologija (sloj 3692 MK_ARHEO, EID ~10094) · **Metoda:** 0 VLM, 0 ugibanja — deterministična re-izvedba iz comitanih registrov + živa REST poizvedba geohub.gov.si (2 izvedbi: val 105 živa kontrola + ta val).

---

## 1. Kontekst in cilj

Pass2 (val 59) je zgradil osebno plast iz PS registra **val 57 stanja** (1.073 vrstic, PARTIAL 55/143):
- `owner(ps)` = 163 oseb, model **first-owner per hiša** (`ps_owner_of` = prvi ne-prazen owner v vrstnem redu dokumenta);
- `pua_ps_name_sim` = val 58 `token_sim` na starih branjih → **51 hiš: 49 MISMATCH + 2 FUZZY, sim 0.114–0.564**;
- CH-xxx-01 konflikti (owner_state_pua_vs_ps) iz analysis-v1.json — vsi OPEN.

Od takrat: val 113–119 (del 1, 2a–2e) je PS p3–p55 imensko + vrednostno re-read z dvojnim sidrom
(v119-names 731, v114 → 0, v115 → 0; F-NA-01/02/03 zaprti). Osebna plast je ostala pass2 artefakt
("KG osebni sloj = pass2 PUA artefakt" — F-PV-03/04). Ta val jo sinhronizira.

## 2. Metoda (F-SYNC-01 popavek)

**Odkritje (F-SYNC-01):** val 58 `token_sim` docstring pravi "LCS po tokenih", implementacija pa
`norm()` odstrani VSE ne-črke **tudi presledke** → `split()` vrne en sam token → dejansko LCS nad
**zlepljenima imenoma**. Posledica: sistemsko nizki sim (max 0.564) in 49/51 MISMATCH. Stara metoda
ohranjena kot kontinuitetni stolpec `sim_concat_first` (1:1 replika).

**Nova primarna metoda B (`sim_surname`):**
- tokenizirana norma (presledki ohranjeni);
- **prvi token PS imena** (priimek — nemški red v obeh virih) vs. vsi tokeni PUA imena;
- sim = max LCS po parih; EXACT-token flag (popolno ujemanje celega tokena);
- pragovi kot val 58: **AGREE ≥ 0.7**; **PARTIAL ≥ 0.5 IN exact token**; sicer MISMATCH;
- `sim_any` (max nad vsemi pari) = dokumentacijski stolpec, **ne vodi razreda**
  (F-SYNC-03: h48 Höchsthaler Georg ↔ (R)abitscher Georg — sim_any 1.0 prek danega imena =
  lažno soglasje; h40 muster↔sautter 0.615 brez exact tokena → ostaja CONFLICT, SA-002 nedotaknjena).

## 3. Rezultat primerjave (51 skupnih hiš)

| razred | val 58 (stara metoda, stara branja) | val 119 del 3 (metoda B, v119 branja) |
|---|---|---|
| AGREE | 0 | **16** (hiše 5, 18, 26, 27, 29, 30, 36, 37, 41, 42, 44, 51, 61, 62, 64, 69) |
| PARTIAL/FUZZY | 2 | **2** (hiši 43, 66) |
| MISMATCH | 49 | **33** |

- izboljšanih vs. val 58 razred: **16 hiš**; reprezentanti: h44 PUA "Husitsch Maria Bauersleute" ↔
  PS "Husitsch Maria" (sim 1.0); h69 "Christian Brandl" ↔ "Christan Bräutig" (0.941 — F-NA-01
  del 2d-x3); h5/h3 Dragasch (h3 ostaja CONFLICT — PUA pisava "Draschisch", brez exact tokena);
  h26/h29/h62 Ring↔Brincz/krischan (del 2b Ring-grozda korooboracija).
- PS hiše nosijo **do 20 distinct imen** (h40) — PS vrstice = parcele, lastnikove hiše =
  so-živeči (Inleute, Wittiber, dediči); first-owner model jih je skrčil na enega.

## 4. Vgradnja (4 artefakti, vse deterministično regenerabilni)

`build-sync-v119-del3.py` (fail-fast guardi: 2875 vrstic / 1077 p3–55 / 1070 owner / 98 PUA /
98+163+227 oseb / 167 hiš / 113 konfliktov / 51 CH):

1. **ps-n83/analysis-v7.json** — A_pua_vs_ps_v119 (51 vrstic: ps_first, ps_distinct z stranmi,
   sim_concat_first/best, sim_surname/sim_any, best_ps_name, razredi v58+v119) + F-SYNC-01..05.
2. **atlas-1825/person-owner-register-1825.json** — owner(ps) re-izveden: **163 → 656** oseb
   (en vnos per (haus_no, ime) s stranmi; p3–p55); PUA (98) + PT (227) nedotaknjena;
   possible_duplicate re-izveden čez vse: **161 → 418** (vsi NOT_MERGED z razlogom);
   **488 → 981** oseb.
3. **atlas-1825/house-register-1825.json** — owners.ps posodobljen + NOVO `ps_distinct`;
   `pua_ps_name_sim` = kontinuiteta (concat-first); NOVO `pua_ps_name_sim_v119`;
   evidence_status re-izveden po metodi B: **AGREE 0→16, CONFLICT 49→33**;
   **F-SYNC-05: 8 hiš z zastarelim owners.ps** ('00', '79', '85', '214', '1 / 52', '1 / 6',
   '1 / 69', '1/59' — val 57 branja, ki jih v119 ne bere več: '00' Stuker Michl → h30 Stuker
   Mathl; '1/59' → h49 Schimek Micha; '1 / 6' Gyomandl → Gemeinde h0; ...) → dokaz ohranjen kot
   `owners.ps_stale`, owners.ps = null.
4. **atlas-1825/conflict-register-1825.json** — CH-xxx-01: claim_b posodobljen (sim_surname,
   n_distinct, pages); **statusi: 4 RESOLVED** (h18/26/29/30 — best = first-owner) +
   **12 PARTIALLY_RESOLVED** (lastnik potrjen med so-živečimi) + 35 OPEN;
   pass2 opombe ohranjene kot `note_pass2` (nič tihega brisanja); CB/CF nedotaknjeni; skupaj 113.

## 5. Kaskada (izrecna)

- **KG rebuild**: vozlišča 3269 → **3762** (PERSON 488 → **981**); vezi 3477 → **3471**
  (OWNER_OF 254 → 246: 8 zastarelih PS OWNER_OF prek ps_stale; RESIDENCE 10 → **12**: wohnort
  vrstice se sedaj vežejo na per-name osebe — TP-029 Zagorje 2 → **4** osebi: Lubreschibek
  Maathe. / Heide Marko. / Krischan Matthe. / Weidner Mathä.); trditve 622 → **614** (CONFLICT
  128 → 127, SINGLE_SOURCE 111 → 104); raziskovalne vrzeli 8 (nespremenjeno — join missi
  preprečeni); invariantе **[]**; KG sha **596c1ca7** (prva VSEBINSKA sprememba KG od val 117).
- story-graph 3762/3471/4 atomov; timeline 8 točk (I1 441 ✓, I2 Δ 0.086 % ✓, I6 ✓);
  coverage PASS 8: houses VER **16** / PART 45 / CONF 33; persons 981 (VER 140 / PART 691 /
  CONF 150); unresolved_conflicts: VER **5** (4 CH + CF-F8) / PART 16 / CONF 92; c4-metrika
  nespremenjena (register.json ni bil dotaknjen — K9 52/961/85 konsistentno).
- SA-002 (h40 Sautter↔Muster) nedotaknjena; claim re-id: C-00622 → C-00614 (614 trditev),
  PS OWNER_DOCUMENTED h40 C-00154 → C-00153.

## 6. Register eArheologija — živa preverba (2026-10-04)

`https://geohub.gov.si/ags/rest/services/MK/MK_ARHEO/MapServer/3692/query?where=EID LIKE '%10094%'`
→ **26 zapisov** (nespremenjeno); razlika vs. val 102 artefakt: **samo 26-0379 STATUS
"terenska raziskava napovedana" → "terenska raziskava v teku"** (parc. 2799 — okno okt./nov.
2026 se je odprlo); 26-0326 nespremenjen ("prvo poročilo (oddano v pregled)", brez
URL_POROCILO1); vseh 24 ostalih raziskav ima javni prenos 1. poročila (stanje val 104).
Posnetek: `val119-del3/arheo-3692-10094-live-2026-10-04.json` (sha aa4695cd…).

## 7. Iskrenost (§4/§22)

- **0 VLM klicev** — vse iz comitanih registrov + 1 živa REST poizvedba (javni eSDE kanal).
- **Nič ugibanja**: imena NIS združena (418 possible_duplicate NOT_MERGED); CH konflikti
  NISO izbrisani (4 RESOLVED + 12 PARTIALLY_RESOLVED z dokazi, 35 OPEN); pass2 opombe
  ohranjene (note_pass2); zastareli owners.ps ohranjeni (ps_stale).
- **F9 OSTAJA okvir** (PUA pripravljalno vs PS končno stanje) — ime-dokazi pa kažejo hiše,
  kjer stanje med kompilacijo PUA in finalizacijo PS ni prešlo lastniške spremembe.
- **PS p56–143 izključeno** iz osebne sinhronizacije (PROVISIONAL F-PV-04/NR-14) — F-SYNC-04.
- house_id trki v pass2 izvorniku ('0' vs '00', '1 / N' vs '1/N') = vnaprej obstoječe stanje,
  v tem valu ne odpravljeno (dokumentirano).

## 8. Testi + naslednje

- nov `tests/val119-del3-pua-ps-sync.test.ts` (12) + pini v 26 datotekah (KG sha c3932092 →
  596c1ca7; osebe 488 → 981; coverage AGREE/CONFLICT; CH statusi; claim re-id; PER-0586);
  **1295 testov: 1284 pass / 11 skip / 0 fail**; tsc čist; lint čist.
- Naslednje:
  1. VLM-subagent 2. oči kontrola vzorca (NR-14) po zaključku PS imenskega passa;
  2. F3 medstranska poravnava + p50–p55 2. oči;
  3. hiša 70–78: p56–143 PROVISIONAL plast (h72/74/76 opaženi) — ločena odločitev o uveljavljanju;
  4. register 26-0326 + 26-0379: ponovna živa preverba, ko poročili postaneta javna
     (URL_POROCILO1 → bralni protokol kot vali 102–104).
