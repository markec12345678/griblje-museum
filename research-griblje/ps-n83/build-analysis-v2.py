#!/usr/bin/env python3
"""
Val 61 — PS N83 analiza v2 (lokalna, deterministična, brez VLM)
Razlika proti v1: Fürtrag veriga iz reread-2026-10/totals-reread.json (2-prehodno
agentovo branje @7x, 13 točk, 0 kršitev) + popravki imen p12 (patch-register-reread.py)
+ nova najdbe F10b/F15/F16. v1 ostane arhiviran (analysis-v1.json).
Viri: ps-n83/register.json (55/143 strani), pua-n83/register.json (98 vpisov),
      pt-n83/register.json (100 vrstic), raw-web-val57-2026-10/ps-vlm/*.json
Izhod: ps-n83/analysis-v2.json

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
# v61: VERIFIKIRANA veriga iz reread-2026-10 (agent, 2 prehoda @7x) ima prednost;
# VLM v57 veriga se ohrani kot vlm_v57_chain za revizijo.
FURTRAG_RE = re.compile(r"^\s*(\d{1,2})[.\s]?\s*(F)", re.I)  # 'N. Fürtrag/Ftirtrag/Futterg/...'
vlm_v57_chain = []
for pg in range(1, 56):
    fn = os.path.join(VLM, f"p{pg:03d}.json")
    if not os.path.exists(fn): continue
    d = load(fn)
    for t in (d.get("totals") or []):
        lab = (t.get("label") or "").strip()
        m = FURTRAG_RE.match(lab)
        if m:
            vlm_v57_chain.append({"page": pg, "label": lab, "counter": int(m.group(1)),
                                  "value": (t.get("value") or "").strip()})
            break

REREAD = os.path.join(BASE, "reread-2026-10", "totals-reread.json")
reread_doc = load(REREAD)
chain = [{"page": c["page"], "counter": c["counter"], "value": c["value"],
          "crossed": c["crossed"], "red_line": c["red_line"],
          "source": "reread-2026-10 (agent 2 prehoda @7x)"}
         for c in reread_doc["verified_chain"]]
chain_counters = [c["counter"] for c in chain]
chain_monotone = all(a < b for a, b in zip(chain_counters, chain_counters[1:]))

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
    "val": "61",
    "title": "PS N83 analiza v2 — re-read 2026-10: verifikirana Fürtrag veriga (13 točk), imenske variante p11/p12, no_blatt semantika",
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
        "vlm_v57_chain_for_audit": vlm_v57_chain,
        "counters": chain_counters,
        "strictly_monotone": chain_monotone,
        "format_decoded": reread_doc["format_decoded"],
        "chain_summary": reread_doc["chain_summary"],
        "value_semantics_status": reread_doc["value_semantics_status"],
        "note": "v61: verifikirana veriga 13 točk (2,9,10,12,14,18,22,30,33,38,39,42,52) — "
                "STROGO monotona, 0 kršitev; v1 kršitvi p36=36/p42=20 = VLM napaki branja "
                "(v resnici 38. in 39. Fürtrag); format vrstice = 'N. Fürtrag. | Joch | Quad-Klafter'; "
                "VLM oznake (Färberg/Futterg/Firstag/Grundst./Stück/Flächen/Summa) = vse napačne.",
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
        "F11": "NADGRADJENO v61: Fürtrag veriga VERIFIKIRANA — 13 točk (2,9,10,12,14,18,22,30,33,38,39,42,52), "
               "strogo monotona, 0 kršitev; format = 'N. Fürtrag. | Joch | Quad-Klafter' (vsota TEKOČE strani, "
               "ne kumulativa — p11 2J798 < p5 6J1459 izključi kumulacijo); rdeče druge vrstice = predelani "
               "seštevki (semantika TO-DECODE); koraki večinoma +1/stran = skladno s 'števec = tekoči indeks "
               "Jaethe'; izjemi p35->p36 +5 in p36->p42 +1/6 strani se skladata s F12 (dediščina zaključi male "
               "holdinge; ne-lokalna sekcija = veliki holdingi). 'Summa Jaethen 6/10808' in "
               "'Summa Quadrat-Klafter 6/77' iz v1 = neobstoječi entiteti (misreada vrstice "
               "'12. Fürtrag 6|1088' + rdeče '6|77' na p14).",
        "F10b": "NOVO v61 (imenske variante p11/p12): trije neodvisni bralci (PS-VLM v57, agent 2026-10 @5x, "
                "PT-VLM v53) se NE ujemajo o priimkih v dediščinskem skladu h.36-50 (kandidati: "
                "Muster/Mutza/Mache/Murško/Musterer); potrjeno: 'Christian' h36/h37 (agent+PT), "
                "'Schimerz' kot realen priimek h38/h39/p11 (agent+PT), 'Strauß Georg' h45 TUDI na p12 "
                "(register v57 je imel 'Hansp[?] Gnoy' — popravljeno; p7 precedent + PT 'Krauß Georg'); "
                "družinski sklad h.36-50 = STRUKTURNO dokazan, PRIIMEK = NAME_UNCERTAIN; "
                "'Muster družina' NE sme v UI/KG kot gotovost (glej reread-2026-10/name-variants-p11-p12.json).",
        "F12": "Strukturna meja p40: sestavljeni '1 / N' sklici (do 140 vrstic) + ne-lokalni Wohnort "
               "(Zagorje, Dragole) = sekcija ne-lokalnih lastnikov, prepletena z nadaljevanjem lokalnih blokov.",
        "F13": "PS p12 rdeča opomba 'Auf pfandbeyern 1801' = pfand (zastava) — pravni razlog za "
               "lastniške razlike; rdeči vpisi v PS dokumentirajo prehode lastništva.",
        "F14": "PUA parcelne številke (2-9978) in PS jaethe (1-9116) v ISTI rangi; p002 potrjuje tiskano "
               "glavo 'Flurbezirk / Jaethe' — ujemanje parcel je pričakovano šele po polni transkripciji "
               "z dekodiranim Flurbezirk stolpcem (delna pokritost 55/143 = pričakovano malo ujemanj).",
        "F15": "NOVO v61: 'Nro. des Blattes' = raven lista (I, II, ... z ditto znaki), NE zaporedna "
               "številka vrstice; register v57 vrednosti no_blatt so semantično nezanesljive ('11' na p44 = "
               "rimski 'II'; zaporedja 1..23 na p11 = ditto tolmačeno kot številčenje); stolpci 821-840 (p44, "
               "dve kopiji z rdečimi popravki) = 'Nro. der Uebersetzung' (sklici na čistopis); p45/48/51 = "
               "kaos v register v57 (mešane vrednosti) — no_blatt = UNRELIABLE za vseh 55 strani do "
               "popolnega re-reada.",
        "F16": "NOVO v61: struktura vrstic p11 divergira (register 23 vrstic vs ~22 vidnih); register nb4 h=1 "
               "'Barbara Muster' nima jasne identifikacije na strani; h-stolpec p11 vrstic 2-6 = UNCERTAIN "
               "med register (40,41,1,39,39) in agent (39,30,38,39) — hipoteza: VLM je h=1 vzel iz "
               "Geistliche/Dominical stolpca; hišne veze p11 vrstic 2-6 = PROVISIONAL do full re-reada.",
    },
    "doctrine_impact": {
        "F1_val54": "PUA = edina lastniška avtoriteta — REVIZIJA: PUA je avtoriteta za PRIPRAVLJALNO stanje "
                    "(in B.P.<->hiša vezave); za KONČNO stanje 1825 sta PS+PT medsebojno potrjeni viri.",
        "impact_on_ui": "NIČ — zemljevid A01 lastniške veze ostajajo na PUA (pripravljalno stanje je tisto, "
                        "ki je vezano na B.P. opombe); ob polni PS transkripciji sledi P3 odločitev o prikazu.",
    },
}

with open(os.path.join(BASE, "analysis-v2.json"), "w") as f:
    json.dump(out, f, indent=1, ensure_ascii=False)

print("analysis-v2.json zapisan")
print(f"A: {len(pua_ps)} skupnih hiš PUA<->PS | agree={out['A_pua_vs_ps']['agree']} fuzzy={out['A_pua_vs_ps']['fuzzy']} mismatch={out['A_pua_vs_ps']['mismatch']}")
print(f"B: {len(ps_pt)} skupnih hiš PS<->PT | strong={out['B_ps_vs_pt']['agree_strong']} partial={out['B_ps_vs_pt']['partial']} disagree={out['B_ps_vs_pt']['disagree']}")
print(f"C: {len(chain)} Fürtrag števcev (reread): {chain_counters} monotona={chain_monotone}")
print(f"D: prva compound stran={first_compound_page} ({len(compound)} vrstic), pfand opombe={len(pfand_notes)}, listi={dict(sheet_stamps)}")
