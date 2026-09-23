# 59 · VAL 45 — TASK 97: SI AS 177–182 ARCHIVAL ENUMERATION

*Digitalni vaški muzej Griblje · 97. sklop · 45. val raziskave · 2026-09-23*
*Načelo: »Kaj obstaja? Šele nato: kaj je vredno prebrati? Šele nato: kaj sme postati muzejsko dejstvo?« · LESS BUT PROVABLE · NALOGA = INVENTURA, NE NOVA ZBIRKA PODATKOV*

---

## A. Research question

Kaj **je** fondov **SI AS 177–182** (Arhiv Republike Slovenije) — točen naziv, časovni razpon, ustvarjalec, arhivski kontekst, digitalna dostopnost — in **katere arhivske enote v teh fondih vsebujejo Griblje / Grüble / občino Griblje / k.o. Griblje** ter sosedne kraje (Krasinec, Adlešiči, Podzemelj, Gradac, Dragoši, Rim, Grabrijan, Kolpa)? Nalogа je **arhivski zemljevid (enumeracija)**: ločevati FOND → ARHIVSKO ENOTO → DIGITALNO DATOTEKO → STRAN/PODOBO; ne črpati vsebine, ne prepisovati dokumentov, ne vgradnje. Privzeto **0 novih virov / 0 novih entitet / 0 muzejskih dejstev**.

Zakonita kanala (oba javna, že preizkušena v valih 41/42):
1. **VAC / Virtualna čitalnica ARS** (`vac.sjas.gov.si`) — uradni javni digitalni katalog AS: details-strani fondov + jstree AJAX tektonika (`/vac/search/archivePlanSearchAjax?id=N&page=K`, header `X-Requested-With: XMLHttpRequest`; curl `-k` zaradi SSL-prestregе peskovnika).
2. **OPS I / CKAN podatki.gov.si** — javni dataset »Digitalizirano arhivsko gradivo starih katastrov, SI AS 176, SI AS 177, SI AS 178, SI AS 179, SI AS 180, SI AS 181, SI AS 182« (surovina iz vala 41: `raw-web-val41-2026-10/ops-ckan.json`).

Dopolnilni sekundarni kanali: e-prostor.gov.si (vodnik »Dediščina katastrov na Slovenskem«), Pfajfar 2014 (Pokrajinski arhiv Maribor, številke digitalizacije), Kronika 57/3 (2009), Wikipedija/rodoslovje.si (kontekst). Brez obhodov avtorizacij/WAF/CAPTCHA; vse pridobljeno po javnih poteh.

---

## B. Archive architecture — rekonstruirana tektonika (vir: VAC jstree JSON; dokazi: `raw-web-val45-2026-10/ajax-*.json`)

```
ARS (Arhiv Republike Slovenije)                        [root 1000001]
└─ 000 UPRAVA                                          [653381]
   └─ 070 Posebni organi za upravo, pravosodje in notranje
      in zunanje zadeve do 1945/1947                   [653535]
      ├─ 071 Posebni organi za upravo, pravosodje in notranje
      │  in zunanje zadeve do 1945/1947                [653582]   ← vseh 6 fondov
      │  ├─ SI AS 174 Terezijanski kataster za Kranjsko (1747–1805)  [23251] (kontekst)
      │  ├─ SI AS 175 Jožefinski kataster za Kranjsko (1784–1790)    [23252] (kontekst)
      │  ├─ SI AS 176 Franciscejski kataster za Kranjsko (1823–1869) [23253] ← ALREADY RESEARCHED (vali 41–43)
      │  ├─ SI AS 177 Franciscejski kataster za Štajersko (1823–1869) [23254]  ← TASK 97
      │  ├─ SI AS 178 Franciscejski kataster za Koroško (1823–1869)   [23255]  ← TASK 97
      │  ├─ SI AS 179 Franciscejski kataster za Primorsko (1811–1869) [23256]  ← TASK 97
      │  ├─ SI AS 180 Kataster za Prekmurje (1858–1860)               [23257]  ← TASK 97
      │  ├─ SI AS 181 Reambulančni kataster za Kranjsko (1867–1882)   [23258]  ← TASK 97
      │  └─ SI AS 182 Reambulančni kataster za Koroško (1869)         [23259]  ← TASK 97
      └─ (sisterski fondi: SI AS 183, 203–205, 217, 1110–1111, …)
```

