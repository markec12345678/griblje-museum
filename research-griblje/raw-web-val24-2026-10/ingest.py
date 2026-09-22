# 24. val — atomarna vgradnja (rep-strict: pisanje šele po zelenih kontrolah)
# MVG-110 turški-vpadi-1524 + MVG-111 grybl-cevljar + vir griblje-vas + opomba gbif-lunja
# + 2 postaji sprehodov + 25 i18n števcev + konstante v 6 skriptah
import re, sys, io

ROOT = "/home/z/my-project"
MC  = f"{ROOT}/src/lib/museum-content.ts"
WK  = f"{ROOT}/src/lib/walks.ts"
I18 = f"{ROOT}/src/lib/i18n.tsx"
AE  = f"{ROOT}/scripts/audit-entities.ts"
TE  = f"{ROOT}/scripts/test-entities.ts"
TTM = f"{ROOT}/scripts/test-timeline-map.ts"
ATM = f"{ROOT}/scripts/audit-timeline-map.ts"
RT  = f"{ROOT}/scripts/test-curator-red-team.ts"
AC  = f"{ROOT}/scripts/test-ai-curator.ts"

def esc(s: str) -> str:
    """Tekst -> enovrstični TS literal (\\n kot ubežno zaporedje)."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

def read(p):
    with io.open(p, encoding="utf-8") as f: return f.read()

def must_count(t, needle, n, label):
    c = t.count(needle)
    if c != n:
        print(f"FAIL {label}: '{needle[:60]}...' najden {c}x, pričakovano {n}"); sys.exit(1)

# ─────────────────────────── 1) museum-content.ts ───────────────────────────
mc = read(MC)

must_count(mc, "slug: \"bridke-izkusnje-1898\"", 1, "MVG-109 prisoten")
must_count(mc, "of MVG-109 resolved).\",", 1, "sidro konec MVG-109 (noteEn)")

def exhibit(slug, mvg, category, titleSi, titleEn, periodSi, periodEn,
            sumSi, sumEn, storySi, storyEn, yFrom, yTo, lat, lng):
    return f'''    {{
      slug: "{slug}",
      museumNo: "{mvg}",
      addedAt: "2026-09-22",
      category: "{category}",
      titleSi: "{esc(titleSi)}",
      titleEn: "{esc(titleEn)}",
      featured: false,
      periodSi: "{esc(periodSi)}",
      periodEn: "{esc(periodEn)}",
      summarySi:
        "{esc(sumSi)}",
      summaryEn:
        "{esc(sumEn)}",
      storySi:
        "{esc(storySi)}",
      storyEn:
        "{esc(storyEn)}",
      evidenceStatus: "DOCUMENTED",
      lat: {lat},
      lng: {lng},
      coordsApprox: true,
      yearFrom: {yFrom},
      yearTo: {yTo},
      sources: [
'''

SRC_WEISS_110 = '''        {
          key: "weiss-2018-castite",
          nameSi: "Weiss, Janez: Častite avstrijske hiše zvesti podložniki — v: Neumarkt – Möttling – Metlika (ur. J. Weiss), Belokranjski muzej Metlika 2018, str. 151–309",
          nameEn: "Weiss, Janez: \\"Honour the Austrian house, faithful subjects\\" — in: Neumarkt – Möttling – Metlika (ed. J. Weiss), Bela krajina Museum Metlika 2018, pp. 151–309",
          sourceType: "objava",
          license: "navedi vir / cite the source",
          url: "https://www.academia.edu/42040981/_%C4%8Castite_avstrijske_hi%C5%A1e_zvesti_podlo%C5%BEniki_",
          noteSi:
            "Celotno poglavje prebrano v 24. valu (159 strani HTML iz avtorjevega deponata na academia.edu; knjižna stran = datoteka N+150). Omembe Griblje: str. 182 (Katterji — \\'pet v Gribljah\\'; GStAPK, XX. HA, Ordensbriefarchiv 28955), str. 186 (listina 1468 — Bernard Katter in žena Neža: pet hub v Gribljah, mlin na Kolpi), str. 249 (Mykhula Malleschitsch von Grybl), str. 267 (listina HHStA 1556 z dobesednim nemškim citatom). Kanon poglavja potrjen tudi z recenzijo: Dular, Kronika 72 (2024) 1, str. 5–20, DOI 10.56420/Kronika.72.1.01.",
          noteEn:
            "The whole chapter read in wave 24 (159 HTML pages from the author's deposit on academia.edu; book page = file N+150). Mentions of Griblje: p. 182 (the Katters — \\'five in Griblje\\'; GStAPK, XX. HA, Ordensbriefarchiv 28955), p. 186 (the 1468 deed — Bernard Katter and wife Agnes: five hubs in Griblje, a mill on the Kolpa), p. 249 (Mykhula Malleschitsch von Grybl), p. 267 (the 1556 HHStA deed with the verbatim German quotation). The chapter's canon also confirmed by the review: Dular, Kronika 72 (2024) 1, pp. 5–20, DOI 10.56420/Kronika.72.1.01.",
        },
'''

SRC_HHSTA = '''        {
          key: "hhsta-m-25-1556",
          nameSi: "HHStA FHKA HA M-25, 1556, 6. 11., Metlika — pismo upravitelja Sebastjana Römerja baronu Turn und zum Kreutzu (citirano po Weiss 2018, str. 267)",
          nameEn: "HHStA FHKA HA M-25, 6 Nov 1556, Metlika — letter of the administrator Sebastjan Römer to Baron Turn und zum Kreutzu (quoted after Weiss 2018, p. 267)",
          sourceType: "arhiv",
          license: "arhivsko gradivo / archival material",
          url: null,
          noteSi:
            "Hofkammerarhiv Dunaj, Herrschaftsarchiv Metlika, fascikel M-25 — najstarejša znana primarna listina, ki imenuje Griblje: \\'das dorf Griblach … gannz oedd gewesst unnd etlich Jarr oedd peliben\\'. Original na Dunaju; celotno nemško besedilo dobesedno objavljeno pri Weiss 2018, str. 267 (prvič Weiss, In conterminiis, str. 53–54). Neposreden arhivski dostop TO_COLLECT.",
          noteEn:
            "Hofkammer Archive, Vienna, Herrschaftsarchiv Metlika, fascicle M-25 — the oldest known primary document naming Griblje: \\'das dorf Griblach … gannz oedd gewesst unnd etlich Jarr oedd peliben\\'. The original is in Vienna; the full German text is published verbatim in Weiss 2018, p. 267 (first in Weiss, In conterminiis, pp. 53–54). Direct archival access TO_COLLECT.",
        },
'''

SRC_DULAR = '''        {
          key: "dular-kronika-2024",
          nameSi: "Dular, Janez: Gorjanske ceste in poti skozi čas, Kronika 72 (2024) 1, str. 5–20",
          nameEn: "Dular, Janez: Gorjanci Roads and Paths through Time, Kronika 72 (2024) 1, pp. 5–20",
          sourceType: "objava",
          license: "CC BY-SA 4.0",
          url: "https://ojs.inz.si/kronika/article/download/4319/4813/11522",
          noteSi:
            "Pregledni znanstveni članek arheologa Janeza Dularja (DOI 10.56420/Kronika.72.1.01, odprti dostop); bibliografski vnos potrjuje kanon Weissove knjige (poglavje str. 151–309), citira pa jo na str. 161–162, 245, 252 in 282 — neodvisna znanstvena potrditev vira tega zapisa.",
          noteEn:
            "A review article by the archaeologist Janez Dular (DOI 10.56420/Kronika.72.1.01, open access); its bibliography confirms the canon of Weiss's book (the chapter pp. 151–309) and it cites it on pp. 161–162, 245, 252 and 282 — an independent scholarly confirmation of this record's source.",
        },
'''

SRC_BMM = '''        {
          key: "belokranjski-muzej-metliski-grad",
          nameSi: "Belokranjski muzej Metlika: Metliški grad — založniška stran s dobesednim citatom knjige",
          nameEn: "Bela krajina Museum Metlika: Metliški grad — the publisher's page with a verbatim quotation of the book",
          sourceType: "spletni-vir",
          license: "avtorsko delo / copyrighted (navedba)",
          url: "https://belokranjski-muzej.si/post/858326/metliski-grad",
          noteSi:
            "Uradna stran muzeja-založnika citira knjigo dobesedno: \\'…(Janez Weiss: Častite avstrijske hiše zvesti podložniki: Neumarkt – Möttling – Metlika. Nastanek in razvoj mesta od konca 13. do začetka 19. stoletja (ur. Janez Weiss), Metlika: Belokranjski muzej Metlika, 2018, str. 163)\\' — potrjuje kanon (leto 2018, založba, urednik).",
          noteEn:
            "The official page of the museum-publisher quotes the book verbatim: \\'…(Janez Weiss: Častite avstrijske hiše zvesti podložniki: Neumarkt – Möttling – Metlika. Nastanek in razvoj mesta od konca 13. do začetka 19. stoletja (ur. Janez Weiss), Metlika: Belokranjski muzej Metlika, 2018, p. 163)\\' — confirming the canon (year 2018, publisher, editor).",
        },
'''

SRC_WEISS_111 = '''        {
          key: "weiss-2018-castite-grybl",
          nameSi: "Weiss, Janez: Častite avstrijske hiše zvesti podložniki — v: Neumarkt – Möttling – Metlika (ur. J. Weiss), Belokranjski muzej Metlika 2018, str. 151–309",
          nameEn: "Weiss, Janez: \\"Honour the Austrian house, faithful subjects\\" — in: Neumarkt – Möttling – Metlika (ed. J. Weiss), Bela krajina Museum Metlika 2018, pp. 151–309",
          sourceType: "objava",
          license: "navedi vir / cite the source",
          url: "https://www.academia.edu/42040981/_%C4%8Castite_avstrijske_hi%C5%A1e_zvesti_podlo%C5%BEniki_",
          noteSi:
            "Str. 249: cehovska knjiga kot dokaz, da bratje niso prihajali \\'le iz vrst meščanov Metlike, temveč tudi iz okoliških vasi in širšega Metliškega\\'; opomba 587 citira seznam: \\'…Mathia Sauer von unter Siemitsch; Mykhula Malleschitsch von Grybl; Michil Besekh von Starichou Verh\\' (vir: ABMM, Čevljarski ceh v Metliki, šk. 3, str. 10–11r); op. 580: knjiga danes v hrambi Belokranjskega muzeja Metlika; op. 581: ABMM, šk. 3, str. 16 — vzporeden vpis iz leta 1607.",
          noteEn:
            "P. 249: the guild book as proof that the brothers came not \\'only from among the burghers of Metlika but also from the surrounding villages and the wider Metlika region\\'; footnote 587 quotes the list: \\'…Mathia Sauer von unter Siemitsch; Mykhula Malleschitsch von Grybl; Michil Besekh von Starichou Verh\\' (source: ABMM, Čevljarski ceh v Metliki, box 3, pp. 10–11r); footnote 580: the book is today kept by the Bela krajina Museum in Metlika; footnote 581: ABMM, box 3, p. 16 — a parallel entry of 1607.",
        },
'''

SRC_ABMM = '''        {
          key: "abmm-cevljarski-ceh",
          nameSi: "ABMM: Čevljarski ceh v Metliki, šk. 3 — cehovska knjiga od 1587 (str. 10–11r)",
          nameEn: "ABMM: The Shoemakers\\' Guild of Metlika, box 3 — the guild book from 1587 (pp. 10–11r)",
          sourceType: "arhiv",
          license: "arhivsko gradivo / archival material",
          url: null,
          noteSi:
            "Cehovska knjiga metliških čevljarjev (Posten Antwerh, izpričan od 1587), deloma napisana v slovenščini — \\'prvovrstni jezikovni dokument\\'; danes v hrambi Belokranjskega muzeja Metlika. Vpis z gribeljskim imenom na str. 10–11r: \\'Mykhula Malleschitsch von Grybl\\'; sprejemniščina 1 renski goldin + barngelt (Weiss 2018, op. 583). Neposredni ogled knjige TO_COLLECT.",
          noteEn:
            "The guild book of the Metlika shoemakers (Posten Antwerh, attested from 1587), partly written in Slovene — \\'a first-rate linguistic document\\'; today kept by the Bela krajina Museum in Metlika. The entry with the Griblje name on pp. 10–11r: \\'Mykhula Malleschitsch von Grybl\\'; the admission fee of one Rhenish guilder plus barngelt (Weiss 2018, n. 583). Direct inspection of the book TO_COLLECT.",
        },
'''

SRC_GOLIA = '''        {
          key: "golia-slovenica",
          nameSi: "Golia, Slovenica, str. 214–222 — objava slovenskih odlomkov cehovske knjige",
          nameEn: "Golia, Slovenica, pp. 214–222 — publication of the Slovene segments of the guild book",
          sourceType: "objava",
          license: "navedi vir / cite the source",
          url: null,
          noteSi:
            "Reference po Weiss 2018, op. 580: \\'Objava slovenskih segmentov besedila v Golia, Slovenica, str. 214–222.\\' Podrobna bibliografija (letnica, polni naslov izdaje) TO_COLLECT.",
          noteEn:
            "Reference after Weiss 2018, n. 580: \\'Publication of the Slovene segments of the text in Golia, Slovenica, pp. 214–222.\\' A detailed bibliography (year, full title of the edition) TO_COLLECT.",
        },
'''

mvg110 = exhibit(
    "turski-vpadi-1524", "MVG-110", "vojna",
    "Turški vpadi 1524–1529 — vas popolnoma opustošena",
    "The Ottoman raids of 1524–1529 — the village laid completely waste",
    "1524–1556 · listina Hofkammerarhiva Dunaj (HHStA FHKA HA M-25, 6. 11. 1556)",
    "1524–1556 · deed of the Hofkammer Archive, Vienna (HHStA FHKA HA M-25, 6 Nov 1556)",
    "Najstarejša znana primarna listina o Gribljih ne pripoveduje o življenju, ampak o njegovem izgubu: upravitelj gospostva Metlika je leta 1556 pisal, da je vas »das dorf Griblach« po velikem turškem vpadu okrog leta 1524 in treh nadaljnjih stala »ganz öd« — popolnoma prazna — »in je več let ležala puščena«.",
    "The oldest known primary document about Griblje tells not of life but of its loss: the administrator of the estate of Metlika wrote in 1556 that after the great Ottoman raid of around 1524 and three further attacks the village — 'das dorf Griblach' — lay 'ganz öd', completely empty, 'and remained deserted for several years'.",
    """Listina, ki jo hrani Hofkammerarhiv na Dunaju (HHStA, FHKA, Herrschaftsarchiv Metlika, fascikel M-25), je nastala 6. novembra 1556: upravitelj gospostva Metlika Sebastjan Römer je poročal posestniku, Antoniju baronu Turn und zum Kreutzu, kaj so mu »stare osebe« in amtmann povedale o preteklosti dežele. Njegove besede so najstarejše znano primarno pričevanje, ki imenuje Griblje — in ne povedo ničesar o kruhu, cerkvi ali porokah, ampak o tem, kako je vas utihnila. Ob velikem turškem vpadu, »ungeverlichen im 1524 Jarß« — okrog leta 1524 — je »velika vojska Turkov neobjavljeno padla na to zemljo«; ves kraj je bil oropan, opustošen in zažgan, »da v mnogih vaseh ni ostala niti ena oseba«.

