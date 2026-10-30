import type { MetadataRoute } from 'next';
import { products } from '@/content/products';
import { site } from '@/content/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ['/', '/soluzioni/', '/realizzazioni/', '/chi-siamo/', '/contatti/', '/privacy/', '/cookie/'];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, lastModified: now, priority: p === '/' ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${site.url}/soluzioni/${p.slug}/`, lastModified: now, priority: 0.8 })),
  ];
}
