"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Feather, Megaphone, NotebookPen, ScrollText } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import type { MuseumView } from "@/components/museum/header";
import type { StoryDTO, StoryKind } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

const KIND_ICON: Record<StoryKind, React.ElementType> = {
  ZGODBA: BookOpen,
  NACELO: Feather,
  RAZPIS: Megaphone,
};

type StoriesViewProps = {
  stories: StoryDTO[];
  /** Navigacija na pogled spominske knjige — delujoči kanal za pričevanja (issue #2). */
  onNavigate: (view: MuseumView) => void;
};

export function StoriesView({ stories, onNavigate }: StoriesViewProps) {
  const { t } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  const documented = stories.filter((st) => st.kind === "ZGODBA");
  const principles = stories.filter((st) => st.kind === "NACELO");
  const openCalls = stories.filter((st) => st.kind === "RAZPIS");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.stories.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.stories.subtitle}</p>
      </div>

      {/* Dokumentirane zgodbe */}
      <section aria-labelledby="zg-dok" className="mt-12">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 id="zg-dok" className="font-display text-2xl font-semibold sm:text-3xl">
              {t.stories.documentedTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.stories.documentedSub}</p>
          </div>
          <ScrollText className="h-8 w-8 shrink-0 text-primary/60" aria-hidden="true" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {documented.map((story, index) => (
            <motion.article
              key={story.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative overflow-hidden rounded-xl border border-border/70 bg-card p-6 sm:p-8"
            >
              <span
                aria-hidden="true"
                className="font-display absolute -top-2 left-4 text-8xl leading-none text-primary/10"
              >
                &bdquo;
              </span>
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <EvidenceBadge status={story.evidenceStatus} />
                </div>
                <h3 className="font-display mt-3 text-2xl font-semibold leading-snug">
                  {es.storyTitle(story)}
                </h3>
                <div className="museum-scroll mt-4 max-h-72 space-y-3 overflow-y-auto pr-2">
                  {es.storyText(story)
                    .split("\n\n")
                    .filter(Boolean)
                    .map((paragraph, i) => (
                      <p key={i} className="text-[15px] leading-relaxed text-foreground/85">
                        {paragraph}
                      </p>
                    ))}
                </div>
                {es.storyAttribution(story) && (
                  <p className="mt-4 border-t border-border/70 pt-3 text-xs italic text-muted-foreground">
                    — {es.storyAttribution(story)}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Načela */}
      <section aria-labelledby="zg-nac" className="mt-14">
        <h2 id="zg-nac" className="font-display text-2xl font-semibold sm:text-3xl">
          {t.stories.principlesTitle}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.stories.principlesSub}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((story) => {
            const Icon = KIND_ICON[story.kind];
            return (
              <Card key={story.id} className="border-border/70">
                <CardContent className="space-y-3 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{es.storyTitle(story)}</h3>
                  <div className="museum-scroll max-h-72 overflow-y-auto pr-1">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
                      {es.storyText(story)}
                    </pre>
                  </div>
                  <p className="text-xs italic text-muted-foreground">
                    — {es.storyAttribution(story)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Odprti razpis */}
      <section aria-labelledby="zg-razpis" className="mt-14">
        <div className="paper-grain rounded-2xl border-2 border-dashed border-accent/50 p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border-accent/40 bg-accent/10 text-accent">
              <Megaphone className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              {t.stories.callCta}
            </Badge>
          </div>
          {openCalls.map((story) => (
            <div key={story.id} className="mt-5 max-w-2xl">
              <h2 id="zg-razpis" className="font-display text-2xl font-semibold leading-snug sm:text-3xl">
                {es.storyTitle(story)}
              </h2>
              <div className="mt-4 space-y-3">
                {es.storyText(story)
                  .split("\n\n")
                  .filter(Boolean)
                  .map((paragraph, i) => (
                    <p key={i} className="text-[15px] leading-relaxed text-foreground/85">
                      {paragraph}
                    </p>
                  ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <EvidenceBadge status={story.evidenceStatus} />
                <Button
                  className="min-h-11"
                  onClick={() => onNavigate("knjiga")}
                >
                  <NotebookPen className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  {t.stories.callCta}
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.stories.callVia}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
