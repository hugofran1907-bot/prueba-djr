import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/config/store";
import { FaqList, faqJsonLd } from "@/components/home/Faq";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Tallaje, envíos, cambios, devoluciones, materiales y pagos en DJR®.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = faqJsonLd();
  return (
    <div className="container-editorial pt-36 pb-24 md:pt-44 md:pb-32">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-burgundy">Ayuda</p>
          <h1 className="mt-4 font-serif text-headline">Preguntas frecuentes</h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone">
            ¿No encuentras tu respuesta? Escríbenos a {company.email} o visita la página de{" "}
            <Link href="/legal/contacto" className="underline underline-offset-2 hover:text-navy">
              contacto
            </Link>
            .
          </p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <FaqList />
        </div>
      </div>
    </div>
  );
}
