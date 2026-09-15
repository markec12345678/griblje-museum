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
];

export function getMinuteStory(slug: string): MinuteStory | undefined {
  return MINUTE_STORIES.find((story) => story.slug === slug);
}
