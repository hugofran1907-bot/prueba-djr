import type { Collection, Image, Product, ProductVariant } from "@/lib/types";
import { lookSrc } from "@/lib/looks";

/**
 * DATOS DE DEMOSTRACIÓN
 * ─────────────────────
 * Solo se usan con USE_MOCK_DATA=true. Imitan la forma ya normalizada de
 * los datos de Shopify (ver lib/types.ts).
 *
 * · Catálogo real de DJR (camisetas, sudaderas crewneck y pantalones en negro,
 *   blanco y gris). Precios, tallas y disponibilidad son ficticios, solo para maquetar.
 * · Stock por unidades: null (desconocido) → no se muestra escasez.
 * · Materiales, cuidados, fit…: null → la UI muestra el marcador de config/store.ts.
 * · Imágenes en public/images/productos/<handle>/: 1.jpg es la ficha del diseño
 *   técnico (fondo liso, 1200×1500); el resto, fotos de las sesiones y conjuntos.
 *   Las fichas en blanco y gris de camiseta, sudadera y pantalón están recoloreadas
 *   a partir de los diseños. [REEMPLAZAR] por fotografía de producto definitiva.
 */

/** Imagen local de /public/images. */
const local = (path: string, alt: string, width: number, height: number): Image => ({
  url: `/images/${path}`,
  altText: alt,
  width,
  height,
});

/** Ficha de producto (diseño técnico sobre fondo liso). */
const ficha = (handle: string, alt: string) => local(`productos/${handle}/1.jpg`, alt, 1200, 1500);
/** Foto de conjunto (public/images/conjuntos, formato vertical 3:4). */
const conjunto = (n: number, alt: string): Image => ({
  url: lookSrc(n) ?? "/images/conjuntos/look-01.jpg",
  altText: alt,
  width: 1536,
  height: 2048,
});

const SIZES = ["S", "M", "L", "XL"];

function sizeVariants(productId: string, amount: string, soldOut: string[] = []): ProductVariant[] {
  return SIZES.map((size) => ({
    id: `${productId}-${size.toLowerCase()}`,
    title: size,
    availableForSale: !soldOut.includes(size),
    selectedOptions: [{ name: "Talla", value: size }],
    price: { amount, currencyCode: "EUR" },
    quantityAvailable: null,
  }));
}

const EMPTY_DETAILS = { benefit: null, detail: null, usage: null, care: null, materials: null, fit: null };

type MockInput = Pick<Product, "id" | "handle" | "title" | "color" | "description" | "tags" | "productType" | "createdAt" | "images"> & {
  price: string;
  soldOut?: string[];
  category: Product["category"];
  completeTheLook?: string[];
};

function product({ price, soldOut, completeTheLook = [], ...rest }: MockInput): Product {
  const variants = sizeVariants(rest.id, price, soldOut);
  return {
    ...rest,
    availableForSale: variants.some((v) => v.availableForSale),
    featuredImage: rest.images[0] ?? null,
    video: null,
    priceRange: {
      minVariantPrice: { amount: price, currencyCode: "EUR" },
      maxVariantPrice: { amount: price, currencyCode: "EUR" },
    },
    options: [{ id: `${rest.id}-talla`, name: "Talla", values: SIZES }],
    variants,
    seo: { title: null, description: null },
    details: EMPTY_DETAILS,
    completeTheLook,
  };
}

export const mockCollections: Collection[] = [
  {
    id: "mock-collection-camisetas",
    handle: "camisetas",
    title: "Camisetas",
    description: "Oversize, en negro, blanco y gris. La estrella DJR en el pecho.",
    image: local("colecciones/camisetas.webp", "Chica con camiseta negra oversize DJR frente a una pared negra", 510, 680),
    seo: { title: null, description: null },
  },
  {
    id: "mock-collection-sudaderas",
    handle: "sudaderas",
    title: "Sudaderas",
    description: "Cuello redondo, mangas raglán y el monograma DJR en el pecho.",
    image: local("colecciones/sudaderas.webp", "Chico con sudadera negra de cuello redondo DJR frente a una pared de hormigón", 510, 680),
    seo: { title: null, description: null },
  },
  {
    id: "mock-collection-pantalones",
    handle: "pantalones",
    title: "Pantalones",
    description: "Felpa de pierna ancha, con el monograma en la cadera y la estrella en el bajo.",
    image: local("colecciones/pantalones.webp", "Pantalón negro DJR de pierna ancha con la estrella en el bajo y zapatillas blancas", 510, 680),
    seo: { title: null, description: null },
  },
];

