#!/usr/bin/env python3
"""Val 90 — C4 ARITMETIKA ("metrika stolpcev TO-DECODE") — DETERMINISTIČNA IZČRPNA
PREVERBA KONVENCIJ (PS N83, SI AS 176/N/N83/s/PS). NIČ VLM, NIČ spleta, NIČ kvote.

Kontekst:
  - val 61 (research-griblje/74): sidra p5–54 (13 točk, agentov direktni vid, 0 VLM);
    §2.2 `value_semantics_status.confirmed` = "(J|QKl) = vsota TEKOČE strani, ne
    kumulativa (p11 2J798 < p5 6J1459 izključi kumulacijo)"; izrecno odloženo:
    "aritmetična kontrola sešteka vrstic šele pri 143/143".
  - val 86b (research-griblje/101): C4 p56–143 = 0 OK / 76 REVIEW / 12 brez —
    "sistematično neničelne razlike; razpad po kultur zabeležen; hipoteze izrecno
    neodločene (§4)".
  - Val 90 izvrši ODLOŽENO aritmetično kontrolo vala 61 na sidrih in izčrpa
    deterministični prostor konvencij na obstoječih (comittanih) podatkih.

Metoda (val 90) — NIČ sprememb podatkov (§4/§22), samo merjenje:
  Vhod (vsi comittani artefakti, 0 VLM):
    - ps-n83/register.json (2.871 vrstic; p1–55 val 57 + p56–143 v82-native-pass1 + sloji)
    - ps-n83/reread-2026-10/totals-reread.json (val 61: verified_chain 13 točk
      z `value`, `crossed`, `red_line`, agent_notes)
    - ps-n83/band-v86/f11-fuertrag-v86.json (val 86b: glasovi p56–143)
    - parser 1:1 iz build-f11-fuertrag-v86.py (import; nič podvojenega)
  Prostor J*1600+QKl (Joch = 1600 QKl, val 61 format-dekodiran).
  Konvencije (vsaka izčrpano testirana na 13 sidrih):
    K1  vsota strani (gestrichen izključeno)               == anchor value
    K2  vsota strani (gestrichen VKLJUČENO, surovo)        == anchor value
    K3  KATERI KOLI zvezni odsek vrstic strani (i..j)      == anchor value
    K4  priponska sekcija ČEZ strani (s..konec strani,     == anchor value
        s do 160 vrstic nazaj — sekcija, ki se zapre)
    K5  imenski bloki (dito, owner_was_ditto) + unije      == anchor value
        do 5 sosednjih zaključenih blokov
    K6  rdeče poprave (red_line, 7 strani)                 == K1/K2 vsota strani
    K7  p56–143: glasovi (p1/p2/tile) vs vsota strani      == reprodukcija C4 val 86b
        (pričakovano 0 OK / 76 REVIEW / 12 brez — kontrola usklajenosti)
    K8  usklajenost dveh vnosov sidrov: ANCHORS_V61 (f11 builder) vs verified_chain
        (totals-reread) — vrednosti, crossed, red_line; p44 dvojno branje dokumentirano
    K9  konfunda indikatorji F-PV-05 na p1–55: jaethe-only / klafter-only vrstice,
        jaethe > 99 (nemogoče št. Jochov), klafter > 1599 (nemogoče QKl) —
        kvantifikacija tveganja stolpčne dodelitve (ODLOČILNA kontrola za interpretacijo
        K1–K5; na p56–143 primerjalno po v86/v88 slojih)
    K10 opazovalni register: podvojeni anchor vrednosti (p11 = p35 = 2|798),
        p56 glas p1 (11059) == p5 anchor (6|1459) — surova dejstva, brez sklepanja

Izhod: ps-n83/band-v86/c4-metrika-v90.json (COMMITTED artefakt; determinističen,
re-run byte-identno; testno varovano v tests/val90-c4-metrika.test.ts).
"""
import json, os, re, sys, hashlib, collections

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)

