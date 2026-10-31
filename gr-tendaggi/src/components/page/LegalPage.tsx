export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: React.ReactNode }[];
}) {
  return (
    <article className="frame bg-warm pt-[calc(var(--header-h)+clamp(3rem,10vh,7rem))] pb-[var(--section-gap)]">
      <div className="grid-12 gap-y-10">
        <header className="col-span-12 lg:col-span-4">
          <h1 className="text-title leading-[1]">{title}</h1>
          <p className="mt-6 text-[1rem] text-muted">Ultimo aggiornamento: {updated}</p>
          <p className="mt-6 max-w-[34ch] bg-sand p-4 text-[1rem]">
            Bozza informativa basata sui servizi realmente attivi sul sito. Da verificare con un consulente prima della
            pubblicazione definitiva.
          </p>
        </header>
        <div className="col-span-12 space-y-12 lg:col-span-7 lg:col-start-6">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-serif text-lead leading-[1.15]">{s.heading}</h2>
              <div className="mt-4 max-w-[68ch] space-y-4 [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