»Čez štiri in pet let zatem« so Turki po Römerjevem pismu padli na to zemljo »trikrat zapored« in delali veliko škode. In potem pride vrstica, ki jo ta muzej hrani kot eno najtežjih v svoji zbirki: »das dorf Griblach, Wadann, Prubintz, Marnndol, Prelog, Weydnitz unnd annder dorfer mer gannz oedd gewesst unnd etlich Jarr oedd peliben« — vas Griblje je stala popolnoma prazna in je »več let ležala puščena«. Sosedje na seznamu opustošenih vasi — med njimi Marindol in Prelog ob Kolpi — potegujejo mejno črto opustošenja prav čez gribeljska polja. Slika je tako gosta, da jo pismo poda celo v merah: še leta 1556, trideset let po vpadu, dve celi vasi »komaj zmoglita en plug«.

Römerjevo pismo ni kronika, ampak upravni dokument: baron je vpisoval zemljo in davke, upravitelj pa je moral povedati, katere hube so opustošene in kako dolgo ležijo prazne — to je razlog, da je vas sploh omenjena. Prav ta suhoparnost pa ji daje težo: ne pripoved, ne legenda, ampak odgovor uradnika, ki je spraševal po starih ljudeh. Besedilo je do nas prišlo po dveh rokah: Weiss ga je objavil najprej v razpravi In conterminiis (str. 53–54), nato — dobesedno, v izvirni nemščini — v poglavju Častite avstrijske hiše zvesti podložniki (Neumarkt – Möttling – Metlika, ur. J. Weiss, Belokranjski muzej Metlika 2018, str. 267). Ta zapis temelji na celotnem prebranem poglavju (159 strani), v katerem je to edina listina, ki Griblje imenuje po imenu.

