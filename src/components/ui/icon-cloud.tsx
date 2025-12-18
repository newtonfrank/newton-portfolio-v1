"use client";

import React, { useEffect, useState } from "react";
import { Cloud, renderSimpleIcon, ICloud } from "react-icon-cloud";

export const IconCloud = ({ iconSlugs }: { iconSlugs: string[] }) => {
    const [icons, setIcons] = useState<any>(null);

    useEffect(() => {
        // Removed unused dynamic import
    }, []);

    // Since we don't have simple-icons package and it's huge, 
    // we will use the fetch approach supported by many examples:
    // constructing the image URLs from simpleicons.org/cdn

    const renderedIcons = iconSlugs.map((slug) => {
        return renderSimpleIcon({
            icon: {
                slug: slug,
                title: slug,
                path: "", // This is the tricky part, we need paths.
                // Using image fallback is easier
                hex: "ffffff"
            },
            size: 42,
            aProps: {
                href: undefined,
                target: undefined,
                rel: undefined,
                onClick: (e: any) => e.preventDefault(),
            },
        });
    });

    // Actually, to make this robust without `simple-icons` full library:
    // we can use <img> in the cloud.
    // react-icon-cloud supports `children` that are <a> tags with <img> inside.

    return (
        <Cloud
            containerProps={{
                style: {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    paddingTop: 40,
                },
            }}
            options={{
                reverse: true,
                depth: 1,
                wheelZoom: false,
                imageScale: 2,
                activeCursor: "default",
                tooltip: "native",
                initial: [0.1, -0.1],
                clickToFront: 500,
                tooltipDelay: 0,
                outlineColour: "#0000",
                maxSpeed: 0.04,
                minSpeed: 0.02,
                // dragControl: false,
            }}
        >
            {iconSlugs.map((slug) => (
                <a key={slug} href={`https://simpleicons.org/icons/${slug}`} target="_blank" rel="noreferrer" onClick={(e) => e.preventDefault()}>
                    {/* Using cdn.simpleicons.org for easy svg access */}
                    <img
                        height="42"
                        width="42"
                        alt={slug}
                        src={`https://cdn.simpleicons.org/${slug}/${slug === "github" || slug === "nextdotjs" || slug === "vercel" ? "white" : ""}`}
                    />
                </a>
            ))}
        </Cloud>
    );
};
