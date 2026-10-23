"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { CART_ENABLED, colorSwatches, trustLines } from "@/config/store";
import { notifyWhenAvailable } from "@/lib/actions";
import type { Product, ProductOption, ProductVariant } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { flyToCart } from "@/lib/fly-to-cart";
import { keepScrollOnce } from "@/lib/scroll-intent";
import { Star } from "@/components/ui/Star";
import { useCart } from "@/components/cart/CartContext";
import { EmailForm } from "@/components/ui/EmailForm";
import { SizeGuide } from "@/components/product/SizeGuide";
import { PaymentIcons } from "@/components/layout/PaymentIcons";

const COLOR_RE = /^(colou?r)$/i;
const SIZE_RE = /^(talla|size|tamaño)$/i;

/** Umbral de escasez: solo se avisa si el dato real de stock es ≤ este valor. */
const LOW_STOCK = 3;

function findVariant(variants: ProductVariant[], selection: Record<string, string>) {
  return variants.find((v) => v.selectedOptions.every((o) => !(o.name in selection) || selection[o.name] === o.value));
}

/* ───────────── Iconos de confianza ───────────── */

const iconProps = { "aria-hidden": true, viewBox: "0 0 24 24", className: "size-5 shrink-0", fill: "none", stroke: "currentColor", strokeWidth: 1.3 } as const;

