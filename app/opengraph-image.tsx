import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { season } from "@/config/store";

export const alt = "DJR® · Streetwear minimalista";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagen que aparece al compartir el enlace (WhatsApp, Instagram, X…): tema oscuro,
 * foto de portada a la izquierda y la marca a la derecha. La foto se lee del disco
 * (public/images/portada/portada-og.jpg); cámbiala por otra con el mismo nombre si quieres.
 */
export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public/images/portada/portada-og.jpg"), "base64");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0a", color: "#f5f5f5" }}>
        {/* ImageResponse solo admite <img> (next/image no funciona aquí). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${photo}`}
          alt=""
          width={560}
          height={630}
          style={{ width: 560, height: 630, objectFit: "cover", objectPosition: "50% 20%" }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 64px 56px",
            background: "#141414",
          }}
        >
          <div style={{ display: "flex", fontSize: 18, letterSpacing: 3, textTransform: "uppercase", color: "#a3a3a3" }}>
            {`DROP 001 · ${season}`}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "flex-start", fontSize: 200, lineHeight: 0.9, letterSpacing: -6 }}>
              DJR
              <span style={{ fontSize: 48, marginTop: 18, marginLeft: 6 }}>®</span>
            </div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 34, color: "#d4d4d4" }}>Streetwear minimalista</div>
          </div>
          <div style={{ display: "flex", height: 2, width: "100%", background: "#f5f5f5", opacity: 0.25 }} />
        </div>
      </div>
    ),
    size,
  );
}
