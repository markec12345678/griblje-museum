# 143 — Val 120: 2. OČI KONTROLA VZORCA PS IMENSKEGA PASSA (NR-14) — slepa branja 14 strani / 283 vrstic

**Datum:** 2026-10-05 · **Issue:** #42 §4/§14 (+ #72 vrsta) · **Obseg:** vzorčna neodvisna kontrola comitane imenske plasti (v118 + v119, p17–p55) po zaključku PS imenskega passa — rešitev točke 3 protokola 142 §8 (»VLM-subagent 2. oči kontrola vzorca (NR-14)«) · **Status:** raziskovalni val — **register.json + runtime podatki NESPREMENJENI (§22)**; 0 VLM klicev.

---

## 1. Vzorec in metoda

**Vzorec (deterministično):** prva + zadnja stran vsakega imenskega batcha — p17/19 (v118), p20/25 (del 1), p26/31 (del 2a), p32/37 (del 2b), p38/43 (del 2c), p44/49 (del 2d), p50/55 (del 2e) = **14 strani, 283 register vrstic (~36 % imenske plasti 791)**.

**Slepota:** bralci do primerjave NISMO videli nobene vrednosti registra vzorca (register.json do build-compare ni naložen). Izrezki: DUO pasovi X 150–1010 (parzelle + haus + ime + stand + wohnort + kultur + vrednosti), zoom ×3, 7 vrstic/segment, rdeče oznake rK — `make-dual-v120.py` (43 segmentov). Mreža: PIN_TOP0 — p44/49/50/55 = komitane konstante (del 2d-x3 / del 2e); p17–p43 = vizualna kalibracija na cal-zoomih (rdeča TOP0 linija + tiskana parzella; formula PARZ_START = 281 + (pg−17)·20, potrjena na 10 straneh). Vsi segmenti vizualno verificirani (seg0 + rep).

**Sub-agenti = pixel-slepi:** Task sub-agenti v tem peskovniku ne dobijo sliknih pikslov (Read vrne »images are not available«) — metoda adaptirana: **slepa branja v glavni seji z agentovim vidom** (isti kanal kot val 118/119; 0 VLM klicev). Slepota ohranjena (F-OCI-01).

## 2. Rezultat (build-compare-v120.py + build-analysis-v120.py → comparison.json + analysis-v1.json)

| plast | eksaktno | variantno | neujemljivo | komentar |
|---|---|---|---|---|
| tiskane parzelle | **213** | — | 46 | odstopanja = pisarjevi rokopisni »~1014/15/16« zapisi (p55) + robni odrezki |
| haus številke | **149** | — | 86 (+29 NA) | večina = bralski digit-zumor (5↔8, 2↔9); hause poravnajo 1:1 po remapu |
| klafter (po remapu) | **112** | 49 (1 digit) | 61 + 40 empty | glej F-OCI-04/05 |
| imena | 12 | 54 (sim ≥ 0.7) | 198 | **~90 % = transkripcijske variante istega črnila** (F-OCI-03) |
| prečrtanja | 3 AGREE | — | 31 DIFF | obravnavano v F-OCI-05/06 |

## 3. Najdbe (F-OCI-01..06)

