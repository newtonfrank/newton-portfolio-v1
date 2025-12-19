"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Radio, FileText, CheckCircle, AlertCircle } from "lucide-react";

export const TransmissionForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        // For now, just log the data - integrate with actual endpoint later
        console.log("Transmission Data:", formData);

        // Simulate success
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });

        // Reset status after 3 seconds
        setTimeout(() => setStatus("idle"), 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="group">
                    <label className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-2">
                        <User className="w-3 h-3" />
                        TARGET_IDENTITY
                    </label>
                    <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-cyan-500 font-mono text-sm">&gt;</span>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter name..."
                            className="w-full bg-transparent border-b border-white/20 py-3 pl-6 pr-4 text-white font-mono text-sm md:text-base placeholder-neutral-600 focus:border-cyan-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div className="group">
                    <label className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-2">
                        <Radio className="w-3 h-3" />
                        FREQUENCY
                    </label>
                    <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-cyan-500 font-mono text-sm">&gt;</span>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email address..."
                            className="w-full bg-transparent border-b border-white/20 py-3 pl-6 pr-4 text-white font-mono text-sm md:text-base placeholder-neutral-600 focus:border-cyan-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Message Input */}
                <div className="group">
                    <label className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-2">
                        <FileText className="w-3 h-3" />
                        DATA_PACKET
                    </label>
                    <div className="relative">
                        <span className="absolute left-0 top-3 text-cyan-500 font-mono text-sm">&gt;</span>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Enter message payload..."
                            className="w-full bg-transparent border-b border-white/20 py-3 pl-6 pr-4 text-white font-mono text-sm md:text-base placeholder-neutral-600 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={status === "sending" || status === "success"}
                    whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
                    whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
                    className={`w-full py-4 flex items-center justify-center gap-3 font-mono text-sm tracking-widest border rounded-lg transition-all duration-300
                        ${status === "idle"
                            ? "bg-transparent border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
                            : status === "sending"
                                ? "bg-cyan-900/20 border-cyan-500/30 text-cyan-500 cursor-wait"
                                : status === "success"
                                    ? "bg-green-900/20 border-green-500/50 text-green-400"
                                    : "bg-red-900/20 border-red-500/50 text-red-400"
                        }`}
                >
                    {status === "idle" && (
                        <>
                            <Send className="w-4 h-4" />
                            INITIATE UPLINK
                        </>
                    )}
                    {status === "sending" && (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full"
                            />
                            TRANSMITTING...
                        </>
                    )}
                    {status === "success" && (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            TRANSMISSION COMPLETE
                        </>
                    )}
                    {status === "error" && (
                        <>
                            <AlertCircle className="w-4 h-4" />
                            TRANSMISSION FAILED
                        </>
                    )}
                </motion.button>

                {/* Status Messages */}
                {status === "success" && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-xs font-mono text-green-400"
                    >
                        &gt; Message received. I'll respond within 24-48 hours.
                    </motion.p>
                )}
            </form>
        </motion.div>
    );
};
