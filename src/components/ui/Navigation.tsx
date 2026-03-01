"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpectrum } from "@/store/useSpectrum";
import { MagneticWrapper } from "./MagneticWrapper";

const navItems = [
    { id: "hero", label: "Home", devLabel: "~/home" },
    { id: "about", label: "About", devLabel: "~/about" },
    { id: "work", label: "Work", devLabel: "~/projects" },
    { id: "skills", label: "Skills", devLabel: "~/skills" },
    { id: "contact", label: "Contact", devLabel: "~/contact" },
];

export function Navigation() {
    const mode = useSpectrum((s) => s.getMode());
    const [activeSection, setActiveSection] = useState("hero");
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Update active section based on scroll
            const sections = navItems.map((item) => ({
                id: item.id,
                el: document.getElementById(item.id),
            }));

            for (let i = sections.length - 1; i >= 0; i--) {
                const el = sections[i].el;
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 3) {
                        setActiveSection(sections[i].id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setMobileOpen(false);
        }
    }, []);

    return (
        <>
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ delay: 2.5, duration: 0.6, ease: "easeOut" }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 -z-10"
                    animate={{
                        backgroundColor: isScrolled
                            ? mode === "design"
                                ? "rgba(250, 248, 245, 0.85)"
                                : "rgba(5, 5, 5, 0.85)"
                            : "transparent",
                        backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ borderBottom: isScrolled ? `1px solid var(--color-border)` : "none" }}
                />

                {/* Logo */}
                <button
                    onClick={() => scrollTo("hero")}
                    className="relative z-10 select-none"
                >
                    <motion.span
                        className="text-lg font-bold"
                        style={{
                            color: "var(--color-accent)",
                            fontFamily: mode === "dev" ? "var(--font-mono)" : "var(--font-outfit, sans-serif)",
                        }}
                    >
                        {mode === "dev" ? "newton~$" : "Newton."}
                    </motion.span>
                </button>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <MagneticWrapper key={item.id} strength={8} radius={100}>
                            <button
                                onClick={() => scrollTo(item.id)}
                                className="relative px-3 py-2 text-sm transition-colors"
                                style={{
                                    color:
                                        activeSection === item.id
                                            ? "var(--color-accent)"
                                            : "var(--color-text-secondary)",
                                    fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                }}
                            >
                                {mode === "dev" ? item.devLabel : item.label}
                                {activeSection === item.id && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
                                        style={{
                                            width: "60%",
                                            background: "var(--color-accent)",
                                            boxShadow: `0 0 8px var(--color-glow)`,
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </button>
                        </MagneticWrapper>
                    ))}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden relative z-10 w-8 h-8 flex flex-col justify-center items-center gap-1"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <motion.span
                        className="block w-5 h-[2px] rounded-full"
                        style={{ background: "var(--color-text)" }}
                        animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 3 : 0 }}
                    />
                    <motion.span
                        className="block w-5 h-[2px] rounded-full"
                        style={{ background: "var(--color-text)" }}
                        animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -3 : 0 }}
                    />
                </button>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ backgroundColor: "var(--color-bg)", backdropFilter: "blur(20px)" }}
                    >
                        <div className="flex flex-col items-center gap-6">
                            {navItems.map((item, i) => (
                                <motion.button
                                    key={item.id}
                                    onClick={() => scrollTo(item.id)}
                                    className="text-2xl font-light"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={{
                                        color:
                                            activeSection === item.id
                                                ? "var(--color-accent)"
                                                : "var(--color-text)",
                                        fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                    }}
                                >
                                    {mode === "dev" ? item.devLabel : item.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
