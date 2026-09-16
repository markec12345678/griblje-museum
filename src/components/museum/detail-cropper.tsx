"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Crop, Plus, RotateCcw, Scissors } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { addDetail, detailId } from "@/lib/detail-tracker";
import { trackStat } from "@/lib/stats-client";
import { imageDimensions } from "@/lib/image-dimensions";
import type { ExhibitDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Izreži detajl — obiskovalec sam izbere del slike zapisa in ga
 * shrani v Mojo zbirko.
 *
 * Vzorec: Rijksmuseum Rijksstudio »Collect a detail« (obiskovalec
 * velikega muzeja izreže svoj priljubljeni detajl Nočne straže ali
 * kakšnega drugega dela). Dejanje je tu enako kot tam: pogled v
 * podrobnost, ki jo vidiš TI — muzej pa si jo zapomni.
 *
 * Dostopnost: izbiro je mogoče narediti tudi samo s tipkovnico
 * (puščice premikajo, plus/minus povečata, Delete počisti);
 * ročaji so vsaj 44 × 44 px za dotik.
 */

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

type DragMode =
  | { kind: "none" }
  | { kind: "new"; originX: number; originY: number }
  | { kind: "move"; grabX: number; grabY: number; start: Rect }
  | { kind: "resize"; corner: "nw" | "ne" | "sw" | "se"; anchorX: number; anchorY: number };

const MIN_SIZE = 0.08;
const MOVE_STEP = 0.01;
const MOVE_STEP_LARGE = 0.05;
const GROW_STEP = 0.02;

function clampRect(r: Rect): Rect {
  const w = Math.min(Math.max(r.w, MIN_SIZE), 1);
  const h = Math.min(Math.max(r.h, MIN_SIZE), 1);
  return {
    w,
    h,
    x: Math.min(Math.max(r.x, 0), 1 - w),
    y: Math.min(Math.max(r.y, 0), 1 - h),
  };
}

export function DetailCropper({
  exhibit,
  onClose,
}: {
  exhibit: ExhibitDTO | null;
  onClose: () => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const open = exhibit !== null;

  const src = exhibit?.image ?? "/images/authentic/hero-griblje.jpg";
  const { width: naturalWidth, height: naturalHeight } = imageDimensions(src);

  const [sel, setSel] = React.useState<Rect | null>(null);
  const [saved, setSaved] = React.useState(false);
  const dragRef = React.useRef<DragMode>({ kind: "none" });
  const imageBoxRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setSel(null);
    setSaved(false);
    dragRef.current = { kind: "none" };
  }, [exhibit?.slug]);

  /** Pretvori dogodek kazalca v ulomke prikazane slike (0–1). */
  const toFractions = (clientX: number, clientY: number): { fx: number; fy: number } | null => {
    const box = imageBoxRef.current?.getBoundingClientRect();
    if (!box || box.width === 0 || box.height === 0) return null;
    return {
      fx: Math.min(Math.max((clientX - box.left) / box.width, 0), 1),
      fy: Math.min(Math.max((clientY - box.top) / box.height, 0), 1),
    };
  };

  const onPointerDownBox = (event: React.PointerEvent<HTMLDivElement>) => {
    if (saved) return;
    const f = toFractions(event.clientX, event.clientY);
    if (!f) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // sintetični/zrajteni kazalci brez zajema — vlečenje dela tudi brez
    }
    const insideSel =
      !!sel &&
      f.fx >= sel.x && f.fx <= sel.x + sel.w && f.fy >= sel.y && f.fy <= sel.y + sel.h;
    if (insideSel && sel) {
      dragRef.current = { kind: "move", grabX: f.fx - sel.x, grabY: f.fy - sel.y, start: sel };
    } else {
      dragRef.current = { kind: "new", originX: f.fx, originY: f.fy };
      setSel(clampRect({ x: f.fx, y: f.fy, w: MIN_SIZE, h: MIN_SIZE }));
    }
  };

  const onPointerMoveBox = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag.kind === "none" || !sel || saved) return;
    const f = toFractions(event.clientX, event.clientY);
    if (!f) return;
    if (drag.kind === "new") {
      setSel(
        clampRect({
          x: Math.min(drag.originX, f.fx),
          y: Math.min(drag.originY, f.fy),
          w: Math.abs(f.fx - drag.originX),
          h: Math.abs(f.fy - drag.originY),
        })
      );
    } else if (drag.kind === "move") {
      setSel(clampRect({ ...drag.start, x: f.fx - drag.grabX, y: f.fy - drag.grabY }));
    } else if (drag.kind === "resize") {
      setSel(
        clampRect({
          x: Math.min(drag.anchorX, f.fx),
          y: Math.min(drag.anchorY, f.fy),
          w: Math.abs(f.fx - drag.anchorX),
          h: Math.abs(f.fy - drag.anchorY),
        })
      );
    }
  };

  const onPointerUpBox = () => {
    dragRef.current = { kind: "none" };
  };

  const onHandleDown = (corner: "nw" | "ne" | "sw" | "se") => (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!sel || saved) return;
    event.stopPropagation();
    event.preventDefault();
    // Sidro je diagonalno nasprotni vogal izbire.
    const anchorX = corner === "nw" || corner === "sw" ? sel.x + sel.w : sel.x;
    const anchorY = corner === "nw" || corner === "ne" ? sel.y + sel.h : sel.y;
    dragRef.current = { kind: "resize", corner, anchorX, anchorY };
    try {
      (event.currentTarget.parentElement ?? event.currentTarget).setPointerCapture?.(event.pointerId);
    } catch {
      // sintetični kazalci brez zajema — vlečenje ročaja dela tudi brez
    }
  };

  /** Tipkovnica: puščice premikajo, plus/minus spreminjata velikost. */
  const onKeyDownBox = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!sel || saved) return;
    const step = event.shiftKey ? MOVE_STEP_LARGE : MOVE_STEP;
    let next: Rect | null = null;
    switch (event.key) {
      case "ArrowLeft": next = { ...sel, x: sel.x - step }; break;
      case "ArrowRight": next = { ...sel, x: sel.x + step }; break;
      case "ArrowUp": next = { ...sel, y: sel.y - step }; break;
      case "ArrowDown": next = { ...sel, y: sel.y + step }; break;
      case "+":
      case "=": next = { ...sel, x: sel.x + GROW_STEP / 2, y: sel.y + GROW_STEP / 2, w: sel.w + GROW_STEP, h: sel.h + GROW_STEP }; break;
      case "-":
      case "_": next = { ...sel, x: sel.x - GROW_STEP / 2, y: sel.y - GROW_STEP / 2, w: sel.w - GROW_STEP, h: sel.h - GROW_STEP }; break;
      case "Delete":
      case "Backspace": setSel(null); event.preventDefault(); return;
      default: return;
    }
    event.preventDefault();
    setSel(clampRect(next));
  };

  const saveDetail = () => {
    if (!exhibit || !sel || saved) return;
    addDetail({ slug: exhibit.slug, x: sel.x, y: sel.y, w: sel.w, h: sel.h });
    trackStat("detail", exhibit.slug, lang);
    setSaved(true);
    window.setTimeout(() => onClose(), 900);
  };

  const alt = exhibit ? es.title(exhibit) : "";
  const percent = sel ? `${Math.round(sel.w * 100)} × ${Math.round(sel.h * 100)} %` : "";
  const canSave = !!sel && !saved;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {exhibit && (
          <div className="museum-scroll max-h-[92vh] overflow-y-auto">
            <div className="px-6 pt-6 sm:px-8">
              <DialogHeader className="items-start space-y-2 text-left">
                <DialogTitle asChild>
                  <h2 className="font-display flex items-center gap-2 text-2xl font-semibold leading-tight">
                    <Crop className="h-5 w-5 text-primary" aria-hidden="true" />
                    {t.detail.title}
                  </h2>
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  {t.detail.desc} — <span className="font-medium">{alt}</span>
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Platno z izbiro */}
            <div className="px-6 pt-4 sm:px-8">
              <div
                ref={imageBoxRef}
                role="application"
                aria-label={t.detail.canvasLabel}
                tabIndex={0}
                onKeyDown={onKeyDownBox}
                onPointerDown={onPointerDownBox}
                onPointerMove={onPointerMoveBox}
                onPointerUp={onPointerUpBox}
                onPointerCancel={onPointerUpBox}
                className="relative w-full cursor-crosshair touch-none select-none overflow-hidden rounded-lg border border-border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ aspectRatio: `${naturalWidth} / ${naturalHeight}` }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="pointer-events-none object-contain"
                  draggable={false}
                />
                {/* Zatemnitev zunaj izbire */}
                {sel && (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-background/45" aria-hidden="true" />
                    <div
                      className="absolute border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0)]"
                      style={{
                        left: `${sel.x * 100}%`,
                        top: `${sel.y * 100}%`,
                        width: `${sel.w * 100}%`,
                        height: `${sel.h * 100}%`,
                      }}
                    >
                      <div className="absolute inset-0 ring-1 ring-inset ring-background/60" aria-hidden="true" />
                    </div>
                    {/* Prikaz izreza nad izbiro: zunanja slika, notranje okno */}
                    <div
                      className="pointer-events-none absolute overflow-hidden"
                      style={{
                        left: `${sel.x * 100}%`,
                        top: `${sel.y * 100}%`,
                        width: `${sel.w * 100}%`,
                        height: `${sel.h * 100}%`,
                        backgroundImage: `url(${src})`,
                        backgroundSize: `${100 / sel.w}% ${100 / sel.h}%`,
                        backgroundPositionX: sel.w >= 1 ? "left" : `${(sel.x / (1 - sel.w)) * 100}%`,
                        backgroundPositionY: sel.h >= 1 ? "top" : `${(sel.y / (1 - sel.h)) * 100}%`,
                      }}
                      aria-hidden="true"
                    />
                    {/* Ročaji vogalov — vsaj 44 px za dotik */}
                    {(["nw", "ne", "sw", "se"] as const).map((corner) => (
                      <button
                        key={corner}
                        type="button"
                        aria-label={t.detail[`${corner}Handle` as const]}
                        onPointerDown={onHandleDown(corner)}
                        className="absolute z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        style={{
                          left: corner === "nw" || corner === "sw" ? `${sel.x * 100}%` : `${(sel.x + sel.w) * 100}%`,
                          top: corner === "nw" || corner === "ne" ? `${sel.y * 100}%` : `${(sel.y + sel.h) * 100}%`,
                          cursor: corner === "nw" || corner === "se" ? "nwse-resize" : "nesw-resize",
                          touchAction: "none",
                        }}
                      >
                        <span
                          className="block size-4 rounded-full border-2 border-primary bg-background shadow"
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Namigi in dejanja */}
            <div className="px-6 pb-6 pt-4 sm:px-8">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t.detail.hint} <span className="sr-only">{t.detail.keyboard}</span>
              </p>
              <p aria-live="polite" className="mt-1 min-h-5 text-xs font-medium text-primary">
                {sel ? `${t.detail.selected}: ${percent}` : ""}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  className="min-h-11"
                  disabled={!canSave}
                  onClick={saveDetail}
                  aria-live="polite"
                >
                  {saved ? (
                    <>
                      <Check className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      {t.detail.saved}
                    </>
                  ) : (
                    <>
                      <Scissors className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      {t.detail.save}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  disabled={!sel || saved}
                  onClick={() => setSel(null)}
                >
                  <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  {t.detail.reset}
                </Button>
                {!sel && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.detail.startHint}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
