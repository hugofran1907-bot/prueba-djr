import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  careInstructions,
  certifications,
  exactWeightPlaceholder,
  fitNote,
  materialKindFor,
  materials,
  productFallbacks,
  shippingSummary,
} from "@/config/store";
import { getCompleteTheLook, getProduct, getRelatedProducts, isUsingMockData } from "@/lib/shopify";
import type { Product } from "@/lib/types";
import { DemoNotice } from "@/components/product/DemoNotice";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ErrorState } from "@/components/ui/States";
import { productMorphName, siteUrl } from "@/lib/utils";

type Props = { params: Promise<{ handle: string }> };

async function loadProduct(handle: string): Promise<Product | null | "error"> {
  try {
    return await getProduct(handle);
  } catch (error) {
    console.error("[productos]", error);
    return "error";
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await loadProduct(handle);
  if (!product || product === "error") return { title: "Producto" };

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    alternates: { canonical: `/productos/${product.handle}` },
    openGraph: product.featuredImage
      ? { images: [{ url: product.featuredImage.url, alt: product.featuredImage.altText }] }
      : undefined,
  };
}

/** Bloques de texto etiquetados dentro de un acordeón. */
function DetailBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <h3 className="eyebrow text-stone">{label}</h3>
      <p className="mt-2">{text}</p>
    </div>
  );
}

/** Material según el tipo de prenda (config/store.ts). El metacampo de Shopify, si existe, tiene prioridad. */
function MaterialInfo({ product }: { product: Product }) {
  if (product.details.materials) return <p>{product.details.materials}</p>;
  const kind = materialKindFor(product);
  if (!kind) return <p>{productFallbacks.materials}</p>;
  const m = materials[kind];
  return (
    <div className="space-y-3">
      <p>{m.weights ? `${m.fabric}.` : m.fabric}</p>
      {m.weights && (
        <p>
          Gramaje: {exactWeightPlaceholder} ({m.weights}).
        </p>
      )}
      {m.certified && certifications && <p>{certifications.line}</p>}
    </div>
  );
}

async function loadRelated(product: Product) {
  try {
    const look = await getCompleteTheLook(product);
    const related = await getRelatedProducts(product, look.map((p) => p.handle));
    return { look, related };
  } catch (error) {
    console.error("[productos/relacionados]", error);
    return { look: [], related: [] };
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await loadProduct(handle);

  if (product === "error") {
    return (
      <div className="container-editorial pt-36 pb-24 md:pt-44">
        <ErrorState title="No hemos podido cargar este producto." />
      </div>
    );
  }
  if (!product) notFound();

  const mock = isUsingMockData();
  const { look, related } = await loadRelated(product);
  const d = product.details;

  // Solo se publican datos estructurados con precios reales, nunca con los de demostración.
  const productJsonLd = !mock && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.url),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteUrl}/productos/${product.handle}`,
    },
  };

  // Orden de la descripción: beneficio → detalle → uso (→ cuidados en su propio acordeón).
  const accordion = [
    {
      id: "descripcion",
      title: "Descripción",
      content: (
        <div className="space-y-5">
          {product.description && <p>{product.description}</p>}
          <DetailBlock label="Beneficio" text={d.benefit ?? productFallbacks.benefit} />
          <DetailBlock label="Detalle" text={d.detail ?? productFallbacks.detail} />
          <DetailBlock label="Uso" text={d.usage ?? productFallbacks.usage} />
        </div>
      ),
    },
    { id: "materiales", title: "Materiales y gramaje", content: <MaterialInfo product={product} /> },
    { id: "fit", title: "Tallaje y fit", content: <p>{d.fit ?? fitNote}</p> },
    {
      id: "envios",
      title: "Envíos y devoluciones",
      content: (
        <div className="space-y-3">
          {shippingSummary.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>
            <Link href="/legal/envios-y-devoluciones" className="underline underline-offset-2 hover:text-burgundy">
              Ver la política completa
            </Link>
          </p>
        </div>
      ),
    },
    {
      id: "cuidados",
      title: "Cuidados",
      content: d.care ? (
        <p>{d.care}</p>
      ) : (
        <ul className="list-disc space-y-2 pl-5 marker:text-burgundy">
          {careInstructions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <>
      <div className="container-editorial pt-36 pb-20 md:pt-44 lg:pb-28">
        {productJsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
        )}

        <nav aria-label="Ruta de navegación" className="eyebrow mb-8 text-stone">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="relative after:absolute after:-inset-x-2 after:-inset-y-3.5 hover:text-navy">
                Inicio
              </Link>
            </li>
            {product.category && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={`/colecciones/${product.category.handle}`} className="relative after:absolute after:-inset-x-2 after:-inset-y-3.5 hover:text-navy">
                    {product.category.title}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-navy">
              {product.title}
            </li>
          </ol>
        </nav>

        {/* Apilado por debajo de 1024 px; dos columnas a partir de lg. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 xl:gap-20">
          <div data-gallery className="min-w-0">
            <ProductGallery
              images={product.images}
              video={product.video}
              title={product.title}
              morphName={productMorphName(product.handle)}
            />
          </div>

          <div data-buy-column className="min-w-0">
            <div className="lg:sticky lg:top-36">
              <p className="eyebrow text-burgundy">{product.productType}</p>
              <h1 className="mt-4 font-serif text-5xl leading-none md:text-6xl">{product.title}</h1>
              {mock && <DemoNotice className="mt-5" />}

              <ProductPurchase product={product}>
                <Accordion items={accordion} name="detalles-producto" className="mt-10" />
              </ProductPurchase>
            </div>
          </div>
        </div>
      </div>

      {look.length > 0 && (
        <section aria-labelledby="look-title" className="container-editorial border-t border-navy/10 py-20 md:py-28">
          <SectionHeading eyebrow="Combínalo" id="look-title" title="Completa el look" />
          <div className="mt-12">
            {/* Sin morph: estos productos pueden repetirse en «También te puede gustar». */}
            <ProductGrid products={look} morph={false} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container-editorial border-t border-navy/10 py-20 md:py-28">
          <SectionHeading eyebrow={product.category?.title ?? "Más prendas"} id="related-title" title="También te puede gustar" />
          <div className="mt-12">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  );
}
