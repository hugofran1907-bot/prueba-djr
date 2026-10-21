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
   * Para usar el monograma: guarda el archivo en public/images/marca/ (SVG en BLANCO o
   * claro, con fondo transparente, porque la web es oscura) y pon aquí su ruta y su
   * proporción, por ejemplo: { src: "/images/marca/logo.svg", width: 120, height: 90 }.
   * Aparece en la cabecera, el menú móvil y la firma grande del pie.
   */
  logo: { src: "/images/marca/logo-djr.png", width: 2128, height: 1789 } as {
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
    url: "/images/portada/portada.webp",
    alt: "Chico y chica con camiseta negra DJR y pantalón negro de pierna ancha, apoyados en una pared negra",
  },
  /** Foto que aparece al pasar el ratón por la de portada (mismo encuadre). null para desactivarlo. */
  hoverImage: {
    url: "/images/portada/portada-blanco.webp",
    alt: "Los mismos modelos con camiseta blanca DJR y pantalón blanco de pierna ancha",
  } as { url: string; alt: string } | null,
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
