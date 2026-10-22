import { cn } from "@/lib/utils";

/** Proporción del archivo (751 × 950 px). */
const RATIO = 751 / 950;

/**
 * La doble estrella del logotipo DJR®, a partir del archivo original
 * (public/images/marca/estrella-djr.png, blanco sobre transparente).
 * Se usa como máscara: toma el color de `bg-*` (por defecto, la tinta clara de la web)
 * y escala con la fuente si se le da un alto en `em`.
 */
export function LogoStar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 bg-navy", className)}
      style={{
        aspectRatio: RATIO,
        maskImage: "url(/images/marca/estrella-djr.png)",
        WebkitMaskImage: "url(/images/marca/estrella-djr.png)",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
