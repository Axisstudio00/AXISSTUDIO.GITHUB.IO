"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import type { ImageId } from "@/lib/images";

const steps: { title: string; text: string; image: ImageId; href: string; position: string }[] = [
  {
    title: "Tende da sole",
    text: "Per balconi, terrazze, giardini e vetrine: protezione da sole, calore e intemperie.",
    image: "tendaSole",
    href: "/tende-da-sole",
    position: "50% 50%",
  },
  {
    title: "Motorizzazione e nuovi teli",
    text: "Motorizzazione, manutenzione e sostituzione del tessuto per le tende da sole che già hai.",
    image: "terrazzaPergola",
    href: "/tende-da-sole",
    position: "60% 50%",
  },
  {
    title: "Chiusure Crystal",
    text: "Chiusure invernali in PVC o vetro flessibile, per vivere terrazze e dehors anche quando fa freddo.",
    image: "pergolaLamelle",
    href: "/outdoor",
    position: "45% 50%",
  },
];

/** One held scene: the photograph changes as each statement takes its turn. */
export function Outdoor() {
  const [active, setActive] = useState(0);
  const markers = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    markers.current.forEach((m) => m && io.observe(m));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="outdoor-title" className="on-dark relative bg-charcoal text-ivory">
      <div className="relative" style={{ height: `${steps.length * 85 + 40}svh` }}>
        {steps.map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              markers.current[i] = el;
            }}
            data-step={i}
            aria-hidden="true"
            className="absolute inset-x-0"
            style={{ top: `${i * 85 + (i === 0 ? 0 : 20)}svh`, height: "85svh" }}
          />
        ))}

        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {steps.map((s, i) => (
            <div
              key={s.image}
              aria-hidden={i !== active}
              className="absolute inset-0 motion-safe:transition-[clip-path] motion-safe:duration-[1300ms] motion-safe:ease-[var(--ease-in-out)]"
              style={{ zIndex: i, clipPath: i <= active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
            >
              <Picture
                id={s.image}
                sizes="100vw"
                alt={i === active ? undefined : ""}
                className="absolute inset-0"
                imgClassName={`h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-[2200ms] motion-safe:ease-[var(--ease-out)] ${
                  i === active ? "scale-100" : "motion-safe:scale-[1.08]"
                }`}
                style={{ objectPosition: s.position }}
              />
            </div>
          ))}
          <div aria-hidden="true" className="scrim-top-strong absolute inset-x-0 top-0 z-10 h-[58%]" />
          <div aria-hidden="true" className="scrim-bottom absolute inset-x-0 bottom-0 z-10 h-[55%]" />

          <div className="frame relative z-20 flex h-full flex-col justify-between pt-[calc(var(--header-h)+3vh)] pb-[clamp(2rem,7svh,4.5rem)]">
            <div className="text-center">
              <h2 id="outdoor-title" className="text-lead leading-[1.05]">
                Fuori, la stessa cura.
              </h2>
              <ol className="mt-5 flex flex-col items-center gap-1.5 text-[1rem] sm:text-[1.25rem]">
                {steps.map((s, i) => (
                  <li
                    key={s.title}
                    aria-current={i === active ? "step" : undefined}
                    className={`transition-colors duration-500 ${i === active ? "font-medium text-ivory" : "text-sand"}`}
                  >
                    {s.title}
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid-12 items-end gap-y-5">
              <p
                key={active}
                className="col-span-12 max-w-[36ch] motion-safe:animate-[stepin_900ms_var(--ease-expo)_both] font-serif text-lead font-light md:col-span-6"
              >
                {steps[active].text}
              </p>
              <div className="col-span-12 flex flex-wrap items-center gap-x-8 gap-y-3 md:col-span-5 md:col-start-8 md:justify-end">
                <Link
                  href="/tende-da-sole"
                  className="text-[1rem] text-ivory underline underline-offset-[6px] hover:text-sand"
                >
                  Tende da sole
                </Link>
                <Link
                  href="/outdoor"
                  className="text-[1rem] text-ivory underline underline-offset-[6px] hover:text-sand"
                >
                  Outdoor e chiusure invernali
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
