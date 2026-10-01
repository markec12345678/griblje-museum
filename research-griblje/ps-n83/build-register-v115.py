#!/usr/bin/env python3
"""Val 115 — VSTAVLJANJE IZPUŠČENIH VRSTIC (strukturni val; napovedan v v113/v114).

Vhodi: page_observations_v114 strukturna forenzika (p34/p40/p48/p49) — v57 je na
4 straneh izpustil po eno fizično vrstico (dokazano s sidri v v114); vgradnja je
bila izrecno odložena ("VSTAVLJANJE = odprta strukturna odločitev") — ta val jo izvede.

4 vstavitve (2871 → 2875):
  1. p34 — 21. vrstica pred Fürtragom: vrednost ~70 (QK stolpec, aproksimacija),
     ime ~"Hurich/Lohingr Mich.[?]"; tekač nezabeležen (v114 forenzika)
  2. p40 — fizična p13 (tekač 734, Nro 21, Pechley Mich°, 1|65 — celotna vrstica
     rdeče prečrtana); v57 jo je izpustil in vrednost zlil v r12 ("4 - 65")
  3. p48 — fizična p2: vrednost "12" v Joch koloni (ni prečrtana), ime ~"Schmipa[?]";
     edina vstavljena vrstica z numerično jaethe → pass3 projekcija 391→392
  4. p49 — fizična p2: "2|973" (cela vrednost prečrtana, kultur Acker); SPLIT marker

Pravila (1:1 hišni stil v112/v113/v114):
  - vstavljene vrstice imajo reading_pass 'v115-insert' — NOVA plast, stare plasti
    (v57/v82/v83/v86/v88/v111–v114) nedotaknjene
  - vse vrednosti izrecno dokumentirane v anmerkung (uncertaintye z [?]/~), TRANSCRIBED=0,
    nič ne dvignjeno
  - vrnjene (po vstavitvi premaknjene) vrstice: VSEBINSKO NESPREMENJENE — v114 je
    vrednosti že poravnal preko mapiranja rN=p(N+1); vstavitve le fizično poravnajo indekse
  - page_observations_v115 (nov sloj) na prvi vrstici vsake prizadete strani
  - fail-fast: guard 2871 + 139 v88 + 1755 v86 + 265 v112 + 120 v113 + 667 v114
    + sidrovske asertacije vsake vstavitve + changes guard (dvozni tek prepovedan)
Izhod: register.json + band-v113/register-v115-changes.json
"""
import json
import os
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
REG = f'{REPO}/research-griblje/ps-n83/register.json'
OUT = f'{REPO}/research-griblje/ps-n83/band-v113/register-v115-changes.json'

DOC_ID = 'VAČ docid 41780 (uodid 373415)'
SRC = 'SI AS 176/N/N83/s/PS'


def rp(r):
    return (r.get('reading_pass') or '')


def val(r, f):
    v = r.get(f)
    return v.strip() if isinstance(v, str) else v


