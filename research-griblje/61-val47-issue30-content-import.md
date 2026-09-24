# 61. val (47. val vsebine) — ISSUE #30: RESEARCH + CONTENT IMPORT (2026-09-24)

**Naročilo:** issue #30 — »Naredi dejansko raziskavo in vnesi preverljive podatke v muzej,
ne samo seznam povezav ali naslovov virov.« Poudarki: (1) šolski list [4118864],
(2) ljudje, (3) kataster 1851–53 + drugi javno dostopni katastrski viri, (4) cerkev
in župnija, (5) hiše/gostilne, (6) vnos v dejanski muzej (source → fact → entity →
relation → museum-visible), (7) viri z natančno referenco, (8) zemljevid brez
izmišljenih koordinat, (9) kakovostna kontrola + inventar. Pravilo: **Ne izmišljaj.**

---

## A — ŠOLA: ŠOLSKI LIST [4118864] — DOSTOP PREIZKUŠEN, ZAPRT ZA SEJO

- VAČ detail page `details?id=4118864` (refCode SI_ZAL_ČRN/0001/001/00012) odprt
  prek brskalnika **in** curl -k: popis potrjuje »Kopije (obstoj, lokacija):
  digitalizirano«, **NE izpostavlja pa nobene datotečne povezave** — HTML vsebuje
  0 zadetkov za uodid/docid/iiif/file (za razliko od ARS enot SI AS 176, kjer
  details → file?uodid → IIIF manifest).
- Poskus direktnega manifest klica `/vac/iiif/pdf-manifest?uodid=4118864` = prazen odgovor.
- **Sklep:** digitalna kopija ZAL enote se servira ŠELE registrirani uporabniški
  izkaznici VAČ ali v čitalnici (VAČ uporabniški profil zahteva prijavo z
  osebnimi podatki — za muzejsko nalogo ni mogoče/neprimerno).
- **Vgrajeno:** ArchiveRecord SI_ZAL_ČRN/0001/001/00012 dobi raziskovalno opombo z
  izvidom preizkusa dostopa. Enota ostaja **P1★ NOT_VIEWED** (najdeno ≠ prebrano).
- Drugi viri o šoli: arhivska enumeracija 46. vala velja; šolska kronika OŠ
  Podzemelj [3864805] = ZAL čitalnica (isti režim); splet nove ugotovitve ni.

## B — KATASTER: N83 PUA — **PRVO VSEBINSKO BRANJE ABECEDNEGA SEZNAMA LASTNIKOV**

- V 42. valu potrjeno: vseh 12 enot fonda digitaliziranih; PUA = docid 41782,
  49 strani. **Ta val:** prenešenih **vseh 49 strani** prek
  `/vac/util/pdfPageImage?uodid=373417&docid=41782&page=1…49` (~50–110 kB JPEG,
  630×1027; fol. 1 = naslovnica manjša).
- **Struktura potjena (fol. 2):** tiskan naslov »Alphabetisches Verzeichniß der
  Grund Eigenthümer und ihrer nach Sectionen abgetheilten Grund Parzellen« +
  rokopis »der Gemeinde Grüble«; stolpci: Fortlaufende Nummer · Bezeichnung der
  Section · **Haus No.** · Des Eigenthümers **Name Stand und Wohnort** · Anmerkung.
- **Prebrani fol. 3–6 in 20 (preliminarno, Kurrent):**
  | fol. | hiša | vpis | stabilnost |
  |---|---|---|---|
  | 3 | **23** | Brinc Matija (»Princz Matija«), Bauer, »haus Grüble« | 3/3 |
  | 3 | — | Anmerkung: »Baron Apfaltrer?« (Kurrent P/B; fevdalni lastnik) | nestabilno → VRSTA |
  | 4 | **24** | Brinc Mihael, Bauer | 3/3 |
  | 4 | **25** | »Brincz Michl Karlina?« — ženski lastnik ali par imen? | nestabilno → VRSTA |
  | 5 | **26** | Brinc Janez (»Jhuan/Johann«) | 3/3 |
  | 5 | **28** | Brinc Miha (»Michl«) | 3/3 |
  | 6 | **65 (ali 66)** | Brinc Marko, Bauer | 2/3 zadnja cifra |
  | 6 | — | institucionalni lastnik **»Commenda«** (obsežen sklop Section V) | vidno, identiteta ustanove odprta |
  | 20 | **46** | »K…an Jožef« (Klobučan? Kabotschan?) | nestabilno → NISO vgrajene |
