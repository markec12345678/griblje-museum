"use client";

import * as React from "react";

export type Lang = "sl" | "en";

/**
 * Dvojezični sistem muzeja (SLO/EN) — standard nagrajenih evropskih muzejev.
 * Vsa vsebina zbirk je shranjena v obeh jezikih; uporabnik preklaplja v glavi.
 */

export const ui = {
  sl: {
    museumName: "Muzej vasi Griblje",
    museumTagline: "Digitalni muzej resnične vasi ob Kolpi",
    nav: {
      domov: "Domov",
      zbirka: "Zbirka",
      tema: "Teme",
      razpolozenje: "Po razpoloženju",
      zgodbe: "Zgodbe",
      casovnica: "Časovnica",
      karta: "Karta",
      dogodki: "Dogodki",
      oMuzeju: "O muzeju",
      mojMuzej: "Moja zbirka",
      zaOtroke: "Za otroke",
    },
    myMuseum: {
      title: "Moja zbirka",
      subtitle:
        "Zapisi, ki ste jih shranili med obiskom muzeja — vaša osebna galerija (vzorec: Rijksstudio nizozemskega Rijksmuseuma, brez računa, shranjeno v vašem brskalniku).",
      progressLabel: "shranjenih zapisov od celotne zbirke",
      emptyTitle: "Vaša zbirka je še prazna",
      emptyText:
        "Odprite kateri koli zapis in ga shranite s tipko srca — tukaj se bo zbral vaš osebni muzej.",
      emptyCta: "Prebrskaj zbirko",
      open: "Odpri zapis",
      remove: "Odstrani iz moje zbirke",
      removeDialog: "Odstrani iz moje zbirke",
      save: "Shrani v mojo zbirko",
      saved: "Shranjeno",
      saveDialog: "Shrani zapis v mojo zbirko",
      share: "Kopiraj mojo zbirko",
      shareHint: "Seznam z naslovi in povezavami — prilepite v sporočilo ali zapis.",
    },
    zoom: {
      open: "Približevalni ogled",
      close: "Zapri približevalni ogled",
      zoomIn: "Približaj",
      zoomOut: "Oddalji",
      reset: "Ponastavi pogled",
      fullscreen: "Celozaslonski ogled",
      exitFullscreen: "Izhod iz celozaslonskega ogleda",
      controlsLabel: "Upravljanje približevalnega ogleda",
      regionLabel: "Približevalni ogled slike zapisa",
      loading: "Nalaganje približevalnega ogleda …",
      failed: "Približevalnega ogleda ni bilo mogoče odpreti.",
      hint: "Premikajte z miško ali prsti; dvoklik približa.",
    },
    daily: {
      kicker: "Danes v muzeju",
      open: "Odpri današnji zapis",
    },
    plan: {
      title: "Načrt obiska",
      sub: "Kako obiskati muzej — digitalni je odprt vedno, vas pa je najlepša od pomladi do jeseni.",
      whenTitle: "Kdaj vas sprejmemo",
      whenText:
        "Digitalni muzej je odprt brez prekinitev, 24 ur na dan. Za sprehod po sami vasi priporočamo april do oktober; jurjevanje — najstarejša pomladna šega Bela krajine — je konec aprila.",
      howTitle: "Kako do nas",
      howText:
        "Griblje ležijo v Beli krajini, ob reki Kolpi, približno 9 km od Črnomlja. Naselje je majhno in mirno — karta spodaj vodi do vseh točk muzeja.",
      timeTitle: "Koliko časa imate?",
      timeText:
        "Muzej se prilagodi vašemu času: od kvartalnega ogleda dnevnega zapisa do celodneža s sprehodi in avdio vodnikom.",
      timeShort: "Današnji zapis in muzejska uganka na tej strani.",
      timeMedium: "En vodeni muzejski sprehod skozi štiri postaje.",
      timeLong: "Cela zbirka z avdio vodnikom in zemljevidom.",
      ctaWalk: "Začni vodeni sprehod",
      ctaCollection: "Odpri zbirko",
      ctaMap: "Karta vasi",
      ctaOsm: "Načrt poti (OpenStreetMap)",
      ctaSchools: "Za šole in družine",
    },
    a11y: {
      skipToContent: "Preskoči na vsebino",
      mainNav: "Glavna navigacija muzeja",
      toggleTheme: "Preklopi svetlo/temno temo",
      switchLang: "Preklopi jezik",
      openMenu: "Odpri meni",
      closeMenu: "Zapri meni",
    },
    hero: {
      kicker: "Bela krajina · občina Črnomelj · od 1526",
      title1: "Vas kot",
      titleAccent: "muzej.",
      subtitle:
        "Štirinajst zapisov, ena reka, ena meja in sto spominov. Raziščite Griblje — vas ob Kolpi, katere vsak prostor je vstopna točka v zgodbo.",
      ctaCollection: "Razišči zbirko",
      ctaMap: "Odpri zemljevid",
    },
    stats: {
      records: "muzejskih zapisov",
      sources: "dokumentiranih virov",
      categories: "tematskih sklopov",
      langs: "jezika (SLO · EN)",
      openData: "odprti podatki",
      openDataValue: "100 %",
    },
    home: {
      featuredTitle: "Izpostavljeno",
      featuredSub: "Zapisi, ki nosijo zgodbo vasi.",
      promiseTitle: "Kuratorska obljuba",
      promiseSub: "Metodologija, ki jo delimo z nagrajenimi evropskimi muzeji.",
      promise1Title: "Vsak zapis ima izvor",
      promise1Text:
        "Vsaka trditev v muzeju je vezana na vir — arhivski, fotografski ali ustni — z navedeno licenco.",
      promise2Title: "Dokaz ni pričevanje",
      promise2Text:
        "Ločujemo dokumentirano dejstvo od pričevanja, spomina in tradicije. Ob vsakem zapisu piše, kaj je.",
      promise3Title: "Zbirka je odprta",
      promise3Text:
        "Celotna zbirka je dostopna prek odprtega vmesnika JSON z licenco CC BY-SA 4.0 — tudi za vaše projekte.",
      eventsTitle: "Vas živi naprej",
      eventsSub: "Program in dogodki, ki gradijo zbirko skupaj s skupnostjo.",
      viewAll: "Poglej vse",
    },
    collector: {
      title: "Zbiralec zapisov",
      subtitle: "Vsak odprt zapis se zabeleži v vaš obisk.",
      count: (odkrito: number, skupno: number) => `Odkrito ${odkrito} od ${skupno} zapisov`,
      percent: (p: number) => `${p} % zbirke`,
      complete: "Zbirka odkrita!",
      completeText: "Odprli ste vse zapise muzeja. Vas pozna vas.",
      reset: "Začni znova",
      visitedSr: "Zapis že odkrit",
      hint: "Odprite zapise v zbirki, da zapolnite vrstico.",
    },
    quiz: {
      sectionTitle: "Muzejska uganka",
      sectionSub: "Preverite, koliko vas že poznate. Vsako vprašanje sloni na dokumentirani zbirki.",
      start: "Začni uganko",
      questionOf: (i: number, n: number) => `Vprašanje ${i} od ${n}`,
      next: "Naprej",
      finish: "Zaključi",
      restart: "Poskusi znova",
      correct: "Pravilno!",
      incorrect: "Ni pravilno.",
      correctAnswerWas: "Pravilen odgovor:",
      yourScore: "Vaš rezultat",
      openRecord: "Odpri zapis",
      excellent: "Čestitamo — poznate vas kot domačin.",
      good: "Dobra uvrstitev — vasi ostaja še kaj za odkriti.",
      tryAgain: "Vas še čaka — poskusite znova.",
      groundedNote: "Vsako vprašanje sloni na dokumentiranem zapisu zbirke.",
    },
    collection: {
      title: "Zbirka",
      subtitle: "Vsa digitalna zbirka muzeja — filtrirajte po sklopih in zanesljivosti.",
      searchPlaceholder: "Išči po zbirki …",
      allCategories: "Vse",
      evidenceFilter: "Zanesljivost",
      allEvidence: "Vsa",
      count: (n: number) => `${n} ${n === 1 ? "zapis" : n === 2 ? "zapisa" : n < 5 ? "zapisi" : "zapisov"}`,
      empty: "Ni zapisov, ki ustrezajo izboru.",
      resetFilters: "Počisti filtre",
      openRecord: "Odpri zapis",
      readMore: "Preberi več",
      citation: "Navedba zapisa",
      aiNote: "Ilustracija: postavitev muzeja (2026). Avtentična fotografija je navedena med viri.",
      showOnMap: "Pokaži na zemljevidu",
      sourcesTitle: "Viri zapisa",
    },
    evidence: {
      DOCUMENTED: "dokumentirano",
      CORROBORATED: "preverjeno",
      TESTIMONY: "pričevanje",
      TRADITION: "tradicija",
      UNVERIFIED: "nepreverjeno",
      TO_COLLECT: "v zbiranju",
      label: "Stopnja zanesljivosti",
      desc: {
        DOCUMENTED: "Trditev sloni na arhivskem ali objavljenem dokumentiranem viru.",
        CORROBORATED: "Trditev potrjujejo vsaj dva neodvisna vira ali preverjena fotografija.",
        TESTIMONY: "Trditev izvira iz ustnega pričevanja priče in še ni arhivsko potrjena.",
        TRADITION: "Vsebina je del žive tradicije ali ljudskega izročila, ne pa arhivskega dejstva.",
        UNVERIFIED: "Podatek zaenkrat ni preverjen — javno objavljen izrecno kot tak.",
        TO_COLLECT: "Vsebina čaka na zbiranje pričevanj domačinov — prirejeno ni nič.",
      },
    },
    categories: {
      kraj: "Kraji",
      kolpa: "Kolpa",
      vojna: "Vojna in meja",
      narava: "Narava",
      gospodarstvo: "Delo in obrt",
      sege: "Šege in tradicija",
    },
    stories: {
      title: "Zgodbe",
      subtitle: "Dokumentirane pripovedi, kuratorska načela in odprti razpis za pričevanja.",
      documentedTitle: "Dokumentirane zgodbe",
      documentedSub: "Pripovedi, obnovljene iz javnih virov.",
      principlesTitle: "Kuratorska načela",
      principlesSub: "Pravila, po katerih zapisujemo vas.",
      callTitle: "Zbirka pričevanj je prazna — namenoma.",
      callText:
        "Ne izmišljujemo si niti ene izjave domačinov. Če vaši sorodniki poznajo Griblje prej 1960, vas vabimo: sodelujte pri zbiranju ustne zgodovine. Vsako pričevanje bomo zapisali z imenom, letom in soglasjem.",
      callCta: "Prijavi pričevanje",
      read: "Preberi zgodbo",
      basedOn: "Po javnih virih",
      attribution: "Pripis",
    },
    timeline: {
      title: "Časovnica",
      subtitle: "Pet stoletij vasi na eni poti — od prve omembe leta 1526 do danes.",
      howTo: "Kako beremo datume: na časovnico rišemo samo leta, ki so zapisana v virih. Kjer vir poda le stoletje, zapis uvrstimo v obdobje, ne na posamično leto.",
      eras: {
        s16: "16. stoletje — prva omemba",
        s19: "19. stoletje — vaški vsakdan",
        s20: "20. stoletje — vojna nad vasjo",
        s21: "1991 → danes — meja in samostojnost",
      },
      centuryShort: "19. stol.",
      openRecord: "Odpri zapis",
      streamsTitle: "Neprekinjeni tokovi",
      streamsSub: "Verska, naravna in sezonska dediščina, ki se ne da pripeti na en sam datum.",
      streamsNote: "Ti zapisi so namenoma brez datuma: eno samo leto bi bilo izmišljeno. Tečejo skozi vsa obdobja zgoraj.",
      milestones: (n: number) => `${n} datiranih mejnikov`,
    },
    events: {
      title: "Dogodki in program",
      subtitle: "Muzej ni arhiv — je vas, ki živi naprej.",
      ours: "Program muzeja",
      external: "Zunanji dogodek",
      types: {
        PRIREDITEV: "prireditev",
        DELAVNICA: "delavnica",
        VODENJE: "vodeno",
      },
      noEvents: "Program se pripravlja — sledite nam.",
    },
    map: {
      title: "Zemljevid vasi",
      subtitle: "Zapisi s preverjenimi koordinatami. Točk z nepreverjeno lokacijo ne rišemo.",
      legend: "Legenda",
      villageCenter: "Središče vasi",
      openRecord: "Odpri zapis",
      osm: "Zemljevid: OpenStreetMap prispevalci",
      approx: "približno",
    },
    about: {
      title: "O muzeju",
      missionTitle: "Misija",
      missionText:
        "Muzej vasi Griblje je digitalni muzej resnične vasi. Ne poskuša biti turistična stran — poskuša biti muzej: s kuratorsko disciplino, dokazljivimi viri, dostopnostjo in odprtimi podatki. Merilo zasnove so nagrajeni evropski muzeji (Nasjonalmuseet — Muzej leta 2025, Norveška; Valdresmusea — Muzej leta 2022), ki dokazujejo, da tradicija in inovacija nista nasprotje.",
      scaleTitle: "Lestvica zanesljivosti",
      scaleText:
        "Vsak zapis v zbirki nosi oznako zanesljivosti. Ta lestvica je muzejska veja istega načela, ki ga pozna arhivistika: nikoli ne prikrivamo negotovosti — jo imenujemo.",
      accessTitle: "Izjava o dostopnosti",
      accessStatus: "Status: delno skladno s priporočili WCAG 2.1 AA",
      accessPointsTitle: "Kaj zagotavljamo",
      accessPoints: [
        "Navigacija s tipkovnico (lovljenje fokusa, vidni obroč fokusa, preskok na vsebino).",
        "Kontrast besedila nad 4,5 : 1 v svetli in temni temi.",
        "Podpora za nastavitev prefers-reduced-motion — animacije se ugasnejo.",
        "Dotikalne tarče vsaj 44 × 44 px na mobilnih napravah.",
        "Dvojezičnost (SLO/EN) z preklapljanjem brez ponovnega nalaganja.",
        "Semantične vloge in opisi za bralnike zaslona na vseh interaktivnih elementih.",
      ],
      accessLimitTitle: "Znane omejitve",
      accessLimitText:
        "Interaktivni zemljevid (Leaflet/OpenStreetMap) zaenkrat nima popolne alternativne besedilne predstavitve. Za vse točke zemljevida so koordinate in opisi na voljo tudi v odprtih podatkih prek /api/opendata.",
      accessFeedback: "Povratne informacije o dostopnosti sprejemamo prek kontakta v kolofonu.",
      openDataTitle: "Odprti podatki",
      openDataText:
        "Celotna zbirka (zapisi, viri, dogodki, zgodbe) je javno dostopna prek JSON vmesnika z licenco CC BY-SA 4.0. Enako načelo odprtosti, ki ga izvajajo vodilni svetovni muzeji.",
      openDataHow: "Primer uporabe",
      numbersTitle: "Muzej v številkah",
      numbers: {
        sources: "dokumentiranih virov",
        mapPoints: "točk na karti",
        walks: "muzejskih sprehodov",
        quizQuestions: "vprašanj v uganki",
        languages: "jezikov vsebine",
        endpoints: "odprtih API-jev",
      },
      sourcesTitle: "Register virov",
      sourcesText: "Seznam virov, na katere se sklicuje zbirka, z licencami.",
      colophonTitle: "Kolofon",
      colophonText: [
        "Postavitev: Next.js 16 · React 19 · Tailwind CSS 4 · Prisma (SQLite) · Leaflet/OpenStreetMap · shadcn/ui.",
        "Fotografije zapisov so avtentični posnetki z Wikimedie Commons (oz. Slovenskega etnografskega muzeja) z navedbo avtorja in licence; v izjemnih primerih, ko fotografija ni na voljo, je zapis označen kot muzejska postavitev.",
        "Besedila in podatkovni model: Muzej vasi Griblje, 2026. Licenca vsebine: CC BY-SA 4.0.",
      ],
      inspireTitle: "Zakaj tako?",
      inspireText:
        "Najboljši evropski muzeji ne zmagajo z obsegom, temveč z zaupanjem: vsak podatek ima izvor, vsak obiskovalec dostop, vsaka skupnost vabilo. Ta muzej aplicira ta merila na eno samo vas.",
    },
    footer: {
      nav: "Ogled",
      data: "Podatki",
      accessibility: "Dostopnost",
      openData: "Odprti podatki (JSON)",
      rights: "Vsebina zbirke pod licenco CC BY-SA 4.0 · Zemljevid © OpenStreetMap prispevalci",
      built: "Digitalni muzej · postavitev 2026",
      langNote: "Razpoložljivo v slovenščini in angleščini / Available in Slovenian and English",
    },
    audio: {
      play: "Poslušaj avdio vodnik",
      stop: "Ustavi predvajanje",
      loading: "Pripravljam posnetek …",
      playing: "Predvajam avdio vodnik.",
      error: "Posnetka trenutno ni mogoče predvajati. Poskusite znova.",
      note: "Sintetiziran glas (TTS) — ni posnetek priče niti domačina.",
      noteShort: "sintetiziran glas",
      part: "odsek",
    },
    search: {
      openLabel: "Iskanje po muzeju (Ctrl+K)",
      title: "Iskanje po muzeju",
      description: "Enotno iskanje po zapisih, zgodbah in dogodkih.",
      placeholder: "Iščite: Kolpa, 1945, cerkev, jurjevanje …",
      hint: "Diakritike ni treba tipkati — »crnomelj« najde »Črnomelj«.",
      minChars: "Vnesite vsaj 2 znaka.",
      searching: "Iščem …",
      noResults: "Ni zadetkov.",
      error: "Iskanje trenutno ne deluje. Poskusite znova.",
      resultsCount: (n: number) =>
        n === 1 ? "1 zadetek" : n >= 2 && n <= 4 ? `${n} zadetki` : `${n} zadetkov`,
      groups: {
        exhibits: "Zapisi",
        stories: "Zgodbe",
        events: "Dogodki",
      },
    },
    share: {
      copyLink: "Kopiraj povezavo do zapisa",
      copied: "Povezava kopirana",
      copyFailed: "Kopiranje ni uspelo",
      copyCitation: "Kopiraj citat",
      citationCopied: "Citat kopiran",
      accessed: "dostop",
    },
    walks: {
      sectionTitle: "Muzejski sprehodi",
      sectionSub:
        "Štirje kurirani sprehodi skozi zbirko — po vzoru vodenih ogledov Norsk Folkemuseum. Vsaka postaja odpre zapis s kuratorsko opombo; sprehod lahko kadarkoli zapustite.",
      stops: (n: number) =>
        n === 1 ? "1 postaja" : n >= 2 && n <= 4 ? `${n} postaje` : `${n} postaj`,
      minutes: (n: number) => `≈ ${n} min`,
      start: "Začni sprehod",
      coverNote: "Sprehodi skupaj pokrivajo vseh 20 zapisov zbirke.",
      completed: "Zaključen",
      completedProgress: (done: number, total: number) =>
        `Zaključeni sprehodi: ${done} od ${total}`,
      stopOf: (i: number, n: number) => `Postaja ${i} od ${n}`,
      progressA11y: (i: number, n: number) =>
        `Napredek sprehoda: postaja ${i} od ${n}.`,
      next: "Naslednja postaja",
      prev: "Prejšnja postaja",
      finish: "Zaključi sprehod",
      curatorNote: "Kuratorska opomba",
      stopsList: "Postaje",
      openStop: (n: number) => `Odpri postajo ${n}`,
    },
    school: {
      title: "Za šole in učitelje",
      kicker: "Muzej kot učni vir",
      intro:
        "Muzej je brezplačen, dvojezičen in deluje v vsakem brskalniku — na šolskem računalniku, tablici ali projektorju. Vsa vsebina je dokumentirana, zato je primerna tudi za učenje dela z viri.",
      audienceTitle: "Za koga je namenjen",
      audienceText:
        "Za učence od 6. do 9. razreda osnovne šole in dijake srednjih šol. Veze s kurikulumom: zgodovina (Vojna krajina, druga svetovna vojna, samostojnost 1991), geografija (Bela krajina, meja, reka), slovenščina (narečje, ustna zgodovina), državljanska vzgoja (preverjanje trditev v virih) in etnologija (hiša, prazniki, tkalstvo).",
      activitiesTitle: "Tri pripravljene dejavnosti",
      activities: [
        {
          title: "1 · Muzejska uganka",
          text: "Deset vprašanj, povezanih z zapisi zbirke (približno 15 minut). Vsak odgovor je mogoče preveriti v samem zapisu — učenci se navadijo, da trditev pogledajo v vir.",
        },
        {
          title: "2 · Voden sprehod",
          text: "Učenci izberejo enega od štirih sprehodov in ga prehodijo do konca. Ob vsaki postaji poslušajo avdio vodnik in zapišejo eno dejstvo v delovni list.",
        },
        {
          title: "3 · Delo z viri",
          text: "Pogovor o lestvici zanesljivosti: zakaj ima nekaj oznako »preverjeno«, drugo »izročilo«? Učenci poiščejo po en primer vsake oznake v zbirki.",
        },
      ],
      worksheetTitle: "Delovni list (za tisk)",
      worksheetText:
        "Natisnjiv delovni list z nalogami, ki učence vodijo skozi zbirko, karto in register virov. Oblikovan za A4 in eno šolsko uro.",
      worksheetButton: "Natisni delovni list",
      honestNote:
        "Ta muzej je digitalen — fizičnih vodenih ogledov ne ponuja. Za srečanje z izvirniki priporočamo Dolenjski muzej Novo mesto, Slovenski etnografski muzej in Belokranjski muzej Metlika.",
      worksheet: {
        docTitle: "Delovni list — Muzej vasi Griblje",
        nameField: "Ime in priimek",
        classField: "Razred",
        dateField: "Datum",
        intro:
          "Odprite Muzej vasi Griblje in rešite naloge. Pri vsaki nalogi poiščite ustrezen zapis v zbirki.",
        tasksTitle: "Naloge",
        tasks: [
          "V katerem letu je vas Griblje prvič omenjena v pisnih virih? V katerem stoletju je bilo to?",
          "Kako se imenuje reka ob vasi? Kako se imenuje mlinarski jez, ki so ga mlinarji zgradili čez njo?",
          "Kdo je bil Niko Županič in iz katere vasi je bil?",
          "Kaj se je zgodilo nad Gribljami marca 1945? Kdo je odšel z letali?",
          "Poiščite zemljevid muzeja. Vpišite tri kraje s karte, ki so najbližje vasi.",
          "Poiščite po en zapis z oznako »preverjeno« in z oznako »izročilo«. V čem je razlika med njima?",
        ],
        openTitle: "Za razmislek",
        openQuestion:
          "Kateri zapis v muzeju se ti zdi najbolj zanimiv? Zakaj? Napiši tri stavke.",
        thanks: "Hvala za obisk muzeja.",
        footer: "Muzej vasi Griblje · vsebina pod licenco CC BY-SA 4.0",
      },
    },
    loading: "Nalagam zbirko …",
    error: "Zbirke trenutno ni mogoče naložiti. Poskusite osvežiti stran.",
    retry: "Poskusi znova",
    common: {
      close: "Zapri",
      period: "Obdobje",
      category: "Sklop",
      location: "Lokacija",
      back: "Nazaj",
      more: "Več",
    },
    compare: {
      add: "Primerjaj",
      added: "V primerjavi",
      addDialog: "Doda zapis v primerjalnik",
      removeDialog: "Odstrani iz primerjalnika",
      trayLabel: "Izbira za primerjavo",
      trayCount: (n: number) => (n === 1 ? "1 zapis od 3" : `izbrani ${n} od 3`),
      open: "Primerjaj zapise",
      openDisabled: "Za primerjavo izberite vsaj dva zapisa",
      clear: "Počisti izbiro",
      remove: "Odstrani iz primerjalnika",
      title: "Primerjalnik",
      subtitle:
        "Do tri zapise postavite drug ob drugega in preberite razlike na eni strani — vzorec Comparator iz nove zbirke Rijksmuseuma.",
      emptyHint:
        "Za primerjavo dodajte vsaj še en zapis — gumb »Primerjaj« najdete v vsakem zapisu zbirke.",
      openRecord: "Odpri zapis",
      sourcesCount: (n: number) =>
        n === 1 ? "1 vir" : n === 2 ? "2 vira" : n < 5 ? `${n} viri` : `${n} virov`,
      limitNote: "Ob četrtem zapisu se najstarejša izbira zamenja.",
    },
    myWalk: {
      addTo: "Na moj sprehod",
      added: "Na sprehodu",
      addDialog: "Doda zapis na vaš osebni sprehod",
      removeDialog: "Odstrani z osebnega sprehoda",
      title: "Moj sprehod",
      subtitle:
        "Sestavite lastno pot skozi muzej — po vzoru obiskovalnih poti Louvra in zbirke »Collections« v Rijksmuseumu. Postaje razvrstite sami; sprehod se nato zažene kot vsak vodeni ogled muzeja.",
      emptyTitle: "Vaša pot je še prazna",
      emptyText:
        "Odprite kateri koli zapis v zbirki in izberite »Na moj sprehod«. Postaje bodo stale tukaj, v vrstnem redu, ki ga določite vi.",
      emptyCta: "Poišči postaje v zbirki",
      start: "Začni moj sprehod",
      startDisabled: "Dodajte vsaj eno postajo",
      stopOf: (i: number) => `Postaja ${i}`,
      moveUp: "Premakni postajo višje",
      moveDown: "Premakni postajo nižje",
      remove: "Odstrani postajo",
      clear: "Počisti sprehod",
      share: "Kopiraj mojo pot",
      shareHint: "Seznam postaj z globokimi povezavami — pošljite ga družini ali razredu.",
    },
    kids: {
      nav: "Za otroke",
      kicker: "Za otroke in družine · 6–12 let",
      title: "Mali raziskovalci",
      subtitle:
        "Kot družinski vodnik Van Goghovega muzeja in Petite Galerie Louvra ima tudi ta muzej pot za mlajše obiskovalce — kratko, igrivo in z vprašanji, na katera odgovarja sama slika.",
      introTitle: "Kako raziskujemo",
      introText:
        "Vsaka postaja ima sliko, kratek napis in gumb za poslušanje. Pri vsaki postaji vas čaka tudi vprašanje — odgovor se skriva v sliki ali zapisu.",
      walkTitle: "Družinski sprehod",
      walkText: "Šest postaj za mlade raziskovalce: vas, cerkev, reka, ribnik, štorklje in bele breze.",
      walkCta: "Začni družinski sprehod",
      walkStops: "Predogled postaj",
      quizTitle: "Muzejska uganka",
      quizText: "Deset vprašanj o vasi — vsak odgovor se skriva v zapisu zbirke.",
      quizCta: "Reši uganko",
      worksheetTitle: "Delovni list",
      worksheetText: "Natisni list z nalogami in ga reši med obiskom muzeja.",
      worksheetCta: "Natisni delovni list",
      collectorTitle: "Zbiralec zapisov",
      collectorText: "Vsak odprt zapis se zabeleži v vaš obisk — zberi jih vse.",
      forParents:
        "Za starše in učitelje: celotna ponudba je v razdelku »Za šole in učitelje« na strani O muzeju.",
    },
    offline: {
      banner: "Brez povezave — muzej je na voljo iz predpomnilnika.",
    },
    themes: {
      kicker: "Razišči po temah",
      title: "Šest vrat v zbirko",
      subtitle:
        "Vsaka tema je majhna, kurirana vstopna točka — po vzoru tematskih strani nove zbirke Rijksmuseuma. Uvod, zapisi, sprehodi in sorodne teme na enem mestu.",
      explore: "Razišči temo",
      countLabel: (n: number) => (n === 1 ? "1 zapis" : n === 2 ? "2 zapisa" : n <= 4 ? `${n} zapisi` : `${n} zapisov`),
      backToThemes: "Vse teme",
      share: "Kopiraj povezavo teme",
      shared: "Povezava kopirana",
      allInTheme: "Zapisi teme",
      walksAbout: "Sprehodi, ki se dotaknejo teme",
      walkStops: (n: number) => (n === 1 ? "1 postaja te teme" : n === 2 ? "2 postaji te teme" : n <= 4 ? `${n} postaje te teme` : `${n} postaj te teme`),
      discoverMore: "Odkrij več",
      relatedTheme: "Sorodna tema",
      viewTheme: "Poglej temo",
    },
    mood: {
      nav: "Po razpoloženju",
      kicker: "Vodnik po razpoloženju",
      title: "Kaj vas danes zanima?",
      subtitle:
        "Tri vprašanja — in muzej sestavi vaš osebni izbor. Vzorec: Art Explorer iz nove zbirke Rijksmuseuma; odgovorite, pustite, da vas preseneti, shranite ali delite.",
      subtitleShort:
        "Ne veste, kje začeti? Tri vprašanja — in zbirka se sama odpre pred vami.",
      cta: "Ne vem, kje začeti",
      progress: "Napredek vodnika",
      questionOf: (i: number, n: number) => `Vprašanje ${i} od ${n}`,
      chosen: "izbrano",
      back: "Nazaj",
      replay: "Ponovi zadnji izbor",
      restart: "Začni znova",
      resultsTitle: "Vaš današnji muzej",
      resultsSub: (n: number) =>
        n === 1
          ? "Vodnik je izbral en zapis za vas."
          : `Vodnik je izbral ${n === 2 ? "2 zapisa" : n <= 4 ? `${n} zapise` : `${n} zapisov`} za vas.`,
      why: "Zato, ker",
      share: "Deli izbor",
      shared: "Povezava kopirana",
      timeShortTitle: "Dve minuti? Poslušajte.",
      timeShortText:
        "Vsak zapis ima enominutno zgodbo — odprite ga in izberite »V eni minuti«.",
      timeLongTitle: "Časa je dovolj za sprehod.",
      timeLongText:
        "Vodeni sprehod po vodi vodi skozi štiri postaje — kjer se začne vsak obisk Gribelj.",
      ctaMinute: "Muzej v minuti",
      ctaWalk: "Začni sprehod",
    },
    connect: {
      openTool: "Poveži dva zapisa",
      relatedTitle: "Povezani zapisi",
      toolTitle: "Poveži zbirko",
      toolSub:
        "Kakor »x Degrees of Separation« Googlove Arts & Culture: izberita dva zapisa in muzej najde pot med njima — vsak skok ima svoj razlog.",
      pickA: "Prvi zapis",
      pickB: "Drugi zapis",
      pickPlaceholder: "Izberite zapis …",
      samePick: "Izberite dva različna zapisa.",
      directTitle: "Neposredna povezava",
      pathTitle: (n: number) =>
        n === 1 ? "Pot prek enega zapisa" : `Pot prek ${n} zapisov`,
      share: "Kopiraj povezavo poti",
      shared: "Povezava kopirana",
      pathNote: "Vsak skok nosi razlog: ista tema, prekrivajoče obdobje, isti vir, bližina na karti ali kuratorska vez tem.",
      noPath: "Med tema zapisoma ni povezave — izberita drug par.",
    },
    minute: {
      kicker: "Muzej v minuti",
      title: "Ena minuta, ena zgodba",
      subtitle:
        "Najkrajša oblika obiska — po vzoru One Minute Wonders muzejev Brighton & Hove. Vsak dan tri zgodbe; poslušajte ali preberite prepis.",
      play: "Poslušaj · 1 min",
      transcript: "Prepis",
      variantLabel: "Dolžina posnetka",
      fullGuide: "Cel vodnik",
      minuteGuide: "V eni minuti",
    },
    season: {
      open: "Odpri zapis",
      rotationNote: "menjava: vsako leto",
    },
    advent: {
      title: "Adventni koledar muzeja",
      subtitle:
        "Od 1. do 24. decembra se vsak dan odpre ena vrata zbirke — po vzoru adventnih koledarjev Glencairn Museuma in Ashmoleana. Določenega dne odpre vsak obiskovalec isti zapis.",
      note: "Vrata se odklenejo ob lokalni polnoči; prihodnja ostanejo zaprta. Zapisi se v koledarju lahko ponovijo — zbirka ima 20 del.",
      openDoor: "Odpri vrata",
      doorLocked: "Vrata so še zaprta",
      opensIn: "Odpre se čez {n} dni",
    },
    biography: {
      title: "Življenje predmeta",
      phaseCount: (n: number) =>
        n === 1 ? "1 postaja življenja" : n === 2 ? "2 postaji življenja" : n <= 4 ? `${n} postaje življenja` : `${n} postaj življenja`,
      intro:
        "Pot zapisa skozi čas — po vzoru Art Tracks (Carnegie Museum of Art): vsaka točka nosi vir in stopnjo zanesljivosti. Vrzeli so del zgodbe, ne sramota.",
      sourceLabel: "vir",
      stages: {
        nastanek: "nastanek",
        zivljenje: "življenje",
        prica: "pričevanje",
        raziskava: "raziskava",
        digitalizacija: "digitalizacija",
        danes: "danes",
      },
    },
    gallery: {
      title: "Moja galerija časti",
      subtitle:
        "Vaši shranjeni zapisi v lastni dvorani — soba in filmski ogled na istem mestu.",
      count: (n: number) =>
        n === 1 ? "1 del na steni" : n === 2 ? "2 dela na steni" : n <= 4 ? `${n} dela na steni` : `${n} del na steni`,
      emptyTitle: "Galerija je še prazna",
      emptyText:
        "Shranite priljubljene zapise (srce v zapisu) — obesili se bodo tukaj, v vaši lastni dvorani po vzoru galerije časti Rijksmuseuma.",
      emptyCta: "Pojdite v zbirko",
      modeLabel: "Način galerije",
      roomMode: "Soba",
      filmMode: "Film",
      roomLabel: "Galerijska soba — vrtite s puščicami ali vlečenjem",
      share: "Deli galerijo",
      shared: "Povezava kopirana",
      saveAsMine: "Shrani kot svojo",
      savedAsMine: "Shranjeno v moji zbirki",
      open: "Odpri zapis",
      prev: "Prejšnje delo",
      next: "Naslednje delo",
      hungNote: (n: number) => `na steni visi prvih 12 od ${n}`,
      calmMode: "Mirni način",
      motionOn: "Vklopi gibanje",
      calmNote:
        "Mirni način (brez 3D gibanja) — namenjen občutljivosti na gibanje in počasnejšim napravam.",
      filmBadge: "filmski ogled",
      filmEnd: "Konec ogleda",
      filmEndSub: "Vaša zbirka v enih minutah — po vzoru samodejnih video ogledov Rijksmuseumovih zbirk.",
      filmReplay: "Znova",
      filmOpenLast: "Odpri zadnji zapis",
      filmProgress: "Napredek ogleda",
      jumpTo: "Skoči na",
      play: "Predvajaj",
      pause: "Ustavi",
      narrationLabel: "Zvočna pripoved",
      narrationOff: "S pripovedjo",
      narrationOn: "Utišaj pripoved",
    },
  },
  en: {
    museumName: "Griblje Village Museum",
    museumTagline: "A digital museum of a real village on the Kolpa",
    nav: {
      domov: "Home",
      zbirka: "Collection",
      tema: "Themes",
      razpolozenje: "By mood",
      zgodbe: "Stories",
      casovnica: "Timeline",
      karta: "Map",
      dogodki: "Events",
      oMuzeju: "About",
      mojMuzej: "My collection",
      zaOtroke: "For kids",
    },
    myMuseum: {
      title: "My collection",
      subtitle:
        "Records you saved during your visit — your personal gallery (in the spirit of the Rijksmuseum's Rijksstudio, no account needed, stored in your browser).",
      progressLabel: "records saved out of the whole collection",
      emptyTitle: "Your collection is still empty",
      emptyText:
        "Open any record and press the heart button — your personal museum will gather here.",
      emptyCta: "Browse the collection",
      open: "Open record",
      remove: "Remove from my collection",
      removeDialog: "Remove record from my collection",
      save: "Save to my collection",
      saved: "Saved",
      saveDialog: "Save record to my collection",
      share: "Copy my collection",
      shareHint: "A list with titles and links — paste it into a message or a note.",
    },
    zoom: {
      open: "Deep zoom",
      close: "Close deep zoom",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      reset: "Reset view",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit fullscreen",
      controlsLabel: "Deep zoom controls",
      regionLabel: "Deep-zoom view of the record image",
      loading: "Loading deep zoom …",
      failed: "Deep zoom could not be opened.",
      hint: "Pan with mouse or touch; double-click to zoom in.",
    },
    daily: {
      kicker: "Today in the museum",
      open: "Open today's record",
    },
    plan: {
      title: "Plan your visit",
      sub: "How to visit the museum — the digital one is always open, and the village is at its best from spring to autumn.",
      whenTitle: "When to visit",
      whenText:
        "The digital museum is open around the clock, 24 hours a day. For a walk through the village itself we recommend April to October; jurjevanje — the oldest spring custom of Bela krajina — takes place in late April.",
      howTitle: "Getting here",
      howText:
        "Griblje lies in Bela krajina, on the Kolpa river, about 9 km from Črnomelj. The village is small and quiet — the map below guides you to all museum points.",
      timeTitle: "How much time do you have?",
      timeText:
        "The museum adapts to your time: from a quick look at today's record to a full visit with walks and the audio guide.",
      timeShort: "Today's record and the museum quiz on this page.",
      timeMedium: "One guided museum walk through four stops.",
      timeLong: "The whole collection with the audio guide and the map.",
      ctaWalk: "Start a guided walk",
      ctaCollection: "Open the collection",
      ctaMap: "Village map",
      ctaOsm: "Directions (OpenStreetMap)",
      ctaSchools: "For schools and families",
    },
    a11y: {
      skipToContent: "Skip to content",
      mainNav: "Museum main navigation",
      toggleTheme: "Toggle light/dark theme",
      switchLang: "Switch language",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      kicker: "Bela krajina · Municipality of Črnomelj · since 1526",
      title1: "A village as",
      titleAccent: "a museum.",
      subtitle:
        "Fourteen records, one river, one border and a hundred memories. Explore Griblje — a village on the Kolpa where every place is an entrance into a story.",
      ctaCollection: "Explore the collection",
      ctaMap: "Open the map",
    },
    stats: {
      records: "museum records",
      sources: "documented sources",
      categories: "thematic sections",
      langs: "languages (SL · EN)",
      openData: "open data",
      openDataValue: "100 %",
    },
    home: {
      featuredTitle: "On display",
      featuredSub: "Records that carry the story of the village.",
      promiseTitle: "The curatorial promise",
      promiseSub: "A methodology shared with awarded European museums.",
      promise1Title: "Every record has a source",
      promise1Text:
        "Every claim in the museum is tied to a source — archival, photographic or oral — with its licence stated.",
      promise2Title: "Evidence is not testimony",
      promise2Text:
        "We separate documented fact from testimony, memory and tradition. Every record says which is which.",
      promise3Title: "The collection is open",
      promise3Text:
        "The whole collection is available through an open JSON interface under CC BY-SA 4.0 — for your projects too.",
      eventsTitle: "The village lives on",
      eventsSub: "A programme and events that build the collection together with the community.",
      viewAll: "View all",
    },
    collector: {
      title: "Collector of records",
      subtitle: "Every record you open is noted in your visit.",
      count: (found: number, total: number) => `Discovered ${found} of ${total} records`,
      percent: (p: number) => `${p} % of the collection`,
      complete: "Collection discovered!",
      completeText: "You have opened every record in the museum. The village knows you.",
      reset: "Start over",
      visitedSr: "Record already discovered",
      hint: "Open records in the collection to fill the bar.",
    },
    quiz: {
      sectionTitle: "The museum quiz",
      sectionSub: "Test how well you already know the village. Every question is grounded in the documented collection.",
      start: "Start the quiz",
      questionOf: (i: number, n: number) => `Question ${i} of ${n}`,
      next: "Next",
      finish: "Finish",
      restart: "Try again",
      correct: "Correct!",
      incorrect: "Not correct.",
      correctAnswerWas: "The correct answer was:",
      yourScore: "Your score",
      openRecord: "Open record",
      excellent: "Congratulations — you know the village like a local.",
      good: "A good result — the village still has something left to reveal.",
      tryAgain: "The village still awaits you — try again.",
      groundedNote: "Every question rests on a documented record of the collection.",
    },
    collection: {
      title: "The Collection",
      subtitle: "The museum's full digital collection — filter by section and reliability.",
      searchPlaceholder: "Search the collection …",
      allCategories: "All",
      evidenceFilter: "Reliability",
      allEvidence: "All",
      count: (n: number) => `${n} ${n === 1 ? "record" : "records"}`,
      empty: "No records match this selection.",
      resetFilters: "Clear filters",
      openRecord: "Open record",
      readMore: "Read more",
      citation: "Record citation",
      aiNote: "Illustration: museum staging (2026). The authentic photograph is listed among the sources.",
      showOnMap: "Show on map",
      sourcesTitle: "Record sources",
    },
    evidence: {
      DOCUMENTED: "documented",
      CORROBORATED: "corroborated",
      TESTIMONY: "testimony",
      TRADITION: "tradition",
      UNVERIFIED: "unverified",
      TO_COLLECT: "to collect",
      label: "Reliability level",
      desc: {
        DOCUMENTED: "The claim rests on an archival or published documented source.",
        CORROBORATED: "The claim is confirmed by at least two independent sources or a verified photograph.",
        TESTIMONY: "The claim originates from the oral testimony of a witness and is not yet archivally confirmed.",
        TRADITION: "The content is part of living tradition or folklore, not an archival fact.",
        UNVERIFIED: "The data is currently unverified — published explicitly as such.",
        TO_COLLECT: "Content awaits collection of villagers' testimonies — nothing is invented.",
      },
    },
    categories: {
      kraj: "Places",
      kolpa: "The Kolpa",
      vojna: "War & border",
      narava: "Nature",
      gospodarstvo: "Work & craft",
      sege: "Customs & tradition",
    },
    stories: {
      title: "Stories",
      subtitle: "Documented narratives, curatorial principles and an open call for testimonies.",
      documentedTitle: "Documented stories",
      documentedSub: "Narratives rebuilt from public sources.",
      principlesTitle: "Curatorial principles",
      principlesSub: "The rules by which we write a village.",
      callTitle: "The testimony collection is empty — on purpose.",
      callText:
        "We do not invent a single quote from villagers. If your relatives knew Griblje before 1960, you are invited: take part in collecting oral history. Every testimony will be recorded with a name, a year and consent.",
      callCta: "Submit a testimony",
      read: "Read the story",
      basedOn: "From public sources",
      attribution: "Attribution",
    },
    timeline: {
      title: "Timeline",
      subtitle: "Five centuries of the village on a single path — from the first written record in 1526 to today.",
      howTo: "How we read dates: only years attested in sources are drawn on the timeline. Where a source gives only a century, the record is placed in an era — never onto an invented year.",
      eras: {
        s16: "16th century — first record",
        s19: "19th century — village everyday life",
        s20: "20th century — war over the village",
        s21: "1991 → present — border and independence",
      },
      centuryShort: "19th c.",
      openRecord: "Open record",
      streamsTitle: "Continuous threads",
      streamsSub: "Religious, natural and seasonal heritage that cannot be pinned to a single date.",
      streamsNote: "These records are deliberately undated: a single year would be an invention. They flow through every era above.",
      milestones: (n: number) => `${n} dated milestones`,
    },
    events: {
      title: "Events & programme",
      subtitle: "A museum is not an archive — it is a village that lives on.",
      ours: "Museum programme",
      external: "External event",
      types: {
        PRIREDITEV: "event",
        DELAVNICA: "workshop",
        VODENJE: "guided",
      },
      noEvents: "The programme is being prepared — follow us.",
    },
    map: {
      title: "Village map",
      subtitle: "Records with verified coordinates. Points without a confirmed location are not drawn.",
      legend: "Legend",
      villageCenter: "Village centre",
      openRecord: "Open record",
      osm: "Map data: OpenStreetMap contributors",
      approx: "approximate",
    },
    about: {
      title: "About the museum",
      missionTitle: "Mission",
      missionText:
        "The Griblje Village Museum is a digital museum of a real village. It does not try to be a tourist page — it tries to be a museum: with curatorial discipline, verifiable sources, accessibility and open data. The design benchmark is drawn from awarded European museums (the National Museum of Norway — Museum of the Year 2025; Valdresmusea — Museum of the Year 2022), which prove that tradition and innovation are not opposites.",
      scaleTitle: "Reliability scale",
      scaleText:
        "Every record in the collection carries a reliability mark. This scale is the museum cousin of a rule archivists know well: never hide uncertainty — name it.",
      accessTitle: "Accessibility statement",
      accessStatus: "Status: partially conformant with WCAG 2.1 AA recommendations",
      accessPointsTitle: "What we guarantee",
      accessPoints: [
        "Keyboard navigation (focus trapping, visible focus ring, skip to content).",
        "Text contrast above 4.5 : 1 in both light and dark themes.",
        "Support for prefers-reduced-motion — animations switch off.",
        "Touch targets of at least 44 × 44 px on mobile devices.",
        "Bilingual (SL/EN) switching without page reload.",
        "Semantic roles and descriptions for screen readers on all interactive elements.",
      ],
      accessLimitTitle: "Known limitations",
      accessLimitText:
        "The interactive map (Leaflet/OpenStreetMap) does not yet have a full alternative text representation. Coordinates and descriptions of all map points are also available in the open data via /api/opendata.",
      accessFeedback: "We welcome accessibility feedback through the contact in the colophon.",
      openDataTitle: "Open data",
      openDataText:
        "The entire collection (records, sources, events, stories) is publicly available through a JSON interface under CC BY-SA 4.0 — the same openness principle practised by leading world museums.",
      openDataHow: "Usage example",
      numbersTitle: "The museum in numbers",
      numbers: {
        sources: "documented sources",
        mapPoints: "map points",
        walks: "museum walks",
        quizQuestions: "quiz questions",
        languages: "content languages",
        endpoints: "open API endpoints",
      },
      sourcesTitle: "Source register",
      sourcesText: "The sources referenced by the collection, with licences.",
      colophonTitle: "Colophon",
      colophonText: [
        "Staging: Next.js 16 · React 19 · Tailwind CSS 4 · Prisma (SQLite) · Leaflet/OpenStreetMap · shadcn/ui.",
        "Record photographs are authentic images from Wikimedia Commons (or the Slovenian Ethnographic Museum) with stated author and licence; in the rare case no photograph exists, the record is marked as museum staging.",
        "Texts and data model: Griblje Village Museum, 2026. Content licence: CC BY-SA 4.0.",
      ],
      inspireTitle: "Why this way?",
      inspireText:
        "The best European museums win not by size but by trust: every fact has a source, every visitor has access, every community has an invitation. This museum applies those standards to a single village.",
    },
    footer: {
      nav: "Visit",
      data: "Data",
      accessibility: "Accessibility",
      openData: "Open data (JSON)",
      rights: "Collection content under CC BY-SA 4.0 · Map © OpenStreetMap contributors",
      built: "Digital museum · staged 2026",
      langNote: "Razpoložljivo v slovenščini in angleščini / Available in Slovenian and English",
    },
    audio: {
      play: "Listen to the audio guide",
      stop: "Stop playback",
      loading: "Preparing the recording …",
      playing: "Playing the audio guide.",
      error: "The recording cannot be played right now. Please try again.",
      note: "Synthesized voice (TTS) — not a recording of a witness or villager.",
      noteShort: "synthesized voice",
      part: "part",
    },
    search: {
      openLabel: "Search the museum (Ctrl+K)",
      title: "Search the museum",
      description: "Unified search across records, stories and events.",
      placeholder: "Search: Kolpa, 1945, church, jurjevanje …",
      hint: "No need to type diacritics — “crnomelj” finds “Črnomelj”.",
      minChars: "Enter at least 2 characters.",
      searching: "Searching …",
      noResults: "No results.",
      error: "Search is unavailable right now. Please try again.",
      resultsCount: (n: number) => (n === 1 ? "1 result" : `${n} results`),
      groups: {
        exhibits: "Records",
        stories: "Stories",
        events: "Events",
      },
    },
    share: {
      copyLink: "Copy a link to this record",
      copied: "Link copied",
      copyFailed: "Copy failed",
      copyCitation: "Copy citation",
      citationCopied: "Citation copied",
      accessed: "accessed",
    },
    walks: {
      sectionTitle: "Museum walks",
      sectionSub:
        "Four curated walks through the collection — modelled on the guided tours of the Norwegian Museum of Cultural History. Each stop opens a record with a curator's note; leave a walk at any time.",
      stops: (n: number) => (n === 1 ? "1 stop" : `${n} stops`),
      minutes: (n: number) => `≈ ${n} min`,
      start: "Start the walk",
      coverNote: "Together the walks cover all 20 records of the collection.",
      completed: "Completed",
      completedProgress: (done: number, total: number) =>
        `Completed walks: ${done} of ${total}`,
      stopOf: (i: number, n: number) => `Stop ${i} of ${n}`,
      progressA11y: (i: number, n: number) =>
        `Walk progress: stop ${i} of ${n}.`,
      next: "Next stop",
      prev: "Previous stop",
      finish: "Finish the walk",
      curatorNote: "Curator's note",
      stopsList: "Stops",
      openStop: (n: number) => `Open stop ${n}`,
    },
    school: {
      title: "For schools and teachers",
      kicker: "The museum as a teaching resource",
      intro:
        "The museum is free, bilingual and works in any browser — on a school computer, tablet or projector. Everything is documented, which makes it suitable for teaching source literacy.",
      audienceTitle: "Who it is for",
      audienceText:
        "For pupils in grades 6–9 of primary school and secondary-school students. Curriculum links: history (the Military Frontier, the Second World War, independence in 1991), geography (Bela krajina, the border, the river), Slovene (dialect, oral history), civic education (checking claims against sources) and ethnology (the house, festivals, weaving).",
      activitiesTitle: "Three ready-made activities",
      activities: [
        {
          title: "1 · The museum quiz",
          text: "Ten questions tied to records in the collection (about 15 minutes). Every answer can be verified in the record itself — pupils practise checking claims against sources.",
        },
        {
          title: "2 · A guided walk",
          text: "Pupils choose one of the four walks and follow it to the end. At each stop they listen to the audio guide and write one fact into the worksheet.",
        },
        {
          title: "3 · Working with sources",
          text: "A discussion about the reliability scale: why is one thing marked “documented” and another “tradition”? Pupils find one example of each mark in the collection.",
        },
      ],
      worksheetTitle: "Worksheet (printable)",
      worksheetText:
        "A printable worksheet with tasks that lead pupils through the collection, the map and the source register. Designed for A4 and one school lesson.",
      worksheetButton: "Print the worksheet",
      honestNote:
        "This museum is digital — it does not offer physical guided tours. To meet the originals, we recommend the Dolenjski Museum Novo mesto, the Slovene Ethnographic Museum and the Bela krajina Museum Metlika.",
      worksheet: {
        docTitle: "Worksheet — Griblje Village Museum",
        nameField: "Name",
        classField: "Class",
        dateField: "Date",
        intro:
          "Open the Griblje Village Museum and complete the tasks. For each task, find the matching record in the collection.",
        tasksTitle: "Tasks",
        tasks: [
          "In which year is Griblje first mentioned in written sources? In which century was that?",
          "What is the river by the village called? What is the millers' weir built across it called?",
          "Who was Niko Županič and which village was he from?",
          "What happened above Griblje in March 1945? Who left on the aircraft?",
          "Find the museum map. Write down three places on the map closest to the village.",
          "Find one record marked “documented” and one marked “tradition”. What is the difference between them?",
        ],
        openTitle: "To think about",
        openQuestion:
          "Which record in the museum do you find most interesting? Why? Write three sentences.",
        thanks: "Thank you for visiting the museum.",
        footer: "Griblje Village Museum · content under CC BY-SA 4.0",
      },
    },
    loading: "Loading the collection …",
    error: "The collection cannot be loaded right now. Try refreshing the page.",
    retry: "Try again",
    common: {
      close: "Close",
      period: "Period",
      category: "Section",
      location: "Location",
      back: "Back",
      more: "More",
    },
    compare: {
      add: "Compare",
      added: "In comparison",
      addDialog: "Add record to the comparator",
      removeDialog: "Remove from the comparator",
      trayLabel: "Selection for comparison",
      trayCount: (n: number) => (n === 1 ? "1 record of 3" : `${n} of 3 selected`),
      open: "Compare records",
      openDisabled: "Select at least two records to compare",
      clear: "Clear selection",
      remove: "Remove from comparison",
      title: "Comparator",
      subtitle:
        "Place up to three records side by side and read the differences on a single page — the Comparator pattern of the Rijksmuseum's new collection online.",
      emptyHint:
        "Add at least one more record to compare — the “Compare” button lives inside every record.",
      openRecord: "Open record",
      sourcesCount: (n: number) => (n === 1 ? "1 source" : `${n} sources`),
      limitNote: "A fourth record replaces the oldest selection.",
    },
    myWalk: {
      addTo: "To my walk",
      added: "On my walk",
      addDialog: "Add record to your personal walk",
      removeDialog: "Remove from your personal walk",
      title: "My walk",
      subtitle:
        "Assemble your own route through the museum — after the Louvre's visitor trails and the Rijksmuseum's Collections. You order the stops yourself; the walk then starts like any guided museum tour.",
      emptyTitle: "Your route is still empty",
      emptyText:
        "Open any record in the collection and choose “To my walk”. The stops will wait here, in the order you set.",
      emptyCta: "Find stops in the collection",
      start: "Start my walk",
      startDisabled: "Add at least one stop",
      stopOf: (i: number) => `Stop ${i}`,
      moveUp: "Move stop up",
      moveDown: "Move stop down",
      remove: "Remove stop",
      clear: "Clear walk",
      share: "Copy my route",
      shareHint: "A list of stops with deep links — send it to your family or class.",
    },
    kids: {
      nav: "For kids",
      kicker: "For children and families · ages 6–12",
      title: "Young explorers",
      subtitle:
        "Like the Van Gogh Museum's family guide and the Louvre's Petite Galerie, this museum has a route for younger visitors — short, playful and with questions the picture itself answers.",
      introTitle: "How we explore",
      introText:
        "Every stop has a picture, a short caption and a listen button. Each stop also asks a question — the answer hides in the picture or the record.",
      walkTitle: "Family walk",
      walkText: "Six stops for young explorers: the village, the church, the river, the pond, the storks and the white birches.",
      walkCta: "Start the family walk",
      walkStops: "Stop preview",
      quizTitle: "The museum quiz",
      quizText: "Ten questions about the village — every answer hides in a record.",
      quizCta: "Take the quiz",
      worksheetTitle: "Worksheet",
      worksheetText: "Print the sheet with tasks and solve it during your visit.",
      worksheetCta: "Print the worksheet",
      collectorTitle: "Record collector",
      collectorText: "Every opened record is logged in your visit — collect them all.",
      forParents:
        "For parents and teachers: the full offer is in the “For schools and teachers” section on the About page.",
    },
    offline: {
      banner: "You are offline — the museum is served from the cache.",
    },
    themes: {
      kicker: "Explore by theme",
      title: "Six doors into the collection",
      subtitle:
        "Each theme is a small, curated entry point — in the spirit of the theme pages of the Rijksmuseum's new collection. An intro, records, walks and related themes in one place.",
      explore: "Explore the theme",
      countLabel: (n: number) => (n === 1 ? "1 record" : `${n} records`),
      backToThemes: "All themes",
      share: "Copy theme link",
      shared: "Link copied",
      allInTheme: "Records in this theme",
      walksAbout: "Walks that touch this theme",
      walkStops: (n: number) => (n === 1 ? "1 stop in this theme" : `${n} stops in this theme`),
      discoverMore: "Discover more",
      relatedTheme: "Related theme",
      viewTheme: "View theme",
    },
    mood: {
      nav: "By mood",
      kicker: "Mood guide",
      title: "What are you curious about today?",
      subtitle:
        "Three questions — and the museum composes your personal selection. Modelled on the Art Explorer of the Rijksmuseum's new collection: answer, let it surprise you, save or share.",
      subtitleShort:
        "Not sure where to start? Three questions — and the collection opens itself to you.",
      cta: "Not sure where to start",
      progress: "Guide progress",
      questionOf: (i: number, n: number) => `Question ${i} of ${n}`,
      chosen: "chosen",
      back: "Back",
      replay: "Replay last selection",
      restart: "Start over",
      resultsTitle: "Your museum today",
      resultsSub: (n: number) =>
        n === 1
          ? "The guide picked one record for you."
          : `The guide picked ${n} records for you.`,
      why: "Because it",
      share: "Share selection",
      shared: "Link copied",
      timeShortTitle: "Two minutes? Listen.",
      timeShortText:
        "Every record has a one-minute story — open one and choose “In one minute”.",
      timeLongTitle: "There is time for a walk.",
      timeLongText:
        "The water walk leads through four stops — where every visit to Griblje begins.",
      ctaMinute: "The museum in a minute",
      ctaWalk: "Start a walk",
    },
    connect: {
      openTool: "Connect two records",
      relatedTitle: "Related records",
      toolTitle: "Connect the collection",
      toolSub:
        "Like Google Arts & Culture's “x Degrees of Separation”: pick two records and the museum finds a path between them — every hop carries its reason.",
      pickA: "First record",
      pickB: "Second record",
      pickPlaceholder: "Pick a record …",
      samePick: "Pick two different records.",
      directTitle: "Direct connection",
      pathTitle: (n: number) =>
        n === 1 ? "A path through one record" : `A path through ${n} records`,
      share: "Copy path link",
      shared: "Link copied",
      pathNote: "Every hop carries a reason: same theme, overlapping period, same source, closeness on the map, or a curatorial link of themes.",
      noPath: "There is no connection between these two records — pick another pair.",
    },
    minute: {
      kicker: "The museum in a minute",
      title: "One minute, one story",
      subtitle:
        "The shortest form of a visit — after the One Minute Wonders of Brighton & Hove Museums. Three stories a day; listen or read the transcript.",
      play: "Listen · 1 min",
      transcript: "Transcript",
      variantLabel: "Recording length",
      fullGuide: "Full guide",
      minuteGuide: "In one minute",
    },
    season: {
      open: "Open record",
      rotationNote: "changes every year",
    },
    advent: {
      title: "The museum's advent calendar",
      subtitle:
        "From 1 to 24 December one door of the collection opens each day — after the advent calendars of Glencairn Museum and the Ashmolean. On a given day every visitor opens the same record.",
      note: "Doors unlock at your local midnight; future ones stay closed. Records may repeat across the calendar — the collection has 20 pieces.",
      openDoor: "Open door",
      doorLocked: "Door still closed",
      opensIn: "Opens in {n} days",
    },
    biography: {
      title: "The life of an object",
      phaseCount: (n: number) =>
        n === 1 ? "1 station of its life" : n === 2 ? "2 stations of its life" : `${n} stations of its life`,
      intro:
        "The record's path through time — after Art Tracks (Carnegie Museum of Art): every station carries a source and an evidence level. Gaps are part of the story, not a shame.",
      sourceLabel: "source",
      stages: {
        nastanek: "origin",
        zivljenje: "life",
        prica: "witness",
        raziskava: "research",
        digitalizacija: "digitisation",
        danes: "today",
      },
    },
    gallery: {
      title: "My Gallery of Honour",
      subtitle:
        "Your saved records in a hall of your own — the room and the film tour in one place.",
      count: (n: number) =>
        n === 1 ? "1 work on the wall" : n === 2 ? "2 works on the wall" : `${n} works on the wall`,
      emptyTitle: "The gallery is still empty",
      emptyText:
        "Save your favourite records (the heart on a record) — they will hang here, in your own hall after the Rijksmuseum's Gallery of Honour.",
      emptyCta: "Browse the collection",
      modeLabel: "Gallery mode",
      roomMode: "Room",
      filmMode: "Film",
      roomLabel: "Gallery room — rotate with the arrow keys or by dragging",
      share: "Share gallery",
      shared: "Link copied",
      saveAsMine: "Save as mine",
      savedAsMine: "Saved to my collection",
      open: "Open record",
      prev: "Previous work",
      next: "Next work",
      hungNote: (n: number) => `the first 12 of ${n} hang on the wall`,
      calmMode: "Calm mode",
      motionOn: "Turn motion on",
      calmNote:
        "Calm mode (no 3D motion) — for motion sensitivity and slower devices.",
      filmBadge: "film tour",
      filmEnd: "End of the tour",
      filmEndSub: "Your collection in a few minutes — after the Rijksmuseum's automatic video tours of collections.",
      filmReplay: "Play again",
      filmOpenLast: "Open the last record",
      filmProgress: "Tour progress",
      jumpTo: "Jump to",
      play: "Play",
      pause: "Pause",
      narrationLabel: "Spoken narration",
      narrationOff: "With narration",
      narrationOn: "Mute narration",
    },
  },
} as const;

export type UiDict = (typeof ui)["sl"];

const LanguageContext = React.createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: UiDict;
}>({
  lang: "sl",
  setLang: () => {},
  t: ui.sl,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("sl");

  React.useEffect(() => {
    const stored = window.localStorage.getItem("mvg-lang") as Lang | null;
    if (stored === "sl" || stored === "en") setLangState(stored);
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = lang === "sl" ? "sl" : "en";
  }, [lang]);

  // Izbira jezika se sinhronizira med zavihki istega brskalnika
  // (dogodek `storage` — enak mehanizem kot pri obiskih in sprehodih).
  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (
        event.key === "mvg-lang" &&
        (event.newValue === "sl" || event.newValue === "en")
      ) {
        setLangState(event.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem("mvg-lang", next);
  }, []);

  const value = React.useMemo(
    () => ({ lang, setLang, t: ui[lang] as UiDict }),
    [lang, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return React.useContext(LanguageContext);
}

/** Izbira jezikovno specifičnega polja iz zapisa (titleSi / titleEn …). */
export function pick<T>(lang: Lang, si: T, en: T): T {
  return lang === "sl" ? si : en;
}
