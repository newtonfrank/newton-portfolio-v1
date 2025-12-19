"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Code, Cpu } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface TerminalLine {
    type: "out" | "in";
    content: React.ReactNode;
}

export const TerminalHero = () => {
    const [history, setHistory] = useState<TerminalLine[]>([]);
    const [isBooting, setIsBooting] = useState(true);
    const [command, setCommand] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    // Boot Sequence Data
    const bootSequence = [
        "INITIALIZING CORE SYSTEM...",
        "LOADING MODULES: [REACT, NEXT.JS, TAILWIND]...",
        "ESTABLISHING SECURE CONNECTION...",
        "ACCESS GRANTED.",
        "WELCOME, USER."
    ];

    useEffect(() => {
        let delay = 0;
        const initialLines: TerminalLine[] = [];

        bootSequence.forEach((line, index) => {
            setTimeout(() => {
                setHistory(prev => [...prev, { type: "out", content: line }]);
                if (index === bootSequence.length - 1) {
                    setTimeout(() => setIsBooting(false), 800);
                }
            }, delay);
            delay += 500 + Math.random() * 500;
        });
    }, []);

    // Auto-scroll to bottom within terminal only (not the page)
    useEffect(() => {
        if (bottomRef.current) {
            // Use block: 'nearest' to only scroll within the container, not the whole page
            bottomRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [history]);

    // Keep focus
    useEffect(() => {
        if (!isBooting) {
            inputRef.current?.focus();
        }
    }, [isBooting, history]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = command.trim().toLowerCase();

        // Add input to history
        const newHistory: TerminalLine[] = [...history, { type: "in", content: command }];

        // Process command
        let output: React.ReactNode = "";

        // Helper for scrolling with error handling
        const scrollToSection = (sectionId: string, sectionName: string): React.ReactNode => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                return `Navigating to [${sectionName}] sector...`;
            } else {
                return <span className="text-red-400">ERROR: TARGET_NOT_FOUND - Section '{sectionId}' not available</span>;
            }
        };

        switch (cmd) {
            case "help":
                output = (
                    <div className="text-yellow-200">
                        AVAILABLE COMMANDS:<br />
                        <span className="text-cyan-400">home</span>     - Return to top<br />
                        <span className="text-cyan-400">about</span>    - View operator profile<br />
                        <span className="text-cyan-400">projects</span> - View deployed modules<br />
                        <span className="text-cyan-400">skills</span>   - View tech constellation<br />
                        <span className="text-cyan-400">contact</span>  - Open communication channel<br />
                        <span className="text-cyan-400">clear</span>    - Wipe terminal
                    </div>
                );
                break;
            case "home":
                output = "Returning to [HOME] sector...";
                window.scrollTo({ top: 0, behavior: "smooth" });
                break;
            case "about":
                output = scrollToSection("about", "OPERATOR PROFILE");
                break;
            case "projects":
                output = scrollToSection("projects", "PROJECTS");
                break;
            case "skills":
                output = scrollToSection("skills", "TECH CONSTELLATION");
                break;
            case "contact":
                output = scrollToSection("contact", "CONTACT");
                break;
            case "clear":
                setHistory([]);
                setCommand("");
                return; // Early return to avoid adding "clear" output
            case "":
                output = "";
                break;
            default:
                output = <span className="text-red-400">Command not found: '{cmd}'. Type 'help' for list.</span>;
        }

        if (output) {
            newHistory.push({ type: "out", content: output });
        }

        setHistory(newHistory);
        setCommand("");
    };

    // Handle input change with haptic feedback
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommand(e.target.value);
        // Haptic feedback on mobile (subtle vibration)
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(3);
        }
    };

    return (
        <section className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden font-mono z-10 w-full pt-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-black/80 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md shadow-[0_0_40px_rgba(0,255,255,0.05)] flex flex-col max-h-[80vh]"
            >
                {/* Terminal Header */}
                <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/10 shrink-0">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center">
                        <Terminal className="w-3 h-3 mr-2" />
                        newton_os_v2.0
                    </div>
                </div>

                {/* Terminal Body */}
                <div
                    className="p-6 md:p-10 flex-1 overflow-y-auto min-h-[400px] text-sm md:text-base text-green-500/90 font-mono scrollbar-hide"
                    onClick={() => inputRef.current?.focus()}
                >
                    {/* History */}
                    <div className="space-y-1">
                        {history.map((line, i) => (
                            <div key={i} className={`flex ${line.type === "in" ? "text-white" : "text-green-500/90"}`}>
                                <span className="mr-2 opacity-50 shrink-0">
                                    {line.type === "in" ? "root@newton:~$" : ">"}
                                </span>
                                <div className="break-all">{line.content}</div>
                            </div>
                        ))}
                    </div>

                    {/* Active Input Line */}
                    {!isBooting && (
                        <form onSubmit={handleCommand} className="flex items-center mt-1">
                            <span className="text-cyan-500 mr-2 shrink-0">root@newton:~$</span>
                            <div className="relative flex-1">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={command}
                                    onChange={handleInputChange}
                                    onFocus={() => {
                                        // Scroll input into view when focused (for mobile keyboard)
                                        setTimeout(() => {
                                            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }, 300);
                                    }}
                                    className="bg-transparent border-none outline-none text-white w-full placeholder-neutral-700 p-0 m-0"
                                    autoComplete="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                />
                                {command.length === 0 && (
                                    <span className="absolute left-0 top-0 text-neutral-700 pointer-events-none">
                                        Type 'help' ...
                                    </span>
                                )}
                            </div>
                        </form>
                    )}
                    <div ref={bottomRef} />
                    {/* Mobile keyboard safe zone spacer */}
                    {isMobile && <div className="h-[40vh] shrink-0" />}
                </div>
            </motion.div>
        </section>
    );
};

