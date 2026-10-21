"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart/CartContext";
import { CartContents } from "@/components/cart/CartContents";

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  );
}

/** Carrito lateral. Usa <dialog> nativo: trampa de foco y Escape incluidos. */
export function CartDrawer() {
  const { isOpen, closeCart, count } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Cierra al navegar.
  useEffect(() => {
    closeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <dialog
      data-anim="drawer"
      ref={ref}
      aria-labelledby="cart-drawer-title"
      onClose={closeCart}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-cream text-navy backdrop:bg-night/70 backdrop:backdrop-blur-sm open:flex open:flex-col"
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-navy/10 px-5 md:h-20 md:px-8">
        <h2 id="cart-drawer-title" className="font-serif text-3xl">
          Carrito <span className="font-sans text-sm text-stone tabular-nums">({count})</span>
        </h2>
        <button
          type="button"
          onClick={closeCart}
          className="-mr-3 inline-flex size-11 items-center justify-center hover:opacity-60"
          aria-label="Cerrar carrito"
        >
          <CloseIcon />
        </button>
      </div>
      <CartContents onNavigate={closeCart} />
    </dialog>
  );
}
