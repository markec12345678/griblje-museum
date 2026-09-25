#!/usr/bin/env python3
"""
Val 59 — ATLAS 1825 PASS 2: House + BP reconciliation (issue #42 §2/§3/§5/§14)
Lokalna, deterministična združitev obstoječih registrov v enotne entitete:
  1. house-register-1825.json        (§2 — hiše z lastniki iz PUA/PS/PT/A01, ločeno house_no ≠ BP ≠ parcela)
  2. bp-house-reconciliation-1825.json (§3 — BP 1–100 matrica FOUND/UNCERTAIN/CONFLICT/NOT_FOUND)
  3. conflict-register-1825.json     (§14 — centralni register konfliktov, nič skritega z mergeom)
  4. person-owner-register-1825.json (§5 — osebe brez avtomatskega združevanja)

Pravila (issue #42 + uporabnikovo "KLJUČNO RAZUMEVANJE"):
  - vsak podatek s source/provenanco
  - nič ugibanja; negotovost ostane označena
  - imena se NE združujejo (samo possible_duplicate flagi z razlogom)
  - PUA = pripravljalno stanje; PS+PT = končna stanja (val 58 F9/F10) — obe trditvi ohranjeni
  - PS pokritost PARTIAL (55/143) — hiše 70–78 čakajo p56+
"""
import json, re, unicodedata, os
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
RG = os.path.dirname(BASE)
REPO = os.path.dirname(RG)

def load(p):
    with open(p) as f: return json.load(f)

pua = load(os.path.join(RG, "pua-n83", "register.json"))
ptdoc = load(os.path.join(RG, "pt-n83", "register.json"))
pt = ptdoc["register"]
ps = load(os.path.join(RG, "ps-n83", "register.json"))
matrix = load(os.path.join(RG, "raw-web-val57-2026-10", "bp-house-matrix.json"))
cad = load(os.path.join(REPO, "src", "data", "cadastre-a01.json"))
analysis = load(os.path.join(RG, "ps-n83", "analysis-v1.json"))

def norm(s):
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"[^a-zA-Z]", "", s).lower()
    return s

# ---------------------------------------------------------------
# 0) indeksi
# ---------------------------------------------------------------
pua_by_house = {}
for e in pua:
    hn = str(e.get("house_no") or "").strip()
    if not hn: continue
    pua_by_house.setdefault(hn, []).append({
        "owner_original": e.get("owner_original"),
        "page": e.get("page"),
        "entry_no": e.get("entry_no"),
        "review_status": e.get("review_status"),
        "residence_original": e.get("residence_original") or None,
        "n_parcels": len(e.get("parcels") or []),
        "annotation_original": (e.get("annotation_original") or None),
    })

pt_by_house = {}
for r in pt:
    hn = str(r.get("house_no") or "").strip()
    if not hn or hn.startswith("["): continue
    pt_by_house.setdefault(hn, []).append({
        "bp": r.get("bp_no"),
        "bp_review_status": r.get("review_status"),
        "owner_variants": r.get("owner_variants") or [],
        "page": r.get("page"),
    })

def ps_owner_of(rows):
    for r in rows:
        n = (r.get("owner_original") or "").strip()
        if n and n != "~":
            return n, r.get("stand") or None
    return None, None

ps_by_house = {}
for r in ps:
    hn = str(r.get("haus_no") or "").strip()
    if not hn: continue
    ps_by_house.setdefault(hn, []).append(r)

a01_by_house = {}
for b in cad["buildings"]:
    if b.get("house_no") is not None and b.get("owner"):
        a01_by_house.setdefault(str(b["house_no"]), []).append({
            "bp": b.get("bp"), "owner": b.get("owner"),
            "owner_status": b.get("owner_status"),
            "link_source": b.get("link_source"), "owner_page": b.get("owner_page"),
        })

# PUA↔PS sim rezultati iz val 58 (house-level)
sim_pua_ps = {}
for row in analysis["A_pua_vs_ps"]["rows"]:
    sim_pua_ps[str(row["house"])] = row["sim"]

