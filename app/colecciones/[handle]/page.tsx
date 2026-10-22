import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCollection, getCollectionProducts, isUsingMockData } from "@/lib/shopify";
import type { Collection, Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { DemoNotice } from "@/components/product/DemoNotice";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, ErrorState, ProductGridSkeleton } from "@/components/ui/States";

type Props = { params: Promise<{ handle: string }> };

async function loadCollection(handle: string): Promise<Collection | null | "error"> {
  try {
    return await getCollection(handle);
  } catch (error) {
    console.error("[colecciones]", error);
    return "error";
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await loadCollection(handle);
  if (!collection || collection === "error") return { title: "Colección" };

  return {
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description,
    alternates: { canonical: `/colecciones/${collection.handle}` },
    openGraph: collection.image
      ? { images: [{ url: collection.image.url, alt: collection.image.altText }] }
      : undefined,
  };
}

async function CollectionProducts({ handle }: { handle: string }) {
  let products: Product[] = [];
  try {
    products = await getCollectionProducts({ handle });
  } catch (error) {
    console.error("[colecciones/productos]", error);
    return <ErrorState />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="Esta colección está vacía por ahora."
        text="Estamos preparando nuevas piezas."
        action={
          <ButtonLink href="/" variant="outline">
            Volver al inicio
          </ButtonLink>
        }
      />
    );
  }

  return (
    <>
      {isUsingMockData() && <DemoNotice className="mb-8" />}
      {/* [Fase 2] Filtros y ordenación: barra de controles aquí, leyendo searchParams. */}
      <ProductGrid products={products} priorityCount={4} />
    </>
  );
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const collection = await loadCollection(handle);

  if (collection === "error") {
    return (
      <div className="container-editorial pt-36 pb-24 md:pt-44">
        <ErrorState title="No hemos podido cargar esta colección." />
      </div>
    );
  }
  if (!collection) notFound();

  return (
    <>
      {/* Banda crema a todo el ancho con el título centrado (DESIGN.md · Collection Banner). */}
      <header className="bg-cream pt-[6.25rem] text-center md:pt-[7.25rem]">
        <div className="container-editorial flex flex-col items-center py-14 md:py-20">
          <p className="eyebrow text-stone">Colección</p>
          <h1 className="mt-4 font-serif text-display">{collection.title}</h1>
          {collection.description && <p className="mt-6 max-w-md text-navy">{collection.description}</p>}
        </div>
      </header>

      <section aria-label={`Productos de ${collection.title}`} className="container-editorial py-16 md:py-24">
        <Suspense fallback={<ProductGridSkeleton />}>
          <CollectionProducts handle={collection.handle} />
        </Suspense>
      </section>
    </>
  );
}
