"use client";

/**
 * Vuelo al carrito: una copia de la foto del producto se encoge y vuela en curva hasta el
 * icono del carrito de la cabecera ([data-cart-target]); al llegar, el icono rebota.
 *
 *  - Origen: la foto de la galería que está a la vista ([data-fly-source]). Si no hay
 *    ninguna en pantalla (p. ej. se ha pulsado la barra fija de compra en móvil), sale
 *    del botón pulsado, ya en tamaño miniatura.
 *  - Destino: la posición real del icono en ese momento (la cabecera es fija).
 *  - Curva: la copia avanza en horizontal y en vertical con curvas distintas, así que
 *    traza un arco en vez de una línea recta. Solo transform y opacity.
 *  - Siempre se resuelve (como mucho en FLIGHT_MS + margen), así que quien espera la
 *    promesa para añadir al carrito nunca se queda colgado. Con movimiento reducido,
 *    o si falta el icono, se resuelve al instante y no se anima nada.
 */

const FLIGHT_MS = 720;
const THUMB = 28; // tamaño final de la copia (px), un poco mayor que el icono
const REDUCED = "(prefers-reduced-motion: reduce)";

function visibleSource(): HTMLElement | null {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  for (const el of document.querySelectorAll<HTMLElement>("[data-fly-source]")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue; // galería oculta (móvil ↔ escritorio)
    const inView = r.left < vw * 0.9 && r.right > vw * 0.1 && r.top < vh * 0.85 && r.bottom > vh * 0.15;
    if (inView) return el;
  }
  return null;
}

/** Pequeño rebote del icono al recibir el producto. */
export function pulseCartIcon() {
  const target = document.querySelector<HTMLElement>("[data-cart-target]");
  if (!target || window.matchMedia(REDUCED).matches) return;
  target.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.28)" }, { transform: "scale(0.94)" }, { transform: "scale(1)" }],
    { duration: 480, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
  );
}

export function flyToCart({ from, fallbackImage }: { from?: Element | null; fallbackImage?: string | null }) {
  return new Promise<void>((resolve) => {
    const target = document.querySelector<HTMLElement>("[data-cart-target]");
    if (!target || window.matchMedia(REDUCED).matches) return resolve();

    const source = visibleSource();
    const img = source?.querySelector("img");
    const src = img?.currentSrc || img?.src || fallbackImage;
    const startRect = source?.getBoundingClientRect() ?? from?.getBoundingClientRect();
    if (!src || !startRect) return resolve();

    // Desde el botón, la copia ya sale pequeña; desde la foto, con su tamaño real (recortado a cuadrado).
    const fromButton = !source;
    const size = fromButton ? 56 : Math.min(startRect.width, startRect.height, 320);
    const x0 = startRect.left + startRect.width / 2 - size / 2;
    const y0 = startRect.top + startRect.height / 2 - size / 2;

    const t = target.getBoundingClientRect();
    const dx = t.left + t.width / 2 - (x0 + size / 2);
    const dy = t.top + t.height / 2 - (y0 + size / 2);
    const endScale = THUMB / size;

    // Dos capas: la exterior se mueve en horizontal, la interior en vertical y escala.
    const outer = document.createElement("div");
    outer.setAttribute("aria-hidden", "true");
    outer.className = "fly-to-cart";
    outer.style.cssText = `left:${x0}px;top:${y0}px;width:${size}px;height:${size}px;`;
    const inner = document.createElement("div");
    inner.className = "fly-to-cart-inner";
    const clone = document.createElement("img");
    clone.src = src;
    clone.alt = "";
    clone.decoding = "async";
    inner.append(clone);
    outer.append(inner);
    document.body.append(outer);

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      outer.remove();
      pulseCartIcon();
      resolve();
    };

    // Horizontal: arranca rápido y frena al llegar. Vertical: arranca despacio (sube con
    // el arco) y acelera hacia el icono. Juntas dibujan la curva.
    outer.animate([{ transform: "translateX(0)" }, { transform: `translateX(${dx}px)` }], {
      duration: FLIGHT_MS,
      easing: "cubic-bezier(0.3, 0, 0.2, 1)",
      fill: "forwards",
    });
    const flight = inner.animate(
      [
        { transform: "translateY(0) scale(1)", opacity: 1, borderRadius: "14px" },
        { transform: `translateY(${dy * 0.35}px) scale(${Math.max(endScale, 0.45)})`, opacity: 1, offset: 0.45 },
        { transform: `translateY(${dy}px) scale(${endScale})`, opacity: 0.85, borderRadius: "50%" },
      ],
      { duration: FLIGHT_MS, easing: "cubic-bezier(0.55, 0, 0.75, 0.6)", fill: "forwards" },
    );
    flight.onfinish = finish;
    flight.oncancel = finish;
    // Red de seguridad: si la pestaña se oculta y la animación se pausa, no bloquear el carrito.
    window.setTimeout(finish, FLIGHT_MS + 400);
  });
}
