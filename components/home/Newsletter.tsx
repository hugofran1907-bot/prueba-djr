import { newsletter } from "@/config/store";
import { subscribeNewsletter } from "@/lib/actions";
import { EmailForm } from "@/components/ui/EmailForm";

/**
 * Newsletter. Mientras no haya proveedor (config/store.ts → emailProvider),
 * el formulario valida y avisa con honestidad de que el correo NO se guarda.
 */
export function Newsletter() {
  return (
    <section aria-labelledby="newsletter-title" className="bg-cream">
      <div data-reveal-stagger className="container-editorial grid gap-12 py-24 md:grid-cols-12 md:py-32">
        <div className="md:col-span-6">
          <p className="eyebrow text-stone">
            Newsletter
          </p>
          <h2 id="newsletter-title" className="mt-5 font-serif text-headline text-balance">
            Las nuevas entregas, antes que nadie.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-stone">
            Lanzamientos, reposiciones y notas de estudio. Sin ruido.
          </p>
          <p className="mt-6 inline-flex border-l-2 border-burgundy pl-4 text-base font-medium text-navy">
            {newsletter.incentive}
          </p>
        </div>

        <EmailForm
          action={subscribeNewsletter}
          className="md:col-span-5 md:col-start-8 md:self-end"
          consentText="Acepto recibir comunicaciones de DJR®."
          successText="Listo. Revisa tu correo para confirmar la suscripción."
        />
      </div>
    </section>
  );
}
