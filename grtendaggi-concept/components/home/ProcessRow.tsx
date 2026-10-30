'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Photo } from '../Photo';
import { process } from '@/content/process';
import type { ImageKey } from '@/content/images';

const SPACES = ['md:mt-24', 'md:mt-36', 'md:mt-20', 'md:mt-32', 'md:mt-28'];
const SPACES_SM = ['mt-8', 'mt-14', 'mt-10', 'mt-16', 'mt-12'];

// Il metodo in cinque momenti, da scorrere col dito o con i pulsanti.
export function ProcessRow() {
  const rowRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 1);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const move = (dir: 1 | -1) => {
    const el = rowRef.current;
    if (!el) return;
    const item = el.querySelector('li');
    el.scrollBy({ left: dir * ((item?.clientWidth ?? 300) + 32), behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="metodo-title" className="section overflow-hidden">
      <div className="wrap">
        <div className="flex items-end justify-between gap-6">
          <h2 id="metodo-title" className="t-head" data-reveal>
            Come lavoriamo
          </h2>
          <div className="hidden gap-2 md:flex">
            <button type="button" onClick={() => move(-1)} aria-label="Momento precedente" className="grid h-12 w-12 place-items-center bg-ink text-paper transition-colors hover:bg-accent disabled:opacity-40" disabled={progress <= 0.01}>
              <ArrowLeft size={20} aria-hidden />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Momento successivo" className="grid h-12 w-12 place-items-center bg-ink text-paper transition-colors hover:bg-accent disabled:opacity-40" disabled={progress >= 0.99}>
              <ArrowRight size={20} aria-hidden />
            </button>
          </div>
        </div>
        <div className="mt-8 h-1.5 bg-surface" aria-hidden>
          <div className="h-full origin-left bg-ink transition-transform duration-300" style={{ transform: `scaleX(${Math.max(0.12, progress)})` }} />
        </div>
      </div>

      <ol
        ref={rowRef}
        className="scrollbar-none mt-12 flex snap-x snap-mandatory scroll-px-[var(--margin)] gap-4 overflow-x-auto px-[var(--margin)] pb-4 md:gap-8"
        tabIndex={0}
        aria-label="Fasi del lavoro"
      >
        {process.map((step, i) => (
          <li key={step.title} className="w-[72vw] shrink-0 snap-start sm:w-[300px] md:w-[340px]">
            <h3 className="font-sans text-[1.125rem] font-medium tracking-normal">
              {['Prima', 'Poi', 'Su misura', 'In opera', 'Nel tempo'][i]}: {step.title.toLowerCase()}
            </h3>
            <p className="mt-2 text-[1rem] leading-relaxed text-muted">{step.text}</p>
            <Photo name={step.image as ImageKey} alt="" sizes="340px" className={`aspect-[4/5] ${SPACES_SM[i]} ${SPACES[i]}`} />
          </li>
        ))}
      </ol>
    </section>
  );
}
