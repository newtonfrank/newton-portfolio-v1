"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Section configuration
const sections = [
    { id: "about", label: "IDENTITY" },
    { id: "execution", label: "EXECUTION" },
    { id: "projects", label: "PROJECTS" },
    { id: "skills", label: "TECH_STACK" },
    { id: "contact", label: "UPLINK" },
];

export const ActiveSectorIndicator = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Wait for initial boot to complete
        const bootTimeout = setTimeout(() => {
            setIsVisible(true);
        }, 4000);

        const observers: IntersectionObserver[] = [];

        // Create observers for each section
        sections.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (!element) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(id);
                    }
                },
                {
                    threshold: 0.3,
                    rootMargin: "-20% 0px -50% 0px"
                }
            );

            observer.observe(element);
            observers.push(observer);
        });

        return () => {
            clearTimeout(bootTimeout);
            observers.forEach(observer => observer.disconnect());
        };
    }, []);

    const activeSectionLabel = sections.find(s => s.id === activeSection)?.label;

    if (!isVisible || !activeSection) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-3 px-4 py-2 bg-black/80 border border-white/10 rounded-full backdrop-blur-md font-mono text-xs"
            >
                {/* Pulsing status dot */}
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>

                {/* Sector label */}
                <span className="text-neutral-500">SECTOR:</span>
                <motion.span
                    key={activeSection}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-cyan-400 font-medium"
                >
                    [{activeSectionLabel}]
                </motion.span>
            </motion.div>
        </AnimatePresence>
    );
};
