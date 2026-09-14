"use client";

import * as React from "react";
import { Contrast, Feather, Link as LinkIcon, Type, CaseSensitive } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useA11y, type A11ySettings } from "@/lib/a11y";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type ToggleKey = keyof A11ySettings;

const TOGGLES: {
  key: ToggleKey;
  icon: React.ElementType;
  labelKey: "largeText" | "highContrast" | "dyslexic" | "calmMotion" | "linkUnderlines";
  hintKey: "largeTextHint" | "highContrastHint" | "dyslexicHint" | "calmMotionHint" | "linkUnderlinesHint";
}[] = [
  { key: "largeText", icon: Type, labelKey: "largeText", hintKey: "largeTextHint" },
  { key: "highContrast", icon: Contrast, labelKey: "highContrast", hintKey: "highContrastHint" },
  { key: "dyslexic", icon: CaseSensitive, labelKey: "dyslexic", hintKey: "dyslexicHint" },
  { key: "calmMotion", icon: Feather, labelKey: "calmMotion", hintKey: "calmMotionHint" },
  { key: "linkUnderlines", icon: LinkIcon, labelKey: "linkUnderlines", hintKey: "linkUnderlinesHint" },
];

/**
 * Seznam dostopnostnih stikal — skupen namizni plošči (Popover v glavi)
 * in mobilnemu spustnemu meniju. Vsako stikalo je neodvisno; napovedi
 * sprememb tečejo prek prijaznega aria-live območja.
 */
export function A11ySettingsList({ compact = false }: { compact?: boolean }) {
  const { t } = useLang();
  const { settings, toggle } = useA11y();
  const announceRef = React.useRef<HTMLParagraphElement>(null);
  const interacted = React.useRef(false);

  // Prijazna napoved spremembe (samo po ročnem stiku, ne ob prvem prikazu).
  React.useEffect(() => {
    if (!interacted.current) return;
    if (announceRef.current) {
      announceRef.current.textContent = t.a11yPanel.announced;
      window.setTimeout(() => {
        if (announceRef.current) announceRef.current.textContent = "";
      }, 1600);
    }
  }, [settings, t]);

  return (
    <div className={cn("grid", compact ? "gap-1" : "gap-2")}>
      {TOGGLES.map(({ key, icon: Icon, labelKey, hintKey }) => (
        <label
          key={key}
          htmlFor={`a11y-${key}`}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-2 transition-colors hover:border-border/60 hover:bg-muted/60",
            compact ? "min-h-11 py-1.5" : "py-2.5"
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1 select-none">
            <span className="block text-sm font-medium leading-tight">
              {t.a11yPanel[labelKey]}
            </span>
            {!compact && (
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {t.a11yPanel[hintKey]}
              </span>
            )}
          </span>
          <Switch
            id={`a11y-${key}`}
            checked={settings[key]}
            onCheckedChange={() => {
              interacted.current = true;
              toggle(key);
            }}
          />
        </label>
      ))}
      <p ref={announceRef} aria-live="polite" className="sr-only" />
    </div>
  );
}
