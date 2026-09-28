#!/usr/bin/env python3
"""Val 86b — F11 Fürtrag MONOTONA KONTROLA čez celo verigo (PS N83, SI AS 176/N/N83/s/PS).

Kontekst:
  - val 61 (research-griblje/74): veriga 13 točk p5–p54 VERIFIKIRANA z agentovim direktnim
    vidom (2 prehoda, 0 VLM) — števci 2,9,10,12,14,18,22,30,33,38,39,42,52 "strogo monotona,
    0 kršitev". Format vrstice: "N. Fürtrag. | J | Quad.Klafter"; tiskana oznaka VEDNO
    "Fürtrag." — VSE VLM oznake so napačne branja (Fußtrag, Fürtrg, Fürbaß, Urtheil, ...).
  - val 85 (research-griblje/99): 7 vzorčnih točk p56+ (p58=56.F 6|1009+red, p59=57.F
    9|1085+red, p84=92.F 7|1135→red 636, p98=96.F 11|835, p109=109.F 10|1056,
    p121=119.F 17|266→red 12|1046, p133=137.F 7|934→red 5|1311).
  - val 86 (research-griblje/100): Fürtrag = NAJŠIBKEJŠE branje vseh treh glasov
    (p58: 6/1009 vs 6/1000 vs 6/1169) → REVIEW raven; kontrola čeka celotno verigo (86b).

Metoda (86b) — NIČ sprememb podatkov (§4/§22), samo merjenje:
  A. SIDRA val 61 (p1–55, 13 točk) = bazna resnica (statični vhod, tab. 2.1).
  B. VERIGA p56–143 iz 3 glasov (pass1 val82 / pass2 val83 / tile-i val86):
     - števec: vodilno število v oznaki, ki ostane po odstranitvi števila; glede na
       fuzzy ujemanje (Levenshtein ≤ 2, de-umlaut) z "furtrag" = STROGI kandidat,
       sicer SUMNIK (oznaka ni prepoznana — zabeležen, ne vključen v strogo verigo);
     - vrednost: vsi pari (J, QKl) iz vrstice (J ≤ 99, 100 ≤ QKl ≤ 99999) — rdeči
       popravki in prečrtano so dodatni pari, NIGDJE tiho odstranjeni.
  C. KONTROLE:
     1. stroga števčna veriga monotona (ne-padajoča); sumniki posebej;
     2. veznost p54 (52, val 61) → prvi strogi števec p56+;
     3. 3-glasovno soglasje QKl po strani; brez skupnega QKl = REVIEW;
     4. aritmetika: vsota QKl register vrstic strani vs Fürtrag QKl glasov
        (razlika = REVIEW — prečrtano/rdeče/zaokrožitve; NIČ korekcij);
     5. sidra val 85: vsaj 1 glas ujema pričakovano (J|QKl ali števec).

Izhod: ps-n83/band-v86/f11-fuertrag-v86.json (COMMITTED artefakt).
Vhod je lahko DELNO pokrit (kvota) — pokritost poročana pošteno (§4).
"""
import json, os, re, collections

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
P1D = f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm'
P2D = f'{REPO}/research-griblje/raw-web-val83-2026-10/ps-vlm'
TDIR = f'{REPO}/research-griblje/raw-web-val86-2026-10'
REG = f'{REPO}/research-griblje/ps-n83/register.json'
OUTD = f'{REPO}/research-griblje/ps-n83/band-v86'

PAGES = list(range(56, 144))  # p143 = rdeči povzetek (veriga; tile-i ne)
BANDS = 4

ANCHORS_V61 = {5: (2, 6, 1459), 11: (9, 2, 798), 12: (10, 4, 7986), 14: (12, 6, 1088),
               16: (14, 5, 811), 20: (18, 6, 1183), 24: (22, 8, 1310), 32: (30, 6, 1244),
               35: (33, 2, 798), 36: (38, 2, 1578), 42: (39, 7, 365), 44: (42, 4, 1030),
               54: (52, 8, 1165)}
ANCHORS_V85 = {58: (56, 6, 1009), 59: (57, 9, 1085), 84: (92, 7, 1135), 98: (96, 11, 835),
               109: (109, 10, 1056), 121: (119, 17, 266), 133: (137, 7, 934)}

def norm(v):
    if v is None: return ''
    return re.sub(r'\s+', ' ', str(v).strip()).strip()

