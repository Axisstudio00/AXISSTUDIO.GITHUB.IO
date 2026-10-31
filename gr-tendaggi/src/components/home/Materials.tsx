"use client";

import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import { Lines } from "@/components/ui/Lines";
import { LightSlider } from "./LightSlider";
import { MOTION_OK, useMotion } from "@/lib/gsap";

const details = [
  { title: "Tessuti", text: "Lini, veli, trame fitte e tessuti oscuranti, in toni naturali o decisi." },
  { title: "Trame", text: "La trama decide quanta luce passa e come si posa nella stanza." },
  { title: "Meccanismi", text: "Sistemi di apertura manuali o motorizzati, scelti in base all'uso." },
];

export function Materials() {
  const ref = useMotion<HTMLElement>((root, mm, { gsap }) => {
    mm.add(MOTION_OK, () => {
      // Progressive zoom: each detail settles from close-up to full frame as the composition crosses the screen.
      gsap.utils.toArray<HTMLElement>("[data-zoom]", root).forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 1.35 + i * 0.08 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "center 40%", scrub: true },
          },
        );
      });
    });
  });

  return (
    <section ref={ref} aria-labelledby="materiali-title" className="frame section-gap bg-sand">
      <div className="grid-12 items-end gap-y-8">
        <Lines
          id="materiali-title"
          lines={["Il valore", "è nei dettagli."]}
          className="col-span-12 text-title md:col-span-7"
        />
        <p data-reveal className="col-span-12 max-w-[40ch] md:col-span-4 md:col-start-9">
          <span data-reveal-item className="block">
            Da vicino si capisce tutto: il peso di un lino, la regolarità di una trama, la precisione con cui un telo
            scorre sul suo binario.
          </span>
        </p>
      </div>

      <div className="mt-16 grid grid-cols-12 gap-x-[var(--gutter)] md:mt-24">
        <figure className="relative z-0 col-[1/11] row-start-1 md:col-[1/8]">
          <div className="overflow-hidden">
            <div data-zoom className="origin-[30%_60%]">
              <Picture
                id="campionario"
                sizes="(min-width: 768px) 58vw, 84vw"
                imgClassName="aspect-square w-full object-cover"
              />
            </div>
          </div>
        </figure>
        <figure className="relative z-10 col-[6/13] row-start-1 mt-[58%] self-start md:col-[7/11] md:mt-[34%]">
          <div
            data-parallax="14"
            className="overflow-hidden outline-[clamp(6px,0.8vw,12px)] outline-sand outline-solid"
          >
            <div data-zoom className="origin-center">
              <Picture
                id="tramaLino"
                sizes="(min-width: 768px) 34vw, 58vw"
                imgClassName="aspect-square w-full object-cover"
              />
            </div>
          </div>
        </figure>
        <figure className="relative z-10 row-start-1 mt-[6%] hidden self-start md:col-[11/13] md:block">
          <div data-parallax="22" className="overflow-hidden">
            <div data-zoom className="origin-top">
              <Picture id="binario" sizes="18vw" imgClassName="aspect-square w-full object-cover" />
            </div>
          </div>
        </figure>
      </div>

      <figure className="mt-10 w-[56%] md:hidden">
        <Picture id="binario" sizes="56vw" imgClassName="aspect-square w-full object-cover" />
      </figure>

      <dl data-reveal className="mt-16 grid gap-10 md:mt-28 md:grid-cols-3 md:gap-[var(--gutter)]">
        {details.map((d) => (
          <div key={d.title} data-reveal-item>
            <dt className="font-serif text-lead leading-[1.05] font-light">{d.title}</dt>
            <dd className="mt-3 max-w-[34ch]">{d.text}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-10">
        <Link
          href="/materiali"
          className="text-[1rem] font-medium underline underline-offset-[6px] hover:text-bronze-ink"
        >
          Materiali e soluzioni
        </Link>
      </p>

      <div className="mt-[var(--section-gap)]">
        <LightSlider />
      </div>
    </section>
  );
}
