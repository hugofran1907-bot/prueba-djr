import Image from "next/image";
import { heroContent } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Hero partido 50/50: foto a sangre a la izquierda y panel crema a la derecha,
 * con borde duro entre ambos (sin velados ni degradados).
 */
export function Hero() {
  const { eyebrow, title, text, valueProp, cta, secondaryCta, image, hoverImage } = heroContent;

  return (
    <section
      aria-labelledby="hero-title"
      className="grid pt-[6.25rem] md:min-h-svh md:grid-cols-2 md:pt-[7.25rem]"
    >
      {/* En móvil la foto es apaisada (4:3) para que el titular entre en la primera pantalla. */}
      <div data-star-cursor data-darkroom className="group/hero relative aspect-[4/3] overflow-hidden bg-cream md:aspect-auto">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="animate-[settle_1.8s_var(--ease-editorial)_both] object-cover object-[50%_12%] md:object-[50%_20%]"
        />
        {/* Cuarto oscuro: la segunda foto se revela desde el cursor (solo ratón). Las dos fotos de
            portada ya vienen en blanco y negro: se muestran sin filtros para conservar su tono original. */}
        {hoverImage && (
          <Image
            src={hoverImage.url}
            alt=""
            aria-hidden="true"
            fill
            loading="eager"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="darkroom-layer object-cover object-[50%_12%] md:object-[50%_20%]"
          />
        )}
      </div>

      {/* Panel crema con la pila de texto centrada (DESIGN.md · Split Editorial Hero). */}
      <div className="flex flex-col items-center justify-between gap-6 bg-cream px-5 py-8 text-center md:gap-12 md:px-12 md:py-14 lg:px-16 xl:px-20">
        <p className="eyebrow animate-rise text-stone">{eyebrow}</p>

        <div className="flex flex-col items-center">
          <p aria-hidden="true" className="mb-6 hidden animate-rise md:block text-xl font-medium tracking-[0.064em] uppercase">
            DJR®
          </p>
          <h1 id="hero-title" className="font-serif text-[clamp(3.25rem,7vw,8rem)] leading-[0.9] tracking-[-0.01em]">
            <span className="block animate-rise [animation-delay:120ms]">{title[0]}</span>
            <span className="block animate-rise text-burgundy italic [animation-delay:240ms]">{title[1]}</span>
          </h1>

          <p className="mt-8 max-w-md animate-rise text-base leading-relaxed text-navy [animation-delay:360ms] md:text-lg">
            {text}
          </p>

          <div className="mt-10 flex animate-rise flex-col gap-3 [animation-delay:480ms] sm:flex-row md:flex-col xl:flex-row">
            <ButtonLink href={cta.href} variant="primary" arrow>
              {cta.label}
            </ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="outline">
              {secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <p className="animate-rise text-base font-medium text-navy [animation-delay:600ms]">{valueProp}</p>
      </div>
    </section>
  );
}
