#!/usr/bin/env python3
"""Val 57 — popravki PUA register.json (4 novi vpisi + no.7/no.8 revizija + datum + veriga)."""
import json

PATH = '/home/z/griblje-museum/research-griblje/pua-n83/register.json'
PR = '/home/z/griblje-museum/research-griblje/pua-n83/page-records.json'

reg = json.load(open(PATH))

BASE_FIELDS = {
    "source": "SI AS 176/N/N83/s/PUA",
    "document_id": "VAČ docid 41782",
    "owner_normalized": "",
    "status_normalized": "",
    "residence_original": "",
    "status_original": "",
}

def parse_parcels(s):
    """'I: 428.468.468; II: 1200.' -> [{'parcel_section': 'I', ...}]"""
    out = []
    for chunk in s.split(';'):
        chunk = chunk.strip()
        if not chunk or ':' not in chunk:
            continue
        sec, nums = chunk.split(':', 1)
        sec = sec.strip().replace(' ', '')
        for n in nums.replace(',', '.').split('.'):
            n = n.strip()
            if n:
                out.append({"parcel_section": sec, "parcel_number": n})
    return out

def mk_entry(page, entry_no, section, house_no, owner, parcels_str, ann, notes, conf):
    return {
        **BASE_FIELDS,
        "page": page,
        "entry_no": entry_no,
        "section": section,
        "house_no": house_no,
        "owner_original": owner,
        "parcels": parse_parcels(parcels_str),
        "annotation_original": ann,
        "transcription_confidence": conf,
        "normalization_confidence": "",
        "review_status": "REVIEW",
        "uncertain_words": ["Malleßthak[?]", "Bauw[?]", "Güßla[?]"] if page == 26 and entry_no == "51" else
                           ["Milleg[?]", "Hanu[?]", "Bauw[?]", "Grübla[?]"] if page == 26 and entry_no == "52" else
                           ["Bauersleibgäbler[?]"] if page == 42 else [],
        "reading_provenance": "1× VLM PDF-native (val 57, PUA-p26-native.jpeg 1391×2145)" if page == 26 else
                              "1× VLM PDF-native (val 57, PUA-p42-native.jpeg 1400×2151)",
        "notes": notes,
    }

E51 = mk_entry(26, "51", "I, II, III, III/IV, IV", "27",
    "Malleßthak [?] Han Bauw [?] Han Güßla [?]",
    "I: 428.468.434.488.524.629.596.597.942.547.648.551.552.651.652.654.682.692.700.717.718.; II: 1200.1341.1323.1406.1497.; III: 1810.1870.1920.; III/IV: 998.999.; IV: 2106.2170.2120.2153.2157.2162.2174.2169.",
    "D. P. 40.",
    "VAL 57 NOVI VPIS: p26 je v val48/51 veljala za TRUNCATED; PDF-native stran (1391×2145, val 56) pokaže VPOLNEM vpisa 51+52. h.27 = NOVA hišna št. v registru (prej brez vpisa). Branje 1× native — lastniško ime z več [?], parcele s srednjo zaupnostjo (avtor branja opozoril na gosto številčenje). Glej audit 68-val57 §5.",
    "medium")

E52 = mk_entry(26, "52", "I, II", "29",
    "Milleg Hanu Bauw [?] Han Grübla [?]",
    "I: 15.477.494.521.532.859.566.567.661.668.679.689.690.708.724.801.; II: 1221.1228.1403.1408.1421.1422.",
    "D. J. 24 34",
    "VAL 57 NOVI VPIS: p26 PDF-native (glej no.51). h.29 — KOLLIZIJA: h.29 že nosi no.78 (Schimcz Maria Bäurin, p47) → bodisi so-posedž bodisi napačno branje št. (Kurrent 9↔0/2↔8 možnost); dokumentirano, ne rešeno. Branje 1× native.",
    "medium")

E85 = mk_entry(42, "85", "I, II, III, V", "60",
    "Schelko Georg Bauersleibgäbler [?]",
    "I: 10.11.12.13.14.762.2014.872.573; II: 794.1204; III: 1250.1265.1280.1496.1522.1461.1837.1839; V: 2487.2489.2580.2581.2618.2856",
    "B. T. 50, 51, 55.",
    "VAL 57 NOVI VPIS: p42 veljala za TRUNCATED; PDF-native (1400×2151, val 56/57) pokaže vpisa 85+86. h.60 = tretji vpis na hiši 60 (poleg no.61 Penzig, no.81 Schimetz) — abecedni register dovoljuje so-posedž; dokumentirano. Opomba B.T. 50/51/55 (v branju znotraj parcelnega niza, ločeno kot anmerkung po vzoru no.80 B.T. 62). Branje 1× native.",
    "medium")

