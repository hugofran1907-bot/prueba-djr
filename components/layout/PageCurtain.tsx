"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { getPendingCurtainLabel, setPendingCurtainLabel } from "@/lib/curtain-label";

/**
 * true en cuanto la primera página se ha hidratado: a partir de ahí, cada montaje es una
 * navegación. En el servidor los efectos no se ejecutan, así que allí siempre es false.
 */
let hydrated = false;

const LABELS: Record<string, string> = {
  todo: "Toda la colección",
  carrito: "Carrito",
  buscar: "Buscar",
  faq: "Ayuda",
  "aviso-legal": "Aviso legal",
  privacidad: "Privacidad",
  cookies: "Cookies",
  "condiciones-de-venta": "Condiciones de venta",
  "envios-y-devoluciones": "Envíos y devoluciones",
  contacto: "Contacto",
};

/** Título de la página a la que se llega, sacado de la ruta («/colecciones/sudaderas» → «Sudaderas»). */
function labelFor(pathname: string) {
  const slug = pathname.split("/").filter(Boolean).at(-1);
  if (!slug) return null;
  return LABELS[slug] ?? decodeURIComponent(slug).replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}

/**
 * Transición entre páginas: un telón negro cubre la pantalla con el monograma y el título
 * de la colección o sección de destino, y se retira hacia arriba con una máscara.
 * Lo monta app/template.tsx (se vuelve a montar en cada navegación); no aparece en la
 * primera carga ni al abrir un producto (ahí la foto viaja con View Transitions).
 * Es puro CSS, no bloquea clics y, con movimiento reducido, no se muestra (globals.css).
 */
export function PageCurtain({ label: labelProp, force = false }: { label?: string | null; force?: boolean }) {
  const pathname = usePathname();
  // Se lee una sola vez al montar: en la hidratación vale false (igual que en el servidor).
  // `force`: telón repetido a propósito sin cambiar de página (enlace a una sección de la misma).
  const [show] = useState(() => force || (hydrated && !pathname.startsWith("/productos/")));
  // Enlace a una sección (/#novedades): el título pendiente manda sobre el de la ruta.
  const [label] = useState(() => labelProp ?? getPendingCurtainLabel() ?? labelFor(pathname));

  useEffect(() => {
    hydrated = true;
    setPendingCurtainLabel(null); // se consume una vez (en el efecto, no en el inicializador: StrictMode lo llama dos veces)
  }, []);

  if (!show) return null;

  return (
    <div aria-hidden="true" className="page-curtain">
      <Logo asLink={false} className="page-curtain-mark text-[2.5rem] text-navy md:text-[3rem]" />
      {label && (
        <span className="page-curtain-mask">
          <span className="page-curtain-title font-serif text-[clamp(2.75rem,8vw,7rem)] leading-none text-navy">
            {label}
          </span>
        </span>
      )}
    </div>
  );
}
