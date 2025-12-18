"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

interface ProjectCardProps {
    title: string;
    description: string;
    image: string;
    link: string;
    tags?: string[];
}

export const ProjectCard = ({
    title,
    description,
    image,
    link,
    tags = [],
}: ProjectCardProps) => {
    return (
        <CardContainer className="inter-var group/card w-full">
            <CardBody className="bg-neutral-900 border-neutral-800 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border transition-all duration-300 hover:border-white/20">
                <div className="relative w-full h-60 mb-6 overflow-hidden rounded-lg border border-white/5">
                    <CardItem translateZ="50" className="w-full h-full">
                        <Image
                            src={image}
                            height="1000"
                            width="1000"
                            className="h-full w-full object-cover rounded-lg group-hover/card:scale-105 transition-transform duration-500 opacity-80 group-hover/card:opacity-100"
                            alt={title}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-colors duration-300" />
                        {/* Glow */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/card:opacity-100 blur-lg transition-opacity duration-300" />
                    </CardItem>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <CardItem
                            translateZ="60"
                            className="text-xl font-bold text-neutral-100"
                        >
                            {title}
                        </CardItem>

                        <CardItem
                            translateZ="50"
                            as={Link}
                            href={link}
                            target="__blank"
                            className="p-2 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
                        >
                            <ExternalLink size={16} />
                        </CardItem>
                    </div>

                    <CardItem
                        as="p"
                        translateZ="50"
                        className="text-neutral-400 text-sm mt-2 leading-relaxed line-clamp-2"
                    >
                        {description}
                    </CardItem>

                    <CardItem translateZ="40" className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-neutral-800 rounded-md text-xs text-neutral-300 border border-neutral-700"
                            >
                                {tag}
                            </span>
                        ))}
                    </CardItem>

                    <div className="mt-4 pt-4 border-t border-neutral-800">
                        <CardItem
                            translateZ={50}
                            as={Link}
                            href={link}
                            target="__blank"
                            className="group/btn flex items-center justify-center gap-2 text-sm bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors w-full"
                        >
                            View Project <ArrowRight size={14} className="group-hover/btn:-rotate-45 transition-transform" />
                        </CardItem>
                    </div>
                </div>
            </CardBody>
        </CardContainer>
    );
};
