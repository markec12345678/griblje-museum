#!/usr/bin/env python3
"""
Val 126 — NR-14 ČRKOVALNA SODBA + PASS2 RE-RUN (F-V125-01) — issue #42 §4/§14.

Kontekst:
  - val 125 (protokol 148): F-V124-01 zaprt (p7 imenska + hišna plast); F-V125-01
    ODPRT — person-owner-register + house-register owners.ps nosita val 119-del3
    stanje, ki ne odraža v123/v125 imenskih in hišnih popravkov (npr. H-035 pages
    vključuje p7 po stari hiši 35; p7 r10 je zdaj hiša 55).
  - NR-14 (negative result register, PARTIAL): p56–143 imenska plast 19,6 % soglasja
    (celostranski re-read) — rešitev = pasovni/zoom re-read s kolonskimi sidri
    (večvalna serija, val 127+). Protokol 148 §7.1: pass2 re-run šele PO NR-14
    črkovalni sodbi (en prehod, ne dva).
  - Ta val: (A) NR-14 sodba zapisana kot izenačitvena karta
    (nr14-variant-map-1825.json — 6 parov + 4 zavrnjene forme, flag-only) in
    (B) pass2 re-run — osebna + hišna + konfliktna plast re-izvedena iz
    ps-n83/register.json (v119/v123/v125 stanje p3–p55) z NR-14 ključi.

Metoda (0 VLM, 0 ugibanja — §4/§22):
  - metoda B (token surname-first LCS) nespremenjena od val 119 del 3 —
    kontinuiteta razredov; sim_concat stolpec ohranjen (F-SYNC-01 dokument).
  - NR-14: normalized_nr14 = norm po token-točnih zamenjavah variant
    (karta nr14-variant-map-1825.json); nr14_variant_group flag SAMO pri
    deljenem normalized_nr14 z različnim normalized — NOT_MERGED (nič mergeov).

Spremembe (vse add-only / z ohranitvijo dokazov):
  1. ps-n83/analysis-v8.json — A_pua_vs_ps_v126 (51 hiš, metoda B) + najdbe
     F-SYNC-01..05 (kontinuiteta) + F-SYNC-06 (NR-14 vgradnja) + F-V125-01 zaprtje.
  2. atlas-1825/person-owner-register-1825.json — owner(ps) plast PONOVNO
     IZVEDENA iz trenutnega registra (v125 p7 imena); vse osebe dobijo
     normalized_nr14 (+ nr14_variants); possible_duplicate ponovno izvedeno +
     NR-14 variantne grupe (merjeno: 0 — forme že kanonizirane na strani).
  3. atlas-1825/house-register-1825.json — owners.ps + ps_distinct + parcel_refs
     posodobljeni; PROVISIONAL plasti (H-072/74/76, layer=PROVISIONAL, val 122)
     NESPREMENJENE (izrecno zaščitene); owners.ps_stale mehanizem ohranjen.
  4. atlas-1825/conflict-register-1825.json — CH-xxx-01 statusi/note ponovno
     izvedeni na v126 stanju; CB-*/CF-* nedotaknjeni.

Scope sinhronizacije = PS p3–p55 (kakovostna plast val 119/123/125). PS p56–143
(PROVISIONAL, F-PV-04/NR-14) izključeno iz osebne sinhronizacije — F-SYNC-04
(nespremenjeno; bo se širila z re-read serijo val 127+).
"""
import json
import os
import re
import unicodedata
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
RG = os.path.dirname(BASE)
REPO = os.path.dirname(RG)


def load(p):
    with open(p) as f:
        return json.load(f)


def write(p, obj):
    with open(p, "w") as f:
        json.dump(obj, f, indent=1, ensure_ascii=False)
    print(f"{os.path.relpath(p, REPO)}: {os.path.getsize(p)} B")


# ---------- norm / sim (kontinuiteta val 119 del 3) ----------
def norm_concat(s):
    """1:1 replika val 58 `norm` (odstrani vse ne-črke, tudi presledke).
    NFKD razgradi tudi U+017F ſ → s (NR-14 V6 avtomatika)."""
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"[^a-zA-Z]", "", s).lower()
    return s


def norm_tok(s):
    """Tokenizirana norma (presledki ohranjeni) — metoda B."""
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"[^a-zA-Z ]", "", s).lower()
    return s


def lcs_ratio(ta, tb):
    m, n = len(ta), len(tb)
    if not m or not n:
        return 0.0
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m):
        for j in range(n):
            dp[i + 1][j + 1] = (
                dp[i][j] + 1 if ta[i] == tb[j] else max(dp[i][j + 1], dp[i + 1][j])
            )
    return 2 * dp[m][n] / (m + n)


