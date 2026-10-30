import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { Photo } from '@/components/Photo';
import { JsonLd } from '@/components/JsonLd';
import { categories, productsByCategory } from '@/content/products';
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Soluzioni: tende, schermature e chiusure a Bologna',
  description:
    'Tutte le soluzioni GRtendaggi Concept: tende da interno e da sole, veneziane, tende a rullo e tecniche, pergotende, bioclimatiche, tapparelle, zanzariere, infissi, tappezzeria.',
  path: '/soluzioni/',
});

export default function Soluzioni() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Soluzioni', path: '/soluzioni/' }])} />
      <PageHead
        title={<>Soluzioni</>}
        lead="Quindici sistemi per interni ed esterni, in cinque famiglie. Ognuno è realizzato e installato su misura."
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Soluzioni', href: '/soluzioni/' }]}
      >
        <nav aria-label="Famiglie di soluzioni" className="mt-12 flex flex-wrap gap-2">
          {categories.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="bg-surface px-4 py-2.5 text-[1rem] transition-colors hover:bg-ink hover:text-paper">
              {c.title}
            </a>
          ))}
        </nav>
      </PageHead>

      {categories.map((c, ci) => (
        <section key={c.id} id={c.id} aria-labelledby={`${c.id}-title`} className={`section ${ci % 2 ? 'bg-paper' : ''}`}>
          <div className="wrap grid gap-12 md:grid-cols-12 md:gap-6">
            <div className={`md:col-span-5 ${ci % 2 ? 'md:order-2 md:col-start-8' : ''}`}>
              <div className="md:sticky md:top-28">
                <h2 id={`${c.id}-title`} className="t-head" data-reveal>{c.title}</h2>
                <p className="t-lead mt-6 max-w-[30ch]" data-reveal style={{ ['--d' as string]: '80ms' }}>{c.intro}</p>
                <Photo name={c.image} alt="" sizes="(min-width: 768px) 40vw, 100vw" className="mt-10 aspect-[4/3]" wipe />
              </div>
            </div>
            <ul className={`md:col-span-6 ${ci % 2 ? 'md:order-1 md:col-start-1' : 'md:col-start-7'}`}>
              {productsByCategory(c.id).map((p) => (
                <li key={p.slug} data-reveal>
                  <Link href={`/soluzioni/${p.slug}/`} className="group grid grid-cols-[1fr_auto] items-center gap-6 py-6 md:grid-cols-[9rem_1fr_auto]">
                    <Photo name={p.image} alt="" sizes="144px" className="zoom col-span-2 aspect-[16/10] md:col-span-1 md:aspect-[4/3]" />
                    <span>
                      <span className="font-display block text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.05] transition-colors group-hover:text-accent">
                        {p.name}
                      </span>
                      <span className="mt-2 block text-muted">{p.short}</span>
                    </span>
                    <ArrowRight aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </>
  );
}
