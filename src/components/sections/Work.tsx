"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSpectrum } from "@/store/useSpectrum";
import { ExternalLink, Github } from "lucide-react";

const projects = [
    {
        title: "Bitnote",
        desc: "The Ultimate Ecosystem for Modern Learners.",
        longDesc: "A comprehensive edutech platform with real-time collaboration, AI-powered study tools, and adaptive learning paths.",
        image: "/bitnote-261225.png",
        tech: ["Next.js", "TypeScript", "Supabase", "AI"],
        link: "https://bitnote.in",
        github: "",
        tags: ["DESIGN", "CODE"],
        color: "#00f3ff",
    },
    {
        title: "UniPix",
        desc: "Component-based Design System & UI Kit.",
        longDesc: "A modular design system built for scalability, with 80+ components, design tokens, and comprehensive documentation.",
        image: "/unipix-screenshot.png",
        tech: ["React", "Storybook", "CSS", "Design"],
        link: "https://unipix.vercel.app",
        github: "",
        tags: ["DESIGN", "CODE"],
        color: "#a040e8",
    },
    {
        title: "IIoT Dashboard",
        desc: "Industrial IoT Dashboard with real-time monitoring.",
        longDesc: "Predictive maintenance dashboard using WebSockets for real-time data streaming, with D3.js visualizations and anomaly detection.",
        image: "/IIoT-Dashboard.png",
        tech: ["WebSockets", "D3.js", "IoT", "React"],
        link: "https://www.sonicscape.co/",
        github: "",
        tags: ["CODE", "3D"],
        color: "#e85d04",
    },
];

function ProjectCard({
    project,
    index,
}: {
    project: (typeof projects)[0];
    index: number;
}) {
    const mode = useSpectrum((s) => s.getMode());
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
        setTilt({ x: y, y: x });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={cardRef}
            className="flex-shrink-0 w-[340px] md:w-[420px] h-[520px] md:h-[580px]"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
        >
            <motion.div
                className="glass-card h-full overflow-hidden relative group"
                animate={{
                    rotateX: tilt.x,
                    rotateY: tilt.y,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
            >
                {/* Project Image */}
                <div className="relative h-[55%] overflow-hidden">
                    <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.4 }}
                    />

                    {/* Code reveal overlay (peel effect placeholder) */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                            background: "rgba(5, 5, 5, 0.9)",
                            backdropFilter: "blur(4px)",
                        }}
                        initial={{ clipPath: "circle(0% at 50% 50%)" }}
                        animate={{
                            clipPath: isHovered
                                ? "circle(100% at 50% 50%)"
                                : "circle(0% at 50% 50%)",
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="font-mono text-xs p-6 space-y-2" style={{ color: "#00f3ff" }}>
                            <div className="text-[10px] text-white/30 mb-3">// architecture</div>
                            {project.tech.map((t) => (
                                <div key={t} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.color }} />
                                    <span>{t}</span>
                                </div>
                            ))}
                            <div className="pt-4 flex gap-3">
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[10px] hover:text-white/80 transition-colors"
                                        style={{ color: "var(--color-accent)" }}
                                    >
                                        <ExternalLink size={12} /> Live
                                    </a>
                                )}
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[10px] hover:text-white/80 transition-colors"
                                        style={{ color: "var(--color-accent)" }}
                                    >
                                        <Github size={12} /> Source
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Project number */}
                    <div
                        className="absolute top-4 left-4 font-mono text-[10px]"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                        {mode === "dev" ? `project_${String(index + 1).padStart(2, "0")}` : `0${index + 1}`}
                    </div>
                </div>

                {/* Project Info */}
                <div className="p-6 flex flex-col justify-between h-[45%]">
                    <div>
                        <h3
                            className="heading-lg text-xl md:text-2xl mb-2"
                            style={{ color: "var(--color-text)" }}
                        >
                            {project.title}
                        </h3>
                        <p
                            className="text-sm mb-4"
                            style={{
                                color: "var(--color-text-secondary)",
                                fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                            }}
                        >
                            {mode === "dev" ? `// ${project.desc}` : project.desc}
                        </p>
                    </div>

                    <div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag) => (
                                <span key={tag} className="tag-pill">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Tech orbit */}
                        <div className="flex flex-wrap gap-1.5">
                            {project.tech.map((t) => (
                                <span
                                    key={t}
                                    className="text-[10px] px-2 py-0.5 rounded-full"
                                    style={{
                                        background: `${project.color}15`,
                                        color: project.color,
                                        border: `1px solid ${project.color}30`,
                                    }}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Accent glow on hover */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        boxShadow: isHovered
                            ? `inset 0 0 30px ${project.color}15, 0 0 40px ${project.color}10`
                            : "none",
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </motion.div>
    );
}

export function Work() {
    const mode = useSpectrum((s) => s.getMode());
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start end", "end start"],
    });

    return (
        <section id="work" ref={scrollRef} className="relative py-32 md:py-40">
            <div className="section-container mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <span
                        className="text-xs uppercase tracking-[0.3em] mb-4 block"
                        style={{
                            color: "var(--color-accent)",
                            fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                        }}
                    >
                        {mode === "dev" ? "// 02. work" : "02 — Work"}
                    </span>
                    <h2 className="heading-lg text-4xl md:text-5xl mb-4" style={{ color: "var(--color-text)" }}>
                        {mode === "dev" ? "project_galaxy()" : "Selected Projects"}
                    </h2>
                    <p className="text-sm max-w-md" style={{ color: "var(--color-text-secondary)" }}>
                        {mode === "dev"
                            ? "// hover to reveal the code beneath the design"
                            : "Hover to explore the architecture beneath each project"}
                    </p>
                </motion.div>
            </div>

            {/* Horizontal scroll container */}
            <div className="relative">
                <div
                    className="flex gap-6 md:gap-8 overflow-x-auto pb-8 px-6 md:px-12 lg:px-16 scrollbar-hide"
                    style={{
                        scrollSnapType: "x mandatory",
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    {projects.map((project, i) => (
                        <div key={project.title} style={{ scrollSnapAlign: "center" }}>
                            <ProjectCard project={project} index={i} />
                        </div>
                    ))}

                    {/* "More coming" card */}
                    <motion.div
                        className="flex-shrink-0 w-[340px] md:w-[420px] h-[520px] md:h-[580px] flex items-center justify-center glass-card"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center px-8">
                            <div
                                className="text-4xl mb-4"
                                style={{ color: "var(--color-accent)", opacity: 0.3 }}
                            >
                                +
                            </div>
                            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                {mode === "dev" ? "// more_projects_loading..." : "More projects in orbit"}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll hint gradient */}
                <div
                    className="absolute right-0 top-0 bottom-8 w-24 pointer-events-none"
                    style={{
                        background: `linear-gradient(90deg, transparent, var(--color-bg))`,
                    }}
                />
            </div>

            {/* Hide scrollbar */}
            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </section>
    );
}
