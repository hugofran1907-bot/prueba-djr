# Borradores legales · DJR®

> **Esto es un BORRADOR, no un texto definitivo.** Lo ha preparado Claude (una IA) como punto de partida. **Antes de publicarlo debe revisarlo un profesional** (gestor o abogado): la ley cambia y cada negocio tiene sus particularidades.

## Qué hay aquí

| Archivo | Página de la web | Ley principal |
|---|---|---|
| `01-aviso-legal.md` | /legal/aviso-legal | LSSI-CE (Ley 34/2002) |
| `02-privacidad.md` | /legal/privacidad | RGPD y LOPDGDD |
| `03-cookies.md` | /legal/cookies | LSSI-CE art. 22.2 y Guía de cookies de la AEPD |
| `04-condiciones-de-venta.md` | /legal/condiciones-de-venta | Ley de consumidores (RDL 1/2007) |
| `05-envios-y-devoluciones.md` | /legal/envios-y-devoluciones | RDL 1/2007 |

## Cómo leerlos

- **`[REEMPLAZAR: …]`**: dato tuyo que falta (razón social, NIF, etc.). Son los mismos huecos que hay en `config/store.ts`.
- **`[CONFIRMAR: …]`**: he supuesto algo razonable para una tienda como la tuya, pero tienes que confirmar que es así (por ejemplo, qué herramientas usas).
- **`[REVISAR ABOGADO: …]`**: punto delicado en el que conviene que el profesional se fije especialmente.

## Lo que he supuesto (confírmalo)

- Vendes **a consumidores finales en España**, desde Cambrils (Tarragona).
- La tienda funciona con **Shopify** (pedidos y pagos) y la web está alojada en **Vercel**.
- Pagos: tarjeta, PayPal, Bizum, Apple Pay, Google Pay y Shop Pay (los que aparecen en la web).
- Devoluciones **gratuitas en 30 días** (lo que dice ahora la web; la ley exige como mínimo 14).
- Newsletter con un proveedor por decidir (Shopify Email, Klaviyo o Mailchimp).
- **Todavía no usas** analítica ni píxeles de publicidad. Si los añades, hay que actualizar la política de cookies y poner un banner.

## Cuando estén revisados

Pásamelos y los meto en la web: las páginas ya existen, con estos mismos apartados, en `lib/legal.ts`.
