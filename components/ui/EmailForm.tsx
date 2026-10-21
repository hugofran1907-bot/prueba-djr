"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef } from "react";
import type { FormState } from "@/lib/actions";
import { ArrowIcon } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  /** Texto del mensaje de éxito (solo se muestra si el proveedor confirma el alta). */
  successText: string;
  consentText: string;
  /** Campos ocultos adicionales (producto, talla…). */
  hidden?: Record<string, string>;
  size?: "large" | "compact";
  submitLabel?: string;
  className?: string;
};

const initialState: FormState = { status: "idle" };

/** Formulario de email con consentimiento, validado en el servidor. */
export function EmailForm({
  action,
  successText,
  consentText,
  hidden,
  size = "large",
  submitLabel = "Suscribirme",
  className,
}: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const id = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const messageId = `${id}-message`;
  const large = size === "large";

  // Ante un error, devuelve el foco al campo para corregirlo.
  useEffect(() => {
    if (state.status === "error") emailRef.current?.focus();
  }, [state]);

  return (
    <form action={formAction} noValidate className={className}>
      {hidden && Object.entries(hidden).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}

      <label htmlFor={`${id}-email`} className="eyebrow text-stone">
        Correo electrónico
      </label>
      <div className="mt-3 flex items-center border-b border-navy focus-within:border-burgundy">
        <input
          ref={emailRef}
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          aria-invalid={state.status === "error" ? true : undefined}
          aria-describedby={messageId}
          className={cn(
            "w-full bg-transparent placeholder:text-navy/30 focus:outline-none",
            large ? "py-4 font-serif text-2xl md:text-3xl" : "py-3 text-base",
          )}
        />
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex size-12 shrink-0 items-center justify-center transition-colors hover:text-burgundy disabled:opacity-40"
          aria-label={submitLabel}
        >
          <ArrowIcon />
        </button>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          id={`${id}-consent`}
          name="consent"
          type="checkbox"
          required
          aria-describedby={messageId}
          className="mt-0.5 size-4 shrink-0 accent-burgundy"
        />
        <label htmlFor={`${id}-consent`} className="text-xs leading-relaxed text-stone">
          {consentText} He leído la{" "}
          <Link href="/legal/privacidad" className="underline underline-offset-2 hover:text-navy">
            política de privacidad
          </Link>
          .
        </label>
      </div>

      <p id={messageId} role="status" aria-live="polite" className="mt-5 min-h-12 text-sm leading-relaxed">
        {pending && <span className="text-stone">Enviando…</span>}
        {!pending && state.status === "error" && <span data-enter className="block text-burgundy">{state.message}</span>}
        {!pending && state.status === "success" && <span data-enter className="block text-navy">{successText}</span>}
        {!pending && state.status === "not-configured" && (
          <span data-enter className="block text-navy">
            Gracias. Este formulario todavía no está conectado a ningún servicio, así que{" "}
            <strong className="font-medium">tu correo no se ha guardado</strong>.
          </span>
        )}
      </p>
    </form>
  );
}
