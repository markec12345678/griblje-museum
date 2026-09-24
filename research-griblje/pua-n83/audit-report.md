# PUA N83 (1825) — AUDIT POROČILO (val 51, issue #35 §15)

**Vir:** SI AS 176/N/N83/s/PUA — »Alphabetisches Verzeichniß Der Grund-Eigenthümer
Der Gemeinde „GRÜBLE"«, VAČ docid 41782, 49 digitaliziranih strani.
**Metoda:** 3 neodvisni VLM prehodi (pass1 surovo branje 49+3 datotek, pass2
verifikacija vrstica za vrstico z nacrtom, pass3 tarčno 2× zoom branje §4
problemov brez nacrta) + strojno usklajevanje (register.json).
**Surovine:** `research-griblje/raw-web-val51-2026-10/pua-vlm/` (104 VLM odgovorov:
52× pass1, 46× pass2, 15× pass3 — vključno z 2× zoom PNG različicami).
**QA:** `tests/pua-n83-register.test.ts` — 16 trditev (pageRef, duplikati,
UNVERIFIED≠fact, strukturirane parcele, uncertain označevanje, §4 pokritost).

---

## 1. COVERAGE (pokritost)

| mera | vrednost | opomba |
|---|---|---|
| strani 1–49 | **49/49 registriranih** | page-records.json |
| prebrano z vpisi | 45 strani | p01/p02 naslovnici, p26/p42 okrnjeni |
| p26 + p42 | **TRUNCATED / UNVERIFIED** | reševalno branje: naslovna bloka, telo pod rezom nepotvrjeno; nikoli »prazni« |
| p27/p29/p40 | prebrane po **recovered** verzijah (JFIF 1.01 re-render) + pass2 verifikacija | VLM API nepopolne originalne JPEG zavrne (400: image parse error) — dokumentirano |
| vpisov v registru | **94** | register.json |
| hišnih številk | **50 različnih** (1–72, z vrzelmi) | institucije brez hišne št. |
| sekcij | I–V (+ oznake C/G/O v opombah, VI–X v zaključnih seznamih p48) | |
| referenc na parcele | **2.559** (ločene, strukturirane) | |
| institucionalnih lastnikov | Commenda (no. 9), Kirche zu St. Veith (no. 44), k.k. Zollamt (no. 95), Wiese/Hiesige Gemeinde (no. 96), Pfarrer Sautter ×2 (p29-rec), Pfarrer Kaulßgütl ×2 (p32), Liechtenstein ×2 (no. 47/48), Procurat (no. 67) | |
| plemiških vpisov | Baron von Gradac/Gradatz (no. 20, III 748+777), Liechtenstein brata (no. 47/48), Baron Apfaltrer (opomba na p03 pri no. 2) | |

### Numeracija (lfd. Nummer) — stanje
- Blok 1 (p03–p25): 1–50 — kontinuiteta potrjena razen **p16 (70/71 kontra
  pričakovana 30/31)**; rešeno: p17 = 32/33, p18 = 34/35, p24 = 47/48 (vse
  pass3 digit-by-digit popravke pass1/2 napačnih 92/93, 24/25, 147/148).
- Blok 2 (p27–p41): številčenje **nestabilno** — p27-rec »393/394« (očitno
  napačno; položaj nakazuje 51/52), p28 »35/36«, p29-rec »37/38«, p30 »59/60«;
  aritmetična hipoteza (51–58 za 6 vpisov na p27–p29) dokumentirana, NE
  uveljavljena (prepoved ugibanja).
- Rep (p40–p49): **80/81 → 97 kontinuiteta** potrjena (p40-rec 80/81, p41
  82/83/84, **[85/86 verjetno pod rezom p42]**, p43 87/88 … p49 97).

## 2. QUALITY (kakovost)

| razred | št. vpisov | delež |
|---|---|---|
| VERIFIED-2x (2× soglasje, high, brez uncertain) | 46 | 48% |
| REVIEW (medium/uncertain besede) | 21 | 22% |
| REVIEW-CONFLICT (prehodi se razlikujejo) | 27 | 29% |
| REVIEW-DROPPED (nepotrjeno, dokumentirano) | 0 | — |
| skupaj v kuratorski reviziji | 48 | 52% |

- Zaupanje: high 88, medium 6 (vsi medium → REVIEW).
- 100% vpisov ima `reading_provenance` (kateri prehod jebral) + surov VLM
  odgovor v raw-web-val51.
- Vsaka negotova beseda je označena `[?]` ali `[nečitljivo]` — QA test to
  vsiljuje.
- **Ni ugibanj:** številčne rekonstrukcije (51–58, 30/31) so hipoteze v
  opombah/auditu, ne v podatkih.

## 3. PROVENIENCA

Za vsak podatek velja: **PUA stran → vpis (entry_no) → register.json vrstica →
surov VLM odgovor (raw-web-val51-2026-10/pua-vlm/…) → originalna JPEG (val 47)
→ VAČ docid 41782**. Ključne rešitve ima vsaka vrstica v `notes` zgodovino
branj (val 48 → val 51 pass1/2/3).

## 4. §4 PROBLEMATIČNI VPISI — končne rešitve

