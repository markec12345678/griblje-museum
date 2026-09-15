/**
 * OpenRouter — LLM odjemalec za vodnika muzeja (brezplačna veja).
 *
 * Zakaj: poleg HuggingFace ima OpenRouter spletni katalog brezplačnih
 * (»:free«) modelov, ki jih brezplačen račun lahko uporablja brez kartice.
 * Preizkušeno (september 2026): veriga spodaj odgovarja v živi slovenščini,
 * spoštuje dosje zbirke in obliko navedkov [[slug]].
 *
 * Brezplačna veja ima meje (brez nakupa kredita): ~20 zahtev/min in
 * ~50 zahtev/dan na ključ — zato je vodnik še vedno podprt z z-ai rezervo,
 * omejitev hitrosti na poti /api/guide pa drži porabo v okviru.
 *
 * Konfiguracija (env, nikoli v gitu — .env.local / Vercel env vars):
 *   OPENROUTER_API_KEY        — ključ oblike sk-or-v1-… iz openrouter.ai
 *   OPENROUTER_MODEL (neobvezno) — izrecen model, ki naj bo poskusen prvi
 *
 * Varnost: ključ bere izključno strežnik (ta modul uvažata samo strežniške
 * poti); brskalnik nikoli ne vidi žetona.
 */

type OrMessage = { role: "system" | "user" | "assistant"; content: string };

const BASE_URL = "https://openrouter.ai/api/v1";

/**
 * Veriga BREZPLAČNIH modelov, preizkušenih na slovenščini (26 zapisov
 * zbirke ~15k žetonov — vsi spodaj imajo kontekst ≥ 128k):
 *   1. inclusionai/ling-3.0-flash-vl — najboljša živa slovenščina,
 *      pravilna izhodišča in navedki [[slug]]; ~2–4 s
 *   2. inclusionai/ling-3.0-flash-sante — ista družina, dober nadomestek
 *   3. poolside/laguna-s-2.1 — pravilno, a osredkano; zanesljiva rezerva
 *   4. dots-studio/dots-3-note-preview — zadnja rezerva (svetovno znanje
 *      šibkejše, a odgovarja izključno iz dosjeja)
 * Če je nastavljen OPENROUTER_MODEL, gre ta prvi na vrsto.
 */
const MODEL_CHAIN: string[] = [
  "inclusionai/ling-3.0-flash-vl:free",
  "inclusionai/ling-3.0-flash-sante:free",
  "poolside/laguna-s-2.1:free",
  "dots-studio/dots-3-note-preview:free",
];

/** Skupni proračun časa — pot /api/guide ima maxDuration 60 s. */
const OVERALL_BUDGET_MS = 50_000;
/** Najdaljši čakalni čas posameznega modela. */
const PER_MODEL_TIMEOUT_MS = 40_000;

let stickyModel: string | null = null;

function openRouterKey(): string | null {
  const raw = process.env.OPENROUTER_API_KEY ?? process.env.OPENROUTER_KEY;
  return raw && raw.trim() ? raw.trim() : null;
}

/** Ali je OpenRouter ponudnik pripravljen (nastavljen veljavno videč ključ). */
export function isOpenRouterChatConfigured(): boolean {
  return openRouterKey() !== null;
}

function chain(): string[] {
  const explicit = process.env.OPENROUTER_MODEL?.trim();
  const models = explicit ? [explicit, ...MODEL_CHAIN] : [...MODEL_CHAIN];
  // Lepljivi model: tisti, ki je nazadnje uspel, poskusimo najprej —
  // prepreči vsakokratno prestopanje ob zasedenem prvem modelu.
  if (stickyModel) {
    const i = models.indexOf(stickyModel);
    if (i > 0) models.unshift(...models.splice(i, 1));
  }
  return models;
}

type OrOptions = {
  temperature?: number;
  maxTokens?: number;
};

