"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Home, Code, Cpu, Monitor, Sun, Moon, Laptop, Mail, Copy, Check, Download, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const [emailCopied, setEmailCopied] = useState(false);

    // Toggle Command Palette
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const run = (action: () => void) => {
        setOpen(false);
        action();
    };

    const copyEmail = () => {
        navigator.clipboard.writeText("newton@example.com"); // Replace with actual email
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
        setOpen(false);
    };

    const switchTheme = (theme: 'dark' | 'light' | 'system') => {
        // Implementation for theme switching
        // For now, this mimics the action as requested in the "Task"
        console.log(`Switching theme to ${theme}`);
        // In a real app with next-themes: setTheme(theme)
        setOpen(false);
    };

    return (
        <>
            {/* Helper Hint */}
            <div
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-black/90 border border-white/10 rounded-full text-xs font-mono text-neutral-500 cursor-pointer hover:text-white hover:border-cyan-500/50 transition-colors backdrop-blur-md hidden md:flex items-center gap-2 group"
            >
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span>SYSTEM CMDS</span>
                <kbd className="font-sans text-[10px] border border-neutral-700 px-1 rounded ml-2 group-hover:border-cyan-500/50">⌘K</kbd>
            </div>

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">

                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="relative w-full max-w-2xl px-4"
                        >
                            <Command
                                className="w-full bg-[#0a0a0a]/90 border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,255,255,0.1)] overflow-hidden font-mono backdrop-blur-xl"
                                label="Command Menu"
                            >
                                <div className="flex items-center border-b border-white/10 px-4">
                                    <Search className="w-4 h-4 text-cyan-500 mr-2" />
                                    <Command.Input
                                        className="w-full bg-transparent p-4 text-white placeholder:text-neutral-600 focus:outline-none text-sm"
                                        placeholder="Execute system command..."
                                        autoFocus
                                    />
                                </div>

                                <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-none">
                                    <Command.Empty className="p-4 text-center text-neutral-500 text-sm">NO MATCHING COMMANDS FOUND.</Command.Empty>

                                    <Command.Group heading="NAVIGATION" className="text-[10px] text-neutral-500 font-bold mb-2 px-2 tracking-widest mt-2">
                                        <Command.Item
                                            onSelect={() => run(() => window.scrollTo({ top: 0, behavior: "smooth" }))}
                                            className="flex items-center px-3 py-2 text-sm text-neutral-300 rounded hover:bg-white/5 aria-selected:bg-white/10 aria-selected:text-cyan-400 aria-selected:border-l-2 aria-selected:border-cyan-500 cursor-pointer transition-all"
                                        >
                                            <Home className="w-4 h-4 mr-3 opacity-70" />
                                            <span>System Root</span>
                                            <span className="ml-auto text-[10px] opacity-30 border border-white/10 px-1 rounded">HOME</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => run(() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }))}
                                            className="flex items-center px-3 py-2 text-sm text-neutral-300 rounded hover:bg-white/5 aria-selected:bg-white/10 aria-selected:text-cyan-400 aria-selected:border-l-2 aria-selected:border-cyan-500 cursor-pointer transition-all"
                                        >
                                            <Monitor className="w-4 h-4 mr-3 opacity-70" />
                                            <span>Access Holographic Deck</span>
                                            <span className="ml-auto text-[10px] opacity-30 border border-white/10 px-1 rounded">PROJ</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => run(() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" }))}
                                            className="flex items-center px-3 py-2 text-sm text-neutral-300 rounded hover:bg-white/5 aria-selected:bg-white/10 aria-selected:text-cyan-400 aria-selected:border-l-2 aria-selected:border-cyan-500 cursor-pointer transition-all"
                                        >
                                            <Cpu className="w-4 h-4 mr-3 opacity-70" />
                                            <span>Tech Constellation</span>
                                            <span className="ml-auto text-[10px] opacity-30 border border-white/10 px-1 rounded">TECH</span>
                                        </Command.Item>
                                    </Command.Group>

                                    <div className="h-px bg-white/5 my-2 mx-2" />

                                    <Command.Group heading="SYSTEM ACTIONS" className="text-[10px] text-neutral-500 font-bold mb-2 px-2 tracking-widest">
                                        <Command.Item
                                            onSelect={copyEmail}
                                            className="flex items-center px-3 py-2 text-sm text-neutral-300 rounded hover:bg-white/5 aria-selected:bg-white/10 aria-selected:text-cyan-400 aria-selected:border-l-2 aria-selected:border-cyan-500 cursor-pointer transition-all"
                                        >
                                            {emailCopied ? <Check className="w-4 h-4 mr-3 text-green-500" /> : <Mail className="w-4 h-4 mr-3 opacity-70" />}
                                            <span>{emailCopied ? "Email Address Copied" : "Copy Secure Email"}</span>
                                            <div className="ml-auto flex items-center gap-2">
                                                <span className="text-[10px] opacity-30 hidden group-hover:block">newton@example.com</span>
                                                <span className="text-[10px] opacity-30 border border-white/10 px-1 rounded">CPY</span>
                                            </div>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => run(() => window.open('https://github.com/newton', '_blank'))}
                                            className="flex items-center px-3 py-2 text-sm text-neutral-300 rounded hover:bg-white/5 aria-selected:bg-white/10 aria-selected:text-cyan-400 aria-selected:border-l-2 aria-selected:border-cyan-500 cursor-pointer transition-all"
                                        >
                                            <Code className="w-4 h-4 mr-3 opacity-70" />
                                            <span>Access Source Code</span>
                                            <span className="ml-auto text-[10px] opacity-30 border border-white/10 px-1 rounded">GIT</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => run(() => window.open('https://linkedin.com/in/newton', '_blank'))}
                                            className="flex items-center px-3 py-2 text-sm text-neutral-300 rounded hover:bg-white/5 aria-selected:bg-white/10 aria-selected:text-cyan-400 aria-selected:border-l-2 aria-selected:border-cyan-500 cursor-pointer transition-all"
                                        >
                                            <Linkedin className="w-4 h-4 mr-3 opacity-70" />
                                            <span>Open LinkedIn Profile</span>
                                            <span className="ml-auto text-[10px] opacity-30 border border-white/10 px-1 rounded">LI</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => run(() => {
                                                const link = document.createElement('a');
                                                link.href = '/Newton_Resume.pdf';
                                                link.download = 'Newton_Resume.pdf';
                                                link.click();
                                            })}
                                            className="flex items-center px-3 py-2 text-sm text-neutral-300 rounded hover:bg-white/5 aria-selected:bg-white/10 aria-selected:text-cyan-400 aria-selected:border-l-2 aria-selected:border-cyan-500 cursor-pointer transition-all"
                                        >
                                            <Download className="w-4 h-4 mr-3 opacity-70" />
                                            <span>Download Resume</span>
                                            <span className="ml-auto text-[10px] opacity-30 border border-white/10 px-1 rounded">PDF</span>
                                        </Command.Item>
                                    </Command.Group>

                                    <div className="h-px bg-white/5 my-2 mx-2" />

                                    <Command.Group heading="INTERFACE THEME" className="text-[10px] text-neutral-500 font-bold mb-2 px-2 tracking-widest">
                                        <Command.Item onSelect={() => switchTheme('dark')} className="flex items-center px-3 py-2 text-sm text-neutral-300 rounded hover:bg-white/5 aria-selected:bg-white/10 aria-selected:text-cyan-400 aria-selected:border-l-2 aria-selected:border-cyan-500 cursor-pointer transition-all">
                                            <Moon className="w-4 h-4 mr-3 opacity-70" />
                                            <span>Dark Mode</span>
                                        </Command.Item>
                                        <Command.Item onSelect={() => switchTheme('light')} className="flex items-center px-3 py-2 text-sm text-neutral-300 rounded hover:bg-white/5 aria-selected:bg-white/10 aria-selected:text-cyan-400 aria-selected:border-l-2 aria-selected:border-cyan-500 cursor-pointer transition-all">
                                            <Sun className="w-4 h-4 mr-3 opacity-70" />
                                            <span>Light Mode</span>
                                        </Command.Item>
                                    </Command.Group>
                                </Command.List>
                            </Command>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

