# 149 — Val 126: NR-14 ČRKOVALNA SODBA + PASS2 RE-RUN (F-V125-01 ZAPRT) — person-owner-register 981→982, KG vsebinsko SPREMENJEN (prvič od val 122), 0 VLM

**Datum:** 2026-10-09 · **Issue:** #42 §4/§14 · **Obseg:** točka 1 protokola 148 §7 — (A) NR-14 črkovalna sodba kot mašinoberljiva izenačitvena karta + (B) pass2 re-run (person-owner-register + house-register + conflict-register + analysis-v8) · **Status:** vgradnja — kaskada (KG/story/timeline/coverage/runtime) + 16 varovalk · **Metoda:** 0 VLM; metoda B (token surname-first LCS) NESPREMENJENA od val 119 del 3 — kontinuiteta razredov; NR-14 = flag-only izenačitev (nič prepisov, nič mergeov)

---

## 1. Kontekst in cilj

Val 125 je zaprl F-V124-01 (p7 imenska + hišna plast) in odprl **F-V125-01**: person-owner-register + house-register owners.ps nosita val 119-del3 stanje (aprila val 119), ki ne odraža v123/v125 popravkov — npr. H-035 `pages` še vsebuje p7 po stari hiši 35 (v125: r10 = hiša 55). Protokol 148 §7.1: pass2 re-run šele PO NR-14 črkovalni sodbi («en prehod, ne dva»). Ta val opravi oba koraka; sam p56–143 osebni re-read (NR-14 okvir, 88 strani) ostaja večvalna serija (val 127+, 6 strani/val po vzorcu val 119 del 1–2e).

## 2. Del A — NR-14 črkovalna sodba (`nr14-variant-map-1825.json`)

Sodba na dokumentiranih v125 celicnih zoomih ×12–24 (protokol 148 §2; 0 novih branj). **Odločitev: KEEP register forme — karta je FLAG-ONLY** (izenačitev za osebne ključe, ne prepis).

| par | vrsta | forme | kanon | status |
|---|---|---|---|---|
| V1 | priimek | Rabitscher ≡ Rabutschar | Rabitscher | REGISTER-FORMA (rokopis Rabutschar, ×5 @p7) |
| V2 | osebno ime | Georg ≡ Grogy | Georg | REGISTER-FORMA (rokopis Grogy, ×6 @p7; Kurrent izpeljava) |
| V3 | priimek-koren | Pödigz ≡ Poiding | Pödigz | ROKOPISNA SODBA v125 (zoom: P-d-i-g-z, brez ng); p20–55 'Poiding' forme ostajajo (nastale pred lekcijo F-V125) — morebitna izenačitev = ločena sodba |
| V4 | priimek-koren | Schimecz ≡ Schimez | Schimecz | UNDECIDED (cz/z variabilnost iste roke @p7; kanon samo za grupiranje) |
| V5 | osebno ime | Mihual ≡ Michual | Mihual | ROKOPISNA SODBA (h-descender zanka, 'Mi⟨h⟩ual' ≈ Michael) |
| V6 | osebno ime | Marusa ≡ Maruſa | Marusa | NORM-AVTOMATIKA (U+017F ſ → NFKD → 's') |

**Zavrnjene forme (NI črkovalne variante):** `Marls` (v124 napaka branja — long-s ≠ 'ls'), `Rabatschar` (v124 hitro branje r18 — rokopis je 'Strauß Grogy'), `Schimz` (v124 knjižna kontrakcija), `Schimez P…a` 2. beseda (nečitljiva ×14 — izrecni dvom ostaja).

**Mehanizem:** token-točna zamenjava v normaliziranem prostoru (brez predponskih iger — 'Schimeczkhanl' en token se ne razčleni); `normalized_nr14` = norm po zamenjavah; `nr14_variant_group` flag SAMO pri deljenem normalized_nr14 z različnim normalized — **NOT_MERGED**. Merjeno stanje val 126: **0 variantnih grup** v register (forme že kanonizirane na strani) — karta je pravilna baza za p56–143 re-read serijo in zaščita pred lažnimi mergei.

## 3. Del B — pass2 re-run (`build-sync-v126.py`, naslednik build-sync-v119-del3.py)

Guardi (fail-fast, pre-state = val 119-del3): PS 2876 vrstic / p3–55 = 1078 (v124 Nro 92) / 1070 owner vrstic / PUA 98 / osebe 981 (98+656+227) / hiše 169 / konflikti 113 / CH 51. Izrecna zaščita: **PROVISIONAL plasti H-072/74/76 (`layer: PROVISIONAL`, val 122) se ne dotakne** (sync_note dodan).

**Rezultat (metoda B, nespremenjena):**

