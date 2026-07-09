"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { duration, gsapEase } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import styles from "./Reveal.module.css";

interface RevealProps {
  children: React.ReactNode;
  /** Seconds. */
  delay?: number;
  className?: string;
}

/**
 * Standard scroll reveal: fade + rise, fires once at 85% of the viewport.
 * Under reduced motion the element is simply visible — no animation, no delay.
 *
 * Prefer this over ad-hoc ScrollTriggers in sections (BUILD_GUIDE.md 5.7).
 * useGSAP reverts on unmount, which is what prevents ScrollTrigger ghosts after
 * client-side navigation.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      registerGsap();
      gsap.from(root.current, {
        opacity: 0,
        y: 32,
        duration: duration.slow,
        ease: gsapEase.out,
        delay,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <div ref={root} className={cn(styles.root, className)}>
      {children}
    </div>
  );
}
