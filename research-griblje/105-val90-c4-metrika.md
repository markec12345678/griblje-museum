# 105 — 90. val: C4 ARITMETIKA — DETERMINISTIČNA IZČRPNA PREVERBA KONVENCIJ ("metrika stolpcev TO-DECODE")

**Issue:** #42 (§4/§14) + #43 · **Datum:** 2026-09-28 · **Vhod:** 0 VLM, 0 spleta, 0 kvote
**Artefakt:** `ps-n83/band-v86/c4-metrika-v90.json` (determinističen, re-run byte-identno, testno varovano)
**Disciplina:** **+0 sprememb** registra / KG / story / timeline / coverage (§4/§22) — čista diagnostika po vzoru 86b 1. dela.

---

## 1. Kontekst in namen

- **val 61** (`74-val61-ps-n83-reread.md` §2.2): sidra p5–54 (13 točk, agentov direktni vid, 0 VLM) + izrecno odložena kontrola: *"aritmetična kontrola sešteka vrstic šele pri 143/143"*; `value_semantics_status.confirmed` = *"(J|QKl) = vsota TEKOČE strani, ne kumulativa (p11 2J798 < p5 6J1459 izključi kumulacijo)"*.
- **val 86b** (`101-val86b-f11-fuertrag.md` C4): p56–143 = **0 OK / 76 REVIEW / 12 brez** — *sistematično neničelne razlike; razpad po kultur zabeležen; hipoteze izrecno neodločene (§4)*.
- **val 90** izvrši **odloženo aritmetično kontrolo vala 61 na sidrih** (ta ni bila nikoli izvedena) in **izčrpa deterministični prostor konvencij** na obstoječih comittanih podatkih. Izvedljivo točno ZATO, ker je 86b 2. del blokiran na kvoti (429) — vzorec 86b 1. dela (kvoto-neodvisna kontrola kot lasten val).

## 2. Metoda

Vhod (vsi comittani artefakti; sha256 zabeleženi v meta artefakta):
`register.json` (2.871 vrstic) · `reread-2026-10/totals-reread.json` (val 61 verified_chain: `value`, `crossed`, `red_line`) · `band-v86/f11-fuertrag-v86.json` (val 86b glasovi). Parser 1:1 import iz `build-f11-fuertrag-v86.py` — **nič podvojenega**. Prostor **J·1600+QKl** (Joch = 1600 QKl, val 61 format-dekodiran).

Konvencije (vsaka izčrpano testirana na 13 sidrih; `build-c4-metrika-v90.py`):

| # | konvencija |
|---|---|
| K1 | vsota strani (gestrichen **izključeno**) == anchor value |
| K2 | vsota strani (gestrichen **vključeno**, surovo) == anchor value |
| K3 | **kateri koli zvezni odsek** vrstic strani (i..j) == anchor value |
| K4 | **priponska sekcija čez strani** (s..konec strani, s ≤ 160 vrstic nazaj) == anchor value |
| K5 | imenski bloki (dito) + unije do 5 sosednjih zaključenih blokov == anchor value |
| K6 | **rdeči popravki** (red_line, 7 strani) == vsota strani (obe varianti) |
| K7 | p56–143: reprodukcija C4 val 86b (kontrola usklajenosti) |
| K8 | usklajenost dveh vnosov sidrov: ANCHORS_V61 (f11 builder) ↔ verified_chain (val 61) |
| K9 | konfunda indikatorji **F-PV-05** (stolpčna bolezen) — formatno usklajena klasifikacija polj |
| K10 | opazovalni register (podvojeni vrednosti, križni ujemi) |

## 3. Rezultati

### 3.1 Sidra — vrednost vs vsota strani (K1)