def sim_concat(a, b):
    a, b = norm_concat(a), norm_concat(b)
    if not a or not b:
        return 0.0
    return lcs_ratio(a, b)


def sim_tokens(a, b):
    ta, tb = norm_tok(a).split(), norm_tok(b).split()
    if not ta or not tb:
        return 0.0, False
    best = 0.0
    exact = False
    for x in ta:
        for y in tb:
            s = lcs_ratio(x, y)
            if s > best:
                best = s
            if x == y:
                exact = True
    return best, exact


def sim_surname(pua_name, ps_name):
    tp = norm_tok(pua_name).split()
    ts = norm_tok(ps_name).split()
    if not tp or not ts:
        return 0.0, False
    first = ts[0]
    best = max(lcs_ratio(first, t) for t in tp)
    exact = any(first == t for t in tp)
    return best, exact


# ---------- NR-14 izenačitvena karta ----------
nr14 = load(os.path.join(BASE, "nr14-variant-map-1825.json"))
NR14_SUBS = {}
for pair in nr14["variant_pairs"]:
    sub = pair.get("substitution") or ""
    if "->" in sub:
        src, dst = [x.strip() for x in sub.split("->")]
        assert norm_tok(src) == src and norm_tok(dst) == dst, (
            f"NR-14 substitucija ni v normaliziranem prostoru: {sub}"
        )
        NR14_SUBS[src] = dst
assert len(NR14_SUBS) == 5, f"NR-14 substitucij {len(NR14_SUBS)} != 5 (V1–V5)"


def apply_variants(name):
    """NR-14 flag-only izenačitev: token-točne zamenjave → (normalized_nr14, uporabljeni pari)."""
    toks = norm_tok(name).split()
    used, out = set(), []
    for t in toks:
        if t in NR14_SUBS:
            out.append(NR14_SUBS[t])
            used.add(t)
        else:
            out.append(t)
    return norm_concat("".join(out)), sorted(used)


# ---------- vhodi ----------
pua = load(os.path.join(RG, "pua-n83", "register.json"))
ps = load(os.path.join(RG, "ps-n83", "register.json"))
person_reg_path = os.path.join(BASE, "person-owner-register-1825.json")
house_reg_path = os.path.join(BASE, "house-register-1825.json")
conf_reg_path = os.path.join(BASE, "conflict-register-1825.json")
person_reg = load(person_reg_path)
house_reg = load(house_reg_path)
conf_reg = load(conf_reg_path)
analysis_v1 = load(os.path.join(RG, "ps-n83", "analysis-v1.json"))
analysis_v7 = load(os.path.join(RG, "ps-n83", "analysis-v7.json"))

# ---------- GUARDI (fail-fast; pre-state = val 119-del3) ----------
assert len(ps) == 2876, f"PS register vrstic {len(ps)} != 2876"
ps_p3_55 = [r for r in ps if r["page"] <= 55]
assert len(ps_p3_55) == 1078, f"PS p3–p55 vrstic {len(ps_p3_55)} != 1078 (v124 Nro 92 vstavljena)"
n_owner_rows = sum(
    1 for r in ps_p3_55 if (r.get("owner_original") or "").strip() not in ("", "~")
)
assert n_owner_rows == 1070, f"PS p3–p55 vrstic z owner {n_owner_rows} != 1070"
assert len(pua) == 98, f"PUA vpisov {len(pua)} != 98"
old_types = Counter(p["person_type"] for p in person_reg["persons"])
assert old_types["owner(pua)"] == 98, f"owner(pua) {old_types['owner(pua)']} != 98"
assert old_types["owner(ps)"] == 656, f"owner(ps) {old_types['owner(ps)']} != 656 (val 119-del3 pre-state)"
assert old_types["owner_variant(pt)"] == 227, (
    f"owner_variant(pt) {old_types['owner_variant(pt)']} != 227"
)
assert person_reg["val"] == "119-del3", (
    f"person register val {person_reg['val']!r} != '119-del3' (dvojni tek prepovedan)"
)
assert house_reg["houses_total"] == 169, f"hiš {house_reg['houses_total']} != 169 (val 122)"
assert house_reg["val"] == "119-del3", f"house register val {house_reg['val']!r} != '119-del3'"
assert conf_reg["conflicts_total"] == 113, (
    f"konfliktov {conf_reg['conflicts_total']} != 113"
)
ch_old = [c for c in conf_reg["conflicts"] if c["conflict_type"] == "owner_state_pua_vs_ps"]
assert len(ch_old) == 51, f"CH konfliktov {len(ch_old)} != 51"
assert len(analysis_v1["A_pua_vs_ps"]["rows"]) == 51, "analysis-v1 A_pua_vs_ps != 51"
# p56–143 PROVISIONAL plast se NE sme vstopiti v sinhronizacijo (F-SYNC-04)
assert all(r["page"] <= 55 for r in ps_p3_55)

