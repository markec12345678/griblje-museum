"use client";

/**
 * Odjemalski sledilnik statistike obiska (zbirni, anonimni).
 *
 * Pošilja fire-and-forget na /api/stats; obisk (kind "visit") se šteje samo
 * enkrat na sejo brskalnika (sessionStorage). Brez piškotkov, brez IP-jev,
 * brez identifikatorjev — statistika nikoli ne sme pokvariti obiska, zato
 * vse napake pogljemo tiho.
 */

export type StatKind = "visit" | "open" | "walk" | "guide" | "audio" | "ar";

const VISIT_GUARD = "mvg-stats-visit";

export function trackStat(kind: StatKind, key?: string, lang: string = "sl"): void {
  try {
    void fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, key, lang }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // zasebni način brskalnika ali prekinjena povezava — tiho
  }
}

/** En obisk na sejo brskalnika (enako stopnicam muzeja: en vstop = en obisk). */
export function trackVisitOnce(lang: string = "sl"): void {
  try {
    if (window.sessionStorage.getItem(VISIT_GUARD)) return;
    window.sessionStorage.setItem(VISIT_GUARD, "1");
    trackStat("visit", undefined, lang);
  } catch {
    // sessionStorage nedostopen (Safari zasebni način) — štej brezo guardom
    trackStat("visit", undefined, lang);
  }
}
