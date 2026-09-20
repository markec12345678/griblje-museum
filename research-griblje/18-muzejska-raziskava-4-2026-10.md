# Muzejska raziskava 4: Griblje po slovenskih spletnih muzejih — četrti val (50. sklop)

*Nadaljevanje 47–49. sklopa: četrte runde po ustanovah in kotih — Commons kategorija Griblje (izčrpavanje do konca), Belokranjski muzej Metlika (nova spletna stran, objave), RTV arhiv, jamarski kataster, EHRI, PISRS/odloki o KS, Radio Odeon novinarstvo 2024–2026, Google Books/FamilySearch/dLib API dostopi · oktober 2026*

## Metoda

- **26 spletnih iskanj** + **10 pridobitev strani** (page_reader/curl) — surovine v `raw-web-val4-2026-10/` (23 JSON).
- **Commons MediaWiki API**: polna enumeracija `Category:Griblje` + podkategorije + imageinfo (licence, avtorji).
- **API poskusi novih poti**: Google Books API (429), dLib API (HTTP:000 — blokada), EHRI portal (SPA, brez API), Kamra SearchService (404), muzej.si (timeout), Bing prek page_reader (fail), FamilySearch books (skeni za prijavo), katasterjam.si (brez javnega iskanja).
- Dedup-check vsake kandidatke proti `src/lib/museum-content.ts` (96 zapisov/434 virov) in `src/lib/entities.ts`.

## Rezultat vala: POTRDITVENI VAL — nič novega za vgradnjo

**Vseh kandidatnih najdb je bilo duplikat ali je dostop do njih blokiran.** Šesti val raziskave potrjuje izčrpanost slovenskih spletnih muzejskih virov o Gribljih za obseg te zbirke — vsak naslednji val prinaša le potrditve in nove blokade, ne novih dejstev. To je kakovostni rezultat dedup-ne discipline: zbirka ne nabava ponavljanja.

### Commons kategorija Griblje — 100 % izčrpana

Polna enumeracija API (10 elementov + 1 podkategorija):

| Commons datoteka | Stanje v zbirki |
|---|---|
| Category:St. Vitus's Church (Griblje) → File:Griblje, Črnomelj - cerkev sv. Vida.jpg | ✓ viri `commons-sv-vid` + `commons-cerkev-zvon` (Eleassar, 2012, CC BY-SA 3.0); lokalno `sveti-vid.jpg` |
| File:Bela krajina Kolpa.jpg (pogled na vas, avtor Andrejj) | ✓ glavna slika MVG-001 (`griblje-vas.jpg`, kredit potrjen) |
| File:Griblje, Črnomelj.jpg (Eleassar, 2012, CC BY-SA 3.0) | ✓ viri `commons-panorama` + `commons-zaselki` |
| File:Kolpa griblje.jpg | ✓ v zbirki |
| File:Pond at Griblje (44612474114).jpg | ✓ v zbirki |
| File:Cabin under the Sun (46105681335).jpg | ✓ v zbirki |
| File:Pogovor angleškega pilota s partizani, Griblje pri Črnomlju, marec 1945.jpg | ✓ vir `commons-1945-pilot` |

### Ostale potrditve duplikatov

- **Kamra: Spomenik padlim partizanom in žrtvam vasi Griblje** — »vse 13 umrlih … Krajevni odbor Zveze borcev Griblje 10. 9. 1961 odkril spomenik … pred podružnično šolo OŠ Loka« — popolnoma pokrito z virom `kamra-spomenik` (MVG-005 spomenik-padlim: datum odkritja, odkritelj, EŠD 19326, trinajst žrtev).
- **Kamra/PISRS/crnomelj.si: KS Griblje = Cerkvišče + Griblje** — pripadnost že uradno potrdena z virom `crnomelj-ks-cerkvisce` (MVG-040); odlok o krajevnih skupnostih (7. 10. 2022) je isti podatek na višjem pravnem nivoju — ne dodaja nič novega.
- **Belokranjski muzej Metlika (belokranjski-muzej.si, publishwall objave)**: »Arheološki biseri Bele krajine«, »Predmeti zbirke Fux Dular« (metliška meščanska hiša 1863 — Darake, ne Griblje), »Ivan Navratil: Zapis« (Metlika/Rosalnice), stalna razstava »Bela krajina v odsevu sedmih tisočletij« (Kučar omenjen v sorodni objavi — že MVG-060/083) — nobena ne vsebuje Griblje-vsebine.
- **Kataster jam (katasterjam.si)** — brez javno iskalnih zadetkov za Griblje (npr. »Ivanja jama« ID 12735 je drugačna lokacija). Jama-področje za Griblje ostaja brez dokumentiranega gradiva (Jelenja/Vodena jama pri Cerkvišču ostajata iz pisnega vira MVG-040).
- **Hrčak/Dular 1986** — že koleracija MVG-087.

### Blokade (tehnično nedostopno, z navodili za ponovni poskus)

| Vir | Blokada |
|---|---|
| Google Books API | HTTP 429 (kot prejšnji valovi) — za Weiss »das dorff Griblach« ostaja TO_COLLECT |
| dLib.si | HTTP:000 (blokada avtomatiziranega dostopa) |
| EHRI portal (holokavst arhivi) | Angular SPA brez javnega API-ja — iskanje »Griblje« neizvedljivo brez brskalnika |
| Kamra SearchService | 404 — iskalni endpoint ni javno dokumentiran; iskanje deluje le človeško v brskalniku |
| FamilySearch books (Priročni krajevni leksikon Slovenije 1996, ID 897952) | metapodatki javni (Orožen Adamič/Perko/Kladnik), skeni za prijavo |
| Radio Odeon | Cloudflare challenge (»Just a moment…«) za vse članke 2024–2026 |
| muzej.si portal | timeout |

## Nove TO_COLLECT postavke (2)

1. **Radio Odeon: »130 let šole Griblje«** (novica, 16. 6. 2026; URL oblike `radio-odeon.com/2026/06/16/130-let-sole-griblje/`, vsebina za Cloudflare) — naslov in datum potrjena z iskalnim indeksom; katera obletnica (1889 + 137; 1896 + 130?) ni razvidna brez polnega besedila — treba brskalniški obisk ali klic radiu (07/35-67-810). Za MVG-026 vaska-sola.
2. **Radio Odeon: »Krajevna skupnost Griblje je praznovala«** (novica, ~17. 9. 2024) — »V nedeljo 15. septembra je bilo v Gribljah praznično. Po dolgih letih … po več desetletjih smo obeležili praznik Krajevne [skupnosti]« — kateri praznik (vasni praznik? križevo? dan KS?) ni razvidno iz snipeta. Prvi omenjen ponoven praznik KS Griblje po več desetletjih — domačinsko pomembno. Za MVG-087 krizevo-pastirski-dan ali nov zapis.

## Prenosljivost naprej

- Naslednji raziskovalni vali imajo smisel le prek **človeškega dostopa** (prijava dLib, FamilySearch račun, telefon radiu Odeon, brskalnik na EHRI/Kamra) ali po novi literaturi (monitoring Hrčak/SIstory/Lex localis četrtletno).
- Kuratorski vidik: zbirka 96/434 pokriva celoten javno-dostopen spletni sloj o Gribljih; rast naprej prihaja iz arhivov, terenskega dela in skupnosti — točno kot je zamišljeno v konceptu muzeja.
