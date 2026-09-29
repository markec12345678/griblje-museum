# 117 — Val 102: ISSUE #72 — izvorna registrska enota EŠD 11081/10094 po GISKD API-ju, register raziskav eArheologija (26 zapisov, 2013–2026) in javni eSDE prenosi — 6 prvih poročil prebranih v celoti

**Val:** 102
**Datum:** 29. 9. 2026
**Issue:** #72 (raziskava, brez podvajanja)
**Naročilo:** »odlicno nadaljuj« — nadaljevanje odprtih točk issue #72 po valih 91–101

---

## 1. Stanje pred valom

main @ 132e213 (val 101, PR #104). Iz issue #72 so bile odprte: izvorna registrska enota EŠD 11081 (val 91 je vnesel samo javni pregled), vsebinska poročila raziskovalnih kod (val 95: COBISS identitete, vsebine TO_COLLECT; »ID zahteva eSDE prijavo«), Dular 1972 vsebina, današnje stanje BM zbirke. Kvota web_search/VLM = 429 (celoten val).

## 2. Metoda (0 VLM, 0 spletnega iskanja — deterministični curl)

1. **Sonda domen**: gov.si / zvkds.si / javnipodatki.si / kamra.si / slov.si / etno-muzej.si = 200; sistory 403; dlib.si 000; NUK 000; books.google 429. **belakrajina.si (Belokranjski muzej) = 200, a za JS-izzivom** (»One moment, please...«; agent-browser ne preide) — pošten negativ runde »BM zbirka danes«, dokaz ohranjen kot artefakt `bm-home.html`.
2. **Prelom poti**: aplikacija GISKD (geohub.gov.si/ghapp/giskd/) je ArcGIS WebAppBuilder; `config.json` razkrije uradne servise `MK/MK_RNPD` (register enot) in `MK/MK_ARHEO` (eArheologija — register raziskav).
3. **Poizvedbe** (artefakti JSON s sha256): sloj 3650 »Arheološka najdišča« — enota EID 1-11081 in EID 1-10094; sloj 3692 »Vrste izvedenih arheoloških raziskav« — vse raziskave na enoti.
4. **Javni eSDE prenos poročil**: `https://ised.gov.si/api/javna/neavtoriziran/arheo/prvo_porocilo/files/{ID}/download` — ID-ji so v polju `URL_POROCILO1` raziskovalnih zapisov. **Vrzel vala 95 razrešena brez prijave.**
5. 6 poročil prenešenih, pdftotext, prebrani podatkovni bloki/povzetki/sklepi.

## 3. Register: obe enoti prebrani iz izvora

| Atribut | EID 1-10094 (ob Kolpi) | EID 1-11081 (Požekov vrt) |
|---|---|---|
| status | VPISANA | VPISANA |
| vpis | **20. 8. 2002** | **30. 10. 2001** |
| zadnja sprememba | 1. 8. 2022 | 1. 8. 2022 |
| površina | **316,57 ha** (skladno s številko »Sto let«) | **11,3 ha** |
| meja | **določena na DKN** | **»območje ni določeno«** — samo točka (N 5047532, E 5523155, GK5, Z 159 m) |
| sinonimi | Kohane, Požekov vrt, Krasinec – Vrh | ni podatka |
| pristojna OE | ZVKDS OE Novo mesto | ZVKDS OE Novo mesto |
| raziskovalni zapisi | **26** | **0** |

**Odgovor na vprašanje iz #72 (27. 9. 2026)**: samostojna enota 11081 je raven evidentiranja zgodnjih 2000-ih (vpis 2001, točkovna lega, brez poligona, brez lastnih raziskav), ne ločenega najdišča; vse raziskave so vezane na širšo enoto 10094 (vpis 2002, meja na DKN). Poštenost: muzej iz točkovne lege NE ustvarja poligonov ali koordinat najdišča.

## 4. Register raziskav eArheologija — 26 zapisov 2013–2026

Nove kode nad muzej (muzej je po zbornikih poznal 2014 KVS brez kode, 17-0053/17-0374/17-0481/17-0497, 19-0552, 20-0261/20-0297, 21-0130/21-0141/21-0406/21-0432, 23-0070/23-0168/23-0261):

- **14-0456** ARHAT/Lavrinc, 19. 12. 2014, parc. 750/3 (= koda za KVS 62240-403/2014/2)
- **15-0081** ARHAT/Lavrinc, 5.–19. 5. 2015, parc. 818–831 (EID tudi 1-19861 Dragoši)
- **16-0021** ARHAT, 1.–2. 2. 2016 · **16-0141** ARHAT, 6. 6.–21. 7. 2016
- **19-0007** ZVKDS CPA/Mulh, 27. 2.–19. 6. 2019 (več enot)
- **22-0169** ZVKDS CPA/Černe, 25. 5.–7. 6. 2022, parc. 67/3 (= Černe 2022!)
- **23-0047** Lavrinc, 28. 2.–12. 3. 2023, parc. 2957 + 201/1 k. o. Krasinec (četrti kodni vpis 2023)
- **25-0350** AVGUSTA/Gruden, 1.–3. 10. 2025, parc. 15/4, pozitivno
- **25-0556** Skupina STIK/Masaryk + Fras, 15.–16. 4. 2026, parc. 668/1 k. o. Krasinec, **negativno**
- **26-0036** ZVKDS CPA/Udovč + Orehek, 23. 3.–2. 4. 2026, parc. 15/4, pozitivno
- **26-0326** AVGUSTA/Nanut + Gruden, 4.–9. 9. 2026, parc. 5214, neopredeljeno (poročilo oddano v pregled)
- **26-0379** ARHEOTERRA/Grahek + Kovač, **2. 10.–7. 11. 2026 — šele napovedana**, parc. 2799

Znane kode dopolnjene z datumi/vodjami (13-0078 = ARHEOTERRA, Kovač, 7.–8. 6. 2013; 19-0552 = 20. 12. 2019; 20-0261 = 13. 7. 2020; 20-0297 = 13. 8. 2020; 21-0130 = 9. 4. 2021; 21-0141 = 15. 4. 2021; 21-0406 = 11. 8.–7. 9. 2021; 23-0168 = 24. 7. 2023). Pošteno: raziskave 1999–2012 v eArheologiji **nisu** (sistem pokriva novejše kode).

## 5. Šest prebranih poročil (javni eSDE prenos)

| Koda | Lokacija / parcela | Datum | Vodja | Ključno |
|---|---|---|---|---|
| 21-0141 | Klepec–Krasinec 2957 (k. o. Krasinec) | 15. 4. 2021 | Tiran | jarek 9,6 m²; hodna površina SE 003 + 2 stojki; **začetek pozne bronaste dobe (pred gradiščno poselitvijo)**; nažlebljena keramika = Ha A; **brez** Oloris–Podsmreka |
| 21-0432 | Krasinec – Jakofčič 668/2–4 | 19.–30. 11. 2021 | Klokočovnik | kulturna plast + 2 kole jami + dvojna jama SE 23/24; 265 najdb (96 % przg.); **kultura Kisapostag, zgodnja bronasta doba**; 2 žrmlji |
| 23-0047 | Krasinec 2957 + 201/1 | 12. 3. 2023 (register 28. 2.–12. 3.) | Lavrinc | 5 testnih jam; **brez struktur**; 37 kosov przg. keramike v koluviju (sekundarna lega); kontekst po Dular 1985, 75–76 |
| 23-0070 | Griblje 67/3 (Brodarič) | 6.–15. 6. 2023 | Udovč + Jerina | vkopi kolev/stojk + kurišče; **vitovitiška skupina Bd C–D (horizont Oloris–Podsmreka)**; **lengyelska savska skupina ~4800/4700–4350 pr. n. št. v sekundarni legi**; skodelica Bd (kat. 68) |
| 23-0168 | Griblje 798/14 + *140 (Piškurič) | 24. 7. 2023 | Lorber + Tiran | **NEGATIVEN rezultat** (zapisan z enako težo); hramba arhiva: **BM Metlika**; ref. Žorž 2013, VS 48, 74–76 (muzej ima 2011 — REVIEW) |
| 26-0036 | Griblje 15/4 (Mahmoutović) | 23. 3.–2. 4. 2026 | Udovč + Orehek | **lengyel znova** (obod z vrezi in vbodi); pitos; naselbinska plast SE 056; MBA/LBA; najdišče se nadaljuje proti zahodu |

**Popravek vala 95 (audit trail)**: COBISS 161615619 (Udovč, Černe, Kramberger 2023) = poročilo koda **23-0070** — NI »četrtih raziskav 2023«; 2023 je potekalo natanko štiri kodi: 23-0047, 23-0070, 23-0168, 23-0261. Neskladja zapisana, ne utišana: datum 23-0070 (junij po podatkovnem bloku + registru; sklep poročila piše »julij«); soavtorstvo Černe & **Veršnik** 2022 (COBISS ne navaja); letnica VS 48 (muzej 2011 vs referenca poročila 2013 = REVIEW).

**Nova povezava za #72**: trajna hramba arhivov raziskav po poročilih = **Belokranjski muzej Metlika, Trg svobode 4** — prvi konkretni naslov za »najdbe, ki jih muzej išče«.

## 6. Vgradnja (add-only)

| Vrstica | Sprememba |
|---|---|
| MVG-083 | +6 virov: `rnkd-giskd-units-10094-11081`, `earheologija-raziskave-10094`, `avgusta-2021-krasinec-668`, `lavrinc-2023-krasinec-2957-201-1`, `lorber-tiran-2023-piskuric-798-14`, `udovc-orehek-2026-mahmoutovic-15-4` |
| MVG-083 | 4 opombe dopolnjene/popravljene: `esd-11081-pozekov-vrt` (izvorna enota prebrana; REVIEW → VERIFIED), `tiran-2021-klepec-krasinec` (vsebina prebrana; CONTENT NOT FOUND → prebrano), `zvkds-cerne-2022-brodaric` (koda 22-0169 + datumi), `zvkds-udovc-2023-brodaric` (izrecen popravek vala 95 + vsebina) |
| MVG-083 | + odstavek zgodbe sl+en (register 2013–2026; predmeti po parcelah; negativ z enako težo; datumi vpisov; BM Metlika) + označevalec dopolnila pri TO_COLLECT stavku |

**Izrecen prehod števcev:** +0 zapisov (114) / **+6 citati (628 → 634)** / **+6 identitet (504 → 510)** / deljenih 69 (nespremenjeno). ATLAS §22 NEIZMENJAN (vse izključno na MVG-083). Veriga #100 §8 NEIZMENJANA.

## 7. Poštenost / fairness

- Negativni rezultat (23-0168) zapisan z enako težo kot pozitivni; neopredeljeno (26-0326) kot neopredeljeno.
- Register daje za 11081 samo točkovno lego — ni poligonov, ni koordinat najdišča, ni izrisov.
- Kisapostag = zgodnja bronasta doba: register »starejša bronasta doba« + poročilo »Kisapostag« — obe oznaki zapisani.
- Hramba arhivov (BM Metlika) = dejstvo iz poročil, ne obiska.
- Prazgodovinska keramika 23-0047 v koluviju — sekundarna lega, zapisana kot sekundarna; domneva o gnojenju (26-0036) prenesena kot domneva.
- Še odprto (TO_COLLECT): vsebina Dularjeve knjižice 1972 (CONFLICT 1972/1973); današnje stanje BM zbirke — Vavpotičevi portreti (belakrajina.si za JS-izzivom; pošten negativ); vsebine ostalih kod (2012–2014!); VS 48 v celoti (razrešitev letnice); akvarel Gasparija (original).

## 8. Artefakti (research-griblje/val102/)

- **Registri**: `rnpd-svc.json`, `rnpd-3650.json`, `rnpd-11081-query.json`, `rnpd-10094-query.json`, `arheo-svc.json`, `arheo-3692-10094.json` (26 zapisov), `arheo-3692-11081.json` (0 zapisov), `giskd-app.html`, `giskd-config.json` (1,17 MB — odkritje servisov)
- **Poročila**: `porocila/21-0141-klepec-krasinec-2957.pdf` (6,7 MB, komittan) + `23-0168-arhat-2023.pdf` (3,5 MB, komittan) + **6 × TXT** (celotna besedila); 4 velika PDF (14,9/22,3/31,6/54,2 MB) prenešena + hashirana + izbrisana (vsebina v TXT; vrstice v `sha256.txt`)
- `bm-home.html` (dokaz JS-izziva BM), `sha256.txt`, `summary.json`
- **Reproducišljivost**: vsi artefakti dvakrat prenešeni (pred in po resetu peskovnika) — sha256 identični.

## 9. Naslednje

- Izkopni produkti: BM Metlika (arhivi raziskav po poročilih) — konkreten cilj izven peskovnika.
- Vsebine poročil ostalih kod (predvsem 2012–2014: Čaval/Mason 2004, Žerjal 2010, Gutman 2012, Udovč 2012) — sedaj z javnim prenosnim vzorcem (ID v URL_POROCILO1 posameznega zapisa).
- Dular 1972 (CONFLICT 1972/1973) — še vedno brez dostopne vsebine; časopisni zapisi 1972–1973 (dlib.si blokiran — izven peskovnika).
- BM zbirka danes (Vavpotičevi portreti) — izven peskovnika (JS-izziv).
- 86b del 3 (p110–142) ob VLM kvoti; PZ p48–65; PT p7 @300dpi; PR Grenz-Beschreibung.

---
*Protokol issue #72: vsak finding s statusom (VERIFIED/REVIEW/CONFLICT/NOT FOUND); brez podvajanja (rg kontrola = 0 zadetkov za nove kode/kulture); nič ne dvignjeno brez enotnega vira.*
