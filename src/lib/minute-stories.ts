/**
 * Muzej v minuti — enominutne zgodbe za vsak zapis zbirke.
 *
 * Vzorec: »One Minute Wonders« muzejev Brighton & Hove (2023) —
 * prostovoljčeve enominutne zgodbe namesto muzejskih napisov — in
 * podcast The One Minute Museum. Format je najnižji prag za obiskovalca
 * v naglici: ena minuta, ena zgodba, en spomin.
 *
 * Scenariji so ročno napisani iz istih javnih virov kot zapisi (56
 * virov v zbirki); dolžina ~90–130 besed ≈ ena minuta pri hitrosti
 * sinteze. Brez izmišljotine — muzejska iskrenost velja tukaj.
 */

export type MinuteStory = {
  slug: string;
  textSi: string;
  textEn: string;
};

export const MINUTE_STORIES: MinuteStory[] = [
  {
    slug: "izseljenstvo",
    textSi:
      "Vsaka vas v tej zbirki ima svojo čezoceansko različico: ljudje, ki so odšli. Konec devetnajstega stoletja so se Slovenci vkrcali v Trstu in Antwerpnu — na pastelu, ki je glavna slika tega zapisa, stojijo izseljenci pred pisarnami Red Star Line, družbe, ki jih je peljala v Ameriko. Iz Gribelj so šli v Združene države, pozneje v Argentino, Avstralijo, na nemška gradbišča. Iz Amerike so prihajali mandati — in iz njih hiše. Rodovniki se iščejo še danes; morda jih boste dopolnili ravno vi.",
    textEn:
      "Every village in this collection has its trans-oceanic counterpart: the people who left. At the end of the nineteenth century Slovenes boarded ships in Trieste and Antwerp — in the pastel that is this record's main image, emigrants stand before the offices of the Red Star Line, the company that carried them to America. From Griblje they went to the United States, later to Argentina, Australia, the German building sites. From America the money orders came — and out of them, houses. The family trees are still being traced today; perhaps you will be the one to add a branch.",
  },
  {
    slug: "anton-filak",
    textSi:
      "V vasi so kmeta poznali po brazdi. Kdo orje plitvo in poševno, kdo prav in do tal — to se je videlo od pota. In potem je ena od teh rok odkorakala na svetovni oder: Anton Filak iz Gribelj, osemkrat udeleženec svetovnih prvenstev v oranju. Sodniki so merili, kar je vas merila s pogledom: globino, ravnost in čistost brazde. Poglejte fotografijo Franca Vesela — konj, plug, mož. To ni športna fotografija. To je korenina športa.",
    textEn:
      "In the village a farmer was known by his furrow. Who ploughs shallow and slanting, who straight and true — you could see it from the path. And then one of those hands marched onto the world stage: Anton Filak of Griblje, an eight-time participant in the world ploughing championships. The judges measured what the village measured with a glance: depth, straightness, the cleanness of the furrow. Look at Fran Vesel's photograph — the horse, the plough, the man. It is not a sports shot. It is the root of the sport.",
  },

  {
    slug: "griblje-vas",
    textSi:
      "Leto je tisoč štiristo oseminšestdeset. Na listini, ki jo hrani arhiv, se prvič pojavi ime vasi: Griblach. Kasneje Briglach, Griblah, v urbarjih Grüble — ime, starejše od vsega, kar danes stoji v vasi. Petsto petdeset let pozneje šteje Griblje 329 prebivalcev — cerkev, ribnik, vinogradi in meja, ki nikoli ni bila daleč. Če vas danes pelje cesta iz Črnomlja, vozite skozi deželo belih brez. Griblje: vas, ki je muzej sama po sebi.",
    textEn:
      "The year is 1468. In a deed kept in the archive, the village's name appears for the very first time: Griblach. Later Briglach, Griblah, Grüble in the urbars — a name older than everything that stands in the village today. Five hundred and fifty years later Griblje counts 329 souls — a church, a pond, vineyards, and a border that was never far away. If you drive from Črnomelj today, you pass through a land of white birches. Griblje: a village that is a museum in itself.",
  },
  {
    slug: "sveti-vid",
    textSi:
      "Na hribu nad vasjo stoji najbolj prepoznavna stavba Gribelj: cerkev svetega Vida. Sveti Vid je zavetnik tistih, ki jih žge sonce — kmetom zelo pripraven svetnik. Cerkev je versko in krajevno središče: tu se začenjajo procesije, tu se kliče vaščane. Ob njej pokopovališče, ob njem spomin vasi. Vsaka vas ima takšen hrib; Griblje ga imajo sredi svojega imena. Poiščite jo na stari razglednici — ista, a z drugimi okvirji.",
    textEn:
      "On the hill above the village stands the most recognisable building of Griblje: the church of Saint Vitus. Vitus is the patron of those struck by the sun — a very practical saint for farmers. The church is the religious and local heart of the village: processions begin here, and news travelled from here. Beside it lies the graveyard, and beside the graveyard lies the village's memory. Every village has such a hill; Griblje has one in the middle of its name. Find it on an old postcard — the same church, framed differently.",
  },
  {
    slug: "uskoki-in-vojna-krajina",
    textSi:
      "Sredi šestnajstega stoletja postane Kolpa nekaj povsem drugega kot reka: postane meja cesarstva. Na tej meji zraste Vojna krajina — vojaški pas proti Osmanskemu cesarstvu. Vanjo se zatečejo Uskoki, begunci z Balkana; med njimi tudi predniki današnjih Srbov v Bojancih in Marindolu, ki tam živijo še danes. Zato je Bela krajina dežela mešanih jezikov in zgodovin. Od tod tudi ime Uskoki: tisti, ki so ušli. Begunci, ki so postali mejna straža.",
    textEn:
      "In the mid-sixteenth century, the Kolpa becomes something other than a river: it becomes the border of an empire. Along that border grows the Military Frontier — a defensive belt against the Ottoman Empire. Into it flee the Uskoks, refugees from the Balkans; among them the ancestors of today's Serbs of Bojanci and Marindol, who still live there. That is why Bela krajina is a land of mixed languages and histories. And that is what Uskok means: the ones who escaped. Refugees who became border guards.",
  },
  {
    slug: "sokcev-dvor",
    textSi:
      "Kilometer od Gribelj, pri Adlešičih ob Kolpi, stoji Šokčev dvor: štiristranična zaprta kmečka domačija. Vsi domači prostori — hiša, hlev, senik in vpah — se zaprejo v en kvadrat, v sredini pa ostane dvorišče. Takšen tloris je bil hkrati dom in trdnjava vsakdana. Danes je Šokčev dvor muzej na prostem in kulturni spomenik: slamnate strehe, črna kuhinja, kamniti vhod. Pohod čez Kolpi ga povezuje z Gribljami — ob njem se vidi, kako je živela vas, ki je postavila Griblje.",
    textEn:
      "A kilometre from Griblje, by Adlešiči on the Kolpa, stands Šokčev dvor: a four-sided enclosed farmstead. All the farm spaces — house, stable, barn and cart-shed — close into a single square, leaving a courtyard in the middle. Such a plan was at once a home and a fortress of everyday life. Today Šokčev dvor is an open-air museum and a listed monument: thatched roofs, a black kitchen, a stone gateway. The trail along the Kolpa connects it to Griblje — beside it you can see how the village that built Griblje once lived.",
  },
  {
    slug: "kolpa-reka",
    textSi:
      "Kolpa je najtoplejša reka Slovenije — poleti dvaindvajset, triindvajset stopinj, tako da jo koprski morjarji zavidajo. Za Griblje je bila vedno vse naenkrat: meja, kopališče, ribolov, mlinarica in spomin. Na njej so se učili plavati, čez njo so bežali in se zahvaljevali, ob njej so mleli žito in nosile vodo. Reka, ki je včasih delila državi, je zdaj schengenska in skupna. Stojte na bregu poleti: to je najboljši muzej vasi, odprt brez ur.",
    textEn:
      "The Kolpa is the warmest river in Slovenia — twenty-two, twenty-three degrees in summer, enough to make the seaside jealous. For Griblje it has always been everything at once: border, bathing place, fishery, miller's power and memory. On it people learned to swim; across it they fled and gave thanks; along it they ground grain and carried water. A river that once divided two states is now borderless and shared. Stand on its bank in summer: it is the village's finest museum, open around the clock.",
  },
  {
    slug: "malenca",
    textSi:
      "Ob Kolpi pri Gribljah je nekoč stal jez z imenom malenca — beseda, ki je živa samo v tem koncu dežele. Malenca je bila majhen prag, ki je zajel vodno moč in jo usmeril v mlinsko kolo. Izum, ki ni potreboval niti železa: les, kamen in znanje, kje ima reka padec. Od tod moka, od moga kruh. Danes beseda živi v priimkih in v spominu mlinarjev. Kot muzejski zapis opominja: revščina je bila včasih iznajdljivost.",
    textEn:
      "On the Kolpa near Griblje there once stood a weir called a malenca — a word that lives only in this corner of the country. The malenca was a small sill that captured the river's power and fed it to a millwheel. An invention that needed no iron: wood, stone, and the knowledge of where the river drops. From it came flour, and from flour, bread. Today the word survives in family names and in millers' memories. As a museum record it reminds us: poverty was once another word for ingenuity.",
  },
  {
    slug: "mlini-na-kolpi",
    textSi:
      "Dol, Radenci, Pobrežje, Krasinec: ob Kolpi so stoletja mleli vodni mlini. Urbarji jih omenjajo že v srednjem veku — moko je pridelovala voda, ne roka. Mlinar je bil vaški obrtnik in vremenar hkrati: kdor je vedel, kdaj bo vode, je vedel, kdaj bo kruha. Mlini so obratovali še v dvajsetem stoletju, potem pa jih je dohitel elektrski mlin. Danes so med zadnjimi pričami mlinarskega vsakdana. Zapis hrani njihova imena, fotografije in arhivske omembe — kruh ima tukaj svojo dokumentirano zgodovino.",
    textEn:
      "Dol, Radenci, Pobrežje, Krasinec: for centuries, water mills ground along the Kolpa. The urbarji record them as early as the Middle Ages — it was water, not hand, that made the flour. The miller was the village's craftsman and its weatherman at once: whoever knew when the water would come, knew when the bread would. The mills kept turning into the twentieth century, until the electric mill caught up with them. Today they are among the last witnesses of the millers' working day. This record keeps their names, photographs and archive mentions — bread has a documented history here.",
  },
  {
    slug: "niko-zupanic",
    textSi:
      "Prvi december tisoč osemsto sedeminšestdeset. V Gribljah se rodi Niko Županič, sin učitelja. Postal bo etnolog, antropolog, zgodovinar in politik — in med ustanovitelji današnjega Slovenskega etnografskega muzeja v Ljubljani. Iz vasi ob Kolpi v svetovne muzeje in univerze: Županič je raziskoval človeka, od Kitajske do Balkana. Vrnil se je v slovensko politiko in pisal o svoji Beli krajini. Kozmopolit z vaškim naglasom — to je najbolj gribljanska usoda v zbirki.",
    textEn:
      "The first of December, 1876. In Griblje, a teacher's son is born: Niko Županič. He will become an ethnologist, anthropologist, historian and politician — and among the founders of today's Slovene Ethnographic Museum in Ljubljana. From a village on the Kolpa into the world's museums and universities: Županič studied humankind from China to the Balkans. He returned to Slovene politics and wrote about his Bela krajina. A cosmopolitan with a village accent — the most Griblje-like fate in the whole collection.",
  },
  {
    slug: "snos-crnomelj-1944",
    textSi:
      "Februarja tisoč devetsto štiriinštirideset, v sokolskem domu v Črnomlju, zaseda Slovenski narodnoosvobodilni svet. Na ozemlju, ki ga drži partizanska oblast, se sestane zbor, ki ga danes štejemo za temelj slovenske državnosti — prvi slovenski parlament. Odločili so, da se slovenski narod odloča sam o sebi. Vse to devet kilometrov od Gribelj, med reko in gozdovi. Februar 1944: eden od datumov, okoli katerih se vrti vsa vojna tema te zbirke.",
    textEn:
      "February 1944, in the Sokol Hall in Črnomelj, the Slovene National Liberation Council convenes. On ground held by the partisan authorities, an assembly meets that we now count among the foundations of Slovene statehood — the first Slovene parliament. It resolved that the Slovene nation decides for itself. All of it nine kilometres from Griblje, between river and forest. February 1944: one of the dates the whole war theme of this collection turns around.",
  },
  {
    slug: "letalisce-otok-1944",
    textSi:
      "Spomladi 1944 partizani pri vasi Otok uredijo letališče — na travniku, z rokami, pod nebesi, ki jih morajo izogniti nemška letala. Z njega zavezniki v južno Italijo prepeljejo tisoč štiristo triinsedemdeset ranjencev in bolnikov. Vsako vzletanje je bilo udarec sreče: pošastna operacija brez ene same izgube letala. Travniki okrog Otoka so danes spet samo travniki. Toda v tej zbirki hranimo njihovo fotografijo in njihovo številko: 1473 ljudi, ki so odleteli v življenje.",
    textEn:
      "In spring 1944 the partisans build an airfield by the village of Otok — on meadowland, by hand, under skies that German aircraft still commanded. From it, the Allies ferry 1,473 wounded and sick to southern Italy. Every take-off was a stroke of luck: a colossal operation without the loss of a single aircraft. The meadows around Otok are just meadows again today. But this collection keeps their photograph and their number: 1,473 people who flew out towards life.",
  },
  {
    slug: "evakuacija-1945",
    textSi:
      "Konec marca 1945 se nad Belo krajino prikažejo dnevno zavezniška letala — in odnesejo ranjene partizane v Bari. Ta evakuacija je bila vsakodnevna, in hkrati skrita: o njej pričajo redki dokumenti. Dve fotografiji, posneti pri Gribljah v teh dneh, sta med zadnjimi pričami operacije. Nebo nad vasjo je bilo mesec dni bolnišnični hodnik. Ta zapis je posvečen vsem, ki so leteli — in tistim, ki so jim pomagali leteti.",
    textEn:
      "At the end of March 1945, Allied aircraft appear over Bela krajina day after day — and carry wounded partisans away to Bari. The evacuation was everyday and hidden at once: only rare documents testify to it. Two photographs taken near Griblje in those days are among the last witnesses of the operation. For a month, the sky above the village was a hospital corridor. This record is dedicated to all who flew — and to those who helped them fly.",
  },
  {
    slug: "meja-1991",
    textSi:
      "Junija tisoč devetsto enaindevetdeset Kolpa postane meja samostojne Slovenije. Nove mejne kamne so vasi postavile po svoje — z rokami, da so bile stvari prav. Potem so prišla leta žičnate ograje begunske krize, ko je bila reka spet oster rob Evrope. Danes je Kolpa schengenska notranjost: brez ovir, s skupnimi poletji na obeh bregovih. Ena reka, tri meje, ena zgodba. Najnovejši zapis zbirke — in dokaz, da se tukaj zgodovina še vedno piše ob vodi.",
    textEn:
      "In June 1991 the Kolpa becomes the border of an independent Slovenia. The villages set the new boundary stones in place themselves — by hand, so that things would be done right. Then came the years of barbed wire in the refugee crisis, when the river was again Europe's sharp edge. Today the Kolpa lies inside Schengen: no obstacles, with shared summers on both banks. One river, three borders, one story. The newest record in the collection — and proof that here, history is still written along the water.",
  },
  {
    slug: "ribnik",
    textSi:
      "Vsaka vas ima svoj ribnik; Griblje ga imenujejo kar ribnik. Miren vodni ekosistem ob travnikih: tu se zrcali nebo, tu se napajajo živine, tu se učijo plavati otroci, preden so drznili na Kolpo. Ribe, žabe, plovnice, kurenty — sezonski gledališki oder. Ribnik je skozi stoletja del gospodarskega kroga vasi in danes del njenega miru. Zapis zbirke o njem je kratek, a zrcali največ: v njem se vidi cela vas.",
    textEn:
      "Every village has its pond; Griblje simply calls theirs the pond. A calm water ecosystem beside the meadows: the sky mirrors in it, cattle drink from it, children learn to swim in it before daring the Kolpa. Fish, frogs, water-striders, winter skatings — a seasonal theatre stage. For centuries the pond was part of the village's working circle, and today part of its peace. The record about it is short but reflects the most: in it you can see the whole village.",
  },
  {
    slug: "belokranjska-hisa",
    textSi:
      "Belokranjska hiša: bela apnena podlaga, slamnata streha, črna kuhinja ob vhodu, kamnita tlak in malo oken. Revščina, ki je postavila hišo, je naredila tudi njeno lepoto: apneno belina je bila poceni in čista, slama pa edina streha, ki jo je dalo krhko gospodarstvo. V črni kuhinji se je kuhalo, kadilo in sušilo — vse v enem prostoru. Taka hiša je stala tudi v Gribljah. Danes jo hranimo kot spomenik pametne skromnosti: zidovi iz tega, kar je bilo pri roki.",
    textEn:
      "The Bela krajina farmhouse: white-washed limestone walls, a thatched roof, a black kitchen by the entrance, stone floors and few windows. The poverty that built the house also made its beauty: limewash was cheap and clean, thatch the only roof the fragile economy could give. In the black kitchen people cooked, smoked and dried — all in a single room. Such houses stood in Griblje too. Today we keep one as a monument to intelligent modesty: walls made of whatever was at hand.",
  },
  {
    slug: "vino-in-crnina",
    textSi:
      "Na apnenčastih legah Bele krajine uspeva metliška črnina — vino z zajamčeno tradicionalno oznako, mešanica nerazvrščenih starih sort. Iz istih vinogradov pride tudi cviček, po katerem Bela krajinci pojejo. Vino je bilo tu vedno hrana in denar hkrati: prodali so ga v Prekmurje, na Dolenjsko, kamor je šla ladja. Vsaka hiša v Gribljah je imela svoj vinograd, vsak vinograd svoj kozolec. Pijte počasi: črnina je skušnjava, ki se pije pri sobni temperaturi in z attitudom domačina.",
    textEn:
      "On the limestone slopes of Bela krajina ripens Metliška črnina — a wine with a protected traditional designation, a blend of unnamed old varieties. The same vineyards give the cviček that Bela krajina sings about. Wine here was always food and money at once: it was sold across the region, wherever a cart would go. Every household in Griblje had its vineyard, every vineyard its small drying rack. Drink slowly: črnina is a temptation best taken at cellar temperature and at the pace of a local.",
  },
  {
    slug: "jurjevanje",
    textSi:
      "Devetindvajsetega aprila, na svetega Jurija, po vaseh Bele krajine nosijo zeleno mladino — jurje. Fantje okitijo smrečje, zvoncek in vejice brez, pojejo pesem o svetem Juriju in prosijo za srečo in gnoj po poljih. Jurjevanje je praznik pomladi in hkrat davek mladosti: prirejenega v Preložah velja za najstarejšega v Evropi. Po drugi svetovni vojni so ga oblasti zatirale, ljudje pa so ga nosili naprej — s preoblečenimi imeni, če je bilo treba. Jurje so danes tudi glas te dežele: fantovski zbori pojejo jurjevanje po svetu.",
    textEn:
      "On the twenty-ninth of April, Saint George's day, the villages of Bela krajina carry the green boughs — the jurje. Young men dress spruce, bells and birch twigs, sing the song of Saint George, and ask for luck and good fields. Jurjevanje is a feast of spring and a tribute of youth at once; the celebration kept at Prelože counts among the oldest in Europe. After the Second World War the authorities suppressed it, and people carried it on anyway — under disguised names if needed. The jurje are today also the voice of this land: men's choirs sing them around the world.",
  },
  {
    slug: "belokranjska-kuhinja",
    textSi:
      "Belokranjska kuhinja je revščina, ki je postala kultura okusa. Pogača, sčedno posipana s kumarji. Matevž iz fižola, tak, da se žlica stoji. Pustni salenjaki, medlica, žganci, krvavica — vse iz tistega, kar je dalo kmečko gospodarstvo. Nič ni bilo odveč: od svinje so uporabili vse, od fižola vse, od kruha vse. Današnji gostilne so to dale na jedilnik kot specialiteto — in prav imajo: to je jedilnik, ki ga je sestavila stvarnost, ne kuharska knjiga.",
    textEn:
      "The cooking of Bela krajina is poverty that became a culture of taste. Pogača bread, sparingly scattered with crackling. Matevž of beans, thick enough to stand a spoon upright. Carnival salenjaki, medlica, žganci, blood sausage — everything the farm economy gave. Nothing was wasted: of the pig they used everything, of the beans everything, of the bread everything. Today's inns have put it on the menu as a speciality — and rightly so: this is a menu composed by reality, not by a cookbook.",
  },
  {
    slug: "tkalstvo",
    textSi:
      "Lan in konoplja: rastlini, ki sta oblekli vas. Poleti so jih namakali v Kolpi ali na rosa, jeseni lomili, paklji, česali, potem pa predli — v zimskih večerih ob vsaki hiši v Gribljah. Iz preje je na leseni statvi zraslo platno: za rjuhe, srajce, torbe. Iz tkanja se je nato razvila šiviljska industrija, ki je v dvajsetem stoletju zaposlila pol dežele. Statva je danes v muzeju; platno, ki ga je dalo, pa še vedno v omarah. Vsak prtiček je list dokumentov.",
    textEn:
      "Flax and hemp: the two plants that dressed the village. In summer they were retted in the Kolpa or on the dew, in autumn broken, scutched and combed, then spun — through the winter evenings, at every house in Griblje. From the yarn, on a wooden loom, linen grew: for sheets, shirts, bags. From that weaving came the garment industry that in the twentieth century employed half the country. The loom stands in a museum now; the linen it gave is still in the wardrobes. Every small cloth is a page of documents.",
  },
  {
    slug: "storklje",
    textSi:
      "Bela krajina je ena od slovenskih dežel bele štorklje. Gnezda na dimnikih in drogovih — v Bojancih, Marindolu, Miličih in drugod — so znak vasi, ki je naravi pustila prostor. Štorklja se vrne vsako pomlad iz Afrike, in če se vrne, se vrne k istemu gnezdu. Kmetje so jih varovali: sreča na strehi. Danes štejejo ptice s sateliti in prstenje; ta zapis pa šteje tudi zgodbe — o gnezdah, ki so postala vaški grbi.",
    textEn:
      "Bela krajina is one of the Slovene lands of the white stork. Nests on chimneys and poles — in Bojanci, Marindol, Miliči and elsewhere — mark a village that left room for nature. The stork returns every spring from Africa, and if it returns, it returns to the same nest. Farmers protected them: luck on the roof. Today the birds are counted with satellites and rings; this record also counts the stories — of nests that became village emblems.",
  },
  {
    slug: "bele-breze",
    textSi:
      "Bela breza je drevo, ki je dalo ime pokrajini: Bela krajina. Njena belina — apnen na skorji — se sveti tudi v mraku, zato so brezove goščave svetle. Po njej se imenujeta tudi beli dan, shranjen v ljudskem koledarju, in regratov vinograd, ki je bil nekoč znan kot vinograd belih brez. V Gribljah in okolici je breza ob cestah in potokih. To je drevo, ki ga ni treba iskati: samo glejte vstrta vas, in vselej bo belo lice.",
    textEn:
      "The white birch is the tree that named the region: Bela krajina, the white march. Its whiteness — lime in the bark — shines even at dusk, which is why birch groves stay light. It also named the white day kept in the folk calendar, and the vineyard once known as the vineyard of white birches. Around Griblje the birch stands by roads and streams. This is a tree you never need to search for: look for any village, and there will be its white face.",
  },
  {
    slug: "vaska-sola",
    textSi:
      "Leta 1869 je dunajski zakon naredil šolo za dolžnost vsakega otroka. V vasi je to pomenilo eno učilnico in enega učitelja: tablica, kreda, abecednik — in klopi, ki so ob žetvi stale prazne. Kdor je znal brati, je vaščanom prebral pisma in mandate iz Amerike. Bela krajina pa je šoli dodala svoje poglavje: med vojno, na svobodnem ozemlju, je v Črnomlju delovala partizanska gimnazija — stavba na sliki. Pred vaško šolo OŠ Loka danes stoji spomenik trinajstim padlim. Muzej išče razredne fotografije in imena učiteljev. Morda jih imate ravno vi doma.",
    textEn:
      "In 1869 a Viennese law made school the duty of every child. In the village that meant one classroom and one teacher: slate, chalk, primer — and benches that stood empty at harvest. Whoever could read the letters and money orders from America aloud for the neighbours. Bela krajina added its own chapter to the school: during the war, on free territory, a Partisan gymnasium worked in Črnomelj — the building in the picture. Before the village's school of OŠ Loka stands the memorial to the thirteen fallen today. The museum is looking for class photographs and teachers' names. Perhaps you have them at home.",
  },
  {
    slug: "zaseda-1941",
    textSi:
      "6. september 1941, poleti, sredi dneva, cesta Črnomelj–Griblje. Štirje partizani iz taborišča na Židovcu napadejo iz zasede patruljo italijanske mejne policije, ki pelje hrano in strelivo za postojanko v Gribljah. Dva mrtva, trije ranjeni — eden pozneje umre. Vojna je v vas prišla s prvim strelom, tri leta pred zavezniškimi letali nad poljem. Leta 1960 so na kraju postavili kamen kiparja Jakoba Savinška; danes ga varuje register dediščine pod številko EŠD 19324. Imena borcev še iščemo — morda jih pomnite ravno vi.",
    textEn:
      "6 September 1941, in summer, in broad daylight, on the Črnomelj–Griblje road. Four Partisans from the camp at Židovec ambush a patrol of the Italian border police carrying food and ammunition for the post at Griblje. Two dead, three wounded — one dies later. The war came to the village with the first shot, three years before the Allied aircraft over the field. In 1960 a stone by the sculptor Jakob Savinšek was raised on the spot; today the heritage register keeps it under EŠD 19324. The fighters' names are still being sought — perhaps you remember them.",
  },
  {
    slug: "spomenik-padlim",
    textSi:
      "Pred šolo v Gribljah stoji kamen s trinajstimi imeni. Enajst vaščanov je padlo kot partizani, dva sta umrla kot žrtvi fašističnega nasilja. Spomenik so odkrili vaščani — odbor Zveze borcev — 10. septembra 1961, šestnajst let po vojni, ko imena še niso bila vprašanje. Register dediščine ga vodi kot EŠD 19326. To je najkrajši seznam, ki ga ta muzej lahko objavi. Prepis imen s kamna in prvo domačo fotografijo še čakava — morda prav od vas.",
    textEn:
      "Before the school at Griblje stands a stone with thirteen names. Eleven villagers fell as Partisans, two died as victims of Fascist violence. The memorial was unveiled by the villagers themselves — the Veterans' Association board — on 10 September 1961, sixteen years after the war, when names were not yet a question. The heritage register keeps it as EŠD 19326. This is the shortest list this museum can ever publish. The transcription of the names and the first home photograph still wait — perhaps for you.",
  },
  {
    slug: "griblje-v-stevilkah",
    textSi:
      "1468: Griblach. 1490: Briglach. 1593: Griblah. V urbarjih Grüble. Danes: 329 prebivalcev, tri celo pol kvadratnega kilometra, 153 metrov nad morjem, poštna številka 8332 Gradac. Popis 2020: 334 duš — 172 moških in 162 žensk. Ime? Jezikoslovci še razpravljajo: goba, gruda, brazda ali travnata strmina. Vas pa računa naprej — od prve črke v listini do zadnje številke statističnega urada. Aerofotografija tega zapisa drži vse to v enem edinem kadru.",
    textEn:
      "1468: Griblach. 1490: Briglach. 1593: Griblah. Grüble in the urbars. Today: 329 inhabitants, three and a half square kilometres, 153 metres above the sea, postal code 8332 Gradac. The 2020 census: 334 souls — 172 men and 162 women. The name? Linguists still debate: a mushroom, a clod, a furrow or a grassy slope. The village keeps counting — from the first letter of the deed to the statistical office's latest figure. This record's aerial photograph holds all of it in a single frame.",
  },
  {
    slug: "audrey-totter",
    textSi:
      "Konec devetnajstega stoletja so trije bratje Jandreč iz Gornjih Gribelj odšli v Ameriko. Janez je ostal v Jolietu, Illinois — in leta 1917 se mu je rodila hčerka Audrey Mary Totter. Radijske igre, potem Hollywood: sedem let pri MGM, ostra dekleta filma noir, zrcalni prizor iz Lady in the Lake, uspešnica z Clarkom Gableom. Stric Matija »Matiček« je med tem v Gribljah popisoval ljudsko izročilo — Županič je zapisal: Jandrečim sta tuja plug in motika, rajše knjiga in gosli. Fotografija tega zapisa je javna last; zgodba pa gribeljska do zadnje črke.",
    textEn:
      "At the end of the nineteenth century three Jandreč brothers left Gornje Griblje for America. Janez stayed in Joliet, Illinois — and in 1917 his daughter Audrey Mary Totter was born. Radio dramas, then Hollywood: seven years at MGM, the sharp girls of film noir, the mirror scene of Lady in the Lake, a hit beside Clark Gable. Meanwhile uncle Matija »Matiček« was recording folk heritage back in Griblje — Županič wrote: the Jandrečs care little for plough and hoe; give them the book and the fiddle. This record's photograph is public domain; the story is Griblje's to the last letter.",
  },
  {
    slug: "nikolaj-dragos",
    textSi:
      "Hajdeč grunt, 1907: deveti od dvanajstih otrok. Uk pri ključavničarju, pobeg v Ljubljano, bugarija pri tamburaših društva Danica. Topničar v Mostarju, nato graničar na srbsko-bolgarski meji — prvi, ki se je naučil smučati. Vojni ujetnik, po vojni milicist. Ob stotem rojstnem dnevu je napisal knjigo Mojih sto let; ob 108. in 110. ga je obiskal predsednik Pahor. Umrl je 2018, star 110 let in 216 dni — najdalj živeči moški, ki ga je Slovenija kdaj zapisala. Stoletje v malem, z začetkom na gribeljski njivi.",
    textEn:
      "The Hajdeč farm, 1907: ninth of twelve children. Apprenticed to a locksmith, ran off to Ljubljana, played the bugarija with the Danica tamburitza band. Gunner at Mostar, then a border guard on the Serbo-Bulgarian frontier — the first of them to learn to ski. A prisoner of war, after it a militiaman. At one hundred he wrote his book My Hundred Years; at 108 and 110 President Pahor came to visit. He died in 2018, aged 110 years and 216 days — the longest-lived man Slovenia has ever recorded. A century in miniature, begun on a Griblje field.",
  },
  {
    slug: "peter-kambic",
    textSi:
      "Novembra 1889 so v Gribljah blagoslovili novo šolsko poslopje — prvi učitelj v njem je bil pripravnik Peter Kambič, rojen v Krasincu. Učitelj in etnograf: pod psevdonimom Pirc Krasinski je za Dolenjske novice zapisal »Božič pri Belokranjcih«, med najstarejše objavljene vpoglede v praznični vsakdan te dežele. Umrl je januarja 1890, komaj dvajsetleten. Šola, ki jo je zagnal, uči še danes; kar je zapisal o božiču, živi dlje od njega.",
    textEn:
      "In November 1889 the new school building in Griblje was blessed — its first teacher was the trainee Peter Kambič, born at Krasinec. Teacher and ethnographer: under the pen name Pirc Krasinski he wrote »Christmas among the Bela krajina people« for the Dolenjske novice, among the oldest published glimpses of this land's festive life. He died in January 1890, barely twenty. The school he set going teaches to this day; what he wrote about Christmas outlives him.",
  },
  {
    slug: "alburnus-sava",
    textSi:
      "Leto 2017: v odprti reviji ZooKeys ihtiologi Bogutskaya, Zupančič, Jelić, Diripasko in Naseka opišejo novo vrsto za znanost — Alburnus sava, plevko iz Kolpe, poimenovano po Savi. Holotip, samec dolg 173,6 milimetra, hranijo v Madridu; njegova fotografija je slika tega zapisa. V istem stoletju je znanost ob bregovih Gribelj srečala dve neznani življenji: črnega močerila pod kraškim svetom in plevko v sami reki. Kdor se kopa pri Gribljah, plava v vodi, ki nosi ime v znanstveni literaturi.",
    textEn:
      "The year 2017: in the open journal ZooKeys the ichthyologists Bogutskaya, Zupančič, Jelić, Diripasko and Naseka describe a species new to science — Alburnus sava, a bleak from the Kolpa, named after the Sava. The holotype, a male 173.6 millimetres long, is kept in Madrid; its photograph is this record's image. In the same century science met two unknown lives by the banks of Griblje: the black olm beneath the karst world and the bleak in the river itself. Whoever bathes at Griblje swims in water that carries a name in the scientific literature.",
  },
  {
    slug: "matice-podzemelj",
    textSi:
      "Kjer se v Gribljah krsti, poroči ali pokoplje, se v Podzemlju zapiše. Župnija sv. Martina vodi matične knjige od leta 1669 do 1947 — dvaindvajset zvezkov krstnih, poročnih in mrliških, digitaliziranih in prostih na Matricula Online. Botri ob vsakem krstu so karta vaške mreže: kdo je komu stal ob krstu, pri poroki, ob postelji. Za Gribeljce od Clevelanda do Buenos Airesa so ta vrata danes odprta brez potovanja. Ta zapis je vrata, ne kopija — listajte izvirnik.",
    textEn:
      "Wherever Griblje baptises, marries or buries, Podzemelj writes it down. The parish of St. Martin keeps its registers from 1669 to 1947 — twenty-two volumes of baptisms, marriages and burials, digitised and free on Matricula Online. The godparents at every baptism are a map of the village web: who stood by whom at the font, at the wedding, at the bedside. For Griblje families from Cleveland to Buenos Aires the gate now stands open without a journey. This record is a gate, not a copy — leaf through the original.",
  },
  {
    slug: "cerkvisce",
    textSi:
      "Ime te vasi je arheologija: Cerkvišče — kraj, kjer so bile cerkve. Pred turškimi vpadi okrog leta 1408 so tu stale tri; Turki so jih porušili in zažgali. Za dve vaščani domnevno vejo, kje sta stali, za tretjo ne ve nihče. Leta 1994 so postavili kapelico v spomin — ni rekonstrukcija, ampak pričevanje. Vas pripada isti župniji in isti krajevni skupnosti kot Griblje; v gozdu skrivata Jelenja in Vodena jama. Njihova imena so v tleh.",
    textEn:
      "This village's name is an archaeology: Cerkvišče — a place where churches stood. Before the Ottoman incursions around 1408 three stood here; the Turks pulled them down and burned them. For two the villagers believe they know the sites; of the third, no one knows. In 1994 a chapel was raised in their memory — not a reconstruction but a testimony. The village belongs to the same parish and the same local community as Griblje; in its woods hide the Deer Cave and the Water Cave. Their names are in the ground.",
  },
  {
    slug: "pasuljada",
    textSi:
      "Avgust ob Kolpi, lonci na ognju: Pasuljada. Tekmovanje v kuhanju pasulja, ki ga Turistično društvo Griblje prireja z Društvom kmečkih žena in kopališčem — leta 2019 že šestnajstič, torej od približno leta 2004. Štirinajst ekip po dva, komisija z žlico in nosom, zmagovalna lonec in recept. Etnologi pravijo, da šega mlajša od sto let še ni šega — a v živem kraju tradicija ne deduje samo, nastaja. Nekoč bo o njej kdo pisal, kakor danes pišemo o božiču.",
    textEn:
      "August by the Kolpa, pots on the fire: the Pasuljada. A bean-stew cooking competition run by the Griblje Tourist Society with the Farm Women's Society and the bathing place — by 2019 already the sixteenth time, so since about 2004. Fourteen teams of two, a jury with spoon and nose, the winning pot and recipe. Ethnologists say a custom younger than a hundred years is not yet a custom — but in a living place tradition is not only inherited; it is created. One day it will be written about the way we today write about Christmas.",
  },
  {
    slug: "franc-brinc",
    textSi:
      "Med vojno je obiskoval gribeljsko šolo; kasneje je postal izredni profesor prava, penolog in kriminolog. Potem se je zgodilo nekaj, kar vasi ni bilo usojeno pričakovati: vrnil se je z darovi. Gasilcem 30.000 evrov v štirih letih — operativna soba, streha, izolacija. Šoli prav toliko — digitalna oprema, igrala, ekovrt in izlet v Planico. Skupaj z občino in cerkvijo okoli 200.000 evrov. Poveljnik gasilcev je rekel: dal nam je zagon in prebudil društvo. V gasilskem domu ima danes svojo spominsko sobo, na šoli pa ploščo.",
    textEn:
      "He attended the Griblje school during the war; later he became an associate professor of law, a penologist and a criminologist. Then came something the village had not been promised: he returned with gifts. Thirty thousand euros to the fire brigade over four years — the operational room, the roof, the insulation. Just as much to the school — digital equipment, play equipment, a school garden and a trip to Planica. With the municipality and the church, around two hundred thousand euros in all. The fire commander said: he gave us momentum and woke the society. Today he has his memorial room in the fire station, and a plaque on the school.",
  },
  {
    slug: "katarina-zupanic",
    textSi:
      "Leto 1894: etnolog Niko Županič prosi mater, naj zapiše ljudsko izročilo svoje vasi. Katarina, rojena Pezdirc pri Grizinu, vzame pero in naredi, česar pred nijo nobena roka Gribelj: zajame leto, šege, pesmi in vere, kakor jih živi. Naslov bo Šopek poljskih cvetlic iz Gribelj. Objavljena bo šele leta 1937, v Etnologu — reviji, ki jo je ustanovil njen sin. Med zapisovalci te dežele je prva ženska; njen zapis je pot od vaške izročilke do tiskane strani.",
    textEn:
      "The year 1894: the ethnologist Niko Županič asks his mother to write down the folk tradition of her village. Katarina, born Pezdirc at the Grizin homestead, takes up the pen and does what no hand of Griblje had done before her: she captures the year, the customs, the songs and the beliefs as she lives them. The title will be A Bouquet of Meadow Flowers from Griblje. It will be published only in 1937, in Etnolog — the journal her son founded. Among this land's recorders she is the first woman; her record is the road from a village tradition-keeper to the printed page.",
  },
  {
    slug: "toni-gasperic",
    textSi:
      "Hiša ob Kolpi, vedno odprta: Toni Gašperič in žena Jana. Njegova obrt je bil smeh — humorist, pisatelj, voditelj Veselga tobogana in Prizme optimizma. Knjige z naslovi, ki so sami malo belokranjsko učno gradivo: Ljudje z zaščitenimi hrbti, Vsi smo na ražnju, Življenje je eno samo porivanje. Ustanovil je igralsko skupino Osip Šest in pobudil Noč na Kolpi. Med nesnovno dediščino vasi spada tudi smeh: vas, ki zna sama sebe spraviti v smeh, preživi vse.",
    textEn:
      "A house by the Kolpa, always open: Toni Gašperič and his wife Jana. His trade was laughter — humorist, writer, presenter of the Veseli tobogan and the Prizma optimizma. Books whose titles are themselves a little Bela krajina primer: Ljudje z zaščitenimi hrbti, Vsi smo na ražnju, Življenje je eno samo porivanje. He founded the Osip Šest acting group and initiated the Night on the Kolpa. Laughter belongs to a village's intangible heritage too: a village that can laugh at itself survives everything.",
  },
  {
    slug: "madronicev-mlin",
    textSi:
      "Prelesje ob Kolpi, dva in pol kilometra od Gribelj: leta 1937 družina Madronič kupi požgano domačijo z mlinom in žago. Mlin v nadstropju — Kolpa ob poplavah dvigne vodo za več metrov. Stari Peter Madronič je bil leta 1943 med odposlanci v Kočevju, hčerka Katica je čuvala konja, »partizanskega taksista«. Danes mlin ne melje več, a živi: tri makete, ena z vodnim pogonom, obnovljen sto metrov dolg jez — in knjiga, ki jo družina pripravlja.",
    textEn:
      "Prelesje on the Kolpa, two and a half kilometres from Griblje: in 1937 the Madronič family buys a burnt-down homestead with a mill and a sawmill. The mill in an upper storey — at flood the Kolpa raises the water by several metres. Old Peter Madronič was among the delegates at Kočevje in 1943; his daughter Katica guarded the horse, the »Partisan taxi«. Today the mill grinds no more, but it lives: three models, one with water power, a restored hundred-metre weir — and a book the family is preparing.",
  },
  {
    slug: "muzejska-ucilnica",
    textSi:
      "26. junij 2022: v sto trideset let stari gribeljski šoli odprejo muzejsko učilnico. Brani se zapisi šolskega leta 1949/50 — pionirji so zbrali četrt kilograma jabolčnih pečk in 215 kilogramov zelišč. Branka Weiss, dolgoletna vodja: »Podružnice niso drage, so pa dragocene.« Danes jo obiskuje 17 učencev, Marjetka Žunič poučuje od 1992 — in to je edina slovenska vas s svojo podružnico. Ta digitalni muzej ima torej v vasi fizično sestro: dve učilnici, ena naloga.",
    textEn:
      "26 June 2022: a museum classroom opens in the hundred-and-thirty-year-old Griblje school. Records of the school year 1949/50 are read — the pioneers collected a quarter of a kilogram of apple seeds and 215 kilograms of herbs. Branka Weiss, the longtime head: »Branch schools are not expensive; they are precious.« Today 17 pupils attend it, Marjetka Žunič has taught since 1992 — and this is the only Slovene village with its own branch school. So this digital museum has a physical sister in the village: two classrooms, one task.",
  },
  {
    slug: "kavbojski-zur",
    textSi:
      "Junij ob Kolpi, klobuki na glavah: Kavbojski žur. Prvič 2024 (»Bilo je kot na Divjem zahodu«), drugič 2025 — in znova je navdušil. Plesalke Country Roses so domačinke; nastopili so učenci šole, semiški Country Vrtičkarji in Wild West iz Ljubljane. Etnološka iskrenost: šega, mlajša od sto let, še ni šega — zato je ta zapisan takoj ob rojstvu. Večini šeg ni zapisan prvi dan; tej ne bo manjkal.",
    textEn:
      "June by the Kolpa, hats on heads: the Cowboy Party. First in 2024 (»It was like in the Wild West«), again in 2025 — and it delighted again. The Country Roses dancers are local women; the school pupils performed, as did the Country Vrtičkarji of Semič and Wild West of Ljubljana. Ethnological honesty: a custom younger than a hundred years is not yet a custom — which is why this one is recorded at its birth. Most customs never get their first day written down; this one will not lack it.",
  },
  {
    slug: "zvon-2008",
    textSi:
      "Zvon je bil desetletja edini radio vasi: k maši, k pogrebu, ob nevihti. Leta 2008 so v Gribljah blagoslovili in posvetili nov zvon cerkve sv. Vida; o dogodku je nastala spominska knjiga SV. VID GRIBLJE — med redkimi tiskanimi viri, nastalimi v sami vasi. Junija 2026 je ta glas pozvonil ob 500-letnici cerkve, ob maši škofa Glavana. Muzej išče fotografije blagoslova, imena botrov in livarno — vsak zvon nosi žig, vsak žig zgodbo.",
    textEn:
      "For decades the bell was the village's only radio: to mass, to a funeral, at a storm. In 2008 a new bell of the church of St. Vitus was blessed and consecrated in Griblje; a memorial book, SV. VID GRIBLJE, arose from the event — among the rare printed sources created in the village itself. In June 2026 that voice rang out at the church's 500th anniversary, at Bishop Glavan's mass. The museum seeks photographs of the blessing, the godparents' names and the foundry — every bell carries a mark, every mark a story.",
  },
  {
    slug: "zaselki-griblje",
    textSi:
      "Griblje niso ena vas, ampak štiri: Dolnje ob reki, Srednje ob cesti, Gornje pod hribi in Brinsko selo zase. Razložena vas, kakršne znajo narediti samo reke: hiše tam, kjer je bila zemlja. Šola, cerkev in gasilski dom so skupni — razlike so ostale v ležah. Kdor razmejuje zna, je vabljen kot kartograf.",
    textEn:
      "Griblje is not one village but four: Dolnje by the river, Srednje by the road, Gornje beneath the hills, and Brinsko selo apart. A scattered village only rivers know how to build: houses where the land was. School, church and fire station are shared — the differences stayed in the lie of the land. Whoever can draw the lines is invited as a cartographer.",
  },
  {
    slug: "goranja-lokva",
    textSi:
      "Po letu 1848 so kmetje izkrčili brezov gozd in v njem napravili lokvo, kjer so kopali glino za opeko — Goranja lokva. V bližini Rudna peč skriva železovo prst v plasteh. Vsaka stara hiša v vasi nosi v zidu kraj, kjer je ta glina gorela: Bela krajina je gradila iz svoje zemlje, dobesedno.",
    textEn:
      "After 1848 the farmers cleared the birch forest and made a pond in it where clay was dug for brick — Goranja lokva. Nearby, Rudna peč hides iron earth in layers. Every old house in the village carries in its wall a place where this clay was fired: Bela krajina built from its own earth, literally.",
  },
  {
    slug: "strucelj-kmetija",
    textSi:
      "»S pesmijo je delo lažje steklo, včasih do mraka, a vedno skupaj,« pravi Alojz Štrucelj — kmet prirejevalec mleka na kmetiji z okoli devetdesetimi hektari. Pesem pri delu ni bila zabava, ampak tehnologija: ritem, ki je držal koso v enakomerjem loku. Sodobna mlekarska kmetija je podedovala obseg, ne pa več ritma.",
    textEn:
      "»With a song the work flowed easier, sometimes until dusk, but always together,« says Alojz Štrucelj — a milk-producing farmer on a farm of some ninety hectares. Song at work was not entertainment but technology: a rhythm that kept the scythe in an even sweep. The modern dairy farm inherited the scale, but no longer the rhythm.",
  },
  {
    slug: "tamburasi-danica",
    textSi:
      "Ko je pobegnil iz uka, ga je v Ljubljani čakala glasba: v tamburaški skupini društva Danica je mladi Niko Dragoš igral bugarijo — bas, ki v orkestru drži tla. Bugarija je bila njegova prva javna vloga; zadnja bo najstarejši Slovenec. Med njimi: sto zim in eno stoletje.",
    textEn:
      "When he ran away from his apprenticeship, music awaited him in Ljubljana: in the Danica society's tambura group young Niko Dragoš played the bugarija — the bass that holds the floor in an orchestra. The bugarija was his first public role; the last will be the oldest Slovene. Between them: a hundred winters and one century.",
  },
  {
    slug: "kopalisce-griblje",
    textSi:
      "Slovenija ima eno kopalno reko in ta teče mimo Gribelj: poleti čez petindvajset stopinj. Ob vasi je toplota dobila institucijo — kopališče, ki drži poletni koledar: julija kolesarski rally, avgusta Pasuljada. Kjer se čez dan kopa, se zvečer kuha in pleše.",
    textEn:
      "Slovenia has one bathing river, and it flows past Griblje: over twenty-five degrees in summer. By the village the warmth acquired an institution — the bathing place that keeps the summer calendar: the bicycle rally in July, the Pasuljada in August. Where people swim by day, bean stew cooks and dances by night.",
  },
  {
    slug: "dakota-otok",
    textSi:
      "Ko so luči na travniku ugasnile, ni odletelo vse: pri Otoku je ostala dakota C-47 — edini ohranjeni primerek v Sloveniji. Letalo, ki je nosilo ranjence v italijanske bolnišnice, zdaj stoji kot spomenik, ki se ga lahko dotakneš. Vsako pomlad se ob njem obnavlja spomin Vranov let.",
    textEn:
      "When the lights on the meadow went out, not everything flew away: a C-47 Dakota remained at Otok — the only preserved example in Slovenia. The aircraft that carried the wounded to the hospitals of Italy now stands as a monument you can touch. Every spring the memory of the Raven's Flight renews beside it.",
  },
  {
    slug: "veselko-fotograf",
    textSi:
      "Nekatere zgodbe je mogoče pripovedovati samo zato, ker jih je nekdo posnel. Franjo Veselko, profesor in partizanski fotograf, je marca 1945 stal ob polju pri Gribljah, ko so ranjenci čakali na letalo. Njegovih približno dva tisoč posnetkov je med temeljnimi viri za svobodno Belo krajino — dva sta glavni sliki te zbirke.",
    textEn:
      "Some stories can be told only because someone photographed them. Franjo Veselko, teacher and partisan photographer, stood by the field at Griblje in March 1945 as the wounded waited for an aircraft. His roughly two thousand photographs are among the foundational sources for free Bela krajina — two of them are main images of this collection.",
  },
  {
    slug: "zracni-most-krasinec",
    textSi:
      "25. in 26. marca 1945: 48 ur, 2041 ljudi, dakote in spitfiri s partizanskega letališča Krasinec. Med evakuiranci je bila tudi pisateljica Alma Karlin — ženska, ki je obkrožila svet, je zadnjo veliko pot opravila s travnika ob Kolpi. Največje reševanje zrakom na slovenskih tleh.",
    textEn:
      "25 and 26 March 1945: 48 hours, 2041 people, Dakotas and Spitfires from the partisan airfield of Krasinec. Among the evacuees was the writer Alma Karlin — the woman who had circled the world made her last great journey from a meadow by the Kolpa. The greatest airborne rescue on Slovene soil.",
  },
  {
    slug: "petstoletnica-2026",
    textSi:
      "Junija 2026 je cerkev sv. Vida praznovala petsto let prve pisne omembe: mašo je vodil škof glavnega mesta, izšla je knjižica Memento, vas pa se je zbrala kot ena duša. Petstoletnica je bila tudi rojstni dan tega muzeja — zbirka je odprta veveričje leto zgodovine vasi.",
    textEn:
      "In June 2026 the church of St. Vitus marked five hundred years of its first written mention: the mass was led by a bishop of the capital, the booklet Memento was published, and the village gathered as one soul. The quincentenary was also this museum's birthday — a collection opened as an anniversary year of the village's history.",
  },
  {
    slug: "crni-moceril",
    textSi:
      "Pod Jelševnikom pri Gribljah živi črni močeril — podvrsta človeške ribice, ki je nikjer drugje ni: vse črno, oči pod kožo, sto let starosti možne. Odkrita 1986, dolgo brez fotografije — danes jo v zbirki nosi posnetek Arneja Hodaliča. Življenje pod travnikom, ki ga kopalci ne vidijo.",
    textEn:
      "Beneath Jelševnik by Griblje lives the black olm — a subspecies of the proteus found nowhere else: all black, eyes beneath the skin, a hundred-year lifespan possible. Discovered in 1986, long without a photograph — today the collection carries Arne Hodalič's shot of it. Life beneath the meadow the bathers never see.",
  },
  {
    slug: "pgd-griblje-1927",
    textSi:
      "Vsaka slovenska vas ima tri strehe: cerkev, šolo in gasilski dom. PGD Griblje je bilo ustanovljeno leta 1927 — stoletnico bo praznovalo leta 2027 s 140 člani. Dom pri Gribljah 35B je dvorana, v kateri se dražijo žetve, igrajo igre in presedijo večeri: najdaljši živi spomin vasi.",
    textEn:
      "Every Slovene village has three roofs: the church, the school and the fire station. The Griblje volunteer fire brigade was founded in 1927 — it will mark its centenary in 2027 with 140 members. The hall at Griblje 35B is where harvests are auctioned, plays staged and evenings spent: the village's longest living memory.",
  },
  {
    slug: "kolesa-torpedo",
    textSi:
      "Gribljska kolesarska sekcija nosi ime po znamki Torpedo — kolesih, na katerih je rasla generacija. Julija vsako leto rally starodobnih koles pripelje v vas kolesa, starejša od večine gledalcev. Zapis v zbirki nosi fotografijo kola znamke Torpedo iz odprtega arhiva — enake znamke, kakršna vozijo gribeljski kolesarji.",
    textEn:
      "The Griblje cycling section bears the name of the Torpedo brand — the bicycles a generation grew up on. Every July the vintage-bicycle rally brings to the village machines older than most of the spectators. The collection's record carries a photograph of a Torpedo bicycle from the open archive — the same brand Griblje's riders ride.",
  },
];

export function getMinuteStory(slug: string): MinuteStory | undefined {
  return MINUTE_STORIES.find((story) => story.slug === slug);
}
