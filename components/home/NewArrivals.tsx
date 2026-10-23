import { getNewArrivals, isUsingMockData } from "@/lib/shopify";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { DemoNotice } from "@/components/product/DemoNotice";
import { EmptyState, ErrorState } from "@/components/ui/States";

/** Rejilla de novedades. Se renderiza dentro de <Suspense> con un esqueleto de carga. */
export async function NewArrivals() {
  let products: Product[] = [];
  let failed = false;

  try {
    products = await getNewArrivals(8);
  } catch (error) {
    console.error("[NewArrivals]", error);
    failed = true;
  }

  if (failed) return <ErrorState />;

  if (products.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay novedades."
        text="Estamos preparando la próxima entrega. Suscríbete a la newsletter para enterarte la primera."
      />
    );
  }

  return (
    <>
      <p className="eyebrow mb-4 text-navy">DROP 001</p>
      {isUsingMockData() && <DemoNotice className="mb-8" />}
      {/* Catálogo denso de 4 columnas, como un lookbook. */}
      <ProductGrid products={products} priorityCount={2} />
    </>
  );
}
