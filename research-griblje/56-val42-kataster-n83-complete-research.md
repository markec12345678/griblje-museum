# 42. val spletnega raziskovanja (TASK 94) — FRANCISCEJSKI KATASTER N83 GRIBLJE: DOKONČANA PRVA RAZISKOVALNA ZAPRTJA FONDA — vseh 11 preostalih enot digitaliziranih, prenešenih in (vsaj klasifikacijsko) prebranih · kritna karta A01 = »Gemeinde GRÜBLE in Illyrien« 1824/27 · cenilni elaborat = konskripcija 1830 (441 duš / 70 hiš / 102 družine — predbitno) · toponim »Schumsthal Traverne« = kvalificiran gostilniški signal na reambulacijskem listu A05 · popravek lažne izjave 41. vala o nedigitaliziranosti

*Muzej vasi Griblje · 94. sklop · 23. 9. 2026*

Zahtevek: TASK 94 — »FRANCISCEJSKI KATASTER N83 GRIBLJE, PREOSTALIH 11 ARHIVSKIH ENOT« (baseline 0c8cea4; RESEARCH-ONLY PASS najprej: ENUMERATE → LOCATE → ACCESS → READ → VALIDATE → EXTRACT → DECIDE; vgradnja šele po dokazu; N083PT ne obdeluj ponovno). Cilj: dokončati prvi primarni arhivski fond o vasi — ne zbirati čim več besedila.

## 0. Povzetek sodbe

**Vseh 11 preostalih enot fonda N83 JE DIGITALIZIRANIH** — izjava 41. vala, da »N083PUA/PV/PZ/A01–A05 niso digitalizirani (details brez file-povezave)«, je bila **napačna** (details strani grafičnih listov so bile v 41. valu vzet-ne pravilno; PG/PR/PS pa niso bile preverjene). Digitalizacije so tipološko dveh vrst: grafični listi kot **IIIF Presentation 3 slike** (docid 10 vsak), spisovne serije kot **LuraDocument PDF-ji** (docid 41778–41784). Muzej je prenesel vseh 5 kart (400 kB–1 MB JPEG, 2634–3010 px) in 20 strani spisovnega gradiva, izvedel 14 VLM branj (med njimi 3 osredotočene kontrolne prehode na kritičnih mestih) in ugotovil:

1. **Šest novih primarnih naslovnih potrditev forme GRÜBLE** (poleg PT iz 41. vala): PS, PR (tiskana!), PUA, PV, PZ, A01.
2. **Konskripcija 1830** (PZ §3): 222 moških + 219 žensk = **441 duš** v **70 hišah** in **102 družinah**; celotno prebivalstvo govori **slovensko**; poklici (1 tkalec, 9 kajžarjev, kovaška hiša); **mlin brez njiv** — najzgodnejši popisni pregled vasi v zbirki (številke = predbitna branja Kurrenta, 2:1 med tremi prehodi).
3. **Kritna karta A01** — prvi katastrski zemljevid vasi (izmera 1824, korekcije 1827), vas ob mejni Kolpi, rdeče parcelne številke, barvna (kolorirana).
4. **Gostilna pred 1898 (MVG-109)**: na reambulacijsko-branem listu A05 stoji ob zahodni meji k.o. rokopisni toponim, ki ga trije VLM prehodi dosledno berejo kot **»Schumsthal Traverne«** (Taferne/Traverne = gostilna) — **kvalificiran signal, NE dokaz** (branje orodij istega modela, ne paleograf; ni nalepka ob stavbi; PT 1825 Gattung brez gostilne; PZ §3 poklici brez Wirtha) → ostaja TO_COLLECT za specializiran prepis; v muzejske podatke NI vgrajeno.
5. **Negativni rezultati so rezultat**: gostilniških izrazov (Gasthaus, Wirtshaus, Schenke, Taferne, Krug, Wirt) ni v nobenem od prebranih delov 11 enot (razen zgoraj omenjenega toponima A05).

## B — Arhivska struktura (VAC node id / docid)

Fond: SI AS 176 Franciscejski kataster za Kranjsko, 1823–1869 → N Novomeška kresija (226589) → **N83 Griblje, k.o. (227663)** → grafični (227665) + spisovni (373412).