| stran | anchor | crossed | rdeča | reg K1 (izklj.) | diff | vrstic |
|---:|---|---|---|---:|---:|---:|
| 5 | 6\|1459 | DA | 3\|906 | 15632 | +4573 | 20 |
| 11 | 2\|798 | DA | 81 | 6311 | +2313 | 23 |
| 12 | 4\|7986 | DA | 2\|1551 | 6981 | −7405 | 20 |
| 14 | 6\|1088 | DA | 6\|77 | 10175 | −513 | 20 |
| 16 | 5\|811 | ne | — | 9926 | +1115 | 20 |
| 20 | 6\|1183 | ne | — | 11800 | +1017 | 20 |
| 24 | 8\|1310 | DA | 1\|919 | 12678 | −1432 | 20 |
| 32 | 6\|1244 | DA | 3\|265 | 10419 | −425 | 20 |
| 35 | 2\|798 | ne | — | 4198 | +200 | 20 |
| 36 | 2\|1578 | DA | 3\|349 | 5589 | +811 | 20 |
| 42 | 7\|365 | DA | 1\|815 | 14113 | +2548 | 21 |
| 44 | 6\|255 (red 4\|1030) | DA | 4\|1030 | 9033 | −822 | 20 |
| 54 | 8\|1165 | DA | 7\|943 | 10254 | −3711 | 21 |

Predznaki razlik so **mešani** (+/−), velikosti 200–7.405 QKl — ni sistematike ne v predznaku ne v velikosti.

### 3.2 Verdikti konvencij

| konvencija | ujemi (iz 13 sidrov) | status |
|---|---|---|
| K1 vsota strani (gestr. izklj.) | **0/13** | OVREŽENA |
| K2 vsota strani (gestr. vklj.) | **0/13** | OVREŽENA |
| K3 kateri koli zvezni odsek | **0/13** | OVREŽENA |
| K4 priponska sekcija čez strani | **0/13** | OVREŽENA |
| K5 imenski bloki + unije | 0/13 — **NEDEDOKAZLJIVO** (glej 3.4) | NEODLOČENO |
| K6 rdeči popravki == vsota strani | **0/7** (najmanjši diff 440 QKl p36; p54 red = −1.889) | NEPOTRJENA |
| K7 reprodukcija C4 val 86b | **0 OK / 76 REVIEW / 12 brez; 0 neskladij vsot** | REPRODUCIRANA |
| K8 vnosi sidrov | value **12/13**; red **1/13** (p44) | USKLAJENA z izjemo p44 |

### 3.3 K8 — p44: dvojni vir, mešana politika

`totals-reread.json` (val 61) za p44: value **6|255** (prečrtano) + rdeča **4|1030**. `ANCHORS_V61` v f11 builderju za p44 uporablja **4|1030 = rdečo vrednost** (edini tak primer; na vseh ostalih 12 straneh črno `value`). Vpliv: **NIČ** — C2 (veznost) in C5 (sidra val 85) uporabljata samo števce, ne vrednosti. Dokumentirano kot vnosna nekonsistentnost vala 61, brez korekcij (§4).

### 3.4 K9 — konfunda F-PV-05 (zakaj ovržbe NISO artefakt stolpčne bolezni)

| indikator (vrstice) | p1–55 (val 57) | p56–143 (v82+sloji) |
|---|---:|---:|
| jaethe: 100–1599 (nemogoče št. Jochov → verjetno K v napačnem stolpcu) | **323** | **242** |
| klafter: 100–1599 (običajna K vrednost) | 507 | 1154 |
| jaethe: ≤ 99 (običajna J vrednost) | 115 | 276 |
| plain > 1599 (staknjene števke / dvoumnost) | 11+18 | 14+55 |
| poljuben J.K format | 1 | 7 |

Ključno za interpretacijo: **preskok vrednosti med stolpcema (J↔K) NE spreminja vsote strani v prostoru J·1600+QKl** (`row_area_qkl` vsota obeh polj — ista številka, poljuben stolpec). Vsotno-relevantni razredi so samo `plain_gt1599` (29/69 vrstic, meja napake ~1.200 QKl/vrstico) in `jk_format` (1/7) — precej premalo za razlike do 7.405 QKl in **ne morejo pojasniti mešanih predznakov**. Ovržbe K1–K4 so zato **genuine, ne artefakt F-PV-05**. (Atribucija 323/242 vrstic ostaja sama po sebi problem za per-vrstične trditve — vstopa v vrsto za re-read, glej §6.)

