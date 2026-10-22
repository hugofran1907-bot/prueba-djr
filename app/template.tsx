import { RouteTransition } from "@/components/layout/RouteTransition";

/**
 * Envuelve cada página con su transición de entrada (telón negro con el monograma,
 * fundido y leve subida). RouteTransition la repite en CADA cambio de ruta, también
 * entre páginas hermanas. La cabecera y el pie viven en layout.tsx y no se animan.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>;
}
