#!/usr/bin/env python3
"""Val 125 — F-V124-01: p7 imenska + hišna plast (NR-14 celicni zoomi, 0 VLM).

DOKAZ (readings-v125.json + make-zoom-v125.py izrezki ×12–24):
  - imena so BOTTOM-anchor (pisana nizko, baseline na spodnjem pravilu pasu);
    hiše in Nro na istem pravilu — pas = [top r .. top r+1] (grid val 121/124,
    top0_lin=160.25, n=22, mean_off 1.86 — cal OK brez pina);
  - stisnjena vrstica Nro 92 (r11): vsebina zapisana VISOKO v pasu (brez
    levega pravila; desna tiskano pravilo 585–603).

IMENSKE napake v57 (7 struktur. popravkov):
  r1 'Poiding Hanl' -> 'Pödigz Hanl'          (P-d-i-g-z; 'ng' ovrženo)
  r5 'Schimeczkhanl' -> 'Schimecz Mihual'     (DVE besedi; 2. ≈ Michael)
  r9 'Poiding Matthl' -> 'Pödigz Marusa'      (surova 'Maruſa' — long-s z
                                               descender zanko; BREZ t-prečk)
  r11 '(K)hanzl Valen' -> 'Schimez P…a'       (stisnjeno; 2. beseda nečitljiva)
  r12 'Poiding Matthl' -> 'Pödigz Marusa'     (cf. r9 — isti zapis)
  r13 'Peders Marbl' -> '(R)abitscher Georg'  (rokopis 'Rabutschar Grogy' =
                                               ista oseba kot r14, Nro 94+95;
                                               forma po register-kobildi r14)
  r18 '(R)abitscher Marbl' -> 'Strauß Georg'  (rokopis 'Strauß Grogy', Nro 99;
                                               forma po register-kobildi r15/r19)
HIŠNE napake v57 (9 popravkov + 1 artefakt):
  r1 63->53, r2 20->54, r5 65->49, r10 35->55, r13 80->48, r14 48->45,
  r15 45->47, r18 47->46, r19 46->45; r21 '48'->'' (fantom Fürtrag — celica
  PRAZNA; '48' = v112 artefakt). EXTRA vrstica r20: hiša PRAZNA (ni zapisana).

GUARD: vsaka sprememba preveri deklarirano-staro vrednost ≟ register
(fail-fast). Idempotentno: drugi tek zazna v125 stanje in ne stori nič.
Ne dotakne se: vrednostnega sloja (klafter/jaethe/ertrag — v124 zaključen),
kultur sloja (kultur_p7 ločen prehod), osebnega registra (person-owner-
register/house-register = val 59 snapshot — uskladitev v NR-14 valu, flag
F-V125-01).
"""
import json
import os

REG_PATH = '/home/z/griblje-museum/research-griblje/ps-n83/register.json'
OUT_DIR = os.path.dirname(os.path.abspath(__file__))
CHANGES_PATH = os.path.join(OUT_DIR, 'changes-v125.json')

EXPECTED_TOTAL = 2876  # val 124 stanje

# (r, field, pre, post) — GUARD na vsaki vrstici
CHANGES = [
    # --- imenske (7) ---
    (1, 'owner_original', 'Poiding Hanl', 'Pödigz Hanl'),
    (5, 'owner_original', 'Schimeczkhanl', 'Schimecz Mihual'),
    (9, 'owner_original', 'Poiding Matthl', 'Pödigz Marusa'),
    (11, 'owner_original', '(K)hanzl Valen', 'Schimez P…a'),
    (12, 'owner_original', 'Poiding Matthl', 'Pödigz Marusa'),
    (13, 'owner_original', 'Peders Marbl', '(R)abitscher Georg'),
    (18, 'owner_original', '(R)abitscher Marbl', 'Strauß Georg'),
    # --- hišne (9 + 1 artefakt) ---
    (1, 'haus_no', '63', '53'),
    (2, 'haus_no', '20', '54'),
    (5, 'haus_no', '65', '49'),
    (10, 'haus_no', '35', '55'),
    (13, 'haus_no', '80', '48'),
    (14, 'haus_no', '48', '45'),
    (15, 'haus_no', '45', '47'),
    (18, 'haus_no', '47', '46'),
    (19, 'haus_no', '46', '45'),
    (21, 'haus_no', '48', ''),
]

