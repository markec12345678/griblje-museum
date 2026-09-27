"use client";

import * as React from "react";
import Link from "next/link";
import { Landmark, Library, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Stran 404 — »Ta predmet ni v zbirki.«
 *
 * Namerno SAMOZADOSTNA (ne uporablja LanguageProviderja iz @/lib/i18n):
 * stran mora delovati tudi, če je vzrok napake ravno v ponudnikih
 * (Providers), in ne sme razbiti invariant verify-i18n (1074 ključev × 5).
 * Jezik preberemo z istim vzorcem kot i18n.tsx — parameter ?lang= v URL —
 * privzeto sl, kar se ujema z <html lang="sl"> v layout.tsx (brez
 * hidratacijskega nesoglasja: SSR izriše sl, jezik se zamenja šele v
 * učinku po montiranju).
 */

type UILang = "sl" | "en" | "hr" | "de" | "it";

const copy: Record<
  UILang,
  { eyebrow: string; title: string; text: string; home: string; collection: string }
> = {
  sl: {
    eyebrow: "Napaka 404",
    title: "Ta predmet ni v zbirki",
    text: "Naslov, ki ste ga odprli, ne ustreza nobenemu zapisu muzeja. Morda je bil zapis preimenovan, ali pa se je v naslovu skrila tipkarska motnja.",
    home: "Nazaj v muzej",
    collection: "Prebrskaj zbirko",
  },
  en: {
    eyebrow: "Error 404",
    title: "This item is not in the collection",
    text: "The address you opened does not match any record in the museum. The record may have been renamed, or a typo slipped into the address.",
    home: "Back to the museum",
    collection: "Browse the collection",
  },
  hr: {
    eyebrow: "Pogreška 404",
    title: "Ovaj predmet nije u zbirci",
    text: "Adresa koju ste otvorili ne odgovara nijednom zapisu muzeja. Možda je zapis preimenovan, ili se u adresu uvukla tipkarska pogreška.",
    home: "Natrag u muzej",
    collection: "Prelistaj zbirku",
  },
  de: {
    eyebrow: "Fehler 404",
    title: "Dieser Gegenstand ist nicht in der Sammlung",
    text: "Die aufgerufene Adresse entspricht keinem Eintrag des Museums. Vielleicht wurde der Eintrag umbenannt, oder in der Adresse hat sich ein Tippfehler versteckt.",
    home: "Zurück ins Museum",
    collection: "Sammlung durchstöbern",
  },
  it: {
    eyebrow: "Errore 404",
    title: "Questo oggetto non è nella collezione",
    text: "L'indirizzo aperto non corrisponde a nessuna scheda del museo. La scheda potrebbe essere stata rinominata, o nell'indirizzo si è nascosto un refuso.",
    home: "Torna al museo",
    collection: "Sfoglia la collezione",
  },
};

function isUILang(value: string | null): value is UILang {
  return value === "sl" || value === "en" || value === "hr" || value === "de" || value === "it";
}

export default function NotFound() {
  const [lang, setLang] = React.useState<UILang>("sl");

  React.useEffect(() => {
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (isUILang(urlLang)) setLang(urlLang);
  }, []);

  const c = copy[lang];

  /* Jezik ohranimo tudi v povezavah nazaj (pogledi muzeja se usklajujejo
   * prek hash-a — #zbirka — glej museum-app.tsx). */
  const langQ = lang === "sl" ? "" : `?lang=${lang}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-foreground">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        {/* Vrstni predmet: 404 je »inventarna številka« zapisu, ki ga ni. */}
        <div className="flex size-16 items-center justify-center rounded-full border border-border bg-card shadow-sm">
          <Landmark className="size-8 text-muted-foreground" aria-hidden="true" />
        </div>

        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {c.eyebrow}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">{c.title}</h1>
        <p className="mt-4 max-w-sm text-balance text-muted-foreground">{c.text}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={`/${langQ}`}>
              <Home className="size-4" aria-hidden="true" />
              {c.home}
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href={`/${langQ}#zbirka`}>
              <Library className="size-4" aria-hidden="true" />
              {c.collection}
            </Link>
          </Button>
        </div>

        <p className="mt-10 font-mono text-[11px] text-muted-foreground/70">
          Muzej vasi Griblje · Griblje Village Museum
        </p>
      </div>
    </main>
  );
}
