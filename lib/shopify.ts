import "server-only";

import { heroContent } from "@/config/site";
import { USE_MOCK_DATA, getShopifyConfig } from "@/lib/env";
import { mockCollectionProducts, mockCollections, mockProducts } from "@/lib/mock-data";
import {
  createCartMutation,
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
  getProductQuery,
  getProductsQuery,
} from "@/lib/queries";
import type { Collection, GetProductsOptions, Image, Product, ProductSortKey } from "@/lib/types";

/**
 * CAPA DE ACCESO A DATOS
 * ──────────────────────
 * Único punto de entrada a los datos de la tienda. Los componentes importan
 * estas funciones y no saben si los datos vienen de los mocks o de Shopify.
 *
 *   USE_MOCK_DATA=true  → lib/mock-data.ts
 *   USE_MOCK_DATA=false → Shopify Storefront API (GraphQL), solo en servidor
 *
 * Carrito: se gestiona en el navegador (components/cart). Al finalizar la
 * compra, createCheckoutUrl() crea el carrito en Shopify con cartCreate y
 * devuelve cart.checkoutUrl. En modo demo no hay checkout.
 *
 * Pendiente: filtros (collection.products(filters: [...])).
 */

const REVALIDATE_SECONDS = 60 * 60;

/**
 * Colección virtual con todos los productos (/colecciones/todo).
 * No existe en Shopify: se resuelve aquí con la consulta de productos.
 */
export const ALL_PRODUCTS_HANDLE = "todo";

const allProductsCollection: Collection = {
  id: "virtual-todo",
  handle: ALL_PRODUCTS_HANDLE,
  title: "DROP 001",
  description: "Todas las piezas del drop.",
  image: {
    url: heroContent.image.url,
    altText: heroContent.image.alt,
    width: 2400,
    height: 1600,
  },
  seo: { title: "Toda la colección", description: "Camisetas, sudaderas y pantalones del DROP 001 de DJR®." },
};

/* ───────────────────────── Cliente Storefront ───────────────────────── */

type ShopifyResponse<T> = { data?: T; errors?: { message: string }[] };

