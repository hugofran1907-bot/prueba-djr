"use server";

import { CHECKOUT_ENABLED, emailProvider } from "@/config/store";
import { createCheckoutUrl, type CheckoutLine } from "@/lib/shopify";

/* ───────────────────────── Formularios de email ───────────────────────── */

export type FormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "not-configured" }
  | { status: "success" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(formData: FormData): FormState | null {
  const email = String(formData.get("email") ?? "").trim();
  if (!EMAIL_RE.test(email)) return { status: "error", message: "Introduce un correo electrónico válido." };
  if (formData.get("consent") !== "on") {
    return { status: "error", message: "Acepta la política de privacidad para continuar." };
  }
  return null;
}

/**
 * Alta en la newsletter.
 * [REEMPLAZAR] Conecta aquí el proveedor real (Shopify customerCreate con
 * acceptsMarketing, Klaviyo, Mailchimp…) y devuelve { status: "success" }
 * solo cuando el alta se haya confirmado.
 */
export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const invalid = validate(formData);
  if (invalid) return invalid;
  if (!emailProvider) return { status: "not-configured" };
  return { status: "error", message: "El proveedor de email configurado aún no está implementado." };
}

/**
 * «Avísame cuando salga».
 * [REEMPLAZAR] Conecta aquí el proveedor real (p. ej. lista de Klaviyo por
 * producto/talla). Recibe también los campos product y size.
 */
export async function notifyWhenAvailable(_prev: FormState, formData: FormData): Promise<FormState> {
  const invalid = validate(formData);
  if (invalid) return invalid;
  if (!emailProvider) return { status: "not-configured" };
  return { status: "error", message: "El proveedor de email configurado aún no está implementado." };
}

/* ───────────────────────── Checkout ───────────────────────── */

export type CheckoutResult = { ok: true; url: string } | { ok: false; message: string };

/** Crea el carrito en Shopify y devuelve la URL de pago. El cliente redirige. */
export async function startCheckout(lines: CheckoutLine[]): Promise<CheckoutResult> {
  if (!CHECKOUT_ENABLED) {
    return { ok: false, message: "La compra online todavía no está activa." };
  }
  const clean = lines
    .filter((l) => typeof l.merchandiseId === "string" && Number.isInteger(l.quantity) && l.quantity > 0)
    .map((l) => ({ merchandiseId: l.merchandiseId, quantity: Math.min(l.quantity, 20) }));
  if (clean.length === 0) return { ok: false, message: "Tu carrito está vacío." };

  try {
    return { ok: true, url: await createCheckoutUrl(clean) };
  } catch (error) {
    console.error("[startCheckout]", error);
    return { ok: false, message: error instanceof Error ? error.message : "No se pudo iniciar el pago." };
  }
}
