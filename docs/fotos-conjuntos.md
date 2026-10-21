# Fotos de conjuntos (Gemini) → tienda

## Cómo subirlas sin perder calidad

1. Descarga cada foto de Gemini **tal cual** (PNG). No la recortes, no la comprimas, no le hagas captura.
2. Renómbrala con su número: `look-01.png`, `look-02.png` … `look-15.png`.
3. Cópiala en `public/images/conjuntos/` y **borra la versión antigua** de ese número
   (por ejemplo `look-01.jpg`): si conviven varias, la tienda usa primero la `.png`.
4. Recarga la web. No hace falta tocar código.

Formatos válidos: `.png`, `.webp`, `.jpg`, `.jpeg`, `.avif`. Tamaño recomendado: al menos
**1536 × 2048 px** (vertical 3:4, como piden los prompts). La tienda sirve cada foto al tamaño
de pantalla con calidad 90 en AVIF/WebP, así que el original grande no ralentiza la web.

> La foto de portada sigue el mismo sistema: sustituye `public/images/portada/portada.webp`
> por una nueva con el mismo nombre.

## Qué número es cada foto y dónde sale

Ahora mismo solo se usan las que tienen producto en la última columna (en su galería).
El resto quedan guardadas para redes o para una futura sección de looks.

| Archivo | Prompt | Conjunto | Sale en |
|---|---|---|---|
| `look-01` | FOTO 01 | Los dos: camiseta negra + pantalón negro | Camiseta Negra |
| `look-02` | FOTO 02 | Los dos: camiseta blanca + pantalón negro | Camiseta Blanca |
| `look-03` | FOTO 03 | Él gris entero / ella negro entero | Pantalón Gris |
| `look-04` | FOTO 04 | Él blanca + gris / ella gris + negro | — |
| `look-05` | FOTO 05 | Él negra + blanco / ella blanco entero | Pantalón Blanco |
| `look-06` | FOTO 06 | Él gris + negro / ella negra + blanco | — |
| `look-07` | FOTO 07 | Él sudadera negra + negro / ella blanco entero | — |
| `look-08` | FOTO 08 | Él blanca + gris / ella negro entero | — |
| `look-09` | FOTO 09 | Él gris + blanco / ella sudadera gris + gris | — |
| `look-10` | FOTO 10 | Él sudadera negra + gris / ella blanca + negro | — |
| `look-11` | FOTO 11 | Él blanca + negro / ella negra + blanco | — |
| `look-12` | FOTO 12 | Los dos: camiseta gris + pantalón negro | Camiseta Gris |
| `look-13` | FOTO 13 | Él sudadera negra + negro / ella blanca + gris | — |
| `look-14` | FOTO 14 | Él blanca + negro / ella de espaldas | Pantalón Negro |
| `look-15` | FOTO 15 | Él blanca + negro / ella gris + negro | — |

## Dos correcciones para los prompts antes de generarlos

**1. Las sudaderas son de cuello redondo, no con capucha.** Los prompts 07, 09, 10 y 13 piden
*hoodie*; si los usas así, las fotos enseñarán una prenda que la tienda no vende. Cambia la
línea de la sudadera por esta (ajusta el color):

```
black oversized crewneck sweatshirt with raglan sleeves and ribbed cuffs and hem, no hood,
small white embroidered "DJR" monogram on the left chest and a small white sparkle star on
the left sleeve near the cuff
```

- **FOTO 07 (él):** quita *with the hood UP* y *face partly hidden by the hood*; deja *Head down, hands in pockets*.
- **FOTO 09 (ella):** `heather grey oversized crewneck sweatshirt…` en vez de *hoodie with hood down*.
- **FOTO 10 (él):** igual que la 07, con pantalón gris.
- **FOTO 13 (él):** quita *hood DOWN* y *hands in the hoodie pocket* → *hands in pockets*.

**2. El monograma es «DJR», no «DR».** En el bloque *Clothing style* de todos los prompts,
cambia `"DR" monogram` por `"DJR" monogram`. Aun así, Gemini suele deformar los logos: lo
normal es pegar encima los logos reales (monograma y doble estrella) antes de subirlas.
