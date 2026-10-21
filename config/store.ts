/**
 * ════════════════════════════════════════════════════════════════════
 *  DATOS DE LA TIENDA · ÚNICO LUGAR PARA RELLENAR LOS [REEMPLAZAR]
 * ════════════════════════════════════════════════════════════════════
 * Todo dato comercial, legal o de contacto vive aquí. Los componentes
 * lo leen de este archivo, así que basta con editarlo una vez.
 *
 * Regla: nunca escribas aquí datos que no sean reales. Si no conoces un
 * valor, deja el marcador [REEMPLAZAR: …]; la interfaz lo mostrará tal
 * cual (o lo ocultará cuando mostrarlo no tenga sentido, p. ej. WhatsApp).
 */

/** Marcador visible para datos pendientes. */
const R = (what: string) => `[REEMPLAZAR: ${what}]`;

/** true si el valor está vacío o sigue siendo un marcador. */
export const isPlaceholder = (value?: string | null) => !value || value.includes("[REEMPLAZAR");

/**
 * Carrito:
 *  true  → la ficha muestra «Añadir al carrito · precio» (los productos agotados siguen con «Avísame»).
 *  false → todas las fichas muestran «Avísame cuando salga».
 */
export const CART_ENABLED = true;

/**
 * Pago:
 *  false → el carrito funciona, pero «Finalizar compra» queda desactivado con un aviso.
 *  true  → «Finalizar compra» crea el carrito en Shopify y redirige al pago (requiere Shopify conectado).
 */
export const CHECKOUT_ENABLED = false;

/* ───────────────────────── Empresa y contacto ───────────────────────── */

export const company = {
  legalName: R("razón social"),
  taxId: R("NIF/CIF"),
  registry: R("datos registrales"),
  email: R("email de contacto"),
  phone: R("teléfono"),
  address: R("dirección postal"),
  city: "Cambrils, Tarragona",
};

/** Redes sociales. Si la URL contiene [REEMPLAZAR] el enlace no se publica. */
export const social = {
  instagram: { label: "Instagram", handle: R("usuario de Instagram"), url: "https://instagram.com/[REEMPLAZAR]" },
  tiktok: { label: "TikTok", handle: R("usuario de TikTok"), url: "https://tiktok.com/@[REEMPLAZAR]" },
};

/** Redes con URL real configurada (las que tienen marcador no se enlazan). */
export const activeSocial = () => Object.values(social ?? {}).filter((s) => s && !isPlaceholder(s.url));

/**
 * WhatsApp. Número en formato internacional, solo dígitos (p. ej. 34600000000).
 * Mientras sea un marcador, el botón flotante NO se muestra.
 */
export const whatsapp = {
  number: R("número de WhatsApp"),
  message: "Hola DJR, tengo una pregunta sobre…",
};

/* ───────────────────────── Envíos, cambios y pago ───────────────────────── */

export const shipping = {
  /** Importe (€) a partir del cual el envío es gratis. */
  freeFrom: "60",
  /** Coste del envío en pedidos por debajo de freeFrom. */
  cost: R("coste del envío por debajo de 60 €"),
  deliveryDays: R("plazo"),
  carrier: R("transportista"),
  zones: R("zonas de envío"),
};

export const returns = {
  days: "30",
  /** true = cambios y devoluciones gratuitos para el cliente. */
  free: true,
  howTo: R("cómo se solicita el cambio o la devolución"),
};

/**
 * Métodos de pago (iconos del pie y junto al botón de compra). Verifica en
 * Shopify Payments que cada uno está activo antes de publicar.
 */
export type PaymentMethod = "visa" | "mastercard" | "paypal" | "bizum" | "applepay" | "googlepay" | "shoppay";
export const paymentMethods: PaymentMethod[] = ["visa", "mastercard", "paypal", "bizum", "applepay", "googlepay", "shoppay"];

/** Resumen en texto de los métodos de pago (FAQ). */
export const paymentSummary = "Tarjeta (Visa y Mastercard), PayPal, Bizum, Apple Pay, Google Pay y Shop Pay.";

/* ───────────────────────── Mensajes de confianza ───────────────────────── */

