"use client";

import { useRef } from "react";
import { sizeGuide } from "@/config/store";
import { cn } from "@/lib/utils";

/** Enlace «Guía de tallas» + modal con la tabla de medidas de config/store.ts. */
export function SizeGuide({ sizes }: { sizes?: string[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const rows = sizes?.length ? sizes : sizeGuide.sizes;

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-haspopup="dialog"
        className="text-xs text-navy underline underline-offset-4 hover:text-burgundy"
      >
        Guía de tallas
      </button>

      <dialog
        data-anim="modal"
        ref={ref}
        aria-labelledby="size-guide-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-xl bg-cream p-0 text-navy backdrop:bg-night/70 backdrop:backdrop-blur-sm"
      >
        <div className="p-6 md:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="eyebrow text-burgundy">Tallaje</p>
              <h2 id="size-guide-title" className="mt-3 font-serif text-4xl">
                Guía de tallas
              </h2>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="-mt-2 -mr-3 inline-flex size-11 items-center justify-center hover:opacity-60"
              aria-label="Cerrar guía de tallas"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="m5 5 14 14M19 5 5 19" />
              </svg>
            </button>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="pb-4 text-left text-xs text-stone">Medidas de la prenda en centímetros.</caption>
              <thead>
                <tr className="border-b border-navy">
                  <th scope="col" className="eyebrow py-3 pr-4 font-medium">
                    Talla
                  </th>
                  {sizeGuide.measurements.map((m) => (
                    <th key={m.key} scope="col" className="eyebrow py-3 pr-4 font-medium">
                      {m.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((size) => (
                  <tr key={size} className="border-b border-navy/15">
                    <th scope="row" className="py-3 pr-4 font-medium">
                      {size}
                    </th>
                    {sizeGuide.measurements.map((m) => {
                      const value = sizeGuide.values[size]?.[m.key as "chest" | "length" | "sleeve"];
                      return (
                        <td key={m.key} className={cn("py-3 pr-3 tabular-nums text-navy/85", value === undefined && "text-[0.6875rem] text-stone")}>
                          {value ?? sizeGuide.missingValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 space-y-2 text-sm leading-relaxed">
            <p>
              El modelo mide {sizeGuide.model.height} cm y lleva talla {sizeGuide.model.size}.
            </p>
            <p className="text-stone">{sizeGuide.fitNote}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
