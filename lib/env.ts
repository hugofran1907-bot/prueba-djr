import "server-only";

/**
 * Lectura centralizada de variables de entorno del servidor.
 * El import "server-only" provoca un error de compilación si este módulo
 * llega a importarse desde un componente de cliente, de modo que el token
 * privado de Shopify nunca puede acabar en el bundle del navegador.
 */

/** Por defecto se usan datos de demostración salvo que se indique USE_MOCK_DATA=false. */
export const USE_MOCK_DATA = process.env.USE_MOCK_DATA !== "false";

export function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-07";

  const missing = [
    !domain || domain.includes("[REEMPLAZAR]") ? "SHOPIFY_STORE_DOMAIN" : null,
    !token || token.includes("[REEMPLAZAR]") ? "SHOPIFY_STOREFRONT_PRIVATE_TOKEN" : null,
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno de Shopify: ${missing.join(", ")}. ` +
        "Configúralas en .env.local o activa USE_MOCK_DATA=true.",
    );
  }

  const cleanDomain = domain!.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return {
    endpoint: `https://${cleanDomain}/api/${apiVersion}/graphql.json`,
    token: token!,
  };
}
