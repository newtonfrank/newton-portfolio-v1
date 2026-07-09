"use client";

import { useEffect, useRef, useState } from "react";
import { clamp } from "@/lib/utils";

interface ScrollProgress {
  /** Attach to the tall scroll section. */
  sectionRef: React.RefObject<HTMLElement | null>;
  /** Live position in slide units, e.g. 1.62. Read in useFrame, never rendered. */
  progressRef: React.RefObject<number>;
  /** Nearest slide. Changes rarely, so it is safe as state. */
  activeIndex: number;
}

/**
 * Maps scroll position within a tall section onto a fractional slide index.
 *
 * The fractional value lives in a ref because the WebGL scene reads it every
 * frame; putting it in state would re-render the tree 60 times a second. Only
 * the rounded index — which changes a handful of times per page — is state.
 */
export function useScrollProgress(slideCount: number): ScrollProgress {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slideCount < 2) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const travel = section.offsetHeight - window.innerHeight;
      if (travel <= 0) return;

      const scrolled = window.scrollY - section.offsetTop;
      const ratio = clamp(scrolled / travel, 0, 1);
      const progress = ratio * (slideCount - 1);

      progressRef.current = progress;

      const next = Math.round(progress);
      setActiveIndex((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [slideCount]);

  return { sectionRef, progressRef, activeIndex };
}
