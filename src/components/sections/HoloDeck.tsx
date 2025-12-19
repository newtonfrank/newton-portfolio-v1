"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ExternalLink, Eye, Github, Download, Play } from "lucide-react";
import { useTechStore } from "@/store/useTechStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SystemDrawer } from "@/components/ui/SystemDrawer";

const projects = [
    {
        title: "UNIPIX",
        desc: "Unified Free Stock Image Search Engine. Aggregates Pexels, Unsplash, Pixabay.",
        image: "/unipix-screenshot.png",
        videoSrc: "", // Add video path if available
        tech: ["React", "API", "Tailwind"],
        link: "https://unipix-newton.vercel.app/"
    },
    {
        title: "IIOT_DASH",
        desc: "Industrial IoT Dashboard. Real-time predictive maintenance via WebSockets.",
        image: "/Industrial IoT (IIoT) Dashboard screenshot.png",
        videoSrc: "",
        tech: ["WebSockets", "D3.js", "IoT"],
        link: "https://www.sonicscape.co/"
    }
];

const ProjectCartridge = ({ project, onQuickLook, isMobile }: { project: any, onQuickLook: (p: any) => void, isMobile: boolean }) => {
    const ref = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);

    // Global State
    const { highlightedTechs, setHighlightedTechs, clearHighlight } = useTechStore();

    // Check if this project matches the highlighted tech
    const isDimmed = highlightedTechs.length > 0 && !project.tech.some((t: string) => highlightedTechs.includes(t));

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    // Intersection Observer for mobile video autoplay
    useEffect(() => {
        if (!isMobile || !project.videoSrc) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
                if (videoRef.current) {
                    if (entry.isIntersecting) {
                        videoRef.current.play();
                    } else {
                        videoRef.current.pause();
                    }
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isMobile, project.videoSrc]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return; // Skip 3D effect on mobile
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
            const width = rect.width;
            const height = rect.height;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const xPct = mouseX / width - 0.5;
            const yPct = mouseY / height - 0.5;
            x.set(xPct);
            y.set(yPct);
        }
    };

    const handleMouseEnter = () => {
        if (isMobile) return;
        setHighlightedTechs(project.tech);
        if (videoRef.current && project.videoSrc) {
            videoRef.current.play();
        }
    };

    const handleMouseLeave = () => {
        if (isMobile) return;
        x.set(0);
        y.set(0);
        clearHighlight();
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: isMobile ? 0 : rotateX,
                rotateY: isMobile ? 0 : rotateY,
                transformStyle: "preserve-3d"
            }}
            animate={{
                scale: isDimmed ? 0.95 : 1,
                opacity: isDimmed ? 0.5 : 1,
                filter: isDimmed ? "grayscale(100%) blur(2px)" : "none"
            }}
            whileHover={isMobile ? {} : { scale: 1.05 }}
            whileTap={isMobile ? { scale: 0.98 } : {}}
            className={`group relative w-full h-[300px] md:h-[400px] bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer backdrop-blur-sm transition-all duration-500
                ${!isDimmed ? 'hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:border-cyan-500/50' : ''}`}
        >
            <div style={{ transform: isMobile ? "none" : "translateZ(50px)" }} className="absolute inset-4 z-10 flex flex-col justify-end pointer-events-none">
                <div className="bg-black/80 p-4 md:p-6 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl">
                    <h3 className="text-xl md:text-2xl font-bold font-mono mb-2 text-white group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                    <p className="text-xs md:text-sm text-neutral-400 mb-3 md:mb-4 line-clamp-2">{project.desc}</p>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                        {project.tech.map((t: string) => (
                            <span key={t} className="text-[10px] font-mono px-2 py-1 bg-cyan-900/20 text-cyan-400 border border-cyan-500/20 rounded">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Media Layer */}
            <div className="absolute inset-0 z-0">
                {/* Fallback Image */}
                <div
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${!isMobile ? 'group-hover:opacity-0' : ''}`}
                    style={{ backgroundImage: `url(${project.image})` }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0 opacity-80" />

                {/* Video */}
                {project.videoSrc && (
                    <video
                        ref={videoRef}
                        src={project.videoSrc}
                        muted
                        loop
                        playsInline
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
                            ${isMobile ? (isInView ? 'opacity-100' : 'opacity-0') : 'opacity-0 group-hover:opacity-100'}`}
                    />
                )}

                {/* Mobile Play Icon */}
                {isMobile && project.videoSrc && !isInView && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="p-4 bg-black/50 rounded-full border border-white/20">
                            <Play className="w-8 h-8 text-white" />
                        </div>
                    </div>
                )}
            </div>

            {/* Holographic Overlay - Desktop only */}
            {!isMobile && (
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-holo-shine pointer-events-none z-20`} />
            )}

            <div className={`absolute top-4 right-4 flex gap-2 z-30 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} style={{ transform: isMobile ? "none" : "translateZ(60px)" }}>
                <button
                    onClick={(e) => { e.stopPropagation(); onQuickLook(project); }}
                    className="p-2 bg-black/80 rounded-full border border-white/20 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                >
                    <Eye className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

export const HoloDeck = () => {
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const isMobile = useIsMobile();

    return (
        <section id="projects" className="py-20 md:py-32 px-4 relative z-10 w-full min-h-screen flex flex-col items-center justify-center">

            <div className="mb-12 md:mb-20 text-center">
                <h2 className="text-xs md:text-sm font-mono text-cyan-500 tracking-[0.3em] md:tracking-[0.5em] mb-4">DEPLOYED_MODULES</h2>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">PROJECTS</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-6xl w-full perspective-[1000px] mb-12 md:mb-20">
                {projects.map((p, i) => (
                    <ProjectCartridge
                        key={i}
                        project={p}
                        onQuickLook={setSelectedProject}
                        isMobile={isMobile}
                    />
                ))}
            </div>

            {/* Download Resume Button */}
            <motion.a
                href="/Newton_Resume.pdf"
                download="Newton_Resume.pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-black/50 border border-white/20 rounded-none overflow-hidden hover:border-cyan-500/50 transition-colors"
            >
                <div className="absolute inset-0 bg-cyan-500/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center gap-3 font-mono text-sm tracking-widest text-neutral-400 group-hover:text-cyan-400">
                    <Download className="w-4 h-4" />
                    [↓] RESUME_V2.PDF
                </div>
            </motion.a>

            {/* System Drawer for project details */}
            <SystemDrawer
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </section>
    );
};


