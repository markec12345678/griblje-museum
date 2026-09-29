# 114. val (99) — ISSUE #100: identitetna veriga F0000212 — hiša št. 73 v 1825 virih ne obstaja; SEM + Šopek (1937–39) re-verified

**Val:** 99 · **Issue:** #100 (PRVI REFERENČNI OBJEKT GRIBLJE — F0000212 → HIŠNA ŠT. → KATASTER → PARCELA → 3D → AR) · **Datum:** 29. 9. 2026
**Metoda:** deterministično, 0 VLM klicev (kvota 429 — pouk val 98), 3 prenešena zunanja artefakta z sha256
**Pravilo ne-podvajanja:** NR-05 (negative register, val 89) ostaja vir resnice za negativ — ta val ga izčrpno POTRDI in dopolni s sosesko 1825 + zunanji verifikacijo; ne uvaja novih trditev brez vira.

---

## 1. Kontekst — kaj zahteva Issue #100

Issue #100 zahteva dokazljivo verigo za prvi referenčni objekt:

**SEM F0000212 → konkretna hiša → hišna številka → zgodovinski kataster → zgodovinska parcela → današnja parcela → koordinata → 3D → AR**

Runda 1 (komentar lastnika, 28. 9. 2026) je dokazala: F0000212 VERIFIED, Niko Županič → Griblje VERIFIED, hiša št. 73 REVIEW (kandidat, ne dokaz), prehod na 3D izrecno prepovedan do končane identitete objekta.

**»Naslednji veliki korak«** po rundi 1: dokončati identiteto objekta — hišna številka → hišno ime → zgodovinski kataster → parcela. Ta val dela natanko to, kar je iz tega mogoče v peskovniku (in-repo 1825 viri + dostopni zunanji viri), brez VLM.

---

## 2. Glavna najdba: hiša št. 73 v 1825 virih NE obstaja

Deterministična preverba (`issue100-house73-check.py`, izhod `issue100-house73-summary.json`):

| Vir | Pokritost | Hiša 73 |
|---|---|---|
| PS N83 (Protocol der Grund-Parcellen, SI AS 176/N/N83/s/PS) | **str. 3–143, polna (141 strani, 2.871 vrstic)** | **0 vrstic** |
| PUA N83 (98 vpisov) | celoten | **0 vpisov** |
| house-register-1825.json (167 hiš) | celoten | **ni vnosa** |
| A01 building inventory (24 objektov, v1) | raster 1825 | **ni glife 73 / BP 73** |

To POTRDI in razširi **NR-05** (negative-result register: hiše 70–78, val 89 re-check pri 143/143): soseska je dokumentirana (72 in 74 ležita SILOM sosednja vpisa na p65), hiša 73 pa v celotnem protokolu ne obstaja.

### Soseska 1825 (hiše 65–80; ključni sosedje za prihodnjo triangulacijo)

| Hiša | PS vrstic | Strani | Lastniki (originalni zapisi) |
|---|---|---|---|
| 65–69 | 18–35 | več | (polna tabela v summary JSON) |
| 70 | 0 | — | PUA 1 (PUA-only hiša) |
| 71 | 0 | — | PUA 1 (PUA-only hiša) |
| **72** | 2 | p65 | **Wolfsloch Wolfgey** (Acker ×2) |
| **(73)** | **0** | **—** | **NE OBSTAJA** |
| **74** | 4 | p65, p69, p122 | **Tillek Wolfgey / Heidrich Peter / Kauc Miheljz** |
| 76 | 1 | p115 | Gritsch Mihlo |
| 79 | 1 | p50 | Lehning Michael |
| 80 | 14 | več | Gauding/Pavlin/Pavšič … |

---

## 3. Zunanji viri — re-verified (artefakti + sha256 v summary JSON)

1. **Šopek (Etnolog 10–11, 1937–1939)** — Katarina Županič, *Šopek poljskih cvetlic iz Gribelj v Beli Krajini*, odsek »Miko Zupanič (1841—1911)«:
   > »Miko Zupanič, v Beli Krajini in po sosednjih hrvatskih krajih splošna znana osebnost, **se je rodil na Krasincu h. št. 18. dne 28. decembra 1841** ter se je okrog l. 1873. preselil v Griblje, **kjer si je kupil hišo št. 73 in posestvo**.«
   → STATUS: **VERIFIED** (točen citat iz vira; PDF + fulltext shranjena v val99/)
   → dodatno: gradivo je zbrala in zapisala pokojna **Katarina Zupanič iz Gribelj 1894–1895** »po nagovoru svojega sina, ki je bil takrat gimnazijec v Novem mestu (1889 do 1897)« — t. i. sin je Niko Županič; članek omenja tudi »Zupaničevo hišo« kot družabno središče.

