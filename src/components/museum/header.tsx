"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, Landmark } from "lucide-react";
import { useLang, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type MuseumView = "domov" | "zbirka" | "zgodbe" | "karta" | "dogodki" | "oMuzeju";

const VIEW_ORDER: MuseumView[] = ["domov", "zbirka", "zgodbe", "karta", "dogodki", "oMuzeju"];

export function Header({
  view,
  onNavigate,
}: {
  view: MuseumView;
  onNavigate: (view: MuseumView) => void;
}) {
  const { t, lang, setLang } = useLang();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => setMounted(true), []);

  // Zapiranje mobilnega menija ob Escape in kliku zunaj
  React.useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const switchLang = (next: Lang) => {
    if (next !== lang) setLang(next);
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Znamka muzeja */}
        <button
          type="button"
          onClick={() => onNavigate("domov")}
          className="mr-1 flex min-h-11 items-center gap-2.5 rounded-md px-1 py-1 text-left"
          aria-label={t.museumName}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Landmark className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-lg font-semibold tracking-tight">
              {t.museumName}
            </span>
            <span className="mt-0.5 text-[11px] text-muted-foreground">{t.museumTagline}</span>
          </span>
        </button>

        {/* Namizna navigacija */}
        <nav
          ref={navRef}
          aria-label={t.a11y.mainNav}
          className="mx-auto hidden items-center gap-1 md:flex"
        >
          {VIEW_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              aria-current={view === key ? "page" : undefined}
              className={cn(
                "relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                "min-h-11",
                view === key
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.nav[key]}
              {view === key && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-primary"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {/* Jezikovna stikala SLO/EN */}
          <div
            role="group"
            aria-label={t.a11y.switchLang}
            className="flex items-center rounded-md border border-border bg-card p-0.5"
          >
            {(["sl", "en"] as Lang[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => switchLang(code)}
                aria-pressed={lang === code}
                className={cn(
                  "rounded-sm px-2.5 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors",
                  lang === code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {code === "sl" ? "SLO" : "EN"}
              </button>
            ))}
          </div>

          {/* Tema */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={t.a11y.toggleTheme}
            className="size-11"
          >
            {mounted ? (
              isDark ? (
                <Sun className="h-4.5 w-4.5" aria-hidden="true" />
              ) : (
                <Moon className="h-4.5 w-4.5" aria-hidden="true" />
              )
            ) : (
              <Sun className="h-4.5 w-4.5 opacity-0" aria-hidden="true" />
            )}
          </Button>

          {/* Mobilni meni */}
          <Button
            variant="outline"
            size="icon"
            className="size-11 md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Mobilni spustni meni */}
      {menuOpen && (
        <nav
          aria-label={t.a11y.mainNav}
          className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden"
        >
          <ul className="grid gap-1">
            {VIEW_ORDER.map((key) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate(key);
                    setMenuOpen(false);
                  }}
                  aria-current={view === key ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 w-full items-center rounded-md px-3 text-left text-base font-medium transition-colors",
                    view === key
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {t.nav[key]}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
