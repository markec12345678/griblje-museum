# 25. val — atomarna vgradnja (rep-strict: pisanje šele po zelenih kontrolah)
# +4 vrstice virov: commons-kolpa-griblje-2002 (MVG-001), commons-pond-panorama-2018 (MVG-016),
#   weiss-2018-castite-malenca (MVG-007, deljena identiteta), kamra-totter-hlevi (MVG-072)
# +1 nadgradnja vira: kamra-plosca (MVG-010) — natančen URL + opombe
# +2 obogatitvi zgodbe: MVG-007 (listina 1468 "mlin na Kolpi"), MVG-010 (plošča 1973)
# +konstante: 550→554 virov, 436→439 identitet (v 4 skriptah)
import sys, io

ROOT = "/home/z/my-project"
MC  = f"{ROOT}/src/lib/museum-content.ts"
AE  = f"{ROOT}/scripts/audit-entities.ts"
TE  = f"{ROOT}/scripts/test-entities.ts"
TTM = f"{ROOT}/scripts/test-timeline-map.ts"
RT  = f"{ROOT}/scripts/test-curator-red-team.ts"

def read(p):
    with io.open(p, encoding="utf-8") as f: return f.read()

def must_count(t, needle, n, label):
    c = t.count(needle)
    if c != n:
        print(f"FAIL {label}: najden {c}x, pričakovano {n}")
        print("  vzorec:", repr(needle[:90]))
        sys.exit(1)

def rep1(t, old, new, label):
    must_count(t, old, 1, label)
    return t.replace(old, new, 1)

# ─────────────────────────── 0) branje ───────────────────────────
mc = read(MC)

must_count(mc, 'slug: "griblje-vas"', 1, "MVG-001 prisoten")
must_count(mc, 'slug: "malenca"', 1, "MVG-007 prisoten")
must_count(mc, 'slug: "niko-zupanic"', 1, "MVG-010 prisoten")
must_count(mc, 'slug: "ribnik"', 1, "MVG-016 prisoten")
must_count(mc, 'slug: "ciril-totter"', 1, "MVG-072 prisoten")
must_count(mc, 'slug: "grybl-cevljar"', 1, "MVG-111 (zadnji) prisoten")
must_count(mc, 'museumNo: "MVG-111"', 1, "številka MVG-111")
for needle in ["commons-kolpa-griblje-2002", "commons-pond-panorama-2018",
               "weiss-2018-castite-malenca", "kamra-totter-hlevi"]:
    must_count(mc, f'key: "{needle}"', 0, f"dedup: {needle} še ne obstaja")
WEISS_NAME = "Weiss, Janez: Častite avstrijske hiše zvesti podložniki — v: Neumarkt – Möttling – Metlika (ur. J. Weiss), Belokranjski muzej Metlika 2018, str. 151–309"
must_count(mc, f'"{WEISS_NAME}"', 3, "3 obstoječe vrstice Weissovega vira (001/110/111)")

# ──────────────── 1) MVG-001: +2 vira (konec bloka pred sveti-vid) ────────────────
ANCHOR_001 = r'''    ],
  },
  {
    slug: "sveti-vid",'''

NEW_001 = r'''      {
        key: "commons-kolpa-griblje-2002",
        nameSi: "Wikimedia Commons: Kolpa griblje — reka pri Gribljah (fotograf: Savinjc, 15. 5. 2002)",
        nameEn: "Wikimedia Commons: Kolpa griblje — the river at Griblje (photographer: Savinjc, 15 May 2002)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (fotograf: Savinjc)",
        url: WM("Kolpa_griblje.jpg"),
        noteSi:
          "25. val — zgodnejša fotografija reke pri Gribljah iz kategorije Commons Griblje: razgledni par glavnih slik (2005/2012) dobi tretji, zgodnejši datum.",
        noteEn:
          "Wave 25 — an earlier photograph of the river at Griblje from the Commons category Griblje: the pair of main-image views (2005/2012) gains a third, earlier date.",
      },
      {
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
    ],
  },
  {
    slug: "sveti-vid",'''

mc = rep1(mc, ANCHOR_001, NEW_001, "vstavitvena točka MVG-001")

