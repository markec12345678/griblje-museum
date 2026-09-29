#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Val 101 — vstavljanje odstavkov zgodbe (literal \\n\\n v TS literalu, pouk val 97)."""
import io, sys

PATH = "/home/z/griblje-museum/src/lib/museum-content.ts"
with io.open(PATH, "r", encoding="utf-8") as f:
    t = f.read()

def insert_before(text, anchor, paragraph):
    if text.count(anchor) != 1:
        sys.exit("ANCHOR NOT UNIQUE: " + anchor[:60])
    return text.replace(anchor, paragraph + anchor)

# ============ MVG-010 storySi (vstavka pred Dunajska študentska leta) ============
si_para = (
    "Gospodarska podoba hiše, iz katere je odšel, je zdaj pisana iz dostopnega članka Aleša Igliča ob 130-letnici rojstva (2006): "
    "oče Miko Zupanič (1841–1911) je bil »posestnik, trgovec ter gostilničar iz Gribelj v Beli krajini«, ki je »v zadnjem desetletju 19. stoletja "
    "s posojanjem denarja postal zelo premožen«; leta 1903 mu je bil v nakup ponujen »posestva z gradovi baronov Apfaltrernov (Krupa, Pobrežje, Pusti gradec)« "
    "— »za nakup pa se ni odločil, ker ni imel smisla za velike finančne transakcije«. Isti vir doda dve ključni potezi: ugodne gmotne razmere Mika Zupaniča "
    "so Niku omogočile študij, konec premoženja pa je pomenila vinska kriza — ko jo je oče utrpel, je Županič po njegovem nasvetu leta 1906 za nekaj mesecev "
    "sprejel službo študijskega prefekta v Terezijanski gimnaziji na Dunaju. Vinogradniška pokrajina je torej z vinsko krizo izgubila svojega najbogatejšega "
    "gospodarja — podatek, ki gospodarski zgodbi vasi doda še eno kapitolo. O očetu obstaja tudi likovni dokument: relief kiparja A. Repiča, reproduciran v "
    "članku (original TO_COLLECT).\\n\\n"
    "Korenine hiše pa segajo še globlje, kakor povedo imena: po Vurnikovem članku Belokranjica (Etnolog 8/9, 1936) so »na Vranovičah in v Gradcu Beličiči, "
    "Županiči, Šimuniči, Pašiči itd.« »zelo verjetno prišli okr. 1630. iz Draganića pri Karlovcu«; po isti opombi je v Gribljah živel rod Kukarjev. "
    "Iglič (2006) zapis dopolni z mehanizmom: Draganiće, ki so imeli svobodno občino še iz srednjega veka, so leta 1630 napadli in oropali grofje Erdödy; "
    "svobodnjaki — med njimi Zupaniči — so se umaknili na Kranjsko, »v podzemljsko župnijo«; stik z zemljo Podzemlja je ohranjen tudi v Nikovem šolanju "
    "(ljudska šola 1884–1887). Obe navedbi prenašamo v izvirnem predlogu: »zelo verjetno« ostaja migracijska sled, ne dokazano dejstvo — arhivska potrditev "
    "čaka (TO_COLLECT).\\n\\n"
    "Iskano sled »Vavpotičevih podob Gribelj« pa članek prvič konkretno razreši: Vavpotič je naslikal družino Županič. Portret matere Katarine Zupanič "
    "(1855–1921) v naravni velikosti in portret »Ministra dr. Nika Zupaniča« iz leta 1924 sta po članku v zbirki Belokranjskega muzeja — darili dr. Nika "
    "Zupaniča; portreta prve soproge Helene Papp in hčerke sta bila v zbirki Veronike Zupanič Kralj; leta 1940 je po Nikovem naročilu naslikal še olje "
    "Dragotina Ketteja, ki ga je pred Nemci rešila hčerka. To so portreti rojenih v Gribljah in njihovih najbližjih — današnja lokacija in stanje slik v "
    "zbirki Belokranjskega muzeja sta TO_COLLECT, upodobitev iz članka ne vnašamo kot digitalnih predmetov. In še en spomin iz istega vira: Nikovi spomini "
    "na Ketteja (spisani 1950) opisujejo tesno prijateljstvo od jeseni 1896 do poletja 1897 na novomeški gimnaziji — Kette je obiskoval VII., Županič pa VIII. "
    "razred realne gimnazije — in zadnje srečanje sredi marca 1899 v Ljubljani, ko je bil Županič na poti z Dunaja v Belo Krajino na velikonočne počitnice."
)
t = insert_before(t, "\\n\\nDunajska študentska leta pa imajo zdaj še eno dokumentirano podrobnost", si_para)

