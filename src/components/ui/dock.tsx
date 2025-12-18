"use client";

import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import React from 'react';

export const Dock = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto flex h-16 gap-4 items-end rounded-2xl bg-gray-50 dark:bg-neutral-900 px-4 pb-3",
                className
            )}
        >
            {React.Children.map(children, (child: any) =>
                React.cloneElement(child, { mouseX: mouseX })
            )}
        </motion.div>
    );
};

export const DockIcon = ({
    magnification = 60,
    distance = 140,
    mouseX,
    className,
    children,
    ...props
}: {
    magnification?: number;
    distance?: number;
    mouseX?: MotionValue;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const distanceCalc = useTransform(mouseX as MotionValue, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

        return val - bounds.x - bounds.width / 2;
    });

    let widthSync = useTransform(
        distanceCalc,
        [-distance, 0, distance],
        [40, magnification, 40]
    );

    let width = useSpring(widthSync, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className={cn(
                "flex aspect-square cursor-pointer items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
