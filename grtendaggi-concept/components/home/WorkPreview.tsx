import Link from 'next/link';
import { Photo } from '../Photo';
import { projects } from '@/content/projects';
import { site } from '@/content/site';

// Coppie sfalsate su fondo libero: un'anteprima delle realizzazioni.
const LAYOUT = [
  'md:col-span-4 md:col-start-1 aspect-[3/4] w-[70%] md:w-auto',
  'md:col-span-6 md:col-start-7 md:mt-[20vh] aspect-[5/4] w-[84%] ml-auto md:ml-0 md:w-auto',
  'md:col-span-6 md:col-start-6 md:mt-[12vh] aspect-[3/2] w-[56%] md:w-auto',
  'md:col-span-3 md:col-start-2 md:mt-[16vh] aspect-[4/5] w-full md:w-auto md:order-none',
];

export function WorkPreview() {
  const items = projects.slice(0, 4);
  return (
    <section aria-labelledby="lavori-title" className="section">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="lavori-title" className="t-head" data-reveal>Realizzazioni</h2>
          <Link href="/realizzazioni/" className="link-strong" data-reveal>Vedi tutti i lavori</Link>
        </div>
        <div className="mt-16 grid gap-16 md:grid-cols-12 md:gap-x-6 md:gap-y-0">
          {items.map((p, i) => (
            <figure key={p.id} className={LAYOUT[i].replace(/aspect-\S+/, '')}>
              <Link href={`/realizzazioni/#${p.id}`} className="group block">
                <Photo
                  name={p.image}
                  alt={p.title}
                  sizes="(min-width: 768px) 50vw, 84vw"
                  wipe
                  className={`zoom ${LAYOUT[i].match(/aspect-\S+/)?.[0] ?? ''}`}
                />
              </Link>
              <figcaption className="t-small mt-2.5 text-muted">
                {p.title}
                {site.placeholderImages ? ' · illustrazione' : p.place ? ` · ${p.place}` : ''}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
