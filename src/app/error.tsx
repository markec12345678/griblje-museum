"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, Home, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Meja napak (error boundary) korenskega segmenta — pokliče se, kadar
 * upodabljanje segmenta ne uspe (napaka v vsebini, omrežju ali kodi).
 *
 * Namerno SAMOZADOSTNA: ne uporablja LanguageProviderja, ThemeProviderja
 * niti framer-motion — vse tri je treba obdržati zunaj, saj je lahko
 * vzrok napake ravno v njih (vzorec Next.js: »error.js mora biti
 * client component, ki ne zanaša na kontekst, ki jo je sprožil«).
 * Jezik preberemo z istim vzorcem kot i18n.tsx — parameter ?lang= —
 * privzeto sl (ujema se z <html lang="sl">), zamenjava šele v učinku,
 * da hidratacija ostane deterministična.
 */

type UILang = "sl" | "en" | "hr" | "de" | "it";

const copy: Record<
  UILang,
  { title: string; text: string; retry: string; home: string; digestLabel: string }
> = {
  sl: {
    title: "Nekaj je šlo narobe",
    text: "Prišlo je do nepričakovane napake. Vaš obisk ni izgubljen — poskusite znova ali se vrnite v muzej.",
    retry: "Poskusi znova",
    home: "Nazaj v muzej",
    digestLabel: "Oznaka napake (ob vlogi prilozite)",
  },
  en: {
    title: "Something went wrong",
    text: "An unexpected error occurred. Your visit is not lost — try again or return to the museum.",
    retry: "Try again",
    home: "Back to the museum",
    digestLabel: "Error reference (attach when reporting)",
  },
  hr: {
    title: "Nešto je pošlo po zlu",
    text: "Došlo je do neočekivane pogreške. Vaš obisk nije izgubljen — pokušajte ponovno ili se vratite u muzej.",
    retry: "Pokušaj ponovno",
    home: "Natrag u muzej",
    digestLabel: "Oznaka pogreške (priložite uz prijavu)",
  },
  de: {
    title: "Etwas ist schiefgelaufen",
    text: "Es ist ein unerwarteter Fehler aufgetreten. Ihr Besuch ist nicht verloren — versuchen Sie es erneut oder kehren Sie ins Museum zurück.",
    retry: "Erneut versuchen",
    home: "Zurück ins Museum",
    digestLabel: "Fehlerkennung (bei Meldung beifügen)",
  },
  it: {
    title: "Qualcosa è andato storto",
    text: "Si è verificato un errore imprevisto. La visita non è perduta — riprova o torna al museo.",
    retry: "Riprova",
    home: "Torna al museo",
    digestLabel: "Riferimento errore (allegare alla segnalazione)",
  },
};

function isUILang(value: string | null): value is UILang {
  return value === "sl" || value === "en" || value === "hr" || value === "de" || value === "it";
}

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [lang, setLang] = React.useState<UILang>("sl");

  React.useEffect(() => {
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (isUILang(urlLang)) setLang(urlLang);
  }, []);

  const c = copy[lang];
  const langQ = lang === "sl" ? "" : `?lang=${lang}`;

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-foreground"
      role="alert"
    >
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 shadow-sm">
          <TriangleAlert className="size-8 text-destructive" aria-hidden="true" />
        </div>

        <h1 className="mt-6 font-display text-4xl font-semibold sm:text-5xl">{c.title}</h1>
        <p className="mt-4 max-w-sm text-balance text-muted-foreground">{c.text}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} size="lg">
            <RotateCcw className="size-4" aria-hidden="true" />
            {c.retry}
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href={`/${langQ}`}>
              <Home className="size-4" aria-hidden="true" />
              {c.home}
            </Link>
          </Button>
        </div>

        {/* Digest Next.js posredujemo kot »inventarno številko« napake —
            olajša iskanje po dnevnikih (Vercel/Render) brez razkrivanja
            podrobnosti izdaje. */}
        {error.digest ? (
          <p className="mt-10 font-mono text-[11px] text-muted-foreground/70">
            {c.digestLabel}: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}
