/**
 * ZAI SDK — skupni strežniški odjemalec za vse umetne inteligence muzeja
 * (TTS avdio vodnik, pogovor z zbirko …).
 *
 * Konfiguracija: privzeto SDK bere datoteko .z-ai-config (cwd/domov/ETC);
 * na strežniških platformah (Vercel), kjer datoteke ni, podpira env
 * spremenljivko ZAI_CONFIG — JSON oblike {"baseUrl": "...", "apiKey": "..."}.
 *
 * En odjemalec, ustvarjen enkrat na primerek strežnika (lazy obljuba),
 * ker je "ZAI.create()" asinhron in drag.
 */

type ZAIConfig = { baseUrl: string; apiKey: string };
type ZAIClient = Awaited<
  ReturnType<(typeof import("z-ai-web-dev-sdk"))["default"]["create"]>
>;

function readEnvConfig(): ZAIConfig | null {
  const raw = process.env.ZAI_CONFIG;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ZAIConfig>;
    if (parsed.baseUrl && parsed.apiKey) {
      return { baseUrl: parsed.baseUrl, apiKey: parsed.apiKey };
    }
  } catch {
    /* neveljaven JSON — spustimo naprej do datotečne konfiguracije */
  }
  return null;
}

let zaiPromise: Promise<ZAIClient> | null = null;

export async function getZAI(): Promise<ZAIClient> {
  if (!zaiPromise) {
    const envConfig = readEnvConfig();
    if (envConfig) {
      // Konstruktor razreda je v TypeScriptu zaseben (privatni API SDK),
      // v JavaScriptu pa veljaven — omogoča konfiguracijo prek env brez
      // datoteke .z-ai-config, ki je na strežniških platformah ni mogoče
      // zapisati (samo-za-branje korenska mapa funkcije).
      const ZAI = (await import("z-ai-web-dev-sdk")).default;
      zaiPromise = Promise.resolve(
        new (ZAI as unknown as new (config: ZAIConfig) => ZAIClient)(envConfig)
      );
    } else {
      zaiPromise = import("z-ai-web-dev-sdk").then((m) => m.default.create());
    }
  }
  return zaiPromise;
}
