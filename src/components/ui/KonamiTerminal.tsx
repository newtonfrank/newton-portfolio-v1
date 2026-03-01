"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a",
];

const ASCII_ART = `
  ╭─────────────────────────────────────────╮
  │  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗   │
  │  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║   │
  │  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║   │
  │  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║   │
  │  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝   │
  │  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝   │
  ╰─────────────────────────────────────────╯
`;

interface FileSystem {
    [key: string]: string | { [key: string]: string };
}

const FS: FileSystem = {
    "about.txt": `
  Name:     Newton Frank F
  Role:     Full-Stack Developer & Designer
  Location: Building the Nexus
  Status:   Available for new orbits

  I craft experiences at the intersection of code and creativity.
  By day I write clean, performant code. By night I push pixels
  until they feel right.
`,
    "skills.json": `{
    "languages": ["TypeScript", "JavaScript", "Python", "CSS"],
    "frameworks": ["React", "Next.js", "Three.js", "Node.js"],
    "design": ["Figma", "Photoshop", "Motion Design", "UI/UX"],
    "tools": ["Git", "Docker", "Vercel", "Supabase"]
  }`,
    projects: {
        "bitnote.md": "# Bitnote\nThe Ultimate Ecosystem for Modern Learners.\nStack: Next.js, TypeScript, Supabase, AI",
        "unipix.md": "# UniPix\nComponent-based Design System & UI Kit.\nStack: React, Storybook, CSS, Design Tokens",
        "iiot.md": "# IIoT Dashboard\nIndustrial IoT with real-time monitoring.\nStack: WebSockets, D3.js, React",
    },
    "resume.txt": "→ Download: /newton-resume.pdf",
};

const COMMANDS: { [key: string]: string } = {
    help: `
  Available commands:
  ──────────────────
  help         Show this help text
  ls           List files and directories
  cat <file>   Read a file
  cd <dir>     Enter a directory
  pwd          Print working directory
  clear        Clear the terminal
  neofetch     System information
  whoami       Current user
  date         Current date & time
  exit         Close terminal
  `,
    whoami: "  newton@nexus",
    pwd: "  ~/nexus",
};

