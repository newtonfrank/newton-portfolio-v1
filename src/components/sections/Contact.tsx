"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSpectrum } from "@/store/useSpectrum";
import { Send, Github, Linkedin, Twitter, Mail } from "lucide-react";

const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com/newtonfrank", devLabel: "git remote" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/newtonfrank", devLabel: "--network" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com/newtonfrank", devLabel: "@handle" },
    { icon: Mail, label: "Email", href: "mailto:hi@newtonfrank.com", devLabel: "sendmail" },
];

export function Contact() {
    const mode = useSpectrum((s) => s.getMode());
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        type: "both",
        message: "",
    });
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [terminalInput, setTerminalInput] = useState("");
    const [terminalHistory, setTerminalHistory] = useState<string[]>([
        '> contact --help',
        'Usage: contact --name "Your Name" --email "you@email.com" --message "Hello"',
        '> _',
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        // Simulate sending
        await new Promise((r) => setTimeout(r, 1500));
        setIsSending(false);
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    const handleTerminalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTerminalHistory((prev) => [
            ...prev,
            `> ${terminalInput}`,
            terminalInput.includes("--send")
                ? "✓ Message transmitted successfully."
                : `Command: ${terminalInput}`,
        ]);
        setTerminalInput("");
    };

    return (
        <section id="contact" className="relative py-32 md:py-40">
            <div className="section-container">
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <span
                        className="text-xs uppercase tracking-[0.3em] mb-4 block"
                        style={{
                            color: "var(--color-accent)",
                            fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                        }}
                    >
                        {mode === "dev" ? "// 04. contact" : "04 — Contact"}
                    </span>
                    <h2 className="heading-lg text-4xl md:text-5xl mb-4" style={{ color: "var(--color-text)" }}>
                        {mode === "dev" ? "initiate_transmission()" : "Get in Touch"}
                    </h2>
                    <p className="text-sm max-w-md" style={{ color: "var(--color-text-secondary)" }}>
                        {mode === "dev"
                            ? "// open a channel to discuss your next project"
                            : "Let's build something extraordinary together"}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
                    {/* Design mode: Beautiful form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    className="text-xs uppercase tracking-wider block mb-2"
                                    style={{
                                        color: "var(--color-text-secondary)",
                                        fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                    }}
                                >
                                    {mode === "dev" ? "// name" : "Name"}
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 text-sm outline-none transition-all"
                                    style={{
                                        background: "var(--color-surface)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "var(--border-radius)",
                                        color: "var(--color-text)",
                                        fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                    }}
                                    placeholder={mode === "dev" ? "string" : "Your name"}
                                />
                            </div>

                            <div>
                                <label
                                    className="text-xs uppercase tracking-wider block mb-2"
                                    style={{
                                        color: "var(--color-text-secondary)",
                                        fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                    }}
                                >
                                    {mode === "dev" ? "// email" : "Email"}
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 text-sm outline-none transition-all"
                                    style={{
                                        background: "var(--color-surface)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "var(--border-radius)",
                                        color: "var(--color-text)",
                                        fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                    }}
                                    placeholder={mode === "dev" ? "string@string.com" : "your@email.com"}
                                />
                            </div>

                            <div>
                                <label
                                    className="text-xs uppercase tracking-wider block mb-2"
                                    style={{
                                        color: "var(--color-text-secondary)",
                                        fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                    }}
                                >
                                    {mode === "dev" ? "// project_type" : "Project Type"}
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-3 text-sm outline-none transition-all"
                                    style={{
                                        background: "var(--color-surface)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "var(--border-radius)",
                                        color: "var(--color-text)",
                                        fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                    }}
                                >
                                    <option value="design">Design</option>
                                    <option value="development">Development</option>
                                    <option value="both">Both</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    className="text-xs uppercase tracking-wider block mb-2"
                                    style={{
                                        color: "var(--color-text-secondary)",
                                        fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                    }}
                                >
                                    {mode === "dev" ? "// message" : "Message"}
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 text-sm outline-none transition-all resize-none"
                                    style={{
                                        background: "var(--color-surface)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "var(--border-radius)",
                                        color: "var(--color-text)",
                                        fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                    }}
                                    placeholder={mode === "dev" ? "// describe your vision" : "Tell me about your project..."}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all"
                                style={{
                                    background: sent
                                        ? "#10b981"
                                        : "var(--color-accent)",
                                    color: "#fff",
                                    borderRadius: "var(--border-radius)",
                                    fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        ⟳
                                    </motion.span>
                                ) : sent ? (
                                    "✓ Transmitted"
                                ) : (
                                    <>
                                        <Send size={14} />
                                        {mode === "dev" ? "transmit()" : "Send Message"}
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Right side: Terminal + Socials */}
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Terminal panel */}
                        <div
                            className="glass-card p-5 font-mono text-sm"
                            style={{ minHeight: "200px" }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                <span className="text-[10px] ml-2" style={{ color: "var(--color-text-secondary)" }}>
                                    terminal — contact
                                </span>
                            </div>

                            <div className="space-y-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                                {terminalHistory.map((line, i) => (
                                    <div key={i} className={line.startsWith(">") ? "text-emerald-400/70" : ""}>
                                        {line}
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleTerminalSubmit} className="mt-3 flex items-center gap-2">
                                <span className="text-emerald-400/70 text-xs">{">"}</span>
                                <input
                                    type="text"
                                    value={terminalInput}
                                    onChange={(e) => setTerminalInput(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-xs"
                                    style={{ color: "var(--color-text)" }}
                                    placeholder='contact --send "your message"'
                                />
                            </form>
                        </div>

                        {/* Social links */}
                        <div>
                            <h4
                                className="text-xs uppercase tracking-wider mb-4"
                                style={{
                                    color: "var(--color-text-secondary)",
                                    fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                }}
                            >
                                {mode === "dev" ? "// social_links" : "Find me on"}
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {socialLinks.map((social) => (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="glass-card flex items-center gap-2 px-4 py-2.5 text-xs transition-all"
                                        style={{
                                            color: "var(--color-text-secondary)",
                                            fontFamily: mode === "dev" ? "var(--font-mono)" : "inherit",
                                        }}
                                        whileHover={{
                                            scale: 1.03,
                                            borderColor: "var(--color-accent)",
                                        }}
                                    >
                                        <social.icon size={14} />
                                        {mode === "dev" ? social.devLabel : social.label}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="w-2 h-2 rounded-full bg-emerald-400"
                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                                {mode === "dev"
                                    ? "status: available_for_new_orbits"
                                    : "Available for new projects"}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