# ──────────────── 2) MVG-016: +1 vir (konec bloka pred belokranjska-hisa) ────────────────
ANCHOR_016 = r'''    ],
  },
  {
    slug: "belokranjska-hisa",'''

NEW_016 = r'''      {
        key: "commons-pond-panorama-2018",
        nameSi: "Wikimedia Commons: Pond Griblje — panorama ribnika (avtor: Alanorlic, 2. 12. 2018)",
        nameEn: "Wikimedia Commons: Pond Griblje — a panorama of the pond (author: Alanorlic, 2 Dec 2018)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (avtor: Alanorlic)",
        url: WM("Pond_Griblje.jpg"),
        noteSi:
          "25. val — panoramska fotografija ribnika (18.104 × 6.820 pik), posneta 2. 12. 2018: drug pogled poleg julijanskega posnetka (Uroš Novina) in portalnega opisa.",
        noteEn:
          "Wave 25 — a panoramic photograph of the pond (18,104 × 6,820 px), taken 2 Dec 2018: a second view beside the July shot (Uroš Novina) and the portal description.",
      },
    ],
  },
  {
    slug: "belokranjska-hisa",'''

mc = rep1(mc, ANCHOR_016, NEW_016, "vstavitvena točka MVG-016")

# ──────────────── 3) MVG-007: +1 deljeni vir (za commons-malenca) + zgodba 1468 ────────────────
ANCHOR_007 = r'''        noteSi: "Avtor in licenca preverjena na strani datoteke.",
        noteEn: "Author and licence verified on the file page.",
      },
      {
        key: "radio-odeon-mlini-malenca",'''

NEW_007 = r'''        noteSi: "Avtor in licenca preverjena na strani datoteke.",
        noteEn: "Author and licence verified on the file page.",
      },
      {
        key: "weiss-2018-castite-malenca",
        nameSi: "''' + WEISS_NAME + r'''",
        nameEn: "Weiss, Janez: \"Honour the Austrian house, faithful subjects\" — in: Neumarkt – Möttling – Metlika (ed. J. Weiss), Bela krajina Museum Metlika 2018, pp. 151–309",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.academia.edu/42040981/_%C4%8Castite_avstrijske_hi%C5%A1e_zvesti_podlo%C5%BEniki_",
        noteSi:
          "25. val — str. 186: listina 1468 (regest: Arnold, Die Urkunden III, str. 1177, št. 3971) o ustanovitvi treh večnih kaplanov pri sv. Nikolaju v Metliki našteva med darovanimi dobrinami Bernarda Katterja in žene Neže tudi mlin na Kolpi; lego mlina listina ne določa. Isti dokument, ki stoji že za zapis griblje-vas (24. val).",
        noteEn:
          "Wave 25 — p. 186: the 1468 deed (regest: Arnold, Die Urkunden III, p. 1177, no. 3971) founding three perpetual chaplains at St Nicholas in Metlika lists among the endowments of Bernard Katter and wife Agnes a mill on the Kolpa; the deed does not specify the mill's location. The same document already cited by the record griblje-vas (wave 24).",
      },
      {
        key: "radio-odeon-mlini-malenca",'''

mc = rep1(mc, ANCHOR_007, NEW_007, "vstavitvena točka MVG-007 (vir)")

SI_007_OLD = r'do takrat ostajata le slika in beseda.",'
SI_007_NEW = (r'do takrat ostajata le slika in beseda.\n\nZapis ima od 25. valu naprej tudi svoj najstarejši datum. '
  r'Listina iz leta 1468 (regest: Arnold, Die Urkunden III, str. 1177, št. 3971), s katero sta Bernard Katter in žena Neža '
  r'določila posest za tri večne kaplane pri sv. Nikolaju v Metliki, našteva med darovanimi dobrinami tudi mlin na Kolpi — '
  r'lego tega mlina listina ne določa, njegova omemba pa pove, da je bila mlinarska raba reke del gospodarstva ob Kolpi že '
  r'sredi petnajstega stoletja. Jez, brus in beseda malenca so torej starejši od vseh urbarjev, v katerih se vas omenja po imenu.",')