export function KonamiTerminal() {
    const [isOpen, setIsOpen] = useState(false);
    const [konamiIndex, setKonamiIndex] = useState(0);
    const [history, setHistory] = useState<Array<{ type: "input" | "output"; text: string }>>([]);
    const [input, setInput] = useState("");
    const [cwd, setCwd] = useState("~");
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Listen for Konami code
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isOpen) return;

            if (e.key === KONAMI[konamiIndex]) {
                e.preventDefault();
                e.stopPropagation();
                const nextIndex = konamiIndex + 1;
                if (nextIndex === KONAMI.length) {
                    setIsOpen(true);
                    setKonamiIndex(0);
                    setHistory([
                        { type: "output", text: ASCII_ART },
                        { type: "output", text: "  ✦ ACCESS GRANTED — Welcome to the Nexus Terminal" },
                        { type: "output", text: "  Type 'help' for available commands.\n" },
                    ]);
                } else {
                    setKonamiIndex(nextIndex);
                }
            } else {
                setKonamiIndex(0);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [konamiIndex, isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    // Focus input when opened (with delay to avoid key leak)
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const executeCommand = useCallback(
        (cmd: string) => {
            const parts = cmd.trim().split(/\s+/);
            const command = parts[0]?.toLowerCase();
            const args = parts.slice(1);

            const addOutput = (text: string) => {
                setHistory((prev) => [
                    ...prev,
                    { type: "input", text: `  ${cwd} ~$ ${cmd}` },
                    { type: "output", text },
                ]);
            };

            if (!command) return;

            switch (command) {
                case "clear":
                    setHistory([]);
                    break;

                case "exit":
                    setIsOpen(false);
                    setHistory([]);
                    break;

                case "ls": {
                    if (cwd === "~/projects") {
                        const dir = FS["projects"] as { [key: string]: string };
                        addOutput("  " + Object.keys(dir).join("  "));
                    } else {
                        const files = Object.keys(FS);
                        const formatted = files.map((f) =>
                            typeof FS[f] === "object" ? `\x1b[34m${f}/\x1b[0m` : f
                        );
                        addOutput("  " + formatted.join("  ").replace(/\x1b\[\d+m/g, ""));
                        // Simplified output without ANSI
                        setHistory((prev) => {
                            const last = prev[prev.length - 1];
                            if (last) {
                                return [
                                    ...prev.slice(0, -1),
                                    {
                                        type: "output" as const,
                                        text: "  " + files.map((f) => (typeof FS[f] === "object" ? `📁 ${f}` : `📄 ${f}`)).join("  "),
                                    },
                                ];
                            }
                            return prev;
                        });
                    }
                    break;
                }

                case "cat": {
                    const filename = args[0];
                    if (!filename) {
                        addOutput("  Usage: cat <filename>");
                        break;
                    }
                    if (cwd === "~/projects") {
                        const dir = FS["projects"] as { [key: string]: string };
                        if (dir[filename]) {
                            addOutput(dir[filename]);
                        } else {
                            addOutput(`  cat: ${filename}: No such file`);
                        }
                    } else if (FS[filename] && typeof FS[filename] === "string") {
                        addOutput(FS[filename] as string);
                    } else {
                        addOutput(`  cat: ${filename}: No such file`);
                    }
                    break;
                }

                case "cd": {
                    const dir = args[0];
                    if (!dir || dir === "~" || dir === "..") {
                        setCwd("~");
                        addOutput("");
                    } else if (dir === "projects" && cwd === "~") {
                        setCwd("~/projects");
                        addOutput("");
                    } else {
                        addOutput(`  cd: ${dir}: Not a directory`);
                    }
                    break;
                }

                case "neofetch": {
                    const info = `${ASCII_ART}
  newton@nexus
  ────────────────
  OS:       The Nexus v2.0
  Shell:    next.js 14.2
  Runtime:  React 18 + Three.js
  Theme:    Spectrum [Dev ↔ Design]
  Fonts:    Inter, JetBrains Mono, Outfit
  Uptime:   ∞
  `;
                    addOutput(info);
                    break;
                }

                case "date":
                    addOutput(`  ${new Date().toLocaleString()}`);
                    break;

                default:
                    if (COMMANDS[command]) {
                        addOutput(COMMANDS[command]);
                    } else {
                        addOutput(`  command not found: ${command}. Try 'help'.`);
                    }
            }
        },
        [cwd]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            executeCommand(input);
            setInput("");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0"
                        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Terminal Window */}
                    <motion.div
                        className="relative w-[90vw] max-w-3xl h-[70vh] rounded-lg overflow-hidden"
                        style={{
                            background: "#0a0a0a",
                            border: "1px solid #1a1a1a",
                            boxShadow: "0 0 60px rgba(0, 243, 255, 0.1), 0 0 120px rgba(0, 0, 0, 0.5)",
                        }}
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        {/* CRT scanlines */}
                        <div
                            className="absolute inset-0 pointer-events-none z-10"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                                opacity: 0.3,
                            }}
                        />

                        {/* Title bar */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "#1a1a1a" }}>
                            <button
                                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                                onClick={() => setIsOpen(false)}
                            />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            <span className="ml-3 font-mono text-[11px] text-white/30">
                                nexus-terminal — {cwd}
                            </span>
                            <span className="ml-auto font-mono text-[10px] text-white/20">
                                ↑↑↓↓←→←→BA
                            </span>
                        </div>

                        {/* Terminal body */}
                        <div ref={scrollRef} className="h-[calc(100%-88px)] overflow-y-auto p-4 font-mono text-sm">
                            {history.map((entry, i) => (
                                <div
                                    key={i}
                                    className="whitespace-pre-wrap mb-1"
                                    style={{
                                        color: entry.type === "input" ? "#00f3ff" : "#a0a0a0",
                                        fontSize: "13px",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    {entry.text}
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center gap-2 px-4 py-3 border-t"
                            style={{ borderColor: "#1a1a1a" }}
                        >
                            <span className="font-mono text-xs" style={{ color: "#00f3ff" }}>
                                {cwd} ~$
                            </span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 bg-transparent outline-none font-mono text-sm"
                                style={{ color: "#f0f0f0" }}
                                autoFocus
                                spellCheck={false}
                            />
                            <motion.span
                                className="inline-block w-2 h-4 bg-cyan-400"
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            />
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
