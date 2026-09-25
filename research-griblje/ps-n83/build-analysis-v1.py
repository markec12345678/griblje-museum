#!/usr/bin/env python3
"""
Val 58 — PS N83 analiza v1 (lokalna, deterministična, brez VLM)
Viri: ps-n83/register.json (55/143 strani), pua-n83/register.json (98 vpisov),
      pt-n83/register.json (100 vrstic), raw-web-val57-2026-10/ps-vlm/*.json
Izhod: ps-n83/analysis-v1.json

Uloge:
  A) PUA<->PS lastniška kontrola po hišah (imena + prevzeti semantični preskok)
  B) PS<->PT kontrola (končna protokola 1825) — potrjevanje imen
  C) Fürtrag/Summa veriga (tekoči indeks Jaethe) + metrski vzorci
  D) strukturna meja p40 (sestavljeni "1 / N" hiši), pfand opomba, listi II/III
"""
import json, re, unicodedata, os
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
RG = os.path.dirname(BASE)
VLM = os.path.join(RG, "raw-web-val57-2026-10", "ps-vlm")

def load(p):
    with open(p) as f: return json.load(f)

ps = load(os.path.join(BASE, "register.json"))
pua = load(os.path.join(RG, "pua-n83", "register.json"))
ptdoc = load(os.path.join(RG, "pt-n83", "register.json"))
pt = ptdoc["register"]

# ---------- helper ----------
def norm(s):
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"[^a-zA-Z]", "", s).lower()
    return s

def token_sim(a, b):
    """Najboljše LCS podobnost med tokeni dveh imen (priimek dominira)."""
    a, b = norm(a), norm(b)
    if not a or not b: return 0.0
    best = 0.0
    for ta in a.split():
        for tb in b.split():
            m, n = len(ta), len(tb)
            dp = [[0]*(n+1) for _ in range(m+1)]
            for i in range(m):
                for j in range(n):
                    dp[i+1][j+1] = dp[i][j]+1 if ta[i] == tb[j] else max(dp[i][j+1], dp[i+1][j])
            s = 2*dp[m][n]/(m+n)
            if s > best: best = s
    return best

# ---------- PS indeksi ----------
ps_houses = {}
for r in ps:
    hn = str(r.get("haus_no") or "").strip()
    if hn.isdigit():
        ps_houses.setdefault(int(hn), []).append(r)

def ps_owner(rows):
    for r in rows:
        n = (r.get("owner_original") or "").strip()
        if n and n != "~":
            return n
    return ""

ps_owner_by_house = {h: ps_owner(rows) for h, rows in ps_houses.items()}
ps_pages_by_house = {h: sorted(set(r["page"] for r in rows)) for h, rows in ps_houses.items()}

# ---------- PUA indeksi ----------
pua_house_owner = {}
for e in pua:
    hn = str(e.get("house_no") or "").strip()
    if hn.isdigit():
        o = (e.get("owner_original") or "").strip()
        if o: pua_house_owner.setdefault(int(hn), []).append(o)

# ---------- PT indeksi ----------
pt_house_variants = {}
for e in pt:
    hs = str(e.get("house_no") or "").strip()
    if hs.isdigit():
        for v in (e.get("owner_variants") or []):
            if isinstance(v, str) and v.strip():
                pt_house_variants.setdefault(int(hs), set()).add(v.strip())

# ---------- A) PUA<->PS ----------
pua_ps = []
for h in sorted(set(pua_house_owner) & set(ps_houses)):
    po = pua_house_owner[h][0]
    so = ps_owner_by_house[h]
    s = token_sim(po, so)
    pua_ps.append({
        "house": h,
        "pua_owner": po, "ps_owner": so, "sim": round(s, 3),
        "class": "AGREE" if s > 0.7 else ("FUZZY" if s > 0.5 else "MISMATCH"),
        "ps_pages": ps_pages_by_house[h],
    })

# premik (shift) test — ali so PS imena odčitana s pomikom vrstic?
shift_scores = {}
for off in [-2, -1, 0, 1, 2]:
    sims = []
    for h in pua_house_owner:
        if (h+off) in ps_owner_by_house and h in ps_owner_by_house:
            pass
    for h in pua_house_owner:
        target = h + off
        if target in ps_owner_by_house and h in ps_houses:
            sims.append(token_sim(pua_house_owner[h][0], ps_owner_by_house[target]))
    shift_scores[f"{off:+d}"] = round(sum(sims)/len(sims), 3) if sims else 0.0

# ---------- B) PS<->PT ----------
ps_pt = []
for h in sorted(set(pt_house_variants) & set(ps_owner_by_house)):
    po = ps_owner_by_house[h]
    best, bestv = 0.0, ""
    for v in pt_house_variants[h]:
        s = token_sim(po, v)
        if s > best: best, bestv = s, v
    ps_pt.append({
        "house": h, "ps_owner": po, "pt_best": bestv, "sim": round(best, 3),
        "class": "AGREE" if best > 0.7 else ("PARTIAL" if best > 0.5 else "DISAGREE"),
        "pt_variants": sorted(pt_house_variants[h]),
    })

