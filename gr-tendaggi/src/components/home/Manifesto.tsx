const facts = [
  { value: "Su misura", note: "Ogni tenda nasce dalle misure del tuo spazio." },
  { value: "Velo o oscurante", note: "Dal tessuto che addolcisce a quello che ferma la luce." },
  { value: "50 · 25 · 16 mm", note: "Le lamelle delle veneziane, per finestre diverse." },
  { value: "Emilia-Romagna", note: "Realizzazione e posa in tutte le province." },
];

/** Continues the hero stage: its opening line has already appeared over the framed photograph. */
export function Manifesto() {
  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="frame section-gap bg-warm">
      <div className="grid-12 items-end gap-y-8">
        <h2 id="manifesto-title" className="stage-copy-static col-span-12 text-title md:col-span-7">
          Ogni spazio
          <br />
          ha una sua luce.
        </h2>
        <div data-reveal className="col-span-12 md:col-span-6 lg:col-span-5">
          <p data-reveal-item className="max-w-[30ch] font-serif text-lead font-light">
            La luce cambia con le ore, le stagioni, le stanze.
          </p>
        </div>
        <div data-reveal className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
          <p data-reveal-item className="max-w-[42ch]">
            Scegliamo con te il tessuto e il sistema che la accompagnano come desideri: un velo che la addolcisce, un
            oscurante che la ferma, una tenda da sole che la porta fuori.
          </p>
        </div>
      </div>

      <dl data-reveal className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-24 lg:flex lg:justify-between lg:gap-10">
        {facts.map((f) => (
          <div key={f.value} data-reveal-item className="lg:max-w-[16rem]">
            <dt className="font-serif text-lead leading-[1.05] font-light tracking-[-0.02em] whitespace-nowrap">
              {f.value}
            </dt>
            <dd className="mt-2 text-[1rem] text-muted">{f.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
