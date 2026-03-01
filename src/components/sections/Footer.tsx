"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSpectrum } from "@/store/useSpectrum";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";

const socials = [
    { icon: Github, href: "https://github.com/newtonfrank" },
    { icon: Linkedin, href: "https://linkedin.com/in/newtonfrank" },
    { icon: Twitter, href: "https://twitter.com/newtonfrank" },
    { icon: Mail, href: "mailto:hi@newtonfrank.com" },
];

export function Footer() {
    const mode = useSpectrum((s) => s.getMode());

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative py-16 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="section-container">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Left: Branding */}
                    <div className="text-center md:text-left">
                        <h3
                            className="text-lg font-bold mb-1"
                            style={{
                                color: "var(--color-accent)",
                                fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                            }}
                        >
                            {mode === "dev" ? "newton~$" : "Newton Frank"}
                        </h3>
                        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                            {mode === "dev"
                                ? "// crafting the nexus between code & design"
                                : "Where gravity meets design"}
                        </p>
                    </div>

                    {/* Center: Social orbit */}
                    <div className="flex items-center gap-4">
                        {socials.map((social, i) => (
                            <motion.a
                                key={i}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full transition-colors"
                                style={{
                                    color: "var(--color-text-secondary)",
                                    border: "1px solid var(--color-border)",
                                }}
                                whileHover={{
                                    scale: 1.1,
                                    color: "var(--color-accent)",
                                    borderColor: "var(--color-accent)",
                                }}
                            >
                                <social.icon size={16} />
                            </motion.a>
                        ))}
                    </div>

                    {/* Right: Back to top */}
                    <motion.button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-xs transition-colors"
                        style={{
                            color: "var(--color-text-secondary)",
                            fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                        }}
                        whileHover={{ color: "var(--color-accent)" }}
                    >
                        {mode === "dev" ? "scrollTo(0)" : "Back to top"}
                        <ArrowUp size={14} />
                    </motion.button>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-6 border-t text-center" style={{ borderColor: "var(--color-border)" }}>
                    <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--color-text-secondary)" }}>
                        {mode === "dev"
                            ? `© ${new Date().getFullYear()} // built with next.js + three.js + gravity`
                            : `© ${new Date().getFullYear()} Newton Frank. Crafted with care.`}
                    </p>
                </div>
            </div>
        </footer>
    );
}
