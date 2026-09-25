#!/usr/bin/env python3
"""
Val 60 — ATLAS 1825 PASS 3 v1: Parcelni register (§4) + negative-result register (§13)
Lokalna, deterministična pretvorba obstoječih virov:
  1. parcel-register-1825.json         (§4 — PUA 2.645 referenc + PS (55/143) parcelni kandidati)
  2. negative-result-register-1825.json (§13 — dokumentirane negativne rezultate)

Pravila:
  - raba zemljišča: SAMO eksplicitno leksikalno določene kategorije; vse ostalo UNKNOWN + original
  - parcela v več hišah (417 v PUA) = so-referenca (značilnost franciscejskega katastra), NE konflikt
  - PUA in PS parcelni identifikatorji se NE združujejo (val 58 F14: namespace vprašanje odprto)
  - vsak zapis s source/page provenanco
"""
import json, re, os
from collections import Counter, defaultdict

BASE = os.path.dirname(os.path.abspath(__file__))
RG = os.path.dirname(BASE)
REPO = os.path.dirname(RG)

def load(p):
    with open(p) as f: return json.load(f)

pua = load(os.path.join(RG, "pua-n83", "register.json"))
ps = load(os.path.join(RG, "ps-n83", "register.json"))
cad = load(os.path.join(REPO, "src", "data", "cadastre-a01.json"))

# ---------------------------------------------------------------
# 0) land-use mapping (§4) — SAMO leksikalno nedvoumni termini
# ---------------------------------------------------------------
LU_EXACT = {
    "acker": "njiva",
    "wiese": "travnik", "wiesen": "travnik",
    "hutweide": "pašnik", "hutweid": "pašnik", "hütung": "pašnik",
    "wald": "gozd", "wald.": "gozd", "schindel. wald": "gozd", "schindelwald": "gozd",
    "lohholz": "gozd", "lohholz.": "gozd",
    "gartn": "vrt", "garten": "vrt", "grund garten": "vrt", "grund / garten": "vrt",
    "grund/garten": "vrt", "gartn gartn": "vrt",
    "hofraithe": "dvorišče", "hofraiten": "dvorišče",
    "reb": "vinograd", "weingarten": "vinograd",
    "gemeinde grund": "skupna zemlja",
    "hausraum": "hiša",
}
# zvezanih/mehanih ali arhaičnih terminov NE mapiramo (UNKNOWN + original)
def lu_category(kultur):
    k = re.sub(r"\s+", " ", (kultur or "").strip().lower())
    if not k: return None, None
    if k in LU_EXACT: return LU_EXACT[k], "EXACT"
    # večterminska mešanica, vse členi EXACT znani (npr. 'Wiese und Acker')
    parts = re.split(r"\s+(?:und|/|in)\s+", k)
    cats = [LU_EXACT.get(p.strip()) for p in parts if p.strip()]
    if cats and all(cats):
        uniq = set(cats)
        return ("drugo", "EXACT-MIXED") if len(uniq) > 1 else (cats[0], "EXACT")
    return "UNKNOWN", "TERM-UNCLEAR"

# ---------------------------------------------------------------
# 1) PUA parcele (§4)
# ---------------------------------------------------------------
AMB_SECTION = re.compile(r"[/.\s]|^[^IVX]+$")  # vse razen čistih rimskih I..V
pua_parcel_refs = defaultdict(set)  # (sec, num) -> houses
for e in pua:
    hn = str(e.get("house_no") or "")
    for p in (e.get("parcels") or []):
        num = str(p.get("parcel_number") or "").strip()
        if num.isdigit():
            pua_parcel_refs[(str(p.get("parcel_section") or "").strip().upper(), int(num))].add(hn)

pua_parcels = []
seen = set()
bplike_count = 0
for e in pua:
    hn = str(e.get("house_no") or "")
    for p in (e.get("parcels") or []):
        sec = str(p.get("parcel_section") or "").strip()
        num = str(p.get("parcel_number") or "").strip()
        secU = sec.upper()
        ambiguous = bool(AMB_SECTION.search(secU)) if secU else True
        num_is_digit = num.isdigit()
        if not num_is_digit and re.search(r"B\s*P|BP", num, re.I):
            bplike_count += 1  # B.P. opomba ujeta kot parcelna številka — ohrani original!
        key = (secU, num if not num_is_digit else int(num))
        if key in seen: continue
        seen.add(key)
        houses = sorted(pua_parcel_refs.get(key) or set(), key=lambda x: (not x.isdigit(), int(x) if x.isdigit() else 0))
        pua_parcels.append({
            "parcel_id": f"PUA-{secU.replace(' ', '').replace('/', '-')}-{num}".rstrip("-"),
            "section_original": sec or None,
            "parcel_number": int(num) if num_is_digit else None,
            "parcel_number_original": num,
            "parcel_number_is_bp_annotation": bool(not num_is_digit and re.search(r"B\s*P|BP", num, re.I)),
            "section_ambiguous": ambiguous,
            "house_refs": houses,
            "co_referenced": len(houses) > 1,
            "land_use_category": None,   # PUA ne vsebuje rabe
            "land_use_original": None,
            "owner_original": e.get("owner_original"),
            "source": "PUA N83",
            "page": e.get("page"),
            "entry_no": e.get("entry_no"),
            "evidence_status": e.get("review_status") or "REVIEW",
        })

