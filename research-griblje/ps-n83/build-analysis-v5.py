#!/usr/bin/env python3
"""Val 85 — PS N83 analysis v5: PASOVNI/ZOOM re-read PILOT s kolonskimi sidri (vzorec val 80/81).

Vzorec (determinističen iz reread-v83/comparison.json):
  kvantili full_agree/rows1 (0/25/50/75/100) + p98 (F-PV-03) + p121 (QKlft anomalija)
  + p59 (najslabše ime soglasje) = [58, 59, 84, 98, 109, 121, 133, 143]

METODA (46 VLM klicev @nativno, 0 napak, 0×429):
  faza A: 4 pasovi/stran (h=328, korak=298, 30 px preklop — shema val 80/81) × 8 strani,
          norm različica (nativni piksli + normalizacija kontrasta) = 32 klicev
  faza R: 2 kolonska trakova/stran (name: hiša+ime+stand+wohnort ~0.27–0.46·W;
          kultur: kultur+jaethe+klafter ~0.53–0.73·W) celotna višina, x2.5 lanczos,
          x0/x1 iz IZMERJENIH kolonskih sider (vertikalna pravila, crops-manifest-v85.json)
          = 14 klicev; 7 strani (p143 = rdeči povzetek, izpuščen)
  avtorski odtis: 32 pasov (PRED VLM) + 14 trakov (PRED fazo R) = neodvisen 1. bralec

VERDIKT PILOTA (merjeno, nič ugibanja):
  - horizontalni pasovi: strukturo NESTABILNO (VLM razbija vrstice na reznih robovih:
    172 zlito vs 144 realnih vrstic) → za PS tabele NEPRIMERNA metoda v tej obliki
  - kolonski trakovi: strukturo STABILNO (20–22 vnosov vs 19–21 vrstic) in stolpčno
    dodelitev J↔K REŠENO — ampak x2.5 trak (550×2560) VLM API downscale → glifе slabšе
  - naslednja iteracija = KOLONSKI TILE-i: stolpčna skupina × pasovna višina (328 px)
    @nativno+x2 (hibrid val 80/81 + kolonska sidra)

NOVA NAJDBA F-PV-05 (sistemski pomik J→K v celostranskem prepisu):
  na 140 poravnanih vrsticah vzorca ima enotno numerično vrednost v JAETHE polju:
  pass1 98/140 = 70,0 % · pass2 111/140 = 79,3 % · kolonski trak 0/140 = 0 % (85,0 %
  samo-K, 15,0 % izrecno J+K). Fizikalno (avtorski odtis pravila J|K na trakovih p058/
  p084/p098) so enotne vrednosti v stolpcu Quad. Kläfter → val 82/83 soglasja jaethe
  71,9 % / klafter 68,4 % sta soglasja na SKUPNO NAPAČNI dodelitvi, ne na resnici.
  QKlft 'sane' pravilo val 83 (p121) se generalizira: pisar piše samo Klafter, razen
  izrecnih 'N J' vrst. §22: register.json (2.871 vrstic, reading_pass v82-native-pass1)
  NESPREMENJEN — korekcija na izvoru šele s kolonskim re-readom (val 86).

§4 poštenost: nič tiho popravljeno; per-parcelne trditve ostajajo NIČ; KG v1.9
(sha 526482d2) / story_id / timeline / coverage NESPREMENJENI.
"""
import json, os, re, collections

REPO = '/home/z/griblje-museum'
OUTD = f'{REPO}/research-griblje/ps-n83'
BD = f'{REPO}/research-griblje/raw-web-val85-2026-10'
SAMPLE = [58, 59, 84, 98, 109, 121, 133, 143]

# ---------- GUARDS ----------
for f in (f'{OUTD}/band-v85/compare-v85.json', f'{OUTD}/band-v85/compare-strips-v85.json'):
    assert os.path.exists(f), f'guard: manjka {f}'
reg = json.load(open(f'{OUTD}/register.json'))
assert len(reg) == 2871, 'guard: register'
new_reg = [r for r in reg if r['page'] > 55]
assert all(r.get('reading_pass') == 'v82-native-pass1' for r in new_reg), 'guard: reading_pass spremenjen'

comp_bands = json.load(open(f'{OUTD}/band-v85/compare-v85.json'))
comp_strips = json.load(open(f'{OUTD}/band-v85/compare-strips-v85.json'))

n_vlm = 32 + 14
counts_bands = comp_bands['summary']['rows']

# F-PV-05 izmerjeno (deterministična ponovitev iz surovin)
def numq(v):
    s = re.sub(r'\s+', ' ', str(v or '').strip())
    s = re.sub(r'\[(col\?|angeschnitten|rot|gestrichen[^\]]*|X)\]', '', s)
    return re.sub(r'\D', '', s)

