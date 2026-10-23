"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { consumeKeepScroll } from "@/lib/scroll-intent";

/**
 * Cada cambio de página empieza arriba del todo (scroll 0), también al volver atrás.
 *
 * Next.js solo desplaza si el inicio de la página nueva no está a la vista, y las secciones
 * fijadas con GSAP y la transición entre páginas despistan esa comprobación: a veces la página
 * nueva se abría a media altura. Este efecto corre después del de Next y lo deja siempre en 0.
 *
 * Excepciones: los enlaces a una sección (/#novedades) van a esa sección, no arriba, y el
 * cambio de color en la ficha de producto conserva la posición (lib/scroll-intent.ts).
 */
export function ScrollToTop() {
  const pathname = usePathname();

  // El navegador no debe restaurar por su cuenta la posición al volver atrás.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    // Cambio de color en la ficha de producto: se queda donde estaba.
    if (consumeKeepScroll()) return;
    const { hash } = window.location;
    if (!hash) {
      // "instant": sin la animación del scroll-behavior: smooth de globals.css.
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    // Enlace a una sección de otra página: las secciones fijadas con GSAP aún están creando
    // su espacio al llegar, así que se espera a que la página se asiente y luego se baja a
    // la sección (respeta el scroll-padding-top de la cabecera fija).
    const id = decodeURIComponent(hash.slice(1));
    let frame = 0;
    const timer = window.setTimeout(() => {
      frame = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
      });
    }, 150);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
