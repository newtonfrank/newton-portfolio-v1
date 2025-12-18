"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface SafariMockupProps {
    url?: string;
    src?: string;
    className?: string;
}

export const SafariMockup = ({
    url = "https://example.com",
    src,
    className,
}: SafariMockupProps) => {
    return (
        <div
            className={cn(
                "relative rounded-xl border bg-gray-100 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 shadow-2xl overflow-hidden",
                className
            )}
        >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex justify-center px-4">
                    <div className="w-full max-w-md bg-gray-100 dark:bg-neutral-800 rounded-md py-1 px-3 text-xs text-center text-gray-400 font-mono truncate">
                        {url}
                    </div>
                </div>
            </div>
            <div className="relative w-full aspect-video bg-white dark:bg-neutral-950">
                {src && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="Safari Mockup" className="object-cover w-full h-full" />
                )}
            </div>
        </div>
    );
};
