"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Armchair,
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Frame,
  Headphones,
  Heart,
  Link2,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { addFavorite, useFavorites } from "@/lib/favorite-tracker";
import { hasMinuteStory } from "@/components/museum/minute-stories";
import type { ExhibitDTO } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Moja galerija časti — osebna razstava shranjenih zapisov v dveh
 * načinih:
 *
 * 1. SOBA — CSS-3D galerijski prostor (perspektiva + rotateY obroč,
 *    brez WebGL; po vzoru Codrops »3D Image Gallery Room« in mirne
 *    galerijske lekcije Rijksmuseuma: stene v ozadju, eksponat v
 *    središču). Vzpostavitev po vzoru »My Gallery of Honour«
 *    Rijksmuseuma (Collection Online, 2024) — kultni prostor, v
 *    katerem obiskovaliec obesi lastno izbiro.
 *
 * 2. FILM — samodejni ogled osebne zbirke z učinkom Ken Burns
 *    (počasni pan/zoom nad fotografijo + prehod; vzorec: Rijksmuseum
 *    Collections samodejno sestavi video posnetek izbrane zbirke).
 *    Zvok je neobvezen: sintetizirana enominutna zgodba (TTS).
 *
 * Skupen temelj: globoka povezava ?gallery=slug,slug — prejemnik
 * vidi tujo galerijo in jo lahko shrani kot svojo; prazno stanje
 * povabi v zbirko. prefers-reduced-motion povsod pomeni mirni način.
 */

const ART_W = 240;
const ART_H = 300;
/** Koliko del visi v sobi (Rijksmuseumova galerija časti je ena dvorana). */
const MAX_HANG = 12;
const SLIDE_MS = 6000;

type Mode = "soba" | "film";

/* ------------------------------------------------------------------ */
/* Ken Burnsove gibalne variante — izmenične smeri (kirupa/Intuiface)  */
/* ------------------------------------------------------------------ */

const KB_VARIANTS = [
  { scale: [1.12, 1.12], x: ["3%", "-3%"] },
  { scale: [1.12, 1.12], x: ["-3%", "3%"] },
  { scale: [1.0, 1.14], x: ["0%", "0%"] },
  { scale: [1.14, 1.02], x: ["0%", "0%"] },
] as const;

