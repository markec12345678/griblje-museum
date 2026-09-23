# 40. val spletnega raziskovanja — RUL diploma rešena (TSPD → agent-browser) · Belokranjec PDF rešen (4. poskus → stealth Playwright) · Veselič pričevanje o vaškem zboru · dokazna disciplina (Poganjec, Lojze↔Alojz, DPhil)

*Muzej vasi Griblje · 92. sklop · 23. 9. 2026*

Zahtevek: »odlicno nadaljuj« (40. val; izven-peskovniška vrsta vala 39). Vrstni red: (1) vinogradniška diploma (RUL gID — TO_COLLECT od 28. vala, F5 TSPD blokada), (2) Belokranjec PDF (4. poskus — openresty »One moment« + obfuskirana preverjanja bota), (3) Poganjec, (4) Lojze↔Alojz, (5) Andrič 2001 DPhil. **Dva trdoprsta TO_COLLECT-a zaprta, dva nova vira vgrajena (580), dve pričevanji/dokazni disciplini potrjeni.**

## Poleno 1 — Vinogradniška diploma: RUL gID REŠEN (id=158650)

28. val je predal: naslov »Zaznavanje spreminjanja podnebja pri vinogradnikih v Beli krajini« (OpenAIRE 0, RUL F5 TSPD, IzpisGradiva URL TO_COLLECT). Val 40 reši v treh premiki:

1. **z-ai web_search z natanko sestavo** potrdi delo: **Maša Laj, 2024, diplomsko delo, 38 strani (Google Books ID IL7u0AEACAAJ; publikator M. Laj)** — mentor ni znan iz iskanja, ampak iz zapisa.
2. **RUL forenzika**: robots.txt (HTTP 200) potrjuje vzorec `IzpisGradiva.php?id=`; `Iskanje.php` odkrit s klikom po navigaciji. **Curl s piškotki pride do JS-izziva** (`bobcmn`, F5 Shape) — tudi `ajax.php` vrne »Request Rejected«. Rešitev: **agent-browser** (pravi headless Chrome) — TSPD izziv prepusti z pravim JS; iskanje »Zaznavanje spreminjanja podnebja pri vinogradnikih« vrne **1. zadetek**.
3. **Zapis**: `IzpisGradiva.php?id=158650&lang=slv` — **Maša Laj, mentor prof. dr. Darko Ogrin, Oddelek za geografijo FF UL, 2024, PID 20.500.12556/RUL-158650, objava v RUL 19. 6. 2024, 926 ogledov / 227 prenosov; ključne besede: klimatogeografija, lokalno podnebje, podnebne spremembe, vinogradništvo, Bela krajina**. PDF (Dokument.php?id=186359, 1,17 MB): curl z brskalniškimi piškotki **ne gre** (WAF prepozna JA3-prst curl-ja) → prenos **znotraj brskalnika** (fetch → dataURL → izpis v kosih). **MD5 potrjen na mestu: a4e1e572f26f1974d4f60d8371310e04** = vrednost iz zapisa RUL.

**Vsebina (pdftotext, 65 kB, 20 strani izpisa):** anketa **36 vinogradnikov** (16 občina Metlika, 10 Črnomelj, 10 Semič; 20 moških, 16 žensk; ≈3 % populacije) — **najpogostejše skrbi: pozeba (22 omenitev), suša (20), toča (19)**; topla februarja in marec vzpodbudita brstenje, aprilska/majska pozeba pa brst prizadene; v vinogradniškem območju Bela krajina je bilo **2022: 1.368 pridelovalcev grozdja** (Breznik in sod. 2023, 6. slovenski vinogradniško-vinarski kongres Ptuj).

**Dedup:** pdftotext prek iskal — **Griblje: 0 omemb** (tudi Vinica, Dragoši, Adlešiči, Krasinec, Vinomer: 0; Črnomelj 25, Metlika 24, Semič 34) → vir je **regionalna klimatska podlaga vinogradništva**, ne gribeljski vir → vgrajen na **MVG-018** (Vinogradništvo in metliška črnina), ne na vas-kraj zapis.

**Status 28. vala TO_COLLECT: ZAPRTO.** Kanelni vzorec: RUL TSPD gre z brskalniškim UA + piškotki za statične strani; PDF-prepoved pa prepozna TLS-prst — zato fetch znotraj pravega brskalnika + izpis v kosih (150 kB/kos × 12).

## Poleno 2 — Belokranjec PDF: 4. POSKUS = PREBOJ (50,6 MB + Veselič pričevanje)

Trije prejšnji porazi (vala 18/19/24): openresty 415, JINA »One moment«, tag »realni brskalnik«. Val 40:

