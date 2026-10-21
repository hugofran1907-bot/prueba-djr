import Image from "next/image";
import { promoBanner } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Banner promocional configurable desde config/site.ts (promoBanner). */
export function PromoBanner() {
  if (!promoBanner.enabled) return null;
  const { eyebrow, title, text, cta, image, tone } = promoBanner;

  return (
    <section
      aria-labelledby="promo-title"
      className={cn("group grid text-navy md:grid-cols-2", tone === "burgundy" ? "bg-cream-deep" : "bg-night")}
    >
      <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:min-h-[42rem]">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className={cn(
            "photo-mono transition-transform duration-[1600ms] ease-editorial group-hover:scale-[1.04]",
            image.fit === "contain" ? "object-contain p-8 md:p-14" : "object-cover object-[50%_15%]",
          )}
        />
      </div>

      <div className="flex flex-col justify-between gap-16 px-5 py-14 md:px-12 md:py-16 lg:px-20" data-reveal-stagger>
        <p className="eyebrow text-stone">{eyebrow}</p>
        <div>
          <h2 id="promo-title" className="font-serif text-headline text-balance">
            {title}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-navy/85">{text}</p>
          <ButtonLink href={cta.href} variant="primary" arrow className="mt-10">
            {cta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
