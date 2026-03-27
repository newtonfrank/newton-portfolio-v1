"use client";

import React from "react";
import { motion } from "framer-motion";

const skills = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "HTML5", "CSS3", "Python", "Go"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js"] },
  { category: "Backend", items: ["Node.js", "Express", "NestJS", "Django", "PostgreSQL", "MongoDB"] },
  { category: "Tools & DevOps", items: ["Git", "Docker", "AWS", "Vercel", "Figma", "Postman"] }
];

export function Skills() {
    return (
        <section id="skills" className="relative py-32 bg-deep-space">
            <div className="section-container max-w-5xl mx-auto">
                <motion.div
                    className="mb-16 md:mb-24 flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
                        Technical <span className="text-transparent stroke-text italic" style={{ WebkitTextStroke: '2px #e50012' }}>Arsenal</span>
                    </h2>
                    <p className="max-w-2xl text-text-secondary">
                        The tools, languages, and frameworks I use to bring ideas to life.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {skills.map((skillSet, idx) => (
                        <motion.div
                            key={skillSet.category}
                            className="bg-surface/30 border border-white/5 p-8 rounded-2xl hover:border-racing-red/30 transition-colors"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-xs border-b border-white/10 pb-4">
                                {skillSet.category}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {skillSet.items.map((item) => (
                                    <span 
                                       key={item} 
                                       className="bg-black/50 text-white/80 border border-white/10 hover:border-racing-red hover:text-racing-red transition-all px-4 py-2 rounded-full text-sm font-medium"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
