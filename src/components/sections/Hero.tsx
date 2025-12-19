"use client";

import React from "react";
import { motion } from "framer-motion";

export const Hero = () => {
    return (
        <section className="h-screen flex flex-col justify-center px-4 md:px-20 bg-transparent text-white relative overflow-hidden">

            <div className="max-w-7xl w-full z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-xl md:text-2xl font-mono text-neutral-400 mb-6 tracking-widest">
                        NEWTON PORTFOLIO
                    </h2>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-6xl md:text-[8vw] font-bold leading-[0.9] tracking-tighter mb-10 mix-blend-difference"
                >
                    CREATIVE<br />
                    DEVELOPER
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="max-w-2xl text-lg md:text-2xl text-neutral-400 leading-relaxed"
                >
                    Building digital experiences with a focus on motion, interaction, and performance.
                    Merging technical precision with visual excellence.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-4 md:left-20 text-xs font-mono text-neutral-600"
            >
                SCROLL TO EXPLORE
            </motion.div>
        </section>
    );
};
