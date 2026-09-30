# 126 — Val 111: poln re-read PS p1–55, 1. del — p3 (vgradnja območij + F-PV-07)

**Datum:** 2026-09-30 · **Issue:** #42 §4/§14 · **Obseg:** PS N83 str. 3 — EDINA stran val 57 z 'qm' shemo, katere območja NIKOLI niso vstopila v register · **Metoda:** agentov direktni vid (instrument val 61/88/108): pasovi ×2–3 + ultra zoomi ×7–12 za odločanje o števkah · **0 VLM klicev** (429 dnevna kvota; en rezervni testni klic @10:30–10:47 UTC = 429) · instrument: `make-crops-v111.py` (140 determinističnih izrezkov p03–p16, regenerabilno) + `regen-missing-crop-v99.mts` (regeneracija izrezka p142-t-kultur2 iz manifestnih koordinat — orodje za ob kvoti)

---

## 1. Kontekst in prevzem

Val 110 je zaprl "PT p7 @300dpi" + "PR Grenz-Beschreibung". Naslednja tema po val 108/109/110 worklogih: **poln re-read p1–55 + p143** (p56–142 že 2-glas + v88 + tile glas) ter **VLM glasovi ob kvoti** (p142-t-kultur2 je edini preostali tile 695/696).

Val 111 je začel poln re-read s **stranjo p3** — in takoj odkril, da je to najhujša vrzel registra:
- val 57 je p3 prebral z **'qm' shemo** (edina stran od 55!); register-builder je preskočil polja qm/rente → **vse 21 vrstic p3 v registru BREZ območij, BREZ lastnikov, BREZ števcev** (samo kultur + 1 kapital).
- p4–p55 imajo jk-shemo in vgrajene vrednosti — a z lastnim (F-PV-07) problemom, spodaj.

## 2. F-PV-07 (NOVO) — območja p1–55 piše v Quad. Klafter, val 57 jih je vnesel v jaethe

S testnimi izrezki p05 (×5–×7, glava + vrstice v eni sliki) je dokazano:
- podstolpca "Flächen Inhalt": **N.o Joche (levo) | Quad. Klafter (desno)**; navpični pravili ~791 in ~862 px;
- vse vrednosti p5 (913/543?, 222, 683, …) ležijo v **desnem podstolpcu = Quad. Klafter**; N.o Joche prazen;
- isti vzorec na p3 in p11. val 57 je te vrednosti vnesel v polje `jaethe` (p4–55) — **sistemska prerazporeditev**;
- skupna vsota (J×1600+QK) je INVARIANTNA (j=0) — aritmetika kaskade ni otherwise prizadeta; popravek = prestavitev polj, ki ga p1–55 vali re-readov izvajajo postopno (p3 že v tem valu: vrednosti vgrajene DIREKTNO v `klafter`).

Dokazna slika tudi pokaže par **"1 | NN"** v hišno-številčnem pasu (konstanta 1 + hišna št.) — semantika konstante izrecno ODPRTA (F16 val 61 kontekst; nič ugibanja).

## 3. p3 — vgradnja (19 vrednosti) + audit razhajanj vs val 57

| vrstica | val57 qm (nikoli v register) | v111 (vgrajeno v klafter) | opomba |
|---|---|---|---|
| r0 | — | — | vrstica močno prečrtana (črno), brez številke |
| r1–r12, r14, r17–r19 | 116, 325, 769, 44, 307, 374, 203, 488, 802, 729, 99, 758, 663, 214, 274, 62 | **enako** | soglasje (r3 z [?] — spodaj) |
| **r13** | 609 | **409** | ×12: 4 = odprta oblika (6 = zaprta zanka, primerjava z 663 r14) |
| **r15** | 158 | **184** | ×7: 8 = dvojna zanka, jasna |
| **r20** | 46 | **96** | ×8 (u-tail): 9 = zaprta zanka, jasna |
| **r3** | 769 | **769[?]** | ×12: zadnja števka 9/2 neodločena — ohranjeno val57 branje z dvomom, NI korekcije |
| r16 | (prazno) | (prazno) | celica območja dejansko prazna (kapitalni niz '1−602') |