- Detajlen tektonični spust za vsak fond: razdelki C–H.
- Primerjava s fondom SI AS 176 (val 41): v 176 pod Novomeško kresijo [226589] k.o. **N83 Griblje** [227663] z 12 enotami (5 grafičnih N083A01–A05 + 7 spisovnih PG/PR/PS/PT/PUA/PV/PZ) — **ALREADY RESEARCHED, ne ponavljamo**.
- Ustvarjalci (Historiat, details-strani): franciscejski operat = cesarski patent Franca I. 23. 12. 1817; na Kranjskem **Deželna komisija za regulacijo zemljiškega davka + tri okrožne (kresijske) komisije** (Ljubljana, Novo mesto, Postojna); osnovna enota = katastrska občina. Reambulancа = **zakon 24. 5. 1869**, nova izmera (triangulacija), osnova = franciscejski operat; izdelali komisije (inšpektorji, geometri, pomožni uradniki + občinski predstavniki). Prevzeto v AS 1947/1948, Geodetska uprava 1961/1962.
- Pisava/jezik: nemščina, **nemška kurenta/gotica (rokopis)** — enako kot N83.

## B′. Načelo fond ≠ dokument (uporabljeno dosledno)

| Nivo | Primer (obseg v tem valu) |
|---|---|
| FOND | SI AS 181 [23258] — 1683 fasciklov + 1320 map |
| SERIJA/podserija | N Novomeška kresija [237211] (237 k.o.) |
| KRAJEVNA/UPRAVNA ENOTA | k.o. N161 Metlika [238212] |
| SERIJA ZNOTRAJ k.o. | »grafični« [238213] |
| ARHIVSKA ENOTA | N161C01 list C01 [238214] |
| DIGITALNA DATOTEKA | IIIF TIFY `docid=10` (canvas) / PDF `file?uodid=&id=` |
| STRAN/PODOBA | canvas/raster (sejsko vezan UUID) |

En fond z 8 listi = **ena arhivska enota z digitalnim prikazom**, ne 8 virov. (Enaka logika kot SI AS 176 → N83 → N083PT → 8 strani JPEG.)

---

## C. SI AS 177 — Franciscejski kataster za Štajersko

| Polje | Vrednost (vir: VAC details?id=23254, 200) |
|---|---|
| Signatura PE | **SI AS 177** |
| Naziv | **Franciscejski kataster za Štajersko** |
| Čas nastanka | **1823–1869** |
| Količina | **464 škatel; 1174 map; 347,00 tekočega metra** (največji od šestih) |
| Zvrsti gradiva | spisovno + kartografsko |
| Vsebina | »gradivo za okrog **1100 katastrskih občin**« — spisovno gradivo, originalne katastrske mape, za nekatere občine kopije in rektifikacijske mape; seznam k.o. v opombi fonda |
| Dostopnost (popis) | »**Gradivo je digitalizirano. Za uporabnike je praviloma dostopna le digitalizirana različica.**«; jezik nemški; pisava nemška kurenta/gotica |
| Katalogi | VAC ✓ · OPSI CKAN ✓ (6 omenjeno) · e-prostor vodnik ✓ · Archives Portal Europe ✓ (EAD) |

Tektonika (drevo): 3 kresije + legenda — **M Mariborska kresija** [207840] → F Franciscejski [207841] (561 naslovov k.o.) + R Rektifikacija, reambulanca in pomožne karte [211713] (540); **C Celjska kresija** [214989] → F [214990] (571) + R [218553] (549); **B Graška kresija** [314929] → F [351298] (1: B757 Gris Spodnji) + R [351297] (1); Legenda [241833]. Skupaj **2223 naslovov k.o.** v drevesu (isti k.o. se pojavita v F in R seriji → ~1100 unikatnih, skladno s fondsko opombo).

**Griblje-iskanje**: 0 zadetkov za Griblje/Grüble/Gruble v vseh 2223 naslovih (page0–page5, paginacija izčrpana). Topografsko konsistentno: Štajersko ≠ Kranjsko; k.o. Griblje (N83) pripada Novomeški kresiji Kranjske.