| Enota | VAC id | Tip | Naslov popisa | Digital | docid | Prebrano | Griblje dokaz | Muzejska vrednost |
|---|---|---|---|---|---|---|---|---|
| N083A01 | 227666 | Slika | list A01 | **DA** (IIIF P3) | 10 | ✓ VLM ×1 | naslov GRÜBLE, vas, Kolpa | P1 |
| N083A02 | 227668 | Slika | list A02 | **DA** (IIIF P3) | 10 | ✓ VLM ×1 | Grüble, St. Veit, meja držav | P1–P2 |
| N083A03 | 227670 | Slika | list A03 | **DA** (IIIF P3) | 10 | ✓ VLM ×1 | rob k.o., toponimi | P2 |
| N083A04 | 227671 | Slika | list A04 | **DA** (IIIF P3) | 10 | ✓ VLM ×1 | Adleschitz, toponimi | P2 |
| N083A05 | 227673 | Slika | list A05 | **DA** (IIIF P3) | 10 | ✓ VLM ×3 | vas ~50–60 hiš, **Traverne?** | P1 (signal) |
| N083PG | 373413 | Dokument | Skica | **DA** (PDF) | 41778 | ✓ VLM ×1 | Gemeinde Grüble, sosedje | P2 |
| N083PR | 373414 | Dokument | Opis meje | **DA** (PDF) | 41779 | ✓ VLM ×1 (4/4 str.) | **tiskana naslovnica GRÜBLE** | P1 |
| N083PS | 373415 | Dokument | Seznam zemljiških parcel | **DA** (PDF) | 41780 | ◐ vzorec (2/143) | naslovnica GRÜBLE, priimki | P1 |
| N083PT | 373416 | Dokument | Seznam stavbnih parcel | DA | 41781 | ✓ (41. val) | — (ne ponavljamo) | ✓ vgrajen |
| N083PUA | 373417 | Dokument | Abecedni seznam lastnikov | **DA** (PDF) | 41782 | ◐ vzorec (2/49) | naslov GRÜBLE | P1–P2 |
| N083PV | 373418 | Dokument | Izkaz rabe zemljišč | **DA** (PDF) | 41783 | ✓ VLM ×1 (1/1) | struktura tal ~1826 | P1 |
| N083PZ | 373419 | Dokument | Katastrski cenilni elaborat | **DA** (PDF) | 41784 | ◐ vzorec (2/71 + 3 kropa) | naslov + konskripcija 1830 | P1 |

Legenda: ✓ = celotno raziskovalno branje (vseh dosegeljivih strani serije za ta val); ◐ = strukturiran vzorec (serije prevelike za en val); VLM ×N = število neodvisnih prehodov.

## C — Grafični listi (Prioriteta A)

Dostop: VAC details → predogled-slika povezuje na TIFY → TIFY JS izpostavi `iiif/manifest?uodid=…&docid=10&seq=1` (IIIF Presentation 3, 1 canvas) → **raster URL je sejsko vezan**: UUID se generira vsakič znova z manifestom, zato morata biti manifest in raster pobrana v isti seji (`curl -c/-b jar.txt`). Meritve (px, JPEG): A01 2826×2273 (869 kB), A02 3010×2158 (1000 kB), A03 2645×2154 (458 kB), A04 2645×2158 (764 kB), A05 2634×2165 (399 kB).

