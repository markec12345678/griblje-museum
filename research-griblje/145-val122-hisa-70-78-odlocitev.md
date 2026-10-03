# 145 — Val 122: HIŠA 70–78 — LOČENA ODLOČITEV (uveljavitev h72/74/76 iz PROVISIONAL plasti; NR-05 zaprtje) — 0 VLM

**Datum:** 2026-10-06 · **Issue:** #42 §4/§14 · **Obseg:** izvedba točke 1 protokola 144 §6 (»hiša 70–78 — ločena odločitev«), odložene v valih 120 (§6.3) in 121 (§6.1) · **Status:** **vgradnja** — house-register 167 → 169 + negative-result-register NR-05 val122_decision + KG v2.5 (fe7b271c-pred → 8345868a; glej §5) + story/timeline/coverage/runtime kaskada; 0 VLM klicev.

---

## 1. Kontekst in odločitev

- **NR-05** (negative register, val 60): hiše 73–78 »ne obstajajo v nobenem viru« — takrat je PS pokrivala le p3–p55.
- **Val 89 re-check** (143/143): 72 → p65 (2), 74 → p65/69/122 (4), 76 → p115 (1) dokumentirane v PROVISIONAL plasti (`v86-colonial-tiles`, F-PV-04/NR-14); 70/71/73/75/77/78 → 0 vrstic. Negativ takrat samo »DELO OSVEŽENO«.
- **Val 119 del 3 (F-SYNC-04):** osebna sinhronizacija izključuje p56–143; »hiše 70–78 imajo v PROVISIONAL plasti opažene h72/74/76, dokumentirano, ne uveljavljeno.«
- **Odločitev val 122 (deterministično, add-only):** uveljavitev dokumentiranih opažanj v house-register z IZRECNO `layer: PROVISIONAL` oznako; kvalitetna plast p3–p55 (val 119/121) nedotaknjena; osebna plast (person-owner-register) NESPREMENJENA.

## 2. Vgradnja (`build-houses-v122.py`, fail-fast + idempotentno)

| Hiša | Sprememba | Dokaz |
|---|---|---|
| H-074 | **NOV vnos** (SINGLE_SOURCE) | PS-only: p65 ×2 Tillek Wolfgey (Acker, j1/1206 + 319), p69 Heidrich Peter (Acker, j1/46), p122 Kauc Miheljz (kl 206, brez j) — vse `v86-colonial-tiles` |
| H-076 | **NOV vnos** (SINGLE_SOURCE) | PS-only: p115 Gritsch Mihlo — vrstica hišne oznake brez kultur/j/kl |
| H-072 | `owners.ps` vgrajen (layer PROVISIONAL) | p65 ×2 Wolfsloch Wolfgey (Acker, 766 + 1189) |
| H-070, H-071 | `ps_absence: NEGATIVE-DECISIVE` + opomba zamenjana | 0 vrstic z haus_no 70/71 čez celoten register (2.875 vrstic, 143/143) |
| H-073/75/77/78 | brez vnosa (negativ) — NR-05 val122_decision | 0 vrstic čez celoten register |

**Varovalke pred vgradnjo:** izhodišče 167; H-074/H-076 neobstoječa; 13 pre-obstoječih podvojenih H-1-* ID-jev (številčna varovalka); PS register 2.875 vrstic; h70–h78 ima 0 vrstic v kvalitetni plasti (p3–p55) — točne stran/ime/reading_pass ujemanja za h72/74/76; parcelne posledice: h74 točno 2 PS parceli (PS-p065-j1, PS-p069-j1), h72/h76 točno 0 (F-PV-05).

**Posledica KG:** HAS_PARCEL vezi za PS parceli h74 sedaj nastanejo — **tiha vrzel** KG builderja (`continue` pri manjkajoči hiši) od val 89 odpravljena; builder vrzeli zdaj izrecno dokumentirajo (RG-009/010/011, razlaga F-SYNC-04).

## 3. NR-05 val122_decision

