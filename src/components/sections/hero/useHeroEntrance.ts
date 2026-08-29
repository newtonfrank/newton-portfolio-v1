"use client";

import { useEffect, type RefObject } from "react";

/** Marquee px per scrolled px. Unchanged from the original inline effect. */
const SCROLL_SPEED = 0.85;

/**
 * Owns every transform applied to the name marquee. There is exactly one rAF
 * loop touching the offset, so scroll-driven motion and (from Task 5) the
 * load-time settle can never disagree about position.
 *
 * Reduced motion is checked synchronously here rather than via
 * `useReducedMotion`, which returns `false` on the first render and corrects
 * after mount — enough to leak a frame of motion to someone who asked for none.
 */
export function useHeroEntrance(containerRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = container.querySelector<HTMLElement>('[data-track="main"]');
    if (!main) return;

    // Width of one repeated unit. The strip is identical units end to end, so
    // wrapping on this is seamless — and keeps the offset small.
    let unit = 0;
    let scrollPos = 0;
    let lastScrollY = window.scrollY;
    let frame = 0;
    let alive = true;

    const measure = () => {
      const first = main.firstElementChild as HTMLElement | null;
      unit = first?.offsetWidth ?? 0;
    };

    const paint = () => {
      const pos = unit > 0 ? ((scrollPos % unit) + unit) % unit : scrollPos;
      main.style.transform = `translate3d(${-pos}px, 0, 0)`;
    };

    const step = () => {
      frame = 0;
      if (!alive) return;
      if (!unit) measure();
      const y = window.scrollY;
      scrollPos += (y - lastScrollY) * SCROLL_SPEED;
      lastScrollY = y;
      paint();
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    measure();
    // The real signal for "the type has its final metrics", replacing a 400ms
    // guess. The register lock in Task 5 is wrong if this is measured early.
    void document.fonts.ready.then(() => {
      if (alive) measure();
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [containerRef]);
}