/**
 * En krožen pogovor: pošlje sporočila prvim razpoložljivemu modelu iz
 * verige. Vrne besedilo odgovora; ob neuspehu vseh modelov vrne zadnjo
 * napako.
 *
 * Razvrščanje napak:
 *   401/403 — ključ je napačen ali brez pravic: takoj navzgor (preizkušanje
 *             drugih modelov z istim ključem nima smisla),
 *   402     — model zahteva kredit (pri :free modelih ne pride v poštev,
 *             a varnostno prestopimo na naslednjega),
 *   429     — dnevna/minutna meja ali zaseden ponudnik: naslednji model,
 *   5xx     — napaka ponudnika gorivo navzgor: naslednji model.
 */
export async function openRouterChatComplete(
  messages: OrMessage[],
  options: OrOptions = {},
): Promise<string> {
  const key = openRouterKey();
  if (!key) throw new Error("OPENROUTER_API_KEY ni nastavljen");

  const temperature = options.temperature ?? 0.4;
  const maxTokens = options.maxTokens ?? 500;
  const deadline = Date.now() + OVERALL_BUDGET_MS;

  let lastError: unknown = null;

  for (const model of chain()) {
    const remaining = deadline - Date.now();
    if (remaining < 5_000) break; // ne začni poskusa, ki ga pot ne more čakati

    try {
      const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          // Priporočena identificirana aplikacija (OpenRouter atribucija).
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL ?? "https://griblje-museum.vercel.app",
          "X-Title": "Muzej vasi Griblje",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          // Izklopljeno notranje razmišljanje: nekateri brezplačni modeli
          // (npr. ling-3.0 prek Novite) sicer najprej „razmislijo“ po angleško
          // — to pogosto poje večino proračuna žetonov, vsebina pa se reže
          // sredi stavka ali sploh ne nastane (content: null, finish: length).
          // Preizkušeno: z izklopmom je odgovor reden, zaključen in ~3× hitrejši.
          reasoning: { enabled: false },
          stream: false,
        }),
        signal: AbortSignal.timeout(Math.min(PER_MODEL_TIMEOUT_MS, remaining)),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        const brief = body.slice(0, 200).replace(/\s+/g, " ");
        if (res.status === 401 || res.status === 403) {
          throw new Error(
            `OpenRouter: ključ zavrnjen (HTTP ${res.status}) — preveri veljavnost ključa`,
          );
        }
        // Računovska (ne modelska) omejitev: dnevna/minutna kvota celotnega
        // brezplačnega računa — vsi :free modeli bodo enako zavrnjeni,
        // prestopanje po verigi je jalovo. Takoj končaj ponudnika.
        if (res.status === 429 && /free-models-per-(day|minute)/i.test(body)) {
          throw new Error(
            `OpenRouter: brezplačna dnevna kvota presežena (napaka 429) — dodaš 10 USD kredita za 1000 zahtev/dan ali počakaj ponastavitev`,
          );
        }
        // 402/429/5xx … → preizkusi naslednji model v verigi.
        lastError = new Error(`OpenRouter ${model}: HTTP ${res.status} ${brief}`);
        if (res.status === 429) {
          await new Promise((r) => setTimeout(r, 1_200));
        }
        continue;
      }

      const data = (await res.json()) as {
        choices?: {
          finish_reason?: string;
          message?: { content?: unknown; reasoning?: unknown };
        }[];
      };
      const choice = data.choices?.[0];
      const content = choice?.message?.content;
      if (typeof content === "string" && content.trim()) {
        if (choice?.finish_reason === "length") {
          // Odgovor je bil rezan na stropu žetonov (navadno kvečjemu ob
          // vklopljenem razmišljanju, ki ga zgoraj izklapljamo) — rez
          // sredi stavka je za vodnika slab odgovor, prestopi na naslednji.
          lastError = new Error(
            `OpenRouter ${model}: odgovor rezan (finish_reason=length)`,
          );
          continue;
        }
        stickyModel = model;
        return content;
      }
      lastError = new Error(`OpenRouter ${model}: prazen odgovor`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/ključ zavrnjen|HTTP 40[13]/.test(message)) throw error;
      // Prekinitev ali omrežna napaka na tem modelu → naslednji model.
      lastError = error;
    }
  }

  throw lastError ?? new Error("OpenRouter: noben model iz verige ni odgovoril");
}
