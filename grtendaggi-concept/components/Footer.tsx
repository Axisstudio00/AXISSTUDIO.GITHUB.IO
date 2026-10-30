import Link from 'next/link';
import { Wordmark } from './Wordmark';
import { CookiePrefsButton } from './CookieConsent';
import { categories } from '@/content/products';
import { mainNav } from '@/content/nav';
import { mapsHref, site, whatsappHref } from '@/content/site';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-field pb-24 text-white md:pb-0">
      <div className="wrap flex min-h-[90svh] flex-col pt-10">
        <div className="grid gap-10 text-[1rem] md:grid-cols-12">
          <div className="md:col-span-4">
            <Wordmark />
            <p className="mt-5 max-w-[34ch] leading-relaxed text-white/90">
              Tende, schermature solari e chiusure su misura. Consulenza, realizzazione, installazione e
              manutenzione a Bologna e in tutte le province dell’Emilia-Romagna.
            </p>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-sans text-[1rem] font-medium tracking-normal">Sito</h2>
            <ul className="mt-3 space-y-2 text-white/90">
              {mainNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <h2 className="font-sans text-[1rem] font-medium tracking-normal">Soluzioni</h2>
            <ul className="mt-3 space-y-2 text-white/90">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/soluzioni/#${c.id}`} className="link">{c.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <h2 className="font-sans text-[1rem] font-medium tracking-normal">Dove siamo</h2>
            <address className="mt-3 not-italic leading-relaxed text-white/90">
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="link">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city} ({site.address.province})
              </a>
              <br />
              <a href={`mailto:${site.email}`} className="link break-all">{site.email}</a>
              <br />
              <a href={site.phones[1].href} className="link">{site.phones[1].label}</a>
              {' · '}
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="link">WhatsApp</a>
            </address>
            {site.social.length > 0 && (
              <ul className="mt-3 flex gap-4">
                {site.social.map((s) => (
                  <li key={s.href}><a href={s.href} className="link" target="_blank" rel="noopener noreferrer">{s.label}</a></li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-auto pt-24">
          <p className="t-small text-white/85">Chiamaci</p>
          <a
            href={site.phones[0].href}
            className="font-display block whitespace-nowrap leading-[0.9] tracking-[-0.03em] transition-opacity hover:opacity-80"
            style={{ fontSize: 'clamp(3.2rem, 13.2vw, 15rem)' }}
          >
            {site.phones[0].label}
          </a>
        </div>

        <div className="mt-10 flex flex-col gap-3 pb-8 t-small text-white/85 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link href="/privacy/" className="link">Privacy policy</Link></li>
            <li><Link href="/cookie/" className="link">Cookie policy</Link></li>
            <li><CookiePrefsButton className="link" /></li>
          </ul>
          <p>
            {site.legalName ?? site.name}
            {site.vatNumber ? ` · P.IVA ${site.vatNumber}` : ''}
          </p>
          <p>San Lazzaro di Savena, {year}</p>
        </div>
      </div>
    </footer>
  );
}