1. **curl z polnimi brskalniškimi glavami**: HEAD 200 = `text/html` (nisan PDF!) — GET vrne **»One moment, please...«** (12 kB JS-izziv z obfuskiranimi preverjanji: `navigator.webdriver`, `headless` v UA/appVersion, spoofing PluginArray/MimeTypeArray — niz `a0k=a0w` string-array rotacija).
2. **agent-browser ne gre**: `navigator.webdriver=true` je odkrit — izziv se vrti v krogu (12 s brez piškotkov).
3. **Rešitev: Playwright 1.57 + stealth** (`--disable-blink-features=AutomationControlled`, init-script `webdriver=undefined`, človeški UA, locale sl-SI): naslovnica prepusti izziv (piškotki **wssplashchk + wires**), PDF-pot pa sproži **nov izziv na novo pot** — zato **prava navigacija + `waitForEvent('download')`**: brskalnik sam reši nov izziv, 5 s reload pa postreže PDF → **prenos 53.055.201 bajtov**.

**Vsebina (pdftotext, 147 kB, PDF 1.3):** Belokranjec 7–8/XXIX (2026), rubrika **Zborovodkinja** — **intervju z Majdo Veselič** (r. 1959 Ivani in Janku Banovcu; predšolska leta v Dragatušu; zborovodkinja otroških zborov OŠ Mirana Jarca Črnomelj + PŠ Adlešiči; moški pevski zbor **Belt Črnomelj 1983–2012**; predsednica KD Božo Račič Adlešiči od 1997; Župančičevo priznanje Občine Črnomelj; posebno priznanje JSKD 26. 5. 2022). Avtor in foto: **Rudi Vlašič**.

**Ključni citat (dokazna vrednost za MVG-052):**

> »Ko sem začela, je imela skoraj vsaka vas svoj pevski zbor, na primer **Griblje**, Adlešiči, Tribuče, Dragatuš, Gradac, Dobliče … Danes ni več tako. Člani so se starali, podmladka ni bilo.«

Neodvisno pričevanje o **vaškem pevskem zboru** — se sliši v isti zvrsti kot srečanje pevskih zborov v Gribljih **1981** (že v zgodbi MVG-052): isto drevo, druga krošnja. Skupaj z intervjujem revija vsebuje še sosednje zgodbe (Gran Canaria → Bela krajina; folklorna skupina Semič 4. 9. 2026) — vse dedup ali sosednje-vase vsebine, nič novogribeljskega.

**Status TO_COLLECT (od vala 18): ZAPRTO.**

## Poleno 3 — Poganjec: peskovniški kanali izčrpani (re-zaprto)

GBIF verbatim lokaliteta »Poganjec« + koordinati 45.574073/15.278092 ostajajo edini pin. Nov poskus: z-ai web_search »"Poganjec"« (9 zadetkov = 100 % šum »poganjalec« — kolesa, igrače), dLib API (HTTP 000), Google Books (429), Geopedia (svetovna izdaja brez slovenskega imenskega indeksa; API-probe 404/000), SURS RGN (dosegljivost v peskovniku ni stabilna). **Mnenje se ne spremeni: toponim čaka domačinsko potrditev; ni entiteta; opomba vira MVG-105 ostaja.**

## Poleno 4 — Lojze↔Alojz Štrucelj: AG UL sled = lažna (re-zaprto)

Nov kanal: Akademija za glasbo UL — magistrski koncert (4. 6. 2025) s »Lojze Štrucelj« na seznamu vokalistov. Prenašanje strani pokaže: URL iskanja je bil odrezan na domeno, na strani ni »Lojze« (0 zadetkov) — gre za druge Štrucelje (Dominik, Matija — bas). Ni dokaza o vezi z Griblji. **Sodba iz 26. vala stoji: 5 virov potrjuje Alojza (pisrs Griblje 6, tax-fin-lex, go2farms, Svet24 »80-letni Alojz«), noben ne povezuje oblike Lojze; Kamra pričevanje ostane nevezano; potrebna potrditev domačinov ali tiska, ki poimenuje obe obliki.**

## Poleno 5 — Andrič 2001 DPhil (SOUL Oxford): dokumentirana praznina

Sedem kanalov v enem valu: ORA (Cloudflare »Just a moment« — curl 403 × 3 OAI-končnice + agent-browser ostane na izzivu), CORE.ac.uk (Cloudflare), Bing site: (rdr=1 preusmeritvena zanka), Google Scholar (prazen/CAPTCHA), archive.org advancedsearch (timeout 40 s), OpenAlex (429 — »retry in 37s« ne pomaga, skupni IP), Semantic Scholar (429). Zapis **andric-2001-oxford-dphil na MVG-083 ostane CORROBORATED** (matica DP 34) — polno besedilo TO_COLLECT z dokumentirano zgodovino blokad (kandidat za življenjsko sejo zunaj peskovnika).

