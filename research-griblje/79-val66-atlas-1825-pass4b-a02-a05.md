# 79. val — ATLAS 1825 PASS 4b: A02–A05 BUILDING INVENTORY v1 (issue #42 §7)

**Datum:** 26. 9. 2026 · **Način:** lokalni deterministični val (brez VLM klicev) · **Instrument:** instrument vala 61/65 na 4 novih kartografskih virih (2-prehodno agentovo branje + R/R2 kontrole)

## Naročilo

Nadaljevanje po val 65 (user: "odlicno nadaljuj"). Naslednji val po worklogu: **PASS 4b = A02–A05 isti 2-prehodni protokol** (zunanji objekti + Traverne A05).

## Kaj je bilo narejeno

### 1. Instrument: deterministični izrezki listov A02–A05

- `research-griblje/atlas-1825/pass4b/make-a02a05-crops.py` — viri `raw-web-val42-2026-10/n083a-pages/{a227668,a227670,a227671,a227673}.jpg` (val 42)
- **PREHOD A**: mreža 2×/1.9× čez cel list (A02: 4×2, A03/A04: 3×2, A05: 4×2 ploščic)
- **PREHOD B**: 3×2 oziroma 2×2 z odmikom (250,260)/(260,270) @1.6× — ni sidran na A
- **T**: naslovni pas (2 izrezka/list @2.2×) + A01 kot @2.5×; **R**: 25 ciljnih izrezkov 3×–6×; **R2**: 6× super-zoom na glife vasi A02 + Traverne
- crops gitignored, regenerabilni; 57+25+6 = 88 izrezkov

### 2. Registriran inventar: `atlas-1825/pass4b/a02-a05-building-inventory-1825.json` (build-pass4b.py)

**10 objektov v66** (A02: 8, A03: 0, A04: 0, A05: 2) + **5 negativnih najdb** + **9 mejnih točk** + **21 toponimskih opazovanj**:

- **A02 (sekcija II, O.IX.24ci)**: *CERKEV sv. Vid* (MO-A02-001, stavba + **temni križ** @~1975,570, CLEAR) — prva kartografska lokacija cerkve v zbirki; 3 BP kandidati iz range 1–29: **„12." CLEAR @6×, „20" PROBABLE, „22" PROBABLE** (prve berljive nizke glife!); 3 kvadratni orisani gospodarski objekti JV od vasi (glife neberljive); 1 velik oranžen kmetijski kompleks
- **A03 (III, O.IX.24dg)**: **NIČ stavb** (cel list 2-prehodno) — čista njivsko-travniška sekcija; na praznem papirju kurzivna pripomba **»grüble«** s simbolom (R @6× — kazalec na list z vasjo)
- **A04 (IV, O.IX.24cg)**: **NIČ stavb na k.o.** (potrjen val 42); 2 lažna kandidata ZAVRJENA z R/R2 ("Rinn stavba" = artefakt; "na Rebar koče" = parcelni orisi z drevesi)
- **A05 (V, O.IX.24ch)**: vinogradniški klaster **Pri Jankovich** = podolgovati trakovi z ~8–15 drobnimi kočami (grupni zapis, glife neberljive @2634px) + velik rumen kvadraten parcel
- **vas na A02 = ISTA vas kot na A01** → CORROBORATION_ONLY, **ni dupliranja** MAP_OBJECT; vtiši glif @3× zapisani kot VTISKI, ne podatki (§12); merge v BP matrico PREPOVEDAN brez A01↔A02 sidra

### 3. KG v1.3: +10 MAP_OBJECT, SRC katalog obogaten, RG-001 zaprt

- **+10 MAP_OBJECT** (MO-A02-001…008, MO-A05-001…002) + DEPICTED_ON → SRC-A02/SRC-A05; **+3 CORRESPONDS_TO_BP** (BP:012/020/022, claim-first REVIEW, confidence low, merge-prepovedan note)
- **SRC-A01–A05 nosijo zdaj**: napis družine "Siche die Reambullirungs Beimappe", sekcije II–V, kode O.IX.24ci/dg/cg/ch, family_vintage UNRESOLVED
- **KG-F05 (OPEN)**: družina listov — vsi 5 nosijo isti napis (R-A01-title-full!); A01 = detaljni list vasi ~2.4× večjega merila; numeracija se nadaljuje III→IV (1966→1967); vintage (izmera 1824/27 vs reambulacija) = arhivsko vprašanje
- **KG-F06 (RESOLVED-V66)**: PASS 4b povzetek; **RG-001 → RESOLVED-V66** (vseh 5 listov inventariziranih v1)
- counts: **3.309 nodes / 3.569 edges / 621 claims / 8 gaps / 4 story atoms / 0 invariant-kršitev**

