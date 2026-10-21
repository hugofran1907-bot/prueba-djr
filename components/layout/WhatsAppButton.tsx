import { isPlaceholder, whatsapp } from "@/config/store";

/**
 * Botón flotante de WhatsApp. No se muestra mientras el número de
 * config/store.ts sea un marcador. En móvil sube cuando la barra fija de
 * compra está visible (ver .whatsapp-fab en globals.css).
 */
export function WhatsAppButton() {
  if (isPlaceholder(whatsapp.number)) return null;
  const number = whatsapp.number.replace(/\D/g, "");
  const href = `https://wa.me/${number}?text=${encodeURIComponent(whatsapp.message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp (se abre en una pestaña nueva)"
      className="whatsapp-fab on-light fixed right-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-navy text-cream shadow-lg shadow-night/60 transition-[background-color,bottom] duration-300 hover:bg-burgundy md:right-6"
    >
      {/* Burbuja de chat genérica */}
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" strokeLinejoin="round" />
        <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a3.6 3.6 0 0 1-1.8-1.8l.8-1-1-2z" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
