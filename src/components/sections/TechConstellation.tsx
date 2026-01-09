"use client";

import React, { useState, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { useTechStore } from "@/store/useTechStore";
import { useIsMobile } from "@/hooks/useIsMobile";

// Expanded Skill Nodes from Resume
const nodes = [
    // Core Web
    { id: "react", label: "React", x: 50, y: 50, type: "core" },
    { id: "next", label: "Next.js", x: 60, y: 45, type: "frame" },
    { id: "ts", label: "TypeScript", x: 40, y: 45, type: "lang" },
    { id: "js", label: "JavaScript", x: 45, y: 55, type: "lang" },
    { id: "tailwind", label: "Tailwind", x: 55, y: 35, type: "style" },

    // Backend & DB
    { id: "node", label: "Node.js", x: 50, y: 65, type: "back" },
    { id: "express", label: "Express", x: 60, y: 70, type: "back" },
    { id: "mongo", label: "MongoDB", x: 40, y: 75, type: "db" },
    { id: "postgres", label: "Postgres", x: 30, y: 70, type: "db" },
    { id: "python", label: "Python", x: 25, y: 80, type: "lang" },

    // Cloud & DevOps
    { id: "aws", label: "AWS", x: 75, y: 65, type: "cloud" },
    { id: "docker", label: "Docker", x: 80, y: 75, type: "devops" },
    { id: "git", label: "Git", x: 20, y: 40, type: "tool" },

    // Creative & 3D
    { id: "three", label: "Three.js", x: 70, y: 30, type: "3d" },
    { id: "motion", label: "Motion", x: 65, y: 20, type: "anim" },
    { id: "figma", label: "Figma", x: 25, y: 30, type: "design" },

    // Web3 / Emerging
    { id: "solidity", label: "Solidity", x: 85, y: 50, type: "web3" },
    { id: "eth", label: "Ethereum", x: 90, y: 40, type: "web3" }
];

const connections: readonly [string, string][] = [
    // Core Cluster
    ["react", "next"],
    ["react", "ts"],
    ["react", "js"],
    ["react", "tailwind"],
    ["ts", "next"],
    ["js", "ts"],

    // Full Stack Links
    ["react", "node"],
    ["node", "express"],
    ["node", "mongo"],
    ["node", "postgres"],
    ["express", "mongo"],

    // Creative Links
    ["react", "three"],
    ["react", "motion"],
    ["next", "motion"],
    ["figma", "tailwind"], // Design to Code

    // DevOps / Cloud Links
    ["node", "aws"],
    ["express", "aws"],
    ["aws", "docker"],
    ["python", "aws"], // Scripting/Lambda
    ["git", "ts"], // Version control everything

    // Web3
    ["solidity", "eth"],
    ["react", "eth"] // dApps
];

// Type colors for skill cloud
const typeColors: Record<string, string> = {
    core: "bg-cyan-500 text-black border-cyan-400",
    frame: "bg-blue-500 text-white border-blue-400",
    lang: "bg-yellow-500 text-black border-yellow-400",
    style: "bg-pink-500 text-white border-pink-400",
    back: "bg-green-500 text-white border-green-400",
    db: "bg-orange-500 text-white border-orange-400",
    cloud: "bg-purple-500 text-white border-purple-400",
    devops: "bg-indigo-500 text-white border-indigo-400",
    tool: "bg-gray-500 text-white border-gray-400",
    "3d": "bg-red-500 text-white border-red-400",
    anim: "bg-emerald-500 text-white border-emerald-400",
    design: "bg-rose-500 text-white border-rose-400",
    web3: "bg-violet-500 text-white border-violet-400",
};

// Memoized Connection Component
const Connection = memo(({ connection, isNodeHighlighted, localHover, highlightedTechs }: {
    connection: readonly [string, string];
    isNodeHighlighted: (label: string) => boolean;
    localHover: string | null;
    highlightedTechs: string[];
}) => {
    const [a, b] = connection;
    const nodeA = nodes.find(n => n.id === a);
    const nodeB = nodes.find(n => n.id === b);

    if (!nodeA || !nodeB) return null;

    const dimmedDueToFilter = highlightedTechs.length > 0;
    const relevantToHighlight = dimmedDueToFilter && (isNodeHighlighted(nodeA.label) || isNodeHighlighted(nodeB.label));
    const isConnectedLocal = localHover && (localHover === a || localHover === b);
    const isRelevant = isConnectedLocal || relevantToHighlight;

    return (
        <motion.line
            key={`${a}-${b}`}
            x1={`${nodeA.x}%`}
            y1={`${nodeA.y}%`}
            x2={`${nodeB.x}%`}
            y2={`${nodeB.y}%`}
            stroke="cyan"
            strokeWidth={1}
            initial={{ strokeOpacity: 0.1, strokeWidth: 1 }}
            animate={{
                strokeOpacity: isRelevant ? 0.6 : 0.05,
                strokeWidth: isRelevant ? 2 : 1
            }}
            transition={{ duration: 0.3 }}
        />
    );
});
Connection.displayName = 'Connection';

// Memoized Node Component
const Node = memo(({ node, isNodeHighlighted, handleNodeHover, handleNodeLeave, localHover, highlightedTechs }: {
    node: typeof nodes[0];
    isNodeHighlighted: (label: string) => boolean;
    handleNodeHover: (node: typeof nodes[0]) => void;
    handleNodeLeave: () => void;
    localHover: string | null;
    highlightedTechs: string[];
}) => {
    const isHovered = localHover === node.id;
    const isExternalHighlight = isNodeHighlighted(node.label);
    const somethingIsHighlighted = highlightedTechs.length > 0;
    const isActive = isHovered || isExternalHighlight;
    const isDimmed = somethingIsHighlighted && !isActive;

    return (
        <motion.div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onHoverStart={() => handleNodeHover(node)}
            onHoverEnd={handleNodeLeave}
            animate={{
                scale: isActive ? 1.2 : 1,
                opacity: isDimmed ? 0.2 : 1,
                y: isActive ? 0 : [0, -10, 0]
            }}
            transition={{
                y: { repeat: Infinity, duration: 3 + Math.random() * 2, ease: "easeInOut" },
                default: { duration: 0.3 }
            }}
        >
            <div className={`
                px-4 py-2 rounded-full border backdrop-blur-md font-mono text-sm transition-colors duration-300
                ${isActive
                    ? "bg-cyan-500 text-black border-cyan-400 font-bold shadow-[0_0_20px_rgba(0,255,255,0.5)] z-20"
                    : "bg-black/50 text-neutral-500 border-white/10 hover:border-white/30"
                }
            `}>
                {node.label}
            </div>
        </motion.div>
    );
});
Node.displayName = 'Node';

// Mobile Skill Cloud Component
const SkillCloud = memo(() => {
    return (
        <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto px-4">
            {nodes.map((node) => (
                <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: Math.random() * 0.3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full border font-mono text-sm ${typeColors[node.type] || "bg-black/50 text-white border-white/20"}`}
                >
                    {node.label}
                </motion.div>
            ))}
        </div>
    );
});
SkillCloud.displayName = 'SkillCloud';

export const TechConstellation = memo(() => {
    const isMobile = useIsMobile();
    const { highlightedTechs, setHighlightedTechs, clearHighlight } = useTechStore();
    const [localHover, setLocalHover] = useState<string | null>(null);

    const isNodeHighlighted = useCallback((nodeLabel: string) => {
        return highlightedTechs.includes(nodeLabel);
    }, [highlightedTechs]);

    const handleNodeHover = useCallback((node: typeof nodes[0]) => {
        setLocalHover(node.id);
        setHighlightedTechs([node.label]);
    }, [setHighlightedTechs]);

    const handleNodeLeave = useCallback(() => {
        setLocalHover(null);
        clearHighlight();
    }, [clearHighlight]);

    return (
        <section id="skills" className="min-h-screen bg-[#050505] relative flex flex-col items-center justify-center overflow-hidden py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05),transparent_70%)]" />

            <div className="text-center mb-12 z-10">
                <h2 className="text-sm font-mono text-cyan-500 tracking-[0.5em] mb-4">SYSTEM_MODULES</h2>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">TECH STACK</h1>
            </div>

            {/* Mobile: Show SkillCloud, Desktop: Show SVG Graph */}
            {isMobile ? (
                <SkillCloud />
            ) : (
                <div className="relative w-full max-w-6xl aspect-square md:aspect-video">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        {connections.map((connection, index) => {
                            const [a, b] = connection;
                            return (
                                <Connection
                                    key={`${a}-${b}`}
                                    connection={connection}
                                    isNodeHighlighted={isNodeHighlighted}
                                    localHover={localHover}
                                    highlightedTechs={highlightedTechs}
                                />
                            );
                        })}
                    </svg>

                    {nodes.map((node) => (
                        <Node
                            key={node.id}
                            node={node}
                            isNodeHighlighted={isNodeHighlighted}
                            handleNodeHover={handleNodeHover}
                            handleNodeLeave={handleNodeLeave}
                            localHover={localHover}
                            highlightedTechs={highlightedTechs}
                        />
                    ))}
                </div>
            )}

            <div className="absolute bottom-10 left-4 md:left-10 text-xs font-mono text-neutral-600">
                {isMobile ? "TAP TO EXPLORE" : "SYSTEM ARCHITECTURE VISUALIZER"}
            </div>
        </section>
    );
});
TechConstellation.displayName = 'TechConstellation';

