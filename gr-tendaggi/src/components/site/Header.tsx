"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { company, solutions, studio, legal, fullAddress } from "@/lib/site";
import { Picture } from "@/components/ui/Picture";
import { Magnetic } from "@/components/ui/Magnetic";
import type { ImageId } from "@/lib/images";
import { loadMotion, MOTION_OK } from "@/lib/gsap";

const previews: Record<string, ImageId> = {
  "/tende-da-interno": "veloColline",
  "/tende-da-sole": "tendaSole",
  "/outdoor": "terrazzaPergola",
  "/zanzariere": "zanzariera",
  "/schermature": "ristoranteTecniche",
  "/materiali": "campionario",
  "/chi-siamo": "doppiaAltezza",
  "/contatti": "panoramico",
};

// Pages that open on a full photograph; every other route (including 404) gets the solid bar.
const heroPages = new Set([
  "/",
  "/tende-da-interno",
  "/tende-da-sole",
  "/outdoor",
  "/zanzariere",
  "/schermature",
  "/materiali",
  "/chi-siamo",
]);

export function Header() {
  const pathname = usePathname();
  const [heroInView, setHeroInView] = useState(true);
  const [prevPath, setPrevPath] = useState(pathname);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string>("/tende-da-interno");
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  // Reset per-page state during render when the route changes.
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setHeroInView(true);
    setOpen(false);
  }
  const hasHero = heroPages.has(pathname);

  // Transparent over a photographic hero, solid elsewhere.
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setHeroInView(entry.isIntersecting), {
      rootMargin: "-80px 0px 0px 0px",
      threshold: 0,
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  // Hide while reading downwards, return on the way up.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 240);
          last = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Curtain-drop menu with focus trap.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) {
      // The header is invisible while the dialog is open, so focus returns once it is shown again.
      if (returnFocus.current) {
        returnFocus.current = false;
        requestAnimationFrame(() => toggleRef.current?.focus());
      }
      return;
    }

    let mm: gsap.MatchMedia | undefined;
    let cancelled = false;
    loadMotion().then(({ gsap }) => {
      if (cancelled) return;
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          menu,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" },
        );
        gsap.fromTo(
          menu.querySelectorAll("[data-menu-item]"),
          { yPercent: 110 },
          { yPercent: 0, duration: 1, stagger: 0.05, delay: 0.35 },
        );
        gsap.fromTo(
          menu.querySelectorAll("[data-menu-fade]"),
          { autoAlpha: 0 },
          { autoAlpha: 1, delay: 0.6, duration: 0.8 },
        );
      });
    });

    const first = menu.querySelector<HTMLElement>("a, button");
    first?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        returnFocus.current = true;
        setOpen(false);
      }
      if (e.key !== "Tab") return;
      const focusables = Array.from(menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      cancelled = true;
      mm?.revert();
    };
  }, [open]);

  const light = hasHero && heroInView && !open;
  const tone = light ? "text-ivory" : "text-charcoal";
  const ground = light ? "bg-transparent" : "bg-warm";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color] duration-500 ease-[var(--ease-out)] ${ground} ${tone} ${light ? "on-dark" : ""} ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${open ? "invisible" : ""}`}
      >
        <div className="frame flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link
            href="/"
            className="font-serif text-[1.0625rem] leading-none tracking-[-0.01em] whitespace-nowrap sm:text-[1.25rem]"
            aria-label={`${company.name}, home`}
          >
            GR Tendaggi <span className="font-light">Concept</span>
          </Link>

          <nav aria-label="Principale" className="flex items-center gap-3 sm:gap-8">
            <ul className="hidden items-center gap-8 text-[1rem] lg:flex">
              {studio.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="py-2 opacity-100 transition-opacity duration-200 hover:opacity-70 aria-[current=page]:underline aria-[current=page]:underline-offset-8"
                  >
                    {item.short ?? item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Magnetic>
              <Link
                href="/contatti#preventivo"
                className={`inline-flex min-h-11 items-center px-3.5 text-[0.875rem] font-medium transition-colors duration-200 sm:px-5 sm:text-[1rem] ${
                  light ? "bg-ivory text-charcoal hover:bg-sand" : "bg-charcoal text-ivory hover:bg-bronze-ink"
                }`}
              >
                Preventivo
              </Link>
            </Magnetic>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label="Apri il menu"
              className="group inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-3 text-[1rem]"
            >
              <span aria-hidden="true" className="hidden sm:inline">
                Menu
              </span>
              <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
                <span className="h-[1.5px] w-full bg-current transition-transform duration-300 group-hover:scale-x-75" />
                <span className="h-[1.5px] w-full origin-right bg-current transition-transform duration-300 group-hover:scale-x-50" />
              </span>
            </button>
          </nav>
        </div>
      </header>

      <div
        id="site-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu del sito"
        hidden={!open}
        className="on-dark fixed inset-0 z-[70] overflow-y-auto bg-charcoal text-ivory"
      >
        <div className="frame flex min-h-[100svh] flex-col">
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Link href="/" onClick={close} className="font-serif text-[1.125rem] leading-none sm:text-[1.25rem]">
              GR Tendaggi <span className="font-light">Concept</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                returnFocus.current = true;
                close();
              }}
              className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-[1rem]"
            >
              Chiudi
              <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </div>

          <div className="grid-12 flex-1 items-center gap-y-12 py-10">
            <nav aria-label="Menu" className="col-span-12 lg:col-span-7">
              <ul className="flex flex-col gap-1">
                {[...solutions, ...studio].map((item) => (
                  <li key={item.href} className="overflow-hidden">
                    <Link
                      href={item.href}
                      onClick={close}
                      onMouseEnter={() => setPreview(item.href)}
                      onFocus={() => setPreview(item.href)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      data-menu-item
                      className="group inline-flex items-baseline gap-4 py-1 font-serif text-title leading-[1.08] font-light tracking-[-0.02em] transition-colors duration-300 hover:text-sand aria-[current=page]:text-sand"
                    >
                      <span className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-3">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div
              data-menu-fade
              className="relative col-span-4 col-start-9 hidden aspect-[4/5] overflow-hidden lg:block"
            >
              {Object.entries(previews).map(([href, id]) => (
                <Picture
                  key={href}
                  id={id}
                  sizes="30vw"
                  alt=""
                  className={`absolute inset-0 transition-opacity duration-700 ${preview === href ? "opacity-100" : "opacity-0"}`}
                  imgClassName="h-full w-full object-cover"
                />
              ))}
            </div>
          </div>

          <div
            data-menu-fade
            className="grid items-start gap-6 pb-8 text-[1rem] text-sand sm:grid-cols-2 lg:grid-cols-4"
          >
            <p>{fullAddress}</p>
            <p>
              <Link href="/contatti#preventivo" onClick={close} className="btn btn-light">
                Richiedi un preventivo
              </Link>
            </p>
            <p className="flex flex-col">
              {company.phones.map((p) => (
                <a key={p.href} href={p.href} className="hover:text-ivory">
                  {p.label}
                </a>
              ))}
              <a href={`mailto:${company.email}`} className="hover:text-ivory">
                {company.email}
              </a>
            </p>
            <p className="flex gap-6 sm:justify-end">
              {legal.map((l) => (
                <Link key={l.href} href={l.href} onClick={close} className="hover:text-ivory">
                  {l.label}
                </Link>
              ))}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
