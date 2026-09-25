#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Val 62 — ATLAS 1825 §12: TOponimni register v1 (issue #42 output #7: toponym-register-1825)

Deterministic + idempotent. Regenerable at any time from:

  FIELD-LEVEL (row-verified transcriptions, highest confidence):
    - pua-n83/register.json   residence_original  (val 51, 98 entries)
    - ps-n83/register.json    wohnort             (vals 57/61, 1073 rows)
    - pt-n83/register.json    wohnort_original    (val 53, 100 rows)
  NARRATIVE (single VLM pass over 4 PDF pages, semantic organization — PROVISIONAL):
    - raw-web-val42-2026-10/vlm-pr.json  PR = Grenz-Beschreibung der Gemeinde "GRÜBLE"
    - raw-web-val42-2026-10/vlm-pg.json  PG = overview sketch map labels
  PRINTED (typeset titles — VERIFIED_FORM):
    - PT/PR/PS/PUA/PV title pages + A01 legend "Gemeinde GRÜBLE in Illyrien"
  MULTI-PASS (×3 consistent readings, first word UNRESOLVED):
    - A05 map label "Schumsthl/Schamsho/Schimstl Traverne" (val 42/43 Q5)

RULES (issue #42 + user directive 09:01 "KLJUČNO RAZUMEVANJE PROJEKTA"):
  - NO modern mapping without repo-documented evidence -> modern_mapping = "UNKNOWN"
  - similar forms across sources are recorded as possible_matches, decision NOT_MERGED
  - the self-forms of the Gemeinde (GRÜBLE/Grübln/Gruble/Grable/...) are ONE entry:
    the merge is justified by DOCUMENT IDENTITY (every form occurs in a document
    belonging to k.o. N83 Griblje), NOT by name similarity; each form keeps its
    full source list
  - UNKNOWN / NOT FOUND / CONFLICT stay distinct (issue #43 §5)
  - every entry carries what_would_resolve
"""

import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
RG = os.path.dirname(BASE)
REPO = os.path.dirname(RG)

PUA = os.path.join(RG, "pua-n83", "register.json")
PS = os.path.join(RG, "ps-n83", "register.json")
PT = os.path.join(RG, "pt-n83", "register.json")
NEG = os.path.join(BASE, "negative-result-register-1825.json")
OUT = os.path.join(BASE, "toponym-register-1825.json")

SELF_FORMS = {
    "GRÜBLE": "printed",
    "Grüble": "handwritten",
    "Grübln": "handwritten",
    "Grublh.": "handwritten",
    "Gruble": "handwritten",
    "Grable": "handwritten",
}

# PR/PG narrative toponyms: curated extraction from single VLM passes.
# page = PDF page of the 4-page (PR) / 1-page (PG) document; context preserved
# as read by VLM in val 42. These constants are NOT free invention: each row
# points at the exact VLM artifact that contains the reading.
PR_NARRATIVE = [
    # -- neighboring Gemeinden (PR p2, p3) -----------------------------------
    ("Weichselberg", "neighbor_gemeinde", "PR p2+p3: Grenzversteher/commissioners 'von der Gemeinde Weichselberg' ×2"),
    ("Hochsteg", "neighbor_gemeinde", "PR p2: Gemeinde name; p2/p3 also used as boundary point/terrain term"),
    ("Schönbach", "neighbor_gemeinde", "PR p2+p3: neighboring Gemeinde, representatives ×2"),
    ("Stadelbach", "neighbor_gemeinde", "PR p2+p3: neighboring Gemeinde, Grenzversteher"),
    ("Dolga vas", "neighbor_gemeinde", "PR p2+p3+p4: neighboring Gemeinde, German form 'Dollwitz' ×3"),
    ("Črnomelj", "neighbor_gemeinde", "PR p3: 'Občina Črnomelj (Tschernomelj) ali njena okolica' — VLM itself hedged the scope"),
    # -- watercourses (PR p2, p3) --------------------------------------------
    ("Lahinja", "watercourse", "PR p2: stream, German reading 'Lainizza'"),
    ("Dolina", "watercourse", "PR p2: stream, German reading 'Duliza'"),
    ("Radešica", "watercourse", "PR p2: stream, German readings 'Radessitza/Radischitz'"),
    ("Bistrica", "watercourse", "PR p2+p3: stream, German readings 'Wistritz/Wistrizza'; mill 'Mlin Bistrica' on its course"),
    ("Sušica", "watercourse", "PR p2+p3: stream, German readings 'Schuschitz/Schuschniza'; mill 'Mlin Sušica'"),
    ("Mlinščica", "watercourse", "PR p2+p3: stream, German readings 'Mlinzschiza/Mlinshiza'"),
    # -- hills / terrain points (PR p2, p3) -----------------------------------
    ("Grübler Berg", "hill", "PR p2+p3: hill, Slovene gloss 'Gribljski hrib' in VLM reading"),
    ("Hoher Stein", "hill", "PR p2: hill/rock point; also cited as grenzpunkt description"),
    ("Steinberg", "hill", "PR p2: hill"),
    ("Kapellen-Berg", "hill", "PR p2+p3: hill, Slovene gloss 'Kapeljski hrib' in VLM reading"),
    # -- mills as boundary points (PR p2, p3, p4) -----------------------------
    ("Mlin Dolo", "mill_point", "PR p2: mill at 'Dolo' cited as boundary object"),
    ("Mlin Bistrica", "mill_point", "PR p2+p3: mill at Bistrica as boundary object"),
    ("Mlin Sušica", "mill_point", "PR p3: 'Mlin Sušica (or Mlin bei Schuschitz)' as boundary object"),
    ("Mühle (unidentified)", "mill_point", "PR p4: final 'Mühle' before closure of the perimeter; which mill = UNKNOWN"),
]

PG_NARRATIVE = [
    ("Thiasing", "neighbor_gemeinde", "PG sketch label (top left): 'Gemeinde Thiasing'"),
    ("Dampfbach", "watercourse", "PG sketch label (right side boundary): 'Dampfbach Grenze'"),
    ("Dullach", "neighbor_gemeinde", "PG sketch label (bottom right): 'Gemeinde Dullach'"),
    ("Waischenberg", "neighbor_gemeinde", "PG sketch label (bottom): 'Gemeinde Waischenberg'"),
    ("Drulach", "neighbor_gemeinde", "PG sketch label (bottom left): 'Gemeinde Drulach'"),
]

# Possible matches ACROSS sources: similar forms, decision NOT_MERGED.
POSSIBLE_MATCHES = [
    {
        "pm_id": "PM-01",
        "a": "Waischenberg (PG sketch)",
        "b": "Weichselberg (PR text)",
        "reason": "orthographic proximity (W..sch..berg); both readings are single VLM passes of different documents",
        "decision": "NOT_MERGED",
        "what_would_resolve": "PR+PG re-read @300dpi, 2 independent passes; compare first letters against original",
    },
    {
        "pm_id": "PM-02",
        "a": "Dullach (PG sketch)",
        "b": "Dolga vas / Dollwitz (PR text)",
        "reason": "initial D + boundary context; forms are NOT identical",
        "decision": "NOT_MERGED",
        "what_would_resolve": "PR+PG re-read @300dpi; check whether PG label sits on the Dolga vas side of the perimeter",
    },
    {
        "pm_id": "PM-03",
        "a": "Zagorje (PS wohnort p48)",
        "b": "Zogwitsche (PUA residence p14)",
        "reason": "phonetic similarity Z-g-r; different document families; PS p48 = non-local owners section (F12)",
        "decision": "NOT_MERGED",
        "what_would_resolve": "PUA p14 re-read @300dpi + owner-name cross-check h.7/h.26 against PS p48 owners",
    },
    {
        "pm_id": "PM-04",
        "a": "Schönboden (PUA residence p15)",
        "b": "Schönbach (PR text)",
        "reason": "shared 'Schön-' prefix only; weak signal",
        "decision": "NOT_MERGED",
        "what_would_resolve": "PUA p15 re-read @300dpi; independent identification of Schönboden",
    },
    {
        "pm_id": "PM-05",
        "a": "Dullach (PG sketch)",
        "b": "Dolina / Duliza (PR stream)",
        "reason": "'-ach' is a German stream/water suffix and 'Dul-' root overlaps; but PG labels it 'Gemeinde'",
        "decision": "NOT_MERGED",
        "what_would_resolve": "PR+PG re-read @300dpi; determine whether one entity carries both settlement and stream reference",
    },
]

# Values present in residence/wohnort FIELDS that are NOT toponyms
# (VLM misclassifications or generic terms) — recorded for QA, excluded from register.
EXCLUDED_NON_TOPONYMS = [
    {"value": "hiesig / hiesiger", "source": "PUA p9,16,17,25,34,39 (8×)", "why": "generic term 'local', not a place name"},
    {"value": "Häusler", "source": "PUA p33 (no house_no)", "why": "status word misread into residence field"},
    {"value": "2700", "source": "PUA p49 (no house_no)", "why": "number misread into residence field"},
    {"value": "Weinberge", "source": "PR p2", "why": "generic land-use term (vineyards), not a name"},
    {"value": "Steinbruch", "source": "PR p3", "why": "generic (quarry), VLM itself marked '(kamnolom?)'"},
    {"value": "Waldstücke", "source": "PR p3", "why": "generic (wood lots)"},
    {"value": "eingeäckerte Wiese", "source": "PR p2", "why": "generic boundary description, not a name"},
]


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def collect_self_forms():
    """Self-forms of the Gemeinde from field-level registers + printed titles."""
    pua = load_json(PUA)
    ps = load_json(PS)
    pt = load_json(PT)["register"]

    forms = {
        "GRÜBLE": {"form": "GRÜBLE", "script": "printed", "occurrences": [], "field": "document_title"},
        "Grüble": {"form": "Grüble", "script": "handwritten", "occurrences": [], "field": "residence/wohnort"},
        "Grübln": {"form": "Grübln", "script": "handwritten", "occurrences": [], "field": "residence"},
        "Grublh.": {"form": "Grublh.", "script": "handwritten", "occurrences": [], "field": "residence"},
        "Gruble": {"form": "Gruble", "script": "handwritten", "occurrences": [], "field": "wohnort"},
        "Grable": {"form": "Grable", "script": "handwritten", "occurrences": [], "field": "wohnort"},
    }

    def norm(v):
        s = (v or "").strip().rstrip(".").strip()
        s = s.replace("zu ", "").replace("in ", "", 1) if s.startswith(("zu ", "in ")) else s
        return s

    for e in pua:
        r = (e.get("residence_original") or "").strip()
        if not r:
            continue
        n = norm(r)
        if n == "Grübln":
            forms["Grübln"]["occurrences"].append({"source": "PUA", "page": e["page"], "house_no": e.get("house_no"), "as_written": r})
        elif n == "Grüble":
            forms["Grüble"]["occurrences"].append({"source": "PUA", "page": e["page"], "house_no": e.get("house_no"), "as_written": r})
        elif n == "Grublh" or n.startswith("Grublh"):
            forms["Grublh."]["occurrences"].append({"source": "PUA", "page": e["page"], "house_no": e.get("house_no"), "as_written": r})

    for row in ps:
        w = (row.get("wohnort") or "").strip()
        if w == "Gruble":
            forms["Gruble"]["occurrences"].append({"source": "PS", "page": row["page"], "as_written": w})
        elif w == "Grable":
            forms["Grable"]["occurrences"].append({"source": "PS", "page": row["page"], "as_written": w})

    for row in pt:
        w = (row.get("wohnort_original") or "").strip()
        if w == "Grüble":
            forms["Grüble"]["occurrences"].append({"source": "PT", "page": row["page"], "as_written": w})

    # printed titles (evidence established in vals 41/42, docs 55/56)
    forms["GRÜBLE"]["occurrences"] = [
        {"source": "PT", "page": "title", "as_written": 'Protocoll der Bau Parcellen der Gemeinde "GRÜBLE"'},
        {"source": "PR", "page": "title", "as_written": 'Grenz-Beschreibung der Gemeinde "GRÜBLE"'},
        {"source": "PS", "page": "title", "as_written": 'Protocol der Grund-Parzellen der Gemeinde "GRÜBLE"'},
        {"source": "PUA", "page": "title", "as_written": 'Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde "GRÜBLE"'},
        {"source": "PV", "page": "title", "as_written": "AUSWEIS über die Benützungsart des Bodens der Gemeinde. Grüble"},
        {"source": "A01", "page": "legend", "as_written": "Gemeinde GRÜBLE in Illyrien"},
        {"source": "PG", "page": "sheet", "as_written": "Gemeinde Grüble."},
    ]
    return [forms[f] for f in ["GRÜBLE", "Grübln", "Grublh.", "Grüble", "Gruble", "Grable"]]


def collect_external_residences():
    """Non-local residence/wohnort values from field-level registers (verified forms)."""
    pua = load_json(PUA)
    ps = load_json(PS)

    out = []
    # PS wohnort non-self values
    ps_map = [
        ("Zagorje", [r for r in ps if (r.get("wohnort") or "").strip() == "Zagorje"]),
        ("Gradiše", [r for r in ps if (r.get("wohnort") or "").strip() == "Gradiše"]),
        ("Dragole", [r for r in ps if (r.get("wohnort") or "").strip() == "Dragole"]),
    ]
    for name, rows in ps_map:
        out.append({
            "form": name,
            "source": "PS",
            "field": "wohnort",
            "occurrences": [{"page": r["page"], "house_no": r.get("haus_no")} for r in rows],
        })

    # PUA residence values that are NOT self-forms and NOT excluded
    pua_map = [
        ("Zogwitsche", "Zogwitsche"),
        ("Schönboden", "Schönboden"),
        ("Waidhofen", "Waidhofen"),
        ("Gräving", "Gräving"),
    ]
    for name, needle in pua_map:
        occ = []
        for e in pua:
            r = (e.get("residence_original") or "").strip()
            if needle in r:
                occ.append({"page": e["page"], "house_no": e.get("house_no"), "as_written": r})
        if occ:
            out.append({"form": name, "source": "PUA", "field": "residence_original", "occurrences": occ})

    # Höchsthal: appears ONLY inside compound 'zu Grublh. in Höchsthal.' (PUA p23 h.2)
    occ = []
    for e in pua:
        r = (e.get("residence_original") or "").strip()
        if "Höchsthal" in r:
            occ.append({"page": e["page"], "house_no": e.get("house_no"), "as_written": r})
    if occ:
        out.append({"form": "Höchsthal", "source": "PUA", "field": "residence_original (compound)", "occurrences": occ})

    return out


def build_narrative_entry(toponym_id, form, ttype, context, source_doc, provisional_status, confidence):
    return {
        "toponym_id": toponym_id,
        "original_forms": [{"form": form, "source": source_doc, "page": _page_of(context), "context": context}],
        "type": ttype,
        "relation_to_griblje": "neighbor" if ttype in ("neighbor_gemeinde", "watercourse", "hill", "mill_point") else "external",
        "location": "map: PG sketch label" if source_doc == "PG" else "PR text (boundary narrative)",
        "provenance_level": "vlm_single_pass",
        "review_status": provisional_status,
        "confidence": confidence,
        "historical_only": True,
        "modern_mapping": "UNKNOWN",
        "meaning": None,
        "what_would_resolve": "PR/PG re-read @300dpi with 2 independent passes (agent instrument from val 61); cross-check against Grenz-Beschreibung original",
    }


def _page_of(context):
    # contexts look like "PR p2+..." / "PR p4: ..." / "PG sketch label ..."
    import re
    m = re.search(r"p(\d)", context)
    return f"PR p{m.group(1)}" if m else "PG sheet"


def main():
    self_forms = collect_self_forms()
    externals = collect_external_residences()

    toponyms = []

    # 1) SELF Gemeinde entry -------------------------------------------------
    n_occ = sum(len(f["occurrences"]) for f in self_forms)
    toponyms.append({
        "toponym_id": "TP-001",
        "original_forms": self_forms,
        "type": "self_gemeinde",
        "relation_to_griblje": "self",
        "location": "k.o. N83 Griblje",
        "provenance_level": "mixed: printed_title + field_transcription",
        "review_status": "VERIFIED_FORM",
        "confidence": "high",
        "historical_only": True,
        "modern_mapping": "UNKNOWN",
        "meaning": None,
        "merge_decision": "MERGED — justified by document identity: every form occurs in a document belonging to k.o. N83 Griblje (printed titles, residence/wohnort fields of its own registers). NOT merged by name similarity.",
        "possible_matches": [],
        "what_would_resolve": "nothing — self-reference is established by the documents themselves",
        "notes": f"forms carry {n_occ} field occurrences total; script variance (ü/u, -e/-n, Grable/Gruble) = Kurrent reading variance within one Gemeinde context",
    })

    # 2) administrative context ----------------------------------------------
    toponyms.append({
        "toponym_id": "TP-002",
        "original_forms": [{"form": "Illyrien", "source": "A01", "page": "legend", "context": "Gemeinde GRÜBLE in Illyrien (1824/27)"}],
        "type": "administrative",
        "relation_to_griblje": "context",
        "location": "province of Illyria (as printed on A01)",
        "provenance_level": "printed_title",
        "review_status": "VERIFIED_FORM",
        "confidence": "high",
        "historical_only": True,
        "modern_mapping": "UNKNOWN",
        "meaning": None,
        "what_would_resolve": "administrative-history source for Illyrian province administration (TO_COLLECT)",
    })
    toponyms.append({
        "toponym_id": "TP-003",
        "original_forms": [{"form": "k.o. N83 Griblje", "source": "SI AS 176", "page": "[227663]",
                            "context": "12 enot: 5 grafičnih N083A01–A05 + 7 spisovnih PG/PR/PS/PT/PUA/PV/PZ"}],
        "type": "administrative",
        "relation_to_griblje": "self",
        "location": "SI AS 176, Novomeška kresija",
        "provenance_level": "research_doc",
        "review_status": "VERIFIED_FORM",
        "confidence": "high",
        "historical_only": True,
        "modern_mapping": "UNKNOWN",
        "meaning": None,
        "what_would_resolve": "nothing — archive tree enumeration (vals 41/42)",
    })

    # 3) narrative entries (PR + PG) -----------------------------------------
    tid = 4
    for form, ttype, context in PR_NARRATIVE:
        toponyms.append(build_narrative_entry(f"TP-{tid:03d}", form, ttype, context, "PR", "PROVISIONAL",
                                              "medium" if "+p3" in context or context.count("p") >= 2 else "low"))
        tid += 1
    for form, ttype, context in PG_NARRATIVE:
        toponyms.append(build_narrative_entry(f"TP-{tid:03d}", form, ttype, context, "PG", "PROVISIONAL", "low"))
        tid += 1

    # 4) external residences (field-level, verified forms) --------------------
    for e in externals:
        pages = [o["page"] for o in e["occurrences"]]
        notes = ""
        if e["form"] == "Zagorje":
            notes = "occurs in PS p48 = non-local owners section (F12, val 58); rows are composite '1 / N' references"
        if e["form"] == "Höchsthal":
            notes = "appears ONLY inside compound 'zu Grublh. in Höchsthal.' (PUA p23 h.2) — possibly sub-location qualifier of the village itself"
        toponyms.append({
            "toponym_id": f"TP-{tid:03d}",
            "original_forms": [{"form": e["form"], "source": e["source"], "field": e["field"],
                                "occurrences": e["occurrences"]}],
            "type": "external_settlement",
            "relation_to_griblje": "external",
            "location": "UNKNOWN (not on N83 sheets — owners' residence outside the Gemeinde)",
            "provenance_level": "field_transcription",
            "review_status": "VERIFIED_FORM",
            "confidence": "high",
            "historical_only": True,
            "modern_mapping": "UNKNOWN",
            "meaning": None,
            "possible_matches": _pm_ids_for(e["form"]),
            "what_would_resolve": "identify from independent sources (šolski list [4118864], SA Podzemelj, SI AS 749 — TO_COLLECT); PUA/PS page re-reads @300dpi where flagged",
            "notes": notes,
        })
        tid += 1

    # 5) A05 uncertain map label (multi-pass) ---------------------------------
    toponyms.append({
        "toponym_id": f"TP-{tid:03d}",
        "original_forms": [
            {"form": "Schumsthl", "source": "A05", "page": "map label", "context": "val 42 reading"},
            {"form": "Schamsho", "source": "A05", "page": "map label", "context": "alternative pass"},
            {"form": "Schimstl", "source": "A05", "page": "map label", "context": "alternative pass"},
            {"form": "Traverne", "source": "A05", "page": "map label", "context": "3/3 consistent readings (val 43 Q5)"},
        ],
        "type": "map_label_uncertain",
        "relation_to_griblje": "uncertain_signal",
        "location": "map sheet A05 (not beside a building — val 42)",
        "provenance_level": "vlm_multi_pass",
        "review_status": "PROVISIONAL_MULTI — first word UNRESOLVED",
        "confidence": "low",
        "historical_only": True,
        "modern_mapping": "UNKNOWN",
        "meaning": None,
        "what_would_resolve": "A05 paleography @300dpi (P1 backlog, val 43); possible gasthaus-relevant signal (MVG-109)",
        "notes": "the ONLY tavern-like signal in any 1825 source so far — negative result otherwise documented (val 42)",
    })

    register = {
        "val": 62,
        "pass": "3-supplement (§12)",
        "issue": "#42 output #7 + #43 TOPONYM node type",
        "title": "toponym-register-1825 v1",
        "provenance": {
            "field_transcription": "PUA residence_original (val 51), PS wohnort (vals 57/61), PT wohnort_original (val 53) — row-verified forms",
            "vlm_single_pass": "PR Grenz-Beschreibung (4 PDF pages) + PG sketch labels — semantic VLM reading, val 42 — PROVISIONAL",
            "vlm_multi_pass": "A05 'Traverne' ×3 (val 42/43) — first word UNRESOLVED",
            "printed_title": "typeset Gemeinde titles ×6 — VERIFIED_FORM",
            "method": "deterministic builder (this script); no modern knowledge injected; narrative entries cite their VLM artifacts",
        },
        "rules": [
            "no merge of similar names across sources — possible_matches with decision NOT_MERGED",
            "self-forms merged ONLY by document identity (k.o. N83 context), each form keeps sources",
            "modern_mapping stays UNKNOWN until a repo-documented source proves a link",
            "UNKNOWN / NOT FOUND / CONFLICT kept distinct (issue #43 §5)",
        ],
        "coverage": {},
        "toponyms": toponyms,
        "possible_matches_uncertain": POSSIBLE_MATCHES,
        "excluded_non_toponyms": EXCLUDED_NON_TOPONYMS,
        "negative_results_addendum": [
            {
                "neg_id": "NR-12",
                "searched": "named Flurbezirke (toponymic district names) in PS jaethe column",
                "source": "PS N83 pages 1–55 (55/143 transcribed)",
                "pages": "p1–p55",
                "result": "NOT FOUND — all Flurbezirk segments are numeric/roman (I–V sections + numbers); zero named districts",
                "why": "the Gemeinde divides land into numbered Flurbezirke, not named ones (at least in the transcribed half)",
                "next_source": "PS p56–p143 once VLM quota restores",
            },
            {
                "neg_id": "NR-13",
                "searched": "non-local residences in PT wohnort_original",
                "source": "PT N83 (100 rows)",
                "pages": "p1–p8",
                "result": "NOT FOUND — wohnort_original is empty except 3× self-form 'Grüble' (p3/4/5)",
                "why": "PT records building parcels of local owners; external owners appear in PS/PUA, not PT",
                "next_source": "none — negative is structural",
            },
        ],
    }

    # coverage
    by_type = {}
    by_prov = {}
    by_status = {}
    for t in toponyms:
        by_type[t["type"]] = by_type.get(t["type"], 0) + 1
        by_prov[t["provenance_level"]] = by_prov.get(t["provenance_level"], 0) + 1
        st = t["review_status"].split(" ")[0].split("—")[0].strip()
        by_status[st] = by_status.get(st, 0) + 1
    register["coverage"] = {
        "total": len(toponyms),
        "by_type": by_type,
        "by_provenance": by_prov,
        "by_review_status": by_status,
        "possible_matches_open": len(POSSIBLE_MATCHES),
        "excluded_non_toponyms": len(EXCLUDED_NON_TOPONYMS),
    }

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(register, f, ensure_ascii=False, indent=1)

    # append NR-12/NR-13 into the central negative-result register (idempotent)
    if os.path.exists(NEG):
        neg = load_json(NEG)
        existing = {n["neg_id"] for n in neg["negatives"]}
        added = 0
        for nr in register["negative_results_addendum"]:
            if nr["neg_id"] not in existing:
                neg["negatives"].append(nr)
                added += 1
        if added:
            neg["negatives_total"] = len(neg["negatives"])
            with open(NEG, "w", encoding="utf-8") as f:
                json.dump(neg, f, ensure_ascii=False, indent=1)

    print(f"toponym-register-1825.json: {len(toponyms)} entries")
    print(f"  by_type: {by_type}")
    print(f"  by_provenance: {by_prov}")
    print(f"  by_review_status: {by_status}")
    print(f"  possible_matches open: {len(POSSIBLE_MATCHES)}")
    print(f"  excluded non-toponyms: {len(EXCLUDED_NON_TOPONYMS)}")
    print("negative-result register updated with NR-12, NR-13 (if absent)")
    return 0


def _pm_ids_for(form):
    ids = []
    for pm in POSSIBLE_MATCHES:
        if form in pm["a"] or form in pm["b"]:
            ids.append(pm["pm_id"])
    return ids


if __name__ == "__main__":
    sys.exit(main())
