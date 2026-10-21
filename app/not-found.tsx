import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[80svh] flex-col justify-center pt-32 pb-24">
      <p className="eyebrow text-burgundy">Error 404</p>
      <h1 className="mt-6 font-serif text-display">
        Fuera de ruta.
      </h1>
      <p className="mt-8 max-w-md text-stone">La página que buscas no existe o se ha movido.</p>
      <ButtonLink href="/" arrow className="mt-10 self-start">
        Volver al inicio
      </ButtonLink>
    </div>
  );
}
