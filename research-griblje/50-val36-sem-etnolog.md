# 36. val raziskave — SEM (Slovenski etnografski muzej) = NOV KANAL + polno besedilo Etnolog 10/11 (1937/1939)
*88. sklop · 2026-09-22 · naročilo: »odlicno nadaljuj«*

## Izhodišče
Stanje po 35. valu (87. sklop): 113 zapisov, 568 virov, 449 identitet, 66 deljenih, 95 entitet.
Izven-peskovniška vrsta: S2 search-kvota → dLib Mason 2001 → Kamra pričevanje → ARSO.

## Poleto 1 — S2 search-kvota (5. poskus)
`api.semanticscholar.org/graph/v1/paper/search` = **429** tudi po odmiku (s01, s02) — search endpoint
ostaja zaprt za deljeni IP (paper endpoint nemoteno). Citacije Mason 2001 ostajajo TO_COLLECT.

## Poleto 2 — dLib (Mason 2001, VS 39)
Spletno iskanje brez operatorja site: ne loči domene; dlib.si je JS-SPA brez izvedljivega iskalnega
URL-ja brez seje. Mason 2001 (Varstvo spomenikov 39, str. 7–27) ostaja TO_COLLECT po poti dLib.

## Poleto 3 — PREBOJ: Slovenski etnografski muzej (SEM) = NOV KANAL
SEM (`etno-muzej.si`) ima Google Custom Search (JS) — z **r.jina.ai** bralnikom pa vsebina dostopna.

### 3a. Etnolog 10/11 (1937/1939) — polno besedilo PDF
Ključne besede revije Etnolog imajo **uradno stran ključne besede Griblje ob Kolpi** (taxonomy 8249):
`etno-muzej.si/sl/etnolog-kljucne-besede/griblje-ob-kolpi` → **polno besedilo PDF** (33 strani, 5,44 MB):
`etno-muzej.si/files/etnolog/pdf/etnolog_10_11_1937_1939_sopek.pdf` → pdftotext **69,1 kB**.

Ključne ugotovitve iz polnega besedila (11 × Griblj):
1. Narodno blago zbrala in zapisala Katarina Zupanič **v letih 1894.–1895. po nagovoru sina Nika**.
2. **Griblje, velika vas ob Kolpi, ki šteje 110 domov** (stanje ok. 1937).
3. **Listina z leta 1524: po turškem napadu tistega leta v Gribljih ni ostal niti en plug**; graščaki
   so vabili begunce iz Bosne in Hrvaške — NOVO zgodovinsko dejstvo za MVG-004 (Uskoki).
4. Belokranjske pesmi v treh skupinah; najstarejše prinesene z ozemlja med Uno in Kolpo.
5. Gribeljci svoje zidanice; ob kopanju in trgatvi se je pelo »da je gora zvonila«.
6. Cerkev sv. Vida — akvarel M. Gasparija; pokop župnika Gregorja Cerarja pod zemeljskimi lokvi (Sokoli).
7. Miko Zupanič (1841–1911), rojen na Krasincu št. 18, ok. 1873 preseljen v Griblje (hiša št. 73).

### 3b. SEM digitalne zbirke — lokacija Griblje (zbirka starih fotografij)
`etno-muzej.si/sl/digitalne-zbirke/lokacije/griblje` = **4 zapisa starejših fotografij z lokacijo Griblje**:
- **F0000838** — »Ženska vsakdanja kmečka noša, kakršno so nosile v Gribljah in okolici za vsak dan,
  ob hladnejših dneh še na prehodu v 20. stoletje. **Verjetno fotografiral Niko Županič.**« (ok. 1920)
- **F0000212** — »Enonadstropna hiša na pero, rojstna hiša dr. Nika Županiča.«
- **F0000183** — »Hiša, Griblje.« (ključne besede: hiša, perutninarstvo, vsakdanja noša)
- **F0001407** — »Hiša, Griblje.« (1. 4. 1928; hiša, ograja)

