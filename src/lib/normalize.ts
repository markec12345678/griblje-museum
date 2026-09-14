/**
 * Skupna normalizacija nizov za iskanje in filtriranje.
 *
 * NFD razstavi diakritike (č → c + diakritično oznako), odstranimo
 * kombinirajoče oznake in lowercasamo — tako "crnomelj" najde "Črnomelj".
 * Enako pravilo velja tako za strežniško iskanje (/api/search) kot za
 * filter v pogledu zbirke, da se obnašata enako.
 */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