### 3.5 K10 — opazovalni register (surova dejstva, brez sklepanja)

- **anchor vrednost 3998 (2|798) na DVEH straneh**: p11 in p35 (val 61 je že beležil VLM zamenjavo p35↔p42 števcev; vrednost pa je v obeh virih enaka).
- **p56 glas p1 (11059) == p5 anchor (6|1459)** — natanko ista vrednost čez 51 strani. Zabeleženo, ne razloženo.

## 4. Sklepi

1. **val 61 §2.2 `confirmed` se precizira (brez spreminjanja artefaktov):** nerozključiva kumulacija OSTAJA potrjena (p11 < p5), trditev *"(J|QKl) = vsota tekoče strani"* pa je bila **nepreverjena inferenca in je aritmetično NEPOTRJENA** (K1 0/13 — na sidrih, ki veljajo za bazno resnico). Odložena kontrola vala 61 je tako izvršena **9 strani pred 143/143** — rezultat je odločilen in neodvisen od 86b 2. dela.
2. **Metrika Fürtrag ostaja TO-DECODE** — zdaj z izčrpanim determinističnim prostorom: nobena od 4 testabilnih konvencij ne reproducira sidrov; prostor "preprostih vsot" je **izčrpan**.
3. **Rdeče vrstice (semantika TO-DECODE od vala 61):** tudi rdeče vrednosti niso vsote strani (K6 0/7) — hipoteza "popravljen seštevek iste per-sko-ki enote" oslabljena, hipoteza "prenos/kontrolni zapis druge enote" ostaja odprta.
4. **Hipoteze za naslednje rundi (prioriteta, izrecno neodločene):**
   - **H-A Fürtrag po holdingih (Jaethe)** — števec val 61 = tekoči indeks holdingov; vsota se nanaša na holding, ne na stran. Z obstoječim registrom NEPREVERLJIVO: dito detekcija neuporabljiva (233/2.871; bloki 1,1 vrstic — K5 neodločeno). Odloča imenski re-read (kvota).
   - **H-B več Fürtragov na stran** — glasovi so že seznami; 86b 2. del bo pokritost dvignil, C4 z K-konvencijami se regenerira deterministično.
   - **H-C metrika ni vsota površin** (npr. taksa/kapital) — K3/K4 izključujeta vsote vrstic znotraj strani, ne druge mere; nič ne izključuje, izrecno odprto.
5. **Vpliv na tekoče valove: NIČ (§4/§22).** C4 val 86b ostaja kot je; 86b 2. del (kvota) ostaja **#1**; ta artefakt se po 86b 2. delu deterministično regenerira (vhod f11 artefakt).

## 5. Testi in determinizem

- `tests/val90-c4-metrika.test.ts`: varovalke K1–K4 = 0/13, K7 = 0/76/12 + 0 neskladij, K8 = 12/13 + 1/13 (p44), K9 pin števcev (323/242, 29/69, 1/7), K10 (3998 = [p11, p35]; p56 glas == p5 anchor), meta verdict, **re-run byte-identno** + **§4 negativna varovalka** (register.json sha nespremenjen).
- Runner: `python3 research-griblje/ps-n83/build-c4-metrika-v90.py` (0 odvisnosti, 0 omrežja).

## 6. Naslednje

1. **86b 2. del (kvota)** — ostaja #1 (procedura pripravljena, resumable).
2. **K4 metrika regeneracija po 86b 2. delu** (deterministično, samodejno z novim f11 artefaktom).
3. **p1–55 stolpčni re-read (F-PV-05 razširitev)** — vstopi v vrsto za kvoto (za per-vrstične J/K trditve; vsotno neutralno, glej 3.4).
4. F-PV-03 → F14 glava @300dpi → PZ p48–65 → PT p7 @300dpi → PR Grenz-Beschreibung (nespremenjeno).
