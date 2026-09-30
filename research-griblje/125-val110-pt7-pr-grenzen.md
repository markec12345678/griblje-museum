# 125 — Val 110: PT p7 nativni re-read (@PDF-native) + PR Grenz-Beschreibung 2. prehod

**Datum:** 2026-09-30 · **Issue:** #42 §4/§14 + #43 · **Obseg:** PT N83 str. 7 (III.P., stan. parcel 81–100) ponovno prebrana na nativni ločljivosti PDF skena (2727×2117 — "300dpi" naloga iz seznama; maksimum po F-PZ-17) + PR N83 (Grenz-Beschreibung) str. 2–4 drugi prehod · **metoda:** nativni skeni (pymupdf) + direktni odtis (glas avtorja, PRED VLM) + kontaktnе table 20 vrstic + izrezki stolpcev/celic 3x–8x + rekonstrukcija glasov val 41/52/53 iz surovin · **0 VLM klicev — 429 dnevna kvota** (izčrpna z val 107/109; en testni klic @09:5x UTC = 429; izrezki resumable ob kvoti)

---

## 1. Naloga in izvor

`open_for_full_res` v `pt-n83/reconciliation.json` (val 54/56) je izrecno vseboval **»PT p7 rep 90-100 (pomik vrstic + Zollamt)«** — to je naloga "PT p7 @300dpi" s seznama #42/#43. PR Grenz-Beschreibung pa je imela od val 42 samo en (nizko-ločljivostni) VLM prehod z izrecno oznako "predbitna branja".

Prevzem: veja `feat/val110-issue72-pt7-pr-grenzen` je že obstajala s 13 izrezki prejšnje seje (pt7-* + pr-p2..4-2x.png); prenesena PDF-a in nativni skeni so bili dopolnjeni v tem valu (popolna ponovljivost: URL + sha256 v summary.json).

## 2. Ključno: VAČ "300dpi" ne obstaja — PDF-native je maksimum (F-PZ-17, val 80)

`pdfPageImage` = fiksna ~667px predogleda (parametri ignorirani). Pravi vir resnice = **PDF-native skeni**: N083PT.pdf (2.898.721 B, sha256 `f7b68454fd8fd819…`) ima **p7 = 2727×2117** (2,1× pripogleda val 41, ki je bil 1308×1016); N083PR.pdf (1.017.944 B, sha256 `18280dae40af21ec…`) p2–p4 = 1415–1476 × 2179–2186. Prenos prek `tifyPdfDownload` (python urllib, unverified SSL — TLS veriga nepopolna, curl blokiran).

## 3. PT p7 — trije rezultati

### 3a. F2 (val 54) RESOLVED: sistemski pomik vrstic dokazan

Glasovi rekonstruirani iz surovin: **val41** (register prej) in **val53-zoom2x** nosita +1 pomik (register h[bp] = nativno h[bp−1] za bp 85–97); **val52** in **val53-p7** se z nativnim odtisom strinjata na vseh 16 spornih vrsticah. Nativna sekvenca (izrezki `pt7-col-house.png`, `pt7-band2.png`, kontaktna tabla, celice 4x/8x):

```
bp:  81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100
h:   45 45 45 45 37 36 44 36 44 43 44 41 40 40 39 38 39 70  —   —
```

Tally p7: **14 REVIEW-CONFLICT + 1 REVIEW + 5 STABLE → 17 STABLE / 3 REVIEW / 0 RC** (15 spremenjenih hišnih številk; snimke v `register-v110-changes.json`).

### 3b. bp 98 (Zollamt) → h.70 — vezava trojno podprta

Nativni odtis 4x: **70** ("20" val52+val53 = 7→2 zamenjava pri 667px; "39" zoom2x = pomik iz bp 97). Zunanja dvojna korooboracija: **PUA no. 95 = Zollamt h.70 + opomba "B.P. 98."** (val 56, nativno 2×) + **A01 no. 7 = h.70** (val 54). Vezava Zollamt ↔ bp 98 ↔ h.70 zdaj trojna. PT register ostaja iskreno REVIEW (PT-notranji glasovi 39/20/20/70 se ne strinjajo); vezava v cadastre-a01 (VERIFIED-2x, val 56) nespremenjena. Bonus: bp 90 = h.43 nativno korooborira PUA p6 no. 7 h.43 + "B.P. 90.".

### 3c. bp 99/100 = FANTOMSKI vnosi

Nativno: vrstici **PRAZNI** (pomlaji; Nro stolpec neostevilčen za 98; kontrastno izboljšano potrjeno). Register vnosi (99: "Alois Pollandt" h.50, areal 102 = nativni bp 98!; 100: h.5 "Futterg[?]" + "Bruckmühle", STABLE 2/2) = korelirane napake nizke ločljivosti — h.5 = vsotna vrstica "**5 | Eintrags.**", areal 102 = pomik. "Bruckmühle" ni na PT p7 — mlin ostaje vezan izključno na PR/A01/PUA dokaze. Vsebinska polja počiščena, snimke ohranjene.

### 3d. Nov strukturni signal: rdeča revizija

Rdeče prečrtanja lastnikov+arealov na **12 vrsticah (bp 81, 82, 85, 90–98)**; neprečrtane: 83, 84, 86–89. Možen kontekst: korekcija meja september 1827 (A01 naslovnica) — REVIEW, potrebna zunanja potrditev. Diagnostika (NE vgrajeno v vrednostna polja): areal odtisi kažejo isti pomik (register bp 99 areal 102 = nativni bp 98); popolna re-adjudikacija areal/lastnik zahteva VLM glasove (ob kvoti) + PUA kaskado — izrecna izključitev `val110-areal-owner`.