# ---------- indeksi ----------
pua_house_owner = {}
pua_house_entries = {}
for e in pua:
    hn = str(e.get("house_no") or "").strip()
    if not hn.isdigit():
        continue
    o = (e.get("owner_original") or "").strip()
    if not o:
        continue
    pua_house_entries.setdefault(int(hn), []).append(e)
    pua_house_owner.setdefault(int(hn), o)

ps_by_house = {}
for r in ps_p3_55:
    hn = str(r.get("haus_no") or "").strip()
    o = (r.get("owner_original") or "").strip()
    if not hn or not o or o == "~":
        continue
    ps_by_house.setdefault(hn, []).append(r)


def ps_owner_of(rows):
    """1:1 pass2 semantika: prvi ne-prazen owner v vrstnem redu dokumenta."""
    for r in rows:
        n = (r.get("owner_original") or "").strip()
        if n and n != "~":
            return n, r.get("stand") or None
    return None, None


# ---------- A_pua_vs_ps_v126 (metoda B, nespremenjena) ----------
v1_by_house = {row["house"]: row for row in analysis_v1["A_pua_vs_ps"]["rows"]}
v7_by_house = {row["house"]: row for row in analysis_v7["A_pua_vs_ps_v119"]["rows"]}
rows_v126 = []
for h in sorted(set(pua_house_owner) & {int(k) for k in ps_by_house if k.isdigit()}):
    key = str(h)
    prows = ps_by_house[key]
    po = pua_house_owner[h]
    distinct = {}
    for r in prows:
        nm = (r.get("owner_original") or "").strip()
        distinct.setdefault(nm, []).append(r["page"])
    first_name, first_stand = ps_owner_of(prows)
    sc_first = sim_concat(po, first_name)
    sc_best = max(sim_concat(po, nm) for nm in distinct)
    best = None
    for nm in distinct:
        ss, ex_s = sim_surname(po, nm)
        sa, ex_a = sim_tokens(po, nm)
        cand = (ss, sa, nm, ex_s or ex_a)
        if best is None or (cand[0], cand[1]) > (best[0], best[1]):
            best = cand
    sim_sur, sim_any, best_name, best_exact = best
    v1 = v1_by_house.get(h, {})
    if sim_sur >= 0.7:
        cls_v126 = "AGREE"
    elif sim_sur >= 0.5 and best_exact:
        cls_v126 = "PARTIAL"
    else:
        cls_v126 = "MISMATCH"
    rows_v126.append({
        "house": h,
        "pua_owner": po,
        "pua_entries": len(pua_house_entries[h]),
        "ps_first": first_name,
        "ps_stand": first_stand,
        "ps_distinct": [
            {"name": nm, "pages": sorted(set(pgs)), "rows": len(pgs)}
            for nm, pgs in distinct.items()
        ],
        "n_distinct": len(distinct),
        "sim_concat_first": round(sc_first, 3),
        "sim_concat_best": round(sc_best, 3),
        "sim_surname": round(sim_sur, 3),
        "sim_any": round(sim_any, 3),
        "best_ps_name": best_name,
        "best_exact_token": best_exact,
        "class_v58": v1.get("class"),
        "sim_v58": v1.get("sim"),
        "class_v119": v7_by_house.get(h, {}).get("class_v119"),
        "class_v126": cls_v126,
        "ps_pages": sorted({pg for nm, pgs in distinct.items() for pg in pgs}),
    })

assert len(rows_v126) == 51, f"A_pua_vs_ps_v126 hiš {len(rows_v126)} != 51"
cls_v126_counts = Counter(r["class_v126"] for r in rows_v126)
cls_v119_counts = Counter(r["class_v119"] for r in rows_v126)
cls_v58_counts = Counter(r["class_v58"] for r in rows_v126)
agree_houses = sorted(r["house"] for r in rows_v126 if r["class_v126"] == "AGREE")
partial_houses = sorted(r["house"] for r in rows_v126 if r["class_v126"] == "PARTIAL")
v126_by_house = {r["house"]: r for r in rows_v126}

