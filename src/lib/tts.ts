/**
 * TTS — sinteza govora avdio vodnika, ponudniška veriga.
 *
 * 1. ElevenLabs (če je nastavljen ELEVENLABS_API_KEY): model
 *    eleven_multilingual-v2 zna slovenščino izjemno naravno (dokumentarni
 *    glas); brezplačni račun pokrije ~10 minut govora na mesec.
 * 2. z-ai SDK (obstoječa pot): dnevno kvotirana, a vedno pripravljena
 *    rezerva.
 *
 * Strežnik vrne zvok z ustreznim Content-Type (mp3/wav); predvajalnik v
 * brskalniku je format-agnostičen (Blob → <audio>).
 *
 * Konfiguracija (env, nikoli v gitu — .env.local / Vercel):
 *   ELEVENLABS_API_KEY      — ključ iz elevenlabs.io (brezplačni načrt zadostuje)
 *   ELEVENLABS_VOICE_SL     — privzeto Antoni (miren, topl moški glas vodnika)
 *   ELEVENLABS_VOICE_EN     — privzeto enak glas za dosledno identiteto vodnika
 */

import { getZAI } from "@/lib/zai";

type Lang = "sl" | "en";

export type SynthResult = { buffer: Buffer; contentType: string };

/* --- ElevenLabs -------------------------------------------------------- */

const EL_BASE_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const EL_MODEL = "eleven_multilingual_v2";
const EL_TIMEOUT_MS = 40_000;

/** Antoni — miren, toplega tona pripovedovalec, odlična slovenščina. */
const EL_DEFAULT_VOICE = "ErXwobaYiN019PkySvjV";

function elevenLabsKey(): string | null {
  const raw = process.env.ELEVENLABS_API_KEY;
  return raw && raw.trim() ? raw.trim() : null;
}

export function isElevenLabsConfigured(): boolean {
  return elevenLabsKey() !== null;
}

function elevenLabsVoice(lang: Lang): string {
  const env = lang === "sl"
    ? process.env.ELEVENLABS_VOICE_SL
    : process.env.ELEVENLABS_VOICE_EN;
  return (env && env.trim()) || EL_DEFAULT_VOICE;
}

async function elevenLabsTts(text: string, lang: Lang): Promise<SynthResult> {
  const key = elevenLabsKey();
  if (!key) throw new Error("ELEVENLABS_API_KEY ni nastavljen");

  const res = await fetch(
    `${EL_BASE_URL}/${elevenLabsVoice(lang)}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: EL_MODEL,
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
      signal: AbortSignal.timeout(EL_TIMEOUT_MS),
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const brief = body.slice(0, 200).replace(/\s+/g, " ");
    throw new Error(`ElevenLabs HTTP ${res.status}: ${brief}`);
  }

  const buffer = Buffer.from(new Uint8Array(await res.arrayBuffer()));
  if (buffer.length === 0) throw new Error("ElevenLabs: prazen odgovor");
  return { buffer, contentType: "audio/mpeg" };
}

/* --- z-ai (obstoječa pot) ---------------------------------------------- */

const ZAI_VOICE: Record<Lang, string> = { sl: "tongtong", en: "jam" };
const ZAI_SPEED: Record<Lang, number> = { sl: 0.9, en: 0.95 };

async function zaiTts(text: string, lang: Lang): Promise<SynthResult> {
  const zai = await getZAI();
  const response = await zai.audio.tts.create({
    input: text,
    voice: ZAI_VOICE[lang],
    speed: ZAI_SPEED[lang],
    response_format: "wav",
    stream: false,
  });
  const buffer = Buffer.from(new Uint8Array(await response.arrayBuffer()));
  if (buffer.length === 0) {
    throw new Error("TTS returned an empty buffer");
  }
  return { buffer, contentType: "audio/wav" };
}

/* --- Veriga ------------------------------------------------------------ */

/**
 * Sintetizira govor: najprej ElevenLabs (če je ključ nastavljen), ob
 * neuspehu (napačen ključ, izčrpan mesečni kredit, zasedenost) pa
 * obstoječa z-ai pot. Vrste napak se zabeležijo v dnevnik strežnika.
 */
export async function synthesizeSpeech(
  text: string,
  lang: Lang
): Promise<SynthResult> {
  if (isElevenLabsConfigured()) {
    try {
      return await elevenLabsTts(text, lang);
    } catch (error) {
      console.warn(
        "TTS: ElevenLabs ni uspel, preklop na z-ai:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }
  return zaiTts(text, lang);
}
