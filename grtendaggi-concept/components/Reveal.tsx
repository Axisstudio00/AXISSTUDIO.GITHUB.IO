'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Osserva gli elementi [data-reveal] e li anima una volta sola all'ingresso.
// Il contenuto è visibile di default; la classe `js` sull'<html> abilita l'animazione.
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          // Visibile, oppure già superato con uno scroll rapido: mostra subito.
          if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const scan = () =>
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}
