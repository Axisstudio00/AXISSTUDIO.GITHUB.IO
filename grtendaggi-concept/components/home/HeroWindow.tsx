'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Photo } from '../Photo';

type Box = { t: number; r: number; b: number; l: number };

// Calcola l'apertura iniziale della "finestra": ritratto 4:5 centrato (desktop) o
// largo 78vw con il bordo superiore al 30% dell'altezza (smartphone).
function measure(): Box {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw < 768) {
    const w = vw * 0.78;
    const h = Math.min(w * 1.25, vh * 0.42);
    const t = vh * 0.3;
    return { t, b: Math.max(0, vh - t - h), l: (vw - w) / 2, r: (vw - w) / 2 };
  }
  const h = Math.min(vh - 252, vw * 0.36 * 1.25);
  const w = h * 0.8;
  const t = (vh - h) / 2 + 20;
  return { t, b: vh - t - h, l: (vw - w) / 2, r: (vw - w) / 2 };
}

export function HeroWindow() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [box, setBox] = useState<Box | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useEffect(() => {
    const update = () => setBox(measure());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const open = useTransform(scrollYProgress, [0, 0.72], [0, 1], { clamp: true });
  const clip = useTransform(open, (e) => {
    if (!box) return 'inset(0px)';
    const k = 1 - e;
    return `inset(${box.t * k}px ${box.r * k}px ${box.b * k}px ${box.l * k}px)`;
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.28], [0, -48]);

  const statik = reduce === true;

  return (
    <section ref={ref} aria-labelledby="hero-title" className={statik ? 'relative' : 'relative h-[230svh]'}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={statik ? undefined : { clipPath: box ? clip : undefined, visibility: box ? 'visible' : 'hidden' }}
        >
          <motion.div className="h-full w-full" style={statik ? undefined : { scale }}>
            <Photo
              name="hero"
              priority
              sizes="100vw"
              alt="Soggiorno con tende in lino davanti a una finestra luminosa, luce sul pavimento in legno"
              className="h-full w-full"
            />
          </motion.div>
          {statik && <div className="absolute inset-x-0 bottom-0 h-1/2 bg-ink/45" aria-hidden />}
        </motion.div>

        {/* Prima dell'idratazione: apertura statica centrata, nessun salto visivo */}
        {!box && !statik && (
          <div aria-hidden className="absolute left-1/2 top-[30%] w-[78vw] -translate-x-1/2 md:top-1/2 md:w-[min(36vw,calc((100svh-252px)*0.8))] md:-translate-y-[calc(50%-20px)]">
            <Photo name="hero" priority alt="" sizes="40vw" className="aspect-[4/5] w-full" />
          </div>
        )}

        <motion.div
          className={`wrap pointer-events-none absolute inset-0 ${statik ? 'text-paper' : ''}`}
          style={statik ? undefined : { opacity: textOpacity, y: textY }}
        >
          <div className="relative h-full">
            <h1
              id="hero-title"
              className={
                statik
                  ? 'absolute bottom-[22svh] left-0 text-[clamp(2.75rem,10vw,5rem)]'
                  : 'absolute left-0 top-[calc(var(--header-h)+5svh)] text-[clamp(2.75rem,11vw,4rem)] md:top-auto md:bottom-[calc(50svh-min(22.5vw,(100svh-252px)*0.5)-20px)] md:text-[clamp(2.75rem,4.4vw,4.5rem)]'
              }
            >
              La luce,
              <br />
              su misura.
              <span className="sr-only"> Tende e schermature solari a Bologna — GRtendaggi Concept</span>
            </h1>

            <div
              className={
                statik
                  ? 'pointer-events-auto absolute bottom-[6svh] left-0 max-w-[30ch]'
                  : 'pointer-events-auto absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5rem)] md:inset-x-auto md:bottom-[calc(50svh-min(22.5vw,(100svh-252px)*0.5)-20px)] md:right-0 md:max-w-[19rem]'
              }
            >
              <p className="text-[1rem] leading-snug md:text-[1.125rem]">
                Tende, schermature solari e chiusure su misura per case e attività a Bologna e in Emilia-Romagna.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href="/soluzioni/" className="btn btn-primary w-full md:w-auto">
                  Scopri le soluzioni <ArrowRight size={18} aria-hidden />
                </Link>
                <Link href="/contatti/#preventivo" className="link-strong hidden text-[1rem] md:inline">
                  Richiedi un preventivo
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