function TruckIcon() {
  return (
    <svg {...iconProps}>
      <path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7z" />
      <circle cx="6.5" cy="17" r="1.7" />
      <circle cx="17" cy="17" r="1.7" />
    </svg>
  );
}
function ReturnIcon() {
  return (
    <svg {...iconProps}>
      <path d="M8 7 4 11l4 4" />
      <path d="M4 11h11a5 5 0 0 1 0 10h-3" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg {...iconProps}>
      <rect x="5" y="10.5" width="14" height="10" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

/* ───────────── Selector de opción ───────────── */

function OptionPicker({
  option,
  value,
  onChange,
  isAvailable,
  kind,
  extra,
  fieldsetRef,
}: {
  option: ProductOption;
  value: string | null;
  onChange: (v: string) => void;
  isAvailable: (v: string) => boolean;
  kind: "color" | "size";
  extra?: ReactNode;
  fieldsetRef?: React.Ref<HTMLFieldSetElement>;
}) {
  const name = useId();
  return (
    <fieldset ref={fieldsetRef} className="mt-8">
      <div className="flex items-baseline justify-between gap-4">
        <legend className="eyebrow float-left text-stone">
          {option.name}
          {value && <span className="ml-2 tracking-normal normal-case text-navy">· {value}</span>}
        </legend>
        {extra}
      </div>
      <div className="clear-both flex flex-wrap gap-2 pt-4">
        {option.values.map((v) => {
          const available = isAvailable(v);
          const hex = option.swatches?.[v] ?? colorSwatches[v.toLowerCase()];
          return (
            <label key={v} className="relative" title={kind === "color" ? v : undefined}>
              <input
                type="radio"
                name={name}
                value={v}
                checked={value === v}
                disabled={!available}
                onChange={() => onChange(v)}
                className="peer sr-only"
              />
              {kind === "color" && hex ? (
                <span className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-transparent transition-[border-color,transform] duration-150 active:scale-[0.96] peer-checked:border-navy peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-burgundy peer-disabled:cursor-not-allowed peer-disabled:opacity-35">
                  <span className="size-8 rounded-full border border-navy/20" style={{ backgroundColor: hex }} />
                  <span className="sr-only">
                    {v}
                    {!available && " (agotado)"}
                  </span>
                </span>
              ) : (
                <span className="flex h-12 min-w-14 cursor-pointer items-center justify-center rounded-full border border-navy/25 px-4 text-sm transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.96] peer-checked:border-navy peer-checked:bg-navy peer-checked:text-cream peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-burgundy peer-disabled:cursor-not-allowed peer-disabled:text-navy/35 peer-disabled:line-through hover:border-navy">
                  {v}
                  {!available && <span className="sr-only"> (agotada)</span>}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ───────────── Colores de la prenda ───────────── */

export type ColorLink = { handle: string; color: string };

/** Talla elegida antes de cambiar de color, para que la ficha del otro color la conserve. */
const PENDING_SIZE_KEY = "djr:talla-al-cambiar-color";

function takePendingSize(title: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_SIZE_KEY);
    sessionStorage.removeItem(PENDING_SIZE_KEY);
    const pending = raw ? (JSON.parse(raw) as { title: string; size: string }) : null;
    return pending?.title === title ? pending.size : null;
  } catch {
    return null;
  }
}

/**
 * Cada color es un producto propio (con sus fotos), así que cambiar de color abre la ficha
 * de ese color: cambian las fotos, se conservan la talla elegida y la posición en la página.
 */
function ColorPicker({ colors, current, title, size }: { colors: ColorLink[]; current: string; title: string; size: string | null }) {
  return (
    <nav aria-label="Colores" className="mt-8">
      <p className="eyebrow text-stone">
        Color<span className="ml-2 tracking-normal normal-case text-navy">· {colors.find((c) => c.handle === current)?.color}</span>
      </p>
      <ul className="flex flex-wrap gap-2 pt-4">
        {colors.map((c) => {
          const selected = c.handle === current;
          const hex = colorSwatches[c.color.toLowerCase()];
          return (
            <li key={c.handle}>
              <Link
                href={`/productos/${c.handle}`}
                scroll={false}
                replace
                aria-current={selected ? "true" : undefined}
                aria-label={`${title} en ${c.color.toLowerCase()}`}
                title={c.color}
                onClick={() => {
                  if (selected) return;
                  keepScrollOnce();
                  try {
                    if (size) sessionStorage.setItem(PENDING_SIZE_KEY, JSON.stringify({ title, size }));
                  } catch {}
                }}
                className="flex size-11 items-center justify-center rounded-full border border-transparent transition-[border-color,transform] duration-150 hover:border-navy/40 active:scale-[0.96] aria-[current=true]:border-navy"
              >
                <span className="size-8 rounded-full border border-navy/20" style={{ backgroundColor: hex }} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ───────────── Componente principal ───────────── */

export function ProductPurchase({
  product,
  colors = [],
  children,
}: {
  product: Product;
  /** Los colores de esta prenda (vacío si solo hay uno). */
  colors?: ColorLink[];
  children?: ReactNode;
}) {
  const { addLine, openCart } = useCart();
  const colorOption = product.options.find((o) => COLOR_RE.test(o.name));
  const sizeOption = product.options.find((o) => SIZE_RE.test(o.name));

  const firstAvailableColor =
    colorOption?.values.find((c) => product.variants.some((v) => v.availableForSale && v.selectedOptions.some((o) => o.name === colorOption.name && o.value === c))) ??
    colorOption?.values[0] ??
    null;

  const [color, setColor] = useState<string | null>(firstAvailableColor);
  // Al llegar desde otro color de la misma prenda, conserva la talla elegida allí.
  const [size, setSize] = useState<string | null>(() => takePendingSize(product.title));
  const [notifyOpen, setNotifyOpen] = useState(false);
  /** Momento del último «añadir» (null = sin aviso). Cambia en cada pulsación para reiniciar el aviso. */
  const [addedAt, setAddedAt] = useState<number | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);

  const mainButtonRef = useRef<HTMLDivElement>(null);
  const sizeFieldsetRef = useRef<HTMLFieldSetElement>(null);
  const notifyPanelId = useId();
  const hintId = useId();

  const selection: Record<string, string> = {};
  if (colorOption && color) selection[colorOption.name] = color;
  if (sizeOption && size) selection[sizeOption.name] = size;

  const needsSize = !!sizeOption && !size;
  const selectedVariant = needsSize ? undefined : findVariant(product.variants, selection);
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const priceText = formatPrice(price);

  const sizeAvailable = (s: string) => {
    const v = findVariant(product.variants, { ...(colorOption && color ? { [colorOption.name]: color } : {}), [sizeOption!.name]: s });
    return !!v?.availableForSale;
  };
  const colorAvailable = (c: string) =>
    product.variants.some((v) => v.availableForSale && v.selectedOptions.some((o) => o.name === colorOption!.name && o.value === c));

  // Escasez: SOLO con dato real de stock (quantityAvailable no nulo).
  const qty = selectedVariant?.quantityAvailable;
  const lowStock = typeof qty === "number" && qty > 0 && qty <= LOW_STOCK;

  // Barra fija móvil: visible cuando el botón principal ha salido por arriba.
  // Se mide la posición en cada scroll (no IntersectionObserver): un salto
  // de «debajo» a «encima» sin pasar por la pantalla no dispararía el observer.
  useEffect(() => {
    const el = mainButtonRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setStickyVisible(el.getBoundingClientRect().bottom < 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (addedAt === null) return;
    const t = window.setTimeout(() => setAddedAt(null), 4500);
    return () => window.clearTimeout(t);
  }, [addedAt]);

  function focusSizes() {
    const fieldset = sizeFieldsetRef.current;
    if (!fieldset) return;
    fieldset.scrollIntoView({ behavior: "smooth", block: "center" });
    fieldset.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus({ preventScroll: true });
  }

  /**
   * Añadir: la foto vuela hasta el icono del carrito (lib/fly-to-cart.ts) y, al llegar, la
   * línea entra en el carrito y aparece el aviso «Añadido · Ver carrito». El carrito no se
   * abre solo: se abre desde el icono o desde el aviso. Sin animación (movimiento reducido),
   * se añade al instante.
   */
  async function addToCart(e: MouseEvent<HTMLButtonElement>) {
    if (!selectedVariant) {
      focusSizes();
      return;
    }
    const variantTitle = [product.color, ...selectedVariant.selectedOptions.map((o) => `${o.name} ${o.value}`)]
      .filter(Boolean)
      .join(" · ");
    const line = {
      variantId: selectedVariant.id,
      handle: product.handle,
      title: product.title,
      variantTitle,
      price: selectedVariant.price,
      image: selectedVariant.image ?? product.featuredImage,
    };
    await flyToCart({ from: e.currentTarget, fallbackImage: line.image?.url });
    addLine(line);
    setAddedAt(Date.now());
  }

  function openNotify() {
    setNotifyOpen(true);
    mainButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const soldOutEverywhere = !product.availableForSale;
  const buttonBase = "flex items-center justify-center gap-3 rounded-full bg-navy px-6 text-[0.75rem] font-medium tracking-[0.08em] text-cream uppercase transition-[background-color,transform] duration-200 hover:bg-burgundy active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-navy/40 disabled:hover:bg-navy/40";
  const primaryButton = cn(buttonBase, "min-h-14 w-full");
  const stickyButton = cn(buttonBase, "min-h-12 shrink-0 px-5 text-xs");

  return (
    <>
      <p className="mt-5 text-lg tabular-nums" aria-live="polite">
        {priceText}
      </p>

      {colorOption && (
        <OptionPicker option={colorOption} kind="color" value={color} onChange={setColor} isAvailable={colorAvailable} />
      )}

      {sizeOption && (
        <OptionPicker
          option={sizeOption}
          kind="size"
          value={size}
          onChange={setSize}
          isAvailable={sizeAvailable}
          fieldsetRef={sizeFieldsetRef}
          extra={<SizeGuide sizes={sizeOption.values} />}
        />
      )}

      {colors.length > 1 && <ColorPicker colors={colors} current={product.handle} title={product.title} size={size} />}

      {lowStock && size && (
        <p className="mt-4 flex items-center gap-2 text-sm text-burgundy" role="status">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-burgundy" />
          Últimas {qty} unidades en talla {size}
        </p>
      )}

      {/* Botón principal */}
      <div ref={mainButtonRef} className="mt-8">
        {CART_ENABLED && !soldOutEverywhere ? (
          <>
            <button
              type="button"
              onClick={addToCart}
              disabled={needsSize || (!!selectedVariant && !selectedVariant.availableForSale)}
              aria-describedby={needsSize ? hintId : undefined}
              className={primaryButton}
            >
              {addedAt !== null ? "Añadido al carrito ✓" : `Añadir al carrito · ${priceText}`}
            </button>
            {needsSize && (
              <p id={hintId} className="mt-3 text-xs text-stone">
                Selecciona una talla para continuar.
              </p>
            )}

          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setNotifyOpen((o) => !o)}
              aria-expanded={notifyOpen}
              aria-controls={notifyPanelId}
              className={primaryButton}
            >
              Avísame cuando salga
            </button>
            <div id={notifyPanelId} hidden={!notifyOpen} data-enter className="mt-6 border border-navy/15 p-5">
              <p className="text-sm text-navy/85">
                Te escribiremos cuando {product.title} {size ? `en talla ${size} ` : ""}esté disponible.
              </p>
              <EmailForm
                action={notifyWhenAvailable}
                size="compact"
                submitLabel="Avisarme"
                className="mt-5"
                hidden={{ product: product.handle, ...(size ? { size } : {}) }}
                consentText="Acepto que DJR® me escriba para avisarme de la disponibilidad."
                successText="Listo. Te avisaremos en cuanto esté disponible."
              />
            </div>
          </>
        )}
      </div>

      {/* Líneas de confianza */}
      <ul className="mt-8 space-y-3 text-sm text-navy/85">
        <li className="flex items-center gap-3">
          <TruckIcon />
          {trustLines.shipping}
        </li>
        <li className="flex items-center gap-3">
          <ReturnIcon />
          {trustLines.returns}
        </li>
        <li className="flex items-center gap-3">
          <LockIcon />
          {trustLines.payment}
        </li>
      </ul>
      <PaymentIcons className="mt-5 flex flex-wrap gap-2 text-navy/70" />

      {children}

      {/* Barra fija inferior (móvil y tablet) */}
      <div
        data-sticky-buy
        data-visible={stickyVisible}
        aria-hidden={!stickyVisible}
        inert={!stickyVisible}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-navy/15 bg-cream pb-[env(safe-area-inset-bottom)] transition-transform duration-500 ease-editorial lg:hidden",
          stickyVisible ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="container-editorial flex h-[4.75rem] items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.title}</p>
            <p className="text-xs text-stone tabular-nums">
              {priceText}
              {sizeOption && <> · {size ? `Talla ${size}` : "Elige talla"}</>}
            </p>
          </div>
          {CART_ENABLED && !soldOutEverywhere ? (
            <button type="button" onClick={addToCart} className={stickyButton}>
              {needsSize ? "Elegir talla" : "Añadir"}
            </button>
          ) : (
            <button type="button" onClick={openNotify} className={stickyButton}>
              Avísame
            </button>
          )}
        </div>
      </div>

      {/* Aviso «Añadido · Ver carrito»: confirma sin abrir el carrito. La región siempre está
          montada para que los lectores de pantalla anuncien cada cambio. */}
      <div role="status" aria-live="polite" className="cart-notice">
        {addedAt !== null && (
          <div key={addedAt} data-enter className="cart-notice-card">
            <Star className="size-3.5 shrink-0" />
            <p className="min-w-0 flex-1 truncate text-sm">
              <span className="font-medium">{product.title}</span> añadido
            </p>
            <button
              type="button"
              onClick={() => {
                setAddedAt(null);
                openCart();
              }}
              className="shrink-0 text-xs font-medium tracking-[0.08em] uppercase underline underline-offset-4 hover:opacity-70"
            >
              Ver carrito →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
