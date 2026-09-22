# 31. val raziskave — Vaš kanal arhiv, stran 2 (2008–2011): zaključek popisa arhiva, trije novi viri, dve obogatitvi zgodb
*81. sklop · 22. 9. 2026*

## Kontekst

Zahtevek: »odlicno se raziskuj nadaljuj« (nadaljevanje 30. vala). Val 31 je nastal ob vzporednem odkritju: **arhivska iskalna stran Vašega kanala (Joomla) je v valu 21 prebrala samo stran 1 (20 zadetkov), iskalnik pa javlja »Najdeno 28 rezultatov«** — osem zadetkov na strani 2 (obdobje 2008–2011) je ostalo neobdelanih. Val 31 je torej **zaključek popisa arhiva Vašega kanala**: stran 2 prebrana, vsakih 8 člankov razvrščenih, dedup ob živi bazi (112 zapisov) opravljen.

## METODA

- `arhiv.vaskanal.com/index.php?option=com_search&searchword=griblje&ordering=newest&searchphrase=all&limitstart=20` prek JINA (3.458 bajtov, 8 zadetkov z datumi — vsi delavsko usklajeni: Torek 13. 9. 2011 ✓, Torek 21. 6. 2011 ✓, Torek 14. 9. 2010 ✓ ×2, Torek 22. 9. 2009 ✓, Četrtek 23. 7. 2009 ✓, Sobota 28. 2. 2009 ✓, Četrtek 7. 8. 2008 ✓).
- Polna besedila treh ključnih člankov prek JINA na komponentni poti (`component/content/article/93-starejse-novice/<id>-<slug>.html`): 14380, 9445, 10913 — vsi ~4 kB.
- Tehnične epizode: JINA ostaja nestabilen (200/401 izmenično; deluje po zamikih ~75–90 s); WP REST `search=kanalizacija` ne ujame sklanjane oblike »kanalizacijo« (LIKE %kanalizacija%) in `before=2018` vrne prazno množico; slug-lookup `?slug=namenu-predali-kanalizacijo` = prazno (napačen slug — članek je na stari Joomla arhivski poti 26203, že pokrit v valu 21).
- Vzporedno so v tej seji nevede ponovno pridobljeni tudi znani materiali vala 21 (WP REST 9 postov, članek 26203, iskanje »Gribljah« = 2 znana posta) — vsi 100 % dedup; surovine shranjene v `raw-web-val21-2026-10/` kot ponovitveni merilec.

## STRAN 2 — OSEM ČLANKOV, RAZVRŠČENI IN DEDUPRANI

| # | Datum | Članek | Razsodba |
|---|---|---|---|
| 1 | 13. 9. 2011 | Belokranjska orača uspešna | **NOV VIR MVG-022** (55. državno tekmovanje, Ptuj — Anton IN Jure Filak; Vimeo 29004980) |
| 2 | 21. 6. 2011 | Protestno pismo županj | obrobno (belokranjski županje; kontekst ne citiren) |
| 3 | 14. 9. 2010 | Najboljša orača (2× ista objava, dve kategoriji) | koroboracija 2010 naslova (žr. svet24-filak-2010); Vimeo 14968573; **TO_COLLECT kot ločen vir** (ni vgrajen — val 31 omejen na 3 vire) |
| 4 | 22. 9. 2009 | Častitljiva obletnica še vedno delujoče šole | **NOV VIR MVG-026** (120 let šole; ~100 učencev ob gradnji, 15 leta 2009 v kombiniranem oddelku 1.–5.) |
| 5 | 23. 7. 2009 | V katerih rekah se ni dobro kopati? | obrobno (Kolpa primerna za kopanje — znanstvena analiza ZZV NM; glej MVG-053 kopališče) |
| 6 | 28. 2. 2009 | Obnovljena šola v Gribljah | **NOV VIR MVG-026** (»v celoti obnovljena«, uradno razveselje konec tedna) |
| 7 | 7. 8. 2008 | Volilni okraji | obrobno (Griblje v volilnem okraju — kontekst MVG-031 občina) |

Z arhivsko stranjo 1 (20 člankov) + stranjo 2 (8) + WP REST (9) je **popis Vašega kanala zaključen: 37 enkratnih člankov, vseh razvrščenih**.

## TRIJE NOVI VIRI

### MVG-022 (anton-filak) + vk-oraca-2011
- »Belokranjska orača **Anton in Jure Filak** iz Gribelj sta konec minulega tedna na **55. državnem tekmovanju oračev Slovenije na Ptuju** dosegla vrhunski uspeh« (TV-poročilo 13. 9. 2011; **Vimeo 29004980**).
- Pomen: prvi vir, ki ga ujame **oba Filaka skupaj na državnem odru** — zgodba zapisa je o »družinski znanosti«, ta vir jo natančno dokumentira (oče Anton, sin Jure); sinhronizirano z že znano 58. svetovnim prvenstvom na Švedskem (maj 2011, spremljevalec sin Jure) in regijskim prvenstvom 2012 (najboljši Jure).
- Poštenost: **točna uvrstitev ostaja TO_COLLECT** (»vrhunski uspeh«, ne uvrstitev) — v opombi vira izrecno.
- Zgodba SL/EN obogatena z enim stavkom (med 65. tekmovanjem 2022 in 2025).

### MVG-026 (vaska-sola) + vk-obnovljena-sola-2009
- »**120 let stara šola v Gribljah je v celoti obnovljena**. Prebivalci te črnomaljske občine so se pridobitve ta konec tedna tudi uradno razveselili« (TV-poročilo 28. 2. 2009).
- Pomen: **prvi dokazani datum celotne obnove šolskega poslopja** — februar 2009; zgodba je doslej poznala samo gradnjo 1885–1889, vojno 1942 in sedanjo ureditev.

