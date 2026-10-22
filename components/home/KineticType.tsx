"use client";

import { useRef } from "react";
import { LogoStar } from "@/components/ui/LogoStar";
import { MEDIA, gsap, useGSAP } from "@/lib/motion";

const ROW_A = ["Menos ruido", "Más presencia"];
const ROW_B = ["DJR®", "Streetwear"];
/** Veces que se repite cada fila para cubrir pantallas anchas mientras se desplaza. */
const REPEAT = 3;

/**
 * Tipografía cinética: dos filas de palabras gigantes que se desplazan en sentidos
 * opuestos con el scroll. La primera va en contorno; la segunda deja ver una foto de
 * campaña a través de las letras (máscara tipográfica con background-clip: text).
 * Sin movimiento (o sin JS) las filas quedan quietas; los lectores de pantalla leen
 * la frase una sola vez (las filas son decorativas).
 */
export function KineticType({ image }: { image: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const scrollTrigger = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.5 };
        gsap.fromTo("[data-kinetic='a']", { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger });
        gsap.fromTo("[data-kinetic='b']", { xPercent: -30 }, { xPercent: 0, ease: "none", scrollTrigger });
        // La foto se desliza dentro de las letras a otra velocidad: sensación de profundidad.
        gsap.fromTo(
          "[data-kinetic='b']",
          { backgroundPosition: "50% 0%" },
          { backgroundPosition: "50% 100%", ease: "none", scrollTrigger },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const row = (words: string[]) =>
    Array.from({ length: REPEAT }).flatMap((_, r) =>
      words.map((word, i) => (
        <span key={`${r}-${i}`} className="inline-flex items-center">
          {word}
          <LogoStar className="mx-[0.25em] h-[0.42em]" />
        </span>
      )),
    );

  return (
    // select-none: son letras decorativas, no texto para seleccionar (el lector de pantalla usa aria-label).
    <section ref={root} aria-label="DJR® Streetwear. Menos ruido, más presencia." className="overflow-hidden bg-night py-16 select-none md:py-28">
      <p aria-hidden="true" data-kinetic="a" className="kinetic-row kinetic-outline">
        {row(ROW_A)}
      </p>
      <p
        aria-hidden="true"
        data-kinetic="b"
        className="kinetic-row kinetic-image -mt-[0.08em]"
        style={{ backgroundImage: `url(${image})` }}
      >
        {row(ROW_B)}
      </p>
    </section>
  );
}
