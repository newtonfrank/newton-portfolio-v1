"use client";

import { useEffect, type RefObject } from "react";

/**
 * Owns everything the instrument does at runtime: canvas sizing now, and from
 * Task 3 the sampling, ring buffers, drawing, and suspension.
 *
 * Finds its elements by `data-` attribute inside the root, matching the pattern
 * `useHeroEntrance` uses for `[data-track]` — the component owns the markup,
 * the hook owns the behaviour, and no refs are drilled between them.
 */
export function useInstrument(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const canvases = Array.from(root.querySelectorAll<HTMLCanvasElement>("[data-trace]"));

    // Canvases have no intrinsic size. Match the backing store to the CSS box
    // times DPR, or the hairlines render soft.
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      for (const canvas of canvases) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root);

    return () => observer.disconnect();
  }, [rootRef]);
}
