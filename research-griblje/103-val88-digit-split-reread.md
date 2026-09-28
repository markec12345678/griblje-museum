# 103 — 88. val: PS N83 DIGIT-SPLIT RE-READ — 139 vrstic rešenih z direktnim branjem (instrument val 61, brez VLM)

**Datum:** 2026-09-28 · **Obseg:** PS N83 (SI AS 176/N/N83/s/PS) — 139 vrstic z markerjem `v86-review-pass-digit-split` (p56–94 + p121, 21 strani)
**Nadaljevanje:** val 86 `next_reads` (»ročni re-read 139 digit-split vrstic«) / val 86b (F11 + 86b 2. del čaka kvoto) / precedens val 61 (agentovo direktno branje, 0 VLM)
**Vgradnja:** register.json 139 vrstic (137 rešenih + 2 unresolved) s snimkami · **+0 virov / +0 KG vozlišč / +0 UI** — §22 kaskada do KG ZAVRTO (j|k vrednosti niso KG polja)

---

## 1. Kontekst

Val 86 je s kolonskimi tile-i (z glavo stolpcev, F-PV-06) popravil 333 vrednosti J↔K s snimkami, 139 vrstic pa pustil v REVIEW (`v86-review-pass-digit-split`): tile glas je bil diagnoza (±1 nestabilna po strani, dokazano p56), ne resnica. Val 86b je meril F11 Fürtrag verigo in pustil 2. del (spravilo ~479 tile-ov) na VLM kvoti. Ta val rešuje 139 REVIEW vrstic **z direktnim branjem izrezkov** (instrument val 61: agentov vid, brez VLM — nič kvote, nič 429).

## 2. Metoda (pipeline val 88, vse deterministično, 6 skript)

- **`build-targets-v88.py`** — inverzija merge_tiles (build-register-v86.py 1:1 v Python): iz registra izbere 139 `v86-review-pass-digit-split` vrstic (guard: točno 139) in jih poveže s 3 glasovi (pass1 val 82 / pass2 val 83 / tile val 86 — tile izrecno **DIAGNOSTIKA**).
- **`align-slots-v88.py`** — DP podzaporedje detektiranih pravil (točno n_pass+1 slotov, gladkost drugih diferenc, rdeča-supresija) → poravnava vrstic na y-lestvico strani; `slots-v88.json` (21 strani, ladder + targets s slot y).
- **`make-sheets-v88.py` / `make-sheetsB-v88.py` / `make-rowcrops-v88.py`** — trije rezalniki iz nativnih skenov `raw-web-val56-2026-10/n083ps-pages/`: pass A = polstrani ×4, pass B = listi ×8 (5-vrstična okna, per-target), pass C = posamezni izrezki ×10 (jaethe/klafter kolona). Izrezki regenerabilni → gitignore (precedens val 85/86).
- **Branje** — protokol val 61: agent direktno bere izrezke; 2+ neodvisna prehoda; **vrednostna poravnava** proti pass1/pass2 kontekstu (sosede + ditto imena); vsak rezultat = status, ne ugibanje.
- **`build-register-v88.py`** — vgradnja ENKRAT, fail-fast (guard: register 2.871, brez v88, 139 adjudikacij); pravilo vrednosti: `|` = izraziti j|k, sicer **klafter:=v88 + jaethe:=''** (page-level F-PV-05: pisar piše Kläfter — digit-split vrstice so enojna števila); snimki `jaethe_pass1_v82`/`klafter_pass1_v82` + glasovi `jaethe_v88`/`klafter_v88` + `v88_status` ohranjeni; U vrstici NEOKRONJENI + marker + opomba; p1–55 + p143 guard (nedotaknjena).

## 3. Rezultati — tally 139: **25 P1 + 37 P2 + 75 T3 + 2 U**

- **P1 = 25** — pass 1 (val 82) potrjen; **P2 = 37** — pass 2 (val 83) potrjen; **T3 = 75** — **tretja vrednost (oba VLM pasa napačna)**; 9 od rešenih ima izraziti j|k razcep (npr. gi 1152 = 9 J 1128 QKl — pass1 je bral `9` v Jaethe in `1128` izgubilo).
- **Repatriacija glasov:** T3 = 53,9 % potrjuje val 85/86 pouk — VLM soglasje na digit-split vrsticah ni bilo zanesljivo; direktno branje izrezkov je edini stabilen instrument za ta razred vrstic.
- **U = 2 (izrecno NE rešeno, brez ugibanja):**
  - **gi 1226, p63 r13** (p1=529 / p2=329 / tile=374): v viru rdeče prečrtan zapis + popravek **nejasen**; trije prehodi se ne strinjajo; ponovna presoja 5× povečave potrdila dvoumnost. Ostaja `v88-digit-split-UNRESOLVED` + `v88_note`.
  - **gi 2384, p121 r0** (p1=`9/80` / p2=990 / tile=90): celica = `9` + dvoumni pripis (nn/nr?); **stran p121 je že pokrita z odprto najdbo F-PV-03** (QKlft anomalija) — vsiljevanje vrednosti bi kršilo §4. Ostaja UNRESOLVED.
