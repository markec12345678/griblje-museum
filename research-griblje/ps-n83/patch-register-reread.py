#!/usr/bin/env python3
"""
Val 61 — deterministični popravki PS N83 registra po ponovnem branju 2026-10.
Načelo: SAMO visoko-zanesljive korekcije (2 prehoda agenta + PT vzporednica);
vsak popravek ohrani original (owner_original_v57) + oznako review.
Neujemljiva branja = variant fields, NE prepisi.
Vir raziskave: ps-n83/reread-2026-10/name-variants-p11-p12.json
"""
import json, os

BASE = os.path.dirname(os.path.abspath(__file__))
REG = os.path.join(BASE, "register.json")

# (page, haus_no, old_owner, new_owner, kind) — "first" = prva vidna vrstica te hiše na strani
CORRECTIONS = [
    (12, "45", "Hansp[?] Gnoy", "Strauß Georg", "first"),
    (12, "38", "Thomas Gnoy", "Schimerz[?] Gnoy", "all"),
    (12, "39", "Thomas Muster", "Schimerz[?] Marko[?]", "all"),
]

def main():
    rows = json.load(open(REG))
    applied = []
    used_first = set()
    for r in rows:
        for (pg, h, old, new, kind) in CORRECTIONS:
            if r["page"] != pg or r["haus_no"] != h or r["owner_original"] != old:
                continue
            key = (pg, h)
            if kind == "first" and key in used_first:
                continue
            if kind == "first":
                used_first.add(key)
            if "owner_original_v57" not in r:  # idempotentno
                r["owner_original_v57"] = r["owner_original"]
            r["owner_original"] = new
            r["name_review"] = "reread-2026-10-corrected"
            applied.append({"page": pg, "haus_no": h, "from": old, "to": new})
    json.dump(rows, open(REG, "w"), ensure_ascii=False, indent=1)
    print(f"popravki: {len(applied)}")
    for a in applied:
        print(" ", a)
    # idempotenca: drugi tek mora dati 0
    return len(applied)

if __name__ == "__main__":
    n = main()
    if __import__("sys").argv.count("--verify") and n:
        print("NI idempotenten!"); raise SystemExit(1)
