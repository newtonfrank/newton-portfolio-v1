"use client";

import { useRef } from "react";
import { useInView, Variants } from "framer-motion";

interface ScrollRevealOptions {
    /** Trigger threshold (-100px to start before element is visible) */
    margin?: string;
    /** Only trigger once */
    once?: boolean;
    /** Base delay before animation starts */
    delay?: number;
    /** Animation duration */
    duration?: number;
    /** Direction to animate from */
    direction?: "up" | "down" | "left" | "right" | "none";
    /** Distance to animate from */
    distance?: number;
}

interface ScrollRevealReturn {
    ref: React.RefObject<HTMLElement | null>;
    isInView: boolean;
    variants: Variants;
    initial: string;
    animate: string;
    transition: { delay: number; duration: number; ease: number[] };
}

export function useScrollReveal({
    margin = "-80px",
    once = true,
    delay = 0,
    duration = 0.7,
    direction = "up",
    distance = 40,
}: ScrollRevealOptions = {}): ScrollRevealReturn {
    const ref = useRef<HTMLElement | null>(null);
    const isInView = useInView(ref, { once, margin: margin as any });

    const getInitialTransform = () => {
        switch (direction) {
            case "up": return { y: distance, x: 0 };
            case "down": return { y: -distance, x: 0 };
            case "left": return { x: distance, y: 0 };
            case "right": return { x: -distance, y: 0 };
            case "none": return { x: 0, y: 0 };
        }
    };

    const initial = getInitialTransform();

    const variants: Variants = {
        hidden: {
            opacity: 0,
            ...initial,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
        },
    };

    return {
        ref,
        isInView,
        variants,
        initial: "hidden",
        animate: isInView ? "visible" : "hidden",
        transition: {
            delay,
            duration,
            ease: [0.25, 0.46, 0.45, 0.94], // ease-out-quad
        },
    };
}

/**
 * Generate staggered delays for a list of items
 */
export function staggerDelay(index: number, baseDelay = 0, stagger = 0.1): number {
    return baseDelay + index * stagger;
}
