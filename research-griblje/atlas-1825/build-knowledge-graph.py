#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Val 63 — ISSUE #43 §1/§3/§8/§9: KNOWLEDGE GRAPH v1 (knowledge-graph-1825.json)

Evidence-first graf: PERSON ↔ HOUSE ↔ PARCEL ↔ BP ↔ TOPONYM ↔ EVENT ↔ SOURCE.
 claim-first (§3): interpretativne povezave so CLAIM-i s source + status.
 Vsi nodes/edges/claims so deterministično rekonstruirani iz registrov:
   atlas-1825/{house-register, person-owner-register, bp-house-reconciliation,
               conflict-register, parcel-register, toponym-register}.json
   (+ pua-n83/register.json za (page,entry_no)→house indeks)

Pravila (issue #43 §5, §11, §12):
  - claim brez source = napaka (assert v build + testi)
  - edge brez evidence_status ali source = napaka
  - osebe NIKOLI ne mergeane (possible_duplicate ohranja merge_decision NOT_MERGED)
  - UNKNOWN/NOT FOUND/CONFLICT ostanejo ločeni; NOT_FOUND → research gap, ne "absent"
  - nič zgodovinskih podatkov ni spremenjeno (infra sloj)
"""

import json
import os
import sys
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.abspath(__file__))
RG = os.path.dirname(BASE)
REPO = os.path.dirname(RG)

SRC_DOCS = [
    # uodid = VAC enota (details URL); docid = digitalni objekt (IIIF/PDF).
    # KG-F02 (val 64): v1 je imela napačne uodid-e (ugibanje iz manifest datotek);
    # popravljeno po tabeli 56-val42 (repo vir) — glej findings v izhodu.
    {"source_id": "SRC-PUA", "label": "PUA N83 — Alphabetisches Verzeichniß der Grund-Eigenthümer", "uodid": 373417, "docid": 41782, "pages": 49,
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=373417"},
    {"source_id": "SRC-PS", "label": "PS N83 — Protocol der Grund-Parcellen", "uodid": 373415, "docid": 41780, "pages": 143, "coverage": "PARTIAL 55/143 (val 57/61)",
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=373415"},
    {"source_id": "SRC-PT", "label": "PT N083 — Protocoll der Bau Parcellen", "uodid": 373416, "docid": 41781, "pages": 8,
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=373416"},
    {"source_id": "SRC-PR", "label": "PR — Grenz-Beschreibung der Gemeinde GRÜBLE", "uodid": 373414, "docid": 41779, "pages": 4,
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=373414"},
    {"source_id": "SRC-PG", "label": "PG — Übersichtsskizze k.o. N83", "uodid": 373413, "docid": 41778, "pages": 1,
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=373413"},
    {"source_id": "SRC-PV", "label": "PV — Ausweis über die Benützungsart des Bodens", "uodid": 373418, "docid": 41783, "pages": 1,
     "coverage": "TRANSCRIBED 1/1 (val 74, aritmetična vrata I1–I4)",
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=373418"},
    {"source_id": "SRC-PZ", "label": "PZ — Konskripcija 1830", "uodid": 373419, "docid": 41784, "pages": 71,
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=373419"},
    # KG-F05 (val 66): A01–A05 = ista označena družina listov (napis "Siche die
    # Reambullirungs Beimappe" na vseh 5, R-A01-title-full + T-pasi); A02–A05 nosijo
    # numerala II–V in kode O.IX.24ci/dg/cg/ch; A01 = detaljni list vasi (~2.4x večje
    # merilo); vintage (izmera 1824/27 vs reambulacija) ostaja UNRESOLVED.
    {"source_id": "SRC-A01", "label": "A01 — katastrski list (detajlni list vasi)", "uodid": 227666, "docid": 10,
     "section_numeral": None, "series_code": None,
     "title_inscription": "Siche die Reambullirungs Beimappe", "family_vintage": "UNRESOLVED (KG-F05)",
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=227666"},
    {"source_id": "SRC-A02", "label": "A02 — katastrski list (sekcija II)", "uodid": 227668, "docid": 10,
     "section_numeral": "II", "series_code": "O.IX.24ci",
     "title_inscription": "Siche die Reambullirungs Beimappe", "family_vintage": "UNRESOLVED (KG-F05)",
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=227668"},
    {"source_id": "SRC-A03", "label": "A03 — katastrski list (sekcija III)", "uodid": 227670, "docid": 10,
     "section_numeral": "III", "series_code": "O.IX.24dg",
     "title_inscription": "Siche die Reambullirungs Beimappe", "family_vintage": "UNRESOLVED (KG-F05)",
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=227670"},
    {"source_id": "SRC-A04", "label": "A04 — katastrski list (sekcija IV)", "uodid": 227671, "docid": 10,
     "section_numeral": "IV", "series_code": "O.IX.24cg",
     "title_inscription": "Siche die Reambullirungs Beimappe", "family_vintage": "UNRESOLVED (KG-F05)",
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=227671"},
    {"source_id": "SRC-A05", "label": "A05 — katastrski list (sekcija V)", "uodid": 227673, "docid": 10,
     "section_numeral": "V", "series_code": "O.IX.24ch",
     "title_inscription": "Siche die Reambullirungs Beimappe", "family_vintage": "UNRESOLVED (KG-F05)",
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=227673"},
    {"source_id": "SRC-SIAS176", "label": "SI AS 176 — fond Novomeška kresija (k.o. N83 [227663], 12 enot)", "uodid": 227663, "docid": None,
     "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=227663"},
]


def load(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


class Graph:
    def __init__(self):
        self.nodes = []
        self.edges = []
        self.claims = []
        self.research_gaps = []
        self.story_atoms = []
        self.gap_seq = 0
        self.invariant_violations = []

    def node(self, node_id, node_type, props, source_ids=None, evidence_status=None, notes=None):
        n = {"node_id": node_id, "node_type": node_type}
        n.update(props)
        if source_ids:
            n["source_ids"] = source_ids
        if evidence_status:
            n["evidence_status"] = evidence_status
        if notes:
            n["notes"] = notes
        self.nodes.append(n)
        return node_id

    def edge(self, from_id, rel, to_id, period, source_ids, evidence_status,
             confidence="medium", notes=None, conflict_refs=None, claim_ids=None):
        rid = f"R-{len(self.edges)+1:05d}"
        e = {
            "relation_id": rid,
            "from_entity": from_id,
            "relation_type": rel,
            "to_entity": to_id,
            "date_period": period,
            "source_ids": source_ids,
            "evidence_status": evidence_status,
            "confidence": confidence,
        }
        if notes:
            e["notes"] = notes
        if conflict_refs:
            e["conflict_refs"] = conflict_refs
        if claim_ids:
            e["claim_ids"] = claim_ids
        self.edges.append(e)
        return rid

    def claim(self, subject, predicate, obj, source_ref, status, period=None, confidence=None, notes=None):
        cid = f"C-{len(self.claims)+1:05d}"
        if not source_ref:
            self.invariant_violations.append(f"claim {cid} without source")
        c = {
            "claim_id": cid,
            "subject": subject,
            "predicate": predicate,
            "object": obj,
            "source_ref": source_ref,
            "status": status,
        }
        if period:
            c["period"] = period
        if confidence:
            c["confidence"] = confidence
        if notes:
            c["notes"] = notes
        self.claims.append(c)
        return cid

    def gap(self, missing_relation, searched, result, next_source, status="OPEN", tied_to=None):
        self.gap_seq += 1
        g = {
            "gap_id": f"RG-{self.gap_seq:03d}",
            "missing_relation": missing_relation,
            "searched_sources": searched,
            "current_result": result,
            "next_source": next_source,
            "status": status,
        }
        if tied_to:
            g["tied_to"] = tied_to
        self.research_gaps.append(g)
        return g


def main():
    houses_reg = load(os.path.join(BASE, "house-register-1825.json"))["houses"]
    persons_reg = load(os.path.join(BASE, "person-owner-register-1825.json"))["persons"]
    bp_reg = load(os.path.join(BASE, "bp-house-reconciliation-1825.json"))["bp_rows"]
    conflicts = load(os.path.join(BASE, "conflict-register-1825.json"))["conflicts"]
    parcels = load(os.path.join(BASE, "parcel-register-1825.json"))
    topos = load(os.path.join(BASE, "toponym-register-1825.json"))["toponyms"]
    a01_inv = load(os.path.join(BASE, "a01-building-inventory-1825.json"))
    pua_reg = load(os.path.join(RG, "pua-n83", "register.json"))

    G = Graph()

    # ---------- SOURCES ----------
    for s in SRC_DOCS:
        G.node(s["source_id"], "SOURCE", {k: v for k, v in s.items() if k != "source_id"})
    src_ids = {s["source_id"] for s in SRC_DOCS}

    # ---------- HOUSES ----------
    house_ids = set()
    house_by_no = {}
    for h in houses_reg:
        hid = f"HOUSE:{h['house_id']}"
        house_ids.add(hid)
        house_by_no[str(h["house_no_1825"])] = hid
        G.node(
            hid, "HOUSE",
            {
                "house_no_1825": h["house_no_1825"],
                "house_no_type": h["house_no_type"],
                "pua_ps_name_sim": h.get("pua_ps_name_sim"),
                "bp_refs": h.get("bp_refs") or [],
            },
            evidence_status=h["evidence_status"],
            notes=h.get("notes"),
        )

    # ---------- PERSONS (0 mergeov — possible_duplicate ohranja NOT_MERGED) ----------
    per_by_key = {}
    for i, p in enumerate(persons_reg):
        pid = f"PER-{i+1:04d}"
        G.node(
            pid, "PERSON",
            {
                "name_original": p["name_original"],
                "person_type": p["person_type"],
                "possible_duplicate": p.get("possible_duplicate", False),
                "merge_decision": p.get("merge_decision"),
                "reason": p.get("reason"),
            },
            source_ids=[p["source"].split(" p")[0].replace("PUA N83", "SRC-PUA").replace("PS N83 (PARTIAL)", "SRC-PS").replace("PS N83", "SRC-PS").replace("PT N083", "SRC-PT")],
            evidence_status=p["evidence_status"],
            notes=p.get("note"),
        )
        key = (p["person_type"], str(p.get("page")), str(p.get("house_no")), p["name_original"])
        per_by_key.setdefault(key, []).append(pid)
        # page is a list for PS owners
        if isinstance(p.get("page"), list):
            for pg in p["page"]:
                per_by_key.setdefault((p["person_type"], str(pg), str(p.get("house_no")), p["name_original"]), []).append(pid)

    # ---------- PARCELS ----------
    for p in parcels["pua_parcels"]:
        G.node(
            f"PARCEL:{p['parcel_id']}", "PARCEL",
            {
                "section_original": p["section_original"],
                "parcel_number": p["parcel_number"],
                "co_referenced": p.get("co_referenced", False),
                "land_use_category": p.get("land_use_category"),
                "cross_ref_to_pua": None,
                "origin": "PUA",
            },
            source_ids=["SRC-PUA"],
            evidence_status="TRANSCRIBED",
            notes=("parcel_number_is_bp_annotation" if p.get("parcel_number_is_bp_annotation") else None),
        )
    for p in parcels["ps_parcels"]:
        G.node(
            f"PARCEL:{p['parcel_id']}", "PARCEL",
            {
                "section_original": None,
                "parcel_number": p["parcel_number"],
                "co_referenced": False,
                "land_use_category": p.get("land_use_category"),
                "cross_ref_to_pua": "UNKNOWN (F14 namespace vprašanje odprto)",
                "origin": "PS",
            },
            source_ids=["SRC-PS"],
            evidence_status="TRANSCRIBED_PARTIAL",
            notes=None,
        )

    # ---------- BP ----------
    for r in bp_reg:
        G.node(
            f"BP:{int(r['bp']):03d}", "BP",
            {"bp": int(r["bp"]), "val57_status": r.get("val57_status")},
            source_ids=["SRC-PT", "SRC-PUA"],
            evidence_status=r["atlas_status"],
            notes=r.get("note"),
        )

    # ---------- TOPONYMS ----------
    for t in topos:
        G.node(
            t["toponym_id"], "TOPONYM",
            {
                "label": t["original_forms"][0].get("form") if t.get("original_forms") else t["toponym_id"],
                "type": t["type"],
                "relation_to_griblje": t["relation_to_griblje"],
                "provenance_level": t["provenance_level"],
                "modern_mapping": t["modern_mapping"],
                "historical_only": t["historical_only"],
            },
            evidence_status=t["review_status"],
            notes=t.get("merge_decision"),
        )

    # ---------- EVENTS ----------
    G.node("EVT-001", "EVENT", {
        "label": "Pfandverschreibung (zastava) 1801",
        "statement": "PS p12 rdeča opomba 'Auf pfandbeyern 1801' na hišah 43/45/46 — dokumentiran pfand dogodek pred finalnim protokolom",
    }, source_ids=["SRC-PS"], evidence_status="VERIFIED_FORM", notes="[rot] označba v viru")
    G.node("EVT-002", "EVENT", {
        "label": "Definitivna določitev meje Gemeinde Grüble",
        "statement": "PR: Grenzversteher sosednjih občin, mejne točke No.1–21, leti 1825/1826",
    }, source_ids=["SRC-PR"], evidence_status="PROVISIONAL", notes="single VLM pass (val 42)")
    G.node("EVT-003", "EVENT", {
        "label": "Zaključek PUA N83",
        "statement": "PUA p49 zaključni zapis 10. Jänner 1825",
    }, source_ids=["SRC-PUA"], evidence_status="VERIFIED-2x", notes="3:1 branja val 57")

    # ---------- MAP_OBJECT (val 65, PASS 4, issue #42 §7): A01 inventory v1 ----------
    TIER_EV = {"CLEAR": "PROVISIONAL", "PROBABLE": "REVIEW", "CANDIDATE": "REVIEW",
               "UNREADABLE": "REVIEW", "UNRESOLVED": "REVIEW", "UNIDENTIFIED": "REVIEW"}
    TIER_CONF = {"CLEAR": "medium", "PROBABLE": "medium", "CANDIDATE": "low",
                 "UNREADABLE": "low", "UNRESOLVED": "low", "UNIDENTIFIED": "low"}
    for o in a01_inv["objects"]:
        mo_id = "MO:" + o["object_id"]
        pua_x = json.dumps(o["pua_parcel_cross"], ensure_ascii=False) if o["pua_parcel_cross"] else ""
        G.node(mo_id, "MAP_OBJECT", {
            "label": ("A01 stavba BP " + str(o["bp"])) if o["bp"] else ("A01 objekt " + o["object_id"]),
            "bp": o["bp"],
            "glyph_tier": o["glyph_tier"],
            "glyph_layer": o["glyph_layer"],
            "building_type": o["building_type"],
            "footprint_note": o["footprint_note"],
            "px": o["px"],
            "lat": o["lat"], "lng": o["lng"],
            "georef_status": o["georef_status"],
            "verdict_vs_prior": o["verdict_vs_prior"],
            "px_prior": o["px_prior"],
        }, source_ids=["SRC-A01"], evidence_status=TIER_EV[o["glyph_tier"]],
           notes="; ".join([o["notes"], "crops: " + ", ".join(o["source_crops"])]))
        G.edge(mo_id, "DEPICTED_ON", "SRC-A01",
               "1824 (izmera), korekcije 1827", ["SRC-A01"], TIER_EV[o["glyph_tier"]],
               TIER_CONF[o["glyph_tier"]],
               notes="2-prehodno agentovo branje brez VLM (val 65)")
        if o["bp"]:
            bp_node = "BP:%03d" % int(o["bp"])
            claim_notes = "glifna vrstica na stavbi; PUA parcelni preverek: " + pua_x if pua_x else "glifna vrstica na stavbi (brez PUA zadetka)"
            cid = G.claim(mo_id, "CORRESPONDS_TO_BP", bp_node,
                          {"source": "SRC-A01", "crops": o["source_crops"], "raster_px": o["px"]},
                          "REVIEW", period="1824/1827", confidence=TIER_CONF[o["glyph_tier"]],
                          notes=claim_notes)
            G.edge(mo_id, "CORRESPONDS_TO_BP", bp_node,
                   "1824/1827", ["SRC-A01"], TIER_EV[o["glyph_tier"]],
                   TIER_CONF[o["glyph_tier"]],
                   notes="veza glifa→BP; hišne veze ostajajo prek BP_BOUND_TO_HOUSE (val 57)",
                   claim_ids=[cid])
    # ---------- MAP_OBJECT (val 66, PASS 4b, issue #42 §7): A02–A05 inventory v1 ----------
    p4b = load(os.path.join(BASE, "pass4b", "a02-a05-building-inventory-1825.json"))
    P4B_SRC = {"A02": "SRC-A02", "A03": "SRC-A03", "A04": "SRC-A04", "A05": "SRC-A05"}
    for o in p4b["objects"]:
        mo_id = "MO:" + o["object_id"]
        src_id = P4B_SRC[o["sheet"]]
        G.node(mo_id, "MAP_OBJECT", {
            "label": (("%s stavba BP %s" % (o["sheet"], o["bp_glyph"])) if o["bp_glyph"]
                      else ("%s objekt %s" % (o["sheet"], o["object_id"]))),
            "sheet": o["sheet"],
            "bp_glyph": o["bp_glyph"],
            "glyph_tier": o["glyph_tier"],
            "glyph_layer": o["glyph_layer"],
            "building_type": o["building_type"],
            "footprint_note": o["footprint_note"],
            "px": o["px"],
            "position_precision_px": o["position_precision_px"],
            "lat": o["lat"], "lng": o["lng"],
            "georef_status": o["georef_status"],
        }, source_ids=[src_id], evidence_status=TIER_EV.get(o["glyph_tier"], "REVIEW"),
           notes="; ".join([o["notes"], "crops: " + ", ".join(o["source_crops"])]))
        G.edge(mo_id, "DEPICTED_ON", src_id,
               "družina 'Reambulirungs-Beimappe', vintage UNRESOLVED (KG-F05)", [src_id],
               TIER_EV.get(o["glyph_tier"], "REVIEW"), TIER_CONF.get(o["glyph_tier"], "low"),
               notes="2-prehodno agentovo branje brez VLM (val 66)")
        if o["bp_glyph"]:
            bp_node = "BP:%03d" % int(o["bp_glyph"])
            cid = G.claim(mo_id, "CORRESPONDS_TO_BP", bp_node,
                          {"source": src_id, "crops": o["source_crops"], "raster_px": o["px"],
                           "bp_cross_status": o["bp_cross_status"]},
                          "REVIEW", period="družina listov, vintage UNRESOLVED (KG-F05)",
                          confidence="low",
                          notes="glifa @6x na A02; A01↔A02 sidro NE obstaja — merge v BP matrico prepovedan (§5)")
            G.edge(mo_id, "CORRESPONDS_TO_BP", bp_node,
                   "vintage UNRESOLVED", [src_id], "REVIEW", "low",
                   notes="veza glifa→BP; hišne veze ostajajo prek BP_BOUND_TO_HOUSE (val 57)",
                   claim_ids=[cid])
    G.gap("MAP_OBJECT inventory (A01–A05 objekti)", ["A01 raster (val 42/65)", "A02–A05 rastri (val 42/66)"],
          "vseh 5 listov inventariziranih v1: A01 %d objektov (%d s BP) + %d prior-only; A02 %d (cerkev + 3 BP kandidati 12/20/22); A03 0 (negativna); A04 0 (negativna); A05 %d (klaster koč + parcel)" % (
              a01_inv["counts"]["objects_v65"], a01_inv["counts"]["objects_with_bp"],
              a01_inv["counts"]["located_prior_only"],
              p4b["counts"]["by_sheet"]["A02"], p4b["counts"]["by_sheet"]["A05"]),
          "georef sidra A02–A05; višji dpi re-readi (BP glife vasi A02, koče A05, naslovne annotacije); PR re-read za mejne točke N°1–9",
          status="RESOLVED-V66", tied_to="issue #42 §7")

    # ================= EDGES + CLAIMS =================

    # ---- OWNER_OF (PUA: pripravljalno stanje) ----
    pua_idx = {(e["page"], str(e["entry_no"])): e.get("house_no") for e in pua_reg}
    owner_gap_hits = []
    for h in houses_reg:
        hid = house_by_no.get(str(h["house_no_1825"]))
        if not hid:
            continue
        for o in (h["owners"].get("pua") or []):
            hn = pua_idx.get((o["page"], str(o["entry_no"])))
            persons_hit = per_by_key.get(("owner(pua)", str(o["page"]), str(hn), o["owner_original"]))
            if hn is None or persons_hit is None:
                owner_gap_hits.append({"house": h["house_no_1825"], "page": o["page"], "entry_no": o["entry_no"]})
                continue
            for pid in persons_hit:
                cid = G.claim(
                    hid, "OWNER_DOCUMENTED", pid,
                    {"source": "SRC-PUA", "page": o["page"]},
                    "REVIEW" if o.get("review_status") == "REVIEW" else "VERIFIED",
                    period="pripravljalno stanje (pre-1825, F9)",
                    confidence="medium",
                    notes=f"owner_original: {o['owner_original']}",
                )
                G.edge(pid, "OWNER_OF", hid, "pripravljalno stanje (PUA)", ["SRC-PUA"],
                       o.get("review_status") or "REVIEW", "medium",
                       notes=f"entry_no {o['entry_no']}", conflict_refs=h.get("conflict_ids"), claim_ids=[cid])

    # ---- OWNER_OF (PS: končno stanje 1825) ----
    for h in houses_reg:
        hid = house_by_no.get(str(h["house_no_1825"]))
        ps = h["owners"].get("ps")
        if not hid or not ps:
            continue
        persons_hit = per_by_key.get(("owner(ps)", str(h["house_no_1825"]), ps["owner_original"])) or \
                      per_by_key.get(("owner(ps)", str(ps.get("pages", ["?"])[0]), str(h["house_no_1825"]), ps["owner_original"]))
        # robust: match by (house_no, name) across page keys
        if not persons_hit:
            persons_hit = [pid for (t, pg, hn, nm), ids in per_by_key.items()
                           if t == "owner(ps)" and hn == str(h["house_no_1825"]) and nm == ps["owner_original"] for pid in ids]
        if not persons_hit:
            owner_gap_hits.append({"house": h["house_no_1825"], "source": "PS", "name": ps["owner_original"]})
            continue
        status = "CONFLICT" if any(c.startswith("CH-") for c in (h.get("conflict_ids") or [])) else "SINGLE_SOURCE"
        for pid in set(persons_hit):
            cid = G.claim(
                hid, "OWNER_DOCUMENTED", pid,
                {"source": "SRC-PS", "pages": ps.get("pages", [])},
                status,
                period="1825 (končni protokol, F9)",
                confidence="medium",
                notes=f"owner_original: {ps['owner_original']}; stand: {ps.get('stand')}; rows: {ps.get('rows')}",
            )
            G.edge(pid, "OWNER_OF", hid, "1825 (PS končni)", ["SRC-PS"], status, "medium",
                   notes=f"coverage {ps.get('coverage')}", conflict_refs=h.get("conflict_ids"), claim_ids=[cid])

    # ---- OWNER_OF (PT: lastniške variante — nestabilna imena, F1/F10) ----
    for (ptype, pg, hn, nm), ids in list(per_by_key.items()):
        if ptype != "owner_variant(pt)":
            continue
        hid = house_by_no.get(hn)
        if not hid:
            continue
        for pid in ids:
            node = next(n for n in G.nodes if n["node_id"] == pid)
            cid = G.claim(
                hid, "OWNER_VARIANT_DOCUMENTED", pid,
                {"source": "SRC-PT", "page": int(pg) if str(pg).isdigit() else None},
                "REVIEW",
                period="1825 (PT, imena nestabilna — F1/F10)",
                confidence="low",
                notes=f"variant: {nm}; uporabna le s PS korooboracijo (val 58 F10)",
            )
            G.edge(pid, "OWNER_VARIANT_OF", hid, "1825 (PT, nestabilna imena)", ["SRC-PT"], "REVIEW", "low",
                   notes=f"variant: {nm}", conflict_refs=hid_conflicts(houses_reg, hn), claim_ids=[cid])

    # ---- BP_BOUND_TO_HOUSE ----
    # NOTE (KG-F01, §12 finding): bp 90 ima register-internal napetost — pt_houses ["44"]
    # (starejša PT register plast, val 41–53) vs note + PUA ref h.43 (val 57 digit-by-digit,
    # CONFIRMED-2x). Ne rešujemo tiho: PT edge dobi REVIEW + research gap, PUA edge ostaja FOUND.
    bp90_flagged = False
    for r in bp_reg:
        bpid = f"BP:{int(r['bp']):03d}"
        cands = r.get("house_candidates") or {}
        refs = []
        for hh in (cands.get("pt_houses") or []):
            refs.append(("pt", hh))
        for pr in (cands.get("pua_refs") or []):
            refs.append(("pua", str(pr.get("house_no")), pr))
        flat = []
        for x in refs:
            if x[0] == "pua":
                flat.append(("pua", x[1], x[2]))
            else:
                flat.append(("pt", x[1], None))
        if not flat:
            if r["atlas_status"] == "NOT_FOUND":
                G.gap(f"BP {r['bp']} → HOUSE ?", ["PT N083", "PUA N83", "A01"],
                      "NOT_FOUND (val 57/59 sodba ohranjena)",
                      "PS p56–p143 + PUA/PT re-readi @300dpi")
            continue
        for origin, hh, pr in flat:
            hid = house_by_no.get(str(hh))
            if not hid:
                continue
            src = "SRC-PT" if origin == "pt" else "SRC-PUA"
            status = r["atlas_status"]
            note = f"candidate origin: {origin}" + (f"; pua_ref: {pr.get('pua_entry')} owner {pr.get('owner')}" if pr else "")
            if r["bp"] == 90 and origin == "pt":
                status = "REVIEW"
                note += "; KG-F01: pt_houses 44 (starejša plast val 41–53) vs val 57 digit-by-digit h.43 — napetost dokumentirana, re-read PT p7 @300dpi"
                bp90_flagged = True
            cid = G.claim(
                bpid, "BP_BOUND_TO_HOUSE", hid,
                {"source": src},
                "VERIFIED" if status == "FOUND" else status,
                period="1825",
                confidence="high" if status == "FOUND" else "low",
                notes=note,
            )
            G.edge(bpid, "BP_BOUND_TO_HOUSE", hid, "1825", [src],
                   status, "high" if status == "FOUND" else "low",
                   notes=note, conflict_refs=r.get("conflict_ids"), claim_ids=[cid])
    if bp90_flagged:
        G.gap("BP 90 → HOUSE: 43 ali 44? (KG-F01)",
              ["PT N083 p7 (val 41/52/53 register = 44; val 57 digit-by-digit = 43)", "PUA no.7 p6 (h.43 + opomba B.P.90.)"],
              "register-internal napetost: pt_houses [44] vs CONFIRMED-2x h.43 — obe povezavi ohranjeni (PT edge REVIEW)",
              "PT p7 re-read @300dpi 2-prehodno (instrument val 61)")

    # ---- HAS_PARCEL (HOUSE → PARCEL) ----
    for p in parcels["pua_parcels"]:
        for hn in (p.get("house_refs") or []):
            hid = house_by_no.get(str(hn))
            if not hid:
                continue
            G.edge(hid, "HAS_PARCEL", f"PARCEL:{p['parcel_id']}", "1825 (PUA)", ["SRC-PUA"],
                   "TRANSCRIBED", "high",
                   notes=("so-referenced: parcela v več hišah (značilnost katastra, NE konflikt)"
                          if p.get("co_referenced") else None))
    for p in parcels["ps_parcels"]:
        hid = house_by_no.get(str(p.get("house_ref")))
        if not hid:
            continue
        G.edge(hid, "HAS_PARCEL", f"PARCEL:{p['parcel_id']}", "1825 (PS)", ["SRC-PS"],
               "TRANSCRIBED_PARTIAL", "medium",
               notes="cross_ref_to_pua UNKNOWN (F14)")

    # ---- RESIDENCE_DOCUMENTED_AT (PERSON → TOPONYM; samo field-level viri) ----
    topo_by_form = {"Zogwitsche": "TP-032", "Schönboden": "TP-033", "Waidhofen": "TP-034",
                    "Gräving": "TP-035", "Höchsthal": "TP-036",
                    "Zagorje": "TP-029", "Gradiše": "TP-030", "Dragole": "TP-031"}
    res_edges = 0
    for e in pua_reg:
        r = (e.get("residence_original") or "").strip()
        if not r:
            continue
        for form, tid in topo_by_form.items():
            if form in r:
                persons_hit = per_by_key.get(("owner(pua)", str(e["page"]), str(e.get("house_no")), None)) or []
                # match person by page+house (any name — register person name may differ from residence row)
                persons_hit = [pid for (t, pg, hn, nm), ids in per_by_key.items()
                               if t == "owner(pua)" and str(pg) == str(e["page"]) and hn == str(e.get("house_no")) for pid in ids]
                if not persons_hit:
                    G.gap(f"PERSON (PUA p{e['page']} h.{e.get('house_no')}) → RESIDENCE {form} ?",
                          ["person-owner-register (join)"],
                          "join miss — person register ne vsebuje (page,house) ključa",
                          "preveri person register build (val 59) proti PUA strani")
                    continue
                for pid in persons_hit:
                    G.edge(pid, "RESIDENCE_DOCUMENTED_AT", tid, "pre-1825 (PUA)", ["SRC-PUA"],
                           "VERIFIED_FORM", "high", notes=f"residence_original: {r}")
                    res_edges += 1
    for row in load(os.path.join(RG, "ps-n83", "register.json")):
        w = (row.get("wohnort") or "").strip()
        if w in ("Zagorje", "Gradiše", "Dragole"):
            persons_hit = [pid for (t, pg, hn, nm), ids in per_by_key.items()
                           if t == "owner(ps)" and str(pg) == str(row["page"]) and hn == str(row.get("haus_no")) for pid in ids]
            if not persons_hit:
                continue
            for pid in persons_hit:
                G.edge(pid, "RESIDENCE_DOCUMENTED_AT", topo_by_form[w], "1825 (PS, ne-lokalna sekcija F12)",
                       ["SRC-PS"], "VERIFIED_FORM", "high", notes=f"wohnort: {w}")
                res_edges += 1

    # ---- EVENT povezave ----
    for hn in ("43", "45", "46"):
        hid = house_by_no.get(hn)
        if hid:
            cid = G.claim("EVT-001", "AFFECTS_HOUSE", hid,
                          {"source": "SRC-PS", "page": 12}, "VERIFIED_FORM",
                          period="1801", confidence="high",
                          notes="rdeča opomba 'Auf pfandbeyern 1801' v vrstici hiše")
            G.edge("EVT-001", "AFFECTS_HOUSE", hid, "1801", ["SRC-PS"], "VERIFIED_FORM", "high",
                   notes="[rot]", claim_ids=[cid])
    G.edge("EVT-002", "DOCUMENTED_IN", "SRC-PR", "1825/1826", ["SRC-PR"], "PROVISIONAL", "low")
    G.edge("EVT-003", "DOCUMENTED_IN", "SRC-PUA", "10. 1. 1825", ["SRC-PUA"], "VERIFIED-2x", "high")

    # ---- TOPONYM DOCUMENTED_IN + self link ----
    topo_src_map = {"PUA": "SRC-PUA", "PS": "SRC-PS", "PT": "SRC-PT", "PR": "SRC-PR",
                    "PG": "SRC-PG", "A01": "SRC-A01", "A05": "SRC-A05", "SI AS 176": "SRC-SIAS176"}
    for t in topos:
        srcs = set()
        for f in t.get("original_forms", []):
            s = f.get("source")
            if s in topo_src_map:
                srcs.add(topo_src_map[s])
        for s in sorted(srcs):
            G.edge(t["toponym_id"], "DOCUMENTED_IN", s, "1825/1827", [s], t["review_status"], "medium")
    # v1.4 (KG-F07): tudi IS_GEMEINDE_OF claim-first (§43 §3) — prej edge brez
    # claima, SA-004 pa brez claim povezave (ujel PASS 6 invariant §43 §8/§11).
    _cid_gemeinde = G.claim("TP-001", "IS_GEMEINDE_OF", "TP-003",
                            {"source": "SRC-A01"}, "VERIFIED_FORM",
                            period="1824/1827", confidence="high",
                            notes="tiskane naslovnice vseh registrov poimenujejo isto Gemeindo; vire SRC-A01/PT/PS nosi relacija")
    G.edge("TP-001", "IS_GEMEINDE_OF", "TP-003", "1824/1827", ["SRC-A01", "SRC-PT", "SRC-PS"],
           "VERIFIED_FORM", "high", notes="tiskane naslovnice vseh registrov poimenujejo isto Gemeindo",
           claim_ids=[_cid_gemeinde])

    # ---------- STORY ATOMS (§8, exemplarji s polno provenanco) ----------
    def claims_of(pred, subj=None):
        return [c["claim_id"] for c in G.claims if c["predicate"] == pred and (subj is None or c["subject"] == subj)]

    G.story_atoms = [
        {
            "story_id": "SA-001",
            "subject": "Hiše 43/45/46 — pfand 1801",
            "period": "1801",
            "statement": "PS p12 rdeča opomba 'Auf pfandbeyern 1801' dokumentira pfand (zastavo) na hišah 43/45/46 — razlog za različna lastniška stanja PUA vs PS (F9).",
            "entities": ["EVT-001", house_by_no["43"], house_by_no["45"], house_by_no["46"]],
            "claim_ids": claims_of("AFFECTS_HOUSE", "EVT-001"),
            "source_ids": ["SRC-PS"],
            "confidence": "high",
            "evidence_status": "VERIFIED_FORM",
        },
        {
            "story_id": "SA-002",
            "subject": "Hiša 40 — dva lastniška stanja",
            "period": "pre-1825 → 1825",
            "statement": "PUA (pripravljalno) beleži 'Pfarrer Rupert Sautter hiesig', PS (končni 1825) 'Peter Muster' (Landl. Gutsh.) — CONFLICT ohranjen (CH-040-01), obe trditvi živita.",
            "entities": [house_by_no["40"]],
            "claim_ids": claims_of("OWNER_DOCUMENTED", house_by_no["40"]),
            "source_ids": ["SRC-PUA", "SRC-PS"],
            "confidence": "medium",
            "evidence_status": "CONFLICT",
        },
        {
            "story_id": "SA-003",
            "subject": "BP 94 ↔ hiša 40 (najmočnejša BP vezava)",
            "period": "1825",
            "statement": "PT STABLE h.40 + A01 owner identiteta ('Pfarrer Rupert Sautter hiesig' = PUA h.40 lastnik) = 2 neodvisna vira (val 52/54 VERIFIED-2x). Bp 90 ↔ h.43 (PUA no.7 + val 57 digit-by-digit) ima register-noto CONFIRMED-2x, ampak PT register plast nosi še branje h.44 (KG-F01, research gap).",
            "entities": ["BP:094", house_by_no["40"], "BP:090", house_by_no["43"]],
            "claim_ids": claims_of("BP_BOUND_TO_HOUSE", "BP:094") + claims_of("BP_BOUND_TO_HOUSE", "BP:090"),
            "source_ids": ["SRC-PT", "SRC-PUA", "SRC-A01"],
            "confidence": "high",
            "evidence_status": "VERIFIED",
        },
        {
            "story_id": "SA-004",
            "subject": "Gemeinde Grüble / k.o. N83",
            "period": "1824/1827",
            "statement": "Tiskane naslovnice vseh spisovnih enot + A01 legenda ('Gemeinde GRÜBLE in Illyrien') poimenujejo ista Gemeindo — self-toponym z 6 variantskami formami.",
            "entities": ["TP-001", "TP-003"],
            "claim_ids": claims_of("IS_GEMEINDE_OF", "TP-001"),
            "source_ids": ["SRC-PT", "SRC-PR", "SRC-PS", "SRC-PUA", "SRC-PV", "SRC-A01", "SRC-PG"],
            "confidence": "high",
            "evidence_status": "VERIFIED_FORM",
        },
    ]
    for sa in G.story_atoms:
        sa["generated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        sa["generator"] = "atlas-1825/build-knowledge-graph.py v1 (deterministično)"
        sa["provenance_note"] = "story_id + input entities + claim IDs + source IDs = Story Provenance arhitektura (issue #43 §7)"

    # ---------- RESEARCH GAPS iz join diagnostike ----------
    for m in owner_gap_hits:
        G.gap(f"HOUSE {m['house']} → OWNER (join miss {m})", ["person-owner-register", "PUA/PS register"],
              "register-join ni našel person node-a (F16 p11 struktura / register drift)",
              "re-read strani @300dpi + ponovna gradnja registrov", tied_to="F16")

    # ---------- INVARIANTI (§11) ----------
    for c in G.claims:
        if not c.get("source_ref"):
            G.invariant_violations.append(f"claim {c['claim_id']} brez source")
    for e in G.edges:
        if not e.get("evidence_status") or not e.get("source_ids"):
            G.invariant_violations.append(f"edge {e['relation_id']} brez evidence/source")
    not_merged = all(n.get("merge_decision") in (None, "NOT_MERGED") for n in G.nodes if n["node_type"] == "PERSON")
    if not not_merged:
        G.invariant_violations.append("oseba mergeana!")

    # ---------- COVERAGE (§10 — brez umetnega procenta) ----------
    by_type = {}
    for n in G.nodes:
        by_type[n["node_type"]] = by_type.get(n["node_type"], 0) + 1
    by_rel = {}
    by_ev = {}
    for e in G.edges:
        by_rel[e["relation_type"]] = by_rel.get(e["relation_type"], 0) + 1
        by_ev[e["evidence_status"]] = by_ev.get(e["evidence_status"], 0) + 1
    by_claim_status = {}
    for c in G.claims:
        by_claim_status[c["status"]] = by_claim_status.get(c["status"], 0) + 1

    bp_status_map = {}
    for r in bp_reg:
        bp_status_map[r["atlas_status"]] = bp_status_map.get(r["atlas_status"], 0) + 1
    house_ev = {}
    for h in houses_reg:
        house_ev[h["evidence_status"]] = house_ev.get(h["evidence_status"], 0) + 1

    coverage = {
        "categories": [
            {"category": "houses", "total": 167, "breakdown": house_ev},
            {"category": "bp_1_100", "total": 100, "breakdown": bp_status_map},
            {"category": "parcels", "total": len(parcels["pua_parcels"]) + len(parcels["ps_parcels"]),
             "breakdown": {"PUA": len(parcels["pua_parcels"]), "PS": len(parcels["ps_parcels"]), "geometry": "NOT AVAILABLE"}},
            {"category": "owners_persons", "total": len(persons_reg),
             "breakdown": {"merged": 0, "possible_duplicate_not_merged": sum(1 for p in persons_reg if p.get("possible_duplicate"))}},
            {"category": "toponyms", "total": len(topos), "breakdown": {"modern_mapping_known": 0, "UNKNOWN": len(topos)}},
            {"category": "events", "total": 3, "breakdown": {"documented": 3}},
            {"category": "map_objects_a01", "total": len(a01_inv["objects"]) + len(a01_inv["prior_only_bp"]),
             "breakdown": {"located_v65_glyph": a01_inv["counts"]["located_v65"],
                           "located_prior_only": a01_inv["counts"]["located_prior_only"],
                           "red_glyphs": a01_inv["counts"]["red_glyphs"],
                           "not_located_1_100": a01_inv["counts"]["not_located_1_100"]}},
            {"category": "map_objects_a02_a05", "total": len(p4b["objects"]),
             "breakdown": {"A02": p4b["counts"]["by_sheet"]["A02"], "A03": p4b["counts"]["by_sheet"]["A03"],
                           "A04": p4b["counts"]["by_sheet"]["A04"], "A05": p4b["counts"]["by_sheet"]["A05"],
                           "bp_glyph_candidates": p4b["counts"]["with_bp_glyph"],
                           "negative_sheets": ["A03", "A04"]}},
        ],
        "note": "brez umetnega skupnega procenta — dejansko stanje po kategorijah (issue #43 §10)",
    }

    out = {
        "val": 74,
        "issue": "#43 §1 KG + §2/§6 Evidence Explorer + §3 claim-first + §8 story atoms + §9 research gaps + #42 §7 PASS 4/4b + §21 PASS 6 + §10 GEOREF v2 + §4 PV agregat",
        "title": "knowledge-graph-1825 v1.6",
        "findings": [
            {
                "finding_id": "KG-F01",
                "val": 63,
                "statement": "bp 90 register-internal napetost: pt_houses ['44'] (PT register plast val 41–53) vs note + PUA ref h.43 (val 57 digit-by-digit, CONFIRMED-2x). Obe povezavi ohranjeni (PT REVIEW + PUA FOUND); rešitev = PT p7 re-read @300dpi (RG-008).",
                "status": "OPEN",
            },
            {
                "finding_id": "KG-F02",
                "val": 65,
                "statement": "SRC katalog v1 je imel NAPAČNE VAC uodid-e (227668/227670/227671 = A02/A03/A04, ne PT/PUA/PS — ugibanje iz manifest datotek). Popravljeno po eksplicitni tabeli 56-val42: PUA=373417, PS=373415, PT=373416, PR=373414, PG=373413, PV=373418, PZ=373419, A01–A05=227666/227668/227670/227671/227673, k.o. N83=227663. Vsak SOURCE node zdaj nosi vac_details_url (§6 pot do dokumenta).",
                "status": "RESOLVED",
                "provenance": "research-griblje/56-val42-kataster-n83-complete-research.md (tabela enot)",
            },
            {
                "finding_id": "KG-F03",
                "val": 65,
                "statement": "px pozicije izluška A01 (val 52–56, 56 stavb) so sistematično odmaknjene od številčnih glif (delta 28–224 px = 60–490 m @2,19 m/px); glife pri teh pozicijah niso berljive @4–6x. v65 uvaja glifno pozicijsko plast (2-prehodno branje, regenerabilno); px_prior ohranjen vsakemu objektu (nič prepisano).",
                "status": "RESOLVED-V65",
                "provenance": "a01-building-inventory-1825.json findings F-A01-01 + verdict_vs_prior per objekt",
            },
            {
                "finding_id": "KG-F04",
                "val": 65,
                "statement": "Ključni prostori: temne številke na stavbah A01 (BP, PT 'Protocoll der Bau Parcellen') obstajajo hkrati kot parcelne številke PUA sec I/II z house_refs, ki so HOLDINGI (npr. glifa 94: PUA house_refs [47] vs PT p7 hiša 40). 'Nro. in der Mappe' in PUA parcelna številka = ista številka stavbne parcele; house_refs (PUA holding) ≠ hišna številka (PT). Dokumentirana obe interpretaciji; merge prepovedan do re-reada PT p7 @300dpi.",
                "status": "OPEN",
                "provenance": "a01-building-inventory-1825.json F-A01-02; parcel-register-1825.json cross-check; bp-house-reconciliation (val 57)",
            },
            {
                "finding_id": "KG-F05",
                "val": 66,
                "statement": "Družina listov A01–A05: vsi 5 nosijo napis 'Siche die Reambullirungs Beimappe' (R-A01-title-full + T-pasi val 66) — ista označena družina. A02–A05 = sekcije II–V kode O.IX.24ci/dg/cg/ch; A01 = detaljni list vasi (~2.4x večje merilo; vas je na obeh). Parcelna numeracija se nadaljuje III→IV (1966→1967). Vintage (izmera 1824/27 krita karta vs reambulacija) in relacija A01↔sekcije ostajata UNRESOLVED — arhivsko vprašanje (SI AS).",
                "status": "OPEN",
                "provenance": "pass4b/a02-a05-building-inventory-1825.json sheets + findings F-A02-03/F-A03-01",
            },
            {
                "finding_id": "KG-F06",
                "val": 66,
                "statement": "PASS 4b: A02–A05 inventarizirani (2 prehoda, brez VLM). Cerkev sv. Vid najdena na A02 s križem (F-A02-02 — na A01 je odrezana). A03+A04 = 0 stavb (negativni rezultati). A05 'vas 50–60 hiš' (val 42) = vinogradniški trakovi s kocami (F-A05-02); 'Schumsthl Traverne' (val 42) vs 'Schimshu Dravi N°8' (val 66) = dve branji, gostilniški signal OSLABLJEN (F-A05-04); mejne točke N°1–9 = verjetno PR Grenz-Beschreibung točke (F-A05-03). BP kandidati 12/20/22 na A02 @6x — merge v matrico prepovedan brez sidra.",
                "status": "RESOLVED-V66 (odprta: F-A02-01, F-A05-03, F-A05-04)",
                "provenance": "pass4b/a02-a05-building-inventory-1825.json (val 66)",
            },
            {
                "finding_id": "KG-F07",
                "val": 68,
                "statement": "PASS 6 invariant je ujel kršitev claim-first arhitekture: relacija IS_GEMEINDE_OF (TP-001 → TP-003) je bila brez claima, story atom SA-004 pa brez claim_ids (§43 §8/§11: zgodba brez claim povezav ni dovoljena). v1.4: dodan claim C-00622 (subject TP-001, IS_GEMEINDE_OF, TP-003, source SRC-A01; vire SRC-A01/PT/PS nosi relacija), SA-004 povezana nanj. Nič prejšnjih claim ID-jev se ne premakne (claim je zadnji v vrsti).",
                "status": "RESOLVED-V68",
                "provenance": "story-graph-1825.json invariant build (val 68); issue #43 §3/§8/§11",
            },
            {
                "finding_id": "KG-F08",
                "val": 72,
                "statement": "GEOREF PASS v2 (#42 §10): skala val 52–71 ('320 Klafter = 277 px → 2,19 m/px') je mešala ločljivosti raster-ov — 277 px je merjeno na polni ločljivosti VAČ IIIF, delovni raster je ~3,3× manjši. Prava skala ≈ 0,7307 m/px (reka Kolpa: 351 točk, trim-RMS 38 m; validacija: v65 stavbe mediana 17 m, prior 20 m do sodobnih stavb). v1.5: MO-A01 lat/lng + georef_status preko v2 similaritete (skala + rotacija 0,88° + prevod); overlay prek robov rastra. Claims/edges/story atomi NESPREMENJENI (nič ID-jev se ne premakne); story_id se spremeni po §22 pogodbi (kg_sha256 spremenjen = podatek spremenjen = zgodba označena kot spremenjena).",
                "status": "RESOLVED-V72 (odprta: F-GEO-03 hišne številke, F-GEO-04 listno merilo @300 dpi)",
                "provenance": "research-griblje/atlas-1825/georef-1825.json + build-georef-1825.py (val 72); raw-web-val72-2026-10/ (Overpass 2026-09-26)",
            },
        ],
        "provenance": {
            "built_from": ["house-register-1825.json", "person-owner-register-1825.json",
                           "bp-house-reconciliation-1825.json", "conflict-register-1825.json",
                           "parcel-register-1825.json", "toponym-register-1825.json",
                           "pua-n83/register.json", "ps-n83/register.json",
                           "a01-building-inventory-1825.json",
                           "pass4b/a02-a05-building-inventory-1825.json"],
            "deterministic": True,
            "regenerable": "ob PS 143/143 ponovni zagon build-knowledge-graph.py + vseh registrov",
            "runtime_copy": "src/data/knowledge-graph-1825.json (piše TA skript — prepovedan ročni urejanji, ena izhodna resnica)",
            "sources_catalog": SRC_DOCS,
        },
        "invariants_enforced": [
            "claim brez source = build napaka",
            "edge brez evidence_status/source = build napaka",
            "osebe: merge_decision NOT_MERGED ohranjen (0 mergeov)",
            "UNKNOWN/NOT FOUND/CONFLICT ločeni; NOT_FOUND → research gap",
        ],
        "invariant_violations": G.invariant_violations,
        "coverage": coverage,
        "node_stats": by_type,
        "edge_stats": by_rel,
        "edge_evidence_stats": by_ev,
        "claim_stats": by_claim_status,
        "nodes": G.nodes,
        "edges": G.edges,
        "claims": G.claims,
        "story_atoms": G.story_atoms,
        "research_gaps": G.research_gaps,
    }

    for out_path in (
        os.path.join(BASE, "knowledge-graph-1825.json"),
        os.path.join(REPO, "src", "data", "knowledge-graph-1825.json"),
    ):
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=1)

    print(f"nodes: {len(G.nodes)} {by_type}")
    print(f"edges: {len(G.edges)} {by_rel}")
    print(f"claims: {len(G.claims)} {by_claim_status}")
    print(f"research gaps: {len(G.research_gaps)}")
    print(f"story atoms: {len(G.story_atoms)}")
    print(f"invariant violations: {G.invariant_violations}")
    return 0 if not G.invariant_violations else 1


def hid_conflicts(houses_reg, hn):
    for h in houses_reg:
        if str(h["house_no_1825"]) == str(hn):
            return h.get("conflict_ids")
    return None


if __name__ == "__main__":
    sys.exit(main())
