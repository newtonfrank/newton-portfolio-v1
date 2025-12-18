"use client";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
    return (
        <AuroraBackground className="bg-black text-white">
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative flex flex-col gap-4 items-center justify-center px-4"
            >
                <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
                    Creative Developer <br /> & Designer
                </div>
                <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
                    Building digital experiences that feel alive.
                </div>

                <MagneticButton className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-black bg-white rounded-full overflow-hidden transition-all duration-300 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 z-50 cursor-pointer">
                    <a href="#projects" className="flex items-center gap-2">
                        View My Work
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                </MagneticButton>
            </motion.div>
        </AuroraBackground>
    );
};
