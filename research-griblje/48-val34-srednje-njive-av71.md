# 34. val (86. sklop) — OpenAlex ničelni, Semantic Scholar = nov kanal, Arheološki vestnik 71 (2020): SREDNJE NJIVE PRI GRIBLJIH

**Datum:** 2026-09-22 · **Naročilo:** »odlicno nadaljuj pushaj na github vercel sinhroniziraj posodobi readme in nadaljuj« · **Izhodišče:** f86e7ce (85. sklop — sinhronizacija README po obnovi peskovnika iz GitHuba)

---

## 1. Kontekst vala

Peskovnik je bil sredi prejšnjega naročila resetiran; obnova iz GitHuba (HEAD 0d6162a = 84. sklop) je potrdila, da je bil val 21 (Vaš kanal) že zaključen v valih 21/31/32 (popis 37 člankov, 100 % dedup). 85. sklop je posodobil zastarel README status blok in potrdil sinhronizacijo GitHub/Vercel (OpenData 112/565 živo).

## 2. Metoda — dva nova kanala

### 2.1 OpenAlex — deljeni IP izčrpan (429)
`api.openalex.org/works?search=Griblje` → `{"error":"Rate limit exceeded", "message":"Insufficient budget… $0.0004 remaining; resets at midnight UTC… add ?api_key=YOUR_KEY"}`. Brez lastnega API-ključa (brezplačen, ampak zahteva registracijo zunaj peskovnika) kanal ne deluje. **Ostaja izven-peskovniška vrsta z jasno potjo: registracija ključa.**

### 2.2 Semantic Scholar Graph API — NOV KANAL (200)
`api.semanticscholar.org/graph/v1/paper/DOI:10.1177/0959683607080516/citations?fields=title,year,venue,externalIds&limit=100` → **29 citatov Andriča 2007**. Nepoverjeni rate limit (~1 zahteva/s; search endpoint meje 429 pri hitrem zaporedju — sleep 2 med klici). Kanal razkriva, KDO citira gribeljske raziskave — točno vrsta, iz katere prihajajo novi viri (vzorec Chapman 2018 iz vala 19).

## 3. Enumeracija citatov Andrič 2007 (29)

Uteženi kandidati (Bela krajina/Slovenija): **10.3986/AGS52102** (AGS 52-1, 2012 — pokrajinska preobrazba nizkega krasa Bele krajine, PDF ojs.zrc-sazu.si/ags/article/download/1332/1095), **10.4312/DP.41.9** (Mala Triglavca — lončina, ne Bela krajina), **10.3986/ags.12798** (2024 — holocenska klima Slovenije, review), **10.1016/j.quaint.2017.08.010** (Chapman — že iz vala 19, TO_COLLECT, abstrakt brez Griblj). Abstrakti štirih: **0 × Griblj** — polna besedila AGS 2012/2024 ostajata kandidata za prihodnje vale (odprti dostop, URL-ja shranjena v surovinah).

Citacije **DP 36** (Mason & Andrič 2009): samo **3** — in med njimi **PRELOM**: `10.3986/av.71.14`.

## 4. PRELOM — Arheološki vestnik 71 (2020), str. 421–434

**Mason, Ph., Mlekuž Vrhovnik, D., Udovč, K.: Poselitev Bele krajine v prvi polovici 1. tisočletja pr. n. št. v luči novih raziskav / Settlement in Bela krajina in the first half of the 1st millennium BC in the light of new research.** DOI 10.3986/AV.71.14; odprti dostop; PDF 8,7 MB `https://ojs.zrc-sazu.si/av/article/download/8798/7947` (curl z brskalniškim UA, 200 — ZRC OJS = nov delujoč peskovniški kanal na ravni neposrednega URL-ja članka; val 27 je bil 000). `pdftotext` → 45 kB besedila.

### 4.1 NOVO DEJSTVO — Srednje njive pri Gribljih (str. ~427, n. 32)
> »Nerajski Cirnik se vzpenja nad mlajšebronastodobno naselbino na Gradinjah ter naseljem iz poznega neolitika in eneolitika na Ržišču, **Kučar pa nad poznobronastodobno naselbino Srednje njive pri Gribljah**.«32

Noga 32: **»Mason 2001, 10.«** — torej:
- prvi IMENOVANI prazgodovinski lokacijski zapis za vaško ravnino (zemljiško ime, ne samo »naselbine pri Gribljih«);
- avtoriteta = str. 10 temeljnega Masonovega članka (VS 39) — strani, ki je muzeju (polno besedilo TO_COLLECT, dLib) do zdaj ni bila znana;
- vzorec gradišče-nad-naselbino (Kučar/Srednje njive ≈ Nerajski Cirnik/Gradinje + Ržišče).

### 4.2 Bibliografske potrditve (brez številčenja virov)
- **Mason 2001, 3. neodvisna bibliografska potrditev** (poleg Andrič 2007/SAGE — 33. val — in Andrič & Karger 2024/Springer — 30. val) in **prva, ki citira konkretno stran (10)**.
- **Mason, P. 2007**: »Črnomelj – A complex late prehistoric setlement and its hinterland.« — V: Blečić, Črešnar, Hänsel, Hellmuth, Kaiser, Metzner-Nebelsick (ur.), **Scripta praehistorica in honorem Biba Teržan, Situla 44, 357–368** — nov predmet Masonovega opusa; TO_COLLECT (polno besedilo).
- **Mason, P. 2008a**: »Bela krajina v prazgodovini in rimskem obdobju / Die Region Bela krajina in der Urgeschichte und in der Römerzeit.« — V: J. Weiss (ur.), **Črnomaljski zbornik, 17–47, Črnomelj** — povezava z že prisotnim Weiss zbornikom; TO_COLLECT.
- Oba zapisana v opombi novega vira (ne kot ločena vira) — bibliografsko bogatenje brez širjenja števca.

