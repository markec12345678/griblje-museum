#!/usr/bin/env python3
"""
Val 122 — HIŠA 70–78: LOČENA ODLOČITEV (protokol 144 §6.1 / 143 §6.3) — issue #42 §4/§14.

Kontekst:
  - NR-05 (negative register, val 60): hiše 73–78 "ne obstajajo v nobenem viru" —
    takrat je PS pokrivala le p3–p55.
  - Val 89 re-check (143/143): 72 → p65 (2), 74 → p65/69/122 (4), 76 → p115 (1)
    dokumentirane v PROVISIONAL plasti (v86-colonial-tiles); 70/71/73/75/77/78 →
    0 vrstic. Negativ takrat samo "DELO OSVEŽENO" — uveljavitev odložena.
  - Val 119 del 3 (F-SYNC-04): osebna sinhronizacija izključuje p56–143;
    "hiše 70–78 imajo v PROVISIONAL plasti opažene h72/74/76, dokumentirano,
    ne uveljavljeno."
  - Val 120 (protokol 143 §6.3) + val 121 (protokol 144 §6.1): odločitev
    sistematično odložena kot "ločena odločitev" → TA val jo izvede.

Odločitev (val 122, deterministično, 0 VLM, add-only):
  1. H-074, H-076: NOVA vnosa v house-register (dokaz izključno PS p56–143,
     reading_pass v86-colonial-tiles = PROVISIONAL plast, F-PV-04/NR-14).
     Posledica: KG HAS_PARCEL vezi za PS parceli h74 (PS-p065-j1, PS-p069-j1)
     nastanejo — tiha vrzel val 89–121 (KG builder tiho `continue` pri manjkajoči
     hiši) je odpravljena.
  2. H-072: owners.ps vgrajen (2 vrstici p65, Wolfsloch Wolfgey, Acker) z
     izrecno layer=PROVISIONAL oznako. Imenska napetost PUA (Strauß Khonrad,
     VERIFIED-2x) vs PS (Wolfsloch Wolfgey) ostaja NE razrešena (§4) — metoda B
     sim se NE izračuna (ta je definirana samo nad p3–p55 kvalitetno plastjo).
  3. H-070, H-071: zastarela opomba ("PS blok čaka p56–p143") zamenjana z
     odločilnim negativom (celoten PS 2875 vrstic, 0 zadetkov) + ps_absence dokaz.
  4. NR-05: val122_decision — negativ za [70,71,73,75,77,78] ODLOČILEN
     (celotna pokritost, ne več "delna PS pokritost"); [72,74,76] dokumentirani
     (križni sklic na house register vnose).
  5. Osebna plast (person-owner-register) NESPREMENJENA — F-SYNC-04 ostaja:
     PROVISIONAL lastniška imena (Wolfsloch Wolfgey, Tillek Wolfgey, Heidrich
     Peter, Kauc Miheljz, Gritsch Mihlo) NE vstopajo v osebni register in NE
     ustvarjajo PERSON vozlišč niti OWNER_OF vezij (samo owners.ps blok hiše).

Varovalke (fail-fast — §4: brez ugibanja):
  - izhodiščno stanje: houses_total 167, H-074/H-076 ne obstajata;
  - PS register: 2875 vrstic; h70–h78: točno 0 vrstic v p3–p55 (kvalitetna
    plast val 119 NEDOTAKNJENA); h72/74/76 točno 2/4/1 vrstici v p56–143 z
    pričakovanimi stranmi, imeni in reading_pass;
  - parcelni register: h74 točno 2 PS parceli (PS-p065-j1, PS-p069-j1);
    h72/h76: 0 parcel (F-PV-05: prazna jaethe ni parcela);
  - idempotenca: ponovni zagon zazna vgrajeno stanje in ne podvaja.

Izhodi: house-register-1825.json + negative-result-register-1825.json (in-place,
z .bak ni več — git je vir zgodovine).
"""
import json
import os
import sys
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
RG = os.path.dirname(BASE)


def load(p):
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def fail(msg):
    print(f"FAIL-FAST: {msg}", file=sys.stderr)
    sys.exit(1)


HOUSE_REG = os.path.join(BASE, "house-register-1825.json")
NEG_REG = os.path.join(BASE, "negative-result-register-1825.json")
PS_REG = os.path.join(RG, "ps-n83", "register.json")
PARCEL_REG = os.path.join(BASE, "parcel-register-1825.json")

reg = load(HOUSE_REG)
neg = load(NEG_REG)
ps_rows = load(PS_REG)
parcels = load(PARCEL_REG)

# ---------------------------------------------------------------- varovalke
if reg.get("houses_total") != len(reg["houses"]):
    fail(f"houses_total {reg['houses_total']} != houses[{len(reg['houses'])}]")