- **A01 — kritna karta, list I.** Naslovna plošča: »Gemeinde **GRÜBLE** in Illyrien«, Kreis Neustadt, 1824; rdeča opomba o korekcijah meja septembra 1827; revizija in podpisa izmeriteljev (branja predbitna: »Vecchi«, »Revidirt …«). Vas Grüble z domačijami ob **Kolpi (državna meja)**; rdeče parcelne številke; kolorirano (bež njive, zelena travniki/gozdovi/dvorišča, modra reka). Toponimi (predbitno): na Lokavje?, na Kamennica, Žolant?, **Mali Vrh**, **Sušec**, Lahovišče?, Pod Gričlani?. Sosedje ob mejah (predbitno): Lahovišče, Radovica, Hrušica?, Metlika?. **Brez** oznak cerkve/gostilne/mlina na listu. Povezava s PT: parcelne številke karte so ista oštevilčenja, ki jih protokol izpisuje (formalno skladno; posamezne vezave niso preverjene — UNRESOLVED, geokodiranja ni).
- **A02 — reambulacijska Bezirksmappe (predbitno).** Napisi: »…Raumbulirungs Bezirksmappe«, »St.Veith als eine Obrigkeit«; robovi: KAISERLICH ÖSTERREICH (levo) / KÖNIGREICH CROATIEN (desno) = državni meji ob Kolpi. Toponimi: St Veit (s **cerkvenim simbolom**), Grüble, Rob?, Boškovići?, »Holo crik«? (nejasno). Brez gostilne/mlina.
- **A03** — večinoma prazen list; karta le na desnem tretjini; toponimi (predbitno): Na Stomoz?, Lubige?, »Na-Lukotschen-Brücke«?; velik mejni napis (predbitno, NEUJEMNO: »WEIDENDORF« / »WAUENDORF«). P2.
- **A04** — »Siehe die Reambulirungs-Beimappe«; mejni napis **ADLESCHITZ** (= Adlešiči); toponimi (predbitno): Šlatovič?, na Rebar?, Peran?, Bresnik?, Zibonik?, Na Lože?, »Schumski Damm«?; brez stavbnih oznak.
- **A05** — »Siehe die Reambulirungs-Beimappe«; **vas s ~50–60 hišami** (osrednji/vzhodni del lista); mejni napisi (NEUJEMNO branje robov: »WAUENDORF«?/»ADLEŠIČI«); **TOPIOM »Schumsthl Traverne«** (branje ×3: »Schamsho« / »Schimstl« / »Schumsthl« + »Traverne«) — glej F.

## D — Spisovne enote

