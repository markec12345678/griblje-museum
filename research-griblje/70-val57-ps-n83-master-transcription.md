# 70 · Val 57 — PS N83 Master Transcription (Protocol der Grund-Parcellen der Gemeinde Gruble, 1825)

**Vir:** SI AS 176/N/N83/s/PS — »Protocol Der Grund-Parcellen der Gemeinde GRUBLE«, VAČ docid 41780 (uodid 373415), **143 strani razprtij** (velikost 486×336 – 1.310×1.029 px; p1 naslovni fragment, p2 enostranska, p3+ dvotabelna razprtja ~1.266×1.021)
**Status val 57:** **PARTIAL — 55/143 strani transkribiranih** (1.073 vrstic); preostalih 88 strani blokiranih z VLM kvoto (429 od ~11:14 do ≥12:16 UTC) — skripta je resume-pripravljena (`ps-transcribe.mts`), nadaljevanje = prvi naslednji val ali po resetiranju kvote
**Sprožilec:** uporabnik — »naredi PS popolna transkripcija (143 strani gaitvenih podatkov — največja nagrada)«

---

## 1 · Identifikacija strukture (VLM p3 glava @2×, val 57)

Vsak JPEG = **fizični list, fotografiran kot razprtje** (fold v sredini). Leva stran = lastniški blok »Des Eigenthümers«, desna = parcelni blok »Des Grundstückes«; vrstice se povezujejo čez fold.

**Leva tabela:** Nro. des Blattes (vrstična št. 1–20 na list) · Bemerkung des Rückes (ozka, navzkrižana) · Nro. der Uebers[etzung] (ozka) · Geistliche Eigenth. / Dominical / Rustical (navzkrižano) · **Haus Nro.** · **Vor und Zuname** · **Stand** · **Wohnort**
**Desna tabela:** **Kultur Gattung** (Acker, Wiese, Wald, Hutweide, Gartn, Ried, Lehngut, Hofraithe, Žitno[?]) · **Flächen Inhalt** = »N.º Jaethe« + »Quad. Kläfter« · **Classe** · **Reiner jährlich Ertrag in Mettal Münze** (fl/Kr) · **Capital Werth nach p.Ct.** (fl/Kr) · **Anmerkung** (tudi rdeče — »[rot]«)

**Ključna spoznanja strukture:** lastniško ime pogosto samo na prvi vrstici bloka, naprej **ditto znaki** (mehanično razrešeno v `owner_resolved`, zastavica `owner_was_ditto`) · vsak list ima natisnjeno št. (»10. N.«, »11. N.«) · listne vsote (»Summa«, »Ftirtrag«, rdeče skupne številke).

