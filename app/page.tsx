import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { activeSocial } from "@/config/store";
import { Hero } from "@/components/home/Hero";
import { KineticType } from "@/components/home/KineticType";
import { CollectionsGrid } from "@/components/home/CollectionsGrid";
import { NewArrivals } from "@/components/home/NewArrivals";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BrandStatement } from "@/components/home/BrandStatement";
import { Reviews } from "@/components/home/Reviews";
import { Faq, faqJsonLd } from "@/components/home/Faq";
import { Newsletter } from "@/components/home/Newsletter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGridSkeleton } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";
import { siteUrl } from "@/lib/utils";

// La home se genera estática; se regenera cada hora para reflejar cambios
// en Shopify y recuperarse si una consulta falló durante el build.
export const revalidate = 3600;

export default function HomePage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `${siteConfig.name}®`,
    url: siteUrl,
    sameAs: activeSocial().map((s) => s.url),
  };
  const faqLd = faqJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <Hero />
      <KineticType image="/images/marca/patron-djr.jpg" />

      <section aria-labelledby="novedades-title" id="novedades" className="container-editorial pt-16 md:pt-24">
        <SectionHeading
          eyebrow="Novedades"
          id="novedades-title"
          title="Recién llegado al estudio."
          action={
            <ButtonLink href="/colecciones/todo" variant="outline" arrow>
              Ver todo
            </ButtonLink>
          }
        />
        <div className="mt-12 md:mt-16">
          <Suspense fallback={<ProductGridSkeleton label="Cargando novedades" />}>
            <NewArrivals />
          </Suspense>
        </div>
      </section>

      <CollectionsGrid />
      <PromoBanner />
      <BrandStatement />
      <Reviews />
      <Faq />
      <Newsletter />
    </>
  );
}
