# 116. val (101) — ISSUE #72: vsebina Iglič 2006 (prioriteta #4 — Miko Županič + Apfaltrerni 1903), Draganić ~1630 v dveh virih (§3), Vavpotičevi portreti družine Županič (prioriteta #2), Dular 1972 — 4. neodvisna potrditev

**Val:** 101 · **Issue:** #72 (RAZISKAVA — nove najdbe za Muzej Griblje, brez podvajanja) · **Datum:** 29. 9. 2026
**Metoda:** 0 VLM klicev, 0 spletnega iskanja (kvoti 429 — vzorec vals 98–100); oba vira javno dostopna brez prijave (physics.fe.uni-lj.si HTTP 200; etno-muzej.si HTTP 200); polno besedilo obeh PDF ohranjeno kot artefakt z sha256
**Pravilo ne-podvajanja:** rg kontrola pred vgradnjo — `NikoZupanic|Erdödy|podzemljska|Draganić|Pusti gradec` = 0 zadetkov v src/lib; »Apfaltrer« = 6 obstoječih zadetkov (val 97: grajščina Pobrežje do 1904 na MVG-018) — trditev o ponudbi nakupa 1903 NI pokrita; veriga #100 §8 nespremenjena.

---

## 1. Kontekst — izbira točke

VLM kvota je po val 98 še vedno trdo 429 (dnevna; sonda pred valom), tudi spletno iskanje je 429 → vse VLM-odvisne točke (86b del 3, re-readi 7+2, PZ p48–65, PT p7 @300dpi, PR Grenz-Beschreibung) ostajajo resumable. Iz števca »Naslednje« vala 100 izbrana edina razred točk, ki jih je mogoče izvesti v peskovniku: **točke issue #72, katerih viri so javno dostopni brez prijave**.

Dve taki točki sta bili odprtini že v samem issue #72:

- **§1 / prioriteta #4** — Miko Županič + Apfaltrerni 1903: vir Aleš Iglič (2006) z izrecnim URL `https://physics.fe.uni-lj.si/members/iglic/history/NikoZupanic.pdf`. Repoitorsko kazalo virov (01-vas-griblje-zgodovina.md) ga vodi kot brezplačen PDF z **visoko prioriteto**; vsebina doslej NEVGRADJENA (v src/data ni nobenega vira `iglic`).
- **§3** — Draganić ~1630 (Vurnik 1936): vir z izrecnim URL `https://www.etno-muzej.si/files/etnolog/pdf/etnolog_8_9_1936_vurnik_belokranjica.pdf`; trditev doslej NE v muzeju.

## 2. Omejitve peskovnika (deterministično dokumentirane)

| Portal | Status | Pomen |
|---|---|---|
| physics.fe.uni-lj.si (Iglič 2006) | **200** (582 kB, 11 str.) | celoten §1/prioriteta #4 |
| etno-muzej.si (Vurnik 1936) | **200** (1,16 MB) | celoten §3 |
| VLM API (chat.completions.createVision) | **429** | 86b del 3, re-readi, PZ/PT/PR — resumable |
| web_search | **429** | potrditev bibliografske oznake revije prek iskanja NEIZVEDLJIVA |

**Bibliografska oznaka Igličevega članka (pošteno):** sam PDF nima založniške oznake (naslovnica besedila brez kolofona; PDF meta: »etnolog_kette_zupanic.doc«, ustvarjen 28. 2. 2006). Oznako »Traditiones 35/1 (2006), str. 247–255« prenašamo **po repozitorskem kazalu virov** (01-vas-griblje-zgodovina.md vodi URL `TR351 247-255 Iglic.pdf` kot »Iglič (Traditiones 2006)«) — v samem PDF ne potrjena, s spletnim iskanjem trenutno ne preverljiva. Izrecna iskrena opomba v viru.

## 3. Iglič 2006 — vsebina (VERIFIED po prebranem PDF)

Članek: Aleš Iglič, »Ob 130 letnici rojstva slovenskega etnologa, antropologa, zgodovinarja in diplomata dr. Nika Zupaniča (1876-1961)«, 11 strani, s spominom Nika Zupaniča na Ketteja (spisano 1950).

### 3a. Miko Županič — točke iz issue #72 §1 vse POTRJENE dobesedno (str. 1–2)

> »Oče Nika Zupaniča, Miko Zupanič (1841-1911), posestnik, trgovec ter gostilničar iz Gribelj v Beli krajini, je v zadnjem desetletju 19. stoletja s posojanjem denarja postal zelo premožen. Tako so mu bile med drugim leta 1903 v nakup posestva z gradovi baronov Apfaltrernov (Krupa, Pobrežje, Pusti gradec). Za nakup pa se ni odločil, ker ni imel smisla za velike finančne transakcije. Ugodne gmotne razmere Mika Zupaniča so Niku Zupaniču omogočile študij.«

