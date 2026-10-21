"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/States";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-editorial pt-36 pb-24 md:pt-44">
      <ErrorState
        title="Algo no ha ido bien."
        text="Ha ocurrido un error al cargar esta página. Puedes intentarlo de nuevo o volver al inicio."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={reset}>Reintentar</Button>
            <ButtonLink href="/" variant="outline">
              Volver al inicio
            </ButtonLink>
          </div>
        }
      />
    </div>
  );
}
