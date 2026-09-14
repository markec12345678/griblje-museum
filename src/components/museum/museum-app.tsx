"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Header, VIEW_ORDER, type MuseumView } from "@/components/museum/header";
import { Footer } from "@/components/museum/footer";
import { HomeView } from "@/components/museum/home-view";
import { CollectionView } from "@/components/museum/collection-view";
import { StoriesView } from "@/components/museum/stories-view";
import { TimelineView } from "@/components/museum/timeline-view";
import { EventsView } from "@/components/museum/events-view";
import { MapView } from "@/components/museum/map-view";
import { AboutView } from "@/components/museum/about-view";
import { MyMuseumView } from "@/components/museum/my-museum-view";
import { KidsView } from "@/components/museum/kids-view";
import { ThemeHubView } from "@/components/museum/theme-hub-view";
import { MoodGuideView } from "@/components/museum/mood-guide-view";
import { GuestbookView } from "@/components/museum/guestbook-view";
import { BehindScenesView } from "@/components/museum/behind-scenes-view";
import { ConnectDialog } from "@/components/museum/connect-dialog";
import { CompareTray } from "@/components/museum/compare-tray";
import { CompareDialog } from "@/components/museum/compare-dialog";
import { PersonalGallery } from "@/components/museum/personal-gallery";
import { SlowLooking } from "@/components/museum/slow-looking";
import { PuzzleDialog } from "@/components/museum/puzzle-dialog";
import { PostcardDialog } from "@/components/museum/postcard-dialog";
import { parsePostcardParams, type PostcardData } from "@/lib/postcard";
import type { PuzzleSize } from "@/lib/puzzle";
import { getAdventIndex, isDoorUnlocked } from "@/lib/seasonal-shelf";
import { SearchDialog } from "@/components/museum/search-dialog";
import { useLang } from "@/lib/i18n";
import { markVisited } from "@/lib/visit-tracker";
import { markWalkCompleted } from "@/lib/walk-tracker";
import {
  buildMyWalk,
  getWalk,
  resolveWalkStops,
  type Walk,
} from "@/lib/walks";
import { getMyWalkSlugs } from "@/lib/my-walk-tracker";
import { addToCompare, useCompareSelection } from "@/lib/compare-tracker";
import type { WalkContext } from "@/components/museum/walk-ui";
import { useExhibits, useEvents, useStories } from "@/hooks/use-museum";
import { ExhibitDialog } from "@/components/museum/exhibit-dialog";
import type { ExhibitCategory, ExhibitDTO } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function MuseumApp() {
  const { t, lang } = useLang();
  const [view, setView] = React.useState<MuseumView>("domov");
  const [selectedExhibit, setSelectedExhibit] = React.useState<ExhibitDTO | null>(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [compareOpen, setCompareOpen] = React.useState(false);
  const reduceMotion = useReducedMotion();

  // --- Muzejski sprehodi -----------------------------------------------
  // Aktivni sprehod: kurirane postaje (razrešene na zapise iz zbirke)
  // + trenutni indeks. Sprehod živi toliko časa, kolikor je odprt dialog
  // postaje; ob zaprtju se konča, napredek zbiralca pa ostane (vsaka
  // odprta postaja se šteje kot obisk).
  type ResolvedStop = { exhibit: ExhibitDTO; noteSi: string; noteEn: string };
  const [activeWalk, setActiveWalk] = React.useState<{
    walk: Walk;
    stops: ResolvedStop[];
    stopIndex: number;
  } | null>(null);

  // Globoka povezava ?walk=<id>&stop=<n> — čaka na zbirko s strežnika.
  const [pendingWalk, setPendingWalk] = React.useState<{
    walkId: string;
    stopIndex: number;
  } | null>(null);

  // Globoka povezava ?compare=<slug>,<slug> — čaka na zbirko s strežnika.
  const [pendingCompare, setPendingCompare] = React.useState<string[] | null>(null);

  // Aktivna tema (pogled #tema) + globoka povezava ?tema=<kategorija>.
  const [activeTheme, setActiveTheme] = React.useState<ExhibitCategory | null>(null);

  // Vodnik po razpoloženju: odgovori iz globoke povezave ?mood=<chip>,<chip>,<chip>.
  const [presetMoodAnswers, setPresetMoodAnswers] = React.useState<Record<string, string> | null>(null);

  // Poveži zbirko: ?path=<slugA>,<slugB> odpre orodje za iskanje poti.
  const [connectOpen, setConnectOpen] = React.useState(false);
  const [connectPair, setConnectPair] = React.useState<[string, string] | null>(null);

  // Moja galerija časti: ?gallery=<slug>,<slug> odpre deljeno galerijo,
  // sicer galerija bere osebno zbirko (mvg-favorites).
  const [galleryOpen, setGalleryOpen] = React.useState(false);
  const [gallerySlugs, setGallerySlugs] = React.useState<string[] | null>(null);
  const [galleryMode, setGalleryMode] = React.useState<"soba" | "film">("soba");
  const [pendingGallery, setPendingGallery] = React.useState<string[] | null>(null);

  // Adventni koledar: ?advent=<dan> odpre (ali poudari) določena vrata.
  const [adventHighlight, setAdventHighlight] = React.useState<number | null>(null);
  const [pendingAdvent, setPendingAdvent] = React.useState<number | null>(null);

  // Počasno gledanje: ?slow=<slug> odpre celozaslonsko vodeno razglabljanje.
  const [slowExhibit, setSlowExhibit] = React.useState<ExhibitDTO | null>(null);
  const [pendingSlow, setPendingSlow] = React.useState<string | null>(null);

  // Sestavljanka: ?puzzle=<slug>&kocke=<3|4|5> odpre igro s sliko zapisa.
  const [puzzleExhibit, setPuzzleExhibit] = React.useState<ExhibitDTO | null>(null);
  const [puzzleSize, setPuzzleSize] = React.useState<PuzzleSize>(3);
  const [pendingPuzzle, setPendingPuzzle] = React.useState<{ slug: string; size: PuzzleSize } | null>(null);

  // Razglednica: ?postcard=<slug>&msg=…&od=…&pz=… odpre prejeto kartico.
  const [postcardExhibit, setPostcardExhibit] = React.useState<ExhibitDTO | null>(null);
  const [postcardInitial, setPostcardInitial] = React.useState<PostcardData | null>(null);
  const [pendingPostcard, setPendingPostcard] = React.useState<PostcardData | null>(null);

  const exhibitsQuery = useExhibits();
  const eventsQuery = useEvents();
  const storiesQuery = useStories();

  // --- Globoke povezave -------------------------------------------------
  // IIIF manifesti in iskalni API objavljajo naslove strani oblike
  // /?exhibit=<slug> in /#<pogled>; ob prihodu na tak URL muzej zapis
  // odpre sam. Ob vsaki spremembi se URL tiho posodobi (replaceState),
  // tako da je vsak zapis deljiv s kopiranjem naslovne vrstice.
  const initialDeepLink = React.useRef<string | null>(null);
  const deepLinkHandled = React.useRef(false);

  React.useEffect(() => {
    initialDeepLink.current = new URLSearchParams(window.location.search).get("exhibit");
    const walkId = new URLSearchParams(window.location.search).get("walk");
    if (walkId) {
      const stop = Number(new URLSearchParams(window.location.search).get("stop") ?? "1");
      setPendingWalk({ walkId, stopIndex: Math.max(0, stop - 1) });
    }
    const compareParam = new URLSearchParams(window.location.search).get("compare");
    if (compareParam) {
      const slugs = compareParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
      if (slugs.length > 0) setPendingCompare(slugs);
    }
    const moodParam = new URLSearchParams(window.location.search).get("mood");
    if (moodParam) {
      const chipIds = moodParam.split(",").map((s) => s.trim()).filter(Boolean);
      setPresetMoodAnswers({
        razpolozenje: chipIds[0] ?? "",
        cas: chipIds[1] ?? "",
        jakost: chipIds[2] ?? "",
      });
      setView("razpolozenje");
    }
    const pathParam = new URLSearchParams(window.location.search).get("path");
    if (pathParam) {
      const slugs = pathParam.split(",").map((s) => s.trim()).filter(Boolean);
      if (slugs.length >= 2) {
        setConnectPair([slugs[0], slugs[1]]);
        setConnectOpen(true);
      }
    }
    const temaParam = new URLSearchParams(window.location.search).get("tema");
    if (temaParam) {
      setActiveTheme(temaParam as ExhibitCategory);
      setView("tema");
    }
    const galleryParam = new URLSearchParams(window.location.search).get("gallery");
    if (galleryParam) {
      const slugs = galleryParam.split(",").map((s) => s.trim()).filter(Boolean);
      if (slugs.length > 0) setPendingGallery(slugs.slice(0, 24));
    }
    const adventParam = new URLSearchParams(window.location.search).get("advent");
    if (adventParam) {
      const day = Number(adventParam);
      if (Number.isInteger(day) && day >= 1 && day <= 24) setPendingAdvent(day);
    }
    const slowParam = new URLSearchParams(window.location.search).get("slow");
    if (slowParam) setPendingSlow(slowParam);
    const puzzleParam = new URLSearchParams(window.location.search).get("puzzle");
    if (puzzleParam) {
      const kocke = Number(new URLSearchParams(window.location.search).get("kocke"));
      const size: PuzzleSize = kocke === 4 || kocke === 5 ? kocke : 3;
      setPendingPuzzle({ slug: puzzleParam, size });
    }
    const postcardParam = parsePostcardParams(new URLSearchParams(window.location.search));
    if (postcardParam) setPendingPostcard(postcardParam);
    const hash = window.location.hash.replace(/^#/, "");
    if ((VIEW_ORDER as string[]).includes(hash) && hash !== "domov") {
      setView(hash as MuseumView);
    }
  }, []);

  // Odpri globoko povezan zapis, ko pride zbirka s strežnika.
  React.useEffect(() => {
    if (deepLinkHandled.current) return;
    if (initialDeepLink.current === null && exhibitsQuery.data) {
      deepLinkHandled.current = true;
      return;
    }
    const slug = initialDeepLink.current;
    if (!slug || !exhibitsQuery.data) return;
    deepLinkHandled.current = true;
    const ex = exhibitsQuery.data.find((e) => e.slug === slug);
    if (ex) {
      setSelectedExhibit(ex);
      markVisited(ex.slug);
    }
  }, [exhibitsQuery.data]);

  // URL v korak z odprtim zapisom (?exhibit=<slug>).
  const urlSynced = React.useRef(false);
  React.useEffect(() => {
    if (!urlSynced.current) {
      urlSynced.current = true;
      return;
    }
    const url = new URL(window.location.href);
    if (selectedExhibit) url.searchParams.set("exhibit", selectedExhibit.slug);
    else url.searchParams.delete("exhibit");
    window.history.replaceState(window.history.state, "", url);
  }, [selectedExhibit]);

  // URL v korak s pogledom (#zbirka, #zgodbe …).
  const viewSynced = React.useRef(false);
  React.useEffect(() => {
    if (!viewSynced.current) {
      viewSynced.current = true;
      return;
    }
    const url = new URL(window.location.href);
    url.hash = view === "domov" ? "" : view;
    window.history.replaceState(window.history.state, "", url);
  }, [view]);

  // URL v korak s primerjalnikom (?compare=<slug>,<slug> …).
  const compareSelection = useCompareSelection().selection;
  const compareUrlSynced = React.useRef(false);
  React.useEffect(() => {
    if (!compareUrlSynced.current) {
      compareUrlSynced.current = true;
      return;
    }
    const url = new URL(window.location.href);
    if (compareOpen && compareSelection.length > 0) {
      url.searchParams.set("compare", compareSelection.join(","));
    } else {
      url.searchParams.delete("compare");
    }
    window.history.replaceState(window.history.state, "", url);
  }, [compareOpen, compareSelection]);

  // URL v korak s temo (?tema=<kategorija>) in orodjem Poveži (?path=…).
  const themeUrlSynced = React.useRef(false);
  React.useEffect(() => {
    if (!themeUrlSynced.current) {
      themeUrlSynced.current = true;
      return;
    }
    const url = new URL(window.location.href);
    if (view === "tema" && activeTheme) url.searchParams.set("tema", activeTheme);
    else url.searchParams.delete("tema");
    if (connectOpen && connectPair) url.searchParams.set("path", connectPair.join(","));
    else url.searchParams.delete("path");
    window.history.replaceState(window.history.state, "", url);
  }, [view, activeTheme, connectOpen, connectPair]);

  // URL v korak z galerijo časti (?gallery=<slug>,<slug> …).
  const galleryUrlSynced = React.useRef(false);
  React.useEffect(() => {
    if (!galleryUrlSynced.current) {
      galleryUrlSynced.current = true;
      return;
    }
    const url = new URL(window.location.href);
    if (galleryOpen && gallerySlugs && gallerySlugs.length > 0) {
      url.searchParams.set("gallery", gallerySlugs.join(","));
    } else {
      url.searchParams.delete("gallery");
    }
    window.history.replaceState(window.history.state, "", url);
  }, [galleryOpen, gallerySlugs]);

  // Zaostali globoki povezavi primerjave ustreže, ko zbirka prispe.
  React.useEffect(() => {
    if (!pendingCompare || !exhibitsQuery.data) return;
    const target = pendingCompare;
    setPendingCompare(null);
    const valid = target.filter((slug) =>
      exhibitsQuery.data.some((ex) => ex.slug === slug)
    );
    if (valid.length === 0) return;
    valid.forEach((slug) => addToCompare(slug));
    setCompareOpen(true);
  }, [pendingCompare, exhibitsQuery.data]);

  // Zaostala globoka povezava galerije ustreže, ko zbirka prispe.
  React.useEffect(() => {
    if (!pendingGallery || !exhibitsQuery.data) return;
    const target = pendingGallery;
    setPendingGallery(null);
    const valid = target.filter((slug) =>
      exhibitsQuery.data.some((ex) => ex.slug === slug)
    );
    if (valid.length === 0) return;
    setGallerySlugs(valid);
    setGalleryMode("soba");
    setGalleryOpen(true);
  }, [pendingGallery, exhibitsQuery.data]);

  // Zaostala globoka povezava adventnih vrat ustreže, ko zbirka prispe.
  React.useEffect(() => {
    if (pendingAdvent === null || !exhibitsQuery.data) return;
    const day = pendingAdvent;
    setPendingAdvent(null);
    const now = new Date();
    setAdventHighlight(day);
    const unlocked = isDoorUnlocked(day, now);
    if (unlocked) {
      const index = getAdventIndex(day, now, exhibitsQuery.data.length);
      const exhibit = exhibitsQuery.data[index];
      if (exhibit) {
        // Enako openExhibit, vendar brez focusView (efekt je nad deklaracijo).
        setSelectedExhibit(exhibit);
        markVisited(exhibit.slug);
      }
    } else {
      // Prihodnja vrata: odpri domačo stran in poudari zaklenjena vrata.
      setView("domov");
      window.setTimeout(() => {
        document.getElementById("advent")?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
    // Povezava je izpolnjena — parameter počistimo iz naslova.
    const url = new URL(window.location.href);
    if (url.searchParams.has("advent")) {
      url.searchParams.delete("advent");
      window.history.replaceState(window.history.state, "", url);
    }
  }, [pendingAdvent, exhibitsQuery.data]);

  // Zaostala globoka povezava počasnega gledanja ustreže, ko zbirka prispe.
  React.useEffect(() => {
    if (!pendingSlow || !exhibitsQuery.data) return;
    const target = pendingSlow;
    setPendingSlow(null);
    const ex = exhibitsQuery.data.find((e) => e.slug === target);
    if (ex) {
      setSlowExhibit(ex);
      markVisited(ex.slug);
    }
    const url = new URL(window.location.href);
    if (url.searchParams.has("slow")) {
      url.searchParams.delete("slow");
      window.history.replaceState(window.history.state, "", url);
    }
  }, [pendingSlow, exhibitsQuery.data]);

  // Zaostala globoka povezava sestavljanke ustreže, ko zbirka prispe.
  React.useEffect(() => {
    if (!pendingPuzzle || !exhibitsQuery.data) return;
    const target = pendingPuzzle;
    setPendingPuzzle(null);
    const ex = exhibitsQuery.data.find((e) => e.slug === target.slug);
    if (ex) {
      setPuzzleSize(target.size);
      setPuzzleExhibit(ex);
      markVisited(ex.slug);
    }
    const url = new URL(window.location.href);
    if (url.searchParams.has("puzzle")) {
      url.searchParams.delete("puzzle");
      url.searchParams.delete("kocke");
      window.history.replaceState(window.history.state, "", url);
    }
  }, [pendingPuzzle, exhibitsQuery.data]);

  // Zaostala globoka povezava razglednice ustreže, ko zbirka prispe.
  React.useEffect(() => {
    if (!pendingPostcard || !exhibitsQuery.data) return;
    const target = pendingPostcard;
    setPendingPostcard(null);
    const ex = exhibitsQuery.data.find((e) => e.slug === target.slug);
    if (ex) {
      setPostcardInitial(target);
      setPostcardExhibit(ex);
    }
    const url = new URL(window.location.href);
    if (url.searchParams.has("postcard")) {
      url.searchParams.delete("postcard");
      url.searchParams.delete("msg");
      url.searchParams.delete("od");
      url.searchParams.delete("pz");
      window.history.replaceState(window.history.state, "", url);
    }
  }, [pendingPostcard, exhibitsQuery.data]);

  // URL v korak z izkušnjami zapisa (?slow=, ?puzzle=, ?postcard=).
  const experiencesUrlSynced = React.useRef(false);
  React.useEffect(() => {
    if (!experiencesUrlSynced.current) {
      experiencesUrlSynced.current = true;
      return;
    }
    const url = new URL(window.location.href);
    if (slowExhibit) url.searchParams.set("slow", slowExhibit.slug);
    else url.searchParams.delete("slow");
    if (puzzleExhibit) {
      url.searchParams.set("puzzle", puzzleExhibit.slug);
      url.searchParams.set("kocke", String(puzzleSize));
    } else {
      url.searchParams.delete("puzzle");
      url.searchParams.delete("kocke");
    }
    if (postcardExhibit && postcardInitial) {
      url.searchParams.set("postcard", postcardInitial.slug);
      if (postcardInitial.message.trim()) url.searchParams.set("msg", postcardInitial.message.trim());
      if (postcardInitial.sender.trim()) url.searchParams.set("od", postcardInitial.sender.trim());
      if (postcardInitial.greeting !== "pozdrav") url.searchParams.set("pz", postcardInitial.greeting);
    } else {
      url.searchParams.delete("postcard");
      url.searchParams.delete("msg");
      url.searchParams.delete("od");
      url.searchParams.delete("pz");
    }
    window.history.replaceState(window.history.state, "", url);
  }, [slowExhibit, puzzleExhibit, puzzleSize, postcardExhibit, postcardInitial]);

  // --- Bližnjice za iskanje (Ctrl/Cmd+K ali /) --------------------------
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement | null;
        const typing = target?.closest(
          "input, textarea, select, [contenteditable='true']"
        );
        if (!typing) {
          event.preventDefault();
          setSearchOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navigate = React.useCallback(
    (next: MuseumView) => {
      setView(next);
      if (next !== "tema") setActiveTheme(null);
      if (next !== "razpolozenje") setPresetMoodAnswers(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    []
  );

  // Odpri tematsko središče (pogled #tema + aktivna kategorija).
  const openTheme = React.useCallback((category: ExhibitCategory | null) => {
    setActiveTheme(category);
    setView("tema");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openExhibit = React.useCallback(
    (exhibit: ExhibitDTO, focusView?: MuseumView) => {
      if (focusView && focusView !== view) setView(focusView);
      setSelectedExhibit(exhibit);
      // Zbiralec: vsak odprt zapis se zabeleži v obisk (lokalno, brez strežnika).
      markVisited(exhibit.slug);
    },
    [view]
  );

  const showOnMap = React.useCallback((exhibit: ExhibitDTO) => {
    setSelectedExhibit(null);
    setActiveWalk(null);
    setView("karta");
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("museum:focus-exhibit", { detail: exhibit.slug })
      );
    }, 150);
  }, []);

  // --- Sprehodi: start, navigacija, zaključek -------------------------
  const startWalk = React.useCallback(
    (walkId: string, stopIndex: number, exhibits: ExhibitDTO[]) => {
      // Osebni sprehod ni kuriran — zgradi se iz shranjenih postaj obiskovalca.
      const walk =
        getWalk(walkId) ?? (walkId === "moj-sprehod" ? buildMyWalk(getMyWalkSlugs()) : undefined);
      if (!walk) return;
      const stops = resolveWalkStops(walk, exhibits);
      if (stops.length === 0) return;
      const index = Math.min(Math.max(stopIndex, 0), stops.length - 1);
      setActiveWalk({ walk, stops, stopIndex: index });
      setSelectedExhibit(stops[index].exhibit);
      markVisited(stops[index].exhibit.slug);
    },
    []
  );

  const goToWalkStop = React.useCallback(
    (stopIndex: number) => {
      if (!activeWalk) return;
      if (stopIndex < 0 || stopIndex >= activeWalk.stops.length) return;
      const stop = activeWalk.stops[stopIndex];
      setActiveWalk({ ...activeWalk, stopIndex });
      setSelectedExhibit(stop.exhibit);
      markVisited(stop.exhibit.slug);
    },
    [activeWalk]
  );

  // Zaostali globoki povezavi sprehoda ustreže, ko zbirka prispe.
  React.useEffect(() => {
    if (!pendingWalk || !exhibitsQuery.data) return;
    const target = pendingWalk;
    setPendingWalk(null);
    startWalk(target.walkId, target.stopIndex, exhibitsQuery.data);
  }, [pendingWalk, exhibitsQuery.data, startWalk]);

  const finishWalk = React.useCallback(() => {
    if (!activeWalk) return;
    // Stranski učinek (localStorage) mora teči zunaj state updaterja,
    // da updater ostane čist (React ga lahko pokliče dvakrat v StrictMode).
    markWalkCompleted(activeWalk.walk.id);
    setActiveWalk(null);
    setSelectedExhibit(null);
  }, [activeWalk]);

  const closeExhibit = React.useCallback(() => {
    setSelectedExhibit(null);
    setActiveWalk(null);
  }, []);

  // Kontekst sprehoda za dialog (null, ko ni aktivnega sprehoda
  // ali ko odprt zapis ni njegova trenutna postaja).
  const walkContext: WalkContext | null = (() => {
    if (!activeWalk || !selectedExhibit) return null;
    const stop = activeWalk.stops[activeWalk.stopIndex];
    if (!stop || stop.exhibit.slug !== selectedExhibit.slug) return null;
    return {
      walk: activeWalk.walk,
      stopIndex: activeWalk.stopIndex,
      totalStops: activeWalk.stops.length,
      stopNote: lang === "sl" ? stop.noteSi : stop.noteEn,
      onPrevStop: () => goToWalkStop(activeWalk.stopIndex - 1),
      onNextStop: () => goToWalkStop(activeWalk.stopIndex + 1),
      onFinish: finishWalk,
    };
  })();

  const loading =
    exhibitsQuery.isLoading || eventsQuery.isLoading || storiesQuery.isLoading;
  const failed =
    exhibitsQuery.isError || eventsQuery.isError || storiesQuery.isError;

  const views: Record<MuseumView, React.ReactNode> = {
    domov: (
      <HomeView
        exhibits={exhibitsQuery.data ?? []}
        events={eventsQuery.data ?? []}
        onNavigate={navigate}
        onOpenExhibit={openExhibit}
        onStartWalk={(walkId, stopIndex) =>
          startWalk(walkId, stopIndex, exhibitsQuery.data ?? [])
        }
        adventHighlight={adventHighlight}
      />
    ),
    zbirka: (
      <CollectionView
        exhibits={exhibitsQuery.data ?? []}
        onOpenExhibit={openExhibit}
        onOpenTheme={openTheme}
        onOpenConnect={(pair) => {
          setConnectPair(pair);
          setConnectOpen(true);
        }}
      />
    ),
    tema: (
      <ThemeHubView
        category={activeTheme}
        exhibits={exhibitsQuery.data ?? []}
        onOpenExhibit={(ex) => openExhibit(ex)}
        onOpenTheme={openTheme}
        onNavigate={navigate}
        onStartWalk={(walkId, stopIndex) =>
          startWalk(walkId, stopIndex, exhibitsQuery.data ?? [])
        }
      />
    ),
    razpolozenje: (
      <MoodGuideView
        exhibits={exhibitsQuery.data ?? []}
        initialAnswers={presetMoodAnswers ?? undefined}
        onOpenExhibit={(ex) => openExhibit(ex)}
        onNavigate={navigate}
        onStartWalk={(walkId) => startWalk(walkId, 0, exhibitsQuery.data ?? [])}
      />
    ),
    zgodbe: <StoriesView stories={storiesQuery.data ?? []} />,
    casovnica: (
      <TimelineView
        exhibits={exhibitsQuery.data ?? []}
        onOpenExhibit={openExhibit}
      />
    ),
    karta: (
      <MapView
        exhibits={exhibitsQuery.data ?? []}
        onOpenExhibit={openExhibit}
      />
    ),
    dogodki: <EventsView events={eventsQuery.data ?? []} />,
    oMuzeju: <AboutView exhibits={exhibitsQuery.data ?? []} />,
    mojMuzej: (
      <MyMuseumView
        exhibits={exhibitsQuery.data ?? []}
        onOpenExhibit={(ex) => openExhibit(ex)}
        onNavigate={navigate}
        onStartMyWalk={() => startWalk("moj-sprehod", 0, exhibitsQuery.data ?? [])}
        onOpenGallery={(mode) => {
          setGallerySlugs(null);
          setGalleryMode(mode);
          setGalleryOpen(true);
        }}
      />
    ),
    zaOtroke: (
      <KidsView
        exhibits={exhibitsQuery.data ?? []}
        onNavigate={navigate}
        onStartWalk={(walkId, stopIndex) =>
          startWalk(walkId, stopIndex, exhibitsQuery.data ?? [])
        }
      />
    ),
    knjiga: <GuestbookView />,
    zaKuliso: <BehindScenesView />,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#vsebina"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        {t.a11y.skipToContent}
      </a>

      <Header view={view} onNavigate={navigate} onOpenSearch={() => setSearchOpen(true)} />

      <main id="vsebina" className="flex-1">
        {loading ? (
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-busy="true">
            <p className="sr-only">{t.loading}</p>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="mt-4 h-5 w-full max-w-xl" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </section>
        ) : failed ? (
          <section className="mx-auto max-w-xl px-4 py-24 text-center">
            <p className="text-lg font-medium">{t.error}</p>
            <Button
              className="mt-6"
              onClick={() => {
                exhibitsQuery.refetch();
                eventsQuery.refetch();
                storiesQuery.refetch();
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.retry}
            </Button>
          </section>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {views[view]}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <Footer onNavigate={navigate} />

      <ExhibitDialog
        exhibit={selectedExhibit}
        allExhibits={exhibitsQuery.data ?? []}
        onClose={closeExhibit}
        onShowOnMap={showOnMap}
        onOpenExhibit={(ex) => openExhibit(ex)}
        onOpenTheme={openTheme}
        onSlowLooking={(ex) => {
          setSelectedExhibit(null);
          setSlowExhibit(ex);
        }}
        onPuzzle={(ex) => {
          setSelectedExhibit(null);
          setPuzzleSize(3);
          setPuzzleExhibit(ex);
        }}
        onPostcard={(ex) => {
          setSelectedExhibit(null);
          setPostcardInitial(null);
          setPostcardExhibit(ex);
        }}
        walkContext={walkContext}
      />

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        exhibits={exhibitsQuery.data ?? []}
        onOpenExhibit={(ex) => openExhibit(ex)}
        onNavigate={navigate}
      />

      {/* Primerjalnik: pladenj izbire + primerjava na eni strani */}
      {!compareOpen && (
        <CompareTray
          exhibits={exhibitsQuery.data ?? []}
          onOpenCompare={() => setCompareOpen(true)}
        />
      )}
      <CompareDialog
        open={compareOpen}
        exhibits={exhibitsQuery.data ?? []}
        onClose={() => setCompareOpen(false)}
        onOpenExhibit={(ex) => openExhibit(ex)}
      />

      {/* Poveži zbirko — pot med dvema zapisoma (x Degrees of Separation) */}
      <ConnectDialog
        open={connectOpen}
        exhibits={exhibitsQuery.data ?? []}
        initialPair={connectPair}
        onClose={() => setConnectOpen(false)}
        onOpenExhibit={(ex) => openExhibit(ex)}
      />

      {/* Moja galerija časti — soba (CSS-3D) in filmski ogled (Ken Burns) */}
      <PersonalGallery
        open={galleryOpen}
        exhibits={exhibitsQuery.data ?? []}
        sharedSlugs={gallerySlugs}
        initialMode={galleryMode}
        onClose={() => setGalleryOpen(false)}
        onOpenExhibit={(ex) => openExhibit(ex)}
        onNavigate={navigate}
      />

      {/* Počasno gledanje — vodeno razglabljanje enega zapisa */}
      <SlowLooking
        exhibit={slowExhibit}
        onClose={() => setSlowExhibit(null)}
      />

      {/* Sestavi sliko — muzejska sestavljanka */}
      <PuzzleDialog
        exhibit={puzzleExhibit}
        initialSize={puzzleSize}
        onClose={() => setPuzzleExhibit(null)}
      />

      {/* Pošlji razglednico — deljiva muzejska e-razglednica */}
      <PostcardDialog
        exhibit={postcardExhibit}
        initial={postcardInitial}
        onClose={() => {
          setPostcardExhibit(null);
          setPostcardInitial(null);
        }}
      />
    </div>
  );
}
