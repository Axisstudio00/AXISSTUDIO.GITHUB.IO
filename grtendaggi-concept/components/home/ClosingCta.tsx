import Link from 'next/link';
import { Photo } from '../Photo';
import { site, whatsappHref } from '@/content/site';

export function ClosingCta() {
  return (
    <section aria-labelledby="cta-title">
      <div className="grid grid-cols-2 md:grid-cols-3">
        <Photo name="pergola" alt="" sizes="(min-width: 768px) 33vw, 100vw" className="col-span-2 aspect-[4/3] md:col-span-1 md:aspect-auto md:h-[40svh]" />
        <Photo name="tessuti" alt="" sizes="(min-width: 768px) 33vw, 50vw" className="aspect-square md:aspect-auto md:h-[40svh]" />
        <Photo name="chiusure" alt="" sizes="(min-width: 768px) 33vw, 50vw" className="aspect-square md:aspect-auto md:h-[40svh]" />
      </div>
      <div className="bg-ink text-paper">
        <div className="wrap grid min-h-[48svh] gap-10 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-8">
            <h2 id="cta-title" className="t-head" data-reveal>
              Ogni spazio merita
              <br />
              la sua soluzione.
            </h2>
            <p className="mt-8 max-w-[34ch] text-[clamp(1.375rem,1.1rem+0.9vw,1.875rem)] leading-[1.3]" data-reveal style={{ ['--d' as string]: '80ms' }}>
              Raccontaci la stanza o il terrazzo: ti aiutiamo a scegliere e ti prepariamo un preventivo.{' '}
              <Link href="/contatti/#preventivo" className="underline decoration-[4px] underline-offset-[6px] transition-colors hover:text-[#b9d0ae]">
                Richiedi una consulenza
              </Link>
            </p>
          </div>
          <div className="self-end md:col-span-3 md:col-start-10">
            <p className="text-paper/80">Oppure chiama o scrivi</p>
            <ul className="mt-2 space-y-1 text-[1.125rem]">
              {site.phones.map((p) => (
                <li key={p.href}><a href={p.href} className="link">{p.label}</a></li>
              ))}
              <li><a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="link">WhatsApp</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
