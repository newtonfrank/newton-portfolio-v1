"use client";

import React from "react";
import { motion } from "framer-motion";

export const CyberGrid = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
            {/* Horizon Fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-transparent z-10" />

            {/* Moving Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1 }}
                className="absolute inset-x-0 bottom-[-50%] h-[200%] w-full"
                style={{
                    transform: "perspective(500px) rotateX(60deg)",
                    backgroundSize: "60px 60px",
                    backgroundImage: `
                linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `
                }}
            >
                <motion.div
                    animate={{ y: [0, 60] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-full h-full"
                    style={{
                        backgroundSize: "60px 60px",
                        backgroundImage: `
                    linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
                `
                    }}
                />
            </motion.div>

            {/* Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black/10 to-transparent" />
        </div>
    );
};
