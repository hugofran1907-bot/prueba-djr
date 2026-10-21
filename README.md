# DJR® · Tienda online

Tienda de **DJR®**, una marca de streetwear minimalista. Construida con Next.js (App Router), TypeScript y Tailwind CSS, y preparada para conectarse a **Shopify Storefront API** mediante GraphQL.

> **Fase 1 (actual):** landing page completa con datos de demostración, más páginas mínimas de colección, producto, búsqueda, carrito (pendiente) y páginas legales, para que no haya enlaces rotos.

---

## Requisitos

- Node.js 20.9 o superior (probado con Node 26.8 y npm 11.19)

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # en Windows: copy .env.example .env.local
npm run dev                  # http://localhost:3000
```

Si el puerto 3000 está ocupado: `npm run dev -- --port 3100`.

| Script              | Qué hace                               |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Servidor de desarrollo (Turbopack)     |
| `npm run build`     | Build de producción                    |
| `npm run start`     | Sirve el build de producción           |
| `npm run lint`      | ESLint (reglas de Next.js y TypeScript)|
| `npm run typecheck` | Comprobación de tipos con TypeScript   |

---

## Variables de entorno

| Variable                           | Ámbito   | Descripción |
| ---------------------------------- | -------- | ----------- |
| `USE_MOCK_DATA`                    | Servidor | `true` (por defecto) usa `lib/mock-data.ts`. `false` consulta Shopify. |
| `NEXT_PUBLIC_SITE_URL`             | Público  | URL del sitio para metadatos, Open Graph y sitemap. |
| `SHOPIFY_STORE_DOMAIN`             | Servidor | Dominio `*.myshopify.com`, sin `https://`. |
| `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` | Servidor | Token **privado** de Storefront API. |
| `SHOPIFY_STOREFRONT_API_VERSION`   | Servidor | Versión de la API (p. ej. `2026-07`). Verifica la última versión estable. |

### Seguridad del token

- El token privado **solo** se lee en `lib/env.ts`, que importa `server-only`: si algún componente de cliente intentara importarlo, el build fallaría.
- Ninguna variable de Shopify lleva el prefijo `NEXT_PUBLIC_`, así que no llegan al navegador.
- Todas las consultas a Shopify se hacen desde Server Components.

### Conectar Shopify

1. En Shopify, instala el canal **Headless** y crea un *storefront*. Copia el **token privado** de Storefront API.
2. Activa en ese storefront los permisos de lectura de productos, colecciones y **`unauthenticated_read_product_inventory`** (sin este último, el stock por unidades llega como `null` y no se muestra «Últimas unidades»), además de los de carrito (`unauthenticated_write_checkouts` / `unauthenticated_read_checkouts`).
3. En `.env.local`: `USE_MOCK_DATA=false`, `SHOPIFY_STORE_DOMAIN` y `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`.
4. Crea las colecciones `camisetas`, `sudaderas` y `pantalones` (o cambia `featuredCollections` en `config/site.ts`). `/colecciones/todo` no hace falta crearla: la resuelve `lib/shopify.ts`.
5. Crea los **metacampos de producto** (namespace `custom`), todos de tipo texto multilínea salvo el último:
   | Clave | Uso en la ficha |
   | --- | --- |
   | `beneficio`, `detalle`, `uso` | Acordeón «Descripción», en ese orden |
   | `cuidados` | Acordeón «Cuidados» |
   | `materiales` | Acordeón «Materiales y gramaje» |
   | `fit` | Acordeón «Tallaje y fit» |
   | `completa_el_look` | Lista de referencias de producto → bloque «Completa el look» |
6. Variantes: usa las opciones **Talla** y, si aplica, **Color** (con *swatch* de color en Shopify para las muestras).
7. Etiqueta `nuevo` → badge «Nuevo». La primera colección del producto se usa en la ruta de navegación y en «También te puede gustar».
8. Rellena los datos de `config/store.ts` y, cuando el pago esté listo, pon `CHECKOUT_ENABLED = true`: «Finalizar compra» crea el carrito con `cartCreate` y redirige a `checkoutUrl`. (Añadir al carrito ya funciona con `CART_ENABLED = true`.)
9. Conecta el proveedor de email en `lib/actions.ts` (newsletter y «Avísame») y cambia `emailProvider` en `config/store.ts`.

> Las consultas nuevas (metacampos, stock, swatches, vídeo, `cartCreate`) siguen la Storefront API pero **no se han probado contra una tienda real**: verifícalas al conectar.

Si faltan credenciales o Shopify falla, las secciones muestran un **estado de error** en lugar de romper la página.

---

## Estructura