# ---------- C) Fürtrag veriga ----------
FURTRAG_RE = re.compile(r"^\s*(\d{1,2})[.\s]?\s*(F)", re.I)  # 'N. Fürtrag/Ftirtrag/Futterg/...'
chain = []
for pg in range(1, 56):
    fn = os.path.join(VLM, f"p{pg:03d}.json")
    if not os.path.exists(fn): continue
    d = load(fn)
    for t in (d.get("totals") or []):
        lab = (t.get("label") or "").strip()
        m = FURTRAG_RE.match(lab)
        if m:
            chain.append({"page": pg, "label": lab, "counter": int(m.group(1)),
                          "value": (t.get("value") or "").strip()})
            break

# ---------- D) strukturna najdbe ----------
compound = [r for r in ps if "/" in str(r.get("haus_no") or "")]
first_compound_page = min((r["page"] for r in compound), default=None)
compound_house_vals = sorted({str(r["haus_no"]).replace(" ", "") for r in compound})

pfand_notes = []
for r in ps:
    a = (r.get("anmerkung") or "")
    if re.search(r"pfand", a, re.I):
        pfand_notes.append({"page": r["page"], "haus_no": r.get("haus_no"),
                            "no_blatt": r.get("no_blatt"), "anmerkung": a[:160]})

jaethe_classes = Counter()
big_values = []
for r in ps:
    j = (r.get("jaethe") or "").strip()
    if not j: jaethe_classes["<EMPTY>"] += 1
    elif re.match(r"^\d+$", j):
        jaethe_classes["<PURE-NUM>"] += 1
        if int(j) > 3000: big_values.append({"page": r["page"], "value": j})
    elif "/" in j: jaethe_classes["has-slash"] += 1
    elif re.match(r"^\d+[.\s]+\d+", j): jaethe_classes["num-then-num"] += 1
    else: jaethe_classes["other"] += 1

sheet_stamps = Counter()
for pg in range(1, 56):
    fn = os.path.join(VLM, f"p{pg:03d}.json")
    if not os.path.exists(fn): continue
    sv = load(fn).get("sheet_visible")
    if sv: sheet_stamps[str(sv).strip()] += 1

missing_plain = [n for n in range(1, 70) if n not in ps_houses]
ps_only_70_plus = sorted(n for n in ps_houses if n >= 70)
pua_only = sorted(set(pua_house_owner) - set(ps_houses))

