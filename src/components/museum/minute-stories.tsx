"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Headphones, Loader2, Play, Square } from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { MINUTE_STORIES, getMinuteStory } from "@/lib/minute-stories";
import { browserSpeechSupported, speakBrowser } from "@/lib/browser-speech";
import type { ExhibitDTO } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

/**
 * Muzej v minuti — enominutne zgodbe na domači strani.
 *
 * Vzorec: »One Minute Wonders« muzejev Brighton & Hove: najkrajša
 * možna oblika muzejske pripovedi, ena minuta na zapis. Izbor treh
 * zgodb se dnevno obrne (deterministično, brez strežnika); poslušanje
 * in prepis sta skupaj dostopna tudi brez zvoka.
 */

/** Dnevni izbor treh zgodb — sosednji dnevi pomenijo drug trikotnik. */
function pickDailyStoryIndexes(total: number, count: number): number[] {
  if (total <= 0) return [];
  const dayNumber = Math.floor(
    Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ) / 86_400_000
  );
  const start = ((dayNumber * 7 + 3) % total + total) % total;
  return Array.from({ length: Math.min(count, total) }, (_, i) =>
    (start + i * Math.max(1, Math.floor(total / Math.min(count, total)))) % total
  );
}

type PlayerStatus = "idle" | "loading" | "playing" | "error";