# ---------------------------------------------------------------
# 2) PS parcele (partial 55/143)
# ---------------------------------------------------------------
ps_parcels = []
for r in ps:
    j = (r.get("jaethe") or "").strip().replace(" ", "")
    m = re.match(r"^(\d{1,4})$", j)
    if not m: continue
    num = int(m.group(1))
    if num > 3000:  # val 58: >3000 = sumljivi vnos (možna zmes stolpcev) -> flag, ne izključitev
        flag = "vrednost >3000 — možna zmes stolpcev (val 58 F14); needs re-read"
    else:
        flag = None
    cat, conf = lu_category(r.get("kultur"))
    hn = str(r.get("haus_no") or "").strip()
    ps_parcels.append({
        "parcel_id": f"PS-p{r['page']:03d}-j{num}",
        "jaethe_original": (r.get("jaethe") or "").strip(),
        "parcel_number": num,
        "section": None,  # Flurbezirk stolpec TO-DECODE (p002 glava)
        "house_ref": hn if hn.isdigit() else None,
        "house_ref_original": hn or None,
        "land_use_category": cat,
        "land_use_original": (r.get("kultur") or "").strip() or None,
        "land_use_mapping": conf,
        "klafter": (r.get("klafter") or "").strip() or None,
        "owner_original": (r.get("owner_original") or "").strip(),
        "source": "PS N83 (PARTIAL 55/143)",
        "page": r["page"],
        "no_blatt": r.get("no_blatt"),
        "cross_ref_to_pua": "UNKNOWN — namespace vprašanje odprto (val 58 F14)",
        "evidence_status": "SINGLE_SOURCE" + (" (flag: " + flag + ")" if flag else ""),
        "flag": flag,
    })

# ---------------------------------------------------------------
# 3) negative-result register (§13)
# ---------------------------------------------------------------
negatives = [
    {"neg_id": "NR-01", "searched": "B.P. / Zollamt sklici v PS Anmerkung stolpcu",
     "source": "PS N83", "pages": "s. 1-55 (vsi prebrani)",
     "result": "0 zadetkov",
     "why": "B.P. opombe so domena PUA/PT (parcelni protokol jih ne ponavlja)",
     "next_source": "PS s. 56-143 (ko kvota); PT/PUA ostajajo edini B.P. viri"},
    {"neg_id": "NR-02", "searched": "ujemanje PS jaethe ↔ PUA parcelnih števil (Rosetta kontrola)",
     "source": "PS (55/143) + PUA", "pages": "vse prebrane",
     "result": "6 opaženih ≈ 6,5 pričakovanih po naključju; 0 sekcija+številka",
     "why": "delna pokritost (39 % strani) + Flurbezirk stolpec ne-dekodiran (val 58 F14)",
     "next_source": "PS 143/143 + glava @300 dpi → ponovni deterministični test"},
    {"neg_id": "NR-03", "searched": "PS OCR besedilni sloj",
     "source": "vac.sjas.gov.si /vac/iiif/pdf-raw-text", "pages": "celoten PDF",
     "result": "prazen (OCR sloji neuporabni)",
     "why": "sken brez kvalitetnega OCR (LuraDocument)",
     "next_source": "brez — VLM branje je edina pot"},
    {"neg_id": "NR-04", "searched": "PUA OCR besedilni sloj",
     "source": "N083PUA.pdf (pymupdf)", "pages": "vseh 49",
     "result": "0 znakov (sloj ne obstaja)",
     "why": "isti razlog kot NR-03", "next_source": "brez — VLM branje"},
    {"neg_id": "NR-05", "searched": "hiše 73-78 v vseh virih (PUA/PS/PT/A01)",
     "source": "PUA + PS (55/143) + PT + A01", "pages": "vse prebrane",
     "result": "ne obstajajo v nobenem viru (PS vrzel 70-78 = bloki čakajo p56+)",
     "why": "delna PS pokritost; ni dokaza o obstoju ali ne-obstoju",
     "next_source": "PS s. 56-143 — odločilno"},
    {"neg_id": "NR-06", "searched": "Waldweide kot lastniški vpis (negative result val 57)",
     "source": "PUA", "pages": "vseh 49", "result": "ni lastniški vpis (samo omenjena)",
     "why": "terminološko: Waldweide = raba, ne lastnik", "next_source": "—"},
    {"neg_id": "NR-07", "searched": "foliacija PS (zaporedje listov)",
     "source": "PS N83", "pages": "s. 26 itd.",
     "result": "neusklajena (p26 nosi žig 'VI' — listi se ponavljajo po razprtjah)",
     "why": "tiskani listni žigi II/III niso zaporedni s stranmi digitalizata (val 58)",
     "next_source": "fizični pregled arhivskega zvoka (izven peskovnika)"},
    {"neg_id": "NR-08", "searched": "B.P. 222 (anomalija val 57)",
     "source": "PUA/PT/A01", "pages": "—",
     "result": "B.P. 222 izven BP 1-100 obsega vasi; pomen nejasen",
     "why": "ni dodatnega vira v peskovniku", "next_source": "obseg okoliških KG (izven peskovnika)"},
    {"neg_id": "NR-09", "searched": "Leksikon 1937 — stran vpisa (Griblje)",
     "source": "dLib", "pages": "—",
     "result": "TO_COLLECT — dLib dostop iz peskovnika blokiran",
     "why": "peskovniška omrežna omejitev (val 44)", "next_source": "ročni zajem (izven peskovnika)"},
    {"neg_id": "NR-10", "searched": "web-search korooboracija imena Zucchelli (K7)",
     "source": "web-search", "pages": "—", "result": "429 kvota (TO_COLLECT)",
     "why": "isti API kvotni limit kot VLM", "next_source": "ko se kvota resetira"},
    {"neg_id": "NR-11", "searched": "PUA↔PS lastniška soglasja ≥0.7 (AGREE hiše)",
     "source": "PS (55/143) + PUA", "pages": "vse prebrane",
     "result": "0 — strukturno (F9 različni lastniški stanji), ne bralna napaka",
     "why": "PUA = pripravljalno stanje, PS = končno; prehodi dokumentirani (pfand opombe p12)",
     "next_source": "PS 143/143: ali se AGREE pojavi kje (npr. nespremenjene hiše)"},
]

