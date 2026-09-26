"use client";

import * as React from "react";
import { BookOpen, ExternalLink, Fingerprint, Loader2, X } from "lucide-react";
import { useLang } from "@/lib/i18n";

/**
 * Zgodba ATLAS 1825 — UI sloj story engine-a (issue #42 §16 + §19, val 71).
 *
 * Panel NE sestavlja vsebine: le prikaže deterministični izhod
 * GET /api/atlas/story (§16 entiteta / §18 vas) z dokaznimi tiri (§17),
 * sekcijami, virom in pogodbo §22 (story_id + content_hash = reproducibilnost).
 * NOT_PUBLISHED zgodba pokaže pošten blok — nič izmišljevanja.
 */

type StoryItem = {
  text: string;
  tier: "DOKAZANO" | "VERJETNO" | "KONFLIKTNO" | "NEZNANO";
  status: string;
  source_ids: string[];
  claim_ids: string[];
};

type StorySection = { title: string; items: StoryItem[] };

type StoryContract = {
  story_id: string;
  used_claim_ids: string[];
  used_source_ids: string[];
  generation_timestamp: string;
  prompt_version: string;
  story_status: "EVIDENCED" | "PARTIAL_EVIDENCE" | "NOT_PUBLISHED";
  content_hash: string;
  kg_sha256: string;
};

export type AtlasStory = {
  ok: true;
  scope: "entity" | "village";
  focus?: { node_id: string; node_type: string; label: string; evidence_status: string };
  headline: string;
  contract: StoryContract;
  sections: StorySection[];
  tier_breakdown: Record<string, number>;
  evidence_url?: string;
};

type FetchState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; story: AtlasStory };

export function useAtlasStory(ref: string | null): FetchState {
  const [state, setState] = React.useState<FetchState>({ kind: "idle" });
  React.useEffect(() => {
    if (!ref) {
      setState({ kind: "idle" });
      return;
    }
    let alive = true;
    setState({ kind: "loading" });
    const url =
      ref === "village"
        ? "/api/atlas/story?scope=village"
        : `/api/atlas/story?entity=${encodeURIComponent(ref)}`;
    fetch(url)
      .then(async (r) => {
        if (!r.ok) {
          const body = (await r.json().catch(() => null)) as { message?: string } | null;
          throw new Error(body?.message ?? String(r.status));
        }
        return r.json();
      })
      .then((story: AtlasStory) => {
        if (alive) setState({ kind: "ready", story });
      })
      .catch((e: Error) => {
        if (alive) setState({ kind: "error", message: e.message });
      });
    return () => {
      alive = false;
    };
  }, [ref]);
  return state;
}

const TIER_STYLE: Record<string, string> = {
  DOKAZANO: "bg-[#3f5d3c]/10 text-[#3f5d3c]",
  VERJETNO: "bg-amber-500/10 text-amber-700",
  KONFLIKTNO: "bg-red-500/10 text-red-700",
  NEZNANO: "bg-muted text-muted-foreground",
};

const TIER_ICON: Record<string, string> = {
  DOKAZANO: "🟢",
  VERJETNO: "🟡",
  KONFLIKTNO: "🔴",
  NEZNANO: "⚪",
};

/** Pogodba §22 — reproducibilnost zgodbe (story_id + content_hash). */
function ContractBar({ contract }: { contract: StoryContract }) {
  const { t } = useLang();
  const s = t.atlasStory;
  const chips = [
    [s.contractStoryId, contract.story_id],
    [s.contractHash, contract.content_hash.slice(0, 12) + "…"],
    [s.contractPrompt, contract.prompt_version],
    [s.contractKg, contract.kg_sha256.slice(0, 8) + "…"],
  ] as const;
  return (
    <div className="rounded-lg border border-border/70 bg-background/60 p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-stone-500">
        <Fingerprint className="h-3.5 w-3.5" aria-hidden="true" />
        {s.contract} · {contract.story_status}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {chips.map(([label, value]) => (
          <span
            key={label}
            className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {label}={value}
          </span>
        ))}
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {s.usedClaims.replace("{n}", String(contract.used_claim_ids.length))}
        </span>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {s.usedSources.replace("{n}", String(contract.used_source_ids.length))}
        </span>
      </div>
    </div>
  );
}

