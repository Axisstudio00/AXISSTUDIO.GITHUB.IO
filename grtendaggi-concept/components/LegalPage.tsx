import { Breadcrumbs } from './PageHead';

export function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="wrap pb-[var(--section)] pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: title, href: path }]} />
      <div className="mt-8 grid gap-10 md:grid-cols-12 md:gap-6">
        <header className="md:col-span-4">
          <h1 className="text-[clamp(2.75rem,1.6rem+4vw,5.5rem)]">{title}</h1>
          <p className="t-small mt-6 text-muted">Ultimo aggiornamento: {updated}</p>
        </header>
        <div className="legal md:col-span-7 md:col-start-6">
          <p className="mb-10 bg-surface p-5 text-[1rem]">
            Bozza redatta sui trattamenti effettivamente previsti dal sito. Deve essere verificata da un consulente
            legale e completata con i dati societari prima della pubblicazione.
          </p>
          {children}
        </div>
      </div>
    </article>
  );
}
