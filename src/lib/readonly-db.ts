/**
 * Zaznavanje bralnega datotečnega sistema (strežniške funkcije brez trajnega
 * pomnilniškega prostora, npr. Vercel/Lambda): GET deli baze delujejo,
 * zapisi ne. Namesto tihe napake 500 vrnejo API-ji jasen odgovor 503.
 */
export function isReadOnlyDatabase(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const lower = message.toLowerCase();
  return (
    lower.includes("readonly") ||
    lower.includes("read-only") ||
    lower.includes("sqlite_readonly") ||
    lower.includes("erosfs") ||
    lower.includes("eacces") ||
    lower.includes("eperm")
  );
}

/** Odgovor za poskus zapisa na bralni namestitvi (enak v obeh API-jih). */
export function readOnlyResponse() {
  return {
    status: 503,
    body: {
      error:
        "Vpisovanje na tej namestitvi ni omogočeno — muzej je v načinu za ogled. / Posting is disabled on this read-only deployment.",
    },
  };
}