## D. SI AS 178 — Franciscejski kataster za Koroško

| Polje | Vrednost (vir: VAC details?id=23255, 200) |
|---|---|
| Signatura PE | **SI AS 178** |
| Naziv | **Franciscejski kataster za Koroško** |
| Čas nastanka | **1823–1869** |
| Količina | **44 škatel; 49 map; 18,30 m** |
| Zvrsti | spisovno + kartografsko |
| Vsebina | gradivo za **56 katastrskih občin** slovenskega dela Koroške (spisovno + mape, med njimi rektifikacijske/kopije); opomba: k.o. Spodnje/Zgornje Jezersko prenešeni iz fonda 176 |
| Dostopnost (popis) | »Gradivo je digitalizirano. Za uporabnike je praviloma dostopna le digitalizirana različica.«; nemški, kurenta |

Tektonika: **63 k.o. direktno pod fondom** (brez kresij; K5–K600) + Legenda [241855] (Legenda [241856] + Zemljevid (sestavljen) [267914]) + Jezerski priključki [352631, 352790].

**Griblje-iskanje**: 0 zadetkov. **FALSE POSITIVE: K99 Grablje (v Avstriji), k.o. [240347]** — podoben zapis, različen kraj (Avstrija, obč. Grablje); izrecno klasificirano kot nerelevantno za Griblje. Vzorec enote: K099A03 list A03 [240349] — **digitaliziran** (TIFY `docid=10`).

## E. SI AS 179 — Franciscejski kataster za Primorsko

| Polje | Vrednost (vir: VAC details?id=23256, 200) |
|---|---|
| Signatura PE | **SI AS 179** |
| Naziv | **Franciscejski kataster za Primorsko** |
| Čas nastanka | **1811–1869** |
| Količina | **184 map; 22,80 m** — samo kartografsko gradivo |
| Vsebina | **184 katastrskih map franciscejskega katastra, vključno z 22 mapami francoskega katastra**; seznam k.o. v opombi |
| Dostopnost (popis) | »Gradivo je digitalizirano. Za uporabnike je praviloma dostopna le digitalizirana različica.«; nemški |

Tektonika: 4 skupine — **G Goriška kresija** [202102] → Franciscejski [202103] (122) + Reambulančni [203855] (9) + francoski [203946] (24); **T Trst** [204710] → Reambulančni [204711] → 1 k.o. (T500 Bazovica); **I Istra** [204722] → F [204723] (22) + R [204975] (4) + francoski [205024] (2); **R Reka** [205048] → F [205049] (1: R216 Pernata, otok Cres); Legenda [241822]. Skupaj **184 naslovov** — skladno s fondsko opombo.

**Griblje-iskanje**: 0 zadetkov. Primorsko ≠ Kranjsko. Vzorec enote: G001A01 [202106] — **digitaliziran** (TIFY `docid=10`).

## F. SI AS 180 — Kataster za Prekmurje

| Polje | Vrednost (vir: VAC details?id=23257, 200) |
|---|---|
| Signatura PE | **SI AS 180** |
| Naziv | **Kataster za Prekmurje** |
| Čas nastanka | **1858–1860** |
| Količina | **51 škatel; 50 map; 16,70 m** |
| Zvrsti | spisovno + kartografsko |
| Vsebina | gradivo za **168 katastrskih občin** Prekmurja (prva izmera po 1856, ogrska triangulacija — Gellerthegy/Budimpešta); Historiat PE: izročil Katastrski urad Murska Sobota 22. 6. 1961 |
| Dostopnost (popis) | »Gradivo je digitalizirano. Za uporabnike je praviloma dostopna le digitalizirana različica.«; nemški |

Tektonika: **E Železna županija** [289169] (98 k.o., mnogo z opombo »glej DELOVODNIK«) + **Z Županija Zala** [289170] (45 k.o.) + Legenda [267920] (prazna v drevesu). Skupaj **143 naslovov k.o.** (opomba fonda: 168 k.o. — drevo prikazuje manj; del je opredeljen prek delovodnikov).

**Griblje-iskanje**: 0 zadetkov. Prekmurje ≠ Kranjsko. Vzorec enote: E037PG [375803] in E037PR [375804] (Bakovci) — **digitalizirani PDF** (`file?uodid=375803&id=44493` / `…44494`). Signaturna shema (zunanji primer Wikimedia: »SI AS 180/Z/Z45/g/C03«).

