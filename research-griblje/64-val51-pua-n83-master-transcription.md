# 64. val (51. val vsebine) — PUA N83: POPOLN TRANSCRIPTSKI PAKET (issue #35, 2026-09-24)

Issue #35: PUA N83 kot **primarni zgodovinski vir** — neodvisen prepis strani za
stranjo, strukturiran register, dvojno preverjanje Kurrenta, provenienca,
QA, audit. Ta dokumentacija razlaga, kako je paket izdelan; podatki živijo v
`pua-n83/` (register.json / register.csv / page-records.json / audit-report.md).

---

## A — METODA: 3 NEODVISNI PREHODI + STROJNO USKLAJEVANJE

1. **pass1 (surovo branje)**: 49 strani (44 originalov + 3 recovered + 2
   salvage) s strogim promptom: dobesedno, zgodovinski napis, `[?]` za
   negotovo, `[nečitljivo]` za neberljivo, parcele ločeno, institucije = vpisi.
   → 52 surovih JSON (`raw-web-val51-2026-10/pua-vlm/`).
2. **pass2 (verifikacija)**: 46 strani z vpisi ponovno prebranih z NACRTOM
   prejšnjega branja — model je vsako vrstico potrdil/popravil znakovno,
   označil neobstoječe in dodal manjkajoče. (Slabost sidrnja je znana — zato
   pass3.)
3. **pass3 (tarčno, brez nacrta)**: 15 strani (§4 problemi + številčni
   konflikti) prebranih na **2× LANCZOS povečavi** s per-stran fokusom in
   eksplicitnim opozorilom na Kurrent 3↔7↔5 zamenjave.
4. **Usklajevanje**: soglasje = VERIFIED-2x; razhod = REVIEW-CONFLICT z
   zgodovino branj v `notes`; odkritja šele v pass2/3 = REVIEW(-ADDED).
   Številke pass1/2 so popravljene SAMO, ko je pass3 z 2× zoom bral drugače
   (digit-by-digit): p17 92/93→32/33, p18 24/25→34/35, p24 147/148→47/48.

**Pomembno odkritje o API:** VLM nepopolne JPEG originale (p27/29/40 brez
`ff d9`) zavrne z 400 »image parse error« — zato branje originalov poteka po
PIL `LOAD_TRUNCATED_IMAGES` delnem dekodiranju v PNG; to je hkrati §6
»preveri recovered proti originalu« metoda.

## B — §4 PROBLEMATIČNI VPISI (končno stanje)

Podrobna tabela z vsemi branjami je v `pua-n83/audit-report.md` §4. Jedro:
- **h.25 »Bauerin« (val 48) OPUŠČENO** — 3× neodvisno branje pokaže moškega
  Bauerja (Mathias[?]/Wendel[?]); vdovski vzorec v registru ostaja resničen
  (Maria Wittib no. 7/8, Lahodathar no. 39, Ritschka no. 43), a ne na h.25.
- **h.46 = Lahodathar Wittib** (3×) — val48 »Ribetitsch? Söllner« opuščeno
  (P3-E11 novelizirana).
- **no. 97 = Philipp De Giammo Zucchelli** (2×, parcela 2700) — val48 »F.
  Kirch« opuščeno; **zaključni datum = 10. Jänner 1825** (mesec sedaj prebran!)
  + 3 podpisi (Mumppen[?], Hollmayr[?], 1 nečitljiv) (P3-E12 novelizirana).
- **Apfaltrer POTRJEN na p03** kot »Baron Apfalterer« znotraj parcelnega
  seznama vpisa no. 2 (Section G/O) — val47/48 pripis (»Section G pri h.23«)
  se popravlja na »pri vpisu no. 2« (P3-E10 novelizirana).
- **Gradac no. 20 = III 748+777 POTRJENO 2×** (val48 + pass3); pass1/2 so na
  isti številki brale »Barbara des Grädlers Ehefrau« (morda žena barona v
  sosednji vrstici) → REVIEW-CONFLICT, obe branji v registru.

## C — STRUKTURNI UGOTOVITVI

1. **Naslovni bloki p26/p42 = notranje ločnice registra**: knjiga ima ≥3
   bloke; številčenje teče 1–50 (p03–p25), nato blok p27–p41 (številke
   nestabilne), nato p43–p49 (rep 87–97 z 80/81 na p40-recovered).
   **Vrzel 85/86 je verjetno pod rezom p42** — to daje p26/p42 re-downloads
   konkretno vsebino, ki jo pričakujemo (P3-E12, P3-E13).
2. **Natisnjen naslov »Alphabetisches Verzeichniß« ne opisuje dejanske
   razporeditve** — vrstni red vpisov ni abecedni po lastnikih (M→B→G→C→B→D→W
   …); abecedna je samo zgornja struktura blokov? Odprto vprašanje (P3-E13).

## D — §11/§12: PRIPRAVA POVEZAVE S KATASTRSKIMI PODATKI

Iz registra je izločeno (strojno berljivo, register.json `parcels`):
- **2.559 referenc na parcele** (Section + številka, ločeno);
- 50 hišnih številk; 5 sekcij I–V; sosednje k.o./vasi v lastniških navedbah:
  Dragoša (Dragosch, h4/h5), Wiedendorf, Kerquitsche, Krasinec, Hollschitzsch,
  Waidhofen, Riedstätt[?], Schönboden[?].

### PS kontrolni seznam (docid 41780, 143 strani) — vstopna točka
Za **vsak** vpis v register velja iskalni vzorec v PS:
`Section + parcelna številka + owner/house + PUA stran`. Primer: vpis no. 20
(Baron von Gradac) → PS Section III, parcele 748+777 → pričakovani lastnik
»Baron von Gradac«. Ciljna veriga: **1825 PUA → 1825 PS → 1851–53 kataster →
kasnejši lastniki**. Do dejanskega branja PS (143 strani — naslednji val)
velja: **povezave NISO dokazane** (UNVERIFIED).

## E — VGRADNJA V MUZEJ (val 51)

- `pua-n83/register.json` + `register.csv` — strojno berljiv register (§7).
- `pua-n83/page-records.json` — status vseh 49 strani (§1/§5/§6).
- `pua-n83/audit-report.md` — coverage/quality/provenance/missing (§15).
- `tests/pua-n83-register.test.ts` — namenski QA (§16): 16 trditev.
- `src/lib/museum-content.ts` — novelizacija arhivskega zapisa PUA + zgodbice
  (revizija Bauerin/h.25, Brinci h. 20?/24/25/26/28 + Widhann 65/66, Lahodathar
  h.46, Zucchelli 97, Jänner 1825, register z 94 vpisi).
- `src/lib/entities.ts` — novelizacije P2-E8, P2-E9, P3-E10, P3-E11, P3-E12;
  novo **P3-E13** (številčna struktura + vrzeli).

## F — STATUS

- Testi: **141/141** (125 obstoječih + 16 PUA QA). Lint: čist.
- Stanje zbirke: 113 zapisov / 589 virov / 469 identitet (val 51 NE dodaja
  virov — obdelava obstoječega PUA dokumenta).
- Kuratorska vrsta: **135 vprašanj** (+P3-E13; novelizacije brez povečanja).
- Issue #35 končni kriteriji: pokriti razen re-downloads p26/p42 (eksplicitno
  dokumentirano nedostopno — kar issue dopušča) in branje PS (samo priprava,
  kot zahteva §12).