ids = [h["house_id"] for h in reg["houses"]]
nos = {str(h["house_no_1825"]) for h in reg["houses"]}
# pre-obstoječe podvojeni ID-ji (val 119 del 3: "1 / N" in "1/N" notaciji oba
# normalizirana v H-1-N; 13 parov) — izven dosega vala 122, samo števcna varovalka
dup_pairs = len(ids) - len(set(ids))
if dup_pairs != 13:
    fail(f"pričakovano 13 pre-obstoječih podvojenih house_id (H-1-* notacijski pari), "
         f"dejansko {dup_pairs} — stanje registra se je spremenilo, preveri pred vgradnjo")
if "H-074" in ids or "H-076" in ids:
    print("IDEMPOTENCA: H-074/H-076 že obstajata — nič ne delam.")
    sys.exit(0)
if "74" in nos or "76" in nos:
    fail("house_no 74/76 že obstaja brez pričakovanih H-074/H-076 ID-jev")
if reg["houses_total"] != 167:
    fail(f"pričakovano izhodišče 167 hiš, dejansko {reg['houses_total']}")

if len(ps_rows) != 2875:
    fail(f"PS register {len(ps_rows)} vrstic != 2875")

# h70–h78 v PS: ločeno po plasteh
LAYERS_P355 = {"v119-names", "v112-ps-reread", "v114", "v115", "v82-native-pass1"}
by_house = {str(n): [] for n in range(70, 79)}
for r in ps_rows:
    hn = str(r.get("haus_no") or "").strip()
    if hn in by_house:
        by_house[hn].append(r)

for hn, rows in by_house.items():
    q = [r for r in rows if r.get("reading_pass") in LAYERS_P355]
    if q:
        fail(f"h{hn}: {len(q)} vrstic v p3–p55 kvalitetni plasti — pričakovano 0 "
             "(kvalitetna plast val 120/121 mora ostati nedotaknjena)")

exp = {
    "72": {"pages": [65, 65], "owners": ["Wolfsloch Wolfgey", "Wolfsloch Wolfgey"]},
    "74": {"pages": [65, 65, 69, 122], "owners": ["Tillek Wolfgey", "Tillek Wolfgey", "Heidrich Peter", "Kauc Miheljz"]},
    "76": {"pages": [115], "owners": ["Gritsch Mihlo"]},
}
for hn in ("70", "71", "73", "75", "77", "78"):
    if by_house[hn]:
        fail(f"h{hn}: pričakovano 0 vrstic, najdenih {len(by_house[hn])} "
             f"({[(r['page'], r.get('owner_original')) for r in by_house[hn]]})")
for hn, e in exp.items():
    rows = by_house[hn]
    if len(rows) != len(e["pages"]):
        fail(f"h{hn}: {len(rows)} vrstic != pričakovanih {len(e['pages'])}")
    for r, pg, ow in zip(rows, e["pages"], e["owners"]):
        if r["page"] != pg or r.get("owner_original") != ow:
            fail(f"h{hn}: vrstica (p{r['page']}, {r.get('owner_original')!r}) "
                 f"!= pričakovana (p{pg}, {ow!r})")
        if r.get("reading_pass") != "v86-colonial-tiles":
            fail(f"h{hn}: reading_pass {r.get('reading_pass')!r} != 'v86-colonial-tiles'")

# parcelne posledice
ps_parcels_by_house = Counter(str(p.get("house_ref")) for p in parcels["ps_parcels"])
if ps_parcels_by_house["74"] != 2:
    fail(f"h74: {ps_parcels_by_house['74']} PS parcel != 2")
h74_ids = sorted(p["parcel_id"] for p in parcels["ps_parcels"] if str(p.get("house_ref")) == "74")
if h74_ids != ["PS-p065-j1", "PS-p069-j1"]:
    fail(f"h74 parceli {h74_ids} != [PS-p065-j1, PS-p069-j1]")
for hn in ("72", "76"):
    if ps_parcels_by_house[hn] != 0:
        fail(f"h{hn}: {ps_parcels_by_house[hn]} PS parcel != 0 (F-PV-05)")

# ---------------------------------------------------------------- h72 owners.ps
h72 = next(h for h in reg["houses"] if h["house_id"] == "H-072")
if h72["owners"].get("ps") is not None:
    fail("H-072 owners.ps že napolnjen — ne-idempotentno stanje")
