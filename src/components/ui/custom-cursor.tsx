"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useSpectrum } from "@/store/useSpectrum";
import { useIsMobile } from "@/hooks/useIsMobile";

export function CustomCursor() {
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
    const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });
    // Trail ring springs — MUST be at top level, not inside conditional render
    const trailX = useSpring(cursorX, { stiffness: 150, damping: 20 });
    const trailY = useSpring(cursorY, { stiffness: 150, damping: 20 });
    const mode = useSpectrum((s) => s.getMode());
    const isHovering = useRef(false);
    const [hovering, setHovering] = React.useState(false);
    const isMobile = useIsMobile();

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        },
        [cursorX, cursorY]
    );

    useEffect(() => {
        if (isMobile) return;

        window.addEventListener("mousemove", handleMouseMove);

        // Detect hoverable elements
        const handleOver = () => {
            isHovering.current = true;
            setHovering(true);
        };
        const handleOut = () => {
            isHovering.current = false;
            setHovering(false);
        };

        const observe = () => {
            document.querySelectorAll("a, button, [role='button'], input, textarea, select, [data-cursor-hover]").forEach((el) => {
                el.addEventListener("mouseenter", handleOver);
                el.addEventListener("mouseleave", handleOut);
            });
        };

        observe();
        const observer = new MutationObserver(observe);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            observer.disconnect();
        };
    }, [handleMouseMove, isMobile]);

    if (isMobile) return null;

    return (
        <>
            {/* Main cursor dot/block */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            >
                <motion.div
                    animate={{
                        width: hovering ? (mode === "dev" ? 14 : 40) : mode === "dev" ? 10 : 8,
                        height: hovering ? (mode === "dev" ? 14 : 40) : mode === "dev" ? 16 : 8,
                        borderRadius: mode === "dev" ? (hovering ? "2px" : "1px") : "50%",
                        opacity: mode === "dev" ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                        background:
                            mode === "dev"
                                ? "var(--color-accent)"
                                : hovering
                                    ? "transparent"
                                    : "var(--color-accent)",
                        border: hovering && mode !== "dev" ? "1px solid var(--color-accent)" : "none",
                        mixBlendMode: mode === "design" ? "difference" : "normal",
                    }}
                />
            </motion.div>

            {/* Trailing ring — always rendered, hidden via opacity in dev mode */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998]"
                style={{
                    x: trailX,
                    y: trailY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{ opacity: mode === "dev" ? 0 : 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    animate={{
                        width: hovering ? 50 : 30,
                        height: hovering ? 50 : 30,
                        opacity: hovering ? 0.6 : 0.3,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                        borderRadius: "50%",
                        border: "1px solid var(--color-accent)",
                    }}
                />
            </motion.div>
        </>
    );
}
