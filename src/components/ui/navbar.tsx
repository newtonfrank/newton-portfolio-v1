"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "#about" },
    { name: "Process", link: "#process" },
    { name: "Projects", link: "#projects" },
    { name: "Skills", link: "#skills" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
                scrolled
                    ? "bg-black/20 backdrop-blur-md border-white/10 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                <Link href="/" className="relative z-50">
                    <span className="font-sans text-xl md:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 hover:to-white transition-all cursor-pointer">
                        Newton Frank
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.link}
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                        </Link>
                    ))}
                    <Link
                        href="mailto:contact@newton.com"
                        className="px-5 py-2 rounded-full border border-white/20 bg-white/5 text-sm font-medium text-white hover:bg-white/10 hover:border-white/40 transition-all"
                    >
                        Contact
                    </Link>
                </nav>

                {/* Mobile Nav Toggle - Simplified for now, can be expanded */}
                <div className="md:hidden">
                    {/* Mobile menu implementation can be added here if requested, keeping it simple for now to focus on the main look */}
                </div>
            </div>
        </motion.header>
    );
}
