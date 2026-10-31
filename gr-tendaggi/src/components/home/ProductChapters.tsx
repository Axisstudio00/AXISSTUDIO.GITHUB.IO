"use client";

import Link from "next/link";
import { useState } from "react";
import { Picture } from "@/components/ui/Picture";
import { Lines } from "@/components/ui/Lines";
import { MOTION_OK, useMotion } from "@/lib/gsap";
import type { ImageId } from "@/lib/images";

type Chapter = {
  id: string;
  href: string;
  name: string;
  title: [string, string?];
  text: string;
  cta: string;
  image: ImageId;
  second?: ImageId;
  position?: string;
};

const chapters: Chapter[] = [
  {
    id: "capitolo-interni",
    href: "/tende-da-interno",
    name: "Tende da interno",
    title: ["Tende", "da interno"],
    text: "Tessuti leggeri per un effetto elegante, tessuti oscuranti per proteggersi dalla luce. Apertura manuale o motorizzata.",
    cta: "Scopri le tende da interno",
    image: "tendeFiltranti",
    position: "40% 50%",
  },
  {
    id: "capitolo-sole",
    href: "/tende-da-sole",
    name: "Tende da sole",
    title: ["Tende", "da sole"],
    text: "Per balconi, terrazze, giardini e vetrine: protezione da sole, calore e intemperie. Anche motorizzazione, manutenzione e nuovi teli.",
    cta: "Scopri le tende da sole",
    image: "tendaSole",
    position: "35% 50%",
  },
  {
    id: "capitolo-pergole",
    href: "/outdoor",
    name: "Pergole e outdoor",
    title: ["Pergole", "e outdoor"],
    text: "Spazi esterni da vivere più a lungo, anche d'inverno: chiusure Crystal in PVC o vetro flessibile per terrazze e dehors.",
    cta: "Scopri l'outdoor",
    image: "pergolaLamelle",
    position: "45% 50%",
  },
  {
    id: "capitolo-zanzariere",
    href: "/zanzariere",
    name: "Zanzariere",
    title: ["Zanzariere"],
    text: "Avvolgibili, a battente, plissé, scorrevoli e motorizzate: finestre aperte, insetti fuori.",
    cta: "Scopri le zanzariere",
    image: "zanzariera",
  },
  {
    id: "capitolo-schermature",
    href: "/schermature",
    name: "Schermature",
    title: ["Schermature", "e oscuranti"],
    text: "Tende tecniche, veneziane con lamelle da 50, 25 e 16 mm e tapparelle, per dosare luce, calore e privacy.",
    cta: "Scopri le schermature",
    image: "ristoranteTecniche",
    second: "tapparella",
  },
];

function ChapterLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link href={href} className={`link-reveal mt-8 text-[1rem] font-medium ${light ? "text-ivory" : "text-charcoal"}`}>
      {children}
      <svg aria-hidden="true" viewBox="0 0 20 12" width="20" height="12" className="link-arrow">
        <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </Link>
  );
}

function Title({ chapter, className = "" }: { chapter: Chapter; className?: string }) {
  return (
    <h3 id={`${chapter.id}-title`} data-ch-title className={className}>
      <span className="block">{chapter.title[0]}</span>
      {chapter.title[1] && <span className="block">{chapter.title[1]}</span>}
    </h3>
  );
}

/**
 * Products as chapters of one film: each category gets its own composition and its own camera move,
 * and a small indicator keeps the reader oriented. No pinning: every move is scrubbed to normal scroll.
 */
