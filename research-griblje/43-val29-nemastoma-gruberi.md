# 29. val (79. sklop) — Zenodo API odpre dokaz o Nemastomi: kosca pri Gribljih sta 36 let čakala na ime — nov zapis MVG-112, +1 vir (560), +1 identiteta (442), postaja v sprehodu »Iz Gribelj v svet«

**Datum:** 2026-09-22 · **Naročilo:** »odlicno nadaljuj raziskuj« (29. val; nadaljevanje po valih 21–28)

---

## Povzetek

Devetindvajseti val je **razrešil dokazno nalogo, ki jo je val 28 zapisal med izven-peskovniške vrste**: podvrsta prostoglavca **Nemastoma bidentatum ssp. gruberi** (val 28: »lokaliteta Griblje nepotrjena, ni vgrajeno — dokaz najprej«) je sedaj **dokazano vezana na Griblje** prek polnega taksonomskega treatmenta (Plazi/Zenodo), ki izrecno navaja **dva primerka z Gribelj**, hranjena v Prirodoslovnem muzeju Slovenije. Kanal je bil odkrit v enem koraku: curl na zenodo.org je bil v valu 28 403, **Zenodo javni API** (`zenodo.org/api/records/5648410`) pa je vrnil 200 z metapodatki in datoteko treatment.html.

Rezultat: **nov zapis MVG-112** (kategorija narava, DOCUMENTED), nov vir `ejt-777-nemastoma` (European Journal of Taxonomy 777, 2021, CC BY 4.0, DOI URL = +1 identiteta), glavna slika Fig. 1A (habitus samca, foto C. Komposch, Commons CC BY 4.0) in **nova postaja v sprehodu »Iz Gribelj v svet«** (med Cryptachaea riparia in biodiverzitetnimi bazami).

Pomembna poštenost zapisa: tipovna lokaliteta nove podvrste je **Dolenje Laknice pri Mokronogu, NE Griblje**; material iz Gribelj (1985: Griblje–Desinec; 1994: Dragoši) pa je del dokaznega gradiva, s katerim je bila podvrsta ločena od kompleksa Nemastoma bidentatum. Žival s Gribelj ni »endemit vasi« — ampak je med najzgodnejšimi dokumentiranimi primerki te podvrste.

---

## Metoda

1. **Zenodo javni API** (`zenodo.org/api/records/5648410`) — **nov kanal**: record 5648410 = taksonomski treatment (Plazi pipeline) za ssp. nov.; `files[treatment.html]` prenesen prek API URL; polno besedilo (28.614 znakov) prebrano.
2. **GBIF occurrence API** (`api.gbif.org/v1/occurrence/search?scientificName=Nemastoma bidentatum gruberi`) — 57 zapisov PMSL; occurrence lokalitete **ne vsebujejo Gribelj** (material iz treatmenta je MaterialCitation, ne occurrence) — dokaz ostaja v treatmentu.
3. **Commons API** (`list=search&srnamespace=6`) — **10 slik iz samega EJT članka** (Plazi deposit), vse CC BY 4.0; extmetadata za izbiro; prenos Figure 1 (7,7 MB PNG, 1791×2229) z **User-Agent** (brez UA = Wikimedia Error), pretvorba v JPG (PIL).
4. **Crossref + Unpaywall API** (novi kanali, brez challenge): Crossref potrjuje, da VS 39 (Mason 2001) **nima DOI**; Unpaywall: Andrič 2007 (HSI, SAGE) **is_oa = False**.
5. **RUL forenzika**: ajax.php živ (`NeznanaOperacija`), odkriti cmd `getOpis/getFiles/getCsl&gID=` (metapodatkovni API), `robots.txt` potrjuje vzorec `IzpisGradiva.php?id=NNNN`; iskalni endpoint `/elastic/` = 404 (IIS), page_reader = samo TSPD loader → vinogradniška diploma ostaja TO_COLLECT brez gID.
6. **OpenAIRE**: vinogradniška diploma (»Zaznavanje spreminjanja podnebja pri vinogradnikih v Beli krajini«, Laj 2024) **total = 0** (ne indeksirana).
7. **web_search** deluje (citati VS 39 v bibliografijah SAGE/Springer/academia.edu = samo navedbe, ni polnega besedila).

## Prelomi

