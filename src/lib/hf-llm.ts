/**
 * Hugging Face Inference Providers — LLM odjemalec za vodnika muzeja.
 *
 * Zakaj: primarni SDK (z-ai) ima dnevno kvoto, ki ob izčrpanju onesposobi
 * pogovor z zbirko. HuggingFace ponuja OpenAI-kompatibilen „router"
 * (https://router.huggingface.co/v1), prek katerega lahko brezplačni
 * račun uporablja vrhunske odprte modele — z nadomestnimi modeli, če je
 * prvi zaseden.
 *
 * Konfiguracija (env, nikoli v gitu — .env.local / Vercel env vars):
 *   HF_API_KEY  ali HUGGINGFACE_API_KEY  — žeton oblike hf_… z dovoljenjem
 *                                           „Make calls to Inference Providers"
 *   HF_MODEL    (neobvezno) — izrecen model, ki naj bo poskusjen prvi
 *   HF_BASE_URL (neobvezno) — privzeto https://router.huggingface.co/v1
 *
 * Varnost: ključ bere izključno strežnik (ta modul uvažata samo strežniški
 * poti); brskalnik nikoli ne vidi žetona.
 */

type HfMessage = { role: "system" | "user" | "assistant"; content: string };

const DEFAULT_BASE_URL = "https://router.huggingface.co/v1";

/**
 * Veriga modelov po kakovosti slovenščine. Vsi so večjezikovni ukazni
 * (instruct) modeli, ki slovenščino govorijo tekoče, ne kot prevod:
 *   1. Llama 3.3 70B  — najboljša naravna slovenščina med odprtimi modeli
 *   2. Qwen 2.5 72B   — zelo dobro večjezikovno razumevanje
 *   3. Mistral Nemo   — lažji, a tekoč večjezikovni model
 *   4. Llama 3.1 8B   — zasilna rezerva (krajši, preprostejši odgovori)
 * Če je nastavljen HF_MODEL, gre ta prvi na vrsto.
 */
const MODEL_CHAIN: string[] = [
  "meta-llama/Llama-3.3-70B-Instruct",
  "Qwen/Qwen2.5-72B-Instruct",
  "mistralai/Mistral-Nemo-Instruct-2407",
  "meta-llama/Llama-3.1-8B-Instruct",
];

/** Skupni proračun časa — pot /api/guide ima maxDuration 60 s. */
const OVERALL_BUDGET_MS = 50_000;
/** Najdaljši čakalni čas posameznega modela. */
const PER_MODEL_TIMEOUT_MS = 40_000;

let stickyModel: string | null = null;

function hfApiKey(): string | null {
  const raw = process.env.HF_API_KEY ?? process.env.HUGGINGFACE_API_KEY;
  return raw && raw.trim() ? raw.trim() : null;
}

/** Ali je HF ponudnik pripravljen (nastavljen veljavno videč žeton). */
export function isHfChatConfigured(): boolean {
  return hfApiKey() !== null;
}

function chain(): string[] {
  const explicit = process.env.HF_MODEL?.trim();
  const models = explicit ? [explicit, ...MODEL_CHAIN] : [...MODEL_CHAIN];
  // Lepljivi model: tisti, ki je nazadnje uspel, poskusimo najprej —
  // prepreči vsakokratno prestopanje ob zasedenem prvem modelu.
  if (stickyModel) {
    const i = models.indexOf(stickyModel);
    if (i > 0) models.unshift(...models.splice(i, 1));
  }
  return models;
}

type HfOptions = {
  temperature?: number;
  maxTokens?: number;
};

/**
 * En krožen pogovor: pošlje sporočila prvim razpoložljivim modelu iz verige.
 * Vrne besedilo odgovora; ob neuspehu vseh modelov vrne zadnjo napako.
 *
 * Razvrščanje napak:
 *   401/403 — žeton je napačen ali brez pravic: takoj navzgor (brez smisla
 *             preizkušati druge modele z istim žetonom),
 *   404/503 — model trenutno ni na voljo pri ponudniku: naslednji model,
 *   429     — ponudnik zaseden: kratka pavza, nato naslednji model.
 */
export async function hfChatComplete(
  messages: HfMessage[],
  options: HfOptions = {},
): Promise<string> {
  const key = hfApiKey();
  if (!key) throw new Error("HF_API_KEY ni nastavljen");

  const baseUrl = (process.env.HF_BASE_URL ?? DEFAULT_BASE_URL).replace(
    /\/+$/,
    "",
  );
  const temperature = options.temperature ?? 0.4;
  const maxTokens = options.maxTokens ?? 500;
  const deadline = Date.now() + OVERALL_BUDGET_MS;

  let lastError: unknown = null;

  for (const model of chain()) {
    const remaining = deadline - Date.now();
    if (remaining < 5_000) break; // ne začni poskusa, ki ga pot ne more čakati

    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
        signal: AbortSignal.timeout(Math.min(PER_MODEL_TIMEOUT_MS, remaining)),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        const brief = body.slice(0, 200).replace(/\s+/g, " ");
        if (res.status === 401 || res.status === 403) {
          throw new Error(
            `HF: žeton zavrnjen (HTTP ${res.status}) — preveri pravice „Inference Providers"`,
          );
        }
        // 404/429/503 … → preizkusi naslednji model v verigi.
        lastError = new Error(`HF ${model}: HTTP ${res.status} ${brief}`);
        if (res.status === 429) {
          await new Promise((r) => setTimeout(r, 1_200));
        }
        continue;
      }

      const data = (await res.json()) as {
        choices?: { message?: { content?: unknown } }[];
      };
      const content = data.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.trim()) {
        stickyModel = model;
        return content;
      }
      lastError = new Error(`HF ${model}: prazen odgovor`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/žeton zavrnjen|HTTP 40[13]/.test(message)) throw error;
      // Prekinitev ali omrežna napaka na tem modelu → naslednji model.
      lastError = error;
    }
  }

  throw lastError ?? new Error("HF: noben model iz verige ni odgovoril");
}
