"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
    {
        title: "Coworking Space Management System API",
        desc: "Designed and built a full life structure of a coworking space management system.",
        image: "/bitnote-261225.png",
        tech: ["Golang", "PostgreSQL"],
        link: "#",
        color: "bg-surface"
    },
    {
        title: "Fleet Management System",
        desc: "Designed to help manage specific data in a business related to fleet.",
        image: "/unipix-screenshot.png",
        tech: ["Node.js", "React JS", "MongoDB", "Express"],
        link: "#",
        color: "bg-surface"
    },
    {
        title: "Event Finder & Booking API",
        desc: "Designed and built an API to find local events and book a spot.",
        image: "/IIoT-Dashboard.png",
        tech: ["Laravel", "MySQL", "Redis", "PHP"],
        link: "#",
        color: "bg-surface"
    },
    {
        title: "To-Do List App Backend API",
        desc: "Designed an API layer specifically for a to-do list application.",
        image: "/bitnote-261225.png",
        tech: ["Express", "MongoDB", "Mongoose", "JWT"],
        link: "#",
        color: "bg-surface"
    }
];

export function Work() {
    return (
        <section id="work" className="relative py-32 bg-deep-space">
            <div className="section-container relative z-10 max-w-6xl mx-auto">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Some of the <span className="border-4 border-racing-red px-4 py-1 inline-block transform -rotate-2">projects</span> I've built
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.title}
                            className={`group relative overflow-hidden rounded-3xl p-8 md:p-10 ${project.color} border border-border hover:border-racing-red/50 transition-colors flex flex-col h-[500px] md:h-[600px] shadow-2xl`}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                        >
                            {/* Text Content */}
                            <div className="relative z-20 mb-auto">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-racing-red transition-colors uppercase tracking-wider">
                                    {project.title}
                                </h3>
                                <p className="text-text-secondary text-sm md:text-base mb-6 max-w-md">
                                    {project.desc}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map((t) => (
                                        <span key={t} className="bg-white/5 border border-white/10 text-white/80 text-xs px-3 py-1 rounded-full font-mono">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Image Showcase */}
                            <div className="relative z-10 w-full h-1/2 mt-8 rounded-xl overflow-hidden shadow-2xl transform translate-y-8 group-hover:translate-y-4 group-hover:scale-105 transition-all duration-500 border border-white/10">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                            </div>

                            {/* Link Overlay */}
                            <a href={project.link} className="absolute inset-0 z-30 flex items-start justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-racing-red text-white p-3 rounded-full transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 shadow-lg glow">
                                    <ExternalLink size={20} />
                                </div>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
