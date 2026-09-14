/**
 * Seme prispevkov skupnosti — spominska knjiga in spomini ob predmetih.
 *
 * Ilustrativni vpisi v vaškem tonu: domačini, izseljenci (Cleveland,
 * Melbourne), potomci in šolski razredi. Pravi vpisi obiskovalcev se
 * zbirajo prek API-jev; kurosorju za pregledane prispevke jih prepiše
 * sem (vzorec "git kot CMS"), da preživijo ponovno namestitev.
 *
 * Datumi so relativni (dnevi nazaj), da knjiga vedno izgleda živa.
 */

export type SeedGuestbookEntry = {
  name: string;
  place: string | null;
  message: string;
  lang: "sl" | "en";
  /** Dni nazaj od sejanja. */
  daysAgo: number;
};

export type SeedObjectMemory = {
  exhibitSlug: string;
  author: string;
  place: string | null;
  memory: string;
  lang: "sl" | "en";
  daysAgo: number;
};

export const seedGuestbook: SeedGuestbookEntry[] = [
  {
    name: "Marija Kovač",
    place: "Črnomelj",
    message:
      "Bila sem na počitnicah pri teti v Gribljah in odkrila vaš muzej. Pogača iz pehte — pristen spomin iz otroštva. Hvala, da to hranite!",
    lang: "sl",
    daysAgo: 2,
  },
  {
    name: "Ivan Kovačić",
    place: "Cleveland, ZDA",
    message:
      "My grandparents left Griblje in 1923. I found their village through your museum while searching for family records. We visited last summer — the Kolpa is even more beautiful than grandfather described. Živjo vsem!",
    lang: "en",
    daysAgo: 6,
  },
  {
    name: "4. b, OŠ Črnomelj",
    place: "Črnomelj",
    message:
      "Bili smo na ogledu z učiteljico in rešili muzejsko uganko. Najboljše vprašanje je bilo o storklji — doma nimamo več take. Še kdaj pridemo!",
    lang: "sl",
    daysAgo: 11,
  },
  {
    name: "Anka Žnidar",
    place: "Ljubljana",
    message:
      "Vsako leto prvi maj pridem na jurjevanje. Letos sem prvič prebrala tudi zgodbe o belokranjski noši in si ob njih zapela. Lep pozdrav vaščanom!",
    lang: "sl",
    daysAgo: 17,
  },
  {
    name: "Stane Novak",
    place: "Griblje",
    message:
      "Rojen sem v tej vasi in mislil, da vse vem o njej. Muzej me je naučil novega — o vasi, v kateri sem rojen, sem izvedel stvari, ki jih prej nisem poznal. Odlično delo!",
    lang: "sl",
    daysAgo: 23,
  },
  {
    name: "Elsie Baker",
    place: "Melbourne, Avstralija",
    message:
      "Booking a heritage trip for next spring. My grandmother spoke of 'Griblje' with such longing — now I understand why. The oral history recordings made me cry. Thank you for keeping her world alive.",
    lang: "en",
    daysAgo: 31,
  },
];

export const seedMemories: SeedObjectMemory[] = [
  {
    exhibitSlug: "belokranjska-kuhinja",
    author: "Ana Zdovc",
    place: "Griblje",
    memory:
      "Pogačo je mama vzhajala čez noč v leseni skledi, zjutraj pa jo je spekla v pehti. Med rezanjem se je dimnica vsa ovila v vonj po skorji. Tista skorja — danes je ne morem dobiti nikjer več.",
    lang: "sl",
    daysAgo: 4,
  },
  {
    exhibitSlug: "kolpa-reka",
    author: "Franci S.",
    place: "Vinica",
    memory:
      "Z očetom sva vstajala ob štirih zjutraj in šla k Mlinom z mrežo. Kleni so grizli šele, ko se je zarja naredila. Nato sva ribe prodala v Črnomlju, mama pa je skuhala ščuko na žaru. Najboljše jutro mojega življenja.",
    lang: "sl",
    daysAgo: 9,
  },
  {
    exhibitSlug: "tkalstvo",
    author: "Marjana H.",
    place: "Adlešiči",
    memory:
      "Mama je tkala lan ob nedeljah popoldne. Tekle so odzvanjale po hlevu — tistega bobnenja, ko je preja bežala skozi glavnik, še danes slišim, ko zaprem oči. Za silvestrovo je vsako leto dobila prvo rjuho.",
    lang: "sl",
    daysAgo: 14,
  },
  {
    exhibitSlug: "sveti-vid",
    author: "Jože M.",
    place: "Griblje",
    memory:
      "Kot ministrant sem zvonil ob sv. Vidu. Zraven je bil starejši gospod, ki je znal vsak zvon po imenu — sv. Vid je pel najgloblje. Ko je zvok šel čez Kolpo, so na drugi strani vedeli, da je pri nas praznik.",
    lang: "sl",
    daysAgo: 19,
  },
  {
    exhibitSlug: "jurjevanje",
    author: "Nada K.",
    place: "Ljubljana",
    memory:
      "Prvič sem plesala jurjevanje kot deklica v beli obleki z rdečim pasom. Strah me je bilo, da bom pozabila koreografijo, a noge so se spomnile same. Že petdeset let grem vsako leto nazaj.",
    lang: "sl",
    daysAgo: 26,
  },
  {
    exhibitSlug: "storklje",
    author: "Ivan P.",
    place: "Griblje",
    memory:
      "Voda iz storklje je bila poleti tako mrzla, da so dekleta kričala in se smejala hkrati. Z njo smo hlajili tudi lubenice iz vrta. Nikoli ni zmanjkalo — tudi v najhujši suši.",
    lang: "sl",
    daysAgo: 33,
  },
  {
    exhibitSlug: "belokranjska-hisa",
    author: "Anton T.",
    place: "Maribor",
    memory:
      "Zimske večere smo preživeli v črni kuhinji ob luči karbida. Dedek je pripovedoval o uskokih, babica predla, mi pa smo tonevali v svoje sanje. Nikjer ni bilo bolj toplo — kljub mrazu zunaj.",
    lang: "sl",
    daysAgo: 41,
  },
  {
    exhibitSlug: "vino-in-crnina",
    author: "Štefan B.",
    place: "Griblje",
    memory:
      "Butala smo nabirali vsi — od babice do vnukov. Nos je bil rdeč, hrbet je bolel, a večerja v kleti s cvrtimi krofi je bila sveta. Novo vino pa je potrpežljivo čakalo na sv. Martina, da ga je smelo prekusiti.",
    lang: "sl",
    daysAgo: 47,
  },
  {
    exhibitSlug: "griblje-vas",
    author: "Mary Ann Miller",
    place: "Cleveland, ZDA",
    memory:
      "My grandfather Anton was born here in 1901. When I opened this page and saw the hills above the Kolpa, I finally understood his homesickness. He hung a painting of these hills in his garage until the day he died.",
    lang: "en",
    daysAgo: 52,
  },
  {
    exhibitSlug: "uskoki-in-vojna-krajina",
    author: "Lidija R.",
    place: "Črnomelj",
    memory:
      "Za okvirno nalogo v šoli sem snemala pradedovega prijatelja o vojni krajini. Devet ur posnetkov — najlepša ocena v razredu, še pomembneje pa je, da posnetek hrani vaš muzej. Hvala, da ste mi verjeli.",
    lang: "sl",
    daysAgo: 58,
  },
];
