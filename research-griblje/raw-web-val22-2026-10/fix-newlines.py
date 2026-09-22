#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Popravek: realne nove vrstice znotraj storySi/storyEn MVG-109 → ubežni \n nizi."""
import re, io, sys

MC = "/home/z/my-project/src/lib/museum-content.ts"
mc = io.open(MC, encoding="utf-8").read()

def esc(seg):
    return seg.replace("\n", "\\n")

pat1 = re.compile(r'(storySi:\n      ")(.*?)(",\n    storyEn:)', re.S)
pat2 = re.compile(r'(storyEn:\n      ")(.*?)(",\n    evidenceStatus: "DOCUMENTED",\n    lat: 45\.5728,)', re.S)

def sub1(m):
    return m.group(1) + esc(m.group(2)) + m.group(3)
def sub2(m):
    return m.group(1) + esc(m.group(2)) + m.group(3)

mc2, n1 = pat1.subn(sub1, mc, count=1)
mc3, n2 = pat2.subn(sub2, mc2, count=1)
if n1 != 1 or n2 != 1:
    raise SystemExit(f"FAIL: n1={n1} n2={n2}")
if "storySi:\n      \"Šestnajst let, preden je Josip Kostanjevec na majhnem griču \\n" in mc3:
    raise SystemExit("FAIL: escape ni uspel")
io.open(MC, "w", encoding="utf-8", newline="").write(mc3)
print("OK: storySi/storyEn ubežni nizi.")
