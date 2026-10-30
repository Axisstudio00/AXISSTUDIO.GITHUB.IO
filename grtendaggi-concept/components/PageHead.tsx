import Link from 'next/link';
import { Photo } from './Photo';
import type { ImageKey } from '@/content/images';

type Crumb = { name: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Percorso" className="t-small text-muted">
      <ol className="flex flex-wrap gap-x-2">
        {items.map((c, i) => (
          <li key={c.href} className="flex gap-2">
            {i < items.length - 1 ? (
              <>
                <Link href={c.href} className="link">{c.name}</Link>
                <span aria-hidden>/</span>
              </>
            ) : (
              <span aria-current="page">{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Apertura delle pagine interne: titolo grande, frase, immagine ampia sotto.
export function PageHead({
  title,
  lead,
  crumbs,
  image,
  imageAlt = '',
  children,
}: {
  title: React.ReactNode;
  lead?: string;
  crumbs?: Crumb[];
  image?: ImageKey;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
      <div className="wrap">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className="mt-8 grid gap-8 md:grid-cols-12 md:gap-6">
          <h1 className="text-[clamp(2.75rem,1.2rem+5.4vw,7rem)] md:col-span-8">{title}</h1>
          {lead && (
            <p className="t-lead self-end md:col-span-4">{lead}</p>
          )}
        </div>
        {children}
      </div>
      {image && (
        <Photo name={image} alt={imageAlt} priority sizes="100vw" className="mt-14 aspect-[4/3] md:mt-20 md:aspect-[21/9]" />
      )}
    </header>
  );
}
