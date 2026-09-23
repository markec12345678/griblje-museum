# 38. val spletne raziskave — Documenta Praehistorica 34 (polno besedilo, 32 × Griblj), Oxford DPhil 2001, RTV headless preboj
*90. sklop · 23. 9. 2026 · naročilo: »odlicno nadaljuj«*

## Izhodišče
HEAD `e1b0ad0` (89. sklop) = origin/main ✓, delovno drevo čisto; stanje **113 zapisov (MVG-001–113), 572 virov, 453 identitet, 67 deljenih, 95 entitet; sitemap 114; i18n 946 × 5; 13 API poti**.

## Vrsta iz workloga (37. val)
OpenAlex z lastnim ključem (citacije Mason 2001) → dLib Mason 2001 → ARSO letna serija → vinogradniška diploma → Kataster jam → Belokranjec PDF → Poganjec → Lojze↔Alojz → SI AS 176 → gostilna pred 1898 → vrzel #3 (360°) → Andrič 2007 polno besedilo → Odeon »Donatorstvo PŠ Griblje« → RTV headless sejo.

## Poleno 1 — OpenAlex (polite pool, brez ključa)
**PREBOJ: filter-poizvedbe delujejo brez lastnega ključa** (dnevni anonimni budget deljenega IP je dovolil filter+cites, ne pa `search`):
- `works/DOI 10.1177/0959683607080516` → Andrič 2007 (The Holocene 17-6): closed, **cited_by 33** → **vseh 33 citacij izštevilčenih** (`filter=cites:W2079573702`).
- Med citati 2 kandidata: **Andrič 2007 DP 34** (Documenta Praehistorica 34, DOI 10.4312/dp.34.13, odprti dostop) = NOV vir; Mason & Andrič 2009 = že `andric-mason-2009-dp36` (100 % dedup); Andrič & Karger 2024 = že `andric-karger-2024-dinaric-karst` (100 % dedup); Tolar/Mason 2024 Obrežje = ni Griblje; ostali 29 = ničelni za Griblje (fire synthesis, Prespa, Dinaric karst, Sopot …).
- **Izštevilčevanje citacij Andrič 2007 = zaprto.** Mason 2001 search prek OpenAlex ni več izvedljiv danes (budget izčrpan: »Insufficient budget … $0.0008 remaining; resets at midnight UTC«) — ostaja TO_COLLECT (brez zapisa tudi v S2; naslednja pot: OpenAlex naslednji dan ali CIB dLib sejo).

## Poleno 2 — PREBOJ: Documenta Praehistorica 34 (Andrič 2007), polno besedilo
Landing page `journals.uni-lj.si/DocumentaPraehistorica/article/view/34.13` (curl deluje; 35 kB, citation_pdf_url) → **PDF 2,79 MB, 13 strani (str. 177–189)** — prenos je zahteval tri cikle (timeout 90 s ×2, nato `--speed-limit` keepalive); prvi delni prenosi = okvarjen xref (pdftotext exit 1; nepopolni resume z `-C -` je podvajal bajte). pdftotext 44,5 kB, **32 × Griblj**.

