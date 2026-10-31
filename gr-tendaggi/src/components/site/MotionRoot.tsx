"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { loadMotion, MOTION_OK, type Motion } from "@/lib/gsap";

/**
 * Page-level choreography driven by data attributes:
 * [data-reveal] group → its [data-reveal-item] children rise in reading order
 * [data-lines] group → each [data-line] > span rises out of its mask
 * [data-clip] → picture opens from the bottom edge while the image settles from a slight scale
 * [data-parallax="<percent>"] → scroll-linked drift
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    let mm: gsap.MatchMedia | undefined;
    let refresh = 0;
    let cancelled = false;

    const run = ({ gsap, ScrollTrigger }: Motion) => {
      if (cancelled) return;
      // If the failsafe already revealed everything, do not hide it again.
      const armed = root.classList.contains("motion-armed");
      root.classList.add("motion-ready");
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (!armed) return;
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((group) => {
          const items = group.querySelectorAll<HTMLElement>("[data-reveal-item]");
          if (!items.length) return;
          gsap.fromTo(
            items,
            { y: 28, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 1,
              stagger: 0.08,
              scrollTrigger: { trigger: group, start: "top 88%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((group) => {
          const lines = group.querySelectorAll<HTMLElement>("[data-line] > span");
          gsap.fromTo(
            lines,
            { y: 0, yPercent: 105 },
            {
              y: 0,
              yPercent: 0,
              duration: 1.1,
              stagger: 0.09,
              scrollTrigger: { trigger: group, start: "top 90%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
          const img = el.querySelector("img");
          const tl = gsap.timeline({
            delay: Number(el.dataset.clipDelay || 0),
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
          tl.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.35, ease: "power3.inOut" },
          );
          if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.1);
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax || 10);
          gsap.fromTo(
            el,
            { yPercent: -amount / 2 },
            {
              yPercent: amount / 2,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    };

    loadMotion().then(run);
    return () => {
      cancelled = true;
      window.clearTimeout(refresh);
      mm?.revert();
    };
  }, [pathname]);

  return null;
}
