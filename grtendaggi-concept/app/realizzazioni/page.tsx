import { PageHead } from '@/components/PageHead';
import { WorkGallery } from '@/components/WorkGallery';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo';
import { site } from '@/content/site';

export const metadata = pageMeta({
  title: 'Realizzazioni: tende e schermature a Bologna',
  description:
    'Lavori realizzati da GRtendaggi Concept a Bologna e in Emilia-Romagna: tende da interno, tende da sole, pergole, chiusure e tappezzeria.',
  path: '/realizzazioni/',
});

export default function Realizzazioni() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Realizzazioni', path: '/realizzazioni/' }])} />
      <PageHead
        title="Realizzazioni"
        lead="Case, negozi e terrazzi a Bologna e in Emilia-Romagna. Filtra per tipo di soluzione e apri le immagini a tutto schermo."
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Realizzazioni', href: '/realizzazioni/' }]}
      />
      {site.placeholderImages && (
        <div className="wrap mt-10">
          <p className="max-w-[60ch] bg-surface p-5 text-[1rem]">
            Le immagini di questa pagina sono illustrazioni provvisorie: la galleria verrà completata con le
            fotografie dei lavori realizzati.
          </p>
        </div>
      )}
      <WorkGallery />
    </>
  );
}