Zgodba ima svoj red, ki ga vas pozna: vstala je spet. Leta 1468 je gribeljskih pet hub še darovalo kaplanom v Metliki, leta 1490 vas kot Briglach šteje urbar, okrog leta 1524 pa je po Römerjevem pismu utihnila — in se vrnila: v listinah konca 16. stoletja je spet na zemljevidu, cvet pa ji nosi zapiski, ki jih ta muzej zbira naprej. Turški vpadi so zgodovina, ki jo Bela krajina nosi v zemljevidu — in v domačih imenih. Muzej išče: domače pripovedi o turških časih (Tatar, Turk), toponime, ki bi jih spominjali, in sosede, ki poznajo vasi Wadann, Prubintz in Weydnitz — naselja, ki so opustošenje delile z Griblji.""",
    """The deed kept by the Hofkammer Archive in Vienna (HHStA, FHKA, Herrschaftsarchiv Metlika, fascicle M-25) was written on 6 November 1556: the administrator of the estate of Metlika, Sebastjan Römer, reported to the estate's owner, Anton Baron Turn und zum Kreutzu, what 'old persons' and the amtmann had told him of the land's past. His words are the oldest known primary testimony naming Griblje — and they say nothing of bread, church or weddings, but of how the village fell silent. In the great Ottoman raid, 'ungeverlichen im 1524 Jarß' — around the year 1524 — 'a great army of Turks fell unannounced upon this land'; the whole country was plundered, devastated and burned, 'so that in many villages not a single person remained'.

