/**
 * Verifikacija večjezičnega slovarja (SL/EN/HR/DE/IT):
 * vsak jezik MORA imeti identično drevo ključev in tipov vrednosti
 * (funkcije z enakim številom parametrov, polja z enako dolžino).
 * Zagon: bun run scripts/verify-i18n.ts
 */
import { ui } from "../src/lib/i18n";

type Shape = Record<string, unknown>;

function shapeOf(obj: Shape, prefix = ""): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "function") {
      out.push(`${p}:fn(${v.length})`);
    } else if (Array.isArray(v)) {
      out.push(`${p}:arr[${v.length}]`);
    } else if (v && typeof v === "object") {
      out.push(...shapeOf(v as Shape, p));
    } else {
      out.push(p);
    }
  }
  return out;
}

const langs = ["sl", "en", "hr", "de", "it"] as const;
const shapes: Record<string, string[]> = {};
for (const l of langs) {
  shapes[l] = shapeOf(ui[l]);
}

const ref = shapes.sl;
let errors = 0;
for (const l of ["en", "hr", "de", "it"]) {
  const s = new Set(shapes[l]);
  const missing = ref.filter((k) => !s.has(k));
  const extra = shapes[l].filter((k) => !ref.includes(k));
  if (missing.length || extra.length) {
    errors++;
    console.log(`❌ ${l}: missing=${JSON.stringify(missing)} extra=${JSON.stringify(extra)}`);
  } else {
    console.log(`✅ ${l}: ${shapes[l].length} ključev, struktura identična SL`);
  }
}
process.exit(errors ? 1 : 0);
