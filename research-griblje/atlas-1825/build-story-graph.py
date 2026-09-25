#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ATLAS 1825 — PASS 6 (issue #42 §21): STORY GRAPH v1 (deterministični builder).

Pripovedni (story) graf = projekcija knowledge-graph-1825.json v enoto
OSEBA ↔ HIŠA ↔ PARCELA ↔ BP ↔ TOPONIM ↔ DOGODEK ↔ VIR (§21).

Nič NOVEGA ne sklepa: vsaka relacija je ena-za-enosno projekcija KG veze
(relation type, source, confidence, date/period = §21 obvezna polja;
date_period praznega vrednosti → izrecno "UNKNOWN"). Story Atoms (§43 §8)
se KOMPIRAJO iz KG (ena izhodna resnica), ne generirajo tu.

§22 REPRODUCIBILITY: provenance nosi sha256 izhodnega KG — če se KG spremeni,
je story-graf zastarel in mora biti regeneriran (builder tega ne maskira).

Izhod:
  - research-griblje/atlas-1825/story-graph-1825.json  (arhivska resnica)
  - src/data/story-graph-1825.json                     (runtime kopija)

Ročno urejanje obeh datotek je prepovedano — piše TA skript.
"""

import hashlib
import json
import os
import sys
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
KG_PATH = os.path.join(BASE, "knowledge-graph-1825.json")
OUT_ARCHIVE = os.path.join(BASE, "story-graph-1825.json")
OUT_RUNTIME = os.path.join(os.path.dirname(BASE), "..", "src", "data", "story-graph-1825.json")

VAL = 68

# §21: vrste vozlišč, ki so pripovedno relevantne (OSEBA ↔ HIŠA ↔ PARCELA ↔
# BP ↔ TOPONIM ↔ DOGODEK ↔ VIR). MAP_OBJECT vstopa kot kartografski dokazni
# posrednik (vhodna točka »map → entity → story«, issue #43 §6).
STORY_ENTITY_TYPES = [
    "PERSON",
    "HOUSE",
    "PARCEL",
    "BP",
    "TOPONYM",
    "EVENT",
    "SOURCE",
    "MAP_OBJECT",
]

# Pripovedni znaki relacij (SLO, deterministično mapiranje po relation_type).
# Polje bralca zgodbe: <from.label> <narrative_label> <to.label>.
NARRATIVE_LABELS = {
    "OWNER_OF": "je dokumentiran kot lastnik",
    "OWNER_VARIANT_OF": "je dokumentiran kot lastnik (različica drugega vira)",
    "HAS_PARCEL": "ima parcelo",
    "BP_BOUND_TO_HOUSE": "je vezan na hišo",
    "DOCUMENTED_IN": "je dokumentiran v",
    "DEPICTED_ON": "je prikazan na",
    "CORRESPONDS_TO_BP": "ustreza gradbeni parceli",
    "RESIDENCE_DOCUMENTED_AT": "ima dokumentirano bivanje pri",
    "AFFECTS_HOUSE": "prizadene hišo",
    "IS_GEMEINDE_OF": "je občina za",
}

TYPE_LABELS_SLO = {
    "PERSON": "oseba",
    "HOUSE": "hiša",
    "PARCEL": "parcela",
    "BP": "gradbena parcela (BP)",
    "TOPONYM": "toponim",
    "EVENT": "dogodek",
    "SOURCE": "vir",
    "MAP_OBJECT": "kartografski objekt",
}


def display_label(n: dict) -> str:
    """Človeku berljiv naziv entitete po vrsti (deterministično)."""
    t = n["node_type"]
    if t == "HOUSE":
        return f"Hiša št. {n.get('house_no_1825', '?')}"
    if t == "BP":
        return f"BP {n.get('bp', '?')}"
    if t == "PARCEL":
        return f"Parcela {n.get('section_original', '?')}-{n.get('parcel_number', '?')}"
    if t == "SOURCE":
        return str(n.get("label") or n["node_id"])
    return str(n.get("label") or n.get("name_original") or n["node_id"])


def entity_projection(n: dict) -> dict:
    """Kompaktna pripovedna projekcija vozlišča (brez dupliranja raziskovalnih polj)."""
    t = n["node_type"]
    e = {
        "node_id": n["node_id"],
        "node_type": t,
        "type_label": TYPE_LABELS_SLO.get(t, t.lower()),
        "label": display_label(n),
        "evidence_status": n.get("evidence_status", "UNKNOWN"),
        "source_ids": n.get("source_ids", []),
    }
    if t == "PERSON":
        e["name_original"] = n.get("name_original")
        e["person_type"] = n.get("person_type")
        e["possible_duplicate"] = bool(n.get("possible_duplicate"))
        # §43 §11/§14: merge je PREPOVEDAN brez novega vira — stanje ostane vidno
        e["merge_decision"] = n.get("merge_decision")
    elif t == "HOUSE":
        e["house_no_1825"] = n.get("house_no_1825")
        e["house_no_type"] = n.get("house_no_type")
        e["bp_refs_count"] = len(n.get("bp_refs") or [])
    elif t == "BP":
        e["bp"] = n.get("bp")
        e["val57_status"] = n.get("val57_status")
    elif t == "PARCEL":
        e["parcel_number"] = n.get("parcel_number")
        e["section_original"] = n.get("section_original")
        e["land_use_category"] = n.get("land_use_category")
        e["origin"] = n.get("origin")
    elif t == "TOPONYM":
        e["type"] = n.get("type")
        e["historical_only"] = bool(n.get("historical_only"))
        e["modern_mapping"] = n.get("modern_mapping", "UNKNOWN")
    elif t == "EVENT":
        e["statement"] = n.get("statement")
    elif t == "MAP_OBJECT":
        e["building_type"] = n.get("building_type", "unclassified")
        e["sheet"] = n.get("sheet") or "A01"
        e["bp_glyph"] = str(n["bp"]) if n.get("bp") is not None else (n.get("bp_glyph") if isinstance(n.get("bp_glyph"), str) else None)
        e["glyph_tier"] = n.get("glyph_tier", "UNKNOWN")
        e["georef_status"] = n.get("georef_status", "UNKNOWN")
    elif t == "SOURCE":
        e["vac_details_url"] = n.get("vac_details_url")
    return e


def fail(msg: str):
    print(f"BUILD NAPAKA (invariant): {msg}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    kg = json.load(open(KG_PATH, encoding="utf-8"))
    kg_sha = hashlib.sha256(open(KG_PATH, "rb").read()).hexdigest()

    nodes = kg["nodes"]
    edges = kg["edges"]
    claims = kg["claims"]
    story_atoms = kg.get("story_atoms", [])
    research_gaps = kg.get("research_gaps", [])

    node_index = {n["node_id"]: n for n in nodes}

    # ---------------------------------------------------------------
    # §21 projekcija: vozlišča pripovedno relevantnih vrst
    # ---------------------------------------------------------------
    entities = [entity_projection(n) for n in nodes if n["node_type"] in STORY_ENTITY_TYPES]
    entity_ids = {e["node_id"] for e in entities}

    # ---------------------------------------------------------------
    # §21 projekcija: relacije (1:1 iz KG vez), obvezna polja čistega
    # ---------------------------------------------------------------
    relations = []
    violations = []
    for e in edges:
        # Entitete, ki NISO story-vrste (npr. neighbor_gemeinde), ostanejo v
        # KG, a v pripovedni graf ne vstopajo — veze z njimi padejo ven.
        if e["from_entity"] not in entity_ids or e["to_entity"] not in entity_ids:
            continue
        rel = {
            "relation_id": e["relation_id"],
            "relation_type": e["relation_type"],
            "narrative_label": NARRATIVE_LABELS.get(e["relation_type"], e["relation_type"]),
            "from_entity": e["from_entity"],
            "to_entity": e["to_entity"],
            # §21 obvezna polja — prazna vrednost je izrecno UNKNOWN, ne tiha.
            "date_period": e.get("date_period") or "UNKNOWN",
            "source_ids": e.get("source_ids") or [],
            "confidence": e.get("confidence") or "UNKNOWN",
            "evidence_status": e.get("evidence_status") or "UNKNOWN",
            "claim_ids": e.get("claim_ids") or [],
        }
        if e.get("notes"):
            rel["notes"] = e["notes"]
        if e.get("conflict_refs"):
            rel["conflict_refs"] = e["conflict_refs"]

        # INVARIANTA §21: vsaka povezava ima relation type, source, confidence, date/period
        if not rel["relation_type"]:
            violations.append({"invariant": "relation brez relation_type", "relation_id": rel["relation_id"]})
        if not rel["source_ids"]:
            violations.append({"invariant": "relacija brez source (§21)", "relation_id": rel["relation_id"]})
        if rel["confidence"] == "UNKNOWN":
            violations.append({"invariant": "relacija brez confidence (§21)", "relation_id": rel["relation_id"]})
        if rel["date_period"] == "UNKNOWN" and not e.get("date_period"):
            violations.append({"invariant": "relacija brez date/period (§21)", "relation_id": rel["relation_id"]})
        relations.append(rel)

    # INVARIANTA: konci relacij morajo obstajati kot entitete (referenčna integriteta)
    for rel in relations:
        for side in ("from_entity", "to_entity"):
            if rel[side] not in entity_ids:
                violations.append({"invariant": f"relacija kaže na neobstoječo entiteto ({side})", "relation_id": rel["relation_id"]})

    # INVARIANTA §43 §11: zgodba (atom) brez source/claim povezav = napaka
    for atom in story_atoms:
        if not atom.get("source_ids"):
            violations.append({"invariant": "story atom brez source_ids (§43 §8/§11)", "story_id": atom.get("story_id")})
        if not atom.get("claim_ids"):
            violations.append({"invariant": "story atom brez claim_ids (§43 §8/§11)", "story_id": atom.get("story_id")})
        for ent in atom.get("entities", []):
            if ent not in node_index:
                violations.append({"invariant": "story atom kaže na neobstoječo entiteto", "story_id": atom.get("story_id"), "entity": ent})

    # INVARIANTA: claim_ids na relacijah morajo obstajati v KG
    claim_ids_all = {c["claim_id"] for c in claims}
    for rel in relations:
        for cid in rel["claim_ids"]:
            if cid not in claim_ids_all:
                violations.append({"invariant": "relacija referencira neobstoječ claim", "relation_id": rel["relation_id"], "claim_id": cid})

    if violations:
        for v in violations:
            print("INVARIANT-KRŠITEV:", json.dumps(v, ensure_ascii=False), file=sys.stderr)
        fail(f"{len(violations)} kršitev — izhod NE bo zapisan")

    # ---------------------------------------------------------------
    # Pripovedna statistika (§10 duh: brez umetnega enotnega procenta)
    # ---------------------------------------------------------------
    degree = Counter()
    for rel in relations:
        degree[rel["from_entity"]] += 1
        degree[rel["to_entity"]] += 1
    for e in entities:
        e["degree"] = degree.get(e["node_id"], 0)

    claim_count = Counter()
    for rel in relations:
        for cid in rel["claim_ids"]:
            claim_count[cid] += 1

    entities_by_type = dict(sorted(Counter(e["node_type"] for e in entities).items()))
    relations_by_type = dict(sorted(Counter(r["relation_type"] for r in relations).items()))

    stats = {
        "entities": len(entities),
        "entities_by_type": entities_by_type,
        "relations": len(relations),
        "relations_by_type": relations_by_type,
        "relations_by_confidence": dict(sorted(Counter(r["confidence"] for r in relations).items())),
        "relations_by_evidence_status": dict(sorted(Counter(r["evidence_status"] for r in relations).items())),
        "story_atoms": len(story_atoms),
        "research_gaps_tied_to_graph": len([g for g in research_gaps if g.get("status") not in ("RESOLVED-V65", "RESOLVED-V66")]),
    }

    out = {
        "val": VAL,
        "issue": "#42 §21 (PASS 6) · #43 §7/§8",
        "title": "ATLAS 1825 — Story Graph v1 (pripovedni graf entitet in relacij)",
        "provenance": {
            "built_from": "knowledge-graph-1825.json",
            "kg_sha256": kg_sha,
            "kg_val": kg.get("val"),
            "deterministic": True,
            "generator": f"atlas-1825/build-story-graph.py v1 (val {VAL})",
            "runtime_copy": "src/data/story-graph-1825.json (piše TA skript — prepovedano ročno urejanje, ena izhodna resnica)",
            "regenerable": f"python3 research-griblje/atlas-1825/build-story-graph.py ob KG {kg.get('val')} hash-u {kg_sha[:12]}",
            "no_new_claims": "story graf NE uvaja novih trditev — projekcija KG (§42 §25: najprej podatki, šele nato zgodbe)",
        },
        "invariants_enforced": [
            "§21: vsaka relacija ima relation type + source + confidence + date/period (prazno = izrecno UNKNOWN)",
            "konca relacij obstajata kot entitete (referenčna integriteta)",
            "§43 §11: story atom brez source/claim povezav = build napaka",
            "story atom entitete obstajajo v KG",
            "claim_ids relacij obstajajo v KG",
            "MAP_OBJECT = edini kartografski vhod v pripoved (§43 §6)",
        ],
        "invariant_violations": [],
        "story_engine_contract": {
            "desc": "Pričakovana shema izhoda Story Engine (§42 §16/§22, §43 §7) — shema, ne podatki",
            "required_fields": [
                "story_id",
                "input_entity_ids",
                "used_claim_ids",
                "used_source_ids",
                "generation_timestamp",
                "prompt_version",
                "story_status",
            ],
            "rule": "Vsaka generirana zgodba MORA voditi evidence-first verigo: story → claims → sources. Zgodba brez povezav = NE-OBJAVLJENA.",
        },
        "stats": stats,
        "entities": entities,
        "relations": relations,
        "story_atoms": story_atoms,
        "research_gaps": research_gaps,
    }

    for path in (OUT_ARCHIVE, OUT_RUNTIME):
        with open(path, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=1, sort_keys=False)
            f.write("\n")

    print(
        f"story-graph v1: {stats['entities']} entitet / {stats['relations']} relacij / "
        f"{stats['story_atoms']} atomov / 0 invariant-kršitev — KG {kg_sha[:12]} (val {kg.get('val')})"
    )
    print(f"  entitete po vrsti: {entities_by_type}")
    print(f"  relacije po vrsti: {relations_by_type}")


if __name__ == "__main__":
    main()
