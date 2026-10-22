import Link from "next/link";
import { siteConfig } from "@/config/site";
import { activeSocial, company, isPlaceholder, social } from "@/config/store";
import { Logo } from "@/components/layout/Logo";
import { PaymentIcons } from "@/components/layout/PaymentIcons";

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="eyebrow text-navy/50">{title}</h2>
      {/* En móvil, más separación para que cada enlace tenga su zona de toque (after: en el enlace). */}
      <ul className="mt-5 space-y-5 md:space-y-3">
        {(links ?? []).map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="link-underline relative text-sm text-navy/85 after:absolute after:-inset-x-1 after:-inset-y-2.5 hover:text-navy md:after:-inset-y-1.5">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const footerNav = siteConfig.footerNav ?? { shop: [], help: [], legal: [] };
  const socialLinks = activeSocial() ?? [];

  return (
    <footer className="bg-night text-navy">
      <div className="container-editorial pt-20 pb-10 md:pt-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-serif text-3xl leading-tight text-balance md:text-4xl">
              Streetwear minimalista para la ciudad.
            </p>
            <address className="mt-8 space-y-2 text-sm text-navy/75 not-italic">
              <p>
                {isPlaceholder(company.email) ? (
                  company.email
                ) : (
                  <a href={`mailto:${company.email}`} className="link-underline hover:text-navy">
                    {company.email}
                  </a>
                )}
              </p>
              <p>
                {isPlaceholder(company.phone) ? (
                  company.phone
                ) : (
                  <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="link-underline hover:text-navy">
                    {company.phone}
                  </a>
                )}
              </p>
              {!isPlaceholder(company.address) && <p>{company.address}</p>}
              <p>{company.city}</p>
            </address>
          </div>

          <nav aria-label="Pie de página" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            <FooterColumn title="Tienda" links={footerNav.shop} />
            <FooterColumn title="Ayuda" links={footerNav.help} />
            <FooterColumn title="Legal" links={footerNav.legal} />
            <div>
              <h2 className="eyebrow text-navy/50">Síguenos</h2>
              {socialLinks.length > 0 ? (
                <ul className="mt-5 space-y-5 md:space-y-3">
                  {socialLinks.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline relative text-sm text-navy/85 after:absolute after:-inset-x-1 after:-inset-y-2.5 hover:text-navy md:after:-inset-y-1.5"
                      >
                        {s.label}
                        <span className="sr-only"> (se abre en una pestaña nueva)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-5 space-y-3 text-sm text-navy/60">
                  {Object.values(social ?? {}).map((s) => (
                    <li key={s.label}>
                      {s.label}: {s.handle}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </nav>
        </div>

        <PaymentIcons className="mt-16 flex flex-wrap gap-2 text-navy/80" />

        {/* Firma tipográfica a todo el ancho */}
        <div aria-hidden="true" className="mt-16 overflow-hidden border-t border-navy/15 pt-6 md:mt-20">
          {/* El monograma se dibuja trazo a trazo y luego se rellena al llegar al pie (data-reveal="draw"). */}
          <div data-reveal="draw">
            <Logo asLink={false} className="block text-[31vw] leading-[0.8] text-navy md:text-[26vw]" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-xs text-navy/55 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} DJR®. {company.legalName} · {company.taxId}
          </p>
          <p>Hecho con calma, para la calle.</p>
        </div>
      </div>
    </footer>
  );
}
