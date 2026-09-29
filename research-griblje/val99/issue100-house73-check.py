#!/usr/bin/env python3
"""
Val 99 — ISSUE #100: identitetna veriga F0000212 (rojstna hiša dr. Nika Županiča).

Determinističen, brez VLM in brez omrežja (zunanji artefakti so prenešeni ločeno —
sopek-1937-1939.pdf, sem-griblje-lokacije.html, sem-svetovljan.html — in shranjeni
v tem imeniku; ta skripta jih samo bere in preverja vsebino).

Prenaša in dopolnjuje (NE podvaja):
  - NR-05 (negative-result register, val 89 re-check): hiša 73 → 0 vrstic v celotnem PS (3–143).
    Ta skripta to izčrpno POTRDI tudi prek PUA, house-register-1825 in A01 inventarja,
    ter doda sosesko 1825 (lastniki hiš 65–80) za prihodnjo triangulacijo.
  - Issue #100 runda 1 (komentar lastnika): SEM F0000212, SEM rojstvo, Šopek citat.
    Ta skripta vse tri vire ponovno preveri PROTI SHRANJENIM ARTEFAKTOM (točen citat + sha256).

Izhod: issue100-house73-summary.json (§8 veriga #100 s statusi po pravilih issue #100).
"""
import hashlib
import json
import os
import re
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
RG = os.path.dirname(BASE)
REPO = os.path.dirname(RG)


def load(p):
    with open(p) as f:
        return json.load(f)


