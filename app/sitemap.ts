import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/shopify";
import { legalPages } from "@/lib/legal";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/colecciones/todo`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/novedades`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/marca`, priority: 0.5 },
    { url: `${siteUrl}/faq`, priority: 0.4 },
    ...Object.keys(legalPages).map((slug) => ({ url: `${siteUrl}/legal/${slug}`, priority: 0.2 })),
  ];

  try {
    const [collections, products] = await Promise.all([getCollections(), getProducts({ first: 250 })]);
    return [
      ...staticRoutes,
      ...collections.filter((c) => c.handle !== "todo").map((c) => ({ url: `${siteUrl}/colecciones/${c.handle}`, priority: 0.8 })),
      ...products.map((p) => ({ url: `${siteUrl}/productos/${p.handle}`, priority: 0.6 })),
    ];
  } catch (error) {
    console.error("[sitemap]", error);
    return staticRoutes;
  }
}
