import Link from "next/link";
import { siteConfig } from "@/config/site";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/components/layout/logo-mark";
import { cn } from "@/lib/utils";

/**
 * Logotipo DJR®. Si config/site.ts → siteConfig.logo está activo, se pinta el monograma
 * vectorial en línea (toma el color del texto, currentColor); si no, el «DJR®» en serif.
 * El monograma mide 0.9em de alto, así que las mismas clases de tamaño de texto
 * (text-[2rem], text-[26vw]…) sirven para las dos versiones.
 */
export function Logo({ className, asLink = true }: { className?: string; asLink?: boolean }) {
  const mark = siteConfig.logo ? (
    <span className={cn("inline-flex leading-none", className)}>
      <svg
        viewBox={LOGO_VIEWBOX}
        role={asLink ? undefined : "img"}
        aria-hidden={asLink ? true : undefined}
        aria-label={asLink ? undefined : "DJR"}
        className="logo-mark h-[0.9em] w-auto"
      >
        {/* pathLength=1 permite «dibujarlo» con stroke-dashoffset (firma del pie, globals.css). */}
        <path fill="currentColor" fillRule="evenodd" pathLength={1} d={LOGO_PATH} />
      </svg>
    </span>
  ) : (
    <span className={cn("font-serif leading-none tracking-[-0.02em]", className)}>
      DJR<sup className="ml-0.5 align-super font-sans text-[0.32em] tracking-normal">®</sup>
    </span>
  );

  if (!asLink) return mark;

  return (
    // min-h-11/min-w-11: zona de toque de 44 px aunque el monograma sea más pequeño.
    <Link href="/" aria-label="DJR, ir a la página de inicio" className="inline-flex min-h-11 min-w-11 items-center">


      {mark}
    </Link>
  );
}