## G. SI AS 181 — Reambulančni kataster za Kranjsko  ★ glavni kandidat vala

| Polje | Vrednost (vir: VAC details?id=23258, 200) |
|---|---|
| Signatura PE | **SI AS 181** |
| Naziv | **Reambulančni kataster za Kranjsko** |
| Čas nastanka | **1867–1882** |
| Količina | **1683 fasciklov; 1320 map; 72,00 m** |
| Zvrsti | spisovno + kartografsko |
| Vsebina | »praviloma vsebuje **indikacijske skice (iz leta 1868!)**, mape in spisovno gradivo za posamezne katastrske občine, **navedene v seznamu pri fondu SI AS 176**« |
| Operat (historiat) | uvrstitev po razredih, parcelni protokol, seznam izbrisanih parcel, **abecedni seznam zemljiških in hišnih posestnikov**, **seznam hiš**, izkaz zemljiške posesti, protokol preračunavanj, cenitvene tabele, cenitveni register, protokol sprememb |
| Prevzem | AS 1947/1948; 1 mapa k.o. Vrhnika 2009 (ZRC SAZU) |
| Jezik/pisava | nemški; kurenta (popis) |
| Pogoji dostopnosti (popis) | **polje v popisu NI izpisano** (različica popisa brez tega elementa); digitalizacija potrjena na enotni ravni + literatura (Pfajfar 2014: **6.032 digitalnih objektov**) |

Tektonika: 3 kresije + legenda — **L Ljubljanska** [234241] (305 k.o., page0–p3) + **N Novomeška** [237211] (**237 k.o.**, p0–p2) + **A Postojnska** [239420] (96 k.o.) + Legenda [267921] (prazna). Skupaj **638 naslovov k.o.** v drevesu.

**Griblje-iskanje — KLJUČNI REZULTAT VALA:**

- Oštevilčenje kresije N je **identično fondu SI AS 176** (sistemsko potrjeno na prekrivanju: N20 Božakovo, N161 Metlika, N237 Št. Rupert, N239 Zabukovje Staro …).
- V 176: N82 Veliki Podlog [227645] → **N83 Griblje [227663]** → N84 Krško [227675]; prav tako N1 Adlešiči [226591], N65 Gradac [227431], N123 Krasinec [228193], N202 Podzemelj [229213].
- V 181: N82 [237731] → **N84 [237741]** — **N83 Griblje NE OBSTAJA v javni tektoniki**; prav tako manjkajo N1 Adlešiči, N65 Gradac, N123 Krasinec, N202 Podzemelj in drugi belokrajnski k.o. (skupno 0 zadetkov za vse iskalne izraze prek 638 naslovov).
- **Torej: reambulančni katastrski operat za k.o. Griblje NI ohranjen / NI izročen v fondu SI AS 181** (vsaj v javno objavljeni tektoniki VAC). Fondova opomba »praviloma« = izrecno dovoljuje izjeme. Belokrajnske k.o., ki SO ohranjene: N20 Božakovo [237291], N161 Metlika [238212] (8 grafičnih listov N161C01–C08, vsi TIFY docid 10 — vzorec C01 [238214] preverjen), N223 Radoviči pri Metliki [238603], N237 Št. Rupert [238671], N239 Zabukovje Staro [238689].
- Vzroka (ni izmera? izročitev?) NI mogoče ugotoviti iz javnih metapodatkov — **TO_COLLECT** (samo vprašanje AS referentu / vodniška literatura; ne ugibati).

Muzejska relevantnost: fond bi (če bi vseboval N83) bil **najboljši arhivski odgovor na vprašanja gostilne (abecedni seznam posestnikov + seznam hiš ~1868–1882!) in lastništva** — toda za Griblje **ne obstaja**. To je ena najpomembnejših negativnih ugotovitev raziskave doslej: **glavna napovedana arhivska pot do gostilne-pre-1898 prek reambulancе je za Griblje ZAPRTA.**

## H. SI AS 182 — Reambulančni kataster za Koroško

