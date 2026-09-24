# 66 · VAL 53 — PT N083: POPOLN KONTROLIRAN PREPIS PROTOCOLLA DER BAU PARCELLEN (p1–p8)

*Digitalni vaški muzej Griblje · 107. sklop · 53. val raziskave · 2026-09-24*
*Naročilo: »si vse mozne podatke pobral iz tega kaj si nasel … najprej vse poberi potem usklajujemo« — faza 1: POBRANJE. PT N083 (docid 41781) je zadnji večji vir, ki je **lokalno prenešen a nikoli popolnoma prebran**.*

---

## A. Research question

Popoln, strukturiran, dvojno preverjen prepis **PT N083 — »Protocoll der Bau Parcellen der Gemeinde GRÜBLE«** ( seznam stavbnih parcel, franciscejski kataster 1825, SI AS 176/N/N83/s/PT, VAČ docid 41781, 8 digitaliziranih strani), z:

1. **prvim branjem p3** (v valih 41/52 nikoli prebrana; JPEG okrnjen — manjka zaključni marker `ff d9`),
2. **stabilizacijo nestabilnih branj** p1–p8 (val 41 = prosta branja, val 52 = strukturna; lastniška imena med njima niso soglasna — Kurrent),
3. **konsenznim registrom** BP↔hiša↔lastnik (isti standard kot PUA register v val 51 / issue #35),
4. **vstopno točko za usklajevanje** PUA↔PT↔list A01 (faza 2, po naročilu šele kasneje).

Terminološka pravila (nespremenjena): nepotrjeno branje ≠ dejstvo; dvojno soglasje = STABLE; konflikt = REVIEW-CONFLICT; enojno branje = REVIEW; nič ugibanja.

---

## B. Vir in surovine

| lastnost | vrednost |
|---|---|
| dokument | Protocoll der Bau Parcellen der Gemeinde „GRÜBLE" (protokol stavbnih parcel) |
| arhivska pot | SI AS 176 Franciscejski kataster za Kranjsko → N83 Griblje → spisovni del (373412) → **N083PT Seznam stavbnih parcel (373416)** |
| VAČ | docid 41781 (uodid 373416); IIIF manifest »N083PT.pdf«, 8 strani, LuraDocument PDF v2.16 (2006) |
| prenos | val 41 — vseh 8 strani prek `/vac/util/pdfPageImage?uodid=373416&docid=41781&page=N` (36–300 kB JPEG) |
| JPEG integriteta (val 53 sken) | **p3 okrnjena** (manjka EOF `ff d9`); p1/p2/p4–p8 čiste |
| lokalne surovine | `raw-web-val41-2026-10/n083pt-pages/` (8 JPEG + 8 TXT OCR-sloj + `n083pt-ocr.txt`, `n083pt.pdf` z razbitim xref, 611 kB) |
| nova surovina | `raw-web-val53-2026-10/` — `pt-zoom/` (6× 2× LANCZOS PNG + p3-recovered.jpg) + `pt-vlm/` (14 × .ok.json VLM odgovorov) |

---

## C. Metoda — 3 neodvisni viri branj, konsenzni standard PUA

| prehod | kaj | datotek |
|---|---|---|
| val 41 (prior) | prosta branja p1, p4–p8 (ne-strukturna; dokumentirana v 55-val41) | 6 |
| val 52 (prior) | strukturna branja p1–p8 (shema bp/owner/house/gattung/…) | 7 |
| **val 53 passA** | **sveža strukturna branja** p2–p8 (strog prompt, 1825 Kurrent pravila) + **p3 prvo branje** prek `p3-recovered.jpg` (PIL `LOAD_TRUNCATED_IMAGES` → re-render; VLM API zavrne okrnjen JPEG — ista metoda kot PUA §6) | 7 |
| **val 53 passB** | **2× LANCZOS zoom branja** p3–p8 (neodvisno, brez nacrta) | 6 |
| **val 53 tarčno** | p8 »Musterstellung der Gebäude« s posebnim promptom (povzetek + podpisi) | 1 |

- vsa VLM branja serial z backoff-om (izkušnja 429 iz val 51); **14/14 uspešnih na prvi poskus**.
- **Izključitve iz konsenza (dokumentirane, surovine ostajajo):**
  - `val52-p5` — **premaknjeni stolpci**: hišne številke prebrane kot številke parcel (bp) → ena vrstica val52-p5 je onesnažila p5; izključena iz konsenza, dokumentirana v page-records.
  - `p8` bp-vrstice »1–11« (val52 + val53) — p8 ni tabela BP ampak **Musterstellung der Gebäude** (povzetek) + nova glava tabele; oštevilčenje 1–11 = dodelitev napačnemu stolpcu. Vse tri p8 branja izključena iz BP-registra; povzetek posebej izluščen.

- **Konsenzne regle (register.json):**
  - `STABLE` = ≥2 branji soglasni v hišni številki (glasovi ≥2) — 40 vrstic;
  - `REVIEW-CONFLICT` = branja dajeta različni hišni številki — 51 vrstic;
  - `REVIEW` = enojno branje ali brez številke — 9 vrstic;
  - lastniška imena: različice branj se hranijo (`owner_variants`), **nikoli ne povišane** (Kurrent H↔K, M↔W … ostaja negotovost, ne ugibanje).

---

## D. Rezultati

### D.1 Pokritost (strani → BP)

| stran | vsebina | BP pokritost | opomba |
|---|---|---|---|
| p1 | naslovnica »Protocoll Der Bau Parcellen der Gemeinde GRÜBLE« | — | 2× brana (val41+val52) |
| p2 | opisna naslovnica (tiskani nastavki stolpcev) | — | 2× brana |
| p3 | **prvo branje (val 53!)** | **1–14** | JPEG okrnjen; bp 1–2 = **St. Veith** (cerkev!); možne polovične parcele »7½/8½« (nestabilno — 2 različni branji) |
| p4 | tabela | 21–40 | 3 branja |
| p5 | tabela | 41–60 (+61 mejna) | val52-p5 izključen; passA+passB soglasni večinoma |
| p6 | tabela | 61–80 (+81 mejna) | |
| p7 | tabela | 81–100 | dvojno branje val41+val52 že v val 52; val 53 dodaja 2 |
| p8 | **Musterstellung der Gebäude** + nova glava + sub-1–11 | — (ni BP) | povzetek izluščen (D.3) |

- **Skupaj v registru: 100 vrstic, 97 unikatnih BP (razpon 1–100).**
- **Vrzel 15–20:** p3 se konča pri 14, p4 začne pri 21 (3 neodvisni viri: val41, val52, val53) — vrzel je ali pod okrnjenostjo p3 (spodnje vrstice izgubljene) ali pravi preskok številčenja; **NI ugibanja**, dokumentirana kot MISSING (primerljivo PUA 53–58). Kontrola ob re-downloaodu p3 v polni ločljivosti (arhiv.si — P3-E12).
- **Mejna prekrivanja 61 in 81** (p5/p6 in p6/p7) = resnične ponovljene mejne vrstice protokola → naravna korooboracija (bp 81 p7: val52+val53 soglasje h.45).

### D.2 Register (konsenzne povezave bp→hiša)

**40 STABLE povezav** (vse v `pt-n83/register.json`, polni moduli):

bp 3→h18, 4→h19, 5→h17, 6→h16, 9→h10, 10→h10, 11→h9, 21→h10, 22→h10, 23→h11, 24→h1, 25→h1, 26→h2, 27→h21, 28→h21, 29→h66, 31→h65, 32→h65, 34→h39, 42→h26, 43→h27, 45→h28, 46→h63, 48→h63, 55→h32, 58→h32, 62→h54, 63→h49, 64→h55, 65→h53, 66→h55, 67→h54, 74→h60, 76→h51, 77→h48, **82→h45, 83→h45, 84→h45** (potrditev val52 p7), 94→h40, 100→h5.

**Ključne korooboracije z obstoječim znanjem:**
- **bp 81–84 → h.45** — potritev vezave iz val 52 (dvojno branje val41+val52: »Krauß/Hraupf Georg« h.45); val 53 passA/zoom to potrjujeta na 82/83/84 → povezava je sedaj **3× neodvisno potrjena** (prejšnje P2 znanje v zemljevidu ostaja nespremenjeno).
- **bp 1–2 → St. Veith** — cerkvena parcela na začetku protokola; povezuje se s PUA no. 44 »Kirche zu St. Veith in Grüble« (VERIFIED-2x v val 51). Ker PUA no. 44 nima hišne številke, p3 povezava ostaje REVIEW (enojno branje hišne št. nečitljivo), ampak vsebinsko korooboracija.
- **bp 100 → h.5, Gattung »Futterg[?]«** — zadnja vrstica (morda objekt zunaj vasi — PUA h.5 povezan z Dragosc); REVIEW.

### D.3 p8 — Musterstellung der Gebäude (povzetek)

| kategorija | št. | površina |
|---|---|---|
| Wohngebäude | 4 | 869 |
| Nebengebäude | 4 | 112 |
| Zusammen | 8 | 981 |
| Hofraum | — | 1241 |
| Insgesamt | — | 2222 |

- Podpisa: `[nečitljivo]` ×2.
- Interpretacija: povzetek verjetno za **posamezni gospodarski kompleks** (8 objektov), ne za celotno k.o. (100 BP) — ni dovolj konteksta za vgradnjo; dokumentirano REVIEW.
- Pomembno za gostilna-vprašanje (MVG-109): med kategorijami **ni Gasthaus/Taverne/Wirtshaus** — ampak povzetek pokriva samo del kompleksa, zato **ni** dokaz odsotnosti.

### D.4 PUA navzkrižna kontrola — VSTOPNA TOČKA za usklajevanje (faza 2)

Za vsako STABLE povezavo bp→h je v register.json vez na PUA lastnika (h. št.). Primerjava imen pokaže **trije vzorci** (za fazo 2, ni reševano tu):

1. **Soglasje ali očitna varianta** (npr. bp 82–84 → h.45 Krauß/Hraupf Georg ↔ PUA h.45 …; bp 29 → h.66 Nikolaus Groß ↔ PUA h.66 …).
2. **Delno soglasje** (ena oseba skupna večlastniški hiši — npr. bp 42 → h.26 »Lorenz Glan« ↔ PUA h.26 »… Sankovitsch **Lorenz**«).
3. **Nesoglasje** (npr. bp 94 → h.40 PT »Georg Mache[?]« ↔ PUA h.40 »Pfarrer Rupert Sautter«; bp 24/25 → h.1 »Achmüth Malfg.« ↔ PUA h.1 = 3 različna branja že v val 51) — kandidati: (a) napaka vezave hišne št. v enem od registrov, (b) različni predmeti obeh dokumentov (PUA = zemljiški lastniki, PT = stavbni posebniki; lastnik zemljišča ≠ lastnik stavbe), (c) resnične napake branja. **Razrešitev = faza 2 (usklajevanje) po naročilu.**

Pomembno: **nobena od teh povezav NI vgrajena kot novo dejstvo v muzej.** Zemljevid (val 52) ima svojih 11 vezav, potrjenih po svojem standardu; val 53 doda le raziskovalni register + kuratorsko vrsto.

---

## E. MISSING (ni ugibanj)

1. **BP 15–20** — pod okrnjenostjo p3 ali pravi preskok; kontrola ob re-downloaodu p3 (P3-E12).
2. **Zollamt bp 98** — PUA opomba veže carinski urad (h.70) na B.P. 98; val 53 branja bp 98 konfliktna (h.39/h.50, »Schim[?]er Mache[?]«) → vezava ostaja iz PUA opombe, PT stran ne potrjuje (REVIEW-CONFLICT).
3. **Polovične parcele 7½/8½ (p3)** — 2 različni branji (»7,8« vs »7½,8½«); kontrola v polni ločljivosti.
4. **p8 sub-vrstice 1–11** — dodelitev stolpcev nejasna; kontrola v polni ločljivosti + kontekst naslednjega protokola.
5. **Podpisa na p8** — nečitljiva; morda ista kot na PUA p49 (10. Jänner 1825 + 3 podpisi) — kontrola v polni ločljivosti.
6. **Areal stolpec** — vrednosti prebrane, enote (Klafter²?) niso eksplicitno označene v tabeli; ne vgrajeno.

---

## F. Vgradnja

- **+0 virov, +0 trditev, +0 UI** — raziskovalni val (POBRANJE, ne usklajevanje).
- **+1 kuratorska vrsta: P3-E14** (PT N083 popoln prepis — konfliktne vezave bp→h, vrzel 15–20, Musterstellung, PUA↔PT nesoglasja imen → faza 2 usklajevanja + kontrola v polni ločljivosti).
- Kuratorska vrsta: **137 vprašanj** (136 + P3-E14).
- Stanje zbirke: **113 zapisov, 589 virov, 469 identitet — nespremenjeno.**

## G. QA

`tests/pt-n83-register.test.ts` — 10 trditev: vir/docid, 97 unikatnih BP brez praznih, p8 izključen iz BP-registra, val52-p5 izključen, review_status iz dovoljenih vrednosti, STABLE ⇒ glasovi ≥2, gap 15–20 brez vrstic, vsaka vrstica z branjem (provenanca), page-records 8 strani + p3 okrnjena, Musterstellung povzetek prisoten. Skupni suite: **151/151 zelenih** (141 + 10).

## H. Surovine

- `research-griblje/pt-n83/` — register.json (100 vrstic + izključitve + Musterstellung), register.csv, page-records.json (8 strani z provenanco branj)
- `research-griblje/raw-web-val53-2026-10/` — pt-vlm/ (14 × .ok.json), pt-zoom/ (6 × 2× PNG + p3-recovered.jpg)
- prior: `raw-web-val41-2026-10/` (strani + OCR), `raw-web-val52-2026-10/pt-vlm/` (7 strukturnih branj)
