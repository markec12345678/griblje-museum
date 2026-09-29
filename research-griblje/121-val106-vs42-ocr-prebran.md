# 121 — 106. val: ISSUE #72 — ZVEZEK VARSTVO SPOMENIKOV, POROČILA 42 PREBRAN V CELOTI Z OCR SKENA — KOLOFON RAZREŠEN (DECEMBER 2006) + DVA ČLANKA O GRIBLJIH: VNOS 59 (IZKOPAVANJA 2005, STR. 49–50 — NOV PRIMARNI VIR) + VNOS 60 (VREDNOTENJE G1/G4, STR. 51 — POPRAVEK STRANI)

**Datum:** 2026-09-29 · **Obseg:** zvezek VS 42 (45,8 MB čisti sken brez besedilne plasti, prenešen v valu 105) prebran z OCR (tesseract 5, tessdata slv+deu, pdftoppm 150/300 dpi); kolofon razreši REVIEW letnico; **najdena DVA članka o Gribljih** — vnos 59 (izkopavanja na trasi fekalne kanalizacije 2005, str. 49–50) = **nov primarni vir**, doslej znan le posredno prek Žorž 2011 (TO_COLLECT razrešen); vnos 60 (vrednotenje kanalov G1/G4, str. 51) = kuratorski zapis potrjen + **popravek strani (ne 60–61, temveč 51)**
**Vgradnja:** add-only — **+1 nov vir** (`mason-varesko-pinter-2006-izkopavanja`) + 2 dopolnjeni vira (`vs-42-kanalizacija-g1-g4`, `zorz-2011-av-griblje`) + odstavek zgodbe sl+en + doplnilo pri »Muzej išče« · **+0 zapisov (114) / +1 vir (651 → 652) / +1 identiteta (527 → 528) / deljenih 69** · 0 VLM / 0 spletnega iskanja (val je izrecno AI-neodvisen — čisti OCR)

---

## 1. Kontekst

Val 105 je zvezek VS 42 le **našel** javno (`042_2006_varstvo_spomenikov_porocila-1.pdf`, 45,8 MB) in zabeležil pošten negativ: PDF je čisti sken (Acrobat Image Conversion 2016) **brez besedilne plasti** (pdftotext = 0 vrstic); letnica ostaja REVIEW, saj je ime datoteke le kazalnik. Ta val ta nalogo izpolni: vsebina prebrana z **OCR** (tesseract 5, slovenski + nemški jezikovni paket, pdftoppm 150/300 dpi, psm 1) — brez enega samega VLM/spletno-iskalnega klica.

## 2. Metoda (0 AI klicev)

- **OCR:** pdftoppm (150 dpi za celoten pregled, 300 dpi za folije/verifikacije) → tesseract 5, `slv+deu`, psm 1; tessdata prenešena v valu 105 (repo `raw-web-val105-2026-10/tessdata`), po konvenciji izbrisana (javno ponovno preneisljiva; slv b937632c…, deu 19d219bb…).
- **Mapping folij:** vizualna kontrola na 300 dpi — PDF 49 = folio 49, PDF 50 = folio 50, PDF 51 = folio 51 → mapping PDF : natisnjena stran = **1 : 1** (v nasprotju z VS 48, kjer so strani razpenjane 2:1).
- **Reševanje vnosov:** rdeča številka nad glavo članka = **vnos** članka (isti sistem kot vnos 30 v VS 48, val 105); kazalo (PDF 204–205) vpiše Griblje pod **vnos 59 + vnos 60** — kazalni stolpec = vnos, ne EŠD in ne stran.
- **Surovine:** `raw-web-val106-2026-10/` — 10 TXT izpiskov (kolofon p002, uvodnik p005, vsebinska navodila p006, Griblje p049/p050/p051, kazalo p204/p205, kratiche/avtorji p210/p211) + sha256.txt + summary.json; veliki PDF (45,8 MB, sha256 404dbb07…) po konvenciji izbrisan.

## 3. Kolofon VS 42 — REVIEW letnice RAZREŠEN

**»Ljubljana, december 2006; ISSN 1580-5166; izdaja Zavod za varstvo kulturne dediščine Slovenije, zanj dr. Robert Peskar; urednica Biserka Ribnikar; naklada 600.** Uvodnik: 4. številka Poročil kot samostojne publikacije; zvezek zajema **poročila o posegih, opravljenih v veliki meri v letu 2005**; 3. zvezek Poročil izšel julija 2006 (pokrival posege 2000–2004). → ime datoteke `042_2006` **potrjeno s kolofonom**; REVIEW letnice razrešen z dokazom (204 PDF strani).

## 4. Vnos 59 (str. 49–50) — izkopavanja na trasi fekalne kanalizacije 2005 — NOV PRIMARNI VIR

