"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal], [data-reveal-stagger]";

/**
 * Revela al hacer scroll los elementos marcados con `data-reveal` (bloque entero)
 * o `data-reveal-stagger` (sus hijos, escalonados). Los estilos están en globals.css.
 *
 * Mejora progresiva: el contenido solo se oculta cuando este componente ya está
 * activo (clase `reveal-ready` en <html>), así que sin JavaScript todo se ve.
 * Antes de activar la clase se marcan como revelados los elementos que ya están en
 * pantalla, para que nada parpadee al cargar.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    const track = (el: Element) => {
      if (el.hasAttribute("data-revealed")) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) reveal(el);
      else io.observe(el);
    };

    document.querySelectorAll(SELECTOR).forEach(track);
    root.classList.add("reveal-ready");

    // Contenido que llega después (Suspense, navegación entre páginas).
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(SELECTOR)) track(node);
          node.querySelectorAll(SELECTOR).forEach(track);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
