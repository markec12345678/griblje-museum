# 63. val (50. val raziskave) — TOPONIM »RIM« NA A01–A05: SISTEMATIČNO ISKANJE (2026-09-24)

**Naročilo:** backlog P1 iz 45./46. vala — »Rim na A01–A05 (obstoječe surovine)«.
KL 1937 (58-val44): »K Gribljam (bivši občini) spadata tudi **dve samotni
Grabrijanovi hiši, imenovani Rim**, ki se nahajata bolj v steljnikih e blizu
Fučkovcev« — status UNRESOLVED/PRELIMINARY, kanal: k.u.-k. zemljevid A01–A05.
Vseh 5 grafičnih listov je že prenešenih (42. val, IIIF raster, seja-vezan
prenos) — ta val: sistematično VLM iskanje toponima na obstoječih surovinah.

---

## A — METODA

- Surovine: `raw-web-val42-2026-10/n083a-pages/` — a01.jpg (A01, 2826×2273),
  a227668.jpg (A02, 3010×2158), a227670.jpg (A03, 2645×2154), a227671.jpg
  (A04, 2645×2158), a227673.jpg (A05, 2634×2165) + povečave a05-2x,
  a05-west-3x, a05-traverne-4x.
- VLM prompt: popis VSEH krajevnih imen/toponimov + ciljno iskanje
  »Rim/Rimb/Rymb«, »Fučkovci/Futschkofen/Fukowcz«, »Stelnik/Stelzn«,
  »Grabrijan/Grabrian«; za vsak napis črkovanje + pozicija + vrsta.
- 6 VLM klicev (A01, A02, A03, A04, A05, A05-west 3×); odgovori v /tmp in
  surovine zabeležene v tem dokumentu.

## B — REZULTATI PO LISTIH (vse branja PRELIMINARNA — VLM, glej železno pravilo)

| list | najdeni toponimi (preliminarno) | Rim | Fučkovci | Stelnik | Grabrijan |
|---|---|---|---|---|---|
| **A01** (naslovnica + Zahod) | Grüble, Zohlant, na Logarje, na Rameniga, Malcosti Vechor, Loharst, Polj Griblana, Lubschock, Neznak, Dolga vas | **ni** | ni | ni | ni |
| **A02** (St. Veit + meja) | St. Veith, Grüble, Boschonschitz?, Robav?, V Dollye, Na Drugi, Holo cziach, Pod Schatuligey, Golowinigoze, Pre clauden Weide, Schaze, Sifurica | **ni** | ni | ni | ni |
| **A03** (rob k.o., Weidendorf) | Weidendorf, Waldli Cr., **Na Stelnig/Stelzn** (vzh. meja), Grüble, na Borli, Lubige, Na-Lubigischen-Brücke | **ni** | ni | **DA (vzhod)** | ni |
| **A04** (meja Adlešiči) | Schulatowitz?, na Reban, Peran, Golcuna, Žeravž, Mali goren, na Bište, Bresnik, **Stelnik** (JV od Bresnika, SZ od ADLESCHITZ), WEIDENDORF, Schumacher Damm?, na Lose, ADLESCHITZ, na Breze | **ni** | ni | **DA (jug)** | ni |
| **A05** (vas) | Pri Janbovičih, **Schumsthal + Travern** (potrditev 42. vala), Vratarschüttä?, Na Prago Zdolcg?, **Stelze Wandlarnow** (vzh. rob); sosedje WAUDENDORF + ADLESCHITTEN | **ni** | ni | (»Stelze«) | ni |
| **A05-west 3×** | WAUDENDORF + Kurrent zapis »Schimsch[?] Travi 1826« (traverna); drobni napisi parcel nečitljivi | **ni** | ni | ni | ni |

## C — SKLEP (po železnem pravilu)

1. **Rim: NEGATIVEN ZADETEK na vseh 5 listih** pri dosegljivi ločljivosti.
   Negativni zadetek **ni dokaz odsotnosti**: baza IIIF (2645–3010 px širine za
   cel list) ne premore drobnih parcelnih napisov — že 3× povečava zahodnega
   dela A05 pokaže »nečitljivi« lastniški zapisi. Polno ločljivostni
   kvadrantni pregled zahteva sveže seja-vezane IIIF rastre (arhiv.si trenutno
   nedosegljiv iz peskovnika — 000).
2. **Korooboracija »steljnikov«: 3 neodvisni sledi toponima Steln-/Stelz-**
   (A03 vzhodna meja, A04 jug — med Bresnikom in ADLESCHITZ, A05 vzhodni rob).
   KL 1937 postavlja Rim »v steljnikih« — družina Steln- toponimov na listih
   k.o. N83 obstaja (preliminarno), kar skladno oriše kandidatsko območje.
3. **Grabrijan:** priimek **ni** v PUA 1825 prepisu (97 vpisov) niti med
   berljivimi napis listov; v 1937 (KL) sta hiši »Grabrijanovi« — priimek se
   torej pojavlja šele v sodobnih virih (Boris Grabrijan, križevo 2017–2019,
   že v zbirki MVG-087). 1825→1937 vez za hiši Rim ostaja NEPOVEZANA.
4. **Fučkovci:** zaselek Dragatuša — zunaj k.o. N83, pričakovano ni na listih;
   omenjen je samo kot smer (»blizu Fučkovcev«).
5. **Vgradnja: +0 trditev** (vse branja preliminarna, negativni zadetek ≠
   dokaz); Rim ostaja **UNRESOLVED** → novo kuratorsko vprašanje **P2-E13**
   (poglavitno iskanje: seja-vezani IIIF rastri v polni ločljivosti, kvadranti
   A04-jug + A03-vzhod + A05-vzhod ob kandidatskem »Stelnik« pasu; preveriti
   tudi indeks parcel PUA: hiše brez priimka/kot skupna lastvina).

## D — INVENTAR

- Kanali: 6 VLM klicev na 5 obstoječih rastrov + 1 povečava; **+0 virov,
  +0 entitet, +0 trditev, +0 povezav** (dokumentacijski val).
- Nova kuratorska vrsta: **P2-E13** (Rim — potrditev toponima in obeh hiš).
- Stanje zbirke: **113 zapisov / 589 virov / 469 identitet** (nespremenjeno).
- Potrjeno mimo: Schumsthal + Travern (42. val) ponovno prebrana na A05.