| Polje | Vrednost (vir: VAC details?id=23259, 200) |
|---|---|
| Signatura PE | **SI AS 182** |
| Naziv | **Reambulančni kataster za Koroško** |
| Čas nastanka | **1869** (literatura poroča tudi o spisih 1872–1878, npr. parcelni zapisnik Dravograd 1878 — Arhivi 33/2) |
| Količina | **52 fasciklov; 4,00 m** — samo spisovno gradivo |
| Vsebina | »v glavnem le spisovno gradivo za katastrske občine **po seznamu pri SI AS 178**«; ohranjene mape priključene k 178 |
| Prevzem | Geodetska uprava SRS 1961/1962 (skupaj z 181) |
| Dostopnost (popis) | polje izpisano ni; digitalizacija potrjena na enotni ravni (Pfajfar 2014: **397 digitalnih objektov**) |

Tektonika: **52 k.o. direktno** (K5–K520) + Legenda [267922]. **Griblje-iskanje**: 0 zadetkov. Vzorec enote: K005E01 [240687] — **digitaliziran** (TIFY `docid=10`).

---

## I. Griblje direct hits — MASTER TABLE

Enumeracija: **3409 unikatnih vozlišč** dreves fondov 177–182 (VAC AJAX, paginacija izčrpana na 21 seznamih); iskalni nizi: Griblje, Grüble, Grubl, Krasinec, Adleš(i), Podzemelj, Podzemlj, Gradac, Dragoš, Grabrijan, Kolpa, + gostilna-varianti (Gasth., Wirth, Schenk, Tafern, Krug, Herberg, krčma, oštarija, Birt) + »Rim,«. Rezultat: **0 zadetkov**.

| FOND | ENOTA | ID (VAC) | NAZIV | LETA | GRIBLJE | DIGITAL | DOSTOP | PRIORITETA |
|---|---|---|---|---|---|---|---|---|
| SI AS 177 | 3 kresije (M/C/B), 6 serij | 23254 | Franciscejski kataster za Štajersko | 1823–1869 | — NIČ | DA (vzorec M002PR) | javno VAC (»le digitalizirana«) | — |
| SI AS 178 | 63 k.o. | 23255 | Franciscejski kataster za Koroško | 1823–1869 | FALSE POSITIVE: K99 Grablje (v Avstriji) [240347] | DA (vzorec K099A03) | javno VAC | — |
| SI AS 179 | 4 skupine (G/T/I/R) | 23256 | Franciscejski kataster za Primorsko | 1811–1869 | — NIČ | DA (vzorec G001A01) | javno VAC | — |
| SI AS 180 | 2 županiji (E/Z) | 23257 | Kataster za Prekmurje | 1858–1860 | — NIČ | DA (vzorec E037PG/PR) | javno VAC | — |
| SI AS 181 | 3 kresije (L/N/A), 638 k.o. | 23258 | Reambulančni kataster za Kranjsko | 1867–1882 | **N83 MANJKA v tektoniki** (N82→N84) | DA (vzorec N161C01) | javno VAC (polje dostopnosti neizpisano) | — |
| SI AS 182 | 52 k.o. | 23259 | Reambulančni kataster za Koroško | 1869 | — NIČ | DA (vzorec K005E01) | javno VAC | — |

**DIRECT zadetki: 0.** K.o. Griblje ne obstaja v nobenem od fondov 177–182 — ne pod imenom Griblje, ne Grüble, ne kot k.o. številka 83. (V 176 [23253] je N83 [227663] prisotna — ALREADY RESEARCHED, vali 41–43.)

## J. Contextual hits

