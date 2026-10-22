import type { Metadata } from "next";
import { Suspense } from "react";
import { NewArrivals } from "@/components/home/NewArrivals";
import { ProductGridSkeleton } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Novedades",
  description: "Lo último de DJR®: camisetas, sudaderas y pantalones recién llegados al estudio.",
  alternates: { canonical: "/novedades" },
};

// Igual que la home: estática y regenerada cada hora.
export const revalidate = 3600;

/**
 * Página propia de Novedades: la misma banda de cabecera que las colecciones y la misma
 * rejilla de novedades que la home (components/home/NewArrivals.tsx).
 */
export default function NovedadesPage() {
  return (
    <>
      <header className="bg-cream pt-[6.25rem] text-center md:pt-[7.25rem]">
        <div className="container-editorial flex flex-col items-center py-14 md:py-20">
          <p className="eyebrow text-stone">Novedades</p>
          <h1 className="mt-4 font-serif text-display">Recién llegado al estudio.</h1>
        </div>
      </header>

      <section aria-label="Novedades" className="container-editorial py-16 md:py-24">
        <Suspense fallback={<ProductGridSkeleton label="Cargando novedades" />}>
          <NewArrivals />
        </Suspense>
        <div className="mt-16 flex justify-center">
          <ButtonLink href="/colecciones/todo" variant="outline" arrow>
            Ver todo
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