mc = rep1(mc, SI_007_OLD, SI_007_NEW, "MVG-007 storySi odstavek 1468")

EN_007_OLD = r'until then, the picture and the word remain.",'
EN_007_NEW = (r'until then, the picture and the word remain.\n\nFrom wave 25 onward this record also has its earliest date. '
  r'The deed of 1468 (regest: Arnold, Die Urkunden III, p. 1177, no. 3971), by which Bernard Katter and his wife Agnes endowed '
  r'three perpetual chaplains at St Nicholas in Metlika, lists a mill on the Kolpa among the endowed goods — the deed does not '
  r'specify where that mill stood, but its mention says that milling use of the river was part of the economy along the Kolpa '
  r'already in the mid-fifteenth century. The weir, the millstone and the word malenca are thus older than every urbar in which '
  r'the village is named.",')
mc = rep1(mc, EN_007_OLD, EN_007_NEW, "MVG-007 storyEn odstavek 1468")

# ──────────────── 4) MVG-010: nadgradnja kamra-plosca + zgodba plošča 1973 ────────────────
OLD_PLOSCA = r'''        key: "kamra-plosca",
        nameSi: "Kamra: Spominska plošča univ. profesorju dr. Niku Županiču v Gribljah (2018)",
        nameEn: "Kamra: The memorial plaque to Prof. Niko Županič in Griblje (2018)",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://www.kamra.si/",
      },'''

NEW_PLOSCA = r'''        key: "kamra-plosca",
        nameSi: "Kamra (Knjižnica Črnomelj; avtorja Andrej Črnič, Daniela Žunič): Spominska plošča univ. profesorju dr. Niku Županiču (Županiču) — Griblje (digitalizirano 11. 6. 2016)",
        nameEn: "Kamra (Črnomelj Library; authors Andrej Črnič, Daniela Žunič): The memorial plaque to Prof. Niko Županič — Griblje (digitised 11 Jun 2016)",
        sourceType: "fotografija",
        license: "CC BY-NC (avtorja: Andrej Črnič, Daniela Žunič; Knjižnica Črnomelj)",
        url: "https://www.kamra.si/mm-elementi/v-hisi-ki-je-stala-na-tem-kraju-se-je-rodil-univ-profesor/",
        noteSi:
          "25. val — natančen vnos s polnimi metapodatki: ploščo je leta 1973 dalo postaviti Belokranjsko muzejsko društvo; stoji na hiši, kjer je nekoč stala Zupaničeva rojstna hiša (lokacija Griblje). Fotografija iz leta 2013; biografski podatek o rojstvu 1. 12. 1876 v Gribljah usklajen z zapisom.",
        noteEn:
          "Wave 25 — the exact entry with full metadata: the plaque was erected in 1973 by the Bela krajina Museum Society; it stands on the house that replaced Županič's birth house (location Griblje). Photograph of 2013; the birth date 1 Dec 1876 in Griblje agrees with the record.",
      },'''

mc = rep1(mc, OLD_PLOSCA, NEW_PLOSCA, "nadgradnja kamra-plosca (MVG-010)")

SI_010_OLD = r'Muzej išče: katera od gribeljskih hiš »na pero« je to bila (hišna številka) in ali stoji še danes.",'
SI_010_NEW = (r'Muzej išče: katera od gribeljskih hiš »na pero« je to bila (hišna številka) in ali stoji še danes. '
  r'V spomin pa vas pričaka še na kraju samem: spominsko ploščo, ki jo je leta 1973 dalo postaviti Belokranjsko muzejsko '
  r'društvo in ki stoji na hiši, kjer je nekoč stala Zupaničeva rojstna hiša (vir: Kamra — Knjižnica Črnomelj; avtorja '
  r'Andrej Črnič in Daniela Žunič, fotografija 2013).",')
mc = rep1(mc, SI_010_OLD, SI_010_NEW, "MVG-010 storySi plošča")

