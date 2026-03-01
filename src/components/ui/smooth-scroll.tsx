"use client";
import { ReactLenis as Lenis } from "lenis/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    return (
        <Lenis
            root
            options={{
                duration: 1.2,
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
            }}
        >
            {children}
        </Lenis>
    );
}
