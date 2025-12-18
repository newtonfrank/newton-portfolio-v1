"use client";

import React, { useRef } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";
import { User, Globe, Server, Database, Code } from "lucide-react";

const Circle = React.forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:bg-black",
                className
            )}
        >
            {children}
        </div>
    );
});

Circle.displayName = "Circle";

export const Skills = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div5Ref = useRef<HTMLDivElement>(null);

    return (
        <section id="skills" className="py-20 bg-black text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
                    System Architecture
                </h2>
                <p className="text-neutral-500 mt-4">Understanding the full lifecycle of data.</p>
            </div>

            <div
                className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 p-10 md:shadow-xl max-w-5xl mx-auto"
                ref={containerRef}
            >
                <div className="flex h-full w-full flex-col items-stretch justify-between gap-10">
                    <div className="flex flex-row items-center justify-between">
                        <Circle ref={div1Ref} className="border-neutral-700">
                            <User className="text-white" />
                        </Circle>
                        <Circle ref={div5Ref} className="border-neutral-700">
                            <Database className="text-white" />
                        </Circle>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Circle ref={div2Ref} className="border-neutral-700">
                            <Code className="text-white" />
                        </Circle>
                        <Circle ref={div4Ref} className="border-neutral-700">
                            <Server className="text-white" />
                        </Circle>
                    </div>
                    <div className="flex flex-row items-center justify-center">
                        <Circle ref={div3Ref} className="border-neutral-700">
                            <Globe className="text-white" />
                        </Circle>
                    </div>
                </div>

                {/* Beams */}
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div1Ref}
                    toRef={div2Ref}
                    curvature={20}
                    pathColor="#333"
                    gradientStartColor="#0066FF"
                    gradientStopColor="#00B2FF"
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div2Ref}
                    toRef={div3Ref}
                    curvature={20}
                    pathColor="#333"
                    gradientStartColor="#00B2FF"
                    gradientStopColor="#00FF99"
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div3Ref}
                    toRef={div4Ref}
                    curvature={20}
                    pathColor="#333"
                    gradientStartColor="#00FF99"
                    gradientStopColor="#FF0055"
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div4Ref}
                    toRef={div5Ref}
                    curvature={20}
                    pathColor="#333"
                    gradientStartColor="#FF0055"
                    gradientStopColor="#FFCC00"
                />

                {/* Reverse Beams for response */}
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div5Ref}
                    toRef={div4Ref}
                    curvature={-20}
                    reverse
                    pathColor="#333"
                    gradientStartColor="#FFCC00"
                    gradientStopColor="#FF0055"
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div4Ref}
                    toRef={div3Ref}
                    curvature={-20}
                    reverse
                    pathColor="#333"
                    gradientStartColor="#FF0055"
                    gradientStopColor="#00FF99"
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div3Ref}
                    toRef={div2Ref}
                    curvature={-20}
                    reverse
                    pathColor="#333"
                    gradientStartColor="#00FF99"
                    gradientStopColor="#00B2FF"
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div2Ref}
                    toRef={div1Ref}
                    curvature={-20}
                    reverse
                    pathColor="#333"
                    gradientStartColor="#00B2FF"
                    gradientStopColor="#0066FF"
                />
            </div>
        </section>
    );
};