- **F-OCI-01 (DOCUMENTED):** sub-agenti pixel-slepi → 2. oči izvedena kot slepa branja v glavni seji (0 VLM); slepota ohranjena.
- **F-OCI-02 (CONFIRMED):** **struktura 100 %** — parzelle sekvence, št. vrstic 14/14, p49 specialke nezavisno potrjene (F2 preklicana 923 »Heide Marko.« ✓; polpas 929½ brez imena + kl 97 prečrtan ✓; Fürtrag 7|107x ✓; r21 brez črnila = fantom »Ploner Franzigen« resničen ✓); p25/p26 rdeče prečrtane parzelle (445/446/458/459/461–465) vidne in skladne z register preklicnimi flagi.
- **F-OCI-03 (DOCUMENTED):** imenska razhajanja so **transkripcijske variante istega črnila** — Kurrent loparski pari: Christan↔Vereichan, Husitsch↔Huisded, Rödig/Pöching↔Pavingz, Bruckler↔Stubler, Schimetz↔Schimay, Tillach/Ulrich↔Ublich, Krischan↔Vereichan, Schaffschick↔Schabuschnig, Tallafschibek/Stallpschibek↔Schapschitik, Weinchan↔Vereichan, Pessing↔Pavingz, Kranvel↔Kraus, Müller/Müllner↔Milleg, Hladnikhar↔Hlabubschar, Michelkorn/Mullerkorn↔Skabulschar/Matubuschik, Hnall↔Kraull, Stangl↔Kraufs, Hoch↔Schelle, Wächter↔Ublich … Pri pas-zoomu ×3 črkovalnica NI sodljiva — za to celicni zoomi (kot v118/v119). **Imenska plast registra ostaja.**
- **F-OCI-04 (DOCUMENTED):** **bralski indeksni zdrsi na mejah segmentov** — p55 seg1 (+1), p37 seg1/seg2 (+1), p31 seg1 (+1 vrednosti), p49 seg1 (+1): bralec po napačnem sidranju zgornjega robnega odrezka prestevil bands. Zaznano prek vrednostne eksaktnosti (857/769/763/831/777/703 @p55; 31/32/342/59/232 @p37; 24/27/378/292 @p31 = register r+1) in tiskanih parzell. **Po remapu (24 vrstic) je register vsehod poravnan 1:1 s tiskanimi parzellami.** Precedent: del 2d-x2 »x2 knjigovodski zdrsi« (protokol 140 §5). Učenje: robni odrezki = dominantna napaka pasovnega branja — prihodnji 2. oči prehodi naj sidrajo prek tiskane parzelle, ne prek robnega odrezka.
- **F-OCI-05 (OPEN — NR-14):** vrednostna atribucija — klafter glifi sedijo na spodnjem pravilu pasu (protokol 140 §1) in v pas-izrezkih prekrivajo mejo celice; kandidati: p31 r0 (register 1785 vs ~»3|1305«), p43 r19 (register **4731** vs ~»1|1347« Joch|Klafter notacija — sum prekinitvene napake), p37 r2 (705 vs ~403), p49 (izločeno). **Nič ne spreminjano** — kandidati za prihodnji pasovni vrednostni re-read z bottom-rule anchoringom.
- **F-OCI-06 (CONFIRMED):** marginalije — rdeče/črne korekcijske številke nezavisno re-opazane (1-385 @p44r15, 1263 @p50r18, 1-853 @p49r15, 3-364 @p49r1, 1-1367 @p49r5, 1-966 @p25r12, 1-400 @p55r5, 576 @p26r5, 658 @p32r10, 825 @p50r9, 682 @p50r12, 870 @p26r14, 1-317 @p26r19, »2b« @p37r5) — skladne z ertrag/v114 opombami registra.

## 4. Iskrenost (§4)

- **0 VLM klicev**; branja z agentovim vidom glavne seje (sub-agenti slikno slepi — dokumentirano).
- **Register.json + runtime NI dotaknjen** — raziskovalni val (§22); KG/c4/story nespremenjeni.
- Bralec (glavna seja) je videl kalibracijske pripovedi in anmerkung-flage vzorca (št. prečrtanj per stran) — **izrecno dokumentirano** kot zmanjšana slepota; kompenzacija: vrednosti/imesa vzorca do build-compare niso bila naložena, primerjava pa strogo programska.
- Vsi dvomi ostajajo izrecni ([?] v branjih); fantomi/preklicanja se ne izpraznijo tiho.

## 5. Artefakti

- `research-griblje/val120-oci2/blind/` — 42 slepih segmentnih JSON (p{pg}-seg{K}.json)
- `research-griblje/val120-oci2/comparison.json` — 283 vrstic, per-polje sodbe
- `research-griblje/val120-oci2/analysis-v1.json` — F-OCI-01..06 + remapped statistika
- `research-griblje/val120-oci2/build-compare-v120.py`, `build-analysis-v120.py` — deterministični builderji
- `research-griblje/ps-n83/make-dual-v120.py` (PIN_TOP0 kalibracija) — izrezki (regenerabilni, /tmp)
- testi: `tests/val120-oci2-vzorec.test.ts`

## 6. Naslednje

1. **pasovni vrednostni re-read p3–p55 z bottom-rule anchoringom** (F-OCI-05 kandidati: p31 r0, p43 r19, p37 r2; p49 kontrola po protokolu 140);
2. celicni-zoom 2. oči za črkovalno sodbo vzorca (F-OCI-03) — po potrebi;
3. hiša 70–78: p56–143 PROVISIONAL plast (ločena odločitev);
4. register 26-0326 + 26-0379 ponovna živa preverba ob javnih poročilih.
