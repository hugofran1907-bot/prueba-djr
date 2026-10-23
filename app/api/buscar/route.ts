import { getProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";

/** Sugerencias del buscador de la cabecera: hasta 4 productos con foto y precio. */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) return Response.json({ results: [] });

  try {
    const products = await getProducts({ query, sortKey: "RELEVANCE" });
    const results = products.slice(0, 4).map((p) => ({
      handle: p.handle,
      title: p.color ? `${p.title} · ${p.color}` : p.title,
      price: formatPrice(p.priceRange.minVariantPrice),
      image: p.featuredImage?.url ?? null,
    }));
    return Response.json({ results });
  } catch (error) {
    console.error("[api/buscar]", error);
    return Response.json({ results: [] }, { status: 500 });
  }
}
