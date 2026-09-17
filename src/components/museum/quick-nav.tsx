"use client";

import * as React from "react";
import {
  ArrowUp,
  Heart,
  Home,
  LayoutGrid,
  Map as MapIcon,
  Search,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { MuseumView } from "@/components/museum/header";

/**
 * Mobilna spodnja vrstica — app-like navigacija na majhnih zaslonih.
 *
 * Vzorec: mobilne izkušnje velikih muzejev (Google Arts & Culture in
 * muzejske aplikacije) — pet ključnih poti (domov, zbirka, karta,
 * iskanje, moja zbirka) je dosegljivih z enim tapom, brez odpiranja
 * menija. Na namizju se vrstica ne prikaže; vsebuje tudi spoštovanje
 * varnega območja (zarez) iOS naprav.
 */
export function MobileTabBar({
  view,
  onNavigate,
  onOpenSearch,
}: {
  view: MuseumView;
  onNavigate: (view: MuseumView) => void;
  onOpenSearch: () => void;
}) {
  const { t } = useLang();

  const tabs: {
    key: MuseumView | "iskanje";
    icon: typeof Home;
    label: string;
    action: () => void;
  }[] = [
    {
      key: "domov",
      icon: Home,
      label: t.nav.domov,
      action: () => onNavigate("domov"),
    },
    {
      key: "zbirka",
      icon: LayoutGrid,
      label: t.nav.zbirka,
      action: () => onNavigate("zbirka"),
    },
    {
      key: "karta",
      icon: MapIcon,
      label: t.nav.karta,
      action: () => onNavigate("karta"),
    },
    {
      key: "iskanje",
      icon: Search,
      label: t.search.title,
      action: onOpenSearch,
    },
    {
      key: "mojMuzej",
      icon: Heart,
      label: t.nav.mojMuzej,
      action: () => onNavigate("mojMuzej"),
    },
  ];

  return (
    <nav
      aria-label={t.a11y.tabNav}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active =
            tab.key !== "iskanje" && (view === tab.key || (tab.key === "domov" && view === "domov"));
          return (
            <li key={tab.key}>
              <button
                type="button"
                onClick={tab.action}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-11 items-center justify-center rounded-full transition-colors",
                    active ? "bg-primary/12" : ""
                  )}
                >
                  <tab.icon
                    className={cn("h-5 w-5", active && "fill-primary/20")}
                    aria-hidden="true"
                  />
                </span>
                <span className="max-w-full truncate">{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Nazaj na vrh — lebdeči gumb na dolgih straneh.
 *
 * Vzorec: Louvre in Tate (dolg zgornji navigacijski tok) — po drsanju
 * se pokaže diskreten gumb za vrnitev na začetek strani. Na mobilniku
 * sedi nad spodnjo vrstico, na namizju ob desnem robu.
 */
export function BackToTop() {
  const { t } = useLang();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t.a11y.backToTop}
      className={cn(
        "fixed right-4 z-40 flex size-11 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-all hover:border-primary/40 hover:text-primary md:bottom-6",
        "bottom-[calc(4.75rem+env(safe-area-inset-bottom))]",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
