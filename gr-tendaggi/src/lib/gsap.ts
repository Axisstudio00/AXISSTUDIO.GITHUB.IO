"use client";

import { useEffect, useRef, type DependencyList, type RefObject } from "react";

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerType = typeof import("gsap/ScrollTrigger").ScrollTrigger;
export type Motion = { gsap: Gsap; ScrollTrigger: ScrollTriggerType };

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

let loading: Promise<Motion> | null = null;

/** GSAP is loaded after first paint so it never sits on the critical rendering path. */
export function loadMotion(): Promise<Motion> {
  if (!loading) {
    loading = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      g.gsap.registerPlugin(st.ScrollTrigger);
      g.gsap.defaults({ ease: "expo.out", duration: 0.9 });
      return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
    });
  }
  return loading;
}

/** Scoped GSAP setup that reverts on unmount. */
export function useMotion<T extends HTMLElement>(
  setup: (root: T, mm: gsap.MatchMedia, motion: Motion) => void,
  deps: DependencyList = [],
): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    let mm: gsap.MatchMedia | undefined;
    let cancelled = false;
    loadMotion().then((motion) => {
      const root = ref.current;
      if (cancelled || !root) return;
      mm = motion.gsap.matchMedia(root);
      setup(root, mm, motion);
    });
    return () => {
      cancelled = true;
      mm?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
