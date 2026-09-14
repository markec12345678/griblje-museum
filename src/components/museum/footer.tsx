"use client";

import { ExternalLink, Landmark } from "lucide-react";
import { useLang } from "@/lib/i18n";
import type { MuseumView } from "@/components/museum/header";

export function Footer({ onNavigate }: { onNavigate: (view: MuseumView) => void }) {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Landmark className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span className="font-display text-base font-semibold">{t.museumName}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t.museumTagline}</p>
            <p className="text-xs text-muted-foreground">{t.footer.langNote}</p>
          </div>

          <nav aria-label={t.footer.nav} className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.nav}
            </h2>
            <ul className="space-y-1.5">
              {(["domov", "zbirka", "tema", "zgodbe", "casovnica", "karta", "knjiga", "zaKuliso", "zaOtroke"] as MuseumView[]).map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => onNavigate(key)}
                    className="min-h-11 rounded-sm text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {t.nav[key]}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.data}
            </h2>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="/api/opendata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-foreground/80 transition-colors hover:text-primary"
                >
                  {t.footer.openData}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="/api/exhibits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-foreground/80 transition-colors hover:text-primary"
                >
                  /api/exhibits
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="/api/events"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-foreground/80 transition-colors hover:text-primary"
                >
                  /api/events
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.accessibility}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate("oMuzeju")}
              className="min-h-11 rounded-sm text-sm text-foreground/80 transition-colors hover:text-primary"
            >
              {t.about.accessTitle}
            </button>
            <p className="text-xs text-muted-foreground">{t.about.accessStatus}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.rights}</p>
          <p>
            © {year} · {t.footer.built}
          </p>
        </div>
      </div>
    </footer>
  );
}
