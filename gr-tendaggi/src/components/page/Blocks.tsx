import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import { Lines } from "@/components/ui/Lines";
import type { ImageId } from "@/lib/images";
import { solutions } from "@/lib/site";

/** Statement in the serif at statement size, with a supporting paragraph across the grid. */
export function Intro({
  title,
  statement,
  text,
  id,
}: {
  title: string;
  statement: string;
  text: string[];
  id: string;
}) {
  return (
    <section aria-labelledby={id} className="frame section-gap bg-warm">
      <div className="grid-12 gap-y-10">
        <div data-reveal className="col-span-12 md:col-span-6">
          <h2 id={id} data-reveal-item className="text-title">
            {title}
          </h2>
          <p data-reveal-item className="mt-8 max-w-[30ch] font-serif text-lead font-light">
            {statement}
          </p>
        </div>
        <div data-reveal className="col-span-12 space-y-5 md:col-span-5 md:col-start-8 md:pt-2">
          {text.map((t) => (
            <p key={t} data-reveal-item className="max-w-[46ch]">
              {t}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Uneven pair: a portrait low on the left, a landscape high on the right (or mirrored). */
export function PhotoPair({
  first,
  second,
  captions,
  mirrored = false,
  tone = "bg-warm",
}: {
  first: ImageId;
  second: ImageId;
  captions: [string, string];
  mirrored?: boolean;
  tone?: string;
}) {
  return (
    <section aria-label="Ambientazioni illustrative" className={`frame pb-[var(--section-gap)] ${tone}`}>
      <div className="grid-12 items-start gap-y-12">
        <figure
          className={`col-span-9 ${mirrored ? "col-start-4 md:order-2 md:col-span-4 md:col-start-9 md:mt-[18vh]" : "md:col-span-4 md:mt-[18vh]"}`}
        >
          <div data-clip className="overflow-hidden">
            <div data-parallax="10" className="scale-[1.1]">
              <Picture
                id={first}
                sizes="(min-width: 768px) 32vw, 75vw"
                imgClassName="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
          <figcaption className="mt-3 text-[0.875rem] text-muted">{captions[0]}</figcaption>
        </figure>
        <figure className={`col-span-12 ${mirrored ? "md:order-1 md:col-span-7" : "md:col-span-7 md:col-start-6"}`}>
          <div data-clip data-clip-delay="0.12" className="overflow-hidden">
            <div data-parallax="8" className="scale-[1.08]">
              <Picture
                id={second}
                sizes="(min-width: 768px) 56vw, 100vw"
                imgClassName="aspect-[3/2] w-full object-cover"
              />
            </div>
          </div>
          <figcaption className="mt-3 text-[0.875rem] text-muted">{captions[1]}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/** Product types as large names in two or three columns; separation by space only. */
export function OfferColumns({
  id,
  title,
  items,
  tone = "bg-ivory",
}: {
  id: string;
  title: [string, string];
  items: { name: string; text: string }[];
  tone?: string;
}) {
  return (
    <section aria-labelledby={id} className={`frame section-gap ${tone}`}>
      <Lines id={id} lines={title} className="text-title" />
      <dl data-reveal className="mt-16 grid gap-x-[var(--gutter)] gap-y-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.name} data-reveal-item>
            <dt className="font-serif text-lead leading-[1.08] font-light tracking-[-0.015em]">{item.name}</dt>
            <dd className="mt-3 max-w-[36ch]">{item.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Process({ tone = "bg-sand" }: { tone?: string }) {
  const steps = [
    {
      name: "Ascolto",
      text: "Ci racconti l'ambiente, la luce che entra, l'uso della stanza e il risultato che cerchi.",
    },
    { name: "Scelta", text: "Valutiamo insieme tessuti, colori e sistemi di apertura, manuali o motorizzati." },
    { name: "Realizzazione", text: "Ogni soluzione viene realizzata sulle misure del tuo spazio." },
    { name: "Posa", text: "Installiamo a Bologna e nelle province dell'Emilia-Romagna." },
  ];
  return (
    <section aria-labelledby="processo-title" className={`frame section-gap ${tone}`}>
      <div className="grid-12 gap-y-8">
        <Lines
          id="processo-title"
          lines={["Dal primo incontro", "alla posa."]}
          className="col-span-12 text-title md:col-span-7"
        />
      </div>
      <ol data-reveal className="mt-16 grid gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.name} data-reveal-item className={i % 2 === 1 ? "lg:mt-16" : ""}>
            <h3 className="text-lead leading-[1.08]">{s.name}</h3>
            <p className="mt-3 max-w-[30ch]">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const relatedImages: Record<string, ImageId> = {
  "/tende-da-interno": "veloColline",
  "/tende-da-sole": "tendaSole",
  "/outdoor": "pergolaLamelle",
  "/zanzariere": "zanzariera",
  "/schermature": "ristoranteTecniche",
};

export function Related({ current }: { current: string }) {
  const others = solutions.filter((s) => s.href !== current).slice(0, 3);
  return (
    <section aria-labelledby="altre-soluzioni" className="frame section-gap bg-warm">
      <h2 id="altre-soluzioni" className="text-lead leading-[1.1]">
        Altre soluzioni
      </h2>
      <ul data-reveal className="mt-10 grid grid-cols-12 gap-x-[var(--gutter)] gap-y-10">
        {others.map((s, i) => (
          <li
            key={s.href}
            data-reveal-item
            className={`col-span-12 sm:col-span-6 ${i === 0 ? "lg:col-span-5" : i === 1 ? "lg:col-span-3 lg:mt-24" : "lg:col-span-4"}`}
          >
            <Link href={s.href} className="group block">
              <div className="overflow-hidden">
                <Picture
                  id={relatedImages[s.href]}
                  sizes="(min-width: 1024px) 36vw, (min-width: 640px) 50vw, 100vw"
                  alt=""
                  imgClassName={`w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.04] ${
                    i === 1 ? "aspect-[4/5]" : "aspect-[4/3]"
                  }`}
                />
              </div>
              <span className="mt-4 inline-flex items-center gap-3 font-serif text-lead font-light">
                {s.label}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 12"
                  width="20"
                  height="12"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
