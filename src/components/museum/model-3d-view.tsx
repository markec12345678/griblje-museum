"use client";

import * as React from "react";
import { Box, Loader2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { trackStat } from "@/lib/stats-client";
import type { ExhibitDTO } from "@/lib/types";

/**
 * 3D-ogled zapisa — spletni gradnik <model-viewer> (Google) z vgrajeno
 * podporo AR: na Androidu Scene Viewer (GLB), na iOS Quick Look (USDZ).
 *
 * Digitalizacija enot kulturne dediščine po merilih razpisov (MGTŠ 3.2:
 * 3D-modeli + rešitve digitalne interpretacije; Interreg SI-HR: čezmejna
 * dostopnost). Skript (~250 KB) se naloži šele, ko obiskovalec odpre 3D.
 */

let modelViewerLoading: Promise<void> | null = null;

function ensureModelViewer(): Promise<void> {
  if (!modelViewerLoading) {
    modelViewerLoading = import("@google/model-viewer").then(() => undefined);
  }
  return modelViewerLoading;
}

export function Model3DView({ exhibit }: { exhibit: ExhibitDTO }) {
  const { t, lang } = useLang();
  const hostRef = React.useRef<HTMLElement | null>(null);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    setFailed(false);
    ensureModelViewer()
      .then(() => {
        if (alive) setReady(true);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Začetek AR-seje zabeležimo v statistiko (kazalnik razpisa: AR-ogledi).
  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onArStatus = (event: Event) => {
      const detail = (event as CustomEvent<{ status?: string }>).detail;
      if (detail?.status === "session-started") {
        trackStat("ar", exhibit.slug, lang);
      }
    };
    host.addEventListener("ar-status", onArStatus as EventListener);
    return () => host.removeEventListener("ar-status", onArStatus as EventListener);
  }, [exhibit.slug, lang, ready]);

  const src = exhibit.model3dUrl!;
  // USDZ (iOS Quick Look) izvedemo iz istega imena datoteke.
  const iosSrc = src.endsWith(".glb") ? src.replace(/\.glb$/, ".usdz") : undefined;

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-card p-6 text-center">
        <p className="max-w-xs text-sm text-muted-foreground">{t.model3d.failed}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">{t.model3d.loading}</p>
        <span className="sr-only" role="status">
          {t.model3d.loading}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-card">
      <model-viewer
        ref={hostRef as React.Ref<HTMLElement>}
        src={src}
        ios-src={iosSrc}
        alt={`${t.model3d.altPrefix} — ${exhibit.titleSi}`}
        camera-controls
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
        touch-action="pan-y"
        auto-rotate
        rotation-per-second="18deg"
        shadow-intensity="1"
        shadow-softness="0.8"
        camera-orbit="35deg 72deg auto"
        field-of-view="32deg"
        interaction-prompt="auto"
        environment-image="neutral"
        className="h-full w-full"
      />
      <p className="pointer-events-none absolute bottom-3 left-4 right-4 text-center text-[11px] leading-snug text-foreground/70">
        {t.model3d.hint}
      </p>
    </div>
  );
}

/** Gumb za preklop v 3D-ogled (v vrstici z orodji slike zapisa). */
export function Model3DToggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  const { t } = useLang();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      title={t.model3d.open}
      className="flex min-h-11 items-center gap-1.5 rounded-md px-3 text-xs font-semibold uppercase tracking-wide text-foreground/85 transition-colors hover:bg-background/85 hover:text-foreground"
    >
      <Box className="h-4 w-4" aria-hidden="true" />
      <span>3D</span>
      <span className="sr-only">{active ? t.model3d.close : t.model3d.open}</span>
    </button>
  );
}
