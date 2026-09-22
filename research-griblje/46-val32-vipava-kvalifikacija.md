# 32. val raziskave — Vipava 2010: vozovnica na Švedsko; dLib mrežno prebit
*83. sklop · 22. 9. 2026*

## Kontekst

Zahtevek: »odlicno pushaj na github sinhroniziraj kode na vercel in nadaljuj posodobi readme« — sinhronizacija je bila prvi del sklopa (HEAD 7a51927 = origin/main preverjena, Vercel produkcija 112/564 živo = identično lokalnemu, auto-deploy potrjen; README osvežen z blokom »Zadnja posodobitev« + 3 popravki zastarelosti — commit af30a35, push 7a51927..af30a35). Drugi del sklopa = 32. val raziskave po izven-peskovniški vrsti vala 31, na vrhu katere je stal **vk-najboljsa-oraca-2010** (TO_COLLECT kot ločen vir — koroboracija svet24-filak-2010), kot vzporedna lov pa **Mason 2001 polno besedilo** (8. poskus, tokrat prek page_reader, ki je v valu 30 prebil F5 Shape Security na Springerju).

## METODA

- **vk-najboljsa-oraca-2010**: URL članka identificiran iz surovin vala 31 (`jina-arhiv-search-p2.md`: `https://arhiv.vaskanal.com/novice/novice/488-najbolja-oraa.html` + vodilni odlomek z Vimeo 14968573); polno besedilo prek JINA na direktni arhivski poti (200, 725 bajtov) in na komponentni poti (`component/content/article/488-najbolja-oraa.html`, 200, 737 bajtov — identična vsebina, dokaz stabilnosti poti).
- **Mason 2001 (dLib)**: prvič v zgodovini tega muzeja **page_reader doseže www.dlib.si** — domača stran 102 kB HTML (mrežna blokada valov 26–30: curl HTTP 000, JINA »Malicious request« — je TRANSPORTNI nivo, zdaj prebit). Pot `/results/?query=...` (potrjen vzorec iz hrefov na domači strani) pa skozi fetcher vrača IIS 404 (1.104 bajtov) — z dvema kodiranjema (%27 navedki in brez). `oai.aspx` ne obstaja tudi kot pot (redirect na domačo); URN članka ni v iskalnih indeksih (web_search ×3: brez dLib detajlov); ZVKDS zadetek »Varstvo spomenikov, 39-41 - poročila« je po snippetu samo novica o tiskani izdaji (»v tiskani obliki«, 272 strani), ne PDF polno besedilo.
- Dedup baza: živa OpenData (112/564) + `dedup-baseline.txt` (val 21) + popis Vašega kanala iz valov 21/31 (37 enkratnih člankov).

## PRELOM 1 — vk-najboljsa-oraca-2010: kvalifikacijska zanka zaprta

Polno besedilo članka »Najboljša orača« (14. 9. 2010 — TO_COLLECT iz vala 31):

> »Konec minulega tedna je v Vipavi potekalo **54. državno tekmovanje v oranju**. Med **25-imi orači iz vse Slovenije** sta se najbolje odrezala Belokranjec **Anton Filak s plugom krajnikom** in Dolenjec **Igor Pate** v kategoriji obračalnih plugov, **ki bosta Slovenijo maja prihodnje leto zastopala na svetovnem tekmovanju na Švedskem**.« + video Vimeo 14968573.

**Vrednost (ni samo koroboracija):**
1. **Zaprta kvalifikacijska zanka** — doslej je bila vezava Vipava 2010 → Švedska 2011 (58. svetovno prvenstvo, Östergötland, vir DL) samo kronološka domneva; zdaj je izrecno dokumentirana v primarnem poročilu: naslov s Vipave je bil »vozovnica« na Švedsko maja 2011.
2. **Tip pluga pri naslovu 2010** — »s plugom krajnikom« (kategorija konvencionalnih plugov), Pate pa obračalni — sinhrono z Svet24 naslovom (»Pate prvi z obračalnimi plugi«).
3. **Številčno okvir tekmovanja** — 25 oračev iz vse Slovenije (prvi dokumentiran obseg 54. tekmovanja).
4. **Dvojna objava razrešena** — arhivska povezava 6939 (kategorija Starejše novice) = ista vsebina kot 488 (Novice) — ena identiteta vsebine, kot je ocenil val 31.

**Vgrajeno (add-only):** +1 vir `vk-najboljsa-oraca-2010` na MVG-022 (objava, dobesedni citat v opombi SI/EN + ocena »ključni vir kvalifikacije«); zgodba SL/EN +1 stavek v odstavku »državna kronika« (Vipava kot »vzvod«/»lever« + citat »ki bosta Slovenijo maja prihodnje leto zastopala…«). Dedup: naslov + datum + Vimeo 14968573 ujemajo z valom 31 razsodbo (TO_COLLECT → vgrajeno), prekrivanje s svet24-filak-2010 = koroboracija po konvenciji (dva neodvisna poročevalca istega dogodka — oba ostajata).

## PRELOM 2 — dLib: mrežna plast prebita, potni nivo ostaja ovira

Val 32 dokumentira **prvi uspešni HTTP 200 s www.dlib.si v 7 valih** (page_reader, 102 kB domača stran z ASP.NET formo, `search.aspx`/`advancedsearch.aspx` + jQuery skripte = server-side render). Ovira se je prestavila z mrežnega nivoja (blokada IP/SNI) na **potni nivo fetcherja**: `/results/?query=...` vrača IIS 404 (tudi z dvema kodiranjema navedkov), čeprv je pot potrjena v hrefih na domači strani.

