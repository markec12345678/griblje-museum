# 92 — Val 79: PZ Rektifikacija p35–42 — OPISNO-KVALITATIVEN odsek (F-PZ-16)

- **ISSUE**: #42 §4/§14 — PZ N83 PASS 5
- **Vir**: VAČ `vac.sjas.gov.si` — uodid 373419 / docid 41784 (71 strani, na disku)
- **Naloga** (worklog Task 39, naslednje 1. iz Task 38): »Rektifikacija p35–40 per-parcelna kontrola (F-PZ-04: kje so 'izgubljeni' 3 Joch)«
- **Rezultat**: **REŠITVENA POT ZAPRETA** — per-parcelne numerične korekcije NE obstajajo v PZ [373419]; odsek je opisna Kultur-Beschreibung z Muster-parcelami (vzorci kakovosti). F-PZ-04 ostaja OPEN z izčrpanimi peskovniškimi potmi v PZ.

## Metoda (2-prehodna, kot val 77/78)

1. **Render**: p35–p42 (+ p48) nativni skeni @2x (pymupdf) → `pz-n83/crops-v79/pXX-full-2x.png`
2. **Direkten odtis** avtorja transkripcije na 2x straneh + 10 izrezkov linij @4x (`crops-v79/pXX-*.png`)
3. **VLM prehod A** (strukturni): 6 celotnih strani @2x — vsaka poroča OPISNO prozo, nobena per-parcelnih tabel
4. **VLM prehod B** (številke): 9 izrezkov @4x — potrdil nezanesljivost VLM na tem Kurrentu (halucinacije: »1 Julj 1882« namesto »1 Joch 1382«; »188/873« namesto »1288/2875«) — isti vzorec kot F-PZ-12

## Struktura odseka (odločilni re-read)

| Strani | Vsebina |
|---|---|
| p35 | **I. Aacker** — Erste Classen (prst/vlaga/položaj; Kameniza; brez površin); Muster № 30 = 1 J 1382 |
| p36 | Acker Zweyte/Dritte Classe (+ rdeči robni zapis »Dritte Classe«); Muster № 594 = 1 J 531, № 1099 = 1 J 700 |
| p37 | **II. Wiesen** — Erste/Zweite Classen (redki kosi; boljši ob Kolpi); Muster № 438 = 1 J 896, № 2451 = 1 J 1515 |
| p38 | **III. Kleine Gärten / IV. Obere Gärten / VI. Holzgärten** — opisno; Muster № 2491 = 1 J 260 |
| p39 | weiden nadaljevanje — meje/lokalitete; Muster № 1288 (nad prečrtano 2875) = 1 J 882\|883 |
| p40 | Zaključni protokol: žirija (Georg Kappas Gemeindevorsteher + 9) + k.k. Schätzungskommission (Aladar Manrera[?]) + pečat + »vierte Nachtag« |
| p41 | Nachsetzung (№ 1980 / № 88; 12. avg. 1832[?]) + Vergleich (4. jun. 1832[?]) — 1832 dogodki |
| p42 | **Einvernehmungs-Protocoll** 6. dec. 1832, Kreis Neustadtl / Schätzungsdistrict XI / Steuerbezirk Krupp — Natural-Brutto-Ertrag (popravek val-75 oznake »EINWANDS-PROTOKOLL«) |
| p48 | Einvernehmungs-Protocoll 5. aprila 1830 (rožnat papir) — proza, brez tabel |

## Muster-parcele (edina numerika v odseku — vse REVIEW)

