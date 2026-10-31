"use client";

import { Picture } from "@/components/ui/Picture";
import { Lines } from "@/components/ui/Lines";
import { useMotion } from "@/lib/gsap";
import type { ImageId } from "@/lib/images";

const items: { id: ImageId; caption: string; ratio: "portrait" | "landscape"; align: "start" | "end" | "center" }[] = [
  { id: "tramontoVetrate", caption: "Soggiorno sul lago, tende filtranti", ratio: "landscape", align: "start" },
  { id: "tapparella", caption: "Tapparella avvolgibile, luce radente", ratio: "portrait", align: "end" },
  { id: "doppiaAltezza", caption: "Doppia altezza, due tessuti", ratio: "landscape", align: "center" },
  { id: "veloControluce", caption: "Velo in lino, controluce", ratio: "portrait", align: "start" },
  { id: "pergolaPiscina", caption: "Dal soggiorno alla terrazza", ratio: "landscape", align: "end" },
  { id: "zanzariera", caption: "Zanzariera scorrevole", ratio: "portrait", align: "center" },
];

// Below 1024px the gallery becomes a vertical stack with alternating widths and sides.
const stack = ["w-[72%] self-start", "w-[86%] self-end", "w-[60%] self-start", "w-full self-center"];

/** Horizontal showcase driven by vertical scroll on large screens; a native swipe row everywhere else. */
export function Inspiration() {
  const ref = useMotion<HTMLDivElement>((wrapper, mm, { gsap }) => {
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      // GSAP wraps the pinned section in a pin-spacer; pinning a child of a React-owned wrapper
      // keeps React's own nodes intact when the route unmounts.
      const root = wrapper.querySelector<HTMLElement>("section");
      const track = wrapper.querySelector<HTMLElement>("[data-track]");
      const viewport = wrapper.querySelector<HTMLElement>("[data-track-viewport]");
      if (!root || !track || !viewport) return;
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      gsap.utils.toArray<HTMLElement>("[data-drift]", wrapper).forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
    });
  });

  return (
    <div ref={ref}>
      <section
        aria-labelledby="ispirazioni-title"
        className="overflow-hidden bg-ivory lg:flex lg:h-[100svh] lg:flex-col lg:justify-center"
      >
        <div className="frame grid-12 items-end gap-y-6 pt-[var(--section-gap)] lg:pt-[calc(var(--header-h)+2rem)]">
          <Lines id="ispirazioni-title" lines={["Ispirazioni"]} className="col-span-12 text-title md:col-span-6" />
          <p className="col-span-12 max-w-[44ch] md:col-span-5 md:col-start-6 lg:col-start-5">
            Ambientazioni illustrative, create digitalmente per raccontare come tessuti e schermature cambiano la luce
            di un ambiente.
          </p>
        </div>

        <div
          data-track-viewport
          className="mt-12 pb-[var(--section-gap)] lg:mx-[var(--margin)] lg:overflow-hidden lg:pb-0"
        >
          <ul
            data-track
            className="flex flex-col gap-16 px-[var(--margin)] lg:h-[62svh] lg:w-max lg:flex-row lg:gap-[clamp(1rem,3vw,3.5rem)] lg:px-0"
          >
            {items.map((item, i) => (
              <li
                key={item.id}
                className={`flex shrink-0 flex-col ${stack[i % stack.length]} lg:w-auto ${
                  item.align === "start" ? "lg:self-start" : item.align === "end" ? "lg:self-end" : "lg:self-center"
                }`}
              >
                <figure>
                  <div
                    className={`overflow-hidden ${
                      item.ratio === "portrait"
                        ? "aspect-[4/5] w-full lg:h-[50svh] lg:w-auto"
                        : "aspect-[3/2] w-full lg:h-[44svh] lg:w-auto"
                    }`}
                  >
                    <div data-drift className="h-full w-full scale-[1.14]">
                      <Picture
                        id={item.id}
                        sizes="(min-width: 1024px) 50vw, 82vw"
                        imgClassName="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 text-[0.875rem] text-muted">
                    Ambientazione illustrativa · {item.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
