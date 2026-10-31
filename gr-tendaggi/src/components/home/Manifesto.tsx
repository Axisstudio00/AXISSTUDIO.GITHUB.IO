import { Picture } from "@/components/ui/Picture";
import { Lines } from "@/components/ui/Lines";

const facts = [
  { value: "Su misura", note: "Ogni tenda nasce dalle misure del tuo spazio." },
  { value: "Velo o oscurante", note: "Dal tessuto che addolcisce a quello che ferma la luce." },
  { value: "50 · 25 · 16 mm", note: "Le lamelle delle veneziane, per finestre diverse." },
  { value: "Emilia-Romagna", note: "Realizzazione e posa in tutte le province." },
];

export function Manifesto() {
  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="frame section-gap bg-warm">
      <div className="grid-12 items-end gap-y-8">
        <Lines
          id="manifesto-title"
          lines={["Ogni spazio", "ha una sua luce."]}
          className="col-span-12 text-title md:col-span-7"
        />
        <div data-reveal className="col-span-12 md:col-span-4 md:col-start-9">
          <p data-reveal-item className="max-w-[40ch]">
            La luce cambia con le ore, le stagioni, le stanze. Scegliamo con te il tessuto e il sistema che la
            accompagnano come desideri: un velo che la addolcisce, un oscurante che la ferma, una tenda da sole che la
            porta fuori.
          </p>
        </div>
      </div>

      <dl data-reveal className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-28 lg:flex lg:justify-between lg:gap-10">
        {facts.map((f) => (
          <div key={f.value} data-reveal-item className="lg:max-w-[16rem]">
            <dt className="font-serif text-lead leading-[1.05] font-light tracking-[-0.02em] whitespace-nowrap">
              {f.value}
            </dt>
            <dd className="mt-2 text-[1rem] text-muted">{f.note}</dd>
          </div>
        ))}
      </dl>

      <div className="grid-12 mt-20 gap-y-14 md:mt-32">
        <figure className="col-span-10 md:col-span-5 md:col-start-1">
          <div data-clip className="overflow-hidden">
            <div data-parallax="8" className="scale-[1.08]">
              <Picture
                id="veloControluce"
                sizes="(min-width: 768px) 40vw, 84vw"
                imgClassName="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
          <figcaption className="mt-3 text-[0.875rem] text-muted">Velo in lino, controluce del pomeriggio.</figcaption>
          <p data-reveal className="mt-20 max-w-[22ch] font-serif text-lead font-light md:mt-28">
            <span data-reveal-item className="block">
              Una tenda non chiude una finestra: decide come entra il giorno.
            </span>
          </p>
        </figure>

        <div className="col-span-12 md:col-span-6 md:col-start-7 md:pt-[22vh]">
          <figure className="ml-auto w-[78%] md:w-[84%]">
            <div data-clip className="overflow-hidden">
              <div data-parallax="12" className="scale-[1.1]">
                <Picture
                  id="vistaLago"
                  sizes="(min-width: 768px) 40vw, 72vw"
                  imgClassName="aspect-[4/5] w-full object-cover"
                />
              </div>
            </div>
            <figcaption className="mt-3 text-[0.875rem] text-muted">Teli leggeri ai lati della vetrata.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