'About four and five years afterwards' the Turks, by Römer's letter, fell upon this land 'three times in a row' and did great damage. And then comes the line this museum keeps as one of the heaviest in its collection: 'das dorf Griblach, Wadann, Prubintz, Marnndol, Prelog, Weydnitz unnd annder dorfer mer gannz oedd gewesst unnd etlich Jarr oedd peliben' — the village of Griblje stood completely empty and 'remained deserted for several years'. The neighbours on the list of devastated villages — among them Marindol and Prelog on the Kolpa — draw the frontier of devastation straight across the Griblje fields. The picture is so dense that the letter gives it even in measures: still in 1556, thirty years after the raid, two whole villages 'could barely raise a single plough'.

Römer's letter is not a chronicle but an administrative document: the baron was entering land and taxes, and the administrator had to say which hubs were devastated and how long they lay empty — that is why the village is mentioned at all. And it is precisely this dryness that gives it weight: not a narrative, not a legend, but the answer of an official who had asked the old people. The text reached us through two hands: Weiss published it first in the study In conterminiis (pp. 53–54) and then — verbatim, in the original German — in the chapter Častite avstrijske hiše zvesti podložniki (Neumarkt – Möttling – Metlika, ed. J. Weiss, Bela krajina Museum Metlika 2018, p. 267). This record rests on the whole chapter as read (159 pages), in which it is the single deed naming Griblje by name.

The story has the order the village knows: it rose again. In 1468 the five Griblje hubs still endowed chaplains in Metlika, in 1490 the urbar counts the village as Briglach, around 1524 it fell silent by Römer's letter — and returned: in the documents of the late 16th century it is back on the map, and the flowering it owes to the notes this museum keeps collecting. The Ottoman raids are a history Bela krajina carries in its map — and in its local names. The museum is looking for: domestic tales of the Turkish times (Tatar, Turk), toponyms that might remember them, and neighbours who know the villages of Wadann, Prubintz and Weydnitz — the settlements that shared the devastation with Griblje.""",
    1524, 1556, 45.57246, 15.29257,
)

mvg110_full = mvg110 + SRC_WEISS_110 + SRC_HHSTA + SRC_DULAR + SRC_BMM + "      ],\n    },\n"

