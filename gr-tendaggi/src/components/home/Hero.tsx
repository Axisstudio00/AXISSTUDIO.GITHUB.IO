"use client";

import { Picture } from "@/components/ui/Picture";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MOTION_OK, useMotion } from "@/lib/gsap";

const words: { text: string; line: 0 | 1 }[] = [
  { text: "La", line: 0 },
  { text: "luce", line: 0 },
  { text: "prende", line: 1 },
  { text: "forma.", line: 1 },
];

/**
 * Opening stage. The page is visible from the first frame (entrance in CSS). On the first scroll the
 * title lifts away while the photograph draws itself into a frame, and the manifesto's opening line
 * takes its place: the hero turns into the next section instead of being scrolled past.
 * A tall wrapper with a sticky screen; GSAP only scrubs transforms, opacity and clip-path.
 */
export function Hero() {
  const ref = useMotion<HTMLDivElement>((root, mm, { gsap }) => {
    mm.add(
      { desktop: `${MOTION_OK} and (min-width: 768px)`, phone: `${MOTION_OK} and (max-width: 767px)` },
      (ctx) => {
        const phone = ctx.conditions?.phone;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
        tl.to("[data-hero-cue]", { autoAlpha: 0, duration: 0.08 }, 0)
          .to("[data-hero-copy]", { yPercent: -28, autoAlpha: 0, duration: 0.4, ease: "power1.in" }, 0)
          .fromTo(
            "[data-hero-frame]",
            { clipPath: "inset(0% 0% 0% 0%)" },
            {
              clipPath: phone ? "inset(44% 5% 7% 5%)" : "inset(12% 6% 12% 47%)",
              duration: 0.75,
              ease: "power2.inOut",
            },
            0.12,
          )
          .fromTo("[data-hero-zoom]", { scale: 1.08 }, { scale: 1, duration: 1 }, 0)
          .to("[data-hero-scrim]", { autoAlpha: 0, duration: 0.45 }, 0.15)
          .fromTo(
            "[data-hero-next] > *",
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.06, ease: "power2.out" },
            0.55,
          );
      },
    );
  });

  return (
    <div ref={ref} className="stage relative h-[100svh] motion-safe:h-[175svh] md:motion-safe:h-[205svh]">
      {/* Sentinel for the header: transparent over the full photograph, solid once it has drawn back. */}
      <div aria-hidden="true" data-hero className="pointer-events-none absolute inset-x-0 top-0 h-[60svh]" />

      <section
        aria-labelledby="hero-title"
        className="stage-screen on-dark sticky top-0 h-[100svh] min-h-[34rem] overflow-hidden bg-warm text-ivory"
      >
        <div data-hero-frame className="absolute inset-0 overflow-hidden bg-charcoal will-change-[clip-path]">
          <div data-hero-zoom className="absolute inset-0 will-change-transform">
            <div data-hero-settle className="absolute inset-0">
              <div data-hero-drift className="absolute inset-0">
                <Picture
                  id="panoramico"
                  priority
                  sizes="100vw"
                  className="absolute inset-0"
                  imgClassName="h-full w-full object-cover"
                  style={{ objectPosition: "42% 50%" }}
                />
              </div>
            </div>
          </div>
          <div data-hero-scrim aria-hidden="true" className="absolute inset-0">
            <div className="scrim-top absolute inset-x-0 top-0 h-40" />
            <div className="scrim-bottom absolute inset-0" />
          </div>
        </div>

        <div data-hero-copy className="frame absolute inset-x-0 bottom-0 pb-[clamp(2.5rem,9svh,6rem)]">
          <div className="grid-12 items-end gap-y-7">
            <h1
              id="hero-title"
              className="col-span-12 font-serif text-[clamp(2.3rem,9.6vw,3.6rem)] leading-[0.94] font-light tracking-[-0.025em] uppercase md:text-[6.3vw] xl:col-span-8 2xl:text-[7.25rem]"
            >
              {[0, 1].map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {words
                    .filter((w) => w.line === line)
                    .map((w, i, arr) => (
                      <span
                        key={w.text}
                        data-hero-word
                        className="inline-block overflow-hidden pb-[0.04em] align-bottom"
                        style={{ ["--delay" as string]: `${0.12 + words.indexOf(w) * 0.1}s` }}
                      >
                        <span className="inline-block">
                          {w.text}
                          {i < arr.length - 1 ? " " : ""}
                        </span>
                      </span>
                    ))}
                </span>
              ))}
            </h1>
            <div className="col-span-12 sm:col-span-8 md:col-span-6 xl:col-span-4 xl:col-start-9">
              <p
                data-hero-fade
                style={{ ["--delay" as string]: "0.62s" }}
                className="max-w-[34ch] text-[1rem] leading-relaxed text-ivory sm:text-[1.25rem]"
              >
                Soluzioni su misura per trasformare la luce, valorizzare gli ambienti e vivere ogni spazio con una nuova
                prospettiva.
              </p>
              <div data-hero-fade style={{ ["--delay" as string]: "0.78s" }} className="mt-7">
                <ButtonLink href="#soluzioni" tone="light">
                  Scopri le nostre soluzioni
                </ButtonLink>
              </div>
            </div>
          </div>
          <p data-hero-fade style={{ ["--delay" as string]: "0.92s" }} className="mt-8 text-[0.875rem] text-sand">
            Tende, tende da sole, zanzariere e schermature su misura · San Lazzaro di Savena, Bologna
          </p>
        </div>

        <a
          href="#manifesto"
          data-hero-cue
          aria-label="Scorri alla sezione successiva"
          className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.875rem] text-sand md:flex"
        >
          <span data-hero-fade style={{ ["--delay" as string]: "1.1s" }} className="flex flex-col items-center gap-2">
            <span
              aria-hidden="true"
              className={
                /* taste-skill-ignore: animated scroll indicator requested in brief */ "relative block h-12 w-[2px] overflow-hidden bg-ivory/25"
              }
            >
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_var(--ease-in-out)_infinite] bg-ivory" />
            </span>
            Scorri
          </span>
        </a>

        {/* The manifesto's opening line, revealed as the photograph draws back into its frame. */}
        <div
          data-hero-next
          aria-hidden="true"
          className="stage-copy-motion frame pointer-events-none absolute inset-x-0 top-0 pt-[calc(var(--header-h)+5svh)] text-charcoal md:top-1/2 md:w-[46%] md:-translate-y-1/2 md:pt-0"
        >
          <p className="font-serif text-title font-light tracking-[-0.02em]">
            Ogni spazio
            <br />
            ha una sua luce.
          </p>
          <p className="mt-6 max-w-[34ch] text-[1rem] text-muted md:mt-8">
            Velo, filtrante o oscurante: il tessuto giusto decide come entra il giorno.
          </p>
        </div>
      </section>
    </div>
  );
}
