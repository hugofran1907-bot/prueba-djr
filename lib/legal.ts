/**
 * Estructura de las páginas informativas y legales.
 *
 * Solo define secciones y encabezados estándar. El contenido es el marcador
 * de config/store.ts (legalPlaceholder) salvo hechos legales generales que
 * se indican expresamente. TODO debe redactarlo o revisarlo un profesional
 * antes de publicar la tienda.
 */

import { returns, shipping } from "@/config/store";

export type LegalSection = {
  heading: string;
  /** Texto con datos reales o hechos legales generales. Si falta, se muestra el marcador. */
  body?: string | string[];
  /** Marcador adicional para la parte que aún falta (se muestra tras el texto). */
  pending?: string;
  /** Muestra los datos de la empresa de config/store.ts. */
  showCompany?: boolean;
};

export type LegalPage = { title: string; intro: string; sections: LegalSection[] };

export const legalPages: Record<string, LegalPage> = {
  "aviso-legal": {
    title: "Aviso legal",
    intro: "Información general del sitio web conforme a la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE).",
    sections: [
      { heading: "1. Datos identificativos del titular", showCompany: true },
      { heading: "2. Objeto y ámbito de aplicación" },
      { heading: "3. Condiciones de uso del sitio web" },
      { heading: "4. Propiedad intelectual e industrial" },
      { heading: "5. Exclusión de garantías y responsabilidad" },
      { heading: "6. Enlaces a sitios de terceros" },
      { heading: "7. Legislación aplicable y jurisdicción" },
    ],
  },
  privacidad: {
    title: "Política de privacidad",
    intro: "Cómo tratamos tus datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).",
    sections: [
      { heading: "1. Responsable del tratamiento", showCompany: true },
      { heading: "2. Datos que tratamos" },
      { heading: "3. Finalidades del tratamiento" },
      { heading: "4. Base jurídica" },
      { heading: "5. Plazo de conservación" },
      { heading: "6. Destinatarios y encargados del tratamiento" },
      { heading: "7. Transferencias internacionales" },
      {
        heading: "8. Tus derechos",
        body: "Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar tu consentimiento en cualquier momento.",
      },
      {
        heading: "9. Reclamación ante la autoridad de control",
        body: "Si consideras que el tratamiento no se ajusta a la normativa, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).",
      },
    ],
  },
  cookies: {
    title: "Política de cookies",
    intro: "Información sobre las cookies y tecnologías similares que utiliza este sitio web.",
    sections: [
      { heading: "1. Qué son las cookies" },
      { heading: "2. Cookies que utilizamos" },
      { heading: "3. Cookies de terceros" },
      { heading: "4. Cómo aceptar, rechazar o configurar las cookies" },
      { heading: "5. Actualizaciones de esta política" },
    ],
  },
  "condiciones-de-venta": {
    title: "Condiciones de venta",
    intro: "Condiciones generales aplicables a las compras realizadas en la tienda online de DJR®.",
    sections: [
      { heading: "1. Identificación del vendedor", showCompany: true },
      { heading: "2. Objeto y aceptación" },
      { heading: "3. Proceso de compra" },
      { heading: "4. Precios e impuestos" },
      { heading: "5. Formas de pago" },
      { heading: "6. Envío y entrega" },
      {
        heading: "7. Derecho de desistimiento",
        body: "Como consumidor, dispones de un plazo de 14 días naturales desde la recepción del pedido para desistir de la compra sin necesidad de justificación (arts. 102 y siguientes del Real Decreto Legislativo 1/2007).",
      },
      { heading: "8. Garantía legal de conformidad" },
      { heading: "9. Atención al cliente y reclamaciones" },
      { heading: "10. Legislación aplicable y resolución de litigios" },
    ],
  },
  "envios-y-devoluciones": {
    title: "Envíos y devoluciones",
    intro: "Plazos, costes y procedimiento de envíos, cambios y devoluciones.",
    sections: [
      { heading: "1. Zonas de envío", body: shipping.zones },
      {
        heading: "2. Plazos de entrega",
        body: [`Plazo de entrega: ${shipping.deliveryDays} días.`, `Transportista: ${shipping.carrier}.`],
      },
      {
        heading: "3. Costes de envío",
        body: [
          `El envío es gratis en pedidos desde ${shipping.freeFrom} €.`,
          `Pedidos por debajo de ${shipping.freeFrom} €: ${shipping.cost}.`,
        ],
      },
      {
        heading: "4. Cambios de talla",
        body: `Puedes cambiar tu pedido en un plazo de ${returns.days} días desde que lo recibes${returns.free ? ", sin coste para ti" : ""}.`,
        pending: returns.howTo,
      },
      {
        heading: "5. Devoluciones",
        body: `Tienes ${returns.days} días desde que recibes el pedido para devolverlo${returns.free ? ". La devolución es gratuita para el cliente" : ""}.`,
        pending: returns.howTo,
      },
      {
        heading: "6. Derecho de desistimiento (14 días)",
        body: "Dispones de 14 días naturales desde que recibes el pedido para desistir de la compra sin indicar el motivo. Para ejercerlo, basta con comunicárnoslo de forma inequívoca dentro de ese plazo.",
      },
      { heading: "7. Reembolsos" },
      { heading: "8. Productos defectuosos o erróneos" },
    ],
  },
  contacto: {
    title: "Contacto",
    intro: "Escríbenos para cualquier duda sobre pedidos, tallas o colaboraciones.",
    sections: [{ heading: "Datos de contacto", showCompany: true }],
  },
};
