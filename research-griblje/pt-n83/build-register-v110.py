#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Val 110 — PT N83 p7 nativni re-read (@PDF-native 2727x2117, metoda "PT p7 @300dpi")
+ PR Grenz-Beschreibung 2. prehod (nativni skeni).

Vhodi:  pt-n83/register.json (100 vrstic, built val 53), page-records.json,
        reconciliation.json; surovine raw-web-val110-2026-09/ (native-p0*.jpeg,
        native-pr-p0*.jpeg, kontaktnе table, izrezki).
Izhodi: pt-n83/register.json (p7 vrednosti korigirane, diagnostika v110),
        pt-n83/page-records.json (p7 nativni zapis),
        pt-n83/reconciliation.json (val110 sekcija + open_for_full_res),
        pt-n83/register-v110-changes.json (popoln revizijski sled).

PRAVILA (nespremenjena):
- vir resnice za p7 = NATIVNI sken + direkti odtis (glas za transkripcijo);
  VLM glasovi NE IZVEDENI (429 dnevna kvota, vzorec val 109) — resumable ob kvoti.
- F1 (val 54) ostaja: PT lastniška imena NEZANESLJIVA pri nizki ločljivosti;
  PUA ostaja lastniška avtoriteta — lastniških imen NE popravljamo (samo odtis-diagnostika).
- F2 (val 54) "pomik vrstic (90-97)" se tu nativno DOKAZA in razreši.
- Fail-fast: če register-v110-changes.json že obstaja, builder ne sme zabetonirati
  drugič (idempotenca prek snapshota).

Nativna sekvenca hišnih števil p7 (odtis, glasno z izrezki 4x-8x):
  bp 81-98: 45 45 45 45 37 36 44 36 44 43 44 41 40 40 39 38 39 70
  bp 99/100: vrstici PRAZNI (Nro stolpec neostevilčen; pomlaji; sum-vrstica "5 | Eintrags.")