const CAMISETAS = { handle: "camisetas", title: "Camisetas" };
const SUDADERAS = { handle: "sudaderas", title: "Sudaderas" };
const PANTALONES = { handle: "pantalones", title: "Pantalones" };

const camiseta = (color: string) => `Camiseta oversize de manga corta en ${color}, con la estrella DJR en el pecho.`;
const sudadera = (color: string) =>
  `Sudadera oversize de cuello redondo y mangas raglán en ${color}, con el monograma DJR en el pecho y la estrella en la manga.`;
const pantalon = (color: string) =>
  `Pantalón de felpa de pierna ancha en ${color}, con el monograma DJR en la cadera y la estrella en el bajo.`;

export const mockProducts: Product[] = [
  product({
    id: "mock-product-1",
    handle: "camiseta-negra",
    title: "Tee 001",
    color: "Negro",
    description: camiseta("negro"),
    tags: ["nuevo", "camisetas"],
    productType: "Camiseta",
    category: CAMISETAS,
    createdAt: "2026-10-20T09:00:00Z",
    price: "39.00",
    completeTheLook: ["pantalon-negro", "sudadera-gris"],
    images: [
      ficha("camiseta-negra", "Camiseta negra oversize DJR con la estrella blanca en el pecho"),
      local("productos/camiseta-negra/2.webp", "Chico con la camiseta negra DJR y pantalón negro frente a una pared negra", 600, 750),
      conjunto(1, "Pareja con camiseta negra DJR y pantalón negro a juego"),
    ],
  }),
  product({
    id: "mock-product-2",
    handle: "camiseta-blanca",
    title: "Tee 001",
    color: "Blanco",
    description: camiseta("blanco"),
    tags: ["nuevo", "camisetas"],
    productType: "Camiseta",
    category: CAMISETAS,
    createdAt: "2026-10-19T09:00:00Z",
    price: "39.00",
    completeTheLook: ["pantalon-negro", "sudadera-negra"],
    images: [
      ficha("camiseta-blanca", "Camiseta blanca oversize DJR con la estrella en el pecho"),
      conjunto(2, "Pareja con camisetas blancas DJR y pantalones negros de pierna ancha"),
    ],
  }),
  product({
    id: "mock-product-3",
    handle: "camiseta-gris",
    title: "Tee 001",
    color: "Gris",
    description: camiseta("gris"),
    tags: ["nuevo", "camisetas"],
    productType: "Camiseta",
    category: CAMISETAS,
    createdAt: "2026-10-18T09:00:00Z",
    price: "39.00",
    completeTheLook: ["pantalon-negro", "sudadera-negra"],
    images: [
      ficha("camiseta-gris", "Camiseta gris oversize DJR con la estrella blanca en el pecho"),
      conjunto(12, "Pareja con camisetas grises DJR y pantalones negros"),
    ],
  }),
  product({
    id: "mock-product-4",
    handle: "sudadera-negra",
    title: "Crewneck 001",
    color: "Negro",
    description: sudadera("negro"),
    tags: ["nuevo", "sudaderas"],
    productType: "Sudadera",
    category: SUDADERAS,
    createdAt: "2026-10-17T09:00:00Z",
    price: "79.00",
    completeTheLook: ["pantalon-negro", "camiseta-blanca"],
    images: [
      ficha("sudadera-negra", "Sudadera negra de cuello redondo DJR con el monograma en el pecho y la estrella en la manga"),
      local("productos/sudadera-negra/2.webp", "Chica con la sudadera negra DJR y pantalón negro frente a una pared de hormigón", 480, 600),
      local("productos/sudadera-negra/3.jpg", "Espalda de la sudadera negra DJR, lisa", 1200, 1500),
    ],
  }),
  product({
    id: "mock-product-5",
    handle: "sudadera-gris",
    title: "Crewneck 001",
    color: "Gris",
    description: sudadera("gris"),
    tags: ["nuevo", "sudaderas"],
    productType: "Sudadera",
    category: SUDADERAS,
    createdAt: "2026-10-16T09:00:00Z",
    price: "79.00",
    completeTheLook: ["pantalon-gris", "camiseta-gris"],
    images: [ficha("sudadera-gris", "Sudadera gris de cuello redondo DJR con el monograma en el pecho y la estrella en la manga")],
  }),
  product({
    id: "mock-product-6",
    handle: "sudadera-blanca",
    title: "Crewneck 001",
    color: "Blanco",
    description: sudadera("blanco"),
    tags: ["nuevo", "sudaderas"],
    productType: "Sudadera",
    category: SUDADERAS,
    createdAt: "2026-10-15T09:00:00Z",
    price: "79.00",
    completeTheLook: ["pantalon-blanco", "camiseta-negra"],
    images: [ficha("sudadera-blanca", "Sudadera blanca de cuello redondo DJR con el monograma en el pecho y la estrella en la manga")],
  }),
  product({
    id: "mock-product-7",
    handle: "pantalon-negro",
    title: "Sweatpants 001",
    color: "Negro",
    description: pantalon("negro"),
    tags: ["nuevo", "pantalones"],
    productType: "Pantalón",
    category: PANTALONES,
    createdAt: "2026-10-14T09:00:00Z",
    price: "69.00",
    completeTheLook: ["camiseta-blanca", "sudadera-negra"],
    images: [
      ficha("pantalon-negro", "Pantalón negro DJR de pierna ancha con el monograma en la cadera y la estrella en el bajo"),
      local("productos/pantalon-negro/2.webp", "Pantalón negro DJR de pierna ancha con la estrella en el bajo y zapatillas blancas", 480, 600),
      local("productos/pantalon-negro/3.jpg", "Espalda del pantalón negro DJR con bolsillo trasero", 1200, 1500),
      conjunto(14, "Pareja con pantalones negros DJR de pierna ancha"),
    ],
  }),
  product({
    id: "mock-product-8",
    handle: "pantalon-blanco",
    title: "Sweatpants 001",
    color: "Blanco",
    description: pantalon("blanco"),
    tags: ["nuevo", "pantalones"],
    productType: "Pantalón",
    category: PANTALONES,
    createdAt: "2026-10-13T09:00:00Z",
    price: "69.00",
    completeTheLook: ["camiseta-negra", "sudadera-negra"],
    images: [
      ficha("pantalon-blanco", "Pantalón blanco DJR de pierna ancha con el monograma en la cadera y la estrella en el bajo"),
      conjunto(5, "Pareja con pantalones blancos DJR de pierna ancha"),
    ],
  }),
  product({
    id: "mock-product-9",
    handle: "pantalon-gris",
    title: "Sweatpants 001",
    color: "Gris",
    description: pantalon("gris"),
    tags: ["nuevo", "pantalones"],
    productType: "Pantalón",
    category: PANTALONES,
    createdAt: "2026-10-12T09:00:00Z",
    price: "69.00",
    completeTheLook: ["camiseta-gris", "sudadera-gris"],
    images: [
      ficha("pantalon-gris", "Pantalón gris DJR de pierna ancha con el monograma en la cadera y la estrella en el bajo"),
      conjunto(3, "Chico con camiseta y pantalón grises DJR de pierna ancha"),
    ],
  }),
];

/** Relación colección → productos para el modo demo. */
export const mockCollectionProducts: Record<string, string[]> = {
  camisetas: ["camiseta-negra", "camiseta-blanca", "camiseta-gris"],
  sudaderas: ["sudadera-negra", "sudadera-gris", "sudadera-blanca"],
  pantalones: ["pantalon-negro", "pantalon-blanco", "pantalon-gris"],
};
