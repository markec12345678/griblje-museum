# 41. val spletnega raziskovanja — FRANCISCEJSKI KATASTER PREBIT (VAC/IIIF): k.o. N83 Griblje s 12 enotami · »Protocoll der Bau Parcellen der Gemeinde „GRÜBLE“« 1825 = primarna potrditev Grüble · prvi arhivski korak k vprašanju gostilne · Krajevni leksikon 1937 = izčrpani kanali, dobro dokumentiran TO_COLLECT

*Muzej vasi Griblje · 93. sklop · 23. 9. 2026*

Zahtevek: »nadaljuj kjer si ostal« (41. val; izven-peskovniška vrsta vala 40). Vrstni red vrste: (1) gostilna pred 1898 (MVG-109, novi kanali), (2) SI AS 176 Franciscejski kataster (»VAC živ«), (3) Vavpotič/Gaspari (dedup). **Eden največjih prebojev muzeja: prvi primarni arhivski fond o vasi, ki je v celoti enumeriran in (deloma) digitalno prebran — brez knjižničnih vmesnikov.**

## Poleno 1 — Gostilna pred 1898: spletni sloj je prazen, arhiv pa ne

Zasnova: z-ai web_search »"Griblje" gostilna krčma zgodovina« = **0 zadetkov** (422 »No search results available«) — spletni iskalni indeks nima nobene zgodovinske povezave Griblje+gostilna; to je sama po sebi dokumentirana praznina. Nadaljevanje je zato šlo skozi arhive (Poleno 2). Rezultat: **prvi primarni arhivski vpogled v vprašanje»gostilna pred 1898«** (glej Poleno 3, korak 5) — spletni sloj je prazen, katastrska lista pa odgovarja.

## Poleno 2 — Krajevni leksikon Dravske banovine 1937: vpis Griblje obstaja, polno besedilo izčrpano (TO_COLLECT z bogato zgodovino kanalov)

1. **z-ai web_search** (»"Griblje" "Krajevni leksikon" 1937 trgovina gostilna«) potrjuje: **Scribd drži cel sken leksikona** in Googlov izsek direktno citira vpis: »**Griblje 1 km. Nm ca 150 m. Lei na terasi na levem bregu Kolpe. Zaselek ima …**« (odrezek se konča tik pred podatki o zaselkih/stavbah). Leksikon = krajevni repertorij z uradnimi, topografskimi, zemljepisnimi, zgodovinskimi, kulturnimi, gospodarskimi in tujskoprometnimi podatki vseh krajev Dravske banovine (Ljubljana 1937, 715 str. + 24 f. prilog z topografskimi kartami).
2. **Kanal 1 — dLib**: web_search izsek s stran dLib pokaze **dva PDF-a (310 MB + 248 MB)**; curl = HTTP 000 (peskovniška blokada, znana od 4. vala), r.jina.ai = 401 »bad IP reputation«, **page_reader na /v2/Results.aspx = ASP.NET školjka** (brez seje WebForms vrne domačo stran), page_reader na API v2 = »Malicious request« (detekcija ne-brskalniškega UA).
3. **Kanal 2 — sistory.si**: iskalni endpoint 403 curl, JINA = CAPTCHA, **agent-browser ostane na Cloudflare Turnstile** (»Verify you are human« po kliku ne preklopi — headless zaznan).
4. **Kanal 3 — dizbi.hazu.hr (HAZU)**: dosegljiv (HTTP 200, Indigo platforma: parametra `pr` + `msq`); **agent-browser poišče zapis** (»Prikazano 1-1 od 1 zapisa«) — **a je samo kataloški** (id 299807, signatura II-30.858, Knjižnica HAZU Zagreb; »Iz starog kataloga«) **brez digitaliziranega skena**.
5. **Kanal 4 — Google Books API** = 429 (deljeni IP; id PCWZpwAACAAJ = brez predogleda).
**Sodba:** vpis Griblje v leksikonu 1937 je znan po obstoju (izsek dokumentira lego »na terasi na levem bregu Kolpe«), celotno besedilo pa ostaja **TO_COLLECT** z najbogatejšo zgodovino blokad doslej (dLib/sistory/dizbi/GB/Scribd). Ne graditi zapisa iz odrezka (disciplina iz 24. vala).

## Poleno 3 — SI AS 176 Franciscejski kataster za Kranjsko (1823–1869): fond enumeriran do lista, N083PT prebran