def sha256(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def fail(msg):
    print(f"GUARD FAIL: {msg}")
    sys.exit(1)


# ---------------------------------------------------------------
# 1) in-repo viri 1825 (vsi deterministični artefakti)
# ---------------------------------------------------------------
ps = load(os.path.join(RG, "ps-n83", "register.json"))
pua = load(os.path.join(RG, "pua-n83", "register.json"))
hr = load(os.path.join(RG, "atlas-1825", "house-register-1825.json"))
a01 = load(os.path.join(RG, "atlas-1825", "a01-building-inventory-1825.json"))

if len(ps) != 2871:
    fail(f"PS register ima {len(ps)} vrstic, pričakovano 2.871 (val 98 stanje)")

H = "73"

# --- PS: hiša 73 je odsotna; soseska 65–80 z lastniki ---
ps_h73 = [r for r in ps if str(r.get("haus_no") or "").strip() == H]
if ps_h73:
    fail(f"PS vsebuje hišo 73 ({len(ps_h73)} vrstic) — NR-05 negativ ni več veljaven, preveri!")
ps_pages = sorted({r["page"] for r in ps})
if ps_pages[0] != 3 or ps_pages[-1] != 143 or len(ps_pages) != 141:
    fail(f"PS pokritost strani {ps_pages[0]}..{ps_pages[-1]} ({len(ps_pages)}) — pričakovano 3..143 (141)")

neigh = {}
for n in range(65, 81):
    rows = [r for r in ps if str(r.get("haus_no") or "").strip() == str(n)]
    entry = {
        "house_no": n,
        "ps_rows": len(rows),
        "ps_pages": sorted({r["page"] for r in rows}),
        "ps_owners": sorted({r["owner_original"] for r in rows if r.get("owner_original")}),
        "ps_kultur": sorted({r["kultur"] for r in rows if r.get("kultur")}),
        "pua_rows": sum(
            1 for e in pua if str(e.get("haus_no") or e.get("house_no") or "").strip() == str(n)
        ),
        "in_house_register": any(
            h.get("house_no_1825") == str(n) for h in hr["houses"]
        ),
    }
    if entry["ps_rows"] or entry["pua_rows"] or entry["in_house_register"]:
        neigh[n] = entry

# hiša 73 ne sme biti v soseski (guard)
if "73" in neigh or 73 in neigh:
    fail("hiša 73 se je pojavila v soseski — nedoslednost")

# --- PUA: hiša 73 odsotna ---
pua_h73 = [
    e for e in pua
    if str(e.get("haus_no") or e.get("house_no") or "").strip() == H
]
if pua_h73:
    fail(f"PUA vsebuje hišo 73 ({len(pua_h73)}) — nasprotuje NR-05")

# --- house register: 73 ne obstaja ---
hr_73 = [h for h in hr["houses"] if str(h.get("house_no_1825") or "").strip() == H]
if hr_73:
    fail(f"house-register-1825 vsebuje hišo 73: {hr_73}")

# --- A01: ni stavbe z glifo 73 ---
a01_73 = [
    o for o in a01["objects"]
    if re.search(r"(^|\D)73(\D|$)", json.dumps(o, ensure_ascii=False))
    and o.get("bp") == "73"
]
if a01_73:
    fail(f"A01 inventar ima BP 73: {a01_73}")

# ---------------------------------------------------------------
# 2) zunanji artefakti (prenešeni; tu samo deterministična preverba)
# ---------------------------------------------------------------
ARTEFACTS = {
    "sopek_pdf": os.path.join(BASE, "sopek-1937-1939.pdf"),
    "sopek_fulltext": os.path.join(BASE, "sopek-fulltext.txt"),
    "sem_griblje": os.path.join(BASE, "sem-griblje-lokacije.html"),
    "sem_svetovljan": os.path.join(BASE, "sem-svetovljan.html"),
}
for name, p in ARTEFACTS.items():
    if not os.path.exists(p):
        fail(f"manjka artefakt {name}: {p}")

sopek = open(ARTEFACTS["sopek_fulltext"], encoding="utf-8").read()
sopek_norm = re.sub(r"\s+", " ", sopek)
sem_g = open(ARTEFACTS["sem_griblje"], encoding="utf-8", errors="replace").read()
sem_s = open(ARTEFACTS["sem_svetovljan"], encoding="utf-8", errors="replace").read()

QUOTE_73 = (
    "se je rodil na Krasincu h. št. 18. dne 28. decembra 1841 ter se je okrog "
    "1. 1873. preselil v Griblje, kjer si je kupil hišo št. 73 in posestvo"
)
QUOTE_73_NORM = re.sub(r"\s+", " ", QUOTE_73)

evidence = {
    "sopek_1937_39": {
        "claim": "Miko Županič se je okrog 1873 preselil v Griblje in kupil hišo št. 73 + posestvo (rojen Krasinec h.š. 18, 28. 12. 1841)",
        "quote": QUOTE_73,
        "source": "Katarina Županič: Šopek poljskih cvetlic iz Gribelj v Beli Krajini, Etnolog 10–11 (1937–1939), Ljubljana — odsek »Miko Zupanič (1841—1911)«, str. PDF razpürtja 9/0-based",
        "url": "https://www.etno-muzej.si/files/etnolog/pdf/etnolog_10_11_1937_1939_sopek.pdf",
        "artefact": "sopek-1937-1939.pdf + sopek-fulltext.txt",
        "quote_present": QUOTE_73_NORM in sopek_norm,
        "sha256": sha256(ARTEFACTS["sopek_pdf"]),
        "status": "VERIFIED",
    },
    "sem_f0000212": {
        "claim": "SEM F0000212 — »Enonadstropna hiša na pero, rojstna hiša dr. Nika Županiča.« (Griblje)",
        "quote": "F0000212 Enonadstropna hiša na pero, rojstna hiša dr. Nika Županiča.",
        "source": "SEM digitalne zbirke — lokacija Griblje",
        "url": "https://www.etno-muzej.si/sl/digitalne-zbirke/lokacije/griblje",
        "artefact": "sem-griblje-lokacije.html",
        "quote_present": "F0000212" in sem_g and "rojstna hiša dr. Nika Županiča" in re.sub(r"<[^>]+>", " ", sem_g),
        "sha256": sha256(ARTEFACTS["sem_griblje"]),
        "status": "VERIFIED",
    },
    "sem_rojstvo": {
        "claim": "Dr. Niko Županič rojen v Gribljah, 1. 12. 1876 (umrl Ljubljana 11. 9. 1961)",
        "quote": "Dr. Niko Zupanič (Griblje, 1. 12. 1876 – Ljubljana, 11. 9. 1961)",
        "source": "SEM razstava »Svetovljan iz Gribelj«",
        "url": "https://www.etno-muzej.si/sl/razstave/svetovljan-iz-gribelj",
        "artefact": "sem-svetovljan.html",
        "quote_present": "Griblje, 1. 12. 1876" in re.sub(r"<[^>]+>", " ", sem_s).replace("&nbsp;", " "),
        "sha256": sha256(ARTEFACTS["sem_svetovljan"]),
        "status": "VERIFIED",
    },
}

if not evidence["sopek_1937_39"]["quote_present"]:
    fail("Šopek citat o hiši 73 ni več prisoten v artefaktu")
if not evidence["sem_f0000212"]["quote_present"]:
    fail("SEM F0000212 zapis ni prisoten v artefaktu")
if not evidence["sem_rojstvo"]["quote_present"]:
    fail("SEM rojstni zapis ni prisoten v artefaktu")

# ---------------------------------------------------------------
# 3) veriga #100 §8 — 1825 stolpec + statusi po pravilih #100
# ---------------------------------------------------------------
chain = [
    {"link": "Originalna fotografija — F0000212", "status": "VERIFIED",
     "evidence": "SEM zbirka (runda 1 + val 99 re-check); javna stran je izbor — fototeka 70.000 enot čaka fond",
     "source": "sem-griblje-lokacije.html"},
    {"link": "Identiteta hiše (rojstna hiša Nika Županiča)", "status": "VERIFIED",
     "evidence": "SEM poimenuje F0000212 kot rojstno hišo; SEM razstava: Niko rojen Griblje 1. 12. 1876",
     "source": "sem-griblje-lokacije.html + sem-svetovljan.html"},
    {"link": "Hišna številka 73 (Miko Županič kupil ~1873)", "status": "VERIFIED",
     "evidence": "Šopek (Etnolog 10–11, 1937–1939): točen citat pridobljen in re-verified (val 99)",
     "source": "sopek-1937-1939.pdf"},
    {"link": "F0000212 = hiša št. 73", "status": "INFERRED",
     "evidence": ("konvergenca 2 neodvisnih virov: SEM (rojstna hiša Nika, rojen 1876 v Gribljah) + Šopek "
                  "(oče Miko kupil št. 73 ~1873, družina tam gospodarila); NI ŠE enotnega vira, ki bi "
                  "izrekoval identiteto; hiša 73 NE obstaja v 1825 virih (PS 3–143, PUA, house-register, A01) "
                  "→ številčenje/izgradnja po 1825 — zato 1825 atlas identitete NE more potrditi"),
     "source": "issue100-house73-summary.json (ta artefakt)"},
    {"link": "Hišna št. 73 v 1825 virih", "status": "NOT_FOUND",
     "evidence": ("NR-05 (val 89 re-check, PS 3–143) + val 99 izčrpna preverba: PS 0 vrstic, PUA 0, "
                  "house-register nič, A01 nič; soseska 1825: 72 = Wolfsloch Wolfgey (p65), "
                  "74 = Tillek Wolfgey (p65) / Heidrich Peter (p69) / Kauc Miheljz (p122), 76 = Gritsch Mihlo (p115)"),
     "source": "NR-05 + issue100-house73-summary.json"},
    {"link": "Zgodovinska parcela (1825 kataster)", "status": "TO_COLLECT",
     "evidence": "ker št. 73 v 1825 ne obstaja, je treba iskati POZNE vir (2. franciscejska izmera ~1867–69, zemljiška knjiga)",
     "source": "—"},
    {"link": "Današnja parcela / koordinata", "status": "TO_COLLECT",
     "evidence": "šele po dokazani prostorski identifikaciji (pogojno: obe hiši 72 in 74 sta v PS, kar omogoča prihodnjo triangulacijo)",
     "source": "—"},
    {"link": "3D model", "status": "TO_COLLECT",
     "evidence": "šele po dokazani geometriji (runda 1: »ne iščemo 3D modela na pamet«)",
     "source": "—"},
    {"link": "AR anchor / mobilni AR prikaz", "status": "TO_COLLECT",
     "evidence": "šele po georeferenciranem objektu",
     "source": "—"},
]

summary = {
    "val": "99",
    "issue": "100",
    "title": "ISSUE #100 — F0000212 identitetna veriga: hiša št. 73 v 1825 virih NE obstaja; "
             "SEM + Šopek (1937–39) re-verified; F0000212 ≈ št. 73 = INFERRED",
    "deterministic": True,
    "method": {
        "in_repo": "ps-n83/register.json (2.871 vrstic, str. 3–143) + pua-n83/register.json (98) + "
                   "atlas-1825/house-register-1825.json (167 hiš) + atlas-1825/a01-building-inventory-1825.json (24 objektov)",
        "external": "3 artefakti v val99/ (SEM ×2 + Šopek PDF), prenešena, tu samo deterministična preverba vsebine + sha256",
        "vlm_calls": 0,
        "no_duplication": "NR-05 (negative register, val 89) NE podvajamo — ta skripta samo izčrpno potrdi "
                          "in doda sosesko 1825 + zunanje vire",
    },
    "in_repo_1825": {
        "ps_rows_total": len(ps),
        "ps_pages": f"3–143 ({len(ps_pages)} strani, polna pokritost)",
        "house_73": {
            "ps_rows": len(ps_h73),
            "pua_rows": len(pua_h73),
            "house_register": len(hr_73),
            "a01_bp_73": len(a01_73),
        },
        "neighborhood_65_80": [neigh[n] for n in sorted(neigh)],
    },
    "external_evidence": evidence,
    "chain_100": chain,
    "nr05_reference": "research-griblje/atlas-1825/negative-result-register-1825.json — NR-05 "
                      "(hiše 70–78: 73, 70, 71, 75, 77, 78 → 0 vrstic v celotnem PS; hiše 72/74/76 dokumentirane)",
    "next_steps": [
        "2. franciscejska izmera (KM ~1867–69) / eZKN: hiša št. 73 → stavbni odtis + parcela",
        "zemljiškoknjižni vpisi (nekdanje k. apl. Griblje): prenos št. 73 na Mika Županiča (~1873)",
        "SEM fototeka: fond po avtorjih Županič/Vurnik (terenska fotografija 1930) — morda foto hiše 73",
        "občinski/matricularni zapisi Griblje: hišno ime družine Županič",
        "šele potem: prostorska identifikacija (triangulacija s sosesko 1825: 72 = Wolfsloch, 74 = Tillek/Heidrich/Kauc)",
    ],
}

out = os.path.join(BASE, "issue100-house73-summary.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(summary, f, ensure_ascii=False, indent=1)

print(f"PS hiša 73        : {len(ps_h73)} vrstic (pričakovano 0)")
print(f"PUA hiša 73       : {len(pua_h73)} (pričakovano 0)")
print(f"house-register 73 : {len(hr_73)} (pričakovano 0)")
print(f"A01 BP 73         : {len(a01_73)} (pričakovano 0)")
print(f"soseska 65–80     : {', '.join(str(n) for n in sorted(neigh))}")
print(f"zunanji viri      : {', '.join(k for k, v in evidence.items() if v['quote_present'])}")
print(f"IZHOD             : {out}")