def area_to_qkl(v):
    """Površinska vrednost → Quadrat-Klafter (Joch = 1600 QKl, val 61 format-dekodiran).
    '1.1348' → 1*1600+1348 = 2948 · '549' → 549 · gestrichen → None (izključen iz vsote).
    """
    s = norm(v)
    if not s: return 0
    if 'gestrichen' in s.lower(): return None
    s = re.sub(r'\[[^\]]*\]', '', s).strip()
    m = re.fullmatch(r'(\d{1,2})[.,|](\d{1,5})', s)
    if m:
        return int(m.group(1)) * 1600 + int(m.group(2))
    n = re.sub(r'\D', '', s)
    return int(n) if n else 0

def row_area_qkl(ja, kl):
    """Vsota površine vrstice iz obeh polj (vsako posebej J|QKl razčlenjen);
    gestrichen na kateremkoli polju = celotna vrstica izključena (None)."""
    vj, vk = area_to_qkl(ja or ''), area_to_qkl(kl or '')
    if vj is None or vk is None: return None
    return vj + vk

def deumlaut(s):
    return (s.lower().replace('ä', 'a').replace('ö', 'o').replace('ü', 'u')
            .replace('ß', 'ss').replace('é', 'e').replace('è', 'e'))

def lev1(a, b):
    """Levenshtein razdalja (iterativno, majhni nizi)."""
    if a == b: return 0
    la, lb = len(a), len(b)
    if abs(la - lb) > 3: return 99
    prev = list(range(lb + 1))
    for i in range(1, la + 1):
        cur = [i] + [0] * lb
        for jj in range(1, lb + 1):
            cur[jj] = min(prev[jj] + 1, cur[jj - 1] + 1, prev[jj - 1] + (a[i - 1] != b[jj - 1]))
        prev = cur
    return prev[lb]

def is_furtrag_word(w):
    w = re.sub(r'[^a-z]', '', deumlaut(w or ''))
    if not w or len(w) > 12: return False
    return lev1(w, 'furtrag') <= 2

def parse_pairs(s):
    """Vsi pari (J, QKl) iz niza: J ≤ 99, 100 ≤ QKl ≤ 99999; vrne tudi single vrednosti."""
    s = norm(s)
    flags = []
    low = s.lower()
    if 'gestrichen' in low: flags.append('gestrichen')
    if '[rot]' in low: flags.append('rot')
    s = re.sub(r'\[[^\]]*\]', ' ', s)
    s = s.replace('|', ' / ').replace(':', ' / ').replace('-', ' / ')
    s = s.replace('J', ' ').replace('j', ' ')
    toks = [t for t in re.split(r'[ /.,;]+', s) if re.fullmatch(r'\d{1,6}', t or '')]
    nums = [int(t) for t in toks]
    pairs, singles = [], []
    i = 0
    while i < len(nums):
        a = nums[i]
        if i + 1 < len(nums):
            b = nums[i + 1]
            if a <= 99 and 100 <= b <= 99999:
                pairs.append((a, b)); i += 2; continue
            if b <= 99 and 100 <= a <= 99999:
                pairs.append((b, a)); i += 2; continue
        singles.append(a); i += 1
    return pairs, singles, flags

def parse_line(label, value):
    """Razčleni totals/vrstico → {'counter': int|None, 'strict': bool, 'pairs': [...], 'singles': [...], 'flags': [...]}"""
    ll, vl = norm(label), norm(value)
    pairs, singles, flags = parse_pairs(vl)
    # če je value brez števil, poskusi label (brez vodilnega števca)
    if not pairs and not singles:
        p2, s2, f2 = parse_pairs(re.sub(r'^\d{1,3}\.?\s*', '', ll))
        pairs, singles, flags = pairs + p2, singles + s2, flags + f2
    counter, strict = None, False
    m = re.match(r'^\s*(\d{1,3})\.?\s+(.*)$', ll)
    if m:
        counter = int(m.group(1))
        rest = m.group(2)
        strict = is_furtrag_word(re.sub(r'\d', ' ', rest))
        if not strict and not pairs and not singles:
            counter, strict = None, False  # števec brez fürtrag oblike in brez vrednosti = šum
    return {'counter': counter, 'strict': strict, 'pairs': pairs, 'singles': singles, 'flags': sorted(set(flags))}

def collect_pass(dd):
    out = []
    for tt in (dd.get('totals') or []):
        label, value = norm(tt.get('label')), norm(tt.get('value'))
        if not (label or value): continue
        p = parse_line(label, value)
        if p['counter'] is None and not p['pairs'] and not p['singles']: continue
        p.update({'src_label': label, 'src_value': value})
        out.append(p)
    return out