# parser 1:1 iz val 86b (nič podvojenega — ista funkcija, ista semantika)
import importlib.util
_spec = importlib.util.spec_from_file_location('f11', os.path.join(HERE, 'build-f11-fuertrag-v86.py'))
f11 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(f11)
row_area_qkl, ANCHORS_V61 = f11.row_area_qkl, f11.ANCHORS_V61

REG = os.path.join(HERE, 'register.json')
REREAD = os.path.join(HERE, 'reread-2026-10', 'totals-reread.json')
F11 = os.path.join(HERE, 'band-v86', 'f11-fuertrag-v86.json')
OUTD = os.path.join(HERE, 'band-v86')
OUT = os.path.join(OUTD, 'c4-metrika-v90.json')

JOCH = 1600
PAGES = list(range(56, 144))


def sha256(p):
    h = hashlib.sha256()
    with open(p, 'rb') as fh:
        for chunk in iter(lambda: fh.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()


def parse_jq(s):
    """'6|1459' → 6*1600+1459 = 11059; None, če ni formata."""
    s = f11.norm(s)
    if not s:
        return None
    m = re.fullmatch(r'(\d{1,2})\s*[|/]\s*(\d{1,5})', s)
    if m:
        return int(m.group(1)) * JOCH + int(m.group(2))
    return None


def raw_digits(s):
    """Surove številke iz niza (gestrichen VKLJUČENO): '1.1348' → 2948; '549' → 549."""
    s = f11.norm(s)
    if not s:
        return 0
    s2 = re.sub(r'\[[^\]]*\]', '', s).strip()
    m = re.fullmatch(r'(\d{1,2})[.,|](\d{1,5})', s2)
    if m:
        return int(m.group(1)) * JOCH + int(m.group(2))
    n = re.sub(r'\D', '', s2)
    return int(n) if n else 0


def main():
    reg = json.load(open(REG))
    reread = json.load(open(REREAD))
    f11art = json.load(open(F11))
    chain = reread['verified_chain']

    by_page = collections.defaultdict(list)
    for i, r in enumerate(reg):
        by_page[r['page']].append((i, r))

    # --- vsote strani
    page_sum_excl, page_sum_incl = {}, {}
    for pg, rows in by_page.items():
        s1 = s2 = 0
        for _, r in rows:
            v = row_area_qkl(r.get('jaethe'), r.get('klafter'))
            s1 += v if v is not None else 0
            s2 += raw_digits(r.get('jaethe') or '') + raw_digits(r.get('klafter') or '')
        page_sum_excl[pg], page_sum_incl[pg] = s1, s2

    # --- zaporedje vrstic (globalni indeksi) za K3/K4
    seq = [(r['page'], row_area_qkl(r.get('jaethe'), r.get('klafter'))) for r in reg]
    page_start, page_end = {}, {}
    for i, (pg, _) in enumerate(seq):
        page_start[pg] = page_start.get(pg, i)
        page_end[pg] = i
    pre = [0]
    for _, v in seq:
        pre.append(pre[-1] + (v if v is not None else 0))

    # --- imenski bloki (dito) — K5
    blocks = []
    cur = None
    for i, r in enumerate(reg):
        name = f11.norm(r.get('owner_original'))
        ditto = bool(r.get('owner_was_ditto'))
        if (not ditto) and name not in ('', '~'):
            if cur is not None:
                blocks.append(cur)
            cur = {'i0': i, 'i1': i, 'pages': [r['page']], 'sum': 0}
        elif cur is not None:
            cur['i1'] = i
            if r['page'] not in cur['pages']:
                cur['pages'].append(r['page'])
        v = row_area_qkl(r.get('jaethe'), r.get('klafter'))
        if cur is not None and v is not None:
            cur['sum'] += v
    if cur is not None:
        blocks.append(cur)

    # --- K1..K6 na 13 sidrih
    konv = []
    for c in sorted(chain, key=lambda x: x['page']):
        pg = c['page']
        aq = parse_jq(c['value'])
        aq_alt = parse_jq(str(c.get('red_line') or ''))
        rows = by_page.get(pg, [])
        n = len(rows)
        k1 = (page_sum_excl[pg] == aq) if aq is not None else None
        k2 = (page_sum_incl[pg] == aq) if aq is not None else None
        # K3: zvezni odseki znotraj strani (vse vrednosti ≥ 0 → zgodnji izhod veljaven)
        k3_hits = []
        if aq is not None:
            vals = [v if v is not None else 0 for _, v in [(i, row_area_qkl(r.get('jaethe'), r.get('klafter'))) for i, r in rows]]
            for i in range(n):
                s = 0
                for j in range(i, n):
                    s += vals[j]
                    if s == aq:
                        k3_hits.append((i, j))
                    if s > aq:
                        break
        # K4: priponska sekcija čez strani (j = konec strani, s ≤ 160 vrstic nazaj)
        k4_hits = []
        if aq is not None:
            e = page_end[pg]
            lo = max(0, e - 160)
            k4_hits = [s for s in range(lo, e + 1) if pre[e + 1] - pre[s] == aq]
        # K5: bloki + unije do 5 sosednjih zaključenih blokov (konec ≤ konec strani)
        k5_hits = []
        if aq is not None:
            e = page_end[pg]
            end_blocks = [b for b in blocks if b['i1'] <= e]
            for k in range(len(end_blocks)):
                s = 0
                for m in range(k, min(k + 5, len(end_blocks))):
                    s += end_blocks[m]['sum']
                    if s == aq:
                        k5_hits.append((end_blocks[k]['i0'], end_blocks[m]['i1']))
        # K6: rdeči popravek vs vsota strani
        k6 = {'red_qkl': aq_alt, 'page_sum_excl': page_sum_excl[pg],
              'page_sum_incl': page_sum_incl[pg],
              'match_excl': (aq_alt is not None and page_sum_excl[pg] == aq_alt),
              'match_incl': (aq_alt is not None and page_sum_incl[pg] == aq_alt),
              'diff_excl': (page_sum_excl[pg] - aq_alt) if aq_alt is not None else None}
        konv.append({
            'page': pg, 'anchor_value': c['value'], 'anchor_qkl': aq, 'crossed': bool(c.get('crossed')),
            'red_line': str(c.get('red_line') or ''),
            'rows': n,
            'K1_page_sum_excl': page_sum_excl[pg], 'K1_match': k1,
            'K2_page_sum_incl': page_sum_incl[pg], 'K2_match': k2,
            'K3_segment_hits': k3_hits[:8], 'K3_n_hits': len(k3_hits),
            'K4_suffix_hits': k4_hits[:8], 'K4_n_hits': len(k4_hits),
            'K5_block_hits': k5_hits[:8], 'K5_n_hits': len(k5_hits),
            'K6_red': k6,
            'K6_match': k6['match_excl'] or k6['match_incl'],
            'agent_notes': f11.norm(c.get('agent_notes'))[:240],
        })

    # --- K7: reprodukcija C4 (p56–143, glasovi iz val 86b artefakta)
    c4 = f11art['arithmetic']
    k7 = {'pages': len(c4),
          'OK': sum(1 for a in c4 if a.get('verdict') == 'OK'),
          'REVIEW': sum(1 for a in c4 if a.get('verdict') == 'REVIEW'),
          'NO_FURTRAG': sum(1 for a in c4 if a.get('verdict') == 'NO_FURTRAG'),
          'reproduced_from': 'band-v86/f11-fuertrag-v86.json (val 86b)'}
    # neodvisna kontrola vsot vrstic: naš page_sum_excl mora sovpadati z register_qkl_total
    mismatch = [a['page'] for a in c4 if a.get('register_qkl_total') != page_sum_excl.get(a['page'])]
    k7['register_sum_mismatches'] = mismatch

    # --- K8: usklajenost dveh vnosov sidrov (ANCHORS_V61 vs verified_chain)
    k8 = []
    for pg, (cnt, J, Q) in sorted(ANCHORS_V61.items()):
        cc = next((c for c in chain if c['page'] == pg), None)
        v_chain = parse_jq(cc['value']) if cc else None
        v_anchor = J * JOCH + Q
        red = parse_jq(str(cc.get('red_line') or '')) if cc else None
        k8.append({'page': pg, 'counter': cnt,
                   'anchor_qkl': v_anchor,
                   'chain_value': cc['value'] if cc else None,
                   'chain_qkl': v_chain,
                   'chain_red': cc.get('red_line') if cc else None,
                   'red_qkl': red,
                   'anchor_equals_chain': v_anchor == v_chain,
                   'anchor_equals_red': red is not None and v_anchor == red})

    # --- K9: konfunda indikatorji F-PV-05 (formatno usklajeno: polje je lahko
    #     "J.K" celota, majhno število (J), srednje (K do 1599) ali nemogoče (>1599))
    JK_RE = re.compile(r'^(\d{1,2})[.,|](\d{1,5})$')
    def field_kind(s):
        s = re.sub(r'\[[^\]]*\]', '', f11.norm(s)).strip()
        if not s:
            return 'empty'
        if not re.search(r'\d', s):
            return 'nonnumeric'
        d = re.sub(r'\D', '', s)
        if not d:
            return 'nonnumeric'
        m = JK_RE.match(s.replace(' ', ''))
        if m:
            return 'jk_format'
        n = int(d)
        if n <= 99:
            return 'plain_le99'
        if n <= 1599:
            return 'plain_100_1599'
        return 'plain_gt1599'
    def col_stats(pgs):
        st = collections.Counter()
        for pg in pgs:
            for _, r in by_page.get(pg, []):
                kja, kkl = field_kind(r.get('jaethe')), field_kind(r.get('klafter'))
                st['jaethe_' + kja] += 1
                st['klafter_' + kkl] += 1
                if kja != 'empty' and kkl != 'empty':
                    st['both_filled'] += 1
                if kja == 'jk_format' or kkl == 'jk_format':
                    st['any_jk_format'] += 1
                # nemogoče: J polje > 99 brez J.K formata (verjetno K ali staknjene števke)
                if kja == 'plain_gt1599':
                    st['jaethe_gt1599_plain'] += 1
                if kkl == 'plain_gt1599':
                    st['klafter_gt1599_plain'] += 1
        return dict(sorted(st.items()))
    k9 = {'p1_55_val57': col_stats(range(3, 56)),
          'p56_143_v82_plus_sloji': col_stats(PAGES)}

    # --- K10: opazovalni register
    vals = collections.defaultdict(list)
    for c in chain:
        q = parse_jq(c['value'])
        if q is not None:
            vals[q].append(c['page'])
    k10 = {'anchor_value_duplicates': {str(q): ps for q, ps in vals.items() if len(ps) > 1},
           'p56_voice_p1_equals_p5_anchor': None}
    a56 = next((a for a in c4 if a['page'] == 56), None)
    a5 = ANCHORS_V61[5]
    if a56 and a56.get('voices_qkl_total', {}).get('p1'):
        k10['p56_voice_p1_equals_p5_anchor'] = a56['voices_qkl_total']['p1'][0] == a5[1] * JOCH + a5[2]

    n_anchor = len(chain)
    n_ditto = sum(1 for r in reg if r.get('owner_was_ditto'))
    n_brows = sum(b['i1'] - b['i0'] + 1 for b in blocks)
    avg_block = (n_brows / len(blocks)) if blocks else 0.0
    verdict = {
        'K1_page_sum_excl': sum(1 for k in konv if k['K1_match']),
        'K2_page_sum_incl': sum(1 for k in konv if k['K2_match']),
        'K3_any_segment': sum(1 for k in konv if k['K3_n_hits'] > 0),
        'K4_any_suffix': sum(1 for k in konv if k['K4_n_hits'] > 0),
        'K5_any_block_union': sum(1 for k in konv if k['K5_n_hits'] > 0),
        'K6_red_match': sum(1 for k in konv if k['K6_match']),
        'K8_anchor_equals_chain': sum(1 for k in k8 if k['anchor_equals_chain']),
        'K8_anchor_equals_red': sum(1 for k in k8 if k['anchor_equals_red']),
    }
    result = {
        'meta': {
            'val': '90',
            'generated_by': 'build-c4-metrika-v90.py',
            'method': 'C4 metrika: izčrpna deterministična preverba konvencij na sidrih val 61 (K1–K6) + reprodukcija C4 val 86b (K7) + usklajenost vnosov (K8) + konfunda F-PV-05 (K9) + opazovalni register (K10); NIČ VLM, NIČ spleta; NIČ sprememb podatkov (§4/§22)',
            'inputs': {'register.json': sha256(REG), 'totals-reread.json': sha256(REREAD),
                       'f11-fuertrag-v86.json': sha256(F11)},
            'anchors': n_anchor, 'joch_qkl': JOCH,
            'verdict_counts': verdict,
            'K5_input_reliability': (
                'NEZANESLJIV VHOD — owner_was_ditto označen samo na %d/%d vrstic (%.1f %%), '
                'bloki = %d (povprečno %.1f vrstic/blok); holdingi (Jaethe) iz trenutnega '
                'registra NE rekonstruirani → K5 je NEDEDOKAZLJIVO z obstoječimi podatki, '
                'ne ovraženo; odločilno šele po imenskem re-readu (kvota)'
                % (n_ditto, len(reg), 100.0 * n_ditto / len(reg), len(blocks), avg_block)
            ),
            'verdict': 'KONVENCIJA "vsota tekoče strani" (val 61 §2.2 confirmed) ARITMETIČNO NEPOTRJENA — ne ustreza na nobenem od 13 sidrih; metrika ostaja TO-DECODE; odločilna kontrola = re-read p1–55 stolpcev (F-PV-05) po 86b 2. delu',
        },
        'konvencije_sidra': konv,
        'K7_c4_reprodukcija': k7,
        'K8_vnosi_sidrov': k8,
        'K9_konfunda_F-PV-05': k9,
        'K10_opazovalni_register': k10,
    }
    os.makedirs(OUTD, exist_ok=True)
    with open(OUT, 'w') as fh:
        json.dump(result, fh, ensure_ascii=False, indent=1)
    v = verdict
    print(f"C4 metrika (val 90): sidrov {n_anchor} — K1 {v['K1_page_sum_excl']}/{n_anchor} · "
          f"K2 {v['K2_page_sum_incl']}/{n_anchor} · K3 {v['K3_any_segment']}/{n_anchor} · "
          f"K4 {v['K4_any_suffix']}/{n_anchor} · K5 {v['K5_any_block_union']}/{n_anchor} · "
          f"K6 {v['K6_red_match']} · K8 value {v['K8_anchor_equals_chain']}/{n_anchor}, "
          f"red {v['K8_anchor_equals_red']}/{n_anchor}")
    print(f"C7→K7 reprodukcija C4: OK/REVIEW/NO_FURTRAG = {k7['OK']}/{k7['REVIEW']}/{k7['NO_FURTRAG']}, "
          f"mismatches vsot: {len(mismatch)}")
    print(f"K9 konfunda p1–55: {k9['p1_55_val57']}")
    print(f"K9 konfunda p56–143: {k9['p56_143_v82_plus_sloji']}")
    print(f"K10: {k10['anchor_value_duplicates']} · p56 glas==p5 anchor: {k10['p56_voice_p1_equals_p5_anchor']}")


if __name__ == '__main__':
    main()