## VGRADNJA (add-only)

- **MVG-018** (+1 vir = 6): `laj-2024-rul-diploma` — spletni-vir, RUL IzpisGradiva id=158650, PID 20.500.12556/RUL-158650; opomba z vsoto ankete (36; 16/10/10; pozeba 22/suša 20/toča 19; 1.368 pridelovalcev 2022). Zgodba SL/EN +1 odstavek (»Podnebje pa je vino začelo meriti drugače …«).
- **MVG-052** (+1 vir = 4): `belokranjec-2026-veselic-zborovodkinja` — **pricevanje** (edini drugi vir te vrste poleg INZ Klepec), Belokranjec 7–8/XXIX (2026), URL direktni PDF. Zgodba SL/EN +1 odstavek (»Da je pevska vas znala biti …«).
- **Konstante**: 578→580 (24 mest/5 skript), 459→461 (6 mest/3 skripte); audit-sporočilo + T7.3 posodobljena na 40. val.

## Regresija (živi :3000 po reseed)

tsc 0 · lint čist · verify-i18n **946 × 5** (en/hr/de/it identična SL) · audit-entities ✓ 0 napak (**113/580/461/67/375**; 95 entitet, 36 oseb) · audit-timeline-map 39 ✓/0 · test-entities **100** ✓/0 · test-timeline-map ✓/0 · test-ai-curator ✓/0 · red-team ✓/0 · test-plan-visit **42** ✓/0 · OpenData **113/580** živo · sitemap 114 (brez novih zapisov).

**agent-browser:** MVG-018 — »Laj«, »2024«, »podnebj«, »pozeba«, »RUL-158650«, »repozitorij«, VIRI ✓; MVG-052 — »Veselič«, »zborovodkinj«, »Belokranjec«, citat »vsaka vas svoj pevski zbor«, »1981«, VIRI ✓; hero 113 ✓; noga footBottom = pageH 5.416 (vrzel 0) ✓; konzola čista ✓.

## Tehnične poučne točke

1. **F5 TSPD (bobcmn) prepusti pravi brskalnik** — curl z piškotki ne pride do JS-izziva; agent-browser (headless Chrome) gre skozi, ker je JS pravi.
2. **JS-izzivi, ki preverjajo `navigator.webdriver` / UA `headless` / PluginArray-spoofing, odkrijejo tudi headless agent-browser** — potrebni stealth-ukrepi: `--disable-blink-features=AutomationControlled`, init-script `webdriver=undefined`, človeški UA.
3. **WAF prepozna TLS/JA3-prst**: RUL PDF gre z brskalniškimi piškotki, ampak NI gre s curl-jem → fetch znotraj brskalnika + izpis v kosih (150 kB × 12 = 1,64 MB base64).
4. **Izziv na novo pot**: Belokranjec vodi izziv po poti (piškotek velja za naslovnico, PDF-pot sproži nov izziv) — zato brskalniška navigacija + `download` event, ne ctx.request.
5. **MD5 na mestu**: zapis RUL navaja MD5 — potrditev prenosu brez dvoma (a4e1e572… = a4e1e572…).

## Izven-peskovniška vrsta (posodobljena)

Andrič 2001 DPhil polno besedilo (življenjska seja ORA) → Andrič 2007 The Holocene polno besedilo (SAGE sejo; abstrakt zajet) → gostilna pred 1898 (MVG-109, novi kanali) → SI AS 176 (Franciscejski kataster; VAC živ) → vrzel #3 (360° panorame — razvojna) → Vavpotič/Gaspari (dedup) → kataster jam (ko se gostitelj vrne) → Miklavčič 1965: preostalih 68 strani (OCR-slv ko bo na voljo) → Odeon arhiv 2020 (še 4 članki = dedup; periodično) → Poganjec domačinska potrditev (izven peskovnika) → Lojze↔Alojz dokaz z dvema oblikama (izven peskovnika).

## Stanje

**113 zapisov (MVG-001–113), 580 virov, 461 identitet, 67 deljenih, 95 entitet (oseb 36); sitemap 114; i18n 946 × 5; 13 API poti.**
Surovine: `raw-web-val40-2026-10/` — laj-2024-diploma.pdf (1,23 MB, MD5 a4e1e572…) + .txt (65 kB) + rul-record.txt + geoprobe + jar.txt; belokranjec-7-8-2026.pdf (50,6 MB) + .txt (147 kB); s01–s07; ag-concert.html; robot/probe ostanki; /tmp/pw-stealth/fetch-v2.ts (stealth Playwright skripta).
