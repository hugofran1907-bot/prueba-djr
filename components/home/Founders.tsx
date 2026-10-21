import Image from "next/image";
import { founders } from "@/config/store";

/**
 * Bloque de fundadores dentro de «La marca». Datos en config/store.ts.
 * Solo aparecen las personas con foto: un recuadro vacío resta más confianza que no mostrar nada.
 */
export function Founders() {
  const people = founders.filter((person) => person.photo);
  if (people.length === 0) return null;

  return (
    <div className="mt-24 md:mt-32">
      <h3 className="eyebrow text-stone">
        Quién está detrás
      </h3>
      <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {people.map((person, i) => (
          <li key={i}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-media bg-cream-deep">
              {person.photo && (
                <Image src={person.photo.url} alt={person.photo.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="photo-mono object-cover" />
              )}
            </div>
            <p className="mt-5 font-serif text-2xl md:text-3xl">{person.name}</p>
            <p className="eyebrow mt-2 text-stone">{person.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
