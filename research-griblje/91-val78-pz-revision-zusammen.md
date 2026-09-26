# 91 — Val 78: PZ §8 rdeči stolpec »Zusammen« strukturiran + verifikacija rešitvenih poti (ISSUE #42 §4/§14)

**Status:** zaključen · **Branch:** `feat/val78-pz-revision-zusammen` · **Prejšnji val:** 77 (PR #65, main @ d0ca9d5)

## Kontekst: neodvisni vzporedni prehod

Val 77 sta v istem obdobju izdelali **dve neodvisni seji**:
- **PR #65 (merge 9bfe982)** — odločilni re-read p67 + §8 z vrati I4–I6: Summa = **1152 J 495 K**
  (korekcija 1132→1152, kurrentska 3↔5), K-stolpec se zapira EXACT (495=495), F-PZ-04 ožjan na
  **3 J = 4.800 QKlft** (ostaja OPEN — pisarjevska nekonsistentnost Joch stolpca), Wiesen I = 5 J
  izpeljano (gated I5), deleži rabe 1830 (F-PZ-13) izpeljani iz črnih vrednosti.
- **PR #66 (ZAPRTO, ta veja)** — neodvisen 2-prehodni re-read istih celic: potrdil WmH 558/846 in
  Bauarea 1199/1144, a napačno prebral Summo kot 1132 (»zastala stopnja« — ovrženo z vrati #65).

Po vzoru 2-prehodne metodologije je **val 78 = tretji prehod**, ki ohrani vrata #65 in vgradi
edinstvene najdbe neodvisnega prehoda.

## Kaj val 78 vgrajuje (edinstvene najdbe, ki jih PR #65 nima)

### 1. §8 (p6) RDEČI stolpec »Zusammen« = post-revizijske površine — strukturiran (F-PZ-15)

| Kultura | črno (Einzeln, I4 EXACT) | rdeče (Zusammen) | status |
|---|---|---|---|
| Aecher | 414 J 962 K | 419 J 1382 K | REVIEW |
| Wiesen | 45 J 812 K | 45[?] J 167 K | REVIEW (usklajeno s korekcijo 55→45) |
| Kleine Gärten | 3 J 615 K | 2 J 1166 K | REVIEW |
| Größere Gärten | – J 405 K | – J 1460 K | REVIEW |
| **Weingärten** | 7 J 42 K | **6 J 1059 K** | **TRANSCRIBED** (križno §7 p21 = F-PZ-06) |
| Huthweiden | 118 J 702 K | 121 J 1190 K | REVIEW |
| Hw. mit Holznutzen | 558 J 558 K | 557[?] J 1258 K | REVIEW (3/5 dvoumna; #65 videl 354) |
| **subtotal (1–7)** | — | **1150 J 1582 K** | REVIEW |
| Bauarea | 1 J 1199 K | **1 J 1199 K** | TRANSCRIBED (križno p67 = F-PZ-11) |
| unbenützbar/voda | 71 J 998 K (izpeljano I6) | 68 J 1019 K | REVIEW (= F-PZ-10 več-vrednostna celica) |
| **TOTAL FLÄCHE** | **1220 J 1493 K** | **1220 J 1493 K** | **SOLID — = §1 EXACT** |

**Veriga (rdeča):** subtotal + Bauarea + voda = 1.954.200 vs Total 1.953.493 → **Δ 707 QKlft =
0,036 % (OPEN-MICRO)** — znotraj REVIEW negotovosti rdečih števk. Črni stolpec (I4–I6) se zapira
EXACT → **uradni deleži 1830 ostajajo iz F-PZ-13; rdeči stolpec NI podlaga za deleže** (števke
čakajo re-digitation @višjo ločljivost — VAČ II. prikaz).

### 2. Rešitvene poti val 75 dokončno ovržene (F-PZ-14)

Neodvisni prehod je prebral: p26 (Verhältnisbestimmung — proza), p27 (Holznutzen razmerje),
p30 (Resultate der benützten Behelfe — naravni pridelki: Metzen/Centner/Eimer), p32 (protokol:
seštevek **7 kultur brez Bauarea** + podpisi, 9. aprila 1830), p63 (Zusammenstellung B —
Renta/Capitalwerth po Pachtverträgnih), p65 (Zusammenstellung A — Culturfonds + Pro-cento).
**Nobena tabela ne vsebuje površin po kulturah** — hipoteza val 75 »možne rešitve: p30/p63/p65«
dokončno ovržena; rešitev F-PZ-04 ostaja pri vrati I4–I6 (val 77).

## Vgradnja

- `build-pz-1825.py` → val 78 / PASS 3: nov top-level odsek `revision_1830_zusammen`
  (7 vrstic + subtotal + unbenutzt_red + total_flaeche SOLID + sum_check OPEN-MICRO);
  `zusammen_column_semantics` → STRUCTURED-V78 ( kazalec); +F-PZ-14 (RESOLVED) +F-PZ-15 (REVIEW);
  I1–I6 NESPREMENJENI; deleži F-PZ-13 NESPREMENJENI
- `build-coverage-report.py` → val 78 (PZ passes 4 + opomba val 75+77+78; next_reads posodobljeni);
  runtime kopija bajtno identična
- **KG v1.8 NESPREMENJEN** (kg_sha256 20ec8a0a — nič ne slovi, §22 pogodba: nič podatkovnih
  sprememb na KG ravni); timeline NESPREMENJEN (val 77 stanje); i18n NESPREMENJENA
- Dokazni izrezki: `pz-n83/crops-v78/` (33 PNG, 2 prehoda: full pages + 5×–7× celice + 6×–12× rdeči stolpec)

## QA

- tests/pz-konskripcija.test.ts: meta val 78 PASS 3 + **nova varovalka §8 rdeči stolpec**
  (7 vrstic, edina TRANSCRIBED Weingärten 10659 QKlft, sidro Total = 1.953.493 EXACT, veriga
  1.954.200, Δ 707, OPEN-MICRO, 6 × REVIEW, Bauarea 1199 križno) + F-PZ-14/15 statusi
  → **496/496 testov** · api-smoke **101/101** · tsc čist · lint čist · verify-i18n **1074×5**
- e2e: naslovnica 0 konzolnih napak; coverage API val 78 s sha 20ec8a0a ✓
- e2e timelina/EXPLORE: nespremenjeno (val 77 stanje — nič UI sprememb v tem valu)

## Naslednje

1. §8 rdeče števke re-digitation @višja ločljivost (VAČ II. prikaz) — F-PZ-15 REVIEW → potencialna
   ločljiva post-revizijska zgodba (Rektifikacija 1830)
2. PZ celotni vrstični prepis (66/71 strani; F-PZ-12 — brez VLM, čaka VAČ IIIF @300 dpi)
3. PS p56–143 vrstični prepis (F-PV-03) ob VAČ kvoti
4. PT p7 @300dpi (F-GEO-03/KG-F01)
5. izven peskovnika: šolski list / SA Podzemelj / SI AS 749 / Zucchelli
