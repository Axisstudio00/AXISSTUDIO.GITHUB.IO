"use client";

import { useId, useState } from "react";
import { Picture } from "@/components/ui/Picture";

const stops = [
  {
    at: 0,
    name: "Velo",
    text: "Un tessuto leggero lascia passare il giorno e lo addolcisce: la stanza resta luminosa, la vista si sfuma.",
  },
  {
    at: 50,
    name: "Filtrante",
    text: "Una trama più fitta riduce il riverbero e protegge la privacy, senza spegnere la luce.",
  },
  {
    at: 100,
    name: "Oscurante",
    text: "Un tessuto oscurante ferma la luce: per dormire, per proiettare, per proteggere arredi e superfici.",
  },
];

/**
 * "Quanta luce?" — the same room from sheer to blackout. Indicative simulation, not a fabric sample.
 * On phones the control sits directly under the picture so the change stays in view while dragging.
 */
export function LightSlider({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const [value, setValue] = useState(15);
  const id = useId();
  const v = value / 100;
  const stop = v < 0.34 ? stops[0] : v < 0.72 ? stops[1] : stops[2];
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <div className="grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-[var(--gutter)] md:gap-y-0">
      <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
        <Heading className="text-title">Quanta luce?</Heading>
        <p className="mt-5 max-w-[42ch]">
          Sposta il cursore e guarda la stessa camera passare dal velo all&apos;oscurante. Il tessuto giusto dipende da
          come vivi la stanza.
        </p>
      </div>

      <figure className="relative overflow-hidden md:col-span-6 md:col-start-1 md:row-span-2 md:row-start-1 md:self-center lg:col-span-5">
        <Picture
          id="cameraVelo"
          sizes="(min-width: 768px) 42vw, 100vw"
          imgClassName="aspect-[4/5] w-full object-cover"
        />
        <Picture
          id="tramaLino"
          sizes="(min-width: 768px) 42vw, 100vw"
          alt=""
          className="absolute inset-0 mix-blend-multiply"
          imgClassName="h-full w-full object-cover"
          style={{ opacity: Math.min(1, v * 1.1) * 0.75 }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-night" style={{ opacity: Math.pow(v, 1.6) * 0.84 }} />
        <figcaption className="absolute right-4 bottom-4 bg-warm px-3 py-1.5 text-[0.875rem] text-charcoal">
          {stop.name}
        </figcaption>
      </figure>

      <div className="md:col-span-6 md:col-start-7 md:pt-10 lg:col-span-5 lg:col-start-8">
        <label htmlFor={id} className="block text-[1rem] font-medium">
          Trasparenza del tessuto
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-valuetext={`${stop.name}: ${100 - value}% di luce indicativa`}
          className="light-range mt-4 w-full cursor-pointer"
        />
        <div className="mt-3 flex justify-between text-[0.875rem] text-muted" aria-hidden="true">
          {stops.map((s) => (
            <button
              key={s.name}
              type="button"
              tabIndex={-1}
              onClick={() => setValue(s.at)}
              className={`cursor-pointer py-1 transition-colors ${stop.name === s.name ? "text-charcoal" : "hover:text-charcoal"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-8 min-h-[4.5em] max-w-[44ch] font-serif text-lead font-light">
          {stop.text}
        </p>
        <p className="mt-4 text-[0.875rem] text-muted">
          Simulazione indicativa: l&apos;effetto reale dipende dal tessuto scelto.
        </p>
      </div>
    </div>
  );
}