EN_010_OLD = r"""The museum is looking for: which of Griblje's \"na pero\" houses it was (house number) and whether it still stands today.","""
EN_010_NEW = (r"""The museum is looking for: which of Griblje's \"na pero\" houses it was (house number) and whether it still stands today. """
  r"""And the village keeps the memory in place: a memorial plaque, erected in 1973 by the Bela krajina Museum Society, stands on the house """
  r"""that replaced Županič's birth house (source: Kamra — Črnomelj Library; authors Andrej Črnič and Daniela Žunič, photograph 2013).",""")
mc = rep1(mc, EN_010_OLD, EN_010_NEW, "MVG-010 storyEn plošča")

# ──────────────── 5) MVG-072: +1 vir (konec bloka virov) ────────────────
ANCHOR_072 = r'''        noteSi: "Glavna slika zapisa: maraton — disciplina, ki jo je domačija vzgojila (ilustrativno).",
        noteEn: "The record's main image: the marathon — the discipline this homestead raised (illustrative).",
      },
    ],'''

NEW_072 = r'''        noteSi: "Glavna slika zapisa: maraton — disciplina, ki jo je domačija vzgojila (ilustrativno).",
        noteEn: "The record's main image: the marathon — the discipline this homestead raised (illustrative).",
      },
      {
        key: "kamra-totter-hlevi",
        nameSi: "Kamra (Ljudska knjižnica Metlika, avtor Matjaž Rus): Bili so polni hlevi — pričevanje Cirila Tottera iz Gribelj, Gostišče Veselič Podzemelj, 23. 11. 2015",
        nameEn: "Kamra (Metlika Public Library, author Matjaž Rus): The stables were full — the testimony of Ciril Totter of Griblje, the Veselič inn at Podzemelj, 23 Nov 2015",
        sourceType: "fotografija",
        license: "CC BY-NC (avtor: Matjaž Rus; Ljudska knjižnica Metlika)",
        url: "https://www.kamra.si/mm-elementi/bili-so-polni-hlevi/",
        noteSi:
          "25. val — prireditev »Bili so polni hlevi« (23. 11. 2015): Ciril Totter iz Gribelj in Peter Pezdirec (Mikulaš) s Krasinca sta obujala spomine, ko so bili hlevi še polni živine; program je popestril glasbenik Marjan Končar. Digitalizirano 27. 11. 2015.",
        noteEn:
          "Wave 25 — the event 'The stables were full' (23 Nov 2015): Ciril Totter of Griblje and Peter Pezdirec (Mikulaš) of Krasinec recalled the days when the stables were full of livestock; the programme was enriched by musician Marjan Končar. Digitised 27 Nov 2015.",
      },
    ],'''

mc = rep1(mc, ANCHOR_072, NEW_072, "vstavitvena točka MVG-072")

# ──────────────── 6) konstante v skriptah ────────────────
ae = read(AE)
ae = rep1(ae,
  'if (srcN === 550) ok("550 vrstic virov"); else err(`vrstic virov: ${srcN}`);',
  'if (srcN === 554) ok("554 vrstic virov (25. val: +4 — Kolpa 2002 in ribnik panorama iz kategorije Commons Griblje, deljena listina 1468 na malenci, kamra pričevanje Cirila Totterja)"); else err(`vrstic virov: ${srcN}`);',
  "AE srcN")
ae = rep1(ae,
  'if (identities === 436) ok("436 identitet virov (24. val: +6 novih — celo Weissovo poglavje, cehovska knjiga, Kronika 2024, založniška stran; weiss-2018-castite kot ena identiteta)"); else err(`identitet: ${identities}`);',
  'if (identities === 439) ok("439 identitet virov (25. val: +3 — Kolpa 2002, ribnik panorama 2018, kamra pričevanje; kamra-plosca nadgrajena z gole domene na natančen vnos)"); else err(`identitet: ${identities}`);',
  "AE identities")
ae = rep1(ae,
  'if (shared === 62) ok("62 deljenih virov (24. val: + weiss-2018-castite deljen med griblje-vas, turski-vpadi-1524 in grybl-cevljar)"); else err(`deljenih: ${shared}`);',
  'if (shared === 62) ok("62 deljenih virov (25. val: weiss-2018-castite še na malenci — deljen med 4 zapise)"); else err(`deljenih: ${shared}`);',
  "AE shared")

