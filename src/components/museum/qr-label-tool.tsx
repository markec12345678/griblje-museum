"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";
import { Printer, Search } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibits } from "@/hooks/use-museum";
import { normalize } from "@/lib/normalize";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Orodje za QR oznake fizičnega muzeja (minimalni model).
 *
 * Vsak zapis ima od 29. sklopa trajni, strežniško renderiran naslov
 * /exponat/[slug] — zato lahko fizični predmet, fotografija ali lokacija
 * v vasi nosi preprosto tiskano oznako s kodo QR (vzorec: QR-mostovi
 * Valdresmusea in muzejev na prostem). Koda vodi na stran zapisa:
 * fotografija, zgodba, viri, status dokaza, sosednji zapis — gumb
 * »Odpri v muzeju« pa obiskovalca popelje v živi digitalni muzej.
 *
 * Oznaka je namenjena tisku (A6): črno na belem, brez barvnih odvisnosti.
 * Tiskalna kopija živi v portalu na <body> (.qr-print-root, display:none
 * na zaslonu) — enak vzorec kot tisk razglednice, da aplikacija ne moti
 * tiska (glej globals.css).
 */
export function QrLabelTool() {
  const { t, lang } = useLang();
  const exhibitsQuery = useExhibits();

  const [query, setQuery] = React.useState("");
  const [selectedSlug, setSelectedSlug] = React.useState<string | null>(null);
  const [qrSvg, setQrSvg] = React.useState<string | null>(null);
  const [portalReady, setPortalReady] = React.useState(false);

  const exhibits = exhibitsQuery.data ?? [];
  const selected = React.useMemo(
    () => exhibits.find((ex) => ex.slug === selectedSlug) ?? null,
    [exhibits, selectedSlug]
  );

  // Med delovanjem orodja telo nosi razred za izolacijo tiskanja.
  React.useEffect(() => {
    document.body.classList.add("qr-printing");
    setPortalReady(true);
    return () => {
      document.body.classList.remove("qr-printing");
      setPortalReady(false);
    };
  }, []);

  // Generiranje kode QR za kanonični naslov zapisa (SVG — oster tisk).
  const recordUrl = selected ? `${window.location.origin}/exponat/${selected.slug}` : null;
  React.useEffect(() => {
    if (!recordUrl) {
      setQrSvg(null);
      return;
    }
    let alive = true;
    QRCode.toString(recordUrl, {
      type: "svg",
      margin: 1,
      width: 220,
      errorCorrectionLevel: "M",
    })
      .then((svg) => {
        if (alive) setQrSvg(svg);
      })
      .catch(() => {
        if (alive) setQrSvg(null);
      });
    return () => {
      alive = false;
    };
  }, [recordUrl]);

  const filtered = React.useMemo(() => {
    const q = normalize(query);
    if (!q) return exhibits.slice(0, 12);
    return exhibits
      .filter((ex) => {
        const hay = normalize(
          `${ex.titleSi} ${ex.titleEn} ${ex.slug} ${ex.museumNo ?? ""}`
        );
        return hay.includes(q);
      })
      .slice(0, 24);
  }, [exhibits, query]);

  const title = (ex: { titleSi: string; titleEn: string }) =>
    lang === "sl" || lang === "hr" ? ex.titleSi : ex.titleEn;

  /** Tiskalna kartica oznake — črno na belem, A6. */
  const labelCard = selected ? (
    <div className="w-full max-w-sm border-2 border-black bg-white p-6 text-black shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
        Muzej vasi Griblje · Griblje Village Museum
      </p>
      <hr className="my-3 border-black/60" aria-hidden="true" />

      <p className="font-display text-xl font-semibold leading-snug">
        {title(selected)}
      </p>
      <p className="mt-1.5 text-sm">
        {selected.museumNo ? `${selected.museumNo} · ` : ""}
        {lang === "sl" || lang === "hr" ? selected.periodSi : selected.periodEn}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-black/70">
        {t.evidence.label}: {t.evidence[selected.evidenceStatus]}
      </p>

      {qrSvg ? (
        <div
          role="img"
          aria-label={t.qrLabels.qrAlt}
          className="mt-4 [&>svg]:h-auto [&>svg]:w-full"
          // SVG knjižnice qrcode — lastna vsebina, brez skriptov.
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />
      ) : (
        <div className="mt-4 aspect-square w-full animate-pulse bg-black/5" />
      )}

      <p className="mt-3 break-all text-center text-[11px] leading-snug text-black/80">
        {recordUrl}
      </p>
      <p className="mt-1.5 text-center text-[11px] italic text-black/60">
        {t.qrLabels.scanHint}
      </p>
    </div>
  ) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
      {/* Izbirnik zapisa */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t.qrLabels.pickTitle}
        </h3>

        <div className="relative mt-3">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.qrLabels.searchPlaceholder}
            aria-label={t.qrLabels.searchLabel}
            className="min-h-11 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="museum-scroll mt-3 max-h-96 overflow-y-auto rounded-lg border">
          {exhibitsQuery.isLoading ? (
            <div className="space-y-2 p-3">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <p className="sr-only">{t.qrLabels.loading}</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">{t.qrLabels.noResults}</p>
          ) : (
            <ul className="divide-y">
              {filtered.map((ex) => (
                <li key={ex.slug}>
                  <button
                    type="button"
                    onClick={() => setSelectedSlug(ex.slug)}
                    aria-current={selectedSlug === ex.slug ? "true" : undefined}
                    className={`flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-primary/5 ${
                      selectedSlug === ex.slug ? "bg-primary/10 font-medium text-primary" : ""
                    }`}
                  >
                    <span className="min-w-0 truncate">{title(ex)}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {ex.museumNo ?? ex.slug}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 rounded-lg border bg-muted/40 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.qrLabels.howTitle}
          </h4>
          <ol className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            <li>1. {t.qrLabels.how1}</li>
            <li>2. {t.qrLabels.how2}</li>
            <li>3. {t.qrLabels.how3}</li>
            <li>4. {t.qrLabels.how4}</li>
          </ol>
        </div>
      </div>

      {/* Predogled oznake na zaslonu */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {selected
            ? `${t.qrLabels.recordOf}: ${selected.museumNo ?? selected.slug}`
            : t.qrLabels.recordOf}
        </h3>

        {!selected ? (
          <div className="mt-3 flex min-h-64 items-center justify-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t.qrLabels.pickTitle}
          </div>
        ) : (
          <>
            <figure
              className="mt-3 flex justify-center"
              aria-label={`${t.qrLabels.recordOf}: ${title(selected)}`}
            >
              {labelCard}
            </figure>

            <Button
              type="button"
              onClick={() => window.print()}
              className="mt-4 w-full"
            >
              <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.qrLabels.print}
            </Button>
          </>
        )}
      </div>

      {/* Tiskalna kopija — portal na <body>, viden SAMO ob tisku
          (enak vzorec kot .postcard-print-root razglednice). */}
      {portalReady &&
        selected &&
        createPortal(
          <div className="qr-print-root" aria-hidden="true">
            {labelCard}
          </div>,
          document.body
        )}
    </div>
  );
}