const returnsFree = returns.free ? " gratis" : "";

/** Barra de anuncios rotativa (encima de la cabecera). Deja el array vacío para ocultarla. */
export const announcements = [
  `Envío gratis desde ${shipping.freeFrom} €`,
  `Devoluciones${returnsFree} en ${returns.days} días`,
  "Pago seguro",
];

/** Líneas de confianza bajo el botón de compra. */
export const trustLines = {
  shipping: `Envío en ${shipping.deliveryDays} días`,
  returns: `Cambios y devoluciones${returnsFree} en ${returns.days} días`,
  payment: "Pago 100% seguro",
};

/** Texto del acordeón «Envíos y devoluciones» de la ficha. */
export const shippingSummary = [
  `Envío gratis en pedidos desde ${shipping.freeFrom} €. Tienes ${returns.days} días para cambiar o devolver tu pedido${returns.free ? ", gratis" : ""}.`,
  `Plazo de entrega: ${shipping.deliveryDays} días.`,
];

/* ───────────────────────── Materiales y fabricación ───────────────────────── */

export const manufacturing = "Fabricado en Estambul, Turquía.";

/**
 * Certificaciones. Pon `null` para quitarlas de toda la web (ficha,
 * «Hecho para durar» y FAQ) de una sola vez.
 */
export const certifications: { line: string; short: string } | null = {
  line: "Materiales con certificación OEKO-TEX y GOTS (algodón orgánico).",
  short: "con certificación OEKO-TEX y GOTS",
};

export type MaterialKind = "camiseta" | "polo" | "felpa";

/** Tejido y rango de gramaje por tipo de prenda. weights null = sin rango conocido. */
export const materials: Record<MaterialKind, { fabric: string; weights: string | null; certified: boolean }> = {
  camiseta: { fabric: "Algodón single jersey", weights: "disponible en 160, 180, 200 y 280 g/m²", certified: true },
  polo: { fabric: "Piqué", weights: "alrededor de 220 g/m²", certified: true },
  felpa: { fabric: "Felpa / French terry", weights: "de 350 a 450 g/m²", certified: true },
};

/** Gramaje exacto de cada prenda (pendiente). */
export const exactWeightPlaceholder = R("gramaje exacto");

/** Clasifica un producto por tipo de tejido a partir de su tipo, título y etiquetas. */
export function materialKindFor(product: { productType: string; title: string; tags: string[] }): MaterialKind | null {
  const text = [product.productType, product.title, ...product.tags].join(" ").toLowerCase();
  if (/polo/.test(text)) return "polo";
  if (/sudadera|hoodie|crewneck|pantal|jogger|chándal|chandal/.test(text)) return "felpa";
  if (/camiseta/.test(text)) return "camiseta";
  return null;
}

/** Cuidados: iguales para todas las prendas. */
export const careInstructions = [
  "Lava al revés y con agua fría, máximo 30 °C, para que el algodón no encoja ni pierda color.",
  "No uses secadora: sécala al aire libre y a la sombra.",
  "Usa jabón suave, sin lejía ni blanqueadores.",
  "Plancha siempre del revés y nunca sobre estampados o bordados.",
];

/** Fit de todas las prendas (acordeón «Tallaje y fit» y guía de tallas). */
export const fitNote = "Corte oversize. Si prefieres un ajuste más ceñido, pide una talla menos.";

/* ───────────────────────── Textos de conversión ───────────────────────── */

export const season = "Otoño-Invierno 2026";

export const hero = {
  valueProp: "Camisetas, sudaderas y pantalones de corte oversize.",
};

export const newsletter = {
  incentive: `Apúntate y consigue un ${R("%")} de descuento en tu primera compra.`,
};

export const promo = {
  message: R("mensaje de campaña"),
};

export const brandStory = {
  story: R("historia de la marca, origen, proceso de producción y compromisos reales"),
  durability: `Algodón y felpa de 160 a 450 g/m²${certifications ? `, ${certifications.short}` : ""}. ${manufacturing}`,
};

/* ───────────────────────── Fundadores ───────────────────────── */

