import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Estado sin resultados (colección vacía, búsqueda sin coincidencias…). */
export function EmptyState({
  title,
  text,
  action,
  className,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center border border-navy/15 px-6 py-16 text-center md:py-24",
        className,
      )}
    >
      <p className="font-serif text-3xl md:text-4xl">{title}</p>
      {text && <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">{text}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

/** Estado de error recuperable al cargar datos. */
export function ErrorState({
  title = "No hemos podido cargar los productos.",
  text = "Inténtalo de nuevo en unos minutos.",
  action,
  className,
}: {
  title?: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center border border-burgundy/40 bg-burgundy/5 px-6 py-16 text-center",
        className,
      )}
    >
      <p className="eyebrow text-burgundy">Error</p>
      <p className="mt-4 font-serif text-3xl">{title}</p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-stone">{text}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

/** Esqueleto de carga para rejillas de producto. */
export function ProductGridSkeleton({ count = 6, label = "Cargando productos" }: { count?: number; label?: string }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}…</span>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} aria-hidden="true" className="animate-pulse">
            <div className="aspect-[4/5] bg-cream-deep" />
            <div className="mt-4 h-3 w-2/3 bg-cream-deep" />
            <div className="mt-2 h-3 w-1/4 bg-cream-deep" />
          </div>
        ))}
      </div>
    </div>
  );
}
