"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Picture } from "@/components/ui/Picture";
import type { ImageId } from "@/lib/images";

const materials: { at: number; name: string; image: ImageId; text: string }[] = [
  {
    at: 0,
    name: "Velo",
    image: "cameraVelo",
    text: "Molto trasparente: il panorama resta visibile, la luce entra abbondante, le ombre sono morbide.",
  },
  {
    at: 50,
    name: "Filtrante",
    image: "cameraFiltrante",
    text: "Più denso: diffonde la luce e attenua il panorama, la stanza resta luminosa.",
  },
  {
    at: 100,
    name: "Oscurante",
    image: "cameraOscurante",
    text: "Quasi opaco: scherma la luce diretta e copre la vista, per dormire o proiettare.",
  },
];

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * "Quanta luce?" — three photographs of the same room (velo, filtrante, oscurante) cross-fading under a
 * custom slider. Illustrative representations, not measurements. Pointer (mouse, pen, touch) and keyboard.
 */
export function LightSlider({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const id = useId();
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);
  const targetRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const frame = useRef(0);

  const v = value / 100;
  const current = v < 0.25 ? materials[0] : v < 0.75 ? materials[1] : materials[2];
  const Heading = headingLevel === 2 ? "h2" : "h3";

  const set = useCallback((n: number) => {
    valueRef.current = clamp(n, 0, 100);
    setValue(valueRef.current);
  }, []);

  /** Direct moves (drag, arrows) also become the reference for the next glide. */
  const setNow = useCallback(
    (n: number) => {
      cancelAnimationFrame(frame.current);
      targetRef.current = clamp(n, 0, 100);
      set(n);
    },
    [set],
  );

  /** Glide to a value (indicators, Home/End, page keys); instant under reduced motion. */
  const glideTo = useCallback(
    (to: number) => {
      cancelAnimationFrame(frame.current);
      const target = clamp(to, 0, 100);
      targetRef.current = target;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return set(target);
      const from = valueRef.current;
      const start = performance.now();
      const step = (now: number) => {
        const t = clamp((now - start) / 650);
        set(from + (target - from) * easeOut(t));
        if (t < 1) frame.current = requestAnimationFrame(step);
      };
      frame.current = requestAnimationFrame(step);
    },
    [set],
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const fromPointer = (clientX: number) => {
    const r = trackRef.current!.getBoundingClientRect();
    setNow(((clientX - r.left) / r.width) * 100);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    cancelAnimationFrame(frame.current);
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus({ preventScroll: true });
    fromPointer(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) fromPointer(e.clientX);
  };
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const small = e.shiftKey ? 10 : 2;
    const keys: Record<string, () => void> = {
      ArrowRight: () => setNow(targetRef.current + small),
      ArrowUp: () => setNow(targetRef.current + small),
      ArrowLeft: () => setNow(targetRef.current - small),
      ArrowDown: () => setNow(targetRef.current - small),
      PageUp: () => glideTo(targetRef.current + 25),
      PageDown: () => glideTo(targetRef.current - 25),
      Home: () => glideTo(0),
      End: () => glideTo(100),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };

  const layerOpacity = [1, clamp(v * 2), clamp(v * 2 - 1)];

  return (
    <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-[var(--gutter)] md:gap-y-0">
      <figure className="md:col-span-7 md:row-span-2">
        <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden bg-sand-deep md:max-w-[calc(88svh*0.8)]">
          {materials.map((m, i) => (
            <Picture
              key={m.name}
              id={m.image}
              sizes="(min-width: 768px) 52vw, 100vw"
              alt={m === current ? undefined : ""}
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover"
              style={{ backgroundColor: "transparent" }}
              wrapperStyle={{ opacity: layerOpacity[i] }}
            />
          ))}
          <figcaption className="absolute top-4 left-4 bg-warm px-3 py-1.5 text-[0.875rem] text-charcoal">
            {current.name}
          </figcaption>
        </div>
      </figure>

      <div className="md:col-span-5 md:col-start-8 md:self-end">
        <Heading className="text-title">Quanta luce?</Heading>
        <p className="mt-5 max-w-[40ch]">
          Trascina il cursore o scegli un tessuto: la stessa camera, tre modi di accogliere il giorno.
        </p>
      </div>

      <div className="md:col-span-5 md:col-start-8 md:pt-12">
        <p className="font-serif text-display leading-none font-light" aria-hidden="true">
          <span key={current.name} className="inline-block motion-safe:animate-[stepin_700ms_var(--ease-expo)_both]">
            {current.name}
          </span>
        </p>
        <p id={`${id}-desc`} aria-live="polite" className="mt-5 min-h-[3.3em] max-w-[36ch] text-[1.125rem]">
          {current.text}
        </p>

        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Tipo di tessuto"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(value)}
          aria-valuetext={current.name}
          aria-describedby={`${id}-desc`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          className="ls-track group relative mt-10 h-12 cursor-pointer touch-none outline-none select-none"
        >
          <span aria-hidden="true" className="ls-rail absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-charcoal/20" />
          <span
            aria-hidden="true"
            className="ls-rail absolute inset-x-0 top-1/2 h-[3px] origin-left bg-charcoal"
            style={{ transform: `translateY(-50%) scaleX(${v})` }}
          />
          {materials.map((m) => (
            <span
              key={m.name}
              aria-hidden="true"
              className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300 ${
                v * 100 >= m.at ? "bg-charcoal" : "bg-sand-deep"
              }`}
              style={{ left: `${m.at}%` }}
            />
          ))}
          <span
            aria-hidden="true"
            className="ls-thumb absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-warm bg-bronze transition-[width,height] duration-200 group-active:h-9 group-active:w-9"
            style={{ left: `${v * 100}%` }}
          />
        </div>

        <ul className="mt-6 grid grid-cols-3 gap-3">
          {materials.map((m) => {
            const active = m === current;
            return (
              <li key={m.name}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => glideTo(m.at)}
                  className="group flex w-full cursor-pointer flex-col items-start gap-2.5 py-1 text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`relative block h-14 w-14 overflow-hidden rounded-full outline-2 outline-offset-[3px] transition-[outline-color] duration-300 ${
                      active ? "outline-charcoal outline-solid" : "outline-transparent outline-solid group-hover:outline-taupe"
                    }`}
                  >
                    <Picture
                      id={m.image}
                      sizes="96px"
                      alt=""
                      className="absolute inset-0"
                      imgClassName="h-full w-full origin-[62%_32%] scale-[2.6] object-cover"
                    />
                  </span>
                  <span className={`text-[1rem] transition-colors ${active ? "text-charcoal" : "text-muted group-hover:text-charcoal"}`}>
                    {m.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 max-w-[44ch] text-[0.875rem] text-muted">
          Rappresentazioni illustrative delle tre condizioni: l&apos;effetto reale dipende da tessuto, colore e
          confezione.
        </p>
      </div>
    </div>
  );
}
