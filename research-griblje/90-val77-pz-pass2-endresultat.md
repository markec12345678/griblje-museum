# Val 77 — PZ N83 PASS 2: odločilni re-read Endresultata p67 + §8 (p6) z aritmetičnimi vrati I4–I6

**VAČ**: uodid 373419 · docid 41784 · 71 strani · `research-griblje/pz-n83/`
**Naročilo** (worklog val 76 → naslednje): *»PZ celotni vrstični prepis + Summa kontrola (F-PZ-04 → polni deleži 1830)«*

---

## 1. Kontinuiteta

Val 76 zaključen (PR #64 → main @ d9a9e6d; vse platforme žive z val 76). Naslednje po worklogu: PZ Summa kontrola + deleži 1830. Peskovnik po resetu: repo na `feat/val74-pv-land-use` → sync na main @ df884b5.

## 2. Metoda — PREHOD 3 (val 77)

Za razliko od val 75 (celostranska branja) val 77 brere **na ravni celic**:

- izrezki Joch/□Klafter stolpcev p67 (crops/p67-area/, 3× LANCZOS) in vrstnih pasov (crops/p67-rows/, 22 izrezkov)
- 12 horizontalnih pasov p67 + 2 neodvisna VLM prehoda na vsako dvomljivo celico
- §8 (p6) izrezki per vrstica (crops/p6-tab-*) + rdeči stolpec Zusammen (crops/p6-zus-*)
- **direktni odtis avtorja transkripcije** kot tretja neodvisna kontrola
- **aritmetična vrata I4–I6** odločijo vsako dvomljivo števko (isti princip kot val 74)

## 3. Revizijski vzorec p67 (ključ do korekcij)

Tabela uporablja dosleden vzorec: **trenutna vrednost zapisana NAD prečrtano izvirno**. Dokumentiran na 5 neodvisnih celicah:

| celica | trenutna (nad) | prečrtana (pod) |
|---|---|---|
| Aecher II Joch | **334** | 234 |
| Hutweiden Klf | **702** | 402[?] |
| Weiden mit Holznutzen Klf | **558** | 846 |
| Bauarea Klf | **1199** | 1144 |
| Summa Klf | **495** | 474[?]|481[?] |

## 4. Korekcije vs. val 75 (vsaka z dokazom)

| polje | val 75 | **val 77** | dokaz |
|---|---|---|---|
| Summa p67 Joch | 1132 | **1152** | izrezek (Kurrent 3↔5), 2 prehoda |
| Bauarea Klf | 1499[?] | **1199** | izrezek + §8 'Zu den Unbenützten zählt ein Bauarea' 1\|1199 EXACT |
| Größere Gärten Klf | 105 | **405** | izrezek (Kurrent '4') + §8 Einzeln 405 EXACT |
| WmH Klf | 846 | **558** | izrezek (558 nad 846) + §8 kaže isto prečrtavo |
| Wiesen §8 | 55\|812 REVIEW | **45 J 812 K** | izrezek (Kurrent '4') |
| Wiesen I Joch (p67) | 15 | **5 (GATED)** | izpeljava: 45 − 39 − 1 J (od 2412 K) |

Potrjeno nespremenjeno: Aecher I 80\|842 · Aecher II 334\|120 · Wiesen II 39\|818 · KG 3\|615 · WG 7\|42 · HW 118\|702.

## 5. Aritmetična vrata I4–I6 (fail-fast, vse EXACT)

- **I4** per-kultura §8 Einzeln: Aecher I+II = 414\|962, KG 3\|615, GG 405, WG 7\|42, HW 118\|702, Bauarea 1\|1199 — **6/6 EXACT**
- **I5** Wiesen: I+II = 45 J 812 K (§8) → Wiesen I = **5 J** je edina rešitev (15 J aritmetično nemogoče)
- **I6** Total: vrstice 1–8 (1149 J 6895 K = 1149 J 495 K po pretvorbi) + unbenützbar **71 J 998 K (izpeljano)** = 1220 J 1493 K Total Gemeinde — EXACT (§1 + PV Δ 0,086 %)

## 6. F-PZ-04 — ožjan, ostaja OPEN

- vrstice 1–8 = **1149 J 495 K** = 1.838.895 QKlft
- zapisana Summa = **1152 J 495 K** = 1.843.695 QKlft
- **Δ = 3 Joch = 4.800 QKlft NATANČNO** (val 75: Δ 43.488 na napačnih branjih)
- Klf stolpec se zapira (495 = 495); Joch stolpec Summe je 3 J nad vsoto vrstic → pisarjevska nekonsistentnost ali neobjavljena korekcija
- **nič se ne vsiljuje (§4)**; rešitvene poti: Rektifikacija p35–40 per-parcelna kontrola, p30/p63/p65 @300 dpi

## 7. Deleži rabe 1830 (F-PZ-13, izpeljani iz vrat I4–I6)

| kultura | QKlft | % Totala (1.953.493) |
|---|---|---|
| Njive (Aecher I+II) | 663.362 | **33,96 %** |
| Pašniki (Hutweiden) | 189.502 | 9,70 % |
| Pašniki z lesno rabo (Weiden mit Holznutzen) | 893.358 | **45,73 %** |
| Travniki (Wiesen) | 72.812 | 3,73 % |
| Vinogradi | 11.242 | 0,58 % |
| Mali vrtovi | 5.415 | 0,28 % |
| Večji vrtovi | 405 | 0,02 % |
| Bauarea (unbenützt) | 2.799 | 0,14 % |
| Unbenützbar (izpeljano I6) | 114.598 | 5,87 % |
| **vsota** | **1.953.493** | **100,00 % EXACT** |

Primerjava 1825 (PV, val 74): pašniki 52,06 % · njive 33,84 % · travniki 7,3 % · vinogradi 0,61 % → 1830: pašniške kategorije 55,43 % · njive 33,96 % · travniki 3,73 % · vinogradi 0,58 %. **Poštenost**: deleži so v pz-konskripcija-1830.json kot strukturna resnica; timeline UI 'pasture_share' OSTAJA absent dokler je F-PZ-04 OPEN (pogodba val 76); UI absent besedilo posodobljeno (Δ 4.800).

## 8. p43–47 Reinertragstabellen — pošteno zavrnjene (F-PZ-12)

Celostranski VLM prepis 5 strani je haluciniral (gost Kurrent @182 dpi). Po §4 branja **ZAVRJENA** (ni vhoda v podatke); strukturno branje val 75 ohranjeno. Celotni vrstični prepis čaka VAČ IIIF @300 dpi. Isto status: p65 Zusammenstellung A (delno nezanesljivo); p30 (naturalni pridelek per classe) in p63 (Pachtverträge per parcela) = 1. prehod zapisan v structure_map, 2. prehod čaka.

## 9. Vgradnja

- **build-pz-1825.py PASS 2**: korekcije + PARAGRAF8_P6 + vrata I4–I6 + shares_1830 + 13 najdb (4 nove: F-PZ-10 REVIEW, F-PZ-11 RESOLVED, F-PZ-12 OPEN, F-PZ-13 RESOLVED)
- **KG v1.8** (val 77): KG-F09 statement/status; nodes/edges/claims/ID-ji NESPREMENJENI (3.309/3.569/622); kg_sha256 809ef581→b150db19→**20ec8a0a** (§22 pogodba)
- **coverage** (val 77): SRC-PZ note PASS 2; viri 10 VERIFIED / 3 PARTIAL (nespremenjeno)
- **timeline** (re-derived): kg_sha256 20ec8a0a; 1830 absent reason z Δ 4.800; metrike 1830 nespremenjene
- **story engine**: PZ gozd item '558 J 558 K' (prej 846)
- **i18n**: absentPastureShare × 5 jezikov (Δ 4.800, val 77 re-read)

## 10. QA

- tests/pz-konskripcija.test.ts: **19 testov**/174 expect (vse vrata I1–I6 neodvisno v TS; korekcije; deleži; §8; F-PZ-10–13; KG v1.8; zgodba)
- celotna svežina: **494/494** (488 + 6 neto) · api-smoke **101/101** · tsc čist · lint čist · verify-i18n **1074 × 5** zeleno
- e2e (agent-browser): ČAS 1830 z novim absent besedilom ✓, 441/70/102 ✓; EXPLORE filtri ✓; mobilno 390 px brez preliva (tablist 308 px) ✓; noga na dnu ✓; konzola 0 napak

## 11. Naprej

1. Rektifikacija p35–40 per-parcelna kontrola (F-PZ-04 rešitev: kje so 'izgubljeni' 3 Joch)
2. PS p56–143 vrstični prepis (F-PV-03 vinogradi) ob VAČ kvoti
3. p30/p63/p65 2. prehod @300 dpi (F-PZ-12)
4. PT p7 @300dpi (F-GEO-03) · izven peskovnika: šolski list / SA Podzemelj / SI AS 749 / Zucchelli