# ---------------------------------------------------------------
# izhod
# ---------------------------------------------------------------
lu_counts = Counter(p["land_use_category"] for p in ps_parcels)
lu_conf = Counter(p["land_use_mapping"] for p in ps_parcels)
co_ref = [p for p in pua_parcels if p["co_referenced"]]
provenance = {
    "pua": "pua-n83/register.json (98 vpisov / 2.645 parcelnih referenc, val 51+57)",
    "ps": "ps-n83/register.json (1.073 vrstic / 55-143 strani, val 57)",
    "land_use_mapping": "leksikalni slovar (LU_EXACT) — samo nedvoumni termini; ostalo UNKNOWN + original",
}

def write(name, obj):
    path = os.path.join(BASE, name)
    with open(path, "w") as f:
        json.dump(obj, f, indent=1, ensure_ascii=False)
    print(f"{name}: {os.path.getsize(path)} B")

write("parcel-register-1825.json", {
    "val": "60", "pass": 3, "issue": "#42 §4",
    "title": "PARCEL REGISTER 1825 — v1: PUA reference + PS kandidati (ločeni, ne-združeni)",
    "method": {
        "rules": [
            "PUA in PS parcelni identifikatorji se NE združujejo (F14 namespace odprt)",
            "so-referenca parcele v >1 hiši = značilnost katastra (so-vlasništvo), NE konflikt",
            "raba: samo EXACT leksikalno mapiranje; vse drugo UNKNOWN + original + mapping flag",
            "PS jaethe >3000 = flag (možna zmes stolpcev), ne izključitev",
        ],
        "land_use_exact_lexicon": LU_EXACT,
    },
    "provenance": provenance,
    "pua_parcels_total": len(pua_parcels),
    "pua_co_referenced": len(co_ref),
    "ps_parcels_total": len(ps_parcels),
    "ps_land_use_coverage": dict(lu_counts),
    "ps_land_use_mapping_confidence": dict(lu_conf),
    "pua_parcels": pua_parcels,
    "ps_parcels": ps_parcels,
})

write("negative-result-register-1825.json", {
    "val": "60", "pass": 3, "issue": "#42 §13",
    "title": "NEGATIVE-RESULT REGISTER 1825 — kaj je iskano in zakaj ni bilo mogoče potrditi",
    "provenance": provenance,
    "negatives_total": len(negatives),
    "negatives": negatives,
})

print()
print("PUA parcele:", len(pua_parcels), "| so-referencirane:", len(co_ref))
print("PS parcele :", len(ps_parcels), "| land_use:", dict(lu_counts))
print("mapiranje  :", dict(lu_conf))
print("Negativni  :", len(negatives))
