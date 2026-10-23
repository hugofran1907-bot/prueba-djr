"use client";

import { useEffect } from "react";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

/**
 * Respuestas al cursor de toda la web, con un único listener delegado y un frame
 * por movimiento (estilos en globals.css · «Movimientos de marca»):
 *  - [data-darkroom]: posición del cursor (--mx, --my) para revelar el color desde ahí.
 *  - [data-tilt]: perspectiva 3D hacia el cursor (--rx, --ry) y reflejo (--gx, --gy).
 *  - [data-magnetic]: el botón se acerca suavemente al cursor (--mag-x, --mag-y);
 *    la zona de clic no cambia, solo se desplaza unos píxeles.
 * Solo con ratón; en táctil o con movimiento reducido no hace nada.
 * No sustituye el cursor del sistema.
 */
export function BrandMotion() {
  // iOS Safari solo aplica :active (respuesta al toque de tarjetas y botones) si hay algún
  // listener de touchstart en la página; este no hace nada más.
  useEffect(() => {
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);

  useEffect(() => {
    if (!window.matchMedia(FINE_POINTER).matches) return;
    const reduced = window.matchMedia(REDUCED_MOTION);

    let frame = 0;
    let pending: PointerEvent | null = null;
    let lastTilt: HTMLElement | null = null;
    let lastMagnet: HTMLElement | null = null;

    const resetTilt = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
      delete el.dataset.tilting;
    };
    const resetMagnet = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty("--mag-x");
      el.style.removeProperty("--mag-y");
    };

    const update = () => {
      frame = 0;
      const e = pending;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;
      const { clientX: x, clientY: y } = e;

      const darkroom = target?.closest<HTMLElement>("[data-darkroom]");
      if (darkroom) {
        const r = darkroom.getBoundingClientRect();
        darkroom.style.setProperty("--mx", `${x - r.left}px`);
        darkroom.style.setProperty("--my", `${y - r.top}px`);
      }

      const motion = !reduced.matches;

      const tilt = motion ? (target?.closest<HTMLElement>("[data-tilt]") ?? null) : null;
      if (lastTilt !== tilt) resetTilt(lastTilt);
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (x - r.left) / r.width; // 0 … 1
        const py = (y - r.top) / r.height;
        tilt.style.setProperty("--ry", `${((px - 0.5) * 9).toFixed(2)}deg`);
        tilt.style.setProperty("--rx", `${((0.5 - py) * 7).toFixed(2)}deg`);
        tilt.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        tilt.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
        tilt.dataset.tilting = "";
      }
      lastTilt = tilt;

      const magnet = motion ? (target?.closest<HTMLElement>("[data-magnetic]") ?? null) : null;
      if (lastMagnet !== magnet) resetMagnet(lastMagnet);
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = x - (r.left + r.width / 2);
        const dy = y - (r.top + r.height / 2);
        magnet.style.setProperty("--mag-x", `${clamp(dx * 0.22, 10).toFixed(1)}px`);
        magnet.style.setProperty("--mag-y", `${clamp(dy * 0.35, 6).toFixed(1)}px`);
      }
      lastMagnet = magnet;
    };

    const onMove = (e: PointerEvent) => {
      pending = e;
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onLeave = () => {
      resetTilt(lastTilt);
      resetMagnet(lastMagnet);
      lastTilt = lastMagnet = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, []);

  return null;
}
