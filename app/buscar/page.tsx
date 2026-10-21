import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts, isUsingMockData } from "@/lib/shopify";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { DemoNotice } from "@/components/product/DemoNotice";
import { EmptyState, ErrorState, ProductGridSkeleton } from "@/components/ui/States";

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  return {
    title: query ? `Resultados para «${query}»` : "Todos los productos",
    robots: { index: false, follow: true },
  };
}

async function Results({ query }: { query: string }) {
  let products: Product[] = [];
  try {
    products = await getProducts({ query: query || undefined, sortKey: query ? "RELEVANCE" : "CREATED_AT", reverse: !query });
  } catch (error) {
    console.error("[buscar]", error);
    return <ErrorState />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={query ? `Sin resultados para «${query}».` : "Todavía no hay productos."}
        text={query ? "Prueba con otra palabra: camiseta, sudadera, pantalón…" : undefined}
      />
    );
  }

  return (
    <>
      <p className="mb-8 text-sm text-stone" role="status">
        {products.length} {products.length === 1 ? "producto" : "productos"}
      </p>
      {isUsingMockData() && <DemoNotice className="mb-8" />}
      <ProductGrid products={products} priorityCount={3} />
    </>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  return (
    <div className="container-editorial pt-36 pb-24 md:pt-44">
      <p className="eyebrow text-burgundy">{query ? "Búsqueda" : "Tienda"}</p>
      <h1 className="mt-4 font-serif text-headline">{query ? <>«{query}»</> : "Todos los productos"}</h1>

      <form action="/buscar" method="get" role="search" className="mt-10 flex max-w-xl border-b border-navy">
        <label htmlFor="search-page-input" className="sr-only">
          Buscar productos
        </label>
        <input
          id="search-page-input"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Buscar"
          className="w-full bg-transparent py-3 text-lg placeholder:text-navy/35 focus:outline-none"
        />
        <button type="submit" className="eyebrow px-2">
          Buscar
        </button>
      </form>

      <div className="mt-14">
        <Suspense key={query} fallback={<ProductGridSkeleton />}>
          <Results query={query} />
        </Suspense>
      </div>
    </div>
  );
}
