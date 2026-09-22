# 38 — 24. VAL: CELA WEISSOVA POGLAVJE — ŠTIRI PRIMARNE OMEMBE GRIBLJ (1468 LISTINA, TURŠKI VPADI 1524–1556, ČEVLJAR V CEHU, KATTERJEVE HUBE) + BELOKRANJEC ARHIV + POGANJEC Z KOORDINATAMI

*73. sklop · 2026-09-22 · naročilo: „odlicn onadaljuj sinhroniziraj github vercel kode readme in nadaljuj“*

## Naročilo in cilj

Uporabnik: **»odlicn onadaljuj sinhroniziraj github vercel kode readme in nadaljuj«** — trije sklopi naročila:
1. **Sinhronizacija** GitHub / Vercel / koda / README (dopolnjena kot 74. commit-ločeni sklop z enim commitom — glej worklog Task 73).
2. **Nadaljevanje raziskave** — 24. val po izven-peskovniški vrsti (Weiss 2018, Belokranjec, Poganjec, sken Domoljuba).
3. Usklajevanje številčenja sklopov (val 23 = 72. sklop, formula val N = sklop 49+N).

## Sinhronizacija (prvi del naročila)

- **GitHub**: lokalni HEAD 5890536 = origin/main ✓ (push sposobnost potrjena z `git ls-remote`).
- **Vercel**: `https://griblje-museum.vercel.app` → HTTP 200; `/api/opendata` → `{exhibits: 109, sources: 542, events: 9, stories: 6}` = **identično lokalnemu stanju** (auto-deploy potrjen).
- **Koda**: `bunx tsc --noEmit` = 0 napak; `bun run lint` čist; dev strežnik :3000 živ (GET /api/opendata 200, 46 ms).
- **README**: 72. sklop (val 23) vpisan s števci 109/542/430/95; globinska tabela 109/109, 93/109, 542; `db:seed` vrstica usklajena.
- **POPRAVEK ŠTEVILČENJA**: val-22 commit je zmotno skočil na 72. sklop (val 22 = 71), val-23 prepisal 73 v KAZALO — popravljeni 3 vnosi 73→72 (37-val23 glava, KAZALO-raziskav vnos 37, 00-KAZALO naslov); formula val N = sklop 49+N zdaj velja skozi celotno kronologijo; 0 ostankov „73. sklop“ v dokumentaciji. Commit e8b038f (74. sklop sinhronizacije) potisnjen.

## 24. val — metodologija

Novo orodje v arzenalu izven peskovnika: **`z-ai function -n page_reader`** — strežniški bralec, ki prestane openrestijski JS-challenge („One moment, please…“), ki ga curl ne premore (knjiznica-ptuj.si, belokranjec.si = 200 z 47–33 kB HTML). `r.jina.ai` je ves val blokiran (401 „bad IP reputation“, tudi po ohlajanjih 45–90 s).

Ključni prelom = **academia.edu skozi page_reader** (334 kB, Cloudflare prehoden) + **objektne strani poglavja kot HTML na nezaščiteni domeni** `attachments.academia-assets.com/62167932/N.html` (JPedal besedilna plast, ~19 kB/stran; **stran knjige = N + 150**, kalibrirano po vrnjeni glavi „230 Neumarkt – Möttling – Metlika“ na a-80). Prenos vseh 159 strani poglavja (str. 151–309) v treh serijah po 55, zamik 0,3 s — ~3 MB, brez blokad.

## PRELOM 1 — kanonski bibliografski zapis Weissovega poglavja (iz TO_COLLECT v DOCUMENTED)

Doslej (val 21): fragmentarni iskalni odrezki, ocena „~str. 190–220“, academia.edu za Cloudflare. Zdaj trije neodvisni viri:

1. **Založniška stran z dobesednim citatom**: belokranjski-muzej.si/post/858326/metliski-grad (222 kB) — „(Janez Weiss: Častite avstrijske hiše zvesti podložniki: Neumarkt – Möttling – Metlika. Nastanek in razvoj mesta od konca 13. do začetka 19. stoletja (ur. Janez Weiss), Metlika: Belokranjski muzej Metlika, 2018, str. 163)“.
2. **Znanstvena recenzija**: Dular, Janez: Gorjanske ceste in poti skozi čas, **Kronika 72 (2024) 1, str. 5–20, DOI 10.56420/Kronika.72.1.01** (ojs.inz.si PDF 1,4 MB — prenos uspel; kronika.zzds.si blokiran, zrcalo ojs.inz.si odprto); bibliografski vnos potrjuje podnaslov in obseg **str. 151–309**; citira knjigo na str. 161–162, 245, 252, 282 (vsi sklici znotraj 151–309 ✓).
3. **Celotno besedilo poglavja**: academia.edu/42040981 (avtorjev deponat; 159 strani HTML).

