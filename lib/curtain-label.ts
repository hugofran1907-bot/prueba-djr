/**
 * Título pendiente del telón cuando se navega a una sección con ancla (/#novedades → «Novedades»).
 * Lo fija RouteTransition al pulsar el enlace y lo consume el PageCurtain de la página de destino
 * (la home no tiene título propio). Vive aparte para que PageCurtain.tsx solo exporte componentes
 * y Fast Refresh pueda actualizarlo sin recargar la página entera.
 */
let pending: string | null = null;

export function setPendingCurtainLabel(label: string | null) {
  pending = label;
}

export function getPendingCurtainLabel() {
  return pending;
}
