import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Morph } from "@/components/product/Morph";
import { productMorphName } from "@/lib/utils";
import { Price } from "@/components/product/Price";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  /** Prioriza la carga de la imagen (productos visibles sin hacer scroll). */
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Foto compartida con la ficha al navegar (View Transitions). false si el producto puede repetirse en la página. */
  morph?: boolean;
};

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 768px) 25vw, 50vw",
  className,
  morph = true,
}: Props) {
  const image = product.featuredImage;
  // Segunda foto para el hover (p. ej. la espalda de la prenda), si existe.
  const hoverImage = product.images.find((img) => img.url !== image?.url) ?? null;
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
    // data-darkroom y data-tilt: movimientos de marca (components/ui/BrandMotion.tsx).
    // Van en el <article> porque el enlace que cubre la tarjeta es quien recibe el puntero.
    <article data-darkroom data-tilt className={cn("card-3d group relative", className)}>
      {/* Mismo nombre que la foto principal de la ficha: al abrir el producto, la foto «viaja»
          de la tarjeta a la galería (View Transitions; sin soporte, navega igual). */}
      <Morph name={morph ? productMorphName(product.handle) : undefined}>
      <div className="card-3d-media relative aspect-[4/5] overflow-hidden rounded-media bg-cream">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText}
            fill
            priority={priority}
            sizes={sizes}
            className="photo-mono object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-4xl text-navy/20" aria-hidden="true">
            DJR®
          </div>
        )}
        {/* Cuarto oscuro: la segunda foto (o la misma) en color se revela desde el cursor. Solo con ratón. */}
        {image && (
          <Image
            src={(hoverImage ?? image).url}
            alt=""
            aria-hidden="true"
            fill
            sizes={sizes}
            className="darkroom-layer object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.04]"
          />
        )}
        {/* Reflejo controlado que sigue al cursor sobre la foto inclinada (--gx, --gy). */}
        <span aria-hidden="true" className="card-3d-glare" />

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
      </Morph>

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
