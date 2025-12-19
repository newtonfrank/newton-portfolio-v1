"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Search, Box, Code, Rocket, CheckCircle } from "lucide-react";

const phases = [
    {
        id: "01",
        title: "DISCOVERY",
        desc: "Analyzing requirements. Mapping the void.",
        icon: Search,
        color: "text-blue-400"
    },
    {
        id: "02",
        title: "DESIGN",
        desc: "Wireframing the interface. Sculpting the UX.",
        icon: Box,
        color: "text-purple-400"
    },
    {
        id: "03",
        title: "DEVELOPMENT",
        desc: "Writing the engine. React / Next.js / Node.",
        icon: Code,
        color: "text-cyan-400"
    },
    {
        id: "04",
        title: "DEPLOYMENT",
        desc: "Ignition sequence. CI/CD & Optimization.",
        icon: Rocket,
        color: "text-green-400"
    }
];

export const Pipeline = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section ref={containerRef} id="methodology" className="relative min-h-[300vh] bg-[#050505]">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

                {/* Central Pipeline Track */}
                <div className="absolute left-10 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/5">
                    <motion.div
                        style={{ scaleY, transformOrigin: "top" }}
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500 via-purple-500 to-green-400"
                    />
                </div>

                {/* Floating "Head" (Traveler Icon) */}
                {/* Note: This is tricky with pure CSS sticky, 
                    simplifying to highlighting phases as they scroll into view 
                    instead of a singular traveling head for robustness.
                */}

                <div className="max-w-5xl w-full px-4 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-40 z-10">
                    <div className="hidden md:block" /> {/* Spacer */}

                    {/* Content is actually rendered below in the scroll flow, this is just visual scaffolding */}
                </div>
            </div>

            {/* Scrollable Content Layers */}
            <div className="relative z-10 -mt-[100vh]">
                {phases.map((phase, i) => (
                    <div key={phase.id} className="h-screen flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ margin: "-20% 0px -20% 0px" }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className={`
                                relative p-8 md:p-12 border border-white/10 bg-black/80 backdrop-blur-md rounded-2xl max-w-lg w-full
                                ${i % 2 === 0 ? "md:mr-[50%] md:text-right" : "md:ml-[50%] md:text-left"}
                                before:absolute before:top-1/2 before:w-20 before:h-[1px] before:bg-gradient-to-r before:from-cyan-500/50 before:to-transparent
                                ${i % 2 === 0 ? "before:-right-20 before:origin-right" : "before:-left-20 before:origin-left"}
                            `}
                        >
                            <div className={`absolute top-0 ${i % 2 === 0 ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"} -translate-y-1/2 w-12 h-12 bg-[#050505] border border-white/20 rounded-full flex items-center justify-center z-20`}>
                                <phase.icon className={`w-6 h-6 ${phase.color}`} />
                            </div>

                            <span className="text-6xl font-black text-white/5 absolute -top-8 left-8 select-none">{phase.id}</span>
                            <h3 className={`text-3xl font-bold mb-4 tracking-tight flex items-center gap-3 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                                {phase.title}
                            </h3>
                            <p className="text-neutral-400 font-mono text-sm leading-relaxed">
                                {phase.desc}
                            </p>

                            <div className="mt-6 flex gap-2 text-xs font-mono text-cyan-700/80 uppercase tracking-widest">
                                <CheckCircle className="w-3 h-3" />
                                Status: Complete
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
};