export type Founder = { name: string; role: string; photo: { url: string; alt: string } | null };

/** Texto que se muestra mientras no haya foto. */
export const founderPhotoPlaceholder = R("foto");

export const founders: Founder[] = [
  { name: "Gorka", role: "Diseño", photo: null },
  { name: "Hugo", role: "Web y marketing", photo: null },
  { name: "Francesc", role: "Web y marketing", photo: null },
];

/* ───────────────────────── Reseñas ───────────────────────── */

export type Review = {
  author: string;
  /** 1–5, solo si la reseña real tiene puntuación. */
  rating?: number;
  text: string;
  product?: string;
  date?: string;
};

/**
 * Reseñas REALES de clientes (o importadas de tu app de reseñas).
 * Vacío → la sección muestra «Síguenos en Instagram». No añadas ejemplos.
 */
export const reviews: Review[] = [];

/* ───────────────────────── Producto: textos por defecto ───────────────────────── */

/**
 * Se muestran cuando un producto no trae ese dato (en Shopify, desde
 * metacampos custom.*). Nunca rellenes con datos genéricos inventados.
 */
export const productFallbacks = {
  benefit: R("beneficio principal de la prenda"),
  detail: R("detalles de diseño y confección"),
  usage: R("cómo y cuándo llevarla"),
  materials: R("composición y gramaje"),
};

/** Guía de tallas: medidas en cm por talla. */
export const sizeGuide = {
  sizes: ["S", "M", "L", "XL"],
  measurements: [
    { key: "chest", label: "Pecho" },
    { key: "length", label: "Largo" },
    { key: "sleeve", label: "Manga" },
  ],
  /** Rellena con números reales: values[talla][medida]. */
  values: {} as Record<string, Partial<Record<"chest" | "length" | "sleeve", number>>>,
  /** Marcador de las celdas sin medida. */
  missingValue: "[REEMPLAZAR]",
  model: { height: R("altura"), size: R("talla") },
  fitNote,
};

/** Colores de las muestras cuando Shopify no envía swatch. Clave = nombre del valor en minúsculas. */
export const colorSwatches: Record<string, string> = {
  negro: "#111111",
  blanco: "#FFFFFF",
  gris: "#8C8C8C",
  crema: "#F2EDE4",
  "azul marino": "#0B0B1E",
  burdeos: "#7A1F2B",
};

/* ───────────────────────── Preguntas frecuentes ───────────────────────── */

export const faq = [
  {
    question: "¿Cómo talla?",
    answer: `Nuestras prendas tienen corte oversize. Si prefieres un ajuste más ceñido, pide una talla menos. Consulta la guía de tallas en cada producto.`,
  },
  {
    question: "¿Cuánto tarda el envío?",
    answer: `${R("plazo")}. El envío es gratis en pedidos desde ${shipping.freeFrom} €.`,
  },
  {
    question: "¿Cómo cambio de talla o devuelvo?",
    answer: `Tienes ${returns.days} días desde que recibes el pedido para cambiarlo o devolverlo${returns.free ? ", gratis" : ""}. ${returns.howTo}.`,
  },
  {
    question: "¿De qué están hechas las prendas?",
    answer: `Camisetas de algodón single jersey (160–280 g/m²) y sudaderas y pantalones de felpa / French terry (350–450 g/m²)${certifications ? `, ${certifications.short}` : ""}.`,
  },
  { question: "¿Dónde se fabrican?", answer: "En Estambul, Turquía." },
  { question: "¿Qué métodos de pago aceptáis?", answer: paymentSummary },
];

/* ───────────────────────── Formularios ───────────────────────── */

/**
 * Proveedor de email (newsletter y «Avísame»). Mientras sea null, los
 * formularios validan pero avisan de que el correo NO se guarda.
 * [REEMPLAZAR] conectando Shopify Customer API, Klaviyo, Mailchimp… en lib/actions.ts.
 */
export const emailProvider: null | "shopify" | "klaviyo" | "mailchimp" = null;

/* ───────────────────────── Textos legales ───────────────────────── */

export const legalPlaceholder = R("contenido redactado o revisado por un profesional");
