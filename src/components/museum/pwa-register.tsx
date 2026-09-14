"use client";

import * as React from "react";
import { WifiOff } from "lucide-react";
import { useLang } from "@/lib/i18n";

/**
 * Muzej v žepu — registracija service workerja in obvestilo brez
 * povezave. Vzorec: multimedijski vodnik Van Goghovega muzeja, ki
 * obiskovalcem deluje tudi brez povezave (namestitev na domači zaslon,
 * predpomnjena zbirka in avdio vodnik — glej public/sw.js).
 *
 * Registracija poteka le v produkciji: v razvojni različici bi
 * predpomnilnik zastiral vroče nalaganje.
 */
export function PwaRegister() {
  const { t } = useLang();
  const [offline, setOffline] = React.useState(false);

  React.useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Namestitev ni uspela (npr. podpora brskalnika) — muzej deluje naprej.
      });
    }

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-16 z-[60] flex justify-center px-4"
    >
      <p className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg">
        <WifiOff className="h-4 w-4" aria-hidden="true" />
        {t.offline.banner}
      </p>
    </div>
  );
}
