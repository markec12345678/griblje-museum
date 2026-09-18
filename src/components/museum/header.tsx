"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Accessibility, Moon, Search, Sun, Menu, Landmark, MessageCircleQuestion, RotateCcw, Globe, Check, Scale } from "lucide-react";
import { useLang, LANG_CODES, LANG_NAMES, type Lang } from "@/lib/i18n";
import { useA11y } from "@/lib/a11y";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { A11ySettingsList } from "@/components/museum/a11y-toggles";

export type MuseumView =
  | "domov"
  | "zbirka"
  | "tema"
  | "razpolozenje"
  | "zgodbe"
  | "izrazoslovje"
  | "casovnica"
  | "kronika"
  | "karta"
  | "spomin"
  | "dogodki"
  | "oMuzeju"
  | "mojMuzej"
  | "igre"
  | "zaOtroke"
  | "knjiga"
  | "zaKuliso";

export const VIEW_ORDER: MuseumView[] = [
  "domov",
  "zbirka",
  "tema",
  "razpolozenje",
  "zgodbe",
  "izrazoslovje",
  "casovnica",
  "kronika",
  "karta",
  "spomin",
  "dogodki",
  "oMuzeju",
  "mojMuzej",
  "igre",
  "zaOtroke",
  "knjiga",
  "zaKuliso",
];

/**
 * Pogledi v namizni navigaciji. »Za otroke« je namenoma izpuščen —
 * kot pri Van Goghovem muzeju in Louvru (Petite Galerie) je otroška
 * pot izpostavljena na domači strani, v nogi in v mobilnem meniju,
 * ne pa stisnjena med glavne rubrike. Tematska središča, vodnik po
 * razpoloženju (vzorec Rijksmuseuma) in »za kuliso« so dosegljivi iz
 * zbirke in domače strani — namizna vrstica ostane pregledna.
 * Spominska knjiga (sodelovanje skupnosti) pa je namenoma VIDNA —
 * je čustveno središče vaškega muzeja.
 */
const DESKTOP_NAV_VIEWS = VIEW_ORDER.filter(
  (view) =>
    view !== "zaOtroke" && view !== "tema" && view !== "razpolozenje" && view !== "zaKuliso"
);

/**
 * Stopnje vidnosti namizne navigacije — glava mora biti brez vodoravnega
 * preliva pri VSAKI širini (izmerjene širine: navigacija 885 px, znamka 108 px,
 * desni gumbi 268 px). Jedro (md+) nosi pet rubrik, lg doda zemljevid spomina,
 * osebni muzej in igre, xl pa izrazoslovje, časovnico, kroniko in spominsko
 * knjigo; »O muzeju« je v vrstici šele od 2xl (v nogi je vedno). Do ostalih
 * pogledov služi hamburger-menij do xl.
 */
const NAV_TIER: Partial<Record<MuseumView, "core" | "lg" | "xl" | "2xl">> = {
  domov: "core",
  zbirka: "core",
  zgodbe: "core",
  karta: "core",
  spomin: "lg",
  dogodki: "core",
  mojMuzej: "lg",
  igre: "lg",
  izrazoslovje: "xl",
  casovnica: "xl",
  kronika: "xl",
  knjiga: "xl",
  oMuzeju: "2xl",
};

const TIER_CLASS: Record<string, string> = {
  core: "",
  lg: "hidden lg:flex",
  xl: "hidden xl:flex",
  "2xl": "hidden 2xl:flex",
};

/** Mobilni spustni meni — vključi vse razen vodnika po razpoloženju. */
const MOBILE_NAV_VIEWS = VIEW_ORDER.filter((view) => view !== "razpolozenje");

