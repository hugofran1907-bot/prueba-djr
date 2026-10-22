"use client";

import { useEffect, useRef } from "react";
import { Star } from "@/components/ui/Star";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Movimientos de marca que dependen del puntero, con un único listener delegado:
 *  - [data-star-cursor]: la estrella DJR® sustituye al cursor sobre las fotos.
 *  - [data-darkroom]: guarda la posición del cursor (--mx, --my) para que el color
 *    se revele desde ahí, como en un cuarto oscuro (estilos en globals.css).
 *  - [data-tilt]: inclina la foto como una prenda colgada de una percha (--tilt).
 * Solo con ratón; en táctil no hace nada y todo se ve igual que sin JavaScript.
 */
export function BrandMotion() {
  const starRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia(FINE_POINTER).matches) return;
    const reduced = window.matchMedia(REDUCED_MOTION);
    const star = starRef.current;
    let frame = 0;
    let lastTilt: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const { clientX: x, clientY: y } = e;

      const darkroom = target?.closest<HTMLElement>("[data-darkroom]");
      if (darkroom) {
        const r = darkroom.getBoundingClientRect();
        darkroom.style.setProperty("--mx", `${x - r.left}px`);
        darkroom.style.setProperty("--my", `${y - r.top}px`);
      }

      const tilt = reduced.matches ? null : (target?.closest<HTMLElement>("[data-tilt]") ?? null);
      if (lastTilt && lastTilt !== tilt) lastTilt.style.removeProperty("--tilt");
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const offset = (x - r.left) / r.width - 0.5; // -0.5 … 0.5
        tilt.style.setProperty("--tilt", `${(offset * 5).toFixed(2)}deg`);
      }
      lastTilt = tilt;

      if (star) {
        star.dataset.visible = target?.closest("[data-star-cursor]") ? "true" : "false";
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          star.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
      }
    };

    const onLeave = () => {
      if (star) star.dataset.visible = "false";
      lastTilt?.style.removeProperty("--tilt");
      lastTilt = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.classList.add("star-cursor-ready");
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("star-cursor-ready");
    };
  }, []);

  return (
    <div ref={starRef} aria-hidden="true" data-visible="false" className="star-cursor">
      <Star className="size-5" />
    </div>
  );
}
