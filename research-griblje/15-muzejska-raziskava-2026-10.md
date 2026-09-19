# Muzejska raziskava: Griblje po slovenskih spletnih muzejih, zbirkah in knjigah (47. sklop)
*Zadatak: iskanje Griblje po slovenskih spletnih muzejih — Kamra, SEM, Belokranjski muzej, Šolski muzej, ZVKDS, dLib, SIstory, COBISS, krajevni leksikon … — po vseh zbirkah in knjigah, osredotočeno izključno na Griblje · oktober 2026*

## Metoda
- **22 ciljanih spletnih iskanj** po ustanovah (Kamra, Belokranjski muzej, dLib/COBISS, SIstory, Muzejski dokumentacijski center/museu.ms, Narodni muzej, Slovenski etnografski muzej, krajevni leksikon, ZVKDS/register, Geopedia, cerkev/škofija, Zbornik Bele krajine, arheologija, folklora, šola, NOB, fotografije, domača imena …) + 2 kroga iskanj za točne citacije — surovi rezultati v `raw-web-muzeji-2026-10/` (21 JSON + digest + orodja).
- **Pridobitev in preberanje strani**: Belokranjski muzej (publishwall.si post 292000 Kulturna zgodovina — polna predstavitev zbirk), Slovenski etnografski muzej (drupal: digitalne zbirke + zapisov F0000182 in F0001407 + ključne besede), muzejsporta.si (SŠM letno poročila), arheologija.si / arheologija.splet.arnes.si (zbornika 2012/2020/2023), iza2.zrc-sazu.si (bibliografije), hrcak.srce.hr (Etnološka tribina 16/9 1986), cox.si (zavrnjeno — napačna domena).
- **Curl-kroženje** po belokranjski-muzej.si (sitemap, post-strani), etno-muzej.si (drupal iskanje, ključne besede, zapisi), hrcak.srce.hr.

## Najdbe z ustanovami — kaj imajo o Gribljah

### 1. Slovenski etnografski muzej (SEM) — Zbirka starih fotografij
- **F0000182** — »Belokranjska hiša z gospodarskim poslopjem, Griblje«; avtor neznan; klasifikacija Hiša/Gospodarska poslopja in ostale stavbe v okviru domačije; lokacija Griblje. URL: https://www.etno-muzej.si/sl/digitalne-zbirke/zbirka-starih-fotografij/f0000182
- **F0001407** — »Hiša, Griblje«; avtor **Drago Vahtar**; datum **1. 4. 1928**; klasifikacija Hiša/Ograja. URL: …/f0001407
- Pravice: ZASP — dokumentarno gradivo po dogovoru (kontakt miha.spicek@etno-muzej.si).
- **Vgrajeno**: MVG-017 belokranjska-hisa (odstavek SL/EN + 2 vira).

### 2. Belokranjski muzej Metlika — zbirka Kulturna zgodovina
- **Toaletna skledica s podobo Napoleona I.** — porcelan, kolorirana podoba cesarja v sredini; začetek 19. stoletja; kraj predmeta: **Griblje**; **inv. št. 1767**. Kontekst muzeja: predmeti z Napoleonovo podobo v Beli krajini od Ilirskih provinc (1809–1813); višji davki, upor v Starem trgu in Črnomlju, vojska iz Novega mesta.
- Pridruženo (ni Griblje): uskoška sablja iz Dolenjcev (inv. 1762), vrč s srebrniki z Grabrovca (inv. 1760) — *ne* vgrađeno.
- **Vgrajeno**: MVG-092 ilirska-carina-1809 (odstavek SL/EN + vir).

### 3. Slovenski šolski muzej — letno poročilo javnega zavoda
- »Odprtje muzejske učilnice na POŠ Griblje (OŠ Loka Črnomelj), 2. junija 2022 — mag. Marjetka Balkovec Debevec je v nagovoru poudarila pomen ohranjanja …« (muzejsporta.si).
- **Razpoložljivi podatki**: poročilo navaja **2. junij 2022**, Svet24 in zapis MVG-046 **26. junij 2022** — razlika zapisana v viru, točen datum čaka potrditev (TO_COLLECT).
- **Vgrajeno**: MVG-046 muzejska-ucilnica (vir z opombo o razliki datumov).

