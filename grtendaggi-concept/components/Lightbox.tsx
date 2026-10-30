'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { imageSrc, type ImageKey } from '@/content/images';

export type LightboxItem = { image: ImageKey; title: string; caption?: string };

// Visualizzatore a schermo intero: tastiera (Esc, frecce), swipe su touch, focus gestito.
export function Lightbox({ items, index, onClose, onIndex }: { items: LightboxItem[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const open = index !== null;

  const go = useCallback(
    (d: number) => {
      if (index === null) return;
      setLoaded(false);
      onIndex((index + d + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      lastFocus.current?.focus();
    };
  }, [open, go, onClose]);

  if (index === null) return null;
  const item = items[index];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Immagine: ${item.title}`}
      className="fixed inset-0 z-[90] flex flex-col bg-[#17100c] text-paper"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="wrap flex h-16 w-full items-center justify-between">
        <p className="t-small tabular-nums text-paper/80" aria-live="polite">
          {index + 1} di {items.length}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className="-mr-2 flex min-h-11 items-center gap-2 px-2" aria-label="Chiudi">
          Chiudi <X size={20} aria-hidden />
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-[var(--margin)]" onClick={onClose}>
        <img
          key={item.image + index}
          src={imageSrc(item.image, 1600)}
          srcSet={`${imageSrc(item.image, 1024)} 1024w, ${imageSrc(item.image, 1600)} 1600w, ${imageSrc(item.image, 2400)} 2400w`}
          sizes="100vw"
          alt={item.title}
          onLoad={() => setLoaded(true)}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[calc(100svh-10rem)] w-auto max-w-full object-contain transition-opacity duration-500"
          style={{ opacity: loaded ? 1 : 0.2 }}
        />
      </div>
      <div className="wrap flex min-h-20 w-full items-center justify-between gap-4 pb-[env(safe-area-inset-bottom)]">
        <p className="text-[1rem]">
          {item.title}
          {item.caption && <span className="block t-small text-paper/75">{item.caption}</span>}
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => go(-1)} className="grid h-12 w-12 place-items-center bg-paper/10 transition-colors hover:bg-paper/20" aria-label="Immagine precedente">
            <ArrowLeft size={20} aria-hidden />
          </button>
          <button type="button" onClick={() => go(1)} className="grid h-12 w-12 place-items-center bg-paper/10 transition-colors hover:bg-paper/20" aria-label="Immagine successiva">
            <ArrowRight size={20} aria-hidden />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
