# 118 · 103. val — ISSUE #72: vseh 8 preostalih poročil z javnimi prenosi prebranih v celoti (2014–2026)

**Datum:** 2026-09-29 · **Veja:** `feat/val103-issue72-porocila-preostanek` · **Baza:** main @ fd526b7 (val 102, PR #105)

## 1. Naloga

Val 102 je z javnimi eSDE prenosi prebral 6 prvih poročil raziskav na EID 1-10094. Register sloja 3692 (val 102) pa v polju `URL_POROCILO1` vpiše javne prenose za **24 od 26** raziskovalnih zapisov — val 103 jih prebere vseh preostalih **8** (2014–2026: kodo 13-0078 val 102 pripisal brez ID — popravek zapisan; 26-0326 je oddano v pregled, 26-0379 šele napredita raziskava).

**Metoda (0 VLM, 0 spletnega iskanja — 0 AI klicev):** deterministični `curl` na `ised.gov.si/api/javna/neavtoriziran/arheo/prvo_porocilo/files/{ID}/download` (ID-ji iz registra vala 102), `pdftotext -layout`, polno branje podatkovnih blokov, povzetkov, ugotovitev in sklepov. Artefakti: `val103/porocila/` (5 PDF komittanih + 8 TXT + `sha256-pdf.txt` z hashi tudi izbrisanih velikih PDF) + `summary.json`.

## 2. Poročila (8) — ključne ugotovitve

| Koda | Lokacija / objekt | Rezultat | Bistvo |
|---|---|---|---|
| **14-0456** (ARHAT/Tiran 2015) | Klepec, parc. 750/3 — drvarnica | **NEGATIVEN** | STJ 3 × 2 m do 1,25 m; pod rušo nasutje z novodobno opeko = umetna izravnava z materialom gradbene jame hiše 1998; ornica; sterilni rdeči aluvij. FK 1823–69: njiva |
| **15-0081** (ARHAT/Lavrinc 2015) | Agromelioracija Griblje–Cerkvišče; 828/1, 2680, 2353 (+ EŠD 19861 Dragoši) | **NEGATIVEN ×3** | Tri poljske poti (83 m, 280 m, 119 m) — brez najdb/struktur; ruša → ornica → ilovica. Dragoši = odkrito s pregledom OTK 2002 |
| **16-0021** (ARHAT/Brečič 2016) | Kanalizacija G7/G8, Dolnje Griblje | **Pozitiven omejeno** | 19 STJ 5 × 2 m; v Stj 5 koluvij (SE 009) z rimsko opeko, keramiko, brusom in **železovo žlindro** — material transportiran (»nedvomno naselbinskega izvora«); žlindra → »morda metalurška delavnica v bližini« (domneva). Jama banjaste oblike Stj 3 — namembnost neznana; vrtače Stj 5/19 |
| **16-0141** (ARHAT/Tiran 2016) | Kanalizacija G7.1/G7.2 (+ follow-up 2891) | **NEGATIVEN** | 6.6.–21.7.2016, ~270 m + 60 m na 2891 — izrecno zaradi rimskega materiala v Stj 5 raziskave 16-0021; samo sodobni material; nadzornika Bavec + Udovč |
| **19-0007** (ZVKDS CPA/Mulh 2019) | TK kabelska kanalizacija Griblje–Fučkovci–Adlešiči (+ EŠD 19861) | **Brez intaktnih plasti** | 6 ročnih + 1 strojna sonda + ob gradnji (jarek ~0,7 m); przg. lončenina v koluvijih (TS 2, TS 6) in ornici (TS 4); **poznosrednjeveška ustja** — sklede 13./14. stol. (Klokočovnik tip 3) in lonca 12.–14. / po Štularju 14.–16. stol. (I4a / 11A) v TS 3 + TS 5 — **prvi konkretno datirani SV ustji iz sond na najdišču**; **apnenica** na TS 1/parc. 752 (po pripovedi domačina še pred 40 leti žgali apno); reference: Sakara Sučević/Mason 2008, Mason 2009, Mason/Udovč 2009 (starejše raziskave na gradbenih parcelah v vasi) |
| **22-0169** (ZVKDS CPA/Černe 2022) | Brodarič, parc. 67/3 — faza 1 | **Brez struktur** | 6 ročnih sond; 440 najdb (premešano gradivo iz ruše, ornice, deponije): 209 przg. odlomkov + 11 ožgane gline + 6 kamnitih + 3 kosti; **neolitski ostenja z rdečim premazom** (analogije Drulovka I, Čatež–Sredno Polje); zgodnji SV (luknjičava keramika) + pozni SV/ZNV ustje pokrova; neskladje znotraj poročila: povzetek »v vseh šestih«, ugotovitve »v vseh petih« sond — zapisano. Historična analiza: Mason 2001/2006/2009, Mason et al 2006, Žorž/Leghissa 2011 (gasilski dom = eneolit + bron), pas ~700 m, naselbina ~8 ha. Faza 2 = 23-0070 |
| **25-0350** (AVGUSTA/Gruden 2025) | Novogradnja, parc. 15/4 | **POZITIVEN** | 8 TJ 2 × 1 m; **213 najdb / 2.271 g**: przg. 164 (82 %, bronasta doba), novi vek 34, recentno 3 — vse v koluviju, **brez vkopov**; največ TJ 1 (zahodno); roženčev odbitek (SE 003). **Tretja raziskava na isti parceli** (2019 TS 2; 2025; 2026) — trojna slika: raztresen material + jedro na terasi proti zahodu. Trajna hramba: **BM Metlika** |
| **25-0556** (STIK/Fras–Masaryk 2026) | NNO Elektro Ljubljana, Krasinec 668/1 | **NEGATIVEN** | 15.–16.4.2026; preprosta stratigrafija (ruša, nasutje, ornica, 2 paleotli, aluvij, glina); k. o. Krasinec — pošteno zapisano (EID 1-10094); trajna hramba **BM Metlika**; sosednja 21-0432 (668/2–4) |

## 3. Izrecno odkritje: pokritost registra

Register (val 102, `arheo-3692-10094.json`): **24/26 raziskav ima javni prenos** prvega poročila. Brez prenosa: **26-0326** (poročilo oddano v pregled) in **26-0379** (raziskava šele napredita). **Popravek vala 102:** 13-0078 **IMA** prenos (ID 26367) — summary vala 102 ga je zapisal brez ID.

**Za val 104 (10 poročil z javnimi prenosi, še neprebranih):** 17-0374 (27872), 17-0481 (27960), 17-0497 (28017), 19-0552 (28678), 13-0078 (26367), 20-0297 (28855), 21-0130 (29027), 20-0261 (28828), 21-0406 (29176), 23-0261 (43689).

## 4. Vgradnja (add-only, izključno MVG-083)

- **+7 virov:** `tiran-2015-klepec-750-3`, `lavrinc-2015-agromelioracija-cerkvisce`, `brecic-2016-kanalizacija-g7-g8`, `tiran-2016-kanalizacija-g7-1-g7-2`, `mulh-2019-tk-kabelska-kanalizacija`, `gruden-2025-novogradnja-15-4`, `fras-masaryk-2026-nno-krasinec-668-1` — vsak z opombo sl+en (»103. val — poročilo prebrano v celoti«), licenca javnega prenosa, URL eSDE.
- **Dopolnjen vir:** `zvkds-cerne-2022-brodaric` — 22-0169 vsebina zdaj **VERIFIED** (naslov po naslovnici 05-0033/2022-MiČ-2022-27, 6 sond, 440 najdb, neolitski premazi, brez struktur, neskladje pet/šest, faza 2 = 23-0070).
- **Zgodba sl+en:** nov odstavek (»103. val je register raziskav izčrpno prebral …«) + označevalec dopolnila pri stavku »Muzej išče: vsebinska poročila raziskovalnih kod (predvsem 2012–2014)«.
- **Izrecen prehod števcev:** +0 zapisov (114) / **+7 citati (634 → 641)** / **+7 identitet (510 → 517)** / deljenih 69 — readme-sync zeleno.
- ATLAS §22 NEIZMENJAN; veriga #100 §8 NEIZMENJANA (F0000212 = št. 73 INFERRED).

## 5. Poštenost (§11 invariante)

- Negativni rezultati (14-0456, 15-0081, 16-0141, 25-0556) zapisani **z enako težo** kot pozitivni.
- Sekundarne lege izrecno: rimski material 16-0021 (transportiran), przg. keramika 25-0350 (koluvij, brez vkopov), gradivo 22-0169 (premešano).
- Domneve prenašane kot domneve: »metalurška delavnica« (16-0021), apnenica po pripovedi domačina (19-0007).
- Neskladja zapisana, ne rešena: pet/šest sond (22-0169); letnica VS 48 (ostaja REVIEW iz vala 102).
- Popravek vala 102 izrecen (13-0078 ima prenos); 25-0556 na k. o. Krasinec — izrecno označeno.

## 6. QA

- **+21 varovalk** (`tests/val103-issue72-porocila-preostanek.test.ts`): identitete virov, izključnost MVG-083, dobesedni odlomki poročil (sl+en normalizirano), zgodba (sl+en), prehod števcev 114/641/517/69, artefakti + sha256, summary.json, docs (118 + KAZALO + README 157. sklop).
- Pini val 101 + val 102 posodobljeni: 634/510 → **641/517** (izrecna opomba o prehodu vala 103).
- `tsc --noEmit` čist · eslint na spremenjenih datotekah čist · celotna testa: pass/skip/fail zapisano v commit sporočilu.

## 7. Surovine

`research-griblje/val103/`:
- `porocila/` — 5 PDF komittanih (14-0456 4,0 MB, 15-0081 5,0 MB, 16-0021 1,9 MB, 16-0141 2,0 MB, 25-0556 5,6 MB) + 8 TXT (pdftotext -layout) + `sha256.txt` + `sha256-pdf.txt` (hashi vseh 8 PDF, tudi izbrisanih)
- 3 velika PDF hashirana in izbrisana (vzorec val 102): 19-0007 (32,4 MB, `ed442a54…`), 22-0169 (7,4 MB, `6cc78095…`), 25-0350 (14,5 MB, `011ed2b3…`)
- `summary.json` — polna struktura: porocila_prebrana ×8 z ključnimi ugotovitvami, odkritje_vala, vgradnja, brez_podvajanja, fairness, artefakti

## 8. Naslednje

1. **Val 104: 10 preostalih poročil z javnimi prenosi** (17-0374, 17-0481, 17-0497, 19-0552, 13-0078, 20-0297, 21-0130, 20-0261, 21-0406, 23-0261) — isto metodo; po njem je vsebinsko pokritost prvih poročil registra ZAKLJUČENA (24/24).
2. Dular 1972 vsebina (CONFLICT 1972/1973) — izven peskovnika.
3. BM Metlika (Vavpotič zbirka danes) — izven peskovnika.
4. 86b del 3 (p110–142, ~250 tile-ov) ob VLM kvoti.
