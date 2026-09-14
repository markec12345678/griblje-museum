"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Link2, Network } from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { findConnectionPath } from "@/lib/connections";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Poveži zbirko — pot med dvema zapisoma.
 *
 * Vzorec: »x Degrees of Separation« (Google Arts & Culture, 2018):
 * poveži poljubna dva predmeta z verigo sorodnih. Naša različica je
 * majhna in poštena — vsak skok nosi razložljivo utemeljitev
 * (ista tema, obdobje, vir ali bližina), ne podobnost iz modela.
 */
export function ConnectDialog({
  open,
  onClose,
  exhibits,
  initialPair,
  onOpenExhibit,
}: {
  open: boolean;
  onClose: () => void;
  exhibits: ExhibitDTO[];
  /** Zametak iz globoke povezave ?path=<a>,<b>. */
  initialPair?: [string, string] | null;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  const [aSlug, setASlug] = React.useState<string>("");
  const [bSlug, setBSlug] = React.useState<string>("");
  const [copyState, setCopyState] = React.useState<"idle" | "ok" | "fail">("idle");

  // Globoka povezava ali ponovni ogled napolni izbiro.
  React.useEffect(() => {
    if (open && initialPair) {
      const [a, b] = initialPair;
      const validA = exhibits.some((ex) => ex.slug === a) ? a : "";
      const validB = exhibits.some((ex) => ex.slug === b) ? b : "";
      if (validA) setASlug(validA);
      if (validB) setBSlug(validB);
    }
  }, [open, initialPair, exhibits]);

  React.useEffect(() => {
    setCopyState("idle");
  }, [aSlug, bSlug, open]);

  const path = React.useMemo(() => {
    if (!open || !aSlug || !bSlug || aSlug === bSlug) return null;
    return findConnectionPath(aSlug, bSlug, exhibits);
  }, [open, aSlug, bSlug, exhibits]);

  const ready = aSlug !== "" && bSlug !== "" && aSlug !== bSlug;

  const sharePath = async () => {
    if (!aSlug || !bSlug) return;
    const url = `${window.location.origin}/?path=${aSlug},${bSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("ok");
    } catch {
      setCopyState("fail");
    }
    window.setTimeout(() => setCopyState("idle"), 2600);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent className="max-h-[90vh] sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" aria-hidden="true" />
            {t.connect.toolTitle}
          </DialogTitle>
          <DialogDescription>{t.connect.toolSub}</DialogDescription>
        </DialogHeader>

        {/* Izbira dveh zapisov */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label id="connect-a-label" className="mb-1.5 block text-sm font-medium">
              {t.connect.pickA}
            </label>
            <Select value={aSlug || undefined} onValueChange={setASlug}>
              <SelectTrigger
                className="h-12 text-base"
                aria-labelledby="connect-a-label"
              >
                <SelectValue placeholder={t.connect.pickPlaceholder} />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {exhibits.map((ex) => (
                  <SelectItem key={ex.slug} value={ex.slug}>
                    {es.title(ex)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label id="connect-b-label" className="mb-1.5 block text-sm font-medium">
              {t.connect.pickB}
            </label>
            <Select value={bSlug || undefined} onValueChange={setBSlug}>
              <SelectTrigger
                className="h-12 text-base"
                aria-labelledby="connect-b-label"
              >
                <SelectValue placeholder={t.connect.pickPlaceholder} />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {exhibits.map((ex) => (
                  <SelectItem key={ex.slug} value={ex.slug}>
                    {es.title(ex)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {aSlug && bSlug && aSlug === bSlug && (
          <p className="text-sm text-muted-foreground">{t.connect.samePick}</p>
        )}

        {/* Pot med zapisoma */}
        {ready && (
          <ScrollArea className="mt-2 max-h-[46vh] pr-3">
            {path ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {path.chain.length === 2
                      ? t.connect.directTitle
                      : t.connect.pathTitle(path.chain.length - 2)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-11"
                    onClick={sharePath}
                  >
                    <Link2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    {copyState === "ok" ? t.connect.shared : t.connect.share}
                  </Button>
                </div>

                <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
                  {path.chain.map((exhibit, i) => (
                    <React.Fragment key={exhibit.slug}>
                      {i > 0 && (
                        <div className="flex shrink-0 flex-col items-center justify-center gap-1 px-2">
                          <ArrowRight
                            className="h-4 w-4 text-primary"
                            aria-hidden="true"
                          />
                          <span className="max-w-32 text-center text-[10px] leading-tight text-muted-foreground">
                            {path.hops[i - 1]
                              .map((c) => pick(lang, c.labelSi, c.labelEn))
                              .join(" · ")}
                          </span>
                        </div>
                      )}
                      <motion.button
                        type="button"
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.12 }}
                        onClick={() => {
                          onClose();
                          onOpenExhibit(exhibit);
                        }}
                        className="flex w-36 shrink-0 flex-col overflow-hidden rounded-lg border border-border/70 bg-card text-left shadow-sm transition-colors hover:border-primary/40"
                      >
                        <span className="relative block aspect-[4/3]">
                          <Image
                            src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                            alt={es.title(exhibit)}
                            fill
                            sizes="144px"
                            className="object-cover"
                          />
                        </span>
                        <span className="flex flex-1 flex-col gap-1 p-2.5">
                          <Badge variant="secondary" className="w-fit text-[10px]">
                            {t.categories[exhibit.category]}
                          </Badge>
                          <span className="line-clamp-3 text-xs font-semibold leading-snug">
                            {es.title(exhibit)}
                          </span>
                        </span>
                      </motion.button>
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.connect.pathNote}
                </p>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t.connect.noPath}
              </p>
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
