import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Logotipo DJR®. Si config/site.ts → siteConfig.logo tiene un archivo, se muestra
 * la imagen; si no, el «DJR®» en serif. La imagen mide 1em de alto, así que las
 * mismas clases de tamaño de texto (text-[2rem], text-[26vw]…) sirven para las dos.
 */
export function Logo({ className, asLink = true }: { className?: string; asLink?: boolean }) {
  const { logo } = siteConfig;

  const mark = logo ? (
    <span className={cn("inline-flex leading-none", className)}>
      <Image
        src={logo.src}
        alt={asLink ? "" : "DJR"}
        width={logo.width}
        height={logo.height}
        // SVG: se sirve tal cual (sin pasar por el optimizador de imágenes).
        unoptimized
        priority={asLink}
        className="h-[0.9em] w-auto"
      />
    </span>
  ) : (
    <span className={cn("font-serif leading-none tracking-[-0.02em]", className)}>
      DJR<sup className="ml-0.5 align-super font-sans text-[0.32em] tracking-normal">®</sup>
    </span>
  );

  if (!asLink) return mark;

  return (
    <Link href="/" aria-label="DJR, ir a la página de inicio" className="inline-flex">
      {mark}
    </Link>
  );
}
