import { ViewTransition, type ReactNode } from "react";

/** Tipo de transición de los enlaces que abren una ficha de producto. */
export const OPEN_PRODUCT = "open-product";

/**
 * Da a su hijo un nombre de View Transition compartido entre páginas: la foto de la tarjeta
 * y la de la ficha llevan el mismo, así que al navegar la foto «viaja» de una a otra.
 * Sin nombre, o en navegadores sin soporte, no hace nada.
 * Un mismo nombre no puede aparecer dos veces en pantalla (por eso es opcional).
 */
export function Morph({ name, children }: { name?: string; children: ReactNode }) {
  if (!name) return <>{children}</>;
  // Solo al abrir un producto (enlaces con transitionTypes={[OPEN_PRODUCT]}). Sin esto, al pasar
  // de una rejilla a otra que comparte prendas (Camisetas → Novedades) todas las fotos «volaban»
  // a la vez de su sitio antiguo al nuevo y se superponían durante la transición.
  return (
    <ViewTransition name={name} share={{ [OPEN_PRODUCT]: "morph", default: "none" }} default="none">
      {children}
    </ViewTransition>
  );
}
