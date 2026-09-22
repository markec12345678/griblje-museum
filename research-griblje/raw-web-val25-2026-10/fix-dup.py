# popravek vgradnje 25. vala: odstrani podvojeni blok commons-panorama iz MVG-001
# (napaka pri sestavljanju NEW_001 — blok, ki že obstaja prej v MVG-001, je bil vstavljen še enkrat)
import sys, io

MC = "/home/z/my-project/src/lib/museum-content.ts"

with io.open(MC, encoding="utf-8") as f:
    mc = f.read()

n0 = mc.count('key: "commons-panorama"')
if n0 != 2:
    print(f"FAIL: pričakovano 2 pojavitev commons-panorama (izvirnik + podvojen), najdeno {n0}")
    sys.exit(1)

# blok, ki sem ga vstavil (identičen besedilu iz NEW_001 v ingest.py)
DUP = r'''      {
        key: "commons-panorama",
        nameSi: "Wikimedia Commons: Griblje, Črnomelj (panorama)",
        nameEn: "Wikimedia Commons: Griblje, Črnomelj (panorama)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (avtor: Eleassar)",
        url: WM("Griblje,_%C4%8Crnomelj.jpg"),
        noteSi:
          "Panorama vasi z verigo domačij — naslovna fotografija muzeja (izrez na pas zaselkov) in glavna slika zapisa o zaselkih.",
        noteEn:
          "The village panorama with its chain of homesteads — the museum's banner photograph (cropped to the hamlet line) and the main image of the record on the hamlets.",
      },
'''
c = mc.count(DUP)
if c != 2:
    print(f"FAIL: blok commons-panorama najden {c}x z natančnim vzorcem (pričakovano 2)")
    sys.exit(1)

# odstrani ENO pojavitev — tisto, ki sledi novemu viru commons-kolpa-griblje-2002
ANCHOR = r'''          "Wave 25 — an earlier photograph of the river at Griblje from the Commons category Griblje: the pair of main-image views (2005/2012) gains a third, earlier date.",
      },
''' + DUP
NEW = r'''          "Wave 25 — an earlier photograph of the river at Griblje from the Commons category Griblje: the pair of main-image views (2005/2012) gains a third, earlier date.",
      },
'''
if mc.count(ANCHOR) != 1:
    print("FAIL: sidro podvojenega bloka ni unikatno")
    sys.exit(1)

mc = mc.replace(ANCHOR, NEW, 1)

if mc.count('key: "commons-panorama"') != 1:
    print("FAIL: po odstranitvi ni več natanko 1 pojavitev")
    sys.exit(1)

with io.open(MC, "w", encoding="utf-8") as f:
    f.write(mc)

print("POPAVEK OK — commons-panorama podvojeni blok odstranjen, MVG-001 ima 10 virov")