export function ProductChapters() {
  const [active, setActive] = useState(-1);
  const [interni, sole, pergole, zanzariere, schermature] = chapters;

  const ref = useMotion<HTMLElement>((root, mm, { gsap, ScrollTrigger }) => {
    gsap.utils.toArray<HTMLElement>("[data-chapter]", root).forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(i),
      });
    });
    ScrollTrigger.create({
      trigger: root.querySelector("[data-chapters]"),
      start: "top 60%",
      end: "bottom 40%",
      onToggle: (self) => !self.isActive && setActive(-1),
    });

    mm.add(
      { desktop: `${MOTION_OK} and (min-width: 768px)`, phone: `${MOTION_OK} and (max-width: 767px)` },
      (ctx) => {
        const phone = ctx.conditions?.phone;
        const scrub = { scrub: phone ? 0.3 : 0.6 };

        // Full-bleed chapter: the picture opens from a framed window to the whole screen, then keeps settling.
        root.querySelectorAll<HTMLElement>("[data-ch-expand]").forEach((el) => {
          gsap.fromTo(
            el.querySelector("[data-ch-media]"),
            { clipPath: phone ? "inset(8% 6% 8% 6%)" : "inset(14% 12% 14% 12%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", ...scrub } },
          );
          gsap.fromTo(
            el.querySelector("[data-ch-zoom]"),
            { scale: 1.18 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", ...scrub } },
          );
        });

        // Circular mask that widens like an aperture.
        root.querySelectorAll<HTMLElement>("[data-ch-aperture]").forEach((el) => {
          gsap.fromTo(
            el.querySelector("[data-ch-media]"),
            { clipPath: "circle(16% at 50% 55%)" },
            { clipPath: "circle(78% at 50% 50%)", ease: "power1.inOut", scrollTrigger: { trigger: el, start: "top 85%", end: "top top", ...scrub } },
          );
          gsap.fromTo(
            el.querySelector("[data-ch-zoom]"),
            { scale: 1.25 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", ...scrub } },
          );
        });

        // Side wipes: the picture is uncovered from the edge it faces.
        root.querySelectorAll<HTMLElement>("[data-ch-wipe]").forEach((el) => {
          const from = el.dataset.chWipe === "left" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
          gsap.fromTo(
            el,
            { clipPath: from },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", end: "top 35%", ...scrub } },
          );
        });

        // Layered parallax inside every framed picture; deeper layers travel further.
        root.querySelectorAll<HTMLElement>("[data-ch-depth]").forEach((el) => {
          const depth = Number(el.dataset.chDepth || 8) * (phone ? 0.6 : 1);
          gsap.fromTo(
            el,
            { yPercent: -depth },
            { yPercent: depth, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", ...scrub } },
          );
        });

        // Titles rise line by line as their chapter arrives.
        root.querySelectorAll<HTMLElement>("[data-ch-title]").forEach((title) => {
          gsap.fromTo(
            title.children,
            { yPercent: 60, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: phone ? 0.8 : 1.1,
              stagger: 0.1,
              ease: "expo.out",
              scrollTrigger: { trigger: title, start: "top 88%", once: true },
            },
          );
        });
      },
    );
  });

  return (
    <section ref={ref} id="soluzioni" aria-labelledby="soluzioni-title" className="relative bg-ivory">
      <div className="frame grid-12 items-end gap-y-6 pt-[var(--section-gap)] pb-[calc(var(--section-gap)*0.7)]">
        <Lines id="soluzioni-title" lines={["Le soluzioni,", "su misura."]} className="col-span-12 text-title md:col-span-7" />
        <p data-reveal className="col-span-12 max-w-[38ch] md:col-span-4 md:col-start-9">
          <span data-reveal-item className="block">
            Cinque capitoli, una sola idea: ogni sistema si sceglie per come vivi la stanza. Quanta luce, quanta privacy,
            quanta aria.
          </span>
        </p>
      </div>

      <div data-chapters>
        {/* 1 — full bleed, expands from a window */}
        <article
          id={interni.id}
          data-chapter
          data-ch-expand
          aria-labelledby={`${interni.id}-title`}
          className="on-dark relative h-[92svh] min-h-[34rem] overflow-hidden bg-ivory text-ivory md:h-[100svh]"
        >
          <div data-ch-media className="photo-hover absolute inset-0 overflow-hidden bg-charcoal">
            <div data-ch-zoom className="absolute inset-0">
              <Picture
                id={interni.image}
                sizes="100vw"
                className="absolute inset-0"
                imgClassName="h-full w-full object-cover"
                style={{ objectPosition: interni.position }}
              />
            </div>
            <div aria-hidden="true" className="scrim-bottom absolute inset-0" />
          </div>
          <div className="frame absolute inset-x-0 bottom-0 pb-[clamp(2.5rem,9svh,6rem)]">
            <div className="grid-12 items-end gap-y-6">
              <Title chapter={interni} className="col-span-12 overflow-hidden text-display md:col-span-7" />
              <div className="col-span-12 md:col-span-4 md:col-start-9">
                <p className="max-w-[36ch] text-ivory">{interni.text}</p>
                <ChapterLink href={interni.href} light>
                  {interni.cta}
                </ChapterLink>
              </div>
            </div>
          </div>
        </article>

        {/* 2 — asymmetric: text left, picture uncovered from the right */}
        <article
          id={sole.id}
          data-chapter
          aria-labelledby={`${sole.id}-title`}
          className="frame grid-12 items-center gap-y-10 bg-warm py-[var(--section-gap)]"
        >
          <div className="order-2 col-span-12 md:order-1 md:col-span-4">
            <Title chapter={sole} className="text-title" />
            <p className="mt-6 max-w-[36ch]">{sole.text}</p>
            <ChapterLink href={sole.href}>{sole.cta}</ChapterLink>
          </div>
          <figure className="order-1 col-span-12 md:order-2 md:col-span-7 md:col-start-6">
            <div data-ch-wipe="right" className="photo-hover relative h-[56svh] overflow-hidden md:h-[80svh]">
              <div data-ch-depth="9" className="absolute -inset-y-[12%] inset-x-0">
                <Picture
                  id={sole.image}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="absolute inset-0"
                  imgClassName="h-full w-full object-cover"
                  style={{ objectPosition: sole.position }}
                />
              </div>
            </div>
            <figcaption className="mt-3 text-[0.875rem] text-muted">Ambientazione illustrativa · Tenda da sole a bracci</figcaption>
          </figure>
        </article>

        {/* 3 — aperture: a circular mask widens to the whole screen */}
        <article
          id={pergole.id}
          data-chapter
          data-ch-aperture
          aria-labelledby={`${pergole.id}-title`}
          className="on-dark relative h-[100svh] min-h-[34rem] overflow-hidden bg-charcoal text-ivory"
        >
          <div data-ch-media className="photo-hover absolute inset-0 overflow-hidden">
            <div data-ch-zoom className="absolute inset-0">
              <Picture
                id={pergole.image}
                sizes="100vw"
                className="absolute inset-0"
                imgClassName="h-full w-full object-cover"
                style={{ objectPosition: pergole.position }}
              />
            </div>
            <div aria-hidden="true" className="scrim-bottom absolute inset-0" />
          </div>
          <div className="frame absolute inset-x-0 bottom-0 flex flex-col items-center pb-[clamp(2.5rem,9svh,6rem)] text-center">
            <Title chapter={pergole} className="overflow-hidden text-display" />
            <p className="mt-6 max-w-[42ch] text-ivory">{pergole.text}</p>
            <ChapterLink href={pergole.href} light>
              {pergole.cta}
            </ChapterLink>
          </div>
        </article>

        {/* 4 — portrait on the left, text answering on the right */}
        <article
          id={zanzariere.id}
          data-chapter
          aria-labelledby={`${zanzariere.id}-title`}
          className="frame grid-12 items-end gap-y-10 bg-ivory py-[var(--section-gap)]"
        >
          <figure className="col-span-11 md:col-span-5">
            <div data-ch-wipe="left" className="photo-hover relative aspect-[4/5] overflow-hidden md:max-h-[86svh]">
              <div data-ch-depth="7" className="absolute -inset-y-[10%] inset-x-0">
                <Picture
                  id={zanzariere.image}
                  sizes="(min-width: 768px) 40vw, 92vw"
                  className="absolute inset-0"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
            </div>
            <figcaption className="mt-3 text-[0.875rem] text-muted">Ambientazione illustrativa · Zanzariera scorrevole</figcaption>
          </figure>
          <div className="col-span-12 md:col-span-5 md:col-start-8 md:pb-[12svh]">
            <Title chapter={zanzariere} className="text-title" />
            <p className="mt-6 max-w-[36ch]">{zanzariere.text}</p>
            <ChapterLink href={zanzariere.href}>{zanzariere.cta}</ChapterLink>
          </div>
        </article>

        {/* 5 — two pictures at two depths */}
        <article
          id={schermature.id}
          data-chapter
          aria-labelledby={`${schermature.id}-title`}
          className="frame relative bg-sand py-[var(--section-gap)]"
        >
          <div className="grid-12 items-start gap-y-8">
            <figure className="col-span-12 md:col-span-8">
              <div data-ch-wipe="right" className="photo-hover relative aspect-[3/2] overflow-hidden">
                <div data-ch-depth="6" className="absolute -inset-y-[10%] inset-x-0">
                  <Picture
                    id={schermature.image}
                    sizes="(min-width: 768px) 66vw, 100vw"
                    className="absolute inset-0"
                    imgClassName="h-full w-full object-cover"
                  />
                </div>
              </div>
            </figure>
            <figure className="relative z-10 col-span-7 col-start-6 -mt-[24%] md:col-span-4 md:col-start-9 md:mt-[16%]">
              <div data-ch-wipe="left" className="photo-hover relative aspect-[4/5] overflow-hidden outline-[clamp(6px,0.8vw,12px)] outline-sand outline-solid">
                <div data-ch-depth="14" className="absolute -inset-y-[12%] inset-x-0">
                  <Picture
                    id={schermature.second!}
                    sizes="(min-width: 768px) 32vw, 58vw"
                    className="absolute inset-0"
                    imgClassName="h-full w-full object-cover"
                  />
                </div>
              </div>
            </figure>
          </div>
          <div className="grid-12 mt-12 items-end gap-y-6 md:mt-16">
            <div className="col-span-12 md:col-span-6">
              <Title chapter={schermature} className="text-title" />
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9">
              <p className="max-w-[36ch]">{schermature.text}</p>
              <ChapterLink href={schermature.href}>{schermature.cta}</ChapterLink>
            </div>
          </div>
        </article>
      </div>

      {/* Chapter indicator, kept inside the right page margin so it never covers content. */}
      <nav
        aria-label="Capitoli delle soluzioni"
        className={`fixed top-1/2 right-[max(6px,calc(var(--margin)/2-6px))] z-40 -translate-y-1/2 transition-[opacity,visibility] duration-500 ${
          active >= 0 ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <p aria-live="polite" className="sr-only">
          {active >= 0 ? `Capitolo: ${chapters[active].name}` : ""}
        </p>
        <ol className="flex flex-col gap-1">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-label={c.name}
                aria-current={i === active ? "step" : undefined}
                className="group flex h-9 w-3 items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={`block w-[3px] transition-[height,background-color] duration-500 ease-[var(--ease-out)] ${
                    i === active ? "h-8 bg-bronze" : "h-4 bg-taupe group-hover:bg-bronze"
                  }`}
                />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