**Glava:** EŠD 10094 · Naselje: Griblje · Občina: Črnomelj · Ime: Griblje — arheološko najdišče ob Kolpi · Področje: A · Obdobje: **neolitik, eneolitik, rimsko obdobje, srednji vek** · Vrsta dela: 6, 7. **Podpis: Philip Mason, Niko Vareško, Ildiko Pinter.**

Ključne ugotovitve (dobesedno iz zvezka):

| # | ugotovitev | opornik |
|---|---|---|
| 1 | Izkopavanja **na podlagi arheološkega vrednotenja 2004** (faza 8–9 stratigrafije), ki je potrdilo »prisotnost arheoloških najdb, plasti in struktur«; **ZVKDS OE Novo mesto je ustavil gradbena dela** in določil obseg izkopavanj | p049: »Zaradi ogroženosti arheološkega najdišča je ZVKDS, OE Novo mesto, ustavil gradbena dela in določil ob-<br>seg arheoloških izkopavanj« |
| 2 | **21. 3.–7. 4. 2005**, ekipa ZVKDS OE Novo mesto pod vodstvom **doc. dr. Philipa Masona** in **Nika Vareška** (absolvent arheologije); parcele **2852/2, 2863, 2864, 2865, 2886 k.o. Griblje** | p049 |
| 3 | **Tri sonde**: S:1 (10 × 3 m; parc. 2863, 2864, 2886; manjši platoj na robu prve terase); S:2 (10 × 3 m; parc. 2864, 2865; ob robu prve terase); S:3 (profil 20 m; parc. 2852/2; poplavna ravnina, predvidena lokacija čistilne naprave, **paleostruga Kolpe**) | p049–p050 |
| 4 | **Stratigrafija S:1/S:2 v 9 fazah**: 1 pleistocenski aluvij (SE 121/SE 219) · 2 koluvialni nanos + **neolitska hodna površina** (SE 106; nalaganje iz smeri današnjega naselja; »višje ležeči predeli so v tistem času že bili poseljeni«; **možnost obrtne dejavnosti — izdelovanje orodja in orožja iz kremena**) · 3 starejši eneolitik (vkop SE 114, namembnost nejasna) · 4 mlajši eneolitik (številni vkopi jam za stojke → vsaj en objekt; verjetna razširitev naselbine) · 5 postprazgodovinski aluvij (SE 105/SE 213; v S:2 precej najdb rimske dobe in srednjega veka = indic bližnje poselitve) · 6 srednjeveška faza (samo S:2: jama + drenažni jarek; uvod omenja še kolovoz) · 7 koluviacija mlajših obdobij (SE 102/SE 202) · 8–9 recentno (poljedelstvo, parcelacija in komasacija 1985, arheološko vrednotenje 2004) | p050 |
| 5 | **S:3 v 4 fazah**: najstarejši aluvij brez najdb · rimskodobni/postrimski sedimenti (najdbe prazgodovine + rimske dobe) · srednjeveški sedimenti (najdbe rimske dobe + srednjega veka) · recentno (travniška ruša + ornica) | p050 |
| 6 | **Sklep**: »najdišče okvirno umestimo v neolitik in eneolitik, pozneje pa je bil prostor uporabljen tudi v rimski dobi ter srednjem veku«; strukture se širijo **proti vzhodu** (manjši platoji); »verjetno večina intaktnih plasti in struktur prazgodovinske poselitve na omenjenem manjšem platoju **ni bila poškodovana** z gradnjo kanalizacije«; prazgodovinske najdbe v mlajših plasteh → poselitev **zahodno od trase** (prva ali druga terasa) + **močna erozija naselbinskih plasti** v mlajših obdobjih; v S:2 ostanki struktur srednjega in novega veka; starejše najdbe v nanosih S:2 → poselitev v neposredni bližini v prazgodovinskem in rimskem obdobju | p050 |

**Pomen:** to je **primarno poročilo o izkopavanjih 2005**, ki ga je muzej doslej poznal le posredno prek Žorž 2011 (vnos v bibliografiji, vsebina TO_COLLECT). To so **prva dokumentirana izkopavanja prazgodovinske naselbine na širšem območju** — pred površinskim pregledom 1999–2001 in pred izkopi 2010/2011 (VS 46/VS 48).

## 5. Vnos 60 (str. 51) — vrednotenje kanalov G1/G4 — kuratorski zapis potrjen + POPRAVEK STRANI

**Glava:** EŠD 10094 · Ime: Griblje — arheološko najdišče ob Kolpi · Področje: A · Obdobje: prazgodovina, rimsko obdobje, srednji vek · Vrsta dela: 6, 7. **Podpis: Philip Mason, Niko Vareško, Ildiko Pinter** (vodja Vareško, nadzor Mason — potrjeno kuratorsko).

