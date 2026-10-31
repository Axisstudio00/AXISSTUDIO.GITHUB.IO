"use client";

import { useId, useState } from "react";
import { Picture } from "@/components/ui/Picture";

const stops = [
  {
    at: 0,
    name: "Velo",
    text: "Molto trasparente: il panorama resta visibile, la luce entra abbondante, le ombre sono morbide.",
  },
  {
    at: 50,
    name: "Filtrante",
    text: "Più denso: diffonde la luce e attenua il panorama, la stanza resta luminosa.",
  },
  {
    at: 100,
    name: "Oscurante",
    text: "Quasi opaco: ferma la luce diretta e copre la vista, per dormire o proiettare.",
  },
];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * "Quanta luce?" — one photograph in three states (velo, filtrante, oscurante) that cross-fade.
 * The states share geometry and framing: only the window, its fabric and the light it lets in change.
 * On phones the control sits directly under the picture so the change stays in view while dragging.
 */
export function LightSlider({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const [value, setValue] = useState(0);
  const [jumping, setJumping] = useState(false);
  const id = useId();
  const v = value / 100;
  const stop = v < 0.25 ? stops[0] : v < 0.75 ? stops[1] : stops[2];
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const fade = jumping ? "duration-700" : "duration-100";
  const transparent = { backgroundColor: "transparent" };

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
          alt={stop.name === "Velo" ? undefined : ""}
          imgClassName="aspect-[4/5] w-full object-cover"
        />
        <Picture
          id="cameraFiltrante"
          sizes="(min-width: 768px) 42vw, 100vw"
          alt={stop.name === "Filtrante" ? undefined : ""}
          className={`absolute inset-0 transition-opacity ease-out ${fade}`}
          imgClassName="h-full w-full object-cover"
          style={transparent}
          wrapperStyle={{ opacity: clamp01(v * 2) }}
        />
        <Picture
          id="cameraOscurante"
          sizes="(min-width: 768px) 42vw, 100vw"
          alt={stop.name === "Oscurante" ? undefined : ""}
          className={`absolute inset-0 transition-opacity ease-out ${fade}`}
          imgClassName="h-full w-full object-cover"
          style={transparent}
          wrapperStyle={{ opacity: clamp01((v - 0.5) * 2) }}
        />
        <figcaption className="absolute right-4 bottom-4 bg-warm px-3 py-1.5 text-[0.875rem] text-charcoal">
          {stop.name}
        </figcaption>
      </figure>

      <div className="md:col-span-6 md:col-start-7 md:pt-10 lg:col-span-5 lg:col-start-8">
        <label htmlFor={id} className="block text-[1rem] font-medium">
          Tipo di tessuto
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => {
            setJumping(false);
            setValue(Number(e.target.value));
          }}
          aria-valuetext={stop.name}
          aria-describedby={`${id}-desc`}
          className="light-range mt-4 w-full cursor-pointer"
        />
        <div className="mt-3 flex justify-between text-[0.875rem] text-muted" aria-hidden="true">
          {stops.map((s) => (
            <button
              key={s.name}
              type="button"
              tabIndex={-1}
              onClick={() => {
                setJumping(true);
                setValue(s.at);
              }}
              className={`cursor-pointer py-1 transition-colors ${stop.name === s.name ? "text-charcoal" : "hover:text-charcoal"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p
          id={`${id}-desc`}
          aria-live="polite"
          className="mt-8 min-h-[3.8em] max-w-[34ch] font-serif text-lead font-light"
        >
          {stop.text}
        </p>
        <p className="mt-4 text-[0.875rem] text-muted">
          Simulazione indicativa su un&apos;unica fotografia: l&apos;effetto reale dipende da tessuto, colore e
          confezione.
        </p>
      </div>
    </div>
  );
}
