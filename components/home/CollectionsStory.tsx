"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Collection } from "@/lib/types";
import { ButtonLink } from "@/components/ui/Button";
import { EASE, MEDIA, gsap, useGSAP } from "@/lib/motion";

/**
 * Colecciones contadas con el scroll.
 *  - Base (móvil, movimiento reducido o sin JS): lista vertical de colecciones, cada una
 *    con su foto, su título y su enlace.
 *  - Escritorio con movimiento: la sección se fija y las colecciones se suceden como
 *    escenas. La foto de la siguiente sube con una máscara redondeada sobre la anterior,
 *    que se aleja; el título gigante cambia desde una máscara. La clase `is-pinned`
 *    convierte la lista en capas superpuestas solo mientras GSAP está activo.
 */
export function CollectionsStory({ collections }: { collections: Collection[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.desktop, () => {
        const el = root.current;
        const items = gsap.utils.toArray<HTMLElement>("[data-story-item]");
        if (!el || items.length < 2) return;
        el.classList.add("is-pinned");

        const media = (i: number) => items[i].querySelector("[data-story-media]");
        const image = (i: number) => items[i].querySelector("[data-story-image]");
        const title = (i: number) => items[i].querySelector("[data-story-title]");
        const copy = (i: number) => items[i].querySelectorAll("[data-story-copy]");

        // Estado inicial: solo la primera escena a la vista.
        items.forEach((_, i) => {
          if (i === 0) return;
          gsap.set(media(i), { clipPath: "inset(100% 0% 0% 0% round 24px)" });
          gsap.set(image(i), { scale: 1.3 });
          gsap.set(title(i), { yPercent: 105 });
          gsap.set(copy(i), { autoAlpha: 0, y: 24 });
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${(items.length - 1) * window.innerHeight * 0.9}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 1; i < items.length; i++) {
          const at = i - 1;
          tl.to(media(i - 1), { scale: 0.86, opacity: 0.35 }, at)
            .to(title(i - 1), { yPercent: -105 }, at)
            .to(copy(i - 1), { autoAlpha: 0, y: -24 }, at)
            .to(media(i), { clipPath: "inset(0% 0% 0% 0% round 24px)" }, at)
            .to(image(i), { scale: 1 }, at)
            .to(title(i), { yPercent: 0 }, at + 0.15)
            .to(copy(i), { autoAlpha: 1, y: 0 }, at + 0.35);
        }

        return () => el.classList.remove("is-pinned");
      });

      // Móvil: cada foto se descubre con la misma máscara al entrar, sin fijar la sección.
      // Se reproduce una vez (no atada al scroll): animar la máscara en cada fotograma del
      // scroll repintaba la foto entera y en móviles modestos se notaba a tirones.
      mm.add(MEDIA.mobile, () => {
        gsap.utils.toArray<HTMLElement>("[data-story-media]").forEach((m) => {
          gsap.fromTo(
            m,
            { clipPath: "inset(18% 8% 0% 8% round 24px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 14px)",
              duration: 1.1,
              ease: EASE.out,
              scrollTrigger: { trigger: m, start: "top 88%", once: true },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="story">
      {collections.map((collection, i) => (
        <article key={collection.id} data-story-item className="story-item">
          <div className="story-text">
            <p data-story-copy className="eyebrow text-navy/60 tabular-nums">
              {String(i + 1).padStart(2, "0")} / {String(collections.length).padStart(2, "0")}
            </p>
            <h3 className="story-mask mt-4">
              <Link
                href={`/colecciones/${collection.handle}`}
                data-story-title
                className="block font-serif text-[clamp(3.5rem,9vw,9.5rem)] leading-[0.9] tracking-[-0.02em]"
              >
                {collection.title}
              </Link>
            </h3>
            {collection.description && (
              <p data-story-copy className="mt-5 max-w-sm text-base leading-relaxed text-navy/80">
                {collection.description}
              </p>
            )}
            <div data-story-copy className="mt-8">
              <ButtonLink href={`/colecciones/${collection.handle}`} variant="outline" arrow>
                Ver {collection.title.toLowerCase()}
              </ButtonLink>
            </div>
          </div>

          <div data-story-media className="story-media">
            {collection.image && (
              <Image
                data-story-image
                src={collection.image.url}
                alt={collection.image.altText}
                fill
                sizes="(min-width: 768px) 34vw, 100vw"
                className="photo-mono object-cover"
              />
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
