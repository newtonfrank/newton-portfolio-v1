import React from "react";
import { ProjectCard } from "@/components/ui/project-card";

export const Projects = () => {
    const projects = [
        {
            title: "Bitnote",
            tagline: "The Ultimate Ecosystem for Modern Learners.",
            description: "Your Studies, Your AI, Your Community—All in One Place.\n\nBitNote is the comprehensive edutech platform designed to bridge the gap between resources and results. From accessing peer-shared notes and project guides to mastering complex topics with our interactive AI Tutor, BitNote centralizes your academic journey. Stay ahead with real-time university updates and global education news, all while building your knowledge base.",
            image: "/bitnote-261225.png",
            link: "#",
            tags: ["Next.js", "Strapi", "TypeScript", "Tailwind"]
        },
        {
            title: "Unipix",
            description: "Unified Free Stock Image Search Engine using Pexels, Unsplash, and Pixabay APIs. Optimizes search results through a unified interface.",
            image: "/unipix-screenshot.png",
            link: "https://unipix-newton.vercel.app/",
            tags: ["React", "API Integration", "Tailwind", "Responsive"]
        },
        {
            title: "IIoT Dashboard",
            description: "Real-time industrial monitoring dashboard processing high-frequency sensor streams via WebSockets for predictive maintenance.",
            image: "/Industrial IoT (IIoT) Dashboard screenshot.png",
            link: "https://www.sonicscape.co/",
            tags: ["React", "Data Visualization", "WebSockets", "IoT"]
        }
    ];

    return (
        <section id="projects" className="py-32 bg-black text-white relative">
            <div className="max-w-7xl mx-auto px-4 z-10 relative">
                <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
                    Selected Work
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {projects.map((project, idx) => (
                        <ProjectCard
                            key={idx}
                            title={project.title}
                            tagline={(project as any).tagline}
                            description={project.description}
                            image={project.image}
                            link={project.link}
                            tags={project.tags}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
