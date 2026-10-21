import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { company, legalPlaceholder } from "@/config/store";
import { legalPages } from "@/lib/legal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages[slug];
  return page ? { title: page.title, description: page.intro, alternates: { canonical: `/legal/${slug}` } } : {};
}

function CompanyData() {
  const rows = [
    ["Razón social", company.legalName],
    ["NIF/CIF", company.taxId],
    ["Datos registrales", company.registry],
    ["Domicilio", company.address],
    ["Localidad", company.city],
    ["Correo electrónico", company.email],
    ["Teléfono", company.phone],
  ];
  return (
    <dl className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-[auto_1fr]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="eyebrow text-stone">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const page = legalPages[slug];
  if (!page) notFound();

  return (
    <article className="container-editorial pt-36 pb-24 md:pt-44">
      <div className="max-w-3xl">
        <p className="eyebrow text-burgundy">Información</p>
        <h1 className="mt-4 font-serif text-headline">{page.title}</h1>
        <p className="mt-8 text-lg leading-relaxed text-navy/85">{page.intro}</p>

        <div role="note" className="mt-10 border-l-2 border-burgundy bg-cream-deep p-6 text-sm leading-relaxed">
          <p className="font-medium">Texto pendiente de redacción.</p>
          <p className="mt-2 text-stone">
            Este contenido debe redactarlo o revisarlo un profesional antes de publicar la tienda.
          </p>
        </div>

        <div className="mt-14 space-y-12">
          {page.sections.map((section, i) => (
            <section key={section.heading} aria-labelledby={`seccion-${i + 1}`}>
              <h2 id={`seccion-${i + 1}`} className="font-serif text-3xl">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-navy/85">
                {section.showCompany && <CompanyData />}
                {[section.body ?? []].flat().map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {section.pending && <p className="text-stone">{section.pending}</p>}
                {!section.showCompany && !section.body && <p className="text-stone">{legalPlaceholder}</p>}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
