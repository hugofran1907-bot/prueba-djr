import { paymentMethods, type PaymentMethod as Method } from "@/config/store";

const LABELS: Record<Method, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  paypal: "PayPal",
  applepay: "Apple Pay",
  googlepay: "Google Pay",
  bizum: "Bizum",
  shoppay: "Shop Pay",
};

/** Marca genérica de cada método (no reproduce logotipos registrados). */
function Glyph({ method }: { method: Method }) {
  const text = { fill: "currentColor", fontFamily: "ui-sans-serif, system-ui, sans-serif", fontWeight: 700 } as const;
  switch (method) {
    case "visa":
      return <text x="24" y="20" textAnchor="middle" fontSize="11" fontStyle="italic" letterSpacing="0.5" {...text}>VISA</text>;
    case "mastercard":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="20" cy="16" r="7" />
          <circle cx="28" cy="16" r="7" />
        </g>
      );
    case "paypal":
      return <text x="24" y="20" textAnchor="middle" fontSize="10" {...text}>PayPal</text>;
    case "applepay":
      return <text x="24" y="20" textAnchor="middle" fontSize="9.5" {...text}>A Pay</text>;
    case "googlepay":
      return <text x="24" y="20" textAnchor="middle" fontSize="9.5" {...text}>G Pay</text>;
    case "shoppay":
      return <text x="24" y="20" textAnchor="middle" fontSize="8.5" {...text}>Shop Pay</text>;
    case "bizum":
      return <text x="24" y="20" textAnchor="middle" fontSize="10" {...text}>bizum</text>;
  }
}

export function PaymentIcons({ className }: { className?: string }) {
  if (paymentMethods.length === 0) return null;
  return (
    <ul className={className} aria-label="Métodos de pago">
      {paymentMethods.map((method) => (
        <li key={method}>
          <svg viewBox="0 0 48 32" className="h-7 w-auto" role="img" aria-label={LABELS[method]}>
            <rect x="0.75" y="0.75" width="46.5" height="30.5" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
            <Glyph method={method} />
          </svg>
        </li>
      ))}
    </ul>
  );
}
