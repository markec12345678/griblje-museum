"use client";

import * as React from "react";
import { Headphones, Loader2, Square } from "lucide-react";
import { useLang } from "@/lib/i18n";
import type { ExhibitDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";

/**
 * Avdio vodnik — sintetizirana pripoved (TTS) po zgledu vodilnih muzejskih
 * aplikacij. Posnetek je vedno označen kot sintetiziran: muzejska iskrenost
 * prepoveduje zamenjavo z avtentičnim pričevanjem.
 *
 * variant="minute" predvaja enominutno zgodbo (Muzej v minuti, vzorec
 * One Minute Wonders) namesto celotnega vodnika.
 */

type Status = "idle" | "loading" | "buffering" | "playing" | "error";

export function AudioGuide({
  exhibit,
  variant = "full",
}: {
  exhibit: ExhibitDTO;
  variant?: "full" | "minute";
}) {
  const { t, lang } = useLang();
  const [status, setStatus] = React.useState<Status>("idle");
  const [progress, setProgress] = React.useState({ chunk: 0, total: 1 });

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = React.useRef<string | null>(null);
  const prefetchRef = React.useRef<Promise<Blob | null> | null>(null);
  const runIdRef = React.useRef(0);
  const totalRef = React.useRef(1);
  const advanceRef = React.useRef<(chunk: number, runId: number) => void>(
    () => {}
  );

  /** Počisti trenutni posnetek in predpomnilnik. */
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
    prefetchRef.current = null;
    totalRef.current = 1;
    setProgress({ chunk: 0, total: 1 });
    setStatus("idle");
  }, []);

  /* Ustavi predvajanje ob razmontaži, zamenjavi zapisa ali jezika. */
  React.useEffect(() => stop, [stop]);
  React.useEffect(() => {
    stop();
  }, [stop, exhibit.slug, lang, variant]);

  const fetchChunk = React.useCallback(
    async (chunk: number): Promise<Blob | null> => {
      try {
        const res = await fetch(
          `/api/audio-guide?slug=${encodeURIComponent(
            exhibit.slug
          )}&lang=${lang}${variant === "minute" ? "&minute=1" : ""}&chunk=${chunk}`
        );
        if (!res.ok) return null;
        const total = Number(res.headers.get("X-Total-Chunks") ?? "1");
        if (Number.isFinite(total) && total > 0) totalRef.current = total;
        return await res.blob();
      } catch {
        return null;
      }
    },
    [exhibit.slug, lang, variant]
  );

  const playBlob = React.useCallback(
    (blob: Blob, chunk: number, runId: number) => {
      if (runId !== runIdRef.current) return;

      const total = totalRef.current;
      const url = URL.createObjectURL(blob);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;
      setProgress({ chunk, total });
      setStatus("playing");

      audio.onended = () => {
        if (runId !== runIdRef.current) return;
        if (chunk + 1 < total) {
          setStatus("buffering");
          advanceRef.current(chunk + 1, runId);
        } else {
          stop();
        }
      };
      audio.onerror = () => {
        if (runId !== runIdRef.current) return;
        setStatus("error");
      };
      void audio.play().catch(() => {
        if (runId === runIdRef.current) setStatus("error");
      });

      /* Med predvajanjem tiho prenesi naslednji odsek. */
      if (chunk + 1 < total) {
        prefetchRef.current = fetchChunk(chunk + 1);
      }
    },
    [fetchChunk, stop]
  );

  const advance = React.useCallback(
    (chunk: number, runId: number) => {
      void (async () => {
        if (runId !== runIdRef.current) return;

        /* Porabi predpomnjen odsek, če obstaja. */
        let blob: Blob | null = null;
        const prefetched = prefetchRef.current;
        prefetchRef.current = null;
        if (chunk > 0 && prefetched) {
          blob = await prefetched;
        }
        if (runId !== runIdRef.current) return;

        if (!blob) {
          blob = await fetchChunk(chunk);
        }
        if (runId !== runIdRef.current) return;

        if (!blob) {
          setStatus("error");
          return;
        }
        playBlob(blob, chunk, runId);
      })();
    },
    [fetchChunk, playBlob]
  );

  React.useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  const start = React.useCallback(() => {
    void (async () => {
      const runId = ++runIdRef.current;
      setStatus("loading");
      const blob = await fetchChunk(0);
      if (runId !== runIdRef.current) return;
      if (!blob) {
        setStatus("error");
        return;
      }
      playBlob(blob, 0, runId);
    })();
  }, [fetchChunk, playBlob]);

  const busy = status === "loading" || status === "buffering";
  const playing = status === "playing" || busy;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant={playing ? "secondary" : "default"}
          size="lg"
          className="min-h-11"
          aria-pressed={playing}
          aria-label={
            playing
              ? t.audio.stop
              : variant === "minute"
                ? `${t.minute.play} — ${t.audio.noteShort}`
                : `${t.audio.play} — ${t.audio.noteShort}`
          }
          onClick={() => {
            if (playing) stop();
            else start();
          }}
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : playing ? (
            <Square className="mr-2 h-4 w-4" aria-hidden="true" />
          ) : (
            <Headphones className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          {playing ? t.audio.stop : variant === "minute" ? t.minute.play : t.audio.play}
        </Button>

        {status === "playing" && progress.total > 1 && (
          <>
            <span className="flex items-end gap-[3px]" aria-hidden="true">
              {[0, 1, 2, 3].map((bar) => (
                <span
                  key={bar}
                  className="w-[3px] rounded-full bg-primary motion-safe:animate-[eq_1.2s_ease-in-out_infinite]"
                  style={{ height: "10px", animationDelay: `${bar * 0.18}s` }}
                />
              ))}
            </span>
            <span className="text-xs text-muted-foreground">
              {t.audio.part} {progress.chunk + 1}/{progress.total}
            </span>
          </>
        )}
      </div>

      <p className="mt-2 text-xs italic text-muted-foreground">
        {status === "error" ? t.audio.error : t.audio.note}
      </p>

      <span className="sr-only" role="status" aria-live="polite">
        {status === "loading" || status === "buffering"
          ? t.audio.loading
          : status === "playing"
            ? t.audio.playing
            : status === "error"
              ? t.audio.error
              : ""}
      </span>
    </div>
  );
}
