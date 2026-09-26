# Val 76 — ATLAS 1825 §20: TIME SLIDER — podatkovni model časovnih točk + API + UI

**Naročilo** (worklog val 75 → naslednje): *»§20 TIME SLIDER arhitektura (1825 ref + 1830 prvi korak; AWAITING_SOURCE za ostale)«*
**Izhodišče**: main @ efa58ac (val 75, PR #63 merged) · 466/466 testov · api-smoke 97/97 · KG v1.7

---

## 1. Ideja: čas kot pogled na dokaze, ne kot risba

Kataster 1825 je lastninska resnica (BP/parcele/lastniki), PZ Konskripcija 1830 pa prva
prebivalstvena resnica (441 duš). §20 zahteva arhitekturo, ki vsebino **po letih** pokaze
BREZ izmišljevanja:

- **točka brez vpisanega vira = AWAITING_SOURCE in NE nosi metrik** (§4: nič ne ugibamo);
- **metriki se NIKOLI ne interpolirajo** med točkami — ni "gladkih krivulj" 1825 → 1830;
- **manjkajoča metrika v dokumentirani točki = izrecen `absent_metrics` blok**
  (ni tihih presledkov — npr. prebivalstvo 1825: kataster ne popisuje ljudi);
- **REVIEW branja ostanejo vidna** (živina 1830: Kühe|Rosse in Lämmer).

## 2. Podatkovni model — `build-timeline-1825-1830.py` (val 76)

Determinističen builder (fail-fast, idempotenten; ročno urejanje prepovedano) →
`research-griblje/atlas-1825/timeline-1825-1830.json` + bajtno identična runtime kopija
`src/data/timeline-1825-1830.json`.

**8 točk**: 2 DOCUMENTED + 6 AWAITING_SOURCE.

### 2a. 1825 — REFERENČNA točka (lastninska resnica)

Vir: katastrski operati (SRC-PT/SRC-PS/SRC-PUA) + PV izkaz rabe (SRC-PV, val 74).

| metrika | vrednost | vir |
|---|---|---|
| commune_area | 1221 J 1573 K (1.955.173 QKlft ≈ 7,032 km²) | SRC-PV |
| pasture_share | 52,06 % (636 J 263 K) | SRC-PV |
| arable_share | 33,84 % (413 J 870 K) | SRC-PV |
| meadow_share | 6,3 % (76 J 1480 K) | SRC-PV |
| orchard_meadow_share | 1,0 % (12 J 328 K) | SRC-PV |
| vineyard_area | 7 J 665 K ≈ 4,27 ha (F-PV-03 opomba) | SRC-PV |
| parcels_pua | 2035 (rabe ne zapisuje) | SRC-PUA |
| parcels_ps | 432 (prepis samo p3–55, F-PZ-09) | SRC-PS |
| parcels_with_land_use | 326 (+106 neznanka, leksikalno EXACT) | SRC-PS |

**absent_metrics (izrecno)**: `population_total` (kataster popisuje lastninska stanja,
ne ljudi) · `houses` (PT vodi stavbne parcele BP = davčne enote, ne konskripcijo hiš;
PS p3–55 omenja 167 hišnih entitet — NI primerljivo s konskripcijo 70 hiš brez re-reada
p56–143) · `families`.

### 2b. 1830 — prvi DOKUMENTIRAN korak (PZ [373419], val 75)

| metrika | vrednost | status |
|---|---|---|
| population_total | **441 duš** (vrata I1: 222 M + 219 Ž) | TRANSCRIBED |
| population_men / women | 222 / 219 | TRANSCRIBED |
| houses | 70 | TRANSCRIBED |
| families | 102 ('Hofesgesessene' delno nejasen, številka jasna) | TRANSCRIBED |
| livestock_ochsen/jungvieh/schafe | 124 / 30 / 150 | TRANSCRIBED |
| livestock_kuehe_rosse / laemmer | 20 / 30 | **REVIEW** (F-PZ-03) |
| commune_area | 1220 J 1493 K (rdeči popravek; Δ 0,086 % vs PV = vrata I2) | TRANSCRIBED |
| vineyard_area | 7 J 42 K (Joch ujemanje s PV; Klafter 42 ≠ 665 — nič izenačeno) | TRANSCRIBED |

**absent_metrics**: `pasture_share` — PZ Endresultat p67 se ne zapira (F-PZ-04 OPEN,
Δ 43.488 QKl) → deleži se NE objavljajo, dokler se vsota ne razreši (§14: nič vsiljeno).

### 2c. 1857 / 1869 / 1880 / 1890 / 1900 / 1910 — AWAITING_SOURCE

Uradne popisne letnice cislajtanskih popisov. **Ali (in kako) popis pokriva Griblje,
ugotovimo ŠELE z virom** — točke nosijo NIČ trditev: `metrics: []`, `source_ids: []`,
`expected_basis` izpisan. Arhitekturno dokazujejo pogodbo AWAITING_SOURCE.

### 2d. Invarianti (fail-fast)

| | |
|---|---|
| I1 | prebivalstvo 1830 = aritmetika iz surovega PZ (222 + 219 = 441, EXACT) |
| I2 | površina PZ ↔ PV prečno validirana (Δ < 1 %; dokumentirano 0,086 %) |
| I3 | vsaka metrika: source_id = obstoječe KG SOURCE vozlišče + evidence + reading_status |
| I4 | AWAITING_SOURCE: 0 metrik, 0 virov; DOCUMENTED: ≥ 1 metrika |
| I5 | letnice strogo naraščajoče + unikatne; statusi samo DOCUMENTED \| AWAITING_SOURCE |
| I6 | KG zatiči pribiti: PUA 2035 / PS 432 / raba 326 + 106 (zaščita pred zdrsom grafa) |

Provenanca: `kg_sha256` = sha256(KG v1.7) = b150db19… (nespremenjen — val 76 NI spremenil
KG: +0 vozlišč/+0 robov/+0 claims, izključno nov pogled nanj).

## 3. API — `GET /api/atlas/timeline`

- brez parametrov: polni pregled (pogodba + invarianti + točke z metrikami);
- `?year=1830`: posamezna točka (400 neštevilčno leto, 404 neznana — poštene napake);
- `?axis=1`: samo os (leto + status, brez metrik) za drsnik.

## 4. UI — 4. zavihek »ČAS 1825→« v katastrskem zemljevidu

`src/components/museum/atlas-timeline.tsx` (nova komponenta, lenar `/api/atlas/timeline`):

- **os**: pike proporcionalno po letnici (1825–1910), dokumentirane = polna zelena pika
  (oznaka pod piko), pričakovane = črtkana votla pika (oznaka nad piko); klik + pred-
  lednja/naslednja točka (dostopnost: aria-pressed/aria-label, tipkovnica);
- **metrična kartica**: oznaka (i18n) + vrednost iz vira (`display` iz builderja) +
  povezava na dokaze (`/api/atlas/evidence?node=SRC-*`) + REVIEW značka + opomba;
- **absent blok**: "V točki NI zabeleženo" z razlogi (prebivalstvo 1825 itd.);
- **awaiting kartica**: pošten blok brez metrik + `expected_basis`;
- **vir točke**: SRC-* čipi z dokazi; števec "2 dokumentiranih · 6 pričakovanih brez vira";
- vsebina × 5 jezikov (sl/en/hr/de/it; +42 ključev → 1074 × 5);
- stranski register v tem zavihku skrit (vsebina = celotna širina); zemljevid ostaja
  list 1825 — drsnik je pogled na podatke, opomba tega izrecno pove.

**F-TL-01 (regresija, popravljen takoj)**: 4. zavihek je preširil zavihno vrstico na
390 px (desni rob aktivnega zavihka 399 px = 9 px preliva) → `flex-wrap w-full sm:w-auto`
na zavihni vrstici; preliv 0/0 potrjen v brskalniku.

## 5. QA

- **tests/atlas-timeline.test.ts** — 22 testov/194 expect: I1/I2 neodvisno iz surovih
  PZ/PV, I3/I4/I5/I6, živina statusi (surovi PZ: 'Schafe gesamt', 'Lämmer[?]'),
  absent bloka (1825 prebivalstvo/hiše/družine; 1830 pašniki F-PZ-04), vinogradi
  7 J 665 K (PV) vs 7 J 42 K (PZ, 1 J = 1600 QKlft potrjen proti veliki vsoti PV),
  bajtna identičnost runtime↔arhiv, kg_sha256 re-hash, čista plast (timelinePoint/
  timelineAxis/axisPosition meje + degenerirana os);
- celotna svežina: **488/488** (466 + 22) · api-smoke **101/101** (+4: pregled, 1830,
  AWAITING 1857, poštene 400/404/axis) · tsc čist · lint čist · verify-i18n 1074 × 5;
- e2e (agent-browser): zavihek ČAS ✓ (1825 metrična kartica z odsotnim prebivalstvom ✓,
  1830 = 441 duš/70 hiš/102 družin/SRC-PZ/1220 J 1493 K/REVIEW značke ✓, 1857 = čakanje
  na vir ✓, navigacija naprej ✓); regresija EXPLORE + List A01 (106 markerjev) ✓;
  mobilno 390 px brez preliva (po F-TL-01) ✓; lepljiva noga na dnu dokumenta ✓; konzola
  brez napak ✓; posnetek: `research-griblje/val76-timeline-1830-desktop.png`.

## 6. Naprej

1. PZ celotni vrstični prepis (66 strani) + Summa kontrola (F-PZ-04) → polni deleži 1830
2. PS p56–143 vrstični prepis (F-PV-03 vinogradi) — ob VAČ kvoti
3. PT p7 @300dpi (F-GEO-03) · izven peskovnika: šolski list / SA Podzemelj / SI AS 749 / Zucchelli
4. prva DODANA AWAITING točka: poljuben prepisan vir (npr. popis 1857 za Griblje) → točka
   se izpolni samo s prepisom (pogodba §20 po val 76 že stoji)
