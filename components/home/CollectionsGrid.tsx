import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getCollectionsByHandle } from "@/lib/shopify";
import type { Collection } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { ArrowIcon } from "@/components/ui/Button";

/** Tesela de colección: foto redondeada con píldora «Ver» y título debajo. */
function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/colecciones/${collection.handle}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-media bg-cream">
        {collection.image && (
          <Image
            src={collection.image.url}
            alt={collection.image.altText}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="photo-mono object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.05]"
          />
        )}
        <span className="absolute bottom-4 left-4 inline-flex min-h-10 items-center gap-3 rounded-full bg-white px-5 text-[0.75rem] font-medium tracking-[0.08em] text-navy uppercase transition-colors duration-300 group-hover:bg-navy group-hover:text-cream">
          Ver
          <ArrowIcon />
        </span>
      </div>
      <h3 className="mt-5 font-serif text-2xl leading-none md:text-3xl">{collection.title}</h3>
      {collection.description && <p className="mt-3 max-w-xs text-base text-stone">{collection.description}</p>}
    </Link>
  );
}

export async function CollectionsGrid() {
  let collections: Collection[] = [];
  let failed = false;

  try {
    collections = await getCollectionsByHandle([...siteConfig.featuredCollections]);
  } catch (error) {
    console.error("[CollectionsGrid]", error);
    failed = true;
  }

  return (
    <section aria-labelledby="colecciones-title" id="colecciones" className="container-editorial py-16 md:py-24">
      <SectionHeading eyebrow="Colecciones" id="colecciones-title" title="Tres piezas. Un uniforme." align="center" />

      <div className="mt-12 md:mt-16">
        {failed ? (
          <ErrorState title="No hemos podido cargar las colecciones." />
        ) : collections.length === 0 ? (
          <EmptyState title="Colecciones en preparación." text="Muy pronto encontrarás aquí nuestras colecciones." />
        ) : (
          <div data-reveal-stagger className="grid gap-12 md:grid-cols-3 md:gap-4">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
