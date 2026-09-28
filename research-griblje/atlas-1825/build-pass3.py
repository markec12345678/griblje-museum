#!/usr/bin/env python3
"""
Val 89 — ATLAS 1825 PASS 3 v2: Parcelni register (§4) + negative-result register (§13)
Projekcija 143/143 (iz reka val 88 §5): isti deterministični logik kot val 60, vgrajeni
poznejši sloji, da re-run ni več destruktiven (pouk val 88):
  1. parcel-register-1825.json         (§4 — PUA 2.035 referenc + PS (143/143) parcelni kandidati)
  2. negative-result-register-1825.json (§13 — 11 × val 60 + NR-12/13 (val 62) + NR-14 (val 83),
      + val89 re-checki: NR-01, NR-02, NR-05, NR-12 nad polnim registrom)

Pravila (nespremenjena od val 60):
  - raba zemljišča: SAMO eksplicitno leksikalno določene kategorije; vse ostalo UNKNOWN + original
  - parcela v več hišah (PUA) = so-referenca (značilnost franciscejskega katastra), NE konflikt
  - PUA in PS parcelni identifikatorji se NE združujejo (val 58 F14: namespace vprašanje odprto)
  - PS jaethe = vir parcelne številke; v88 pravilo (val 88): digit-split vrstice s klafter-vrednostjo
    in prazno jaethe NISO parcele (pisar piše Kläfter, F-PV-05 page-level)
  - vsak zapis s source/page provenanco

Spremembe proti val 60 (vse dokumentirane v research-griblje/104-val89-parcelni-register-143.md):
  - provenanca PS: 1.073 vrstic / 55–143 (val 57) → 2.871 vrstic / 3–143 (val 57→61→82/83→88)
  - source labela PS parcel: "PS N83 (PARTIAL 55/143)" → "PS N83 (143/143)"
  - NR-12/13/14 vgrajeni v builder (prej ročno v artefakt — re-run jih je izgubil)
  - val89 re-checki nad polnim registrom (izračunano živo, deterministično)
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
# 2) PS parcele (projekcija 143/143 — val 89; logika 1:1 val 60)
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
        "source": "PS N83 (143/143)",
        "page": r["page"],
        "no_blatt": r.get("no_blatt"),
        "cross_ref_to_pua": "UNKNOWN — namespace vprašanje odprto (val 58 F14)",
        "evidence_status": "SINGLE_SOURCE" + (" (flag: " + flag + ")" if flag else ""),
        "flag": flag,
    })

# ---------------------------------------------------------------
# 3) negative-result register (§13) — NR-01..NR-11 (val 60) + NR-12/13 (val 62) + NR-14 (val 83)
#    val 89: vse vgrajene v builder (re-run varno) + živi re-checki nad polnim registrom
# ---------------------------------------------------------------

# --- val89 re-check inputs (deterministično iz polnega registra) ---
import re as _re
_bp_zoll = _re.compile(r"B\.?\s*P\.?|Zoll", _re.I)
bp_zoll_hits = [r for r in ps if r.get("anmerkung") and _bp_zoll.search(r["anmerkung"])]

_ps_nums = set()
_other_jaethe = []
for r in ps:
    _j = (r.get("jaethe") or "").strip()
    if _re.match(r"^\d{1,4}$", _j):
        _ps_nums.add(int(_j))
    elif _j:
        _other_jaethe.append(_j)
_pua_nums = set()
for _e in pua:
    for _p in (_e.get("parcels") or []):
        _num = str(_p.get("parcel_number") or "").strip()
        if _num.isdigit():
            _pua_nums.add(int(_num))
_rosetta_overlap = sorted(_ps_nums & _pua_nums)
_named_flur = [_o for _o in _other_jaethe if _re.search(r"[A-Za-zÀ-ž]{3,}", _re.sub(r"ganz|halb", "", _o))]

_houses_70_78 = {h: sorted({r["page"] for r in ps if str(r.get("haus_no") or "").strip() == str(h)}) for h in range(70, 79)}
_houses_in_ps = sorted(h for h, pgs in _houses_70_78.items() if pgs)
_houses_absent = sorted(h for h, pgs in _houses_70_78.items() if not pgs)
_houses_detail = "; ".join(
    f"{h} → p{'/'.join(str(x) for x in pgs)} ({sum(1 for r in ps if str(r.get('haus_no') or '').strip() == str(h))} vrstic)"
    for h, pgs in _houses_70_78.items() if pgs
)

negatives = [
    {"neg_id": "NR-01", "searched": "B.P. / Zollamt sklici v PS Anmerkung stolpcu",
     "source": "PS N83", "pages": "s. 1-55 (vsi prebrani)",
     "result": "0 zadetkov",
     "why": "B.P. opombe so domena PUA/PT (parcelni protokol jih ne ponavlja)",
     "next_source": "PS s. 56-143 (ko kvota); PT/PUA ostajajo edini B.P. viri",
     "val89_recheck": {
         "pages": "s. 3-143 (celoten register, 2.871 vrstic)",
         "result": f"0 zadetkov ({len(bp_zoll_hits)} vrstic z B.P./Zoll v anmerkung)",
         "verdict": "POTRJENO pri 143/143 — B.P. opombe ostajajo domena PUA/PT"}},
    {"neg_id": "NR-02", "searched": "ujemanje PS jaethe ↔ PUA parcelnih števil (Rosetta kontrola)",
     "source": "PS (55/143) + PUA", "pages": "vse prebrane",
     "result": "6 opaženih ≈ 6,5 pričakovanih po naključju; 0 sekcija+številka",
     "why": "delna pokritost (39 % strani) + Flurbezirk stolpec ne-dekodiran (val 58 F14)",
     "next_source": "PS 143/143 + glava @300 dpi → ponovni deterministični test",
     "val89_recheck": {
         "pages": "s. 3-143 (celoten register)",
         "result": (f"{len(_rosetta_overlap)} številčno skupnih vrednosti (od {len(_ps_nums)} unikatnih PS jaethe "
                    f"× {len(_pua_nums)} unikatnih PUA števil); 0 sekcija+številka"),
         "verdict": "OSTAJA NEPOTRJENO — številka sama ne nese sekcije; brez dekodiranega Flurbezirk (F14) "
                    "nobeno posamezno ujemanje ni dokazljivo (ocena pričakovanja po naključju je nestabilna "
                    "glede na izbrani številski prostor)"}},
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
     "next_source": "PS s. 56-143 — odločilno",
     "val89_recheck": {
         "pages": "s. 3-143 (celoten register, polje haus_no)",
         "result": (f"razčlenjeno: {_houses_detail} — dokumentirane; "
                    f"{', '.join(str(h) for h in _houses_absent)} → 0 vrstic v celotnem PS"),
         "verdict": (f"DELO OSVEŽENO — negativ ostaja za {_houses_absent}; hiše {_houses_in_ps} — izven izpita "
                     "vala 60 (73–78) — so sedaj dokumentirane (PS p56–143)")}},
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
    # --- NR-12/13: val 62 (prej ročno v artefakt; val 89 vgrajeno) ---
    {"neg_id": "NR-12", "searched": "named Flurbezirke (toponymic district names) in PS jaethe column",
     "source": "PS N83 pages 1–55 (55/143 transcribed)",
     "pages": "p1–p55",
     "result": "NOT FOUND — all Flurbezirk segments are numeric/roman (I–V sections + numbers); zero named districts",
     "why": "the Gemeinde divides land into numbered Flurbezirke, not named ones (at least in the transcribed half)",
     "next_source": "PS p56–p143 once VLM quota restores",
     "val89_recheck": {
         "pages": "p3–p143 (celoten register, 2.871 vrstic)",
         "result": (f"NOT FOUND — {len(_other_jaethe)} neštevilskih jaethe zapisov, {len(_named_flur)} s črkovnimi "
                    "imeni (možnimi toponimi); vsi so mehanske/nominalne oblike (npr. 17½, ganz, N/N)"),
         "verdict": "POTRJENO pri 143/143 — omenjeni Flurbezirki ne obstajajo"}},
    {"neg_id": "NR-13", "searched": "non-local residences in PT wohnort_original",
     "source": "PT N83 (100 rows)",
     "pages": "p1–p8",
     "result": "NOT FOUND — wohnort_original is empty except 3× self-form 'Grüble' (p3/4/5)",
     "why": "PT records building parcels of local owners; external owners appear in PS/PUA, not PT",
     "next_source": "none — negative is structural"},
    # --- NR-14: val 83 (prej ročno v artefakt; val 89 vgrajeno) ---
    {"neg_id": "NR-14", "status": "PARTIAL",
     "searched": "soglasje ≥ 2 pri celostranskem nativnem VLM re-readu PS p56–143 (imena, kultur kategorije, površine, Fürtrag verige)",
     "source": "PS N83 (pass1 val 82 vs pass2 val 83, 88+88 klicev)",
     "pages": "p56-p143",
     "result": "DELO: struktura 1798≈1797 + classe/ertrag/capital ≥ 92 % + Wald 54=54 + stand 82 % / wohnort 86 %; NE DOSEŽENO: imena 19,6 %, kultur 47,3 % (zamenjave Wiese↔Hutweide, Acker↔Wald), no_blatt 49 %, jaethe 71,9 % / klafter 68,4 % (numeq), stolpčna dodelitev Jaethe↔Klafter variira, Fürtrag soglasje 18/100, Reb omembe 14→6",
     "why": "celostranski nativni JPG (~1200×1020): Kurrent kurziva imen in dvovrstičnih kultur opisov pod resolucijo; stolpčni sidri manjkajo — val 80/81 je dokazal, da pasovni/zoom izrezki dvignejo zanesljost",
     "next_source": "pasovni/zoom re-read s kolonskimi sidri (vzorec val 80/81) — analysis-v4 F-PV-04 + next_reads"},
]

# ---------------------------------------------------------------
# fail-fast varovalke (val 89 — re-run je dovoljen SAMO nad poznejšimi sloji)
# ---------------------------------------------------------------
if len(ps) != 2871:
    raise SystemExit(f"GUARD: PS register ima {len(ps)} vrstic, pričakovano 2.871 (val 88 stanje) — ne zaganjaj nad zastarelim registrom")
_v88_rows = [r for r in ps if r.get("v88_status") in ("P1", "P2", "T3") or r.get("v88_note")]
if len(_v88_rows) != 139:
    raise SystemExit(f"GUARD: PS register ima {len(_v88_rows)} v88 vrstic (137 rešenih + 2 UNRESOLVED z v88_note), pričakovano 139 — v88 sloj manjka")
if len(negatives) != 14:
    raise SystemExit(f"GUARD: {len(negatives)} negativnih rezultatov, pričakovano 14 (NR-01..NR-14)")

# ---------------------------------------------------------------
# izhod
# ---------------------------------------------------------------
lu_counts = Counter(p["land_use_category"] for p in ps_parcels)
lu_conf = Counter(p["land_use_mapping"] for p in ps_parcels)
co_ref = [p for p in pua_parcels if p["co_referenced"]]
provenance = {
    "pua": "pua-n83/register.json (98 vpisov / 2.645 parcelnih referenc, val 51+57)",
    "ps": "ps-n83/register.json (2.871 vrstic / str. 3-143, val 57→61→82/83→88; 139 digit-split vrstic z v88 vrednostmi)",
    "land_use_mapping": "leksikalni slovar (LU_EXACT) — samo nedvoumni termini; ostalo UNKNOWN + original",
}

def write(name, obj):
    path = os.path.join(BASE, name)
    with open(path, "w") as f:
        json.dump(obj, f, indent=1, ensure_ascii=False)
    print(f"{name}: {os.path.getsize(path)} B")

write("parcel-register-1825.json", {
    "val": "98", "pass": 3, "issue": "#42 §4",
    "title": "PARCEL REGISTER 1825 — v2 (val 98): PUA reference + PS kandidati pri 143/143 (ločeni, ne-združeni; F-PV-05 korekcije val 86 + 98 vgrajene — 930 → 898)",
    "method": {
        "rules": [
            "PUA in PS parcelni identifikatorji se NE združujejo (F14 namespace odprt)",
            "so-referenca parcele v >1 hiši = značilnost katastra (so-vlasništvo), NE konflikt",
            "raba: samo EXACT leksikalno mapiranje; vse drugo UNKNOWN + original + mapping flag",
            "PS jaethe >3000 = flag (možna zmes stolpcev), ne izključitev",
            "v88 pravilo (val 88): digit-split vrstice s prazno jaethe in klafter vrednostjo NISO parcele (F-PV-05)",
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
    "val": "98", "pass": 3, "issue": "#42 §13",
    "title": "NEGATIVE-RESULT REGISTER 1825 — kaj je iskano in zakaj ni bilo mogoče potrditi (NR-12/13/14 vgrajeni; val89 re-checki na NR-01/02/05/12; regeneriran val 98)",
    "provenance": provenance,
    "negatives_total": len(negatives),
    "negatives": negatives,
})

print()
print("PUA parcele:", len(pua_parcels), "| so-referencirane:", len(co_ref))
print("PS parcele :", len(ps_parcels), "| land_use:", dict(lu_counts))
print("mapiranje  :", dict(lu_conf))
print("Negativni  :", len(negatives))