**Trije NOVI podatki nad issue #72:**
1. **razlog zavrnitve** nakupa 1903 — »ker ni imel smisla za velike finančne transakcije«;
2. **gmotne razmere so omogočile Nikov študij** — ekonomski temelj celotne življenjske poti svetovljana iz Gribelj;
3. **vinska kriza** — »Ko pa je oče zaradi vinske krize izgubil precejšen del premoženja, je Zupanič v skladu z njegovim nasvetom leta 1906 za nekaj mesecev sprejel službo študijskega prefekta v Terezijanski gimnaziji na Dunaju.« Vinogradniška pokrajina je z vinsko krizo izgubila svojega najbogatejšega gospodarja — nova kapitola gospodarske zgodbe vasi.

Plus likovni dokument: **Slika 1 — Miko Zupanič (1841–1911), relief kiparja A. Repiča** (original TO_COLLECT).

### 3b. Draganić ~1630 — §3 s konkretnim mehanizmom (str. 1)

> »Njegovi predniki so se preselili iz Draganičev v Belo krajino leta 1630. Tega leta so namreč Draganiće, ki so imeli svobodno občino še iz srednjega veka, napadli in oropali grofje Erdödy. Nekateri svobodnjaki iz Draganićev, med njimi tudi Zupaniči, so se takrat umaknili na Kranjsko, v podzemljsko župnijo.«

NOVO glede na Vurnika 1936: razlog (Erdödyjev napad) + cilj (»podzemljska župnija« — stik s Podzemljem ohranjen tudi v Nikovi ljudski šoli 1884–1887, MVG-010 zgodba).

### 3c. Vavpotičevi portreti družine Županič — prioriteta #2 PRVIČ KONKRETNA

Iz navedb slik v članku:
- **Slika 2** — Katarina Zupanič (1855–1921), mati Nika; portret v naravni velikosti I. Vavpotiča; **hrani Belokranjski muzej (darilo dr. N. Zupaniča)**;
- **Slika 3** — »Minister dr. Niko Zupanič«; portret v naravni velikosti I. Vavpotiča iz leta 1924; **hrani Belokranjski muzej (darilo dr. N. Zupaniča)**;
- **Slika 5** — prva soproga Helena Papp Zupanič, portret I. Vavpotiča (iz zbirke Veronika Zupanič Kralj);
- **Slika 6** — hčerka dr. Nika Zupaniča s psom Kaletom, portret I. Vavpotiča (iz zbirke Veronika Zupanič Kralj);
- **Slika 7** — Dragotin Kette, olje I. Vavpotiča naslikano **po naročilu dr. Nika Zupaniča leta 1940**; pred Nemci rešila Veronika Zupanič Kralj.

Iskani nalogi iz issue #72 (§2/prioriteta #2: »konkretne Vavpotičeve/Gasparijeve podobe Gribelj«) je ta val dodal konkretne dokaze o Vavpotičevih delih, povezanih z Griblji: **portreti rojenih v Gribljih in njihovih najbližjih**, dva v zbirki Belokranjskega muzeja. Današnja lokacija/stanje del v BM zbirki = TO_COLLECT; upodobitev iz članka NE vnašamo kot digitalne predmete (avtorske pravice; vsebina reprodukcij ni dostopna).

### 3d. Kette — spomini 1950 (dopolnitev SBL sošolstva)

Nikovi spomini na Ketteja (»spisano l. 1950«): prijateljstvo od jeseni 1896 do spomladi 1899; »od jeseni 1896 do poletja 1897 … tesna prijatelja in študijska tovariša. Kette je obiskoval VII. razred, Zupanič pa VIII. razred realne gimnazije v Novem mestu«; zadnje srečanje »nekako sredi marca« 1899 v Ljubljani — Zupanič na poti z Dunaja »v Belo Krajino na velikonočne počitnice«. (SBL že omenja sošolstvo z Kettejem; članek dokazuje OSEBNO prijateljstvo in natančno zadnje srečanje.)

### 3e. Dular 1972 — 4. neodvisna bibliografska potrditev (§2/prioriteta #1)

Viri članka, št. 4:
> »Dr. Niko Zupanič, ob okritju njegove spominske plošče v Gribljah v Beli krajini, urednik: Dular J., 1-54, Belokranjsko muzejsko društvo v Metliki, ČGP Delo, Ljubljana, 1972.«

Po val 97 (3 katalogi: Google Books, NUK, SEM) zdaj **4. neodvisna potrditev iz literature** + dopolnitev **soizdajatelj ČGP Delo, Ljubljana**. CONFLICT 1972 (bibliografsko leto knjižice) vs 1973 (odkritje po občinskem registru) ostaja **UNRESOLVED** — neskladja nič ne razrešuje (knjižica še vedno TO_COLLECT).

## 4. Vurnik 1936 — vsebina (VERIFIED po prebranem PDF)

Stane Vurnik: »Belokranjica«, Etnolog 8/9 (1936) — URL izrecno podan v issue #72 §3. Članek opisuje predstavitveno sliko belokranjske noše: »Catharine Županič, de Griblje« — **matere ministra dr. Nika Županiča (1855–1921) — v narodni noši, ki so jo nosile žene podzemeljsko-metliške župnije** (francoski del: »paroisse de Podzemelj«; slovenski: »v podzemeljsko-metliškem polju«).

