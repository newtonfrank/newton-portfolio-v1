"use client";

import React from "react";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";

const socials = [
    { icon: Github, href: "https://github.com/newtonfrank" },
    { icon: Linkedin, href: "https://linkedin.com/in/newtonfrank" },
    { icon: Twitter, href: "https://twitter.com/newtonfrank" },
    { icon: Mail, href: "mailto:hi@newtonfrank.com" },
];

export function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative py-12 border-t border-border bg-deep-space text-white">
            <div className="section-container flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black mb-1 tracking-tight">
                        NEWTON<span className="text-transparent stroke-text italic" style={{ WebkitTextStroke: '1px #e50012' }}>FRANK</span>
                    </h3>
                    <p className="text-xs text-text-secondary uppercase tracking-widest font-mono">
                        Digital Architect
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    {socials.map((social, i) => (
                        <a
                            key={i}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-racing-red transition-colors"
                        >
                            <social.icon size={20} />
                        </a>
                    ))}
                </div>

                <button
                    onClick={scrollToTop}
                    className="flex items-center gap-3 text-xs uppercase tracking-widest text-text-secondary hover:text-racing-red transition-colors"
                >
                    Back to top
                    <div className="p-2 border border-border rounded-full hover:border-racing-red transition-colors">
                       <ArrowUp size={14} />
                    </div>
                </button>
            </div>

            <div className="mt-12 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-text-secondary">
                    © {new Date().getFullYear()} Newton Frank. Designed for the web.
                </p>
            </div>
        </footer>
    );
}
