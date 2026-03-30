"use client";

import { ReactLenis as Lenis } from "lenis/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <Lenis
      root
      options={{
        duration: 1.45,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1.6,
        wheelMultiplier: 0.95,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      }}
    >
      {children}
    </Lenis>
  );
}