- **owner(ps) 656 → 657** (98 PUA + 227 PT nedotaknjena; osebe skupaj **981 → 982**; possible_duplicates 418 → **419**). Diff vs. del3 točno v125 strukturne osebe: − ('20','Lappary Marbl'), − ('26','(K)hanzl Valen'), − ('35','Schimez Hanl'), − ('50','Poiding Matthl'), − ('63','Poiding Hanl'), − ('80','Peders Marbl'); + ('45'/'48','(R)abitscher Georg'), + ('47'/'46','Strauß Georg'), + ('49','Schimecz Mihual'), + ('50','Pödigz Marusa'), + ('53','Pödigz Hanl'), + ('55','Schimez Hanl'), + ('56','Schimez P…a').
- **Hiše:** H-035 pages brez p7 (`[9,10,16,17,18,20,23,35,36]`, rows 13) — F-V125-01 vzorčni primer zaprt; H-049 = 'Schimecz Mihual' @p7; H-055 = 'Schimez Hanl' @p7; stale hiš **0** (v125 premiki imajo vedno ciljno hišo z vrsticami). Top-level `coverage` top-level polje preštet iz per-house statusov: **SINGLE_SOURCE 32 → 34** (stale vrednost od val 122 — val 122 lasten test pravi «SINGLE_SOURCE 32→34», top-level polja pa ni posodobil; per-house realnost vselej 34).
- **Razredi (metoda B): v126 = v119 — 16 AGREE / 2 PARTIAL / 33 MISMATCH, `changed_vs_v119_houses` = []** (kontinuiteta potrjena; sim stolpci sim_concat_first + pua_ps_name_sim_v119 ohranjena).
- **CH konflikti:** statusi nespremenjeni (4 RESOLVED + 12 PARTIALLY_RESOLVED + 35 OPEN); del3 sodbe ohranjene kot `note_v119` (add-only); `claim_b` posodobljen na v125 imena.
- **analysis-v8.json** (nov; v7 ostaja zgodovinski artefakt del3): A_pua_vs_ps_v126 + `nr14_adjudication` + najdbe F-SYNC-01..06 (F-SYNC-06 = NR-14 vgradnja + F-V125-01 zaprtje).

## 4. Kaskada (§22)

- **KG vsebinsko SPREMENJEN (prvič od val 122):** vozlišča 3764 → **3765** (PERSON 981 → **982**), vezi **3473** (OWNER_OF 246 — joini sledijo preimenovanim lastnikom), trditve 614, vrzeli 11 (RG-009/010/011 ostajajo OPEN — PROVISIONAL p56–143 še vedno zunaj osebne plasti, F-SYNC-04), invariante `[]`, sha **ab418c75 → 1e49de43**.
- story-graph 3765/3473/4 → timeline 8 točk (I1/I2/I6 ✓, kg_sha256 = 1e49de43…) → coverage **PASS 8** (§24 14/14) → atlas-map-data-model (PERSON 982) → analysis-v5/v6 re-runa → runtime src/data sinhronizirana (KG/story/timeline/coverage).
- **pass3 NEIZVEDEN (izrecno):** parcelna projekcija ni odvisna od osebne plasti; garda 2875 je pre-obstoječa ostalost vala 124 (v124/125 je nista dvignili) — izven dosega vala 126, dokumentirano.
- RG-009/010/011 (h72/74/76 → OWNER): ostajajo OPEN do p65/69/115/122 re-reada (v okviru p56–143 serije); F-V125-01 **ZAPRT**.

## 5. Testi

Nov `tests/val126-nr14-sodba-pass2-rerun.test.ts` (**16 varovalk**): karta V1–V6 + zavrnjene + flag-only; izenačitvena logika (Rabutschar≡Rabitscher, Grogy≡Georg, Poiding→podigz, Michual≡Mihual, Schimez≡Schimecz); V6 NFKD ſ avtomatika; Marls ni varianta; person 982/657/419 + normalized_nr14 na vseh + NOT_MERGED; v125 p7 osebe (8 pričakovanih) + ovržene izpada; F-SYNC-04 (vsi owner(ps) page ≤ 55); hiše 169 + coverage 34; H-035/49/55 dokazi; PROVISIONAL zaščita ×3; metoda B kontinuiteta (distinct int hiše = 51, '0'/'00' int-trk dokumentiran); CH 4/12/35 + note_v119; analysis-v8 brez razrednih sprememb; KG 3765/3473/614/PERSON 982 + NOT_MERGED; kaskada + runtime sha.

**Izrecen prehod pinov:** KG sha ab418c75 → 1e49de43 (21 testnih datotek), 3764 → 3765, PERSON 981 → 982, 656 → 657, 418 → 419, PARTIAL 691 → 692, PER-0586 → PER-0583 (Peter Muster h40 — premik indeksa ob vstavitvi Nro 92 osebe; C-00083/C-00153 stabilna), pass2 oznaka val 119-del3 → 126, SINGLE_SOURCE 32 → 34 (2 datoteki — stale top-level polje).

**1399 testov: 1388 pass / 11 skip / 0 fail; lint + tsc čisti.**

## 6. Iskrenost (§4)

- **0 VLM**; sodba izključno na že dokumentiranih v125 zoomih (crops-v125 regenerabilni) — nobeno novo branje rokopisa.
- **Nič tihega prepisovanja:** register forme nespremenjene (KEEP); izenačitev = izpeljani ključi + flagi; zgodovinski dokazi (note_pass2, note_v119, ps_stale, sim stolpci) ohranjeni.
- **0 variantnih grup je merjen izid**, ne cilj: register forme so stranske kanonizacije; karta bo delovala na p56–143 branjih (Kurrent forme bodo vstopale sveže).
- F-SYNC-04 nespremenjen: p56–143 (1.798 vrstic) še vedno PROVISIONAL — RG-009/010/011 ostajajo odprti do re-reada; hiša 70–78 imenska napetost (PUA Strauß Khonrad vs PS Wolfsloch Wolfgey) neodločena.
- pass3 garda (2875) = pre-obstoječa neskladnost vala 124, tokrat izrecno nedotaknjena.

## 7. Naslednje

1. **p56–143 osebni re-read — serija val 127+** (NR-14 okvir: pasovni/celicni izrezki s kolonskimi sidri + dvojni sidr po vzorcu val 119 del 2; 6 strani/val; p65 → RG-009/010; p115 → RG-011);
2. kultur re-sidro p7 (dvovrstični nizi) — majhen ločen prehod;
3. register 26-0326/26-0379 ob javnih poročilih eArheologija;
4. F-H122-01: deterministična disambiguacija 13 podvojenih H-1-* ID-jev;
5. ob zaključku serije: končni pass2 re-run (širitev F-SYNC-04 scope-a) + VLM 2. oči vzorec (NR-14 zaključek).
