"use client";

import * as React from "react";

/**
 * Dostopnostna plošča muzeja (vzorec: lastna vrstica za dostopnost namesto
 * zunanjih prekrivnih gradnikov — priporočilo Sine Bahram / AAM). Vsaka
 * možnost je neodvisen stikalo, ki ga obiskovalec preklopi sam; privzeto
 * spošujemo sistemske nastavitve (prefers-contrast, prefers-reduced-motion),
 * ročna izbira pa jo preglasi in se shrani v brskalnik.
 */

const STORAGE_KEY = "mvg-a11y";

export type A11ySettings = {
  /** Večja osnovna pisava (rem lestvica +12,5 %). */
  largeText: boolean;
  /** Močnejši kontrast (prepisi barvnih spremenljivk). */
  highContrast: boolean;
  /** Pisava za ljudi z disleksijo (Atkinson Hyperlegible + večji razmiki). */
  dyslexic: boolean;
  /** Mirni gibi — izklopi animacije, tudi če sistem tega ne zahteva. */
  calmMotion: boolean;
  /** Vedno podčrtane povezave. */
  linkUnderlines: boolean;
};

export const DEFAULT_A11Y: A11ySettings = {
  largeText: false,
  highContrast: false,
  dyslexic: false,
  calmMotion: false,
  linkUnderlines: false,
};

const SETTING_ORDER: (keyof A11ySettings)[] = [
  "largeText",
  "highContrast",
  "dyslexic",
  "calmMotion",
  "linkUnderlines",
];

function parseStored(raw: string | null): Partial<A11ySettings> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Partial<A11ySettings> = {};
    for (const key of SETTING_ORDER) {
      if (typeof parsed[key] === "boolean") {
        out[key] = parsed[key] as boolean;
      }
    }
    return out;
  } catch {
    return null;
  }
}

type A11yContextValue = {
  settings: A11ySettings;
  /** true, ko je bila vsaj ena možnost ročno izbrana (ne samo sistemska privzeta). */
  customized: boolean;
  toggle: (key: keyof A11ySettings) => void;
  reset: () => void;
};

const A11yContext = React.createContext<A11yContextValue>({
  settings: DEFAULT_A11Y,
  customized: false,
  toggle: () => {},
  reset: () => {},
});

export function A11yProvider({ children }: { children: React.ReactNode }) {
  // Privzete vrednosti se ob prihodu prilagodijo sistemskim nastavitvam
  // (prefers-contrast: more / prefers-reduced-motion: reduce).
  const [settings, setSettings] = React.useState<A11ySettings>(DEFAULT_A11Y);
  const [customized, setCustomized] = React.useState(false);

  React.useEffect(() => {
    const stored = parseStored(window.localStorage.getItem(STORAGE_KEY));
    if (stored) {
      setSettings((prev) => ({ ...prev, ...stored }));
      setCustomized(true);
      return;
    }
    const wantsContrast = window.matchMedia("(prefers-contrast: more)").matches;
    const wantsCalm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (wantsContrast || wantsCalm) {
      setSettings((prev) => ({
        ...prev,
        highContrast: wantsContrast,
        calmMotion: wantsCalm,
      }));
    }
  }, []);

  // Razredi na <html> — samo v učinku, da je središče strani hidracijsko varno.
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-large", settings.largeText);
    root.classList.toggle("a11y-contrast", settings.highContrast);
    root.classList.toggle("a11y-dyslexic", settings.dyslexic);
    root.classList.toggle("a11y-calm", settings.calmMotion);
    root.classList.toggle("a11y-links", settings.linkUnderlines);
  }, [settings]);

  // Izbire se sinhronizirajo med zavihki (enak mehanizem kot jezik).
  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const stored = parseStored(event.newValue);
      if (stored) {
        setSettings((prev) => ({ ...prev, ...stored }));
        setCustomized(true);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = React.useCallback((key: keyof A11ySettings) => {
    setCustomized(true);
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = React.useCallback(() => {
    setCustomized(false);
    setSettings(DEFAULT_A11Y);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = React.useMemo(
    () => ({ settings, customized, toggle, reset }),
    [settings, customized, toggle, reset]
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y() {
  return React.useContext(A11yContext);
}

/** Seznam razredov na <html> — za tisk in morebitne druge poti. */
export function a11yClasses(settings: A11ySettings): string[] {
  const classes: string[] = [];
  if (settings.largeText) classes.push("a11y-large");
  if (settings.highContrast) classes.push("a11y-contrast");
  if (settings.dyslexic) classes.push("a11y-dyslexic");
  if (settings.calmMotion) classes.push("a11y-calm");
  if (settings.linkUnderlines) classes.push("a11y-links");
  return classes;
}
