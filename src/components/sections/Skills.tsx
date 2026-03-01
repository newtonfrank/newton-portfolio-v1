"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSpectrum } from "@/store/useSpectrum";

interface SkillNode {
    id: string;
    label: string;
    x: number;
    y: number;
    category: "design" | "code" | "hybrid";
    proficiency: number;
}

interface SkillEdge {
    from: string;
    to: string;
}

const skillNodes: SkillNode[] = [
    // Design skills (left cluster)
    { id: "figma", label: "Figma", x: 0.12, y: 0.25, category: "design", proficiency: 0.9 },
    { id: "uiux", label: "UI/UX Design", x: 0.22, y: 0.45, category: "design", proficiency: 0.85 },
    { id: "color", label: "Color Theory", x: 0.08, y: 0.6, category: "design", proficiency: 0.8 },
    { id: "motion-design", label: "Motion Design", x: 0.28, y: 0.3, category: "design", proficiency: 0.75 },
    { id: "photoshop", label: "Photoshop", x: 0.15, y: 0.72, category: "design", proficiency: 0.7 },

    // Hybrid skills (center)
    { id: "responsive", label: "Responsive", x: 0.42, y: 0.28, category: "hybrid", proficiency: 0.95 },
    { id: "accessibility", label: "Accessibility", x: 0.52, y: 0.6, category: "hybrid", proficiency: 0.8 },
    { id: "performance", label: "Performance", x: 0.48, y: 0.42, category: "hybrid", proficiency: 0.85 },

    // Code skills (right cluster)
    { id: "react", label: "React", x: 0.72, y: 0.25, category: "code", proficiency: 0.95 },
    { id: "nextjs", label: "Next.js", x: 0.82, y: 0.4, category: "code", proficiency: 0.9 },
    { id: "typescript", label: "TypeScript", x: 0.88, y: 0.28, category: "code", proficiency: 0.9 },
    { id: "threejs", label: "Three.js", x: 0.92, y: 0.55, category: "code", proficiency: 0.75 },
    { id: "nodejs", label: "Node.js", x: 0.78, y: 0.65, category: "code", proficiency: 0.85 },
    { id: "css", label: "CSS/Tailwind", x: 0.68, y: 0.5, category: "code", proficiency: 0.95 },
    { id: "git", label: "Git", x: 0.85, y: 0.7, category: "code", proficiency: 0.85 },
];

const skillEdges: SkillEdge[] = [
    { from: "figma", to: "uiux" },
    { from: "uiux", to: "color" },
    { from: "uiux", to: "motion-design" },
    { from: "figma", to: "photoshop" },
    { from: "uiux", to: "responsive" },
    { from: "motion-design", to: "responsive" },
    { from: "responsive", to: "performance" },
    { from: "responsive", to: "accessibility" },
    { from: "performance", to: "react" },
    { from: "accessibility", to: "css" },
    { from: "react", to: "nextjs" },
    { from: "react", to: "typescript" },
    { from: "nextjs", to: "nodejs" },
    { from: "react", to: "threejs" },
    { from: "css", to: "react" },
    { from: "typescript", to: "git" },
    { from: "nodejs", to: "git" },
    { from: "performance", to: "nextjs" },
];

