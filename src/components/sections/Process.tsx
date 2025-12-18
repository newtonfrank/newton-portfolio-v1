"use client";
import React from "react";
import { motion } from "motion/react";
import { Search, PenTool, Code, Rocket } from "lucide-react";

const processSteps = [
    {
        title: "Discovery",
        description:
            "Deep dive into problem space. Understanding user needs, business goals, and technical constraints to ensure we solve the right problem.",
        icon: <Search className="w-6 h-6 text-blue-400" />,
    },
    {
        title: "Design",
        description:
            "High-fidelity prototyping in Figma. I focus on accessibility, visual hierarchy, and intuitive user flows before writing a line of code.",
        icon: <PenTool className="w-6 h-6 text-purple-400" />,
    },
    {
        title: "Development",
        description:
            "Clean, scalable architecture. Utilizing modern frameworks like Next.js and robust patterns to ensure performance and maintainability.",
        icon: <Code className="w-6 h-6 text-green-400" />,
    },
    {
        title: "Deployment",
        description:
            "CI/CD pipelines, automated testing, and cloud infrastructure. Ensuring 99.9% uptime and smooth, zero-downtime releases.",
        icon: <Rocket className="w-6 h-6 text-orange-400" />,
    },
];

export const Process = () => {
    return (
        <section id="process" className="py-32 bg-neutral-950 relative overflow-hidden">
            <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
                        Methodology
                    </h2>
                    <p className="mt-4 text-neutral-300 max-w-lg mx-auto text-lg">
                        A systematic approach to building digital products.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {processSteps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative flex flex-col items-start text-left p-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 transition-all hover:border-white/20 hover:shadow-2xl"
                        >
                            <div className="mb-6 p-4 rounded-xl bg-neutral-800 group-hover:bg-neutral-700 transition-colors border border-white/5 group-hover:scale-110 duration-300 shadow-lg">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-base text-neutral-300 leading-relaxed group-hover:text-neutral-200 transition-colors">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
