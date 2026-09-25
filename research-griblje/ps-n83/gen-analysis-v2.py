#!/usr/bin/env python3
"""Val 61 — generira build-analysis-v2.py iz build-analysis-v1.py (deterministično, v1 ostane)."""
import os
BASE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(BASE, "build-analysis-v1.py")).read()

# 1) glava
src = src.replace('''"""
Val 58 — PS N83 analiza v1 (lokalna, deterministična, brez VLM)''',
'''"""
Val 61 — PS N83 analiza v2 (lokalna, deterministična, brez VLM)
Razlika proti v1: Fürtrag veriga iz reread-2026-10/totals-reread.json (2-prehodno
agentovo branje @7x, 13 točk, 0 kršitev) + popravki imen p12 (patch-register-reread.py)
+ nova najdbe F10b/F15/F16. v1 ostane arhiviran (analysis-v1.json).''')
src = src.replace('Izhod: ps-n83/analysis-v1.json', 'Izhod: ps-n83/analysis-v2.json')
src = src.replace('"val": "58"', '"val": "61"')
src = src.replace('"PS N83 analiza v1 — PUA<->PS<->PT kontrola, Fürtrag veriga, struktura (55/143 strani)"',
                  '"PS N83 analiza v2 — re-read 2026-10: verifikirana Fürtrag veriga (13 točk), imenske variante p11/p12, no_blatt semantika"')

# 2) C sekcija — reread veriga ima prednost, VLM veriga ohranjena za revizijo
old_c = '''# ---------- C) Fürtrag veriga ----------
FURTRAG_RE = re.compile(r"^\\s*(\\d{1,2})[.\\s]?\\s*(F)", re.I)  # 'N. Fürtrag/Ftirtrag/Futterg/...'
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
            break'''
new_c = '''# ---------- C) Fürtrag veriga ----------
# v61: VERIFIKIRANA veriga iz reread-2026-10 (agent, 2 prehoda @7x) ima prednost;
# VLM v57 veriga se ohrani kot vlm_v57_chain za revizijo.
FURTRAG_RE = re.compile(r"^\\s*(\\d{1,2})[.\\s]?\\s*(F)", re.I)  # 'N. Fürtrag/Ftirtrag/Futterg/...'
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
chain_monotone = all(a < b for a, b in zip(chain_counters, chain_counters[1:]))'''
assert old_c in src, "C section not found"
src = src.replace(old_c, new_c)

# 3) C_furtrag_chain izhodni blok
old_cb = '''    "C_furtrag_chain": {
        "chain": chain,
        "note": "N pred 'Fürtrag/Stücke/Jaethen/Grundst./Flächen' = tekoči indeks Jaethe (holdingov); "
                "ponovno prevrednotiti po polni transkripciji (143 strani); brani p36=36/p42=20 kršijo "
                "monotonijo (verjetno napačne prebrke števc)",
    },'''
new_cb = '''    "C_furtrag_chain": {
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
    },'''
assert old_cb in src, "C_furtrag_chain block not found"
src = src.replace(old_cb, new_cb)

# 4) findings: zamenjaj SAMO F11 (med '"F11":' in '"F12":'), dodaj F10b, F15, F16 za "F12" oziroma pred zaključek findings
i = src.find('"F11": "Fürtrag veriga')
j = src.find('"F12":', i)
assert i > 0 and j > i, "F11 span not found"
new_f11 = '''"F11": "NADGRADJENO v61: Fürtrag veriga VERIFIKIRANA — 13 točk (2,9,10,12,14,18,22,30,33,38,39,42,52), "
               "strogo monotona, 0 kršitev; format = 'N. Fürtrag. | Joch | Quad-Klafter' (vsota TEKOČE strani, "
               "ne kumulativa — p11 2J798 < p5 6J1459 izključi kumulacijo); rdeče druge vrstice = predelani "
               "seštevki (semantika TO-DECODE); koraki večinoma +1/stran = skladno s 'števec = tekoči indeks "
               "Jaethe'; izjemi p35->p36 +5 in p36->p42 +1/6 strani se skladata s F12 (dediščina zaključi male "
               "holdinge; ne-lokalna sekcija = veliki holdingi). 'Summa Jaethen 6/10808' in "
               "'Summa Quadrat-Klafter 6/77' iz v1 = neobstoječi entiteti (misreada vrstice "
               "'12. Fürtrag 6|1088' + rdeče '6|77' na p14).",
        '''
