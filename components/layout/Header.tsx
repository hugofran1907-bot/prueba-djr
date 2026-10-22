"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import { activeSocial } from "@/config/store";
import { Logo } from "@/components/layout/Logo";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { useCart } from "@/components/cart/CartContext";
import { cn } from "@/lib/utils";

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4.5 8h15l-1 12.5h-13z" />
      <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  );
}

const iconButton =
  "inline-flex size-11 items-center justify-center transition-[opacity,transform] duration-150 hover:opacity-60 active:scale-[0.94]";

export function Header() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLDialogElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { count, openCart } = useCart();

  // Cierra los diálogos al cambiar de ruta.
  useEffect(() => {
    menuRef.current?.close();
    searchRef.current?.close();
  }, [pathname]);

  return (
    <>
      <a
        href="#contenido"
        className="eyebrow fixed top-2 left-2 z-[60] -translate-y-24 bg-navy px-4 py-3 text-cream focus:translate-y-0"
      >
        Saltar al contenido
      </a>

      {/* Barra de anuncios + cabecera, fijas juntas */}
      <div className="fixed inset-x-0 top-0 z-50">
      <AnnouncementBar />
      <header className="border-b border-navy/10 bg-white text-navy">
        <div className="container-editorial grid h-16 grid-cols-[1fr_auto] items-center md:h-20 lg:grid-cols-[1fr_auto_1fr]">
          {/* Izquierda: menú móvil y logotipo */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className={cn(iconButton, "-ml-3 lg:hidden")}
              aria-label="Abrir menú"
              aria-haspopup="dialog"
              onClick={() => menuRef.current?.showModal()}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M3 8h18M3 16h12" />
              </svg>
            </button>
            <Logo className="text-[2rem] md:text-[2.4rem]" />
          </div>

          {/* Centro: navegación de escritorio en píldoras */}
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {(siteConfig.mainNav ?? []).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="inline-flex min-h-10 items-center rounded-full px-4 text-[0.75rem] font-medium tracking-[0.06em] uppercase transition-colors duration-300 hover:bg-cream aria-[current=page]:bg-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Derecha: búsqueda y carrito */}
          <div className="-mr-3 flex items-center justify-end">
            <button
              type="button"
              className={iconButton}
              aria-label="Buscar"
              aria-haspopup="dialog"
              onClick={() => {
                searchRef.current?.showModal();
                searchInputRef.current?.focus();
              }}
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              // Destino del vuelo al carrito (lib/fly-to-cart.ts): ahí aterriza la foto y rebota.
              data-cart-target
              className={cn(iconButton, "relative")}
              aria-label={count > 0 ? `Abrir carrito, ${count} ${count === 1 ? "artículo" : "artículos"}` : "Abrir carrito"}
              aria-haspopup="dialog"
              onClick={openCart}
            >
              <BagIcon />
              {count > 0 && (
                <span
                  // Se vuelve a montar con cada cambio para que el «pop» (data-pop) se repita.
                  key={count}
                  data-pop
                  aria-hidden="true"
                  className="absolute top-1.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[0.625rem] font-medium text-cream tabular-nums"
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      </div>

      {/* Menú móvil */}
      <dialog
        data-anim="menu"
        ref={menuRef}
        aria-label="Menú"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-night text-navy backdrop:bg-night/70 open:flex open:flex-col"
      >
        <div className="container-editorial flex h-16 items-center justify-between">
          <Logo asLink={false} className="text-[2rem]" />
          <button type="button" className={cn(iconButton, "-mr-3")} aria-label="Cerrar menú" onClick={() => menuRef.current?.close()}>
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Menú móvil" className="container-editorial flex flex-1 flex-col justify-center">
          <ul className="space-y-2">
            {(siteConfig.mainNav ?? []).map((item) => (
              <li key={item.href} className="flex items-baseline gap-4 border-b border-navy/10 py-3">
                <Link
                  href={item.href}
                  onClick={() => menuRef.current?.close()}
                  className="font-serif text-5xl transition-colors hover:text-stone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="container-editorial flex gap-6 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
          {(activeSocial() ?? []).map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="eyebrow text-navy/70 hover:text-navy">
                {s.label}
              </a>
            ))}
        </div>
      </dialog>

      {/* Búsqueda */}
      <dialog
        data-anim="sheet"
        ref={searchRef}
        aria-label="Buscar productos"
        className="m-0 w-full max-w-none bg-cream text-navy backdrop:bg-night/70 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          // Cierra al pulsar en el fondo.
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="container-editorial py-6 md:py-10">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-stone">Buscar</p>
            <button type="button" className={cn(iconButton, "-mr-3")} aria-label="Cerrar búsqueda" onClick={() => searchRef.current?.close()}>
              <CloseIcon />
            </button>
          </div>
          <form action="/buscar" method="get" role="search" className="mt-4 flex items-center gap-4 border-b border-navy pb-3">
            <label htmlFor="header-search" className="sr-only">
              Buscar productos
            </label>
            <input
              ref={searchInputRef}
              id="header-search"
              name="q"
              type="search"
              required
              autoComplete="off"
              placeholder="Camisetas, sudaderas, pantalones…"
              className="w-full bg-transparent font-serif text-3xl placeholder:text-navy/35 focus:outline-none md:text-5xl"
            />
            <button type="submit" className={iconButton} aria-label="Enviar búsqueda">
              <SearchIcon />
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