- **PG Skica (1 str., 353 kB)** — obodris cele k.o.: »Gemeinde Grüble« + sosedje (predbitno: Thiasing?, Dullach?, Waischenberg?, Drulach?; »Dampfbach Grenze«?); merilo 1000 Klafter; podpis »Johann …«. Brez gostilne/mlina/cerkve. P2 (administrativno).
- **PR Opis meje (4 str., 994 kB)** — **tiskana naslovnica »Grenz-Beschreibung der Gemeinde „GRÜBLE“«** + rokopisna inventarna oznaka (Posl. N° 218). Kurrent besedilo 1825–26: potek meje po mejnih točkah z predstavniki sosednjih občin; predbitna branja omenjajo potoke (med njimi **Mlinščica**) in **mline kot mejne točke**; gostilniških izrazov ni (negativen zadetek 4/4). **Druga primarna potrditev Grüble (tiskana).** P1.
- **PS Protokol zemljiških parcel (143 str., 56,2 MB)** — **naslovnica »Protocol der Grund-Parzellen der Gemeinde „GRÜBLE“«** (rokopisna; tretja primarna potrditev). Kurrent tabela: št. okrožja, ime zemljišča (Denominatio), lastnik (ime, stan, prebivališče), vrsta kulture, areal (Joch/Klf.), bonitetni razred, čisti dohodek, kapitalska vrednost. Vzorčeni strani 1+3: priimki (predbitno) Piringer, Grilc/Grillitsch, **Kriechbaum** (Georg, Math., Maridl, Veit), **Malič** (Matho, Veit), Schellander, Brine/Bring, Millay, **Gemeinde** (občinski posek, parcela 19), Resig. Celoten prepis = obsežen specializiran projekt. P1.
- **PUA Abecedni seznam lastnikov (49 str., 6,5 MB)** — **tiskan naslov »Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde „GRÜBLE“«** (četrtja primarna potrditev). Prebrani naslovni strani (tabela še prazna); stebec imen od strani 3 naprej. Poklicnih oznak Wirt/Gastwirt v vzorcu ni (negativen zadetek). P1–P2.
- **PV Izkaz rabe zemljišč (1 str., 474 kB)** — **tiskani formular »AUSWEIS über die Benützungsart des Bodens der Gemeinde. Grüble«** (peta primarna potrditev). Predbitna branja: celota k.o. **1233 J 573 Klf (~710 ha)**; med kulturami travniki (76 J 1480 + 12 J 328 s sadnim drevjem), **gozd 556 J 263 (~320 ha ≈ 45 %)**, njive (branje vrstice neenotno), vodotoki 21 J 182, ceste 46 J 117, stavbna zemljišča 4 J 389. Gozd ≈ 45 % = naravoslovna korespondenca z Andrič 2007 (»pesek/glina, gozdnato do danes«) in Miklavčič 1965. Brez mlinov in gostiln (negativen zadetek). Vrstni podatk i so predbitni (vsota stolpcev v branju ni notranje konsistentna — ena ali dve številki sta zamenjani; specializiran prepis odloči). P1 (zemljiška struktura).
- **PZ Katastrski cenilni elaborat (71 str., 12,5 MB)** — **naslovni napis »CATASTRAL-SCHÄTZUNGS-ELABORAT … der Gemeinde Grüble«** z deželo Krain, Kreis Neustadtl, št. ocenjevalnega okrožja (šesta primarna potrditev). Uvodni del (§2 meje, §3 prebivalstvo) bran 3×:
  - **§3 Bevölkerung (konskripcija 1830)**: 222 M + 219 Ž = **441 duš** (prehodi 2+3 z vsotno kontrolo; 1. prehod je dobil 322/219/**541**) v **70 hišah** (2×70, 1×72) in **102 družinah** (3× konsistentno); celotno prebivalstvo govori **slovensko** (»Die gesammte Bevölkerung spricht Slowenisch« — predbitno).
  - **Poklici/objekti** (spodnji izsek, 2 prehoda): 44 revnih odvisnih kmetov?, 6?, 1 **Leinweber** (tkalec), **9 Häuslmacher** (kajžarji), **Schmiedhaus** (kovaška hiša), »9–10 Schäf…«?, **»… Mühle ohne Ackerland find[et sich]«** = mlin brez njiv (2 od 3 prehodov; v 1. prehodu vrstica pred Mühle nejasna — morda Wirth — po osredotočenem branju spodnjega izseka = **NEGATIVEN ZADETEK** za Wirth).
  - **§2 Gränzen**: branje zelo garbleno (»Balpa« = Kolpa; »Krasny«? ≈ Krašinec; »Weidenburg«?; »Trübosche«?) — sosedje ostajajo UNRESOLVED iz besedila; zanesljivejša je karta.
  - Šola: 1. prehod jebral »…mit einer Schule und 1 Lehrer« — v osredotočenih prehodih NI potrjeno → PREDBITNO/neodločeno.

## E — Kurrent (pravilo VLM ≠ primarni dokaz)

Upoštevano: VLM transkripcija ≠ primarni dokaz sam po sebi. Za vsako pomembno branje: shranjena slika + transkripcija (vlm-*.json) + označena predbitnost + 2–3 neodvisni prehodi na kritičnih mestih (A05 Traverne ×3; PZ številke ×3; PZ poklici z obrezanim izsekom ×2). Vsa branja priimkov/števil ostajajo **PREDBITNA** do specializiranega paleografskega prepisa; v muzejske zgodbe so vgrajena le z izrecno kvalifikacijo (»po preliminarnem branju rokopisa«), kot to dopušča vzorec PT iz 41. vala.

## F — Gostilna (poseben audit MVG-109)

Iskani izrazi na vseh prebranih straneh 11 enot: Gasthaus, Wirtshaus, Schenke, Wirt, Gastwirt, Tafern/Taferne, Taverne, Krug, Herberge (+ slovenske oblike, če se pojavijo).

| Enota | Zadetek | Kontekst |
|---|---|---|
| A01–A04 | NEGATIVEN ZADETEK | brez napisa na listih |
| A05 | **KVALIFICIRAN SIGNAL** | toponim **»Schumsthl Traverne«** (×3 konsistentna branja besede Traverne; prva beseda variira) ob zahodni meji k.o., **ni nalepka ob stavbi**; Traverne/Taferne = nekdani izraz za gostilno; možna razlaga: ime kraja po gostilni ALI nejasna branja (Kurrent). NEDOKAZANO → TO_COLLECT |
| PG | NEGATIVEN ZADETEK | skica meja brez objektov |
| PR | NEGATIVEN ZADETEK (4/4) | v besedilu meja ni gostilniških izrazov |
| PS | NEGATIVEN ZADETEK (vzorec 2/143) | — |
| PUA | NEGATIVEN ZADETEK (vzorec 2/49) | stebec imen še ni prebran |
| PV | NEGATIVEN ZADETEK (1/1) | — |
| PZ | NEGATIVEN ZADETEK (2/71; vrstica pred »Mühle« po obrezanem branju NE vsebuje Wirth) | — |

**Sodba:** vprašanje »gostilna pred 1898« ostaja **odprto**. Novo stanje: (a) PT 1825 Gattung brez gostilne (41. val), (b) PZ 1830 poklici brez Wirtha, (c) **A05 toponim Traverne** = najzgodnejši — a še nepotrjen — signal, ki ga je vredno specializirano preveriti (paleograf; tudi izprimček slike pošljenemu bralcu Kurrenta). Zapisovanje kot dejstvo NI dovoljeno (§7 pravilo VLM ≠ primarni dokaz; §9 NE »gostilne ni bilo«).

## G — Novi primarni dokazi (za muzej)

1. **A01 = prvi katastrski zemljevid vasi** (izmera 1824, korekcije 1827) — naslov s formo GRÜBLE; vas ob mejni Kolpi; kolorirana karta.
2. **PR naslovnica (tiskana) = drugi primarni dokument forme Grüble** (1825/26).
3. **PS/PUA/PV/PZ naslovi = 3.–6. primarna potrditev forme Grüble** — izjava 41. vala »prva (in edina) primarna potrditev« se obogatuje v »šest dokumentov fonda«.
4. **PZ §3 = najzgodnejši popisni pregled duš/hiš/družin vasi v zbirki** (konskripcija 1830; predbitna številka).
5. **PV = prvi kvantitativni pregled zemljiške strukture k.o.** (~1826; gozd ≈ 45 %).

## H — Negativni rezultati (dokumentirani)

| Iskanje | Metoda | Datum | Rezultat | Zakaj nerazrešeno | Naslednja pot |
|---|---|---|---|---|---|
| Raster A01 brez seje | curl (I ja prijava) | 23. 9. 2026 | VAČ HTML namesto JPEG | raster UUID je sejsko vezan | manifest+raster v isti seji ✓ (rešeno) |
| Gostilna v PR/PS/PUA/PV/PZ | VLM na prenešenih straneh | 23. 9. 2026 | NEGATIVEN ZADETEK (razen A05 signal) | serije PS/PUA/PZ le vzorčno | specializiran prepis |
| Sosedje k.o. iz besedil | VLM na PG §PZ §2 | 23. 9. 2026 | garbleno (Thiasing?/Weidenburg?/Krasny?) | Kurrent branje nestabilno | paleograf + primerjava s karto |
| Mejni napis »W…dorf« na A03/A05 | VLM ×2 | 23. 9. 2026 | branji si nasprotujeta (WEIDENDORF/WAUENDORF) | velike rokopisne črke ob robu | obrezani izseki + paleograf |
| N083A02–A05 vsebinska atribucija | VLM ×1 | 23. 9. 2026 | kateri deli k.o. in kateri vintage (krita vs. reambulacija) NEUJEMNO | naslovi delno odlomčeni | arhivska razjasnitev (SI AS popis) |

## I — Novi viri (vgrajeni, add-only)

6 novih virov na MVG-001 (vsak = ena arhivska enota = ena identiteta; dedup: ključi novo ustvarjeni, kolizij ni; sourceKey/canonicalUrl enolična):
- `franciscejski-kataster-n83-a01` (details?id=227666)
- `franciscejski-kataster-n83-pr` (details?id=373414)
- `franciscejski-kataster-n83-ps` (details?id=373415)
- `franciscejski-kataster-n83-pua` (details?id=373417)
- `franciscejski-kataster-n83-pv` (details?id=373418)
- `franciscejski-kataster-n83-pz` (details?id=373419)

Posodobljena opomba vira `franciscejski-kataster-n83-vas`: **popravek lažne izjave 41. vala** (»preostale enote čakajo digitalizacijo TO_COLLECT«) — vseh 12 enot je digitaliziranih; izpisani docid-i in mere. (Vzorec vala 17: dokazano napačno dejstvo se popravi, ne pusti stoje.)

Niso vgrajeni: A02–A05 kot samostojni viri (vsebinska atribucija predbitna/UNRESOLVED — števec se ne povečuje brez jasnene muzejske vrednosti, §10/§16). MVG-109 ni dobil novega vira (Traverne = nedokazan signal).

## J — Nova / posodobljena identiteta

- +6 identitet (distinct source-ključi na MVG-001): 463 → **469**.
- Deljeni viri: nespremenjeno (**67**). Identitete obstoječih entitet: nespremenjene.

## K — Predlog vgradnje (izveden)

- MVG-001: +6 virov (glej I), zgodba SL/EN +1 odstavek (fond dokončno digitaliziran; A01 prvi katastrski zemljevid; tiskana PR naslovnica; konskripcija 1830 z izrecno predbitnostjo; 6× Grüble), popravek opombe vira n83-vas.
- Konstante: 582→**588** (5 skript), 463→**469** (3 skripte); audit-entities sporočili na 42. val.
- **Ni vgrajeno** (predbitno): številka duš v zgodbi nosi kvalifikacijo; priimki iz PS; poklici iz PZ; toponimi z A01–A05; Traverne (samo ta raziskovalni dokument + worklog).

## L — Regresija (živi :3000 po reseedu)

tsc 0 · lint čist (BABEL nota o >500 kB museum-content = deoptimizacija stila) · verify-i18n **946 × 5** · audit-entities ✓ 0 napak (**113/588/469/67/375**; 95 entitet, 36 oseb; pokritost 82/113) · audit-timeline-map **39 ✓/0** · audit-iiif **5 ✓/0** (375 faz; 94+19) · test-entities **100 ✓/0** · test-timeline-map **72 ✓/0** · test-ai-curator **214 ✓/0** · red-team **157 ✓/0** · test-plan-visit **42 ✓/0** · OpenData **113/588** živo · sitemap **114** (brez novih zapisov).

**agent-browser:** MVG-001 — »zaokrožena do zadnje enote« + »441 duš« ✓, »kritna karta, list A01« + »Grenz-Beschreibung« + »Catastral-Schätzungs-Elaborat« ✓, VIRI (**17**) ✓, 7 × href vac.sjas.gov.si ✓; EN preklop (lang=en) »rounded off to the last unit« + »441 souls« ✓; hero 113/588 ✓; noga footBottom = pageH 7.872 (vrzel 0) ✓; 390 px: scrollWidth = 390, preliv 0 ✓; konzola čista (HMR/DevTools info) ✓; search »kataster« → MVG-001 (matchedIn: storySi) ✓.

## M — Odprta vprašanja

1. **Traverne** (A05): ali je toponim pričevanje o gostilni/taferni pred 1827 na zahodnem robu k.o.? → specializirana paleografija + primerjava z PS Denominatio stolpcem (143 str.).
2. **PS/PUA/PZ polni prepis** (143+49+71 str. Kurrenta): priimki, parcele, poklici — velik projekt (najeti transkriptor / projekt razpisa).
3. **Sosedje k.o. N83** v besedilu (PG/PZ §2) — garblena branja; rešitev: primerjava s kartami + ZRCS/ARS popisom k. o.
4. **A02–A05 vsebinska atribucija** (krita vs. reambulacijska karta, kateri deli k.o.) — arhivsko vprašanje na SI AS.
5. **PZ §3 šole** (»eine Schule und 1 Lehrer« v 1. prehodu, nepotrjeno) — če drži, je najzgodnejša omemba šolstva v vasi; preveriti na str. 2.
6. **Konskripcija 441 vs 541 duš** — specializirani prepis odloči.
7. **PV vsota stolpcev** ni notranje konsistentna v branju — preveriti tabelo.

## N — Naslednji arhivski kanal

- **SI AS 177–182** (katastri Štajerske/…) — sistematična enumeracija, ali kateri relevanten za Griblje (naročilo §15).
- **Leksikon 1937** (še nemoten TO_COLLECT — dLib seja izven peskovnika).
- **N083PT specializiran Kurrent prepis** (8 str.) — zdaj tudi z referenčnimi osebami iz PS/PUA.
- **Katastrska vezava A01 ↔ PT** (parcelne številke → domačije) — mozen temelj za prihodnjo (dokazano) povezavo zgodovinskih parcel z današnjim stanjem — brez geokodiranja na pamet (§6).

## Surovine (raw-web-val42-2026-10/)

vac-details-{11 id}.html (11 × details strani) · manifest-{5×A,6×PDF}.json (+ sejske kopije) · n083a-pages/ (5 JPEG + a05-2x, a05-west-3x, a05-traverne-4x) · n083p-pages/ (PG 1, PR 4, PV 1, PS 2, PUA 2, PZ 2 + pz2-bottom-4x, pz2-mid-4x) · vlm-{a01,a02,a03,a04,a05,a05-west,a05-traverne3,pg,pr,pv,ps,pua,pz,pz-s23,pz-occ,pz-num}.json (16) · jar.txt (seja) · ingest.py.
