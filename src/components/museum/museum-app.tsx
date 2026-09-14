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
import { SearchDialog } from "@/components/museum/search-dialog";
import { useLang } from "@/lib/i18n";
import { markVisited } from "@/lib/visit-tracker";
import { useExhibits, useEvents, useStories } from "@/hooks/use-museum";
import { ExhibitDialog } from "@/components/museum/exhibit-dialog";
import type { ExhibitDTO } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function MuseumApp() {
  const { t } = useLang();
  const [view, setView] = React.useState<MuseumView>("domov");
  const [selectedExhibit, setSelectedExhibit] = React.useState<ExhibitDTO | null>(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const reduceMotion = useReducedMotion();

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

  const navigate = React.useCallback((next: MuseumView) => {
    setView(next);
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
    setView("karta");
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("museum:focus-exhibit", { detail: exhibit.slug })
      );
    }, 150);
  }, []);

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
      />
    ),
    zbirka: (
      <CollectionView
        exhibits={exhibitsQuery.data ?? []}
        onOpenExhibit={openExhibit}
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
        onClose={() => setSelectedExhibit(null)}
        onShowOnMap={showOnMap}
      />

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        exhibits={exhibitsQuery.data ?? []}
        onOpenExhibit={(ex) => openExhibit(ex)}
        onNavigate={navigate}
      />
    </div>
  );
}
