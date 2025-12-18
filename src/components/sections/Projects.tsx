"use client";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { SafariMockup } from "@/components/ui/safari-mockup";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

export const Projects = () => {
    const projects = [
        {
            title: "Unipix",
            description: "Unified Free Stock Image Search Engine using Pexels, Unsplash, and Pixabay APIs.",
            image: "/unipix-screenshot.png",
            link: "https://unipix-newton.vercel.app/",
            tags: ["React", "API", "Tailwind"]
        },
        {
            title: "IIoT Dashboard",
            description: "Real-time industrial monitoring dashboard with high-frequency sensor streams.",
            image: "/Industrial IoT (IIoT) Dashboard screenshot.png",
            link: "https://www.sonicscape.co/",
            tags: ["React", "Data Viz", "WebSockets"]
        }
    ];

    return (
        <section id="projects" className="py-20 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
                    Selected Work
                </h2>
                <div className="flex flex-wrap justify-center gap-10">
                    {projects.map((project, idx) => (
                        <CardContainer key={idx} className="inter-var">
                            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                                <CardItem
                                    translateZ="50"
                                    className="text-xl font-bold text-neutral-600 dark:text-white"
                                >
                                    {project.title}
                                </CardItem>
                                <CardItem
                                    as="p"
                                    translateZ="60"
                                    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                                >
                                    {project.description}
                                </CardItem>
                                <CardItem translateZ="100" className="w-full mt-4">
                                    <SafariMockup
                                        src={project.image}
                                        url={project.link}
                                        className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl pointer-events-none"
                                    />
                                </CardItem>
                                <div className="flex justify-between items-center mt-10">
                                    <CardItem
                                        translateZ={20}
                                        as={Link}
                                        href={project.link}
                                        target="__blank"
                                        className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                                    >
                                        <div className="flex items-center gap-2">
                                            <ExternalLink size={14} /> Live Demo
                                        </div>
                                    </CardItem>
                                    <CardItem
                                        translateZ={20}
                                        as="button"
                                        className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                                    >
                                        <Github size={14} className="inline mr-1" /> GitHub
                                    </CardItem>
                                </div>
                            </CardBody>
                        </CardContainer>
                    ))}
                </div>
            </div>
        </section>
    );
};