### 4. Najdbe (F-A02-01…03, F-A03-01, F-A04-01/02, F-A05-01…04)

| ID | Vsebina | Status |
|----|---------|--------|
| F-A02-01 | naslovna annotacija A02: val 66 »S'.Veith ist keine Ortschaft« vs val 42 »als eine Obrigkeit« | UNRESOLVED (2 branji) |
| F-A02-02 | **cerkev sv. Vid na A02 s križem** — na A01 je ni, ker A01 odreže NW rob (razlaga NF-A01-01) | RESOLVED-V66 |
| F-A02-03 | vas A02 = vas A01; BP kandidati **12/20/22** @6× — prvi iz 1–29 | RESOLVED-V66 (merge pending sidro) |
| F-A03-01 | sekcija III brez stavb; numeracija 1966→1967 se nadaljuje na IV | RESOLVED-V66 |
| F-A04-01 | sekcija IV brez stavb (potrjen val 42); 2 lažna kandidata zavrhjena | RESOLVED-V66 |
| F-A05-01 | meja A05 = **WEIDENDORF** (W-A-I-D-E…), ne »WAUENDORF« (val 42) | RESOLVED-V66 |
| F-A05-02 | »vas 50–60 hiš« (val 42) = **vinogradniški trakovi s kočami** | RESOLVED-V66 |
| F-A05-03 | mejne točke **N°1–9** prek listov = verjetno PR Grenz-Beschreibung točke No.1–21 — prva kartografska vezava PR↔zemljevid | OPEN → PR re-read |
| F-A05-04 | **»Schimshu Dravi N°8« (val 66, cel napis @5×) vs »Schumsthl Traverne« (val 42, izrezek odrezan pri x=1145 — rep ni bil viden!)** — če velja val 66, Traverne = mejna točka in **gostilniški signal MVG-109 se OSLABI** | UNRESOLVED — obe branji, nič vgrajeno |

### 5. QA

- `tests/atlas-1825-pass4b.test.ts` — **14 testov** (identiteta listov, cerkev, BP kandidati brez merge-a, georef UNKNOWN brez izmišljotin, negativni rezultati, F-A05-04 obe branji, mejne točke, KG integracija z verigo MO→SRC-A02→vac_url, invariante)
- posodobljena pričakovanja: KG test (v1.3, 6 findings, MAP_OBJECT 34), evidence API test (v1.3), a01-buildings test (filtrirano A01, RG-001 RESOLVED-V66)
- **suite 275/275 · tsc čist · lint čist · api-smoke 55/55 (živi :3001, +2 val 66 preverka: cerkev veriga + glifa 12.)**

## Methodološke opombe

- **Preciznost pozicij izrecno per objekt** (±8–60 px R-precizno; ±100–150 px iz ploščic) — ocene iz ploščic so se izkazale za ~±100 px negotove; R izrezki potrdijo vsebino, ne exaktno px.
- **Georef = UNKNOWN** za A02–A05 (ni sidra) — lat/lng bi bila izmišljotina (§12).
- Val 42 branja (Traverne, WAUENDORF, vas 50–60 hiš) **ohranjena kot variantе** — popravki dokumentirani, ne izbrisani (§5/§12).

## Žetoni/kvote

- Ves material lokalni (rastri val 42); nič VLM klicev; nič web-fetcha.

## Naslednje

1. **Ob kvoti**: PS p56–143 (aplikacija tudi API vir) + PT p7 re-read @300dpi (KG-F01/F04 + RG-008) + **PR re-read** (mejne točke No.1–21 ↔ F-A05-03)
2. **PASS 5**: map data model (§15) — zemljevid kot podatkovni sloj (UI Evidence Explorer)
3. višji dpi re-readi: BP glife vasi A02 (sidro A01↔A02!), koče A05, naslovne annotacije
4. izven peskovnika: šolski list / SA Podzemelj / SI AS 749 / Zucchelli NR-10 (arhivsko vprašanje družine listov = KG-F05)