# ---------- 1) person-owner-register (owner(ps) re-izvedba + NR-14) ----------
persons_new = []
for p in person_reg["persons"]:
    if p["person_type"] == "owner(ps)":
        continue
    q = dict(p)
    n14, subs = apply_variants(q["name_original"])
    q["normalized_nr14"] = n14
    if subs:
        q["nr14_variants"] = subs
    persons_new.append(q)

for hn in sorted(ps_by_house, key=lambda x: (not x.isdigit(), int(x) if x.isdigit() else 0, x)):
    prows = ps_by_house[hn]
    distinct = {}
    for r in prows:
        nm = (r.get("owner_original") or "").strip()
        distinct.setdefault(nm, []).append(r["page"])
    for nm, pgs in distinct.items():
        if not nm or nm == "~":
            continue
        n14, subs = apply_variants(nm)
        entry = {
            "name_original": nm,
            "normalized": norm_concat(nm),
            "normalized_nr14": n14,
            "person_type": "owner(ps)",
            "source": "PS N83 (PARTIAL)",
            "page": sorted(set(pgs)),
            "house_no": hn,
            "evidence_status": "SINGLE_SOURCE",
        }
        if subs:
            entry["nr14_variants"] = subs
        persons_new.append(entry)

# possible_duplicate ponovno izvedeno čez VSE osebe (pass2 logika, nič mergeov)
by_norm = {}
for i, p in enumerate(persons_new):
    by_norm.setdefault(p["normalized"], []).append(i)
dup_count = 0
for nkey, idxs in by_norm.items():
    if len(idxs) > 1 and nkey:
        houses = {str(persons_new[i]["house_no"]) for i in idxs}
        sources = {persons_new[i]["source"].split(" ")[0] for i in idxs}
        for i in idxs:
            persons_new[i]["possible_duplicate"] = True
            persons_new[i]["merge_decision"] = "NOT_MERGED"
            persons_new[i]["reason"] = (
                f"identno normalizirano ime v {len(idxs)} zapisih "
                f"({len(houses)} hiša/hiš, viri: {', '.join(sorted(sources))}) — "
                f"združitev šele z dodatnim dokazom (§5)"
            )
        dup_count += len(idxs)

# NR-14 variantne grupe: deljen normalized_nr14, različen normalized → flag, NOT_MERGED
by_n14 = {}
for i, p in enumerate(persons_new):
    if p.get("normalized_nr14"):
        by_n14.setdefault(p["normalized_nr14"], []).append(i)
variant_groups = []
gseq = 0
for nkey, idxs in by_n14.items():
    if len(idxs) < 2 or not nkey:
        continue
    norms = {persons_new[i]["normalized"] for i in idxs}
    if len(norms) < 2:
        continue  # identne forme — possible_duplicate pokriva; ni variantna grupa
    gseq += 1
    gid = f"NR14-G{gseq:02d}"
    subs_all = sorted({s for i in idxs for s in persons_new[i].get("nr14_variants", [])})
    for i in idxs:
        persons_new[i]["nr14_variant_group"] = gid
        persons_new[i]["nr14_merge_decision"] = "NOT_MERGED"
    variant_groups.append({
        "group_id": gid,
        "normalized_nr14": nkey,
        "variants": subs_all or ["(norm-avtomatika, brez eksplicitnega para)"],
        "members": [
            {
                "name_original": persons_new[i]["name_original"],
                "person_type": persons_new[i]["person_type"],
                "house_no": str(persons_new[i].get("house_no")),
            }
            for i in idxs
        ],
    })

