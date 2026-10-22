import type { Money } from "@/lib/types";

/** Une clases condicionales sin dependencias externas. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice({ amount, currencyCode }: Money, locale = "es-ES") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: Number(amount) % 1 === 0 ? 0 : 2,
  }).format(Number(amount));
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Nombre de View Transition compartido por la foto de la tarjeta y la de la ficha de producto. */
export const productMorphName = (handle: string) => `product-${handle.replace(/[^a-z0-9-]/gi, "")}`;