fpv05 = {'rows': 0, 'p1_onlyJ': 0, 'p1_onlyK': 0, 'p1_both': 0,
         'p2_onlyJ': 0, 'p2_onlyK': 0, 'p2_both': 0,
         't_onlyJ': 0, 't_onlyK': 0, 't_both': 0}
STRIP_SAMPLE = [p for p in SAMPLE if p != 143]
for pg in STRIP_SAMPLE:
    p1 = json.load(open(f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm/p{pg:03d}.json'))['rows']
    p2 = json.load(open(f'{REPO}/research-griblje/raw-web-val83-2026-10/ps-vlm/p{pg:03d}.json'))['rows']
    tk = json.load(open(f'{BD}/vlm/p{pg:03d}-z-kultur-R.json'))['rows']
    for i in range(min(len(p1), len(p2), len(tk))):
        fpv05['rows'] += 1
        for tag, coll in (('p1', p1), ('p2', p2), ('t', tk)):
            J, K = numq(coll[i].get('jaethe')), numq(coll[i].get('klafter'))
            if J and K: fpv05[f'{tag}_both'] += 1
            elif J: fpv05[f'{tag}_onlyJ'] += 1
            elif K: fpv05[f'{tag}_onlyK'] += 1

n = fpv05['rows']
assert n == 140, f'guard: F-PV-05 vrstice {n} != 140'
assert fpv05['t_onlyJ'] == 0 and fpv05['t_onlyK'] == 119 and fpv05['t_both'] == 21, 'guard: trak dodelitev'
assert fpv05['p1_onlyJ'] == 98 and fpv05['p2_onlyJ'] == 111, 'guard: pass pomik'

analysis = {
    'title': 'PS N83 pasovni/zoom re-read s kolonskimi sidri — PILOT (vzorec val 80/81)',
    'val': 85,
    'date': '2026-09-27',
    'issue': '#42 §4/§14 + #43',
    'method': {
        'vlm_calls': n_vlm,
        'errors': 0,
        'rate_429': 0,
        'faza_A': '4 pasovi/stran (h=328, korak=298, 30 px preklop — shema val 80/81) × 8 strani, norm, 32 klicev',
        'faza_R': '2 kolonska trakova/stran (name/kultur+Flächen) celotna višina, x2.5 lanczos, sidra iz izmerjenih vertikalnih pravil, 14 klicev, 7 strani (p143 izpuščen)',
        'avtor': 'direkten odtis 32 pasov (pred VLM) + 14 trakov (pred fazo R) — neodvisen 1. bralec',
        'vzorec': SAMPLE,
        'vzorec_pravilo': 'kvantili full_agree/rows1 (reread-v83/comparison.json) 0/25/50/75/100 + p98 + p121 + p59',
    },
    'method_result': {
        'pasovi': {
            'rows_pass1': counts_bands['pass1'], 'rows_pass2': counts_bands['pass2'],
            'rows_band_merged': counts_bands['band'],
            'verdikt': 'NESTABILNO — VLM razbija vrstice na reznih robovih (172 vs 144); sekvenčna poravnava neuporabna → pasovi v tej obliki zavrgljeni za PS tabele',
        },
        'kolonski_trakovi': {
            'entries_vs_rows1': {str(p['page']): {'trak': p['strip_name_n'], 'rows1': p['rows1']} for p in comp_strips['pages']},
            'verdikt': 'STABILNO (±1–2) + stolpčna dodelitev J↔K REŠENA; ampak x2.5 trak VLM downscale → glifе slabšе (imena/kultur na traku slabša od pasov)',
        },
        'naslednja_iteracija': 'KOLONSKI TILE-i: stolpčna skupina × pasovna višina (h=328) @nativno + x2 — hibrid sheme val 80/81 in kolonskih sider (val 86)',
    },
    'findings': {
        'F-PV-05': {
            'id_note': 'NOVA NAJDBA (val 85) — sistemski pomik J→K v celostranskem prepisu',
            'status': 'DOKUMENTIRANA (merjeno na vzorcu; korekcija na izvoru = val 86)',
            'meritev': {
                'rows': n,
                'enotna_vrednost_v_JAETHE_polju': {'pass1': f"{fpv05['p1_onlyJ']}/{n} = {round(fpv05['p1_onlyJ']/n*100,1)}%", 'pass2': f"{fpv05['p2_onlyJ']}/{n} = {round(fpv05['p2_onlyJ']/n*100,1)}%", 'kolonski_trak': f"{fpv05['t_onlyJ']}/{n} = {round(fpv05['t_onlyJ']/n*100,1)}%"},
                'samo_KLAFTER': {'pass1': f"{round(fpv05['p1_onlyK']/n*100,1)}%", 'pass2': f"{round(fpv05['p2_onlyK']/n*100,1)}%", 'kolonski_trak': f"{round(fpv05['t_onlyK']/n*100,1)}%"},
                'izrecno_J_in_K': {'pass1': fpv05['p1_both'], 'pass2': fpv05['p2_both'], 'kolonski_trak': fpv05['t_both']},
            },
            'statement': 'Fizikalno (avtorski odtis pravila J|K na trakovih p058/p084/p098) so enotne vrednosti v stolpcu Quad. Kläfter; obe celostranski prehoda (val 82/83) ju sistemsko vpisujeta v polje jaethe. Soglasji val 83 (jaethe 71,9 %, klafter 68,4 %) sta soglasji na skupno napačni dodelitvi. QKlft sane pravilo val 83 se generalizira.',
            'implikacija': 'register.json p56–143 (v82-native-pass1) jaethe/klafter polja so PROVISIONAL tudi po 2 prehodih; per-parcelna uporaba brez kolonske korekcije NEVELJAVNA (okrepa NR-14). §22: register NESPREMENJEN.',
        },
        'F-PV-04': {
            'status': 'REŠITVENA POT VALIDIRANA-V85 (pilot) — kolonski tile-i, ne horizontalni pasovi',
            'meritev': 'pasovi nestabilni (172 vs 144 vrstic); trakovi stabilni (±1–2) in rešujejo J/K; tile-i (kolona × h=328) so naslednja iteracija',
        },
        'F-PV-03': {
            'status': 'OPEN (pilot NI dvignil na 2×) — p98: pasovni VLM tretjič dokazano SKRAJŠA kultur (1/22 Reb/Weing omemb); avtorski trak odtis kaže dvostropične opise z Weing na vseh ~20 vrstah [?] — kvantitativa s PV (7 J 665 K) čaka kolonske tile-e',
        },
        'F11': {
            'status': 'DELNO POTRJENO-V85 — Fürtrag veriga na vzorcu prebrana (pasovi + trakovi + avtor, soglasje ≥ 2 kjer obstaja): p58 = 56. Fürtrag 6 J 1009 + rdeče 1306 · p59 = 57. F. 9 J 1085 + rdeče 762 · p84 = 92. F. 7 J 1135 → rdeče 636 · p98 = 96. F. 11 J 835 · p109 = 109. F. 10 J 1056 · p121 = 119. F. 17 J 266 → rdeče 12 1046 · p133 = 137. F. 7 J 934 → rdeče 5 1311. Monotona kontrola čaka val 86.',
            'qklft_anomalija': 'val 83 "J=1725" (p121) = dejansko "17 J 266" z rdečo korekturo 12 1046 — na traku vidno, sane pravilo potrjeno',
        },
        'F15': {
            'status': 'REPRODUCIRANO-V85 — p133 = posebna sekcija brez osebnih imen (kolonska branja: trak "Waldung"[?] vs avtor "Weg"[?] — vsebina REVIEW); no_blatt = Uebersetzung zaporedje 2661+; rimski oznaki IV/V v no_blatt',
        },
    },
    'inputs': {
        'surovine': 'research-griblje/raw-web-val85-2026-10/ (skripti, manifesti, author-notes.json, vlm/ 46 JSON+raw; pasovi/trakovi regenerabilni — gitignored)',
        'primerjave': 'research-griblje/ps-n83/band-v85/ (compare-v85.json pasovi, compare-strips-v85.json trakovi)',
    },
    'next_reads': [
        'val 86 — KOLONSKI TILE-i p56–143: stolpčna skupina (name; kultur+Flächen) × pasovna višina h=328 @nativno+x2, sidra iz crops-manifest-v85.json; vgradnja J→K korekcije + imena/kultur s soglasjem ≥ 2',
        'Fürtrag monotona kontrola (F11) po val 86',
        'PZ p48–65 2. prehod (protokoli + Zusammenstellung A/B — p65 REVIEW)',
        'PT p7 @300dpi (KG-F01/F04); PR Grenz-Beschreibung (F-PZ-05)',
        'izven peskovnika: zunanji Rektifikacijski protokol (F-PZ-04), šolski list / SA Podzemelj / SI AS 749 / Zucchelli',
    ],
}

with open(f'{OUTD}/analysis-v5.json', 'w') as fh:
    json.dump(analysis, fh, ensure_ascii=False, indent=1)
print('analysis-v5.json: OK')
print(f"F-PV-05: p1_onlyJ={fpv05['p1_onlyJ']}/{n}, p2_onlyJ={fpv05['p2_onlyJ']}/{n}, t_onlyJ={fpv05['t_onlyJ']}, t_onlyK={fpv05['t_onlyK']}, t_both={fpv05['t_both']}")
