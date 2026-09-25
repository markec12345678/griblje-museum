# 68 — 56. val: VAČ preseljen na vac.sjas.gov.si · PS N83 (143 strani) prenešen · polne ločljivosti (P2-E15) · p26/p42 rešena (P3-E12)

**Datum:** 25. 9. 2026 · **Issue:** #41 · **Naloge:** uporabnikova direkcija (»poreberi issue na githubu« + vsebinska faza)

---

## A — PRELOM: arhiv.si je NXDOMAIN, VAČ je preseljen

Preverjeno z dvema javnima DNS reševalnikoma (Cloudflare + Google DoH): **arhiv.si = NXDOMAIN globalno**
(domena je izginila iz .si cone — prejšnja predpostavka »peskovnik blokira« je bila napačna).

Web-search je pokazal **novi naslov portala: `https://vac.sjas.gov.si`** (državna domena, isti
Vecendi sistem). Vsi endpointi delujejo (samo TLS chain gov.si zahteva `-k` v peskovniku):

| Endpoint | Raba |
|---|---|
| `/vac/iiif/pdf-manifest?uodid=X&docid=Y` | IIIF Presentation manifest (število strani, dimenzije) |
| `/vac/util/pdfPageImage?uodid=X&docid=Y&page=N` | slika strani (JPEG) |
| `/vac/util/tifyPdfDownload?uodid=X&docid=Y` | cel PDF |

Identifikatorji N83: **PS = uodid 373415 / docid 41780** · **PT = 373416 / 41781** · **PUA = 373417 / 41782**.

## B — PS N83: TRETJI REGISTER, 143 strani, prenešen in identificiran

- **N083PS.pdf** (manifest: 143 strani, 56.2 MB, LuraDocument v2.16, 2006) — **še nikoli prenešen**.
- Prenos: **143/143 strani** prek `pdfPageImage` (275–335 kB JPEG, do 1310×1029) — vsaka stran
  kontrolirana (EOF `ff d9` + PIL verify) → `raw-web-val56-2026-10/n083ps-pages/` + `download-log.json`.
- Cel PDF v ozadju še teče (transfer ~85 kB/s, brez Range podpore) — kanoničen vir so strani JPEG.
- **Identifikacija (VLM, p1 + p2):** naslov **»Protocol / Der Grund-Parcellen / der / Gemeinde / „GRUBLE“«**
  — protokol gruntovnih parcel občine Griblje. Glave stolpcev (p2): **N.º. · Kultur Gattung ·
  Flurbezirk Zone · Quadrat Meter · Rente jährlicher Ertrag (Fl. Kr. Pf.) · Capital Werth (Kr.) · Anmerkung**
  — gaitveno-davčna struktura parcel. → popolna transkripcija = ločen prihodnji val (issue #41/A).

## C — Polne ločljivosti (P2-E15): PRELOM za bp 98

Metoda: `pymupdf` ekstrakcija vgrajenih skenov iz N083PUA.pdf / N083PT.pdf (**nativen ~1390×2145 PUA /
2713×2107 PT — do 6× stare predogledne ločljivosti**) + pasovni izrezi 300 dpi; 2 neodvisni bralni prehoda.

**PRELOM — PUA p47, no. 95 (Zollamt):** opomba **»B. P. 98.« OBSTAJA** (v nadaljevalni vrstici vpisa;
2× branja strinjajo: native + pasovni). Stara branja (667 px) so jo izpustila → ravno zato je val 54
vezavo bp 98 označil NEPODPRTA. Skupaj s **PT bp 98 »A. Zollamt«** (p7 nativno) je lastniška vezava
**bp 98 = k.k. Zollamt zdaj VERIFIED-2x**. Hišni številki ostajata konfliktni: **h.70 (PUA) vs h.20 (PT)**
→ hišna vezava ostaja REVIEW-CONFLICT. Zemljevid posodobljen (`cadastre-a01.json`).

Preostale točke (vse z nativnimi prepisi v `pt-n83/reconciliation.json → val56`):

- **PUA p18 no. 35:** »b. P. 56. 38.« znak-po-znak POTRJENO → **bp 86 ostaja REVIEW-CONFLICT (utemeljen)**.
- **PUA p30 no. 59:** »19. Pp.« POTRJENO → **bp 92 ostaja REVIEW (utemeljen)**.
- **PT p4 24/25 → h.1** potrjeno (skladno z val 53; PUA »B.P. ca. 10« kompatibilno).
- **PUA p6:** opomba »B.P. 90.« obstaja (3. potrditev), ampak vezava na Nro. 7 vs 8 OSTAJA NEUSKLAJENA
  (pomik vrstic med prehodi; h.43/h.63) → bp 90 ostaja REVIEW. Nič rešeno z ugibanjem.
- **PT p5 46-48/76:** 3-kratno nesoglasje (63/65/62; 68/51/28 — Kurrent 2↔3↔5↔6) → ostaja REVIEW-CONFLICT.

## D — p26/p42 (P3-E12) + p49

- **p26 + p42: REŠENO.** PDF-native strani so **popolne** (1391×2145 / 1400×2151): p26 = glava +
  začetek vpisa 52, p42 = vpisa **85/86** (aritmetika val 48 potrjena). Stara okrženost je bila
  transfer-nivojska, ne vsebinska.
- **p49:** podpisni blok; **»um 10. Januar 1825«** korooborira val 51 »10. Jänner 1825« →
  **mesec POTRJEN (2 vira)**; viden še »Bürgermeister«.

## E — A01–A05 (P2-E13 Rim / P2-E14 georef)

Obstoječi rastri (val 42: A01 2826×2273 …) so **že maksimalna IIIF raven** portala (1 canvas, sejsko
vezan raster). P2-E13/E14 sta torej **bralni** nalogi (zoom kontrola kvadrantov), ne prenosni.

## F — Surovine in higiena

- `raw-web-val56-2026-10/`: n083ps-pages/ (143 JPEG + download-log.json), N083PT.pdf (2.9 MB, cel),
  N083PUA.pdf (6.9 MB, cel), fullres-extracts/ (nativen JPEG za p4-7/18/26/30/39/42/47/49 PUA + p4/5/7 PT).
- Gitignore: 300 dpi PNG + crops (regenerabilna iz PDF), delni N083PS.pdf.
- OCR besedilni sloji: server vrne prazne (`pdf-raw-text` = newlines) — ni uporabno.

## G — Ostaja (issue #41)

PS popolna transkripcija (143 strani) · bp 90 vezava Nro. 7/8 · PT p5 Kurrent · identiteta
»Merial« (Zollamt) · Zucchelli + zaključni seznami · P2-E13/E14 bralni prehodi · izven peskovnika:
šolski list [4118864], SA Podzemelj, SI AS 749.