| Enota | Fond | VAC id | Razvrstitev | Muzejska vrednost |
|---|---|---|---|---|
| K99 Grablje (v Avstriji), k.o. | SI AS 178 | 240347 | **FALSE POSITIVE** (ime podobno, kraj drug) | nič; zapisano kot zaščita pred prihodnjo zamenjavo |
| N161 Metlika, k.o. (grafični C01–C08) | SI AS 181 | 238212 | CONTEXTUAL (belokrajnska k.o., ohranjena v reambulanci) | P4 — kontrolni vir tehnike/formata reambulančnih listov za Belo krajino (~1868) |
| N20 Božakovo, k.o. | SI AS 181 | 237291 | CONTEXTUAL | P4 |
| N223 Radoviči pri Metliki, k.o. | SI AS 181 | 238603 | CONTEXTUAL | P4 |
| N237 Št. Rupert, k.o. | SI AS 181 | 238671 | CONTEXTUAL | P4 |
| N239 Zabukovje Staro, k.o. | SI AS 181 | 238689 | CONTEXTUAL | P4 |
| N82 Veliki Podlog, k.o. (tako v 181 kot 176) | SI AS 181 | 237731 | CONTEXTUAL (oštevilčna sidrišča dokazujejo identično oštevilčenje) | P4 — dokazni vzorec |
| N84 Krško, k.o. (grafični C01–C08) | SI AS 181 | 237741 | CONTEXTUAL | P4 |
| Legenda in pregledne karte (178) | SI AS 178 | 241855/241856/267914 | kontrolni vir | P4 |
| Sosede Gribljijev: Adlešiči (N1), Gradac (N65), Krasinec (N123), Podzemelj (N202), Dragoši, Rim, Grabrijan, Kolpa | vse fonde 177–182 | — | **NEIGHBOURING: 0** — niti enota (Rim/Grabrijan sta zaselka znotraj k.o. Griblje, ne samostojne k.o.; soseske so v 181 prav tako manjkajoče) | nič |

Zunanji contextual zadetek iskanja (SNIPPET-level, samo belega): academia.edu prepis Jožefinskega katastra omenja »**Griblje (Grible, 1771)**, p. c. sv. Vida« — potencialna potrditev forme *Grible* v okviru SI AS 175 [23252]; **TO_COLLECT** (nisi na obsegu TASK 97; ne vgradnja).

## K. Digital availability

| Fond | Javni katalog | Digitalizirane enote | Viewer / format | Javno dostopno? | Iskalni metapodatki |
|---|---|---|---|---|---|
| SI AS 177 | VAC details ✓ · OPSI ✓ · APE ✓ · e-prostor ✓ | DA (vzorec: M002PR = PDF `file?uodid=364800&id=38520`; grafični za vzorčni k.o. ni bil v drevesu) | VAC TIFY (IIIF P3, docid 10) + LuraDocument PDF | **DA** — popis: »Gradivo je digitalizirano. Za uporabnike je praviloma dostopna le digitalizirana različica.« | drevo k.o. (F/R serije) + fondski opis; unit-level popis (PR/PS/PT/PUA/PV nazivi) |
| SI AS 178 | enako | DA (K099A03, TIFY docid 10) | TIFY | **DA** (isti popisni zapis) | drevo 63 k.o. + Legenda/Zemljevid |
| SI AS 179 | enako | DA (G001A01, TIFY docid 10) | TIFY | **DA** (isti popisni zapis) | drevo 184 k.o. po 3 serijah |
| SI AS 180 | enako | DA (E037PG id 44493, E037PR id 44494, PDF) | PDF + TIFY | **DA** (isti popisni zapis) | drevo 143 k.o. + delovodniki |
| SI AS 181 | VAC details ✓ · OPSI ✓ · e-prostor ✓ | DA (N161C01 TIFY docid 10; N161C01–C08 vsi v drevesu) — Pfajfar 2014: **6.032 digitalnih objektov** | TIFY + PDF | **DA** (enotna raven; popisno polje »Pogoji dostopnosti« neizpisano) | drevo 638 k.o. po kresijah + fondski opis |
| SI AS 182 | VAC details ✓ · OPSI ✓ | DA (K005E01 TIFY docid 10) — Pfajfar 2014: **397 digitalnih objektov** | TIFY | **DA** (enotna raven) | drevo 52 k.o. |

Tehnična meja (znana iz vala 42, ne spreminjena): raster URL-ji v IIIF so **sejsko vezani** (manifest + raster v isti seji); LuraDocument PDF-ji imajo razbit xref → prenos strani prek IIIF pdfPageImage. Obe sta rešljivi z javnim brskalnikom/curl sejo, **ni potrebna nobena obvozna dejanja**.

## L. P1 research candidates — raziskovalni backlog