- **r11**: obstoječ zapis številke prečrtan (X), prek njega 99 → anmerkung marker.
- **r14**: kultur prečrtan rdeče (val57 "Wiese" ne drži — najdeno "Acker" prečrtano), vrednost **679 prečrtana rdeče**, ostane 663; rdeča 2-vrstična opomba ("…1844…") — natančna transkripcija odložena.
- **Fürtrag p3**: oznaka "1 Fürtrag.", **črno 3|574 prečrtano rdeče, rdeča korekcija 2|1495** (= 2 J | 1495 QK).
- **Vsotna kontrola** (C4-vzorec, izrecno neodločeno): Σ r1–r20 = 6916 QK vs rdeč Fürtrag 4695 → delta 2221; vključno s prečrtanimi (679+99): 7694 ≈ 4|1495 = 7895 (delta 1!) — hipoteza "Fürtrag vključuje prečrtane / rdeči J = 4" NEODLOČENA, surovo zabeležena.
- **Kapitalni nizi** "1−1348" (r10), "1−602" (r16), "22" (r19) = neražčlenjeni fl|kr|pf formati — dekodiranje odloženo; register v57 vrednosti ostajajo.
- **Kultur dvomi** r5/r6 (dvovrstično "Lhügwind?[?] / Ödt?[?]" vs register "Abhang[?]"), r16/r18/r19 (Wiese/Gart vs videno) — NI korekcij kultur (nič ugibanja), vsi vidiki v reading JSON.

## 4. Stolpna kalibracija (kontekst za imenski pass)

- kolona 1 = **"Nro. des Blattes"** = rimska številka lista (I + ditto) — F15 val 61 potrjena tudi na p3/p4/p11;
- zaporedje **1–21 (p3), 22–41 (p4), 161–170 (p11, prečrtano rdeče), 821–840 (p44, val 61)** = **Uebersetzung/Ried števec** — pomen prečrtanj na p11 odprt;
- register v57 `no_blatt` (1..20/23 per-page) = semantično nezanesljiv (F15) — v tem valu NI popravkov no_blatt.

**Imenski pass p3 = ODLOŽEN** (names-izrezki z x-odmikom — levo porezano); register p3 lastniki ostajajo prazni. To je naslednji val (p4–p16 pasovi + imena + F-PV-07 prestavitve).

## 5. Kaskada in varovalke

- `build-register-v111.py` (fail-fast: 2871 + 139 v88 + changes guard; 1:1 val 108 vzorec): 19 vgradenih `klafter`, 3 anmerkung add-only, reading_pass `v111-ps-reread` na vseh 21; page_observations p3 (Fürtrag rdeča korekcija, F-PV-07, odprti formati).
- pass3: **PS parcele 735 NESPREMENJENE** (p3 brez lastniške identitete ne steče v parcelno vezavo); raba/mapping nespremenjena.
- KG: vozlišča/vezi/trditve NESPREMENJENE (2770/3072/622); samo `generated_at` žigi → sha 8f803952 → **9f856d28** (pini posodobljeni v 5 testnih datotekah).
- **Pokritost pt_rows osvežena na val 110 stanje**: 40/9/51 → **52 STABLE / 11 REVIEW / 37 REVIEW-CONFLICT** — v HEAD je bilo poročilo zastarelo (val 110 je posodobil PT register brez ponovnega teka pokritosti); števec preverjen direktno nad pt-n83/register.json.
- +16 varovalk (`tests/val111-ps-p3-reread.test.ts`); **1005 testov: 994 pass / 11 skip / 0 fail** · tsc čist · eslint čist.

## 6. Iskrenost (§4)

- **0 VLM klicev** — vse = agentov vid nad determinističnimi izrezki (zoom log v reading JSON).
- **TRANSCRIBED (p3 imena) = 0** — imenski pass odložen, prazna polja ostanejo prazna.
- Nič se ne dviguje: kultur dvomi, r3 zadnja števka, kapitalni formati, Uebersetzung prečrtanja — vse ODPRTO zapisano.

## 7. Naslednje

- val 112: p4–p16 re-read (pasovi že izdelani) + imenski pass p3 + F-PV-07 prestavitve p4–p16;
- VLM glasovi ob kvoti (45 izrezkov PZ → mikroprehod 8b + p142-t-kultur2 + 3. PT glas bp 98 + areal/lastnik p7);
- poln re-read p17–55 + p143; F-PV-03/F-PV-04; Dular 1972 + BM Metlika (izven peskovnika); register 26-0326 + 26-0379.