te = read(TE)
te = rep1(te,
  'check(srcRows === 550, `T8.11 550 vrstic virov (${srcRows})`);',
  'check(srcRows === 554, `T8.11 554 vrstic virov (${srcRows})`);',
  "TE T8.11")
te = rep1(te,
  'check(od.counts?.exhibits === 111 && od.counts?.sources === 550, `T9.3 OpenData: 111 zapisov / 550 virov (${od.counts?.exhibits}/${od.counts?.sources})`);',
  'check(od.counts?.exhibits === 111 && od.counts?.sources === 554, `T9.3 OpenData: 111 zapisov / 554 virov (${od.counts?.exhibits}/${od.counts?.sources})`);',
  "TE T9.3")
te = rep1(te,
  'check(withKey === 550 && totalRows === 550, `T9.4 OpenData sourceKey 550/550 (${withKey}/${totalRows})`);',
  'check(withKey === 554 && totalRows === 554, `T9.4 OpenData sourceKey 554/554 (${withKey}/${totalRows})`);',
  "TE T9.4")
te = rep1(te,
  " *   T9  HTTP regresija             — 109/109 strani, 109/109 IIIF, OpenData 550,",
  " *   T9  HTTP regresija             — 111/111 strani, 111/111 IIIF, OpenData 554,",
  "TE glava komentar")

ttm = read(TTM)
ttm = rep1(ttm,
  'od.counts?.exhibits === 111 && od.counts?.sources === 550,\n      "T8.3 OpenData: 111 zapisov / 550 virov",',
  'od.counts?.exhibits === 111 && od.counts?.sources === 554,\n      "T8.3 OpenData: 111 zapisov / 554 virov",',
  "TTM T8.3")

rt = read(RT)
rt = rep1(rt,
  'check(sourceRows === 550, "R0.3 zbirka: 550 vrstic virov", String(sourceRows));',
  'check(sourceRows === 554, "R0.3 zbirka: 554 vrstic virov", String(sourceRows));',
  "RT R0.3")
rt = rep1(rt,
  'check(sourceRows === 550, "R16.2 550 vrstic virov");',
  'check(sourceRows === 554, "R16.2 554 vrstic virov");',
  "RT R16.2")

# ──────────────── 7) izhodne kontrole ────────────────
def chk(cond, msg):
    if not cond:
        print("FAIL:", msg); sys.exit(1)
    print("OK:", msg)

chk(mc.count('key: "commons-kolpa-griblje-2002"') == 1, "MVG-001: commons-kolpa-griblje-2002 vstavljen")
chk(mc.count('key: "commons-pond-panorama-2018"') == 1, "MVG-016: commons-pond-panorama-2018 vstavljen")
chk(mc.count('key: "weiss-2018-castite-malenca"') == 1, "MVG-007: weiss-2018-castite-malenca vstavljen")
chk(mc.count('key: "kamra-totter-hlevi"') == 1, "MVG-072: kamra-totter-hlevi vstavljen")
chk(mc.count('mm-elementi/v-hisi-ki-je-stala-na-tem-kraju-se-je-rodil-univ-profesor/') == 1, "MVG-010: natančen kamra URL")
chk(mc.count('mm-elementi/bili-so-polni-hlevi/') == 1, "MVG-072: kamra hlevi URL")
chk(mc.count(f'"{WEISS_NAME}"') == 4, "Weissova identiteta: 4 vrstice (001/007/110/111)")
chk(mc.count('url: "https://www.kamra.si/",') == 0, "0 vrstic z golo kamra.si domeno")
chk(mc.count("najstarejši datum") == 1, "MVG-007: odstavek 1468 v zgodbi")
chk(mc.count("leta 1973 dalo postaviti") == 2, "MVG-010: plošča 1973 v zgodbi in viru")

# pisanje šele po zelenih kontrolah
for p, t in [(MC, mc), (AE, ae), (TE, te), (TTM, ttm), (RT, rt)]:
    with io.open(p, "w", encoding="utf-8") as f:
        f.write(t)

print("VGRADNJA 25. VALA OK — +4 vrstice virov, 1 nadgradnja, 2 obogatitvi zgodbe, konstante v 4 skriptah")
