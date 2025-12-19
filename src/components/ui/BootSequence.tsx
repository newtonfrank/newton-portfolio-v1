"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Boot sequence lines with timing
const bootLines = [
    { text: "> SYSTEM_BOOT_SEQUENCE_INIT", delay: 0 },
    { text: "> LOADING_KERNEL...", delay: 400 },
    { text: "  [OK] Kernel loaded", delay: 800, isSuccess: true },
    { text: "> MOUNTING_UI_MODULES...", delay: 1200 },
    { text: "  [OK] React.js mounted", delay: 1500, isSuccess: true },
    { text: "  [OK] Next.js configured", delay: 1700, isSuccess: true },
    { text: "> INITIALIZING_GRAPHICS_ENGINE...", delay: 2000 },
    { text: "  [OK] WebGL ready", delay: 2300, isSuccess: true },
    { text: "> VERIFYING_CREDENTIALS...", delay: 2600 },
    { text: "  [VERIFIED] Access granted", delay: 2900, isSuccess: true },
    { text: "", delay: 3200 },
    { text: "> WELCOME_OPERATOR", delay: 3400, isHighlight: true },
];

export const BootSequence = () => {
    const [visibleLines, setVisibleLines] = useState<typeof bootLines>([]);
    const [isBooting, setIsBooting] = useState(true);
    const [showCursor, setShowCursor] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Use useLayoutEffect for synchronous scroll lock before paint
    useLayoutEffect(() => {
        const hasBooted = sessionStorage.getItem("hasBooted");
        if (hasBooted) {
            setIsBooting(false);
            return;
        }

        // Lock scroll on both html and body for maximum compatibility
        const html = document.documentElement;
        const body = document.body;

        // Store original values
        const originalHtmlOverflow = html.style.overflow;
        const originalBodyOverflow = body.style.overflow;
        const originalHtmlPosition = html.style.position;
        const originalBodyPosition = body.style.position;

        // Lock everything
        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
        html.style.position = 'fixed';
        html.style.top = '0';
        html.style.left = '0';
        html.style.right = '0';
        body.style.position = 'fixed';
        body.style.top = '0';
        body.style.left = '0';
        body.style.right = '0';

        // Force scroll to top
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        // Stream lines one by one
        bootLines.forEach((line, index) => {
            setTimeout(() => {
                setVisibleLines(prev => [...prev, line]);
            }, line.delay);
        });

        // End boot sequence
        const totalDuration = bootLines[bootLines.length - 1].delay + 800;
        setTimeout(() => {
            setIsBooting(false);
            sessionStorage.setItem("hasBooted", "true");

            // Restore original values
            html.style.overflow = originalHtmlOverflow;
            body.style.overflow = originalBodyOverflow;
            html.style.position = originalHtmlPosition;
            html.style.top = '';
            html.style.left = '';
            html.style.right = '';
            body.style.position = originalBodyPosition;
            body.style.top = '';
            body.style.left = '';
            body.style.right = '';

            // Final scroll to top
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, totalDuration);

        return () => {
            html.style.overflow = originalHtmlOverflow;
            body.style.overflow = originalBodyOverflow;
            html.style.position = originalHtmlPosition;
            html.style.top = '';
            html.style.left = '';
            html.style.right = '';
            body.style.position = originalBodyPosition;
            body.style.top = '';
            body.style.left = '';
            body.style.right = '';
        };
    }, []);

    // Blinking cursor effect
    useEffect(() => {
        if (!isBooting) return;
        const interval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, [isBooting]);

    // Auto-scroll to bottom as new lines appear
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [visibleLines]);

    if (!isBooting) return null;

    return (
        <AnimatePresence>
            {isBooting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                    transition={{ duration: 0.6 }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono text-sm md:text-base"
                >
                    {/* CRT scanline overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />

                    {/* Terminal container */}
                    <div
                        ref={containerRef}
                        className="w-full max-w-2xl h-[60vh] p-6 md:p-10 overflow-y-auto scrollbar-hide"
                    >
                        <div className="space-y-1">
                            {visibleLines.map((line, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className={`flex items-center ${line.isSuccess ? 'text-green-500' :
                                            line.isHighlight ? 'text-cyan-400 font-bold mt-4' :
                                                'text-cyan-500'
                                        }`}
                                >
                                    {line.text}
                                    {/* Show blinking cursor on last line */}
                                    {index === visibleLines.length - 1 && showCursor && (
                                        <span className="ml-1 text-cyan-400">_</span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64">
                        <div className="h-1 bg-cyan-900/30 w-full overflow-hidden rounded-full">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-500 to-green-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3.5, ease: "easeOut" }}
                            />
                        </div>
                        <p className="text-center text-xs text-neutral-600 mt-2 font-mono">
                            NEWTON_OS v2.0
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


