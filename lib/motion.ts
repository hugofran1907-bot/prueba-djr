"use client";

/**
 * Sistema de movimiento de DJR®: un solo punto de entrada para GSAP y los tokens
 * compartidos (curvas, duraciones y consultas de medios). Las curvas equivalen a las
 * de globals.css (--ease-editorial ≈ expo.out, --ease-drawer ≈ power4.inOut), así que
 * CSS y GSAP se mueven igual.
 *
 * Por qué GSAP: ScrollTrigger resuelve las escenas fijadas y sincronizadas con el scroll
 * de forma fiable en Safari/iOS, y useGSAP revierte cada animación y cada trigger al
 * desmontar el componente (sin fugas ni animaciones huérfanas al navegar).
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Móvil: al hacer scroll, la barra de direcciones aparece y desaparece y cambia el alto de la
// pantalla. Sin esto, ScrollTrigger lo recalcula todo en cada cambio y la página da saltos.
ScrollTrigger.config({ ignoreMobileResize: true });

// Las secciones que llegan después (Novedades se carga en streaming, imágenes, fuentes) alargan
// la página cuando las animaciones de scroll ya han medido sus posiciones: se disparaban antes de
// tiempo. Cuando cambia el alto de la página, se vuelven a medir (agrupado, una vez por ráfaga).
if (typeof window !== "undefined" && "ResizeObserver" in window) {
  let lastHeight = 0;
  let timer = 0;
  new ResizeObserver(([entry]) => {
    const height = Math.round(entry.contentRect.height);
    if (height === lastHeight) return;
    lastHeight = height;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
  }).observe(document.body);
}

export const EASE = {
  /** Entradas y revelados: arranque rápido, asentamiento largo. */
  out: "expo.out",
  /** Cambios de escena (telón, máscaras que cruzan la pantalla). */
  inOut: "power4.inOut",
  /** Respuestas al cursor (magnetismo, inclinación). */
  soft: "power3.out",
} as const;

export const DURATION = { fast: 0.35, base: 0.8, slow: 1.4 } as const;

/** Consultas de gsap.matchMedia: cada bloque se revierte solo cuando deja de cumplirse. */
export const MEDIA = {
  /** Escritorio con movimiento: escenas fijadas y scrub completo (variante `tall:` en globals.css). */
  desktop: "(min-width: 768px) and (min-height: 500px) and (prefers-reduced-motion: no-preference)",
  /** Móvil con movimiento (también en horizontal, que es ancho pero bajo): versiones ligeras, sin fijar secciones. */
  mobile:
    "(max-width: 767px) and (prefers-reduced-motion: no-preference), (max-height: 499px) and (prefers-reduced-motion: no-preference)",
  /** Cualquier tamaño con movimiento. */
  motion: "(prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