1. **Vstop prek odprtih podatkov:** CKAN API podatki.gov.si (`/api/3/action/package_search?q=Franciscejski+kataster`) → 1 paket »Digitalizirano arhivsko gradivo starih katastrov (SI AS 176–182)« z 18 viri, med njimi **VAC (vac.sjas.gov.si) povezave na fond id 23253–23259**. VAC = »Virtualna Čitalnica« Arhiva Republike Slovenije — vrstica izven-peskovniške vrste »VAC živ« potrjena.
2. **SSL past peskovnika:** curl na vac.sjas.gov.si = exit 60 (napaka certifikata) → **`curl -k` gre skozi** (HTTP 200, 119 kB za details?id=23253) — peskovniška SSL-prestrega, ne WAF.
3. **Tektonika fonda rekonstruirana prek jstree AJAX-a:** `/vac/search/archivePlanSearchAjax?id=N&page=0` (X-Requested-With: XMLHttpRequest) vrača JSON vozlišča. Pot: 1000001 → 653381 (000 UPRAVA) → 653535 (070 Posebni upravni organi do 1945/47) → 653582 (071) → **23253 SI AS 176 Franciscejski kataster za Kranjsko, 1823–1869**. Pod fondom trije kresiji + legenda: **L Ljubljanska (223769), N Novomeška (226589), A Postojnska (232262)**.
4. **PRELOM:** pod Novomeško kresijo (102 enot, N1 Adlešiči …) stoji **»N83 Griblje, k.o.« (id 227663)** — katastrska občina Griblje obstaja v franciscejskem katastru. Pod njo dve veji: **grafični (227665)** z 5 listi **N083A01–A05 (227666–227673)** in **spisovni (373412)** s 7 serijami: **N083PG Skica (373413), N083PR Opis meje (373414), N083PS Seznam zemljiških parcel (373415), N083PT Seznam stavbnih parcel (373416), N083PUA Abecedni seznam lastnikov zemljišč (373417), N083PV Izkaz rabe zemljišč (373418), N083PZ Katastrski cenilni elaborat (373419)** — skupaj **12 arhivskih enot**.
5. **Digitalizacija:** samo **N083PT je digitaliziran** (details?id=373416 → file?uodid=373416&id=41781 → 302 na TIFY-viewer; JS na strani izpostavi IIIF: `/vac/iiif/pdf-manifest?uodid=…&docid=…`). **Manifest (IIIF Presentation 2)**: »N083PT.pdf«, **8 strani, 2,8 MB**, izdelovalec LuraDocument PDF v2.16 (2006), **»Besedilni sloj: naloži se ob odprtju pogleda besedila«**, rendering = `tifyPdfDownload`.
6. **Prenosni boj:** tifyPdfDownload = PDF 1.4 z **razbitim xref** (611 kB ≠ 2,8 MB — prenos dušen; Range zavrnjen, 200 namesto 206; qpdf »root of pages tree has no /Kids array« — nepopravljivo) → **preklop na IIIF slike strani**: `/vac/util/pdfPageImage?uodid=373416&docid=41781&page=N` — **vseh 8 strani prenešenih** (36–300 kB JPEG).
7. **PREBERANO (VLM transkripcija + ang-OCR kontrola):** **naslovnica (str. 1): »Protocoll Der Bau Parcellen der Gemeinde „GRÜBLE“**« — protokol stavbnih parcel občine **Grüble** = Griblje v nemški uradni formi; **prva primarna arhivska potrditev oblike Grüble** (doslej samo sekundarno — urbar, najstarejši zemljevid). Strani 4–8 = tabela stavbnih parcel: št. parcele, lastnik (Kurrent rokopis), stan, kje živi, št. hiše, **Gattung** (vrsta stavbe), areal. Preliminarna branja izločijo gribeljske priimke (Gorg, Muffel, Hribar, Sedivy, Pavlicek, Fiedler, Almerig, Loparz, Fellach, Dichatschak …) — **za muzej so vsa imena označena kot PRELIMINARNA branja, ne dokumentirana dejstva** (Kurrent + VLM halucinacije).
8. **Gostilna v katastru 1825:** VLM je na straneh 4, 6 in 7 **izrecno zavrnil** najdbo Gasthaus/Gastwirtschaft/Wirtshaus/Schenke/Handlung — Gattung izključno bivalne/gospodarske (Wohnhaus, Häusl, Haus, Scheune). **To ni dokaz odsotnosti gostilne** (klasifikacija = pisarjeva sodba), ampak **prvi primarni arhivski odgovor** na vprašanje, ki ga MVG-109 postavlja z »Muzej išče: datum prve tiskane gostilne«.
9. **N083PUA/PV/PZ/A01–A05 NISO digitalizirani** (details brez file-povezave) — TO_COLLECT; izkaz rabe (PV) bi tudi potrjil/ovrgel podatek Miklavčič 1965 o 77,50 ha steljnikov na KO Griblje.

## VGRADNJA (add-only, rep-strict, idempotenten ingest.py)

