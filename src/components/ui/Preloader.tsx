"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const codeLines = [
    'const newton = await compile({',
    '  role: ["developer", "designer"],',
    '  universe: "expanding...",',
    '  stack: ["React", "Three.js", "Next.js"],',
    '  mode: "nexus",',
    '});',
    '',
    '> Initializing gravitational field...',
    '> Loading orbital mechanics...',
    '> Compiling design systems...',
    '> Rendering universe...',
    '> ACCESS GRANTED.',
];

export function Preloader() {
    const [isVisible, setIsVisible] = useState(true);
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<'typing' | 'explode' | 'done'>('typing');
    const animFrameRef = useRef<number>(0);

    const animate = useCallback(() => {
        let lineIndex = 0;
        let prog = 0;

        const addLine = () => {
            if (lineIndex < codeLines.length) {
                setDisplayedLines((prev) => [...prev, codeLines[lineIndex]]);
                lineIndex++;
                prog = Math.min(100, Math.round((lineIndex / codeLines.length) * 100));
                setProgress(prog);
                setTimeout(addLine, 80 + Math.random() * 60);
            } else {
                setPhase('explode');
                setTimeout(() => {
                    setPhase('done');
                    setTimeout(() => setIsVisible(false), 400);
                }, 600);
            }
        };

        setTimeout(addLine, 300);
    }, []);

    useEffect(() => {
        animate();
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [animate]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {phase !== 'done' && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                    style={{ background: "#050505" }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    {/* Particles floating toward center */}
                    <div className="absolute inset-0">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    width: Math.random() * 3 + 1,
                                    height: Math.random() * 3 + 1,
                                    background: i % 2 === 0 ? "#111111" : "#7a7a7a",
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    x: [0, (50 - Math.random() * 100)],
                                    y: [0, (50 - Math.random() * 100)],
                                    opacity: [0.8, 0],
                                    scale: [1, 0],
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                    ease: "easeIn",
                                }}
                            />
                        ))}
                    </div>

                    {/* Terminal content */}
                    <motion.div
                        className="relative z-10 w-full max-w-lg px-6"
                        animate={phase === 'explode' ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Code lines */}
                        <div className="font-mono text-sm space-y-1 mb-8">
                            {displayedLines.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className={
                                        line?.startsWith('>')
                                            ? 'text-white/75'
                                            : line?.startsWith('const') || line?.startsWith('  ')
                                                ? 'text-white/80'
                                                : 'text-white/60'
                                    }
                                >
                                    {line || '\u00A0'}
                                </motion.div>
                            ))}
                            {phase === 'typing' && (
                                <motion.span
                                    className="inline-block w-2 h-4 bg-neutral-300"
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                />
                            )}
                        </div>

                        {/* Progress bar */}
                        <div className="relative h-[2px] w-full rounded-full overflow-hidden" style={{ background: "#1a1a1a" }}>
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: "linear-gradient(90deg, #111111, #4a4a4a, #7a7a7a)",
                                    width: `${progress}%`,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="font-mono text-[10px] text-white/30">COMPILING UNIVERSE</span>
                            <span className="font-mono text-[10px] text-white/30">{progress}%</span>
                        </div>
                    </motion.div>

                    {/* Explode flash */}
                    {phase === 'explode' && (
                        <motion.div
                            className="absolute inset-0 z-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.6 }}
                            style={{
                                background: "radial-gradient(circle, rgba(120,120,120,0.28), transparent 70%)",
                            }}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
