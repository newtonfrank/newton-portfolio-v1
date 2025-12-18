"use client";
import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-black px-4">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/20 via-black to-black pointer-events-none" />

            {/* Subtle Spotlight/Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center gap-6"
                >
                    {/* Tagline */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium text-neutral-300 tracking-wide">Available for Work</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white leading-tight">
                        Code. Design. <br />
                        <span className="text-neutral-500">Deploy.</span>
                    </h1>

                    {/* Description */}
                    <p className="max-w-xl text-lg md:text-xl text-neutral-400 leading-relaxed">
                        Crafting modern, minimal, and pixel-perfect digital experiences.
                        Bridging the gap between engineering and design.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row gap-4 mt-8">
                        <Link
                            href="#projects"
                            className="px-8 py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2"
                        >
                            View Selected Work <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="mailto:newtonfrank@outlook.in"
                            className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-colors"
                        >
                            Contact Me
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Simplified Footer/Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-neutral-500 text-sm"
            >
                Scroll to explore
            </motion.div>
        </section>
    );
};
