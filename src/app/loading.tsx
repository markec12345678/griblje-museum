import { Landmark } from "lucide-react";

/**
 * Nalagalno stanje korenskega segmenta — strežniška komponenta, izrisana
 * med pretakanjem, še pred kakršno koli odjemalsko kodo. Brez odvisnosti
 * od kontekstov in prevodov (jezik URL-ja še ni znan): dvojezična oznaka
 * sl/en, kot pri metapodatkih muzeja (glej layout.tsx).
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground"
      role="status"
      aria-live="polite"
    >
      <div className="animate-pulse">
        <div className="flex size-16 items-center justify-center rounded-full border border-border bg-card shadow-sm">
          <Landmark className="size-8 text-muted-foreground" aria-hidden="true" />
        </div>
      </div>

      <p className="mt-6 font-display text-lg font-medium text-foreground/80">
        Odpiram muzej …
      </p>
      <p className="mt-1 text-sm text-muted-foreground">Opening the museum …</p>

      <span className="sr-only">Nalaganje / Loading</span>
    </div>
  );
}