export function Header({
  view,
  onNavigate,
  onOpenSearch,
  onOpenGuide,
  onOpenCurator,
}: {
  view: MuseumView;
  onNavigate: (view: MuseumView) => void;
  onOpenSearch: () => void;
  onOpenGuide: () => void;
  onOpenCurator: () => void;
}) {
  const { t, lang, setLang } = useLang();
  const { customized, reset } = useA11y();
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
          <span className="hidden flex-col leading-none lg:flex">
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
          {DESKTOP_NAV_VIEWS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              aria-current={view === key ? "page" : undefined}
              className={cn(
                "relative rounded-md px-2.5 py-2 text-sm font-medium transition-colors xl:px-3",
                "min-h-11",
                TIER_CLASS[NAV_TIER[key] ?? "core"],
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
          {/* Pogovor z zbirko (AI vodnik) — na majhnih zaslonih skrit,
              dosegljiv prek junaka domače strani in hamburger-menija */}
          <Button
            variant="outline"
            size="icon"
            className="hidden size-11 lg:inline-flex"
            onClick={onOpenGuide}
            aria-label={t.guide.openLabel}
            aria-keyshortcuts="Control+G"
          >
            <MessageCircleQuestion className="h-4.5 w-4.5" aria-hidden="true" />
          </Button>

          {/* AI kustos — dokazni odgovori (Ctrl+J); na majhnih zaslonih
              dosegljiv prek hamburger-menija */}
          <Button
            variant="outline"
            size="icon"
            className="hidden size-11 lg:inline-flex"
            onClick={onOpenCurator}
            aria-label={t.curator.openLabel}
            aria-keyshortcuts="Control+J"
          >
            <Scale className="h-4.5 w-4.5" aria-hidden="true" />
          </Button>

          {/* Enotno iskanje */}
          <Button
            variant="outline"
            size="icon"
            className="size-11"
            onClick={onOpenSearch}
            aria-label={t.search.openLabel}
            aria-keyshortcuts="Control+K"
          >
            <Search className="h-4.5 w-4.5" aria-hidden="true" />
          </Button>

          {/* Jezikovni meni — 5 jezikov (SLO/HRV/EN/DEU/ITA), spustni vzorec
              vodilnih muzejev (Rijksmuseum, Louvre): ikona globusa in domača
              imena jezikov; hrvaščina kot čezmejna razumljivost ob Kolpi,
              nemščina in italijanščina za obiskovalce Bela krajine */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-11 gap-1.5 px-3"
                aria-label={t.a11y.switchLang}
                aria-haspopup="listbox"
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs font-semibold tracking-wide uppercase">
                  {lang}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-52 p-1.5">
              <ul role="listbox" aria-label={t.a11y.switchLang}>
                {LANG_CODES.map((code) => (
                  <li key={code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={lang === code}
                      onClick={() => switchLang(code)}
                      className={cn(
                        "flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-3 text-left text-sm transition-colors",
                        lang === code
                          ? "bg-primary/10 font-semibold text-primary"
                          : "font-medium text-foreground hover:bg-muted"
                      )}
                    >
                      <span lang={code}>{LANG_NAMES[code]}</span>
                      {lang === code && (
                        <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>

          {/* Dostopnostna plošča — lastna, brez zunanjih prekrivnih
              gradnikov (priporočilo AAM; vzorec: muzeji za vsakega) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hidden size-11 md:inline-flex"
                aria-label={t.a11y.openPanel}
              >
                <Accessibility className="h-4.5 w-4.5" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-base font-semibold">
                    {t.a11yPanel.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t.a11yPanel.subtitle}
                  </p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Accessibility className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <Separator className="my-3" />
              <A11ySettingsList />
              <Separator className="my-3" />
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {customized ? t.a11yPanel.savedNote : t.a11yPanel.systemNote}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="min-h-9 gap-1"
                  onClick={reset}
                  aria-label={t.a11yPanel.resetLabel}
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  {t.a11yPanel.reset}
                </Button>
              </div>
            </PopoverContent>
          </Popover>

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

          {/* Mobilni/hamburger meni — viden do xl, ker namizna vrstica
              stopnjuje število rubrik po širini (glava brez preliva) */}
          <Button
            variant="outline"
            size="icon"
            className="size-11 xl:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Spustni meni (hamburger) — odprt do xl */}
      {menuOpen && (
        <nav
          aria-label={t.a11y.mainNav}
          className="border-t border-border bg-background px-4 pb-4 pt-2 xl:hidden"
        >
          <ul className="grid gap-1">
            {MOBILE_NAV_VIEWS.map((key) => (
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
            <li>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenGuide();
                }}
                className="flex min-h-11 w-full items-center gap-2.5 rounded-md px-3 text-left text-base font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <MessageCircleQuestion className="h-4.5 w-4.5" aria-hidden="true" />
                {t.guide.title}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenCurator();
                }}
                className="flex min-h-11 w-full items-center gap-2.5 rounded-md px-3 text-left text-base font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Scale className="h-4.5 w-4.5" aria-hidden="true" />
                {t.curator.title}
              </button>
            </li>
          </ul>

          {/* Dostopnost — stikala neposredno v mobilnem meniju */}
          <div className="mt-3 rounded-lg border border-border/70 bg-muted/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Accessibility className="h-4 w-4 text-primary" aria-hidden="true" />
                {t.a11yPanel.title}
              </p>
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {t.a11yPanel.reset}
              </button>
            </div>
            <div className="mt-2">
              <A11ySettingsList compact />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