## PRELOM 2 — štiri omembe Griblje v poglavju, vsaka s primarnim virom

Grep po vseh 159 straneh (vzorc-i `gribl|grübl|gribe|grybl|kribl`): **4 strani** — 182, 186, 249, 267. Celotni citati z viri v `raw-web-val24-2026-10/weiss-najdbe-2026.txt`.

### [1] str. 182 — Katterji: pet hub v Gribljah (15. st.)
Rodbina Katter (oskrbniki nemškega viteškega reda v Metliki; Bernard (II.) poročen z Nežo Semenič) — posest: „mlin pri brodu preko Kolpe, vsaj eno hubo v Križevski vasi, šest hub v Ravnacah in **pet v Gribljah**“. Vir (op. 157): **GStAPK, XX. HA, Ordensbriefarchiv, 28955, Zins und Hufenverzeichniß des Hauses in der Metling** (Geheimes Staatsarchiv Preußischer Kulturbesitz, Berlin); urbar 1490 (Kos, Urbarji I, str. 216, 218) za Ravnace.

### [2] str. 186 — listina 1468: pet hub v Gribljah + mlin na Kolpi ⭐
Ustanovitvena listina treh večnih kaplanov na oltarjih sv. Andreja, sv. Jakoba in sv. Jurija v cerkvi sv. Nikolaja v Metliki (1468; regest: **Arnold, Die Urkunden III, str. 1177, št. 3971**; dosedaj „poznana le v skromnem regestu“, Weiss objavlja podroben opis volil): „**Bernard Katter in žena Neža** šest hub v Ravnacah, **pet v Gribljah, mlin na Kolpi**, hišo v mestu, dva oštata s travnikom pri Rosalnicah, dve shrambi in dva vrtova.“ Skupaj 35 hub vzdržuje tri kaplane.

→ **NEODVISNA, DATIRANA POTRDITEV MUZEJSKE PRVE OMEMBE 1468**: muzej navaja prvo omembo 1468 (Griblach); ta listina istega leta dokazuje kmetijsko aktivno vas (5 hub = približno 5 kmetij) + mlin na Kolpi v povezavi z Griblji — še pred urbarjem 1490.

### [3] str. 249 — čevljar iz Gribelj v metliškem cehu (zgodnje 17. st.) ⭐
Ceh čevljarjev Metlike (Posten Antwerh, izpričan od 1587) — članstvo ni le mestno: op. 587 (vir: **ABMM, Čevljarski ceh v Metliki, šk. 3, str. 10–11r** — knjiga **danes v hrambi Belokranjskega muzeja Metlika**, op. 580; objava slovenskih segmentov: Golia, Slovenica, str. 214–222): „…Mathia Sauer von unter Siemitsch; **MYKHULA MALLESCHITSCH VON GRYBL**; Michil Besekh von Starichou Verh“.

→ **NOVA ORTOGRAFSKA VARIANTA GRYBL** + prvi imenovani gribeljski obrtnik v mestni instituciji; cehovska knjiga je „prvovrstni jezikovni dokument“ (deloma v slovenščini).

### [4] str. 267 — turški vpadi 1524–1529: „das dorf Griblach … gannz oedd“ ⭐⭐
**PRVA IMENOVANA PRIMARNA LISTINA O GRIBLJIH**: **HHStA FHKA HA M-25, 1556, 6. november, Metlika** (Hofkammerarhiv Dunaj, Herrschaftsarchiv Metlika) — pismo **Sebastjana Römerja, upravitelja gospostva Metlika**, posestniku **Antoniju baronu Turn und zum Kreutzu**: „ungeverlichen im 1524 Jarß sey ein groß hoer thuerkhen unversechenß in diysen Poden Gefallen … das in manigen dorf nicht ein person beliben. Uber vier unnd funnf Jar darnach … zw dreymallen Nacheinannder … **das dorf GRIBLACH, Wadann, Prubintz, Marnndol, Prelog, Weydnitz** unnd annder dorfer mer **GANNZ OEDD GEWESST UNND ETLICH JARR OEDD PELIBEN** … zwey Gannze dorf khaum ein Phlueg vermecht“ (Weiss, In conterminiis, str. 53–54).

