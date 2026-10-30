import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { Photo } from '@/components/Photo';
import { JsonLd } from '@/components/JsonLd';
import { ProductGallery } from '@/components/ProductGallery';
import { getCategory, getProduct, products, productsByCategory } from '@/content/products';
import { site, whatsappHref } from '@/content/site';
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return pageMeta({ title: p.seo.title, description: p.seo.description, path: `/soluzioni/${p.slug}/` });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const related = productsByCategory(p.category).filter((x) => x.slug !== p.slug);
  const path = `/soluzioni/${p.slug}/`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Soluzioni', path: '/soluzioni/' },
          { name: p.name, path },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: p.name,
          serviceType: p.name,
          description: p.lead,
          url: `${site.url}${path}`,
          provider: { '@id': `${site.url}/#azienda` },
          areaServed: [{ '@type': 'City', name: 'Bologna' }, { '@type': 'AdministrativeArea', name: 'Emilia-Romagna' }],
        }}
      />
      <PageHead
        title={p.name}
        lead={p.lead}
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Soluzioni', href: '/soluzioni/' },
          { name: p.name, href: path },
        ]}
        image={p.image}
        imageAlt={`${p.name}: illustrazione`}
      />

      <section aria-labelledby="descr-title" className="section">
        <div className="wrap grid gap-12 md:grid-cols-12 md:gap-6">
          <h2 id="descr-title" className="t-head md:col-span-5" data-reveal>{p.headline}</h2>
          <div className="space-y-6 md:col-span-6 md:col-start-7" data-reveal style={{ ['--d' as string]: '80ms' }}>
            {p.body.map((t) => (
              <p key={t.slice(0, 24)} className="max-w-[60ch]">{t}</p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="caratt-title" className="bg-paper section">
        <div className="wrap grid gap-12 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <h2 id="caratt-title" className="t-head" data-reveal>Perché sceglierla</h2>
            <Photo name={p.gallery[1] ?? p.image} alt="" sizes="(min-width: 768px) 40vw, 100vw" className="mt-10 aspect-[4/5]" wipe />
          </div>
          <div className="md:col-span-6 md:col-start-7 md:pt-24">
            <dl className="space-y-10">
              {p.features.map((f, i) => (
                <div key={f.title} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
                  <dt className="font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.05]">{f.title}</dt>
                  <dd className="mt-3 max-w-[48ch] text-muted">{f.text}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-16 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="font-sans text-[1.125rem] font-medium tracking-normal">Dove si usa</h3>
                <ul className="mt-3 space-y-1.5">
                  {p.uses.map((u) => <li key={u}>{u}</li>)}
                </ul>
              </div>
              {p.variants && (
                <div>
                  <h3 className="font-sans text-[1.125rem] font-medium tracking-normal">Varianti</h3>
                  <ul className="mt-3 space-y-1.5">
                    {p.variants.map((v) => <li key={v}>{v}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProductGallery name={p.name} images={p.gallery} />

      <section aria-labelledby="prev-title" className="bg-ink text-paper">
        <div className="wrap grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <h2 id="prev-title" className="t-head md:col-span-7" data-reveal>
            {p.name}: parliamone
          </h2>
          <div className="md:col-span-4 md:col-start-9 md:self-end">
            <p>Raccontaci lo spazio e le tue esigenze: ti richiamiamo per un preventivo senza impegno.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/contatti/?prodotto=${p.slug}#preventivo`} className="btn btn-primary">
                Richiedi un preventivo <ArrowRight size={18} aria-hidden />
              </Link>
              <a href={whatsappHref(`Buongiorno, vorrei informazioni su: ${p.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-paper">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="rel-title" className="section">
          <div className="wrap">
            <h2 id="rel-title" className="text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)]">
              Altre {cat.title.toLowerCase()}
            </h2>
            <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/soluzioni/${r.slug}/`} className="group block">
                    <Photo name={r.image} alt="" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="zoom aspect-[4/3]" />
                    <span className="font-display mt-5 block text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.05] transition-colors group-hover:text-accent">{r.name}</span>
                    <span className="mt-1.5 block text-muted">{r.short}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