### MVG-026 (vaska-sola) + vk-120-let-sola-2009
- »Letos mineva **120 let** odkar so v Gribljah v Beli krajini zgradili šolo, v kateri pouk poteka še danes. Takrat jo je obiskovalo **okrog sto učencev**, danes le še **petnajst** in to v kombiniranem oddelku od prvega do petega razreda« (TV-poročilo 22. 9. 2009).
- Pomen: **zgodovinsko merilo šolanja v vasi** — ~100 učencev ob gradnji (1889), 15 leta 2009, 21 v šolskem letu 2023/24 (os-loka-griblje-danes), 17 v 2025/26 (Dolenjski list): serija, ki pokaže lom 20./21. stoletja; datum 120-letnice (2009) usklajen z gradnjo 1889 (RTV 2013).
- Zgodba SL/EN obogatena z odstavkom (pred odstavkom o muzejski učilnici).

## DEDUP IN NIČELNI IZMERI (stran 2)

1. **Protestno pismo županj** (21. 6. 2011) — županje občin Bela krajina; članek ne prinaša gribeljsko-specifične vsebine (odrezek se konča pri »sestavile na rednem delovnem sestanku«). Obrobno — ne vgrajeno.
2. **Najboljša orača 2010** (14. 9. 2010, 2×) — naslov potrjuje 54. državno tekmovanje v Vipavi (25 oračev); vsebina pokrita s svet24-filak-2010; dvojna objava v dveh kategorijah arhiva (6939 + 488) = ena identiteta vsebine. Vir **TO_COLLECT** (ni vgrajen v tem valu).
3. **V katerih rekah se ni dobro kopati?** (23. 7. 2009) — analiza Zavoda za zdravstveno varstvo Novo mesto: Kolpa, Krka in Mirna primerne; Temenica in Lahinja ne. Pomen za MVG-053 (kopališče) kot kontekst kakovosti vode — obrobno, ne vgrajeno (merila vasi so poletna priljubljenost, ne bakteriologija).
4. **Volilni okraji** (7. 8. 2008) — Griblje med krajevnimi skupnostmi volilnega okraja; kontekst MVG-031. Obrobno.
5. **Dedup 100 % za znane članke:** ponovni prevzem WP REST (9 postov), kanalizacija 26203, »Gribljah« iskanje (2 posta) — vsi že v bazi (MVG-097, MVG-106–108 …).

## VGRADNJA (atomarna, rep-strict)

- **+3 vrstice virov** (561 → **564**): vk-oraca-2011 (MVG-022), vk-obnovljena-sola-2009 (MVG-026), vk-120-let-sola-2009 (MVG-026); **+3 identiteti** (443 → **446** — trije novi arhivski URL-ji), deljenih ostaja 65.
- **2 obogatitvi zgodbe** SL+EN (anton-filak: +1 stavek; vaska-sola: +1 odstavek).
- Konstante v 5 skriptah: test-entities (T8.6 446, T8.11 564, T9.3/T9.4 564), audit-entities (564/446 + sporočila „31. val“), audit-timeline-map (564), test-timeline-map (T7.2 564, T7.3 446, T8.3/T8.4 564), test-curator-red-team (R0.3, R16.2 564).
- Zapisi (112), sitemap (113), i18n (946 × 5), hero števci — nespremenjeni.

## REGRESIJA (živi :3000 po reseed)

tsc 0 · lint čist · verify-i18n 946×5 · audit-entities ✓ 0 napak (**112/564/446/65/372**; 95 entitet, 36 oseb; pokritost 82/112) · audit-timeline-map 39 ✓/0 · audit-iiif 5 ✓/0 (372 faz; 93 + 19) · test-entities 100 ✓/0 · test-timeline-map 72 ✓/0 · test-ai-curator 214 ✓/0 · red-team 157 ✓/0 (GAP 24) · test-plan-visit 42 ✓/0 · audit-numbers: vaska-sola oznaka **že obstajala pred vgradnjo** (primerjava HEAD ↔ delovno drevo), anton-filak neoznačena · reseed → OpenData **112/564** živo · sitemap 113 · živi strani: anton-filak izrisuje „55. državno tekmovanje oračev Slovenije na Ptuju“ + vir 14380, vaska-sola izrisuje „v celoti obnovljena“ ✓.

## Stanje po 31. valu

**112 zapisov (MVG-001–112), 564 virov, 446 identitet, 65 deljenih, 95 entitet (oseb 36); sitemap 113; i18n 946 × 5; 13 API poti.**

Surovine: `raw-web-val31-2026-10/` (jina-arhiv-search-p2.md — stran 2, jina-14380.md, jina-9445.md, jina-10913.md); ponovitveni prevzem vala 21 v `raw-web-val21-2026-10/` (jina-vaskanal-gribljah.md, jina-vaskanal-kanalizacija.md, jina-vaskanal-kanal2017*.md, jina-vaskanal-slug-kanal.md, wp-gribljah-direct.json).

## Izven-peskovniška vrsta (posodobljena)

Mason 2001 polno besedilo (dLib 7×; bibliografija trajno potrjena) → vinogradniška diploma (RUL gID) → Andrič 2007 kopije → OpenAlex z lastnim ključem → Kataster jam → Belokranjec PDF → Poganjec → Lojze↔Alojz → Kamra pričevanje → ARSO letna serija → SI AS 176 → gostilna pred 1898 → vrzel #3 (360° panorame) → **vk-najboljsa-oraca-2010 (54. tekmovanje, Vipava — koroboracija, Vimeo 14968573)**