# add-only anmerkung po vrstici (dokaz + razred napake)
NOTES = {
    1: ("[v125: ime ∅|'Poiding Hanl' -> ∅|'Pödigz Hanl' F-V124-01 (zoom ×12: "
        "P-d-i-g-z, brez 'ng' — cf. r9/r12 isti koren); hiša 63 -> 53 (zoom ×24: "
        "raven vrh z zastavico = 5, dve skodeli = 3)]"),
    2: ("[v125: hiša 20 -> 54 (zoom ×24: 5 + 4; v57 '20' ni na rokopisu — "
        "preskok-epoha branja)]"),
    5: ("[v125: ime ∅|'Schimeczkhanl' -> ∅|'Schimecz Mihual' F-V124-01 (zoom ×12: "
        "DVE besedi — 2. beseda Mi⟨h⟩ual ≈ Michael; cf. r0 pravi enobesedni "
        "'Schimeczkhanl'; knjiga v124 'Schimz Mihual'); hiša 65 -> 49 (zoom ×24: "
        "4 + 9)]"),
    9: ("[v125: ime ∅|'Poiding Matthl' -> ∅|'Pödigz Marusa' F-V124-01 (zoom ×20: "
        "2. beseda 'Maruſa' — long-s z descender zanko, BREZ t-prečk → 'Matthl' "
        "ovrženo; Maruša ≈ Marija; knjiga v124 'Marls'; črkovalna sodba NR-14)]"),
    10: ("[v125: hiša 35 -> 55 (zoom ×24: 5 + 5; isti digitcmp kot r10 klafter "
         "pas)]"),
    11: ("[v125: ime ∅|'(K)hanzl Valen' -> ∅|'Schimez P…a' F-V124-01 (zoom ×14 "
         "stisnjena vrstica: 1. beseda = Schimez-koren (cf. r10 'Schimez Hanl'), "
         "2. beseda P-a-?-?-a nečitljiva; v57 forma ovržena; NR-14)]"),
    12: ("[v125: ime ∅|'Poiding Matthl' -> ∅|'Pödigz Marusa' F-V124-01 (isti "
         "dokaz kot r9 — zapisa r9/r12 črkovno identična, cf. r14/r15)]"),
    13: ("[v125: ime ∅|'Peders Marbl' -> ∅|'(R)abitscher Georg' F-V124-01 — "
         "STRUKTURNA napaka v57: rokopis jasno 'Rabutschar Grogy' = ista oseba "
         "kot r14 (Nro 94 + 95); oblika po register-formi r14 (surova Kurrent "
         "oblika v readings-v125); hiša 80 -> 48 (zoom ×24: 4 + 8)]"),
    14: ("[v125: hiša 48 -> 45 (zoom ×24: 4 + 5)]"),
    15: ("[v125: hiša 45 -> 47 (zoom ×24: 4 + 7 — 7 brez spodnje zanke, "
         "digitcmp cf. r16/r17)]"),
    18: ("[v125: ime ∅|'(R)abitscher Marbl' -> ∅|'Strauß Georg' F-V124-01 — "
         "STRUKTURNA napaka v57 in hitrega branja v124: rokopis jasno 'Strauß "
         "Grogy' (Nro 99; isti lastnik kot r19); oblika po register-formi "
         "r15/r19; hiša 47 -> 46 (zoom ×24: 6 z zaprto spodnjo zanko)]"),
    19: ("[v125: hiša 46 -> 45 (zoom ×24: 4 + 5)]"),
    20: ("[v125: hišna celica PRAZNA (ni zapisana, ne neberljiva) — hišni del "
         "F-V124-01 za EXTRA vrstico zaprt]"),
    21: ("[v125: hiša ∅|'48' -> ∅|'' — fantom Fürtrag vrstica NIMA hiše na "
         "rokopisu (zoom ×24: celica prazna); '48' = v112 artefakt]"),
}

RP_OLD = 'v112-ps-reread'
RP_NEW = 'v125-names-houses'
RP_V124 = 'v124-dvojni-anchor'


def load():
    with open(REG_PATH) as f:
        return json.load(f)


def save(reg):
    with open(REG_PATH, 'w') as f:
        json.dump(reg, f, ensure_ascii=False, indent=1)
        f.write('\n')


def note(row, text):
    a = row.get('anmerkung') or ''
    row['anmerkung'] = (a + ' ' if a else '') + text


