"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Tracks `prefers-reduced-motion`, live.
 *
 * Returns `false` during SSR and on the first client render, then corrects
 * after mount. Components must therefore treat the reduced-motion path as a
 * *disable* (skip the animation) rather than an alternate initial render, or
 * they will hydrate mismatched.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
