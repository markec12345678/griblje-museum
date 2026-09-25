# 67 · VAL 54 — FAZA 2: USKLAJEVANJE PUA ↔ PT ↔ ZEMLJEVID A01

*Digitalni vaški muzej Griblje · 108. sklop · 54. val raziskave · 2026-09-25*
*Naročilo: »najprej vse poberi, potem usklajujemo« — val 53 je dokončal POBRANJE, val 54 = USKLAJEVANje. Vhod: pt-n83/register.json (100 vrstic), pua-n83/register.json (94 vpisov), cadastre-a01.json (11 vezav lastnikov).*

---

## A. Glavne najdbe (F1–F8)

### F1 · SISTEMSKO: PT lastniška imena so NEZANESLJIVA
Klasifikacija 40 STABLE povezav bp→h proti PUA lastnikom istih hiš: **0 imenskih soglasij, 39 nesoglasij, 1 prazno**. To ni naključje — isti bp med prehodi dobi **3–4 različna imena** (bp 82–84: »Hunziker Marcel« / »Hraupf Georg« / »Hans Georg« / »Krauß Georg«; bp 94: »Feiner Wolfi« / »Georg Mache[?]«). Vzrok: slaba kakovost PT skena (36–300 kB JPEG) — **tiskane številke se berejo stabilno, rokopisna imena ne**.
**Posledica:** PUA ostaja **edina lastniška avtoriteta**; PT je uporaben **izključno strukturno** (vezava bp↔h). Nobeno PT ime ni uporabljeno za korooboracijo ali vgradnjo.

### F2 · POMIK VRSTIC v p7-repu
Zoom branje p7 (val 53) ima **+1 pomik vrstic** v repu 90–97 (90→h44 namesto h43, 92→h44 namesto h41 …). Večinski glasovi razrešijo: val 41 + val 52 + PUA opombe soglasno podpirajo vzorec 90→43, 92→41, 93/94→40, 96→38.

### F3 · ZEMLJEVID: vezava bp 98 »k.k. Zollamt« je NEPODPRTA (popravljeno)
- PUA opomba »B.P. 98« **ne obstaja**: no. 7 (h.70, **Grübler Maria Leutnerin**) ima opombo **»B.P. 90.«**; Zollamt (no. 95, p47) ima **prazno** opombo.
- PT: bp 98 → h.20 / h.39 / h.50 (nikoli h.70); bp 90 → h.43/44 (nikoli h.70).
- Verjetna geneza: val 52 je **prebral 90 kot 98** (Kurrent 0↔8) in povezal s carinskim uradom (oba »h.70«).
- **Popravek v zemljevidu:** bp 98 owner_status VERIFIED-2x → **REVIEW-CONFLICT**, link_source popravljen z resnico. Pika ostane (pozicija stavbe je prava), lastniška vezava pa je flagirana kot nepodprta.

### F4 · Kurrent 3↔5: PT »h.63« za bp 46/48
PT STABLE: 46→h.63, 48→h.63 (2×); PUA no. 40 (h.65): »B. P. 46. 48.« + zoom 47→65 → **63 je verjetno napačno branje 65**. Zemljevidne vezavi 46→h.65 ostajata (opomba podpira).

### F5 · Kurrent 2↔3: PUA h.29 opomba »B.P. 95. 97.«
PT: 95→h.39/40, 97→h.35/38. Če je opomba pravilna, so PT »39« branja verjetno »29« (2↔3). Kontrola v polni ločljivosti.

### F6 · bp 76 KONFLIKT (spuščeno)
PT 76→h.51 (2× STABLE) vs PUA opomba h.28 (no. 79: »B.P. 76. 79. 81/82. 93/84.«). Zemljevid: VERIFIED-2x → **REVIEW-CONFLICT**.

### F7 · bp 86 ŠIBKO (spuščeno)
Opomba no. 35 (h.36): »b. P. 56. 38.« — številke **ne vsebujejo 86**; PT 86→h.37 (konflikt z h.36). Zemljevid: VERIFIED-2x → **REVIEW-CONFLICT**.

### F8 · NAJMOČNEJŠA VEZ: bp 94 → h.40
**3 neodvisni viri** (val 41 + val 52 + val 53 obe branji) + PUA no. 38 (Pfarrer Rupert Sautter). Zemljevid: REVIEW → **VERIFIED-2x**.

---

## B. Revizija vseh 11 zemljevidnih vezav

