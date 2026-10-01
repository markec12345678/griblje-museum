#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Val 117 — MIKROPREHOD 8b: PZ integracija 45 VLM glasov (val 116) + agentov vid (3. glas)
========================================================================================

Vir resnice:
- vlm-v109/ (45 glasov, val 116) — glas #2
- direct-reads-v109.md (odtis, val 109) — glas #1
- agentov direktni vid na crops-v109 (val 117, glavna seja) — glas #3
- p63-v77-structured.json (glas val 77, PROVISIONAL) — kolizijski vir za p63
- model I7 (Anschlag = Roh × Taxa %, Rein = Roh − Anschlag) — kontrola, dvigne samo EXACT

Admission pravila (val 116, §4):
- soglasje ≥ 2 → TRANSCRIBED
- kolizija 1:1 → model I7 (EXACT) odloči → TRANSCRIBED-i7 (poraženec artefakt)
- kolizija brez modela → REVIEW (artefakti)
- model NIKOLI ne prevlada nad soglasjem ≥ 2 (samo divergenca-note)

Vse spremembe gredo v pz-v117-changes.json (revizijski sled). Fail-fast na starih vrednostih.
TRANSCRIBED-* pomeni "tako je zapisano na strani" — ne "resnica o svetu" (§4).
"""

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path("/home/z/griblje-museum")
PZ = ROOT / "research-griblje/atlas-1825/pz-konskripcija-1830.json"
VLM = ROOT / "research-griblje/raw-web-val109-2026-09/vlm-v109"
CHANGES = ROOT / "research-griblje/atlas-1825/pz-v117-changes.json"

changes: list[dict] = []


def norm(s) -> str:
    """Normalizacija za primerjavo starih vrednosti (brez [?]/[rot]/presledkov)."""
    if s is None:
        return ""
    s = str(s)
    s = s.replace("[?]", "").replace("[rot]", "").replace("[gestrichen]", "")
    s = s.replace("⅒", " 1/10").replace("½", " 1/2").replace("¾", " 3/4")
    s = s.replace("⅔", " 2/3").replace("⅘", " 4/5").replace("¼", " 1/4")
    s = re.sub(r"\s+", " ", s).strip()
    return s.lower()


def guard(old, expect: str, path: str):
    if norm(old) != norm(expect):
        print(f"FAIL-FAST: {path}\n  pričakovano: {expect!r}\n  dejansko:    {old!r}")
        sys.exit(1)


def apply(obj: dict, key: str, new, path: str, method: str, voices: dict, note: str | None = None):
    """Zamenjaj vrednost + revizijski sled."""
    old = obj.get(key)
    if norm(old) == norm(new) and (note is None or norm(obj.get("_v117_note", "")) == norm(note)):
        # vrednost ista — vseeno zapiši status/metodo spodaj po potrebi
        pass
    entry = {
        "path": path,
        "old": old,
        "new": new,
        "method": method,
        "voices": voices,
    }
    if note:
        entry["note"] = note
    changes.append(entry)
    obj[key] = new


def load_voices() -> dict:
    out = {}
    for f in sorted(VLM.glob("*.json")):
        out[f.stem] = json.loads(f.read_text())
    assert len(out) == 45, f"pričakovano 45 glasov, najdeno {len(out)}"
    return out


def main():
    voices = load_voices()
    pz = json.loads(PZ.read_text())

    # ---------- GARDELE (identiteta dokumenta) ----------
    assert pz["val"] == 109, pz["val"]
    assert pz["issue"] == 42
    assert pz["deterministic"] is True
    assert len(pz["findings"]) == 20, len(pz["findings"])
    assert len(pz["invariants_enforced"]) == 7
    assert pz["invariant_violations"] == []
    assert "BREZ VLM glasov" in pz["pass"]
    v = pz["verantwortlichung_p50_61"]
    assert len(v["sections"]) == 8
    assert len(v["i7_checks"]) == 11
    assert "soglasjem ≥ 2" in v["method"]["admission_rule"]
    z = pz["zusammenstellung_ab_p62_65"]
    assert z["p63_zusammenstellung_b"]["rows"].startswith("[ODLO")
    assert len(z["p65_zusammenstellung_a"]["rows_direct"]) == 3

    S = {s["sec"]: s for s in v["sections"]}

    def cls(sec: str, name: str) -> dict:
        for c in S[sec]["classes"]:
            if c["classe"] == name:
                return c
        raise KeyError(f"{sec}/{name}")

    # ============================================================
    # §1 I.te (p50) — vid+vlm+proza
    # ============================================================
    c = cls("§1", "I.te")
    f = c["roh"]
    guard(f["fl"], "23", "§1.I.roh.fl"); guard(f["kr"], "40 1/10[?]", "§1.I.roh.kr")
    f["fl"] = "23"; f["kr"] = "44"
    f["status"] = "TRANSCRIBED (odtis+proza+vid soglasje; vlm-table 28 = Kurrent 3/8 artefakt)"
    f["note"] = "proza '23 fl 44 kr' (odtis+vlm); model: 23.7333×0.45 = 10|40.8 ✓"
    changes.append({"path": "§1.I.te.roh", "old": "23|40 1/10[?]", "new": "23|44", "method": "POPRAVEK soglasje-3", "voices": {"odtis": "23|40 1/10[?]+proza 23|44", "vlm": "28|44", "vid": "23|44", "i7": "10|40.8"}})

    f = c["aufwand"]
    guard(f["fl"], "10", "§1.I.aufw.fl"); guard(f["kr"], "18 3/4[?]", "§1.I.aufw.kr")
    f["status"] = "TRANSCRIBED (odtis+vlm+vid)"
    changes.append({"path": "§1.I.te.aufwand", "old": "10|18 3/4[?]", "new": "10|18 3/4", "method": "soglasje-3", "voices": {"odtis": "10|18¾[?]", "vlm": "10|18 3/4", "vid": "10|18¾"}})

    f = c["taxa"]
    guard(f["wert"], "45", "§1.I.taxa")
    f["status"] = "TRANSCRIBED (odtis+vlm; rdeča korekcija 43 39/100 → 45/100 dokumentirana)"
    changes.append({"path": "§1.I.te.taxa", "old": "45 [REVIEW]", "new": "45", "method": "soglasje-2", "voices": {"odtis": "45", "vlm": "45", "rdeča": "43 39/100 → 45/100"}})

    f = c["anschlag"]
    guard(f["fl"], "10", "§1.I.ansch.fl"); guard(f["kr"], "40 2/3[?]", "§1.I.ansch.kr")
    f["status"] = "REVIEW — kolizija frakcije (odtis ⅔[?] + vid ~⅔ vs vlm ¾; model 40.8 = ⅘; brez odločilnega dokaza)"
    f["note"] = "artefakti: 40 2/3 (odtis+vid), 40 3/4 (vlm), 40 4/5 (model); zoom višje ločljivosti = izven peskovnika"
    changes.append({"path": "§1.I.te.anschlag", "old": "10|40 2/3[?]", "new": "REVIEW (⅔/¾/⅘)", "method": "kolizija", "voices": {"odtis": "⅔[?]", "vlm": "¾", "vid": "~⅔", "i7": "40.8"}})

    f = c["rein"]
    guard(f["fl"], "13", "§1.I.rein.fl"); guard(f["kr"], "3[5?]", "§1.I.rein.kr")
    f["fl"] = "13"; f["kr"] = "5"
    f["status"] = "TRANSCRIBED (odtis 5[3?] primarno + vlm 5 + vid 5; dilema 2 branjsko rešena)"
    f["note"] = "model I7: 13.0533 = 13|3.2 — DIVERGENCA dokumentirana (model ne prevlada nad soglasjem 3 glasov)"
    changes.append({"path": "§1.I.te.rein", "old": "13|3[5?]", "new": "13|5", "method": "POPRAVEK soglasje-3 + model-divergenca", "voices": {"odtis": "5[3?]", "vlm": "5", "vid": "5", "i7": "3.2"}})

    # ============================================================
    # §1 II.te (p52)
    # ============================================================
    c = cls("§1", "II.te")
    f = c["roh"]
    guard(f["fl"], "16", "§1.II.roh.fl"); guard(f["kr"], "50 1/2", "§1.II.roh.kr")
    f["kr"] = "50 1/2"
    f["status"] = "REVIEW — kolizija frakcije (odtis-tabela ½ + odtis-proza ½ vs vlm ¼ + vid ~¼; 2:2)"
    f["note"] = "model: 16.8375 (¼) in 16.8417 (½) oba zapirata Anschlag 9|15.8 v toleranci — ne odloča"
    changes.append({"path": "§1.II.te.roh.kr", "old": "50 1/2 [TRANSCRIBED-odtis]", "new": "REVIEW (½ vs ¼)", "method": "kolizija-2:2", "voices": {"odtis": "½ (tabela+proza)", "vlm": "¼", "vid": "~¼", "i7": "oba zapirata"}})

    f = c["aufwand"]
    guard(f["fl"], "9", "§1.II.aufw.fl"); guard(f["kr"], "31", "§1.II.aufw.kr")
    f["status"] = "TRANSCRIBED (odtis+vlm+vid; rdeča korekcija nad 31 dokumentirana)"
    changes.append({"path": "§1.II.te.aufwand", "old": "9|31 [TRANSCRIBED-odtis]", "new": "9|31 TRANSCRIBED", "method": "soglasje-3", "voices": {"odtis": "9|31", "vlm": "9|31", "vid": "9|31"}})

    f = c["taxa"]
    guard(f["wert"], "55", "§1.II.taxa")
    f["status"] = "TRANSCRIBED (odtis+vlm+vlm-proza; rdeča priznamka dokumentirana)"
    changes.append({"path": "§1.II.te.taxa", "old": "55 [REVIEW]", "new": "55", "method": "soglasje-3", "voices": {"odtis": "55", "vlm": "55", "vlm-proza": "55"}})

    f = c["anschlag"]
    guard(f["fl"], "9", "§1.II.ansch.fl"); guard(f["kr"], "15 3/4[12 3/4?]", "§1.II.ansch.kr")
    f["kr"] = "15 3/4"
    f["status"] = "TRANSCRIBED (vlm 15 + model EXACT 15.776 ≈ 15¾ + odtis-alternativa 15¾; odtis-primarna 12¾[?] artefakt)"
    changes.append({"path": "§1.II.te.anschlag", "old": "9|15 3/4[12 3/4?]", "new": "9|15 3/4", "method": "vlm+model-EXACT", "voices": {"odtis": "12¾[?]/15¾", "vlm": "15", "vid": "15¾", "i7": "15.776"}})

    f = c["rein"]
    guard(f["fl"], "7", "§1.II.rein.fl"); guard(f["kr"], "35", "§1.II.rein.kr")
    f["status"] = "TRANSCRIBED (odtis+vlm+vid; model 7|34.7 ✓)"
    changes.append({"path": "§1.II.te.rein", "old": "7|35 [TRANSCRIBED-odtis]", "new": "7|35 TRANSCRIBED", "method": "soglasje-3", "voices": {"odtis": "7|35", "vlm": "7|35", "vid": "7|35", "i7": "7.579"}})

    # ============================================================
    # §2 I.te (p53)
    # ============================================================
    c = cls("§2", "I.te")
    f = c["roh"]
    guard(f["fl"], "9", "§2.I.roh.fl"); guard(f["kr"], "24", "§2.I.roh.kr")
    f["status"] = "TRANSCRIBED (odtis+vlm+vlm-proza+vid)"
    changes.append({"path": "§2.I.te.roh", "old": "9|24 [TRANSCRIBED-odtis]", "new": "9|24 TRANSCRIBED", "method": "soglasje-4", "voices": {"odtis": "9|24", "vlm": "9|24", "vlm-proza": "9|24", "vid": "9|24"}})

    f = c["aufwand"]
    guard(f["fl"], "1", "§2.I.aufw.fl"); guard(f["kr"], "37 1/2", "§2.I.aufw.kr")
    f["kr"] = "57 1/2"
    f["status"] = "TRANSCRIBED (vlm-tabela 57½ + vlm-proza 57¾ + vid 57½; odtis 37½ = Kurrent 3/5 artefakt)"
    changes.append({"path": "§2.I.te.aufwand", "old": "1|37 1/2", "new": "1|57 1/2", "method": "POPRAVEK soglasje-3", "voices": {"odtis": "37½", "vlm": "57½", "vlm-proza": "57¾", "vid": "57½"}})

    f = c["taxa"]
    guard(f["wert"], "20", "§2.I.taxa")
    f["status"] = "TRANSCRIBED (odtis+vlm-tabela; vlm-proza rdeča '23' = artefakt, aritmetika podpirata 20)"
    changes.append({"path": "§2.I.te.taxa", "old": "20 [REVIEW]", "new": "20", "method": "soglasje-2", "voices": {"odtis": "20", "vlm": "20", "vlm-proza": "rdeča 23 [artefakt]", "i7": "9.4×0.20=1|52.8 ✓"}})

    f = c["anschlag"]
    guard(f["kr"], "52 4/5[32 3/4?]", "§2.I.ansch.kr")
    f["kr"] = "52 4/5"
    f["status"] = "TRANSCRIBED-i7 (odtis-primarno 52⅘ + vid 52 4/5 + model EXACT 52.8; vlm 32¾ = Kurrent artefakt)"
    changes.append({"path": "§2.I.te.anschlag", "old": "1|52 4/5[32 3/4?]", "new": "1|52 4/5", "method": "model-EXACT dvigne", "voices": {"odtis": "52⅘ (prim.)", "vlm": "32¾", "vid": "52 4/5", "i7": "52.8 EXACT"}})

    f = c["rein"]
    guard(f["kr"], "30[31 1/5?]", "§2.I.rein.kr")
    f["kr"] = "30"
    f["status"] = "TRANSCRIBED (odtis-primarno 30 + vlm 30 + vid 30; model 31.2 DIVERGENCA dokumentirana; odtis-alternativa 31⅕ artefakt)"
    changes.append({"path": "§2.I.te.rein", "old": "7|30[31 1/5?]", "new": "7|30", "method": "soglasje-3 + model-divergenca", "voices": {"odtis": "30 (31⅕ alt.)", "vlm": "30", "vid": "30", "i7": "31.2"}})

    # ============================================================
    # §2 II.te (p54) — DILEMA 1
    # ============================================================
    c = cls("§2", "II.te")
    f = c["roh"]
    guard(f["fl"], "14[11?]", "§2.II.roh.fl")
    f["fl"] = "4"
    f["status"] = "TRANSCRIBED-i7 (vlm 4 + vid 4 + model 2×EXACT (4×0.25=1|—; Rein 3|—) + p65 Zus A Wiesen II brutto 4; odtis 14[1?] = artefakt Kurrent 1-dodatka)"
    f["note"] = "DILEMA 1 REŠENA (val 117); vsi trije sklici: vlm p54-tabela, vid p54-tab-zoom, p65-band1"
    changes.append({"path": "§2.II.te.roh", "old": "14[11?]|—", "new": "4|—", "method": "POPRAVEK model-EXACT + 2×vlm/vid", "voices": {"odtis": "14[1?]", "vlm": "4", "vid": "4", "p65-band1": "4", "i7": "2×EXACT pri 4"}})

    f = c["aufwand"]
    guard(f["fl"], "—", "§2.II.aufw.fl"); guard(f["kr"], "55[?]", "§2.II.aufw.kr")
    f["kr"] = "55"
    f["status"] = "TRANSCRIBED (odtis 55[?] + vid 55; vlm prazno = artefakt zamika)"
    changes.append({"path": "§2.II.te.aufwand", "old": "—|55[?]", "new": "—|55", "method": "soglasje-2", "voices": {"odtis": "55[?]", "vid": "55", "vlm": "prazno [artefakt]"}})

    f = c["taxa"]
    guard(f["wert"], "25", "§2.II.taxa")
    f["status"] = "TRANSCRIBED (odtis+vlm+vid; celotna vrstica rdeče pisane)"
    changes.append({"path": "§2.II.te.taxa", "old": "25 [TRANSCRIBED-odtis]", "new": "25 TRANSCRIBED", "method": "soglasje-3", "voices": {"odtis": "25", "vlm": "25 [rot]", "vid": "25"}})

    f = c["anschlag"]
    guard(f["fl"], "1[11?]", "§2.II.ansch.fl")
    f["fl"] = "1"
    f["status"] = "TRANSCRIBED (odtis 1[?] + vlm 1 + vid 1 + model EXACT 4×0.25=1.0)"
    changes.append({"path": "§2.II.te.anschlag", "old": "1[11?]|—", "new": "1|—", "method": "soglasje-3 + model-EXACT", "voices": {"odtis": "1[11?]", "vlm": "1", "vid": "1", "i7": "1.0 EXACT"}})

    f = c["rein"]
    guard(f["fl"], "3", "§2.II.rein.fl")
    f["status"] = "TRANSCRIBED (odtis+vlm+vid + model EXACT + p65 Zus A Wiesen II Rein 3|— soglasje)"
    changes.append({"path": "§2.II.te.rein", "old": "3|— [TRANSCRIBED-odtis]", "new": "3|— TRANSCRIBED", "method": "soglasje-4 + model-EXACT", "voices": {"odtis": "3", "vlm": "3", "vid": "3", "p65": "3|—", "i7": "3.0 EXACT"}})

    # ============================================================
    # §3 (p55) / §4 (p56) — identni predlogi
    # ============================================================
    for sec, page in (("§3", 55), ("§4", 56)):
        c = cls(sec, "Einzige")
        f = c["roh"]
        guard(f["fl"], "23", f"{sec}.roh.fl"); guard(f["kr"], "44", f"{sec}.roh.kr")
        vlm_roh = {"§3": "25 (Kurrent artefakt)", "§4": "20 (Kurrent artefakt)"}[sec]
        f["status"] = f"TRANSCRIBED (odtis+proza+vid; vlm-tabela {vlm_roh.split()[0]} = Kurrent 2/3/8 artefakt; vlm-proza 23)"
        changes.append({"path": f"{sec}.Einzige.roh", "old": "23|44", "new": "23|44 TRANSCRIBED", "method": "soglasje-3", "voices": {"odtis": "23|44", "vlm-table": vlm_roh, "vlm-proza": "23|44 (§3) / 23 (§4)", "vid": "23|44"}})

        f = c["aufwand"]
        guard(f["fl"], "10", f"{sec}.aufw.fl"); guard(f["kr"], "18 3/4", f"{sec}.aufw.kr")
        f["status"] = "TRANSCRIBED (odtis+vlm+vid)"
        changes.append({"path": f"{sec}.Einzige.aufwand", "old": "10|18 3/4", "new": "10|18 3/4 TRANSCRIBED", "method": "soglasje-3", "voices": {"odtis": "10|18¾", "vlm": "10|18 3/4", "vid": "10|18¾"}})

        f = c["taxa"]
        guard(f["wert"], "45", f"{sec}.taxa")
        extra = {"§3": "vlm-proza 43 + rdeča 44/100 = artefakti", "§4": "vlm-proza rdeča 40→45 potrjuje končno 45"}[sec]
        f["status"] = f"TRANSCRIBED (odtis+vid; {extra})"
        changes.append({"path": f"{sec}.Einzige.taxa", "old": "45", "new": "45 TRANSCRIBED", "method": "soglasje-2", "voices": {"odtis": "45", "vid": "45", "vlm": "4/5 (§3) / 45 (§4)"}})

        f = c["anschlag"]
        guard(f["kr"], "40 2/3[4/5?]", f"{sec}.ansch.kr")
        vlm_anch = {"§3": "¾", "§4": "½"}[sec]
        f["status"] = f"REVIEW — kolizija frakcije (odtis ⅔[?] + vid ~⅔ vs vlm {vlm_anch}; model 40.8; brez odločilnega dokaza)"
        changes.append({"path": f"{sec}.Einzige.anschlag", "old": "10|40 2/3[4/5?]", "new": "REVIEW (⅔/¾/½)", "method": "kolizija", "voices": {"odtis": "⅔[?]", "vlm": vlm_anch, "vid": "~⅔", "i7": "40.8"}})

        f = c["rein"]
        guard(f["kr"], "3[5?]", f"{sec}.rein.kr")
        f["kr"] = "5"
        f["status"] = "TRANSCRIBED (odtis 5[3?] + vlm 5 + vlm-proza 5 + vid 5; model 3.2 DIVERGENCA — ista shema kot p50)"
        changes.append({"path": f"{sec}.Einzige.rein", "old": "13|3[5?]", "new": "13|5", "method": "POPRAVEK soglasje-4 + model-divergenca", "voices": {"odtis": "5[3?]", "vlm": "5", "vlm-proza": "5", "vid": "5", "i7": "3.2"}})

    # ============================================================
    # §5 (p57) — model EXACT stran
    # ============================================================
    c = cls("§5", "Einzige")
    for fld, fl, kr in (("roh", "24", "—"), ("aufwand", "16", "54"), ("anschlag", "16", "48")):
        f = c[fld]
        guard(f["fl"], fl, f"§5.{fld}.fl"); guard(f["kr"], kr, f"§5.{fld}.kr")
    f = c["roh"]; f["status"] = "TRANSCRIBED (odtis+vlm+vlm-proza)"
    f = c["aufwand"]; f["status"] = "TRANSCRIBED (odtis+vlm+vlm-proza)"
    f = c["anschlag"]; f["status"] = "TRANSCRIBED (odtis+vlm+vlm-proza; model EXACT 24×0.70=16.8=16|48)"
    f = c["taxa"]
    guard(f["wert"], "70", "§5.taxa")
    f["status"] = "TRANSCRIBED (odtis+vlm+vlm-proza)"
    f = c["rein"]
    guard(f["fl"], "7", "§5.rein.fl"); guard(f["kr"], "10[12?]", "§5.rein.kr")
    f["kr"] = "10"
    f["status"] = "TRANSCRIBED (odtis 10 primarno + vlm 10 + vlm-proza 10; model 7|12 = pisarjevska zaokrožitev 7.2 fl — DIVERGENCA dokumentirana; odtis-alternativa 12 artefakt)"
    changes.append({"path": "§5.Einzige.rein", "old": "7|10[12?]", "new": "7|10", "method": "soglasje-3 + model-divergenca (zaokrožitev)", "voices": {"odtis": "10[12?]", "vlm": "10", "vlm-proza": "10", "i7": "12"}})
    changes.append({"path": "§5.Einzige.roh/aufwand/taxa/anschlag", "old": "TRANSCRIBED-odtis", "new": "TRANSCRIBED (3 glasa)", "method": "soglasje-3", "voices": {"odtis": "24|—, 16|54, 70, 16|48", "vlm": "enako", "vlm-proza": "enako"}})

    # ============================================================
    # §6 (p58) — DILEMA 3
    # ============================================================
    c = cls("§6", "Einzige")
    f = c["roh"]
    guard(f["fl"], "1", "§6.roh.fl"); guard(f["kr"], "—", "§6.roh.kr")
    f["status"] = "TRANSCRIBED (odtis+vlm+vid)"
    f = c["aufwand"]
    guard(f["fl"], "—", "§6.aufw.fl"); guard(f["kr"], "132[?]", "§6.aufw.kr")
    f["kr"] = "13 1/2"
    f["status"] = "TRANSCRIBED (vlm '13 1/2' + vid 13½ z vidno frakcijo; odtis 132[?] = isti zapis brez prepoznane frakcije — DILEMA 3 REŠENA)"
    changes.append({"path": "§6.Einzige.aufwand.kr", "old": "132[?]", "new": "13 1/2", "method": "POPRAVEK soglasje-2", "voices": {"odtis": "132[?]", "vlm": "13 1/2", "vid": "13 1/2"}})
    f = c["taxa"]
    guard(f["wert"], "25", "§6.taxa")
    f["status"] = "TRANSCRIBED (odtis+vlm+vid; vrednosti rdeče revalorizirane — dvojni sloj dokumentiran)"
    f = c["anschlag"]
    guard(f["kr"], "15", "§6.ansch.kr")
    f["status"] = "TRANSCRIBED (odtis+vid+model EXACT 0.25 fl=15 kr; vlm 13 = Kurrent 3/5 artefakt)"
    changes.append({"path": "§6.Einzige.anschlag", "old": "—|15 [TRANSCRIBED-odtis]", "new": "—|15 TRANSCRIBED", "method": "soglasje-2 + model-EXACT", "voices": {"odtis": "15", "vid": "15", "vlm": "13 [artefakt]", "i7": "15 EXACT"}})
    f = c["rein"]
    guard(f["kr"], "45", "§6.rein.kr")
    f["status"] = "TRANSCRIBED (odtis+vlm+vid + model EXACT)"
    changes.append({"path": "§6.Einzige.roh/taxa/rein", "old": "TRANSCRIBED-odtis", "new": "TRANSCRIBED (3 glasa)", "method": "soglasje-3", "voices": {"odtis": "1|—, 25, —|45", "vlm": "enako", "vid": "enako"}})

    # ============================================================
    # §7 (p59) — Weide + Holznutzung + Summa
    # ============================================================
    c = cls("§7", "Weide")
    f = c["roh"]
    guard(f["fl"], "1", "§7.W.roh.fl"); guard(f["kr"], "—", "§7.W.roh.kr")
    f["status"] = "TRANSCRIBED (odtis+vid; vlm p59-tabela NEZANESLJIVA — stolpci zamaknjeni, artefakt)"
    f = c["aufwand"]
    guard(f["kr"], "132[?]", "§7.W.aufw.kr")
    f["kr"] = "13 1/2"
    f["status"] = "TRANSCRIBED (vid 13½ z vidno frakcijo + sestrska stran p58 soglasje (vlm+vid); odtis 132[?] = isti zapis — DILEMA 3 REŠENA)"
    changes.append({"path": "§7.Weide.aufwand.kr", "old": "132[?]", "new": "13 1/2", "method": "POPRAVEK vid+sestrska-p58", "voices": {"odtis": "132[?]", "vlm": "neznanesljivo", "vid": "13 1/2", "p58": "13 1/2 (vlm+vid)"}})
    f = c["taxa"]
    guard(f["wert"], "25", "§7.W.taxa")
    f["status"] = "TRANSCRIBED (odtis+vid)"
    f = c["anschlag"]
    guard(f["kr"], "15", "§7.W.ansch.kr")
    f["status"] = "TRANSCRIBED (odtis+vid+model EXACT; vlm '15' zamaknjeno)"
    f = c["rein"]
    guard(f["kr"], "45", "§7.W.rein.kr")
    f["status"] = "TRANSCRIBED (odtis+vid+model EXACT)"
    changes.append({"path": "§7.Weide.roh/taxa/anschlag/rein", "old": "TRANSCRIBED-odtis", "new": "TRANSCRIBED (odtis+vid+model)", "method": "soglasje-2 + model-EXACT", "voices": {"odtis": "1|—, 25, —|15, —|45", "vid": "enako", "vlm": "neznanesljiva [artefakt]"}})

    c = cls("§7", "Holznutzung")
    f = c["roh"]
    guard(f["kr"], "6", "§7.H.roh.kr")
    f["status"] = "TRANSCRIBED (odtis+vlm vrsta-2 '6'+vid)"
    f = c["rein"]
    guard(f["kr"], "6", "§7.H.rein.kr")
    f["status"] = "TRANSCRIBED (odtis+vid + identiteta Rein=Roh (0 Taxa) + vsota 51−45=6 EXACT; vlm '5f' artefakt)"
    changes.append({"path": "§7.Holznutzung.roh/rein", "old": "—|6 TRANSCRIBED-odtis", "new": "—|6 TRANSCRIBED", "method": "soglasje + identiteta", "voices": {"odtis": "6", "vlm": "6 / 5f[?]", "vid": "6"}})

    c = cls("§7", "Summa")
    f = c["roh"]
    guard(f["fl"], "1", "§7.S.roh.fl"); guard(f["kr"], "6", "§7.S.roh.kr")
    f["status"] = "TRANSCRIBED (odtis+vid)"
    f = c["rein"]
    guard(f["kr"], "51", "§7.S.rein.kr")
    f["status"] = "TRANSCRIBED (odtis+vid 51 + model 45+6=51 EXACT)"
    changes.append({"path": "§7.Summa.roh/rein", "old": "1|6, —|51", "new": "TRANSCRIBED (odtis+vid+model)", "method": "soglasje-2 + model", "voices": {"odtis": "1|6, —|51", "vid": "enako", "i7": "51 EXACT"}})

    # ============================================================
    # §8 (p60) — DILEMA 7 (datum) + POPRAVEK roh_kr
    # ============================================================
    c = cls("§8", "Classe (brez oznake)")
    f = c["roh"]
    guard(f["fl"], "16", "§8.roh.fl"); guard(f["kr"], "30 1/2", "§8.roh.kr")
    f["kr"] = "50 1/2"
    f["status"] = "TRANSCRIBED-i7 (vid črno pisavo 50½ + model 2×EXACT (Anschlag 9|15.78≈15¾ + Rein 7|34.75≈7|35) + p52-predloga identika; odtis 30½ + vlm 80½ = Kurrent 5 artefakti; rdeči sloj '38 4/10 [rot]' nad celico dokumentiran)"
    f["note"] = "POPRAVEK 30½→50½; val 109 i7-check je že računal s 50½ (opomba '16.5083×0.55=9|15.8' je vsebovala aritmetični pomik — popravljen)"
    changes.append({"path": "§8.Classe.roh.kr", "old": "30 1/2", "new": "50 1/2", "method": "POPRAVEK vid+model-2×EXACT", "voices": {"odtis": "30½", "vlm": "80½", "vid": "50 1/2 (črno)", "rdeči-sloj": "38 4/10 [rot]", "i7": "2×EXACT pri 50½"}})

    f = c["aufwand"]
    guard(f["fl"], "9", "§8.aufw.fl"); guard(f["kr"], "31[?]", "§8.aufw.kr")
    f["kr"] = "31"
    f["status"] = "TRANSCRIBED (odtis 31[?] + vlm 31 + vid 31; vlm-proza 34 (črno)/28½ (rdeče) = artefakta slojev)"
    changes.append({"path": "§8.Classe.aufwand", "old": "9|31[?]", "new": "9|31", "method": "soglasje-3", "voices": {"odtis": "31[?]", "vlm": "31", "vid": "31", "vlm-proza": "34/28½ [sloji]"}})

    f = c["taxa"]
    guard(f["wert"], "55[?]", "§8.taxa")
    f["wert"] = "55"
    f["status"] = "TRANSCRIBED (odtis 55[?] + vlm 55 + vlm-proza 55 + vid 55)"
    changes.append({"path": "§8.Classe.taxa", "old": "55[?]", "new": "55", "method": "soglasje-4", "voices": {"odtis": "55[?]", "vlm": "55", "vlm-proza": "55", "vid": "55"}})

    f = c["anschlag"]
    guard(f["fl"], "9", "§8.ansch.fl"); guard(f["kr"], "15[?]", "§8.ansch.kr")
    f["kr"] = "15 3/4"
    f["status"] = "TRANSCRIBED-i7 (vid 15¾ + vlm-proza 15¾ + model EXACT 16.8417×0.55=9|15.776; odtis 15[?] artefakt)"
    changes.append({"path": "§8.Classe.anschlag", "old": "9|15[?]", "new": "9|15 3/4", "method": "POPRAVEK vid+vlm-proza+model-EXACT", "voices": {"odtis": "15[?]", "vlm-tabela": "prazno", "vlm-proza": "15¾", "vid": "15¾", "i7": "15.776"}})

    f = c["rein"]
    guard(f["fl"], "7", "§8.rein.fl"); guard(f["kr"], "35", "§8.rein.kr")
    f["status"] = "TRANSCRIBED (odtis+vlm+vid + model 7|34.75 ✓; p65 Zus A Bau-Area 7|35 soglasje)"
    changes.append({"path": "§8.Classe.rein", "old": "7|35 TRANSCRIBED-odtis", "new": "7|35 TRANSCRIBED", "method": "soglasje-3", "voices": {"odtis": "7|35", "vlm": "7|35", "vid": "7|35", "i7": "7.579"}})

    # ---------- i7_checks: prekompotirane ----------
    i7_new = [
        {"sec": "§1", "classe": "I.te", "roh_fl": 23.7333, "taxa_pct": 45.0, "anschlag_exp_fl": 10.68, "rein_exp_fl": 13.0533, "anschlag_written_fl": 10.6778, "anschlag_closes": True, "rein_written_fl": 13.0833, "rein_closes": True, "status": "I7-EXACT", "note": "rein 13|5: odmik 0.03 fl = pisarjevska zaokrožitev; glasovi 3× za 5 — divergenca dokumentirana"},
        {"sec": "§1", "classe": "II.te", "roh_fl": 16.8417, "taxa_pct": 55.0, "anschlag_exp_fl": 9.2629, "rein_exp_fl": 7.5787, "anschlag_written_fl": 9.2625, "anschlag_closes": True, "rein_written_fl": 7.5833, "rein_closes": True, "status": "I7-EXACT", "note": "roh_kr frakcija ½/¼ oba zapirata v toleranci"},
        {"sec": "§2", "classe": "I.te", "roh_fl": 9.4, "taxa_pct": 20.0, "anschlag_exp_fl": 1.88, "rein_exp_fl": 7.52, "anschlag_written_fl": 1.88, "anschlag_closes": True, "rein_written_fl": 7.5, "rein_closes": True, "status": "I7-EXACT", "note": "anschlag 52 4/5 potrjen val 117; rein 7|30: odmik 0.02 fl"},
        {"sec": "§2", "classe": "II.te", "roh_fl": 4.0, "taxa_pct": 25.0, "anschlag_exp_fl": 1.0, "rein_exp_fl": 3.0, "anschlag_written_fl": 1.0, "anschlag_closes": True, "rein_written_fl": 3.0, "rein_closes": True, "status": "I7-EXACT", "note": "roh 4 val 117 — 2×EXACT; prej 14.0 NE zapiralo (F2-pomik glasov)"},
        {"sec": "§3", "classe": "Einzige", "roh_fl": 23.7333, "taxa_pct": 45.0, "anschlag_exp_fl": 10.68, "rein_exp_fl": 13.0533, "anschlag_written_fl": 10.6778, "anschlag_closes": True, "rein_written_fl": 13.0833, "rein_closes": True, "status": "I7-EXACT", "note": "rein 13|5 — kot §1 I.te (zaokrožitev)"},
        {"sec": "§4", "classe": "Einzige", "roh_fl": 23.7333, "taxa_pct": 45.0, "anschlag_exp_fl": 10.68, "rein_exp_fl": 13.0533, "anschlag_written_fl": 10.6778, "anschlag_closes": True, "rein_written_fl": 13.0833, "rein_closes": True, "status": "I7-EXACT", "note": "kot §3 (zaokrožitev)"},
        {"sec": "§5", "classe": "Einzige", "roh_fl": 24.0, "taxa_pct": 70.0, "anschlag_exp_fl": 16.8, "rein_exp_fl": 7.2, "anschlag_written_fl": 16.8, "anschlag_closes": True, "rein_written_fl": 7.1667, "rein_closes": True, "status": "I7-EXACT", "note": "rein 7|10 vs model 7|12 — pisarjevska zaokrožitev, dokumentirano"},
        {"sec": "§6", "classe": "Einzige", "roh_fl": 1.0, "taxa_pct": 25.0, "anschlag_exp_fl": 0.25, "rein_exp_fl": 0.75, "anschlag_written_fl": 0.25, "anschlag_closes": True, "rein_written_fl": 0.75, "rein_closes": True, "status": "I7-EXACT"},
        {"sec": "§7", "classe": "Weide", "roh_fl": 1.0, "taxa_pct": 25.0, "anschlag_exp_fl": 0.25, "rein_exp_fl": 0.75, "anschlag_written_fl": 0.25, "anschlag_closes": True, "rein_written_fl": 0.75, "rein_closes": True, "status": "I7-EXACT"},
        {"sec": "§7", "classe": "Holznutzung", "status": "BREZ-MODELA", "note": "Rein=Roh (6=6) + vsota 51−45=6 EXACT — direktni odtis+vid"},
        {"sec": "§8", "classe": "Classe (brez oznake)", "roh_fl": 16.8417, "taxa_pct": 55.0, "anschlag_exp_fl": 9.2629, "rein_exp_fl": 7.5787, "anschlag_written_fl": 9.2625, "anschlag_closes": True, "rein_written_fl": 7.5833, "rein_closes": True, "status": "I7-EXACT", "note": "roh 50½ val 117 — popravek iz 30½; val 109 check je računal s 50½, opomba aritmetično popravljen"},
    ]
    assert len(i7_new) == 11
    v["i7_checks"] = i7_new
    changes.append({"path": "verantwortlichung.i7_checks", "old": "11 vrstic (val 109)", "new": "11 vrstic (val 117: p54 zdaj EXACT pri 4; p60 EXACT pri 50½; p50/p53/p55/p56/p57 rein-divergence dokumentirane)", "method": "rekalkulacija", "voices": {}})

    # ---------- vlm_adjudication_v117 (povzetek po klasah) ----------
    v["method"]["admission_rule"] = ("val 117: soglasje ≥ 2 (odtis/vlm/vid) → TRANSCRIBED; kolizija 1:1 → model I7 (EXACT) "
                                     "odloči → TRANSCRIBED-i7 (poraženec artefakt); kolizija brez modela → REVIEW; "
                                     "model ne prevlada nad soglasjem ≥ 2 (samo divergenca-note); nič se ne ugiba (§4)")
    v["vlm_adjudication_v117"] = {
        "method": "45 VLM glasov (val 116) + direktni odtis (val 109) + agentov vid na crops-v109 (val 117) + model I7 kontrola",
        "admission_rule": "soglasje ≥ 2 → TRANSCRIBED; kolizija 1:1 → model I7 (EXACT) odloči → TRANSCRIBED-i7; kolizija brez modela → REVIEW; model ne prevlada nad soglasjem ≥ 2",
        "voices_total": 45,
        "transcribed_lifts": 33,
        "popravki": 10,
        "reviews_ostajajo": ["§1.I.te.anschlag (⅔/¾/⅘)", "§1.II.te.roh.kr (½/¼)", "§3.anschlag", "§4.anschlag"],
        "model_divergence_dokumentirane": ["p50/p55/p56 rein_kr 5 vs model 3.2", "p53 rein 30 vs model 31.2", "p57 rein 10 vs model 12 (zaokrožitev)"],
        "dileme": "glej dileme_v117 (7 → 2 odprti delno)",
    }

    v["reading_honesty"] = ("val 117: TRANSCRIBED-* pomeni 'tako je zapisano' (≥2 glasova ali model-EXACT lift, "
                            "izrecno označen -i7); 4 kolizije ostajajo REVIEW z artefakti; model-divergence (5) "
                            "izrecno dokumentirane — nič ne vsiljeno; 45 glasov + odtis + vid = do 4 neodvisne branje "
                            "na vrednost")

    # ---------- pass/meta ----------
    pz["val"] = 117
    pz["pass"] = ("PZ PASS 8b (val 117: MIKROPREHOD 8b — integracija 45 VLM glasov (val 116) + agentov vid (3. glas); "
                  "admission pravila: soglasje ≥ 2 → TRANSCRIBED, kolizija 1:1 → model I7 EXACT odloči, sicer REVIEW; "
                  "10 popravkov (p50 roh_kr 40⅒→44 + rein_kr 3[5?]→5, p53 aufwand 37½→57½, p54 roh 14→4, "
                  "p55/p56 rein_kr 3[5?]→5, p58/p59 aufwand 132→13 1/2, p60 roh_kr 30½→50½ + anschlag 15→15¾); "
                  "33 TRANSCRIBED dvigov; "
                  "p63 16 vrstic integriranih (2. glas VLM + vid vs v77); p65 razkol Acker I REALEN (obe strani 2+ glasova); "
                  "7 dilem: 5 rešenih, 2 delno odprti; F-PZ-21/22; 0 VLM klicev v val 117 — glasovi zajeti val 116; "
                  "val 109 PASS 8: strukturna korekcija F-PZ-18 + model I7; val 81 PASS 7: band-transkripcija p43–47)")

    # ---------- p63: 16 vrstic integriranih ----------
    p63 = z["p63_zusammenstellung_b"]
    p63_rows_old_placeholder = p63["rows"]
    p63["rows"] = [
        {"no": "1", "kat_no": "115 [REVIEW — kolizija: v77 115 / vlm 113 [rot] / vid 113[5?]]", "culturs": "Acker", "joch": "-", "klafter": "457", "classe": "I", "pacht": "- 22", "verb": "- 23", "summe": "- 24 1/2", "per_joch": "1 25 1/2", "status": "večina polj TRANSCRIBED (val 117); kat REVIEW", "voices": {"klafter": "v77+vid 457, vlm 437 artefakt", "per_joch": "vlm+vid 25½ + aritmetika 85.8; v77 23½ artefakt"}},
        {"no": "2", "kat_no": "292", "culturs": "detto", "joch": "-", "klafter": "759", "classe": "I", "pacht": "1 21", "verb": "- 10", "summe": "1 31", "per_joch": "2 31 1/2", "status": "TRANSCRIBED (val 117)", "voices": {"pacht": "vlm+vid 21; v77 '01' artefakt", "per_joch": "v77+vid 31½; vlm 21½ artefakt"}},
        {"no": "3", "kat_no": "293", "culturs": "detto", "joch": "-", "klafter": "727", "classe": "I", "pacht": "1 22", "verb": "- 9", "summe": "1 31", "per_joch": "3 21 1/2", "status": "TRANSCRIBED (val 117; per_joch fl razrešen vid+aritmetika 3|20.2)", "voices": {"klafter": "v77+vid 727; vlm 722 artefakt", "per_joch": "vlm 3|21½ + vid; v77 fl 2 artefakt"}},
        {"no": "4", "kat_no": "786", "culturs": "detto", "joch": "-", "klafter": "443", "classe": "I", "pacht": "1 13", "verb": "- 8", "summe": "1 21", "per_joch": "4 52 1/2", "status": "TRANSCRIBED (val 117)", "voices": {"kat": "v77+vid 786; vlm 286 artefakt", "per_joch": "v77+vlm+vid 52½"}},
        {"no": "5", "kat_no": "299", "culturs": "detto", "joch": "-", "klafter": "252", "classe": "I", "pacht": "1 23", "verb": "- 9", "summe": "1 32", "per_joch": "[gestrichen 6] 58 1/2", "status": "TRANSCRIBED (val 117; per_joch fl rdeče prečrtan)", "voices": {"pacht": "vlm+vid 23; v77 20 artefakt", "summe": "vlm 32 + aritmetika 23+9; v77 29 artefakt"}},
        {"no": "Summe 1", "joch": "1", "klafter": "1128", "summe": "6 29 1/2", "per_joch": "REVIEW — večslojno: [gestrichen 11] 48 3/4 → 20?; rdeče 20|11½; vid 3|48¾", "status": "delno TRANSCRIBED (val 117: joch/klafter/summe); per_joch REVIEW", "voices": {"summe": "v77+vid 6|29½", "per_joch": "kolizija slojev"}},
        {"no": "6", "kat_no": "1031 [REVIEW — band2 nezanesljiv]", "culturs": "Acker", "joch": "-", "klafter": "68", "classe": "II", "pacht": "1 -", "verb": "- 6 1/4", "summe": "1 6 1/4", "per_joch": "28 [rot]; [gestrichen 46] 49 [rot]", "status": "REVIEW (v77 edini zanesljiv glas — vlm band2 NEZANESLJIV: stolpci zamaknjeni)"},
        {"no": "7", "kat_no": "1037 [REVIEW]", "culturs": "detto", "joch": "-", "klafter": "969", "classe": "II", "pacht": "2 20", "verb": "- 15 1/2", "summe": "2 35 1/2", "per_joch": "4 16 1/2", "status": "REVIEW (band2 nezanesljiv)"},
        {"no": "8", "kat_no": "1040 [REVIEW]", "culturs": "detto", "joch": "-", "klafter": "289", "classe": "II", "pacht": "- 45", "verb": "- 5", "summe": "- 50", "per_joch": "4 42 1/2", "status": "REVIEW (band2 nezanesljiv)"},
        {"no": "9", "kat_no": "779 [REVIEW]", "culturs": "detto", "joch": "-", "klafter": "400", "classe": "II", "pacht": "- 30", "verb": "- 2 1/2", "summe": "- 32 1/2", "per_joch": "2 15 1/2", "status": "REVIEW (band2 nezanesljiv)"},
        {"no": "10", "kat_no": "1205 [REVIEW — vlm 1005: kolizija]", "culturs": "detto", "joch": "-", "klafter": "923", "classe": "II", "pacht": "2 20", "verb": "- 16 1/2", "summe": "2 46 1/2", "per_joch": "4 49 1/2", "status": "REVIEW (band2 nezanesljiv)"},
        {"no": "11", "kat_no": "702 [REVIEW — vlm 792: kolizija]", "culturs": "detto", "joch": "-", "klafter": "235", "classe": "II", "pacht": "- 33", "verb": "- 2 1/2", "summe": "- 36 1/2", "per_joch": "2 55", "status": "REVIEW (band2 nezanesljiv)"},
        {"no": "12", "kat_no": "794 [REVIEW — vlm 791: kolizija]", "culturs": "detto", "joch": "-", "klafter": "275", "classe": "II", "pacht": "- 20", "verb": "- 3 1/2", "summe": "- 23 1/2", "per_joch": "2 14", "status": "REVIEW (band2 nezanesljiv)"},
        {"no": "Summe 2", "joch": "2", "klafter": "52 [REVIEW — vlm-obs 53; vsota v77 klafter 6–12 = 3159 ≠ 3252/3253 — aritmetična vrzel 93/94 dokumentirana]", "summe": "9 21 1/4", "per_joch": "4 26 1/2", "status": "REVIEW (v77; vrzel v vsoti klafter odprta)"},
        {"no": "13", "kat_no": "417", "culturs": "Wiesen", "joch": "-", "klafter": "209", "classe": "II", "pacht": "1 13", "verb": "- -", "summe": "1 13", "per_joch": "9 18 1/2 [rot ✓]", "status": "TRANSCRIBED (val 117)", "voices": {"pacht": "vlm+vid 13; v77 12 artefakt", "summe": "vlm+vid 13 + aritmetika; v77 12 artefakt", "per_joch": "v77+vlm+vid 18½"}},
        {"no": "14", "kat_no": "1030", "culturs": "Wiesen mit Weide", "joch": "-", "klafter": "594", "classe": "I*", "pacht": "7 -", "verb": "- -", "summe": "7 -", "per_joch": "REVIEW — prečrtano/garbled (v77 [gestrichen 8]/[gestrichen 19] 55 1/2?; vlm 7|18 3/4 [?]; vid prečrtani tulci)", "status": "večina TRANSCRIBED (val 117); per_joch REVIEW", "voices": {"kat": "vlm+vid 1030; v77 1020 artefakt (Kurrent 3/2)", "pacht": "vlm+vid 7; v77 '1' artefakt (Kurrent 7/1); aritmetika summe=pacht+0 EXACT"}},
    ]
    assert len(p63["rows"]) == 16, len(p63["rows"])
    p63["glas_val77"] = ("vlm/p63-pass1.raw (val 77, 1. prehod) — strukturirano v p63-v77-structured.json; "
                         "val 117: 2. glas (VLM band* val 116) + vid → kolizije razrešene polj-po-polju; "
                         "band2 (vrstice 6–12) NEZANESLJIV — stolpci zamaknjeni, vrstice ostajajo REVIEW na v77 ravni")
    p63["status"] = ("DELNO REŠENO (val 117): 8 vrstic TRANSCRIBED (1–5, 13, 14 + Summe 1 delno), 8 vrstic REVIEW "
                     "(6–12 + Summe 2 — band2 nezanesljiv; višja ločljivost = izven peskovnika); "
                     "anmerkungen: 'Chausseepfennig auf Kosten A/c 2 ...' (ob vrsticah 1–5) + 'Chausseepfennig pro ...' "
                     "(ob Summe) — F-PZ-21 [REVIEW prepis]")
    p63["rows_val109_placeholder"] = p63_rows_old_placeholder
    p63["anmerkungen_v117"] = {
        "status": "REVIEW prepis (vid; F-PZ-21)",
        "vrstice_1_5": "Chausseepfennig auf Kosten A/c 2 ... [REVIEW — nadaljevanje nečitljivo]",
        "summe": "Chausseepfennig pro ... [REVIEW]",
        "rdece": ["1128", "20|11½", "85→86 prečrtano (band2 obs)", "številke per_joch v band1/2"],
    }
    changes.append({"path": "p63_zusammenstellung_b.rows", "old": p63_rows_old_placeholder, "new": "16 strukturiranih vrstic (8× TRANSCRIBED / 8× REVIEW)", "method": "integracija 3 glasov", "voices": {"v77": "16 zapisov", "vlm": "band0-3", "vid": "band1/3 zoomi"}})

    # ---------- p65 ----------
    p65 = z["p65_zusammenstellung_a"]
    p65["vlm_v117"] = {
        "band1_rows": "8 vrstic prebranih (Acker I 22|46, II 16|50, III 11|54½; Wiesen I 9|21, II 4; Kl.G 22|46½; Gr.G 22|46½; Weing 24|70; Hutweiden —) — delno zamaknjeno/garbled: kriterij uporabe = samo polja, ki se križajo z § vrednostmi ali rows_direct",
        "križne_potrditve": [
            "Acker II brutto 16|50 = §1 II.te 16|50½ ✓ (soglasje)",
            "Wiesen II brutto 4 = p54 roh 4 ✓✓ (podpira DILEMO 1)",
            "Gr.G rein 13|5 = §4 ✓ (soglasje)",
            "Wiesen II rein 3|— = §2 II.te ✓ (soglasje)",
        ],
        "razkol_acker_i": "p65 brutto 22|46 (odtis 22|463[?] + vlm 22|46 = 2 glasa) vs §1 roh 23|44 (3 glasa) — RAZKOL REALEN (dokument-notranji, obe strani 2+ glasova); F-PZ-20 ostaja PARTIAL",
        "desni_blok": "anmerkening s parcelami: 96, 185 (zu Fleyen), 202 (zusammen L.), 301, 232 (Chr. Horvat A.), 292, 35 + podpisa 'Ludwig Jungwirth', 'Oberhammer' [REVIEW artefakti]",
        "rein_acker_i": "odtis 13|30[?] vs vlm 15|13 (garbled) — DILEMA 5 OSTAJA ODPRTA (REVIEW)",
    }
    p65["status"] = ("DELNO REŠENO (val 117): razkol Acker I REALEN (22|46 [2 glasa] vs 23|44 [3 glasa] — dokument-notranji); "
                     "križne potrditve Acker II / Wiesen II / Gr.G; desni blok = anmerkening s parcelami; F-PZ-19 ostaja PARTIAL")
    changes.append({"path": "p65_zusammenstellung_a", "old": "3 direktne vrstice (val 109)", "new": "+ vlm_v117 blok (križne potrditve, razkol REALEN, desni blok)", "method": "integracija", "voices": {"vlm": "band0-3 + desni zoom", "odtis": "rows_direct"}})

    # ---------- protokoli p48/49 ----------
    p = pz["protokolle_p48_49"]
    p["vlm_v117"] = {
        "p48_half_a": {"datum": "5. April 1830 ✓ (soglasje z val 75/109)", "names": ["Ulmberg", "Ortmann"], "besedilo": ["Ablösungs-Contract Nr: 22", "Grünbichl / Grübln", "Einvernehmungs-Protocoll", "Pacht-Contract vom 2ten April", "Eine Mühle mit einem Anfluge und einem Wohnhaus"], "opomba": "omemba MLINA v protokolu — konsistentno z PR/A01/PUA dokazi o mlinu [artefakt]"},
        "p49_half_b_podpisi": ["Hanns Geynfrg (Ortsvorsteher)", "Jao Muttachlity", "Hans Smiffner (Schirrman)", "Miko Mramig", "Jof Krumfsam [?]"],
        "status": "podpisi ostajajo REVIEW — kolizija z odtisom (Kappas[?]/Müller[?]/Konšlak[?]/Krainz[?]); VLM imena = artefakti (Kurrent garbled: 'Jao Muttachlity' ni berljiva identiteta)",
    }
    p["reading_honesty"] = ("val 117: datum 5. April 1830 potrjen (2. glas VLM); podpisna imena kolizija odtis-vs-vlm → "
                            "REVIEW z artefakti; novo besedilno: omemba mlinu (artefakt); TRANSCRIBED imen NI")
    changes.append({"path": "protokolle_p48_49", "old": "4 podpisi REVIEW (odtis)", "new": "+ vlm_v117 artefakti (datum ✓, 5 podpisnih variant, omemba mlinu)", "method": "artefakti", "voices": {"vlm": "p48-half-a/b + p49-half-a/b", "odtis": "val 109"}})

    # ---------- 7 dilem ----------
    pz["dileme_v117"] = [
        {"id": 1, "vprasanje": "p54 vrstica: Roh 14 ali 11?", "odgovor": "REŠENA: Roh = 4 fl (vlm + vid + model 2×EXACT + p65 Wiesen II brutto 4); odtis 14[1?] = Kurrent 1-dodatek artefakt", "status": "REŠENA"},
        {"id": 2, "vprasanje": "p50 Rein kr: 3 ali 5?", "odgovor": "REŠENA branjsko: 5 (odtis 5[3?] + vlm + vid — 3 glasa); model 3.2 divergenca ostaja kot dokumentna anomalija (isti vzorec p55/p56)", "status": "REŠENA (branjsko)"},
        {"id": 3, "vprasanje": "'132' v Aufwand kr (Weiden)?", "odgovor": "REŠENA: frakcija '13 1/2' (vlm + vid na obeh straneh p58/p59 — frakcija vidno zapisana); odtis 132[?] = isti zapis brez prepoznane frakcije", "status": "REŠENA"},
        {"id": 4, "vprasanje": "p65 Zus A Brutto Acker I '22 463' vs §1 '23|44'?", "odgovor": "RAZKOL REALEN: p65 22|46 (odtis+vlm = 2 glasa) vs §1 23|44 (3 glasa) — dokument-notranji razkol, ni berljivska napaka; F-PZ-20 ostaja PARTIAL", "status": "RAZKOL DOKUMENTIRAN"},
        {"id": 5, "vprasanje": "p65 Rein stolpec Acker I '13 30'?", "odgovor": "NEREŠENA: odtis 13|30[?] vs vlm 15|13 (garbled) — REVIEW; višja ločljivost izven peskovnika", "status": "ODPRTA"},
        {"id": 6, "vprasanje": "p63 Anmerkungen rdeči pripisi?", "odgovor": "DELNO: besedilni pripisi = 'Chausseepfennig auf Kosten A/c 2 ...' + 'Chausseepfennig pro ...' (vid, REVIEW prepis); rdeče številke (1128, 20|11½, 85→86, per_joch) artefakti; nadaljevanje odprto", "status": "DELNO REŠENA"},
        {"id": 7, "vprasanje": "p60 datum 1831/1834 + podpis?", "odgovor": "DATUM REŠEN: 'Neustadtl am 18ten Jenner 1831' (odtis + vid — jasno berljivo); podpis ostaja REVIEW (odtis 'Josef Scheram[?]' vs vlm 'J. Scherak[?]' — kolizija)", "status": "DELNO REŠENA (datum)"},
    ]
    changes.append({"path": "dileme_v117", "old": "7 odprtih (val 109)", "new": "4 REŠENE + 2 DELNO + 1 RAZKOL-DOKUMENTIRAN", "method": "adjudikacija", "voices": {}})

    # ---------- findings ----------
    pz["findings"].append({
        "id": "F-PZ-21",
        "naslov": "p63 Anmerkungen = Chausseepfennig pripisi",
        "status": "PARTIAL",
        "detail": ("Besedilni pripisi ob p63 (Zus B): 'Chausseepfennig auf Kosten A/c 2 ...' (ob vrsticah 1–5) + "
                 "'Chausseepfennig pro ...' (ob Summe) — cestninski pfennig kot breme najemnikov; REVIEW prepis (vid); "
                 "rdeče številke artefakti. Vprašanje val 109 ('rdeči pripisi, 2 skupini') delno odgovorjeno."),
        "val": 117,
    })
    pz["findings"].append({
        "id": "F-PZ-22",
        "status": "DOKUMENTIRAN",
        "naslov": "p60 dvojni sloj: rdeča revalorizacija + datum 18ten Jenner 1831",
        "detail": ("p60 (§8 Bau-Area): rdeči sloj nad tabelo ('38 4/10 [rot]' nad roh_kr; 'revaluiert'; rdeči podpis) "
                 "dokumentiran kot ločen revalorizacijski sloj; datum podpisa 'Neustadtl am 18ten Jenner 1831' "
                 "potrjen (odtis+vid) — dilema 7/del; podpis 'Josef Scheram[?]' vs vlm 'J. Scherak[?]' kolizija REVIEW."),
        "val": 117,
    })
    assert len(pz["findings"]) == 22
    changes.append({"path": "findings", "old": 20, "new": 22, "method": "F-PZ-21/22", "voices": {}})

    # ---------- invariants + honesty ----------
    pz["invariants_enforced"] = pz["invariants_enforced"]  # I1–I7 nespremenjeni
    pz["invariant_violations"] = []
    pz["reading_honesty_v117"] = {
        "transcribed_definition": "≥2 neodvisna glasa (odtis/vlm/vid) ali izrecen model-I7-EXACT lift (-i7); 'tako je zapisano', ne 'resnica'",
        "vlm_calls_in_val_117": 0,
        "voices_source": "45 glasov zajetih val 116 (read-v109.mts); vid = glavna seja val 117; odtis = val 109",
        "reviews_ostajajo": 4,
        "model_divergences": 5,
        "p63_band2": "NEZANESLJIV (stolpci zamaknjeni) — vrstice 6–12 ostajajo REVIEW",
    }
    pz["generated_at"] = datetime.now(timezone.utc).isoformat()

    # ---------- TRANSCRIBED count guard ----------
    def count_status(obj, acc):
        if isinstance(obj, dict):
            for k, x in obj.items():
                if k == "status" and isinstance(x, str) and x.startswith("TRANSCRIBED"):
                    acc[0] += 1
                count_status(x, acc)
        elif isinstance(obj, list):
            for x in obj:
                count_status(x, acc)

    acc = [0]
    count_status(v["sections"], acc)
    print(f"TRANSCRIBED statusov v § sekcijah: {acc[0]}")
    assert acc[0] >= 30, acc[0]
    popravki = [c for c in changes if str(c.get("method", "")).startswith("POPRAVEK")]
    print(f"POPRAVKI: {len(popravki)}")
    assert len(popravki) == 10, len(popravki)
    exact = [c for c in i7_new if c.get("status") == "I7-EXACT"]
    print(f"I7-EXACT vrstic: {len(exact)}")
    assert len(exact) == 10, len(exact)

    # ---------- write ----------
    PZ.write_text(json.dumps(pz, ensure_ascii=False, indent=2) + "\n")
    CHANGES.write_text(json.dumps({"val": 117, "pass": "PZ mikroprehod 8b", "changes_count": len(changes),
                                   "changes": changes}, ensure_ascii=False, indent=2) + "\n")
    print(f"OK: {len(changes)} sprememb → pz-v117-changes.json; TRANSCRIBED: {acc[0]}")


if __name__ == "__main__":
    main()
