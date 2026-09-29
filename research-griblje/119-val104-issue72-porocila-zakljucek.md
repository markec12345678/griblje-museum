# 119 · 104. val — ISSUE #72: vseh 10 preostalih poročil z javnimi prenosi prebranih v celoti (2013–2023) — pokritost prvih poročil registra ZAKLJUČENA (24/24)

**Datum:** 2026-09-29 · **Veja:** `feat/val104-issue72-porocila` · **Baza:** main @ c0cc5f3 (val 103, PR #106)

## 1. Naloga

Val 103 je z javnimi eSDE prenosi prebral 8 preostalih poročil in ugotovil, da register v polju `URL_POROCILO1` vpiše javne prenose za 24 od 26 raziskovalnih zapisov — preostalih **10** (17-0374, 17-0481, 17-0497, 19-0552, 13-0078, 20-0297, 21-0130, 20-0261, 21-0406, 23-0261) pa čaka na branje. Val 104 jih prebere **vseh deset** — s tem je vsebinska pokritost prvih poročil registra **ZAKLJUČENA (24/24)**; brez prenosa ostajata le 26-0326 (poročilo oddano v pregled) in 26-0379 (šele napredita raziskava).

**Metoda (0 VLM, 0 spletnega iskanja — 0 AI klicev):** deterministični `curl` na `ised.gov.si/api/javna/neavtoriziran/arheo/prvo_porocilo/files/{ID}/download` (ID-ji iz registra vala 102), `pdftotext -layout`, polno branje podatkovnih blokov, povzetkov, ugotovitev in sklepov. Artefakti: `val104/porocila/` (5 PDF komittanih + 10 TXT + `sha256-pdf.txt` z hashi tudi izbrisanih velikih PDF) + `summary.json`. Opomba: prenos 21-0406 je bil ob prvi izvedbi okvarjen (nepreberljiva xref tabela — verjetno prekinjen prenos); ponovljen v celoti in validiran z `pdftotext`.

## 2. Poročila (10) — ključne ugotovitve

| Koda | Lokacija / objekt | Rezultat | Bistvo |
|---|---|---|---|
| **13-0078** (Arheoterra/Kovač 2013) | Vodovod Dobliče–Žilje; parcele 667–2979 (južni rob, vzporedno s poljsko cesto) | **Negativen za strukture** | 11 ročnih testnih jarkov 1 × 2 m čez cca. 260 m; v zgornjih 20–30 cm koluvija (SE 002) 17 odlomkov keramike: **7 prazgodovinskih (preliminarno pozna bronasta doba)**, 3 SV, 4 mlajšedobni, 3 moderni — sekundarna lega; najdbe »potrjujejo prisotnost arheoloških ostalin«; TJ 11 premešana plast z 1 atipičnim odlomkom (ni v primarni legi). **Najstarejše prebrano poročilo z javnim prenosom na najdišču — popravek vala 102 razrešen v praksi (ID 26367)** |
| **17-0374** (Filipidis 2017) | Dva montažna silosa, parceli *43, 653 (lastnik Šegina) | **NEGATIVEN** | 8 ročnih sond 1 × 1 m (0,87 % pokritost); antropoloških struktur ni; najdbe v nasutjih in kultiviranem koluviju — sekundarna, premeščena lega; vse novega veka **razen treh najverjetneje zgodnjesrednjeveških odlomkov**; na JZ robu porušena hiša Griblje 59 |
| **17-0481** (ARHOS/Olić 2017, por. št. 34/2017) | Griblje – Brodarič; *79, 94, 106/1 — hlev + zbiralnik gnojnice | **NEGATIVEN** | Strojni testni izkop; stratigrafija: recentno nasutje s smetmi → koluvij brez najdb → geološka osnova; »nismo odkrili ostankov, ki bi nakazovali na obstoj arheološkega najdišča«; vodja mag. Alenka Jovanović. **Neskladje: naslov navede *79, sklep *76** |
| **17-0497** (ARHAT/Tiran 2017) | Šterk, parcela 657/3 — kmečka lopa | **NEGATIVEN** | 2 testni jami 1 × 1 m ob nasutem dovozu (zgornja nasutja strojno, nižje ročno); brez materialnih ostankov in struktur; ruša → nasutji → hodna površina (SE 004) → sterilni koluvij → geološka osnova. **Neskorij: podatki navedejo občino Gradac; terensko 16.11. 5 dni PRED datumom soglasja 21.11.** |
| **19-0552** (ARHAT/Tiran 2019) | Krajnc, parceli 162 in 160/4 — nadstrešnica + drvarnica | **NEGATIVEN** | 2 ročni jami 1 × 1 m; območje ob gradnji hiše nasuto in izravnano (SE 002); le sodobni material (keramika, železo) v nasutju in meljasti glini (SE 003); podtalnica od cca. 70 cm (TJ 1) |
| **20-0261** (ARHAT/Tiran 2020) | Griblje – Pezdirc, parcela 810 — dva nadstreška + letna kuhinja | **NEGATIVEN** | 2 ročni jami 2 × 1 m; lastnik: zemljišče ni bilo kmetijsko obdelano; le recentne najdbe (pločevinke, steklenice); »kulturnih sledi … nismo zaznali«; geološka osnova prod/prodnati pesek (~80–120 cm) |
| **20-0297** (Avgusta/Gruden 2020) | Hiša Griblje 30, parcele 791/4, 792/4, 790/3 | **Pozitiven omejeno** | 4 ročne jame 2 × 1 m; identična stratigrafija (ruša → ornica → koluvij SE 3 → zbita glina ~80 cm); 23 najdb / 289 g; **6 odlomkov prazgodovinske lončenine (20 g) v SE 3** (TJ 2, TJ 3); zaobljenost robov → »sekundarno z izpiranjem z bližnjega višjeležečega najdišča« (domneva); brez struktur. Nadaljevanje = 21-0130 |
| **21-0130** (Avgusta/Klokočovnik 2021; avtorja Gruden, Omahen) | Hiša Griblje 30 — raziskava ob gradnji (ISTE parcele) | **Pozitiven omejeno** | Izkop gradbene jame 22 × 10 m (230,3 m²); 95 najdb / 665 g — **86 przg. odlomkov (568 g) + hišni lep** v SE 3 neposredno nad geološko podlago; **najzgodnejše verjetno ENEOLITSKE**: fragment z rdečim premazom (savska → lasinjska skupina), odebeljeno ustje sklede (Gradec pri Mirni, Turnišče); lonec Ha (Veliki Nerajec grobovi 1/5/7 — Podzemelj 1; Kučar prva faza po Grahek 2020); **4 posnetki italske sigilate, 3 istega ustja = oblika 7.1.1** (avgustejsko; → Dragendorff 33); **TRI VKOPI ZA KOLE** na nivoju geološke podlage (SE 5/6, 7/8, 9/10) — »morda bi šlo lahko za ostanke lesene stavbe« (domneva; vkopi brez najdb) |
| **21-0406** (STIK/Hvalec 2021) | Javna razsvetljava Griblje–Brinsko selo; 16+ parcel, jarek cca. 940 m | **Negativen za starejša obdobja** | Večina trase po odstranjeni asfaltni cesti; nasutja cestišča, robne kdaj ornice s sodobno zdrobljeno opeko; sodobna + novoveška keramika (P12, P20, P24); »starejših materialnih ostankov ali struktur … nismo odkrili«. **Neskladje: uvod navaja še KVP 35105-0300/2014/4** |
| **23-0261** (STIK/Pižmoht, Magdič, Pavković, Klasinc, Draksler 2023) | Javna razsvetljava z vkopom kablovoda — »Dolnje Griblje«; izkop 700 × 0,60 m | **ARHEOLOŠKO POZITIVNO** | 67 najdb / 1.248 g v 24 DIS: przg. 22 (133 g) v koluvijih SE 1007/1008, SE 1012, SE 1005 (grobozrnata masa z grogom); rimska 2 gradbena odlomka; novi vek 33 (1.009 g). **PRVI CESTNI OSTANKI V RAZISKAVAH VASI: dve novoveški cesti iz prodnikov** (SE 1017 + SE 1021) pod asfaltom z obcestnim jarkom SE 1016; SE 1012 verjetneje novoveški kolovoz. Popravek v poročilu: SE 1005 na terenu »geološka osnova« → koluvij. **TRETJI projekt 2023 — vsebina zdaj potrjena (poleg 23-0070, 23-0168); trajna hramba: BM Metlika** |

## 3. Izrecno odkritje: pokritost ZAKLJUČENA (24/24)

Po valu 104 je **vseh 24 raziskav z javnimi prenosi prebranih v celoti** (6 v valu 102 + 8 v valu 103 + 10 v valu 104). Brez javnega prenosa ostajata le **26-0326** (poročilo oddano v pregled) in **26-0379** (raziskava šele napredita — terensko oktobra/novembra 2026). Vsebinska pokritost prvih poročil registra EŠD 10094 po javnem eSDE kanalu je **zaključena**.

## 4. Vgradnja (add-only, izključno MVG-083)

- **+10 virov:** `kovac-2013-vodovod-667-2979`, `filipidis-2017-silosa-43-653`, `olic-2017-brodaric-79-94-106-1`, `tiran-2017-sterk-657-3`, `tiran-2019-krajnc-162-160-4`, `gruden-2020-hisa-griblje-30`, `gruden-omahen-2021-griblje-30`, `tiran-2020-pezdirc-810`, `hvalec-2021-razsvetljava-brinsko-selo`, `draksler-klasinc-2023-razsvetljava-dolnje-griblje` — vsak z opombo sl+en (»104. val — poročilo prebrano v celoti«), licenca javnega prenosa, URL eSDE.
- **Zgodba sl+en:** nov odstavek (»104. val je vsebinsko pokritost prvih poročil registra ZAKLJUČIL …«) + označevalec dopolnila pri »Muzej išče« (»Doplnilo 104. vala: … ZAKLJUČENA, 24/24 …«).
- **Izrecen prehod števcev:** +0 zapisov (114) / **+10 citati (641 → 651)** / **+10 identitet (517 → 527)** / deljenih 69 — readme-sync zeleno.
- ATLAS §22 NEIZMENJAN; veriga #100 §8 NEIZMENJANA (F0000212 = št. 73 INFERRED).
- Pini val 101 + val 102 + val 103 posodobljeni: 641/517 → **651/527** (izrecna opomba o prehodu vala 104).

## 5. Poštenost (§11 invariante)

- Negativni rezultati (13-0078, 17-0374, 17-0481, 17-0497, 19-0552, 20-0261, 21-0406) zapisani **z enako težo** kot pozitivni — 7 od 10.
- Sekundarne lege izrecno: 13-0078 (koluvij, zgornjih 20–30 cm), 17-0374 (premeščena lega), 20-0297 (izpiranje — domneva), 23-0261 (koluviji).
- Domneve prenašane kot domneve: lesena stavba pri vkopih za kole (21-0130), izpiranje z bližnjega najdišča (20-0297), novoveški kolovoz (23-0261).
- **Šest neskorij zapisanih, ne rešeni:** *79 vs *76 (17-0481); občina Gradac (17-0497); terensko pred soglasjem (17-0497); dva KVP-ja (21-0406); naslov 19 parcel vs podatkovni blok 3 (23-0261); SE 1005 terenska interpretacija popravljen v samem poročilu (23-0261).
- Popravek vala 102 razrešen v praksi (13-0078 = ID 26367, prebrano); trajna hramba BM Metlika izrecna v 23-0261.

## 6. QA

- **+34 varovalk** (`tests/val104-issue72-porocila-zakljucek.test.ts`): identitete virov, izključnost MVG-083, dobesedni odlomki poročil (sl+en normalizirano; 21-0406 na odstranjenih presledkih), zgodba (sl+en), prehod števcev 114/651/527/69, artefakti + sha256 + presence/absence PDF, summary.json, docs (119 + KAZALO + README 158. sklop).
- Pini val 101 + val 102 + val 103 posodobljeni: 641/517 → **651/527**.
- `tsc --noEmit` čist · eslint na spremenjenih datotekah čist · celotna testa: pass/skip/fail zapisano v commit sporočilu.

## 7. Surovine

`research-griblje/val104/`:
- `porocila/` — 5 PDF komittanih (17-0374 2,7 MB, 17-0481 3,1 MB, 17-0497 3,1 MB, 19-0552 4,6 MB, 21-0130 5,7 MB) + 10 TXT (pdftotext -layout) + `sha256.txt` + `sha256-pdf.txt` (hashi vseh 10 PDF, tudi izbrisanih)
- 5 velikih PDF hashiranih in izbrisanih (vzorec val 102/103): 13-0078 (8,1 MB, `ec13a7df…`), 20-0261 (9,5 MB, `20a44876…`), 20-0297 (7,6 MB, `4b738393…`), 21-0406 (26,6 MB, `2ae2a33a…`), 23-0261 (20,5 MB, `09f13b9a…`)
- `summary.json` — polna struktura: porocila_prebrana ×10 z ključnimi ugotovitvami, odkritje_vala (24/24 zaključeno), vgradnja, brez_podvajanja, fairness, artefakti

## 8. Naslednje

1. **Vsebinska pokritost prvih poročil registra ZAKLJUČENA (24/24)** — nove raziskave pridejo z novimi vpisi (26-0326 oddano v pregled; 26-0379 napredita za okt./nov. 2026) ali prek izven-sandboxeskih dostopov.
2. Dular 1972 vsebina (CONFLICT 1972/1973) — izven peskovnika.
3. BM Metlika (Vavpotič zbirka danes) — izven peskovnika.
4. 86b del 3 (p110–142, ~250 tile-ov) ob VLM kvoti.
5. PZ p48–65; PT p7; PR Grenz-Beschreibung; VS 48 v celoti (REVIEW letnica); arhivska potrditev Draganić (§3).