# ---------------------------------------------------------------
# 1) conflict register (§14) — zgrajen PRVI, hiše se nanj sklicujejo
# ---------------------------------------------------------------
conflicts = []

def add_conflict(cid, ctype, entity, claim_a, src_a, claim_b, src_b, status, resolve, note=None):
    c = {"conflict_id": cid, "conflict_type": ctype, "entity": entity,
         "claim_a": claim_a, "source_a": src_a, "claim_b": claim_b, "source_b": src_b,
         "status": status, "what_would_resolve": resolve}
    if note: c["note"] = note
    conflicts.append(c)

# CB-xx: BP↔hiša vezavni konflikti (iz val 57 matrice)
for row in matrix:
    if row["final_status"] == "CONFLICT":
        add_conflict(
            f"CB-{row['bp']:03d}", "bp_house_binding", f"BP {row['bp']}",
            {"pt_houses": row["pt_houses"], "pt_status": row["pt_status"]},
            "PT N083 p7 (val 41/52/53 branja)",
            {"pua_refs": row["pua_refs"], "a01_owner": row["a01_owner"]},
            "PUA opombe + A01 val 52/54/56",
            "OPEN",
            "polna ločljivost PUA/PT strani (P2-E15); dodatna neodvisna branja",
            note=row.get("note"),
        )

# CH-xx: lastniška nesoglasja PUA↔PS po hišah (val 58 F9 — RAZLIČNI STANJI, ne bralna napaka)
ch_per_house = Counter()
for row in analysis["A_pua_vs_ps"]["rows"]:
    if row["class"] in ("MISMATCH", "FUZZY"):
        ch_per_house[row["house"]] += 1
        seq = ch_per_house[row["house"]]
        add_conflict(
            f"CH-{row['house']:03d}-{seq:02d}", "owner_state_pua_vs_ps", f"hiša {row['house']}",
            {"owner": row["pua_owner"]}, "PUA N83 (pripravljalno stanje, val 51/57)",
            {"owner": row["ps_owner"], "sim": row["sim"]},
            f"PS N83 s. {row['ps_pages']} (končno stanje 1825, PARTIAL 55/143)",
            "OPEN",
            "PS p56–p143 + preverjanje, ali je PUA vpis nadomeščen s pfand/prehodom (cf. p12 »Auf pfandbeyern 1801«)",
            note=("FUZZY (delna podobnost imen)" if row["class"] == "FUZZY" else
                  "različni lastniški stanji (F9): PUA pripravljalno vs PS končno — obe trditvi ohranjeni"),
        )

# CF-xx: poimenovane najdbe F1–F8 iz pt-n83/reconciliation.json (val 54) + statusi po val 56/57
rec = load(os.path.join(RG, "pt-n83", "reconciliation.json"))
CF_STATUS = {
    "F1": ("DOCUMENTED", "metodološka doktrina (PT imena nestabilna; PS korooboracija = razsodnik, val 58 F10)"),
    "F2": ("DOCUMENTED", "bralni artefakt pomika vrstic; večinski glasovi razrešujejo"),
    "F3": ("PARTIALLY_RESOLVED", "val 56 P2-E15: vezava B.P. 98↔Zollamt ponovno vzpostavljena (opomba v nadaljevalni vrstici); hišna vezava h.70 vs h.20/39/50 ostaja → cf. CB-098"),
    "F4": ("OPEN", "polna ločljivost PT p5/p7 (P2-E15)"),
    "F5": ("OPEN", "polna ločljivost PUA h.29 okolice + PT p7"),
    "F6": ("OPEN", "polna ločljivost PUA p30 + PT p7"),
    "F7": ("PARTIALLY_RESOLVED", "val 57: opomba »b. P. 56. 38.« znak-po-znak potrjena @ nativno ločljivost; vezava bp 86 ostaja REVIEW-CONFLICT → cf. CB-086"),
    "F8": ("RESOLVED", "bp 94→h.40 = 3 neodvisni viri + PUA no. 38 → VERIFIED-2x (najmočnejša vez)"),
}
for i, f in enumerate(rec.get("headline_findings") or [], start=1):
    fid = f"F{i}"
    status, resolve = CF_STATUS.get(fid, ("OPEN", "glej vir"))
    add_conflict(
        f"CF-{fid}", "named_finding", f"najdba {fid}",
        {"opis": f}, "pt-n83/reconciliation.json headline_findings (val 54)",
        None, None, status, resolve,
    )

