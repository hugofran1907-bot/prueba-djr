"use client";

import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { PageCurtain } from "@/components/layout/PageCurtain";
import { setPendingCurtainLabel } from "@/lib/curtain-label";

/** Título de una sección con ancla, sacado del menú («/#novedades» → «Novedades»). */
function sectionLabel(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const item = siteConfig.mainNav.find((i) => i.href.endsWith(`#${id}`));
  return item?.label ?? id.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}

/**
 * Transición de entrada de cada página (telón + fundido con leve subida).
 *
 * app/template.tsx solo se vuelve a montar cuando cambia el PRIMER tramo de la ruta, así que
 * entre páginas hermanas (/colecciones/sudaderas → /colecciones/camisetas, /legal/a → /legal/b,
 * /productos/a → /productos/b) la animación no se repetía. Con la ruta completa como `key`,
 * cualquier cambio de página vuelve a montar el telón y la entrada, igual en todas.
 *
 * Un enlace a la página actual (el logo en la home) repite el telón y vuelve arriba.
 *
 * Enlaces a una sección con ancla (/#seccion) se tratan como un apartado más:
 *  - desde otra página, el telón de destino muestra el nombre de la sección;
 *  - desde la misma página, el telón se repite con ese nombre y, mientras cubre la pantalla,
 *    la página salta a la sección (sin el desplazamiento visible por el medio).
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // `path`: el telón repetido solo se pinta en la página donde se pidió (al cambiar de página, desaparece).
  const [replay, setReplay] = useState<{ n: number; label: string | null; path: string } | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;

      // Enlace a la página en la que ya estás (p. ej. el logo estando en la home): Next no navega,
      // así que se repite el telón y se vuelve arriba del todo, como en cualquier cambio de página.
      if (!url.hash) {
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) return;
        e.preventDefault();
        setReplay((r) => ({ n: (r?.n ?? 0) + 1, label: null, path: window.location.pathname }));
        if (window.location.hash) window.history.pushState(window.history.state, "", url.pathname + url.search);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        return;
      }

      const label = sectionLabel(url.hash);

      if (url.pathname !== window.location.pathname) {
        // Otra página: Next navega como siempre y su telón usará este título.
        setPendingCurtainLabel(label);
        return;
      }

      // Misma página: telón con el nombre de la sección y salto instantáneo debajo de él.
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      setReplay((r) => ({ n: (r?.n ?? 0) + 1, label, path: window.location.pathname }));
      window.history.pushState(window.history.state, "", url.hash);
      // En el mismo clic: React monta el telón antes del siguiente pintado, así que el salto no se ve.
      target.scrollIntoView({ behavior: "instant", block: "start" });
    };

    // Fase de captura: se decide antes que el propio <Link> de Next.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      <Fragment key={pathname}>
        <PageCurtain />
        <div className="animate-page-in">{children}</div>
      </Fragment>
      {replay?.path === pathname && <PageCurtain key={`replay-${replay.n}`} label={replay.label} force />}
    </>
  );
}
