"use client";

import { useState, useSyncExternalStore } from "react";
import { announcements } from "@/config/store";

const STORAGE_KEY = "djr-announcement-closed";
/** Copias de la secuencia en la marquesina, para cubrir pantallas anchas. */
const MARQUEE_COPIES = 4;

function readClosed() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

const noopSubscribe = () => () => {};
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(reducedMotionQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Barra de anuncios en marquesina sobre la cabecera. Textos en config/store.ts.
 * Con prefers-reduced-motion muestra un aviso cada vez, con avance manual.
 */
export function AnnouncementBar() {
  const storedClosed = useSyncExternalStore(noopSubscribe, readClosed, () => false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
  const [closedNow, setClosedNow] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const count = announcements.length;
  const marquee = count > 0 && !reducedMotion;

  if (count === 0 || storedClosed || closedNow) return null;

  const close = () => {
    setClosedNow(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Sin almacenamiento: se cierra solo durante esta visita.
    }
  };

  const iconBtn = "inline-flex size-9 shrink-0 items-center justify-center text-navy/70 transition-colors hover:text-navy";

  return (
    <div
      className="bg-night text-navy"
      role="region"
      aria-label="Avisos de la tienda"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="container-editorial flex h-9 items-center gap-2">
        {marquee ? (
          <button
            type="button"
            className={iconBtn}
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Reanudar avisos" : "Pausar avisos"}
          >
            {paused ? (
              <svg aria-hidden="true" viewBox="0 0 12 12" className="size-2.5" fill="currentColor">
                <path d="M2 1l9 5-9 5z" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 12 12" className="size-2.5" fill="currentColor">
                <path d="M2 1h3v10H2zM7 1h3v10H7z" />
              </svg>
            )}
          </button>
        ) : count > 1 ? (
          // Movimiento reducido: sin rotación automática, avance manual.
          <button
            type="button"
            className={iconBtn}
            onClick={() => setIndex((i) => (i + 1) % count)}
            aria-label="Siguiente aviso"
          >
            <svg aria-hidden="true" viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 1l5 5-5 5" />
            </svg>
          </button>
        ) : (
          <span className="size-9 shrink-0" aria-hidden="true" />
        )}

        {marquee ? (
          // Marquesina continua (DESIGN.md · Announcement Marquee Bar). Los lectores de
          // pantalla leen la primera copia; el resto lleva aria-hidden.
          <div className="relative h-full flex-1 overflow-hidden">
            <div
              className="flex h-full w-max animate-marquee items-center"
              style={{ animationPlayState: paused || hovered ? "paused" : "running" }}
            >
              {Array.from({ length: MARQUEE_COPIES }).map((_, copy) => (
                <ul key={copy} aria-hidden={copy === 0 ? undefined : true} className="flex shrink-0">
                  {announcements.map((text) => (
                    <li key={text} className="px-10 text-xs font-medium tracking-[0.05em] whitespace-nowrap uppercase">
                      {text}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ) : (
          <ul className="relative h-full flex-1 overflow-hidden text-center">
            {announcements.map((text, i) => (
              <li
                key={text}
                aria-hidden={i !== index}
                className={`absolute inset-0 block truncate text-xs leading-9 font-medium tracking-[0.05em] uppercase ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              >
                {text}
              </li>
            ))}
          </ul>
        )}

        <button type="button" className={iconBtn} onClick={close} aria-label="Cerrar avisos">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