**P1 — NEXT: NIČ ZNOTRAJ SI AS 177–182.** K.o. Griblje ne obstaja v teh fondih; ni enote, ki bi jo bilo vredno prepisovati za muzejska vprašanja. Javna enumeracija je s tem **zaključena in zaprta** (»less but provable«). Vsi P1-kandidati za gostilno/šolo/Rim ostajajo izven tega sklopa (glej O).

P2 (kontekst, šele pri potrebi po primerjavi reambulančne tehnike):
- SI AS 181 / N161C01–C08 [238212/238213] — metlika grafični listi ~1868 — kontrola formata reambulančnih listov za Belo krajino.
- SI AS 181 / N84C01–C08 [237741] — Krško — druga kontrola.

P3/P4:
- SI AS 178 / K99 Grablje [240347] — samo kot FALSE POSITIVE zapis.
- SI AS 181 / 267921 Legenda — prazna v drevesu; nič.
- SI AS 175 Jožefinski kataster za Kranjsko [23252] — »Grible 1771« (zunanji snippet) — čisto ločen prihodnji val (fond ni v obsegu 177–182).

## M. Already researched / duplicate protection

- **SI AS 176 / N83 Griblje** — 12 enot (N083A01–A05, PG, PR, PS, PT, PUA, PV, PZ) — **ALREADY RESEARCHED — TASK 93/94/95** (vali 41–43, docs 55–57). V tem valu smo drevo 176 Novomeške kresije uporabili **samo kot oštevilčno sidro** (N82/N83/N84 id-ji), brez ponovne raziskave enot, brez prenosov gradiva.
- Bili bi duplikati, če bi jih kdo naslednjič enumeriral: vse 6 fondov C–H; enote iz K (vzorci) — vse evidence v `raw-web-val45-2026-10/`.

## N. Negative results (kje smo iskali in kaj NI bilo najdeno)

1. **Griblje/Grüble/Gruble/k.o. 83** — 0 zadetkov prek 3409 unikatnih naslovnih vozlišč fondov 177–182 (21 paginiranih seznamov VAC; paginacija izčrpana do »Zadnja stran«). To NI dokaz, da »je takih dokumentov ni nikjer« — samo: **v javni tektoniki teh 6 fondov jih ni**.
2. **N83 v SI AS 181** — izrecno manjka med N82 in N84 (sistemsko sidro: oštevilčenje identično 176). Fondova opomba »praviloma vsebuje [k.o. po seznamu 176]« dovoljuje izjeme — za k.o. Griblje izjema potrjena na nivoju javnega popisa. Razlog (ni izmere, ni izročitve, izročitev na drugo mesto) **UNRESOLVED / TO_COLLECT**.
3. **Sosede Gribljijev** (Adlešiči N1, Gradac N65, Krasinec N123, Podzemelj N202, Dragoši, Rim, Grabrijan, Kolpa) — 0 zadetkov v 177–182; belokrajnske k.o. v 181 ohranjene le delno (Metlika, Božakovo, Radoviči, Št. Rupert, Zabukovje Staro …). → reambulanca Bela krajina = **delno ohranjena**, Griblje spada med izpadle.
4. **Gostilna-izrazi** (Gasthaus, Wirtshaus, Schenke, Wirth, Gastwirt, Taferne, Krug, Herberge, gostilna, krčma, oštarija, birt, bife) na naslovnem nivoju vseh enot — 0 (naslovi enot so tehnični: k.o. ime + serijska oznaka; tematska iskanja bi zahtevala vsebinsko branje — za Griblje v teh fondih ni česa brati).
5. **Ustvarjalci kot ločeni zapis v popisu** — VAC details izpisuje Historiat (zakonski/organizacijski kontekst), ne posebnega polja »ustvarjalec«; ustvarjalec rekonstruiran iz historiata (Deželna komisija za regulacijo zemljiškega davka; kresijske komisije; reambulančne merilne komisije).
6. **Pogoji dostopnosti za 181/182** — polje v popisu neizpisano; digitalizacija potrjena drugotno (vzorci enot + Pfajfar 2014). Ni znak nezasedenosti, samo popisna vrzel.
7. **e-prostor PDF** (»Dediščina katastrov na Slovenskem«) prenešen (3,49 MB), a z razbitim xref — tekst iz vsebine ni razčlenjen iz peskovnika; ključne podatke (količine, ID-ji) potrjujejo VAC details + iskalni odlomki PDF-ja. Dokaz shranjen (`dediscina-katastrov.pdf`).
8. **SI AS 182 spisi 1872–1878** (Arhivi 33/2 snippet) kažejo, da je dejanski čas nastanka spisov lahko poznejši od popisanih let 1869 — minor literature note, NI reševano (fond za Griblje ne relevantен).

