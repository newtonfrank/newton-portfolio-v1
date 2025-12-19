"use client";

import React from "react";
import { GitHubCalendar } from "react-github-calendar";
import { motion } from "framer-motion";
import Link from "next/link";

// Custom theme for the GitHub calendar
const customTheme = {
    dark: [
        '#161b22', // level 0 (empty)
        '#0e4429', // level 1
        '#006d32', // level 2
        '#26a641', // level 3
        '#39d353', // level 4 (high activity - neon green)
    ]
};

interface GitHubActivityProps {
    username?: string;
}

export const GitHubActivity = ({ username = "newtonfrank" }: GitHubActivityProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <span className="text-cyan-500 font-mono text-xs md:text-sm">// SYSTEM_ACTIVITY_LOG</span>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
            </div>

            {/* Calendar Container */}
            <div
                className="p-4 md:p-6 border border-white/10 rounded-xl backdrop-blur-sm flex justify-center
                    hover:border-green-500/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] transition-all duration-500 overflow-x-auto scrollbar-hide"
            >
                <GitHubCalendar
                    username={username}
                    theme={customTheme}
                    colorScheme="dark"
                    fontSize={11}
                    blockSize={10}
                    blockMargin={3}
                    labels={{
                        totalCount: "{{count}} contributions this year",
                    }}
                    style={{
                        color: '#9ca3af',
                    }}
                />
            </div>

            {/* Footer Label */}
            <div className="mt-3 flex items-center justify-between text-[10px] md:text-xs font-mono text-neutral-600">
                <Link
                    href={`https://github.com/${username}`}
                    target="_blank"
                    className="hover:text-green-400 transition-colors"
                >
                    &gt; github.com/{username}
                </Link>
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-sm bg-[#39d353]" />
                    HIGH ACTIVITY
                </span>
            </div>
        </motion.div>
    );
};

