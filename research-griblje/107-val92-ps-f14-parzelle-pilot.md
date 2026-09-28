# 107 — 92. val: ISSUE #43 §1/§10 + #42 §4 — PS N83 F14 pilot: »Benennung des Flures« / »Nro. der Parzelle« — strukturni model + aritmetika (0 VLM, direktni vid)

**Datum:** 2026-09-28 · **Naročilo:** »nadaljuj kjer si ostal«
**Viri:** SI AS 176/N/N83/s/PS — VAČ docid 41780 (uodid 373415), prenosi `pdfPageImage` (predogledna ločljivost do ~1310 px)
**Obseg:** diagnostični infrastrukturni pilot — **+0 zapisov / +0 virov / +0 KG / +0 UI** · ATLAS 1825 pogodba §22 NEIZMENJANA
**Artefakt:** `research-griblje/ps-n83/f14-flurbezirk/pilot-parzelle-v92.json` + `build-pilot-parzelle-v92.py` (determinističen re-run)

---

## 1. Kontekst — kaj je F14 in zakaj še odprt

F14 (val 58): *»PUA parcelne številke (2–9978) in PS jaethe (1–9116) v ISTI rangi; cross_ref_to_pua UNKNOWN na vseh 930 PS parcelah.«* NR-02 (Rosetta): 356 številčnih prekrivanj PS↔PUA — NEPOTRJENO. Val 89 je zapisal: **»Flurbezirk glava @300 dpi (F14) — ključ do Rosette NR-02; sedaj ima statistika 143/143 osnovo.«**

Val 92 je pilot izvedel z direktnim branjem (instrument val 61, 0 VLM — brez kvote): 8 vzorčnih razpred (p2, p3×2 prehoda, p20, p45, p58×2 prehoda, p59, p84, p133), izrezi 2×/3× (PIL LANCZOS).

## 2. PRELOM 1 — glava je bila povzeta napačno (popravek analize v1)

Tiskana glava leve strani (2×/3×, jasno berljivo na p59):

> **Nro. des Blattes · Benennung des Flures · Nro. der Parzelle · Gstlzzeige. Eigen. (Gebäude des Grundstücks: Dominical | Rustical) · Haus Nro. · Vor und Zuname · Stand · Wohnort**

Desna stran:

> **Cultura Gattung · Flächen Inhalt (N.° | Joch | Quad. Klafter) · Classe · Reinertrag Ertrag (fl. | kr.) · Capital Werth p. Cmt · Anmerkung**

Analiza v1 (val 58) je glavo povzela kot **»Flurbezirk / Jaethe«** — napačno: pri 1× ločljivosti je padla vodilna »1« štirimestnih številk in ločnica med stolpcema. Protocol je naslovljen **»Grundparzellen Protocol der Gemeinde Grüble«** (p002).

## 3. PRELOM 2 — strukturni model: Parzelle 21 → ~2820, ~20/razprede

Model: **p3 = seznam FLURE 1–20** (stolpec »Benennung des Flures«); **p4–p143 = zaporedne PARZELLE**, first(p) = 21 + 20·(p−4), ~20 vrstic/razprede. Potrditvene točke:

| stran | model | prebrano | status |
|---|---|---|---|
| p3 | Flure 1–20 | 1–20 (2 prehoda; 1. prehod 1×: zadnjih 6 vrstic napačno 16/29/34/33/39/40 → pri 2× jasno 15–20) | CONFIRMED |
| p20 | 341–360 | 341–360 | CONFIRMED |
| p45 | 841–860 | 841–860 | CONFIRMED |
| p58 | 1101–1120 | 1101–1120 (1. prehod 1×: **101–120 NAPAČNO** — izpustil vodilno 1; 3× potrjeno) | CONFIRMED |
| p59 | 1121–1140 | 1121–1140 (1 prehod) | PROVISIONAL |
| p84 | 1621–1640 | 16xx (1× dvoumno 6xx/16xx; model razreši) | PROVISIONAL |
| p133 | 2601–2620 | 2601–2620 + stolpec 1 = navpično ime Bezirka; vsi lastniki = **Gemeinde** | CONFIRMED |

Budget: 20 (p3) + 139 × 20 = 2800 (+ Fürtrag/povzetki → 2871 registrskih vrstic ✓). **Implikacija: celoten vesoljec PS parcel ≈ 2800, ne 930** — 930 = vrstice z ujeto površino/kultur (podmnožica).

