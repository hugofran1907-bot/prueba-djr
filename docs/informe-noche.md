# Informe de esta noche · DJR®

Lo que he hecho mientras dormías. **No he cambiado nada del diseño ni del código de la web**: solo he añadido documentos en la carpeta `docs/`.

## 1. Documentos nuevos

| Archivo | Para qué |
|---|---|
| `docs/pendiente-para-lanzar.md` | Lista de comprobación de todo lo que falta, con casillas. Las partes marcadas **«pásamelo»** son los datos que necesito de ti. |
| `docs/borradores-legales/` | Borradores de aviso legal, privacidad, cookies, condiciones de venta y envíos y devoluciones. **Llévaselos a un gestor o abogado para que los revise.** Empieza por `00-LEEME.md`. |

En los borradores verás tres tipos de marca:
- **[REEMPLAZAR]**: dato tuyo que falta.
- **[CONFIRMAR]**: lo he supuesto, pero tienes que confirmarlo.
- **[REVISAR ABOGADO]**: punto delicado en el que conviene que se fije el profesional. Destacan dos: si la marca DJR está registrada (por el símbolo ®) y la normativa de consumo de Cataluña.

## 2. Revisión de la tienda en móvil (375 px, el tamaño de un iPhone)

He revisado 8 páginas: inicio, toda la colección, sudaderas, ficha de producto, carrito, búsqueda, FAQ y condiciones de venta.

### ✅ Está bien
- **Nada se sale por los lados** en ninguna página (sin scroll horizontal).
- **Cada página tiene un único título principal** (bueno para Google).
- **Todas las imágenes tienen descripción** (accesibilidad y SEO).
- **No hay letra por debajo de 12 px.**
- La portada en móvil se ve bien: foto, titular, texto y dos botones grandes.
- La ficha de producto se entiende bien: tallas grandes, botón ancho, métodos de pago e información de envío.

### ⚠️ Mejoras pequeñas (no urgentes)
Son zonas para el dedo algo pequeñas. Lo recomendable es que midan al menos 44 px:

1. **Enlace «Guía de tallas»** en la ficha: mide 69 × 16 px y es fácil fallar al tocarlo. Es la más importante de las tres, porque la gente la usa antes de comprar.
2. **Enlaces del pie de página:** miden 17 px de alto y están muy juntos.
3. **Logo de la cabecera:** mide 35 × 29 px.

Cada una se arregla en pocos minutos, sin cambiar el aspecto. **No las he tocado:** te lo pregunto mañana.

### ℹ️ Para que no te asustes
- **El botón redondo con una «N»** que ves abajo a la izquierda es una herramienta de Next.js que solo aparece mientras desarrollas. **No sale en la web publicada.**
- **Los «[REEMPLAZAR: …]»** que se ven en la ficha (por ejemplo, «Envío en [REEMPLAZAR: plazo] días») desaparecen cuando me pases los datos de `pendiente-para-lanzar.md`.
- **El aviso «Datos de demostración»** desaparece al conectar Shopify.

## 3. Mañana, para empezar

1. Abre `docs/pendiente-para-lanzar.md` y empieza por el apartado 1 (Shopify Payments y la revisión legal).
2. Pásame los datos de los apartados 2, 3 y 4 y los pongo en la web.
3. Dime si arreglo las tres zonas de toque pequeñas.