h72["owners"]["ps"] = {
    "owner_original": "Wolfsloch Wolfgey",
    "stand": None,
    "pages": [65],
    "rows": 2,
    "coverage": "PROVISIONAL plast (vse vrstice p56–143; v86-colonial-tiles — F-PV-04/NR-14; val 122 uveljavitev)",
    "layer": "PROVISIONAL",
}
h72["owners"]["ps_distinct"] = [
    {"name": "Wolfsloch Wolfgey", "pages": [65], "rows": 2}
]
h72["parcel_refs"]["ps_rows"] = 2
h72["parcel_refs"]["ps_kultur"] = {"Acker": 2}
h72["notes"] = (
    "val 122 (ločena odločitev, protokol 145): owners.ps vgrajen iz PROVISIONAL "
    "plasti (2 vrstici p65, Wolfsloch Wolfgey, Acker; v86-colonial-tiles). Imenska "
    "napetost PUA (Strauß Khonrad bauer zu Grübln, VERIFIED-2x) vs PS (Wolfsloch "
    "Wolfgey) NI razrešena (§4) — metoda B sim se NE izračuna (definirana samo nad "
    "p3–p55; pua_ps_name_sim polja ostanejo null iz kontinuitete). Stara opomba "
    "'PS blok te hiše čaka p56–p143' zamenjana (PS prebran 143/143 od val 82). "
    "Osebna plast NESPREMENJENA (F-SYNC-04)."
)

# ---------------------------------------------------------------- H-074, H-076
def ps_block(owner_first, pages, rows_total, distinct, kultur_counter):
    ps = {
        "owner_original": owner_first,
        "stand": None,
        "pages": sorted(set(pages)),
        "rows": rows_total,
        "coverage": "PROVISIONAL plast (vse vrstice p56–143; v86-colonial-tiles — F-PV-04/NR-14; val 122 uveljavitev)",
        "layer": "PROVISIONAL",
    }
    # ps_distinct je sosed ps v owners (shema H-080, val 119 del 3)
    owners_extra = {"ps_distinct": distinct}
    return ps, owners_extra, kultur_counter


h74_ps, h74_distinct, h74_kultur = ps_block(
    "Tillek Wolfgey", [65, 65, 69, 122], 4,
    [
        {"name": "Tillek Wolfgey", "pages": [65], "rows": 2},
        {"name": "Heidrich Peter", "pages": [69], "rows": 1},
        {"name": "Kauc Miheljz", "pages": [122], "rows": 1},
    ],
    {"Acker": 3},
)
h76_ps, h76_distinct, h76_kultur = ps_block(
    "Gritsch Mihlo", [115], 1,
    [{"name": "Gritsch Mihlo", "pages": [115], "rows": 1}],
    {},
)

h74 = {
    "house_id": "H-074",
    "house_no_1825": "74",
    "house_no_type": "gruble_house",
    "evidence_status": "SINGLE_SOURCE",
    "owners": {
        "pua": None,
        "ps": h74_ps,
        "ps_distinct": h74_distinct["ps_distinct"],
        "pt": None,
        "a01": None,
    },
    "pua_ps_name_sim": None,
    "bp_refs": [],
    "parcel_refs": {
        "pua_parcels_total": 0,
        "ps_rows": 4,
        "ps_kultur": h74_kultur,
    },
    "conflict_ids": [],
    "notes": (
        "val 122 (ločena odločitev, protokol 145): NOV vnos — hiša 74 dokumentirana "
        "izključno v PS PROVISIONAL plasti (4 vrstice: p65 ×2 Tillek Wolfgey, p69 "
        "Heidrich Peter, p122 Kauc Miheljz; v86-colonial-tiles). NR-05 negativ za 74 "
        "ZAPRT — val 60 'ne obstaja v nobenem viru' je odražalo le pokritost p3–p55. "
        "2 PS parceli (PS-p065-j1, PS-p069-j1) → KG HAS_PARCEL vezi sedaj nastanejo "
        "(tiha vrzel KG builderja val 89–121: `continue` pri manjkajoči hiši — "
        "odpravljena). Imena različna med stranmi (sukcesija/so-živeči, PROVISIONAL). "
        "Osebna plast NESPREMENJENA (F-SYNC-04)."
    ),
}
h76 = {
    "house_id": "H-076",
    "house_no_1825": "76",
    "house_no_type": "gruble_house",
    "evidence_status": "SINGLE_SOURCE",
    "owners": {
        "pua": None,
        "ps": h76_ps,
        "ps_distinct": h76_distinct["ps_distinct"],
        "pt": None,
        "a01": None,
    },
    "pua_ps_name_sim": None,
    "bp_refs": [],
    "parcel_refs": {
        "pua_parcels_total": 0,
        "ps_rows": 1,
        "ps_kultur": h76_kultur,
    },
    "conflict_ids": [],
    "notes": (
        "val 122 (ločena odločitev, protokol 145): NOV vnos — hiša 76 dokumentirana "
        "izključno v PS PROVISIONAL plasti (1 vrstica p115, Gritsch Mihlo, brez "
        "kultur/jaethe/klafter — vrstica hišne oznake; v86-colonial-tiles). NR-05 "
        "negativ za 76 ZAPRT (razlog kot pri 74). 0 PS parcel (F-PV-05). Osebna "
        "plast NESPREMENJENA (F-SYNC-04)."
    ),
}