Ključne vsebine (»Why were the Neolithic landscapes of Bela krajina and Ljubljana Marshes regions of Slovenia so dissimilar?«, Documenta Praehistorica XXXIV, 2007, UDK 902.65(497.4)):
1. **Pelodno jedro »Griblje G3«** = eno od dveh palynološko raziskanih mest Bele krajine (z Mlako); majhna kotanja **premera ok. 30 m, brez dotokov in odtokov** → shrani predvsem cvetni prah najbližje pokrajine → v zapisu vidne že majhne lokalne spremembe (Jacobson & Bradshaw 1981).
2. **Prvi »Cerealia-type« žitni cvetni prah se pojavi pri Gribljih** — v pasu najmočnejšega antropogenega vpliva: **c. 6100 cal BP (≈ 4150 pr. n. št.)** — požiganje, sečnja, poljedelstvo in paša ob neolitsko-eneolitskih naselbinah **Pusti gradac in Griblje** (antropogeni indikatorji: Cerealia-type, Centaurea, Plantago l., Chenopodiaceae, Artemisia, Compositae).
3. **Radiokarbonski problem jedra G3**: plasti med **50 in 61 cm so do c. 900 let »prestare«** (Andrič in press = The Holocene 17-6); modeliranje starosti **PSIMPOLL** (SVD).
4. **Kontrast Mlaka–Griblje** (le ~10 km narazen, zelo različni zgodovini pokrajin): Mlaka (apnenec) = odprta pokrajina že od srednjega veka (c. 1000 cal BP); **Griblje (pesek in glina) = do danes pretežno gozdnato** → »areas more suitable for agriculture were probably most intensively used« (skladen z abstraktom SAGE, 33. val — zdaj potrjeno v polnem besedilu).
5. **Referenca matice: ANDRIČ M. 2001, »Transition to farming and human impact on the Slovenian landscape«, DPhil thesis, University of Oxford** — »both palynologically investigated sites in the area (Mlaka and Griblje, Andrič 2001; Andrič in press)« — **izvirna pelodna študija Gribelj**.
6. Referenčni seznam citira **Mason 2001 (VS 39: 7–27)** z dvojezičnim naslovom — dodatna bibliografska potrditev; tudi Arheološka najdišča Slovenije 1975, Dular 1985, Miklavčič 1965, Wraber 1956.

## Poleno 3 — PREBOJ: RTV iskalnik = headless sejo (5. poskus, agent-browser)
Val 37 je zapisal: »RTV 4. poskus = dokončna praznina; headless sejo = pot«. **agent-browser odpre `rtvslo.si/iskalnik?q=Griblje`, počaka AJAX in izriše rezultate — VRZEL REŠENA.** 8 zadetkov, 6 prenešenih člankov (curl, brskalniški UA), 5 z resnično vsebino Griblje:
1. **Nikolaj Dragoš (2. 4. 2018, /450688)**: »Dragoš se je rodil v belokranjski vasi Griblje«; 110 let in 216 dni = najstarejši moški prebivalec Slovenije vseh časov. **100 % dedup na ravni zapisa** (MVG-034; dl-dragos-umrl-2018 pokriva globlje) — RTV članek ni vgrajen (A2).
2. **Kopalne vode 2016 (26. 5. 2017, /423370)**: odlična kakovost na treh kolpskih mestih: Adlešiči, **Dragoši – Griblje**, Pobrežje – Fučkovci (ARSO poročilo). **100 % dedup** — MVG-006 že ima GOV.SI profil kopalne vode Kolpa, Dragoši–Griblje (K05010) + monitoring.
3. **Tobačna polja (23. 11. 2018, /472664, EN)**: tobaka kot ena vodilnih kultur v vaseh »such as Griblje«, rastlinje do 2 m+, 70 kmetov v 80-ih, sadike ljubljanske Tobačne tovarne. **100 % dedup** — URL `rtvslo...472664` že vir (»Tobačna leta«).
4. **Neurje (19. 7. 2023, /675499)**: »najhuje … v naselju Griblje v Črnomlju, **kjer je padala toča v debelini teniških žog**«. **NOV vir** `rtv-neurje-2023` na **MVG-042 franc-brinc** — datirana koroboracija toče, ki je poškodovala gasilski dom (izolacija = del Brincovega darila).
5. **Blokade/žica (27. 4. 2019, /486528, RTV serija Zidovi)**: vas Griblje med ožičenjem (poleg Zilje, Podzemelj) — hiše kot vojaške postojanke z bunkerji in žico. **100 % dedup** — utrditev postojanke 1942 (5 betonskih + 3 vkopani bunkerji) je že globlje dokumentirana (MVGV-028).
6. Oglasno sporočilo (obrobno), Razglednice preteklosti 106-letni Niko (/323956; že vir) = dedup.

## Poleno 4 — ničelni izmeri
- **OpenAlex `search`**: dnevni budget deljenega IP izčrpan (napaka: »Use your own key«) — Mason 2001 neenumerabilen danes; filter/cites delujeta brez ključa (poučno za prihodnje valove).
- **Kataster jam** (`katasterjam.pzs.si/jame.php?ko=1544`): **HTTP 000 — gostitelj mrtev iz tega omrežja** (2. meritev).
- Kamra in crnomelj.si: že izčrpana (37. val) — nista ponovno merjena.