### 4. Arheološka literatura (Varstvo spomenikov, The Holocene, Opera IAS)
- **Dular, A. (2001): Griblje in problem nižinskih arheoloških kompleksov v Sloveniji — Varstvo spomenikov 39, str. 7–27** — temeljni strokovni članek.
- **Andrič, M. (2007): Holocene vegetation development in Bela krajina (Slovenia) and the impact of first farmers on the landscape — The Holocene 17(6), 763–776** — polenska zapisa Mlake in **Gribelj**: intenziven človeški vpliv okrog **4150 cal BC** (krčenje gozda).
- **Andrič, M. (2011): Lateglacial vegetation at Lake Bled and Griblje marsh (Slovenia) — Opera Instituti Archaeologici Sloveniae 21, 235–249** — primerjava z ledeniškim Bledom: Bela krajina v zadnji ledeni dobi **ni bila poledenela**; Griblje marsh = poznoglacialni polenski arhiv.
- **Dular, A. (1986): Etnološka tribina 16(9)** — »Janko Barle je pisal o ženitovanjskih običajih v Beli krajini, belokranjskih ljudskih pesmih in o pastirskem prazniku (križih) v vasi Griblje.« — znanstvena koleracija za MVG-087.
- **Vgrajeno**: MVG-083 (odstavek o polenskem arhivu SL/EN + 3 vira), MVG-087 (koleracijska poved SL/EN + vir).

### 5. Druge ustanove — potrditve obstoječega stanja (brez vgradnje)
- **ZVKDS / Geohub GisKD**: »Griblje — Cerkev sv. Vida« (RNPD/EŠD 2122) — že pokrito (MVG-002/MVG-003).
- **ARHEOLOGIJA zborniki** (2012 dokumentiranje ob gradnji ARHAT/Aleš Tiran; 2020 testni izkop 20-0261; 2023 raziskave ob gradnji 23-0070; ZVKDS CPA) — že pokrito z MVG-083 (EŠD 10094, vire ARHAT 2011/2021 + zbornik 2023).
- **COBISS**: AR=2193507 agromelioracije Griblje (1983) — tehnični dokument, brez muzejske vrednosti brez dodatnega konteksta (TO_COLLECT).
- **Kamra**: »Spominska obeležja v občini Črnomelj« (Knjižnica Črnomelj) — projekt, ki obsega KS Griblje; »Spominska plošča univ. profesorju dr. Niku Zupaniču« — plošča že pokrita (entiteta niko-zupanic/MVG-010); obeležja naselja so v zbirki (spomenik-padlim …).
- **SEM »Etnolog: Bela krajina« + »Svetovljan iz Gribelj: dr. Niko Zupanič«** — potrditve MVG-010; francoski biografski zapis (Slovenski etnograf) čaka na kuratorsko vgradnjo v opombo entitete (TO_COLLECT).