mvg111 = exhibit(
    "grybl-cevljar", "MVG-111", "gospodarstvo",
    "Mykhula Malleschitsch von Grybl — gribeljski čevljar v metliškem cehu",
    "Mykhula Malleschitsch von Grybl — a Griblje shoemaker in the Metlika guild",
    "zgodnje 17. stoletje · cehovska knjiga čevljarjev Metlike (ABMM, šk. 3, str. 10–11r)",
    "early 17th century · the guild book of the Metlika shoemakers (ABMM, box 3, pp. 10–11r)",
    "V cehovski knjigi metliških čevljarjev — dokumentu od leta 1587, ki ga danes hrani Belokranjski muzej Metlika in je deloma napisan v slovenščini — stoji med brati iz okoliških vasi tudi ime Mykhula Malleschitsch von Grybl: prvi imenovani gribeljski obrtnik v mestni instituciji in nova ortografska različica imena vasi (Grybl).",
    "In the guild book of the Metlika shoemakers — a document from 1587, today kept by the Bela krajina Museum in Metlika and partly written in Slovene — among the brothers from the surrounding villages stands a name from Griblje: Mykhula Malleschitsch von Grybl. The first named craftsman of the village inside a town institution — and a new orthographic form of the village's name (Grybl).",
    """Ceh čevljarjev v Metliki — Posten Antwerh, »postena bratovščina« — je izrecno izpričan od leta 1587, njegova cehovska knjiga pa je eden najdražjih dokumentov mesta: prvi dokaz obrtne organiziranosti in hkrati »prvovrstni jezikovni dokument«, saj je deloma pisana v slovenščini. Ceh sta vodila dva cehovska mojstra (Zechmaister, cehmeshter) s ključarjem (schlissel Inhaber) in blagajnikom (Pixen inhaber); bratje so se zbrali štirikrat letno, na skupščini je bilo podano poročilo (Raitung) in opravljen skupni obed (Maltzeit). Knjiga je danes v hrambi Belokranjskega muzeja Metlika (ABMM, Čevljarski ceh v Metliki, šk. 3); slovenske odlomke je objavil Golia (Slovenica, str. 214–222).

In v tej knjigi, med brati, ki niso prihajali »le iz vrst meščanov Metlike, temveč tudi iz okoliških vasi in širšega Metliškega«, stoji vrstica z gribeljskim imenom: Mykhula Malleschitsch von Grybl (knjiga, str. 10–11r). Ob njem Jannesche Franckh zu Krupp, Jury Molleschitsch von Gradez, Mathia Sauer von unter Siemitsch, Michil Besekh von Starichou Verh — seznam okoliških vasi, ki so svoje može pošiljale v mestno obrt. »Von Grybl« je zapis, kakršnega ta zbirka še ni imela: pisar je vas zapisal, kot jo je slišal — Grybl, brez zaključnega -ach. Nova varianta v verigi, ki sicer glasi Briglach (1490), Griblach (1468, 1556), Griblah (1593) in Grüble.

Za imenom stoji življenje: sprejemniščina ceha je znašala en renski goldin, novi bratje pa so plačali še barngelt; zveza z mestom je obrtniku dala pravico do obrti in cehovsko pomoč — in vas povezala z mestnim trgom. Vpis je tudi časovni znak: zgodnje 17. stoletje, komaj osemdeset let po tem, ko je pismo iz Hofkammerarhiva zapisalo »das dorf Griblach … gannz oedd gewesst« (zapis turški-vpadi-1524). Vas, ki je po vpadih »več let ležala puščena«, je torej do začetka 17. stoletja že spet pošiljala svoje može v mestne cehove — to je najkrajša formulacija nadaljevanja, ki ga ta muzej dokumentira.

Muzej išče: ali priimek Malleschitsch — zapisan v pisarjevi nemščini — uspe povezati z domačim priimkom (Malešič?)? Ali ima Mykhula naslednike v vasi? In ali se med stranicami cehovske knjige skriva še katero gribeljsko ime? Cehovska knjiga je v Metliki — in prvič v zgodovini tega muzeja je glavni vir o vasi hranjenec muzeja, ki stoji kakih dvajset kilometrov od vasi.""",
    """The shoemakers' guild of Metlika — Posten Antwerh, the 'honourable brotherhood' — is explicitly attested from 1587, and its guild book is one of the town's most precious documents: the first proof of craft organisation and at the same time 'a first-rate linguistic document', for it is partly written in Slovene. The guild was led by two guild masters (Zechmaister, cehmeshter) with a key-keeper (schlissel Inhaber) and a treasurer (Pixen inhaber); the brothers gathered four times a year, the assembly heard a report (Raitung) and shared a common meal (Maltzeit). The book is today kept by the Bela krajina Museum in Metlika (ABMM, Čevljarski ceh v Metliki, box 3); the Slovene segments were published by Golia (Slovenica, pp. 214–222).

And in this book, among the brothers who came not 'only from among the burghers of Metlika but also from the surrounding villages and the wider Metlika region', stands a line with a Griblje name: Mykhula Malleschitsch von Grybl (the book, pp. 10–11r). Beside him Jannesche Franckh zu Krupp, Jury Molleschitsch von Gradez, Mathia Sauer von unter Siemitsch, Michil Besekh von Starichou Verh — a list of the villages that sent their men into the town's crafts. 'Von Grybl' is a spelling this collection has never seen: the scribe wrote the village as he heard it — Grybl, without the final -ach. A new variant in the chain that otherwise reads Briglach (1490), Griblach (1468, 1556), Griblah (1593) and Grüble.

Behind the name stands a life: the guild's admission fee was one Rhenish guilder, and new brothers paid the barngelt besides; the bond with the town gave a craftsman the right to his trade and the guild's protection — and tied the village to the town market. The entry is also a mark in time: the early 17th century, barely eighty years after the letter from the Hofkammer Archive recorded 'das dorf Griblach … gannz oedd gewesst' (record turski-vpadi-1524). A village that after the raids 'lay deserted for years' was, by the beginning of the 17th century, already sending its men into the town guilds again — the shortest formulation of the continuation this museum documents.

The museum is looking for: can the surname Malleschitsch — written in the scribe's German — be tied to a domestic family name (Malešič?)? Does Mykhula have descendants in the village? And does another Griblje name hide among the pages of the guild book? The guild book is in Metlika — and for the first time in this museum's history the chief source on the village is kept by a museum some twenty kilometres from the village itself.""",
    1587, 1612, 45.57246, 15.29257,
)

mvg111_full = mvg111 + SRC_WEISS_111 + SRC_ABMM + SRC_GOLIA + "      ],\n    },\n"

# vstavi pred konec seedExhibits
anchor_arr_end = "of MVG-109 resolved).\",\n      },\n    ],\n  },\n];"
must_count(mc, anchor_arr_end, 1, "konec seedExhibits")
mc_new = mc.replace(anchor_arr_end, "of MVG-109 resolved).\",\n      },\n    ],\n  },\n" + mvg110_full + mvg111_full + "];")