export function PersonalGallery({
  open,
  exhibits,
  sharedSlugs,
  initialMode = "soba",
  onClose,
  onOpenExhibit,
  onNavigate,
}: {
  open: boolean;
  exhibits: ExhibitDTO[];
  /** Slugi iz globoke povezave ?gallery=; null → beri osebno zbirko. */
  sharedSlugs: string[] | null;
  initialMode?: Mode;
  onClose: () => void;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  onNavigate: (view: "zbirka") => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const { favorites } = useFavorites();
  const prefersReduced = useReducedMotion();

  const [mode, setMode] = React.useState<Mode>(initialMode);
  const [calm, setCalm] = React.useState(false);
  const [shareState, setShareState] = React.useState<"idle" | "ok" | "fail">("idle");
  const [savedState, setSavedState] = React.useState<"idle" | "ok">("idle");

  // Vrstni red obešenih del: pri deljeni galeriji vrstni red povezave,
  // sicer shranjevalni vrstni red osebne zbirke.
  const items = React.useMemo<ExhibitDTO[]>(() => {
    const slugs = sharedSlugs ?? Array.from(favorites);
    return slugs
      .map((slug) => exhibits.find((ex) => ex.slug === slug))
      .filter((ex): ex is ExhibitDTO => Boolean(ex));
  }, [sharedSlugs, favorites, exhibits]);

  const sharedIsMine = React.useMemo(() => {
    if (!sharedSlugs) return true;
    const mine = Array.from(favorites);
    return (
      mine.length === sharedSlugs.length && sharedSlugs.every((s) => mine.includes(s))
    );
  }, [sharedSlugs, favorites]);

  const reduceMotion = prefersReduced || calm;

  React.useEffect(() => {
    if (open) {
      setShareState("idle");
      setSavedState("idle");
      setMode(initialMode);
    }
  }, [open, initialMode]);

  React.useEffect(() => {
    if (shareState === "idle") return;
    const timer = window.setTimeout(() => setShareState("idle"), 2600);
    return () => window.clearTimeout(timer);
  }, [shareState]);

  const slugs = items.map((ex) => ex.slug);
  const shareLink = () => {
    const url = `${window.location.origin}/?gallery=${slugs.join(",")}`;
    navigator.clipboard
      ?.writeText(url)
      .then(() => setShareState("ok"))
      .catch(() => setShareState("fail"));
  };

  const saveAsMine = () => {
    slugs.forEach((slug) => addFavorite(slug));
    setSavedState("ok");
  };

  const empty = items.length === 0;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[94vh] gap-0 overflow-hidden border-border bg-[#141210] p-0 text-[#f7f3e9] sm:max-w-5xl [&>button]:text-[#f7f3e9]">
        {empty ? (
          <div className="px-6 py-16 text-center sm:px-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Heart className="h-7 w-7" aria-hidden="true" />
            </span>
            <DialogHeader className="items-center text-center">
              <DialogTitle asChild>
                <h2 className="font-display mt-4 text-2xl font-semibold">
                  {t.gallery.emptyTitle}
                </h2>
              </DialogTitle>
              <DialogDescription className="text-[#b8b2a4]">
                {t.gallery.emptyText}
              </DialogDescription>
            </DialogHeader>
            <Button
              className="mt-6 min-h-11"
              onClick={() => {
                onClose();
                onNavigate("zbirka");
              }}
            >
              {t.gallery.emptyCta}
            </Button>
          </div>
        ) : (
          <div className="flex h-[86vh] max-h-[86vh] flex-col">
            {/* Vrstica z naslovom, načini in dejanji */}
            <DialogDescription className="sr-only">
              {t.gallery.subtitle}
            </DialogDescription>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-md bg-primary/15 text-primary">
                  <Frame className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-base font-semibold leading-tight">
                    {t.gallery.title}
                  </p>
                  <p className="text-xs text-[#b8b2a4]">
                    {t.gallery.count(items.length)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div
                  role="group"
                  aria-label={t.gallery.modeLabel}
                  className="flex items-center rounded-md border border-white/15 bg-white/5 p-0.5"
                >
                  {(["soba", "film"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      aria-pressed={mode === m}
                      className="flex min-h-9 items-center gap-1.5 rounded-sm px-3 py-1 text-xs font-medium transition-colors"
                      style={{ color: mode === m ? "var(--primary)" : "#b8b2a4" }}
                    >
                      {m === "soba" ? (
                        <Frame className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Clapperboard className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {m === "soba" ? t.gallery.roomMode : t.gallery.filmMode}
                    </button>
                  ))}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-9 border-white/15 bg-transparent text-[#f7f3e9] hover:bg-white/10 hover:text-white"
                  onClick={shareLink}
                  aria-live="polite"
                >
                  {shareState === "ok" ? (
                    <Check className="mr-1.5 h-4 w-4 text-primary" aria-hidden="true" />
                  ) : (
                    <Link2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  )}
                  {shareState === "ok"
                    ? t.gallery.shared
                    : shareState === "fail"
                      ? t.share.copyFailed
                      : t.gallery.share}
                </Button>

                {!sharedIsMine && (
                  <Button
                    size="sm"
                    className="min-h-9"
                    onClick={saveAsMine}
                    aria-live="polite"
                  >
                    {savedState === "ok" ? (
                      <Check className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Heart className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    )}
                    {savedState === "ok" ? t.gallery.savedAsMine : t.gallery.saveAsMine}
                  </Button>
                )}
              </div>
            </div>

            {/* Vsebina glede na način */}
            <div className="relative flex-1 overflow-hidden">
              {mode === "soba" ? (
                <RoomView
                  items={items.slice(0, MAX_HANG)}
                  total={items.length}
                  overflowNote={items.length > MAX_HANG}
                  reduceMotion={reduceMotion}
                  calm={calm}
                  onCalmToggle={() => setCalm((c) => !c)}
                  onOpenExhibit={onOpenExhibit}
                />
              ) : (
                <FilmView
                  items={items}
                  lang={lang}
                  reduceMotion={reduceMotion}
                  onOpenExhibit={onOpenExhibit}
                  onCalmToggle={() => setCalm((c) => !c)}
                />
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ================================================================== */
/* SOBA — CSS-3D obroč galerijskih sten (brez WebGL)                    */
/* ================================================================== */

function RoomView({
  items,
  total,
  overflowNote,
  reduceMotion,
  calm,
  onCalmToggle,
  onOpenExhibit,
}: {
  items: ExhibitDTO[];
  total: number;
  overflowNote: boolean;
  reduceMotion: boolean;
  calm: boolean;
  onCalmToggle: () => void;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t } = useLang();
  const es = useExhibitStrings();

  const n = items.length;
  const step = 360 / n;
  const radius = Math.round(ART_W / 2 / Math.tan(Math.PI / n) + 140);

  const [rotation, setRotation] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const dragRef = React.useRef<{ startX: number; startRot: number } | null>(null);
  const movedRef = React.useRef(false);

  const centerIndex = React.useCallback(
    (rot: number) => {
      const raw = Math.round(-rot / step);
      return ((raw % n) + n) % n;
    },
    [step, n]
  );

  const focused = centerIndex(rotation);

  const goTo = React.useCallback(
    (index: number) => {
      // Najbližje ekvivalentna rotacija, da se obroč ne vrti čez cel krog.
      const current = rotation;
      const target = -index * step;
      const k = Math.round((current - target) / 360);
      const candidates = [target + (k - 1) * 360, target + k * 360, target + (k + 1) * 360];
      const nearest = candidates.reduce((a, b) =>
        Math.abs(b - current) < Math.abs(a - current) ? b : a
      );
      setRotation(nearest);
    },
    [rotation, step]
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (calm) return;
    // Nativno vlečenje slik (HTML5 drag) bi pogoltnilo pointermove dogodke.
    if ((event.target as HTMLElement).closest("img")) event.preventDefault();
    dragRef.current = { startX: event.clientX, startRot: rotation };
    movedRef.current = false;
    setDragging(true);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    if (Math.abs(dx) > 8) movedRef.current = true;
    setRotation(drag.startRot + dx * 0.25);
  };
  const onPointerUp = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    // Klik po vlečenju potlačimo (dogodek click pride po pointerup).
    if (movedRef.current) {
      window.setTimeout(() => {
        movedRef.current = false;
      }, 60);
    }
    goTo(centerIndex(rotation));
  };
  const onArtworkClick = (index: number, exhibit: ExhibitDTO) => {
    if (movedRef.current) return;
    if (index === focused) onOpenExhibit(exhibit);
    else goTo(index);
  };

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goTo(focused + 1);
      if (event.key === "ArrowLeft") goTo(focused - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, focused]);

  const focusedExhibit = items[focused];

  if (calm) {
    /* Mirni način: raven film namesto 3D (WCAG 2.3.3, vestibularne motnje). */
    return (
      <div className="museum-scroll flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <p className="mx-auto max-w-md text-center text-xs text-[#b8b2a4]">
            {t.gallery.calmNote}
          </p>
          <ul className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
            {items.map((exhibit, index) => (
              <li key={exhibit.slug} className="w-56 shrink-0 snap-center">
                <button
                  type="button"
                  onClick={() => onOpenExhibit(exhibit)}
                  className={`block w-full overflow-hidden rounded-lg border text-left transition-shadow hover:shadow-lg ${
                    index === focused ? "border-primary/70 shadow-lg" : "border-white/15"
                  }`}
                  aria-label={`${t.gallery.open}: ${es.title(exhibit)}`}
                >
                  <span className="block bg-[#f5efe3] p-3">
                    <span className="relative block aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                        alt={es.title(exhibit)}
                        fill
                        sizes="224px"
                        className="object-cover"
                      />
                    </span>
                    <span className="font-display mt-2 block text-sm font-semibold text-[#2a2520]">
                      {es.title(exhibit)}
                    </span>
                    <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-[#7a7263]">
                      {es.period(exhibit)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <CalmToggleRow calm={calm} onCalmToggle={onCalmToggle} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Galerija: perspektiva, obroč z deli, tla in stropa svetloba */}
      <div
        className="relative flex-1 select-none overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(214,197,164,0.16),transparent_55%)]"
        style={{ perspective: "1100px", touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="listbox"
        aria-label={t.gallery.roomLabel}
      >
        {/* Obroč delov — transform vodi čisti CSS (framer-motion ne
            aplicira rotateY na elementih s preserve-3d), prehod ima
            pomirjeno krivuljo po vzoru pomladi iz drugih pogledov. */}
        <div
          className="absolute left-1/2 top-1/2 will-change-transform"
          style={{
            width: ART_W,
            height: ART_H,
            marginLeft: -ART_W / 2,
            marginTop: -ART_H / 2,
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotation}deg)`,
            transition:
              dragging || reduceMotion
                ? "none"
                : "transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {items.map((exhibit, index) => {
            const angle = index * step;
            return (
              <div
                key={exhibit.slug}
                role="option"
                aria-selected={index === focused}
                className="absolute inset-0"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
              >
                <button
                  type="button"
                  onClick={() => onArtworkClick(index, exhibit)}
                  className="block h-full w-full cursor-pointer text-left select-none"
                  aria-label={`${t.gallery.open}: ${es.title(exhibit)}`}
                >
                  {/* Okvir + pas + tablica (enotna obešena višina) */}
                  <span
                    className={`block h-full w-full rounded-sm border-[10px] bg-[#f5efe3] p-3 shadow-[0_18px_38px_rgba(0,0,0,0.55)] transition-shadow ${
                      index === focused ? "border-[#7a5c33]" : "border-[#5a4630]"
                    }`}
                  >
                    <span className="relative block h-[58%] w-full overflow-hidden">
                      <Image
                        src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                        alt={es.title(exhibit)}
                        fill
                        sizes="240px"
                        className="object-cover"
                        draggable={false}
                      />
                    </span>
                    <span className="font-display mt-2 block truncate text-sm font-semibold text-[#2a2520]">
                      {es.title(exhibit)}
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] uppercase tracking-wider text-[#7a7263]">
                      {es.period(exhibit)}
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Tla galerije */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0c0a08] to-transparent"
          aria-hidden="true"
        />

        {/* Navigacija obroča */}
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-3 px-4">
          <Button
            size="icon"
            variant="outline"
            className="size-10 border-white/20 bg-black/30 text-[#f7f3e9] hover:bg-black/50"
            onClick={() => goTo(focused - 1)}
            aria-label={t.gallery.prev}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
          <span className="rounded-full bg-black/40 px-3 py-1 text-xs tabular-nums text-[#b8b2a4]" aria-live="polite">
            {focused + 1} / {n}
            {overflowNote ? ` · ${t.gallery.hungNote(total)}` : ""}
          </span>
          <Button
            size="icon"
            variant="outline"
            className="size-10 border-white/20 bg-black/30 text-[#f7f3e9] hover:bg-black/50"
            onClick={() => goTo(focused + 1)}
            aria-label={t.gallery.next}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Tablica pod osrednjim delom */}
      <div className="border-t border-white/10 px-4 py-3 sm:px-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={focusedExhibit?.slug ?? "none"}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex flex-wrap items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="font-display truncate text-base font-semibold">
                {focusedExhibit ? es.title(focusedExhibit) : ""}
              </p>
              <p className="truncate text-xs text-[#b8b2a4]">
                {focusedExhibit ? es.period(focusedExhibit) : ""}
              </p>
            </div>
            {focusedExhibit && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-white/20 bg-transparent text-[#b8b2a4]"
                >
                  {t.categories[focusedExhibit.category]}
                </Badge>
                <Button
                  size="sm"
                  className="min-h-9"
                  onClick={() => onOpenExhibit(focusedExhibit)}
                >
                  {t.gallery.open}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <CalmToggleRow calm={calm} onCalmToggle={onCalmToggle} compact />
      </div>
    </div>
  );
}

function CalmToggleRow({
  calm,
  onCalmToggle,
  compact,
}: {
  calm: boolean;
  onCalmToggle: () => void;
  compact?: boolean;
}) {
  const { t } = useLang();
  return (
    <div className={`flex ${compact ? "mt-2" : "mt-auto"} items-center justify-center`}>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="min-h-9 text-xs text-[#b8b2a4] hover:bg-white/5 hover:text-[#f7f3e9]"
        onClick={onCalmToggle}
        aria-pressed={calm}
      >
        <Armchair className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
        {calm ? t.gallery.motionOn : t.gallery.calmMode}
      </Button>
    </div>
  );
}

/* ================================================================== */
/* FILM — Ken Burns ogled z neobveznim TTS pripovedom                  */
/* ================================================================== */

type NarrationStatus = "off" | "loading" | "playing" | "error";

function FilmView({
  items,
  lang,
  reduceMotion,
  onOpenExhibit,
  onCalmToggle,
}: {
  items: ExhibitDTO[];
  lang: "sl" | "en";
  reduceMotion: boolean;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  onCalmToggle: () => void;
}) {
  const { t } = useLang();
  const es = useExhibitStrings();

  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const [finished, setFinished] = React.useState(false);
  const [narration, setNarration] = React.useState<NarrationStatus>("off");

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = React.useRef<string | null>(null);
  const totalChunksRef = React.useRef(1);
  const runIdRef = React.useRef(0);
  const advanceRef = React.useRef<() => void>(() => {});
  const playingRef = React.useRef(true);

  const exhibit = items[index];
  const narratable = exhibit ? hasMinuteStory(exhibit.slug) : false;

  const stopAudio = React.useCallback(() => {
    runIdRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const advance = React.useCallback(() => {
    setIndex((i) => {
      if (i + 1 < items.length) return i + 1;
      setFinished(true);
      setPlaying(false);
      return i;
    });
  }, [items.length]);

  React.useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  const playChunk = React.useCallback(
    (runId: number, chunk: number) => {
      const slug = items[index]?.slug;
      if (!slug) return;
      void (async () => {
        try {
          const res = await fetch(
            `/api/audio-guide?slug=${encodeURIComponent(slug)}&lang=${lang}&minute=1&chunk=${chunk}`
          );
          if (!res.ok) throw new Error("audio");
          if (runId !== runIdRef.current) return;
          totalChunksRef.current = Number(res.headers.get("X-Total-Chunks") ?? "1") || 1;
          const blob = await res.blob();
          if (runId !== runIdRef.current) return;
          const url = URL.createObjectURL(blob);
          if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = url;
          const audio = new Audio(url);
          audioRef.current = audio;
          setNarration("playing");
          audio.onended = () => {
            if (runId !== runIdRef.current) return;
            if (chunk + 1 < totalChunksRef.current) {
              playChunk(runId, chunk + 1);
            } else {
              advanceRef.current();
            }
          };
          audio.onerror = () => {
            if (runId !== runIdRef.current) return;
            setNarration("error");
          };
          if (playingRef.current) {
            await audio.play();
          }
        } catch {
          if (runId === runIdRef.current) setNarration("error");
        }
      })();
    },
    [items, index, lang]
  );

  // Predvajalna ura: brez zvoka časovnik; s pripovedjo vodi avdio (onended).
  React.useEffect(() => {
    if (!playing || finished || narration === "playing" || narration === "loading") return;
    const timer = window.setTimeout(advance, SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [playing, finished, narration, index, advance]);

  // Zrcaljenje stanja predvajanja v ref (pripoved se ne zažene med pavzo).
  React.useEffect(() => {
    playingRef.current = playing && !finished;
  }, [playing, finished]);

  // Vklop pripovedi ali nova sličica → naloži enominutno zgodbo.
  React.useEffect(() => {
    if (narration === "off" || !playing || finished) return;
    const runId = ++runIdRef.current;
    setNarration("loading");
    playChunk(runId, 0);
  }, [narration === "off", index]);

  // Izklop pripovedi → takoj ustavi.
  React.useEffect(() => {
    if (narration === "off") stopAudio();
  }, [narration, stopAudio]);

  // Pavza/nadaljevanje velja tudi za pripoved.
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing && !finished && narration !== "off") {
      void audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  }, [playing, finished, narration]);

  React.useEffect(() => stopAudio, [stopAudio]);

  const jump = (next: number) => {
    stopAudio();
    setFinished(false);
    setIndex(Math.max(0, Math.min(next, items.length - 1)));
  };

  const restart = () => {
    stopAudio();
    setIndex(0);
    setFinished(false);
    setPlaying(true);
  };

  const kb = KB_VARIANTS[index % KB_VARIANTS.length];
  const slideDuration = narration === "playing" || narration === "loading" ? 12 : SLIDE_MS / 1000;

  return (
    <div className="flex h-full flex-col bg-black">
      {/* Filmsko platno */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={`${exhibit?.slug ?? "none"}-${index}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.35 : 0.9, ease: "easeInOut" }}
          >
            {exhibit && (
              <motion.div
                className="absolute inset-0"
                initial={
                  reduceMotion
                    ? { scale: 1.02 }
                    : { scale: kb.scale[0], x: kb.x[0] }
                }
                animate={
                  reduceMotion
                    ? { scale: 1.02 }
                    : { scale: kb.scale[1], x: kb.x[1] }
                }
                transition={{ duration: slideDuration, ease: "linear" }}
              >
                <Image
                  src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                  alt={es.title(exhibit)}
                  fill
                  sizes="(max-width: 640px) 100vw, 960px"
                  className="object-cover"
                  priority
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Podnapisi: naslov + povzetek (zvok nikoli edini kanal) */}
        {exhibit && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-5 pb-6 pt-16"
            aria-live="polite"
          >
            <p className="font-display text-xl font-semibold sm:text-2xl">
              {es.title(exhibit)}
            </p>
            <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-white/70">
              {es.summary(exhibit)}
            </p>
          </div>
        )}

        <p className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs tabular-nums text-white/80">
          {index + 1} / {items.length} · {t.gallery.filmBadge}
        </p>

        {/* Zaključni zaslon */}
        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 px-6 text-center"
            >
              <p className="font-display text-2xl font-semibold">{t.gallery.filmEnd}</p>
              <p className="max-w-sm text-sm text-white/70">{t.gallery.filmEndSub}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                <Button className="min-h-11" onClick={restart}>
                  <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t.gallery.filmReplay}
                </Button>
                {exhibit && (
                  <Button
                    variant="outline"
                    className="min-h-11 border-white/25 bg-transparent text-[#f7f3e9] hover:bg-white/10"
                    onClick={() => onOpenExhibit(exhibit)}
                  >
                    {t.gallery.filmOpenLast}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vrstica s nadzorom */}
      <div className="border-t border-white/10 px-4 py-3 sm:px-6">
        {/* Segmente: klik = skok na posnetek */}
        <div
          role="tablist"
          aria-label={t.gallery.filmProgress}
          className="flex items-center gap-1"
        >
          {items.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${t.gallery.jumpTo}: ${es.title(item)}`}
              onClick={() => jump(i)}
              className="h-1.5 min-w-4 flex-1 overflow-hidden rounded-full bg-white/15 transition-colors hover:bg-white/30"
            >
              <span
                className={`block h-full rounded-full ${
                  i < index ? "w-full bg-primary/70" : i === index ? "w-1/2 bg-primary" : "w-0"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="size-10 border-white/20 bg-transparent text-[#f7f3e9] hover:bg-white/10"
              onClick={() => jump(index - 1)}
              disabled={index === 0}
              aria-label={t.gallery.prev}
            >
              <SkipBack className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              className="size-11"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? t.gallery.pause : t.gallery.play}
            >
              {playing ? (
                <Pause className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Play className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-10 border-white/20 bg-transparent text-[#f7f3e9] hover:bg-white/10"
              onClick={() => jump(index + 1)}
              disabled={index === items.length - 1}
              aria-label={t.gallery.next}
            >
              <SkipForward className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {narratable && (
              <Button
                size="sm"
                variant="outline"
                className="min-h-9 border-white/20 bg-transparent text-[#f7f3e9] hover:bg-white/10"
                onClick={() => {
                  setNarration((prev) => (prev === "off" ? "loading" : "off"));
                  setPlaying(true);
                  setFinished(false);
                }}
                aria-pressed={narration !== "off"}
                aria-label={t.gallery.narrationLabel}
              >
                {narration === "loading" ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Headphones className="mr-1.5 h-4 w-4" aria-hidden="true" />
                )}
                {narration === "off"
                  ? t.gallery.narrationOff
                  : narration === "error"
                    ? t.audio.error
                    : t.gallery.narrationOn}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="min-h-9 text-xs text-[#b8b2a4] hover:bg-white/5 hover:text-[#f7f3e9]"
              onClick={onCalmToggle}
              aria-pressed={reduceMotion}
            >
              <Armchair className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              {reduceMotion ? t.gallery.motionOn : t.gallery.calmMode}
            </Button>
          </div>
        </div>

        {narration === "playing" && (
          <p className="mt-2 text-[10px] italic text-[#b8b2a4]">{t.audio.note}</p>
        )}
      </div>
    </div>
  );
}
