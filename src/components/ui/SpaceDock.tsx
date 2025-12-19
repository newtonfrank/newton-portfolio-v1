"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Home, Folder, Cpu, User, Mail } from "lucide-react";
import Link from "next/link";

const LINKS = [
    { id: "home", icon: <Home size={20} />, href: "#" },
    { id: "projects", icon: <Folder size={20} />, href: "#projects" },
    { id: "system", icon: <Cpu size={20} />, href: "#skills" },
    { id: "about", icon: <User size={20} />, href: "#about" },
    { id: "contact", icon: <Mail size={20} />, href: "mailto:newtonfrank@outlook.in" },
];

export const SpaceDock = () => {
    const mouseX = useMotionValue(Infinity);

    return (
        <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-end gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
        >
            {LINKS.map((link) => (
                <DockIcon key={link.id} mouseX={mouseX} icon={link.icon} href={link.href} />
            ))}
        </div>
    );
};

function DockIcon({ mouseX, icon, href }: { mouseX: any, icon: any, href: string }) {
    const ref = React.useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className="aspect-square rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center relative group hover:bg-neutral-800 transition-colors"
        >
            <Link href={href} className="w-full h-full flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                <motion.div style={{ scale: useTransform(width, [40, 80], [1, 1.5]) }}>
                    {icon}
                </motion.div>
            </Link>
        </motion.div>
    );
}