## 4. PR Grenz-Beschreibung — 2. prehod (nativno, direktni odtis)

- Rokopisni naslov: **"Definitive Grenzbeschreibung der Gemeinde Grüble."** (val 42 jebral samo tiskano naslovnico)
- **Datum: "Neustadtl am 8ten April 1825."** (jasno) + podpisni krog (ista roka kot PT p8) + "mtl Geometr[?]" + podpis "v. Hillenmayr?[?]" → »definitivna« določitev meje **PRED** septembrsko korekcijo 1827
- Mere: vzhod–zahod **1028 Klafter** (jasno); sever–jug 1[3/8]54 Klafter (druga številka predbitna)
- Mejni sprehod: Grenzsteine **No. 1–9** z razdaljami v Klafterih (336, 310, 279, 170, 155, 266, 185, 46½; kot 82°/90°); toponimi (predbitno): na Turičkem bregu?, Na Loka, Schimothi Dravi?, Dolec, Na Dragi, Godina (jasno), Loshiza? (Ložica?)
- **Mlinščica** ("Melinschi Bach") — SOGLASJE obeh prehodov (val 42 + v110) → najmočnejši hidrografski podatek dokumenta
- Sosede — RAZKOL: odtis v110 bere "Krasinz[?]" (Krasinec), "Königreichs Croatiens[?]", "Adleischitz[?]" (Adlešiči), "Weitendorf[?]" (p2+p3); val 42 je bral "Weichselberg/Hochsteg/Schönbach/Stadelbach/Dolga vas". Geografsko verjetneje odtis (Krasinec/Adlešiči/Kolpa), ampak NI dokaz — razkol dokumentiran, nerešen, specializiran prepis TO_COLLECT
- Gostilniški izrazi: negativen zadetek v OBEH prehodih (4/4 strani)

Vgrajeno: posodobljeni opombi vira `franciscejski-kataster-n83-pr` (naslov, datum, mere, razkol, negativen zadetek) + `franciscejski-kataster-n83-pt` (nativni re-read, Zollamt h.70, fantomi) — sl+en, add-only.

## 5. Iskrenost

- **TRANSCRIBED = 0** — nič VLM glasov; vse vrednosti = nativni odtis + večina rekonstruiranih transkripcijskih glasov; bp 98 ostaja REVIEW dokler ne pride 3. neodvisen PT glas (resumable ob kvoti)
- Lastniška imena p7 NE popravljena (F1: PUA = avtoriteta; odtisi v `v110_native` kot diagnostika)
- Areal/gattung/annotation p7 NE popravljeni (dokumentirani pomik, izključitev `val110-areal-owner`, re-adjudikacija ob kvoti)
- Razkol sosedov PR ohranjen kot razkol (ni razrešen z "verjetneje")

## 6. Datoteke

- `research-griblje/pt-n83/build-register-v110.py` — builder (fail-fast; gardele: 100 vrstic, p7 tally 14/5/1, nativni skeni na disku; idempotenca prek changes datoteke)
- `research-griblje/pt-n83/register.json` — p7 vrednosti + `v110_native` diagnostika + `v110_note`
- `research-griblje/pt-n83/register-v110-changes.json` — popoln revizijski sled (pre/post za vseh 20 vrstic)
- `research-griblje/pt-n83/page-records.json` — p7 nativni blok (sekvenca, fantomi, vsotna vrstica, rdeča revizija, desna stran)
- `research-griblje/pt-n83/reconciliation.json` — `val110` sekcija (f2_resolved, bp98_zollamt, bp90_bonus, phantoms, red_crossings, pr_second_pass, honesty); `open_for_full_res`: "PT p7 rep" → RESOLVED-V110
- `raw-web-val110-2026-09/` — n083pt.pdf + n083pr.pdf (hashirana), native-p0*.jpeg/png (8+4), native-pr-p0*.jpeg/png, kontaktnе table (pt7-rows-contact.png, pt7-right-contact.png), izrezki (col-house, band2, annot, r10, r1/r4-areal, areals/labels, celice 4x/8x, hdr-*/firstrows/bottomrows p5/p6, pr-p2..4-2x prejšnje seje), direct-reads-v110.md, summary.json, sha256.txt
- `tests/val110-pt7-pr-grenzen.test.ts` — +19 varovalk (register sekvenca + fantomi + Zollamt + regresije; revizijski sled; page-records; reconciliation; surovine + hashi; muzejske opombe)

## 7. Števci in teste

- Zbirka: **114 zapisov / 652 virov / 528 identitet / 69 deljenih — NESPREMENJENO** (tehnični val; ATLAS §22 nespremenjena — SRC dokument, kaskada KG ni potrebna)
- **989 testov: 978 pass / 11 skip / 0 fail** · tsc čist · lint čist (testi v ignore listi — konvencija repo)

## 8. Naslednje

- VLM glasovi ob kvoti: 45 izrezkov PZ (mikroprehod 8b) + p142-t-kultur2 + 3. PT glas za bp 98 + re-adjudikacija areal/lastnik p7
- Poln re-read p1–55 + p143 (PS); F-PV-03 (QKlft anomalija) / F-PV-04 (pasovni re-read)
- Dular 1972 vsebina + BM Metlika (izven peskovnika); register eArheologija: 26-0326 + 26-0379 (okt./nov. 2026)
