"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { registerLenis } from "@/lib/lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Drives Lenis from GSAP's ticker so Lenis and ScrollTrigger never disagree
 * about scroll position. Under reduced motion Lenis is never constructed at
 * all — the browser's native scroll is the reduced-motion path.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    registerGsap();

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    // Published so the overlay's scroll lock can pause it; under reduced motion
    // we return above and nothing is ever registered.
    registerLenis(lenis);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      registerLenis(null);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