## ZAVRNJENO (duplikat / neoverljivo / ni Griblje)
| Najdba | Razlog zavrnitve |
|---|---|
| Žbularji / žbul (dups.si, utzo.si) | že pokrito (MVG-051 gribeljski-žbul, glossary, minute-stories, walks) |
| Šola 1888/1889 (osloka.splet.arnes.si) | že pokrito (MVG-045 vaska-sola: cesarjeva donacija 1885, blagoslov 5. 11. 1889, Peter Kambič) |
| EŠD 10094 (zborniki ARHEOLOGIJA) | že pokrito (MVG-083) |
| EŠD 11118 Kučar (Geohub) | že pokrito (MVG-060) |
| Muzejska učilnica odprtje (muzejsporta) | že pokrito (MVG-046) — dodan le vir + razlika datumov |
| Križevo/pastirski praznik (hrcak) | že pokrito (MVG-087) — dodana le znanstvena koleracija |
| Uskoška sablja, vrč s srebrniki, grb Lenkoviča (BM) | **ni Griblje** (Dolenjci, Grabrovec, Pobrežje) |
| Železarna Gradac 1882 + Johan Mazelle/Johan Barle (svet24) | Gradac ni Griblje; »šolski upravitelj Johan Barle« brez ugotovljene povezave z gribeljskimi Barleti — TO_COLLECT (dlib.si časopisna baza) |
| Kupski manevri vojske KJ 1937 (researchgate) | vojaška logistika (voda za ~20.000 vojakov, »Griblje 57«) — brez muzejskega konteksta brez izvirnika; TO_COLLECT |
| Interniranci na Rab iz Gribelj (slov.si) | identiteta (priimek »…rič«, padel v Kriški vasi 1. 5. 1944) neoverljena brez izvirnika — TO_COLLECT |
| Kačje pastirji/čaplje RTŠB 2008 (dsb.si) | biotski zapisi ob Kolpi — stran naravoslovja, ki je muzej namenoma ne pokriva (brez vira na vas) |
| »Zvonovi so sami zapeli« (researchgate) | etimološka omemba Gribelj v monografiji o toči — neoverljeno brez izvirnika; etimologija že pokrita (MVG-072 etimologija-gribljati) |
| cox.si »Griblje marsh« | napačna domena (nadragska oprema) — prava citacija rešena z Andrič 2011 |

## Spremembe števil in regresije
- Virovi vrstice: **415 → 423** (+8), identitete virov: **317 → 325** (+8, vsak z unikatnim URL), deljeni viri: 52 (nespremenjeno), zapisi: 93 (nespremenjeno).
- Posodobljene konstante: test-timeline-map (T7.2/T7.3/T8.3/T8.4), test-entities (T8.6/T8.11/T9.3/T9.4), audit-entities, audit-timeline-map, test-curator-red-team (R0.3/R16.2 — konstante bile stale na 412, sedaj 423).
- Orodje: `BASE_URL` okoljska spremenljivka za test skripte (privzeto ostaja :3000).

## Rezultati regresije (vse zeleno)
test-entities **100 ✓ / 0 ✗**, test-timeline-map **72 ✓ / 0 ✗** (proti živemu strežniku :3100), test-ai-curator **214 ✓ / 0 ✗**, red-team **157 ✓ / 0 ✗** (GAP 24 nespremenjen), audit-entities ✓ 0, audit-timeline-map **39 ✓ / 0 ✗**, verify-i18n **930 × 5**, tsc **0**, eslint **0**, db reseeda (idempotentno) → OpenData **93/423**; spot-check 5 strani živo (/exponat/ilirska-carina-1809, /exponat/belokranjska-hisa, /exponat/arheolosko-najdigsce-ob-kolpi, /exponat/krizevo-pastirski-dan, /exponat/muzejska-ucilnica).

## Ostala odprta vprašanja (TO_COLLECT — kustos)
1. Identifikacija hiš na SEM F0000182/F0001407 (katera domačija? ograja?) — pisna prošnja SEM (miha.spicek@etno-muzej.si) za visoko ločljivost + dovoljenje za objavo.
2. Točen datum odprtja muzejske učilnice (2. vs 26. junij 2022) — uradni dokument SŠM ali OŠ Loka.
3. Johan Barle, »šolski upravitelj« (dlib.si časopisje ob železarni Gradac, 1882) — sorodstvo z gribeljskimi Barleti?
4. Interniranci Gribelj na Rabu — imenjski pregled (COBISS: Spominska knjiga pregnanov).
5. SEM »Svetovljan iz Gribelj« — kuratorska vgradnja v opombo entitete niko-zupanic.
6. Kamra/Knjižnica Črnomelj — digitalizirana spominska obeležja KS Griblje (pregled pri novem obračunu).
