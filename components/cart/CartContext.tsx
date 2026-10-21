"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import type { Image, Money } from "@/lib/types";

/**
 * Carrito local (navegador). Persiste en localStorage y se sincroniza entre
 * pestañas. Al finalizar la compra, las líneas se envían a Shopify
 * (lib/actions.ts → startCheckout) que devuelve la URL de pago.
 */

export type CartLine = {
  /** id de variante (en Shopify, el gid de ProductVariant = merchandiseId). */
  variantId: string;
  handle: string;
  title: string;
  /** Opciones elegidas legibles, p. ej. «Talla M». */
  variantTitle: string;
  price: Money;
  image: Image | null;
  quantity: number;
};

const STORAGE_KEY = "djr-cart-v1";
const MAX_QTY = 20;
const EMPTY: CartLine[] = [];

/* ───────────── Almacén externo (fuera de React) ───────────── */

let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function isLine(x: unknown): x is CartLine {
  const l = x as CartLine;
  return !!l && typeof l.variantId === "string" && typeof l.quantity === "number" && !!l.price?.amount;
}

function read(): CartLine[] {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed.filter(isLine) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: CartLine[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Almacenamiento no disponible (modo privado, bloqueado…): el carrito sigue en memoria.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/* ───────────── Contexto ───────────── */

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: Money | null;
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);
  const [isOpen, setIsOpen] = useState(false);

  const addLine = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    const current = read();
    const existing = current.find((l) => l.variantId === line.variantId);
    write(
      existing
        ? current.map((l) =>
            l.variantId === line.variantId ? { ...l, quantity: Math.min(l.quantity + quantity, MAX_QTY) } : l,
          )
        : [...current, { ...line, quantity: Math.min(quantity, MAX_QTY) }],
    );
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    const current = read();
    write(
      quantity <= 0
        ? current.filter((l) => l.variantId !== variantId)
        : current.map((l) => (l.variantId === variantId ? { ...l, quantity: Math.min(quantity, MAX_QTY) } : l)),
    );
  }, []);

  const removeLine = useCallback((variantId: string) => {
    write(read().filter((l) => l.variantId !== variantId));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.length
      ? {
          amount: lines.reduce((sum, l) => sum + Number(l.price.amount) * l.quantity, 0).toFixed(2),
          currencyCode: lines[0].price.currencyCode,
        }
      : null;
    return {
      lines,
      count,
      subtotal,
      addLine,
      updateQuantity,
      removeLine,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [lines, isOpen, addLine, updateQuantity, removeLine]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>.");
  return ctx;
}