# griblje-vas: + vir weiss-2018-castite za commons-griblje(-kategorija)
gv_anchor = '''        key: "commons-griblje-kategorija",'''
must_count(mc_new, gv_anchor, 1, "griblje-vas commons kategorija")
# najdi konec tega vira (najbližji "      },\n" po key: commons-griblje-kategorija)
i = mc_new.find(gv_anchor)
j = mc_new.find("      },\n", i)
if j < 0: print("FAIL konec vira commons-griblje-kategorija"); sys.exit(1)
gv_end = j + len("      },\n")
GV_SRC = '''      {
        key: "weiss-2018-castite-vas",
        nameSi: "Weiss, Janez: Častite avstrijske hiše zvesti podložniki — v: Neumarkt – Möttling – Metlika (ur. J. Weiss), Belokranjski muzej Metlika 2018, str. 151–309",
        nameEn: "Weiss, Janez: \\"Honour the Austrian house, faithful subjects\\" — in: Neumarkt – Möttling – Metlika (ed. J. Weiss), Bela krajina Museum Metlika 2018, pp. 151–309",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.academia.edu/42040981/_%C4%8Castite_avstrijske_hi%C5%A1e_zvesti_podlo%C5%BEniki_",
        noteSi:
          "24. val — celotno poglavje prebrano (159 strani): str. 186 — listina 1468 o ustanovitvi treh večnih kaplanov pri sv. Nikolaju v Metliki (regest: Arnold, Die Urkunden III, str. 1177, št. 3971): \\'Bernard Katter in žena Neža šest hub v Ravnacah, pet v Gribljah, mlin na Kolpi, hišo v mestu …\\' — neodvisna, datirana potrditev prve omembe 1468; str. 182 — Katterji, \\'pet v Gribljah\\' (GStAPK, XX. HA, Ordensbriefarchiv 28955); str. 267 — listina HHStA 1556: \\'das dorf Griblach … gannz oedd\\' po turških vpadih 1524–29 (zapis turski-vpadi-1524).",
        noteEn:
          "Wave 24 — the whole chapter read (159 pages): p. 186 — the 1468 deed founding three perpetual chaplains at St Nicholas in Metlika (regest: Arnold, Die Urkunden III, p. 1177, no. 3971): \\'Bernard Katter and wife Agnes, six hubs in Ravnace, five in Griblje, a mill on the Kolpa, a house in the town …\\' — an independent, dated confirmation of the first mention of 1468; p. 182 — the Katters, \\'five in Griblje\\' (GStAPK, XX. HA, Ordensbriefarchiv 28955); p. 267 — the 1556 HHStA deed: \\'das dorf Griblach … gannz oedd\\' after the Ottoman raids of 1524–29 (record turski-vpadi-1524).",
      },
'''
mc_new = mc_new[:gv_end] + GV_SRC + mc_new[gv_end:]

# MVG-105 gbif-lunja: add-only opomba (Poganjec verbatim + iNat places 0)
gb_anchor_si = "Istega dne druga opazovanja lunje (tudi zapis 5279974550) in še štiri vrste na isti lokaliteti.\","
must_count(mc_new, gb_anchor_si, 1, "gbif-lunja noteSi konec")
mc_new = mc_new.replace(gb_anchor_si,
  "Istega dne druga opazovanja lunje (tudi zapis 5279974550) in še štiri vrste na isti lokaliteti. 24. val: GBIF polje locality izrecno vodi ime »Poganjec« (verbatim) — raba toponima je zdaj dokumentirana kot samostojna lokaliteta svetovne baze; poizvedba iNaturalist places »Poganjec« vrne 0 place-enot (brez uradne enote; domačinska potrditev toponima ostaja odprta).\",")
gb_anchor_en = "A second harrier observation the same day (record 5279974550) and four more species at the same locality.\","
must_count(mc_new, gb_anchor_en, 1, "gbif-lunja noteEn konec")
mc_new = mc_new.replace(gb_anchor_en,
  "A second harrier observation the same day (record 5279974550) and four more species at the same locality. Wave 24: the GBIF locality field carries the name 'Poganjec' verbatim — the toponym's use is now documented as a freestanding locality of the world database; an iNaturalist places query for 'Poganjec' returns 0 place objects (no official unit; the villagers' confirmation of the toponym remains open).\",")

# ─────────────────────────── 2) walks.ts — 2 postaji ───────────────────────────
wk = read(WK)

w4_anchor = "Today music, too, leads from Griblje into the world — all the way to Bern.\",\n      },\n    ],"
must_count(wk, w4_anchor, 1, "konec sprehoda iz-gribelj-v-svet")
W4_STOP = '''      {
        exhibitSlug: "grybl-cevljar",
        noteSi:
          "In obrt, ki je potovala v mesto: v cehovski knjigi metliških čevljarjev stoji med brati iz vasi tudi »Mykhula Malleschitsch von Grybl« — prvo imenovano gribeljsko ime v mestni instituciji, zapisano v obliki, kakršne zbirka še ni imela (Grybl).",
        noteEn:
          "And the craft that travelled to town: in the guild book of the Metlika shoemakers, among the brothers from the villages, stands 'Mykhula Malleschitsch von Grybl' — the first named Griblje name inside a town institution, written in a form the collection had never seen (Grybl).",
      },
'''
wk_new = wk.replace(w4_anchor, "Today music, too, leads from Griblje into the world — all the way to Bern.\",\n      },\n" + W4_STOP + "    ],")

w5_anchor = "the village as a stage, not merely a backdrop.\",\n      },\n    ],"
must_count(wk_new, w5_anchor, 1, "konec sprehoda vas-in-njeni-ljudje")
W5_STOP = '''      {
        exhibitSlug: "turski-vpadi-1524",
        noteSi:
          "Najtežja postaja: listina Hofkammerarhiva iz leta 1556 zapisuje, da je bilo »das dorf Griblach« po turških vpadih okrog leta 1524 »gannz oedd« — popolnoma prazno — in da je »več let ležalo puščeno«. Vas, ki je utihnila in se vrnila.",
        noteEn:
          "The hardest stop: a 1556 deed of the Vienna Hofkammer Archive records that 'das dorf Griblach' after the Ottoman raids of around 1524 stood 'gannz oedd' — completely empty — and 'remained deserted for several years'. A village that fell silent and came back.",
      },
'''
wk_new = wk_new.replace(w5_anchor, "the village as a stage, not merely a backdrop.\",\n      },\n" + W5_STOP + "    ],")

