"use client";

import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import { MOTION_OK, useMotion } from "@/lib/gsap";

const details = [
  { title: "Tessuti", text: "Lini, veli, trame fitte e tessuti oscuranti, in toni naturali o decisi." },
  { title: "Trame", text: "La trama decide quanta luce passa e come si posa nella stanza." },
  { title: "Meccanismi", text: "Sistemi di apertura manuali o motorizzati, scelti in base all'uso." },
];

/**
 * From the room to the thread: the camera moves into the sheer, the linen weave takes over the screen,
 * one editorial line appears, and the detail opens onto the sample board. One sticky screen, scrubbed.
 * Without motion it rests on the weave and the line.
 */
export function MaterialExperience() {
  const ref = useMotion<HTMLDivElement>((root, mm, { gsap }) => {
    mm.add(
      { desktop: `${MOTION_OK} and (min-width: 768px)`, phone: `${MOTION_OK} and (max-width: 767px)` },
      (ctx) => {
        const phone = ctx.conditions?.phone;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: phone ? 0.4 : 0.8 },
        });
        tl.fromTo(
          "[data-mx-room]",
          { scale: 1 },
          { scale: phone ? 2.4 : 2.9, duration: 0.42, ease: "power1.in", transformOrigin: phone ? "82% 42%" : "84% 44%" },
          0,
        )
          .fromTo("[data-mx-texture]", { autoAlpha: 0, scale: 1.5 }, { autoAlpha: 1, scale: 1.12, duration: 0.2 }, 0.26)
          .to("[data-mx-texture]", { scale: 1.02, duration: 0.5 }, 0.46)
          .fromTo("[data-mx-phrase] > *", { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.14, stagger: 0.04 }, 0.42)
          .to("[data-mx-phrase] > *", { autoAlpha: 0, y: -24, duration: 0.1, stagger: 0.02 }, 0.7)
          .fromTo(
            "[data-mx-next]",
            { clipPath: "circle(0% at 50% 50%)" },
            { clipPath: "circle(78% at 50% 50%)", duration: 0.24, ease: "power2.inOut" },
            0.74,
          )
          .fromTo("[data-mx-next-img]", { scale: 1.3 }, { scale: 1, duration: 0.26 }, 0.74)
          .fromTo("[data-mx-caption]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.92);
      },
    );
  });

  return (
    <section aria-labelledby="materiali-title" className="bg-sand">
      <div ref={ref} className="stage relative h-[100svh] motion-safe:h-[250svh] md:motion-safe:h-[320svh]">
        <div className="stage-screen sticky top-0 h-[100svh] min-h-[32rem] overflow-hidden bg-charcoal">
          <div data-mx-room className="absolute inset-0 will-change-transform">
            <Picture
              id="veloControluce"
              sizes="100vw"
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover"
              style={{ objectPosition: "60% 45%" }}
            />
          </div>
          <div data-mx-texture className="absolute inset-0 will-change-transform">
            <Picture id="tramaLino" sizes="100vw" className="absolute inset-0" imgClassName="h-full w-full object-cover" />
            <div aria-hidden="true" className="mx-veil absolute inset-0" />
          </div>
          <div
            data-mx-phrase
            className="frame absolute inset-x-0 bottom-0 pb-[clamp(3rem,12svh,8rem)] text-charcoal md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:pb-0"
          >
            <h2 id="materiali-title" className="text-display">
              Il valore
              <br />è nei dettagli.
            </h2>
            <p className="mt-6 max-w-[38ch] text-[1.25rem]">
              Da vicino si capisce tutto: il peso di un lino, la regolarità di una trama, la luce che la attraversa.
            </p>
          </div>
          <div data-mx-next className="mx-next absolute inset-0 overflow-hidden">
            <div data-mx-next-img className="absolute inset-0 will-change-transform">
              <Picture id="campionario" sizes="100vw" className="absolute inset-0" imgClassName="h-full w-full object-cover" />
            </div>
            <div aria-hidden="true" className="scrim-bottom absolute inset-0" />
            <p
              data-mx-caption
              className="frame absolute inset-x-0 bottom-0 pb-[clamp(2rem,7svh,4.5rem)] font-serif text-lead font-light text-ivory"
            >
              Dal velo alla trama, dalla trama al campionario.
            </p>
          </div>
        </div>
      </div>

      <div className="frame pt-[var(--section-gap)] pb-[var(--section-gap)]">
        <dl data-reveal className="grid gap-10 md:grid-cols-3 md:gap-[var(--gutter)]">
          {details.map((d) => (
            <div key={d.title} data-reveal-item>
              <dt className="font-serif text-lead leading-[1.05] font-light">{d.title}</dt>
              <dd className="mt-3 max-w-[34ch]">{d.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10">
          <Link href="/materiali" className="link-reveal text-[1rem] font-medium">
            Materiali e soluzioni
            <svg aria-hidden="true" viewBox="0 0 20 12" width="20" height="12" className="link-arrow">
              <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </Link>
        </p>
      </div>
    </section>
  );
}
