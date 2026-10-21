/**
 * Tipos de dominio de la tienda.
 *
 * Son independientes de la forma de la respuesta de Shopify (edges/nodes):
 * lib/shopify.ts transforma la respuesta GraphQL a estos tipos, de modo que
 * los componentes no dependen nunca del proveedor de datos.
 */

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Video = {
  url: string;
  mimeType: string;
  poster: Image | null;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
  /** Color hexadecimal por valor (solo opciones de color con swatch en Shopify). */
  swatches?: Record<string, string>;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  /**
   * Unidades disponibles. null = dato no disponible (no se muestra escasez).
   * En Shopify requiere el permiso unauthenticated_read_product_inventory.
   */
  quantityAvailable: number | null;
  image?: Image | null;
};

/**
 * Descripción estructurada. Se renderiza en este orden:
 * beneficio → detalle → uso → cuidados. En Shopify: metacampos custom.*.
 * null = dato pendiente (la UI muestra el marcador de config/store.ts).
 */
export type ProductDetails = {
  benefit: string | null;
  detail: string | null;
  usage: string | null;
  care: string | null;
  materials: string | null;
  fit: string | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  /** Etiquetas de Shopify. Se usan, por ejemplo, para marcar "nuevo". */
  tags: string[];
  /** Tipo de producto en Shopify (Camiseta, Sudadera, Pantalón…). */
  productType: string;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  featuredImage: Image | null;
  images: Image[];
  /** Vídeo corto opcional (mp4 en bucle). */
  video: Video | null;
  options: ProductOption[];
  variants: ProductVariant[];
  seo: { title: string | null; description: string | null };
  createdAt: string;
  /** Colección principal, para la ruta de navegación y «También te puede gustar». */
  category: { handle: string; title: string } | null;
  details: ProductDetails;
  /** Handles de productos para «Completa el look» (configurables por producto). */
  completeTheLook: string[];
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image | null;
  seo: { title: string | null; description: string | null };
};

/** Claves de ordenación compatibles con ProductSortKeys / ProductCollectionSortKeys. */
export type ProductSortKey = "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE" | "TITLE";

export type GetProductsOptions = {
  /** Texto libre de búsqueda (sintaxis de búsqueda de Shopify en modo real). */
  query?: string;
  sortKey?: ProductSortKey;
  reverse?: boolean;
  first?: number;
};