```
app/
  layout.tsx                 Fuentes, metadatos globales, cabecera y pie
  page.tsx                   Home
  error.tsx · not-found.tsx  Estados globales
  opengraph-image.tsx        Imagen Open Graph generada con la marca
  icon.svg                   Favicon provisional
  robots.ts · sitemap.ts     SEO técnico
  colecciones/[handle]/      Colección (base para filtros y ordenación)
  productos/[handle]/        Ficha de producto con tallas
  buscar/                    Búsqueda y listado completo
  carrito/                   Carrito a página completa
  faq/                       Preguntas frecuentes
  legal/[slug]/              Páginas informativas y legales
components/
  layout/   Header, AnnouncementBar, Footer, PaymentIcons, WhatsAppButton, Logo
  cart/     CartContext (estado + localStorage), CartDrawer, CartContents
  home/     Hero, Marquee, NewArrivals, CollectionsGrid, PromoBanner, BrandStatement, Founders, Reviews, Faq, Newsletter
  product/  ProductCard, ProductGrid, Price, DemoNotice, ProductGallery, ProductPurchase, SizeGuide
  ui/       Button, SectionHeading, States, Accordion, EmailForm
config/
  store.ts  Datos de la tienda y todos los [REEMPLAZAR]
  site.ts   Navegación, hero, banner y bloque de marca
lib/
  shopify.ts    Capa de acceso a datos (mock ↔ Shopify). Único punto de entrada
  queries.ts    Consultas GraphQL de Storefront API
  mock-data.ts  Datos de demostración
  types.ts      Tipos de dominio, independientes de Shopify
  env.ts        Variables del servidor (server-only)
  legal.ts      Estructura de las páginas legales
  actions.ts    Server Actions: newsletter, «Avísame», checkout
  utils.ts      Utilidades (formato de precio, clases)
```

### Principio de la arquitectura

Los componentes **nunca** llaman a Shopify directamente: importan funciones de `lib/shopify.ts` (`getNewArrivals`, `getCollection`, `getProduct`…) que devuelven tipos de `lib/types.ts`. Cambiar entre mocks y Shopify, o de proveedor, no afecta a la interfaz.

---

## Personalización rápida

- **`config/store.ts`** — ÚNICO archivo con datos comerciales, legales y de contacto: empresa, redes, WhatsApp, envíos, devoluciones, métodos de pago, barra de anuncios, líneas de confianza, propuesta de valor, incentivo del newsletter, fundadores, reseñas, FAQ, guía de tallas, textos por defecto de producto y los flags `CART_ENABLED` (añadir al carrito) y `CHECKOUT_ENABLED` (pago).
- **`config/site.ts`** — contenido editorial y de diseño: navegación, hero, banner promocional (`enabled`, `tone`) y bloque de marca.

Los colores y tipografías están en `app/globals.css` (`@theme`):

| Token          | Color     |
| -------------- | --------- |
| `navy`         | `#0B0B1E` |
| `burgundy`     | `#7A1F2B` |
| `cream`        | `#F2EDE4` |
| `white`        | `#FFFFFF` |
| `ink`          | `#111111` |

Tipografías: **Instrument Serif** (logotipo y titulares) e **Inter Tight** (texto), mediante `next/font`.

---

## Pendiente de sustituir: `[REEMPLAZAR]`

Busca `[REEMPLAZAR]` en el proyecto para localizar todos los datos provisionales:

- Razón social, correo, teléfono, dirección y perfiles sociales.
- Temporada de la colección e historia real de la marca.
- Composición, gramaje y cuidados de cada producto.
- Textos legales: deben redactarlos o revisarlos profesionales.
- **Fotografías**: son imágenes libres de Unsplash usadas como marcador de posición. Sustitúyelas por fotografía propia.
- **Logotipo**: DJR® en tipografía serif provisional (`components/layout/Logo.tsx`).
- **Precios y stock de los mocks**: son ficticios. La interfaz lo indica con el aviso «Datos de demostración».

---

## Comportamiento honesto (a propósito)

- **Newsletter y «Avísame»**: validan en el servidor, pero mientras `emailProvider` sea `null` avisan de que **el correo no se ha guardado**.
- **Carrito**: funciona en local (localStorage). Con `CART_ENABLED = true` todas las prendas disponibles se pueden añadir. Con `CHECKOUT_ENABLED = false`, «Finalizar compra» está desactivado; con `true` y datos de demostración, informa de que no hay checkout en modo demo.
- **Reseñas**: `reviews` está vacío → se muestra «Síguenos en Instagram». Añade solo reseñas reales.
- **Escasez**: «Últimas N unidades» solo aparece con stock real ≤ 3.
- **WhatsApp**: oculto mientras el número sea un marcador.

## Hoja de ruta

1. Conectar el proveedor de email (newsletter y «Avísame»).
2. Filtros y ordenación en `/colecciones/[handle]` con `searchParams`.
3. Sincronizar el carrito local con la Cart API para conservarlo entre dispositivos.
4. Revalidación por webhooks de Shopify (`revalidateTag`).