async function shopifyFetch<T>({
  query,
  variables,
  tags,
  cache,
}: {
  query: string;
  variables?: Record<string, unknown>;
  tags?: string[];
  /** "no-store" para mutaciones. */
  cache?: "no-store";
}): Promise<T> {
  const { endpoint, token } = getShopifyConfig();

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    ...(cache ? { cache } : { next: { revalidate: REVALIDATE_SECONDS, tags } }),
  });

  if (!res.ok) {
    throw new Error(`Shopify respondió con ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as ShopifyResponse<T>;
  if (json.errors?.length) {
    throw new Error(`Error de Shopify: ${json.errors.map((e) => e.message).join(" · ")}`);
  }
  if (!json.data) {
    throw new Error("Shopify devolvió una respuesta vacía.");
  }
  return json.data;
}

/* ───────────────────── Normalización (Shopify → dominio) ───────────────────── */

type Connection<T> = { edges: { node: T }[] };
const flatten = <T>(connection: Connection<T>): T[] => connection.edges.map((e) => e.node);

type ShopifyImage = Omit<Image, "altText"> & { altText: string | null };

type ShopifyProduct = Omit<
  Product,
  "images" | "variants" | "options" | "featuredImage" | "video" | "category" | "details" | "completeTheLook"
> & {
  featuredImage: ShopifyImage | null;
  images: Connection<ShopifyImage>;
  media: {
    nodes: {
      mediaContentType: string;
      sources?: { url: string; mimeType: string }[];
      previewImage?: ShopifyImage | null;
    }[];
  };
  variants: Connection<Omit<Product["variants"][number], "image"> & { image: ShopifyImage | null }>;
  options: { id: string; name: string; optionValues: { name: string; swatch: { color: string | null } | null }[] }[];
  collections: { nodes: { handle: string; title: string }[] };
  details: ({ key: string; value: string } | null)[];
  completeTheLook: { references: { nodes: { handle?: string }[] } | null } | null;
};

const DETAIL_KEYS = {
  beneficio: "benefit",
  detalle: "detail",
  uso: "usage",
  cuidados: "care",
  materiales: "materials",
  fit: "fit",
} as const;

type ShopifyCollection = Omit<Collection, "image"> & { image: ShopifyImage | null };

function reshapeImage(image: ShopifyImage | null, fallbackAlt: string): Image | null {
  if (!image) return null;
  return { ...image, altText: image.altText || fallbackAlt };
}

function reshapeProduct(p: ShopifyProduct): Product {
  const { media, collections, details: rawDetails, completeTheLook, ...rest } = p;

  const videoNode = media.nodes.find((m) => m.mediaContentType === "VIDEO" && m.sources?.length);
  const mp4 = videoNode?.sources?.find((s) => s.mimeType === "video/mp4") ?? videoNode?.sources?.[0];

  const details: Product["details"] = { benefit: null, detail: null, usage: null, care: null, materials: null, fit: null };
  for (const field of rawDetails) {
    if (!field) continue;
    const key = DETAIL_KEYS[field.key as keyof typeof DETAIL_KEYS];
    if (key) details[key] = field.value;
  }

  return {
    ...rest,
    featuredImage: reshapeImage(p.featuredImage, p.title),
    images: flatten(p.images).map((img) => reshapeImage(img, p.title)!),
    video: mp4
      ? { url: mp4.url, mimeType: mp4.mimeType, poster: reshapeImage(videoNode?.previewImage ?? null, p.title) }
      : null,
    variants: flatten(p.variants).map((v) => ({ ...v, image: reshapeImage(v.image, p.title) })),
    options: p.options.map((o) => {
      const swatches = Object.fromEntries(
        o.optionValues.filter((v) => v.swatch?.color).map((v) => [v.name, v.swatch!.color!]),
      );
      return {
        id: o.id,
        name: o.name,
        values: o.optionValues.map((v) => v.name),
        ...(Object.keys(swatches).length ? { swatches } : {}),
      };
    }),
    category: collections.nodes[0] ?? null,
    details,
    completeTheLook: (completeTheLook?.references?.nodes ?? []).flatMap((n) => (n.handle ? [n.handle] : [])),
  };
}

function reshapeCollection(c: ShopifyCollection): Collection {
  return { ...c, image: reshapeImage(c.image, c.title) };
}

/* ───────────────────────────── Utilidades mock ───────────────────────────── */

function sortMock(products: Product[], sortKey: ProductSortKey = "RELEVANCE", reverse = false) {
  const sorted = [...products];
  switch (sortKey) {
    case "CREATED_AT":
      sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      break;
    case "PRICE":
      sorted.sort(
        (a, b) =>
          Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount),
      );
      break;
    case "TITLE":
      sorted.sort((a, b) => a.title.localeCompare(b.title, "es"));
      break;
  }
  return reverse ? sorted.reverse() : sorted;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/* ─────────────────────────────── API pública ─────────────────────────────── */

export async function getProducts({
  query,
  sortKey = "RELEVANCE",
  reverse = false,
  first = 24,
}: GetProductsOptions = {}): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    const q = query ? normalize(query.trim()) : "";
    const filtered = q
      ? mockProducts.filter((p) =>
          normalize([p.title, p.productType, p.description, ...p.tags].join(" ")).includes(q),
        )
      : mockProducts;
    return sortMock(filtered, sortKey, reverse).slice(0, first);
  }

  const data = await shopifyFetch<{ products: Connection<ShopifyProduct> }>({
    query: getProductsQuery,
    variables: { query, sortKey, reverse, first },
    tags: ["products"],
  });
  return flatten(data.products).map(reshapeProduct);
}

/** Últimos productos añadidos. */
export async function getNewArrivals(first = 6): Promise<Product[]> {
  return getProducts({ sortKey: "CREATED_AT", reverse: true, first });
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (USE_MOCK_DATA) {
    return mockProducts.find((p) => p.handle === handle) ?? null;
  }

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: getProductQuery,
    variables: { handle },
    tags: ["products"],
  });
  return data.product ? reshapeProduct(data.product) : null;
}

export async function getCollections(first = 20): Promise<Collection[]> {
  if (USE_MOCK_DATA) return mockCollections.slice(0, first);

  const data = await shopifyFetch<{ collections: Connection<ShopifyCollection> }>({
    query: getCollectionsQuery,
    variables: { first },
    tags: ["collections"],
  });
  return flatten(data.collections).map(reshapeCollection);
}

export async function getCollection(handle: string): Promise<Collection | null> {
  if (handle === ALL_PRODUCTS_HANDLE) return allProductsCollection;
  if (USE_MOCK_DATA) {
    return mockCollections.find((c) => c.handle === handle) ?? null;
  }

  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>({
    query: getCollectionQuery,
    variables: { handle },
    tags: ["collections"],
  });
  return data.collection ? reshapeCollection(data.collection) : null;
}

/** Varias colecciones por handle, respetando el orden recibido. Omite las que no existan. */
export async function getCollectionsByHandle(handles: string[]): Promise<Collection[]> {
  const results = await Promise.all(handles.map(getCollection));
  return results.filter((c): c is Collection => c !== null);
}

export async function getCollectionProducts({
  handle,
  sortKey = "RELEVANCE",
  reverse = false,
  first = 48,
}: {
  handle: string;
  sortKey?: Exclude<ProductSortKey, "RELEVANCE"> | "COLLECTION_DEFAULT" | "RELEVANCE";
  reverse?: boolean;
  first?: number;
}): Promise<Product[]> {
  if (handle === ALL_PRODUCTS_HANDLE) {
    return getProducts({ sortKey: "CREATED_AT", reverse: true, first });
  }
  if (USE_MOCK_DATA) {
    const handles = mockCollectionProducts[handle] ?? [];
    const products = mockProducts.filter((p) => handles.includes(p.handle));
    const mockSort = sortKey === "COLLECTION_DEFAULT" ? "RELEVANCE" : sortKey;
    return sortMock(products, mockSort, reverse).slice(0, first);
  }

  const data = await shopifyFetch<{
    collection: { products: Connection<ShopifyProduct> } | null;
  }>({
    query: getCollectionProductsQuery,
    variables: {
      handle,
      first,
      reverse,
      sortKey: sortKey === "RELEVANCE" ? "COLLECTION_DEFAULT" : sortKey,
    },
    tags: ["collections", "products"],
  });
  return data.collection ? flatten(data.collection.products).map(reshapeProduct) : [];
}

/** Productos por handle, en el orden recibido. Omite los que no existan. */
export async function getProductsByHandles(handles: string[]): Promise<Product[]> {
  const results = await Promise.all(handles.map(getProduct));
  return results.filter((p): p is Product => p !== null);
}

/**
 * Los otros colores de la misma prenda: productos con el mismo nombre (Tee 001…) y color.
 * Incluye el propio producto. Con un solo color devuelve una lista vacía.
 */
export async function getColorSiblings(product: Product): Promise<Product[]> {
  if (!product.color) return [];
  const candidates = await getProducts({ query: USE_MOCK_DATA ? product.title : `title:"${product.title}"`, first: 20 });
  const siblings = candidates.filter((p) => p.title === product.title && p.color);
  if (!siblings.some((p) => p.handle === product.handle)) siblings.unshift(product);
  return siblings.length > 1 ? siblings : [];
}

/** «Completa el look»: productos configurados en el propio producto. */
export async function getCompleteTheLook(product: Product): Promise<Product[]> {
  const handles = product.completeTheLook.filter((h) => h !== product.handle);
  return handles.length ? getProductsByHandles(handles) : [];
}

/** «También te puede gustar»: misma categoría, sin el producto actual ni los ya mostrados. */
export async function getRelatedProducts(product: Product, exclude: string[] = [], first = 4): Promise<Product[]> {
  if (!product.category) return [];
  const products = await getCollectionProducts({ handle: product.category.handle, first: first + exclude.length + 1 });
  return products.filter((p) => p.handle !== product.handle && !exclude.includes(p.handle)).slice(0, first);
}

export type CheckoutLine = { merchandiseId: string; quantity: number };

/**
 * Crea un carrito en Shopify y devuelve la URL de checkout.
 * En modo demo lanza un error: no existe un checkout real que abrir.
 */
export async function createCheckoutUrl(lines: CheckoutLine[]): Promise<string> {
  if (USE_MOCK_DATA) {
    throw new Error("El checkout no está disponible con datos de demostración.");
  }
  const data = await shopifyFetch<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>({ query: createCartMutation, variables: { lines }, cache: "no-store" });

  const { cart, userErrors } = data.cartCreate;
  if (userErrors.length || !cart) {
    throw new Error(userErrors.map((e) => e.message).join(" · ") || "No se pudo crear el carrito.");
  }
  return cart.checkoutUrl;
}

/** Indica a la UI si se están mostrando datos de demostración. */
export function isUsingMockData() {
  return USE_MOCK_DATA;
}
