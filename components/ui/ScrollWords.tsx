"use client";

import { useEffect, useRef } from "react";

/**
 * Titular que se «enciende» palabra a palabra al hacer scroll: empieza apagado y
 * cada palabra pasa a tinta plena según el bloque cruza la pantalla.
 * Sin JavaScript o con movimiento reducido, el texto se ve entero desde el principio.
 */
export function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-word]"));
    let frame = 0;

    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 cuando el bloque entra por abajo; 1 cuando su base llega al 45 % de la pantalla.
      const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.55 + r.height)));
      const lit = progress * spans.length;
      spans.forEach((s, i) => {
        s.style.opacity = String(0.18 + 0.82 * Math.min(1, Math.max(0, lit - i)));
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <span ref={ref}>
      {words.map((word, i) => (
        <span key={i} data-word className="transition-opacity duration-200">
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