**Pomen za Atlas 1825:** PS je **edini register z lastnikom + hišo + parcelo + rabo + davčno vrednostjo v eni vrstici** — hrbtenica za Parcel Register in Person Register (issue #42 §4/§5). PUA je abecedni seznam lastnikov zemljišč, PT protokol stavbnih parcel — PS jih povezuje na nivoju vrstice.

## 2 · Transkripcija (val 57, 55/143)

**Metoda:** serial VLM branje (bun + z-ai-web-dev-sdk createVision, thinking disabled), prompt z dejansko strukturo stolpcev + pravili (ditto → `~`; črtane vrstice → `[gestrichen]`; rdeča pisava → `[rot]`; nejasno → `[?]`; STRICT JSON) · resume po straneh (`ps-vlm/pNNN.json`) · 429 backoff 60 s · per-call timeout 180 s.
**Izkop:** `research-griblje/raw-web-val57-2026-10/ps-vlm/` (55× JSON + transcribe.log) — ena datoteka na stran, surov VLM odgovor ohranjen.

**Register:** `research-griblje/ps-n83/register.json` — **1.073 vrstic** (19,5/stran), polja: page, sheet_visible, no_blatt, haus_no, owner_original (+was_ditto), stand, wohnort, kultur, jaethe, klafter, classe, ertrag_fl/kr, capital_fl/kr, anmerkung, page_observations.
**page-records:** `ps-n83/page-records.json` (143 zapisov: 55 READ, 88 NOT_READ-quota) · **build-qa:** `ps-n83/build-qa.json`.

### 2.1 · Hitra statistika (55 strani)

| mera | vrednost |
|---|---|
| vrstic | 1.073 |
| vrstic s Haus Nro. | 1.028 |
| različnih Haus Nro. vrednosti | 163 (vključno z nelogičnimi: »C«, »k«, »00«, »9.«, »1/3« = bralni šum + iskrene vrednosti) |
| raba zemljišč (top) | Acker 516, Wiese/Wiesen 135, Wald/Wald. 83, Hutweide 20, Lehngut 17, Gartn 16, **Žitno 16** (slovenski izraz v Kultur Gattung!), Ried/Riedl/Riden 39 |
| rdeče opombe | več deset `[rot]` (npr. »4-2657«, »1-1752«, »3-1305« — verjetno reference na konfirmacijske/številčne zaporedja, NI dekodirano) |
| Zoll omenjen | 0 (v prebranih 55 straneh) |
| B.P. v Anmerkung | 0 (v prebranih 55 straneh) |

### 2.2 · QA (strojna)

- **no_blatt kontinuiteta:** 5 flagov na 3 straneh (p44 dup 11, p45 manjkata 12–13, p48 dup 1, p51 močno raztreseno) — bralni šum posameznih strani, zahtevajo tarčni re-read pri polni resoluciji (ISTO lekcija kot PUA p5-bot: pasovna branja vedno @300 dpi).
- **aritmetika:** še NI izvedena (zahteva 143/143) — načrt: vsota klafter po listu vs »Summa« vrstica.
- **preostanek:** 88 strani (p56–p143) = NOT_READ (kvota).

## 3 · Križna kontrola PUA ↔ PT ↔ PS (na 55/143 — delna!)

**Hišne številke (PS Haus Nro. vs PUA/PT hiše):**

| kontrola | rezultat |
|---|---|
| PUA hiše pokrite v PS | **51/54** (h.70 Zollamt, h.71 Stauger, h.72 = verjetno v preostalih 88 straneh — NIKOLI »absent«) |
| PS številke izven PUA seta | 13, 14, 15, 23, 31, 35, 38, 39, 45, 49, 50, 52–57, 59, 67 (realne PUA hiše, kjer PS bere hišo tam, kjer PUA vpis te št. nima — so-posedž/najemniki?) + **79, 80, 81, 82, 85, 87 (>72!)** — QA VPRAŠANJE za polno transkripcijo: šum ali dodatna številčenja? |
| PT hiše brez PS | »110« in »[nečitljivo]« (PT bralni artefakti) |

**Imena (isti dom, PUA vs PS) — vzorec:**

| hiša | PUA (lastniki zemljišč) | PS (parcelne vrstice, 55 str.) | interpretacija |
|---|---|---|---|
| h.60 | Penzig Stuffe Leuthold / Schimetz Johann / **Schelko Georg (no.85, nov val 57)** | Kirschan Georg[?] / **Schellko Joseph[?]** | **Schelko/Schellko na h.60 = 3. vir potrjuje družino** (PUA no.85 val 57 + PS) |
| h.30 | Tillak Philipp | Tillah Walfja[?] / Peter Malfg[?] | isto ime družine (Tillak/Tillah), druga oseba |
| h.26 | Brincz Johann / Sankovitsch Lorenz | Feldt Peter[?] / (K)hanzl Valen[?] | različna imena = lastnik vs. naslednik/najemnik |
| h.43 | (register: Grübler Maria L.; val 57: Brulla[?]) | Ulrich Peter[?] / Shumey Michael[?] | PS ne potrjuje nobene PUA različice — h.43 ostaja konfliktna |
| h.65 | Widhann Georg (h.65/66 no.40/41) | Schimeczkhanl[?] | neskladje (ali bralni šum PS) |

**Pravilo (issue #42 §5):** podobna/različna imena na isti hiši se **NE združujejo** — vsak zapis ostane svoja entiteta z viri; interpretacije (najemnik, vdova, so-posedž) so HIPOTEZE in niso vgrajene.

## 4 · Preostanek za 100 % transkripcijo (naslednji val ali po kvoti)

1. **88 strani p56–p143** — `bun run research-griblje/raw-web-val57-2026-10/ps-transcribe.mts` (resume; ~30 s/stran; serial + backoff)
2. Re-read QA strani pri 300 dpi (p44, p45, p48, p51 — no_blatt flagi)
3. Aritmetična QA (vsota klafter vs Summa po listu; Jaethe↔Kläfter konverzija 1 Jäthe = ? Kläfter — izvirna razmerje iz listnih vsot)
4. Dekodiranje rdečih referenc (»4-2657« tip) — verjetno konfirmacijska številčna zaporedja
5. Popolna križna kontrola PUA↔PT↔PS (hiše + imena + parcele) + dopolnitev BP↔HOUSE matrice s PS stolpcem
6. Zoll/B.P. iskanje po vseh 143 straneh (BP 98/Zollamt dodaten dokaz, konflikt K1)
7. (želeno) tesseract OCR kot kanal 2 — v peskovniku ni nameščen; dokumentirano kot alternativna pot izven peskovnika

## 5 · Vgradnja (val 57)

**+0 virov / +0 trditev / +0 UI** — PS register je RAZISKOVALNI vir (`research-griblje/ps-n83/`), ne muzejska vsebina (diskiplina: ne spreminjaj muzejske UI; novi zgodovinski claims šele po 100 % transkripciji + QA + kuratorski pregled).

---

*Dokumentacija: audit PUA = `69-val57-pua-complete-coverage-audit.md` · surovine `raw-web-val57-2026-10/` (ps-transcribe.mts, ps-vlm/, build-ps-register.py, reads/) · register `ps-n83/` (register.json, page-records.json, build-qa.json).*
