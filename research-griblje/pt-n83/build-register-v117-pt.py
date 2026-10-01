#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Val 117 — PT p7 RE-ADJUDIKACIJA AREAL STOLPCA (izključitev val110-areal-owner, 2. del)
======================================================================================

Vir resnice:
- native-p07.png (2727×2117, PDF-native maksimum — F-PZ-17) z IZMERJENIMI horizontalnimi
  pravili (val 117 detekcija: 20 vrstic 379–2013 + vsotna 2013–2111)
- agentov vid (glavna seja val 117): sekvenca + vezava vrstic na bp Nro (kontaktni prirez)
- 9 VLM glasov (read-pt7-v117.mts, val 117): 4 areal bandi + vsotna + 4 lastnik bandi
- register (val 41/52/53 nizko-ločljivostni glasovi 1308×1016, nespremenjeni od val 110)

NAJDBA (strukturerna): register areal stolpec p7 je SISTEMSKO +1 ZAMAKNJEN za vrstice
6–18 (register bp n = nativno bp n−1) — F2-analog za areale (F2 hišne številke val 110).
Vrstice 2–5 so posamezno zmešane; bp84 "44" = nizko-ločljivostni artefakt brez vira na p7.

Admission: vid + VLM (vrednostna soglasja, vezava po merjenih pravilih) → TRANSCRIBED;
kolizija → REVIEW. Lastniška imena: F1 (PUA = avtoriteta) — VLM 3. glasovi = artefakti,
NIČ sprememb imen. TRANSCRIBED = "tako je zapisano na p7", ne "resnica o svetu" (§4).
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path("/home/z/griblje-museum")
REG = ROOT / "research-griblje/pt-n83/register.json"
REC = ROOT / "research-griblje/pt-n83/reconciliation.json"
PAGES = ROOT / "research-griblje/pt-n83/page-records.json"
CHANGES = ROOT / "research-griblje/pt-n83/register-v117-changes.json"
VLM = ROOT / "research-griblje/raw-web-val110-2026-09/vlm-v117-pt7"

# Nativne vrednosti (agentov vid na izmerjenih pravilih, val 117) + prečrtanja (rdeča revizija)
# bp: (vid_vrednost, struck, voice_status)
NATIVE = {
    81: ("14[?]", True, "REVIEW"),      # kolizija 14/44/11 — vse tri branja artefakti
    82: ("52", True, "TRANSCRIBED"),
    83: ("292", False, "TRANSCRIBED"),
    84: ("21", False, "TRANSCRIBED"),
    85: ("76", True, "TRANSCRIBED"),
    86: ("26", False, "TRANSCRIBED"),
    87: ("28", False, "TRANSCRIBED"),
    88: ("91", False, "TRANSCRIBED"),
    89: ("192", False, "TRANSCRIBED"),
    90: ("88", True, "TRANSCRIBED"),
    91: ("168", True, "TRANSCRIBED"),
    92: ("239", True, "TRANSCRIBED"),
    93: ("12", True, "TRANSCRIBED"),
    94: ("181", True, "TRANSCRIBED"),
    95: ("91", True, "TRANSCRIBED"),
    96: ("90", True, "TRANSCRIBED"),
    97: ("8", True, "TRANSCRIBED"),
    98: ("102", False, "TRANSCRIBED"),
    99: ("", False, "TRANSCRIBED"),     # fantom potrjen (prazno) — val 110
    100: ("", False, "TRANSCRIBED"),    # fantom potrjen (prazno) — val 110
}

# VLM glasovi vrednostno (neodvisno od VLM-ove vrstične atribucije — vezava = merjena pravila)
VLM_VALUE_HITS = {
    81: '44 [gestrichen] [rot]',
    82: '52 [gestrichen] [rot]',
    83: '292 [gestrichen] [rot]',
    85: '81 [artefakt — vid 76]',
    93: '12 [gestrichen] [rot]',
    96: '90 [gestrichen] [rot]',
    97: '8 [gestrichen] [rot]',
    98: '102 [rot] [artefakt — vid: črno, NE rdeče]',
}
VLM_EMPTY_READ_BANDS = [2]  # band bp86–90 = prazno-branje (NEZANESLJIVO)

changes: list[dict] = []


