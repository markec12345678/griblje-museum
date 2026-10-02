#!/usr/bin/env python3
"""
Val 119 del 3 — PUA↔PS OSEBNA SINHRONIZACIJA (F-PV-03/04 okvir) — issue #42 §4/§14.

Kontekst:
  - val 58 (analysis-v1.json): prva PUA↔PS primerjava po hišah — 51 hiš, 49 MISMATCH
    + 2 FUZZY, sim 0.114–0.564 (metoda "LCS po tokenih" iz build-analysis-v1.py).
  - val 113–119 (del 1/2a–2e): PS p3–p55 imensko + vrednostno re-read z DVOJNIM
    SIDROM (v119-names 731 vrstic, v114 → 0, v115 → 0) — osebna plast v ps-n83/
    register.json je zdaj bistveno boljša od val 57 stanja, na katerem počiva
    pass2 (val 59) owner(ps) plast (163 oseb, first-owner per hiša).
  - Ta skripta sinhronizira tri atlas plasti z V119 stanjem in PONOVNO izmeri
    PUA↔PS podobnost, odkrije in dokumentira metodološko pomanjkljivost vala 58
    ter posodobi CH konflikte (owner_state_pua_vs_ps) brez brisanja dokazov.

Metoda (0 VLM, 0 ugibanja — §4/§22):
  A) sim_concat — 1:1 replika val 58 `token_sim` (norm odstrani VSE ne-črke
     TUDI presledke → "po tokenih" docstring, implementacija pa LCS nad zlepljenim
     nizom; odkrito v tem valu = F-SYNC-01). Ohranjeno za kontinuiteto stolpcev.
  B) sim_surname — NOVA primarna metoda: tokenizirani nizi (presledki ohranjeni),
     prvi token PS imena (priimek, nemški red obeh virov) vs. VSI tokeni PUA imena;
     sim = max LCS po parih. Pragovi kot val 58: AGREE ≥ 0.7 / PARTIAL ≥ 0.5.
     PARTIAL dodatno zahteva EXACT token par (popolno ujemanje celega tokena) —
     ščiti pred lažnimi PARTIAL prek fonetično podobnih priimkov (h40 muster↔sautter
     0.615 → ostaja CONFLICT). sim_any = max nad vsemi pari (dokumentacijski stolpec,
     ne vodi razreda — h48 Höchsthaler↔Habschider prek "Georg" = lažno soglasje).

Spremembe (vse add-only / z ohranitvijo dokazov):
  1. ps-n83/analysis-v7.json — A_pua_vs_ps_v119 (51 hiš: pua_owner, ps_first,
     ps_distinct z stranmi, sim_concat_first/best, sim_surname/sim_any, razredi
     v58 + v119) + najdbe F-SYNC-01..04.
  2. atlas-1825/person-owner-register-1825.json — owner(ps) plast PONOVNO IZVEDENA
     iz trenutnega registra: en vnos per (haus_no, ime) s stranmi (pass2 model
     first-owner je skrčil 20 so-živečih na 1). owner(pua)/owner_variant(pt)
     NEDOTAKNJENA. possible_duplicate ponovno izvedeno čez vse osebe (nič mergeov).
  3. atlas-1825/house-register-1825.json — owners.ps posodobljen (+ ps_distinct
     add-only), pua_ps_name_sim ohranjen (kontinuiteta val 58), NOVO
     pua_ps_name_sim_v119, evidence_status ponovno izveden z metodo B (pragovi
     dokumentirani v method.evidence_status_logic), parcel_refs.ps_* ponovno.
  4. atlas-1825/conflict-register-1825.json — CH-xxx-01 (owner_state_pua_vs_ps)
     posodobljeni claim_b + opombe; status: RESOLVED, če je razred v119 AGREE in
     je najboljše PS ime = first-owner (primarni lastnik potrjen); 
     PARTIALLY_RESOLVED, če AGREE ampak najboljše ime ni first-owner (lastnik
     potrjen med so-živečimi); sicer OPEN. CB-*/CF-* NEDOTAKNJENI. Skupaj 113.

Scope sinhronizacije = PS p3–p55 (kakovostna plast val 119). PS p56–143
(PROVISIONAL, F-PV-04/NR-14) izključeno iz osebne sinhronizacije — F-SYNC-04.
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


# ---------- norm / sim ----------
def norm_concat(s):
    """1:1 replika val 58 `norm` (odstrani vse ne-črke, tudi presledke)."""
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"[^a-zA-Z]", "", s).lower()
    return s


def norm_tok(s):
    """Tokenizirana norma (presledki ohranjeni) — nova primarna metoda B."""
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
    """Val 58 `token_sim` — docstring pravi 'po tokenih', implementacija pa
    (ker norm odstrani presledke) dejansko LCS nad zlepljenima nizoma (F-SYNC-01)."""
    a, b = norm_concat(a), norm_concat(b)
    if not a or not b:
        return 0.0
    return lcs_ratio(a, b)


def sim_tokens(a, b):
    """Metoda B pomožnica: max LCS nad token pari + EXACT token par indikator."""
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
    """Priimkovna podobnost: PRVI token PS imena vs. vsi tokeni PUA imena."""
    tp = norm_tok(pua_name).split()
    ts = norm_tok(ps_name).split()
    if not tp or not ts:
        return 0.0, False
    first = ts[0]
    best = max(lcs_ratio(first, t) for t in tp)
    exact = any(first == t for t in tp)
    return best, exact


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

# ---------- GUARDI (fail-fast) ----------
assert len(ps) == 2875, f"PS register vrstic {len(ps)} != 2875"
ps_p3_55 = [r for r in ps if r["page"] <= 55]
assert len(ps_p3_55) == 1077, f"PS p3–p55 vrstic {len(ps_p3_55)} != 1077"
n_owner_rows = sum(
    1 for r in ps_p3_55 if (r.get("owner_original") or "").strip() not in ("", "~")
)
assert n_owner_rows == 1070, f"PS p3–p55 vrstic z owner {n_owner_rows} != 1070"
assert len(pua) == 98, f"PUA vpisov {len(pua)} != 98"
old_types = Counter(p["person_type"] for p in person_reg["persons"])
assert old_types["owner(pua)"] == 98, f"owner(pua) {old_types['owner(pua)']} != 98"
assert old_types["owner(ps)"] == 163, f"owner(ps) {old_types['owner(ps)']} != 163"
assert old_types["owner_variant(pt)"] == 227, (
    f"owner_variant(pt) {old_types['owner_variant(pt)']} != 227"
)
assert house_reg["houses_total"] == 167, f"hiš {house_reg['houses_total']} != 167"
assert conf_reg["conflicts_total"] == 113, (
    f"konfliktov {conf_reg['conflicts_total']} != 113"
)
ch_old = [
    c
    for c in conf_reg["conflicts"]
    if c["conflict_type"] == "owner_state_pua_vs_ps"
]
assert len(ch_old) == 51, f"CH konfliktov {len(ch_old)} != 51"
assert len(analysis_v1["A_pua_vs_ps"]["rows"]) == 51, "analysis-v1 A_pua_vs_ps != 51"
# p56–143 PROVISIONAL plast se NE sme vstopiti v sinhronizacijo (F-SYNC-04)
assert all(r["page"] <= 55 for r in ps_p3_55)

# ---------- indeksi ----------
# PUA: first owner per house (val 58 model — kontinuiteta)
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

# PS p3–p55: vrstice per haus (vsi haus nizi — kot pass2), owner ne-prazen
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


# ---------- A_pua_vs_ps_v119 ----------
v1_by_house = {row["house"]: row for row in analysis_v1["A_pua_vs_ps"]["rows"]}
rows_v119 = []
for h in sorted(set(pua_house_owner) & {int(k) for k in ps_by_house if k.isdigit()}):
    key = str(h)
    prows = ps_by_house[key]
    po = pua_house_owner[h]
    # distinct imena v vrstnem redu prve pojavitve
    distinct = {}
    for r in prows:
        nm = (r.get("owner_original") or "").strip()
        distinct.setdefault(nm, []).append(r["page"])
    first_name, first_stand = ps_owner_of(prows)
    sc_first = sim_concat(po, first_name)
    sc_best = max(sim_concat(po, nm) for nm in distinct)
    # metoda B: najboljše PS ime po (sim_surname, sim_any)
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
        cls_v119 = "AGREE"
    elif sim_sur >= 0.5 and best_exact:
        cls_v119 = "PARTIAL"
    else:
        cls_v119 = "MISMATCH"
    rows_v119.append({
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
        "class_v119": cls_v119,
        "ps_pages": sorted({pg for nm, pgs in distinct.items() for pg in pgs}),
    })

assert len(rows_v119) == 51, f"A_pua_vs_ps_v119 hiš {len(rows_v119)} != 51"
cls_v119_counts = Counter(r["class_v119"] for r in rows_v119)
cls_v58_counts = Counter(r["class_v58"] for r in rows_v119)
agree_houses = sorted(r["house"] for r in rows_v119 if r["class_v119"] == "AGREE")
partial_houses = sorted(r["house"] for r in rows_v119 if r["class_v119"] == "PARTIAL")

# ---------- 1) person-owner-register (owner(ps) re-izvedba) ----------
persons_new = []
for p in person_reg["persons"]:
    if p["person_type"] != "owner(ps)":
        persons_new.append(p)

for hn in sorted(ps_by_house, key=lambda x: (not x.isdigit(), int(x) if x.isdigit() else 0, x)):
    prows = ps_by_house[hn]
    distinct = {}
    for r in prows:
        nm = (r.get("owner_original") or "").strip()
        distinct.setdefault(nm, []).append(r["page"])
    for nm, pgs in distinct.items():
        if not nm or nm == "~":
            continue
        persons_new.append({
            "name_original": nm,
            "normalized": norm_concat(nm),
            "person_type": "owner(ps)",
            "source": "PS N83 (PARTIAL)",
            "page": sorted(set(pgs)),
            "house_no": hn,
            "evidence_status": "SINGLE_SOURCE",
        })

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

persons_out = {
    "val": "119-del3",
    "pass": "sync (PUA↔PS v119)",
    "issue": "#42 §4/§14",
    "title": "PERSON-OWNER REGISTER 1825 — PUA↔PS sinhronizacija (val 119 del 3)",
    "method": {
        "rules": [
            "nič združevanja imen; possible_duplicate flagi z razlogom",
            "owner(ps) = en vnos per (haus_no, ime) s stranmi pojavitve (p3–p55, val 119)",
            "owner(pua)/owner_variant(pt) nedotaknjena iz val 59 pass2",
            "PS p56–143 (PROVISIONAL F-PV-04/NR-14) izključeno (F-SYNC-04)",
        ],
        "change_vs_pass2": (
            "owner(ps) pass2 model 'first-owner per hiša' (163) → model "
            "'distinct (hiša, ime)' (656) — hiše z več so-živečimi lastniki niso več "
            "skrčene na prvega; prvi lastnik ostaja v house-register owners.ps"
        ),
    },
    "provenance": {
        **person_reg.get("provenance", {}),
        "ps": "ps-n83/register.json (1.077 vrstic p3–p55, val 119 del 1–2e dvojni sidr)",
        "sync": "atlas-1825/build-sync-v119-del3.py (val 119 del 3, 0 VLM)",
    },
    "persons_total": len(persons_new),
    "possible_duplicates": dup_count,
    "persons": persons_new,
}

# ---------- 2) house-register ----------
sim_v1 = {
    str(row["house"]): row["sim"] for row in analysis_v1["A_pua_vs_ps"]["rows"]
}
v119_by_house = {r["house"]: r for r in rows_v119}
houses_out = []
stale_ps_houses = []
for hobj in house_reg["houses"]:
    h = hobj["house_no_1825"]
    hn_key = str(h)
    hout = dict(hobj)
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
        # zastarel owners.ps iz pass2 (val 57 branje): hiša NIMA več vrstic z
        # lastnikom v v119 p3–p55 (popravek hiše/imen — npr. '00' Stuker Michl →
        # h30 Stuker Mathl, '1/59' → h49, '1 / 6' Gyomandl → Gemeinde h0).
        # Dokaz ohranjen kot owners.ps_stale; owners.ps = None (trenutna
        # resničnost), KG OWNER_OF PS povezava se ne ustvarja (ni join missa).
        old_ps = dict(hout["owners"]["ps"])
        hout["owners"] = dict(hout["owners"])
        hout["owners"]["ps"] = None
        hout["owners"]["ps_stale"] = old_ps
        hout["owners"]["ps_stale"]["stale_reason"] = (
            "val 119 del 3: PS p3–p55 v119 re-read nima več vrstic z lastnikom pri "
            "tej hiši — pass2 (val 57) lastnik je bil del zamika vrstic / popravka "
            "hišnih števil (F-NA-01/02/03, del 2c–2e); glej register "
            "owner_original_pre_v119 + protokol 142"
        )
        stale_ps_houses.append(hn_key)
    # metrika + status
    if hn_key.isdigit() and int(hn_key) in v119_by_house:
        row = v119_by_house[int(hn_key)]
        hout["pua_ps_name_sim"] = row["sim_concat_first"]  # kontinuiteta val 58
        hout["pua_ps_name_sim_v119"] = {
            "method": "token surname-first LCS (F-SYNC-01 popavek)",
            "sim_surname": row["sim_surname"],
            "sim_any": row["sim_any"],
            "best_ps_name": row["best_ps_name"],
            "exact_token": row["best_exact_token"],
            "class": row["class_v119"],
            "n_distinct": row["n_distinct"],
        }
        # evidence_status ponovno izveden (samo hiše z PUA+PS parico — pass2 logika)
        if hout.get("evidence_status") in ("AGREE", "PARTIAL", "CONFLICT"):
            # razred v119 → hišno besedišče (MISMATCH = CONFLICT)
            hout["evidence_status"] = (
                row["class_v119"] if row["class_v119"] != "MISMATCH" else "CONFLICT"
            )
    houses_out.append(hout)

houses_out_obj = dict(house_reg)
houses_out_obj["val"] = "119-del3"
houses_out_obj["pass"] = "sync (PUA↔PS v119)"
houses_out_obj["houses"] = houses_out
cov_h = Counter(h["evidence_status"] for h in houses_out)
houses_out_obj["coverage"] = dict(cov_h)
houses_out_obj["method"] = dict(house_reg.get("method") or {})
houses_out_obj["method"]["evidence_status_logic"] = {
    "AGREE": "PUA+PS priimek podoben (token surname-first LCS ≥0.7, metoda B)",
    "PARTIAL": "PUA+PS priimek 0.5–0.7 Z exact token parom ALI ≥2 vira brez PUA+PS parice",
    "CONFLICT": "PUA+PS nesoglasje (F9 različni stanji — obe trditvi ohranjeni, cf. conflict register)",
    "SINGLE_SOURCE": "samo en vir",
    "UNKNOWN": "brez lastniškega dokaza",
    "UNKNOWN_SEMANTICS": "sestavljen '1 / N' sklic (F12 TO-DECODE)",
}
houses_out_obj["method"]["v119_sync_note"] = (
    "val 119 del 3: pua_ps_name_sim = sim_concat_first (kontinuiteta val 58); "
    "pua_ps_name_sim_v119 = metoda B; evidence_status re-izveden po metodi B; "
    "owners.ps_distinct = nova add-only plast"
)
houses_out_obj["provenance"] = {
    **(house_reg.get("provenance") or {}),
    "ps": "ps-n83/register.json (1.077 vrstic p3–p55, val 119 del 1–2e dvojni sidr)",
    "sync": "atlas-1825/build-sync-v119-del3.py (val 119 del 3, 0 VLM)",
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
    row = v119_by_house.get(h)
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
    if c.get("note"):
        nc["note_pass2"] = c["note"]  # dokaz val 58/59 ohranjen (nič tihega brisanja)
    if row["class_v119"] == "AGREE":
        if row["best_ps_name"] == row["ps_first"]:
            nc["status"] = "RESOLVED"
            nc["note"] = (
                f"val 119 del 3: PS first-owner '{row['ps_first']}' potjuje PUA vpis "
                f"(sim_surname {row['sim_surname']}, metoda B) — prvotna predpostavka "
                f"različnih imen ne drži več; val 58 sim {row.get('sim_v58')} ({row.get('class_v58')}) "
                f"je bil artefakt zamika vrstic (F-NA-01/02/03) + metode F-SYNC-01"
            )
        else:
            nc["status"] = "PARTIALLY_RESOLVED"
            nc["note"] = (
                f"val 119 del 3: PUA lastnik potrjen med PS so-živečimi hiše "
                f"('{row['best_ps_name']}', sim_surname {row['sim_surname']}, metoda B); "
                f"first-owner '{row['ps_first']}' ostaja drugačno stanje — obe trditvi ohranjeni"
            )
    else:
        nc["status"] = "OPEN"
        nc["note"] = (
            f"val 119 del 3 re-read: {row['n_distinct']} distinct imen pri hiši; "
            f"best '{row['best_ps_name']}' sim_surname {row['sim_surname']} — "
            f"nesoglasje ostaja (F9)"
        )
    conflicts_out.append(nc)

conf_out = dict(conf_reg)
conf_out["val"] = "119-del3"
conf_out["conflicts"] = conflicts_out
conf_out["coverage"] = dict(Counter(c["conflict_type"] for c in conflicts_out))
conf_out["provenance"] = {
    **(conf_reg.get("provenance") or {}),
    "sync": "atlas-1825/build-sync-v119-del3.py (val 119 del 3, 0 VLM)",
}

# ---------- najdbe F-SYNC ----------
n_agree = cls_v119_counts.get("AGREE", 0)
n_partial = cls_v119_counts.get("PARTIAL", 0)
n_mismatch = cls_v119_counts.get("MISMATCH", 0)
improved = sum(
    1 for r in rows_v119
    if r["class_v58"] == "MISMATCH" and r["class_v119"] in ("AGREE", "PARTIAL")
)

analysis_out = {
    "val": "119-del3",
    "date": "2026-10-04",
    "issue": "#42 §4/§14",
    "title": "ANALYSIS v7 — PUA↔PS sinhronizacija na v119 stanju (F-PV-03/04 okvir)",
    "inputs": [
        "ps-n83/register.json (2.875 vrstic; sinhronizacija uporablja samo p3–p55 = 1.077)",
        "pua-n83/register.json (98 vpisov, val 51+57)",
        "atlas-1825/analysis-v1.json (val 58 A_pua_vs_ps = primerjalna baza)",
        "atlas-1825/person-owner-register-1825.json / house-register-1825.json / conflict-register-1825.json (val 59 pass2 stanje)",
    ],
    "method": {
        "sim_concat": "1:1 replika val 58 token_sim (F-SYNC-01: norm odstrani presledke → LCS nad zlepljenim nizom, ne tokeni)",
        "sim_surname": "PRVI token PS imena (priimek, nemški red) vs. vsi tokeni PUA imena; max LCS po parih; EXACT-token flag",
        "sim_any": "max LCS nad vsemi token pari (dokumentacija, ne vodi razreda)",
        "pragovi": "AGREE ≥0.7; PARTIAL ≥0.5 IN exact token; sicer MISMATCH",
        "no_guessing": "nobeno ime ni združeno; vsa nesoglasja ostajajo v CH konfliktih",
        "scope": "PS p3–p55 (val 119 kakovostna plast); p56–143 PROVISIONAL izključeno (F-SYNC-04)",
    },
    "A_pua_vs_ps_v119": {
        "houses": len(rows_v119),
        "class_v58": dict(cls_v58_counts),
        "class_v119": dict(cls_v119_counts),
        "agree_houses": agree_houses,
        "partial_houses": partial_houses,
        "improved_vs_v58": improved,
        "rows": rows_v119,
    },
    "findings": [
        {
            "id": "F-SYNC-01",
            "status": "DOCUMENTED",
            "statement": (
                "val 58 `token_sim` docstring ('LCS po tokenih') NE ustreza implementaciji: "
                "norm odstrani tudi presledke, split() pa vrne en sam token → dejansko LCS "
                "nad zlepljenima imenoma; posledica sistemsko nizkih sim (max 0.564) in "
                "49/51 MISMATCH. Kontinuitetni stolpec sim_concat_first ohranja staro metodo."
            ),
        },
        {
            "id": "F-SYNC-02",
            "status": "DOCUMENTED",
            "statement": (
                f"Po v119 re-readu (F-NA-01/02/03 zaprti) in metodi B: {n_agree} AGREE "
                f"(hiše {agree_houses}), {n_partial} PARTIAL (hiše {partial_houses}), "
                f"{n_mismatch} MISMATCH; {improved} hiš izboljšanih vs. val 58 razred."
            ),
        },
        {
            "id": "F-SYNC-03",
            "status": "DOCUMENTED",
            "statement": (
                "sim_any (max nad vsemi token pari) LAŽNO soglaša prek danega imena: "
                "h48 Höchsthaler Georg ↔ (R)abitscher Georg (sim_any 1.0, priimka različna); "
                "zato razred vodi SIM_SURNAME (+ exact-token pogoj za PARTIAL); "
                "h40 muster↔sautter 0.615 ostaja CONFLICT (SA-002/CH-040-01 nedotaknjena)."
            ),
        },
        {
            "id": "F-SYNC-04",
            "status": "DOCUMENTED",
            "statement": (
                "Sinhronizacija uporablja izključno PS p3–p55 (1.077 vrstic, val 119 "
                "dvojni sidr); PS p56–143 (1.798 vrstic) ostaja PROVISIONAL (F-PV-04/NR-14) "
                "in ni vstopila v osebno plast — hiše 70–78 imajo v PROVISIONAL plasti "
                "opažene h72/74/76, dokumentirano, ne uveljavljeno."
            ),
        },
        {
            "id": "F-SYNC-05",
            "status": "DOCUMENTED",
            "statement": (
                f"{len(stale_ps_houses)} hiš je imelo zastarel owners.ps iz pass2 "
                f"(val 57 branje) brez vrstic z lastnikom v v119 p3–p55 "
                f"({', '.join(sorted(stale_ps_houses))}) — vzrok: popravki hišnih "
                "števil in imen (del 2c–2e: '00' Stuker Michl → h30 Stuker Mathl, "
                "'1/59' → h49 Schimek Micha, '1 / 6' Gyomandl → Gemeinde h0, ...). "
                "Dokaz ohranjen kot owners.ps_stale; owners.ps = None; KG OWNER_OF "
                "PS povezave teh hiš se ne ustvarijo (ni join missa)."
            ),
        },
    ],
    "doctrine_impact": [
        "F9 (PUA pripravljalno vs PS končno stanje) OSTAJA okvir — ime-podatki pa zdaj "
        "dokumentirajo hiše, kjer stanje med kompilacijo PUA in finalizacijo PS NI prešlo "
        "lastniške spremembe (AGREE hiše) — CH statusi ustrezno posodobljeni (RESOLVED/"
        "PARTIALLY_RESOLVED), brez brisanja trditev.",
        "KG osebni sloj preneha biti 'pass2 PUA artefakt' (F-PV-03/04): owner(ps) = v119 "
        "brane osebe; KG vsebinsko SPREMENJEN (prvič od val 117).",
    ],
}

# ---------- izhodi ----------
assert len(persons_new) == 98 + 656 + 227, (
    f"persons {len(persons_new)} != 981 (98 PUA + 656 PS + 227 PT)"
)
assert sum(1 for p in persons_new if p["person_type"] == "owner(ps)") == 656
assert len(conflicts_out) == 113, f"konfliktov {len(conflicts_out)} != 113"
assert sum(1 for c in conflicts_out if c["conflict_type"] == "owner_state_pua_vs_ps") == 51
assert len(houses_out) == 167
# opomba: house_id ni unikaten v pass2 izvorniku ('0' vs '00', '1 / 11' vs '1/11'
# = različni house_no ključi, H-id trk) — vnaprej obstoječe stanje, ne spreminjamo

write(os.path.join(RG, "ps-n83", "analysis-v7.json"), analysis_out)
write(person_reg_path, persons_out)
write(house_reg_path, houses_out_obj)
write(conf_reg_path, conf_out)

print()
print("=== POVZETEK val 119 del 3 (sync) ===")
print(f"osebe: 488 -> {len(persons_new)} (owner(ps) 163 -> 656; possible_dup {person_reg['possible_duplicates']} -> {dup_count})")
print(f"razredi v58: {dict(cls_v58_counts)}")
print(f"razredi v119: {dict(cls_v119_counts)}")
print(f"AGREE hiše: {agree_houses}")
print(f"PARTIAL hiše: {partial_houses}")
print(f"izboljšanih vs v58: {improved}")
ch_stat = Counter(c["status"] for c in conflicts_out if c["conflict_type"] == "owner_state_pua_vs_ps")
print(f"CH statusi: {dict(ch_stat)}")
print(f"house coverage: {dict(cov_h)}")
print(f"stale owners.ps hiše ({len(stale_ps_houses)}): {sorted(stale_ps_houses)}")