n_ps_persons = sum(1 for p in persons_new if p["person_type"] == "owner(ps)")
persons_out = {
    "val": "126",
    "pass": "sync (PUA↔PS v126 + NR-14 sodba, F-V125-01)",
    "issue": "#42 §4/§14",
    "title": "PERSON-OWNER REGISTER 1825 — NR-14 sodba + pass2 re-run (val 126)",
    "method": {
        "rules": [
            "nič združevanja imen; possible_duplicate + nr14_variant_group flagi z razlogo",
            "owner(ps) = en vnos per (haus_no, ime) s stranmi pojavitve (p3–p55, val 119/123/125 stanje)",
            "owner(pua)/owner_variant(pt) nedotaknjena iz val 59 pass2 (+ add-only NR-14 ključi)",
            "PS p56–143 (PROVISIONAL F-PV-04/NR-14) izključeno (F-SYNC-04)",
            "NR-14 izenačitev = flag-only (nr14-variant-map-1825.json V1–V6); normalized_nr14 ključ za prihodnjo p56–143 serijo",
        ],
        "change_vs_v119_del3": (
            f"owner(ps) re-izveden na v125 stanju ({n_ps_persons} vnosov; val 119-del3: 656) — "
            "v123 sweep + v125 p7 imenska/hišna plast vstopata v osebno plast "
            "(F-V125-01 zaprt); NR-14 ključi add-only"
        ),
    },
    "provenance": {
        **(person_reg.get("provenance") or {}),
        "ps": "ps-n83/register.json (1.078 vrstic p3–p55, val 119/123/125 dvojni sidr + Nro 92)",
        "nr14": "atlas-1825/nr14-variant-map-1825.json (val 126 sodba, 0 VLM)",
        "sync": "atlas-1825/build-sync-v126.py (val 126, 0 VLM)",
    },
    "persons_total": len(persons_new),
    "possible_duplicates": dup_count,
    "nr14_variant_groups": len(variant_groups),
    "persons": persons_new,
}

# ---------- 2) house-register ----------
sim_v1 = {str(row["house"]): row["sim"] for row in analysis_v1["A_pua_vs_ps"]["rows"]}
houses_out = []
stale_ps_houses = []
provisional_kept = []
for hobj in house_reg["houses"]:
    h = hobj["house_no_1825"]
    hn_key = str(h)
    hout = dict(hobj)
    cur_ps = (hout.get("owners") or {}).get("ps")
    if isinstance(cur_ps, dict) and cur_ps.get("layer") == "PROVISIONAL":
        # val 122 PROVISIONAL plast (p56–143) — izrecno zaščitena pred sync (F-SYNC-04)
        q = dict(hout)
        q["owners"] = dict(hout["owners"])
        q["owners"]["ps"] = dict(cur_ps)
        q["owners"]["ps"]["sync_note"] = (
            "val 126: PROVISIONAL plast nespremenjena (F-SYNC-04 — p56–143 izključeno "
            "iz osebne sinhronizacije do re-read serije val 127+; NR-14 karta pripravljena)"
        )
        houses_out.append(q)
        provisional_kept.append(hn_key)
        continue
    prows = ps_by_house.get(hn_key) or []
    if prows:
        o, st = ps_owner_of(prows)
        distinct = {}
        for r in prows:
            nm = (r.get("owner_original") or "").strip()
            distinct.setdefault(nm, []).append(r["page"])
        hout["owners"] = dict(hout.get("owners") or {})
        hout["owners"]["ps"] = {
            "owner_original": o,
            "stand": st,
            "pages": sorted(set(r["page"] for r in prows)),
            "rows": len(prows),
            "coverage": "PARTIAL (55/143 strani)",
        }
        hout["owners"]["ps_distinct"] = [
            {"name": nm, "pages": sorted(set(pgs)), "rows": len(pgs)}
            for nm, pgs in distinct.items()
        ]
        hout["parcel_refs"] = dict(hout.get("parcel_refs") or {})
        hout["parcel_refs"]["ps_rows"] = len(prows)
        hout["parcel_refs"]["ps_kultur"] = dict(
            Counter((r.get("kultur") or "").strip() for r in prows if (r.get("kultur") or "").strip())
        )
    elif isinstance(hout.get("owners"), dict) and hout["owners"].get("ps"):
        old_ps = dict(hout["owners"]["ps"])
        hout["owners"] = dict(hout["owners"])
        hout["owners"]["ps"] = None
        hout["owners"]["ps_stale"] = old_ps
        hout["owners"]["ps_stale"]["stale_reason"] = (
            "val 126 re-run: PS p3–p55 (v119/123/125) nima več vrstic z lastnikom pri "
            "tej hiši — prejšnji owner je bil del v125 hišnih popravkov (npr. p7 "
            "hiša 63→53, 65→49, 35→55, 80→48) ali zamika vrstic; dokaz ohranjen "
            "(protokoli 142/148)"
        )
        stale_ps_houses.append(hn_key)
    if hn_key.isdigit() and int(hn_key) in v126_by_house:
        row = v126_by_house[int(hn_key)]
        hout["pua_ps_name_sim"] = row["sim_concat_first"]  # kontinuiteta val 58
        hout["pua_ps_name_sim_v126"] = {
            "method": "token surname-first LCS (metoda B, nespremenjena od val 119 del 3)",
            "sim_surname": row["sim_surname"],
            "sim_any": row["sim_any"],
            "best_ps_name": row["best_ps_name"],
            "exact_token": row["best_exact_token"],
            "class": row["class_v126"],
            "n_distinct": row["n_distinct"],
        }
        hout["pua_ps_name_sim_v119"] = hout.get("pua_ps_name_sim_v119")  # kontinuiteta
        if hout.get("evidence_status") in ("AGREE", "PARTIAL", "CONFLICT"):
            hout["evidence_status"] = (
                row["class_v126"] if row["class_v126"] != "MISMATCH" else "CONFLICT"
            )
    houses_out.append(hout)

