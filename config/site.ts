import { brandStory, hero, promo, season } from "@/config/store";

/**
 * Configuración de marca y contenido editorial (navegación, textos, imágenes).
 * Los datos comerciales, legales y de contacto están en config/store.ts.
 */

export const siteConfig = {
  name: "DJR",
  tagline: "Streetwear minimalista",

  /**
   * Logotipo. null → se muestra «DJR®» en texto.
   * Con valor, la web pinta el monograma vectorial en línea (components/layout/logo-mark.ts),
   * que toma el color del texto. Aquí queda la ruta del archivo para usos externos:
   * logo-djr.svg (blanco, para fondos oscuros) y logo-djr-negro.svg (para fondos claros).
   * Aparece en la cabecera, el menú móvil, el telón de navegación y la firma grande del pie.
   */
  logo: { src: "/images/marca/logo-djr.svg", width: 2046, height: 1707 } as {
    src: string;
    width: number;
    height: number;
  } | null,

  description:
    "DJR® es una marca de streetwear minimalista: camisetas, sudaderas y pantalones de líneas limpias, pensados para la ciudad.",
  locale: "es_ES",

  mainNav: [
    { label: "Novedades", href: "/#novedades" },
    { label: "Camisetas", href: "/colecciones/camisetas" },
    { label: "Sudaderas", href: "/colecciones/sudaderas" },
    { label: "Pantalones", href: "/colecciones/pantalones" },
    { label: "Marca", href: "/#marca" },
  ],

  footerNav: {
    shop: [
      { label: "Toda la colección", href: "/colecciones/todo" },
      { label: "Novedades", href: "/#novedades" },
      { label: "Camisetas", href: "/colecciones/camisetas" },
      { label: "Sudaderas", href: "/colecciones/sudaderas" },
      { label: "Pantalones", href: "/colecciones/pantalones" },
    ],
    help: [
      { label: "Preguntas frecuentes", href: "/faq" },
      { label: "Envíos y devoluciones", href: "/legal/envios-y-devoluciones" },
      { label: "Contacto", href: "/legal/contacto" },
    ],
    legal: [
      { label: "Aviso legal", href: "/legal/aviso-legal" },
      { label: "Privacidad", href: "/legal/privacidad" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Condiciones de venta", href: "/legal/condiciones-de-venta" },
    ],
  },

  /** Colecciones destacadas en la home, en este orden (handles de Shopify). */
  featuredCollections: ["camisetas", "sudaderas", "pantalones"],
} as const;

/**
 * Banner promocional de la home.
 * Pon enabled: false para ocultarlo. No incluyas descuentos ni condiciones
 * que no estén realmente activos en Shopify.
 */
export const promoBanner = {
  enabled: true,
  eyebrow: `Sudaderas · ${season}`,
  title: "Para las mañanas frías.",
  text: `Felpa con cuerpo y cortes amplios, hechos para aguantar más de un invierno. ${promo.message}`,
  cta: { label: "Ver sudaderas", href: "/colecciones/sudaderas" },
  image: {
    url: "/images/campana/sudaderas.webp",
    alt: "Chico y chica con sudadera negra de cuello redondo y pantalón negro DJR frente a una pared de hormigón",
    /** "cover" llena el panel (fotos); "contain" muestra la imagen entera (diseños, bocetos). */
    fit: "cover" as "cover" | "contain",
  },
  /** "burgundy" | "navy" */
  tone: "burgundy" as "burgundy" | "navy",
};

export const heroContent = {
  eyebrow: `Colección 01 — ${season}`,
  title: ["Menos ruido.", "Más presencia."],
  text: "Streetwear de líneas limpias, hecho para moverse por la ciudad sin pedir permiso.",
  valueProp: hero.valueProp,
  cta: { label: "Comprar la Colección 01", href: "/colecciones/todo" },
  secondaryCta: { label: "Novedades", href: "/#novedades" },
  image: {
    url: "/images/portada/portada-negro-original.webp",
    alt: "Chico y chica con camiseta negra DJR y pantalón negro de pierna ancha, apoyados en una pared negra",
  },
  /** Foto que aparece al pasar el ratón por la de portada (mismo encuadre). null para desactivarlo. */
  hoverImage: {
    url: "/images/portada/portada-blanco-bn.webp",
    alt: "Los mismos modelos con camiseta blanca DJR y pantalón blanco de pierna ancha",
  } as { url: string; alt: string } | null,
  /**
   * Vídeo de campaña de fondo (opcional). Solo se reproduce en escritorio, con movimiento
   * permitido y sin ahorro de datos; en el resto se ve la foto de arriba. Recomendado:
   * MP4 (H.264) de 8–15 s en bucle, sin audio, 1920 px de ancho y menos de 4 MB, en
   * public/videos/. Ejemplo: { src: "/videos/campana.mp4", type: "video/mp4" }.
   */
  video: null as { src: string; type: string; poster?: string } | null,
};

export const brandContent = {
  eyebrow: "La marca",
  title: "Diseñamos lo que nos pondríamos todos los días.",
  paragraphs: [
    "DJR® nace de una idea sencilla: menos prendas, mejor pensadas. Siluetas limpias, una paleta corta y ningún logotipo que grite más que quien lo lleva.",
    brandStory.story,
  ],
  principles: [
    { title: "Paleta corta", text: "Negro, blanco y gris. Todo combina con todo." },
    { title: "Siluetas limpias", text: "Cortes que funcionan solos o por capas, sin artificios." },
    { title: "Hecho para durar", text: brandStory.durability },
  ],
  image: {
    url: "/images/marca/logos.jpg",
    alt: "Bocetos de los logos de DJR: el monograma, la doble estrella y la firma",
  },
};
