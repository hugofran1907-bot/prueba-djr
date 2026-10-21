"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { CHECKOUT_ENABLED } from "@/config/store";
import { startCheckout } from "@/lib/actions";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/components/cart/CartContext";
import { Button, ButtonLink } from "@/components/ui/Button";

function QuantityStepper({ title, quantity, onChange }: { title: string; quantity: number; onChange: (q: number) => void }) {
  const btn = "inline-flex size-9 items-center justify-center text-lg transition-[background-color,color,border-color,transform] duration-150 hover:bg-navy hover:text-cream active:scale-[0.94]";
  return (
    <div className="inline-flex items-center border border-navy/25" role="group" aria-label={`Cantidad de ${title}`}>
      <button type="button" className={btn} onClick={() => onChange(quantity - 1)} aria-label={`Quitar una unidad de ${title}`}>
        −
      </button>
      <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button type="button" className={btn} onClick={() => onChange(quantity + 1)} aria-label={`Añadir una unidad de ${title}`}>
        +
      </button>
    </div>
  );
}

/** Botón «Finalizar compra», condicionado por CHECKOUT_ENABLED. */
export function CheckoutButton({ className }: { className?: string }) {
  const { lines } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!CHECKOUT_ENABLED) {
    return (
      <div className={className}>
        <Button disabled className="w-full" aria-describedby="checkout-note">
          Finalizar compra
        </Button>
        <p id="checkout-note" className="mt-3 text-xs text-stone">
          El pago online se activará muy pronto. Tu carrito queda guardado en este dispositivo.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Button
        className="w-full"
        disabled={pending || lines.length === 0}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await startCheckout(lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })));
            if (result.ok) window.location.assign(result.url);
            else setError(result.message);
          })
        }
      >
        {pending ? "Redirigiendo…" : "Finalizar compra"}
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-xs text-burgundy">
          {error}
        </p>
      )}
    </div>
  );
}

/** Líneas, cantidades y subtotal. Se usa en el carrito lateral y en /carrito. */
export function CartContents({ onNavigate, variant = "drawer" }: { onNavigate?: () => void; variant?: "drawer" | "page" }) {
  const { lines, subtotal, updateQuantity, removeLine } = useCart();

  if (lines.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="font-serif text-3xl">Tu carrito está vacío.</p>
        <p className="mt-3 text-sm text-stone">Descubre la Colección 01.</p>
        <ButtonLink href="/colecciones/todo" arrow className="mt-8" onClick={onNavigate}>
          Ver la colección
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-1 flex-col", variant === "drawer" && "min-h-0")}>
      <ul className={cn("divide-y divide-navy/10", variant === "drawer" && "flex-1 overflow-y-auto px-5 md:px-8")}>
        {lines.map((line) => (
          <li key={line.variantId} className="flex gap-4 py-5">
            <Link
              href={`/productos/${line.handle}`}
              onClick={onNavigate}
              className="relative aspect-[4/5] w-20 shrink-0 bg-cream-deep md:w-24"
              tabIndex={-1}
              aria-hidden="true"
            >
              {line.image && <Image src={line.image.url} alt="" fill sizes="96px" className="object-cover" />}
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-3">
                <div>
                  <Link href={`/productos/${line.handle}`} onClick={onNavigate} className="text-sm font-medium hover:underline">
                    {line.title}
                  </Link>
                  <p className="mt-1 text-xs text-stone">{line.variantTitle}</p>
                </div>
                <p className="text-sm tabular-nums">
                  {formatPrice({ amount: (Number(line.price.amount) * line.quantity).toFixed(2), currencyCode: line.price.currencyCode })}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <QuantityStepper
                  title={line.title}
                  quantity={line.quantity}
                  onChange={(q) => updateQuantity(line.variantId, q)}
                />
                <button
                  type="button"
                  onClick={() => removeLine(line.variantId)}
                  className="text-xs text-stone underline underline-offset-2 hover:text-burgundy"
                  aria-label={`Eliminar ${line.title}, ${line.variantTitle}, del carrito`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className={cn("border-t border-navy/15 py-6", variant === "drawer" && "px-5 md:px-8")}>
        <div className="flex items-baseline justify-between">
          <span className="eyebrow text-stone">Subtotal</span>
          <span className="text-lg tabular-nums">{subtotal && formatPrice(subtotal)}</span>
        </div>
        <CheckoutButton className="mt-5" />
      </div>
    </div>
  );
}
