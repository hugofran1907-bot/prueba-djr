import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { BrandStatement } from "@/components/home/BrandStatement";

export const metadata: Metadata = {
  title: "La marca",
  description: siteConfig.description,
  alternates: { canonical: "/marca" },
};

/**
 * Página propia de la marca: la misma banda de cabecera que las colecciones y la misma
 * sección de marca que la home (texto, imagen, principios y fundadores).
 */
export default function MarcaPage() {
  return (
    <>
      <header className="bg-cream pt-[6.25rem] text-center md:pt-[7.25rem]">
        <div className="container-editorial flex flex-col items-center py-14 md:py-20">
          <p className="eyebrow text-stone">DJR®</p>
          <h1 className="mt-4 font-serif text-display">La marca</h1>
        </div>
      </header>

      <BrandStatement />
    </>
  );
}
