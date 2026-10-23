/**
 * Cambiar de color en la ficha abre otro producto, pero no debe subir arriba del todo:
 * el selector avisa antes de navegar y ScrollToTop respeta la posición una vez.
 */
let keepScroll = false;

export function keepScrollOnce() {
  keepScroll = true;
}

export function consumeKeepScroll() {
  const value = keepScroll;
  keepScroll = false;
  return value;
}
