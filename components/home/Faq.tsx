import { faq, isPlaceholder } from "@/config/store";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Datos estructurados FAQPage solo con respuestas reales (sin marcadores). */
export function faqJsonLd() {
  const answered = faq.filter((f) => !isPlaceholder(f.answer));
  if (answered.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: answered.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function FaqList() {
  return (
    <Accordion
      name="faq"
      size="large"
      items={faq.map((f, i) => ({ id: `faq-${i}`, title: f.question, content: <p className="max-w-2xl">{f.answer}</p> }))}
    />
  );
}

/** FAQ en la home. */
export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="container-editorial py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="faq-title" title="Preguntas frecuentes" />
          <ButtonLink href="/faq" variant="outline" arrow className="mt-10">
            Ver todas
          </ButtonLink>
        </div>
        <div suppressHydrationWarning data-reveal className="lg:col-span-7 lg:col-start-6">
          <FaqList />
        </div>
      </div>
    </section>
  );
}