### Prelom 1 — lokaliteta Griblje POTRJENA za Nemastoma b. gruberi (DOKAZ iz vala 28)

Treatment EJT 777 med **material examined** izrecno navaja:

- **4 ♂♂, 2 ♀♀; »Griblje − Desinec«; 16. 8. 1985; leg. L. Slana Novak, M. Slana Novak, T. Novak (161/1997, rev. 2009); PMSL** — rob vasi proti Desincu;
- **1 ♂; »Dragoši, Griblje«; 18. 4. 1994; leg. S. Brelih (733/1998, rev. 2007); PMSL** — navedka, ki drži obe imeni (lokaliteto muzej išče natančneje; domači spomin jo lahko razreši).

Starejši navedki za širšo okolico (Novak et al. 2002: 136 [partim: Brežice, **Črnomelj**, Kočevje, Krško, Litija, **Metlika**, Novo mesto, Ribnica, Sevnica, Trebnje]) so s razdelitvijo kompleksa razrešeni v novo podvrsto — material iz Gribelj je torej od 2021 sestavni del razpona Nemastoma b. gruberi.

### Prelom 2 — zgodba o podvrsti

- Nemastoma bidentatum Roewer, 1914 = kompleks bratovskih podvrst; ekipa **Novak, Slana Novak, Kozel, Schaider, Komposch, Lipovšek, Podlesnik, Paušič & Raspotnig (2021)** je z morfologijo (bazalni člen klekelcev, pedipalpi, glava penisa) ločila podvrste; ssp. **gruberi** ime po **Jürgnu Gruberju** (Dunaj); tipovna lokaliteta **Dolenje Laknice, Mokronog** (45,93 N, 15,21 E, 237 m).
- Razširjenost: **Hrvaška, Italija, Slovenija; 4–1619 m n. m.**; ekologija: termofilno grmičevje in hrastovi gozdovi (Quercetalia pubescenti–petraeae) do poplavnih in submontanih gozdov — kakršne pozna tudi Kolpa.
- Zoobank: urn:lsid:zoobank.org:act:17EA28A1-5F36-4DFC-9191-9C8680496FAC; EJT 777: 1–67 (2021); DOI 10.5852/ejt.2021.777.1561; CC BY 4.0.

### Prelom 3 — slika iz članka na Commons

Commons vsebuje **vse slike EJT 777** (Plazi deposit, CC BY 4.0): izbrana **Figure 1A — habitus samca N. b. gruberi (foto C. Komposch, Svete gore)** kot glavna slika zapisa (`nemastoma-gruberi.jpg`, 1791×2229); druge figure (4–13) so sistemske in niso vgrajene.

## Ničelni izmeri / opuščeno