houses_out_obj = dict(house_reg)
houses_out_obj["val"] = "126"
houses_out_obj["pass"] = "sync (PUA↔PS v126 + NR-14 sodba, F-V125-01)"
houses_out_obj["houses"] = houses_out
cov_h = Counter(h["evidence_status"] for h in houses_out)
houses_out_obj["coverage"] = dict(cov_h)
houses_out_obj["method"] = dict(house_reg.get("method") or {})
houses_out_obj["method"]["v126_sync_note"] = (
    "val 126: owners.ps/ps_distinct/parcel_refs re-izvedeni na v125 stanju; "
    "pua_ps_name_sim_v126 = metoda B (v119 stolpec ohranjen); PROVISIONAL plasti "
    f"h72/74/76 zaščitene ({len(provisional_kept)} hiš); owners.ps_stale mehanizem "
    "ohranjen — v125 hišni popravki premaknili lastnike (npr. H-035 p7 → hiša 55)"
)
houses_out_obj["provenance"] = {
    **(house_reg.get("provenance") or {}),
    "ps": "ps-n83/register.json (1.078 vrstic p3–p55, val 119/123/125 dvojni sidr + Nro 92)",
    "nr14": "atlas-1825/nr14-variant-map-1825.json (val 126 sodba, 0 VLM)",
    "sync": "atlas-1825/build-sync-v126.py (val 126, 0 VLM)",
}

# ---------- 3) conflict-register (CH posodobitve) ----------
conflicts_out = []
for c in conf_reg["conflicts"]:
    if c["conflict_type"] != "owner_state_pua_vs_ps":
        conflicts_out.append(c)
        continue
    ent = c["entity"]
    m = re.search(r"hiša (\d+)", ent)
    if not m:
        conflicts_out.append(c)
        continue
    h = int(m.group(1))
    row = v126_by_house.get(h)
    if not row:
        conflicts_out.append(c)
        continue
    nc = dict(c)
    nc["claim_b"] = {
        "owner": row["ps_first"],
        "sim_concat": row["sim_concat_first"],
        "sim_surname": row["sim_surname"],
        "sim_any": row["sim_any"],
        "best_ps_name": row["best_ps_name"],
        "n_distinct": row["n_distinct"],
        "pages": row["ps_pages"],
    }
    if c.get("note") and not c.get("note_v119"):
        nc["note_v119"] = c["note"]  # sodba val 119 del 3 ohranjena (add-only dokaz)
    if row["class_v126"] == "AGREE":
        if row["best_ps_name"] == row["ps_first"]:
            nc["status"] = "RESOLVED"
            nc["note"] = (
                f"val 126: PS first-owner '{row['ps_first']}' potjuje PUA vpis "
                f"(sim_surname {row['sim_surname']}, metoda B) — zgodovinski razredi "
                f"val 58 ({row.get('class_v58')}) in val 119 ({row.get('class_v119')}) "
                f"ohranjena v dokazih"
            )
        else:
            nc["status"] = "PARTIALLY_RESOLVED"
            nc["note"] = (
                f"val 126: PUA lastnik potrjen med PS so-živečimi hiše "
                f"('{row['best_ps_name']}', sim_surname {row['sim_surname']}, metoda B); "
                f"first-owner '{row['ps_first']}' ostaja drugačno stanje — obe trditvi ohranjeni"
            )
    else:
        nc["status"] = "OPEN"
        nc["note"] = (
            f"val 126 re-run: {row['n_distinct']} distinct imen pri hiši; "
            f"best '{row['best_ps_name']}' sim_surname {row['sim_surname']} — "
            f"nesoglasje ostaja (F9)"
        )
    conflicts_out.append(nc)

conf_out = dict(conf_reg)
conf_out["val"] = "126"
conf_out["conflicts"] = conflicts_out
conf_out["coverage"] = dict(Counter(c["conflict_type"] for c in conflicts_out))
conf_out["provenance"] = {
    **(conf_reg.get("provenance") or {}),
    "sync": "atlas-1825/build-sync-v126.py (val 126, 0 VLM)",
}

