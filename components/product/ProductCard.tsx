import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Price } from "@/components/product/Price";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  /** Prioriza la carga de la imagen (productos visibles sin hacer scroll). */
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 768px) 25vw, 50vw",
  className,
}: Props) {
  const image = product.featuredImage;
  const isNew = product.tags.includes("nuevo");

  // Fila de tallas en línea (DESIGN.md · Size Selector): todas visibles, las agotadas atenuadas.
  const sizeOption = product.options.find((o) => /^(talla|size)$/i.test(o.name));
  const sizeCodes = (sizeOption?.values ?? []).map((value) => ({
    value,
    available: product.variants.some(
      (v) => v.availableForSale && v.selectedOptions.some((o) => o.name === sizeOption?.name && o.value === value),
    ),
  }));

  return (
    <article className={cn("group relative", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-media bg-cream">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText}
            fill
            priority={priority}
            sizes={sizes}
            className="photo-mono object-cover transition-[transform,filter] duration-[1200ms] ease-editorial group-hover:scale-[1.04] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-4xl text-navy/20" aria-hidden="true">
            DJR®
          </div>
        )}

        {isNew && (
          <span className="eyebrow absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-xs text-navy">Nuevo</span>
        )}
        {/* Agotado: píldora blanca centrada sobre la foto (DESIGN.md · ÉPUISÉ badge). */}
        {!product.availableForSale && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-5 py-2.5 text-xs font-medium tracking-[0.047em] text-navy uppercase">
            Agotado
          </span>
        )}
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-xs font-medium tracking-[0.047em] uppercase">
          {/* El enlace cubre toda la tarjeta, pero solo hay un punto de foco. */}
          <Link href={`/productos/${product.handle}`} className="after:absolute after:inset-0">
            {product.title}
          </Link>
        </h3>
        {sizeCodes.length > 0 && (
          <ul aria-label="Tallas" className="mt-2 flex flex-wrap justify-center gap-x-1.5 text-xs font-medium tracking-[0.04em] uppercase">
            {sizeCodes.map((s) => (
              <li key={s.value} className={s.available ? "text-stone" : "text-pewter/70 line-through"}>
                {s.value}
                {!s.available && <span className="sr-only"> (agotada)</span>}
              </li>
            ))}
          </ul>
        )}
        <Price
          min={product.priceRange.minVariantPrice}
          max={product.priceRange.maxVariantPrice}
          className="mt-2 block text-xs font-medium tabular-nums"
        />
      </div>
    </article>
  );
}
