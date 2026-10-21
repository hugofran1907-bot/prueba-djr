import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Fotos de conjuntos (looks) en public/images/conjuntos/.
 *
 * Cada look es un archivo `look-01` … `look-15` en cualquiera de estos formatos.
 * Para cambiar una foto basta con dejar la nueva con el mismo nombre: se sirve tal
 * cual y Next.js la optimiza al vuelo, sin convertirla a mano ni perder calidad.
 * Si hay varias versiones del mismo look, gana la primera de esta lista.
 */
const EXTENSIONS = ["png", "webp", "jpg", "jpeg", "avif"];
const DIR = path.join(process.cwd(), "public", "images", "conjuntos");

/** Ruta pública del look `n` (1–15), o null si aún no hay foto. */
export function lookSrc(n: number): string | null {
  const name = `look-${String(n).padStart(2, "0")}`;
  const ext = EXTENSIONS.find((e) => existsSync(path.join(DIR, `${name}.${e}`)));
  return ext ? `/images/conjuntos/${name}.${ext}` : null;
}
