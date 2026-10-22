import { ViewTransition, type ReactNode } from "react";

/**
 * Da a su hijo un nombre de View Transition compartido entre páginas: la foto de la tarjeta
 * y la de la ficha llevan el mismo, así que al navegar la foto «viaja» de una a otra.
 * Sin nombre, o en navegadores sin soporte, no hace nada.
 * Un mismo nombre no puede aparecer dos veces en pantalla (por eso es opcional).
 */
export function Morph({ name, children }: { name?: string; children: ReactNode }) {
  if (!name) return <>{children}</>;
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