| bp | lastnik (PUA) | verdikt | dokaz |
|---|---|---|---|
| 46 | Widhann Georg (h.65) | ✓ OK | opomba no. 40 »B. P. 46. 48.« |
| 49 | Widhann Georg (h.66) | ✓ OK + **popravljen pageRef 6→21** | opomba no. 41 »B. P. 49. 50.« (p21) |
| 73 | Penzig (h.60) | ✓ OK (REVIEW-CONFLICT) | opomba no. 61 »B.P. 73.«; PT 74→h.60 — sosednja vrstica |
| 76 | Brincz Maria (h.28) | ⚠ spuščen na REVIEW-CONFLICT | F6 |
| 85 | Krischan Peter (h.37) | ✓ OK | PT dual + opomba no. 36 »P.P. 85.« (B↔P) |
| 86 | Krischan Marla (h.36) | ⚠ spuščen na REVIEW-CONFLICT | F7 |
| 89 | Husitsch Maria (h.44) | ✓ OK (REVIEW) | PT dual 87/89/91→h.44; PUA no. 19 (p11) |
| 92 | Pöchinger Georg (h.41) | ⚠ spuščen na REVIEW | opomba nečitljiva (»19. Pp.«); PT 41/44 pomik |
| 93 | Sautter (h.40) | ✓ OK (REVIEW) | PT dual; zoom 41 (pomik) |
| 94 | Sautter (h.40) | ⬆ nadgrajen na VERIFIED-2x | F8 |
| 98 | k.k. Zollamt | ⚠ NEPODPRTO — REVIEW-CONFLICT | F3 |

**Rezultat:** lastniške pripisane osebe so **vse pravilne** po PUA registru; popravljenih je **5 statusov vezav** (98, 86, 76 spuščeni; 92 spuščen; 94 nadgrajen) + 1 pageRef (49).

---

## C. KAJ NI SPREMENJENO (zavestno)

- **PUA register** (val 51) — nespremenjen; njegove opombe so sidro revizije.
- **PT register** (val 53) — nespremenjen; branja ostajajo, kar so (njihova interpretacija je tu).
- **Zemljevid pike/positione** — nespremenjene (A01 ekstrakcija je bila neodvisna in stoji).
- **Noben konflikt ni »rešen« z ugibanjem** — vsi izpostavljeni za polno ločljivost.

## D. Odprto za polno ločljivost (ko arhiv.si deluje)

1. PUA p6 (no. 7 »B.P. 90.«) + p47 (Zollamt no. 95) — rešita bp 90/98.
2. PT p5 vrstice 46–48 (63 vs 65) in 76 (51 vs 28).
3. PT p4 vrstice 24/25 (h.1 3×) vs PUA h.1 opomba »B.P. ca. 10.«.
4. PUA p18 (no. 35 »b. P. 56. 38.«) — bp 86.
5. PUA p30 (no. 59 »19. Pp.«) — bp 92.
6. PT p7 rep 90–100 (pomik vrstic + Zollamt).

## E. Vgradnja

- **cadastre-a01.json**: 5 statusov vezav popravljeno (98/86/76 → REVIEW-CONFLICT, 92 → REVIEW, 94 → VERIFIED-2x), pageRef 49 (6→21), 6× link_source obogatenih z val 54 dokazi. UI koda nespremenjena (badge logika že podpira REVIEW-CONFLICT/REVIEW/VERIFIED-2x).
- **+0 virov, +0 trditev** (popravki statusov, ne nove trditve).
- **Kuratorska vrsta**: P3-E14 noveliziran (F1–F8) + **novo P2-E15** (kontrola 6 točk v polni ločljivosti) → **138 vprašanj**.
- Stanje zbirke: **113 zapisov, 589 virov, 469 identitet — nespremenjeno.**

## F. QA

`tests/pt-n83-register.test.ts` razširjen (describe »val 54 usklajevanje«): reconciliation.json struktura + 8 glavnih najdb; zemljevidni varovalki — bp 98 in bp 86 NE smeta biti VERIFIED-2x (regresijsko varstvo popravljenih statusov).

## G. Surovine

- `research-griblje/pt-n83/reconciliation.json` (strojno: F1–F8 + revizija 11 vezav + open-for-full-res)
- vhodi: pt-n83/register.json, pua-n83/register.json, src/data/cadastre-a01.json (vsi že v repozitoriju)
