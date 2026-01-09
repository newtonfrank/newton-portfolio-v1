"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { Command } from "cmdk";
import { Search, Home, Code, Cpu, Monitor, Sun, Moon, Mail, Check, Download, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Memoized Command Item Component
const CommandItem = memo(({
    onSelect,
    children,
    className,
    icon: Icon,
    label,
    shortcut
}: {
    onSelect: () => void;
    children: React.ReactNode;
    className?: string;
    icon?: React.ElementType;
    label: string;
    shortcut?: string;
}) => (
    <Command.Item
        onSelect={onSelect}
        className={`flex items-center px-3 py-2 text-sm text-neutral-300 rounded hover:bg-white/5 aria-selected:bg-white/10 aria-selected:text-cyan-400 aria-selected:border-l-2 aria-selected:border-cyan-500 cursor-pointer transition-all ${className || ''}`}
    >
        {Icon && <Icon className="w-4 h-4 mr-3 opacity-70" />}
        <span>{children}</span>
        {shortcut && <span className="ml-auto text-[10px] opacity-30 border border-white/10 px-1 rounded">{shortcut}</span>}
    </Command.Item>
));
CommandItem.displayName = 'CommandItem';

export const CommandPalette = memo(() => {
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

    const run = useCallback((action: () => void) => {
        setOpen(false);
        action();
    }, []);

    const copyEmail = useCallback(() => {
        navigator.clipboard.writeText("newton@example.com"); // Replace with actual email
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
        setOpen(false);
    }, []);

    const switchTheme = useCallback((theme: 'dark' | 'light' | 'system') => {
        // Implementation for theme switching
        // For now, this mimics the action as requested in the "Task"
        console.log(`Switching theme to ${theme}`);
        // In a real app with next-themes: setTheme(theme)
        setOpen(false);
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const scrollToProjects = useCallback(() => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const scrollToSkills = useCallback(() => {
        document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const openGithub = useCallback(() => {
        window.open('https://github.com/newton', '_blank');
    }, []);

    const openLinkedIn = useCallback(() => {
        window.open('https://linkedin.com/in/newton', '_blank');
    }, []);

    const downloadResume = useCallback(() => {
        const link = document.createElement('a');
        link.href = '/Newton_Resume.pdf';
        link.download = 'Newton_Resume.pdf';
        link.click();
    }, []);

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
                                        <CommandItem
                                            onSelect={() => run(scrollToTop)}
                                            icon={Home}
                                            label="System Root"
                                            shortcut="HOME"
                                        >
                                            System Root
                                        </CommandItem>
                                        <CommandItem
                                            onSelect={() => run(scrollToProjects)}
                                            icon={Monitor}
                                            label="Access Holographic Deck"
                                            shortcut="PROJ"
                                        >
                                            Access Holographic Deck
                                        </CommandItem>
                                        <CommandItem
                                            onSelect={() => run(scrollToSkills)}
                                            icon={Cpu}
                                            label="Tech Constellation"
                                            shortcut="TECH"
                                        >
                                            Tech Constellation
                                        </CommandItem>
                                    </Command.Group>

                                    <div className="h-px bg-white/5 my-2 mx-2" />

                                    <Command.Group heading="SYSTEM ACTIONS" className="text-[10px] text-neutral-500 font-bold mb-2 px-2 tracking-widest">
                                        <CommandItem
                                            onSelect={copyEmail}
                                            icon={emailCopied ? Check : Mail}
                                            label={emailCopied ? "Email Address Copied" : "Copy Secure Email"}
                                            className={emailCopied ? "text-green-500" : ""}
                                        >
                                            {emailCopied ? "Email Address Copied" : "Copy Secure Email"}
                                        </CommandItem>
                                        <CommandItem
                                            onSelect={() => run(openGithub)}
                                            icon={Code}
                                            label="Access Source Code"
                                            shortcut="GIT"
                                        >
                                            Access Source Code
                                        </CommandItem>
                                        <CommandItem
                                            onSelect={() => run(openLinkedIn)}
                                            icon={Linkedin}
                                            label="Open LinkedIn Profile"
                                            shortcut="LI"
                                        >
                                            Open LinkedIn Profile
                                        </CommandItem>
                                        <CommandItem
                                            onSelect={() => run(downloadResume)}
                                            icon={Download}
                                            label="Download Resume"
                                            shortcut="PDF"
                                        >
                                            Download Resume
                                        </CommandItem>
                                    </Command.Group>

                                    <div className="h-px bg-white/5 my-2 mx-2" />

                                    <Command.Group heading="INTERFACE THEME" className="text-[10px] text-neutral-500 font-bold mb-2 px-2 tracking-widest">
                                        <CommandItem
                                            onSelect={() => switchTheme('dark')}
                                            icon={Moon}
                                            label="Dark Mode"
                                        >
                                            Dark Mode
                                        </CommandItem>
                                        <CommandItem
                                            onSelect={() => switchTheme('light')}
                                            icon={Sun}
                                            label="Light Mode"
                                        >
                                            Light Mode
                                        </CommandItem>
                                    </Command.Group>
                                </Command.List>
                            </Command>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
});
CommandPalette.displayName = 'CommandPalette';

