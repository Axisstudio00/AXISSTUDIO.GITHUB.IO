import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Photo } from '../Photo';
import { categories, productsByCategory, type Category } from '@/content/products';

function ProductList({ cat }: { cat: Category }) {
  return (
    <ul className="mt-6 space-y-1">
      {productsByCategory(cat.id).map((p) => (
        <li key={p.slug}>
          <Link href={`/soluzioni/${p.slug}/`} className="group/item flex items-baseline justify-between gap-4 py-2">
            <span className="link text-[1.125rem]">{p.name}</span>
            <ArrowRight size={16} aria-hidden className="shrink-0 opacity-50 transition-transform duration-500 group-hover/item:translate-x-1 group-hover/item:opacity-100" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function CatText({ cat, className = '' }: { cat: Category; className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)]" data-reveal>
        <Link href={`/soluzioni/#${cat.id}`} className="hover:text-accent transition-colors">{cat.title}</Link>
      </h3>
      <p className="mt-4 max-w-[36ch] text-muted" data-reveal style={{ ['--d' as string]: '80ms' }}>{cat.intro}</p>
      <div data-reveal style={{ ['--d' as string]: '160ms' }}>
        <ProductList cat={cat} />
      </div>
    </div>
  );
}

// Indice delle soluzioni: cinque macro-categorie in composizioni diverse, ogni prodotto raggiungibile.
export function SolutionsIndex() {
  const [interni, esterni, protezioni, chiusure, servizi] = categories;
  return (
    <section aria-labelledby="soluzioni-title" className="section">
      <div className="wrap">
        <div className="grid gap-6 md:grid-cols-12">
          <h2 id="soluzioni-title" className="t-head md:col-span-8 lg:col-span-6" data-reveal>
            Cinque modi
            <br />
            di vestire la luce
          </h2>
          <p className="t-lead self-end md:col-span-8 lg:col-span-5 lg:col-start-8" data-reveal style={{ ['--d' as string]: '80ms' }}>
            Quindici soluzioni per interni ed esterni, dalla tenda in lino alla pergola bioclimatica.
          </p>
        </div>

        {/* Interni: immagine grande a sinistra */}
        <div className="mt-20 grid gap-10 md:mt-28 md:grid-cols-12 md:gap-6">
          <Link href="/soluzioni/#interni" className="group md:col-span-7" aria-label={interni.title} tabIndex={-1}>
            <Photo name={interni.image} alt="Tende in lino controluce" sizes="(min-width: 768px) 58vw, 100vw" className="zoom aspect-[4/3]" />
          </Link>
          <CatText cat={interni} className="md:col-span-4 md:col-start-9 md:self-end" />
        </div>

        {/* Esterni: testo a sinistra, immagine panoramica a destra */}
        <div className="mt-28 grid gap-10 md:mt-44 md:grid-cols-12 md:gap-6">
          <CatText cat={esterni} className="order-2 md:order-1 md:col-span-4" />
          <Link href="/soluzioni/#esterni" className="group order-1 md:order-2 md:col-span-7 md:col-start-6" aria-label={esterni.title} tabIndex={-1}>
            <Photo name={esterni.image} alt="Facciata con tenda da sole a righe sopra il portico" sizes="(min-width: 768px) 58vw, 100vw" className="zoom aspect-[16/10]" />
          </Link>
        </div>

        {/* Protezioni e chiusure: coppia sfalsata */}
        <div className="mt-28 grid gap-20 md:mt-44 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <Link href="/soluzioni/#protezioni" className="group block" aria-label={protezioni.title} tabIndex={-1}>
              <Photo name={protezioni.image} alt="Tapparella abbassata a metà su una finestra" sizes="(min-width: 768px) 40vw, 100vw" className="zoom aspect-[4/5]" />
            </Link>
            <CatText cat={protezioni} className="mt-8" />
          </div>
          <div className="md:col-span-6 md:col-start-7 md:pt-[28vh]">
            <Link href="/soluzioni/#chiusure" className="group block" aria-label={chiusure.title} tabIndex={-1}>
              <Photo name={chiusure.image} alt="Finestra con persiane verdi su parete color ocra" sizes="(min-width: 768px) 48vw, 100vw" className="zoom aspect-[5/4]" />
            </Link>
            <CatText cat={chiusure} className="mt-8" />
          </div>
        </div>
      </div>

      {/* Tappezzeria e servizi: immagine a tutta larghezza con pannello */}
      <div className="relative mt-28 md:mt-44">
        <Photo name={servizi.image} alt="Tessuto steso con metro da sarto" sizes="100vw" className="aspect-[4/3] lg:aspect-[21/9]" />
        <div className="wrap lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-end">
          <div className="relative -mt-16 bg-paper p-7 md:ml-auto md:w-[30rem] md:p-10 lg:mt-0">
            <CatText cat={servizi} />
          </div>
        </div>
      </div>
    </section>
  );
}
