"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, CheckCircle, Cpu } from "lucide-react";
import Link from "next/link";

interface Project {
    title: string;
    desc: string;
    image: string;
    videoSrc?: string;
    tech: string[];
    link: string;
    github?: string;
    status?: string;
    mission?: string;
}

interface SystemDrawerProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export const SystemDrawer = ({ project, isOpen, onClose }: SystemDrawerProps) => {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-black/95 backdrop-blur-md border-l-2 border-cyan-500/50 shadow-[0_0_60px_rgba(0,255,255,0.2)] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-white/10 p-6 flex items-center justify-between z-10">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <Cpu className="w-5 h-5 text-cyan-500" />
                                    <h2 className="text-xl md:text-2xl font-bold font-mono text-white">{project.title}</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span className="text-xs font-mono text-green-400">{project.status || "DEPLOYED"}</span>
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all group"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-8">
                            {/* Project Image */}
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${project.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            </div>

                            {/* Mission Report */}
                            <div>
                                <h3 className="text-xs font-mono text-cyan-500 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-px bg-cyan-500" />
                                    MISSION_REPORT
                                </h3>
                                <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                                    {project.mission || project.desc}
                                </p>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <h3 className="text-xs font-mono text-cyan-500 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-px bg-cyan-500" />
                                    TECH_STACK
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1.5 text-xs font-mono bg-cyan-900/20 text-cyan-400 border border-cyan-500/20 rounded-lg"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Specifications */}
                            <div>
                                <h3 className="text-xs font-mono text-cyan-500 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-px bg-cyan-500" />
                                    SPECIFICATIONS
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                        <span className="text-neutral-500 text-xs">Status</span>
                                        <p className="text-green-400 font-mono">{project.status || "ACTIVE"}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                        <span className="text-neutral-500 text-xs">Type</span>
                                        <p className="text-white font-mono">WEB APP</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="sticky bottom-0 bg-black/90 backdrop-blur-md border-t border-white/10 p-6 flex gap-4">
                            {project.github && (
                                <Link
                                    href={project.github}
                                    target="_blank"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/20 rounded-lg font-mono text-sm hover:bg-white/10 hover:border-white/40 transition-all"
                                >
                                    <Github className="w-4 h-4" />
                                    SOURCE CODE
                                </Link>
                            )}
                            <Link
                                href={project.link}
                                target="_blank"
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-cyan-500/20 border border-cyan-500/50 rounded-lg font-mono text-sm text-cyan-400 hover:bg-cyan-500/30 hover:border-cyan-400 transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                LAUNCH SYSTEM
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
