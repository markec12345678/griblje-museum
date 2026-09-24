# 65. val (52. val vsebine) — ZEMLJEVID VASI 1825: LIST A01 Z STAVBAMI, LASTNIKI IN TOponimi

User request: »lahko bi celo zemljevid dodal in vstavil pine ali hiše in kdo je
bil kje je bil … in parcele okol vasi označene kje so ble kdo jih mel«. Ta val
doda interaktivni zemljevid katastra 1824/27 v muzejsko sekcijo »Karta«.

---

## A — METODA (vse z virom, nič ugibanja)

1. **Ekstrakcija stavb z lista A01** (2826×2273 px, IIIF docid 10): vas obrezana
   v kvadrante s znanimi offseti (q1–q4, 2× LANCZOS; qcore jedro vasi 3×;
   qtop sever 1,5×) → VLM za vsak kvadrant: številka stavbe + pikselna lega +
   zaupanje. **56 stavb** (B.P. 30–56, 63–79, 82–86, 89, 92–95, 98–100) —
   manjkajoče B.P. dokumentirane (drobne gospodarske stavbe → P3).
2. **Ključno odkritje**: rdeče številke na listu so **stavbne parcele (B.P. =
   »Nro. in der Mappe« iz PT protokola)**, ne hišne številke. To potrjuje
   protokol PT (p7: stolpca »Nro. in der Mappe« + »NF.« = hišna št.).
3. **Vez B.P. ↔ hiša ↔ lastnik** (vsaka vez z virom):
   - PT p7 **dvojno branje** (val 41 + val 52 neodvisno): BP 81–84→h.45,
     85→h.37, 86→h.36, 87/89/91→h.44, 88→h.36, 90→h.43, 92→h.41, 93/94→h.40,
     95/97→h.39, 96→h.38;
   - PUA opombe z eksplicitnim »B.P.«: h.24→B.P.25, h.25→B.P.29,
     h.65→B.P.46/47/48, h.66→B.P.49/50, Zollamt→B.P.98 (PT p7 owner »k.k.
     Zollamt« potrjuje v obeh branjih);
   - lastnik po hiši iz **register.json** (val 51) z review statusom.
   Rezultat: **11 stavb z lastnikom**, 6 z hišno št., ostale = »stavbna
   parcela — lastnik ni vezan«.
4. **Toponimi z lista**: 7 (Pod Griblani, Lulischewki stz., na Feld[?]/lok[?],
   na Kameniza, Stupar Stih, Zohlami[č], + pozicija »Grüble« opuščena kot
   naslovna).
5. **Merilo**: listno merilo prebrano (320 Klafter = 277 px → **2,191 m/px**,
   ±10–15 %).
6. **Georeferenca (PROVIZORIČNA, jasno označena)**: 1 sidro (centroid stavb ↔
   muzejska koordinata vasi [45.57246, 15.29257]) + sever-navzgor predpostavka
   → meje overlayja SW [45.5627, 15.2405] / NE [45.6075, 15.3200]; rotacija
   lista NI rešena → odstopanja do nekaj sto metrov na robovih. Kontrola proti
   moderni podlagi = **novo P2-E14**.

## B — VGRADNJA

- `src/data/cadastre-a01.json` — 56 stavb (px + lat/lng + vir veze), 7 toponimov,
  meta (vir, merilo, georef metoda + natančnost, manjkajoče B.P.).
- `public/kataster/a01-1824.jpg` — list za web (540 kB, q82).
- `src/components/museum/cadastre-map-view.tsx` — **dva pogleda**:
  - **List A01 (1824)**: CRS.Simple, avtentični list, pike na pikselnih legah
    (exakt!), toponimi, fitBounds, iskanje po parceli/hiši/lastniku, klik na
    vrstico = flyTo; vsaka pika v popupu pokaže vir veze (evidence);
  - **Danes (primerjava)**: OSM + provizoričen overlay s prosojnostjo
    (drsnik) + sidra zbirke (cerkev, ribnik, PGD, središče) + RUMENI
    opozorilni pas »Provizorična georeferenca … Nikar ne beri meja parcel«.
- `map-view.tsx`: sekcija pod živim zemljevidom (dynamic ssr:false).
- i18n: `kataster.*` v vseh 5 jezikih (sl/en/hr/de/it).

## C — TEHNIČNE UČNE TOČKE (bug lov z agent-browserjem)

1. **SSR crash**: `L.latLngBounds` na nivoju modula → `window is not defined`
   → home 500. Fix: lazy getter + dynamic(ssr:false) (vzorec obstoječega kode).
2. **CRS.Simple y-os**: lat raste NAVZGOR, piksli navzdol → pike zrcaljene;
   fix: `position={[H - py, px]}`.
3. **React reconciliation**: dva pogojna `<MapContainer>` istega tipa = React
   jih POSODOBI (ne remonta) → today mapa podeduje CRS.Simple/center/zoom
   lista → ploščice nikoli ne pridejo (tile zahteve na zoom 1 z negativnim y!).
   Fix: `key="kataster-sheet"` / `key="kataster-today"`.
4. Oba popravka potrjena z agent-browserjem (network log + eval map instance).

## D — OMEJITVE (iskreno)

- B.P. 1–29, 57–62, 80–81, 84, 87–88, 90–91, 96–97 niso izluščeni (drobne
  stavbe pri tej ločljivosti) → P3.
- Georeferenca = provizorična (P2-E14: kontrola proti moderni podlagi/GURS).
- Veze lastnikov pokrivajo 11/56 stavb — preostanek čaka celoten kontroliran
  PT prepis (val 41/52 branja p1–p6 nestabilna → P3).
- »Kam je šel« (migracije): za nadaljevanje hiš so viri matrike Podzemelj
  1669–1947 (online) — h.61 primera iz val 47 (1887 Katarina, 1897 Anton);
  sistematsko = P1★ backlog (zahteva branje matrik).

## E — STATUS

- tsc čist, lint čist, **141/141 testov**; agent-browser: oba pogleda
  verificirana (pike na stavbah, iskanje, flyTo, overlay + opozorilo).
- Stanje zbirke: 113/589/469 nespremenjeno; kuratorska vrsta **136** (+P2-E14).
- Surovine: `raw-web-val52-2026-10/` (kvadranti + VLM odgovori + PT branja).