## VGRADNJA (add-only)
| Zapis | Vir | Opomba |
|---|---|---|
| **MVG-083** (arheološko najdišče ob Kolpi) | **andric-2007-dp34** (objava, odprti dostop, DOI 10.4312/dp.34.13) | polno besedilo prebrano (38. val): jedro G3 v kotanji ~30 m brez dotokov/odtokov; prvi Cerealia-type pri Gribljih; vpliv najmočnejši c. 6100 cal BP; radiokarboni 50–61 cm do 900 let prestari (PSIMPOLL/SVD); citira Mason 2001, ANS 1975, Dular 1985 |
| **MVG-083** | **andric-2001-oxford-dphil** (objava, navedba vira) | izvirna doktorska študija (DPhil, University of Oxford 2001) — prva predstavitev pelodnih zapisov Mlake in Gribelj znanosti; polno besedilo TO_COLLECT (repozitorij UL Oxford) |
| **MVG-042** (franc-brinc) | **rtv-neurje-2023** (objava, navedba) | RTV Slovenija 19. 7. 2023: toča teniških žog v Gribljih — datirana koroboracija poškodbe gasilskega doma |

+ zgodba MVG-083 SL/EN +1 odstavek-stavek (kotanja 30 m; prvi žitni prah; 6100 cal BP; radiokarbonska »prestarost«; matica Oxford 2001).

**Konstante: 572→575 virov (10 mest v 5 skriptah), 453→456 identitet (3 skripte).**
*(Poučna epizoda: prvi zapis konstant 574 je bil aritmetična napaka — OpenData po reseedu je pokazala 575; regresija bi jo ujela pred pushom.)*

## Regresija (živi :3000 po reseed + restart)
- tsc 0, lint čist (eslint)
- verify-i18n **946 × 5** ✓
- audit-entities ✓ 0 napak (**113/575/456/67/375**; 95 entitet, 36 oseb)
- audit-timeline-map **39 ✓/0**
- test-entities **100 ✓/0**
- test-timeline-map **72 ✓/0**
- test-ai-curator **214 ✓/0**
- red-team **157 ✓/0**
- test-plan-visit **42 ✓/0**
- OpenData **113/575** živo; sitemap 114

## agent-browser (UI verifikacija)
- `/exponat/arheolosko-najdigsce-ob-kolpi`: SL stavek (»Documenta Praehistorica 34« + »Cerealia-type« + Oxfordu) ✓; **VIRI (15)** ✓ (prej 13); DOI link `10.4312/dp.34.13` ✓; preklop EN — lang=en, stavek DP 34 ✓
- `/exponat/franc-brinc`: »teniških žog« + »19. 7. 2023« ✓; **VIRI (12)** ✓
- hero 113 ✓; noga (zadnji footer) footBottom = pageH 31.531 (vrzel 0,22 px) ✓; preliv 0 pri 390 px ✓; konzola čista ✓

## Stanje
**113 zapisov (MVG-001–113), 575 virov, 456 identitet, 67 deljenih, 95 entitet (oseb 36); sitemap 114; i18n 946 × 5; 13 API poti.**

## Vrsta (posodobljena)
Mason 2001 polno besedilo (dLib sejo / OpenAlex naslednji dan z budžetom) → ARSO letna serija → vinogradniška diploma (RUL gID) → Belokranjec PDF (4. poskus) → Poganjec → Lojze↔Alojz → SI AS 176 → gostilna pred 1898 → vrzel #3 (360°) → Odeon »Donatorstvo PŠ Griblje« 2020 (COBISS ISSN 2536-328X; živa sejo) → Andrič 2001 DPhil polno besedilo (SOUL Oxford) → Andrič 2007 polno besedilo The Holocene (17: 763–776; SAGE sejo) → Vavpotič/Gaspari → kataster jam (ko se gostitelj vrne).

## Surovine (raw-web-val38-2026-10/)
`dp34-andric.pdf` (2,79 MB) + `dp34-andric.txt` (44,5 kB), `s01–s06` (OpenAlex works/DOI + 33 citacij + landing), `rtv-iskalnik-griblje.txt` (headless izpis), `rtv-cl-*.html` × 6 (prenešeni RTV članki).
