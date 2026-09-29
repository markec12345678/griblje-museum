#!/usr/bin/env python3
"""Val 107 — 86b 3. del: VGRADNJA tile 3. glasu na preostalih straneh (p110–120, p122–142)
+ owner_tile_v86 variante (samo idempotentno na že pokritih delih, če sploh nastopijo).

NAČELA (1:1 pravila build-register-v86b.py, val 98 / del 2 — samo nove strani):
- PAGE-LEVEL F-PV-05: pisar piše enotne vrednosti v Quad. Kläfter; tile glas arbitra
  KOLONO na nivoju strani (page_qualifies = only_j < 10 %); per-row tile vrednosti =
  diagnostika (±1 nestabilna poravnava, p56 dokazano), NIKOLI vir vrednosti.
- STRAN gre v vgradnjo SAMO z vsemi 4 kultur pasovi (delna pokritost = premik
  indeksov = napačna arbitraža — fail-fast na nivoju strani, vzorec val 86).
- v88 = VIR RESNICE: vrstice z v88_status se pri jk logiki NE dotikajo (139
  digit-split rešenih val 88 + 2 UNRESOLVED).
- del 1 (val 86): p56–94 + p121; del 2 (val 98): p95–109 — jk vrednosti
  NESPREMENJENE (re-apply bi podvajal korekcije/digit_mismatch audit); ta val
  poganja jk logiko izključno na novih straneh p110–120 + p122–142 z vsemi
  4 kultur pasovi; owner variante na PART1 straneh samo idempotentno
  ('owner_tile_v86' že prisoten → preskoči).
- p1–55 + p143: NESPREMENJENI (guard byte-identno).
- Snimke *_pass1_v82 samo ob PRVI korekciji (nove strani še nimajo).
- Fail-fast: dvojni tek prepovedan (changes file obstaja → exit).

Izhodi:
  ps-n83/register.json (posodobljen: + reading_pass v86-colonial-tiles na novih straneh,
                         + owner_tile_v86 variante, + jk popravki na novih straneh)
  ps-n83/band-v86/register-v107-changes.json (popoln audit trail dela 3)
"""
import json, os, re, collections, sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
P1D = f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm'
P2D = f'{REPO}/research-griblje/raw-web-val83-2026-10/ps-vlm'
TDIR = f'{REPO}/research-griblje/raw-web-val86-2026-10'
REG = f'{REPO}/research-griblje/ps-n83/register.json'
OUTD = f'{REPO}/research-griblje/ps-n83/band-v86'
CHANGES = f'{OUTD}/register-v107-changes.json'
PAGES = list(range(56, 143))
BANDS = 4
# Strani, ki jih je del 1 (val 86: p56–94 + p121) in del 2 (val 98: p95–109) ŽE
# pokrili — jk logika se na njih NE poganja znova.
PART1 = set(range(56, 110)) | {121}


def norm(v):
    if v is None: return ''
    return re.sub(r'\s+', ' ', str(v).strip()).strip()


def numeq(v):
    s = norm(v)
    s = re.sub(r'\[(col\?|angeschnitten|rot|gestrichen[^\]]*|X)\]', '', s)
    return re.sub(r'\D', '', s)


def first_token(v):
    s = norm(v).replace('\n', ' ').lower()
    m = re.match(r'[a-zäöüß]+', s)
    return m.group(0) if m else ''


def resolve_dittos(rows):
    out, prev = [], None
    for r in rows:
        name = (r.get('name') or '').strip()
        row = dict(r)
        row['name_raw'] = name
        if name == '~' or name in (',,', 'de.', 'dito', 'idem'):
            row['name_resolved'] = prev
        else:
            prev = name
            row['name_resolved'] = name
        out.append(row)
    return out


