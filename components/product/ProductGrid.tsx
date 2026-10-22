import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductGrid({
  products,
  priorityCount = 0,
  morph = true,
}: {
  products: Product[];
  priorityCount?: number;
  /** false cuando otra rejilla de la misma página puede repetir productos (ver ProductCard). */
  morph?: boolean;
}) {
  return (
    <ul suppressHydrationWarning data-reveal-stagger className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-[30px] md:gap-y-14">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} priority={i < priorityCount} morph={morph} />
        </li>
      ))}
    </ul>
  );
}
