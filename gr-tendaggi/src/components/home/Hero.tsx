"use client";

import { useEffect, useState } from "react";
import { Picture } from "@/components/ui/Picture";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MOTION_OK, useMotion } from "@/lib/gsap";
import type { ImageId } from "@/lib/images";

const frames: { id: ImageId; position: string }[] = [
  { id: "panoramico", position: "38% 50%" },
  { id: "tendeFiltranti", position: "40% 50%" },
  { id: "doppiaAltezza", position: "58% 50%" },
];

export function Hero() {
  const [active, setActive] = useState(0);
  const [extraFrames, setExtraFrames] = useState(false);

  // Signature move: light shifting in a room. Slow crossfade, paused when the tab is hidden.
  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;
    let timer = 0;
    const load = window.setTimeout(() => setExtraFrames(true), 2500);
    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => setActive((a) => (a + 1) % frames.length), 6500);
    };
    const onVisibility = () => (document.hidden ? window.clearInterval(timer) : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(load);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const ref = useMotion<HTMLElement>((root, mm, { gsap }) => {
    mm.add(MOTION_OK, () => {
      gsap.to("[data-hero-parallax]", {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-content]", {
        yPercent: -18,
        autoAlpha: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    });
  });

  return (
    <section
      ref={ref}
      data-hero
      aria-labelledby="hero-title"
      className="on-dark relative h-[100svh] min-h-[34rem] overflow-hidden bg-charcoal text-ivory"
    >
      <div data-hero-parallax className="absolute inset-0 will-change-transform">
        <div data-hero-media className="absolute inset-0">
          {frames.map((frame, i) =>
            i === 0 || extraFrames ? (
              <Picture
                key={frame.id}
                id={frame.id}
                priority={i === 0}
                sizes="100vw"
                alt={i === 0 ? undefined : ""}
                className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
                imgClassName="h-full w-full object-cover"
                style={{ objectPosition: frame.position }}
              />
            ) : null,
          )}
        </div>
      </div>
      <div aria-hidden="true" className="scrim-top absolute inset-x-0 top-0 h-40" />
      <div aria-hidden="true" className="scrim-bottom absolute inset-0" />

      <div data-hero-content className="frame absolute inset-x-0 bottom-0 pb-[clamp(1.75rem,6svh,4.5rem)]">
        <div className="grid-12 items-end gap-y-7">
          <h1
            id="hero-title"
            className="col-span-12 font-serif text-[clamp(2.3rem,9.6vw,3.6rem)] leading-[0.94] font-light tracking-[-0.025em] uppercase md:text-[6.3vw] xl:col-span-8 2xl:text-[7.25rem]"
          >
            <span data-hero-line className="block overflow-hidden pb-[0.04em]">
              <span className="block whitespace-nowrap">La luce</span>
            </span>
            <span data-hero-line className="block overflow-hidden pb-[0.04em]">
              <span className="block whitespace-nowrap">prende forma.</span>
            </span>
          </h1>
          <div className="col-span-12 sm:col-span-8 md:col-span-6 xl:col-span-4 xl:col-start-9">
            <p className="max-w-[34ch] text-[1rem] leading-relaxed text-ivory sm:text-[1.25rem]">
              Soluzioni su misura per trasformare la luce, valorizzare gli ambienti e vivere ogni spazio con una nuova
              prospettiva.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href="#soluzioni" tone="light">
                Scopri le nostre soluzioni
              </ButtonLink>
              <a
                href="#manifesto"
                className="group hidden items-center gap-3 text-[1rem] text-sand sm:inline-flex"
                aria-label="Scorri alla sezione successiva"
              >
                <span
                  aria-hidden="true"
                  className={
                    /* taste-skill-ignore: animated scroll indicator requested in brief */ "relative block h-10 w-[2px] overflow-hidden bg-ivory/30"
                  }
                >
                  <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_var(--ease-in-out)_infinite] bg-ivory" />
                </span>
                Scorri
              </a>
            </div>
          </div>
        </div>
        <p className="mt-8 text-[0.875rem] text-sand">
          Tende, tende da sole, zanzariere e schermature su misura · San Lazzaro di Savena, Bologna
        </p>
      </div>
    </section>
  );
}
