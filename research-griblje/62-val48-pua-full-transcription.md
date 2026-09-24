# 62. val (48. val vsebine) — PUA N83: CELOTNI PREPIS ABECEDNEGA SEZNAMA LASTNIKOV (2026-09-24)

**Nadaljevanje 47. vala** (prenos vseh 49 strani + preliminarno branje fol. 3–6/20) →
48. val: branje strani za stranjo, prepis vpisov z navedbami strani, novelizacija
kuratorske vrste. Ta dokumentacija je dopisana v 49. valu skupaj z **reševalnim
branjem** dveh okrnjenih strani (p26, p42).

---

## A — PREPIS: 47 OD 49 STRANI, 97 VPISOV, 70 HIŠ, 5 SEKCIJ

- Prenos: `/vac/util/pdfPageImage?uodid=373417&docid=41782&page=1…49`
  (v 47. valu); surovine v `raw-web-val48-2026-10/n83-pua-pages/` (52 datotek =
  49 strani + 3 popravke `-recovered`).
- **Prebrano 47/49 strani** (strani za stranjo, Kurrent): **devetindevetdeset
  vpisov, sedemdeset hiš, pet sekcij (I–V)**, register zaključen in podpisan 1825
  (datum »10. … 1825« — mesec nestabilno → P3-E12).
- Struktura vpisa (kot v 47. valu): Fortlaufende Nummer · Bezeichnung der
  Section · Haus No. · Des Eigenthümers Name Stand und Wohnort · Anmerkung.

## B — KLJUČNE UGOTOVITVE (stabilna branja → vgrajena z navedbo strani)

- **Brinci na h. 23/24/26/28/65** — Matija, Mihael, Janez, Miha, Marko; skladno
  z zaselkom Brinsko selo (priimek v imenu zaselka).
- **h. 25: »Brincz Michl Bauerin«** — branje »Karlina?« iz 47. vala opuščeno
  (nestabilno); Bauerin = vdova/ženska gospodinja. Vdovski vzorec potrjen še na
  h. 16 in 61 Frillak, h. 2 Hlibetz, h. 6 Hahitsch.
- **Plemiči:** »Baron Apfaltrer« (Section G pri vpisu h. 23, p03) + ločen vpis
  »Husitsch Baron von Gradac« s parcelama III 748/777 (Nro. 20, p11). Branje
  »Adlstorfer?« iz 47. vala opuščeno.
- **Institucionalni lastniki:** »Commenda Tahern unde.« (Nro. 9, brez hišne št.,
  obsežen sklop Section V, p06) — identiteta ustanove (Malteška komenda?
  Religionsfonds?) še odprta → P2-E9; cerkev »St. Veith«, filialna cerkev,
  »Gemeinschaftliche Waldweide« (skupna gozdna paša), k. k. carinski urad.
- **Sosednje vasi v registru:** Dragoša (Dragosche), Wiedendorf, Kerquitsche,
  Krasinec — lastnine prek meja k.o.
- **Socialna lestvica:** Bauer ob Söllner (kežarji); h. 46: »Ribetitsch? Jožefa?
  Söllner von Grübln« (p20) — status Söllner stabilen, priimek ne → novelizirano
  P2-E11 (staro branje »K…an Jožef« opuščeno).
- **Zaključek (p48/p49):** dolgi seznami parcel po sekcijah I–V »… in der
  Gemeinde Grüble« brez imen lastnikov (skupna/nerazdeljena zemlja?) + vpis
  »F. Kirch« (Nro. 97, parcela V 2700) → novo P3-E12.

## C — OKRNJENE STRANI: 5 NEPOPOLNIH PRENOSOV, 3 POPRAVKI, 2 REŠEVANJA

- Sken po JPEG zaključnem markerju (`ff d9`): **nepopolni originali p26, p27,
  p29, p40, p42** (odrezani med prenosom — velikosti 17–107 kB proti normalnim
  ~80–122 kB).
- Popravki iz 47./48. vala: **p27-recovered, p29-recovered, p40-recovered**
  (celotni, drugačen encoder — JFIF 1.01; re-render, metoda ni dokumentirana).
- **Ostaneta p26 + p42** (brez popolne verzije) → P3-E12 (ponovni prenos, ko bo
  dostop do arhiv.si delujoč).

## D — REŠEVALNO BRANJE p26 + p42 (PIL + VLM, 49. val)

- Metoda: `PIL ImageFile.LOAD_TRUNCATED_IMAGES = True` → dekodiranje nepopolnega
  JPEG; re-encode (q92) → VLM branje rešenih verzij. Rezultat: **obe strani =
  naslovni bloki** tiskane glave registra:
  - p26: glava »Alphabetisches Verzeichniß / Der Grund Eigenthümer und ihrer
    nach Sectionen abgetheilten Grund Parzellen«, polja Land/Bezirk/Kreise/
    Gemeinde prazna, desno zgoraj oznaka (berljiva kot »V T«);
  - p42: ista glava, desno zgoraj **»VI«**; telo strani pod rezom pokrito
    (sivo) pri obeh.
- **Sklep (po železnem pravilu):** na vidnem delu **ni nobenega vpisa** — toda
  teles pod rezom **ni mogoče potrditi**, zato vpisov s teh strani **ne
  vgrajujemo**; status ostaja »okrnjeni original, čaka ponovni prenos« (P3-E12).
  Če sta p26/p42 res naslovni strani podpoglavij registra (strukturno verjetno:
  rimske oznake na glavi), so z vpisi drugih 47 strani vsi vsebinsko vpisi
  pokriti — to bo potrdil ponovni prenos.
- Vpis v vsebino: zgodbica Griblje-vas (SI+EN) dobi reševalno ugotovitev;
  P3-E12 novelizirana z izvidom.

## E — VGRADNJA (48. + 49. val)

- `src/lib/museum-content.ts`: zgodbica Griblje-vas (SI+EN) — celotni prepis z
  navedbami strani, vdovski vzorec, plemiči, ustanove, Söllner/Bauer; reševalna
  ugotovitev o p26/p42.
- `src/lib/entities.ts`: novelizirana P2-E8 (Bauerin), P2-E9 (Commenda Tahern
  unde.), P3-E10/11 (Apfaltrer/Gradac, Ribetitsch Söllner); **novo P3-E12**
  (zaključni seznam p48/p49 + F. Kirch + ponovni prenos p26/p42 + izvid
  reševalnega branja).
- Surovine: `raw-web-val48-2026-10/n83-pua-pages/` (52 datotek) — pushed v
  d4cde6d; vsebina (lib) merged prek PR #32; ta dokumentacija + reševalno
  branje = 49. val.

## F — STATUS / INVENTAR

- Stanje zbirke: **113 zapisov / 589 virov / 469 identitet** (nespremenjeno od
  47. vala — 48. val je prepis obstoječega dokumenta, brez novih virov).
- Kuratorska vrsta: **133 vprašanj** (P1–P3); od tega P3-E12 = p48/49 + p26/p42.
- Naslednje po prioriteti (iz 45./46. vala, nespremenjeno): P1★ šolski list
  [4118864] (dostopen le registrirani izkaznici VAČ — zaprt za sejo, glej
  61-val47 razdelek A), P1★ Status animarum Podzemelj 1850–1890 (čitalnica
  NŠAL), P1 SI AS 749/3/8/12 izpisek parcel 1851 (čitalnica), P1 Rim na A01–A05
  (obstoječe surovine), P2 SI AS 175 »Grible 1771«, P2 Kronika 57/3 (2009),
  P2 ZRSŠ podružnica 1970–82 [747512].
