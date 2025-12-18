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
                    {/* Tech Stack Cell - Highlighted as 'Big Box' */}
                    <BentoGridItem
                        title="The Stack"
                        description="My arsenal of tools. I specialize in the React ecosystem, utilizing Next.js for full-stack applications and Tailwind for rapid UI development."
                        header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 border border-white/10 items-center justify-center overflow-hidden">
                            <IconCloud iconSlugs={slugs} />
                        </div>}
                        className="md:col-span-2"
                        icon={<Cpu className="h-4 w-4 text-neutral-500" />}
                    />

                    {/* Bio Cell */}
                    <BentoGridItem
                        title="Hybrid Engineer"
                        description="Bridging the gap between code and design."
                        header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 p-4 border border-neutral-800 flex flex-col justify-center gap-4" >
                            <div className="flex gap-4 items-center p-3 rounded-lg bg-white/5 border border-white/10">
                                <Code2 className="text-blue-400" size={24} />
                                <div>
                                    <h4 className="font-bold text-white">Engineering</h4>
                                    <p className="text-xs text-neutral-400">Robust, Scalable, Fast</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center p-3 rounded-lg bg-white/5 border border-white/10">
                                <Palette className="text-purple-400" size={24} />
                                <div>
                                    <h4 className="font-bold text-white">Design</h4>
                                    <p className="text-xs text-neutral-400">Clean, Modern, Accessible</p>
                                </div>
                            </div>
                        </div>}
                        className="md:col-span-1"
                        icon={<Laptop className="h-4 w-4 text-neutral-500" />}
                    />

                    {/* Philosophy Cell - Full Width */}
                    <BentoGridItem
                        title="Design Philosophy"
                        description="Minimalism isn't just an aesthetic; it's a tool for clarity. I design interfaces that are intuitive, accessible, and distraction-free."
                        header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 border border-neutral-800 p-8 flex items-center justify-center bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" >
                            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-700">Less, but better.</h3>
                        </div>}
                        className="md:col-span-3"
                        icon={<Palette className="h-4 w-4 text-neutral-500" />}
                    />
                </BentoGrid>
            </div>
        </section>
    );
};
