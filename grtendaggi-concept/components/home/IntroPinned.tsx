import Link from 'next/link';
import { Photo } from '../Photo';

// Frase fissata al centro mentre tre immagini scorrono dietro il suo piano.
export function IntroPinned() {
  return (
    <section aria-labelledby="intro-title" className="relative h-[200svh]">
      <div className="sticky top-0 z-20 flex h-[100svh] items-center justify-center">
        <div className="wrap w-full">
          <div className="mx-auto bg-paper px-6 py-10 md:w-[62vw] md:px-16 md:py-16" data-reveal>
            <h2 id="intro-title" className="t-head">
              Prima la stanza,
              <br />
              poi la tenda.
            </h2>
            <p className="mt-6 max-w-[34ch] text-[clamp(1.375rem,1.1rem+0.9vw,1.875rem)] leading-[1.25]">
              Partiamo da come vivi lo spazio: la luce, la vista, la privacy. Poi scegliamo, misuriamo e
              installiamo.
            </p>
            <Link href="/chi-siamo/" className="link-strong mt-8 inline-block">
              Il nostro metodo
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-10" aria-hidden>
        <Photo
          name="interni"
          alt=""
          sizes="(min-width: 768px) 24vw, 64vw"
          className="absolute left-[var(--margin)] top-[40svh] aspect-[4/5] w-[64vw] md:left-[6vw] md:top-[30svh] md:w-[24vw]"
        />
        <Photo
          name="campionario"
          alt=""
          sizes="(min-width: 768px) 38vw, 78vw"
          className="absolute right-[var(--margin)] top-[110svh] aspect-[16/10] w-[78vw] md:top-[100svh] md:w-[38vw]"
        />
        <Photo
          name="veneziane"
          alt=""
          sizes="(min-width: 768px) 18vw, 52vw"
          className="absolute left-[var(--margin)] top-[175svh] aspect-square w-[52vw] md:left-[30vw] md:top-[170svh] md:w-[18vw]"
        />
      </div>
    </section>
  );
}
