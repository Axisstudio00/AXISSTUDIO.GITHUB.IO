'use client';
import { useState } from 'react';
import { Photo } from './Photo';
import { Lightbox } from './Lightbox';
import type { ImageKey } from '@/content/images';
import { site } from '@/content/site';

const SHAPES = ['md:col-span-7 aspect-[4/3]', 'md:col-span-4 md:col-start-9 md:mt-[18vh] aspect-[4/5]', 'md:col-span-5 md:col-start-3 md:-mt-[6vh] aspect-[3/2]'];

export function ProductGallery({ name, images }: { name: string; images: ImageKey[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const items = images.map((image) => ({ image, title: name, caption: site.placeholderImages ? 'Illustrazione provvisoria' : undefined }));
  return (
    <section aria-labelledby="galleria-title" className="section">
      <div className="wrap">
        <h2 id="galleria-title" className="t-head" data-reveal>Galleria</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-12">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setIndex(i)}
              className={`group block text-left ${SHAPES[i % SHAPES.length].replace(/aspect-\S+/, '')}`}
              aria-label={`Apri immagine ${i + 1}: ${name}`}
            >
              <Photo name={img} alt="" sizes="(min-width: 768px) 55vw, 100vw" className={`zoom ${SHAPES[i % SHAPES.length].match(/aspect-\S+/)?.[0]}`} wipe />
            </button>
          ))}
        </div>
      </div>
      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </section>
  );
}
