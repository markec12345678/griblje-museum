# val 121 — pasovni vrednostni re-read (F-OCI-05)

Artefakti v git: readings-v121.json (branja + sodbe), changes-v121.json (audit 100 sprememb), disputes-v121.json (vhodni seznam), skripte (make-valbands/adj/strip v ps-n83/ali tukaj).

`crops/` NI v git (1 GB PNG; regenerabilno iz raw strani):
```
python3 research-griblje/val121-valbands/make-digitcmp-v121.py ...   # primerjave stevk
python3 research-griblje/ps-n83/make-valbands-v121.py cal            # kalibracija
python3 research-griblje/ps-n83/make-valbands-v121.py vseg 17 outdir # vrednostni trakti
python3 research-griblje/val121-valbands/strip-v121.py 17            # 4-vrsticni trakti x12
python3 research-griblje/val121-valbands/adj-v121.py cells 17 287,291 # celice x12
```