## O. Next research queue — konkretni naslednji koraki (izven obsega 177–182)

1. **P1 — GOSTILNA (pre-1898)**: župnijska/hišna knjiga župnije sv. Vida Griblje (ARHIV ADLEŠIČI/NUK/RC — izven-peskovniška vrsta); N83 A05 »Schumsthl Traverne« paleografija ( že backlog vala 43); katastrska vprašanja k opravi prek SI AS 176 PZ/PUA (že raziskano) — SI AS 181 pot je za Griblje ZAPRTA (ta val).
2. **P1 — ŠOLA 1889**: koroška/kranska šolska kronika in šolski posvet — izven katastrskih fondov; kanala: SI PANU (Pokrajinski arhiv Novo mesto — okrajni svet Črnomelj/šolske razprave) + ZRSŠ/šolska kronika v kraju. (Enumeracija PANU = ločen val; ni v TASK 97.)
3. **P1 — RIM/Grabrijan**: katastrski listi **A01–A05** (že v muzeju, 5 JPEG) — iskanje toponima Rim/Grabrijan ob »dveh samotnih Grabrijanovih hišah« (Leksikon 1937) — content-extraction brez novega prenosa (surovine obstojajo).
4. **P2 — SI AS 175 Jožefinski kataster** [23252]: »Grible 1771« (snippet) — 1-enotna validacija forme prihodnji val (individualna enota, ne enumeracija).
5. **P2 — SI AS 181 referent vprašanje** (izven-peskovniška vrsta): ali za N83 reambulanca ni bila izvedena (mejni pas) ali izročena drugam; literatura: Seručnik, »Reambulančni kataster za Kranjsko«, Kronika 57/3 (2009), str. 491–504 (dLib urn:nbn:si:spr-jneoc6en).
6. **P3 — APE EAD** (archivesportaleurope.net) za SI AS 176–182 — če se kdaj potrebuje enotno EAD iskanje po enotah (dopolnilni metapodatki na enotni ravni).

Terminologija (naročilo 16, uporabljeno v tem dokumentu): **Leksikon 1937** = digital_source_object VERIFIED, digital_access PARTIAL, publication_claim VERIFIED/PRELIMINARY, **historical_primary_evidence NO** — t.i. »primarni vir« velja izrecno ZA ARHIVSKE FONDE (kot SI AS 176), ne za tiskani leksikon kot sekundarno publikacijo.

---

## Regresija (raziskovalni val — NO CONTENT CHANGE)

- Pričakovano: git diff = samo raziskovalni dokumenti + surovine; 113 zapisov / 588 virov / 469 identitet / 67 deljenih / 95 entitet nespremenjeno; i18n 946 × 5; sitemap 114; DB brez drifta.
- Dokazi: `raw-web-val45-2026-10/` (details-23254…23259.html, details-{238214,240349,364800,202106,240687,375803,375804}.html, ajax-*.json (21 paginiranih seznamov + vozlišča), tree-*.json, s01–s08.json (SDK web search), dediscina-katastrov.pdf, pfajfar-2014-redirect.html).

## Zaklep vala

**TASK 97 = INVENTURA ZAKLJUČENA.** SI AS 177–182 = pet katastrskih fondov sosednjih pokrajin + reambulančni kataster za Kranjsko; **noben ne vsebuje k.o. Griblje**; vseh 6 fondov je javno katalogiziranih in (vsaj vzorčno) digitaliziranih ter javno dostopnih prek VAC. Najpomembnejše ugotovitve: (1) reambulančni operat za k.o. Griblje ne obstaja v javni tektoniki SI AS 181 — glavna napovedana arhivska pot do gostilne-pre-1898 je zaprta; (2) K99 Grablje = uradno dokumentiran false positive; (3) sistemska dokazna logika (oštevilčna sidra N82/N83/N84 med 176 in 181) je dokumentirana za prihodnje vali.
