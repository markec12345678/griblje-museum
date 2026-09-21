# 29. Val 15 — Odeon re-enumeracija: sistematično iskanje po radiu + sveže vsebine 2025–2026 (2026-10)

**Naročilo:** »odlicno nadaljuj raziskuj« (po sklopih 61–63; vrzeli #2/#4 zaprti, val 14 opravljen). Val 15 = zadnja velika enumeracija Radio Odeona: iskalni arhiv (`/iskanje/` + `limit=100`, curl z brskalnim UA in IPv4 — stranski predlogi ločeni od pravih zadetkov prek `<main>` bloka), dvojezična poizvedba »griblje« + »gribelj«, paketna pridobitev 21 člankov.

## Surovine

`research-griblje/raw-web-val15-2026-10/` — iskalna HTML (griblje/gribelj), 21 člankov (`clanki/`), JSON iskalnih rezultatov (s1–s12), page_reader pridobitve (kovček, Derganc, Commons kategorija).

## Metodološki preboj

- Iskalnik `?s=` (privzeta novičarska lista) in JS-renderirani `/iskanje/` sta slepa za statično pridobitev; **`/iskanje/?q=…&limit=100` z curl -4 + brskalnim UA vrne prave zadetke** (prejšnja blokada 000 = IPv6 problem, ne Cloudflare).
- Stranski predlogi (»Poglejte še«) so ločeni: rezultati samo iz `<main>` bloka → 19 zadetkov za »griblje« + 21 za »gribelj«, unija ~33, dedup proti 57 obstoječim odeon slugom.

## Prelomi (17 novih virov, 488 → 512; identitet 385 → 402; deljenih 54 → 60)

1. **MVG-042 franc-brinc — donacije so letni koledar:** OŠ Loka (15. 10. 2021): obisk dr. Brinca na PŠ Griblje 8. 10. 2021 — ravnateljica Damjana Vraničar, »stara učilnica« na podstrešju (pouk obiskoval med 2. svetovno vojno), KS s predsednikom Tonijem Brincem, župan Andrej Kavšek, **slavnostno odprtje cestne razsvetljave blizu šole**; Radio Odeon (19. 12. 2025): novoletna prireditev za starostnike (RK + KS + občina) — vodja podružnice **Marjetka Žunič**, Brinc »ob koncu leta šoli **znova** podaril 5.000 evrov« (vsakoletna donacija!). P2-E1 alias potrdjen z neodvisnim virom; P2-E2 (datum rojstva) ostaja odprt.
2. **MVG-098 pogaca — drugi gribeljski naslov:** Radio Odeon (22. 4. 2026): ocenjevanje 21. 4. 2026 v Hiši dobrot Metlika — **Darinka Jerčinovič (Kovačnica sreče) 79/80 točk**, »praktično brezhibna«; komisija pod RIC BK + DKŽ Metlika; merila ZTP; + drugi poročevalec (Vinska vigred, 16. 5. 2026). Dvakratna zmagovalka (2024 + 2026).
3. **MVG-082 žbul — sortna lista + sladoled:** Radio Odeon (21. 9. 2026, vir LU Črnomelj): žbul **vpisan v sortno listo** kot avtohtona tradicionalna sorta (»gribeljski žbul ali belokranjka« — slamnata barva, podolgovate čebulice, odpornost, trpežnost, redko uhaja v cvet); podmladek DKŽ na Dnevih zeliščarstva: mafini, grisine, pogačice, namazi, kreme, **sladoled iz žbula**; Erasmus+ (6. 4. 2026): gostje iz Srbije zasadili 2 sadni drevesi + žbul na PŠ Griblje.
4. **MVG-097 razsvetljava — mikro-geografija omrežja skozi 5 let:** 13. 10. 2025 (TP GOR. GRIBLJE, **38 naslovov** 1 A–52 + BŠ), 8. 6. 2026 (izvod 2 »**GOR.G.-VIKENDI**« — vikend hiše ob Kolpi: 1 A, 4 A, 4 G, 25 D, BŠ), 30. 8. 2026 (**TP GRIBLJE, izvod Šola**: 30 A–48 + BŠ — druga postaja!). Sklep: dve postaji, vsaj trije poimenovani kraki; + razsvetljava blizu šole ima datum rojstva (8. 10. 2021, Brinc/Toni Brinc/Kavšek).
5. **MVG-010 niko-zupanic — revija Jug 1901:** epizoda Ljudje ob Kolpi: Franc Derganc (26. 2. 2026): »leta 1901 sta skupaj **z Nikom Zupaničem iz belokranjskih Gribelj** izdajala kulturno-politično revijo **Jug**« — neodvisna potrditev domovine + nov biografski podatek (prva časopisna izkušnja); tudi vir MVG-074 (serija pričuje o lastni vlogi).
6. **MVG-084 jurjevo — legenda o brodarju:** Radio Odeon (24. 4. 2017, vir FS Zeleni Jurij): zakaj Bela krajina praznuje dan po Hrvaški — Zeleni Jurij ni imel groša za brodarja na Kolpi in je dnino oddelal. Reka je zadržala tudi svetega Jurija.
7. **MVG-047 kavbojski žur — tretja izvedba (julij 2026):** Country Roses, mehanski bik, tatuoji; predsednica KS **Romana Husič**, predsednica TD **Mateja Pezdirc**, priznanji za **Katjo Lavrič** in **Bojano Brodarič**, povezovala **Katarina Podržaj**, glasba Rene Fajt Muzik + DJ Sherif, foto Nikola Rahija.
8. **MVG-032 torpedo — naslovljeni gost na Sem'ški ohceti:** Radio Odeon (30. 8. 2026): Torpedo – Griblje posebni gostje blagoslova motoristov in kolesarjev v Semiču (redni obisk leta 2026 v novi vlogi — poimenovani v programu).
9. **MVG-026 vaska-sola — urnik, ki se piše naprej:** novoletna prireditev (19. 12. 2025), zaključna prireditev 23. 6. 2026 + **Noč knjige** (učiteljica **Ana Kočevar**: Palček Migetaliček Vesne Draginc; naslednji dan kopališče), Pravljični potujoči kovček (19. sezona; zaključni srečanji OŠ Vinica + PŠ Griblje, 1. 6. 2026; obisk junija), Brincov obisk 2021, Erasmus+ sajenje 2026.
10. **MVG-089 dkz — žbul na medregijskem srečanju:** Radio Odeon (20. 6. 2026): srečanje DKŽ Bela krajina/Kočevje/Lukovdol — »članice iz Gribelj so govorile o žbulu«; + podmladek na Dnevih zeliščarstva (vir LUČ).

## Dedup (namenoma ni vgrajeno)

- **prvi-solski-dan 3. 9. 2026** — OŠ Loka URL že vir `os-loka-prvi-dan-2026` (Odeon = ponovna objava).
- **kolesarski-izlet z metliškimi policisti (17. 9. 2026)** — OŠ Podzemelj; Griblje samo na ruti.
- **kilometri-malih-zmag (1. 6. 2026)** — Country Roses kot popestritev tuje prireditve (že pokrito prek MVG-047).
- **na-roglo-in-v-tehnopark (18. 6. 2026)** — PŠ Griblje izlet; manj specifičen (šola ima že zaključno + Noč knjige).
- **izklop 15. 9. 2026** — isti izvod Šola kot 30. 8. (omejen dodatek naslovov 31 B/32 C/35 B) — omenjen v opombi vira.
- **Ljudje ob Kolpi: Lojze Zupan** (21. 9. 2026; učil v Podzemlju/Gradcu/Črnomlju, pisec pripovedk) — ni neposredne gribeljske veze; **Roman Kunič** (21. 9. 2026; družina z Grička — Grič ≠ Griblje) — izpuščena z izrecnim sklepop; **Adolf Pirsch** (omenjen v stranski vrstici) ni preverjen.
- Wikimedia Commons **Kategorija:Griblje** — vseh 10 datotek že v zbirki (2 × 1945 Veselko, Kolpa, ribniki, malenca, meja, hiša …); sama kategorija že vir `commons-griblje-kategorija`.
- OŠ Loka **»OBISKAL NAS JE dr. FRANC BRINC«** — vgrajen kot nov vir (osloka-brinc-2021); **ni** duplikat obstoječih Brincovih virov (nov dogodek 2021).

## Regresija (živi :3000)

tsc 0, eslint čist, verify-i18n **946 × 5**, audit-entities ✓ (512/402/60/372), audit-timeline-map **39 ✓/0**, audit-iiif-annotations **5 ✓/0** (372/372), test-entities **100 ✓/0**, test-timeline-map **72 ✓/0**, test-ai-curator **214 ✓/0**, red-team **157 ✓/0** (GAP 24), test-plan-visit **42 ✓/0**; reseeda → OpenData **101/512** živo (sourceKey 512/512), nove slike/viri v zapisu živi (MVG-042 dialog prikazuje novo zgodbo + vir); konstante usklajene (512/402/60 v 6 skriptah). **Poučni epizodi:** (1) vstavljanje odstavkov v TS stringe mora uporabljati ubežane `\n` — realne nove vrstice uničijo string literal (2 × popravek, tsc kot varovalka); (2) MultiEdit ni atomaren v praksi — preverba per-check po vsakem kolu.

## Stanje

**101 zapisov (MVG-001–101), 512 virov, 402 identitet, 60 deljenih, 94 entitet; sitemap 102; i18n 946 × 5.**

## Ostaja TO_COLLECT

posnetek jurjevske pesmi; »Griblje 2019« (DOZIS); hišna številka rojstne hiše Županiča; imena žensk na F0000838; SŠM mapa; arheološka poročila STIK/EVI; kajdarji; datum rojstva Franca Brinca (P2-E2: 8. 4. ali 12. 4. 2025); biografija Borisa Grabrijana (P2-E1 — ni spletne sledi); hiša »na pero«.