function MinutePlayer({
  slug,
  onEnded,
}: {
  slug: string;
  onEnded?: () => void;
}) {
  const { t, lang } = useLang();
  const [status, setStatus] = React.useState<PlayerStatus>("idle");
  const [deviceVoice, setDeviceVoice] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = React.useRef<string | null>(null);
  const speechRef = React.useRef<{ cancel: () => void } | null>(null);
  const runIdRef = React.useRef(0);

  const stop = React.useCallback(() => {
    runIdRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (speechRef.current) {
      speechRef.current.cancel();
      speechRef.current = null;
    }
    setDeviceVoice(false);
    setStatus("idle");
  }, []);

  React.useEffect(() => stop, [stop]);
  React.useEffect(() => {
    stop();
  }, [stop, slug, lang]);

  /** Strežniška sinteza je padla — zgodbo preberi z glasom naprave. */
  const fallbackToDeviceSpeech = React.useCallback(
    (runId: number) => {
      if (!browserSpeechSupported()) {
        setStatus("error");
        return;
      }
      const story = getMinuteStory(slug);
      const text = story
        ? lang === "en"
          ? story.textEn
          : story.textSi
        : "";
      if (!text) {
        setStatus("error");
        return;
      }
      setStatus("playing");
      setDeviceVoice(true);
      speechRef.current?.cancel();
      // Hrvaški uporabnik posluša slovensko vsebino (razumljivost ob Kolpi).
      void speakBrowser(text, lang === "en" ? "en" : "sl", {
        onEnd: () => {
          if (runId !== runIdRef.current) return;
          stop();
          onEnded?.();
        },
        onError: () => {
          if (runId !== runIdRef.current) return;
          speechRef.current = null;
          setDeviceVoice(false);
          setStatus("error");
        },
      }).then((handle) => {
        if (runId !== runIdRef.current) {
          handle.cancel();
          return;
        }
        speechRef.current = handle;
      });
    },
    [slug, lang, stop, onEnded]
  );

  const start = React.useCallback(() => {
    void (async () => {
      const runId = ++runIdRef.current;
      setStatus("loading");
      try {
        const res = await fetch(
          `/api/audio-guide?slug=${encodeURIComponent(slug)}&lang=${
            lang === "en" ? "en" : "sl"
          }&minute=1`
        );
        if (!res.ok) throw new Error("minute audio failed");
        const blob = await res.blob();
        if (runId !== runIdRef.current) return;
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        setStatus("playing");
        audio.onended = () => {
          if (runId !== runIdRef.current) return;
          stop();
          onEnded?.();
        };
        audio.onerror = () => {
          if (runId !== runIdRef.current) return;
          setStatus("error");
        };
        await audio.play().catch(() => {
          if (runId === runIdRef.current) setStatus("error");
        });
      } catch {
        if (runId === runIdRef.current) fallbackToDeviceSpeech(runId);
      }
    })();
  }, [slug, lang, stop, onEnded, fallbackToDeviceSpeech]);

  const playing = status === "playing" || status === "loading";

  return (
    <div>
      <Button
        type="button"
        size="sm"
        variant={playing ? "secondary" : "default"}
        className="min-h-11"
        aria-pressed={playing}
        onClick={() => (playing ? stop() : start())}
      >
        {status === "loading" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        ) : playing ? (
          <Square className="mr-2 h-4 w-4" aria-hidden="true" />
        ) : (
          <Play className="mr-2 h-4 w-4" aria-hidden="true" />
        )}
        {playing ? t.audio.stop : t.minute.play}
      </Button>
      {status === "error" && (
        <p className="mt-2 text-xs text-muted-foreground">{t.audio.error}</p>
      )}
      {deviceVoice && (
        <p className="mt-2 text-xs text-muted-foreground">
          {t.audio.deviceVoice}
        </p>
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {status === "loading"
          ? t.audio.loading
          : status === "playing"
            ? t.audio.playing
            : ""}
      </span>
    </div>
  );
}

export function MinuteStories({
  exhibits,
  onOpenExhibit,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  // Zgodbe, katerih zapis je prispel s strežnika.
  const available = React.useMemo(
    () =>
      MINUTE_STORIES.map((story, index) => ({
        story,
        index,
        exhibit: exhibits.find((ex) => ex.slug === story.slug),
      })).filter((entry) => entry.exhibit != null),
    [exhibits]
  );

  const daily = React.useMemo(() => {
    const indexes = pickDailyStoryIndexes(available.length, 3);
    return indexes
      .map((i) => available[i])
      .filter((entry): entry is NonNullable<typeof entry> => entry != null);
  }, [available]);

  const [openTranscript, setOpenTranscript] = React.useState<string | null>(null);

  if (daily.length === 0) return null;

  return (
    <section
      aria-labelledby="muzej-v-minuti"
      className="border-y border-border bg-card"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
            <Headphones className="h-4 w-4" aria-hidden="true" />
            {t.minute.kicker}
          </p>
          <h2
            id="muzej-v-minuti"
            className="font-display mt-2 text-3xl font-semibold sm:text-4xl"
          >
            {t.minute.title}
          </h2>
          <p className="mt-2 text-muted-foreground">{t.minute.subtitle}</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {daily.map(({ story, exhibit }, i) => (
            <motion.article
              key={story.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col overflow-hidden rounded-xl border border-border/70 bg-background shadow-sm"
            >
              <button
                type="button"
                onClick={() => onOpenExhibit(exhibit!)}
                className="group relative aspect-[16/10] overflow-hidden text-left"
                aria-label={`${t.collection.openRecord}: ${es.title(exhibit!)}`}
              >
                <Image
                  src={exhibit!.image ?? "/images/authentic/hero-griblje.jpg"}
                  alt={es.title(exhibit!)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-3 top-3">
                  <Badge className="border-border/60 bg-background/85 text-foreground backdrop-blur-sm">
                    ≈ 1 min
                  </Badge>
                </span>
              </button>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="secondary">{t.categories[exhibit!.category]}</Badge>
                  <EvidenceBadge status={exhibit!.evidenceStatus} />
                </div>
                <h3 className="font-display text-xl font-semibold leading-snug">
                  {es.title(exhibit!)}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {pick(lang, story.textSi, story.textEn)}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                  <MinutePlayer slug={story.slug} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="min-h-11"
                    onClick={() =>
                      setOpenTranscript((cur) => (cur === story.slug ? null : story.slug))
                    }
                    aria-expanded={openTranscript === story.slug}
                  >
                    <ChevronDown className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    {t.minute.transcript}
                  </Button>
                </div>
                {openTranscript === story.slug && (
                  <p className="rounded-lg bg-muted/60 p-3 text-sm leading-relaxed text-foreground/90">
                    {pick(lang, story.textSi, story.textEn)}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Ali ima zapis enominutno zgodbo (za gumb v dialogu zapisa). */
export function hasMinuteStory(slug: string): boolean {
  return getMinuteStory(slug) != null;
}
