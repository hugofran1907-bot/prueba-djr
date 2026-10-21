import type { Metadata } from "next";
import { CartContents } from "@/components/cart/CartContents";

export const metadata: Metadata = {
  title: "Carrito",
  robots: { index: false },
};

/** Carrito a página completa. Comparte lógica con el carrito lateral. */
export default function CartPage() {
  return (
    <div className="container-editorial pt-36 pb-24 md:pt-44">
      <p className="eyebrow text-burgundy">Carrito</p>
      <h1 className="mt-4 font-serif text-headline">Tu carrito</h1>
      <div className="mt-12 flex max-w-3xl flex-col">
        <CartContents variant="page" />
      </div>
    </div>
  );
}