# ─────────────────────────── 3) i18n.tsx — 25 števcev ───────────────────────────
i18 = read(I18)
must_count(i18, "109", 20, "i18n številske pojavitve 109")
must_count(i18, "One hundred and nine", 1, "i18n EN hero besedni")
must_count(i18, "one hundred and nine", 1, "i18n EN search besedni")
must_count(i18, "Sto devet", 1, "i18n HR besedni")
must_count(i18, "Hundertneun", 1, "i18n DE besedni")
must_count(i18, "Cento nove", 1, "i18n IT besedni")
i18_new = i18
i18_new = i18_new.replace("One hundred and nine records, one river", "One hundred and eleven records, one river")
i18_new = i18_new.replace("at one hundred and nine records", "at one hundred and eleven records")
i18_new = i18_new.replace("Sto devet zapisa, jedna rijeka", "Sto enajst zapisa, jedna rijeka")
i18_new = i18_new.replace("Hundertneun Einträge, ein Fluss", "Hundertelf Einträge, ein Fluss")
i18_new = i18_new.replace("Cento nove schede, un fiume", "Cento undici schede, un fiume")
i18_new = i18_new.replace("109", "111")
must_count(i18_new, "111", 20, "i18n številske pojavitve 111 po zamenjavi")
must_count(i18_new, "One hundred and eleven", 1, "i18n EN hero novi")
must_count(i18_new, "one hundred and eleven", 1, "i18n EN search novi")
must_count(i18_new, "Sto enajst", 1, "i18n HR novi")
must_count(i18_new, "Hundertelf", 1, "i18n DE novi")
must_count(i18_new, "Cento undici", 1, "i18n IT novi")

# ─────────────────────────── 4) skriptne konstante ───────────────────────────
ae = read(AE)
ae_new = (ae
  .replace('if (exN === 109) ok("109/109 zapisov")', 'if (exN === 111) ok("111/111 zapisov")')
  .replace('if (mvgN === 109) ok("109/109 muzejskih številk")', 'if (mvgN === 111) ok("111/111 muzejskih številk")')
  .replace('if (srcN === 542) ok("542 vrstic virov")', 'if (srcN === 550) ok("550 vrstic virov")')
  .replace('if (identities === 430) ok("430 identitet virov (23. val: +1 vir SBL sbi753104 — identiteta psevdonima Pivčan rešena; 22. val: +4 nova virov, -1 koren slovenska-biografija.si)")',
           'if (identities === 436) ok("436 identitet virov (24. val: +6 novih — celo Weissovo poglavje, cehovska knjiga, Kronika 2024, založniška stran; weiss-2018-castite kot ena identiteta)")')
  .replace('if (shared === 61) ok("61 deljenih virov (sbi915246 zdaj pravično deljen: niko-zupanic + katarina-zupanic)")',
           'if (shared === 62) ok("62 deljenih virov (24. val: + weiss-2018-castite deljen med griblje-vas, turski-vpadi-1524 in grybl-cevljar)")')
)
te = read(TE)
te_new = (te
  .replace("OpenData 541,", "OpenData 550,")
  .replace('check(bySlug.size === 109, "T7.5 zapisa MVG-014 in MVG-056 ostajata LOČENA zapisa (109/109)")',
           'check(bySlug.size === 111, "T7.5 zapisa MVG-014 in MVG-056 ostajata LOČENA zapisa (111/111)")')
  .replace('check(seedExhibits.length === 109, `T8.1 109/109 zapisov (${seedExhibits.length})`)',
           'check(seedExhibits.length === 111, `T8.1 111/111 zapisov (${seedExhibits.length})`)')
  .replace('check(seedExhibits.filter((e) => /^MVG-\\d{3}$/.test(e.museumNo ?? "")).length === 109, "T8.2 109/109 muzejskih številk MVG")',
           'check(seedExhibits.filter((e) => /^MVG-\\d{3}$/.test(e.museumNo ?? "")).length === 111, "T8.2 111/111 muzejskih številk MVG")')
  .replace('check(SOURCE_USAGE.size === 430, `T8.6 430 identitet virov (${SOURCE_USAGE.size})`)',
           'check(SOURCE_USAGE.size === 436, `T8.6 436 identitet virov (${SOURCE_USAGE.size})`)')
  .replace('check(shared === 61, `T8.7 61 deljenih virov (${shared})`)',
           'check(shared === 62, `T8.7 62 deljenih virov (${shared})`)')
  .replace('check(srcRows === 542, `T8.11 542 vrstic virov (${srcRows})`)',
           'check(srcRows === 550, `T8.11 550 vrstic virov (${srcRows})`)')
  .replace('check(okPages === 109, `T9.1 109/109 objektnih strani (${okPages}; ${badPages.join(",") || "vse 200"})`)',
           'check(okPages === 111, `T9.1 111/111 objektnih strani (${okPages}; ${badPages.join(",") || "vse 200"})`)')
  .replace('check(okManifests === 109 && withSources === 109, `T9.2 109/109 IIIF manifestov z viri (${okManifests} manifestov, ${withSources} z ≥1 virom)`)',
           'check(okManifests === 111 && withSources === 111, `T9.2 111/111 IIIF manifestov z viri (${okManifests} manifestov, ${withSources} z ≥1 virom)`)')
  .replace('check(od.counts?.exhibits === 109 && od.counts?.sources === 542, `T9.3 OpenData: 109 zapisov / 542 virov (${od.counts?.exhibits}/${od.counts?.sources})`)',
           'check(od.counts?.exhibits === 111 && od.counts?.sources === 550, `T9.3 OpenData: 111 zapisov / 550 virov (${od.counts?.exhibits}/${od.counts?.sources})`)')
  .replace('check(withKey === 542 && totalRows === 542, `T9.4 OpenData sourceKey 542/542 (${withKey}/${totalRows})`)',
           'check(withKey === 550 && totalRows === 550, `T9.4 OpenData sourceKey 550/550 (${withKey}/${totalRows})`)')
)
ttm = read(TTM)
ttm_new = (ttm
  .replace('check(objectLayer(exhibits).length === 34, "T5.12 objectLayer: 34 zapisov s preverjeno lego (22. val: + MVG-109)")',
           'check(objectLayer(exhibits).length === 36, "T5.12 objectLayer: 36 zapisov s preverjeno lego (24. val: + MVG-110/111)")')
  .replace('check(rows === 542, "T7.2 542 vrstic virov", `=${rows}`)',
           'check(rows === 550, "T7.2 550 vrstic virov", `=${rows}`)')
  .replace('check(SOURCE_USAGE.size === 430, "T7.3 430 identitet virov (23. val: +1 vir SBL sbi753104 — identiteta Pivčana rešena; 22. val: -1 koren slovenska-biografija.si)", `=${SOURCE_USAGE.size}`)',
           'check(SOURCE_USAGE.size === 436, "T7.3 436 identitet virov (24. val: +6 novih — celo Weissovo poglavje, cehovska knjiga ABMM, Kronika 2024, založniška stran; weiss-2018-castite ena identiteta)", `=${SOURCE_USAGE.size}`)')
  .replace('check(shared === 61, "T7.4 61 deljenih virov (≥2 zapisa; sbi915246 deljen med niko-zupanic + katarina-zupanic)", `=${shared}`)',
           'check(shared === 62, "T7.4 62 deljenih virov (≥2 zapisa; 24. val: + weiss-2018-castite med 3 zapisi)", `=${shared}`)')
  .replace('check(withTime === 96 && withCoords === 34, "T7.9 objektov s časom (yearFrom) = 96; s koordinato = 34", `=${withTime}/${withCoords}`)',
           'check(withTime === 98 && withCoords === 36, "T7.9 objektov s časom (yearFrom) = 98; s koordinato = 36", `=${withTime}/${withCoords}`)')
  .replace('od.counts?.exhibits === 109 && od.counts?.sources === 542,', 'od.counts?.exhibits === 111 && od.counts?.sources === 550,')
  .replace('"T8.3 OpenData: 109 zapisov / 542 virov"', '"T8.3 OpenData: 111 zapisov / 550 virov"')
  .replace('check(withKey === 542 && totalRows === 542, "T8.4 OpenData sourceKey 542/542", `${withKey}/${totalRows}`)',
           'check(withKey === 550 && totalRows === 550, "T8.4 OpenData sourceKey 550/550", `${withKey}/${totalRows}`)')
)
atm = read(ATM)
atm_new = (atm
  .replace('check("109 zapisov", exhibits.length === 109)', 'check("111 zapisov", exhibits.length === 111)')
  .replace('check("34 zapisov s preverjeno lego (7. val: + MVG-097/098; 22. val: + MVG-109)", objects.length === 34)',
           'check("36 zapisov s preverjeno lego (7. val: + MVG-097/098; 22. val: + MVG-109; 24. val: + MVG-110/111)", objects.length === 36)')
  .replace('check("542 vrstic virov", sources === 542, `=${sources}`)',
           'check("550 vrstic virov", sources === 550, `=${sources}`)')
)
rt = read(RT)
rt_new = (rt
  .replace('check(seedExhibits.length === 109, "R0.2 zbirka: 109 zapisov", String(seedExhibits.length));',
           'check(seedExhibits.length === 111, "R0.2 zbirka: 111 zapisov", String(seedExhibits.length));')
  .replace('check(sourceRows === 542, "R0.3 zbirka: 542 vrstic virov", String(sourceRows));',
           'check(sourceRows === 550, "R0.3 zbirka: 550 vrstic virov", String(sourceRows));')
  .replace('check(context.collection?.exhibitCount === 109, "R12.2 pregled nosi dejanske števce (109)");',
           'check(context.collection?.exhibitCount === 111, "R12.2 pregled nosi dejanske števce (111)");')
  .replace('check(seedExhibits.length === 109, "R16.1 109 zapisov");',
           'check(seedExhibits.length === 111, "R16.1 111 zapisov");')
  .replace('check(sourceRows === 542, "R16.2 542 vrstic virov");',
           'check(sourceRows === 550, "R16.2 550 vrstic virov");')
)
ac = read(AC)
ac_new = ac.replace("(od.counts?.exhibits ?? od.data?.exhibits?.length ?? 0) === 109,",
                    "(od.counts?.exhibits ?? od.data?.exhibits?.length ?? 0) === 111,")