- **Doslednost (programsko preverjeno + testno varovano):** register ↔ changes 1:1 (139/139); snimke pass1 ohranjene na vseh 139; resolved = klafter/jaethe == v88 polja (0 kršitev pravila); p1–55 + p143 nedotaknjeni; množice targets/adjudication/changes identne.

## 4. F11 (val 86b) ponovno merjeno ob v88 vrednostih — verdikti NESPREMENJENI

`build-f11-fuertrag-v86.py` regeneriran nad v88 registrom (re-run byte-identno, testno varovano): **stroga veriga 5 kršitev monotonosti** (iste kot v 86b — VLM šibkost oznak), **veznost p54=52 → p58=56 OK (delta 4)**, **3-glas REVIEW 38 strani**, **aritmetika 0 OK / 76 REVIEW / 12 brez Fürtraga**, **sidra val 85: 3/7**. Statistika register_qkl_total / razpad po kultur / best_diff se je mehansko premaknila z v88 dodelitvami (npr. 1. blok 13.317 → 13.636 QKl) — zabeleženo v artefaktu, nič sprememb v verdiktih. F11 ostaja REVIEW raven (NR-14).

## 5. §4/§22 disciplina — kaj val 88 NE naredi (in zakaj)

- **KG NESPREMENJEN** (sha 6fb6fae8, val 86): jaethe/klafter vrednosti niso KG polja — kaskada se tukaj ustavi na registru. Story/timeline/coverage ostajajo na KG 86 stanju.
- **Parcelni register ostaja na val 61 stanju (432 PS parcel):** med delom vala je bil poskusno zagnan tudi zastarel `build-pass3.py` (val 60) — ta bi parcelni register razširil 432 → 930 (mejansko pravilna projekcija polnega registra 143/143, vključno z v88 vrednostmi) + domočel 3 lastnike p12, ampak **hkrati uničil poznejše sloje**: negative-result register bi izgubil NR-12/13/14 (14 → 11) in a01-building-inventory bi izgubil georef v2 iz vala 72 (±38 m reka-trim → provizorično 1 sidro). **Vse tri datoteke obnovljene na comitano stanje.** Nauk (dokumentiran): `build-pass3.py`/`build-pass4.py` so val-60/65 builderji z zastarelimi provenancami — njihov re-run je dovoljen šele po vgradnji poznejših slojev v builderje (ali z eksplicitnim merge slojev).
- **Naslednji val (predlagan val 89 — »PS parcelni register 143/143 projekcija«):** (1) build-pass3.py: posodobiti provenance (»1.073 vrstic / 55-143 strani« → 2.871 / 143-143; source labela `PS N83 (PARTIAL 55/143)` → `PS N83 (143/143)`), NR-12/13/14 vgraditi v builder (vir resnice), (2) re-run pass3 → parcelni register 930 + negative register (14), (3) šele nato KG → story → timeline → coverage (pravilen vrstni red — KG je bil tokrat zagnan PRED pass3), (4) §22: pričakovana rast PARCEL vozlišč (PUA 2.035 + PS 930) — izrecen, testno voden prehod števcev, ne tih.

## 6. Naslednje (next_reads)

1. **Val 89** — parcelni register 143/143 projekcija (zgornji §5 postopek, vključno z v88 vrednostmi).
2. **86b 2. del** — spravilo preostalih ~479 tile-ov (p63–94 name + p95–142 kultur+name) ob VLM kvoti; nato polna vgradnja val 86 (~1.798) — v88 vrednosti ostajajo vir resnice za 139 digit-split vrstic.
3. **F-PV-03** (p121 QKlft anomalija) — še odprta; gi 2384 je njen del; pass C pri višjem zoomu ali izvir v čitalnici.
4. PZ p48–65 2. prehod → PT p7 @300dpi → PR Grenz-Beschreibung (roadmap val 85).

## 7. Artefakti

- `ps-n83/band-v88/` — targets-v88.json (139 + 48 band-geometrij), slots-v88.json (21 strani, DP poravnava), passA-v88.json, adjudication-v88.json (139), register-v88-changes.json (137 v88_resolution + 2 v88_unresolved), strips-uniform.json, sheets/sheetsB/cropsC indeksi, rowcrops-manifest.json
- `ps-n83/` — 6 skript (build-targets / align-slots / make-sheets / make-sheetsB / make-rowcrops / build-register), vse deterministične, REPO-relativne poti (pouk val 85 CI fail-a)
- `raw-web-val88-2026-10/` — rowcrops (regenerabilni → gitignore, 534 MB)
- `ps-n83/register.json` — 139 vrstic z v88 polji; `band-v86/f11-fuertrag-v86.json` — regeneriran nad v88 (verdikti nespremenjeni)
- Testi: `tests/val88-digit-split-reread.test.ts` (20 varovalk) + posodobljeni val 86 varovalki (139 promoviranih; snimke 333+139=472) — vse spremembe pinov dokumentirane zgoraj