| Str. | Klas | № (eye) | Alt (VLM) | Površina | Lastnik[?] | 1825 PUA | 1825 PS |
|---|---|---|---|---|---|---|---|
| p35 | Acker I | 30 | — | 1 J 1382 | Mursko Fe[?] | ✓ | ✓ |
| p36 | Acker II | 594 | — | 1 J 531 | Georg Straup[?] | ✓ | — |
| p36 | Acker III | 1099 | — | 1 J 700 | Martin Bering[?] | ✓ | — |
| p37 | Wiesen I | 438 | 738 | 1 J 896 | Martin[?] Brinar[?] | — | ✓ |
| p37 | Wiesen II | 2451 | — | 1 J 1515 | Martin Blaznik[?] | — | — |
| p38 | Obere Gärten | 2491 | 249/1 | 1 J 260 | Martin Kabatschnig[?] | — | — |
| p39 | Weiden | 1288 | 2875 (prečrtana) | 1 J 882\|883 | Ferencz Marusch[?] | — | — |

**RENUMERACIJA**: 3/7 (2451, 2491, 1288; prečrtana 2875) ne obstaja v 1825 PUA/PS registru → Muster-parcele citirajo novo (rektifikacijsko) numeracijo po Rektifikaciji 1830; 30/594/1099 obsegovno sovpadajo; 438 = PS-only (podpira eye-branje za Wiesen). Per-parcelna vezava 1825→1830 = UNKNOWN (zahteva zunanji Rektifikacijski protokol).

Vzorec »trenutna NAD prečrtano« potrjen še na p39 (1288 nad 2875) — isti revizijski vzorec kot p67.

## Protokol p40 — datumi (popravek val-75 ugiba)

- »Kamm. Griblje **am 9.** [April] 1830« (žirija)
- »k.k. Schätzungskommission in Griblje **den 29.** [April] 1830« (+ pečat)
- val-75 ugib »5./28. april 1830[?]« → **OVRŽEN**; mesec (april/avgust — VLM A je bral »avgust«) ostaja REVIEW
- »vierte Nachtag« = 4. priloga

## Sklep (F-PZ-16 RESOLVED)

- **Rektifikacijski odsek v PZ je opisno-kvalitativen**: p35–40 = klase + Muster-parcele (kakovost, ne količina); p41–42 = 1832 protokoli brez površin; p48 = proza.
- **F-PZ-04** (Summa Δ 3 J = 4.800 QKlft) — rešitvene poti v PZ **izčrpane**: p26–p65 (val 78, F-PZ-14) + p35–42 (val 79, F-PZ-16). Ostata: **VAČ II. prikaz @300 dpi re-digitation** (peskovniško edina) in **zunanji Rektifikacijski/Komunikacijski protokol** (izven peskovnika).
- I1–I6 / deleži F-PZ-13 / KG v1.8 (20ec8a0a) / timeline / i18n — **NESPREMENJENI** (§22: nič podatkovnih sprememb).

## Vgradnja

- `build-pz-1825.py` → val 79, PREHOD 5, nov top-level odsek **`rektifikacija_beschreibung`** (struktura 5 razredov + 7 Muster-parcel + renumbering + protokol + 1832 protokoli + sklep + reading_honesty), structure_map p35–42/p48 popravljena, findings 15 → **16** (+F-PZ-16 RESOLVED), F-PZ-04 detail ožjan
- `build-coverage-report.py` → val 79, PZ passes 4 → **5**, next_reads preurejeni (@300 dpi na 1. mesto + zunanji protokol), SRC-PZ opombe
- Runtime kopija coverage bajtno identična (md5 de95e3da…)

## QA

- **503/503 testov** (+7 val-79 varovalk: sekcija/križna kontrola/sklep/protokol/structure_map/F-PZ-04/prehod 5) · api-smoke **101/101** · tsc čist · lint čist · verify-i18n **1074×5**
- e2e (agent-browser): naslovnica 0 konzolnih napak; coverage API **val 79** ✓; ČAS 1830 = 441 duš / 222 M + 219 Ž / SRC-PZ ✓; mobilno 390 px brez preliva ✓

## Dokazi

- `pz-n83/crops-v79/` — 12 PNG (6+2 celotne strani @2x + 10 izrezkov @4x + 2 e2e posnetka)
- `pz-n83/vlm/p35…p40-rekt-v79.raw` + `…-v79.raw` izrezki — surovi VLM prehodi A/B
