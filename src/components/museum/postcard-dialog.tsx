"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Check,
  Info,
  Landmark,
  Link2,
  Mail,
  PenLine,
  Printer,
  RotateCw,
} from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  POSTCARD_GREETINGS,
  POSTCARD_MESSAGE_MAX,
  POSTCARD_SENDER_MAX,
  getGreeting,
  postcardUrl,
  postmarkDate,
  type PostcardData,
} from "@/lib/postcard";
import type { ExhibitDTO } from "@/lib/types";

/** Prednja stran — slika in znamka muzeja. */
function PostcardFront({
  image,
  museumName,
  tagline,
  imageAlt,
}: {
  image: string;
  museumName: string;
  tagline: string;
  imageAlt: string;
}) {
  return (
    <div className="postcard-face absolute inset-0 flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative flex-1">
        <Image src={image} alt={imageAlt} fill sizes="520px" className="object-cover" />
      </div>
      <div className="flex items-center gap-2 border-t border-border bg-card px-4 py-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Landmark className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="font-display block text-sm font-semibold leading-tight">
            {museumName}
          </span>
          <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {tagline}
          </span>
        </span>
      </div>
    </div>
  );
}

/** Hrbtna stran — klasična razglednica: sporočilo, žig, znamka. */
function PostcardBack({
  greeting,
  message,
  sender,
  date,
  museumName,
  toLabel,
}: {
  greeting: string;
  message: string;
  sender: string;
  date: string;
  museumName: string;
  toLabel: string;
}) {
  return (
    <div className="postcard-face postcard-back absolute inset-0 flex overflow-hidden rounded-lg border border-border bg-card">
      {/* Leva polovica — sporočilo */}
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <p className="font-display text-base font-semibold leading-snug">{greeting}</p>
        <p className="mt-2 flex-1 overflow-hidden whitespace-pre-line font-display text-sm italic leading-relaxed text-foreground/90">
          {message}
        </p>
        {sender && (
          <p className="mt-2 text-right font-display text-sm italic text-foreground/80">
            — {sender}
          </p>
        )}
      </div>

      {/* Desna polovica — žig in naslovnik */}
      <div className="relative flex w-[38%] flex-col border-l border-border/80 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          {/* Znamka */}
          <div className="flex h-14 w-12 flex-col items-center justify-center gap-0.5 rounded-[3px] border-2 border-dashed border-primary/50 bg-primary/5 px-1 text-center">
            <Landmark className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-[7px] font-bold uppercase leading-tight tracking-wider text-primary">
              {museumName}
            </span>
          </div>
          {/* Žig */}
          <div
            className="flex h-12 w-12 rotate-[-8deg] items-center justify-center rounded-full border-2 border-accent/60 text-center text-[8px] font-semibold leading-[1.1] text-accent/90"
            aria-hidden="true"
          >
            {date}
          </div>
        </div>
        <p className="mt-auto text-[11px] font-medium text-muted-foreground">
          {toLabel}
          <span className="mt-1 block border-b border-border" />
          <span className="mt-2 block border-b border-border" />
          <span className="mt-2 block border-b border-border" />
        </p>
      </div>
    </div>
  );
}

/**
 * Pošlji razglednico — muzejska e-razglednica (vzorec: Useum e-Cards,
 * SFMOMA Send Me). Sporočilo živi v deljni povezavi; ogled je enostaven
 * obrat kartice (čisti CSS-3D, ne framer-motion — izkušnja 4. sklopa),
 * tisk pa da zložljivo A5 razglednico.
 */