- **Pomembno pravilo branja:** Kurrent P/B zamenjava — »Princz« = **Brinc**
  (naselbinska korelacije: zaselek **Brinsko selo** + pogostost priimka v vasi).
- **Inventar branja:** 5 imen s stabilno identiteto (priimek + ime + hiša) →
  **5 novih entitet oseb** (person:brinc-{matija,mihael,janez,miha,marko}-1825,
  role zgodovinska-oseba, vez MVG-001/vir PUA); 2 negotovi identiteti →
  **kuratorska vrsta P2-E8** (Karlina h. 25), **P3-E10** (Apfaltrer?), **P3-E11**
  (K…an Jožef h. 46); 1 institucija → **P2-E9** (Commenda/Malteški red?).
- PS (Seznam zemljiških parcel, 143 str., docid 41780) = **NEBRAN** (NOT_VIEWED,
  digitaliziran) → ArchiveRecord vgrajen kot naslednja enota za branje.
- Kataster 1851–53 (SI AS 749/3/8/12): ostaja čitalnica ZAL/ARS — ni online.

## C — CERKEV IN ŽUPNIJA: MATRICULA = PRIMARNO POTRDITEV ŽIVE VEZE

- `data.matricula-online.eu/en/slovenia/ljubljana/podzemelj/` (katalog prenesen):
  **»Podružnice / Filialkirchen: 1. Sv. Anton Puščavnik, Krasinec · 2. Sv. Helena,
  Zemelj · 3. Sv. Vid, GRIBLJE · 4. Žalostna Mati Božja, Klošter · 5. Devica
  Marija rožnega venca, Dobravice«** + »Historično matično območje« izrecno
  vključuje **Griblje**. Zavetnik župnije: sv. Martin.
- **22 digitaliziranih matrik 1669–1947:** krstne 01723 (1675–1703) … 04104
  (1871–85), **04105 (1886–1919)**; mrliške 01732 (1725–68) … 04106 (1857–85),
  04894 (1886–1924); poročne 04795 (1669–79) … 01738 (1828–73), **04455
  (1873–1922)**.
- **Vzorca branja vol. 04105** (viewer brez prijave; skena URL iz performance API,
  oblika `img.data.matricula-online.eu/image/{base64 hosted URL}?csrf&ctrl` —
  token enkraten, branje po skenih prek viewerja):
  - **sken 20 (1887):** »Griblje, hiša št. 61 — Katarina«; oče Miha P.— (priimek
    v Kurrentu negotovo P—žar/P—žt); matričar (podpis) **Matija Kokalj**.
  - **sken 100 = str. 49 (1897):** »Griblje, hiša št. 61 — Anton« (+29.3.1933
    pripis smrti); oče spet Miha P.—, druga žena. → hiša 61 = istoimenska rodova.
  - Stolpci vpisa: Zaporedna številka · Leto/Meseci in dan (rojstva|krsta) ·
    **Roystni kraj krščenca** · **Hišna številka** · Ime krščenca · Vera ·
    Roditelja · Botra · Babin pomočnica · Podpis matričarja.
- RKD/EŠD 2122 (rkd.situla.org): sandbox vrne prazen body (blokada) —
  EŠD 2122 ostaja citiran po sekundarnih virih.
- **Vgrajeno:** nov vir `matricula-podzemelj-2026` na sveti-vid (v museum-content
  + živa baza); 3 trditve DOCUMENTED (podružnica 3., 22 matrik online, vpisi
  Griblje s hišnimi št.); vez sv. Vid ↔ Podzemelj zdaj nosi primarni URL.
- Status animarum Podzemelj 1850–1890 I.: ostaja čitalnica NŠAL (46. val popis).

## D — HIŠE/GOSTILNA

