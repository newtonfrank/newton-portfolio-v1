"use client";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { IconCloud } from "@/components/ui/icon-cloud";
import { cn } from "@/lib/utils";
import { Laptop, Palette, Code2, Cpu } from "lucide-react";
import Image from "next/image";

const slugs = [
    "typescript",
    "javascript",
    "react",
    "nextdotjs",
    "nodedotjs",
    "express",
    "prisma",
    "postgresql",
    "firebase",
    "nginx",
    "vercel",
    "docker",
    "git",
    "github",
    "visualstudiocode",
    "figma",
    "adobephotoshop",
    "adobeillustrator",
];

export const About = () => {
    return (
        <section id="about" className="py-20 bg-black text-white relative">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
                    The Hybrid Developer.
                </h2>
                <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[25rem]">
                    {/* Bio Cell */}
                    <BentoGridItem
                        title="Engineering & Design"
                        description="I don't just write code; I craft experiences. Bridging the gap between robust backend logic and pixel-perfect frontend design."
                        header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-tr from-neutral-900 to-neutral-800 p-4 border border-white/10" >
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2 items-center text-neutral-400">
                                    <Code2 size={16} /> <span>Full Stack Engineer</span>
                                </div>
                                <div className="flex gap-2 items-center text-neutral-400">
                                    <Palette size={16} /> <span>UI/UX Designer</span>
                                </div>
                            </div>
                        </div>}
                        className="md:col-span-1"
                        icon={<Laptop className="h-4 w-4 text-neutral-500" />}
                    />

                    {/* Tech Stack Cell - Icon Cloud */}
                    <BentoGridItem
                        title="Tech Stack"
                        description="My arsenal of tools for building modern web applications."
                        header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 border border-white/10 items-center justify-center overflow-hidden">
                            <IconCloud iconSlugs={slugs} />
                        </div>}
                        className="md:col-span-2"
                        icon={<Cpu className="h-4 w-4 text-neutral-500" />}
                    />

                    {/* Design Cell */}
                    <BentoGridItem
                        title="Design Philosophy"
                        description="Clean, Minimal, accessibility-first design."
                        header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-white/10 bg-neutral-900" />}
                        className="md:col-span-3"
                        icon={<Palette className="h-4 w-4 text-neutral-500" />}
                    />
                </BentoGrid>
            </div>
        </section>
    );
};
