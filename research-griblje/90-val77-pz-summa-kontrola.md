# 90 — Val 77: PZ Summa kontrola (F-PZ-04) + §8 revizija 1830 (ISSUE #42 §4/§14 + §20)

**Status:** zaključen · **Branch:** `feat/val77-pz-summa-kontrola` · **Prejšnji val:** 76 (PR #64, main @ d9a9e6d)

## Kaj je bil cilj

Po worklogu vala 76 je bil naslednji korak: *»PZ celotni vrstični prepis + Summa kontrola
(F-PZ-04 → polni deleži 1830)«*. F-PZ-04 (val 75): vsota vrstic Endresultata p67
(1155 J 7183 K = 1.855.183 QKlft po val 75 branjem) ≠ zapisana Summa (1132 J 495 K =
1.811.695 QKlft), Δ 43.488 QKlft — OPEN z rešitvenimi potmi »p30 Zusammenstellung /
p63/p65 ležeče tabele«.

## Metoda (val 77, PREHOD 3)

- Izrezki p27/p30/p32/p63/p65/p67/p26/p6 pri 2×–12× (`pz-n83/crops-v77/`, 20+ PNG)
- 2 neodvisna prehoda na vseh spremenjenih celicah (projektno pravilo)
- Aritmetična vrata na vsaki odločitvi (po vzoru val 74/75)

## Bralne poti — kaj p30/p63/p65/p27/p26 DEJANSKO vsebujejo (val 75 hipoteze preverjene)

| Stran | Vsebina (val 77) | Površine? |
|---|---|---|
| p30 | "Resultate der benützten Behelfe" — naravni pridelki po klasah (Metzen/Centner/Eimer) | NE |
| p63 | Zusammenstellung B — Renta/Capitalwerth po Pachtverträgnih (dominikalne parcele) | NE |
| p65 | Zusammenstellung A — Culturfonds po kulturah + Pro-cento stolpec (Rein-Ertrag odstotki) | NE |
| p27 | Verhältnis des Holznutzens zum Ganzen (razmerje lesne paše) | NE |
| p26 | Verhältnisbestimmung (proza: lesna paša) | NE |
| p32 | Protokol: seštevek kultur 1–7 + podpisi (9. april 1830) — **BREZ Posten 8 Bauarea** | NE |

→ nobena izmed val 75 „rešitvenih poti" ne vsebuje površin. Prava rešitev je bila
**§8 tabela (p6) — rdeči stolpec »Zusammen«**, ki ga val 75 ni prebral.

## Najdba 1 — popravek aktivnih vrednosti p67 (2 prehoda pri 5×–7×)

| Vrstica | val 75 (napaka) | val 77 (pravilno) |
|---|---|---|
| Weiden mit Holznutzen | klafter **846** aktiven, "446[?]" prečrtan | klafter **558 AKTIVEN** nad prečrtanim **846** |
| Bauarea | klafter **1499[?]** aktiven, "1144[?]" prečrtan | klafter **1199 AKTIVEN** nad prečrtanim **1144** |
| Summa | 495 aktiven, "444[?]" prečrtan | 495 aktiven, **444** prečrtan (dvom razrešen) |

- **Nova vsota vrstic 1–8 (aktivne):** 1155 J 6595 K = **1.854.595 QKlft**
- **Summa (zapisana):** 1.811.695 QKlft → **Δ = 42.900 QKlft = 26 J 1500 K**
- F-PZ-08 posledica: 'Weiden mit Holznutzen' = **558 J 558 K = 893.558 QKlft ≈ 3,214 km²**
  (val 75: 896.646 / 3,224 — popravljeno)

## Najdba 2 — p67 Summa = ZASTALA VMESNA STOPNJA (F-PZ-04 EXPLAINED-V77)

Summa ne ustreza **niti prvotnim (prečrtanim) niti popravljenim (aktivnim) vrsticam** —
zastala pisarska stopnja, ki ni bila posodobljena skozi korekcijsko verigo (črni
popravki + rožnate diagonalne poteze p67). Logika zapisane Summe ni rekonstruirabilna
iz tabele — to je dokumentirana lastnost dokumenta, ne odprta podatkovna potreba.

## Najdba 3 — §8 (p6) RDEČI stolpec »Zusammen« = post-revizijske površine (Rektifikacija 1830)

| Kultura | črno (Einzeln) | rdeče (Zusammen) | status |
|---|---|---|---|
| Aecher | 414 J 962 K | 419 J 1382 K | REVIEW |
| Wiesen | 55 J 812 K | 55 J 167 K | REVIEW |
| Kleine Gärten | 3 J 615 K | 2 J 1166 K | REVIEW |
| Größere Gärten | – J 105 K | – J 1460 K | REVIEW |
| **Weingärten** | 7 J 42 K | **6 J 1059 K** | **TRANSCRIBED** (križno §7 p21 = F-PZ-06) |
| Hutweiden | 118 J 702 K | 121 J 1190 K | REVIEW |
| Weiden mit Holznutzen | 558 J 558 K | 557[?] J 1258 K | REVIEW (3/5 dvoumna; 557 usklajen s subtotalom 1150) |
| **subtotal (cultivirte)** | | **1150 J 1582 K** | REVIEW |
| Bauarea (unbenützt) | 1 J 1181 K prečrtano | **1 J 1199 K** | TRANSCRIBED (križno = p67 Posten 8) |
| voda (fließende Gründe) | | 68 J 1019 K | REVIEW (stopnje 689→68, 999→1019) |
| **TOTAL FLÄCHE** | 1227 J 1444 K prečrtano | **1220 J 1493 K** | **SOLID — = §1 EXACT** |

**Veriga:** subtotal + Bauarea + voda = 1.954.200 QKlft vs Total 1.953.493 →
**Δ 707 QKlft = 0,036 %** (OPEN-MICRO) — znotraj REVIEW negotovosti števk (subtotal K /
voda K) ali pisarska seštevalna odmika. **Sidro Total = §1 je neodvisno SOLID.**

## Odločitev poštenosti (§4/§14)

- Delež pašnikov 1830 **še naprej izrecno absent** (timeline absent_metrics) —
  razlog posodobljen: post-revizijske površine obstajajo, a števke vrstic so REVIEW.
- Nič se ne interpolira, nič se ne vsiljuje; dvoumne kurrentske števke (1/4, 3/5)
  ostajajo REVIEW dokler ni višje ločljivostnega skena (VAČ II. prikaz).

## Vgradnja

- `build-pz-1825.py` → val 77 / PASS 2; popravljeni ENDRESULTAT_ROWS (crossed +
  correction opombe) + **nov odsek `revision_1830_p6`** (7 vrstic + unbenutzt +
  subtotal + total + sum_check OPEN-MICRO); F-PZ-04 → EXPLAINED-V77; F-PZ-08 popravek
- **KG v1.8** (SRC-PZ coverage "val 75+77" + KG-F09 RESOLVED-V77; nodes/edges/claims
  NESPREMENJENI 3.309/3.569/622) → **nov kg_sha256 `a22ba7ed…`** (§22 pogodba:
  podatek spremenjen = story_id spremenjen)
- `build-story-graph.py` re-run (novi story_id-ji po pogodbi)
- `build-timeline-1825-1830.py` → val 77 (absent razlog EXPLAINED-V77 + vineyard
  opomba s §8 križno potrditvijo) · runtime kopije bajtno identične
- `build-coverage-report.py` → val 77 (PZ passes 3 + opomba; next_reads posodobljeni)
- story engine: gozd item 558 J 558 K ≈ 3,214 km² + next-reads besedilo
- i18n: `absentPastureShare` ×5 (sl/en/hr/de/it)

## QA

- tests/pz-konskripcija.test.ts: meta val 77, popravljeni Endresultat pinski (558/1199 +
  crossed), **F-PZ-04 EXPLAINED-V77 varovalka** (Δ 42.900 neodvisno v TS) +
  **nova §8 varovalka** (sidro = §1 EXACT, veriga Δ 707, Weingärten TRANSCRIBED,
  6 × REVIEW) + KG v1.8 pinski → **489/489 testov**
- tests/atlas-timeline.test.ts (val 77 + absent razlog) · coverage/story-graph/georef/
  evidence-api/a01/pv pinski na v1.8/77 · api-smoke +1 (absent razlog) → **102/102**
- tsc čist · lint čist · verify-i18n **1074 × 5** zeleno
- e2e (agent-browser): 4. zavihek ČAS 1830 z novim absent besedilom ✓ · EXPLORE
  regresija ✓ · mobilno 390 px brez preliva ✓ · lepljiva noga ✓ · konzola 0 napak

## Naslednje

1. §8 rdeče števke re-digitation @višja ločljivost (VAČ II. prikaz) → polni deleži 1830
2. PZ celotni vrstični prepis (66/71 strani brez strukturnega branja)
3. PS p56–143 vrstični prepis (F-PV-03 vinogradi) ob VAČ kvoti
4. PT p7 @300dpi (F-GEO-03/KG-F01)
5. izven peskovnika: šolski list / SA Podzemelj / SI AS 749 / Zucchelli