def collect_tiles(pg):
    out, full = [], True
    for b in range(BANDS):
        f = f'{TDIR}/vlm-v86/p{pg:03d}-t-kultur{b}-T.json'
        if not os.path.exists(f): return out, False
        d = json.load(open(f))
        if 'ERROR' in d: return out, False
        for tt in (d.get('totals') or []):
            p = parse_line(norm(tt.get('label')), norm(tt.get('value')))
            if p['counter'] is None and not p['pairs'] and not p['singles']: continue
            p.update({'src': f'band{b}'})
            out.append(p)
        for r in (d.get('rows') or []):
            kul = re.sub(r'[^a-zäöüß ]', '', norm(r.get('kultur')).lower()).strip()
            first = kul.split(' ')[0] if kul else ''
            nums = parse_pairs(f"{norm(r.get('jaethe'))} {norm(r.get('klafter'))}")
            if is_furtrag_word(first) and (nums[0] or nums[1]):
                p = parse_line('', f"{norm(r.get('jaethe'))} {norm(r.get('klafter'))}")
                p['src'] = f'band{b}-row'
                out.append(p)
    return out, True

def voice_value_set(entries):
    """Vse površinske vsote (J*1600+QKl iz parov; singles ≥ 100) na glas."""
    out = set()
    for p in entries:
        for (j, q) in p['pairs']: out.add(j * 1600 + q)
        for s in p['singles']:
            if s >= 100: out.add(s)
    return out