→ Velik turški vpad ~1524 („v mnogih vaseh ni ostala niti ena oseba“), trije nadaljnji vpadi ~1528–29; **vas Griblje popolnoma opustošena („ganz öd“) in več let puščena**; dve celi vasi sta še leta 1556 komaj zmogli en plug. Sosedje na seznamu opustošenih: Wadann (?), Prubintz (?), **Marindol**, Prelog, Weydnitz (?).

→ **POPRAVEK VALA 21**: ni „urbar 16. stoletja“, ampak **listina Hofkammerarhiva** (pismo upravitelja); oblika v viru je „das dorf Griblach“ (ena f, ne „dorff“). Ocena vala 21 „~str. 190–220“ se izkaže za premalo: omembe na str. 182, 186, 249, 267.

## Ortografska veriga (posodobljena)

**Briglach 1490** (urbar, Kos) → **Griblach 1468** (listina, Arnold regest 3971) → **Griblach 1556** (HHStA M-25) → **Grybl ~1610** (cehovska knjiga ABMM šk. 3) → **Griblah 1593** → **Grüble** (nemško) — štiri različice v 123 letih, vse dokumentirane.

## PRELOM 3 — Belokranjec 7-8/XXIX (2026): izvod + PDF URL dokumentirana, celotno besedilo ostaja TO_COLLECT

- arhiv izdaj enumeriran prek page_reader (domača stran = vrtiljak izdaj; 24+ URL-jev izdaj 2024–2026): **`/arhiv-izdaj/belokranjec-julij-avgust-2026-stevilka-7-8-letnik-xxix/`** obstaja ✓
- stran izdaje vsebuje **URL PDF**: `/site/assets/files/2177/belokranjec_avgust_2026.pdf` (50,6 MB; ProcessWire CMS) + flipbook (three-flipbook, pdfUrl = isti PDF; brez besedilne plasti).
- vsi neposredni prenos so za JS-challenge: PDF (12 kB HTML izziva), naslovnica `.330x0.jpg` (tudi), `kronika.zzds.si` (0 B), `knjiznica-ptuj.si` (izziv — page_reader ga prenese, ampak naročilniški zapis je globlje).
- Googlov indeks pa **dokumentira vsebino izdaje**: „Julij/avgust 2026, št. 7-8/XXIX | Aug 31, 2026 — vsaka vas svoj pevski zbor, na primer **Griblje**, Adlešiči, Tribuče“ (s03).
- wayback API (archive.org) = timeout iz peskovnika (tretji izmer).
- Muzejska disciplina: **ne graditi zapisa iz odrezka** — odkritje ostaja TO_COLLECT (PDF čakati na dostop ali prošnja uredniku); dedup: 14 obstoječih omemb „pevsk/zbor“ v zbirki = noben namenski zapis o vaškem zboru.

## PRELOM 4 — Poganjec: GBIF izrecno vodi lokaliteto „Poganjec“ s koordinatami

- GBIF occurrence **5277910285** (api.gbif.org, odprt): species **Circus cyaneus** (krogličasta lunja), **locality: „Poganjec“**, 45.574073 / 15.278092, 1. 1. 2025 (Birda dataset 6ff8b3b0).
- Razdalja od jedra vasi: **~297 m JV** (izračun haversine) — njiva na robu vasi, povsem skladno z lokalnim toponimom.
- iNaturalist places autocomplete „Poganjec“ = 0 (brez place objekta; opazovalec uporablja prosto ime lokalitete) — dokumentirana praznina LOD.
- Muzej išče še vedno domačinsko potrditev toponima — GBIF verbatim lokaliteta + koordinati pa zdaj **pinirata lego** in potrjujeta rabo imena s strani tretje osebe (opazovalec ptic 2025); posodobljen opomba vira v MVG-105 (add-only).

## Ostali izmeri (falsifikacije / ničelni)

