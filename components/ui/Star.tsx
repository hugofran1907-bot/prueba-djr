import type { ComponentProps } from "react";

/** Estrella de cuatro puntas de DJR® (la de las prendas), con lados cóncavos. */
export const STAR_PATH = "M12 0C12.6 7 13.5 10.5 24 12C13.5 13.5 12.6 17 12 24C11.4 17 10.5 13.5 0 12C10.5 10.5 11.4 7 12 0Z";

export function Star(props: ComponentProps<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d={STAR_PATH} />
    </svg>
  );
}
