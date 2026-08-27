"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * True only on devices with a fine pointer that can hover, and only when the
 * user has not asked for reduced motion. The gate for every cursor-driven
 * flourish (custom cursor, magnetic buttons, the floating project preview) so
 * touch and keyboard users always fall back to plain, static UI.
 *
 * Returns `false` on the server and first client render, then corrects after
 * mount — treat it as a progressive enhancement, never as initial layout.
 */
export function useFinePointer(): boolean {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    setFine(finePointer && canHover && !reduced);
  }, [reduced]);

  return fine;
}