def main():
    reg = load()
    total_pre = len(reg)
    print(f'register: {total_pre} vrstic')

    # ---- idempotencia: vse NOTES že prisotne? --------------------------------
    p7 = [r for r in reg if r['page'] == 7]
    if len(p7) != 22:
        raise SystemExit(f'GUARD FAIL: p7 ima {len(p7)} vrstic, pričakovano 22')
    missing_notes = [r for r in NOTES
                     if 'v125:' not in str(p7[r].get('anmerkung') or '')]
    field_changes_missing = [
        c for c in CHANGES
        if str(p7[c[0]].get(c[1]) or '') != str(c[3])
    ]
    if not missing_notes and not field_changes_missing:
        print('v125 že vgrajeno — idempotentni izhod')
        return
    if not field_changes_missing:
        # polja že vgrajena (morda starejši tek), dopolni samo manjkajoče notes
        for r in missing_notes:
            note(p7[r], NOTES[r])
        save(reg)
        print(f'dopolnitev: +{len(missing_notes)} manjkajočih v125 anmerkung')
        return
    if total_pre != EXPECTED_TOTAL:
        raise SystemExit(f'GUARD FAIL: pričakovano {EXPECTED_TOTAL} vrstic, '
                         f'dejansko {total_pre}')

    # ---- GUARD: deklarirano-staro p7 (ime + hiša vsaka vrstica) ------------
    expected_p7 = [
        # (owner, haus)
        ('Schimeczkhanl', '65'),      # r0  Nro 81
        ('Poiding Hanl', '63'),       # r1  Nro 82
        ('Lappary Marbl', '20'),      # r2  Nro 83
        ('Lappary Marbl', '54'),      # r3  Nro 84 (ditto)
        ('Lappary Marbl', '54'),      # r4  Nro 85 (ditto, ud. 54)
        ('Schimeczkhanl', '65'),      # r5  Nro 86
        ('Lappary Mihel', '54'),      # r6  Nro 87
        ('(R)abitscher Marbl', '47'), # r7  Nro 88
        ('Strauß Georg', '45'),       # r8  Nro 89
        ('Poiding Matthl', '50'),     # r9  Nro 90
        ('Schimez Hanl', '35'),       # r10 Nro 91
        ('(K)hanzl Valen', '56'),     # r11 Nro 92 (vstavljena, stisnjena)
        ('Poiding Matthl', '50'),     # r12 Nro 93
        ('Peders Marbl', '80'),       # r13 Nro 94
        ('(R)abitscher Georg', '48'), # r14 Nro 95
        ('Strauß Georg', '45'),       # r15 Nro 96
        ('(R)abitscher Marbl', '47'), # r16 Nro 97
        ('(R)abitscher Marbl', '47'), # r17 Nro 98
        ('(R)abitscher Marbl', '47'), # r18 Nro 99
        ('Strauß Georg', '46'),       # r19 Nro 100
        ('', ''),                     # r20 EXTRA (ditto, 110 ud.)
        ('', '48'),                   # r21 fantom Fürtrag
    ]
    for r, (nm, hn) in enumerate(expected_p7):
        act_nm = p7[r].get('owner_original') or ''
        act_hn = p7[r].get('haus_no') or ''
        if act_nm != nm:
            raise SystemExit(f'GUARD FAIL p7 r{r} owner_original: '
                             f'deklarirano {nm!r}, register {act_nm!r}')
        if act_hn != hn:
            raise SystemExit(f'GUARD FAIL p7 r{r} haus_no: '
                             f'deklarirano {hn!r}, register {act_hn!r}')

    # ---- vgradnja ----------------------------------------------------------
    audit = []
    for r in sorted({c[0] for c in CHANGES} | set(NOTES)):
        row = p7[r]
        n_changed = 0
        for (_, field, pre, post) in [c for c in CHANGES if c[0] == r]:
            act = row.get(field)
            if str(act or '') != str(pre):
                raise SystemExit(f'GUARD FAIL p7 r{r} {field}: deklarirano '
                                 f'{pre!r}, register {act!r}')
            snap_field = ('owner_original_pre_v125' if field == 'owner_original'
                          else 'haus_no_pre_v125')
            row[snap_field] = act
            row[field] = post
            audit.append({'page': 7, 'r': r, 'field': field,
                          'pre': act, 'post': post})
            n_changed += 1
        if n_changed:
            row['reading_pass'] = RP_NEW
        if r in NOTES:
            note(row, NOTES[r])

    out = {'val': 125,
           'scope': 'F-V124-01 p7 imenska + hišna plast (NR-14 celicni zoomi, '
                    '0 VLM)',
           'total_pre': total_pre,
           'total_post': len(reg),
           'n_field_changes': len(audit),
           'n_rows_touched': len({c[0] for c in CHANGES} | set(NOTES)),
           'changes': audit}
    with open(CHANGES_PATH, 'w') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write('\n')

    save(reg)
    print(f'vgradnja: {len(audit)} poljskih sprememb (7 imenskih + 10 hišnih) '
          f'+ anmerkung add-only na {len(NOTES)} vrsticah; '
          f'reading_pass -> {RP_NEW} na spremenjenih')
    print(f'audit -> {CHANGES_PATH}')


if __name__ == '__main__':
    main()
