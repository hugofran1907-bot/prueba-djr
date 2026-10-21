"use client";

import NextImage from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Image, Video } from "@/lib/types";
import { cn } from "@/lib/utils";

type Media = { type: "image"; image: Image } | { type: "video"; video: Video };

const SIZES = "(min-width: 1024px) 55vw, 100vw";

function LoopVideo({ video, label }: { video: Video; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  // Con movimiento reducido no hay reproducción automática: se muestran controles.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(mq.matches);
      if (mq.matches) ref.current?.pause();
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      autoPlay={!reduced}
      muted
      loop
      playsInline
      controls={reduced}
      preload="metadata"
      poster={video.poster?.url}
      aria-label={label}
    >
      <source src={video.url} type={video.mimeType} />
    </video>
  );
}

/** Imagen principal con zoom que sigue al ratón (solo dispositivos con hover). */
function ZoomImage({ image, priority }: { image: Image; priority: boolean }) {
  const [origin, setOrigin] = useState<string | null>(null);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden [@media(hover:hover)]:cursor-zoom-in"
      onMouseMove={handleMove}
      onMouseLeave={() => setOrigin(null)}
    >
      <NextImage
        src={image.url}
        alt={image.altText}
        fill
        priority={priority}
        sizes={SIZES}
        style={origin ? { transformOrigin: origin } : undefined}
        className={cn(
          "object-cover transition-transform duration-300 ease-out",
          origin && "[@media(hover:hover)]:scale-[2]",
        )}
      />
    </div>
  );
}

export function ProductGallery({ images, video, title }: { images: Image[]; video: Video | null; title: string }) {
  const media: Media[] = images.map((image) => ({ type: "image", image }));
  if (video) media.splice(Math.min(1, media.length), 0, { type: "video", video });

  const [active, setActive] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const multiple = media.length > 1;

  if (media.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center bg-cream-deep font-serif text-6xl text-navy/20" aria-hidden="true">
        DJR®
      </div>
    );
  }

  const videoLabel = `Vídeo de ${title}`;

  function scrollToSlide(i: number) {
    const slider = sliderRef.current;
    if (slider) slider.scrollTo({ left: i * slider.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      {/* Móvil y tablet: slider deslizable */}
      <div className="lg:hidden">
        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
          aria-roledescription={multiple ? "carrusel" : undefined}
          aria-label={multiple ? `Imágenes de ${title}` : undefined}
        >
          {media.map((m, i) => (
            <div
              key={i}
              className="relative aspect-[4/5] w-full shrink-0 snap-center bg-cream-deep"
              role={multiple ? "group" : undefined}
              aria-roledescription={multiple ? "diapositiva" : undefined}
              aria-label={multiple ? `${i + 1} de ${media.length}` : undefined}
            >
              {m.type === "image" ? (
                <NextImage src={m.image.url} alt={m.image.altText} fill priority={i === 0} sizes={SIZES} className="object-cover" />
              ) : (
                <LoopVideo video={m.video} label={videoLabel} />
              )}
            </div>
          ))}
        </div>

        {multiple && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1">
              {media.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToSlide(i)}
                  aria-label={`Ver imagen ${i + 1} de ${media.length}`}
                  aria-current={i === active ? "true" : undefined}
                  className="flex h-11 items-center px-1"
                >
                  <span className={cn("block h-px w-6 bg-navy transition-opacity", i === active ? "opacity-100" : "opacity-25")} />
                </button>
              ))}
            </div>
            <p className="text-xs text-stone tabular-nums" aria-hidden="true">
              {active + 1} / {media.length}
            </p>
          </div>
        )}
      </div>

      {/* Escritorio: miniaturas + imagen principal con zoom */}
      <div className={cn("hidden gap-4 lg:grid", multiple ? "grid-cols-[4.5rem_1fr]" : "grid-cols-1")}>
        {multiple && (
          <ul className="flex flex-col gap-3" aria-label="Miniaturas">
            {media.map((m, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={m.type === "image" ? `Ver imagen ${i + 1}: ${m.image.altText}` : `Ver ${videoLabel.toLowerCase()}`}
                  aria-current={i === active ? "true" : undefined}
                  className={cn(
                    "relative block aspect-[4/5] w-full overflow-hidden bg-cream-deep outline-offset-2 transition-opacity",
                    i === active ? "ring-1 ring-navy" : "opacity-60 hover:opacity-100",
                  )}
                >
                  {m.type === "image" ? (
                    <NextImage src={m.image.url} alt="" fill sizes="72px" className="object-cover" />
                  ) : (
                    <span className="flex size-full items-center justify-center bg-cream-deep text-navy">
                      <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3" fill="currentColor">
                        <path d="M3 1.5l7 4.5-7 4.5z" />
                      </svg>
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="relative aspect-[4/5] bg-cream-deep">
          {(() => {
            const m = media[Math.min(active, media.length - 1)];
            return m.type === "image" ? (
              <ZoomImage key={m.image.url} image={m.image} priority={active === 0} />
            ) : (
              <LoopVideo video={m.video} label={videoLabel} />
            );
          })()}
        </div>
      </div>
    </div>
  );
}