def main():
    reg = json.load(open(REG))
    pages = {}
    for pg in PAGES:
        e = {'page': pg}
        f1, f2 = f'{P1D}/p{pg:03d}.json', f'{P2D}/p{pg:03d}.json'
        e['p1'] = collect_pass(json.load(open(f1))) if os.path.exists(f1) else []
        e['p2'] = collect_pass(json.load(open(f2))) if os.path.exists(f2) else []
        e['tile'], e['tile_full'] = collect_tiles(pg)
        rows = [r for r in reg if r['page'] == pg]
        vals = [row_area_qkl(r.get('jaethe'), r.get('klafter')) for r in rows]
        gestr = sum(1 for v in vals if v is None)
        s_total = sum(v for v in vals if v is not None)
        # razpad po kultur (surovo dejstvo za poročilo; enote po kultur = TO-DECODE, val 61)
        by_k = collections.Counter()
        for r, v in zip(rows, vals):
            if v is None: continue
            k = re.sub(r'\s+', ' ', (r.get('kultur') or '?')).split()[0][:16].lower()
            by_k[k] += v
        e['register'] = {'rows': len(rows), 'sum_qkl_total': s_total, 'gestrichen_rows': gestr,
                         'by_kultur': dict(by_k.most_common())}
        pages[str(pg)] = e

    # --- C1: stroga števčna veriga + sumniki
    chain, suspects = [], []
    for pg in PAGES:
        e = pages[str(pg)]
        strict_cnt, suspect_cnt = [], []
        for tag, entries in (('p1', e['p1']), ('p2', e['p2']), ('tile', e['tile'])):
            for p in entries:
                if p['counter'] is None: continue
                (strict_cnt if p['strict'] else suspect_cnt).append({'voice': tag, 'counter': p['counter'], 'label': p.get('src_label', p.get('label', ''))})
        chain.append({'page': pg, 'strict': sorted({c['counter'] for c in strict_cnt}),
                      'n_strict_voices': len(strict_cnt)})
        if suspect_cnt:
            suspects.append({'page': pg, 'suspects': suspect_cnt})
    violations = []
    seen = None
    for c in chain:
        if not c['strict']: continue
        s = c['strict'][0]
        if seen is not None and s < seen:
            violations.append({'page': c['page'], 'counter': s, 'prev_strict': seen})
        seen = s
    # --- C2: veznost p54 (52) → prvi strogi števec
    first = next((c for c in chain if c['strict']), None)
    link54 = {'p54_counter': ANCHORS_V61[54][0]}
    if first:
        link54.update({'first_strict_page': first['page'], 'first_strict_counter': first['strict'][0],
                       'delta': first['strict'][0] - ANCHORS_V61[54][0],
                       'ok': 0 < first['strict'][0] - ANCHORS_V61[54][0] <= first['page'] - 54})
    # --- C3: 3-glasovno soglasje QKl
    voice_review = []
    for pg in PAGES:
        e = pages[str(pg)]
        vals = {}
        for tag, entries in (('p1', e['p1']), ('p2', e['p2']), ('tile', e['tile'])):
            q = voice_value_set(entries)
            if q: vals[tag] = sorted(q)
        if len(vals) >= 2 and len(set.intersection(*[set(v) for v in vals.values()])) == 0:
            voice_review.append({'page': pg, 'voices_qkl': vals, 'verdict': 'REVIEW'})
    # --- C4: aritmetika (vsi glasovi + register v prostoru J*1600+QKl)
    arithmetic = []
    for pg in PAGES:
        e = pages[str(pg)]
        voice_q = {}
        for tag, entries in (('p1', e['p1']), ('p2', e['p2']), ('tile', e['tile'])):
            q = voice_value_set(entries)
            if q: voice_q[tag] = sorted(q)
        rk = e['register']['sum_qkl_total']
        rec = {'page': pg, 'register_qkl_total': rk, 'gestrichen_rows': e['register']['gestrichen_rows'],
               'rows': e['register']['rows'], 'tile_full': e['tile_full'], 'voices_qkl_total': voice_q,
               'register_by_kultur': e['register']['by_kultur']}
        if voice_q:
            diffs = {tag: min(abs(q - rk) for q in qs) for tag, qs in voice_q.items()}
            best_tag = min(diffs, key=lambda t: diffs[t])
            rec['best_voice'] = best_tag
            rec['best_diff'] = diffs[best_tag]
            rec['verdict'] = 'OK' if diffs[best_tag] == 0 else 'REVIEW'
        else:
            rec['verdict'] = 'NO_FURTRAG'
        arithmetic.append(rec)
    # --- C5: sidra val 85
    anchors_check = []
    for pg, (cnt, j, qkl) in sorted(ANCHORS_V85.items()):
        e = pages[str(pg)]
        hits = []
        for tag, entries in (('p1', e['p1']), ('p2', e['p2']), ('tile', e['tile'])):
            for p in entries:
                if p.get('counter') == cnt or qkl in [q for (_, q) in p['pairs']]:
                    hits.append(tag); break
        anchors_check.append({'page': pg, 'expect': {'counter': cnt, 'j': j, 'qkl': qkl},
                              'voices_hit': sorted(set(hits)), 'any_voice_match': bool(hits)})

    n_rev = len(voice_review)  # noqa
    ok = sum(1 for a in arithmetic if a.get('verdict') == 'OK')
    rev = sum(1 for a in arithmetic if a.get('verdict') == 'REVIEW')
    nof = sum(1 for a in arithmetic if a.get('verdict') == 'NO_FURTRAG')
    result = {
        'meta': {'val': '86b', 'generated_by': 'build-f11-fuertrag-v86.py',
                 'method': 'F11 monotona kontrola čez celo verigo: stroga števčna veriga (fuzzy Fürtrag oznaka) + sumniki + 3-glasovno QKl soglasje + aritmetika vs register; NIČ sprememb podatkov (§4/§22)',
                 'pages': f'{PAGES[0]}-{PAGES[-1]}', 'anchors_v61': 13, 'anchors_v85': 7,
                 'joch_qkl': 1600,
                 'tile_full_pages': sum(1 for e in pages.values() if e['tile_full'])},
        'chain': chain, 'counter_monotone': 'OK' if not violations else f'{len(violations)} kršitev',
        'counter_violations': violations, 'counter_suspects': suspects,
        'link_p54_p56': link54, 'voice_review': voice_review, 'arithmetic': arithmetic,
        'anchors_v85_check': anchors_check,
    }
    os.makedirs(OUTD, exist_ok=True)
    json.dump(result, open(f'{OUTD}/f11-fuertrag-v86.json', 'w'), ensure_ascii=False, indent=1)
    print(f'F11: stroga veriga monotona: {result["counter_monotone"]}; sumniki strani: {len(suspects)}')
    print(f'F11: veznost p54→p56+: {link54}')
    print(f'F11: 3-glas QKl REVIEW strani: {n_rev}; aritmetika OK/REVIEW/brez: {ok}/{rev}/{nof}')
    print(f'F11: sidra val 85 (glas zadane): {sum(1 for a in anchors_check if a["any_voice_match"])}/{len(anchors_check)}')

if __name__ == '__main__':
    main()