### 3c. SEM spominska razstava
`etno-muzej.si/en/razstave/niko-zupanic-cosmopolitan-from-griblje` — »Dr. Niko Zupanič, kozmopolit iz
Griblje« ob 140-letnici rojstva; spremljajoča objava v **Etnolog 27 (2017)**.

## VGRADNJA (add-only, izpeljana iz semena — nauk 34. vala)
1. **MVG-043 (katarina-zupanic):** +1 vir `etnolog-1937-1939-sopek-pdf` (objava; polno besedilo PDF SEM)
   + zgodba SL/EN +1 stavek (Etnolog 10/11, str. 114–146; 1894.–1895. po nagovoru sina).
2. **MVG-004 (uskoki-in-vojna-krajina):** +1 vir (isti PDF, deljen) + zgodba SL/EN +1 stavek
   (listina 1524 — niti en plug; naselitev beguncev iz Bosne in Hrvaške).
3. **MVG-079 (belokranjska-nosa):** zgodba SL/EN +1 stavek (F0000838; »verjetno fotografiral Niko Županič«).
4. **MVG-010 (niko-zupanic):** +1 vir `sem-digitalne-zbirke-lokacija-griblje` (spletni-vir) + zgodba
   SL/EN +1 stavek (razstava 140-letnica + rojstna hiša + noša).
5. **Popravek obstoječega vira:** `sem-kozmopolit` URL prej pokazal na golo domeno `etno-muzej.si/`
   → zdaj natančna stran razstave `/en/razstave/niko-zupanic-cosmopolitan-from-griblje`.
6. **PRED dedupom 5 ponudnikov → 3 vgrajeni** (2 ponudnika = že obstoječa vira `sem-f0000212`,
   `sem-f0000838` — isti URL, del A1; ponudnik razstave je zamenjal URL popravljenega vira
   `sem-kozmopolit`). Nauk: grep semena PRED vgradnjo, ne šele po njej.

## Regresija (živi :3000 po reseed)
tsc 0; lint čist; verify-i18n 946 × 5 ✓; audit-entities ✓ 0 napak (**113/571/452/67/375**; 95 entitet,
36 oseb); audit-timeline-map 39 ✓/0; test-entities 100 ✓/0 (T5.12 posodobljen: 5 vrstic Šopeka,
4 sourceKey; T9.3 OpenData 113/571); test-timeline-map 72 ✓/0; test-ai-curator 214 ✓/0;
red-team 157 ✓/0; test-plan-visit 42 ✓/0; OpenData **113/571** živo (po ponovnem zagonu dev —
stari proces je držal zastarel ročaj datoteke DB); sitemap 114.

## agent-browser
/exponat/katarina-zupanic: stavek »114–146« ✓, povezava PDF-a ✓, vir Etnolog 10/11 ✓;
/exponat/belokranjska-nosa: F0000838 ✓ + Niko Županič ✓; hero 113 ✓; noga footBottom = pageH
(5606), vrzel 0 ✓; preliv 0 pri 390 px ✓; konzola brez napak ✓.

## Stanje
**113 zapisov (MVG-001–113), 571 virov, 452 identitet, 67 deljenih, 95 entitet; sitemap 114; i18n 946 × 5; 13 API poti.**

## Surovine (raw-web-val36-2026-10/)
s01/s02 (S2 429), s03–s06 (web_search dLib/Kamra), sem-home.html, sem-search.html, sem-search2.html,
jina-sem-search.md, jina-sem-etnolog.md, jina-sem-lokacije.md, jina-sem-f0000838.md,
etnolog-1937-1939-sopek.pdf (5,44 MB) + .txt (69,1 kB), vgradnja-val36.mjs.

## Izven-peskovniška vrsta (posodobljena)
S2 search-kvota (Mason 2001 CorpusId → citacije) → dLib Mason 2001 VS 39 (str. 7–27) →
Kamra pričevanje → OpenAlex z lastnim ključem → ARSO letna serija → vinogradniška diploma (RUL gID)
→ Kataster jam → Belokranjec PDF (3. poraz) → Poganjec → Lojze↔Alojz → SI AS 176 →
gostilna pred 1898 → vrzel #3 (360°) → Mason 2001 session dLib → Andrič 2007 polno besedilo.