/** Sekcija zgodbe: naslov + elementi z dokaznimi tiri (§17) in viri. */
function StorySectionView({ section }: { section: StorySection }) {
  const { t } = useLang();
  const s = t.atlasStory;
  if (section.items.length === 0) return null;
  return (
    <section className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-500">
        {section.title}
      </h4>
      <ul className="space-y-1.5" role="list">
        {section.items.map((item, i) => (
          <li key={`${section.title}-${i}`} className="rounded-lg border border-border/50 bg-card p-2.5">
            <p className="text-sm leading-snug">
              <span aria-hidden="true">{TIER_ICON[item.tier]} </span>
              {item.text}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${TIER_STYLE[item.tier] ?? ""}`}
              >
                {item.tier} · {item.status}
              </span>
              {item.source_ids.slice(0, 4).map((src) => (
                <span key={src} className="font-mono text-[10px] text-stone-500">
                  {src}
                </span>
              ))}
              {item.source_ids.length > 4 ? (
                <span className="text-[10px] text-stone-500">
                  +{item.source_ids.length - 4} {s.sourcesLabel}
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Polno okno zgodbe (dialog portal, brez odvisnosti od ui/dialog niš). */
export function AtlasStoryDialog({
  entity,
  onClose,
}: {
  /** node ref (npr. "HOUSE:H-040", "BP:040", "MO:MO-A01-002") ali "village" */
  entity: string | null;
  onClose: () => void;
}) {
  const { t } = useLang();
  const s = t.atlasStory;
  const state = useAtlasStory(entity);
  const open = entity !== null;

  if (!open) return null;

  const isVillage = entity === "village";

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={isVillage ? s.villageTitle : s.storyOfEntity}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-border/70 bg-card shadow-xl sm:rounded-2xl">
        {/* glava */}
        <div className="flex items-start justify-between gap-3 border-b border-border/70 p-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
              {isVillage ? s.villageEyebrow : s.eyebrow}
            </p>
            <h3 className="font-display truncate text-lg font-semibold">
              {state.kind === "ready"
                ? state.story.scope === "village"
                  ? s.villageTitle
                  : state.story.focus?.label ?? s.storyOfEntity
                : isVillage
                  ? s.villageTitle
                  : entity}
            </h3>
            {state.kind === "ready" && state.story.scope === "entity" && state.story.focus ? (
              <p className="mt-0.5 font-mono text-[11px] text-stone-500">
                {state.story.focus.node_id} · {state.story.focus.evidence_status}
              </p>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={s.close}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* vsebina */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4" style={{ scrollbarWidth: "thin" }}>
          {state.kind === "loading" ? (
            <p className="flex items-center gap-2 p-4 text-sm text-muted-foreground" role="status">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {s.loading}
            </p>
          ) : null}

          {state.kind === "error" ? (
            <div className="rounded-lg border border-red-300/60 bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-100">
              <p className="font-semibold">{s.error}</p>
              <p className="mt-1 font-mono text-xs">{state.message}</p>
            </div>
          ) : null}

          {state.kind === "ready" ? (
            <>
              <p className="text-[15px] font-medium leading-relaxed">{state.story.headline}</p>

              {/* NOT_PUBLISHED — pogodba §22: ni claims + sources ⇒ ni zgodbe */}
              {state.story.contract.story_status === "NOT_PUBLISHED" ? (
                <div className="rounded-lg border border-amber-300/70 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/60 dark:text-amber-100">
                  <p className="font-semibold">{s.notPublished}</p>
                  <p className="mt-1 text-[13px] leading-snug">{s.notPublishedNote}</p>
                </div>
              ) : (
                <>
                  {/* legenda tiri + razporeditev */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                      {s.legend}:
                    </span>
                    {Object.entries(state.story.tier_breakdown).map(([tier, n]) => (
                      <span
                        key={tier}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TIER_STYLE[tier] ?? ""}`}
                      >
                        {TIER_ICON[tier]} {tier} {n}
                      </span>
                    ))}
                  </div>

                  {state.story.sections.map((sec) => (
                    <StorySectionView key={sec.title} section={sec} />
                  ))}
                </>
              )}

              <ContractBar contract={state.story.contract} />

              {state.story.evidence_url ? (
                <a
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2f6f4f] underline underline-offset-2"
                  href={state.story.evidence_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.evidenceChain} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Gumb »Zgodba« — enoten klik-flux (§16) za okna markerjev in vrstice registra. */
export function StoryButton({
  onClick,
  label,
  compact = false,
}: {
  onClick: () => void;
  label?: string;
  compact?: boolean;
}) {
  const { t } = useLang();
  const s = t.atlasStory;
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-[#2f6f4f]/30 bg-[#2f6f4f]/10 font-semibold text-[#2f6f4f] transition-colors hover:bg-[#2f6f4f]/20 ${
        compact ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs"
      }`}
    >
      <BookOpen className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden="true" />
      {label ?? s.storyOfEntity}
    </button>
  );
}