2. **SEM digitalne zbirke — lokacija Griblje**: »F0000212 Enonadstropna hiša na pero, **rojstna hiša dr. Nika Županiča**.« → STATUS: **VERIFIED** (stran re-fetched, artefakt shranjen)

3. **SEM razstava »Svetovljan iz Gribelj«**: »Dr. Niko Zupanič **(Griblje, 1. 12. 1876** – Ljubljana, 11. 9. 1961)« → STATUS: **VERIFIED** (artefakt shranjen)

---

## 4. Interpretacija — veriga #100 §8 po val 99

| Člen | Status pred | Status po val 99 | Dokaz |
|---|---|---|---|
| SEM F0000212 | VERIFIED | VERIFIED (re-check) | artefakt + sha256 |
| Rojstna hiša Nika Županiča | VERIFIED | VERIFIED (re-check) | artefakt + sha256 |
| Hišna št. 73 (Miko kupil ~1873) | REVIEW | **VERIFIED** | Šopek: točen citat iz vira |
| **F0000212 = št. 73** | TO_COLLECT | **INFERRED** | **konvergenca 2 neodvisnih virov**: SEM (rojstna hiša Nika; Niko rojen Griblje 1876) + Šopek (oče kupil št. 73 ~1873); enoten izrekovalni vir še manjka |
| Hiša 73 v 1825 virih | — | **NOT_FOUND** | NR-05 + val 99 izčrpna preverba (PS/PUA/HR/A01) |
| Zgodovinska parcela | TO_COLLECT | TO_COLLECT | **nov uvod**: ker 73 v 1825 ne obstaja, je 1825 atlas zanekrat slep — iskati POZNE vire |
| Današnja parcela / koordinata | TO_COLLECT | TO_COLLECT | nespremenjeno |
| 3D / AR | TO_COLLECT | TO_COLLECT | nespremenjeno (runda 1: »ne iščemo 3D na pamet«) |

**Ključni zgodovinski sklep (nov, dokumentiran):** hiša št. 73 v celotnem 1825 Protokolu grund-parcel ne obstaja, čeprav sosednji vpisi 72 in 74 stojita narazen na str. 65. Skladno z zgodbo o nakupu ~1873 (Šopek) to kaže, da je bila hiša št. 73 **zgrajena oz. številčena med 1825 in 1873** — zato mora identitetna veriga teči po **poznejših virih**, ne po franciscejskem atlasu 1825. To ni dokaz (možna je tudi zamenjava številčne serije 1825 → poznejša hišna št.), ampak usmerjena hipoteza s statusom NOT_FOUND/TO_COLLECT, kot zahteva issue #100.

---

## 5. Naslednje raziskovalne točke (iz summary `next_steps`)

1. **2. franciscejska izmera (KM ~1867–69) / eZKN** — hiša št. 73 → stavbni odtis + parcela (prvi vir, ki bi 73 lahko ujel s parcelo)
2. **Zemljiškoknjižni vpisi** (nekdanje k. apl. Griblje) — prenos št. 73 na Mika Županiča ~1873
3. **SEM fototeka po fondu/avtorju** — Županič & Vurnik terenska fotografija 1930 (runda 1, točka 5) — morda fotografija hiše 73
4. **Občinski/matricularni zapisi Griblje** — hišno ime družine Županič
5. **Šele potem** prostorska identifikacija: triangulacija s sosesko 1825 (72 = Wolfsloch, 74 = Tillek/Heidrich/Kauc) — če bo tedanja parcelna slika poznejšega vira ujemljiva s 1825 kompleksom

---

## 6. Artefakti val 99

- `research-griblje/val99/issue100-house73-check.py` — deterministični check (fail-fast, 0 VLM, brez omrežja)
- `research-griblje/val99/issue100-house73-summary.json` — izhod: soseska 1825 + 3 zunanja dokaza (citat + sha256) + veriga §8 + next_steps
- `research-griblje/val99/sopek-1937-1939.pdf` + `sopek-fulltext.txt` — vir 1 (Etnolog 10–11)
- `research-griblje/val99/sem-griblje-lokacije.html` — vir 2
- `research-griblje/val99/sem-svetovljan.html` — vir 3
- `tests/val99-issue100-house73.test.ts` — varovalke nad summary JSON + artefakti

## 7. Kaj ta val NE dela

- Ne spreminja atlas podatkov (KG/pass3/coverage/story/timeline vse NESPREMENJENE — ni VLM, ni novih transkriptov)
- Ne dviguje statusov nad pravila #100 (nič VERIFIED brez enotnega vira; identiteta ostaja INFERRED)
- Ne podvaja NR-05, ne regenerira negative register (ta je build-pass3 domena)
- Ne gradi 3D/AR (izrecno prepovedano do dokazane geometrije — runda 1)
