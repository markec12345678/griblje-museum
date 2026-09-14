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
      zgodbe: "Zgodbe",
      karta: "Karta",
      dogodki: "Dogodki",
      oMuzeju: "O muzeju",
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
      sourcesTitle: "Register virov",
      sourcesText: "Seznam virov, na katere se sklicuje zbirka, z licencami.",
      colophonTitle: "Kolofon",
      colophonText: [
        "Postavitev: Next.js 16 · React 19 · Tailwind CSS 4 · Prisma (SQLite) · Leaflet/OpenStreetMap · shadcn/ui.",
        "Ilustracije zapisov so umetniške postavitvene podobe, izdelane za ta muzej leta 2026; avtentične arhivske fotografije so vezane v registru virov.",
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
  },
  en: {
    museumName: "Griblje Village Museum",
    museumTagline: "A digital museum of a real village on the Kolpa",
    nav: {
      domov: "Home",
      zbirka: "Collection",
      zgodbe: "Stories",
      karta: "Map",
      dogodki: "Events",
      oMuzeju: "About",
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
      sourcesTitle: "Source register",
      sourcesText: "The sources referenced by the collection, with licences.",
      colophonTitle: "Colophon",
      colophonText: [
        "Staging: Next.js 16 · React 19 · Tailwind CSS 4 · Prisma (SQLite) · Leaflet/OpenStreetMap · shadcn/ui.",
        "Record illustrations are artistic staging images made for this museum in 2026; authentic archival photographs are bound in the source register.",
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
