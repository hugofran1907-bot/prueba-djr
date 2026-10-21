import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo en desarrollo: permite abrir `npm run dev` desde el móvil en la misma wifi.
  // Si cambia la IP del ordenador, actualízala aquí.
  allowedDevOrigins: ["192.168.1.39"],
  images: {
    // Una sola calidad permitida: todas las imágenes se sirven a 90 (el valor por
    // defecto, 75, se ajusta a la entrada más cercana de la lista). Next.js 16 exige la lista.
    qualities: [90],
    // AVIF primero (más nítido al mismo peso) y WebP como alternativa.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Imágenes de Shopify (productos y colecciones reales).
      { protocol: "https", hostname: "cdn.shopify.com" },
      // Fotografía provisional de demostración. [REEMPLAZAR] por fotografía propia.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
