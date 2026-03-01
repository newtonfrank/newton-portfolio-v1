"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSpectrum } from "@/store/useSpectrum";

const milestones = [
    { year: "2020", title: "Started Coding", desc: "Discovered the magic of building things with code" },
    { year: "2021", title: "React & Design", desc: "Fell in love with React and visual design systems" },
    { year: "2022", title: "First Freelance", desc: "Built real products for real businesses" },
    { year: "2023", title: "Full Stack", desc: "Expanded into backend, databases, and cloud" },
    { year: "2024", title: "3D & Creative", desc: "Dove into Three.js, shaders, and creative coding" },
    { year: "NOW", title: "The Nexus", desc: "Building at the intersection of code and design" },
];

const devManifesto = [
    "I think in algorithms, architecture, and logic.",
    "I build systems that scale, perform, and endure.",
    "Clean code isn't just practice — it's philosophy.",
    "Every function has a purpose. Every variable tells a story.",
];

const designManifesto = [
    "I think in composition, color theory, and emotion.",
    "I craft interfaces that feel alive and delightful.",
    "Design isn't decoration — it's communication.",
    "Every pixel matters. Every transition has meaning.",
];

export function About() {
    const mode = useSpectrum((s) => s.getMode());
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const photoY = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const devTextY = useTransform(scrollYProgress, [0, 1], [80, -40]);
    const designTextY = useTransform(scrollYProgress, [0, 1], [-40, 80]);

    return (
        <section id="about" ref={sectionRef} className="relative py-32 md:py-40 overflow-hidden">
            <div className="section-container">
                {/* Section header */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <span
                        className="text-xs uppercase tracking-[0.3em] mb-4 block"
                        style={{
                            color: "var(--color-accent)",
                            fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                        }}
                    >
                        {mode === "dev" ? "// 01. about" : "01 — About"}
                    </span>
                    <h2 className="heading-lg text-4xl md:text-5xl" style={{ color: "var(--color-text)" }}>
                        {mode === "dev" ? "operator_profile()" : "The Origin Story"}
                    </h2>
                </motion.div>

                {/* Split manifesto */}
                <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-24">
                    {/* Dev column */}
                    <motion.div className="space-y-6" style={{ y: devTextY }}>
                        <h3 className="font-mono text-sm uppercase tracking-wider" style={{ color: "var(--color-accent)" }}>
                            {mode === "dev" ? "// by_day" : "By Day"}
                        </h3>
                        {devManifesto.map((line, i) => (
                            <motion.p
                                key={i}
                                className="text-sm leading-relaxed"
                                style={{
                                    color: "var(--color-text-secondary)",
                                    fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                }}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                {mode === "dev" ? `> ${line}` : line}
                            </motion.p>
                        ))}
                    </motion.div>

                    {/* Photo */}
                    <motion.div
                        className="flex items-center justify-center"
                        style={{ y: photoY }}
                    >
                        <div className="relative">
                            <motion.div
                                className="relative w-48 h-56 md:w-56 md:h-64 overflow-hidden"
                                style={{ borderRadius: "var(--border-radius)" }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <img
                                    src="/newton-profile.jpg"
                                    alt="Newton Frank"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                {/* Overlay that shifts with spectrum */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            mode === "dev"
                                                ? "linear-gradient(180deg, transparent 40%, rgba(0,243,255,0.15))"
                                                : "linear-gradient(180deg, transparent 40%, rgba(232,93,4,0.1))",
                                        mixBlendMode: "overlay",
                                    }}
                                />
                            </motion.div>
                            {/* Decorative border */}
                            <div
                                className="absolute -inset-2 -z-10 opacity-30"
                                style={{
                                    border: `1px solid var(--color-accent)`,
                                    borderRadius: "var(--border-radius)",
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Design column */}
                    <motion.div className="space-y-6" style={{ y: designTextY }}>
                        <h3
                            className="text-sm uppercase tracking-wider"
                            style={{
                                color: "var(--color-accent-alt)",
                                fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                            }}
                        >
                            {mode === "dev" ? "// by_night" : "By Night"}
                        </h3>
                        {designManifesto.map((line, i) => (
                            <motion.p
                                key={i}
                                className="text-sm leading-relaxed"
                                style={{ color: "var(--color-text-secondary)" }}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                {mode === "dev" ? `> ${line}` : line}
                            </motion.p>
                        ))}
                    </motion.div>
                </div>

                {/* Center statement */}
                <motion.div
                    className="text-center mb-24"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="spectrum-divider mb-8" />
                    <p
                        className="heading-lg text-2xl md:text-3xl max-w-xl mx-auto"
                        style={{ color: "var(--color-text)" }}
                    >
                        Together, they orbit as{" "}
                        <span style={{ color: "var(--color-accent)" }}>one</span>.
                    </p>
                    <div className="spectrum-divider mt-8" />
                </motion.div>

                {/* Orbital Timeline */}
                <div>
                    <h3
                        className="text-center text-xs uppercase tracking-[0.3em] mb-16"
                        style={{
                            color: "var(--color-text-secondary)",
                            fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                        }}
                    >
                        {mode === "dev" ? "// orbital_path" : "The Journey"}
                    </h3>

                    <div className="relative max-w-2xl mx-auto">
                        {/* Central line */}
                        <div
                            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
                            style={{
                                background: `linear-gradient(180deg, transparent, var(--color-accent) 20%, var(--color-accent-alt) 80%, transparent)`,
                                opacity: 0.3,
                            }}
                        />

                        {milestones.map((m, i) => (
                            <motion.div
                                key={m.year}
                                className={`relative flex items-center gap-6 mb-12 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                {/* Content */}
                                <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                                    <div className="glass-card p-4 inline-block">
                                        <span
                                            className="text-xs font-mono block mb-1"
                                            style={{ color: "var(--color-accent)" }}
                                        >
                                            {m.year}
                                        </span>
                                        <h4
                                            className="text-sm font-semibold mb-1"
                                            style={{ color: "var(--color-text)" }}
                                        >
                                            {m.title}
                                        </h4>
                                        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                                            {m.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Orbital node */}
                                <div className="relative z-10 flex items-center justify-center w-4 h-4 shrink-0">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            background: "var(--color-accent)",
                                            boxShadow: `0 0 12px var(--color-glow)`,
                                        }}
                                    />
                                    <div
                                        className="absolute w-6 h-6 rounded-full animate-ping"
                                        style={{
                                            background: "var(--color-accent)",
                                            opacity: 0.15,
                                        }}
                                    />
                                </div>

                                {/* Spacer */}
                                <div className="flex-1" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
