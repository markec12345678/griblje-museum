"use client";

/**
 * Odjemalski sledilnik statistike obiska (zbirni, anonimni).
 *
 * Pošilja fire-and-forget na /api/stats; obisk (kind "visit") se šteje samo
 * enkrat na sejo brskalnika (sessionStorage). Brez piškotkov, brez IP-jev,
 * brez identifikatorjev — statistika nikoli ne sme pokvariti obiska, zato
 * vse napake pogljemo tiho.
 *
 * Na bralnih namestitvah (Vercel/Lambda — SQLite ni zapisljiv) strežnik
 * odgovori {ok:false, readOnly:true}; takrat si to zapomnimo v sejo, da
 * lahki vmesnik pokaže pošteno opombo namesto ničel brez razlage.
 */

export type StatKind = "visit" | "open" | "walk" | "guide" | "audio" | "ar";

const VISIT_GUARD = "mvg-stats-visit";
const READONLY_FLAG = "mvg-stats-readonly";

async function postStat(body: string): Promise<{ ok: boolean; readOnly?: boolean }> {
  try {
    const res = await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
    if (!res.ok) return { ok: false };
    return (await res.json().catch(() => ({ ok: false }))) as {
      ok: boolean;
      readOnly?: boolean;
    };
  } catch {
    return { ok: false };
  }
}

export function trackStat(kind: StatKind, key?: string, lang: string = "sl"): void {
  void postStat(JSON.stringify({ kind, key, lang })).then((result) => {
    if (result.readOnly) {
      try {
        window.sessionStorage.setItem(READONLY_FLAG, "1");
      } catch {
        /* zasebni način — tiho */
      }
    }
  });
}

/** Ali je ta namestitev bralna (števci se ne zbirajo)? Prebere sejo. */
export function isStatsReadOnly(): boolean {
  try {
    return window.sessionStorage.getItem(READONLY_FLAG) === "1";
  } catch {
    return false;
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