**Opomba 2 (migracijska) — EXACT trditev iz issue §3:**
> »V gradu Pobrežje pri Adlešičih so živeli Lenkovići iz Like; v Gradcu Gusiči prav tako Ličani po poreklu; na Svibniku pri Črnomlju in v Gribljah žive še danes Kukarji; na Vranovičah in v Gradcu Beličiči, Županiči, Šimuniči, Pašiči itd., ki so zelo verjetno prišli okr. 1630. iz Draganića pri Karlovcu.«

NOVO nad issue: **Lenkovići (Pobrežje) in Gusiči (Gradac) iz Like** — poreklo dveh graščinskih rodov ob Kolpi v isti opombi, kar migracijski kontekst raztegne tudi na graščinsko stran reke. Izraz »zelo verjetno« prenašamo kakor napisano — **migracijska sled, ne dokazano dejstvo** (issue pravilo: »Ne obravnavati kot absolutno dokazano dejstvo«).

## 5. Vgradnja (add-only, brez podvajanja)

| Vrstica | Sprememba |
|---|---|
| MVG-010 (niko-zupanic) | + vir `iglic-2006-niko-zupanic` (note sl+en s polnimi odlomki: Miko, vinska kriza, Draganić, Vavpotičevi portreti, Dular 4. potrditev, iskrena bibliografska opomba) |
| MVG-010 | + citat `vurnik-1936-belokranjica` (noša Katarine Županič, migracijska opomba) |
| MVG-004 (uskoki-in-vojna-krajina) | + citat `vurnik-1936-belokranjica` (Draganić ~1630 = del istega premika kot prišverki) |
| `dular-1972-zupanic` | note sl+en: + 4. neodvisna potrditev (Iglič 2006, vir št. 4) + soizdajatelj ČGP Delo |
| MVG-010 zgodba sl+en | + odstavek: gospodarska podoba očeta + vinska kriza + Draganić + Vavpotičevi portreti + Kette spomini |
| MVG-004 zgodba sl+en | + odstavek: Draganić ~1630 (Vurnik citat + Iglič mehanizem + pošten »zelo verjetno«) |

**Izrecen prehod števcev:** +0 zapisov (114) / +3 citati (625 → 628: +2 nova vira na MVG-010 + 1 citat deljenega vurnik na MVG-004) / +2 identiteti (502 → 504) / **deljenih 68 → 69** (vurnik zdaj citiran na 2 zapisih). readme-sync zeleno. ATLAS §22 NEIZMENJAN (uvedba gre v muzejsko zbirko, ne v ATLAS registre); veriga #100 §8 NEIZMENJANA (F0000212 = št. 73 ostaja INFERRED).

## 6. Poštenost / fairness

- »zelo verjetno« (Vurnik 1936) in Igličeva 2006 navedba se prenašata v izvirnem predlogu — migracija Draganić ~1630 NI dvignjena na dejstvo; arhivska potrditev TO_COLLECT (prioriteta #3 ostaja odprta).
- Vavpotičevi portreti: hramba v BM **po navedbi članka 2006** — današnje stanje zbirke TO_COLLECT; upodobitve niso vnešene.
- Bibliografska oznaka revije (Traditiones 35/1) pošteno označena kot navedba po repozitorskem kazalu, ne iz PDF.
- Relief A. Repiča: samo sled iz članka (original TO_COLLECT).
- Nič ne dvignjeno v identitetni verigi #100; ATLAS §22 nespremenjen.

## 7. Naslednje

- 86b del 3 (p110–142, ~250 tile-ov) ob VLM kvoti; re-read 7+2 fresh markerjev; PZ p48–65; PT p7 @300dpi; PR Grenz-Beschreibung (razrešitev F-PZ-05 + F-A05-03).
- Izven peskovnika: eSDE/RESCLJ (#72); SEM dokumentacija (avtor/datum F0000212 + fond 1930); Muršič–Hudelja 2009 vsebina (FFLJ/MKL); 2. izmera/eZKN; ZK vpisi; Rektifikacijski protokol (F-PZ-04).
- Iz issue #72 še odprto: vsebina Dularjeve knjižice 1972 (CONFLICT plošče); arhivska potrditev Draganić ~1630 (prioriteta #3); današnje stanje BM zbirke (Vavpotičevi portreti) — TO_COLLECT.

## Artefakti (research-griblje/val101/)

`iglic2006.pdf` (582 kB, sha256 2269b417…) · `iglic2006-fulltext.txt` (d4420fdb…) · `vurnik1936.pdf` (1,16 MB, 45744277…) · `vurnik1936.txt` (9ed3c9e5…) · `sha256.txt` · `insert-stories.py` (vstavljanje odstavkov, pouk val 97: literal \n\n) · `summary.json` (celotna dokumentacija s sha256)
