"use client";

import { ShieldCheck, ShieldQuestion, BookOpen, Users, Sparkles, Hourglass } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { EvidenceStatus } from "@/lib/types";

const CONFIG: Record<
  EvidenceStatus,
  { icon: React.ElementType; className: string; darkClassName: string }
> = {
  DOCUMENTED: {
    icon: ShieldCheck,
    className: "bg-primary/10 text-primary border-primary/30",
    darkClassName: "",
  },
  CORROBORATED: {
    icon: ShieldCheck,
    className: "bg-chart-3/15 text-chart-3 border-chart-3/30",
    darkClassName: "",
  },
  TESTIMONY: {
    icon: BookOpen,
    className: "bg-chart-4/15 text-chart-5 border-chart-4/40",
    darkClassName: "",
  },
  TRADITION: {
    icon: Sparkles,
    className: "bg-accent/12 text-accent border-accent/35",
    darkClassName: "",
  },
  UNVERIFIED: {
    icon: ShieldQuestion,
    className: "bg-muted text-muted-foreground border-border",
    darkClassName: "",
  },
  TO_COLLECT: {
    icon: Hourglass,
    className: "bg-muted text-muted-foreground border-dashed border-muted-foreground/40",
    darkClassName: "",
  },
};

export function EvidenceBadge({
  status,
  withLabel = true,
  className,
}: {
  status: EvidenceStatus;
  withLabel?: boolean;
  className?: string;
}) {
  const { t } = useLang();
  const config = CONFIG[status];
  const Icon = config.icon;
  const label = t.evidence[status];

  return (
    <span
      title={`${t.evidence.label}: ${label} — ${t.evidence.desc[status]}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {withLabel && <span>{label}</span>}
      <span className="sr-only">
        {t.evidence.label}: {label}. {t.evidence.desc[status]}
      </span>
    </span>
  );
}
