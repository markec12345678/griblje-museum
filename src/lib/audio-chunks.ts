/**
 * Čiste pomožne funkcije avdio vodnika — ločene od API rute, da so
 * preverljive brez strežnika (tests/audio-chunks.test.ts, issue #4).
 *
 * Vedenje je presojeno 1 : 1 iz src/app/api/audio-guide/route.ts (od 29.
 * sklopa naprej) — vsaka sprememba sem brez posodobitve testov je regresija.
 */

/** Meja TTS sinteze na zahtevo (omejitev ponudnika 1024 znakov + rezerva). */
export const MAX_CHARS = 950;

/** Očisti besedilo za izgovorjavo (misle, pomišljaji, odvečni presledki). */
export function prepareForTts(text: string): string {
  return text
    .replace(/\r/g, " ")
    .replace(/[—–]/g, ", ")
    .replace(/[«»„“”"]/g, "")
    .replace(/\s*\n\s*\n\s*/g, ". ")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Deli besedilo na odseke ≤ MAX_CHARS znakov po stavkih. */
export function splitIntoChunks(text: string, max = MAX_CHARS): string[] {
  if (text.length <= max) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length <= max) {
      current += sentence;
    } else {
      if (current.trim()) chunks.push(current.trim());
      if (sentence.length > max) {
        /* Zelo dolg stavek → trdi rez po besedah. */
        let piece = "";
        for (const word of sentence.split(/\s+/)) {
          if ((piece + " " + word).trim().length > max) {
            if (piece.trim()) chunks.push(piece.trim());
            piece = word;
          } else {
            piece = `${piece} ${word}`.trim();
          }
        }
        current = piece;
      } else {
        current = sentence;
      }
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
