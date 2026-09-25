# Val 62 — ATLAS 1825 §12: TOPONIMNI REGISTER v1 (output #7)

**Datum**: 2026-09-25 · **Tip**: lokalni deterministični val (VLM 429 potrjen 4×, web-search 429)
**Issue**: #42 §12 (output #7) + #43 (TOPONYM node type) · **Metoda**: brez VLM — čisto iz obstoječih registrov

---

## 1. Zakaj toponimi zdaj

Issue #43 (Knowledge Graph) zahteva node tip **TOPONYM** (`PERSON ↔ HOUSE ↔ PARCEL ↔ BP ↔ MAP OBJECT ↔ TOPONYM ↔ EVENT ↔ SOURCE`),
ampak register krajevnih imen (§12, output #7) še ni obstajal. Toponimni register je torej
**predpogoj za KG** — zato ta val, še pred gradnjo grafa.

## 2. Viri in nivoji dokazov

| nivo | vir | status |
|---|---|---|
| `field_transcription` | PUA `residence_original` (val 51), PS `wohnort` (val 57/61), PT `wohnort_original` (val 53) | VERIFIED_FORM (visoko) |
| `printed_title` | tiskane naslovnice PT/PR/PS/PUA/PV + A01 legenda | VERIFIED_FORM (visoko) |
| `vlm_single_pass` | PR = Grenz-Beschreibung (4 PDF strani), PG = skica z oznakami sosednjih občin (val 42) | PROVISIONAL (nizko/srednje) |
| `vlm_multi_pass` | A05 oznaka »… Traverne« (×3 soglasna branja, prva beseda UNRESOLVED — val 42/43) | PROVISIONAL_MULTI (nizko) |
| `research_doc` | SI AS 176 / k.o. N83 arhivska enumeracija (vali 41/42) | VERIFIED_FORM (visoko) |

## 3. Register: 37 toponimov

`atlas-1825/toponym-register-1825.json` (deterministično: `atlas-1825/build-toponyms.py`)

| tip | št. | primeri |
|---|---|---|
| self_gemeinde | 1 | **TP-001 Grüble/Griblje** — 6 form, 48 pojavitev (GRÜBLE tiskano 7×, Grübln 11, Grüble 9, Gruble 17, Grable 2, Grublh. 2) |
| administrative | 2 | Illyrien (A01 legenda), k.o. N83 (SI AS 176 [227663]) |
| neighbor_gemeinde | 10 | PR: Weichselberg, Hochsteg, Schönbach, Stadelbach, Dolga vas (Dollwitz), Črnomelj (Tschernomelj, VLM hedged); PG: Thiasing, Dullach, Waischenberg, Drulach |
| watercourse | 7 | PR: Lahinja (Lainizza), Dolina (Duliza), Radešica, Bistrica (Wistritz), Sušica (Schuschitz), Mlinščica; PG: Dampfbach Grenze |
| hill | 4 | Grübler Berg, Hoher Stein, Steinberg, Kapellen-Berg |
| mill_point | 4 | Mlin Dolo, Mlin Bistrica, Mlin Sušica, Mühle (unidentified, PR p4) |
| external_settlement | 8 | PS: Zagorje (p48 2×), Gradiše (p14), Dragole (p49); PUA: Zogwitsche (p14 2×), Schönboden (p15), Waidhofen (p36), Gräving (p34), Höchsthal (p23, kompozit »zu Grublh. in Höchsthal.«) |
| map_label_uncertain | 1 | A05 »Schumsthl/Schamsho/Schimstl Traverne« — edini gostilinski signal v vseh virih 1825 |

**Preglednost**: 5 odprtih possible_matches (vsi NOT_MERGED) + 7 izključenih non-toponymov (hiesig, Häusler, 2700, Weinberge, Steinbruch, Waldstücke, eingeäckerte Wiese).

## 4. Ključna metodološka odločitve

1. **TP-001 MERGED po dokumentni identiteti, ne po podobnosti imen**: vse 6 form se pojavljajo
   *v dokumentih k.o. N83 same* (tiskane naslovnice + lastna residence/wohnort polja).
   To je identiteta dokumenta, ne ugibanje iz podobnosti. Vsaka forma ohranja celoten seznam virov.
2. **Nič modernega mapiranja**: vsi vnosi `modern_mapping = "UNKNOWN"`, `historical_only = true`.
   Tudi Lahinja/Bistrica ostajajo brez moderne identifikacije, dokler repo dokument ne dokaže vezi.
3. **PM-01..05 NOT_MERGED**: Waischenberg↔Weichselberg (PG vs PR), Dullach↔Dollwitz,
   Zagorje↔Zogwitsche, Schönboden↔Schönbach, Dullach↔Duliza — vsi z razlogom + what_would_resolve
   (re-read @300dpi po instrumentu val 61).
4. **Single-pass VLM branja = PROVISIONAL**: PR/PG toponimi izhajajo iz enega VLM prehoda val 42
   (semantična organizacija, ne literalna transkripcija) — nizko/srednje zaupanje, dokler 2-prehodni
   re-read ne potrdi.

## 5. Novi negativni rezultati (centralni register, 11 → 13)

- **NR-12**: imenski Flurbezirki v PS jaethe = **NOT FOUND** (vse segmente številčne/romanske, p1–p55)
- **NR-13**: PT wohnort_original = samo 3× self-forma »Grüble« (p3/4/5); ne-lokalni lastniki so v PS/PUA, ne PT — strukturno negativen

## 6. Skladnost z uporabnikovimi smernicami (#42 komentar 09:01)

| pravilo | izvedba |
|---|---|
| VIRI → DOKAZI → PODATKI | vsak vnos nosi nivo dokaza (field/printed/single-pass/multi-pass) |
| ne združuj po podobnosti | 5 possible_matches NOT_MERGED; TP-001 merge samo po dokumentni identiteti |
| UNKNOWN/UNCERTAIN ohranjeni | modern_mapping UNKNOWN povsod; PROVISIONAL statusi; izključeni non-toponymi zapisani |
| nič ugibanja | nič moderne geografije ni vneseno brez repo-dokazanega vira |

## 7. QA

`tests/atlas-1825-toponyms.test.ts` — **12 testov / 365 expect**: varovalke 37 vnosov, pokritost po tipih,
48 pojavitev self-form, kompozit Grublh., NO modern mapping (vseh 37), 25 PROVISIONAL z viri,
točne strani 8 external_settlementov, PM-01..05 NOT_MERGED, A05 multi-pass, NR-12/13 idempotentno.
**Suite: 221/221 · tsc čist · lint čist.**

## 8. Naslednje

1. **Val 63 (ob kvoti ali brej)**: issue #43 §1/§3 — **Knowledge Graph v1** (PERSON/HOUSE/PARCEL/BP/TOPONYM/SOURCE nodes + OWNER_OF… edges iz registrov val 59/60/62; claim-first, vse povezave z source_id)
2. Ob VLM kvoti: PS p56–p143 → deterministična obnova vseh registrov (pass2 + pass3 + toponimi)
3. Re-readi @300dpi: PR strani 2–4 (nabor sosednjih občin!) + p11/p12 + p36/p42 + A05 paleografija
4. Izven peskovnika: šolski list [4118864], SA Podzemelj, SI AS 749, Zucchelli (web-search še 429)
