/**
 * Omejitve pogovora z zbirko — skupne odjemalcu (števci znakov)
 * in strežniku (validacija). Ločen modul, da odjemalec ne vleče
 * strežniške odvisnosti (prisma, z-ai-sdk).
 */
export const GUIDE_LIMITS = {
  /** največja dolžina enega sporočila */
  message: 400,
  /** največ sporočil v zgodovini, ki se pošlje modelu */
  history: 8,
  /** največ sporočil v pogovoru na odjemalcu */
  transcript: 30,
} as const;
