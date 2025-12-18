"use client";
import React from "react";
import { HeroParallax } from "../ui/hero-parallax";

export function HeroParallaxSection() {
    return <HeroParallax products={products} />;
}

const actualProjects = [
    {
        title: "Unipix",
        link: "https://unipix-newton.vercel.app/",
        thumbnail: "/unipix-screenshot.png",
    },
    {
        title: "IIoT Dashboard",
        link: "https://www.sonicscape.co/",
        thumbnail: "/Industrial IoT (IIoT) Dashboard screenshot.png",
    },
];

// Duplicate projects to fill the 15-item grid requirement of HeroParallax
export const products = [
    ...actualProjects,
    ...actualProjects,
    ...actualProjects,
    ...actualProjects,
    ...actualProjects,
    ...actualProjects,
    ...actualProjects,
    actualProjects[0], // Add one more to reach 15 (2 * 7 = 14 + 1 = 15)
];