- **Parcele:** 113/1 (kanal G4); 2866–2872 (kanal G1). **11 TJ**: 6 TJ G1 (povprečno 2 × 2 × 1,5 m) + 5 TJ G4 (1 × 1 × 1 m).
- **Porazdelitev:** enakomerno po celotni trasi G1 + prvih 100 m G4; »**preostanek trase zaradi strnjenega naselja ni bil izvedljiv**«.
- **Ugotovitve:** večina TJ z najdbami (ožgana glina, przg./rimska/srednjeveška/novoveška keramika, oglje); **G1** — przg. keramika + ožgana glina iz **aluvialnih nanosov** (dve fazi: mlajša rimskodobno+srednjeveško, starejša prazgodovinska; najdbe prinesene z delovanjem reke); **G4** — przg. keramika + ožgana glina + oglje iz **intaktne kulturne plasti**, brez sledov struktur; koluvialni nanosi na G4 iz postprazgodovinskega obdobja — »težko natančno ločiti od intaktnih prazgodovinskih arheoloških plasti«; geološka osnova ~1,4 m (G1) / 1 m (G4) — različna konfiguracija terena (G1 poplavna ravnina, del G4 prva terasa).
- **Sklep:** lokacija poseljena v prazgodovini (G4), bližnja človekova dejavnost v prazgodovinskem, rimskodobnem in srednjeveškem obdobju (G1); strojni izkop bi uničil nanose z najdbami v enakem obsegu kot prvi del trase G1 / intaktne prazgodovinske plasti na G4.
- **POPRAVEK STRANI:** kuratorski zapis (val 95 / issue #72 komentar) je navajal **str. 60–61** — branje zvezka s folijem pokaže: članek je na **str. 51** (vnos 60; folio preverjen na 300 dpi). Popravek z dobesednim dokazom, zapisan v opombi vira sl+en.

## 6. Kazalo zvezka (PDF 204–205)

Kazalo vpiše Griblje pod **vnos 59 in vnos 60** — torej je kazalni stolpec **vnos** (rdeče številke v besedilu), ne EŠD in ne stran. Obe gribeljski vnosi kazalo uvrsti v sklop »rimsko obdobje«, čeprav glavi člankov navajata neolitik/eneolitik oziroma prazgodovino — **nejasnost kazala zapisana, ni kritična** (glave člankov = primarni opornik).

## 7. Vgradnja (add-only)

- **NOV VIR `mason-varesko-pinter-2006-izkopavanja`** (MVG-083): polno branje, status VERIFIED — vnos 59 z vso stratigrafijo, sondami, fazami in sklepi (sl+en).
- **`vs-42-kanalizacija-g1-g4`**: doplnilo 106. vala — kolofon razrešen (december 2006), polno branje z OCR, **popravek str. 60–61 → 51**, vsebinske dopolnitve (11 TJ, porazdelitev, intaktna kulturna plast G4, nezmožnost ločbe koluvija) sl+en; status REVIEW → VERIFIED (identiteta), vsebina polno prebrana.
- **`zorz-2011-av-griblje`**: doplnilo 106. vala — TO_COLLECT poročilo o izkopavanjih 2005 identificirano in prebrano (vnos 59) sl+en.
- **Zgodba MVG-083**: odstavek 106. vala (sl: »106. val je prebral zvezek, ki ga je 105. val le našel…«; en: »Wave 106 has read the volume…«) + popravek str. 60–61 → 51 v zgodbi sl+en + doplnilo pri »Muzej išče« sl+en.
- **Števci:** +0 zapisov (114) / **+1 vir (651 → 652)** / **+1 identiteta (527 → 528)** / deljenih 69; ATLAS §22 neizmenjan; veriga #100 §8 neizmenjana.

## 8. Poštenost

- Sken brez besedilne plasti → branje z OCR = **javno ponovljiv postopek** (tessdata javno, ukazi v summary.json); kjer je OCR dvomil (posamezne črke: »Vista dela« = Vrsta dela, »GI« = G1, »T]« = TJ), je bila razlaga zapisana iz konteksta, ne tiho popravljena.
- Mapping folij 1:1 vizualno preverjen na 300 dpi (v nasprotju z VS 48, kjer so strani razpenjane) — popravek strani (60–61 → 51) temelji na foliju, ne na ugibanju.
- Nejasnost kazala (vnosa uvrščena v »rimsko obdobje«) zapisana kot nejasnost, ni rešena z interpretacijo.
- OCR napake v surovinah ostanejo nespremenjene (surovina = dokaz); vgradnja citira kontekstualno razumljene nize.