# vstavi po numeričnem vrstnem redu house_no (med 72 in 79)
idx_72 = next(i for i, h in enumerate(reg["houses"]) if h["house_id"] == "H-072")
reg["houses"][idx_72 + 1:idx_72 + 1] = [h74, h76]
reg["houses_total"] = 169

# ---------------------------------------------------------------- h70, h71
absence = {
    "rows": 0,
    "pages_covered": "p3–p143 (2.875 vrstic, 143/143 strani)",
    "verdict": "NEGATIVE-DECISIVE",
    "val": 122,
    "note": "celotna pokritost PS (od val 82) + re-readi val 108–121; do val 121 odloženo kot 'delna pokritost'",
}
for hid, pua_desc in (
    ("H-070", "Zollamt b. H. Neuradl in Gröbln (PUA p47 e95)"),
    ("H-071", "Stauger Matho Bauersleibgäbler [?] (PUA p42 e86, REVIEW)"),
):
    h = next(x for x in reg["houses"] if x["house_id"] == hid)
    if h["owners"].get("ps") is not None or "ps_absence" in h:
        fail(f"{hid}: ps/ps_absence že napolnjena — ne-idempotentno stanje")
    h["ps_absence"] = dict(absence)
    h["notes"] = (
        f"val 122 (protokol 145): PS p3–p143 ponovno pregledan (2.875 vrstic) — 0 vrstic "
        f"z haus_no {h['house_no_1825']} → negativ ZDAJ ODLOČILEN (celotna pokritost; do val 121 "
        f"samo delna). PUA ostaja edini vir ({pua_desc}). Stara opomba 'PS blok te hiše "
        f"čaka p56–p143' zamenjana (PS prebran 143/143 od val 82; BRALSKI zdrsi so bile "
        f"remapirane v val 120, vrednosti v val 121)."
    )

# ---------------------------------------------------------------- NR-05
nr05 = next(n for n in neg["negatives"] if n.get("neg_id") == "NR-05")
if "val122_decision" in nr05:
    fail("NR-05 val122_decision že obstaja — ne-idempotentno stanje")
nr05["val122_decision"] = {
    "val": 122,
    "protocol": "research-griblje/145-val122-hisa-70-78-odlocitev.md",
    "negative_final": ["70", "71", "73", "75", "77", "78"],
    "negative_basis": (
        "celotna pokritost PS (143/143, 2.875 vrstic) + PUA + PT + A01; 0 vrstic; "
        "nadgradi val 89 'DELO OSVEŽENO' (takrat še 'delna PS pokritost') na ODLOČILEN"
    ),
    "documented_provisional": {
        "72": "H-072 owners.ps (2 vrstici p65, Wolfsloch Wolfgey) — PROVISIONAL",
        "74": "H-074 NOV vnos (4 vrstice p65/69/122) — PROVISIONAL",
        "76": "H-076 NOV vnos (1 vrstica p115, Gritsch Mihlo) — PROVISIONAL",
    },
    "house_register": "houses_total 167 → 169 (H-074, H-076; H-072 owners.ps; H-070/H-071 ps_absence)",
    "osebna_plast": "NESPREMENJENA (F-SYNC-04: PROVISIONAL lastniki ne vstopajo v person-owner-register)",
    "sospored": (
        "hiša 73: negativ potrjen tudi z val 99 (issue #100 — F0000212 ≈ št. 73 = "
        "INFERRED; SEM + Šopek 1937–39 re-verified)"
    ),
}

with open(HOUSE_REG, "w", encoding="utf-8") as f:
    json.dump(reg, f, ensure_ascii=False, indent=1)
with open(NEG_REG, "w", encoding="utf-8") as f:
    json.dump(neg, f, ensure_ascii=False, indent=1)

# ---------------------------------------------------------------- povzetek
st = Counter(h["evidence_status"] for h in reg["houses"])
print("OK — val 122 uveljavitev:")
print(f"  houses_total: 167 → {reg['houses_total']}")
print(f"  evidence_status: {dict(st)}")
print(f"  H-074 parceli: {h74_ids}")
print(f"  NR-05: val122_decision zapisan (negativ odločilen za 6, dokumentirano 3)")