- **dLib = 6. val blokade** (curl HTTP 000; JINA »## Malicious request«) — VS 39 (Mason 2001) polno besedilo **TO_COLLECT**; stara tiskana revija, Crossref brez DOI, v spletnih bibliografijah samo navedbe.
- **zvkds.si**: poti knjižnica/revija 404 (navigacija ne vodi do revije); **eheritage.si** = register dediščine, ne založba; MNHN/EJT/Plazi PDF vrata = 404/redirect.
- **Unpaywall**: Andrič 2007 is_oa False → kopije TO_COLLECT (Core val 28 403).
- **RUL**: elastic 404; ajax cmd odkriti, ampak brez gID neuporabni; OpenAIRE ne indeksira diplome → **vinogradniška diploma TO_COLLECT** (naslednja vrsta).
- **GBIF occurrence** brez Gribelj (dokaz v treatmentu) — vgrajeno pošteno.

## Vgradnja (atomarna, rep-strict)

- **+1 zapis MVG-112** (`nemastoma-gruberi`, narava, DOCUMENTED, addedAt 2026-09-22, yearFrom 1985 / yearTo 2021; zgodba SL/EN s 4 odstavki + odstavek »Muzej išče«).
- **+1 vir** (559 → **560**): `ejt-777-nemastoma` na MVG-112 (objava, CC BY 4.0, DOI URL) z opombo, ki navaja oba zapisa materiala in zapisuje val 29.
- **+1 identiteta** (441 → **442**): doi.org/10.5852/ejt.2021.777.1561; deljene ostajajo 65.
- **+1 slika**: `public/images/authentic/nemastoma-gruberi.jpg` (Commons Figure 1, CC BY 4.0, credit z avtorjem fig.)
- **+1 postaja sprehoda** »iz-gribelj-v-svet« (med cryptachaea-riparia in biodiverzitetne-baze) → pokritost sprehodov 112/112.
- **Konstante v 6 skriptah**: 560 virov (test-entities ×4, test-timeline-map ×3, red-team R0.3+R16.2, audit-timeline-map, audit-entities), 442 identitet (test-entities, test-timeline-map, audit-entities), 112 zapisov (test-entities ×5, test-timeline-map ×3, red-team ×3, audit-entities ×2, audit-timeline-map, test-ai-curator), sitemap **113** (test-entities, test-timeline-map), withTime **99** (T7.9 — MVG-112 nosi yearFrom), sporočila »29. val: +1 …«.
- **i18n.tsx**: hero »Zbirka 111 zapisov« → **112** (SL) + coverNote 111 → 112 (SL/EN).
- **audit-numbers**: 4 popravki znotraj novega zapisa pred odkritjem (avgusta namesto „16. 8.“; (1980–1990) zraven osemdesetih/devetdesetih; 36 namesto besedne številke v SI in EN) — zapis **ne označen**.

## Regresija (živi :3000 po reseed)

- `tsc --noEmit` = 0 · `bun run lint` = čist
- verify-i18n: **946 × 5**
- audit-entities: ✓ 0 napak (**112/560/442/65/372**; 95 entitet, 36 oseb; pokritost 82/112)
- audit-timeline-map: 39 ✓/0 · audit-iiif: 5 ✓/0 (372 faz; 93 + 18)
- test-entities: **100 ✓/0** · test-timeline-map: **72 ✓/0** · test-ai-curator: 214 ✓/0
- red-team: **157 ✓/0** (GAP 24) · test-plan-visit: 42 ✓/0
- audit-numbers: novi zapis **ne označen** (starejši mehki opisi nespremenjeni — znana vrsta)
- OpenData živo: **112/560** · sitemap: **113**
- **agent-browser:** /exponat/nemastoma-gruberi — naslov, MVG-112, »dokumentirano«, slika z creditom, zgodba, VIRI (1) z opombo material examined, povezana dejstva (MVG-025) izrisani ✓; domača hero »Zbirka 112 zapisov« ✓; sprehod iz-gribelj-v-svet vsebuje postajo Nemastoma ✓; EN različica naloži ✓; preliv pri 390 px = 0 (scrollW 390 = innerW); noga: footBottom = pageH (6.021 px), vrzel 0; dev.log brez napak.

## Surovine (raw-web-val29-2026-10/)

zenodo-nemastoma-api.json (200; treatment + files) · nemastoma-treatment.html (28.614 znakov, Plazi) · gbif-nemastoma.json (57 occurrence) · commons-nemastoma.json + commons-meta.json + commons-fig1/5/16.json (slike iz članka, CC BY 4.0) · nemastoma-fig1.png (7,7 MB original) · gbooks-diploma.json (429) · crossref-mason.json · unpaywall-andric2007.json · openaire-vino.json + openaire-vino2.json (0) · rul-elastic1/2, rul-opensearch.xml, rul-script.js, rul-common.js (ajax cmd odkritje) · s01–s07 web_search · jina-dlib-vs39.md (Malicious request).

## Izven-peskovniška vrsta (posodobljena)

1. **Mason 2001 (VS 39) polno besedilo** — TO_COLLECT: dLib 6× blokada, brez DOI, tiskana revija; naslednji poskus: Belokranjec PDF / lokalne knjižnice / pri Philipu Masonu (ORCID?)
2. **Vinogradniška diploma (Laj 2024, RUL)** — gID neznano; next: Google Books API retry (429 danes), DiKUL/COBISS zapisi
3. Andrič 2007 kopije (Core 403, Unpaywall False) — nizka prioriteta (DP36 2009 pokrije vsebino)
4. Nemastoma gruberi **REŠENO (29. val)** — zapis MVG-112 vgrajen
5. Kataster jam/DZRJL, Belokranjec PDF, dLib (6×), Poganjec, Lojze↔Alojz, Kamra pričevanje, ARSO letna serija, SI AS 176, gostilna pred 1898, vrzel #3 (360° panorame)
