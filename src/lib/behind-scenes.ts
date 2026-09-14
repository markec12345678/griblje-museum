/**
 * Za kuliso — kanal o muzejskem delu za prizoriščem.
 *
 * Vzorec: Rijksmuseum "Operation Night Watch" (raziskava in restavracija
 * pred očmi javnosti), SMK "Enabling" objave o konzerviranju. Za vaški
 * muzej je to najcenejša vsebina z največ zaupanja: surovina je delo,
 * ki ga prostovoljci že opravljajo.
 */

export type BehindScenesStep = {
  titleSi: string;
  titleEn: string;
  textSi: string;
  textEn: string;
  image?: string;
};

export type BehindScenesPost = {
  id: string;
  kickerSi: string;
  kickerEn: string;
  titleSi: string;
  titleEn: string;
  /** ISO datum objave. */
  date: string;
  introSi: string;
  introEn: string;
  coverImage: string;
  steps: BehindScenesStep[];
};

export const BEHIND_SCENES_POSTS: BehindScenesPost[] = [
  {
    id: "depot",
    kickerSi: "Počitnice predmetov",
    kickerEn: "Where objects rest",
    titleSi: "Kjer predmeti spijo: tura po depoju",
    titleEn: "Where objects sleep: a depot tour",
    date: "2026-02-18",
    introSi:
      "V muzeju je na ogled le majhen del zbirke — ostalo čaka v depoju. Ko smo začeli načrtovati digitalni muzej, smo morali najprej urediti skladišče: brez inventarja ni digitalne zbirke.",
    introEn:
      "Only a small part of the collection is on display — the rest waits in the depot. Before we could build a digital museum, we first had to put the storeroom in order: no inventory, no digital collection.",
    coverImage: "/images/authentic/stara-hisa.jpg",
    steps: [
      {
        titleSi: "Polica za vsak material",
        titleEn: "A shelf for every material",
        textSi:
          "Les, kovina, tekstil in papir imajo vsak svojo polico in svojo škatlo. Tekstil visi v bombažnih prevlekah, ker svetloba in prah najhitreje uničita volno in lan.",
        textEn:
          "Wood, metal, textile and paper each get their own shelf and box. Textiles hang in cotton covers, because light and dust destroy wool and linen fastest.",
        image: "/images/authentic/predenje.jpg",
      },
      {
        titleSi: "Vlažnost merimo dvakrat na teden",
        titleEn: "We measure humidity twice a week",
        textSi:
          "Zimska suša je najhujši sovražnik: les se krči, papir razpoka. Higrometer na steni kaže 55 % — če pade pod 45 %, prinesemo sklede z vodo. Ne ravno muzejsko, a deluje.",
        textEn:
          "Winter dryness is the worst enemy: wood shrinks, paper cracks. The hygrometer on the wall reads 55% — when it drops below 45%, we bring in bowls of water. Hardly museum-grade, but it works.",
      },
      {
        titleSi: "Inventarna knjiga",
        titleEn: "The inventory book",
        textSi:
          "Vsak predmet dobi številko, ki jo nosi na etiketi iz kislinsko nevtralnega kartona. Stara inventarna knjiga iz osemdesetih je še vedno pravi vir — v njej je zgodba vsake številke.",
        textEn:
          "Every object gets a number on an acid-free card label. The old inventory book from the 1980s is still the source of truth — inside it is the story of every number.",
        image: "/images/authentic/sokcev-dvor.jpg",
      },
    ],
  },
  {
    id: "bolnisnica",
    kickerSi: "Konzerviranje",
    kickerEn: "Conservation",
    titleSi: "Bolnišnica predmetov: kako smo rešili predilni koles",
    titleEn: "The object hospital: rescuing a spinning wheel",
    date: "2026-01-27",
    introSi:
      "Predilni koles iz sokčevega dvora je v depo prišel z poškodovanim vretenom in stoletno umazanijo. Restavriranje poteka po korakih — in vsak korak smo zabeležili, ker je to ravno tista »za kuliso« zgodba, ki obiskovalci radi slišijo.",
    introEn:
      "The spinning wheel from the Sok house arrived in the depot with a damaged spindle and a century of grime. Conservation proceeds step by step — and we recorded every step, because this is exactly the kind of behind-the-scenes story visitors love.",
    coverImage: "/images/authentic/predenje.jpg",
    steps: [
      {
        titleSi: "Diagnoza pred zdravljenjem",
        titleEn: "Diagnosis before treatment",
        textSi:
          "Najprej dokumentacija: fotografije iz vseh strani, opis poškodb, odvzet vzorec umazanije. Šele nato načrt — nikoli ne čistimo »po občutku«.",
        textEn:
          "Documentation first: photographs from every angle, a damage report, a sample of the grime. Only then a treatment plan — we never clean \"by feel\".",
      },
      {
        titleSi: "Suha krtača in sesalnik",
        titleEn: "Dry brush and vacuum",
        textSi:
          "Prvič po desetletjih smo s hlapi odstranili prah. Napredovali smo po centimetrih — vsak odnesen delec bi bil izgubljen spomin, zato smo krtačili nad sito.",
        textEn:
          "For the first time in decades, the dust came off with soft brushes. Centimetre by centimetre — every speck vacuumed straight off would be a lost memory, so we brushed over a sieve.",
        image: "/images/authentic/storklja.jpg",
      },
      {
        titleSi: "Vreteno narejeno po meri",
        titleEn: "A spindle made to measure",
        textSi:
          "Počanega vretena nismo lepili — izdelali smo novo iz istega bukovega lesa, staro pa hranimo v škatli z napisom »izvirnik, nedotaknjen«. Prihodnjim restavratorjem pove več kot vsako lepljenje.",
        textEn:
          "We did not glue the broken spindle — we turned a new one from the same beech wood and keep the original in a box marked \"original, untouched\". It tells future conservators more than any repair would.",
      },
      {
        titleSi: "Nazaj med ljudi",
        titleEn: "Back among people",
        textSi:
          "Koles je danes v digitalni zbirki z novo zgodbo: ne le kako so predili, ampak kako predmet hranimo še naslednjih sto let. Ta dvojna zgodba je muzej.",
        textEn:
          "The wheel is now in the digital collection with a new story: not just how people spun, but how we keep the object alive for another century. That double story is the museum.",
        image: "/images/authentic/predenje.jpg",
      },
    ],
  },
  {
    id: "pricevanja",
    kickerSi: "Pričevanja",
    kickerEn: "Testimonies",
    titleSi: "Snemanje pričevanj: devet ur spominov na teden",
    titleEn: "Recording testimonies: nine hours of memories a week",
    date: "2025-12-09",
    introSi:
      "Digitalni muzej je začel s tremi kasetami in enim mikrofonom. Skromna oprema je bila hitro presežena — pripovedovalci se odprejo šele po drugi skodelici kave, ne po prvi.",
    introEn:
      "The digital museum started with three tapes and one microphone. The modest kit was quickly outgrown — storytellers only open up after the second cup of coffee, never the first.",
    coverImage: "/images/authentic/niko-zupanic.jpg",
    steps: [
      {
        titleSi: "Vedno pri njih doma",
        titleEn: "Always in their homes",
        textSi:
          "V muzejski sobi nihče ne pripoveduje sproščeno. Zato hodimo k pripovedovalcem domov — v kuhinjo, kjer se spomin sam od sebe prikliče.",
        textEn:
          "Nobody relaxes in a museum room. So we visit storytellers at home — in the kitchen, where the memories call themselves up.",
      },
      {
        titleSi: "Najprej brez kamere",
        titleEn: "First without the camera",
        textSi:
          "Prvi obisk je le klepet in skica vprašanj. Drugi obisk je snemanje. Tako vsak ve, kaj bo prišlo na dan — in kaj raje ne bi.",
        textEn:
          "The first visit is just a chat and a draft of questions. The second visit is the recording. That way everyone knows what will surface — and what they would rather keep.",
        image: "/images/authentic/stara-hisa.jpg",
      },
      {
        titleSi: "Prepis je polovica vrednosti",
        titleEn: "The transcript is half the value",
        textSi:
          "Vsako uro posnetka sledijo štiri ure prepisa. Le prepis je moč iskati, dostopen je gluhim in uporaben v šoli. Zato prosimo prostovoljce: prepišite en kos svoje zgodovine.",
        textEn:
          "Every hour of recording is followed by four hours of transcription. Only the transcript is searchable, accessible to deaf visitors and usable in schools. That is why we ask volunteers: transcribe a piece of your own history.",
      },
    ],
  },
  {
    id: "advent",
    kickerSi: "Postavitev",
    kickerEn: "Installation",
    titleSi: "Postavitev adventne police: kako nastane koledar iz zbirke",
    titleEn: "Setting up the seasonal shelf: how a collection becomes a calendar",
    date: "2025-11-28",
    introSi:
      "Adventni koledar ni nastal v enem dnevu — izbor 24 predmetov je trajal tri tedne razprav. Kako smo izbrali, kaj se skrije za vsakimi vrati?",
    introEn:
      "The advent calendar did not appear in a day — choosing the 24 objects took three weeks of debate. How did we decide what hides behind each door?",
    coverImage: "/images/authentic/pogaca.jpg",
    steps: [
      {
        titleSi: "Najprej zgodba, šele nato predmet",
        titleEn: "Story first, object second",
        textSi:
          "Za vsakim vratom mora biti mikro-zgodba, ki stoji sama. Pogača je dobila vrata številka 13, ker je mama enega od prostovoljcev vedno spekla pogačo ravno na dan sv. Lucije.",
        textEn:
          "Behind every door there must be a micro-story that stands on its own. The flatbread took door number 13, because one volunteer's mother always baked her dough on St Lucy's day.",
      },
      {
        titleSi: "Preizkus na ljudeh, ki niso iz vasi",
        titleEn: "Testing on people not from the village",
        textSi:
          "Vsak nabor je šel skozi sosede iz Vinice in Adlešičev — če se niso smejali ob pravih vratih, nismo zadeli. Vaški humor je najboljši filter.",
        textEn:
          "Every shortlist went through neighbours from Vinica and Adlešiči — if they did not laugh at the right doors, we had missed. Village humour is the best filter.",
        image: "/images/authentic/jurjevanje.jpg",
      },
      {
        titleSi: "Eno vrata ostane prazna",
        titleEn: "One door stays empty",
        textSi:
          "Vrata številka 24 so vsako leto namenjena prihodnjemu letu: za spomin, ki ga še nismo zapisali. Najlepše darilo muzeja je namreč ta, da nikoli ni dokončan.",
        textEn:
          "Door number 24 is always reserved for next year: for a memory we have not yet written down. The finest gift a museum can give is the fact that it is never finished.",
      },
    ],
  },
];
