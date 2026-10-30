import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Breadcrumbs } from '@/components/PageHead';
import { Photo } from '@/components/Photo';
import { QuoteForm } from '@/components/QuoteForm';
import { MapEmbed } from '@/components/MapEmbed';
import { JsonLd } from '@/components/JsonLd';
import { mapsHref, site, whatsappHref } from '@/content/site';
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Contatti e preventivo — tende su misura a Bologna',
  description:
    'Contatta GRtendaggi Concept, Via Emilia 134, San Lazzaro di Savena (BO): telefono, WhatsApp, email e modulo per richiedere un preventivo.',
  path: '/contatti/',
});

export default function Contatti() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Contatti', path: '/contatti/' }])} />
      <section aria-labelledby="contatti-title" className="relative">
        <Photo name="chiusure" alt="Finestra con persiane verdi su una facciata color ocra" priority sizes="100vw" className="h-[70svh] md:h-[100svh]" />
        <div className="wrap relative -mt-20 md:absolute md:inset-0 md:mt-0 md:flex md:items-start md:justify-end md:pt-[calc(var(--header-h)+3rem)]">
          <div className="bg-paper p-7 md:w-[26rem] md:p-8">
            <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Contatti', href: '/contatti/' }]} />
            <h1 id="contatti-title" className="mt-5 t-head">Contatti</h1>
            <address className="mt-6 space-y-4 not-italic">
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="flex gap-3">
                <MapPin size={20} aria-hidden className="mt-1 shrink-0 text-accent" />
                <span className="link">
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city} ({site.address.province})
                </span>
              </a>
              {site.phones.map((p) => (
                <a key={p.href} href={p.href} className="flex gap-3">
                  <Phone size={20} aria-hidden className="mt-1 shrink-0 text-accent" />
                  <span className="link tabular-nums">{p.label}</span>
                </a>
              ))}
              <a href={`mailto:${site.email}`} className="flex gap-3">
                <Mail size={20} aria-hidden className="mt-1 shrink-0 text-accent" />
                <span className="link break-all">{site.email}</span>
              </a>
            </address>
            {site.openingHours && (
              <dl className="mt-6 space-y-1">
                {site.openingHours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4">
                    <dt>{h.days}</dt>
                    <dd className="tabular-nums">{h.hours}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-8 grid grid-cols-2 gap-2">
              <a href={site.phones[0].href} className="btn btn-ink">Chiama</a>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <MessageCircle size={18} aria-hidden /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="preventivo" aria-labelledby="prev-title" className="section">
        <div className="wrap grid gap-12 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-4">
            <h2 id="prev-title" className="t-head" data-reveal>
              Richiedi un
              <br />
              preventivo
            </h2>
            <p className="mt-6 max-w-[34ch]" data-reveal style={{ ['--d' as string]: '80ms' }}>
              Raccontaci che cosa ti serve e dove: ti ricontattiamo per approfondire e, se utile, per fissare un
              sopralluogo.
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <QuoteForm />
          </div>
        </div>
      </section>

      <section aria-labelledby="mappa-title" className="pb-[var(--section)]">
        <div className="wrap grid gap-8 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-4">
            <h2 id="mappa-title" className="text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)]">Dove siamo</h2>
            <p className="mt-4 max-w-[32ch]">
              Sulla Via Emilia, a San Lazzaro di Savena, alle porte di Bologna.
            </p>
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="link-strong mt-6 inline-block">
              Indicazioni stradali
            </a>
          </div>
          <div className="md:col-span-8">
            <MapEmbed />
          </div>
        </div>
      </section>
    </>
  );
}