export function PostcardDialog({
  exhibit,
  initial,
  onClose,
}: {
  exhibit: ExhibitDTO | null;
  /** Podatki iz globoke povezave — sprejemni pogled (razglednica že napisana). */
  initial?: PostcardData | null;
  onClose: () => void;
}) {
  const { t, lang } = useLang();
  const open = exhibit !== null;

  const [mode, setMode] = React.useState<"sestavi" | "poslana">("sestavi");
  const [greeting, setGreeting] = React.useState<string>("pozdrav");
  const [message, setMessage] = React.useState("");
  const [sender, setSender] = React.useState("");
  const [flipped, setFlipped] = React.useState(false);
  const [copyState, setCopyState] = React.useState<"idle" | "ok" | "fail">("idle");
  const [portalReady, setPortalReady] = React.useState(false);

  const slug = exhibit?.slug ?? null;

  // Ponastavitev ob novem zapisu; globoka povezava odpre sprejemni pogled.
  React.useEffect(() => {
    if (slug === null) return;
    if (initial && initial.slug === slug) {
      setMode("poslana");
      setGreeting(initial.greeting);
      setMessage(initial.message);
      setSender(initial.sender);
    } else {
      setMode("sestavi");
      setGreeting("pozdrav");
      setMessage("");
      setSender("");
    }
    setFlipped(false);
    setCopyState("idle");
  }, [slug]);

  React.useEffect(() => setPortalReady(true), []);

  const copyLink = async () => {
    if (!slug) return;
    const url = postcardUrl({ slug, greeting: getGreeting(greeting).id, message, sender });
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
      else {
        const area = document.createElement("textarea");
        area.value = url;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setCopyState("ok");
    } catch {
      setCopyState("fail");
    }
    window.setTimeout(() => setCopyState("idle"), 2600);
  };

  if (!exhibit) return null;

  const title = pick(lang, exhibit.titleSi, exhibit.titleEn);
  const image = exhibit.image ?? "/images/authentic/hero-griblje.jpg";
  const greetingText = pick(lang, getGreeting(greeting).si, getGreeting(greeting).en);
  const date = postmarkDate(lang);
  const canCreate = message.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogTitle className="font-display text-xl font-semibold sm:text-2xl">
          {t.postcard.title}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {initial ? t.postcard.receivedHint : t.postcard.subtitle(title)}
        </DialogDescription>

        {mode === "sestavi" ? (
          <div className="mt-4 space-y-4">
            {/* Izbor zapisa je vnešen iz dialoga zapisa — pokažemo sliko. */}
            <div className="flex items-center gap-4">
              <span className="relative block h-20 w-32 shrink-0 overflow-hidden rounded-md border border-border">
                <Image src={image} alt={title} fill sizes="128px" className="object-cover" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.postcard.composeLead}
                </p>
              </div>
            </div>

            {/* Pozdrav */}
            <div>
              <p className="text-sm font-semibold">{t.postcard.greetingsLabel}</p>
              <div
                role="group"
                aria-label={t.postcard.greetingsLabel}
                className="mt-2 flex flex-wrap gap-2"
              >
                {POSTCARD_GREETINGS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    aria-pressed={greeting === g.id}
                    onClick={() => setGreeting(g.id)}
                    className={cn(
                      "min-h-11 rounded-full border px-3.5 text-sm font-medium transition-colors",
                      greeting === g.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    )}
                  >
                    {pick(lang, g.si, g.en)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sporočilo */}
            <div>
              <label htmlFor="postcard-message" className="text-sm font-semibold">
                {t.postcard.messageLabel}
              </label>
              <Textarea
                id="postcard-message"
                value={message}
                rows={4}
                maxLength={POSTCARD_MESSAGE_MAX}
                placeholder={t.postcard.messagePlaceholder}
                className="mt-2"
                onChange={(event) => setMessage(event.target.value)}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground tabular-nums">
                {t.postcard.messageCount(message.length, POSTCARD_MESSAGE_MAX)}
              </p>
            </div>

            {/* Pošiljatelj */}
            <div>
              <label htmlFor="postcard-sender" className="text-sm font-semibold">
                {t.postcard.senderLabel}
              </label>
              <Input
                id="postcard-sender"
                value={sender}
                maxLength={POSTCARD_SENDER_MAX}
                placeholder={t.postcard.senderPlaceholder}
                className="mt-2"
                onChange={(event) => setSender(event.target.value)}
              />
            </div>

            <p className="flex items-start gap-2 rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {t.postcard.privacy}
            </p>

            <Button
              className="min-h-11 w-full gap-1.5"
              disabled={!canCreate}
              onClick={() => {
                setMode("poslana");
                setFlipped(false);
              }}
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {t.postcard.create}
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Razglednica — obrat s čistim CSS-3D */}
            <div className="postcard-3d mx-auto w-full max-w-[520px]">
              <div
                role="button"
                tabIndex={0}
                aria-label={t.postcard.flipLabel}
                onClick={() => setFlipped((prev) => !prev)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setFlipped((prev) => !prev);
                  }
                }}
                className="postcard-inner block w-full cursor-pointer rounded-lg"
                style={{
                  aspectRatio: "3 / 2",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <PostcardFront
                  image={image}
                  museumName={t.museumName}
                  tagline={t.postcard.cardTagline}
                  imageAlt={title}
                />
                <PostcardBack
                  greeting={greetingText}
                  message={message}
                  sender={sender}
                  date={date}
                  museumName={t.museumName}
                  toLabel={t.postcard.toLabel}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="min-h-10 gap-1.5"
                onClick={() => setFlipped((prev) => !prev)}
              >
                <RotateCw className="h-4 w-4" aria-hidden="true" />
                {t.postcard.flipLabel}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="min-h-10 gap-1.5"
                onClick={copyLink}
              >
                {copyState === "ok" ? (
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                ) : (
                  <Link2 className="h-4 w-4" aria-hidden="true" />
                )}
                {copyState === "ok"
                  ? t.share.copied
                  : copyState === "fail"
                    ? t.share.copyFailed
                    : t.postcard.copyLink}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="min-h-10 gap-1.5"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                {t.postcard.print}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-10 gap-1.5"
                onClick={() => setMode("sestavi")}
              >
                <PenLine className="h-4 w-4" aria-hidden="true" />
                {t.postcard.edit}
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {t.postcard.printHint}
            </p>
          </div>
        )}

        {/* Tiskalna različica —portal ob telesu, da dialog ne moti tiska. */}
        {portalReady && mode === "poslana" &&
          createPortal(
            <div className="postcard-print-root">
              <div className="postcard-print-sheet">
                <div className="postcard-print-half">
                  <PostcardFront
                    image={image}
                    museumName={t.museumName}
                    tagline={t.postcard.cardTagline}
                    imageAlt={title}
                  />
                </div>
                <div className="postcard-print-half">
                  <PostcardBack
                    greeting={greetingText}
                    message={message}
                    sender={sender}
                    date={date}
                    museumName={t.museumName}
                    toLabel={t.postcard.toLabel}
                  />
                </div>
              </div>
              <style>{`@page { size: A5 landscape; margin: 6mm; }`}</style>
            </div>,
            document.body
          )}
      </DialogContent>
    </Dialog>
  );
}
