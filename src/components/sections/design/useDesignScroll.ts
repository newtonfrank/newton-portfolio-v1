"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { ScrollTrigger, registerGsap } from "@/lib/gsap";

interface Options {
  sectionRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLElement | null>;
  /** How many cards, for the counter. */
  count: number;
  /** False in rail mode — the pin never runs and native scroll is left alone. */
  enabled: boolean;
}

/**
 * Pins the stage and turns vertical scroll into a 0…1 progress value.
 *
 * Progress is published on a **ref**, not in state: the scene reads it inside
 * `useFrame`, so routing it through React would re-render seventeen meshes at
 * 60fps for nothing. Only the visible counter — which changes seventeen times
 * over the whole section, not every frame — is state.
 */
export function useDesignScroll({ sectionRef, stageRef, count, enabled }: Options) {
  const progress = useRef(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!enabled || !section || !stage) return;

    registerGsap();

    // The runway is a multiple of viewport height rather than a pixel distance,
    // so the section takes the same number of "flicks" to cross at any size.
    const distance = () => window.innerHeight * 2.6;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${distance()}`,
      pin: stage,
      pinSpacing: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress.current = self.progress;
        // Written straight to the DOM rather than through state: the hairline
        // should track the scroll continuously, and that is sixty re-renders a
        // second if React is in the loop.
        section.style.setProperty("--progress", String(self.progress));
        const next = Math.min(count - 1, Math.round(self.progress * (count - 1)));
        setIndex((current) => (current === next ? current : next));
      },
    });

    return () => {
      trigger.kill();
      section.style.removeProperty("--progress");
    };
  }, [sectionRef, stageRef, count, enabled]);

  // Keep the pin honest when fonts or images settle the layout underneath it.
  useEffect(() => {
    if (!enabled) return;
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, [enabled]);

  return { progress, index };
}