export function Skills() {
    const mode = useSpectrum((s) => s.getMode());
    const position = useSpectrum((s) => s.position);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const animRef = useRef<number>(0);
    const timeRef = useRef(0);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const getNodeColor = useCallback(
        (category: string) => {
            if (category === "design") return position < 0.5 ? "#a040e8" : "#9b5de5";
            if (category === "code") return position < 0.5 ? "#00f3ff" : "#e85d04";
            return "#c060f0";
        },
        [position]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        ctx.scale(dpr, dpr);

        const draw = () => {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);
            timeRef.current += 0.008;
            const time = timeRef.current;

            // Draw edges first
            skillEdges.forEach((edge) => {
                const from = skillNodes.find((n) => n.id === edge.from);
                const to = skillNodes.find((n) => n.id === edge.to);
                if (!from || !to) return;

                const fx = from.x * dimensions.width;
                const fy = from.y * dimensions.height + Math.sin(time + from.x * 10) * 3;
                const tx = to.x * dimensions.width;
                const ty = to.y * dimensions.height + Math.sin(time + to.x * 10) * 3;

                const isHighlighted = hoveredNode === from.id || hoveredNode === to.id;
                const isConnectedToHovered =
                    hoveredNode &&
                    skillEdges.some(
                        (e) =>
                            (e.from === hoveredNode && (e.to === from.id || e.to === to.id)) ||
                            (e.to === hoveredNode && (e.from === from.id || e.from === to.id))
                    );

                // Edge line
                ctx.beginPath();
                ctx.moveTo(fx, fy);
                ctx.lineTo(tx, ty);
                ctx.strokeStyle = isHighlighted
                    ? `rgba(160, 64, 232, 0.6)`
                    : `rgba(255, 255, 255, 0.05)`;
                ctx.lineWidth = isHighlighted ? 1.5 : 0.5;
                ctx.stroke();

                // Animated pulse along highlighted edges
                if (isHighlighted || isConnectedToHovered) {
                    const pulsePos = (time * 1.5) % 1;
                    const px = fx + (tx - fx) * pulsePos;
                    const py = fy + (ty - fy) * pulsePos;
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(160, 64, 232, 0.8)";
                    ctx.fill();
                }
            });

            // Draw nodes
            skillNodes.forEach((node) => {
                const nx = node.x * dimensions.width;
                const ny = node.y * dimensions.height + Math.sin(time + node.x * 10) * 3;
                const isHovered = hoveredNode === node.id;
                const color = getNodeColor(node.category);
                const baseRadius = 4 + node.proficiency * 4;
                const radius = isHovered ? baseRadius + 4 : baseRadius;

                // Outer glow ring
                if (isHovered) {
                    const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, 30);
                    gradient.addColorStop(0, `${color}30`);
                    gradient.addColorStop(1, "transparent");
                    ctx.beginPath();
                    ctx.arc(nx, ny, 30, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }

                // Pulsing halo
                const haloRadius = baseRadius + 2 + Math.sin(time * 2 + node.x * 5) * 2;
                ctx.beginPath();
                ctx.arc(nx, ny, haloRadius, 0, Math.PI * 2);
                ctx.strokeStyle = `${color}20`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Node circle
                ctx.beginPath();
                ctx.arc(nx, ny, radius, 0, Math.PI * 2);
                ctx.fillStyle = isHovered ? color : `${color}cc`;
                ctx.fill();

                // Inner bright dot
                ctx.beginPath();
                ctx.arc(nx, ny, radius * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = "#ffffff";
                ctx.globalAlpha = isHovered ? 0.6 : 0.2;
                ctx.fill();
                ctx.globalAlpha = 1;

                // Label (always visible)
                ctx.font = isHovered
                    ? "bold 13px var(--font-inter, system-ui, sans-serif)"
                    : "11px var(--font-inter, system-ui, sans-serif)";
                ctx.fillStyle = isHovered ? color : "rgba(255, 255, 255, 0.55)";
                ctx.textAlign = "center";
                ctx.fillText(node.label, nx, ny - radius - 10);

                // Proficiency bar on hover
                if (isHovered) {
                    const barWidth = 50;
                    const barHeight = 4;
                    const bx = nx - barWidth / 2;
                    const by = ny + radius + 14;

                    // Track
                    ctx.fillStyle = `${color}20`;
                    ctx.beginPath();
                    ctx.roundRect(bx, by, barWidth, barHeight, 2);
                    ctx.fill();

                    // Fill
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.roundRect(bx, by, barWidth * node.proficiency, barHeight, 2);
                    ctx.fill();

                    // Percentage
                    ctx.font = "10px var(--font-mono, monospace)";
                    ctx.fillStyle = color;
                    ctx.fillText(`${Math.round(node.proficiency * 100)}%`, nx, by + 18);
                }
            });

            animRef.current = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animRef.current);
    }, [dimensions, hoveredNode, position, getNodeColor]);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (!canvasRef.current || dimensions.width === 0) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            let found = false;
            for (const node of skillNodes) {
                const nx = node.x * dimensions.width;
                const ny = node.y * dimensions.height;
                const dist = Math.sqrt((mx - nx) ** 2 + (my - ny) ** 2);
                if (dist < 25) {
                    setHoveredNode(node.id);
                    found = true;
                    break;
                }
            }
            if (!found) setHoveredNode(null);
        },
        [dimensions]
    );

    return (
        <section id="skills" className="relative py-32 md:py-40">
            <div className="section-container">
                <motion.div
                    className="mb-12"
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
                        {mode === "dev" ? "// 03. skills" : "03 — Skills"}
                    </span>
                    <h2 className="heading-lg text-4xl md:text-5xl mb-4" style={{ color: "var(--color-text)" }}>
                        {mode === "dev" ? "constellation_network()" : "The Constellation"}
                    </h2>
                    <p className="text-sm max-w-md" style={{ color: "var(--color-text-secondary)" }}>
                        {mode === "dev"
                            ? "// hover nodes to inspect proficiency levels"
                            : "Hover over the stars to explore proficiency levels"}
                    </p>
                </motion.div>

                <motion.div
                    ref={containerRef}
                    className="relative w-full h-[450px] md:h-[550px]"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full"
                        style={{ cursor: hoveredNode ? "pointer" : "default" }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoveredNode(null)}
                    />

                    {/* Category legend */}
                    <div className="absolute top-4 left-4 flex flex-col gap-3">
                        {[
                            { cat: "design", label: "Design" },
                            { cat: "hybrid", label: "Hybrid" },
                            { cat: "code", label: "Code" },
                        ].map(({ cat, label }) => (
                            <div key={cat} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ background: getNodeColor(cat), boxShadow: `0 0 6px ${getNodeColor(cat)}60` }}
                                />
                                <span className="text-[11px] uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