**Status Mason 2001 (VS 39: 7–27):** polno besedilo ostaja TO_COLLECT, bibliografija pa je trajno potrjena (val 30, Springerjeva sinteza). Novo tehnično stanje za naslednji val: (a) page_reader deluje proti dlib.si — poskusiti s potjo `/details/` oz. `/stream/`, ko bo URN znan (COBISS naročniško ali brskalniški obisk), (b) headless brskalnik v peskovniku kot alternativa fetcherju, (c) dLib 7 valov blokad + preboj = najdljša blokada v zgodovini muzeja, zdaj dvodelno razčlenjena (mreža ✓ / pot ✗).

## Dedup in ničelni izmeri

- s04-mason-pdf.json: Google Books ima samo starejše zvezke VS (11); ResearchGate zadetek = VS ~2011 (Štular), ne 39; academia.edu = drugo delo (Poselitev Bele krajine…).
- COBISS iskanje: brez direktnega zapisa VS 39 z URN.
- Suša: `/results/` skozi page_reader (2 × 404 IIS), `oai.aspx` (redirect na domačo), URN web_search ×3 (0 zadetkov).

## VGRADNJA (atomarna, rep-strict)

- +1 vir `vk-najboljsa-oraca-2010` na **MVG-022** (565; note SI/EN z dobesednim citatom, Vimeo 14968573, dvojna objava 488+6939); **+1 identiteta** (447 — nov arhivski URL); deljenih 65 (nespremenjeno).
- Zgodba MVG-022 SL/EN +1 stavek (Vipava = vzvod/lever, citat kvalifikacije, Igor Pate kot so-delitelj vozovnice).
- Konstante v 5 skriptah (565: test-entities T8.11/T9.3/T9.4, audit-entities, audit-timeline-map, test-timeline-map T7.2/T8.3/T8.4, red-team R0.3/R16.2; 447: test-entities T8.6, audit-entities, test-timeline-map T7.3) + sporočila »32. val«; zapisi/slike/hero/sitemap/i18n nespremenjeni (112/113/946 × 5).

## Regresija (živi :3000 po reseed)

tsc 0 · lint čist · verify-i18n 946 × 5 · audit-entities ✓ 0 napak (112/565/447/65/372; 95 entitet, 36 oseb; pokritost 82/112) · audit-timeline-map 39 ✓/0 · audit-iiif 5 ✓/0 (372 faz; 93+19) · test-entities 100 ✓/0 · test-timeline-map 72 ✓/0 · test-ai-curator 214 ✓/0 · red-team 157 ✓/0 (GAP 24) · test-plan-visit 42 ✓/0 · audit-numbers: samo znane historične oznake (anton-filak neoznačena — številke »25 orači« imajo ujemanje v obeh jezikih) · reseed → OpenData **112/565** živo · sitemap 113.

## agent-browser

`/exponat/anton-filak`: zgodba izrisuje stavek »Vaš kanal je ujel tudi vzvod: med 25 orači … naslov pa je bil vozovnica« ✓; VIRI vsebujejo »Vaš kanal: »Najboljša orača« (14. 9. 2010 — 54. državno tekmovanje v oranju, Vipava)« s polno opombo ✓; `?lang=en`: »Vaš kanal caught the lever too … the title was a ticket« + EN opomba vira ✓; konzola čista (napaka »Unterminated string constant« = prehoden HMR artefakt ob urejanju med kompilacijo — tsc 0 in sveže strani 200); preliv 0 pri 390 px (clientW 390, scrollX 0) · noga footBottom = pageH (9.895 px), vrzel 0; dev.log: zadnji GET 200.

## Stage Summary

- Stanje: **112 zapisov (MVG-001–112), 565 virov, 447 identitet, 65 deljenih, 95 entitet (oseb 36); sitemap 113; i18n 946 × 5; 13 API poti**
- Kvalifikacijska zanka Filak zaprta: **Vipava 2010 (54. državno tekmovanje, 25 oračev, naslov s krajnikom) → Švedska maj 2011 (58. svetovno prvenstvo)** — vezava zdaj primarno dokumentirana, ne več samo kronološka
- dLib: mrežna blokada (7 valov) prebita s page_reader — ovira prestavljena na potni nivo; Mason 2001 polno besedilo ostaja TO_COLLECT z natančnejšo potjo rešitve (URN → /details/ oz. /stream/)
- Sinhronizacija sklopa: GitHub 7a51927 = origin/main ✓, Vercel 112/564 (pred valom 32) = lokalno ✓, README osvežen (af30a35)
- Izven-peskovniška vrsta (posodobljena): vinogradniška diploma (RUL gID) → Andrič 2007 kopije → OpenAlex z lastnim ključem → Kataster jam → Belokranjec PDF → Poganjec → Lojze↔Alojz → Kamra pričevanje → ARSO letna serija → SI AS 176 → gostilna pred 1898 → vrzel #3 (360° panorame) → vk-najboljsa-oraca-2010 **IZVRŠENO** → Mason 2001 prek dLib URN poti (/details//stream/) → dLib /results/ prek headless brskalnika

Surovine: `raw-web-val32-2026-10/` (jina-488-oraca2010.md, jina-488-comp.md, pr-dlib-search.json, pr-dlib-search2.json, pr-dlib-oai.json, pr-dlib-home.json, pr-dlib-r1.json, pr-dlib-r2.json, pr-zvkds-home.json, s01–s05)