# ============ MVG-010 storyEn ============
en_para = (
    "The economic portrait of the house he left is now written from Aleš Iglič's accessible article on the 130th anniversary of his birth (2006): "
    "the father Miko Zupanič (1841–1911) was 'landowner, trader and innkeeper of Griblje in Bela krajina', who 'became very wealthy in the last decade "
    "of the 19th century by lending money'; in 1903 he was offered the purchase of 'the estate with the castles of the Barons Apfaltrer (Krupa, Pobrežje, "
    "Pusti Gradec)' — 'he did not decide for the purchase, for he had no sense for large financial transactions'. The same source adds two key strokes: "
    "the favourable material circumstances of Miko enabled Niko's studies, and the end of the wealth was the wine crisis — when the father suffered it, "
    "Županič, on his advice, accepted for a few months in 1906 the post of study prefect at the Theresian Gymnasium in Vienna. The wine-growing region "
    "thus lost its richest man to the wine crisis — a fact that adds another chapter to the economic history of the village. There is also an artistic "
    "document of the father: a relief by the sculptor A. Repič, reproduced in the article (the original TO_COLLECT).\\n\\n"
    "The roots of the house reach deeper still, as the names tell: according to Vurnik's article Belokranjica (Etnolog 8/9, 1936), 'at Vranoviči and Gradac "
    "the Beličič, Županič, Šimunič, Pašič families etc.' 'most probably came around 1630 from Draganić near Karlovac'; by the same footnote the Kukar family "
    "lived in Griblje. Iglič (2006) completes the record with the mechanism: the Draganići, who had had a free commune since the Middle Ages, were attacked "
    "and plundered by the Counts Erdödy in 1630; the free nobles — among them the Zupaniči — withdrew to Carniola, 'into the parish of Podzemlje'; the tie "
    "to the land of Podzemelj is also preserved in Niko's schooling (primary school 1884–1887). We carry both statements in their original wording: 'most "
    "probably' remains a migration trace, not an established fact — the archival confirmation awaits (TO_COLLECT).\\n\\n"
    "And the long-sought trace of 'Vavpotič's depictions of Griblje' is for the first time concretely resolved by the article: Vavpotič painted the Županič "
    "family. The life-size portrait of the mother Katarina Zupanič (1855–1921) and the portrait of the 'Minister dr. Niko Zupanič' of 1924 are, according to "
    "the article, in the collection of the Bela krajina Museum — gifts of dr. Niko Županič; the portraits of the first wife Helena Papp and of a daughter were "
    "in the Veronika Zupanič Kralj collection; in 1940 he painted, at Niko's commission, an oil of Dragotin Kette, saved from the Germans by the daughter. "
    "These are portraits of people born in Griblje and of their nearest — the present location and condition of the paintings in the Bela krajina Museum's "
    "collection are TO_COLLECT, and the article's depictions are not entered as digital objects. One more memory from the same source: Niko's memoirs of Kette "
    "(written in 1950) describe a close friendship from the autumn of 1896 to the summer of 1897 at the Novo mesto grammar school — Kette attended the seventh, "
    "Županič the eighth class of the realna gimnazija — and their last meeting in mid-March 1899 in Ljubljana, when Županič was travelling from Vienna to "
    "Bela krajina for the Easter holidays."
)
t = insert_before(t, "\\n\\nThe Vienna student years now hold one more documented detail", en_para)

# ============ uskoki storySi (vstavek pred Leta 1881) ============
usi_para = (
    "Vurnikova Belokranjica (Etnolog 8/9, 1936) pa v migracijski opombi zapiše še eno izpričano pot — tokrat iz Hrvaške, ne iz Vojne krajine: "
    "»V gradu Pobrežje pri Adlešičih so živeli Lenkovići iz Like; v Gradcu Gusiči prav tako Ličani po poreklu; na Svibniku pri Črnomlju in v Gribljah "
    "žive še danes Kukarji; na Vranovičah in v Gradcu Beličiči, Županiči, Šimuniči, Pašiči itd., ki so zelo verjetno prišli okr. 1630. iz Draganića pri "
    "Karlovcu.« Iglič (2006) zapis dopolni z mehanizmom: Draganiće, ki so imeli svobodno občino še iz srednjega veka, so leta 1630 napadli in oropali "
    "grofje Erdödy; svobodnjaki, med njimi Županiči, so se umaknili na Kranjsko, v podzemljsko župnijo. »Zelo verjetno« prenašamo kakor napisano — to je "
    "migracijska sled, ne dokazano dejstvo; družina Županič, iz katere je zrasel gribeljski etnolog Niko, je po teh navedbah del istega premika."
)
t = insert_before(t, "\\n\\nLeta 1881 je Vojna krajina prešla pod civilno upravo", usi_para)

# ============ uskoki storyEn ============
uen_para = (
    "Vurnik's Belokranjica (Etnolog 8/9, 1936) records one more arrival route in its migration footnote — this time from Croatia, not from the Military "
    "Frontier: 'At the castle of Pobrežje near Adlešiči lived the Lenkovići from Lika; at Gradac the Gusiči, likewise of Lika origin; at Svibnik near "
    "Črnomelj and in Griblje the name Kukar survives to this day; at Vranoviči and Gradac the Beličič, Županič, Šimunič, Pašič families etc., who most "
    "probably came around 1630 from Draganić near Karlovac.' Iglič (2006) completes the record with the mechanism: the Draganići, who had had a free "
    "commune since the Middle Ages, were attacked and plundered by the Counts Erdödy in 1630; the free nobles, among them the Županiči, withdrew to "
    "Carniola, into the parish of Podzemlje. 'Most probably' is carried as written — this is a migration trace, not an established fact; the Županič "
    "family, from which the Griblje ethnologist Niko grew, belongs, by these accounts, to the same movement."
)
t = insert_before(t, "\\n\\nIn 1881 the Military Frontier passed to civil administration", uen_para)

with io.open(PATH, "w", encoding="utf-8") as f:
    f.write(t)
print("OK: 4 vstavitve izvedene")
