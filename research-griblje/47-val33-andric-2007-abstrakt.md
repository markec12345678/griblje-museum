# 33. val raziskave — abstrakt Andrič 2007 na strani založbe: Griblje (G3) na peščeni podlagi, ki je ostala gozdnata
*84. sklop · 22. 9. 2026*

## Kontekst

Zahtevek: »odlicno nadaljuj« (33. val; izven-peskovniška vrsta vala 32). Val je testiral tri vrste nalog: (1) Belokranjec PDF (celotno besedilo TO_COLLECT iz vala 24), (2) Mason 2001 prek dLib URN poti, (3) Andrič 2007 kopije — slednja je prinesla preboj.

## NIČELNI IZMERI (dva, temeljito dokumentirana)

1. **Belokranjec PDF (50,6 MB)** — še vedno za openresti JS-challenge. Preizkušene metode: (a) dvokorajni curl s piškotenim kozarcem + UA (challenge ne nastavi piškotka — reload mora izvršiti JS); (b) agent-browser (pravi headless Chrome) — **zanka »One moment, please…« se ne reši tudi po reloadih** (bodyLen 51, cookies prazne, title nespremenjen — headless zaznan ali challenge zahteva izračun, ki ga headless ne opravi); (c) page_reader neposredno na PDF — 200, a HTML prazen (50 MB binarna datoteka izven zmožnosti bralca). Datoteka `belokranjec_7-8_2026.pdf` iz vala 24 je prikazala, da je 12 kB HTML challenge-strani, ne PDF. **Celotno besedilo ostaja TO_COLLECT** (flipbook brez besedilne plasti; PDF za challenge).
2. **Mason 2001 prek dLib URN** — poti: (a) Wayback CDX (`web.archive.org`) = nedostopen iz peskovnika (timeout/ brez povezave); (b) Wikipedija API (externallinks za »Varstvo spomenikov«) = 429 rate limit (deljeni IP); (c) **`/results/default.aspx?query=Griblje` = 71.459 bajtov brez 404 — prvi delujoč rezultatski URL skozi fetcher**, ampak školjka brez rezultatov (0 × »Griblje«, 0 details-povezav): rezultati so vezani na sejo (WebForms postback / XHR); (d) `search.aspx?query=` = 41 bajtov (prazno); (e) full-parametri `EuAPI=on&fts=on&q=` = identična 71.459-bajtna školjka (cache); (f) inline JS iz školjke potrjuje vzorce `/results/?EuAPI=…&fts=…&q=…` in `/results/?query='…'`; (g) agent-browser na dLib = CDP timeout (navigacija in eval zamrzneta — dLib za headless brskalnik iz tega peskovnika nedosegljiv). **Mason 2001 polno besedilo ostaja TO_COLLECT**, tehnično znanje pa dopolnjeno: rezultatska pot je `/results/default.aspx`, ampak za rezultate potrebuje živo sejo brskalnika.

## PRELOM — abstrakt Andrič 2007 javen na strani založbe SAGE

Crossref API (dostopen od vala 29) potrjuje natančen zapis: **Andrič, Maja (2007): Holocene vegetation development in Bela krajina (Slovenia) and the impact of first farmers on the landscape — The Holocene 17(6): 763–776, DOI 10.1177/0959683607080516** (izdana sept. 2007).

**page_reader na journals.sagepub.com = 347.404 bajtov** (SAGE se pridruži Springerju kot odprti peskovniški kanal — F5/Cloudflare zaenkrat ne varuje doi-strani). Abstrakt v celoti prebran in programsko izluščen (4 × »Griblj«, 11 × »Bela krajina«):

1. **Griblje (G3) je eno od dveh študijskih najdišč** (z Mlako, »located just c. 10 km apart«): »Pollen and microcharcoal records of two small palaeoecological sites **Mlaka and Griblje (G3)** … indicate that human impact, manifested as **forest clearance and burning, was significant throughout the Holocene** …«
2. **NOVO DEJSTVO — kontrast pokrajin:** »At Mlaka, located on predominantly **limestone** bedrock, the human impact was very intensive and the present-day open landscape was formed by the Mediaeval period at **c. 1000 cal. BP**. In comparison the landscape around **Griblje (on sandy bedrock) remained predominantly forested to the present**.« — pri Gribljih odprta pokrajina nikoli ni ustalila; peščena podlaga je ostala gozdnata do danes. To dopolni (ne popravi) dosedanjo sliko zapisa: vpliv je bil izrazit v pasovih, gozd pa se je vračal.
3. **Druga neodvisna bibliografska potrditev Mason 2001**: referenčni seznam na strani založbe citira »——— 2001: Griblje in problem nižinskih arheoloških kompleksov v Sloveniji. Griblje and the problem of lowland archaeological complexes in Slovenia. **Varstvo spomenikov 39, 7—27**« — poleg Springerjeve sinteze 2024 (val 30) zdaj še avtoričin lastni članek iz 2007: Mason 2001 potrjen v dveh mednarodnih referenčnih seznamih.

