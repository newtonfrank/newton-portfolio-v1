"use client";
import { ReactLenis as Lenis } from "lenis/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    return (
        <Lenis root options={{ duration: 0.1 }}>
            {children}
        </Lenis>
    );
}