# ---------------------------------------------------------------
# 2) house register (§2)
# ---------------------------------------------------------------
all_house_nos = sorted(set(list(pua_by_house) + list(ps_by_house) + list(pt_by_house) + list(a01_by_house)),
                       key=lambda h: (not h.isdigit(), int(h) if h.isdigit() else 0, h))

# BP → hiša kandidati (iz matrice) za bp_refs
bp_to_houses = {}
for row in matrix:
    houses = set()
    for h in row.get("pt_houses") or []:
        hs = str(h).strip()
        if hs.isdigit(): houses.add(hs)
    for ref in row.get("pua_refs") or []:
        hs = str(ref.get("house_no") or "").strip()
        if hs.isdigit(): houses.add(hs)
    for hs in houses:
        bp_to_houses.setdefault(hs, []).append({"bp": row["bp"], "final_status": row["final_status"]})

def house_evidence(hn):
    """Conservative house-level evidence status (§2: jasno, kaj je dokazano)."""
    has_pua = hn in pua_by_house
    has_ps = hn in ps_by_house
    has_pt = hn in pt_by_house
    has_a01 = hn in a01_by_house
    sim = sim_pua_ps.get(hn)
    n_sources = sum([has_pua, has_ps, has_pt, has_a01])
    if has_pua and has_ps:
        if sim is not None and sim >= 0.7: return "AGREE"
        if sim is not None and sim >= 0.5: return "PARTIAL"
        return "CONFLICT"  # F9 različna stanja — obe trditvi ohranjeni
    if n_sources >= 2: return "PARTIAL"
    if n_sources == 1: return "SINGLE_SOURCE"
    return "UNKNOWN"

houses_out = []
for hn in all_house_nos:
    is_digit = hn.isdigit()
    pua_rows = pua_by_house.get(hn) or []
    ps_rows = ps_by_house.get(hn) or []
    pt_rows = pt_by_house.get(hn) or []
    a01_rows = a01_by_house.get(hn) or []
    ps_owner, ps_stand = ps_owner_of(ps_rows)
    ev = house_evidence(hn)
    htype = "gruble_house" if is_digit else ("external_ref" if "/" in hn else "special")
    hconf = [c["conflict_id"] for c in conflicts
             if c["conflict_type"] == "owner_state_pua_vs_ps" and c["entity"] == f"hiša {int(hn) if is_digit else hn}"]
    kultur_counts = dict(Counter((r.get("kultur") or "").strip() for r in ps_rows if (r.get("kultur") or "").strip()))
    houses_out.append({
        "house_id": f"H-{hn.replace(' ', '').replace('/', '-')}" if not is_digit else f"H-{int(hn):03d}",
        "house_no_1825": hn,
        "house_no_type": htype,
        "evidence_status": ev if htype == "gruble_house" else "UNKNOWN_SEMANTICS",
        "owners": {
            "pua": pua_rows if pua_rows else None,
            "ps": ({"owner_original": ps_owner, "stand": ps_stand,
                    "pages": sorted(set(r["page"] for r in ps_rows)), "rows": len(ps_rows),
                    "coverage": "PARTIAL (55/143 strani)"}) if ps_rows else None,
            "pt": ({"variants": sorted({v for r in pt_rows for v in r["owner_variants"] if v.strip()}),
                    "bps": sorted({r["bp"] for r in pt_rows}),
                    "pages": sorted({r["page"] for r in pt_rows})}) if pt_rows else None,
            "a01": a01_rows if a01_rows else None,
        },
        "pua_ps_name_sim": sim_pua_ps.get(hn),
        "bp_refs": bp_to_houses.get(hn, []),
        "parcel_refs": {
            "pua_parcels_total": sum(r["n_parcels"] for r in pua_rows) if pua_rows else 0,
            "ps_rows": len(ps_rows),
            "ps_kultur": kultur_counts,
        },
        "conflict_ids": hconf,
        "notes": None,
    })
    h = houses_out[-1]
    if htype != "gruble_house":
        h["notes"] = "sestavljena/nelokalna referenca — semantika TO-DECODE (val 58 F12)"
    elif int(hn) in range(70, 79):
        h["notes"] = "PS blok te hiše čaka p56–p143 (vrzel 70–78 v prebranem delu)"

