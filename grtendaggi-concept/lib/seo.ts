import type { Metadata } from 'next';
import { site } from '@/content/site';

type MetaInput = { title: string; description: string; path: string; image?: string };

export function pageMeta({ title, description, path, image = '/og-image.jpg' }: MetaInput): Metadata {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      url,
      siteName: site.name,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

// Dati strutturati LocalBusiness: solo campi verificati. Orari, P.IVA, geo e social si aggiungono
// automaticamente quando vengono valorizzati in content/site.ts.
export function localBusinessJsonLd() {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${site.url}/#azienda`,
    name: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/og-image.jpg`,
    email: site.email,
    telephone: site.phones.map((p) => p.e164),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.province,
      addressCountry: site.address.country,
    },
    areaServed: [
      { '@type': 'City', name: 'Bologna' },
      { '@type': 'AdministrativeArea', name: 'Emilia-Romagna' },
    ],
  };
  if (site.geo) data.geo = { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng };
  if (site.vatNumber) data.vatID = site.vatNumber;
  if (site.legalName) data.legalName = site.legalName;
  if (site.social.length) data.sameAs = site.social.map((s) => s.href);
  return data;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}
