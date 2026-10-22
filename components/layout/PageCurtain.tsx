"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";

/**
 * true en cuanto la primera página se ha hidratado: a partir de ahí, cada montaje es una
 * navegación. En el servidor los efectos no se ejecutan, así que allí siempre es false.
 */
let hydrated = false;

/**
 * Telón negro con el monograma que se retira hacia arriba al entrar en una página.
 * Lo monta app/template.tsx, que se vuelve a montar en cada navegación; en la primera
 * carga (servidor e hidratación) no se pinta. No bloquea clics y, con movimiento
 * reducido, no se muestra (globals.css).
 */
export function PageCurtain() {
  // Se lee una sola vez al montar: en la hidratación vale false (igual que en el servidor).
  const [show] = useState(() => hydrated);

  useEffect(() => {
    hydrated = true;
  }, []);

  if (!show) return null;

  return (
    <div aria-hidden="true" className="page-curtain">
      <Logo asLink={false} className="text-[3rem] text-navy md:text-[4rem]" />
    </div>
  );
}
