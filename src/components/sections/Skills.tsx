"use client";

import React from "react";
import { motion } from "framer-motion";

const skillCategories = [
    {
        category: "Frontend",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"]
    },
    {
        category: "Backend",
        skills: ["Node.js", "Express", "PostgreSQL", "Supabase", "GraphQL", "Python"]
    },
    {
        category: "DevOps & Tools",
        skills: ["AWS", "Docker", "Git", "Figma", "Vercel", "CI/CD"]
    }
];

export const Skills = () => {
    return (
        <section id="skills" className="py-32 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Technical Arsenal</h2>
                    <p className="text-neutral-400 text-lg max-w-2xl">
                        A curated stack of technologies I use to build scalable, performant, and beautiful applications.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {skillCategories.map((cat, idx) => (
                        <motion.div
                            key={cat.category}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xl font-mono text-neutral-500 mb-6 border-b border-white/10 pb-2">
                                {cat.category}
                            </h3>
                            <ul className="space-y-4">
                                {cat.skills.map(skill => (
                                    <li key={skill} className="text-2xl md:text-3xl font-bold tracking-tight hover:text-neutral-300 transition-colors">
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
