"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSpectrum } from "@/store/useSpectrum";
import dynamic from "next/dynamic";

const HeroCanvas = dynamic(
    () => import("@/components/canvas/HeroObject").then((m) => ({ default: m.HeroCanvas })),
    { ssr: false }
);

export function Hero() {
    const mode = useSpectrum((s) => s.getMode());
    const position = useSpectrum((s) => s.position);

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* 3D Canvas Background */}
            <HeroCanvas />

            {/* Content */}
            <div className="section-container relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-16 py-20 lg:py-0">
                {/* Left: Dev Panel — hidden on small mobile */}
                <motion.div
                    className="hidden sm:flex flex-1 w-full"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.8, duration: 0.8 }}
                >
                    <div
                        className="glass-card p-6 md:p-8"
                        style={{
                            opacity: mode === "design" ? 0.5 : 1,
                            transition: "opacity 0.4s ease",
                        }}
                    >
                        <div className="font-mono text-sm space-y-2" style={{ color: "var(--color-text-secondary)" }}>
                            <span className="text-emerald-400/70">{">"} newton</span>
                            <div>
                                <span className="text-cyan-400/70">role</span>
                                <span className="text-white/40">: </span>
                                <span style={{ color: "var(--color-accent)" }}>developer</span>
                            </div>
                            <div>
                                <span className="text-cyan-400/70">stack</span>
                                <span className="text-white/40">: </span>
                                <span className="text-amber-300/80">[&quot;React&quot;, &quot;Next.js&quot;, &quot;Three.js&quot;]</span>
                            </div>
                            <div>
                                <span className="text-cyan-400/70">status</span>
                                <span className="text-white/40">: </span>
                                <span className="text-emerald-400/80">&quot;orbiting_the_future&quot;</span>
                            </div>
                            <div className="pt-2">
                                <motion.span
                                    className="inline-block w-2 h-4"
                                    style={{ background: "var(--color-accent)" }}
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Center spacer for 3D object */}
                <div className="hidden lg:block flex-1" />

                {/* Right: Design Panel */}
                <motion.div
                    className="flex-1 w-full text-center sm:text-right lg:text-right"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 3, duration: 0.8 }}
                >
                    <div
                        style={{
                            opacity: mode === "dev" ? 0.6 : 1,
                            transition: "opacity 0.4s ease",
                        }}
                    >
                        <motion.h1
                            className="heading-xl text-4xl sm:text-5xl md:text-7xl lg:text-9xl mb-4"
                            style={{
                                color: "var(--color-text)",
                                textShadow: `0 0 30px color-mix(in srgb, var(--color-glow) 40%, transparent), 0 2px 20px rgba(0,0,0,0.6)`,
                            }}
                        >
                            Newton
                            <br />
                            <span style={{ color: "var(--color-accent)" }}>Frank</span>
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl mb-6"
                            style={{
                                color: "var(--color-text)",
                                fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                opacity: 0.85,
                                textShadow: "0 1px 10px rgba(0,0,0,0.4)",
                            }}
                        >
                            {mode === "dev"
                                ? "// Full-Stack Developer"
                                : "Digital Architect & Creative Developer"}
                        </motion.p>
                        <p
                            className="text-sm max-w-md sm:ml-auto mx-auto sm:mx-0"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            I craft experiences where gravity meets design — building
                            performant, beautiful digital products at the intersection of code
                            and creativity.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4, duration: 1 }}
            >
                <span
                    className="text-[10px] uppercase tracking-[0.3em]"
                    style={{
                        color: "var(--color-text-secondary)",
                        fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                    }}
                >
                    {mode === "dev" ? "scroll_down()" : "Explore"}
                </span>
                <motion.div
                    className="w-[1px] h-8"
                    style={{ background: "var(--color-accent)" }}
                    animate={{ scaleY: [1, 0.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.div>
        </section>
    );
}
