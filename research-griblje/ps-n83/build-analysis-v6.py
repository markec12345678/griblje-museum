#!/usr/bin/env python3
"""Val 86 — PS N83 analysis v6: KOLONSKI TILE-i (kompozitni, z glavo) — 2. prehod p56–142
+ VGRADNJA J→K korekcije (F-PV-05) v register.json.

METODA (dopolnitev val 85 pilota):
  - kolonski tile-i: stolpčna skupina (name ~0.27–0.46·W; kultur+Flächen ~0.53–0.73·W)
    × pasovna višina h=328 (y-mreža VERBATIM val 80/81/85) + GLAVA STOLPCEV na vsakem
    tile-u (izmerjen top_rule, fallback 50; pas 0 glavo že vsebuje) @nativno + x2 lanczos3
  - VLM bere x2 (primarni 3. glas); prompt NE vsebuje nič iz pass1/pass2/trakov
  - x-sidra: detectRules VERBATIM make-bands-v85.mts + GUARD 8/8 proti crops-manifest-v85.json
  - POMENBA (pilot napake val 86, odpravljeno): tile-i BREZ glave izgubijo sidro
    Jaethe↔Kläfter (p121: 9× only_j napačno; resnica v Kläther — trakovi val 85 + x4 zoom
    + Fürtrag »17|266«). Kompozit z glavo: p121 only_j = 0. Glava = obvezen del sheme.

VGRADNJA (build-register-v86.py, precedens val 61):
  - J↔K dodelitev = strukturna (merjena sidra): tile arbitra kolono; števke = 2-glasne
  - kultur/names: nikoli prepis iz 1. glasu → variant fields (kultur_tile_v86, owner_tile_v86)
  - reading_pass: v86-colonial-tiles (p56–142); p143 (3 vrstice, rdeči povzetek) ostaja pass1
§4: per-parcelne trditve ostajajo NIČ; vsak popravek nosi snimko *_pass1_v82 + review oznako.
"""
import json, os, re, collections

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
OUTD = f'{REPO}/research-griblje/ps-n83'
BD = f'{REPO}/research-griblje/raw-web-val86-2026-10'

# ---------- GUARDS ----------
for f in (f'{OUTD}/band-v86/compare-tiles-v86.json', f'{OUTD}/band-v86/register-v86-changes.json'):
    assert os.path.exists(f), f'guard: manjka {f}'
reg = json.load(open(f'{OUTD}/register.json'))
assert len(reg) == 2871, 'guard: register'
v86 = [r for r in reg if r.get('reading_pass') == 'v86-colonial-tiles']
assert all(r['page'] >= 56 and r['page'] <= 142 for r in v86), 'guard: v86 obseg'
# pokritost = strani z vsaj enim kultur tile branjem (deterministično iz vlm-v86/)
BDv = f'{BD}/vlm-v86'
import collections as _c
_kc = _c.Counter()
for _f in os.listdir(BDv):
    if _f.endswith('.json') and '-t-kultur' in _f and 'ERROR' not in json.load(open(f'{BDv}/{_f}')):
        _kc[int(_f[1:4])] += 1
cov_pages = sorted(p for p, n in _kc.items() if n == 4)
exp_rows = sum(1 for r in reg if r['page'] in cov_pages)
assert len(v86) == exp_rows, f'guard: v86 vrstic {len(v86)} != pokritost {exp_rows}'
assert all(r.get('reading_pass') != 'v86-colonial-tiles' for r in reg if r['page'] < 56 or r['page'] == 143), 'guard: p<56/p143 nedotaknjeni'

comp = json.load(open(f'{OUTD}/band-v86/compare-tiles-v86.json'))
chg = json.load(open(f'{OUTD}/band-v86/register-v86-changes.json'))

# VLM statistika IZ COMITTANIH artefaktov (log je gitignored — *.log):
# število prebranih tile-ov = vlm-v86/*.json; napake = ERROR vnosi; OK klici ≈ št. JSON
# (resumable skripta: ena datoteka = en uspešen klic; 429 zadržki so v logu, ne tu).
tiles_total = len(json.load(open(f'{BD}/tiles-manifest-v86.json'))['tiles'])
json_files = sorted(f for f in os.listdir(f'{BD}/vlm-v86') if f.endswith('.json'))
ok_calls = len(json_files)
tiles_read = len(json_files)
errors = 0
for f in json_files:
    j = json.load(open(f'{BD}/vlm-v86/{f}'))
    if 'ERROR' in j: errors += 1
retry_429 = -1  # ni rekonstruiran iz comittanih artefaktov (glej tile-read-v86.log lokalno)

stats = comp['summary']['fields']
tally = chg['tally']
jk_corr = tally.get('v86-tiles-jk', 0)
jk_split = tally.get('v86-pass2-split', 0) + tally.get('v86-pass1-split', 0)
jk_arb = tally.get('v86-tiles-arbitrated', 0)
jk_marker_review = tally.get('v86-review-pass-digit-split', 0) + tally.get('v86-review-col-split', 0)
jk_marker_explicit = tally.get('v86-explicit-jk-kept', 0)
jk_conf = tally.get('v86-confirmed-3x', 0)
digit_mm = chg['meta'].get('digit_mismatch', 0)

# J/K razporeditev tile-ov po vseh straneh (merjeno)
jk_sum = collections.Counter()
for p in comp['pages']:
    for k, v in p.get('jk_distribution_tiles', {}).items():
        jk_sum[k] += v
