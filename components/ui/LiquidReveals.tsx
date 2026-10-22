"use client";

import { usePathname } from "next/navigation";
import { MEDIA, ScrollTrigger, gsap, useGSAP } from "@/lib/motion";

/**
 * Revelado «líquido» de las fotos marcadas con [data-liquid]: una máscara elíptica sube
 * desde el borde inferior como una ola mientras la foto se asienta (escala 1.2 → 1),
 * sincronizada con el scroll. Solo opacidad, transform y clip-path; se usa en pocas
 * secciones a propósito. Sin movimiento o sin JS, las fotos se ven enteras.
 * Se vuelve a montar en cada cambio de ruta y revierte sus triggers al salir.
 */
export function LiquidReveals() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-liquid]").forEach((el) => {
          const scrollTrigger = { trigger: el, start: "top 92%", end: "top 30%", scrub: 0.8 };
          gsap.fromTo(
            el,
            { clipPath: "ellipse(35% 0% at 50% 100%)" },
            { clipPath: "ellipse(120% 150% at 50% 100%)", ease: "none", scrollTrigger },
          );
          const img = el.querySelector("img");
          if (img) gsap.fromTo(img, { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger });
        });
        // Las escenas fijadas de más arriba cambian la altura de la página: recalcular.
        ScrollTrigger.refresh();
      });
      return () => mm.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
