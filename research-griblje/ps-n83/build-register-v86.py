#!/usr/bin/env python3
"""Val 86 — VGRADNJA: register.json p56–142 2. prehod (kolonski tile-i, 3. glas).

NAČELA (§4 + precedens val 61 patch-register-reread.py):
- SAMO visoko-zanesljive korekcije; vsak popravek ohrani original (*_pass1_v82 snimka)
  + oznako review; neujemljiva branja = variant fields, NE prepisi (kultur_tile_v86).
- Jaethe↔Kläfter = STRUKTURNA dodelitev (merjena kolonska sidra z glavo, F-PV-05):
  3. glas (tile) arbitra kolono; števke = vsebina (2 soglasja > 1; pri razliki flag).
- register.json se popravi ENKRAT (fail-fast, če je že v86) — nič tihega prepisovanja.
- p1–55 + p143: NESPREMENJENI (byte-identno; guard).

PRAVILA po vrstici (p1=pass1/val82, p2=pass2/val83, t=tile/val86; numeq = števke):
  jk dodelitev (stolpec):
    p1=j, p2=j, t=k, numeq(p1.j)==numeq(t.k)      → klafter:=p1.jaethe, jaethe:=''  [v86-tiles-jk]
    p1=j, p2=k (razkol), t=k/j                     → sledi tile (števke iz strani z glasom, ki se ujema) [v86-tiles-arbitrated]
    p1=j, p2=j, t=j                                → CONFIRMED [v86-confirmed-3x]
    t brez številskih vrednosti                    → NIČ korekcije [v86-tile-empty] (p1 ostane)
    vrstica brez tile glasu (kmin < n1)            → NIČ [v86-tile-missing]
  števke: prevzeti se p1/p2 števki pri 2-soglasju; če se tile številka razlikuje →
    audit vnos 'digit_mismatch' (flag v changes datoteki; vrednost ostane 2-glasna).
  kultur: nikoli prepisano iz 1. glasu — če se tile razlikuje → variant field kultur_tile_v86.
  reading_pass: 'v86-colonial-tiles' za vseh p56–142 vrstic (spremlja prehod, ne resnice).

Izhodi:
  ps-n83/register.json (posodobljen)
  ps-n83/band-v86/register-v86-changes.json (popoln audit trail)
"""
import json, os, re, collections, sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
P1D = f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm'
P2D = f'{REPO}/research-griblje/raw-web-val83-2026-10/ps-vlm'
TDIR = f'{REPO}/research-griblje/raw-web-val86-2026-10'
REG = f'{REPO}/research-griblje/ps-n83/register.json'
OUTD = f'{REPO}/research-griblje/ps-n83/band-v86'
PAGES = list(range(56, 143))
BANDS = 4

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
    # VARovalo: stran je uporabna SAMO z vsemi BANDS pasovi (delna pokritost = premik
    # indeksov = napačna arbitraža vrstic — fail-fast na nivoju strani)
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
    for r in reg:
        if r.get('reading_pass') == 'v86-colonial-tiles':
            sys.exit('FATAL: register že v86 (fail-fast, dvojni tek prepovedan)')
    changes = []
    page_jk_all = {}
    tally = collections.Counter()
    digit_mismatch = 0
    for pg in PAGES:
        d1 = json.load(open(f'{P1D}/p{pg:03d}.json'))
        d2 = json.load(open(f'{P2D}/p{pg:03d}.json'))
        r1 = resolve_dittos(d1.get('rows', []))
        r2 = resolve_dittos(d2.get('rows', []))
        tk = merge_tiles(pg, 'kultur')
        tnames = resolve_dittos(merge_tiles(pg, 'name'))
        reg_rows = [r for r in reg if r['page'] == pg]
        nmin = min(len(reg_rows), len(r1), len(r2), len(tk))
        if not tk:
            # brez tile pokritja (kvota) — vrstice ostajajo pass1, reading_pass se NE prevzame
            tally['page_no_tiles'] += len(reg_rows)
            continue
        # page kvalifikacija: tile only_j delež < 10 % (F-PV-05: pisar piše Kläther)
        nj = sum(1 for x in tk if numeq(x.get('jaethe')) and not numeq(x.get('klafter')))
        nk = sum(1 for x in tk if numeq(x.get('klafter')))
        nb = sum(1 for x in tk if numeq(x.get('jaethe')) and numeq(x.get('klafter')))
        tot_jk = nj + nk + nb - nj  # nk vključuje both; delež only_j = nj / (nj + nk)
        only_j_pct = nj / max(1, nj + nk) * 100
        page_qualifies = only_j_pct < 10.0 and (nk + nb) > 0
        page_jk = {'only_j': nj, 'klafter_vkljeno_both': nk, 'both': nb, 'only_j_pct': round(only_j_pct, 1), 'qualifies': page_qualifies}
        page_jk_all[str(pg)] = page_jk
        for i in range(len(reg_rows)):
            rr = reg_rows[i]
            rr['reading_pass'] = 'v86-colonial-tiles'
            if i >= nmin:
                tally['tile_missing' if i >= len(tk) else 'alignment_short'] += 1
                continue
            a, b, t = r1[i], r2[i], tk[i]
            # ---------- jaethe/klafter — PAGE-LEVEL F-PV-05 pravilo ----------
            # Pisarjeva dodelitev stolpca je KONSISTENTNA po strani (val 85 merjeno:
            # enotne vrednosti v Quad. Kläfter). Tile glas arbitra KOLONO na nivoju
            # strani (only_j ≈ 0); per-row tile vrednosti = diagnostika (poravnava
            # vrstic je ±1 nestabilna — p56 dokazano), NIKOLI vir vrednosti.
            ca, cb = col_of(a.get('jaethe'), a.get('klafter')), col_of(b.get('jaethe'), b.get('klafter'))
            old_j, old_k = rr.get('jaethe') or '', rr.get('klafter') or ''
            rule = None
            if page_qualifies:
                if ca == 'j' and cb == 'j':
                    if numeq(a.get('jaethe')) == numeq(b.get('jaethe')) and numeq(a.get('jaethe')):
                        new_j, new_k, rule = '', a.get('jaethe') or '', 'v86-tiles-jk'
                        # per-row diagnostika: če se tile številka (pri istem indeksu) razlikuje → flag
                        if numeq(t.get('klafter') or t.get('jaethe')) and numeq(t.get('klafter') or t.get('jaethe')) != numeq(a.get('jaethe')):
                            digit_mismatch += 1
                            changes.append({'page': pg, 'row': i, 'type': 'digit_mismatch', 'field': 'klafter',
                                            'p1': norm(a.get('jaethe')), 'p2': norm(b.get('jaethe')), 'tile': norm(t.get('klafter') or t.get('jaethe'))})
                    else:
                        rule = 'v86-review-pass-digit-split'
                elif ca == 'j' and cb == 'both' and numeq(a.get('jaethe')) == numeq(b.get('klafter')) and numeq(b.get('jaethe')):
                    # p1 je stisnil N|K par v jaethe ('810'), p2 vidi izrecno 1|810 in se števki potrdita
                    new_j, new_k, rule = b.get('jaethe') or '', b.get('klafter') or '', 'v86-pass2-split'
                elif cb == 'j' and ca == 'both' and numeq(b.get('jaethe')) == numeq(a.get('klafter')) and numeq(a.get('jaethe')):
                    new_j, new_k, rule = a.get('jaethe') or '', a.get('klafter') or '', 'v86-pass1-split'
                elif ca == 'both' or cb == 'both':
                    rule = 'v86-explicit-jk-kept'  # izrecno N J K — pass ohrani (marker)
                elif ca == 'none' and cb == 'none':
                    rule = 'v86-no-value'
                elif ca != cb:
                    # razkol stolpcev med prehodoma — tile (page) arbitra: page_qualifies pomeni only_j≈0 → K
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
            # ---------- kultur (variant field, NIKOLI prepis) ----------
            tk_k = norm(t.get('kultur') or '')
            p1_k = norm(a.get('kultur') or '')
            if tk_k and tk_k.replace('\n', ' ') != p1_k.replace('\n', ' '):
                rr['kultur_tile_v86'] = t.get('kultur') or ''
                tally['kultur_variant'] += 1
            # ---------- name tile variant (če faza N obstaja) ----------
            if i < len(tnames):
                tn = tnames[i]
                tname = norm(tn.get('name_resolved') or tn.get('name_raw') or '')
                p1name = norm(a.get('name_resolved') or a.get('owner_original') or '')
                if tname and tname != '~' and tname != p1name:
                    rr['owner_tile_v86'] = tn.get('name_resolved') or tn.get('name_raw') or ''
                    tally['owner_variant'] += 1
    # ---------- GUARDS ----------
    for r in reg:
        if r['page'] < 56:
            assert r.get('reading_pass', '') != 'v86-colonial-tiles', 'guard: p<56 počisto'
    n_v86 = sum(1 for r in reg if r.get('reading_pass') == 'v86-colonial-tiles')
    # pokritost = strani z vsemi 4 kultur pasovi (deterministično iz vlm-v86/)
    cov = set()
    for pg in PAGES:
        if all(os.path.exists(f'{TDIR}/vlm-v86/p{pg:03d}-t-kultur{b}-T.json') for b in range(BANDS)):
            cov.add(pg)
    exp = sum(1 for r in reg if r['page'] in cov)
    assert n_v86 == exp, f'guard: v86 vrstic {n_v86} != pokritost {exp} (strani {sorted(cov)})'
    os.makedirs(OUTD, exist_ok=True)
    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    json.dump({'meta': {'val': 86, 'generated_by': 'build-register-v86.py', 'digit_mismatch': digit_mismatch},
               'tally': dict(sorted(tally.items())), 'page_jk': page_jk_all, 'changes': changes},
              open(f'{OUTD}/register-v86-changes.json', 'w'), ensure_ascii=False, indent=1)
    print(f'VGRADNJA: v86 vrstic {n_v86}; tally:', dict(sorted(tally.items())), f'; popravkov (changes) {len(changes)}; digit_mismatch {digit_mismatch}')

if __name__ == '__main__':
    main()
