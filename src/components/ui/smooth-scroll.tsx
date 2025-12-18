"use client";
import { ReactLenis as Lenis } from "@studio-freight/react-lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    return (
        <Lenis root options={{ duration: 0.1 }}>
            {children}
        </Lenis>
    );
}