# ---------- najdbe F-SYNC ----------
n_agree = cls_v126_counts.get("AGREE", 0)
n_partial = cls_v126_counts.get("PARTIAL", 0)
n_mismatch = cls_v126_counts.get("MISMATCH", 0)
improved = sum(
    1 for r in rows_v126
    if r["class_v58"] == "MISMATCH" and r["class_v126"] in ("AGREE", "PARTIAL")
)
chg_vs_v119 = sorted(
    r["house"] for r in rows_v126
    if (r["class_v119"] or r["class_v126"]) and r["class_v119"] != r["class_v126"]
)

analysis_out = {
    "val": "126",
    "date": "2026-10-09",
    "issue": "#42 §4/§14",
    "title": "ANALYSIS v8 — NR-14 sodba + pass2 re-run na v125 stanju (F-V125-01 zaprt)",
    "inputs": [
        "ps-n83/register.json (2.876 vrstic; sinhronizacija uporablja samo p3–p55 = 1.078)",
        "pua-n83/register.json (98 vpisov, val 51+57)",
        "atlas-1825/analysis-v1.json (val 58 A_pua_vs_ps = primerjalna baza)",
        "ps-n83/analysis-v7.json (val 119-del3 razredi = kontinuitetni stolpec class_v119)",
        "atlas-1825/nr14-variant-map-1825.json (NR-14 sodba, val 126)",
        "atlas-1825/person-owner-register-1825.json / house-register-1825.json / conflict-register-1825.json (val 119-del3 pre-state)",
    ],
    "method": {
        "sim_concat": "1:1 replika val 58 token_sim (F-SYNC-01: LCS nad zlepljenim nizom) — kontinuiteta",
        "sim_surname": "metoda B, NESPREMENJENA od val 119 del 3 (prvi token PS = priimek; max LCS; exact-token flag)",
        "sim_any": "max LCS nad vsemi token pari (dokumentacija, ne vodi razreda)",
        "pragovi": "AGREE ≥0.7; PARTIAL ≥0.5 IN exact token; sicer MISMATCH",
        "nr14": "token-točne zamenjave po nr14-variant-map-1825.json (V1–V5; V6 = NFKD ſ→s avtomatika) → normalized_nr14; flag-only, NOT_MERGED",
        "no_guessing": "nobeno ime ni združeno; vsa nesoglasja ostajajo v CH konfliktih",
        "scope": "PS p3–p55 (val 119/123/125 kakovostna plast); p56–143 PROVISIONAL izključeno (F-SYNC-04)",
    },
    "A_pua_vs_ps_v126": {
        "houses": len(rows_v126),
        "class_v58": dict(cls_v58_counts),
        "class_v119": dict(cls_v119_counts),
        "class_v126": dict(cls_v126_counts),
        "agree_houses": agree_houses,
        "partial_houses": partial_houses,
        "improved_vs_v58": improved,
        "changed_vs_v119_houses": chg_vs_v119,
        "rows": rows_v126,
    },
    "nr14_adjudication": {
        "map": "atlas-1825/nr14-variant-map-1825.json",
        "pairs": [p["pair_id"] + " " + "/".join(p["forms"]) for p in nr14["variant_pairs"]],
        "rejected": [r["form"] for r in nr14["rejected_forms"]],
        "in_register_variant_groups": len(variant_groups),
        "variant_groups": variant_groups,
        "statement": (
            "NR-14 sodba zaprta za p7 (protokol 148 §2): Rabitscher≡Rabutschar, "
            "Georg≡Grogy, Pödigz≡Poiding (v125), Schimecz≡Schimez (UNDECIDED kanon za "
            "grupiranje), Mihual≡Michual, Maruſa≡Marusa (NFKD); zavrnjene forme: "
            "Marls, Rabatschar, Schimz, Schimez P…a 2. beseda. Merjeno: 0 variantnih "
            "grup v register — forme že kanonizirane na strani; karta = pravilna baza "
            "za p56–143 osebni re-read (val 127+)."
        ),
    },
    "findings": [
        {"id": "F-SYNC-01", "status": "DOCUMENTED", "statement": "kontinuiteta (val 119 del 3): sim_concat = replika val 58 metode; metoda B primarna."},
        {
            "id": "F-SYNC-02",
            "status": "DOCUMENTED",
            "statement": (
                f"Na v125 stanju (metoda B): {n_agree} AGREE (hiše {agree_houses}), "
                f"{n_partial} PARTIAL (hiše {partial_houses}), {n_mismatch} MISMATCH; "
                f"{chg_vs_v119 or 'brez'} hiš z razredno spremembo vs. val 119 del 3."
            ),
        },
        {"id": "F-SYNC-03", "status": "DOCUMENTED", "statement": "kontinuiteta (val 119 del 3): sim_any lažno soglasje prek danega imena — razred vodi sim_surname (+ exact token za PARTIAL)."},
        {
            "id": "F-SYNC-04",
            "status": "DOCUMENTED",
            "statement": (
                "Sinhronizacija uporablja izključno PS p3–p55 (1.078 vrstic); PS p56–143 "
                "(1.798 vrstic) ostaja PROVISIONAL (F-PV-04/NR-14) in ni vstopila v osebno "
                "plast; hišne PROVISIONAL plasti h72/74/76 (val 122) izrecno zaščitene "
                f"({len(provisional_kept)} hiš: {', '.join(provisional_kept)}). Razširitev "
                "scope-a sledi z re-read serijo val 127+ (6 strani/val)."
            ),
        },
        {
            "id": "F-SYNC-05",
            "status": "DOCUMENTED",
            "statement": (
                f"{len(stale_ps_houses)} hiš ima owners.ps_stale po v125 hišnih popravkih "
                f"({', '.join(sorted(stale_ps_houses)) or 'brez'}) — dokaz ohranjen, "
                "owners.ps = None, KG OWNER_OF PS povezava se ne ustvarja (ni join missa)."
            ),
        },
        {
            "id": "F-SYNC-06",
            "status": "DOCUMENTED",
            "statement": (
                "NR-14 vgradnja: vse osebe nosijo normalized_nr14 (+ nr14_variants pri "
                "aplikiranih parih); variantne grupe = flag-only (NOT_MERGED). Merjeno "
                f"stanje: {len(variant_groups)} variantnih grup v register. F-V125-01 "
                "ZAPRT — person-owner-register + house-register owners.ps zdaj odražata "
                "v123/v125 (H-035 pages brez p7 po stari hiši 35; p7 lastniki na hišah "
                "53/49/55/48/45/46/47)."
            ),
        },
    ],
    "doctrine_impact": [
        "F9 (PUA pripravljalno vs PS končno stanje) OSTAJA okvir — CH statusi ponovno izvedeni na v125 imenih.",
        "NR-14 črkovalna sodba je zaprta kot MAŠINOBERLJIVA karta — p56–143 re-read serija (val 127+) bere z enakimi ključi; identiteta oseb ostaja eksplicitna (nič mergeov).",
        "KG osebni sloj vsebinsko SPREMENJEN (prvič od val 122): v125 p7 osebe vstopajo; PROVISIONAL p56–143 ostaja zunaj (F-SYNC-04) — RG-009/010/011 ostajajo OPEN do p65/69/115/122 re-reada.",
    ],
}