def main():
    reg = json.loads(REG.read_text())
    rec = json.loads(REC.read_text())
    pages = json.loads(PAGES.read_text())

    # ---------- GARDELE ----------
    assert reg["docid"] == "VAČ docid 41781 (uodid 373416)", reg.get("docid")
    p7 = [r for r in reg["register"] if r["page"] == 7]
    assert len(p7) == 20, len(p7)
    assert [r["bp_no"] for r in p7] == [str(i) for i in range(81, 101)]
    old_areals = {int(r["bp_no"]): r["areal_original"] for r in p7}
    assert old_areals == {
        81: "11", 82: "292", 83: "21", 84: "44", 85: "52", 86: "76", 87: "26", 88: "28",
        89: "91", 90: "192", 91: "88", 92: "168", 93: "239", 94: "12", 95: "181",
        96: "91", 97: "90", 98: "8", 99: "", 100: "",
    }, old_areals
    # 9 VLM glasov na disku:
    voices = sorted(p.name for p in VLM.glob("*.json"))
    assert len(voices) == 9, voices
    # val 110 stanje: hišne številke že popravljene (F2), areali izrecno izključeni:
    ofr = json.dumps(rec["open_for_full_res"], ensure_ascii=False)
    assert "RESOLVED-V110" in ofr, ofr[:200]

    # ---------- DOKAZ POMIKA (+1 za register r6–r18) ----------
    # register bp n (nizko-loč.) = nativno bp n−1 (agentov vid, merjena pravila):
    for n in range(86, 99):
        assert old_areals[n] == NATIVE[n - 1][0], (
            f"pomik r{n}: register {old_areals[n]} != nativno r{n-1} {NATIVE[n-1][0]}"
        )
    pomik_pairs = [(n, old_areals[n], NATIVE[n - 1][0]) for n in range(86, 99)]

    # ---------- VGRADNJA ----------
    for r in p7:
        bp = int(r["bp_no"])
        vid, struck, status = NATIVE[bp]
        old = r["areal_original"]
        entry: dict = {
            "bp": bp,
            "old": old,
            "new": vid,
            "struck": struck,
            "status": status,
            "voices": {},
        }
        if bp == 81:
            # kolizija — vrednost OSTANE 11, status REVIEW z artefakti
            r["areal_v117"] = {
                "status": "REVIEW — kolizija branja: vid 14[?] / vlm 44 [rot] / nizko-loč. glasovi 11; celica rdeče prečrtana (preklicana parcela?)",
                "struck": True,
                "voices": {"vid": "14[?]", "vlm": "44 [gestrichen] [rot]", "register_lowres": "11"},
            }
            entry["method"] = "kolizija → REVIEW (vrednost nespremenjena)"
        elif old != vid:
            r["areal_original"] = vid
            r["areal_v117"] = {
                "status": f"TRANSCRIBED (vid + {'vlm' if bp in VLM_VALUE_HITS and 'artefakt' not in VLM_VALUE_HITS[bp] else 'nizko-loč. glas iste črnila'} — vezava po merjenih pravilih val 117)",
                "struck": struck,
                "voices": {
                    "vid": vid,
                    "vlm_value_level": VLM_VALUE_HITS.get(bp, "prazno/nezanesljivo (band2)"),
                    "register_lowres_pomik": f"nizko-loč. glas je bral to črnilo kot r{bp + 1} = {old}" if bp >= 86 else f"nizko-loč. zmešane vrstice 2–5 (to črnilo bral kot r{bp + 3} = {old})",
                },
            }
            entry["method"] = "POPRAVEK (nativno + merjena pravila; F2-analog areal pomik)"
        else:
            r["areal_v117"] = {"status": "TRANSCRIBED (nativno = register)", "struck": struck, "voices": {}}
            entry["method"] = "potrjeno"
        if struck and bp >= 90:
            entry["voices"]["rdeca_revizija"] = "celica rdeče prečrtana (val 110 red_crossings)"
        changes.append(entry)

    # bp99/100 fantomski (prazni) — potrjeno val 110 + val 117 (vid: prazno; vlm: 99 rdeči scribble)
    for bp in (99, 100):
        r = next(x for x in p7 if x["bp_no"] == str(bp))
        r["areal_v117"] = {
            "status": "TRANSCRIBED-prazno (fantom potrjen: val 110 nativno + val 117 vid prazno; vlm: 99 = rdeči scribble)",
            "struck": False,
            "voices": {"vlm": "99: rdeči scribble / 100: prazno"},
        }

    # ---------- pomik dokaz v changes ----------
    changes.append({
        "bp": "POMIK",
        "old": "register areal r6–r18 = +1 zamik (F2-analog)",
        "new": f"13/13 parov potrjenih: register r{{n}} = nativno r{{n−1}} za n=86..98 ({pomik_pairs[0]}…{pomik_pairs[-1]})",
        "method": "strukturni dokaz (merjena pravila + vid)",
        "voices": {"vid": "sekvenca + vezava bp Nro kontaktni prirezi", "vlm": "vrednostna soglasja"},
    })

    # ---------- reconciliation.json: val117 sekcija ----------
    rec["val117"] = {
        "date": "2026-10-01",
        "trigger": "re-adjudikacija areal/lastnik p7 (izključitev val110-areal-owner; napovedana val 110 §3d, glasovi val 116/117)",
        "method": ("native-p07 (2727×2117, PDF-native maksimum F-PZ-17) + IZMERJENA horizontalna pravila "
                   "(20 vrstic 379–2013 + vsotna 2013–2111) + agentov vid (vezava bp Nro) + 9 VLM glasov "
                   "(read-pt7-v117.mts: 4 areal bandi + vsotna + 4 lastnik bandi); admission: vrednostna "
                   "soglasja vid+vlm/nizko-loč. → TRANSCRIBED, kolizija → REVIEW"),
        "areal_pomik": {
            "finding": "F3-analog: register areal stolpec p7 je +1 zamaknjen za r6–r18 (register bp n = nativno bp n−1)",
            "pairs_verified": 13,
            "top_rows": "r2–r5 posamezno zmešane (nizko-loč.); r1 kolizija 14/44/11",
            "f2_analog": "val 110 F2 za hišne številke (bp 85–97); val 117 zaključi analog za areale",
        },
        "popravki": 17,
        "kolizije": 1,
        "vsotna_areal": {
            "status": "REVIEW artefakt (večslojni zapis)",
            "vid": "1[?]|77[?] prečrtano + rdeče 62[?]",
            "vlm": "7 7/62 (rdeči imenovalec)",
            "opomba": "vsota nativnih klafter = 1701 = 1 joch 101 klafter — se ne zaključi z nobeno prebrano obliko; aritmetična vrzel dokumentirana",
        },
        "owner_voices_v117": {
            "status": "ARTEFAKTI — NIČ sprememb imen (F1: PUA = avtoriteta; 4. glas Kurrent garbled)",
            "primerjava": "vlm 'Strauß Georg' vs register 'Krauß Georg'/'Hans Georg' — kolizije zabeležene v register.json v117_native",
            "prestrike": "bp 81, 82, 85, 90(?), 96, 98 rdeče prečrtani lastniki (skladno z val 110 red_crossings 12 vrstic)",
        },
        "honesty": ("TRANSCRIBED = 'tako je zapisano na p7' (merjena pravila + vid + VLM/nizko-loč. vrednostna "
                    "soglasja); bp81 ostaja REVIEW (3 branja); vsotna REVIEW; imena nespremenjena; "
                    "PUA kaskada NI potrebna (PT areali ne hranijo PS/PUA/KG); TRANSCRIBED=0 na imenskih poljih"),
        "open_for_full_res_update": "val110-areal-owner → REŠENO-delno (areal r6–r18 + r98; r1 kolizija + vsotna ostajata REVIEW; lastniška imena = F1 politika, ne re-adjudikacija)",
    }
    # posodobi open_for_full_res (seznam): PT p7 rep vnos → v117 delna rešitev
    rec["open_for_full_res"] = [
        (str(x) + " → REŠENO-delno-v117 (areal pomik +1 r6–r18 vgrajen; r1 kolizija + vsotna REVIEW; imena F1 politika)"
         if "PT p7" in str(x) else x)
        for x in rec["open_for_full_res"]
    ]

    # ---------- page-records.json: p7 v117 blok ----------
    p7rec = next(p for p in pages if p.get("page") == 7)
    p7rec["v117_areal"] = {
        "measured_rules": "20 vrstic: 379–471–553–634–715–797–878–960–1042–1122–1202–1285–1368–1447–1529–1609–1692–1772–1852–1935–2013 + vsotna 2013–2111 (detekcija val 117)",
        "nativna_sekvenca_areal": {str(bp): NATIVE[bp][0] for bp in sorted(NATIVE)},
        "prestrike_areal": [81, 82, 85, 90, 91, 92, 93, 94, 95, 96, 97],
        "bp81_kolizija": "vid 14[?] / vlm 44 [rot] / register 11 — REVIEW",
        "vsotna": "večslojni (vid 1|77?+rdeče 62?; vlm 7 7/62) — REVIEW; aritmetika 1701 klafter = 1|101 se ne zaključi",
        "band_crops": "pt7v117-areal-band1..4.png (10x, merjena pravila) + pt7v117-owner-band1..4.png (3x) + vsotna 8x",
    }

    # ---------- write ----------
    REG.write_text(json.dumps(reg, ensure_ascii=False, indent=2) + "\n")
    REC.write_text(json.dumps(rec, ensure_ascii=False, indent=2) + "\n")
    PAGES.write_text(json.dumps(pages, ensure_ascii=False, indent=2) + "\n")
    CHANGES.write_text(json.dumps({
        "built": datetime.now(timezone.utc).isoformat(),
        "val": 117,
        "task": "PT p7 re-adjudikacija areal stolpca (F2-analog pomik +1)",
        "baseline": "register.json areal_original pre-v117",
        "changes": changes,
        "post_tally": {
            "popravki": 17,
            "review_kolizije": 1,
            "fantomi_potrjeni": 2,
            "transcribed_areal": 19,
        },
    }, ensure_ascii=False, indent=2) + "\n")

    pop = [c for c in changes if str(c.get("method", "")).startswith("POPRAVEK")]
    print(f"OK: {len(pop)} POPRAVKOV + 1 REVIEW (bp81) + 2 fantoma potrjena; pomik 13/13")


if __name__ == "__main__":
    main()
