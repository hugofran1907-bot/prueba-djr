import { isPlaceholder, reviews, social } from "@/config/store";
import { SectionHeading } from "@/components/ui/SectionHeading";

function Stars({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <p className="text-burgundy" aria-label={`${value} de 5 estrellas`}>
      <span aria-hidden="true">{"★".repeat(value)}{"☆".repeat(5 - value)}</span>
    </p>
  );
}

/**
 * Reseñas. Lee config/store.ts → reviews (solo reseñas reales).
 * Si no hay ninguna, muestra «Síguenos en Instagram» en su lugar.
 */
export function Reviews() {
  const instagram = social.instagram;
  const instagramReady = !isPlaceholder(instagram.url);

  if (reviews.length === 0) {
    return (
      <section aria-labelledby="reviews-title" className="bg-night text-navy">
        <div data-reveal-stagger className="container-editorial flex flex-col gap-10 py-24 md:flex-row md:items-end md:justify-between md:py-32">
          <div>
            <h2 id="reviews-title" className="font-serif text-headline text-balance">
              Síguenos en Instagram.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-navy/80">
              Lanzamientos, estudio y calle. Así se lleva DJR®.
            </p>
          </div>
          {instagramReady ? (
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-3 self-start rounded-full border border-navy/70 px-6 text-[0.75rem] font-medium tracking-[0.08em] uppercase transition-colors hover:bg-navy hover:text-night md:self-auto"
            >
              @{instagram.handle.replace(/^@/, "")}
              <span className="sr-only"> en Instagram (se abre en una pestaña nueva)</span>
            </a>
          ) : (
            <p className="eyebrow self-start rounded-full border border-navy/40 px-5 py-3 md:self-auto">@{instagram.handle}</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="reviews-title" className="container-editorial py-16 md:py-24">
      <SectionHeading eyebrow="Reseñas" id="reviews-title" title="Lo que dicen de DJR®." />
      <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <li key={i} className="flex flex-col border border-navy/15 p-6 md:p-8">
            {typeof review.rating === "number" && <Stars rating={review.rating} />}
            <blockquote className="mt-4 flex-1 font-serif text-2xl leading-snug">«{review.text}»</blockquote>
            <p className="mt-6 text-sm font-medium">{review.author}</p>
            {(review.product || review.date) && (
              <p className="mt-1 text-xs text-stone">{[review.product, review.date].filter(Boolean).join(" · ")}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