E86 = mk_entry(42, "86", "", "71",
    "Stauger Matho Bauersleibgäbler [?]",
    "",
    "",
    "VAL 57 NOVI VPIS: p42 PDF-native (glej no.85). h.71 = NOVA hišna št. (prej brez vpisa). PARCELNI SEZNAM MANJKA V SAMEM VIRU: dno p42 je odrezano tudi v PDF-native verziji (rez skena, ne samo predogleda) — p43 se začne z vpisom 87, nadaljevanje 86 NI v digitalizatu. NEGATIVNI REZULTAT audit 68-val57 §8.",
    "medium")

# vstavi po vrstnem redu (page, potem vrstni red vnosa)
def insert_sorted(entry):
    for i, e in enumerate(reg):
        if (e['page'], e['entry_no'].rstrip('?').rstrip('[?]')) > (entry['page'], entry['entry_no']):
            reg.insert(i, entry)
            return
    reg.append(entry)

for e in (E51, E52, E85, E86):
    insert_sorted(e)

# --- no.7 (p6): hišna št. 70 → 43
for e in reg:
    if e['page'] == 6 and e['entry_no'] == '7':
        e['house_no'] = "43"
        e['review_status'] = "REVIEW-CONFLICT"
        e['notes'] = (e.get('notes') or '') + \
            " | VAL 57 REVIZIJA hišne št.: 43 (3× neodvisno: val 56 native_1 + val 57 p06-top digit-by-digit '4 open top crossbar + 3 flat top' + posredno val 57 midband/bot-compact za blok) proti 70 (val 48/51 @667px) — Kurrent 4↔7 in 3↔0; 43 utemeljeno z opisi oblik števk. Lastniško ime V KONFLIKTU: val 56/57 'Brulla Mäda/Laura …' vs val 48/51 'Grübler Maria Leutnerin' (2:2) → REVIEW-CONFLICT. Opomba B.P. 90. leži pod parcelnim seznamom no.7 (val 57 midband: 'centered below the parcel list of entry No. 7'; annot-strip desni stolpec prazen — opomba je znotraj bloka vpisa, ne v stolpcu)."
    if e['page'] == 6 and e['entry_no'] == '8':
        e['house_no'] = "63"
        e['notes'] = (e.get('notes') or '') + \
            " | VAL 57 REVIZIJA hišne št.: 63 (val 57 midband '63' + bot-compact '6 loop, 3 two curves' + val 56 band_B) proti 66 (val 48/51 @667px) — Kurrent 3↔6; owner 'Brincz/Brinig Maria …' soglasen. Bot-compact je opombama no.7/no.8 pripisal 'B.P. 90. R.P. 37. 32.' skupaj — vrstni red opomb med vpisoma dvoumen; B.P. 90. ostaja pri no.7 (3 kampanje + midband)."
    # p27 veriga
    if e['page'] == 27 and e['entry_no'].startswith('5'):
        e['notes'] = (e.get('notes') or '') + \
            " | VAL 57: p26 native vsebuje VPISA 51 (h.27) + 52 (h.29) → aritmetična veriga zaprta: p27 verjetno 53/54, p28 55/56, p29 57/58, p30 59 ✓. Obstojni vpisni št. 51[?]/52[?] ostanejo kot prebrani, NE spremenjeni (prepoved ugibanja)."
    # p49 leto
    if e['page'] == 49 and e['entry_no'] == '97':
        e['notes'] = (e.get('notes') or '') + \
            " | VAL 57: LETO RAZREŠENO = 1825 (3:1) — val 57 closing-zoom digit-by-digit: zadnja št. '5' ('sharp horizontal top stroke, open bowl; lacks the closed bottom loop of a 6') + val 51/56 '1825' proti val 48 '1826'. Podpisnikova branja: 'Mumppen' + 'v Hillmayer' (val 57) ≈ 'Mumppen[?], Hollmayr[?]' (val 51). Ime: val 57 letter-by-letter 'Philipp De Giannuto Zucchelli' vs val 51 2× 'De Giammo' → imenska oblika ostaja REVIEW (ni rešeno z ugibanjem; glej audit §10)."

json.dump(reg, open(PATH, 'w'), ensure_ascii=False, indent=1)
print("register.json:", len(reg), "entries")

# page-records: p26/p42
pr = json.load(open(PR))
for p in pr:
    if p['page'] in (26, 42):
        p['status'] = "READ (native verzija, val 57)"
        p['native_entries'] = 2
        p['notes'] = "val 56: PDF-native ekstrakcija (1391×2145 / 1400×2151); val 57: branje — p26 vpisa 51+52, p42 vpisa 85+86 (86 parcele odrezane v samem viru)"
json.dump(pr, open(PR, 'w'), ensure_ascii=False, indent=1)
print("page-records.json updated")
