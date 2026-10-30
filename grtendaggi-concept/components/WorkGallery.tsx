'use client';
import { useMemo, useState } from 'react';
import { Photo } from './Photo';
import { Lightbox } from './Lightbox';
import { projects } from '@/content/projects';
import { categories, type CategoryId } from '@/content/products';
import { site } from '@/content/site';

const RATIO = { portrait: 'aspect-[4/5]', landscape: 'aspect-[3/2]', square: 'aspect-square' } as const;

export function WorkGallery() {
  const [filter, setFilter] = useState<CategoryId | 'tutti'>('tutti');
  const [index, setIndex] = useState<number | null>(null);
  const available = categories.filter((c) => projects.some((p) => p.category === c.id));
  const list = useMemo(() => (filter === 'tutti' ? projects : projects.filter((p) => p.category === filter)), [filter]);
  const items = list.map((p) => ({
    image: p.image,
    title: p.title,
    caption: [categories.find((c) => c.id === p.category)?.title, p.place, site.placeholderImages ? 'illustrazione' : undefined].filter(Boolean).join(' · '),
  }));

  return (
    <section aria-label="Galleria lavori" className="section pt-14 md:pt-20">
      <div className="wrap">
        <div role="group" aria-label="Filtra per categoria" className="scrollbar-none -mx-[var(--margin)] flex gap-2 overflow-x-auto px-[var(--margin)]">
          {[{ id: 'tutti' as const, title: 'Tutti' }, ...available].map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
              className={`shrink-0 px-4 py-2.5 text-[1rem] transition-colors ${filter === c.id ? 'bg-ink text-paper' : 'bg-surface hover:bg-sand'}`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <ul className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3" aria-live="polite">
          {list.map((p, i) => (
            <li key={p.id} id={p.id} className="mb-10 break-inside-avoid">
              <button type="button" onClick={() => setIndex(i)} className="group block w-full text-left" aria-label={`Apri a tutto schermo: ${p.title}`}>
                <Photo name={p.image} alt={p.title} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw" className={`zoom ${RATIO[p.ratio]}`} />
                <span className="mt-3 block text-[1rem]">{p.title}</span>
                <span className="t-small block text-muted">{items[i].caption}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </section>
  );
}
