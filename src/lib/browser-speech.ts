/**
 * Govor naprave — brskalniška rezerva za avdio vodnik (Web Speech API).
 *
 * Ko strežniška sinteza odpove (izčrpana kvota, manjkajoč ključ), zapis
 * vseeno „preberi" obiskovalcu: vsak sodoben brskalnik/telefon vsebuje
 * sintetizator govora. Windows ima slovenska glasa Vesna in Lado, macOS
 * Čedo, Android Googlov slovenski glas. Povsem brezplačno, neomejeno,
 * brez ključa — kakovost je odvisna od naprave, zato je vedno samo
 * NADOMESTEK, nikoli prva izbira.
 *
 * Tehnični podrobnosti:
 *  - Glasovi se nalagajo asinhrono → čakamo na dogodek „voiceschanged".
 *  - Chrome znano poreže dolge izgovorjave (~15 s) → besedilo delimo na
 *    kratke odseke po stavkih (≤ 200 znakov) in jih predvajamo zaporedno.
 */

export type SpeechLang = "sl" | "en";

/** Ali ta brskalnik sploh podpira sintezo govora. */
export function browserSpeechSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.speechSynthesis !== "undefined" &&
    typeof window.speechSynthesis.speak === "function"
  );
}

/** Glasovi se naložijo asinhrono — počakaj nanje (največ 1,5 s). */
function voicesReady(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve([]);
    const synth = window.speechSynthesis;
    const now = synth.getVoices();
    if (now.length) return resolve(now);
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      synth.removeEventListener("voiceschanged", finish);
      resolve(synth.getVoices());
    };
    synth.addEventListener("voiceschanged", finish);
    window.setTimeout(finish, 1500);
  });
}

/** Izbor najboljšega glasa za jezik (prednost: krajevni + znana imena). */
export function pickVoice(
  voices: SpeechSynthesisVoice[],
  lang: SpeechLang
): SpeechSynthesisVoice | null {
  const prefix = lang === "sl" ? "sl" : "en";
  const exact = voices.filter((v) =>
    v.lang.toLowerCase().replace("_", "-").startsWith(prefix)
  );
  if (exact.length === 0) return null;
  const nice =
    lang === "sl"
      ? /vesna|lado|[cč]eda|google|sloven/i
      : /samantha|daniel|google|natural|aria|libby/i;
  return (
    exact.find((v) => nice.test(v.name) && v.localService) ??
    exact.find((v) => v.localService) ??
    exact[0] ??
    null
  );
}

/** Deli besedilo na odseke ≤ max znakov po stavkih (Chrome varnost). */
function splitForSpeech(text: string, max = 200): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length <= max) {
      current += sentence;
    } else {
      if (current.trim()) chunks.push(current.trim());
      current = sentence.length > max ? sentence.slice(0, max) : sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

export type SpeechHandlers = {
  onEnd?: () => void;
  onError?: (reason: string) => void;
};

/** Nadzorna ročica predvajanja glasu naprave. */
export type SpeechHandle = {
  cancel: () => void;
  pause: () => void;
  resume: () => void;
};

/**
 * Prebere besedilo z glasom naprave. Vrne nadzorno ročico s klicem
 * cancel() — predvajalniki jo pokličejo ob ustavitvi/odmontaži.
 */
export async function speakBrowser(
  text: string,
  lang: SpeechLang,
  handlers: SpeechHandlers = {}
): Promise<SpeechHandle> {
  const idle: SpeechHandle = {
    cancel: () => {},
    pause: () => {},
    resume: () => {},
  };
  if (!browserSpeechSupported()) {
    handlers.onError?.("speech-unsupported");
    return idle;
  }

  const voices = await voicesReady();
  const voice = pickVoice(voices, lang);
  if (!voice) {
    handlers.onError?.("voice-missing");
    return idle;
  }

  const synth = window.speechSynthesis;
  const chunks = splitForSpeech(text);
  let index = 0;
  let cancelled = false;

  const speakNext = () => {
    if (cancelled) return;
    if (index >= chunks.length) {
      handlers.onEnd?.();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.95; /* umirjen tempo vodnika */
    utterance.pitch = 1;
    index += 1;
    utterance.onend = () => speakNext();
    utterance.onerror = (event) => {
      if (cancelled || event.error === "interrupted" || event.error === "canceled") {
        return; /* ustavil uporabnik — tiho */
      }
      handlers.onError?.(event.error ?? "speech-error");
    };
    synth.speak(utterance);
  };

  synth.cancel(); /* počisti morebitne ostanke prejšnjega predvajanja */
  speakNext();

  return {
    cancel: () => {
      cancelled = true;
      try {
        synth.cancel();
      } catch {
        /* brskalnik je že pospravil */
      }
    },
    pause: () => {
      try {
        synth.pause();
      } catch {
        /* nekatere platforme pavze ne podpirajo */
      }
    },
    resume: () => {
      try {
        synth.resume();
      } catch {
        /* nadaljevanje ni na voljo */
      }
    },
  };
}
