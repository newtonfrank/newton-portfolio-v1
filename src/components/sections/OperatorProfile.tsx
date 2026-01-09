"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Code2, Briefcase, Calendar, Cpu, Zap, Shield, Terminal } from "lucide-react";
import { GitHubActivity } from "@/components/ui/GitHubActivity";

const stats = [
    { label: "LOCATION", value: "Tumkur, Karnataka, India", icon: MapPin },
    { label: "CLASS", value: "Full Stack Engineer", icon: Code2 },
    { label: "SPECIALIZATION", value: "React / Next.js / TypeScript ", icon: Cpu },
    { label: "EXPERIENCE", value: "1+ Years", icon: Calendar },
    { label: "FOCUS", value: "DEVOPS / Web Performance / Security", icon: Zap },
    { label: "STATUS", value: "AVAILABLE", icon: Shield },
];

// Memoized Stat Item Component
const StatItem = memo(({ stat, index }: { stat: typeof stats[0]; index: number }) => (
    <motion.div
        key={stat.label}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="group"
    >
        <div className="flex items-center gap-2 mb-1">
            <stat.icon className="w-3 h-3 text-cyan-500/70" />
            <span className="text-[10px] md:text-xs font-mono text-neutral-500">{stat.label}</span>
        </div>
        <p className={`text-sm md:text-base font-mono ${stat.label === 'STATUS' ? 'text-green-400' : 'text-white'}`}>
            {stat.value}
        </p>
    </motion.div>
));
StatItem.displayName = 'StatItem';

// Memoized Tech Tag Component
const TechTag = memo(({ tech }: { tech: string }) => (
    <span
        key={tech}
        className="px-3 py-1 text-[10px] md:text-xs font-mono bg-white/5 border border-white/10 rounded-full text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
    >
        {tech}
    </span>
));
TechTag.displayName = 'TechTag';

export const OperatorProfile = memo(() => {
    const [isGlitching, setIsGlitching] = useState(false);

    return (
        <section id="about" className="min-h-screen py-20 md:py-32 px-4 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,255,255,0.05),transparent_50%)]" />

            <div className="max-w-6xl w-full relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-20">
                    <h2 className="text-xs md:text-sm font-mono text-cyan-500 tracking-[0.3em] md:tracking-[0.5em] mb-4">SYSTEM_OPERATOR</h2>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">IDENTITY</h1>
                </div>

                {/* Holographic ID Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-[0_0_60px_rgba(0,255,255,0.1)] mb-12"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        {/* Profile Image Column */}
                        <div className="relative p-6 md:p-10 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                            <div
                                className="relative group"
                                onMouseEnter={() => setIsGlitching(true)}
                                onMouseLeave={() => setIsGlitching(false)}
                            >
                                {/* Outer glow ring */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />

                                {/* Profile container */}
                                <div className={`relative w-40 h-40 md:w-56 md:h-56 rounded-full border-2 border-cyan-500/50 overflow-hidden ${isGlitching ? 'animate-pulse' : ''}`}>
                                    {/* Profile Image */}
                                    <Image
                                        src="/newton-profile.jpg"
                                        alt="Newton Frank"
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 768px) 160px, (max-width: 1200px) 224px, 224px"
                                        placeholder="blur"
                                        blurDataURL="/newton-profile-blur.jpg"
                                    />

                                    {/* Glitch effect overlay */}
                                    {isGlitching && (
                                        <motion.div
                                            className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay"
                                            animate={{
                                                x: [0, -2, 2, 0],
                                                opacity: [0.5, 1, 0.5]
                                            }}
                                            transition={{ duration: 0.1, repeat: Infinity }}
                                        />
                                    )}

                                    {/* Scanline effect */}
                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30" />
                                </div>

                                {/* Status indicator */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 px-3 py-1 rounded-full border border-cyan-500/30">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-mono text-green-400">ONLINE</span>
                                </div>
                            </div>
                        </div>

                        {/* Data Grid Column */}
                        <div className="col-span-1 md:col-span-2 p-6 md:p-10">
                            {/* Name Header */}
                            <div className="mb-8">
                                <h3 className="text-2xl md:text-4xl font-bold font-mono text-white mb-2">NEWTON FRANK</h3>
                                <p className="text-cyan-500 font-mono text-sm md:text-base">Creative Developer & Systems Architect</p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                                {stats.map((stat, i) => (
                                    <StatItem key={stat.label} stat={stat} index={i} />
                                ))}
                            </div>

                            {/* Bio Text */}
                            <div className="border-t border-white/10 pt-6">
                                <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-sans">
                                    Building digital experiences with a focus on motion, interaction, and performance.
                                    Specializing in React ecosystems, real-time data visualization, and creative development.
                                    Currently exploring WebGL, Three.js, and emerging Web3 technologies.
                                </p>
                            </div>

                            {/* Tech Tags */}
                            <div className="flex flex-wrap gap-2 mt-6">
                                {["React", "Next.js", "TypeScript", "Three.js", "Tailwind", "Node.js"].map((tech) => (
                                    <TechTag key={tech} tech={tech} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 md:px-10 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] md:text-xs font-mono text-neutral-600">ID: NEWTON-DEV-2024</span>
                        <span className="text-[10px] md:text-xs font-mono text-neutral-600">CLEARANCE: LEVEL-5</span>
                    </div>
                </motion.div>

                {/* GitHub Activity Widget */}
                <GitHubActivity username="newtonfrank" />
            </div>
        </section>
    );
});
OperatorProfile.displayName = 'OperatorProfile';
