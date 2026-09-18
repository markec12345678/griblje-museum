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
      "1468: Griblach. 1490: Briglach. 1593: Griblah. V urbarjih Grüble. Danes: 329 prebivalcev, tri celo pol kvadratnega kilometra, 153 metrov nad morjem, poštna številka 8332 Gradac. Popis 2020: 334 duš — 172 moških in 162 žensk. Ime? Jezikoslovci še razpravljajo: goba, gruda, brazda ali travnata strmina. Vas pa računa naprej — od prve črke v listini do zadnje številke statističnega urada. Na sliki tega zapisa jih drži skupaj Freyerjeva karta iz leta 1843: Griblje, kurzivno po slovensko, pod njim še (Grüble) — obe imeni vasi na enem listu.",
    textEn:
      "1468: Griblach. 1490: Briglach. 1593: Griblah. Grüble in the urbars. Today: 329 inhabitants, three and a half square kilometres, 153 metres above the sea, postal code 8332 Gradac. The 2020 census: 334 souls — 172 men and 162 women. The name? Linguists still debate: a mushroom, a clod, a furrow or a grassy slope. The village keeps counting — from the first letter of the deed to the statistical office's latest figure. On this record's image, Freyer's map of 1843 holds it all together: Griblje in italic Slovene, with (Grüble) beneath — the village's two names on one sheet.",
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
    slug: "porocna-1669",
    textSi:
      "Leto 1669: nov podzemeljski župnik odpre prazen zvezek — in ne začne s krsti, ampak s svatbami. Najstarejša knjiga župnije Podzemelj je poročna: po stoletju vojn je bil najnujnejši zapis sklenitev dveh hiš. Poročni vpis je v rodoslovju najmočnejša točka, ker spoji dve družini v eno. Stran, po kateri je listal župnik, lahko danes lista vsak Gribeljec — na Matricula Online, pod signaturo 04795.",
    textEn:
      "The year 1669: a new Podzemelj priest opens an empty book — and does not begin with baptisms, but with weddings. The parish's oldest book is a marriage register: after a century of wars, the most urgent entry was the joining of two households. A marriage entry is the strongest point in a family tree, because it joins two families into one. The page the priest leafed through, any Griblje family can leaf through today — on Matricula Online, under the shelfmark 04795.",
  },
  {
    slug: "spanska-gripa-1918",
    textSi:
      "Jesen 1918: vojna se končuje, a v podzemeljsko mrliško knjigo pisar ob pljučnici piše »(španka)«. Pet tednov in pol — petinpetdeset pogrebov, petkrat več, kot jih je župnija vajena. Griblje izgubijo Ano Vegino, petindvajsetletnico, in Alojzija Orehekta, sedemindvajsetletnika. Knjiga, ki se je začela s svatbami leta 1669, piše smrt. Signatura 04894 — preberite jo sami.",
    textEn:
      "The autumn of 1918: the war is ending, but in the Podzemelj death register the writer adds »(Spanish)« beside pneumonia. Five and a half weeks — fifty-five funerals, five times the parish's usual. Griblje loses Ana Vegina, twenty-five, and Alojzij Orehek, twenty-seven. The archive that began with weddings in 1669 writes death. Shelfmark 04894 — read it yourself.",
  },
  {
    slug: "kolpa-extremi",
    textSi:
      "Eno leto, dva ekstrema: julija 2022 Kolpa pri Metliki komaj teče — 7,8 kubičnega metra na sekundo, najsušeši julij od 1961. Septembra istega leta ista postaja izmeri 1.009 kubičnih metrov na sekundo — največ odkar se meri. Skoraj stotridesetkrat več vode v dveh mesecih. Reka ekstremov ima v zbirki svoj zapis.",
    textEn:
      "One year, two extremes: in July 2022 the Kolpa at Metlika barely runs — 7.8 cubic metres a second, the driest July since 1961. That September the same station measures 1,009 cubic metres a second — the most ever measured there. Nearly a hundred and thirty times more water within two months. The river of extremes has its record in the collection.",
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
  {
    slug: "matija-totter",
    textSi:
      "Med fanti, ki so v nedeljo zahajali v gostilno, je eden sedel doma pod tepko in zapisoval pregovore. Vaščani so ga imeli za čudaka; zgodovina ga ima za rešitelja. Matija Totter — Jandreč Matiček — je za prijatelja Janka Barleta zapisal ženitovanjske običaje, pastirski križevo in kresno pesem pozemeljske fare; zahvalil se mu je tudi etnolog Županič. Pri šestnajstih je peš odšel v Novo mesto prosit za šolanje; opat ga je zavrgel. Odšel je v Ameriko, kupil bombažno farmo v Teksasu in ni nikoli več videl Kolpe. Najmlajši sin je raziskoval posledice atomskih bomb. Fant pod tepko je zmagal — samo ne tam, kjer je sanjal.",
    textEn:
      "Among the boys who went to the inn on Sundays, one sat at home under the bench writing down proverbs. The villagers took him for an oddity; history takes him for a saviour. Matija Totter — Jandreč Matiček — wrote down for his friend Janko Barle the wedding customs, the shepherds' križevo and the bonfire song of the Podzemelj parish; the ethnologist Županič thanked him too. At sixteen he walked to Novo mesto to beg for schooling; the abbot refused him. He left for America, bought a cotton farm in Texas and never saw the Kolpa again. His youngest son researched the aftermath of the atomic bombs. The boy under the bench won — just not where he had dreamed.",
  },
  {
    slug: "janko-barle",
    textSi:
      "Njegovo otroštvo je dišalo po Kolpi: »Srečna, lepa leta,« je zapisal po desetletjih v Zagrebu, kjer je bil kanonik, tajnik nadškofa in reformator hrvaške cerkvene glasbe. A Janko Barle, učiteljev sin iz Podzemlja, je vzel Belo krajino s seboj: objavil je ženitovanjske običaje in prvo študijo o pisanicah, pesmi je posredoval Štrekelju v zbirko Slovenskih narodnih pesmi. In ko je čez Evropo zibel noben računalnik, je iz starih zdravilskih knjig sestavil 3.000 slovenskih imen rastlin — tam, kjer sta končala Valvasor in Žois. Etnolog, botanik, glasbenik. Vse naenkrat, vse iz enega otroštva ob reki.",
    textEn:
      "His childhood smelled of the Kolpa: 'Happy, beautiful years,' he wrote decades later from Zagreb, where he was a canon, the archbishop's secretary and the reformer of Croatian church music. But Janko Barle, a teacher's son from Podzemelj, took Bela krajina with him: he published the wedding customs and the first study of the Easter eggs, and passed songs on to Štrekelj's collection of Slovene Folk Songs. And when no computer stirred in Europe, he compiled 3,000 Slovene plant names from old healing books — where Valvasor and Zois had stopped. Ethnologist, botanist, musician. All at once, all from one childhood by the river.",
  },
  {
    slug: "joze-dular",
    textSi:
      "Trideset let je vodil Belokranjski muzej v Metliki — in petdeset let živel v isti hiši, na kateri mu je po smrti ploščo postavilo društvo, ki ga je imelo za predsednika. Jože Dular je bil pesnik nove romantike in pripovednik, a njegov najgloblji pečat je zgodovina: Metlika skozi stoletja, Semič, Adlešiči, gasilstvo, godba. Za Griblje je najpomembnejša tanka knjižica o Županičevi spominski plošči — dokument o dnevu, ko se je vas spomnila svojega največjega sina. Vsak muzej vasi, tudi ta digitalni, stoji na plečih takih mož. Dular jih je nosil trideset let.",
    textEn:
      "For thirty years he led the Bela krajina museum in Metlika — and for fifty he lived in the same house, on which the society that had him for president raised his plaque after his death. Jože Dular was a poet of the new romanticism and a storyteller, but his deepest mark is history: Metlika through the Centuries, Semič, Adlešiči, the fire brigade, the town band. For Griblje the most precious thing is the slim booklet on Županič's memorial plaque — the document of the day the village remembered its greatest son. Every village museum, this digital one too, stands on the shoulders of such men. Dular carried them for thirty years.",
  },
  {
    slug: "pisanice",
    textSi:
      "Vosek, ki se nanese na lupino, barvi ne pusti, da bi se spraskala v risbo. Ko jajce pride iz kopalne barvila, ostane pod voskom svetel vzorec: rastlinje, krogi, zvezde. Belokranjske pisanice so to risbo nosile stoletja; leta 1893 jih je znanstveno obdelal Janko Barle, leta 2012 pa jih je država vpisala v register žive nesnovne dediščine. Vsako pomlav so roke — danes med njimi Vesna Veselič iz Adlešičev — znova vzeli jajce in paličico. Najkrhkejši predmet na svetu: umre, ko se lupina razbije. Zato je vsaka pisanica, ki jo vidite, hkrati muzej.",
    textEn:
      "The wax laid on the shell does not let the dye scratch its way into the drawing. When the egg comes out of the colour bath, a bright pattern stays beneath the wax: plants, circles, stars. The pisanice of Bela krajina have carried this drawing for centuries; in 1893 Janko Barle treated them scholarly, and in 2012 the state entered them in the register of living intangible heritage. Every spring hands — today among them Vesna Veselič of Adlešiči — took up egg and stylus again. The most fragile object in the world: it dies when the shell breaks. That is why every pisanica you see is a museum at once.",
  },
  {
    slug: "kresovanje",
    textSi:
      "Ena noč na leto: pred sv. Janezom so griči zagoreli, okrog ognja pa so pele kresne pesmi — vsaka vas svojo, z lastno kitico. Za pozemeljsko faro jih je zapisal gribeljski Matiček in je niso pozabili: v Adlešiški fari kres z besedilo gori še danes. Kres je šega, ki ne pusti predmeta: ostanejo pepel, pesem in spomin. Zato je ta zapis vabilo — ne razstava. Kje je gorel gribeljski kres, kdaj je ugasnil, kdo je pel zadnjo pesem? Če veste, ste vi njegov arhiv.",
    textEn:
      "One night a year: before St. John's day the hills caught fire, and around the flames the bonfire songs were sung — each village its own, with its own verse. For the Podzemelj parish Griblje's Matiček wrote them down, and they were not forgotten: in the Adlešiči parish the bonfire with its words still burns today. A bonfire is a custom that leaves no object behind: ash, a song and a memory remain. That is why this record is an invitation — not an exhibit. Where did the Griblje bonfire burn, when did it go out, who sang the last song? If you know, you are its archive.",
  },
  {
    slug: "kuhanje-zganja",
    textSi:
      "Jeseni je po vasi dišalo po kuhani hruški. Kuharija — kotel, čelada, cev — je šla od domačije do domačije, kuhar pa je znal, kaj proč: prvi tok in zadnjega. Ostalo je bilo srce, po katerem so sodili domačijo. Ob kuhariji se je zbrala ulica; otroci so dobili sladko prenape, zgodbe so tekle kakor kapljica po cevi. Žganje je potem živelo v kleti: zdravilo za gripo, zob in strah, darilo za župnika in svatbo, denar za pomoč pri žetvi. Fotografija v tem zapisu je iz leta 1949 — ista ročna veščina, ki je ne moremo dokumentirati po vonju.",
    textEn:
      "In autumn the village smelled of cooked pear. The still — kettle, helm, pipe — went from farm to farm, and the distiller knew what to pour away: the first run and the last. What remained was the heart, by which a farm was judged. The lane gathered round the still; children got the sweet slops, and stories ran like the drop down the pipe. The brandy then lived in the cellar: medicine for flu, toothache and fright, a gift for the priest and for weddings, coin for help at harvest. The photograph in this record is from 1949 — the same hand-craft, which we cannot document by smell.",
  },
  {
    slug: "loke-in-studenci",
    textSi:
      "Spomladi se po obkolpski ravnini zgodita dve reki: ena vidi, ki teče po koritu, in ena nevidna, ki ponika pod tlemi. Velik del vode uide v apnenec in se vrne kot studenci — izviri, ki bruhajo kakor dih. Zato je paradoks resničen: vas ob najbolj darežljivi reki spada med najbolj suhe kraje Bele krajine. Loke, ki jih je Kolpa naredila s poplavljanjem, so bile senožeti; studenci napajališča. Vsak izvor je ime nosil. Muzej jih išče — preden ostanejo samo v ustih najstarejših.",
    textEn:
      "In spring two rivers move through the Kolpa plain: one visible, running in its bed, and one unseen, sinking beneath the ground. Much of the water escapes into the limestone and returns as studenci — springs that burst like breath. So the paradox is real: a village beside the most generous river belongs among the driest places in Bela krajina. The loke meadows the Kolpa made by flooding were hayfields; the springs watering places. Every spring bore a name. The museum seeks them — before they remain only in the mouths of the oldest.",
  },
  {
    slug: "etimologija-gribljati",
    textSi:
      "Kako stara je beseda, ki jo rečete vsak dan? Griblje izhaja iz staroslovanskega gribljati — brazdati, orati. Vas se ne imenuje po svetniku, gospodu ali reki: ime je dejanje, s katerim je človek odprl gozd in vrgel seme. V urbarjih piše Grüble — mala brazda; razlaga, da bi šlo za »grobljo«, prod, ne drži. Torej: vsakokrat, kdor izgovori ime vasi, ponovi prvi plug. To je najstarejši zapis v tej zbirki — starejši od vsakega papirja, ker je zapisan v imenu.",
    textEn:
      "How old is the word you say every day? Griblje comes from the Old Slavic gribljati — to furrow, to plough. The village is not named after a saint, a lord or a river: the name is the act by which a man opened the forest and cast seed. In the urbaria it is written Grüble — the little furrow; the explanation that it was a 'groblja', a gravel bank, does not hold. So: whoever pronounces the village's name repeats the first plough. That is the oldest record in this collection — older than any paper, because it is written into the name.",
  },
  {
    slug: "td-griblje",
    textSi:
      "Vsaka vas ima koledar, a ne vsaka ima tistega, ki ga drži. V Gribljah ga drži Turistično društvo: poleti Pasuljada s kmečkimi ženami, junija Kavbojski žur, julija rally starodobnih koles s sekcijo Torpedo — z ustavitvijo v cerkvi in učno uro v stari šoli. In ko se je rodila zamisel o digitalnem muzeju vasi, je bilo naravno, da ga nosi prav TD. Ta zapis je hišnik, ki se predstavi na vratih: muzej, ki ga bereš, je projekt istega društva, ki kuha pasulj.",
    textEn:
      "Every village has a calendar, but not every village has the one who holds it. In Griblje the Tourist Society holds it: the Pasuljada with the farm women in summer, the Cowboy Party in June, the vintage-bicycle rally with the Torpedo section in July — with a stop at the church and a lesson in the old school. And when the idea of a digital village museum was born, it was natural that the TD should carry it. This record is the caretaker introducing himself at the door: the museum you are reading is a project of the same society that cooks the beans.",
  },
  {
    slug: "gribeljci-po-svetu-2019",
    textSi:
      "Devetnajstega junija 2019 so se v Gribljah zbrali tudi tisti, ki jih na volitvenem imeniku ni več: Gribeljci, ki so svoj drugi dom našli izven rojstne vasi. Ob 130-letnici šole sta KS in TD pripravili srečanje — sedanji in nekdanji učenci so pokazali, kako je bilo v klopeh nekoč in kako danes. Šola je bila pravi okvir: edina ustanova, ki jo je delil vsak, ki je odšel, in vsak, ki je ostal. Za izseljensko vas je tak dan več kot slavje — preverjanje, ali jezik, razpet po svetu, še najde sklanjatev.",
    textEn:
      "On 19 June 2019 those no longer on the village register gathered in Griblje too: the Griblje people who found a second home away from the birth village. At the school's 130th anniversary the local community and the TD prepared a reunion — present and former pupils showed how the benches once were and how they are today. The school was the right frame: the one institution shared by everyone who left and everyone who stayed. For an emigrant village such a day is more than a feast — a test whether a tongue stretched across the world still finds its declension.",
  },
  {
    slug: "ko-se-pticki-zenijo",
    textSi:
      "Dvanajstega marca pravijo v Beli krajini, da se ptički ženijo — in po vodi spustijo čolne, da gregorječek odplavi na jug ter odpre pot pomladi. Leta 2026 so ta običaj v Gribljah obudili v gasilskem domu: učenci podružnične šole so peli in recitirali, učitelj Banovec igral harmoniko, dramska skupina iz Starega trga nasmejala občinstvo, Country Roses plesale. In potem so podelili priznanja za najboljši kruh — pekle so ga vaške pekarice. Običaj, ki bi se izgubil, je živel eno soboto znova. Recept zmagovalnega kruha išče muzej.",
    textEn:
      "On the twelfth of March they say in Bela krajina that the birds marry — and boats are launched on the water, so that little Gregory sails south and opens the road for spring. In 2026 Griblje revived the custom in the fire station hall: the branch school's pupils sang and recited, teacher Banovec played the accordion, the Stari trg drama group made the audience laugh, Country Roses danced. And then came the awards for the best bread — baked by the village's bakers. A custom that would have been lost lived one Saturday again. The winning loaf's recipe is what the museum seeks.",
  },
  {
    slug: "ciril-totter",
    textSi:
      "Zgodba Jandrečev ima tri dejanja: fantje, ki jim plug ne diši, gredo v svet; ena veja da celo holivoodske zvezde; potem pa se veja vrne. Danes na Jandrečetovi domačiji ekološko kmetuje Ciril Totter — brez kemije, po merilih, ki bi jih stari prepoznali kot svoja. Predeluje na domu, opravlja storitve. In teče maratone — dvainštirideset kilometrov po cestah, po katerih so njegovi pekli kruh. Kmečka linija obkolpske vasi se ni prekinila: se je preoblikovala. Iz pluga v certifikat, iz hoje v Maribor — v maraton.",
    textEn:
      "The story of the Jandreči has three acts: sons for whom the plough holds no charm go into the world; one branch even gives Hollywood a star; then a branch returns. Today the Jandreči homestead is farmed ecologically by Ciril Totter — no chemistry, by standards the old ones would recognise as their own. Processing at home, services on the side. And he runs marathons — forty-two kilometres over roads on which his people baked their bread. The farming line of a Kolpa village did not break: it reshaped itself. From the plough into a certificate, from the walk to Novo mesto — into the marathon.",
  },
  {
    slug: "praznik-ks-2024",
    textSi:
      "Petnajstega septembra 2024 se je vas zbrala na prazniku krajevne skupnosti — prvem po desetletjih. Spominjali so se septembra 1941, napada na italijanske mejne policiste; nagovoril jih je 89-letni dr. Franc Brinc, šolar te vasi, ki je znanost odnesel po svetu in denar prinesel domov. Ob prazniku so odprli tudi njegovo spominsko sobo v gasilskem domu. Praznik, rojen iz spomina na vojno, je zaživel kot praznik dobrote. In dokaz, da si vas svoj praznik zna znova izmisliti.",
    textEn:
      "On 15 September 2024 the village gathered for the local community's festival — the first in decades. They remembered September 1941, the attack on the Italian border police; they were addressed by the 89-year-old dr. Franc Brinc, this village's schoolboy who took scholarship round the world and brought the money home. His memorial room in the fire station hall opened that day too. A festival born of the memory of war came alive as a festival of generosity. And as proof that a village knows how to invent its own feast again.",
  },
  {
    slug: "ljudje-ob-kolpi",
    textSi:
      "Devetnajsto stoletje so vas zapisovali semeniščniki, dvajseto muzeji. Enaindvajseto jo zapisuje radijska rubrika: Ljudje ob Kolpi na Radiu Odeon, piše jo Boris Grabrijan — ob obletnicah rojstev in smrti objavlja življenjepise obkolpskega sveta. Brez nje bi bila polovica te zbirke prazna: Dragoš, Totterji, Barle, Dular, Kambič — vsi nastali prav tam. Zgodovina male vasi danes nastaja v redakciji lokalnega radia, ob šestih in štirideset pet zjutraj. Radijski val ne pusti lista — zato je njeno shranjevanje muzejsko dejanje.",
    textEn:
      "The nineteenth century had seminarians to write the village down, the twentieth had museums. The twenty-first has a radio column: People by the Kolpa on Radio Odeon, written by Boris Grabrijan — on birth and death anniversaries it publishes the biographies of the Kolpa world. Without it half this collection would be empty: Dragoš, the Totters, Barle, Dular, Kambič — all of them took shape right there. The history of a small village is made today in a local radio newsroom, at six forty-five in the morning. A radio wave leaves no leaf — which is why keeping it is a museum act.",
  },
  {
    slug: "valvasor-1689",
    textSi:
      "Pred njim so bile listine; po njem je bila knjiga. Leta 1689 je Janez Vajkard Valvasor izdal Slavo vojvodine Kranjske — štiri zvezke, tri tisoč petsto dvaintrideset strani, petsto osemindvajset bakrorezov: dežela, zapisana po lastnem hojenju in merjenju. Med njenimi stranmi je prvič po imenu tudi Črnomelj z okolico. Cena? Vsa: Valvasor je moral prodati Bogenšperk in umrl revno, komaj petdesetleten. Vsak, ki vas zapisuje, je njegov dedič — ta muzej z drugimi orodji: strežnik namesto tiskarne v Nürnbergu.",
    textEn:
      "Before him there were documents; after him, a book. In 1689 Janez Vajkard Valvasor published The Glory of the Duchy of Carniola — four volumes, three thousand five hundred thirty-two pages, five hundred twenty-eight copperplates: a land written down by his own walking and measuring. Among its pages, for the first time by name, Črnomelj and its surroundings too. The price? Everything: Valvasor had to sell Bogenšperk and died poor, barely fifty. Everyone who writes a village down is his heir — this museum with other tools: a server instead of a Nuremberg press.",
  },
  {
    slug: "pecnica-susenje-sadja",
    textSi:
      "Jesen je imela ob Kolpi svojo tovarno: pečnico za sušenje sadja. Košare sliv so postopoma postajale police suhih prstov — pečenih sliv, ki so držale zimo: otrokom v šolo, svatbam na mizo, kmetiji v shrambo. Na fotografiji Franca Vesela iz leta 1928, posneti v sosednjih Adlešičih, dela cela družina: ženske, moški, otroci. Poglejte dim nad pečnico — to je zvok te slike: vonj jeseni, ki se je prenesel čez celo stoletje.",
    textEn:
      "Autumn had its factory on the Kolpa: the fruit-drying oven. Baskets of plums slowly became shelves of dried fingers — baked plums that carried the winter: to school for the children, to the table for the weddings, to the larder for the farm. In Fran Vesel's photograph from 1928, taken in neighbouring Adlešiči, a whole family works: women, men, children. Look at the smoke above the oven — that is the sound of this picture: the smell of an autumn carried across a whole century.",
  },
  {
    slug: "stari-zemljevidi",
    textSi:
      "Leto tisoč štiristo oseminšestdeset: na listini se prvič pojavi Griblach. Sledijo Briglach, Griblah, v urbarjih in na najstarejšem zemljevidu Grüble. Vsak zapis je bil dejanje oblasti: kar je bilo zapisano, je bilo obdavčeno in branjeno. Na sliki tega zapisa je karta iz leta 1714 — vojvodina Kranjska z Belo krajino na enem listu, delo nugiškega kartografa Homanna po Valvasorjevem gradivu. Od urbarja do orbite vodi isti domislej: kraj, ki ni zapisan, ni zastopan.",
    textEn:
      "The year 1468: on a document the name Griblach appears for the first time. Briglach and Griblah follow; in the urbaria and on the oldest map, Grüble. Every entry was an act of power: what was written down was taxed and defended. In this record's image stands the map of 1714 — the Duchy of Carniola with Bela krajina on a single sheet, the work of the Nuremberg cartographer Homann after Valvasor's material. From urbarium to orbit runs one idea: a place that is not written down is not represented.",
  },
  {
    slug: "sd-griblje-sport",
    textSi:
      "Vas, ki je dala maratonca, je tek vzela za svojega. Na ljubljanskem maratonu leta 2022 jih je teklo sedem — maratonsko razdaljo Ciril Totter. Leta 2024 se je Peter Križan pomeril na svetovnem prvenstvu v triatlonu v Španiji: 27. mesto med šestinsedemdesetimi. Na sliki je štartna množica pod lokom — jesensko prizorišče, kamor vsako leto privihajo tudi gribeljski čevlji.",
    textEn:
      "A village that gave a marathon man took running for its own. Seven ran the Ljubljana marathon of 2022 — Ciril Totter over the full distance. In 2024 Peter Križan raced the triathlon world championship in Spain: 27th among seventy-six. In the image stands the start crowd under the arch — the autumn scene to which Griblje's shoes travel every year.",
  },
  {
    slug: "belokranjska-nosa",
    textSi:
      "Ko se je belokranjska žena oblekla praznično, se je pokrajina ogledala v njej: rokavci, nagubano krilo, volnen pas — in nad vsem peča, bela ruta, ki se praznično veže z rožo na čelu. Risba na sliki je iz prve znanstvene študije o peči, ki jo je leta 1928 napisal etnograf Stanko Vurnik. Danes noša stopa iz omare na Jurjevanju — leta 2025 je bila Bela krajina osrednja gostja dnevov narodnih noš v Kamniku.",
    textEn:
      "When a Bela krajina woman dressed for a feast, the region saw itself in her: sleeves, pleated skirt, a wool belt — and above all the peča, the white cloth tied festively with a flower on the forehead. The drawing in the image comes from the first scholarly study of the peča, written by the ethnographer Stanko Vurnik in 1928. Today the costume steps from the wardrobe at Jurjevanje — in 2025 Bela krajina was the central guest of the days of national costume in Kamnik.",
  },
  {
    slug: "kanizarica",
    textSi:
      "Najbližja industrijska revolucija te vasi je gorela sedem kilometrov stran: rudnik rjavega premoga Kanižarica, odprt 1857, zaprt 1997. Tja so vozili moški z vse Bele krajine; v jami jih je čakal premog, prah in Perkmandeljc, škrat, ki kazuje nevarnost. Danes na istem mestu stoji muzej z umetnim rovom — in ta zapis povezuje digitalni spomin vasi s fizičnim spominom pokrajine.",
    textEn:
      "This village's nearest industrial revolution burned seven kilometres away: the Kanižarica brown-coal mine, opened 1857, closed 1997. Men drove there from all over Bela krajina; in the pit coal, dust and the Perkmandelc awaited — the dwarf who points out danger. Today a museum with an artificial tunnel stands on the same ground — and this record joins the village's digital memory to the region's physical one.",
  },
  {
    slug: "sturm-1891",
    textSi:
      "Leto 1891: na Dunaju izšel osmi zvezek cesarske enciklopedije, med spomeniki Kranjske pa tudi kmetija v Gribljah. Slikal jo je dunajski Slovenec Josef Sturm; tekst ob sliki opisuje zid z obokanim vhodom, s kamnitimi ploščami tlakovan dvorišče in nizko ognjišče v veži. Najstarejša znana slika vasi — 135 let stara.",
    textEn:
      "The year 1891: in Vienna the eighth volume of the imperial encyclopedia appeared, and among the monuments of Carniola stood a farmstead in Griblje. It was painted by the Viennese Slovene Josef Sturm; the text beside it describes the wall with its arched gateway, the yard paved with stone slabs, the low hearth in the hall. The oldest known picture of the village — 135 years old.",
  },
  {
    slug: "gribeljski-zbul",
    textSi:
      "Pred vinom, pred žitom — čebula. Rodovitna obkolpska polja so nekoč Gribljam dajala glavni denarni pridelek: žbul, kot čebuli rečejo v vasi. Prodajali so ga onstran Gorjancev in na Hrvaškem; Belokranjci Gribljčanom še danes pravijo žbularji. Leta 2012 je pet Gribeljčank izdalo knjižico Gribeljski žbul, na šolskem vrtu pa se sadi še danes.",
    textEn:
      "Before the wine, before the grain — the onion. The fertile fields by the Kolpa once gave Griblje its main cash crop: the žbul, as the onion is called in the village. It was sold beyond the Gorjanci and in Croatia; the people of Bela krajina still call the people of Griblje žbularji. In 2012 five women of Griblje published the booklet Gribeljski žbul, and in the school garden it is still planted today.",
  },
  {
    slug: "arheolosko-najdigsce-ob-kolpi",
    textSi:
      "Pod obkolpskimi njivami pri Gribljah leži pet tisoč let zgodovine: v registru dediščine je ravnina vpisana kot arheološko najdišče z neolitskimi in bronastodobnimi naselbinami, grobiščem Požekov vrt, železnodobno gomilo in rimskimi naselbinami. Vas ne stoji na prazni zemlji — na pet tisočletjih hiš.",
    textEn:
      "Beneath the fields by the Kolpa at Griblje lie five thousand years of history: in the heritage register the plain is entered as an archaeological site with Neolithic and Bronze Age settlements, the cemetery of Požekov vrt, an Iron Age burial mound and Roman settlements. The village does not stand on empty ground — on five millennia of houses.",
  },
  {
    slug: "jurjevo-v-gribljah",
    textSi:
      "Dan pred jurjevim gribeljska šola posadi žbul in splete koš iz brezovih vej; 24. aprila Zeleni Jurij — deček v košu — obide vas od hiše do hiše in zapoje: »Prošel je prošel pisani vuzem, došel je došel zeleni Jure … Dajte mu groš, da vam dojde još!« Šega pastirjev, ki jo nosi šola.",
    textEn:
      "On the eve of the feast the Griblje school plants the žbul and weaves a basket of birch; on 24 April Green George — a boy inside the basket — goes house to house and sings: 'Prošel je prošel pisani vuzem, došel je došel zeleni Jure … Dajte mu groš, da vam dojde još!' A shepherds' custom carried by the school.",
  },
  {
    slug: "mate-zupanic-svarski",
    textSi:
      "Ko je leta 1914 Avstrija napadla Srbijo, se je gribeljski davčni uradnik javil kot prostovoljec. Mate Zupanič-Švarski, brat etnologa Nika, se je z vojsko umaknil skozi Albanijo, obležal v Valoni in na Vidu, se na Krfu spet javil — in odšel na Solunsko fronto. Malarija ga je prepeljala v Francijo, v Toulouse in Nîmes, kjer je 27. aprila 1917 umrl. Pesnik Janko Lavrin mu je posvetil sonete; Griblje so v isti vojni izgubile še tri brate Dragoše. Poslušajte minuto o sinu, ki se ni vrnil.",
    textEn:
      "When Austria attacked Serbia in 1914, a tax clerk of Griblje volunteered. Mate Zupanič-Švarski, brother of the ethnologist Niko, retreated with the army through Albania, lay in hospital at Vlorë and on Vido, volunteered again on Corfu — and went to the Salonika front. Malaria carried him to France, to Toulouse and Nîmes, where he died on 27 April 1917. The poet Janko Lavrin dedicated sonnets to him; in the same war Griblje lost also the three Dragoš brothers. A minute on the son who did not come home.",
  },
  {
    slug: "tobacka-leta",
    textSi:
      "Po vojni so strokovnjaki presenetili obkolpske kmete: podnebje Bele krajine je primerno za tobak. V Gribljah je burley zrasel v vodilno poljščino — rastline čez dva metra, vsak list z roko, sušenje na palicah, vonj nad vasjo celo poletje. Do osemdesetih ga je gojilo sedemdeset belokranjskih kmetov; potem so prišli cenejši tobak, upad kadilcev in konec ljubljanske tovarne. Polja so se vrnila koruzi — spomin pa še diši.",
    textEn:
      "After the war the experts surprised the farmers by the Kolpa: Bela krajina's climate suits tobacco. In Griblje burley grew into a leading crop — plants past two metres, every leaf by hand, curing on sticks, the smell over the village all summer. By the 1980s seventy Bela krajina farmers grew it; then came cheaper tobacco, the decline of smokers, the end of the Ljubljana factory. The fields went back to maize — the memory still smells.",
  },
  {
    slug: "krizevo-pastirski-dan",
    textSi:
      "Štirideset dni po veliki noči so belokranjski pastirji praznovali križevo: živina je šla na pašnike na vse leto, pastirji pa so imeli ta dan svoj praznik. Matija Totter je njihove navade zapisal za Barleta in Županiča; sto let pozneje so kmečke žene in turistično društvo igre obudile na kopališču. Leta 2026 sta pastirski dan ob Kolpi priredili kolesarska sekcia Torpedo in Dragica Piškurič — s pečenimi jajci in vsemi generacijami.",
    textEn:
      "Forty days after Easter the shepherds of Bela krajina kept križevo: the stock went to pasture for the whole year, and the shepherds had their own feast. Matija Totter wrote their ways down for Barle and Županič; a hundred years later the farm women and the tourist society revived the games at the pool. In 2026 the Torpedo cycling section and Dragica Piškurič held a shepherds' day by the Kolpa — with painted eggs and every generation.",
  },
  {
    slug: "razglednica-1903",
    textSi:
      "Dvaindvajsetega aprila 1903 je Fani Mežnaršič iz Metlike napisala razglednico in jo naslovila gribeljski učiteljici. Besedilo je bilo šala o železnici, ki se je gradila pol stoletja — in Gribljam obšla za šest kilometrov. Kartica je prispela; vlak v vas ni nikoli. Najstarejši znani naslovljeni predmet, ki je Griblje doseže po pošti, danes drži spomin na čas, ko je bila pismenost stanovala v šoli.",
    textEn:
      "On 22 April 1903 Fani Mežnaršič of Metlika wrote a postcard and addressed it to the Griblje schoolmistress. The text joked about the railway that had been building itself for half a century — and missed Griblje by six kilometres. The card arrived; the train never did. The oldest known addressed item to reach Griblje by post now holds the memory of a time when literacy lived at the school.",
  },
  {
    slug: "dkz-griblje",
    textSi:
      "V Gribljah sta dva koledarja: tisti z žigi pišejo župani, tisti s kruhom pa kmečke žene. Društvo je leta 1996 soizdalo knjižico o gribeljskem žbulu, obudilo pastirske igre na kopališču in vsako pomlad naredilo Pozdrav pomladi — s folklorom, Viniškimi cür in tekmovalno peko kruha. Roke, ki držijo vas, ne prosijo za plakat: prosijo za moko.",
    textEn:
      "Griblje has two calendars: the stamped one is written by mayors, the bread one by the farm women. The society co-published the booklet on the Griblje žbul in 1996, revived the shepherds' games at the pool, and every spring makes the Spring Greeting — with folklore, the Viniške cür and a competitive bread baking. The hands that hold the village do not ask for a poster: they ask for flour.",
  },
  {
    slug: "anton-brodaric",
    textSi:
      "Anton Brodarič je z Gribelj odšel na tritedensko ekspedicijo v Azijo in stopil na vrh Mera Peaka: 6.467 metrov, najvišja točka, ki jo je kdaj dosegel človek iz te vasi ob Kolpi. Doma so ga pričakali v Domu krajanov — sedemdeset ljudi v prostoru za osemnajst. Občina mu je podelila priznanje; čajanka v Kovačnici sreče pa je zgodbo nosila čez zimo. Ravnina, ki pošlje človeka na Himalajo.",
    textEn:
      "Anton Brodarič went from Griblje on a three-week expedition to Asia and stood on the summit of Mera Peak: 6,467 metres, the highest point ever reached by a man of this village on the Kolpa. At home they met him in the Dom krajanov — seventy people in a room for eighteen. The municipality gave him its recognition; a tea evening at the Kovačnica sreče carried the story through the winter. A plain that sends a man to the Himalaya.",
  },
  {
    slug: "novo-zivljenje-1914",
    textSi:
      "Leta 1914 je pri Družbi sv. Mohorja izšla povest Novo življenje, katere prvi stavek glasi: »Na malem griču je čepela vas Griblje.« Piše jo učitelj Josip Kostanjevec, dogaja pa se med gradnjo šole: oderuh, modri Jekovec in učitelj Tratar. Ko popotnik vpraša, ali so lepo poslopje napravili sami, gre odgovor v zgodovino: »Sami Gribljani, s svojimi žulji, s svojim znojem in po lastni pameti!«",
    textEn:
      "In 1914 the St. Hermagoras Society published a tale called Novo življenje whose first sentence reads: \"On a small hill sat the village of Griblje.\" It was written by the teacher Josip Kostanjevec and set during the building of the school: a usurer, the wise Jekovec and the teacher Tratar. When a traveller asks whether the fine building was raised by the villagers themselves, the answer goes into history: \"Ourselves, the Griblje people, with our blisters, with our sweat and by our own wits!\"",
  },
  {
    slug: "ilirska-carina-1809",
    textSi:
      "Med letoma 1809 in 1813 so bile te dežele francoske Ilirske province — in Griblje je v uradnih seznamih carinskih uradov inšpektorata Sisek stalo med Metliko in Vinico: postaja ob meji s Turškim cesarstvom. Štiri leta je Napoleonova carinarnica pregledovala blago na Kolpi. Imperiji so prihajali in odhajali; prehod ob reki je ostal.",
    textEn:
      "Between 1809 and 1813 these lands were the French Illyrian Provinces — and in the official lists of customs offices of the Sisak inspectorate, Griblje stood between Metlika and Vinica: a station on the border with the Ottoman Empire. For four years Napoleon's customs post inspected goods on the Kolpa. Empires came and went; the crossing by the river remained.",
  },
  {
    slug: "tone-kralj-98",
    textSi:
      "Januarja 2026 je Tone Kralj iz Gribelj praznoval 98. rojstni dan. Ob polni mizi dobrot so ga obiskali Rdeči križ, borci za vrednote NOB in upokojenci Črnomlja — slavljenec pa je povedal, da še pomaga pri luščenju lešnikov in sušenju peteršilja, rešuje križanke in karta s pravnuki. V vasi, ki je dala najstarejšega Slovenca, se leta ne štejejo — živijo se.",
    textEn:
      "In January 2026 Tone Kralj of Griblje celebrated his 98th birthday. At a full table of delicacies he was visited by the Red Cross, the fighters for NOB values and the Črnomelj pensioners — while the celebrant reported that he still helps with shelling hazelnuts and drying parsley, solves crosswords and plays cards with his great-grandchildren. In a village that gave Slovenia its oldest man, years are not counted — they are lived.",
  },
  {
    slug: "obcina-griblje",
    textSi:
      "Griblje so bile osemdeset let tudi občina: leta 1854 ena od štiriindvajsetih občin okraja Črnomelj, leta 1921 štiristo petintrideset prebivalcev s svojim županom. Potem jih je komasacija 1933 ukinila — in leta 1936 poslala z Dragoši pod občino Gradac ob Lahinji. Danes je vas spet na svojem: krajevna skupnost Griblje. Papirji se menjujejo; vas ostane.",
    textEn:
      "For eighty years Griblje was also a municipality: in 1854 one of the twenty-four municipalities of the Črnomelj district, in 1921 four hundred and thirty-five inhabitants with a mayor of their own. Then the 1933 amalgamation abolished it — and in 1936 sent it, together with Dragoši, under the Gradac municipality on the Lahinja. Today the village is on its own again: the Local Community of Griblje. Papers change; the village remains.",
  },
];

export function getMinuteStory(slug: string): MinuteStory | undefined {
  return MINUTE_STORIES.find((story) => story.slug === slug);
}
