# 43. val (TASK 95) — konsolidacija dokazov N83: minimalni popravek
# Edina muzejska sprememba: PZ vir (MVG-001) — popravek števca koroboracije mlina:
# beseda »Mühle« je bila prebrana v VSEH 3 prehodih (ne 2 od 3); določilo »brez njiv«
# pa samo v najbolj osredotočenem prehodu. (Konsolidacija 43. vala, dokument 57.)
import sys, io

MC = "/home/z/my-project/src/lib/museum-content.ts"

def read(p):
    with io.open(p, encoding="utf-8") as f: return f.read()

def must(t, needle, n, label):
    c = t.count(needle)
    if c != n:
        print(f"FAIL {label}: najden {c}x, pričakovano {n}"); sys.exit(1)

mc = read(MC)

OLD_SI = "na koncu pa »mlin brez njiv« (potrjeno v dveh od treh prehodov)"
NEW_SI = "na koncu pa mlin (beseda Mühle prebrana v vseh treh prehodih; določilo »brez njiv« le v najbolj osredotočenem prehodu — konsolidacija 43. vala)"
OLD_EN = "and at the end a 'mill without arable fields' (confirmed in two of three passes)"
NEW_EN = "and at the end a mill (the word Mühle read in all three passes; the qualifier 'without arable fields' only in the most focused pass — consolidation, val 43)"

ALREADY = NEW_SI in mc
must(mc, 'museumNo: "MVG-001"', 1, "MVG-001 prisoten")

if ALREADY:
    print("museum-content.ts: popravek že vgrajen (idempotenten ponovni zagon)")
else:
    must(mc, OLD_SI, 1, "PZ noteSi star stavek")
    must(mc, OLD_EN, 1, "PZ noteEn star stavek")
    mc = mc.replace(OLD_SI, NEW_SI, 1)
    mc = mc.replace(OLD_EN, NEW_EN, 1)
    with io.open(MC, "w", encoding="utf-8") as f: f.write(mc)
    print("OK museum-content.ts: popravljen števec koroboracije mlina v PZ viru (SL+EN)")

print("VGRADNJA 43. VALA ZAKLJUČENA.")