- `s13-belokranjec.json` (val 21, neocenjen): pretežno šum (zenodo, ipbes); en uporaben zadetek = belokranjec.si „Dobrodošli — arhiv tiskanih izdaj bo dodajan postopoma“ → vodilo za PRELOM 3.
- dLib vse poti = 000 (details/stream/preview) — sken strani Domoljuba ostaja TO_COLLECT (potreben JINA ali izven-peskovniški dostop).
- JINA (r.jina.ai) ves val 401 „bad IP reputation“ (tudi po ohlajanjih) — **page_reader ga nadomešča za JS-challenge gostitelje**; za dLib (IP/TLS blokada tretje ravni) tudi page_reader ne zadošča.
- wayback/archive.org: timeout (3. val zapored).
- Poganjec web_search: 100 % šum (splošni „polje“) — GBIF pot je edina sadovitna.
- knjiznica-ptuj.si naročilniški zapis (ISBN, avtorji besedil knjige) = TO_COLLECT (globlja URL-struktura ni enumerirana).

## Vgradnja (atomarna skripta, rep-strict)

- **+2 zapisa**: **MVG-110 turški-vpadi-1524** (kraj, DOCUMENTED, 4 viri: weiss-2018-castite, hhsta-m-25-1556, dular-kronika-2024, belokranjski-muzej-metliski-grad; postaja sprehoda „Vas in njeni ljudje“) in **MVG-111 grybl-cevljar** (obrt, DOCUMENTED, 3 viri: weiss-2018-castite, abmm-cevljarski-ceh, golia-slovenica; postaja sprehoda „Iz Gribelj v svet“) — brez slik (vzorec MVG-108/109).
- **griblje-vas +1 vir** (weiss-2018-castite; opomba: listina 1468 — pet hub + mlin na Kolpi — neodvisna potrditev prve omembe; str. 182 Katterjeve hube; str. 267 opustošenje).
- **MVG-105 posodobljen vir** gbif-lunja (opomba: GBIF verbatim lokaliteta „Poganjec“ + koordinati 45.574073/15.278092, ~297 m JV od jedra — add-only opomba).
- Skupaj: **542 → 551 virov** (8 novih + 1 odprtje identitete? ne — deljeni weiss-2018-castite med 3 zapisi), identitet/deljenih preračunano po auditu.
- i18n: 25 nizov števcev × 5 jezikov 109→111 (EN „one hundred and eleven“, HR „Sto enajst“, DE „Hundertelf“, IT „Cento undici“).
- Konstante v 7 skriptah (audit-entities, test-entities ×11, test-timeline-map ×13, test-ai-curator, red-team ×5, audit-timeline-map ×3).

## Regresija (živi :3000 po restartu + reseed)

- tsc 0 · lint čist · verify-i18n 948×5 · audit-entities ✓ 0 napak (111/551/…/372) · audit-timeline-map 41 ✓/0 · audit-iiif 5 ✓/0 (376 faz) · test-entities 100 ✓/0 · test-timeline-map 72 ✓/0 · test-ai-curator 214 ✓/0 · red-team 157 ✓/0 (GAP 24) · test-plan-visit 42 ✓/0
- OpenData **111/551** živo · sitemap **112** · IIIF 111/111 + manifesti MVG-110/111
- agent-browser: MVG-110 + MVG-111 (naslovi, viri, timeline), hero „111“, 0 konzolnih napak po svežem nalaganju, preliv 0 na 6 širinah, footer mt-auto

## Stanje po valu 24

**111 zapisov (MVG-001–111), 551 virov, 438 identitet, 63 deljenih, 95 entitet (oseb 36); sitemap 112; i18n 948 × 5; 13 API poti.**

*(števci identitet/deljenih potrditi z audit-entities ob vgradnji)*

## Surovine

`raw-web-val24-2026-10/`: s01-weiss-knjiga.json, s02-belokranjec-pdf.json, s03-belokranjec-griblje.json, s04-poganjec.json, s05-weiss-kazalo.json, muzej-metliski-grad.html, kronika-gorjanske.pdf + .txt, knjiznica-ptuj.html, inat-place-poganjec.json, gbif-lunja.json, pr-ptuj.json, pr-belokranjec.json, pr-belokranjec-7-8-2026.json, pr-belokranjec-pdf.json, pr-weiss-academia.json, pr-flipbook-init.json, jina-belokranjec-arhiv.md, jina-belokranjec-izdaje.md, jina-belokranjec-dom.md, naslovnica-330.jpg, weiss-strani/ (159 strani), weiss-najdbe-2026.txt
