import Image from "next/image";
import { brandContent } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Founders } from "@/components/home/Founders";
import { ScrollWords } from "@/components/ui/ScrollWords";

export function BrandStatement() {
  const { eyebrow, title, paragraphs, principles, image } = brandContent;

  return (
    <section aria-labelledby="marca-title" id="marca" className="container-editorial py-16 md:py-24">
      <SectionHeading eyebrow={eyebrow} id="marca-title" title={<ScrollWords text={title} />} className="max-w-5xl" />

      <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-8">
        <div data-reveal className="relative aspect-[4/5] md:col-span-5 md:col-start-1">
          <Image src={image.url} alt={image.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="photo-mono rounded-media object-cover" />
          {/* Sello tipográfico superpuesto */}
          <span
            aria-hidden="true"
            className="absolute -right-3 -bottom-6 rounded-media bg-white px-3 font-serif text-headline leading-none text-burgundy md:-right-10"
          >
            DJR<sup className="ml-0.5 align-super font-sans text-[0.3em]">®</sup>
          </span>
        </div>

        <div data-reveal-stagger className="flex flex-col justify-between gap-14 md:col-span-6 md:col-start-7">
          <div className="space-y-5 text-base leading-relaxed text-navy/85 md:text-lg">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <ul className="border-t border-navy/15">
            {principles.map((item) => (
              <li key={item.title} className="border-b border-navy/15 py-6">
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-stone">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Founders />
    </section>
  );
}