# ─────────────────────────── kontrole pred pisanjem ───────────────────────────
FAILS = []
def chk(cond, msg):
    if not cond: FAILS.append(msg)

chk(mc_new.count('slug: "turski-vpadi-1524"') == 1, "MVG-110 vstavljen")
chk(mc_new.count('slug: "grybl-cevljar"') == 1, "MVG-111 vstavljen")
chk(mc_new.count('museumNo: "MVG-110"') == 1, "MVG-110 številka")
chk(mc_new.count('museumNo: "MVG-111"') == 1, "MVG-111 številka")
chk(mc_new.count("weiss-2018-castite-vas") == 1, "vir griblje-vas vstavljen")
chk(mc_new.count("key: \"weiss-2018-castite\"") == 1 and mc_new.count("key: \"weiss-2018-castite-grybl\"") == 1, "dva weiss vira v novih zapisih")
chk(mc_new.count("academia.edu/42040981") == 3, "3× isti weiss URL (griblje-vas + 2 nova zapisa)")
chk(wk_new.count('exhibitSlug: "grybl-cevljar"') == 1, "postaja grybl-cevljar")
chk(wk_new.count('exhibitSlug: "turski-vpadi-1524"') == 1, "postaja turski-vpadi-1524")
chk(ae_new != ae and te_new != te and ttm_new != ttm and atm_new != atm and rt_new != rt and ac_new != ac, "skripte spremenjene")
chk(mc_new.count('"MVG-1') == mc.count('"MVG-1') + 2, "dve novi MVG številki")

if FAILS:
    for f in FAILS: print("FAIL:", f)
    sys.exit(1)

# ─────────────────────────── pisanje (vse zeleno) ───────────────────────────
for p, data in [(MC, mc_new), (WK, wk_new), (I18, i18_new), (AE, ae_new), (TE, te_new), (TTM, ttm_new), (ATM, atm_new), (RT, rt_new), (AC, ac_new)]:
    with io.open(p, "w", encoding="utf-8") as f: f.write(data)
    print("WROTE", p)

print("VGRADNJA 24. VALA OK — MVG-110 + MVG-111, +1 vir (griblje-vas), +2 postaje, 25 števcev, konstante v 6 skriptah")