## 5. VGRADNJA (add-only, rep-strict)

- **NOV ZAPIS MVG-113 `srednje-njive`** (kraj, DOCUMENTED): naslov »Srednje njive pri Gribljih — imenovana poznobronastodobna naselbina na vaški ravnini«; zgodba SL/EN 4 odstavki (~600 besed) z verigo dokazov, pošteno ločeno od EŠD 10094/MVG-083 (povezava ni dokumentirana — razreši kustodos) in od jedra G3; datacija naselbine ni navedena (konvencionalni okvir 13.–9. st. pr. n. št. zapisan v periodi + v zgodbi pošteno); »Muzej išče«: polno besedilo str. 10, domačinska potrditev toponima, razrešitev relacije do registra; yearFrom -1200/yearTo -800 (konvencionalni okvir); brez slike (ni avtentične).
- **+2 vrstici virov (565→567):** `av71-2020-poselitev` (DOI URL 10.3986/AV.71.14 = +1 identiteta 447→448; opomba: polno besedilo prebrano 34. val, navedba + n. 32, 3. bibliografska potrditev, PDF URL) + `mason-2001-vs39` **deljen** (isti nameSi → ista identiteta; deljenih 65→66) z opombo str. 10.
- **+3 biografske faze (372→375; biografij 93→94):** nastanek (pozna bronasta doba, sortYear -1000), zivljenje (2001 — Mason VS 39, str. 10), danes (2020 — AV 71 navedba po imenu).
- **+1 postaja sprehoda:** `srednje-njive` v `voda-je-zivljenje` (postaja 3/13, takoj za arheološkim najdiščem); pokritost sprehodov 113/113, 0 podvojenih.
- **i18n:** 25 nizov števcev × 5 jezikov 112→113 (SL »sto trinajst« implicitno v številki, EN »One hundred and thirteen«, HR »Sto trinaest«, DE »Hundertdreizehn«, IT »Cento tredici«); ključev ostaja 946 × 5.

## 6. Regresija (živi :3000 po reseed)

- tsc **0** · lint **čist** · verify-i18n **946 × 5**
- audit-entities **✓ 0 napak** (113/113 zapisov, **567** vrstic virov, **448** identitet, **66** deljenih, **375** faz; 95 entitet, 36 oseb; pokritost zapisov: MVG-113 brez entitet — z 31. drugim)
- audit-timeline-map **39 ✓ / 0** · audit-iiif **5 ✓ / 0** (**375 faz; 94+19**)
- test-entities **100 ✓ / 0** (T9.1 113/113 strani, T9.2 113/113 manifestov, T9.3 OpenData 113/567, T9.8 sitemap **114**)
- test-timeline-map **72 ✓ / 0** (T7.8 walkCover **113**; T7.9 withTime **100**, withCoords 36)
- test-ai-curator **214 ✓ / 0** · red-team **157 ✓ / 0** · test-plan-visit **42 ✓ / 0**
- audit-numbers: informativne oznake (51 zapisov — znane historične oznake; `srednje-njive` yearFrom -1200 = isti dovoljeni vzorec kot `arheolosko-najdigsce-ob-kolpi` -4500)
- **OpenData 113/567 živo · sitemap 114**
- **agent-browser:** /exponat/srednje-njive 200 — naslov/MVG-113/DOKUMENTIRANO, zgodba (Srednje njive, Mason 2001, 10, poznobronastodobno naselbino), VIRI z Arheološkim vestnikom 71 + DOI v HTML, faze 2001/2020, »Muzej išče« ✓; EN (?lang=en) »Late Bronze Age settlement« + »The museum seeks« ✓; domača stran: števec 113 (EN nizi + »MVG-113«), edini »112« = muzejska številka MVG-112 ✓; konzola čista; noga footBottom = pageH (16.269 px, vrzel 0 — prvi izmer je bil sredi hidracije); preliv 0 pri 390 px (clientW 390, scrollW 390)

## 7. Ničelni izmeri

- **OpenAlex** — 429 deljeni IP (lastni ključ = registracija zunaj peskovnika)
- AGS 2012/2024, DP 41.9, Chapman 2017 — abstrakti brez omembe Griblj (polna besedila AGS ostajajo kandidati: odprta dostopna PDF-ja shranjena)
- S2 search endpoint `?query=Griblje` — 429 (rate limit); citacijski endpointi delujejo

## 8. Izven-peskovniška vrsta (posodobljena)

**Semantic Scholar citacijska enumeracija (NOVO)** → OpenAlex z lastnim ključem → ARSO letna serija → vinogradniška diploma (RUL gID) → Kataster jam → Belokranjec PDF (3. poraz) → Poganjec → Lojze↔Alojz → Kamra pričevanje → SI AS 176 → gostilna pred 1898 → vrzel #3 (360° panorame) → Mason 2001 (session-prenos dLib — zdaj tudi **str. 10 = Srednje njive**) → Andrič 2007 polno besedilo → AGS 2012/2024 polno besedilo (kandidata za omembe)

## 9. Surovine

`research-griblje/raw-web-val34-2026-10/`: s01-openalex-griblje.json (429 dokaz), s02-s2-andric2007-cites.json (29 citatov), s03-s2-paper-*.json ×4 (abstrakti), s04-s2-search-griblje.json (429 dokaz), s05-s2-dp36-cites.json (3 citati), s06-s2-av71.json, av71.pdf (8,7 MB) + av71.txt (45 kB izluščeno besedilo).

**Stanje po valu 34: 113 zapisov (MVG-001–113), 567 virov, 448 identitet, 66 deljenih, 95 entitet; sitemap 114; i18n 946 × 5; 13 API poti.**
