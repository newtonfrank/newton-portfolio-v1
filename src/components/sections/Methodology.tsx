"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
    {
        title: "Discovery",
        description: "Mapping the void. Understanding user needs to effectively solve the right problems.",
        num: "01"
    },
    {
        title: "Design",
        description: "Sculpting the interface. High-fidelity prototyping with a focus on accessibility.",
        num: "02"
    },
    {
        title: "Development",
        description: "Building the engine. Scalable architecture using modern frameworks.",
        num: "03"
    },
    {
        title: "Deployment",
        description: "Ignition. CI/CD pipelines and automated testing for zero-downtime releases.",
        num: "04"
    }
];

export const Methodology = () => {
    return (
        <section className="py-32 bg-neutral-950 text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Methodology</h2>
                    <p className="text-neutral-500 mt-4">The process behind the product.</p>
                </div>

                <div className="relative border-l border-white/10 ml-4 md:ml-10 space-y-20">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative pl-12 md:pl-20"
                        >
                            {/* Node on the line */}
                            <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-black border border-white/20 -translate-x-1/2 flex items-center justify-center z-10">
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>

                            {/* Content */}
                            <div>
                                <span className="text-6xl font-bold text-neutral-800 absolute -top-10 -left-6 md:left-0 select-none -z-10 opacity-50">
                                    {step.num}
                                </span>
                                <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                                <p className="text-xl text-neutral-400 font-light leading-relaxed max-w-2xl">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