| §4 postavka | rešitev (val 51) | status |
|---|---|---|
| h. 25 »Brincz Michl Bauerin« | **REVIDIRANO**: no. 4 = Brincz Mathias/Wendel[?] Bauer (moški, 3×); no. 6 = Brincz Michl Bauer h. 28; »Bauerin« na h. 25 NI potrjeno | REVIEW (ime), Bauerin opuščeno |
| Baron Apfaltrer | **POTRJENO** na p03: »Baron Apfalterer« v parcelnem seznamu no. 2 (Section G/O) | VERIFIED-2x (oblika -er[?]) |
| Husitsch Baron von Gradac | **POTRJENO**: no. 20, III 748+777 (val48 + pass3 zoom); pass1/2 namesto tega Barbara »des Grädlers« (žena?) — konflikt dokumentiran | REVIEW-CONFLICT |
| Commenda | baza »Commenda Tahern-« 2× (val48 »Tahern unde.«, pass3 »Tahernwirth.[?]«); konec negotov | REVIEW |
| St. Veith | »Kirche zu St. Veith in Grüble«, no. 44, L.P. 12. | VERIFIED-2x |
| Gemeinschaftliche Waldweide | na p47/p48 NI najdena (pass3); no. 96 = »Wiese in der Gemeinde Grübln« (občinska njiva/travnik) — val48 povezava »skupna gozdna paša« negotova | REVIEW |
| k.k. Zollamt | no. 95, h. 70, »k.k. Merarial[?]« (morda Ministerial) | REVIEW |
| h. 46 Ribetitsch Söllner | **REVIDIRANO**: h. 46 = »Lahodathar / Wittib Lahodatharin« (3× soglasje); »Ribetitsch« in status Söllner opuščena | VERIFIED-2x |
| F. Kirch Nro. 97 | **REVIDIRANO**: no. 97 = »Philipp De Giammo Zucchelli« (pass1+pass3 2×), parcela 2700; zaključna formula »Ich Amtl[ich] am 10. **Jänner** 1825« + 3 podpisi — MESEC PREBRAN | VERIFIED-2x |

## 5. §6 RECOVERED PRIMERJAVA (p27/p29/p40)

- **VLM API nepopolne originalne JPEG zavrne** (400 »图片输入格式/解析错误«) —
  zato PIL `LOAD_TRUNCATED_IMAGES` delno dekodiranje → PNG → VLM branje
  originala, primerjava z recovered:
  - **p27**: original prikazuje samo zgornji del (naslovna glava + 1–2 vrstici);
    recovered dodaja celoto — 2 vpisa (»Noah N[?]« h4, »Peter P[?]« h11, no.
    393/394 = napačno številčenje). Razlika dokumentirana.
  - **p29**: original prikazuje del zgornjih vrstic; recovered = 2 vpisa
    (Pfarrer Michael/Rupert Sautter, »37/38« — konflikt s p20 38/39).
  - **p40**: original prikazuje del strani; recovered = 2 vpisa (Schimetz Wafal
    h69 »80«, Schimetz Johann h60 »81«) — **zapolnita vrzeli 80/81** in
    potrdita rep kontinuiteto do 97.
- Vsi recovered vpisi so v registru z `reading_provenance: recovered …` in
  REVIEW statusi, kjer je številka konfliktna.

## 6. MISSING (manjkajoče — ni ugibanj)

1. **p26/p42 telo pod rezom** — UNVERIFIED; re-download ob delujočem arhiv.si
   (P3-E12); p42 telo verjetno vsebuje vpisa **85/86** (aritmetika repa).
2. **Numeracija 53–58** — 6 številk brez zanesljivih vrstic (blok p27–p31);
   3 štirje kandidati obstajajo, a so številke konfliktne → kuratorska kontrola.
3. **Numeracija 30/31** — p16 bra 70/71 2×, a kontinuiteta knjige zahteva 30/31
   (Kurrent 3↔7); p35/36 imata 70/71 z kontinuiteto 67–73 → konflikt ostaja.
4. **no. 1 (p03)** — 3 različna branja (Mellachitsch Waise / Hollschitzsch
   Wittwe) → kuratorska kontrola.
5. **Identiteta Philipp De Giammo Zucchelli** (no. 97) — nenavadno ime (ital.
   oblika?); P3.
6. **Mesec Jänner (10. 1. 1825)** — pass3 high, a zadnja potrditev ob
   re-downloaded p49 v polni ločljivosti.
7. **PS 143 strani (docid 41780)** — povezave PUA→PS NISO dokazane; register
   pripravlja vstopno točko (glej 64-val51 §PS).

## 7. KURATORSKA VRSTA (novo iz val 51)

- **P3-E13 (novo)**: številčna struktura PUA (bloki p01/p26/p42, vrzeli
  30/31 + 53–58 + 85/86, konflikti 70/71 in 35–38) — kontrola strani p16,
  p27–p31 v polni ločljivosti.
- Novelizacije: P2-E8 (Bauerin h.25 opuščena), P2-E9 (Commenda Tahern- baza),
  P3-E10 (Apfalterer potrjen p03; Gradac 2×), P3-E11 (Lahodathar namesto
  Ribetitsch), P3-E12 (Jänner 1825 + Zucchelli + p42 telo 85/86).

— Konec audit poročila. Register: `pua-n83/register.json` (strojno berljiv) +
`register.csv` (razpredelnica). Surovine: `raw-web-val51-2026-10/pua-vlm/`.
