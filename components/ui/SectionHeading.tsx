import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** Etiqueta opcional: solo cuando el titular no dice por sí solo qué es la sección. */
  eyebrow?: string;
  title: ReactNode;
  id?: string;
  action?: ReactNode;
  /** "center" para las secciones-escaparate (p. ej. colecciones), como el banner de DESIGN.md. */
  align?: "start" | "center";
  className?: string;
};

/** Encabezado editorial de sección: etiqueta opcional y titular serif. */
export function SectionHeading({ eyebrow, title, id, action, align = "start", className }: Props) {
  const centered = align === "center";

  return (
    <div
      data-reveal
      className={cn(
        "flex flex-col gap-6",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div>
        {eyebrow && <p className="eyebrow mb-5 text-stone">{eyebrow}</p>}
        <h2 id={id} className="font-serif text-headline text-balance">
          {title}
        </h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
