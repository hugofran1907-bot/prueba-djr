/** Aviso visible cuando la tienda muestra datos de demostración. */
export function DemoNotice({ className }: { className?: string }) {
  return (
    <p className={className}>
      <span className="eyebrow inline-flex items-center gap-2 rounded-media border border-navy/20 px-3 py-1.5 text-xs text-stone">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-burgundy" />
        Datos de demostración · precios y stock no reales
      </span>
    </p>
  );
}