def main():
    reg = json.load(open(REG))
    assert len(reg) == 2871, f'guard: register 2871 (najdeno {len(reg)})'
    n_v88 = sum(1 for r in reg if 'v88_status' in r or r.get('jk_review') == 'v88-digit-split-UNRESOLVED')
    assert n_v88 == 139, f'guard: 139 v88 (najdeno {n_v88})'
    n_v86 = sum(1 for r in reg if rp(r) == 'v86-colonial-tiles')
    assert n_v86 == 1755, f'guard: 1755 v86-colonial-tiles (najdeno {n_v86})'
    n_v112 = sum(1 for r in reg if rp(r) == 'v112-ps-reread')
    assert n_v112 == 265, f'guard: 265 v112-ps-reread (najdeno {n_v112})'
    n_v113 = sum(1 for r in reg if rp(r) == 'v113-ps-reread')
    assert n_v113 == 120, f'guard: 120 v113-ps-reread (najdeno {n_v113})'
    n_v114 = sum(1 for r in reg if rp(r) == 'v114-ps-reread')
    assert n_v114 == 667, f'guard: 667 v114-ps-reread (najdeno {n_v114})'
    if os.path.exists(OUT):
        sys.exit('FATAL: register-v115-changes.json ze obstaja (dvozni tek prepovedan)')

    by_page = {}
    for idx, r in enumerate(reg):
        by_page.setdefault(r['page'], []).append((idx, r))

    def anchor(page, i, **fields):
        """Sidro: fizična vrstica MORA imete priakovano vsebino (fail-fast pred vstavitvijo)."""
        idx, r = by_page[page][i]
        for f, want in fields.items():
            got = val(r, f) if isinstance(want, str) else r.get(f)
            assert got == want, f'p{page} r{i}: {f} = {got!r}, priakovano {want!r}'
        return idx, r

    # ---------------- sidra (v114 forenzika, glej page_observations_v114) ----------------
    anchor(34, 19, no_blatt=20, owner_original='Eberl, Michl', klafter='273')         # zadnja vrstica p34
    anchor(40, 12, owner_original='Wunderling', jaethe='', klafter='')                # p12 = prazna celica
    anchor(40, 13, owner_original='Pechley Michael', jaethe='4', klafter='860')       # p14 (Nro 20)
    anchor(48, 1, owner_original='Weidner Mathä.', jaethe='279')                      # p1
    anchor(48, 2, owner_original='Weidner Mathä.', jaethe='733')                      # p3 (mapirano)
    anchor(49, 1, owner_original='Raguzl Janez', klafter='277')                       # p1
    anchor(49, 2, owner_original='Hößle Marie', jaethe='1', klafter='11')             # p3 (mapirano)

    changes = []
    stats = {'inserts': 0, 'page_obs_adds': 0, 'pages': []}

    def new_row(page, sheet_visible, no_blatt, haus_no, owner, kultur, jae, kla, anm):
        return {
            'source': SRC, 'document_id': DOC_ID, 'page': page,
            'sheet_visible': sheet_visible, 'no_blatt': no_blatt, 'haus_no': haus_no,
            'owner_original': owner, 'owner_was_ditto': False, 'stand': '', 'wohnort': '',
            'kultur': kultur, 'jaethe': jae, 'klafter': kla, 'classe': '',
            'ertrag_fl': '', 'ertrag_kr': '', 'capital_fl': '', 'capital_kr': '',
            'anmerkung': anm, 'page_observations': '', 'reading_pass': 'v115-insert',
        }

    def add_page_obs(page, txt):
        r0 = by_page[page][0][1]
        assert 'page_observations_v115' not in r0, f'p{page}: v115 obs ze obstaja'
        r0['page_observations_v115'] = txt
        changes.append({'page': page, 'type': 'page_observations_v115', 'text': txt})
        stats['page_obs_adds'] += 1

    # vstavitve po PADajočem globalnem indeksu (indeksi ostanejo stabilni med vstavitvami)
    inserts = []

    # --- 1) p49: fizična p2 — preklicana "2|973" (kultur Acker), pred trenutno r2 ---
    idx49, _ = anchor(49, 2)
    inserts.append((idx49, new_row(
        49, 'II. N.', None, '', '', 'Acker', '2', '973',
        '[v115: VSTAVLJENA vrstica p2 — v57 jo je izpustil in zamaknil r2+ za +1 (dokaz: 14 natanko ujemanj vrednosti pod mapiranjem); cela vrednost prečrtana (pisarjeva revizija); F-PV-07-SPLIT val 115: Joch|Klafter notacija — jae=Joch stavec, ni parcelna stevilka]')))
    # --- 2) p48: fizična p2 — "12" (Joch kolona, ni prečrtana, ~"Schmipa[?]"), pred r2 ---
    idx48, _ = anchor(48, 2)
    inserts.append((idx48, new_row(
        48, 'III. N.', '1', '', 'Schmipa[?]', '', '12', '',
        '[v115: VSTAVLJENA vrstica p2 — v57 jo je izpustil in zamaknil r2+ za +1 (dokaz: 10 natanko ujemanj vrednosti pod mapiranjem); vrednost "12" v Joch koloni, ni prečrtana; ime ~Schmipa[?]; edina vstavljena vrstica z numerično jaethe → pass3 projekcija]')))
    # --- 3) p40: fizična p13 — tekač 734, Nro 21, Pechley Mich°, 1|65 (celotna vrstica rdeče prečrtana), med r12 in r13 ---
    idx40, _ = anchor(40, 13)
    inserts.append((idx40, new_row(
        40, '11. N.', None, '1 / 21', 'Pechley Mich°', '', '1', '65',
        '[v115: VSTAVLJENA vrstica p13 (tekač 734, Nro 21) — v57 jo je izpustil in vrednost zlil v r12 ("4 - 65"); celotna vrstica rdeče prečrtana (pisarjeva revizija), Joch=1 rdeče prečrtan]; [F-PV-07-SPLIT val 115: Joch|Klafter notacija — jae=Joch stavec, ni parcelna stevilka]')))
    # --- 4) p34: 21. vrstica pred Fürtragom — za trenutno r19 (zadnja vrstica p34) ---
    idx34, _ = anchor(34, 19)
    inserts.append((idx34 + 1, new_row(
        34, 'III. N.', None, '', 'Hurich/Lohingr Mich.[?]', '', '', '70',
        '[v115: VSTAVLJENA 21. vrstica pred Fürtragom — v57 je ne ima; vrednost ~70 (aproksimacija — pisanje nizko pri robu celice), ime ~Hurich/Lohingr Mich.[?]; tekač nezabeležen; vrednost v QK stolpcu (F-PV-07 page-level p34)]')))

    for idx, row in inserts:
        assert reg[idx - 1]['page'] == row['page'], f'indeks {idx}: predhodnik stran {reg[idx-1]["page"]} != {row["page"]}'
        assert reg[idx]['page'] in (row['page'], row['page'] + 1), f'indeks {idx}: naslednik stran {reg[idx]["page"]} nepriakovana'
        reg.insert(idx, row)
        changes.append({'type': 'insert', 'index': idx, 'page': row['page'],
                        'reading_pass': 'v115-insert', 'row': row})
        stats['inserts'] += 1
        stats['pages'].append(f'p{row["page"]}')

    # ---------------- page_observations_v115 (izvedba odločitve iz v114) ----------------
    add_page_obs(34, 'v115: VSTAVLJENA 21. vrstica pred Fürtragom (~70, ime ~Hurich/Lohingr Mich.[?]; tekač nezabeležen) — v57 je ne ima; 20→21 vrstic; register 2871→2875')
    add_page_obs(40, 'v115: VSTAVLJENA fizična p13 (tekač 734, Nro 21, Pechley Mich°, 1|65 rdeče prečrtana) med Wunderling (p12) in Nro 20 (p14) — v57 jo je izpustil in zlil v r12; 20→21 vrstic; r13–r19 = p14–p20 zdaj tudi po indeksih; register 2871→2875')
    add_page_obs(48, 'v115: VSTAVLJENA fizična p2 (vrednost "12" v Joch koloni, ime ~Schmipa[?]) — v57 jo je izpustil; 20→21 vrstic; r3–r20 = p3–p20 zdaj tudi po indeksih; edina vstavljena vrstica v pass3 projekciji (391→392); register 2871→2875')
    add_page_obs(49, 'v115: VSTAVLJENA fizična p2 (preklicana "2|973", kultur Acker) — v57 jo je izpustil; 21→22 vrstic; r3–r20 = p3–p20 zdaj tudi po indeksih; register 2871→2875')
    stats['pages'] += ['p34-obs', 'p40-obs', 'p48-obs', 'p49-obs']

    # ---------------- končni guardi ----------------
    assert len(reg) == 2875, f'guard po vstavitvi: 2875 (najdeno {len(reg)})'
    assert sum(1 for r in reg if rp(r) == 'v115-insert') == 4, 'guard: 4 v115-insert vrstice'
    for page, want in ((34, 21), (40, 21), (48, 21), (49, 22)):
        got = sum(1 for r in reg if r['page'] == page)
        assert got == want, f'p{page}: {got} vrstic, priakovano {want}'
    # stare plasti se morajo ujemati (vstavitve ne spreminjajo obstoječih vrstic)
    assert sum(1 for r in reg if rp(r) == 'v114-ps-reread') == 667, 'v114 sloj se je spremenil!'
    assert sum(1 for r in reg if 'v88_status' in r or r.get('jk_review') == 'v88-digit-split-UNRESOLVED') == 139

    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    audit = {'val': 115, 'stats': stats, 'changes': changes}
    json.dump(audit, open(OUT, 'w'), ensure_ascii=False, indent=1)
    print('VAL 115 VSTAVLJANJE OK')
    print('  stats:', json.dumps(stats, ensure_ascii=False))
    print('  register:', len(reg), 'vrstic (2871 -> 2875)')
    for page in (34, 40, 48, 49):
        print(f'  p{page}:', sum(1 for r in reg if r["page"] == page), 'vrstic')


if __name__ == '__main__':
    main()
