"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { heroContent } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { EASE, MEDIA, gsap, useGSAP } from "@/lib/motion";

/** Vídeo solo en escritorio, con movimiento permitido y sin ahorro de datos ni conexión lenta. */
function useVideoAllowed(enabled: boolean) {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    const slow = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "");
    const mq = window.matchMedia(MEDIA.desktop);
    const apply = () => setAllowed(mq.matches && !slow);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [enabled]);
  return allowed;
}

/**
 * Hero cinematográfico a pantalla completa.
 *  - Carga (CSS, funciona sin JS): la foto se asienta con un zoom lento y el titular
 *    gigante sube línea a línea desde una máscara.
 *  - Scroll en escritorio (GSAP): la sección se fija durante una pantalla; la imagen se
 *    recoge en un marco, las dos líneas del titular se separan hacia los lados y el texto
 *    se retira. En móvil, solo un paralaje ligero, sin fijar nada.
 *  - Vídeo opcional (config/site.ts → heroContent.video): solo en escritorio; la foto
 *    queda debajo como alternativa para móvil, conexiones lentas o si el vídeo no arranca.
 */
/**
 * Táctil (sin ratón no hay hover): la segunda foto se alterna sola cada pocos segundos y,
 * al tocar la foto, se revela o se oculta desde el dedo. Los botones y enlaces no cuentan.
 */
function useTouchDarkroom(root: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = root.current;
    if (!el || !enabled || window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const toggle = (x?: number, y?: number) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${x === undefined ? r.width / 2 : x - r.left}px`);
      el.style.setProperty("--my", `${y === undefined ? r.height * 0.4 : y - r.top}px`);
      el.toggleAttribute("data-revealed");
    };

    // El ciclo automático solo corre con la portada a la vista y la pestaña activa: fuera de
    // pantalla sería una animación de pantalla completa que nadie ve y gasta batería.
    let timer = 0;
    let onScreen = true;
    const schedule = () => {
      window.clearInterval(timer);
      if (!reduced && onScreen && !document.hidden) timer = window.setInterval(() => toggle(), 4500);
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button")) return;
      toggle(e.clientX, e.clientY);
      schedule(); // tras un toque, el ciclo automático vuelve a empezar desde ahí
    };
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      schedule();
    });

    observer.observe(el);
    document.addEventListener("visibilitychange", schedule);
    el.addEventListener("click", onClick);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      el.removeEventListener("click", onClick);
    };
  }, [root, enabled]);
}

export function Hero() {
  const { eyebrow, title, text, valueProp, cta, secondaryCta, image, hoverImage, video } = heroContent;
  const root = useRef<HTMLElement>(null);
  const showVideo = useVideoAllowed(Boolean(video));
  useTouchDarkroom(root, Boolean(hoverImage));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=100%", pin: true, scrub: 0.6 },
        });
        tl.fromTo(
          "[data-hero-media]",
          { clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1 },
          { clipPath: "inset(12% 9% 12% 9% round 24px)", scale: 0.96 },
          0,
        )
          .to("[data-hero-line='0']", { xPercent: -22, opacity: 0.15 }, 0)
          .to("[data-hero-line='1']", { xPercent: 22, opacity: 0.15 }, 0)
          .to("[data-hero-copy]", { yPercent: -40, opacity: 0 }, 0)
          .to("[data-hero-scrim]", { opacity: 0.25 }, 0);
      });

      mm.add(MEDIA.mobile, () => {
        gsap.to("[data-hero-media]", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-title]", {
          yPercent: -18,
          opacity: 0.2,
          ease: EASE.soft,
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      data-darkroom
      // Móvil: alto mínimo de pantalla, pero crece si el texto no cabe (en móviles pequeños el
      // último botón quedaba cortado), también con el móvil en horizontal. Escritorio (tall): alto fijo,
      // porque GSAP fija la sección con él.
      className="hero-cine relative isolate min-h-svh overflow-hidden bg-night text-navy tall:h-svh tall:min-h-[34rem]"
    >
      {/* La foto empieza bajo la cabecera fija (avisos + barra) para no cortar las caras. */}
      <div
        data-hero-media
        className="absolute inset-x-0 top-[6.25rem] bottom-0 -z-10 overflow-hidden will-change-[clip-path,transform] md:top-[7.25rem]"
      >
        <div className="hero-kenburns absolute inset-0">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="photo-mono object-cover object-[50%_0%]"
          />
          {/* Cuarto oscuro: la segunda foto se revela desde el cursor (solo ratón). */}
          {hoverImage && (
            <Image
              src={hoverImage.url}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="photo-mono darkroom-layer object-cover object-[50%_0%]"
            />
          )}
          {video && showVideo && (
            <video
              className="absolute inset-0 size-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={video.poster ?? image.url}
              aria-hidden="true"
            >
              <source src={video.src} type={video.type} />
            </video>
          )}
        </div>
      </div>

      {/* Velado neutro solo para la legibilidad del texto sobre la foto. */}
      <div
        data-hero-scrim
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/30 to-night/50"
      />

      <div className="container-editorial flex min-h-svh flex-col justify-end pt-28 pb-6 md:pb-12 tall:h-full tall:min-h-0">
        <p className="eyebrow hero-rise text-navy/75">{eyebrow}</p>

        <h1
          id="hero-title"
          data-hero-title
          className="mt-4 font-serif text-[clamp(3.5rem,12.5vw,13.5rem)] leading-[0.86] tracking-[-0.02em] md:mt-6"
        >
          {/* GSAP mueve la máscara (data-hero-line) y CSS la línea de dentro (hero-line):
              así la entrada y el scroll no se pisan el transform. */}
          <span data-hero-line="0" className="hero-mask">
            <span className="hero-line block">
              {title[0]}
            </span>
          </span>
          <span data-hero-line="1" className="hero-mask md:text-right">
            <span className="hero-line block text-burgundy italic [animation-delay:140ms]">
              {title[1]}
            </span>
          </span>
        </h1>

        {/* Igual que el titular: GSAP en el envoltorio (data-hero-copy), entrada CSS dentro. */}
        <div data-hero-copy className="mt-6 md:mt-12">
        <div className="hero-rise flex flex-col gap-6 [animation-delay:420ms] md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-navy md:text-lg">{text}</p>
            <p className="mt-2 text-sm text-navy/70">{valueProp}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={cta.href} variant="primary" arrow>
              {cta.label}
            </ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="outline">
              {secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