## VGRADNJA (add-only, rep-strict)

- Vir `andric-2007-holocene` (obstoječ, brez URL) **dobi URL** `https://doi.org/10.1177/0959683607080516`; opombe SI/EN obogatene z abstraktnimi dejstvi (peščena/apnenska podlaga, kontrast z Mlako pri 1000 cal BP, gozdnatost do danes, 2. bibliografska potrditev Mason 2001).
- Zgodba MVG-083 SL/EN +1 stavek v odstavku o naravoslovnem zapisu (kontrast Mlaka/Griblje — »kontrast, ki popravi sliko«).
- Števci: viri **565** (nespremenjeno — vir je obstajal), identiteti **447** (nespremenjeno — poučna epizoda, glej spodaj); deljenih 65.

## Poučne epizode

1. **Identiteta ni vrstica**: dodajanje URL-ja obstoječemu viru ne poveča števca identitet — vir je bil že štet (ključ po imenu); URL le spremeni ključ identitete `ime:…` → `url:doi.org/…` (neto +0). Regresija (audit-entities ✗ 447 ≠ 448) je napako ujela pred pushom — konstante popravljene nazaj z izrecnim sporočilom. Števec identitet raste samo z NOVO vrstico vira ali novim deljenim URL-jem.
2. Belokranjec 12 kB »PDF« iz vala 24 je bil challenge-page — pri prenosih preverjati `pdfinfo`/glavo, ne samo datotečno pripono.
3. dLib školjka 71.459 bajtov z `default.aspx` = rezultatska pot deluje, rezultati pa so vezani na sejo — naslednji val lahko poskusi session-cookie prenos iz agent-browserja (ko CDP spet odziven) ali headless poskus z drugim URL-jem.

## Regresija (živi :3000 po reseed)

tsc 0 · lint čist · verify-i18n 946 × 5 · audit-entities ✓ 0 napak (112/565/447/65/372; 95 entitet, 36 oseb; pokritost 82/112) · audit-timeline-map 39 ✓/0 · audit-iiif 5 ✓/0 (372 faz; 93+19) · test-entities 100 ✓/0 · test-timeline-map 72 ✓/0 · test-ai-curator 214 ✓/0 · red-team 157 ✓/0 (GAP 24) · test-plan-visit 42 ✓/0 · audit-numbers: samo znane historične oznake (arheolosko-najdigsce neoznačena — »1000 cal BP« ujemna v obeh jezikih) · reseed → OpenData **112/565** živo · sitemap 113.

## agent-browser

`/exponat/arheolosko-najdigsce-ob-kolpi`: zgodba izrisuje »na peščeni podlagi ostala do danes pretežno gozdnata« + »pri Mlaki, na apnenski podlagi … okrog 1000 cal BP« ✓; DOI `doi.org/10.1177` v HTML-u vira (2×); EN (?lang=en): »sandy bedrock« + »predominantly forested« ✓; noga footBottom = pageH (6.395 px), vrzel 0; clientW 1280 brez preliva; dev.log čist (prisma poizvedbe + GET 200).

## Stage Summary

- Stanje: **112 zapisov (MVG-001–112), 565 virov, 447 identitet, 65 deljenih, 95 entitet (oseb 36); sitemap 113; i18n 946 × 5; 13 API poti**
- Griblje (G3) ima zdaj **abstrakt primarne raziskave** (Andrič 2007, The Holocene 17: 763–776, DOI 10.1177/0959683607080516) z novim dejstvom o pokrajini: **peščena podlaga — gozdnatost do danes**, kontrast z Mlako (apnenec, odprta pokrajina ~1000 cal BP); vir ima zdaj DOI URL
- **Mason 2001 potrjen v dveh mednarodnih referenčnih seznamih** (Andrič 2007 + Andrič & Karger 2024)
- SAGE = nov peskovniški kanal (page_reader 347 kB na doi-strani)
- Izven-peskovniška vrsta (posodobljena): vinogradniška diploma (RUL gID) → OpenAlex z lastnim ključem → Kataster jam → Belokranjec PDF **(3. poraz — headless zanka; ostaja TO_COLLECT)** → Poganjec → Lojze↔Alojz → Kamra pričevanje → ARSO letna serija → SI AS 176 → gostilna pred 1898 → vrzel #3 (360° panorame) → Mason 2001: dLib session-prenos (default.aspx pot znana) → Andrič 2007 polno besedilo (abstrakt ✓, polno TO_COLLECT)

Surovine: `raw-web-val33-2026-10/` (pr-belokranjec-pdf.json, pr-dlib-r3/r4/r5.json, pr-sage-andric.json, crossref-andric2007.json, wiki-vs-links.json, wayback-*.txt)