# ---------------------------------------------------------------
# 3) BP↔HOUSE reconciliacija (§3)
# ---------------------------------------------------------------
STATUS_MAP = {"CONFIRMED": "FOUND", "PROBABLE": "UNCERTAIN", "UNRESOLVED": "UNCERTAIN",
              "CONFLICT": "CONFLICT", "NOT_FOUND": "NOT_FOUND"}
bp_out = []
for row in matrix:
    hconf = [c["conflict_id"] for c in conflicts if c["conflict_id"] == f"CB-{row['bp']:03d}"]
    bp_out.append({
        "bp": row["bp"],
        "atlas_status": STATUS_MAP[row["final_status"]],
        "val57_status": row["final_status"],
        "house_candidates": {
            "pt_houses": row.get("pt_houses") or [],
            "pua_refs": row.get("pua_refs") or [],
        },
        "a01": ({"owner": row["a01_owner"], "status": row["a01_status"]} if row.get("a01_owner") else None),
        "conflict_ids": hconf,
        "note": row.get("note"),
    })

# ---------------------------------------------------------------
# 4) person/owner register (§5) — NIČ združevanja
# ---------------------------------------------------------------
persons = []
def add_person(name, ptype, source, page, house, status, note=None):
    if not name or not name.strip() or name.strip() == "~": return
    p = {"name_original": name.strip(), "normalized": norm(name), "person_type": ptype,
         "source": source, "page": page, "house_no": house, "evidence_status": status}
    if note: p["note"] = note
    persons.append(p)

for e in pua:
    add_person(e.get("owner_original"), "owner(pua)", "PUA N83", e.get("page"), e.get("house_no"),
               e.get("review_status") or "REVIEW")
for hn, rows in ps_by_house.items():
    o, st = ps_owner_of(rows)
    add_person(o, "owner(ps)", "PS N83 (PARTIAL)", sorted(set(r["page"] for r in rows)), hn,
               "SINGLE_SOURCE")
for r in pt:
    for v in (r.get("owner_variants") or []):
        add_person(v, "owner_variant(pt)", "PT N083 p7", r.get("page"), r.get("house_no"),
                   r.get("review_status") or "REVIEW",
                   note="nestabilna branja (val 54 F1) — uporabna le s PS korooboracijo (val 58 F10)")

# possible_duplicate flagi ZNOTRAJ istega normaliziranega imena (nič mergea)
by_norm = {}
for i, p in enumerate(persons):
    by_norm.setdefault(p["normalized"], []).append(i)
for nkey, idxs in by_norm.items():
    if len(idxs) > 1 and nkey:
        houses = {str(persons[i]["house_no"]) for i in idxs}
        sources = {persons[i]["source"].split(" ")[0] for i in idxs}
        for i in idxs:
            persons[i]["possible_duplicate"] = True
            persons[i]["merge_decision"] = "NOT_MERGED"
            persons[i]["reason"] = (f"identno normalizirano ime v {len(idxs)} zapisih "
                                    f"({len(houses)} hiša/hiš, viri: {', '.join(sorted(sources))}) — "
                                    f"združitev šele z dodatnim dokazom (§5)")

# ---------------------------------------------------------------
# izhod
# ---------------------------------------------------------------
def write(name, obj):
    path = os.path.join(BASE, name)
    with open(path, "w") as f:
        json.dump(obj, f, indent=1, ensure_ascii=False)
    print(f"{name}: {os.path.getsize(path)} B")

