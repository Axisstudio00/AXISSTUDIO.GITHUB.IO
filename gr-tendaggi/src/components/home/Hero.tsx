"use client";

import { useEffect, useRef, useState } from "react";
import { Picture } from "@/components/ui/Picture";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { gsap } from "gsap";
import { MOTION_OK, useMotion } from "@/lib/gsap";
import type { ImageId } from "@/lib/images";

const frames: { id: ImageId; position: string }[] = [
  { id: "panoramico", position: "38% 50%" },
  { id: "tendeFiltranti", position: "40% 50%" },
  { id: "doppiaAltezza", position: "58% 50%" },
];

const INTRO_KEY = "grtc-intro";
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function Curtain({ side, layer }: { side: "left" | "right"; layer: "front" | "back" }) {
  return (
    <div data-curtain={side} data-layer={layer} className={`curtain curtain-${side} curtain-${layer}`}>
      <div className="curtain-fabric" />
      <div className="curtain-folds" />
      <div className="curtain-shade" />
    </div>
  );
}

export function Hero() {
  const [active, setActive] = useState(0);
  const [extraFrames, setExtraFrames] = useState(false);
  const skipRef = useRef<() => void>(() => {});

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

  // Curtain intro: armed before first paint by the inline head script (homepage, once per session,
  // motion allowed). The panels open, the room brightens, then title, copy and navigation follow.
  useEffect(() => {
    const html = document.documentElement;
    const root = ref.current;
    if (!root || !html.classList.contains("intro-armed")) return;
    html.classList.add("intro-started");

    let tl: gsap.core.Timeline | undefined;
    let done = false;
    const events = ["wheel", "touchmove", "keydown"] as const;

    const finish = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, skip));
      html.classList.remove("intro-armed");
      html.classList.add("intro-done");
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
      if (tl) {
        const targets = root.querySelectorAll("[data-hero-line] > span, [data-intro-fade], [data-hero-media]");
        tl.kill();
        gsap.set(targets, { clearProps: "all" });
        gsap.set("[data-site-header]", { clearProps: "opacity,visibility" });
      }
    };
    // Any intent to read or move on ends the intro at once.
    function skip() {
      if (tl) tl.progress(1);
      else finish();
    }
    skipRef.current = skip;
    events.forEach((e) => window.addEventListener(e, skip, { passive: true, once: true }));

    // Wait (briefly) for the hero photograph so the opening never reveals an empty frame.
    const img = root.querySelector<HTMLImageElement>("[data-hero-media] img");
    const imageReady =
      img && !img.complete ? Promise.race([img.decode().catch(() => {}), wait(1400)]) : Promise.resolve();

    // The intro uses the GSAP core shipped with this component, so it starts as soon as the page is interactive.
    imageReady
      .then(() => {
        if (done) return;
        const small = window.matchMedia("(max-width: 767px)").matches;
        const open = small ? 1.05 : 1.6;
        const start = small ? 0.12 : 0.2;
        const q = gsap.utils.selector(root);

        tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: finish });
        tl.to(q('[data-curtain="left"][data-layer="front"]'), { xPercent: -100, scaleX: 0.55, duration: open }, start)
          .to(q('[data-curtain="right"][data-layer="front"]'), { xPercent: 100, scaleX: 0.55, duration: open }, start)
          .to(
            q('[data-curtain="left"]'),
            { keyframes: { skewY: [0, -1.2, 0] }, duration: open, ease: "sine.inOut" },
            start,
          )
          .to(
            q('[data-curtain="right"]'),
            { keyframes: { skewY: [0, 1.2, 0] }, duration: open, ease: "sine.inOut" },
            start,
          );
        if (!small) {
          tl.to(
            q('[data-curtain="left"][data-layer="back"]'),
            { xPercent: -100, scaleX: 0.5, duration: open * 1.08 },
            start + 0.12,
          )
            .to(
              q('[data-curtain="right"][data-layer="back"]'),
              { xPercent: 100, scaleX: 0.5, duration: open * 1.08 },
              start + 0.12,
            )
            .to(
              q(".intro-glow"),
              { keyframes: { opacity: [0, 1, 0] }, duration: open + 0.6, ease: "sine.inOut" },
              start,
            );
        }
        tl.to(q(".intro-dim"), { opacity: 0, duration: open + 0.35, ease: "power2.out" }, start)
          .fromTo(q("[data-hero-media]"), { scale: 1.1 }, { scale: 1, duration: open + 1, ease: "expo.out" }, 0)
          .fromTo(
            q("[data-hero-line] > span"),
            { y: 0, yPercent: 105 },
            { y: 0, yPercent: 0, duration: small ? 0.9 : 1.1, stagger: 0.12, ease: "expo.out" },
            start + open * 0.82,
          )
          .fromTo(
            q("[data-intro-fade]"),
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "expo.out" },
            start + open * 0.82 + 0.35,
          )
          .fromTo("[data-site-header]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: "power1.out" }, "<0.1");
      })
      .catch(finish);

    return () => {
      events.forEach((e) => window.removeEventListener(e, skip));
      tl?.kill();
    };
  }, [ref]);

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

      <div aria-hidden="true" className="intro">
        <div className="intro-dim" />
        <div className="intro-glow" />
        <Curtain side="left" layer="back" />
        <Curtain side="right" layer="back" />
        <Curtain side="left" layer="front" />
        <Curtain side="right" layer="front" />
      </div>
      <button
        type="button"
        onClick={() => skipRef.current()}
        className="intro-skip absolute right-[var(--margin)] bottom-5 z-30 min-h-11 cursor-pointer items-center px-1 text-[0.875rem] text-ivory underline underline-offset-4"
      >
        Salta l&apos;introduzione
      </button>

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
            <p data-intro-fade className="max-w-[34ch] text-[1rem] leading-relaxed text-ivory sm:text-[1.25rem]">
              Soluzioni su misura per trasformare la luce, valorizzare gli ambienti e vivere ogni spazio con una nuova
              prospettiva.
            </p>
            <div data-intro-fade className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
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
        <p data-intro-fade className="mt-8 text-[0.875rem] text-sand">
          Tende, tende da sole, zanzariere e schermature su misura · San Lazzaro di Savena, Bologna
        </p>
      </div>
    </section>
  );
}