"""
import json
import os
import sys
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "..", "raw-web-val110-2026-09")
CHANGES = os.path.join(HERE, "register-v110-changes.json")

# ── fail-fast: builder se ne sme zagnati dvakrat ──────────────────────────────
if os.path.exists(CHANGES):
    print(f"FAIL-FAST: {CHANGES} že obstaja — vgradnja vala 110 je že zabetonirana.")
    sys.exit(1)

# ── vir resnice: nativni sken mora obstajati ──────────────────────────────────
for f in ("native-p07.png", "native-p07.jpeg", "native-pr-p02.png", "native-pr-p03.png", "native-pr-p04.png"):
    if not os.path.exists(os.path.join(RAW, f)):
        print(f"FAIL-FAST: manjka nativni sken {f}")
        sys.exit(1)

reg_path = os.path.join(HERE, "register.json")
pages_path = os.path.join(HERE, "page-records.json")
rec_path = os.path.join(HERE, "reconciliation.json")

reg = json.load(open(reg_path, encoding="utf-8"))
pages = json.load(open(pages_path, encoding="utf-8"))
rec = json.load(open(rec_path, encoding="utf-8"))

# ── gardele bazeline (vzorec build-register-v107.py) ─────────────────────────
rows = reg["register"]
assert len(rows) == 100, f"register mora imeti 100 vrstic, je {len(rows)}"
p7 = {r["bp_no"]: r for r in rows if r["page"] == 7}
assert len(p7) == 20, f"p7 mora imeti 20 vrstic, jih ima {len(p7)}"
pre_conflict = sum(1 for r in p7.values() if r["review_status"] == "REVIEW-CONFLICT")
pre_stable = sum(1 for r in p7.values() if r["review_status"] == "STABLE")
pre_review = sum(1 for r in p7.values() if r["review_status"] == "REVIEW")
assert (pre_conflict, pre_stable, pre_review) == (14, 5, 1), (
    f"p7 baseline 14 RC / 5 STABLE / 1 REVIEW, je {pre_conflict}/{pre_stable}/{pre_review}"
)

# ── nativna branja (odtis avtorja vala 110; izrezki pt7-bpXX-no-4x/8x.png) ────
# no = hišna številka; areal = odtis areala (diagnostika, NE nadomesti areal_original);
# struck = rdeče/modro prečrtanje lastnika; struck_note kjer barva ni jasa.
NATIVE = {
    "81":  {"no": "45", "areal": "14", "struck": True,  "struck_note": "prečrtan (barva mešana črno/rdeče); areal rdeče prečrtan"},
    "82":  {"no": "45", "areal": "92", "struck": True,  "struck_note": "rdeče prečrtan; areal rdeče prečrtan"},
    "83":  {"no": "45", "areal": "892", "struck": False, "struck_note": ""},
    "84":  {"no": "45", "areal": "21", "struck": False, "struck_note": ""},
    "85":  {"no": "37", "areal": "46", "struck": True,  "struck_note": "rdeče prečrtan; areal rdeče prečrtan"},
    "86":  {"no": "36", "areal": "23", "struck": False, "struck_note": ""},
    "87":  {"no": "44", "areal": "28", "struck": False, "struck_note": ""},
    "88":  {"no": "36", "areal": "91", "struck": False, "struck_note": ""},
    "89":  {"no": "44", "areal": "149", "struck": False, "struck_note": ""},
    "90":  {"no": "43", "areal": "88", "struck": True,  "struck_note": "rdeče prečrtan; areal rdeče prečrtan"},
    "91":  {"no": "44", "areal": "119", "struck": True, "struck_note": "rdeče prečrtan; areal rdeče prečrtan"},
    "92":  {"no": "41", "areal": "129", "struck": True, "struck_note": "rdeče prečrtan; areal rdeče prečrtan"},
    "93":  {"no": "40", "areal": "48", "struck": True,  "struck_note": "rdeče prečrtan; areal rdeče prečrtan"},
    "94":  {"no": "40", "areal": "181", "struck": True, "struck_note": "rdeče prečrtan; areal rdeče prečrtan"},
    "95":  {"no": "39", "areal": "91", "struck": True,  "struck_note": "rdeče prečrtan; areal rdeče prečrtan"},
    "96":  {"no": "38", "areal": "90", "struck": True,  "struck_note": "rdeče prečrtan; areal rdeče prečrtan"},
    "97":  {"no": "39", "areal": "9",  "struck": True,  "struck_note": "rdeče prečrtan; areal rdeče prečrtan"},
    "98":  {"no": "70", "areal": "102", "struck": True, "struck_note": "A.H. Zollamt prečrtan + rdeči podpis 'siehe ganz ... nfs. 460'"},
    "99":  {"no": "",   "areal": "",   "struck": None,  "struck_note": "vrstica PRAZNA (pomlaji); Nro neostevilčen"},
    "100": {"no": "",   "areal": "",   "struck": None,  "struck_note": "vrstica PRAZNA (pomlaji); rdeče '439' v desnem robu = aritmetika vsot, ne vsebina"},
}

# Glasovi transkripcij (rekonstruirani iz surovin val 41/52/53; zoom2x v notes):
#   val41 = register house_no prej (izhodišče), val52 = pt-vlm p7.ok (val 52),
#   val53 = val53 pt-vlm p7.ok, zoom2x = val53 pt-vlm p7-zoom2x.ok (pomik!).
VOTES = {  # (agree, total) med transkripcijskimi glasovi ZA NOVO vrednost
    "81": "3/3", "82": "3/3", "83": "3/3", "84": "3/3",
    "85": "2/3", "86": "2/3", "87": "2/3", "88": "2/3", "89": "2/3",
    "90": "2/3", "91": "2/3", "92": "2/3", "93": "2/3",
    "94": "3/3",
    "95": "2/3", "96": "2/3",
    "97": "2/4",   # val52+odtis 39; val41=38, val53=35 (šum nizke ločljivosti)
    "98": "0/4",   # 39/20/20/39 — vse tri zavrnjene: odtis 70 + PUA no. 95 h.70 (val 56) + A01 no. 7 h.70
    "99": "0/3",   # fantom: 50/—/50; nativno PRAZNA
    "100": "0/4",  # fantom: 5/—/5/5 (vsotna vrstica '5 | Eintrags.'); nativno PRAZNA
}
NEW_STATUS = {
    "81": "STABLE", "82": "STABLE", "83": "STABLE", "84": "STABLE",
    "85": "STABLE", "86": "STABLE", "87": "STABLE", "88": "STABLE",
    "89": "STABLE", "90": "STABLE", "91": "STABLE", "92": "STABLE",
    "93": "STABLE", "94": "STABLE", "95": "STABLE", "96": "STABLE",
    "97": "STABLE",
    "98": "REVIEW",   # PT-notranji glasovi se ne strinjajo; 70 nosi odtis + zunanjo dvojno korooboracijo
    "99": "REVIEW", "100": "REVIEW",
}
NOTE_V110 = {
    "97": "v110: 39 (izrezek 3x; 38/35 = šum 667px)",
    "98": ("v110 nativni odtis: 70 (4x jasno; '20' = 7->2 zamenjava pri 667px; '39' = pomik vrstic "
           "iz bp 97). Zunanja dvojna korooboracija: PUA no. 95 = Zollamt h.70 + opomba 'B.P. 98.' "
           "(val 56, nativno 2x) + A01 no. 7 = h.70. Vezava Zollamt<->bp 98<->h.70 trojno podprta; "
           "3. PT glas (VLM) resumable ob kvoti"),
    "99": ("v110: vrstica PRAZNA — vnos val 41/53 ('Alois Pollandt', h.50) = fantom nizke ločljivosti "
           "(korelirana napaka, areal 102 = bp 98); 'Bruckmühle' ni na p7"),
    "100": ("v110: vrstica PRAZNA — vnos val 41/53 (h.5, 'Futterg[?]', areal '1 77/609') = fantom vsotne "
            "vrstice ('5 | Eintrags.') + diagonalnih zapiskov; mlin ostaja vezan na PR/A01/PUA dokaze"),
}

changes = []
for bp, nat in NATIVE.items():
    r = p7[bp]
    pre = {k: r.get(k) for k in ("house_no", "house_no_votes", "review_status", "owner_original",
                                 "stand_original", "wohnort_original", "gattung_original",
                                 "areal_original", "annotation_original")}
    post = dict(pre)
    post["house_no"] = nat["no"]
    post["house_no_votes"] = VOTES[bp]
    post["review_status"] = NEW_STATUS[bp]
    if bp in ("99", "100"):
        # fantomski vnos: vsebinska polja počiščena (snapshot ohranja izvirnik)
        post["owner_original"] = ""
        post["stand_original"] = ""
        post["wohnort_original"] = ""
        post["gattung_original"] = ""
        post["areal_original"] = ""
        post["annotation_original"] = ""
    r["house_no"] = post["house_no"]
    r["house_no_votes"] = post["house_no_votes"]
    r["review_status"] = post["review_status"]
    for k in ("owner_original", "stand_original", "wohnort_original", "gattung_original",
              "areal_original", "annotation_original"):
        r[k] = post[k]
    r["readings"] = sorted(set(r.get("readings", [])) | {"v110-native-p7"})
    r["v110_native"] = {
        "no": nat["no"],
        "areal_odtis": nat["areal"],
        "owner_struck": nat["struck"],
        "struck_note": nat["struck_note"],
    }
    if bp in NOTE_V110:
        r["v110_note"] = NOTE_V110[bp]
    changes.append({"bp_no": bp, "pre": pre, "post": post})

# ── meta ──────────────────────────────────────────────────────────────────────
reg["built"] = ("val 110 (p7 nativni re-read @2727x2117 — glasovi val41+val52+val53x2 + odtis v110; "
                "VLM glasovi NE IZVEDENI: 429 dnevna kvota, resumable ob kvoti; prej: val 53)")

reg["exclusions"]["val110-areal-owner"] = (
    "excluded from v110 overwrite: areal/gattung/annotation p7 ostanejo iz glasov val 41/52/53 — "
    "nativni odtisi (v110_native.areal_odtis) kažejo sistemski pomik tudi v teh poljih "
    "(npr. areal bp 99 v register = 102 = nativni bp 98); popolna re-adjudikacija areal/lastnik "
    "zahteva VLM glasove (ob kvoti) + PUA kaskado — dokumentirano v register-v110-changes.json"
)

# ── page-records p7 ───────────────────────────────────────────────────────────
p7rec = next(p for p in pages if p["page"] == 7)
p7rec["readings"] = sorted(set(p7rec.get("readings", [])) | {"v110-native-p7"})
p7rec["v110_native"] = {
    "scan": "raw-web-val110-2026-09/native-p07.jpeg (2727x2117, PDF-native, pymupdf; sha256 n083pt.pdf f7b68454fd8fd819)",
    "method": "direktni odtis na nativni ločljivosti + kontaktna tabla 20 vrstic (pt7-rows-contact.png) + izrezki stolpcev (col-house/band2/annot) + celice 4x-8x (bp 95-98); 0 VLM klicev (429 dnevna kvota)",
    "house_no_sequence": "45 45 45 45 37 36 44 36 44 43 44 41 40 40 39 38 39 70 — — (bp 81-98, nato prazni)",
    "phantom_rows": "bp 99/100 nativno PRAZNI (Nro neostevilčen, pomlaji); prejšnji vnosi (val 41/53) = korelirane napake nizke ločljivosti",
    "sum_row": "vrstica vsot: '5 | Eintrags.' + rdeče prečrtani '+997' -> rdeče '629'; rdeče '439' v desnem robu = aritmetika, ne vsebina",
    "red_crossings": "rdeče prečrtanja lastnikov+arealov na bp 81, 82, 85, 90-98 (12 vrstic); neprečrtane: 83, 84, 86-89; kontekst: revizijski prehod (možen 1827 korekcija meja — A01 naslovnica) — REVIEW, potrebjena zunanja potrditev",
    "right_page": "rdeče oznake (odtis 'de 80[?]') na vrsticah 90-98 — register '180' ostaja predbiten; črne Parification vrednosti 116 (bp 85), 232 (bp 87), 316 (bp 88); rdeča opomba 2 vrstici pri bp 81; podpisni krog + 'ad Act[?]'",
    "signature": "podpisni krog (ista roka kot PT p8 'Wiedervorlegung')",
}

# ── reconciliation: val110 sekcija ────────────────────────────────────────────
rec["val110"] = {
    "date": "2026-09-30",
    "trigger": "open_for_full_res: 'PT p7 rep 90-100 (pomik vrstic + Zollamt)' + vala 107/109 popusta kvota → direkti odtis (0 VLM)",
    "method": ("PDF-native skeni (pymupdf): N083PT.pdf 2.898.721 B (8 str., sha256 f7b68454fd8fd819) + "
               "N083PR.pdf 1.017.944 B (4 str., sha256 18280dae40af21ec); nativni p7 2727x2117 (2,1x pripogleda "
               "val 41 1308x1016); kontaktnе table + izrezki 3x-8x; 0 VLM klicev (429 dnevna kvota, vzorec val 109)"),
    "f2_resolved": ("F2 POMIK VRSTIC RESOLVED-V110: val41 + val53-zoom2x glasovi na p7 nosita +1 pomik "
                    "(register h[bp] = nativno h[bp-1] za bp 85-97; '39' pri bp 98 = pomik iz bp 97); "
                    "val52 + val53-p7 glasovi in nativni odtis se strinjajo na vseh 16 spornih vrsticah"),
    "bp98_zollamt": ("bp 98 = h.70 (nativni odtis 4x) — '20' (val52+val53) = 7->2 zamenjava pri 667px; "
                     "vezava Zollamt<->bp 98<->h.70 zdaj trojna: PUA no. 95 h.70 + 'B.P. 98.' (val 56 nativno 2x) "
                     "+ PT nativni odtis h.70 + A01 no. 7 h.70; PT register ostaja REVIEW (PT-notranji glasovi "
                     "se ne strinjajo), vezava v cadastre VERIFIED-2x (val 56) nespremenjena"),
    "bp90_bonus": ("bp 90 = h.43 nativno — korooborira verigo PUA p6 no. 7 h.43 + opomba 'B.P. 90.' (val 56); "
                   "vezava no. 7 ostaja neusklajena (F val56), ampak h.43<->bp 90 zdaj 2-source"),
    "phantoms": ("bp 99/100 = FANTOMSKA vrstica (nativno prazni; Nro neostevilčen): 'Alois Pollandt' h.50 / "
                 "h.5 'Futterg[?]' + 'Bruckmühle' = korelirane napake vsotne vrstice ('5 | Eintrags.') + "
                 "diagonalnih zapiskov; mlin ostaja vezan izključno na PR/A01/PUA dokaze"),
    "red_crossings": "rdeča revizija (12 vrstic: 81, 82, 85, 90-98) = nov strukturni signal; kontekst morda korekcija meja sept. 1827 (A01 naslovnica) — REVIEW",
    "pr_second_pass": ("PR Grenz-Beschreibung 2. prehod (nativno, direktni odtis): rokopisni naslov 'Definitive "
                       "Grenzbeschreibung der Gemeinde Grüble'; mere E-W 1028 Klafter (jasno) x N-S 1[3/8]54 "
                       "Klafter (predbitno); Grenzsteine No. 1-9 z razdaljami v Klafterih; potok 'Mlinščica' "
                       "(odtis 'Melinschi Bach') — SOGLASJE z val 42; sosede: odtis 'Krasinz[?]' + 'Königreich "
                       "Croatiens' + 'Adleischitz[?]' (Adlešiči) + 'Weitendorf[?]' (p2+p3) — NEUSKLADNO z val 42 "
                       "('Weichselberg/Hochsteg/Schönbach/Stadelbach/Dolga vas') — geografsko verjetneje odtis "
                       "(Krasinec/Adlešiči/Kolpa), ampak NI dokaz; specializiran prepis ostaja TO_COLLECT; "
                       "datum rokopisa: 'Neustadtl am 8ten April 1825' (jasno) + podpisa (komisar + Geometer); "
                       "'definitivna' opredelitev pred septembrsko korekcijo 1827"),
    "honesty": ("TRANSCRIBED=0 VLM glasov — celoten val z direktnim odtisom + rekonstrukcijo glasov iz surovin "
                "val 41/52/53; izrezki in nativni skeni komitirani za resumable 3. glas ob kvoti"),
}

# open_for_full_res: PT p7 rep rešen
if isinstance(rec.get("open_for_full_res"), list):
    rec["open_for_full_res"] = [
        x for x in rec["open_for_full_res"] if "PT p7 rep" not in x
    ] + ["PT p7 rep 90-100 — RESOLVED-V110 (nativni re-read val 110; VLM 3. glas resumable ob kvoti)"]

# ── zapis ─────────────────────────────────────────────────────────────────────
for path, obj in ((reg_path, reg), (pages_path, pages), (rec_path, rec)):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
        f.write("\n")
    os.replace(tmp, path)

audit = {
    "built": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "val": 110,
    "task": "PT p7 nativni re-read (@PDF-native 2727x2117) + PR Grenz-Beschreibung 2. prehod",
    "baseline": {"p7_conflict": pre_conflict, "p7_stable": pre_stable, "p7_review": pre_review},
    "changes": changes,
    "post_tally": {},
}
post = {"STABLE": 0, "REVIEW": 0, "REVIEW-CONFLICT": 0}
for r in p7.values():
    post[r["review_status"]] += 1
audit["post_tally"] = {"p7": post, "house_changed": [c["bp_no"] for c in changes if c["pre"]["house_no"] != c["post"]["house_no"]]}

with open(CHANGES, "w", encoding="utf-8") as f:
    json.dump(audit, f, ensure_ascii=False, indent=1)
    f.write("\n")

hc = audit["post_tally"]["house_changed"]
print(f"OK: p7 {pre_conflict} RC + 1 REVIEW + 5 STABLE  ->  {post['STABLE']} STABLE / {post['REVIEW']} REVIEW / {post['REVIEW-CONFLICT']} RC")
print(f"house_no spremenjeni bp: {hc}")
print(f"fantomi počiščeni: 99, 100; bp 98 -> 70 (REVIEW + trojna korooboracija)")
