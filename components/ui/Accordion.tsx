import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = { id: string; title: string; content: ReactNode };

/**
 * Acordeón con <details>/<summary> nativos: accesible por teclado y
 * funcional sin JavaScript. `name` agrupa los items para que solo haya
 * uno abierto a la vez (navegadores compatibles).
 */
export function Accordion({
  items,
  name,
  size = "base",
  className,
}: {
  items: AccordionItem[];
  name?: string;
  size?: "base" | "large";
  className?: string;
}) {
  return (
    <div className={cn("border-t border-navy/15", className)}>
      {items.map((item) => (
        <details key={item.id} name={name} data-anim className="group border-b border-navy/15">
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden",
              size === "large" ? "font-serif text-2xl md:text-3xl" : "eyebrow text-navy",
            )}
          >
            <span>{item.title}</span>
            <span
              aria-hidden="true"
              className="relative size-3 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
            />
          </summary>
          <div className="pb-6 text-sm leading-relaxed text-navy/85 md:text-base">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
