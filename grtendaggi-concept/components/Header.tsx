'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Wordmark } from './Wordmark';
import { mainNav } from '@/content/nav';
import { site, whatsappHref } from '@/content/site';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > last.current);
      last.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <>
      <a href="#contenuto" className="sr-only-focusable fixed left-4 top-4 z-[70] bg-ink px-4 py-3 text-paper">
        Vai al contenuto
      </a>
      <header
        className="fixed inset-x-0 top-0 z-[60] bg-bg transition-transform duration-500"
        style={{ transform: hidden && !open ? 'translateY(-100%)' : 'none', transitionTimingFunction: 'var(--ease-out)' }}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" aria-label={`${site.name}, home`} className="relative z-[60]">
            <Wordmark />
          </Link>
          <nav aria-label="Principale" className="hidden items-center gap-9 text-[1rem] lg:flex">
            {mainNav.map((l) => (
              <Link key={l.href} href={l.href} className="link" aria-current={isActive(l.href) ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
            <Link href="/contatti/#preventivo" className="btn btn-primary min-h-11 px-5 text-[1rem]">
              Richiedi un preventivo
            </Link>
          </nav>
          <button
            ref={toggleRef}
            type="button"
            className="relative z-[60] -mr-2 min-h-11 px-2 text-[1rem] lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Chiudi' : 'Menu'}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[55] flex flex-col bg-bg pt-[var(--header-h)] lg:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <nav aria-label="Menu mobile" className="wrap flex w-full flex-1 flex-col justify-center gap-2">
              {[{ href: '/', label: 'Home' }, ...mainNav].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    className="font-display block py-1 text-[clamp(2.4rem,11vw,3.5rem)] leading-[1.1] tracking-[-0.02em]"
                    aria-current={pathname === l.href ? 'page' : undefined}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="wrap grid w-full gap-3 pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              <Link href="/contatti/#preventivo" className="btn btn-primary w-full">
                Richiedi un preventivo
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <a href={site.phones[0].href} className="btn btn-paper">
                  Chiama
                </a>
                <a href={whatsappHref()} className="btn btn-paper" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