**Pouk o ločljivosti (2× dokažan):** 1× prehoda sta dala dve sistemični napaki (izpuščena vodilna »1«; zmešana stolpca). Dvojni prehod + izrezi ≥2× so obvezni; 3–4 mestna gotovost za celotno transkripcijo zahteva 300 dpi.

## 4. PRELOM 3 — površinska semantika: C4 prostor = LITERALNA površina

Desna glava: **N.° | Joch | Quad. Klafter**. Na p3 je vzorec oken: vrednosti (116, 328, 149, 729 …) v Quad.-Klafter stolpcu, »1-1348« / »1-1602« = **1 Joch + 1348/1602 QKl**. S tem je **C4 prostor J·1600+QKl (val 90) doslovno površina v kvadratnih klafterjih (1 J = 1600 QKl)** — val 90 sklep »metrika TO-DECODE« dobi strukturno razlago: aritmetika vsot je bila testirana nad površinami, ne nad indeksi.

## 5. NR-02 v1 = kategorijska napaka (pošten popravek)

NR-02 (val 60/89) je primerjal **PS jaethe VREDNOSTI** (površine) s **PUA ŠTEVILKAMI** — primerjava površin s številkami (apples↔oranges). Prava PS ključna kolona za vezavo je **Nro. der Parzelle** (in »Benennung des Flures«) — **nikoli prepisana** v register.json (2871 vrstic ima kultur/owner/površine, brez številskih stolpcev leve strani).

**Popravek lastne statistične napake (pošteno, izrecno):** v teku tega vala je bil najprej zabeležen vpogled »p59: 20/20 številk v PUA-I, P=1,3e-12« (pri globalni gostoti PUA-I 25 %). Nadaljnja kontrola je pokazala, da je **lokalna gostota** PUA-I v nizkih rangih 76–96 % → P(20/20) ≈ **0,44 pri naključju** — pokritostni test PS↔PUA-I **NIMA ločevalne moči**. Verdikt je korigiran v artefaktu (honest_negative) — brez lažne potrditve Rosette.

## 6. p133 — Gemeinde sekcija in dve vrsti vpisov

p133: stolpec 1 = **navpično napisano ime območja** (delno brano »…se re kno 2 e-tzo…« — TO-READ @300 dpi), stolpec 2 = Parzelle 2601–2620 (zvezno), vsi lastniki = **Gemeinde**, Haus Nro. = —. Model dveh vrst vpisov: (a) številčeni Flure (p3), (b) imenovani Bezirki s parcelami (p133). Meje sekcij (navpična imena) so ključ do vezave PS page-ranges ↔ PUA sekcije I–V.

## 7. Kaj NAMERNO ni narejeno

- **cross_ref_to_pua NE dvignjen** — Rosetta ostaja TO-RESOLVE: (1) celotna transkripcija številskih stolpcev čez 143 razpred (~2871 vrstic, resumable), (2) identifikacija meja Bezirkov, (3) 300 dpi. Brez tega nič ugibanja.
- **+0 zapisov / +0 virov / +0 KG** — pilot je diagnostični sloj (vzorec 86b 1. dela / val 90); ATLAS §22 NEIZMENJAN.
- N083PS.pdf (56 MB) peskovniško prepočasen → samo 12 vzorčnih strani prenešenih (`raw-web-val92-2026-10/`); 300 dpi = naslednja logistična naloga.

## 8. Artefakti in QA

- `pilot-parzelle-v92.json` (glava, model, 7 točk, verdikti F14, readings, next_steps, invariants)
- `build-pilot-parzelle-v92.py` — deterministični verifikator (model, brez prekrivanja, statusi, budget, invarianta brez-ugibanja); re-run byte-identno
- `tests/val92-f14-parzelle-pilot.test.ts` — **13 varovalk** (glava-popravek, model izpeljan ne trdo kodiran, p58 popravek, pošten negativ 0,44, determinizem, +0 pogodbe)
- **672 testov: 661 pass / 11 skip / 0 fail** · tsc čist · lint čist · readme-sync zeleno (113 / 605 / 485 nespremenjeno)

## 9. Naslednje

1. **300 dpi osnova** (N083PS.pdf počasi ali stransko) → celotna transkripcija Benennung des Flures / Nro. der Parzelle (resumable, ~2871 vrstic) → meje Bezirkov → **F14 rešitev + Rosetta v3**
2. 86b 2. del ATLASA (~479 tile-ov, čaka VLM kvoto)
3. ISSUE #72 sledi: Kresna pesem 1888 (ljudsko izročilo), vsebinska poročila kod, DOZA/1468, Memento 2026
