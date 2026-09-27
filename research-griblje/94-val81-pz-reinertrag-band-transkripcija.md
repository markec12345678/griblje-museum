# 94 — 81. val: PZ p43–47 Reinertrag — band-transkripcija @nativno (F-PZ-12 RESOLVED)

**Datum:** 26. 9. 2026 · **Issue:** #42 §4/§14 · **Metoda:** PREHOD 7 — band-metoda (40 pasov + 14 x3 zoomov, 3 neodvisna branja)

---

## A — Metoda: band-metoda @nativno

Izhodišče (val 75/80): celostranski VLM prepis p43–47 **ZAVRNJEN** (halucinacije na gostem Kurrentu @~150 dpi);
pot »VAČ II @300 dpi« **NE OBSTAJA** (F-PZ-17); 8-pasovni test p43 (val 80) pokazal, da so posamezni pasovi
nativnih skenov čitljivi → celotni vrstični prepis = izvedljiv prek pasov.

**Izvedba (PREHOD 7, surovine `raw-web-val81-2026-09/`):**

- **40 pasov** = 5 strani (p43–47) × 8 pasov (h=328, korak=298, 30 px preklop — shema val 80 testa);
  vsak pas v 2 različici: `raw` (nativni piksli) + `norm` (normaliziran kontrast) → `crops-v81/` (95 datotek z 15 zoomi)
- **14 x3 zoom re-readov** dvomljivih regij (`zoom-manifest.json`: Ertrag stolpci, Kurse tabele, Düngung, naslovi, podpisi)
- **54 VLM klicev** (40 prehod A norm + 14 prehod R x3) — `vlm/` 54 JSON + 54 raw izpisov; skripta `bandread-v81.mts`
- **direkten odtis avtorja** (Read orodje na nativih) = NEODVISEN 1. bralec — 40 pasov prebranih PRED VLM

**Pravilo vgradnje (§4):** vgrajeno samo **soglasje ≥ 2 neodvisna branja**; kolizije odločene 2:1 ali
direktnim odtisom na x3/x4 izrezku; dvoumne enote/črke = `[?]` / REVIEW.

## B — Rezultat: struktura p43–47 KORIGIRANA vs val 75

Val 75 je p43–47 strukturno označil kot per-parcelne Reinertragstabelle — **NAPAČNO**.
Dejanska vsebina (Kultur-Beschreibung št. 2) = **klasni Natural-Ertrag koeficienti** (na 1 Joch):

| Stran | val 75 (napačno) | val 81 (korigirano) |
|---|---|---|
| p43 | I. Classe Reinertragstabelle (parcele) | **Ackerland mit 2 Classen — 1te Classe**: Wirthschafts Kurse (9-jähriger Wechsel; 3 skupine Bestellung × kurse 1–9) + Düngung auf 1 Joch (**3 Fuder; 90 / 120**) + Natural Ertrag pro Joch (1–9: **26 / 12 / 50 / 12 / 12 / [10] / 15 / 80 / 12 / [10] / 15** Metzen|Centner) |
| p44 | II. Classe Reinertragstabelle | **IIte Classe**: Kurse »Gleiche Kurs als in Iten Acker Classen« (tabela 1\|1); Düngung »wie in I[te]n«; Natural Ertrag **z RAZPONI** (18–20 / 9–10 / 30–40 / 9–10 / 9–10 / [7–8] / 10–12 / **65–70** / 9–10 / [7–8] / 10–12) |
| p45 | IIa. Classe (2 parcele N°96/311) | **IIIte Classe** (NE »IIa«!): Kurse »Gleich Kurs den I= et II= Ackerclassen«; Ertrag (15 / 8 / 30 / 8 / 8 / [6] / 9 / **60** / 8 / [6] / 9) — **CEL LIST X PREČRTAN** + Anmerkung |
| p46 | III. Classe + KG/WG/HW Ertrags Classe | **Wiesen mit 2 Classen** (I: »zusammen 14« [enota Fth\|fl REVIEW]; II: »im Ganzen **8 3/8**«) + Kleine Gärten (+ prečrtan vstavek »große Gemüse=Gärten«) + Weingärten (**9 [Eimer?] / Wein 12**) + Hutweiden (**2 3/8**) |
| p47 | Wald und Ödland? Erste Classe | **Huthweiden mit [supra: ganz=\|Holz=] Nutznießung und Niederwald — Einzige Classe** — naslov + uvodna proza **X PREČRTANA** + Actum ut supra (16. julij 1829[?]) + podpisi: Kappas + 6 prič (imena REVIEW) |

**Križna kontrola:** Weingärten 12 Eimer (p46) = p30 Zusammenstellung (val 77) — SROGLASJE.
Prečrtava p47 NE vpliva na §8/p67 (Weiden mit Holznutzen 557 J ostaja kultura v Endresultatu) — opuščen osnutek odseka.

## C — Odločene kolizije (soglasje ≥ 2 neodvisna branja)

| Celica | Varianti | Odločitev |
|---|---|---|
| p43 item 2 (Hafer) | 12 vs 72 | **12** — odtis + prehod R (2:1 nad A) |
| p43 Kart#2 | 10 vs 20 | **10** — odtis + R |
| p45 item 1 (Felder mit Mais) | 15 vs 114/19 | **15** — direkten odtis na x3 |
| p45 item 7 (Brandstücke) | 60 vs 6 | **60** — odtis + R (2:1) |
| p45 Kart#1 | 6 vs 8 | **6** — direkten odtis na x4 |
| p46 Wiesen II lomec | 8 3/8 vs 8 2/5 | **8 3/8** — odtis x3 + R; števec 3-vs-5 ostaja REVIEW |

**Poštenost branja:** številke = soglasje ≥ 2; proza = delno REVIEW (Kurrent halucinacije ostajajo
na besedilu, ne na številkah — dokumentirano v `vlm/*.raw`). Vrednosti NISO per-parcelne trditve.

## D — Vpliv

- **F-PZ-12: RESOLVED** — findings 17 (RESOLVED 11 · PARTIAL 1 · REVIEW 3 · OPEN 1 · TO_VERIFY 1)
- p43–47 = klasni Ertrag koeficienti → **per-parcelne trditve ostajajo NIČ (§4)**; I1–I6 / KG v1.8 / timeline / deleži NESPREMENJENI (§22)
- F-PZ-04 ostaja OPEN — zunanji Rektifikacijski protokol = edina preostala pot (izven peskovnika)
- structure_map p43–47 popravljene; coverage val 81 (PZ passes 7); next_reads: PS p56–143 na 1. mesto

## E — QA

- tests/pz-konskripcija.test.ts: val-81 varovalke (reinertrag_p43_47 struktura + tip, kolizije,
  F-PZ-12 RESOLVED, prehod 7, pine val 81) → **509/509** · api-smoke **101/101** · tsc/lint čisti
- verify-i18n **1074×5** · e2e: naslovnica + ČAS 1830 + 390 px + noga čisti (posnetki raw-web-val81-2026-09/)
