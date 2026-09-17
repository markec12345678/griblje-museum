"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, CalendarDays, Clapperboard, Sparkles } from "lucide-react";
import { useLang, localeOf } from "@/lib/i18n";
import { BEHIND_SCENES_POSTS } from "@/lib/behind-scenes";
import { Button } from "@/components/ui/button";

/**
 * Za kuliso — kanal o muzejskem delu za prizoriščem.
 *
 * Vzorec: Rijksmuseum "Operation Night Watch" (raziskava in restavracija
 * pred očmi javnosti) in objave konservatorskih ateljejev SMK. Za vaški
 * muzej je to najcenejša vsebina z največ zaupanja: surovina je delo,
 * ki ga prostovoljci že opravljajo. Vsebina živi v src/lib/behind-scenes.ts.
 */
export function BehindScenesView() {
  const { t, lang } = useLang();
  const reduceMotion = useReducedMotion();
  const [openId, setOpenId] = React.useState<string | null>(null);

  const dateFmt = React.useMemo(
    () =>
      new Intl.DateTimeFormat(localeOf(lang), {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [lang]
  );

  const openPost = BEHIND_SCENES_POSTS.find((p) => p.id === openId) ?? null;

  // Ko se zapis odpre/zapre, se pogled pomakne na začetek strani.
  React.useEffect(() => {
    if (openPost) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [openId]);

  if (openPost) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 min-h-11"
          onClick={() => setOpenId(null)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          {t.behindScenes.closePost}
        </Button>

        <header>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {lang === "sl" ? openPost.kickerSi : openPost.kickerEn}
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
            {lang === "sl" ? openPost.titleSi : openPost.titleEn}
          </h1>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            <time dateTime={openPost.date}>{dateFmt.format(new Date(openPost.date))}</time>
          </p>
        </header>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-border/70">
          <Image
            src={openPost.coverImage}
            alt={lang === "sl" ? openPost.titleSi : openPost.titleEn}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-foreground/90">
          {lang === "sl" ? openPost.introSi : openPost.introEn}
        </p>

        {/* Koraki — vodena pripoved, kot v restavratorskih dnevnikih */}
        <ol className="mt-10 space-y-10">
          {openPost.steps.map((step, index) => (
            <motion.li
              key={index}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45 }}
              className="grid gap-5 sm:grid-cols-[auto_1fr]"
            >
              <div className="flex flex-col items-center gap-2 sm:items-start">
                <span
                  aria-hidden="true"
                  className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-lg font-semibold text-primary"
                >
                  {index + 1}
                </span>
                <span className="hidden w-px flex-1 bg-border/70 sm:block" aria-hidden="true" />
              </div>
              <div className="min-w-0 pb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.behindScenes.stepOf(index + 1, openPost.steps.length)}
                </p>
                <h2 className="font-display mt-1 text-xl font-semibold leading-snug">
                  {lang === "sl" ? step.titleSi : step.titleEn}
                </h2>
                {step.image && (
                  <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-lg border border-border/70">
                    <Image
                      src={step.image}
                      alt={lang === "sl" ? step.titleSi : step.titleEn}
                      fill
                      sizes="(min-width: 768px) 640px, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
                  {lang === "sl" ? step.textSi : step.textEn}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>

        <p className="mt-12 rounded-xl border border-accent/30 bg-accent/5 p-5 text-sm italic leading-relaxed text-foreground/80">
          {t.behindScenes.patternNote}
        </p>
      </article>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Clapperboard className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            {t.behindScenes.title}
          </h1>
        </div>
        <p className="mt-3 text-muted-foreground">{t.behindScenes.subtitle}</p>
      </div>

      <section aria-labelledby="zk-zapisi" className="mt-12">
        <h2 id="zk-zapisi" className="sr-only">
          {t.behindScenes.postsTitle}
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {BEHIND_SCENES_POSTS.map((post, index) => (
            <motion.article
              key={post.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-colors hover:border-primary/40"
            >
              <button
                type="button"
                onClick={() => setOpenId(post.id)}
                className="flex min-h-11 w-full flex-col text-left"
                aria-label={`${lang === "sl" ? post.titleSi : post.titleEn} — ${t.behindScenes.readPost}`}
              >
                <span className="relative block aspect-[16/9]">
                  <Image
                    src={post.coverImage}
                    alt={lang === "sl" ? post.titleSi : post.titleEn}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
                    {lang === "sl" ? post.kickerSi : post.kickerEn}
                  </span>
                </span>
                <span className="flex flex-1 flex-col gap-2 p-5">
                  <span className="text-xs text-muted-foreground">
                    <time dateTime={post.date}>{dateFmt.format(new Date(post.date))}</time>
                    {" · "}
                    {t.behindScenes.stepsLabel(post.steps.length)}
                  </span>
                  <span className="font-display text-xl font-semibold leading-snug">
                    {lang === "sl" ? post.titleSi : post.titleEn}
                  </span>
                  <span className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {lang === "sl" ? post.introSi : post.introEn}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {t.behindScenes.readPost}
                  </span>
                </span>
              </button>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