provenance = {
    "pua": "pua-n83/register.json (98 vpisov, val 51+57)",
    "pt": "pt-n83/register.json (100 vrstic, val 53) + pt-n83/reconciliation.json (val 54+56+57)",
    "ps": "ps-n83/register.json (1.073 vrstic, 55/143 strani, val 57) + ps-n83/analysis-v1.json (val 58)",
    "bp_matrix": "raw-web-val57-2026-10/bp-house-matrix.json (100 vrstic, val 57)",
    "a01": "src/data/cadastre-a01.json (56 stavb, val 52+54+56)",
}

coverage_houses = Counter(h["evidence_status"] for h in houses_out)
coverage_bp = Counter(b["atlas_status"] for b in bp_out)
coverage_conf = Counter(c["conflict_type"] for c in conflicts)

write("house-register-1825.json", {
    "val": "59", "pass": 2, "issue": "#42 §2",
    "title": "HOUSE REGISTER 1825 — hiše Gribelj, združen pregled PUA/PS/PT/A01",
    "method": {
        "rules": ["house_no ≠ BP ≠ parcela (ločeni model)", "nič ugibanja",
                  "imena ne-združena; konflikti ostajajo", "vsak podatek z virom/stranjo"],
        "evidence_status_logic": {
            "AGREE": "PUA+PS lastnik podoben (token LCS ≥0.7)",
            "PARTIAL": "PUA+PS delno podoben (0.5–0.7) ALI ≥2 vira brez PUA+PS parice",
            "CONFLICT": "PUA+PS nesoglasje (F9 različni stanji — obe trditvi ohranjeni, cf. conflict register)",
            "SINGLE_SOURCE": "samo en vir",
            "UNKNOWN": "brez lastniškega dokaza",
            "UNKNOWN_SEMANTICS": "sestavljen '1 / N' sklic (F12 TO-DECODE)",
        },
        "ps_coverage_warning": "PS bloki za hiše 70–78 (vključno Zollamt h.70) čakajo p56–p143",
    },
    "provenance": provenance,
    "coverage": dict(coverage_houses),
    "houses_total": len(houses_out),
    "houses": houses_out,
})

write("bp-house-reconciliation-1825.json", {
    "val": "59", "pass": 2, "issue": "#42 §3",
    "title": "BP↔HOUSE RECONCILIATION 1825 — matrica BP 1–100",
    "status_map": STATUS_MAP,
    "provenance": provenance,
    "coverage": dict(coverage_bp),
    "bp_total": len(bp_out),
    "bp_rows": bp_out,
})

write("conflict-register-1825.json", {
    "val": "59", "pass": 2, "issue": "#42 §14",
    "title": "CONFLICT REGISTER 1825 — centralni register (nič skritega z mergeom)",
    "provenance": provenance,
    "coverage": dict(coverage_conf),
    "conflicts_total": len(conflicts),
    "conflicts": conflicts,
})

write("person-owner-register-1825.json", {
    "val": "59", "pass": 2, "issue": "#42 §5",
    "title": "PERSON/OWNER REGISTER 1825 — v1 brez združevanja (possible_duplicate samo z razlogom)",
    "method": {
        "no_auto_merge": "identna normalizirana imena = possible_duplicate+razlog, decision NOT_MERGED",
        "caveat": '"oseba omenjena v zbirki" ≠ "dokazana kot lastnik 1825"',
        "pt_caveat": "PT imena nestabilna (val 54 F1); uporabna le s PS korooboracijo (val 58 F10)",
    },
    "provenance": provenance,
    "persons_total": len(persons),
    "possible_duplicates": sum(1 for p in persons if p.get("possible_duplicate")),
    "persons": persons,
})

print()
print("HOUSE coverage:", dict(coverage_houses))
print("BP    coverage:", dict(coverage_bp))
print("CONF  types   :", dict(coverage_conf), "| total:", len(conflicts))
print("PERSONS:", len(persons), "| possible_duplicates:", sum(1 for p in persons if p.get('possible_duplicate')))
