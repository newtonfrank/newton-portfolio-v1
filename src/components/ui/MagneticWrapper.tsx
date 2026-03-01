"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface MagneticWrapperProps {
    children: React.ReactNode;
    className?: string;
    strength?: number; // Pixels of pull (default 10)
    radius?: number; // Detection radius in pixels (default 150)
}

export function MagneticWrapper({
    children,
    className = "",
    strength = 10,
    radius = 150,
}: MagneticWrapperProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distX = e.clientX - centerX;
            const distY = e.clientY - centerY;
            const distance = Math.sqrt(distX ** 2 + distY ** 2);

            if (distance < radius) {
                const pull = (1 - distance / radius) * strength;
                setPosition({
                    x: (distX / distance) * pull,
                    y: (distY / distance) * pull,
                });
            }
        },
        [strength, radius]
    );

    const handleMouseLeave = useCallback(() => {
        setPosition({ x: 0, y: 0 });
    }, []);

    return (
        <motion.div
            ref={ref}
            className={className}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    );
}
