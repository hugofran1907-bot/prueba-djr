/**
 * Envuelve cada página y se vuelve a montar al navegar, así que la entrada
 * (fundido y leve subida) se repite en cada cambio de ruta. La cabecera y el
 * pie viven en layout.tsx y no se animan.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