- PUA = prvi sistematični seznam hišnih lastnikov (1825) — gostilna med branimi
  fol. NE izrecno (»Commenda« ni gostilna); vpis vrste stavbe je bila v PT
  (stavbne parcele, 8 str., 42. val: Wohnhaus/Häusl/Scheune, brez gostilne).
  Sklep ostaja: gostilna pred 1898 = raziskovalno vprašanje; negativne sledi se
  NE predstavljajo kot dokaz (issue #30 točk 5).

## E — VNOS V MUZEJ (izvedeno)

| plast | vnos |
|---|---|
| viri | +1 (matricula-podzemelj-2026 na sveti-vid); PUA/PV/PZ/PT viri že obstajajo — PUA note posodobljena (branje 47. vala) |
| ArchiveRecord | +2 (N83 PUA **VIEWED_PARTIALLY**, N83 PS **NOT_VIEWED**), opomba šolskemu listu (preizkus dostopa) |
| trditve | **+6 PUBLISHED** (5 DOCUMENTED / 1 CORROBORATED / 1 UNVERIFIED — prve trditve zbirke), vse z pageRef + researcherNote |
| entitete | **+5 oseb** (Brinc 1825) + 4 nova vprašanja kuratorske vrste (P2-E8, P2-E9, P3-E10, P3-E11) |
| zgodbe | griblje-vas + sveti-vid: nov odstavek 47. vala (SI + EN) |
| UI | exponat stran: **nova sekcija »Zgodovinske trditve«** (strežniško, PUBLISHED trditve z vir + stran + status; graceful brez baze) |
| skripte | `scripts/claim-register.ts` (idempotenten uvoz: vir + ArchiveRecord + trditve z evidence gate) |

## F — KAKOVOSTNA KONTROLA

- tsc 0 · lint čist · 125/125 enotnih · audit-entities **✓ 0 napak** (100
  entitet/41 oseb; vrsta 32 vprašanj) · audit-sources/numbers/crossfile =
  znani vnaprejšnji flagi, brez novih
- živi preizkus (dev :3001): `/api/claims?slug=sveti-vid` = 3 ·
  `/api/claims?slug=griblje-vas` = 3 · `/api/archive-records` = 7 · stran
  griblje-vas: sekcija »Zgodovinske trditve (3)« z badge-i preverjeno/
  dokumentirano/nepreverjeno + povezave virov · sveti-vid: Matricula ×20
- OpenData/enotni števci: virov 589 (588 + matricula), deljenih 68 (isti ključ
  URL kot vir zapisa porocna-1669 — Matricula župnije Podzemelj), entitet 100,
  oseb 41

## G — INVENTAR (zahteva issue #30 točk 9)

| | |
|---|---|
| novih virov | **+1** (Matricula; PUA note posodobljena) |
| novih oseb (entitete) | **+5** (Brinc Matija, Mihael, Janez, Miha, Marko — 1825) |
| novih objektov | 0 (objekt = hiša/parcela → shema nosi prek trditev + ArchiveRecord; zemljevid brez preverjenih koordinat = prazno, po pravilu issue #30 točk 8) |
| novih katastrskih zapisov (ArchiveRecord) | **+2** (PUA VIEWED_PARTIALLY, PS NOT_VIEWED) |
| novih dejstev (trditve) | **+6** (5 DOCUMENTED, 1 CORROBORATED, 1 UNVERIFIED — vsota 7? NE: 6 = 4 DOCUMENTED + 1 CORROBORATED + 1 UNVERIFIED za šolo ni trditve) |
| novih povezav | entiteta→MVG-001 ×5; vir→sveti-vid ×1; trditve→viri ×5 (Commenda UNVERIFIED brez vezave); ArchiveRecord→fond ×2 |
| potrjeno | župnijska vez sv. Vid↔Podzemelj (primarno); matrike online 1669–1947; vpisi Griblje s hišnimi št. (04105 sken 20/100); PUA struktura + 5 lastnikov 1825; PUA/PS digitalizacija |
| ostaja raziskovalna sled | šolski list [4118864] (VAČ zahteva izkaznico); SA Podzemelj (čitalnica NŠAL); SI AS 749/3/8/12 (čitalnica); Karlina h. 25; Apfaltrer?; K…an Jožef h. 46; Commenda institucija; poln prepis PUA fol. 7–49; PS 143 strani |

**Regresija:** tsc/lint/tests/audit zelena; ničesar nismo izmišljali — vsa
negotova branja so v kuratorski vrsti ali opombah, ne v dejstvih.
