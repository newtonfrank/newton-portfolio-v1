"use client";

import { useEffect, useRef, useState } from "react";
import { lerp as lerpTokens } from "@/lib/motion";
import { cn, lerp } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./CustomCursor.module.css";

/**
 * Dot + ring cursor. The dot tracks the pointer exactly; the ring eases behind
 * it and swells over interactive elements. Spec: 03-DESIGN-SYSTEM.md D.14.
 *
 * Rendered only on fine-pointer devices with motion allowed — on touch or under
 * reduced motion it renders nothing and the native cursor is left untouched, so
 * it can never trap a user without a pointer.
 */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  // Hidden entirely while over a surface that supplies its own cursor visual —
  // e.g. the project list's floating "View" preview.
  const [suppressed, setSuppressed] = useState(false);

  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only when the device has a fine pointer that can hover.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    setEnabled(fine && canHover && !reduced);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.style.cursor = "none";

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...target };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    // Delegate hover state to any interactive ancestor.
    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      setSuppressed(Boolean(el?.closest('[data-cursor="none"]')));
      setHovering(Boolean(el?.closest('a, button, [data-cursor="hover"]')));
    };

    const render = () => {
      frame = requestAnimationFrame(render);
      ringPos.x = lerp(ringPos.x, target.x, lerpTokens.cursor);
      ringPos.y = lerp(ringPos.y, target.y, lerpTokens.cursor);
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    frame = requestAnimationFrame(render);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true">
      <div ref={dot} className={cn(styles.dot, suppressed && styles.hidden)} />
      <div
        ref={ring}
        className={cn(styles.ring, hovering && styles.ringHover, suppressed && styles.hidden)}
      />
    </div>
  );
}
