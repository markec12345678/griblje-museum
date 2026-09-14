"use client";

import * as React from "react";
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

/**
 * Približevalni ogled slike zapisa (deep zoom).
 *
 * Vzorec: Rijksmuseum ( »Operation Night Watch« — 717-gigapikselski
 * približek) in Google Arts & Culture (Zoom Views, kamera Art).
 * Knjižnica OpenSeadragon se naloži šele, ko uporabnik približevalni
 * ogled dejansko odpre (dinamični uvoz), zato običajen ogled strani
 * ne nosi stroška.
 */

type Viewer = import("openseadragon").Viewer;

export function DeepZoom({ src, alt }: { src: string; alt: string }) {
  const { t } = useLang();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const viewerRef = React.useRef<Viewer | null>(null);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setReady(false);
    setFailed(false);
    import("openseadragon")
      .then((mod) => {
        if (cancelled || !containerRef.current) return;
        viewerRef.current = mod.default({
          element: containerRef.current,
          tileSources: {
            type: "image",
            url: src,
          },
          // Lastiti nadzorni gumbi namesto privzetih (privzeti potrebujejo
          // ikone s CDN) — uporabniški vmesnik je spodaj.
          showNavigationControl: false,
          showNavigator: false,
          visibilityRatio: 1,
          constrainDuringPan: true,
          minZoomImageRatio: 0.9,
          // Dovolimo približek tudi prek naravne ločljivosti (kot pri
          // gigapikselnih ogledih) — do 5-krat, da podrobnosti pridejo
          // do veljavnosti, ne pa neskončno.
          maxZoomPixelRatio: 5,
          gestureSettingsMouse: {
            scrollToZoom: true,
            clickToZoom: false,
            dblClickToZoom: true,
          },
          gestureSettingsTouch: {
            scrollToZoom: false,
            clickToZoom: false,
            dblClickToZoom: true,
            pinchToZoom: true,
            flickEnabled: true,
          },
        });
        setReady(true);
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [src]);

  // Stanje celozaslonskega ogleda (gumb preklopi ikono).
  React.useEffect(() => {
    const onFsChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const zoomBy = (factor: number) => {
    viewerRef.current?.viewport?.zoomBy(factor);
  };
  const resetView = () => {
    viewerRef.current?.viewport?.goHome();
  };
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }
    } catch {
      /* brskalnik celozaslonskega ogleda ne dovoli — nič hudega */
    }
  };

  return (
    <div className="absolute inset-0 bg-black">
      <div
        ref={containerRef}
        role="region"
        aria-label={`${t.zoom.regionLabel}: ${alt}`}
        className="museum-deep-zoom h-full w-full"
      />

      {/* Nalaganje / napaka */}
      {!ready && !failed && (
        <p
          aria-live="polite"
          className="absolute inset-0 flex items-center justify-center text-sm text-foreground/70"
        >
          {t.zoom.loading}
        </p>
      )}
      {failed && (
        <p
          aria-live="polite"
          className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-foreground/70"
        >
          {t.zoom.failed}
        </p>
      )}

      {/* Namig za upravljanje (izgine po prvem kliku/pomiku) */}
      {ready && (
        <p className="pointer-events-none absolute inset-x-0 bottom-16 mx-auto w-fit rounded-full bg-background/80 px-3.5 py-1.5 text-[11px] text-foreground/75 backdrop-blur-sm">
          {t.zoom.hint}
        </p>
      )}

      {/* Lastiti gumbi — tipkovno dostopni, minimalne dotikalne površine */}
      <div
        role="group"
        aria-label={t.zoom.controlsLabel}
        className="absolute bottom-3 right-3 flex gap-1.5 rounded-lg border border-border/60 bg-background/85 p-1 backdrop-blur-sm"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11"
          aria-label={t.zoom.zoomIn}
          title={t.zoom.zoomIn}
          onClick={() => zoomBy(1.4)}
        >
          <ZoomIn className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11"
          aria-label={t.zoom.zoomOut}
          title={t.zoom.zoomOut}
          onClick={() => zoomBy(1 / 1.4)}
        >
          <ZoomOut className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11"
          aria-label={t.zoom.reset}
          title={t.zoom.reset}
          onClick={resetView}
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11"
          aria-label={fullscreen ? t.zoom.exitFullscreen : t.zoom.fullscreen}
          title={fullscreen ? t.zoom.exitFullscreen : t.zoom.fullscreen}
          onClick={() => void toggleFullscreen()}
        >
          {fullscreen ? (
            <Minimize2 className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Maximize2 className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}