# ---------- izhodi ----------
assert len(persons_new) == 98 + n_ps_persons + 227, (
    f"persons {len(persons_new)} != 98 + {n_ps_persons} + 227"
)
assert n_ps_persons > 0
assert all(
    p.get("merge_decision") in (None, "NOT_MERGED")
    and p.get("nr14_merge_decision", "NOT_MERGED") == "NOT_MERGED"
    for p in persons_new
)
assert len(conflicts_out) == 113, f"konfliktov {len(conflicts_out)} != 113"
assert sum(1 for c in conflicts_out if c["conflict_type"] == "owner_state_pua_vs_ps") == 51
assert len(houses_out) == 169, f"hiš izhod {len(houses_out)} != 169"
assert len(provisional_kept) == 3, f"PROVISIONAL hiš {len(provisional_kept)} != 3 (h72/74/76)"

write(os.path.join(RG, "ps-n83", "analysis-v8.json"), analysis_out)
write(person_reg_path, persons_out)
write(house_reg_path, houses_out_obj)
write(conf_reg_path, conf_out)
print(f"NR-14: {len(NR14_SUBS)} substitucij; variantnih grup: {len(variant_groups)}; possible_dups: {dup_count}")
print(f"A_pua_vs_ps_v126: {dict(cls_v126_counts)} (v119: {dict(cls_v119_counts)})")
print(f"stale_ps_houses: {sorted(stale_ps_houses)}; PROVISIONAL kept: {provisional_kept}")
print(f"CH statusi: {dict(Counter(c['status'] for c in conflicts_out if c['conflict_type'] == 'owner_state_pua_vs_ps'))}")
