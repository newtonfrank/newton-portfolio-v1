"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useSpectrum } from "@/store/useSpectrum";

export function SpectrumSlider() {
    const trackRef = useRef<HTMLDivElement>(null);
    const setPosition = useSpectrum((s) => s.setPosition);
    const [dragging, setDragging] = useState(false);

    // Use a ref for position to avoid re-renders during drag
    const posRef = useRef(useSpectrum.getState().position);
    const motionPos = useMotionValue(posRef.current);
    const springPos = useSpring(motionPos, { stiffness: 300, damping: 30 });

    // ALL useTransform hooks declared at the top level (never inline)
    const thumbGlowColor = useTransform(
        springPos,
        [0, 0.5, 1],
        ["#111111", "#4a4a4a", "#7a7a7a"]
    );
    const trackFillColor = useTransform(
        springPos,
        [0, 1],
        ["#111111", "#7a7a7a"]
    );
    const fillWidth = useTransform(springPos, (v) => `${v * 100}%`);
    const thumbLeft = useTransform(springPos, (v) => `calc(${v * 100}% - 8px)`);
    const thumbShadow = useTransform(
        thumbGlowColor,
        (c) => `0 0 10px ${c}, 0 0 20px ${c}40`
    );

    // Initialize CSS variables on mount
    useEffect(() => {
        setPosition(posRef.current);
    }, [setPosition]);

    // Subscribe to external position changes without re-rendering
    useEffect(() => {
        const unsub = useSpectrum.subscribe((state) => {
            posRef.current = state.position;
        });
        return unsub;
    }, []);

    // Drag handlers using native DOM events
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let active = false;

        const getPos = (clientX: number) => {
            const rect = track.getBoundingClientRect();
            return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        };

        const applyPos = (newPos: number) => {
            motionPos.set(newPos);
            posRef.current = newPos;
            setPosition(newPos);
        };

        const onDown = (e: PointerEvent) => {
            active = true;
            setDragging(true);
            applyPos(getPos(e.clientX));
        };

        const onMove = (e: PointerEvent) => {
            if (!active) return;
            applyPos(getPos(e.clientX));
        };

        const onUp = () => {
            if (!active) return;
            active = false;
            setDragging(false);
        };

        track.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);

        return () => {
            track.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);
        };
    }, [motionPos, setPosition]);

    const mode = useSpectrum((s) => s.getMode());

    return (
        <motion.div
            className="fixed z-50 flex items-center gap-3 sm:gap-4 px-4 py-2 rounded-full"
            style={{
                bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
                left: "50%",
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                maxWidth: "calc(100vw - 2rem)",
            }}
            initial={{ x: "-50%", y: 60, opacity: 0 }}
            animate={{ x: "-50%", y: 0, opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.6 }}
        >
            <motion.span
                className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest select-none whitespace-nowrap"
                style={{ color: mode === "dev" ? "#111111" : "rgba(255,255,255,0.35)" }}
                animate={{ opacity: mode === "dev" ? 1 : 0.6 }}
            >
                {"<DEV/>"}
            </motion.span>

            <div
                ref={trackRef}
                className="relative h-2 rounded-full touch-none select-none flex-1"
                style={{
                    minWidth: "120px",
                    maxWidth: "280px",
                    background: "rgba(255,255,255,0.08)",
                }}
            >
                <motion.div
                    className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
                    style={{
                        width: fillWidth,
                        background: trackFillColor,
                        opacity: 0.5,
                    }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-3 rounded-full pointer-events-none"
                    style={{ background: "#4a4a4a", opacity: 0.4 }}
                />
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                    style={{
                        left: thumbLeft,
                        width: 16,
                        height: 16,
                        background: thumbGlowColor,
                        boxShadow: thumbShadow,
                    }}
                    animate={{ scale: dragging ? 1.3 : 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                />
            </div>

            <motion.span
                className="text-[10px] sm:text-[11px] uppercase tracking-widest select-none whitespace-nowrap"
                style={{
                    color: mode === "design" ? "#7a7a7a" : "rgba(255,255,255,0.35)",
                    fontFamily: "var(--font-outfit, sans-serif)",
                }}
                animate={{ opacity: mode === "design" ? 1 : 0.6 }}
            >
                Design
            </motion.span>
        </motion.div>
    );
}