tot_jk = sum(jk_sum.values())
assert tot_jk > 0, 'guard: jk distribucija'
only_j_pct = round(jk_sum['only_j'] / tot_jk * 100, 1)
assert only_j_pct < 5.0, f'guard: tile only_j {only_j_pct}% ≥ 5 % (glava ne deluje?)'

# Fürtrag veriga (tile glas) — monotona kontrola F11: zaporedje strani z Fürtragom
f_by_page = {}
for f in comp.get('fuertrag', []):
    if f['voice'] == 'tile' and f['page'] not in f_by_page:
        f_by_page[f['page']] = f"{f['label']}: {f['value']}"

analysis = {
    'title': 'PS N83 kolonski tile-i (kompozitni, z glavo) — 2. prehod p56–142 + vgradnja J→K (F-PV-05)',
    'val': 86,
    'date': '2026-09-27',
    'issue': '#42 §4/§14 + #43',
    'method': {
        'vlm_calls': ok_calls,
        'errors': errors,
        'rate_429_retries': retry_429 if retry_429 >= 0 else 'glej tile-read-v86.log (gitignored)',
        'permanent_failures': 'glej tile-read-v86.log (gitignored)',
        'tiles_total': tiles_total,
        'tiles_read': tiles_read,
        'faza_K': 'kultur tile-i (kultur+jaethe+klafter ~0.53–0.73·W) × 4 pasovi (h=328, shema val 80/81/85) + glava, x2, vse strani 56–142',
        'faza_N': 'name tile-i (haus+name+stand+wohnort ~0.27–0.46·W) — po kvoti; manjkajoči glas ostaja 2-glasen (PROVISIONAL)',
        'glava': f'izmerjen top_rule po strani (prvo horizontalno pravilo v [30,120], fallback 50); pas 0 glavo že vsebuje',
        'sidra': 'x = detectRules VERBATIM make-bands-v85.mts; GUARD 8/8 proti crops-manifest-v85.json',
    },
    'method_result': {
        'tiles_vs_rows1': {str(p['page']): {'tile_kultur': p['tiles_kultur_n'], 'rows1': p['rows1'], 'dedupe': p['dedupe_kultur']} for p in comp['pages'][:12]},
        'jk_distribution_tiles_all': dict(jk_sum),
        'verdikt': 'kompozitni tile-i (z glavo) = stabilna struktura (dedupe rezov) + pravilna dodelitev J↔K (only_j ~0 %)',
    },
    'findings': {
        'F-PV-05': {
            'id_note': 'val 85 nova najdba — sistemski pomik J→K; val 86 = VGRADNJA korekcije na izvor',
            'status': 'VGRADJENA (register.json p56–142; snimke *_pass1_v82 + review oznake)',
            'meritev': {
                'tile_only_j_vseh_strani': f"{jk_sum['only_j']}/{tot_jk} = {only_j_pct}%",
                'tile_only_k': f"{jk_sum['only_k']}/{tot_jk} = {round(jk_sum['only_k']/tot_jk*100,1)}%",
                'tile_both': f"{jk_sum['both']}/{tot_jk} = {round(jk_sum['both']/tot_jk*100,1)}%",
            },
            'vgradnja': {'jk_popravki': jk_corr, 'razdelitve_N_K': jk_split, 'arbitrirani_razkoli': jk_arb,
                         'marker_razdelitev_izrecno': jk_marker_explicit, 'marker_review_razlike': jk_marker_review,
                         'razlike_v_stevilkah_flag': digit_mm},
        },
        'F-PV-04': {
            'id_note': 'rešitvena pot za imena/kultur/površine (NR-14)',
            'status': 'DELNO IZVEDENA (val 86): kultur tile-i na vseh straneh; name tile-i po kvoti',
            'soglasje_3glasu': {f: stats[f] for f in ('jaethe', 'klafter', 'kultur', 'kultur_first') if stats.get(f, {}).get('total')},
        },
        'F11': {
            'id_note': 'Fürtrag veriga — monotona kontrola po val 86',
            'status': 'DOKUMENTIRANA (tile glas; veriga v compare-tiles-v86.json → fuertrag)',
            'vzorec': dict(sorted(f_by_page.items())[:12]),
        },
    },
    'inputs': {
        'surovine': 'research-griblje/raw-web-val86-2026-10/ (make-tiles-v86.mts, tile-read-v86.mts, tiles-manifest-v86.json, vlm-v86/; crops-v86 regenerabilno — gitignored)',
        'primerjave': 'research-griblje/ps-n83/band-v86/ (compare-tiles-v86.json, register-v86-changes.json)',
    },
    'next_reads': [
        'name tile-i preostale strani (faza N, ko kvota dovoli) → imena/stand/wohnort 3. glas + owner_tile_v86 variante',
        'Fürtrag monotona kontrola čez celo verigo (13-točkovna val 61 + v85 + v86)',
        'PZ p48–65 2. prehod (protokoli + Zusammenstellung A/B — p65 REVIEW)',
        'PT p7 @300dpi (KG-F01/F04); PR Grenz-Beschreibung (F-PZ-05)',
        'izven peskovnika: zunanji Rektifikacijski protokol (F-PZ-04 Δ 3 J), šolski list / SA Podzemelj / SI AS 749 / Zucchelli',
    ],
}

with open(f'{OUTD}/analysis-v6.json', 'w') as fh:
    json.dump(analysis, fh, ensure_ascii=False, indent=1)
print(f'analysis-v6: vlm {ok_calls} prebranih tile-ov / {errors} napak; jk popravki {jk_corr}, razdelitve {jk_split}, arbitraže {jk_arb}, potrjeno 3x {jk_conf}; only_j {only_j_pct}%')
