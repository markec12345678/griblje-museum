# 30. Val 16 — spominska obeležja (drugi poročevalci) + ribnik z zunanjim opisom + kartografski portali: popis dostopnosti (2026-10)

**Naročilo:** »odlicno nadaljuj« (po sklopu 64 / valu 15; vrzeli #2 in #4 zaprti, ostaja #3 — panorame od vaščanov). Val 16 = trije rovi: (A) spominska obeležja — ali ima spomenik padlim drugo neodvisno podobo; (B) narava — ribnik v višjem ločljivostnem opisu; (C) kartografija — frančiškanski kataster, vojaški izmeri, Geopedia, Mapire, eZKN.

## Surovine

`research-griblje/raw-web-val16-2026-10/` — iskalni JSON (k01–k14), prenešeni strani (p01–p11), Wikidata entiteti (wd-*.json), iskalni poskusi Mapire/dLib/SAAS/Commons.

## Rov A — Spomenik padlim (MVG-029): drugi poročevalec

- **PRELOM:** blog **Simboli polpretekle zgodovine** Primoža Šmajdka, objava »GRIBLJE — Spomenik NOB« (18. 1. 2013): »Kamnit steber z imeni enajstih padlih borcev in dveh žrtev 2. svetovne vojne iz Gribelj stoji na manjšem parkovno urejenem dvignjenem platoju, do katerega vodijo stopnice. Spomenik je bil postavljen leta 1961 in stoji pred osnovno šolo.«
- Nova podrobnost v zbirki: **dvignjen platoj s stopnicami** (arhitektura prostora za srečanje); neodvisna potrditev štetja 11 + 2 = 13 in letnice 1961.
- Vgrajeno: vir `spomeniki-blog-2013` (citiranje — fotografije bloga so avtorsko zaščitene, citiramo le opis) + odstavek v zgodbi SL/EN (pred zaključnim odstavkom o fotografiji).
- **Dedup:** (1) Kamra stran (k03 rank 0, datum 8. 5. 2018) = že vir `kamra-spomenik`; (2) **partizanstvo.si** — opis besedilno enak blogovemu (platoj/stopnice) in stran JS-renderirana brez dostopnega API (wp-json 404, page_reader 404 na globoko povezavo; curl prazen) — *verjeten skupen vir z blogom*, izpuščen z izrecnim sklepop; (3) **avArc aGis** (static.avarc.org, 8.–9. 8. 2026) — agregator, ki v kreditu sam navaja »partizanstvo.si / Arhiv Geopedia · CC-BY 4.0« → izvorno gradivo, ne samostojen poročevalec; izpuščen; (4) Mapy.com/Hribi.net/spomenikdatabase zadetki = druga vasi (Ajdovščina, Šmartno ob Paki, …) — niso Griblje.

## Rov B — Vaški ribnik (MVG-016): prvi zunanji opis

- **PRELOM:** **Discover Bela krajina** (en.odkrijtebelokrajino.com, Wix portal, © 2022, About us: osebni »darilo domovini« avtorja-fotografa) stran »Pond in Griblje« (`/ribnik-v-gribljah`): ribnik **na poljih med vasema Griblje in Krasinec**; **lesena kočica in brv**; obiski **štorkelj**; **vodne lilije**; kačji pastirji; nivo vode skozi leto stalen, pada le v izrazito sušnih sezonah; dostop ~500 m peš med polji (z vozilom do ribnika ni mogoče) z glavne ceste Gradac–Metlika ali s strani Krasinca; skrbetv za okolico pripisuje domačinom.
- To je prvi zunanji opis z lego in podrobnostmi — do zdaj je zapis poznaval samo fotografijo (Uroš Novina, Commons).
- Vgrajeno: vir `odkrij-belakrajina-ribnik` (citiranje, zasebni portal) + odstavek v zgodbi SL/EN (za uvodnim odstavkom). Koordinate zapisa ostanejo približne (coordsApprox true) — točna koordinata ni v viru, muzej jo ne izmišljuje.
- **Dedup:** reka-kolpa.si (kopališče) = že vir; belakrajina.si (turistična TIC) — iskanje vrne samo splošne strani mesta/regiona, **brez gribeljske vsebine** (belakrajina.si ostaja domena z 0 virov — odkrita priložnost za prihodnji val).

## Rov C — Kartografija (kataster/izmeri): popis dostopnosti iz peskovnika

- **eZKN** (Pregledovalnik arhivskih zemljiškokatastrskih načrtov, GU RS + SAAS — pravi dom za SI AS 176 Franciscejski kataster za Kranjsko, 1823–1869): vseh pet ugibanih naslovov vrne 000 (gov.si omrežje iz peskovnika nedosegljivo); page_reader na gu.gov.si pot = ERR_CONNECTION_RESET.
- **SAAS**: agd.sas.si 000, e-arhiv.sas.si 000, opisnik.sas.si 000 (samo www.sas.si 200, brez gradiva).
- **Geopedia** (geopedia.si): 000 — nedostopen.
- **Mapire** (maps.arcanum.com): curl → 403 (AWS bot-obzidje; poskus 202 = challenge); page_reader ni poskusjen na globoko povezavo (JS aplikacija, tile ekstrakcija izven dosega CLI). *Val 12 je imel prazen poskus (0 bajtov) — tokrat dokumentiran porožen.*
- **Commons** (tretji vojaški izmer, listi 1:75.000/1:25.000): API deluje, a iskanja »Metlika third military survey« / »Spezialkarte Krain 5055« → 0 zadetkov; zaporedni klici omejeni (rate-limit). List s Gribljami ni najden prek prostega iskanja — TO_COLLECT z točno številko lista (napredni katalog, oz. obnovitev ob kvoti).
- **rodoslovje.si/kartografija/** (dobro stopirana povezovalna stran): 200, a za JS-brano (»One moment, please…«); ni prenesena.
- **dLib polnotekstovno** (»Griblje« v starih časopisih): domovina 200 (114 kB), vzorec `results/?query=…` najden v HTML, a results-strani iz peskovnika odgovarjajo s 404 (page_reader) / timeout >110 s (curl). Ostaja največja nepopisana površina — *lasten val, ko bo omrežje sodelovalo.*
- Sklep Rov C: **nič vgrajenega** — vsi portali ali zaprti ali brez gribeljskega zadetka; frančiškanski kataster Gribelj (~1824, KO Metlika) ostaja najbolj zanimiv nedostopen vir (parcely + hišne številke pred Freyerjevo karto 1843).

## Vgrajeno (add-only)

- **+2 vira** (512 → 514; identitet 402 → 404; deljenih 60 → 60): `spomeniki-blog-2013` → MVG-029, `odkrij-belakrajina-ribnik` → MVG-016.
- **+2 zgodbeni odstavki SL/EN** (MVG-029: platoj/stopnice + potrditev štetja; MVG-016: lega, kočica/brv, štorklje, lilije, suša, 500 m dostop).
- Brez i18n ključev (samo zgodbe/viri); brez entitetnih sprememb (novi vira niso entitetni dokazi); sitemap nespremenjen (102).
- Števci usklajeni v 6 skriptah (audit-entities, audit-timeline-map, test-entities, test-timeline-map, test-curator-red-team ×2) + README (tabela 514, regresija 101/514/404/60/372, db:seed 514).

## Regresija (živi :3000)

tsc 0, eslint čist, verify-i18n 946 × 5, audit-entities ✓ (514/404/60/372), audit-timeline-map 39 ✓/0, audit-iiif-annotations 5 ✓/0 (372/372), test-entities 100 ✓/0, test-timeline-map 72 ✓/0, test-ai-curator 214 ✓/0, red-team 157 ✓/0 (GAP 24), test-plan-visit 42 ✓/0; reseeda → OpenData 101/514 živo.

## Dopis — zastarel števec v heroju (najden ob brskalniški preverbi)

Pri posnetku domače strani je hero vabil »**Zbirka 93 zapisov** …« — stalna številka iz časa zgodnjih sklopov, ki je sledila 101 zapisom. Popravljenih **25 nizov v 5 jezikih** (hero, podnaslov vodiča, opomba sprehodov, vizualno iskanje, koledarska vrata: »93« → »101« / »one hundred and one« / »sto jedan« / »hundertundein« / »centouna«); verify-i18n 946 × 5 ostaja, tsc 0. Prav hero-študent uči: številke v i18n so vsebina, ne vzorec — regresijski števci jih ne ujamejo, ker preverjajo ključe, ne resnice.

## Poučne epizode

1. **Beli ≠ Bela:** sidro »V Bela krajini voda ni samoumevna« ni obstajalo — v datoteki piše »V **Beli** krajini« (sklanjana oblika). Preverjanje sidr po kosih (grep -F na krajših nizih) lokalizira neujemajoči znak/obliko na sekundo.
2. Iskalni engine občasno vrne **zaljiv q-id** (k05: Wikidata Q2794477 = revija *Frontiers in Psychology*, ne vas) — polje `host_name` je bilo prazno, /goto preusmeritve opaqni; preverba prek uradnega API-ja (`wbgetentities`) je edini zanesljiv sklep. Muzejev citat **Q2531566** potrjen kot pravilen.
3. MultiEdit ni atomaren (spet): 1. kolu apliciral 3 od 6 popraškov (2 zgodbi MVG-029 + vir) pred odpovedjo na ribnikovem sidru; stanje preverjeno per-check, ostalo v dveh kolih z točnimi sidri.

## Stanje

**101 zapisov (MVG-001–101), 514 virov, 404 identitet, 60 deljenih, 94 entitet; sitemap 102; i18n 946 × 5; 13 API poti.**

## Ostaja TO_COLLECT

(vse iz vala 15) + hišna/parcelna številka spomenika prek katastra ko eZKN/SAAS postaneta dostopna; točna številka lista tretjega vojaškega izmerja s Gribljami; dLib polnotekstovna enumeracija (lasten val); belakrajina.si Griblje-stran (če nastane); prepis trinajstih imen s spomenika (še vedno najtežji seznam).