def merge_tiles(pg, group):
    """1:1 build-register-v86.py: stran uporabna SAMO z vsemi BANDS pasovi."""
    for b in range(BANDS):
        f = f'{TDIR}/vlm-v86/p{pg:03d}-t-{group}{b}-T.json'
        if not os.path.exists(f): return []
        j = json.load(open(f))
        if 'ERROR' in j: return []
    rows = []
    for b in range(BANDS):
        f = f'{TDIR}/vlm-v86/p{pg:03d}-t-{group}{b}-T.json'
        j = json.load(open(f))
        for r in j.get('rows', []):
            row = dict(r); row['band'] = b; rows.append(row)
    merged = []
    for i, r in enumerate(rows):
        if not r.get('row_cut'):
            merged.append(r); continue
        nxt = rows[i + 1] if i + 1 < len(rows) else None
        if nxt and nxt['band'] == r['band'] + 1:
            if group == 'kultur':
                same = (first_token(r.get('kultur')) == first_token(nxt.get('kultur'))
                        and first_token(r.get('kultur')) != ''
                        and numeq(r.get('jaethe') or r.get('klafter')) == numeq(nxt.get('jaethe') or nxt.get('klafter')))
            else:
                same = (norm(r.get('name_raw')) == norm(nxt.get('name_raw'))
                        or (norm(r.get('haus_no')) and norm(r.get('haus_no')) == norm(nxt.get('haus_no'))))
            if same: continue
        merged.append(r)
    return merged


def col_of(ja, kl):
    j, k = bool(numeq(ja)), bool(numeq(kl))
    if j and k: return 'both'
    if j: return 'j'
    if k: return 'k'
    return 'none'