- **Negativ ODLOČILEN** za [70, 71, 73, 75, 77, 78]: celotna pokritost PS (143/143, 2.875 vrstic) + PUA + PT + A01; nadgradi val 89 »DELO OSVEŽENO« (takrat še »delna PS pokritost«).
- **Dokumentirani PROVISIONAL:** 72 → H-072 owners.ps; 74 → H-074 (nov vnos); 76 → H-076 (nov vnos).
- Hiša 73: negativ potrjen tudi z val 99 (issue #100 — F0000212 ≈ št. 73 = INFERRED; SEM + Šopek 1937–39 re-verified).
- `negatives_total` 14 NESPREMENJEN (update je add-only na obstoječem NR-05).

## 4. Iskrenost (§4)

- **0 VLM klicev**; vse vgradnje čistih determinističnih projektov obstoječih registrov.
- **Imenska napetost H-072 NE razrešena:** PUA »Strauß Khonrad bauer zu Grübln« (VERIFIED-2x, residence Grübln) vs PS »Wolfsloch Wolfgey« (PROVISIONAL branje). Metoda B sim se NE izračuna (definirana samo nad p3–p55); `pua_ps_name_sim` polja ostanejo null iz kontinuitete. DOKUMENTIRANO, ne prikrito.
- **Imena h74 različna med stranmi** (Tillek Wolfgey / Heidrich Peter / Kauc Miheljz) = sukcesija/so-živeči v PROVISIONAL interpretaciji — nič ne sodimo.
- **p65 zaporedje hiš ni monotono** (66, 74, 74, 72, 72, 66, 64, 62, 62, …) — hišni obstoj h72/74 ni odvisen od točne atribucije posamezne vrstice (3 neodvisne strani za h74), vendar ostaja opažba za prihodnji p56–143 re-read (NR-14 okvir).
- **F-H122-01 (DOCUMENTED, izven dosega vala):** 13 pre-obstoječih podvojenih `house_id` parov (H-1-3/-4/-6/-11/-14/-18/-19/-61/-63/-64/-65/-66 + H-000) — posledica normalizacije notacij »1 / N« in »1/N« v isti ID (val 119 del 3). KG serializacija ohranja obe vozlišči (167 vnosov = 154 unikatnih ID-jev). Popravek (deterministična disambiguacija ID-jev) čaka svoj val — ta val ga NE počne tiho, ker bi spremenil KG ID-je izven odločitve hiša 70–78.

## 5. Kaskada (izrecna)

house-register + NR-05 → **KG v2.5** (3764 vozlišč: HOUSE 167→**169**; 3473 vezi: HAS_PARCEL 2773→**2775**; vrzeli 8→**11** = +3 iskrene OWNER join miss; KG-F14 RESOLVED-V122; **KG sha 8345868a**; delovni sha med sejo fe7b271c = isti builder, premik `ps_distinct` na shemo H-080 pred committom) → story (3764/3473/4) → timeline (8 točk; I1 441 ✓ I2 0,086 % ✓ I6 ✓) → coverage (PASS 8; hiše 169 = VER 16 / PART 47 / CONF 33 / UNK 73; §24 manifest 14/14; negative_results 14) → runtime src/data kopije sinhronizirane. **Osebna plast:** PERSON 981, OWNER_OF 246, OWNER_VARIANT_OF 224 — NESPREMENJENI (F-SYNC-04).

## 6. Naslednje

1. p3–p16 vrednostni sweep (brez flagov, nizka prioriteta — v82-era brez re-reada);
2. register 26-0326/26-0379 ponovna živa preverba ob javnih poročilih eArheologija;
3. črkovalna sodba imenskih variant (celicni zoomi) — NR-14 ostaja za imena; vključno s p56–143 osebnim re-readom (reši RG-009/010/011 in PROVISIONAL lastnike h72/74/76);
4. F-H122-01: deterministična disambiguacija 13 podvojenih H-1-* ID-jev (lasten val, z izrecnim KG ID prehodom).