src = src[:i] + new_f11 + src[j:]

k = src.find('"F12":')
assert k > 0
new_f10b = '''"F10b": "NOVO v61 (imenske variante p11/p12): trije neodvisni bralci (PS-VLM v57, agent 2026-10 @5x, "
                "PT-VLM v53) se NE ujemajo o priimkih v dediščinskem skladu h.36-50 (kandidati: "
                "Muster/Mutza/Mache/Murško/Musterer); potrjeno: 'Christian' h36/h37 (agent+PT), "
                "'Schimerz' kot realen priimek h38/h39/p11 (agent+PT), 'Strauß Georg' h45 TUDI na p12 "
                "(register v57 je imel 'Hansp[?] Gnoy' — popravljeno; p7 precedent + PT 'Krauß Georg'); "
                "družinski sklad h.36-50 = STRUKTURNO dokazan, PRIIMEK = NAME_UNCERTAIN; "
                "'Muster družina' NE sme v UI/KG kot gotovost (glej reread-2026-10/name-variants-p11-p12.json).",
        '''
src = src[:k] + new_f10b + src[k:]

# 5) F15/F16 pred zaključkom findings (za "doctrine_impact")
m = src.find('"doctrine_impact":')
assert m > 0
ff = '''"F15": "NOVO v61: 'Nro. des Blattes' = raven lista (I, II, ... z ditto znaki), NE zaporedna "
               "številka vrstice; register v57 vrednosti no_blatt so semantično nezanesljive ('11' na p44 = "
               "rimski 'II'; zaporedja 1..23 na p11 = ditto tolmačeno kot številčenje); stolpci 821-840 (p44, "
               "dve kopiji z rdečimi popravki) = 'Nro. der Uebersetzung' (sklici na čistopis); p45/48/51 = "
               "kaos v register v57 (mešane vrednosti) — no_blatt = UNRELIABLE za vseh 55 strani do "
               "popolnega re-reada.",
        "F16": "NOVO v61: struktura vrstic p11 divergira (register 23 vrstic vs ~22 vidnih); register nb4 h=1 "
               "'Barbara Muster' nima jasne identifikacije na strani; h-stolpec p11 vrstic 2-6 = UNCERTAIN "
               "med register (40,41,1,39,39) in agent (39,30,38,39) — hipoteza: VLM je h=1 vzel iz "
               "Geistliche/Dominical stolpca; hišne veze p11 vrstic 2-6 = PROVISIONAL do full re-reada.",
    '''
src = src[:m] + ff + src[m:]

# 6) izhodna datoteka + izpis
src = src.replace('with open(os.path.join(BASE, "analysis-v1.json"), "w") as f:',
                  'with open(os.path.join(BASE, "analysis-v2.json"), "w") as f:')
src = src.replace('print("analysis-v1.json zapisan")', 'print("analysis-v2.json zapisan")')
old_p = '''print(f"C: {len(chain)} Fürtrag števcev: {[ (c['page'], c['counter']) for c in chain ]}")'''
new_p = '''print(f"C: {len(chain)} Fürtrag števcev (reread): {chain_counters} monotona={chain_monotone}")'''
assert old_p in src, "C print not found"
src = src.replace(old_p, new_p)

open(os.path.join(BASE, "build-analysis-v2.py"), "w").write(src)
print("build-analysis-v2.py zapisan")
