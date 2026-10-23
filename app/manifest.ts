import type { MetadataRoute } from "next";

/** Al guardar la web en la pantalla de inicio del móvil: nombre, colores e icono de DJR®. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DJR® · Streetwear",
    short_name: "DJR®",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
