/**
 * Omejitve besedila prispevkov skupnosti — skupne odjemalcu (števci znakov)
 * in strežniku (validacija). Ločen modul, da odjemalec ne vleče zodja.
 */
export const CONTRIBUTION_LIMITS = {
  name: 60,
  place: 60,
  message: 500,
  memory: 800,
} as const;