def main():
    reg = json.load(open(REG))
    assert len(reg) == 2871, 'guard: register 2871'
    n_prior = sum(1 for r in reg if r.get('reading_pass') == 'v86-colonial-tiles')
    assert n_prior == 1109, f'guard: deli 1+2 = 1109 v86 vrstic (najdeno {n_prior})'
    n_v88 = sum(1 for r in reg if 'v88_status' in r or r.get('jk_review') == 'v88-digit-split-UNRESOLVED')
    assert n_v88 == 139, f'guard: 139 v88 vrstic (najdeno {n_v88})'
    if os.path.exists(CHANGES):
        sys.exit('FATAL: register-v107-changes.json že obstaja (dvojni tek prepovedan)')

    changes = []
    page_jk_all = {}
    tally = collections.Counter()
    digit_mismatch = 0
    owner_variant_new = 0

    for pg in PAGES:
        d1 = json.load(open(f'{P1D}/p{pg:03d}.json'))
        d2 = json.load(open(f'{P2D}/p{pg:03d}.json'))
        r1 = resolve_dittos(d1.get('rows', []))
        r2 = resolve_dittos(d2.get('rows', []))
        tk = merge_tiles(pg, 'kultur')
        tnames = resolve_dittos(merge_tiles(pg, 'name'))
        reg_rows = [r for r in reg if r['page'] == pg]
        nmin = min(len(reg_rows), len(r1), len(r2), len(tk))

        new_page = bool(tk) and pg not in PART1

        if new_page:
            page_jk = {}
            nj = sum(1 for x in tk if numeq(x.get('jaethe')) and not numeq(x.get('klafter')))
            nk = sum(1 for x in tk if numeq(x.get('klafter')))
            nb = sum(1 for x in tk if numeq(x.get('jaethe')) and numeq(x.get('klafter')))
            only_j_pct = nj / max(1, nj + nk) * 100
            page_qualifies = only_j_pct < 10.0 and (nk + nb) > 0
            page_jk = {'only_j': nj, 'klafter_vkljeno_both': nk, 'both': nb,
                       'only_j_pct': round(only_j_pct, 1), 'qualifies': page_qualifies}
            page_jk_all[str(pg)] = page_jk

            for i in range(len(reg_rows)):
                rr = reg_rows[i]
                rr['reading_pass'] = 'v86-colonial-tiles'
                if i >= nmin:
                    tally['tile_missing' if i >= len(tk) else 'alignment_short'] += 1
                    continue
                a, b, t = r1[i], r2[i], tk[i]
                # ---------- name tile variant (vrednostno neodvisno od jk; v88 varno) ----------
                if i < len(tnames):
                    tn = tnames[i]
                    tname = norm(tn.get('name_resolved') or tn.get('name_raw') or '')
                    p1name = norm(a.get('name_resolved') or a.get('owner_original') or '')
                    if tname and tname != '~' and tname != p1name:
                        rr['owner_tile_v86'] = tn.get('name_resolved') or tn.get('name_raw') or ''
                        owner_variant_new += 1
                        tally['owner_variant'] += 1
                if 'v88_status' in rr:
                    # v88 = vir resnice — jk se ne dotika (varovalka)
                    tally['v88_protected'] += 1
                    continue
                # ---------- jaethe/klafter — PAGE-LEVEL F-PV-05 (1:1 val 86) ----------
                ca, cb = col_of(a.get('jaethe'), a.get('klafter')), col_of(b.get('jaethe'), b.get('klafter'))
                old_j, old_k = rr.get('jaethe') or '', rr.get('klafter') or ''
                rule = None
                if page_qualifies:
                    if ca == 'j' and cb == 'j':
                        if numeq(a.get('jaethe')) == numeq(b.get('jaethe')) and numeq(a.get('jaethe')):
                            new_j, new_k, rule = '', a.get('jaethe') or '', 'v86-tiles-jk'
                            if numeq(t.get('klafter') or t.get('jaethe')) and numeq(t.get('klafter') or t.get('jaethe')) != numeq(a.get('jaethe')):
                                digit_mismatch += 1
                                changes.append({'page': pg, 'row': i, 'type': 'digit_mismatch', 'field': 'klafter',
                                                'p1': norm(a.get('jaethe')), 'p2': norm(b.get('jaethe')), 'tile': norm(t.get('klafter') or t.get('jaethe'))})
                        else:
                            rule = 'v86-review-pass-digit-split'
                    elif ca == 'j' and cb == 'both' and numeq(a.get('jaethe')) == numeq(b.get('klafter')) and numeq(b.get('jaethe')):
                        new_j, new_k, rule = b.get('jaethe') or '', b.get('klafter') or '', 'v86-pass2-split'
                    elif cb == 'j' and ca == 'both' and numeq(b.get('jaethe')) == numeq(a.get('klafter')) and numeq(a.get('jaethe')):
                        new_j, new_k, rule = a.get('jaethe') or '', a.get('klafter') or '', 'v86-pass1-split'
                    elif ca == 'both' or cb == 'both':
                        rule = 'v86-explicit-jk-kept'
                    elif ca == 'none' and cb == 'none':
                        rule = 'v86-no-value'
                    elif ca != cb:
                        kside = b if cb == 'k' else a
                        if numeq(kside.get('klafter')):
                            new_j, new_k, rule = '', kside.get('klafter') or '', 'v86-tiles-arbitrated'
                        else:
                            rule = 'v86-review-col-split'
                    else:
                        rule = f'v86-kept-{ca}-{cb}'
                else:
                    rule = 'v86-page-not-qualified'
                if rule in ('v86-review-pass-digit-split', 'v86-review-col-split', 'v86-explicit-jk-kept', 'v86-pass2-split', 'v86-pass1-split'):
                    rr['jk_review'] = rule
                if rule in ('v86-tiles-jk', 'v86-tiles-arbitrated', 'v86-pass2-split', 'v86-pass1-split'):
                    if 'jaethe_pass1_v82' not in rr:
                        rr['jaethe_pass1_v82'] = old_j
                        rr['klafter_pass1_v82'] = old_k
                    rr['jaethe'], rr['klafter'] = new_j, new_k
                    rr['jk_review'] = rule
                    changes.append({'page': pg, 'row': i, 'type': 'jk_correction', 'rule': rule,
                                    'old': {'jaethe': old_j, 'klafter': old_k}, 'new': {'jaethe': new_j, 'klafter': new_k},
                                    'voices': {'p1': [norm(a.get('jaethe')), norm(a.get('klafter'))], 'p2': [norm(b.get('jaethe')), norm(b.get('klafter'))], 'tile': [norm(t.get('jaethe')), norm(t.get('klafter'))]}})
                tally[rule] += 1
                # ---------- kultur variant ----------
                tk_k = norm(t.get('kultur') or '')
                p1_k = norm(a.get('kultur') or '')
                if tk_k and tk_k.replace('\n', ' ') != p1_k.replace('\n', ' '):
                    rr['kultur_tile_v86'] = t.get('kultur') or ''
                    tally['kultur_variant'] += 1
            continue

        # ---------- že pokrite strani (deli 1+2) ali brez tile pokritja: samo NOVE name variante (idempotentno) ----------
        if tnames and pg in PART1:
            for i in range(len(reg_rows)):
                rr = reg_rows[i]
                if i >= len(tnames): break
                a = r1[i] if i < len(r1) else {}
                tn = tnames[i]
                tname = norm(tn.get('name_resolved') or tn.get('name_raw') or '')
                p1name = norm(a.get('name_resolved') or a.get('owner_original') or '')
                if tname and tname != '~' and tname != p1name and 'owner_tile_v86' not in rr:
                    rr['owner_tile_v86'] = tn.get('name_resolved') or tn.get('name_raw') or ''
                    owner_variant_new += 1
                    changes.append({'page': pg, 'row': i, 'type': 'owner_variant',
                                    'tile': rr['owner_tile_v86'], 'p1': p1name})
                    tally['owner_variant'] += 1

    # ---------- GUARDS ----------
    for r in reg:
        if r['page'] < 56 or r['page'] > 142:
            assert r.get('reading_pass', '') != 'v86-colonial-tiles', 'guard: p<56/p143 počisto'
    n_v86 = sum(1 for r in reg if r.get('reading_pass') == 'v86-colonial-tiles')
    cov = set()
    for pg in PAGES:
        if all(os.path.exists(f'{TDIR}/vlm-v86/p{pg:03d}-t-kultur{b}-T.json') for b in range(BANDS)):
            cov.add(pg)
    exp = sum(1 for r in reg if r['page'] in cov)
    assert n_v86 == exp, f'guard: v86 vrstic {n_v86} != pokritost {exp} (strani {sorted(cov)})'
    # v88 vrednosti NESPREMENJENE (vir resnice)
    v88 = [r for r in reg if 'v88_status' in r or r.get('jk_review') == 'v88-digit-split-UNRESOLVED']
    assert len(v88) == 139, 'guard: v88 139'
    for r in v88:
        if r.get('jk_review') == 'v88-digit-split-UNRESOLVED':
            assert r.get('jaethe') == r.get('jaethe_pass1_v82') and r.get('klafter') == r.get('klafter_pass1_v82'), \
                f"guard: v88 UNRESOLVED preglasena p{r.get('page')} {r.get('haus_no')}"
        else:
            assert r.get('jaethe') == r.get('jaethe_v88') or r.get('klafter') == r.get('klafter_v88'), \
                f"guard: v88 vrednost preglasena p{r.get('page')} {r.get('haus_no')}"

    json.dump({'val': '107 (86b del 3)', 'source': 'tile-read-v86/vlm-v86 (3. glas, kolonski tile-i z glavo)',
               'rules': '1:1 build-register-v86b.py page-level F-PV-05; nove strani p110–120+p122–142; v88 nedotaknjeno',
               'tally': dict(tally), 'digit_mismatch_total': digit_mismatch,
               'owner_variant_new': owner_variant_new, 'page_jk': page_jk_all,
               'changes': changes}, open(CHANGES, 'w'), ensure_ascii=False, indent=1)
    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    print('tally:', dict(tally))
    print('digit_mismatch:', digit_mismatch, 'owner_variant_new:', owner_variant_new)
    print('v86 reading_pass:', n_v86, '(deli 1+2: 1109 + del 3:', n_v86 - 1109, ')')
    print('pages covered:', len(cov), sorted(cov)[:5], '...', sorted(cov)[-5:])


if __name__ == '__main__':
    main()
