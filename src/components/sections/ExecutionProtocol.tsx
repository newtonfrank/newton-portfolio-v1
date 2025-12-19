"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Cpu, Palette, Code2, Rocket } from "lucide-react";

const phases = [
    {
        id: "init",
        code: "// INITIALIZATION",
        title: "Requirements & Strategy",
        desc: "System analysis, stakeholder alignment, technical discovery, and project architecture planning.",
        icon: Cpu,
        step: "01"
    },
    {
        id: "arch",
        code: "// ARCHITECTURE",
        title: "UI/UX & System Design",
        desc: "Wireframing, prototyping, design systems, and component hierarchy mapping.",
        icon: Palette,
        step: "02"
    },
    {
        id: "exec",
        code: "// EXECUTION",
        title: "Code & Logic",
        desc: "Feature development, API integration, state management, and unit testing.",
        icon: Code2,
        step: "03"
    },
    {
        id: "deploy",
        code: "// DEPLOYMENT",
        title: "CI/CD & Launch",
        desc: "Build optimization, automated testing, staging review, and production release.",
        icon: Rocket,
        step: "04"
    }
];

const PhaseCard = ({ phase, index }: { phase: typeof phases[0], index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex items-center gap-6 md:gap-10"
        >
            {/* Timeline Node */}
            <div className="relative z-10 flex items-center justify-center">
                <motion.div
                    animate={isInView ? {
                        boxShadow: '0 0 25px rgba(0,255,255,0.3)',
                        scale: 1.05
                    } : { scale: 1, boxShadow: 'none' }}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border bg-black transition-all duration-500
                        ${isInView ? 'border-cyan-500/60' : 'border-white/10'}`}
                >
                    <phase.icon className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-500 ${isInView ? 'text-cyan-400' : 'text-neutral-600'}`} />
                </motion.div>
            </div>

            {/* Content Card */}
            <motion.div
                animate={isInView ? { opacity: 1 } : { opacity: 0.4 }}
                className={`flex-1 bg-black/40 border rounded-lg p-4 md:p-6 backdrop-blur-sm transition-all duration-500
                    ${isInView ? 'border-white/20' : 'border-white/5'}`}
            >
                <div className="flex items-center gap-3 mb-3">
                    <phase.icon className={`w-4 h-4 transition-colors duration-500 ${isInView ? 'text-cyan-500' : 'text-neutral-600'}`} />
                    <code className={`text-xs font-mono transition-colors duration-500 ${isInView ? 'text-cyan-500' : 'text-neutral-600'}`}>
                        {phase.code}
                    </code>
                </div>
                <h3 className={`text-base md:text-lg font-semibold mb-2 transition-colors duration-500 ${isInView ? 'text-white' : 'text-neutral-600'}`}>
                    {phase.title}
                </h3>
                <p className={`text-xs md:text-sm leading-relaxed transition-colors duration-500 ${isInView ? 'text-neutral-400' : 'text-neutral-700'}`}>
                    {phase.desc}
                </p>
            </motion.div>
        </motion.div>
    );
};

export const ExecutionProtocol = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section id="execution" className="py-20 md:py-32 px-4 relative" ref={containerRef}>
            <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-xs md:text-sm font-mono text-cyan-500 tracking-[0.3em] md:tracking-[0.5em] mb-4">WORKFLOW_PROTOCOL</h2>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">EXECUTION</h1>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Vertical Line Background */}
                    <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-white/10" />

                    {/* Animated Progress Line */}
                    <motion.div
                        className="absolute left-6 md:left-8 top-0 w-px bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500"
                        style={{ height: lineHeight }}
                    />

                    {/* Phase Cards */}
                    <div className="space-y-12 md:space-y-16 relative z-10">
                        {phases.map((phase, i) => (
                            <PhaseCard key={phase.id} phase={phase} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
