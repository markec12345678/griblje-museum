"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Crop,
  Gamepad2,
  Mail,
  Network,
  Puzzle,
  Search,
  Timer,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { normalize } from "@/lib/normalize";
import { MuseumQuiz } from "@/components/museum/museum-quiz";
import type { ExhibitDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

/** Igra, ki za zagon potrebuje izbran zapis. */
type PickableGame = "puzzle" | "slow" | "postcard" | "detail";

/**
 * Igre muzeja — hub vseh igralnih dejanj na enem mestu.
 *
 * Vzorec: rubrika Play / The Lab (Google Arts & Culture), kjer se
 * igre z zbirko seštevajo v lasten vhod. Pred tem so bile igre tega
 * muzeja raztresene: uganka na domači strani, sestavljanke, razglednice
 * in detajl v posameznih zapisih, povezovanje v zbirki. Hub jih poveže
 * — in prizna, da se muzej da igrati.
 */
export function GamesView({
  exhibits,
  onOpenExhibit,
  onConnect,
  onPuzzle,
  onSlow,
  onPostcard,
  onDetail,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  /** Poveži zbirko — odpre orodje za iskanje poti med dvema zapisoma. */
  onConnect: () => void;
  onPuzzle: (exhibit: ExhibitDTO) => void;
  onSlow: (exhibit: ExhibitDTO) => void;
  onPostcard: (exhibit: ExhibitDTO) => void;
  onDetail: (exhibit: ExhibitDTO) => void;
}) {
  const { t } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  // Izbirnik zapisa za igre, ki potrebujejo sliko zapisa.
  const [pickerFor, setPickerFor] = React.useState<PickableGame | null>(null);
  const [query, setQuery] = React.useState("");
  const pickerOpen = pickerFor !== null;

  const filtered = React.useMemo(() => {
    const q = normalize(query);
    if (!q) return exhibits;
    return exhibits.filter(
      (ex) =>
        normalize(es.title(ex)).includes(q) ||
        normalize(ex.periodSi).includes(q) ||
        normalize(ex.periodEn).includes(q)
    );
  }, [exhibits, query, es]);

  const pick = (exhibit: ExhibitDTO) => {
    const kind = pickerFor;
    setPickerFor(null);
    setQuery("");
    if (kind === "puzzle") onPuzzle(exhibit);
    else if (kind === "slow") onSlow(exhibit);
    else if (kind === "postcard") onPostcard(exhibit);
    else if (kind === "detail") onDetail(exhibit);
  };

  const pickerTitle =
    pickerFor === "puzzle"
      ? t.games.puzzleTitle
      : pickerFor === "slow"
        ? t.games.slowTitle
        : pickerFor === "postcard"
          ? t.games.postcardTitle
          : t.games.detailTitle;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Uvod */}
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {t.games.kicker}
        </p>
        <h1 className="font-display mt-2 flex items-center gap-3 text-4xl font-semibold sm:text-5xl">
          <Gamepad2 className="h-8 w-8 text-primary" aria-hidden="true" />
          {t.games.title}
        </h1>
        <p className="mt-3 text-muted-foreground">{t.games.subtitle}</p>
      </div>

      <div className="mt-6 rounded-xl border border-border/70 bg-card p-5">
        <h2 className="font-display text-lg font-semibold">{t.games.introTitle}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
          {t.games.introText}
        </p>
      </div>

      {/* Muzejska uganka — celoten kviz kar tukaj */}
      <section className="mt-8" aria-labelledby="igre-uganka">
        <MuseumQuiz exhibits={exhibits} onOpenExhibit={onOpenExhibit} />
      </section>

      {/* Ostale igre — kartice */}
      <section className="mt-10" aria-labelledby="druge-igre">
        <h2
          id="druge-igre"
          className="font-display text-2xl font-semibold"
        >
          {t.games.otherTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t.games.otherSub}
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Sestavljanke */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35 }}
            className="flex flex-col rounded-xl border border-border/70 bg-card p-5"
          >
            <h3 className="font-display flex items-center gap-2 text-lg font-semibold">
              <Puzzle className="h-5 w-5 text-primary" aria-hidden="true" />
              {t.games.puzzleTitle}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {t.games.puzzleText}
            </p>
            <Button
              className="mt-4 min-h-11"
              onClick={() => setPickerFor("puzzle")}
              disabled={exhibits.length === 0}
            >
              <Puzzle className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.games.play}
            </Button>
          </motion.div>

          {/* Poveži zbirko */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex flex-col rounded-xl border border-border/70 bg-card p-5"
          >
            <h3 className="font-display flex items-center gap-2 text-lg font-semibold">
              <Network className="h-5 w-5 text-primary" aria-hidden="true" />
              {t.games.connectTitle}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {t.games.connectText}
            </p>
            <Button
              variant="outline"
              className="mt-4 min-h-11"
              onClick={onConnect}
              disabled={exhibits.length === 0}
            >
              <Network className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.games.play}
            </Button>
          </motion.div>

          {/* Počasno gledanje */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex flex-col rounded-xl border border-border/70 bg-card p-5"
          >
            <h3 className="font-display flex items-center gap-2 text-lg font-semibold">
              <Timer className="h-5 w-5 text-primary" aria-hidden="true" />
              {t.games.slowTitle}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {t.games.slowText}
            </p>
            <Button
              variant="outline"
              className="mt-4 min-h-11"
              onClick={() => setPickerFor("slow")}
              disabled={exhibits.length === 0}
            >
              <Timer className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.games.play}
            </Button>
          </motion.div>

          {/* Razglednice */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="flex flex-col rounded-xl border border-border/70 bg-card p-5"
          >
            <h3 className="font-display flex items-center gap-2 text-lg font-semibold">
              <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
              {t.games.postcardTitle}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {t.games.postcardText}
            </p>
            <Button
              variant="outline"
              className="mt-4 min-h-11"
              onClick={() => setPickerFor("postcard")}
              disabled={exhibits.length === 0}
            >
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.games.play}
            </Button>
          </motion.div>

          {/* Izreži detajl */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="flex flex-col rounded-xl border border-border/70 bg-card p-5"
          >
            <h3 className="font-display flex items-center gap-2 text-lg font-semibold">
              <Crop className="h-5 w-5 text-primary" aria-hidden="true" />
              {t.games.detailTitle}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {t.games.detailText}
            </p>
            <Button
              variant="outline"
              className="mt-4 min-h-11"
              onClick={() => setPickerFor("detail")}
              disabled={exhibits.length === 0}
            >
              <Crop className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.games.play}
            </Button>
          </motion.div>

          {/* Namig: vse dejanje so v vsakem zapisu */}
          <div className="flex flex-col justify-center rounded-xl border border-dashed border-border/70 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t.games.perExhibitNote}
            </p>
          </div>
        </div>
      </section>

      {/* Izbirnik zapisa za igro */}
      <Dialog
        open={pickerOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPickerFor(null);
            setQuery("");
          }
        }}
      >
        <DialogContent className="max-h-[85vh] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t.games.pickTitle} — {pickerTitle}
            </DialogTitle>
            <DialogDescription>{t.games.pickSub}</DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.games.pickPlaceholder}
              className="pl-9"
              aria-label={t.games.pickPlaceholder}
            />
          </div>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {t.games.pickCount(filtered.length)}
          </p>
          <ul className="museum-scroll -mx-1 max-h-96 overflow-y-auto px-1">
            {filtered.map((ex) => (
              <li key={ex.slug}>
                <button
                  type="button"
                  onClick={() => pick(ex)}
                  className="group flex w-full items-center gap-3 rounded-lg border border-transparent p-2 text-left transition-colors hover:border-primary/40 hover:bg-card"
                >
                  <span className="relative block size-12 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={ex.image ?? "/images/authentic/hero-griblje.jpg"}
                      alt={es.title(ex)}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {es.title(ex)}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {es.period(ex)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-2 py-6 text-center text-sm text-muted-foreground">
                {t.games.pickEmpty}
              </li>
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
