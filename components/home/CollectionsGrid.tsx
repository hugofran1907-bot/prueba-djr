import { siteConfig } from "@/config/site";
import { getCollectionsByHandle } from "@/lib/shopify";
import type { Collection } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { CollectionsStory } from "@/components/home/CollectionsStory";

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
          <CollectionsStory collections={collections} />
        )}
      </div>
    </section>
  );
}