- **MVG-001 griblje-vas** (+1 vir = viri razširjeni): `franciscejski-kataster-n83-vas` — arhiv, VAC id 227663; opomba z 12 enotami (5 grafičnih + 7 spisovnih), PT digitaliziran (docid 41781), naslovnica GRÜBLE = primarna potrditev, preostale enote TO_COLLECT. Zgodba SL/EN +1 odstavek (katastrska občina N83 v prvi moderni popisni mreži; tri stoletja po vpadu spet na katastrskem zemljevidu monarhije).
- **MVG-109 bridke-izkusnje-1898** (+1 vir): `franciscejski-kataster-n83-pt` — arhiv, VAC id 373416; opomba z preliminarnim branjem (Gattung brez gostilne; branje kvalificirano kot predhodno; preveritev s specializiranim prepisom TO_COLLECT). Zgodba SL/EN +1 odstavek (prvi arhivski korak k »gostilna pred 1898« — primarna stran namesto le literarne omembe).
- **Konstante**: 580→**582** virov (5 skript), 461→**463** identitet-virov (3 skripte; poučno: »identitete« v auditu = različni source-ključi, +2 nova ključa na dveh zapisih = +2, deljenih virov ostaja 67) — prvi zagon je ujel aritmetiko pred pushom.

## Regresija (živi :3000 po reseedu)

tsc 0 · lint čist (BABEL-nota o >500 kB museum-content je samo deoptimizacija stila) · verify-i18n **946 × 5** (en/hr/de/it identična SL) · audit-entities ✓ 0 napak (**113/582/463/67/375**; 95 entitet, 36 oseb) · audit-timeline-map 39 ✓/0 · test-entities **100** ✓/0 · test-timeline-map **72** ✓/0 · test-ai-curator **214** ✓/0 · red-team **157** ✓/0 · test-plan-visit **42** ✓/0 · OpenData **113/582** živo · sitemap 114 (brez novih zapisov).

**agent-browser:** MVG-001 — »GRÜBLE«, »Protocoll der Bau Parcellen«, »N83 Griblje«, »franciscejsk«, »1825« ✓; MVG-109 — »Protocoll«, »gostilne«, »1825«, »Wohnhaus«, VIRI + href vac.sjas.gov.si (details?id=373416) ✓; hero 113 ✓; noga footBottom = pageH 15.542 (vrzel 0) ✓; 390 px: scrollWidth = 390, preliv 0 ✓; konzola čista ✓. (Poučno: pot zapisa je `/exponat/[slug]`, ne `/exhibit/` — prvi klik je dal 404.)

## Tehnične poučne točke

1. **VAC = nov kanal za vse arhivsko gradivo ARS**: CKAN podatki.gov.si → VAC details-id → archivePlanSearchAjax (JSON drevo) → details → IIIF manifest (pdf-manifest) → pdfPageImage po straneh. Curl mora imeti **`-k`** (SSL-prestrega peskovnika) in `X-Requested-With: XMLHttpRequest` za AJAX.
2. **LuraDocument PDF-i iz 2006 imajo razbit xref** — pdftotext/qpdf odpovedeta; **pdfPageImage + VLM je zanesljiva pot** za rokopisne (Kurrent) dokumente, kjer tesseract-eng ne zmore nič (8 strani = 2 kB OCR-ja).
3. **Dve „dušenja“ strežnikov v enem valu** (DiRROS 25 kB/s v 39. valu, VAC ~5 kB/s) — pravilo ostaja: IIIF slike strani namesto celotnega PDF-ja.
4. **audit-entities „identitet“ = distinct source-ključi**, ne biografije — štetje konstant vedno iz OpenData/audita, ne na roko (tretja ponovitev te poučne epizode).
5. **Sistory/dLib/dizbi trije različni tipi blokad** v enem valu: Cloudflare Turnstile (headless ne preklopi), seje-vezani WebForms (page_reader vrne školjko), kataloški zapis brez skena.

## Izven-peskovniška vrsta (posodobljena)

**Franciscejski kataster N083: preostalih 11 enot** (A01–A05, PG, PR, PS, PUA, PV, PZ — digitalizacija/prepis; PV tudi kontrola 77,50 ha) → **N083PT specializiran Kurrent prepis** (gostilna + popoln seznam lastnikov) → Krajevni leksikon 1937 vpis Griblje (dLib seja izven peskovnika; izsek že znan) → Andrič 2001 DPhil (življenjska seja ORA) → Andrič 2007 Holocene polno besedilo (SAGE seja) → SI AS 177–182 (katastri Štajerske/… za primerjavo) → gostilna pred 1898 (župnijska in hišna knjiga) → vrzel #3 (360°) → kataster jam (ko gostitelj oživi) → Miklavčič 1965: preostalih 68 strani → Poganjec + Lojze↔Alojz (izven peskovnika).

## Stanje

**113 zapisov (MVG-001–113), 582 virov, 463 identitet, 67 deljenih, 95 entitet (oseb 36); sitemap 114; i18n 946 × 5; 13 API poti.**
Surovine: `raw-web-val41-2026-10/` — n083pt-pages/ (8 JPEG + 8 TXT + p1.txt), vlm-p1/p4–p8.json, manifest-41781.json, render-url.txt, n083pt.pdf (611 kB, razbit xref), plan-*.json (tektonika), vac-*.html, ops-ckan.json, s01–s07, dizbi HTML, ingest.py.