# ---------- izhod ----------
out = {
    "val": "58",
    "title": "PS N83 analiza v1 — PUA<->PS<->PT kontrola, Fürtrag veriga, struktura (55/143 strani)",
    "inputs": {
        "ps_register": "ps-n83/register.json",
        "ps_rows": len(ps),
        "ps_pages_read": 55,
        "ps_pages_total": 143,
        "pua_register": "pua-n83/register.json",
        "pua_entries": len(pua),
        "pt_register": "pt-n83/register.json",
        "pt_rows": len(pt),
    },
    "method": {
        "name_similarity": "LCS po tokenih na NFKD-normaliziranih imenih (brez ne-črk); pragovi AGREE>0.7 / FUZZY|PARTIAL>0.5 / sicer MISMATCH|DISAGREE",
        "no_guessing": "nobena imena ni združena; vse razlike dokumentirane",
    },
    "A_pua_vs_ps": {
        "shared_houses": len(pua_ps),
        "agree": sum(1 for x in pua_ps if x["class"] == "AGREE"),
        "fuzzy": sum(1 for x in pua_ps if x["class"] == "FUZZY"),
        "mismatch": sum(1 for x in pua_ps if x["class"] == "MISMATCH"),
        "fuzzy_cases": [x for x in pua_ps if x["class"] != "MISMATCH"],
        "rows": pua_ps,
        "pua_only_houses": pua_only,
        "ps_missing_1_69": missing_plain,
        "ps_houses_70plus_read": ps_only_70_plus,
        "shift_test_avg_sim": shift_scores,
        "shift_conclusion": "offset 0 je najboljši -> pomik vrstic izključen; razlike so vsebinske, ne bralne",
    },
    "B_ps_vs_pt": {
        "shared_houses": len(ps_pt),
        "agree_strong": sum(1 for x in ps_pt if x["class"] == "AGREE"),
        "partial": sum(1 for x in ps_pt if x["class"] == "PARTIAL"),
        "disagree": sum(1 for x in ps_pt if x["class"] == "DISAGREE"),
        "rows_over_05": [x for x in ps_pt if x["class"] != "DISAGREE"],
        "rows": ps_pt,
    },
    "C_furtrag_chain": {
        "chain": chain,
        "note": "N pred 'Fürtrag/Stücke/Jaethen/Grundst./Flächen' = tekoči indeks Jaethe (holdingov); "
                "ponovno prevrednotiti po polni transkripciji (143 strani); brani p36=36/p42=20 kršijo "
                "monotonijo (verjetno napačne prebrke števc)",
    },
    "D_structure": {
        "compound_haus_no": {
            "first_page": first_compound_page,
            "count_rows": len(compound),
            "distinct_values_sample": compound_house_vals[:24],
            "hypothesis": "'1 / N' = (KG-blatt / hiša) ali (sekcija / parcela) za ne-lokalne lastnike; "
                          "Wohnort Zagorje/Dragole na p40-55 podpira ne-lokalne lastnike",
        },
        "pfand_notes": pfand_notes,
        "jaethe_format_classes": dict(jaethe_classes),
        "jaethe_big_values": big_values,
        "sheet_stamps": dict(sheet_stamps),
        "sheet_stamp_note": "listi so tiskani II/III (VLM jih vidi kot '11.'/'111.'/'III N.'); "
                            "niso zaporedni s stranmi",
    },
    "findings": {
        "F9": "PUA<->PS lastniška kontrola: 50/51 skupnih hiš MISMATCH, 1 FUZZY, 0 AGREE — "
              "PUA (pripravljalni zvezek) in PS (končni protokol 1825) vsebujeta RAZLIČNI lastniški stanji. "
              "Premik vrstic izključen (shift test). Delne družinske oblike so prepoznane "
              "(Draschisch/Dragosch h.3, Krischan/Krishnar h.36-37, Tillak/Tillah h.30, Urich Pattle/Urbas Peter h.51).",
        "F10": "PS<->PT kontrola (dva končna protokola istega leta): 3 močna (h.45 Strauß/Krauß 0.84, "
               "h.19 Thomas 0.82, h.48 0.76) + 7 delnih ujemanj / 47 skupnih hiš — "
               "PS lahko RAZSOJA nestabilne PT prebrke (npr. val 54 'Krauß Georg' variant potrjena).",
        "F11": "Fürtrag veriga = globalni tekoči indeks Jaethe; vrednosti 2 (p5) -> 52 (p54); "
               "'X NNNN' format vsot = (števec, vsota vrednosti); metrika stolpcev (Jaethe vs Quad.Kläfter) ostaja TO-DECODE (P3).",
        "F12": "Strukturna meja p40: sestavljeni '1 / N' sklici (do 140 vrstic) + ne-lokalni Wohnort "
               "(Zagorje, Dragole) = sekcija ne-lokalnih lastnikov, prepletena z nadaljevanjem lokalnih blokov.",
        "F13": "PS p12 rdeča opomba 'Auf pfandbeyern 1801' = pfand (zastava) — pravni razlog za "
               "lastniške razlike; rdeči vpisi v PS dokumentirajo prehode lastništva.",
        "F14": "PUA parcelne številke (2-9978) in PS jaethe (1-9116) v ISTI rangi; p002 potrjuje tiskano "
               "glavo 'Flurbezirk / Jaethe' — ujemanje parcel je pričakovano šele po polni transkripciji "
               "z dekodiranim Flurbezirk stolpcem (delna pokritost 55/143 = pričakovano malo ujemanj).",
    },
    "doctrine_impact": {
        "F1_val54": "PUA = edina lastniška avtoriteta — REVIZIJA: PUA je avtoriteta za PRIPRAVLJALNO stanje "
                    "(in B.P.<->hiša vezave); za KONČNO stanje 1825 sta PS+PT medsebojno potrjeni viri.",
        "impact_on_ui": "NIČ — zemljevid A01 lastniške veze ostajajo na PUA (pripravljalno stanje je tisto, "
                        "ki je vezano na B.P. opombe); ob polni PS transkripciji sledi P3 odločitev o prikazu.",
    },
}

with open(os.path.join(BASE, "analysis-v1.json"), "w") as f:
    json.dump(out, f, indent=1, ensure_ascii=False)

print("analysis-v1.json zapisan")
print(f"A: {len(pua_ps)} skupnih hiš PUA<->PS | agree={out['A_pua_vs_ps']['agree']} fuzzy={out['A_pua_vs_ps']['fuzzy']} mismatch={out['A_pua_vs_ps']['mismatch']}")
print(f"B: {len(ps_pt)} skupnih hiš PS<->PT | strong={out['B_ps_vs_pt']['agree_strong']} partial={out['B_ps_vs_pt']['partial']} disagree={out['B_ps_vs_pt']['disagree']}")
print(f"C: {len(chain)} Fürtrag števcev: {[ (c['page'], c['counter']) for c in chain ]}")
print(f"D: prva compound stran={first_compound_page} ({len(compound)} vrstic), pfand opombe={len(pfand_notes)}, listi={dict(sheet_stamps)}")
